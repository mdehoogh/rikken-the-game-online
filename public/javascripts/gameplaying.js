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

var currentGame=null; // we remember the game until we no longer need it

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
                gameInfo=troelaPlayerName+" heeft troela, ";
                gameInfo+=Language.DUTCH_SUITE_NAMES[trumpSuite]+" is troef, en ";
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
                    alert("Programmafout: Het spel kan niet worden verlaten, als het niet afgelopen is (toestand: "+this._game.state+").");
                    return;
                }
                if(!this._game.done()){
                    alert("Verlaten van het spel mislukt! Probeer het nog eens.");
                    return;
                }
                this._partner=-1;
                // other things to do???????
                if(this.numberOfCards>0){
                    setInfo("De overgebleven kaarten in je hand worden verwijderd!");
                    this._removeCards();
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
        if(this._eventSendCallback)this._eventSentCallback();
    }
    _sendEvent(){
        try{
            this._socket.emit(this._eventToSend[0],this._eventToSend[1],this._sentEventReceived);
            this._eventToSend[2]++;
            console.log("Event "+this._eventToSend[0]+(this._eventToSend[1]?" with data "+JSON.stringify(data):"")+" sent (attempt: "+this._eventToSend[2]+").");
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
        return this._setEventToSend('DONE',null,function(){
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

    get state(){return this._state;}
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

        // MDH@29JAN2020: wait with actually playing the game with these players until we found out that the
        //                current player is actually in the game!!!!!

        if(!currentPlayer)return;

        if(this._playerIndex>=0)return; // already playing the game

        let playerIndex=(!playerNames||playerNames.length<4?-1:playerNames.indexOf(currentPlayer.name));
        
        if(playerIndex>=0){
            // MDH@29JAN2020: at the moment that the player names are received the game actually starts
            //                CAREFUL we should consider receiving the player names more than once??????
            this._initializeGame(); // (re)initialize ALL the properties of playing the game
            this._playerNames=playerNames;
            currentPlayer.playsTheGameAtIndex(this,playerIndex); // register with the playe
            this._playerIndex=currentPlayer._index; // remember the index of the current player
            updateGamePlayerNames();
            showPlayerNames();
            // we only need to show the current player name on page-playing ONCE as it will always stay the same
            showCurrentPlayerName();
            // replacing: showPlayerName(document.getElementById("player-name"),this.getPlayerName(this._playerIndex),-2);
        }else{
            console.log("ERROR: Current player '"+currentPlayer.name+"' not found.");
            if(playerNames)
                alert("Ernstige programmafout: Uw naam komt niet voor in de spelerlijst van het te spelen spel!");
        }
    }

    getNumberOfTricksWonByPlayer(playerIndex){
        if(playerIndex<0||playerIndex>=this._playerNames.length)return -1;
        let numberOfTricksWonByPlayer=this._numberOfTricksWon[playerIndex];
        // we don't have no players and should get the partner ids from the server itself
        let partnerIndex=(this._partners?this._partners[playerIndex]:-1);
        if(partnerIndex<0)return numberOfTricksWonByPlayer; // no partner known yet
        return numberOfTricksWonByPlayer+this._numberOfTricksWon[partnerIndex];
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

    /* MDH@29JAN2020: NOT receiving the partner ids directly from the server anymore BUT deriving them from any partner id we receive!!!!!
    // MDH@20JAN2020: if we receive all partners we can extract the partner of the current player
    _setPartnerIds(partnerIds){
        this._partnerIds=partnerIds;
        // update the partner of the current player
        let currentPartner=(this._partnerIds&&this._playerIndex>=0&&this._playerIndex<this._partnerIds.length?this._partnerIds[this._playerIndex]:-1);
        if(currentPlayer.partner>=0&&currentPartner.partner!=currentPartner)
            return alert("Rapporteer de volgende ernstige programmafout: 'Je partner is veranderd'.");
        currentPlayer.partner=currentPartner;
    }
    */

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
        /* MDH@29JAN2020: NOT expecting to receive the partner ids anymore!!!
        // MDH@20JAN2020: every card played contains the partners as well!!!
        if(cardInfo.hasOwnProperty("partners"))this._setPartnerIds(cardInfo.partners);
        */
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

    _setPartners(partner1,partner2){
        console.log("Player #"+(partner1)+" and #"+(partner2)+" are partners!");
        // MDH@08DEC2019: instead of directly setting the partner property of each player
        //                we wait with doing so as soon as the partner is known (by playing the partner card)
        this._partners=[-1,-1,-1,-1];
        let teams=[[partner1,partner2],[]];
        // MDH@29JAN2020: at this end we do not have _players only _playerNames and their _index is their position in the array of player names!!!!
        this._playerNames.forEach((playerName,index)=>{if(index!==partner1&&index!==partner2)teams[1].push(index);});
        teams.forEach((team)=>{
            console.log("Team: ",team);
            this._partners[team[0]]=team[1];
            this._partners[team[1]]=team[0];
        });
        console.log("Partners known: ",this._partners);
    }

    // MDH@29JAN2020: _setPartner() is called when the PARTNER event is received
    //                if the partner of the current player is known, all partners are known
    //                and the partner ids can be derived!!!!
    _setPartner(partner){
        currentPlayer.partner=partner;
        if(currentPlayer.partner>=0)if(!this._partners)this._setPartners(currentPlayer._index,currentPlayer.partner);
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
        console.log("**************************** PROCESSING EVENT "+event+" >>>"+JSON.stringify(data));
        switch(event){
            case "STATECHANGE":
                this.state=data.to;
                break;
            case "GAME":
                // console.log("Game information received by '"+currentPlayer.name+"'.",data);
                // we can set the name of the game now
                this.name=data;
                // wait for the player names!!!!!
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
                this._setPartner(data);
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
            case "PARTNERS":
                console.log("Partner ids received BUT no longer used!");
                // this._setPartnerIds(data);
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

    _prepareForCommunication(){
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

    // MDH@29JAN2020: if we want to be able to make this player play more than one game with the same Game instance
    //                (this one), we need to take all initialization out of the constructor and put it in here
    _initializeGame(){
        this._state=PlayerGame.OUT_OF_ORDER;
        this._eventsReceived=[];
        this._trickWinner=null;
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
        this._partners=null; // the partners (using the same name as in (server-side) RikkenTheGame.js)
    }

    // MDH@08JAN2020: socket should represent a connected socket.io instance!!!
    constructor(socket){
        // OOPS didn't like forgetting this!!! 
        // but PlayerGame does NOT have an explicit constructor (i.e. no required arguments)
        super();
        this._socket=socket;
        this._sentEventReceived=this._sentEventReceived.bind(this);this._sendEvent=this._sendEvent.bind(this);
        this._initializeGame();
        this._prepareForCommunication();
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

    isPlayerPartner(playerIndex,otherPlayerIndex){return(this._partners?this._partners[playerIndex]===otherPlayerIndex:false);}
    
    // getLastTrickPlayed(){return this._lastTrickPlayed;} // TODO still used?????
    get numberOfTricksPlayed(){return this._numberOfTricksPlayed;}
    // getTrickAtIndex(trickIndex){} // get the last trick played
    get fourthAcePlayer(){return this._fourthAcePlayer;}
    getTeamName(playerIndex){
        // computing the team name on the fly
        // ok, I've change sending the partnerIds over to the game, instead now partner is being set
        // this means that we need to go through the player again
        /*
        let player=this._players[playerIndex];
        let partnerIndex=player.partner;
        return player.name+(partnerIndex>=0?" & "+this.getPlayerName(partnerIndex):"");
        */
        // NOT replacing:
        let teamName=this.getPlayerName(playerIndex);
        let partnerIndex=(this._partners?this._partners[playerIndex]:-1); // NOTE could be null!!!
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
                    /* MDH@29JAN2020: do NOT start playing a game until we receive the player names!!!!!!
                    // unfortunately we can only set the game of the player if _index is non-negative, so we pass in 4
                    currentPlayer.index=4;
                    currentPlayer.game=new PlayerGameProxy(clientsocket);
                    */
                    currentGame=new PlayerGameProxy(clientsocket); // let's create the game that is to register the event handlers
                    setPage("page-wait-for-players");    
                    if(typeof errorcallback==='function')errorcallback(null);
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
    }else{
        currentGame=null; // get rid of the current game (if any)
        (typeof errorcallback!=='function'||errorcallback(null));
    }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogZGVmaW5pdGlvbiBvZiBhIHBsYXlpbmcgQ2FyZFxuICovXG5jbGFzcyBDYXJke1xuXG4gICAgc3RhdGljIGdldCBTVUlURV9OQU1FUygpe3JldHVybiBbXCJkaWFtb25kXCIsXCJjbHViXCIsXCJoZWFydFwiLFwic3BhZGVcIl07fVxuICAgIHN0YXRpYyBnZXQgUkFOS19OQU1FUygpe3JldHVybiBbXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiamFja1wiLFwicXVlZW5cIixcImtpbmdcIixcImFjZVwiXTt9XG4gICAgLy8gc2hvcnRoYW5kICdjaGFyYWN0ZXJzJyBmb3IgdGV4dHVhbCByZXByZXNlbnRhdGlvblxuICAgIC8vIE5PVCBXT1JLSU5HOiBjb25zdCBDQVJEX1NVSVRFX0NIQVJBQ1RFUlM9W1N0cmluZy5mcm9tQ2hhckNvZGUoMjY2NiksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYzKSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjUpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MCldO1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0hBUkFDVEVSUygpe3JldHVybiBbJ1xcdTI2NjYnLCdcXHUyNjYzJywnXFx1MjY2NScsJ1xcdTI2NjAnXX07IC8vIFlFUywgV09SS0lORyEhISEhXG4gICAgc3RhdGljIGdldCBTVUlURV9ESUFNT05EKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NMVUIoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfSEVBUlQoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfU1BBREUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19DSEFSQUNURVJTKCl7cmV0dXJuIFsnMicsJzMnLCc0JywnNScsJzYnLCc3JywnOCcsJzknLCcxMCcsJ0InLCdWJywnSycsJ0EnXTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19UV08oKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19USFJFRSgpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZPVVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GSVZFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0lYKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0VWRU4oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19FSUdIVCgpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBSQU5LX05JTkUoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19URU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19KQUNLKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfUVVFRU4oKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfS0lORygpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19BQ0UoKXtyZXR1cm4gMTI7fTtcblxuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHMoY2FyZDEsY2FyZDIpe1xuICAgICAgICBsZXQgZGVsdGFTdWl0ZT1jYXJkMS5fY2FyZFN1aXRlSW5kZXgtY2FyZDIuX2NhcmRTdWl0ZUluZGV4O1xuICAgICAgICBpZihkZWx0YVN1aXRlIT0wKXJldHVybiBkZWx0YVN1aXRlO1xuICAgICAgICByZXR1cm4gY2FyZDEuX2NhcmROYW1lSW5kZXgtY2FyZDIuX2NhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIFxuICAgIC8vIGluIGEgdHJpY2sgdGhlIHBsYXkgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IGNhcmRzIGFyZSB0byBiZSBwbGF5ZWQsIHRoZSB0cnVtcCBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgdHJ1bXAgaXNcbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQxLGNhcmQyLHBsYXlTdWl0ZSx0cnVtcFN1aXRlKXtcbiAgICAgICAgLy8gbm9ybWFsbHkgd2l0aCBhbnkgdHdvIHJlZ3VsYXIgY2FyZHMgdGhleSBhcmUgbmV2ZXIgZXF1YWwgaW4gYSB0cmlja1xuICAgICAgICAvLyBjYXJkcyB0aGF0IGFyZSBuZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUgaXMgaXJyZWxldmFudFxuICAgICAgICBsZXQgcmVzdWx0PTA7XG4gICAgICAgIGxldCB0eXBlPSctJztcbiAgICAgICAgLy8gMS4gaWYgY2FyZDEgaXMgdHJ1bXAsIGFuZCBjYXJkMiBpcyBub3Qgb3IgaGFzIGEgbG93ZXIgcmFuayBjYXJkMSB3aW5zXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT10cnVtcFN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdBJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgTk9UIHRydW1wIGJ1dCBjYXJkMiBjb3VsZCBzdGlsbCBiZSB0cnVtcFxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0InO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgdHJ1bXAsIHNvIGNvdWxkIGJlIHBsYXkgc3VpdGUgb3Igbm90Li4uXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQyc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIG5vdCBwbGF5IHN1aXRlLCBidXQgY2FyZDIgY291bGQgYmVcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0QnO31cbiAgICAgICAgY29uc29sZS5sb2coJz4+PiBUeXBlOiAnK3R5cGUrJzogJytjYXJkMS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIihzdWl0ZTogXCIrY2FyZDEuc3VpdGUrXCIpXCIrKHJlc3VsdD4wPycgPiAnOihyZXN1bHQ8MD8nIDwgJzonID0gJykpK2NhcmQyLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChzdWl0ZTogXCIrY2FyZDIuc3VpdGUrXCIpXCIrXCIgKHBsYXk6IFwiKyhwbGF5U3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1twbGF5U3VpdGVdOlwiP1wiKStcIiwgdHJ1bXA6XCIrKCh0cnVtcFN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV06XCI/XCIpKStcIilcIik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgLy8gbGV0J3MgZmlyc3QgcmVjb21wdXRlIHRoZSBzdWl0ZSBvZiBib3RoIGNhcmRzIGFuZCBlbGV2YXRlIHRydW1wIGNhcmRzLCBhbmQgZGVldmFsdWF0ZSBub24gcGxheVN1aXRlIGNhcmRzXG4gICAgICAgIGxldCBjYXJkMVN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMS5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQxLnN1aXRlKSk7XG4gICAgICAgIGxldCBjYXJkMlN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQyLnN1aXRlKSk7XG4gICAgICAgIGlmKGNhcmQxU3VpdGU+PTB8fGNhcmQyU3VpdGU+PTApeyAvLyBhdCBsZWFzdCBvbmUgb2YgdGhlIGNhcmRzIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzdWl0ZXMgYXJlIHRoZSBzYW1lIHRoZSBoaWdoZXN0IHJhbmsgd2luc1xuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZTwwKXJldHVybiAtMTsgLy8gaWYgdGhlIGZpcnN0IGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgbG93ZXJcbiAgICAgICAgICAgIGlmKGNhcmQyU3VpdGU8MClyZXR1cm4gMTsgLy8gaWYgdGhlIHNlY29uZCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGhpZ2hlclxuICAgICAgICAgICAgLy8gQVNTRVJUIGJvdGggY2FyZHMgYXJlIGVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPT1jYXJkMlN1aXRlKXJldHVybiBjYXJkMS5yYW5rLWNhcmQyLnJhbms7XG4gICAgICAgICAgICAvLyBBU1NFUlQgb25lIGNhcmQgaXMgcGxheSBzdWl0ZSwgdGhlIG90aGVyIG11c3QgYmUgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIHJldHVybihjYXJkMVN1aXRlPT00PzE6LTEpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSwgYm90aCBjYXJkcyBhcmUgaXJyZWxldmFudCAoc2hvdWxkIGhhcHBlbiB0aG91Z2gpXG4gICAgICAgIHJldHVybiAwOyAvLyBjb25zaWRlcmVkIGVxdWFsIHRoYXQgaXMgaXJyZWxldmFudFxuICAgIH1cbiAgICBcbiAgICAvLyAvLyB5b3UnZCBoYXZlIHRvIHVzZSB0aGUgQXBwbGUgU3ltYm9scyBmb250XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaU8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KxPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgr48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CvTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4K7PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgro8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CuTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4K4PC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgrc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CtjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4K1PC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgrQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CszwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KyPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZozwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg5E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DnjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4OdPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg5s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DmjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OZPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg5g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DlzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OWPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg5U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DlDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4OTPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg5I8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmmPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DgTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OOPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg408L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DizwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OKPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg4k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DiDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OHPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg4Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DhTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OEPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg4M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DgjwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KhPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgq48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CrTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4KrPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgqo8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CqTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4KoPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgqc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CpjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4KlPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgqQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CozwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KiPC9saT5cbiAgICBzdGF0aWMgZ2V0IENBUkRfQVBQTEVfU1lNQk9MUygpe3JldHVybiBbXG4gICAgICAgIFsn8J+DgicsJ/Cfg4MnLCfwn4OEJywn8J+DhScsJ/Cfg4YnLCfwn4OHJywn8J+DiCcsJ/Cfg4knLCfwn4OKJywn8J+DiycsJ/Cfg40nLCfwn4OOJywn8J+DgSddLFxuICAgICAgICBbJ/Cfg5InLCfwn4OTJywn8J+DlCcsJ/Cfg5UnLCfwn4OWJywn8J+DlycsJ/Cfg5gnLCfwn4OZJywn8J+DmicsJ/Cfg5snLCfwn4OdJywn8J+DnicsJ/Cfg5EnXSxcbiAgICAgICAgWyfwn4KyJywn8J+CsycsJ/CfgrQnLCfwn4K1Jywn8J+CticsJ/CfgrcnLCfwn4K4Jywn8J+CuScsJ/CfgronLCfwn4K7Jywn8J+CvScsJ/Cfgr4nLCfwn4KxJ10sXG4gICAgICAgIFsn8J+CoicsJ/CfgqMnLCfwn4KkJywn8J+CpScsJ/CfgqYnLCfwn4KnJywn8J+CqCcsJ/CfgqknLCfwn4KqJywn8J+CqycsJ/Cfgq0nLCfwn4KuJywn8J+CoSddXG4gICAgXX07XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KXtcbiAgICAgICAgdGhpcy5fY2FyZFN1aXRlSW5kZXg9Y2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIHRoaXMuX2NhcmROYW1lSW5kZXg9Y2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIENhcmQuUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XStcIiBvZiBcIitDYXJkLlNVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcInNcIjtcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJhbmsoKXtyZXR1cm4gdGhpcy5fY2FyZE5hbWVJbmRleDt9XG4gICAgZ2V0IHN1aXRlKCl7cmV0dXJuIHRoaXMuX2NhcmRTdWl0ZUluZGV4O31cblxuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbigpe1xuICAgICAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc3ZnLWNhcmRzLnN2ZyB3ZSBjYW4gZG8gdGhlIGZvbGxvd2luZywgYnV0IGluIHRoYXQgY2FzZSB3ZSdkIG5lZWQgdG8ga25vdyB0aGUgbWFnbmlmaWNhdGlvbiBmYWN0b3IhISFcbiAgICAgICAgLy9yZXR1cm4gQ0FSRF9GT05UX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvL3JldHVybiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDY3NiA5NzZcIj48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ZnLWNhcmRzLnN2ZyMnK1NVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcIi1cIitSQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdKyc8L3VzZT48L3N2Zz4nO1xuICAgICAgICByZXR1cm4gQ2FyZC5DQVJEX0FQUExFX1NZTUJPTFNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvLy8vLy9yZXR1cm4gU1VJVEVfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0uY29uY2F0KFJBTktfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkTmFtZUluZGV4XSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPUNhcmQ7IiwiLyoqXG4gKiBkZWZpbmVzIHNvbWVvbmUgdGhhdCBob2xkcyBjYXJkc1xuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuXG5jbGFzcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2codG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNREhAMDRERUMyMDE5OiBhbGxvd2luZyBub3cgdG8gY29uc3RydWN0IGZpeGVkIHNpemUgY2FyZCBob2xkZXJzIChsaWtlIFRyaWNrKVxuICAgIGNvbnN0cnVjdG9yKG51bWJlck9mQ2FyZHM9MCl7XG4gICAgICAgIHRoaXMuX2NhcmRzPVtdO1xuICAgICAgICB0aGlzLl9udW1iZXJPZkNhcmRzPW51bWJlck9mQ2FyZHM7XG4gICAgICAgIHdoaWxlKC0tbnVtYmVyT2ZDYXJkcz49MCl0aGlzLl9jYXJkcy5wdXNoKG51bGwpO1xuICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kcyB0byBhZGp1c3QgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIF9yZW1vdmVDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmluZGV4T2YoY2FyZCk7XG4gICAgICAgIGlmKGNhcmRJbmRleD49MCl7XG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkcy5zcGxpY2UoY2FyZEluZGV4LDEpLmxlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK2NhcmQrXCIgcmVtb3ZlZCBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIuXCIpO1xuICAgICAgICAgICAgICAgIGNhcmQuX2hvbGRlcj1udWxsOyAvLyB3aGVuIHN1Y2Nlc3NmdWwgYXBwYXJlbnRseSBubyBsb25nZXIgYXZhaWxhYmxlISEhXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIgb2YgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIjogaXQgaXMgbm90IHByZXNlbnQuXCIpO1xuICAgIH1cbiAgICBfYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgaWYoIWNhcmQpcmV0dXJuO1xuICAgICAgICBpZighKGNhcmQgaW5zdGFuY2VvZiBIb2xkYWJsZUNhcmQpKXRocm93IG5ldyBFcnJvcihcIk5vdCBhIGhvbGRhYmxlIGNhcmQhXCIpO1xuICAgICAgICB0aGlzLmxvZyhcIkFkZGluZyBjYXJkIFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIHRoaXMuX2NhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz5udW1iZXJPZkNhcmRzTm93KXtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTsgLy8gY2FuIG5vIGxvbmdlciBndWFyYW50ZWUgdGhhdCBpdCBpcyBzb3J0ZWQuLi5cbiAgICAgICAgICAgIGNhcmQuX2hvbGRlcj10aGlzO1xuICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiAoXCIrY2FyZC50b1N0cmluZygpK1wiKSBhZGRlZCB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAgICAgLy8gaG93IGFib3V0IG9yZGVyaW5nIHRoZSBjYXJkcz8/Pz8/PyBvciBzdG9yaW5nIHRoZW0gYnkgc3VpdGU/Pz8/XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlxcdENhcmQgY29sbGVjdGlvbjogXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjYXJkIFwiK2NhcmQrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiIChkZWx0YSBudW1iZXIgb2YgY2FyZHM6IFwiKyh0aGlzLm51bWJlck9mQ2FyZHMtbnVtYmVyT2ZDYXJkc05vdykrXCIpLlwiKTtcbiAgICB9XG4gICAgLypcbiAgICAvLyByZXBsYWNlIGEgY2FyZCBhdCBhIGdpdmVuIGluZGV4IChhcyB1c2VkIGluIFRyaWNrKVxuICAgIF9zZXRDYXJkQXRJbmRleChjYXJkLGluZGV4KXtcbiAgICAgICAgaWYoaW5kZXg8MHx8aW5kZXg+PXRoaXMubnVtYmVyT2ZDYXJkcyl0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZXBsYWNlIGNhcmQgI1wiK1N0cmluZyhpbmRleCsxKStcIi5cIik7XG4gICAgICAgIGxldCBjYXJkQXRJbmRleD10aGlzLl9jYXJkc1tpbmRleF07XG4gICAgICAgIGlmKGNhcmRBdEluZGV4KXtjYXJkQXRJbmRleC5faG9sZGVyPW51bGw7dGhpcy5fY2FyZHNbaW5kZXhdPW51bGw7fVxuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIGlmICdjb250YWluZWQnIGluIGFub3RoZXIgY2FyZCBob2xkZXIgcmVtb3ZlIGl0IGZyb20gdGhlcmUhISFcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBpZihjYXJkLl9ob2xkZXIpY2FyZC5faG9sZGVyLnJlbW92ZUNhcmQoY2FyZCk7XG4gICAgICAgICAgICAgICAgaWYoIWNhcmQuX2hvbGRlcil7dGhpcy5fY2FyZHNbaW5kZXhdPWNhcmQ7Y2FyZC5faG9sZGVyPXRoaXM7fSAgICBcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7fVxuICAgICAgICB9XG4gICAgfVxuICAgICovXG4gICAgLy8gcG9sbCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgZ2V0IG51bWJlck9mQ2FyZHMoKXtyZXR1cm4gdGhpcy5fY2FyZHMubGVuZ3RoO31cblxuICAgIGdldENhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQucmFuaz09cmFuazt9KTtcbiAgICB9XG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHN1aXRlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5zdWl0ZT09c3VpdGU7fSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnRcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXMoKXtcbiAgICAgICAgLy8gY2FuJ3QgdXNlIHRoaXMgaW4gZmlsdGVyISEhIHJldHVybiBbMCwxLDIsM10uZmlsdGVyKChyYW5rKT0+e3JldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuayk+MDt9KTtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgY2FyZHMgaW4gdGhlIGhvbGRlciB3aXRoIHRoZSBnaXZlbiByYW5rXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggYWxsIHN1aXRlcywgd2l0aCAtMSB3aGVyZSBhIHN1aXRlIGlzIG5vdCBwcmVzZW50IGluIHRoZSBjdXJyZW50IGNhcmRzIFxuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRob3V0UmFuayhyYW5rKXtcbiAgICAgICAgLy8gYWggdGhpcyBpcyBhbiBpc3N1ZSwgYmVjYXVzZSBpZiB5b3UgZG8gbm90IGhhdmUgYSBjZXJ0YWluIHN1aXRlIHRoZSBzdWl0ZSBzaG91bGQgTk9UIGJlIHJldHVybmVkISEhISFcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntcbiAgICAgICAgICAgIGlmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7IC8vIGlmIHN1aXRlIG5vdCBwcmVzZW50IHlldCwgYWRkIGl0IHRvIHN1aXRlc1xuICAgICAgICAgICAgaWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXNbY2FyZC5zdWl0ZV09LTE7IC8vIG5vdCByZW1vdmluZyBpdCBidXQgc2V0dGluZyB0byAtMSBpZiB3ZSBsb2NhdGUgdGhlIHJhbmtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnQgb2Ygd2hpY2ggdGhlIHBsYXllciBkb2VzIG5vdCBoYXZlIHRoZSB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGdldFJhbmtsZXNzU3VpdGVzKHJhbmspe1xuICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZXM9W107XG4gICAgICAgIGxldCBzdWl0ZXNXaXRoUmFua3M9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goXG4gICAgICAgICAgICAoY2FyZCk9PntcbiAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDAmJnN1aXRlc1dpdGhSYW5rcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApe1xuICAgICAgICAgICAgICAgICAgICBpZihjYXJkLmNhcmROYW1lSW5kZXg9PXJhbmspe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VpdGVzV2l0aFJhbmtzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHN1aXRlIGlmIGFscmVhZHkgcHJlc2VudFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVJbmRleD1yYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZUluZGV4Pj0wKXJhbmtsZXNzU3VpdGVzLnNwbGljZShyYW5rbGVzc1N1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIC8vIHVudGlsIHByb3ZlbiBkaWZmZXJlbnRseVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFua2xlc3NTdWl0ZXMucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByYW5rbGVzc1N1aXRlcztcbiAgICB9XG5cbiAgICBnZXRGaXJzdENhcmQoKXtpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClyZXR1cm4gdGhpcy5fY2FyZHNbMF07fVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogdXNlZCBpbiBnYW1lZW5naW5lLmpzXG4gICAgZ2V0TGFzdENhcmQoKXtpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZHMubGVuZ3RoLTFdO31cblxuICAgIGNvbnRhaW5zQ2FyZChzdWl0ZSxyYW5rKXtcbiAgICAgICAgbGV0IGNhcmQ9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmQ+PTAmJih0aGlzLl9jYXJkc1tjYXJkXS5zdWl0ZSE9PXN1aXRlfHx0aGlzLl9jYXJkc1tjYXJkXS5yYW5rIT09cmFuaykpO1xuICAgICAgICByZXR1cm4oY2FyZD49MCk7IC8vIGZvdW5kIGlmIGNhcmQgaXMgbm90IG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UgbmVlZCB0aGlzIHRvIGZpbmQgYSBzcGVjaWZpYyBjYXJkXG4gICAgZ2V0Q2FyZChzdWl0ZSxyYW5rKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZEluZGV4Pj0wKXtsZXQgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO2lmKGNhcmQuc3VpdGU9PT1zdWl0ZSYmY2FyZC5yYW5rPT09cmFuaylyZXR1cm4gY2FyZDt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNhbiBleHBvc2UgYSB0ZXh0IHJlcHJlc2VudGlvblxuICAgICAqL1xuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbihzdWl0ZVNlcGFyYXRvcil7XG4gICAgICAgIHRoaXMubG9nKFwiTnVtYmVyIG9mIGNhcmRzIHRvIHJlcHJlc2VudDogXCIrdGhpcy5fY2FyZHMubGVuZ3RoK1wiLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHNvcnRpbmc/Pz8/Pz8/PyB0aGF0IHdvdWxkIGJlIG5pY2VcbiAgICAgICAgaWYoc3VpdGVTZXBhcmF0b3ImJnR5cGVvZiBzdWl0ZVNlcGFyYXRvcj09PVwic3RyaW5nXCImJiF0aGlzLl9zb3J0ZWQpe1xuICAgICAgICAgICAgdGhpcy5fY2FyZHMuc29ydChjb21wYXJlQ2FyZHMpO1xuICAgICAgICAgICAgdGhpcy5fc29ydGVkPXRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMuX3NvcnRlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5tYXAoKGNhcmQpPT57cmV0dXJuIGNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7fSkuam9pbihcIiBcIik7XG4gICAgICAgIC8vIGNhcmRzIGFyZSBzdXBwb3NlZCB0byBiZSBzb3J0ZWRcbiAgICAgICAgbGV0IHRleHRSZXByZXNlbnRhdGlvbj1cIlwiO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICBsZXQgY2FyZD10aGlzLmdldEZpcnN0Q2FyZCgpO1xuICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uPWNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0xO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4Kyspe1xuICAgICAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbis9KGNhcmQuc3VpdGUhPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uc3VpdGU/c3VpdGVTZXBhcmF0b3I6XCIgXCIpO1xuICAgICAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbis9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHRSZXByZXNlbnRhdGlvbjsgLy8gYSBzaW5nbGUgYmxhbmsgYmV0d2VlbiB0aGVtISEhXG4gICAgfVxuXG59XG5cbi8qKlxuICogYSBjYXJkIHdpdGggYSBjYXJkIGhvbGRlciBpcyBoZWxkXG4gKi9cbmNsYXNzIEhvbGRhYmxlQ2FyZCBleHRlbmRzIENhcmR7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhPTERBQkxFQ0FSRCA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cblxuICAgIHNldCBob2xkZXIoaG9sZGVyKXtcbiAgICAgICAgdGhpcy5sb2coXCJDaGFuZ2luZyB0aGUgaG9sZGVyIG9mIGNhcmQgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gdGhlIGN1cnJlbnQgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKHRoaXMuX2hvbGRlcil0aGlzLl9ob2xkZXIuX3JlbW92ZUNhcmQodGhpcyk7XG4gICAgICAgIC8vIGFkZCAod2hlbiBzdWNjZXNzZnVsbHkgcmVtb3ZlZCkgdG8gdGhlIG5ldyBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYoIXRoaXMuX2hvbGRlciYmaG9sZGVyKWhvbGRlci5fYWRkQ2FyZCh0aGlzKTtlbHNlIHRoaXMubG9nKFwiRVJST1I6IFVuYWJsZSB0byBjaGFuZ2UgdGhlIGhvbGRlciFcIik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCxob2xkZXIpe1xuICAgICAgICBzdXBlcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KTtcbiAgICAgICAgdGhpcy5faG9sZGVyPW51bGw7XG4gICAgICAgIHRoaXMuaG9sZGVyPWhvbGRlcjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiBcIkhvbGRhYmxlIFwiK3N1cGVyLnRvU3RyaW5nKCk7fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPXtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH07IiwiLyoqXG4gKiBhIHBsYWNlaG9sZGVyIGZvciBhIHBsYXllclxuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuLyoqXG4gKiBhIFBsYXllciBjYW4gbWFrZSBhIGJpZCwgb3IgcGxheSBhIGNhcmQsIGNob29zZSBhIHRydW1wIGFuZCBwYXJ0bmVyIHN1aXRlXG4gKi9cbmNsYXNzIFBsYXllckV2ZW50TGlzdGVuZXJ7XG4gICAgYmlkTWFkZShiaWQpe31cbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe31cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe31cbiAgICBwYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXt9XG59XG5cbi8vIE1ESEAwN0RFQzIwMTk6IFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVyIHdpdGggZ2FtZSBkYXRhIGV4cG9zZWQgdG8gcGxheWVyXG4vLyAgICAgICAgICAgICAgICB3aGljaCB3YXMgZWFybGllciBzdG9yZWQgaW4gZWFjaCB0cmlja1xuY2xhc3MgUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXJ7XG4gICAgc3RhdGljIGdldCBCSURfTkFNRVMoKXtyZXR1cm4gW1wicGFzXCIsXCJyaWtcIixcInJpayAoYmV0ZXIpXCIsXCJuZWdlbiBhbGxlZW5cIixcIm5lZ2VuIGFsbGVlbiAoYmV0ZXIpXCIsXCJwaWNvXCIsXCJ0aWVuIGFsbGVlblwiLFwidGllbiBhbGxlZW4gKGJldGVyKVwiLFwiZWxmIGFsbGVlblwiLFwiZWxmIGFsbGVlbiAoYmV0ZXIpXCIsXCJtaXNcXHhlOHJlXCIsXCJ0d2FhbGYgYWxsZWVuXCIsXCJ0d2FhbGYgYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzXFx4ZThyZVwiLFwiZGVydGllbiBhbGxlZW5cIixcImRlcnRpZW4gYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzXFx4ZThyZSBtZXQgZWVuIHByYWF0amVcIixcInRyb2VsYVwiLFwib20gZGUgc2Nob3BwZW4gdnJvdXcgZW4gZGUgbGFhdHN0ZSBzbGFnXCIsXCJvbSBkZSBsYWF0c3RlIHNsYWdcIl07fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QQVMoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJSygpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBCSURfUklLX0JFVEVSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU4oKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTl9CRVRFUigpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBCSURfUElDTygpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU4oKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9NSVNFUkUoKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiAxMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFKCl7cmV0dXJuIDEzO307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU4oKXtyZXR1cm4gMTQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiAxNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRSgpe3JldHVybiAxNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RST0VMQSgpe3JldHVybiAxNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0xBQVRTVEVfU0xBR19FTl9TQ0hPUFBFTl9WUk9VVygpe3JldHVybiAxODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0xBQVRTVEVfU0xBRygpe3JldHVybiAxOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEU19BTExfQ0FOX1BMQVkoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1BJQ08sUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkUsUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFXTt9OyAvLyB0cnVtcGxlc3MgZ2FtZXNcbiAgICBzdGF0aWMgZ2V0IEJJRFNfV0lUSF9QQVJUTkVSX0lOX0hFQVJUUygpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUklLX0JFVEVSLFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0VMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUl07fTsgLy8gZ2FtZXMgd2l0aCB0cnVtcCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXJcbiAgICBzdGF0aWMgZ2V0IEJJRF9SQU5LUygpe3JldHVybiBbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMCwtMSwtMV07fTsgLy8gaG93IEkgcGxheWVkIGl0IChiaWQgcGFzcyBleGNsdWRlZCAoYWx3YXlzIHJhbmsgMCkpXG4gICAgXG4gICAgLy8gZWFjaCBiaWQgaGFzIGEgY2VydGFpbiBhbW91bnQgb2YgcG9pbnRzIHRvIHJlY2VpdmUgd2hlbiB3aW5uaW5nIHRoZSBnYW1lXG4gICAgc3RhdGljIGdldCBCSURfUE9JTlRTKCl7cmV0dXJuIFswLDEsMSwzLDMsNCw0LDQsNSw1LDUsNiw2LDYsNyw3LDEwLDIsMiwyXTt9XG5cbiAgICAvLyB0aGUgc3RhdGUgY29uc3RhbnRzIHdlIGhhdmVcbiAgICBzdGF0aWMgZ2V0IE9VVF9PRl9PUkRFUigpe3JldHVybiAwO31cbiAgICBzdGF0aWMgZ2V0IElETEUoKXtyZXR1cm4gMTt9XG4gICAgc3RhdGljIGdldCBERUFMSU5HKCl7cmV0dXJuIDI7fVxuICAgIHN0YXRpYyBnZXQgQklERElORygpe3JldHVybiAzO31cbiAgICBzdGF0aWMgZ2V0IFBMQVlJTkcoKXtyZXR1cm4gNDt9XG4gICAgc3RhdGljIGdldCBDQU5DRUxJTkcoKXtyZXR1cm4gNTt9XG4gICAgc3RhdGljIGdldCBGSU5JU0hFRCgpe3JldHVybiA2O31cbiAgICBnZXRUcnVtcFN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe31cbiAgICBnZXRUcnVtcFBsYXllcigpe31cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcil7fVxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7fVxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIGdldFBsYXllck5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7fVxuICAgIGdldCBwb2ludHMoKXt9XG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllcixvdGhlclBsYXllcil7fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe31cbiAgICBnZXRUcmlja0F0SW5kZXgodHJpY2tJbmRleCl7fSAvLyBnZXQgdGhlIGxhc3QgdHJpY2sgcGxheWVkXG4gICAgZ2V0VGVhbU5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGZvdXJ0aEFjZVBsYXllcigpe31cbiAgICBfYXNrUGxheWVyRm9yQmlkKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JUcnVtcFN1aXRlKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JQYXJ0bmVyU3VpdGUoKXt9XG4gICAgX2Fza1BsYXllckZvckNhcmQoKXt9XG4gICAgX2NhcmRQbGF5ZWRBY2NlcHRlZCgpe30gLy8gTURIQDIzSkFOMjAyMDogdGhlIGVtcHR5IG1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiBhIGNhcmQgd2FzIHBsYXllZCBzdWNjZXNzZnVsbHlcbn1cblxuY29uc3QgQ0hPSUNFX0lEUz1bXCJhXCIsXCJiXCIsXCJjXCIsXCJkXCIsXCJlXCIsXCJmXCIsXCJnXCIsXCJoXCIsXCJpXCIsXCJqXCIsXCJrXCIsXCJsXCIsXCJtXCJdO1xuXG5jb25zdCBQTEFZRVJUWVBFX0ZPTz0wLFBMQVlFUlRZUEVfVU5LTk9XTj0xLFBMQVlFUlRZUEVfRlJJRU5EPTI7XG5cbi8vIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBQbGF5ZXIgaW5zdGFuY2VzXG4vLyB3b3VsZCBiZSBkZWZpbmVkIGFic3RyYWN0IGluIGNsYXNzaWNhbCBPT1xuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUExBWUVSID4+PiBcIit0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIGFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXImJnBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMucHVzaChwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgZXZlbnQgbGlzdGVuZXJzOiBcIit0aGlzLl9ldmVudExpc3RlbmVycytcIi5cIik7XG4gICAgfVxuXG4gICAgLy8gd2hlbmV2ZXIgYSBnYW1lIGlzIHN0YXJ0ZWQsIGNhbGwgbmV3R2FtZSEhXG4gICAgbmV3R2FtZSgpe1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwfHwhdGhpcy5fZ2FtZSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gdm9vciB0ZSBiZXJlaWRlbiBvbSB0ZSBzcGVsZW4uXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkcz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpOyAvLyBiZXR0ZXIgZG9uZSB0aGlzIHdheSBpbnN0ZWFkIG9mIHRoaXMuX2NhcmRzPVtdXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiTm9nIFwiK251bWJlck9mQ2FyZHMrXCIga2FhcnRlbiBpbiBkZSBoYW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZhdWx0IHBsYXllciByZW1lbWJlcmluZyBpdHMgY2hvaWNlc1xuICAgICAgICB0aGlzLl9iaWQ9LTE7IC8vIHRoZSBsYXN0IGJpZCBvZiB0aGlzIHBsYXllclxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX2NhcmQ9bnVsbDtcbiAgICAgICAgLy8gdGhlIGdhbWUgYmVpbmcgcGxheWVkLCBhbmQgdGhlIGluZGV4IHdpdGhpbiB0aGF0IGdhbWVcbiAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uPVtdOyAvLyB0aGUgdHJpY2tzIHdvbiAoaW4gYW55IGdhbWUpXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW49LTE7IC8vIGRvZXNuJ3QgbWF0dGVyXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZSxwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbmFtZT1uYW1lO1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycz1bXTtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgICAgICBpZighKHBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgZXZlbnQgbGlzdGVuZXIgb2Ygd3JvbmcgdHlwZS5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVjZWl2aW5nIGdhbWUgYW5kIGluZGV4XG4gICAgICAgIHRoaXMuX2luZGV4PS0xO3RoaXMuX2dhbWU9bnVsbDsgLy8gd2FpdGluZyBmb3IgdGhlIGdhbWUgdG8gYmUgcGx1Z2dlZCBpbiAob25jZSlcbiAgICAgICAgLy8gcmVtb3ZlZCB3YWl0IHVudGlsIGdldHRpbmcgY2FsbGVkIHRocm91Z2ggbmV3R2FtZTogdGhpcy5fcHJlcGFyZUZvclBsYXlpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gZ2V0dGVycyBleHBvc2luZyBpbmZvcm1hdGlvbiB0byB0aGUgbWFkZSBjaG9pY2VcbiAgICAvLyBOT1RFIG5vIGxvbmdlciBjYWxsZWQgYnkgdGhlIGdhbWUgYmVjYXVzZSB0aGUgY2hvaWNlIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCBub3dcbiAgICAvLyAgICAgIHRoaXMgd2F5IHN1YmNsYXNzZXMgYXJlIG5vdCBvYmxpZ2F0ZWQgdG8gcmVtZW1iZXIgdGhlIGNob2ljZXMgdGhleSBtYWtlXG4gICAgZ2V0IGJpZCgpe3JldHVybiB0aGlzLl9iaWQ7fVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXQgY2FyZCgpe3JldHVybiB0aGlzLmNhcmQoKTt9XG5cbiAgICBnZXQgcGFydG5lcigpe3JldHVybiB0aGlzLl9wYXJ0bmVyO31cblxuICAgIC8vLy8vLy8vLy8vLy8vZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZFBsYXlJbmRleF07fVxuXG4gICAgLyogY2FuIGJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgZ2FtZVxuICAgIC8vIGNhbiBiZSBzZXQgZGlyZWN0bHkgd2hlbiBhIGJldHRlciAncmlrJyB2YXJpYXRpb24gYmlkIHdhcyBkb25lISEhIVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIFxuICAgIC8vIFRPRE8gaXQgd291bGQgYmUgZWFzaWVyIHRvIGNvbWJpbmUgdGhlc2UgaW4gYSBjYXJkISEhIVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuXG4gICAgLy8gY2FsbGVkIGZyb20gdGhlIFVJIHRvIHNldCB0aGUgdHJ1bXAgc3VpdGUhISEhXG4gICAgc2V0IHRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO3RoaXMudHJ1bXBTdWl0ZUNob3NlbigpO31cbiAgICBzZXQgcGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLnBhcnRuZXJTdWl0ZUNob3NlbigpO31cbiAgICAqL1xuXG4gICAgLy8gZW5kIG9mIGdldHRlcnMvc2V0dGVycyB1c2VkIGJ5IHRoZSBnYW1lXG4gICAgX3JlbW92ZUNhcmRzKCl7d2hpbGUodGhpcy5fY2FyZHMubGVuZ3RoPjApdGhpcy5fY2FyZHMuc2hpZnQoKS5ob2xkZXI9bnVsbDt9XG5cbiAgICBnZXQgZ2FtZSgpe3JldHVybiB0aGlzLl9nYW1lO31cbiAgICBzZXQgZ2FtZShnYW1lKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZT09PWdhbWUpcmV0dXJuO1xuICAgICAgICBpZihnYW1lJiYhKGdhbWUgaW5zdGFuY2VvZiBQbGF5ZXJHYW1lKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJTcGVsIG5pZXQgdmFuIGhldCBqdWlzdGUgdHlwZS5cIik7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDApXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiUG9zaXRpZSB2YW4gc3BlbGVyIG9uYmVrZW5kLlwiKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gTURIQDExSkFOMjAyMDogaWYgdGhlIGdhbWUgY2hhbmdlcyB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBjYXJkc1xuICAgICAgICB0aGlzLl9nYW1lPWdhbWU7XG4gICAgICAgIC8vIHN5bmMgX2luZGV4XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgLy8gcHJlcGFyZSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5wYXJ0bmVyPS0xOyAvLyBteSBwYXJ0bmVyIChvbmNlIEkgbm93IHdobyBpdCBpcylcbiAgICAgICAgICAgIHRoaXMudHJpY2tzV29uPVtdOyAvLyBzdG9yaW5nIHRoZSB0cmlja3Mgd29uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaW5kZXgoKXtyZXR1cm4gdGhpcy5faW5kZXg7fSAvLyBNREhAMjJKQU4yMDIwOiBubyBoYXJtIGluIGFkZGluZyBhIGdldHRlciEhIVxuICAgIHNldCBpbmRleChpbmRleCl7dGhpcy5faW5kZXg9aW5kZXg7fSAvLyBNREhAMDlKQU4yMDIwOiBzb21ldGltZXMgYW4gaW5kZXggY2FuIGJlIHNldCBzZXBhcmF0ZWx5XG5cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIHRoZSBnYW1lIHBsYXllZCBhdCBpbmRleCBcIitpbmRleCtcIi5cIik7XG4gICAgICAgIHRoaXMuaW5kZXg9aW5kZXg7XG4gICAgICAgIHRoaXMuZ2FtZT1nYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgcmVnaXN0ZXJlZCFcIik7XG4gICAgfVxuICAgIC8qXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgc3VwZXIuYWRkQ2FyZChjYXJkKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMrXCInIHJlY2VpdmVkIGNhcmQgJ1wiK2NhcmQrXCInLlwiKTtcbiAgICB9XG4gICAgKi9cbiAgICBfZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSx3aGVuTm90Rm91bmRDYXJkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybihjYXJkLnN1aXRlPT1jYXJkU3VpdGUpO30pO1xuICAgIH1cblxuICAgIF9nZXRTdWl0ZUNhcmRzKCl7XG4gICAgICAgIHRoaXMubG9nKFwiRGV0ZXJtaW5pbmcgc3VpdGUgY2FyZHMgb2YgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzIVwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZHM9W1tdLFtdLFtdLFtdXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntzdWl0ZUNhcmRzW2NhcmQuc3VpdGVdLnB1c2goY2FyZCk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZUNhcmRzO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBvZiBhIGdpdmVuIGNhcmQgc3VpdGUgKG9yIGFueSBjYXJkIGlmIGNhcmRTdWl0ZSBpcyB1bmRlZmluZWQpXG4gICAgY29udHJpYnV0ZVRvVHJpY2sodHJpY2spIHtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPT0wKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIGthYXJ0ZW4gbWVlciBvbSB0ZSBzcGVsZW4hXCIpO1xuICAgICAgICBsZXQgY2FyZHNPZlN1aXRlPXRoaXMuX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUpO1xuICAgICAgICBsZXQgY2FyZD0oY2FyZHNPZlN1aXRlJiZjYXJkc09mU3VpdGUubGVuZ3RoPjA/Y2FyZHNPZlN1aXRlWzBdOnRoaXMuX2NhcmRzWzBdKTtcbiAgICAgICAgY2FyZC5ob2xkZXI9dHJpY2s7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhlIHRyaWNrXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE1ESDogYWxsIG1ldGhvZHMgdGhhdCBkZWFsIHdpdGggcHJvY2Vzc2luZyBhIGJpZCwgYSBjYXJkLCB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIGNob2ljZVxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgbWFkZSBhIGJpZFxuICAgIF9iaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gaW4gdGUgYmllZGVuIVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXNzaW5nIGJpZCBcIitiaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIHRvIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUuYmlkTWFkZShiaWQpO1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiByZXR1cm5pbmcgdHJ1ZSBvbiBzdWNjZXNzICh3aGVuIF9iaWRNYWRlIGRpZCBub3QgcmV0dXJuIGFuIGVycm9yKVxuICAgIF9zZXRCaWQoYmlkKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX2JpZE1hZGUoYmlkKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9iaWQ9YmlkO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXsoIWV2ZW50TGlzdGVuZXJ8fGV2ZW50TGlzdGVuZXIuYmlkTWFkZSh0aGlzLl9iaWQpKTt9Y2F0Y2goZXJyb3Ipe319KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gY2FyZFBsYXllZCBpbiBSaWtrZW5UaGVHYW1lIGNhbiBub3cgcmV0dXJuIGFuIGVycm9yIChpbnN0ZWFkIG9mIHRocm93aW5nIG9uZSlcbiAgICBfY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4ga2FhcnQgaW4gdGUgc3BlbGVuIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUuY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICB9XG4gICAgLy8gVE9ETyBhIGJpZCBzZXR0ZXIgd2lsbCBhbGxvdyBzdWJjbGFzc2VzIHRvIHBhc3MgYSBiaWQgYnkgc2V0dGluZyB0aGUgcHJvcGVydHlcbiAgICBfc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgLy8gdGVjaG5pY2FsbHkgY2hlY2tpbmcgd2hldGhlciB0aGUgcGxheWVkIGNhcmQgaXMgdmFsaWQgc2hvdWxkIGJlIGRvbmUgaGVyZSwgb3IgQkVGT1JFIGNhbGxpbmcgc2V0Q2FyZFxuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9jYXJkPWNhcmQ7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIuY2FyZFBsYXllZCh0aGlzLl9jYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9vc2VuIGEgdHJ1bXAgc3VpdGVcbiAgICBfdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4gdHJvZWZrbGV1ciBpbiB0ZSBraWV6ZW4hXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS50cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX3RydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnRydW1wU3VpdGVDaG9zZW4odGhpcy5fdHJ1bXBTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvc2VuIGEgcGFydG5lclxuICAgIF9wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4gcGFydG5lciAoa2FhcnRrbGV1cikgdGUga2llemVuLlwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX3BhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIucGFydG5lclN1aXRlQ2hvc2VuKHRoaXMuX3BhcnRuZXJTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBtYWtlIGEgYmlkIHBhc3NpbmcgaW4gdGhlIGhpZ2hlc3QgYmlkIHNvIGZhclxuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBtYWtlQUJpZChwbGF5ZXJiaWRzKXtcbiAgICAgICAgLy8gYXNzdW1lcyB0aGF0IHRoaXMgcGxheWVyIGhhcyBtYWRlIGEgYmlkIGJlZm9yZSwgb3IgdGhhdCB0aGlzIGlzIHRoZSBmaXJzdCBiaWRcbiAgICAgICAgLy8gdGhpcyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdG8gYmUgcnVubmluZyBpbiBhIGJyb3dzZXIgc28gd2UgY2FuIHVzZSBwcm9tcHQoKVxuICAgICAgICAvLyBhbGwgb3RoZXIgYXZhaWxhYmxlIGJpZHMgc2hvdWxkIGJlIGJldHRlciB0aGFuIHRoZSBsYXN0IGJpZCBieSBhbnkgb3RoZXIgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkU29GYXI9UGxheWVyR2FtZS5CSURfUEFTO1xuICAgICAgICBpZihwbGF5ZXJiaWRzKXtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUGxheWVyIGJpZHM6XCIscGxheWVyYmlkcyk7XG4gICAgICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJiaWRzLmxlbmd0aDtwbGF5ZXIrKylcbiAgICAgICAgICAgICAgICBpZihwbGF5ZXJiaWRzW3BsYXllcl0ubGVuZ3RoPjAmJnBsYXllcmJpZHNbcGxheWVyXVswXT5oaWdoZXN0QmlkU29GYXIpXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hlc3RCaWRTb0Zhcj1wbGF5ZXJiaWRzW3BsYXllcl1bMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2coXCJIaWdoZXN0IGJpZCBzbyBmYXI6ICdcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdK1wiJy5cIik7XG4gICAgICAgIC8vIGlmIHRoZSBoaWdoZXN0IHBvc3NpYmxlIGJpZCBpcyBub3QgYSBiaWQgYWxsIGNhbiBwbGF5IChhdCB0aGUgc2FtZSB0aW1lKSwgY2FuJ3QgYmUgYmlkIGFnYWluXG4gICAgICAgIGlmKFBsYXllckdhbWUuQklEU19BTExfQ0FOX1BMQVkuaW5kZXhPZihQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdKTwwKWhpZ2hlc3RCaWRTb0ZhcisrO1xuICAgICAgICBsZXQgcG9zc2libGVCaWROYW1lcz1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5zbGljZShoaWdoZXN0QmlkU29GYXIpO1xuICAgICAgICBwb3NzaWJsZUJpZE5hbWVzLnVuc2hpZnQoUGxheWVyR2FtZS5CSURfTkFNRVNbUGxheWVyR2FtZS5CSURfUEFTXSk7IC8vIHVzZXIgY2FuIGFsd2F5cyAncGFzJ1xuICAgICAgICB0aGlzLmxvZyhcIlBvc3NpYmxlIGJpZHM6IFwiLHBvc3NpYmxlQmlkTmFtZXMpO1xuICAgICAgICBsZXQgYmlkPS0xO1xuICAgICAgICB3aGlsZShiaWQ8MCl7XG4gICAgICAgICAgICBsZXQgYmlkbmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgaXMgeW91ciBiaWQgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUJpZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVCaWROYW1lc1swXSk7XG4gICAgICAgICAgICBiaWQ9UGxheWVyR2FtZS5CSURfTkFNRVMuaW5kZXhPZihiaWRuYW1lKTtcbiAgICAgICAgICAgIGlmKGJpZDwwKWNvbnRpbnVlO1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEJpZChiaWQpO1xuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICBiaWQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIC8vIGlmIHRoaXMgcGxheWVyIGhhcyBhbGwgYWNlcyBpdCdzIGdvbm5hIGJlIHRoZSBzdWl0ZSBvZiBhIGtpbmcgdGhlIHBlcnNvbiBoYXNuJ3RcbiAgICAgICAgLy8gYWxzbyBpdCBuZWVkcyB0byBiZSBhbiBhY2Ugb2YgYSBzdWl0ZSB0aGUgdXNlciBoYXMgaXRzZWxmICh1bmxlc3MgeW91IGhhdmUgYWxsIG90aGVyIGFjZXMpXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIC8vIGFueSBvZiB0aGUgc3VpdGVzIGluIHRoZSBjYXJkcyBjYW4gYmUgdGhlIHRydW1wIHN1aXRlIVxuICAgICAgICBsZXQgcG9zc2libGVUcnVtcFN1aXRlTmFtZXM9dGhpcy5nZXRTdWl0ZXMoKS5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHRydW1wU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgdHJ1bXBOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBzdWl0ZSB3aWxsIGJlIHRydW1wIChvcHRpb25zOiAnXCIrcG9zc2libGVUcnVtcFN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVRydW1wU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICB0cnVtcFN1aXRlPXBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmluZGV4T2YodHJ1bXBOYW1lKTtcbiAgICAgICAgICAgIGlmKHRydW1wU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogYXNrcyBmb3IgdGhlIHN1aXRlIG9mIHRoZSBwYXJ0bmVyIGNhcmQgb2YgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoKXtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1SQU5LX0FDRTtcbiAgICAgICAgLy8gZ2V0IGFsbCB0aGUgYWNlbGVzcyBzdWl0ZXNcbiAgICAgICAgbGV0IHN1aXRlcz10aGlzLmdldFN1aXRlcygpO1xuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPT0wKXsgLy8gcGxheWVyIGhhcyBBTEwgYWNlc1xuICAgICAgICAgICAgaWYoc3VpdGVzLmxlbmd0aDw0KXsgLy8gYnV0IG5vdCBhbGwgc3VpdGVzXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZSBzdWl0cyB0aGUgdXNlciBkb2VzIG5vdCBoYXZlIGFyZSBhbGxvd2VkIChhc2tpbmcgdGhlIGFjZSBibGluZCEhISlcbiAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9WzAsMSwyLDNdLmZpbHRlcigoc3VpdGUpPT57cmV0dXJuIHBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHN1aXRlKTwwO30pO1xuICAgICAgICAgICAgfWVsc2V7IC8vIGhhcyBhbGwgc3VpdHMsIHNvIGEga2luZyBpcyB0byBiZSBzZWxlY3RlZCEhIVxuICAgICAgICAgICAgICAgIC8vIGFsbCBraW5ncyBhY2NlcHRhYmxlIGV4Y2VwdCBmb3IgdGhhdCBpbiB0aGUgdHJ1bXAgY29sb3JcbiAgICAgICAgICAgICAgICAvLyBOT1RFIGlmIGEgcGVyc29uIGFsc28gaGFzIGFsbCB0aGUga2luZ3Mgd2UgaGF2ZSBhIHNpdHVhdGlvbiwgd2Ugc2ltcGx5IGNvbnRpbnVlIG9ud2FyZFxuICAgICAgICAgICAgICAgIHdoaWxlKDEpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuay0tO1xuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0cnVtcFN1aXRlSW5kZXg9cG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2YodGhpcy5fdHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRydW1wU3VpdGVJbmRleD49MClwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuc3BsaWNlKHRydW1wU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD4wKWJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcz1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHBhcnRuZXJTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGVOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBcIitDYXJkLkNBUkRfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdK1wiIHNob3VsZCB5b3VyIHBhcnRuZXIgaGF2ZSAob3B0aW9uczogJ1wiK3Bvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT1wb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmluZGV4T2YocGFydG5lclN1aXRlTmFtZSk7XG4gICAgICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgYW5kIGFkZCBpdCB0byB0aGUgZ2l2ZW4gdHJpY2tcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgcGxheUFDYXJkKHRyaWNrKXtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgYXNrZWQgdG8gcGxheSBhIGNhcmQuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgdXNpbmcgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlIGFscGhhYmV0P1xuICAgICAgICBsZXQgcG9zc2libGVDYXJkTmFtZXM9W107XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIHBvc3NpYmxlQ2FyZE5hbWVzLnB1c2goU3RyaW5nLmNhcmRJbmRleCsxKStcIjogXCIrdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgbGV0IGNhcmRQbGF5SW5kZXg9LTE7XG4gICAgICAgIHdoaWxlKGNhcmRQbGF5SW5kZXg8MCl7XG4gICAgICAgICAgICAvLyB3ZSdyZSBzdXBwb3NlZCB0byBwbGF5IGEgY2FyZCB3aXRoIHN1aXRlIGVxdWFsIHRvIHRoZSBmaXJzdCBjYXJkIHVubGVzcyB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGlzIGJlaW5nIGFza2VkIGZvclxuICAgICAgICAgICAgbGV0IGNhcmRJZD1wYXJzZUludChwcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiXFxuUHJlc3MgdGhlIGlkIG9mIHRoZSBjYXJkIHlvdSB3YW50IHRvIGFkZCB0byBcIit0cmljay5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQ2FyZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIsXCJcIikpO1xuICAgICAgICAgICAgaWYoaXNOYU4oY2FyZElkKSljb250aW51ZTtcbiAgICAgICAgICAgIGNhcmRQbGF5SW5kZXg9Y2FyZElkLTE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q2FyZCh0aGlzLl9jYXJkc1tjYXJkUGxheUluZGV4XSk7XG4gICAgfVxuXG4gICAgc2V0IHBhcnRuZXIocGFydG5lcil7dGhpcy5fcGFydG5lcj0odHlwZW9mIHBhcnRuZXI9PT0nbnVtYmVyJz9wYXJ0bmVyOi0xKTt9IC8vIHRvIHNldCB0aGUgcGFydG5lciBvbmNlIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgY2FyZCBpcyBpbiB0aGUgdHJpY2shISEhXG5cbiAgICB0cmlja1dvbih0cmlja0luZGV4KXtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uLnB1c2godHJpY2tJbmRleCk7XG4gICAgICAgIHRoaXMubG9nKFwiVHJpY2sgI1wiK3RyaWNrSW5kZXgrXCIgd29uIGJ5ICdcIit0aGlzLm5hbWUrXCInOiBcIit0aGlzLl90cmlja3NXb24rXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlRyaWNrc1dvbigpe3JldHVybiB0aGlzLl90cmlja3NXb24ubGVuZ3RoO31cbiAgICBcbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyByZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiB0cmlja3Mgd29uIChpbmNsdWRpbmcgdGhvc2UgYnkgdGhlIHBhcnRuZXIgKGlmIGFueSkpXG4gICAgICAgIHJldHVybih0aGlzLm51bWJlck9mVHJpY2tzV29uK3RoaXMuX2dhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLnBhcnRuZXIpKTtcbiAgICB9XG5cbiAgICBzZXROdW1iZXJPZlRyaWNrc1RvV2luKG51bWJlck9mVHJpY2tzVG9XaW4pe3RoaXMuX251bWJlck9mVHJpY2tzVG9XaW49bnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzVG9XaW4oKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgXG4gICAgLy8gZXZlcnkgcGxheWVyIGNhbiBiZSBjaGVja2VkIHdoZXRoZXIgZnJpZW5kICgxKSBvciBmb28gKC0xKSBvciB1bmtub3duICgwKVxuICAgIGlzRnJpZW5kbHkocGxheWVyKXtcbiAgICAgICAgaWYocGxheWVyPT09dGhpcy5faW5kZXgpcmV0dXJuIDI7IC8vIEknbSBtdWNobyBmcmllbmRseSB0byBteXNlbGZcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApeyAvLyBhIG5vbi1zb2xpdGFyeSBnYW1lXG4gICAgICAgICAgICAvLyBBU1NFUlQgbm90IGEgc29saXRhcnkgZ2FtZSBzbyBwbGF5ZXIgY291bGQgYmUgdGhlIHBhcnRuZXIgaW4gY3JpbWVcbiAgICAgICAgICAgIC8vIGlmIHBhcnRuZXIgaXMga25vd24gKGkuZS4gdGhlIHBhcnRuZXIgY2FyZCBpcyBubyBsb25nZXIgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyPj0wKXJldHVybihwbGF5ZXI9PT10aGlzLl9wYXJ0bmVyPzE6LTEpOyBcbiAgICAgICAgICAgIC8vIEFTU0VSVCBwYXJ0bmVyIHVua25vd24gKGkuZS4gcGFydG5lciBjYXJkIHN0aWxsIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgbGV0IHRydW1wUGxheWVyPXRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKTtcbiAgICAgICAgICAgIC8vIGlmIEknbSB0aGUgdHJ1bXAgcGxheWVyLCBhc3N1bWUgQUxMIHVuZnJpZW5kbHkgQlVUIG5vIEkgZG9uJ3Qga25vdyB3aG8gbXkgcGFydG5lciBpcyBhbGwgY291bGQgYmVcbiAgICAgICAgICAgIGlmKHRoaXMuX2luZGV4PT09dHJ1bXBQbGF5ZXIpcmV0dXJuIDA7IC8vIHVua25vd25cbiAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSx0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCkpKSAvLyBJIGhhdmUgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PXRydW1wUGxheWVyPzE6LTEpOyAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZyaWVuZGx5LCB0aGUgb3RoZXJzIGFyZSB1bmZyaWVuZGx5XG4gICAgICAgICAgICAvLyBBU1NFUlQgSSdtIG5vdCB0aGUgdHJ1bXAgcGxheWVyLCBhbmQgSSdtIG5vdCB3aXRoIHRoZSB0cnVtcCBwbGF5ZXIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmb28sIHRoZSByZXN0IEkgZG9uJ3Qga25vdyB5ZXRcbiAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PT10cnVtcFBsYXllcj8tMTowKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgYSBzb2xpdGFyeSBnYW1lXG4gICAgICAgIC8vIGlmIEknbSBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnMsIGV2ZXJ5b25lIGVsc2UgaXMgYSBmb29cbiAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YodGhpcy5faW5kZXgpPj0wKXJldHVybiAtMTtcbiAgICAgICAgLy8gQVNTRVJUIG5vdCBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnNcbiAgICAgICAgLy8gICAgICAgIGlmIHBsYXllciBpcyBhIHNvbGl0YXJ5IHBsYXllciBpdCdzIGEgZm9vLCBvdGhlcndpc2UgaXQncyB1cyBhZ2FpbnN0IHRoZW0hISEhXG4gICAgICAgIHJldHVybih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZihwbGF5ZXIpPj0wPy0xOjEpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIHRoaXMubmFtZTt9XG5cbn1cblxuLy8gZXhwb3J0IHRoZSBQbGF5ZXIgY2xhc3Ncbm1vZHVsZS5leHBvcnRzPXtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfTsiLCJjb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpOyAvLyBmb3IgY29tcGFyaW5nIGNhcmRzXG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG5jbGFzcyBUcmljayBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICAvLyBNREhAMDdERUMyMDE5OiBnYW1lIGRhdGEgbW92ZWQgb3ZlciB0byBQbGF5ZXJHYW1lIGluc3RhbmNlIChhcyBwYXNzZWQgdG8gZWFjaCBwbGF5ZXIpXG4gICAgLy8gICAgICAgICAgICAgICAgY2FuQXNrRm9yUGFydG5lckNhcmQgYmxpbmQgbm93IGRldGVybWluZWQgYnkgdGhlIGdhbWUgKGVuZ2luZSkgaXRzZWxmXG5cbiAgICAvLyBieSBwYXNzaW5nIGluIHRoZSB0cnVtcCBwbGF5ZXIgKGkuZS4gdGhlIHBlcnNvbiB0aGF0IGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgY29uc3RydWN0b3IoZmlyc3RQbGF5ZXIsdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssY2FuQXNrRm9yUGFydG5lckNhcmQsZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKXsgLy8gcmVwbGFjaW5nOiB0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayx0cnVtcFBsYXllcil7XG4gICAgICAgIHN1cGVyKCk7IC8vIHVzaW5nIDQgZml4ZWQgcG9zaXRpb25zIGZvciB0aGUgdHJpY2sgY2FyZHMgc28gd2Ugd2lsbCBrbm93IHdobyBwbGF5ZWQgdGhlbSEhISFcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXI9Zmlyc3RQbGF5ZXI7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTsgLy8gZm9yIGludGVybmFsIHVzZSB0byBiZSBhYmxlIHRvIGRldGVybWluZSB0aGUgd2lubmVyIG9mIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLl9wYXJ0bmVyUmFuaz1wYXJ0bmVyUmFuazsgLy8gbmVlZCB0aGlzIHdoZW4gaXQncyBiZWluZyBhc2tlZCB0byBkZXRlcm1pbmUgdGhlIHdpbm5lclxuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD1jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDsgLy8gLTEgYmxpbmQsIDAgbm90LCAxIG5vbi1ibGluZFxuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB0aGUgJ2ZsYWcnIHNldCBieSB0aGUgdHJ1bXAgcGxheWVyIHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPS0xOyAvLyB0aGUgc3VpdGUgb2YgdGhlIHRyaWNrIChtb3N0IG9mIHRoZSB0aW1lIHRoZSBzdWl0ZSBvZiB0aGUgZmlyc3QgY2FyZClcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD0tMTsgLy8gdGhlIGNhcmQgb2YgdGhlIHdpbm5lciAobm90ZTogTk9UIHRyYW5zZm9ybWVkIHRvIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IHlldClcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzPWZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcztcbiAgICAgICAgLy8gbGV0J3Mga2VlcCB0cmFjayBvZiB0aGUgaGlnaGVzdCBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBjYW4gYXNrIGZvciBwYXJ0bmVyIGNhcmQ6IFwiK2NhbkFza0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGZpcnN0IHBsYXllciBjYW4gcGxheSBzcGFkZXM6IFwiK2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcytcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIGdldCBmaXJzdFBsYXllckNhblBsYXlTcGFkZXMoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO31cbiAgICBcbiAgICAvLyB0aGUgd2lubmVyIGV4cG9zZWQgaXMgdGhlIGFjdHVhbCBwbGF5ZXIgd2hvIHdvblxuICAgIGdldCB3aW5uZXIoKXtyZXR1cm4odGhpcy5fd2lubmVyQ2FyZDwwPy0xOih0aGlzLl93aW5uZXJDYXJkK3RoaXMuX2ZpcnN0UGxheWVyKSU0KTt9XG4gICAgXG4gICAgLy8gTURIQDA3REVDMjAxOTogbW92ZWQgZnJvbSBoZXJlIHRvIHRoZSBnYW1lIChhcyBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gICAgLypcbiAgICBnZXQgdHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fSAvLyBleHBvc2VzIHRoZSBjdXJyZW50IHRydW1wIHBsYXllclxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgICovXG4gICAgZ2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkO31cblxuICAgIC8vIHBhc3MgaW4gLTEgd2hlbiBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZCwgb3IgKzEgd2hlbiBhc2tpbmcgZm9yIGl0IChub24tYmxpbmQpXG4gICAgc2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodHlwZW9mIGFza2luZ0ZvclBhcnRuZXJDYXJkIT09XCJudW1iZXJcIil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBOT1QgZGVmaW5lZCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMubnVtYmVyT2ZDYXJkcz4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3BnZXZlbiBkZSBwYXJ0bmVyIGFhcy9oZWVyIChibGluZCkgdGUgdnJhZ2VuIG5pZXQgbWVlciB0b2VnZXN0YWFuLlwiKTtcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgc2V0IHRvIFwiK3RoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICBfc2V0V2lubmVyQ2FyZCh3aW5uZXJDYXJkKXtcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD13aW5uZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIHdpbm5lciBjYXJkOiBcIit3aW5uZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBjYXJkIHBsYXllZCBieSAodGhlIGFjdHVhbCkgcGxheWVyIChhcyB1c2VkIGZvciBzaG93aW5nIHRoZSB0cmljayBjYXJkcylcbiAgICAgKiBAcGFyYW0geyp9IHBsYXllciBcbiAgICAgKi9cbiAgICBnZXRQbGF5ZXJDYXJkKHBsYXllcil7XG4gICAgICAgIGxldCBwbGF5ZXJDYXJkPSh0aGlzLl9maXJzdFBsYXllcj49MD8ocGxheWVyKzQtdGhpcy5fZmlyc3RQbGF5ZXIpJTQ6bnVsbCk7XG4gICAgICAgIHJldHVybihwbGF5ZXJDYXJkPj0wJiZwbGF5ZXJDYXJkPHRoaXMubnVtYmVyT2ZDYXJkcz90aGlzLl9jYXJkc1twbGF5ZXJDYXJkXTpudWxsKTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSB0aGUgZmlyc3QgcGxheWVyIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICBpZighdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgKGFueW1vcmUpLlwiKTtcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPXRoaXMuX3RydW1wU3VpdGU7IC8vIHRoZSBwbGF5IHN1aXRlIGJlY29tZXMgdGhlIHRydW1wIHN1aXRlXG4gICAgfVxuICAgICovXG4gICAgLy8gTk9URSBhZGRDYXJkIGlzIE5PVCBfYWRkQ2FyZCBvZiB0aGUgc3VwZXJjbGFzcyEgdGhpcyBpcyBiZWNhdXNlIHdlIHNob3VsZCBzZXQgdGhlIGhvbGRlciBvbiB0aGUgY2FyZCB0byBhZGQhISEhXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICAgLy8gaWYgdGhlIGZsYWcgb2YgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIGlzIHNldCwgcHJlc2V0IHRoZSBcbiAgICAgICAgY2FyZC5ob2xkZXI9dGhpczsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGlzIHRyaWNrIGJ5IHNldHRpbmcgdGhlIGhvbGRlciBwcm9wZXJ0eSAod2lsbCB0YWtlIGNhcmUgb2YgYWRkaW5nL3JlbW92aW5nIHRoZSBjYXJkKVxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBzaG91bGQgY29uc2lkZXIgcmV0dXJuaW5nIGFuIEVycm9yIGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXJyb3JcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPD1udW1iZXJPZkNhcmRzTm93KVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkZhaWxlZCB0byBhZGQgdGhlIGNhcmQgdG8gdGhlIHRyaWNrLlwiKTtcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQgYWRkZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLl90cnVtcFN1aXRlPDApXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiQlVHOiBBc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQsIGJ1dCBwbGF5aW5nIGEgZ2FtZSB3aXRob3V0IHRydW1wLlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yIGJsaW5kIGV2ZXJ5b25lIGhhcyB0byBwbGF5IHRoZSBwYXJ0bmVyIGNhcmQgc3VpdGVcbiAgICAgICAgLy8gTURIQDA5REVDMjAxOTogT09QUyBJIHdhcyBhbHJlYWR5IHVzaW5nIHRoaXMuX3BhcnRuZXJTdWl0ZSBoZXJlIEJVVCBzdGlsbCBhZnRlciBhY3R1YWxseSB0YWtpbmcgaXQgb3V0IChub3cgaW4gYWdhaW4pXG4gICAgICAgIGlmKHRoaXMuX3BsYXlTdWl0ZTwwKXsgLy8gZmlyc3QgY2FyZCBiZWluZyBwbGF5ZWRcbiAgICAgICAgICAgIC8vIE1ESEAxOEpBTjIwMjA6IGFzY2VydGFpbiB0aGF0IF9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCBoYXMgdGhlIHJpZ2h0IHZhbHVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBjb3VsZCBiZSAwIGJ1dCB3aGVuIHRoZSBwYXJ0bmVyIHN1aXRlIGlzIHBsYXllZCB0aGUgcGxheWVyIElTIGFza2luZ1xuICAgICAgICAgICAgaWYodGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQhPT0wKXsgLy8gcGxheWVyIHN1cHBvc2VkbHkgY2FuIHN0aWxsIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPD0wJiZjYXJkLnN1aXRlPT09dGhpcy5fcGFydG5lclN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MCl0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IENhbm5vdCBhc2sgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiSW1wbGljaXRseSBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYnkgcGxheWluZyB0aGUgcGFydG5lciBzdWl0ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPT0wKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiQ2Fubm90IGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCB3aGVuIHlvdSBjYW4ndCBhc2sgZm9yIGl0IGFueW1vcmUhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcGxheVN1aXRlPSh0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDwwP3RoaXMuX3BhcnRuZXJTdWl0ZTpjYXJkLnN1aXRlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgdGhpcy5fcGxheVN1aXRlIG5vdyBkZWZpbml0ZWx5IG5vbi1uZWdhdGl2ZSwgc29cbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9MDsgLy8gdXNlIHRoZSByaWdodCBwcm9wZXJ0eSBicm8nXG4gICAgICAgIC8vIHVwZGF0ZSB3aW5uZXJcbiAgICAgICAgaWYobnVtYmVyT2ZDYXJkc05vdz4wKXtcbiAgICAgICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIG9ubHkgdGhlIHBhcnRuZXIgY2FyZCBjYW4gZXZlciB3aW4gKGV2ZW4gaWYgdGhlcmUncyB0cnVtcCEhKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnV0IHdlIG5lZWQgdG8ga25vdyB3aGV0aGVyIHRoZSBwYXJ0bmVyIGNhcmQgd2FzIGFscmVhZHkgdGhyb3duXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBTT0xVVElPTjogKE5FQVQpIGl0J3MgZWFzaWVzdCB0byBzaW1wbHkgaWdub3JlIHRydW1wIGlzIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yISEhISEhXG4gICAgICAgICAgICBpZihDYXJkLmNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkLHRoaXMuX2NhcmRzW3RoaXMuX3dpbm5lckNhcmRdLHRoaXMuX3BsYXlTdWl0ZSwodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPTA/LTE6dGhpcy5fdHJ1bXBTdWl0ZSkpPjApXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZChudW1iZXJPZkNhcmRzTm93KTtcbiAgICAgICAgfWVsc2UgLy8gYWZ0ZXIgdGhlIGZpcnN0IGNhcmQgdGhlIGZpcnN0IHBsYXllciBpcyB0aGUgd2lubmVyIG9mIGNvdXJzZVxuICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZCgwKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldENhcmRQbGF5ZXIoc3VpdGUscmFuayl7XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMuX2NhcmRzLmxlbmd0aDtjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzW2NhcmRJbmRleF0uc3VpdGU9PT1zdWl0ZSYmdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5yYW5rPT09cmFuaylcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZpcnN0UGxheWVyK2NhcmRJbmRleCklNDsgLy8gVE9ETyBjYW4gd2UgYXNzdW1lIDQgcGxheWVycyBpbiB0b3RhbD8/Pz8/XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgZ2V0dGVyc1xuICAgIGdldCBwbGF5U3VpdGUoKXtyZXR1cm4gdGhpcy5fcGxheVN1aXRlO31cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgLypcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICAqL1xuICAgIGdldCBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDt9XG59XG5cbm1vZHVsZS5leHBvcnRzPVRyaWNrO1xuIiwiLyoqXG4gKiB0aGUgcGFydCB0aGF0IHJ1bnMgaW4gdGhlIGJyb3dzZXIgb2YgYSBzaW5nbGUgcGxheWVyXG4gKiBnaXZlbiB0aGF0IGFueSBpbmZvcm1hdGlvbiB0byB0aGUgY3VycmVudCBwbGF5ZXIgb2YgdGhlIGdhbWUgc2hvdWxkIGJlIGF2YWlsYWJsZSB0aHJvdWdoIGl0J3MgX2dhbWUgcHJvcGVydHkgKGkuZS4gYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICogYWxsIGNhbGxzIGluIG1haW4uanMgdG8gcmlra2VuVGhlR2FtZSBkaXJlY3RseSBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCBjYWxscyB0byBjdXJyZW50UGxheWVyLmdhbWUgaS5lLiByaWtrZW5UaGVHYW1lIGl0c2VsZiBpcyBubyBsb25nZXIgYXZhaWxhYmxlIHRvIHRoZSBjdXJyZW50UGxheWVyISEhXG4gKiBcbioqL1xuLy8gd2UnbGwgYmUgdXNpbmcgUGxheWVyLmpzIG9ubHkgKFBsYXllci5qcyB3aWxsIGRlYWwgd2l0aCByZXF1aXJpbmcgQ2FyZEhvbGRlciwgYW5kIENhcmRIb2xkZXIgQ2FyZClcbi8vIE5PIEkgbmVlZCB0byByZXF1aXJlIHRoZW0gYWxsIG90aGVyd2lzZSBicm93c2VyaWZ5IHdvbid0IGJlIGFibGUgdG8gZmluZCBDYXJkLCBldGMuXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcbmNvbnN0IFRyaWNrPXJlcXVpcmUoJy4vVHJpY2suanMnKTsgLy8gbm93IGluIHNlcGFyYXRlIGZpbGVcbmNvbnN0IHtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfT1yZXF1aXJlKCcuL1BsYXllci5qcycpO1xuXG5jbGFzcyBMYW5ndWFnZXtcbiAgICBzdGF0aWMgZ2V0IERFRkFVTFRfUExBWUVSUygpe3JldHVybiBbW1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIl0sW1wiTWFyY1wiLFwiSnVyZ2VuXCIsXCJNb25pa2FcIixcIkFubmFcIixcIlwiXV07fTtcbiAgICAvLyBwb3NzaWJsZSByYW5rcyBhbmQgc3VpdGVzIChpbiBEdXRjaClcbiAgICBzdGF0aWMgZ2V0IERVVENIX1JBTktfTkFNRVMoKXtyZXR1cm4gW1widHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImJvZXJcIixcInZyb3V3XCIsXCJoZWVyXCIsXCJhYXNcIl07fTtcbiAgICBzdGF0aWMgZ2V0IERVVENIX1NVSVRFX05BTUVTKCl7cmV0dXJuIFtcInJ1aXRlblwiLFwia2xhdmVyZW5cIixcImhhcnRlblwiLFwic2Nob3BwZW5cIl07fTtcbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpe3JldHVybihzdHI/KHN0ci5sZW5ndGg/c3RyWzBdLnRvVXBwZXJDYXNlKCkrc3RyLnNsaWNlKDEpOlwiXCIpOlwiP1wiKTt9XG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGluZyBlbnRlcmluZyB0aGUgaWQgb2YgdGhlIHVzZXIgb24gcGFnZS1zZXR0aW5ncywgc28gd2UgZG8gbm90IG5lZWQgdG8gaW5zZXJ0IGEgbmV3IG9uZVxuLy8gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVseSB3ZSBjYW4gZG8gdGhhdCBvbiBhIHNlcGFyYXRlIHBhZ2UgLyBwYWdlLWF1dGggaXMgT0tcbi8vICAgICAgICAgICAgICAgIHdlIGdvIHRvIHBhZ2UtYXV0aCB3aGVuIE5PVCBwbGF5aW5nIHRoZSBnYW1lIGluIGRlbW8gbW9kZSEhIVxuLy8gICAgICAgICAgICAgICAgaW4gbm9uLWRlbW8gbW9kZSB5b3UgaWRlbnRpZnkgeW91cnNlbGYsIHRoZW4gd2hlbiBzZXRQbGF5ZXJOYW1lIGlzIHN1Y2Nlc3NmdWwgZ28gdG8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4vLyBNREhAMTBKQU4yMDIwOiByZW1vdmluZyBwYWdlLXNldHRpbmdzIGFuZCBwYWdlLXNldHVwLWdhbWUsIGFkZGluZyBwYWdlLWhlbHBcbmNvbnN0IFBBR0VTPVtcInBhZ2UtcnVsZXNcIixcInBhZ2UtaGVscFwiLFwicGFnZS1hdXRoXCIsXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIixcInBhZ2UtYmlkZGluZ1wiLFwicGFnZS10cnVtcC1jaG9vc2luZ1wiLFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIsXCJwYWdlLXBsYXktcmVwb3J0aW5nXCIsXCJwYWdlLXBsYXlpbmdcIixcInBhZ2UtZmluaXNoZWRcIl07XG5cbnZhciBjdXJyZW50UGFnZT1udWxsOyAvLyBsZXQncyBhc3N1bWUgdG8gYmUgc3RhcnRpbmcgYXQgcGFnZS1ydWxlc1xudmFyIHZpc2l0ZWRQYWdlcz1bXTsgLy8gbm8gcGFnZXMgdmlzaXRlZCB5ZXRcblxudmFyIGN1cnJlbnRQbGF5ZXI9bnVsbDsgLy8gdGhlIGN1cnJlbnQgZ2FtZSBwbGF5ZXJcblxudmFyIGN1cnJlbnRHYW1lPW51bGw7IC8vIHdlIHJlbWVtYmVyIHRoZSBnYW1lIHVudGlsIHdlIG5vIGxvbmdlciBuZWVkIGl0XG5cbmZ1bmN0aW9uIHN0b3BQbGF5aW5nKCl7XG4gICAgLy8gQVNTRVJUIGFzc3VtaW5nIG5vdCBwbGF5aW5nIGluIGEgZ2FtZSBhbnltb3JlIGkuZS4gbmV3R2FtZSgpIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmVcbiAgICAvLyBhIE5PUk1BTCBleGl0XG4gICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLmV4aXQoJ1NUT1AnKTtcbiAgICAvLyAnbWFudWFsbHknIG1vdmUgdG8gdGhlIHByZXZpb3VzICdwYWdlJyBpbiB0aGUgaGlzdG9yeS4uLlxuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbn1cblxuLy8gTURIQDEwSkFOMjAyMDogbmV3R2FtZSgpIGlzIGEgYmlkIGRpZmZlcmVudCB0aGFuIGluIHRoZSBkZW1vIHZlcnNpb24gaW4gdGhhdCB3ZSByZXR1cm4gdG8gdGhlIHdhaXRpbmctcGFnZVxuZnVuY3Rpb24gbmV3R2FtZSgpe1xuICAgIC8vIGJ5IGNhbGwgcGxheXNUaGVHYW1lQXRJbmRleChudWxsLD8pIHdlIGZvcmNlIGNsZWFyaW5nIHRoZSBnYW1lIGluZm9ybWF0aW9uIGJlaW5nIHNob3duIGF0IHRoZSB3YWl0LWZvci1wbGF5ZXJzIHBhZ2VcbiAgICBpZighY3VycmVudFBsYXllcil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogTm8gcGxheWVyIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCFcIik7XG4gICAgICAgIHN0b3BQbGF5aW5nKCk7XG4gICAgfWVsc2VcbiAgICAgICAgY3VycmVudFBsYXllci5wbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsLTEpO1xufVxuXG52YXIgZm9yY2VGb2N1c0lkPW51bGw7XG5mdW5jdGlvbiBzdG9wRm9yY2VGb2N1cygpe2NsZWFySW50ZXJ2YWwoZm9yY2VGb2N1c0lkKTtmb3JjZUZvY3VzSWQ9bnVsbDt9XG5mdW5jdGlvbiBjaGVja0ZvY3VzKHN0YXRlKXtcbiAgICAvLyBNREhAMjNKQU4yMDIwOiB3ZSBzaG91bGQga2VlcCBibGlua2luZyB3aGVuIG5vdCBpbiBmb2N1cyB1bnRpbCBmb3JjZWQgdG8gc3RvcFxuICAgIC8vICAgICAgICAgICAgICAgIGluc3RlYWQgb2Ygc3RvcHBpbmcgd2hlbiB0aGUgZm9jdXMgd2FzIGdvdFxuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xuICAgIC8vIHJlcGxhY2luZzogaWYoZG9jdW1lbnQuaGFzRm9jdXMoKSl7c2hvd0dhbWVTdGF0ZShzdGF0ZSk7c3RvcEZvcmNlRm9jdXMoKTt9ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xufVxuZnVuY3Rpb24gZm9yY2VGb2N1cyhzdGF0ZSl7XG4gICAgc2hvd0dhbWVTdGF0ZShzdGF0ZSk7IC8vIGVpdGhlciB0byBzaG93IHN0YXRlIG9yIHJlbW92ZSB3aGF0J3MgY3VycmVudGx5IHNob3duXG4gICAgaWYoc3RhdGUpeyAvLyBmb2N1cyByZXF1ZXN0ZWRcbiAgICAgICAgLy8gc3RhcnQgZ2V0dGluZyB0aGUgZm9jdXMgYnkgYmxpbmtpbmcgJ3N0YXRlJyBJRkYgd2UgaGF2ZW4ndCBnb3QgaXQgeWV0Li4uXG4gICAgICAgIGlmKCFmb3JjZUZvY3VzSWQpZm9yY2VGb2N1c0lkPXNldEludGVydmFsKCgpPT57Y2hlY2tGb2N1cyhzdGF0ZSk7fSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIG9mIGNvdXJzZTogZnJvbSBzdGFja292ZXJmbG93ISEhXG5mdW5jdGlvbiBkaWZmZXJlbmNlKGExLGEyKXt2YXIgYTJTZXQ9bmV3IFNldChhMik7cmV0dXJuIGExLmZpbHRlcigoeCk9PiFhMlNldC5oYXMoeCkpO31cblxudmFyIGJpZGRlckNhcmRzRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1jYXJkc1wiKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKXtcbiAgICBsZXQgYnV0dG9uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJpZGRlciBzdWl0ZWNhcmRzIGJ1dHRvbiBjbGlja2VkIVwiKTtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7IC8vIGEgaGEsIGRpZG4ndCBrbm93IHRoaXNcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5zdHlsZS5kaXNwbGF5PSh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4vLyAgICAgdmFyIHYgPSBkb2N1bWVudC5jb29raWUubWF0Y2goJyhefDspID8nICsgbmFtZSArICc9KFteO10qKSg7fCQpJyk7XG4vLyAgICAgcmV0dXJuIHYgPyB2WzJdIDogbnVsbDtcbi8vIH1cbi8vIGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuLy8gICAgIHZhciBkID0gbmV3IERhdGU7XG4vLyAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMCpkYXlzKTtcbi8vICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiO3BhdGg9LztleHBpcmVzPVwiICsgZC50b0dNVFN0cmluZygpO1xuLy8gfVxuLy8gZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHsgc2V0Q29va2llKG5hbWUsICcnLCAtMSk7IH1cblxuLyoqXG4gKiBzaG93cyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBjYXJkcyBwbGF5ZWQgdGFibGUgYXMgd2VsbFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBiaWRzIHRhYmxlXG4gICAgc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKTtcbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBmb3IobGV0IHBsYXllck5hbWVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZVwiKSlcbiAgICAgICAgaWYocGxheWVyTmFtZUVsZW1lbnQpXG4gICAgICAgICAgICBwbGF5ZXJOYW1lRWxlbWVudC5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZCB0YWJsZVxuICogdG8gYmUgY2FsbGVkIHdpdGggZXZlcnkgbmV3IGdhbWVcbiAqL1xuZnVuY3Rpb24gY2xlYXJCaWRUYWJsZSgpe1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgYmlkVGFibGVSb3cgb2YgYmlkVGFibGUuY2hpbGRyZW4pXG4gICAgICAgIGZvcihsZXQgYmlkVGFibGVDb2x1bW4gb2YgYmlkVGFibGVSb3cuY2hpbGRyZW4pXG4gICAgICAgICAgICBiaWRUYWJsZUNvbHVtbi5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKCFlbGVtZW50KXtjb25zb2xlLmVycm9yKFwiTm8gZWxlbWVudCFcIik7cmV0dXJuO31cbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8vIE1ESEAyM0pBTjIwMjA6IHdoZW4gc2hvd2luZyB0aGUgcGxheWVyIG5hbWUgd2Ugc2V0IHRoZSBjb2xvciB0byBibGFjayAoanVzdCBpbiBjYXNlIGl0J3Mgbm90IGJsYWNrIGFueW1vcmUpXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIGVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO1xufVxuZnVuY3Rpb24gc2hvd1BsYXllclR5cGUoZWxlbWVudCxwbGF5ZXJUeXBlKXtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7XG4gICAgfVxufVxuXG4vLyBNREhAMjBKQU4yMDIwOiBrZWVwIHRoZSBpZHMgb2YgdGhlIHRyaWNrIHBsYXllZCBjYXJkcyBpbiBhIGNvbnN0YW50IGFycmF5XG5jb25zdCBQTEFZRURfQ0FSRF9JRFM9W1wiY3VycmVudC1wbGF5ZXItY2FyZFwiLFwibGVmdGhhbmRzaWRlLXBsYXllci1jYXJkXCIsXCJvcHBvc2l0ZS1wbGF5ZXItY2FyZFwiLFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiXTtcblxuLy8gdG8gYmUgY2FsbGVkIG9uIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50XG5mdW5jdGlvbiBjbGVhckNhcmRzUGxheWVkVGFibGUoKXtcbiAgICBmb3IobGV0IHBsYXllZENhcmRJbmRleCBpbiBQTEFZRURfQ0FSRF9JRFMpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFBMQVlFRF9DQVJEX0lEU1twbGF5ZWRDYXJkSW5kZXhdKS5pbm5lckhUTUw9XCJcIjtcbn1cblxuLyoqXG4gKiBzaG93cyB0aGUgZ2l2ZW4gdHJpY2tcbiAqIEBwYXJhbSB7Kn0gdHJpY2sgXG4gKi9cbmZ1bmN0aW9uIHNob3dUcmljayh0cmljay8qLHBsYXllckluZGV4Ki8pe1xuICAgIFxuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgXG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIFwiLHRyaWNrKTtcbiAgICBcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG5cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSB0cnVtcCBwbGF5ZXIgdGhhdCBpcyBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIChlaXRoZXIgbm9uLWJsaW5kIG9yIGJsaW5kKSBmbGFnIHRoZSBjaGVja2JveFxuICAgIGlmKHRyaWNrLmZpcnN0UGxheWVyPT09cGxheWVySW5kZXgmJnRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3gnKS5jaGVja2VkPXRydWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWJsaW5kJykuaW5uZXJIVE1MPSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwP1wiYmxpbmQgXCI6XCJcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcblxuICAgIC8vIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGluZm9cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT0odHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPT0wP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgLy9sZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stY2FyZHMtdGFibGVcIikucmVxdWVzdFNlbGVjdG9yKFwidGJvZHlcIik7XG5cbiAgICAvLyB0aGUgcGxheWVyIHR5cGUgY2FuIGNoYW5nZSBldmVyeSBjYXJkIGJlaW5nIHBsYXllZCAoYmFzZWQgb24gdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyKVxuICAgIC8vIFRPRE8gc2hvdWxkbid0IG5lZWQgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAgICAvLyBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSwtMik7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgXG4gICAgLy8gTk9URSB0aGUgZmlyc3QgY2FyZCBjb3VsZCBiZSB0aGUgYmxpbmQgY2FyZCBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgbm90IHNob3cgaXQhIVxuICAgIC8vICAgICAgYnV0IG9ubHkgdGhlIGNvbG9yIG9mIHRoZSBwYXJ0bmVyIHN1aXRlXG4gICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9KHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2suX2NhcmRzWzBdLnN1aXRlIT09dHJpY2sucGxheVN1aXRlKTtcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBzaG93IGFsbCB0aGUgdHJpY2sgY2FyZHMgcGxheWVkIGF0IHRoZSByaWdodCBwb3NpdGlvblxuICAgIGZvcihsZXQgdHJpY2tDYXJkSW5kZXg9MDt0cmlja0NhcmRJbmRleDw0O3RyaWNrQ2FyZEluZGV4Kyspe1xuICAgICAgICBsZXQgdHJpY2tDYXJkPSh0cmlja0NhcmRJbmRleDx0cmljay5udW1iZXJPZkNhcmRzP3RyaWNrLl9jYXJkc1t0cmlja0NhcmRJbmRleF06bnVsbCk7XG4gICAgICAgIGxldCB0cmlja0NhcmRQbGF5ZXJJbmRleD10cmljay5maXJzdFBsYXllcit0cmlja0NhcmRJbmRleDsgLy8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggaW4gdGhlIGdhbWVcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBvc2l0aW9uPSh0cmlja0NhcmRQbGF5ZXJJbmRleCs0LXBsYXllckluZGV4KSU0O1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIGNhcmQgcG9zaXRpb246IFwiK3RyaWNrQ2FyZFBvc2l0aW9uK1wiLlwiKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZElkPVBMQVlFRF9DQVJEX0lEU1t0cmlja0NhcmRQb3NpdGlvbl07XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQpe1xuICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD1mYWxzZTsgLy8gZG8gbm90IGRvIHRoaXMgZm9yIHRoZSBuZXh0IHBsYXllcnNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmljay5wbGF5U3VpdGUpOyAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIGNhcmQgI1wiK3RyaWNrQ2FyZEluZGV4LHRyaWNrQ2FyZCk7XG4gICAgICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2tDYXJkLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCx0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8xOi0xKTowKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIGxldCBwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9KGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ/KDQrdHJpY2suZmlyc3RQbGF5ZXItcGxheWVySW5kZXgpJTQ6MCk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0xKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMSklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzEpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsxKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0yKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMiklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzIpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsyKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0zKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMyklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzMpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCszKSU0KT8xOi0xKTowKSk7XG4gICAgKi9cbn1cblxuZnVuY3Rpb24gdXBkYXRlU3VpdGVDYXJkUm93cyhyb3dzLHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHN1aXRlIGNhcmQgcm93czogXCIrcm93cy5sZW5ndGgrXCIuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBsZXQgc3VpdGU9MDtcbiAgICBmb3IobGV0IHJvdyBvZiByb3dzKXtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjZWxscz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmQ9MDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IGNlbGwgb2YgY2VsbHMpe1xuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yOyAgXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBzdWl0ZUNhcmQrKztcbiAgICAgICAgfVxuICAgICAgICBzdWl0ZSsrO1xuICAgIH1cbn1cbi8vIGluIHRocmVlIGRpZmZlcmVudCBwYWdlcyB0aGUgcGxheWVyIGNhcmRzIHNob3VsZCBiZSBzaG93bi4uLlxuZnVuY3Rpb24gdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgZm9yIGJpZGRpbmcuXCIpO1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5cbi8qKlxuICogZm9yIHBsYXlpbmcgdGhlIGNhcmRzIGFyZSBzaG93biBpbiBidXR0b25zIGluc2lkZSB0YWJsZSBjZWxsc1xuICogQHBhcmFtIHsqfSBzdWl0ZUNhcmRzIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyB0byBjaG9vc2UgZnJvbS5cIik7XG4gICAgbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1zdWl0ZWNhcmRzLXRhYmxlXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgIGxldCByb3dzPXRhYmxlYm9keS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgIGxldCByb3c9cm93c1tzdWl0ZV07XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZUNhcmQ9MDtzdWl0ZUNhcmQ8Y29sdW1ucy5sZW5ndGg7c3VpdGVDYXJkKyspe1xuICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1lbHNlIC8vIGhpZGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVySW5kZXg9MDtcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGlmKCFkZWx0YVBvaW50c3x8IXBvaW50cyl7Y29uc29sZS5sb2coXCJFUlJPUjogUmVzdWx0cyBub3cga25vd24geWV0IVwiKTtyZXR1cm47fVxuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVySW5kZXhdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVySW5kZXhdKTtcbiAgICAgICAgcGxheWVySW5kZXgrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLl90cmljazsgLy8gTURIQDIwSkFOMjAyMCByZXBsYWNpbmc6IGdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGlmKCF0cmljayl7Y29uc29sZS5sb2coXCJFUlJPUjogTm8gdHJpY2sgdG8gdXBkYXRlIHRoZSB0cmlja3MgdGFibGUgd2l0aCFcIik7cmV0dXJuO31cbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKHBsYXllck5hbWVJbnB1dEVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYoIXBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWV8fHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWUubGVuZ3RoPT0wKVxuICAgICAgICAgICAgcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZT1wbGF5ZXJOYW1lc1twYXJzZUludChwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIpKV07XG4gICAgfVxufVxuXG4vLyBwbGF5aW5nIGZyb20gd2l0aGluIHRoZSBnYW1lXG5mdW5jdGlvbiBzaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGxldCBzaW5nbGVQbGF5ZXJOYW1lPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLW5hbWUnKS52YWx1ZS50cmltKCk7XG4gICAgaWYoc2luZ2xlUGxheWVyTmFtZS5sZW5ndGg+MClcbiAgICAgICAgc2V0UGxheWVyTmFtZShzaW5nbGVQbGF5ZXJOYW1lLChlcnIpPT57XG4gICAgICAgICAgICAvLyBNREhAMTBKQU4yMDIwOiBfc2V0UGxheWVyIHRha2VzIGNhcmUgb2Ygc3dpdGNoaW5nIHRvIHRoZSByaWdodCBpbml0aWFsIHBhZ2UhISFcbiAgICAgICAgICAgIGlmKGVycilzZXRJbmZvKGVycik7Ly8gZWxzZSBuZXh0UGFnZSgpO1xuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIGFsZXJ0KFwiR2VlZiBlZXJzdCBlZW4gKGdlbGRpZ2UpIG5hYW0gb3AhXCIpO1xufVxuXG4vKipcbiAqIHByZXBhcmVzIHRoZSBHVUkgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gZ2V0R2FtZUluZm8oKXtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVybWluaW5nIGdhbWUgaW5mby5cIik7XG4gICAgbGV0IGdhbWVJbmZvPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOyAvLyBubyBwbGF5ZXIsIG5vIGdhbWVcbiAgICBpZihyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgLy8gZ2V0IHRoZSBpbmZvIHdlIG5lZWQgdGhyb3VnaCB0aGUgUGxheWVyR2FtZSBpbnN0YW5jZSByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkZGVycz1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCk7IC8vIHRob3NlIGJpZGRpbmdcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZGRlcnM6IFwiK2hpZ2hlc3RCaWRkZXJzLmpvaW4oXCIsIFwiKStcIi5cIik7XG4gICAgICAgIGxldCBoaWdoZXN0QmlkPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIik7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0VHJ1bXBTdWl0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdFRydW1wIHN1aXRlOiBcIit0cnVtcFN1aXRlK1wiLlwiKTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBsZXQgcGFydG5lclJhbms9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAvLyBwbGF5aW5nIHdpdGggdHJ1bXAgaXMgZWFzaWVzdFxuICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXsgLy8gb25seSBhIHNpbmdsZSBoaWdoZXN0IGJpZGRlciEhIVxuICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcj1oaWdoZXN0QmlkZGVyc1swXTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyb2VsYVBsYXllck5hbWU9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPXRyb2VsYVBsYXllck5hbWUrXCIgaGVlZnQgdHJvZWxhLCBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgaXMgdHJvZWYsIGVuIFwiO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW3RydW1wU3VpdGVdK1wiIG1ldCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG4vLyBob3cgdG8gcGhyYXNlIGEgYmlkIGRlcGVuZHMgb24gdGhlIGJpZCwgYW5kIHdobyBwbGF5cyBpdFxuZnVuY3Rpb24gZ2V0QmlkSW5mbyhiaWQsYmlkZGVyKXtcbiAgICBsZXQgYmV0dGVyPShiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVJ8fFxuICAgICAgICBiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUik7XG4gICAgaWYoYmV0dGVyKWJpZC0tO1xuICAgIHN3aXRjaChiaWQpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1BBUzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0IGdlcGFzdC5cIjpcIkplIGhlYnQgZ2VwYXN0LlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9SSUs6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBcIjpcIkplIGhlYnQgXCIpKyhiZXR0ZXI/XCJiZXRlciBcIjpcIlwiKStcIiBnZXJpa3QuXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTkVHRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdGllbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIGVsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0d2FhbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGRlcnRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QSUNPOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIHNsZWNodHMgZWVuIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgb3BlbiBrYWFydGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuIG1ldCBlZW4gcHJhYXRqZSBlbiBvcGVuIGthYXJ0ZW4uXCI7XG4gICAgfVxuICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0XCI6XCJKZSBoZWJ0XCIpK1wiIGVlbiBvbmdlbGRpZyBib2QgZ2VkYWFuLlwiO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBwbGF5ZXJJbmRleD0wO3BsYXllckluZGV4PHJpa2tlblRoZUdhbWUubnVtYmVyT2ZQbGF5ZXJzO3BsYXllckluZGV4Kyspe1xuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICB9XG59XG4vLyBNREhAMjFOT1YyMDIwOiB0aGUgZ2FtZSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBhIGJpZCBtYWRlIGlzIHJlY2VpdmVkISEhXG5mdW5jdGlvbiB1cGRhdGVCaWRzVGFibGUocGxheWVyQmlkc09iamVjdHMpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgaWYocGxheWVyQmlkc09iamVjdHMpXG4gICAgZm9yKGxldCBwbGF5ZXJCaWRzSW5kZXg9MDtwbGF5ZXJCaWRzSW5kZXg8cGxheWVyQmlkc09iamVjdHMubGVuZ3RoO3BsYXllckJpZHNJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyQmlkc0luZGV4XTtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuZ2V0UGxheWVySW5kZXgocGxheWVyQmlkc09iamVjdC5uYW1lKTtcbiAgICAgICAgLy8gb24gdGhlIHNhZmUgc2lkZSwgZ2V0IHRoZSBwbGF5ZXIgaW5kZXggZnJvbSB0aGUgZ2FtZSBwYXNzaW5nIGluICBwbGF5ZXIgbmFtZVxuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXthbGVydChcIlBsYXllciBcIitwbGF5ZXJCaWRzT2JqZWN0Lm5hbWUrXCIgdW5rbm93biFcIik7Y29udGludWU7fVxuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIC8vIE1ESEAyM0pBTjIwMjAgc2hvd2luZyB0aGUgcGxheWVyIG5hbWVzIG9uY2U6IHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPWNhcGl0YWxpemUocGxheWVyQmlkc09iamVjdC5uYW1lKTsgLy8gd3JpdGUgdGhlIG5hbWUgb2YgdGhlIHBsYXllclxuICAgICAgICAvLyB3cml0ZSB0aGUgYmlkcyAod2UgaGF2ZSB0byBjbGVhciB0aGUgdGFibGUgd2l0aCBldmVyeSBuZXcgZ2FtZSB0aG91Z2gpXG4gICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQsYmlkSW5kZXgpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlbltiaWRJbmRleCsxXS5pbm5lckhUTUw9cGxheWVyQmlkO30pO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl0uY2hpbGRyZW5bMV0uaW5uZXJIVE1MPXBsYXllcnNCaWRzW2JpZF0uam9pbihcIiBcIik7XG4gICAgfVxufVxuXG5jbGFzcyBPbmxpbmVQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJ7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcbiAgICAgICAgc3VwZXIobmFtZSxudWxsKTtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyBhc2sgdGhlIGdhbWVcbiAgICAgICAgcmV0dXJuKHRoaXMuaW5kZXgmJnRoaXMuZ2FtZT90aGlzLmdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLmluZGV4KTowKTtcbiAgICB9XG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gZGVidWdnZXJcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAvLyByZW1vdmVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IC8vIEpJVCB0byB0aGUgcmlnaHQgcGFnZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG5cbiAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7XG4gICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5pdGlhbFwiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKTtcbiAgICB9XG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgdHJ1bXAgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXRydW1wLWNob29zaW5nXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHRydW1wIHN1aXRlIGJ1dHRvbnNcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgIH1cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoc3VpdGVzLHBhcnRuZXJSYW5rKXsgLy8gcGFydG5lclJhbmtOYW1lIGNoYW5nZWQgdG8gcGFydG5lclJhbmsgKGJlY2F1c2UgTGFuZ3VhZ2Ugc2hvdWxkIGJlIHVzZWQgYXQgdGhlIFVJIGxldmVsIG9ubHkhKVxuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgcGFydG5lciBzdWl0ZXM6XCIsc3VpdGVzKTtcbiAgICAgICAgc2V0UGFnZShcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHN1aXRlcyBpbiB0aGUgYnV0dG9uIGFycmF5IGFyZSAwLCAxLCAyLCAzIGFuZCBzdWl0ZXMgd2lsbCBjb250YWluXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBwYXJ0bmVyIHJhbmsgKGFjZSBvciBraW5nKSBiZWluZyBhc2tlZFxuICAgICAgICBmb3IobGV0IHJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgcmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdO1xuICAgIH1cbiAgICAvLyBhbG1vc3QgdGhlIHNhbWUgYXMgdGhlIHJlcGxhY2VkIHZlcnNpb24gZXhjZXB0IHdlIG5vdyB3YW50IHRvIHJlY2VpdmUgdGhlIHRyaWNrIGl0c2VsZlxuICAgIHBsYXlBQ2FyZCgpe1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7XG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAqL1xuICAgICAgICBsZXQgdHJpY2s9KHRoaXMuZ2FtZT90aGlzLmdhbWUuX3RyaWNrOm51bGwpO1xuICAgICAgICBpZighdHJpY2spe2FsZXJ0KFwiQlVHOiBObyBjdXJyZW50IHRyaWNrIHRvIHBsYXkgYSBjYXJkIGluIVwiKTtyZXR1cm47fVxuICAgICAgICAvLyBNREhAMTlKQU4yMDIwOiBhbGxvdyB0aGUgY3VycmVudCBwbGF5ZXIgdG8gcGxheSBhIGNhcmQgYnkgY2xpY2tpbmcgb25lXG4gICAgICAgIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2sucGxheVN1aXRlPDApe2FsZXJ0KFwiQlVHOiBQbGF5IHN1aXRlIG9mIG5vbi1lbXB0eSB0cmljayB1bmRlZmluZWQhXCIpO3JldHVybjt9XG4gICAgICAgIHNldEluZm8oXCJTcGVlbCBlZW4gXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIuXCIpO1xuICAgICAgICAvLyBpZiB0aGlzIGlzIGEgbmV3IHRyaWNrIHVwZGF0ZSB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZSB3aXRoIHRoZSBwcmV2aW91cyB0cmlja1xuICAgICAgICAvLyBpZih0cmljay5udW1iZXJPZkNhcmRzPT0wKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAvKiBzZWUgc2hvd1RyaWNrKClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW4tYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuc3R5bGUuZGlzcGxheT0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgICAgICAvLyBhbHdheXMgc3RhcnQgdW5jaGVja2VkLi4uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuY2hlY2tlZD1mYWxzZTsgLy8gd2hlbiBjbGlja2VkIHNob3VsZCBnZW5lcmF0ZSBcbiAgICAgICAgKi9cbiAgICAgICAgLy8gTURIQDIwSkFOMjAyMCBtb3ZlZCBvdmVyIHRvIHdoZXJlIEdBTUVfSU5GTyBldmVudCBpcyByZWNlaXZlZCEhISE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpOyAvLyB1cGRhdGUgdGhlIGdhbWUgaW5mbyAocGxheWVyIHNwZWNpZmljKVxuICAgICAgICAvLyBvYnNvbGV0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkLXBsYXllclwiKS5pbm5lckhUTUw9dGhpcy5uYW1lO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVxuICAgICAgICAgICAgKHRyaWNrLnBsYXlTdWl0ZT49MD9cIlNwZWVsIGVlbiBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdLnRvTG93ZXJDYXNlKCkrXCIgYmlqLlwiOlwiS29tIG1hYXIgdWl0IVwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mVHJpY2tzV29uPXRoaXMuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTsgLy8gYWxzbyBpbmNsdWRlcyB0aG9zZSB3b24gYnkgdGhlIHBhcnRuZXIgKGF1dG9tYXRpY2FsbHkpXG4gICAgICAgIC8vIGFkZCB0aGUgdHJpY2tzIHdvbiBieSB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lck5hbWU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyTmFtZSh0aGlzLl9pbmRleCk7XG4gICAgICAgIC8vIGlmKHBhcnRuZXIpbnVtYmVyT2ZUcmlja3NXb24rPXBsYXllci5nZXROdW1iZXJPZlRyaWNrc1dvbigpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy13b24tc28tZmFyXCIpLmlubmVySFRNTD1TdHJpbmcobnVtYmVyT2ZUcmlja3NXb24pKyhwYXJ0bmVyTmFtZT9cIiAoc2FtZW4gbWV0IFwiK3BhcnRuZXJOYW1lK1wiKVwiOlwiXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHRoaXMgcGxheWVyIGlzIHN1cHBvc2VkIHRvIHdpbiBpbiB0b3RhbFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy10by13aW5cIikuaW5uZXJIVE1MPWdldE51bWJlck9mVHJpY2tzVG9XaW5UZXh0KHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW4scGFydG5lck5hbWUsdGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkKCkpO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7IC8vIGdldCByaWQgb2YgYW55IGN1cnJlbnRseSBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT05MSU5FID4+PiBQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgc2hvdWxkIHBsYXkgYSBjYXJkIVwiKTtcbiAgICAgICAgLy8gc2V0SW5mbyhcIldlbGtlIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiIHdpbCBqZSBcIisodHJpY2subnVtYmVyT2ZDYXJkcz4wP1wiYmlqXCI6XCJcIikrXCJzcGVsZW4/XCIpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTsgLy8gcmVtZW1iZXIgdGhlIHN1aXRlIGNhcmRzISEhIVxuICAgICAgICAvLyBzaG93IHRoZSB0cmljayAocmVtZW1iZXJlZCBpbiB0aGUgcHJvY2VzcyBmb3IgdXNlIGluIGNhcmRQbGF5ZWQgYmVsb3cpIGZyb20gdGhlIHZpZXdwb2ludCBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgLy8vLy8gc2hvd1RyaWNrKHRoaXMuX3RyaWNrPXRyaWNrKTsgLy8gTURIQDExSkFOMjAyMDogbm8gbmVlZCB0byBwYXNzIHRoZSBwbGF5ZXIgaW5kZXggKGFzIGl0IGlzIGFsd2F5cyB0aGUgc2FtZSlcbiAgICB9XG5cbiAgICAvLyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBfY2FyZFBsYXllZCgpIGRlZmluZWQgaW4gdGhlIGJhc2UgY2xhc3MgUGxheWVyIHdoaWNoIGluZm9ybXMgdGhlIGdhbWVcbiAgICAvLyBOT1RFIGNhcmRQbGF5ZWQgaXMgYSBnb29kIHBvaW50IGZvciBjaGVja2luZyB0aGUgdmFsaWRpdHkgb2YgdGhlIGNhcmQgcGxheWVkXG4gICAgLy8gTk9URSBjYW4ndCB1c2UgX2NhcmRQbGF5ZWQgKHNlZSBQbGF5ZXIgc3VwZXJjbGFzcylcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBkZWNpZGluZyB0byByZXR1cm4gdHJ1ZSBvbiBhY2NlcHRhbmNlLCBmYWxzZSBvdGhlcndpc2VcbiAgICBfY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KHN1aXRlLGluZGV4KXtcbiAgICAgICAgbGV0IGNhcmQ9KHN1aXRlPHRoaXMuX3N1aXRlQ2FyZHMubGVuZ3RoJiZ0aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXS5sZW5ndGg/dGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV1baW5kZXhdOm51bGwpO1xuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIFRPRE8gY2hlY2tpbmcgc2hvdWxkIE5PVCBiZSBkb25lIGJ5IHRoZSBwbGF5ZXIgQlVUIGJ5IHRoZSB0cmljayBpdHNlbGYhISFcbiAgICAgICAgICAgIC8vIEJVRyBGSVg6IGRvIE5PVCBkbyB0aGUgZm9sbG93aW5nIGhlcmUsIGJ1dCBvbmx5IGF0IHRoZSBzdGFydCBvZiBhIHRyaWNrLCBvciBOT1QgYXQgYWxsISEhISFcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL3RoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIC0xIHdoZW4gYXNraW5nIGJsaW5kLCAwIG5vdCBhc2tpbmcsIDEgaWYgYXNraW5nXG4gICAgICAgICAgICAvLyBDQU4nVCBjYWxsIF9zZXRDYXJkIChpbiBiYXNlIGNsYXNzIFBsYXllcikgaWYgdGhlIGNhcmQgY2Fubm90IGJlIHBsYXllZCEhIVxuICAgICAgICAgICAgbGV0IHRyaWNrPXRoaXMuZ2FtZS5fdHJpY2s7IC8vIE1ESEAxOUpBTjIwMjA6IGVhc2llc3Qgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0cmlja1xuICAgICAgICAgICAgaWYoIXRyaWNrKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNsYWcgb20gZWVuIGthYXJ0IGluIGJpaiB0ZSBzcGVsZW4uXCIpO1xuICAgICAgICAgICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkPTA7XG4gICAgICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPT0wKXsgLy8gZmlyc3QgY2FyZCBpbiB0aGUgdHJpY2sgcGxheWVkXG4gICAgICAgICAgICAgICAgLy8gdGhlb3JldGljYWxseSB0aGUgY2FyZCBjYW4gYmUgcGxheWVkIGJ1dCBpdCBtaWdodCBiZSB0aGUgY2FyZCB3aXRoIHdoaWNoIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQhIVxuICAgICAgICAgICAgICAgIC8vIGlzIHRoaXMgYSBnYW1lIHdoZXJlIHRoZXJlJ3MgYSBwYXJ0bmVyIGNhcmQgdGhhdCBoYXNuJ3QgYmVlbiBwbGF5ZWQgeWV0XG4gICAgICAgICAgICAgICAgLy8gYWx0ZXJuYXRpdmVseSBwdXQ6IHNob3VsZCB0aGVyZSBiZSBhIHBhcnRuZXIgYW5kIHRoZXJlIGlzbid0IG9uZSB5ZXQ/Pz8/P1xuICAgICAgICAgICAgICAgIC8vIEJVRyBGSVg6IHN0aWxsIHVzaW5nIGdldFRydW1wUGxheWVyKCkgaGVyZSBhbHRob3VnaCBpdCB3YXNuJ3QgZGVmaW5lZCBhdCBhbGwgaGVyZSEhISFcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICBub3cgY29waWVkIG92ZXIgZnJvbSBSaWtrZW5UaGVHYW1lLmpzISEhIChhcyBpdCBpcyBjb21wdXRlZClcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk9PXRoaXMuX2luZGV4KXsgLy8gdGhpcyBpcyB0cnVtcCBwbGF5ZXIgcGxheWluZyB0aGUgZmlyc3QgY2FyZFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI+Pj4+IENIRUNLSU5HIFdIRVRIRVIgQVNLSU5HIEZPUiBUSEUgUEFSVE5FUiBDQVJEIDw8PDxcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiB0aGUgdHJ1bXAgcGxheWVyIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZFxuICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBtZWFucyB0aGF0IHRoZSB0cnVtcCBwbGF5ZXIgZG9lcyBub3QgaGF2ZSBcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ+MCl7IC8vIG5vbi1ibGluZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgYmUgZGV0ZWN0ZWQgYnkgdGhlIGdhbWUgcHJlZmVyYWJseVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VpdGU9PXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vL2FsZXJ0KFwiXFx0Tk9OX0JMSU5EXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZih0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwKXsgLy8gY291bGQgYmUgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjaGVja2JveCBpcyBzdGlsbCBzZXQgaS5lLiB0aGUgdXNlciBkaWRuJ3QgdW5jaGVjayBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGUgd2lsbCBiZSBhc2tpbmcgZm9yIHRoZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ESEAxNEpBTjIwMjAgQlVHIEZJWDogd2FzIHVzaW5nIGFzay1wYXJ0bmVyLWNhcmQtYmxpbmQgaW5zdGVhZCBvZiBhc2stcGFydG5lci1jYXJkLWNoZWNrYm94ISEhXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3hcIikuY2hlY2tlZCYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1aXRlIT10aGlzLl9nYW1lLmdldFRydW1wU3VpdGUoKXx8Y29uZmlybShcIldpbHQgVSBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclJhbmsoKV0rXCIgKGJsaW5kKSB2cmFnZW4gbWV0IGVlbiB0cm9lZj9cIikpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0tMTsgLy8geWVzLCBhc2tpbmcgYmxpbmQhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy8vYWxlcnQoXCJcXHRCTElORCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvKmFsZXJ0KFwiTm90IGluZGljYXRlZCEhISFcIikqLztcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBvciBub3QgdGhlIGZpcnN0IHBsYXllciBjYW4gcGxheSBzcGFkZXNcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRyaWNrLl9maXJzdFBsYXllckNhblBsYXlTcGFkZXMmJnN1aXRlPT09Q2FyZC5TVUlURV9TUEFERSl7IC8vIHNwYWRlIGlzIGJlaW5nIHBsYXllZCBieSB0aGUgZmlyc3QgcGxheWVyIHdoZXJlYXMgdGhhdCBpcyBub3QgYWxsb3dlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKENhcmQuU1VJVEVfU1BBREUpPHRoaXMubnVtYmVyT2ZDYXJkcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSmUga3VudCBuaWV0IG1ldCBzY2hvcHBlbiB1aXRrb21lbiwgd2FudCBkZSBzY2hvcHBlbiB2cm91dyBpcyBub2cgbmlldCBvcGdlaGFhbGQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7IC8vIG5vdCB0aGUgZmlyc3QgY2FyZCBpbiB0aGUgdHJpY2sgcGxheWVkXG4gICAgICAgICAgICAgICAgLy8gdGhlIGNhcmQgbmVlZHMgdG8gYmUgdGhlIHNhbWUgc3VpdGUgYXMgdGhlIHBsYXkgc3VpdGUgKGlmIHRoZSBwbGF5ZXIgaGFzIGFueSlcbiAgICAgICAgICAgICAgICBpZihzdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSYmdGhpcy5nZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHRyaWNrLnBsYXlTdWl0ZSk+MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgXCIrY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiBuaWV0IHNwZWxlbiwgd2FudCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAvLyB3aGVuIGJlaW5nIGFza2VkIGZvciB0aGUgcGFydG5lciBjYXJkIHRoYXQgd291bGQgYmUgdGhlIGNhcmQgdG8gcGxheSFcbiAgICAgICAgICAgICAgICBpZih0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSxwYXJ0bmVyUmFuaz10aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuaykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5zdWl0ZSE9cGFydG5lclN1aXRlfHxjYXJkLnJhbmshPXBhcnRuZXJSYW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbcGFydG5lclN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwOiB3ZSBoYXZlIHRvIGFsc28gcmV0dXJuIHdoYXRldmVyIHRyaWNrIHZhbHVlIHRoYXQgbWlnaHQndmUgY2hhbmdlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgd2hpY2ggaW4gdGhpcyBjYXNlIGNvdWxkIHdlbCBiZSB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgJ2ZsYWcnXG4gICAgICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBJIHN1Z2dlc3QgY2hhbmdpbmcgYXNraW5nRm9yUGFydG5lckNhcmQgdG8gYXNraW5nRm9yUGFydG5lckNhcmQ8MCBpLmUuIGJsaW5kIHJlcXVlc3QhISFcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdlJ3JlIHRha2luZyBjYXJlIG9mIHRoYXQgd2hlbiBDQVJEIGlzIHNlbnQgKHNvIG5vdCB0byBpbnRlcmZlcmUgd2l0aCBSaWtrZW5UaGVHYW1lLmpzIGl0c2VsZilcbiAgICAgICAgICAgIGxldCBlcnJvcj10aGlzLl9zZXRDYXJkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgLyogTURIQDI3SkFOMjAyMDogcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyBtaWdodCBiZSB3cm9uZyBCVVQgYnkgcGFzc2luZyBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwgcGxheWVycyBpbmNsdWRpbmcgbXlzZWxmIHdpbGwgcmVjZWl2ZSB0aGUgY2FyZCBwbGF5ZWQgYW5kIHVwZGF0ZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW5nbHksIGJhc2ljYWxseSBhZGRDYXJkKCkgd2lsbCBzZXQgaXQgdG8gMSBpZiBpdCBzbyBkZXRlY3RzLCBidXQgY2Fubm90IHNldCBpdCB0byAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGVjaG5pY2FsbHkgYXNraW5nRm9yUGFydG5lckNhcmQgb25seSBuZWVkcyB0byBiZSBzZW5kIHdoZW4gdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZFxuICAgICAgICAgICAgaWYoZXJyb3IpcmV0dXJuIG5ldyBFcnJvcihcIkVyIGlzIGVlbiBmb3V0IG9wZ2V0cmVkZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydC5cIik7XG4gICAgICAgICAgICB0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiT25nZWxkaWdlIGthYXJ0IGtsZXVyIFwiK0RVVENIX1NVSVRFX05BTUVTW3N1aXRlXStcIiBlbi9vZiBrYWFydCBrbGV1ciBwb3NpdGllIChcIitTdHJpbmcoaW5kZXgpK1wiKS5cIik7XG4gICAgfVxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgaWYoIWdhbWUpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuc3RhdGUhPT1QbGF5ZXJHYW1lLkZJTklTSEVEKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBIZXQgc3BlbCBrYW4gbmlldCB3b3JkZW4gdmVybGF0ZW4sIGFscyBoZXQgbmlldCBhZmdlbG9wZW4gaXMgKHRvZXN0YW5kOiBcIit0aGlzLl9nYW1lLnN0YXRlK1wiKS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUuZG9uZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJWZXJsYXRlbiB2YW4gaGV0IHNwZWwgbWlzbHVrdCEgUHJvYmVlciBoZXQgbm9nIGVlbnMuXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgdGhpbmdzIHRvIGRvPz8/Pz8/P1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIG92ZXJnZWJsZXZlbiBrYWFydGVuIGluIGplIGhhbmQgd29yZGVuIHZlcndpamRlcmQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBzZW5kaW5nIHRoZSBET05FIGV2ZW50IHN1Y2NlZWRzIHJlYWR5IGFnYWluIHRvIHBsYXkgaW4gYSBuZXh0IGdhbWUgKHdpdGhvdXQgbGVhdmluZyB0aGUgZ2FtZSBwbGF5aW5nKVxuICAgICAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIucGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KTtcbiAgICB9XG4gICAgLy8gY2FsbCByZW5kZXJDYXJkcyBqdXN0IGFmdGVyIHRoZSBzZXQgb2YgY2FyZHMgY2hhbmdlXG4gICAgcmVuZGVyQ2FyZHMoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXJpbmcgcGxheWVyIGNhcmRzIVwiKTtcbiAgICAgICAgdGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCk7XG4gICAgICAgIC8vIFRPRE8gcHJvYmFibHkgYmVzdCB0byBzaG93IHRoZW0gb24gQUxMIHBhZ2VzIChubyBtYXR0ZXIgd2hpY2ggb25lIGlzIGN1cnJlbnRseSBzaG93aW5nISlcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBzd2l0Y2goY3VycmVudFBhZ2Upe1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYmlkZGluZ1wiOnVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBvbmx5IG9uY2VcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBsYXlpbmdcIjp1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgYWZ0ZXIgcGxheWluZyBhIGNhcmQhIVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICB9XG4gICAgLy8gZXhpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gYSBwbGF5ZXIgc3RvcHMgcGxheWluZ1xuICAgIC8vIGVpdGhlciBieSBleHBsaWNpdGx5IHVzaW5nIHRoZSBzdG9wIGJ1dHRvbihzKSBvciBsZWF2aW5nL2Nsb3NpbmcgdGhlIHBhZ2VcbiAgICAvLyBUT0RPIHNob3VsZCB3ZSBudWxsIHRoZSBnYW1lPz8/Pz8/Pz9cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgdGhpcy5fZ2FtZS5leGl0KHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLl9nYW1lPW51bGw7IC8vIFRPRE8gb3IgYW55IG90aGVyIHdheSB0byBpbmRpY2F0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwbGF5ZXIgc3RvcHBlZCBwbGF5aW5nXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyc1xuLyoqXG4gKiBjbGlja2luZyBhIGJpZCBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gYmlkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gYmlkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgbGV0IGJpZD1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtYmlkXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIkJpZCBjaG9zZW46IFwiLGJpZCk7XG4gICAgbGV0IGVycm9yPWN1cnJlbnRQbGF5ZXIuX3NldEJpZChiaWQpOyAvLyB0aGUgdmFsdWUgb2YgdGhlIGJ1dHRvbiBpcyB0aGUgbWFkZSBiaWRcbiAgICBpZighZXJyb3IpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgIGVsc2VcbiAgICAgICAgYWxlcnQoZXJyb3IubWVzc2FnZSk7XG59XG4vKipcbiAqIGNsaWNraW5nIGEgdHJ1bXAgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHRydW1wIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gdHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIC8vIGVpdGhlciB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIHNlbGVjdGVkXG4gICAgLy8gT09QUyB1c2luZyBwYXJzZUludCgpIGhlcmUgaXMgU09PT08gaW1wb3J0YW50XG4gICAgbGV0IHRydW1wU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlRydW1wIHN1aXRlIFwiK3RydW1wU3VpdGUrXCIgY2hvc2VuLlwiKTtcbiAgICBjdXJyZW50UGxheWVyLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xufVxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIHBhcnNlSW50IFZFUlkgSU1QT1JUQU5UISEhIVxuICAgIGxldCBwYXJ0bmVyU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgc3VpdGUgXCIrcGFydG5lclN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgLy8gZ28gZGlyZWN0bHkgdG8gdGhlIGdhbWUgKGluc3RlYWQgb2YgdGhyb3VnaCB0aGUgcGxheWVyKVxuICAgIGN1cnJlbnRQbGF5ZXIuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xufVxuXG52YXIgcGxheWFibGVjYXJkQ2VsbCxwbGF5YWJsZWNhcmRDZWxsQ29udGVudHM7XG4vKipcbiAqIGNsaWNraW5nIGEgcGFydG5lciBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gcGFydG5lciBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHBsYXlhYmxlY2FyZEJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIHBsYXlhYmxlY2FyZENlbGw9ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBsZXQgY2FyZFN1aXRlPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSk7XG4gICAgbGV0IGNhcmRSYW5rPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pbmRleFwiKSk7XG4gICAgLy8vLy8vLy9pZihwbGF5YWJsZWNhcmRDZWxsLnN0eWxlLmJvcmRlcj1cIjBweFwiKXJldHVybjsgLy8gZW1wdHkgJ3VuY2xpY2thYmxlJyBjZWxsXG4gICAgbGV0IGVycm9yPWN1cnJlbnRQbGF5ZXIuX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChjYXJkU3VpdGUsY2FyZFJhbmspO1xuICAgIGlmKCFlcnJvcil7IC8vIGNhcmQgYWNjZXB0ZWQhISFcbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZm9jdXMgcmVxdWVzdFxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTsgLy8gZGlzYWJsZSB0aGUgY2FyZCBidXR0b25zXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgdmVyem9uZGVuIG5hYXIgZGUgc3BlbCBzZXJ2ZXJcIjsgLy8gTURIQDIzSkFOMjAyMDogZ2V0IHJpZCBvZiB0aGUgcGxheSBjYXJkIHByb21wdCFcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbENvbnRlbnRzPXBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MOyAvLyBpbiBjYXNlIHNlbmRpbmcgdGhlIGNhcmQgZmFpbHNcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICB9ZWxzZSAvLyByZXBvcnQgdGhlIGVycm9yIHRvIHRoZSBlbmQgdXNlclxuICAgICAgICBhbGVydChlcnJvci5tZXNzYWdlKTtcbn1cblxuLyoqXG4gKiBjb252ZW5pZW50IHRvIGJlIGFibGUgdG8gdHVybiB0aGUgcGxheWFibGUgY2FyZCBidXR0b25zIG9uIGFuZCBvZmYgYXQgdGhlIHJpZ2h0IG1vbWVudFxuICogQHBhcmFtIHtlbmFibGV9IGVuYWJsZSBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhlbmFibGUpe1xuICAgIC8vIGNsaWNraW5nIGNhcmQgJ2J1dHRvbnMnIChub3cgY2VsbHMgaW4gdGFibGUpLCB3ZSBjYW4gZ2V0IHJpZCBvZiB0aGUgYnV0dG9uIGl0c2VsZiEhIVxuICAgIGZvcihsZXQgcGxheWFibGVjYXJkQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWFibGUuY2FyZC10ZXh0XCIpKVxuICAgICAgICBwbGF5YWJsZWNhcmRCdXR0b24ub25jbGljaz0oZW5hYmxlP3BsYXlhYmxlY2FyZEJ1dHRvbkNsaWNrZWQ6bnVsbCk7XG59XG5cbi8vIGluIG9yZGVyIHRvIG5vdCBoYXZlIHRvIHVzZSBSaWtrZW5UaGVHYW1lIGl0c2VsZiAodGhhdCBjb250cm9scyBwbGF5aW5nIHRoZSBnYW1lIGl0c2VsZilcbi8vIGFuZCB3aGljaCBkZWZpbmVzIFJpa2tlblRoZUdhbWVFdmVudExpc3RlbmVyIHdlIGNhbiBzaW1wbHkgZGVmaW5lIHN0YXRlQ2hhbmdlZChmcm9tc3RhdGUsdG9zdGF0ZSlcbi8vIGFuZCBhbHdheXMgY2FsbCBpdCBmcm9tIHRoZSBnYW1lIFxuZnVuY3Rpb24gX2dhbWVTdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFRvZXN0YW5kIHZlcmFuZGVydCB2YW4gXCIrZnJvbXN0YXRlK1wiIG5hYXIgXCIrdG9zdGF0ZStcIi5cIik7XG4gICAgc3dpdGNoKHRvc3RhdGUpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuSURMRTpcbiAgICAgICAgICAgIHNldEluZm8oXCJFZW4gc3BlbCBpcyBhYW5nZW1hYWt0LlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuREVBTElORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJEZSBrYWFydGVuIHdvcmRlbiBnZXNjaHVkIGVuIGdlZGVlbGQuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURESU5HOlxuICAgICAgICAgICAgLy8gd2hlbiBtb3ZpbmcgZnJvbSB0aGUgREVBTElORyBzdGF0ZSB0byB0aGUgQklERElORyBzdGF0ZSBjbGVhciB0aGUgYmlkIHRhYmxlXG4gICAgICAgICAgICAvLyBBTFRFUk5BVElWRUxZIHRoaXMgY291bGQgYmUgZG9uZSB3aGVuIHRoZSBnYW1lIGVuZHNcbiAgICAgICAgICAgIC8vIEJVVCB0aGlzIGlzIGEgYml0IHNhZmVyISEhXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IGJpZWRlbiBpcyBiZWdvbm5lbiFcIik7XG4gICAgICAgICAgICBpZihmcm9tc3RhdGU9PT1QbGF5ZXJHYW1lLkRFQUxJTkcpY2xlYXJCaWRUYWJsZSgpO1xuICAgICAgICAgICAgLy8vLy8vIGxldCdzIHdhaXQgdW50aWwgYSBiaWQgaXMgcmVxdWVzdGVkISEhISBcbiAgICAgICAgICAgIC8vIE1ESEAwOUpBTjIwMjA6IE5PLCB3ZSB3YW50IHRvIGluZGljYXRlIHRoYXQgdGhlIGJpZGRpbmcgaXMgZ29pbmcgb25cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLlBMQVlJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWxlbiBrYW4gYmVnaW5uZW4hXCIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gYWxsb3dpbmcgdGhlIHVzZXIgdG8gY2xcbiAgICAgICAgICAgIC8qIE1ESEAxOUpBTjIwMjA6IGluIGR1ZSBjb3Vyc2Ugd2Ugd2lsbCBiZSByZW1vdmluZyB0aGUgZm9sbG93aW5nIHR3byBsaW5lc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgcGxheSBlbGVtZW50XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gaW5pdGlhdGUtcGxheWluZyB3aWxsIHJlcG9ydCBvbiB0aGUgZ2FtZSB0aGF0IGlzIHRvIGJlIHBsYXllZCEhIVxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtcGxheWluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuRklOSVNIRUQ6XG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuIVwiKTtcbiAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpO1xuICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lLl9udW1iZXJPZlRyaWNrc1BsYXllZCs9MTsgLy8gUVVJQ0sgRklYIHRvIGdldCB0byBzZWUgdGhlIGxhc3QgdHJpY2sgYXQgdGhlIHJpZ2h0IHBvc2l0aW9uISEhISFcbiAgICAgICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpOyAvLyBzbyB3ZSBnZXQgdG8gc2VlIHRoZSBsYXN0IHRyaWNrIGFzIHdlbGwhISFcbiAgICAgICAgICAgIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpOyAvLyBzaG93IHRoZSBwbGF5ZXIgcmVzdWx0cyBzbyBmYXJcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWZpbmlzaGVkXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiT05MSU5FID4+PiBUaGUgc3RhdGUgb2YgdGhlIGdhbWUgY2hhbmdlZCB0byAnXCIrdG9zdGF0ZStcIicuXCIpO1xufVxuXG5mdW5jdGlvbiBfZ2FtZUVycm9yT2NjdXJyZWQoZXJyb3Ipe1xuICAgIGFsZXJ0KFwiRm91dDogXCIrZXJyb3IpO1xufVxuXG5mdW5jdGlvbiBzZXRQYWdlKG5ld1BhZ2Upe1xuICAgIC8vIHJlbWVtYmVyIHRoZSBwYWdlIHdlIGNhbWUgZnJvbSAobm90IHRoZSBuZXcgcGFnZSEhISEpXG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUGFnZSB0byBzaG93OiAnXCIrbmV3UGFnZStcIicuXCIpO1xuICAgIC8vIGlmIHRoaXMgaXMgYSBwYWdlIHJlZnJlc2gsIG5vIG5lZWQgdG8gcmVwdXNoIHRoZSBwYWdlISEhXG4gICAgaWYoY3VycmVudFBhZ2UpaWYoY3VycmVudFBhZ2UhPW5ld1BhZ2UpdmlzaXRlZFBhZ2VzLnVuc2hpZnQoY3VycmVudFBhZ2UpO1xuICAgIGN1cnJlbnRQYWdlPW5ld1BhZ2U7XG4gICAgdXBkYXRlSGVscEJ1dHRvbnMoKTtcbiAgICAvLyBOT1RFIG5vdCBjaGFuZ2luZyBjdXJyZW50UGFnZSB0byBwYWdlIHVudGlsIHdlIGhhdmUgZG9uZSB3aGF0IHdlIG5lZWRlZCB0byBkb1xuICAgIFBBR0VTLmZvckVhY2goZnVuY3Rpb24oX3BhZ2Upe1xuICAgICAgICBsZXQgc2hvd1BhZ2U9KF9wYWdlPT09Y3VycmVudFBhZ2UpO1xuICAgICAgICBjb25zb2xlLmxvZygoc2hvd1BhZ2U/XCJTaG93aW5nIFwiOlwiSGlkaW5nIFwiKStcIiAnXCIrX3BhZ2UrXCInLlwiKTtcbiAgICAgICAgbGV0IHBhZ2VFbGVtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKF9wYWdlKTtcbiAgICAgICAgaWYocGFnZUVsZW1lbnQpe1xuICAgICAgICAgICAgcGFnZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT0oc2hvd1BhZ2U/XCJ2aXNpYmxlXCI6XCJoaWRkZW5cIik7XG4gICAgICAgICAgICBpZihzaG93UGFnZSl7XG4gICAgICAgICAgICAgICAgLy8gY3V0IG9mZiB0aGUgcGFnZS0gcHJlZml4XG4gICAgICAgICAgICAgICAgc3dpdGNoKF9wYWdlLnN1YnN0cmluZyg1KSl7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJydWxlc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkRlIHJlZ2VscyB2YW4gaGV0IG9ubGluZSBzcGVsLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dGluZ3NcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJLaWVzIGRlIHNwZWVsd2lqemUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXR1cC1nYW1lXCI6IC8vIHdoZW4gcGxheWluZyBpbiBkZW1vIG1vZGUsIHRoZSB1c2VyIHNob3VsZCBlbnRlciBmb3VyIHBsYXllciBuYW1lc1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEZWZhdWx0UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVnVsIGRlIG5hbWVuIHZhbiBkZSBzcGVsZXJzIGluLiBFZW4gc3BlbGVybmFhbSBpcyB2b2xkb2VuZGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhdXRoXCI6IC8vIHBhZ2UtYXV0aFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkdlZWYgZGUgbmFhbSBvcCB3YWFyb25kZXIgVSB3aWx0IHNwZWxlbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndhaXQtZm9yLXBsYXllcnNcIjogLy8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiRXZlbiBnZWR1bGQgYXViLiBXZSB3YWNodGVuIHRvdCBlciBnZW5vZWcgbWVkZXNwZWxlcnMgemlqbiFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJpZGRpbmdcIjogLy8gcGFnZS1iaWRkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb20gZGUgYmV1cnQgb3AgZWVuIHZlcnpvZWsgdG90IGhldCBkb2VuIHZhbiBlZW4gYm9kLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheS1yZXBvcnRpbmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGxheWluZ1wiOiAvLyA/Pz8/XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBkbyBldmVyeXRoaW5nIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIHN0YXJ0aW5nIHRoZSBnYW1lIHBsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiU2xhZyAxXCI7IC8vIGp1c3QgaW4gY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7IC8vIGp1c3QgaW4gY2FzZSEhXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIldhY2h0IG9wIGhldCB2ZXJ6b2VrIHRvdCBoZXQgb3BnZXZlbiB2YW4gZGUgdHJvZWZrbGV1ciBlbi9vZiBkZSBtZWUgdGUgdnJhZ2VuIGFhcy9oZWVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJIZXQgc3BlbGVuIGJlZ2ludCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaGVkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkhldCBzcGVsIGlzIGFmZ2Vsb3Blbi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBhbGVydChcIkJVRzogVW5rbm93biBwYWdlICdcIitfcGFnZStcIicgcmVxdWVzdGVkIVwiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5leHRQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgbmV4dCBwYWdlIVwiKTtcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIC8vIE1ESEAwN0pBTjIwMjA6IGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgbmV4dCBwYWdlLCB3aGVuIG5vdCBydW5uaW5nIGluIGRlbW8gbW9kZSB3ZSBnbyB0byB0aGUgcGFnZS1hdXRoIHBhZ2VcbiAgICAvLyAgICAgICAgICAgICAgICBpbiBkZW1vIG1vZGUgc2tpcCB0aGUgYXV0aCBhbmQgd2FpdCBmb3IgcGxheWVycyBidXR0b25cbiAgICBzd2l0Y2gocGFnZUluZGV4KXtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYXV0aFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6IC8vIHNob3VsZCB3ZSBjaGVjayB0aGUgdXNlciBuYW1lcz8/Pz8/P1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4KzEpJVBBR0VTLmxlbmd0aF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gY2FuY2VsUGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIHByZXZpb3VzIHBhZ2UuXCIpO1xuICAgIC8vIGdvIG9uZSBwYWdlIGJhY2tcbiAgICBsZXQgcGFnZUluZGV4PVBBR0VTLmluZGV4T2YoY3VycmVudFBhZ2UpO1xuICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCtQQUdFUy5sZW5ndGgtMSklUEFHRVMubGVuZ3RoXSk7XG59XG5mdW5jdGlvbiByZXR1cm5Ub1ByZXZpb3VzUGFnZSgpe1xuICAgIC8vIHBvcCBvZmYgdGhlIHBhZ2Ugd2UgYXJlIGdvaW5nIHRvIHZpc2l0LCBwcmV2ZW50aW5nIHRvIHB1c2ggdGhlIGN1cnJlbnRQYWdlIGFnYWluXG4gICAgaWYodmlzaXRlZFBhZ2VzLmxlbmd0aD4wKXtjdXJyZW50UGFnZT1udWxsO3NldFBhZ2UodmlzaXRlZFBhZ2VzLnNoaWZ0KCkpO31cbn1cbmZ1bmN0aW9uIHNob3dIZWxwKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSBoZWxwIVwiKTtcbiAgICBzZXRQYWdlKCdwYWdlLXJ1bGVzJyk7XG59XG4vLyBhc2NlcnRhaW4gdG8gZGlzYWJsZSB0aGUgSGVscCBidXR0b24gd2hlbiB2aWV3aW5nIGl0ISEhXG5mdW5jdGlvbiB1cGRhdGVIZWxwQnV0dG9ucygpe1xuICAgIGxldCBlbmFibGVIZWxwQnV0dG9uPShjdXJyZW50UGFnZSE9PSdwYWdlLWhlbHAnKTtcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24uZGlzYWJsZWQ9IWVuYWJsZUhlbHBCdXR0b247XG59XG5cbi8qKlxuICogdG8gYmUgY2FsbGVkIHdoZW4gdGhlIG5ldy1wbGF5ZXJzIGJ1dHRvbiBpcyBjbGlja2VkLCB0byBzdGFydCBhIG5ldyBnYW1lIHdpdGggYSBuZXcgc2V0IG9mIHBsYXllcnNcbiAqL1xuZnVuY3Rpb24gbmV3UGxheWVycygpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IE5pZXV3ZSBzcGVsZXJzIGFhbm1ha2VuLlwiKTtcbiAgICBwbGF5ZXJzPVtdO1xuICAgIGxldCBub1BsYXllck5hbWVzPXRydWU7XG4gICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBwbGF5ZXIgaW5wdXQgZmllbGRzXG4gICAgZm9yKHBsYXllck5hbWVJbnB1dCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZihwbGF5ZXJOYW1lSW5wdXQudmFsdWUubGVuZ3RoPjApe1xuICAgICAgICAgICAgbm9QbGF5ZXJOYW1lcz1mYWxzZTtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChuZXcgT25saW5lUGxheWVyKHBsYXllck5hbWVJbnB1dC52YWx1ZSkpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZXJzLmxlbmd0aDw0KVxuICAgICAgICAgICAgcGxheWVycy5wdXNoKG51bGwpO1xuICAgIH1cbiAgICBpZihub1BsYXllck5hbWVzKXtcbiAgICAgICAgcGxheWVycz1udWxsO1xuICAgICAgICBzZXRJbmZvKFwiR2VlbiBzcGVsZXJuYW1lbiBvcGdlZ2V2ZW4uIEhlYiB0ZW5taW5zdGUgZWVuIHNwZWxlcm5hYW0gbm9kaWchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiUmlra2VuIC0gaGV0IHNwZWw6IE5pZXV3ZSBzcGVsZXJzIGFhbmdlbWFha3QhXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxHYW1lKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOy8vaWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiR2VlbiBzcGVsIVwiKTtcbiAgICBpZighcmlra2VuVGhlR2FtZSl7XG4gICAgICAgIGFsZXJ0KFwiR2VlbiBzcGVsIG9tIGFmIHRlIGJyZWtlbiEgTGFhZCBkZXplIHdlYiBwYWdpbmEgb3BuaWV1dyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY29uZmlybShcIldpbHQgVSBlY2h0IGhldCBodWlkaWdlIHNwZWwgYWZicmVrZW4/XCIpKXtcbiAgICAgICAgcmlra2VuVGhlR2FtZS5jYW5jZWwoKTtcbiAgICB9XG59XG4vKiBcbmZ1bmN0aW9uIG5ld1RyaWNrQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5pbm5lckhUTUw9XCJcIjtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgKCFyaWtrZW5UaGVHYW1lfHxyaWtrZW5UaGVHYW1lLnNob3dOZXdUcmlja0luZm8oKSk7XG59XG4qL1xuLy8gTURIQDA3SkFOMjAyMDogYWRkaXRpb25hbCBzdHVmZiB0aGF0IHdlJ3JlIGdvaW5nIHRvIG5lZWQgdG8gbWFrZSB0aGlzIHN0dWZmIHdvcmtcbmNsYXNzIFBsYXllckdhbWVQcm94eSBleHRlbmRzIFBsYXllckdhbWUge1xuXG4gICAgLy8gZ2V0U2VuZEV2ZW50KGV2ZW50LGRhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpK1wiLlwiKTtcbiAgICAvLyAgICAgcmV0dXJuIFtldmVudCxkYXRhXTtcbiAgICAvLyB9XG5cbiAgICAvLyBNREhAMjNKQU4yMDIwOiBjYWxsZWQgZnJvbSB1cGRhdGVCaWRzVGFibGVcbiAgICBnZXRQbGF5ZXJJbmRleChwbGF5ZXJOYW1lKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PSh0aGlzLl9wbGF5ZXJOYW1lcz90aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg6MCk7XG4gICAgICAgIHdoaWxlKC0tcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XSE9PXBsYXllck5hbWUpO1xuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXtjb25zb2xlLmxvZyhcIlBsYXllciBuYW1lICdcIitwbGF5ZXJOYW1lK1wiJyBub3QgZm91bmQgaW4gXCIrSlNPTi5zdHJpbmdpZnkodGhpcy5fcGxheWVyTmFtZXMpK1wiLlwiKTt9XG4gICAgICAgIHJldHVybiBwbGF5ZXJJbmRleDtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZQbGF5ZXJzKCl7cmV0dXJuIHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aDt9XG5cbiAgICAvLyBNREhAMjZKQU4yMDIwOiBuZWVkZWQgdGhpcyBhcyB3ZWxsIHRvIGRldGVybWluZSB0aGUgdHJ1bXAgcGxheWVyICh1c2luZyBiaWRkZXJzIHN0ZWFkIG9mIGJpZFBsYXllcnMgaGVyZSlcbiAgICBnZXRUcnVtcFBsYXllcigpe1xuICAgICAgICAvLyBvbmx5IHdoZW4gcGxheWluZyBhICdyaWsnIGdhbWUgKHdpdGggdHJ1bXAsIHBsYXllZCB3aXRoIGEgcGFydG5lciwgYnV0IG5vdCB0cm9lbGEsIHdlIGhhdmUgYSB0cnVtcCBwbGF5ZXIpXG4gICAgICAgIGlmKHRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUsmJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIpcmV0dXJuIC0xO1xuICAgICAgICBpZighdGhpcy5faGlnaGVzdEJpZGRlcnN8fHRoaXMuX2hpZ2hlc3RCaWRkZXJzLmxlbmd0aD09MClyZXR1cm4gLTE7XG4gICAgICAgIHJldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyc1swXTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjVKQU4yMDIwOiBnYW1lIGNhbm5vdCBjb250aW51ZSB1bnRpbCBzdWNjZWVkaW5nIGluIGdldHRpbmcgdGhlIGFjdGlvbiBvdmVyIHRvIHRoZSBnYW1lIHNlcnZlclxuICAgIC8vICAgICAgICAgICAgICAgIHRvIGd1YXJhbnRlZSBkZWxpdmVyeSB3ZSBydW4gYSByZXNlbmQgdGltZXIgdGhhdCB3aWxsIGNvbnRpbnVlIHNlbmRpbmcgdW50aWwgdGhlIGNhbGxiYWNrIGdldHMgY2FsbGVkXG4gICAgLy8gX2V2ZW50U2VudCB3aWxsIGdldCBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgd2FzIHJlY2VpdmVkIGJ5IHRoZSBnYW1lIHNlcnZlclxuICAgIF9zZW50RXZlbnRSZWNlaXZlZCgpe1xuICAgICAgICBpZih0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQpe2NsZWFySW50ZXJ2YWwodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKTt0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQ9bnVsbDt9XG4gICAgICAgIGZvcmNlRm9jdXMobnVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rXCIgcmVjZWl2ZWQgYnkgZ2FtZSBzZXJ2ZXIuXCIpO1xuICAgICAgICB0aGlzLl9ldmVudFRvU2VuZD1udWxsO1xuICAgICAgICBpZih0aGlzLl9ldmVudFNlbmRDYWxsYmFjayl0aGlzLl9ldmVudFNlbnRDYWxsYmFjaygpO1xuICAgIH1cbiAgICBfc2VuZEV2ZW50KCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KHRoaXMuX2V2ZW50VG9TZW5kWzBdLHRoaXMuX2V2ZW50VG9TZW5kWzFdLHRoaXMuX3NlbnRFdmVudFJlY2VpdmVkKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kWzJdKys7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdKyh0aGlzLl9ldmVudFRvU2VuZFsxXT9cIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSk6XCJcIikrXCIgc2VudCAoYXR0ZW1wdDogXCIrdGhpcy5fZXZlbnRUb1NlbmRbMl0rXCIpLlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogRmFpbGVkIHRvIHNlbmQgZXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rXCIgdG8gdGhlIGdhbWUgc2VydmVyIChyZWFzb246IFwiK2Vycm9yLm1lc3NhZ2UrXCIpLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9zZXRFdmVudFRvU2VuZChldmVudCxkYXRhLGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5fZXZlbnRTZW50Q2FsbGJhY2s9Y2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPVtldmVudCxkYXRhLDBdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSBzZW5kIGV2ZW50IGNvdW50XG4gICAgICAgIGlmKCF0aGlzLl9zZW5kRXZlbnQoKSlyZXR1cm4gZmFsc2U7IC8vIHVzZXIgbXVzdCBtYWtlIHRoZWlyIGNob2ljZSBhZ2FpblxuICAgICAgICAvLyBzY2hlZHVsZSBuZXh0IHJlc2VuZHNcbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPXNldEludGVydmFsKHRoaXMuX3NlbmRFdmVudCw1MDAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gd2hhdCB0aGUgcGxheWVyIHdpbGwgYmUgY2FsbGluZyB3aGVuIChzKWhlIG1hZGUgYSBiaWQsIHBsYXllZCBhIGNhcmQsIGNob29zZSB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlXG4gICAgYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdCSUQnLGJpZCxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgbm93Pz8/XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICB9XG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UncmUgc2VuZGluZyB0aGUgZXhhY3QgY2FyZCBvdmVyIHRoYXQgd2FzIHBsYXllZCAoYW5kIGFjY2VwdGVkIGF0IHRoaXMgZW5kIGFzIGl0IHNob3VsZCBJIGd1ZXNzKVxuICAgIC8vIE1ESEAxNEpBTjIwMjA6IHBhc3NpbmcgaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkICdmbGFnJyBhcyB3ZWxsISEhIVxuICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2Ugd2UncmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBSaWtrZW5UaGVHYW1lIGltcGxlbWVudGF0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQgZG9lc24ndCBlbmQgdXAgaW4gdGhlIGxvY2FsIFJpa2tlblRoZUdhbWUgdHJpY2tcbiAgICAvLyBNREhAMjdKQU4yMDIwOiB3ZSdyZSByZWNlaXZpbmcgdHJ1ZSBmb3IgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCB3aGVuIHRoZSBwbGF5ZXIgaXMgZG9pbmcgc29cbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogZGlzYWJsZSB0aGUgYnV0dG9ucyBvbmNlIHRoZSBjYXJkIGlzIGFjY2VwdGVkICh0byBiZSBwbGF5ZWQhISEpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIFRPRE8gcGVyaGFwcyBoaWRpbmcgdGhlIGNhcmRzIHNob3VsZCBhbHNvIGJlIGRvbmUgaGVyZSEhIVxuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgICovXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBjYXJkIHBsYXllZDogXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICAvLyB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogd2Ugc2VuZCB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgZmxhZyBhbG9uZyBldmVyeSB0aW1lIGFsdGhvdWdoIGl0IHdpbGwgYmUgaWdub3JlZFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBvbiBhbnkgdHJpY2sgY2FyZCBleGNlcHQgdGhlIGZpcnN0IGNhcmQgcGxheWVkLCBhbmQgbm9uLW5lZ2F0aXZlIHZhbHVlcyBhcmUgaWdub3JlZCBhcyB3ZWxsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG9ubHkgdGhpbmcgdGhhdCB0aGUgb3RoZXIgc2lkZSBjYW5ub3QgZGV0ZXJtaW5lIGlzIHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZCEhISFcbiAgICAgICAgbGV0IGNhcmRQbGF5ZWRJbmZvPVtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF07XG4gICAgICAgIC8vIHJlcGxhY2luZzogaWYoYXNraW5nRm9yUGFydG5lckNhcmQ8MCljYXJkUGxheWVkSW5mby5wdXNoKHRydWUpOyAvLyBzZXQgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGJsaW5kIGZsYWchISFcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdDQVJEJyxjYXJkUGxheWVkSW5mbyxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiO1xuICAgICAgICAgICAgICAgICAgICBwbGF5YWJsYWNhcmRDZWxsLmlubmVySFRNTD1wbGF5YWJsZWNhcmRDZWxsQ29udGVudHM7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gd2hhdCB0byBkbyBub3c/XG4gICAgICAgICAgICAgICAgfWVsc2V7IC8vIGNhcmQgcGxheWVkIGFjY2VwdGVkISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgZ2VhY2NlcHRlZXJkLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHRyb2Vma2xldXIgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gcGFydG5lciBrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZCFcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIC8vIHJlcGxhY2luZzogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6cGFydG5lclN1aXRlfSkpO1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiB3aGVuIHRoZSB1c2VyIGZpbmlzaGVkIHJlYWRpbmcgdGhlIHJlc3VsdHMsIGFuZCB3YW50cyB0byBjb250aW51ZSBwbGF5aW5nIGRvbmUoKSBzaG91bGQgYmUgY2FsbGVkXG4gICAgZG9uZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0RPTkUnLG51bGwsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9ORSBldmVudCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhpdChyZWFzb24pe1xuICAgICAgICAvLyBwbGF5ZXIgaXMgZXhpdGluZyBzb21laG93Li4uXG4gICAgICAgIGxldCBkYXRhPShyZWFzb24/cmVhc29uOihjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIlwiKSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnRVhJVCcsZGF0YSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFWElUIGV2ZW50IFwiK2RhdGErXCIgYWNrbm93bGVkZ2VkIVwiKTtcbiAgICAgICAgICAgIC8vIHdlJ3JlIE5PVCBnb2luZyBhbnl3aGVyZSBhbnltb3JlOiBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCl7cmV0dXJuIHRoaXMuX3N0YXRlO31cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZC5wdXNoKHtldmVudDpldmVudCxkYXRhOmRhdGF9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gVE9ETyBoYXZlIHRvIGNoYW5nZSB0aGlzIHRvIGluY2x1ZGUgdGhlIGZyaWVuZGx5IGZsYWcgYXMgd2VsbCEhISFcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgcmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcblxuICAgICAgICAvLyBNREhAMjlKQU4yMDIwOiB3YWl0IHdpdGggYWN0dWFsbHkgcGxheWluZyB0aGUgZ2FtZSB3aXRoIHRoZXNlIHBsYXllcnMgdW50aWwgd2UgZm91bmQgb3V0IHRoYXQgdGhlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGN1cnJlbnQgcGxheWVyIGlzIGFjdHVhbGx5IGluIHRoZSBnYW1lISEhISFcblxuICAgICAgICBpZighY3VycmVudFBsYXllcilyZXR1cm47XG5cbiAgICAgICAgaWYodGhpcy5fcGxheWVySW5kZXg+PTApcmV0dXJuOyAvLyBhbHJlYWR5IHBsYXlpbmcgdGhlIGdhbWVcblxuICAgICAgICBsZXQgcGxheWVySW5kZXg9KCFwbGF5ZXJOYW1lc3x8cGxheWVyTmFtZXMubGVuZ3RoPDQ/LTE6cGxheWVyTmFtZXMuaW5kZXhPZihjdXJyZW50UGxheWVyLm5hbWUpKTtcbiAgICAgICAgXG4gICAgICAgIGlmKHBsYXllckluZGV4Pj0wKXtcbiAgICAgICAgICAgIC8vIE1ESEAyOUpBTjIwMjA6IGF0IHRoZSBtb21lbnQgdGhhdCB0aGUgcGxheWVyIG5hbWVzIGFyZSByZWNlaXZlZCB0aGUgZ2FtZSBhY3R1YWxseSBzdGFydHNcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIENBUkVGVUwgd2Ugc2hvdWxkIGNvbnNpZGVyIHJlY2VpdmluZyB0aGUgcGxheWVyIG5hbWVzIG1vcmUgdGhhbiBvbmNlPz8/Pz8/XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpOyAvLyAocmUpaW5pdGlhbGl6ZSBBTEwgdGhlIHByb3BlcnRpZXMgb2YgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9cGxheWVyTmFtZXM7XG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgodGhpcyxwbGF5ZXJJbmRleCk7IC8vIHJlZ2lzdGVyIHdpdGggdGhlIHBsYXllXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD1jdXJyZW50UGxheWVyLl9pbmRleDsgLy8gcmVtZW1iZXIgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgdXBkYXRlR2FtZVBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICBzaG93UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIC8vIHdlIG9ubHkgbmVlZCB0byBzaG93IHRoZSBjdXJyZW50IHBsYXllciBuYW1lIG9uIHBhZ2UtcGxheWluZyBPTkNFIGFzIGl0IHdpbGwgYWx3YXlzIHN0YXkgdGhlIHNhbWVcbiAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgLy8gcmVwbGFjaW5nOiBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1uYW1lXCIpLHRoaXMuZ2V0UGxheWVyTmFtZSh0aGlzLl9wbGF5ZXJJbmRleCksLTIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEN1cnJlbnQgcGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIG5vdCBmb3VuZC5cIik7XG4gICAgICAgICAgICBpZihwbGF5ZXJOYW1lcylcbiAgICAgICAgICAgICAgICBhbGVydChcIkVybnN0aWdlIHByb2dyYW1tYWZvdXQ6IFV3IG5hYW0ga29tdCBuaWV0IHZvb3IgaW4gZGUgc3BlbGVybGlqc3QgdmFuIGhldCB0ZSBzcGVsZW4gc3BlbCFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllckluZGV4KXtcbiAgICAgICAgaWYocGxheWVySW5kZXg8MHx8cGxheWVySW5kZXg+PXRoaXMuX3BsYXllck5hbWVzLmxlbmd0aClyZXR1cm4gLTE7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllckluZGV4XTtcbiAgICAgICAgLy8gd2UgZG9uJ3QgaGF2ZSBubyBwbGF5ZXJzIGFuZCBzaG91bGQgZ2V0IHRoZSBwYXJ0bmVyIGlkcyBmcm9tIHRoZSBzZXJ2ZXIgaXRzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9KHRoaXMuX3BhcnRuZXJzP3RoaXMuX3BhcnRuZXJzW3BsYXllckluZGV4XTotMSk7XG4gICAgICAgIGlmKHBhcnRuZXJJbmRleDwwKXJldHVybiBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyOyAvLyBubyBwYXJ0bmVyIGtub3duIHlldFxuICAgICAgICByZXR1cm4gbnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcit0aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwYXJ0bmVySW5kZXhdO1xuICAgIH1cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHdpbGwgYmUgcmVjZWl2aW5nIHRoZSBuZXcgdHJpY2sgZXZlbnQgd2hlbiBhIG5ldyB0cmljayBzdGFydHNcbiAgICAvLyBNREhAMjJKQU4yMDIwOiB1c2VyIHdpbGwgaGF2ZSB0byBjbGljayB0aGUgbmV3IHRyaWNrIGJ1dHRvbiBzbyB0aGV5IGNhbiBsb29rIGF0IHRoZSBvbGQgdHJpY2sgZmlyc3RcbiAgICBuZXdUcmljayh0cmlja0luZm8pe1xuICAgICAgICBcbiAgICAgICAgLy8gQVNTRVJUIG9ubHkgY2FsbCB3aGVuIHRyaWNrSW5mbyBpcyBub3QgTlVMTCEhISEhXG4gICAgICAgIGlmKCF0cmlja0luZm8pe2FsZXJ0KFwiQlVHOiBObyB0cmljayBpbmZvIVwiKTtyZXR1cm47fVxuXG4gICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyByZW1vdmUgdGhlIGNhcmRzIHNob3dpbmcgZnJvbSB0aGUgcHJldmlvdXMgdHJpY2tcblxuICAgICAgICAvLyBzaG93IHRoZSBpZCBvZiB0aGUgdHJpY2sgKHdoaWNoIGlzIHRoZSB0cmljayBpbmRleClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIFwiK3RyaWNrSW5mby5pbmRleDtcblxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD10cmlja0luZm8uaW5kZXgtMTtcblxuICAgICAgICBpZih0aGlzLl90cmljayl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc2hvdyB0aGUgZmluaXNoZWQgdHJpY2sgaW4gdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcblxuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgdHJpY2sgd2l0aCB0aGUgaW5mb3JtYXRpb24gaW4gdGhlIHRyaWNrIGluZm9cbiAgICAgICAgdGhpcy5fdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0aGlzLl90cnVtcFN1aXRlLHRoaXMuX3BhcnRuZXJTdWl0ZSx0aGlzLl9wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQsdHJpY2tJbmZvLmZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyk7XG4gICAgXG4gICAgICAgIC8qIHN0dXBpZCBtZTogSSBhbHJlYWR5IG1vdmVkIGRvaW5nIHRoaXMgdG8gc2hvd1RyaWNrKCkgYnV0IHRoZXJlIGVhcmxpZXIgaW5jb3JyZWN0IChpLmUuIE5PVCBjaGVja2luZyB0aGUgZmlyc3QgcGxheWVyISEhKVxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBoaWRpbmcgb3Igc2hvd2luZyB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgY2hlY2tib3ggY2FuIGJlIGRldGVybWluZWQgaGVyZSBhbmQgbm93XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBmb3IgZGVjaWRpbmcgaXMgY29tcGxldGVseSBrbm93biBhdCB0aGUgc3RhcnQgb2YgYSBuZXcgdHJpY2tcbiAgICAgICAgaWYodHJpY2tJbmZvLmZpcnN0UGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleCYmdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICAgICAgICAgIC8vIHRoZSBuZXh0IGRlY2lzaW9uIGlzIGEgbGl0dGxlIGhhcmRlciwgYmVjYXVzZSBzaG91bGQgd2UgYWx3YXlzIHR1cm4gb24gdGhlIGNoZWNrYm94Pz8/Pz8/Pz9cbiAgICAgICAgICAgIC8vIEJVVCBub3RlIHRoYXQgdGhlIHVzZXIgd2lsbCBiZSBwcm9tcHRlZCB0byBhY2tub3dsZWRnZSBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLnNlbGVjdGVkPTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICAqL1xuXG4gICAgICAgIC8vIHdlIGRvIHRoZSBmb2xsb3dpbmcgYmVjYXVzZSBpdCBpcyBlc3NlbnRpYWwgdGhhdCB0aGUgY2hlY2tib3ggdGhhdCB0ZWxscyB0aGUgcGxheWVyIHdoZXRoZXIgb3Igbm90XG4gICAgICAgIC8vIHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGJlIGFza2VkIHNob3VsZCBiZSBpbiB0aGUgcmlnaHQgc3RhdGUgdG8gc3RhcnQgd2l0aCAoZm9yIHRoZSByaWdodCBwbGF5ZXIpXG4gICAgICAgIC8vIE5PVEUgbmV3VHJpY2soKSBpcyBiZWluZyBjYWxsZWQgQkVGT1JFIGEgcGxheWVyIGlzIGFza2VkIHRvIHBsYXkgYSBjYXJkLCBzbyB0aGF0J3MgdGhlIHJpZ2h0IG1vbWVudCEhISFcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsgLy8gVE9ETyBzaG91bGQgdGhpcyBiZSBoZXJlPz8/Pz9cblxuICAgIH1cblxuICAgIC8qIE1ESEAyOUpBTjIwMjA6IE5PVCByZWNlaXZpbmcgdGhlIHBhcnRuZXIgaWRzIGRpcmVjdGx5IGZyb20gdGhlIHNlcnZlciBhbnltb3JlIEJVVCBkZXJpdmluZyB0aGVtIGZyb20gYW55IHBhcnRuZXIgaWQgd2UgcmVjZWl2ZSEhISEhXG4gICAgLy8gTURIQDIwSkFOMjAyMDogaWYgd2UgcmVjZWl2ZSBhbGwgcGFydG5lcnMgd2UgY2FuIGV4dHJhY3QgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgX3NldFBhcnRuZXJJZHMocGFydG5lcklkcyl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJJZHM9cGFydG5lcklkcztcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgY3VycmVudFBhcnRuZXI9KHRoaXMuX3BhcnRuZXJJZHMmJnRoaXMuX3BsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJJbmRleDx0aGlzLl9wYXJ0bmVySWRzLmxlbmd0aD90aGlzLl9wYXJ0bmVySWRzW3RoaXMuX3BsYXllckluZGV4XTotMSk7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIucGFydG5lcj49MCYmY3VycmVudFBhcnRuZXIucGFydG5lciE9Y3VycmVudFBhcnRuZXIpXG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJSYXBwb3J0ZWVyIGRlIHZvbGdlbmRlIGVybnN0aWdlIHByb2dyYW1tYWZvdXQ6ICdKZSBwYXJ0bmVyIGlzIHZlcmFuZGVyZCcuXCIpO1xuICAgICAgICBjdXJyZW50UGxheWVyLnBhcnRuZXI9Y3VycmVudFBhcnRuZXI7XG4gICAgfVxuICAgICovXG5cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogY2FyZEluZm8gZG9lcyBub3QgbmVlZCB0byBjb250YWluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBmbGFnIHBlciBzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBhY3R1YWxseSBvbmx5IG5lZWQgdG8gY29udGFpbiBpdCB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBhcyBpbiBhbGxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb3RoZXIgY2FzZXMgdGhlIHRyaWNrIGNhbiBkZXRlcm1pbmUgaXQgaXRzZWxmIGFuZCBzaG91bGQgTk9UIHJlbHkgb24gaW5mb3JtYXRpb24gc2VudCBieSB0aGUgc2VydmVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IHdvdWxkIGJlIGJldHRlciB0byBjaGFuZ2UgaXQgdG8gYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCBvbiB0aGUgb3RoZXIgc2VydmVyIGVuZCEhXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMgaXMgc29sdmVkIGJ5IHNlbmRpbmcgcGxheVN1aXRlIGFsb25nIHdpdGggY2FyZEluZm8gd2hlbiBzbyBuZWVkZWQhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcImFza2luZ0ZvclBhcnRuZXJDYXJkXCIpKVxuICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9Y2FyZEluZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7IC8vIE1ESEAyNkpBTjIwMjA6IHNob3VsZG4ndCBmb3JnZXQgdGhpcyEhISFcbiAgICAgICAgKi9cbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cmljay5hZGRDYXJkKG5ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm8uc3VpdGUsY2FyZEluZm8ucmFuaykpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG5cbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogaWYgd2UncmUgcmVjZWl2aW5nIHRoZSBwbGF5IHN1aXRlIHdlIGNhbiBkZXRlcm1pbmUgYXNraW5nRm9yUGFydG5lckNhcmQgb3Vyc2VsdmVzXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGxheVN1aXRlXCIpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBwbGF5IHN1aXRlIHByb3ZpZGVkIGRpZmZlcnMgZnJvbSB0aGUgJ2F1dG9tYXRpYycgcGxheSBzdWl0ZSwgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBibGluZGx5XG4gICAgICAgICAgICBpZihjYXJkSW5mby5wbGF5U3VpdGUhPT10aGlzLl90cmljay5wbGF5U3VpdGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLnBsYXlTdWl0ZT1jYXJkSW5mby5wbGF5U3VpdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogTURIQDI5SkFOMjAyMDogTk9UIGV4cGVjdGluZyB0byByZWNlaXZlIHRoZSBwYXJ0bmVyIGlkcyBhbnltb3JlISEhXG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IGV2ZXJ5IGNhcmQgcGxheWVkIGNvbnRhaW5zIHRoZSBwYXJ0bmVycyBhcyB3ZWxsISEhXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGFydG5lcnNcIikpdGhpcy5fc2V0UGFydG5lcklkcyhjYXJkSW5mby5wYXJ0bmVycyk7XG4gICAgICAgICovXG4gICAgICAgIC8vIGlmIGFsbCB0aGUgY2FyZHMgaW4gdGhlIHRyaWNrIGhhdmUgYmVlbiBwbGF5ZWQsIHRoZSB3aW5uZXIgaXMgZGVmaW5pdGUsIGFuZCB3aW5zIHRoZSB0cmlja1xuICAgICAgICBpZih0aGlzLl90cmljay5udW1iZXJPZkNhcmRzPT09NCl0aGlzLl9udW1iZXJPZlRyaWNrc1dvblt0aGlzLl90cmljay53aW5uZXJdKys7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcuLi5cbiAgICAgICAgLy8gc2hvd1RyaWNrQ2FyZCh0aGlzLl90cmljay5nZXRMYXN0Q2FyZCgpLHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHMpO1xuICAgICAgICBzaG93VHJpY2sodGhpcy5fdHJpY2spOy8vaWYodGhpcy5fdHJpY2tXaW5uZXIpe3RoaXMuX3RyaWNrV2lubmVyPW51bGw7c2hvd1RyaWNrKHRoaXMuX3RyaWNrKTt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0cmlja0luZm8udHJ1bXBTdWl0ZSx0cmlja0luZm8ucGFydG5lclN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAvLyBhbHJlYWR5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IhISFcbiAgICAgICAgLy8gdHJpY2suX2ZpcnN0UGxheWVyPXRyaWNrSW5mby5maXJzdFBsYXllcjtcbiAgICAgICAgLy8gdHJpY2suX2NhbkFza0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgaWYodHJpY2tJbmZvLmNhcmRzJiZ0cmlja0luZm8uY2FyZHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZmlsbCB0aGUgdHJpY2sgd2l0aCB0cmljayBpbmZvcm1hdGlvbiBmcm9tIHRoZSBvdGhlciBwbGF5ZXJzISEhXG4gICAgICAgICAgICB0cmlja0luZm8uY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSkuaG9sZGVyPXRyaWNrO30pOyAvLyBzdG9yZSB0aGUgY2FyZHMgcmVjZWl2ZWQgaW4gdHJpY2tcbiAgICAgICAgICAgIHRyaWNrLl93aW5uZXI9dHJpY2tJbmZvLndpbm5lcjtcbiAgICAgICAgICAgIHRyaWNrLl9wbGF5U3VpdGU9dHJpY2tJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgIHRyaWNrLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWNrO1xuICAgIH1cbiAgICAqL1xuXG4gICAgYWNrbm93bGVkZ2VFdmVudHMoKXtcbiAgICAgICAgLy8gbm93IGlmIHRoZSB1bmFja25vd2xlZGdlIGV2ZW50IGlkcyBkbyBOT1QgcmVhY2ggdGhlIHNlcnZlciB3ZSB3aWxsIHJlY2VpdmUgY2VydGFpbiBldmVudHMgYWdhaW4gdW50aWwgd2UgZG9cbiAgICAgICAgLy8gbWFuYWdlIHRvIGdldCB0aGVtIG92ZXJcbiAgICAgICAgLy8gbWFrZSBhIGNvcHkgb2YgYWxsIHRoZSB1bmFja25vd2xlZGdlZCBldmVudHNcbiAgICAgICAgbGV0IGFja25vd2xlZGdlYWJsZUV2ZW50cz10aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5tYXAoKHVuYWNrbm93bGVkZ2VkRXZlbnQpPT5PYmplY3QuYXNzaWduKHt9LHVuYWNrbm93bGVkZ2VkRXZlbnQpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGFja25vd2xlZGdlYWJsZSBldmVudHM6IFwiLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgIC8vIG9mIGNvdXJzZSB3ZSBjb3VsZCBzZW5kIHRoZW0gcGFzc2luZyBhbiBhY2tub3dsZWRnZSBmdW5jdGlvbiB0aG91Z2hcbiAgICAgICAgaWYoYWNrbm93bGVkZ2VhYmxlRXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGVtaXQgcGFzc2luZyBhbG9uZyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdldCBjYWxsZWQgd2hlbiB0aGUgQUNLIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwiQUNLXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzLCgpPT57XG4gICAgICAgICAgICAgICAgLy8gd2Ugbm93IG1heSByZW1vdmUgYWxsIGFja25vd2xlZGdlYWJsZSBldmVudHNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKiBFdmVudHMgYWNrbm93bGVkZ2VtZW50cyByZWNlaXZlZCEgKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vLy8vZGlmZmVyZW5jZSh0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cyxhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkdXBsaWNhdGVkIGZyb20gc2VydmVyLXNpZGUgUmlra2VuVGhlR2FtZS5qcyB0aGF0IHdpbGwgdHJhbnNsYXRlIHRoaXMuX3BsYXllcnNCaWRzIHRvIHJlYWRhYmxlIGJpZHNcbiAgICAvLyB0byBiZSBwYXNzZWQgdG8gdXBkYXRlQmlkc1RhYmxlKCkhISFcbiAgICBfZ2V0UGxheWVyQmlkc09iamVjdHMoKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3RzPVtdO1xuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWRzKT0+e1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9e25hbWU6dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckJpZHNPYmplY3RzLmxlbmd0aCksYmlkczpbXX07XG4gICAgICAgICAgICAvLyB1c2UgdW5zaGlmdCBOT1QgcHVzaCBhcyB0aGUgYmlkcyBhcmUgc3RvcmVkIHJldmVyc2Ugb3JkZXIgXG4gICAgICAgICAgICBwbGF5ZXJCaWRzLmZvckVhY2goKHBsYXllckJpZCk9PntwbGF5ZXJCaWRzT2JqZWN0LmJpZHMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1twbGF5ZXJCaWRdKX0pO1xuICAgICAgICAgICAgcGxheWVyQmlkc09iamVjdHMucHVzaChwbGF5ZXJCaWRzT2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJCaWRzT2JqZWN0cztcbiAgICB9XG5cbiAgICBfc2V0UGFydG5lcnMocGFydG5lcjEscGFydG5lcjIpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciAjXCIrKHBhcnRuZXIxKStcIiBhbmQgI1wiKyhwYXJ0bmVyMikrXCIgYXJlIHBhcnRuZXJzIVwiKTtcbiAgICAgICAgLy8gTURIQDA4REVDMjAxOTogaW5zdGVhZCBvZiBkaXJlY3RseSBzZXR0aW5nIHRoZSBwYXJ0bmVyIHByb3BlcnR5IG9mIGVhY2ggcGxheWVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHdlIHdhaXQgd2l0aCBkb2luZyBzbyBhcyBzb29uIGFzIHRoZSBwYXJ0bmVyIGlzIGtub3duIChieSBwbGF5aW5nIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgICAgIHRoaXMuX3BhcnRuZXJzPVstMSwtMSwtMSwtMV07XG4gICAgICAgIGxldCB0ZWFtcz1bW3BhcnRuZXIxLHBhcnRuZXIyXSxbXV07XG4gICAgICAgIC8vIE1ESEAyOUpBTjIwMjA6IGF0IHRoaXMgZW5kIHdlIGRvIG5vdCBoYXZlIF9wbGF5ZXJzIG9ubHkgX3BsYXllck5hbWVzIGFuZCB0aGVpciBfaW5kZXggaXMgdGhlaXIgcG9zaXRpb24gaW4gdGhlIGFycmF5IG9mIHBsYXllciBuYW1lcyEhISFcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZXMuZm9yRWFjaCgocGxheWVyTmFtZSxpbmRleCk9PntpZihpbmRleCE9PXBhcnRuZXIxJiZpbmRleCE9PXBhcnRuZXIyKXRlYW1zWzFdLnB1c2goaW5kZXgpO30pO1xuICAgICAgICB0ZWFtcy5mb3JFYWNoKCh0ZWFtKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZWFtOiBcIix0ZWFtKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJzW3RlYW1bMF1dPXRlYW1bMV07XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyc1t0ZWFtWzFdXT10ZWFtWzBdO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVycyBrbm93bjogXCIsdGhpcy5fcGFydG5lcnMpO1xuICAgIH1cblxuICAgIC8vIE1ESEAyOUpBTjIwMjA6IF9zZXRQYXJ0bmVyKCkgaXMgY2FsbGVkIHdoZW4gdGhlIFBBUlRORVIgZXZlbnQgaXMgcmVjZWl2ZWRcbiAgICAvLyAgICAgICAgICAgICAgICBpZiB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXIgaXMga25vd24sIGFsbCBwYXJ0bmVycyBhcmUga25vd25cbiAgICAvLyAgICAgICAgICAgICAgICBhbmQgdGhlIHBhcnRuZXIgaWRzIGNhbiBiZSBkZXJpdmVkISEhIVxuICAgIF9zZXRQYXJ0bmVyKHBhcnRuZXIpe1xuICAgICAgICBjdXJyZW50UGxheWVyLnBhcnRuZXI9cGFydG5lcjtcbiAgICAgICAgaWYoY3VycmVudFBsYXllci5wYXJ0bmVyPj0wKWlmKCF0aGlzLl9wYXJ0bmVycyl0aGlzLl9zZXRQYXJ0bmVycyhjdXJyZW50UGxheWVyLl9pbmRleCxjdXJyZW50UGxheWVyLnBhcnRuZXIpO1xuICAgIH1cblxuICAgIC8vIGdlbmVyaWMgbWV0aG9kIGZvciBwcm9jZXNzaW5nIGFueSBldmVudCwgZXZlcnlcbiAgICBwcm9jZXNzRXZlbnQoZXZlbnQsZXZlbnREYXRhLGFja25vd2xlZGdlKXtcbiAgICAgICAgLy8gbG9nIGV2ZXJ5IGV2ZW50XG4gICAgICAgIHRoaXMubG9nRXZlbnQoZXZlbnQsZXZlbnREYXRhKTtcbiAgICAgICAgaWYoIWV2ZW50KXJldHVybjsgLy8gTk9URSB0aGUgZXZlbnREYXRhIGNhbiBiZSBudWxsISEhISEhXG4gICAgICAgIC8vIGlmIGRhdGEgaGFzIGFuIGlkIGl0IG5lZWRzIHRvIGJlIGFja25vd2xlZGdlZFxuICAgICAgICBsZXQgZXZlbnRJZD0oZXZlbnREYXRhJiZldmVudERhdGEuaGFzT3duUHJvcGVydHkoXCJpZFwiKT9ldmVudERhdGEuaWQ6bnVsbCk7XG4gICAgICAgIC8vIGlmIHRoZXJlJ3MgYW4gZXZlbnQgaWQgaW4gdGhpcyBldmVudCwgYW5kIHdlJ3JlIHN1cHBvc2VkIHRvIHNlbmQgYWNrbm93bGVkZ2VtZW50cywgZG8gc29cbiAgICAgICAgaWYoZXZlbnRJZCl7XG4gICAgICAgICAgICAvLyBNREhAMTdKQU4yMDIwOiBub3cgcHVzaCB0aGUgZXZlbnQgbmFtZSBhcyB3ZWxsIHNvIHRoZSBzZXJ2ZXIgY2FuIGxvZyB0aGF0IGFuZCB3ZSBjYW4gc2VlIHdoYXQncyBhY2tub3dsZWdkZWQhISFcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIEJVVCBkb24ndCBwdXNoIGl0IGFnYWluIGlmIGl0J3MgYWxyZWFkeSB0aGVyZSEhISFcbiAgICAgICAgICAgIGlmKGFja25vd2xlZGdlKVxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLmxlbmd0aD09PTB8fHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzW3RoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLmxlbmd0aC0xXS5pZCE9PWV2ZW50SWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLnB1c2goeydpZCc6ZXZlbnRJZCwnZXZlbnQnOmV2ZW50fSk7XG4gICAgICAgICAgICB0aGlzLmFja25vd2xlZGdlRXZlbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRhdGE9KGV2ZW50SWQ/ZXZlbnREYXRhLnBheWxvYWQ6ZXZlbnREYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBST0NFU1NJTkcgRVZFTlQgXCIrZXZlbnQrXCIgPj4+XCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBzd2l0Y2goZXZlbnQpe1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRFQ0hBTkdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVcIjpcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdhbWUgaW5mb3JtYXRpb24gcmVjZWl2ZWQgYnkgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicuXCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgcGxheWVyIG5hbWVzISEhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJTXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lcz1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkRFQUxFUlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYWxlcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRTXCI6XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lcihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHR5cGljYWxseSB0aGUgZ2FtZSBpbmZvIGNvbnRhaW5zIEFMTCBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRoZSBnYW1lIHRoYXQgaXMgZ29pbmcgdG8gYmUgcGxheWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGkuZS4gYWZ0ZXIgYmlkZGluZyBoYXMgZmluaXNoZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT1kYXRhLnRydW1wU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1kYXRhLnBhcnRuZXJTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbms9ZGF0YS5wYXJ0bmVyUmFuaztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZD1kYXRhLmhpZ2hlc3RCaWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWRkZXJzPWRhdGEuaGlnaGVzdEJpZGRlcnM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcj1kYXRhLmZvdXJ0aEFjZVBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogbW92ZSBzaG93aW5nIHRoZSBnYW1lIGluZm8gZnJvbSBwbGF5QUNhcmQoKSB0byBoZXJlISEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lclJhbms+PTApeyAvLyBhIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJTdWl0ZUVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1zdWl0ZScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZUVsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX3BhcnRuZXJTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJSYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyUmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lckVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT1cImluaGVyaXRcIjtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7IC8vIG5vIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVE9fQklEXCI6XG4gICAgICAgICAgICAgICAgaWYoZGF0YSE9PWN1cnJlbnRQbGF5ZXIubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgaGV0IGJvZCB2YW4gXCIrZGF0YStcIi5cIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4gYm9kIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAvLyBpZihkYXRhIT09Y3VycmVudFBsYXllci5uYW1lKVxuICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1cIldlIHdhY2h0ZW4gb3AgaGV0IGJvZCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgLy8gZWxzZVxuICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1cIldhdCB3aWwgamUgc3BlbGVuP1wiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIk1BS0VfQV9CSURcIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLm1ha2VBQmlkKGRhdGEucGxheWVyQmlkc09iamVjdHMsZGF0YS5wb3NzaWJsZUJpZHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkJJRF9NQURFXCI6IC8vIHJldHVybmVkIHdoZW4gYSBiaWQgaXMgbWFkZSBieSBzb21lb25lXG4gICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgdG8gcmVjZWl2ZSBpbiBkYXRhIGJvdGggdGhlIHBsYXllciBhbmQgdGhlIGJpZFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPWdldEJpZEluZm8oZGF0YS5iaWQsZGF0YS5wbGF5ZXI9PT1jdXJyZW50UGxheWVyLmluZGV4P251bGw6dGhpcy5nZXRQbGF5ZXJOYW1lKGRhdGEucGxheWVyKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyc0JpZHNbZGF0YS5wbGF5ZXJdLnB1c2goZGF0YS5iaWQpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gaG93IHRvIHNob3cgdGhlIGJpZHM/Pz8/P1xuICAgICAgICAgICAgICAgIHVwZGF0ZUJpZHNUYWJsZSh0aGlzLl9nZXRQbGF5ZXJCaWRzT2JqZWN0cygpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19QTEFZXCI6XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgZGUga2FhcnQgdmFuIFwiK2RhdGErXCIuXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlUgd29yZHQgem8gb20gZWVuIGthYXJ0IGdldnJhYWdkIVwiKTtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIubmFtZSE9PWRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1pbmZvXCIpLmlubmVySFRNTD1cIldlIHdhY2h0ZW4gb3AgZGUga2FhcnQgdmFuIDxiPlwiK2RhdGErXCI8L2I+LlwiO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiU3BlZWwgZWVuIGthYXJ0IGJpai5cIjtcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlFUl9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGNvbnRhaW4gdGhlIGN1cnJlbnQgY2FyZHMgdGhlIHVzZXIgaGFzXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICAgICAgICAgICAgICAvKiBNREhAMjNKQU4yMDIwOiBnYW1lIGtlZXBzIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSBlYWNoIHBsYXllciEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsc28gdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGFuZCB0byB3aW5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5udW1iZXJPZlRyaWNrc1dvbj1kYXRhLm51bWJlck9mVHJpY2tzV29uO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIFBMQVlFUl9JTkZPIGRvZXMgbm90IG5lZWQgdG8gc2VuZCB0aGUgZm9sbG93aW5nIHdpdGggZWFjaCBQTEFZRVJfSU5GTyBUSE9VR0hcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5zZXROdW1iZXJPZlRyaWNrc1RvV2luKGRhdGEubnVtYmVyT2ZUcmlja3NUb1dpbik7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLU19UT19XSU5cIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTkVXX1RSSUNLXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUcmljayhkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSU1wiOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFydG5lciBpZHMgcmVjZWl2ZWQgQlVUIG5vIGxvbmdlciB1c2VkIVwiKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9zZXRQYXJ0bmVySWRzKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRfUExBWUVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDYXJkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlfQV9DQVJEXCI6XG4gICAgICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IE5PVCBhbnltb3JlXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX3RyaWNrKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBVIHdvcmR0IG9tIGVlbiBrYWFydCBnZXZyYWFnZCBpbiBlZW4gb25nZWRlZmluaWVlcmRlIHNsYWchIFdlIHdhY2h0ZW4gZXZlbiBvcCBzbGFnaW5mb3JtYXRpZS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gTURIQDI3SkFOMjAyMDogZG9pbmcgdGhpcyBhbmQgaG9waW5nIHRoZSBuZXh0IHJlcXVlc3QgaXMgcmVjZWl2ZWQgQUZURVIgcmVjZWl2aW5nIGEgbmV3IHRyaWNrISEhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMkpBTjIwMjA6IG9jY2Fzc2lvbmFsbHkgd2UgbWF5IHJlY2VpdmUgdGhlIHJlcXVlc3QgdG8gcGxheSBCRUZPUkUgYWN0dWFsbHkgaGF2aW5nIHJlY2VpdmVkIHRoZSBzdGF0ZSBjaGFuZ2UhIVxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT09XCJwYWdlLXBsYXlpbmdcIilzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGxheUFDYXJkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0hPT1NFX1RSVU1QX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VUcnVtcFN1aXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VQYXJ0bmVyU3VpdGUoZGF0YS5zdWl0ZXMsZGF0YS5wYXJ0bmVyUmFua05hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLXCI6XG4gICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHRoaXMucGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTXCI6IC8vIE1ESEAyM0pBTjIwMjA6IHdvbid0IGJlIHJlY2VpdmluZyB0aGlzIGV2ZW50IGFueW1vcmUuLi5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgdGhlIHRyaWNrcyBmcm9tIHRoZSBhcnJheSBvZiB0cmlja3MgaW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlja3M9ZGF0YS5tYXAoKHRyaWNrSW5mbyk9PntyZXR1cm4gdGhpcy5wYXJzZVRyaWNrKHRyaWNrSW5mbyk7fSk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJSRVNVTFRTXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3b24ndCBiZSByZWNlaXZpbmcgYSBuZXcgdHJpY2sgZXZlbnQsIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIHNob3cgdGhlIHVzZXIgdGhhdCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhlIHBhZ2UgbW92ZWQgdG8gdGhlIHJlc3VsdHMgcGFnZT8/Pz8/P1xuICAgICAgICAgICAgICAgICAgICAvKiByZW1vdmVkLCBhcyB0aGVzZSB0aGluZ3MgYXJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBvdmVyIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb2ludHM9ZGF0YS5wb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIG5ldy1nYW1lIG9yIHN0b3AgYnV0dG9uIGNsaWNrISEhISEgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBiZXR0ZXIgbm90IHRvIGdvIG91dCBvZiBvcmRlciB3aGVuIHRoaXMgaGFwcGVucyEhISEhIVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJiaW5kaW5nIG1ldCBkZSBzZXJ2ZXIgKHRpamRlbGlqaykgdmVyYnJva2VuIVwiKTsgLy8gcmVwbGFjaW5nOiB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIGV2ZW50IFwiK2V2ZW50K1wiIHJlY2VpdmVkIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXBhcmluZyBmb3IgY29tbXVuaWNhdGlvblwiKTtcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5fc3RhdGU9SURMRTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSB1bmFja25vd2xlZGdlZEV2ZW50SWRzXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZGlzY29ubmVjdCcsKCk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnZGlzY29ubmVjdCcsbnVsbCx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdTVEFURUNIQU5HRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1NUQVRFQ0hBTkdFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlFUlMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0RFQUxFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0RFQUxFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQQVJUTkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVfSU5GTycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fQklEXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdNQUtFX0FfQklEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTUFLRV9BX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdCSURfTUFERScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0JJRF9NQURFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19QTEFZXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX1BMQVknLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIE1ESEAxM0pBTjIwMjA6IHBsYXllciBpbmZvIHdpbGwgYmUgcmVjZWl2ZWQgYmVmb3JlIGJlaW5nIGFza2VkIHRvIHBsYXkgYSBjYXJkIHRvIHVwZGF0ZSB0aGUgcGxheWVyIGRhdGFcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiUExBWUVSX0lORk9cIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWUVSX0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTX1RPX1dJTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLU19UT19XSU4nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTkVXX1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTkVXX1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRfUExBWUVEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRF9QTEFZRUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWV9BX0NBUkQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZX0FfQ0FSRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfVFJVTVBfU1VJVEUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDSE9PU0VfVFJVTVBfU1VJVEUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1BBUlRORVJfU1VJVEUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KFwiQ0hPT1NFX1BBUlRORVJfU1VJVEVcIixkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1JFU1VMVFMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdSRVNVTFRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVPVkVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRU9WRVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIGlmIHdlIHJlY2VpdmUgbXVsdGlwbGUgZXZlbnRzIGFzIGEgd2hvbGUsIHdlIHByb2Nlc3MgYWxsIG9mIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0VWRU5UUycsKGV2ZW50cyk9PntcbiAgICAgICAgICAgIC8vIHdlIGNvdWxkIGNvbnN1bWUgdGhlIGV2ZW50cyBJIGd1ZXNzXG4gICAgICAgICAgICB3aGlsZShldmVudHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGV2ZW50PWV2ZW50cy5zaGlmdCgpOyAvLyByZW1vdmUgdGhlIGZpcnN0IGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gYXNjZXJ0YWluIHRvIHNlbmQgYWxsIHVuYWNrbm93bGVkZ2VkIGV2ZW50IGlkcyB3aGVuIHRoaXMgaXMgdGhlIGxhc3QgcHJvY2VzcyBldmVudCEhISFcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NFdmVudChldmVudC5ldmVudCxldmVudC5kYXRhLGV2ZW50cy5sZW5ndGg9PT0wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTURIQDI5SkFOMjAyMDogaWYgd2Ugd2FudCB0byBiZSBhYmxlIHRvIG1ha2UgdGhpcyBwbGF5ZXIgcGxheSBtb3JlIHRoYW4gb25lIGdhbWUgd2l0aCB0aGUgc2FtZSBHYW1lIGluc3RhbmNlXG4gICAgLy8gICAgICAgICAgICAgICAgKHRoaXMgb25lKSwgd2UgbmVlZCB0byB0YWtlIGFsbCBpbml0aWFsaXphdGlvbiBvdXQgb2YgdGhlIGNvbnN0cnVjdG9yIGFuZCBwdXQgaXQgaW4gaGVyZVxuICAgIF9pbml0aWFsaXplR2FtZSgpe1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fZXZlbnRzUmVjZWl2ZWQ9W107XG4gICAgICAgIHRoaXMuX3RyaWNrV2lubmVyPW51bGw7XG4gICAgICAgIHRoaXMuX2RlYWxlcj0tMTtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTsvL3RoaXMuX3RydW1wUGxheWVyPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7dGhpcy5fcGFydG5lclJhbms9LTE7XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzV29uPVswLDAsMCwwXTsgLy8gYXNzdW1lIG5vIHRyaWNrcyB3b24gYnkgYW55Ym9keVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD0wO3RoaXMuX3RyaWNrPW51bGw7XG4gICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9LTE7dGhpcy5faGlnaGVzdEJpZGRlcnM9W107dGhpcy50cnVtcFBsYXllcj0tMTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcz1bW10sW10sW10sW11dOyAvLyBNREhAMjFKQU4yMDIwOiBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgYmlkcyB0byBzaG93XG4gICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50cz1udWxsO1xuICAgICAgICAvLyB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fdGVhbU5hbWVzPW51bGw7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyB0aGUgJ2N1cnJlbnQnIHBsYXllclxuICAgICAgICAvLyB0aGluZ3Mgd2UgY2FuIHN0b3JlIGludGVybmFsbHkgdGhhdCB3ZSByZWNlaXZlIG92ZXIgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fbmFtZT1udWxsOyAvLyB0aGUgbmFtZSBvZiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1udWxsOyAvLyB0aGUgbmFtZXMgb2YgdGhlIHBsYXllcnNcbiAgICAgICAgdGhpcy5fcGFydG5lcnM9bnVsbDsgLy8gdGhlIHBhcnRuZXJzICh1c2luZyB0aGUgc2FtZSBuYW1lIGFzIGluIChzZXJ2ZXItc2lkZSkgUmlra2VuVGhlR2FtZS5qcylcbiAgICB9XG5cbiAgICAvLyBNREhAMDhKQU4yMDIwOiBzb2NrZXQgc2hvdWxkIHJlcHJlc2VudCBhIGNvbm5lY3RlZCBzb2NrZXQuaW8gaW5zdGFuY2UhISFcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQpe1xuICAgICAgICAvLyBPT1BTIGRpZG4ndCBsaWtlIGZvcmdldHRpbmcgdGhpcyEhISBcbiAgICAgICAgLy8gYnV0IFBsYXllckdhbWUgZG9lcyBOT1QgaGF2ZSBhbiBleHBsaWNpdCBjb25zdHJ1Y3RvciAoaS5lLiBubyByZXF1aXJlZCBhcmd1bWVudHMpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3NvY2tldD1zb2NrZXQ7XG4gICAgICAgIHRoaXMuX3NlbnRFdmVudFJlY2VpdmVkPXRoaXMuX3NlbnRFdmVudFJlY2VpdmVkLmJpbmQodGhpcyk7dGhpcy5fc2VuZEV2ZW50PXRoaXMuX3NlbmRFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpO1xuICAgICAgICB0aGlzLl9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpO1xuICAgIH1cblxuICAgIC8vIGluZm9ybWF0aW9uIGFib3V0IHRoZSBnYW1lIGl0c2VsZiBvcmdhbml6ZWQgYnkgc3RhdGVcbiAgICAvLyBQTEFZSU5HXG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG4gICAgLy8gZ2V0VHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fVxuICAgIFxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7IC8vIG9ubHkgd2hlbiBwbGF5ZXIgZXF1YWxzIHRoaXMuX3BsYXllckluZGV4IGRvIHdlIGtub3cgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXI9KHBsYXllcj09PXRoaXMuX3BsYXllckluZGV4P2N1cnJlbnRQbGF5ZXIucGFydG5lcjotMSk7XG4gICAgICAgIHJldHVybihwYXJ0bmVyPj0wJiZwYXJ0bmVyPHRoaXMubnVtYmVyT2ZQbGF5ZXJzP3RoaXMuX3BsYXllck5hbWVzW3BhcnRuZXJdOm51bGwpO1xuICAgIH1cblxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWRkZXJzO31cbiAgICBnZXRIaWdoZXN0QmlkKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWQ7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICAvLyBnZXRQbGF5ZXJOYW1lKHBsYXllcil7cmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXI8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllcl06XCI/XCIpO31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXtyZXR1cm4gdGhpcy5fZGVsdGFQb2ludHM7fVxuICAgIGdldCBwb2ludHMoKXtyZXR1cm4gdGhpcy5fcG9pbnRzO31cblxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCxvdGhlclBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGFydG5lcnM/dGhpcy5fcGFydG5lcnNbcGxheWVySW5kZXhdPT09b3RoZXJQbGF5ZXJJbmRleDpmYWxzZSk7fVxuICAgIFxuICAgIC8vIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fSAvLyBUT0RPIHN0aWxsIHVzZWQ/Pz8/P1xuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgLy8gZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZm91cnRoQWNlUGxheWVyO31cbiAgICBnZXRUZWFtTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIC8vIGNvbXB1dGluZyB0aGUgdGVhbSBuYW1lIG9uIHRoZSBmbHlcbiAgICAgICAgLy8gb2ssIEkndmUgY2hhbmdlIHNlbmRpbmcgdGhlIHBhcnRuZXJJZHMgb3ZlciB0byB0aGUgZ2FtZSwgaW5zdGVhZCBub3cgcGFydG5lciBpcyBiZWluZyBzZXRcbiAgICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IHdlIG5lZWQgdG8gZ28gdGhyb3VnaCB0aGUgcGxheWVyIGFnYWluXG4gICAgICAgIC8qXG4gICAgICAgIGxldCBwbGF5ZXI9dGhpcy5fcGxheWVyc1twbGF5ZXJJbmRleF07XG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9cGxheWVyLnBhcnRuZXI7XG4gICAgICAgIHJldHVybiBwbGF5ZXIubmFtZSsocGFydG5lckluZGV4Pj0wP1wiICYgXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKHBhcnRuZXJJbmRleCk6XCJcIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIE5PVCByZXBsYWNpbmc6XG4gICAgICAgIGxldCB0ZWFtTmFtZT10aGlzLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICBsZXQgcGFydG5lckluZGV4PSh0aGlzLl9wYXJ0bmVycz90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF06LTEpOyAvLyBOT1RFIGNvdWxkIGJlIG51bGwhISFcbiAgICAgICAgaWYocGFydG5lckluZGV4JiZwYXJ0bmVySW5kZXg+PTApdGVhbU5hbWUrPVwiICYgXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKHBhcnRuZXJJbmRleCk7XG4gICAgICAgIHJldHVybiB0ZWFtTmFtZTtcbiAgICB9XG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAvLyBob3cgYWJvdXQgcHJvbXB0aW5nIHRoZSB1c2VyPz8/Pz9cbiAgICAgICAgLy8gaWYoIWN1cnJlbnRQbGF5ZXJ8fCFjdXJyZW50UGxheWVyLmdhbWUpcmV0dXJuOyAvLyBkbyBub3QgYXNrIHRoZSB1c2VyIHdoZXRoZXIgdGhleSB3YW50IHRvIHN0YXkgb3Igbm90IChhcyB0aGV5IGNhbm5vdCBzdGF5KVxuICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyB2aWV3aW5nIHRoZSByZXN1bHRzIHBhZ2Ugd2UgbWF5IGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIGFjdHVhbGx5IG92ZXJcbiAgICAgICAgcmV0dXJuKGN1cnJlbnRQYWdlPT09J3BhZ2UtcmVzdWx0cyc/XCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi4gVG90IGRlIHZvbGdlbmRlIGtlZXIhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XCJIZXQgc3BlbCBpcyBub2cgbmlldCB0ZW4gZWluZGUuIEJsaWpmIG9wIGRlIHBhZ2luYSBvbSB0b2NoIHZlcmRlciB0ZSBzcGVsZW4uXCIpO1xuICAgIH07XG4gICAgLy8gaWYgd2UgYWN0dWFsbHkgZW5kIHVwIGluIGxlYXZpbmcgdGhpcyBVUkwsIHdlIGRlZmluaXRlbHkgd2FudCB0byBraWxsIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgZm9yIGdvb2RcbiAgICB3aW5kb3cub25wb3BzdGF0ZT1mdW5jdGlvbigpe1xuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIuZXhpdCgnRVhJVCcpOyAvLyBpZiB3ZSBoYXZlbid0IGRvbmUgc28geWV0ISEhIVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKG51bGwsbnVsbCk7IC8vIHdpdGhvdXQgY2FsbGJhY2sgbm8gcGFnZSBzaG91bGQgYmUgc2hvd24gYW55bW9yZS4uLlxuICAgIH1cblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGhpZGUgdGhlIGJpZGRpbmcgYW5kIHBsYXlpbmcgZWxlbWVudHNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIC8vIHJlcGxhY2VkIGJ5IGJpZC1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiO1xuICAgIC8vIERPIE5PVCBETyBUSElTIFdJTEwgT1ZFUlJVTEUgUEFSRU5UOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gTURIQDE5SkFOMjAyMDogXCJoaWRkZW5cIiBjaGFuZ2VkIHRvIFwidmlzaWJsZVwiIGFzIHdlIG5ldmVyIGhpZGUgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IHBsYXllcnNcbiAgICAvLyByZXBsYWNlZCBieSBwbGF5LWluZm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIE1ESEAxOUpBTjIwMjA6IGFuZCB2aWNlIHZlcnNhXG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLXBsYXllci1nYW1lLWJ1dHRvbicpLm9uY2xpY2s9c2luZ2xlUGxheWVyR2FtZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgZm9yKGxldCBiYWNrQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JhY2snKSliYWNrQnV0dG9uLm9uY2xpY2s9cmV0dXJuVG9QcmV2aW91c1BhZ2U7XG4gICAgLy8gc2hvdyB0aGUgcGFnZS1ydWxlcyBwYWdlIHdoZW4gdGhlIHVzZXIgcmVxdWVzdHMgaGVscFxuICAgIGZvcihsZXQgaGVscEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWxwJykpaGVscEJ1dHRvbi5vbmNsaWNrPXNob3dIZWxwO1xuICAgIC8vIE1ESEAxMEpBTjIwMjA6IEVORFxuXG4gICAgLy8gZXZlbnQgaGFuZGxlcnMgZm9yIG5leHQsIGNhbmNlbCwgYW5kIG5ld1BsYXllcnMgYnV0dG9uc1xuICAgIGZvcihsZXQgbmV4dEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXh0JykpbmV4dEJ1dHRvbi5vbmNsaWNrPW5leHRQYWdlO1xuICAgIGZvcihsZXQgY2FuY2VsQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhbmNlbCcpKWNhbmNlbEJ1dHRvbi5vbmNsaWNrPWNhbmNlbFBhZ2U7XG4gICAgZm9yKGxldCBzdG9wQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N0b3AnKSlzdG9wQnV0dG9uLm9uY2xpY2s9c3RvcFBsYXlpbmc7XG4gICAgXG4gICAgLy8gbGV0J3MgYXNzdW1lIHRoYXQgdGhlIGdhbWUgaXMgb3ZlciB3aGVuIG5ldy1nYW1lIGJ1dHRvbnMgYXJlIHNob3dpbmdcbiAgICAvLyB3ZSdyZSBub3QgdG8ga2lsbCB0aGUgY29ubmVjdGlvbiwgd2UnbGwganVzdCBrZWVwIHVzaW5nIHRoZSBzYW1lIGNvbm5lY3Rpb25cbiAgICBmb3IobGV0IG5ld0dhbWVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5ldy1nYW1lXCIpKW5ld0dhbWVCdXR0b24ub25jbGljaz1uZXdHYW1lO1xuICAgIC8qXG4gICAgLy8gd2hlbmV2ZXIgd2UgaGF2ZSBuZXcgcGxheWVyKG5hbWUpc1xuICAgIGZvcihsZXQgbmV3R2FtZVBsYXllcnNCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV3LWdhbWUtcGxheWVycycpKW5ld0dhbWVQbGF5ZXJzQnV0dG9uLm9uY2xpY2s9bmV3R2FtZVBsYXllcnM7XG4gICAgLy8gd2hlbmV2ZXIgdGhlIGdhbWUgaXMgY2FuY2VsZWRcbiAgICBmb3IobGV0IGNhbmNlbEdhbWVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsLWdhbWUnKSljYW5jZWxHYW1lQnV0dG9uLm9uY2xpY2s9Y2FuY2VsR2FtZTtcbiAgICAqL1xuXG4gICAgLy8gYXR0YWNoIGFuIG9uY2xpY2sgZXZlbnQgaGFuZGxlciBmb3IgYWxsIGJpZCBidXR0b25zXG4gICAgZm9yKGxldCBiaWRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJpZFwiKSliaWRCdXR0b24ub25jbGljaz1iaWRCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIHByZXBhcmUgZm9yIHNob3dpbmcvaGlkaW5nIHRoZSBjYXJkcyBvZiB0aGUgY3VycmVudCBiaWRkZXJcbiAgICBpbml0aWFsaXplQmlkZGVyU3VpdGVjYXJkc0J1dHRvbigpO1xuICAgIC8vIHJlcGxhY2luZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLm9uY2xpY2s9dG9nZ2xlQmlkZGVyQ2FyZHM7XG5cbiAgICAvLyBldmVudCBoYW5kbGVyIGZvciBzZWxlY3RpbmcgYSBzdWl0ZVxuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtdHJ1bXBcIikpc3VpdGVCdXR0b24ub25jbGljaz10cnVtcFN1aXRlQnV0dG9uQ2xpY2tlZDtcbiAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuYmlkLXBhcnRuZXJcIikpc3VpdGVCdXR0b24ub25jbGljaz1wYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIG1ha2UgdGhlIHN1aXRlIGVsZW1lbnRzIG9mIGEgc3BlY2lmaWMgdHlwZSBzaG93IHRoZSByaWdodCB0ZXh0ISEhIVxuICAgIGZvcihsZXQgc3VpdGU9MDtzdWl0ZTw0O3N1aXRlKyspXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5cIitDYXJkLlNVSVRFX05BTUVTW3N1aXRlXSkpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi52YWx1ZT1DYXJkLlNVSVRFX0NIQVJBQ1RFUlNbc3VpdGVdO1xuICAgIFxuICAgIC8qIE1ESEAyMkpBTjIwMjA6IGV2ZW50IGhhbmRsZXIgZm9yIGNsaWNraW5nIHRoZSBuZXcgdHJpY2sgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLm9uY2xpY2s9bmV3VHJpY2tCdXR0b25DbGlja2VkO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICAqL1xuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogY2hlY2sgZm9yIGEgdXNlciBuYW1lXG4gICAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgLy8gTURIQDI0SkFOMjAyMDogY2hhbmdlZCAncGxheWVyJyB0byAnYWxzJyEhISBOT1RFIHRoaXMgaXMgYSBiYWNrLWRvb3JcbiAgICBsZXQgaW5pdGlhbFBsYXllck5hbWU9KHVybFBhcmFtcy5oYXMoXCJhbHNcIik/dXJsUGFyYW1zLmdldChcImFsc1wiKS50cmltKCk6bnVsbCk7XG4gICAgaWYoaW5pdGlhbFBsYXllck5hbWUpc2V0UGxheWVyTmFtZShpbml0aWFsUGxheWVyTmFtZSwoZXJyKT0+e30pO1xuXG59O1xuXG4vLyBNREhAMDhKQU4yMDIwOiBncmVhdCBpZGVhIHRvIG1ha2UgZXZlcnl0aGluZyB3b3JrIGJ5IGFsbG93aW5nIHRvIHNldCB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIF9zZXRQbGF5ZXIocGxheWVyLGVycm9yY2FsbGJhY2spe1xuICAgIHZpc2l0ZWRQYWdlcz1bXTsgLy8gZm9yZ2V0IHZpc2l0ZWQgcGFnZXNcbiAgICBjdXJyZW50UGFnZT1udWxsOyAvLyBhc2NlcnRhaW4gdG8gbm90IGhhdmUgYSBwYWdlIHRvIHN0b3JlXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgY3VycmVudCBwbGF5ZXIgKGlmIGFueSksIGFuZCBpbiBlZmZlY3Qgd2UnbGwgbG9vc2UgdGhlIGdhbWUgYXMgd2VsbFxuICAgIGlmKGN1cnJlbnRQbGF5ZXIpe1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNoYW5nZSBjdXJyZW50UGxheWVyIGJlY2F1c2UgaXQncyBnb25uYSBiZSByZXBsYWNlZCBhbnl3YXlcbiAgICAgICAgLy8gYnV0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIgYW55d2F5XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9Y3VycmVudFBsYXllci5fY2xpZW50O1xuICAgICAgICAvLyBkaXNjb25uZWN0IGlmIG5lZWQgYmVcbiAgICAgICAgKCFjbGllbnRzb2NrZXR8fCFjbGllbnRzb2NrZXQuY29ubmVjdGVkfHxjbGllbnRzb2NrZXQuZGlzY29ubmVjdCgpKTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBjdXJyZW50UGxheWVyLmdhbWU9bnVsbDsgLy8gZ2V0IHJpZCBvZiB0aGUgZ2FtZSAod2hpY2ggd2lsbCBkaXNjb25uZWN0IHRoZSBzb2NrZXQgYXMgd2VsbCkgV0lTSEZVTCBUSElOS0lORy4uLlxuICAgICAgICBjdXJyZW50UGxheWVyPW51bGw7XG4gICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICBpZihlcnJvcmNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBNREhAMTBKQU4yMDIwOiB3aGVuZXZlciB0aGUgY3VycmVudFBsYXllciBpcyBOT1QgYXZhaWxhYmxlIGdvIHRvIFwicGFnZS1ydWxlc1wiXG4gICAgfVxuICAgIC8vIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIHRoZSBwYWdlIHdlIGNhbiBzaG93IGlmIHRoZXJlJ3Mgbm8gcGxheWVyISEhISAoVE9ETyBvciBwYWdlLWF1dGg/Pz8/PylcbiAgICBpZihwbGF5ZXIpe1xuICAgICAgICBsZXQgY2xpZW50c29ja2V0PWlvKGxvY2F0aW9uLnByb3RvY29sKycvLycrbG9jYXRpb24uaG9zdCk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdCcsKCk9PntcbiAgICAgICAgICAgIGlmKGNsaWVudHNvY2tldC5jb25uZWN0ZWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKChjdXJyZW50UGxheWVyP1wiUmVjb25uZWN0ZWRcIjpcIkNvbm5lY3RlZFwiKStcIiB0byB0aGUgZ2FtZSBzZXJ2ZXIhXCIpO1xuICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50UGxheWVyKXsgLy8gZmlyc3QgdGltZSBjb25uZWN0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXI9cGxheWVyO1xuICAgICAgICAgICAgICAgICAgICBzaG93Q3VycmVudFBsYXllck5hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgLyogTURIQDI5SkFOMjAyMDogZG8gTk9UIHN0YXJ0IHBsYXlpbmcgYSBnYW1lIHVudGlsIHdlIHJlY2VpdmUgdGhlIHBsYXllciBuYW1lcyEhISEhIVxuICAgICAgICAgICAgICAgICAgICAvLyB1bmZvcnR1bmF0ZWx5IHdlIGNhbiBvbmx5IHNldCB0aGUgZ2FtZSBvZiB0aGUgcGxheWVyIGlmIF9pbmRleCBpcyBub24tbmVnYXRpdmUsIHNvIHdlIHBhc3MgaW4gNFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PTQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZT1uZXcgUGxheWVyR2FtZVByb3h5KGNsaWVudHNvY2tldCk7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTsgLy8gbGV0J3MgY3JlYXRlIHRoZSBnYW1lIHRoYXQgaXMgdG8gcmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7ICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZXJyb3JjYWxsYmFjaz09PSdmdW5jdGlvbicpZXJyb3JjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRGUgdmVyYmluZGluZyBtZXQgZGUgc3BlbCBzZXJ2ZXIgaXMgaGVyc3RlbGQuXCIpO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAyM0pBTjIwMjA6IHB1c2ggdGhlIHBsYXllciBuYW1lIHRvIHRoZSBzZXJ2ZXIgYWdhaW4sIHNvIGl0IGNhbiByZXNlbmQgd2hhdCBuZWVkcyBzZW5kaW5nISEhIVxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIpY2xpZW50c29ja2V0LmVtaXQoJ1BMQVlFUicsY3VycmVudFBsYXllci5uYW1lLCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJBYW5nZW1lbGQgYmlqIGRlIHNwZWwgc2VydmVyIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIG1ldCBkZSBzcGVsIHNlcnZlciBpcyB2ZXJicm9rZW4uXCIpO1xuICAgICAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlci5cIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdF9lcnJvcicsKGVycik9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBlcnJvcjogXCIsZXJyKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBlZW4gcHJvYmxlZW0gbWV0IGRlIHZlcmJpbmRpbmcgbWV0IGRlIHNwZWwgc2VydmVyIChcIitlcnIubWVzc2FnZStcIikhXCIpO1xuICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRyeSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgY2F0Y2hpbmcgd2hhdGV2ZXIgaGFwcGVucyB0aHJvdWdoIGV2ZW50c1xuICAgICAgICBjbGllbnRzb2NrZXQuY29ubmVjdCgpO1xuICAgIH1lbHNle1xuICAgICAgICBjdXJyZW50R2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IGdhbWUgKGlmIGFueSlcbiAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhudWxsKSk7XG4gICAgfVxufVxuXG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCB0aGUgKG5ldykgbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXIgd2hlbmV2ZXIgdGhlIHBsYXllciB3YW50cyB0byBwbGF5XG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCBudWxsIChvciBlbXB0eSkgcGxheWVyIG5hbWVcbi8vIHRvIG1ha2UgaXQgY2FsbGFibGUgZnJvbSBhbnl3aGVyZSB3ZSBhdHRhY2ggc2V0UGxheWVyTmFtZSB0byB3aW5kb3cgKGJlY2F1c2UgY2xpZW50LmpzIHdpbGwgYmUgYnJvd3NlcmlmaWVkISEhKVxuZnVuY3Rpb24gc2V0UGxheWVyTmFtZShwbGF5ZXJOYW1lLGVycm9yQ2FsbGJhY2spe1xuICAgIChwcmVwYXJlZEZvclBsYXlpbmd8fHByZXBhcmVGb3JQbGF5aW5nKCkpOyAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIG9uY2VcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiYhKHR5cGVvZiBwbGF5ZXJOYW1lPT09XCJzdHJpbmdcIikpXG4gICAgICAgIHJldHVybih0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobmV3IEVycm9yKFwiSW52YWxpZCBwbGF5ZXIgbmFtZS5cIikpKTtcbiAgICAvLyBpZiBwbGF5ZXJOYW1lIG1hdGNoZXMgdGhlIGN1cnJlbnQgcGxheWVyJ3MgbmFtZSwgbm90aGluZyB0byBkb1xuICAgIGlmKHBsYXllck5hbWUmJmN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIubmFtZT09PXBsYXllck5hbWUpXG4gICAgICAgICh0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCxlcnJvckNhbGxiYWNrKTtcbn1cblxud2luZG93Lm9ubG9hZD1wcmVwYXJlRm9yUGxheWluZztcblxuLy8gZXhwb3J0IHRoZSB0d28gZnVuY3Rpb24gdGhhdCB3ZSBhbGxvdyB0byBiZSBjYWxsZWQgZnJvbSB0aGUgb3V0c2lkZSEhIVxubW9kdWxlLmV4cG9ydHM9c2V0UGxheWVyTmFtZTsiXX0=
