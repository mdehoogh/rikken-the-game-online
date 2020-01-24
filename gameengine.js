// server-side game engine
const Card=require('./public/javascripts/Card.js');
const {CardHolder,HoldableCard}=require('./public/javascripts/CardHolder.js');
const {PlayerEventListener,PlayerGame,Player}=require('./public/javascripts/Player.js'); // the player class we'll be extending...
const {RikkenTheGameEventListener,Trick,RikkenTheGame}=require('./public/javascripts/RikkenTheGame.js'); // the (original) RikkenTheGame that we extend here

module.exports=(socket_io_server,gamesListener,acknowledgmentRequired)=>{

    // keep a queue of logged messages during the time the user is inspecting events
    var loggedMessages=[];
    var loggedEvents=[]; // a log of all the events sent and received
    var inspectingEvents=0; // how many games are inspecting events

    // be able to request all the events exchanged between two parties in the proper order
    function getExchangedEvents(one,another){
        console.log("Extracting the events exchanged between '"+one+"' and '"+another+"' from a total of "+loggedEvents.length+" events...");
        let exchangedEvents=loggedEvents.filter(
            (loggedEvent)=>{
                return(loggedEvent[2]===one&&loggedEvent[3]===another)||(loggedEvent[2]===another&&loggedEvent[3]===one);
            });
        console.log("\tNumber of exchanged events: "+exchangedEvents.length+".");
        return exchangedEvents;
    }
    
    // the following methods we already had and we updated them to accomodate for event inspection by the user
    function gameEngineLog(tolog){
        if(inspectingEvents>0)loggedMessages.push(tolog);else console.log("GAME ENGINE >>> "+tolog);
    }

    function logEvent(from,to,id,event,data){
        let loggedEvent=[id,from,to,event,JSON.stringify(data)];loggedEvent.unshift(loggedEvents.push(loggedEvent)); // MDH@24JAN2020: push the event on the queue
        gameEngineLog(from+" sending event #"+id+":"+event+" with data "+JSON.stringify(data)+" to "+to+".");
        // if we have an id put the data in the payload, and the id in the id attribute
        return (id?[event,{'id':id,'payload':data}]:[event,data]);
    }

    function logReceivedEvent(from,to,event,data){
        let loggedEvent=["",from,to,event,data];loggedEvent.unshift(loggedEvents.push(loggedEvent)); // MDH@24JAN2020: push the event on the queue
        gameEngineLog("Event "+event+" received by "+to+" from "+from+" with data "+JSON.stringify(data)+".");
        return data;
    }

    function getCardsInfo(cardHolder){
        let cardsInfo=[];cardHolder._cards.forEach((card)=>{cardsInfo.push([card.suite,card.rank]);});return cardsInfo;
    } 
    function getTrickInfo(trick){
        // TODO we'd probably have to send more information from the trick DONE
        // TODO should we use the trick getters instead???????
        // at a minimum send the constructor information over
        let trickInfo={
            firstPlayer:trick._firstPlayer,
            trumpSuite:trick._trumpSuite,
            partnerSuite:trick._partnerSuite,
            partnerRank:trick._partnerRank,
            canAskForPartnerCard:trick._canAskForPartnerCard,
        };
        if(trick.numberOfCards>0){
            trickInfo.winner=trick._winner;
            trickInfo.playSuite=trick._playSuite;
            trickInfo.cards=getCardsInfo(trick);
            trickInfo.askingForPartnerCard=trick._askingForPartnerCard;
        }else // no cards but put an empty array in there just the same!!
            trickInfo.cards=[];
        return trickInfo;
        /* replacing:
        return {
            firstPlayer:trick.firstPlayer,
            canAskForPartnerCard:trick.canAskForPartnerCard,
            cards:getCardsInfo(trick),
            winner:trick.winner,
            playSuite:trick.playSuite,
            askingForPartnerCard:trick.askingForPartnerCard
        };*/
    }
    function getTricksInfo(tricks){return tricks.map((trick)=>getTrickInfo(trick));}

    // MDH@14JAN2020 (day 31): I want to ascertain receipt at the other end
    class SendEvent{
        constructor(id,from,to,event,data,sendInterval){
            this._from=from;
            this._to=to;
            this._event=event;
            this._data=data;
            this._id=id;
            this._sendInterval=(this._id?sendInterval:null); // only allow resending when an id is attached!!!
            this._sendAfter=0;
        }
        // we do not need a client until we actually send the event!!!!!
        sendto(client){
            let result=false;
            try{
                if(client){
                    gameEngineLog("Sending acknowledgeable event "+this._event+".");
                    // send with an ack function at the end
                    let sendEventData=logEvent(this._from,this._to,this._id,this._event,this._data);
                    // send over to client (if the event data has an id it will be acknowledged)
                    client.emit(sendEventData[0],sendEventData[1]);
                    result=true; // ESSENTIAL BRO'     
                }
            }catch(err){
                gameEngineLog("ERROR: '"+err.message+"' trying to send event "+this._event+".");
            }
            return result;
        }
    }

    var remotePlayers=[]; // keep a list of remote players

    // MDH@15JAN2020: instead of keeping track of the events to send we call the tick() of all remote players
    class Clock{
        constructor(interval){
            this._interval=interval;
            this._intervalId=null;
        }
        tick(){
            if(remotePlayers)remotePlayers.forEach((remotePlayer)=>{remotePlayer.tick();});
        }
        stop(){
            if(this._intervalId){clearInterval(this._intervalId);this._intervalId=null;}
        }
        start(){
            this.stop();
            if(this._interval&&this._interval>0)
                this._intervalId=setInterval(this.tick,this._interval);
            return this;              
        }
    }
    // we can run a clock for ticking
    var clock=null;

    /* replacing:
    var sendEventQueue=[]; // keep a send event queue
    // sendEvents should be executed every second using 
    function sendEventQueueProcessor(){
         // decrement the _sendAfter counter by 1 for all events to send when positive
        let sendEventIndex=sendEventQueue.length;
        gameEngineLog("Processing "+sendEventIndex+" send events.");
        while(--sendEventIndex>=0){
            let sendEvent=sendEventQueue[sendEventIndex];
            if(sendEvent._sendAfter>0){
                sendEvent._sendAfter--;
                // send the event when _sendAfter reached zero
                if(sendEvent._sendAfter===0)sendEvent.send();
            }else
            if(sendEvent._sendAfter<0) // acknowledged so no longer need to be sent!!!!
                sendEventQueue.splice(sendEventIndex,1);
        }
    }
    var sendEventIntervalId=null;
    function stopSendingEvents(){
        if(sendEventIntervalId){clearInterval(sendEventIntervalId);sendEventIntervalId=null;}
    }
    function startSendingEvents(){
        stopSendingEvents();
        sendEventIntervalId=setInterval(sendEventQueueProcessor,1000);
    }
    */

    // a RemotePlayer represents a remote player
    class RemotePlayer extends Player{

        // events sent with an id will be acknowledged
        static UNIQUE_EVENT_ID=0; // keep a counter of event Ids
        static getUniqueEventId(){
            return(++RemotePlayer.UNIQUE_EVENT_ID);
        }

        constructor(client){
            super(null); // for now nameless
            this._pendingEvents=[]; // keep track of all pending events
            this._unacknowledgedEvents=[]; // keep track of all unacknowledged events
            this._client=client;
        }

        // expose pending events TODO we might clone them though
        getPendingEvents(){return this._pendingEvents;}

        // _sendPendingEvents will send any events that couldn't be send due to missing client
        _sendPendingEvents(){
            if(this._unacknowledgedEvents.length>0)return; // can't send while waiting for event acknowledgements
            // what if the client disappears while sending? we wouldn't want that now would we?????
            while(this._pendingEvents.length>0&&this._pendingEvents[0].sendto(this._client)){
                // if the event has an id it needs to be acknowledged BEFORE it can be removed
                // if not it can be removed immediately!!!!!
                // if we fail to send the pending event we break (can only happen when the client is now null)
                let pendingEvent=this._pendingEvents.shift();
                // until the event is acknowledged, we're going to resend it if need be!!!!
                if(pendingEvent.id)this._unacknowledgedEvents.push(pendingEvent);
            }
        }

        // MDH@15JAN2020: tick() should be called on EVERY registered remote player
        //                by the main ticker for every lapsed 'second', so it can update the
        //                _sendAfter counter on every sent event waiting to be acknowledged
        tick(){
            // decrement the resend interval counter on every event not acknowledged yet
            // and resend it when the counter is zero
            // NOTE we might not have a client to resend though, in which case we leave the counter at zero
            //      and resend asap
            gameEngineLog("Player "+this.name+" responding to clock tick!");
            let unacknowledgedEventIndex=this._unacknowledgedEvents.length;
            while(--unacknowledgedEventIndex>=0){
                let unacknowledgedEvent=this._unacknowlegdedEvents[unacknowledgedEventIndex];
                if(unacknowledgedEvent._sendAfter>0)pendingEvent._sendAfter--;
                // send when zero, if succeeded reset send after count!!!!
                if(unacknowledgedEvent._sendAfter===0)
                    if(unacknowledgedEvent.sendto(this._client))
                        unacknowledgedEvent._sendAfter=unacknowledgedEvent._sendInterval;
            }
        }

        // call eventsAcknowledged with the received event ids
        eventsAcknowledged(acknowledgedEventIds){
            // remove all the pending events with those ids
            // BUT those should be at the beginning, not per se
            let someEventsAcknowledged=false;
            let unacknowledgedEventIndex=-1;
            while(++unacknowledgedEventIndex<this._unacknowledgedEvents.length){
                let unacknowledgedEventId=this._unacknowledgedEvents[unacknowledgedEventIndex].id;
                // is this an event not yet aknownledged
                let acknowledgedEventIdIndex=acknowledgedEventIds.indexOf(unacknowledgedEventId);
                if(acknowledgedEventIdIndex<0)continue; 
                // yes, an acknowledged event!!!!
                someEventsAcknowledged=true;
                this._unacknowledgedEvents.splice(unacknowledgedEventIndex,1); // remove from pending events
                acknowledgedEventIds.splice(acknowledgedEventIdIndex,1);
                if(acknowledgedEventIds.length===0)break; // no acknowledged event ids left, done
            }
            // when events have been removed, new events could be ready for sending...
            if(someEventsAcknowledged)this._sendPendingEvents();
        }

        addPendingEvents(pendingEvents){
            // append all received pending events
            if(pendingEvents&&pendingEvents.length>0){
                this._unacknowledgedEvents.length=0; // force send the pending events!!!!
                this._pendingEvents.push(...pendingEvents);
            }
            this._sendPendingEvents();
        }
        
        _sendNewEvent(event,data,sendInterval){
            // if we fail to append the new event
            let numberOfPendingEvents=this._pendingEvents.length;
            let interval=(typeof sendInterval==='number'&&sendInterval>0?sendInterval:null);
            // MDH@24JAN2020: prepending the name of the game (sender) as the from and name of the player as the to (destination)
            let sendEvent=new SendEvent((interval?RemotePlayer.getUniqueEventId():null),"GAME\t"+this.game.name,"PLAYER\t"+this.name,event,data,interval);
            // if we succeed in sending the event when it is not supposed to get acknowledged, no need to store in the pending event queue
            if(!interval){
                if(sendEvent.sendto(this._client)){
                    gameEngineLog("WARNING: Event "+event+" sent immediately i.e. not queued!");
                    return true;
                }
                gameEngineLog("ERROR: Failed to send event "+event+" immediately! Will be queued subsequently.");
            }
            if(this._pendingEvents.push(sendEvent)<=numberOfPendingEvents)return false;
            this._sendPendingEvents(); // try to send some pending events now
            return true;
        }

        get client(){return this._client;}
        set client(client){
            this._client=client;
            this._sendPendingEvents(); // send any pending events we have
        }

        get status(){
            return this.client?(this.game?"PLAYING":"IDLE"):(this.game?"*** BROKEN LINK ***":"DISCONNECTED");
        }

        getInfo(defaultName){return (this.name||defaultName)+":"+this.status;}

        // if the game sets the partner (index) we need to send it over
        set partner(partner){
            super.partner=partner;
            // send the partner over...
            this._sendNewEvent('PARTNER',this._partner,2);
        } // to set the partner once the partner suite/rank card is in the trick!!!!

        /*
        get userId(){return this._userId;}
        set userId(userId){
            if(this._userId)return; // can only be set once!!!
            this._userId=userId;
        }
        */
        /*
        get wantsToPlay(){return this._wantsToPlay;}
        set wantsToPlay(wantsToPlay){
            // if the player is in a game right now the game should be canceled!!!!
            if(!wantsToPlay&&this._game)gameOver(this.tableId,true);
            this._wantsToPlay=wantsToPlay;
        }
        */
        // the tableId is a bit of an issue because the table id should not be set until the player is registered with a game
        // essentially we could get it from the game (if any)
        get tableId(){return (this._game?this._game._tableId:null);}
        /*
        set tableId(tableId){
            // can only play at a table when the user id is set
            if(tableId&&!this._userId)return;
            // distinguish between leaving or joining a table
            if(tableId){
                if(tableId.length>0){ 
                    if(this._tableId&&this.tableId.length>0){gameEngineLog(Can only play in one game at a time!");return;}
                    this._tableId=tableId;
                    this._client.send('TABLE='+this._tableId); // send the table id on the general channel
                }else{ // leaving
                    if(!this._tableId||this._tableId.length==0){gameEngineLog(Can't leave a game I'm not playing!");return;} // 
                    this._tableId=tableId;
                    this._client.send("NOTABLE");
                }
            }
        }
        */

        _getPlayerInfo(){
            let cardsInfo=getCardsInfo(this);
            return{cards:cardsInfo,numberOfTricksWon:this.numberOfTricksWon,numberOfTricksToWin:this.numberOfTricksToWin};
        }

        sendCards(){
            gameEngineLog("Sending cards to client of remote player "+(this.name?this.name:"?")+".");
            this._sendNewEvent('CARDS',getCardsInfo(this),5);
        }

        // copied over from OnlinePlayer() in main.js 
        // METHODS CALLED BY THE GAME
        makeABid(playerBidObjects,possibleBids){
            this._sendNewEvent('MAKE_A_BID',{'playerBidObjects':playerBidObjects,'possibleBids':possibleBids},5);
        }
        chooseTrumpSuite(suites){
            this._sendNewEvent('CHOOSE_TRUMP_SUITE',suites,10);
        }
        choosePartnerSuite(suites,partnerRankName){
            this._sendNewEvent('CHOOSE_PARTNER_SUITE',{'suites':suites,'partnerRankName':partnerRankName},10);
        }
        // almost the same as the replaced version except we now want to receive the trick itself
        playACard(trick){
            // MDH@20JAN2020: this is a nuisance though
            if(trick&&trick.numberOfCards===0){
                if(this._game){
                    gameEngineLog(">>>>>>>>>>>>>> Start of a new trick!");
                    this._game.sendNewTrickEvent();
                }else
                    gameEngineLog(">>>>>>>>>>>>>> ERROR: No game to play a trick in!");
            }/*else gameEngineLog(">>>>>>>>>>>>>>>>> Not a new trick!");*/
            this._game.sendNewPlayerEvent(); // ask the game to send who's playing next
            // MDH@13JAN2020: let's send player info over before asking for the card to play
            this._sendNewEvent('PLAYER_INFO',this._getPlayerInfo(),5);
            // can we send all the trick information this way??????? I guess not
            // MDH@18JAN2020: instead of sending the trick info with PLAY_A_CARD
            //                we send it after each card that is played!!
            this._sendNewEvent('PLAY_A_CARD',null,30); // replacing: getTrickInfo(trick),10);
        }

        setNumberOfTricksToWin(numberOfTricksToWin){
            super.setNumberOfTricksToWin(numberOfTricksToWin);
            // send the number of tricks to win over
            this._sendNewEvent('TRICKS_TO_WIN',this.numberOfTricksToWin,5);
        }
        // END METHODS CALLED BY THE GAME
        // METHODS CALLED BY THE PLAYER ITSELF TO BE PASSED ON TO THE GAME
        // not to be confused with _cardPlayed() defined in the base class Player which informs the game
        // NOTE cardPlayed is a good point for checking the validity of the card played
        // NOTE can't use _cardPlayed (see Player superclass)
        /* this method will be called on the other end, (and wouldn't work on this end)
        _cardPlayedWithSuiteAndIndex(suite,index){
            let card=(suite<this._suiteCards.length&&this._suiteCards[suite].length?this._suiteCards[suite][index]:null);
            if(card){
                // TODO checking should NOT be done by the player BUT by the trick itself!!!
                // BUG FIX: do NOT do the following here, but only at the start of a trick, or NOT at all!!!!!
                ////////////this._trick.askingForPartnerCard=0; // -1 when asking blind, 0 not asking, 1 if asking
                // CAN'T call _setCard (in base class Player) if the card cannot be played!!!
                if(this._trick.numberOfCards==0){ // first card in the trick played
                    // theoretically the card can be played but it might be the card with which the partner card is asked!!
                    // is this a game where there's a partner card that hasn't been played yet
                    // alternatively put: should there be a partner and there isn't one yet?????
                    if(this._game.getTrumpPlayer()==this._index){ // this is trump player playing the first card
                        gameEngineLog("******************************************************");
                        gameEngineLog(">>>> CHECKING WHETHER ASKING FOR THE PARTNER CARD <<<<");
                        // can the trump player ask for the partner card blind
                        // which means that the trump player does not have 
                        if(this._trick.canAskForPartnerCard>0){ // non-blind
                            // TODO should be detected by the game preferably
                            if(suite==this._game.getPartnerSuite()){
                                this._trick.askingForPartnerCard=1;
                                ////alert("\tNON_BLIND");
                            }
                        }else
                        if(this._trick.canAskForPartnerCard<0){ // could be blind
                            // if the checkbox is still set i.e. the user didn't uncheck it
                            // he will be asking for the 
                            if(document.getElementById("ask-partner-card-blind").checked&&
                                (suite!=this._game.getTrumpSuite()||confirm("Wilt U de "+DUTCH_SUITE_NAMES[this._game.getPartnerSuite()]+" "+DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" (blind) vragen met een troef?"))){
                                this._trick.askingForPartnerCard=-1; // yes, asking blind!!
                                /////alert("\tBLIND!");
                            }
                        };
                    }
                }else{ // not the first card in the trick played
                    // the card needs to be the same suite as the play suite (if the player has any)
                    if(suite!==this._trick.playSuite&&this.getNumberOfCardsWithSuite(this._trick.playSuite)>0){
                        alert("Je kunt "+card.getTextRepresentation()+" niet spelen, want "+DUTCH_SUITE_NAMES[this._trick.playSuite]+" is gevraagd.");
                        return;
                    }
                    // when being asked for the partner card that would be the card to play!
                    if(this._trick.askingForPartnerCard!=0){
                        let partnerSuite=this._game.getPartnerSuite(),partnerRank=this._game.getPartnerRank();
                        if(this.containsCard(partnerSuite,partnerRank)){
                            if(card.suite!=partnerSuite||card.rank!=partnerRank){
                                alert("Je kunt "+card.getTextRepresentation()+" niet spelen, want de "+DUTCH_SUITE_NAMES[partnerSuite]+" "+DUTCH_RANK_NAMES[partnerRank]+" is gevraagd.");
                                return;
                            }
                        }
                    }
                }
                this._setCard(card);
            }else
                alert("Invalid card suite "+String(suite)+" and suite index "+String(index)+".");
        }
        */
        /*
        // playing a game means setting this._game (no need to actually know it here), and index which the client should know!!!
        playsTheGameAtIndex(game,index){
            super.playsTheGameAtIndex(game,index); // will set the game and the index of this player
            // inform the 'client' i.e. the remote player at the other end the id of the game and the player names            if(!this._gameId)return false;
            let gameId=(this._game?this._game.tableId:null);
            console.log("Player '"+this.name+"' will play in game '"+gameId+"' as player #"+(this._index+1)+".");
            // I suppose that if we move this call to _gameInitialized() in RikkenTheGame it is ok to send both
            // send the game id and the player names to the remote player!!!
            this.client.emit('GAME',gameId);
            this.client.emit('PLAYERS',this._game.getPlayerNames()});
            // we could send the game table id (room over), and the index in playing the game
            // when this happens the client can move over to the game panel showing the name of the game being played
            // here the client can display the state of the game until a bid request is received
            // general game information is send to the client in this room by the game, so should I join here????
            // NOTE technically we could wait for the client requesting to be added to a room but as we already
            //      know the room the client is joining we can do it here!!
        }
        */
        joinGame(){
            if(this.tableId){
                gameEngineLog("Player "+this.userId+" joining "+this.tableId+".");
                this._client.join(this.tableId,(err)=>{
                    if(err)
                        gameEngineLog("ERROR: Failed to make player join a game: "+err.toString()+".");
                });
            }else
                gameEngineLog("ERROR: No game to join!");
        }
    }
    
    // we need to RikkenTheGameServer to send certain data to all its player clients e.g. when the state changes
    // so it subclasses RikkenTheGame 
    // MDH@09JAN2020: let's remove the methods that are already doing there thing in RikkenTheGame!!!
    class RikkenTheGameServer extends RikkenTheGame{

        getEvents(){
            inspectingEvents++; // from now on all logged messages will not be shown
            // we want to return all events exchanged with any of it's players
            let playerEvents={};
            this._players.forEach((player)=>{playerEvents[player.name]=getExchangedEvents("GAME\t"+this.name,"PLAYER\t"+player.name);});
            return playerEvents;
        }
        doneInspectingEvents(){
            if(inspectingEvents>0)inspectingEvents--;
            if(inspectingEvents>0)return false; // not all events inspected...
            while(loggedMessages.length>0)gameEngineLog(loggedMessages.shift());
            return true;
        }

        registerPlayerEvent(playerName,type,event,data){
            let playerEvent=[new Date().toISOString(),type,event,data];
            // prepending the player event with it's position in the player events queue
            playerEvent.unshift(this._playerEvents[playerName].push(playerEvent));
        }
        // MDH@24JAN2020: END player event registration

        // MDH@07JAN2020: I've adapted the super constructor in such a way that you need to call start() to make it start
        //                that way we can set the _tableId before the game tries to reach the IDLE state
        //                and initialize the game by telling each player what game it will be playing and at what position
        constructor(tableId,players){
            super(players,null);
            // keep track of ALL player events (IN and OUT)
            this._logMessageQueue=[];this._playerEvents=[];this._players.forEach((player)=>{this._playerEvents[player.name]=[];});
            console.log("Players registered!");
            this._tableId=tableId;
            // now we're to wait for somebody to start the game
        }

        get name(){return this._tableId;} // convenience getter

        // here we have all the methods from RikkenTheGame that we override with additional behaviour on top
        // of the original one, so every method calls it's super method
        // called when RikkenTheGame moves into the IDLE state

        sendToAllPlayers(event,data){
            gameEngineLog("Game "+this.name+" sending event "+event+" with data "+JSON.stringify(data)+" to all players.");
            // MDH@15JAN2020: I believe now it's best to simply send it to all players directly
            //                so the event will be acknowledged!!!!
            this._players.forEach((player)=>{player._sendNewEvent(event,data,5);});
            /* replacing sending the given event to all players through the 'room' they are in
            socket_io_server.to(this._tableId).emit(...logEvent(this._tableId,"to all players",event,data));
            */
        }

        // MDH@20JAN2020: whenever a new trick starts, we're going to send
        //                additional information about the trick so the
        //                receiver can instantiate a new trick
        sendNewTrickEvent(){
            // we're going to send additional information about the new trick
            gameEngineLog("******* Sending the new trick event! ************");
            // MDH@19JAN2020: adding whether or not the first player can play spades
            this.sendToAllPlayers('NEW_TRICK',
                {
                    index:this.numberOfTricksPlayed+1,
                    firstPlayer:this._trick._firstPlayer,
                    canAskForPartnerCard:this._trick._canAskForPartnerCard,
                    firstPlayerCanPlaySpades:this._trick._firstPlayerCanPlaySpades
                });
        }
        sendNewPlayerEvent(){
            this.sendToAllPlayers('TO_PLAY',this._players[this._player].name);
        }
        sendBidMadeEvent(player,bid){
            gameEngineLog("Sending bid "+bid+" of player #"+player+" to all players of game "+this.name+".");
            // by sending each bid to all players, they can update their bids
            this.sendToAllPlayers('BID_MADE',{player:player,bid:bid});
        }
        // MDH@23JAN2020: when a played card was accepted we can send the card played to all players
        _cardPlayedAccepted(){
            // MDH@20JAN2020: after each card is played, we're going to send along all partner indices
            let partnerIds=this._players.map((player)=>player.partner);
            let cardPlayed=this._trick.getLastCard();
            if(cardPlayed){
                this.sendToAllPlayers('CARD_PLAYED',
                {
                    askingForPartnerCard:this._trick._askingForPartnerCard,
                    winner:this._trick._winner,
                    suite:cardPlayed.suite,
                    rank:cardPlayed.rank,
                    partners:partnerIds,
                });
                gameEngineLog("Card played by "+this._players[this._player].name+": '"+cardPlayed.toString()+"'.");
            }
        }

        // MDH@10JAN2020: overriding to be able to send this information to all players
        askPlayerForBid(){
            super.askPlayerForBid();
            // tell all players who's bidding right now
            this.sendToAllPlayers('TO_BID',this.getPlayerName(this._player));
        }

        // MDH@07JAN2020: whenever the state changes, we tell the game players
        set state(newstate){
            let oldstate=this._state;
            // unfortunately we need to send the game info BEFORE a player is asked for a card to play (as super.state would)
            // NOTE on playing 'troela' BIDDING could be skipped, and we still need to send the game info over!!!!
            if(oldstate<PlayerGame.PLAYING&&newstate===PlayerGame.PLAYING){
                // every player should know the game that is being played
                // let's compose the object to send with all the data that is needed over there
                // NOTE: all these values are read-only so it's preferred to not use the (still available) getter anymore
                this.sendToAllPlayers('GAME_INFO',{
                    trumpSuite:this.getTrumpSuite(),
                    partnerSuite:this.getPartnerSuite(),
                    partnerRank:this.getPartnerRank(),
                    highestBid:this.getHighestBid(),
                    highestBidders:this.getHighestBidders(),
                    fourthAcePlayer:this.getFourthAcePlayer()
                });
            };
            super.state=newstate; // should do what it needs to do
            if(this._state===oldstate)return;
            gameEngineLog("********* STATE CHANGE FROM "+oldstate+" TO "+this._state+" ************");
            // when changing states we should ascertain that certain game information was send to the game players
            switch(this._state){
                case PlayerGame.IDLE:
                    // make all players join the game 'room'
                    this._players.forEach((player)=>{player.joinGame();});
                    // and now we can emit the game name, the game players and the current dealer index...
                    this.sendToAllPlayers("GAME",this._tableId);
                    this.sendToAllPlayers("PLAYERS",this.getPlayerNames());
                    this.sendToAllPlayers('DEALER',this.dealer); // sync the dealer to the correct value
                    break;
                case PlayerGame.BIDDING:
                    // every player should know the cards it's been dealt (before moving to bidding page)
                    this._players.forEach((player)=>{player.sendCards();});
                    break;
                case PlayerGame.PLAYING: // see above
                    break;
                case PlayerGame.CANCELING:
                    break;
                case PlayerGame.FINISHED:
                    // we should pass the tricks played, and the points and deltaPoints over to each player
                    // we also want to send who won the tricks...
                    {
                        // MDH@23JAN2020 all the tricks are collected by the client (player)s themselves: this.sendToAllPlayers('TRICKS',getTricksInfo(this._tricks));
                        // MDH@23JAN2020: this.deltaPoints will compute the delta points JIT
                        // MDH@24JAN2020: also sending over the points
                        //                NOTE sending the state change will move to the finished page!!!
                        this.sendToAllPlayers('RESULTS',{'deltapoints':this.deltaPoints,'points':this.points});
                    }
                    break;
            }
            this.sendToAllPlayers('STATECHANGE',{from:oldstate,to:this._state});
        }
        
        // which methods do we need to override?????
        // those methods that will be sending data over
        // typically those where properties change, so definitely not those that only return data
        // so we end up with the PlayerEventListener methods (those called by a player)
        // but those are typically called on the client which should send the data along here
        // to listen to

        // public methods
        
        // PlayerEventListener implementation
        bidMade(bid){
            // 1. register the bid
            ////////now passed in as argument: let bid=this._players[this._player].bid; // collect the bid made by the current player
            gameEngineLog("Bid by "+this._players[this._player].name+": "+PlayerGame.BID_NAMES[bid]+".");
            super.bidMade(bid);
        }
        trumpSuiteChosen(chosenTrumpSuite){
            super.trumpSuiteChosen(chosenTrumpSuite);
            gameEngineLog("Trump suite chosen by "+this._players[this._player].name+": '"+Card.SUITE_NAMES[chosenTrumpSuite]+"'.");
        }
        partnerSuiteChosen(chosenPartnerSuite){
            super.partnerSuiteChosen(chosenPartnerSuite);
            gameEngineLog("Partner card suite chosen by "+this._players[this._player].name+": '"+Card.SUITE_NAMES[chosenPartnerSuite]+"'.");
        }
        /*
        cardPlayed(card,askingForPartnerCard){
            super.cardPlayed(card,askingForPartnerCard);
            // MDH@23JAN2020: on the last trick this._player is removed, so we change that!!!!!
            //                moving the line below to cardPlayedAccepted(), so we don't need this method override anymore
            gameEngineLog("Card played by "+this._players[this._player].name+": '"+card.toString()+"'.");
        }
        */
        // end PlayerEventListener implementation

    }

    // keep track of all the active games
    let tableGames={};
    let lastTableIndex=0;
    function newTableId(){return "Spel "+(++lastTableIndex);}
    function getGame(tableId){return(tableGames.hasOwnProperty(tableId)?tableGames[tableId]:null);}
    function getNewGamePlayedBy(players){
        // ASSERT all players should have tableId equal to ''
        let rikkenTheGame=null;
        let newGameTableId=newTableId();
        try{
            rikkenTheGame=new RikkenTheGameServer(newGameTableId,players,null);
            if(!rikkenTheGame){gameEngineLog("ERROR: Failed to create a new game.");return false;}
            tableGames[newGameTableId]=rikkenTheGame; // remember the game being played
        }catch(err){
            gameEngineLog("ERROR: Failed to register a new game (due to "+JSON.stringify(err)+").");
        }
        // if all the given players are in the same game now, return true, false otherwise
        return(rikkenTheGame&&players.every((player)=>{return player.tableId==newGameTableId;})?rikkenTheGame:null);
    }
    // call newGame with the ids of the players when a game starts
    function playGame(remotePlayers){
        if(!remotePlayers||remotePlayers.length!=4)return false;
        let newGame=getNewGamePlayedBy(remotePlayers);
        if(!newGame){gameEngineLog("ERROR: Failed to start a new game!");return false;}
        newGame.start(); // I need to explicitly do this, otherwise the game will remain in the OUT_OF_ORDER state...
        if(gamesListener)gamesListener.gameStarted(newGame);
        return true;
    }
    function gameOver(tableId,canceled){
        if(!tableId)return;
        let game=getGame(tableId);
        if(!game){gameEngineLog("ERROR: Game with id '"+tableId+"' not being played!");return;}
        gameEngineLog((canceled?"Cancelling":"Finishing")+" game '"+tableId+"'.");
        // remove the players from the game (in effect the player should disconnect or send id in again)
        // NOTE I'm not going to disconnect
        socket_io_server.to(tableId).emit('GAMEOVER'); // send a single game over to each of the players
        // TODO how about keeping the game around until all players abort the game????????
        // so we can wait doing the following until ALL players have canceled playing in the game
        game._players.forEach((remotePlayer)=>{
            remotePlayer.game=null; // clear the table id thus releasing the remote player to play another game
        });
        delete tableGames[tableId]; // guess we can do it this way
        // inform the games listener that the game finished or got canceled!!!
        if(gamesListener)if(canceled)gamesListener.gameCanceled(game);else gamesListener.gameFinished(game);
    }

    function showRemotePlayersInfo(info){
        let remotePlayersInfo=remotePlayers.map((remotePlayer,remotePlayerIndex)=>{return remotePlayer.getInfo("#"+(remotePlayerIndex+1));});
        gameEngineLog("Players after event "+info+": "+remotePlayersInfo.join(" - "));
    }

    // keep track of all (connected) remote players
    function checkForStartingNewGames(){
        // all remote players with tableId equal to '' are still logged in but not playing anymore
        // first collect all the players that can play at all (those with a userId and no tableId)
        showRemotePlayersInfo("Checking for new game players");
        // MDH@23JAN2020: remote players DO need a name!!!! TODO no idea how to could've lost the name though???
        let idleRemotePlayers=remotePlayers.filter((remotePlayer,remotePlayerIndex)=>(remotePlayer.name?remotePlayer.status==="IDLE":false));
        gameEngineLog("Idle remote players: "+idleRemotePlayers.length+".");
        while(idleRemotePlayers.length>=4){
            let newGamePlayers=[];
            let l=4;while(--l>=0)newGamePlayers.push(idleRemotePlayers.splice(Math.floor(idleRemotePlayers.length*Math.random()),1)[0]);
            if(!playGame(newGamePlayers))return;
        }
    }
    function getIndexOfRemotePlayerOfClient(client){
        let l=remotePlayers.length;while(--l>=0&&remotePlayers[l].client!==client);return l;
    }
    function getIndexOfRemotePlayerWithName(playerName){
        let l=remotePlayers.length;while(--l>=0&&remotePlayers[l].name!==playerName);return l;
    }
    function registerClient(client){
        let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client); // do not register again!!!
        if(remotePlayerIndex>=0)return true;
        let l=remotePlayers.length;
        remotePlayers.push(new RemotePlayer(client));
        return(remotePlayers.length>l);
    }
    function unregisterClient(client){
        let l=getIndexOfRemotePlayerOfClient(client);
        if(l>=0){
            let remotePlayer=remotePlayers[l];
            // if the remote player left the table the game should be canceled
            if(remotePlayer.tableId)gameOver(remotePlayer.tableId,true);
        }
        return(l>=0?(remotePlayers.splice(l,1)>0):true);
    }

    socket_io_server.on('connection', client => {
        // MDH@10JAN2020: this could be a reconnect, in which case we should NOT register the client again
        if(!registerClient(client)){
            client.send('REJECTED'); // send REJECTED on the message channel
            console.error("Failed to register client as remote player.");
            return;
        }
        //console.log("Client: ",client);
        showRemotePlayersInfo("Connect");
        // if a client disconnect they cannot play anymore
        client.on('disconnect', (callback) => {
            let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client);
            if(remotePlayerIndex>=0){
                let remotePlayer=remotePlayers[remotePlayerIndex];
                gameEngineLog("Remote player "+(remotePlayer.name||"?")+" disconnecting...");
                // we could remove the client?????? yes, good idea as we're NOT expecting any data from this client anymore
                remotePlayer.client=null;
            }else
                gameEngineLog("ERROR: Unknown remote player client disconnecting!");
            showRemotePlayersInfo("Disconnect");
            if(typeof callback==='function')callback();else gameEngineLog("No callback on disconnect event.");
            /* replacing:
            // if still playing a game might reconnect, otherwise accept
            if(remotePlayers[remotePlayerIndex].tableId)
                console.log("WARNING: Disconnecting player still playing! Waiting for reconnect!");
            else
                unregisterClient(client);
                //gameOver(remotePlayers[remotePlayerIndex].tableId,true);
            */
        });
        // MDH@15JAN2020: very important to process the ACKs!!!!
        client.on('ACK',(data,callback)=>{
            gameEngineLog("Acknowledged event data: "+JSON.stringify(data)+".");
            let result=false;
            if(data){
                let indexOfRemotePlayerOfClient=getIndexOfRemotePlayerOfClient(client);
                if(indexOfRemotePlayerOfClient>=0){ // we should have this client registered (of course)
                    let remotePlayer=remotePlayers[indexOfRemotePlayerOfClient]; // the associated player
                    // pass the event ids sent over to the remote player!!!
                    // assuming they contain both the id and the event name in each of the data elements
                    let acknowledgedEventIds=data.map((acknowledgedEvent)=>{
                        gameEngineLog("Acknowledged event: "+JSON.stringify(acknowledgedEvent)+".");
                        return acknowledgedEvent.id;
                    });
                    gameEngineLog("Acknowledged event ids: "+JSON.stringify(acknowledgedEventIds)+".");
                    remotePlayer.eventsAcknowledged(acknowledgedEventIds);
                    result=true;
                }else
                    console.log("ERROR: Unable to find the player to process ACK event data "+JSON.stringify(data)+".");
            }
            if(typeof callback==='function'){
                if(result)callback();else gameEngineLog("ERROR: Callback not executed: acknowledgments processing failed.");
            }else
                gameEngineLog("No callback on ACK event.");
        });
        client.on('EXIT',(data,callback)=>{
            // we have to cancel the game because one of the player left
            // let's send the reason over?????
            gameEngineLog("EXIT event received with data "+JSON.stringify(data)+".");
            unregisterClient(client);
            if(typeof callback==='function')callback();else gameEngineLog("No callback on BYE event.");
        });
        // when a client sends in it's ID which it should
        client.on('PLAYER',(data,callback)=>{
            // MDH@10JAN2020: this client could be a player we already know about (when a reconnect occurred)
            //                it's easier to remove the other client instead of 
            let indexOfRemotePlayerOfClient=getIndexOfRemotePlayerOfClient(client);
            if(indexOfRemotePlayerOfClient>=0){ // we should have this client registered (of course)
                let remotePlayer=remotePlayers[indexOfRemotePlayerOfClient]; // the associated player
                let indexOfRemotePlayerWithName=getIndexOfRemotePlayerWithName(data);
                if(indexOfRemotePlayerWithName<0){ // haven't got a player with the same name
                    if(data)remotePlayer.name=data;
                    gameEngineLog("Name of remote player #"+(indexOfRemotePlayerOfClient+1)+" set to '"+remotePlayer.name+"'.");
                    checkForStartingNewGames();
                    return;
                }else{ // there's already a registered player with that name
                    // it's possible we received the name twice??????
                    if(indexOfRemotePlayerOfClient!==indexOfRemotePlayerWithName){
                        if(data)remotePlayer.name=data;
                        // now we have two remote players with the same name
                        // delete the OLD one, and get it's game instance so we can assign that to the new one
                        let removedRemotePlayer=remotePlayers.splice(indexOfRemotePlayerWithName,1)[0];
                        if(removedRemotePlayer&&removedRemotePlayer.game){
                            remotePlayer.index=removedRemotePlayer.index;
                            remotePlayer.game=removedRemotePlayer.game;
                            // TODO all events sent to this player that have not been acknowledged yet have to be sent immediately
                            remotePlayer.addPendingEvents(removedRemotePlayer.pendingEvents);
                            // MDH@23JAN2020: we can do a bit more if this is the current player!!!!
                            if(remotePlayer.index===this._player){
                                gameEngineLog("********************** Prompting the reconnected player ********************************");
                                switch(this.state){
                                    case PlayerGame.BIDDING:remotePlayer.game._askPlayerForBid();break;
                                    case PlayerGame.CHOOSE_TRUMP_SUITE:remotePlayer.game._askPlayerForTrumpSuite();break;
                                    case PlayerGame.CHOOSE_PARTNER_SUITE:remotePlayer.game._askPlayerForPartnerSuite();break;
                                    case PlayerGame.PLAYING:remotePlayer.game._askPlayerForCard();break;
                                }
                            }
                        }
                    }else
                        gameEngineLog("WARNING: Player name '"+data+"' received again!");
                }
            }else
                gameEngineLog("ERROR: Name of unregistered player ("+data+") received!");
            showRemotePlayersInfo("Player ID");
            if(typeof callback==='function')callback();else console.log("No callback on PLAYER event");
        });
        // what's coming back from the players are bids, cards played, trump and/or partner suites choosen
        client.on('BID', (data,callback) => { 
            let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client);
            let remotePlayer=remotePlayers[remotePlayerIndex];
            remotePlayer._setBid(logReceivedEvent(this.name,remotePlayer.name,'BID',data));
            if(typeof callback==='function')callback();else gameEngineLog("No callback on BID event.");
            remotePlayer.game.sendBidMadeEvent(remotePlayer.index,data); // MDH@20JAN2020: same with a bid (as with a card below), which can then be displayed
        });
        client.on('CARD',(data,callback)=>{
            let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client);
            // we may assume that the card played is one from the given player AND we need to get that one
            let player=remotePlayers[remotePlayerIndex];
            // given that we get the actual card played from the other side, we should call player._setCard here!!!!
            // passing in the actual card that the player has in his hands as returned by getCard() (defined in class CardHolder)
            // MDH@14JAN2020: we're receiving the card (suite first, rank second, askingForPartnerCard flag)
            let eventData=logReceivedEvent(this.name,player.name,'CARD',data);
            let cardPlayed=player.getCard(eventData[0],eventData[1],eventData[2]);
            if(cardPlayed){
                // MDH@23JAN2020: because _setCard will call _cardPlayed on the game itself
                //                it's better to move calling sendCardPlayedEvent() there instead of here!!!!!
                player._setCard(cardPlayed); // will update the current trick as well!!
                if(typeof callback==='function')callback();else gameEngineLog("No callback on CARD event.");    
                // MDH@20JAN2020: on receipt of a card we simply send it back to all players
                //                along with the current winner and whether or not asking for the partner card
                //                TODO acknowledging probably not needed in that case!!!!!!
                // moved over to the game itself (now in response to the _cardPlayedAccepted() method call!): player.game.sendCardPlayedEvent();
            }else
                gameEngineLog("****** BUG: Card played not registered with current player!");
        });
        client.on('TRUMPSUITE',(data,callback)=>{
            let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client);
            remotePlayers[remotePlayerIndex]._setTrumpSuite(logReceivedEvent(this.name,remotePlayers[remotePlayerIndex].name,'TRUMPSUITE',data));
            if(typeof callback==='function')callback();else gameEngineLog("No callback on TRUMPSUITE event.");
        });
        client.on('PARTNERSUITE',(data,callback)=>{
            let remotePlayerIndex=getIndexOfRemotePlayerOfClient(client);
            remotePlayers[remotePlayerIndex]._setPartnerSuite(logReceivedEvent(this.name,remotePlayers[remotePlayerIndex].name,'PARTNERSUITE',data));
            if(typeof callback==='function')callback();else gameEngineLog("No callback on PARTNERSUITE event.");
        });
    });

    // if events need to be acknowledged, run a clock
    if(acknowledgmentRequired)clock=new Clock(1000).start(); 

    // returning all the functions to interface with the game engine
    // any user that logs in should call canPlay and as soon as logged out cantPlay
    // technically the user has to click the want to play button
    return {
        userWillPlay:function(userId){
            // find the remote player with this user id
            let l=remotePlayers.length;
            while(--l>=0&&remotePlayers[l].userId===userId);
            if(l<0)return false; // unregistered player
            remotePlayers[l].wantsToPlay=true;
            return true;
        },
        userWontPlay:function(userId){
            // find the remote player with this user id
            let l=remotePlayers.length;
            while(--l>=0&&remotePlayers[l].userId===userId);
            if(l<0)return false; // unregistered player
            remotePlayers[l].wantsToPlay=false;
            return true;
        },
        getGameIds:function(){return Object.keys(tableGames); }, // exposes all game ids
        getRemotePlayers:function(){return remotePlayers;},
    };

}