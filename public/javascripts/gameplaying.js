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
        console.log('>>> Type: '+type+': '+card1.getTextRepresentation()+"(suite: "+card1.suite+")"+(result>0?' > ':(result<0?' < ':' = '))+card2.getTextRepresentation()+" (suite: "+card2.suite+")"+" (play: "+(playSuite>=0?SUITE_NAMES[playSuite]:"?")+", trump:"+((trumpSuite>=0?SUITE_NAMES[trumpSuite]:"?"))+")");
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

    containsCard(suite,rank){
        let card=this._cards.length;
        while(--card>=0&&(this._cards[card].suite!==suite||this._cards[card].rank!==rank));
        return(card>=0); // found if card is not negative
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
    cardPlayed(card){}
    trumpSuiteChosen(trumpSuite){}
    partnerSuiteChosen(partnerSuite){}
}

// MDH@07DEC2019: PlayerGame extends PlayerEventListener with game data exposed to player
//                which was earlier stored in each trick
class PlayerGame extends PlayerEventListener{
    static get BID_NAMES(){return ["pas","rik","rik (beter)","negen alleen","negen alleen (beter)","pico","tien alleen","tien alleen (beter)","11 alleen","11 alleen (beter)","misere","12 alleen","12 alleen (beter)","open misere","13 alleen","13 alleen (beter)","open misere met een praatje","troela","schoppen vrouw en laatste slag"];};
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
    static get BIDS_ALL_CAN_PLAY(){return [PlayerGame.BID_PICO,PlayerGame.BID_OPEN_MISERE,PlayerGame.BID_OPEN_MISERE_MET_EEN_PRAATJE];}; // trumpless games
    static get BIDS_WITH_PARTNER_IN_HEARTS(){return [PlayerGame.BID_RIK_BETER,PlayerGame.BID_TIEN_ALLEEN_BETER,PlayerGame.BID_ELF_ALLEEN_BETER,PlayerGame.BID_TWAALF_ALLEEN_BETER,PlayerGame.BID_DERTIEN_ALLEEN_BETER];}; // games with trump played with a partner
    static get BID_RANKS(){return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,0,-1];}; // how I played it (bid pass excluded (always rank 0))
    
    // each bid has a certain amount of points to receive when winning the game
    static get BID_POINTS(){return [0,1,1,2,2,4,3,3,4,4,5,5,5,6,10,2,2];}

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
        console.log("PLAYER >>> "+tolog);
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
        this.index=index;
        this.game=game;
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

    _cardPlayed(card){
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{eventListener.cardPlayed(card);});
        if(this._game)this._game.cardPlayed(card);
    }
    // TODO a bid setter will allow subclasses to pass a bid by setting the property
    _setCard(card){
        // technically checking whether the played card is valid should be done here, or BEFORE calling setCard
        this._cardPlayed(this._card=card);
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
const {CardHolder,HoldableCard}=require('./CardHolder.js');

class Trick extends CardHolder{

    // MDH@07DEC2019: game data moved over to PlayerGame instance (as passed to each player)
    //                canAskForPartnerCard blind now determined by the game (engine) itself

    // by passing in the trump player (i.e. the person that can ask for the partner card)
    constructor(firstPlayer,trumpSuite,partnerSuite,partnerRank,canAskForPartnerCard){ // replacing: trumpSuite,partnerSuite,partnerRank,trumpPlayer){
        super(); // using 4 fixed positions for the trick cards so we will know who played them!!!!
        console.log(">>> New trick can ask for partner card: "+canAskForPartnerCard+".");
        this._firstPlayer=firstPlayer;
        this._trumpSuite=trumpSuite; // for internal use to be able to determine the winner of a trick
        this._partnerSuite=partnerSuite;this._partnerRank=partnerRank; // need this when it's being asked to determine the winner
        this._canAskForPartnerCard=canAskForPartnerCard; // -1 blind, 0 not, 1 non-blind
        this._askingForPartnerCard=0; // the 'flag' set by the trump player when asking for the partner card in a trick
        this._playSuite=-1; // the suite of the trick (most of the time the suite of the first card)
        this._winnerCard=-1; // the card of the winner (note: NOT transformed to the actual player index yet)
        // let's keep track of the highest card
    }

    get firstPlayer(){return this._firstPlayer;}

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
        if(this._playSuite<0)this._playSuite=(this._askingForPartnerCard<0?this._partnerSuite:card.suite);
        // ASSERT this._playSuite now definitely non-negative, so
        this._canAskForPartnerCard=0; // use the right property bro'
        // update winner
        if(numberOfCardsNow>0){
            // MDH@09DEC2019: when asking for the partner card only the partner card can ever win (even if there's trump!!)
            //                but we need to know whether the partner card was already thrown
            //                SOLUTION: (NEAT) it's easiest to simply ignore trump is the partner card is being asked for!!!!!!
            if(Cards.WithPlayAndTrumpSuite(card,this._cards[this._winnerCard],this._playSuite,(this._askingForPartnerCard!=0?-1:this._trumpSuite))>0)
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

},{"./CardHolder.js":2}],5:[function(require,module,exports){
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

function forceFocus(){if(!document.hasFocus())alert('Your turn!');}

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
        for(let partnerSuiteElement of document.getElementsByClassName('partner-suite'))partnerSuiteElement.innerHTML=DUTCH_SUITE_NAMES[rikkenTheGame.getPartnerSuite()];
        for(let partnerRankElement of document.getElementsByClassName('partner-rank'))partnerRankElement.innerHTML=DUTCH_RANK_NAMES[rikkenTheGame.getPartnerRank()];
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
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" rikt in de "+DUTCH_SUITE_NAMES[trumpSuite];
                    gameInfo+=", en vraagt de "+DUTCH_SUITE_NAMES[partnerSuite]+" "+DUTCH_RANK_NAMES[partnerRank]+" mee.";    
                }else // without a partner
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" speelt "+PlayerGame.BID_NAMES[trumpSuite]+" met "+DUTCH_SUITE_NAMES[trumpSuite]+" als troef.";
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

    // a (remote) client needs to override all its actions
    // BUT we do not do that because all results go into PlayerGameProxy which will send the along!!!!

    // make a bid is called with 
    makeABid(playerBidsObjects,possibleBids){
        // debugger
        showGameState("Bied!"); // defined in info.js
        forceFocus();
        document.getElementById("wait-for-bid").style.visibility="hidden"; // show the bidding element
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
        showGameState("Troef kiezen");
        forceFocus();
        console.log("Possible trump suites:",suites);
        setPage("page-trump-choosing");
        document.getElementById("trump-suite-input").style.visibility="visible"; // ascertain to allow choosing the trump suite
        updateChooseTrumpSuiteCards(this._suiteCards);
        // iterate over the trump suite buttons
        for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
    }
    choosePartnerSuite(suites,partnerRank){ // partnerRankName changed to partnerRank (because Language should be used at the UI level only!)
        showGameState("Partner kiezen");
        forceFocus();
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
        showGameState("Speel!"); // defined in info.js
        forceFocus();
        document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
        document.getElementById("playing").style.visibility="visible"; // show the play element
        // currentPlayer=this; // remember the current player
        setInfo("Doe een bod.");
        // if this is a new trick update the tricks played table with the previous trick
        if(trick.numberOfCards==0)updateTricksPlayedTables();
        /* see showTrick()
        document.getElementById("can-ask-for-partner-card-blind").style.display=(trick.canAskForPartnerCardBlind?"block":"none");
        // always start unchecked...
        document.getElementById("ask-for-partner-card-blind").checked=false; // when clicked should generate 
        */
        document.getElementById("game-info").innerHTML=getGameInfo(); // update the game info (player specific)
        document.getElementById("card-player").innerHTML=this.name;
        document.getElementById("trick-playsuite").innerHTML=(trick.playSuite>=0?DUTCH_SUITE_NAMES[trick.playSuite].toLowerCase():"kaart");
        let numberOfTricksWon=this.getNumberOfTricksWon(); // also includes those won by the partner (automatically)
        // add the tricks won by the partner
        let partnerName=this._game.getPartnerName(this._index);
        // if(partner)numberOfTricksWon+=player.getNumberOfTricksWon();
        document.getElementById("tricks-won-so-far").innerHTML=String(numberOfTricksWon)+(partnerName?" (samen met "+partnerName+")":"");
        // show the number of tricks this player is supposed to win in total
        document.getElementById("tricks-to-win").innerHTML=getNumberOfTricksToWinText(this._numberOfTricksToWin,partnerName,this._game.getHighestBid());
        this._card=null; // get rid of any currently card
        console.log("ONLINE >>> Player '"+this.name+"' should play a card!");
        setInfo(this.name+", welke "+(trick.playSuite>=0?DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+" wil je "+(trick.numberOfCards>0?"bij":"")+"spelen?");
        updatePlayerSuiteCards(this._suiteCards=this._getSuiteCards()); // remember the suite cards!!!!
        // show the trick (remembered in the process for use in cardPlayed below) from the viewpoint of the current player
        showTrick(this._trick=trick); // MDH@11JAN2020: no need to pass the player index (as it is always the same)
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
    playsTheGameAtIndex(game,index){
        super.playsTheGameAtIndex(game,index);
        // TODO should we do this here??
        if(this._index>=0)setPage("page-wait-for-players");else setPage("page-rules");
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
    ////////if(playablecardCell.style.border="0px")return; // empty 'unclickable' cell
    currentPlayer._cardPlayedWithSuiteAndIndex(parseInt(playablecardCell.getAttribute("data-suite-id")),parseInt(playablecardCell.getAttribute("data-suite-index")));
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
                        setInfo("Wacht om de beurt op een verzoek tot het doen van een bod.");
                        break;
                    case "play-reporting":
                        break;
                    case "playing": // ????
                        setInfo("Wacht op het verzoek tot het opgeven van de troefkleur en/of de mee te vragen aas/heer.");
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

    getSendEvent(event,data){
        console.log("Sending event "+event+" with data "+JSON.stringify(data)+".");
        return [event,data];
    }

    // what the player will be calling when (s)he made a bid, played a card, choose trump or partner suite
    bidMade(bid){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('BID',bid)); // no need to send the player id I think... {'by':this._playerIndex,'bid':bid}));
        document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element again
        showGameState(null); // a bit crude to get rid of the Bieden page name though
        return true;
    }
    cardPlayed(card){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('CARD',[card.suite,card.rank])); // replacing: {'player':this._playerIndex,'card':[card.suite,card.rank]}));
        document.getElementById("playing").style.visibility="hidden"; // hide the bidding element again
        showGameState(null);
        return true;
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('TRUMPSUITE',trumpSuite)); // same here: {'player':this._playerIndex,'suite':trumpSuite}));
        showGameState(null);
        document.getElementById("trump-suite-input").style.visibility="hidden"; // ascertain to hide the trump suite input element
        return true;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('PARTNERSUITE',partnerSuite)); // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
        document.getElementById("partner-suite-input").style.visibility="hidden"; // ascertain to hide the partner suite input element
        showGameState(null);
        return true;
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

    parseTrick(trickInfo){
        let trick=new Trick();
    }
    prepareForCommunication(){
        console.log("Preparing for communication");
        // this._socket.on('connect',()=>{
        //     this._state=IDLE;
        // });
        this._socket.on('disconnect',()=>{
            this.logEvent('disconnect',null);
            this.state=PlayerGame.OUT_OF_ORDER;
        });
        // register to receive data on all custom events
        this._socket.on('STATECHANGE',(data)=>{
            this.logEvent('STATECHANGE',data);
            this.state=data.to;
        });
        // player events (in order of appearance)
        this._socket.on('GAME',(data)=>{
            this.logEvent('GAME',data);
            // console.log("Game information received by '"+currentPlayer.name+"'.",data);
            // we can set the name of the game now
            this.name=data;
            if(data.hasOwnProperty('players'))this.playerNames=data.players;
        });
        // when the remote game reaches the IDLE state (and the game is on!!!!)
        this._socket.on('PLAYERS',(data)=>{
            this.logEvent('PLAYERS',data);
            this.playerNames=data;
        });
        this._socket.on('DEALER',(data)=>{
            this.logEvent('DEALER',data);
            this._dealer=data;
        });
        this._socket.on('CARDS',(data)=>{
            this.logEvent('CARDS',data);
            // create holdable card from cardInfo passing in the current player as card holder
            currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
            data.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
            currentPlayer.renderCards();
        });
        this._socket.on('TRUMP',(data)=>{
            this.logEvent('TRUMP',data);
        });
        this._socket.on('PARTNER',(data)=>{
            this.logEvent('PARTNER',data);
        });
        this._socket.on('GAMEINFO',(data)=>{
            this.logEvent('GAMEINFO',data);
            // typically the game info contains ALL information pertaining the game that is going to be played
            // i.e. after bidding has finished
            this._trumpSuite=data.trumpSuite;
            this._partnerSuite=data.partnerSuite;
            this._partnerRank=data.partnerRank;
            this._highestBid=data.highestBid;
            this._highestBidders=data.highestBidders;
            this._trumpPlayer=data.trumpPlayer;
        });
        this._socket.on("TO_BID",(data)=>{
            this.logEvent('TO_BID',data);
            document.getElementById('to-bid').innerHTML=data;
        });
        this._socket.on('MAKE_A_BID',(data)=>{
            this.logEvent('MAKE_A_BID',data);
            currentPlayer.makeABid(data.playerBidsObjects,data.possibleBids);
        });
        this._socket.on("TO_PLAY",(data)=>{
            this.logEvent('TO_PLAY',data);
            document.getElementById('to-bid').innerHTML=data;
        });
        this._socket.on('PLAY_A_CARD',(data)=>{
            this.logEvent('PLAY_A_CARD',data);
            // we're receiving trick info in data
            currentPlayer.playACard(parseTrick(data));
        });
        this._socket.on('CHOOSE_TRUMP_SUITE',(data)=>{
            this.logEvent('CHOOSE_TRUMP_SUITE',data);
            currentPlayer.chooseTrumpSuite(data);
        });
        this._socket.on('CHOOSE_PARTNER_SUITE',(data)=>{
            this.logEvent("CHOOSE_PARTNER_SUITE",data);
            currentPlayer.choosePartnerSuite(data.suites,data.partnerRankName);
        });
        this._socket.on('TRICK',(data)=>{
            this.logEvent('TRICK',parseTrick(data));
            updateTricks(parseTrick())
        });
        this._socket.on('TRICKS',(data)=>{
            this.logEvent('TRICKS',data);
            // we can't just simply assign the tricks though
            this._tricks=[]; // should already be the case?????
            data.forEach((trickInfo)=>{this._tricks.push(this.parseTrick(trickInfo))});
            updateTricks();
        });
        this._socket.on('RESULTS',(data)=>{
            this.logEvent('RESULTS',data);
            this._deltaPoints=data.deltapoints;
        });
    }

    // MDH@08JAN2020: socket should represent a connected socket.io instance!!!
    constructor(socket){
        // OOPS didn't like forgetting this!!! 
        // but PlayerGame does NOT have an explicit constructor (i.e. no required arguments)
        super(); 
        this._state=PlayerGame.OUT_OF_ORDER;
        this._socket=socket;
        this._dealer=-1;
        this._trumpSuite=-1;this._trumpPlayer=-1;
        this._partnerSuite=-1;this._partnerRank=-1;
        this._numberOfTricksWon=[0,0,0,0]; // assume no tricks won by anybody
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
    getTrumpPlayer(){return this._trumpPlayer;}
    getNumberOfTricksWonByPlayer(player){return this._numberOfTricksWon[player];}
    getPartnerName(player){return this._partnerNames[player];}
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
        if(!currentPlayer||!currentPlayer.game)return; // do not ask the user whether they want to stay or not (as they cannot stay)
        // if the user is viewing the results page we may assume that the game is actually over
        return(currentPage==='page-results'?"Bedankt voor het spelen. Tot de volgende keer!"
                                           :"Het spel is nog niet ten einde. Blijf op de pagina om toch verder te spelen.");
    };
    // if we actually end up in leaving this URL, we definitely want to kill the connection to the server for good
    window.onpopstate=function(){
        if(currentPlayer&&currentPlayer.game&&currentPlayer.game.state!==PlayerGame.FINISHED)
            console.log("WARNING: Player '"+currentPlayer.name+"' has stopped playing the game any further, effectively canceling it.");
        setPlayerName(null,null); // without callback no page should be shown anymore...
    }

    // MDH@09JAN2020: hide the bidding and playing elements
    document.getElementById("bidding").style.visibility="hidden";
    // document.getElementById("wait-for-bid").style.visibility="visible";
    document.getElementById("playing").style.visibility="hidden";
    // document.getElementById("wait-for-play").style.visibility="visible";

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
    // clicking card 'buttons' (now cells in table), we can get rid of the button itself!!!
    for(let playablecardButton of document.querySelectorAll(".playable.card-text"))playablecardButton.onclick=playablecardButtonClicked;
    
    // make the suite elements of a specific type show the right text!!!!
    for(let suite=0;suite<4;suite++)
        for(let suiteButton of document.querySelectorAll(".suite."+Card.SUITE_NAMES[suite]))
            suiteButton.value=Card.SUITE_CHARACTERS[suite];

    // MDH@09JAN2020: check for a user name
    var urlParams = new URLSearchParams(window.location.search);
    let initialPlayerName=(urlParams.has("player")?urlParams.get("player").trim():null);
    setPlayerName(initialPlayerName,(err)=>{});

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
        let clientsocket=io('http://localhost:3000');
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGRlZmluaXRpb24gb2YgYSBwbGF5aW5nIENhcmRcbiAqL1xuY2xhc3MgQ2FyZHtcblxuICAgIHN0YXRpYyBnZXQgU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wiZGlhbW9uZFwiLFwiY2x1YlwiLFwiaGVhcnRcIixcInNwYWRlXCJdO31cbiAgICBzdGF0aWMgZ2V0IFJBTktfTkFNRVMoKXtyZXR1cm4gW1wiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcImphY2tcIixcInF1ZWVuXCIsXCJraW5nXCIsXCJhY2VcIl07fVxuICAgIC8vIHNob3J0aGFuZCAnY2hhcmFjdGVycycgZm9yIHRleHR1YWwgcmVwcmVzZW50YXRpb25cbiAgICAvLyBOT1QgV09SS0lORzogY29uc3QgQ0FSRF9TVUlURV9DSEFSQUNURVJTPVtTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjYpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MyksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY1KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjApXTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWydcXHUyNjY2JywnXFx1MjY2MycsJ1xcdTI2NjUnLCdcXHUyNjYwJ119OyAvLyBZRVMsIFdPUktJTkchISEhIVxuICAgIHN0YXRpYyBnZXQgU1VJVEVfRElBTU9ORCgpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBTVUlURV9DTFVCKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0hFQVJUKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX1NQQURFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQ0hBUkFDVEVSUygpe3JldHVybiBbJzInLCczJywnNCcsJzUnLCc2JywnNycsJzgnLCc5JywnMTAnLCdCJywnVicsJ0snLCdBJ107fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVFdPKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEhSRUUoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GT1VSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRklWRSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX1NJWCgpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBSQU5LX1NFVkVOKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRUlHSFQoKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19OSU5FKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfSkFDSygpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBSQU5LX1FVRUVOKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBSQU5LX0tJTkcoKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQUNFKCl7cmV0dXJuIDEyO307XG5cbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzKGNhcmQxLGNhcmQyKXtcbiAgICAgICAgbGV0IGRlbHRhU3VpdGU9Y2FyZDEuX2NhcmRTdWl0ZUluZGV4LWNhcmQyLl9jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgaWYoZGVsdGFTdWl0ZSE9MClyZXR1cm4gZGVsdGFTdWl0ZTtcbiAgICAgICAgcmV0dXJuIGNhcmQxLl9jYXJkTmFtZUluZGV4LWNhcmQyLl9jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICBcbiAgICAvLyBpbiBhIHRyaWNrIHRoZSBwbGF5IHN1aXRlIGRldGVybWluZXMgd2hhdCBjYXJkcyBhcmUgdG8gYmUgcGxheWVkLCB0aGUgdHJ1bXAgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IHRydW1wIGlzXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkMSxjYXJkMixwbGF5U3VpdGUsdHJ1bXBTdWl0ZSl7XG4gICAgICAgIC8vIG5vcm1hbGx5IHdpdGggYW55IHR3byByZWd1bGFyIGNhcmRzIHRoZXkgYXJlIG5ldmVyIGVxdWFsIGluIGEgdHJpY2tcbiAgICAgICAgLy8gY2FyZHMgdGhhdCBhcmUgbmVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlIGlzIGlycmVsZXZhbnRcbiAgICAgICAgbGV0IHJlc3VsdD0wO1xuICAgICAgICBsZXQgdHlwZT0nLSc7XG4gICAgICAgIC8vIDEuIGlmIGNhcmQxIGlzIHRydW1wLCBhbmQgY2FyZDIgaXMgbm90IG9yIGhhcyBhIGxvd2VyIHJhbmsgY2FyZDEgd2luc1xuICAgICAgICBpZihjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9dHJ1bXBTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQSc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIE5PVCB0cnVtcCBidXQgY2FyZDIgY291bGQgc3RpbGwgYmUgdHJ1bXBcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdCJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHRydW1wLCBzbyBjb3VsZCBiZSBwbGF5IHN1aXRlIG9yIG5vdC4uLlxuICAgICAgICBpZihjYXJkMS5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0MnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBub3QgcGxheSBzdWl0ZSwgYnV0IGNhcmQyIGNvdWxkIGJlXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdEJzt9XG4gICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gVHlwZTogJyt0eXBlKyc6ICcrY2FyZDEuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIoc3VpdGU6IFwiK2NhcmQxLnN1aXRlK1wiKVwiKyhyZXN1bHQ+MD8nID4gJzoocmVzdWx0PDA/JyA8ICc6JyA9ICcpKStjYXJkMi5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAoc3VpdGU6IFwiK2NhcmQyLnN1aXRlK1wiKVwiK1wiIChwbGF5OiBcIisocGxheVN1aXRlPj0wP1NVSVRFX05BTUVTW3BsYXlTdWl0ZV06XCI/XCIpK1wiLCB0cnVtcDpcIisoKHRydW1wU3VpdGU+PTA/U1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV06XCI/XCIpKStcIilcIik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgLy8gbGV0J3MgZmlyc3QgcmVjb21wdXRlIHRoZSBzdWl0ZSBvZiBib3RoIGNhcmRzIGFuZCBlbGV2YXRlIHRydW1wIGNhcmRzLCBhbmQgZGVldmFsdWF0ZSBub24gcGxheVN1aXRlIGNhcmRzXG4gICAgICAgIGxldCBjYXJkMVN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMS5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQxLnN1aXRlKSk7XG4gICAgICAgIGxldCBjYXJkMlN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQyLnN1aXRlKSk7XG4gICAgICAgIGlmKGNhcmQxU3VpdGU+PTB8fGNhcmQyU3VpdGU+PTApeyAvLyBhdCBsZWFzdCBvbmUgb2YgdGhlIGNhcmRzIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzdWl0ZXMgYXJlIHRoZSBzYW1lIHRoZSBoaWdoZXN0IHJhbmsgd2luc1xuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZTwwKXJldHVybiAtMTsgLy8gaWYgdGhlIGZpcnN0IGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgbG93ZXJcbiAgICAgICAgICAgIGlmKGNhcmQyU3VpdGU8MClyZXR1cm4gMTsgLy8gaWYgdGhlIHNlY29uZCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGhpZ2hlclxuICAgICAgICAgICAgLy8gQVNTRVJUIGJvdGggY2FyZHMgYXJlIGVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPT1jYXJkMlN1aXRlKXJldHVybiBjYXJkMS5yYW5rLWNhcmQyLnJhbms7XG4gICAgICAgICAgICAvLyBBU1NFUlQgb25lIGNhcmQgaXMgcGxheSBzdWl0ZSwgdGhlIG90aGVyIG11c3QgYmUgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIHJldHVybihjYXJkMVN1aXRlPT00PzE6LTEpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSwgYm90aCBjYXJkcyBhcmUgaXJyZWxldmFudCAoc2hvdWxkIGhhcHBlbiB0aG91Z2gpXG4gICAgICAgIHJldHVybiAwOyAvLyBjb25zaWRlcmVkIGVxdWFsIHRoYXQgaXMgaXJyZWxldmFudFxuICAgIH1cbiAgICBcbiAgICAvLyAvLyB5b3UnZCBoYXZlIHRvIHVzZSB0aGUgQXBwbGUgU3ltYm9scyBmb250XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaU8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KxPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgr48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CvTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4K7PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgro8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CuTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4K4PC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgrc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CtjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4K1PC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgrQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CszwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KyPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZozwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg5E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DnjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4OdPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg5s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DmjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OZPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg5g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DlzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OWPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg5U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DlDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4OTPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg5I8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmmPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DgTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OOPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg408L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DizwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OKPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg4k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DiDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OHPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg4Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DhTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OEPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg4M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DgjwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KhPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgq48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CrTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4KrPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgqo8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CqTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4KoPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgqc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CpjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4KlPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgqQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CozwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KiPC9saT5cbiAgICBzdGF0aWMgZ2V0IENBUkRfQVBQTEVfU1lNQk9MUygpe3JldHVybiBbXG4gICAgICAgIFsn8J+DgicsJ/Cfg4MnLCfwn4OEJywn8J+DhScsJ/Cfg4YnLCfwn4OHJywn8J+DiCcsJ/Cfg4knLCfwn4OKJywn8J+DiycsJ/Cfg40nLCfwn4OOJywn8J+DgSddLFxuICAgICAgICBbJ/Cfg5InLCfwn4OTJywn8J+DlCcsJ/Cfg5UnLCfwn4OWJywn8J+DlycsJ/Cfg5gnLCfwn4OZJywn8J+DmicsJ/Cfg5snLCfwn4OdJywn8J+DnicsJ/Cfg5EnXSxcbiAgICAgICAgWyfwn4KyJywn8J+CsycsJ/CfgrQnLCfwn4K1Jywn8J+CticsJ/CfgrcnLCfwn4K4Jywn8J+CuScsJ/CfgronLCfwn4K7Jywn8J+CvScsJ/Cfgr4nLCfwn4KxJ10sXG4gICAgICAgIFsn8J+CoicsJ/CfgqMnLCfwn4KkJywn8J+CpScsJ/CfgqYnLCfwn4KnJywn8J+CqCcsJ/CfgqknLCfwn4KqJywn8J+CqycsJ/Cfgq0nLCfwn4KuJywn8J+CoSddXG4gICAgXX07XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KXtcbiAgICAgICAgdGhpcy5fY2FyZFN1aXRlSW5kZXg9Y2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIHRoaXMuX2NhcmROYW1lSW5kZXg9Y2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIENhcmQuUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XStcIiBvZiBcIitDYXJkLlNVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcInNcIjtcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJhbmsoKXtyZXR1cm4gdGhpcy5fY2FyZE5hbWVJbmRleDt9XG4gICAgZ2V0IHN1aXRlKCl7cmV0dXJuIHRoaXMuX2NhcmRTdWl0ZUluZGV4O31cblxuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbigpe1xuICAgICAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc3ZnLWNhcmRzLnN2ZyB3ZSBjYW4gZG8gdGhlIGZvbGxvd2luZywgYnV0IGluIHRoYXQgY2FzZSB3ZSdkIG5lZWQgdG8ga25vdyB0aGUgbWFnbmlmaWNhdGlvbiBmYWN0b3IhISFcbiAgICAgICAgLy9yZXR1cm4gQ0FSRF9GT05UX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvL3JldHVybiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDY3NiA5NzZcIj48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ZnLWNhcmRzLnN2ZyMnK1NVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcIi1cIitSQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdKyc8L3VzZT48L3N2Zz4nO1xuICAgICAgICByZXR1cm4gQ2FyZC5DQVJEX0FQUExFX1NZTUJPTFNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvLy8vLy9yZXR1cm4gU1VJVEVfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0uY29uY2F0KFJBTktfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkTmFtZUluZGV4XSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPUNhcmQ7IiwiLyoqXG4gKiBkZWZpbmVzIHNvbWVvbmUgdGhhdCBob2xkcyBjYXJkc1xuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuXG5jbGFzcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2codG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNREhAMDRERUMyMDE5OiBhbGxvd2luZyBub3cgdG8gY29uc3RydWN0IGZpeGVkIHNpemUgY2FyZCBob2xkZXJzIChsaWtlIFRyaWNrKVxuICAgIGNvbnN0cnVjdG9yKG51bWJlck9mQ2FyZHM9MCl7XG4gICAgICAgIHRoaXMuX2NhcmRzPVtdO1xuICAgICAgICB0aGlzLl9udW1iZXJPZkNhcmRzPW51bWJlck9mQ2FyZHM7XG4gICAgICAgIHdoaWxlKC0tbnVtYmVyT2ZDYXJkcz49MCl0aGlzLl9jYXJkcy5wdXNoKG51bGwpO1xuICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kcyB0byBhZGp1c3QgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIF9yZW1vdmVDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmluZGV4T2YoY2FyZCk7XG4gICAgICAgIGlmKGNhcmRJbmRleD49MCl7XG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkcy5zcGxpY2UoY2FyZEluZGV4LDEpLmxlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK2NhcmQrXCIgcmVtb3ZlZCBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIuXCIpO1xuICAgICAgICAgICAgICAgIGNhcmQuX2hvbGRlcj1udWxsOyAvLyB3aGVuIHN1Y2Nlc3NmdWwgYXBwYXJlbnRseSBubyBsb25nZXIgYXZhaWxhYmxlISEhXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIgb2YgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIjogaXQgaXMgbm90IHByZXNlbnQuXCIpO1xuICAgIH1cbiAgICBfYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgaWYoIWNhcmQpcmV0dXJuO1xuICAgICAgICBpZighKGNhcmQgaW5zdGFuY2VvZiBIb2xkYWJsZUNhcmQpKXRocm93IG5ldyBFcnJvcihcIk5vdCBhIGhvbGRhYmxlIGNhcmQhXCIpO1xuICAgICAgICB0aGlzLmxvZyhcIkFkZGluZyBjYXJkIFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIHRoaXMuX2NhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz5udW1iZXJPZkNhcmRzTm93KXtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTsgLy8gY2FuIG5vIGxvbmdlciBndWFyYW50ZWUgdGhhdCBpdCBpcyBzb3J0ZWQuLi5cbiAgICAgICAgICAgIGNhcmQuX2hvbGRlcj10aGlzO1xuICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiAoXCIrY2FyZC50b1N0cmluZygpK1wiKSBhZGRlZCB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAgICAgLy8gaG93IGFib3V0IG9yZGVyaW5nIHRoZSBjYXJkcz8/Pz8/PyBvciBzdG9yaW5nIHRoZW0gYnkgc3VpdGU/Pz8/XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlxcdENhcmQgY29sbGVjdGlvbjogXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjYXJkIFwiK2NhcmQrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiIChkZWx0YSBudW1iZXIgb2YgY2FyZHM6IFwiKyh0aGlzLm51bWJlck9mQ2FyZHMtbnVtYmVyT2ZDYXJkc05vdykrXCIpLlwiKTtcbiAgICB9XG4gICAgLypcbiAgICAvLyByZXBsYWNlIGEgY2FyZCBhdCBhIGdpdmVuIGluZGV4IChhcyB1c2VkIGluIFRyaWNrKVxuICAgIF9zZXRDYXJkQXRJbmRleChjYXJkLGluZGV4KXtcbiAgICAgICAgaWYoaW5kZXg8MHx8aW5kZXg+PXRoaXMubnVtYmVyT2ZDYXJkcyl0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZXBsYWNlIGNhcmQgI1wiK1N0cmluZyhpbmRleCsxKStcIi5cIik7XG4gICAgICAgIGxldCBjYXJkQXRJbmRleD10aGlzLl9jYXJkc1tpbmRleF07XG4gICAgICAgIGlmKGNhcmRBdEluZGV4KXtjYXJkQXRJbmRleC5faG9sZGVyPW51bGw7dGhpcy5fY2FyZHNbaW5kZXhdPW51bGw7fVxuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIGlmICdjb250YWluZWQnIGluIGFub3RoZXIgY2FyZCBob2xkZXIgcmVtb3ZlIGl0IGZyb20gdGhlcmUhISFcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBpZihjYXJkLl9ob2xkZXIpY2FyZC5faG9sZGVyLnJlbW92ZUNhcmQoY2FyZCk7XG4gICAgICAgICAgICAgICAgaWYoIWNhcmQuX2hvbGRlcil7dGhpcy5fY2FyZHNbaW5kZXhdPWNhcmQ7Y2FyZC5faG9sZGVyPXRoaXM7fSAgICBcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7fVxuICAgICAgICB9XG4gICAgfVxuICAgICovXG4gICAgLy8gcG9sbCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgZ2V0IG51bWJlck9mQ2FyZHMoKXtyZXR1cm4gdGhpcy5fY2FyZHMubGVuZ3RoO31cblxuICAgIGdldENhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQucmFuaz09cmFuazt9KTtcbiAgICB9XG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHN1aXRlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5zdWl0ZT09c3VpdGU7fSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnRcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXMoKXtcbiAgICAgICAgLy8gY2FuJ3QgdXNlIHRoaXMgaW4gZmlsdGVyISEhIHJldHVybiBbMCwxLDIsM10uZmlsdGVyKChyYW5rKT0+e3JldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuayk+MDt9KTtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgY2FyZHMgaW4gdGhlIGhvbGRlciB3aXRoIHRoZSBnaXZlbiByYW5rXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggYWxsIHN1aXRlcywgd2l0aCAtMSB3aGVyZSBhIHN1aXRlIGlzIG5vdCBwcmVzZW50IGluIHRoZSBjdXJyZW50IGNhcmRzIFxuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRob3V0UmFuayhyYW5rKXtcbiAgICAgICAgbGV0IHN1aXRlcz1bMCwxLDIsM107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXNbY2FyZC5zdWl0ZV09LTE7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnQgb2Ygd2hpY2ggdGhlIHBsYXllciBkb2VzIG5vdCBoYXZlIHRoZSB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGdldFJhbmtsZXNzU3VpdGVzKHJhbmspe1xuICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZXM9W107XG4gICAgICAgIGxldCBzdWl0ZXNXaXRoUmFua3M9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goXG4gICAgICAgICAgICAoY2FyZCk9PntcbiAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDAmJnN1aXRlc1dpdGhSYW5rcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApe1xuICAgICAgICAgICAgICAgICAgICBpZihjYXJkLmNhcmROYW1lSW5kZXg9PXJhbmspe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VpdGVzV2l0aFJhbmtzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHN1aXRlIGlmIGFscmVhZHkgcHJlc2VudFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVJbmRleD1yYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZUluZGV4Pj0wKXJhbmtsZXNzU3VpdGVzLnNwbGljZShyYW5rbGVzc1N1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIC8vIHVudGlsIHByb3ZlbiBkaWZmZXJlbnRseVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFua2xlc3NTdWl0ZXMucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByYW5rbGVzc1N1aXRlcztcbiAgICB9XG5cbiAgICBnZXRGaXJzdENhcmQoKXtpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClyZXR1cm4gdGhpcy5fY2FyZHNbMF07fVxuXG4gICAgY29udGFpbnNDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZD49MCYmKHRoaXMuX2NhcmRzW2NhcmRdLnN1aXRlIT09c3VpdGV8fHRoaXMuX2NhcmRzW2NhcmRdLnJhbmshPT1yYW5rKSk7XG4gICAgICAgIHJldHVybihjYXJkPj0wKTsgLy8gZm91bmQgaWYgY2FyZCBpcyBub3QgbmVnYXRpdmVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYW4gZXhwb3NlIGEgdGV4dCByZXByZXNlbnRpb25cbiAgICAgKi9cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oc3VpdGVTZXBhcmF0b3Ipe1xuICAgICAgICB0aGlzLmxvZyhcIk51bWJlciBvZiBjYXJkcyB0byByZXByZXNlbnQ6IFwiK3RoaXMuX2NhcmRzLmxlbmd0aCtcIi5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCBzb3J0aW5nPz8/Pz8/Pz8gdGhhdCB3b3VsZCBiZSBuaWNlXG4gICAgICAgIGlmKHN1aXRlU2VwYXJhdG9yJiZ0eXBlb2Ygc3VpdGVTZXBhcmF0b3I9PT1cInN0cmluZ1wiJiYhdGhpcy5fc29ydGVkKXtcbiAgICAgICAgICAgIHRoaXMuX2NhcmRzLnNvcnQoY29tcGFyZUNhcmRzKTtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD10cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLl9zb3J0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMubWFwKChjYXJkKT0+e3JldHVybiBjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO30pLmpvaW4oXCIgXCIpO1xuICAgICAgICAvLyBjYXJkcyBhcmUgc3VwcG9zZWQgdG8gYmUgc29ydGVkXG4gICAgICAgIGxldCB0ZXh0UmVwcmVzZW50YXRpb249XCJcIjtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgbGV0IGNhcmQ9dGhpcy5nZXRGaXJzdENhcmQoKTtcbiAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbj1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MTtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKXtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPShjYXJkLnN1aXRlIT10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlP3N1aXRlU2VwYXJhdG9yOlwiIFwiKTtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0UmVwcmVzZW50YXRpb247IC8vIGEgc2luZ2xlIGJsYW5rIGJldHdlZW4gdGhlbSEhIVxuICAgIH1cblxufVxuXG4vKipcbiAqIGEgY2FyZCB3aXRoIGEgY2FyZCBob2xkZXIgaXMgaGVsZFxuICovXG5jbGFzcyBIb2xkYWJsZUNhcmQgZXh0ZW5kcyBDYXJke1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJIT0xEQUJMRUNBUkQgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG5cbiAgICBzZXQgaG9sZGVyKGhvbGRlcil7XG4gICAgICAgIHRoaXMubG9nKFwiQ2hhbmdpbmcgdGhlIGhvbGRlciBvZiBjYXJkIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBjdXJyZW50IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZih0aGlzLl9ob2xkZXIpdGhpcy5faG9sZGVyLl9yZW1vdmVDYXJkKHRoaXMpO1xuICAgICAgICAvLyBhZGQgKHdoZW4gc3VjY2Vzc2Z1bGx5IHJlbW92ZWQpIHRvIHRoZSBuZXcgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKCF0aGlzLl9ob2xkZXImJmhvbGRlcilob2xkZXIuX2FkZENhcmQodGhpcyk7ZWxzZSB0aGlzLmxvZyhcIkVSUk9SOiBVbmFibGUgdG8gY2hhbmdlIHRoZSBob2xkZXIhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgsaG9sZGVyKXtcbiAgICAgICAgc3VwZXIoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCk7XG4gICAgICAgIHRoaXMuX2hvbGRlcj1udWxsO1xuICAgICAgICB0aGlzLmhvbGRlcj1ob2xkZXI7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gXCJIb2xkYWJsZSBcIitzdXBlci50b1N0cmluZygpO31cblxufVxuXG5tb2R1bGUuZXhwb3J0cz17Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9OyIsIi8qKlxuICogYSBwbGFjZWhvbGRlciBmb3IgYSBwbGF5ZXJcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbi8qKlxuICogYSBQbGF5ZXIgY2FuIG1ha2UgYSBiaWQsIG9yIHBsYXkgYSBjYXJkLCBjaG9vc2UgYSB0cnVtcCBhbmQgcGFydG5lciBzdWl0ZVxuICovXG5jbGFzcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIGJpZE1hZGUoYmlkKXt9XG4gICAgY2FyZFBsYXllZChjYXJkKXt9XG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXt9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7fVxufVxuXG4vLyBNREhAMDdERUMyMDE5OiBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lciB3aXRoIGdhbWUgZGF0YSBleHBvc2VkIHRvIHBsYXllclxuLy8gICAgICAgICAgICAgICAgd2hpY2ggd2FzIGVhcmxpZXIgc3RvcmVkIGluIGVhY2ggdHJpY2tcbmNsYXNzIFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIHN0YXRpYyBnZXQgQklEX05BTUVTKCl7cmV0dXJuIFtcInBhc1wiLFwicmlrXCIsXCJyaWsgKGJldGVyKVwiLFwibmVnZW4gYWxsZWVuXCIsXCJuZWdlbiBhbGxlZW4gKGJldGVyKVwiLFwicGljb1wiLFwidGllbiBhbGxlZW5cIixcInRpZW4gYWxsZWVuIChiZXRlcilcIixcIjExIGFsbGVlblwiLFwiMTEgYWxsZWVuIChiZXRlcilcIixcIm1pc2VyZVwiLFwiMTIgYWxsZWVuXCIsXCIxMiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNlcmVcIixcIjEzIGFsbGVlblwiLFwiMTMgYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzZXJlIG1ldCBlZW4gcHJhYXRqZVwiLFwidHJvZWxhXCIsXCJzY2hvcHBlbiB2cm91dyBlbiBsYWF0c3RlIHNsYWdcIl07fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QQVMoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJSygpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBCSURfUklLX0JFVEVSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU4oKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTl9CRVRFUigpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBCSURfUElDTygpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU4oKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9NSVNFUkUoKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiAxMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFKCl7cmV0dXJuIDEzO307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU4oKXtyZXR1cm4gMTQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiAxNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRSgpe3JldHVybiAxNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RST0VMQSgpe3JldHVybiAxNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0xBQVRTVEVfU0xBR19FTl9TQ0hPUFBFTl9WUk9VVygpe3JldHVybiAxODt9O1xuICAgIHN0YXRpYyBnZXQgQklEU19BTExfQ0FOX1BMQVkoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1BJQ08sUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkUsUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFXTt9OyAvLyB0cnVtcGxlc3MgZ2FtZXNcbiAgICBzdGF0aWMgZ2V0IEJJRFNfV0lUSF9QQVJUTkVSX0lOX0hFQVJUUygpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUklLX0JFVEVSLFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0VMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUl07fTsgLy8gZ2FtZXMgd2l0aCB0cnVtcCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXJcbiAgICBzdGF0aWMgZ2V0IEJJRF9SQU5LUygpe3JldHVybiBbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMCwtMV07fTsgLy8gaG93IEkgcGxheWVkIGl0IChiaWQgcGFzcyBleGNsdWRlZCAoYWx3YXlzIHJhbmsgMCkpXG4gICAgXG4gICAgLy8gZWFjaCBiaWQgaGFzIGEgY2VydGFpbiBhbW91bnQgb2YgcG9pbnRzIHRvIHJlY2VpdmUgd2hlbiB3aW5uaW5nIHRoZSBnYW1lXG4gICAgc3RhdGljIGdldCBCSURfUE9JTlRTKCl7cmV0dXJuIFswLDEsMSwyLDIsNCwzLDMsNCw0LDUsNSw1LDYsMTAsMiwyXTt9XG5cbiAgICAvLyB0aGUgc3RhdGUgY29uc3RhbnRzIHdlIGhhdmVcbiAgICBzdGF0aWMgZ2V0IE9VVF9PRl9PUkRFUigpe3JldHVybiAwO31cbiAgICBzdGF0aWMgZ2V0IElETEUoKXtyZXR1cm4gMTt9XG4gICAgc3RhdGljIGdldCBERUFMSU5HKCl7cmV0dXJuIDI7fVxuICAgIHN0YXRpYyBnZXQgQklERElORygpe3JldHVybiAzO31cbiAgICBzdGF0aWMgZ2V0IFBMQVlJTkcoKXtyZXR1cm4gNDt9XG4gICAgc3RhdGljIGdldCBDQU5DRUxJTkcoKXtyZXR1cm4gNTt9XG4gICAgc3RhdGljIGdldCBGSU5JU0hFRCgpe3JldHVybiA2O31cbiAgICBnZXRUcnVtcFN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe31cbiAgICBnZXRUcnVtcFBsYXllcigpe31cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcil7fVxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7fVxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIGdldFBsYXllck5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7fVxuICAgIGdldCBwb2ludHMoKXt9XG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllcixvdGhlclBsYXllcil7fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe31cbiAgICBnZXRUcmlja0F0SW5kZXgodHJpY2tJbmRleCl7fSAvLyBnZXQgdGhlIGxhc3QgdHJpY2sgcGxheWVkXG4gICAgZ2V0VGVhbU5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGZvdXJ0aEFjZVBsYXllcigpe31cbn1cblxuY29uc3QgQ0hPSUNFX0lEUz1bXCJhXCIsXCJiXCIsXCJjXCIsXCJkXCIsXCJlXCIsXCJmXCIsXCJnXCIsXCJoXCIsXCJpXCIsXCJqXCIsXCJrXCIsXCJsXCIsXCJtXCJdO1xuXG5jb25zdCBQTEFZRVJUWVBFX0ZPTz0wLFBMQVlFUlRZUEVfVU5LTk9XTj0xLFBMQVlFUlRZUEVfRlJJRU5EPTI7XG5cbi8vIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBQbGF5ZXIgaW5zdGFuY2VzXG4vLyB3b3VsZCBiZSBkZWZpbmVkIGFic3RyYWN0IGluIGNsYXNzaWNhbCBPT1xuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUExBWUVSID4+PiBcIit0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIGFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXImJnBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMucHVzaChwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgZXZlbnQgbGlzdGVuZXJzOiBcIit0aGlzLl9ldmVudExpc3RlbmVycytcIi5cIik7XG4gICAgfVxuXG4gICAgLy8gd2hlbmV2ZXIgYSBnYW1lIGlzIHN0YXJ0ZWQsIGNhbGwgbmV3R2FtZSEhXG4gICAgbmV3R2FtZSgpe1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwfHwhdGhpcy5fZ2FtZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsYXllciBcIit0aGlzLm5hbWUrXCIgdW5hYmxlIHRvIHByZXBhcmUgZm9yIHBsYXlpbmc6IG5vdCBhc3NvY2lhdGVkIHdpdGggYSBnYW1lIHlldC5cIik7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCVUc6IFBsYXllciBcIit0aGlzLm5hbWUrXCIgc3RpbGwgaGFzIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiBjYXJkcy5cIik7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpOyAvLyBiZXR0ZXIgZG9uZSB0aGlzIHdheSBpbnN0ZWFkIG9mIHRoaXMuX2NhcmRzPVtdXG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVmYXVsdCBwbGF5ZXIgcmVtZW1iZXJpbmcgaXRzIGNob2ljZXNcbiAgICAgICAgdGhpcy5fYmlkPS0xOyAvLyB0aGUgbGFzdCBiaWQgb2YgdGhpcyBwbGF5ZXJcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7XG4gICAgICAgIC8vIHRoZSBnYW1lIGJlaW5nIHBsYXllZCwgYW5kIHRoZSBpbmRleCB3aXRoaW4gdGhhdCBnYW1lXG4gICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbj1bXTsgLy8gdGhlIHRyaWNrcyB3b24gKGluIGFueSBnYW1lKVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPS0xOyAvLyBkb2Vzbid0IG1hdHRlclxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG5hbWUscGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX25hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnM9W107XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICAgICAgaWYoIShwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcikpdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIGV2ZW50IGxpc3RlbmVyIG9mIHdyb25nIHR5cGUuXCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdhaXQgZm9yIHJlY2VpdmluZyBnYW1lIGFuZCBpbmRleFxuICAgICAgICB0aGlzLl9pbmRleD0tMTt0aGlzLl9nYW1lPW51bGw7IC8vIHdhaXRpbmcgZm9yIHRoZSBnYW1lIHRvIGJlIHBsdWdnZWQgaW4gKG9uY2UpXG4gICAgICAgIC8vIHJlbW92ZWQgd2FpdCB1bnRpbCBnZXR0aW5nIGNhbGxlZCB0aHJvdWdoIG5ld0dhbWU6IHRoaXMuX3ByZXBhcmVGb3JQbGF5aW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIC8vIGdldHRlcnMgZXhwb3NpbmcgaW5mb3JtYXRpb24gdG8gdGhlIG1hZGUgY2hvaWNlXG4gICAgLy8gTk9URSBubyBsb25nZXIgY2FsbGVkIGJ5IHRoZSBnYW1lIGJlY2F1c2UgdGhlIGNob2ljZSBpcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQgbm93XG4gICAgLy8gICAgICB0aGlzIHdheSBzdWJjbGFzc2VzIGFyZSBub3Qgb2JsaWdhdGVkIHRvIHJlbWVtYmVyIHRoZSBjaG9pY2VzIHRoZXkgbWFrZVxuICAgIGdldCBiaWQoKXtyZXR1cm4gdGhpcy5fYmlkO31cbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5jYXJkKCk7fVxuXG4gICAgZ2V0IHBhcnRuZXIoKXtyZXR1cm4gdGhpcy5fcGFydG5lcjt9XG5cbiAgICAvLy8vLy8vLy8vLy8vL2dldCBjYXJkKCl7cmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRQbGF5SW5kZXhdO31cblxuICAgIC8qIGNhbiBiZSBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIGdhbWVcbiAgICAvLyBjYW4gYmUgc2V0IGRpcmVjdGx5IHdoZW4gYSBiZXR0ZXIgJ3JpaycgdmFyaWF0aW9uIGJpZCB3YXMgZG9uZSEhISFcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBcbiAgICAvLyBUT0RPIGl0IHdvdWxkIGJlIGVhc2llciB0byBjb21iaW5lIHRoZXNlIGluIGEgY2FyZCEhISFcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cblxuICAgIC8vIGNhbGxlZCBmcm9tIHRoZSBVSSB0byBzZXQgdGhlIHRydW1wIHN1aXRlISEhIVxuICAgIHNldCB0cnVtcFN1aXRlKHRydW1wU3VpdGUpe3RoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTt0aGlzLnRydW1wU3VpdGVDaG9zZW4oKTt9XG4gICAgc2V0IHBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpe3RoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5wYXJ0bmVyU3VpdGVDaG9zZW4oKTt9XG4gICAgKi9cblxuICAgIC8vIGVuZCBvZiBnZXR0ZXJzL3NldHRlcnMgdXNlZCBieSB0aGUgZ2FtZVxuICAgIF9yZW1vdmVDYXJkcygpe3doaWxlKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXRoaXMuX2NhcmRzLnNoaWZ0KCkuaG9sZGVyPW51bGw7fVxuXG4gICAgZ2V0IGdhbWUoKXtyZXR1cm4gdGhpcy5fZ2FtZTt9XG4gICAgc2V0IGdhbWUoZ2FtZSl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWU9PT1nYW1lKXJldHVybjtcbiAgICAgICAgaWYoZ2FtZSYmIShnYW1lIGluc3RhbmNlb2YgUGxheWVyR2FtZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lIGluc3RhbmNlIHN1cHBsaWVkIHRvIHBsYXllciBcIisodGhpcy5uYW1lfHxcIj9cIikrXCIgbm90IG9mIHR5cGUgUGxheWVyR2FtZS5cIik7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb3NpdGlvbiBpbmRleCBvZiBwbGF5ZXIgXCIrKHRoaXMubmFtZXx8XCI/XCIpK1wiIHVua25vd24hXCIpO1xuICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpOyAvLyBNREhAMTFKQU4yMDIwOiBpZiB0aGUgZ2FtZSBjaGFuZ2VzIHdlIHNob3VsZCByZW1vdmUgdGhlIGNhcmRzXG4gICAgICAgIHRoaXMuX2dhbWU9Z2FtZTtcbiAgICAgICAgLy8gc3luYyBfaW5kZXhcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gICAgICAgICAgICB0aGlzLnBhcnRuZXI9LTE7IC8vIG15IHBhcnRuZXIgKG9uY2UgSSBub3cgd2hvIGl0IGlzKVxuICAgICAgICAgICAgdGhpcy50cmlja3NXb249W107IC8vIHN0b3JpbmcgdGhlIHRyaWNrcyB3b25cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBpbmRleChpbmRleCl7dGhpcy5faW5kZXg9aW5kZXg7fSAvLyBNREhAMDlKQU4yMDIwOiBzb21ldGltZXMgYW4gaW5kZXggY2FuIGJlIHNldCBzZXBhcmF0ZWx5XG5cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICB0aGlzLmluZGV4PWluZGV4O1xuICAgICAgICB0aGlzLmdhbWU9Z2FtZTtcbiAgICB9XG4gICAgLypcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBzdXBlci5hZGRDYXJkKGNhcmQpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcytcIicgcmVjZWl2ZWQgY2FyZCAnXCIrY2FyZCtcIicuXCIpO1xuICAgIH1cbiAgICAqL1xuICAgIF9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlLHdoZW5Ob3RGb3VuZENhcmQpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuKGNhcmQuc3VpdGU9PWNhcmRTdWl0ZSk7fSk7XG4gICAgfVxuXG4gICAgX2dldFN1aXRlQ2FyZHMoKXtcbiAgICAgICAgdGhpcy5sb2coXCJEZXRlcm1pbmluZyBzdWl0ZSBjYXJkcyBvZiBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMhXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkcz1bW10sW10sW10sW11dO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e3N1aXRlQ2FyZHNbY2FyZC5zdWl0ZV0ucHVzaChjYXJkKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlQ2FyZHM7XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIG9mIGEgZ2l2ZW4gY2FyZCBzdWl0ZSAob3IgYW55IGNhcmQgaWYgY2FyZFN1aXRlIGlzIHVuZGVmaW5lZClcbiAgICBjb250cmlidXRlVG9Ucmljayh0cmljaykge1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg9PTApdGhyb3cgbmV3IEVycm9yKFwiTm8gY2FyZHMgbGVmdCB0byBwbGF5IVwiKTtcbiAgICAgICAgbGV0IGNhcmRzT2ZTdWl0ZT10aGlzLl9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlKTtcbiAgICAgICAgbGV0IGNhcmQ9KGNhcmRzT2ZTdWl0ZSYmY2FyZHNPZlN1aXRlLmxlbmd0aD4wP2NhcmRzT2ZTdWl0ZVswXTp0aGlzLl9jYXJkc1swXSk7XG4gICAgICAgIGNhcmQuaG9sZGVyPXRyaWNrOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoZSB0cmlja1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgbWFkZSBhIGJpZFxuICAgIF9iaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKSAvLyBjYXRjaCBhbnkgZXJyb3IgdGhyb3duIGJ5IGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7KCFldmVudExpc3RlbmVyfHxldmVudExpc3RlbmVyLmJpZE1hZGUodGhpcy5fYmlkKSk7fWNhdGNoKGVycm9yKXt9fSk7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXNzaW5nIGJpZCBcIit0aGlzLl9iaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIHRvIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWUuYmlkTWFkZSh0aGlzLl9iaWQpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogTm8gZ2FtZSB0byBwYXNzIGJpZCBcIit0aGlzLl9iaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInLlwiKTtcbiAgICB9XG4gICAgX3NldEJpZChiaWQpe3RoaXMuX2JpZE1hZGUodGhpcy5fYmlkPWJpZCk7fVxuXG4gICAgX2NhcmRQbGF5ZWQoY2FyZCl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57ZXZlbnRMaXN0ZW5lci5jYXJkUGxheWVkKGNhcmQpO30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUuY2FyZFBsYXllZChjYXJkKTtcbiAgICB9XG4gICAgLy8gVE9ETyBhIGJpZCBzZXR0ZXIgd2lsbCBhbGxvdyBzdWJjbGFzc2VzIHRvIHBhc3MgYSBiaWQgYnkgc2V0dGluZyB0aGUgcHJvcGVydHlcbiAgICBfc2V0Q2FyZChjYXJkKXtcbiAgICAgICAgLy8gdGVjaG5pY2FsbHkgY2hlY2tpbmcgd2hldGhlciB0aGUgcGxheWVkIGNhcmQgaXMgdmFsaWQgc2hvdWxkIGJlIGRvbmUgaGVyZSwgb3IgQkVGT1JFIGNhbGxpbmcgc2V0Q2FyZFxuICAgICAgICB0aGlzLl9jYXJkUGxheWVkKHRoaXMuX2NhcmQ9Y2FyZCk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9vc2VuIGEgdHJ1bXAgc3VpdGVcbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICB9XG4gICAgX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZSk7fVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9zZW4gYSBwYXJ0bmVyXG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXRoaXMuX2dhbWUucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLnBhcnRuZXJTdWl0ZUNob3Nlbih0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlKTt9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gbWFrZSBhIGJpZCBwYXNzaW5nIGluIHRoZSBoaWdoZXN0IGJpZCBzbyBmYXJcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgbWFrZUFCaWQocGxheWVyYmlkcyl7XG4gICAgICAgIC8vIGFzc3VtZXMgdGhhdCB0aGlzIHBsYXllciBoYXMgbWFkZSBhIGJpZCBiZWZvcmUsIG9yIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgYmlkXG4gICAgICAgIC8vIHRoaXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRvIGJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIHNvIHdlIGNhbiB1c2UgcHJvbXB0KClcbiAgICAgICAgLy8gYWxsIG90aGVyIGF2YWlsYWJsZSBiaWRzIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiB0aGUgbGFzdCBiaWQgYnkgYW55IG90aGVyIHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZFNvRmFyPVBsYXllckdhbWUuQklEX1BBUztcbiAgICAgICAgaWYocGxheWVyYmlkcyl7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlBsYXllciBiaWRzOlwiLHBsYXllcmJpZHMpO1xuICAgICAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8cGxheWVyYmlkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICAgICAgaWYocGxheWVyYmlkc1twbGF5ZXJdLmxlbmd0aD4wJiZwbGF5ZXJiaWRzW3BsYXllcl1bMF0+aGlnaGVzdEJpZFNvRmFyKVxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0QmlkU29GYXI9cGxheWVyYmlkc1twbGF5ZXJdWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nKFwiSGlnaGVzdCBiaWQgc28gZmFyOiAnXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXStcIicuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgaGlnaGVzdCBwb3NzaWJsZSBiaWQgaXMgbm90IGEgYmlkIGFsbCBjYW4gcGxheSAoYXQgdGhlIHNhbWUgdGltZSksIGNhbid0IGJlIGJpZCBhZ2FpblxuICAgICAgICBpZihQbGF5ZXJHYW1lLkJJRFNfQUxMX0NBTl9QTEFZLmluZGV4T2YoUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXSk8MCloaWdoZXN0QmlkU29GYXIrKztcbiAgICAgICAgbGV0IHBvc3NpYmxlQmlkTmFtZXM9UGxheWVyR2FtZS5CSURfTkFNRVMuc2xpY2UoaGlnaGVzdEJpZFNvRmFyKTtcbiAgICAgICAgcG9zc2libGVCaWROYW1lcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW1BsYXllckdhbWUuQklEX1BBU10pOyAvLyB1c2VyIGNhbiBhbHdheXMgJ3BhcydcbiAgICAgICAgdGhpcy5sb2coXCJQb3NzaWJsZSBiaWRzOiBcIixwb3NzaWJsZUJpZE5hbWVzKTtcbiAgICAgICAgbGV0IGJpZD0tMTtcbiAgICAgICAgd2hpbGUoYmlkPDApe1xuICAgICAgICAgICAgbGV0IGJpZG5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IGlzIHlvdXIgYmlkIChvcHRpb25zOiAnXCIrcG9zc2libGVCaWROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlQmlkTmFtZXNbMF0pO1xuICAgICAgICAgICAgYmlkPVBsYXllckdhbWUuQklEX05BTUVTLmluZGV4T2YoYmlkbmFtZSk7XG4gICAgICAgICAgICBpZihiaWQ8MCljb250aW51ZTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRCaWQoYmlkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgYmlkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICAvLyBpZiB0aGlzIHBsYXllciBoYXMgYWxsIGFjZXMgaXQncyBnb25uYSBiZSB0aGUgc3VpdGUgb2YgYSBraW5nIHRoZSBwZXJzb24gaGFzbid0XG4gICAgICAgIC8vIGFsc28gaXQgbmVlZHMgdG8gYmUgYW4gYWNlIG9mIGEgc3VpdGUgdGhlIHVzZXIgaGFzIGl0c2VsZiAodW5sZXNzIHlvdSBoYXZlIGFsbCBvdGhlciBhY2VzKVxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICAvLyBhbnkgb2YgdGhlIHN1aXRlcyBpbiB0aGUgY2FyZHMgY2FuIGJlIHRoZSB0cnVtcCBzdWl0ZSFcbiAgICAgICAgbGV0IHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzPXRoaXMuZ2V0U3VpdGVzKCkubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPS0xO1xuICAgICAgICB3aGlsZSh0cnVtcFN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHRydW1wTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgc3VpdGUgd2lsbCBiZSB0cnVtcCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVUcnVtcFN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgdHJ1bXBTdWl0ZT1wb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5pbmRleE9mKHRydW1wTmFtZSk7XG4gICAgICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFza3MgZm9yIHRoZSBzdWl0ZSBvZiB0aGUgcGFydG5lciBjYXJkIG9mIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgY2hvb3NlUGFydG5lclN1aXRlKCl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclJhbms9UkFOS19BQ0U7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIGFjZWxlc3Mgc3VpdGVzXG4gICAgICAgIGxldCBzdWl0ZXM9dGhpcy5nZXRTdWl0ZXMoKTtcbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD09MCl7IC8vIHBsYXllciBoYXMgQUxMIGFjZXNcbiAgICAgICAgICAgIGlmKHN1aXRlcy5sZW5ndGg8NCl7IC8vIGJ1dCBub3QgYWxsIHN1aXRlc1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgc3VpdHMgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhcmUgYWxsb3dlZCAoYXNraW5nIHRoZSBhY2UgYmxpbmQhISEpXG4gICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPVswLDEsMiwzXS5maWx0ZXIoKHN1aXRlKT0+e3JldHVybiBwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZihzdWl0ZSk8MDt9KTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBoYXMgYWxsIHN1aXRzLCBzbyBhIGtpbmcgaXMgdG8gYmUgc2VsZWN0ZWQhISFcbiAgICAgICAgICAgICAgICAvLyBhbGwga2luZ3MgYWNjZXB0YWJsZSBleGNlcHQgZm9yIHRoYXQgaW4gdGhlIHRydW1wIGNvbG9yXG4gICAgICAgICAgICAgICAgLy8gTk9URSBpZiBhIHBlcnNvbiBhbHNvIGhhcyBhbGwgdGhlIGtpbmdzIHdlIGhhdmUgYSBzaXR1YXRpb24sIHdlIHNpbXBseSBjb250aW51ZSBvbndhcmRcbiAgICAgICAgICAgICAgICB3aGlsZSgxKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbmstLTtcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJ1bXBTdWl0ZUluZGV4PXBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHRoaXMuX3RydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0cnVtcFN1aXRlSW5kZXg+PTApcG9zc2libGVQYXJ0bmVyU3VpdGVzLnNwbGljZSh0cnVtcFN1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg+MClicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXM9cG9zc2libGVQYXJ0bmVyU3VpdGVzLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB3aGlsZShwYXJ0bmVyU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgXCIrQ2FyZC5DQVJEX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXStcIiBzaG91bGQgeW91ciBwYXJ0bmVyIGhhdmUgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICBwYXJ0bmVyU3VpdGU9cG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5pbmRleE9mKHBhcnRuZXJTdWl0ZU5hbWUpO1xuICAgICAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHBhcnRuZXIocGFydG5lcil7dGhpcy5fcGFydG5lcj1wYXJ0bmVyO30gLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBhbmQgYWRkIGl0IHRvIHRoZSBnaXZlbiB0cmlja1xuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBwbGF5QUNhcmQodHJpY2spe1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBhc2tlZCB0byBwbGF5IGEgY2FyZC5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCB1c2luZyB0aGUgZmlyc3QgbGV0dGVycyBvZiB0aGUgYWxwaGFiZXQ/XG4gICAgICAgIGxldCBwb3NzaWJsZUNhcmROYW1lcz1bXTtcbiAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MDtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKVxuICAgICAgICAgICAgcG9zc2libGVDYXJkTmFtZXMucHVzaChTdHJpbmcuY2FyZEluZGV4KzEpK1wiOiBcIit0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBsZXQgY2FyZFBsYXlJbmRleD0tMTtcbiAgICAgICAgd2hpbGUoY2FyZFBsYXlJbmRleDwwKXtcbiAgICAgICAgICAgIC8vIHdlJ3JlIHN1cHBvc2VkIHRvIHBsYXkgYSBjYXJkIHdpdGggc3VpdGUgZXF1YWwgdG8gdGhlIGZpcnN0IGNhcmQgdW5sZXNzIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgaXMgYmVpbmcgYXNrZWQgZm9yXG4gICAgICAgICAgICBsZXQgY2FyZElkPXBhcnNlSW50KHByb21wdChcIkBcIit0aGlzLm5hbWUrXCJcXG5QcmVzcyB0aGUgaWQgb2YgdGhlIGNhcmQgeW91IHdhbnQgdG8gYWRkIHRvIFwiK3RyaWNrLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChvcHRpb25zOiAnXCIrcG9zc2libGVDYXJkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixcIlwiKSk7XG4gICAgICAgICAgICBpZihpc05hTihjYXJkSWQpKWNvbnRpbnVlO1xuICAgICAgICAgICAgY2FyZFBsYXlJbmRleD1jYXJkSWQtMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDYXJkKHRoaXMuX2NhcmRzW2NhcmRQbGF5SW5kZXhdKTtcbiAgICB9XG5cbiAgICB0cmlja1dvbih0cmlja0luZGV4KXtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uLnB1c2godHJpY2tJbmRleCk7XG4gICAgICAgIHRoaXMubG9nKFwiVHJpY2sgI1wiK3RyaWNrSW5kZXgrXCIgd29uIGJ5ICdcIit0aGlzLm5hbWUrXCInOiBcIit0aGlzLl90cmlja3NXb24rXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlRyaWNrc1dvbigpe3JldHVybiB0aGlzLl90cmlja3NXb24ubGVuZ3RoO31cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyByZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiB0cmlja3Mgd29uIChpbmNsdWRpbmcgdGhvc2UgYnkgdGhlIHBhcnRuZXIgKGlmIGFueSkpXG4gICAgICAgIHJldHVybih0aGlzLm51bWJlck9mVHJpY2tzV29uK3RoaXMuX2dhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLnBhcnRuZXIpKTtcbiAgICB9XG5cbiAgICBzZXROdW1iZXJPZlRyaWNrc1RvV2luKG51bWJlck9mVHJpY2tzVG9XaW4pe3RoaXMuX251bWJlck9mVHJpY2tzVG9XaW49bnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzVG9XaW4oKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgXG4gICAgLy8gZXZlcnkgcGxheWVyIGNhbiBiZSBjaGVja2VkIHdoZXRoZXIgZnJpZW5kICgxKSBvciBmb28gKC0xKSBvciB1bmtub3duICgwKVxuICAgIGlzRnJpZW5kbHkocGxheWVyKXtcbiAgICAgICAgaWYocGxheWVyPT09dGhpcy5faW5kZXgpcmV0dXJuIDI7IC8vIEknbSBtdWNobyBmcmllbmRseSB0byBteXNlbGZcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApeyAvLyBhIG5vbi1zb2xpdGFyeSBnYW1lXG4gICAgICAgICAgICAvLyBBU1NFUlQgbm90IGEgc29saXRhcnkgZ2FtZSBzbyBwbGF5ZXIgY291bGQgYmUgdGhlIHBhcnRuZXIgaW4gY3JpbWVcbiAgICAgICAgICAgIC8vIGlmIHBhcnRuZXIgaXMga25vd24gKGkuZS4gdGhlIHBhcnRuZXIgY2FyZCBpcyBubyBsb25nZXIgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyPj0wKXJldHVybihwbGF5ZXI9PT10aGlzLl9wYXJ0bmVyPzE6LTEpOyBcbiAgICAgICAgICAgIC8vIEFTU0VSVCBwYXJ0bmVyIHVua25vd24gKGkuZS4gcGFydG5lciBjYXJkIHN0aWxsIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgbGV0IHRydW1wUGxheWVyPXRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKTtcbiAgICAgICAgICAgIC8vIGlmIEknbSB0aGUgdHJ1bXAgcGxheWVyLCBhc3N1bWUgQUxMIHVuZnJpZW5kbHkgQlVUIG5vIEkgZG9uJ3Qga25vdyB3aG8gbXkgcGFydG5lciBpcyBhbGwgY291bGQgYmVcbiAgICAgICAgICAgIGlmKHRoaXMuX2luZGV4PT09dHJ1bXBQbGF5ZXIpcmV0dXJuIDA7IC8vIHVua25vd25cbiAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSx0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCkpKSAvLyBJIGhhdmUgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PXRydW1wUGxheWVyPzE6LTEpOyAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZyaWVuZGx5LCB0aGUgb3RoZXJzIGFyZSB1bmZyaWVuZGx5XG4gICAgICAgICAgICAvLyBBU1NFUlQgSSdtIG5vdCB0aGUgdHJ1bXAgcGxheWVyLCBhbmQgSSdtIG5vdCB3aXRoIHRoZSB0cnVtcCBwbGF5ZXIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmb28sIHRoZSByZXN0IEkgZG9uJ3Qga25vdyB5ZXRcbiAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PT10cnVtcFBsYXllcj8tMTowKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgYSBzb2xpdGFyeSBnYW1lXG4gICAgICAgIC8vIGlmIEknbSBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnMsIGV2ZXJ5b25lIGVsc2UgaXMgYSBmb29cbiAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YodGhpcy5faW5kZXgpPj0wKXJldHVybiAtMTtcbiAgICAgICAgLy8gQVNTRVJUIG5vdCBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnNcbiAgICAgICAgLy8gICAgICAgIGlmIHBsYXllciBpcyBhIHNvbGl0YXJ5IHBsYXllciBpdCdzIGEgZm9vLCBvdGhlcndpc2UgaXQncyB1cyBhZ2FpbnN0IHRoZW0hISEhXG4gICAgICAgIHJldHVybih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZihwbGF5ZXIpPj0wPy0xOjEpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIHRoaXMubmFtZTt9XG5cbn1cblxuLy8gZXhwb3J0IHRoZSBQbGF5ZXIgY2xhc3Ncbm1vZHVsZS5leHBvcnRzPXtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfTsiLCJjb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG5jbGFzcyBUcmljayBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICAvLyBNREhAMDdERUMyMDE5OiBnYW1lIGRhdGEgbW92ZWQgb3ZlciB0byBQbGF5ZXJHYW1lIGluc3RhbmNlIChhcyBwYXNzZWQgdG8gZWFjaCBwbGF5ZXIpXG4gICAgLy8gICAgICAgICAgICAgICAgY2FuQXNrRm9yUGFydG5lckNhcmQgYmxpbmQgbm93IGRldGVybWluZWQgYnkgdGhlIGdhbWUgKGVuZ2luZSkgaXRzZWxmXG5cbiAgICAvLyBieSBwYXNzaW5nIGluIHRoZSB0cnVtcCBwbGF5ZXIgKGkuZS4gdGhlIHBlcnNvbiB0aGF0IGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgY29uc3RydWN0b3IoZmlyc3RQbGF5ZXIsdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssY2FuQXNrRm9yUGFydG5lckNhcmQpeyAvLyByZXBsYWNpbmc6IHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLHRydW1wUGxheWVyKXtcbiAgICAgICAgc3VwZXIoKTsgLy8gdXNpbmcgNCBmaXhlZCBwb3NpdGlvbnMgZm9yIHRoZSB0cmljayBjYXJkcyBzbyB3ZSB3aWxsIGtub3cgd2hvIHBsYXllZCB0aGVtISEhIVxuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgY2FuIGFzayBmb3IgcGFydG5lciBjYXJkOiBcIitjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyPWZpcnN0UGxheWVyO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7IC8vIGZvciBpbnRlcm5hbCB1c2UgdG8gYmUgYWJsZSB0byBkZXRlcm1pbmUgdGhlIHdpbm5lciBvZiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5fcGFydG5lclJhbms9cGFydG5lclJhbms7IC8vIG5lZWQgdGhpcyB3aGVuIGl0J3MgYmVpbmcgYXNrZWQgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXJcbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9Y2FuQXNrRm9yUGFydG5lckNhcmQ7IC8vIC0xIGJsaW5kLCAwIG5vdCwgMSBub24tYmxpbmRcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gdGhlICdmbGFnJyBzZXQgYnkgdGhlIHRydW1wIHBsYXllciB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0tMTsgLy8gdGhlIHN1aXRlIG9mIHRoZSB0cmljayAobW9zdCBvZiB0aGUgdGltZSB0aGUgc3VpdGUgb2YgdGhlIGZpcnN0IGNhcmQpXG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9LTE7IC8vIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgKG5vdGU6IE5PVCB0cmFuc2Zvcm1lZCB0byB0aGUgYWN0dWFsIHBsYXllciBpbmRleCB5ZXQpXG4gICAgICAgIC8vIGxldCdzIGtlZXAgdHJhY2sgb2YgdGhlIGhpZ2hlc3QgY2FyZFxuICAgIH1cblxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICAvLyB0aGUgd2lubmVyIGV4cG9zZWQgaXMgdGhlIGFjdHVhbCBwbGF5ZXIgd2hvIHdvblxuICAgIGdldCB3aW5uZXIoKXtyZXR1cm4odGhpcy5fd2lubmVyQ2FyZDwwPy0xOih0aGlzLl93aW5uZXJDYXJkK3RoaXMuX2ZpcnN0UGxheWVyKSU0KTt9XG4gICAgXG4gICAgLy8gTURIQDA3REVDMjAxOTogbW92ZWQgZnJvbSBoZXJlIHRvIHRoZSBnYW1lIChhcyBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gICAgLypcbiAgICBnZXQgdHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fSAvLyBleHBvc2VzIHRoZSBjdXJyZW50IHRydW1wIHBsYXllclxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgICovXG4gICAgZ2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkO31cbiAgICAvLyBwYXNzIGluIC0xIHdoZW4gYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQsIG9yICsxIHdoZW4gYXNraW5nIGZvciBpdCAobm9uLWJsaW5kKVxuICAgIHNldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZChhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLm51bWJlck9mQ2FyZHM+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9wZ2V2ZW4gZGUgcGFydG5lciBhYXMvaGVlciAoYmxpbmQpIHRlIHZyYWdlbiBuaWV0IG1lZXIgdG9lZ2VzdGFhbi5cIik7XG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPWFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFza2luZyBmb3IgcGFydG5lciBjYXJkIHNldCB0byBcIit0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgX3NldFdpbm5lckNhcmQod2lubmVyQ2FyZCl7XG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9d2lubmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayB3aW5uZXIgY2FyZDogXCIrd2lubmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgY2FyZCBwbGF5ZWQgYnkgKHRoZSBhY3R1YWwpIHBsYXllciAoYXMgdXNlZCBmb3Igc2hvd2luZyB0aGUgdHJpY2sgY2FyZHMpXG4gICAgICogQHBhcmFtIHsqfSBwbGF5ZXIgXG4gICAgICovXG4gICAgZ2V0UGxheWVyQ2FyZChwbGF5ZXIpe1xuICAgICAgICBsZXQgcGxheWVyQ2FyZD0odGhpcy5fZmlyc3RQbGF5ZXI+PTA/KHBsYXllcis0LXRoaXMuX2ZpcnN0UGxheWVyKSU0Om51bGwpO1xuICAgICAgICByZXR1cm4ocGxheWVyQ2FyZD49MCYmcGxheWVyQ2FyZDx0aGlzLm51bWJlck9mQ2FyZHM/dGhpcy5fY2FyZHNbcGxheWVyQ2FyZF06bnVsbCk7XG4gICAgfVxuXG4gICAgLypcbiAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgdGhlIGZpcnN0IHBsYXllciBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgaWYoIXRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIChhbnltb3JlKS5cIik7XG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT10aGlzLl90cnVtcFN1aXRlOyAvLyB0aGUgcGxheSBzdWl0ZSBiZWNvbWVzIHRoZSB0cnVtcCBzdWl0ZVxuICAgIH1cbiAgICAqL1xuICAgIC8vIE5PVEUgYWRkQ2FyZCBpcyBOT1QgX2FkZENhcmQgb2YgdGhlIHN1cGVyY2xhc3MhIHRoaXMgaXMgYmVjYXVzZSB3ZSBzaG91bGQgc2V0IHRoZSBob2xkZXIgb24gdGhlIGNhcmQgdG8gYWRkISEhIVxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgIC8vIGlmIHRoZSBmbGFnIG9mIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBpcyBzZXQsIHByZXNldCB0aGUgXG4gICAgICAgIGNhcmQuaG9sZGVyPXRoaXM7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhpcyB0cmljayBieSBzZXR0aW5nIHRoZSBob2xkZXIgcHJvcGVydHkgKHdpbGwgdGFrZSBjYXJlIG9mIGFkZGluZy9yZW1vdmluZyB0aGUgY2FyZClcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPD1udW1iZXJPZkNhcmRzTm93KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGFkZCB0aGUgY2FyZCB0byB0aGUgdHJpY2suXCIpO1xuICAgICAgICAvLyBBU1NFUlQgY2FyZCBhZGRlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMuX3RydW1wU3VpdGU8MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJVRzogQXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkLCBidXQgcGxheWluZyBhIGdhbWUgd2l0aG91dCB0cnVtcC5cIik7XG4gICAgICAgIC8vIGlmIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yIGJsaW5kIGV2ZXJ5b25lIGhhcyB0byBwbGF5IHRoZSBwYXJ0bmVyIGNhcmQgc3VpdGVcbiAgICAgICAgLy8gTURIQDA5REVDMjAxOTogT09QUyBJIHdhcyBhbHJlYWR5IHVzaW5nIHRoaXMuX3BhcnRuZXJTdWl0ZSBoZXJlIEJVVCBzdGlsbCBhZnRlciBhY3R1YWxseSB0YWtpbmcgaXQgb3V0IChub3cgaW4gYWdhaW4pXG4gICAgICAgIGlmKHRoaXMuX3BsYXlTdWl0ZTwwKXRoaXMuX3BsYXlTdWl0ZT0odGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MD90aGlzLl9wYXJ0bmVyU3VpdGU6Y2FyZC5zdWl0ZSk7XG4gICAgICAgIC8vIEFTU0VSVCB0aGlzLl9wbGF5U3VpdGUgbm93IGRlZmluaXRlbHkgbm9uLW5lZ2F0aXZlLCBzb1xuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB1c2UgdGhlIHJpZ2h0IHByb3BlcnR5IGJybydcbiAgICAgICAgLy8gdXBkYXRlIHdpbm5lclxuICAgICAgICBpZihudW1iZXJPZkNhcmRzTm93PjApe1xuICAgICAgICAgICAgLy8gTURIQDA5REVDMjAxOTogd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgb25seSB0aGUgcGFydG5lciBjYXJkIGNhbiBldmVyIHdpbiAoZXZlbiBpZiB0aGVyZSdzIHRydW1wISEpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBidXQgd2UgbmVlZCB0byBrbm93IHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCB3YXMgYWxyZWFkeSB0aHJvd25cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIFNPTFVUSU9OOiAoTkVBVCkgaXQncyBlYXNpZXN0IHRvIHNpbXBseSBpZ25vcmUgdHJ1bXAgaXMgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IhISEhISFcbiAgICAgICAgICAgIGlmKENhcmRzLldpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkLHRoaXMuX2NhcmRzW3RoaXMuX3dpbm5lckNhcmRdLHRoaXMuX3BsYXlTdWl0ZSwodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPTA/LTE6dGhpcy5fdHJ1bXBTdWl0ZSkpPjApXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZChudW1iZXJPZkNhcmRzTm93KTtcbiAgICAgICAgfWVsc2UgLy8gYWZ0ZXIgdGhlIGZpcnN0IGNhcmQgdGhlIGZpcnN0IHBsYXllciBpcyB0aGUgd2lubmVyIG9mIGNvdXJzZVxuICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZCgwKTtcbiAgICB9XG4gICAgZ2V0Q2FyZFBsYXllcihzdWl0ZSxyYW5rKXtcbiAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8dGhpcy5fY2FyZHMubGVuZ3RoO3BsYXllcisrKVxuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHNbcGxheWVyXS5zdWl0ZT09PXN1aXRlJiZ0aGlzLl9jYXJkc1twbGF5ZXJdLnJhbms9PT1yYW5rKVxuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmlyc3RQbGF5ZXIrcGxheWVyKSU0OyAvLyBUT0RPIGNhbiB3ZSBhc3N1bWUgNCBwbGF5ZXJzIGluIHRvdGFsPz8/Pz9cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8vIHB1YmxpYyBnZXR0ZXJzXG4gICAgZ2V0IHBsYXlTdWl0ZSgpe3JldHVybiB0aGlzLl9wbGF5U3VpdGU7fVxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICAvKlxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgICovXG4gICAgZ2V0IGNhbkFza0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkO31cbn1cblxubW9kdWxlLmV4cG9ydHM9VHJpY2s7XG4iLCIvKipcbiAqIHRoZSBwYXJ0IHRoYXQgcnVucyBpbiB0aGUgYnJvd3NlciBvZiBhIHNpbmdsZSBwbGF5ZXJcbiAqIGdpdmVuIHRoYXQgYW55IGluZm9ybWF0aW9uIHRvIHRoZSBjdXJyZW50IHBsYXllciBvZiB0aGUgZ2FtZSBzaG91bGQgYmUgYXZhaWxhYmxlIHRocm91Z2ggaXQncyBfZ2FtZSBwcm9wZXJ0eSAoaS5lLiBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gKiBhbGwgY2FsbHMgaW4gbWFpbi5qcyB0byByaWtrZW5UaGVHYW1lIGRpcmVjdGx5IHNob3VsZCBiZSByZXBsYWNlZCB3aXRoIGNhbGxzIHRvIGN1cnJlbnRQbGF5ZXIuZ2FtZSBpLmUuIHJpa2tlblRoZUdhbWUgaXRzZWxmIGlzIG5vIGxvbmdlciBhdmFpbGFibGUgdG8gdGhlIGN1cnJlbnRQbGF5ZXIhISFcbiAqIFxuKiovXG4vLyB3ZSdsbCBiZSB1c2luZyBQbGF5ZXIuanMgb25seSAoUGxheWVyLmpzIHdpbGwgZGVhbCB3aXRoIHJlcXVpcmluZyBDYXJkSG9sZGVyLCBhbmQgQ2FyZEhvbGRlciBDYXJkKVxuLy8gTk8gSSBuZWVkIHRvIHJlcXVpcmUgdGhlbSBhbGwgb3RoZXJ3aXNlIGJyb3dzZXJpZnkgd29uJ3QgYmUgYWJsZSB0byBmaW5kIENhcmQsIGV0Yy5cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuY29uc3QgVHJpY2s9cmVxdWlyZSgnLi9Ucmljay5qcycpOyAvLyBub3cgaW4gc2VwYXJhdGUgZmlsZVxuY29uc3Qge1BsYXllckV2ZW50TGlzdGVuZXIsUGxheWVyR2FtZSxQbGF5ZXJ9PXJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XG5cbmNsYXNzIExhbmd1YWdle1xuICAgIHN0YXRpYyBnZXQgREVGQVVMVF9QTEFZRVJTKCl7cmV0dXJuIFtbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiXSxbXCJNYXJjXCIsXCJKdXJnZW5cIixcIk1vbmlrYVwiLFwiQW5uYVwiLFwiXCJdXTt9O1xuICAgIC8vIHBvc3NpYmxlIHJhbmtzIGFuZCBzdWl0ZXMgKGluIER1dGNoKVxuICAgIHN0YXRpYyBnZXQgRFVUQ0hfUkFOS19OQU1FUygpe3JldHVybiBbXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiYm9lclwiLFwidnJvdXdcIixcImhlZXJcIixcImFhc1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgRFVUQ0hfU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wicnVpdGVuXCIsXCJrbGF2ZXJlblwiLFwiaGFydGVuXCIsXCJzY2hvcHBlblwiXTt9O1xufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cil7cmV0dXJuKHN0cj8oc3RyLmxlbmd0aD9zdHJbMF0udG9VcHBlckNhc2UoKStzdHIuc2xpY2UoMSk6XCJcIik6XCI/XCIpO31cblxuLy8gTURIQDA3SkFOMjAyMDogYWRkaW5nIGVudGVyaW5nIHRoZSBpZCBvZiB0aGUgdXNlciBvbiBwYWdlLXNldHRpbmdzLCBzbyB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgYSBuZXcgb25lXG4vLyAgICAgICAgICAgICAgICBhbHRlcm5hdGl2ZWx5IHdlIGNhbiBkbyB0aGF0IG9uIGEgc2VwYXJhdGUgcGFnZSAvIHBhZ2UtYXV0aCBpcyBPS1xuLy8gICAgICAgICAgICAgICAgd2UgZ28gdG8gcGFnZS1hdXRoIHdoZW4gTk9UIHBsYXlpbmcgdGhlIGdhbWUgaW4gZGVtbyBtb2RlISEhXG4vLyAgICAgICAgICAgICAgICBpbiBub24tZGVtbyBtb2RlIHlvdSBpZGVudGlmeSB5b3Vyc2VsZiwgdGhlbiB3aGVuIHNldFBsYXllck5hbWUgaXMgc3VjY2Vzc2Z1bCBnbyB0byBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbi8vIE1ESEAxMEpBTjIwMjA6IHJlbW92aW5nIHBhZ2Utc2V0dGluZ3MgYW5kIHBhZ2Utc2V0dXAtZ2FtZSwgYWRkaW5nIHBhZ2UtaGVscFxuY29uc3QgUEFHRVM9W1wicGFnZS1ydWxlc1wiLFwicGFnZS1oZWxwXCIsXCJwYWdlLWF1dGhcIixcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiLFwicGFnZS1iaWRkaW5nXCIsXCJwYWdlLXRydW1wLWNob29zaW5nXCIsXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIixcInBhZ2UtcGxheS1yZXBvcnRpbmdcIixcInBhZ2UtcGxheWluZ1wiLFwicGFnZS1maW5pc2hlZFwiXTtcblxudmFyIGN1cnJlbnRQYWdlPW51bGw7IC8vIGxldCdzIGFzc3VtZSB0byBiZSBzdGFydGluZyBhdCBwYWdlLXJ1bGVzXG52YXIgdmlzaXRlZFBhZ2VzPVtdOyAvLyBubyBwYWdlcyB2aXNpdGVkIHlldFxuXG52YXIgY3VycmVudFBsYXllcj1udWxsOyAvLyB0aGUgY3VycmVudCBnYW1lIHBsYXllclxuXG4vLyBNREhAMTBKQU4yMDIwOiBuZXdHYW1lKCkgaXMgYSBiaWQgZGlmZmVyZW50IHRoYW4gaW4gdGhlIGRlbW8gdmVyc2lvbiBpbiB0aGF0IHdlIHJldHVybiB0byB0aGUgd2FpdGluZy1wYWdlXG5mdW5jdGlvbiBuZXdHYW1lKCl7XG4gICAgLy8gYnkgY2FsbCBwbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsPykgd2UgZm9yY2UgY2xlYXJpbmcgdGhlIGdhbWUgaW5mb3JtYXRpb24gYmVpbmcgc2hvd24gYXQgdGhlIHdhaXQtZm9yLXBsYXllcnMgcGFnZVxuICAgICghY3VycmVudFBsYXllcnx8Y3VycmVudFBsYXllci5wbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsLTEpKTtcbn1cblxuZnVuY3Rpb24gZm9yY2VGb2N1cygpe2lmKCFkb2N1bWVudC5oYXNGb2N1cygpKWFsZXJ0KCdZb3VyIHR1cm4hJyk7fVxuXG52YXIgYmlkZGVyQ2FyZHNFbGVtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLWNhcmRzXCIpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplQmlkZGVyU3VpdGVjYXJkc0J1dHRvbigpe1xuICAgIGxldCBidXR0b249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIik7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmlkZGVyIHN1aXRlY2FyZHMgYnV0dG9uIGNsaWNrZWQhXCIpO1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmUtYmlkLWJ1dHRvblwiKTsgLy8gYSBoYSwgZGlkbid0IGtub3cgdGhpc1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnN0eWxlLmRpc3BsYXk9KHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIik/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICB9KTtcbn1cblxuLy8gZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbi8vICAgICB2YXIgdiA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgnKF58OykgPycgKyBuYW1lICsgJz0oW147XSopKDt8JCknKTtcbi8vICAgICByZXR1cm4gdiA/IHZbMl0gOiBudWxsO1xuLy8gfVxuLy8gZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG4vLyAgICAgdmFyIGQgPSBuZXcgRGF0ZTtcbi8vICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKmRheXMpO1xuLy8gICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlICsgXCI7cGF0aD0vO2V4cGlyZXM9XCIgKyBkLnRvR01UU3RyaW5nKCk7XG4vLyB9XG4vLyBmdW5jdGlvbiBkZWxldGVDb29raWUobmFtZSkgeyBzZXRDb29raWUobmFtZSwgJycsIC0xKTsgfVxuXG4vKipcbiAqIHNob3dzIHRoZSBjdXJyZW50IHBsYXllciBuYW1lcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gc2hvd1BsYXllck5hbWVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgIC8vIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIHdoZW5ldmVyIHRoZSBwbGF5ZXIgY2hhbmdlcywgc2hvdyB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIHNob3dDdXJyZW50UGxheWVyTmFtZSgpe1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIikuaW5uZXJIVE1MPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIj9cIik7XG59XG5cbi8qKlxuICogdXBkYXRlcyB0aGUgd2FpdGluZy1mb3ItcGxheWVycyBwYWdlXG4gKiBkZXBlbmRpbmcgb24gd2hldGhlciBvciBub3QgYSBnYW1lIGlzIGJlaW5nIHBsYXllZCAoeWV0KSwgd2Ugc2hvdyB0aGUgZ2FtZSBpZCBhbmQgdGhlIHBsYXllciBuYW1lc1xuICovXG5mdW5jdGlvbiB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW5hbWVcIikuaW5uZXJIVE1MPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUubmFtZTpcIlwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lcygpOm51bGwpO1xuICAgIGZvcihsZXQgcGxheWVyTmFtZVNwYW4gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbWUtcGxheWVyLW5hbWVcIikpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9cGxheWVyTmFtZVNwYW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaW5kZXhcIik7XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmlubmVySFRNTD1wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmNvbG9yPShwbGF5ZXJJbmRleD09cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg/XCJCTFVFXCI6XCJCTEFDS1wiKTtcbiAgICB9XG59XG5cbi8qKlxuICogY2xlYXJzIHRoZSBiaWQgdGFibGVcbiAqIHRvIGJlIGNhbGxlZCB3aXRoIGV2ZXJ5IG5ldyBnYW1lXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQmlkVGFibGUoKXtcbiAgICBsZXQgYmlkVGFibGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKTtcbiAgICBmb3IobGV0IGJpZFRhYmxlUm93IG9mIGJpZFRhYmxlLmNoaWxkcmVuKVxuICAgICAgICBmb3IobGV0IGJpZFRhYmxlQ29sdW1uIG9mIGJpZFRhYmxlUm93LmNoaWxkcmVuKVxuICAgICAgICAgICAgYmlkVGFibGVDb2x1bW4uaW5uZXJIVE1MPVwiXCI7XG59XG5cbmZ1bmN0aW9uIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxzdWl0ZSl7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50bHkgYXNzaWduZWQgc3VpdGVcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIsU3RyaW5nKHN1aXRlKSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKV0pO1xufVxuXG5mdW5jdGlvbiBzaG93Q2FyZChlbGVtZW50LGNhcmQsdHJ1bXBTdWl0ZSx3aW5uZXJTaWduKXtcbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lKGVsZW1lbnQsbmFtZSxwbGF5ZXJUeXBlKXtcbiAgICBlbGVtZW50LmlubmVySFRNTD0obmFtZT9uYW1lOlwiP1wiKTtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7XG4gICAgfVxufVxuLyoqXG4gKiBzaG93cyB0aGUgZ2l2ZW4gdHJpY2tcbiAqIEBwYXJhbSB7Kn0gdHJpY2sgXG4gKi9cbmZ1bmN0aW9uIHNob3dUcmljayh0cmljay8qLHBsYXllckluZGV4Ki8pe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4O1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0cmljayBcIix0cmljayk7XG4gICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCYmcmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpPj0wKXsgLy8gb25jZSBzdWZmaWNlc1xuICAgICAgICBmb3IobGV0IHBhcnRuZXJTdWl0ZUVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1zdWl0ZScpKXBhcnRuZXJTdWl0ZUVsZW1lbnQuaW5uZXJIVE1MPURVVENIX1NVSVRFX05BTUVTW3Jpa2tlblRoZUdhbWUuZ2V0UGFydG5lclN1aXRlKCldO1xuICAgICAgICBmb3IobGV0IHBhcnRuZXJSYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlwYXJ0bmVyUmFua0VsZW1lbnQuaW5uZXJIVE1MPURVVENIX1JBTktfTkFNRVNbcmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpXTtcbiAgICB9XG4gICAgLy8gaWYgdGhpcyBpcyB0aGUgdHJ1bXAgcGxheWVyIHRoYXQgaXMgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCAoZWl0aGVyIG5vbi1ibGluZCBvciBibGluZCkgZmxhZyB0aGUgY2hlY2tib3hcbiAgICBpZih0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWNoZWNrYm94JykuY2hlY2tlZD10cnVlO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1ibGluZCcpLmlubmVySFRNTD0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MD9cImJsaW5kIFwiOlwiXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgfWVsc2VcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgfWVsc2VcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2tpbmctZm9yLXBhcnRuZXItY2FyZC1pbmZvXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgLy9sZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stY2FyZHMtdGFibGVcIikucmVxdWVzdFNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzXG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpLC0yKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzEpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMiklNCksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsyKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzMpJTQpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMyklNCkpO1xuICAgIC8vIHNob3cgdGhlIHRyaWNrIGNhcmRzIHBsYXllZCBieSB0aGUgbGVmdCwgb3Bwb3NpdGUgYW5kIHJpZ2h0IHBsYXllclxuICAgIC8vIE5PVEUgdGhlIGZpcnN0IGNhcmQgY291bGQgYmUgdGhlIGJsaW5kIGNhcmQgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIG5vdCBzaG93IGl0ISFcbiAgICAvLyAgICAgIGJ1dCBvbmx5IHRoZSBjb2xvciBvZiB0aGUgcGFydG5lciBzdWl0ZVxuICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPSh0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLl9jYXJkc1swXS5zdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgbGV0IHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD0oYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD8oNCt0cmljay5maXJzdFBsYXllci1wbGF5ZXJJbmRleCklNDowKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTEpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsxKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMSklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzEpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTIpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsyKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMiklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzIpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTMpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCszKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMyklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzMpJTQpPzE6LTEpOjApKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU3VpdGVDYXJkUm93cyhyb3dzLHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHN1aXRlIGNhcmQgcm93czogXCIrcm93cy5sZW5ndGgrXCIuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBsZXQgc3VpdGU9MDtcbiAgICBmb3IobGV0IHJvdyBvZiByb3dzKXtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjZWxscz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmQ9MDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IGNlbGwgb2YgY2VsbHMpe1xuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yOyAgXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBzdWl0ZUNhcmQrKztcbiAgICAgICAgfVxuICAgICAgICBzdWl0ZSsrO1xuICAgIH1cbn1cbi8vIGluIHRocmVlIGRpZmZlcmVudCBwYWdlcyB0aGUgcGxheWVyIGNhcmRzIHNob3VsZCBiZSBzaG93bi4uLlxuZnVuY3Rpb24gdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgZm9yIGJpZGRpbmcuXCIpO1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5cbi8qKlxuICogZm9yIHBsYXlpbmcgdGhlIGNhcmRzIGFyZSBzaG93biBpbiBidXR0b25zIGluc2lkZSB0YWJsZSBjZWxsc1xuICogQHBhcmFtIHsqfSBzdWl0ZUNhcmRzIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyB0byBjaG9vc2UgZnJvbS5cIik7XG4gICAgbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1zdWl0ZWNhcmRzLXRhYmxlXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgIGxldCByb3dzPXRhYmxlYm9keS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgIGxldCByb3c9cm93c1tzdWl0ZV07XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZUNhcmQ9MDtzdWl0ZUNhcmQ8Y29sdW1ucy5sZW5ndGg7c3VpdGVDYXJkKyspe1xuICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1lbHNlIC8vIGhpZGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVyPTA7XG4gICAgbGV0IGRlbHRhUG9pbnRzPXJpa2tlblRoZUdhbWUuZGVsdGFQb2ludHM7XG4gICAgbGV0IHBvaW50cz1yaWtrZW5UaGVHYW1lLnBvaW50cztcbiAgICBmb3IobGV0IHBsYXllclJlc3VsdHNSb3cgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmVzdWx0cy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSl7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXIpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzFdLmlubmVySFRNTD0oZGVsdGFQb2ludHM/U3RyaW5nKHJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVyXSk6XCItXCIpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzNdLmlubmVySFRNTD1TdHJpbmcocG9pbnRzW3BsYXllcl0pO1xuICAgICAgICBwbGF5ZXIrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLmdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyaWNrcy1wbGF5ZWQtdGFibGVcIikpe1xuICAgICAgICAgICAgbGV0IHJvdz10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIikuY2hpbGRyZW5bbGFzdFRyaWNrUGxheWVkSW5kZXhdOyAvLyB0aGUgcm93IHdlJ3JlIGludGVyZXN0ZWQgaW4gZmlsbGluZ1xuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1TdHJpbmcobGFzdFRyaWNrUGxheWVkSW5kZXgrMSk7XG4gICAgICAgICAgICBmb3IodHJpY2tQbGF5ZXI9MDt0cmlja1BsYXllcjx0cmljay5fY2FyZHMubGVuZ3RoO3RyaWNrUGxheWVyKyspe1xuICAgICAgICAgICAgICAgIGxldCBwbGF5ZXI9KHRyaWNrUGxheWVyK3RyaWNrLmZpcnN0UGxheWVyKSU0O1xuICAgICAgICAgICAgICAgIGxldCBjZWxsPXJvdy5jaGlsZHJlblsyKnBsYXllcisxXTsgLy8gdXNlIHBsYXllciB0byBnZXQgdGhlICdyZWFsJyBwbGF5ZXIgY29sdW1uISFcbiAgICAgICAgICAgICAgICBsZXQgY2FyZD10cmljay5fY2FyZHNbdHJpY2tQbGF5ZXJdO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7IC8vIHB1dCB8IGluIGZyb250IG9mIGZpcnN0IHBsYXllciEhIVxuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGJhY2tncm91bmQgdGhlIGNvbG9yIG9mIHRoZSBwbGF5IHN1aXRlIGFmdGVyIHRoZSBsYXN0IHBsYXllciwgc28gd2Uga25vdyB3aGVyZSB0aGUgdHJpY2sgZW5kZWQhIVxuICAgICAgICAgICAgICAgIHJvdy5jaGlsZHJlblsyKnBsYXllcisyXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9KHRyaWNrUGxheWVyPT10cmljay5fY2FyZHMubGVuZ3RoLTE/KHRyaWNrLnBsYXlTdWl0ZSUyPydibGFjayc6J3JlZCcpOid3aGl0ZScpO1xuICAgICAgICAgICAgICAgIC8vIGxldCdzIG1ha2UgdGhlIHdpbm5lciBjYXJkIHNob3cgYmlnZ2VyISEhXG4gICAgICAgICAgICAgICAgLy8vLy8vL2lmKHRyaWNrLndpbm5lcj09PXBsYXllciljZWxsLnN0eWxlLmNvbG9yPShjYXJkLnN1aXRlJTI/J2JsdWUnOicjYjE5Y2Q5Jyk7ZWxzZSAvLyBtYXJrIHRoZSB3aW5uZXIgd2l0aCBhbiBhc3RlcmlzayEhXG4gICAgICAgICAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAgICAgICAgIGlmKHRyaWNrLndpbm5lcj09PXBsYXllciljZWxsLnN0eWxlLmNvbG9yPShjYXJkLnN1aXRlJTI/J2JsdWUnOicjYjE5Y2Q5Jyk7ZWxzZSAvLyBtYXJrIHRoZSB3aW5uZXIgd2l0aCBhbiBhc3RlcmlzayEhXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmNvbG9yPShjYXJkLnN1aXRlJTI/J2JsYWNrJzoncmVkJyk7XG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5mb250U2l6ZT0odHJpY2sud2lubmVyPT09cGxheWVyP1wiNjAwXCI6XCI0NTBcIikrXCIlXCI7XG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjaW5nOiBjZWxsLnN0eWxlLmNvbG9yPScjJysoY2FyZC5zdWl0ZSUyPydGRic6JzAwJykrJzAwJysodHJpY2tQbGF5ZXI9PTA/J0ZGJzonMDAnKTsgLy8gZmlyc3QgcGxheWVyIGFkZHMgYmx1ZSEhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bOV0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0VGVhbU5hbWUodHJpY2sud2lubmVyKTsgLy8gc2hvdyB3aG8gd29uIHRoZSB0cmljayEhXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMTBdLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHRyaWNrLndpbm5lcik7IC8vIHNob3cgdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGJ5IHRoZSB0cmljayB3aW5uZXIgKE1ESEAwM0pBTjIwMjA6IGNoYW5nZWQgZnJvbSBnZXR0aW5nIHRoZSBwbGF5ZXIgaW5zdGFuY2UgZmlyc3QpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNob3dEZWZhdWx0UGxheWVyTmFtZXMoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGVmYXVsdCBwbGF5ZXIgbmFtZXMhXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz1MYW5ndWFnZS5ERUZBVUxUX1BMQVlFUlNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZW1vLXBsYXltb2RlLWNoZWNrYm94XCIpLmNoZWNrZWQ/MTowXTtcbiAgICBmb3IocGxheWVyTmFtZUlucHV0RWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZighcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZXx8cGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZS5sZW5ndGg9PTApXG4gICAgICAgICAgICBwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlPXBsYXllck5hbWVzW3BhcnNlSW50KHBsYXllck5hbWVJbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIikpXTtcbiAgICB9XG59XG5cbi8vIHBsYXlpbmcgZnJvbSB3aXRoaW4gdGhlIGdhbWVcbmZ1bmN0aW9uIHNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkKCl7XG4gICAgbGV0IHNpbmdsZVBsYXllck5hbWU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItbmFtZScpLnZhbHVlLnRyaW0oKTtcbiAgICBpZihzaW5nbGVQbGF5ZXJOYW1lLmxlbmd0aD4wKVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKHNpbmdsZVBsYXllck5hbWUsKGVycik9PntcbiAgICAgICAgICAgIC8vIE1ESEAxMEpBTjIwMjA6IF9zZXRQbGF5ZXIgdGFrZXMgY2FyZSBvZiBzd2l0Y2hpbmcgdG8gdGhlIHJpZ2h0IGluaXRpYWwgcGFnZSEhIVxuICAgICAgICAgICAgaWYoZXJyKXNldEluZm8oZXJyKTsvLyBlbHNlIG5leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgYWxlcnQoXCJHZWVmIGVlcnN0IGVlbiAoZ2VsZGlnZSkgbmFhbSBvcCFcIik7XG59XG5cbi8qKlxuICogcHJlcGFyZXMgdGhlIEdVSSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBnZXRHYW1lSW5mbygpe1xuICAgIGNvbnNvbGUubG9nKFwiRGV0ZXJtaW5pbmcgZ2FtZSBpbmZvLlwiKTtcbiAgICBsZXQgZ2FtZUluZm89XCJcIjtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7IC8vIG5vIHBsYXllciwgbm8gZ2FtZVxuICAgIGlmKHJpa2tlblRoZUdhbWUpe1xuICAgICAgICAvLyBnZXQgdGhlIGluZm8gd2UgbmVlZCB0aHJvdWdoIHRoZSBQbGF5ZXJHYW1lIGluc3RhbmNlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJzPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKTsgLy8gdGhvc2UgYmlkZGluZ1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkZGVyczogXCIraGlnaGVzdEJpZGRlcnMuam9pbihcIiwgXCIpK1wiLlwiKTtcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWQ9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWQ6IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiKTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRUcnVtcFN1aXRlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0VHJ1bXAgc3VpdGU6IFwiK3RydW1wU3VpdGUrXCIuXCIpO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclN1aXRlKCk7XG4gICAgICAgIGxldCBwYXJ0bmVyUmFuaz1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgIC8vIHBsYXlpbmcgd2l0aCB0cnVtcCBpcyBlYXNpZXN0XG4gICAgICAgIGlmKHRydW1wU3VpdGU+PTApeyAvLyBvbmx5IGEgc2luZ2xlIGhpZ2hlc3QgYmlkZGVyISEhXG4gICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyPWhpZ2hlc3RCaWRkZXJzWzBdO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJvZWxhUGxheWVyTmFtZT1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcik7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89dHJvZWxhUGxheWVyTmFtZStcIiBoZWVmdCB0cm9lbGEsIGVuIFwiO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0RVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW3RydW1wU3VpdGVdK1wiIG1ldCBcIitEVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5jbGFzcyBPbmxpbmVQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJ7XG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gZGVidWdnZXJcbiAgICAgICAgc2hvd0dhbWVTdGF0ZShcIkJpZWQhXCIpOyAvLyBkZWZpbmVkIGluIGluZm8uanNcbiAgICAgICAgZm9yY2VGb2N1cygpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IC8vIEpJVCB0byB0aGUgcmlnaHQgcGFnZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG5cbiAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7XG4gICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5pdGlhbFwiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJCaWRzT2JqZWN0cy5sZW5ndGg7cGxheWVyKyspe1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyXTtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJCaWRzUm93PWJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl07XG4gICAgICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgICAgIGxldCBiaWRDb2x1bW49MDtcbiAgICAgICAgICAgIC8vIHdyaXRlIHRoZSBiaWRzICh3ZSBoYXZlIHRvIGNsZWFyIHRoZSB0YWJsZSB3aXRoIGV2ZXJ5IG5ldyBnYW1lIHRob3VnaClcbiAgICAgICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlblsrK2JpZENvbHVtbl0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2luZzogYmlkVGFibGUuY2hpbGRyZW5bcGxheWVyXS5jaGlsZHJlblsxXS5pbm5lckhUTUw9cGxheWVyc0JpZHNbYmlkXS5qb2luKFwiIFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIHNob3dHYW1lU3RhdGUoXCJUcm9lZiBraWV6ZW5cIik7XG4gICAgICAgIGZvcmNlRm9jdXMoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSB0cnVtcCBzdWl0ZXM6XCIsc3VpdGVzKTtcbiAgICAgICAgc2V0UGFnZShcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgdHJ1bXAgc3VpdGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgfVxuICAgIGNob29zZVBhcnRuZXJTdWl0ZShzdWl0ZXMscGFydG5lclJhbmspeyAvLyBwYXJ0bmVyUmFua05hbWUgY2hhbmdlZCB0byBwYXJ0bmVyUmFuayAoYmVjYXVzZSBMYW5ndWFnZSBzaG91bGQgYmUgdXNlZCBhdCB0aGUgVUkgbGV2ZWwgb25seSEpXG4gICAgICAgIHNob3dHYW1lU3RhdGUoXCJQYXJ0bmVyIGtpZXplblwiKTtcbiAgICAgICAgZm9yY2VGb2N1cygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHBhcnRuZXIgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBiZWNhdXNlIHRoZSBzdWl0ZXMgaW4gdGhlIGJ1dHRvbiBhcnJheSBhcmUgMCwgMSwgMiwgMyBhbmQgc3VpdGVzIHdpbGwgY29udGFpblxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcnRuZXItcmFuaycpLmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXTtcbiAgICB9XG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSByZXBsYWNlZCB2ZXJzaW9uIGV4Y2VwdCB3ZSBub3cgd2FudCB0byByZWNlaXZlIHRoZSB0cmljayBpdHNlbGZcbiAgICBwbGF5QUNhcmQodHJpY2spe1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7XG4gICAgICAgIHNob3dHYW1lU3RhdGUoXCJTcGVlbCFcIik7IC8vIGRlZmluZWQgaW4gaW5mby5qc1xuICAgICAgICBmb3JjZUZvY3VzKCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgcGxheSBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYSBuZXcgdHJpY2sgdXBkYXRlIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlIHdpdGggdGhlIHByZXZpb3VzIHRyaWNrXG4gICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTApdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgIC8qIHNlZSBzaG93VHJpY2soKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbi1hc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5zdHlsZS5kaXNwbGF5PSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZEJsaW5kP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgICAgIC8vIGFsd2F5cyBzdGFydCB1bmNoZWNrZWQuLi5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5jaGVja2VkPWZhbHNlOyAvLyB3aGVuIGNsaWNrZWQgc2hvdWxkIGdlbmVyYXRlIFxuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkLXBsYXllclwiKS5pbm5lckhUTUw9dGhpcy5uYW1lO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXBsYXlzdWl0ZVwiKS5pbm5lckhUTUw9KHRyaWNrLnBsYXlTdWl0ZT49MD9EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdLnRvTG93ZXJDYXNlKCk6XCJrYWFydFwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mVHJpY2tzV29uPXRoaXMuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTsgLy8gYWxzbyBpbmNsdWRlcyB0aG9zZSB3b24gYnkgdGhlIHBhcnRuZXIgKGF1dG9tYXRpY2FsbHkpXG4gICAgICAgIC8vIGFkZCB0aGUgdHJpY2tzIHdvbiBieSB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lck5hbWU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyTmFtZSh0aGlzLl9pbmRleCk7XG4gICAgICAgIC8vIGlmKHBhcnRuZXIpbnVtYmVyT2ZUcmlja3NXb24rPXBsYXllci5nZXROdW1iZXJPZlRyaWNrc1dvbigpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy13b24tc28tZmFyXCIpLmlubmVySFRNTD1TdHJpbmcobnVtYmVyT2ZUcmlja3NXb24pKyhwYXJ0bmVyTmFtZT9cIiAoc2FtZW4gbWV0IFwiK3BhcnRuZXJOYW1lK1wiKVwiOlwiXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHRoaXMgcGxheWVyIGlzIHN1cHBvc2VkIHRvIHdpbiBpbiB0b3RhbFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy10by13aW5cIikuaW5uZXJIVE1MPWdldE51bWJlck9mVHJpY2tzVG9XaW5UZXh0KHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW4scGFydG5lck5hbWUsdGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkKCkpO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7IC8vIGdldCByaWQgb2YgYW55IGN1cnJlbnRseSBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT05MSU5FID4+PiBQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgc2hvdWxkIHBsYXkgYSBjYXJkIVwiKTtcbiAgICAgICAgc2V0SW5mbyh0aGlzLm5hbWUrXCIsIHdlbGtlIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/RFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiIHdpbCBqZSBcIisodHJpY2subnVtYmVyT2ZDYXJkcz4wP1wiYmlqXCI6XCJcIikrXCJzcGVsZW4/XCIpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTsgLy8gcmVtZW1iZXIgdGhlIHN1aXRlIGNhcmRzISEhIVxuICAgICAgICAvLyBzaG93IHRoZSB0cmljayAocmVtZW1iZXJlZCBpbiB0aGUgcHJvY2VzcyBmb3IgdXNlIGluIGNhcmRQbGF5ZWQgYmVsb3cpIGZyb20gdGhlIHZpZXdwb2ludCBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrPXRyaWNrKTsgLy8gTURIQDExSkFOMjAyMDogbm8gbmVlZCB0byBwYXNzIHRoZSBwbGF5ZXIgaW5kZXggKGFzIGl0IGlzIGFsd2F5cyB0aGUgc2FtZSlcbiAgICB9XG4gICAgLy8gbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggX2NhcmRQbGF5ZWQoKSBkZWZpbmVkIGluIHRoZSBiYXNlIGNsYXNzIFBsYXllciB3aGljaCBpbmZvcm1zIHRoZSBnYW1lXG4gICAgLy8gTk9URSBjYXJkUGxheWVkIGlzIGEgZ29vZCBwb2ludCBmb3IgY2hlY2tpbmcgdGhlIHZhbGlkaXR5IG9mIHRoZSBjYXJkIHBsYXllZFxuICAgIC8vIE5PVEUgY2FuJ3QgdXNlIF9jYXJkUGxheWVkIChzZWUgUGxheWVyIHN1cGVyY2xhc3MpXG4gICAgX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7XG4gICAgICAgIGxldCBjYXJkPShzdWl0ZTx0aGlzLl9zdWl0ZUNhcmRzLmxlbmd0aCYmdGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV0ubGVuZ3RoP3RoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdW2luZGV4XTpudWxsKTtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHM9PTApeyAvLyBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGVvcmV0aWNhbGx5IHRoZSBjYXJkIGNhbiBiZSBwbGF5ZWQgYnV0IGl0IG1pZ2h0IGJlIHRoZSBjYXJkIHdpdGggd2hpY2ggdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCEhXG4gICAgICAgICAgICAgICAgLy8gaXMgdGhpcyBhIGdhbWUgd2hlcmUgdGhlcmUncyBhIHBhcnRuZXIgY2FyZCB0aGF0IGhhc24ndCBiZWVuIHBsYXllZCB5ZXRcbiAgICAgICAgICAgICAgICAvLyBhbHRlcm5hdGl2ZWx5IHB1dDogc2hvdWxkIHRoZXJlIGJlIGEgcGFydG5lciBhbmQgdGhlcmUgaXNuJ3Qgb25lIHlldD8/Pz8/XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1aXRlPT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuY2hlY2tlZCYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1aXRlIT10aGlzLl9nYW1lLmdldFRydW1wU3VpdGUoKXx8Y29uZmlybShcIldpbHQgVSBkZSBcIitEVVRDSF9TVUlURV9OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpXStcIiBcIitEVVRDSF9SQU5LX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclJhbmsoKV0rXCIgKGJsaW5kKSB2cmFnZW4gbWV0IGVlbiB0cm9lZj9cIikpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0tMTsgLy8geWVzLCBhc2tpbmcgYmxpbmQhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy8vYWxlcnQoXCJcXHRCTElORCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvKmFsZXJ0KFwiTm90IGluZGljYXRlZCEhISFcIikqLztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXsgLy8gbm90IHRoZSBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2FyZCBuZWVkcyB0byBiZSB0aGUgc2FtZSBzdWl0ZSBhcyB0aGUgcGxheSBzdWl0ZSAoaWYgdGhlIHBsYXllciBoYXMgYW55KVxuICAgICAgICAgICAgICAgIGlmKHN1aXRlIT09dGhpcy5fdHJpY2sucGxheVN1aXRlJiZ0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUodGhpcy5fdHJpY2sucGxheVN1aXRlKT4wKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPXBhcnRuZXJTdWl0ZXx8Y2FyZC5yYW5rIT1wYXJ0bmVyUmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgZGUgXCIrRFVUQ0hfU1VJVEVfTkFNRVNbcGFydG5lclN1aXRlXStcIiBcIitEVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2V0Q2FyZChjYXJkKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiSW52YWxpZCBjYXJkIHN1aXRlIFwiK1N0cmluZyhzdWl0ZSkrXCIgYW5kIHN1aXRlIGluZGV4IFwiK1N0cmluZyhpbmRleCkrXCIuXCIpO1xuICAgIH1cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBzdXBlci5wbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpO1xuICAgICAgICAvLyBUT0RPIHNob3VsZCB3ZSBkbyB0aGlzIGhlcmU/P1xuICAgICAgICBpZih0aGlzLl9pbmRleD49MClzZXRQYWdlKFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIpO2Vsc2Ugc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7XG4gICAgfVxuICAgIC8vIGNhbGwgcmVuZGVyQ2FyZHMganVzdCBhZnRlciB0aGUgc2V0IG9mIGNhcmRzIGNoYW5nZVxuICAgIHJlbmRlckNhcmRzKCl7XG4gICAgICAgIHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpO1xuICAgICAgICBzd2l0Y2goY3VycmVudFBhZ2Upe1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYmlkZGluZ1wiOnVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBvbmx5IG9uY2VcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBsYXlpbmdcIjp1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgYWZ0ZXIgcGxheWluZyBhIGNhcmQhIVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyc1xuLyoqXG4gKiBjbGlja2luZyBhIGJpZCBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gYmlkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gYmlkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgbGV0IGJpZD1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtYmlkXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIkJpZCBjaG9zZW46IFwiLGJpZCk7XG4gICAgY3VycmVudFBsYXllci5fc2V0QmlkKGJpZCk7IC8vIHRoZSB2YWx1ZSBvZiB0aGUgYnV0dG9uIGlzIHRoZSBtYWRlIGJpZFxufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIit0cnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK3BhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIC8vIGdvIGRpcmVjdGx5IHRvIHRoZSBnYW1lIChpbnN0ZWFkIG9mIHRocm91Z2ggdGhlIHBsYXllcilcbiAgICBjdXJyZW50UGxheWVyLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbn1cblxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBsZXQgcGxheWFibGVjYXJkQ2VsbD1ldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIC8vLy8vLy8vaWYocGxheWFibGVjYXJkQ2VsbC5zdHlsZS5ib3JkZXI9XCIwcHhcIilyZXR1cm47IC8vIGVtcHR5ICd1bmNsaWNrYWJsZScgY2VsbFxuICAgIGN1cnJlbnRQbGF5ZXIuX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChwYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpLHBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pbmRleFwiKSkpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklERElORzpcbiAgICAgICAgICAgIC8vIHdoZW4gbW92aW5nIGZyb20gdGhlIERFQUxJTkcgc3RhdGUgdG8gdGhlIEJJRERJTkcgc3RhdGUgY2xlYXIgdGhlIGJpZCB0YWJsZVxuICAgICAgICAgICAgLy8gQUxURVJOQVRJVkVMWSB0aGlzIGNvdWxkIGJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBlbmRzXG4gICAgICAgICAgICAvLyBCVVQgdGhpcyBpcyBhIGJpdCBzYWZlciEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBiaWVkZW4gaXMgYmVnb25uZW4hXCIpO1xuICAgICAgICAgICAgaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKWNsZWFyQmlkVGFibGUoKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiKTtcbiAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4hXCIpO1xuICAgICAgICAgICAgdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7IC8vIHNvIHdlIGdldCB0byBzZWUgdGhlIGxhc3QgdHJpY2sgYXMgd2VsbCEhIVxuICAgICAgICAgICAgdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCk7IC8vIHNob3cgdGhlIHBsYXllciByZXN1bHRzIHNvIGZhclxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFRoZSBzdGF0ZSBvZiB0aGUgZ2FtZSBjaGFuZ2VkIHRvICdcIit0b3N0YXRlK1wiJy5cIik7XG59XG5cbmZ1bmN0aW9uIF9nYW1lRXJyb3JPY2N1cnJlZChlcnJvcil7XG4gICAgYWxlcnQoXCJGb3V0OiBcIitlcnJvcik7XG59XG5cbmZ1bmN0aW9uIHNldFBhZ2UobmV3UGFnZSl7XG4gICAgLy8gcmVtZW1iZXIgdGhlIHBhZ2Ugd2UgY2FtZSBmcm9tIChub3QgdGhlIG5ldyBwYWdlISEhISlcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBQYWdlIHRvIHNob3c6ICdcIituZXdQYWdlK1wiJy5cIik7XG4gICAgLy8gaWYgdGhpcyBpcyBhIHBhZ2UgcmVmcmVzaCwgbm8gbmVlZCB0byByZXB1c2ggdGhlIHBhZ2UhISFcbiAgICBpZihjdXJyZW50UGFnZSlpZihjdXJyZW50UGFnZSE9bmV3UGFnZSl2aXNpdGVkUGFnZXMudW5zaGlmdChjdXJyZW50UGFnZSk7XG4gICAgY3VycmVudFBhZ2U9bmV3UGFnZTtcbiAgICB1cGRhdGVIZWxwQnV0dG9ucygpO1xuICAgIC8vIE5PVEUgbm90IGNoYW5naW5nIGN1cnJlbnRQYWdlIHRvIHBhZ2UgdW50aWwgd2UgaGF2ZSBkb25lIHdoYXQgd2UgbmVlZGVkIHRvIGRvXG4gICAgUEFHRVMuZm9yRWFjaChmdW5jdGlvbihfcGFnZSl7XG4gICAgICAgIGxldCBzaG93UGFnZT0oX3BhZ2U9PT1jdXJyZW50UGFnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKChzaG93UGFnZT9cIlNob3dpbmcgXCI6XCJIaWRpbmcgXCIpK1wiICdcIitfcGFnZStcIicuXCIpO1xuICAgICAgICBsZXQgcGFnZUVsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoX3BhZ2UpO1xuICAgICAgICBpZihwYWdlRWxlbWVudCl7XG4gICAgICAgICAgICBwYWdlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PShzaG93UGFnZT9cInZpc2libGVcIjpcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGlmKHNob3dQYWdlKXtcbiAgICAgICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSBwYWdlLSBwcmVmaXhcbiAgICAgICAgICAgICAgICBzd2l0Y2goX3BhZ2Uuc3Vic3RyaW5nKDUpKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJ1bGVzXCI6c2V0SW5mbyhcIkRlIHJlZ2VscyB2YW4gaGV0IG9ubGluZSBzcGVsLlwiKTticmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6c2V0SW5mbyhcIktpZXMgZGUgc3BlZWx3aWp6ZS5cIik7YnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXR1cC1nYW1lXCI6IC8vIHdoZW4gcGxheWluZyBpbiBkZW1vIG1vZGUsIHRoZSB1c2VyIHNob3VsZCBlbnRlciBmb3VyIHBsYXllciBuYW1lc1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEZWZhdWx0UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVnVsIGRlIG5hbWVuIHZhbiBkZSBzcGVsZXJzIGluLiBFZW4gc3BlbGVybmFhbSBpcyB2b2xkb2VuZGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhdXRoXCI6IC8vIHBhZ2UtYXV0aFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdlZWYgZGUgbmFhbSBvcCB3YWFyb25kZXIgVSB3aWx0IHNwZWxlbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndhaXQtZm9yLXBsYXllcnNcIjogLy8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRXZlbiBnZWR1bGQgYXViLiBXZSB3YWNodGVuIHRvdCBlciBnZW5vZWcgbWVkZXNwZWxlcnMgemlqbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJpZGRpbmdcIjogLy8gcGFnZS1iaWRkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2FjaHQgb20gZGUgYmV1cnQgb3AgZWVuIHZlcnpvZWsgdG90IGhldCBkb2VuIHZhbiBlZW4gYm9kLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheS1yZXBvcnRpbmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheWluZ1wiOiAvLyA/Pz8/XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldhY2h0IG9wIGhldCB2ZXJ6b2VrIHRvdCBoZXQgKGJpailzcGVsZW4gdmFuIGVlbiBrYWFydC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBhbGVydChcIkJVRzogVW5rbm93biBwYWdlICdcIitfcGFnZStcIicgcmVxdWVzdGVkIVwiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5leHRQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgbmV4dCBwYWdlIVwiKTtcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIC8vIE1ESEAwN0pBTjIwMjA6IGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgbmV4dCBwYWdlLCB3aGVuIG5vdCBydW5uaW5nIGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgcGFnZS1hdXRoIHBhZ2VcbiAgICAvLyAgICAgICAgICAgICAgICBpbiBkZW1vIG1vZGUgc2tpcCB0aGUgYXV0aCBhbmQgd2FpdCBmb3IgcGxheWVycyBidXR0b25cbiAgICBzd2l0Y2gocGFnZUluZGV4KXtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYXV0aFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6IC8vIHNob3VsZCB3ZSBjaGVjayB0aGUgdXNlciBuYW1lcz8/Pz8/P1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4KzEpJVBBR0VTLmxlbmd0aF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gY2FuY2VsUGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIHByZXZpb3VzIHBhZ2UuXCIpO1xuICAgIC8vIGdvIG9uZSBwYWdlIGJhY2tcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCtQQUdFUy5sZW5ndGgtMSklUEFHRVMubGVuZ3RoXSk7XG59XG5mdW5jdGlvbiByZXR1cm5Ub1ByZXZpb3VzUGFnZSgpe1xuICAgIC8vIHBvcCBvZmYgdGhlIHBhZ2Ugd2UgYXJlIGdvaW5nIHRvIHZpc2l0LCBwcmV2ZW50aW5nIHRvIHB1c2ggdGhlIGN1cnJlbnRQYWdlIGFnYWluXG4gICAgaWYodmlzaXRlZFBhZ2VzLmxlbmd0aD4wKXtjdXJyZW50UGFnZT1udWxsO3NldFBhZ2UodmlzaXRlZFBhZ2VzLnNoaWZ0KCkpO31cbn1cbmZ1bmN0aW9uIHNob3dIZWxwKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSBoZWxwIVwiKTtcbiAgICBzZXRQYWdlKCdwYWdlLXJ1bGVzJyk7XG59XG4vLyBhc2NlcnRhaW4gdG8gZGlzYWJsZSB0aGUgSGVscCBidXR0b24gd2hlbiB2aWV3aW5nIGl0ISEhXG5mdW5jdGlvbiB1cGRhdGVIZWxwQnV0dG9ucygpe1xuICAgIGxldCBlbmFibGVIZWxwQnV0dG9uPShjdXJyZW50UGFnZSE9PSdwYWdlLWhlbHAnKTtcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24uZGlzYWJsZWQ9IWVuYWJsZUhlbHBCdXR0b247XG59XG5cbi8qKlxuICogdG8gYmUgY2FsbGVkIHdoZW4gdGhlIG5ldy1wbGF5ZXJzIGJ1dHRvbiBpcyBjbGlja2VkLCB0byBzdGFydCBhIG5ldyBnYW1lIHdpdGggYSBuZXcgc2V0IG9mIHBsYXllcnNcbiAqL1xuZnVuY3Rpb24gbmV3UGxheWVycygpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IE5pZXV3ZSBzcGVsZXJzIGFhbm1ha2VuLlwiKTtcbiAgICBwbGF5ZXJzPVtdO1xuICAgIGxldCBub1BsYXllck5hbWVzPXRydWU7XG4gICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBwbGF5ZXIgaW5wdXQgZmllbGRzXG4gICAgZm9yKHBsYXllck5hbWVJbnB1dCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZihwbGF5ZXJOYW1lSW5wdXQudmFsdWUubGVuZ3RoPjApe1xuICAgICAgICAgICAgbm9QbGF5ZXJOYW1lcz1mYWxzZTtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChuZXcgT25saW5lUGxheWVyKHBsYXllck5hbWVJbnB1dC52YWx1ZSkpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZXJzLmxlbmd0aDw0KVxuICAgICAgICAgICAgcGxheWVycy5wdXNoKG51bGwpO1xuICAgIH1cbiAgICBpZihub1BsYXllck5hbWVzKXtcbiAgICAgICAgcGxheWVycz1udWxsO1xuICAgICAgICBzZXRJbmZvKFwiR2VlbiBzcGVsZXJuYW1lbiBvcGdlZ2V2ZW4uIEhlYiB0ZW5taW5zdGUgZWVuIHNwZWxlcm5hYW0gbm9kaWchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiUmlra2VuIC0gaGV0IHNwZWw6IE5pZXV3ZSBzcGVsZXJzIGFhbmdlbWFha3QhXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxHYW1lKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOy8vaWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiR2VlbiBzcGVsIVwiKTtcbiAgICBpZighcmlra2VuVGhlR2FtZSl7XG4gICAgICAgIGFsZXJ0KFwiR2VlbiBzcGVsIG9tIGFmIHRlIGJyZWtlbiEgTGFhZCBkZXplIHdlYiBwYWdpbmEgb3BuaWV1dyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY29uZmlybShcIldpbHQgVSBlY2h0IGhldCBodWlkaWdlIHNwZWwgYWZicmVrZW4/XCIpKXtcbiAgICAgICAgcmlra2VuVGhlR2FtZS5jYW5jZWwoKTtcbiAgICB9XG59XG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGl0aW9uYWwgc3R1ZmYgdGhhdCB3ZSdyZSBnb2luZyB0byBuZWVkIHRvIG1ha2UgdGhpcyBzdHVmZiB3b3JrXG5jbGFzcyBQbGF5ZXJHYW1lUHJveHkgZXh0ZW5kcyBQbGF5ZXJHYW1lIHtcblxuICAgIGdldFNlbmRFdmVudChldmVudCxkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKStcIi5cIik7XG4gICAgICAgIHJldHVybiBbZXZlbnQsZGF0YV07XG4gICAgfVxuXG4gICAgLy8gd2hhdCB0aGUgcGxheWVyIHdpbGwgYmUgY2FsbGluZyB3aGVuIChzKWhlIG1hZGUgYSBiaWQsIHBsYXllZCBhIGNhcmQsIGNob29zZSB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlXG4gICAgYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ0JJRCcsYmlkKSk7IC8vIG5vIG5lZWQgdG8gc2VuZCB0aGUgcGxheWVyIGlkIEkgdGhpbmsuLi4geydieSc6dGhpcy5fcGxheWVySW5kZXgsJ2JpZCc6YmlkfSkpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgc2hvd0dhbWVTdGF0ZShudWxsKTsgLy8gYSBiaXQgY3J1ZGUgdG8gZ2V0IHJpZCBvZiB0aGUgQmllZGVuIHBhZ2UgbmFtZSB0aG91Z2hcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhcmRQbGF5ZWQoY2FyZCl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnQ0FSRCcsW2NhcmQuc3VpdGUsY2FyZC5yYW5rXSkpOyAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnY2FyZCc6W2NhcmQuc3VpdGUsY2FyZC5yYW5rXX0pKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIHNob3dHYW1lU3RhdGUobnVsbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ1RSVU1QU1VJVEUnLHRydW1wU3VpdGUpKTsgLy8gc2FtZSBoZXJlOiB7J3BsYXllcic6dGhpcy5fcGxheWVySW5kZXgsJ3N1aXRlJzp0cnVtcFN1aXRlfSkpO1xuICAgICAgICBzaG93R2FtZVN0YXRlKG51bGwpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gYXNjZXJ0YWluIHRvIGhpZGUgdGhlIHRydW1wIHN1aXRlIGlucHV0IGVsZW1lbnRcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlKSk7IC8vIHJlcGxhY2luZzogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6cGFydG5lclN1aXRlfSkpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBhc2NlcnRhaW4gdG8gaGlkZSB0aGUgcGFydG5lciBzdWl0ZSBpbnB1dCBlbGVtZW50XG4gICAgICAgIHNob3dHYW1lU3RhdGUobnVsbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdzdGF0ZSl7XG4gICAgICAgIGxldCBvbGRzdGF0ZT10aGlzLl9zdGF0ZTtcbiAgICAgICAgdGhpcy5fc3RhdGU9bmV3c3RhdGU7XG4gICAgICAgIC8vIGRvIHN0dWZmIChjaGFuZ2UgdG8gYW5vdGhlciBwYWdlKVxuICAgICAgICBfZ2FtZVN0YXRlQ2hhbmdlZChvbGRzdGF0ZSx0aGlzLl9zdGF0ZSk7XG4gICAgfVxuXG4gICAgbG9nRXZlbnQoZXZlbnQsZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFJlY2VpdmVkIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIGdldFBsYXllck5hbWUocGxheWVySW5kZXgpe3JldHVybih0aGlzLl9wbGF5ZXJOYW1lcyYmcGxheWVySW5kZXg+PTAmJnBsYXllckluZGV4PHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD90aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF06bnVsbCk7fVxuICAgIGdldFBsYXllck5hbWVzKCl7cmV0dXJuIHRoaXMuX3BsYXllck5hbWVzO30gLy8gb3ZlcnJpZGluZyBnZXRQbGF5ZXJOYW1lcygpIG9mIHRoZSBkZW1vIHZlcnNpb24hIVxuICAgIHNldCBwbGF5ZXJOYW1lcyhwbGF5ZXJOYW1lcyl7XG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPXBsYXllck5hbWVzO1xuICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0oIXRoaXMuX3BsYXllck5hbWVzfHx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg9PTA/LTE6dGhpcy5fcGxheWVyTmFtZXMuaW5kZXhPZihjdXJyZW50UGxheWVyLm5hbWUpKTtcbiAgICAgICAgY3VycmVudFBsYXllci5pbmRleD10aGlzLl9wbGF5ZXJJbmRleDtcbiAgICAgICAgaWYodGhpcy5fcGxheWVySW5kZXg8MClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEN1cnJlbnQgcGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIG5vdCBmb3VuZC5cIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpO1xuICAgIH1cblxuICAgIHBhcnNlVHJpY2sodHJpY2tJbmZvKXtcbiAgICAgICAgbGV0IHRyaWNrPW5ldyBUcmljaygpO1xuICAgIH1cbiAgICBwcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXBhcmluZyBmb3IgY29tbXVuaWNhdGlvblwiKTtcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5fc3RhdGU9SURMRTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZGlzY29ubmVjdCcsKCk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ2Rpc2Nvbm5lY3QnLG51bGwpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJlZ2lzdGVyIHRvIHJlY2VpdmUgZGF0YSBvbiBhbGwgY3VzdG9tIGV2ZW50c1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1NUQVRFQ0hBTkdFJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1NUQVRFQ0hBTkdFJyxkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGU9ZGF0YS50bztcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHBsYXllciBldmVudHMgKGluIG9yZGVyIG9mIGFwcGVhcmFuY2UpXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRScsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdHQU1FJyxkYXRhKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBpbmZvcm1hdGlvbiByZWNlaXZlZCBieSAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJy5cIixkYXRhKTtcbiAgICAgICAgICAgIC8vIHdlIGNhbiBzZXQgdGhlIG5hbWUgb2YgdGhlIGdhbWUgbm93XG4gICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3BsYXllcnMnKSl0aGlzLnBsYXllck5hbWVzPWRhdGEucGxheWVycztcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHdoZW4gdGhlIHJlbW90ZSBnYW1lIHJlYWNoZXMgdGhlIElETEUgc3RhdGUgKGFuZCB0aGUgZ2FtZSBpcyBvbiEhISEpXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWUVSUycsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdQTEFZRVJTJyxkYXRhKTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZXM9ZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignREVBTEVSJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ0RFQUxFUicsZGF0YSk7XG4gICAgICAgICAgICB0aGlzLl9kZWFsZXI9ZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRFMnLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnQ0FSRFMnLGRhdGEpO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJVTVAnLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnVFJVTVAnLGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQQVJUTkVSJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1BBUlRORVInLGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FSU5GTycsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdHQU1FSU5GTycsZGF0YSk7XG4gICAgICAgICAgICAvLyB0eXBpY2FsbHkgdGhlIGdhbWUgaW5mbyBjb250YWlucyBBTEwgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0aGUgZ2FtZSB0aGF0IGlzIGdvaW5nIHRvIGJlIHBsYXllZFxuICAgICAgICAgICAgLy8gaS5lLiBhZnRlciBiaWRkaW5nIGhhcyBmaW5pc2hlZFxuICAgICAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT1kYXRhLnRydW1wU3VpdGU7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9ZGF0YS5wYXJ0bmVyU3VpdGU7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1kYXRhLnBhcnRuZXJSYW5rO1xuICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZD1kYXRhLmhpZ2hlc3RCaWQ7XG4gICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkZGVycz1kYXRhLmhpZ2hlc3RCaWRkZXJzO1xuICAgICAgICAgICAgdGhpcy5fdHJ1bXBQbGF5ZXI9ZGF0YS50cnVtcFBsYXllcjtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX0JJRFwiLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnVE9fQklEJyxkYXRhKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0by1iaWQnKS5pbm5lckhUTUw9ZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTUFLRV9BX0JJRCcsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdNQUtFX0FfQklEJyxkYXRhKTtcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIubWFrZUFCaWQoZGF0YS5wbGF5ZXJCaWRzT2JqZWN0cyxkYXRhLnBvc3NpYmxlQmlkcyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19QTEFZXCIsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdUT19QTEFZJyxkYXRhKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0by1iaWQnKS5pbm5lckhUTUw9ZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWV9BX0NBUkQnLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnUExBWV9BX0NBUkQnLGRhdGEpO1xuICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgY3VycmVudFBsYXllci5wbGF5QUNhcmQocGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9UUlVNUF9TVUlURScsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdDSE9PU0VfVFJVTVBfU1VJVEUnLGRhdGEpO1xuICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VUcnVtcFN1aXRlKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfUEFSVE5FUl9TVUlURScsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KFwiQ0hPT1NFX1BBUlRORVJfU1VJVEVcIixkYXRhKTtcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlUGFydG5lclN1aXRlKGRhdGEuc3VpdGVzLGRhdGEucGFydG5lclJhbmtOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0snLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnVFJJQ0snLHBhcnNlVHJpY2soZGF0YSkpO1xuICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHBhcnNlVHJpY2soKSlcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1RSSUNLUycsZGF0YSk7XG4gICAgICAgICAgICAvLyB3ZSBjYW4ndCBqdXN0IHNpbXBseSBhc3NpZ24gdGhlIHRyaWNrcyB0aG91Z2hcbiAgICAgICAgICAgIHRoaXMuX3RyaWNrcz1bXTsgLy8gc2hvdWxkIGFscmVhZHkgYmUgdGhlIGNhc2U/Pz8/P1xuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKCh0cmlja0luZm8pPT57dGhpcy5fdHJpY2tzLnB1c2godGhpcy5wYXJzZVRyaWNrKHRyaWNrSW5mbykpfSk7XG4gICAgICAgICAgICB1cGRhdGVUcmlja3MoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUkVTVUxUUycsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdSRVNVTFRTJyxkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPWRhdGEuZGVsdGFwb2ludHM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1ESEAwOEpBTjIwMjA6IHNvY2tldCBzaG91bGQgcmVwcmVzZW50IGEgY29ubmVjdGVkIHNvY2tldC5pbyBpbnN0YW5jZSEhIVxuICAgIGNvbnN0cnVjdG9yKHNvY2tldCl7XG4gICAgICAgIC8vIE9PUFMgZGlkbid0IGxpa2UgZm9yZ2V0dGluZyB0aGlzISEhIFxuICAgICAgICAvLyBidXQgUGxheWVyR2FtZSBkb2VzIE5PVCBoYXZlIGFuIGV4cGxpY2l0IGNvbnN0cnVjdG9yIChpLmUuIG5vIHJlcXVpcmVkIGFyZ3VtZW50cylcbiAgICAgICAgc3VwZXIoKTsgXG4gICAgICAgIHRoaXMuX3N0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICB0aGlzLl9zb2NrZXQ9c29ja2V0O1xuICAgICAgICB0aGlzLl9kZWFsZXI9LTE7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7dGhpcy5fdHJ1bXBQbGF5ZXI9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTt0aGlzLl9wYXJ0bmVyUmFuaz0tMTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NXb249WzAsMCwwLDBdOyAvLyBhc3N1bWUgbm8gdHJpY2tzIHdvbiBieSBhbnlib2R5XG4gICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9LTE7dGhpcy5faGlnaGVzdEJpZGRlcnM9W107IC8vIG5vIGhpZ2hlc3QgYmlkZGVycyB5ZXRcbiAgICAgICAgdGhpcy5fZGVsdGFQb2ludHM9bnVsbDtcbiAgICAgICAgdGhpcy5fcG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX2xhc3RUcmlja1BsYXllZD1udWxsO1xuICAgICAgICB0aGlzLl90ZWFtTmFtZXM9bnVsbDtcbiAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIHRoZSAnY3VycmVudCcgcGxheWVyXG4gICAgICAgIC8vIHRoaW5ncyB3ZSBjYW4gc3RvcmUgaW50ZXJuYWxseSB0aGF0IHdlIHJlY2VpdmUgb3ZlciB0aGUgY29ubmVjdGlvblxuICAgICAgICB0aGlzLl9uYW1lPW51bGw7IC8vIHRoZSBuYW1lIG9mIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPW51bGw7IC8vIHRoZSBuYW1lcyBvZiB0aGUgcGxheWVyc1xuICAgICAgICB0aGlzLl9wYXJ0bmVySW5kaWNlcz1udWxsOyAvLyB0aGUgcGFydG5lclxuICAgICAgICB0aGlzLnByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgaXRzZWxmIG9yZ2FuaXplZCBieSBzdGF0ZVxuICAgIC8vIFBMQVlJTkdcbiAgICBnZXRUcnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICBnZXRUcnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwbGF5ZXJdO31cbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpe3JldHVybiB0aGlzLl9wYXJ0bmVyTmFtZXNbcGxheWVyXTt9XG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnM7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZDt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIGdldFBsYXllck5hbWUocGxheWVyKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXNbcGxheWVyXTt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7cmV0dXJuIHRoaXMuX2RlbHRhUG9pbnRzO31cbiAgICBnZXQgcG9pbnRzKCl7cmV0dXJuIHRoaXMuX3BvaW50czt9XG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllcixvdGhlclBsYXllcil7cmV0dXJuIHRoaXMuX3BhcnRuZXJJZHNbcGxheWVyXT09PW90aGVyUGxheWVyO31cbiAgICBnZXRMYXN0VHJpY2tQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbGFzdFRyaWNrUGxheWVkO31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ7fVxuICAgIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXRUZWFtTmFtZShwbGF5ZXIpe3JldHVybiB0aGlzLl9nZXRUZWFtTmFtZXNbcGxheWVyXTt9XG4gICAgZ2V0IGZvdXJ0aEFjZVBsYXllcigpe3JldHVybiB0aGlzLl9mb3VydGhBY2VQbGF5ZXI7fVxuXG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAvLyBob3cgYWJvdXQgcHJvbXB0aW5nIHRoZSB1c2VyPz8/Pz9cbiAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXJ8fCFjdXJyZW50UGxheWVyLmdhbWUpcmV0dXJuOyAvLyBkbyBub3QgYXNrIHRoZSB1c2VyIHdoZXRoZXIgdGhleSB3YW50IHRvIHN0YXkgb3Igbm90IChhcyB0aGV5IGNhbm5vdCBzdGF5KVxuICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyB2aWV3aW5nIHRoZSByZXN1bHRzIHBhZ2Ugd2UgbWF5IGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIGFjdHVhbGx5IG92ZXJcbiAgICAgICAgcmV0dXJuKGN1cnJlbnRQYWdlPT09J3BhZ2UtcmVzdWx0cyc/XCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi4gVG90IGRlIHZvbGdlbmRlIGtlZXIhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XCJIZXQgc3BlbCBpcyBub2cgbmlldCB0ZW4gZWluZGUuIEJsaWpmIG9wIGRlIHBhZ2luYSBvbSB0b2NoIHZlcmRlciB0ZSBzcGVsZW4uXCIpO1xuICAgIH07XG4gICAgLy8gaWYgd2UgYWN0dWFsbHkgZW5kIHVwIGluIGxlYXZpbmcgdGhpcyBVUkwsIHdlIGRlZmluaXRlbHkgd2FudCB0byBraWxsIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgZm9yIGdvb2RcbiAgICB3aW5kb3cub25wb3BzdGF0ZT1mdW5jdGlvbigpe1xuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICBzZXRQbGF5ZXJOYW1lKG51bGwsbnVsbCk7IC8vIHdpdGhvdXQgY2FsbGJhY2sgbm8gcGFnZSBzaG91bGQgYmUgc2hvd24gYW55bW9yZS4uLlxuICAgIH1cblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGhpZGUgdGhlIGJpZGRpbmcgYW5kIHBsYXlpbmcgZWxlbWVudHNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItYmlkXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcbiAgICBcbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWU7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgLy8gY2xpY2tpbmcgY2FyZCAnYnV0dG9ucycgKG5vdyBjZWxscyBpbiB0YWJsZSksIHdlIGNhbiBnZXQgcmlkIG9mIHRoZSBidXR0b24gaXRzZWxmISEhXG4gICAgZm9yKGxldCBwbGF5YWJsZWNhcmRCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5YWJsZS5jYXJkLXRleHRcIikpcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9cGxheWFibGVjYXJkQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBtYWtlIHRoZSBzdWl0ZSBlbGVtZW50cyBvZiBhIHNwZWNpZmljIHR5cGUgc2hvdyB0aGUgcmlnaHQgdGV4dCEhISFcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8NDtzdWl0ZSsrKVxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuXCIrQ2FyZC5TVUlURV9OQU1FU1tzdWl0ZV0pKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24udmFsdWU9Q2FyZC5TVUlURV9DSEFSQUNURVJTW3N1aXRlXTtcblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGNoZWNrIGZvciBhIHVzZXIgbmFtZVxuICAgIHZhciB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgIGxldCBpbml0aWFsUGxheWVyTmFtZT0odXJsUGFyYW1zLmhhcyhcInBsYXllclwiKT91cmxQYXJhbXMuZ2V0KFwicGxheWVyXCIpLnRyaW0oKTpudWxsKTtcbiAgICBzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLChlcnIpPT57fSk7XG5cbn07XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIsZXJyb3JjYWxsYmFjayl7XG4gICAgdmlzaXRlZFBhZ2VzPVtdOyAvLyBmb3JnZXQgdmlzaXRlZCBwYWdlc1xuICAgIGN1cnJlbnRQYWdlPW51bGw7IC8vIGFzY2VydGFpbiB0byBub3QgaGF2ZSBhIHBhZ2UgdG8gc3RvcmVcbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IHBsYXllciAoaWYgYW55KSwgYW5kIGluIGVmZmVjdCB3ZSdsbCBsb29zZSB0aGUgZ2FtZSBhcyB3ZWxsXG4gICAgaWYoY3VycmVudFBsYXllcil7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcpO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgICAgICBpZihjbGllbnRzb2NrZXQuY29ubmVjdGVkKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZCEhIVwiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxwbGF5ZXIubmFtZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gdW5mb3J0dW5hdGVseSB3ZSBjYW4gb25seSBzZXQgdGhlIGdhbWUgb2YgdGhlIHBsYXllciBpZiBfaW5kZXggaXMgbm9uLW5lZ2F0aXZlLCBzbyB3ZSBwYXNzIGluIDRcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PTQ7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICBpZihlcnJvcmNhbGxiYWNrKXtlcnJvcmNhbGxiYWNrKG51bGwpO3NldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7fVxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2luZzogKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhudWxsKSk7ICAgICAgICAgICAgXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXCIpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Nvbm5lY3RfZXJyb3InLChlcnIpPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3QgZXJyb3I6IFwiLGVycik7XG4gICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKGVycikpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdHJ5IHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciBjYXRjaGluZyB3aGF0ZXZlciBoYXBwZW5zIHRocm91Z2ggZXZlbnRzXG4gICAgICAgIGNsaWVudHNvY2tldC5jb25uZWN0KC8qKGVycik9PntcbiAgICAgICAgICAgIGRlYnVnZ2VyXG4gICAgICAgICAgICBpZighZXJyKXtcbiAgICAgICAgICAgICAgICAvLyBieSBkZWZhdWx0IHVzZSBlcnJvcmNhbGxiYWNrIHRvIHJldHVybiBhbnkgZXJyb3Igb2NjdXJyaW5nXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGVycm9yY2FsbGJhY2s9PT0nZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Vycm9yJyxlcnJvcmNhbGJhY2spO1xuICAgICAgICAgICAgICAgIGVsc2UgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiB0aGF0IGxvZ3MgdG8gdGhlIGNvbnNvbGUhIVxuICAgICAgICAgICAgICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Vycm9yJywoZXJyKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gRVJST1I6IFNvbWV0aGluZyB3ZW50IHdyb25nIGluIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlci5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJcXHRcIitlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtaXR0aW5nIHBsYXllciBuYW1lICdcIitwbGF5ZXIubmFtZStcIicuXCIpO1xuICAgICAgICAgICAgICAgIGNsaWVudHNvY2tldC5lbWl0KCdQTEFZRVInLHBsYXllci5uYW1lKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyPXBsYXllcjtcbiAgICAgICAgICAgICAgICAvLyBwbHVnIGluIGEgZ2FtZT8/Pz8/XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHJlbW90ZSBnYW1lIHNlcnZlclwiKTtcbiAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0qLyk7XG4gICAgfWVsc2VcbiAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhudWxsKSk7XG59XG5cbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIHRoZSAobmV3KSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllciB3aGVuZXZlciB0aGUgcGxheWVyIHdhbnRzIHRvIHBsYXlcbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIG51bGwgKG9yIGVtcHR5KSBwbGF5ZXIgbmFtZVxuLy8gdG8gbWFrZSBpdCBjYWxsYWJsZSBmcm9tIGFueXdoZXJlIHdlIGF0dGFjaCBzZXRQbGF5ZXJOYW1lIHRvIHdpbmRvdyAoYmVjYXVzZSBjbGllbnQuanMgd2lsbCBiZSBicm93c2VyaWZpZWQhISEpXG5mdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKHBsYXllck5hbWUsZXJyb3JDYWxsYmFjayl7XG4gICAgKHByZXBhcmVkRm9yUGxheWluZ3x8cHJlcGFyZUZvclBsYXlpbmcoKSk7IC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgb25jZVxuICAgIC8vIGlmKGVycm9yQ2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIGFzY2VydGFpbiB0byBub3QgYmUgaW4gYSBub24tcGxheWVyIHBhZ2VcbiAgICAvLyBwbGF5ZXJOYW1lIG5lZWRzIHRvIGJlIGEgc3RyaW5nIChpZiBpdCBpcyBkZWZpbmVkKVxuICAgIGlmKHBsYXllck5hbWUmJiEodHlwZW9mIHBsYXllck5hbWU9PT1cInN0cmluZ1wiKSlcbiAgICAgICAgcmV0dXJuKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYXllciBuYW1lLlwiKSkpO1xuICAgIC8vIGlmIHBsYXllck5hbWUgbWF0Y2hlcyB0aGUgY3VycmVudCBwbGF5ZXIncyBuYW1lLCBub3RoaW5nIHRvIGRvXG4gICAgaWYocGxheWVyTmFtZSYmY3VycmVudFBsYXllciYmY3VycmVudFBsYXllci5uYW1lPT09cGxheWVyTmFtZSlcbiAgICAgICAgKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhudWxsKSk7XG4gICAgZWxzZVxuICAgICAgICBfc2V0UGxheWVyKHBsYXllck5hbWUmJnBsYXllck5hbWUubGVuZ3RoPjA/bmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lKTpudWxsLGVycm9yQ2FsbGJhY2spO1xufVxuXG53aW5kb3cub25sb2FkPXByZXBhcmVGb3JQbGF5aW5nO1xuXG4vLyBleHBvcnQgdGhlIHR3byBmdW5jdGlvbiB0aGF0IHdlIGFsbG93IHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBvdXRzaWRlISEhXG5tb2R1bGUuZXhwb3J0cz1zZXRQbGF5ZXJOYW1lOyJdfQ==
