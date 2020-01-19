(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.setPlayerName = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * definition of a playing Card
 */
class Card{

    static get SUITE_NAMES(){return ["diamond","club","heart","spade"];}
    static get RANK_NAMES(){return ["2","3","4","5","6","7","8","9","10","jack","queen","king","ace"];}
    // shorthand 'characters' for textual representation
    // NOT WORKING: const CARD_SUITE_CHARACTERS=[String.fromCharCode(2666),String.fromCharCode(2663),String.fromCharCode(2665),String.fromCharCode(2660)];
    static get SUITE_CHARACTERS(){return ['\u2666','\u2663','\u2665','\u2660']}; // YES, WORKING!!!!!
    static get SUITE_DIAMOND(){return 0;};
    static get SUITE_CLUB(){return 1;};
    static get SUITE_HEART(){return 2;};
    static get SUITE_SPADE(){return 3;};
    static get RANK_CHARACTERS(){return ['2','3','4','5','6','7','8','9','10','B','V','K','A'];};
    static get RANK_TWO(){return 0;};
    static get RANK_THREE(){return 1;};
    static get RANK_FOUR(){return 2;};
    static get RANK_FIVE(){return 3;};
    static get RANK_SIX(){return 4;};
    static get RANK_SEVEN(){return 5;};
    static get RANK_EIGHT(){return 6;};
    static get RANK_NINE(){return 7;};
    static get RANK_TEN(){return 8;};
    static get RANK_JACK(){return 9;};
    static get RANK_QUEEN(){return 10;};
    static get RANK_KING(){return 11;};
    static get RANK_ACE(){return 12;};

    static compareCards(card1,card2){
        let deltaSuite=card1._cardSuiteIndex-card2._cardSuiteIndex;
        if(deltaSuite!=0)return deltaSuite;
        return card1._cardNameIndex-card2._cardNameIndex;
    }
    
    // in a trick the play suite determines what cards are to be played, the trump suite determines what trump is
    static compareCardsWithPlayAndTrumpSuite(card1,card2,playSuite,trumpSuite){
        // normally with any two regular cards they are never equal in a trick
        // cards that are neither play suite or trump suite is irrelevant
        let result=0;
        let type='-';
        // 1. if card1 is trump, and card2 is not or has a lower rank card1 wins
        if(card1.suite==trumpSuite){result=(card2.suite!=trumpSuite?1:card1.rank-card2.rank);type='A';}else
        // ASSERT card1 is NOT trump but card2 could still be trump
        if(card2.suite==trumpSuite){result=-1;type='B';}else
        // ASSERT neither card is trump, so could be play suite or not...
        if(card1.suite==playSuite){result=(card2.suite!=playSuite?1:card1.rank-card2.rank);type='C';}else
        // ASSERT card1 is not play suite, but card2 could be
        if(card2.suite==playSuite){result=-1;type='D';}
        console.log('>>> Type: '+type+': '+card1.getTextRepresentation()+"(suite: "+card1.suite+")"+(result>0?' > ':(result<0?' < ':' = '))+card2.getTextRepresentation()+" (suite: "+card2.suite+")"+" (play: "+(playSuite>=0?Card.SUITE_NAMES[playSuite]:"?")+", trump:"+((trumpSuite>=0?Card.SUITE_NAMES[trumpSuite]:"?"))+")");
        return result;
        /* replacing:
        // let's first recompute the suite of both cards and elevate trump cards, and deevaluate non playSuite cards
        let card1Suite=(card1.suite==trumpSuite?4:(card1.suite!=playSuite?-1:card1.suite));
        let card2Suite=(card1.suite==trumpSuite?4:(card2.suite!=playSuite?-1:card2.suite));
        if(card1Suite>=0||card2Suite>=0){ // at least one of the cards is play suite or trump suite
            // if the suites are the same the highest rank wins
            if(card1Suite<0)return -1; // if the first card is irrelevant, the first card is lower
            if(card2Suite<0)return 1; // if the second card is irrelevant, the first card is higher
            // ASSERT both cards are either play suite or trump suite
            if(card1Suite==card2Suite)return card1.rank-card2.rank;
            // ASSERT one card is play suite, the other must be trump suite
            return(card1Suite==4?1:-1);
        }
        */
        // ASSERT neither card is play suite or trump suite, both cards are irrelevant (should happen though)
        return 0; // considered equal that is irrelevant
    }
    
    // // you'd have to use the Apple Symbols font
    // <span class="pip">♥</span>
    // <li class="ace card"   >🂱</li><li class="king card"  >🂾</li><li class="queen card" >🂽</li><li class="jack card"  >🂻</li>
    // <li class="ten card"   >🂺</li><li class="nine card"  >🂹</li><li class="eight card" >🂸</li><li class="seven card" >🂷</li>
    // <li class="six card"   >🂶</li><li class="five card"  >🂵</li><li class="four card"  >🂴</li><li class="three card" >🂳</li>
    // <li class="two card"   >🂲</li>
    // <span class="pip">♣</span>
    // <li class="ace card"   >🃑</li><li class="king card"  >🃞</li><li class="queen card" >🃝</li><li class="jack card"  >🃛</li>
    // <li class="ten card"   >🃚</li><li class="nine card"  >🃙</li><li class="eight card" >🃘</li><li class="seven card" >🃗</li>
    // <li class="six card"   >🃖</li><li class="five card"  >🃕</li><li class="four card"  >🃔</li><li class="three card" >🃓</li>
    // <li class="two card"   >🃒</li>
    // <span class="pip">♦</span>
    // <li class="ace card"   >🃁</li><li class="king card"  >🃎</li><li class="queen card" >🃍</li><li class="jack card"  >🃋</li>
    // <li class="ten card"   >🃊</li><li class="nine card"  >🃉</li><li class="eight card" >🃈</li><li class="seven card" >🃇</li>
    // <li class="six card"   >🃆</li><li class="five card"  >🃅</li><li class="four card"  >🃄</li><li class="three card" >🃃</li>
    // <li class="two card"   >🃂</li>
    // <li class="ace card"   >🂡</li><li class="king card"  >🂮</li><li class="queen card" >🂭</li><li class="jack card"  >🂫</li>
    // <li class="ten card"   >🂪</li><li class="nine card"  >🂩</li><li class="eight card" >🂨</li><li class="seven card" >🂧</li>
    // <li class="six card"   >🂦</li><li class="five card"  >🂥</li><li class="four card"  >🂤</li><li class="three card" >🂣</li>
    // <li class="two card"   >🂢</li>
    static get CARD_APPLE_SYMBOLS(){return [
        ['🃂','🃃','🃄','🃅','🃆','🃇','🃈','🃉','🃊','🃋','🃍','🃎','🃁'],
        ['🃒','🃓','🃔','🃕','🃖','🃗','🃘','🃙','🃚','🃛','🃝','🃞','🃑'],
        ['🂲','🂳','🂴','🂵','🂶','🂷','🂸','🂹','🂺','🂻','🂽','🂾','🂱'],
        ['🂢','🂣','🂤','🂥','🂦','🂧','🂨','🂩','🂪','🂫','🂭','🂮','🂡']
    ]};

    constructor(cardSuiteIndex,cardNameIndex){
        this._cardSuiteIndex=cardSuiteIndex;
        this._cardNameIndex=cardNameIndex;
    }
    toString(){
        return Card.RANK_NAMES[this._cardNameIndex]+" of "+Card.SUITE_NAMES[this._cardSuiteIndex]+"s";
    }
    
    get rank(){return this._cardNameIndex;}
    get suite(){return this._cardSuiteIndex;}

    getTextRepresentation(){
        // if we're using the svg-cards.svg we can do the following, but in that case we'd need to know the magnification factor!!!
        //return CARD_FONT_CHARACTERS[this._cardSuiteIndex][this._cardNameIndex];
        //return '<svg viewBox="0 0 676 976"><use xlink:href="img/svg-cards.svg#'+SUITE_NAMES[this._cardSuiteIndex]+"-"+RANK_NAMES[this._cardNameIndex]+'</use></svg>';
        return Card.CARD_APPLE_SYMBOLS[this._cardSuiteIndex][this._cardNameIndex];
        //////return SUITE_CHARACTERS[this._cardSuiteIndex].concat(RANK_CHARACTERS[this._cardNameIndex]);
    }

}

module.exports=Card;
},{}],2:[function(require,module,exports){
/**
 * defines someone that holds cards
 */
const Card=require('./Card.js');

class CardHolder{

    log(tolog){
        // console.log(tolog);
    }
    
    // MDH@04DEC2019: allowing now to construct fixed size card holders (like Trick)
    constructor(numberOfCards=0){
        this._cards=[];
        this._numberOfCards=numberOfCards;
        while(--numberOfCards>=0)this._cards.push(null);
        this._sorted=false;
    }

    // methods to adjust the card collection
    _removeCard(card){
        let cardIndex=this._cards.indexOf(card);
        if(cardIndex>=0){
            if(this._cards.splice(cardIndex,1).length==1){
                this.log("Card "+card+" removed from "+this.toString()+" at index "+cardIndex+".");
                card._holder=null; // when successful apparently no longer available!!!
            }else
                console.error("Failed to remove card "+card+" at index "+cardIndex+" of "+this.toString()+".");
        }else
            console.error("Unable to remove card "+card+" from "+this.toString()+": it is not present.");
    }
    _addCard(card){
        if(!card)return;
        if(!(card instanceof HoldableCard))throw new Error("Not a holdable card!");
        this.log("Adding card "+card.toString()+" to "+this.toString()+".");
        let numberOfCardsNow=this.numberOfCards;
        this._cards.push(card);
        if(this.numberOfCards>numberOfCardsNow){
            this._sorted=false; // can no longer guarantee that it is sorted...
            card._holder=this;
            this.log("Card "+this.numberOfCards+" ("+card.toString()+") added to "+this.toString()+".");
            // how about ordering the cards?????? or storing them by suite????
            this.log("\tCard collection: "+this.getTextRepresentation()+".");
        }else
            console.error("Failed to add card "+card+" to "+this.toString()+" (delta number of cards: "+(this.numberOfCards-numberOfCardsNow)+").");
    }
    /*
    // replace a card at a given index (as used in Trick)
    _setCardAtIndex(card,index){
        if(index<0||index>=this.numberOfCards)throw new Error("Can't replace card #"+String(index+1)+".");
        let cardAtIndex=this._cards[index];
        if(cardAtIndex){cardAtIndex._holder=null;this._cards[index]=null;}
        if(card){
            // if 'contained' in another card holder remove it from there!!!
            try{
                if(card._holder)card._holder.removeCard(card);
                if(!card._holder){this._cards[index]=card;card._holder=this;}    
            }catch(error){}
        }
    }
    */
    // poll the card collection
    get numberOfCards(){return this._cards.length;}

    getCardsWithRank(rank){
        return this._cards.filter((card)=>{return card.rank==rank;});
    }
    getNumberOfCardsWithRank(rank){
        return this.getCardsWithRank(rank).length;
    }

    getNumberOfCardsWithSuite(suite){
        return this._cards.filter((card)=>{return card.suite==suite;}).length;
    }

    /**
     * returns the ids of the suites present
     */
    getSuites(){
        // can't use this in filter!!! return [0,1,2,3].filter((rank)=>{return this.getCardsWithRank(rank)>0;});
        let suites=[];
        this._cards.forEach((card)=>{if(suites.indexOf(card.suite)<0)suites.push(card.suite);});
        return suites;
    }
    /**
     * returns the number of cards in the holder with the given rank
     * @param {*} rank 
    */
    getSuitesWithRank(rank){
        let suites=[];
        this._cards.forEach((card)=>{if(card.rank===rank)suites.push(card.suite);});
        return suites;
    }
    /**
     * returning an array with all suites, with -1 where a suite is not present in the current cards 
     * @param {*} rank 
     */
    getSuitesWithoutRank(rank){
        let suites=[0,1,2,3];
        this._cards.forEach((card)=>{if(card.rank===rank)suites[card.suite]=-1;});
        return suites;
    }
    /**
     * returns the ids of the suites present of which the player does not have the the given rank
     */
    getRanklessSuites(rank){
        let ranklessSuites=[];
        let suitesWithRanks=[];
        this._cards.forEach(
            (card)=>{
                if(ranklessSuites.indexOf(card.suite)<0&&suitesWithRanks.indexOf(card.suite)<0){
                    if(card.cardNameIndex==rank){
                        suitesWithRanks.push(card.suite);
                        // remove the suite if already present
                        let ranklessSuiteIndex=ranklessSuites.indexOf(card.suite);
                        if(ranklessSuiteIndex>=0)ranklessSuites.splice(ranklessSuiteIndex,1);
                    }else // until proven differently
                        ranklessSuites.push(card.suite);
                }
            }
        );
        return ranklessSuites;
    }

    getFirstCard(){if(this._cards.length>0)return this._cards[0];}

    // MDH@20JAN2020: used in gameengine.js
    getLastCard(){if(this._cards.length>0)return this._cards[this._cards.length-1];}

    containsCard(suite,rank){
        let card=this._cards.length;
        while(--card>=0&&(this._cards[card].suite!==suite||this._cards[card].rank!==rank));
        return(card>=0); // found if card is not negative
    }

    // MDH@13JAN2020: we need this to find a specific card
    getCard(suite,rank){
        let cardIndex=this._cards.length;
        while(--cardIndex>=0){let card=this._cards[cardIndex];if(card.suite===suite&&card.rank===rank)return card;}
        return null;
    }

    /**
     * can expose a text represention
     */
    getTextRepresentation(suiteSeparator){
        this.log("Number of cards to represent: "+this._cards.length+".");
        // how about sorting???????? that would be nice
        if(suiteSeparator&&typeof suiteSeparator==="string"&&!this._sorted){
            this._cards.sort(compareCards);
            this._sorted=true;
        }
        if(!this._sorted)
            return this._cards.map((card)=>{return card.getTextRepresentation();}).join(" ");
        // cards are supposed to be sorted
        let textRepresentation="";
        if(this.numberOfCards>0){
            let card=this.getFirstCard();
            textRepresentation=card.getTextRepresentation();
            for(let cardIndex=1;cardIndex<this.numberOfCards;cardIndex++){
                textRepresentation+=(card.suite!=this._cards[cardIndex].suite?suiteSeparator:" ");
                textRepresentation+=this._cards[cardIndex].getTextRepresentation();
                card=this._cards[cardIndex];
            }
        }
        return textRepresentation; // a single blank between them!!!
    }

}

/**
 * a card with a card holder is held
 */
class HoldableCard extends Card{

    log(tolog){
        // console.log("HOLDABLECARD >>> "+tolog);
    }

    set holder(holder){
        this.log("Changing the holder of card "+this.toString()+".");
        // remove from the current holder (if any)
        if(this._holder)this._holder._removeCard(this);
        // add (when successfully removed) to the new holder (if any)
        if(!this._holder&&holder)holder._addCard(this);else this.log("ERROR: Unable to change the holder!");
    }

    constructor(cardSuiteIndex,cardNameIndex,holder){
        super(cardSuiteIndex,cardNameIndex);
        this._holder=null;
        this.holder=holder;
    }

    toString(){return "Holdable "+super.toString();}

}

module.exports={CardHolder,HoldableCard};
},{"./Card.js":1}],3:[function(require,module,exports){
/**
 * a placeholder for a player
 */
const Card=require('./Card.js');
const {CardHolder,HoldableCard}=require('./CardHolder.js');

/**
 * a Player can make a bid, or play a card, choose a trump and partner suite
 */
class PlayerEventListener{
    bidMade(bid){}
    cardPlayed(card,askingForPartnerCard){}
    trumpSuiteChosen(trumpSuite){}
    partnerSuiteChosen(partnerSuite){}
}

// MDH@07DEC2019: PlayerGame extends PlayerEventListener with game data exposed to player
//                which was earlier stored in each trick
class PlayerGame extends PlayerEventListener{
    static get BID_NAMES(){return ["pas","rik","rik (beter)","negen alleen","negen alleen (beter)","pico","tien alleen","tien alleen (beter)","elf alleen","elf alleen (beter)","mis\xe8re","twaalf alleen","twaalf alleen (beter)","open mis\xe8re","dertien alleen","dertien alleen (beter)","open mis\xe8re met een praatje","troela","om de schoppen vrouw en de laatste slag","om de laatste slag"];};
    static get BID_PAS(){return 0;};
    static get BID_RIK(){return 1;};
    static get BID_RIK_BETER(){return 2;};
    static get BID_NEGEN_ALLEEN(){return 3;};
    static get BID_NEGEN_ALLEEN_BETER(){return 4;};
    static get BID_PICO(){return 5;};
    static get BID_TIEN_ALLEEN(){return 6;};
    static get BID_TIEN_ALLEEN_BETER(){return 7;};
    static get BID_ELF_ALLEEN(){return 8;};
    static get BID_ELF_ALLEEN_BETER(){return 9;};
    static get BID_MISERE(){return 10;};
    static get BID_TWAALF_ALLEEN(){return 11;};
    static get BID_TWAALF_ALLEEN_BETER(){return 12;};
    static get BID_OPEN_MISERE(){return 13;};
    static get BID_DERTIEN_ALLEEN(){return 14;};
    static get BID_DERTIEN_ALLEEN_BETER(){return 15;};
    static get BID_OPEN_MISERE_MET_EEN_PRAATJE(){return 16;};
    static get BID_TROELA(){return 17;};
    static get BID_LAATSTE_SLAG_EN_SCHOPPEN_VROUW(){return 18;};
    static get BID_LAATSTE_SLAG(){return 19;};
    static get BIDS_ALL_CAN_PLAY(){return [PlayerGame.BID_PICO,PlayerGame.BID_OPEN_MISERE,PlayerGame.BID_OPEN_MISERE_MET_EEN_PRAATJE];}; // trumpless games
    static get BIDS_WITH_PARTNER_IN_HEARTS(){return [PlayerGame.BID_RIK_BETER,PlayerGame.BID_TIEN_ALLEEN_BETER,PlayerGame.BID_ELF_ALLEEN_BETER,PlayerGame.BID_TWAALF_ALLEEN_BETER,PlayerGame.BID_DERTIEN_ALLEEN_BETER];}; // games with trump played with a partner
    static get BID_RANKS(){return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,0,-1,-1];}; // how I played it (bid pass excluded (always rank 0))
    
    // each bid has a certain amount of points to receive when winning the game
    static get BID_POINTS(){return [0,1,1,3,3,4,4,4,5,5,5,6,6,6,7,7,10,2,2,2];}

    // the state constants we have
    static get OUT_OF_ORDER(){return 0;}
    static get IDLE(){return 1;}
    static get DEALING(){return 2;}
    static get BIDDING(){return 3;}
    static get PLAYING(){return 4;}
    static get CANCELING(){return 5;}
    static get FINISHED(){return 6;}
    getTrumpSuite(){}
    getPartnerSuite(){}
    getPartnerRank(){}
    getTrumpPlayer(){}
    getNumberOfTricksWonByPlayer(player){}
    getPartnerName(player){}
    getHighestBidders(){}
    getHighestBid(){}
    // MDH@03JAN2020: I needed to add the following methods
    getPlayerName(player){}
    get deltaPoints(){}
    get points(){}
    isPlayerPartner(player,otherPlayer){}
    get numberOfTricksPlayed(){}
    getTrickAtIndex(trickIndex){} // get the last trick played
    getTeamName(player){}
    get fourthAcePlayer(){}
}

const CHOICE_IDS=["a","b","c","d","e","f","g","h","i","j","k","l","m"];

const PLAYERTYPE_FOO=0,PLAYERTYPE_UNKNOWN=1,PLAYERTYPE_FRIEND=2;

// the base class of all Player instances
// would be defined abstract in classical OO
class Player extends CardHolder{

    log(tolog){
        // console.log("PLAYER >>> "+tolog);
    }
    
    addEventListener(playerEventListener){
        if(playerEventListener&&playerEventListener instanceof PlayerEventListener)
            this._eventListeners.push(playerEventListener);
        this.log("Player '"+this.name+"' event listeners: "+this._eventListeners+".");
    }

    // whenever a game is started, call newGame!!
    newGame(){
        if(this._index<0||!this._game)
            throw new Error("Player "+this.name+" unable to prepare for playing: not associated with a game yet.");
        if(this.numberOfCards>0){
            console.error("BUG: Player "+this.name+" still has "+this.numberOfCards+" cards.");
            this._removeCards(); // better done this way instead of this._cards=[]
        }
        // default player remembering its choices
        this._bid=-1; // the last bid of this player
        this._trumpSuite=-1;
        this._partnerSuite=-1;
        this._card=null;
        // the game being played, and the index within that game
        this._partner=-1;
        this._tricksWon=[]; // the tricks won (in any game)
        this._numberOfTricksToWin=-1; // doesn't matter
    }

    constructor(name,playerEventListener){
        super();
        this._name=name;
        this._eventListeners=[];
        if(playerEventListener){
            if(!(playerEventListener instanceof PlayerEventListener))throw new Error("Player event listener of wrong type.");
            this.addEventListener(playerEventListener);
        }
        // wait for receiving game and index
        this._index=-1;this._game=null; // waiting for the game to be plugged in (once)
        // removed wait until getting called through newGame: this._prepareForPlaying();
    }

    get name(){return this._name;}
    set name(name){this._name=name;}

    // getters exposing information to the made choice
    // NOTE no longer called by the game because the choice is passed as an argument now
    //      this way subclasses are not obligated to remember the choices they make
    get bid(){return this._bid;}
    get partnerSuite(){return this._partnerSuite;}
    get trumpSuite(){return this._trumpSuite;}
    get card(){return this.card();}

    get partner(){return this._partner;}

    //////////////get card(){return this._cards[this._cardPlayIndex];}

    /* can be passed directly to the game
    // can be set directly when a better 'rik' variation bid was done!!!!
    get trumpSuite(){return this._trumpSuite;}
    
    // TODO it would be easier to combine these in a card!!!!
    get partnerSuite(){return this._partnerSuite;}
    get partnerRank(){return this._partnerRank;}

    // called from the UI to set the trump suite!!!!
    set trumpSuite(trumpSuite){this._trumpSuite=trumpSuite;this.trumpSuiteChosen();}
    set partnerSuite(partnerSuite){this._partnerSuite=partnerSuite;this.partnerSuiteChosen();}
    */

    // end of getters/setters used by the game
    _removeCards(){while(this._cards.length>0)this._cards.shift().holder=null;}

    get game(){return this._game;}
    set game(game){
        if(this._game===game)return;
        if(game&&!(game instanceof PlayerGame))
            throw new Error("Game instance supplied to player "+(this.name||"?")+" not of type PlayerGame.");
        if(this._index<0)
            throw new Error("Position index of player "+(this.name||"?")+" unknown!");
        this._removeCards(); // MDH@11JAN2020: if the game changes we should remove the cards
        this._game=game;
        // sync _index
        if(this._game){
            // prepare for playing the game
            this.partner=-1; // my partner (once I now who it is)
            this.tricksWon=[]; // storing the tricks won
        }
    }

    set index(index){this._index=index;} // MDH@09JAN2020: sometimes an index can be set separately

    playsTheGameAtIndex(game,index){
        console.log("Registering the game played at index "+index+".");
        this.index=index;
        this.game=game;
        console.log("Game registered!");
    }
    /*
    addCard(card){
        super.addCard(card);
        this.log("Player '"+this+"' received card '"+card+"'.");
    }
    */
    _getCardsOfSuite(cardSuite,whenNotFoundCard){
        return this.cards.filter((card)=>{return(card.suite==cardSuite);});
    }

    _getSuiteCards(){
        this.log("Determining suite cards of "+this.numberOfCards+" cards!");
        let suiteCards=[[],[],[],[]];
        this._cards.forEach((card)=>{suiteCards[card.suite].push(card);});
        return suiteCards;
    }

    // can be asked to play a card of a given card suite (or any card if cardSuite is undefined)
    contributeToTrick(trick) {
        if(this._cards.length==0)throw new Error("No cards left to play!");
        let cardsOfSuite=this._getCardsOfSuite(cardSuite);
        let card=(cardsOfSuite&&cardsOfSuite.length>0?cardsOfSuite[0]:this._cards[0]);
        card.holder=trick; // move the card to the trick
    }

    // to signal having made a bid
    _bidMade(bid){
        if(this._eventListeners) // catch any error thrown by event listeners
            this._eventListeners.forEach((eventListener)=>{try{(!eventListener||eventListener.bidMade(this._bid));}catch(error){}});
        if(this._game){
            console.log("Passing bid "+this._bid+" of player '"+this.name+"' to the game!");
            this._game.bidMade(this._bid);
        }else
            console.log("ERROR: No game to pass bid "+this._bid+" of player '"+this.name+"'.");
    }
    _setBid(bid){this._bidMade(this._bid=bid);}

    _cardPlayed(card,askingForPartnerCard){
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{eventListener.cardPlayed(card,askingForPartnerCard);});
        if(this._game)this._game.cardPlayed(card,askingForPartnerCard);
    }
    // TODO a bid setter will allow subclasses to pass a bid by setting the property
    _setCard(card,askingForPartnerCard){
        // technically checking whether the played card is valid should be done here, or BEFORE calling setCard
        this._cardPlayed(this._card=card,askingForPartnerCard);
    }

    // to signal having choosen a trump suite
    trumpSuiteChosen(trumpSuite){
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{eventListener.trumpSuiteChosen(trumpSuite);}catch(error){};});
        if(this._game)this._game.trumpSuiteChosen(trumpSuite);
    }
    _setTrumpSuite(trumpSuite){this.trumpSuiteChosen(this._trumpSuite=trumpSuite);}

    // to signal having chosen a partner
    partnerSuiteChosen(partnerSuite){
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{eventListener.partnerSuiteChosen(partnerSuite);}catch(error){};});
        if(this._game)this._game.partnerSuiteChosen(partnerSuite);
    }
    _setPartnerSuite(partnerSuite){this.partnerSuiteChosen(this._partnerSuite=partnerSuite);}

    // can be asked to make a bid passing in the highest bid so far
    // NOTE this would be an 'abstract' method in classical OO
    makeABid(playerbids){
        // assumes that this player has made a bid before, or that this is the first bid
        // this default implementation assumes to be running in a browser so we can use prompt()
        // all other available bids should be better than the last bid by any other player
        let highestBidSoFar=PlayerGame.BID_PAS;
        if(playerbids){
            this.log("Player bids:",playerbids);
            for(let player=0;player<playerbids.length;player++)
                if(playerbids[player].length>0&&playerbids[player][0]>highestBidSoFar)
                    highestBidSoFar=playerbids[player][0];
        }
        this.log("Highest bid so far: '"+PlayerGame.BID_NAMES[highestBidSoFar]+"'.");
        // if the highest possible bid is not a bid all can play (at the same time), can't be bid again
        if(PlayerGame.BIDS_ALL_CAN_PLAY.indexOf(PlayerGame.BID_NAMES[highestBidSoFar])<0)highestBidSoFar++;
        let possibleBidNames=PlayerGame.BID_NAMES.slice(highestBidSoFar);
        possibleBidNames.unshift(PlayerGame.BID_NAMES[PlayerGame.BID_PAS]); // user can always 'pas'
        this.log("Possible bids: ",possibleBidNames);
        let bid=-1;
        while(bid<0){
            let bidname=prompt("@"+this.name+" (holding "+this.getTextRepresentation(true)+")\nWhat is your bid (options: '"+possibleBidNames.join("', '")+"')?",possibleBidNames[0]);
            bid=PlayerGame.BID_NAMES.indexOf(bidname);
            if(bid<0)continue;
            try{
                this._setBid(bid);
            }catch(error){
                console.error(error);
                bid=-1;
            }
        }
    }

    chooseTrumpSuite(suites){
        // if this player has all aces it's gonna be the suite of a king the person hasn't
        // also it needs to be an ace of a suite the user has itself (unless you have all other aces)
        this._trumpSuite=-1;
        // any of the suites in the cards can be the trump suite!
        let possibleTrumpSuiteNames=this.getSuites().map((suite)=>{return Card.CARD_SUITES[suite];});
        let trumpSuite=-1;
        while(trumpSuite<0){
            let trumpName=prompt("@"+this.name+" (holding "+this.getTextRepresentation(true)+")\nWhat suite will be trump (options: '"+possibleTrumpSuiteNames.join("', '")+"')?",possibleTrumpSuiteNames[0]);
            trumpSuite=possibleTrumpSuiteNames.indexOf(trumpName);
            if(trumpSuite>=0){
                try{
                    this._setTrumpSuite(trumpSuite);
                }catch(error){
                    console.error(error);
                    trumpSuite=-1;
                }
            }
        }
    }
    /**
     * asks for the suite of the partner card of the given rank
     */
    choosePartnerSuite(){
        this._partnerSuite=-1;
        this._partnerRank=RANK_ACE;
        // get all the aceless suites
        let suites=this.getSuites();
        let possiblePartnerSuites=this.getRanklessSuites(this._partnerRank);
        if(possiblePartnerSuites.length==0){ // player has ALL aces
            if(suites.length<4){ // but not all suites
                // all the suits the user does not have are allowed (asking the ace blind!!!)
                possiblePartnerSuites=[0,1,2,3].filter((suite)=>{return possiblePartnerSuites.indexOf(suite)<0;});
            }else{ // has all suits, so a king is to be selected!!!
                // all kings acceptable except for that in the trump color
                // NOTE if a person also has all the kings we have a situation, we simply continue onward
                while(1){
                    this._partnerRank--;
                    possiblePartnerSuites=this.getRanklessSuites(this._partnerRank);
                    let trumpSuiteIndex=possiblePartnerSuites.indexOf(this._trumpSuite);
                    if(trumpSuiteIndex>=0)possiblePartnerSuites.splice(trumpSuiteIndex,1);
                    if(possiblePartnerSuites.length>0)break;
                }
            }
        }
        let possiblePartnerSuiteNames=possiblePartnerSuites.map((suite)=>{return Card.CARD_SUITES[suite];});
        let partnerSuite=-1;
        while(partnerSuite<0){
            let partnerSuiteName=prompt("@"+this.name+" (holding "+this.getTextRepresentation(true)+")\nWhat "+Card.CARD_NAMES[this._partnerRank]+" should your partner have (options: '"+possiblePartnerSuiteNames.join("', '")+"')?",possiblePartnerSuiteNames[0]);
            partnerSuite=possiblePartnerSuiteNames.indexOf(partnerSuiteName);
            if(partnerSuite>=0){
                try{
                    this._setPartnerSuite(partnerSuite);
                }catch(error){
                    console.error(error);
                    partnerSuite=-1;
                }
            }
        }
    }

    set partner(partner){this._partner=partner;} // to set the partner once the partner suite/rank card is in the trick!!!!

    // can be asked to play a card and add it to the given trick
    // NOTE this would be an 'abstract' method in classical OO
    playACard(trick){
        this.log("Player '"+this.name+"' asked to play a card.");
        // how about using the first letters of the alphabet?
        let possibleCardNames=[];
        for(let cardIndex=0;cardIndex<this.numberOfCards;cardIndex++)
            possibleCardNames.push(String.cardIndex+1)+": "+this._cards[cardIndex].getTextRepresentation();
        let cardPlayIndex=-1;
        while(cardPlayIndex<0){
            // we're supposed to play a card with suite equal to the first card unless the partner suite/rank is being asked for
            let cardId=parseInt(prompt("@"+this.name+"\nPress the id of the card you want to add to "+trick.getTextRepresentation()+" (options: '"+possibleCardNames.join("', '")+"')?",""));
            if(isNaN(cardId))continue;
            cardPlayIndex=cardId-1;
        }
        this._setCard(this._cards[cardPlayIndex]);
    }

    trickWon(trickIndex){
        this._tricksWon.push(trickIndex);
        this.log("Trick #"+trickIndex+" won by '"+this.name+"': "+this._tricksWon+".");
    }

    get numberOfTricksWon(){return this._tricksWon.length;}
    
    getNumberOfTricksWon(){
        // return the total number of tricks won (including those by the partner (if any))
        return(this.numberOfTricksWon+this._game.getNumberOfTricksWonByPlayer(this.partner));
    }

    setNumberOfTricksToWin(numberOfTricksToWin){this._numberOfTricksToWin=numberOfTricksToWin;}
    get numberOfTricksToWin(){return this._numberOfTricksToWin;}
    
    // every player can be checked whether friend (1) or foo (-1) or unknown (0)
    isFriendly(player){
        if(player===this._index)return 2; // I'm mucho friendly to myself
        let partnerSuite=this._game.getPartnerSuite();
        if(partnerSuite>=0){ // a non-solitary game
            // ASSERT not a solitary game so player could be the partner in crime
            // if partner is known (i.e. the partner card is no longer in the game)
            if(this._partner>=0)return(player===this._partner?1:-1); 
            // ASSERT partner unknown (i.e. partner card still in the game)
            let trumpPlayer=this._game.getTrumpPlayer();
            // if I'm the trump player, assume ALL unfriendly BUT no I don't know who my partner is all could be
            if(this._index===trumpPlayer)return 0; // unknown
            if(this.containsCard(partnerSuite,this._game.getPartnerRank())) // I have the partner card
                return(player==trumpPlayer?1:-1); // the trump player is friendly, the others are unfriendly
            // ASSERT I'm not the trump player, and I'm not with the trump player as well
            // the trump player is foo, the rest I don't know yet
            return(player===trumpPlayer?-1:0);
        }
        // ASSERT a solitary game
        // if I'm one of the solitary players, everyone else is a foo
        if(this._game.getHighestBidders().indexOf(this._index)>=0)return -1;
        // ASSERT not one of the solitary players
        //        if player is a solitary player it's a foo, otherwise it's us against them!!!!
        return(this._game.getHighestBidders().indexOf(player)>=0?-1:1);
    }

    toString(){return this.name;}

}

// export the Player class
module.exports={PlayerEventListener,PlayerGame,Player};
},{"./Card.js":1,"./CardHolder.js":2}],4:[function(require,module,exports){
const Card=require('./Card.js'); // for comparing cards
const {CardHolder,HoldableCard}=require('./CardHolder.js');

class Trick extends CardHolder{

    // MDH@07DEC2019: game data moved over to PlayerGame instance (as passed to each player)
    //                canAskForPartnerCard blind now determined by the game (engine) itself

    // by passing in the trump player (i.e. the person that can ask for the partner card)
    constructor(firstPlayer,trumpSuite,partnerSuite,partnerRank,canAskForPartnerCard,firstPlayerCanPlaySpades){ // replacing: trumpSuite,partnerSuite,partnerRank,trumpPlayer){
        super(); // using 4 fixed positions for the trick cards so we will know who played them!!!!
        this._firstPlayer=firstPlayer;
        this._trumpSuite=trumpSuite; // for internal use to be able to determine the winner of a trick
        this._partnerSuite=partnerSuite;this._partnerRank=partnerRank; // need this when it's being asked to determine the winner
        this._canAskForPartnerCard=canAskForPartnerCard; // -1 blind, 0 not, 1 non-blind
        this._askingForPartnerCard=0; // the 'flag' set by the trump player when asking for the partner card in a trick
        this._playSuite=-1; // the suite of the trick (most of the time the suite of the first card)
        this._winnerCard=-1; // the card of the winner (note: NOT transformed to the actual player index yet)
        this._firstPlayerCanPlaySpades=firstPlayerCanPlaySpades;
        // let's keep track of the highest card
        console.log(">>> New trick can ask for partner card: "+canAskForPartnerCard+".");
        console.log(">>> New trick first player can play spades: "+firstPlayerCanPlaySpades+".");
    }

    get firstPlayer(){return this._firstPlayer;}

    get firstPlayerCanPlaySpades(){return this._firstPlayerCanPlaySpades;}
    
    // the winner exposed is the actual player who won
    get winner(){return(this._winnerCard<0?-1:(this._winnerCard+this._firstPlayer)%4);}
    
    // MDH@07DEC2019: moved from here to the game (as a PlayerGame instance)
    /*
    get trumpPlayer(){return this._trumpPlayer;} // exposes the current trump player
    get partnerSuite(){return this._partnerSuite;}
    get partnerRank(){return this._partnerRank;}
    */
    get askingForPartnerCard(){return this._askingForPartnerCard;}

    // pass in -1 when asking the partner card blind, or +1 when asking for it (non-blind)
    set askingForPartnerCard(askingForPartnerCard){
        if(typeof askingForPartnerCard!=="number"){
            console.log("ERROR: Asking for partner card NOT defined!");
            return;
        }
        if(askingForPartnerCard!=0&&this.numberOfCards>0)
            throw new Error("Opgeven de partner aas/heer (blind) te vragen niet meer toegestaan.");
        this._askingForPartnerCard=askingForPartnerCard;
        console.log("Asking for partner card set to "+this._askingForPartnerCard+".");
    }

    _setWinnerCard(winnerCard){
        this._winnerCard=winnerCard;
        console.log("Trick winner card: "+winnerCard+".");
    }

    /**
     * returns the card played by (the actual) player (as used for showing the trick cards)
     * @param {*} player 
     */
    getPlayerCard(player){
        let playerCard=(this._firstPlayer>=0?(player+4-this._firstPlayer)%4:null);
        return(playerCard>=0&&playerCard<this.numberOfCards?this._cards[playerCard]:null);
    }

    /*
    askingForPartnerCard(){
        if(this._cards.length>0)
            throw new Error("Only the first player can ask for the partner card blind!");
        if(!this._canAskForPartnerCardBlind)
            throw new Error("Cannot ask for the partner card blind (anymore).");
        this._playSuite=this._trumpSuite; // the play suite becomes the trump suite
    }
    */
    // NOTE addCard is NOT _addCard of the superclass! this is because we should set the holder on the card to add!!!!
    addCard(card){
        let numberOfCardsNow=this.numberOfCards;
         // if the flag of asking for the partner card blind is set, preset the 
        card.holder=this; // move the card to this trick by setting the holder property (will take care of adding/removing the card)
        if(this.numberOfCards<=numberOfCardsNow)
            throw new Error("Failed to add the card to the trick.");
        // ASSERT card added successfully
        if(this._askingForPartnerCard!=0&&this._trumpSuite<0)
            throw new Error("BUG: Asking for the partner card, but playing a game without trump.");
        
        // if the partner card is being asked for blind everyone has to play the partner card suite
        // MDH@09DEC2019: OOPS I was already using this._partnerSuite here BUT still after actually taking it out (now in again)
        if(this._playSuite<0){ // first card being played
            // MDH@18JAN2020: ascertain that _askingForPartnerCard has the right value
            //                it could be 0 but when the partner suite is played the player IS asking
            if(this._canAskForPartnerCard!==0){ // player supposedly can still ask for the partner card
                if(this._askingForPartnerCard<=0&&card.suite===this._partnerSuite){
                    if(this._askingForPartnerCard<0)throw new Error("BUG: Cannot ask the partner card blind!");
                    this.log("Implicitly asking for the partner card by playing the partner suite!");
                    this._askingForPartnerCard=1;
                }
            }else{
                if(this._askingForPartnerCard!==0)
                    throw new Error("Cannot ask for the partner card when you can't ask for it anymore!");
            }
            this._playSuite=(this._askingForPartnerCard<0?this._partnerSuite:card.suite);
        }
        // ASSERT this._playSuite now definitely non-negative, so
        this._canAskForPartnerCard=0; // use the right property bro'
        // update winner
        if(numberOfCardsNow>0){
            // MDH@09DEC2019: when asking for the partner card only the partner card can ever win (even if there's trump!!)
            //                but we need to know whether the partner card was already thrown
            //                SOLUTION: (NEAT) it's easiest to simply ignore trump is the partner card is being asked for!!!!!!
            if(Card.compareCardsWithPlayAndTrumpSuite(card,this._cards[this._winnerCard],this._playSuite,(this._askingForPartnerCard!=0?-1:this._trumpSuite))>0)
                this._setWinnerCard(numberOfCardsNow);
        }else // after the first card the first player is the winner of course
            this._setWinnerCard(0);
    }
    getCardPlayer(suite,rank){
        for(let player=0;player<this._cards.length;player++)
            if(this._cards[player].suite===suite&&this._cards[player].rank===rank)
                return (this._firstPlayer+player)%4; // TODO can we assume 4 players in total?????
        return -1;
    }

    // public getters
    get playSuite(){return this._playSuite;}
    get firstPlayer(){return this._firstPlayer;}

    /*
    get trumpSuite(){return this._trumpSuite;}
    */
    get canAskForPartnerCard(){return this._canAskForPartnerCard;}
}

module.exports=Trick;

},{"./Card.js":1,"./CardHolder.js":2}],5:[function(require,module,exports){
/**
 * the part that runs in the browser of a single player
 * given that any information to the current player of the game should be available through it's _game property (i.e. a PlayerGame instance)
 * all calls in main.js to rikkenTheGame directly should be replaced with calls to currentPlayer.game i.e. rikkenTheGame itself is no longer available to the currentPlayer!!!
 * 
**/
// we'll be using Player.js only (Player.js will deal with requiring CardHolder, and CardHolder Card)
// NO I need to require them all otherwise browserify won't be able to find Card, etc.
const Card=require('./Card.js');
const {CardHolder,HoldableCard}=require('./CardHolder.js');
const Trick=require('./Trick.js'); // now in separate file
const {PlayerEventListener,PlayerGame,Player}=require('./Player.js');

class Language{
    static get DEFAULT_PLAYERS(){return [["","","","",""],["Marc","Jurgen","Monika","Anna",""]];};
    // possible ranks and suites (in Dutch)
    static get DUTCH_RANK_NAMES(){return ["twee","drie","vier","vijf","zes","zeven","acht","negen","tien","boer","vrouw","heer","aas"];};
    static get DUTCH_SUITE_NAMES(){return ["ruiten","klaveren","harten","schoppen"];};
}

function capitalize(str){return(str?(str.length?str[0].toUpperCase()+str.slice(1):""):"?");}

// MDH@07JAN2020: adding entering the id of the user on page-settings, so we do not need to insert a new one
//                alternatively we can do that on a separate page / page-auth is OK
//                we go to page-auth when NOT playing the game in demo mode!!!
//                in non-demo mode you identify yourself, then when setPlayerName is successful go to page-wait-for-players
// MDH@10JAN2020: removing page-settings and page-setup-game, adding page-help
const PAGES=["page-rules","page-help","page-auth","page-wait-for-players","page-bidding","page-trump-choosing","page-partner-choosing","page-play-reporting","page-playing","page-finished"];

var currentPage=null; // let's assume to be starting at page-rules
var visitedPages=[]; // no pages visited yet

var currentPlayer=null; // the current game player

// MDH@10JAN2020: newGame() is a bid different than in the demo version in that we return to the waiting-page
function newGame(){
    // by call playsTheGameAtIndex(null,?) we force clearing the game information being shown at the wait-for-players page
    (!currentPlayer||currentPlayer.playsTheGameAtIndex(null,-1));
}

var forceFocusId=null;
function stopForceFocus(){clearInterval(forceFocusId);forceFocusId=null;}
function checkFocus(state){
    if(document.hasFocus()){showGameState(state);stopForceFocus();}else toggleGameState(state);
}
function forceFocus(state){
    if(forceFocusId)stopForceFocus();
    showGameState(this.name); // show the name of the current player immediately
    if(!document.hasFocus())forceFocusId=setInterval(()=>{checkFocus(state);},666);
}

// of course: from stackoverflow!!!
function difference(a1,a2){var a2Set=new Set(a2);return a1.filter((x)=>!a2Set.has(x));}

var bidderCardsElement=document.getElementById("bidder-cards");

function initializeBidderSuitecardsButton(){
    let button=document.getElementById("bidder-suitecards-button");
    button.addEventListener("click",function(){
        // console.log("Bidder suitecards button clicked!");
        this.classList.toggle("active-bid-button"); // a ha, didn't know this
        document.getElementById("bidder-suitecards-table").style.display=(this.classList.contains("active-bid-button")?"block":"none");
    });
}

// function getCookie(name) {
//     var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
//     return v ? v[2] : null;
// }
// function setCookie(name, value, days) {
//     var d = new Date;
//     d.setTime(d.getTime() + 24*60*60*1000*days);
//     document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
// }
// function deleteCookie(name) { setCookie(name, '', -1); }

/**
 * shows the current player names at the start of the game
 */
function showPlayerNames(){
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);
    // in the header row of the tricks played table
    for(let tricksPlayedTable of document.getElementsByClassName("tricks-played-table")){
        let tricksPlayedTableHeader=tricksPlayedTable.querySelector("thead");
        let row=tricksPlayedTableHeader.children[0]; // the row we're interested in filling
        for(player=0;player<4;player++){
            let cell=row.children[player+1]; // use player to get the 'real' player column!!
            let playerName=(rikkenTheGame?rikkenTheGame.getPlayerName(player):"?"); // MDH@03JAN2020: rikkenTheGame replaced by currentPlayer.game
            console.log("Name of player #"+(player+1)+": '"+playerName+"'.");
            cell.innerHTML=playerName;
        }
    }
}

// whenever the player changes, show the player name
function showCurrentPlayerName(){
    // showGameState(currentPlayer?currentPlayer.name:null); // show the current player name immediately in the title
    document.getElementById("player-name").innerHTML=(currentPlayer?currentPlayer.name:"?");
}

/**
 * updates the waiting-for-players page
 * depending on whether or not a game is being played (yet), we show the game id and the player names
 */
function updateGamePlayerNames(){
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);
    document.getElementById("game-name").innerHTML=(rikkenTheGame?rikkenTheGame.name:"");
    let playerNames=(rikkenTheGame?rikkenTheGame.getPlayerNames():null);
    for(let playerNameSpan of document.getElementsByClassName("game-player-name")){
        let playerIndex=playerNameSpan.getAttribute("data-player-index");
        playerNameSpan.innerHTML=playerNames[playerIndex];
        playerNameSpan.color=(playerIndex==rikkenTheGame._playerIndex?"BLUE":"BLACK");
    }
}

/**
 * clears the bid table
 * to be called with every new game
 */
function clearBidTable(){
    let bidTable=document.getElementById("bids-table").querySelector("tbody");
    for(let bidTableRow of bidTable.children)
        for(let bidTableColumn of bidTableRow.children)
            bidTableColumn.innerHTML="";
}

function setSuiteClass(element,suite){
    // remove the currently assigned suite
    element.classList.remove(Card.SUITE_NAMES[parseInt(element.getAttribute("data-suite-id"))]);
    element.setAttribute("data-suite-id",String(suite));
    element.classList.add(Card.SUITE_NAMES[parseInt(element.getAttribute("data-suite-id"))]);
}

function showCard(element,card,trumpSuite,winnerSign){
    if(card){
        setSuiteClass(element,card.suite); // we want to see the right color
        let elementIsTrump=element.classList.contains("trump");
        let elementShouldBeTrump=(card.suite===trumpSuite);
        if(elementIsTrump!==elementShouldBeTrump)element.classList.toggle("trump");
        element.innerHTML=card.getTextRepresentation();
        if(winnerSign!=0)element.innerHTML+="*";
        /* replacing: 
        // if this is the card of the winner so far it can be either + or -
        if(winnerSign>0)element.innerHTML+='+';else if(winnerSign<0)element.innerHTML+='-';
        */
    }else
        element.innerHTML="";
}

function showPlayerName(element,name,playerType){
    element.innerHTML=(name?name:"?");
    switch(playerType){
        case -1:element.style.color="red";break;
        case 0:element.style.color="orange";break;
        case 1:element.style.color="green";break;
        default:element.style.color="black";break;
    }
}
/**
 * shows the given trick
 * @param {*} trick 
 */
function showTrick(trick/*,playerIndex*/){
    let rikkenTheGame=currentPlayer.game;if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    let playerIndex=rikkenTheGame._playerIndex;
    console.log("Showing trick ",trick);
    if(trick.numberOfCards==0&&rikkenTheGame.getPartnerRank()>=0){ // once suffices
        for(let partnerSuiteElement of document.getElementsByClassName('partner-suite'))partnerSuiteElement.innerHTML=Language.DUTCH_SUITE_NAMES[rikkenTheGame.getPartnerSuite()];
        for(let partnerRankElement of document.getElementsByClassName('partner-rank'))partnerRankElement.innerHTML=Language.DUTCH_RANK_NAMES[rikkenTheGame.getPartnerRank()];
    }
    // if this is the trump player that is can ask for the partner card (either non-blind or blind) flag the checkbox
    if(trick.canAskForPartnerCard!=0){
        document.getElementById('ask-partner-card-checkbox').checked=true;
        document.getElementById('ask-partner-card-blind').innerHTML=(trick.canAskForPartnerCard<0?"blind ":"");
        document.getElementById("ask-partner-card").style.display="block";
    }else
        document.getElementById("ask-partner-card").style.display="none";
    if(trick.askingForPartnerCard!=0){
        document.getElementById("asking-for-partner-card-info").style.display="block";
    }else
        document.getElementById("asking-for-partner-card-info").style.display="none";
    //let tablebody=document.getElementById("trick-cards-table").requestSelector("tbody");
    // show the player names
    showPlayerName(document.getElementById("player-name"),rikkenTheGame.getPlayerName(playerIndex),-2);
    showPlayerName(document.getElementById("player-left-name"),rikkenTheGame.getPlayerName((playerIndex+1)%4),currentPlayer.isFriendly((playerIndex+1)%4));
    showPlayerName(document.getElementById("player-opposite-name"),rikkenTheGame.getPlayerName((playerIndex+2)%4),currentPlayer.isFriendly((playerIndex+2)%4));
    showPlayerName(document.getElementById("player-right-name"),rikkenTheGame.getPlayerName((playerIndex+3)%4),currentPlayer.isFriendly((playerIndex+3)%4));
    // show the trick cards played by the left, opposite and right player
    // NOTE the first card could be the blind card asking for the partner card in which case we should not show it!!
    //      but only the color of the partner suite
    let askingForPartnerCardBlind=(trick.numberOfCards>0&&trick._cards[0].suite!==trick.playSuite);
    let playerAskingForPartnerCardBlindIndex=(askingForPartnerCardBlind?(4+trick.firstPlayer-playerIndex)%4:0);
    if(playerAskingForPartnerCardBlindIndex==1){
        document.getElementById("player-left-card").innerHTML=SUITE_CHARACTERS[trick.playSuite];
        setSuiteCard(document.getElementById("player-left-card"),trick.playSuite);
    }else
        showCard(document.getElementById("player-left-card"),trick.getPlayerCard((playerIndex+1)%4),trick.trumpSuite,
                (trick.winner===(playerIndex+1)%4?(rikkenTheGame.isPlayerPartner(playerIndex,(playerIndex+1)%4)?1:-1):0));
    if(playerAskingForPartnerCardBlindIndex==2){
        document.getElementById("player-opposite-card").innerHTML=SUITE_CHARACTERS[trick.playSuite];
        setSuiteCard(document.getElementById("player-opposite-card"),trick.playSuite);
    }else
        showCard(document.getElementById("player-opposite-card"),trick.getPlayerCard((playerIndex+2)%4),trick.trumpSuite,
                (trick.winner===(playerIndex+2)%4?(rikkenTheGame.isPlayerPartner(playerIndex,(playerIndex+2)%4)?1:-1):0));
    if(playerAskingForPartnerCardBlindIndex==3){
        document.getElementById("player-right-card").innerHTML=SUITE_CHARACTERS[trick.playSuite];
        setSuiteCard(document.getElementById("player-right-card"),trick.playSuite);
    }else
        showCard(document.getElementById("player-right-card"),trick.getPlayerCard((playerIndex+3)%4),trick.trumpSuite,
                (trick.winner===(playerIndex+3)%4?(rikkenTheGame.isPlayerPartner(playerIndex,(playerIndex+3)%4)?1:-1):0));
}

function updateSuiteCardRows(rows,suiteCards){
    console.log("Player suite card rows: "+rows.length+".");
    // console.log("Number of rows: ",rows.length);
    let suite=0;
    for(let row of rows){
        /////////let suiteColor=SUITE_COLORS[suite%2];
        let cardsInSuite=(suite<suiteCards.length?suiteCards[suite]:[]);
        // console.log("Number of cards in suite #"+suite+": "+cardsInSuite.length);
        let cells=row.querySelectorAll("span");
        let suiteCard=0;
        // console.log("Number of columns: ",columns.length);
        for(let cell of cells){
            let cardInSuite=(suiteCard<cardsInSuite.length?cardsInSuite[suiteCard]:null);
            if(cardInSuite){
                // console.log("Showing card: ",cardInSuite);
                cell.innerHTML=cardInSuite.getTextRepresentation();
                cell.classList.add(Card.SUITE_NAMES[cardInSuite.suite]); // replacing: cell.style.color=suiteColor;  
            }else
                cell.innerHTML="";
            suiteCard++;
        }
        suite++;
    }
}
// in three different pages the player cards should be shown...
function updateBidderSuiteCards(suiteCards){
    console.log("Showing the (current player) cards for bidding.");
    updateSuiteCardRows(document.getElementById("bidder-suitecards-table").querySelectorAll("div"),suiteCards);
}
function updateChooseTrumpSuiteCards(suiteCards){
    updateSuiteCardRows(document.getElementById("trump-suitecards-table").querySelectorAll("div"),suiteCards);
}
function updateChoosePartnerSuiteCards(suiteCards){
    updateSuiteCardRows(document.getElementById("partner-suitecards-table").querySelectorAll("div"),suiteCards);
}

/**
 * for playing the cards are shown in buttons inside table cells
 * @param {*} suiteCards 
 */
function updatePlayerSuiteCards(suiteCards){
    console.log("Showing the (current player) cards to choose from.");
    let tablebody=document.getElementById("player-suitecards-table");
    console.log("Suite cards: ",suiteCards);
    let rows=tablebody.querySelectorAll("div");
    console.log("Number of rows: ",rows.length);
    for(let suite=0;suite<rows.length;suite++){
        let row=rows[suite];
        /////////let suiteColor=SUITE_COLORS[suite%2];
        let cardsInSuite=(suite<suiteCards.length?suiteCards[suite]:[]);
        // console.log("Number of cards in suite #"+suite+": "+cardsInSuite.length);
        let columns=row.querySelectorAll("span");
        // console.log("Number of columns: ",columns.length);
        for(let suiteCard=0;suiteCard<columns.length;suiteCard++){
            let cellbutton=columns[suiteCard]/*.querySelector("input[type=button]")*/;
            if(!cellbutton){console.log("No cell button!");continue;}
            let cardInSuite=(suiteCard<cardsInSuite.length?cardsInSuite[suiteCard]:null);
            if(cardInSuite){
                // console.log("Showing card: ",cardInSuite);
                cellbutton.innerHTML=cardInSuite.getTextRepresentation();
                cellbutton.classList.add(Card.SUITE_NAMES[cardInSuite.suite]); // replacing: cellbutton.style.color=suiteColor;
                cellbutton.style.display="inline";
            }else // hide the button
                cellbutton.style.display="none";
        }
    }
    console.log("Current player cards to choose from shown!");
}

function updatePlayerResultsTable(){
    let rikkenTheGame=currentPlayer.game;if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    let player=0;
    let deltaPoints=rikkenTheGame.deltaPoints;
    let points=rikkenTheGame.points;
    for(let playerResultsRow of document.getElementById("player-results-table").querySelector("tbody").getElementsByTagName("tr")){
        playerResultsRow.children[0].innerHTML=rikkenTheGame.getPlayerName(player);
        playerResultsRow.children[1].innerHTML=(deltaPoints?String(rikkenTheGame.getNumberOfTricksWonByPlayer(player)):"-");
        playerResultsRow.children[2].innerHTML=(deltaPoints?String(deltaPoints[player]):"-");
        playerResultsRow.children[3].innerHTML=String(points[player]);
        player++;
    }
}

function clearTricksPlayedTables(){
    for(let tricksPlayedTable of document.getElementsByClassName("tricks-played-table")){
        for(let tricksPlayedTableCell of tricksPlayedTable.querySelectorAll('td')){
            tricksPlayedTableCell.innerHTML="";tricksPlayedTableCell.style.backgroundColor='transparent';
        }
    }
}
function updateTricksPlayedTables(){
    let rikkenTheGame=currentPlayer.game;if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    let lastTrickPlayedIndex=rikkenTheGame.numberOfTricksPlayed-1; // getter changed to getMethod call
    if(lastTrickPlayedIndex>=0){
        let trick=rikkenTheGame.getTrickAtIndex(lastTrickPlayedIndex);
        for(let tricksPlayedTable of document.getElementsByClassName("tricks-played-table")){
            let row=tricksPlayedTable.querySelector("tbody").children[lastTrickPlayedIndex]; // the row we're interested in filling
            row.children[0].innerHTML=String(lastTrickPlayedIndex+1);
            for(trickPlayer=0;trickPlayer<trick._cards.length;trickPlayer++){
                let player=(trickPlayer+trick.firstPlayer)%4;
                let cell=row.children[2*player+1]; // use player to get the 'real' player column!!
                let card=trick._cards[trickPlayer];
                cell.innerHTML=card.getTextRepresentation(); // put | in front of first player!!!
                // make the background the color of the play suite after the last player, so we know where the trick ended!!
                row.children[2*player+2].style.backgroundColor=(trickPlayer==trick._cards.length-1?(trick.playSuite%2?'black':'red'):'white');
                // let's make the winner card show bigger!!!
                ///////if(trick.winner===player)cell.style.color=(card.suite%2?'blue':'#b19cd9');else // mark the winner with an asterisk!!
                /* replacing:
                if(trick.winner===player)cell.style.color=(card.suite%2?'blue':'#b19cd9');else // mark the winner with an asterisk!!
                */
                cell.style.color=(card.suite%2?'black':'red');
                cell.style.fontSize=(trick.winner===player?"600":"450")+"%";
                // replacing: cell.style.color='#'+(card.suite%2?'FF':'00')+'00'+(trickPlayer==0?'FF':'00'); // first player adds blue!!
            }
            row.children[9].innerHTML=rikkenTheGame.getTeamName(trick.winner); // show who won the trick!!
            row.children[10].innerHTML=getNumberOfTricksWonByPlayer(trick.winner); // show the number of tricks won by the trick winner (MDH@03JAN2020: changed from getting the player instance first)
        }
    }
}

function showDefaultPlayerNames(){
    console.log("Showing default player names!");
    let playerNames=Language.DEFAULT_PLAYERS[document.getElementById("demo-playmode-checkbox").checked?1:0];
    for(playerNameInputElement of document.getElementsByClassName("player-name-input")){
        if(!playerNameInputElement.value||playerNameInputElement.value.length==0)
            playerNameInputElement.value=playerNames[parseInt(playerNameInputElement.getAttribute("data-player-id"))];
    }
}

// playing from within the game
function singlePlayerGameButtonClicked(){
    let singlePlayerName=document.getElementById('single-player-name').value.trim();
    if(singlePlayerName.length>0)
        setPlayerName(singlePlayerName,(err)=>{
            // MDH@10JAN2020: _setPlayer takes care of switching to the right initial page!!!
            if(err)setInfo(err);// else nextPage();
        });
    else
        alert("Geef eerst een (geldige) naam op!");
}

/**
 * prepares the GUI for playing the game
 */
function getGameInfo(){
    console.log("Determining game info.");
    let gameInfo="";
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null); // no player, no game
    if(rikkenTheGame){
        // get the info we need through the PlayerGame instance registered with the current player
        let highestBidders=rikkenTheGame.getHighestBidders(); // those bidding
        console.log("\tHighest bidders: "+highestBidders.join(", ")+".");
        let highestBid=rikkenTheGame.getHighestBid();
        console.log("\tHighest bid: "+PlayerGame.BID_NAMES[highestBid]+".");
        let trumpSuite=rikkenTheGame.getTrumpSuite();
        console.log("\tTrump suite: "+trumpSuite+".");
        let partnerSuite=rikkenTheGame.getPartnerSuite();
        let partnerRank=rikkenTheGame.getPartnerRank();
        // playing with trump is easiest
        if(trumpSuite>=0){ // only a single highest bidder!!!
           let highestBidder=highestBidders[0];
            if(highestBid==PlayerGame.BID_TROELA){
                let troelaPlayerName=rikkenTheGame.getPlayerName(highestBidder);
                gameInfo=troelaPlayerName+" heeft troela, en ";
                gameInfo+=rikkenTheGame.getPlayerName(rikkenTheGame.fourthAcePlayer)+" is mee.";
            }else{
                if(highestBid==PlayerGame.BID_RIK||highestBid==PlayerGame.BID_RIK_BETER){
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" rikt in de "+Language.DUTCH_SUITE_NAMES[trumpSuite];
                    gameInfo+=", en vraagt de "+Language.DUTCH_SUITE_NAMES[partnerSuite]+" "+Language.DUTCH_RANK_NAMES[partnerRank]+" mee.";    
                }else // without a partner
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" speelt "+PlayerGame.BID_NAMES[trumpSuite]+" met "+Language.DUTCH_SUITE_NAMES[trumpSuite]+" als troef.";
            }
        }else{ // there's no trump, everyone is playing for him/herself
            let highestBidderPlayerNames=[];
            highestBidders.forEach((highestBidder)=>{highestBidderPlayerNames.push(rikkenTheGame.getPlayerName(highestBidder));});
            if(highestBidderPlayerNames.length>0){
                gameInfo=highestBidderPlayerNames.join(", ")+(highestBidderPlayerNames.length>1?" spelen ":" speelt ")+PlayerGame.BID_NAMES[highestBid]+".";
            }else
                gameInfo="Iedereen heeft gepast. We spelen om de schoppen vrouw en de laatste slag!";
        }
   }
   return gameInfo;
}

function getNumberOfTricksToWinText(numberOfTricksToWin,partnerName,highestBid){
    switch(numberOfTricksToWin){
        case 0:
            return "Geeneen";
        case 1:
            return "Precies een";
        case 6:
            return "Zes samen met "+(partnerName?partnerName:"je partner")+" om de tegenspelers de "+(highestBid==PlayerGame.BID_TROELA?"troela":"rik")+" te laten verliezen";
        case 8:
            return "Acht samen met "+(partnerName?partnerName:"je partner")+" om de "+(highestBid==PlayerGame.BID_TROELA?"troela":"rik")+" te winnen";
        case 9:
            return "Negen alleen";
        case 10:
            return "Tien alleen";
        case 11:
            return "Elf alleen";
        case 12:
            return "Twaalf alleen";
        case 13:
            return "Allemaal";
        case 14:
            return "Maakt niet uit mits niet de laatste slag of een slag met de schoppen vrouw";
    }
    return "Maakt niet uit";
}

class OnlinePlayer extends Player{

    constructor(name){
        super(name,null);
    }

    // as we're not receiving the actual tricks won, we have to override the getter
    set numberOfTricksWon(numberOfTricksWon){this._numberOfTricksWon=numberOfTricksWon;}
    getNumberOfTricksWon(){return this._numberOfTricksWon;} // do NOT use the getter here!!!!

    // to set the partner once the partner suite/rank card is in the trick!!!!

    // a (remote) client needs to override all its actions
    // BUT we do not do that because all results go into PlayerGameProxy which will send the along!!!!

    // make a bid is called with 
    makeABid(playerBidsObjects,possibleBids){
        // debugger
        forceFocus(this.name);
        // removed: document.getElementById("wait-for-bid").style.visibility="hidden"; // show the bidding element
        document.getElementById("bidding").style.visibility="visible"; // show the bidding element
        // currentPlayer=this; // remember the current player
        setInfo("Doe een bod.");
        if(currentPage!="page-bidding")setPage("page-bidding"); // JIT to the right page
        console.log("Possible bids player '"+this.name+"' could make: ",possibleBids);

        //setInfo("Maak een keuze uit een van de mogelijke biedingen.");
        // it's always you!!!! document.getElementById("bidder").innerHTML=this.name;
        /* replacing:
        document.getElementById("toggle-bidder-cards").innerHTML="Toon kaarten";
        bidderCardsElement.innerHTML="";
        document.getElementById("toggle-bidder-cards").value=this.getTextRepresentation("<br>");
        */
        // either show or hide the bidder cards immediately
        document.getElementById("bidder-suitecards-table").style.display="block";
        if(/*playmode==PLAYMODE_DEMO*/0^document.getElementById("bidder-suitecards-button").classList.contains("active-bid-button"))
            document.getElementById("bidder-suitecards-button").classList.toggle("active-bid-button");
        /* MDH@11JAN2020: moved over to when the player cards are received!!!
        // NOTE because every player gets a turn to bid, this._suiteCards will be available when we ask for trump/partner!!!
        updateBidderSuiteCards(this._suiteCards=this._getSuiteCards());
        */
        // only show the buttons
        for(let bidButton of document.getElementsByClassName("bid"))
            bidButton.style.display=(possibleBids.indexOf(parseInt(bidButton.getAttribute('data-bid')))>=0?"initial":"none");
        // show the player bids in the body of the bids table
        let bidTable=document.getElementById("bids-table").querySelector("tbody");
        if(playerBidsObjects)
        for(let player=0;player<playerBidsObjects.length;player++){
            let playerBidsObject=playerBidsObjects[player];
            let playerBidsRow=bidTable.children[player];
            playerBidsRow.children[0].innerHTML=capitalize(playerBidsObject.name); // write the name of the player
            let bidColumn=0;
            // write the bids (we have to clear the table with every new game though)
            playerBidsObject.bids.forEach((playerBid)=>{playerBidsRow.children[++bidColumn].innerHTML=playerBid;});
            // replacing: bidTable.children[player].children[1].innerHTML=playersBids[bid].join(" ");
        }
    }
    chooseTrumpSuite(suites){
        forceFocus(this.name);
        console.log("Possible trump suites:",suites);
        setPage("page-trump-choosing");
        document.getElementById("trump-suite-input").style.visibility="visible"; // ascertain to allow choosing the trump suite
        updateChooseTrumpSuiteCards(this._suiteCards);
        // iterate over the trump suite buttons
        for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
    }
    choosePartnerSuite(suites,partnerRank){ // partnerRankName changed to partnerRank (because Language should be used at the UI level only!)
        forceFocus(this.name);
        console.log("Possible partner suites:",suites);
        setPage("page-partner-choosing");
        document.getElementById("partner-suite-input").style.visibility="visible"; // ascertain to allow choosing the trump suite
        updateChoosePartnerSuiteCards(this._suiteCards);
        // because the suites in the button array are 0, 1, 2, 3 and suites will contain
        for(let suiteButton of document.getElementById("partner-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
        document.getElementById('partner-rank').innerHTML=Language.DUTCH_RANK_NAMES[partnerRank];
    }
    // almost the same as the replaced version except we now want to receive the trick itself
    playACard(trick){
        // currentPlayer=this;
        forceFocus(this.name);
        // MDH@19JAN2020: allow the current player to play a card by clicking one
        updatePlayableCardButtonClickHandlers(true);
        /* replacing:
        document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
        document.getElementById("playing").style.visibility="visible"; // show the play element
        */
        // currentPlayer=this; // remember the current player
        setInfo("Speel een kaart bij.");
        // if this is a new trick update the tricks played table with the previous trick
        // if(trick.numberOfCards==0)updateTricksPlayedTables();
        /* see showTrick()
        document.getElementById("can-ask-for-partner-card-blind").style.display=(trick.canAskForPartnerCardBlind?"block":"none");
        // always start unchecked...
        document.getElementById("ask-for-partner-card-blind").checked=false; // when clicked should generate 
        */
        document.getElementById("game-info").innerHTML=getGameInfo(); // update the game info (player specific)
        // obsolete: document.getElementById("card-player").innerHTML=this.name;
        document.getElementById("trick-playsuite").innerHTML=(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite].toLowerCase():"kaart");
        let numberOfTricksWon=this.getNumberOfTricksWon(); // also includes those won by the partner (automatically)
        // add the tricks won by the partner
        let partnerName=this._game.getPartnerName(this._index);
        // if(partner)numberOfTricksWon+=player.getNumberOfTricksWon();
        document.getElementById("tricks-won-so-far").innerHTML=String(numberOfTricksWon)+(partnerName?" (samen met "+partnerName+")":"");
        // show the number of tricks this player is supposed to win in total
        document.getElementById("tricks-to-win").innerHTML=getNumberOfTricksToWinText(this._numberOfTricksToWin,partnerName,this._game.getHighestBid());
        this._card=null; // get rid of any currently card
        console.log("ONLINE >>> Player '"+this.name+"' should play a card!");
        setInfo(this.name+", welke "+(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+" wil je "+(trick.numberOfCards>0?"bij":"")+"spelen?");
        updatePlayerSuiteCards(this._suiteCards=this._getSuiteCards()); // remember the suite cards!!!!
        // show the trick (remembered in the process for use in cardPlayed below) from the viewpoint of the current player
        ///// showTrick(this._trick=trick); // MDH@11JAN2020: no need to pass the player index (as it is always the same)
        // MDH@18JAN2020: allow the player to play a card by plugging in the event handler again!!
        updatePlayableCardButtonClickHandlers(true);
    }

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
            this._trick=this._game._trick; // MDH@19JAN2020: easiest way to get the current trick
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
                        // MDH@14JAN2020 BUG FIX: was using ask-partner-card-blind instead of ask-partner-card-checkbox!!!
                        if(document.getElementById("ask-partner-card-checkbox").checked&&
                            (suite!=this._game.getTrumpSuite()||confirm("Wilt U de "+Language.DUTCH_SUITE_NAMES[this._game.getPartnerSuite()]+" "+Language.DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" (blind) vragen met een troef?"))){
                            this._trick.askingForPartnerCard=-1; // yes, asking blind!!
                            /////alert("\tBLIND!");
                        }
                    }else
                        /*alert("Not indicated!!!!")*/;
                }else{
                    // check whether or not the first player can play spades
                    if(!this._trick._firstPlayerCanPlaySpades&&suite===Card.SUITE_SPADE){ // spade is being played by the first player whereas that is not allowed
                        if(this.getNumberOfCardsWithSuite(Card.SUITE_SPADE)<this.numberOfCards){
                            alert("Je kunt niet met schoppen uitkomen, want de schoppen vrouw is nog niet opgehaald.");
                            return;
                        }
                    }
                }
            }else{ // not the first card in the trick played
                // the card needs to be the same suite as the play suite (if the player has any)
                if(suite!==this._trick.playSuite&&this.getNumberOfCardsWithSuite(this._trick.playSuite)>0){
                    alert("Je kunt "+card.getTextRepresentation()+" niet spelen, want "+Language.DUTCH_SUITE_NAMES[this._trick.playSuite]+" is gevraagd.");
                    return;
                }
                // when being asked for the partner card that would be the card to play!
                if(this._trick.askingForPartnerCard!=0){
                    let partnerSuite=this._game.getPartnerSuite(),partnerRank=this._game.getPartnerRank();
                    if(this.containsCard(partnerSuite,partnerRank)){
                        if(card.suite!=partnerSuite||card.rank!=partnerRank){
                            alert("Je kunt "+card.getTextRepresentation()+" niet spelen, want de "+Language.DUTCH_SUITE_NAMES[partnerSuite]+" "+Language.DUTCH_RANK_NAMES[partnerRank]+" is gevraagd.");
                            return;
                        }
                    }
                }
            }
            // MDH@14JAN2020: we have to also return whatever trick value that might've changed
            //                which in this case could wel be the asking for partner card 'flag'
            this._setCard(card,this._trick.askingForPartnerCard);
        }else
            alert("Invalid card suite "+String(suite)+" and suite index "+String(index)+".");
    }
    playsTheGameAtIndex(game,index){
        super.playsTheGameAtIndex(game,index);
        // TODO should we do this here??
        if(this.game)setPage("page-wait-for-players");else setPage("page-rules");
    }
    // call renderCards just after the set of cards change
    renderCards(){
        this._suiteCards=this._getSuiteCards();
        switch(currentPage){
            case "page-bidding":updateBidderSuiteCards(this._suiteCards);break; // typically only once
            case "page-playing":updatePlayerSuiteCards(this._suiteCards);break; // typically after playing a card!!
            case "page-trump-choosing":updateChooseTrumpSuiteCards(this._suiteCards);break;
            case "page-partner-choosing":updateChoosePartnerSuiteCards(this._suiteCards);break;
        }
    }
    // exit should be called when a player leaves a game for some reason (typically by closing the tab)
    exit(){(!this._game||this._game.exit(this.name+" leaving..."));}
}

// button click event handlers
/**
 * clicking a bid button registers the chosen bid with the current player 
 * @param {*} event 
 */
function bidButtonClicked(event){
    let bid=parseInt(event.currentTarget.getAttribute("data-bid"));
    console.log("Bid chosen: ",bid);
    currentPlayer._setBid(bid); // the value of the button is the made bid
}
/**
 * clicking a trump suite button registers the chosen trump suite with the current player 
 * @param {*} event 
 */
function trumpSuiteButtonClicked(event){
    // either trump or partner suite selected
    // OOPS using parseInt() here is SOOOO important
    let trumpSuite=parseInt(event.currentTarget.getAttribute("data-suite"));
    console.log("Trump suite "+trumpSuite+" chosen.");
    currentPlayer._setTrumpSuite(trumpSuite);
}
/**
 * clicking a partner suite button registers the chosen partner suite with the current player 
 * @param {*} event 
 */
function partnerSuiteButtonClicked(event){
    // either trump or partner suite selected
    // parseInt VERY IMPORTANT!!!!
    let partnerSuite=parseInt(event.currentTarget.getAttribute("data-suite"));
    console.log("Partner suite "+partnerSuite+" chosen.");
    // go directly to the game (instead of through the player)
    currentPlayer._setPartnerSuite(partnerSuite);
}

/**
 * clicking a partner suite button registers the chosen partner suite with the current player 
 * @param {*} event 
 */
function playablecardButtonClicked(event){
    let playablecardCell=event.currentTarget;
    let cardSuite=parseInt(playablecardCell.getAttribute("data-suite-id"));
    let cardRank=parseInt(playablecardCell.getAttribute("data-suite-index"));
    ////////if(playablecardCell.style.border="0px")return; // empty 'unclickable' cell
    currentPlayer._cardPlayedWithSuiteAndIndex(cardSuite,cardRank);
}

/**
 * convenient to be able to turn the playable card buttons on and off at the right moment
 * @param {enable} enable 
 */
function updatePlayableCardButtonClickHandlers(enable){
    // clicking card 'buttons' (now cells in table), we can get rid of the button itself!!!
    for(let playablecardButton of document.querySelectorAll(".playable.card-text"))
        playablecardButton.onclick=(enable?playablecardButtonClicked:null);
}

// in order to not have to use RikkenTheGame itself (that controls playing the game itself)
// and which defines RikkenTheGameEventListener we can simply define stateChanged(fromstate,tostate)
// and always call it from the game 
function _gameStateChanged(fromstate,tostate){
    console.log("GAMEPLAYING >>> Toestand verandert van "+fromstate+" naar "+tostate+".");
    switch(tostate){
        case PlayerGame.IDLE:
            setInfo("Een spel is aangemaakt.");
            break;
        case PlayerGame.DEALING:
            setInfo("De kaarten worden geschud en gedeeld.");
            break;
        case PlayerGame.BIDDING:
            // when moving from the DEALING state to the BIDDING state clear the bid table
            // ALTERNATIVELY this could be done when the game ends
            // BUT this is a bit safer!!!
            setInfo("Het bieden is begonnen!");
            if(fromstate===PlayerGame.DEALING)clearBidTable();
            ////// let's wait until a bid is requested!!!! 
            // MDH@09JAN2020: NO, we want to indicate that the bidding is going on
            setPage("page-bidding");
            break;
        case PlayerGame.PLAYING:
            setInfo("Het spelen kan beginnen!");
            // updatePlayableCardButtonClickHandlers(true); // allowing the user to cl
            /* MDH@19JAN2020: in due course we will be removing the following two lines
            document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
            document.getElementById("playing").style.visibility="visible"; // show the play element
            */
            clearTricksPlayedTables();
            // initiate-playing will report on the game that is to be played!!!
            setPage("page-playing");
            break;
        case PlayerGame.FINISHED:
            setInfo("Het spel is afgelopen!");
            updateTricksPlayedTables(); // so we get to see the last trick as well!!!
            updatePlayerResultsTable(); // show the player results so far
            setPage("page-finished");
            break;
    }
    console.log("ONLINE >>> The state of the game changed to '"+tostate+"'.");
}

function _gameErrorOccurred(error){
    alert("Fout: "+error);
}

function setPage(newPage){
    // remember the page we came from (not the new page!!!!)
    console.log("GAMEPLAYING >>> Page to show: '"+newPage+"'.");
    // if this is a page refresh, no need to repush the page!!!
    if(currentPage)if(currentPage!=newPage)visitedPages.unshift(currentPage);
    currentPage=newPage;
    updateHelpButtons();
    // NOTE not changing currentPage to page until we have done what we needed to do
    PAGES.forEach(function(_page){
        let showPage=(_page===currentPage);
        console.log((showPage?"Showing ":"Hiding ")+" '"+_page+"'.");
        let pageElement=document.getElementById(_page);
        if(pageElement){
            pageElement.style.visibility=(showPage?"visible":"hidden");
            if(showPage){
                // cut off the page- prefix
                switch(_page.substring(5)){
                    case "rules":setInfo("De regels van het online spel.");break;
                    case "settings":setInfo("Kies de speelwijze.");break;
                    case "setup-game": // when playing in demo mode, the user should enter four player names
                        {
                            showDefaultPlayerNames();
                            setInfo("Vul de namen van de spelers in. Een spelernaam is voldoende.");
                        }
                        break;
                    case "auth": // page-auth
                        setInfo("Geef de naam op waaronder U wilt spelen!");
                        break;
                    case "wait-for-players": // page-wait-for-players
                        setInfo("Even geduld aub. We wachten tot er genoeg medespelers zijn!");
                        break;
                    case "bidding": // page-bidding
                        // setInfo("Wacht om de beurt op een verzoek tot het doen van een bod.");
                        break;
                    case "play-reporting":
                        break;
                    case "playing": // ????
                        // setInfo("Wacht op het verzoek tot het opgeven van de troefkleur en/of de mee te vragen aas/heer.");
                        break;
                    case "finished":
                        {
                            clearTricksPlayedTables();
                            showPlayerNames();
                            setInfo("Wacht op het verzoek tot het (bij)spelen van een kaart.");
                        }
                        break;
                }
            }
        }else
            alert("BUG: Unknown page '"+_page+"' requested!");
    });
}
function nextPage(event){
    console.log("Moving to the next page!");
    let pageIndex=PAGES.indexOf(currentPage);
    // MDH@07JAN2020: in demo mode we go to the next page, when not running in demo mode we go to the page-auth page
    //                in demo mode skip the auth and wait for players button
    switch(pageIndex){
        case 1:
            setPage("page-auth");
            break;
        case 2: // should we check the user names??????
            setPage("page-bidding");
            break;
        default:
            setPage(PAGES[(pageIndex+1)%PAGES.length]);
            break;
    }
}
function cancelPage(event){
    console.log("Moving to the previous page.");
    // go one page back
    let pageIndex=PAGES.indexOf(currentPage);
    setPage(PAGES[(pageIndex+PAGES.length-1)%PAGES.length]);
}
function returnToPreviousPage(){
    // pop off the page we are going to visit, preventing to push the currentPage again
    if(visitedPages.length>0){currentPage=null;setPage(visitedPages.shift());}
}
function showHelp(){
    console.log("Showing the help!");
    setPage('page-rules');
}
// ascertain to disable the Help button when viewing it!!!
function updateHelpButtons(){
    let enableHelpButton=(currentPage!=='page-help');
    for(let helpButton of document.getElementsByClassName('help'))helpButton.disabled=!enableHelpButton;
}

/**
 * to be called when the new-players button is clicked, to start a new game with a new set of players
 */
function newPlayers(){
    console.log("GAMEPLAYING >>> Nieuwe spelers aanmaken.");
    players=[];
    let noPlayerNames=true;
    // iterate over all player input fields
    for(playerNameInput of document.getElementsByClassName("player-name-input")){
        if(playerNameInput.value.length>0){
            noPlayerNames=false;
            players.push(new OnlinePlayer(playerNameInput.value));
        }else
        if(players.length<4)
            players.push(null);
    }
    if(noPlayerNames){
        players=null;
        setInfo("Geen spelernamen opgegeven. Heb tenminste een spelernaam nodig!");
        return;
    }
    console.log("Rikken - het spel: Nieuwe spelers aangemaakt!");
}

function cancelGame(){
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);//if(!rikkenTheGame)throw new Error("Geen spel!");
    if(!rikkenTheGame){
        alert("Geen spel om af te breken! Laad deze web pagina opnieuw!");
        return;
    }
    if(confirm("Wilt U echt het huidige spel afbreken?")){
        rikkenTheGame.cancel();
    }
}

// MDH@07JAN2020: additional stuff that we're going to need to make this stuff work
class PlayerGameProxy extends PlayerGame {

    getSendEvent(event,data,callback){
        console.log("Sending event "+event+" with data "+JSON.stringify(data)+".");
        return [event,data,callback];
    }

    // what the player will be calling when (s)he made a bid, played a card, choose trump or partner suite
    bidMade(bid){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('BID',bid,function(){
                console.log("BID event receipt acknowledged!");
                document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element again
                showGameState(null); // a bit crude to get rid of the Bieden page name though
            })); // no need to send the player id I think... {'by':this._playerIndex,'bid':bid}));
        return true;
    }
    // MDH@13JAN2020: we're sending the exact card over that was played (and accepted at this end as it should I guess)
    // MDH@14JAN2020: passing in the askingForPartnerCard 'flag' as well!!!!
    //                because we're overriding the base RikkenTheGame implementation
    //                askingForPartnerCard doesn't end up in the local RikkenTheGame trick
    cardPlayed(card,askingForPartnerCard){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        // MDH@17JAN2020: disable the buttons once the card is accepted (to be played!!!)
        //                TODO perhaps hiding the cards should also be done here!!!
        updatePlayableCardButtonClickHandlers(false);
        /* replacing:
        document.getElementById("wait-for-play").style.visibility="visible"; // hide the bidding element again
        document.getElementById("playing").style.visibility="hidden"; // hide the bidding element again
        */
        console.log("Sending card played: "+card.toString()+" to the server.");
        this._socket.emit(...this.getSendEvent('CARD',[card.suite,card.rank,askingForPartnerCard],function(){
                console.log("CARD played receipt acknowledged.");
                showGameState(null);
            })); // replacing: {'player':this._playerIndex,'card':[card.suite,card.rank]}));
        return true;
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('TRUMPSUITE',trumpSuite,function(){
                console.log("Trump suite event receipt acknowledged.");
                showGameState(null);
                document.getElementById("trump-suite-input").style.visibility="hidden"; // ascertain to hide the trump suite input element
            })); // same here: {'player':this._playerIndex,'suite':trumpSuite}));
        return true;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('PARTNERSUITE',partnerSuite,function(){
                console.log("Partner suite event receipt acknowledged!");
                document.getElementById("partner-suite-input").style.visibility="hidden"; // ascertain to hide the partner suite input element
                showGameState(null);
            })); // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
        return true;
    }
    exit(reason){
        this._socket.emit(...this.getSendEvent('BYE',reason,function(){
            console.log("BYE event receipt acknowledged!");
            setPage("page=rules");
        }));
    }

    set state(newstate){
        let oldstate=this._state;
        this._state=newstate;
        // do stuff (change to another page)
        _gameStateChanged(oldstate,this._state);
    }

    logEvent(event,data){
        console.log("GAMEPLAYING >>> Received event "+event+" with data "+JSON.stringify(data));
    }

    get name(){return this._name;}
    set name(name){this._name=name;}

    getPlayerName(playerIndex){return(this._playerNames&&playerIndex>=0&&playerIndex<this._playerNames.length?this._playerNames[playerIndex]:null);}
    getPlayerNames(){return this._playerNames;} // overriding getPlayerNames() of the demo version!!
    set playerNames(playerNames){
        this._playerNames=playerNames;
        this._playerIndex=(!this._playerNames||this._playerNames.length==0?-1:this._playerNames.indexOf(currentPlayer.name));
        currentPlayer.index=this._playerIndex;
        if(this._playerIndex<0)
            console.log("ERROR: Current player '"+currentPlayer.name+"' not found.");
        else
            updateGamePlayerNames();
    }

    getNumberOfTricksWonByPlayer(player){
        return(player>=0&&player<this._numberOfTricksWon.length?this._numberOfTricksWon[player]:0);
    }

    // MDH@20JAN2020: will be receiving the new trick event when a new trick starts
    
    newTrick(trickInfo){
        if(!trickInfo)return;
        setInfo("We spelen slag "+trickInfo.index+".");
        // keep track of the number of tricks played!!!!
        this._numberOfTricksPlayed=trickInfo.index-1; // replacing: this._numberOfTricksPlayed=(this._trick?this._numberOfTricksWon+1:0);
        // let's create a new trick BEFORE showing the alert
        // because a card being played could be received BEFORE the alert goes away
        // MDH@19JAN2020: appending whether or not the first player can play spades
        this._trick=new Trick(trickInfo.firstPlayer,this._trumpSuite,this._partnerSuite,this._partnerRank,trickInfo.canAskForPartnerCard,trickInfo.firstPlayerCanPlaySpades);
        console.log("New trick defined!");
        updateTricksPlayedTables();
        // the previous trick was always won by the new first player (of course), unless this is the first trick of course
        let trickWinnerIndex=(trickInfo.index>1?trickInfo.firstPlayer:-1);
        this._trickWinner=(trickWinnerIndex<0?null:this.getPlayerName(trickWinnerIndex));
        // while the alert is showing the player can view the last trick!!!!
        if(this._trickWinner)alert("De slag is gewonnen door "+this._trickWinner+".");
        if(this._trickWinner){this._trickWinner=null;showTrick(this._trick);}
    }
    newCard(cardInfo){
        // I don't think we can do that????? this._trick.winner=cardInfo.winner;
        this._trick.addCard(new HoldableCard(cardInfo.suite,cardInfo.rank));
        // if the user is still looking at the trick winner (from the previous trick)
        // do nothing...
        if(this._trickWinner){this._trickWinner=null;showTrick(this._trick);}
    }
    /* replacing:
    parseTrick(trickInfo){
        let trick=new Trick(trickInfo.firstPlayer,trickInfo.trumpSuite,trickInfo.partnerSuite,trickInfo.partnerRank,trickInfo.canAskForPartnerCard);
        // already passed to the constructor!!!
        // trick._firstPlayer=trickInfo.firstPlayer;
        // trick._canAskForPartnerCard=trickInfo.canAskForPartnerCard;
        if(trickInfo.cards&&trickInfo.cards.length>0){
            // fill the trick with trick information from the other players!!!
            trickInfo.cards.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1]).holder=trick;}); // store the cards received in trick
            trick._winner=trickInfo.winner;
            trick._playSuite=trickInfo.playSuite;
            trick._askingForPartnerCard=trickInfo.askingForPartnerCard;
        }
        return trick;
    }
    */

    acknowledgeEvents(){
        // now if the unacknowledge event ids do NOT reach the server we will receive certain events again until we do
        // manage to get them over
        // make a copy of all the unacknowledged events
        let acknowledgeableEvents=this._unacknowledgedEvents.map((unacknowledgedEvent)=>Object.assign({},unacknowledgedEvent));
        console.log("Sending acknowledgeable events: ",acknowledgeableEvents);
        // of course we could send them passing an acknowledge function though
        if(acknowledgeableEvents.length>0){
            // emit passing along a callback function that should get called when the ACK message was received by the server
            this._socket.emit("ACK",acknowledgeableEvents,()=>{
                // we now may remove all acknowledgeable events
                console.log("****** Events acknowledgements received! ********");
                this._unacknowledgedEvents=[]; /////difference(this._unacknowledgedEvents,acknowledgeableEvents);
            });
        }
    }

    // generic method for processing any event, every
    processEvent(event,eventData,acknowledge){
        // log every event
        this.logEvent(event,eventData);
        if(!eventData)return;
        // if data has an id it needs to be acknowledged
        let eventId=(eventData.hasOwnProperty("id")?eventData.id:null);
        // if there's an event id in this event, and we're supposed to send acknowledgements, do so
        if(eventId){
            // MDH@17JAN2020: now push the event name as well so the server can log that and we can see what's acknowlegded!!!
            //                BUT don't push it again if it's already there!!!!
            if(acknowledge)
                if(this._unacknowledgedEvents.length===0||this._unacknowledgedEvents[this._unacknowledgedEvents.length-1].id!==eventId)
                    this._unacknowledgedEvents.push({'id':eventId,'event':event});
            this.acknowledgeEvents();
        }
        let data=(eventId?eventData.payload:eventData);
        switch(event){
            case "STATECHANGE":
                this.state=data.to;
                break;
            case "GAME":
                // console.log("Game information received by '"+currentPlayer.name+"'.",data);
                // we can set the name of the game now
                this.name=data;
                if(data.hasOwnProperty('players'))this.playerNames=data.players;
                break;
            case "PLAYERS":
                this.playerNames=data;
                break;
            case "DEALER":
                this._dealer=data;
                break;
            case "CARDS":
                // create holdable card from cardInfo passing in the current player as card holder
                currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
                data.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
                currentPlayer.renderCards();
                break;
            case "PARTNER":
                currentPlayer.partner=data;
                break;
            case "GAME_INFO":
                {
                    // typically the game info contains ALL information pertaining the game that is going to be played
                    // i.e. after bidding has finished
                    this._trumpSuite=data.trumpSuite;
                    this._partnerSuite=data.partnerSuite;
                    this._partnerRank=data.partnerRank;
                    this._highestBid=data.highestBid;
                    this._highestBidders=data.highestBidders;
                    this._fourthAcePlayer=data.fourthAcePlayer;
                }
                break;
            case "TO_BID":
                document.getElementById("bid-info").innerHTML="Speler <b>"+data+"</b> is aan de beurt.";
                break;
            case "MAKE_A_BID":
                currentPlayer.makeABid(data.playerBidsObjects,data.possibleBids);
                break;
            case "TO_PLAY":
                document.getElementById("play-info").innerHTML="Speler <b>"+data+"</b> is aan de beurt.";
                break;
            case "PLAYER_INFO":
                {
                    // will contain the current cards the user has
                    currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
                    data.cards.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
                    currentPlayer.renderCards();
                    // also the number of tricks won and to win
                    currentPlayer.numberOfTricksWon=data.numberOfTricksWon;
                    // TODO PLAYER_INFO does not need to send the following with each PLAYER_INFO THOUGH
                    currentPlayer.setNumberOfTricksToWin(data.numberOfTricksToWin);
                }
                break;
            case "TRICKS_TO_WIN":
                currentPlayer.setNumberOfTricksToWin(data);
                break;
            case "NEW_TRICK":
                this.newTrick(data);
                break;
            case "CARD_PLAYED":
                this.newCard(data);
                break;
            case "PLAY_A_CARD":
                // we're receiving trick info in data
                // MDH@20JAN2020: NOT anymore
                if(!this._trick)alert("Programmafout: U wordt om een kaart gevraagd in een ongedefinieerde slag!");
                currentPlayer.playACard(this._trick);
                break;
            case "CHOOSE_TRUMP_SUITE":
                currentPlayer.chooseTrumpSuite(data);
                break;
            case "CHOOSE_PARTNER_SUITE":
                currentPlayer.choosePartnerSuite(data.suites,data.partnerRankName);
                break;
            case "TRICK":
                updateTricks(this.parseTrick(data));
                break;
            case "TRICKS":
                {
                    // extract the tricks from the array of tricks in data
                    this._tricks=data.map((trickInfo)=>{return this.parseTrick(trickInfo);});
                    updateTricksPlayedTables();
                }
                break;
            case "RESULTS":
                this._deltaPoints=data.deltapoints;
                break;
            case "GAMEOVER":
                // kill the game instance (returning to the rules page until assigned to a game again)
                if(currentPlayer)currentPlayer.playsTheGameAtIndex(null,-1);
                // this.exit("in response to '"+data+"'");
                break;
            case "disconnect":
                this.state=PlayerGame.OUT_OF_ORDER;
                break;
            default:
                console.log("ERROR: Unknown event "+event+" received!");
        }
    }

    prepareForCommunication(){
        console.log("Preparing for communication");
        // this._socket.on('connect',()=>{
        //     this._state=IDLE;
        // });
        this._unacknowledgedEvents=[]; // keep track of the unacknowledgedEventIds
        this._socket.on('disconnect',()=>{this.processEvent('disconnect',null,true);});
        this._socket.on('STATECHANGE',(data)=>{this.processEvent('STATECHANGE',data,true);});
        this._socket.on('GAME',(data)=>{this.processEvent('GAME',data,true);});
        this._socket.on('PLAYERS',(data)=>{this.processEvent('PLAYERS',data,true);});
        this._socket.on('DEALER',(data)=>{this.processEvent('DEALER',data,true);});
        this._socket.on('CARDS',(data)=>{this.processEvent('CARDS',data,true);});
        this._socket.on('PARTNER',(data)=>{this.processEvent('PARTNER',data,true);});
        this._socket.on('GAME_INFO',(data)=>{this.processEvent('GAME_INFO',data,true);});
        this._socket.on("TO_BID",(data)=>{this.processEvent('TO_BID',data,true);});
        this._socket.on('MAKE_A_BID',(data)=>{this.processEvent('MAKE_A_BID',data,true);});
        this._socket.on("TO_PLAY",(data)=>{this.processEvent('TO_PLAY',data,true);});
        // MDH@13JAN2020: player info will be received before being asked to play a card to update the player data
        this._socket.on("PLAYER_INFO",(data)=>{this.processEvent('PLAYER_INFO',data,true);});
        this._socket.on('TRICKS_TO_WIN',(data)=>{this.processEvent('TRICKS_TO_WIN',data,true);});
        this._socket.on('NEW_TRICK',(data)=>{this.processEvent('NEW_TRICK',data,true);});
        this._socket.on('CARD_PLAYED',(data)=>{this.processEvent('CARD_PLAYED',data,true);});
        this._socket.on('PLAY_A_CARD',(data)=>{this.processEvent('PLAY_A_CARD',data,true);});
        this._socket.on('CHOOSE_TRUMP_SUITE',(data)=>{this.processEvent('CHOOSE_TRUMP_SUITE',data,true);});
        this._socket.on('CHOOSE_PARTNER_SUITE',(data)=>{this.processEvent("CHOOSE_PARTNER_SUITE",data,true);});
        this._socket.on('TRICK',(data)=>{this.processEvent('TRICK',data,true);});
        this._socket.on('TRICKS',(data)=>{this.processEvent('TRICKS',data,true);});
        this._socket.on('RESULTS',(data)=>{this.processEvent('RESULTS',data,true);});
        this._socket.on('GAMEOVER',(data)=>{this.processEvent('GAMEOVER',data,true);});
        // if we receive multiple events as a whole, we process all of them separately
        this._socket.on('EVENTS',(events)=>{
            // we could consume the events I guess
            while(events.length>0){
                event=events.shift(); // remove the first event
                // ascertain to send all unacknowledged event ids when this is the last process event!!!!
                this.processEvent(event.event,event.data,events.length===0);
            }
        });
    }

    // MDH@08JAN2020: socket should represent a connected socket.io instance!!!
    constructor(socket){
        // OOPS didn't like forgetting this!!! 
        // but PlayerGame does NOT have an explicit constructor (i.e. no required arguments)
        super();
        this._trickWinner=null;
        this._state=PlayerGame.OUT_OF_ORDER;
        this._socket=socket;
        this._dealer=-1;
        this._trumpSuite=-1;//this._trumpPlayer=-1;
        this._partnerSuite=-1;this._partnerRank=-1;
        this._numberOfTricksWon=[0,0,0,0]; // assume no tricks won by anybody
        this._numberOfTricksPlayed=0;this._trick=null;
        this._highestBid=-1;this._highestBidders=[]; // no highest bidders yet
        this._deltaPoints=null;
        this._points=null;
        this._lastTrickPlayed=null;
        this._teamNames=null;
        this._playerIndex=-1; // the 'current' player
        // things we can store internally that we receive over the connection
        this._name=null; // the name of the game
        this._playerNames=null; // the names of the players
        this._partnerIndices=null; // the partner
        this.prepareForCommunication();
    }

    // information about the game itself organized by state
    // PLAYING
    getTrumpSuite(){return this._trumpSuite;}
    getPartnerSuite(){return this._partnerSuite;}
    getPartnerRank(){return this._partnerRank;}
    // getTrumpPlayer(){return this._trumpPlayer;}
    getNumberOfTricksWonByPlayer(player){return this._numberOfTricksWon[player];}
    
    getPartnerName(player){ // only when player equals this._playerIndex do we know the partner
        let partner=(player===this._playerIndex?currentPlayer.partner:-1);
        return(partner>=0&&partner<this.numberOfPlayers?this._playerNames[partner]:null);
    }

    getHighestBidders(){return this._highestBidders;}
    getHighestBid(){return this._highestBid;}
    // MDH@03JAN2020: I needed to add the following methods
    getPlayerName(player){return this._playerNames[player];}
    get deltaPoints(){return this._deltaPoints;}
    get points(){return this._points;}
    isPlayerPartner(player,otherPlayer){return this._partnerIds[player]===otherPlayer;}
    getLastTrickPlayed(){return this._lastTrickPlayed;}
    get numberOfTricksPlayed(){return this._numberOfTricksPlayed;}
    getTrickAtIndex(trickIndex){} // get the last trick played
    getTeamName(player){return this._getTeamNames[player];}
    get fourthAcePlayer(){return this._fourthAcePlayer;}

}

var preparedForPlaying=false;

function prepareForPlaying(){

    preparedForPlaying=true;

    // MDH@10JAN2020: we want to know when the user is trying to move away from the page
    window.onbeforeunload=function(){
        // how about prompting the user?????
        // if(!currentPlayer||!currentPlayer.game)return; // do not ask the user whether they want to stay or not (as they cannot stay)
        // if the user is viewing the results page we may assume that the game is actually over
        return(currentPage==='page-results'?"Bedankt voor het spelen. Tot de volgende keer!"
                                           :"Het spel is nog niet ten einde. Blijf op de pagina om toch verder te spelen.");
    };
    // if we actually end up in leaving this URL, we definitely want to kill the connection to the server for good
    window.onpopstate=function(){
        if(currentPlayer&&currentPlayer.game&&currentPlayer.game.state!==PlayerGame.FINISHED)
            console.log("WARNING: Player '"+currentPlayer.name+"' has stopped playing the game any further, effectively canceling it.");
        (!currentPlayer||currentPlayer.exit()); // apparently the current player should exit!!!!
        setPlayerName(null,null); // without callback no page should be shown anymore...
    }

    // MDH@09JAN2020: hide the bidding and playing elements
    document.getElementById("bidding").style.visibility="hidden";
    // replaced by bid-info: document.getElementById("wait-for-bid").style.visibility="visible";
    // DO NOT DO THIS WILL OVERRULE PARENT: document.getElementById("playing").style.visibility="visible"; // MDH@19JAN2020: "hidden" changed to "visible" as we never hide the cards of the current players
    // replaced by play-info: document.getElementById("wait-for-play").style.visibility="hidden"; // MDH@19JAN2020: and vice versa

    document.getElementById('single-player-game-button').onclick=singlePlayerGameButtonClicked;
    
    for(let backButton of document.getElementsByClassName('back'))backButton.onclick=returnToPreviousPage;
    // show the page-rules page when the user requests help
    for(let helpButton of document.getElementsByClassName('help'))helpButton.onclick=showHelp;
    // MDH@10JAN2020: END

    // event handlers for next, cancel, and newPlayers buttons
    for(let nextButton of document.getElementsByClassName('next'))nextButton.onclick=nextPage;
    for(let cancelButton of document.getElementsByClassName('cancel'))cancelButton.onclick=cancelPage;
    
    // let's assume that the game is over when new-game buttons are showing
    // we're not to kill the connection, we'll just keep using the same connection
    for(let newGameButton of document.getElementsByClassName("new-game"))newGameButton.onclick=newGame;
    /*
    // whenever we have new player(name)s
    for(let newGamePlayersButton of document.getElementsByClassName('new-game-players'))newGamePlayersButton.onclick=newGamePlayers;
    // whenever the game is canceled
    for(let cancelGameButton of document.getElementsByClassName('cancel-game'))cancelGameButton.onclick=cancelGame;
    */

    // attach an onclick event handler for all bid buttons
    for(let bidButton of document.getElementsByClassName("bid"))bidButton.onclick=bidButtonClicked;
    
    // prepare for showing/hiding the cards of the current bidder
    initializeBidderSuitecardsButton();
    // replacing: document.getElementById("toggle-bidder-cards").onclick=toggleBidderCards;

    // event handler for selecting a suite
    for(let suiteButton of document.querySelectorAll(".suite.bid-trump"))suiteButton.onclick=trumpSuiteButtonClicked;
    for(let suiteButton of document.querySelectorAll(".suite.bid-partner"))suiteButton.onclick=partnerSuiteButtonClicked;
    
    // make the suite elements of a specific type show the right text!!!!
    for(let suite=0;suite<4;suite++)
        for(let suiteButton of document.querySelectorAll(".suite."+Card.SUITE_NAMES[suite]))
            suiteButton.value=Card.SUITE_CHARACTERS[suite];

    // MDH@09JAN2020: check for a user name
    var urlParams = new URLSearchParams(window.location.search);
    let initialPlayerName=(urlParams.has("player")?urlParams.get("player").trim():null);
    if(initialPlayerName)setPlayerName(initialPlayerName,(err)=>{});

};

// MDH@08JAN2020: great idea to make everything work by allowing to set the player name
function _setPlayer(player,errorcallback){
    visitedPages=[]; // forget visited pages
    currentPage=null; // ascertain to not have a page to store
    // get rid of the current player (if any), and in effect we'll loose the game as well
    if(currentPlayer){
        // no need to change currentPlayer because it's gonna be replaced anyway
        // but will disconnect from the server anyway
        let clientsocket=currentPlayer._client;
        // disconnect if need be
        (!clientsocket||!clientsocket.connected||clientsocket.disconnect());
        // replacing: currentPlayer.game=null; // get rid of the game (which will disconnect the socket as well) WISHFUL THINKING...
        currentPlayer=null;
        showCurrentPlayerName();
        if(errorcallback)setPage("page-rules"); // MDH@10JAN2020: whenever the currentPlayer is NOT available go to "page-rules"
    }
    // if(errorcallback)setPage("page-rules"); // the page we can show if there's no player!!!! (TODO or page-auth?????)
    if(player){
        let clientsocket=io(location.protocol+'//'+location.host);
        clientsocket.on('connect',()=>{
            if(clientsocket.connected){
                console.log("Connected!!!");
                clientsocket.emit('PLAYER',player.name);
                currentPlayer=player;
                showCurrentPlayerName();
                // unfortunately we can only set the game of the player if _index is non-negative, so we pass in 4
                currentPlayer.index=4;
                currentPlayer.game=new PlayerGameProxy(clientsocket);
                if(errorcallback){errorcallback(null);setPage("page-wait-for-players");}
                // replacing: (typeof errorcallback!=='function'||errorcallback(null));            
            }else{
                (typeof errorcallback!=='function'||errorcallback(new Error("Failed to connect to the server.")));
            }
        });
        clientsocket.on('connect_error',(err)=>{
            console.log("Connect error: ",err);
            (typeof errorcallback!=='function'||errorcallback(err));
        });
        // try to connect to the server catching whatever happens through events
        clientsocket.connect(/*(err)=>{
            debugger
            if(!err){
                // by default use errorcallback to return any error occurring
                if(typeof errorcallback==='function')
                    clientsocket.on('error',errorcalback);
                else // default implementation that logs to the console!!
                    clientsocket.on('error',(err)=>{
                        console.log("GAMEPLAYING >>> ERROR: Something went wrong in the communication with the server.")
                        console.error("\t"+err);
                    });
                console.log("Emitting player name '"+player.name+"'.");
                clientsocket.emit('PLAYER',player.name);
                currentPlayer=player;
                // plug in a game?????
                currentPlayer.game=new PlayerGameProxy(clientsocket);
            }else
                console.log("ERROR: Failed to connect to the remote game server");
            (typeof errorcallback!=='function'||errorcallback(err));
        }*/);
    }else
        (typeof errorcallback!=='function'||errorcallback(null));
}

// call setPlayerName with the (new) name of the current player whenever the player wants to play
// call setPlayerName with null (or empty) player name
// to make it callable from anywhere we attach setPlayerName to window (because client.js will be browserified!!!)
function setPlayerName(playerName,errorCallback){
    (preparedForPlaying||prepareForPlaying()); // prepare for playing once
    // if(errorCallback)setPage("page-rules"); // ascertain to not be in a non-player page
    // playerName needs to be a string (if it is defined)
    if(playerName&&!(typeof playerName==="string"))
        return(typeof errorCallback!=='function'||errorCallback(new Error("Invalid player name.")));
    // if playerName matches the current player's name, nothing to do
    if(playerName&&currentPlayer&&currentPlayer.name===playerName)
        (typeof errorCallback!=='function'||errorCallback(null));
    else
        _setPlayer(playerName&&playerName.length>0?new OnlinePlayer(playerName):null,errorCallback);
}

window.onload=prepareForPlaying;

// export the two function that we allow to be called from the outside!!!
module.exports=setPlayerName;
},{"./Card.js":1,"./CardHolder.js":2,"./Player.js":3,"./Trick.js":4}]},{},[5])(5)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBkZWZpbml0aW9uIG9mIGEgcGxheWluZyBDYXJkXG4gKi9cbmNsYXNzIENhcmR7XG5cbiAgICBzdGF0aWMgZ2V0IFNVSVRFX05BTUVTKCl7cmV0dXJuIFtcImRpYW1vbmRcIixcImNsdWJcIixcImhlYXJ0XCIsXCJzcGFkZVwiXTt9XG4gICAgc3RhdGljIGdldCBSQU5LX05BTUVTKCl7cmV0dXJuIFtcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCJqYWNrXCIsXCJxdWVlblwiLFwia2luZ1wiLFwiYWNlXCJdO31cbiAgICAvLyBzaG9ydGhhbmQgJ2NoYXJhY3RlcnMnIGZvciB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uXG4gICAgLy8gTk9UIFdPUktJTkc6IGNvbnN0IENBUkRfU1VJVEVfQ0hBUkFDVEVSUz1bU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY2KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjMpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2NSksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYwKV07XG4gICAgc3RhdGljIGdldCBTVUlURV9DSEFSQUNURVJTKCl7cmV0dXJuIFsnXFx1MjY2NicsJ1xcdTI2NjMnLCdcXHUyNjY1JywnXFx1MjY2MCddfTsgLy8gWUVTLCBXT1JLSU5HISEhISFcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0RJQU1PTkQoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0xVQigpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBTVUlURV9IRUFSVCgpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBTVUlURV9TUEFERSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWycyJywnMycsJzQnLCc1JywnNicsJzcnLCc4JywnOScsJzEwJywnQicsJ1YnLCdLJywnQSddO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RXTygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RIUkVFKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRk9VUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZJVkUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TSVgoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TRVZFTigpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBSQU5LX0VJR0hUKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfTklORSgpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBSQU5LX1RFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBSQU5LX0pBQ0soKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19RVUVFTigpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19LSU5HKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBSQU5LX0FDRSgpe3JldHVybiAxMjt9O1xuXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkcyhjYXJkMSxjYXJkMil7XG4gICAgICAgIGxldCBkZWx0YVN1aXRlPWNhcmQxLl9jYXJkU3VpdGVJbmRleC1jYXJkMi5fY2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIGlmKGRlbHRhU3VpdGUhPTApcmV0dXJuIGRlbHRhU3VpdGU7XG4gICAgICAgIHJldHVybiBjYXJkMS5fY2FyZE5hbWVJbmRleC1jYXJkMi5fY2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgXG4gICAgLy8gaW4gYSB0cmljayB0aGUgcGxheSBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgY2FyZHMgYXJlIHRvIGJlIHBsYXllZCwgdGhlIHRydW1wIHN1aXRlIGRldGVybWluZXMgd2hhdCB0cnVtcCBpc1xuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZDEsY2FyZDIscGxheVN1aXRlLHRydW1wU3VpdGUpe1xuICAgICAgICAvLyBub3JtYWxseSB3aXRoIGFueSB0d28gcmVndWxhciBjYXJkcyB0aGV5IGFyZSBuZXZlciBlcXVhbCBpbiBhIHRyaWNrXG4gICAgICAgIC8vIGNhcmRzIHRoYXQgYXJlIG5laXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSBpcyBpcnJlbGV2YW50XG4gICAgICAgIGxldCByZXN1bHQ9MDtcbiAgICAgICAgbGV0IHR5cGU9Jy0nO1xuICAgICAgICAvLyAxLiBpZiBjYXJkMSBpcyB0cnVtcCwgYW5kIGNhcmQyIGlzIG5vdCBvciBoYXMgYSBsb3dlciByYW5rIGNhcmQxIHdpbnNcbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXRydW1wU3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0EnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBOT1QgdHJ1bXAgYnV0IGNhcmQyIGNvdWxkIHN0aWxsIGJlIHRydW1wXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nQic7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyB0cnVtcCwgc28gY291bGQgYmUgcGxheSBzdWl0ZSBvciBub3QuLi5cbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdDJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgbm90IHBsYXkgc3VpdGUsIGJ1dCBjYXJkMiBjb3VsZCBiZVxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nRCc7fVxuICAgICAgICBjb25zb2xlLmxvZygnPj4+IFR5cGU6ICcrdHlwZSsnOiAnK2NhcmQxLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiKHN1aXRlOiBcIitjYXJkMS5zdWl0ZStcIilcIisocmVzdWx0PjA/JyA+ICc6KHJlc3VsdDwwPycgPCAnOicgPSAnKSkrY2FyZDIuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKHN1aXRlOiBcIitjYXJkMi5zdWl0ZStcIilcIitcIiAocGxheTogXCIrKHBsYXlTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3BsYXlTdWl0ZV06XCI/XCIpK1wiLCB0cnVtcDpcIisoKHRydW1wU3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1t0cnVtcFN1aXRlXTpcIj9cIikpK1wiKVwiKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAvLyBsZXQncyBmaXJzdCByZWNvbXB1dGUgdGhlIHN1aXRlIG9mIGJvdGggY2FyZHMgYW5kIGVsZXZhdGUgdHJ1bXAgY2FyZHMsIGFuZCBkZWV2YWx1YXRlIG5vbiBwbGF5U3VpdGUgY2FyZHNcbiAgICAgICAgbGV0IGNhcmQxU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQxLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDEuc3VpdGUpKTtcbiAgICAgICAgbGV0IGNhcmQyU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDIuc3VpdGUpKTtcbiAgICAgICAgaWYoY2FyZDFTdWl0ZT49MHx8Y2FyZDJTdWl0ZT49MCl7IC8vIGF0IGxlYXN0IG9uZSBvZiB0aGUgY2FyZHMgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgLy8gaWYgdGhlIHN1aXRlcyBhcmUgdGhlIHNhbWUgdGhlIGhpZ2hlc3QgcmFuayB3aW5zXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPDApcmV0dXJuIC0xOyAvLyBpZiB0aGUgZmlyc3QgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBsb3dlclxuICAgICAgICAgICAgaWYoY2FyZDJTdWl0ZTwwKXJldHVybiAxOyAvLyBpZiB0aGUgc2Vjb25kIGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgaGlnaGVyXG4gICAgICAgICAgICAvLyBBU1NFUlQgYm90aCBjYXJkcyBhcmUgZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU9PWNhcmQyU3VpdGUpcmV0dXJuIGNhcmQxLnJhbmstY2FyZDIucmFuaztcbiAgICAgICAgICAgIC8vIEFTU0VSVCBvbmUgY2FyZCBpcyBwbGF5IHN1aXRlLCB0aGUgb3RoZXIgbXVzdCBiZSB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgcmV0dXJuKGNhcmQxU3VpdGU9PTQ/MTotMSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlLCBib3RoIGNhcmRzIGFyZSBpcnJlbGV2YW50IChzaG91bGQgaGFwcGVuIHRob3VnaClcbiAgICAgICAgcmV0dXJuIDA7IC8vIGNvbnNpZGVyZWQgZXF1YWwgdGhhdCBpcyBpcnJlbGV2YW50XG4gICAgfVxuICAgIFxuICAgIC8vIC8vIHlvdSdkIGhhdmUgdG8gdXNlIHRoZSBBcHBsZSBTeW1ib2xzIGZvbnRcbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpTwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgrE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CvjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4K9PC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgrs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CujwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4K5PC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgrg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CtzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4K2PC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgrU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CtDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KzPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgrI8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmjPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DkTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OePC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg508L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DmzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OaPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg5k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DmDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OXPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg5Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DlTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OUPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg5M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DkjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaY8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4OBPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg448L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DjTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4OLPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg4o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DiTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OIPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg4c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DhjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OFPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg4Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DgzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OCPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgqE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CrjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4KtPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgqs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CqjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4KpPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgqg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CpzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4KmPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgqU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CpDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KjPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgqI8L2xpPlxuICAgIHN0YXRpYyBnZXQgQ0FSRF9BUFBMRV9TWU1CT0xTKCl7cmV0dXJuIFtcbiAgICAgICAgWyfwn4OCJywn8J+DgycsJ/Cfg4QnLCfwn4OFJywn8J+DhicsJ/Cfg4cnLCfwn4OIJywn8J+DiScsJ/Cfg4onLCfwn4OLJywn8J+DjScsJ/Cfg44nLCfwn4OBJ10sXG4gICAgICAgIFsn8J+DkicsJ/Cfg5MnLCfwn4OUJywn8J+DlScsJ/Cfg5YnLCfwn4OXJywn8J+DmCcsJ/Cfg5knLCfwn4OaJywn8J+DmycsJ/Cfg50nLCfwn4OeJywn8J+DkSddLFxuICAgICAgICBbJ/CfgrInLCfwn4KzJywn8J+CtCcsJ/CfgrUnLCfwn4K2Jywn8J+CtycsJ/CfgrgnLCfwn4K5Jywn8J+CuicsJ/CfgrsnLCfwn4K9Jywn8J+CvicsJ/CfgrEnXSxcbiAgICAgICAgWyfwn4KiJywn8J+CoycsJ/CfgqQnLCfwn4KlJywn8J+CpicsJ/CfgqcnLCfwn4KoJywn8J+CqScsJ/CfgqonLCfwn4KrJywn8J+CrScsJ/Cfgq4nLCfwn4KhJ11cbiAgICBdfTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpe1xuICAgICAgICB0aGlzLl9jYXJkU3VpdGVJbmRleD1jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgdGhpcy5fY2FyZE5hbWVJbmRleD1jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICB0b1N0cmluZygpe1xuICAgICAgICByZXR1cm4gQ2FyZC5SQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdK1wiIG9mIFwiK0NhcmQuU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wic1wiO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuaygpe3JldHVybiB0aGlzLl9jYXJkTmFtZUluZGV4O31cbiAgICBnZXQgc3VpdGUoKXtyZXR1cm4gdGhpcy5fY2FyZFN1aXRlSW5kZXg7fVxuXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCl7XG4gICAgICAgIC8vIGlmIHdlJ3JlIHVzaW5nIHRoZSBzdmctY2FyZHMuc3ZnIHdlIGNhbiBkbyB0aGUgZm9sbG93aW5nLCBidXQgaW4gdGhhdCBjYXNlIHdlJ2QgbmVlZCB0byBrbm93IHRoZSBtYWduaWZpY2F0aW9uIGZhY3RvciEhIVxuICAgICAgICAvL3JldHVybiBDQVJEX0ZPTlRfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vcmV0dXJuICc8c3ZnIHZpZXdCb3g9XCIwIDAgNjc2IDk3NlwiPjx1c2UgeGxpbms6aHJlZj1cImltZy9zdmctY2FyZHMuc3ZnIycrU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wiLVwiK1JBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rJzwvdXNlPjwvc3ZnPic7XG4gICAgICAgIHJldHVybiBDYXJkLkNBUkRfQVBQTEVfU1lNQk9MU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vLy8vL3JldHVybiBTVUlURV9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XS5jb25jYXQoUkFOS19DSEFSQUNURVJTW3RoaXMuX2NhcmROYW1lSW5kZXhdKTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9Q2FyZDsiLCIvKipcbiAqIGRlZmluZXMgc29tZW9uZSB0aGF0IGhvbGRzIGNhcmRzXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5cbmNsYXNzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ESEAwNERFQzIwMTk6IGFsbG93aW5nIG5vdyB0byBjb25zdHJ1Y3QgZml4ZWQgc2l6ZSBjYXJkIGhvbGRlcnMgKGxpa2UgVHJpY2spXG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZDYXJkcz0wKXtcbiAgICAgICAgdGhpcy5fY2FyZHM9W107XG4gICAgICAgIHRoaXMuX251bWJlck9mQ2FyZHM9bnVtYmVyT2ZDYXJkcztcbiAgICAgICAgd2hpbGUoLS1udW1iZXJPZkNhcmRzPj0wKXRoaXMuX2NhcmRzLnB1c2gobnVsbCk7XG4gICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTtcbiAgICB9XG5cbiAgICAvLyBtZXRob2RzIHRvIGFkanVzdCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgX3JlbW92ZUNhcmQoY2FyZCl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMuaW5kZXhPZihjYXJkKTtcbiAgICAgICAgaWYoY2FyZEluZGV4Pj0wKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzLnNwbGljZShjYXJkSW5kZXgsMSkubGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrY2FyZCtcIiByZW1vdmVkIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIi5cIik7XG4gICAgICAgICAgICAgICAgY2FyZC5faG9sZGVyPW51bGw7IC8vIHdoZW4gc3VjY2Vzc2Z1bCBhcHBhcmVudGx5IG5vIGxvbmdlciBhdmFpbGFibGUhISFcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIiBvZiBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiOiBpdCBpcyBub3QgcHJlc2VudC5cIik7XG4gICAgfVxuICAgIF9hZGRDYXJkKGNhcmQpe1xuICAgICAgICBpZighY2FyZClyZXR1cm47XG4gICAgICAgIGlmKCEoY2FyZCBpbnN0YW5jZW9mIEhvbGRhYmxlQ2FyZCkpdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgaG9sZGFibGUgY2FyZCFcIik7XG4gICAgICAgIHRoaXMubG9nKFwiQWRkaW5nIGNhcmQgXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgdGhpcy5fY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPm51bWJlck9mQ2FyZHNOb3cpe1xuICAgICAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlOyAvLyBjYW4gbm8gbG9uZ2VyIGd1YXJhbnRlZSB0aGF0IGl0IGlzIHNvcnRlZC4uLlxuICAgICAgICAgICAgY2FyZC5faG9sZGVyPXRoaXM7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIChcIitjYXJkLnRvU3RyaW5nKCkrXCIpIGFkZGVkIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgICAgICAvLyBob3cgYWJvdXQgb3JkZXJpbmcgdGhlIGNhcmRzPz8/Pz8/IG9yIHN0b3JpbmcgdGhlbSBieSBzdWl0ZT8/Pz9cbiAgICAgICAgICAgIHRoaXMubG9nKFwiXFx0Q2FyZCBjb2xsZWN0aW9uOiBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gYWRkIGNhcmQgXCIrY2FyZCtcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIgKGRlbHRhIG51bWJlciBvZiBjYXJkczogXCIrKHRoaXMubnVtYmVyT2ZDYXJkcy1udW1iZXJPZkNhcmRzTm93KStcIikuXCIpO1xuICAgIH1cbiAgICAvKlxuICAgIC8vIHJlcGxhY2UgYSBjYXJkIGF0IGEgZ2l2ZW4gaW5kZXggKGFzIHVzZWQgaW4gVHJpY2spXG4gICAgX3NldENhcmRBdEluZGV4KGNhcmQsaW5kZXgpe1xuICAgICAgICBpZihpbmRleDwwfHxpbmRleD49dGhpcy5udW1iZXJPZkNhcmRzKXRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlcGxhY2UgY2FyZCAjXCIrU3RyaW5nKGluZGV4KzEpK1wiLlwiKTtcbiAgICAgICAgbGV0IGNhcmRBdEluZGV4PXRoaXMuX2NhcmRzW2luZGV4XTtcbiAgICAgICAgaWYoY2FyZEF0SW5kZXgpe2NhcmRBdEluZGV4Ll9ob2xkZXI9bnVsbDt0aGlzLl9jYXJkc1tpbmRleF09bnVsbDt9XG4gICAgICAgIGlmKGNhcmQpe1xuICAgICAgICAgICAgLy8gaWYgJ2NvbnRhaW5lZCcgaW4gYW5vdGhlciBjYXJkIGhvbGRlciByZW1vdmUgaXQgZnJvbSB0aGVyZSEhIVxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIGlmKGNhcmQuX2hvbGRlciljYXJkLl9ob2xkZXIucmVtb3ZlQ2FyZChjYXJkKTtcbiAgICAgICAgICAgICAgICBpZighY2FyZC5faG9sZGVyKXt0aGlzLl9jYXJkc1tpbmRleF09Y2FyZDtjYXJkLl9ob2xkZXI9dGhpczt9ICAgIFxuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXt9XG4gICAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgICAvLyBwb2xsIHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBnZXQgbnVtYmVyT2ZDYXJkcygpe3JldHVybiB0aGlzLl9jYXJkcy5sZW5ndGg7fVxuXG4gICAgZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5yYW5rPT1yYW5rO30pO1xuICAgIH1cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuaykubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoc3VpdGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnN1aXRlPT1zdWl0ZTt9KS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudFxuICAgICAqL1xuICAgIGdldFN1aXRlcygpe1xuICAgICAgICAvLyBjYW4ndCB1c2UgdGhpcyBpbiBmaWx0ZXIhISEgcmV0dXJuIFswLDEsMiwzXS5maWx0ZXIoKHJhbmspPT57cmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKT4wO30pO1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIG51bWJlciBvZiBjYXJkcyBpbiB0aGUgaG9sZGVyIHdpdGggdGhlIGdpdmVuIHJhbmtcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5pbmcgYW4gYXJyYXkgd2l0aCBhbGwgc3VpdGVzLCB3aXRoIC0xIHdoZXJlIGEgc3VpdGUgaXMgbm90IHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgY2FyZHMgXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhvdXRSYW5rKHJhbmspe1xuICAgICAgICBsZXQgc3VpdGVzPVswLDEsMiwzXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlc1tjYXJkLnN1aXRlXT0tMTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudCBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgZ2V0UmFua2xlc3NTdWl0ZXMocmFuayl7XG4gICAgICAgIGxldCByYW5rbGVzc1N1aXRlcz1bXTtcbiAgICAgICAgbGV0IHN1aXRlc1dpdGhSYW5rcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaChcbiAgICAgICAgICAgIChjYXJkKT0+e1xuICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCYmc3VpdGVzV2l0aFJhbmtzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuY2FyZE5hbWVJbmRleD09cmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWl0ZXNXaXRoUmFua3MucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgc3VpdGUgaWYgYWxyZWFkeSBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZUluZGV4PXJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlSW5kZXg+PTApcmFua2xlc3NTdWl0ZXMuc3BsaWNlKHJhbmtsZXNzU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgLy8gdW50aWwgcHJvdmVuIGRpZmZlcmVudGx5XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5rbGVzc1N1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJhbmtsZXNzU3VpdGVzO1xuICAgIH1cblxuICAgIGdldEZpcnN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1swXTt9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB1c2VkIGluIGdhbWVlbmdpbmUuanNcbiAgICBnZXRMYXN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkcy5sZW5ndGgtMV07fVxuXG4gICAgY29udGFpbnNDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZD49MCYmKHRoaXMuX2NhcmRzW2NhcmRdLnN1aXRlIT09c3VpdGV8fHRoaXMuX2NhcmRzW2NhcmRdLnJhbmshPT1yYW5rKSk7XG4gICAgICAgIHJldHVybihjYXJkPj0wKTsgLy8gZm91bmQgaWYgY2FyZCBpcyBub3QgbmVnYXRpdmVcbiAgICB9XG5cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSBuZWVkIHRoaXMgdG8gZmluZCBhIHNwZWNpZmljIGNhcmRcbiAgICBnZXRDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkSW5kZXg+PTApe2xldCBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07aWYoY2FyZC5zdWl0ZT09PXN1aXRlJiZjYXJkLnJhbms9PT1yYW5rKXJldHVybiBjYXJkO31cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FuIGV4cG9zZSBhIHRleHQgcmVwcmVzZW50aW9uXG4gICAgICovXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHN1aXRlU2VwYXJhdG9yKXtcbiAgICAgICAgdGhpcy5sb2coXCJOdW1iZXIgb2YgY2FyZHMgdG8gcmVwcmVzZW50OiBcIit0aGlzLl9jYXJkcy5sZW5ndGgrXCIuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgc29ydGluZz8/Pz8/Pz8/IHRoYXQgd291bGQgYmUgbmljZVxuICAgICAgICBpZihzdWl0ZVNlcGFyYXRvciYmdHlwZW9mIHN1aXRlU2VwYXJhdG9yPT09XCJzdHJpbmdcIiYmIXRoaXMuX3NvcnRlZCl7XG4gICAgICAgICAgICB0aGlzLl9jYXJkcy5zb3J0KGNvbXBhcmVDYXJkcyk7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9dHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5fc29ydGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLm1hcCgoY2FyZCk9PntyZXR1cm4gY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTt9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgLy8gY2FyZHMgYXJlIHN1cHBvc2VkIHRvIGJlIHNvcnRlZFxuICAgICAgICBsZXQgdGV4dFJlcHJlc2VudGF0aW9uPVwiXCI7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGxldCBjYXJkPXRoaXMuZ2V0Rmlyc3RDYXJkKCk7XG4gICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb249Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTE7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz0oY2FyZC5zdWl0ZSE9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT9zdWl0ZVNlcGFyYXRvcjpcIiBcIik7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dFJlcHJlc2VudGF0aW9uOyAvLyBhIHNpbmdsZSBibGFuayBiZXR3ZWVuIHRoZW0hISFcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhIGNhcmQgd2l0aCBhIGNhcmQgaG9sZGVyIGlzIGhlbGRcbiAqL1xuY2xhc3MgSG9sZGFibGVDYXJkIGV4dGVuZHMgQ2FyZHtcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSE9MREFCTEVDQVJEID4+PiBcIit0b2xvZyk7XG4gICAgfVxuXG4gICAgc2V0IGhvbGRlcihob2xkZXIpe1xuICAgICAgICB0aGlzLmxvZyhcIkNoYW5naW5nIHRoZSBob2xkZXIgb2YgY2FyZCBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgY3VycmVudCBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYodGhpcy5faG9sZGVyKXRoaXMuX2hvbGRlci5fcmVtb3ZlQ2FyZCh0aGlzKTtcbiAgICAgICAgLy8gYWRkICh3aGVuIHN1Y2Nlc3NmdWxseSByZW1vdmVkKSB0byB0aGUgbmV3IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZighdGhpcy5faG9sZGVyJiZob2xkZXIpaG9sZGVyLl9hZGRDYXJkKHRoaXMpO2Vsc2UgdGhpcy5sb2coXCJFUlJPUjogVW5hYmxlIHRvIGNoYW5nZSB0aGUgaG9sZGVyIVwiKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4LGhvbGRlcil7XG4gICAgICAgIHN1cGVyKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpO1xuICAgICAgICB0aGlzLl9ob2xkZXI9bnVsbDtcbiAgICAgICAgdGhpcy5ob2xkZXI9aG9sZGVyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIFwiSG9sZGFibGUgXCIrc3VwZXIudG9TdHJpbmcoKTt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9e0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfTsiLCIvKipcbiAqIGEgcGxhY2Vob2xkZXIgZm9yIGEgcGxheWVyXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG4vKipcbiAqIGEgUGxheWVyIGNhbiBtYWtlIGEgYmlkLCBvciBwbGF5IGEgY2FyZCwgY2hvb3NlIGEgdHJ1bXAgYW5kIHBhcnRuZXIgc3VpdGVcbiAqL1xuY2xhc3MgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBiaWRNYWRlKGJpZCl7fVxuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7fVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7fVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe31cbn1cblxuLy8gTURIQDA3REVDMjAxOTogUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXIgd2l0aCBnYW1lIGRhdGEgZXhwb3NlZCB0byBwbGF5ZXJcbi8vICAgICAgICAgICAgICAgIHdoaWNoIHdhcyBlYXJsaWVyIHN0b3JlZCBpbiBlYWNoIHRyaWNrXG5jbGFzcyBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBzdGF0aWMgZ2V0IEJJRF9OQU1FUygpe3JldHVybiBbXCJwYXNcIixcInJpa1wiLFwicmlrIChiZXRlcilcIixcIm5lZ2VuIGFsbGVlblwiLFwibmVnZW4gYWxsZWVuIChiZXRlcilcIixcInBpY29cIixcInRpZW4gYWxsZWVuXCIsXCJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJlbGYgYWxsZWVuXCIsXCJlbGYgYWxsZWVuIChiZXRlcilcIixcIm1pc1xceGU4cmVcIixcInR3YWFsZiBhbGxlZW5cIixcInR3YWFsZiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlXCIsXCJkZXJ0aWVuIGFsbGVlblwiLFwiZGVydGllbiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlIG1ldCBlZW4gcHJhYXRqZVwiLFwidHJvZWxhXCIsXCJvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWdcIixcIm9tIGRlIGxhYXRzdGUgc2xhZ1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BBUygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBCSURfUklLKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUtfQkVURVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTigpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QSUNPKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTigpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX01JU0VSRSgpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU4oKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDEyO307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkUoKXtyZXR1cm4gMTM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTigpe3JldHVybiAxNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDE1O307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFKCl7cmV0dXJuIDE2O307XG4gICAgc3RhdGljIGdldCBCSURfVFJPRUxBKCl7cmV0dXJuIDE3O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHX0VOX1NDSE9QUEVOX1ZST1VXKCl7cmV0dXJuIDE4O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHKCl7cmV0dXJuIDE5O307XG4gICAgc3RhdGljIGdldCBCSURTX0FMTF9DQU5fUExBWSgpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUElDTyxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRSxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkVdO307IC8vIHRydW1wbGVzcyBnYW1lc1xuICAgIHN0YXRpYyBnZXQgQklEU19XSVRIX1BBUlRORVJfSU5fSEVBUlRTKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIsUGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSXTt9OyAvLyBnYW1lcyB3aXRoIHRydW1wIHBsYXllZCB3aXRoIGEgcGFydG5lclxuICAgIHN0YXRpYyBnZXQgQklEX1JBTktTKCl7cmV0dXJuIFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywwLC0xLC0xXTt9OyAvLyBob3cgSSBwbGF5ZWQgaXQgKGJpZCBwYXNzIGV4Y2x1ZGVkIChhbHdheXMgcmFuayAwKSlcbiAgICBcbiAgICAvLyBlYWNoIGJpZCBoYXMgYSBjZXJ0YWluIGFtb3VudCBvZiBwb2ludHMgdG8gcmVjZWl2ZSB3aGVuIHdpbm5pbmcgdGhlIGdhbWVcbiAgICBzdGF0aWMgZ2V0IEJJRF9QT0lOVFMoKXtyZXR1cm4gWzAsMSwxLDMsMyw0LDQsNCw1LDUsNSw2LDYsNiw3LDcsMTAsMiwyLDJdO31cblxuICAgIC8vIHRoZSBzdGF0ZSBjb25zdGFudHMgd2UgaGF2ZVxuICAgIHN0YXRpYyBnZXQgT1VUX09GX09SREVSKCl7cmV0dXJuIDA7fVxuICAgIHN0YXRpYyBnZXQgSURMRSgpe3JldHVybiAxO31cbiAgICBzdGF0aWMgZ2V0IERFQUxJTkcoKXtyZXR1cm4gMjt9XG4gICAgc3RhdGljIGdldCBCSURESU5HKCl7cmV0dXJuIDM7fVxuICAgIHN0YXRpYyBnZXQgUExBWUlORygpe3JldHVybiA0O31cbiAgICBzdGF0aWMgZ2V0IENBTkNFTElORygpe3JldHVybiA1O31cbiAgICBzdGF0aWMgZ2V0IEZJTklTSEVEKCl7cmV0dXJuIDY7fVxuICAgIGdldFRydW1wU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7fVxuICAgIGdldFRydW1wUGxheWVyKCl7fVxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVyKXt9XG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXt9XG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXt9XG4gICAgZ2V0IHBvaW50cygpe31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzUGxheWVkKCl7fVxuICAgIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXRUZWFtTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7fVxufVxuXG5jb25zdCBDSE9JQ0VfSURTPVtcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIl07XG5cbmNvbnN0IFBMQVlFUlRZUEVfRk9PPTAsUExBWUVSVFlQRV9VTktOT1dOPTEsUExBWUVSVFlQRV9GUklFTkQ9MjtcblxuLy8gdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIFBsYXllciBpbnN0YW5jZXNcbi8vIHdvdWxkIGJlIGRlZmluZWQgYWJzdHJhY3QgaW4gY2xhc3NpY2FsIE9PXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJQTEFZRVIgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lciYmcGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycy5wdXNoKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBldmVudCBsaXN0ZW5lcnM6IFwiK3RoaXMuX2V2ZW50TGlzdGVuZXJzK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuZXZlciBhIGdhbWUgaXMgc3RhcnRlZCwgY2FsbCBuZXdHYW1lISFcbiAgICBuZXdHYW1lKCl7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDB8fCF0aGlzLl9nYW1lKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIFwiK3RoaXMubmFtZStcIiB1bmFibGUgdG8gcHJlcGFyZSBmb3IgcGxheWluZzogbm90IGFzc29jaWF0ZWQgd2l0aCBhIGdhbWUgeWV0LlwiKTtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJVRzogUGxheWVyIFwiK3RoaXMubmFtZStcIiBzdGlsbCBoYXMgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzLlwiKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIGJldHRlciBkb25lIHRoaXMgd2F5IGluc3RlYWQgb2YgdGhpcy5fY2FyZHM9W11cbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZhdWx0IHBsYXllciByZW1lbWJlcmluZyBpdHMgY2hvaWNlc1xuICAgICAgICB0aGlzLl9iaWQ9LTE7IC8vIHRoZSBsYXN0IGJpZCBvZiB0aGlzIHBsYXllclxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX2NhcmQ9bnVsbDtcbiAgICAgICAgLy8gdGhlIGdhbWUgYmVpbmcgcGxheWVkLCBhbmQgdGhlIGluZGV4IHdpdGhpbiB0aGF0IGdhbWVcbiAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uPVtdOyAvLyB0aGUgdHJpY2tzIHdvbiAoaW4gYW55IGdhbWUpXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW49LTE7IC8vIGRvZXNuJ3QgbWF0dGVyXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZSxwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbmFtZT1uYW1lO1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycz1bXTtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgICAgICBpZighKHBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKSl0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgZXZlbnQgbGlzdGVuZXIgb2Ygd3JvbmcgdHlwZS5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVjZWl2aW5nIGdhbWUgYW5kIGluZGV4XG4gICAgICAgIHRoaXMuX2luZGV4PS0xO3RoaXMuX2dhbWU9bnVsbDsgLy8gd2FpdGluZyBmb3IgdGhlIGdhbWUgdG8gYmUgcGx1Z2dlZCBpbiAob25jZSlcbiAgICAgICAgLy8gcmVtb3ZlZCB3YWl0IHVudGlsIGdldHRpbmcgY2FsbGVkIHRocm91Z2ggbmV3R2FtZTogdGhpcy5fcHJlcGFyZUZvclBsYXlpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gZ2V0dGVycyBleHBvc2luZyBpbmZvcm1hdGlvbiB0byB0aGUgbWFkZSBjaG9pY2VcbiAgICAvLyBOT1RFIG5vIGxvbmdlciBjYWxsZWQgYnkgdGhlIGdhbWUgYmVjYXVzZSB0aGUgY2hvaWNlIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCBub3dcbiAgICAvLyAgICAgIHRoaXMgd2F5IHN1YmNsYXNzZXMgYXJlIG5vdCBvYmxpZ2F0ZWQgdG8gcmVtZW1iZXIgdGhlIGNob2ljZXMgdGhleSBtYWtlXG4gICAgZ2V0IGJpZCgpe3JldHVybiB0aGlzLl9iaWQ7fVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXQgY2FyZCgpe3JldHVybiB0aGlzLmNhcmQoKTt9XG5cbiAgICBnZXQgcGFydG5lcigpe3JldHVybiB0aGlzLl9wYXJ0bmVyO31cblxuICAgIC8vLy8vLy8vLy8vLy8vZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZFBsYXlJbmRleF07fVxuXG4gICAgLyogY2FuIGJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgZ2FtZVxuICAgIC8vIGNhbiBiZSBzZXQgZGlyZWN0bHkgd2hlbiBhIGJldHRlciAncmlrJyB2YXJpYXRpb24gYmlkIHdhcyBkb25lISEhIVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIFxuICAgIC8vIFRPRE8gaXQgd291bGQgYmUgZWFzaWVyIHRvIGNvbWJpbmUgdGhlc2UgaW4gYSBjYXJkISEhIVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuXG4gICAgLy8gY2FsbGVkIGZyb20gdGhlIFVJIHRvIHNldCB0aGUgdHJ1bXAgc3VpdGUhISEhXG4gICAgc2V0IHRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO3RoaXMudHJ1bXBTdWl0ZUNob3NlbigpO31cbiAgICBzZXQgcGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLnBhcnRuZXJTdWl0ZUNob3NlbigpO31cbiAgICAqL1xuXG4gICAgLy8gZW5kIG9mIGdldHRlcnMvc2V0dGVycyB1c2VkIGJ5IHRoZSBnYW1lXG4gICAgX3JlbW92ZUNhcmRzKCl7d2hpbGUodGhpcy5fY2FyZHMubGVuZ3RoPjApdGhpcy5fY2FyZHMuc2hpZnQoKS5ob2xkZXI9bnVsbDt9XG5cbiAgICBnZXQgZ2FtZSgpe3JldHVybiB0aGlzLl9nYW1lO31cbiAgICBzZXQgZ2FtZShnYW1lKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZT09PWdhbWUpcmV0dXJuO1xuICAgICAgICBpZihnYW1lJiYhKGdhbWUgaW5zdGFuY2VvZiBQbGF5ZXJHYW1lKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUgaW5zdGFuY2Ugc3VwcGxpZWQgdG8gcGxheWVyIFwiKyh0aGlzLm5hbWV8fFwiP1wiKStcIiBub3Qgb2YgdHlwZSBQbGF5ZXJHYW1lLlwiKTtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGluZGV4IG9mIHBsYXllciBcIisodGhpcy5uYW1lfHxcIj9cIikrXCIgdW5rbm93biFcIik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIE1ESEAxMUpBTjIwMjA6IGlmIHRoZSBnYW1lIGNoYW5nZXMgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgY2FyZHNcbiAgICAgICAgdGhpcy5fZ2FtZT1nYW1lO1xuICAgICAgICAvLyBzeW5jIF9pbmRleFxuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMucGFydG5lcj0tMTsgLy8gbXkgcGFydG5lciAob25jZSBJIG5vdyB3aG8gaXQgaXMpXG4gICAgICAgICAgICB0aGlzLnRyaWNrc1dvbj1bXTsgLy8gc3RvcmluZyB0aGUgdHJpY2tzIHdvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IGluZGV4KGluZGV4KXt0aGlzLl9pbmRleD1pbmRleDt9IC8vIE1ESEAwOUpBTjIwMjA6IHNvbWV0aW1lcyBhbiBpbmRleCBjYW4gYmUgc2V0IHNlcGFyYXRlbHlcblxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXJpbmcgdGhlIGdhbWUgcGxheWVkIGF0IGluZGV4IFwiK2luZGV4K1wiLlwiKTtcbiAgICAgICAgdGhpcy5pbmRleD1pbmRleDtcbiAgICAgICAgdGhpcy5nYW1lPWdhbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSByZWdpc3RlcmVkIVwiKTtcbiAgICB9XG4gICAgLypcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBzdXBlci5hZGRDYXJkKGNhcmQpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcytcIicgcmVjZWl2ZWQgY2FyZCAnXCIrY2FyZCtcIicuXCIpO1xuICAgIH1cbiAgICAqL1xuICAgIF9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlLHdoZW5Ob3RGb3VuZENhcmQpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuKGNhcmQuc3VpdGU9PWNhcmRTdWl0ZSk7fSk7XG4gICAgfVxuXG4gICAgX2dldFN1aXRlQ2FyZHMoKXtcbiAgICAgICAgdGhpcy5sb2coXCJEZXRlcm1pbmluZyBzdWl0ZSBjYXJkcyBvZiBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMhXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkcz1bW10sW10sW10sW11dO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e3N1aXRlQ2FyZHNbY2FyZC5zdWl0ZV0ucHVzaChjYXJkKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlQ2FyZHM7XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIG9mIGEgZ2l2ZW4gY2FyZCBzdWl0ZSAob3IgYW55IGNhcmQgaWYgY2FyZFN1aXRlIGlzIHVuZGVmaW5lZClcbiAgICBjb250cmlidXRlVG9Ucmljayh0cmljaykge1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg9PTApdGhyb3cgbmV3IEVycm9yKFwiTm8gY2FyZHMgbGVmdCB0byBwbGF5IVwiKTtcbiAgICAgICAgbGV0IGNhcmRzT2ZTdWl0ZT10aGlzLl9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlKTtcbiAgICAgICAgbGV0IGNhcmQ9KGNhcmRzT2ZTdWl0ZSYmY2FyZHNPZlN1aXRlLmxlbmd0aD4wP2NhcmRzT2ZTdWl0ZVswXTp0aGlzLl9jYXJkc1swXSk7XG4gICAgICAgIGNhcmQuaG9sZGVyPXRyaWNrOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoZSB0cmlja1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgbWFkZSBhIGJpZFxuICAgIF9iaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKSAvLyBjYXRjaCBhbnkgZXJyb3IgdGhyb3duIGJ5IGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7KCFldmVudExpc3RlbmVyfHxldmVudExpc3RlbmVyLmJpZE1hZGUodGhpcy5fYmlkKSk7fWNhdGNoKGVycm9yKXt9fSk7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXNzaW5nIGJpZCBcIit0aGlzLl9iaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIHRvIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWUuYmlkTWFkZSh0aGlzLl9iaWQpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogTm8gZ2FtZSB0byBwYXNzIGJpZCBcIit0aGlzLl9iaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInLlwiKTtcbiAgICB9XG4gICAgX3NldEJpZChiaWQpe3RoaXMuX2JpZE1hZGUodGhpcy5fYmlkPWJpZCk7fVxuXG4gICAgX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57ZXZlbnRMaXN0ZW5lci5jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUuY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICB9XG4gICAgLy8gVE9ETyBhIGJpZCBzZXR0ZXIgd2lsbCBhbGxvdyBzdWJjbGFzc2VzIHRvIHBhc3MgYSBiaWQgYnkgc2V0dGluZyB0aGUgcHJvcGVydHlcbiAgICBfc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgLy8gdGVjaG5pY2FsbHkgY2hlY2tpbmcgd2hldGhlciB0aGUgcGxheWVkIGNhcmQgaXMgdmFsaWQgc2hvdWxkIGJlIGRvbmUgaGVyZSwgb3IgQkVGT1JFIGNhbGxpbmcgc2V0Q2FyZFxuICAgICAgICB0aGlzLl9jYXJkUGxheWVkKHRoaXMuX2NhcmQ9Y2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9vc2VuIGEgdHJ1bXAgc3VpdGVcbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICB9XG4gICAgX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZSk7fVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9zZW4gYSBwYXJ0bmVyXG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLnBhcnRuZXJTdWl0ZUNob3Nlbih0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlKTt9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gbWFrZSBhIGJpZCBwYXNzaW5nIGluIHRoZSBoaWdoZXN0IGJpZCBzbyBmYXJcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgbWFrZUFCaWQocGxheWVyYmlkcyl7XG4gICAgICAgIC8vIGFzc3VtZXMgdGhhdCB0aGlzIHBsYXllciBoYXMgbWFkZSBhIGJpZCBiZWZvcmUsIG9yIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgYmlkXG4gICAgICAgIC8vIHRoaXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRvIGJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIHNvIHdlIGNhbiB1c2UgcHJvbXB0KClcbiAgICAgICAgLy8gYWxsIG90aGVyIGF2YWlsYWJsZSBiaWRzIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiB0aGUgbGFzdCBiaWQgYnkgYW55IG90aGVyIHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZFNvRmFyPVBsYXllckdhbWUuQklEX1BBUztcbiAgICAgICAgaWYocGxheWVyYmlkcyl7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlBsYXllciBiaWRzOlwiLHBsYXllcmJpZHMpO1xuICAgICAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8cGxheWVyYmlkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICAgICAgaWYocGxheWVyYmlkc1twbGF5ZXJdLmxlbmd0aD4wJiZwbGF5ZXJiaWRzW3BsYXllcl1bMF0+aGlnaGVzdEJpZFNvRmFyKVxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0QmlkU29GYXI9cGxheWVyYmlkc1twbGF5ZXJdWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nKFwiSGlnaGVzdCBiaWQgc28gZmFyOiAnXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXStcIicuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgaGlnaGVzdCBwb3NzaWJsZSBiaWQgaXMgbm90IGEgYmlkIGFsbCBjYW4gcGxheSAoYXQgdGhlIHNhbWUgdGltZSksIGNhbid0IGJlIGJpZCBhZ2FpblxuICAgICAgICBpZihQbGF5ZXJHYW1lLkJJRFNfQUxMX0NBTl9QTEFZLmluZGV4T2YoUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXSk8MCloaWdoZXN0QmlkU29GYXIrKztcbiAgICAgICAgbGV0IHBvc3NpYmxlQmlkTmFtZXM9UGxheWVyR2FtZS5CSURfTkFNRVMuc2xpY2UoaGlnaGVzdEJpZFNvRmFyKTtcbiAgICAgICAgcG9zc2libGVCaWROYW1lcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW1BsYXllckdhbWUuQklEX1BBU10pOyAvLyB1c2VyIGNhbiBhbHdheXMgJ3BhcydcbiAgICAgICAgdGhpcy5sb2coXCJQb3NzaWJsZSBiaWRzOiBcIixwb3NzaWJsZUJpZE5hbWVzKTtcbiAgICAgICAgbGV0IGJpZD0tMTtcbiAgICAgICAgd2hpbGUoYmlkPDApe1xuICAgICAgICAgICAgbGV0IGJpZG5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IGlzIHlvdXIgYmlkIChvcHRpb25zOiAnXCIrcG9zc2libGVCaWROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlQmlkTmFtZXNbMF0pO1xuICAgICAgICAgICAgYmlkPVBsYXllckdhbWUuQklEX05BTUVTLmluZGV4T2YoYmlkbmFtZSk7XG4gICAgICAgICAgICBpZihiaWQ8MCljb250aW51ZTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRCaWQoYmlkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgYmlkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICAvLyBpZiB0aGlzIHBsYXllciBoYXMgYWxsIGFjZXMgaXQncyBnb25uYSBiZSB0aGUgc3VpdGUgb2YgYSBraW5nIHRoZSBwZXJzb24gaGFzbid0XG4gICAgICAgIC8vIGFsc28gaXQgbmVlZHMgdG8gYmUgYW4gYWNlIG9mIGEgc3VpdGUgdGhlIHVzZXIgaGFzIGl0c2VsZiAodW5sZXNzIHlvdSBoYXZlIGFsbCBvdGhlciBhY2VzKVxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICAvLyBhbnkgb2YgdGhlIHN1aXRlcyBpbiB0aGUgY2FyZHMgY2FuIGJlIHRoZSB0cnVtcCBzdWl0ZSFcbiAgICAgICAgbGV0IHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzPXRoaXMuZ2V0U3VpdGVzKCkubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPS0xO1xuICAgICAgICB3aGlsZSh0cnVtcFN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHRydW1wTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgc3VpdGUgd2lsbCBiZSB0cnVtcCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVUcnVtcFN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgdHJ1bXBTdWl0ZT1wb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5pbmRleE9mKHRydW1wTmFtZSk7XG4gICAgICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFza3MgZm9yIHRoZSBzdWl0ZSBvZiB0aGUgcGFydG5lciBjYXJkIG9mIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgY2hvb3NlUGFydG5lclN1aXRlKCl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclJhbms9UkFOS19BQ0U7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIGFjZWxlc3Mgc3VpdGVzXG4gICAgICAgIGxldCBzdWl0ZXM9dGhpcy5nZXRTdWl0ZXMoKTtcbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD09MCl7IC8vIHBsYXllciBoYXMgQUxMIGFjZXNcbiAgICAgICAgICAgIGlmKHN1aXRlcy5sZW5ndGg8NCl7IC8vIGJ1dCBub3QgYWxsIHN1aXRlc1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgc3VpdHMgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhcmUgYWxsb3dlZCAoYXNraW5nIHRoZSBhY2UgYmxpbmQhISEpXG4gICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPVswLDEsMiwzXS5maWx0ZXIoKHN1aXRlKT0+e3JldHVybiBwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZihzdWl0ZSk8MDt9KTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBoYXMgYWxsIHN1aXRzLCBzbyBhIGtpbmcgaXMgdG8gYmUgc2VsZWN0ZWQhISFcbiAgICAgICAgICAgICAgICAvLyBhbGwga2luZ3MgYWNjZXB0YWJsZSBleGNlcHQgZm9yIHRoYXQgaW4gdGhlIHRydW1wIGNvbG9yXG4gICAgICAgICAgICAgICAgLy8gTk9URSBpZiBhIHBlcnNvbiBhbHNvIGhhcyBhbGwgdGhlIGtpbmdzIHdlIGhhdmUgYSBzaXR1YXRpb24sIHdlIHNpbXBseSBjb250aW51ZSBvbndhcmRcbiAgICAgICAgICAgICAgICB3aGlsZSgxKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbmstLTtcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJ1bXBTdWl0ZUluZGV4PXBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHRoaXMuX3RydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0cnVtcFN1aXRlSW5kZXg+PTApcG9zc2libGVQYXJ0bmVyU3VpdGVzLnNwbGljZSh0cnVtcFN1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg+MClicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXM9cG9zc2libGVQYXJ0bmVyU3VpdGVzLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB3aGlsZShwYXJ0bmVyU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgXCIrQ2FyZC5DQVJEX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXStcIiBzaG91bGQgeW91ciBwYXJ0bmVyIGhhdmUgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICBwYXJ0bmVyU3VpdGU9cG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5pbmRleE9mKHBhcnRuZXJTdWl0ZU5hbWUpO1xuICAgICAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHBhcnRuZXIocGFydG5lcil7dGhpcy5fcGFydG5lcj1wYXJ0bmVyO30gLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBhbmQgYWRkIGl0IHRvIHRoZSBnaXZlbiB0cmlja1xuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBwbGF5QUNhcmQodHJpY2spe1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBhc2tlZCB0byBwbGF5IGEgY2FyZC5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCB1c2luZyB0aGUgZmlyc3QgbGV0dGVycyBvZiB0aGUgYWxwaGFiZXQ/XG4gICAgICAgIGxldCBwb3NzaWJsZUNhcmROYW1lcz1bXTtcbiAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MDtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKVxuICAgICAgICAgICAgcG9zc2libGVDYXJkTmFtZXMucHVzaChTdHJpbmcuY2FyZEluZGV4KzEpK1wiOiBcIit0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBsZXQgY2FyZFBsYXlJbmRleD0tMTtcbiAgICAgICAgd2hpbGUoY2FyZFBsYXlJbmRleDwwKXtcbiAgICAgICAgICAgIC8vIHdlJ3JlIHN1cHBvc2VkIHRvIHBsYXkgYSBjYXJkIHdpdGggc3VpdGUgZXF1YWwgdG8gdGhlIGZpcnN0IGNhcmQgdW5sZXNzIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgaXMgYmVpbmcgYXNrZWQgZm9yXG4gICAgICAgICAgICBsZXQgY2FyZElkPXBhcnNlSW50KHByb21wdChcIkBcIit0aGlzLm5hbWUrXCJcXG5QcmVzcyB0aGUgaWQgb2YgdGhlIGNhcmQgeW91IHdhbnQgdG8gYWRkIHRvIFwiK3RyaWNrLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChvcHRpb25zOiAnXCIrcG9zc2libGVDYXJkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixcIlwiKSk7XG4gICAgICAgICAgICBpZihpc05hTihjYXJkSWQpKWNvbnRpbnVlO1xuICAgICAgICAgICAgY2FyZFBsYXlJbmRleD1jYXJkSWQtMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDYXJkKHRoaXMuX2NhcmRzW2NhcmRQbGF5SW5kZXhdKTtcbiAgICB9XG5cbiAgICB0cmlja1dvbih0cmlja0luZGV4KXtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uLnB1c2godHJpY2tJbmRleCk7XG4gICAgICAgIHRoaXMubG9nKFwiVHJpY2sgI1wiK3RyaWNrSW5kZXgrXCIgd29uIGJ5ICdcIit0aGlzLm5hbWUrXCInOiBcIit0aGlzLl90cmlja3NXb24rXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlRyaWNrc1dvbigpe3JldHVybiB0aGlzLl90cmlja3NXb24ubGVuZ3RoO31cbiAgICBcbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyByZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiB0cmlja3Mgd29uIChpbmNsdWRpbmcgdGhvc2UgYnkgdGhlIHBhcnRuZXIgKGlmIGFueSkpXG4gICAgICAgIHJldHVybih0aGlzLm51bWJlck9mVHJpY2tzV29uK3RoaXMuX2dhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLnBhcnRuZXIpKTtcbiAgICB9XG5cbiAgICBzZXROdW1iZXJPZlRyaWNrc1RvV2luKG51bWJlck9mVHJpY2tzVG9XaW4pe3RoaXMuX251bWJlck9mVHJpY2tzVG9XaW49bnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzVG9XaW4oKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgXG4gICAgLy8gZXZlcnkgcGxheWVyIGNhbiBiZSBjaGVja2VkIHdoZXRoZXIgZnJpZW5kICgxKSBvciBmb28gKC0xKSBvciB1bmtub3duICgwKVxuICAgIGlzRnJpZW5kbHkocGxheWVyKXtcbiAgICAgICAgaWYocGxheWVyPT09dGhpcy5faW5kZXgpcmV0dXJuIDI7IC8vIEknbSBtdWNobyBmcmllbmRseSB0byBteXNlbGZcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApeyAvLyBhIG5vbi1zb2xpdGFyeSBnYW1lXG4gICAgICAgICAgICAvLyBBU1NFUlQgbm90IGEgc29saXRhcnkgZ2FtZSBzbyBwbGF5ZXIgY291bGQgYmUgdGhlIHBhcnRuZXIgaW4gY3JpbWVcbiAgICAgICAgICAgIC8vIGlmIHBhcnRuZXIgaXMga25vd24gKGkuZS4gdGhlIHBhcnRuZXIgY2FyZCBpcyBubyBsb25nZXIgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyPj0wKXJldHVybihwbGF5ZXI9PT10aGlzLl9wYXJ0bmVyPzE6LTEpOyBcbiAgICAgICAgICAgIC8vIEFTU0VSVCBwYXJ0bmVyIHVua25vd24gKGkuZS4gcGFydG5lciBjYXJkIHN0aWxsIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgbGV0IHRydW1wUGxheWVyPXRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKTtcbiAgICAgICAgICAgIC8vIGlmIEknbSB0aGUgdHJ1bXAgcGxheWVyLCBhc3N1bWUgQUxMIHVuZnJpZW5kbHkgQlVUIG5vIEkgZG9uJ3Qga25vdyB3aG8gbXkgcGFydG5lciBpcyBhbGwgY291bGQgYmVcbiAgICAgICAgICAgIGlmKHRoaXMuX2luZGV4PT09dHJ1bXBQbGF5ZXIpcmV0dXJuIDA7IC8vIHVua25vd25cbiAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSx0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCkpKSAvLyBJIGhhdmUgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PXRydW1wUGxheWVyPzE6LTEpOyAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZyaWVuZGx5LCB0aGUgb3RoZXJzIGFyZSB1bmZyaWVuZGx5XG4gICAgICAgICAgICAvLyBBU1NFUlQgSSdtIG5vdCB0aGUgdHJ1bXAgcGxheWVyLCBhbmQgSSdtIG5vdCB3aXRoIHRoZSB0cnVtcCBwbGF5ZXIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmb28sIHRoZSByZXN0IEkgZG9uJ3Qga25vdyB5ZXRcbiAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PT10cnVtcFBsYXllcj8tMTowKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgYSBzb2xpdGFyeSBnYW1lXG4gICAgICAgIC8vIGlmIEknbSBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnMsIGV2ZXJ5b25lIGVsc2UgaXMgYSBmb29cbiAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YodGhpcy5faW5kZXgpPj0wKXJldHVybiAtMTtcbiAgICAgICAgLy8gQVNTRVJUIG5vdCBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnNcbiAgICAgICAgLy8gICAgICAgIGlmIHBsYXllciBpcyBhIHNvbGl0YXJ5IHBsYXllciBpdCdzIGEgZm9vLCBvdGhlcndpc2UgaXQncyB1cyBhZ2FpbnN0IHRoZW0hISEhXG4gICAgICAgIHJldHVybih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZihwbGF5ZXIpPj0wPy0xOjEpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIHRoaXMubmFtZTt9XG5cbn1cblxuLy8gZXhwb3J0IHRoZSBQbGF5ZXIgY2xhc3Ncbm1vZHVsZS5leHBvcnRzPXtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfTsiLCJjb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpOyAvLyBmb3IgY29tcGFyaW5nIGNhcmRzXG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG5jbGFzcyBUcmljayBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICAvLyBNREhAMDdERUMyMDE5OiBnYW1lIGRhdGEgbW92ZWQgb3ZlciB0byBQbGF5ZXJHYW1lIGluc3RhbmNlIChhcyBwYXNzZWQgdG8gZWFjaCBwbGF5ZXIpXG4gICAgLy8gICAgICAgICAgICAgICAgY2FuQXNrRm9yUGFydG5lckNhcmQgYmxpbmQgbm93IGRldGVybWluZWQgYnkgdGhlIGdhbWUgKGVuZ2luZSkgaXRzZWxmXG5cbiAgICAvLyBieSBwYXNzaW5nIGluIHRoZSB0cnVtcCBwbGF5ZXIgKGkuZS4gdGhlIHBlcnNvbiB0aGF0IGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgY29uc3RydWN0b3IoZmlyc3RQbGF5ZXIsdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssY2FuQXNrRm9yUGFydG5lckNhcmQsZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKXsgLy8gcmVwbGFjaW5nOiB0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayx0cnVtcFBsYXllcil7XG4gICAgICAgIHN1cGVyKCk7IC8vIHVzaW5nIDQgZml4ZWQgcG9zaXRpb25zIGZvciB0aGUgdHJpY2sgY2FyZHMgc28gd2Ugd2lsbCBrbm93IHdobyBwbGF5ZWQgdGhlbSEhISFcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXI9Zmlyc3RQbGF5ZXI7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTsgLy8gZm9yIGludGVybmFsIHVzZSB0byBiZSBhYmxlIHRvIGRldGVybWluZSB0aGUgd2lubmVyIG9mIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLl9wYXJ0bmVyUmFuaz1wYXJ0bmVyUmFuazsgLy8gbmVlZCB0aGlzIHdoZW4gaXQncyBiZWluZyBhc2tlZCB0byBkZXRlcm1pbmUgdGhlIHdpbm5lclxuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD1jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDsgLy8gLTEgYmxpbmQsIDAgbm90LCAxIG5vbi1ibGluZFxuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB0aGUgJ2ZsYWcnIHNldCBieSB0aGUgdHJ1bXAgcGxheWVyIHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPS0xOyAvLyB0aGUgc3VpdGUgb2YgdGhlIHRyaWNrIChtb3N0IG9mIHRoZSB0aW1lIHRoZSBzdWl0ZSBvZiB0aGUgZmlyc3QgY2FyZClcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD0tMTsgLy8gdGhlIGNhcmQgb2YgdGhlIHdpbm5lciAobm90ZTogTk9UIHRyYW5zZm9ybWVkIHRvIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IHlldClcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzPWZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcztcbiAgICAgICAgLy8gbGV0J3Mga2VlcCB0cmFjayBvZiB0aGUgaGlnaGVzdCBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBjYW4gYXNrIGZvciBwYXJ0bmVyIGNhcmQ6IFwiK2NhbkFza0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGZpcnN0IHBsYXllciBjYW4gcGxheSBzcGFkZXM6IFwiK2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcytcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIGdldCBmaXJzdFBsYXllckNhblBsYXlTcGFkZXMoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO31cbiAgICBcbiAgICAvLyB0aGUgd2lubmVyIGV4cG9zZWQgaXMgdGhlIGFjdHVhbCBwbGF5ZXIgd2hvIHdvblxuICAgIGdldCB3aW5uZXIoKXtyZXR1cm4odGhpcy5fd2lubmVyQ2FyZDwwPy0xOih0aGlzLl93aW5uZXJDYXJkK3RoaXMuX2ZpcnN0UGxheWVyKSU0KTt9XG4gICAgXG4gICAgLy8gTURIQDA3REVDMjAxOTogbW92ZWQgZnJvbSBoZXJlIHRvIHRoZSBnYW1lIChhcyBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gICAgLypcbiAgICBnZXQgdHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fSAvLyBleHBvc2VzIHRoZSBjdXJyZW50IHRydW1wIHBsYXllclxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgICovXG4gICAgZ2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkO31cblxuICAgIC8vIHBhc3MgaW4gLTEgd2hlbiBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZCwgb3IgKzEgd2hlbiBhc2tpbmcgZm9yIGl0IChub24tYmxpbmQpXG4gICAgc2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodHlwZW9mIGFza2luZ0ZvclBhcnRuZXJDYXJkIT09XCJudW1iZXJcIil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBOT1QgZGVmaW5lZCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMubnVtYmVyT2ZDYXJkcz4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3BnZXZlbiBkZSBwYXJ0bmVyIGFhcy9oZWVyIChibGluZCkgdGUgdnJhZ2VuIG5pZXQgbWVlciB0b2VnZXN0YWFuLlwiKTtcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgc2V0IHRvIFwiK3RoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICBfc2V0V2lubmVyQ2FyZCh3aW5uZXJDYXJkKXtcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD13aW5uZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIHdpbm5lciBjYXJkOiBcIit3aW5uZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBjYXJkIHBsYXllZCBieSAodGhlIGFjdHVhbCkgcGxheWVyIChhcyB1c2VkIGZvciBzaG93aW5nIHRoZSB0cmljayBjYXJkcylcbiAgICAgKiBAcGFyYW0geyp9IHBsYXllciBcbiAgICAgKi9cbiAgICBnZXRQbGF5ZXJDYXJkKHBsYXllcil7XG4gICAgICAgIGxldCBwbGF5ZXJDYXJkPSh0aGlzLl9maXJzdFBsYXllcj49MD8ocGxheWVyKzQtdGhpcy5fZmlyc3RQbGF5ZXIpJTQ6bnVsbCk7XG4gICAgICAgIHJldHVybihwbGF5ZXJDYXJkPj0wJiZwbGF5ZXJDYXJkPHRoaXMubnVtYmVyT2ZDYXJkcz90aGlzLl9jYXJkc1twbGF5ZXJDYXJkXTpudWxsKTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSB0aGUgZmlyc3QgcGxheWVyIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICBpZighdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgKGFueW1vcmUpLlwiKTtcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPXRoaXMuX3RydW1wU3VpdGU7IC8vIHRoZSBwbGF5IHN1aXRlIGJlY29tZXMgdGhlIHRydW1wIHN1aXRlXG4gICAgfVxuICAgICovXG4gICAgLy8gTk9URSBhZGRDYXJkIGlzIE5PVCBfYWRkQ2FyZCBvZiB0aGUgc3VwZXJjbGFzcyEgdGhpcyBpcyBiZWNhdXNlIHdlIHNob3VsZCBzZXQgdGhlIGhvbGRlciBvbiB0aGUgY2FyZCB0byBhZGQhISEhXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICAgLy8gaWYgdGhlIGZsYWcgb2YgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIGlzIHNldCwgcHJlc2V0IHRoZSBcbiAgICAgICAgY2FyZC5ob2xkZXI9dGhpczsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGlzIHRyaWNrIGJ5IHNldHRpbmcgdGhlIGhvbGRlciBwcm9wZXJ0eSAod2lsbCB0YWtlIGNhcmUgb2YgYWRkaW5nL3JlbW92aW5nIHRoZSBjYXJkKVxuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM8PW51bWJlck9mQ2FyZHNOb3cpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWRkIHRoZSBjYXJkIHRvIHRoZSB0cmljay5cIik7XG4gICAgICAgIC8vIEFTU0VSVCBjYXJkIGFkZGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5fdHJ1bXBTdWl0ZTwwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQlVHOiBBc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQsIGJ1dCBwbGF5aW5nIGEgZ2FtZSB3aXRob3V0IHRydW1wLlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yIGJsaW5kIGV2ZXJ5b25lIGhhcyB0byBwbGF5IHRoZSBwYXJ0bmVyIGNhcmQgc3VpdGVcbiAgICAgICAgLy8gTURIQDA5REVDMjAxOTogT09QUyBJIHdhcyBhbHJlYWR5IHVzaW5nIHRoaXMuX3BhcnRuZXJTdWl0ZSBoZXJlIEJVVCBzdGlsbCBhZnRlciBhY3R1YWxseSB0YWtpbmcgaXQgb3V0IChub3cgaW4gYWdhaW4pXG4gICAgICAgIGlmKHRoaXMuX3BsYXlTdWl0ZTwwKXsgLy8gZmlyc3QgY2FyZCBiZWluZyBwbGF5ZWRcbiAgICAgICAgICAgIC8vIE1ESEAxOEpBTjIwMjA6IGFzY2VydGFpbiB0aGF0IF9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCBoYXMgdGhlIHJpZ2h0IHZhbHVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBjb3VsZCBiZSAwIGJ1dCB3aGVuIHRoZSBwYXJ0bmVyIHN1aXRlIGlzIHBsYXllZCB0aGUgcGxheWVyIElTIGFza2luZ1xuICAgICAgICAgICAgaWYodGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQhPT0wKXsgLy8gcGxheWVyIHN1cHBvc2VkbHkgY2FuIHN0aWxsIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPD0wJiZjYXJkLnN1aXRlPT09dGhpcy5fcGFydG5lclN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MCl0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IENhbm5vdCBhc2sgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiSW1wbGljaXRseSBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYnkgcGxheWluZyB0aGUgcGFydG5lciBzdWl0ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPT0wKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIHdoZW4geW91IGNhbid0IGFzayBmb3IgaXQgYW55bW9yZSFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wbGF5U3VpdGU9KHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDA/dGhpcy5fcGFydG5lclN1aXRlOmNhcmQuc3VpdGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFTU0VSVCB0aGlzLl9wbGF5U3VpdGUgbm93IGRlZmluaXRlbHkgbm9uLW5lZ2F0aXZlLCBzb1xuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB1c2UgdGhlIHJpZ2h0IHByb3BlcnR5IGJybydcbiAgICAgICAgLy8gdXBkYXRlIHdpbm5lclxuICAgICAgICBpZihudW1iZXJPZkNhcmRzTm93PjApe1xuICAgICAgICAgICAgLy8gTURIQDA5REVDMjAxOTogd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgb25seSB0aGUgcGFydG5lciBjYXJkIGNhbiBldmVyIHdpbiAoZXZlbiBpZiB0aGVyZSdzIHRydW1wISEpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBidXQgd2UgbmVlZCB0byBrbm93IHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCB3YXMgYWxyZWFkeSB0aHJvd25cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIFNPTFVUSU9OOiAoTkVBVCkgaXQncyBlYXNpZXN0IHRvIHNpbXBseSBpZ25vcmUgdHJ1bXAgaXMgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IhISEhISFcbiAgICAgICAgICAgIGlmKENhcmQuY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQsdGhpcy5fY2FyZHNbdGhpcy5fd2lubmVyQ2FyZF0sdGhpcy5fcGxheVN1aXRlLCh0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MD8tMTp0aGlzLl90cnVtcFN1aXRlKSk+MClcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKG51bWJlck9mQ2FyZHNOb3cpO1xuICAgICAgICB9ZWxzZSAvLyBhZnRlciB0aGUgZmlyc3QgY2FyZCB0aGUgZmlyc3QgcGxheWVyIGlzIHRoZSB3aW5uZXIgb2YgY291cnNlXG4gICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKDApO1xuICAgIH1cbiAgICBnZXRDYXJkUGxheWVyKHN1aXRlLHJhbmspe1xuICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjx0aGlzLl9jYXJkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkc1twbGF5ZXJdLnN1aXRlPT09c3VpdGUmJnRoaXMuX2NhcmRzW3BsYXllcl0ucmFuaz09PXJhbmspXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9maXJzdFBsYXllcitwbGF5ZXIpJTQ7IC8vIFRPRE8gY2FuIHdlIGFzc3VtZSA0IHBsYXllcnMgaW4gdG90YWw/Pz8/P1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGdldHRlcnNcbiAgICBnZXQgcGxheVN1aXRlKCl7cmV0dXJuIHRoaXMuX3BsYXlTdWl0ZTt9XG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIC8qXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgKi9cbiAgICBnZXQgY2FuQXNrRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ7fVxufVxuXG5tb2R1bGUuZXhwb3J0cz1UcmljaztcbiIsIi8qKlxuICogdGhlIHBhcnQgdGhhdCBydW5zIGluIHRoZSBicm93c2VyIG9mIGEgc2luZ2xlIHBsYXllclxuICogZ2l2ZW4gdGhhdCBhbnkgaW5mb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgcGxheWVyIG9mIHRoZSBnYW1lIHNob3VsZCBiZSBhdmFpbGFibGUgdGhyb3VnaCBpdCdzIF9nYW1lIHByb3BlcnR5IChpLmUuIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAqIGFsbCBjYWxscyBpbiBtYWluLmpzIHRvIHJpa2tlblRoZUdhbWUgZGlyZWN0bHkgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggY2FsbHMgdG8gY3VycmVudFBsYXllci5nYW1lIGkuZS4gcmlra2VuVGhlR2FtZSBpdHNlbGYgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSB0byB0aGUgY3VycmVudFBsYXllciEhIVxuICogXG4qKi9cbi8vIHdlJ2xsIGJlIHVzaW5nIFBsYXllci5qcyBvbmx5IChQbGF5ZXIuanMgd2lsbCBkZWFsIHdpdGggcmVxdWlyaW5nIENhcmRIb2xkZXIsIGFuZCBDYXJkSG9sZGVyIENhcmQpXG4vLyBOTyBJIG5lZWQgdG8gcmVxdWlyZSB0aGVtIGFsbCBvdGhlcndpc2UgYnJvd3NlcmlmeSB3b24ndCBiZSBhYmxlIHRvIGZpbmQgQ2FyZCwgZXRjLlxuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5jb25zdCBUcmljaz1yZXF1aXJlKCcuL1RyaWNrLmpzJyk7IC8vIG5vdyBpbiBzZXBhcmF0ZSBmaWxlXG5jb25zdCB7UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn09cmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcblxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKXtyZXR1cm4oc3RyPyhzdHIubGVuZ3RoP3N0clswXS50b1VwcGVyQ2FzZSgpK3N0ci5zbGljZSgxKTpcIlwiKTpcIj9cIik7fVxuXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpbmcgZW50ZXJpbmcgdGhlIGlkIG9mIHRoZSB1c2VyIG9uIHBhZ2Utc2V0dGluZ3MsIHNvIHdlIGRvIG5vdCBuZWVkIHRvIGluc2VydCBhIG5ldyBvbmVcbi8vICAgICAgICAgICAgICAgIGFsdGVybmF0aXZlbHkgd2UgY2FuIGRvIHRoYXQgb24gYSBzZXBhcmF0ZSBwYWdlIC8gcGFnZS1hdXRoIGlzIE9LXG4vLyAgICAgICAgICAgICAgICB3ZSBnbyB0byBwYWdlLWF1dGggd2hlbiBOT1QgcGxheWluZyB0aGUgZ2FtZSBpbiBkZW1vIG1vZGUhISFcbi8vICAgICAgICAgICAgICAgIGluIG5vbi1kZW1vIG1vZGUgeW91IGlkZW50aWZ5IHlvdXJzZWxmLCB0aGVuIHdoZW4gc2V0UGxheWVyTmFtZSBpcyBzdWNjZXNzZnVsIGdvIHRvIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuLy8gTURIQDEwSkFOMjAyMDogcmVtb3ZpbmcgcGFnZS1zZXR0aW5ncyBhbmQgcGFnZS1zZXR1cC1nYW1lLCBhZGRpbmcgcGFnZS1oZWxwXG5jb25zdCBQQUdFUz1bXCJwYWdlLXJ1bGVzXCIsXCJwYWdlLWhlbHBcIixcInBhZ2UtYXV0aFwiLFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIsXCJwYWdlLWJpZGRpbmdcIixcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIixcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiLFwicGFnZS1wbGF5LXJlcG9ydGluZ1wiLFwicGFnZS1wbGF5aW5nXCIsXCJwYWdlLWZpbmlzaGVkXCJdO1xuXG52YXIgY3VycmVudFBhZ2U9bnVsbDsgLy8gbGV0J3MgYXNzdW1lIHRvIGJlIHN0YXJ0aW5nIGF0IHBhZ2UtcnVsZXNcbnZhciB2aXNpdGVkUGFnZXM9W107IC8vIG5vIHBhZ2VzIHZpc2l0ZWQgeWV0XG5cbnZhciBjdXJyZW50UGxheWVyPW51bGw7IC8vIHRoZSBjdXJyZW50IGdhbWUgcGxheWVyXG5cbi8vIE1ESEAxMEpBTjIwMjA6IG5ld0dhbWUoKSBpcyBhIGJpZCBkaWZmZXJlbnQgdGhhbiBpbiB0aGUgZGVtbyB2ZXJzaW9uIGluIHRoYXQgd2UgcmV0dXJuIHRvIHRoZSB3YWl0aW5nLXBhZ2VcbmZ1bmN0aW9uIG5ld0dhbWUoKXtcbiAgICAvLyBieSBjYWxsIHBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCw/KSB3ZSBmb3JjZSBjbGVhcmluZyB0aGUgZ2FtZSBpbmZvcm1hdGlvbiBiZWluZyBzaG93biBhdCB0aGUgd2FpdC1mb3ItcGxheWVycyBwYWdlXG4gICAgKCFjdXJyZW50UGxheWVyfHxjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSkpO1xufVxuXG52YXIgZm9yY2VGb2N1c0lkPW51bGw7XG5mdW5jdGlvbiBzdG9wRm9yY2VGb2N1cygpe2NsZWFySW50ZXJ2YWwoZm9yY2VGb2N1c0lkKTtmb3JjZUZvY3VzSWQ9bnVsbDt9XG5mdW5jdGlvbiBjaGVja0ZvY3VzKHN0YXRlKXtcbiAgICBpZihkb2N1bWVudC5oYXNGb2N1cygpKXtzaG93R2FtZVN0YXRlKHN0YXRlKTtzdG9wRm9yY2VGb2N1cygpO31lbHNlIHRvZ2dsZUdhbWVTdGF0ZShzdGF0ZSk7XG59XG5mdW5jdGlvbiBmb3JjZUZvY3VzKHN0YXRlKXtcbiAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICBzaG93R2FtZVN0YXRlKHRoaXMubmFtZSk7IC8vIHNob3cgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyIGltbWVkaWF0ZWx5XG4gICAgaWYoIWRvY3VtZW50Lmhhc0ZvY3VzKCkpZm9yY2VGb2N1c0lkPXNldEludGVydmFsKCgpPT57Y2hlY2tGb2N1cyhzdGF0ZSk7fSw2NjYpO1xufVxuXG4vLyBvZiBjb3Vyc2U6IGZyb20gc3RhY2tvdmVyZmxvdyEhIVxuZnVuY3Rpb24gZGlmZmVyZW5jZShhMSxhMil7dmFyIGEyU2V0PW5ldyBTZXQoYTIpO3JldHVybiBhMS5maWx0ZXIoKHgpPT4hYTJTZXQuaGFzKHgpKTt9XG5cbnZhciBiaWRkZXJDYXJkc0VsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItY2FyZHNcIik7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCl7XG4gICAgbGV0IGJ1dHRvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJCaWRkZXIgc3VpdGVjYXJkcyBidXR0b24gY2xpY2tlZCFcIik7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpOyAvLyBhIGhhLCBkaWRuJ3Qga25vdyB0aGlzXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT0odGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtYmlkLWJ1dHRvblwiKT9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgIH0pO1xufVxuXG4vLyBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuLy8gICAgIHZhciB2ID0gZG9jdW1lbnQuY29va2llLm1hdGNoKCcoXnw7KSA/JyArIG5hbWUgKyAnPShbXjtdKikoO3wkKScpO1xuLy8gICAgIHJldHVybiB2ID8gdlsyXSA6IG51bGw7XG4vLyB9XG4vLyBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbi8vICAgICB2YXIgZCA9IG5ldyBEYXRlO1xuLy8gICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDAqZGF5cyk7XG4vLyAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtwYXRoPS87ZXhwaXJlcz1cIiArIGQudG9HTVRTdHJpbmcoKTtcbi8vIH1cbi8vIGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShuYW1lKSB7IHNldENvb2tpZShuYW1lLCAnJywgLTEpOyB9XG5cbi8qKlxuICogc2hvd3MgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWVzIGF0IHRoZSBzdGFydCBvZiB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgLy8gaW4gdGhlIGhlYWRlciByb3cgb2YgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgbGV0IHRyaWNrc1BsYXllZFRhYmxlSGVhZGVyPXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0aGVhZFwiKTtcbiAgICAgICAgbGV0IHJvdz10cmlja3NQbGF5ZWRUYWJsZUhlYWRlci5jaGlsZHJlblswXTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgZm9yKHBsYXllcj0wO3BsYXllcjw0O3BsYXllcisrKXtcbiAgICAgICAgICAgIGxldCBjZWxsPXJvdy5jaGlsZHJlbltwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICBsZXQgcGxheWVyTmFtZT0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVyKTpcIj9cIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgcmVwbGFjZWQgYnkgY3VycmVudFBsYXllci5nYW1lXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5hbWUgb2YgcGxheWVyICNcIisocGxheWVyKzEpK1wiOiAnXCIrcGxheWVyTmFtZStcIicuXCIpO1xuICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9cGxheWVyTmFtZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1uYW1lXCIpLmlubmVySFRNTD0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6XCI/XCIpO1xufVxuXG4vKipcbiAqIHVwZGF0ZXMgdGhlIHdhaXRpbmctZm9yLXBsYXllcnMgcGFnZVxuICogZGVwZW5kaW5nIG9uIHdoZXRoZXIgb3Igbm90IGEgZ2FtZSBpcyBiZWluZyBwbGF5ZWQgKHlldCksIHdlIHNob3cgdGhlIGdhbWUgaWQgYW5kIHRoZSBwbGF5ZXIgbmFtZXNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlR2FtZVBsYXllck5hbWVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1uYW1lXCIpLmlubmVySFRNTD0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLm5hbWU6XCJcIik7XG4gICAgbGV0IHBsYXllck5hbWVzPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZXMoKTpudWxsKTtcbiAgICBmb3IobGV0IHBsYXllck5hbWVTcGFuIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYW1lLXBsYXllci1uYW1lXCIpKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXBsYXllck5hbWVTcGFuLmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWluZGV4XCIpO1xuICAgICAgICBwbGF5ZXJOYW1lU3Bhbi5pbm5lckhUTUw9cGxheWVyTmFtZXNbcGxheWVySW5kZXhdO1xuICAgICAgICBwbGF5ZXJOYW1lU3Bhbi5jb2xvcj0ocGxheWVySW5kZXg9PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4P1wiQkxVRVwiOlwiQkxBQ0tcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIGNsZWFycyB0aGUgYmlkIHRhYmxlXG4gKiB0byBiZSBjYWxsZWQgd2l0aCBldmVyeSBuZXcgZ2FtZVxuICovXG5mdW5jdGlvbiBjbGVhckJpZFRhYmxlKCl7XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBiaWRUYWJsZVJvdyBvZiBiaWRUYWJsZS5jaGlsZHJlbilcbiAgICAgICAgZm9yKGxldCBiaWRUYWJsZUNvbHVtbiBvZiBiaWRUYWJsZVJvdy5jaGlsZHJlbilcbiAgICAgICAgICAgIGJpZFRhYmxlQ29sdW1uLmlubmVySFRNTD1cIlwiO1xufVxuXG5mdW5jdGlvbiBzZXRTdWl0ZUNsYXNzKGVsZW1lbnQsc3VpdGUpe1xuICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudGx5IGFzc2lnbmVkIHN1aXRlXG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENhcmQuU1VJVEVfTkFNRVNbcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKV0pO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiLFN0cmluZyhzdWl0ZSkpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbn1cblxuZnVuY3Rpb24gc2hvd0NhcmQoZWxlbWVudCxjYXJkLHRydW1wU3VpdGUsd2lubmVyU2lnbil7XG4gICAgaWYoY2FyZCl7XG4gICAgICAgIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxjYXJkLnN1aXRlKTsgLy8gd2Ugd2FudCB0byBzZWUgdGhlIHJpZ2h0IGNvbG9yXG4gICAgICAgIGxldCBlbGVtZW50SXNUcnVtcD1lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInRydW1wXCIpO1xuICAgICAgICBsZXQgZWxlbWVudFNob3VsZEJlVHJ1bXA9KGNhcmQuc3VpdGU9PT10cnVtcFN1aXRlKTtcbiAgICAgICAgaWYoZWxlbWVudElzVHJ1bXAhPT1lbGVtZW50U2hvdWxkQmVUcnVtcCllbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJ0cnVtcFwiKTtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgaWYod2lubmVyU2lnbiE9MCllbGVtZW50LmlubmVySFRNTCs9XCIqXCI7XG4gICAgICAgIC8qIHJlcGxhY2luZzogXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgdGhlIGNhcmQgb2YgdGhlIHdpbm5lciBzbyBmYXIgaXQgY2FuIGJlIGVpdGhlciArIG9yIC1cbiAgICAgICAgaWYod2lubmVyU2lnbj4wKWVsZW1lbnQuaW5uZXJIVE1MKz0nKyc7ZWxzZSBpZih3aW5uZXJTaWduPDApZWxlbWVudC5pbm5lckhUTUwrPSctJztcbiAgICAgICAgKi9cbiAgICB9ZWxzZVxuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1cIlwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUscGxheWVyVHlwZSl7XG4gICAgZWxlbWVudC5pbm5lckhUTUw9KG5hbWU/bmFtZTpcIj9cIik7XG4gICAgc3dpdGNoKHBsYXllclR5cGUpe1xuICAgICAgICBjYXNlIC0xOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJyZWRcIjticmVhaztcbiAgICAgICAgY2FzZSAwOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJvcmFuZ2VcIjticmVhaztcbiAgICAgICAgY2FzZSAxOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJncmVlblwiO2JyZWFrO1xuICAgICAgICBkZWZhdWx0OmVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO2JyZWFrO1xuICAgIH1cbn1cbi8qKlxuICogc2hvd3MgdGhlIGdpdmVuIHRyaWNrXG4gKiBAcGFyYW0geyp9IHRyaWNrIFxuICovXG5mdW5jdGlvbiBzaG93VHJpY2sodHJpY2svKixwbGF5ZXJJbmRleCovKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT1jdXJyZW50UGxheWVyLmdhbWU7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdHJpY2sgXCIsdHJpY2spO1xuICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTAmJnJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKT49MCl7IC8vIG9uY2Ugc3VmZmljZXNcbiAgICAgICAgZm9yKGxldCBwYXJ0bmVyU3VpdGVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItc3VpdGUnKSlwYXJ0bmVyU3VpdGVFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tyaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJTdWl0ZSgpXTtcbiAgICAgICAgZm9yKGxldCBwYXJ0bmVyUmFua0VsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1yYW5rJykpcGFydG5lclJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3Jpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKV07XG4gICAgfVxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIHRydW1wIHBsYXllciB0aGF0IGlzIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgKGVpdGhlciBub24tYmxpbmQgb3IgYmxpbmQpIGZsYWcgdGhlIGNoZWNrYm94XG4gICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCcpLmNoZWNrZWQ9dHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtYmxpbmQnKS5pbm5lckhUTUw9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDA/XCJibGluZCBcIjpcIlwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgIH1lbHNlXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgIGlmKHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2tpbmctZm9yLXBhcnRuZXItY2FyZC1pbmZvXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgIH1lbHNlXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNraW5nLWZvci1wYXJ0bmVyLWNhcmQtaW5mb1wiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgIC8vbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWNhcmRzLXRhYmxlXCIpLnJlcXVlc3RTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lc1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSwtMik7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMSklNCksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMiklNCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzMpJTQpKTtcbiAgICAvLyBzaG93IHRoZSB0cmljayBjYXJkcyBwbGF5ZWQgYnkgdGhlIGxlZnQsIG9wcG9zaXRlIGFuZCByaWdodCBwbGF5ZXJcbiAgICAvLyBOT1RFIHRoZSBmaXJzdCBjYXJkIGNvdWxkIGJlIHRoZSBibGluZCBjYXJkIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZCBub3Qgc2hvdyBpdCEhXG4gICAgLy8gICAgICBidXQgb25seSB0aGUgY29sb3Igb2YgdGhlIHBhcnRuZXIgc3VpdGVcbiAgICBsZXQgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD0odHJpY2subnVtYmVyT2ZDYXJkcz4wJiZ0cmljay5fY2FyZHNbMF0uc3VpdGUhPT10cmljay5wbGF5U3VpdGUpO1xuICAgIGxldCBwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9KGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ/KDQrdHJpY2suZmlyc3RQbGF5ZXItcGxheWVySW5kZXgpJTQ6MCk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0xKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMSklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzEpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsxKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0yKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMiklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzIpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsyKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0zKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMyklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzMpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCszKSU0KT8xOi0xKTowKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN1aXRlQ2FyZFJvd3Mocm93cyxzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciBzdWl0ZSBjYXJkIHJvd3M6IFwiK3Jvd3MubGVuZ3RoK1wiLlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiByb3dzOiBcIixyb3dzLmxlbmd0aCk7XG4gICAgbGV0IHN1aXRlPTA7XG4gICAgZm9yKGxldCByb3cgb2Ygcm93cyl7XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY2VsbHM9cm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkPTA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBjZWxsIG9mIGNlbGxzKXtcbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9c3VpdGVDb2xvcjsgIFxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgc3VpdGVDYXJkKys7XG4gICAgICAgIH1cbiAgICAgICAgc3VpdGUrKztcbiAgICB9XG59XG4vLyBpbiB0aHJlZSBkaWZmZXJlbnQgcGFnZXMgdGhlIHBsYXllciBjYXJkcyBzaG91bGQgYmUgc2hvd24uLi5cbmZ1bmN0aW9uIHVwZGF0ZUJpZGRlclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSAoY3VycmVudCBwbGF5ZXIpIGNhcmRzIGZvciBiaWRkaW5nLlwiKTtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuXG4vKipcbiAqIGZvciBwbGF5aW5nIHRoZSBjYXJkcyBhcmUgc2hvd24gaW4gYnV0dG9ucyBpbnNpZGUgdGFibGUgY2VsbHNcbiAqIEBwYXJhbSB7Kn0gc3VpdGVDYXJkcyBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlUGxheWVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgdG8gY2hvb3NlIGZyb20uXCIpO1xuICAgIGxldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItc3VpdGVjYXJkcy10YWJsZVwiKTtcbiAgICBjb25zb2xlLmxvZyhcIlN1aXRlIGNhcmRzOiBcIixzdWl0ZUNhcmRzKTtcbiAgICBsZXQgcm93cz10YWJsZWJvZHkucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIk51bWJlciBvZiByb3dzOiBcIixyb3dzLmxlbmd0aCk7XG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPHJvd3MubGVuZ3RoO3N1aXRlKyspe1xuICAgICAgICBsZXQgcm93PXJvd3Nbc3VpdGVdO1xuICAgICAgICAvLy8vLy8vLy9sZXQgc3VpdGVDb2xvcj1TVUlURV9DT0xPUlNbc3VpdGUlMl07XG4gICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgbGV0IGNvbHVtbnM9cm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIGZvcihsZXQgc3VpdGVDYXJkPTA7c3VpdGVDYXJkPGNvbHVtbnMubGVuZ3RoO3N1aXRlQ2FyZCsrKXtcbiAgICAgICAgICAgIGxldCBjZWxsYnV0dG9uPWNvbHVtbnNbc3VpdGVDYXJkXS8qLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWJ1dHRvbl1cIikqLztcbiAgICAgICAgICAgIGlmKCFjZWxsYnV0dG9uKXtjb25zb2xlLmxvZyhcIk5vIGNlbGwgYnV0dG9uIVwiKTtjb250aW51ZTt9XG4gICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgaWYoY2FyZEluU3VpdGUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbY2FyZEluU3VpdGUuc3VpdGVdKTsgLy8gcmVwbGFjaW5nOiBjZWxsYnV0dG9uLnN0eWxlLmNvbG9yPXN1aXRlQ29sb3I7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwiaW5saW5lXCI7XG4gICAgICAgICAgICB9ZWxzZSAvLyBoaWRlIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHBsYXllciBjYXJkcyB0byBjaG9vc2UgZnJvbSBzaG93biFcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IHBsYXllcj0wO1xuICAgIGxldCBkZWx0YVBvaW50cz1yaWtrZW5UaGVHYW1lLmRlbHRhUG9pbnRzO1xuICAgIGxldCBwb2ludHM9cmlra2VuVGhlR2FtZS5wb2ludHM7XG4gICAgZm9yKGxldCBwbGF5ZXJSZXN1bHRzUm93IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJlc3VsdHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIikpe1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVyKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVyKSk6XCItXCIpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzJdLmlubmVySFRNTD0oZGVsdGFQb2ludHM/U3RyaW5nKGRlbHRhUG9pbnRzW3BsYXllcl0pOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblszXS5pbm5lckhUTUw9U3RyaW5nKHBvaW50c1twbGF5ZXJdKTtcbiAgICAgICAgcGxheWVyKys7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhclRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyaWNrcy1wbGF5ZWQtdGFibGVcIikpe1xuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlQ2VsbCBvZiB0cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpKXtcbiAgICAgICAgICAgIHRyaWNrc1BsYXllZFRhYmxlQ2VsbC5pbm5lckhUTUw9XCJcIjt0cmlja3NQbGF5ZWRUYWJsZUNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yPSd0cmFuc3BhcmVudCc7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT1jdXJyZW50UGxheWVyLmdhbWU7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIGxldCBsYXN0VHJpY2tQbGF5ZWRJbmRleD1yaWtrZW5UaGVHYW1lLm51bWJlck9mVHJpY2tzUGxheWVkLTE7IC8vIGdldHRlciBjaGFuZ2VkIHRvIGdldE1ldGhvZCBjYWxsXG4gICAgaWYobGFzdFRyaWNrUGxheWVkSW5kZXg+PTApe1xuICAgICAgICBsZXQgdHJpY2s9cmlra2VuVGhlR2FtZS5nZXRUcmlja0F0SW5kZXgobGFzdFRyaWNrUGxheWVkSW5kZXgpO1xuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLmNoaWxkcmVuW2xhc3RUcmlja1BsYXllZEluZGV4XTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9U3RyaW5nKGxhc3RUcmlja1BsYXllZEluZGV4KzEpO1xuICAgICAgICAgICAgZm9yKHRyaWNrUGxheWVyPTA7dHJpY2tQbGF5ZXI8dHJpY2suX2NhcmRzLmxlbmd0aDt0cmlja1BsYXllcisrKXtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyPSh0cmlja1BsYXllcit0cmljay5maXJzdFBsYXllciklNDtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bMipwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICAgICAgbGV0IGNhcmQ9dHJpY2suX2NhcmRzW3RyaWNrUGxheWVyXTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpOyAvLyBwdXQgfCBpbiBmcm9udCBvZiBmaXJzdCBwbGF5ZXIhISFcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBiYWNrZ3JvdW5kIHRoZSBjb2xvciBvZiB0aGUgcGxheSBzdWl0ZSBhZnRlciB0aGUgbGFzdCBwbGF5ZXIsIHNvIHdlIGtub3cgd2hlcmUgdGhlIHRyaWNrIGVuZGVkISFcbiAgICAgICAgICAgICAgICByb3cuY2hpbGRyZW5bMipwbGF5ZXIrMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yPSh0cmlja1BsYXllcj09dHJpY2suX2NhcmRzLmxlbmd0aC0xPyh0cmljay5wbGF5U3VpdGUlMj8nYmxhY2snOidyZWQnKTond2hpdGUnKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQncyBtYWtlIHRoZSB3aW5uZXIgY2FyZCBzaG93IGJpZ2dlciEhIVxuICAgICAgICAgICAgICAgIC8vLy8vLy9pZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgICAgICAgICBpZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibGFjayc6J3JlZCcpO1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuZm9udFNpemU9KHRyaWNrLndpbm5lcj09PXBsYXllcj9cIjYwMFwiOlwiNDUwXCIpK1wiJVwiO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj0nIycrKGNhcmQuc3VpdGUlMj8nRkYnOicwMCcpKycwMCcrKHRyaWNrUGxheWVyPT0wPydGRic6JzAwJyk7IC8vIGZpcnN0IHBsYXllciBhZGRzIGJsdWUhIVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzldLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFRlYW1OYW1lKHRyaWNrLndpbm5lcik7IC8vIHNob3cgd2hvIHdvbiB0aGUgdHJpY2shIVxuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzEwXS5pbm5lckhUTUw9Z2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKHBsYXllck5hbWVJbnB1dEVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYoIXBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWV8fHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWUubGVuZ3RoPT0wKVxuICAgICAgICAgICAgcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZT1wbGF5ZXJOYW1lc1twYXJzZUludChwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIpKV07XG4gICAgfVxufVxuXG4vLyBwbGF5aW5nIGZyb20gd2l0aGluIHRoZSBnYW1lXG5mdW5jdGlvbiBzaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGxldCBzaW5nbGVQbGF5ZXJOYW1lPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLW5hbWUnKS52YWx1ZS50cmltKCk7XG4gICAgaWYoc2luZ2xlUGxheWVyTmFtZS5sZW5ndGg+MClcbiAgICAgICAgc2V0UGxheWVyTmFtZShzaW5nbGVQbGF5ZXJOYW1lLChlcnIpPT57XG4gICAgICAgICAgICAvLyBNREhAMTBKQU4yMDIwOiBfc2V0UGxheWVyIHRha2VzIGNhcmUgb2Ygc3dpdGNoaW5nIHRvIHRoZSByaWdodCBpbml0aWFsIHBhZ2UhISFcbiAgICAgICAgICAgIGlmKGVycilzZXRJbmZvKGVycik7Ly8gZWxzZSBuZXh0UGFnZSgpO1xuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIGFsZXJ0KFwiR2VlZiBlZXJzdCBlZW4gKGdlbGRpZ2UpIG5hYW0gb3AhXCIpO1xufVxuXG4vKipcbiAqIHByZXBhcmVzIHRoZSBHVUkgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gZ2V0R2FtZUluZm8oKXtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVybWluaW5nIGdhbWUgaW5mby5cIik7XG4gICAgbGV0IGdhbWVJbmZvPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOyAvLyBubyBwbGF5ZXIsIG5vIGdhbWVcbiAgICBpZihyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgLy8gZ2V0IHRoZSBpbmZvIHdlIG5lZWQgdGhyb3VnaCB0aGUgUGxheWVyR2FtZSBpbnN0YW5jZSByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkZGVycz1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCk7IC8vIHRob3NlIGJpZGRpbmdcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZGRlcnM6IFwiK2hpZ2hlc3RCaWRkZXJzLmpvaW4oXCIsIFwiKStcIi5cIik7XG4gICAgICAgIGxldCBoaWdoZXN0QmlkPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIik7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0VHJ1bXBTdWl0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdFRydW1wIHN1aXRlOiBcIit0cnVtcFN1aXRlK1wiLlwiKTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBsZXQgcGFydG5lclJhbms9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAvLyBwbGF5aW5nIHdpdGggdHJ1bXAgaXMgZWFzaWVzdFxuICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXsgLy8gb25seSBhIHNpbmdsZSBoaWdoZXN0IGJpZGRlciEhIVxuICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcj1oaWdoZXN0QmlkZGVyc1swXTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyb2VsYVBsYXllck5hbWU9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPXRyb2VsYVBsYXllck5hbWUrXCIgaGVlZnQgdHJvZWxhLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHJpa2tlblRoZUdhbWUuZm91cnRoQWNlUGxheWVyKStcIiBpcyBtZWUuXCI7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9SSUt8fGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUil7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKStcIiByaWt0IGluIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCIsIGVuIHZyYWFndCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIG1lZS5cIjsgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgLy8gd2l0aG91dCBhIHBhcnRuZXJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHNwZWVsdCBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1t0cnVtcFN1aXRlXStcIiBtZXQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgYWxzIHRyb2VmLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXsgLy8gdGhlcmUncyBubyB0cnVtcCwgZXZlcnlvbmUgaXMgcGxheWluZyBmb3IgaGltL2hlcnNlbGZcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXM9W107XG4gICAgICAgICAgICBoaWdoZXN0QmlkZGVycy5mb3JFYWNoKChoaWdoZXN0QmlkZGVyKT0+e2hpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5wdXNoKHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKSk7fSk7XG4gICAgICAgICAgICBpZihoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPWhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5qb2luKFwiLCBcIikrKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MT9cIiBzcGVsZW4gXCI6XCIgc3BlZWx0IFwiKStQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIjtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgZ2FtZUluZm89XCJJZWRlcmVlbiBoZWVmdCBnZXBhc3QuIFdlIHNwZWxlbiBvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWchXCI7XG4gICAgICAgIH1cbiAgIH1cbiAgIHJldHVybiBnYW1lSW5mbztcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQobnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSxoaWdoZXN0QmlkKXtcbiAgICBzd2l0Y2gobnVtYmVyT2ZUcmlja3NUb1dpbil7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBcIkdlZW5lZW5cIjtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIFwiUHJlY2llcyBlZW5cIjtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFwiWmVzIHNhbWVuIG1ldCBcIisocGFydG5lck5hbWU/cGFydG5lck5hbWU6XCJqZSBwYXJ0bmVyXCIpK1wiIG9tIGRlIHRlZ2Vuc3BlbGVycyBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgbGF0ZW4gdmVybGllemVuXCI7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBcIkFjaHQgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgXCIrKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQT9cInRyb2VsYVwiOlwicmlrXCIpK1wiIHRlIHdpbm5lblwiO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gXCJOZWdlbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiBcIlRpZW4gYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICByZXR1cm4gXCJFbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICByZXR1cm4gXCJUd2FhbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gXCJBbGxlbWFhbFwiO1xuICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXQgbWl0cyBuaWV0IGRlIGxhYXRzdGUgc2xhZyBvZiBlZW4gc2xhZyBtZXQgZGUgc2Nob3BwZW4gdnJvdXdcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXRcIjtcbn1cblxuY2xhc3MgT25saW5lUGxheWVyIGV4dGVuZHMgUGxheWVye1xuXG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgLy8gYXMgd2UncmUgbm90IHJlY2VpdmluZyB0aGUgYWN0dWFsIHRyaWNrcyB3b24sIHdlIGhhdmUgdG8gb3ZlcnJpZGUgdGhlIGdldHRlclxuICAgIHNldCBudW1iZXJPZlRyaWNrc1dvbihudW1iZXJPZlRyaWNrc1dvbil7dGhpcy5fbnVtYmVyT2ZUcmlja3NXb249bnVtYmVyT2ZUcmlja3NXb247fVxuICAgIGdldE51bWJlck9mVHJpY2tzV29uKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzV29uO30gLy8gZG8gTk9UIHVzZSB0aGUgZ2V0dGVyIGhlcmUhISEhXG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gZGVidWdnZXJcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAvLyByZW1vdmVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IC8vIEpJVCB0byB0aGUgcmlnaHQgcGFnZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG5cbiAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7XG4gICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5pdGlhbFwiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJCaWRzT2JqZWN0cy5sZW5ndGg7cGxheWVyKyspe1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyXTtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJCaWRzUm93PWJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl07XG4gICAgICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgICAgIGxldCBiaWRDb2x1bW49MDtcbiAgICAgICAgICAgIC8vIHdyaXRlIHRoZSBiaWRzICh3ZSBoYXZlIHRvIGNsZWFyIHRoZSB0YWJsZSB3aXRoIGV2ZXJ5IG5ldyBnYW1lIHRob3VnaClcbiAgICAgICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlblsrK2JpZENvbHVtbl0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2luZzogYmlkVGFibGUuY2hpbGRyZW5bcGxheWVyXS5jaGlsZHJlblsxXS5pbm5lckhUTUw9cGxheWVyc0JpZHNbYmlkXS5qb2luKFwiIFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSB0cnVtcCBzdWl0ZXM6XCIsc3VpdGVzKTtcbiAgICAgICAgc2V0UGFnZShcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgdHJ1bXAgc3VpdGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgfVxuICAgIGNob29zZVBhcnRuZXJTdWl0ZShzdWl0ZXMscGFydG5lclJhbmspeyAvLyBwYXJ0bmVyUmFua05hbWUgY2hhbmdlZCB0byBwYXJ0bmVyUmFuayAoYmVjYXVzZSBMYW5ndWFnZSBzaG91bGQgYmUgdXNlZCBhdCB0aGUgVUkgbGV2ZWwgb25seSEpXG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBwYXJ0bmVyIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLy8gYmVjYXVzZSB0aGUgc3VpdGVzIGluIHRoZSBidXR0b24gYXJyYXkgYXJlIDAsIDEsIDIsIDMgYW5kIHN1aXRlcyB3aWxsIGNvbnRhaW5cbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXJ0bmVyLXJhbmsnKS5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua107XG4gICAgfVxuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgcmVwbGFjZWQgdmVyc2lvbiBleGNlcHQgd2Ugbm93IHdhbnQgdG8gcmVjZWl2ZSB0aGUgdHJpY2sgaXRzZWxmXG4gICAgcGxheUFDYXJkKHRyaWNrKXtcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzO1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIC8vIE1ESEAxOUpBTjIwMjA6IGFsbG93IHRoZSBjdXJyZW50IHBsYXllciB0byBwbGF5IGEgY2FyZCBieSBjbGlja2luZyBvbmVcbiAgICAgICAgdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAqL1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBzZXRJbmZvKFwiU3BlZWwgZWVuIGthYXJ0IGJpai5cIik7XG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYSBuZXcgdHJpY2sgdXBkYXRlIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlIHdpdGggdGhlIHByZXZpb3VzIHRyaWNrXG4gICAgICAgIC8vIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTApdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgIC8qIHNlZSBzaG93VHJpY2soKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbi1hc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5zdHlsZS5kaXNwbGF5PSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZEJsaW5kP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgICAgIC8vIGFsd2F5cyBzdGFydCB1bmNoZWNrZWQuLi5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5jaGVja2VkPWZhbHNlOyAvLyB3aGVuIGNsaWNrZWQgc2hvdWxkIGdlbmVyYXRlIFxuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgLy8gb2Jzb2xldGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZC1wbGF5ZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1wbGF5c3VpdGVcIikuaW5uZXJIVE1MPSh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpOlwia2FhcnRcIik7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbj10aGlzLmdldE51bWJlck9mVHJpY2tzV29uKCk7IC8vIGFsc28gaW5jbHVkZXMgdGhvc2Ugd29uIGJ5IHRoZSBwYXJ0bmVyIChhdXRvbWF0aWNhbGx5KVxuICAgICAgICAvLyBhZGQgdGhlIHRyaWNrcyB3b24gYnkgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAvLyBpZihwYXJ0bmVyKW51bWJlck9mVHJpY2tzV29uKz1wbGF5ZXIuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3Mtd29uLXNvLWZhclwiKS5pbm5lckhUTUw9U3RyaW5nKG51bWJlck9mVHJpY2tzV29uKSsocGFydG5lck5hbWU/XCIgKHNhbWVuIG1ldCBcIitwYXJ0bmVyTmFtZStcIilcIjpcIlwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3MtdG8td2luXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dCh0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZCgpKTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsOyAvLyBnZXQgcmlkIG9mIGFueSBjdXJyZW50bHkgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgIHNldEluZm8odGhpcy5uYW1lK1wiLCB3ZWxrZSBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIiB3aWwgamUgXCIrKHRyaWNrLm51bWJlck9mQ2FyZHM+MD9cImJpalwiOlwiXCIpK1wic3BlbGVuP1wiKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7IC8vIHJlbWVtYmVyIHRoZSBzdWl0ZSBjYXJkcyEhISFcbiAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIC8vLy8vIHNob3dUcmljayh0aGlzLl90cmljaz10cmljayk7IC8vIE1ESEAxMUpBTjIwMjA6IG5vIG5lZWQgdG8gcGFzcyB0aGUgcGxheWVyIGluZGV4IChhcyBpdCBpcyBhbHdheXMgdGhlIHNhbWUpXG4gICAgICAgIC8vIE1ESEAxOEpBTjIwMjA6IGFsbG93IHRoZSBwbGF5ZXIgdG8gcGxheSBhIGNhcmQgYnkgcGx1Z2dpbmcgaW4gdGhlIGV2ZW50IGhhbmRsZXIgYWdhaW4hIVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpO1xuICAgIH1cblxuICAgIC8vIG5vdCB0byBiZSBjb25mdXNlZCB3aXRoIF9jYXJkUGxheWVkKCkgZGVmaW5lZCBpbiB0aGUgYmFzZSBjbGFzcyBQbGF5ZXIgd2hpY2ggaW5mb3JtcyB0aGUgZ2FtZVxuICAgIC8vIE5PVEUgY2FyZFBsYXllZCBpcyBhIGdvb2QgcG9pbnQgZm9yIGNoZWNraW5nIHRoZSB2YWxpZGl0eSBvZiB0aGUgY2FyZCBwbGF5ZWRcbiAgICAvLyBOT1RFIGNhbid0IHVzZSBfY2FyZFBsYXllZCAoc2VlIFBsYXllciBzdXBlcmNsYXNzKVxuICAgIF9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoc3VpdGUsaW5kZXgpe1xuICAgICAgICBsZXQgY2FyZD0oc3VpdGU8dGhpcy5fc3VpdGVDYXJkcy5sZW5ndGgmJnRoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdLmxlbmd0aD90aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXVtpbmRleF06bnVsbCk7XG4gICAgICAgIGlmKGNhcmQpe1xuICAgICAgICAgICAgLy8gVE9ETyBjaGVja2luZyBzaG91bGQgTk9UIGJlIGRvbmUgYnkgdGhlIHBsYXllciBCVVQgYnkgdGhlIHRyaWNrIGl0c2VsZiEhIVxuICAgICAgICAgICAgLy8gQlVHIEZJWDogZG8gTk9UIGRvIHRoZSBmb2xsb3dpbmcgaGVyZSwgYnV0IG9ubHkgYXQgdGhlIHN0YXJ0IG9mIGEgdHJpY2ssIG9yIE5PVCBhdCBhbGwhISEhIVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gLTEgd2hlbiBhc2tpbmcgYmxpbmQsIDAgbm90IGFza2luZywgMSBpZiBhc2tpbmdcbiAgICAgICAgICAgIC8vIENBTidUIGNhbGwgX3NldENhcmQgKGluIGJhc2UgY2xhc3MgUGxheWVyKSBpZiB0aGUgY2FyZCBjYW5ub3QgYmUgcGxheWVkISEhXG4gICAgICAgICAgICB0aGlzLl90cmljaz10aGlzLl9nYW1lLl90cmljazsgLy8gTURIQDE5SkFOMjAyMDogZWFzaWVzdCB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRyaWNrXG4gICAgICAgICAgICBpZih0aGlzLl90cmljay5udW1iZXJPZkNhcmRzPT0wKXsgLy8gZmlyc3QgY2FyZCBpbiB0aGUgdHJpY2sgcGxheWVkXG4gICAgICAgICAgICAgICAgLy8gdGhlb3JldGljYWxseSB0aGUgY2FyZCBjYW4gYmUgcGxheWVkIGJ1dCBpdCBtaWdodCBiZSB0aGUgY2FyZCB3aXRoIHdoaWNoIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQhIVxuICAgICAgICAgICAgICAgIC8vIGlzIHRoaXMgYSBnYW1lIHdoZXJlIHRoZXJlJ3MgYSBwYXJ0bmVyIGNhcmQgdGhhdCBoYXNuJ3QgYmVlbiBwbGF5ZWQgeWV0XG4gICAgICAgICAgICAgICAgLy8gYWx0ZXJuYXRpdmVseSBwdXQ6IHNob3VsZCB0aGVyZSBiZSBhIHBhcnRuZXIgYW5kIHRoZXJlIGlzbid0IG9uZSB5ZXQ/Pz8/P1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKT09dGhpcy5faW5kZXgpeyAvLyB0aGlzIGlzIHRydW1wIHBsYXllciBwbGF5aW5nIHRoZSBmaXJzdCBjYXJkXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj4+Pj4gQ0hFQ0tJTkcgV0hFVEhFUiBBU0tJTkcgRk9SIFRIRSBQQVJUTkVSIENBUkQgPDw8PFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIHRoZSB0cnVtcCBwbGF5ZXIgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIHRydW1wIHBsYXllciBkb2VzIG5vdCBoYXZlIFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl90cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD4wKXsgLy8gbm9uLWJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHNob3VsZCBiZSBkZXRlY3RlZCBieSB0aGUgZ2FtZSBwcmVmZXJhYmx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWl0ZT09dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vYWxlcnQoXCJcXHROT05fQkxJTkRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDApeyAvLyBjb3VsZCBiZSBibGluZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGNoZWNrYm94IGlzIHN0aWxsIHNldCBpLmUuIHRoZSB1c2VyIGRpZG4ndCB1bmNoZWNrIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoZSB3aWxsIGJlIGFza2luZyBmb3IgdGhlIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMCBCVUcgRklYOiB3YXMgdXNpbmcgYXNrLXBhcnRuZXItY2FyZC1ibGluZCBpbnN0ZWFkIG9mIGFzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3ghISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveFwiKS5jaGVja2VkJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3VpdGUhPXRoaXMuX2dhbWUuZ2V0VHJ1bXBTdWl0ZSgpfHxjb25maXJtKFwiV2lsdCBVIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCldK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpXStcIiAoYmxpbmQpIHZyYWdlbiBtZXQgZWVuIHRyb2VmP1wiKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPS0xOyAvLyB5ZXMsIGFza2luZyBibGluZCEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy9hbGVydChcIlxcdEJMSU5EIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qYWxlcnQoXCJOb3QgaW5kaWNhdGVkISEhIVwiKSovO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIG9yIG5vdCB0aGUgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlc1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5fdHJpY2suX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyYmc3VpdGU9PT1DYXJkLlNVSVRFX1NQQURFKXsgLy8gc3BhZGUgaXMgYmVpbmcgcGxheWVkIGJ5IHRoZSBmaXJzdCBwbGF5ZXIgd2hlcmVhcyB0aGF0IGlzIG5vdCBhbGxvd2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoQ2FyZC5TVUlURV9TUEFERSk8dGhpcy5udW1iZXJPZkNhcmRzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXsgLy8gbm90IHRoZSBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2FyZCBuZWVkcyB0byBiZSB0aGUgc2FtZSBzdWl0ZSBhcyB0aGUgcGxheSBzdWl0ZSAoaWYgdGhlIHBsYXllciBoYXMgYW55KVxuICAgICAgICAgICAgICAgIGlmKHN1aXRlIT09dGhpcy5fdHJpY2sucGxheVN1aXRlJiZ0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUodGhpcy5fdHJpY2sucGxheVN1aXRlKT4wKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPXBhcnRuZXJTdWl0ZXx8Y2FyZC5yYW5rIT1wYXJ0bmVyUmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbcGFydG5lclN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMDogd2UgaGF2ZSB0byBhbHNvIHJldHVybiB3aGF0ZXZlciB0cmljayB2YWx1ZSB0aGF0IG1pZ2h0J3ZlIGNoYW5nZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdoaWNoIGluIHRoaXMgY2FzZSBjb3VsZCB3ZWwgYmUgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkICdmbGFnJ1xuICAgICAgICAgICAgdGhpcy5fc2V0Q2FyZChjYXJkLHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiSW52YWxpZCBjYXJkIHN1aXRlIFwiK1N0cmluZyhzdWl0ZSkrXCIgYW5kIHN1aXRlIGluZGV4IFwiK1N0cmluZyhpbmRleCkrXCIuXCIpO1xuICAgIH1cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBzdXBlci5wbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpO1xuICAgICAgICAvLyBUT0RPIHNob3VsZCB3ZSBkbyB0aGlzIGhlcmU/P1xuICAgICAgICBpZih0aGlzLmdhbWUpc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTtlbHNlIHNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpO1xuICAgIH1cbiAgICAvLyBjYWxsIHJlbmRlckNhcmRzIGp1c3QgYWZ0ZXIgdGhlIHNldCBvZiBjYXJkcyBjaGFuZ2VcbiAgICByZW5kZXJDYXJkcygpe1xuICAgICAgICB0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKTtcbiAgICAgICAgc3dpdGNoKGN1cnJlbnRQYWdlKXtcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLWJpZGRpbmdcIjp1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgb25seSBvbmNlXG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wbGF5aW5nXCI6dXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IGFmdGVyIHBsYXlpbmcgYSBjYXJkISFcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXRydW1wLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGV4aXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIGEgcGxheWVyIGxlYXZlcyBhIGdhbWUgZm9yIHNvbWUgcmVhc29uICh0eXBpY2FsbHkgYnkgY2xvc2luZyB0aGUgdGFiKVxuICAgIGV4aXQoKXsoIXRoaXMuX2dhbWV8fHRoaXMuX2dhbWUuZXhpdCh0aGlzLm5hbWUrXCIgbGVhdmluZy4uLlwiKSk7fVxufVxuXG4vLyBidXR0b24gY2xpY2sgZXZlbnQgaGFuZGxlcnNcbi8qKlxuICogY2xpY2tpbmcgYSBiaWQgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIGJpZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIGJpZEJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIGxldCBiaWQ9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpZFwiKSk7XG4gICAgY29uc29sZS5sb2coXCJCaWQgY2hvc2VuOiBcIixiaWQpO1xuICAgIGN1cnJlbnRQbGF5ZXIuX3NldEJpZChiaWQpOyAvLyB0aGUgdmFsdWUgb2YgdGhlIGJ1dHRvbiBpcyB0aGUgbWFkZSBiaWRcbn1cbi8qKlxuICogY2xpY2tpbmcgYSB0cnVtcCBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gdHJ1bXAgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiB0cnVtcFN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBPT1BTIHVzaW5nIHBhcnNlSW50KCkgaGVyZSBpcyBTT09PTyBpbXBvcnRhbnRcbiAgICBsZXQgdHJ1bXBTdWl0ZT1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGVcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiVHJ1bXAgc3VpdGUgXCIrdHJ1bXBTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIGN1cnJlbnRQbGF5ZXIuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG59XG4vKipcbiAqIGNsaWNraW5nIGEgcGFydG5lciBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gcGFydG5lciBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIC8vIGVpdGhlciB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIHNlbGVjdGVkXG4gICAgLy8gcGFyc2VJbnQgVkVSWSBJTVBPUlRBTlQhISEhXG4gICAgbGV0IHBhcnRuZXJTdWl0ZT1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGVcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiUGFydG5lciBzdWl0ZSBcIitwYXJ0bmVyU3VpdGUrXCIgY2hvc2VuLlwiKTtcbiAgICAvLyBnbyBkaXJlY3RseSB0byB0aGUgZ2FtZSAoaW5zdGVhZCBvZiB0aHJvdWdoIHRoZSBwbGF5ZXIpXG4gICAgY3VycmVudFBsYXllci5fc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSk7XG59XG5cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGxheWFibGVjYXJkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgbGV0IHBsYXlhYmxlY2FyZENlbGw9ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBsZXQgY2FyZFN1aXRlPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSk7XG4gICAgbGV0IGNhcmRSYW5rPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pbmRleFwiKSk7XG4gICAgLy8vLy8vLy9pZihwbGF5YWJsZWNhcmRDZWxsLnN0eWxlLmJvcmRlcj1cIjBweFwiKXJldHVybjsgLy8gZW1wdHkgJ3VuY2xpY2thYmxlJyBjZWxsXG4gICAgY3VycmVudFBsYXllci5fY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KGNhcmRTdWl0ZSxjYXJkUmFuayk7XG59XG5cbi8qKlxuICogY29udmVuaWVudCB0byBiZSBhYmxlIHRvIHR1cm4gdGhlIHBsYXlhYmxlIGNhcmQgYnV0dG9ucyBvbiBhbmQgb2ZmIGF0IHRoZSByaWdodCBtb21lbnRcbiAqIEBwYXJhbSB7ZW5hYmxlfSBlbmFibGUgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnMoZW5hYmxlKXtcbiAgICAvLyBjbGlja2luZyBjYXJkICdidXR0b25zJyAobm93IGNlbGxzIGluIHRhYmxlKSwgd2UgY2FuIGdldCByaWQgb2YgdGhlIGJ1dHRvbiBpdHNlbGYhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZT9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklERElORzpcbiAgICAgICAgICAgIC8vIHdoZW4gbW92aW5nIGZyb20gdGhlIERFQUxJTkcgc3RhdGUgdG8gdGhlIEJJRERJTkcgc3RhdGUgY2xlYXIgdGhlIGJpZCB0YWJsZVxuICAgICAgICAgICAgLy8gQUxURVJOQVRJVkVMWSB0aGlzIGNvdWxkIGJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBlbmRzXG4gICAgICAgICAgICAvLyBCVVQgdGhpcyBpcyBhIGJpdCBzYWZlciEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBiaWVkZW4gaXMgYmVnb25uZW4hXCIpO1xuICAgICAgICAgICAgaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKWNsZWFyQmlkVGFibGUoKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7IC8vIGFsbG93aW5nIHRoZSB1c2VyIHRvIGNsXG4gICAgICAgICAgICAvKiBNREhAMTlKQU4yMDIwOiBpbiBkdWUgY291cnNlIHdlIHdpbGwgYmUgcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyB0d28gbGluZXNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4hXCIpO1xuICAgICAgICAgICAgdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7IC8vIHNvIHdlIGdldCB0byBzZWUgdGhlIGxhc3QgdHJpY2sgYXMgd2VsbCEhIVxuICAgICAgICAgICAgdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCk7IC8vIHNob3cgdGhlIHBsYXllciByZXN1bHRzIHNvIGZhclxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFRoZSBzdGF0ZSBvZiB0aGUgZ2FtZSBjaGFuZ2VkIHRvICdcIit0b3N0YXRlK1wiJy5cIik7XG59XG5cbmZ1bmN0aW9uIF9nYW1lRXJyb3JPY2N1cnJlZChlcnJvcil7XG4gICAgYWxlcnQoXCJGb3V0OiBcIitlcnJvcik7XG59XG5cbmZ1bmN0aW9uIHNldFBhZ2UobmV3UGFnZSl7XG4gICAgLy8gcmVtZW1iZXIgdGhlIHBhZ2Ugd2UgY2FtZSBmcm9tIChub3QgdGhlIG5ldyBwYWdlISEhISlcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBQYWdlIHRvIHNob3c6ICdcIituZXdQYWdlK1wiJy5cIik7XG4gICAgLy8gaWYgdGhpcyBpcyBhIHBhZ2UgcmVmcmVzaCwgbm8gbmVlZCB0byByZXB1c2ggdGhlIHBhZ2UhISFcbiAgICBpZihjdXJyZW50UGFnZSlpZihjdXJyZW50UGFnZSE9bmV3UGFnZSl2aXNpdGVkUGFnZXMudW5zaGlmdChjdXJyZW50UGFnZSk7XG4gICAgY3VycmVudFBhZ2U9bmV3UGFnZTtcbiAgICB1cGRhdGVIZWxwQnV0dG9ucygpO1xuICAgIC8vIE5PVEUgbm90IGNoYW5naW5nIGN1cnJlbnRQYWdlIHRvIHBhZ2UgdW50aWwgd2UgaGF2ZSBkb25lIHdoYXQgd2UgbmVlZGVkIHRvIGRvXG4gICAgUEFHRVMuZm9yRWFjaChmdW5jdGlvbihfcGFnZSl7XG4gICAgICAgIGxldCBzaG93UGFnZT0oX3BhZ2U9PT1jdXJyZW50UGFnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKChzaG93UGFnZT9cIlNob3dpbmcgXCI6XCJIaWRpbmcgXCIpK1wiICdcIitfcGFnZStcIicuXCIpO1xuICAgICAgICBsZXQgcGFnZUVsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoX3BhZ2UpO1xuICAgICAgICBpZihwYWdlRWxlbWVudCl7XG4gICAgICAgICAgICBwYWdlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PShzaG93UGFnZT9cInZpc2libGVcIjpcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGlmKHNob3dQYWdlKXtcbiAgICAgICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSBwYWdlLSBwcmVmaXhcbiAgICAgICAgICAgICAgICBzd2l0Y2goX3BhZ2Uuc3Vic3RyaW5nKDUpKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJ1bGVzXCI6c2V0SW5mbyhcIkRlIHJlZ2VscyB2YW4gaGV0IG9ubGluZSBzcGVsLlwiKTticmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6c2V0SW5mbyhcIktpZXMgZGUgc3BlZWx3aWp6ZS5cIik7YnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXR1cC1nYW1lXCI6IC8vIHdoZW4gcGxheWluZyBpbiBkZW1vIG1vZGUsIHRoZSB1c2VyIHNob3VsZCBlbnRlciBmb3VyIHBsYXllciBuYW1lc1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEZWZhdWx0UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVnVsIGRlIG5hbWVuIHZhbiBkZSBzcGVsZXJzIGluLiBFZW4gc3BlbGVybmFhbSBpcyB2b2xkb2VuZGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhdXRoXCI6IC8vIHBhZ2UtYXV0aFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdlZWYgZGUgbmFhbSBvcCB3YWFyb25kZXIgVSB3aWx0IHNwZWxlbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndhaXQtZm9yLXBsYXllcnNcIjogLy8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRXZlbiBnZWR1bGQgYXViLiBXZSB3YWNodGVuIHRvdCBlciBnZW5vZWcgbWVkZXNwZWxlcnMgemlqbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJpZGRpbmdcIjogLy8gcGFnZS1iaWRkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb20gZGUgYmV1cnQgb3AgZWVuIHZlcnpvZWsgdG90IGhldCBkb2VuIHZhbiBlZW4gYm9kLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheS1yZXBvcnRpbmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheWluZ1wiOiAvLyA/Pz8/XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldhY2h0IG9wIGhldCB2ZXJ6b2VrIHRvdCBoZXQgKGJpailzcGVsZW4gdmFuIGVlbiBrYWFydC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBhbGVydChcIkJVRzogVW5rbm93biBwYWdlICdcIitfcGFnZStcIicgcmVxdWVzdGVkIVwiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5leHRQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgbmV4dCBwYWdlIVwiKTtcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIC8vIE1ESEAwN0pBTjIwMjA6IGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgbmV4dCBwYWdlLCB3aGVuIG5vdCBydW5uaW5nIGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgcGFnZS1hdXRoIHBhZ2VcbiAgICAvLyAgICAgICAgICAgICAgICBpbiBkZW1vIG1vZGUgc2tpcCB0aGUgYXV0aCBhbmQgd2FpdCBmb3IgcGxheWVycyBidXR0b25cbiAgICBzd2l0Y2gocGFnZUluZGV4KXtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYXV0aFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6IC8vIHNob3VsZCB3ZSBjaGVjayB0aGUgdXNlciBuYW1lcz8/Pz8/P1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4KzEpJVBBR0VTLmxlbmd0aF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gY2FuY2VsUGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIHByZXZpb3VzIHBhZ2UuXCIpO1xuICAgIC8vIGdvIG9uZSBwYWdlIGJhY2tcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCtQQUdFUy5sZW5ndGgtMSklUEFHRVMubGVuZ3RoXSk7XG59XG5mdW5jdGlvbiByZXR1cm5Ub1ByZXZpb3VzUGFnZSgpe1xuICAgIC8vIHBvcCBvZmYgdGhlIHBhZ2Ugd2UgYXJlIGdvaW5nIHRvIHZpc2l0LCBwcmV2ZW50aW5nIHRvIHB1c2ggdGhlIGN1cnJlbnRQYWdlIGFnYWluXG4gICAgaWYodmlzaXRlZFBhZ2VzLmxlbmd0aD4wKXtjdXJyZW50UGFnZT1udWxsO3NldFBhZ2UodmlzaXRlZFBhZ2VzLnNoaWZ0KCkpO31cbn1cbmZ1bmN0aW9uIHNob3dIZWxwKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSBoZWxwIVwiKTtcbiAgICBzZXRQYWdlKCdwYWdlLXJ1bGVzJyk7XG59XG4vLyBhc2NlcnRhaW4gdG8gZGlzYWJsZSB0aGUgSGVscCBidXR0b24gd2hlbiB2aWV3aW5nIGl0ISEhXG5mdW5jdGlvbiB1cGRhdGVIZWxwQnV0dG9ucygpe1xuICAgIGxldCBlbmFibGVIZWxwQnV0dG9uPShjdXJyZW50UGFnZSE9PSdwYWdlLWhlbHAnKTtcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24uZGlzYWJsZWQ9IWVuYWJsZUhlbHBCdXR0b247XG59XG5cbi8qKlxuICogdG8gYmUgY2FsbGVkIHdoZW4gdGhlIG5ldy1wbGF5ZXJzIGJ1dHRvbiBpcyBjbGlja2VkLCB0byBzdGFydCBhIG5ldyBnYW1lIHdpdGggYSBuZXcgc2V0IG9mIHBsYXllcnNcbiAqL1xuZnVuY3Rpb24gbmV3UGxheWVycygpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IE5pZXV3ZSBzcGVsZXJzIGFhbm1ha2VuLlwiKTtcbiAgICBwbGF5ZXJzPVtdO1xuICAgIGxldCBub1BsYXllck5hbWVzPXRydWU7XG4gICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBwbGF5ZXIgaW5wdXQgZmllbGRzXG4gICAgZm9yKHBsYXllck5hbWVJbnB1dCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZihwbGF5ZXJOYW1lSW5wdXQudmFsdWUubGVuZ3RoPjApe1xuICAgICAgICAgICAgbm9QbGF5ZXJOYW1lcz1mYWxzZTtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChuZXcgT25saW5lUGxheWVyKHBsYXllck5hbWVJbnB1dC52YWx1ZSkpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZXJzLmxlbmd0aDw0KVxuICAgICAgICAgICAgcGxheWVycy5wdXNoKG51bGwpO1xuICAgIH1cbiAgICBpZihub1BsYXllck5hbWVzKXtcbiAgICAgICAgcGxheWVycz1udWxsO1xuICAgICAgICBzZXRJbmZvKFwiR2VlbiBzcGVsZXJuYW1lbiBvcGdlZ2V2ZW4uIEhlYiB0ZW5taW5zdGUgZWVuIHNwZWxlcm5hYW0gbm9kaWchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiUmlra2VuIC0gaGV0IHNwZWw6IE5pZXV3ZSBzcGVsZXJzIGFhbmdlbWFha3QhXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxHYW1lKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOy8vaWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiR2VlbiBzcGVsIVwiKTtcbiAgICBpZighcmlra2VuVGhlR2FtZSl7XG4gICAgICAgIGFsZXJ0KFwiR2VlbiBzcGVsIG9tIGFmIHRlIGJyZWtlbiEgTGFhZCBkZXplIHdlYiBwYWdpbmEgb3BuaWV1dyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY29uZmlybShcIldpbHQgVSBlY2h0IGhldCBodWlkaWdlIHNwZWwgYWZicmVrZW4/XCIpKXtcbiAgICAgICAgcmlra2VuVGhlR2FtZS5jYW5jZWwoKTtcbiAgICB9XG59XG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGl0aW9uYWwgc3R1ZmYgdGhhdCB3ZSdyZSBnb2luZyB0byBuZWVkIHRvIG1ha2UgdGhpcyBzdHVmZiB3b3JrXG5jbGFzcyBQbGF5ZXJHYW1lUHJveHkgZXh0ZW5kcyBQbGF5ZXJHYW1lIHtcblxuICAgIGdldFNlbmRFdmVudChldmVudCxkYXRhLGNhbGxiYWNrKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKStcIi5cIik7XG4gICAgICAgIHJldHVybiBbZXZlbnQsZGF0YSxjYWxsYmFja107XG4gICAgfVxuXG4gICAgLy8gd2hhdCB0aGUgcGxheWVyIHdpbGwgYmUgY2FsbGluZyB3aGVuIChzKWhlIG1hZGUgYSBiaWQsIHBsYXllZCBhIGNhcmQsIGNob29zZSB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlXG4gICAgYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ0JJRCcsYmlkLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCSUQgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAgICAgICAgIHNob3dHYW1lU3RhdGUobnVsbCk7IC8vIGEgYml0IGNydWRlIHRvIGdldCByaWQgb2YgdGhlIEJpZWRlbiBwYWdlIG5hbWUgdGhvdWdoXG4gICAgICAgICAgICB9KSk7IC8vIG5vIG5lZWQgdG8gc2VuZCB0aGUgcGxheWVyIGlkIEkgdGhpbmsuLi4geydieSc6dGhpcy5fcGxheWVySW5kZXgsJ2JpZCc6YmlkfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UncmUgc2VuZGluZyB0aGUgZXhhY3QgY2FyZCBvdmVyIHRoYXQgd2FzIHBsYXllZCAoYW5kIGFjY2VwdGVkIGF0IHRoaXMgZW5kIGFzIGl0IHNob3VsZCBJIGd1ZXNzKVxuICAgIC8vIE1ESEAxNEpBTjIwMjA6IHBhc3NpbmcgaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkICdmbGFnJyBhcyB3ZWxsISEhIVxuICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2Ugd2UncmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBSaWtrZW5UaGVHYW1lIGltcGxlbWVudGF0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQgZG9lc24ndCBlbmQgdXAgaW4gdGhlIGxvY2FsIFJpa2tlblRoZUdhbWUgdHJpY2tcbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogZGlzYWJsZSB0aGUgYnV0dG9ucyBvbmNlIHRoZSBjYXJkIGlzIGFjY2VwdGVkICh0byBiZSBwbGF5ZWQhISEpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIFRPRE8gcGVyaGFwcyBoaWRpbmcgdGhlIGNhcmRzIHNob3VsZCBhbHNvIGJlIGRvbmUgaGVyZSEhIVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgY2FyZCBwbGF5ZWQ6IFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ0NBUkQnLFtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF0sZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNBUkQgcGxheWVkIHJlY2VpcHQgYWNrbm93bGVkZ2VkLlwiKTtcbiAgICAgICAgICAgICAgICBzaG93R2FtZVN0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSkpOyAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnY2FyZCc6W2NhcmQuc3VpdGUsY2FyZC5yYW5rXX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHJ1bXAgc3VpdGUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICAgICAgICAgIHNob3dHYW1lU3RhdGUobnVsbCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGFzY2VydGFpbiB0byBoaWRlIHRoZSB0cnVtcCBzdWl0ZSBpbnB1dCBlbGVtZW50XG4gICAgICAgICAgICB9KSk7IC8vIHNhbWUgaGVyZTogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6dHJ1bXBTdWl0ZX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIGV2ZW50IHJlY2VpcHQgYWNrbm93bGVkZ2VkIVwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBhc2NlcnRhaW4gdG8gaGlkZSB0aGUgcGFydG5lciBzdWl0ZSBpbnB1dCBlbGVtZW50XG4gICAgICAgICAgICAgICAgc2hvd0dhbWVTdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0pKTsgLy8gcmVwbGFjaW5nOiB7J3BsYXllcic6dGhpcy5fcGxheWVySW5kZXgsJ3N1aXRlJzpwYXJ0bmVyU3VpdGV9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdCWUUnLHJlYXNvbixmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCWUUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2U9cnVsZXNcIik7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBSZWNlaXZlZCBldmVudCBcIitldmVudCtcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGxheWVyTmFtZXMmJnBsYXllckluZGV4Pj0wJiZwbGF5ZXJJbmRleDx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg/dGhpcy5fcGxheWVyTmFtZXNbcGxheWVySW5kZXhdOm51bGwpO31cbiAgICBnZXRQbGF5ZXJOYW1lcygpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lczt9IC8vIG92ZXJyaWRpbmcgZ2V0UGxheWVyTmFtZXMoKSBvZiB0aGUgZGVtbyB2ZXJzaW9uISFcbiAgICBzZXQgcGxheWVyTmFtZXMocGxheWVyTmFtZXMpe1xuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1wbGF5ZXJOYW1lcztcbiAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9KCF0aGlzLl9wbGF5ZXJOYW1lc3x8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoPT0wPy0xOnRoaXMuX3BsYXllck5hbWVzLmluZGV4T2YoY3VycmVudFBsYXllci5uYW1lKSk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9dGhpcy5fcGxheWVySW5kZXg7XG4gICAgICAgIGlmKHRoaXMuX3BsYXllckluZGV4PDApXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBDdXJyZW50IHBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBub3QgZm91bmQuXCIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKTtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcil7XG4gICAgICAgIHJldHVybihwbGF5ZXI+PTAmJnBsYXllcjx0aGlzLl9udW1iZXJPZlRyaWNrc1dvbi5sZW5ndGg/dGhpcy5fbnVtYmVyT2ZUcmlja3NXb25bcGxheWVyXTowKTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB3aWxsIGJlIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50IHdoZW4gYSBuZXcgdHJpY2sgc3RhcnRzXG4gICAgXG4gICAgbmV3VHJpY2sodHJpY2tJbmZvKXtcbiAgICAgICAgaWYoIXRyaWNrSW5mbylyZXR1cm47XG4gICAgICAgIHNldEluZm8oXCJXZSBzcGVsZW4gc2xhZyBcIit0cmlja0luZm8uaW5kZXgrXCIuXCIpO1xuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgdHJpY2tzIHBsYXllZCEhISFcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ9dHJpY2tJbmZvLmluZGV4LTE7IC8vIHJlcGxhY2luZzogdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ9KHRoaXMuX3RyaWNrP3RoaXMuX251bWJlck9mVHJpY2tzV29uKzE6MCk7XG4gICAgICAgIC8vIGxldCdzIGNyZWF0ZSBhIG5ldyB0cmljayBCRUZPUkUgc2hvd2luZyB0aGUgYWxlcnRcbiAgICAgICAgLy8gYmVjYXVzZSBhIGNhcmQgYmVpbmcgcGxheWVkIGNvdWxkIGJlIHJlY2VpdmVkIEJFRk9SRSB0aGUgYWxlcnQgZ29lcyBhd2F5XG4gICAgICAgIC8vIE1ESEAxOUpBTjIwMjA6IGFwcGVuZGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlc1xuICAgICAgICB0aGlzLl90cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRoaXMuX3RydW1wU3VpdGUsdGhpcy5fcGFydG5lclN1aXRlLHRoaXMuX3BhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCx0cmlja0luZm8uZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXcgdHJpY2sgZGVmaW5lZCFcIik7XG4gICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAvLyB0aGUgcHJldmlvdXMgdHJpY2sgd2FzIGFsd2F5cyB3b24gYnkgdGhlIG5ldyBmaXJzdCBwbGF5ZXIgKG9mIGNvdXJzZSksIHVubGVzcyB0aGlzIGlzIHRoZSBmaXJzdCB0cmljayBvZiBjb3Vyc2VcbiAgICAgICAgbGV0IHRyaWNrV2lubmVySW5kZXg9KHRyaWNrSW5mby5pbmRleD4xP3RyaWNrSW5mby5maXJzdFBsYXllcjotMSk7XG4gICAgICAgIHRoaXMuX3RyaWNrV2lubmVyPSh0cmlja1dpbm5lckluZGV4PDA/bnVsbDp0aGlzLmdldFBsYXllck5hbWUodHJpY2tXaW5uZXJJbmRleCkpO1xuICAgICAgICAvLyB3aGlsZSB0aGUgYWxlcnQgaXMgc2hvd2luZyB0aGUgcGxheWVyIGNhbiB2aWV3IHRoZSBsYXN0IHRyaWNrISEhIVxuICAgICAgICBpZih0aGlzLl90cmlja1dpbm5lcilhbGVydChcIkRlIHNsYWcgaXMgZ2V3b25uZW4gZG9vciBcIit0aGlzLl90cmlja1dpbm5lcitcIi5cIik7XG4gICAgICAgIGlmKHRoaXMuX3RyaWNrV2lubmVyKXt0aGlzLl90cmlja1dpbm5lcj1udWxsO3Nob3dUcmljayh0aGlzLl90cmljayk7fVxuICAgIH1cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIHRoaXMuX3RyaWNrLmFkZENhcmQobmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mby5zdWl0ZSxjYXJkSW5mby5yYW5rKSk7XG4gICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIHN0aWxsIGxvb2tpbmcgYXQgdGhlIHRyaWNrIHdpbm5lciAoZnJvbSB0aGUgcHJldmlvdXMgdHJpY2spXG4gICAgICAgIC8vIGRvIG5vdGhpbmcuLi5cbiAgICAgICAgaWYodGhpcy5fdHJpY2tXaW5uZXIpe3RoaXMuX3RyaWNrV2lubmVyPW51bGw7c2hvd1RyaWNrKHRoaXMuX3RyaWNrKTt9XG4gICAgfVxuICAgIC8qIHJlcGxhY2luZzpcbiAgICBwYXJzZVRyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIGxldCB0cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRyaWNrSW5mby50cnVtcFN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyU3VpdGUsdHJpY2tJbmZvLnBhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgICAgIC8vIGFscmVhZHkgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciEhIVxuICAgICAgICAvLyB0cmljay5fZmlyc3RQbGF5ZXI9dHJpY2tJbmZvLmZpcnN0UGxheWVyO1xuICAgICAgICAvLyB0cmljay5fY2FuQXNrRm9yUGFydG5lckNhcmQ9dHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBpZih0cmlja0luZm8uY2FyZHMmJnRyaWNrSW5mby5jYXJkcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAvLyBmaWxsIHRoZSB0cmljayB3aXRoIHRyaWNrIGluZm9ybWF0aW9uIGZyb20gdGhlIG90aGVyIHBsYXllcnMhISFcbiAgICAgICAgICAgIHRyaWNrSW5mby5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdKS5ob2xkZXI9dHJpY2s7fSk7IC8vIHN0b3JlIHRoZSBjYXJkcyByZWNlaXZlZCBpbiB0cmlja1xuICAgICAgICAgICAgdHJpY2suX3dpbm5lcj10cmlja0luZm8ud2lubmVyO1xuICAgICAgICAgICAgdHJpY2suX3BsYXlTdWl0ZT10cmlja0luZm8ucGxheVN1aXRlO1xuICAgICAgICAgICAgdHJpY2suX2Fza2luZ0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJpY2s7XG4gICAgfVxuICAgICovXG5cbiAgICBhY2tub3dsZWRnZUV2ZW50cygpe1xuICAgICAgICAvLyBub3cgaWYgdGhlIHVuYWNrbm93bGVkZ2UgZXZlbnQgaWRzIGRvIE5PVCByZWFjaCB0aGUgc2VydmVyIHdlIHdpbGwgcmVjZWl2ZSBjZXJ0YWluIGV2ZW50cyBhZ2FpbiB1bnRpbCB3ZSBkb1xuICAgICAgICAvLyBtYW5hZ2UgdG8gZ2V0IHRoZW0gb3ZlclxuICAgICAgICAvLyBtYWtlIGEgY29weSBvZiBhbGwgdGhlIHVuYWNrbm93bGVkZ2VkIGV2ZW50c1xuICAgICAgICBsZXQgYWNrbm93bGVkZ2VhYmxlRXZlbnRzPXRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLm1hcCgodW5hY2tub3dsZWRnZWRFdmVudCk9Pk9iamVjdC5hc3NpZ24oe30sdW5hY2tub3dsZWRnZWRFdmVudCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgYWNrbm93bGVkZ2VhYmxlIGV2ZW50czogXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzKTtcbiAgICAgICAgLy8gb2YgY291cnNlIHdlIGNvdWxkIHNlbmQgdGhlbSBwYXNzaW5nIGFuIGFja25vd2xlZGdlIGZ1bmN0aW9uIHRob3VnaFxuICAgICAgICBpZihhY2tub3dsZWRnZWFibGVFdmVudHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZW1pdCBwYXNzaW5nIGFsb25nIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZ2V0IGNhbGxlZCB3aGVuIHRoZSBBQ0sgbWVzc2FnZSB3YXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZlclxuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoXCJBQ0tcIixhY2tub3dsZWRnZWFibGVFdmVudHMsKCk9PntcbiAgICAgICAgICAgICAgICAvLyB3ZSBub3cgbWF5IHJlbW92ZSBhbGwgYWNrbm93bGVkZ2VhYmxlIGV2ZW50c1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqIEV2ZW50cyBhY2tub3dsZWRnZW1lbnRzIHJlY2VpdmVkISAqKioqKioqKlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cz1bXTsgLy8vLy9kaWZmZXJlbmNlKHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdlbmVyaWMgbWV0aG9kIGZvciBwcm9jZXNzaW5nIGFueSBldmVudCwgZXZlcnlcbiAgICBwcm9jZXNzRXZlbnQoZXZlbnQsZXZlbnREYXRhLGFja25vd2xlZGdlKXtcbiAgICAgICAgLy8gbG9nIGV2ZXJ5IGV2ZW50XG4gICAgICAgIHRoaXMubG9nRXZlbnQoZXZlbnQsZXZlbnREYXRhKTtcbiAgICAgICAgaWYoIWV2ZW50RGF0YSlyZXR1cm47XG4gICAgICAgIC8vIGlmIGRhdGEgaGFzIGFuIGlkIGl0IG5lZWRzIHRvIGJlIGFja25vd2xlZGdlZFxuICAgICAgICBsZXQgZXZlbnRJZD0oZXZlbnREYXRhLmhhc093blByb3BlcnR5KFwiaWRcIik/ZXZlbnREYXRhLmlkOm51bGwpO1xuICAgICAgICAvLyBpZiB0aGVyZSdzIGFuIGV2ZW50IGlkIGluIHRoaXMgZXZlbnQsIGFuZCB3ZSdyZSBzdXBwb3NlZCB0byBzZW5kIGFja25vd2xlZGdlbWVudHMsIGRvIHNvXG4gICAgICAgIGlmKGV2ZW50SWQpe1xuICAgICAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogbm93IHB1c2ggdGhlIGV2ZW50IG5hbWUgYXMgd2VsbCBzbyB0aGUgc2VydmVyIGNhbiBsb2cgdGhhdCBhbmQgd2UgY2FuIHNlZSB3aGF0J3MgYWNrbm93bGVnZGVkISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBCVVQgZG9uJ3QgcHVzaCBpdCBhZ2FpbiBpZiBpdCdzIGFscmVhZHkgdGhlcmUhISEhXG4gICAgICAgICAgICBpZihhY2tub3dsZWRnZSlcbiAgICAgICAgICAgICAgICBpZih0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGg9PT0wfHx0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50c1t0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGgtMV0uaWQhPT1ldmVudElkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5wdXNoKHsnaWQnOmV2ZW50SWQsJ2V2ZW50JzpldmVudH0pO1xuICAgICAgICAgICAgdGhpcy5hY2tub3dsZWRnZUV2ZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhPShldmVudElkP2V2ZW50RGF0YS5wYXlsb2FkOmV2ZW50RGF0YSk7XG4gICAgICAgIHN3aXRjaChldmVudCl7XG4gICAgICAgICAgICBjYXNlIFwiU1RBVEVDSEFOR0VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlPWRhdGEudG87XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRVwiOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBpbmZvcm1hdGlvbiByZWNlaXZlZCBieSAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJy5cIixkYXRhKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gc2V0IHRoZSBuYW1lIG9mIHRoZSBnYW1lIG5vd1xuICAgICAgICAgICAgICAgIHRoaXMubmFtZT1kYXRhO1xuICAgICAgICAgICAgICAgIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3BsYXllcnMnKSl0aGlzLnBsYXllck5hbWVzPWRhdGEucGxheWVycztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJTXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lcz1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkRFQUxFUlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYWxlcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRTXCI6XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5wYXJ0bmVyPWRhdGE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRV9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB0eXBpY2FsbHkgdGhlIGdhbWUgaW5mbyBjb250YWlucyBBTEwgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0aGUgZ2FtZSB0aGF0IGlzIGdvaW5nIHRvIGJlIHBsYXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBpLmUuIGFmdGVyIGJpZGRpbmcgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RydW1wU3VpdGU9ZGF0YS50cnVtcFN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9ZGF0YS5wYXJ0bmVyU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPWRhdGEucGFydG5lclJhbms7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9ZGF0YS5oaWdoZXN0QmlkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkZGVycz1kYXRhLmhpZ2hlc3RCaWRkZXJzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3VydGhBY2VQbGF5ZXI9ZGF0YS5mb3VydGhBY2VQbGF5ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX0JJRFwiOlxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiU3BlbGVyIDxiPlwiK2RhdGErXCI8L2I+IGlzIGFhbiBkZSBiZXVydC5cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJNQUtFX0FfQklEXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5tYWtlQUJpZChkYXRhLnBsYXllckJpZHNPYmplY3RzLGRhdGEucG9zc2libGVCaWRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19QTEFZXCI6XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiU3BlbGVyIDxiPlwiK2RhdGErXCI8L2I+IGlzIGFhbiBkZSBiZXVydC5cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBjb250YWluIHRoZSBjdXJyZW50IGNhcmRzIHRoZSB1c2VyIGhhc1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0sY3VycmVudFBsYXllcik7fSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYW5kIHRvIHdpblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLm51bWJlck9mVHJpY2tzV29uPWRhdGEubnVtYmVyT2ZUcmlja3NXb247XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gUExBWUVSX0lORk8gZG9lcyBub3QgbmVlZCB0byBzZW5kIHRoZSBmb2xsb3dpbmcgd2l0aCBlYWNoIFBMQVlFUl9JTkZPIFRIT1VHSFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YS5udW1iZXJPZlRyaWNrc1RvV2luKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTX1RPX1dJTlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJORVdfVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1RyaWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRfUExBWUVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDYXJkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlfQV9DQVJEXCI6XG4gICAgICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IE5PVCBhbnltb3JlXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX3RyaWNrKWFsZXJ0KFwiUHJvZ3JhbW1hZm91dDogVSB3b3JkdCBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QgaW4gZWVuIG9uZ2VkZWZpbmllZXJkZSBzbGFnIVwiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZCh0aGlzLl90cmljayk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0hPT1NFX1RSVU1QX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VUcnVtcFN1aXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VQYXJ0bmVyU3VpdGUoZGF0YS5zdWl0ZXMsZGF0YS5wYXJ0bmVyUmFua05hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLXCI6XG4gICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHRoaXMucGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHRyYWN0IHRoZSB0cmlja3MgZnJvbSB0aGUgYXJyYXkgb2YgdHJpY2tzIGluIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpY2tzPWRhdGEubWFwKCh0cmlja0luZm8pPT57cmV0dXJuIHRoaXMucGFyc2VUcmljayh0cmlja0luZm8pO30pO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUkVTVUxUU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPWRhdGEuZGVsdGFwb2ludHM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRU9WRVJcIjpcbiAgICAgICAgICAgICAgICAvLyBraWxsIHRoZSBnYW1lIGluc3RhbmNlIChyZXR1cm5pbmcgdG8gdGhlIHJ1bGVzIHBhZ2UgdW50aWwgYXNzaWduZWQgdG8gYSBnYW1lIGFnYWluKVxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIpY3VycmVudFBsYXllci5wbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsLTEpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuZXhpdChcImluIHJlc3BvbnNlIHRvICdcIitkYXRhK1wiJ1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkaXNjb25uZWN0XCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBldmVudCBcIitldmVudCtcIiByZWNlaXZlZCFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXBhcmluZyBmb3IgY29tbXVuaWNhdGlvblwiKTtcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5fc3RhdGU9SURMRTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSB1bmFja25vd2xlZGdlZEV2ZW50SWRzXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZGlzY29ubmVjdCcsKCk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnZGlzY29ubmVjdCcsbnVsbCx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdTVEFURUNIQU5HRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1NUQVRFQ0hBTkdFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlFUlMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0RFQUxFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0RFQUxFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQQVJUTkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVfSU5GTycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fQklEXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdNQUtFX0FfQklEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTUFLRV9BX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fUExBWVwiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUT19QTEFZJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBNREhAMTNKQU4yMDIwOiBwbGF5ZXIgaW5mbyB3aWxsIGJlIHJlY2VpdmVkIGJlZm9yZSBiZWluZyBhc2tlZCB0byBwbGF5IGEgY2FyZCB0byB1cGRhdGUgdGhlIHBsYXllciBkYXRhXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlBMQVlFUl9JTkZPXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUl9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLU19UT19XSU4nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1NfVE9fV0lOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ05FV19UUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ05FV19UUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEX1BMQVlFRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRfUExBWUVEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlfQV9DQVJEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWV9BX0NBUkQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1RSVU1QX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0hPT1NFX1RSVU1QX1NVSVRFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9QQVJUTkVSX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudChcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCIsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdSRVNVTFRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUkVTVUxUUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FT1ZFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVPVkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIG11bHRpcGxlIGV2ZW50cyBhcyBhIHdob2xlLCB3ZSBwcm9jZXNzIGFsbCBvZiB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdFVkVOVFMnLChldmVudHMpPT57XG4gICAgICAgICAgICAvLyB3ZSBjb3VsZCBjb25zdW1lIHRoZSBldmVudHMgSSBndWVzc1xuICAgICAgICAgICAgd2hpbGUoZXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICBldmVudD1ldmVudHMuc2hpZnQoKTsgLy8gcmVtb3ZlIHRoZSBmaXJzdCBldmVudFxuICAgICAgICAgICAgICAgIC8vIGFzY2VydGFpbiB0byBzZW5kIGFsbCB1bmFja25vd2xlZGdlZCBldmVudCBpZHMgd2hlbiB0aGlzIGlzIHRoZSBsYXN0IHByb2Nlc3MgZXZlbnQhISEhXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQuZXZlbnQsZXZlbnQuZGF0YSxldmVudHMubGVuZ3RoPT09MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1ESEAwOEpBTjIwMjA6IHNvY2tldCBzaG91bGQgcmVwcmVzZW50IGEgY29ubmVjdGVkIHNvY2tldC5pbyBpbnN0YW5jZSEhIVxuICAgIGNvbnN0cnVjdG9yKHNvY2tldCl7XG4gICAgICAgIC8vIE9PUFMgZGlkbid0IGxpa2UgZm9yZ2V0dGluZyB0aGlzISEhIFxuICAgICAgICAvLyBidXQgUGxheWVyR2FtZSBkb2VzIE5PVCBoYXZlIGFuIGV4cGxpY2l0IGNvbnN0cnVjdG9yIChpLmUuIG5vIHJlcXVpcmVkIGFyZ3VtZW50cylcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fdHJpY2tXaW5uZXI9bnVsbDtcbiAgICAgICAgdGhpcy5fc3RhdGU9UGxheWVyR2FtZS5PVVRfT0ZfT1JERVI7XG4gICAgICAgIHRoaXMuX3NvY2tldD1zb2NrZXQ7XG4gICAgICAgIHRoaXMuX2RlYWxlcj0tMTtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTsvL3RoaXMuX3RydW1wUGxheWVyPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7dGhpcy5fcGFydG5lclJhbms9LTE7XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzV29uPVswLDAsMCwwXTsgLy8gYXNzdW1lIG5vIHRyaWNrcyB3b24gYnkgYW55Ym9keVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD0wO3RoaXMuX3RyaWNrPW51bGw7XG4gICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9LTE7dGhpcy5faGlnaGVzdEJpZGRlcnM9W107IC8vIG5vIGhpZ2hlc3QgYmlkZGVycyB5ZXRcbiAgICAgICAgdGhpcy5fZGVsdGFQb2ludHM9bnVsbDtcbiAgICAgICAgdGhpcy5fcG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX2xhc3RUcmlja1BsYXllZD1udWxsO1xuICAgICAgICB0aGlzLl90ZWFtTmFtZXM9bnVsbDtcbiAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIHRoZSAnY3VycmVudCcgcGxheWVyXG4gICAgICAgIC8vIHRoaW5ncyB3ZSBjYW4gc3RvcmUgaW50ZXJuYWxseSB0aGF0IHdlIHJlY2VpdmUgb3ZlciB0aGUgY29ubmVjdGlvblxuICAgICAgICB0aGlzLl9uYW1lPW51bGw7IC8vIHRoZSBuYW1lIG9mIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPW51bGw7IC8vIHRoZSBuYW1lcyBvZiB0aGUgcGxheWVyc1xuICAgICAgICB0aGlzLl9wYXJ0bmVySW5kaWNlcz1udWxsOyAvLyB0aGUgcGFydG5lclxuICAgICAgICB0aGlzLnByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgaXRzZWxmIG9yZ2FuaXplZCBieSBzdGF0ZVxuICAgIC8vIFBMQVlJTkdcbiAgICBnZXRUcnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAvLyBnZXRUcnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwbGF5ZXJdO31cbiAgICBcbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpeyAvLyBvbmx5IHdoZW4gcGxheWVyIGVxdWFscyB0aGlzLl9wbGF5ZXJJbmRleCBkbyB3ZSBrbm93IHRoZSBwYXJ0bmVyXG4gICAgICAgIGxldCBwYXJ0bmVyPShwbGF5ZXI9PT10aGlzLl9wbGF5ZXJJbmRleD9jdXJyZW50UGxheWVyLnBhcnRuZXI6LTEpO1xuICAgICAgICByZXR1cm4ocGFydG5lcj49MCYmcGFydG5lcjx0aGlzLm51bWJlck9mUGxheWVycz90aGlzLl9wbGF5ZXJOYW1lc1twYXJ0bmVyXTpudWxsKTtcbiAgICB9XG5cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyczt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkO31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJdO31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXtyZXR1cm4gdGhpcy5fZGVsdGFQb2ludHM7fVxuICAgIGdldCBwb2ludHMoKXtyZXR1cm4gdGhpcy5fcG9pbnRzO31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXtyZXR1cm4gdGhpcy5fcGFydG5lcklkc1twbGF5ZXJdPT09b3RoZXJQbGF5ZXI7fVxuICAgIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7cmV0dXJuIHRoaXMuX2dldFRlYW1OYW1lc1twbGF5ZXJdO31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcjt9XG5cbn1cblxudmFyIHByZXBhcmVkRm9yUGxheWluZz1mYWxzZTtcblxuZnVuY3Rpb24gcHJlcGFyZUZvclBsYXlpbmcoKXtcblxuICAgIHByZXBhcmVkRm9yUGxheWluZz10cnVlO1xuXG4gICAgLy8gTURIQDEwSkFOMjAyMDogd2Ugd2FudCB0byBrbm93IHdoZW4gdGhlIHVzZXIgaXMgdHJ5aW5nIHRvIG1vdmUgYXdheSBmcm9tIHRoZSBwYWdlXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGhvdyBhYm91dCBwcm9tcHRpbmcgdGhlIHVzZXI/Pz8/P1xuICAgICAgICAvLyBpZighY3VycmVudFBsYXllcnx8IWN1cnJlbnRQbGF5ZXIuZ2FtZSlyZXR1cm47IC8vIGRvIG5vdCBhc2sgdGhlIHVzZXIgd2hldGhlciB0aGV5IHdhbnQgdG8gc3RheSBvciBub3QgKGFzIHRoZXkgY2Fubm90IHN0YXkpXG4gICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIHZpZXdpbmcgdGhlIHJlc3VsdHMgcGFnZSB3ZSBtYXkgYXNzdW1lIHRoYXQgdGhlIGdhbWUgaXMgYWN0dWFsbHkgb3ZlclxuICAgICAgICByZXR1cm4oY3VycmVudFBhZ2U9PT0ncGFnZS1yZXN1bHRzJz9cIkJlZGFua3Qgdm9vciBoZXQgc3BlbGVuLiBUb3QgZGUgdm9sZ2VuZGUga2VlciFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcIkhldCBzcGVsIGlzIG5vZyBuaWV0IHRlbiBlaW5kZS4gQmxpamYgb3AgZGUgcGFnaW5hIG9tIHRvY2ggdmVyZGVyIHRlIHNwZWxlbi5cIik7XG4gICAgfTtcbiAgICAvLyBpZiB3ZSBhY3R1YWxseSBlbmQgdXAgaW4gbGVhdmluZyB0aGlzIFVSTCwgd2UgZGVmaW5pdGVseSB3YW50IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBmb3IgZ29vZFxuICAgIHdpbmRvdy5vbnBvcHN0YXRlPWZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIuZ2FtZSYmY3VycmVudFBsYXllci5nYW1lLnN0YXRlIT09UGxheWVyR2FtZS5GSU5JU0hFRClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogUGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIGhhcyBzdG9wcGVkIHBsYXlpbmcgdGhlIGdhbWUgYW55IGZ1cnRoZXIsIGVmZmVjdGl2ZWx5IGNhbmNlbGluZyBpdC5cIik7XG4gICAgICAgICghY3VycmVudFBsYXllcnx8Y3VycmVudFBsYXllci5leGl0KCkpOyAvLyBhcHBhcmVudGx5IHRoZSBjdXJyZW50IHBsYXllciBzaG91bGQgZXhpdCEhISFcbiAgICAgICAgc2V0UGxheWVyTmFtZShudWxsLG51bGwpOyAvLyB3aXRob3V0IGNhbGxiYWNrIG5vIHBhZ2Ugc2hvdWxkIGJlIHNob3duIGFueW1vcmUuLi5cbiAgICB9XG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBoaWRlIHRoZSBiaWRkaW5nIGFuZCBwbGF5aW5nIGVsZW1lbnRzXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAvLyByZXBsYWNlZCBieSBiaWQtaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjtcbiAgICAvLyBETyBOT1QgRE8gVEhJUyBXSUxMIE9WRVJSVUxFIFBBUkVOVDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIE1ESEAxOUpBTjIwMjA6IFwiaGlkZGVuXCIgY2hhbmdlZCB0byBcInZpc2libGVcIiBhcyB3ZSBuZXZlciBoaWRlIHRoZSBjYXJkcyBvZiB0aGUgY3VycmVudCBwbGF5ZXJzXG4gICAgLy8gcmVwbGFjZWQgYnkgcGxheS1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBNREhAMTlKQU4yMDIwOiBhbmQgdmljZSB2ZXJzYVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItZ2FtZS1idXR0b24nKS5vbmNsaWNrPXNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIGZvcihsZXQgYmFja0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrJykpYmFja0J1dHRvbi5vbmNsaWNrPXJldHVyblRvUHJldmlvdXNQYWdlO1xuICAgIC8vIHNob3cgdGhlIHBhZ2UtcnVsZXMgcGFnZSB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIGhlbHBcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24ub25jbGljaz1zaG93SGVscDtcbiAgICAvLyBNREhAMTBKQU4yMDIwOiBFTkRcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzIGZvciBuZXh0LCBjYW5jZWwsIGFuZCBuZXdQbGF5ZXJzIGJ1dHRvbnNcbiAgICBmb3IobGV0IG5leHRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV4dCcpKW5leHRCdXR0b24ub25jbGljaz1uZXh0UGFnZTtcbiAgICBmb3IobGV0IGNhbmNlbEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwnKSljYW5jZWxCdXR0b24ub25jbGljaz1jYW5jZWxQYWdlO1xuICAgIFxuICAgIC8vIGxldCdzIGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIG92ZXIgd2hlbiBuZXctZ2FtZSBidXR0b25zIGFyZSBzaG93aW5nXG4gICAgLy8gd2UncmUgbm90IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24sIHdlJ2xsIGp1c3Qga2VlcCB1c2luZyB0aGUgc2FtZSBjb25uZWN0aW9uXG4gICAgZm9yKGxldCBuZXdHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXctZ2FtZVwiKSluZXdHYW1lQnV0dG9uLm9uY2xpY2s9bmV3R2FtZTtcbiAgICAvKlxuICAgIC8vIHdoZW5ldmVyIHdlIGhhdmUgbmV3IHBsYXllcihuYW1lKXNcbiAgICBmb3IobGV0IG5ld0dhbWVQbGF5ZXJzQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25ldy1nYW1lLXBsYXllcnMnKSluZXdHYW1lUGxheWVyc0J1dHRvbi5vbmNsaWNrPW5ld0dhbWVQbGF5ZXJzO1xuICAgIC8vIHdoZW5ldmVyIHRoZSBnYW1lIGlzIGNhbmNlbGVkXG4gICAgZm9yKGxldCBjYW5jZWxHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhbmNlbC1nYW1lJykpY2FuY2VsR2FtZUJ1dHRvbi5vbmNsaWNrPWNhbmNlbEdhbWU7XG4gICAgKi9cblxuICAgIC8vIGF0dGFjaCBhbiBvbmNsaWNrIGV2ZW50IGhhbmRsZXIgZm9yIGFsbCBiaWQgYnV0dG9uc1xuICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpYmlkQnV0dG9uLm9uY2xpY2s9YmlkQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBwcmVwYXJlIGZvciBzaG93aW5nL2hpZGluZyB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgYmlkZGVyXG4gICAgaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKTtcbiAgICAvLyByZXBsYWNpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS5vbmNsaWNrPXRvZ2dsZUJpZGRlckNhcmRzO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlciBmb3Igc2VsZWN0aW5nIGEgc3VpdGVcbiAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuYmlkLXRydW1wXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9dHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC1wYXJ0bmVyXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9cGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBtYWtlIHRoZSBzdWl0ZSBlbGVtZW50cyBvZiBhIHNwZWNpZmljIHR5cGUgc2hvdyB0aGUgcmlnaHQgdGV4dCEhISFcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8NDtzdWl0ZSsrKVxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuXCIrQ2FyZC5TVUlURV9OQU1FU1tzdWl0ZV0pKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24udmFsdWU9Q2FyZC5TVUlURV9DSEFSQUNURVJTW3N1aXRlXTtcblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGNoZWNrIGZvciBhIHVzZXIgbmFtZVxuICAgIHZhciB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgIGxldCBpbml0aWFsUGxheWVyTmFtZT0odXJsUGFyYW1zLmhhcyhcInBsYXllclwiKT91cmxQYXJhbXMuZ2V0KFwicGxheWVyXCIpLnRyaW0oKTpudWxsKTtcbiAgICBpZihpbml0aWFsUGxheWVyTmFtZSlzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLChlcnIpPT57fSk7XG5cbn07XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIsZXJyb3JjYWxsYmFjayl7XG4gICAgdmlzaXRlZFBhZ2VzPVtdOyAvLyBmb3JnZXQgdmlzaXRlZCBwYWdlc1xuICAgIGN1cnJlbnRQYWdlPW51bGw7IC8vIGFzY2VydGFpbiB0byBub3QgaGF2ZSBhIHBhZ2UgdG8gc3RvcmVcbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IHBsYXllciAoaWYgYW55KSwgYW5kIGluIGVmZmVjdCB3ZSdsbCBsb29zZSB0aGUgZ2FtZSBhcyB3ZWxsXG4gICAgaWYoY3VycmVudFBsYXllcil7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8obG9jYXRpb24ucHJvdG9jb2wrJy8vJytsb2NhdGlvbi5ob3N0KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0ZWQhISFcIik7XG4gICAgICAgICAgICAgICAgY2xpZW50c29ja2V0LmVtaXQoJ1BMQVlFUicscGxheWVyLm5hbWUpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXI9cGxheWVyO1xuICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5pbmRleD00O1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICAgICAgaWYoZXJyb3JjYWxsYmFjayl7ZXJyb3JjYWxsYmFjayhudWxsKTtzZXRQYWdlKFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIpO31cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6ICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLlwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywoZXJyKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0IGVycm9yOiBcIixlcnIpO1xuICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRyeSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgY2F0Y2hpbmcgd2hhdGV2ZXIgaGFwcGVucyB0aHJvdWdoIGV2ZW50c1xuICAgICAgICBjbGllbnRzb2NrZXQuY29ubmVjdCgvKihlcnIpPT57XG4gICAgICAgICAgICBkZWJ1Z2dlclxuICAgICAgICAgICAgaWYoIWVycil7XG4gICAgICAgICAgICAgICAgLy8gYnkgZGVmYXVsdCB1c2UgZXJyb3JjYWxsYmFjayB0byByZXR1cm4gYW55IGVycm9yIG9jY3VycmluZ1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvcmNhbGxiYWNrPT09J2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdlcnJvcicsZXJyb3JjYWxiYWNrKTtcbiAgICAgICAgICAgICAgICBlbHNlIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gdGhhdCBsb2dzIHRvIHRoZSBjb25zb2xlISFcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdlcnJvcicsKGVycik9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IEVSUk9SOiBTb21ldGhpbmcgd2VudCB3cm9uZyBpbiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiXFx0XCIrZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWl0dGluZyBwbGF5ZXIgbmFtZSAnXCIrcGxheWVyLm5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxwbGF5ZXIubmFtZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgLy8gcGx1ZyBpbiBhIGdhbWU/Pz8/P1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEZhaWxlZCB0byBjb25uZWN0IHRvIHRoZSByZW1vdGUgZ2FtZSBzZXJ2ZXJcIik7XG4gICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKGVycikpO1xuICAgICAgICB9Ki8pO1xuICAgIH1lbHNlXG4gICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpO1xufVxuXG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCB0aGUgKG5ldykgbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXIgd2hlbmV2ZXIgdGhlIHBsYXllciB3YW50cyB0byBwbGF5XG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCBudWxsIChvciBlbXB0eSkgcGxheWVyIG5hbWVcbi8vIHRvIG1ha2UgaXQgY2FsbGFibGUgZnJvbSBhbnl3aGVyZSB3ZSBhdHRhY2ggc2V0UGxheWVyTmFtZSB0byB3aW5kb3cgKGJlY2F1c2UgY2xpZW50LmpzIHdpbGwgYmUgYnJvd3NlcmlmaWVkISEhKVxuZnVuY3Rpb24gc2V0UGxheWVyTmFtZShwbGF5ZXJOYW1lLGVycm9yQ2FsbGJhY2spe1xuICAgIChwcmVwYXJlZEZvclBsYXlpbmd8fHByZXBhcmVGb3JQbGF5aW5nKCkpOyAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIG9uY2VcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiYhKHR5cGVvZiBwbGF5ZXJOYW1lPT09XCJzdHJpbmdcIikpXG4gICAgICAgIHJldHVybih0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobmV3IEVycm9yKFwiSW52YWxpZCBwbGF5ZXIgbmFtZS5cIikpKTtcbiAgICAvLyBpZiBwbGF5ZXJOYW1lIG1hdGNoZXMgdGhlIGN1cnJlbnQgcGxheWVyJ3MgbmFtZSwgbm90aGluZyB0byBkb1xuICAgIGlmKHBsYXllck5hbWUmJmN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIubmFtZT09PXBsYXllck5hbWUpXG4gICAgICAgICh0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCxlcnJvckNhbGxiYWNrKTtcbn1cblxud2luZG93Lm9ubG9hZD1wcmVwYXJlRm9yUGxheWluZztcblxuLy8gZXhwb3J0IHRoZSB0d28gZnVuY3Rpb24gdGhhdCB3ZSBhbGxvdyB0byBiZSBjYWxsZWQgZnJvbSB0aGUgb3V0c2lkZSEhIVxubW9kdWxlLmV4cG9ydHM9c2V0UGxheWVyTmFtZTsiXX0=
