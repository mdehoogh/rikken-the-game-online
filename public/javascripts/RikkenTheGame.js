/**
 * adapted from the demo version of Rikken to export the classes
 */
const Card=require('./Card.js');
const {PlayerEventListener,PlayerGame,Player}=require('./Player.js');
const {CardHolder,HoldableCard}=require('./CardHolder.js');
const Trick=require('./Trick.js');
const DeckOfCards=require("./DeckOfCards.js"); // OOPS will be needing this!!!

// posssible game states
/////////const OUT_OF_ORDER=-1,IDLE=0,DEALING=1,BIDDING=2,INITIATE_PLAYING=3,TRUMP_CHOOSING=4,PARTNER_CHOOSING=5,PLAYING=6,CANCELING=7,FINISHED=8;

// possible bids
// NOTE the highest possible bid (troela) is obligatory!!

/**
 * to be registered as event listener with a single RikkenTheGame instance (in the constructor)
 */
class RikkenTheGameEventListener{
    stateChanged(fromstate,tostate){
        if(new.target===RikkenTheGameEventListener)
            throw new Error("You're supposed to create a subclass of RikkenTheGameEventListener!");
    }
    errorOccurred(error){
        if(new.target===RikkenTheGameEventListener)
            throw new Error("You're supposed to create a subclass of RikkenTheGameEventListener!");
    }
}

class EmulatedPlayer extends Player{

    constructor(name){
        super(name);
    }
    getCardToPlay(cardSuite){
        let cardsOfSuite=this.getCardsOfSuite(cardSuite);
        if(cardsOfSuite&&cardsOfSuite.length>0)return cardsOfSuite[0];
        // we should return the card we want to get rid of most!!!
        return this.cards.pop(); // the last card is a good alternative!!!
    }

    makeABid(playerbids){

    }
    chooseTrumpSuite(suites){

    }
    choosePartnerSuite(suites){

    }
    playACard(){

    }

}

// Trick class definition removed her and moved over to Trick.js

class RikkenTheGame extends PlayerGame{

    static get MY_NAME(){
        return "Me";
    }

    log(tolog){
        console.log("RIKKENTHEGAME >>> "+tolog);
    }
    
    // called when RikkenTheGame moves into the IDLE state
    _gameInitialized(){
        // reposses the cards in the tricks
        if(this._tricks&&this._tricks.length>0){
            // this.log("Collecting trick cards.");
            this._tricks.forEach((trick)=>{while(1){let card=trick.getFirstCard();if(!card)break;card.holder=this.deckOfCards;}});
        }
        if(this.deckOfCards.numberOfCards!=52){
            this.log("BUG: Deck of cards holds only "+this.deckOfCards.numberOfCards+".");
            return false;
        }
        // the successor of the current dealer is to deal next
        this.dealer=(this.dealer+1)%this.numberOfPlayers;
        // initialize all the lot
        this._trumpSuite=-1; // the trump suite
        this._partnerSuite=-1;this._partnerRank=-1; // the card of the partner (for games with trump and a partner)
        this._trick=null; // the current trick
        this._tricks=[]; // the tricks played
        this._highestBid=-1; // no highest bid yet
        this._highestBidPlayers=[]; // all the players that made the highest bid (and are playing it)
        this._playersBids=[]; // at most 5 players
        let player=this.numberOfPlayers;while(--player>=0)this._playersBids.push([]);
        // MDH@08DEC2019: keep track of the partner of each player in this.partners
        //                from the start of the game
        this._partners=null;
        this._arePartnersKnown=false; // should be set to true as soon the partner card was played!!
        return true;
    }

    constructor(players,eventListener){

        super();

        if(eventListener&&!(eventListener instanceof RikkenTheGameEventListener))
            throw new Error("Invalid event listener defined.");

        this._eventListener=eventListener;

        if(!players||!Array.isArray(players)||players.length<4)
            throw new Error("Not enough players!");
        
        this._points=[]; // the points each player has won
        this._deltaPoints=[]; // what is won/lost in a single game
        this._players=[]; // to store the players myself
        // replace undefined players by emulated players and register myself as player event listener
        let playerIndex=players.length;
        while(--playerIndex>=0){
            if(players[playerIndex]){
                if(!(players[playerIndex] instanceof Player))
                    throw new Error("Player of wrong type.");
                this._players.unshift(players[playerIndex]);
            }else{
                console.log("Emulating player #"+playerIndex+".");
                this._players.unshift(new EmulatedPlayer(RikkenTheGame.MY_NAME));
            }
            this._points.unshift(0); // start with zero points
        }
        console.log("Game players registered!");
        // MDH@07JAN2020: we can move the following to when the game wants to move to the IDLE state
        ///*
        // register the game with each of the players and initialie the player bids as well
        ////this._passBidCount=0; // the number of players that bid 'pass'
        ////this._playersBids=[];
        playerIndex=this._players.length;
        while(--playerIndex>=0){
            let player=this._players[playerIndex];
            if(player){
                console.log("Registering the game player at index #"+(playerIndex)+".");
                try{
                    player.playsTheGameAtIndex(this,playerIndex);
                }catch(err){
                    console.error(err);
                }
                if(player.game!=this){
                    console.log("ERROR: Game player at index #"+(playerIndex)+"  NOT  registered.");
                    //throw new Error("Failed to register player '"+this._players[playerIndex].name+"'.");
                }else
                    console.log("Game player at index #"+(playerIndex)+" registered.");    
            }else
                console.log("ERROR: No player at index #"+playerIndex+".");
            ////this._playersBids.push([]);
        }
        ////if(this._playersBids.length<4)throw new Error("Failed to initialize the player bids.");
        //*/

        // it's easiest to simply create a new deck of cards each time (instead of repossessing the cards)
        this.deckOfCards=new DeckOfCards();
        
        this._player=-1; // TODO do we need this at all?????

        this.dealer=-1;

        // before asking for the trump and the partner suite, store the possible trump/partner suites
        this._possibleTrumpSuites=[];
        this._possiblePartnerSuites=[];

        this._state=PlayerGame.OUT_OF_ORDER;

        // shuffle parameters
        this._shuffleCount=6;
        this._topopMinimum=11;
        this._topopMaximum=41;

        /* MDH@07JAN2020: let start() take care of moving the IDLE state (so subclass constructors can do their thing)
        // move the state to the IDLE state!!!!
        this.state=IDLE;
        */
        console.log("Game created!");
    }

    get numberOfPlayers(){return this._players.length;}
    
    get numberOfTricksPlayed(){return this._tricks.length;}

    // PlayerGame implementation
    getTrumpSuite(){return this._trumpSuite;}
    getPartnerSuite(){return this._partnerSuite;}
    getPartnerRank(){return this._partnerRank;}
    getNumberOfTricksWonByPlayer(player){
        return(player>=0&&player<this.numberOfPlayers?this._players[player].numberOfTricksWon:0);
    }
    getPartnerName(player){ // here player denotes
        let partner=(player>=0&&player<this.numberOfPlayers?this._players[player].partner:-1);
        return(partner>=0&&partner<this.numberOfPlayers?this._players[partner].name:null);
    }
    // MDH@06DEC2019: the trump player is the player that can ask for the partner suite and rank              
    getTrumpPlayer(){
        // only when playing a 'rik' game (with trump, played with a partner, but not troela, we have a trump player)
        if(this._highestBid!==PlayerGame.BID_RIK&&this._highestBid!==PlayerGame.BID_RIK_BETER){
            this.log("Not playing an ordinary (two-person) trump game!");
            return -1;
        }
        if(!this._highestBidPlayers||this._highestBidPlayers.length==0){
            this.log("ERROR: No highest bid player!");
            return -1;
        }
        this.log("Highest bid player "+this._highestBidPlayers[0]+" is the trump player!");
        return this._highestBidPlayers[0];
    }
    // end PlayerGame implementation

    getPlayerAtIndex(playerIndex){return(playerIndex>=0&&playerIndex<this.numberOfPlayers?this._players[playerIndex]:null);}

    getPlayerName(playerIndex){let player=this.getPlayerAtIndex(playerIndex);return(player?player.name:null);}

    // if asked for the team name adds the name of the partner as well
    getTeamName(playerIndex){
        let teamName="";
        let player=this.getPlayerAtIndex(playerIndex);
        if(player){teamName=player.name;if(player.partner>=0)teamName+"+"+this.getPlayerName(player.partner);}
        return(teamName.length>0?teamName:"?");
    }

    isPlayerPartner(playerIndex,partnerIndex){let player=this.getPlayerAtIndex(playerIndex);return(player?partnerIndex===player.partner:false);}

    getHighestBidders(){return this._highestBidPlayers;} // return all players that play the highest bid (possibly more than one)
    get highestBidders(){return this.highestBidders();}

    getHighestBid(){return this._highestBid;} // the bid of the game that is being played
    get highestBid(){return this.getHighestBid();}
    
    getLastBids(){
        let lastBids=[];this._highestBidPlayers.forEach((highestBidPlayer)=>{lastBids.push(highestBidPlayer[0]);});return lastBids;
    }

    getPartner(playerIndex){
        let player=(playerIndex>=0&&playerIndex<this.numberOfCards?this._players[playerIndex]:null);
        return(player?player.partner:-1);
    }

    // MDH@08JAN2020: useful to have as well
    getPlayerNames(){let playerNames=[];this._players.forEach((player)=>{playerNames.push(player.name);});return playerNames;}
    // MDH@08JAN2020: should be sending this after every trick I suppose????
    getPartnerIndices(){return this._players.map((player)=>{return player.partner;});}

    getPlayerWithCard(suite,rank){
        for(let playerIndex=0;playerIndex<this.numberOfPlayers;playerIndex++)
            if(this._players[playerIndex].containsCard(suite,rank))
                return playerIndex;
        alert("BUG BUG BUG: Player with card ("+Card.SUITE_NAMES[suite]+","+Card.RANK_NAMES[rank]+") not found!");
        return -1;
    }

    isPartnerCard(card){return(card.suite==this._partnerSuite&&card.rank==this._partnerRank);}

    //getPlayerName(player){return(player>0&&player<this.numberOfPlayers?this._players[player].name:"");}
    
    /**
     * setting the partner (of the highest bidder) means all partners are known
     */
    _setPartners(partner1,partner2){
        this.log("Player #"+(partner1)+" and #"+(partner2)+" teaming up!");
        // MDH@08DEC2019: instead of directly setting the partner property of each player
        //                we wait with doing so as soon as the partner is known (by playing the partner card)
        this._partners=[-1,-1,-1,-1];
        let teams=[[partner1,partner2],[]];
        this._players.forEach((player)=>{if(player._index!==partner1&&player._index!==partner2)teams[1].push(player._index);});
        teams.forEach((team)=>{
            this.log("Team: ",team);
            this._partners[team[0]]=team[1];
            this._partners[team[1]]=team[0];
        });
    }
    _tellPlayersWhoTheirPartnerIs(){
        this._arePartnersKnown=true;
        this._players.forEach((player)=>{player.partner=(this._partners?this._partners[player._index]:-1);});
    }

    // after dealing the cards, the game can be played
    _startTheGame(){
        this._highestBidPlayers=[];
        this._highestBid=PlayerGame.BID_PAS;
        //this._highestBid=-1;this._trumpSuite=-1;this._partnerSuite=-1;this._partnerRank=-1;
        this._checkForTroela(); // will if detected register the highest bidder!!!!
        // if a player has 3 aces the play to play is 'troela' and therefore the accepted bid
        if(this._highestBid===PlayerGame.BID_TROELA){ // we will be playing 'troela'
            // better to go through the _setPartnerSuite()
            // NOTE the trump suite has been set, as well as the player with the fourth ace
            // NOTE we're skipping the entire process of asking for the partner card as we know all that already
            // partners are known to
            // obsolete because done by _setPartnerSuite() as well: this._setPartners(this.fourthAcePlayer,this._highestBidPlayers[0]);
            this._tellPlayersWhoTheirPartnerIs(); // ascertain that all players known there partner
            this._partnerRank=12; // MUST BE SET otherwise can't set the partner suite!!!
            // the player with the three aces will be the trump player
            this._setPartnerSuite(this._highestBidPlayers[0],this.getTrumpSuite()); // of course the partner card suite is the trump suite
            if(!this._partners)throw new Error("Partner of 'troela' player unknown!");
            this._tellPlayersWhoTheirPartnerIs(); // we have to do this before playing
            this._startPlaying(this._fourthAcePlayer);
            ////this._trumpSuite=this._players[this.fourthAcePlayer].getSuitesWithRank(RANK_ACE);
            // set the current player to the fourth ace player (which will take care of assigning all other partner properties)
            // no need to choose trump or partner, so we can start playing the game with the fourth ace player to play first!!
            // replacing: this._startPlaying(this.fourthAcePlayer);
        }else
            this.state=PlayerGame.BIDDING;
    }

    /**
     * returns an array with possible bid numbers
     */
    _getPossibleBids(){
        let possibleBids=[PlayerGame.BID_PAS]; // player can always pass!!
        // this._highestBid contains the highest bid so far
        let possibleBid=this._highestBid+(PlayerGame.BIDS_ALL_CAN_PLAY.indexOf(this._highestBid)<0);
        while(possibleBid<PlayerGame.BID_TROELA){possibleBids.push(possibleBid);possibleBid++;}
        this.log("Possible bids equal to or higher than "+this._highestBid+": ",possibleBids);
        return possibleBids;
    }

    /**
     * returns 0 when the player cannot ask for the partner card anymore, 1 if he can ask for it non-blind, -1 when it has to be asked blind
     */
    _canAskForPartnerCard(){
        // theoretically the card can be played but it might be the card with which the partner card is asked!!
        // is this a game where there's a partner card that hasn't been played yet
        // alternatively put: should there be a partner and there isn't one yet?????
        let trumpPlayer=this.getTrumpPlayer();
        if(trumpPlayer===this._player){ // this is trump player is playing the first card
            if(!this._arePartnersKnown){ // partner not known yet, therefore the partner card has not been played yet
                // asking for the partner card is only possible when the player does not have the partner cards anymore
                if(this._players[this._player].getNumberOfCardsWithSuite(this.getPartnerSuite())>0){
                    this.log("Current player is the trump player and can ask for the partner card.");
                    return 1;
                }
                this.log("Current player can ask for the partner card blind!");
                return -1;
            }
            this.log("Partner known, so no need to ask for the partner card anymore!");
        }else
            this.log("Current player ("+this._player+") NOT the trump player ("+trumpPlayer+").");
        return 0;
    }
    /**
     * returns a user friendly array of player bids objects
     */
    _getPlayerBidsObjects(){
        let playerBidsObjects=[];
        this._playersBids.forEach((playerBids)=>{
            let playerBidsObject={name:this._players[playerBidsObjects.length].name,bids:[]};
            // use unshift NOT push as the bids are stored reverse order 
            playerBids.forEach((playerBid)=>{playerBidsObject.bids.unshift(PlayerGame.BID_NAMES[playerBid])});
            playerBidsObjects.push(playerBidsObject);
        });
        return playerBidsObjects;
    }
    /**
     * returns a user friendly object of the cards in the trick so far (by player name)
     */
    _getTrickObjects(){
        let trickObjects=[];
        for(let trickCardIndex=0;trickCardIndex<this._trick.numberOfCards;trickCardIndex++)
            trickObjects.push({
                name:this._players[(trickCardIndex+this._trick.firstPlayer)%this.numberOfPlayers].name,
                card:this._trick._cards[trickCardIndex]
            });
        return trickObjects;
    }

    /**
     * determine how many tricks each player should win, to win in the game
     * and registers these with the given player
     */
    _setNumberOfTricksToWin(){
        for(let playerIndex=0;playerIndex<this.numberOfPlayers;playerIndex++){
            let player=this._players[playerIndex];
            player.setNumberOfTricksToWin(-1); // don't care how many
            if(this._highestBid!==PlayerGame.BID_LAATSTE_SLAG_EN_SCHOPPEN_VROUW){ // at least one person is 'playing' something
                if(this._partnerSuite>=0){ // some game that involves working together
                    player.setNumberOfTricksToWin(player.isFriendly(this.getTrumpPlayer())>0?8:6);
                }else // a solitary game
                if(this._highestBidPlayers.indexOf(playerIndex)>=0){ // one of the 'players'
                    switch(this._highestBid){
                        case PlayerGame.BID_MISERE:case PlayerGame.BID_OPEN_MISERE:case PlayerGame.BID_OPEN_MISERE_MET_EEN_PRAATJE: // zero trick game
                            player.setNumberOfTricksToWin(0);
                            break;
                        case PlayerGame.BID_PICO: // one trick game
                            player.setNumberOfTricksToWin(1);
                            break;                           
                        case PlayerGame.BID_NEGEN_ALLEEN:case PlayerGame.BID_NEGEN_ALLEEN_BETER: // nine trick gam
                            player.setNumberOfTricksToWin(9);
                            break;
                        case PlayerGame.BID_TIEN_ALLEEN:case PlayerGame.BID_TIEN_ALLEEN_BETER: // ten trick game
                            player.setNumberOfTricksToWin(10);
                            break;
                        case PlayerGame.BID_ELF_ALLEEN:case PlayerGame.BID_ELF_ALLEEN_BETER: // eleven trick game
                            player.setNumberOfTricksToWin(11);
                            break;
                        case PlayerGame.BID_TWAALF_ALLEEN:case PlayerGame.BID_TWAALF_ALLEEN_BETER: // twelve trick game
                            player.setNumberOfTricksToWin(12);
                            break;
                        case PlayerGame.BID_DERTIEN_ALLEEN:case PlayerGame.BID_DERTIEN_ALLEEN_BETER: // thirteen trick game
                            player.setNumberOfTricksToWin(10);
                            break;
                    }
                }
            }else // any trick game
                player.setNumberOfTricksToWin(14); // undeterminate indicating as little as possible
        }
    }

    // a separate method now so we can override it to do some more
    askPlayerForBid(){
        this._players[this._player].makeABid(this._getPlayerBidsObjects(),this._getPossibleBids());
    }

    set state(newstate){
        let oldstate=this._state;
        this._state=newstate;
        // respond to the change of state BUT always call the event listener no matter what goes wrong along the way
        try{
            // if there's a state change listener, play 'online', otherwise play through the console
            switch(this._state){
                case PlayerGame.IDLE:
                    // if failing to initialize the game I'm out of order!!!
                    if(!this._gameInitialized())this.state=PlayerGame.OUT_OF_ORDER;
                    break;
                case PlayerGame.DEALING:
                    // let's tell the players that a new game is starting
                    this._players.forEach((player)=>{player.newGame();});
                    this.deckOfCards.shuffle(this._shuffleCount,this._topopMinimum,this._topopMaximum); // shuffle the cards again
                    if(this.dealCards())this._startTheGame();else console.error("Failed to deal the cards.");
                    break;
                case PlayerGame.BIDDING:
                    {
                        this._player=(this.dealer+1)%this.numberOfPlayers;
                        this.log("The first player to bid: ",this._player);
                        this._highestBid=0;
                        this._highestBidPlayers=[]; // no highest bid players yet
                        this.askPlayerForBid();
                    }
                    break;
                case PlayerGame.PLAYING:
                    {
                        this._setNumberOfTricksToWin();
                        // it's always possible to ask for the partner card blind, when there's trump!!!
                        // unless the partner card has already been played, or when the 'rikker' still has trumps!!!!
                        // if there's a partner suite (and rank) we have to check whether or not it was played or not
                        ////////this._partnerCardPlayedStatus=(this._partnerSuite>=0?0:-1); // keep track of whether the partner card was played
                        this.log("Let the games begin!");
                        this._trick=new Trick(this._player,this.getTrumpSuite(),this.getPartnerSuite(),this.getPartnerRank(),this._canAskForPartnerCard()); // replacing: this._trumpSuite,this._partnerSuite,this._partnerRank,this._getTrumpPlayer()); // replacing: this._canAskForPartnerCardBlind());
                        this._players[this._player].playACard(this._trick);
                    }
                    break;
                case PlayerGame.CANCELING:
                    // this is a pre-state of FINISHED where not all the player cards are in the tricks
                    // reposses the cards from the players
                    this._players.forEach((player)=>{while(1){let card=player.getFirstCard();if(!card)break;card.holder=this.deckOfCards;}});
                    this.log("Number of cards repossessed from the players: "+this.deckOfCards.numberOfCards+".");
                    this.state=PlayerGame.FINISHED; // to get the event listener informed as well (before tricks are cleared!)
                    break;
                case PlayerGame.FINISHED:
                    if(this._tricks.length==13){
                        // determine the points won and adjust the points
                        let pointsWon=0;
                        let pointsToWinOffset=PlayerGame.BID_POINTS[this._highestBid];
                        let tricksToWin=(this._highestBidPlayers.length>0?this._players[this._highestBidPlayers[0]].numberOfTricksToWin:0);
                        // we're going to compute the delta points i.e. what each player will win (or loose)
                        this._deltaPoints=[0,0,0,0];
                        let aSolitaryGame=true;
                        switch(this._highestBid){
                            case PlayerGame.BID_TROELA:case PlayerGame.BID_RIK:case PlayerGame.BID_RIK_BETER: // single highest bidder
                                aSolitaryGame=false; // not played alone
                            case PlayerGame.BID_NEGEN_ALLEEN:case PlayerGame.BID_NEGEN_ALLEEN_BETER:
                            case PlayerGame.BID_TIEN_ALLEEN:case PlayerGame.BID_TIEN_ALLEEN_BETER:
                            case PlayerGame.BID_ELF_ALLEEN:case PlayerGame.BID_ELF_ALLEEN_BETER:
                            case PlayerGame.BID_TWAALF_ALLEEN:case PlayerGame.BID_TWAALF_ALLEEN_BETER:
                            case PlayerGame.BID_DERTIEN_ALLEEN:case PlayerGame.BID_DERTIEN_ALLEEN_BETER:
                                let numberOfTricksWonByHighestBidder=this._players[this._highestBidPlayers[0]].getNumberOfTricksWon();
                                pointsWon=(numberOfTricksWonByHighestBidder>=tricksToWin?pointsToWinOffset+numberOfTricksWonByHighestBidder-tricksToWin:numberOfTricksWonByHighestBidder-tricksToWin-pointsToWinOffset);
                                if(aSolitaryGame){
                                    for(let player=0;player<4;player++)
                                        if(player==this._highestBidPlayers[0])
                                            this._deltaPoints[player]+=(3*pointsWon);
                                        else
                                            this._deltaPoints[player]-=pointsWon;
                                }else{ // played with partner, so the highest bidder and the partner get pointsWon and the others give pointsWon
                                    for(let player=0;player<4;player++)
                                        if(player==this._highestBidPlayers[0]||player==this._players[this._highestBidPlayers[0]].partner)
                                            this._deltaPoints[player]+=pointsWon;
                                        else
                                            this._deltaPoints[player]-=pointsWon;
                                }
                                break;
                            case PlayerGame.BID_LAATSTE_SLAG_EN_SCHOPPEN_VROUW:
                                // the last trick winner has to pay the other players
                                let lastTrickWinner=this._tricks[12].winner;
                                for(let player=0;player<4;player++)
                                    if(player==lastTrickWinner)
                                        this._deltaPoints[player]-=(3*pointsToWinOffset);
                                    else
                                        this._deltaPoints[player]+=pointsToWinOffset;
                                // the winner of the 'schoppen vrouw' trick also has to pay the other players
                                let schoppenVrouwWinner=-1;
                                for(let trick=0;trick<12;trick++){
                                    if(this._tricks[trick].containsCard(Card.SUITE_SPADE,Card.RANK_QUEEN)){
                                        schoppenVrouwWinner=this._tricks[trick].winner;
                                        break;
                                    }
                                }
                                for(let player=0;player<4;player++)
                                    if(player==schoppenVrouwWinner)
                                        this._deltaPoints[player]-=(3*pointsToWinOffset);
                                    else
                                        this._deltaPoints[player]+=pointsToWinOffset;
                                break;
                            // the rest of the games (without trump) can be played by multiple players at the same time
                            // with points won by any of the highest bid players
                            case PlayerGame.BID_PICO:
                                for(let highestBidPlayer=0;highestBidPlayer<this._highestBidPlayers.length;highestBidPlayer++){
                                    let deltaWon=Math.abs(this._players[this._highestBidPlayers[highestBidPlayer]].getNumberOfTricksWon()-1);
                                    pointsWon=(deltaWon?1-pointsToWinOffset-deltaWon:pointsToWinOffset);
                                    for(let player=0;player<4;player++)
                                        if(player==this._highestBidPlayers[this.highestBidPlayer])
                                            this._deltaPoints[player]+=(3*pointWon);
                                        else
                                            this._deltaPoints[player]-=pointsWon;
                                }
                                break;
                            case PlayerGame.BID_MISERE:case PlayerGame.BID_OPEN_MISERE:case PlayerGame.BID_OPEN_MISERE_MET_EEN_PRAATJE:
                                for(let highestBidPlayer=0;highestBidPlayer<this._highestBidPlayers.length;highestBidPlayer++){
                                    // every trick one is one too many
                                    let deltaWon=this._players[this._highestBidPlayers[highestBidPlayer]].getNumberOfTricksWon();
                                    pointsWon=(deltaWon?1-pointsToWinOffset-deltaWon:pointsToWinOffset);
                                    for(let player=0;player<4;player++)
                                        if(player==this._highestBidPlayers[this.highestBidPlayer])
                                            this._deltaPoints[player]+=(3*pointsWon);
                                        else
                                            this._deltaPoints[player]-=pointsWon;
                                }
                                break;
                        }
                        for(let player=0;player<4;player++)
                            this._points[player]+=this._deltaPoints[player];
                    }else // incomplete game so ascertain to have no delta points
                        this._deltaPoints=null;
                    break;
            }

        }finally{
            if(this._eventListener)this._eventListener.stateChanged(oldstate,this._state);
        }
   }

   // expose the current points each player has
   getPoints(){return this._points.slice(0);} // returns a copy of the current set of points
   get points(){return this.getPoints();}

   // and the results of the points won/lost in the last game (if any)
   getDeltaPoints(){return(this._deltaPoints?this._deltaPoints.slice(0):null);}
   get deltaPoints(){return this.getDeltaPoints();} // a getter for the time being

   /**
    * starts playing with player to start playing
    * @param {*} player 
    */
    _startPlaying(player){
       this._player=player;
       this.state=PlayerGame.PLAYING;
    }
    /**
     * determines the rank of the partner card to be asked for
     */
    _getPartnerRank(){
        // NOTE the player playing 'rik' cannot have 3 aces, so unless the player has 4 aces there's always an ace to ask (even blind)
        //      it's different for the kings though, as this player could have 3 kings
        // TODO need to check for that as well
        let player=this._players[this._player];
        let partnerRank=(player?Card.RANK_ACE:-1);
        while(partnerRank>=0){
            let partnerSuites=player.getSuitesWithRank(partnerRank); // all the suites with that rank
            // remove trump suite
            let partnerTrumpSuiteIndex=partnerSuites.indexOf(this._trumpSuite);
            if(partnerTrumpSuiteIndex>=0)partnerSuites.splice(partnerTrumpSuiteIndex,1);
            if(partnerSuites.length<3)break; // if less than three left it's selectable
            partnerRank--;
        }
        return partnerRank;
    }

    static _capitalize(str){return(str?(str.length?str[0].toUpperCase()+str.slice(1):""):"?");}

    /**
     * setter for setting the trump suite
     * if the game played is not played by a single person (without a partner), the partner suite is requested next passing the rank of the card to ask for
     * @param {*} trumpSuite 
     */
    _setTrumpSuite(trumpSuite){
        // ASSERT shouldn't be called when the bid is 'troela'
        if(this._highestBid===PlayerGame.BID_TROELA)throw new Error("Setting the trump suite this way not allowed when playing 'troela'!");
        this._trumpSuite=trumpSuite;
        if(this._trumpSuite<0){
            console.error("Cannot remove the trump suite this way!");
            return;
        }
        this._partnerRank=-1; // safety measure 
        this.log(">>> "+RikkenTheGame._capitalize(Card.SUITE_NAMES[this._trumpSuite])+" selected as trump playing '"+PlayerGame.BID_NAMES[this._highestBid]+"'.");
        // is this a trump game with a partner (ace/king) to ask for?
        // I guess we can pass along the rank, which means we can choose the rank ourselves
        if(this._highestBid==PlayerGame.BID_RIK||this._highestBid==PlayerGame.BID_RIK_BETER){ // yes, a regular 'rik'
            this._partnerRank=this._getPartnerRank();
            this.log(">>> Partner card rank: "+Card.RANK_NAMES[this._partnerRank]+".");
            let ranklessSuites=this._players[this._player].getSuitesWithoutRank(this._partnerRank);
            ranklessSuites[this.getTrumpSuite()]=-1; // can't choose trump!!
            this._players[this._player].choosePartnerSuite(ranklessSuites,this._partnerRank); /// replacing: DUTCH_RANK_NAMES[this._partnerRank]); // passing along the rank of the card the user can choose
        }else // a solitary play, so we can start playing immediately
            this._startPlaying((this.dealer+1)%this.numberOfPlayers);
    }
    /**
     * setter for setting the parent card suite
     * @param {*} trumpPlayer the player who will be playing the trump game (apart from with 'troela' the current player)
     * @param {*} partnerSuite 
     */
    _setPartnerSuite(trumpPlayer,partnerSuite){
        // IMPORTANT this._player has to be set to the trump player before calling _setPartnerSuite
        if(partnerSuite>=0&&this._partnerRank<=0)
            throw new Error("Can't accept the partner card suite without a partner card rank!");
        this._partnerSuite=partnerSuite;
        this._partners=null; // precaution
        if(this._partnerSuite>=0){
            this.log("Selected partner suite: "+Card.SUITE_NAMES[this._partnerSuite]+".");
            // here we can determine who will be the partner and register that!!!
            let partner=this.getPlayerWithCard(this._partnerSuite,this._partnerRank);
            if(partner<0){
                this.log("BUG: Partner with "+Card.SUITE_NAMES[this._partnerSuite]+" "+Card.RANK_NAMES[this._partnerRank]+" not found!");
                return;
            }
            this._setPartners(trumpPlayer,partner);
            /* replacing:
                partnerPlayer.partner=this._player;
                this.log("Partner of "+this.getPlayerName(this._player)+": "+partnerPlayer.name+"'.");
            */
        }
    }
    
    /**
     * determines the possible trump suites the current player may choose
     */
    _getPossibleTrumpSuites(){
        return this.getSuites();
    }
    /**
     * determines the possible partner suites the current player may choose
     */
    _getPossibleParentSuites(){

    }

    _doneBidding(){
        // ASSERT should not be called when playing 'troela'
        this.log("Bidding is over, determine whether to ask for trump or the partner card...");
        // the player next to the dealer is always the player to start playing
        if(this._highestBid!=PlayerGame.BID_PAS){
            // is it a trump game?
            if(PlayerGame.BIDS_ALL_CAN_PLAY.indexOf(this._highestBid)<0){ // yes
                // if the trump is not known we have to ask for the trump suite (color) first
                this._player=this._highestBidPlayers[0]; // required by _setTrumpSuite as well
                if(PlayerGame.BIDS_WITH_PARTNER_IN_HEARTS.indexOf(this._highestBid)<0){
                    // pass along all the suites the player has (from which to choose from)
                    this._players[this._player].chooseTrumpSuite(this._players[this._player].getSuites());
                }else // trump is known (which can only be hearts) TODO what if this player does not have any trump cards?????????
                    this._setTrumpSuite(Card.SUITE_NAMES.indexOf("heart")); // set the trump suite directly!!!
            }else // not a trump suite
                // played by the highest bidder(s) on his own
                this._startPlaying((this.dealer+1)%this.numberOfPlayers);
        }else{ // everybody passed, so also not a trump suite
            this._highestBid=PlayerGame.BID_LAATSTE_SLAG_EN_SCHOPPEN_VROUW;
            // everybody is playing for him/herself i.e. nobody has a partner
            this._startPlaying((this.dealer+1)%this.numberOfPlayers);
        }
    }
    // check whether 'troela', and if so initialize the play accordingly
    _checkForTroela(){
        let threeAcePlayer=-1,oneAcePlayer=-1; // determine the player with 1 and 3 aces
        let oneAceSuite=-1; // if a player has one ace remember which ace
        for(let player=this.numberOfPlayers-1;player>=0;player--){
            // get the aces the player has
            let aceSuites=this._players[player].getSuitesWithRank(Card.RANK_ACE);
            let aces=aceSuites.length;
            this.log("Number of aces in "+this._players[player].name+"'s hand: "+aces+".");
            if(aces==0)continue; // (OOPS almost forgot this one) still possible
            if(aces==2||aces==4)break; // if a player has either 2 or 4 aces no player can have 3
            if(aces==1){oneAcePlayer=player;oneAceSuite=aceSuites[0];}else threeAcePlayer=player;
        }
        if(threeAcePlayer>=0){
            this._highestBidPlayers=[threeAcePlayer]; // TODO perhaps this should be done elsewhere?????
            this._fourthAcePlayer=oneAcePlayer;
            // NOTE with troela do NOT call _setTrumpSuite() as that would start playing immediately (which we don't want to)
            this._trumpSuite=oneAceSuite;
            this._highestBid=PlayerGame.BID_TROELA; // OOPS should be _highestBid!!
        }else
            this._fourthAcePlayer=-1;
    }

    // public methods

    // getters
    get state(){return this._state;} 

    logBids(){
        this.log("Bids after the bid by player "+this._players[this._player].name+":");
        for(let player=0;player<this._playersBids.length;player++){
            this.log("\t"+this._players[player].name+":");
            if(this._playersBids&&Array.isArray(this._playersBids)&&this._playersBids.length>player)
                this.log("\t\t",this._playersBids[player]);
            else
                this.log("\t\t(invalid)");
        }
    }

    // PlayerEventListener implementation
    bidMade(bid){
        // 1. register the bid
        ////////now passed in as argument: let bid=this._players[this._player].bid; // collect the bid made by the current player
        this.log("Bid by "+this._players[this._player].name+": '"+PlayerGame.BID_NAMES[bid]+"'.");

        // TODO check whether this bid is actually higher than the highest bid so far (when not a pass bid)
        if(this._playersBids&&Array.isArray(this._playersBids)&&this._playersBids.length>this._player){
            this._playersBids[this._player].unshift(bid); // prepend the new bid to the bids of the current player
            this.logBids(); // show the current bids
        }else{
            console.error("BUG: Unable to store the bid!");
            return;
        }
        // 2. check if this bid ends the bidding
        if(bid!=PlayerGame.BID_PAS){
            ////// WRONG!!!!! this._passBidCount=0; // start counting over
            // a new accepted bid is always the highest bid
            if(bid<this._highestBid)throw new Error("Invalid bid!");
            if(bid==this._highestBid){ // same as before
                if(PlayerGame.BIDS_ALL_CAN_PLAY.indexOf(bid)<0)throw new Error("You cannot make the same bid!");
                this._highestBidPlayers.push(this._player);
            }else{ // a higher bid
                this._highestBid=bid; // remember the highest bid so far
                this.log("Highest bid so far: "+PlayerGame.BID_NAMES[this._highestBid]+".");
                this._highestBidPlayers=[this._player]; // the first one to bid this
                // if this was the highest possible bid we're done
                if(PlayerGame.BID_RANKS[bid]==PlayerGame.BID_TROELA){ // highest possible player bid (which is played solitary)
                    this.state=PlayerGame.PLAYING; // was PLAY_REPORTING but not used anymore
                }
            }
        }
        // 3. if still in the bidding state, ask the next player that is still allowed to bid for a bid
        if(this._state==PlayerGame.BIDDING){
            // count the number of pass bids we have
            let passBidCount=0;
            let player=this.numberOfPlayers;
            while(--player>=0){
                //////this.log("Checking player bids: ",this._playersBids[player]);
                if(this._playersBids[player].length==0){passBidCount=0;break;} // somebody yet to bid
                if(this._playersBids[player][0]===PlayerGame.BID_PAS)passBidCount++;
            }
            // if we have a total of 3 pass bids, bidding is over
            if(passBidCount<3){ // there must still be another player that can bid
                this.log("Last bid done by player "+this._player+".");
                // find the next player that is allowed to bid (should be there)
                let player=this._player;
                while(1){
                    player=(player+1)%this.numberOfPlayers;
                    //////if(player===this._player)break; // nobody was allowed to bid anymore
                    if(this._playersBids[player].length==0)break; // when no bid so far, this is the one to ask next
                    if(this._playersBids[player][0]!=PlayerGame.BID_PAS)break; // if bid before and not passed this is the one to ask next
                    this.log("Player '"+this._players[player].name+"' can't bid anymore!");
                }
                /////if(player!==this._player){ // another player can still bid
                    this._player=player;
                    this.log("Player "+this._player+"next to bid!");
                    // NOTE could have done this by: this.state=BIDDING;
                    this.askPlayerForBid();
                /////}    
            }else
                this._doneBidding();
        }
    }

    /**
     * to be called by the player with the highest bid when selecting the trump suite
     */
    trumpSuiteChosen(chosenTrumpSuite){this._setTrumpSuite(chosenTrumpSuite);}
    /**
     * to be called by the player with the highest bid when selecting the partner suite
     */
    partnerSuiteChosen(chosenPartnerSuite){
        this._setPartnerSuite(this._player,chosenPartnerSuite);
        // player left from the dealer to start playing the first trick
        this._startPlaying((this.dealer+1)%this.numberOfPlayers);
    }

    getTrickAtIndex(index){return(index>=0&&index<this._tricks.length?this._tricks[index]:null);}

    // MDH@14JAN2020: adding the 'flag' indicating whether or not the partner card is being asked
    //                NOTE this is only allowed though when this is the first card and the partner card
    //                     can be asked for as is determined by the _canAskForPartnerCard flag in the trick
    // MDH@18JAN2020: CORRECTION: askingForPartnerCard reflects the state of the check box in the UI
    //                and if the player plays the partner card suite (s)he is asking for the ace!!!!
    cardPlayed(card,askingForPartnerCard){
        this.log("Card played (asking for partner card: "+askingForPartnerCard+").");
        let numberOfPlayerCards=this._players[this._player].numberOfCards;
        
        // MDH@14JAN2020: if the user didn't uncheck the ask-partner-card (s)he is asking for the partner card
        this._trick.askingForPartnerCard=askingForPartnerCard;
        
        ////////////////// now passed in as argument!!!! let card=this._players[this._player].card;
        // move the card into the trick (effectively removing it from the player cards)
        this._trick.addCard(card);
        if(card._holder!==this._trick)throw new Error("Failed to add the card to the trick!");
        if(this._players[this._player].numberOfCards>=numberOfPlayerCards)throw new Error("Played card not removed from player hand!");
        // is the trick complete?
        if(this._trick.numberOfCards==4){
            // 1. determine whether this trick contains the partner card of the highest bidder
            if(this._partners){ // a non-solitary game
                let partnerCardPresentInTrick=this._trick.containsCard(this.getPartnerSuite(),this.getPartnerRank());
                ////////if(partnerCardPresentInTrick)this.log(">>>> Partner card detected! <<<<");
                // serious error if it should have been there and it wasn't!!
                if(this._trick.askingForPartnerCard!=0) // it was asked for
                    if(!partnerCardPresentInTrick)
                        throw new Error("The partner card was asked for, but was not present in the trick though.");
                if(partnerCardPresentInTrick){
                    // if the partners are now known yet (in a regular rik situation then)
                    if(!this._arePartnersKnown)this._tellPlayersWhoTheirPartnerIs();
                }
            }
            /* replacing:
            // NOTE if this._trick.askingForPartnerCard is not zero, it should!!!
            let partner=-1;
            ////if(this._partnerCardPlayedStatus==0){ // partner card not received yet
                partner=this._trick.getCardPlayer(this._partnerSuite,this._partnerRank);
                if(partner>=0){
                    this.log(">>>> Partner card detected! Will create the teams!");
                    ///////this._partnerCardPlayedStatus=1; // this means the user cannot ask for this card again!!!
                    // the partner is now known, so everyone now knows its partner
                    this._setPartners(this._highestBidPlayers[0],partner);
                    // TODO the other two should also point to each other
                }else
                if(this._trick.askingForPartnerCard!=0){
                    alert("Er is"+(this._trick.askingForPartnerCard<0?" (blind)":"")+" om de "+DUTCH_SUITE_NAMES[this.getPartnerSuite()]+" "+DUTCH_RANK_NAMES[this.getPartnerRank()]+" gevraagd maar die is niet gevallen. De slag moet over vanaf de eerste kaart!");
                    // we have to give card of the second, third and fourth player back
                    let cardIndex=4;
                    while(--cardIndex>0)this._trick._cards[cardIndex].holder=this._players[(this._trick._firstPlayer+cardIndex)%this.numberOfPlayers];
                    return;
                }
            /////}
            */
            // 2. register the trick
            this._tricks.push(this._trick); // register the trick
            // MDH@06DEC2019: the trick now itself keeps track of the winner card, so no need to do it here anymore
            // the player to start the next trick is the winner
            this._player=this._trick.winner;
            this._players[this._player].trickWon(this._tricks.length);
            this.log("The trick was won by player #"+this._player+": '"+this._players[this._player].name+"'.");
            /* MDH@06DEC2019 replacing:
            // who won the trick?????
            // the first player of the trick determines the play suite 
            // BUT could be asking for the partner ace/king blind)
            //     in that case that player can never win the trick but the partner would
            if(this._askingForThePartnerCardBlind){
                if(partner>=0){
                    this._players[partner].trickWon(this._tricks.length);
                    this._player=partner;
                }else
                    console.error("Asking for the partner card blind, but partner card not in trick!!!!");
            }else{
                let highestCardPlayer=0;
                for(let player=1;player<4;player++)
                    if(compareCardsWithPlayAndTrumpSuite(this._trick._cards[player],this._trick._cards[highestCardPlayer],this._trick.playSuite,this._trumpSuite)>0)
                        highestCardPlayer=player;
                // the player to start the next trick is the winner
                this._player=(highestCardPlayer+this._trick.firstPlayer)%4;
                this._trick.winner=this._player; // store the winner in the trick!!!
                // register the trick with the player who won
                this._players[this._player].trickWon(this._tricks.length);
                this.log("The trick was won by player #"+highestCardPlayer+": '"+this._players[highestCardPlayer].name+"'.");
            }
            */
            // game over?????? i.e. all 13 tricks complete
            if(this._tricks.length==13){
                this.state=PlayerGame.FINISHED;
                return;
            }
            // initialize a new trick with the first player to play
            this._trick=new Trick(this._player,this.getTrumpSuite(),this.getPartnerSuite(),this.getPartnerRank(),this._canAskForPartnerCard()); // replacing: this._trumpSuite,this._partnerSuite,this._partnerRank,this._getTrumpPlayer()); // replacing: this._canAskForPartnerCardBlind());
        }else // not yet, more cards to play in this trick
            this._player=(this._player+1)%4;
        // and ask the new current player to play a card
        this._players[this._player].playACard(this._trick); // replacing: _getTrickObjects(),this._trick.playSuite,this._trick.canAskForPartnerCardBlind);
    }
    // end PlayerEventListener implementation

    // 'private' methods
    dealBy(numberOfCards){
        for(let clockwisePlayer=1;clockwisePlayer<=this.numberOfPlayers;clockwisePlayer++){
            // 'pop' off numberOfCards per player
            let player=this._players[(clockwisePlayer+this.dealer)%this.numberOfPlayers];
            let cardsLeftToDeal=numberOfCards;
            while(--cardsLeftToDeal>=0){
                this.log("Deck of cards to deal from: ",this.deckOfCards);
                let cardToDeal=this.deckOfCards.getFirstCard();
                if(!cardToDeal){console.error("No further cards to deal.");return false;}
                if(!(cardToDeal instanceof HoldableCard)){
                    console.error("Card to deal "+cardToDeal+" (with constructor "+cardToDeal.constructor.name+") not holdable!");return false;
                }
                this.log("Dealing #"+cardsLeftToDeal+" ("+cardToDeal.toString()+") to "+player.toString()+".");
                cardToDeal.holder=player;
                if(cardToDeal._holder!==player){
                    console.error("\tFailed to deal card "+cardToDeal.toString()+".");
                    return false;
                }
            }
        }
        return true;
    }

    logHands(){
        this._players.forEach((player)=>{this.log("Hand of "+player+": ")+player.getTextRepresentation(true);});
    }

    dealCards(){
        this.log("Cards to deal: ",this.deckOfCards);
        // every player is to get 13 cards (first seven than six)
        if(!this.dealBy(7)||!this.dealBy(6))return false;
        // let's sort the hands (for convenience)
        this._players.forEach((player)=>{player._cards.sort(Card.compareCards);});
        this.logHands();
        return true;
    }

    /**
     * when it's clear what game to play set it to play
     */
    /*
    playTheGame(){
        // 1. determine the first player
        // the player after the dealer plays the first card unless we're playing 'troela'
        this._player=(this.fourthAcePlayer>=0?this.fourthAcePlayer:(this.dealer+1)%this.players.length);
        // 2. prepare for collecting the tricks
        // who wins the trick starts first next
        // NOTE because the players take turn we can play the game synchronously!!!!
        this.tricks=[]; // the tricks played
        let numberOfTricksLeftToPlay=this._players[0]._cards.length;
        this.trick=new Trick(); // the current trick
        // and start expecting cards
        this.state=PLAYING;
    }
    // to receive a new bid (by the current player), assign to bid 
    set bid(newbid){
        if(newbid!=BID_PAS){
            // must be larger than the last bid received
            if(BID_RANKS[newbid]>BID_RANKS[this._bid]){
                this._bid=newbid;
            }
        }else{
            this._passbidcount++;
        }
    }
    */

    getBid(){return this._bid;}
    get bid(){return this.getBid();} // the bid so far

    getPlayer(){return this._player;}
    get player(){return this.getPlayer();}

    getTrumpSuite(){return this._trumpSuite;}
    getPartnerSuite(){return this._partnerSuite;}
    getPartnerRank(){return this._partnerRank;}
    getFourthAcePlayer(){return this._fourthAcePlayer;}

    start(){
        if(this._state!==PlayerGame.IDLE)this.state=PlayerGame.IDLE; // if not in the IDLE state go there first
        if(this._state===PlayerGame.IDLE)this.state=PlayerGame.DEALING; // only from the IDLE state can we start dealing
    }

    cancel(){
        if(this._state===PlayerGame.BIDDING||this._state===PlayerGame.PLAYING)
            this.state=PlayerGame.CANCELING;
        else
            alert("Unable to cancel the game!");
    }

}

module.exports = {RikkenTheGameEventListener,RikkenTheGame};