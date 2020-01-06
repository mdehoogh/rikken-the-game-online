// server-side game engine
module.exports=(io,gamesListener)=>{

    const Player=require('./public/javascripts/Player.js'); // the player class we'll be extending...

    // keep track of all the active games
    let tableGames={};
    let lastTableIndex=0;
    function newTableId(){return "Spel "+(++lastTableIndex);}
    function getGame(tableId){return(tableGames.hasOwnProperty(tableId)?tableGames[tableId]:null);}
    function willBePlayingAGame(players){
        // ASSERT all players should have tableId equal to ''
        try{
            let rikkenTheGame=new RikkenTheGame(players);
            if(!rikkenTheGame){console.log("GAME ENGINE >>> Failed to start a new game.");return false;}
            let newGameTableId=newTableId();
            tableGames[newGameTableId]=rikkenTheGame;
            // tell each player what game they are playing in!!
            players.forEach((player)=>{player.tableId=newGameTableId;});
        }catch(err){
            console.log("GAME ENGINE >>> Failed to register a new game ",err);
        }
        return players.every((player)=>{return player.tableId==newGameTableId;});
    }
    // call newGame with the ids of the players when a game starts
    function newGame(remotePlayers){
        if(!remotePlayers)return false;
        if(!willBePlayingAGame(remotePlayers)){ // not all players playing in the new game, or not enough players
            remotePlayers.forEach((remotePlayer)=>{remotePlayer.tableId='';});
            return false;
        }else // a new game being played
            if(gamesListener)gamesListener.gameStarted(rikkenTheGame);
    }
    function gameOver(tableId,canceled){
        if(!tableId)return;
        let game=getGame(tableId);
        if(!game){console.error("Game with id '"+tableId+"' not being played!");return;}
        // remove the players from the game (in effect the player should disconnect or send id in again)
        // NOTE I'm not going to disconnect
        io.to(tableId).emit('gameover'); // send a single game over to each of the players
        // TODO how about keeping the game around until all players abort the game????????
        // so we can wait doing the following until ALL players have canceled playing in the game
        game._players.forEach((remotePlayer)=>{
            remotePlayer.tableId=''; // clear the table id thus releasing the remote player to play another game
        });
        delete tableGames[tableId]; // guess we can do it this way
        // inform the games listener that the game finished or got canceled!!!
        if(gamesListener)if(canceled)gamesListener.gameCanceled(game);else gamesListeners.gameFinished(game);
    }

    // a RemotePlayer represents a remote player
    class RemotePlayer extends Player {
        constructor(client){
            this._client=client;
            this._userId=null;
            this._tableId=null;
        }
        get userId(){return this._userId;}
        set userId(userId){
            if(this._userId)return; // can only be set once!!!
            this._userId=userId;
        }
        get tableId(){return this._tableId;}
        set tableId(tableId){
            // can only play at a table when the user id is set
            if(tableId&&!this._userId)return;
            // distinguish between leaving or joining a table
            if(tableId){
                if(tableId.length>0){ 
                    if(this._tableId&&this.tableId.length>0){console.log("GAME ENGINE >>> Can only play in one game at a time!");return;}
                    this._tableId=tableId;
                    io.send('TABLE='+this._tableId); // send the table id on the general channel
                }else{ // leaving
                    if(!this._tableId||this._tableId.length==0){console.log("GAME ENGINE >>> Can't leave a game I'm not playing!");return;} // 
                    this._tableId=tableId;
                    io.send("NOTABLE");
                }
            }
        }
        get client(){return this._client;}

        // copied over from OnlinePlayer() in main.js 
        // METHODS CALLED BY THE GAME
        makeABid(playerBidsObjects,possibleBids){
            this._client.to(this._tableId).emit('makeABid',{'playerBidObjects':playerBidObjects,'possibleBids':possibleBids});
        }
        chooseTrumpSuite(suites){
            this._client.to(this._tableId).emit('chooseTrumpSuite',{'suites':suites});
        }
        choosePartnerSuite(suites,partnerRankName){
            this._client.to(this._tableId).emit('choosePartnerSuite',{'suites':suites,'partnerRankName':partnerRankName});
        }
        // almost the same as the replaced version except we now want to receive the trick itself
        playACard(trick){
            this._client.to(this._tableId).emit('playACard',{'trick':trick});
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
    }

    // keep track of all (connected) remote players
    let remotePlayers=[];
    function checkForStartingNewGames(){
        // all remote players with tableId equal to '' are still logged in but not playing anymore
        // first collect all the players that can play at all (those with a userId and no tableId)
        let idleRemotePlayers=remotePlayers.filter((remotePlayer)=>{if(remotePlayer.userId&&remotePlayer.tableId&&remotePlayer.tableId.length==0);});
        while(idleRemotePlayers.length>=4){
            let newGamePlayers=[];
            let l=4;while(--l>=0)newGamePlayers.push(idleRemotePlayers[Math.floor(idleRemotePlayers.length*Math.random())]);
            if(!newGame(newGamePlayers))return;
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
            if(remotePlayer.tableId)
        }
        return(l>=0?(remotePlayers.splice(l,1)>0):true);
    }

    io.on('connection', client => {
        if(!registerClient(client)){
            client.send('REJECTED'); // send REJECTED on the message channel
            console.error("Failed to register client as remote player.");
            return;
        }
        console.log("Client: ",client);
        console.log("\tConnected!");
        // if a client disconnect they cannot play anymore
        client.on('disconnect', () => { 
            console.log("Client: "+client);
            console.log("\tDisconnecting...");
            unregisterClient(client);
        });
        // when a client sends in it's ID which it should
        client.on('id',data=>{
            let remotePlayer=getRemotePlayerIndex(client);
            remotePlayer.userId=data;
            console.log("GAME ENGINE >>> User id of remote player set to '"+data+"'.");
        };
        // responding to any number of client events
        client.on('three-second counter', data => { 
            // TODO respond to event 'event'
            console.log("Client: "+client);
            console.log("\tReceived three-second counter data: ",data);
        });
    });

    io.connect();

    // returning all the functions to interface with the game engine
    // any user that logs in should call canPlay and as soon as logged out cantPlay
    // technically the user has to click the want to play button
    return {
        canPlay:function(userId){
            // find the remote player with this user id
            let l=remotePlayers.length;
            while(--l>=0&&remotePlayers[l].userId===userId);
            if(l<0)return false; // unregistered player
            if(!remotePlayers[l].tableId)remotePlayer.tableId='';
            return(remotePlayers[l].tableId!=null);
        },
        cantPlay:function(userId){
            // find the remote player with this user id
            let l=remotePlayers.length;
            while(--l>=0&&remotePlayers[l].userId===userId);
            if(l<0)return false; // unregistered player
            let remotePlayer=remotePlayers[l];
            // if this user is still playing in a game should be canceled!!!
            if(remotePlayer.tableId&&remotePlayer.tableId.length>0)gameOver(remotePlayer.tableId,true);
            remotePlayers.tableId=null;
            return true;
        },
        getGameIds:function(){return Object.keys(tableGames); }, // exposes all game ids
        getRemotePlayers:function(){
            return remotePlayers;
        },
    };

}