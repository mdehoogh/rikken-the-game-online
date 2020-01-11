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
        console.log("Possible trump suites:",suites);
        setPage("page-trump-choosing");
        updateChooseTrumpSuiteCards(this._suiteCards);
        // iterate over the trump suite buttons
        for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
    }
    choosePartnerSuite(suites,partnerRank){ // partnerRankName changed to partnerRank (because Language should be used at the UI level only!)
        showGameState("Partner kiezen");
        console.log("Possible partner suites:",suites);
        setPage("page-partner-choosing");
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
        return true;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('PARTNERSUITE',partnerSuite)); // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
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
    let initialPlayerName=(urlParams.has("user")?urlParams.get("user").trim():null);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBkZWZpbml0aW9uIG9mIGEgcGxheWluZyBDYXJkXG4gKi9cbmNsYXNzIENhcmR7XG5cbiAgICBzdGF0aWMgZ2V0IFNVSVRFX05BTUVTKCl7cmV0dXJuIFtcImRpYW1vbmRcIixcImNsdWJcIixcImhlYXJ0XCIsXCJzcGFkZVwiXTt9XG4gICAgc3RhdGljIGdldCBSQU5LX05BTUVTKCl7cmV0dXJuIFtcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCJqYWNrXCIsXCJxdWVlblwiLFwia2luZ1wiLFwiYWNlXCJdO31cbiAgICAvLyBzaG9ydGhhbmQgJ2NoYXJhY3RlcnMnIGZvciB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uXG4gICAgLy8gTk9UIFdPUktJTkc6IGNvbnN0IENBUkRfU1VJVEVfQ0hBUkFDVEVSUz1bU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY2KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjMpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2NSksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYwKV07XG4gICAgc3RhdGljIGdldCBTVUlURV9DSEFSQUNURVJTKCl7cmV0dXJuIFsnXFx1MjY2NicsJ1xcdTI2NjMnLCdcXHUyNjY1JywnXFx1MjY2MCddfTsgLy8gWUVTLCBXT1JLSU5HISEhISFcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0RJQU1PTkQoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0xVQigpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBTVUlURV9IRUFSVCgpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBTVUlURV9TUEFERSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWycyJywnMycsJzQnLCc1JywnNicsJzcnLCc4JywnOScsJzEwJywnQicsJ1YnLCdLJywnQSddO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RXTygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RIUkVFKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRk9VUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZJVkUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TSVgoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TRVZFTigpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBSQU5LX0VJR0hUKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfTklORSgpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBSQU5LX1RFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBSQU5LX0pBQ0soKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19RVUVFTigpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19LSU5HKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBSQU5LX0FDRSgpe3JldHVybiAxMjt9O1xuXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkcyhjYXJkMSxjYXJkMil7XG4gICAgICAgIGxldCBkZWx0YVN1aXRlPWNhcmQxLl9jYXJkU3VpdGVJbmRleC1jYXJkMi5fY2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIGlmKGRlbHRhU3VpdGUhPTApcmV0dXJuIGRlbHRhU3VpdGU7XG4gICAgICAgIHJldHVybiBjYXJkMS5fY2FyZE5hbWVJbmRleC1jYXJkMi5fY2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgXG4gICAgLy8gaW4gYSB0cmljayB0aGUgcGxheSBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgY2FyZHMgYXJlIHRvIGJlIHBsYXllZCwgdGhlIHRydW1wIHN1aXRlIGRldGVybWluZXMgd2hhdCB0cnVtcCBpc1xuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZDEsY2FyZDIscGxheVN1aXRlLHRydW1wU3VpdGUpe1xuICAgICAgICAvLyBub3JtYWxseSB3aXRoIGFueSB0d28gcmVndWxhciBjYXJkcyB0aGV5IGFyZSBuZXZlciBlcXVhbCBpbiBhIHRyaWNrXG4gICAgICAgIC8vIGNhcmRzIHRoYXQgYXJlIG5laXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSBpcyBpcnJlbGV2YW50XG4gICAgICAgIGxldCByZXN1bHQ9MDtcbiAgICAgICAgbGV0IHR5cGU9Jy0nO1xuICAgICAgICAvLyAxLiBpZiBjYXJkMSBpcyB0cnVtcCwgYW5kIGNhcmQyIGlzIG5vdCBvciBoYXMgYSBsb3dlciByYW5rIGNhcmQxIHdpbnNcbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXRydW1wU3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0EnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBOT1QgdHJ1bXAgYnV0IGNhcmQyIGNvdWxkIHN0aWxsIGJlIHRydW1wXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nQic7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyB0cnVtcCwgc28gY291bGQgYmUgcGxheSBzdWl0ZSBvciBub3QuLi5cbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdDJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgbm90IHBsYXkgc3VpdGUsIGJ1dCBjYXJkMiBjb3VsZCBiZVxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nRCc7fVxuICAgICAgICBjb25zb2xlLmxvZygnPj4+IFR5cGU6ICcrdHlwZSsnOiAnK2NhcmQxLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiKHN1aXRlOiBcIitjYXJkMS5zdWl0ZStcIilcIisocmVzdWx0PjA/JyA+ICc6KHJlc3VsdDwwPycgPCAnOicgPSAnKSkrY2FyZDIuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKHN1aXRlOiBcIitjYXJkMi5zdWl0ZStcIilcIitcIiAocGxheTogXCIrKHBsYXlTdWl0ZT49MD9TVUlURV9OQU1FU1twbGF5U3VpdGVdOlwiP1wiKStcIiwgdHJ1bXA6XCIrKCh0cnVtcFN1aXRlPj0wP1NVSVRFX05BTUVTW3RydW1wU3VpdGVdOlwiP1wiKSkrXCIpXCIpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIC8vIGxldCdzIGZpcnN0IHJlY29tcHV0ZSB0aGUgc3VpdGUgb2YgYm90aCBjYXJkcyBhbmQgZWxldmF0ZSB0cnVtcCBjYXJkcywgYW5kIGRlZXZhbHVhdGUgbm9uIHBsYXlTdWl0ZSBjYXJkc1xuICAgICAgICBsZXQgY2FyZDFTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDEuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMS5zdWl0ZSkpO1xuICAgICAgICBsZXQgY2FyZDJTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMi5zdWl0ZSkpO1xuICAgICAgICBpZihjYXJkMVN1aXRlPj0wfHxjYXJkMlN1aXRlPj0wKXsgLy8gYXQgbGVhc3Qgb25lIG9mIHRoZSBjYXJkcyBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VpdGVzIGFyZSB0aGUgc2FtZSB0aGUgaGlnaGVzdCByYW5rIHdpbnNcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU8MClyZXR1cm4gLTE7IC8vIGlmIHRoZSBmaXJzdCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGxvd2VyXG4gICAgICAgICAgICBpZihjYXJkMlN1aXRlPDApcmV0dXJuIDE7IC8vIGlmIHRoZSBzZWNvbmQgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBoaWdoZXJcbiAgICAgICAgICAgIC8vIEFTU0VSVCBib3RoIGNhcmRzIGFyZSBlaXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZT09Y2FyZDJTdWl0ZSlyZXR1cm4gY2FyZDEucmFuay1jYXJkMi5yYW5rO1xuICAgICAgICAgICAgLy8gQVNTRVJUIG9uZSBjYXJkIGlzIHBsYXkgc3VpdGUsIHRoZSBvdGhlciBtdXN0IGJlIHRydW1wIHN1aXRlXG4gICAgICAgICAgICByZXR1cm4oY2FyZDFTdWl0ZT09ND8xOi0xKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUsIGJvdGggY2FyZHMgYXJlIGlycmVsZXZhbnQgKHNob3VsZCBoYXBwZW4gdGhvdWdoKVxuICAgICAgICByZXR1cm4gMDsgLy8gY29uc2lkZXJlZCBlcXVhbCB0aGF0IGlzIGlycmVsZXZhbnRcbiAgICB9XG4gICAgXG4gICAgLy8gLy8geW91J2QgaGF2ZSB0byB1c2UgdGhlIEFwcGxlIFN5bWJvbHMgZm9udFxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmlPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CsTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4K+PC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgr08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CuzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4K6PC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgrk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CuDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4K3PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgrY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CtTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4K0PC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgrM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CsjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaM8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4ORPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg548L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DnTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4ObPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg5o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DmTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OYPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg5c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DljwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OVPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg5Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DkzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OSPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpjwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg4E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DjjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4ONPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg4s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DijwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OJPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg4g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DhzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OGPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg4U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DhDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4ODPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg4I8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CoTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4KuPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgq08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CqzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4KqPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgqk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CqDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4KnPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgqY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CpTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4KkPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgqM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CojwvbGk+XG4gICAgc3RhdGljIGdldCBDQVJEX0FQUExFX1NZTUJPTFMoKXtyZXR1cm4gW1xuICAgICAgICBbJ/Cfg4InLCfwn4ODJywn8J+DhCcsJ/Cfg4UnLCfwn4OGJywn8J+DhycsJ/Cfg4gnLCfwn4OJJywn8J+DiicsJ/Cfg4snLCfwn4ONJywn8J+DjicsJ/Cfg4EnXSxcbiAgICAgICAgWyfwn4OSJywn8J+DkycsJ/Cfg5QnLCfwn4OVJywn8J+DlicsJ/Cfg5cnLCfwn4OYJywn8J+DmScsJ/Cfg5onLCfwn4ObJywn8J+DnScsJ/Cfg54nLCfwn4ORJ10sXG4gICAgICAgIFsn8J+CsicsJ/CfgrMnLCfwn4K0Jywn8J+CtScsJ/CfgrYnLCfwn4K3Jywn8J+CuCcsJ/CfgrknLCfwn4K6Jywn8J+CuycsJ/Cfgr0nLCfwn4K+Jywn8J+CsSddLFxuICAgICAgICBbJ/CfgqInLCfwn4KjJywn8J+CpCcsJ/CfgqUnLCfwn4KmJywn8J+CpycsJ/CfgqgnLCfwn4KpJywn8J+CqicsJ/CfgqsnLCfwn4KtJywn8J+CricsJ/CfgqEnXVxuICAgIF19O1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCl7XG4gICAgICAgIHRoaXMuX2NhcmRTdWl0ZUluZGV4PWNhcmRTdWl0ZUluZGV4O1xuICAgICAgICB0aGlzLl9jYXJkTmFtZUluZGV4PWNhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBDYXJkLlJBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rXCIgb2YgXCIrQ2FyZC5TVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCJzXCI7XG4gICAgfVxuICAgIFxuICAgIGdldCByYW5rKCl7cmV0dXJuIHRoaXMuX2NhcmROYW1lSW5kZXg7fVxuICAgIGdldCBzdWl0ZSgpe3JldHVybiB0aGlzLl9jYXJkU3VpdGVJbmRleDt9XG5cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oKXtcbiAgICAgICAgLy8gaWYgd2UncmUgdXNpbmcgdGhlIHN2Zy1jYXJkcy5zdmcgd2UgY2FuIGRvIHRoZSBmb2xsb3dpbmcsIGJ1dCBpbiB0aGF0IGNhc2Ugd2UnZCBuZWVkIHRvIGtub3cgdGhlIG1hZ25pZmljYXRpb24gZmFjdG9yISEhXG4gICAgICAgIC8vcmV0dXJuIENBUkRfRk9OVF9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy9yZXR1cm4gJzxzdmcgdmlld0JveD1cIjAgMCA2NzYgOTc2XCI+PHVzZSB4bGluazpocmVmPVwiaW1nL3N2Zy1jYXJkcy5zdmcjJytTVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCItXCIrUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XSsnPC91c2U+PC9zdmc+JztcbiAgICAgICAgcmV0dXJuIENhcmQuQ0FSRF9BUFBMRV9TWU1CT0xTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy8vLy8vcmV0dXJuIFNVSVRFX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdLmNvbmNhdChSQU5LX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZE5hbWVJbmRleF0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cz1DYXJkOyIsIi8qKlxuICogZGVmaW5lcyBzb21lb25lIHRoYXQgaG9sZHMgY2FyZHNcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcblxuY2xhc3MgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTURIQDA0REVDMjAxOTogYWxsb3dpbmcgbm93IHRvIGNvbnN0cnVjdCBmaXhlZCBzaXplIGNhcmQgaG9sZGVycyAobGlrZSBUcmljaylcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhcmRzPTApe1xuICAgICAgICB0aGlzLl9jYXJkcz1bXTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZDYXJkcz1udW1iZXJPZkNhcmRzO1xuICAgICAgICB3aGlsZSgtLW51bWJlck9mQ2FyZHM+PTApdGhpcy5fY2FyZHMucHVzaChudWxsKTtcbiAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlO1xuICAgIH1cblxuICAgIC8vIG1ldGhvZHMgdG8gYWRqdXN0IHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBfcmVtb3ZlQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5pbmRleE9mKGNhcmQpO1xuICAgICAgICBpZihjYXJkSW5kZXg+PTApe1xuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHMuc3BsaWNlKGNhcmRJbmRleCwxKS5sZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIitjYXJkK1wiIHJlbW92ZWQgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiLlwiKTtcbiAgICAgICAgICAgICAgICBjYXJkLl9ob2xkZXI9bnVsbDsgLy8gd2hlbiBzdWNjZXNzZnVsIGFwcGFyZW50bHkgbm8gbG9uZ2VyIGF2YWlsYWJsZSEhIVxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiIG9mIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCI6IGl0IGlzIG5vdCBwcmVzZW50LlwiKTtcbiAgICB9XG4gICAgX2FkZENhcmQoY2FyZCl7XG4gICAgICAgIGlmKCFjYXJkKXJldHVybjtcbiAgICAgICAgaWYoIShjYXJkIGluc3RhbmNlb2YgSG9sZGFibGVDYXJkKSl0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBob2xkYWJsZSBjYXJkIVwiKTtcbiAgICAgICAgdGhpcy5sb2coXCJBZGRpbmcgY2FyZCBcIitjYXJkLnRvU3RyaW5nKCkrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICB0aGlzLl9jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+bnVtYmVyT2ZDYXJkc05vdyl7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7IC8vIGNhbiBubyBsb25nZXIgZ3VhcmFudGVlIHRoYXQgaXQgaXMgc29ydGVkLi4uXG4gICAgICAgICAgICBjYXJkLl9ob2xkZXI9dGhpcztcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgKFwiK2NhcmQudG9TdHJpbmcoKStcIikgYWRkZWQgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgICAgIC8vIGhvdyBhYm91dCBvcmRlcmluZyB0aGUgY2FyZHM/Pz8/Pz8gb3Igc3RvcmluZyB0aGVtIGJ5IHN1aXRlPz8/P1xuICAgICAgICAgICAgdGhpcy5sb2coXCJcXHRDYXJkIGNvbGxlY3Rpb246IFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2FyZCBcIitjYXJkK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIiAoZGVsdGEgbnVtYmVyIG9mIGNhcmRzOiBcIisodGhpcy5udW1iZXJPZkNhcmRzLW51bWJlck9mQ2FyZHNOb3cpK1wiKS5cIik7XG4gICAgfVxuICAgIC8qXG4gICAgLy8gcmVwbGFjZSBhIGNhcmQgYXQgYSBnaXZlbiBpbmRleCAoYXMgdXNlZCBpbiBUcmljaylcbiAgICBfc2V0Q2FyZEF0SW5kZXgoY2FyZCxpbmRleCl7XG4gICAgICAgIGlmKGluZGV4PDB8fGluZGV4Pj10aGlzLm51bWJlck9mQ2FyZHMpdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVwbGFjZSBjYXJkICNcIitTdHJpbmcoaW5kZXgrMSkrXCIuXCIpO1xuICAgICAgICBsZXQgY2FyZEF0SW5kZXg9dGhpcy5fY2FyZHNbaW5kZXhdO1xuICAgICAgICBpZihjYXJkQXRJbmRleCl7Y2FyZEF0SW5kZXguX2hvbGRlcj1udWxsO3RoaXMuX2NhcmRzW2luZGV4XT1udWxsO31cbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBpZiAnY29udGFpbmVkJyBpbiBhbm90aGVyIGNhcmQgaG9sZGVyIHJlbW92ZSBpdCBmcm9tIHRoZXJlISEhXG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgaWYoY2FyZC5faG9sZGVyKWNhcmQuX2hvbGRlci5yZW1vdmVDYXJkKGNhcmQpO1xuICAgICAgICAgICAgICAgIGlmKCFjYXJkLl9ob2xkZXIpe3RoaXMuX2NhcmRzW2luZGV4XT1jYXJkO2NhcmQuX2hvbGRlcj10aGlzO30gICAgXG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe31cbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIC8vIHBvbGwgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIGdldCBudW1iZXJPZkNhcmRzKCl7cmV0dXJuIHRoaXMuX2NhcmRzLmxlbmd0aDt9XG5cbiAgICBnZXRDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnJhbms9PXJhbms7fSk7XG4gICAgfVxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShzdWl0ZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQuc3VpdGU9PXN1aXRlO30pLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50XG4gICAgICovXG4gICAgZ2V0U3VpdGVzKCl7XG4gICAgICAgIC8vIGNhbid0IHVzZSB0aGlzIGluIGZpbHRlciEhISByZXR1cm4gWzAsMSwyLDNdLmZpbHRlcigocmFuayk9PntyZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspPjA7fSk7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGNhcmRzIGluIHRoZSBob2xkZXIgd2l0aCB0aGUgZ2l2ZW4gcmFua1xuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGFsbCBzdWl0ZXMsIHdpdGggLTEgd2hlcmUgYSBzdWl0ZSBpcyBub3QgcHJlc2VudCBpbiB0aGUgY3VycmVudCBjYXJkcyBcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aG91dFJhbmsocmFuayl7XG4gICAgICAgIGxldCBzdWl0ZXM9WzAsMSwyLDNdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzW2NhcmQuc3VpdGVdPS0xO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50IG9mIHdoaWNoIHRoZSBwbGF5ZXIgZG9lcyBub3QgaGF2ZSB0aGUgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBnZXRSYW5rbGVzc1N1aXRlcyhyYW5rKXtcbiAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVzPVtdO1xuICAgICAgICBsZXQgc3VpdGVzV2l0aFJhbmtzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGNhcmQpPT57XG4gICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwJiZzdWl0ZXNXaXRoUmFua3MuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5jYXJkTmFtZUluZGV4PT1yYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1aXRlc1dpdGhSYW5rcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBzdWl0ZSBpZiBhbHJlYWR5IHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW5rbGVzc1N1aXRlSW5kZXg9cmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVJbmRleD49MClyYW5rbGVzc1N1aXRlcy5zcGxpY2UocmFua2xlc3NTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSAvLyB1bnRpbCBwcm92ZW4gZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmtsZXNzU3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmFua2xlc3NTdWl0ZXM7XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzWzBdO31cblxuICAgIGNvbnRhaW5zQ2FyZChzdWl0ZSxyYW5rKXtcbiAgICAgICAgbGV0IGNhcmQ9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmQ+PTAmJih0aGlzLl9jYXJkc1tjYXJkXS5zdWl0ZSE9PXN1aXRlfHx0aGlzLl9jYXJkc1tjYXJkXS5yYW5rIT09cmFuaykpO1xuICAgICAgICByZXR1cm4oY2FyZD49MCk7IC8vIGZvdW5kIGlmIGNhcmQgaXMgbm90IG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FuIGV4cG9zZSBhIHRleHQgcmVwcmVzZW50aW9uXG4gICAgICovXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHN1aXRlU2VwYXJhdG9yKXtcbiAgICAgICAgdGhpcy5sb2coXCJOdW1iZXIgb2YgY2FyZHMgdG8gcmVwcmVzZW50OiBcIit0aGlzLl9jYXJkcy5sZW5ndGgrXCIuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgc29ydGluZz8/Pz8/Pz8/IHRoYXQgd291bGQgYmUgbmljZVxuICAgICAgICBpZihzdWl0ZVNlcGFyYXRvciYmdHlwZW9mIHN1aXRlU2VwYXJhdG9yPT09XCJzdHJpbmdcIiYmIXRoaXMuX3NvcnRlZCl7XG4gICAgICAgICAgICB0aGlzLl9jYXJkcy5zb3J0KGNvbXBhcmVDYXJkcyk7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9dHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5fc29ydGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLm1hcCgoY2FyZCk9PntyZXR1cm4gY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTt9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgLy8gY2FyZHMgYXJlIHN1cHBvc2VkIHRvIGJlIHNvcnRlZFxuICAgICAgICBsZXQgdGV4dFJlcHJlc2VudGF0aW9uPVwiXCI7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGxldCBjYXJkPXRoaXMuZ2V0Rmlyc3RDYXJkKCk7XG4gICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb249Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTE7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz0oY2FyZC5zdWl0ZSE9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT9zdWl0ZVNlcGFyYXRvcjpcIiBcIik7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dFJlcHJlc2VudGF0aW9uOyAvLyBhIHNpbmdsZSBibGFuayBiZXR3ZWVuIHRoZW0hISFcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhIGNhcmQgd2l0aCBhIGNhcmQgaG9sZGVyIGlzIGhlbGRcbiAqL1xuY2xhc3MgSG9sZGFibGVDYXJkIGV4dGVuZHMgQ2FyZHtcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSE9MREFCTEVDQVJEID4+PiBcIit0b2xvZyk7XG4gICAgfVxuXG4gICAgc2V0IGhvbGRlcihob2xkZXIpe1xuICAgICAgICB0aGlzLmxvZyhcIkNoYW5naW5nIHRoZSBob2xkZXIgb2YgY2FyZCBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgY3VycmVudCBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYodGhpcy5faG9sZGVyKXRoaXMuX2hvbGRlci5fcmVtb3ZlQ2FyZCh0aGlzKTtcbiAgICAgICAgLy8gYWRkICh3aGVuIHN1Y2Nlc3NmdWxseSByZW1vdmVkKSB0byB0aGUgbmV3IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZighdGhpcy5faG9sZGVyJiZob2xkZXIpaG9sZGVyLl9hZGRDYXJkKHRoaXMpO2Vsc2UgdGhpcy5sb2coXCJFUlJPUjogVW5hYmxlIHRvIGNoYW5nZSB0aGUgaG9sZGVyIVwiKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4LGhvbGRlcil7XG4gICAgICAgIHN1cGVyKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpO1xuICAgICAgICB0aGlzLl9ob2xkZXI9bnVsbDtcbiAgICAgICAgdGhpcy5ob2xkZXI9aG9sZGVyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIFwiSG9sZGFibGUgXCIrc3VwZXIudG9TdHJpbmcoKTt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9e0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfTsiLCIvKipcbiAqIGEgcGxhY2Vob2xkZXIgZm9yIGEgcGxheWVyXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG4vKipcbiAqIGEgUGxheWVyIGNhbiBtYWtlIGEgYmlkLCBvciBwbGF5IGEgY2FyZCwgY2hvb3NlIGEgdHJ1bXAgYW5kIHBhcnRuZXIgc3VpdGVcbiAqL1xuY2xhc3MgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBiaWRNYWRlKGJpZCl7fVxuICAgIGNhcmRQbGF5ZWQoY2FyZCl7fVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7fVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe31cbn1cblxuLy8gTURIQDA3REVDMjAxOTogUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXIgd2l0aCBnYW1lIGRhdGEgZXhwb3NlZCB0byBwbGF5ZXJcbi8vICAgICAgICAgICAgICAgIHdoaWNoIHdhcyBlYXJsaWVyIHN0b3JlZCBpbiBlYWNoIHRyaWNrXG5jbGFzcyBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBzdGF0aWMgZ2V0IEJJRF9OQU1FUygpe3JldHVybiBbXCJwYXNcIixcInJpa1wiLFwicmlrIChiZXRlcilcIixcIm5lZ2VuIGFsbGVlblwiLFwibmVnZW4gYWxsZWVuIChiZXRlcilcIixcInBpY29cIixcInRpZW4gYWxsZWVuXCIsXCJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCIxMSBhbGxlZW5cIixcIjExIGFsbGVlbiAoYmV0ZXIpXCIsXCJtaXNlcmVcIixcIjEyIGFsbGVlblwiLFwiMTIgYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzZXJlXCIsXCIxMyBhbGxlZW5cIixcIjEzIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc2VyZSBtZXQgZWVuIHByYWF0amVcIixcInRyb2VsYVwiLFwic2Nob3BwZW4gdnJvdXcgZW4gbGFhdHN0ZSBzbGFnXCJdO307XG4gICAgc3RhdGljIGdldCBCSURfUEFTKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUsoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJS19CRVRFUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BJQ08oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBCSURfTUlTRVJFKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTigpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRSgpe3JldHVybiAxMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOKCl7cmV0dXJuIDE0O307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkUoKXtyZXR1cm4gMTY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UUk9FTEEoKXtyZXR1cm4gMTc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUdfRU5fU0NIT1BQRU5fVlJPVVcoKXtyZXR1cm4gMTg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRFNfQUxMX0NBTl9QTEFZKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9QSUNPLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRV07fTsgLy8gdHJ1bXBsZXNzIGdhbWVzXG4gICAgc3RhdGljIGdldCBCSURTX1dJVEhfUEFSVE5FUl9JTl9IRUFSVFMoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1JJS19CRVRFUixQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVJdO307IC8vIGdhbWVzIHdpdGggdHJ1bXAgcGxheWVkIHdpdGggYSBwYXJ0bmVyXG4gICAgc3RhdGljIGdldCBCSURfUkFOS1MoKXtyZXR1cm4gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDAsLTFdO307IC8vIGhvdyBJIHBsYXllZCBpdCAoYmlkIHBhc3MgZXhjbHVkZWQgKGFsd2F5cyByYW5rIDApKVxuICAgIFxuICAgIC8vIGVhY2ggYmlkIGhhcyBhIGNlcnRhaW4gYW1vdW50IG9mIHBvaW50cyB0byByZWNlaXZlIHdoZW4gd2lubmluZyB0aGUgZ2FtZVxuICAgIHN0YXRpYyBnZXQgQklEX1BPSU5UUygpe3JldHVybiBbMCwxLDEsMiwyLDQsMywzLDQsNCw1LDUsNSw2LDEwLDIsMl07fVxuXG4gICAgLy8gdGhlIHN0YXRlIGNvbnN0YW50cyB3ZSBoYXZlXG4gICAgc3RhdGljIGdldCBPVVRfT0ZfT1JERVIoKXtyZXR1cm4gMDt9XG4gICAgc3RhdGljIGdldCBJRExFKCl7cmV0dXJuIDE7fVxuICAgIHN0YXRpYyBnZXQgREVBTElORygpe3JldHVybiAyO31cbiAgICBzdGF0aWMgZ2V0IEJJRERJTkcoKXtyZXR1cm4gMzt9XG4gICAgc3RhdGljIGdldCBQTEFZSU5HKCl7cmV0dXJuIDQ7fVxuICAgIHN0YXRpYyBnZXQgQ0FOQ0VMSU5HKCl7cmV0dXJuIDU7fVxuICAgIHN0YXRpYyBnZXQgRklOSVNIRUQoKXtyZXR1cm4gNjt9XG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXt9XG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe31cbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe31cbiAgICBnZXRIaWdoZXN0QmlkKCl7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllcil7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe31cbiAgICBnZXQgcG9pbnRzKCl7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXIsb3RoZXJQbGF5ZXIpe31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7fVxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXt9XG59XG5cbmNvbnN0IENIT0lDRV9JRFM9W1wiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiXTtcblxuY29uc3QgUExBWUVSVFlQRV9GT089MCxQTEFZRVJUWVBFX1VOS05PV049MSxQTEFZRVJUWVBFX0ZSSUVORD0yO1xuXG4vLyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgUGxheWVyIGluc3RhbmNlc1xuLy8gd291bGQgYmUgZGVmaW5lZCBhYnN0cmFjdCBpbiBjbGFzc2ljYWwgT09cbmNsYXNzIFBsYXllciBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBMQVlFUiA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICBhZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyJiZwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLnB1c2gocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGV2ZW50IGxpc3RlbmVyczogXCIrdGhpcy5fZXZlbnRMaXN0ZW5lcnMrXCIuXCIpO1xuICAgIH1cblxuICAgIC8vIHdoZW5ldmVyIGEgZ2FtZSBpcyBzdGFydGVkLCBjYWxsIG5ld0dhbWUhIVxuICAgIG5ld0dhbWUoKXtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MHx8IXRoaXMuX2dhbWUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgXCIrdGhpcy5uYW1lK1wiIHVuYWJsZSB0byBwcmVwYXJlIGZvciBwbGF5aW5nOiBub3QgYXNzb2NpYXRlZCB3aXRoIGEgZ2FtZSB5ZXQuXCIpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQlVHOiBQbGF5ZXIgXCIrdGhpcy5uYW1lK1wiIHN0aWxsIGhhcyBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMuXCIpO1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gYmV0dGVyIGRvbmUgdGhpcyB3YXkgaW5zdGVhZCBvZiB0aGlzLl9jYXJkcz1bXVxuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmF1bHQgcGxheWVyIHJlbWVtYmVyaW5nIGl0cyBjaG9pY2VzXG4gICAgICAgIHRoaXMuX2JpZD0tMTsgLy8gdGhlIGxhc3QgYmlkIG9mIHRoaXMgcGxheWVyXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsO1xuICAgICAgICAvLyB0aGUgZ2FtZSBiZWluZyBwbGF5ZWQsIGFuZCB0aGUgaW5kZXggd2l0aGluIHRoYXQgZ2FtZVxuICAgICAgICB0aGlzLl9wYXJ0bmVyPS0xO1xuICAgICAgICB0aGlzLl90cmlja3NXb249W107IC8vIHRoZSB0cmlja3Mgd29uIChpbiBhbnkgZ2FtZSlcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj0tMTsgLy8gZG9lc24ndCBtYXR0ZXJcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lLHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzPVtdO1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgICAgIGlmKCEocGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpKXRocm93IG5ldyBFcnJvcihcIlBsYXllciBldmVudCBsaXN0ZW5lciBvZiB3cm9uZyB0eXBlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB3YWl0IGZvciByZWNlaXZpbmcgZ2FtZSBhbmQgaW5kZXhcbiAgICAgICAgdGhpcy5faW5kZXg9LTE7dGhpcy5fZ2FtZT1udWxsOyAvLyB3YWl0aW5nIGZvciB0aGUgZ2FtZSB0byBiZSBwbHVnZ2VkIGluIChvbmNlKVxuICAgICAgICAvLyByZW1vdmVkIHdhaXQgdW50aWwgZ2V0dGluZyBjYWxsZWQgdGhyb3VnaCBuZXdHYW1lOiB0aGlzLl9wcmVwYXJlRm9yUGxheWluZygpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICAvLyBnZXR0ZXJzIGV4cG9zaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBtYWRlIGNob2ljZVxuICAgIC8vIE5PVEUgbm8gbG9uZ2VyIGNhbGxlZCBieSB0aGUgZ2FtZSBiZWNhdXNlIHRoZSBjaG9pY2UgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IG5vd1xuICAgIC8vICAgICAgdGhpcyB3YXkgc3ViY2xhc3NlcyBhcmUgbm90IG9ibGlnYXRlZCB0byByZW1lbWJlciB0aGUgY2hvaWNlcyB0aGV5IG1ha2VcbiAgICBnZXQgYmlkKCl7cmV0dXJuIHRoaXMuX2JpZDt9XG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldCBjYXJkKCl7cmV0dXJuIHRoaXMuY2FyZCgpO31cblxuICAgIGdldCBwYXJ0bmVyKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXI7fVxuXG4gICAgLy8vLy8vLy8vLy8vLy9nZXQgY2FyZCgpe3JldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkUGxheUluZGV4XTt9XG5cbiAgICAvKiBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBnYW1lXG4gICAgLy8gY2FuIGJlIHNldCBkaXJlY3RseSB3aGVuIGEgYmV0dGVyICdyaWsnIHZhcmlhdGlvbiBiaWQgd2FzIGRvbmUhISEhXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgXG4gICAgLy8gVE9ETyBpdCB3b3VsZCBiZSBlYXNpZXIgdG8gY29tYmluZSB0aGVzZSBpbiBhIGNhcmQhISEhXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG5cbiAgICAvLyBjYWxsZWQgZnJvbSB0aGUgVUkgdG8gc2V0IHRoZSB0cnVtcCBzdWl0ZSEhISFcbiAgICBzZXQgdHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXt0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKCk7fVxuICAgIHNldCBwYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMucGFydG5lclN1aXRlQ2hvc2VuKCk7fVxuICAgICovXG5cbiAgICAvLyBlbmQgb2YgZ2V0dGVycy9zZXR0ZXJzIHVzZWQgYnkgdGhlIGdhbWVcbiAgICBfcmVtb3ZlQ2FyZHMoKXt3aGlsZSh0aGlzLl9jYXJkcy5sZW5ndGg+MCl0aGlzLl9jYXJkcy5zaGlmdCgpLmhvbGRlcj1udWxsO31cblxuICAgIGdldCBnYW1lKCl7cmV0dXJuIHRoaXMuX2dhbWU7fVxuICAgIHNldCBnYW1lKGdhbWUpe1xuICAgICAgICBpZih0aGlzLl9nYW1lPT09Z2FtZSlyZXR1cm47XG4gICAgICAgIGlmKGdhbWUmJiEoZ2FtZSBpbnN0YW5jZW9mIFBsYXllckdhbWUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZSBpbnN0YW5jZSBzdXBwbGllZCB0byBwbGF5ZXIgXCIrKHRoaXMubmFtZXx8XCI/XCIpK1wiIG5vdCBvZiB0eXBlIFBsYXllckdhbWUuXCIpO1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gaW5kZXggb2YgcGxheWVyIFwiKyh0aGlzLm5hbWV8fFwiP1wiKStcIiB1bmtub3duIVwiKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gTURIQDExSkFOMjAyMDogaWYgdGhlIGdhbWUgY2hhbmdlcyB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBjYXJkc1xuICAgICAgICB0aGlzLl9nYW1lPWdhbWU7XG4gICAgICAgIC8vIHN5bmMgX2luZGV4XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgLy8gcHJlcGFyZSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5wYXJ0bmVyPS0xOyAvLyBteSBwYXJ0bmVyIChvbmNlIEkgbm93IHdobyBpdCBpcylcbiAgICAgICAgICAgIHRoaXMudHJpY2tzV29uPVtdOyAvLyBzdG9yaW5nIHRoZSB0cmlja3Mgd29uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgaW5kZXgoaW5kZXgpe3RoaXMuX2luZGV4PWluZGV4O30gLy8gTURIQDA5SkFOMjAyMDogc29tZXRpbWVzIGFuIGluZGV4IGNhbiBiZSBzZXQgc2VwYXJhdGVseVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgdGhpcy5pbmRleD1pbmRleDtcbiAgICAgICAgdGhpcy5nYW1lPWdhbWU7XG4gICAgfVxuICAgIC8qXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgc3VwZXIuYWRkQ2FyZChjYXJkKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMrXCInIHJlY2VpdmVkIGNhcmQgJ1wiK2NhcmQrXCInLlwiKTtcbiAgICB9XG4gICAgKi9cbiAgICBfZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSx3aGVuTm90Rm91bmRDYXJkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybihjYXJkLnN1aXRlPT1jYXJkU3VpdGUpO30pO1xuICAgIH1cblxuICAgIF9nZXRTdWl0ZUNhcmRzKCl7XG4gICAgICAgIHRoaXMubG9nKFwiRGV0ZXJtaW5pbmcgc3VpdGUgY2FyZHMgb2YgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzIVwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZHM9W1tdLFtdLFtdLFtdXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntzdWl0ZUNhcmRzW2NhcmQuc3VpdGVdLnB1c2goY2FyZCk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZUNhcmRzO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBvZiBhIGdpdmVuIGNhcmQgc3VpdGUgKG9yIGFueSBjYXJkIGlmIGNhcmRTdWl0ZSBpcyB1bmRlZmluZWQpXG4gICAgY29udHJpYnV0ZVRvVHJpY2sodHJpY2spIHtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPT0wKXRocm93IG5ldyBFcnJvcihcIk5vIGNhcmRzIGxlZnQgdG8gcGxheSFcIik7XG4gICAgICAgIGxldCBjYXJkc09mU3VpdGU9dGhpcy5fZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSk7XG4gICAgICAgIGxldCBjYXJkPShjYXJkc09mU3VpdGUmJmNhcmRzT2ZTdWl0ZS5sZW5ndGg+MD9jYXJkc09mU3VpdGVbMF06dGhpcy5fY2FyZHNbMF0pO1xuICAgICAgICBjYXJkLmhvbGRlcj10cmljazsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGUgdHJpY2tcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIG1hZGUgYSBiaWRcbiAgICBfYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycykgLy8gY2F0Y2ggYW55IGVycm9yIHRocm93biBieSBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5eyghZXZlbnRMaXN0ZW5lcnx8ZXZlbnRMaXN0ZW5lci5iaWRNYWRlKHRoaXMuX2JpZCkpO31jYXRjaChlcnJvcil7fX0pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2luZyBiaWQgXCIrdGhpcy5fYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyB0byB0aGUgZ2FtZSFcIik7XG4gICAgICAgICAgICB0aGlzLl9nYW1lLmJpZE1hZGUodGhpcy5fYmlkKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IE5vIGdhbWUgdG8gcGFzcyBiaWQgXCIrdGhpcy5fYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJy5cIik7XG4gICAgfVxuICAgIF9zZXRCaWQoYmlkKXt0aGlzLl9iaWRNYWRlKHRoaXMuX2JpZD1iaWQpO31cblxuICAgIF9jYXJkUGxheWVkKGNhcmQpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e2V2ZW50TGlzdGVuZXIuY2FyZFBsYXllZChjYXJkKTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLmNhcmRQbGF5ZWQoY2FyZCk7XG4gICAgfVxuICAgIC8vIFRPRE8gYSBiaWQgc2V0dGVyIHdpbGwgYWxsb3cgc3ViY2xhc3NlcyB0byBwYXNzIGEgYmlkIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5XG4gICAgX3NldENhcmQoY2FyZCl7XG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHBsYXllZCBjYXJkIGlzIHZhbGlkIHNob3VsZCBiZSBkb25lIGhlcmUsIG9yIEJFRk9SRSBjYWxsaW5nIHNldENhcmRcbiAgICAgICAgdGhpcy5fY2FyZFBsYXllZCh0aGlzLl9jYXJkPWNhcmQpO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvb3NlbiBhIHRydW1wIHN1aXRlXG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci50cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLnRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpe3RoaXMudHJ1bXBTdWl0ZUNob3Nlbih0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGUpO31cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvc2VuIGEgcGFydG5lclxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5wYXJ0bmVyU3VpdGVDaG9zZW4odGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZSk7fVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIG1ha2UgYSBiaWQgcGFzc2luZyBpbiB0aGUgaGlnaGVzdCBiaWQgc28gZmFyXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIG1ha2VBQmlkKHBsYXllcmJpZHMpe1xuICAgICAgICAvLyBhc3N1bWVzIHRoYXQgdGhpcyBwbGF5ZXIgaGFzIG1hZGUgYSBiaWQgYmVmb3JlLCBvciB0aGF0IHRoaXMgaXMgdGhlIGZpcnN0IGJpZFxuICAgICAgICAvLyB0aGlzIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYXNzdW1lcyB0byBiZSBydW5uaW5nIGluIGEgYnJvd3NlciBzbyB3ZSBjYW4gdXNlIHByb21wdCgpXG4gICAgICAgIC8vIGFsbCBvdGhlciBhdmFpbGFibGUgYmlkcyBzaG91bGQgYmUgYmV0dGVyIHRoYW4gdGhlIGxhc3QgYmlkIGJ5IGFueSBvdGhlciBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRTb0Zhcj1QbGF5ZXJHYW1lLkJJRF9QQVM7XG4gICAgICAgIGlmKHBsYXllcmJpZHMpe1xuICAgICAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgYmlkczpcIixwbGF5ZXJiaWRzKTtcbiAgICAgICAgICAgIGZvcihsZXQgcGxheWVyPTA7cGxheWVyPHBsYXllcmJpZHMubGVuZ3RoO3BsYXllcisrKVxuICAgICAgICAgICAgICAgIGlmKHBsYXllcmJpZHNbcGxheWVyXS5sZW5ndGg+MCYmcGxheWVyYmlkc1twbGF5ZXJdWzBdPmhpZ2hlc3RCaWRTb0ZhcilcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdEJpZFNvRmFyPXBsYXllcmJpZHNbcGxheWVyXVswXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZyhcIkhpZ2hlc3QgYmlkIHNvIGZhcjogJ1wiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0rXCInLlwiKTtcbiAgICAgICAgLy8gaWYgdGhlIGhpZ2hlc3QgcG9zc2libGUgYmlkIGlzIG5vdCBhIGJpZCBhbGwgY2FuIHBsYXkgKGF0IHRoZSBzYW1lIHRpbWUpLCBjYW4ndCBiZSBiaWQgYWdhaW5cbiAgICAgICAgaWYoUGxheWVyR2FtZS5CSURTX0FMTF9DQU5fUExBWS5pbmRleE9mKFBsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0pPDApaGlnaGVzdEJpZFNvRmFyKys7XG4gICAgICAgIGxldCBwb3NzaWJsZUJpZE5hbWVzPVBsYXllckdhbWUuQklEX05BTUVTLnNsaWNlKGhpZ2hlc3RCaWRTb0Zhcik7XG4gICAgICAgIHBvc3NpYmxlQmlkTmFtZXMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1tQbGF5ZXJHYW1lLkJJRF9QQVNdKTsgLy8gdXNlciBjYW4gYWx3YXlzICdwYXMnXG4gICAgICAgIHRoaXMubG9nKFwiUG9zc2libGUgYmlkczogXCIscG9zc2libGVCaWROYW1lcyk7XG4gICAgICAgIGxldCBiaWQ9LTE7XG4gICAgICAgIHdoaWxlKGJpZDwwKXtcbiAgICAgICAgICAgIGxldCBiaWRuYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBpcyB5b3VyIGJpZCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQmlkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZUJpZE5hbWVzWzBdKTtcbiAgICAgICAgICAgIGJpZD1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5pbmRleE9mKGJpZG5hbWUpO1xuICAgICAgICAgICAgaWYoYmlkPDApY29udGludWU7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0QmlkKGJpZCk7XG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGJpZD0tMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgLy8gaWYgdGhpcyBwbGF5ZXIgaGFzIGFsbCBhY2VzIGl0J3MgZ29ubmEgYmUgdGhlIHN1aXRlIG9mIGEga2luZyB0aGUgcGVyc29uIGhhc24ndFxuICAgICAgICAvLyBhbHNvIGl0IG5lZWRzIHRvIGJlIGFuIGFjZSBvZiBhIHN1aXRlIHRoZSB1c2VyIGhhcyBpdHNlbGYgKHVubGVzcyB5b3UgaGF2ZSBhbGwgb3RoZXIgYWNlcylcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgLy8gYW55IG9mIHRoZSBzdWl0ZXMgaW4gdGhlIGNhcmRzIGNhbiBiZSB0aGUgdHJ1bXAgc3VpdGUhXG4gICAgICAgIGxldCBwb3NzaWJsZVRydW1wU3VpdGVOYW1lcz10aGlzLmdldFN1aXRlcygpLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUodHJ1bXBTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCB0cnVtcE5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IHN1aXRlIHdpbGwgYmUgdHJ1bXAgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHRydW1wU3VpdGU9cG9zc2libGVUcnVtcFN1aXRlTmFtZXMuaW5kZXhPZih0cnVtcE5hbWUpO1xuICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB0cnVtcFN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBhc2tzIGZvciB0aGUgc3VpdGUgb2YgdGhlIHBhcnRuZXIgY2FyZCBvZiB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGNob29zZVBhcnRuZXJTdWl0ZSgpe1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPVJBTktfQUNFO1xuICAgICAgICAvLyBnZXQgYWxsIHRoZSBhY2VsZXNzIHN1aXRlc1xuICAgICAgICBsZXQgc3VpdGVzPXRoaXMuZ2V0U3VpdGVzKCk7XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg9PTApeyAvLyBwbGF5ZXIgaGFzIEFMTCBhY2VzXG4gICAgICAgICAgICBpZihzdWl0ZXMubGVuZ3RoPDQpeyAvLyBidXQgbm90IGFsbCBzdWl0ZXNcbiAgICAgICAgICAgICAgICAvLyBhbGwgdGhlIHN1aXRzIHRoZSB1c2VyIGRvZXMgbm90IGhhdmUgYXJlIGFsbG93ZWQgKGFza2luZyB0aGUgYWNlIGJsaW5kISEhKVxuICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz1bMCwxLDIsM10uZmlsdGVyKChzdWl0ZSk9PntyZXR1cm4gcG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2Yoc3VpdGUpPDA7fSk7XG4gICAgICAgICAgICB9ZWxzZXsgLy8gaGFzIGFsbCBzdWl0cywgc28gYSBraW5nIGlzIHRvIGJlIHNlbGVjdGVkISEhXG4gICAgICAgICAgICAgICAgLy8gYWxsIGtpbmdzIGFjY2VwdGFibGUgZXhjZXB0IGZvciB0aGF0IGluIHRoZSB0cnVtcCBjb2xvclxuICAgICAgICAgICAgICAgIC8vIE5PVEUgaWYgYSBwZXJzb24gYWxzbyBoYXMgYWxsIHRoZSBraW5ncyB3ZSBoYXZlIGEgc2l0dWF0aW9uLCB3ZSBzaW1wbHkgY29udGludWUgb253YXJkXG4gICAgICAgICAgICAgICAgd2hpbGUoMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rLS07XG4gICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRydW1wU3VpdGVJbmRleD1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZih0aGlzLl90cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZUluZGV4Pj0wKXBvc3NpYmxlUGFydG5lclN1aXRlcy5zcGxpY2UodHJ1bXBTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPjApYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzPXBvc3NpYmxlUGFydG5lclN1aXRlcy5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUocGFydG5lclN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZU5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IFwiK0NhcmQuQ0FSRF9OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua10rXCIgc2hvdWxkIHlvdXIgcGFydG5lciBoYXZlIChvcHRpb25zOiAnXCIrcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgcGFydG5lclN1aXRlPXBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuaW5kZXhPZihwYXJ0bmVyU3VpdGVOYW1lKTtcbiAgICAgICAgICAgIGlmKHBhcnRuZXJTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBwYXJ0bmVyKHBhcnRuZXIpe3RoaXMuX3BhcnRuZXI9cGFydG5lcjt9IC8vIHRvIHNldCB0aGUgcGFydG5lciBvbmNlIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgY2FyZCBpcyBpbiB0aGUgdHJpY2shISEhXG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgYW5kIGFkZCBpdCB0byB0aGUgZ2l2ZW4gdHJpY2tcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgcGxheUFDYXJkKHRyaWNrKXtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgYXNrZWQgdG8gcGxheSBhIGNhcmQuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgdXNpbmcgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlIGFscGhhYmV0P1xuICAgICAgICBsZXQgcG9zc2libGVDYXJkTmFtZXM9W107XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIHBvc3NpYmxlQ2FyZE5hbWVzLnB1c2goU3RyaW5nLmNhcmRJbmRleCsxKStcIjogXCIrdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgbGV0IGNhcmRQbGF5SW5kZXg9LTE7XG4gICAgICAgIHdoaWxlKGNhcmRQbGF5SW5kZXg8MCl7XG4gICAgICAgICAgICAvLyB3ZSdyZSBzdXBwb3NlZCB0byBwbGF5IGEgY2FyZCB3aXRoIHN1aXRlIGVxdWFsIHRvIHRoZSBmaXJzdCBjYXJkIHVubGVzcyB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGlzIGJlaW5nIGFza2VkIGZvclxuICAgICAgICAgICAgbGV0IGNhcmRJZD1wYXJzZUludChwcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiXFxuUHJlc3MgdGhlIGlkIG9mIHRoZSBjYXJkIHlvdSB3YW50IHRvIGFkZCB0byBcIit0cmljay5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQ2FyZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIsXCJcIikpO1xuICAgICAgICAgICAgaWYoaXNOYU4oY2FyZElkKSljb250aW51ZTtcbiAgICAgICAgICAgIGNhcmRQbGF5SW5kZXg9Y2FyZElkLTE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q2FyZCh0aGlzLl9jYXJkc1tjYXJkUGxheUluZGV4XSk7XG4gICAgfVxuXG4gICAgdHJpY2tXb24odHJpY2tJbmRleCl7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbi5wdXNoKHRyaWNrSW5kZXgpO1xuICAgICAgICB0aGlzLmxvZyhcIlRyaWNrICNcIit0cmlja0luZGV4K1wiIHdvbiBieSAnXCIrdGhpcy5uYW1lK1wiJzogXCIrdGhpcy5fdHJpY2tzV29uK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NXb24oKXtyZXR1cm4gdGhpcy5fdHJpY2tzV29uLmxlbmd0aDt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgdHJpY2tzIHdvbiAoaW5jbHVkaW5nIHRob3NlIGJ5IHRoZSBwYXJ0bmVyIChpZiBhbnkpKVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXJPZlRyaWNrc1dvbit0aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5wYXJ0bmVyKSk7XG4gICAgfVxuXG4gICAgc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihudW1iZXJPZlRyaWNrc1RvV2luKXt0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPW51bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1RvV2luKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIFxuICAgIC8vIGV2ZXJ5IHBsYXllciBjYW4gYmUgY2hlY2tlZCB3aGV0aGVyIGZyaWVuZCAoMSkgb3IgZm9vICgtMSkgb3IgdW5rbm93biAoMClcbiAgICBpc0ZyaWVuZGx5KHBsYXllcil7XG4gICAgICAgIGlmKHBsYXllcj09PXRoaXMuX2luZGV4KXJldHVybiAyOyAvLyBJJ20gbXVjaG8gZnJpZW5kbHkgdG8gbXlzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXsgLy8gYSBub24tc29saXRhcnkgZ2FtZVxuICAgICAgICAgICAgLy8gQVNTRVJUIG5vdCBhIHNvbGl0YXJ5IGdhbWUgc28gcGxheWVyIGNvdWxkIGJlIHRoZSBwYXJ0bmVyIGluIGNyaW1lXG4gICAgICAgICAgICAvLyBpZiBwYXJ0bmVyIGlzIGtub3duIChpLmUuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgbm8gbG9uZ2VyIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lcj49MClyZXR1cm4ocGxheWVyPT09dGhpcy5fcGFydG5lcj8xOi0xKTsgXG4gICAgICAgICAgICAvLyBBU1NFUlQgcGFydG5lciB1bmtub3duIChpLmUuIHBhcnRuZXIgY2FyZCBzdGlsbCBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGxldCB0cnVtcFBsYXllcj10aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk7XG4gICAgICAgICAgICAvLyBpZiBJJ20gdGhlIHRydW1wIHBsYXllciwgYXNzdW1lIEFMTCB1bmZyaWVuZGx5IEJVVCBubyBJIGRvbid0IGtub3cgd2hvIG15IHBhcnRuZXIgaXMgYWxsIGNvdWxkIGJlXG4gICAgICAgICAgICBpZih0aGlzLl9pbmRleD09PXRydW1wUGxheWVyKXJldHVybiAwOyAvLyB1bmtub3duXG4gICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUsdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpKSkgLy8gSSBoYXZlIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICByZXR1cm4ocGxheWVyPT10cnVtcFBsYXllcj8xOi0xKTsgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmcmllbmRseSwgdGhlIG90aGVycyBhcmUgdW5mcmllbmRseVxuICAgICAgICAgICAgLy8gQVNTRVJUIEknbSBub3QgdGhlIHRydW1wIHBsYXllciwgYW5kIEknbSBub3Qgd2l0aCB0aGUgdHJ1bXAgcGxheWVyIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZm9vLCB0aGUgcmVzdCBJIGRvbid0IGtub3cgeWV0XG4gICAgICAgICAgICByZXR1cm4ocGxheWVyPT09dHJ1bXBQbGF5ZXI/LTE6MCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIGEgc29saXRhcnkgZ2FtZVxuICAgICAgICAvLyBpZiBJJ20gb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzLCBldmVyeW9uZSBlbHNlIGlzIGEgZm9vXG4gICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHRoaXMuX2luZGV4KT49MClyZXR1cm4gLTE7XG4gICAgICAgIC8vIEFTU0VSVCBub3Qgb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzXG4gICAgICAgIC8vICAgICAgICBpZiBwbGF5ZXIgaXMgYSBzb2xpdGFyeSBwbGF5ZXIgaXQncyBhIGZvbywgb3RoZXJ3aXNlIGl0J3MgdXMgYWdhaW5zdCB0aGVtISEhIVxuICAgICAgICByZXR1cm4odGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YocGxheWVyKT49MD8tMToxKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiB0aGlzLm5hbWU7fVxuXG59XG5cbi8vIGV4cG9ydCB0aGUgUGxheWVyIGNsYXNzXG5tb2R1bGUuZXhwb3J0cz17UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn07IiwiY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuY2xhc3MgVHJpY2sgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgLy8gTURIQDA3REVDMjAxOTogZ2FtZSBkYXRhIG1vdmVkIG92ZXIgdG8gUGxheWVyR2FtZSBpbnN0YW5jZSAoYXMgcGFzc2VkIHRvIGVhY2ggcGxheWVyKVxuICAgIC8vICAgICAgICAgICAgICAgIGNhbkFza0ZvclBhcnRuZXJDYXJkIGJsaW5kIG5vdyBkZXRlcm1pbmVkIGJ5IHRoZSBnYW1lIChlbmdpbmUpIGl0c2VsZlxuXG4gICAgLy8gYnkgcGFzc2luZyBpbiB0aGUgdHJ1bXAgcGxheWVyIChpLmUuIHRoZSBwZXJzb24gdGhhdCBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkKVxuICAgIGNvbnN0cnVjdG9yKGZpcnN0UGxheWVyLHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLGNhbkFza0ZvclBhcnRuZXJDYXJkKXsgLy8gcmVwbGFjaW5nOiB0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayx0cnVtcFBsYXllcil7XG4gICAgICAgIHN1cGVyKCk7IC8vIHVzaW5nIDQgZml4ZWQgcG9zaXRpb25zIGZvciB0aGUgdHJpY2sgY2FyZHMgc28gd2Ugd2lsbCBrbm93IHdobyBwbGF5ZWQgdGhlbSEhISFcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGNhbiBhc2sgZm9yIHBhcnRuZXIgY2FyZDogXCIrY2FuQXNrRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgICAgICB0aGlzLl9maXJzdFBsYXllcj1maXJzdFBsYXllcjtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlOyAvLyBmb3IgaW50ZXJuYWwgdXNlIHRvIGJlIGFibGUgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXIgb2YgYSB0cmlja1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMuX3BhcnRuZXJSYW5rPXBhcnRuZXJSYW5rOyAvLyBuZWVkIHRoaXMgd2hlbiBpdCdzIGJlaW5nIGFza2VkIHRvIGRldGVybWluZSB0aGUgd2lubmVyXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPWNhbkFza0ZvclBhcnRuZXJDYXJkOyAvLyAtMSBibGluZCwgMCBub3QsIDEgbm9uLWJsaW5kXG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIHRoZSAnZmxhZycgc2V0IGJ5IHRoZSB0cnVtcCBwbGF5ZXIgd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gYSB0cmlja1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9LTE7IC8vIHRoZSBzdWl0ZSBvZiB0aGUgdHJpY2sgKG1vc3Qgb2YgdGhlIHRpbWUgdGhlIHN1aXRlIG9mIHRoZSBmaXJzdCBjYXJkKVxuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPS0xOyAvLyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIChub3RlOiBOT1QgdHJhbnNmb3JtZWQgdG8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggeWV0KVxuICAgICAgICAvLyBsZXQncyBrZWVwIHRyYWNrIG9mIHRoZSBoaWdoZXN0IGNhcmRcbiAgICB9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgLy8gdGhlIHdpbm5lciBleHBvc2VkIGlzIHRoZSBhY3R1YWwgcGxheWVyIHdobyB3b25cbiAgICBnZXQgd2lubmVyKCl7cmV0dXJuKHRoaXMuX3dpbm5lckNhcmQ8MD8tMToodGhpcy5fd2lubmVyQ2FyZCt0aGlzLl9maXJzdFBsYXllciklNCk7fVxuICAgIFxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IG1vdmVkIGZyb20gaGVyZSB0byB0aGUgZ2FtZSAoYXMgYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICAgIC8qXG4gICAgZ2V0IHRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO30gLy8gZXhwb3NlcyB0aGUgY3VycmVudCB0cnVtcCBwbGF5ZXJcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAqL1xuICAgIGdldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDt9XG4gICAgLy8gcGFzcyBpbiAtMSB3aGVuIGFza2luZyB0aGUgcGFydG5lciBjYXJkIGJsaW5kLCBvciArMSB3aGVuIGFza2luZyBmb3IgaXQgKG5vbi1ibGluZClcbiAgICBzZXQgYXNraW5nRm9yUGFydG5lckNhcmQoYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5udW1iZXJPZkNhcmRzPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGdldmVuIGRlIHBhcnRuZXIgYWFzL2hlZXIgKGJsaW5kKSB0ZSB2cmFnZW4gbmlldCBtZWVyIHRvZWdlc3RhYW4uXCIpO1xuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBzZXQgdG8gXCIrdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIF9zZXRXaW5uZXJDYXJkKHdpbm5lckNhcmQpe1xuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPXdpbm5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJpY2sgd2lubmVyIGNhcmQ6IFwiK3dpbm5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGNhcmQgcGxheWVkIGJ5ICh0aGUgYWN0dWFsKSBwbGF5ZXIgKGFzIHVzZWQgZm9yIHNob3dpbmcgdGhlIHRyaWNrIGNhcmRzKVxuICAgICAqIEBwYXJhbSB7Kn0gcGxheWVyIFxuICAgICAqL1xuICAgIGdldFBsYXllckNhcmQocGxheWVyKXtcbiAgICAgICAgbGV0IHBsYXllckNhcmQ9KHRoaXMuX2ZpcnN0UGxheWVyPj0wPyhwbGF5ZXIrNC10aGlzLl9maXJzdFBsYXllciklNDpudWxsKTtcbiAgICAgICAgcmV0dXJuKHBsYXllckNhcmQ+PTAmJnBsYXllckNhcmQ8dGhpcy5udW1iZXJPZkNhcmRzP3RoaXMuX2NhcmRzW3BsYXllckNhcmRdOm51bGwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgYXNraW5nRm9yUGFydG5lckNhcmQoKXtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgIGlmKCF0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZEJsaW5kKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCAoYW55bW9yZSkuXCIpO1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9dGhpcy5fdHJ1bXBTdWl0ZTsgLy8gdGhlIHBsYXkgc3VpdGUgYmVjb21lcyB0aGUgdHJ1bXAgc3VpdGVcbiAgICB9XG4gICAgKi9cbiAgICAvLyBOT1RFIGFkZENhcmQgaXMgTk9UIF9hZGRDYXJkIG9mIHRoZSBzdXBlcmNsYXNzISB0aGlzIGlzIGJlY2F1c2Ugd2Ugc2hvdWxkIHNldCB0aGUgaG9sZGVyIG9uIHRoZSBjYXJkIHRvIGFkZCEhISFcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgICAvLyBpZiB0aGUgZmxhZyBvZiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgaXMgc2V0LCBwcmVzZXQgdGhlIFxuICAgICAgICBjYXJkLmhvbGRlcj10aGlzOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoaXMgdHJpY2sgYnkgc2V0dGluZyB0aGUgaG9sZGVyIHByb3BlcnR5ICh3aWxsIHRha2UgY2FyZSBvZiBhZGRpbmcvcmVtb3ZpbmcgdGhlIGNhcmQpXG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkczw9bnVtYmVyT2ZDYXJkc05vdylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBhZGQgdGhlIGNhcmQgdG8gdGhlIHRyaWNrLlwiKTtcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQgYWRkZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLl90cnVtcFN1aXRlPDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IEFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCwgYnV0IHBsYXlpbmcgYSBnYW1lIHdpdGhvdXQgdHJ1bXAuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciBibGluZCBldmVyeW9uZSBoYXMgdG8gcGxheSB0aGUgcGFydG5lciBjYXJkIHN1aXRlXG4gICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IE9PUFMgSSB3YXMgYWxyZWFkeSB1c2luZyB0aGlzLl9wYXJ0bmVyU3VpdGUgaGVyZSBCVVQgc3RpbGwgYWZ0ZXIgYWN0dWFsbHkgdGFraW5nIGl0IG91dCAobm93IGluIGFnYWluKVxuICAgICAgICBpZih0aGlzLl9wbGF5U3VpdGU8MCl0aGlzLl9wbGF5U3VpdGU9KHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDA/dGhpcy5fcGFydG5lclN1aXRlOmNhcmQuc3VpdGUpO1xuICAgICAgICAvLyBBU1NFUlQgdGhpcy5fcGxheVN1aXRlIG5vdyBkZWZpbml0ZWx5IG5vbi1uZWdhdGl2ZSwgc29cbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9MDsgLy8gdXNlIHRoZSByaWdodCBwcm9wZXJ0eSBicm8nXG4gICAgICAgIC8vIHVwZGF0ZSB3aW5uZXJcbiAgICAgICAgaWYobnVtYmVyT2ZDYXJkc05vdz4wKXtcbiAgICAgICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIG9ubHkgdGhlIHBhcnRuZXIgY2FyZCBjYW4gZXZlciB3aW4gKGV2ZW4gaWYgdGhlcmUncyB0cnVtcCEhKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnV0IHdlIG5lZWQgdG8ga25vdyB3aGV0aGVyIHRoZSBwYXJ0bmVyIGNhcmQgd2FzIGFscmVhZHkgdGhyb3duXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBTT0xVVElPTjogKE5FQVQpIGl0J3MgZWFzaWVzdCB0byBzaW1wbHkgaWdub3JlIHRydW1wIGlzIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yISEhISEhXG4gICAgICAgICAgICBpZihDYXJkcy5XaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZCx0aGlzLl9jYXJkc1t0aGlzLl93aW5uZXJDYXJkXSx0aGlzLl9wbGF5U3VpdGUsKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wPy0xOnRoaXMuX3RydW1wU3VpdGUpKT4wKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQobnVtYmVyT2ZDYXJkc05vdyk7XG4gICAgICAgIH1lbHNlIC8vIGFmdGVyIHRoZSBmaXJzdCBjYXJkIHRoZSBmaXJzdCBwbGF5ZXIgaXMgdGhlIHdpbm5lciBvZiBjb3Vyc2VcbiAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQoMCk7XG4gICAgfVxuICAgIGdldENhcmRQbGF5ZXIoc3VpdGUscmFuayl7XG4gICAgICAgIGZvcihsZXQgcGxheWVyPTA7cGxheWVyPHRoaXMuX2NhcmRzLmxlbmd0aDtwbGF5ZXIrKylcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzW3BsYXllcl0uc3VpdGU9PT1zdWl0ZSYmdGhpcy5fY2FyZHNbcGxheWVyXS5yYW5rPT09cmFuaylcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZpcnN0UGxheWVyK3BsYXllciklNDsgLy8gVE9ETyBjYW4gd2UgYXNzdW1lIDQgcGxheWVycyBpbiB0b3RhbD8/Pz8/XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgZ2V0dGVyc1xuICAgIGdldCBwbGF5U3VpdGUoKXtyZXR1cm4gdGhpcy5fcGxheVN1aXRlO31cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgLypcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICAqL1xuICAgIGdldCBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDt9XG59XG5cbm1vZHVsZS5leHBvcnRzPVRyaWNrO1xuIiwiLyoqXG4gKiB0aGUgcGFydCB0aGF0IHJ1bnMgaW4gdGhlIGJyb3dzZXIgb2YgYSBzaW5nbGUgcGxheWVyXG4gKiBnaXZlbiB0aGF0IGFueSBpbmZvcm1hdGlvbiB0byB0aGUgY3VycmVudCBwbGF5ZXIgb2YgdGhlIGdhbWUgc2hvdWxkIGJlIGF2YWlsYWJsZSB0aHJvdWdoIGl0J3MgX2dhbWUgcHJvcGVydHkgKGkuZS4gYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICogYWxsIGNhbGxzIGluIG1haW4uanMgdG8gcmlra2VuVGhlR2FtZSBkaXJlY3RseSBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCBjYWxscyB0byBjdXJyZW50UGxheWVyLmdhbWUgaS5lLiByaWtrZW5UaGVHYW1lIGl0c2VsZiBpcyBubyBsb25nZXIgYXZhaWxhYmxlIHRvIHRoZSBjdXJyZW50UGxheWVyISEhXG4gKiBcbioqL1xuLy8gd2UnbGwgYmUgdXNpbmcgUGxheWVyLmpzIG9ubHkgKFBsYXllci5qcyB3aWxsIGRlYWwgd2l0aCByZXF1aXJpbmcgQ2FyZEhvbGRlciwgYW5kIENhcmRIb2xkZXIgQ2FyZClcbi8vIE5PIEkgbmVlZCB0byByZXF1aXJlIHRoZW0gYWxsIG90aGVyd2lzZSBicm93c2VyaWZ5IHdvbid0IGJlIGFibGUgdG8gZmluZCBDYXJkLCBldGMuXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcbmNvbnN0IFRyaWNrPXJlcXVpcmUoJy4vVHJpY2suanMnKTsgLy8gbm93IGluIHNlcGFyYXRlIGZpbGVcbmNvbnN0IHtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfT1yZXF1aXJlKCcuL1BsYXllci5qcycpO1xuXG5jbGFzcyBMYW5ndWFnZXtcbiAgICBzdGF0aWMgZ2V0IERFRkFVTFRfUExBWUVSUygpe3JldHVybiBbW1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIl0sW1wiTWFyY1wiLFwiSnVyZ2VuXCIsXCJNb25pa2FcIixcIkFubmFcIixcIlwiXV07fTtcbiAgICAvLyBwb3NzaWJsZSByYW5rcyBhbmQgc3VpdGVzIChpbiBEdXRjaClcbiAgICBzdGF0aWMgZ2V0IERVVENIX1JBTktfTkFNRVMoKXtyZXR1cm4gW1widHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImJvZXJcIixcInZyb3V3XCIsXCJoZWVyXCIsXCJhYXNcIl07fTtcbiAgICBzdGF0aWMgZ2V0IERVVENIX1NVSVRFX05BTUVTKCl7cmV0dXJuIFtcInJ1aXRlblwiLFwia2xhdmVyZW5cIixcImhhcnRlblwiLFwic2Nob3BwZW5cIl07fTtcbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpe3JldHVybihzdHI/KHN0ci5sZW5ndGg/c3RyWzBdLnRvVXBwZXJDYXNlKCkrc3RyLnNsaWNlKDEpOlwiXCIpOlwiP1wiKTt9XG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGluZyBlbnRlcmluZyB0aGUgaWQgb2YgdGhlIHVzZXIgb24gcGFnZS1zZXR0aW5ncywgc28gd2UgZG8gbm90IG5lZWQgdG8gaW5zZXJ0IGEgbmV3IG9uZVxuLy8gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVseSB3ZSBjYW4gZG8gdGhhdCBvbiBhIHNlcGFyYXRlIHBhZ2UgLyBwYWdlLWF1dGggaXMgT0tcbi8vICAgICAgICAgICAgICAgIHdlIGdvIHRvIHBhZ2UtYXV0aCB3aGVuIE5PVCBwbGF5aW5nIHRoZSBnYW1lIGluIGRlbW8gbW9kZSEhIVxuLy8gICAgICAgICAgICAgICAgaW4gbm9uLWRlbW8gbW9kZSB5b3UgaWRlbnRpZnkgeW91cnNlbGYsIHRoZW4gd2hlbiBzZXRQbGF5ZXJOYW1lIGlzIHN1Y2Nlc3NmdWwgZ28gdG8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4vLyBNREhAMTBKQU4yMDIwOiByZW1vdmluZyBwYWdlLXNldHRpbmdzIGFuZCBwYWdlLXNldHVwLWdhbWUsIGFkZGluZyBwYWdlLWhlbHBcbmNvbnN0IFBBR0VTPVtcInBhZ2UtcnVsZXNcIixcInBhZ2UtaGVscFwiLFwicGFnZS1hdXRoXCIsXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIixcInBhZ2UtYmlkZGluZ1wiLFwicGFnZS10cnVtcC1jaG9vc2luZ1wiLFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIsXCJwYWdlLXBsYXktcmVwb3J0aW5nXCIsXCJwYWdlLXBsYXlpbmdcIixcInBhZ2UtZmluaXNoZWRcIl07XG5cbnZhciBjdXJyZW50UGFnZT1udWxsOyAvLyBsZXQncyBhc3N1bWUgdG8gYmUgc3RhcnRpbmcgYXQgcGFnZS1ydWxlc1xudmFyIHZpc2l0ZWRQYWdlcz1bXTsgLy8gbm8gcGFnZXMgdmlzaXRlZCB5ZXRcblxudmFyIGN1cnJlbnRQbGF5ZXI9bnVsbDsgLy8gdGhlIGN1cnJlbnQgZ2FtZSBwbGF5ZXJcblxuLy8gTURIQDEwSkFOMjAyMDogbmV3R2FtZSgpIGlzIGEgYmlkIGRpZmZlcmVudCB0aGFuIGluIHRoZSBkZW1vIHZlcnNpb24gaW4gdGhhdCB3ZSByZXR1cm4gdG8gdGhlIHdhaXRpbmctcGFnZVxuZnVuY3Rpb24gbmV3R2FtZSgpe1xuICAgIC8vIGJ5IGNhbGwgcGxheXNUaGVHYW1lQXRJbmRleChudWxsLD8pIHdlIGZvcmNlIGNsZWFyaW5nIHRoZSBnYW1lIGluZm9ybWF0aW9uIGJlaW5nIHNob3duIGF0IHRoZSB3YWl0LWZvci1wbGF5ZXJzIHBhZ2VcbiAgICAoIWN1cnJlbnRQbGF5ZXJ8fGN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleChudWxsLC0xKSk7XG59XG5cbnZhciBiaWRkZXJDYXJkc0VsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItY2FyZHNcIik7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCl7XG4gICAgbGV0IGJ1dHRvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJCaWRkZXIgc3VpdGVjYXJkcyBidXR0b24gY2xpY2tlZCFcIik7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpOyAvLyBhIGhhLCBkaWRuJ3Qga25vdyB0aGlzXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT0odGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtYmlkLWJ1dHRvblwiKT9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgIH0pO1xufVxuXG4vLyBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuLy8gICAgIHZhciB2ID0gZG9jdW1lbnQuY29va2llLm1hdGNoKCcoXnw7KSA/JyArIG5hbWUgKyAnPShbXjtdKikoO3wkKScpO1xuLy8gICAgIHJldHVybiB2ID8gdlsyXSA6IG51bGw7XG4vLyB9XG4vLyBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbi8vICAgICB2YXIgZCA9IG5ldyBEYXRlO1xuLy8gICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDAqZGF5cyk7XG4vLyAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtwYXRoPS87ZXhwaXJlcz1cIiArIGQudG9HTVRTdHJpbmcoKTtcbi8vIH1cbi8vIGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShuYW1lKSB7IHNldENvb2tpZShuYW1lLCAnJywgLTEpOyB9XG5cbi8qKlxuICogc2hvd3MgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWVzIGF0IHRoZSBzdGFydCBvZiB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgLy8gaW4gdGhlIGhlYWRlciByb3cgb2YgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgbGV0IHRyaWNrc1BsYXllZFRhYmxlSGVhZGVyPXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0aGVhZFwiKTtcbiAgICAgICAgbGV0IHJvdz10cmlja3NQbGF5ZWRUYWJsZUhlYWRlci5jaGlsZHJlblswXTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgZm9yKHBsYXllcj0wO3BsYXllcjw0O3BsYXllcisrKXtcbiAgICAgICAgICAgIGxldCBjZWxsPXJvdy5jaGlsZHJlbltwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICBsZXQgcGxheWVyTmFtZT0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVyKTpcIj9cIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgcmVwbGFjZWQgYnkgY3VycmVudFBsYXllci5nYW1lXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5hbWUgb2YgcGxheWVyICNcIisocGxheWVyKzEpK1wiOiAnXCIrcGxheWVyTmFtZStcIicuXCIpO1xuICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9cGxheWVyTmFtZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbmFtZVwiKS5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZCB0YWJsZVxuICogdG8gYmUgY2FsbGVkIHdpdGggZXZlcnkgbmV3IGdhbWVcbiAqL1xuZnVuY3Rpb24gY2xlYXJCaWRUYWJsZSgpe1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgYmlkVGFibGVSb3cgb2YgYmlkVGFibGUuY2hpbGRyZW4pXG4gICAgICAgIGZvcihsZXQgYmlkVGFibGVDb2x1bW4gb2YgYmlkVGFibGVSb3cuY2hpbGRyZW4pXG4gICAgICAgICAgICBiaWRUYWJsZUNvbHVtbi5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKGNhcmQpe1xuICAgICAgICBzZXRTdWl0ZUNsYXNzKGVsZW1lbnQsY2FyZC5zdWl0ZSk7IC8vIHdlIHdhbnQgdG8gc2VlIHRoZSByaWdodCBjb2xvclxuICAgICAgICBsZXQgZWxlbWVudElzVHJ1bXA9ZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0cnVtcFwiKTtcbiAgICAgICAgbGV0IGVsZW1lbnRTaG91bGRCZVRydW1wPShjYXJkLnN1aXRlPT09dHJ1bXBTdWl0ZSk7XG4gICAgICAgIGlmKGVsZW1lbnRJc1RydW1wIT09ZWxlbWVudFNob3VsZEJlVHJ1bXApZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwidHJ1bXBcIik7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPWNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGlmKHdpbm5lclNpZ24hPTApZWxlbWVudC5pbm5lckhUTUwrPVwiKlwiO1xuICAgICAgICAvKiByZXBsYWNpbmc6IFxuICAgICAgICAvLyBpZiB0aGlzIGlzIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgc28gZmFyIGl0IGNhbiBiZSBlaXRoZXIgKyBvciAtXG4gICAgICAgIGlmKHdpbm5lclNpZ24+MCllbGVtZW50LmlubmVySFRNTCs9JysnO2Vsc2UgaWYod2lubmVyU2lnbjwwKWVsZW1lbnQuaW5uZXJIVE1MKz0nLSc7XG4gICAgICAgICovXG4gICAgfWVsc2VcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWUoZWxlbWVudCxuYW1lLHBsYXllclR5cGUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIHN3aXRjaChwbGF5ZXJUeXBlKXtcbiAgICAgICAgY2FzZSAtMTplbGVtZW50LnN0eWxlLmNvbG9yPVwicmVkXCI7YnJlYWs7XG4gICAgICAgIGNhc2UgMDplbGVtZW50LnN0eWxlLmNvbG9yPVwib3JhbmdlXCI7YnJlYWs7XG4gICAgICAgIGNhc2UgMTplbGVtZW50LnN0eWxlLmNvbG9yPVwiZ3JlZW5cIjticmVhaztcbiAgICAgICAgZGVmYXVsdDplbGVtZW50LnN0eWxlLmNvbG9yPVwiYmxhY2tcIjticmVhaztcbiAgICB9XG59XG4vKipcbiAqIHNob3dzIHRoZSBnaXZlbiB0cmlja1xuICogQHBhcmFtIHsqfSB0cmljayBcbiAqL1xuZnVuY3Rpb24gc2hvd1RyaWNrKHRyaWNrLyoscGxheWVySW5kZXgqLyl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIFwiLHRyaWNrKTtcbiAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPT0wJiZyaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJSYW5rKCk+PTApeyAvLyBvbmNlIHN1ZmZpY2VzXG4gICAgICAgIGZvcihsZXQgcGFydG5lclN1aXRlRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXN1aXRlJykpcGFydG5lclN1aXRlRWxlbWVudC5pbm5lckhUTUw9RFVUQ0hfU1VJVEVfTkFNRVNbcmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV07XG4gICAgICAgIGZvcihsZXQgcGFydG5lclJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKXBhcnRuZXJSYW5rRWxlbWVudC5pbm5lckhUTUw9RFVUQ0hfUkFOS19OQU1FU1tyaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJSYW5rKCldO1xuICAgIH1cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSB0cnVtcCBwbGF5ZXIgdGhhdCBpcyBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIChlaXRoZXIgbm9uLWJsaW5kIG9yIGJsaW5kKSBmbGFnIHRoZSBjaGVja2JveFxuICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3gnKS5jaGVja2VkPXRydWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWJsaW5kJykuaW5uZXJIVE1MPSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwP1wiYmxpbmQgXCI6XCJcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICBpZih0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNraW5nLWZvci1wYXJ0bmVyLWNhcmQtaW5mb1wiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAvL2xldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1jYXJkcy10YWJsZVwiKS5yZXF1ZXN0U2VsZWN0b3IoXCJ0Ym9keVwiKTtcbiAgICAvLyBzaG93IHRoZSBwbGF5ZXIgbmFtZXNcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCksLTIpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzEpJTQpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMSklNCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsyKSU0KSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMyklNCksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgLy8gc2hvdyB0aGUgdHJpY2sgY2FyZHMgcGxheWVkIGJ5IHRoZSBsZWZ0LCBvcHBvc2l0ZSBhbmQgcmlnaHQgcGxheWVyXG4gICAgLy8gTk9URSB0aGUgZmlyc3QgY2FyZCBjb3VsZCBiZSB0aGUgYmxpbmQgY2FyZCBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgbm90IHNob3cgaXQhIVxuICAgIC8vICAgICAgYnV0IG9ubHkgdGhlIGNvbG9yIG9mIHRoZSBwYXJ0bmVyIHN1aXRlXG4gICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9KHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2suX2NhcmRzWzBdLnN1aXRlIT09dHJpY2sucGxheVN1aXRlKTtcbiAgICBsZXQgcGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PShhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPyg0K3RyaWNrLmZpcnN0UGxheWVyLXBsYXllckluZGV4KSU0OjApO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09MSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzEpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsxKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMSklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Mil7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzIpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsyKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMiklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Myl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzMpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCszKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMyklNCk/MTotMSk6MCkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdWl0ZUNhcmRSb3dzKHJvd3Msc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgc3VpdGUgY2FyZCByb3dzOiBcIityb3dzLmxlbmd0aCtcIi5cIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgIGxldCBzdWl0ZT0wO1xuICAgIGZvcihsZXQgcm93IG9mIHJvd3Mpe1xuICAgICAgICAvLy8vLy8vLy9sZXQgc3VpdGVDb2xvcj1TVUlURV9DT0xPUlNbc3VpdGUlMl07XG4gICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgbGV0IGNlbGxzPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZD0wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIGZvcihsZXQgY2VsbCBvZiBjZWxscyl7XG4gICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgaWYoY2FyZEluU3VpdGUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbY2FyZEluU3VpdGUuc3VpdGVdKTsgLy8gcmVwbGFjaW5nOiBjZWxsLnN0eWxlLmNvbG9yPXN1aXRlQ29sb3I7ICBcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgIHN1aXRlQ2FyZCsrO1xuICAgICAgICB9XG4gICAgICAgIHN1aXRlKys7XG4gICAgfVxufVxuLy8gaW4gdGhyZWUgZGlmZmVyZW50IHBhZ2VzIHRoZSBwbGF5ZXIgY2FyZHMgc2hvdWxkIGJlIHNob3duLi4uXG5mdW5jdGlvbiB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyBmb3IgYmlkZGluZy5cIik7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cblxuLyoqXG4gKiBmb3IgcGxheWluZyB0aGUgY2FyZHMgYXJlIHNob3duIGluIGJ1dHRvbnMgaW5zaWRlIHRhYmxlIGNlbGxzXG4gKiBAcGFyYW0geyp9IHN1aXRlQ2FyZHMgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSAoY3VycmVudCBwbGF5ZXIpIGNhcmRzIHRvIGNob29zZSBmcm9tLlwiKTtcbiAgICBsZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXN1aXRlY2FyZHMtdGFibGVcIik7XG4gICAgY29uc29sZS5sb2coXCJTdWl0ZSBjYXJkczogXCIsc3VpdGVDYXJkcyk7XG4gICAgbGV0IHJvd3M9dGFibGVib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIik7XG4gICAgY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgIGZvcihsZXQgc3VpdGU9MDtzdWl0ZTxyb3dzLmxlbmd0aDtzdWl0ZSsrKXtcbiAgICAgICAgbGV0IHJvdz1yb3dzW3N1aXRlXTtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjb2x1bW5zPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IHN1aXRlQ2FyZD0wO3N1aXRlQ2FyZDxjb2x1bW5zLmxlbmd0aDtzdWl0ZUNhcmQrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbGJ1dHRvbj1jb2x1bW5zW3N1aXRlQ2FyZF0vKi5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1idXR0b25dXCIpKi87XG4gICAgICAgICAgICBpZighY2VsbGJ1dHRvbil7Y29uc29sZS5sb2coXCJObyBjZWxsIGJ1dHRvbiFcIik7Y29udGludWU7fVxuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbGJ1dHRvbi5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yO1xuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cImlubGluZVwiO1xuICAgICAgICAgICAgfWVsc2UgLy8gaGlkZSB0aGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwbGF5ZXIgY2FyZHMgdG8gY2hvb3NlIGZyb20gc2hvd24hXCIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT1jdXJyZW50UGxheWVyLmdhbWU7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIGxldCBwbGF5ZXI9MDtcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMV0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcocmlra2VuVGhlR2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcikpOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsyXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhkZWx0YVBvaW50c1twbGF5ZXJdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVyXSk7XG4gICAgICAgIHBsYXllcisrO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKXtcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZUNlbGwgb2YgdHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvckFsbCgndGQnKSl7XG4gICAgICAgICAgICB0cmlja3NQbGF5ZWRUYWJsZUNlbGwuaW5uZXJIVE1MPVwiXCI7dHJpY2tzUGxheWVkVGFibGVDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvcj0ndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgbGFzdFRyaWNrUGxheWVkSW5kZXg9cmlra2VuVGhlR2FtZS5udW1iZXJPZlRyaWNrc1BsYXllZC0xOyAvLyBnZXR0ZXIgY2hhbmdlZCB0byBnZXRNZXRob2QgY2FsbFxuICAgIGlmKGxhc3RUcmlja1BsYXllZEluZGV4Pj0wKXtcbiAgICAgICAgbGV0IHRyaWNrPXJpa2tlblRoZUdhbWUuZ2V0VHJpY2tBdEluZGV4KGxhc3RUcmlja1BsYXllZEluZGV4KTtcbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPWdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodHJpY2sud2lubmVyKTsgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYnkgdGhlIHRyaWNrIHdpbm5lciAoTURIQDAzSkFOMjAyMDogY2hhbmdlZCBmcm9tIGdldHRpbmcgdGhlIHBsYXllciBpbnN0YW5jZSBmaXJzdClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkZWZhdWx0IHBsYXllciBuYW1lcyFcIik7XG4gICAgbGV0IHBsYXllck5hbWVzPUxhbmd1YWdlLkRFRkFVTFRfUExBWUVSU1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbW8tcGxheW1vZGUtY2hlY2tib3hcIikuY2hlY2tlZD8xOjBdO1xuICAgIGZvcihwbGF5ZXJOYW1lSW5wdXRFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKCFwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlfHxwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aD09MClcbiAgICAgICAgICAgIHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWU9cGxheWVyTmFtZXNbcGFyc2VJbnQocGxheWVyTmFtZUlucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiKSldO1xuICAgIH1cbn1cblxuLy8gcGxheWluZyBmcm9tIHdpdGhpbiB0aGUgZ2FtZVxuZnVuY3Rpb24gc2luZ2xlUGxheWVyR2FtZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBsZXQgc2luZ2xlUGxheWVyTmFtZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLXBsYXllci1uYW1lJykudmFsdWUudHJpbSgpO1xuICAgIGlmKHNpbmdsZVBsYXllck5hbWUubGVuZ3RoPjApXG4gICAgICAgIHNldFBsYXllck5hbWUoc2luZ2xlUGxheWVyTmFtZSwoZXJyKT0+e1xuICAgICAgICAgICAgLy8gTURIQDEwSkFOMjAyMDogX3NldFBsYXllciB0YWtlcyBjYXJlIG9mIHN3aXRjaGluZyB0byB0aGUgcmlnaHQgaW5pdGlhbCBwYWdlISEhXG4gICAgICAgICAgICBpZihlcnIpc2V0SW5mbyhlcnIpOy8vIGVsc2UgbmV4dFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICBhbGVydChcIkdlZWYgZWVyc3QgZWVuIChnZWxkaWdlKSBuYWFtIG9wIVwiKTtcbn1cblxuLyoqXG4gKiBwcmVwYXJlcyB0aGUgR1VJIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIGdldEdhbWVJbmZvKCl7XG4gICAgY29uc29sZS5sb2coXCJEZXRlcm1pbmluZyBnYW1lIGluZm8uXCIpO1xuICAgIGxldCBnYW1lSW5mbz1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsgLy8gbm8gcGxheWVyLCBubyBnYW1lXG4gICAgaWYocmlra2VuVGhlR2FtZSl7XG4gICAgICAgIC8vIGdldCB0aGUgaW5mbyB3ZSBuZWVkIHRocm91Z2ggdGhlIFBsYXllckdhbWUgaW5zdGFuY2UgcmVnaXN0ZXJlZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcnM9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkZGVycygpOyAvLyB0aG9zZSBiaWRkaW5nXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWRkZXJzOiBcIitoaWdoZXN0QmlkZGVycy5qb2luKFwiLCBcIikrXCIuXCIpO1xuICAgICAgICBsZXQgaGlnaGVzdEJpZD1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZDogXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZF0rXCIuXCIpO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFRydW1wU3VpdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRUcnVtcCBzdWl0ZTogXCIrdHJ1bXBTdWl0ZStcIi5cIik7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgbGV0IHBhcnRuZXJSYW5rPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKTtcbiAgICAgICAgLy8gcGxheWluZyB3aXRoIHRydW1wIGlzIGVhc2llc3RcbiAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7IC8vIG9ubHkgYSBzaW5nbGUgaGlnaGVzdCBiaWRkZXIhISFcbiAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXI9aGlnaGVzdEJpZGRlcnNbMF07XG4gICAgICAgICAgICBpZihoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEEpe1xuICAgICAgICAgICAgICAgIGxldCB0cm9lbGFQbGF5ZXJOYW1lPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKTtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz10cm9lbGFQbGF5ZXJOYW1lK1wiIGhlZWZ0IHRyb2VsYSwgZW4gXCI7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm8rPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShyaWtrZW5UaGVHYW1lLmZvdXJ0aEFjZVBsYXllcikrXCIgaXMgbWVlLlwiO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLfHxoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIpe1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgcmlrdCBpbiBkZSBcIitEVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXTtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm8rPVwiLCBlbiB2cmFhZ3QgZGUgXCIrRFVUQ0hfU1VJVEVfTkFNRVNbcGFydG5lclN1aXRlXStcIiBcIitEVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBtZWUuXCI7ICAgIFxuICAgICAgICAgICAgICAgIH1lbHNlIC8vIHdpdGhvdXQgYSBwYXJ0bmVyXG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKStcIiBzcGVlbHQgXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgbWV0IFwiK0RVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdK1wiIGFscyB0cm9lZi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7IC8vIHRoZXJlJ3Mgbm8gdHJ1bXAsIGV2ZXJ5b25lIGlzIHBsYXlpbmcgZm9yIGhpbS9oZXJzZWxmXG4gICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlclBsYXllck5hbWVzPVtdO1xuICAgICAgICAgICAgaGlnaGVzdEJpZGRlcnMuZm9yRWFjaCgoaGlnaGVzdEJpZGRlcik9PntoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMucHVzaChyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikpO30pO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1oaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMuam9pbihcIiwgXCIpKyhoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMubGVuZ3RoPjE/XCIgc3BlbGVuIFwiOlwiIHNwZWVsdCBcIikrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZF0rXCIuXCI7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGdhbWVJbmZvPVwiSWVkZXJlZW4gaGVlZnQgZ2VwYXN0LiBXZSBzcGVsZW4gb20gZGUgc2Nob3BwZW4gdnJvdXcgZW4gZGUgbGFhdHN0ZSBzbGFnIVwiO1xuICAgICAgICB9XG4gICB9XG4gICByZXR1cm4gZ2FtZUluZm87XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mVHJpY2tzVG9XaW5UZXh0KG51bWJlck9mVHJpY2tzVG9XaW4scGFydG5lck5hbWUsaGlnaGVzdEJpZCl7XG4gICAgc3dpdGNoKG51bWJlck9mVHJpY2tzVG9XaW4pe1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm4gXCJHZWVuZWVuXCI7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBcIlByZWNpZXMgZWVuXCI7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBcIlplcyBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSB0ZWdlbnNwZWxlcnMgZGUgXCIrKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQT9cInRyb2VsYVwiOlwicmlrXCIpK1wiIHRlIGxhdGVuIHZlcmxpZXplblwiO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gXCJBY2h0IHNhbWVuIG1ldCBcIisocGFydG5lck5hbWU/cGFydG5lck5hbWU6XCJqZSBwYXJ0bmVyXCIpK1wiIG9tIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSB3aW5uZW5cIjtcbiAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgcmV0dXJuIFwiTmVnZW4gYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gXCJUaWVuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgcmV0dXJuIFwiRWxmIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgcmV0dXJuIFwiVHdhYWxmIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgcmV0dXJuIFwiQWxsZW1hYWxcIjtcbiAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgIHJldHVybiBcIk1hYWt0IG5pZXQgdWl0IG1pdHMgbmlldCBkZSBsYWF0c3RlIHNsYWcgb2YgZWVuIHNsYWcgbWV0IGRlIHNjaG9wcGVuIHZyb3V3XCI7XG4gICAgfVxuICAgIHJldHVybiBcIk1hYWt0IG5pZXQgdWl0XCI7XG59XG5cbmNsYXNzIE9ubGluZVBsYXllciBleHRlbmRzIFBsYXllcntcbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcbiAgICAgICAgc3VwZXIobmFtZSxudWxsKTtcbiAgICB9XG5cbiAgICAvLyBhIChyZW1vdGUpIGNsaWVudCBuZWVkcyB0byBvdmVycmlkZSBhbGwgaXRzIGFjdGlvbnNcbiAgICAvLyBCVVQgd2UgZG8gbm90IGRvIHRoYXQgYmVjYXVzZSBhbGwgcmVzdWx0cyBnbyBpbnRvIFBsYXllckdhbWVQcm94eSB3aGljaCB3aWxsIHNlbmQgdGhlIGFsb25nISEhIVxuXG4gICAgLy8gbWFrZSBhIGJpZCBpcyBjYWxsZWQgd2l0aCBcbiAgICBtYWtlQUJpZChwbGF5ZXJCaWRzT2JqZWN0cyxwb3NzaWJsZUJpZHMpe1xuICAgICAgICAvLyBkZWJ1Z2dlclxuICAgICAgICBzaG93R2FtZVN0YXRlKFwiQmllZCFcIik7IC8vIGRlZmluZWQgaW4gaW5mby5qc1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IC8vIEpJVCB0byB0aGUgcmlnaHQgcGFnZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG5cbiAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7XG4gICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5pdGlhbFwiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJCaWRzT2JqZWN0cy5sZW5ndGg7cGxheWVyKyspe1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyXTtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJCaWRzUm93PWJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl07XG4gICAgICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgICAgIGxldCBiaWRDb2x1bW49MDtcbiAgICAgICAgICAgIC8vIHdyaXRlIHRoZSBiaWRzICh3ZSBoYXZlIHRvIGNsZWFyIHRoZSB0YWJsZSB3aXRoIGV2ZXJ5IG5ldyBnYW1lIHRob3VnaClcbiAgICAgICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlblsrK2JpZENvbHVtbl0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2luZzogYmlkVGFibGUuY2hpbGRyZW5bcGxheWVyXS5jaGlsZHJlblsxXS5pbm5lckhUTUw9cGxheWVyc0JpZHNbYmlkXS5qb2luKFwiIFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIHNob3dHYW1lU3RhdGUoXCJUcm9lZiBraWV6ZW5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgdHJ1bXAgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXRydW1wLWNob29zaW5nXCIpO1xuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgdHJ1bXAgc3VpdGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgfVxuICAgIGNob29zZVBhcnRuZXJTdWl0ZShzdWl0ZXMscGFydG5lclJhbmspeyAvLyBwYXJ0bmVyUmFua05hbWUgY2hhbmdlZCB0byBwYXJ0bmVyUmFuayAoYmVjYXVzZSBMYW5ndWFnZSBzaG91bGQgYmUgdXNlZCBhdCB0aGUgVUkgbGV2ZWwgb25seSEpXG4gICAgICAgIHNob3dHYW1lU3RhdGUoXCJQYXJ0bmVyIGtpZXplblwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBwYXJ0bmVyIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIpO1xuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLy8gYmVjYXVzZSB0aGUgc3VpdGVzIGluIHRoZSBidXR0b24gYXJyYXkgYXJlIDAsIDEsIDIsIDMgYW5kIHN1aXRlcyB3aWxsIGNvbnRhaW5cbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXJ0bmVyLXJhbmsnKS5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua107XG4gICAgfVxuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgcmVwbGFjZWQgdmVyc2lvbiBleGNlcHQgd2Ugbm93IHdhbnQgdG8gcmVjZWl2ZSB0aGUgdHJpY2sgaXRzZWxmXG4gICAgcGxheUFDYXJkKHRyaWNrKXtcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzO1xuICAgICAgICBzaG93R2FtZVN0YXRlKFwiU3BlZWwhXCIpOyAvLyBkZWZpbmVkIGluIGluZm8uanNcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzOyAvLyByZW1lbWJlciB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgc2V0SW5mbyhcIkRvZSBlZW4gYm9kLlwiKTtcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG5ldyB0cmljayB1cGRhdGUgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGUgd2l0aCB0aGUgcHJldmlvdXMgdHJpY2tcbiAgICAgICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgLyogc2VlIHNob3dUcmljaygpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FuLWFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQ/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLmNoZWNrZWQ9ZmFsc2U7IC8vIHdoZW4gY2xpY2tlZCBzaG91bGQgZ2VuZXJhdGUgXG4gICAgICAgICovXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpOyAvLyB1cGRhdGUgdGhlIGdhbWUgaW5mbyAocGxheWVyIHNwZWNpZmljKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQtcGxheWVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stcGxheXN1aXRlXCIpLmlubmVySFRNTD0odHJpY2sucGxheVN1aXRlPj0wP0RVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV0udG9Mb3dlckNhc2UoKTpcImthYXJ0XCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZUcmlja3NXb249dGhpcy5nZXROdW1iZXJPZlRyaWNrc1dvbigpOyAvLyBhbHNvIGluY2x1ZGVzIHRob3NlIHdvbiBieSB0aGUgcGFydG5lciAoYXV0b21hdGljYWxseSlcbiAgICAgICAgLy8gYWRkIHRoZSB0cmlja3Mgd29uIGJ5IHRoZSBwYXJ0bmVyXG4gICAgICAgIGxldCBwYXJ0bmVyTmFtZT10aGlzLl9nYW1lLmdldFBhcnRuZXJOYW1lKHRoaXMuX2luZGV4KTtcbiAgICAgICAgLy8gaWYocGFydG5lciludW1iZXJPZlRyaWNrc1dvbis9cGxheWVyLmdldE51bWJlck9mVHJpY2tzV29uKCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2tzLXdvbi1zby1mYXJcIikuaW5uZXJIVE1MPVN0cmluZyhudW1iZXJPZlRyaWNrc1dvbikrKHBhcnRuZXJOYW1lP1wiIChzYW1lbiBtZXQgXCIrcGFydG5lck5hbWUrXCIpXCI6XCJcIik7XG4gICAgICAgIC8vIHNob3cgdGhlIG51bWJlciBvZiB0cmlja3MgdGhpcyBwbGF5ZXIgaXMgc3VwcG9zZWQgdG8gd2luIGluIHRvdGFsXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2tzLXRvLXdpblwiKS5pbm5lckhUTUw9Z2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQodGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSx0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWQoKSk7XG4gICAgICAgIHRoaXMuX2NhcmQ9bnVsbDsgLy8gZ2V0IHJpZCBvZiBhbnkgY3VycmVudGx5IGNhcmRcbiAgICAgICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBzaG91bGQgcGxheSBhIGNhcmQhXCIpO1xuICAgICAgICBzZXRJbmZvKHRoaXMubmFtZStcIiwgd2Vsa2UgXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIgd2lsIGplIFwiKyh0cmljay5udW1iZXJPZkNhcmRzPjA/XCJiaWpcIjpcIlwiKStcInNwZWxlbj9cIik7XG4gICAgICAgIHVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCkpOyAvLyByZW1lbWJlciB0aGUgc3VpdGUgY2FyZHMhISEhXG4gICAgICAgIC8vIHNob3cgdGhlIHRyaWNrIChyZW1lbWJlcmVkIGluIHRoZSBwcm9jZXNzIGZvciB1c2UgaW4gY2FyZFBsYXllZCBiZWxvdykgZnJvbSB0aGUgdmlld3BvaW50IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBzaG93VHJpY2sodGhpcy5fdHJpY2s9dHJpY2spOyAvLyBNREhAMTFKQU4yMDIwOiBubyBuZWVkIHRvIHBhc3MgdGhlIHBsYXllciBpbmRleCAoYXMgaXQgaXMgYWx3YXlzIHRoZSBzYW1lKVxuICAgIH1cbiAgICAvLyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBfY2FyZFBsYXllZCgpIGRlZmluZWQgaW4gdGhlIGJhc2UgY2xhc3MgUGxheWVyIHdoaWNoIGluZm9ybXMgdGhlIGdhbWVcbiAgICAvLyBOT1RFIGNhcmRQbGF5ZWQgaXMgYSBnb29kIHBvaW50IGZvciBjaGVja2luZyB0aGUgdmFsaWRpdHkgb2YgdGhlIGNhcmQgcGxheWVkXG4gICAgLy8gTk9URSBjYW4ndCB1c2UgX2NhcmRQbGF5ZWQgKHNlZSBQbGF5ZXIgc3VwZXJjbGFzcylcbiAgICBfY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KHN1aXRlLGluZGV4KXtcbiAgICAgICAgbGV0IGNhcmQ9KHN1aXRlPHRoaXMuX3N1aXRlQ2FyZHMubGVuZ3RoJiZ0aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXS5sZW5ndGg/dGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV1baW5kZXhdOm51bGwpO1xuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIFRPRE8gY2hlY2tpbmcgc2hvdWxkIE5PVCBiZSBkb25lIGJ5IHRoZSBwbGF5ZXIgQlVUIGJ5IHRoZSB0cmljayBpdHNlbGYhISFcbiAgICAgICAgICAgIC8vIEJVRyBGSVg6IGRvIE5PVCBkbyB0aGUgZm9sbG93aW5nIGhlcmUsIGJ1dCBvbmx5IGF0IHRoZSBzdGFydCBvZiBhIHRyaWNrLCBvciBOT1QgYXQgYWxsISEhISFcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL3RoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIC0xIHdoZW4gYXNraW5nIGJsaW5kLCAwIG5vdCBhc2tpbmcsIDEgaWYgYXNraW5nXG4gICAgICAgICAgICAvLyBDQU4nVCBjYWxsIF9zZXRDYXJkIChpbiBiYXNlIGNsYXNzIFBsYXllcikgaWYgdGhlIGNhcmQgY2Fubm90IGJlIHBsYXllZCEhIVxuICAgICAgICAgICAgaWYodGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcz09MCl7IC8vIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZW9yZXRpY2FsbHkgdGhlIGNhcmQgY2FuIGJlIHBsYXllZCBidXQgaXQgbWlnaHQgYmUgdGhlIGNhcmQgd2l0aCB3aGljaCB0aGUgcGFydG5lciBjYXJkIGlzIGFza2VkISFcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGlzIGEgZ2FtZSB3aGVyZSB0aGVyZSdzIGEgcGFydG5lciBjYXJkIHRoYXQgaGFzbid0IGJlZW4gcGxheWVkIHlldFxuICAgICAgICAgICAgICAgIC8vIGFsdGVybmF0aXZlbHkgcHV0OiBzaG91bGQgdGhlcmUgYmUgYSBwYXJ0bmVyIGFuZCB0aGVyZSBpc24ndCBvbmUgeWV0Pz8/Pz9cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk9PXRoaXMuX2luZGV4KXsgLy8gdGhpcyBpcyB0cnVtcCBwbGF5ZXIgcGxheWluZyB0aGUgZmlyc3QgY2FyZFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI+Pj4+IENIRUNLSU5HIFdIRVRIRVIgQVNLSU5HIEZPUiBUSEUgUEFSVE5FUiBDQVJEIDw8PDxcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiB0aGUgdHJ1bXAgcGxheWVyIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZFxuICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBtZWFucyB0aGF0IHRoZSB0cnVtcCBwbGF5ZXIgZG9lcyBub3QgaGF2ZSBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ+MCl7IC8vIG5vbi1ibGluZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgYmUgZGV0ZWN0ZWQgYnkgdGhlIGdhbWUgcHJlZmVyYWJseVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VpdGU9PXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vL2FsZXJ0KFwiXFx0Tk9OX0JMSU5EXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl90cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwKXsgLy8gY291bGQgYmUgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjaGVja2JveCBpcyBzdGlsbCBzZXQgaS5lLiB0aGUgdXNlciBkaWRuJ3QgdW5jaGVjayBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGUgd2lsbCBiZSBhc2tpbmcgZm9yIHRoZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1ibGluZFwiKS5jaGVja2VkJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3VpdGUhPXRoaXMuX2dhbWUuZ2V0VHJ1bXBTdWl0ZSgpfHxjb25maXJtKFwiV2lsdCBVIGRlIFwiK0RVVENIX1NVSVRFX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCldK1wiIFwiK0RVVENIX1JBTktfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpXStcIiAoYmxpbmQpIHZyYWdlbiBtZXQgZWVuIHRyb2VmP1wiKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPS0xOyAvLyB5ZXMsIGFza2luZyBibGluZCEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy9hbGVydChcIlxcdEJMSU5EIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qYWxlcnQoXCJOb3QgaW5kaWNhdGVkISEhIVwiKSovO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoc3VpdGUhPT10aGlzLl90cmljay5wbGF5U3VpdGUmJnRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZSh0aGlzLl90cmljay5wbGF5U3VpdGUpPjApe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgXCIrY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiBuaWV0IHNwZWxlbiwgd2FudCBcIitEVVRDSF9TVUlURV9OQU1FU1t0aGlzLl90cmljay5wbGF5U3VpdGVdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB3aGVuIGJlaW5nIGFza2VkIGZvciB0aGUgcGFydG5lciBjYXJkIHRoYXQgd291bGQgYmUgdGhlIGNhcmQgdG8gcGxheSFcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSxwYXJ0bmVyUmFuaz10aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuaykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5zdWl0ZSE9cGFydG5lclN1aXRlfHxjYXJkLnJhbmshPXBhcnRuZXJSYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgXCIrY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiBuaWV0IHNwZWxlbiwgd2FudCBkZSBcIitEVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0RVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zZXRDYXJkKGNhcmQpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGNhcmQgc3VpdGUgXCIrU3RyaW5nKHN1aXRlKStcIiBhbmQgc3VpdGUgaW5kZXggXCIrU3RyaW5nKGluZGV4KStcIi5cIik7XG4gICAgfVxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIHN1cGVyLnBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCk7XG4gICAgICAgIC8vIFRPRE8gc2hvdWxkIHdlIGRvIHRoaXMgaGVyZT8/XG4gICAgICAgIGlmKHRoaXMuX2luZGV4Pj0wKXNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7ZWxzZSBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTtcbiAgICB9XG4gICAgLy8gY2FsbCByZW5kZXJDYXJkcyBqdXN0IGFmdGVyIHRoZSBzZXQgb2YgY2FyZHMgY2hhbmdlXG4gICAgcmVuZGVyQ2FyZHMoKXtcbiAgICAgICAgdGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCk7XG4gICAgICAgIHN3aXRjaChjdXJyZW50UGFnZSl7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1iaWRkaW5nXCI6dXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IG9ubHkgb25jZVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGxheWluZ1wiOnVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBhZnRlciBwbGF5aW5nIGEgY2FyZCEhXG4gICAgICAgICAgICBjYXNlIFwicGFnZS10cnVtcC1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gYnV0dG9uIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4vKipcbiAqIGNsaWNraW5nIGEgYmlkIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBiaWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBiaWRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBsZXQgYmlkPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1iaWRcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiQmlkIGNob3NlbjogXCIsYmlkKTtcbiAgICBjdXJyZW50UGxheWVyLl9zZXRCaWQoYmlkKTsgLy8gdGhlIHZhbHVlIG9mIHRoZSBidXR0b24gaXMgdGhlIG1hZGUgYmlkXG59XG4vKipcbiAqIGNsaWNraW5nIGEgdHJ1bXAgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHRydW1wIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gdHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIC8vIGVpdGhlciB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIHNlbGVjdGVkXG4gICAgLy8gT09QUyB1c2luZyBwYXJzZUludCgpIGhlcmUgaXMgU09PT08gaW1wb3J0YW50XG4gICAgbGV0IHRydW1wU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlRydW1wIHN1aXRlIFwiK3RydW1wU3VpdGUrXCIgY2hvc2VuLlwiKTtcbiAgICBjdXJyZW50UGxheWVyLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xufVxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIHBhcnNlSW50IFZFUlkgSU1QT1JUQU5UISEhIVxuICAgIGxldCBwYXJ0bmVyU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgc3VpdGUgXCIrcGFydG5lclN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgLy8gZ28gZGlyZWN0bHkgdG8gdGhlIGdhbWUgKGluc3RlYWQgb2YgdGhyb3VnaCB0aGUgcGxheWVyKVxuICAgIGN1cnJlbnRQbGF5ZXIuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xufVxuXG4vKipcbiAqIGNsaWNraW5nIGEgcGFydG5lciBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gcGFydG5lciBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHBsYXlhYmxlY2FyZEJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIGxldCBwbGF5YWJsZWNhcmRDZWxsPWV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgLy8vLy8vLy9pZihwbGF5YWJsZWNhcmRDZWxsLnN0eWxlLmJvcmRlcj1cIjBweFwiKXJldHVybjsgLy8gZW1wdHkgJ3VuY2xpY2thYmxlJyBjZWxsXG4gICAgY3VycmVudFBsYXllci5fY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KHBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSkscGFyc2VJbnQocGxheWFibGVjYXJkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWluZGV4XCIpKSk7XG59XG5cbi8vIGluIG9yZGVyIHRvIG5vdCBoYXZlIHRvIHVzZSBSaWtrZW5UaGVHYW1lIGl0c2VsZiAodGhhdCBjb250cm9scyBwbGF5aW5nIHRoZSBnYW1lIGl0c2VsZilcbi8vIGFuZCB3aGljaCBkZWZpbmVzIFJpa2tlblRoZUdhbWVFdmVudExpc3RlbmVyIHdlIGNhbiBzaW1wbHkgZGVmaW5lIHN0YXRlQ2hhbmdlZChmcm9tc3RhdGUsdG9zdGF0ZSlcbi8vIGFuZCBhbHdheXMgY2FsbCBpdCBmcm9tIHRoZSBnYW1lIFxuZnVuY3Rpb24gX2dhbWVTdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFRvZXN0YW5kIHZlcmFuZGVydCB2YW4gXCIrZnJvbXN0YXRlK1wiIG5hYXIgXCIrdG9zdGF0ZStcIi5cIik7XG4gICAgc3dpdGNoKHRvc3RhdGUpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuSURMRTpcbiAgICAgICAgICAgIHNldEluZm8oXCJFZW4gc3BlbCBpcyBhYW5nZW1hYWt0LlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuREVBTElORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJEZSBrYWFydGVuIHdvcmRlbiBnZXNjaHVkIGVuIGdlZGVlbGQuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURESU5HOlxuICAgICAgICAgICAgLy8gd2hlbiBtb3ZpbmcgZnJvbSB0aGUgREVBTElORyBzdGF0ZSB0byB0aGUgQklERElORyBzdGF0ZSBjbGVhciB0aGUgYmlkIHRhYmxlXG4gICAgICAgICAgICAvLyBBTFRFUk5BVElWRUxZIHRoaXMgY291bGQgYmUgZG9uZSB3aGVuIHRoZSBnYW1lIGVuZHNcbiAgICAgICAgICAgIC8vIEJVVCB0aGlzIGlzIGEgYml0IHNhZmVyISEhXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IGJpZWRlbiBpcyBiZWdvbm5lbiFcIik7XG4gICAgICAgICAgICBpZihmcm9tc3RhdGU9PT1QbGF5ZXJHYW1lLkRFQUxJTkcpY2xlYXJCaWRUYWJsZSgpO1xuICAgICAgICAgICAgLy8vLy8vIGxldCdzIHdhaXQgdW50aWwgYSBiaWQgaXMgcmVxdWVzdGVkISEhISBcbiAgICAgICAgICAgIC8vIE1ESEAwOUpBTjIwMjA6IE5PLCB3ZSB3YW50IHRvIGluZGljYXRlIHRoYXQgdGhlIGJpZGRpbmcgaXMgZ29pbmcgb25cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLlBMQVlJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWxlbiBrYW4gYmVnaW5uZW4hXCIpO1xuICAgICAgICAgICAgY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgIC8vIGluaXRpYXRlLXBsYXlpbmcgd2lsbCByZXBvcnQgb24gdGhlIGdhbWUgdGhhdCBpcyB0byBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkZJTklTSEVEOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsIGlzIGFmZ2Vsb3BlbiFcIik7XG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpzZXRJbmZvKFwiRGUgcmVnZWxzIHZhbiBoZXQgb25saW5lIHNwZWwuXCIpO2JyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dGluZ3NcIjpzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTticmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHVwLWdhbWVcIjogLy8gd2hlbiBwbGF5aW5nIGluIGRlbW8gbW9kZSwgdGhlIHVzZXIgc2hvdWxkIGVudGVyIGZvdXIgcGxheWVyIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJWdWwgZGUgbmFtZW4gdmFuIGRlIHNwZWxlcnMgaW4uIEVlbiBzcGVsZXJuYWFtIGlzIHZvbGRvZW5kZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImF1dGhcIjogLy8gcGFnZS1hdXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2VlZiBkZSBuYWFtIG9wIHdhYXJvbmRlciBVIHdpbHQgc3BlbGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FpdC1mb3ItcGxheWVyc1wiOiAvLyBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJFdmVuIGdlZHVsZCBhdWIuIFdlIHdhY2h0ZW4gdG90IGVyIGdlbm9lZyBtZWRlc3BlbGVycyB6aWpuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmlkZGluZ1wiOiAvLyBwYWdlLWJpZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXYWNodCBvbSBkZSBiZXVydCBvcCBlZW4gdmVyem9layB0b3QgaGV0IGRvZW4gdmFuIGVlbiBib2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5LXJlcG9ydGluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5aW5nXCI6IC8vID8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXYWNodCBvcCBoZXQgdmVyem9layB0b3QgaGV0IG9wZ2V2ZW4gdmFuIGRlIHRyb2Vma2xldXIgZW4vb2YgZGUgbWVlIHRlIHZyYWdlbiBhYXMvaGVlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaGVkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCAoYmlqKXNwZWxlbiB2YW4gZWVuIGthYXJ0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiQlVHOiBVbmtub3duIHBhZ2UgJ1wiK19wYWdlK1wiJyByZXF1ZXN0ZWQhXCIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbmV4dFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBuZXh0IHBhZ2UhXCIpO1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgLy8gTURIQDA3SkFOMjAyMDogaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBuZXh0IHBhZ2UsIHdoZW4gbm90IHJ1bm5pbmcgaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBwYWdlLWF1dGggcGFnZVxuICAgIC8vICAgICAgICAgICAgICAgIGluIGRlbW8gbW9kZSBza2lwIHRoZSBhdXRoIGFuZCB3YWl0IGZvciBwbGF5ZXJzIGJ1dHRvblxuICAgIHN3aXRjaChwYWdlSW5kZXgpe1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1hdXRoXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogLy8gc2hvdWxkIHdlIGNoZWNrIHRoZSB1c2VyIG5hbWVzPz8/Pz8/XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrMSklUEFHRVMubGVuZ3RoXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBjYW5jZWxQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgcHJldmlvdXMgcGFnZS5cIik7XG4gICAgLy8gZ28gb25lIHBhZ2UgYmFja1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4K1BBR0VTLmxlbmd0aC0xKSVQQUdFUy5sZW5ndGhdKTtcbn1cbmZ1bmN0aW9uIHJldHVyblRvUHJldmlvdXNQYWdlKCl7XG4gICAgLy8gcG9wIG9mZiB0aGUgcGFnZSB3ZSBhcmUgZ29pbmcgdG8gdmlzaXQsIHByZXZlbnRpbmcgdG8gcHVzaCB0aGUgY3VycmVudFBhZ2UgYWdhaW5cbiAgICBpZih2aXNpdGVkUGFnZXMubGVuZ3RoPjApe2N1cnJlbnRQYWdlPW51bGw7c2V0UGFnZSh2aXNpdGVkUGFnZXMuc2hpZnQoKSk7fVxufVxuZnVuY3Rpb24gc2hvd0hlbHAoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIGhlbHAhXCIpO1xuICAgIHNldFBhZ2UoJ3BhZ2UtcnVsZXMnKTtcbn1cbi8vIGFzY2VydGFpbiB0byBkaXNhYmxlIHRoZSBIZWxwIGJ1dHRvbiB3aGVuIHZpZXdpbmcgaXQhISFcbmZ1bmN0aW9uIHVwZGF0ZUhlbHBCdXR0b25zKCl7XG4gICAgbGV0IGVuYWJsZUhlbHBCdXR0b249KGN1cnJlbnRQYWdlIT09J3BhZ2UtaGVscCcpO1xuICAgIGZvcihsZXQgaGVscEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWxwJykpaGVscEJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlSGVscEJ1dHRvbjtcbn1cblxuLyoqXG4gKiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbmV3LXBsYXllcnMgYnV0dG9uIGlzIGNsaWNrZWQsIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCBhIG5ldyBzZXQgb2YgcGxheWVyc1xuICovXG5mdW5jdGlvbiBuZXdQbGF5ZXJzKCl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gTmlldXdlIHNwZWxlcnMgYWFubWFrZW4uXCIpO1xuICAgIHBsYXllcnM9W107XG4gICAgbGV0IG5vUGxheWVyTmFtZXM9dHJ1ZTtcbiAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIHBsYXllciBpbnB1dCBmaWVsZHNcbiAgICBmb3IocGxheWVyTmFtZUlucHV0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKHBsYXllck5hbWVJbnB1dC52YWx1ZS5sZW5ndGg+MCl7XG4gICAgICAgICAgICBub1BsYXllck5hbWVzPWZhbHNlO1xuICAgICAgICAgICAgcGxheWVycy5wdXNoKG5ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZUlucHV0LnZhbHVlKSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgIGlmKHBsYXllcnMubGVuZ3RoPDQpXG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobnVsbCk7XG4gICAgfVxuICAgIGlmKG5vUGxheWVyTmFtZXMpe1xuICAgICAgICBwbGF5ZXJzPW51bGw7XG4gICAgICAgIHNldEluZm8oXCJHZWVuIHNwZWxlcm5hbWVuIG9wZ2VnZXZlbi4gSGViIHRlbm1pbnN0ZSBlZW4gc3BlbGVybmFhbSBub2RpZyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJSaWtrZW4gLSBoZXQgc3BlbDogTmlldXdlIHNwZWxlcnMgYWFuZ2VtYWFrdCFcIik7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbEdhbWUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7Ly9pZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJHZWVuIHNwZWwhXCIpO1xuICAgIGlmKCFyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgYWxlcnQoXCJHZWVuIHNwZWwgb20gYWYgdGUgYnJla2VuISBMYWFkIGRlemUgd2ViIHBhZ2luYSBvcG5pZXV3IVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjb25maXJtKFwiV2lsdCBVIGVjaHQgaGV0IGh1aWRpZ2Ugc3BlbCBhZmJyZWtlbj9cIikpe1xuICAgICAgICByaWtrZW5UaGVHYW1lLmNhbmNlbCgpO1xuICAgIH1cbn1cblxuLy8gTURIQDA3SkFOMjAyMDogYWRkaXRpb25hbCBzdHVmZiB0aGF0IHdlJ3JlIGdvaW5nIHRvIG5lZWQgdG8gbWFrZSB0aGlzIHN0dWZmIHdvcmtcbmNsYXNzIFBsYXllckdhbWVQcm94eSBleHRlbmRzIFBsYXllckdhbWUge1xuXG4gICAgZ2V0U2VuZEV2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpK1wiLlwiKTtcbiAgICAgICAgcmV0dXJuIFtldmVudCxkYXRhXTtcbiAgICB9XG5cbiAgICAvLyB3aGF0IHRoZSBwbGF5ZXIgd2lsbCBiZSBjYWxsaW5nIHdoZW4gKHMpaGUgbWFkZSBhIGJpZCwgcGxheWVkIGEgY2FyZCwgY2hvb3NlIHRydW1wIG9yIHBhcnRuZXIgc3VpdGVcbiAgICBiaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnQklEJyxiaWQpKTsgLy8gbm8gbmVlZCB0byBzZW5kIHRoZSBwbGF5ZXIgaWQgSSB0aGluay4uLiB7J2J5Jzp0aGlzLl9wbGF5ZXJJbmRleCwnYmlkJzpiaWR9KSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICBzaG93R2FtZVN0YXRlKG51bGwpOyAvLyBhIGJpdCBjcnVkZSB0byBnZXQgcmlkIG9mIHRoZSBCaWVkZW4gcGFnZSBuYW1lIHRob3VnaFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY2FyZFBsYXllZChjYXJkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdDQVJEJyxbY2FyZC5zdWl0ZSxjYXJkLnJhbmtdKSk7IC8vIHJlcGxhY2luZzogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdjYXJkJzpbY2FyZC5zdWl0ZSxjYXJkLnJhbmtdfSkpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgc2hvd0dhbWVTdGF0ZShudWxsKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSkpOyAvLyBzYW1lIGhlcmU6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnc3VpdGUnOnRydW1wU3VpdGV9KSk7XG4gICAgICAgIHNob3dHYW1lU3RhdGUobnVsbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBwYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdQQVJUTkVSU1VJVEUnLHBhcnRuZXJTdWl0ZSkpOyAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnc3VpdGUnOnBhcnRuZXJTdWl0ZX0pKTtcbiAgICAgICAgc2hvd0dhbWVTdGF0ZShudWxsKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2V0IHN0YXRlKG5ld3N0YXRlKXtcbiAgICAgICAgbGV0IG9sZHN0YXRlPXRoaXMuX3N0YXRlO1xuICAgICAgICB0aGlzLl9zdGF0ZT1uZXdzdGF0ZTtcbiAgICAgICAgLy8gZG8gc3R1ZmYgKGNoYW5nZSB0byBhbm90aGVyIHBhZ2UpXG4gICAgICAgIF9nYW1lU3RhdGVDaGFuZ2VkKG9sZHN0YXRlLHRoaXMuX3N0YXRlKTtcbiAgICB9XG5cbiAgICBsb2dFdmVudChldmVudCxkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCl7cmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTt9XG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9cGxheWVyTmFtZXM7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PSghdGhpcy5fcGxheWVyTmFtZXN8fHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD09MD8tMTp0aGlzLl9wbGF5ZXJOYW1lcy5pbmRleE9mKGN1cnJlbnRQbGF5ZXIubmFtZSkpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PXRoaXMuX3BsYXllckluZGV4O1xuICAgICAgICBpZih0aGlzLl9wbGF5ZXJJbmRleDwwKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQ3VycmVudCBwbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXBkYXRlR2FtZVBsYXllck5hbWVzKCk7XG4gICAgfVxuXG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKCk7XG4gICAgfVxuICAgIHByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJlcGFyaW5nIGZvciBjb21tdW5pY2F0aW9uXCIpO1xuICAgICAgICAvLyB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgIC8vICAgICB0aGlzLl9zdGF0ZT1JRExFO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnZGlzY29ubmVjdCcsbnVsbCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVnaXN0ZXIgdG8gcmVjZWl2ZSBkYXRhIG9uIGFsbCBjdXN0b20gZXZlbnRzXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignU1RBVEVDSEFOR0UnLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnU1RBVEVDSEFOR0UnLGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcGxheWVyIGV2ZW50cyAoaW4gb3JkZXIgb2YgYXBwZWFyYW5jZSlcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ0dBTUUnLGRhdGEpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJHYW1lIGluZm9ybWF0aW9uIHJlY2VpdmVkIGJ5ICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInLlwiLGRhdGEpO1xuICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgIHRoaXMubmFtZT1kYXRhO1xuICAgICAgICAgICAgaWYoZGF0YS5oYXNPd25Qcm9wZXJ0eSgncGxheWVycycpKXRoaXMucGxheWVyTmFtZXM9ZGF0YS5wbGF5ZXJzO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gd2hlbiB0aGUgcmVtb3RlIGdhbWUgcmVhY2hlcyB0aGUgSURMRSBzdGF0ZSAoYW5kIHRoZSBnYW1lIGlzIG9uISEhISlcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZRVJTJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1BMQVlFUlMnLGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lcz1kYXRhO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdERUFMRVInLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnREVBTEVSJyxkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2RlYWxlcj1kYXRhO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEUycsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdDQVJEUycsZGF0YSk7XG4gICAgICAgICAgICAvLyBjcmVhdGUgaG9sZGFibGUgY2FyZCBmcm9tIGNhcmRJbmZvIHBhc3NpbmcgaW4gdGhlIGN1cnJlbnQgcGxheWVyIGFzIGNhcmQgaG9sZGVyXG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUlVNUCcsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdUUlVNUCcsZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVInLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnUEFSVE5FUicsZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVJTkZPJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ0dBTUVJTkZPJyxkYXRhKTtcbiAgICAgICAgICAgIC8vIHR5cGljYWxseSB0aGUgZ2FtZSBpbmZvIGNvbnRhaW5zIEFMTCBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRoZSBnYW1lIHRoYXQgaXMgZ29pbmcgdG8gYmUgcGxheWVkXG4gICAgICAgICAgICAvLyBpLmUuIGFmdGVyIGJpZGRpbmcgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICB0aGlzLl90cnVtcFN1aXRlPWRhdGEudHJ1bXBTdWl0ZTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1kYXRhLnBhcnRuZXJTdWl0ZTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPWRhdGEucGFydG5lclJhbms7XG4gICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkPWRhdGEuaGlnaGVzdEJpZDtcbiAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWRkZXJzPWRhdGEuaGlnaGVzdEJpZGRlcnM7XG4gICAgICAgICAgICB0aGlzLl90cnVtcFBsYXllcj1kYXRhLnRydW1wUGxheWVyO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fQklEXCIsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdUT19CSUQnLGRhdGEpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvLWJpZCcpLmlubmVySFRNTD1kYXRhO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdNQUtFX0FfQklEJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ01BS0VfQV9CSUQnLGRhdGEpO1xuICAgICAgICAgICAgY3VycmVudFBsYXllci5tYWtlQUJpZChkYXRhLnBsYXllckJpZHNPYmplY3RzLGRhdGEucG9zc2libGVCaWRzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX1BMQVlcIiwoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1RPX1BMQVknLGRhdGEpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvLWJpZCcpLmlubmVySFRNTD1kYXRhO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZX0FfQ0FSRCcsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdQTEFZX0FfQ0FSRCcsZGF0YSk7XG4gICAgICAgICAgICAvLyB3ZSdyZSByZWNlaXZpbmcgdHJpY2sgaW5mbyBpbiBkYXRhXG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZChwYXJzZVRyaWNrKGRhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1RSVU1QX1NVSVRFJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ0NIT09TRV9UUlVNUF9TVUlURScsZGF0YSk7XG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLmNob29zZVRydW1wU3VpdGUoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9QQVJUTkVSX1NVSVRFJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiLGRhdGEpO1xuICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VQYXJ0bmVyU3VpdGUoZGF0YS5zdWl0ZXMsZGF0YS5wYXJ0bmVyUmFua05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDSycsKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLmxvZ0V2ZW50KCdUUklDSycscGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICB1cGRhdGVUcmlja3MocGFyc2VUcmljaygpKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1MnLChkYXRhKT0+e1xuICAgICAgICAgICAgdGhpcy5sb2dFdmVudCgnVFJJQ0tTJyxkYXRhKTtcbiAgICAgICAgICAgIC8vIHdlIGNhbid0IGp1c3Qgc2ltcGx5IGFzc2lnbiB0aGUgdHJpY2tzIHRob3VnaFxuICAgICAgICAgICAgdGhpcy5fdHJpY2tzPVtdOyAvLyBzaG91bGQgYWxyZWFkeSBiZSB0aGUgY2FzZT8/Pz8/XG4gICAgICAgICAgICBkYXRhLmZvckVhY2goKHRyaWNrSW5mbyk9Pnt0aGlzLl90cmlja3MucHVzaCh0aGlzLnBhcnNlVHJpY2sodHJpY2tJbmZvKSl9KTtcbiAgICAgICAgICAgIHVwZGF0ZVRyaWNrcygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdSRVNVTFRTJywoZGF0YSk9PntcbiAgICAgICAgICAgIHRoaXMubG9nRXZlbnQoJ1JFU1VMVFMnLGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5fZGVsdGFQb2ludHM9ZGF0YS5kZWx0YXBvaW50cztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTURIQDA4SkFOMjAyMDogc29ja2V0IHNob3VsZCByZXByZXNlbnQgYSBjb25uZWN0ZWQgc29ja2V0LmlvIGluc3RhbmNlISEhXG4gICAgY29uc3RydWN0b3Ioc29ja2V0KXtcbiAgICAgICAgLy8gT09QUyBkaWRuJ3QgbGlrZSBmb3JnZXR0aW5nIHRoaXMhISEgXG4gICAgICAgIC8vIGJ1dCBQbGF5ZXJHYW1lIGRvZXMgTk9UIGhhdmUgYW4gZXhwbGljaXQgY29uc3RydWN0b3IgKGkuZS4gbm8gcmVxdWlyZWQgYXJndW1lbnRzKVxuICAgICAgICBzdXBlcigpOyBcbiAgICAgICAgdGhpcy5fc3RhdGU9UGxheWVyR2FtZS5PVVRfT0ZfT1JERVI7XG4gICAgICAgIHRoaXMuX3NvY2tldD1zb2NrZXQ7XG4gICAgICAgIHRoaXMuX2RlYWxlcj0tMTtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTt0aGlzLl90cnVtcFBsYXllcj0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO3RoaXMuX3BhcnRuZXJSYW5rPS0xO1xuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1dvbj1bMCwwLDAsMF07IC8vIGFzc3VtZSBubyB0cmlja3Mgd29uIGJ5IGFueWJvZHlcbiAgICAgICAgdGhpcy5faGlnaGVzdEJpZD0tMTt0aGlzLl9oaWdoZXN0QmlkZGVycz1bXTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1udWxsO1xuICAgICAgICB0aGlzLl9wb2ludHM9bnVsbDtcbiAgICAgICAgdGhpcy5fbGFzdFRyaWNrUGxheWVkPW51bGw7XG4gICAgICAgIHRoaXMuX3RlYW1OYW1lcz1udWxsO1xuICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0tMTsgLy8gdGhlICdjdXJyZW50JyBwbGF5ZXJcbiAgICAgICAgLy8gdGhpbmdzIHdlIGNhbiBzdG9yZSBpbnRlcm5hbGx5IHRoYXQgd2UgcmVjZWl2ZSBvdmVyIHRoZSBjb25uZWN0aW9uXG4gICAgICAgIHRoaXMuX25hbWU9bnVsbDsgLy8gdGhlIG5hbWUgb2YgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9bnVsbDsgLy8gdGhlIG5hbWVzIG9mIHRoZSBwbGF5ZXJzXG4gICAgICAgIHRoaXMuX3BhcnRuZXJJbmRpY2VzPW51bGw7IC8vIHRoZSBwYXJ0bmVyXG4gICAgICAgIHRoaXMucHJlcGFyZUZvckNvbW11bmljYXRpb24oKTtcbiAgICB9XG5cbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ2FtZSBpdHNlbGYgb3JnYW5pemVkIGJ5IHN0YXRlXG4gICAgLy8gUExBWUlOR1xuICAgIGdldFRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgIGdldFRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO31cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcil7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllcl07fVxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7cmV0dXJuIHRoaXMuX3BhcnRuZXJOYW1lc1twbGF5ZXJdO31cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyczt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkO31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJdO31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXtyZXR1cm4gdGhpcy5fZGVsdGFQb2ludHM7fVxuICAgIGdldCBwb2ludHMoKXtyZXR1cm4gdGhpcy5fcG9pbnRzO31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXtyZXR1cm4gdGhpcy5fcGFydG5lcklkc1twbGF5ZXJdPT09b3RoZXJQbGF5ZXI7fVxuICAgIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7cmV0dXJuIHRoaXMuX2dldFRlYW1OYW1lc1twbGF5ZXJdO31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcjt9XG5cbn1cblxudmFyIHByZXBhcmVkRm9yUGxheWluZz1mYWxzZTtcblxuZnVuY3Rpb24gcHJlcGFyZUZvclBsYXlpbmcoKXtcblxuICAgIHByZXBhcmVkRm9yUGxheWluZz10cnVlO1xuXG4gICAgLy8gTURIQDEwSkFOMjAyMDogd2Ugd2FudCB0byBrbm93IHdoZW4gdGhlIHVzZXIgaXMgdHJ5aW5nIHRvIG1vdmUgYXdheSBmcm9tIHRoZSBwYWdlXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGhvdyBhYm91dCBwcm9tcHRpbmcgdGhlIHVzZXI/Pz8/P1xuICAgICAgICBpZighY3VycmVudFBsYXllcnx8IWN1cnJlbnRQbGF5ZXIuZ2FtZSlyZXR1cm47IC8vIGRvIG5vdCBhc2sgdGhlIHVzZXIgd2hldGhlciB0aGV5IHdhbnQgdG8gc3RheSBvciBub3QgKGFzIHRoZXkgY2Fubm90IHN0YXkpXG4gICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIHZpZXdpbmcgdGhlIHJlc3VsdHMgcGFnZSB3ZSBtYXkgYXNzdW1lIHRoYXQgdGhlIGdhbWUgaXMgYWN0dWFsbHkgb3ZlclxuICAgICAgICByZXR1cm4oY3VycmVudFBhZ2U9PT0ncGFnZS1yZXN1bHRzJz9cIkJlZGFua3Qgdm9vciBoZXQgc3BlbGVuLiBUb3QgZGUgdm9sZ2VuZGUga2VlciFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcIkhldCBzcGVsIGlzIG5vZyBuaWV0IHRlbiBlaW5kZS4gQmxpamYgb3AgZGUgcGFnaW5hIG9tIHRvY2ggdmVyZGVyIHRlIHNwZWxlbi5cIik7XG4gICAgfTtcbiAgICAvLyBpZiB3ZSBhY3R1YWxseSBlbmQgdXAgaW4gbGVhdmluZyB0aGlzIFVSTCwgd2UgZGVmaW5pdGVseSB3YW50IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBmb3IgZ29vZFxuICAgIHdpbmRvdy5vbnBvcHN0YXRlPWZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIuZ2FtZSYmY3VycmVudFBsYXllci5nYW1lLnN0YXRlIT09UGxheWVyR2FtZS5GSU5JU0hFRClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogUGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIGhhcyBzdG9wcGVkIHBsYXlpbmcgdGhlIGdhbWUgYW55IGZ1cnRoZXIsIGVmZmVjdGl2ZWx5IGNhbmNlbGluZyBpdC5cIik7XG4gICAgICAgIHNldFBsYXllck5hbWUobnVsbCxudWxsKTsgLy8gd2l0aG91dCBjYWxsYmFjayBubyBwYWdlIHNob3VsZCBiZSBzaG93biBhbnltb3JlLi4uXG4gICAgfVxuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogaGlkZSB0aGUgYmlkZGluZyBhbmQgcGxheWluZyBlbGVtZW50c1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItZ2FtZS1idXR0b24nKS5vbmNsaWNrPXNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIGZvcihsZXQgYmFja0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrJykpYmFja0J1dHRvbi5vbmNsaWNrPXJldHVyblRvUHJldmlvdXNQYWdlO1xuICAgIC8vIHNob3cgdGhlIHBhZ2UtcnVsZXMgcGFnZSB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIGhlbHBcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24ub25jbGljaz1zaG93SGVscDtcbiAgICAvLyBNREhAMTBKQU4yMDIwOiBFTkRcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzIGZvciBuZXh0LCBjYW5jZWwsIGFuZCBuZXdQbGF5ZXJzIGJ1dHRvbnNcbiAgICBmb3IobGV0IG5leHRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV4dCcpKW5leHRCdXR0b24ub25jbGljaz1uZXh0UGFnZTtcbiAgICBmb3IobGV0IGNhbmNlbEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwnKSljYW5jZWxCdXR0b24ub25jbGljaz1jYW5jZWxQYWdlO1xuICAgIFxuICAgIC8vIGxldCdzIGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIG92ZXIgd2hlbiBuZXctZ2FtZSBidXR0b25zIGFyZSBzaG93aW5nXG4gICAgLy8gd2UncmUgbm90IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24sIHdlJ2xsIGp1c3Qga2VlcCB1c2luZyB0aGUgc2FtZSBjb25uZWN0aW9uXG4gICAgZm9yKGxldCBuZXdHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXctZ2FtZVwiKSluZXdHYW1lQnV0dG9uLm9uY2xpY2s9bmV3R2FtZTtcbiAgICAvKlxuICAgIC8vIHdoZW5ldmVyIHdlIGhhdmUgbmV3IHBsYXllcihuYW1lKXNcbiAgICBmb3IobGV0IG5ld0dhbWVQbGF5ZXJzQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25ldy1nYW1lLXBsYXllcnMnKSluZXdHYW1lUGxheWVyc0J1dHRvbi5vbmNsaWNrPW5ld0dhbWVQbGF5ZXJzO1xuICAgIC8vIHdoZW5ldmVyIHRoZSBnYW1lIGlzIGNhbmNlbGVkXG4gICAgZm9yKGxldCBjYW5jZWxHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhbmNlbC1nYW1lJykpY2FuY2VsR2FtZUJ1dHRvbi5vbmNsaWNrPWNhbmNlbEdhbWU7XG4gICAgKi9cblxuICAgIC8vIGF0dGFjaCBhbiBvbmNsaWNrIGV2ZW50IGhhbmRsZXIgZm9yIGFsbCBiaWQgYnV0dG9uc1xuICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpYmlkQnV0dG9uLm9uY2xpY2s9YmlkQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBwcmVwYXJlIGZvciBzaG93aW5nL2hpZGluZyB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgYmlkZGVyXG4gICAgaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKTtcbiAgICAvLyByZXBsYWNpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS5vbmNsaWNrPXRvZ2dsZUJpZGRlckNhcmRzO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlciBmb3Igc2VsZWN0aW5nIGEgc3VpdGVcbiAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuYmlkLXRydW1wXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9dHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC1wYXJ0bmVyXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9cGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZDtcbiAgICAvLyBjbGlja2luZyBjYXJkICdidXR0b25zJyAobm93IGNlbGxzIGluIHRhYmxlKSwgd2UgY2FuIGdldCByaWQgb2YgdGhlIGJ1dHRvbiBpdHNlbGYhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlwbGF5YWJsZWNhcmRCdXR0b24ub25jbGljaz1wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIG1ha2UgdGhlIHN1aXRlIGVsZW1lbnRzIG9mIGEgc3BlY2lmaWMgdHlwZSBzaG93IHRoZSByaWdodCB0ZXh0ISEhIVxuICAgIGZvcihsZXQgc3VpdGU9MDtzdWl0ZTw0O3N1aXRlKyspXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5cIitDYXJkLlNVSVRFX05BTUVTW3N1aXRlXSkpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi52YWx1ZT1DYXJkLlNVSVRFX0NIQVJBQ1RFUlNbc3VpdGVdO1xuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogY2hlY2sgZm9yIGEgdXNlciBuYW1lXG4gICAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgbGV0IGluaXRpYWxQbGF5ZXJOYW1lPSh1cmxQYXJhbXMuaGFzKFwidXNlclwiKT91cmxQYXJhbXMuZ2V0KFwidXNlclwiKS50cmltKCk6bnVsbCk7XG4gICAgc2V0UGxheWVyTmFtZShpbml0aWFsUGxheWVyTmFtZSwoZXJyKT0+e30pO1xuXG59O1xuXG4vLyBNREhAMDhKQU4yMDIwOiBncmVhdCBpZGVhIHRvIG1ha2UgZXZlcnl0aGluZyB3b3JrIGJ5IGFsbG93aW5nIHRvIHNldCB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIF9zZXRQbGF5ZXIocGxheWVyLGVycm9yY2FsbGJhY2spe1xuICAgIHZpc2l0ZWRQYWdlcz1bXTsgLy8gZm9yZ2V0IHZpc2l0ZWQgcGFnZXNcbiAgICBjdXJyZW50UGFnZT1udWxsOyAvLyBhc2NlcnRhaW4gdG8gbm90IGhhdmUgYSBwYWdlIHRvIHN0b3JlXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgY3VycmVudCBwbGF5ZXIgKGlmIGFueSksIGFuZCBpbiBlZmZlY3Qgd2UnbGwgbG9vc2UgdGhlIGdhbWUgYXMgd2VsbFxuICAgIGlmKGN1cnJlbnRQbGF5ZXIpe1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNoYW5nZSBjdXJyZW50UGxheWVyIGJlY2F1c2UgaXQncyBnb25uYSBiZSByZXBsYWNlZCBhbnl3YXlcbiAgICAgICAgLy8gYnV0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIgYW55d2F5XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9Y3VycmVudFBsYXllci5fY2xpZW50O1xuICAgICAgICAvLyBkaXNjb25uZWN0IGlmIG5lZWQgYmVcbiAgICAgICAgKCFjbGllbnRzb2NrZXR8fCFjbGllbnRzb2NrZXQuY29ubmVjdGVkfHxjbGllbnRzb2NrZXQuZGlzY29ubmVjdCgpKTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBjdXJyZW50UGxheWVyLmdhbWU9bnVsbDsgLy8gZ2V0IHJpZCBvZiB0aGUgZ2FtZSAod2hpY2ggd2lsbCBkaXNjb25uZWN0IHRoZSBzb2NrZXQgYXMgd2VsbCkgV0lTSEZVTCBUSElOS0lORy4uLlxuICAgICAgICBjdXJyZW50UGxheWVyPW51bGw7XG4gICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICBpZihlcnJvcmNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBNREhAMTBKQU4yMDIwOiB3aGVuZXZlciB0aGUgY3VycmVudFBsYXllciBpcyBOT1QgYXZhaWxhYmxlIGdvIHRvIFwicGFnZS1ydWxlc1wiXG4gICAgfVxuICAgIC8vIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIHRoZSBwYWdlIHdlIGNhbiBzaG93IGlmIHRoZXJlJ3Mgbm8gcGxheWVyISEhISAoVE9ETyBvciBwYWdlLWF1dGg/Pz8/PylcbiAgICBpZihwbGF5ZXIpe1xuICAgICAgICBsZXQgY2xpZW50c29ja2V0PWlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0ZWQhISFcIik7XG4gICAgICAgICAgICAgICAgY2xpZW50c29ja2V0LmVtaXQoJ1BMQVlFUicscGxheWVyLm5hbWUpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXI9cGxheWVyO1xuICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5pbmRleD00O1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICAgICAgaWYoZXJyb3JjYWxsYmFjayl7ZXJyb3JjYWxsYmFjayhudWxsKTtzZXRQYWdlKFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIpO31cbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6ICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLlwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywoZXJyKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0IGVycm9yOiBcIixlcnIpO1xuICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRyeSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgY2F0Y2hpbmcgd2hhdGV2ZXIgaGFwcGVucyB0aHJvdWdoIGV2ZW50c1xuICAgICAgICBjbGllbnRzb2NrZXQuY29ubmVjdCgvKihlcnIpPT57XG4gICAgICAgICAgICBkZWJ1Z2dlclxuICAgICAgICAgICAgaWYoIWVycil7XG4gICAgICAgICAgICAgICAgLy8gYnkgZGVmYXVsdCB1c2UgZXJyb3JjYWxsYmFjayB0byByZXR1cm4gYW55IGVycm9yIG9jY3VycmluZ1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvcmNhbGxiYWNrPT09J2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdlcnJvcicsZXJyb3JjYWxiYWNrKTtcbiAgICAgICAgICAgICAgICBlbHNlIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gdGhhdCBsb2dzIHRvIHRoZSBjb25zb2xlISFcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdlcnJvcicsKGVycik9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IEVSUk9SOiBTb21ldGhpbmcgd2VudCB3cm9uZyBpbiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiXFx0XCIrZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWl0dGluZyBwbGF5ZXIgbmFtZSAnXCIrcGxheWVyLm5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgICAgICBjbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxwbGF5ZXIubmFtZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgLy8gcGx1ZyBpbiBhIGdhbWU/Pz8/P1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEZhaWxlZCB0byBjb25uZWN0IHRvIHRoZSByZW1vdGUgZ2FtZSBzZXJ2ZXJcIik7XG4gICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKGVycikpO1xuICAgICAgICB9Ki8pO1xuICAgIH1lbHNlXG4gICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpO1xufVxuXG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCB0aGUgKG5ldykgbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXIgd2hlbmV2ZXIgdGhlIHBsYXllciB3YW50cyB0byBwbGF5XG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCBudWxsIChvciBlbXB0eSkgcGxheWVyIG5hbWVcbi8vIHRvIG1ha2UgaXQgY2FsbGFibGUgZnJvbSBhbnl3aGVyZSB3ZSBhdHRhY2ggc2V0UGxheWVyTmFtZSB0byB3aW5kb3cgKGJlY2F1c2UgY2xpZW50LmpzIHdpbGwgYmUgYnJvd3NlcmlmaWVkISEhKVxuZnVuY3Rpb24gc2V0UGxheWVyTmFtZShwbGF5ZXJOYW1lLGVycm9yQ2FsbGJhY2spe1xuICAgIChwcmVwYXJlZEZvclBsYXlpbmd8fHByZXBhcmVGb3JQbGF5aW5nKCkpOyAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIG9uY2VcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiYhKHR5cGVvZiBwbGF5ZXJOYW1lPT09XCJzdHJpbmdcIikpXG4gICAgICAgIHJldHVybih0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobmV3IEVycm9yKFwiSW52YWxpZCBwbGF5ZXIgbmFtZS5cIikpKTtcbiAgICAvLyBpZiBwbGF5ZXJOYW1lIG1hdGNoZXMgdGhlIGN1cnJlbnQgcGxheWVyJ3MgbmFtZSwgbm90aGluZyB0byBkb1xuICAgIGlmKHBsYXllck5hbWUmJmN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIubmFtZT09PXBsYXllck5hbWUpXG4gICAgICAgICh0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCxlcnJvckNhbGxiYWNrKTtcbn1cblxud2luZG93Lm9ubG9hZD1wcmVwYXJlRm9yUGxheWluZztcblxuLy8gZXhwb3J0IHRoZSB0d28gZnVuY3Rpb24gdGhhdCB3ZSBhbGxvdyB0byBiZSBjYWxsZWQgZnJvbSB0aGUgb3V0c2lkZSEhIVxubW9kdWxlLmV4cG9ydHM9c2V0UGxheWVyTmFtZTsiXX0=
