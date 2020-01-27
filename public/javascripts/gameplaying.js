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
        // ah this is an issue, because if you do not have a certain suite the suite should NOT be returned!!!!!
        let suites=[];
        this._cards.forEach((card)=>{
            if(suites.indexOf(card.suite)<0)suites.push(card.suite); // if suite not present yet, add it to suites
            if(card.rank===rank)suites[card.suite]=-1; // not removing it but setting to -1 if we locate the rank
        });
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
    _askPlayerForBid(){}
    _askPlayerForTrumpSuite(){}
    _askPlayerForPartnerSuite(){}
    _askPlayerForCard(){}
    _cardPlayedAccepted(){} // MDH@23JAN2020: the empty method to be called when a card was played successfully
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
            return new Error("Geen spel om voor te bereiden om te spelen.");
        let numberOfCards=this.numberOfCards;
        if(numberOfCards>0){
            this._removeCards(); // better done this way instead of this._cards=[]
            return new Error("Nog "+numberOfCards+" kaarten in de hand.");
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
            if(!(playerEventListener instanceof PlayerEventListener))
                throw new Error("Player event listener of wrong type.");
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
            return new Error("Spel niet van het juiste type.");
        if(this._index<0)
            return new Error("Positie van speler onbekend.");
        this._removeCards(); // MDH@11JAN2020: if the game changes we should remove the cards
        this._game=game;
        // sync _index
        if(this._game){
            // prepare for playing the game
            this.partner=-1; // my partner (once I now who it is)
            this.tricksWon=[]; // storing the tricks won
        }
    }

    get index(){return this._index;} // MDH@22JAN2020: no harm in adding a getter!!!
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
        if(this._cards.length==0)return new Error("Geen kaarten meer om te spelen!");
        let cardsOfSuite=this._getCardsOfSuite(cardSuite);
        let card=(cardsOfSuite&&cardsOfSuite.length>0?cardsOfSuite[0]:this._cards[0]);
        card.holder=trick; // move the card to the trick
        return null;
    }

    // MDH: all methods that deal with processing a bid, a card, trump or partner suite choice
    // to signal having made a bid
    _bidMade(bid){
        if(!this._game)return new Error("Geen spel om in te bieden!");
        console.log("Passing bid "+bid+" of player '"+this.name+"' to the game!");
        return this._game.bidMade(bid);
    }
    // MDH@26JAN2020: returning true on success (when _bidMade did not return an error)
    _setBid(bid){
        let error=this._bidMade(bid);
        if(error)return error;
        this._bid=bid;
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{(!eventListener||eventListener.bidMade(this._bid));}catch(error){}});
        return null;
    }

    // cardPlayed in RikkenTheGame can now return an error (instead of throwing one)
    _cardPlayed(card,askingForPartnerCard){
        if(!this._game)return new Error("Geen spel om een kaart in te spelen!");
        return this._game.cardPlayed(card,askingForPartnerCard);
    }
    // TODO a bid setter will allow subclasses to pass a bid by setting the property
    _setCard(card,askingForPartnerCard){
        // technically checking whether the played card is valid should be done here, or BEFORE calling setCard
        let error=this._cardPlayed(card,askingForPartnerCard);
        if(error)return error;
        this._card=card;
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{eventListener.cardPlayed(this._card,askingForPartnerCard);}catch(error){};});
    }

    // to signal having choosen a trump suite
    _trumpSuiteChosen(trumpSuite){
        if(!this._game)return new Error("Geen spel om een troefkleur in te kiezen!");
        return this._game.trumpSuiteChosen(trumpSuite);
    }
    _setTrumpSuite(trumpSuite){
        let error=this._trumpSuiteChosen(trumpSuite);
        if(error)return error;
        this._trumpSuite=trumpSuite;
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{eventListener.trumpSuiteChosen(this._trumpSuite);}catch(error){};});
    }

    // to signal having chosen a partner
    _partnerSuiteChosen(partnerSuite){
        if(!this._game)return new Error("Geen spel om een partner (kaartkleur) te kiezen.");
        return this._game.partnerSuiteChosen(partnerSuite);
    }
    _setPartnerSuite(partnerSuite){
        let error=this._partnerSuiteChosen(partnerSuite);
        if(error)return error;
        this._partnerSuite=partnerSuite;
        if(this._eventListeners)this._eventListeners.forEach((eventListener)=>{try{eventListener.partnerSuiteChosen(this._partnerSuite);}catch(error){};});
    }

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

    set partner(partner){this._partner=(typeof partner==='number'?partner:-1);} // to set the partner once the partner suite/rank card is in the trick!!!!

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
        // MDH@27JAN2020: should consider returning an Error instead of throwing an error
        if(this.numberOfCards<=numberOfCardsNow)
            return new Error("Failed to add the card to the trick.");
        // ASSERT card added successfully
        if(this._askingForPartnerCard!=0&&this._trumpSuite<0)
            return new Error("BUG: Asking for the partner card, but playing a game without trump.");
        
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
                    return new Error("Cannot ask for the partner card when you can't ask for it anymore!");
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
        return null;
    }
    getCardPlayer(suite,rank){
        for(let cardIndex=0;cardIndex<this._cards.length;cardIndex++)
            if(this._cards[cardIndex].suite===suite&&this._cards[cardIndex].rank===rank)
                return (this._firstPlayer+cardIndex)%4; // TODO can we assume 4 players in total?????
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

function stopPlaying(){
    // ASSERT assuming not playing in a game anymore i.e. newGame() has been called before
    // a NORMAL exit
    if(currentPlayer)currentPlayer.exit('STOP');
    // 'manually' move to the previous 'page' in the history...
    window.history.back();
}

// MDH@10JAN2020: newGame() is a bid different than in the demo version in that we return to the waiting-page
function newGame(){
    // by call playsTheGameAtIndex(null,?) we force clearing the game information being shown at the wait-for-players page
    if(!currentPlayer){
        console.log("WARNING: No player to start a new game with!");
        stopPlaying();
    }else
        currentPlayer.playsTheGameAtIndex(null,-1);
}

var forceFocusId=null;
function stopForceFocus(){clearInterval(forceFocusId);forceFocusId=null;}
function checkFocus(state){
    // MDH@23JAN2020: we should keep blinking when not in focus until forced to stop
    //                instead of stopping when the focus was got
    if(document.hasFocus())showGameState(state);else toggleGameState(state);
    // replacing: if(document.hasFocus()){showGameState(state);stopForceFocus();}else toggleGameState(state);
}
function forceFocus(state){
    showGameState(state); // either to show state or remove what's currently shown
    if(state){ // focus requested
        // start getting the focus by blinking 'state' IFF we haven't got it yet...
        if(!forceFocusId)forceFocusId=setInterval(()=>{checkFocus(state);},500);
    }else{ // end of focus request
        if(forceFocusId)stopForceFocus();
    }
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
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);if(!rikkenTheGame)return;
    // show the player names in the header row of the tricks played table
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
    // show the player names in the cards played table as well
    let playerIndex=rikkenTheGame._playerIndex;
    showPlayerName(document.getElementById("current-player-name"),rikkenTheGame.getPlayerName(playerIndex));
    showPlayerName(document.getElementById("lefthandside-player-name"),rikkenTheGame.getPlayerName((playerIndex+1)%4));
    showPlayerName(document.getElementById("opposite-player-name"),rikkenTheGame.getPlayerName((playerIndex+2)%4));
    showPlayerName(document.getElementById("righthandside-player-name"),rikkenTheGame.getPlayerName((playerIndex+3)%4));
    // show the player names in the bids table
    showPlayerNamesInBidsTable();
}

// whenever the player changes, show the player name
function showCurrentPlayerName(){
    // showGameState(currentPlayer?currentPlayer.name:null); // show the current player name immediately in the title
    for(let playerNameElement of document.getElementsByClassName("player-name"))
        if(playerNameElement)
            playerNameElement.innerHTML=(currentPlayer?currentPlayer.name:"?");
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
    if(!element){console.error("No element!");return;}
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

// MDH@23JAN2020: when showing the player name we set the color to black (just in case it's not black anymore)
function showPlayerName(element,name){
    element.innerHTML=(name?name:"?");
    element.style.color="black";
}
function showPlayerType(element,playerType){
    switch(playerType){
        case -1:element.style.color="red";break;
        case 0:element.style.color="orange";break;
        case 1:element.style.color="green";break;
        default:element.style.color="black";break;
    }
}

// MDH@20JAN2020: keep the ids of the trick played cards in a constant array
const PLAYED_CARD_IDS=["current-player-card","lefthandside-player-card","opposite-player-card","righthandside-player-card"];

// to be called on receiving the new trick event
function clearCardsPlayedTable(){
    for(let playedCardIndex in PLAYED_CARD_IDS)
        document.getElementById(PLAYED_CARD_IDS[playedCardIndex]).innerHTML="";
}

/**
 * shows the given trick
 * @param {*} trick 
 */
function showTrick(trick/*,playerIndex*/){
    
    let rikkenTheGame=currentPlayer.game;if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    
    console.log("Showing trick ",trick);
    
    let playerIndex=rikkenTheGame._playerIndex;

    // if this is the trump player that is can ask for the partner card (either non-blind or blind) flag the checkbox
    if(trick.firstPlayer===playerIndex&&trick.canAskForPartnerCard!=0){
        document.getElementById('ask-partner-card-checkbox').checked=true;
        document.getElementById('ask-partner-card-blind').innerHTML=(trick.canAskForPartnerCard<0?"blind ":"");
        document.getElementById("ask-partner-card").style.display="block";
    }else
        document.getElementById("ask-partner-card").style.display="none";

    // asking for partner card info
    document.getElementById("asking-for-partner-card-info").style.display=(trick.askingForPartnerCard!==0?"block":"none");
    //let tablebody=document.getElementById("trick-cards-table").requestSelector("tbody");

    // the player type can change every card being played (based on the partner of the current player)
    // TODO shouldn't need to do the following:
    // showPlayerName(document.getElementById("current-player-name"),rikkenTheGame.getPlayerName(playerIndex),-2);
    showPlayerType(document.getElementById("lefthandside-player-name"),currentPlayer.isFriendly((playerIndex+1)%4));
    showPlayerType(document.getElementById("opposite-player-name"),currentPlayer.isFriendly((playerIndex+2)%4));
    showPlayerType(document.getElementById("righthandside-player-name"),currentPlayer.isFriendly((playerIndex+3)%4));
    
    // NOTE the first card could be the blind card asking for the partner card in which case we should not show it!!
    //      but only the color of the partner suite
    let askingForPartnerCardBlind=(trick.numberOfCards>0&&trick._cards[0].suite!==trick.playSuite);
    // MDH@20JAN2020: show all the trick cards played at the right position
    for(let trickCardIndex=0;trickCardIndex<4;trickCardIndex++){
        let trickCard=(trickCardIndex<trick.numberOfCards?trick._cards[trickCardIndex]:null);
        let trickCardPlayerIndex=trick.firstPlayer+trickCardIndex; // the actual player index in the game
        let trickCardPosition=(trickCardPlayerIndex+4-playerIndex)%4;
        console.log("Trick card position: "+trickCardPosition+".");
        let trickCardId=PLAYED_CARD_IDS[trickCardPosition];
        if(askingForPartnerCardBlind){
            askingForPartnerCardBlind=false; // do not do this for the next players
            document.getElementById(trickCardId).innerHTML=SUITE_CHARACTERS[trick.playSuite];
            setSuiteCard(document.getElementById(trickCardId),trick.playSuite);  
        }else{
            console.log("Showing trick card #"+trickCardIndex,trickCard);
            showCard(document.getElementById(trickCardId),trickCard,trick.trumpSuite,
            (trick.winner===(trickCardPlayerIndex%4)?(rikkenTheGame.isPlayerPartner(playerIndex,trickCardPlayerIndex%4)?1:-1):0));
        }
    }
    /* replacing:
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
    */
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
    let playerIndex=0;
    let deltaPoints=rikkenTheGame.deltaPoints;
    let points=rikkenTheGame.points;
    if(!deltaPoints||!points){console.log("ERROR: Results now known yet!");return;}
    for(let playerResultsRow of document.getElementById("player-results-table").querySelector("tbody").getElementsByTagName("tr")){
        playerResultsRow.children[0].innerHTML=rikkenTheGame.getPlayerName(playerIndex);
        playerResultsRow.children[1].innerHTML=(deltaPoints?String(rikkenTheGame.getNumberOfTricksWonByPlayer(playerIndex)):"-");
        playerResultsRow.children[2].innerHTML=(deltaPoints?String(deltaPoints[playerIndex]):"-");
        playerResultsRow.children[3].innerHTML=String(points[playerIndex]);
        playerIndex++;
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
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    let lastTrickPlayedIndex=rikkenTheGame.numberOfTricksPlayed-1; // getter changed to getMethod call
    if(lastTrickPlayedIndex>=0){
        let trick=rikkenTheGame._trick; // MDH@20JAN2020 replacing: getTrickAtIndex(lastTrickPlayedIndex);
        if(!trick){console.log("ERROR: No trick to update the tricks table with!");return;}
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
            row.children[10].innerHTML=rikkenTheGame.getNumberOfTricksWonByPlayer(trick.winner); // show the number of tricks won by the trick winner (MDH@03JAN2020: changed from getting the player instance first)
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

// how to phrase a bid depends on the bid, and who plays it
function getBidInfo(bid,bidder){
    let better=(bid===PlayerGame.BID_RIK_BETER||bid===PlayerGame.BID_NEGEN_ALLEEN_BETER||bid===PlayerGame.BID_TIEN_ALLEEN_BETER||
        bid===PlayerGame.BID_ELF_ALLEEN_BETER||bid===PlayerGame.BID_TWAALF_ALLEEN_BETER||bid===PlayerGame.BID_DERTIEN_ALLEEN_BETER);
    if(better)bid--;
    switch(bid){
        case PlayerGame.BID_PAS:
            return(bidder?bidder+" heeft gepast.":"Je hebt gepast.");
        case PlayerGame.BID_RIK:
            return(bidder?bidder+" heeft ":"Je hebt ")+(better?"beter ":"")+" gerikt.";
        case PlayerGame.BID_NEGEN_ALLEEN:
            return(bidder?bidder+" wil negen slagen alleen halen.":"Je wilt negen slagen alleen halen.");
        case PlayerGame.BID_TIEN_ALLEEN:
            return(bidder?bidder+" wil tien slagen alleen halen.":"Je wilt tien slagen alleen halen.");
        case PlayerGame.BID_ELF_ALLEEN:
            return(bidder?bidder+" wil elf slagen alleen halen.":"Je wilt elf slagen alleen halen.");
        case PlayerGame.BID_TWAALF_ALLEEN:
            return(bidder?bidder+" wil twaalf slagen alleen halen.":"Je wilt twaalf slagen alleen halen.");
        case PlayerGame.BID_DERTIEN_ALLEEN:
            return(bidder?bidder+" wil":"Je wilt")+" dertien slagen alleen halen.";
        case PlayerGame.BID_PICO:
            return(bidder?bidder+" wil":"Je wilt")+" slechts een slag halen.";
        case PlayerGame.BID_MISERE:
            return(bidder?bidder+" wil":"Je wilt")+" geen enkele slag halen.";
        case PlayerGame.BID_OPEN_MISERE:
            return(bidder?bidder+" wil":"Je wilt")+" geen enkele slag halen met open kaarten.";
        case PlayerGame.BID_OPEN_MISERE_MET_EEN_PRAATJE:
            return(bidder?bidder+" wil":"Je wilt")+" geen enkele slag halen met een praatje en open kaarten.";
    }
    return(bidder?bidder+" heeft":"Je hebt")+" een ongeldig bod gedaan.";
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

function showPlayerNamesInBidsTable(){
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);if(!rikkenTheGame)return;
    let bidTable=document.getElementById("bids-table").querySelector("tbody");
    for(let playerIndex=0;playerIndex<rikkenTheGame.numberOfPlayers;playerIndex++){
        let playerBidsRow=bidTable.children[playerIndex];
        playerBidsRow.children[0].innerHTML=rikkenTheGame.getPlayerName(playerIndex); // write the name of the player
    }
}
// MDH@21NOV2020: the game would call this method each time a bid made is received!!!
function updateBidsTable(playerBidsObjects){
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);if(!rikkenTheGame)return;
    let bidTable=document.getElementById("bids-table").querySelector("tbody");
    if(playerBidsObjects)
    for(let playerBidsIndex=0;playerBidsIndex<playerBidsObjects.length;playerBidsIndex++){
        let playerBidsObject=playerBidsObjects[playerBidsIndex];
        let playerIndex=rikkenTheGame.getPlayerIndex(playerBidsObject.name);
        // on the safe side, get the player index from the game passing in  player name
        if(playerIndex<0){alert("Player "+playerBidsObject.name+" unknown!");continue;}
        let playerBidsRow=bidTable.children[playerIndex];
        // MDH@23JAN2020 showing the player names once: playerBidsRow.children[0].innerHTML=capitalize(playerBidsObject.name); // write the name of the player
        // write the bids (we have to clear the table with every new game though)
        playerBidsObject.bids.forEach((playerBid,bidIndex)=>{playerBidsRow.children[bidIndex+1].innerHTML=playerBid;});
        // replacing: bidTable.children[player].children[1].innerHTML=playersBids[bid].join(" ");
    }
}

class OnlinePlayer extends Player{

    constructor(name){
        super(name,null);
    }

    getNumberOfTricksWon(){
        // ask the game
        return(this.index&&this.game?this.game.getNumberOfTricksWonByPlayer(this.index):0);
    }

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
        updateBidsTable(playerBidsObjects);
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
        // show the partner rank (ace or king) being asked
        for(let rankElement of document.getElementsByClassName('partner-rank'))
            rankElement.innerHTML=Language.DUTCH_RANK_NAMES[partnerRank];
    }
    // almost the same as the replaced version except we now want to receive the trick itself
    playACard(){
        // currentPlayer=this;
        forceFocus(this.name);
        /* replacing:
        document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
        document.getElementById("playing").style.visibility="visible"; // show the play element
        */
        let trick=(this.game?this.game._trick:null);
        if(!trick){alert("BUG: No current trick to play a card in!");return;}
        // MDH@19JAN2020: allow the current player to play a card by clicking one
        updatePlayableCardButtonClickHandlers(true);
        // currentPlayer=this; // remember the current player
        if(trick.numberOfCards>0&&trick.playSuite<0){alert("BUG: Play suite of non-empty trick undefined!");return;}
        setInfo("Speel een "+(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+".");
        // if this is a new trick update the tricks played table with the previous trick
        // if(trick.numberOfCards==0)updateTricksPlayedTables();
        /* see showTrick()
        document.getElementById("can-ask-for-partner-card-blind").style.display=(trick.canAskForPartnerCardBlind?"block":"none");
        // always start unchecked...
        document.getElementById("ask-for-partner-card-blind").checked=false; // when clicked should generate 
        */
        // MDH@20JAN2020 moved over to where GAME_INFO event is received!!!!: document.getElementById("game-info").innerHTML=getGameInfo(); // update the game info (player specific)
        // obsolete: document.getElementById("card-player").innerHTML=this.name;
        document.getElementById("play-card-prompt").innerHTML=
            (trick.playSuite>=0?"Speel een "+Language.DUTCH_SUITE_NAMES[trick.playSuite].toLowerCase()+" bij.":"Kom maar uit!");
        let numberOfTricksWon=this.getNumberOfTricksWon(); // also includes those won by the partner (automatically)
        // add the tricks won by the partner
        let partnerName=this._game.getPartnerName(this._index);
        // if(partner)numberOfTricksWon+=player.getNumberOfTricksWon();
        document.getElementById("tricks-won-so-far").innerHTML=String(numberOfTricksWon)+(partnerName?" (samen met "+partnerName+")":"");
        // show the number of tricks this player is supposed to win in total
        document.getElementById("tricks-to-win").innerHTML=getNumberOfTricksToWinText(this._numberOfTricksToWin,partnerName,this._game.getHighestBid());
        this._card=null; // get rid of any currently card
        console.log("ONLINE >>> Player '"+this.name+"' should play a card!");
        // setInfo("Welke "+(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+" wil je "+(trick.numberOfCards>0?"bij":"")+"spelen?");
        updatePlayerSuiteCards(this._suiteCards=this._getSuiteCards()); // remember the suite cards!!!!
        // show the trick (remembered in the process for use in cardPlayed below) from the viewpoint of the current player
        ///// showTrick(this._trick=trick); // MDH@11JAN2020: no need to pass the player index (as it is always the same)
    }

    // not to be confused with _cardPlayed() defined in the base class Player which informs the game
    // NOTE cardPlayed is a good point for checking the validity of the card played
    // NOTE can't use _cardPlayed (see Player superclass)
    // MDH@20JAN2020: deciding to return true on acceptance, false otherwise
    _cardPlayedWithSuiteAndIndex(suite,index){
        let card=(suite<this._suiteCards.length&&this._suiteCards[suite].length?this._suiteCards[suite][index]:null);
        if(card){
            // TODO checking should NOT be done by the player BUT by the trick itself!!!
            // BUG FIX: do NOT do the following here, but only at the start of a trick, or NOT at all!!!!!
            ////////////this._trick.askingForPartnerCard=0; // -1 when asking blind, 0 not asking, 1 if asking
            // CAN'T call _setCard (in base class Player) if the card cannot be played!!!
            let trick=this.game._trick; // MDH@19JAN2020: easiest way to get the current trick
            if(!trick)return new Error("Geen slag om een kaart in bij te spelen.");
            let askingForPartnerCard=0;
            if(trick.numberOfCards==0){ // first card in the trick played
                // theoretically the card can be played but it might be the card with which the partner card is asked!!
                // is this a game where there's a partner card that hasn't been played yet
                // alternatively put: should there be a partner and there isn't one yet?????
                // BUG FIX: still using getTrumpPlayer() here although it wasn't defined at all here!!!!
                //          now copied over from RikkenTheGame.js!!! (as it is computed)
                if(this._game.getTrumpPlayer()==this._index){ // this is trump player playing the first card
                    console.log("******************************************************");
                    console.log(">>>> CHECKING WHETHER ASKING FOR THE PARTNER CARD <<<<");
                    // can the trump player ask for the partner card blind
                    // which means that the trump player does not have 
                    if(trick.canAskForPartnerCard>0){ // non-blind
                        // TODO should be detected by the game preferably
                        if(suite==this._game.getPartnerSuite()){
                            askingForPartnerCard=1;
                            ////alert("\tNON_BLIND");
                        }
                    }else
                    if(trick.canAskForPartnerCard<0){ // could be blind
                        // if the checkbox is still set i.e. the user didn't uncheck it
                        // he will be asking for the 
                        // MDH@14JAN2020 BUG FIX: was using ask-partner-card-blind instead of ask-partner-card-checkbox!!!
                        if(document.getElementById("ask-partner-card-checkbox").checked&&
                            (suite!=this._game.getTrumpSuite()||confirm("Wilt U de "+Language.DUTCH_SUITE_NAMES[this._game.getPartnerSuite()]+" "+Language.DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" (blind) vragen met een troef?"))){
                            askingForPartnerCard=-1; // yes, asking blind!!
                            /////alert("\tBLIND!");
                        }
                    }else
                        /*alert("Not indicated!!!!")*/;
                }else{
                    // check whether or not the first player can play spades
                    if(!trick._firstPlayerCanPlaySpades&&suite===Card.SUITE_SPADE){ // spade is being played by the first player whereas that is not allowed
                        if(this.getNumberOfCardsWithSuite(Card.SUITE_SPADE)<this.numberOfCards)
                            return new Error("Je kunt niet met schoppen uitkomen, want de schoppen vrouw is nog niet opgehaald.");
                    }
                }
            }else{ // not the first card in the trick played
                // the card needs to be the same suite as the play suite (if the player has any)
                if(suite!==trick.playSuite&&this.getNumberOfCardsWithSuite(trick.playSuite)>0)
                    return new Error("Je kunt "+card.getTextRepresentation()+" niet spelen, want "+Language.DUTCH_SUITE_NAMES[trick.playSuite]+" is gevraagd.");
                // when being asked for the partner card that would be the card to play!
                if(trick.askingForPartnerCard!=0){
                    let partnerSuite=this._game.getPartnerSuite(),partnerRank=this._game.getPartnerRank();
                    if(this.containsCard(partnerSuite,partnerRank)){
                        if(card.suite!=partnerSuite||card.rank!=partnerRank)
                            return new Error("Je kunt "+card.getTextRepresentation()+" niet spelen, want de "+Language.DUTCH_SUITE_NAMES[partnerSuite]+" "+Language.DUTCH_RANK_NAMES[partnerRank]+" is gevraagd.");
                    }
                }
            }
            // MDH@14JAN2020: we have to also return whatever trick value that might've changed
            //                which in this case could wel be the asking for partner card 'flag'
            // MDH@27JAN2020: I suggest changing askingForPartnerCard to askingForPartnerCard<0 i.e. blind request!!!
            //                we're taking care of that when CARD is sent (so not to interfere with RikkenTheGame.js itself)
            let error=this._setCard(card,askingForPartnerCard);
            return error;
            /* MDH@27JAN2020: removing the following might be wrong BUT by passing askingForPartnerCard to the server
                              all players including myself will receive the card played and update askingForPartnerCard
                              accordingly, basically addCard() will set it to 1 if it so detects, but cannot set it to -1
                              so technically askingForPartnerCard only needs to be send when the partner card is asked blind
            if(error)return new Error("Er is een fout opgetreden bij het versturen van de gespeelde kaart.");
            trick.askingForPartnerCard=askingForPartnerCard;
            return null;
            */
        }
        return new Error("Ongeldige kaart kleur "+DUTCH_SUITE_NAMES[suite]+" en/of kaart kleur positie ("+String(index)+").");
    }
    playsTheGameAtIndex(game,index){
        if(this._game){
            if(!game){
                if(this._game.state!==PlayerGame.FINISHED){
                    setInfo("Programmafout: Het spel kan niet worden verlaten, als het niet afgelopen is (toestand: "+this._game.state+").");
                    return;
                }
                if(!this._game.done()){
                    setInfo("Verlaten van het spel mislukt! Probeer het nog eens.");
                    return;
                }
                // if sending the DONE event succeeds ready again to play in a next game (without leaving the game playing)
                setPage("page-wait-for-players");
            }
        }
        super.playsTheGameAtIndex(game,index);
    }
    // call renderCards just after the set of cards change
    renderCards(){
        console.log("************************** Rendering player cards!");
        this._suiteCards=this._getSuiteCards();
        // TODO probably best to show them on ALL pages (no matter which one is currently showing!)
        updateBidderSuiteCards(this._suiteCards);
        updatePlayerSuiteCards(this._suiteCards);
        updateChooseTrumpSuiteCards(this._suiteCards);
        updateChoosePartnerSuiteCards(this._suiteCards);
        /* replacing:
        switch(currentPage){
            case "page-bidding":updateBidderSuiteCards(this._suiteCards);break; // typically only once
            case "page-playing":updatePlayerSuiteCards(this._suiteCards);break; // typically after playing a card!!
            case "page-trump-choosing":updateChooseTrumpSuiteCards(this._suiteCards);break;
            case "page-partner-choosing":updateChoosePartnerSuiteCards(this._suiteCards);break;
        }
        */
    }
    // exit should be called when a player stops playing
    // either by explicitly using the stop button(s) or leaving/closing the page
    // TODO should we null the game????????
    exit(reason){
        if(this._game){
            this._game.exit(reason);
            this._game=null; // TODO or any other way to indicate to indicate that the player stopped playing
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
    let error=currentPlayer._setBid(bid); // the value of the button is the made bid
    if(!error)
        document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element
    else
        alert(error.message);
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

var playablecardCell,playablecardCellContents;
/**
 * clicking a partner suite button registers the chosen partner suite with the current player 
 * @param {*} event 
 */
function playablecardButtonClicked(event){
    playablecardCell=event.currentTarget;
    let cardSuite=parseInt(playablecardCell.getAttribute("data-suite-id"));
    let cardRank=parseInt(playablecardCell.getAttribute("data-suite-index"));
    ////////if(playablecardCell.style.border="0px")return; // empty 'unclickable' cell
    let error=currentPlayer._cardPlayedWithSuiteAndIndex(cardSuite,cardRank);
    if(!error){ // card accepted!!!
        forceFocus(null); // get rid of the focus request
        updatePlayableCardButtonClickHandlers(false); // disable the card buttons
        document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart verzonden naar de spel server"; // MDH@23JAN2020: get rid of the play card prompt!
        playablecardCellContents=playablecardCell.innerHTML; // in case sending the card fails
        playablecardCell.innerHTML="";
    }else // report the error to the end user
        alert(error.message);
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
            // initiate-playing will report on the game that is to be played!!!
            setPage("page-playing");
            break;
        case PlayerGame.FINISHED:
            setInfo("Het spel is afgelopen!");
            clearCardsPlayedTable();
            currentPlayer.game._numberOfTricksPlayed+=1; // QUICK FIX to get to see the last trick at the right position!!!!!
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
                    case "rules":
                        // setInfo("De regels van het online spel.");
                        break;
                    case "settings":
                        // setInfo("Kies de speelwijze.");
                        break;
                    case "setup-game": // when playing in demo mode, the user should enter four player names
                        {
                            showDefaultPlayerNames();
                            setInfo("Vul de namen van de spelers in. Een spelernaam is voldoende.");
                        }
                        break;
                    case "auth": // page-auth
                        // setInfo("Geef de naam op waaronder U wilt spelen!");
                        break;
                    case "wait-for-players": // page-wait-for-players
                        // setInfo("Even geduld aub. We wachten tot er genoeg medespelers zijn!");
                        break;
                    case "bidding": // page-bidding
                        // setInfo("Wacht om de beurt op een verzoek tot het doen van een bod.");
                        break;
                    case "play-reporting":
                        break;
                    case "playing": // ????
                        // we do everything here
                        // assuming starting the game play
                        document.getElementById("trick-id").innerHTML="Slag 1"; // just in case
                        // document.getElementById("trick-winner-info").innerHTML="";
                        // document.getElementById("new-trick-button").style.visible='hidden';
                        clearCardsPlayedTable(); // just in case!!
                        clearTricksPlayedTables();
                        // setInfo("Wacht op het verzoek tot het opgeven van de troefkleur en/of de mee te vragen aas/heer.");
                        // setInfo("Het spelen begint!");
                        break;
                    case "finished":
                        document.getElementById("trick-id").innerHTML="";
                        // setInfo("Het spel is afgelopen.");
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
/* 
function newTrickButtonClicked(){
    document.getElementById("new-trick-button").style.visibility="hidden";
    document.getElementById("trick-winner-info").innerHTML="";
    let rikkenTheGame=(currentPlayer?currentPlayer.game:null);
    (!rikkenTheGame||rikkenTheGame.showNewTrickInfo());
}
*/
// MDH@07JAN2020: additional stuff that we're going to need to make this stuff work
class PlayerGameProxy extends PlayerGame {

    // getSendEvent(event,data){
    //     console.log("Sending event "+event+" with data "+JSON.stringify(data)+".");
    //     return [event,data];
    // }

    // MDH@23JAN2020: called from updateBidsTable
    getPlayerIndex(playerName){
        let playerIndex=(this._playerNames?this._playerNames.length:0);
        while(--playerIndex>=0&&this._playerNames[playerIndex]!==playerName);
        if(playerIndex<0){console.log("Player name '"+playerName+"' not found in "+JSON.stringify(this._playerNames)+".");}
        return playerIndex;
    }

    get numberOfPlayers(){return this._playerNames.length;}

    // MDH@26JAN2020: needed this as well to determine the trump player (using bidders stead of bidPlayers here)
    getTrumpPlayer(){
        // only when playing a 'rik' game (with trump, played with a partner, but not troela, we have a trump player)
        if(this._highestBid!==PlayerGame.BID_RIK&&this._highestBid!==PlayerGame.BID_RIK_BETER)return -1;
        if(!this._highestBidders||this._highestBidders.length==0)return -1;
        return this._highestBidders[0];
    }

    // MDH@25JAN2020: game cannot continue until succeeding in getting the action over to the game server
    //                to guarantee delivery we run a resend timer that will continue sending until the callback gets called
    // _eventSent will get called when the event was received by the game server
    _sentEventReceived(){
        if(this._eventToSendIntervalId){clearInterval(this._eventToSendIntervalId);this._eventToSendIntervalId=null;}
        forceFocus(null);
        console.log("Event "+this._eventToSend[0]+" received by game server.");
        this._eventToSend=null;
        this._eventSentCallback();
    }
    _sendEvent(){
        try{
            this._socket.emit(this._eventToSend[0],this._eventToSend[1],this._sentEventReceived);
            this._eventToSend[2]++;
            console.log("Event "+this._eventToSend[0]+" with data "+JSON.stringify(data)+" sent (attempt: "+this._eventToSend[2]+").");
            return true;
        }catch(error){
            console.log("ERROR: Failed to send event "+this._eventToSend[0]+" to the game server (reason: "+error.message+").");
        }
        return false;
    }
    _setEventToSend(event,data,callback){
        this._eventSentCallback=callback;
        this._eventToSend=[event,data,0]; // keep track of the send event count
        if(!this._sendEvent())return false; // user must make their choice again
        // schedule next resends
        this._eventToSendIntervalId=setInterval(this._sendEvent,5000);
        return true;
    }

    // what the player will be calling when (s)he made a bid, played a card, choose trump or partner suite
    bidMade(bid){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        // document.getElementById("bidding").style.visibility="hidden";
        return this._setEventToSend('BID',bid,function(result){
            if(result){
                setInfo("Bod niet geaccepteerd"+
                            (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                // TODO what now???
            }
        }); // hide the bidding element again
    }
    // MDH@13JAN2020: we're sending the exact card over that was played (and accepted at this end as it should I guess)
    // MDH@14JAN2020: passing in the askingForPartnerCard 'flag' as well!!!!
    //                because we're overriding the base RikkenTheGame implementation
    //                askingForPartnerCard doesn't end up in the local RikkenTheGame trick
    // MDH@27JAN2020: we're receiving true for askingForPartnerCardBlind when the player is doing so
    cardPlayed(card,askingForPartnerCard){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        // MDH@17JAN2020: disable the buttons once the card is accepted (to be played!!!)
        //                TODO perhaps hiding the cards should also be done here!!!
        /* replacing:
        document.getElementById("wait-for-play").style.visibility="visible"; // hide the bidding element again
        document.getElementById("playing").style.visibility="hidden"; // hide the bidding element again
        */
        console.log("Sending card played: "+card.toString()+" to the server.");
        // updatePlayableCardButtonClickHandlers(false);
        // MDH@27JAN2020: we send the askingForPartnerCard flag along every time although it will be ignored
        //                on any trick card except the first card played, and non-negative values are ignored as well
        //                because the only thing that the other side cannot determine is whether the partner card is asked blind!!!!
        let cardPlayedInfo=[card.suite,card.rank,askingForPartnerCard];
        // replacing: if(askingForPartnerCard<0)cardPlayedInfo.push(true); // set the asking for partner card blind flag!!!
        return this._setEventToSend('CARD',cardPlayedInfo,function(result){
                if(result){
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart niet geaccepteerd"+
                                (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!";
                    playablacardCell.innerHTML=playablecardCellContents;
                    // TODO what to do now?
                }else{ // card played accepted!!!
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart geaccepteerd.";
                }
            });
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        document.getElementById("trump-suite-input").style.visibility="hidden";
        return this._setEventToSend('TRUMPSUITE',trumpSuite,function(result){
                if(result){
                    setInfo("Gekozen troefkleur niet geaccepteerd"+
                    (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                    // TODO what to do now?
                }
            });
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        document.getElementById("partner-suite-input").style.visibility="hidden";
        return this._setEventToSend('PARTNERSUITE',partnerSuite,function(result){
                if(result){
                    setInfo("Gekozen partner kleur niet geaccepteerd!"+
                    (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                    // TODO what to do now?
                }
            });
         // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
    }
    // MDH@26JAN2020: when the user finished reading the results, and wants to continue playing done() should be called
    done(){
        return this._setEventToSend('DONE',function(){
            console.log("DONE event acknowledged.");
        });
    }
    exit(reason){
        // player is exiting somehow...
        let data=(reason?reason:(currentPlayer?currentPlayer.name:""));
        return this._setEventToSend('EXIT',data,function(){
            console.log("EXIT event "+data+" acknowledged!");
            // we're NOT going anywhere anymore: setPage("page-rules");
        });
    }

    set state(newstate){
        let oldstate=this._state;
        this._state=newstate;
        // do stuff (change to another page)
        _gameStateChanged(oldstate,this._state);
    }

    logEvent(event,data){
        this._eventsReceived.push({event:event,data:data});
        console.log("GAMEPLAYING >>> Received event "+event+" with data "+JSON.stringify(data));
    }

    get name(){return this._name;}
    set name(name){this._name=name;}

    // TODO have to change this to include the friendly flag as well!!!!
    getPlayerName(playerIndex){
        return(this._playerNames&&playerIndex>=0&&playerIndex<this._playerNames.length?this._playerNames[playerIndex]:null);
    }
    
    getPlayerNames(){return this._playerNames;} // overriding getPlayerNames() of the demo version!!
    
    set playerNames(playerNames){

        this._playerNames=playerNames;

        this._playerIndex=(!this._playerNames||this._playerNames.length<4?-1:this._playerNames.indexOf(currentPlayer.name));
        currentPlayer.index=this._playerIndex;
        if(this._playerIndex>=0){
            updateGamePlayerNames();
            showPlayerNames();
            // we only need to show the current player name on page-playing ONCE as it will always stay the same
            showCurrentPlayerName();
            // replacing: showPlayerName(document.getElementById("player-name"),this.getPlayerName(this._playerIndex),-2);
        }else{
            console.log("ERROR: Current player '"+currentPlayer.name+"' not found.");
            if(this._playerNames)
                alert("Ernstige programmafout: Uw naam komt niet voor in de spelerlijst van het te spelen spel!");
        }
    }

    getNumberOfTricksWonByPlayer(playerIndex){
        return(playerIndex>=0&&playerIndex<this._numberOfTricksWon.length?this._numberOfTricksWon[playerIndex]:0);
    }

    // MDH@20JAN2020: will be receiving the new trick event when a new trick starts
    // MDH@22JAN2020: user will have to click the new trick button so they can look at the old trick first
    newTrick(trickInfo){
        
        // ASSERT only call when trickInfo is not NULL!!!!!
        if(!trickInfo){alert("BUG: No trick info!");return;}

        clearCardsPlayedTable(); // remove the cards showing from the previous trick

        // show the id of the trick (which is the trick index)
        document.getElementById("trick-id").innerHTML="Slag "+trickInfo.index;

        this._numberOfTricksPlayed=trickInfo.index-1;

        if(this._trick)updateTricksPlayedTables(); // show the finished trick in the tricks played table

        // create a new trick with the information in the trick info
        this._trick=new Trick(trickInfo.firstPlayer,this._trumpSuite,this._partnerSuite,this._partnerRank,trickInfo.canAskForPartnerCard,trickInfo.firstPlayerCanPlaySpades);
    
        /* stupid me: I already moved doing this to showTrick() but there earlier incorrect (i.e. NOT checking the first player!!!)
        // MDH@27JAN2020: hiding or showing the asking for partner card checkbox can be determined here and now
        //                because the necessary information for deciding is completely known at the start of a new trick
        if(trickInfo.firstPlayer===currentPlayer.index&&trickInfo.canAskForPartnerCard!=0){
            document.getElementById("ask-partner-card").style.display="block";
            // the next decision is a little harder, because should we always turn on the checkbox????????
            // BUT note that the user will be prompted to acknowledge asking the partner card blind
            document.getElementById("ask-partner-card-checkbox").selected=;
        }else
            document.getElementById("ask-partner-card").style.display="none";
        */

        // we do the following because it is essential that the checkbox that tells the player whether or not
        // the partner card can be asked should be in the right state to start with (for the right player)
        // NOTE newTrick() is being called BEFORE a player is asked to play a card, so that's the right moment!!!!
        showTrick(this._trick); // TODO should this be here?????

    }

    // MDH@20JAN2020: if we receive all partners we can extract the partner of the current player
    _setPartnerIds(partnerIds){
        this._partnerIds=partnerIds;
        // update the partner of the current player
        currentPlayer.partner=(this._partnerIds&&this._playerIndex>=0&&this._playerIndex<this._partnerIds.length?this._partnerIds[this._playerIndex]:null);
    }
    newCard(cardInfo){
        // MDH@27JAN2020: cardInfo does not need to contain the askingForPartnerCard flag per se
        //                it actually only need to contain it when asking for the partner card blind as in all
        //                other cases the trick can determine it itself and should NOT rely on information sent by the server
        //                it would be better to change it to askingForPartnerCardBlind on the other server end!!
        //                this is solved by sending playSuite along with cardInfo when so needed!!!
        /* replacing:
        if(cardInfo.hasOwnProperty("askingForPartnerCard"))
            this._trick.askingForPartnerCard=cardInfo.askingForPartnerCard; // MDH@26JAN2020: shouldn't forget this!!!!
        */
        // I don't think we can do that????? this._trick.winner=cardInfo.winner;
        let error=this._trick.addCard(new HoldableCard(cardInfo.suite,cardInfo.rank));
        if(error)return error;

        // MDH@27JAN2020: if we're receiving the play suite we can determine askingForPartnerCard ourselves
        if(cardInfo.hasOwnProperty("playSuite")){
            // if the play suite provided differs from the 'automatic' play suite, the partner card is being asked blindly
            if(cardInfo.playSuite!==this._trick.playSuite){
                this._trick.playSuite=cardInfo.playSuite;
                this._trick.askingForPartnerCard=-1;
            }
        }

        // MDH@20JAN2020: every card played contains the partners as well!!!
        if(cardInfo.hasOwnProperty("partners"))this._setPartnerIds(cardInfo.partners);

        // if all the cards in the trick have been played, the winner is definite, and wins the trick
        if(this._trick.numberOfCards===4)this._numberOfTricksWon[this._trick.winner]++;
        // do nothing...
        // showTrickCard(this._trick.getLastCard(),this._trick.numberOfCards);
        showTrick(this._trick);//if(this._trickWinner){this._trickWinner=null;showTrick(this._trick);}
        return null;
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

    // duplicated from server-side RikkenTheGame.js that will translate this._playersBids to readable bids
    // to be passed to updateBidsTable()!!!
    _getPlayerBidsObjects(){
        let playerBidsObjects=[];
        this._playersBids.forEach((playerBids)=>{
            let playerBidsObject={name:this.getPlayerName(playerBidsObjects.length),bids:[]};
            // use unshift NOT push as the bids are stored reverse order 
            playerBids.forEach((playerBid)=>{playerBidsObject.bids.unshift(PlayerGame.BID_NAMES[playerBid])});
            playerBidsObjects.push(playerBidsObject);
        });
        return playerBidsObjects;
    }

    // generic method for processing any event, every
    processEvent(event,eventData,acknowledge){
        // log every event
        this.logEvent(event,eventData);
        if(!event)return; // NOTE the eventData can be null!!!!!!
        // if data has an id it needs to be acknowledged
        let eventId=(eventData&&eventData.hasOwnProperty("id")?eventData.id:null);
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
                // if(data.hasOwnProperty('players'))this.playerNames=data.players;
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
                    // MDH@20JAN2020: move showing the game info from playACard() to here!!!!
                    document.getElementById("game-info").innerHTML=getGameInfo();
                    if(this._partnerRank>=0){ // a partner (card)
                        for(let partnerSuiteElement of document.getElementsByClassName('partner-suite'))
                            partnerSuiteElement.innerHTML=Language.DUTCH_SUITE_NAMES[this._partnerSuite];
                        for(let partnerRankElement of document.getElementsByClassName('partner-rank'))
                            partnerRankElement.innerHTML=Language.DUTCH_RANK_NAMES[this._partnerRank];
                        for(let partnerElement of document.getElementsByClassName('partner'))
                            partnerElement.style.visibility="inherit";
                    }else{ // no partner (card)
                        for(let partnerElement of document.getElementsByClassName('partner'))
                            partnerElement.style.visibility="hidden";
                    }
                }
                break;
            case "TO_BID":
                if(data!==currentPlayer.name)
                    setInfo("We wachten op het bod van "+data+".");
                else
                    setInfo("U wordt zo om een bod gevraagd.");
                // if(data!==currentPlayer.name)
                //     document.getElementById("bid-info").innerHTML="We wachten op het bod van <b>"+data+"</b>.";
                // else
                //     document.getElementById("bid-info").innerHTML="Wat wil je spelen?";
                break;
            case "MAKE_A_BID":
                currentPlayer.makeABid(data.playerBidsObjects,data.possibleBids);
                break;
            case "BID_MADE": // returned when a bid is made by someone
                // assuming to receive in data both the player and the bid
                document.getElementById("bid-info").innerHTML=getBidInfo(data.bid,data.player===currentPlayer.index?null:this.getPlayerName(data.player));
                this._playersBids[data.player].push(data.bid);
                // TODO how to show the bids?????
                updateBidsTable(this._getPlayerBidsObjects());
                break;
            case "TO_PLAY":
                if(currentPlayer.name!==data)
                    setInfo("We wachten op de kaart van "+data+".");
                else
                    setInfo("U wordt zo om een kaart gevraagd!");
                /*
                if(currentPlayer.name!==data)
                    document.getElementById("play-info").innerHTML="We wachten op de kaart van <b>"+data+"</b>.";
                else
                    document.getElementById("play-info").innerHTML="Speel een kaart bij.";
                */
                break;
            case "PLAYER_INFO":
                {
                    // will contain the current cards the user has
                    currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
                    data.cards.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
                    currentPlayer.renderCards();
                    /* MDH@23JAN2020: game keeps track of the number of tricks won by each player!!!!!
                    // also the number of tricks won and to win
                    currentPlayer.numberOfTricksWon=data.numberOfTricksWon;
                    // TODO PLAYER_INFO does not need to send the following with each PLAYER_INFO THOUGH
                    currentPlayer.setNumberOfTricksToWin(data.numberOfTricksToWin);
                    */
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
                if(!this._trick){
                    alert("Programmafout: U wordt om een kaart gevraagd in een ongedefinieerde slag! We wachten even op slaginformatie.");
                    return; // MDH@27JAN2020: doing this and hoping the next request is received AFTER receiving a new trick!!!
                }
                // MDH@22JAN2020: occassionally we may receive the request to play BEFORE actually having received the state change!!
                if(currentPage!=="page-playing")setPage("page-playing");
                currentPlayer.playACard();
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
            case "TRICKS": // MDH@23JAN2020: won't be receiving this event anymore...
                {
                    // extract the tricks from the array of tricks in data
                    this._tricks=data.map((trickInfo)=>{return this.parseTrick(trickInfo);});
                    updateTricksPlayedTables();
                }
                break;
            case "RESULTS":
                {
                    // we won't be receiving a new trick event, but we still want to show the user that we're done
                    // TODO check if the page moved to the results page??????
                    /* removed, as these things are done when the game over message is received...
                    clearCardsPlayedTable();
                    if(this._trick)updateTricksPlayedTables();
                    */
                    this._deltaPoints=data.deltapoints;
                    this._points=data.points;
                    updatePlayerResultsTable();
                }
                break;
            case "GAMEOVER":
                // kill the game instance (returning to the rules page until assigned to a game again)
                // wait for the new-game or stop button click!!!!! if(currentPlayer)currentPlayer.playsTheGameAtIndex(null,-1);
                // this.exit("in response to '"+data+"'");
                break;
            case "disconnect":
                // MDH@22JAN2020: better not to go out of order when this happens!!!!!!
                setInfo("Verbinding met de server (tijdelijk) verbroken!"); // replacing: this.state=PlayerGame.OUT_OF_ORDER;
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
        this._socket.on('BID_MADE',(data)=>{this.processEvent('BID_MADE',data,true);});
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
        this._sentEventReceived=this._sentEventReceived.bind(this);this._sendEvent=this._sendEvent.bind(this);
        this._eventsReceived=[];
        this._trickWinner=null;
        this._state=PlayerGame.OUT_OF_ORDER;
        this._socket=socket;
        this._dealer=-1;
        this._trumpSuite=-1;//this._trumpPlayer=-1;
        this._partnerSuite=-1;this._partnerRank=-1;
        this._numberOfTricksWon=[0,0,0,0]; // assume no tricks won by anybody
        this._numberOfTricksPlayed=0;this._trick=null;
        this._highestBid=-1;this._highestBidders=[];this.trumpPlayer=-1; // no highest bidders yet
        this._playersBids=[[],[],[],[]]; // MDH@21JAN2020: keep track of all the bids to show
        this._deltaPoints=null;
        this._points=null;
        // this._lastTrickPlayed=null;
        // this._teamNames=null;
        this._playerIndex=-1; // the 'current' player
        // things we can store internally that we receive over the connection
        this._name=null; // the name of the game
        this._playerNames=null; // the names of the players
        this._partnerIds=null; // the partner
        this.prepareForCommunication();
    }

    // information about the game itself organized by state
    // PLAYING
    getTrumpSuite(){return this._trumpSuite;}
    getPartnerSuite(){return this._partnerSuite;}
    getPartnerRank(){return this._partnerRank;}
    // getTrumpPlayer(){return this._trumpPlayer;}
    
    getPartnerName(player){ // only when player equals this._playerIndex do we know the partner
        let partner=(player===this._playerIndex?currentPlayer.partner:-1);
        return(partner>=0&&partner<this.numberOfPlayers?this._playerNames[partner]:null);
    }

    getHighestBidders(){return this._highestBidders;}
    getHighestBid(){return this._highestBid;}
    // MDH@03JAN2020: I needed to add the following methods
    // getPlayerName(player){return(this._playerNames&&player<this._playerNames.length?this._playerNames[player]:"?");}
    get deltaPoints(){return this._deltaPoints;}
    get points(){return this._points;}
    isPlayerPartner(playerIndex,otherPlayerIndex){return(this._partnerIds?this._partnerIds[playerIndex]===otherPlayerIndex:false);}
    // getLastTrickPlayed(){return this._lastTrickPlayed;} // TODO still used?????
    get numberOfTricksPlayed(){return this._numberOfTricksPlayed;}
    // getTrickAtIndex(trickIndex){} // get the last trick played
    get fourthAcePlayer(){return this._fourthAcePlayer;}
    getTeamName(playerIndex){
        // computing the team name on the fly
        let teamName=this.getPlayerName(playerIndex);
        let partnerIndex=(this._partnerIds?this._partnerIds[playerIndex]:-1); // NOTE could be null!!!
        if(partnerIndex&&partnerIndex>=0)teamName+=" & "+this.getPlayerName(partnerIndex);
        return teamName;
    }

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
        if(currentPlayer)currentPlayer.exit('EXIT'); // if we haven't done so yet!!!!
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
    for(let stopButton of document.getElementsByClassName('stop'))stopButton.onclick=stopPlaying;
    
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
    
    /* MDH@22JAN2020: event handler for clicking the new trick button
    document.getElementById("new-trick-button").onclick=newTrickButtonClicked;
    document.getElementById("new-trick-button").style.visible='hidden';
    document.getElementById("trick-winner-info").style.visible='hidden';
    */

    // MDH@09JAN2020: check for a user name
    var urlParams = new URLSearchParams(window.location.search);
    // MDH@24JAN2020: changed 'player' to 'als'!!! NOTE this is a back-door
    let initialPlayerName=(urlParams.has("als")?urlParams.get("als").trim():null);
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
                console.log((currentPlayer?"Reconnected":"Connected")+" to the game server!");
                if(!currentPlayer){ // first time connect
                    currentPlayer=player;
                    showCurrentPlayerName();
                    // unfortunately we can only set the game of the player if _index is non-negative, so we pass in 4
                    currentPlayer.index=4;
                    currentPlayer.game=new PlayerGameProxy(clientsocket);
                    if(typeof errorcallback!=='function'){errorcallback(null);setPage("page-wait-for-players");}    
                }else
                    setInfo("De verbinding met de spel server is hersteld.");
                // MDH@23JAN2020: push the player name to the server again, so it can resend what needs sending!!!!
                if(currentPlayer)clientsocket.emit('PLAYER',currentPlayer.name,()=>{
                    setInfo("Aangemeld bij de spel server!");
                });
            }else{
                setInfo("De verbinding met de spel server is verbroken.");
                (typeof errorcallback!=='function'||errorcallback(new Error("Failed to connect to the server.")));
            }
        });
        clientsocket.on('connect_error',(err)=>{
            console.log("Connect error: ",err);
            setInfo("Er is een probleem met de verbinding met de spel server ("+err.message+")!");
            (typeof errorcallback!=='function'||errorcallback(err));
        });
        // try to connect to the server catching whatever happens through events
        clientsocket.connect();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGRlZmluaXRpb24gb2YgYSBwbGF5aW5nIENhcmRcbiAqL1xuY2xhc3MgQ2FyZHtcblxuICAgIHN0YXRpYyBnZXQgU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wiZGlhbW9uZFwiLFwiY2x1YlwiLFwiaGVhcnRcIixcInNwYWRlXCJdO31cbiAgICBzdGF0aWMgZ2V0IFJBTktfTkFNRVMoKXtyZXR1cm4gW1wiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcImphY2tcIixcInF1ZWVuXCIsXCJraW5nXCIsXCJhY2VcIl07fVxuICAgIC8vIHNob3J0aGFuZCAnY2hhcmFjdGVycycgZm9yIHRleHR1YWwgcmVwcmVzZW50YXRpb25cbiAgICAvLyBOT1QgV09SS0lORzogY29uc3QgQ0FSRF9TVUlURV9DSEFSQUNURVJTPVtTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjYpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MyksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY1KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjApXTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWydcXHUyNjY2JywnXFx1MjY2MycsJ1xcdTI2NjUnLCdcXHUyNjYwJ119OyAvLyBZRVMsIFdPUktJTkchISEhIVxuICAgIHN0YXRpYyBnZXQgU1VJVEVfRElBTU9ORCgpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBTVUlURV9DTFVCKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0hFQVJUKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX1NQQURFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQ0hBUkFDVEVSUygpe3JldHVybiBbJzInLCczJywnNCcsJzUnLCc2JywnNycsJzgnLCc5JywnMTAnLCdCJywnVicsJ0snLCdBJ107fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVFdPKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEhSRUUoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GT1VSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRklWRSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX1NJWCgpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBSQU5LX1NFVkVOKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRUlHSFQoKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19OSU5FKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfSkFDSygpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBSQU5LX1FVRUVOKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBSQU5LX0tJTkcoKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQUNFKCl7cmV0dXJuIDEyO307XG5cbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzKGNhcmQxLGNhcmQyKXtcbiAgICAgICAgbGV0IGRlbHRhU3VpdGU9Y2FyZDEuX2NhcmRTdWl0ZUluZGV4LWNhcmQyLl9jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgaWYoZGVsdGFTdWl0ZSE9MClyZXR1cm4gZGVsdGFTdWl0ZTtcbiAgICAgICAgcmV0dXJuIGNhcmQxLl9jYXJkTmFtZUluZGV4LWNhcmQyLl9jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICBcbiAgICAvLyBpbiBhIHRyaWNrIHRoZSBwbGF5IHN1aXRlIGRldGVybWluZXMgd2hhdCBjYXJkcyBhcmUgdG8gYmUgcGxheWVkLCB0aGUgdHJ1bXAgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IHRydW1wIGlzXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkMSxjYXJkMixwbGF5U3VpdGUsdHJ1bXBTdWl0ZSl7XG4gICAgICAgIC8vIG5vcm1hbGx5IHdpdGggYW55IHR3byByZWd1bGFyIGNhcmRzIHRoZXkgYXJlIG5ldmVyIGVxdWFsIGluIGEgdHJpY2tcbiAgICAgICAgLy8gY2FyZHMgdGhhdCBhcmUgbmVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlIGlzIGlycmVsZXZhbnRcbiAgICAgICAgbGV0IHJlc3VsdD0wO1xuICAgICAgICBsZXQgdHlwZT0nLSc7XG4gICAgICAgIC8vIDEuIGlmIGNhcmQxIGlzIHRydW1wLCBhbmQgY2FyZDIgaXMgbm90IG9yIGhhcyBhIGxvd2VyIHJhbmsgY2FyZDEgd2luc1xuICAgICAgICBpZihjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9dHJ1bXBTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQSc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIE5PVCB0cnVtcCBidXQgY2FyZDIgY291bGQgc3RpbGwgYmUgdHJ1bXBcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdCJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHRydW1wLCBzbyBjb3VsZCBiZSBwbGF5IHN1aXRlIG9yIG5vdC4uLlxuICAgICAgICBpZihjYXJkMS5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0MnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBub3QgcGxheSBzdWl0ZSwgYnV0IGNhcmQyIGNvdWxkIGJlXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdEJzt9XG4gICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gVHlwZTogJyt0eXBlKyc6ICcrY2FyZDEuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIoc3VpdGU6IFwiK2NhcmQxLnN1aXRlK1wiKVwiKyhyZXN1bHQ+MD8nID4gJzoocmVzdWx0PDA/JyA8ICc6JyA9ICcpKStjYXJkMi5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAoc3VpdGU6IFwiK2NhcmQyLnN1aXRlK1wiKVwiK1wiIChwbGF5OiBcIisocGxheVN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbcGxheVN1aXRlXTpcIj9cIikrXCIsIHRydW1wOlwiKygodHJ1bXBTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3RydW1wU3VpdGVdOlwiP1wiKSkrXCIpXCIpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIC8vIGxldCdzIGZpcnN0IHJlY29tcHV0ZSB0aGUgc3VpdGUgb2YgYm90aCBjYXJkcyBhbmQgZWxldmF0ZSB0cnVtcCBjYXJkcywgYW5kIGRlZXZhbHVhdGUgbm9uIHBsYXlTdWl0ZSBjYXJkc1xuICAgICAgICBsZXQgY2FyZDFTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDEuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMS5zdWl0ZSkpO1xuICAgICAgICBsZXQgY2FyZDJTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMi5zdWl0ZSkpO1xuICAgICAgICBpZihjYXJkMVN1aXRlPj0wfHxjYXJkMlN1aXRlPj0wKXsgLy8gYXQgbGVhc3Qgb25lIG9mIHRoZSBjYXJkcyBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VpdGVzIGFyZSB0aGUgc2FtZSB0aGUgaGlnaGVzdCByYW5rIHdpbnNcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU8MClyZXR1cm4gLTE7IC8vIGlmIHRoZSBmaXJzdCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGxvd2VyXG4gICAgICAgICAgICBpZihjYXJkMlN1aXRlPDApcmV0dXJuIDE7IC8vIGlmIHRoZSBzZWNvbmQgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBoaWdoZXJcbiAgICAgICAgICAgIC8vIEFTU0VSVCBib3RoIGNhcmRzIGFyZSBlaXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZT09Y2FyZDJTdWl0ZSlyZXR1cm4gY2FyZDEucmFuay1jYXJkMi5yYW5rO1xuICAgICAgICAgICAgLy8gQVNTRVJUIG9uZSBjYXJkIGlzIHBsYXkgc3VpdGUsIHRoZSBvdGhlciBtdXN0IGJlIHRydW1wIHN1aXRlXG4gICAgICAgICAgICByZXR1cm4oY2FyZDFTdWl0ZT09ND8xOi0xKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUsIGJvdGggY2FyZHMgYXJlIGlycmVsZXZhbnQgKHNob3VsZCBoYXBwZW4gdGhvdWdoKVxuICAgICAgICByZXR1cm4gMDsgLy8gY29uc2lkZXJlZCBlcXVhbCB0aGF0IGlzIGlycmVsZXZhbnRcbiAgICB9XG4gICAgXG4gICAgLy8gLy8geW91J2QgaGF2ZSB0byB1c2UgdGhlIEFwcGxlIFN5bWJvbHMgZm9udFxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmlPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CsTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4K+PC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgr08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CuzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4K6PC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgrk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CuDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4K3PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgrY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CtTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4K0PC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgrM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CsjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaM8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4ORPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg548L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DnTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4ObPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg5o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DmTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OYPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg5c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DljwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OVPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg5Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DkzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OSPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpjwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg4E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DjjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4ONPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg4s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DijwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OJPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg4g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DhzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OGPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg4U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DhDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4ODPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg4I8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CoTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4KuPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgq08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CqzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4KqPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgqk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CqDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4KnPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgqY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CpTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4KkPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgqM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CojwvbGk+XG4gICAgc3RhdGljIGdldCBDQVJEX0FQUExFX1NZTUJPTFMoKXtyZXR1cm4gW1xuICAgICAgICBbJ/Cfg4InLCfwn4ODJywn8J+DhCcsJ/Cfg4UnLCfwn4OGJywn8J+DhycsJ/Cfg4gnLCfwn4OJJywn8J+DiicsJ/Cfg4snLCfwn4ONJywn8J+DjicsJ/Cfg4EnXSxcbiAgICAgICAgWyfwn4OSJywn8J+DkycsJ/Cfg5QnLCfwn4OVJywn8J+DlicsJ/Cfg5cnLCfwn4OYJywn8J+DmScsJ/Cfg5onLCfwn4ObJywn8J+DnScsJ/Cfg54nLCfwn4ORJ10sXG4gICAgICAgIFsn8J+CsicsJ/CfgrMnLCfwn4K0Jywn8J+CtScsJ/CfgrYnLCfwn4K3Jywn8J+CuCcsJ/CfgrknLCfwn4K6Jywn8J+CuycsJ/Cfgr0nLCfwn4K+Jywn8J+CsSddLFxuICAgICAgICBbJ/CfgqInLCfwn4KjJywn8J+CpCcsJ/CfgqUnLCfwn4KmJywn8J+CpycsJ/CfgqgnLCfwn4KpJywn8J+CqicsJ/CfgqsnLCfwn4KtJywn8J+CricsJ/CfgqEnXVxuICAgIF19O1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCl7XG4gICAgICAgIHRoaXMuX2NhcmRTdWl0ZUluZGV4PWNhcmRTdWl0ZUluZGV4O1xuICAgICAgICB0aGlzLl9jYXJkTmFtZUluZGV4PWNhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBDYXJkLlJBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rXCIgb2YgXCIrQ2FyZC5TVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCJzXCI7XG4gICAgfVxuICAgIFxuICAgIGdldCByYW5rKCl7cmV0dXJuIHRoaXMuX2NhcmROYW1lSW5kZXg7fVxuICAgIGdldCBzdWl0ZSgpe3JldHVybiB0aGlzLl9jYXJkU3VpdGVJbmRleDt9XG5cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oKXtcbiAgICAgICAgLy8gaWYgd2UncmUgdXNpbmcgdGhlIHN2Zy1jYXJkcy5zdmcgd2UgY2FuIGRvIHRoZSBmb2xsb3dpbmcsIGJ1dCBpbiB0aGF0IGNhc2Ugd2UnZCBuZWVkIHRvIGtub3cgdGhlIG1hZ25pZmljYXRpb24gZmFjdG9yISEhXG4gICAgICAgIC8vcmV0dXJuIENBUkRfRk9OVF9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy9yZXR1cm4gJzxzdmcgdmlld0JveD1cIjAgMCA2NzYgOTc2XCI+PHVzZSB4bGluazpocmVmPVwiaW1nL3N2Zy1jYXJkcy5zdmcjJytTVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCItXCIrUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XSsnPC91c2U+PC9zdmc+JztcbiAgICAgICAgcmV0dXJuIENhcmQuQ0FSRF9BUFBMRV9TWU1CT0xTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy8vLy8vcmV0dXJuIFNVSVRFX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdLmNvbmNhdChSQU5LX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZE5hbWVJbmRleF0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cz1DYXJkOyIsIi8qKlxuICogZGVmaW5lcyBzb21lb25lIHRoYXQgaG9sZHMgY2FyZHNcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcblxuY2xhc3MgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTURIQDA0REVDMjAxOTogYWxsb3dpbmcgbm93IHRvIGNvbnN0cnVjdCBmaXhlZCBzaXplIGNhcmQgaG9sZGVycyAobGlrZSBUcmljaylcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhcmRzPTApe1xuICAgICAgICB0aGlzLl9jYXJkcz1bXTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZDYXJkcz1udW1iZXJPZkNhcmRzO1xuICAgICAgICB3aGlsZSgtLW51bWJlck9mQ2FyZHM+PTApdGhpcy5fY2FyZHMucHVzaChudWxsKTtcbiAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlO1xuICAgIH1cblxuICAgIC8vIG1ldGhvZHMgdG8gYWRqdXN0IHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBfcmVtb3ZlQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5pbmRleE9mKGNhcmQpO1xuICAgICAgICBpZihjYXJkSW5kZXg+PTApe1xuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHMuc3BsaWNlKGNhcmRJbmRleCwxKS5sZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIitjYXJkK1wiIHJlbW92ZWQgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiLlwiKTtcbiAgICAgICAgICAgICAgICBjYXJkLl9ob2xkZXI9bnVsbDsgLy8gd2hlbiBzdWNjZXNzZnVsIGFwcGFyZW50bHkgbm8gbG9uZ2VyIGF2YWlsYWJsZSEhIVxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiIG9mIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCI6IGl0IGlzIG5vdCBwcmVzZW50LlwiKTtcbiAgICB9XG4gICAgX2FkZENhcmQoY2FyZCl7XG4gICAgICAgIGlmKCFjYXJkKXJldHVybjtcbiAgICAgICAgaWYoIShjYXJkIGluc3RhbmNlb2YgSG9sZGFibGVDYXJkKSl0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBob2xkYWJsZSBjYXJkIVwiKTtcbiAgICAgICAgdGhpcy5sb2coXCJBZGRpbmcgY2FyZCBcIitjYXJkLnRvU3RyaW5nKCkrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICB0aGlzLl9jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+bnVtYmVyT2ZDYXJkc05vdyl7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7IC8vIGNhbiBubyBsb25nZXIgZ3VhcmFudGVlIHRoYXQgaXQgaXMgc29ydGVkLi4uXG4gICAgICAgICAgICBjYXJkLl9ob2xkZXI9dGhpcztcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgKFwiK2NhcmQudG9TdHJpbmcoKStcIikgYWRkZWQgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgICAgIC8vIGhvdyBhYm91dCBvcmRlcmluZyB0aGUgY2FyZHM/Pz8/Pz8gb3Igc3RvcmluZyB0aGVtIGJ5IHN1aXRlPz8/P1xuICAgICAgICAgICAgdGhpcy5sb2coXCJcXHRDYXJkIGNvbGxlY3Rpb246IFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2FyZCBcIitjYXJkK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIiAoZGVsdGEgbnVtYmVyIG9mIGNhcmRzOiBcIisodGhpcy5udW1iZXJPZkNhcmRzLW51bWJlck9mQ2FyZHNOb3cpK1wiKS5cIik7XG4gICAgfVxuICAgIC8qXG4gICAgLy8gcmVwbGFjZSBhIGNhcmQgYXQgYSBnaXZlbiBpbmRleCAoYXMgdXNlZCBpbiBUcmljaylcbiAgICBfc2V0Q2FyZEF0SW5kZXgoY2FyZCxpbmRleCl7XG4gICAgICAgIGlmKGluZGV4PDB8fGluZGV4Pj10aGlzLm51bWJlck9mQ2FyZHMpdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVwbGFjZSBjYXJkICNcIitTdHJpbmcoaW5kZXgrMSkrXCIuXCIpO1xuICAgICAgICBsZXQgY2FyZEF0SW5kZXg9dGhpcy5fY2FyZHNbaW5kZXhdO1xuICAgICAgICBpZihjYXJkQXRJbmRleCl7Y2FyZEF0SW5kZXguX2hvbGRlcj1udWxsO3RoaXMuX2NhcmRzW2luZGV4XT1udWxsO31cbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBpZiAnY29udGFpbmVkJyBpbiBhbm90aGVyIGNhcmQgaG9sZGVyIHJlbW92ZSBpdCBmcm9tIHRoZXJlISEhXG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgaWYoY2FyZC5faG9sZGVyKWNhcmQuX2hvbGRlci5yZW1vdmVDYXJkKGNhcmQpO1xuICAgICAgICAgICAgICAgIGlmKCFjYXJkLl9ob2xkZXIpe3RoaXMuX2NhcmRzW2luZGV4XT1jYXJkO2NhcmQuX2hvbGRlcj10aGlzO30gICAgXG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe31cbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIC8vIHBvbGwgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIGdldCBudW1iZXJPZkNhcmRzKCl7cmV0dXJuIHRoaXMuX2NhcmRzLmxlbmd0aDt9XG5cbiAgICBnZXRDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnJhbms9PXJhbms7fSk7XG4gICAgfVxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShzdWl0ZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQuc3VpdGU9PXN1aXRlO30pLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50XG4gICAgICovXG4gICAgZ2V0U3VpdGVzKCl7XG4gICAgICAgIC8vIGNhbid0IHVzZSB0aGlzIGluIGZpbHRlciEhISByZXR1cm4gWzAsMSwyLDNdLmZpbHRlcigocmFuayk9PntyZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspPjA7fSk7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGNhcmRzIGluIHRoZSBob2xkZXIgd2l0aCB0aGUgZ2l2ZW4gcmFua1xuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGFsbCBzdWl0ZXMsIHdpdGggLTEgd2hlcmUgYSBzdWl0ZSBpcyBub3QgcHJlc2VudCBpbiB0aGUgY3VycmVudCBjYXJkcyBcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aG91dFJhbmsocmFuayl7XG4gICAgICAgIC8vIGFoIHRoaXMgaXMgYW4gaXNzdWUsIGJlY2F1c2UgaWYgeW91IGRvIG5vdCBoYXZlIGEgY2VydGFpbiBzdWl0ZSB0aGUgc3VpdGUgc2hvdWxkIE5PVCBiZSByZXR1cm5lZCEhISEhXG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57XG4gICAgICAgICAgICBpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpOyAvLyBpZiBzdWl0ZSBub3QgcHJlc2VudCB5ZXQsIGFkZCBpdCB0byBzdWl0ZXNcbiAgICAgICAgICAgIGlmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzW2NhcmQuc3VpdGVdPS0xOyAvLyBub3QgcmVtb3ZpbmcgaXQgYnV0IHNldHRpbmcgdG8gLTEgaWYgd2UgbG9jYXRlIHRoZSByYW5rXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50IG9mIHdoaWNoIHRoZSBwbGF5ZXIgZG9lcyBub3QgaGF2ZSB0aGUgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBnZXRSYW5rbGVzc1N1aXRlcyhyYW5rKXtcbiAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVzPVtdO1xuICAgICAgICBsZXQgc3VpdGVzV2l0aFJhbmtzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGNhcmQpPT57XG4gICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwJiZzdWl0ZXNXaXRoUmFua3MuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5jYXJkTmFtZUluZGV4PT1yYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1aXRlc1dpdGhSYW5rcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBzdWl0ZSBpZiBhbHJlYWR5IHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW5rbGVzc1N1aXRlSW5kZXg9cmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVJbmRleD49MClyYW5rbGVzc1N1aXRlcy5zcGxpY2UocmFua2xlc3NTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSAvLyB1bnRpbCBwcm92ZW4gZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmtsZXNzU3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmFua2xlc3NTdWl0ZXM7XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzWzBdO31cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHVzZWQgaW4gZ2FtZWVuZ2luZS5qc1xuICAgIGdldExhc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRzLmxlbmd0aC0xXTt9XG5cbiAgICBjb250YWluc0NhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkPXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkPj0wJiYodGhpcy5fY2FyZHNbY2FyZF0uc3VpdGUhPT1zdWl0ZXx8dGhpcy5fY2FyZHNbY2FyZF0ucmFuayE9PXJhbmspKTtcbiAgICAgICAgcmV0dXJuKGNhcmQ+PTApOyAvLyBmb3VuZCBpZiBjYXJkIGlzIG5vdCBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8vIE1ESEAxM0pBTjIwMjA6IHdlIG5lZWQgdGhpcyB0byBmaW5kIGEgc3BlY2lmaWMgY2FyZFxuICAgIGdldENhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmRJbmRleD49MCl7bGV0IGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtpZihjYXJkLnN1aXRlPT09c3VpdGUmJmNhcmQucmFuaz09PXJhbmspcmV0dXJuIGNhcmQ7fVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYW4gZXhwb3NlIGEgdGV4dCByZXByZXNlbnRpb25cbiAgICAgKi9cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oc3VpdGVTZXBhcmF0b3Ipe1xuICAgICAgICB0aGlzLmxvZyhcIk51bWJlciBvZiBjYXJkcyB0byByZXByZXNlbnQ6IFwiK3RoaXMuX2NhcmRzLmxlbmd0aCtcIi5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCBzb3J0aW5nPz8/Pz8/Pz8gdGhhdCB3b3VsZCBiZSBuaWNlXG4gICAgICAgIGlmKHN1aXRlU2VwYXJhdG9yJiZ0eXBlb2Ygc3VpdGVTZXBhcmF0b3I9PT1cInN0cmluZ1wiJiYhdGhpcy5fc29ydGVkKXtcbiAgICAgICAgICAgIHRoaXMuX2NhcmRzLnNvcnQoY29tcGFyZUNhcmRzKTtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD10cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLl9zb3J0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMubWFwKChjYXJkKT0+e3JldHVybiBjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO30pLmpvaW4oXCIgXCIpO1xuICAgICAgICAvLyBjYXJkcyBhcmUgc3VwcG9zZWQgdG8gYmUgc29ydGVkXG4gICAgICAgIGxldCB0ZXh0UmVwcmVzZW50YXRpb249XCJcIjtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgbGV0IGNhcmQ9dGhpcy5nZXRGaXJzdENhcmQoKTtcbiAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbj1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MTtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKXtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPShjYXJkLnN1aXRlIT10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlP3N1aXRlU2VwYXJhdG9yOlwiIFwiKTtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0UmVwcmVzZW50YXRpb247IC8vIGEgc2luZ2xlIGJsYW5rIGJldHdlZW4gdGhlbSEhIVxuICAgIH1cblxufVxuXG4vKipcbiAqIGEgY2FyZCB3aXRoIGEgY2FyZCBob2xkZXIgaXMgaGVsZFxuICovXG5jbGFzcyBIb2xkYWJsZUNhcmQgZXh0ZW5kcyBDYXJke1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJIT0xEQUJMRUNBUkQgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG5cbiAgICBzZXQgaG9sZGVyKGhvbGRlcil7XG4gICAgICAgIHRoaXMubG9nKFwiQ2hhbmdpbmcgdGhlIGhvbGRlciBvZiBjYXJkIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBjdXJyZW50IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZih0aGlzLl9ob2xkZXIpdGhpcy5faG9sZGVyLl9yZW1vdmVDYXJkKHRoaXMpO1xuICAgICAgICAvLyBhZGQgKHdoZW4gc3VjY2Vzc2Z1bGx5IHJlbW92ZWQpIHRvIHRoZSBuZXcgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKCF0aGlzLl9ob2xkZXImJmhvbGRlcilob2xkZXIuX2FkZENhcmQodGhpcyk7ZWxzZSB0aGlzLmxvZyhcIkVSUk9SOiBVbmFibGUgdG8gY2hhbmdlIHRoZSBob2xkZXIhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgsaG9sZGVyKXtcbiAgICAgICAgc3VwZXIoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCk7XG4gICAgICAgIHRoaXMuX2hvbGRlcj1udWxsO1xuICAgICAgICB0aGlzLmhvbGRlcj1ob2xkZXI7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gXCJIb2xkYWJsZSBcIitzdXBlci50b1N0cmluZygpO31cblxufVxuXG5tb2R1bGUuZXhwb3J0cz17Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9OyIsIi8qKlxuICogYSBwbGFjZWhvbGRlciBmb3IgYSBwbGF5ZXJcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbi8qKlxuICogYSBQbGF5ZXIgY2FuIG1ha2UgYSBiaWQsIG9yIHBsYXkgYSBjYXJkLCBjaG9vc2UgYSB0cnVtcCBhbmQgcGFydG5lciBzdWl0ZVxuICovXG5jbGFzcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIGJpZE1hZGUoYmlkKXt9XG4gICAgY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXt9XG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXt9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7fVxufVxuXG4vLyBNREhAMDdERUMyMDE5OiBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lciB3aXRoIGdhbWUgZGF0YSBleHBvc2VkIHRvIHBsYXllclxuLy8gICAgICAgICAgICAgICAgd2hpY2ggd2FzIGVhcmxpZXIgc3RvcmVkIGluIGVhY2ggdHJpY2tcbmNsYXNzIFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIHN0YXRpYyBnZXQgQklEX05BTUVTKCl7cmV0dXJuIFtcInBhc1wiLFwicmlrXCIsXCJyaWsgKGJldGVyKVwiLFwibmVnZW4gYWxsZWVuXCIsXCJuZWdlbiBhbGxlZW4gKGJldGVyKVwiLFwicGljb1wiLFwidGllbiBhbGxlZW5cIixcInRpZW4gYWxsZWVuIChiZXRlcilcIixcImVsZiBhbGxlZW5cIixcImVsZiBhbGxlZW4gKGJldGVyKVwiLFwibWlzXFx4ZThyZVwiLFwidHdhYWxmIGFsbGVlblwiLFwidHdhYWxmIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmVcIixcImRlcnRpZW4gYWxsZWVuXCIsXCJkZXJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmUgbWV0IGVlbiBwcmFhdGplXCIsXCJ0cm9lbGFcIixcIm9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZ1wiLFwib20gZGUgbGFhdHN0ZSBzbGFnXCJdO307XG4gICAgc3RhdGljIGdldCBCSURfUEFTKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUsoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJS19CRVRFUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BJQ08oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBCSURfTUlTRVJFKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTigpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRSgpe3JldHVybiAxMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOKCl7cmV0dXJuIDE0O307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkUoKXtyZXR1cm4gMTY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UUk9FTEEoKXtyZXR1cm4gMTc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUdfRU5fU0NIT1BQRU5fVlJPVVcoKXtyZXR1cm4gMTg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUcoKXtyZXR1cm4gMTk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRFNfQUxMX0NBTl9QTEFZKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9QSUNPLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRV07fTsgLy8gdHJ1bXBsZXNzIGdhbWVzXG4gICAgc3RhdGljIGdldCBCSURTX1dJVEhfUEFSVE5FUl9JTl9IRUFSVFMoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1JJS19CRVRFUixQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVJdO307IC8vIGdhbWVzIHdpdGggdHJ1bXAgcGxheWVkIHdpdGggYSBwYXJ0bmVyXG4gICAgc3RhdGljIGdldCBCSURfUkFOS1MoKXtyZXR1cm4gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDAsLTEsLTFdO307IC8vIGhvdyBJIHBsYXllZCBpdCAoYmlkIHBhc3MgZXhjbHVkZWQgKGFsd2F5cyByYW5rIDApKVxuICAgIFxuICAgIC8vIGVhY2ggYmlkIGhhcyBhIGNlcnRhaW4gYW1vdW50IG9mIHBvaW50cyB0byByZWNlaXZlIHdoZW4gd2lubmluZyB0aGUgZ2FtZVxuICAgIHN0YXRpYyBnZXQgQklEX1BPSU5UUygpe3JldHVybiBbMCwxLDEsMywzLDQsNCw0LDUsNSw1LDYsNiw2LDcsNywxMCwyLDIsMl07fVxuXG4gICAgLy8gdGhlIHN0YXRlIGNvbnN0YW50cyB3ZSBoYXZlXG4gICAgc3RhdGljIGdldCBPVVRfT0ZfT1JERVIoKXtyZXR1cm4gMDt9XG4gICAgc3RhdGljIGdldCBJRExFKCl7cmV0dXJuIDE7fVxuICAgIHN0YXRpYyBnZXQgREVBTElORygpe3JldHVybiAyO31cbiAgICBzdGF0aWMgZ2V0IEJJRERJTkcoKXtyZXR1cm4gMzt9XG4gICAgc3RhdGljIGdldCBQTEFZSU5HKCl7cmV0dXJuIDQ7fVxuICAgIHN0YXRpYyBnZXQgQ0FOQ0VMSU5HKCl7cmV0dXJuIDU7fVxuICAgIHN0YXRpYyBnZXQgRklOSVNIRUQoKXtyZXR1cm4gNjt9XG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXt9XG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe31cbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe31cbiAgICBnZXRIaWdoZXN0QmlkKCl7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllcil7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe31cbiAgICBnZXQgcG9pbnRzKCl7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXIsb3RoZXJQbGF5ZXIpe31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7fVxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXt9XG4gICAgX2Fza1BsYXllckZvckJpZCgpe31cbiAgICBfYXNrUGxheWVyRm9yVHJ1bXBTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yUGFydG5lclN1aXRlKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JDYXJkKCl7fVxuICAgIF9jYXJkUGxheWVkQWNjZXB0ZWQoKXt9IC8vIE1ESEAyM0pBTjIwMjA6IHRoZSBlbXB0eSBtZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gYSBjYXJkIHdhcyBwbGF5ZWQgc3VjY2Vzc2Z1bGx5XG59XG5cbmNvbnN0IENIT0lDRV9JRFM9W1wiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiXTtcblxuY29uc3QgUExBWUVSVFlQRV9GT089MCxQTEFZRVJUWVBFX1VOS05PV049MSxQTEFZRVJUWVBFX0ZSSUVORD0yO1xuXG4vLyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgUGxheWVyIGluc3RhbmNlc1xuLy8gd291bGQgYmUgZGVmaW5lZCBhYnN0cmFjdCBpbiBjbGFzc2ljYWwgT09cbmNsYXNzIFBsYXllciBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlBMQVlFUiA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICBhZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyJiZwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLnB1c2gocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGV2ZW50IGxpc3RlbmVyczogXCIrdGhpcy5fZXZlbnRMaXN0ZW5lcnMrXCIuXCIpO1xuICAgIH1cblxuICAgIC8vIHdoZW5ldmVyIGEgZ2FtZSBpcyBzdGFydGVkLCBjYWxsIG5ld0dhbWUhIVxuICAgIG5ld0dhbWUoKXtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MHx8IXRoaXMuX2dhbWUpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIHZvb3IgdGUgYmVyZWlkZW4gb20gdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHM9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICBpZihudW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gYmV0dGVyIGRvbmUgdGhpcyB3YXkgaW5zdGVhZCBvZiB0aGlzLl9jYXJkcz1bXVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIk5vZyBcIitudW1iZXJPZkNhcmRzK1wiIGthYXJ0ZW4gaW4gZGUgaGFuZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVmYXVsdCBwbGF5ZXIgcmVtZW1iZXJpbmcgaXRzIGNob2ljZXNcbiAgICAgICAgdGhpcy5fYmlkPS0xOyAvLyB0aGUgbGFzdCBiaWQgb2YgdGhpcyBwbGF5ZXJcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7XG4gICAgICAgIC8vIHRoZSBnYW1lIGJlaW5nIHBsYXllZCwgYW5kIHRoZSBpbmRleCB3aXRoaW4gdGhhdCBnYW1lXG4gICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbj1bXTsgLy8gdGhlIHRyaWNrcyB3b24gKGluIGFueSBnYW1lKVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPS0xOyAvLyBkb2Vzbid0IG1hdHRlclxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG5hbWUscGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX25hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnM9W107XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICAgICAgaWYoIShwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcikpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIGV2ZW50IGxpc3RlbmVyIG9mIHdyb25nIHR5cGUuXCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdhaXQgZm9yIHJlY2VpdmluZyBnYW1lIGFuZCBpbmRleFxuICAgICAgICB0aGlzLl9pbmRleD0tMTt0aGlzLl9nYW1lPW51bGw7IC8vIHdhaXRpbmcgZm9yIHRoZSBnYW1lIHRvIGJlIHBsdWdnZWQgaW4gKG9uY2UpXG4gICAgICAgIC8vIHJlbW92ZWQgd2FpdCB1bnRpbCBnZXR0aW5nIGNhbGxlZCB0aHJvdWdoIG5ld0dhbWU6IHRoaXMuX3ByZXBhcmVGb3JQbGF5aW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIC8vIGdldHRlcnMgZXhwb3NpbmcgaW5mb3JtYXRpb24gdG8gdGhlIG1hZGUgY2hvaWNlXG4gICAgLy8gTk9URSBubyBsb25nZXIgY2FsbGVkIGJ5IHRoZSBnYW1lIGJlY2F1c2UgdGhlIGNob2ljZSBpcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQgbm93XG4gICAgLy8gICAgICB0aGlzIHdheSBzdWJjbGFzc2VzIGFyZSBub3Qgb2JsaWdhdGVkIHRvIHJlbWVtYmVyIHRoZSBjaG9pY2VzIHRoZXkgbWFrZVxuICAgIGdldCBiaWQoKXtyZXR1cm4gdGhpcy5fYmlkO31cbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5jYXJkKCk7fVxuXG4gICAgZ2V0IHBhcnRuZXIoKXtyZXR1cm4gdGhpcy5fcGFydG5lcjt9XG5cbiAgICAvLy8vLy8vLy8vLy8vL2dldCBjYXJkKCl7cmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRQbGF5SW5kZXhdO31cblxuICAgIC8qIGNhbiBiZSBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIGdhbWVcbiAgICAvLyBjYW4gYmUgc2V0IGRpcmVjdGx5IHdoZW4gYSBiZXR0ZXIgJ3JpaycgdmFyaWF0aW9uIGJpZCB3YXMgZG9uZSEhISFcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBcbiAgICAvLyBUT0RPIGl0IHdvdWxkIGJlIGVhc2llciB0byBjb21iaW5lIHRoZXNlIGluIGEgY2FyZCEhISFcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cblxuICAgIC8vIGNhbGxlZCBmcm9tIHRoZSBVSSB0byBzZXQgdGhlIHRydW1wIHN1aXRlISEhIVxuICAgIHNldCB0cnVtcFN1aXRlKHRydW1wU3VpdGUpe3RoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTt0aGlzLnRydW1wU3VpdGVDaG9zZW4oKTt9XG4gICAgc2V0IHBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpe3RoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5wYXJ0bmVyU3VpdGVDaG9zZW4oKTt9XG4gICAgKi9cblxuICAgIC8vIGVuZCBvZiBnZXR0ZXJzL3NldHRlcnMgdXNlZCBieSB0aGUgZ2FtZVxuICAgIF9yZW1vdmVDYXJkcygpe3doaWxlKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXRoaXMuX2NhcmRzLnNoaWZ0KCkuaG9sZGVyPW51bGw7fVxuXG4gICAgZ2V0IGdhbWUoKXtyZXR1cm4gdGhpcy5fZ2FtZTt9XG4gICAgc2V0IGdhbWUoZ2FtZSl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWU9PT1nYW1lKXJldHVybjtcbiAgICAgICAgaWYoZ2FtZSYmIShnYW1lIGluc3RhbmNlb2YgUGxheWVyR2FtZSkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiU3BlbCBuaWV0IHZhbiBoZXQganVpc3RlIHR5cGUuXCIpO1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIlBvc2l0aWUgdmFuIHNwZWxlciBvbmJla2VuZC5cIik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIE1ESEAxMUpBTjIwMjA6IGlmIHRoZSBnYW1lIGNoYW5nZXMgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgY2FyZHNcbiAgICAgICAgdGhpcy5fZ2FtZT1nYW1lO1xuICAgICAgICAvLyBzeW5jIF9pbmRleFxuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMucGFydG5lcj0tMTsgLy8gbXkgcGFydG5lciAob25jZSBJIG5vdyB3aG8gaXQgaXMpXG4gICAgICAgICAgICB0aGlzLnRyaWNrc1dvbj1bXTsgLy8gc3RvcmluZyB0aGUgdHJpY2tzIHdvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4KCl7cmV0dXJuIHRoaXMuX2luZGV4O30gLy8gTURIQDIySkFOMjAyMDogbm8gaGFybSBpbiBhZGRpbmcgYSBnZXR0ZXIhISFcbiAgICBzZXQgaW5kZXgoaW5kZXgpe3RoaXMuX2luZGV4PWluZGV4O30gLy8gTURIQDA5SkFOMjAyMDogc29tZXRpbWVzIGFuIGluZGV4IGNhbiBiZSBzZXQgc2VwYXJhdGVseVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWdpc3RlcmluZyB0aGUgZ2FtZSBwbGF5ZWQgYXQgaW5kZXggXCIraW5kZXgrXCIuXCIpO1xuICAgICAgICB0aGlzLmluZGV4PWluZGV4O1xuICAgICAgICB0aGlzLmdhbWU9Z2FtZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIHJlZ2lzdGVyZWQhXCIpO1xuICAgIH1cbiAgICAvKlxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIHN1cGVyLmFkZENhcmQoY2FyZCk7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzK1wiJyByZWNlaXZlZCBjYXJkICdcIitjYXJkK1wiJy5cIik7XG4gICAgfVxuICAgICovXG4gICAgX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUsd2hlbk5vdEZvdW5kQ2FyZCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4oY2FyZC5zdWl0ZT09Y2FyZFN1aXRlKTt9KTtcbiAgICB9XG5cbiAgICBfZ2V0U3VpdGVDYXJkcygpe1xuICAgICAgICB0aGlzLmxvZyhcIkRldGVybWluaW5nIHN1aXRlIGNhcmRzIG9mIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiBjYXJkcyFcIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmRzPVtbXSxbXSxbXSxbXV07XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57c3VpdGVDYXJkc1tjYXJkLnN1aXRlXS5wdXNoKGNhcmQpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVDYXJkcztcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgb2YgYSBnaXZlbiBjYXJkIHN1aXRlIChvciBhbnkgY2FyZCBpZiBjYXJkU3VpdGUgaXMgdW5kZWZpbmVkKVxuICAgIGNvbnRyaWJ1dGVUb1RyaWNrKHRyaWNrKSB7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD09MClyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBrYWFydGVuIG1lZXIgb20gdGUgc3BlbGVuIVwiKTtcbiAgICAgICAgbGV0IGNhcmRzT2ZTdWl0ZT10aGlzLl9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlKTtcbiAgICAgICAgbGV0IGNhcmQ9KGNhcmRzT2ZTdWl0ZSYmY2FyZHNPZlN1aXRlLmxlbmd0aD4wP2NhcmRzT2ZTdWl0ZVswXTp0aGlzLl9jYXJkc1swXSk7XG4gICAgICAgIGNhcmQuaG9sZGVyPXRyaWNrOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoZSB0cmlja1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNREg6IGFsbCBtZXRob2RzIHRoYXQgZGVhbCB3aXRoIHByb2Nlc3NpbmcgYSBiaWQsIGEgY2FyZCwgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBjaG9pY2VcbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIG1hZGUgYSBiaWRcbiAgICBfYmlkTWFkZShiaWQpe1xuICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIGluIHRlIGJpZWRlbiFcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2luZyBiaWQgXCIrYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyB0byB0aGUgZ2FtZSFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLmJpZE1hZGUoYmlkKTtcbiAgICB9XG4gICAgLy8gTURIQDI2SkFOMjAyMDogcmV0dXJuaW5nIHRydWUgb24gc3VjY2VzcyAod2hlbiBfYmlkTWFkZSBkaWQgbm90IHJldHVybiBhbiBlcnJvcilcbiAgICBfc2V0QmlkKGJpZCl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9iaWRNYWRlKGJpZCk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fYmlkPWJpZDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7KCFldmVudExpc3RlbmVyfHxldmVudExpc3RlbmVyLmJpZE1hZGUodGhpcy5fYmlkKSk7fWNhdGNoKGVycm9yKXt9fSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNhcmRQbGF5ZWQgaW4gUmlra2VuVGhlR2FtZSBjYW4gbm93IHJldHVybiBhbiBlcnJvciAoaW5zdGVhZCBvZiB0aHJvd2luZyBvbmUpXG4gICAgX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIGthYXJ0IGluIHRlIHNwZWxlbiFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLmNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgfVxuICAgIC8vIFRPRE8gYSBiaWQgc2V0dGVyIHdpbGwgYWxsb3cgc3ViY2xhc3NlcyB0byBwYXNzIGEgYmlkIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5XG4gICAgX3NldENhcmQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHBsYXllZCBjYXJkIGlzIHZhbGlkIHNob3VsZCBiZSBkb25lIGhlcmUsIG9yIEJFRk9SRSBjYWxsaW5nIHNldENhcmRcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fY2FyZD1jYXJkO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLmNhcmRQbGF5ZWQodGhpcy5fY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvb3NlbiBhIHRydW1wIHN1aXRlXG4gICAgX3RydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHRyb2Vma2xldXIgaW4gdGUga2llemVuIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICB9XG4gICAgX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci50cnVtcFN1aXRlQ2hvc2VuKHRoaXMuX3RydW1wU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob3NlbiBhIHBhcnRuZXJcbiAgICBfcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHBhcnRuZXIgKGthYXJ0a2xldXIpIHRlIGtpZXplbi5cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnBhcnRuZXJTdWl0ZUNob3Nlbih0aGlzLl9wYXJ0bmVyU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gbWFrZSBhIGJpZCBwYXNzaW5nIGluIHRoZSBoaWdoZXN0IGJpZCBzbyBmYXJcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgbWFrZUFCaWQocGxheWVyYmlkcyl7XG4gICAgICAgIC8vIGFzc3VtZXMgdGhhdCB0aGlzIHBsYXllciBoYXMgbWFkZSBhIGJpZCBiZWZvcmUsIG9yIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgYmlkXG4gICAgICAgIC8vIHRoaXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRvIGJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIHNvIHdlIGNhbiB1c2UgcHJvbXB0KClcbiAgICAgICAgLy8gYWxsIG90aGVyIGF2YWlsYWJsZSBiaWRzIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiB0aGUgbGFzdCBiaWQgYnkgYW55IG90aGVyIHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZFNvRmFyPVBsYXllckdhbWUuQklEX1BBUztcbiAgICAgICAgaWYocGxheWVyYmlkcyl7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlBsYXllciBiaWRzOlwiLHBsYXllcmJpZHMpO1xuICAgICAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8cGxheWVyYmlkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICAgICAgaWYocGxheWVyYmlkc1twbGF5ZXJdLmxlbmd0aD4wJiZwbGF5ZXJiaWRzW3BsYXllcl1bMF0+aGlnaGVzdEJpZFNvRmFyKVxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0QmlkU29GYXI9cGxheWVyYmlkc1twbGF5ZXJdWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nKFwiSGlnaGVzdCBiaWQgc28gZmFyOiAnXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXStcIicuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgaGlnaGVzdCBwb3NzaWJsZSBiaWQgaXMgbm90IGEgYmlkIGFsbCBjYW4gcGxheSAoYXQgdGhlIHNhbWUgdGltZSksIGNhbid0IGJlIGJpZCBhZ2FpblxuICAgICAgICBpZihQbGF5ZXJHYW1lLkJJRFNfQUxMX0NBTl9QTEFZLmluZGV4T2YoUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXSk8MCloaWdoZXN0QmlkU29GYXIrKztcbiAgICAgICAgbGV0IHBvc3NpYmxlQmlkTmFtZXM9UGxheWVyR2FtZS5CSURfTkFNRVMuc2xpY2UoaGlnaGVzdEJpZFNvRmFyKTtcbiAgICAgICAgcG9zc2libGVCaWROYW1lcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW1BsYXllckdhbWUuQklEX1BBU10pOyAvLyB1c2VyIGNhbiBhbHdheXMgJ3BhcydcbiAgICAgICAgdGhpcy5sb2coXCJQb3NzaWJsZSBiaWRzOiBcIixwb3NzaWJsZUJpZE5hbWVzKTtcbiAgICAgICAgbGV0IGJpZD0tMTtcbiAgICAgICAgd2hpbGUoYmlkPDApe1xuICAgICAgICAgICAgbGV0IGJpZG5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IGlzIHlvdXIgYmlkIChvcHRpb25zOiAnXCIrcG9zc2libGVCaWROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlQmlkTmFtZXNbMF0pO1xuICAgICAgICAgICAgYmlkPVBsYXllckdhbWUuQklEX05BTUVTLmluZGV4T2YoYmlkbmFtZSk7XG4gICAgICAgICAgICBpZihiaWQ8MCljb250aW51ZTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRCaWQoYmlkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgYmlkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICAvLyBpZiB0aGlzIHBsYXllciBoYXMgYWxsIGFjZXMgaXQncyBnb25uYSBiZSB0aGUgc3VpdGUgb2YgYSBraW5nIHRoZSBwZXJzb24gaGFzbid0XG4gICAgICAgIC8vIGFsc28gaXQgbmVlZHMgdG8gYmUgYW4gYWNlIG9mIGEgc3VpdGUgdGhlIHVzZXIgaGFzIGl0c2VsZiAodW5sZXNzIHlvdSBoYXZlIGFsbCBvdGhlciBhY2VzKVxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICAvLyBhbnkgb2YgdGhlIHN1aXRlcyBpbiB0aGUgY2FyZHMgY2FuIGJlIHRoZSB0cnVtcCBzdWl0ZSFcbiAgICAgICAgbGV0IHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzPXRoaXMuZ2V0U3VpdGVzKCkubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPS0xO1xuICAgICAgICB3aGlsZSh0cnVtcFN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHRydW1wTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgc3VpdGUgd2lsbCBiZSB0cnVtcCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVUcnVtcFN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgdHJ1bXBTdWl0ZT1wb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5pbmRleE9mKHRydW1wTmFtZSk7XG4gICAgICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFza3MgZm9yIHRoZSBzdWl0ZSBvZiB0aGUgcGFydG5lciBjYXJkIG9mIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgY2hvb3NlUGFydG5lclN1aXRlKCl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclJhbms9UkFOS19BQ0U7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIGFjZWxlc3Mgc3VpdGVzXG4gICAgICAgIGxldCBzdWl0ZXM9dGhpcy5nZXRTdWl0ZXMoKTtcbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD09MCl7IC8vIHBsYXllciBoYXMgQUxMIGFjZXNcbiAgICAgICAgICAgIGlmKHN1aXRlcy5sZW5ndGg8NCl7IC8vIGJ1dCBub3QgYWxsIHN1aXRlc1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgc3VpdHMgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhcmUgYWxsb3dlZCAoYXNraW5nIHRoZSBhY2UgYmxpbmQhISEpXG4gICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPVswLDEsMiwzXS5maWx0ZXIoKHN1aXRlKT0+e3JldHVybiBwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZihzdWl0ZSk8MDt9KTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBoYXMgYWxsIHN1aXRzLCBzbyBhIGtpbmcgaXMgdG8gYmUgc2VsZWN0ZWQhISFcbiAgICAgICAgICAgICAgICAvLyBhbGwga2luZ3MgYWNjZXB0YWJsZSBleGNlcHQgZm9yIHRoYXQgaW4gdGhlIHRydW1wIGNvbG9yXG4gICAgICAgICAgICAgICAgLy8gTk9URSBpZiBhIHBlcnNvbiBhbHNvIGhhcyBhbGwgdGhlIGtpbmdzIHdlIGhhdmUgYSBzaXR1YXRpb24sIHdlIHNpbXBseSBjb250aW51ZSBvbndhcmRcbiAgICAgICAgICAgICAgICB3aGlsZSgxKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbmstLTtcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJ1bXBTdWl0ZUluZGV4PXBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHRoaXMuX3RydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0cnVtcFN1aXRlSW5kZXg+PTApcG9zc2libGVQYXJ0bmVyU3VpdGVzLnNwbGljZSh0cnVtcFN1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg+MClicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXM9cG9zc2libGVQYXJ0bmVyU3VpdGVzLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB3aGlsZShwYXJ0bmVyU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgXCIrQ2FyZC5DQVJEX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXStcIiBzaG91bGQgeW91ciBwYXJ0bmVyIGhhdmUgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICBwYXJ0bmVyU3VpdGU9cG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5pbmRleE9mKHBhcnRuZXJTdWl0ZU5hbWUpO1xuICAgICAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIGFuZCBhZGQgaXQgdG8gdGhlIGdpdmVuIHRyaWNrXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIHBsYXlBQ2FyZCh0cmljayl7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGFza2VkIHRvIHBsYXkgYSBjYXJkLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHVzaW5nIHRoZSBmaXJzdCBsZXR0ZXJzIG9mIHRoZSBhbHBoYWJldD9cbiAgICAgICAgbGV0IHBvc3NpYmxlQ2FyZE5hbWVzPVtdO1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBwb3NzaWJsZUNhcmROYW1lcy5wdXNoKFN0cmluZy5jYXJkSW5kZXgrMSkrXCI6IFwiK3RoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGxldCBjYXJkUGxheUluZGV4PS0xO1xuICAgICAgICB3aGlsZShjYXJkUGxheUluZGV4PDApe1xuICAgICAgICAgICAgLy8gd2UncmUgc3VwcG9zZWQgdG8gcGxheSBhIGNhcmQgd2l0aCBzdWl0ZSBlcXVhbCB0byB0aGUgZmlyc3QgY2FyZCB1bmxlc3MgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBpcyBiZWluZyBhc2tlZCBmb3JcbiAgICAgICAgICAgIGxldCBjYXJkSWQ9cGFyc2VJbnQocHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIlxcblByZXNzIHRoZSBpZCBvZiB0aGUgY2FyZCB5b3Ugd2FudCB0byBhZGQgdG8gXCIrdHJpY2suZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUNhcmROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLFwiXCIpKTtcbiAgICAgICAgICAgIGlmKGlzTmFOKGNhcmRJZCkpY29udGludWU7XG4gICAgICAgICAgICBjYXJkUGxheUluZGV4PWNhcmRJZC0xO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENhcmQodGhpcy5fY2FyZHNbY2FyZFBsYXlJbmRleF0pO1xuICAgIH1cblxuICAgIHNldCBwYXJ0bmVyKHBhcnRuZXIpe3RoaXMuX3BhcnRuZXI9KHR5cGVvZiBwYXJ0bmVyPT09J251bWJlcic/cGFydG5lcjotMSk7fSAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgdHJpY2tXb24odHJpY2tJbmRleCl7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbi5wdXNoKHRyaWNrSW5kZXgpO1xuICAgICAgICB0aGlzLmxvZyhcIlRyaWNrICNcIit0cmlja0luZGV4K1wiIHdvbiBieSAnXCIrdGhpcy5uYW1lK1wiJzogXCIrdGhpcy5fdHJpY2tzV29uK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NXb24oKXtyZXR1cm4gdGhpcy5fdHJpY2tzV29uLmxlbmd0aDt9XG4gICAgXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgdHJpY2tzIHdvbiAoaW5jbHVkaW5nIHRob3NlIGJ5IHRoZSBwYXJ0bmVyIChpZiBhbnkpKVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXJPZlRyaWNrc1dvbit0aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5wYXJ0bmVyKSk7XG4gICAgfVxuXG4gICAgc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihudW1iZXJPZlRyaWNrc1RvV2luKXt0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPW51bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1RvV2luKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIFxuICAgIC8vIGV2ZXJ5IHBsYXllciBjYW4gYmUgY2hlY2tlZCB3aGV0aGVyIGZyaWVuZCAoMSkgb3IgZm9vICgtMSkgb3IgdW5rbm93biAoMClcbiAgICBpc0ZyaWVuZGx5KHBsYXllcil7XG4gICAgICAgIGlmKHBsYXllcj09PXRoaXMuX2luZGV4KXJldHVybiAyOyAvLyBJJ20gbXVjaG8gZnJpZW5kbHkgdG8gbXlzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXsgLy8gYSBub24tc29saXRhcnkgZ2FtZVxuICAgICAgICAgICAgLy8gQVNTRVJUIG5vdCBhIHNvbGl0YXJ5IGdhbWUgc28gcGxheWVyIGNvdWxkIGJlIHRoZSBwYXJ0bmVyIGluIGNyaW1lXG4gICAgICAgICAgICAvLyBpZiBwYXJ0bmVyIGlzIGtub3duIChpLmUuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgbm8gbG9uZ2VyIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lcj49MClyZXR1cm4ocGxheWVyPT09dGhpcy5fcGFydG5lcj8xOi0xKTsgXG4gICAgICAgICAgICAvLyBBU1NFUlQgcGFydG5lciB1bmtub3duIChpLmUuIHBhcnRuZXIgY2FyZCBzdGlsbCBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGxldCB0cnVtcFBsYXllcj10aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk7XG4gICAgICAgICAgICAvLyBpZiBJJ20gdGhlIHRydW1wIHBsYXllciwgYXNzdW1lIEFMTCB1bmZyaWVuZGx5IEJVVCBubyBJIGRvbid0IGtub3cgd2hvIG15IHBhcnRuZXIgaXMgYWxsIGNvdWxkIGJlXG4gICAgICAgICAgICBpZih0aGlzLl9pbmRleD09PXRydW1wUGxheWVyKXJldHVybiAwOyAvLyB1bmtub3duXG4gICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUsdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpKSkgLy8gSSBoYXZlIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICByZXR1cm4ocGxheWVyPT10cnVtcFBsYXllcj8xOi0xKTsgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmcmllbmRseSwgdGhlIG90aGVycyBhcmUgdW5mcmllbmRseVxuICAgICAgICAgICAgLy8gQVNTRVJUIEknbSBub3QgdGhlIHRydW1wIHBsYXllciwgYW5kIEknbSBub3Qgd2l0aCB0aGUgdHJ1bXAgcGxheWVyIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZm9vLCB0aGUgcmVzdCBJIGRvbid0IGtub3cgeWV0XG4gICAgICAgICAgICByZXR1cm4ocGxheWVyPT09dHJ1bXBQbGF5ZXI/LTE6MCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIGEgc29saXRhcnkgZ2FtZVxuICAgICAgICAvLyBpZiBJJ20gb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzLCBldmVyeW9uZSBlbHNlIGlzIGEgZm9vXG4gICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHRoaXMuX2luZGV4KT49MClyZXR1cm4gLTE7XG4gICAgICAgIC8vIEFTU0VSVCBub3Qgb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzXG4gICAgICAgIC8vICAgICAgICBpZiBwbGF5ZXIgaXMgYSBzb2xpdGFyeSBwbGF5ZXIgaXQncyBhIGZvbywgb3RoZXJ3aXNlIGl0J3MgdXMgYWdhaW5zdCB0aGVtISEhIVxuICAgICAgICByZXR1cm4odGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YocGxheWVyKT49MD8tMToxKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiB0aGlzLm5hbWU7fVxuXG59XG5cbi8vIGV4cG9ydCB0aGUgUGxheWVyIGNsYXNzXG5tb2R1bGUuZXhwb3J0cz17UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn07IiwiY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTsgLy8gZm9yIGNvbXBhcmluZyBjYXJkc1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuY2xhc3MgVHJpY2sgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgLy8gTURIQDA3REVDMjAxOTogZ2FtZSBkYXRhIG1vdmVkIG92ZXIgdG8gUGxheWVyR2FtZSBpbnN0YW5jZSAoYXMgcGFzc2VkIHRvIGVhY2ggcGxheWVyKVxuICAgIC8vICAgICAgICAgICAgICAgIGNhbkFza0ZvclBhcnRuZXJDYXJkIGJsaW5kIG5vdyBkZXRlcm1pbmVkIGJ5IHRoZSBnYW1lIChlbmdpbmUpIGl0c2VsZlxuXG4gICAgLy8gYnkgcGFzc2luZyBpbiB0aGUgdHJ1bXAgcGxheWVyIChpLmUuIHRoZSBwZXJzb24gdGhhdCBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkKVxuICAgIGNvbnN0cnVjdG9yKGZpcnN0UGxheWVyLHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLGNhbkFza0ZvclBhcnRuZXJDYXJkLGZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyl7IC8vIHJlcGxhY2luZzogdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssdHJ1bXBQbGF5ZXIpe1xuICAgICAgICBzdXBlcigpOyAvLyB1c2luZyA0IGZpeGVkIHBvc2l0aW9ucyBmb3IgdGhlIHRyaWNrIGNhcmRzIHNvIHdlIHdpbGwga25vdyB3aG8gcGxheWVkIHRoZW0hISEhXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyPWZpcnN0UGxheWVyO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7IC8vIGZvciBpbnRlcm5hbCB1c2UgdG8gYmUgYWJsZSB0byBkZXRlcm1pbmUgdGhlIHdpbm5lciBvZiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5fcGFydG5lclJhbms9cGFydG5lclJhbms7IC8vIG5lZWQgdGhpcyB3aGVuIGl0J3MgYmVpbmcgYXNrZWQgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXJcbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9Y2FuQXNrRm9yUGFydG5lckNhcmQ7IC8vIC0xIGJsaW5kLCAwIG5vdCwgMSBub24tYmxpbmRcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gdGhlICdmbGFnJyBzZXQgYnkgdGhlIHRydW1wIHBsYXllciB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0tMTsgLy8gdGhlIHN1aXRlIG9mIHRoZSB0cmljayAobW9zdCBvZiB0aGUgdGltZSB0aGUgc3VpdGUgb2YgdGhlIGZpcnN0IGNhcmQpXG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9LTE7IC8vIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgKG5vdGU6IE5PVCB0cmFuc2Zvcm1lZCB0byB0aGUgYWN0dWFsIHBsYXllciBpbmRleCB5ZXQpXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcz1maXJzdFBsYXllckNhblBsYXlTcGFkZXM7XG4gICAgICAgIC8vIGxldCdzIGtlZXAgdHJhY2sgb2YgdGhlIGhpZ2hlc3QgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgY2FuIGFzayBmb3IgcGFydG5lciBjYXJkOiBcIitjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzOiBcIitmaXJzdFBsYXllckNhblBsYXlTcGFkZXMrXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlczt9XG4gICAgXG4gICAgLy8gdGhlIHdpbm5lciBleHBvc2VkIGlzIHRoZSBhY3R1YWwgcGxheWVyIHdobyB3b25cbiAgICBnZXQgd2lubmVyKCl7cmV0dXJuKHRoaXMuX3dpbm5lckNhcmQ8MD8tMToodGhpcy5fd2lubmVyQ2FyZCt0aGlzLl9maXJzdFBsYXllciklNCk7fVxuICAgIFxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IG1vdmVkIGZyb20gaGVyZSB0byB0aGUgZ2FtZSAoYXMgYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICAgIC8qXG4gICAgZ2V0IHRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO30gLy8gZXhwb3NlcyB0aGUgY3VycmVudCB0cnVtcCBwbGF5ZXJcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAqL1xuICAgIGdldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDt9XG5cbiAgICAvLyBwYXNzIGluIC0xIHdoZW4gYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQsIG9yICsxIHdoZW4gYXNraW5nIGZvciBpdCAobm9uLWJsaW5kKVxuICAgIHNldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZChhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHR5cGVvZiBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PVwibnVtYmVyXCIpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgTk9UIGRlZmluZWQhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLm51bWJlck9mQ2FyZHM+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9wZ2V2ZW4gZGUgcGFydG5lciBhYXMvaGVlciAoYmxpbmQpIHRlIHZyYWdlbiBuaWV0IG1lZXIgdG9lZ2VzdGFhbi5cIik7XG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPWFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFza2luZyBmb3IgcGFydG5lciBjYXJkIHNldCB0byBcIit0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgX3NldFdpbm5lckNhcmQod2lubmVyQ2FyZCl7XG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9d2lubmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayB3aW5uZXIgY2FyZDogXCIrd2lubmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgY2FyZCBwbGF5ZWQgYnkgKHRoZSBhY3R1YWwpIHBsYXllciAoYXMgdXNlZCBmb3Igc2hvd2luZyB0aGUgdHJpY2sgY2FyZHMpXG4gICAgICogQHBhcmFtIHsqfSBwbGF5ZXIgXG4gICAgICovXG4gICAgZ2V0UGxheWVyQ2FyZChwbGF5ZXIpe1xuICAgICAgICBsZXQgcGxheWVyQ2FyZD0odGhpcy5fZmlyc3RQbGF5ZXI+PTA/KHBsYXllcis0LXRoaXMuX2ZpcnN0UGxheWVyKSU0Om51bGwpO1xuICAgICAgICByZXR1cm4ocGxheWVyQ2FyZD49MCYmcGxheWVyQ2FyZDx0aGlzLm51bWJlck9mQ2FyZHM/dGhpcy5fY2FyZHNbcGxheWVyQ2FyZF06bnVsbCk7XG4gICAgfVxuXG4gICAgLypcbiAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgdGhlIGZpcnN0IHBsYXllciBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgaWYoIXRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIChhbnltb3JlKS5cIik7XG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT10aGlzLl90cnVtcFN1aXRlOyAvLyB0aGUgcGxheSBzdWl0ZSBiZWNvbWVzIHRoZSB0cnVtcCBzdWl0ZVxuICAgIH1cbiAgICAqL1xuICAgIC8vIE5PVEUgYWRkQ2FyZCBpcyBOT1QgX2FkZENhcmQgb2YgdGhlIHN1cGVyY2xhc3MhIHRoaXMgaXMgYmVjYXVzZSB3ZSBzaG91bGQgc2V0IHRoZSBob2xkZXIgb24gdGhlIGNhcmQgdG8gYWRkISEhIVxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgIC8vIGlmIHRoZSBmbGFnIG9mIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBpcyBzZXQsIHByZXNldCB0aGUgXG4gICAgICAgIGNhcmQuaG9sZGVyPXRoaXM7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhpcyB0cmljayBieSBzZXR0aW5nIHRoZSBob2xkZXIgcHJvcGVydHkgKHdpbGwgdGFrZSBjYXJlIG9mIGFkZGluZy9yZW1vdmluZyB0aGUgY2FyZClcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogc2hvdWxkIGNvbnNpZGVyIHJldHVybmluZyBhbiBFcnJvciBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yXG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkczw9bnVtYmVyT2ZDYXJkc05vdylcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWRkIHRoZSBjYXJkIHRvIHRoZSB0cmljay5cIik7XG4gICAgICAgIC8vIEFTU0VSVCBjYXJkIGFkZGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5fdHJ1bXBTdWl0ZTwwKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkJVRzogQXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkLCBidXQgcGxheWluZyBhIGdhbWUgd2l0aG91dCB0cnVtcC5cIik7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciBibGluZCBldmVyeW9uZSBoYXMgdG8gcGxheSB0aGUgcGFydG5lciBjYXJkIHN1aXRlXG4gICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IE9PUFMgSSB3YXMgYWxyZWFkeSB1c2luZyB0aGlzLl9wYXJ0bmVyU3VpdGUgaGVyZSBCVVQgc3RpbGwgYWZ0ZXIgYWN0dWFsbHkgdGFraW5nIGl0IG91dCAobm93IGluIGFnYWluKVxuICAgICAgICBpZih0aGlzLl9wbGF5U3VpdGU8MCl7IC8vIGZpcnN0IGNhcmQgYmVpbmcgcGxheWVkXG4gICAgICAgICAgICAvLyBNREhAMThKQU4yMDIwOiBhc2NlcnRhaW4gdGhhdCBfYXNraW5nRm9yUGFydG5lckNhcmQgaGFzIHRoZSByaWdodCB2YWx1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgaXQgY291bGQgYmUgMCBidXQgd2hlbiB0aGUgcGFydG5lciBzdWl0ZSBpcyBwbGF5ZWQgdGhlIHBsYXllciBJUyBhc2tpbmdcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkIT09MCl7IC8vIHBsYXllciBzdXBwb3NlZGx5IGNhbiBzdGlsbCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDw9MCYmY2FyZC5zdWl0ZT09PXRoaXMuX3BhcnRuZXJTdWl0ZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDApdGhyb3cgbmV3IEVycm9yKFwiQlVHOiBDYW5ub3QgYXNrIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkltcGxpY2l0bHkgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJ5IHBsYXlpbmcgdGhlIHBhcnRuZXIgc3VpdGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT09MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgd2hlbiB5b3UgY2FuJ3QgYXNrIGZvciBpdCBhbnltb3JlIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0odGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MD90aGlzLl9wYXJ0bmVyU3VpdGU6Y2FyZC5zdWl0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIHRoaXMuX3BsYXlTdWl0ZSBub3cgZGVmaW5pdGVseSBub24tbmVnYXRpdmUsIHNvXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPTA7IC8vIHVzZSB0aGUgcmlnaHQgcHJvcGVydHkgYnJvJ1xuICAgICAgICAvLyB1cGRhdGUgd2lubmVyXG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHNOb3c+MCl7XG4gICAgICAgICAgICAvLyBNREhAMDlERUMyMDE5OiB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBvbmx5IHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGV2ZXIgd2luIChldmVuIGlmIHRoZXJlJ3MgdHJ1bXAhISlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJ1dCB3ZSBuZWVkIHRvIGtub3cgd2hldGhlciB0aGUgcGFydG5lciBjYXJkIHdhcyBhbHJlYWR5IHRocm93blxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgU09MVVRJT046IChORUFUKSBpdCdzIGVhc2llc3QgdG8gc2ltcGx5IGlnbm9yZSB0cnVtcCBpcyB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciEhISEhIVxuICAgICAgICAgICAgaWYoQ2FyZC5jb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZCx0aGlzLl9jYXJkc1t0aGlzLl93aW5uZXJDYXJkXSx0aGlzLl9wbGF5U3VpdGUsKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wPy0xOnRoaXMuX3RydW1wU3VpdGUpKT4wKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQobnVtYmVyT2ZDYXJkc05vdyk7XG4gICAgICAgIH1lbHNlIC8vIGFmdGVyIHRoZSBmaXJzdCBjYXJkIHRoZSBmaXJzdCBwbGF5ZXIgaXMgdGhlIHdpbm5lciBvZiBjb3Vyc2VcbiAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQoMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRDYXJkUGxheWVyKHN1aXRlLHJhbmspe1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLl9jYXJkcy5sZW5ndGg7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlPT09c3VpdGUmJnRoaXMuX2NhcmRzW2NhcmRJbmRleF0ucmFuaz09PXJhbmspXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9maXJzdFBsYXllcitjYXJkSW5kZXgpJTQ7IC8vIFRPRE8gY2FuIHdlIGFzc3VtZSA0IHBsYXllcnMgaW4gdG90YWw/Pz8/P1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGdldHRlcnNcbiAgICBnZXQgcGxheVN1aXRlKCl7cmV0dXJuIHRoaXMuX3BsYXlTdWl0ZTt9XG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIC8qXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgKi9cbiAgICBnZXQgY2FuQXNrRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ7fVxufVxuXG5tb2R1bGUuZXhwb3J0cz1UcmljaztcbiIsIi8qKlxuICogdGhlIHBhcnQgdGhhdCBydW5zIGluIHRoZSBicm93c2VyIG9mIGEgc2luZ2xlIHBsYXllclxuICogZ2l2ZW4gdGhhdCBhbnkgaW5mb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgcGxheWVyIG9mIHRoZSBnYW1lIHNob3VsZCBiZSBhdmFpbGFibGUgdGhyb3VnaCBpdCdzIF9nYW1lIHByb3BlcnR5IChpLmUuIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAqIGFsbCBjYWxscyBpbiBtYWluLmpzIHRvIHJpa2tlblRoZUdhbWUgZGlyZWN0bHkgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggY2FsbHMgdG8gY3VycmVudFBsYXllci5nYW1lIGkuZS4gcmlra2VuVGhlR2FtZSBpdHNlbGYgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSB0byB0aGUgY3VycmVudFBsYXllciEhIVxuICogXG4qKi9cbi8vIHdlJ2xsIGJlIHVzaW5nIFBsYXllci5qcyBvbmx5IChQbGF5ZXIuanMgd2lsbCBkZWFsIHdpdGggcmVxdWlyaW5nIENhcmRIb2xkZXIsIGFuZCBDYXJkSG9sZGVyIENhcmQpXG4vLyBOTyBJIG5lZWQgdG8gcmVxdWlyZSB0aGVtIGFsbCBvdGhlcndpc2UgYnJvd3NlcmlmeSB3b24ndCBiZSBhYmxlIHRvIGZpbmQgQ2FyZCwgZXRjLlxuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5jb25zdCBUcmljaz1yZXF1aXJlKCcuL1RyaWNrLmpzJyk7IC8vIG5vdyBpbiBzZXBhcmF0ZSBmaWxlXG5jb25zdCB7UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn09cmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcblxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKXtyZXR1cm4oc3RyPyhzdHIubGVuZ3RoP3N0clswXS50b1VwcGVyQ2FzZSgpK3N0ci5zbGljZSgxKTpcIlwiKTpcIj9cIik7fVxuXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpbmcgZW50ZXJpbmcgdGhlIGlkIG9mIHRoZSB1c2VyIG9uIHBhZ2Utc2V0dGluZ3MsIHNvIHdlIGRvIG5vdCBuZWVkIHRvIGluc2VydCBhIG5ldyBvbmVcbi8vICAgICAgICAgICAgICAgIGFsdGVybmF0aXZlbHkgd2UgY2FuIGRvIHRoYXQgb24gYSBzZXBhcmF0ZSBwYWdlIC8gcGFnZS1hdXRoIGlzIE9LXG4vLyAgICAgICAgICAgICAgICB3ZSBnbyB0byBwYWdlLWF1dGggd2hlbiBOT1QgcGxheWluZyB0aGUgZ2FtZSBpbiBkZW1vIG1vZGUhISFcbi8vICAgICAgICAgICAgICAgIGluIG5vbi1kZW1vIG1vZGUgeW91IGlkZW50aWZ5IHlvdXJzZWxmLCB0aGVuIHdoZW4gc2V0UGxheWVyTmFtZSBpcyBzdWNjZXNzZnVsIGdvIHRvIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuLy8gTURIQDEwSkFOMjAyMDogcmVtb3ZpbmcgcGFnZS1zZXR0aW5ncyBhbmQgcGFnZS1zZXR1cC1nYW1lLCBhZGRpbmcgcGFnZS1oZWxwXG5jb25zdCBQQUdFUz1bXCJwYWdlLXJ1bGVzXCIsXCJwYWdlLWhlbHBcIixcInBhZ2UtYXV0aFwiLFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIsXCJwYWdlLWJpZGRpbmdcIixcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIixcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiLFwicGFnZS1wbGF5LXJlcG9ydGluZ1wiLFwicGFnZS1wbGF5aW5nXCIsXCJwYWdlLWZpbmlzaGVkXCJdO1xuXG52YXIgY3VycmVudFBhZ2U9bnVsbDsgLy8gbGV0J3MgYXNzdW1lIHRvIGJlIHN0YXJ0aW5nIGF0IHBhZ2UtcnVsZXNcbnZhciB2aXNpdGVkUGFnZXM9W107IC8vIG5vIHBhZ2VzIHZpc2l0ZWQgeWV0XG5cbnZhciBjdXJyZW50UGxheWVyPW51bGw7IC8vIHRoZSBjdXJyZW50IGdhbWUgcGxheWVyXG5cbmZ1bmN0aW9uIHN0b3BQbGF5aW5nKCl7XG4gICAgLy8gQVNTRVJUIGFzc3VtaW5nIG5vdCBwbGF5aW5nIGluIGEgZ2FtZSBhbnltb3JlIGkuZS4gbmV3R2FtZSgpIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmVcbiAgICAvLyBhIE5PUk1BTCBleGl0XG4gICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLmV4aXQoJ1NUT1AnKTtcbiAgICAvLyAnbWFudWFsbHknIG1vdmUgdG8gdGhlIHByZXZpb3VzICdwYWdlJyBpbiB0aGUgaGlzdG9yeS4uLlxuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbn1cblxuLy8gTURIQDEwSkFOMjAyMDogbmV3R2FtZSgpIGlzIGEgYmlkIGRpZmZlcmVudCB0aGFuIGluIHRoZSBkZW1vIHZlcnNpb24gaW4gdGhhdCB3ZSByZXR1cm4gdG8gdGhlIHdhaXRpbmctcGFnZVxuZnVuY3Rpb24gbmV3R2FtZSgpe1xuICAgIC8vIGJ5IGNhbGwgcGxheXNUaGVHYW1lQXRJbmRleChudWxsLD8pIHdlIGZvcmNlIGNsZWFyaW5nIHRoZSBnYW1lIGluZm9ybWF0aW9uIGJlaW5nIHNob3duIGF0IHRoZSB3YWl0LWZvci1wbGF5ZXJzIHBhZ2VcbiAgICBpZighY3VycmVudFBsYXllcil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogTm8gcGxheWVyIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCFcIik7XG4gICAgICAgIHN0b3BQbGF5aW5nKCk7XG4gICAgfWVsc2VcbiAgICAgICAgY3VycmVudFBsYXllci5wbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsLTEpO1xufVxuXG52YXIgZm9yY2VGb2N1c0lkPW51bGw7XG5mdW5jdGlvbiBzdG9wRm9yY2VGb2N1cygpe2NsZWFySW50ZXJ2YWwoZm9yY2VGb2N1c0lkKTtmb3JjZUZvY3VzSWQ9bnVsbDt9XG5mdW5jdGlvbiBjaGVja0ZvY3VzKHN0YXRlKXtcbiAgICAvLyBNREhAMjNKQU4yMDIwOiB3ZSBzaG91bGQga2VlcCBibGlua2luZyB3aGVuIG5vdCBpbiBmb2N1cyB1bnRpbCBmb3JjZWQgdG8gc3RvcFxuICAgIC8vICAgICAgICAgICAgICAgIGluc3RlYWQgb2Ygc3RvcHBpbmcgd2hlbiB0aGUgZm9jdXMgd2FzIGdvdFxuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xuICAgIC8vIHJlcGxhY2luZzogaWYoZG9jdW1lbnQuaGFzRm9jdXMoKSl7c2hvd0dhbWVTdGF0ZShzdGF0ZSk7c3RvcEZvcmNlRm9jdXMoKTt9ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xufVxuZnVuY3Rpb24gZm9yY2VGb2N1cyhzdGF0ZSl7XG4gICAgc2hvd0dhbWVTdGF0ZShzdGF0ZSk7IC8vIGVpdGhlciB0byBzaG93IHN0YXRlIG9yIHJlbW92ZSB3aGF0J3MgY3VycmVudGx5IHNob3duXG4gICAgaWYoc3RhdGUpeyAvLyBmb2N1cyByZXF1ZXN0ZWRcbiAgICAgICAgLy8gc3RhcnQgZ2V0dGluZyB0aGUgZm9jdXMgYnkgYmxpbmtpbmcgJ3N0YXRlJyBJRkYgd2UgaGF2ZW4ndCBnb3QgaXQgeWV0Li4uXG4gICAgICAgIGlmKCFmb3JjZUZvY3VzSWQpZm9yY2VGb2N1c0lkPXNldEludGVydmFsKCgpPT57Y2hlY2tGb2N1cyhzdGF0ZSk7fSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIG9mIGNvdXJzZTogZnJvbSBzdGFja292ZXJmbG93ISEhXG5mdW5jdGlvbiBkaWZmZXJlbmNlKGExLGEyKXt2YXIgYTJTZXQ9bmV3IFNldChhMik7cmV0dXJuIGExLmZpbHRlcigoeCk9PiFhMlNldC5oYXMoeCkpO31cblxudmFyIGJpZGRlckNhcmRzRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1jYXJkc1wiKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKXtcbiAgICBsZXQgYnV0dG9uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJpZGRlciBzdWl0ZWNhcmRzIGJ1dHRvbiBjbGlja2VkIVwiKTtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7IC8vIGEgaGEsIGRpZG4ndCBrbm93IHRoaXNcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5zdHlsZS5kaXNwbGF5PSh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4vLyAgICAgdmFyIHYgPSBkb2N1bWVudC5jb29raWUubWF0Y2goJyhefDspID8nICsgbmFtZSArICc9KFteO10qKSg7fCQpJyk7XG4vLyAgICAgcmV0dXJuIHYgPyB2WzJdIDogbnVsbDtcbi8vIH1cbi8vIGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuLy8gICAgIHZhciBkID0gbmV3IERhdGU7XG4vLyAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMCpkYXlzKTtcbi8vICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiO3BhdGg9LztleHBpcmVzPVwiICsgZC50b0dNVFN0cmluZygpO1xuLy8gfVxuLy8gZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHsgc2V0Q29va2llKG5hbWUsICcnLCAtMSk7IH1cblxuLyoqXG4gKiBzaG93cyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBjYXJkcyBwbGF5ZWQgdGFibGUgYXMgd2VsbFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBiaWRzIHRhYmxlXG4gICAgc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKTtcbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBmb3IobGV0IHBsYXllck5hbWVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZVwiKSlcbiAgICAgICAgaWYocGxheWVyTmFtZUVsZW1lbnQpXG4gICAgICAgICAgICBwbGF5ZXJOYW1lRWxlbWVudC5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZCB0YWJsZVxuICogdG8gYmUgY2FsbGVkIHdpdGggZXZlcnkgbmV3IGdhbWVcbiAqL1xuZnVuY3Rpb24gY2xlYXJCaWRUYWJsZSgpe1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgYmlkVGFibGVSb3cgb2YgYmlkVGFibGUuY2hpbGRyZW4pXG4gICAgICAgIGZvcihsZXQgYmlkVGFibGVDb2x1bW4gb2YgYmlkVGFibGVSb3cuY2hpbGRyZW4pXG4gICAgICAgICAgICBiaWRUYWJsZUNvbHVtbi5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKCFlbGVtZW50KXtjb25zb2xlLmVycm9yKFwiTm8gZWxlbWVudCFcIik7cmV0dXJuO31cbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8vIE1ESEAyM0pBTjIwMjA6IHdoZW4gc2hvd2luZyB0aGUgcGxheWVyIG5hbWUgd2Ugc2V0IHRoZSBjb2xvciB0byBibGFjayAoanVzdCBpbiBjYXNlIGl0J3Mgbm90IGJsYWNrIGFueW1vcmUpXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIGVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO1xufVxuZnVuY3Rpb24gc2hvd1BsYXllclR5cGUoZWxlbWVudCxwbGF5ZXJUeXBlKXtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7XG4gICAgfVxufVxuXG4vLyBNREhAMjBKQU4yMDIwOiBrZWVwIHRoZSBpZHMgb2YgdGhlIHRyaWNrIHBsYXllZCBjYXJkcyBpbiBhIGNvbnN0YW50IGFycmF5XG5jb25zdCBQTEFZRURfQ0FSRF9JRFM9W1wiY3VycmVudC1wbGF5ZXItY2FyZFwiLFwibGVmdGhhbmRzaWRlLXBsYXllci1jYXJkXCIsXCJvcHBvc2l0ZS1wbGF5ZXItY2FyZFwiLFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiXTtcblxuLy8gdG8gYmUgY2FsbGVkIG9uIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50XG5mdW5jdGlvbiBjbGVhckNhcmRzUGxheWVkVGFibGUoKXtcbiAgICBmb3IobGV0IHBsYXllZENhcmRJbmRleCBpbiBQTEFZRURfQ0FSRF9JRFMpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFBMQVlFRF9DQVJEX0lEU1twbGF5ZWRDYXJkSW5kZXhdKS5pbm5lckhUTUw9XCJcIjtcbn1cblxuLyoqXG4gKiBzaG93cyB0aGUgZ2l2ZW4gdHJpY2tcbiAqIEBwYXJhbSB7Kn0gdHJpY2sgXG4gKi9cbmZ1bmN0aW9uIHNob3dUcmljayh0cmljay8qLHBsYXllckluZGV4Ki8pe1xuICAgIFxuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgXG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIFwiLHRyaWNrKTtcbiAgICBcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG5cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSB0cnVtcCBwbGF5ZXIgdGhhdCBpcyBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIChlaXRoZXIgbm9uLWJsaW5kIG9yIGJsaW5kKSBmbGFnIHRoZSBjaGVja2JveFxuICAgIGlmKHRyaWNrLmZpcnN0UGxheWVyPT09cGxheWVySW5kZXgmJnRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3gnKS5jaGVja2VkPXRydWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWJsaW5kJykuaW5uZXJIVE1MPSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwP1wiYmxpbmQgXCI6XCJcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcblxuICAgIC8vIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGluZm9cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT0odHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPT0wP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgLy9sZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stY2FyZHMtdGFibGVcIikucmVxdWVzdFNlbGVjdG9yKFwidGJvZHlcIik7XG5cbiAgICAvLyB0aGUgcGxheWVyIHR5cGUgY2FuIGNoYW5nZSBldmVyeSBjYXJkIGJlaW5nIHBsYXllZCAoYmFzZWQgb24gdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyKVxuICAgIC8vIFRPRE8gc2hvdWxkbid0IG5lZWQgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAgICAvLyBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSwtMik7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgXG4gICAgLy8gTk9URSB0aGUgZmlyc3QgY2FyZCBjb3VsZCBiZSB0aGUgYmxpbmQgY2FyZCBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgbm90IHNob3cgaXQhIVxuICAgIC8vICAgICAgYnV0IG9ubHkgdGhlIGNvbG9yIG9mIHRoZSBwYXJ0bmVyIHN1aXRlXG4gICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9KHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2suX2NhcmRzWzBdLnN1aXRlIT09dHJpY2sucGxheVN1aXRlKTtcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBzaG93IGFsbCB0aGUgdHJpY2sgY2FyZHMgcGxheWVkIGF0IHRoZSByaWdodCBwb3NpdGlvblxuICAgIGZvcihsZXQgdHJpY2tDYXJkSW5kZXg9MDt0cmlja0NhcmRJbmRleDw0O3RyaWNrQ2FyZEluZGV4Kyspe1xuICAgICAgICBsZXQgdHJpY2tDYXJkPSh0cmlja0NhcmRJbmRleDx0cmljay5udW1iZXJPZkNhcmRzP3RyaWNrLl9jYXJkc1t0cmlja0NhcmRJbmRleF06bnVsbCk7XG4gICAgICAgIGxldCB0cmlja0NhcmRQbGF5ZXJJbmRleD10cmljay5maXJzdFBsYXllcit0cmlja0NhcmRJbmRleDsgLy8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggaW4gdGhlIGdhbWVcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBvc2l0aW9uPSh0cmlja0NhcmRQbGF5ZXJJbmRleCs0LXBsYXllckluZGV4KSU0O1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIGNhcmQgcG9zaXRpb246IFwiK3RyaWNrQ2FyZFBvc2l0aW9uK1wiLlwiKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZElkPVBMQVlFRF9DQVJEX0lEU1t0cmlja0NhcmRQb3NpdGlvbl07XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQpe1xuICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD1mYWxzZTsgLy8gZG8gbm90IGRvIHRoaXMgZm9yIHRoZSBuZXh0IHBsYXllcnNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmljay5wbGF5U3VpdGUpOyAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIGNhcmQgI1wiK3RyaWNrQ2FyZEluZGV4LHRyaWNrQ2FyZCk7XG4gICAgICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2tDYXJkLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCx0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8xOi0xKTowKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIGxldCBwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9KGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ/KDQrdHJpY2suZmlyc3RQbGF5ZXItcGxheWVySW5kZXgpJTQ6MCk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0xKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMSklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzEpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsxKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0yKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMiklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzIpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsyKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0zKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMyklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzMpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCszKSU0KT8xOi0xKTowKSk7XG4gICAgKi9cbn1cblxuZnVuY3Rpb24gdXBkYXRlU3VpdGVDYXJkUm93cyhyb3dzLHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHN1aXRlIGNhcmQgcm93czogXCIrcm93cy5sZW5ndGgrXCIuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBsZXQgc3VpdGU9MDtcbiAgICBmb3IobGV0IHJvdyBvZiByb3dzKXtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjZWxscz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmQ9MDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IGNlbGwgb2YgY2VsbHMpe1xuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yOyAgXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBzdWl0ZUNhcmQrKztcbiAgICAgICAgfVxuICAgICAgICBzdWl0ZSsrO1xuICAgIH1cbn1cbi8vIGluIHRocmVlIGRpZmZlcmVudCBwYWdlcyB0aGUgcGxheWVyIGNhcmRzIHNob3VsZCBiZSBzaG93bi4uLlxuZnVuY3Rpb24gdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgZm9yIGJpZGRpbmcuXCIpO1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5cbi8qKlxuICogZm9yIHBsYXlpbmcgdGhlIGNhcmRzIGFyZSBzaG93biBpbiBidXR0b25zIGluc2lkZSB0YWJsZSBjZWxsc1xuICogQHBhcmFtIHsqfSBzdWl0ZUNhcmRzIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyB0byBjaG9vc2UgZnJvbS5cIik7XG4gICAgbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1zdWl0ZWNhcmRzLXRhYmxlXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgIGxldCByb3dzPXRhYmxlYm9keS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgIGxldCByb3c9cm93c1tzdWl0ZV07XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZUNhcmQ9MDtzdWl0ZUNhcmQ8Y29sdW1ucy5sZW5ndGg7c3VpdGVDYXJkKyspe1xuICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1lbHNlIC8vIGhpZGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVySW5kZXg9MDtcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGlmKCFkZWx0YVBvaW50c3x8IXBvaW50cyl7Y29uc29sZS5sb2coXCJFUlJPUjogUmVzdWx0cyBub3cga25vd24geWV0IVwiKTtyZXR1cm47fVxuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVySW5kZXhdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVySW5kZXhdKTtcbiAgICAgICAgcGxheWVySW5kZXgrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLl90cmljazsgLy8gTURIQDIwSkFOMjAyMCByZXBsYWNpbmc6IGdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGlmKCF0cmljayl7Y29uc29sZS5sb2coXCJFUlJPUjogTm8gdHJpY2sgdG8gdXBkYXRlIHRoZSB0cmlja3MgdGFibGUgd2l0aCFcIik7cmV0dXJuO31cbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKHBsYXllck5hbWVJbnB1dEVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYoIXBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWV8fHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWUubGVuZ3RoPT0wKVxuICAgICAgICAgICAgcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZT1wbGF5ZXJOYW1lc1twYXJzZUludChwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIpKV07XG4gICAgfVxufVxuXG4vLyBwbGF5aW5nIGZyb20gd2l0aGluIHRoZSBnYW1lXG5mdW5jdGlvbiBzaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGxldCBzaW5nbGVQbGF5ZXJOYW1lPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLW5hbWUnKS52YWx1ZS50cmltKCk7XG4gICAgaWYoc2luZ2xlUGxheWVyTmFtZS5sZW5ndGg+MClcbiAgICAgICAgc2V0UGxheWVyTmFtZShzaW5nbGVQbGF5ZXJOYW1lLChlcnIpPT57XG4gICAgICAgICAgICAvLyBNREhAMTBKQU4yMDIwOiBfc2V0UGxheWVyIHRha2VzIGNhcmUgb2Ygc3dpdGNoaW5nIHRvIHRoZSByaWdodCBpbml0aWFsIHBhZ2UhISFcbiAgICAgICAgICAgIGlmKGVycilzZXRJbmZvKGVycik7Ly8gZWxzZSBuZXh0UGFnZSgpO1xuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIGFsZXJ0KFwiR2VlZiBlZXJzdCBlZW4gKGdlbGRpZ2UpIG5hYW0gb3AhXCIpO1xufVxuXG4vKipcbiAqIHByZXBhcmVzIHRoZSBHVUkgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gZ2V0R2FtZUluZm8oKXtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVybWluaW5nIGdhbWUgaW5mby5cIik7XG4gICAgbGV0IGdhbWVJbmZvPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOyAvLyBubyBwbGF5ZXIsIG5vIGdhbWVcbiAgICBpZihyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgLy8gZ2V0IHRoZSBpbmZvIHdlIG5lZWQgdGhyb3VnaCB0aGUgUGxheWVyR2FtZSBpbnN0YW5jZSByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkZGVycz1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCk7IC8vIHRob3NlIGJpZGRpbmdcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZGRlcnM6IFwiK2hpZ2hlc3RCaWRkZXJzLmpvaW4oXCIsIFwiKStcIi5cIik7XG4gICAgICAgIGxldCBoaWdoZXN0QmlkPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIik7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0VHJ1bXBTdWl0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdFRydW1wIHN1aXRlOiBcIit0cnVtcFN1aXRlK1wiLlwiKTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBsZXQgcGFydG5lclJhbms9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAvLyBwbGF5aW5nIHdpdGggdHJ1bXAgaXMgZWFzaWVzdFxuICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXsgLy8gb25seSBhIHNpbmdsZSBoaWdoZXN0IGJpZGRlciEhIVxuICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcj1oaWdoZXN0QmlkZGVyc1swXTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyb2VsYVBsYXllck5hbWU9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPXRyb2VsYVBsYXllck5hbWUrXCIgaGVlZnQgdHJvZWxhLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHJpa2tlblRoZUdhbWUuZm91cnRoQWNlUGxheWVyKStcIiBpcyBtZWUuXCI7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9SSUt8fGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUil7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKStcIiByaWt0IGluIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCIsIGVuIHZyYWFndCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIG1lZS5cIjsgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgLy8gd2l0aG91dCBhIHBhcnRuZXJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHNwZWVsdCBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1t0cnVtcFN1aXRlXStcIiBtZXQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgYWxzIHRyb2VmLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXsgLy8gdGhlcmUncyBubyB0cnVtcCwgZXZlcnlvbmUgaXMgcGxheWluZyBmb3IgaGltL2hlcnNlbGZcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXM9W107XG4gICAgICAgICAgICBoaWdoZXN0QmlkZGVycy5mb3JFYWNoKChoaWdoZXN0QmlkZGVyKT0+e2hpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5wdXNoKHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKSk7fSk7XG4gICAgICAgICAgICBpZihoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPWhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5qb2luKFwiLCBcIikrKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MT9cIiBzcGVsZW4gXCI6XCIgc3BlZWx0IFwiKStQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIjtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgZ2FtZUluZm89XCJJZWRlcmVlbiBoZWVmdCBnZXBhc3QuIFdlIHNwZWxlbiBvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWchXCI7XG4gICAgICAgIH1cbiAgIH1cbiAgIHJldHVybiBnYW1lSW5mbztcbn1cblxuLy8gaG93IHRvIHBocmFzZSBhIGJpZCBkZXBlbmRzIG9uIHRoZSBiaWQsIGFuZCB3aG8gcGxheXMgaXRcbmZ1bmN0aW9uIGdldEJpZEluZm8oYmlkLGJpZGRlcil7XG4gICAgbGV0IGJldHRlcj0oYmlkPT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ORUdFTl9BTExFRU5fQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSfHxcbiAgICAgICAgYmlkPT09UGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVIpO1xuICAgIGlmKGJldHRlciliaWQtLTtcbiAgICBzd2l0Y2goYmlkKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QQVM6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBnZXBhc3QuXCI6XCJKZSBoZWJ0IGdlcGFzdC5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUklLOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgaGVlZnQgXCI6XCJKZSBoZWJ0IFwiKSsoYmV0dGVyP1wiYmV0ZXIgXCI6XCJcIikrXCIgZ2VyaWt0LlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgZWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU46XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWwgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHR3YWFsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBkZXJ0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUElDTzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBzbGVjaHRzIGVlbiBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX01JU0VSRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4gbWV0IG9wZW4ga2FhcnRlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgZWVuIHByYWF0amUgZW4gb3BlbiBrYWFydGVuLlwiO1xuICAgIH1cbiAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdFwiOlwiSmUgaGVidFwiKStcIiBlZW4gb25nZWxkaWcgYm9kIGdlZGFhbi5cIjtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQobnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSxoaWdoZXN0QmlkKXtcbiAgICBzd2l0Y2gobnVtYmVyT2ZUcmlja3NUb1dpbil7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBcIkdlZW5lZW5cIjtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIFwiUHJlY2llcyBlZW5cIjtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFwiWmVzIHNhbWVuIG1ldCBcIisocGFydG5lck5hbWU/cGFydG5lck5hbWU6XCJqZSBwYXJ0bmVyXCIpK1wiIG9tIGRlIHRlZ2Vuc3BlbGVycyBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgbGF0ZW4gdmVybGllemVuXCI7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBcIkFjaHQgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgXCIrKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQT9cInRyb2VsYVwiOlwicmlrXCIpK1wiIHRlIHdpbm5lblwiO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gXCJOZWdlbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiBcIlRpZW4gYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICByZXR1cm4gXCJFbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICByZXR1cm4gXCJUd2FhbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gXCJBbGxlbWFhbFwiO1xuICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXQgbWl0cyBuaWV0IGRlIGxhYXRzdGUgc2xhZyBvZiBlZW4gc2xhZyBtZXQgZGUgc2Nob3BwZW4gdnJvdXdcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXRcIjtcbn1cblxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgcGxheWVySW5kZXg9MDtwbGF5ZXJJbmRleDxyaWtrZW5UaGVHYW1lLm51bWJlck9mUGxheWVycztwbGF5ZXJJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpOyAvLyB3cml0ZSB0aGUgbmFtZSBvZiB0aGUgcGxheWVyXG4gICAgfVxufVxuLy8gTURIQDIxTk9WMjAyMDogdGhlIGdhbWUgd291bGQgY2FsbCB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgYSBiaWQgbWFkZSBpcyByZWNlaXZlZCEhIVxuZnVuY3Rpb24gdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgIGZvcihsZXQgcGxheWVyQmlkc0luZGV4PTA7cGxheWVyQmlkc0luZGV4PHBsYXllckJpZHNPYmplY3RzLmxlbmd0aDtwbGF5ZXJCaWRzSW5kZXgrKyl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXBsYXllckJpZHNPYmplY3RzW3BsYXllckJpZHNJbmRleF07XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLmdldFBsYXllckluZGV4KHBsYXllckJpZHNPYmplY3QubmFtZSk7XG4gICAgICAgIC8vIG9uIHRoZSBzYWZlIHNpZGUsIGdldCB0aGUgcGxheWVyIGluZGV4IGZyb20gdGhlIGdhbWUgcGFzc2luZyBpbiAgcGxheWVyIG5hbWVcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7YWxlcnQoXCJQbGF5ZXIgXCIrcGxheWVyQmlkc09iamVjdC5uYW1lK1wiIHVua25vd24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICAvLyBNREhAMjNKQU4yMDIwIHNob3dpbmcgdGhlIHBsYXllciBuYW1lcyBvbmNlOiBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgLy8gd3JpdGUgdGhlIGJpZHMgKHdlIGhhdmUgdG8gY2xlYXIgdGhlIHRhYmxlIHdpdGggZXZlcnkgbmV3IGdhbWUgdGhvdWdoKVxuICAgICAgICBwbGF5ZXJCaWRzT2JqZWN0LmJpZHMuZm9yRWFjaCgocGxheWVyQmlkLGJpZEluZGV4KT0+e3BsYXllckJpZHNSb3cuY2hpbGRyZW5bYmlkSW5kZXgrMV0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBiaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJdLmNoaWxkcmVuWzFdLmlubmVySFRNTD1wbGF5ZXJzQmlkc1tiaWRdLmpvaW4oXCIgXCIpO1xuICAgIH1cbn1cblxuY2xhc3MgT25saW5lUGxheWVyIGV4dGVuZHMgUGxheWVye1xuXG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gYXNrIHRoZSBnYW1lXG4gICAgICAgIHJldHVybih0aGlzLmluZGV4JiZ0aGlzLmdhbWU/dGhpcy5nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5pbmRleCk6MCk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGEgKHJlbW90ZSkgY2xpZW50IG5lZWRzIHRvIG92ZXJyaWRlIGFsbCBpdHMgYWN0aW9uc1xuICAgIC8vIEJVVCB3ZSBkbyBub3QgZG8gdGhhdCBiZWNhdXNlIGFsbCByZXN1bHRzIGdvIGludG8gUGxheWVyR2FtZVByb3h5IHdoaWNoIHdpbGwgc2VuZCB0aGUgYWxvbmchISEhXG5cbiAgICAvLyBtYWtlIGEgYmlkIGlzIGNhbGxlZCB3aXRoIFxuICAgIG1ha2VBQmlkKHBsYXllckJpZHNPYmplY3RzLHBvc3NpYmxlQmlkcyl7XG4gICAgICAgIC8vIGRlYnVnZ2VyXG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgLy8gcmVtb3ZlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBzZXRJbmZvKFwiRG9lIGVlbiBib2QuXCIpO1xuICAgICAgICBpZihjdXJyZW50UGFnZSE9XCJwYWdlLWJpZGRpbmdcIilzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpOyAvLyBKSVQgdG8gdGhlIHJpZ2h0IHBhZ2VcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBiaWRzIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBjb3VsZCBtYWtlOiBcIixwb3NzaWJsZUJpZHMpO1xuXG4gICAgICAgIC8vc2V0SW5mbyhcIk1hYWsgZWVuIGtldXplIHVpdCBlZW4gdmFuIGRlIG1vZ2VsaWprZSBiaWVkaW5nZW4uXCIpO1xuICAgICAgICAvLyBpdCdzIGFsd2F5cyB5b3UhISEhIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLmlubmVySFRNTD1cIlRvb24ga2FhcnRlblwiO1xuICAgICAgICBiaWRkZXJDYXJkc0VsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS52YWx1ZT10aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbihcIjxicj5cIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIGJpZGRlciBjYXJkcyBpbW1lZGlhdGVseVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgICAgICBpZigvKnBsYXltb2RlPT1QTEFZTU9ERV9ERU1PKi8wXmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpO1xuICAgICAgICAvKiBNREhAMTFKQU4yMDIwOiBtb3ZlZCBvdmVyIHRvIHdoZW4gdGhlIHBsYXllciBjYXJkcyBhcmUgcmVjZWl2ZWQhISFcbiAgICAgICAgLy8gTk9URSBiZWNhdXNlIGV2ZXJ5IHBsYXllciBnZXRzIGEgdHVybiB0byBiaWQsIHRoaXMuX3N1aXRlQ2FyZHMgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiB3ZSBhc2sgZm9yIHRydW1wL3BhcnRuZXIhISFcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7XG4gICAgICAgICovXG4gICAgICAgIC8vIG9ubHkgc2hvdyB0aGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKVxuICAgICAgICAgICAgYmlkQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHBvc3NpYmxlQmlkcy5pbmRleE9mKHBhcnNlSW50KGJpZEJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmlkJykpKT49MD9cImluaXRpYWxcIjpcIm5vbmVcIik7XG4gICAgICAgIC8vIHNob3cgdGhlIHBsYXllciBiaWRzIGluIHRoZSBib2R5IG9mIHRoZSBiaWRzIHRhYmxlXG4gICAgICAgIHVwZGF0ZUJpZHNUYWJsZShwbGF5ZXJCaWRzT2JqZWN0cyk7XG4gICAgfVxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHRydW1wIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS10cnVtcC1jaG9vc2luZ1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSB0cnVtcCBzdWl0ZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICB9XG4gICAgY2hvb3NlUGFydG5lclN1aXRlKHN1aXRlcyxwYXJ0bmVyUmFuayl7IC8vIHBhcnRuZXJSYW5rTmFtZSBjaGFuZ2VkIHRvIHBhcnRuZXJSYW5rIChiZWNhdXNlIExhbmd1YWdlIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBVSSBsZXZlbCBvbmx5ISlcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHBhcnRuZXIgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBiZWNhdXNlIHRoZSBzdWl0ZXMgaW4gdGhlIGJ1dHRvbiBhcnJheSBhcmUgMCwgMSwgMiwgMyBhbmQgc3VpdGVzIHdpbGwgY29udGFpblxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGFydG5lciByYW5rIChhY2Ugb3Iga2luZykgYmVpbmcgYXNrZWRcbiAgICAgICAgZm9yKGxldCByYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgIHJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXTtcbiAgICB9XG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSByZXBsYWNlZCB2ZXJzaW9uIGV4Y2VwdCB3ZSBub3cgd2FudCB0byByZWNlaXZlIHRoZSB0cmljayBpdHNlbGZcbiAgICBwbGF5QUNhcmQoKXtcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzO1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHRyaWNrPSh0aGlzLmdhbWU/dGhpcy5nYW1lLl90cmljazpudWxsKTtcbiAgICAgICAgaWYoIXRyaWNrKXthbGVydChcIkJVRzogTm8gY3VycmVudCB0cmljayB0byBwbGF5IGEgY2FyZCBpbiFcIik7cmV0dXJuO31cbiAgICAgICAgLy8gTURIQDE5SkFOMjAyMDogYWxsb3cgdGhlIGN1cnJlbnQgcGxheWVyIHRvIHBsYXkgYSBjYXJkIGJ5IGNsaWNraW5nIG9uZVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpO1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLnBsYXlTdWl0ZTwwKXthbGVydChcIkJVRzogUGxheSBzdWl0ZSBvZiBub24tZW1wdHkgdHJpY2sgdW5kZWZpbmVkIVwiKTtyZXR1cm47fVxuICAgICAgICBzZXRJbmZvKFwiU3BlZWwgZWVuIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiLlwiKTtcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG5ldyB0cmljayB1cGRhdGUgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGUgd2l0aCB0aGUgcHJldmlvdXMgdHJpY2tcbiAgICAgICAgLy8gaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgLyogc2VlIHNob3dUcmljaygpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FuLWFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQ/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLmNoZWNrZWQ9ZmFsc2U7IC8vIHdoZW4gY2xpY2tlZCBzaG91bGQgZ2VuZXJhdGUgXG4gICAgICAgICovXG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjAgbW92ZWQgb3ZlciB0byB3aGVyZSBHQU1FX0lORk8gZXZlbnQgaXMgcmVjZWl2ZWQhISEhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgLy8gb2Jzb2xldGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZC1wbGF5ZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cbiAgICAgICAgICAgICh0cmljay5wbGF5U3VpdGU+PTA/XCJTcGVlbCBlZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpK1wiIGJpai5cIjpcIktvbSBtYWFyIHVpdCFcIik7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbj10aGlzLmdldE51bWJlck9mVHJpY2tzV29uKCk7IC8vIGFsc28gaW5jbHVkZXMgdGhvc2Ugd29uIGJ5IHRoZSBwYXJ0bmVyIChhdXRvbWF0aWNhbGx5KVxuICAgICAgICAvLyBhZGQgdGhlIHRyaWNrcyB3b24gYnkgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAvLyBpZihwYXJ0bmVyKW51bWJlck9mVHJpY2tzV29uKz1wbGF5ZXIuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3Mtd29uLXNvLWZhclwiKS5pbm5lckhUTUw9U3RyaW5nKG51bWJlck9mVHJpY2tzV29uKSsocGFydG5lck5hbWU/XCIgKHNhbWVuIG1ldCBcIitwYXJ0bmVyTmFtZStcIilcIjpcIlwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3MtdG8td2luXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dCh0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZCgpKTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsOyAvLyBnZXQgcmlkIG9mIGFueSBjdXJyZW50bHkgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgIC8vIHNldEluZm8oXCJXZWxrZSBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIiB3aWwgamUgXCIrKHRyaWNrLm51bWJlck9mQ2FyZHM+MD9cImJpalwiOlwiXCIpK1wic3BlbGVuP1wiKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7IC8vIHJlbWVtYmVyIHRoZSBzdWl0ZSBjYXJkcyEhISFcbiAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIC8vLy8vIHNob3dUcmljayh0aGlzLl90cmljaz10cmljayk7IC8vIE1ESEAxMUpBTjIwMjA6IG5vIG5lZWQgdG8gcGFzcyB0aGUgcGxheWVyIGluZGV4IChhcyBpdCBpcyBhbHdheXMgdGhlIHNhbWUpXG4gICAgfVxuXG4gICAgLy8gbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggX2NhcmRQbGF5ZWQoKSBkZWZpbmVkIGluIHRoZSBiYXNlIGNsYXNzIFBsYXllciB3aGljaCBpbmZvcm1zIHRoZSBnYW1lXG4gICAgLy8gTk9URSBjYXJkUGxheWVkIGlzIGEgZ29vZCBwb2ludCBmb3IgY2hlY2tpbmcgdGhlIHZhbGlkaXR5IG9mIHRoZSBjYXJkIHBsYXllZFxuICAgIC8vIE5PVEUgY2FuJ3QgdXNlIF9jYXJkUGxheWVkIChzZWUgUGxheWVyIHN1cGVyY2xhc3MpXG4gICAgLy8gTURIQDIwSkFOMjAyMDogZGVjaWRpbmcgdG8gcmV0dXJuIHRydWUgb24gYWNjZXB0YW5jZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7XG4gICAgICAgIGxldCBjYXJkPShzdWl0ZTx0aGlzLl9zdWl0ZUNhcmRzLmxlbmd0aCYmdGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV0ubGVuZ3RoP3RoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdW2luZGV4XTpudWxsKTtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGxldCB0cmljaz10aGlzLmdhbWUuX3RyaWNrOyAvLyBNREhAMTlKQU4yMDIwOiBlYXNpZXN0IHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdHJpY2tcbiAgICAgICAgICAgIGlmKCF0cmljaylyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzbGFnIG9tIGVlbiBrYWFydCBpbiBiaWogdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wO1xuICAgICAgICAgICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl7IC8vIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZW9yZXRpY2FsbHkgdGhlIGNhcmQgY2FuIGJlIHBsYXllZCBidXQgaXQgbWlnaHQgYmUgdGhlIGNhcmQgd2l0aCB3aGljaCB0aGUgcGFydG5lciBjYXJkIGlzIGFza2VkISFcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGlzIGEgZ2FtZSB3aGVyZSB0aGVyZSdzIGEgcGFydG5lciBjYXJkIHRoYXQgaGFzbid0IGJlZW4gcGxheWVkIHlldFxuICAgICAgICAgICAgICAgIC8vIGFsdGVybmF0aXZlbHkgcHV0OiBzaG91bGQgdGhlcmUgYmUgYSBwYXJ0bmVyIGFuZCB0aGVyZSBpc24ndCBvbmUgeWV0Pz8/Pz9cbiAgICAgICAgICAgICAgICAvLyBCVUcgRklYOiBzdGlsbCB1c2luZyBnZXRUcnVtcFBsYXllcigpIGhlcmUgYWx0aG91Z2ggaXQgd2Fzbid0IGRlZmluZWQgYXQgYWxsIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgbm93IGNvcGllZCBvdmVyIGZyb20gUmlra2VuVGhlR2FtZS5qcyEhISAoYXMgaXQgaXMgY29tcHV0ZWQpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1aXRlPT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwIEJVRyBGSVg6IHdhcyB1c2luZyBhc2stcGFydG5lci1jYXJkLWJsaW5kIGluc3RlYWQgb2YgYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLmNoZWNrZWQmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWl0ZSE9dGhpcy5fZ2FtZS5nZXRUcnVtcFN1aXRlKCl8fGNvbmZpcm0oXCJXaWx0IFUgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCldK1wiIChibGluZCkgdnJhZ2VuIG1ldCBlZW4gdHJvZWY/XCIpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7IC8vIHllcywgYXNraW5nIGJsaW5kISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vL2FsZXJ0KFwiXFx0QkxJTkQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLyphbGVydChcIk5vdCBpbmRpY2F0ZWQhISEhXCIpKi87XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0cmljay5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzJiZzdWl0ZT09PUNhcmQuU1VJVEVfU1BBREUpeyAvLyBzcGFkZSBpcyBiZWluZyBwbGF5ZWQgYnkgdGhlIGZpcnN0IHBsYXllciB3aGVyZWFzIHRoYXQgaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShDYXJkLlNVSVRFX1NQQURFKTx0aGlzLm51bWJlck9mQ2FyZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoc3VpdGUhPT10cmljay5wbGF5U3VpdGUmJnRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZSh0cmljay5wbGF5U3VpdGUpPjApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPXBhcnRuZXJTdWl0ZXx8Y2FyZC5yYW5rIT1wYXJ0bmVyUmFuaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSmUga3VudCBcIitjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIG5pZXQgc3BlbGVuLCB3YW50IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgaXMgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMDogd2UgaGF2ZSB0byBhbHNvIHJldHVybiB3aGF0ZXZlciB0cmljayB2YWx1ZSB0aGF0IG1pZ2h0J3ZlIGNoYW5nZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdoaWNoIGluIHRoaXMgY2FzZSBjb3VsZCB3ZWwgYmUgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkICdmbGFnJ1xuICAgICAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogSSBzdWdnZXN0IGNoYW5naW5nIGFza2luZ0ZvclBhcnRuZXJDYXJkIHRvIGFza2luZ0ZvclBhcnRuZXJDYXJkPDAgaS5lLiBibGluZCByZXF1ZXN0ISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICB3ZSdyZSB0YWtpbmcgY2FyZSBvZiB0aGF0IHdoZW4gQ0FSRCBpcyBzZW50IChzbyBub3QgdG8gaW50ZXJmZXJlIHdpdGggUmlra2VuVGhlR2FtZS5qcyBpdHNlbGYpXG4gICAgICAgICAgICBsZXQgZXJyb3I9dGhpcy5fc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgIC8qIE1ESEAyN0pBTjIwMjA6IHJlbW92aW5nIHRoZSBmb2xsb3dpbmcgbWlnaHQgYmUgd3JvbmcgQlVUIGJ5IHBhc3NpbmcgYXNraW5nRm9yUGFydG5lckNhcmQgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsIHBsYXllcnMgaW5jbHVkaW5nIG15c2VsZiB3aWxsIHJlY2VpdmUgdGhlIGNhcmQgcGxheWVkIGFuZCB1cGRhdGUgYXNraW5nRm9yUGFydG5lckNhcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY29yZGluZ2x5LCBiYXNpY2FsbHkgYWRkQ2FyZCgpIHdpbGwgc2V0IGl0IHRvIDEgaWYgaXQgc28gZGV0ZWN0cywgYnV0IGNhbm5vdCBzZXQgaXQgdG8gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvIHRlY2huaWNhbGx5IGFza2luZ0ZvclBhcnRuZXJDYXJkIG9ubHkgbmVlZHMgdG8gYmUgc2VuZCB3aGVuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQgYmxpbmRcbiAgICAgICAgICAgIGlmKGVycm9yKXJldHVybiBuZXcgRXJyb3IoXCJFciBpcyBlZW4gZm91dCBvcGdldHJlZGVuIGJpaiBoZXQgdmVyc3R1cmVuIHZhbiBkZSBnZXNwZWVsZGUga2FhcnQuXCIpO1xuICAgICAgICAgICAgdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIk9uZ2VsZGlnZSBrYWFydCBrbGV1ciBcIitEVVRDSF9TVUlURV9OQU1FU1tzdWl0ZV0rXCIgZW4vb2Yga2FhcnQga2xldXIgcG9zaXRpZSAoXCIrU3RyaW5nKGluZGV4KStcIikuXCIpO1xuICAgIH1cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIGlmKCFnYW1lKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lLnN0YXRlIT09UGxheWVyR2FtZS5GSU5JU0hFRCl7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJQcm9ncmFtbWFmb3V0OiBIZXQgc3BlbCBrYW4gbmlldCB3b3JkZW4gdmVybGF0ZW4sIGFscyBoZXQgbmlldCBhZmdlbG9wZW4gaXMgKHRvZXN0YW5kOiBcIit0aGlzLl9nYW1lLnN0YXRlK1wiKS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUuZG9uZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZlcmxhdGVuIHZhbiBoZXQgc3BlbCBtaXNsdWt0ISBQcm9iZWVyIGhldCBub2cgZWVucy5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgc2VuZGluZyB0aGUgRE9ORSBldmVudCBzdWNjZWVkcyByZWFkeSBhZ2FpbiB0byBwbGF5IGluIGEgbmV4dCBnYW1lICh3aXRob3V0IGxlYXZpbmcgdGhlIGdhbWUgcGxheWluZylcbiAgICAgICAgICAgICAgICBzZXRQYWdlKFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCk7XG4gICAgfVxuICAgIC8vIGNhbGwgcmVuZGVyQ2FyZHMganVzdCBhZnRlciB0aGUgc2V0IG9mIGNhcmRzIGNoYW5nZVxuICAgIHJlbmRlckNhcmRzKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKiogUmVuZGVyaW5nIHBsYXllciBjYXJkcyFcIik7XG4gICAgICAgIHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpO1xuICAgICAgICAvLyBUT0RPIHByb2JhYmx5IGJlc3QgdG8gc2hvdyB0aGVtIG9uIEFMTCBwYWdlcyAobm8gbWF0dGVyIHdoaWNoIG9uZSBpcyBjdXJyZW50bHkgc2hvd2luZyEpXG4gICAgICAgIHVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIHVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgc3dpdGNoKGN1cnJlbnRQYWdlKXtcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLWJpZGRpbmdcIjp1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgb25seSBvbmNlXG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wbGF5aW5nXCI6dXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IGFmdGVyIHBsYXlpbmcgYSBjYXJkISFcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXRydW1wLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgfVxuICAgIC8vIGV4aXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIGEgcGxheWVyIHN0b3BzIHBsYXlpbmdcbiAgICAvLyBlaXRoZXIgYnkgZXhwbGljaXRseSB1c2luZyB0aGUgc3RvcCBidXR0b24ocykgb3IgbGVhdmluZy9jbG9zaW5nIHRoZSBwYWdlXG4gICAgLy8gVE9ETyBzaG91bGQgd2UgbnVsbCB0aGUgZ2FtZT8/Pz8/Pz8/XG4gICAgZXhpdChyZWFzb24pe1xuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIHRoaXMuX2dhbWUuZXhpdChyZWFzb24pO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZT1udWxsOyAvLyBUT0RPIG9yIGFueSBvdGhlciB3YXkgdG8gaW5kaWNhdGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcGxheWVyIHN0b3BwZWQgcGxheWluZ1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBidXR0b24gY2xpY2sgZXZlbnQgaGFuZGxlcnNcbi8qKlxuICogY2xpY2tpbmcgYSBiaWQgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIGJpZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIGJpZEJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIGxldCBiaWQ9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpZFwiKSk7XG4gICAgY29uc29sZS5sb2coXCJCaWQgY2hvc2VuOiBcIixiaWQpO1xuICAgIGxldCBlcnJvcj1jdXJyZW50UGxheWVyLl9zZXRCaWQoYmlkKTsgLy8gdGhlIHZhbHVlIG9mIHRoZSBidXR0b24gaXMgdGhlIG1hZGUgYmlkXG4gICAgaWYoIWVycm9yKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICBlbHNlXG4gICAgICAgIGFsZXJ0KGVycm9yLm1lc3NhZ2UpO1xufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIit0cnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK3BhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIC8vIGdvIGRpcmVjdGx5IHRvIHRoZSBnYW1lIChpbnN0ZWFkIG9mIHRocm91Z2ggdGhlIHBsYXllcilcbiAgICBjdXJyZW50UGxheWVyLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbn1cblxudmFyIHBsYXlhYmxlY2FyZENlbGwscGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBwbGF5YWJsZWNhcmRDZWxsPWV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGNhcmRTdWl0ZT1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpO1xuICAgIGxldCBjYXJkUmFuaz1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaW5kZXhcIikpO1xuICAgIC8vLy8vLy8vaWYocGxheWFibGVjYXJkQ2VsbC5zdHlsZS5ib3JkZXI9XCIwcHhcIilyZXR1cm47IC8vIGVtcHR5ICd1bmNsaWNrYWJsZScgY2VsbFxuICAgIGxldCBlcnJvcj1jdXJyZW50UGxheWVyLl9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoY2FyZFN1aXRlLGNhcmRSYW5rKTtcbiAgICBpZighZXJyb3IpeyAvLyBjYXJkIGFjY2VwdGVkISEhXG4gICAgICAgIGZvcmNlRm9jdXMobnVsbCk7IC8vIGdldCByaWQgb2YgdGhlIGZvY3VzIHJlcXVlc3RcbiAgICAgICAgdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhmYWxzZSk7IC8vIGRpc2FibGUgdGhlIGNhcmQgYnV0dG9uc1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IHZlcnpvbmRlbiBuYWFyIGRlIHNwZWwgc2VydmVyXCI7IC8vIE1ESEAyM0pBTjIwMjA6IGdldCByaWQgb2YgdGhlIHBsYXkgY2FyZCBwcm9tcHQhXG4gICAgICAgIHBsYXlhYmxlY2FyZENlbGxDb250ZW50cz1wbGF5YWJsZWNhcmRDZWxsLmlubmVySFRNTDsgLy8gaW4gY2FzZSBzZW5kaW5nIHRoZSBjYXJkIGZhaWxzXG4gICAgICAgIHBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgfWVsc2UgLy8gcmVwb3J0IHRoZSBlcnJvciB0byB0aGUgZW5kIHVzZXJcbiAgICAgICAgYWxlcnQoZXJyb3IubWVzc2FnZSk7XG59XG5cbi8qKlxuICogY29udmVuaWVudCB0byBiZSBhYmxlIHRvIHR1cm4gdGhlIHBsYXlhYmxlIGNhcmQgYnV0dG9ucyBvbiBhbmQgb2ZmIGF0IHRoZSByaWdodCBtb21lbnRcbiAqIEBwYXJhbSB7ZW5hYmxlfSBlbmFibGUgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnMoZW5hYmxlKXtcbiAgICAvLyBjbGlja2luZyBjYXJkICdidXR0b25zJyAobm93IGNlbGxzIGluIHRhYmxlKSwgd2UgY2FuIGdldCByaWQgb2YgdGhlIGJ1dHRvbiBpdHNlbGYhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZT9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklERElORzpcbiAgICAgICAgICAgIC8vIHdoZW4gbW92aW5nIGZyb20gdGhlIERFQUxJTkcgc3RhdGUgdG8gdGhlIEJJRERJTkcgc3RhdGUgY2xlYXIgdGhlIGJpZCB0YWJsZVxuICAgICAgICAgICAgLy8gQUxURVJOQVRJVkVMWSB0aGlzIGNvdWxkIGJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBlbmRzXG4gICAgICAgICAgICAvLyBCVVQgdGhpcyBpcyBhIGJpdCBzYWZlciEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBiaWVkZW4gaXMgYmVnb25uZW4hXCIpO1xuICAgICAgICAgICAgaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKWNsZWFyQmlkVGFibGUoKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7IC8vIGFsbG93aW5nIHRoZSB1c2VyIHRvIGNsXG4gICAgICAgICAgICAvKiBNREhAMTlKQU4yMDIwOiBpbiBkdWUgY291cnNlIHdlIHdpbGwgYmUgcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyB0d28gbGluZXNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIGluaXRpYXRlLXBsYXlpbmcgd2lsbCByZXBvcnQgb24gdGhlIGdhbWUgdGhhdCBpcyB0byBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkZJTklTSEVEOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsIGlzIGFmZ2Vsb3BlbiFcIik7XG4gICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTtcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZS5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQrPTE7IC8vIFFVSUNLIEZJWCB0byBnZXQgdG8gc2VlIHRoZSBsYXN0IHRyaWNrIGF0IHRoZSByaWdodCBwb3NpdGlvbiEhISEhXG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJEZSByZWdlbHMgdmFuIGhldCBvbmxpbmUgc3BlbC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dXAtZ2FtZVwiOiAvLyB3aGVuIHBsYXlpbmcgaW4gZGVtbyBtb2RlLCB0aGUgdXNlciBzaG91bGQgZW50ZXIgZm91ciBwbGF5ZXIgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RGVmYXVsdFBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZ1bCBkZSBuYW1lbiB2YW4gZGUgc3BlbGVycyBpbi4gRWVuIHNwZWxlcm5hYW0gaXMgdm9sZG9lbmRlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYXV0aFwiOiAvLyBwYWdlLWF1dGhcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJHZWVmIGRlIG5hYW0gb3Agd2Fhcm9uZGVyIFUgd2lsdCBzcGVsZW4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3YWl0LWZvci1wbGF5ZXJzXCI6IC8vIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkV2ZW4gZ2VkdWxkIGF1Yi4gV2Ugd2FjaHRlbiB0b3QgZXIgZ2Vub2VnIG1lZGVzcGVsZXJzIHppam4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiaWRkaW5nXCI6IC8vIHBhZ2UtYmlkZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIldhY2h0IG9tIGRlIGJldXJ0IG9wIGVlbiB2ZXJ6b2VrIHRvdCBoZXQgZG9lbiB2YW4gZWVuIGJvZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXktcmVwb3J0aW5nXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXlpbmdcIjogLy8gPz8/P1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG8gZXZlcnl0aGluZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyBzdGFydGluZyB0aGUgZ2FtZSBwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgMVwiOyAvLyBqdXN0IGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyBqdXN0IGluIGNhc2UhIVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvcCBoZXQgdmVyem9layB0b3QgaGV0IG9wZ2V2ZW4gdmFuIGRlIHRyb2Vma2xldXIgZW4vb2YgZGUgbWVlIHRlIHZyYWdlbiBhYXMvaGVlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiSGV0IHNwZWxlbiBiZWdpbnQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgYWxlcnQoXCJCVUc6IFVua25vd24gcGFnZSAnXCIrX3BhZ2UrXCInIHJlcXVlc3RlZCFcIik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBuZXh0UGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIG5leHQgcGFnZSFcIik7XG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICAvLyBNREhAMDdKQU4yMDIwOiBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIG5leHQgcGFnZSwgd2hlbiBub3QgcnVubmluZyBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIHBhZ2UtYXV0aCBwYWdlXG4gICAgLy8gICAgICAgICAgICAgICAgaW4gZGVtbyBtb2RlIHNraXAgdGhlIGF1dGggYW5kIHdhaXQgZm9yIHBsYXllcnMgYnV0dG9uXG4gICAgc3dpdGNoKHBhZ2VJbmRleCl7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWF1dGhcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOiAvLyBzaG91bGQgd2UgY2hlY2sgdGhlIHVzZXIgbmFtZXM/Pz8/Pz9cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCsxKSVQQUdFUy5sZW5ndGhdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbmNlbFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBwcmV2aW91cyBwYWdlLlwiKTtcbiAgICAvLyBnbyBvbmUgcGFnZSBiYWNrXG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrUEFHRVMubGVuZ3RoLTEpJVBBR0VTLmxlbmd0aF0pO1xufVxuZnVuY3Rpb24gcmV0dXJuVG9QcmV2aW91c1BhZ2UoKXtcbiAgICAvLyBwb3Agb2ZmIHRoZSBwYWdlIHdlIGFyZSBnb2luZyB0byB2aXNpdCwgcHJldmVudGluZyB0byBwdXNoIHRoZSBjdXJyZW50UGFnZSBhZ2FpblxuICAgIGlmKHZpc2l0ZWRQYWdlcy5sZW5ndGg+MCl7Y3VycmVudFBhZ2U9bnVsbDtzZXRQYWdlKHZpc2l0ZWRQYWdlcy5zaGlmdCgpKTt9XG59XG5mdW5jdGlvbiBzaG93SGVscCgpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgaGVscCFcIik7XG4gICAgc2V0UGFnZSgncGFnZS1ydWxlcycpO1xufVxuLy8gYXNjZXJ0YWluIHRvIGRpc2FibGUgdGhlIEhlbHAgYnV0dG9uIHdoZW4gdmlld2luZyBpdCEhIVxuZnVuY3Rpb24gdXBkYXRlSGVscEJ1dHRvbnMoKXtcbiAgICBsZXQgZW5hYmxlSGVscEJ1dHRvbj0oY3VycmVudFBhZ2UhPT0ncGFnZS1oZWxwJyk7XG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLmRpc2FibGVkPSFlbmFibGVIZWxwQnV0dG9uO1xufVxuXG4vKipcbiAqIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBuZXctcGxheWVycyBidXR0b24gaXMgY2xpY2tlZCwgdG8gc3RhcnQgYSBuZXcgZ2FtZSB3aXRoIGEgbmV3IHNldCBvZiBwbGF5ZXJzXG4gKi9cbmZ1bmN0aW9uIG5ld1BsYXllcnMoKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBOaWV1d2Ugc3BlbGVycyBhYW5tYWtlbi5cIik7XG4gICAgcGxheWVycz1bXTtcbiAgICBsZXQgbm9QbGF5ZXJOYW1lcz10cnVlO1xuICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgcGxheWVyIGlucHV0IGZpZWxkc1xuICAgIGZvcihwbGF5ZXJOYW1lSW5wdXQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYocGxheWVyTmFtZUlucHV0LnZhbHVlLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIG5vUGxheWVyTmFtZXM9ZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lSW5wdXQudmFsdWUpKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYocGxheWVycy5sZW5ndGg8NClcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChudWxsKTtcbiAgICB9XG4gICAgaWYobm9QbGF5ZXJOYW1lcyl7XG4gICAgICAgIHBsYXllcnM9bnVsbDtcbiAgICAgICAgc2V0SW5mbyhcIkdlZW4gc3BlbGVybmFtZW4gb3BnZWdldmVuLiBIZWIgdGVubWluc3RlIGVlbiBzcGVsZXJuYWFtIG5vZGlnIVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlJpa2tlbiAtIGhldCBzcGVsOiBOaWV1d2Ugc3BlbGVycyBhYW5nZW1hYWt0IVwiKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsR2FtZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsvL2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIkdlZW4gc3BlbCFcIik7XG4gICAgaWYoIXJpa2tlblRoZUdhbWUpe1xuICAgICAgICBhbGVydChcIkdlZW4gc3BlbCBvbSBhZiB0ZSBicmVrZW4hIExhYWQgZGV6ZSB3ZWIgcGFnaW5hIG9wbmlldXchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGNvbmZpcm0oXCJXaWx0IFUgZWNodCBoZXQgaHVpZGlnZSBzcGVsIGFmYnJla2VuP1wiKSl7XG4gICAgICAgIHJpa2tlblRoZUdhbWUuY2FuY2VsKCk7XG4gICAgfVxufVxuLyogXG5mdW5jdGlvbiBuZXdUcmlja0J1dHRvbkNsaWNrZWQoKXtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgICghcmlra2VuVGhlR2FtZXx8cmlra2VuVGhlR2FtZS5zaG93TmV3VHJpY2tJbmZvKCkpO1xufVxuKi9cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGl0aW9uYWwgc3R1ZmYgdGhhdCB3ZSdyZSBnb2luZyB0byBuZWVkIHRvIG1ha2UgdGhpcyBzdHVmZiB3b3JrXG5jbGFzcyBQbGF5ZXJHYW1lUHJveHkgZXh0ZW5kcyBQbGF5ZXJHYW1lIHtcblxuICAgIC8vIGdldFNlbmRFdmVudChldmVudCxkYXRhKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKStcIi5cIik7XG4gICAgLy8gICAgIHJldHVybiBbZXZlbnQsZGF0YV07XG4gICAgLy8gfVxuXG4gICAgLy8gTURIQDIzSkFOMjAyMDogY2FsbGVkIGZyb20gdXBkYXRlQmlkc1RhYmxlXG4gICAgZ2V0UGxheWVySW5kZXgocGxheWVyTmFtZSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD0odGhpcy5fcGxheWVyTmFtZXM/dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoOjApO1xuICAgICAgICB3aGlsZSgtLXBsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF0hPT1wbGF5ZXJOYW1lKTtcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7Y29uc29sZS5sb2coXCJQbGF5ZXIgbmFtZSAnXCIrcGxheWVyTmFtZStcIicgbm90IGZvdW5kIGluIFwiK0pTT04uc3RyaW5naWZ5KHRoaXMuX3BsYXllck5hbWVzKStcIi5cIik7fVxuICAgICAgICByZXR1cm4gcGxheWVySW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0IG51bWJlck9mUGxheWVycygpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg7fVxuXG4gICAgLy8gTURIQDI2SkFOMjAyMDogbmVlZGVkIHRoaXMgYXMgd2VsbCB0byBkZXRlcm1pbmUgdGhlIHRydW1wIHBsYXllciAodXNpbmcgYmlkZGVycyBzdGVhZCBvZiBiaWRQbGF5ZXJzIGhlcmUpXG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXtcbiAgICAgICAgLy8gb25seSB3aGVuIHBsYXlpbmcgYSAncmlrJyBnYW1lICh3aXRoIHRydW1wLCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXIsIGJ1dCBub3QgdHJvZWxhLCB3ZSBoYXZlIGEgdHJ1bXAgcGxheWVyKVxuICAgICAgICBpZih0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLJiZ0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXJldHVybiAtMTtcbiAgICAgICAgaWYoIXRoaXMuX2hpZ2hlc3RCaWRkZXJzfHx0aGlzLl9oaWdoZXN0QmlkZGVycy5sZW5ndGg9PTApcmV0dXJuIC0xO1xuICAgICAgICByZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnNbMF07XG4gICAgfVxuXG4gICAgLy8gTURIQDI1SkFOMjAyMDogZ2FtZSBjYW5ub3QgY29udGludWUgdW50aWwgc3VjY2VlZGluZyBpbiBnZXR0aW5nIHRoZSBhY3Rpb24gb3ZlciB0byB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICAvLyAgICAgICAgICAgICAgICB0byBndWFyYW50ZWUgZGVsaXZlcnkgd2UgcnVuIGEgcmVzZW5kIHRpbWVyIHRoYXQgd2lsbCBjb250aW51ZSBzZW5kaW5nIHVudGlsIHRoZSBjYWxsYmFjayBnZXRzIGNhbGxlZFxuICAgIC8vIF9ldmVudFNlbnQgd2lsbCBnZXQgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IHdhcyByZWNlaXZlZCBieSB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICBfc2VudEV2ZW50UmVjZWl2ZWQoKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKXtjbGVhckludGVydmFsKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCk7dGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPW51bGw7fVxuICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdK1wiIHJlY2VpdmVkIGJ5IGdhbWUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmQ9bnVsbDtcbiAgICAgICAgdGhpcy5fZXZlbnRTZW50Q2FsbGJhY2soKTtcbiAgICB9XG4gICAgX3NlbmRFdmVudCgpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCh0aGlzLl9ldmVudFRvU2VuZFswXSx0aGlzLl9ldmVudFRvU2VuZFsxXSx0aGlzLl9zZW50RXZlbnRSZWNlaXZlZCk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudFRvU2VuZFsyXSsrO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkrXCIgc2VudCAoYXR0ZW1wdDogXCIrdGhpcy5fZXZlbnRUb1NlbmRbMl0rXCIpLlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogRmFpbGVkIHRvIHNlbmQgZXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rXCIgdG8gdGhlIGdhbWUgc2VydmVyIChyZWFzb246IFwiK2Vycm9yLm1lc3NhZ2UrXCIpLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9zZXRFdmVudFRvU2VuZChldmVudCxkYXRhLGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5fZXZlbnRTZW50Q2FsbGJhY2s9Y2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPVtldmVudCxkYXRhLDBdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSBzZW5kIGV2ZW50IGNvdW50XG4gICAgICAgIGlmKCF0aGlzLl9zZW5kRXZlbnQoKSlyZXR1cm4gZmFsc2U7IC8vIHVzZXIgbXVzdCBtYWtlIHRoZWlyIGNob2ljZSBhZ2FpblxuICAgICAgICAvLyBzY2hlZHVsZSBuZXh0IHJlc2VuZHNcbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPXNldEludGVydmFsKHRoaXMuX3NlbmRFdmVudCw1MDAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gd2hhdCB0aGUgcGxheWVyIHdpbGwgYmUgY2FsbGluZyB3aGVuIChzKWhlIG1hZGUgYSBiaWQsIHBsYXllZCBhIGNhcmQsIGNob29zZSB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlXG4gICAgYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdCSUQnLGJpZCxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgbm93Pz8/XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICB9XG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UncmUgc2VuZGluZyB0aGUgZXhhY3QgY2FyZCBvdmVyIHRoYXQgd2FzIHBsYXllZCAoYW5kIGFjY2VwdGVkIGF0IHRoaXMgZW5kIGFzIGl0IHNob3VsZCBJIGd1ZXNzKVxuICAgIC8vIE1ESEAxNEpBTjIwMjA6IHBhc3NpbmcgaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkICdmbGFnJyBhcyB3ZWxsISEhIVxuICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2Ugd2UncmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBSaWtrZW5UaGVHYW1lIGltcGxlbWVudGF0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQgZG9lc24ndCBlbmQgdXAgaW4gdGhlIGxvY2FsIFJpa2tlblRoZUdhbWUgdHJpY2tcbiAgICAvLyBNREhAMjdKQU4yMDIwOiB3ZSdyZSByZWNlaXZpbmcgdHJ1ZSBmb3IgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCB3aGVuIHRoZSBwbGF5ZXIgaXMgZG9pbmcgc29cbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogZGlzYWJsZSB0aGUgYnV0dG9ucyBvbmNlIHRoZSBjYXJkIGlzIGFjY2VwdGVkICh0byBiZSBwbGF5ZWQhISEpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIFRPRE8gcGVyaGFwcyBoaWRpbmcgdGhlIGNhcmRzIHNob3VsZCBhbHNvIGJlIGRvbmUgaGVyZSEhIVxuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgICovXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBjYXJkIHBsYXllZDogXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICAvLyB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogd2Ugc2VuZCB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgZmxhZyBhbG9uZyBldmVyeSB0aW1lIGFsdGhvdWdoIGl0IHdpbGwgYmUgaWdub3JlZFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBvbiBhbnkgdHJpY2sgY2FyZCBleGNlcHQgdGhlIGZpcnN0IGNhcmQgcGxheWVkLCBhbmQgbm9uLW5lZ2F0aXZlIHZhbHVlcyBhcmUgaWdub3JlZCBhcyB3ZWxsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG9ubHkgdGhpbmcgdGhhdCB0aGUgb3RoZXIgc2lkZSBjYW5ub3QgZGV0ZXJtaW5lIGlzIHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZCEhISFcbiAgICAgICAgbGV0IGNhcmRQbGF5ZWRJbmZvPVtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF07XG4gICAgICAgIC8vIHJlcGxhY2luZzogaWYoYXNraW5nRm9yUGFydG5lckNhcmQ8MCljYXJkUGxheWVkSW5mby5wdXNoKHRydWUpOyAvLyBzZXQgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGJsaW5kIGZsYWchISFcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdDQVJEJyxjYXJkUGxheWVkSW5mbyxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiO1xuICAgICAgICAgICAgICAgICAgICBwbGF5YWJsYWNhcmRDZWxsLmlubmVySFRNTD1wbGF5YWJsZWNhcmRDZWxsQ29udGVudHM7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gd2hhdCB0byBkbyBub3c/XG4gICAgICAgICAgICAgICAgfWVsc2V7IC8vIGNhcmQgcGxheWVkIGFjY2VwdGVkISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgZ2VhY2NlcHRlZXJkLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHRyb2Vma2xldXIgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gcGFydG5lciBrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZCFcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIC8vIHJlcGxhY2luZzogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6cGFydG5lclN1aXRlfSkpO1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiB3aGVuIHRoZSB1c2VyIGZpbmlzaGVkIHJlYWRpbmcgdGhlIHJlc3VsdHMsIGFuZCB3YW50cyB0byBjb250aW51ZSBwbGF5aW5nIGRvbmUoKSBzaG91bGQgYmUgY2FsbGVkXG4gICAgZG9uZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0RPTkUnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRPTkUgZXZlbnQgYWNrbm93bGVkZ2VkLlwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4aXQocmVhc29uKXtcbiAgICAgICAgLy8gcGxheWVyIGlzIGV4aXRpbmcgc29tZWhvdy4uLlxuICAgICAgICBsZXQgZGF0YT0ocmVhc29uP3JlYXNvbjooY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6XCJcIikpO1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0VYSVQnLGRhdGEsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVhJVCBldmVudCBcIitkYXRhK1wiIGFja25vd2xlZGdlZCFcIik7XG4gICAgICAgICAgICAvLyB3ZSdyZSBOT1QgZ29pbmcgYW55d2hlcmUgYW55bW9yZTogc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShuZXdzdGF0ZSl7XG4gICAgICAgIGxldCBvbGRzdGF0ZT10aGlzLl9zdGF0ZTtcbiAgICAgICAgdGhpcy5fc3RhdGU9bmV3c3RhdGU7XG4gICAgICAgIC8vIGRvIHN0dWZmIChjaGFuZ2UgdG8gYW5vdGhlciBwYWdlKVxuICAgICAgICBfZ2FtZVN0YXRlQ2hhbmdlZChvbGRzdGF0ZSx0aGlzLl9zdGF0ZSk7XG4gICAgfVxuXG4gICAgbG9nRXZlbnQoZXZlbnQsZGF0YSl7XG4gICAgICAgIHRoaXMuX2V2ZW50c1JlY2VpdmVkLnB1c2goe2V2ZW50OmV2ZW50LGRhdGE6ZGF0YX0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBSZWNlaXZlZCBldmVudCBcIitldmVudCtcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICAvLyBUT0RPIGhhdmUgdG8gY2hhbmdlIHRoaXMgdG8gaW5jbHVkZSB0aGUgZnJpZW5kbHkgZmxhZyBhcyB3ZWxsISEhIVxuICAgIGdldFBsYXllck5hbWUocGxheWVySW5kZXgpe1xuICAgICAgICByZXR1cm4odGhpcy5fcGxheWVyTmFtZXMmJnBsYXllckluZGV4Pj0wJiZwbGF5ZXJJbmRleDx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg/dGhpcy5fcGxheWVyTmFtZXNbcGxheWVySW5kZXhdOm51bGwpO1xuICAgIH1cbiAgICBcbiAgICBnZXRQbGF5ZXJOYW1lcygpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lczt9IC8vIG92ZXJyaWRpbmcgZ2V0UGxheWVyTmFtZXMoKSBvZiB0aGUgZGVtbyB2ZXJzaW9uISFcbiAgICBcbiAgICBzZXQgcGxheWVyTmFtZXMocGxheWVyTmFtZXMpe1xuXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPXBsYXllck5hbWVzO1xuXG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PSghdGhpcy5fcGxheWVyTmFtZXN8fHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aDw0Py0xOnRoaXMuX3BsYXllck5hbWVzLmluZGV4T2YoY3VycmVudFBsYXllci5uYW1lKSk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9dGhpcy5fcGxheWVySW5kZXg7XG4gICAgICAgIGlmKHRoaXMuX3BsYXllckluZGV4Pj0wKXtcbiAgICAgICAgICAgIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgc2hvd1BsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAvLyB3ZSBvbmx5IG5lZWQgdG8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBvbiBwYWdlLXBsYXlpbmcgT05DRSBhcyBpdCB3aWxsIGFsd2F5cyBzdGF5IHRoZSBzYW1lXG4gICAgICAgICAgICBzaG93Q3VycmVudFBsYXllck5hbWUoKTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2luZzogc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbmFtZVwiKSx0aGlzLmdldFBsYXllck5hbWUodGhpcy5fcGxheWVySW5kZXgpLC0yKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBDdXJyZW50IHBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBub3QgZm91bmQuXCIpO1xuICAgICAgICAgICAgaWYodGhpcy5fcGxheWVyTmFtZXMpXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcm5zdGlnZSBwcm9ncmFtbWFmb3V0OiBVdyBuYWFtIGtvbXQgbmlldCB2b29yIGluIGRlIHNwZWxlcmxpanN0IHZhbiBoZXQgdGUgc3BlbGVuIHNwZWwhXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXJJbmRleCl7XG4gICAgICAgIHJldHVybihwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fbnVtYmVyT2ZUcmlja3NXb24ubGVuZ3RoP3RoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllckluZGV4XTowKTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB3aWxsIGJlIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50IHdoZW4gYSBuZXcgdHJpY2sgc3RhcnRzXG4gICAgLy8gTURIQDIySkFOMjAyMDogdXNlciB3aWxsIGhhdmUgdG8gY2xpY2sgdGhlIG5ldyB0cmljayBidXR0b24gc28gdGhleSBjYW4gbG9vayBhdCB0aGUgb2xkIHRyaWNrIGZpcnN0XG4gICAgbmV3VHJpY2sodHJpY2tJbmZvKXtcbiAgICAgICAgXG4gICAgICAgIC8vIEFTU0VSVCBvbmx5IGNhbGwgd2hlbiB0cmlja0luZm8gaXMgbm90IE5VTEwhISEhIVxuICAgICAgICBpZighdHJpY2tJbmZvKXthbGVydChcIkJVRzogTm8gdHJpY2sgaW5mbyFcIik7cmV0dXJuO31cblxuICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8gcmVtb3ZlIHRoZSBjYXJkcyBzaG93aW5nIGZyb20gdGhlIHByZXZpb3VzIHRyaWNrXG5cbiAgICAgICAgLy8gc2hvdyB0aGUgaWQgb2YgdGhlIHRyaWNrICh3aGljaCBpcyB0aGUgdHJpY2sgaW5kZXgpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiU2xhZyBcIit0cmlja0luZm8uaW5kZXg7XG5cbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ9dHJpY2tJbmZvLmluZGV4LTE7XG5cbiAgICAgICAgaWYodGhpcy5fdHJpY2spdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7IC8vIHNob3cgdGhlIGZpbmlzaGVkIHRyaWNrIGluIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG5cbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IHRyaWNrIHdpdGggdGhlIGluZm9ybWF0aW9uIGluIHRoZSB0cmljayBpbmZvXG4gICAgICAgIHRoaXMuX3RyaWNrPW5ldyBUcmljayh0cmlja0luZm8uZmlyc3RQbGF5ZXIsdGhpcy5fdHJ1bXBTdWl0ZSx0aGlzLl9wYXJ0bmVyU3VpdGUsdGhpcy5fcGFydG5lclJhbmssdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkLHRyaWNrSW5mby5maXJzdFBsYXllckNhblBsYXlTcGFkZXMpO1xuICAgIFxuICAgICAgICAvKiBzdHVwaWQgbWU6IEkgYWxyZWFkeSBtb3ZlZCBkb2luZyB0aGlzIHRvIHNob3dUcmljaygpIGJ1dCB0aGVyZSBlYXJsaWVyIGluY29ycmVjdCAoaS5lLiBOT1QgY2hlY2tpbmcgdGhlIGZpcnN0IHBsYXllciEhISlcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogaGlkaW5nIG9yIHNob3dpbmcgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGNoZWNrYm94IGNhbiBiZSBkZXRlcm1pbmVkIGhlcmUgYW5kIG5vd1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHRoZSBuZWNlc3NhcnkgaW5mb3JtYXRpb24gZm9yIGRlY2lkaW5nIGlzIGNvbXBsZXRlbHkga25vd24gYXQgdGhlIHN0YXJ0IG9mIGEgbmV3IHRyaWNrXG4gICAgICAgIGlmKHRyaWNrSW5mby5maXJzdFBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXgmJnRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgICAgICAvLyB0aGUgbmV4dCBkZWNpc2lvbiBpcyBhIGxpdHRsZSBoYXJkZXIsIGJlY2F1c2Ugc2hvdWxkIHdlIGFsd2F5cyB0dXJuIG9uIHRoZSBjaGVja2JveD8/Pz8/Pz8/XG4gICAgICAgICAgICAvLyBCVVQgbm90ZSB0aGF0IHRoZSB1c2VyIHdpbGwgYmUgcHJvbXB0ZWQgdG8gYWNrbm93bGVkZ2UgYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveFwiKS5zZWxlY3RlZD07XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgKi9cblxuICAgICAgICAvLyB3ZSBkbyB0aGUgZm9sbG93aW5nIGJlY2F1c2UgaXQgaXMgZXNzZW50aWFsIHRoYXQgdGhlIGNoZWNrYm94IHRoYXQgdGVsbHMgdGhlIHBsYXllciB3aGV0aGVyIG9yIG5vdFxuICAgICAgICAvLyB0aGUgcGFydG5lciBjYXJkIGNhbiBiZSBhc2tlZCBzaG91bGQgYmUgaW4gdGhlIHJpZ2h0IHN0YXRlIHRvIHN0YXJ0IHdpdGggKGZvciB0aGUgcmlnaHQgcGxheWVyKVxuICAgICAgICAvLyBOT1RFIG5ld1RyaWNrKCkgaXMgYmVpbmcgY2FsbGVkIEJFRk9SRSBhIHBsYXllciBpcyBhc2tlZCB0byBwbGF5IGEgY2FyZCwgc28gdGhhdCdzIHRoZSByaWdodCBtb21lbnQhISEhXG4gICAgICAgIHNob3dUcmljayh0aGlzLl90cmljayk7IC8vIFRPRE8gc2hvdWxkIHRoaXMgYmUgaGVyZT8/Pz8/XG5cbiAgICB9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiBpZiB3ZSByZWNlaXZlIGFsbCBwYXJ0bmVycyB3ZSBjYW4gZXh0cmFjdCB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBfc2V0UGFydG5lcklkcyhwYXJ0bmVySWRzKXtcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1wYXJ0bmVySWRzO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj0odGhpcy5fcGFydG5lcklkcyYmdGhpcy5fcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllckluZGV4PHRoaXMuX3BhcnRuZXJJZHMubGVuZ3RoP3RoaXMuX3BhcnRuZXJJZHNbdGhpcy5fcGxheWVySW5kZXhdOm51bGwpO1xuICAgIH1cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogY2FyZEluZm8gZG9lcyBub3QgbmVlZCB0byBjb250YWluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBmbGFnIHBlciBzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBhY3R1YWxseSBvbmx5IG5lZWQgdG8gY29udGFpbiBpdCB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBhcyBpbiBhbGxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb3RoZXIgY2FzZXMgdGhlIHRyaWNrIGNhbiBkZXRlcm1pbmUgaXQgaXRzZWxmIGFuZCBzaG91bGQgTk9UIHJlbHkgb24gaW5mb3JtYXRpb24gc2VudCBieSB0aGUgc2VydmVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IHdvdWxkIGJlIGJldHRlciB0byBjaGFuZ2UgaXQgdG8gYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCBvbiB0aGUgb3RoZXIgc2VydmVyIGVuZCEhXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMgaXMgc29sdmVkIGJ5IHNlbmRpbmcgcGxheVN1aXRlIGFsb25nIHdpdGggY2FyZEluZm8gd2hlbiBzbyBuZWVkZWQhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcImFza2luZ0ZvclBhcnRuZXJDYXJkXCIpKVxuICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9Y2FyZEluZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7IC8vIE1ESEAyNkpBTjIwMjA6IHNob3VsZG4ndCBmb3JnZXQgdGhpcyEhISFcbiAgICAgICAgKi9cbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cmljay5hZGRDYXJkKG5ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm8uc3VpdGUsY2FyZEluZm8ucmFuaykpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG5cbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogaWYgd2UncmUgcmVjZWl2aW5nIHRoZSBwbGF5IHN1aXRlIHdlIGNhbiBkZXRlcm1pbmUgYXNraW5nRm9yUGFydG5lckNhcmQgb3Vyc2VsdmVzXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGxheVN1aXRlXCIpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBwbGF5IHN1aXRlIHByb3ZpZGVkIGRpZmZlcnMgZnJvbSB0aGUgJ2F1dG9tYXRpYycgcGxheSBzdWl0ZSwgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBibGluZGx5XG4gICAgICAgICAgICBpZihjYXJkSW5mby5wbGF5U3VpdGUhPT10aGlzLl90cmljay5wbGF5U3VpdGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLnBsYXlTdWl0ZT1jYXJkSW5mby5wbGF5U3VpdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBldmVyeSBjYXJkIHBsYXllZCBjb250YWlucyB0aGUgcGFydG5lcnMgYXMgd2VsbCEhIVxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcInBhcnRuZXJzXCIpKXRoaXMuX3NldFBhcnRuZXJJZHMoY2FyZEluZm8ucGFydG5lcnMpO1xuXG4gICAgICAgIC8vIGlmIGFsbCB0aGUgY2FyZHMgaW4gdGhlIHRyaWNrIGhhdmUgYmVlbiBwbGF5ZWQsIHRoZSB3aW5uZXIgaXMgZGVmaW5pdGUsIGFuZCB3aW5zIHRoZSB0cmlja1xuICAgICAgICBpZih0aGlzLl90cmljay5udW1iZXJPZkNhcmRzPT09NCl0aGlzLl9udW1iZXJPZlRyaWNrc1dvblt0aGlzLl90cmljay53aW5uZXJdKys7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcuLi5cbiAgICAgICAgLy8gc2hvd1RyaWNrQ2FyZCh0aGlzLl90cmljay5nZXRMYXN0Q2FyZCgpLHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHMpO1xuICAgICAgICBzaG93VHJpY2sodGhpcy5fdHJpY2spOy8vaWYodGhpcy5fdHJpY2tXaW5uZXIpe3RoaXMuX3RyaWNrV2lubmVyPW51bGw7c2hvd1RyaWNrKHRoaXMuX3RyaWNrKTt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0cmlja0luZm8udHJ1bXBTdWl0ZSx0cmlja0luZm8ucGFydG5lclN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAvLyBhbHJlYWR5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IhISFcbiAgICAgICAgLy8gdHJpY2suX2ZpcnN0UGxheWVyPXRyaWNrSW5mby5maXJzdFBsYXllcjtcbiAgICAgICAgLy8gdHJpY2suX2NhbkFza0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgaWYodHJpY2tJbmZvLmNhcmRzJiZ0cmlja0luZm8uY2FyZHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZmlsbCB0aGUgdHJpY2sgd2l0aCB0cmljayBpbmZvcm1hdGlvbiBmcm9tIHRoZSBvdGhlciBwbGF5ZXJzISEhXG4gICAgICAgICAgICB0cmlja0luZm8uY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSkuaG9sZGVyPXRyaWNrO30pOyAvLyBzdG9yZSB0aGUgY2FyZHMgcmVjZWl2ZWQgaW4gdHJpY2tcbiAgICAgICAgICAgIHRyaWNrLl93aW5uZXI9dHJpY2tJbmZvLndpbm5lcjtcbiAgICAgICAgICAgIHRyaWNrLl9wbGF5U3VpdGU9dHJpY2tJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgIHRyaWNrLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWNrO1xuICAgIH1cbiAgICAqL1xuXG4gICAgYWNrbm93bGVkZ2VFdmVudHMoKXtcbiAgICAgICAgLy8gbm93IGlmIHRoZSB1bmFja25vd2xlZGdlIGV2ZW50IGlkcyBkbyBOT1QgcmVhY2ggdGhlIHNlcnZlciB3ZSB3aWxsIHJlY2VpdmUgY2VydGFpbiBldmVudHMgYWdhaW4gdW50aWwgd2UgZG9cbiAgICAgICAgLy8gbWFuYWdlIHRvIGdldCB0aGVtIG92ZXJcbiAgICAgICAgLy8gbWFrZSBhIGNvcHkgb2YgYWxsIHRoZSB1bmFja25vd2xlZGdlZCBldmVudHNcbiAgICAgICAgbGV0IGFja25vd2xlZGdlYWJsZUV2ZW50cz10aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5tYXAoKHVuYWNrbm93bGVkZ2VkRXZlbnQpPT5PYmplY3QuYXNzaWduKHt9LHVuYWNrbm93bGVkZ2VkRXZlbnQpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGFja25vd2xlZGdlYWJsZSBldmVudHM6IFwiLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgIC8vIG9mIGNvdXJzZSB3ZSBjb3VsZCBzZW5kIHRoZW0gcGFzc2luZyBhbiBhY2tub3dsZWRnZSBmdW5jdGlvbiB0aG91Z2hcbiAgICAgICAgaWYoYWNrbm93bGVkZ2VhYmxlRXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGVtaXQgcGFzc2luZyBhbG9uZyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdldCBjYWxsZWQgd2hlbiB0aGUgQUNLIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwiQUNLXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzLCgpPT57XG4gICAgICAgICAgICAgICAgLy8gd2Ugbm93IG1heSByZW1vdmUgYWxsIGFja25vd2xlZGdlYWJsZSBldmVudHNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKiBFdmVudHMgYWNrbm93bGVkZ2VtZW50cyByZWNlaXZlZCEgKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vLy8vZGlmZmVyZW5jZSh0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cyxhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkdXBsaWNhdGVkIGZyb20gc2VydmVyLXNpZGUgUmlra2VuVGhlR2FtZS5qcyB0aGF0IHdpbGwgdHJhbnNsYXRlIHRoaXMuX3BsYXllcnNCaWRzIHRvIHJlYWRhYmxlIGJpZHNcbiAgICAvLyB0byBiZSBwYXNzZWQgdG8gdXBkYXRlQmlkc1RhYmxlKCkhISFcbiAgICBfZ2V0UGxheWVyQmlkc09iamVjdHMoKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3RzPVtdO1xuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWRzKT0+e1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9e25hbWU6dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckJpZHNPYmplY3RzLmxlbmd0aCksYmlkczpbXX07XG4gICAgICAgICAgICAvLyB1c2UgdW5zaGlmdCBOT1QgcHVzaCBhcyB0aGUgYmlkcyBhcmUgc3RvcmVkIHJldmVyc2Ugb3JkZXIgXG4gICAgICAgICAgICBwbGF5ZXJCaWRzLmZvckVhY2goKHBsYXllckJpZCk9PntwbGF5ZXJCaWRzT2JqZWN0LmJpZHMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1twbGF5ZXJCaWRdKX0pO1xuICAgICAgICAgICAgcGxheWVyQmlkc09iamVjdHMucHVzaChwbGF5ZXJCaWRzT2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJCaWRzT2JqZWN0cztcbiAgICB9XG5cbiAgICAvLyBnZW5lcmljIG1ldGhvZCBmb3IgcHJvY2Vzc2luZyBhbnkgZXZlbnQsIGV2ZXJ5XG4gICAgcHJvY2Vzc0V2ZW50KGV2ZW50LGV2ZW50RGF0YSxhY2tub3dsZWRnZSl7XG4gICAgICAgIC8vIGxvZyBldmVyeSBldmVudFxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGV2ZW50LGV2ZW50RGF0YSk7XG4gICAgICAgIGlmKCFldmVudClyZXR1cm47IC8vIE5PVEUgdGhlIGV2ZW50RGF0YSBjYW4gYmUgbnVsbCEhISEhIVxuICAgICAgICAvLyBpZiBkYXRhIGhhcyBhbiBpZCBpdCBuZWVkcyB0byBiZSBhY2tub3dsZWRnZWRcbiAgICAgICAgbGV0IGV2ZW50SWQ9KGV2ZW50RGF0YSYmZXZlbnREYXRhLmhhc093blByb3BlcnR5KFwiaWRcIik/ZXZlbnREYXRhLmlkOm51bGwpO1xuICAgICAgICAvLyBpZiB0aGVyZSdzIGFuIGV2ZW50IGlkIGluIHRoaXMgZXZlbnQsIGFuZCB3ZSdyZSBzdXBwb3NlZCB0byBzZW5kIGFja25vd2xlZGdlbWVudHMsIGRvIHNvXG4gICAgICAgIGlmKGV2ZW50SWQpe1xuICAgICAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogbm93IHB1c2ggdGhlIGV2ZW50IG5hbWUgYXMgd2VsbCBzbyB0aGUgc2VydmVyIGNhbiBsb2cgdGhhdCBhbmQgd2UgY2FuIHNlZSB3aGF0J3MgYWNrbm93bGVnZGVkISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBCVVQgZG9uJ3QgcHVzaCBpdCBhZ2FpbiBpZiBpdCdzIGFscmVhZHkgdGhlcmUhISEhXG4gICAgICAgICAgICBpZihhY2tub3dsZWRnZSlcbiAgICAgICAgICAgICAgICBpZih0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGg9PT0wfHx0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50c1t0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGgtMV0uaWQhPT1ldmVudElkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5wdXNoKHsnaWQnOmV2ZW50SWQsJ2V2ZW50JzpldmVudH0pO1xuICAgICAgICAgICAgdGhpcy5hY2tub3dsZWRnZUV2ZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhPShldmVudElkP2V2ZW50RGF0YS5wYXlsb2FkOmV2ZW50RGF0YSk7XG4gICAgICAgIHN3aXRjaChldmVudCl7XG4gICAgICAgICAgICBjYXNlIFwiU1RBVEVDSEFOR0VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlPWRhdGEudG87XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRVwiOlxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBpbmZvcm1hdGlvbiByZWNlaXZlZCBieSAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJy5cIixkYXRhKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gc2V0IHRoZSBuYW1lIG9mIHRoZSBnYW1lIG5vd1xuICAgICAgICAgICAgICAgIHRoaXMubmFtZT1kYXRhO1xuICAgICAgICAgICAgICAgIC8vIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3BsYXllcnMnKSl0aGlzLnBsYXllck5hbWVzPWRhdGEucGxheWVycztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJTXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lcz1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkRFQUxFUlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYWxlcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRTXCI6XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5wYXJ0bmVyPWRhdGE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRV9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB0eXBpY2FsbHkgdGhlIGdhbWUgaW5mbyBjb250YWlucyBBTEwgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0aGUgZ2FtZSB0aGF0IGlzIGdvaW5nIHRvIGJlIHBsYXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBpLmUuIGFmdGVyIGJpZGRpbmcgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RydW1wU3VpdGU9ZGF0YS50cnVtcFN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9ZGF0YS5wYXJ0bmVyU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPWRhdGEucGFydG5lclJhbms7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9ZGF0YS5oaWdoZXN0QmlkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkZGVycz1kYXRhLmhpZ2hlc3RCaWRkZXJzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3VydGhBY2VQbGF5ZXI9ZGF0YS5mb3VydGhBY2VQbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IG1vdmUgc2hvd2luZyB0aGUgZ2FtZSBpbmZvIGZyb20gcGxheUFDYXJkKCkgdG8gaGVyZSEhISFcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWluZm9cIikuaW5uZXJIVE1MPWdldEdhbWVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXJSYW5rPj0wKXsgLy8gYSBwYXJ0bmVyIChjYXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyU3VpdGVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItc3VpdGUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGVFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0aGlzLl9wYXJ0bmVyU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyUmFua0VsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1yYW5rJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lclJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lckVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lcicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9XCJpbmhlcml0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNleyAvLyBubyBwYXJ0bmVyIChjYXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lckVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX0JJRFwiOlxuICAgICAgICAgICAgICAgIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGhldCBib2QgdmFuIFwiK2RhdGErXCIuXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlUgd29yZHQgem8gb20gZWVuIGJvZCBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gaWYoZGF0YSE9PWN1cnJlbnRQbGF5ZXIubmFtZSlcbiAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9XCJXZSB3YWNodGVuIG9wIGhldCBib2QgdmFuIDxiPlwiK2RhdGErXCI8L2I+LlwiO1xuICAgICAgICAgICAgICAgIC8vIGVsc2VcbiAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9XCJXYXQgd2lsIGplIHNwZWxlbj9cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJNQUtFX0FfQklEXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5tYWtlQUJpZChkYXRhLnBsYXllckJpZHNPYmplY3RzLGRhdGEucG9zc2libGVCaWRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJCSURfTUFERVwiOiAvLyByZXR1cm5lZCB3aGVuIGEgYmlkIGlzIG1hZGUgYnkgc29tZW9uZVxuICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIHRvIHJlY2VpdmUgaW4gZGF0YSBib3RoIHRoZSBwbGF5ZXIgYW5kIHRoZSBiaWRcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1nZXRCaWRJbmZvKGRhdGEuYmlkLGRhdGEucGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleD9udWxsOnRoaXMuZ2V0UGxheWVyTmFtZShkYXRhLnBsYXllcikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllcnNCaWRzW2RhdGEucGxheWVyXS5wdXNoKGRhdGEuYmlkKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIGhvdyB0byBzaG93IHRoZSBiaWRzPz8/Pz9cbiAgICAgICAgICAgICAgICB1cGRhdGVCaWRzVGFibGUodGhpcy5fZ2V0UGxheWVyQmlkc09iamVjdHMoKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVE9fUExBWVwiOlxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIubmFtZSE9PWRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGRlIGthYXJ0IHZhbiBcIitkYXRhK1wiLlwiKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBrYWFydCBnZXZyYWFnZCFcIik7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJXZSB3YWNodGVuIG9wIGRlIGthYXJ0IHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1pbmZvXCIpLmlubmVySFRNTD1cIlNwZWVsIGVlbiBrYWFydCBiaWouXCI7XG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBjb250YWluIHRoZSBjdXJyZW50IGNhcmRzIHRoZSB1c2VyIGhhc1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0sY3VycmVudFBsYXllcik7fSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgLyogTURIQDIzSkFOMjAyMDogZ2FtZSBrZWVwcyB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYnkgZWFjaCBwbGF5ZXIhISEhIVxuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvIHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBhbmQgdG8gd2luXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIubnVtYmVyT2ZUcmlja3NXb249ZGF0YS5udW1iZXJPZlRyaWNrc1dvbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBQTEFZRVJfSU5GTyBkb2VzIG5vdCBuZWVkIHRvIHNlbmQgdGhlIGZvbGxvd2luZyB3aXRoIGVhY2ggUExBWUVSX0lORk8gVEhPVUdIXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhLm51bWJlck9mVHJpY2tzVG9XaW4pO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1NfVE9fV0lOXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5zZXROdW1iZXJPZlRyaWNrc1RvV2luKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIk5FV19UUklDS1wiOlxuICAgICAgICAgICAgICAgIHRoaXMubmV3VHJpY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0FSRF9QTEFZRURcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0NhcmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWV9BX0NBUkRcIjpcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWNlaXZpbmcgdHJpY2sgaW5mbyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogTk9UIGFueW1vcmVcbiAgICAgICAgICAgICAgICBpZighdGhpcy5fdHJpY2spe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlByb2dyYW1tYWZvdXQ6IFUgd29yZHQgb20gZWVuIGthYXJ0IGdldnJhYWdkIGluIGVlbiBvbmdlZGVmaW5pZWVyZGUgc2xhZyEgV2Ugd2FjaHRlbiBldmVuIG9wIHNsYWdpbmZvcm1hdGllLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBNREhAMjdKQU4yMDIwOiBkb2luZyB0aGlzIGFuZCBob3BpbmcgdGhlIG5leHQgcmVxdWVzdCBpcyByZWNlaXZlZCBBRlRFUiByZWNlaXZpbmcgYSBuZXcgdHJpY2shISFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTURIQDIySkFOMjAyMDogb2NjYXNzaW9uYWxseSB3ZSBtYXkgcmVjZWl2ZSB0aGUgcmVxdWVzdCB0byBwbGF5IEJFRk9SRSBhY3R1YWxseSBoYXZpbmcgcmVjZWl2ZWQgdGhlIHN0YXRlIGNoYW5nZSEhXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPT1cInBhZ2UtcGxheWluZ1wiKXNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5wbGF5QUNhcmQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfVFJVTVBfU1VJVEVcIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmNob29zZVRydW1wU3VpdGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0hPT1NFX1BBUlRORVJfU1VJVEVcIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmNob29zZVBhcnRuZXJTdWl0ZShkYXRhLnN1aXRlcyxkYXRhLnBhcnRuZXJSYW5rTmFtZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB1cGRhdGVUcmlja3ModGhpcy5wYXJzZVRyaWNrKGRhdGEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1NcIjogLy8gTURIQDIzSkFOMjAyMDogd29uJ3QgYmUgcmVjZWl2aW5nIHRoaXMgZXZlbnQgYW55bW9yZS4uLlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXh0cmFjdCB0aGUgdHJpY2tzIGZyb20gdGhlIGFycmF5IG9mIHRyaWNrcyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrcz1kYXRhLm1hcCgodHJpY2tJbmZvKT0+e3JldHVybiB0aGlzLnBhcnNlVHJpY2sodHJpY2tJbmZvKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlJFU1VMVFNcIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIHdvbid0IGJlIHJlY2VpdmluZyBhIG5ldyB0cmljayBldmVudCwgYnV0IHdlIHN0aWxsIHdhbnQgdG8gc2hvdyB0aGUgdXNlciB0aGF0IHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBjaGVjayBpZiB0aGUgcGFnZSBtb3ZlZCB0byB0aGUgcmVzdWx0cyBwYWdlPz8/Pz8/XG4gICAgICAgICAgICAgICAgICAgIC8qIHJlbW92ZWQsIGFzIHRoZXNlIHRoaW5ncyBhcmUgZG9uZSB3aGVuIHRoZSBnYW1lIG92ZXIgbWVzc2FnZSBpcyByZWNlaXZlZC4uLlxuICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2spdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPWRhdGEuZGVsdGFwb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BvaW50cz1kYXRhLnBvaW50cztcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVPVkVSXCI6XG4gICAgICAgICAgICAgICAgLy8ga2lsbCB0aGUgZ2FtZSBpbnN0YW5jZSAocmV0dXJuaW5nIHRvIHRoZSBydWxlcyBwYWdlIHVudGlsIGFzc2lnbmVkIHRvIGEgZ2FtZSBhZ2FpbilcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgbmV3LWdhbWUgb3Igc3RvcCBidXR0b24gY2xpY2shISEhISBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleChudWxsLC0xKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmV4aXQoXCJpbiByZXNwb25zZSB0byAnXCIrZGF0YStcIidcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZGlzY29ubmVjdFwiOlxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMkpBTjIwMjA6IGJldHRlciBub3QgdG8gZ28gb3V0IG9mIG9yZGVyIHdoZW4gdGhpcyBoYXBwZW5zISEhISEhXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZlcmJpbmRpbmcgbWV0IGRlIHNlcnZlciAodGlqZGVsaWprKSB2ZXJicm9rZW4hXCIpOyAvLyByZXBsYWNpbmc6IHRoaXMuc3RhdGU9UGxheWVyR2FtZS5PVVRfT0ZfT1JERVI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFVua25vd24gZXZlbnQgXCIrZXZlbnQrXCIgcmVjZWl2ZWQhXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJlcGFyZUZvckNvbW11bmljYXRpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQcmVwYXJpbmcgZm9yIGNvbW11bmljYXRpb25cIik7XG4gICAgICAgIC8vIHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsKCk9PntcbiAgICAgICAgLy8gICAgIHRoaXMuX3N0YXRlPUlETEU7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cz1bXTsgLy8ga2VlcCB0cmFjayBvZiB0aGUgdW5hY2tub3dsZWRnZWRFdmVudElkc1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCgpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ2Rpc2Nvbm5lY3QnLG51bGwsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignU1RBVEVDSEFOR0UnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdTVEFURUNIQU5HRScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZRVJTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWUVSUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdERUFMRVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdERUFMRVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRFMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDQVJEUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQQVJUTkVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUEFSVE5FUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FX0lORk8nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FX0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX0JJRFwiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUT19CSUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTUFLRV9BX0JJRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ01BS0VfQV9CSUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQklEX01BREUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdCSURfTUFERScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fUExBWVwiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUT19QTEFZJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBNREhAMTNKQU4yMDIwOiBwbGF5ZXIgaW5mbyB3aWxsIGJlIHJlY2VpdmVkIGJlZm9yZSBiZWluZyBhc2tlZCB0byBwbGF5IGEgY2FyZCB0byB1cGRhdGUgdGhlIHBsYXllciBkYXRhXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlBMQVlFUl9JTkZPXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUl9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLU19UT19XSU4nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1NfVE9fV0lOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ05FV19UUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ05FV19UUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEX1BMQVlFRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRfUExBWUVEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlfQV9DQVJEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWV9BX0NBUkQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1RSVU1QX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0hPT1NFX1RSVU1QX1NVSVRFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9QQVJUTkVSX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudChcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCIsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdSRVNVTFRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUkVTVUxUUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FT1ZFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVPVkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIG11bHRpcGxlIGV2ZW50cyBhcyBhIHdob2xlLCB3ZSBwcm9jZXNzIGFsbCBvZiB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdFVkVOVFMnLChldmVudHMpPT57XG4gICAgICAgICAgICAvLyB3ZSBjb3VsZCBjb25zdW1lIHRoZSBldmVudHMgSSBndWVzc1xuICAgICAgICAgICAgd2hpbGUoZXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICBldmVudD1ldmVudHMuc2hpZnQoKTsgLy8gcmVtb3ZlIHRoZSBmaXJzdCBldmVudFxuICAgICAgICAgICAgICAgIC8vIGFzY2VydGFpbiB0byBzZW5kIGFsbCB1bmFja25vd2xlZGdlZCBldmVudCBpZHMgd2hlbiB0aGlzIGlzIHRoZSBsYXN0IHByb2Nlc3MgZXZlbnQhISEhXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQuZXZlbnQsZXZlbnQuZGF0YSxldmVudHMubGVuZ3RoPT09MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1ESEAwOEpBTjIwMjA6IHNvY2tldCBzaG91bGQgcmVwcmVzZW50IGEgY29ubmVjdGVkIHNvY2tldC5pbyBpbnN0YW5jZSEhIVxuICAgIGNvbnN0cnVjdG9yKHNvY2tldCl7XG4gICAgICAgIC8vIE9PUFMgZGlkbid0IGxpa2UgZm9yZ2V0dGluZyB0aGlzISEhIFxuICAgICAgICAvLyBidXQgUGxheWVyR2FtZSBkb2VzIE5PVCBoYXZlIGFuIGV4cGxpY2l0IGNvbnN0cnVjdG9yIChpLmUuIG5vIHJlcXVpcmVkIGFyZ3VtZW50cylcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc2VudEV2ZW50UmVjZWl2ZWQ9dGhpcy5fc2VudEV2ZW50UmVjZWl2ZWQuYmluZCh0aGlzKTt0aGlzLl9zZW5kRXZlbnQ9dGhpcy5fc2VuZEV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2V2ZW50c1JlY2VpdmVkPVtdO1xuICAgICAgICB0aGlzLl90cmlja1dpbm5lcj1udWxsO1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fc29ja2V0PXNvY2tldDtcbiAgICAgICAgdGhpcy5fZGVhbGVyPS0xO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xOy8vdGhpcy5fdHJ1bXBQbGF5ZXI9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTt0aGlzLl9wYXJ0bmVyUmFuaz0tMTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NXb249WzAsMCwwLDBdOyAvLyBhc3N1bWUgbm8gdHJpY2tzIHdvbiBieSBhbnlib2R5XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPTA7dGhpcy5fdHJpY2s9bnVsbDtcbiAgICAgICAgdGhpcy5faGlnaGVzdEJpZD0tMTt0aGlzLl9oaWdoZXN0QmlkZGVycz1bXTt0aGlzLnRydW1wUGxheWVyPS0xOyAvLyBubyBoaWdoZXN0IGJpZGRlcnMgeWV0XG4gICAgICAgIHRoaXMuX3BsYXllcnNCaWRzPVtbXSxbXSxbXSxbXV07IC8vIE1ESEAyMUpBTjIwMjA6IGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBiaWRzIHRvIHNob3dcbiAgICAgICAgdGhpcy5fZGVsdGFQb2ludHM9bnVsbDtcbiAgICAgICAgdGhpcy5fcG9pbnRzPW51bGw7XG4gICAgICAgIC8vIHRoaXMuX2xhc3RUcmlja1BsYXllZD1udWxsO1xuICAgICAgICAvLyB0aGlzLl90ZWFtTmFtZXM9bnVsbDtcbiAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIHRoZSAnY3VycmVudCcgcGxheWVyXG4gICAgICAgIC8vIHRoaW5ncyB3ZSBjYW4gc3RvcmUgaW50ZXJuYWxseSB0aGF0IHdlIHJlY2VpdmUgb3ZlciB0aGUgY29ubmVjdGlvblxuICAgICAgICB0aGlzLl9uYW1lPW51bGw7IC8vIHRoZSBuYW1lIG9mIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPW51bGw7IC8vIHRoZSBuYW1lcyBvZiB0aGUgcGxheWVyc1xuICAgICAgICB0aGlzLl9wYXJ0bmVySWRzPW51bGw7IC8vIHRoZSBwYXJ0bmVyXG4gICAgICAgIHRoaXMucHJlcGFyZUZvckNvbW11bmljYXRpb24oKTtcbiAgICB9XG5cbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ2FtZSBpdHNlbGYgb3JnYW5pemVkIGJ5IHN0YXRlXG4gICAgLy8gUExBWUlOR1xuICAgIGdldFRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgIC8vIGdldFRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO31cbiAgICBcbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpeyAvLyBvbmx5IHdoZW4gcGxheWVyIGVxdWFscyB0aGlzLl9wbGF5ZXJJbmRleCBkbyB3ZSBrbm93IHRoZSBwYXJ0bmVyXG4gICAgICAgIGxldCBwYXJ0bmVyPShwbGF5ZXI9PT10aGlzLl9wbGF5ZXJJbmRleD9jdXJyZW50UGxheWVyLnBhcnRuZXI6LTEpO1xuICAgICAgICByZXR1cm4ocGFydG5lcj49MCYmcGFydG5lcjx0aGlzLm51bWJlck9mUGxheWVycz90aGlzLl9wbGF5ZXJOYW1lc1twYXJ0bmVyXTpudWxsKTtcbiAgICB9XG5cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyczt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkO31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgLy8gZ2V0UGxheWVyTmFtZShwbGF5ZXIpe3JldHVybih0aGlzLl9wbGF5ZXJOYW1lcyYmcGxheWVyPHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD90aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJdOlwiP1wiKTt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7cmV0dXJuIHRoaXMuX2RlbHRhUG9pbnRzO31cbiAgICBnZXQgcG9pbnRzKCl7cmV0dXJuIHRoaXMuX3BvaW50czt9XG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LG90aGVyUGxheWVySW5kZXgpe3JldHVybih0aGlzLl9wYXJ0bmVySWRzP3RoaXMuX3BhcnRuZXJJZHNbcGxheWVySW5kZXhdPT09b3RoZXJQbGF5ZXJJbmRleDpmYWxzZSk7fVxuICAgIC8vIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fSAvLyBUT0RPIHN0aWxsIHVzZWQ/Pz8/P1xuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgLy8gZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZm91cnRoQWNlUGxheWVyO31cbiAgICBnZXRUZWFtTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIC8vIGNvbXB1dGluZyB0aGUgdGVhbSBuYW1lIG9uIHRoZSBmbHlcbiAgICAgICAgbGV0IHRlYW1OYW1lPXRoaXMuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7XG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9KHRoaXMuX3BhcnRuZXJJZHM/dGhpcy5fcGFydG5lcklkc1twbGF5ZXJJbmRleF06LTEpOyAvLyBOT1RFIGNvdWxkIGJlIG51bGwhISFcbiAgICAgICAgaWYocGFydG5lckluZGV4JiZwYXJ0bmVySW5kZXg+PTApdGVhbU5hbWUrPVwiICYgXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKHBhcnRuZXJJbmRleCk7XG4gICAgICAgIHJldHVybiB0ZWFtTmFtZTtcbiAgICB9XG5cbn1cblxudmFyIHByZXBhcmVkRm9yUGxheWluZz1mYWxzZTtcblxuZnVuY3Rpb24gcHJlcGFyZUZvclBsYXlpbmcoKXtcblxuICAgIHByZXBhcmVkRm9yUGxheWluZz10cnVlO1xuXG4gICAgLy8gTURIQDEwSkFOMjAyMDogd2Ugd2FudCB0byBrbm93IHdoZW4gdGhlIHVzZXIgaXMgdHJ5aW5nIHRvIG1vdmUgYXdheSBmcm9tIHRoZSBwYWdlXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGhvdyBhYm91dCBwcm9tcHRpbmcgdGhlIHVzZXI/Pz8/P1xuICAgICAgICAvLyBpZighY3VycmVudFBsYXllcnx8IWN1cnJlbnRQbGF5ZXIuZ2FtZSlyZXR1cm47IC8vIGRvIG5vdCBhc2sgdGhlIHVzZXIgd2hldGhlciB0aGV5IHdhbnQgdG8gc3RheSBvciBub3QgKGFzIHRoZXkgY2Fubm90IHN0YXkpXG4gICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIHZpZXdpbmcgdGhlIHJlc3VsdHMgcGFnZSB3ZSBtYXkgYXNzdW1lIHRoYXQgdGhlIGdhbWUgaXMgYWN0dWFsbHkgb3ZlclxuICAgICAgICByZXR1cm4oY3VycmVudFBhZ2U9PT0ncGFnZS1yZXN1bHRzJz9cIkJlZGFua3Qgdm9vciBoZXQgc3BlbGVuLiBUb3QgZGUgdm9sZ2VuZGUga2VlciFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcIkhldCBzcGVsIGlzIG5vZyBuaWV0IHRlbiBlaW5kZS4gQmxpamYgb3AgZGUgcGFnaW5hIG9tIHRvY2ggdmVyZGVyIHRlIHNwZWxlbi5cIik7XG4gICAgfTtcbiAgICAvLyBpZiB3ZSBhY3R1YWxseSBlbmQgdXAgaW4gbGVhdmluZyB0aGlzIFVSTCwgd2UgZGVmaW5pdGVseSB3YW50IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBmb3IgZ29vZFxuICAgIHdpbmRvdy5vbnBvcHN0YXRlPWZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIuZ2FtZSYmY3VycmVudFBsYXllci5nYW1lLnN0YXRlIT09UGxheWVyR2FtZS5GSU5JU0hFRClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogUGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIGhhcyBzdG9wcGVkIHBsYXlpbmcgdGhlIGdhbWUgYW55IGZ1cnRoZXIsIGVmZmVjdGl2ZWx5IGNhbmNlbGluZyBpdC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIpY3VycmVudFBsYXllci5leGl0KCdFWElUJyk7IC8vIGlmIHdlIGhhdmVuJ3QgZG9uZSBzbyB5ZXQhISEhXG4gICAgICAgIHNldFBsYXllck5hbWUobnVsbCxudWxsKTsgLy8gd2l0aG91dCBjYWxsYmFjayBubyBwYWdlIHNob3VsZCBiZSBzaG93biBhbnltb3JlLi4uXG4gICAgfVxuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogaGlkZSB0aGUgYmlkZGluZyBhbmQgcGxheWluZyBlbGVtZW50c1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgLy8gcmVwbGFjZWQgYnkgYmlkLWluZm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItYmlkXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XG4gICAgLy8gRE8gTk9UIERPIFRISVMgV0lMTCBPVkVSUlVMRSBQQVJFTlQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBNREhAMTlKQU4yMDIwOiBcImhpZGRlblwiIGNoYW5nZWQgdG8gXCJ2aXNpYmxlXCIgYXMgd2UgbmV2ZXIgaGlkZSB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgcGxheWVyc1xuICAgIC8vIHJlcGxhY2VkIGJ5IHBsYXktaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gTURIQDE5SkFOMjAyMDogYW5kIHZpY2UgdmVyc2FcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcbiAgICBmb3IobGV0IHN0b3BCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RvcCcpKXN0b3BCdXR0b24ub25jbGljaz1zdG9wUGxheWluZztcbiAgICBcbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWU7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgc3VpdGUgZWxlbWVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIHNob3cgdGhlIHJpZ2h0IHRleHQhISEhXG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPDQ7c3VpdGUrKylcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLlwiK0NhcmQuU1VJVEVfTkFNRVNbc3VpdGVdKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnZhbHVlPUNhcmQuU1VJVEVfQ0hBUkFDVEVSU1tzdWl0ZV07XG4gICAgXG4gICAgLyogTURIQDIySkFOMjAyMDogZXZlbnQgaGFuZGxlciBmb3IgY2xpY2tpbmcgdGhlIG5ldyB0cmljayBidXR0b25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikub25jbGljaz1uZXdUcmlja0J1dHRvbkNsaWNrZWQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICovXG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBjaGVjayBmb3IgYSB1c2VyIG5hbWVcbiAgICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAvLyBNREhAMjRKQU4yMDIwOiBjaGFuZ2VkICdwbGF5ZXInIHRvICdhbHMnISEhIE5PVEUgdGhpcyBpcyBhIGJhY2stZG9vclxuICAgIGxldCBpbml0aWFsUGxheWVyTmFtZT0odXJsUGFyYW1zLmhhcyhcImFsc1wiKT91cmxQYXJhbXMuZ2V0KFwiYWxzXCIpLnRyaW0oKTpudWxsKTtcbiAgICBpZihpbml0aWFsUGxheWVyTmFtZSlzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLChlcnIpPT57fSk7XG5cbn07XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIsZXJyb3JjYWxsYmFjayl7XG4gICAgdmlzaXRlZFBhZ2VzPVtdOyAvLyBmb3JnZXQgdmlzaXRlZCBwYWdlc1xuICAgIGN1cnJlbnRQYWdlPW51bGw7IC8vIGFzY2VydGFpbiB0byBub3QgaGF2ZSBhIHBhZ2UgdG8gc3RvcmVcbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IHBsYXllciAoaWYgYW55KSwgYW5kIGluIGVmZmVjdCB3ZSdsbCBsb29zZSB0aGUgZ2FtZSBhcyB3ZWxsXG4gICAgaWYoY3VycmVudFBsYXllcil7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8obG9jYXRpb24ucHJvdG9jb2wrJy8vJytsb2NhdGlvbi5ob3N0KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKGN1cnJlbnRQbGF5ZXI/XCJSZWNvbm5lY3RlZFwiOlwiQ29ubmVjdGVkXCIpK1wiIHRvIHRoZSBnYW1lIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpeyAvLyBmaXJzdCB0aW1lIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyB1bmZvcnR1bmF0ZWx5IHdlIGNhbiBvbmx5IHNldCB0aGUgZ2FtZSBvZiB0aGUgcGxheWVyIGlmIF9pbmRleCBpcyBub24tbmVnYXRpdmUsIHNvIHdlIHBhc3MgaW4gNFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PTQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJyl7ZXJyb3JjYWxsYmFjayhudWxsKTtzZXRQYWdlKFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIpO30gICAgXG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgbWV0IGRlIHNwZWwgc2VydmVyIGlzIGhlcnN0ZWxkLlwiKTtcbiAgICAgICAgICAgICAgICAvLyBNREhAMjNKQU4yMDIwOiBwdXNoIHRoZSBwbGF5ZXIgbmFtZSB0byB0aGUgc2VydmVyIGFnYWluLCBzbyBpdCBjYW4gcmVzZW5kIHdoYXQgbmVlZHMgc2VuZGluZyEhISFcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyKWNsaWVudHNvY2tldC5lbWl0KCdQTEFZRVInLGN1cnJlbnRQbGF5ZXIubmFtZSwoKT0+e1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQWFuZ2VtZWxkIGJpaiBkZSBzcGVsIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRGUgdmVyYmluZGluZyBtZXQgZGUgc3BlbCBzZXJ2ZXIgaXMgdmVyYnJva2VuLlwiKTtcbiAgICAgICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXCIpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Nvbm5lY3RfZXJyb3InLChlcnIpPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3QgZXJyb3I6IFwiLGVycik7XG4gICAgICAgICAgICBzZXRJbmZvKFwiRXIgaXMgZWVuIHByb2JsZWVtIG1ldCBkZSB2ZXJiaW5kaW5nIG1ldCBkZSBzcGVsIHNlcnZlciAoXCIrZXJyLm1lc3NhZ2UrXCIpIVwiKTtcbiAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyB0cnkgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIGNhdGNoaW5nIHdoYXRldmVyIGhhcHBlbnMgdGhyb3VnaCBldmVudHNcbiAgICAgICAgY2xpZW50c29ja2V0LmNvbm5lY3QoKTtcbiAgICB9ZWxzZVxuICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKG51bGwpKTtcbn1cblxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggdGhlIChuZXcpIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyIHdoZW5ldmVyIHRoZSBwbGF5ZXIgd2FudHMgdG8gcGxheVxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggbnVsbCAob3IgZW1wdHkpIHBsYXllciBuYW1lXG4vLyB0byBtYWtlIGl0IGNhbGxhYmxlIGZyb20gYW55d2hlcmUgd2UgYXR0YWNoIHNldFBsYXllck5hbWUgdG8gd2luZG93IChiZWNhdXNlIGNsaWVudC5qcyB3aWxsIGJlIGJyb3dzZXJpZmllZCEhISlcbmZ1bmN0aW9uIHNldFBsYXllck5hbWUocGxheWVyTmFtZSxlcnJvckNhbGxiYWNrKXtcbiAgICAocHJlcGFyZWRGb3JQbGF5aW5nfHxwcmVwYXJlRm9yUGxheWluZygpKTsgLy8gcHJlcGFyZSBmb3IgcGxheWluZyBvbmNlXG4gICAgLy8gaWYoZXJyb3JDYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gYXNjZXJ0YWluIHRvIG5vdCBiZSBpbiBhIG5vbi1wbGF5ZXIgcGFnZVxuICAgIC8vIHBsYXllck5hbWUgbmVlZHMgdG8gYmUgYSBzdHJpbmcgKGlmIGl0IGlzIGRlZmluZWQpXG4gICAgaWYocGxheWVyTmFtZSYmISh0eXBlb2YgcGxheWVyTmFtZT09PVwic3RyaW5nXCIpKVxuICAgICAgICByZXR1cm4odHlwZW9mIGVycm9yQ2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvckNhbGxiYWNrKG5ldyBFcnJvcihcIkludmFsaWQgcGxheWVyIG5hbWUuXCIpKSk7XG4gICAgLy8gaWYgcGxheWVyTmFtZSBtYXRjaGVzIHRoZSBjdXJyZW50IHBsYXllcidzIG5hbWUsIG5vdGhpbmcgdG8gZG9cbiAgICBpZihwbGF5ZXJOYW1lJiZjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLm5hbWU9PT1wbGF5ZXJOYW1lKVxuICAgICAgICAodHlwZW9mIGVycm9yQ2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvckNhbGxiYWNrKG51bGwpKTtcbiAgICBlbHNlXG4gICAgICAgIF9zZXRQbGF5ZXIocGxheWVyTmFtZSYmcGxheWVyTmFtZS5sZW5ndGg+MD9uZXcgT25saW5lUGxheWVyKHBsYXllck5hbWUpOm51bGwsZXJyb3JDYWxsYmFjayk7XG59XG5cbndpbmRvdy5vbmxvYWQ9cHJlcGFyZUZvclBsYXlpbmc7XG5cbi8vIGV4cG9ydCB0aGUgdHdvIGZ1bmN0aW9uIHRoYXQgd2UgYWxsb3cgdG8gYmUgY2FsbGVkIGZyb20gdGhlIG91dHNpZGUhISFcbm1vZHVsZS5leHBvcnRzPXNldFBsYXllck5hbWU7Il19
