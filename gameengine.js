// server-side game engine
const {CardHolder,HoldableCard}=require('./public/javascripts/CardHolder.js');
const {PlayerEventListener,PlayerGame,Player}=require('./public/javascripts/Player.js'); // the player class we'll be extending...
const {RikkenTheGameEventListener,Trick,RikkenTheGame}=require('./public/javascripts/RikkenTheGame.js'); // the (original) RikkenTheGame that we extend here

module.exports=(socket_io_server,gamesListener)=>{

    function logEvent(to,event,data){
        console.log("\nSending event "+event+" with data "+JSON.stringify(data)+" to "+to+".");
        return [event,data];
    }

    function getCardsInfo(cardHolder){
        let cardsInfo=[];cardHolder._cards.forEach((card)=>{cardsInfo.push([card.suite,card.rank]);});return cardsInfo;
    }
    function getTrickInfo(trick){
        // TODO we'd probably have to send more information from the trick
        return {'cards':getCardsInfo(trick),'winner':trick.winner,'first':trick.firstPlayer};
    }
    function getTricksInfo(tricks){
        return tricks.map((trick)=>{return getTrickInfo(trick);});
    }
    // a RemotePlayer represents a remote player
    class RemotePlayer extends Player {

        constructor(client){
            super(null); // for now nameless
            this._client=client;
            // this._userId=null;
            // this._wantsToPlay=false; // a flag that determines if a remote player wants to play
        }

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
                    if(this._tableId&&this.tableId.length>0){console.log("GAME ENGINE >>> Can only play in one game at a time!");return;}
                    this._tableId=tableId;
                    this._client.send('TABLE='+this._tableId); // send the table id on the general channel
                }else{ // leaving
                    if(!this._tableId||this._tableId.length==0){console.log("GAME ENGINE >>> Can't leave a game I'm not playing!");return;} // 
                    this._tableId=tableId;
                    this._client.send("NOTABLE");
                }
            }
        }
        */
        get client(){return this._client;}

        sendCards(){
            this._client.emit(...logEvent(this.name,'CARDS',getCardsInfo(this)));
        }

        // copied over from OnlinePlayer() in main.js 
        // METHODS CALLED BY THE GAME
        makeABid(playerBidObjects,possibleBids){
            this._client.emit(...logEvent(this.name,'MAKE_A_BID',{'playerBidObjects':playerBidObjects,'possibleBids':possibleBids}));
        }
        chooseTrumpSuite(suites){
            this._client.emit(...logEvent(this.name,'CHOOSE_TRUMP_SUITE',this.name,{'suites':suites}));
        }
        choosePartnerSuite(suites,partnerRankName){
            this._client.emit(...logEvent(this.name,'CHOOSE_PARTNER_SUITE',{'suites':suites,'partnerRankName':partnerRankName}));
        }
        // almost the same as the replaced version except we now want to receive the trick itself
        playACard(trick){
            // can we send all the trick information this way??????? I guess not
            this._client.emit(...logEvent(this.name,'PLAY_A_CARD',{'trick':getTrickInfo(trick)}));
        }
        // END METHODS CALLED BY THE GAME

        // METHODS CALLED BY THE PLAYER ITSELF TO BE PASSED ON TO THE GAME
        // not to be confused with _cardPlayed() defined in the base class Player which informs the game
        // NOTE cardPlayed is a good point for checking the validity of the card played
        // NOTE can't use _cardPlayed (see Player superclass)
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
                        console.log("******************************************************");
                        console.log(">>>> CHECKING WHETHER ASKING FOR THE PARTNER CARD <<<<");
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
                        }else
                            /*alert("Not indicated!!!!")*/;
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
                console.log("Player "+this.userId+" joining "+this.tableId+".");
                this._client.join(this.tableId,(err)=>{
                    if(err){
                        console.log("GAME_ENGINE >>> ERROR: Failed to make player join a game.");
                        console.error(err);
                    }
                });
            }else
                console.error("No game to join!");
        }
    }
    
    // we need to RikkenTheGameServer to send certain data to all its player clients e.g. when the state changes
    // so it subclasses RikkenTheGame 
    // MDH@09JAN2020: let's remove the methods that are already doing there thing in RikkenTheGame!!!
    class RikkenTheGameServer extends RikkenTheGame{

        // MDH@07JAN2020: I've adapted the super constructor in such a way that you need to call start() to make it start
        //                that way we can set the _tableId before the game tries to reach the IDLE state
        //                and initialize the game by telling each player what game it will be playing and at what position
        constructor(tableId,players){
            super(players,null);
            this._tableId=tableId;
            // now we're to wait for somebody to start the game
        }

        get name(){return this._tableId;} // convenience getter

        // here we have all the methods from RikkenTheGame that we override with additional behaviour on top
        // of the original one, so every method calls it's super method
        // called when RikkenTheGame moves into the IDLE state

        // MDH@07JAN2020: whenever the state changes, we tell the game players
        set state(newstate){
            let oldstate=this._state;
            super.state=newstate; // should do what it needs to do
            if(this._state===oldstate)return;
            console.log("********* STATE CHANGE FROM "+oldstate+" TO "+this._state+" ************");
            // when changing states we should ascertain that certain game information was send to the game players
            switch(this._state){
                case PlayerGame.IDLE:
                    debugger
                    // make all players join the game 'room'
                    this._players.forEach((player)=>{player.joinGame();});
                    // and now we can emit the game name, the game players and the current dealer index...
                    socket_io_server.to(this._tableId).emit(...logEvent("(all)","GAME",this._tableId));
                    socket_io_server.to(this._tableId).emit(...logEvent("(all)","PLAYERS",this.getPlayerNames()));
                    socket_io_server.to(this._tableId).emit(...logEvent("(all)",'DEALER',this.dealer)); // sync the dealer to the correct value
                    break;
                case PlayerGame.BIDDING:
                    // every player should know the cards it's been dealt (before moving to bidding page)
                    this._players.forEach((player)=>{player.sendCards();});
                    break;
                case PlayerGame.PLAYING:
                    // every player should know the game that is being played
                    // let's compose the object to send with all the data that is needed over there
                    {
                        let playInfo={
                            'trumpSuite':this.trumpSuite,
                            'partnerSuite':this.partnerSuite,
                            'partnerRank':this.partnerRank,
                            'highestBid':this.highestBid,
                            'highestBidders':this.highestBidPlayers,
                            'trumpPlayer':this.trumpPlayer,  
                            'fourthAcePlayer':this.fourthAcePlayer,
                        };
                        socket_io_server.to(this._tableId).emit(...logEvent(this._tableId,'GAMEINFO',playInfo));
                    }
                    break;
                case PlayerGame.CANCELING:
                    break;
                case PlayerGame.FINISHED:
                    // we should pass the tricks played, and the points and deltaPoints over to each player
                    // we also want to send who won the tricks...
                    {
                        socket_io_server.to(this._tableId).emit(...logEvent(this._tableId,'TRICKS',getTricksInfo(this._tricks)));
                        // TODO send the number of tricks each player one as well??????
                        socket_io_server.to(this._tableId).emit(...logEvent(this._tableId,'RESULTS',{'deltapoints':this.deltaPoints}));
                    }
                    break;
            }
            socket_io_server.to(this._tableId).emit(...logEvent(this._tableId,'STATECHANGE',{from:oldstate,to:this._state}));
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
            super.bidMade(bid);
            // 1. register the bid
            ////////now passed in as argument: let bid=this._players[this._player].bid; // collect the bid made by the current player
            console.log("Bid by "+this._players[this._player].name+": '"+BID_NAMES[bid]+"'.");
        }
        trumpSuiteChosen(chosenTrumpSuite){
            super.trumpSuiteChosen(choseTrumpSuite);
        }
        partnerSuiteChosen(chosenPartnerSuite){
            super.partnerSuiteChosen(chosenPartnerSuite);
        }
        cardPlayed(card){
            super.cardPlayed(card);
        }
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
            if(!rikkenTheGame){console.log("GAME ENGINE >>> Failed to start a new game.");return false;}
            tableGames[newGameTableId]=rikkenTheGame; // remember the game being played
        }catch(err){console.log("GAME ENGINE >>> Failed to register a new game ",err);}
        // if all the given players are in the same game now, return true, false otherwise
        return(rikkenTheGame&&players.every((player)=>{return player.tableId==newGameTableId;})?rikkenTheGame:null);
    }
    // call newGame with the ids of the players when a game starts
    function playGame(remotePlayers){
        if(!remotePlayers||remotePlayers.length!=4)return false;
        let newGame=getNewGamePlayedBy(remotePlayers);
        if(!newGame){console.log("Failed to start a new game!");return false;}
        newGame.start(); // I need to explicitly do this, otherwise the game will remain in the OUT_OF_ORDER state...
        if(gamesListener)gamesListener.gameStarted(newGame);
        return true;
    }
    function gameOver(tableId,canceled){
        if(!tableId)return;
        let game=getGame(tableId);
        if(!game){console.error("Game with id '"+tableId+"' not being played!");return;}
        console.log((canceled?"Cancelling":"Finishing")+" game '"+tableId+"'.");
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
        if(gamesListener)if(canceled)gamesListener.gameCanceled(game);else gamesListeners.gameFinished(game);
    }

    // keep track of all (connected) remote players
    let remotePlayers=[];
    function checkForStartingNewGames(){
        // all remote players with tableId equal to '' are still logged in but not playing anymore
        // first collect all the players that can play at all (those with a userId and no tableId)
        let idleRemotePlayers=remotePlayers.filter((remotePlayer)=>{
            let result=(remotePlayer.name&&!remotePlayer.game);
            console.log("Checking remote player ",remotePlayer);
            console.log("\t"+(result?"IDLE":"OCCUPIED"));
            return result;
        });
        console.log("Idle remote players: "+idleRemotePlayers.length+".");
        while(idleRemotePlayers.length>=4){
            let newGamePlayers=[];
            let l=4;while(--l>=0)newGamePlayers.push(idleRemotePlayers.splice(Math.floor(idleRemotePlayers.length*Math.random()),1)[0]);
            if(!playGame(newGamePlayers))return;
        }
    }
    function getRemotePlayerIndex(client){
        let l=remotePlayers.length;while(--l>=0&&remotePlayers[l].client!==client);return l;
    }
    function registerClient(client){
        let remotePlayerIndex=getRemotePlayerIndex(client); // do not register again!!!
        if(remotePlayerIndex>=0)return true;
        let l=remotePlayers.length;
        remotePlayers.push(new RemotePlayer(client));
        return(remotePlayers.length>l);
    }
    function unregisterClient(client){
        let l=getRemotePlayerIndex(client);
        if(l>=0){
            let remotePlayer=remotePlayers[l];
            // if the remote player left the table the game should be canceled
            if(remotePlayer.tableId)gameOver(remotePlayer.tableId,true);
        }
        return(l>=0?(remotePlayers.splice(l,1)>0):true);
    }

    socket_io_server.on('connection', client => {
        if(!registerClient(client)){
            client.send('REJECTED'); // send REJECTED on the message channel
            console.error("Failed to register client as remote player.");
            return;
        }
        //console.log("Client: ",client);
        console.log("\Connecting client registered!");
        // if a client disconnect they cannot play anymore
        client.on('disconnect', () => { 
            // console.log("Client: ",client);
            console.log("\tDisconnecting...");
            let remotePlayerIndex=getRemotePlayerIndex(client);
            // if still playing a game might reconnect, otherwise accept
            if(remotePlayers[remotePlayerIndex].tableId)
                console.log("WARNING: Disconnecting player still playing! Waiting for reconnect!");
            else
                unregisterClient(client);
                //gameOver(remotePlayers[remotePlayerIndex].tableId,true);
        });
        // when a client sends in it's ID which it should
        client.on('PLAYER',(data)=>{
            let remotePlayerIndex=getRemotePlayerIndex(client);
            remotePlayers[remotePlayerIndex].name=data;
            console.log("GAME ENGINE >>> Name of remote player #"+remotePlayerIndex+" set to '"+remotePlayers[remotePlayerIndex].name+"'.");
            checkForStartingNewGames();
        });
        // what's coming back from the players are bids, cards played, trump and/or partner suites choosen
        client.on('BIDMADE', (data) => { 
            let remotePlayerIndex=getRemotePlayerIndex(client);
            remotePlayers[remotePlayerIndex]._setBid(data);
        });
        client.on('CARDPLAYED',(data)=>{
            let remotePlayerIndex=getRemotePlayerIndex(client);
            remotePlayers[remotePlayerIndex]._setCard(new Card(data[0],data[1]));
        });
        client.on('TRUMPSUITE',(data)=>{
            let remotePlayerIndex=getRemotePlayerIndex(client);
            remotePlayers[remotePlayerIndex]._setTrumpSuite(data);
        });
        client.on('PARTNERSUITE',(data)=>{
            let remotePlayerIndex=getRemotePlayerIndex(client);
            remotePlayers[remotePlayerIndex]._setPartnerSuite(data);
        });
    });

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
        getRemotePlayers:function(){
            return remotePlayers;
        },
    };

}