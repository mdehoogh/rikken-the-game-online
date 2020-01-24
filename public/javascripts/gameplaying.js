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

    set partner(partner){this._partner=(typeof partner==='number'?partner:-1);} // to set the partner once the partner suite/rank card is in the trick!!!!

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

// MDH@10JAN2020: newGame() is a bid different than in the demo version in that we return to the waiting-page
function newGame(){
    // by call playsTheGameAtIndex(null,?) we force clearing the game information being shown at the wait-for-players page
    (!currentPlayer||currentPlayer.playsTheGameAtIndex(null,-1));
}
function stopPlaying(){
    // ASSERT assuming not playing in a game anymore i.e. newGame() has been called before
    if(currentPlayer&&currentPlayer.game)
        alert("Stop eerst met spelen!");
    else // force going back to the previous page in the history (where we came from originally)
        window.history.back();
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
    if(trick.canAskForPartnerCard!=0){
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
        if(trick)
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
            if(!trick){
                debugger
            }else
            if(trick.numberOfCards==0){ // first card in the trick played
                // theoretically the card can be played but it might be the card with which the partner card is asked!!
                // is this a game where there's a partner card that hasn't been played yet
                // alternatively put: should there be a partner and there isn't one yet?????
                if(this._game.getTrumpPlayer()==this._index){ // this is trump player playing the first card
                    console.log("******************************************************");
                    console.log(">>>> CHECKING WHETHER ASKING FOR THE PARTNER CARD <<<<");
                    // can the trump player ask for the partner card blind
                    // which means that the trump player does not have 
                    if(trick.canAskForPartnerCard>0){ // non-blind
                        // TODO should be detected by the game preferably
                        if(suite==this._game.getPartnerSuite()){
                            trick.askingForPartnerCard=1;
                            ////alert("\tNON_BLIND");
                        }
                    }else
                    if(trick.canAskForPartnerCard<0){ // could be blind
                        // if the checkbox is still set i.e. the user didn't uncheck it
                        // he will be asking for the 
                        // MDH@14JAN2020 BUG FIX: was using ask-partner-card-blind instead of ask-partner-card-checkbox!!!
                        if(document.getElementById("ask-partner-card-checkbox").checked&&
                            (suite!=this._game.getTrumpSuite()||confirm("Wilt U de "+Language.DUTCH_SUITE_NAMES[this._game.getPartnerSuite()]+" "+Language.DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" (blind) vragen met een troef?"))){
                            trick.askingForPartnerCard=-1; // yes, asking blind!!
                            /////alert("\tBLIND!");
                        }
                    }else
                        /*alert("Not indicated!!!!")*/;
                }else{
                    // check whether or not the first player can play spades
                    if(!trick._firstPlayerCanPlaySpades&&suite===Card.SUITE_SPADE){ // spade is being played by the first player whereas that is not allowed
                        if(this.getNumberOfCardsWithSuite(Card.SUITE_SPADE)<this.numberOfCards){
                            alert("Je kunt niet met schoppen uitkomen, want de schoppen vrouw is nog niet opgehaald.");
                            return;
                        }
                    }
                }
            }else{ // not the first card in the trick played
                // the card needs to be the same suite as the play suite (if the player has any)
                if(suite!==trick.playSuite&&this.getNumberOfCardsWithSuite(trick.playSuite)>0){
                    alert("Je kunt "+card.getTextRepresentation()+" niet spelen, want "+Language.DUTCH_SUITE_NAMES[trick.playSuite]+" is gevraagd.");
                    return;
                }
                // when being asked for the partner card that would be the card to play!
                if(trick.askingForPartnerCard!=0){
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
            this._setCard(card,trick.askingForPartnerCard);
            return true;
        }else
            alert("Invalid card suite "+String(suite)+" and suite index "+String(index)+".");
        return false;
    }
    playsTheGameAtIndex(game,index){
        super.playsTheGameAtIndex(game,index);
        // TODO should we do this here??
        if(this.game)setPage("page-wait-for-players");else setPage("page-rules");
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
    if(currentPlayer._cardPlayedWithSuiteAndIndex(cardSuite,cardRank)){ // card accepted!!!
        forceFocus(null); // get rid of the focus request
        playablecardCell.innerHTML="";
        document.getElementById("play-card-prompt").innerHTML=""; // MDH@23JAN2020: get rid of the play card prompt!
    }
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
                        // we do everything here
                        // assuming starting the game play
                        document.getElementById("trick-id").innerHTML="Slag 1"; // just in case
                        // document.getElementById("trick-winner-info").innerHTML="";
                        // document.getElementById("new-trick-button").style.visible='hidden';
                        clearCardsPlayedTable(); // just in case!!
                        clearTricksPlayedTables();
                        // setInfo("Wacht op het verzoek tot het opgeven van de troefkleur en/of de mee te vragen aas/heer.");
                        setInfo("Het spelen begint!");
                        break;
                    case "finished":
                        document.getElementById("trick-id").innerHTML="";
                        setInfo("Het spel is afgelopen.");
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

    getSendEvent(event,data,callback){
        console.log("Sending event "+event+" with data "+JSON.stringify(data)+".");
        return [event,data,callback];
    }

    // MDH@23JAN2020: called from updateBidsTable
    getPlayerIndex(playerName){
        let playerIndex=(this._playerNames?this._playerNames.length:0);
        while(--playerIndex>=0&&this._playerNames[playerIndex]!==playerName);
        if(playerIndex<0){console.log("Player name '"+playerName+"' not found in "+JSON.stringify(this._playerNames)+".");}
        return playerIndex;
    }

    get numberOfPlayers(){return this._playerNames.length;}

    // what the player will be calling when (s)he made a bid, played a card, choose trump or partner suite
    bidMade(bid){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('BID',bid,function(){
                forceFocus(null); // a bit crude to get rid of the Bieden page name though
                console.log("BID event receipt acknowledged!");
                document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element again
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
                forceFocus(null);
                console.log("CARD played receipt acknowledged.");
            })); // replacing: {'player':this._playerIndex,'card':[card.suite,card.rank]}));
        return true;
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('TRUMPSUITE',trumpSuite,function(){
                forceFocus(null);
                console.log("Trump suite event receipt acknowledged.");
                document.getElementById("trump-suite-input").style.visibility="hidden"; // ascertain to hide the trump suite input element
            })); // same here: {'player':this._playerIndex,'suite':trumpSuite}));
        return true;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        this._socket.emit(...this.getSendEvent('PARTNERSUITE',partnerSuite,function(){
                forceFocus(null);
                console.log("Partner suite event receipt acknowledged!");
                document.getElementById("partner-suite-input").style.visibility="hidden"; // ascertain to hide the partner suite input element
            })); // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
        return true;
    }
    exit(reason){
        this._socket.emit(...this.getSendEvent('BYE',reason,function(){
            console.log("BYE event receipt acknowledged!");
            setPage("page-rules");
        }));
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
    
    }

    // MDH@20JAN2020: if we receive all partners we can extract the partner of the current player
    _setPartnerIds(partnerIds){
        this._partnerIds=partnerIds;
        // update the partner of the current player
        currentPlayer.partner=(this._partnerIds&&this._playerIndex>=0&&this._playerIndex<this._partnerIds.length?this._partnerIds[this._playerIndex]:null);
    }
    newCard(cardInfo){
        // I don't think we can do that????? this._trick.winner=cardInfo.winner;
        this._trick.addCard(new HoldableCard(cardInfo.suite,cardInfo.rank));
        // MDH@20JAN2020: every card played contains the partners as well!!!
        if(cardInfo.hasOwnProperty("partners"))this._setPartnerIds(cardInfo.partners); 
        // if all the cards in the trick have been played, the winner is definite, and wins the trick
        if(this._trick.numberOfCards===4)this._numberOfTricksWon[this._trick.winner]++;
        // do nothing...
        // showTrickCard(this._trick.getLastCard(),this._trick.numberOfCards);
        showTrick(this._trick);//if(this._trickWinner){this._trickWinner=null;showTrick(this._trick);}
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
                    alert("Programmafout: U wordt om een kaart gevraagd in een ongedefinieerde slag!");
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
                    clearCardsPlayedTable();
                    if(this._trick)updateTricksPlayedTables();
                    this._deltaPoints=data.deltapoints;
                }
                break;
            case "GAMEOVER":
                // kill the game instance (returning to the rules page until assigned to a game again)
                if(currentPlayer)currentPlayer.playsTheGameAtIndex(null,-1);
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
        this._eventsReceived=[];
        this._trickWinner=null;
        this._state=PlayerGame.OUT_OF_ORDER;
        this._socket=socket;
        this._dealer=-1;
        this._trumpSuite=-1;//this._trumpPlayer=-1;
        this._partnerSuite=-1;this._partnerRank=-1;
        this._numberOfTricksWon=[0,0,0,0]; // assume no tricks won by anybody
        this._numberOfTricksPlayed=0;this._trick=null;
        this._highestBid=-1;this._highestBidders=[]; // no highest bidders yet
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
    // MDH@24JAN2020: changed 'player' to 'als'!!!
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBkZWZpbml0aW9uIG9mIGEgcGxheWluZyBDYXJkXG4gKi9cbmNsYXNzIENhcmR7XG5cbiAgICBzdGF0aWMgZ2V0IFNVSVRFX05BTUVTKCl7cmV0dXJuIFtcImRpYW1vbmRcIixcImNsdWJcIixcImhlYXJ0XCIsXCJzcGFkZVwiXTt9XG4gICAgc3RhdGljIGdldCBSQU5LX05BTUVTKCl7cmV0dXJuIFtcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCJqYWNrXCIsXCJxdWVlblwiLFwia2luZ1wiLFwiYWNlXCJdO31cbiAgICAvLyBzaG9ydGhhbmQgJ2NoYXJhY3RlcnMnIGZvciB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uXG4gICAgLy8gTk9UIFdPUktJTkc6IGNvbnN0IENBUkRfU1VJVEVfQ0hBUkFDVEVSUz1bU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY2KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjMpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2NSksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYwKV07XG4gICAgc3RhdGljIGdldCBTVUlURV9DSEFSQUNURVJTKCl7cmV0dXJuIFsnXFx1MjY2NicsJ1xcdTI2NjMnLCdcXHUyNjY1JywnXFx1MjY2MCddfTsgLy8gWUVTLCBXT1JLSU5HISEhISFcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0RJQU1PTkQoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0xVQigpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBTVUlURV9IRUFSVCgpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBTVUlURV9TUEFERSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWycyJywnMycsJzQnLCc1JywnNicsJzcnLCc4JywnOScsJzEwJywnQicsJ1YnLCdLJywnQSddO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RXTygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RIUkVFKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRk9VUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZJVkUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TSVgoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TRVZFTigpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBSQU5LX0VJR0hUKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfTklORSgpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBSQU5LX1RFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBSQU5LX0pBQ0soKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19RVUVFTigpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19LSU5HKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBSQU5LX0FDRSgpe3JldHVybiAxMjt9O1xuXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkcyhjYXJkMSxjYXJkMil7XG4gICAgICAgIGxldCBkZWx0YVN1aXRlPWNhcmQxLl9jYXJkU3VpdGVJbmRleC1jYXJkMi5fY2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIGlmKGRlbHRhU3VpdGUhPTApcmV0dXJuIGRlbHRhU3VpdGU7XG4gICAgICAgIHJldHVybiBjYXJkMS5fY2FyZE5hbWVJbmRleC1jYXJkMi5fY2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgXG4gICAgLy8gaW4gYSB0cmljayB0aGUgcGxheSBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgY2FyZHMgYXJlIHRvIGJlIHBsYXllZCwgdGhlIHRydW1wIHN1aXRlIGRldGVybWluZXMgd2hhdCB0cnVtcCBpc1xuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZDEsY2FyZDIscGxheVN1aXRlLHRydW1wU3VpdGUpe1xuICAgICAgICAvLyBub3JtYWxseSB3aXRoIGFueSB0d28gcmVndWxhciBjYXJkcyB0aGV5IGFyZSBuZXZlciBlcXVhbCBpbiBhIHRyaWNrXG4gICAgICAgIC8vIGNhcmRzIHRoYXQgYXJlIG5laXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSBpcyBpcnJlbGV2YW50XG4gICAgICAgIGxldCByZXN1bHQ9MDtcbiAgICAgICAgbGV0IHR5cGU9Jy0nO1xuICAgICAgICAvLyAxLiBpZiBjYXJkMSBpcyB0cnVtcCwgYW5kIGNhcmQyIGlzIG5vdCBvciBoYXMgYSBsb3dlciByYW5rIGNhcmQxIHdpbnNcbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXRydW1wU3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0EnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBOT1QgdHJ1bXAgYnV0IGNhcmQyIGNvdWxkIHN0aWxsIGJlIHRydW1wXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nQic7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyB0cnVtcCwgc28gY291bGQgYmUgcGxheSBzdWl0ZSBvciBub3QuLi5cbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdDJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgbm90IHBsYXkgc3VpdGUsIGJ1dCBjYXJkMiBjb3VsZCBiZVxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nRCc7fVxuICAgICAgICBjb25zb2xlLmxvZygnPj4+IFR5cGU6ICcrdHlwZSsnOiAnK2NhcmQxLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiKHN1aXRlOiBcIitjYXJkMS5zdWl0ZStcIilcIisocmVzdWx0PjA/JyA+ICc6KHJlc3VsdDwwPycgPCAnOicgPSAnKSkrY2FyZDIuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKHN1aXRlOiBcIitjYXJkMi5zdWl0ZStcIilcIitcIiAocGxheTogXCIrKHBsYXlTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3BsYXlTdWl0ZV06XCI/XCIpK1wiLCB0cnVtcDpcIisoKHRydW1wU3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1t0cnVtcFN1aXRlXTpcIj9cIikpK1wiKVwiKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAvLyBsZXQncyBmaXJzdCByZWNvbXB1dGUgdGhlIHN1aXRlIG9mIGJvdGggY2FyZHMgYW5kIGVsZXZhdGUgdHJ1bXAgY2FyZHMsIGFuZCBkZWV2YWx1YXRlIG5vbiBwbGF5U3VpdGUgY2FyZHNcbiAgICAgICAgbGV0IGNhcmQxU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQxLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDEuc3VpdGUpKTtcbiAgICAgICAgbGV0IGNhcmQyU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDIuc3VpdGUpKTtcbiAgICAgICAgaWYoY2FyZDFTdWl0ZT49MHx8Y2FyZDJTdWl0ZT49MCl7IC8vIGF0IGxlYXN0IG9uZSBvZiB0aGUgY2FyZHMgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgLy8gaWYgdGhlIHN1aXRlcyBhcmUgdGhlIHNhbWUgdGhlIGhpZ2hlc3QgcmFuayB3aW5zXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPDApcmV0dXJuIC0xOyAvLyBpZiB0aGUgZmlyc3QgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBsb3dlclxuICAgICAgICAgICAgaWYoY2FyZDJTdWl0ZTwwKXJldHVybiAxOyAvLyBpZiB0aGUgc2Vjb25kIGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgaGlnaGVyXG4gICAgICAgICAgICAvLyBBU1NFUlQgYm90aCBjYXJkcyBhcmUgZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU9PWNhcmQyU3VpdGUpcmV0dXJuIGNhcmQxLnJhbmstY2FyZDIucmFuaztcbiAgICAgICAgICAgIC8vIEFTU0VSVCBvbmUgY2FyZCBpcyBwbGF5IHN1aXRlLCB0aGUgb3RoZXIgbXVzdCBiZSB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgcmV0dXJuKGNhcmQxU3VpdGU9PTQ/MTotMSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlLCBib3RoIGNhcmRzIGFyZSBpcnJlbGV2YW50IChzaG91bGQgaGFwcGVuIHRob3VnaClcbiAgICAgICAgcmV0dXJuIDA7IC8vIGNvbnNpZGVyZWQgZXF1YWwgdGhhdCBpcyBpcnJlbGV2YW50XG4gICAgfVxuICAgIFxuICAgIC8vIC8vIHlvdSdkIGhhdmUgdG8gdXNlIHRoZSBBcHBsZSBTeW1ib2xzIGZvbnRcbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpTwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgrE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CvjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4K9PC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgrs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CujwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4K5PC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgrg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CtzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4K2PC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgrU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CtDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KzPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgrI8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmjPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DkTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OePC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg508L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DmzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OaPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg5k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DmDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OXPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg5Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DlTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OUPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg5M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DkjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaY8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4OBPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg448L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DjTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4OLPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg4o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DiTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OIPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg4c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DhjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OFPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg4Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DgzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OCPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgqE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CrjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4KtPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgqs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CqjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4KpPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgqg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CpzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4KmPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgqU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CpDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KjPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgqI8L2xpPlxuICAgIHN0YXRpYyBnZXQgQ0FSRF9BUFBMRV9TWU1CT0xTKCl7cmV0dXJuIFtcbiAgICAgICAgWyfwn4OCJywn8J+DgycsJ/Cfg4QnLCfwn4OFJywn8J+DhicsJ/Cfg4cnLCfwn4OIJywn8J+DiScsJ/Cfg4onLCfwn4OLJywn8J+DjScsJ/Cfg44nLCfwn4OBJ10sXG4gICAgICAgIFsn8J+DkicsJ/Cfg5MnLCfwn4OUJywn8J+DlScsJ/Cfg5YnLCfwn4OXJywn8J+DmCcsJ/Cfg5knLCfwn4OaJywn8J+DmycsJ/Cfg50nLCfwn4OeJywn8J+DkSddLFxuICAgICAgICBbJ/CfgrInLCfwn4KzJywn8J+CtCcsJ/CfgrUnLCfwn4K2Jywn8J+CtycsJ/CfgrgnLCfwn4K5Jywn8J+CuicsJ/CfgrsnLCfwn4K9Jywn8J+CvicsJ/CfgrEnXSxcbiAgICAgICAgWyfwn4KiJywn8J+CoycsJ/CfgqQnLCfwn4KlJywn8J+CpicsJ/CfgqcnLCfwn4KoJywn8J+CqScsJ/CfgqonLCfwn4KrJywn8J+CrScsJ/Cfgq4nLCfwn4KhJ11cbiAgICBdfTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpe1xuICAgICAgICB0aGlzLl9jYXJkU3VpdGVJbmRleD1jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgdGhpcy5fY2FyZE5hbWVJbmRleD1jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICB0b1N0cmluZygpe1xuICAgICAgICByZXR1cm4gQ2FyZC5SQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdK1wiIG9mIFwiK0NhcmQuU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wic1wiO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuaygpe3JldHVybiB0aGlzLl9jYXJkTmFtZUluZGV4O31cbiAgICBnZXQgc3VpdGUoKXtyZXR1cm4gdGhpcy5fY2FyZFN1aXRlSW5kZXg7fVxuXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCl7XG4gICAgICAgIC8vIGlmIHdlJ3JlIHVzaW5nIHRoZSBzdmctY2FyZHMuc3ZnIHdlIGNhbiBkbyB0aGUgZm9sbG93aW5nLCBidXQgaW4gdGhhdCBjYXNlIHdlJ2QgbmVlZCB0byBrbm93IHRoZSBtYWduaWZpY2F0aW9uIGZhY3RvciEhIVxuICAgICAgICAvL3JldHVybiBDQVJEX0ZPTlRfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vcmV0dXJuICc8c3ZnIHZpZXdCb3g9XCIwIDAgNjc2IDk3NlwiPjx1c2UgeGxpbms6aHJlZj1cImltZy9zdmctY2FyZHMuc3ZnIycrU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wiLVwiK1JBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rJzwvdXNlPjwvc3ZnPic7XG4gICAgICAgIHJldHVybiBDYXJkLkNBUkRfQVBQTEVfU1lNQk9MU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vLy8vL3JldHVybiBTVUlURV9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XS5jb25jYXQoUkFOS19DSEFSQUNURVJTW3RoaXMuX2NhcmROYW1lSW5kZXhdKTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9Q2FyZDsiLCIvKipcbiAqIGRlZmluZXMgc29tZW9uZSB0aGF0IGhvbGRzIGNhcmRzXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5cbmNsYXNzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ESEAwNERFQzIwMTk6IGFsbG93aW5nIG5vdyB0byBjb25zdHJ1Y3QgZml4ZWQgc2l6ZSBjYXJkIGhvbGRlcnMgKGxpa2UgVHJpY2spXG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZDYXJkcz0wKXtcbiAgICAgICAgdGhpcy5fY2FyZHM9W107XG4gICAgICAgIHRoaXMuX251bWJlck9mQ2FyZHM9bnVtYmVyT2ZDYXJkcztcbiAgICAgICAgd2hpbGUoLS1udW1iZXJPZkNhcmRzPj0wKXRoaXMuX2NhcmRzLnB1c2gobnVsbCk7XG4gICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTtcbiAgICB9XG5cbiAgICAvLyBtZXRob2RzIHRvIGFkanVzdCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgX3JlbW92ZUNhcmQoY2FyZCl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMuaW5kZXhPZihjYXJkKTtcbiAgICAgICAgaWYoY2FyZEluZGV4Pj0wKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzLnNwbGljZShjYXJkSW5kZXgsMSkubGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrY2FyZCtcIiByZW1vdmVkIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIi5cIik7XG4gICAgICAgICAgICAgICAgY2FyZC5faG9sZGVyPW51bGw7IC8vIHdoZW4gc3VjY2Vzc2Z1bCBhcHBhcmVudGx5IG5vIGxvbmdlciBhdmFpbGFibGUhISFcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIiBvZiBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiOiBpdCBpcyBub3QgcHJlc2VudC5cIik7XG4gICAgfVxuICAgIF9hZGRDYXJkKGNhcmQpe1xuICAgICAgICBpZighY2FyZClyZXR1cm47XG4gICAgICAgIGlmKCEoY2FyZCBpbnN0YW5jZW9mIEhvbGRhYmxlQ2FyZCkpdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgaG9sZGFibGUgY2FyZCFcIik7XG4gICAgICAgIHRoaXMubG9nKFwiQWRkaW5nIGNhcmQgXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgdGhpcy5fY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPm51bWJlck9mQ2FyZHNOb3cpe1xuICAgICAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlOyAvLyBjYW4gbm8gbG9uZ2VyIGd1YXJhbnRlZSB0aGF0IGl0IGlzIHNvcnRlZC4uLlxuICAgICAgICAgICAgY2FyZC5faG9sZGVyPXRoaXM7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIChcIitjYXJkLnRvU3RyaW5nKCkrXCIpIGFkZGVkIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgICAgICAvLyBob3cgYWJvdXQgb3JkZXJpbmcgdGhlIGNhcmRzPz8/Pz8/IG9yIHN0b3JpbmcgdGhlbSBieSBzdWl0ZT8/Pz9cbiAgICAgICAgICAgIHRoaXMubG9nKFwiXFx0Q2FyZCBjb2xsZWN0aW9uOiBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gYWRkIGNhcmQgXCIrY2FyZCtcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIgKGRlbHRhIG51bWJlciBvZiBjYXJkczogXCIrKHRoaXMubnVtYmVyT2ZDYXJkcy1udW1iZXJPZkNhcmRzTm93KStcIikuXCIpO1xuICAgIH1cbiAgICAvKlxuICAgIC8vIHJlcGxhY2UgYSBjYXJkIGF0IGEgZ2l2ZW4gaW5kZXggKGFzIHVzZWQgaW4gVHJpY2spXG4gICAgX3NldENhcmRBdEluZGV4KGNhcmQsaW5kZXgpe1xuICAgICAgICBpZihpbmRleDwwfHxpbmRleD49dGhpcy5udW1iZXJPZkNhcmRzKXRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlcGxhY2UgY2FyZCAjXCIrU3RyaW5nKGluZGV4KzEpK1wiLlwiKTtcbiAgICAgICAgbGV0IGNhcmRBdEluZGV4PXRoaXMuX2NhcmRzW2luZGV4XTtcbiAgICAgICAgaWYoY2FyZEF0SW5kZXgpe2NhcmRBdEluZGV4Ll9ob2xkZXI9bnVsbDt0aGlzLl9jYXJkc1tpbmRleF09bnVsbDt9XG4gICAgICAgIGlmKGNhcmQpe1xuICAgICAgICAgICAgLy8gaWYgJ2NvbnRhaW5lZCcgaW4gYW5vdGhlciBjYXJkIGhvbGRlciByZW1vdmUgaXQgZnJvbSB0aGVyZSEhIVxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIGlmKGNhcmQuX2hvbGRlciljYXJkLl9ob2xkZXIucmVtb3ZlQ2FyZChjYXJkKTtcbiAgICAgICAgICAgICAgICBpZighY2FyZC5faG9sZGVyKXt0aGlzLl9jYXJkc1tpbmRleF09Y2FyZDtjYXJkLl9ob2xkZXI9dGhpczt9ICAgIFxuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXt9XG4gICAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgICAvLyBwb2xsIHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBnZXQgbnVtYmVyT2ZDYXJkcygpe3JldHVybiB0aGlzLl9jYXJkcy5sZW5ndGg7fVxuXG4gICAgZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5yYW5rPT1yYW5rO30pO1xuICAgIH1cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuaykubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoc3VpdGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnN1aXRlPT1zdWl0ZTt9KS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudFxuICAgICAqL1xuICAgIGdldFN1aXRlcygpe1xuICAgICAgICAvLyBjYW4ndCB1c2UgdGhpcyBpbiBmaWx0ZXIhISEgcmV0dXJuIFswLDEsMiwzXS5maWx0ZXIoKHJhbmspPT57cmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKT4wO30pO1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIG51bWJlciBvZiBjYXJkcyBpbiB0aGUgaG9sZGVyIHdpdGggdGhlIGdpdmVuIHJhbmtcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5pbmcgYW4gYXJyYXkgd2l0aCBhbGwgc3VpdGVzLCB3aXRoIC0xIHdoZXJlIGEgc3VpdGUgaXMgbm90IHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgY2FyZHMgXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhvdXRSYW5rKHJhbmspe1xuICAgICAgICAvLyBhaCB0aGlzIGlzIGFuIGlzc3VlLCBiZWNhdXNlIGlmIHlvdSBkbyBub3QgaGF2ZSBhIGNlcnRhaW4gc3VpdGUgdGhlIHN1aXRlIHNob3VsZCBOT1QgYmUgcmV0dXJuZWQhISEhIVxuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e1xuICAgICAgICAgICAgaWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTsgLy8gaWYgc3VpdGUgbm90IHByZXNlbnQgeWV0LCBhZGQgaXQgdG8gc3VpdGVzXG4gICAgICAgICAgICBpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlc1tjYXJkLnN1aXRlXT0tMTsgLy8gbm90IHJlbW92aW5nIGl0IGJ1dCBzZXR0aW5nIHRvIC0xIGlmIHdlIGxvY2F0ZSB0aGUgcmFua1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudCBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgZ2V0UmFua2xlc3NTdWl0ZXMocmFuayl7XG4gICAgICAgIGxldCByYW5rbGVzc1N1aXRlcz1bXTtcbiAgICAgICAgbGV0IHN1aXRlc1dpdGhSYW5rcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaChcbiAgICAgICAgICAgIChjYXJkKT0+e1xuICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCYmc3VpdGVzV2l0aFJhbmtzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuY2FyZE5hbWVJbmRleD09cmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWl0ZXNXaXRoUmFua3MucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgc3VpdGUgaWYgYWxyZWFkeSBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZUluZGV4PXJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlSW5kZXg+PTApcmFua2xlc3NTdWl0ZXMuc3BsaWNlKHJhbmtsZXNzU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgLy8gdW50aWwgcHJvdmVuIGRpZmZlcmVudGx5XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5rbGVzc1N1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJhbmtsZXNzU3VpdGVzO1xuICAgIH1cblxuICAgIGdldEZpcnN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1swXTt9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB1c2VkIGluIGdhbWVlbmdpbmUuanNcbiAgICBnZXRMYXN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkcy5sZW5ndGgtMV07fVxuXG4gICAgY29udGFpbnNDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZD49MCYmKHRoaXMuX2NhcmRzW2NhcmRdLnN1aXRlIT09c3VpdGV8fHRoaXMuX2NhcmRzW2NhcmRdLnJhbmshPT1yYW5rKSk7XG4gICAgICAgIHJldHVybihjYXJkPj0wKTsgLy8gZm91bmQgaWYgY2FyZCBpcyBub3QgbmVnYXRpdmVcbiAgICB9XG5cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSBuZWVkIHRoaXMgdG8gZmluZCBhIHNwZWNpZmljIGNhcmRcbiAgICBnZXRDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkSW5kZXg+PTApe2xldCBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07aWYoY2FyZC5zdWl0ZT09PXN1aXRlJiZjYXJkLnJhbms9PT1yYW5rKXJldHVybiBjYXJkO31cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FuIGV4cG9zZSBhIHRleHQgcmVwcmVzZW50aW9uXG4gICAgICovXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHN1aXRlU2VwYXJhdG9yKXtcbiAgICAgICAgdGhpcy5sb2coXCJOdW1iZXIgb2YgY2FyZHMgdG8gcmVwcmVzZW50OiBcIit0aGlzLl9jYXJkcy5sZW5ndGgrXCIuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgc29ydGluZz8/Pz8/Pz8/IHRoYXQgd291bGQgYmUgbmljZVxuICAgICAgICBpZihzdWl0ZVNlcGFyYXRvciYmdHlwZW9mIHN1aXRlU2VwYXJhdG9yPT09XCJzdHJpbmdcIiYmIXRoaXMuX3NvcnRlZCl7XG4gICAgICAgICAgICB0aGlzLl9jYXJkcy5zb3J0KGNvbXBhcmVDYXJkcyk7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9dHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5fc29ydGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLm1hcCgoY2FyZCk9PntyZXR1cm4gY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTt9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgLy8gY2FyZHMgYXJlIHN1cHBvc2VkIHRvIGJlIHNvcnRlZFxuICAgICAgICBsZXQgdGV4dFJlcHJlc2VudGF0aW9uPVwiXCI7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGxldCBjYXJkPXRoaXMuZ2V0Rmlyc3RDYXJkKCk7XG4gICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb249Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTE7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz0oY2FyZC5zdWl0ZSE9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT9zdWl0ZVNlcGFyYXRvcjpcIiBcIik7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dFJlcHJlc2VudGF0aW9uOyAvLyBhIHNpbmdsZSBibGFuayBiZXR3ZWVuIHRoZW0hISFcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhIGNhcmQgd2l0aCBhIGNhcmQgaG9sZGVyIGlzIGhlbGRcbiAqL1xuY2xhc3MgSG9sZGFibGVDYXJkIGV4dGVuZHMgQ2FyZHtcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSE9MREFCTEVDQVJEID4+PiBcIit0b2xvZyk7XG4gICAgfVxuXG4gICAgc2V0IGhvbGRlcihob2xkZXIpe1xuICAgICAgICB0aGlzLmxvZyhcIkNoYW5naW5nIHRoZSBob2xkZXIgb2YgY2FyZCBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgY3VycmVudCBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYodGhpcy5faG9sZGVyKXRoaXMuX2hvbGRlci5fcmVtb3ZlQ2FyZCh0aGlzKTtcbiAgICAgICAgLy8gYWRkICh3aGVuIHN1Y2Nlc3NmdWxseSByZW1vdmVkKSB0byB0aGUgbmV3IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZighdGhpcy5faG9sZGVyJiZob2xkZXIpaG9sZGVyLl9hZGRDYXJkKHRoaXMpO2Vsc2UgdGhpcy5sb2coXCJFUlJPUjogVW5hYmxlIHRvIGNoYW5nZSB0aGUgaG9sZGVyIVwiKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4LGhvbGRlcil7XG4gICAgICAgIHN1cGVyKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpO1xuICAgICAgICB0aGlzLl9ob2xkZXI9bnVsbDtcbiAgICAgICAgdGhpcy5ob2xkZXI9aG9sZGVyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIFwiSG9sZGFibGUgXCIrc3VwZXIudG9TdHJpbmcoKTt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9e0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfTsiLCIvKipcbiAqIGEgcGxhY2Vob2xkZXIgZm9yIGEgcGxheWVyXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG4vKipcbiAqIGEgUGxheWVyIGNhbiBtYWtlIGEgYmlkLCBvciBwbGF5IGEgY2FyZCwgY2hvb3NlIGEgdHJ1bXAgYW5kIHBhcnRuZXIgc3VpdGVcbiAqL1xuY2xhc3MgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBiaWRNYWRlKGJpZCl7fVxuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7fVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7fVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe31cbn1cblxuLy8gTURIQDA3REVDMjAxOTogUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXIgd2l0aCBnYW1lIGRhdGEgZXhwb3NlZCB0byBwbGF5ZXJcbi8vICAgICAgICAgICAgICAgIHdoaWNoIHdhcyBlYXJsaWVyIHN0b3JlZCBpbiBlYWNoIHRyaWNrXG5jbGFzcyBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBzdGF0aWMgZ2V0IEJJRF9OQU1FUygpe3JldHVybiBbXCJwYXNcIixcInJpa1wiLFwicmlrIChiZXRlcilcIixcIm5lZ2VuIGFsbGVlblwiLFwibmVnZW4gYWxsZWVuIChiZXRlcilcIixcInBpY29cIixcInRpZW4gYWxsZWVuXCIsXCJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJlbGYgYWxsZWVuXCIsXCJlbGYgYWxsZWVuIChiZXRlcilcIixcIm1pc1xceGU4cmVcIixcInR3YWFsZiBhbGxlZW5cIixcInR3YWFsZiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlXCIsXCJkZXJ0aWVuIGFsbGVlblwiLFwiZGVydGllbiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlIG1ldCBlZW4gcHJhYXRqZVwiLFwidHJvZWxhXCIsXCJvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWdcIixcIm9tIGRlIGxhYXRzdGUgc2xhZ1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BBUygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBCSURfUklLKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUtfQkVURVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTigpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QSUNPKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTigpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX01JU0VSRSgpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU4oKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDEyO307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkUoKXtyZXR1cm4gMTM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTigpe3JldHVybiAxNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDE1O307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFKCl7cmV0dXJuIDE2O307XG4gICAgc3RhdGljIGdldCBCSURfVFJPRUxBKCl7cmV0dXJuIDE3O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHX0VOX1NDSE9QUEVOX1ZST1VXKCl7cmV0dXJuIDE4O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHKCl7cmV0dXJuIDE5O307XG4gICAgc3RhdGljIGdldCBCSURTX0FMTF9DQU5fUExBWSgpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUElDTyxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRSxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkVdO307IC8vIHRydW1wbGVzcyBnYW1lc1xuICAgIHN0YXRpYyBnZXQgQklEU19XSVRIX1BBUlRORVJfSU5fSEVBUlRTKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIsUGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSXTt9OyAvLyBnYW1lcyB3aXRoIHRydW1wIHBsYXllZCB3aXRoIGEgcGFydG5lclxuICAgIHN0YXRpYyBnZXQgQklEX1JBTktTKCl7cmV0dXJuIFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywwLC0xLC0xXTt9OyAvLyBob3cgSSBwbGF5ZWQgaXQgKGJpZCBwYXNzIGV4Y2x1ZGVkIChhbHdheXMgcmFuayAwKSlcbiAgICBcbiAgICAvLyBlYWNoIGJpZCBoYXMgYSBjZXJ0YWluIGFtb3VudCBvZiBwb2ludHMgdG8gcmVjZWl2ZSB3aGVuIHdpbm5pbmcgdGhlIGdhbWVcbiAgICBzdGF0aWMgZ2V0IEJJRF9QT0lOVFMoKXtyZXR1cm4gWzAsMSwxLDMsMyw0LDQsNCw1LDUsNSw2LDYsNiw3LDcsMTAsMiwyLDJdO31cblxuICAgIC8vIHRoZSBzdGF0ZSBjb25zdGFudHMgd2UgaGF2ZVxuICAgIHN0YXRpYyBnZXQgT1VUX09GX09SREVSKCl7cmV0dXJuIDA7fVxuICAgIHN0YXRpYyBnZXQgSURMRSgpe3JldHVybiAxO31cbiAgICBzdGF0aWMgZ2V0IERFQUxJTkcoKXtyZXR1cm4gMjt9XG4gICAgc3RhdGljIGdldCBCSURESU5HKCl7cmV0dXJuIDM7fVxuICAgIHN0YXRpYyBnZXQgUExBWUlORygpe3JldHVybiA0O31cbiAgICBzdGF0aWMgZ2V0IENBTkNFTElORygpe3JldHVybiA1O31cbiAgICBzdGF0aWMgZ2V0IEZJTklTSEVEKCl7cmV0dXJuIDY7fVxuICAgIGdldFRydW1wU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7fVxuICAgIGdldFRydW1wUGxheWVyKCl7fVxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVyKXt9XG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXt9XG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXt9XG4gICAgZ2V0IHBvaW50cygpe31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzUGxheWVkKCl7fVxuICAgIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXRUZWFtTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JCaWQoKXt9XG4gICAgX2Fza1BsYXllckZvclRydW1wU3VpdGUoKXt9XG4gICAgX2Fza1BsYXllckZvclBhcnRuZXJTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yQ2FyZCgpe31cbiAgICBfY2FyZFBsYXllZEFjY2VwdGVkKCl7fSAvLyBNREhAMjNKQU4yMDIwOiB0aGUgZW1wdHkgbWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIGEgY2FyZCB3YXMgcGxheWVkIHN1Y2Nlc3NmdWxseVxufVxuXG5jb25zdCBDSE9JQ0VfSURTPVtcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIl07XG5cbmNvbnN0IFBMQVlFUlRZUEVfRk9PPTAsUExBWUVSVFlQRV9VTktOT1dOPTEsUExBWUVSVFlQRV9GUklFTkQ9MjtcblxuLy8gdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIFBsYXllciBpbnN0YW5jZXNcbi8vIHdvdWxkIGJlIGRlZmluZWQgYWJzdHJhY3QgaW4gY2xhc3NpY2FsIE9PXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJQTEFZRVIgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lciYmcGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycy5wdXNoKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBldmVudCBsaXN0ZW5lcnM6IFwiK3RoaXMuX2V2ZW50TGlzdGVuZXJzK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuZXZlciBhIGdhbWUgaXMgc3RhcnRlZCwgY2FsbCBuZXdHYW1lISFcbiAgICBuZXdHYW1lKCl7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDB8fCF0aGlzLl9nYW1lKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIFwiK3RoaXMubmFtZStcIiB1bmFibGUgdG8gcHJlcGFyZSBmb3IgcGxheWluZzogbm90IGFzc29jaWF0ZWQgd2l0aCBhIGdhbWUgeWV0LlwiKTtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJVRzogUGxheWVyIFwiK3RoaXMubmFtZStcIiBzdGlsbCBoYXMgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzLlwiKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIGJldHRlciBkb25lIHRoaXMgd2F5IGluc3RlYWQgb2YgdGhpcy5fY2FyZHM9W11cbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZhdWx0IHBsYXllciByZW1lbWJlcmluZyBpdHMgY2hvaWNlc1xuICAgICAgICB0aGlzLl9iaWQ9LTE7IC8vIHRoZSBsYXN0IGJpZCBvZiB0aGlzIHBsYXllclxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX2NhcmQ9bnVsbDtcbiAgICAgICAgLy8gdGhlIGdhbWUgYmVpbmcgcGxheWVkLCBhbmQgdGhlIGluZGV4IHdpdGhpbiB0aGF0IGdhbWVcbiAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uPVtdOyAvLyB0aGUgdHJpY2tzIHdvbiAoaW4gYW55IGdhbWUpXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW49LTE7IC8vIGRvZXNuJ3QgbWF0dGVyXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZSxwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbmFtZT1uYW1lO1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycz1bXTtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgICAgICBpZighKHBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKSl0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgZXZlbnQgbGlzdGVuZXIgb2Ygd3JvbmcgdHlwZS5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVjZWl2aW5nIGdhbWUgYW5kIGluZGV4XG4gICAgICAgIHRoaXMuX2luZGV4PS0xO3RoaXMuX2dhbWU9bnVsbDsgLy8gd2FpdGluZyBmb3IgdGhlIGdhbWUgdG8gYmUgcGx1Z2dlZCBpbiAob25jZSlcbiAgICAgICAgLy8gcmVtb3ZlZCB3YWl0IHVudGlsIGdldHRpbmcgY2FsbGVkIHRocm91Z2ggbmV3R2FtZTogdGhpcy5fcHJlcGFyZUZvclBsYXlpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gZ2V0dGVycyBleHBvc2luZyBpbmZvcm1hdGlvbiB0byB0aGUgbWFkZSBjaG9pY2VcbiAgICAvLyBOT1RFIG5vIGxvbmdlciBjYWxsZWQgYnkgdGhlIGdhbWUgYmVjYXVzZSB0aGUgY2hvaWNlIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCBub3dcbiAgICAvLyAgICAgIHRoaXMgd2F5IHN1YmNsYXNzZXMgYXJlIG5vdCBvYmxpZ2F0ZWQgdG8gcmVtZW1iZXIgdGhlIGNob2ljZXMgdGhleSBtYWtlXG4gICAgZ2V0IGJpZCgpe3JldHVybiB0aGlzLl9iaWQ7fVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXQgY2FyZCgpe3JldHVybiB0aGlzLmNhcmQoKTt9XG5cbiAgICBnZXQgcGFydG5lcigpe3JldHVybiB0aGlzLl9wYXJ0bmVyO31cblxuICAgIC8vLy8vLy8vLy8vLy8vZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZFBsYXlJbmRleF07fVxuXG4gICAgLyogY2FuIGJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgZ2FtZVxuICAgIC8vIGNhbiBiZSBzZXQgZGlyZWN0bHkgd2hlbiBhIGJldHRlciAncmlrJyB2YXJpYXRpb24gYmlkIHdhcyBkb25lISEhIVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIFxuICAgIC8vIFRPRE8gaXQgd291bGQgYmUgZWFzaWVyIHRvIGNvbWJpbmUgdGhlc2UgaW4gYSBjYXJkISEhIVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuXG4gICAgLy8gY2FsbGVkIGZyb20gdGhlIFVJIHRvIHNldCB0aGUgdHJ1bXAgc3VpdGUhISEhXG4gICAgc2V0IHRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO3RoaXMudHJ1bXBTdWl0ZUNob3NlbigpO31cbiAgICBzZXQgcGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLnBhcnRuZXJTdWl0ZUNob3NlbigpO31cbiAgICAqL1xuXG4gICAgLy8gZW5kIG9mIGdldHRlcnMvc2V0dGVycyB1c2VkIGJ5IHRoZSBnYW1lXG4gICAgX3JlbW92ZUNhcmRzKCl7d2hpbGUodGhpcy5fY2FyZHMubGVuZ3RoPjApdGhpcy5fY2FyZHMuc2hpZnQoKS5ob2xkZXI9bnVsbDt9XG5cbiAgICBnZXQgZ2FtZSgpe3JldHVybiB0aGlzLl9nYW1lO31cbiAgICBzZXQgZ2FtZShnYW1lKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZT09PWdhbWUpcmV0dXJuO1xuICAgICAgICBpZihnYW1lJiYhKGdhbWUgaW5zdGFuY2VvZiBQbGF5ZXJHYW1lKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUgaW5zdGFuY2Ugc3VwcGxpZWQgdG8gcGxheWVyIFwiKyh0aGlzLm5hbWV8fFwiP1wiKStcIiBub3Qgb2YgdHlwZSBQbGF5ZXJHYW1lLlwiKTtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGluZGV4IG9mIHBsYXllciBcIisodGhpcy5uYW1lfHxcIj9cIikrXCIgdW5rbm93biFcIik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIE1ESEAxMUpBTjIwMjA6IGlmIHRoZSBnYW1lIGNoYW5nZXMgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgY2FyZHNcbiAgICAgICAgdGhpcy5fZ2FtZT1nYW1lO1xuICAgICAgICAvLyBzeW5jIF9pbmRleFxuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMucGFydG5lcj0tMTsgLy8gbXkgcGFydG5lciAob25jZSBJIG5vdyB3aG8gaXQgaXMpXG4gICAgICAgICAgICB0aGlzLnRyaWNrc1dvbj1bXTsgLy8gc3RvcmluZyB0aGUgdHJpY2tzIHdvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4KCl7cmV0dXJuIHRoaXMuX2luZGV4O30gLy8gTURIQDIySkFOMjAyMDogbm8gaGFybSBpbiBhZGRpbmcgYSBnZXR0ZXIhISFcbiAgICBzZXQgaW5kZXgoaW5kZXgpe3RoaXMuX2luZGV4PWluZGV4O30gLy8gTURIQDA5SkFOMjAyMDogc29tZXRpbWVzIGFuIGluZGV4IGNhbiBiZSBzZXQgc2VwYXJhdGVseVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWdpc3RlcmluZyB0aGUgZ2FtZSBwbGF5ZWQgYXQgaW5kZXggXCIraW5kZXgrXCIuXCIpO1xuICAgICAgICB0aGlzLmluZGV4PWluZGV4O1xuICAgICAgICB0aGlzLmdhbWU9Z2FtZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIHJlZ2lzdGVyZWQhXCIpO1xuICAgIH1cbiAgICAvKlxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIHN1cGVyLmFkZENhcmQoY2FyZCk7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzK1wiJyByZWNlaXZlZCBjYXJkICdcIitjYXJkK1wiJy5cIik7XG4gICAgfVxuICAgICovXG4gICAgX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUsd2hlbk5vdEZvdW5kQ2FyZCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4oY2FyZC5zdWl0ZT09Y2FyZFN1aXRlKTt9KTtcbiAgICB9XG5cbiAgICBfZ2V0U3VpdGVDYXJkcygpe1xuICAgICAgICB0aGlzLmxvZyhcIkRldGVybWluaW5nIHN1aXRlIGNhcmRzIG9mIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiBjYXJkcyFcIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmRzPVtbXSxbXSxbXSxbXV07XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57c3VpdGVDYXJkc1tjYXJkLnN1aXRlXS5wdXNoKGNhcmQpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVDYXJkcztcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgb2YgYSBnaXZlbiBjYXJkIHN1aXRlIChvciBhbnkgY2FyZCBpZiBjYXJkU3VpdGUgaXMgdW5kZWZpbmVkKVxuICAgIGNvbnRyaWJ1dGVUb1RyaWNrKHRyaWNrKSB7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD09MCl0aHJvdyBuZXcgRXJyb3IoXCJObyBjYXJkcyBsZWZ0IHRvIHBsYXkhXCIpO1xuICAgICAgICBsZXQgY2FyZHNPZlN1aXRlPXRoaXMuX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUpO1xuICAgICAgICBsZXQgY2FyZD0oY2FyZHNPZlN1aXRlJiZjYXJkc09mU3VpdGUubGVuZ3RoPjA/Y2FyZHNPZlN1aXRlWzBdOnRoaXMuX2NhcmRzWzBdKTtcbiAgICAgICAgY2FyZC5ob2xkZXI9dHJpY2s7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhlIHRyaWNrXG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBtYWRlIGEgYmlkXG4gICAgX2JpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpIC8vIGNhdGNoIGFueSBlcnJvciB0aHJvd24gYnkgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXsoIWV2ZW50TGlzdGVuZXJ8fGV2ZW50TGlzdGVuZXIuYmlkTWFkZSh0aGlzLl9iaWQpKTt9Y2F0Y2goZXJyb3Ipe319KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3NpbmcgYmlkIFwiK3RoaXMuX2JpZCtcIiBvZiBwbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgdG8gdGhlIGdhbWUhXCIpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZS5iaWRNYWRlKHRoaXMuX2JpZCk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBObyBnYW1lIHRvIHBhc3MgYmlkIFwiK3RoaXMuX2JpZCtcIiBvZiBwbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicuXCIpO1xuICAgIH1cbiAgICBfc2V0QmlkKGJpZCl7dGhpcy5fYmlkTWFkZSh0aGlzLl9iaWQ9YmlkKTt9XG5cbiAgICBfY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9PntldmVudExpc3RlbmVyLmNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7fSk7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpdGhpcy5fZ2FtZS5jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgIH1cbiAgICAvLyBUT0RPIGEgYmlkIHNldHRlciB3aWxsIGFsbG93IHN1YmNsYXNzZXMgdG8gcGFzcyBhIGJpZCBieSBzZXR0aW5nIHRoZSBwcm9wZXJ0eVxuICAgIF9zZXRDYXJkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICAvLyB0ZWNobmljYWxseSBjaGVja2luZyB3aGV0aGVyIHRoZSBwbGF5ZWQgY2FyZCBpcyB2YWxpZCBzaG91bGQgYmUgZG9uZSBoZXJlLCBvciBCRUZPUkUgY2FsbGluZyBzZXRDYXJkXG4gICAgICAgIHRoaXMuX2NhcmRQbGF5ZWQodGhpcy5fY2FyZD1jYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob29zZW4gYSB0cnVtcCBzdWl0ZVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpdGhpcy5fZ2FtZS50cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXt0aGlzLnRydW1wU3VpdGVDaG9zZW4odGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlKTt9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob3NlbiBhIHBhcnRuZXJcbiAgICBwYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci5wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpdGhpcy5fZ2FtZS5wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTtcbiAgICB9XG4gICAgX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpe3RoaXMucGFydG5lclN1aXRlQ2hvc2VuKHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGUpO31cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBtYWtlIGEgYmlkIHBhc3NpbmcgaW4gdGhlIGhpZ2hlc3QgYmlkIHNvIGZhclxuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBtYWtlQUJpZChwbGF5ZXJiaWRzKXtcbiAgICAgICAgLy8gYXNzdW1lcyB0aGF0IHRoaXMgcGxheWVyIGhhcyBtYWRlIGEgYmlkIGJlZm9yZSwgb3IgdGhhdCB0aGlzIGlzIHRoZSBmaXJzdCBiaWRcbiAgICAgICAgLy8gdGhpcyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdG8gYmUgcnVubmluZyBpbiBhIGJyb3dzZXIgc28gd2UgY2FuIHVzZSBwcm9tcHQoKVxuICAgICAgICAvLyBhbGwgb3RoZXIgYXZhaWxhYmxlIGJpZHMgc2hvdWxkIGJlIGJldHRlciB0aGFuIHRoZSBsYXN0IGJpZCBieSBhbnkgb3RoZXIgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkU29GYXI9UGxheWVyR2FtZS5CSURfUEFTO1xuICAgICAgICBpZihwbGF5ZXJiaWRzKXtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUGxheWVyIGJpZHM6XCIscGxheWVyYmlkcyk7XG4gICAgICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJiaWRzLmxlbmd0aDtwbGF5ZXIrKylcbiAgICAgICAgICAgICAgICBpZihwbGF5ZXJiaWRzW3BsYXllcl0ubGVuZ3RoPjAmJnBsYXllcmJpZHNbcGxheWVyXVswXT5oaWdoZXN0QmlkU29GYXIpXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hlc3RCaWRTb0Zhcj1wbGF5ZXJiaWRzW3BsYXllcl1bMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2coXCJIaWdoZXN0IGJpZCBzbyBmYXI6ICdcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdK1wiJy5cIik7XG4gICAgICAgIC8vIGlmIHRoZSBoaWdoZXN0IHBvc3NpYmxlIGJpZCBpcyBub3QgYSBiaWQgYWxsIGNhbiBwbGF5IChhdCB0aGUgc2FtZSB0aW1lKSwgY2FuJ3QgYmUgYmlkIGFnYWluXG4gICAgICAgIGlmKFBsYXllckdhbWUuQklEU19BTExfQ0FOX1BMQVkuaW5kZXhPZihQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdKTwwKWhpZ2hlc3RCaWRTb0ZhcisrO1xuICAgICAgICBsZXQgcG9zc2libGVCaWROYW1lcz1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5zbGljZShoaWdoZXN0QmlkU29GYXIpO1xuICAgICAgICBwb3NzaWJsZUJpZE5hbWVzLnVuc2hpZnQoUGxheWVyR2FtZS5CSURfTkFNRVNbUGxheWVyR2FtZS5CSURfUEFTXSk7IC8vIHVzZXIgY2FuIGFsd2F5cyAncGFzJ1xuICAgICAgICB0aGlzLmxvZyhcIlBvc3NpYmxlIGJpZHM6IFwiLHBvc3NpYmxlQmlkTmFtZXMpO1xuICAgICAgICBsZXQgYmlkPS0xO1xuICAgICAgICB3aGlsZShiaWQ8MCl7XG4gICAgICAgICAgICBsZXQgYmlkbmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgaXMgeW91ciBiaWQgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUJpZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVCaWROYW1lc1swXSk7XG4gICAgICAgICAgICBiaWQ9UGxheWVyR2FtZS5CSURfTkFNRVMuaW5kZXhPZihiaWRuYW1lKTtcbiAgICAgICAgICAgIGlmKGJpZDwwKWNvbnRpbnVlO1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEJpZChiaWQpO1xuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICBiaWQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIC8vIGlmIHRoaXMgcGxheWVyIGhhcyBhbGwgYWNlcyBpdCdzIGdvbm5hIGJlIHRoZSBzdWl0ZSBvZiBhIGtpbmcgdGhlIHBlcnNvbiBoYXNuJ3RcbiAgICAgICAgLy8gYWxzbyBpdCBuZWVkcyB0byBiZSBhbiBhY2Ugb2YgYSBzdWl0ZSB0aGUgdXNlciBoYXMgaXRzZWxmICh1bmxlc3MgeW91IGhhdmUgYWxsIG90aGVyIGFjZXMpXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIC8vIGFueSBvZiB0aGUgc3VpdGVzIGluIHRoZSBjYXJkcyBjYW4gYmUgdGhlIHRydW1wIHN1aXRlIVxuICAgICAgICBsZXQgcG9zc2libGVUcnVtcFN1aXRlTmFtZXM9dGhpcy5nZXRTdWl0ZXMoKS5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHRydW1wU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgdHJ1bXBOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBzdWl0ZSB3aWxsIGJlIHRydW1wIChvcHRpb25zOiAnXCIrcG9zc2libGVUcnVtcFN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVRydW1wU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICB0cnVtcFN1aXRlPXBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmluZGV4T2YodHJ1bXBOYW1lKTtcbiAgICAgICAgICAgIGlmKHRydW1wU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogYXNrcyBmb3IgdGhlIHN1aXRlIG9mIHRoZSBwYXJ0bmVyIGNhcmQgb2YgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoKXtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1SQU5LX0FDRTtcbiAgICAgICAgLy8gZ2V0IGFsbCB0aGUgYWNlbGVzcyBzdWl0ZXNcbiAgICAgICAgbGV0IHN1aXRlcz10aGlzLmdldFN1aXRlcygpO1xuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPT0wKXsgLy8gcGxheWVyIGhhcyBBTEwgYWNlc1xuICAgICAgICAgICAgaWYoc3VpdGVzLmxlbmd0aDw0KXsgLy8gYnV0IG5vdCBhbGwgc3VpdGVzXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZSBzdWl0cyB0aGUgdXNlciBkb2VzIG5vdCBoYXZlIGFyZSBhbGxvd2VkIChhc2tpbmcgdGhlIGFjZSBibGluZCEhISlcbiAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9WzAsMSwyLDNdLmZpbHRlcigoc3VpdGUpPT57cmV0dXJuIHBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHN1aXRlKTwwO30pO1xuICAgICAgICAgICAgfWVsc2V7IC8vIGhhcyBhbGwgc3VpdHMsIHNvIGEga2luZyBpcyB0byBiZSBzZWxlY3RlZCEhIVxuICAgICAgICAgICAgICAgIC8vIGFsbCBraW5ncyBhY2NlcHRhYmxlIGV4Y2VwdCBmb3IgdGhhdCBpbiB0aGUgdHJ1bXAgY29sb3JcbiAgICAgICAgICAgICAgICAvLyBOT1RFIGlmIGEgcGVyc29uIGFsc28gaGFzIGFsbCB0aGUga2luZ3Mgd2UgaGF2ZSBhIHNpdHVhdGlvbiwgd2Ugc2ltcGx5IGNvbnRpbnVlIG9ud2FyZFxuICAgICAgICAgICAgICAgIHdoaWxlKDEpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuay0tO1xuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0cnVtcFN1aXRlSW5kZXg9cG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2YodGhpcy5fdHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRydW1wU3VpdGVJbmRleD49MClwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuc3BsaWNlKHRydW1wU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD4wKWJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcz1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHBhcnRuZXJTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGVOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBcIitDYXJkLkNBUkRfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdK1wiIHNob3VsZCB5b3VyIHBhcnRuZXIgaGF2ZSAob3B0aW9uczogJ1wiK3Bvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT1wb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmluZGV4T2YocGFydG5lclN1aXRlTmFtZSk7XG4gICAgICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgcGFydG5lcihwYXJ0bmVyKXt0aGlzLl9wYXJ0bmVyPSh0eXBlb2YgcGFydG5lcj09PSdudW1iZXInP3BhcnRuZXI6LTEpO30gLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBhbmQgYWRkIGl0IHRvIHRoZSBnaXZlbiB0cmlja1xuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBwbGF5QUNhcmQodHJpY2spe1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBhc2tlZCB0byBwbGF5IGEgY2FyZC5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCB1c2luZyB0aGUgZmlyc3QgbGV0dGVycyBvZiB0aGUgYWxwaGFiZXQ/XG4gICAgICAgIGxldCBwb3NzaWJsZUNhcmROYW1lcz1bXTtcbiAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MDtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKVxuICAgICAgICAgICAgcG9zc2libGVDYXJkTmFtZXMucHVzaChTdHJpbmcuY2FyZEluZGV4KzEpK1wiOiBcIit0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBsZXQgY2FyZFBsYXlJbmRleD0tMTtcbiAgICAgICAgd2hpbGUoY2FyZFBsYXlJbmRleDwwKXtcbiAgICAgICAgICAgIC8vIHdlJ3JlIHN1cHBvc2VkIHRvIHBsYXkgYSBjYXJkIHdpdGggc3VpdGUgZXF1YWwgdG8gdGhlIGZpcnN0IGNhcmQgdW5sZXNzIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgaXMgYmVpbmcgYXNrZWQgZm9yXG4gICAgICAgICAgICBsZXQgY2FyZElkPXBhcnNlSW50KHByb21wdChcIkBcIit0aGlzLm5hbWUrXCJcXG5QcmVzcyB0aGUgaWQgb2YgdGhlIGNhcmQgeW91IHdhbnQgdG8gYWRkIHRvIFwiK3RyaWNrLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChvcHRpb25zOiAnXCIrcG9zc2libGVDYXJkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixcIlwiKSk7XG4gICAgICAgICAgICBpZihpc05hTihjYXJkSWQpKWNvbnRpbnVlO1xuICAgICAgICAgICAgY2FyZFBsYXlJbmRleD1jYXJkSWQtMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDYXJkKHRoaXMuX2NhcmRzW2NhcmRQbGF5SW5kZXhdKTtcbiAgICB9XG5cbiAgICB0cmlja1dvbih0cmlja0luZGV4KXtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uLnB1c2godHJpY2tJbmRleCk7XG4gICAgICAgIHRoaXMubG9nKFwiVHJpY2sgI1wiK3RyaWNrSW5kZXgrXCIgd29uIGJ5ICdcIit0aGlzLm5hbWUrXCInOiBcIit0aGlzLl90cmlja3NXb24rXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlRyaWNrc1dvbigpe3JldHVybiB0aGlzLl90cmlja3NXb24ubGVuZ3RoO31cbiAgICBcbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyByZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiB0cmlja3Mgd29uIChpbmNsdWRpbmcgdGhvc2UgYnkgdGhlIHBhcnRuZXIgKGlmIGFueSkpXG4gICAgICAgIHJldHVybih0aGlzLm51bWJlck9mVHJpY2tzV29uK3RoaXMuX2dhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLnBhcnRuZXIpKTtcbiAgICB9XG5cbiAgICBzZXROdW1iZXJPZlRyaWNrc1RvV2luKG51bWJlck9mVHJpY2tzVG9XaW4pe3RoaXMuX251bWJlck9mVHJpY2tzVG9XaW49bnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzVG9XaW4oKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgXG4gICAgLy8gZXZlcnkgcGxheWVyIGNhbiBiZSBjaGVja2VkIHdoZXRoZXIgZnJpZW5kICgxKSBvciBmb28gKC0xKSBvciB1bmtub3duICgwKVxuICAgIGlzRnJpZW5kbHkocGxheWVyKXtcbiAgICAgICAgaWYocGxheWVyPT09dGhpcy5faW5kZXgpcmV0dXJuIDI7IC8vIEknbSBtdWNobyBmcmllbmRseSB0byBteXNlbGZcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApeyAvLyBhIG5vbi1zb2xpdGFyeSBnYW1lXG4gICAgICAgICAgICAvLyBBU1NFUlQgbm90IGEgc29saXRhcnkgZ2FtZSBzbyBwbGF5ZXIgY291bGQgYmUgdGhlIHBhcnRuZXIgaW4gY3JpbWVcbiAgICAgICAgICAgIC8vIGlmIHBhcnRuZXIgaXMga25vd24gKGkuZS4gdGhlIHBhcnRuZXIgY2FyZCBpcyBubyBsb25nZXIgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyPj0wKXJldHVybihwbGF5ZXI9PT10aGlzLl9wYXJ0bmVyPzE6LTEpOyBcbiAgICAgICAgICAgIC8vIEFTU0VSVCBwYXJ0bmVyIHVua25vd24gKGkuZS4gcGFydG5lciBjYXJkIHN0aWxsIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgbGV0IHRydW1wUGxheWVyPXRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKTtcbiAgICAgICAgICAgIC8vIGlmIEknbSB0aGUgdHJ1bXAgcGxheWVyLCBhc3N1bWUgQUxMIHVuZnJpZW5kbHkgQlVUIG5vIEkgZG9uJ3Qga25vdyB3aG8gbXkgcGFydG5lciBpcyBhbGwgY291bGQgYmVcbiAgICAgICAgICAgIGlmKHRoaXMuX2luZGV4PT09dHJ1bXBQbGF5ZXIpcmV0dXJuIDA7IC8vIHVua25vd25cbiAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSx0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCkpKSAvLyBJIGhhdmUgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PXRydW1wUGxheWVyPzE6LTEpOyAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZyaWVuZGx5LCB0aGUgb3RoZXJzIGFyZSB1bmZyaWVuZGx5XG4gICAgICAgICAgICAvLyBBU1NFUlQgSSdtIG5vdCB0aGUgdHJ1bXAgcGxheWVyLCBhbmQgSSdtIG5vdCB3aXRoIHRoZSB0cnVtcCBwbGF5ZXIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmb28sIHRoZSByZXN0IEkgZG9uJ3Qga25vdyB5ZXRcbiAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PT10cnVtcFBsYXllcj8tMTowKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgYSBzb2xpdGFyeSBnYW1lXG4gICAgICAgIC8vIGlmIEknbSBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnMsIGV2ZXJ5b25lIGVsc2UgaXMgYSBmb29cbiAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YodGhpcy5faW5kZXgpPj0wKXJldHVybiAtMTtcbiAgICAgICAgLy8gQVNTRVJUIG5vdCBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnNcbiAgICAgICAgLy8gICAgICAgIGlmIHBsYXllciBpcyBhIHNvbGl0YXJ5IHBsYXllciBpdCdzIGEgZm9vLCBvdGhlcndpc2UgaXQncyB1cyBhZ2FpbnN0IHRoZW0hISEhXG4gICAgICAgIHJldHVybih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZihwbGF5ZXIpPj0wPy0xOjEpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIHRoaXMubmFtZTt9XG5cbn1cblxuLy8gZXhwb3J0IHRoZSBQbGF5ZXIgY2xhc3Ncbm1vZHVsZS5leHBvcnRzPXtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfTsiLCJjb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpOyAvLyBmb3IgY29tcGFyaW5nIGNhcmRzXG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG5jbGFzcyBUcmljayBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICAvLyBNREhAMDdERUMyMDE5OiBnYW1lIGRhdGEgbW92ZWQgb3ZlciB0byBQbGF5ZXJHYW1lIGluc3RhbmNlIChhcyBwYXNzZWQgdG8gZWFjaCBwbGF5ZXIpXG4gICAgLy8gICAgICAgICAgICAgICAgY2FuQXNrRm9yUGFydG5lckNhcmQgYmxpbmQgbm93IGRldGVybWluZWQgYnkgdGhlIGdhbWUgKGVuZ2luZSkgaXRzZWxmXG5cbiAgICAvLyBieSBwYXNzaW5nIGluIHRoZSB0cnVtcCBwbGF5ZXIgKGkuZS4gdGhlIHBlcnNvbiB0aGF0IGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgY29uc3RydWN0b3IoZmlyc3RQbGF5ZXIsdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssY2FuQXNrRm9yUGFydG5lckNhcmQsZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKXsgLy8gcmVwbGFjaW5nOiB0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayx0cnVtcFBsYXllcil7XG4gICAgICAgIHN1cGVyKCk7IC8vIHVzaW5nIDQgZml4ZWQgcG9zaXRpb25zIGZvciB0aGUgdHJpY2sgY2FyZHMgc28gd2Ugd2lsbCBrbm93IHdobyBwbGF5ZWQgdGhlbSEhISFcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXI9Zmlyc3RQbGF5ZXI7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTsgLy8gZm9yIGludGVybmFsIHVzZSB0byBiZSBhYmxlIHRvIGRldGVybWluZSB0aGUgd2lubmVyIG9mIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLl9wYXJ0bmVyUmFuaz1wYXJ0bmVyUmFuazsgLy8gbmVlZCB0aGlzIHdoZW4gaXQncyBiZWluZyBhc2tlZCB0byBkZXRlcm1pbmUgdGhlIHdpbm5lclxuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD1jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDsgLy8gLTEgYmxpbmQsIDAgbm90LCAxIG5vbi1ibGluZFxuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB0aGUgJ2ZsYWcnIHNldCBieSB0aGUgdHJ1bXAgcGxheWVyIHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPS0xOyAvLyB0aGUgc3VpdGUgb2YgdGhlIHRyaWNrIChtb3N0IG9mIHRoZSB0aW1lIHRoZSBzdWl0ZSBvZiB0aGUgZmlyc3QgY2FyZClcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD0tMTsgLy8gdGhlIGNhcmQgb2YgdGhlIHdpbm5lciAobm90ZTogTk9UIHRyYW5zZm9ybWVkIHRvIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IHlldClcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzPWZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcztcbiAgICAgICAgLy8gbGV0J3Mga2VlcCB0cmFjayBvZiB0aGUgaGlnaGVzdCBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBjYW4gYXNrIGZvciBwYXJ0bmVyIGNhcmQ6IFwiK2NhbkFza0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGZpcnN0IHBsYXllciBjYW4gcGxheSBzcGFkZXM6IFwiK2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcytcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIGdldCBmaXJzdFBsYXllckNhblBsYXlTcGFkZXMoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO31cbiAgICBcbiAgICAvLyB0aGUgd2lubmVyIGV4cG9zZWQgaXMgdGhlIGFjdHVhbCBwbGF5ZXIgd2hvIHdvblxuICAgIGdldCB3aW5uZXIoKXtyZXR1cm4odGhpcy5fd2lubmVyQ2FyZDwwPy0xOih0aGlzLl93aW5uZXJDYXJkK3RoaXMuX2ZpcnN0UGxheWVyKSU0KTt9XG4gICAgXG4gICAgLy8gTURIQDA3REVDMjAxOTogbW92ZWQgZnJvbSBoZXJlIHRvIHRoZSBnYW1lIChhcyBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gICAgLypcbiAgICBnZXQgdHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fSAvLyBleHBvc2VzIHRoZSBjdXJyZW50IHRydW1wIHBsYXllclxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgICovXG4gICAgZ2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkO31cblxuICAgIC8vIHBhc3MgaW4gLTEgd2hlbiBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZCwgb3IgKzEgd2hlbiBhc2tpbmcgZm9yIGl0IChub24tYmxpbmQpXG4gICAgc2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodHlwZW9mIGFza2luZ0ZvclBhcnRuZXJDYXJkIT09XCJudW1iZXJcIil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBOT1QgZGVmaW5lZCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMubnVtYmVyT2ZDYXJkcz4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3BnZXZlbiBkZSBwYXJ0bmVyIGFhcy9oZWVyIChibGluZCkgdGUgdnJhZ2VuIG5pZXQgbWVlciB0b2VnZXN0YWFuLlwiKTtcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgc2V0IHRvIFwiK3RoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICBfc2V0V2lubmVyQ2FyZCh3aW5uZXJDYXJkKXtcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD13aW5uZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIHdpbm5lciBjYXJkOiBcIit3aW5uZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBjYXJkIHBsYXllZCBieSAodGhlIGFjdHVhbCkgcGxheWVyIChhcyB1c2VkIGZvciBzaG93aW5nIHRoZSB0cmljayBjYXJkcylcbiAgICAgKiBAcGFyYW0geyp9IHBsYXllciBcbiAgICAgKi9cbiAgICBnZXRQbGF5ZXJDYXJkKHBsYXllcil7XG4gICAgICAgIGxldCBwbGF5ZXJDYXJkPSh0aGlzLl9maXJzdFBsYXllcj49MD8ocGxheWVyKzQtdGhpcy5fZmlyc3RQbGF5ZXIpJTQ6bnVsbCk7XG4gICAgICAgIHJldHVybihwbGF5ZXJDYXJkPj0wJiZwbGF5ZXJDYXJkPHRoaXMubnVtYmVyT2ZDYXJkcz90aGlzLl9jYXJkc1twbGF5ZXJDYXJkXTpudWxsKTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSB0aGUgZmlyc3QgcGxheWVyIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICBpZighdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgKGFueW1vcmUpLlwiKTtcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPXRoaXMuX3RydW1wU3VpdGU7IC8vIHRoZSBwbGF5IHN1aXRlIGJlY29tZXMgdGhlIHRydW1wIHN1aXRlXG4gICAgfVxuICAgICovXG4gICAgLy8gTk9URSBhZGRDYXJkIGlzIE5PVCBfYWRkQ2FyZCBvZiB0aGUgc3VwZXJjbGFzcyEgdGhpcyBpcyBiZWNhdXNlIHdlIHNob3VsZCBzZXQgdGhlIGhvbGRlciBvbiB0aGUgY2FyZCB0byBhZGQhISEhXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICAgLy8gaWYgdGhlIGZsYWcgb2YgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIGlzIHNldCwgcHJlc2V0IHRoZSBcbiAgICAgICAgY2FyZC5ob2xkZXI9dGhpczsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGlzIHRyaWNrIGJ5IHNldHRpbmcgdGhlIGhvbGRlciBwcm9wZXJ0eSAod2lsbCB0YWtlIGNhcmUgb2YgYWRkaW5nL3JlbW92aW5nIHRoZSBjYXJkKVxuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM8PW51bWJlck9mQ2FyZHNOb3cpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWRkIHRoZSBjYXJkIHRvIHRoZSB0cmljay5cIik7XG4gICAgICAgIC8vIEFTU0VSVCBjYXJkIGFkZGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5fdHJ1bXBTdWl0ZTwwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQlVHOiBBc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQsIGJ1dCBwbGF5aW5nIGEgZ2FtZSB3aXRob3V0IHRydW1wLlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yIGJsaW5kIGV2ZXJ5b25lIGhhcyB0byBwbGF5IHRoZSBwYXJ0bmVyIGNhcmQgc3VpdGVcbiAgICAgICAgLy8gTURIQDA5REVDMjAxOTogT09QUyBJIHdhcyBhbHJlYWR5IHVzaW5nIHRoaXMuX3BhcnRuZXJTdWl0ZSBoZXJlIEJVVCBzdGlsbCBhZnRlciBhY3R1YWxseSB0YWtpbmcgaXQgb3V0IChub3cgaW4gYWdhaW4pXG4gICAgICAgIGlmKHRoaXMuX3BsYXlTdWl0ZTwwKXsgLy8gZmlyc3QgY2FyZCBiZWluZyBwbGF5ZWRcbiAgICAgICAgICAgIC8vIE1ESEAxOEpBTjIwMjA6IGFzY2VydGFpbiB0aGF0IF9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCBoYXMgdGhlIHJpZ2h0IHZhbHVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBjb3VsZCBiZSAwIGJ1dCB3aGVuIHRoZSBwYXJ0bmVyIHN1aXRlIGlzIHBsYXllZCB0aGUgcGxheWVyIElTIGFza2luZ1xuICAgICAgICAgICAgaWYodGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQhPT0wKXsgLy8gcGxheWVyIHN1cHBvc2VkbHkgY2FuIHN0aWxsIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPD0wJiZjYXJkLnN1aXRlPT09dGhpcy5fcGFydG5lclN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MCl0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IENhbm5vdCBhc2sgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiSW1wbGljaXRseSBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYnkgcGxheWluZyB0aGUgcGFydG5lciBzdWl0ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPT0wKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIHdoZW4geW91IGNhbid0IGFzayBmb3IgaXQgYW55bW9yZSFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wbGF5U3VpdGU9KHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDA/dGhpcy5fcGFydG5lclN1aXRlOmNhcmQuc3VpdGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFTU0VSVCB0aGlzLl9wbGF5U3VpdGUgbm93IGRlZmluaXRlbHkgbm9uLW5lZ2F0aXZlLCBzb1xuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB1c2UgdGhlIHJpZ2h0IHByb3BlcnR5IGJybydcbiAgICAgICAgLy8gdXBkYXRlIHdpbm5lclxuICAgICAgICBpZihudW1iZXJPZkNhcmRzTm93PjApe1xuICAgICAgICAgICAgLy8gTURIQDA5REVDMjAxOTogd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgb25seSB0aGUgcGFydG5lciBjYXJkIGNhbiBldmVyIHdpbiAoZXZlbiBpZiB0aGVyZSdzIHRydW1wISEpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBidXQgd2UgbmVlZCB0byBrbm93IHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCB3YXMgYWxyZWFkeSB0aHJvd25cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIFNPTFVUSU9OOiAoTkVBVCkgaXQncyBlYXNpZXN0IHRvIHNpbXBseSBpZ25vcmUgdHJ1bXAgaXMgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IhISEhISFcbiAgICAgICAgICAgIGlmKENhcmQuY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQsdGhpcy5fY2FyZHNbdGhpcy5fd2lubmVyQ2FyZF0sdGhpcy5fcGxheVN1aXRlLCh0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MD8tMTp0aGlzLl90cnVtcFN1aXRlKSk+MClcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKG51bWJlck9mQ2FyZHNOb3cpO1xuICAgICAgICB9ZWxzZSAvLyBhZnRlciB0aGUgZmlyc3QgY2FyZCB0aGUgZmlyc3QgcGxheWVyIGlzIHRoZSB3aW5uZXIgb2YgY291cnNlXG4gICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKDApO1xuICAgIH1cbiAgICBnZXRDYXJkUGxheWVyKHN1aXRlLHJhbmspe1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLl9jYXJkcy5sZW5ndGg7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlPT09c3VpdGUmJnRoaXMuX2NhcmRzW2NhcmRJbmRleF0ucmFuaz09PXJhbmspXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9maXJzdFBsYXllcitjYXJkSW5kZXgpJTQ7IC8vIFRPRE8gY2FuIHdlIGFzc3VtZSA0IHBsYXllcnMgaW4gdG90YWw/Pz8/P1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGdldHRlcnNcbiAgICBnZXQgcGxheVN1aXRlKCl7cmV0dXJuIHRoaXMuX3BsYXlTdWl0ZTt9XG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIC8qXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgKi9cbiAgICBnZXQgY2FuQXNrRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ7fVxufVxuXG5tb2R1bGUuZXhwb3J0cz1UcmljaztcbiIsIi8qKlxuICogdGhlIHBhcnQgdGhhdCBydW5zIGluIHRoZSBicm93c2VyIG9mIGEgc2luZ2xlIHBsYXllclxuICogZ2l2ZW4gdGhhdCBhbnkgaW5mb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgcGxheWVyIG9mIHRoZSBnYW1lIHNob3VsZCBiZSBhdmFpbGFibGUgdGhyb3VnaCBpdCdzIF9nYW1lIHByb3BlcnR5IChpLmUuIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAqIGFsbCBjYWxscyBpbiBtYWluLmpzIHRvIHJpa2tlblRoZUdhbWUgZGlyZWN0bHkgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggY2FsbHMgdG8gY3VycmVudFBsYXllci5nYW1lIGkuZS4gcmlra2VuVGhlR2FtZSBpdHNlbGYgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSB0byB0aGUgY3VycmVudFBsYXllciEhIVxuICogXG4qKi9cbi8vIHdlJ2xsIGJlIHVzaW5nIFBsYXllci5qcyBvbmx5IChQbGF5ZXIuanMgd2lsbCBkZWFsIHdpdGggcmVxdWlyaW5nIENhcmRIb2xkZXIsIGFuZCBDYXJkSG9sZGVyIENhcmQpXG4vLyBOTyBJIG5lZWQgdG8gcmVxdWlyZSB0aGVtIGFsbCBvdGhlcndpc2UgYnJvd3NlcmlmeSB3b24ndCBiZSBhYmxlIHRvIGZpbmQgQ2FyZCwgZXRjLlxuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5jb25zdCBUcmljaz1yZXF1aXJlKCcuL1RyaWNrLmpzJyk7IC8vIG5vdyBpbiBzZXBhcmF0ZSBmaWxlXG5jb25zdCB7UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn09cmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcblxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKXtyZXR1cm4oc3RyPyhzdHIubGVuZ3RoP3N0clswXS50b1VwcGVyQ2FzZSgpK3N0ci5zbGljZSgxKTpcIlwiKTpcIj9cIik7fVxuXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpbmcgZW50ZXJpbmcgdGhlIGlkIG9mIHRoZSB1c2VyIG9uIHBhZ2Utc2V0dGluZ3MsIHNvIHdlIGRvIG5vdCBuZWVkIHRvIGluc2VydCBhIG5ldyBvbmVcbi8vICAgICAgICAgICAgICAgIGFsdGVybmF0aXZlbHkgd2UgY2FuIGRvIHRoYXQgb24gYSBzZXBhcmF0ZSBwYWdlIC8gcGFnZS1hdXRoIGlzIE9LXG4vLyAgICAgICAgICAgICAgICB3ZSBnbyB0byBwYWdlLWF1dGggd2hlbiBOT1QgcGxheWluZyB0aGUgZ2FtZSBpbiBkZW1vIG1vZGUhISFcbi8vICAgICAgICAgICAgICAgIGluIG5vbi1kZW1vIG1vZGUgeW91IGlkZW50aWZ5IHlvdXJzZWxmLCB0aGVuIHdoZW4gc2V0UGxheWVyTmFtZSBpcyBzdWNjZXNzZnVsIGdvIHRvIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuLy8gTURIQDEwSkFOMjAyMDogcmVtb3ZpbmcgcGFnZS1zZXR0aW5ncyBhbmQgcGFnZS1zZXR1cC1nYW1lLCBhZGRpbmcgcGFnZS1oZWxwXG5jb25zdCBQQUdFUz1bXCJwYWdlLXJ1bGVzXCIsXCJwYWdlLWhlbHBcIixcInBhZ2UtYXV0aFwiLFwicGFnZS13YWl0LWZvci1wbGF5ZXJzXCIsXCJwYWdlLWJpZGRpbmdcIixcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIixcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiLFwicGFnZS1wbGF5LXJlcG9ydGluZ1wiLFwicGFnZS1wbGF5aW5nXCIsXCJwYWdlLWZpbmlzaGVkXCJdO1xuXG52YXIgY3VycmVudFBhZ2U9bnVsbDsgLy8gbGV0J3MgYXNzdW1lIHRvIGJlIHN0YXJ0aW5nIGF0IHBhZ2UtcnVsZXNcbnZhciB2aXNpdGVkUGFnZXM9W107IC8vIG5vIHBhZ2VzIHZpc2l0ZWQgeWV0XG5cbnZhciBjdXJyZW50UGxheWVyPW51bGw7IC8vIHRoZSBjdXJyZW50IGdhbWUgcGxheWVyXG5cbi8vIE1ESEAxMEpBTjIwMjA6IG5ld0dhbWUoKSBpcyBhIGJpZCBkaWZmZXJlbnQgdGhhbiBpbiB0aGUgZGVtbyB2ZXJzaW9uIGluIHRoYXQgd2UgcmV0dXJuIHRvIHRoZSB3YWl0aW5nLXBhZ2VcbmZ1bmN0aW9uIG5ld0dhbWUoKXtcbiAgICAvLyBieSBjYWxsIHBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCw/KSB3ZSBmb3JjZSBjbGVhcmluZyB0aGUgZ2FtZSBpbmZvcm1hdGlvbiBiZWluZyBzaG93biBhdCB0aGUgd2FpdC1mb3ItcGxheWVycyBwYWdlXG4gICAgKCFjdXJyZW50UGxheWVyfHxjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSkpO1xufVxuZnVuY3Rpb24gc3RvcFBsYXlpbmcoKXtcbiAgICAvLyBBU1NFUlQgYXNzdW1pbmcgbm90IHBsYXlpbmcgaW4gYSBnYW1lIGFueW1vcmUgaS5lLiBuZXdHYW1lKCkgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZVxuICAgIGlmKGN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIuZ2FtZSlcbiAgICAgICAgYWxlcnQoXCJTdG9wIGVlcnN0IG1ldCBzcGVsZW4hXCIpO1xuICAgIGVsc2UgLy8gZm9yY2UgZ29pbmcgYmFjayB0byB0aGUgcHJldmlvdXMgcGFnZSBpbiB0aGUgaGlzdG9yeSAod2hlcmUgd2UgY2FtZSBmcm9tIG9yaWdpbmFsbHkpXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbn1cblxudmFyIGZvcmNlRm9jdXNJZD1udWxsO1xuZnVuY3Rpb24gc3RvcEZvcmNlRm9jdXMoKXtjbGVhckludGVydmFsKGZvcmNlRm9jdXNJZCk7Zm9yY2VGb2N1c0lkPW51bGw7fVxuZnVuY3Rpb24gY2hlY2tGb2N1cyhzdGF0ZSl7XG4gICAgLy8gTURIQDIzSkFOMjAyMDogd2Ugc2hvdWxkIGtlZXAgYmxpbmtpbmcgd2hlbiBub3QgaW4gZm9jdXMgdW50aWwgZm9yY2VkIHRvIHN0b3BcbiAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHN0b3BwaW5nIHdoZW4gdGhlIGZvY3VzIHdhcyBnb3RcbiAgICBpZihkb2N1bWVudC5oYXNGb2N1cygpKXNob3dHYW1lU3RhdGUoc3RhdGUpO2Vsc2UgdG9nZ2xlR2FtZVN0YXRlKHN0YXRlKTtcbiAgICAvLyByZXBsYWNpbmc6IGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpe3Nob3dHYW1lU3RhdGUoc3RhdGUpO3N0b3BGb3JjZUZvY3VzKCk7fWVsc2UgdG9nZ2xlR2FtZVN0YXRlKHN0YXRlKTtcbn1cbmZ1bmN0aW9uIGZvcmNlRm9jdXMoc3RhdGUpe1xuICAgIHNob3dHYW1lU3RhdGUoc3RhdGUpOyAvLyBlaXRoZXIgdG8gc2hvdyBzdGF0ZSBvciByZW1vdmUgd2hhdCdzIGN1cnJlbnRseSBzaG93blxuICAgIGlmKHN0YXRlKXsgLy8gZm9jdXMgcmVxdWVzdGVkXG4gICAgICAgIC8vIHN0YXJ0IGdldHRpbmcgdGhlIGZvY3VzIGJ5IGJsaW5raW5nICdzdGF0ZScgSUZGIHdlIGhhdmVuJ3QgZ290IGl0IHlldC4uLlxuICAgICAgICBpZighZm9yY2VGb2N1c0lkKWZvcmNlRm9jdXNJZD1zZXRJbnRlcnZhbCgoKT0+e2NoZWNrRm9jdXMoc3RhdGUpO30sNTAwKTtcbiAgICB9ZWxzZXsgLy8gZW5kIG9mIGZvY3VzIHJlcXVlc3RcbiAgICAgICAgaWYoZm9yY2VGb2N1c0lkKXN0b3BGb3JjZUZvY3VzKCk7XG4gICAgfVxufVxuXG4vLyBvZiBjb3Vyc2U6IGZyb20gc3RhY2tvdmVyZmxvdyEhIVxuZnVuY3Rpb24gZGlmZmVyZW5jZShhMSxhMil7dmFyIGEyU2V0PW5ldyBTZXQoYTIpO3JldHVybiBhMS5maWx0ZXIoKHgpPT4hYTJTZXQuaGFzKHgpKTt9XG5cbnZhciBiaWRkZXJDYXJkc0VsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItY2FyZHNcIik7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCl7XG4gICAgbGV0IGJ1dHRvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJCaWRkZXIgc3VpdGVjYXJkcyBidXR0b24gY2xpY2tlZCFcIik7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpOyAvLyBhIGhhLCBkaWRuJ3Qga25vdyB0aGlzXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT0odGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtYmlkLWJ1dHRvblwiKT9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgIH0pO1xufVxuXG4vLyBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuLy8gICAgIHZhciB2ID0gZG9jdW1lbnQuY29va2llLm1hdGNoKCcoXnw7KSA/JyArIG5hbWUgKyAnPShbXjtdKikoO3wkKScpO1xuLy8gICAgIHJldHVybiB2ID8gdlsyXSA6IG51bGw7XG4vLyB9XG4vLyBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbi8vICAgICB2YXIgZCA9IG5ldyBEYXRlO1xuLy8gICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDAqZGF5cyk7XG4vLyAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtwYXRoPS87ZXhwaXJlcz1cIiArIGQudG9HTVRTdHJpbmcoKTtcbi8vIH1cbi8vIGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShuYW1lKSB7IHNldENvb2tpZShuYW1lLCAnJywgLTEpOyB9XG5cbi8qKlxuICogc2hvd3MgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWVzIGF0IHRoZSBzdGFydCBvZiB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgaGVhZGVyIHJvdyBvZiB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZVxuICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyaWNrcy1wbGF5ZWQtdGFibGVcIikpe1xuICAgICAgICBsZXQgdHJpY2tzUGxheWVkVGFibGVIZWFkZXI9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRoZWFkXCIpO1xuICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlSGVhZGVyLmNoaWxkcmVuWzBdOyAvLyB0aGUgcm93IHdlJ3JlIGludGVyZXN0ZWQgaW4gZmlsbGluZ1xuICAgICAgICBmb3IocGxheWVyPTA7cGxheWVyPDQ7cGxheWVyKyspe1xuICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuW3BsYXllcisxXTsgLy8gdXNlIHBsYXllciB0byBnZXQgdGhlICdyZWFsJyBwbGF5ZXIgY29sdW1uISFcbiAgICAgICAgICAgIGxldCBwbGF5ZXJOYW1lPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXIpOlwiP1wiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSByZXBsYWNlZCBieSBjdXJyZW50UGxheWVyLmdhbWVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmFtZSBvZiBwbGF5ZXIgI1wiKyhwbGF5ZXIrMSkrXCI6ICdcIitwbGF5ZXJOYW1lK1wiJy5cIik7XG4gICAgICAgICAgICBjZWxsLmlubmVySFRNTD1wbGF5ZXJOYW1lO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgY2FyZHMgcGxheWVkIHRhYmxlIGFzIHdlbGxcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMSklNCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Bwb3NpdGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsyKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMyklNCkpO1xuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgYmlkcyB0YWJsZVxuICAgIHNob3dQbGF5ZXJOYW1lc0luQmlkc1RhYmxlKCk7XG59XG5cbi8vIHdoZW5ldmVyIHRoZSBwbGF5ZXIgY2hhbmdlcywgc2hvdyB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIHNob3dDdXJyZW50UGxheWVyTmFtZSgpe1xuICAgIC8vIHNob3dHYW1lU3RhdGUoY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6bnVsbCk7IC8vIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgaW1tZWRpYXRlbHkgaW4gdGhlIHRpdGxlXG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWVcIikpXG4gICAgICAgIGlmKHBsYXllck5hbWVFbGVtZW50KVxuICAgICAgICAgICAgcGxheWVyTmFtZUVsZW1lbnQuaW5uZXJIVE1MPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIj9cIik7XG59XG5cbi8qKlxuICogdXBkYXRlcyB0aGUgd2FpdGluZy1mb3ItcGxheWVycyBwYWdlXG4gKiBkZXBlbmRpbmcgb24gd2hldGhlciBvciBub3QgYSBnYW1lIGlzIGJlaW5nIHBsYXllZCAoeWV0KSwgd2Ugc2hvdyB0aGUgZ2FtZSBpZCBhbmQgdGhlIHBsYXllciBuYW1lc1xuICovXG5mdW5jdGlvbiB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW5hbWVcIikuaW5uZXJIVE1MPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUubmFtZTpcIlwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lcygpOm51bGwpO1xuICAgIGZvcihsZXQgcGxheWVyTmFtZVNwYW4gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbWUtcGxheWVyLW5hbWVcIikpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9cGxheWVyTmFtZVNwYW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaW5kZXhcIik7XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmlubmVySFRNTD1wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmNvbG9yPShwbGF5ZXJJbmRleD09cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg/XCJCTFVFXCI6XCJCTEFDS1wiKTtcbiAgICB9XG59XG5cbi8qKlxuICogY2xlYXJzIHRoZSBiaWQgdGFibGVcbiAqIHRvIGJlIGNhbGxlZCB3aXRoIGV2ZXJ5IG5ldyBnYW1lXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQmlkVGFibGUoKXtcbiAgICBsZXQgYmlkVGFibGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKTtcbiAgICBmb3IobGV0IGJpZFRhYmxlUm93IG9mIGJpZFRhYmxlLmNoaWxkcmVuKVxuICAgICAgICBmb3IobGV0IGJpZFRhYmxlQ29sdW1uIG9mIGJpZFRhYmxlUm93LmNoaWxkcmVuKVxuICAgICAgICAgICAgYmlkVGFibGVDb2x1bW4uaW5uZXJIVE1MPVwiXCI7XG59XG5cbmZ1bmN0aW9uIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxzdWl0ZSl7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50bHkgYXNzaWduZWQgc3VpdGVcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIsU3RyaW5nKHN1aXRlKSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKV0pO1xufVxuXG5mdW5jdGlvbiBzaG93Q2FyZChlbGVtZW50LGNhcmQsdHJ1bXBTdWl0ZSx3aW5uZXJTaWduKXtcbiAgICBpZighZWxlbWVudCl7Y29uc29sZS5lcnJvcihcIk5vIGVsZW1lbnQhXCIpO3JldHVybjt9XG4gICAgaWYoY2FyZCl7XG4gICAgICAgIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxjYXJkLnN1aXRlKTsgLy8gd2Ugd2FudCB0byBzZWUgdGhlIHJpZ2h0IGNvbG9yXG4gICAgICAgIGxldCBlbGVtZW50SXNUcnVtcD1lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInRydW1wXCIpO1xuICAgICAgICBsZXQgZWxlbWVudFNob3VsZEJlVHJ1bXA9KGNhcmQuc3VpdGU9PT10cnVtcFN1aXRlKTtcbiAgICAgICAgaWYoZWxlbWVudElzVHJ1bXAhPT1lbGVtZW50U2hvdWxkQmVUcnVtcCllbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJ0cnVtcFwiKTtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgaWYod2lubmVyU2lnbiE9MCllbGVtZW50LmlubmVySFRNTCs9XCIqXCI7XG4gICAgICAgIC8qIHJlcGxhY2luZzogXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgdGhlIGNhcmQgb2YgdGhlIHdpbm5lciBzbyBmYXIgaXQgY2FuIGJlIGVpdGhlciArIG9yIC1cbiAgICAgICAgaWYod2lubmVyU2lnbj4wKWVsZW1lbnQuaW5uZXJIVE1MKz0nKyc7ZWxzZSBpZih3aW5uZXJTaWduPDApZWxlbWVudC5pbm5lckhUTUwrPSctJztcbiAgICAgICAgKi9cbiAgICB9ZWxzZVxuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1cIlwiO1xufVxuXG4vLyBNREhAMjNKQU4yMDIwOiB3aGVuIHNob3dpbmcgdGhlIHBsYXllciBuYW1lIHdlIHNldCB0aGUgY29sb3IgdG8gYmxhY2sgKGp1c3QgaW4gY2FzZSBpdCdzIG5vdCBibGFjayBhbnltb3JlKVxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWUoZWxlbWVudCxuYW1lKXtcbiAgICBlbGVtZW50LmlubmVySFRNTD0obmFtZT9uYW1lOlwiP1wiKTtcbiAgICBlbGVtZW50LnN0eWxlLmNvbG9yPVwiYmxhY2tcIjtcbn1cbmZ1bmN0aW9uIHNob3dQbGF5ZXJUeXBlKGVsZW1lbnQscGxheWVyVHlwZSl7XG4gICAgc3dpdGNoKHBsYXllclR5cGUpe1xuICAgICAgICBjYXNlIC0xOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJyZWRcIjticmVhaztcbiAgICAgICAgY2FzZSAwOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJvcmFuZ2VcIjticmVhaztcbiAgICAgICAgY2FzZSAxOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJncmVlblwiO2JyZWFrO1xuICAgICAgICBkZWZhdWx0OmVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO2JyZWFrO1xuICAgIH1cbn1cblxuLy8gTURIQDIwSkFOMjAyMDoga2VlcCB0aGUgaWRzIG9mIHRoZSB0cmljayBwbGF5ZWQgY2FyZHMgaW4gYSBjb25zdGFudCBhcnJheVxuY29uc3QgUExBWUVEX0NBUkRfSURTPVtcImN1cnJlbnQtcGxheWVyLWNhcmRcIixcImxlZnRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiLFwib3Bwb3NpdGUtcGxheWVyLWNhcmRcIixcInJpZ2h0aGFuZHNpZGUtcGxheWVyLWNhcmRcIl07XG5cbi8vIHRvIGJlIGNhbGxlZCBvbiByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudFxuZnVuY3Rpb24gY2xlYXJDYXJkc1BsYXllZFRhYmxlKCl7XG4gICAgZm9yKGxldCBwbGF5ZWRDYXJkSW5kZXggaW4gUExBWUVEX0NBUkRfSURTKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChQTEFZRURfQ0FSRF9JRFNbcGxheWVkQ2FyZEluZGV4XSkuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8qKlxuICogc2hvd3MgdGhlIGdpdmVuIHRyaWNrXG4gKiBAcGFyYW0geyp9IHRyaWNrIFxuICovXG5mdW5jdGlvbiBzaG93VHJpY2sodHJpY2svKixwbGF5ZXJJbmRleCovKXtcbiAgICBcbiAgICBsZXQgcmlra2VuVGhlR2FtZT1jdXJyZW50UGxheWVyLmdhbWU7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0cmljayBcIix0cmljayk7XG4gICAgXG4gICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4O1xuXG4gICAgLy8gaWYgdGhpcyBpcyB0aGUgdHJ1bXAgcGxheWVyIHRoYXQgaXMgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCAoZWl0aGVyIG5vbi1ibGluZCBvciBibGluZCkgZmxhZyB0aGUgY2hlY2tib3hcbiAgICBpZih0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWNoZWNrYm94JykuY2hlY2tlZD10cnVlO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1ibGluZCcpLmlubmVySFRNTD0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MD9cImJsaW5kIFwiOlwiXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgfWVsc2VcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG5cbiAgICAvLyBhc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBpbmZvXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2tpbmctZm9yLXBhcnRuZXItY2FyZC1pbmZvXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkIT09MD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgIC8vbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWNhcmRzLXRhYmxlXCIpLnJlcXVlc3RTZWxlY3RvcihcInRib2R5XCIpO1xuXG4gICAgLy8gdGhlIHBsYXllciB0eXBlIGNhbiBjaGFuZ2UgZXZlcnkgY2FyZCBiZWluZyBwbGF5ZWQgKGJhc2VkIG9uIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllcilcbiAgICAvLyBUT0RPIHNob3VsZG4ndCBuZWVkIHRvIGRvIHRoZSBmb2xsb3dpbmc6XG4gICAgLy8gc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCksLTIpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMSklNCkpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Bwb3NpdGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsyKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMyklNCkpO1xuICAgIFxuICAgIC8vIE5PVEUgdGhlIGZpcnN0IGNhcmQgY291bGQgYmUgdGhlIGJsaW5kIGNhcmQgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIG5vdCBzaG93IGl0ISFcbiAgICAvLyAgICAgIGJ1dCBvbmx5IHRoZSBjb2xvciBvZiB0aGUgcGFydG5lciBzdWl0ZVxuICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPSh0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLl9jYXJkc1swXS5zdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgLy8gTURIQDIwSkFOMjAyMDogc2hvdyBhbGwgdGhlIHRyaWNrIGNhcmRzIHBsYXllZCBhdCB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICBmb3IobGV0IHRyaWNrQ2FyZEluZGV4PTA7dHJpY2tDYXJkSW5kZXg8NDt0cmlja0NhcmRJbmRleCsrKXtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZD0odHJpY2tDYXJkSW5kZXg8dHJpY2subnVtYmVyT2ZDYXJkcz90cmljay5fY2FyZHNbdHJpY2tDYXJkSW5kZXhdOm51bGwpO1xuICAgICAgICBsZXQgdHJpY2tDYXJkUGxheWVySW5kZXg9dHJpY2suZmlyc3RQbGF5ZXIrdHJpY2tDYXJkSW5kZXg7IC8vIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IGluIHRoZSBnYW1lXG4gICAgICAgIGxldCB0cmlja0NhcmRQb3NpdGlvbj0odHJpY2tDYXJkUGxheWVySW5kZXgrNC1wbGF5ZXJJbmRleCklNDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayBjYXJkIHBvc2l0aW9uOiBcIit0cmlja0NhcmRQb3NpdGlvbitcIi5cIik7XG4gICAgICAgIGxldCB0cmlja0NhcmRJZD1QTEFZRURfQ0FSRF9JRFNbdHJpY2tDYXJkUG9zaXRpb25dO1xuICAgICAgICBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kKXtcbiAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9ZmFsc2U7IC8vIGRvIG5vdCBkbyB0aGlzIGZvciB0aGUgbmV4dCBwbGF5ZXJzXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCkuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2sucGxheVN1aXRlKTsgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0cmljayBjYXJkICNcIit0cmlja0NhcmRJbmRleCx0cmlja0NhcmQpO1xuICAgICAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLHRyaWNrQ2FyZCx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PSh0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsdHJpY2tDYXJkUGxheWVySW5kZXglNCk/MTotMSk6MCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qIHJlcGxhY2luZzpcbiAgICBsZXQgcGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PShhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPyg0K3RyaWNrLmZpcnN0UGxheWVyLXBsYXllckluZGV4KSU0OjApO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09MSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzEpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsxKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMSklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Mil7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzIpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsyKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMiklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Myl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzMpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCszKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMyklNCk/MTotMSk6MCkpO1xuICAgICovXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN1aXRlQ2FyZFJvd3Mocm93cyxzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciBzdWl0ZSBjYXJkIHJvd3M6IFwiK3Jvd3MubGVuZ3RoK1wiLlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiByb3dzOiBcIixyb3dzLmxlbmd0aCk7XG4gICAgbGV0IHN1aXRlPTA7XG4gICAgZm9yKGxldCByb3cgb2Ygcm93cyl7XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY2VsbHM9cm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkPTA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBjZWxsIG9mIGNlbGxzKXtcbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9c3VpdGVDb2xvcjsgIFxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgc3VpdGVDYXJkKys7XG4gICAgICAgIH1cbiAgICAgICAgc3VpdGUrKztcbiAgICB9XG59XG4vLyBpbiB0aHJlZSBkaWZmZXJlbnQgcGFnZXMgdGhlIHBsYXllciBjYXJkcyBzaG91bGQgYmUgc2hvd24uLi5cbmZ1bmN0aW9uIHVwZGF0ZUJpZGRlclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSAoY3VycmVudCBwbGF5ZXIpIGNhcmRzIGZvciBiaWRkaW5nLlwiKTtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuXG4vKipcbiAqIGZvciBwbGF5aW5nIHRoZSBjYXJkcyBhcmUgc2hvd24gaW4gYnV0dG9ucyBpbnNpZGUgdGFibGUgY2VsbHNcbiAqIEBwYXJhbSB7Kn0gc3VpdGVDYXJkcyBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlUGxheWVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgdG8gY2hvb3NlIGZyb20uXCIpO1xuICAgIGxldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItc3VpdGVjYXJkcy10YWJsZVwiKTtcbiAgICBjb25zb2xlLmxvZyhcIlN1aXRlIGNhcmRzOiBcIixzdWl0ZUNhcmRzKTtcbiAgICBsZXQgcm93cz10YWJsZWJvZHkucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIk51bWJlciBvZiByb3dzOiBcIixyb3dzLmxlbmd0aCk7XG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPHJvd3MubGVuZ3RoO3N1aXRlKyspe1xuICAgICAgICBsZXQgcm93PXJvd3Nbc3VpdGVdO1xuICAgICAgICAvLy8vLy8vLy9sZXQgc3VpdGVDb2xvcj1TVUlURV9DT0xPUlNbc3VpdGUlMl07XG4gICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgbGV0IGNvbHVtbnM9cm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIGZvcihsZXQgc3VpdGVDYXJkPTA7c3VpdGVDYXJkPGNvbHVtbnMubGVuZ3RoO3N1aXRlQ2FyZCsrKXtcbiAgICAgICAgICAgIGxldCBjZWxsYnV0dG9uPWNvbHVtbnNbc3VpdGVDYXJkXS8qLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWJ1dHRvbl1cIikqLztcbiAgICAgICAgICAgIGlmKCFjZWxsYnV0dG9uKXtjb25zb2xlLmxvZyhcIk5vIGNlbGwgYnV0dG9uIVwiKTtjb250aW51ZTt9XG4gICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgaWYoY2FyZEluU3VpdGUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbY2FyZEluU3VpdGUuc3VpdGVdKTsgLy8gcmVwbGFjaW5nOiBjZWxsYnV0dG9uLnN0eWxlLmNvbG9yPXN1aXRlQ29sb3I7XG4gICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwiaW5saW5lXCI7XG4gICAgICAgICAgICB9ZWxzZSAvLyBoaWRlIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHBsYXllciBjYXJkcyB0byBjaG9vc2UgZnJvbSBzaG93biFcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IHBsYXllckluZGV4PTA7XG4gICAgbGV0IGRlbHRhUG9pbnRzPXJpa2tlblRoZUdhbWUuZGVsdGFQb2ludHM7XG4gICAgbGV0IHBvaW50cz1yaWtrZW5UaGVHYW1lLnBvaW50cztcbiAgICBmb3IobGV0IHBsYXllclJlc3VsdHNSb3cgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmVzdWx0cy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSl7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMV0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcocmlra2VuVGhlR2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllckluZGV4KSk6XCItXCIpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzJdLmlubmVySFRNTD0oZGVsdGFQb2ludHM/U3RyaW5nKGRlbHRhUG9pbnRzW3BsYXllckluZGV4XSk6XCItXCIpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzNdLmlubmVySFRNTD1TdHJpbmcocG9pbnRzW3BsYXllckluZGV4XSk7XG4gICAgICAgIHBsYXllckluZGV4Kys7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhclRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyaWNrcy1wbGF5ZWQtdGFibGVcIikpe1xuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlQ2VsbCBvZiB0cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpKXtcbiAgICAgICAgICAgIHRyaWNrc1BsYXllZFRhYmxlQ2VsbC5pbm5lckhUTUw9XCJcIjt0cmlja3NQbGF5ZWRUYWJsZUNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yPSd0cmFuc3BhcmVudCc7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIGxldCBsYXN0VHJpY2tQbGF5ZWRJbmRleD1yaWtrZW5UaGVHYW1lLm51bWJlck9mVHJpY2tzUGxheWVkLTE7IC8vIGdldHRlciBjaGFuZ2VkIHRvIGdldE1ldGhvZCBjYWxsXG4gICAgaWYobGFzdFRyaWNrUGxheWVkSW5kZXg+PTApe1xuICAgICAgICBsZXQgdHJpY2s9cmlra2VuVGhlR2FtZS5fdHJpY2s7IC8vIE1ESEAyMEpBTjIwMjAgcmVwbGFjaW5nOiBnZXRUcmlja0F0SW5kZXgobGFzdFRyaWNrUGxheWVkSW5kZXgpO1xuICAgICAgICBpZih0cmljaylcbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKHBsYXllck5hbWVJbnB1dEVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYoIXBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWV8fHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWUubGVuZ3RoPT0wKVxuICAgICAgICAgICAgcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZT1wbGF5ZXJOYW1lc1twYXJzZUludChwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIpKV07XG4gICAgfVxufVxuXG4vLyBwbGF5aW5nIGZyb20gd2l0aGluIHRoZSBnYW1lXG5mdW5jdGlvbiBzaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGxldCBzaW5nbGVQbGF5ZXJOYW1lPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLW5hbWUnKS52YWx1ZS50cmltKCk7XG4gICAgaWYoc2luZ2xlUGxheWVyTmFtZS5sZW5ndGg+MClcbiAgICAgICAgc2V0UGxheWVyTmFtZShzaW5nbGVQbGF5ZXJOYW1lLChlcnIpPT57XG4gICAgICAgICAgICAvLyBNREhAMTBKQU4yMDIwOiBfc2V0UGxheWVyIHRha2VzIGNhcmUgb2Ygc3dpdGNoaW5nIHRvIHRoZSByaWdodCBpbml0aWFsIHBhZ2UhISFcbiAgICAgICAgICAgIGlmKGVycilzZXRJbmZvKGVycik7Ly8gZWxzZSBuZXh0UGFnZSgpO1xuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIGFsZXJ0KFwiR2VlZiBlZXJzdCBlZW4gKGdlbGRpZ2UpIG5hYW0gb3AhXCIpO1xufVxuXG4vKipcbiAqIHByZXBhcmVzIHRoZSBHVUkgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gZ2V0R2FtZUluZm8oKXtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVybWluaW5nIGdhbWUgaW5mby5cIik7XG4gICAgbGV0IGdhbWVJbmZvPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOyAvLyBubyBwbGF5ZXIsIG5vIGdhbWVcbiAgICBpZihyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgLy8gZ2V0IHRoZSBpbmZvIHdlIG5lZWQgdGhyb3VnaCB0aGUgUGxheWVyR2FtZSBpbnN0YW5jZSByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkZGVycz1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCk7IC8vIHRob3NlIGJpZGRpbmdcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZGRlcnM6IFwiK2hpZ2hlc3RCaWRkZXJzLmpvaW4oXCIsIFwiKStcIi5cIik7XG4gICAgICAgIGxldCBoaWdoZXN0QmlkPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIik7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0VHJ1bXBTdWl0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdFRydW1wIHN1aXRlOiBcIit0cnVtcFN1aXRlK1wiLlwiKTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBsZXQgcGFydG5lclJhbms9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAvLyBwbGF5aW5nIHdpdGggdHJ1bXAgaXMgZWFzaWVzdFxuICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXsgLy8gb25seSBhIHNpbmdsZSBoaWdoZXN0IGJpZGRlciEhIVxuICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcj1oaWdoZXN0QmlkZGVyc1swXTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyb2VsYVBsYXllck5hbWU9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPXRyb2VsYVBsYXllck5hbWUrXCIgaGVlZnQgdHJvZWxhLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHJpa2tlblRoZUdhbWUuZm91cnRoQWNlUGxheWVyKStcIiBpcyBtZWUuXCI7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9SSUt8fGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUil7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKStcIiByaWt0IGluIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCIsIGVuIHZyYWFndCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIG1lZS5cIjsgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgLy8gd2l0aG91dCBhIHBhcnRuZXJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHNwZWVsdCBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1t0cnVtcFN1aXRlXStcIiBtZXQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgYWxzIHRyb2VmLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXsgLy8gdGhlcmUncyBubyB0cnVtcCwgZXZlcnlvbmUgaXMgcGxheWluZyBmb3IgaGltL2hlcnNlbGZcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXM9W107XG4gICAgICAgICAgICBoaWdoZXN0QmlkZGVycy5mb3JFYWNoKChoaWdoZXN0QmlkZGVyKT0+e2hpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5wdXNoKHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKSk7fSk7XG4gICAgICAgICAgICBpZihoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPWhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5qb2luKFwiLCBcIikrKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MT9cIiBzcGVsZW4gXCI6XCIgc3BlZWx0IFwiKStQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIjtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgZ2FtZUluZm89XCJJZWRlcmVlbiBoZWVmdCBnZXBhc3QuIFdlIHNwZWxlbiBvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWchXCI7XG4gICAgICAgIH1cbiAgIH1cbiAgIHJldHVybiBnYW1lSW5mbztcbn1cblxuLy8gaG93IHRvIHBocmFzZSBhIGJpZCBkZXBlbmRzIG9uIHRoZSBiaWQsIGFuZCB3aG8gcGxheXMgaXRcbmZ1bmN0aW9uIGdldEJpZEluZm8oYmlkLGJpZGRlcil7XG4gICAgbGV0IGJldHRlcj0oYmlkPT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ORUdFTl9BTExFRU5fQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSfHxcbiAgICAgICAgYmlkPT09UGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVIpO1xuICAgIGlmKGJldHRlciliaWQtLTtcbiAgICBzd2l0Y2goYmlkKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QQVM6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBnZXBhc3QuXCI6XCJKZSBoZWJ0IGdlcGFzdC5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUklLOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgaGVlZnQgXCI6XCJKZSBoZWJ0IFwiKSsoYmV0dGVyP1wiYmV0ZXIgXCI6XCJcIikrXCIgZ2VyaWt0LlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgZWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU46XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWwgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHR3YWFsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBkZXJ0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUElDTzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBzbGVjaHRzIGVlbiBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX01JU0VSRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4gbWV0IG9wZW4ga2FhcnRlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgZWVuIHByYWF0amUgZW4gb3BlbiBrYWFydGVuLlwiO1xuICAgIH1cbiAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdFwiOlwiSmUgaGVidFwiKStcIiBlZW4gb25nZWxkaWcgYm9kIGdlZGFhbi5cIjtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQobnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSxoaWdoZXN0QmlkKXtcbiAgICBzd2l0Y2gobnVtYmVyT2ZUcmlja3NUb1dpbil7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBcIkdlZW5lZW5cIjtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIFwiUHJlY2llcyBlZW5cIjtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFwiWmVzIHNhbWVuIG1ldCBcIisocGFydG5lck5hbWU/cGFydG5lck5hbWU6XCJqZSBwYXJ0bmVyXCIpK1wiIG9tIGRlIHRlZ2Vuc3BlbGVycyBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgbGF0ZW4gdmVybGllemVuXCI7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBcIkFjaHQgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgXCIrKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQT9cInRyb2VsYVwiOlwicmlrXCIpK1wiIHRlIHdpbm5lblwiO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gXCJOZWdlbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiBcIlRpZW4gYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICByZXR1cm4gXCJFbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICByZXR1cm4gXCJUd2FhbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gXCJBbGxlbWFhbFwiO1xuICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXQgbWl0cyBuaWV0IGRlIGxhYXRzdGUgc2xhZyBvZiBlZW4gc2xhZyBtZXQgZGUgc2Nob3BwZW4gdnJvdXdcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXRcIjtcbn1cblxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgcGxheWVySW5kZXg9MDtwbGF5ZXJJbmRleDxyaWtrZW5UaGVHYW1lLm51bWJlck9mUGxheWVycztwbGF5ZXJJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpOyAvLyB3cml0ZSB0aGUgbmFtZSBvZiB0aGUgcGxheWVyXG4gICAgfVxufVxuLy8gTURIQDIxTk9WMjAyMDogdGhlIGdhbWUgd291bGQgY2FsbCB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgYSBiaWQgbWFkZSBpcyByZWNlaXZlZCEhIVxuZnVuY3Rpb24gdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgIGZvcihsZXQgcGxheWVyQmlkc0luZGV4PTA7cGxheWVyQmlkc0luZGV4PHBsYXllckJpZHNPYmplY3RzLmxlbmd0aDtwbGF5ZXJCaWRzSW5kZXgrKyl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXBsYXllckJpZHNPYmplY3RzW3BsYXllckJpZHNJbmRleF07XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLmdldFBsYXllckluZGV4KHBsYXllckJpZHNPYmplY3QubmFtZSk7XG4gICAgICAgIC8vIG9uIHRoZSBzYWZlIHNpZGUsIGdldCB0aGUgcGxheWVyIGluZGV4IGZyb20gdGhlIGdhbWUgcGFzc2luZyBpbiAgcGxheWVyIG5hbWVcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7YWxlcnQoXCJQbGF5ZXIgXCIrcGxheWVyQmlkc09iamVjdC5uYW1lK1wiIHVua25vd24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICAvLyBNREhAMjNKQU4yMDIwIHNob3dpbmcgdGhlIHBsYXllciBuYW1lcyBvbmNlOiBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgLy8gd3JpdGUgdGhlIGJpZHMgKHdlIGhhdmUgdG8gY2xlYXIgdGhlIHRhYmxlIHdpdGggZXZlcnkgbmV3IGdhbWUgdGhvdWdoKVxuICAgICAgICBwbGF5ZXJCaWRzT2JqZWN0LmJpZHMuZm9yRWFjaCgocGxheWVyQmlkLGJpZEluZGV4KT0+e3BsYXllckJpZHNSb3cuY2hpbGRyZW5bYmlkSW5kZXgrMV0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBiaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJdLmNoaWxkcmVuWzFdLmlubmVySFRNTD1wbGF5ZXJzQmlkc1tiaWRdLmpvaW4oXCIgXCIpO1xuICAgIH1cbn1cblxuY2xhc3MgT25saW5lUGxheWVyIGV4dGVuZHMgUGxheWVye1xuXG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gYXNrIHRoZSBnYW1lXG4gICAgICAgIHJldHVybih0aGlzLmluZGV4JiZ0aGlzLmdhbWU/dGhpcy5nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5pbmRleCk6MCk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGEgKHJlbW90ZSkgY2xpZW50IG5lZWRzIHRvIG92ZXJyaWRlIGFsbCBpdHMgYWN0aW9uc1xuICAgIC8vIEJVVCB3ZSBkbyBub3QgZG8gdGhhdCBiZWNhdXNlIGFsbCByZXN1bHRzIGdvIGludG8gUGxheWVyR2FtZVByb3h5IHdoaWNoIHdpbGwgc2VuZCB0aGUgYWxvbmchISEhXG5cbiAgICAvLyBtYWtlIGEgYmlkIGlzIGNhbGxlZCB3aXRoIFxuICAgIG1ha2VBQmlkKHBsYXllckJpZHNPYmplY3RzLHBvc3NpYmxlQmlkcyl7XG4gICAgICAgIC8vIGRlYnVnZ2VyXG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgLy8gcmVtb3ZlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBzZXRJbmZvKFwiRG9lIGVlbiBib2QuXCIpO1xuICAgICAgICBpZihjdXJyZW50UGFnZSE9XCJwYWdlLWJpZGRpbmdcIilzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpOyAvLyBKSVQgdG8gdGhlIHJpZ2h0IHBhZ2VcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBiaWRzIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBjb3VsZCBtYWtlOiBcIixwb3NzaWJsZUJpZHMpO1xuXG4gICAgICAgIC8vc2V0SW5mbyhcIk1hYWsgZWVuIGtldXplIHVpdCBlZW4gdmFuIGRlIG1vZ2VsaWprZSBiaWVkaW5nZW4uXCIpO1xuICAgICAgICAvLyBpdCdzIGFsd2F5cyB5b3UhISEhIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLmlubmVySFRNTD1cIlRvb24ga2FhcnRlblwiO1xuICAgICAgICBiaWRkZXJDYXJkc0VsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS52YWx1ZT10aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbihcIjxicj5cIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIGJpZGRlciBjYXJkcyBpbW1lZGlhdGVseVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgICAgICBpZigvKnBsYXltb2RlPT1QTEFZTU9ERV9ERU1PKi8wXmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpO1xuICAgICAgICAvKiBNREhAMTFKQU4yMDIwOiBtb3ZlZCBvdmVyIHRvIHdoZW4gdGhlIHBsYXllciBjYXJkcyBhcmUgcmVjZWl2ZWQhISFcbiAgICAgICAgLy8gTk9URSBiZWNhdXNlIGV2ZXJ5IHBsYXllciBnZXRzIGEgdHVybiB0byBiaWQsIHRoaXMuX3N1aXRlQ2FyZHMgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiB3ZSBhc2sgZm9yIHRydW1wL3BhcnRuZXIhISFcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7XG4gICAgICAgICovXG4gICAgICAgIC8vIG9ubHkgc2hvdyB0aGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKVxuICAgICAgICAgICAgYmlkQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHBvc3NpYmxlQmlkcy5pbmRleE9mKHBhcnNlSW50KGJpZEJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmlkJykpKT49MD9cImluaXRpYWxcIjpcIm5vbmVcIik7XG4gICAgICAgIC8vIHNob3cgdGhlIHBsYXllciBiaWRzIGluIHRoZSBib2R5IG9mIHRoZSBiaWRzIHRhYmxlXG4gICAgICAgIHVwZGF0ZUJpZHNUYWJsZShwbGF5ZXJCaWRzT2JqZWN0cyk7XG4gICAgfVxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHRydW1wIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS10cnVtcC1jaG9vc2luZ1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSB0cnVtcCBzdWl0ZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICB9XG4gICAgY2hvb3NlUGFydG5lclN1aXRlKHN1aXRlcyxwYXJ0bmVyUmFuayl7IC8vIHBhcnRuZXJSYW5rTmFtZSBjaGFuZ2VkIHRvIHBhcnRuZXJSYW5rIChiZWNhdXNlIExhbmd1YWdlIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBVSSBsZXZlbCBvbmx5ISlcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHBhcnRuZXIgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBiZWNhdXNlIHRoZSBzdWl0ZXMgaW4gdGhlIGJ1dHRvbiBhcnJheSBhcmUgMCwgMSwgMiwgMyBhbmQgc3VpdGVzIHdpbGwgY29udGFpblxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGFydG5lciByYW5rIChhY2Ugb3Iga2luZykgYmVpbmcgYXNrZWRcbiAgICAgICAgZm9yKGxldCByYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgIHJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXTtcbiAgICB9XG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSByZXBsYWNlZCB2ZXJzaW9uIGV4Y2VwdCB3ZSBub3cgd2FudCB0byByZWNlaXZlIHRoZSB0cmljayBpdHNlbGZcbiAgICBwbGF5QUNhcmQoKXtcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzO1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHRyaWNrPSh0aGlzLmdhbWU/dGhpcy5nYW1lLl90cmljazpudWxsKTtcbiAgICAgICAgaWYoIXRyaWNrKXthbGVydChcIkJVRzogTm8gY3VycmVudCB0cmljayB0byBwbGF5IGEgY2FyZCBpbiFcIik7cmV0dXJuO31cbiAgICAgICAgLy8gTURIQDE5SkFOMjAyMDogYWxsb3cgdGhlIGN1cnJlbnQgcGxheWVyIHRvIHBsYXkgYSBjYXJkIGJ5IGNsaWNraW5nIG9uZVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpO1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLnBsYXlTdWl0ZTwwKXthbGVydChcIkJVRzogUGxheSBzdWl0ZSBvZiBub24tZW1wdHkgdHJpY2sgdW5kZWZpbmVkIVwiKTtyZXR1cm47fVxuICAgICAgICBzZXRJbmZvKFwiU3BlZWwgZWVuIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiLlwiKTtcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG5ldyB0cmljayB1cGRhdGUgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGUgd2l0aCB0aGUgcHJldmlvdXMgdHJpY2tcbiAgICAgICAgLy8gaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgLyogc2VlIHNob3dUcmljaygpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FuLWFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQ/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLmNoZWNrZWQ9ZmFsc2U7IC8vIHdoZW4gY2xpY2tlZCBzaG91bGQgZ2VuZXJhdGUgXG4gICAgICAgICovXG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjAgbW92ZWQgb3ZlciB0byB3aGVyZSBHQU1FX0lORk8gZXZlbnQgaXMgcmVjZWl2ZWQhISEhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgLy8gb2Jzb2xldGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZC1wbGF5ZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cbiAgICAgICAgICAgICh0cmljay5wbGF5U3VpdGU+PTA/XCJTcGVlbCBlZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpK1wiIGJpai5cIjpcIktvbSBtYWFyIHVpdCFcIik7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbj10aGlzLmdldE51bWJlck9mVHJpY2tzV29uKCk7IC8vIGFsc28gaW5jbHVkZXMgdGhvc2Ugd29uIGJ5IHRoZSBwYXJ0bmVyIChhdXRvbWF0aWNhbGx5KVxuICAgICAgICAvLyBhZGQgdGhlIHRyaWNrcyB3b24gYnkgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAvLyBpZihwYXJ0bmVyKW51bWJlck9mVHJpY2tzV29uKz1wbGF5ZXIuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3Mtd29uLXNvLWZhclwiKS5pbm5lckhUTUw9U3RyaW5nKG51bWJlck9mVHJpY2tzV29uKSsocGFydG5lck5hbWU/XCIgKHNhbWVuIG1ldCBcIitwYXJ0bmVyTmFtZStcIilcIjpcIlwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3MtdG8td2luXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dCh0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZCgpKTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsOyAvLyBnZXQgcmlkIG9mIGFueSBjdXJyZW50bHkgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgIC8vIHNldEluZm8oXCJXZWxrZSBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIiB3aWwgamUgXCIrKHRyaWNrLm51bWJlck9mQ2FyZHM+MD9cImJpalwiOlwiXCIpK1wic3BlbGVuP1wiKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7IC8vIHJlbWVtYmVyIHRoZSBzdWl0ZSBjYXJkcyEhISFcbiAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIC8vLy8vIHNob3dUcmljayh0aGlzLl90cmljaz10cmljayk7IC8vIE1ESEAxMUpBTjIwMjA6IG5vIG5lZWQgdG8gcGFzcyB0aGUgcGxheWVyIGluZGV4IChhcyBpdCBpcyBhbHdheXMgdGhlIHNhbWUpXG4gICAgfVxuXG4gICAgLy8gbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggX2NhcmRQbGF5ZWQoKSBkZWZpbmVkIGluIHRoZSBiYXNlIGNsYXNzIFBsYXllciB3aGljaCBpbmZvcm1zIHRoZSBnYW1lXG4gICAgLy8gTk9URSBjYXJkUGxheWVkIGlzIGEgZ29vZCBwb2ludCBmb3IgY2hlY2tpbmcgdGhlIHZhbGlkaXR5IG9mIHRoZSBjYXJkIHBsYXllZFxuICAgIC8vIE5PVEUgY2FuJ3QgdXNlIF9jYXJkUGxheWVkIChzZWUgUGxheWVyIHN1cGVyY2xhc3MpXG4gICAgLy8gTURIQDIwSkFOMjAyMDogZGVjaWRpbmcgdG8gcmV0dXJuIHRydWUgb24gYWNjZXB0YW5jZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7XG4gICAgICAgIGxldCBjYXJkPShzdWl0ZTx0aGlzLl9zdWl0ZUNhcmRzLmxlbmd0aCYmdGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV0ubGVuZ3RoP3RoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdW2luZGV4XTpudWxsKTtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGxldCB0cmljaz10aGlzLmdhbWUuX3RyaWNrOyAvLyBNREhAMTlKQU4yMDIwOiBlYXNpZXN0IHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdHJpY2tcbiAgICAgICAgICAgIGlmKCF0cmljayl7XG4gICAgICAgICAgICAgICAgZGVidWdnZXJcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPT0wKXsgLy8gZmlyc3QgY2FyZCBpbiB0aGUgdHJpY2sgcGxheWVkXG4gICAgICAgICAgICAgICAgLy8gdGhlb3JldGljYWxseSB0aGUgY2FyZCBjYW4gYmUgcGxheWVkIGJ1dCBpdCBtaWdodCBiZSB0aGUgY2FyZCB3aXRoIHdoaWNoIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQhIVxuICAgICAgICAgICAgICAgIC8vIGlzIHRoaXMgYSBnYW1lIHdoZXJlIHRoZXJlJ3MgYSBwYXJ0bmVyIGNhcmQgdGhhdCBoYXNuJ3QgYmVlbiBwbGF5ZWQgeWV0XG4gICAgICAgICAgICAgICAgLy8gYWx0ZXJuYXRpdmVseSBwdXQ6IHNob3VsZCB0aGVyZSBiZSBhIHBhcnRuZXIgYW5kIHRoZXJlIGlzbid0IG9uZSB5ZXQ/Pz8/P1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKT09dGhpcy5faW5kZXgpeyAvLyB0aGlzIGlzIHRydW1wIHBsYXllciBwbGF5aW5nIHRoZSBmaXJzdCBjYXJkXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj4+Pj4gQ0hFQ0tJTkcgV0hFVEhFUiBBU0tJTkcgRk9SIFRIRSBQQVJUTkVSIENBUkQgPDw8PFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIHRoZSB0cnVtcCBwbGF5ZXIgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIHRydW1wIHBsYXllciBkb2VzIG5vdCBoYXZlIFxuICAgICAgICAgICAgICAgICAgICBpZih0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD4wKXsgLy8gbm9uLWJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHNob3VsZCBiZSBkZXRlY3RlZCBieSB0aGUgZ2FtZSBwcmVmZXJhYmx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWl0ZT09dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vYWxlcnQoXCJcXHROT05fQkxJTkRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDApeyAvLyBjb3VsZCBiZSBibGluZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGNoZWNrYm94IGlzIHN0aWxsIHNldCBpLmUuIHRoZSB1c2VyIGRpZG4ndCB1bmNoZWNrIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoZSB3aWxsIGJlIGFza2luZyBmb3IgdGhlIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMCBCVUcgRklYOiB3YXMgdXNpbmcgYXNrLXBhcnRuZXItY2FyZC1ibGluZCBpbnN0ZWFkIG9mIGFzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3ghISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveFwiKS5jaGVja2VkJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3VpdGUhPXRoaXMuX2dhbWUuZ2V0VHJ1bXBTdWl0ZSgpfHxjb25maXJtKFwiV2lsdCBVIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCldK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpXStcIiAoYmxpbmQpIHZyYWdlbiBtZXQgZWVuIHRyb2VmP1wiKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPS0xOyAvLyB5ZXMsIGFza2luZyBibGluZCEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy9hbGVydChcIlxcdEJMSU5EIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qYWxlcnQoXCJOb3QgaW5kaWNhdGVkISEhIVwiKSovO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIG9yIG5vdCB0aGUgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlc1xuICAgICAgICAgICAgICAgICAgICBpZighdHJpY2suX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyYmc3VpdGU9PT1DYXJkLlNVSVRFX1NQQURFKXsgLy8gc3BhZGUgaXMgYmVpbmcgcGxheWVkIGJ5IHRoZSBmaXJzdCBwbGF5ZXIgd2hlcmVhcyB0aGF0IGlzIG5vdCBhbGxvd2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoQ2FyZC5TVUlURV9TUEFERSk8dGhpcy5udW1iZXJPZkNhcmRzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXsgLy8gbm90IHRoZSBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2FyZCBuZWVkcyB0byBiZSB0aGUgc2FtZSBzdWl0ZSBhcyB0aGUgcGxheSBzdWl0ZSAoaWYgdGhlIHBsYXllciBoYXMgYW55KVxuICAgICAgICAgICAgICAgIGlmKHN1aXRlIT09dHJpY2sucGxheVN1aXRlJiZ0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUodHJpY2sucGxheVN1aXRlKT4wKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPXBhcnRuZXJTdWl0ZXx8Y2FyZC5yYW5rIT1wYXJ0bmVyUmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbcGFydG5lclN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMDogd2UgaGF2ZSB0byBhbHNvIHJldHVybiB3aGF0ZXZlciB0cmljayB2YWx1ZSB0aGF0IG1pZ2h0J3ZlIGNoYW5nZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdoaWNoIGluIHRoaXMgY2FzZSBjb3VsZCB3ZWwgYmUgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkICdmbGFnJ1xuICAgICAgICAgICAgdGhpcy5fc2V0Q2FyZChjYXJkLHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGNhcmQgc3VpdGUgXCIrU3RyaW5nKHN1aXRlKStcIiBhbmQgc3VpdGUgaW5kZXggXCIrU3RyaW5nKGluZGV4KStcIi5cIik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgc3VwZXIucGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KTtcbiAgICAgICAgLy8gVE9ETyBzaG91bGQgd2UgZG8gdGhpcyBoZXJlPz9cbiAgICAgICAgaWYodGhpcy5nYW1lKXNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7ZWxzZSBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTtcbiAgICB9XG4gICAgLy8gY2FsbCByZW5kZXJDYXJkcyBqdXN0IGFmdGVyIHRoZSBzZXQgb2YgY2FyZHMgY2hhbmdlXG4gICAgcmVuZGVyQ2FyZHMoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKiBSZW5kZXJpbmcgcGxheWVyIGNhcmRzIVwiKTtcbiAgICAgICAgdGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCk7XG4gICAgICAgIC8vIFRPRE8gcHJvYmFibHkgYmVzdCB0byBzaG93IHRoZW0gb24gQUxMIHBhZ2VzIChubyBtYXR0ZXIgd2hpY2ggb25lIGlzIGN1cnJlbnRseSBzaG93aW5nISlcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBzd2l0Y2goY3VycmVudFBhZ2Upe1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYmlkZGluZ1wiOnVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBvbmx5IG9uY2VcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBsYXlpbmdcIjp1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgYWZ0ZXIgcGxheWluZyBhIGNhcmQhIVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICB9XG4gICAgLy8gZXhpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gYSBwbGF5ZXIgbGVhdmVzIGEgZ2FtZSBmb3Igc29tZSByZWFzb24gKHR5cGljYWxseSBieSBjbG9zaW5nIHRoZSB0YWIpXG4gICAgZXhpdCgpeyghdGhpcy5fZ2FtZXx8dGhpcy5fZ2FtZS5leGl0KHRoaXMubmFtZStcIiBsZWF2aW5nLi4uXCIpKTt9XG59XG5cbi8vIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyc1xuLyoqXG4gKiBjbGlja2luZyBhIGJpZCBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gYmlkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gYmlkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgbGV0IGJpZD1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtYmlkXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIkJpZCBjaG9zZW46IFwiLGJpZCk7XG4gICAgY3VycmVudFBsYXllci5fc2V0QmlkKGJpZCk7IC8vIHRoZSB2YWx1ZSBvZiB0aGUgYnV0dG9uIGlzIHRoZSBtYWRlIGJpZFxufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIit0cnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK3BhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIC8vIGdvIGRpcmVjdGx5IHRvIHRoZSBnYW1lIChpbnN0ZWFkIG9mIHRocm91Z2ggdGhlIHBsYXllcilcbiAgICBjdXJyZW50UGxheWVyLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbn1cblxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBsZXQgcGxheWFibGVjYXJkQ2VsbD1ldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGxldCBjYXJkU3VpdGU9cGFyc2VJbnQocGxheWFibGVjYXJkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKTtcbiAgICBsZXQgY2FyZFJhbms9cGFyc2VJbnQocGxheWFibGVjYXJkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWluZGV4XCIpKTtcbiAgICAvLy8vLy8vL2lmKHBsYXlhYmxlY2FyZENlbGwuc3R5bGUuYm9yZGVyPVwiMHB4XCIpcmV0dXJuOyAvLyBlbXB0eSAndW5jbGlja2FibGUnIGNlbGxcbiAgICBpZihjdXJyZW50UGxheWVyLl9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoY2FyZFN1aXRlLGNhcmRSYW5rKSl7IC8vIGNhcmQgYWNjZXB0ZWQhISFcbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZm9jdXMgcmVxdWVzdFxuICAgICAgICBwbGF5YWJsZWNhcmRDZWxsLmlubmVySFRNTD1cIlwiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiXCI7IC8vIE1ESEAyM0pBTjIwMjA6IGdldCByaWQgb2YgdGhlIHBsYXkgY2FyZCBwcm9tcHQhXG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlbmllbnQgdG8gYmUgYWJsZSB0byB0dXJuIHRoZSBwbGF5YWJsZSBjYXJkIGJ1dHRvbnMgb24gYW5kIG9mZiBhdCB0aGUgcmlnaHQgbW9tZW50XG4gKiBAcGFyYW0ge2VuYWJsZX0gZW5hYmxlIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGVuYWJsZSl7XG4gICAgLy8gY2xpY2tpbmcgY2FyZCAnYnV0dG9ucycgKG5vdyBjZWxscyBpbiB0YWJsZSksIHdlIGNhbiBnZXQgcmlkIG9mIHRoZSBidXR0b24gaXRzZWxmISEhXG4gICAgZm9yKGxldCBwbGF5YWJsZWNhcmRCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5YWJsZS5jYXJkLXRleHRcIikpXG4gICAgICAgIHBsYXlhYmxlY2FyZEJ1dHRvbi5vbmNsaWNrPShlbmFibGU/cGxheWFibGVjYXJkQnV0dG9uQ2xpY2tlZDpudWxsKTtcbn1cblxuLy8gaW4gb3JkZXIgdG8gbm90IGhhdmUgdG8gdXNlIFJpa2tlblRoZUdhbWUgaXRzZWxmICh0aGF0IGNvbnRyb2xzIHBsYXlpbmcgdGhlIGdhbWUgaXRzZWxmKVxuLy8gYW5kIHdoaWNoIGRlZmluZXMgUmlra2VuVGhlR2FtZUV2ZW50TGlzdGVuZXIgd2UgY2FuIHNpbXBseSBkZWZpbmUgc3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKVxuLy8gYW5kIGFsd2F5cyBjYWxsIGl0IGZyb20gdGhlIGdhbWUgXG5mdW5jdGlvbiBfZ2FtZVN0YXRlQ2hhbmdlZChmcm9tc3RhdGUsdG9zdGF0ZSl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gVG9lc3RhbmQgdmVyYW5kZXJ0IHZhbiBcIitmcm9tc3RhdGUrXCIgbmFhciBcIit0b3N0YXRlK1wiLlwiKTtcbiAgICBzd2l0Y2godG9zdGF0ZSl7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5JRExFOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkVlbiBzcGVsIGlzIGFhbmdlbWFha3QuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5ERUFMSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkRlIGthYXJ0ZW4gd29yZGVuIGdlc2NodWQgZW4gZ2VkZWVsZC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRERJTkc6XG4gICAgICAgICAgICAvLyB3aGVuIG1vdmluZyBmcm9tIHRoZSBERUFMSU5HIHN0YXRlIHRvIHRoZSBCSURESU5HIHN0YXRlIGNsZWFyIHRoZSBiaWQgdGFibGVcbiAgICAgICAgICAgIC8vIEFMVEVSTkFUSVZFTFkgdGhpcyBjb3VsZCBiZSBkb25lIHdoZW4gdGhlIGdhbWUgZW5kc1xuICAgICAgICAgICAgLy8gQlVUIHRoaXMgaXMgYSBiaXQgc2FmZXIhISFcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgYmllZGVuIGlzIGJlZ29ubmVuIVwiKTtcbiAgICAgICAgICAgIGlmKGZyb21zdGF0ZT09PVBsYXllckdhbWUuREVBTElORyljbGVhckJpZFRhYmxlKCk7XG4gICAgICAgICAgICAvLy8vLy8gbGV0J3Mgd2FpdCB1bnRpbCBhIGJpZCBpcyByZXF1ZXN0ZWQhISEhIFxuICAgICAgICAgICAgLy8gTURIQDA5SkFOMjAyMDogTk8sIHdlIHdhbnQgdG8gaW5kaWNhdGUgdGhhdCB0aGUgYmlkZGluZyBpcyBnb2luZyBvblxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuUExBWUlORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgc3BlbGVuIGthbiBiZWdpbm5lbiFcIik7XG4gICAgICAgICAgICAvLyB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpOyAvLyBhbGxvd2luZyB0aGUgdXNlciB0byBjbFxuICAgICAgICAgICAgLyogTURIQDE5SkFOMjAyMDogaW4gZHVlIGNvdXJzZSB3ZSB3aWxsIGJlIHJlbW92aW5nIHRoZSBmb2xsb3dpbmcgdHdvIGxpbmVzXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4hXCIpO1xuICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpzZXRJbmZvKFwiRGUgcmVnZWxzIHZhbiBoZXQgb25saW5lIHNwZWwuXCIpO2JyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dGluZ3NcIjpzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTticmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHVwLWdhbWVcIjogLy8gd2hlbiBwbGF5aW5nIGluIGRlbW8gbW9kZSwgdGhlIHVzZXIgc2hvdWxkIGVudGVyIGZvdXIgcGxheWVyIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJWdWwgZGUgbmFtZW4gdmFuIGRlIHNwZWxlcnMgaW4uIEVlbiBzcGVsZXJuYWFtIGlzIHZvbGRvZW5kZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImF1dGhcIjogLy8gcGFnZS1hdXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2VlZiBkZSBuYWFtIG9wIHdhYXJvbmRlciBVIHdpbHQgc3BlbGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FpdC1mb3ItcGxheWVyc1wiOiAvLyBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJFdmVuIGdlZHVsZCBhdWIuIFdlIHdhY2h0ZW4gdG90IGVyIGdlbm9lZyBtZWRlc3BlbGVycyB6aWpuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmlkZGluZ1wiOiAvLyBwYWdlLWJpZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvbSBkZSBiZXVydCBvcCBlZW4gdmVyem9layB0b3QgaGV0IGRvZW4gdmFuIGVlbiBib2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5LXJlcG9ydGluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5aW5nXCI6IC8vID8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvIGV2ZXJ5dGhpbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgc3RhcnRpbmcgdGhlIGdhbWUgcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIDFcIjsgLy8ganVzdCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8ganVzdCBpbiBjYXNlISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4gYmVnaW50IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiQlVHOiBVbmtub3duIHBhZ2UgJ1wiK19wYWdlK1wiJyByZXF1ZXN0ZWQhXCIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbmV4dFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBuZXh0IHBhZ2UhXCIpO1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgLy8gTURIQDA3SkFOMjAyMDogaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBuZXh0IHBhZ2UsIHdoZW4gbm90IHJ1bm5pbmcgaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBwYWdlLWF1dGggcGFnZVxuICAgIC8vICAgICAgICAgICAgICAgIGluIGRlbW8gbW9kZSBza2lwIHRoZSBhdXRoIGFuZCB3YWl0IGZvciBwbGF5ZXJzIGJ1dHRvblxuICAgIHN3aXRjaChwYWdlSW5kZXgpe1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1hdXRoXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogLy8gc2hvdWxkIHdlIGNoZWNrIHRoZSB1c2VyIG5hbWVzPz8/Pz8/XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrMSklUEFHRVMubGVuZ3RoXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBjYW5jZWxQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgcHJldmlvdXMgcGFnZS5cIik7XG4gICAgLy8gZ28gb25lIHBhZ2UgYmFja1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4K1BBR0VTLmxlbmd0aC0xKSVQQUdFUy5sZW5ndGhdKTtcbn1cbmZ1bmN0aW9uIHJldHVyblRvUHJldmlvdXNQYWdlKCl7XG4gICAgLy8gcG9wIG9mZiB0aGUgcGFnZSB3ZSBhcmUgZ29pbmcgdG8gdmlzaXQsIHByZXZlbnRpbmcgdG8gcHVzaCB0aGUgY3VycmVudFBhZ2UgYWdhaW5cbiAgICBpZih2aXNpdGVkUGFnZXMubGVuZ3RoPjApe2N1cnJlbnRQYWdlPW51bGw7c2V0UGFnZSh2aXNpdGVkUGFnZXMuc2hpZnQoKSk7fVxufVxuZnVuY3Rpb24gc2hvd0hlbHAoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIGhlbHAhXCIpO1xuICAgIHNldFBhZ2UoJ3BhZ2UtcnVsZXMnKTtcbn1cbi8vIGFzY2VydGFpbiB0byBkaXNhYmxlIHRoZSBIZWxwIGJ1dHRvbiB3aGVuIHZpZXdpbmcgaXQhISFcbmZ1bmN0aW9uIHVwZGF0ZUhlbHBCdXR0b25zKCl7XG4gICAgbGV0IGVuYWJsZUhlbHBCdXR0b249KGN1cnJlbnRQYWdlIT09J3BhZ2UtaGVscCcpO1xuICAgIGZvcihsZXQgaGVscEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWxwJykpaGVscEJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlSGVscEJ1dHRvbjtcbn1cblxuLyoqXG4gKiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbmV3LXBsYXllcnMgYnV0dG9uIGlzIGNsaWNrZWQsIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCBhIG5ldyBzZXQgb2YgcGxheWVyc1xuICovXG5mdW5jdGlvbiBuZXdQbGF5ZXJzKCl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gTmlldXdlIHNwZWxlcnMgYWFubWFrZW4uXCIpO1xuICAgIHBsYXllcnM9W107XG4gICAgbGV0IG5vUGxheWVyTmFtZXM9dHJ1ZTtcbiAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIHBsYXllciBpbnB1dCBmaWVsZHNcbiAgICBmb3IocGxheWVyTmFtZUlucHV0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKHBsYXllck5hbWVJbnB1dC52YWx1ZS5sZW5ndGg+MCl7XG4gICAgICAgICAgICBub1BsYXllck5hbWVzPWZhbHNlO1xuICAgICAgICAgICAgcGxheWVycy5wdXNoKG5ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZUlucHV0LnZhbHVlKSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgIGlmKHBsYXllcnMubGVuZ3RoPDQpXG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobnVsbCk7XG4gICAgfVxuICAgIGlmKG5vUGxheWVyTmFtZXMpe1xuICAgICAgICBwbGF5ZXJzPW51bGw7XG4gICAgICAgIHNldEluZm8oXCJHZWVuIHNwZWxlcm5hbWVuIG9wZ2VnZXZlbi4gSGViIHRlbm1pbnN0ZSBlZW4gc3BlbGVybmFhbSBub2RpZyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJSaWtrZW4gLSBoZXQgc3BlbDogTmlldXdlIHNwZWxlcnMgYWFuZ2VtYWFrdCFcIik7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbEdhbWUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7Ly9pZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJHZWVuIHNwZWwhXCIpO1xuICAgIGlmKCFyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgYWxlcnQoXCJHZWVuIHNwZWwgb20gYWYgdGUgYnJla2VuISBMYWFkIGRlemUgd2ViIHBhZ2luYSBvcG5pZXV3IVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjb25maXJtKFwiV2lsdCBVIGVjaHQgaGV0IGh1aWRpZ2Ugc3BlbCBhZmJyZWtlbj9cIikpe1xuICAgICAgICByaWtrZW5UaGVHYW1lLmNhbmNlbCgpO1xuICAgIH1cbn1cbi8qIFxuZnVuY3Rpb24gbmV3VHJpY2tCdXR0b25DbGlja2VkKCl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICAoIXJpa2tlblRoZUdhbWV8fHJpa2tlblRoZUdhbWUuc2hvd05ld1RyaWNrSW5mbygpKTtcbn1cbiovXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpdGlvbmFsIHN0dWZmIHRoYXQgd2UncmUgZ29pbmcgdG8gbmVlZCB0byBtYWtlIHRoaXMgc3R1ZmYgd29ya1xuY2xhc3MgUGxheWVyR2FtZVByb3h5IGV4dGVuZHMgUGxheWVyR2FtZSB7XG5cbiAgICBnZXRTZW5kRXZlbnQoZXZlbnQsZGF0YSxjYWxsYmFjayl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBldmVudCBcIitldmVudCtcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkrXCIuXCIpO1xuICAgICAgICByZXR1cm4gW2V2ZW50LGRhdGEsY2FsbGJhY2tdO1xuICAgIH1cblxuICAgIC8vIE1ESEAyM0pBTjIwMjA6IGNhbGxlZCBmcm9tIHVwZGF0ZUJpZHNUYWJsZVxuICAgIGdldFBsYXllckluZGV4KHBsYXllck5hbWUpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9KHRoaXMuX3BsYXllck5hbWVzP3RoaXMuX3BsYXllck5hbWVzLmxlbmd0aDowKTtcbiAgICAgICAgd2hpbGUoLS1wbGF5ZXJJbmRleD49MCYmdGhpcy5fcGxheWVyTmFtZXNbcGxheWVySW5kZXhdIT09cGxheWVyTmFtZSk7XG4gICAgICAgIGlmKHBsYXllckluZGV4PDApe2NvbnNvbGUubG9nKFwiUGxheWVyIG5hbWUgJ1wiK3BsYXllck5hbWUrXCInIG5vdCBmb3VuZCBpbiBcIitKU09OLnN0cmluZ2lmeSh0aGlzLl9wbGF5ZXJOYW1lcykrXCIuXCIpO31cbiAgICAgICAgcmV0dXJuIHBsYXllckluZGV4O1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlBsYXllcnMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoO31cblxuICAgIC8vIHdoYXQgdGhlIHBsYXllciB3aWxsIGJlIGNhbGxpbmcgd2hlbiAocyloZSBtYWRlIGEgYmlkLCBwbGF5ZWQgYSBjYXJkLCBjaG9vc2UgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZVxuICAgIGJpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdCSUQnLGJpZCxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvcmNlRm9jdXMobnVsbCk7IC8vIGEgYml0IGNydWRlIHRvIGdldCByaWQgb2YgdGhlIEJpZWRlbiBwYWdlIG5hbWUgdGhvdWdoXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCSUQgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAgICAgfSkpOyAvLyBubyBuZWVkIHRvIHNlbmQgdGhlIHBsYXllciBpZCBJIHRoaW5rLi4uIHsnYnknOnRoaXMuX3BsYXllckluZGV4LCdiaWQnOmJpZH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UncmUgc2VuZGluZyB0aGUgZXhhY3QgY2FyZCBvdmVyIHRoYXQgd2FzIHBsYXllZCAoYW5kIGFjY2VwdGVkIGF0IHRoaXMgZW5kIGFzIGl0IHNob3VsZCBJIGd1ZXNzKVxuICAgIC8vIE1ESEAxNEpBTjIwMjA6IHBhc3NpbmcgaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkICdmbGFnJyBhcyB3ZWxsISEhIVxuICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2Ugd2UncmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBSaWtrZW5UaGVHYW1lIGltcGxlbWVudGF0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQgZG9lc24ndCBlbmQgdXAgaW4gdGhlIGxvY2FsIFJpa2tlblRoZUdhbWUgdHJpY2tcbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogZGlzYWJsZSB0aGUgYnV0dG9ucyBvbmNlIHRoZSBjYXJkIGlzIGFjY2VwdGVkICh0byBiZSBwbGF5ZWQhISEpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIFRPRE8gcGVyaGFwcyBoaWRpbmcgdGhlIGNhcmRzIHNob3VsZCBhbHNvIGJlIGRvbmUgaGVyZSEhIVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgY2FyZCBwbGF5ZWQ6IFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ0NBUkQnLFtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF0sZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ0FSRCBwbGF5ZWQgcmVjZWlwdCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICAgICAgfSkpOyAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnY2FyZCc6W2NhcmQuc3VpdGUsY2FyZC5yYW5rXX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvcmNlRm9jdXMobnVsbCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBldmVudCByZWNlaXB0IGFja25vd2xlZGdlZC5cIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGFzY2VydGFpbiB0byBoaWRlIHRoZSB0cnVtcCBzdWl0ZSBpbnB1dCBlbGVtZW50XG4gICAgICAgICAgICB9KSk7IC8vIHNhbWUgaGVyZTogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6dHJ1bXBTdWl0ZX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgc3VpdGUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGFzY2VydGFpbiB0byBoaWRlIHRoZSBwYXJ0bmVyIHN1aXRlIGlucHV0IGVsZW1lbnRcbiAgICAgICAgICAgIH0pKTsgLy8gcmVwbGFjaW5nOiB7J3BsYXllcic6dGhpcy5fcGxheWVySW5kZXgsJ3N1aXRlJzpwYXJ0bmVyU3VpdGV9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdCWUUnLHJlYXNvbixmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCWUUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZC5wdXNoKHtldmVudDpldmVudCxkYXRhOmRhdGF9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gVE9ETyBoYXZlIHRvIGNoYW5nZSB0aGlzIHRvIGluY2x1ZGUgdGhlIGZyaWVuZGx5IGZsYWcgYXMgd2VsbCEhISFcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgcmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcblxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1wbGF5ZXJOYW1lcztcblxuICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0oIXRoaXMuX3BsYXllck5hbWVzfHx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg8ND8tMTp0aGlzLl9wbGF5ZXJOYW1lcy5pbmRleE9mKGN1cnJlbnRQbGF5ZXIubmFtZSkpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PXRoaXMuX3BsYXllckluZGV4O1xuICAgICAgICBpZih0aGlzLl9wbGF5ZXJJbmRleD49MCl7XG4gICAgICAgICAgICB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIHNob3dQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgb24gcGFnZS1wbGF5aW5nIE9OQ0UgYXMgaXQgd2lsbCBhbHdheXMgc3RheSB0aGUgc2FtZVxuICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAvLyByZXBsYWNpbmc6IHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIiksdGhpcy5nZXRQbGF5ZXJOYW1lKHRoaXMuX3BsYXllckluZGV4KSwtMik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQ3VycmVudCBwbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgIGlmKHRoaXMuX3BsYXllck5hbWVzKVxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogVXcgbmFhbSBrb210IG5pZXQgdm9vciBpbiBkZSBzcGVsZXJsaWpzdCB2YW4gaGV0IHRlIHNwZWxlbiBzcGVsIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpe1xuICAgICAgICByZXR1cm4ocGxheWVySW5kZXg+PTAmJnBsYXllckluZGV4PHRoaXMuX251bWJlck9mVHJpY2tzV29uLmxlbmd0aD90aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwbGF5ZXJJbmRleF06MCk7XG4gICAgfVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogd2lsbCBiZSByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudCB3aGVuIGEgbmV3IHRyaWNrIHN0YXJ0c1xuICAgIC8vIE1ESEAyMkpBTjIwMjA6IHVzZXIgd2lsbCBoYXZlIHRvIGNsaWNrIHRoZSBuZXcgdHJpY2sgYnV0dG9uIHNvIHRoZXkgY2FuIGxvb2sgYXQgdGhlIG9sZCB0cmljayBmaXJzdFxuICAgIG5ld1RyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIFxuICAgICAgICAvLyBBU1NFUlQgb25seSBjYWxsIHdoZW4gdHJpY2tJbmZvIGlzIG5vdCBOVUxMISEhISFcbiAgICAgICAgaWYoIXRyaWNrSW5mbyl7YWxlcnQoXCJCVUc6IE5vIHRyaWNrIGluZm8hXCIpO3JldHVybjt9XG5cbiAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7IC8vIHJlbW92ZSB0aGUgY2FyZHMgc2hvd2luZyBmcm9tIHRoZSBwcmV2aW91cyB0cmlja1xuXG4gICAgICAgIC8vIHNob3cgdGhlIGlkIG9mIHRoZSB0cmljayAod2hpY2ggaXMgdGhlIHRyaWNrIGluZGV4KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgXCIrdHJpY2tJbmZvLmluZGV4O1xuXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPXRyaWNrSW5mby5pbmRleC0xO1xuXG4gICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpOyAvLyBzaG93IHRoZSBmaW5pc2hlZCB0cmljayBpbiB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZVxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyB0cmljayB3aXRoIHRoZSBpbmZvcm1hdGlvbiBpbiB0aGUgdHJpY2sgaW5mb1xuICAgICAgICB0aGlzLl90cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRoaXMuX3RydW1wU3VpdGUsdGhpcy5fcGFydG5lclN1aXRlLHRoaXMuX3BhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCx0cmlja0luZm8uZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKTtcbiAgICBcbiAgICB9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiBpZiB3ZSByZWNlaXZlIGFsbCBwYXJ0bmVycyB3ZSBjYW4gZXh0cmFjdCB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBfc2V0UGFydG5lcklkcyhwYXJ0bmVySWRzKXtcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1wYXJ0bmVySWRzO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj0odGhpcy5fcGFydG5lcklkcyYmdGhpcy5fcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllckluZGV4PHRoaXMuX3BhcnRuZXJJZHMubGVuZ3RoP3RoaXMuX3BhcnRuZXJJZHNbdGhpcy5fcGxheWVySW5kZXhdOm51bGwpO1xuICAgIH1cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIHRoaXMuX3RyaWNrLmFkZENhcmQobmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mby5zdWl0ZSxjYXJkSW5mby5yYW5rKSk7XG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IGV2ZXJ5IGNhcmQgcGxheWVkIGNvbnRhaW5zIHRoZSBwYXJ0bmVycyBhcyB3ZWxsISEhXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGFydG5lcnNcIikpdGhpcy5fc2V0UGFydG5lcklkcyhjYXJkSW5mby5wYXJ0bmVycyk7IFxuICAgICAgICAvLyBpZiBhbGwgdGhlIGNhcmRzIGluIHRoZSB0cmljayBoYXZlIGJlZW4gcGxheWVkLCB0aGUgd2lubmVyIGlzIGRlZmluaXRlLCBhbmQgd2lucyB0aGUgdHJpY2tcbiAgICAgICAgaWYodGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcz09PTQpdGhpcy5fbnVtYmVyT2ZUcmlja3NXb25bdGhpcy5fdHJpY2sud2lubmVyXSsrO1xuICAgICAgICAvLyBkbyBub3RoaW5nLi4uXG4gICAgICAgIC8vIHNob3dUcmlja0NhcmQodGhpcy5fdHJpY2suZ2V0TGFzdENhcmQoKSx0aGlzLl90cmljay5udW1iZXJPZkNhcmRzKTtcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsvL2lmKHRoaXMuX3RyaWNrV2lubmVyKXt0aGlzLl90cmlja1dpbm5lcj1udWxsO3Nob3dUcmljayh0aGlzLl90cmljayk7fVxuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0cmlja0luZm8udHJ1bXBTdWl0ZSx0cmlja0luZm8ucGFydG5lclN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAvLyBhbHJlYWR5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IhISFcbiAgICAgICAgLy8gdHJpY2suX2ZpcnN0UGxheWVyPXRyaWNrSW5mby5maXJzdFBsYXllcjtcbiAgICAgICAgLy8gdHJpY2suX2NhbkFza0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgaWYodHJpY2tJbmZvLmNhcmRzJiZ0cmlja0luZm8uY2FyZHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZmlsbCB0aGUgdHJpY2sgd2l0aCB0cmljayBpbmZvcm1hdGlvbiBmcm9tIHRoZSBvdGhlciBwbGF5ZXJzISEhXG4gICAgICAgICAgICB0cmlja0luZm8uY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSkuaG9sZGVyPXRyaWNrO30pOyAvLyBzdG9yZSB0aGUgY2FyZHMgcmVjZWl2ZWQgaW4gdHJpY2tcbiAgICAgICAgICAgIHRyaWNrLl93aW5uZXI9dHJpY2tJbmZvLndpbm5lcjtcbiAgICAgICAgICAgIHRyaWNrLl9wbGF5U3VpdGU9dHJpY2tJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgIHRyaWNrLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWNrO1xuICAgIH1cbiAgICAqL1xuXG4gICAgYWNrbm93bGVkZ2VFdmVudHMoKXtcbiAgICAgICAgLy8gbm93IGlmIHRoZSB1bmFja25vd2xlZGdlIGV2ZW50IGlkcyBkbyBOT1QgcmVhY2ggdGhlIHNlcnZlciB3ZSB3aWxsIHJlY2VpdmUgY2VydGFpbiBldmVudHMgYWdhaW4gdW50aWwgd2UgZG9cbiAgICAgICAgLy8gbWFuYWdlIHRvIGdldCB0aGVtIG92ZXJcbiAgICAgICAgLy8gbWFrZSBhIGNvcHkgb2YgYWxsIHRoZSB1bmFja25vd2xlZGdlZCBldmVudHNcbiAgICAgICAgbGV0IGFja25vd2xlZGdlYWJsZUV2ZW50cz10aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5tYXAoKHVuYWNrbm93bGVkZ2VkRXZlbnQpPT5PYmplY3QuYXNzaWduKHt9LHVuYWNrbm93bGVkZ2VkRXZlbnQpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGFja25vd2xlZGdlYWJsZSBldmVudHM6IFwiLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgIC8vIG9mIGNvdXJzZSB3ZSBjb3VsZCBzZW5kIHRoZW0gcGFzc2luZyBhbiBhY2tub3dsZWRnZSBmdW5jdGlvbiB0aG91Z2hcbiAgICAgICAgaWYoYWNrbm93bGVkZ2VhYmxlRXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGVtaXQgcGFzc2luZyBhbG9uZyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdldCBjYWxsZWQgd2hlbiB0aGUgQUNLIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwiQUNLXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzLCgpPT57XG4gICAgICAgICAgICAgICAgLy8gd2Ugbm93IG1heSByZW1vdmUgYWxsIGFja25vd2xlZGdlYWJsZSBldmVudHNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKiBFdmVudHMgYWNrbm93bGVkZ2VtZW50cyByZWNlaXZlZCEgKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vLy8vZGlmZmVyZW5jZSh0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cyxhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkdXBsaWNhdGVkIGZyb20gc2VydmVyLXNpZGUgUmlra2VuVGhlR2FtZS5qcyB0aGF0IHdpbGwgdHJhbnNsYXRlIHRoaXMuX3BsYXllcnNCaWRzIHRvIHJlYWRhYmxlIGJpZHNcbiAgICAvLyB0byBiZSBwYXNzZWQgdG8gdXBkYXRlQmlkc1RhYmxlKCkhISFcbiAgICBfZ2V0UGxheWVyQmlkc09iamVjdHMoKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3RzPVtdO1xuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWRzKT0+e1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9e25hbWU6dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckJpZHNPYmplY3RzLmxlbmd0aCksYmlkczpbXX07XG4gICAgICAgICAgICAvLyB1c2UgdW5zaGlmdCBOT1QgcHVzaCBhcyB0aGUgYmlkcyBhcmUgc3RvcmVkIHJldmVyc2Ugb3JkZXIgXG4gICAgICAgICAgICBwbGF5ZXJCaWRzLmZvckVhY2goKHBsYXllckJpZCk9PntwbGF5ZXJCaWRzT2JqZWN0LmJpZHMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1twbGF5ZXJCaWRdKX0pO1xuICAgICAgICAgICAgcGxheWVyQmlkc09iamVjdHMucHVzaChwbGF5ZXJCaWRzT2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJCaWRzT2JqZWN0cztcbiAgICB9XG5cbiAgICAvLyBnZW5lcmljIG1ldGhvZCBmb3IgcHJvY2Vzc2luZyBhbnkgZXZlbnQsIGV2ZXJ5XG4gICAgcHJvY2Vzc0V2ZW50KGV2ZW50LGV2ZW50RGF0YSxhY2tub3dsZWRnZSl7XG4gICAgICAgIC8vIGxvZyBldmVyeSBldmVudFxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGV2ZW50LGV2ZW50RGF0YSk7XG4gICAgICAgIGlmKCFldmVudERhdGEpcmV0dXJuO1xuICAgICAgICAvLyBpZiBkYXRhIGhhcyBhbiBpZCBpdCBuZWVkcyB0byBiZSBhY2tub3dsZWRnZWRcbiAgICAgICAgbGV0IGV2ZW50SWQ9KGV2ZW50RGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpP2V2ZW50RGF0YS5pZDpudWxsKTtcbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbiBldmVudCBpZCBpbiB0aGlzIGV2ZW50LCBhbmQgd2UncmUgc3VwcG9zZWQgdG8gc2VuZCBhY2tub3dsZWRnZW1lbnRzLCBkbyBzb1xuICAgICAgICBpZihldmVudElkKXtcbiAgICAgICAgICAgIC8vIE1ESEAxN0pBTjIwMjA6IG5vdyBwdXNoIHRoZSBldmVudCBuYW1lIGFzIHdlbGwgc28gdGhlIHNlcnZlciBjYW4gbG9nIHRoYXQgYW5kIHdlIGNhbiBzZWUgd2hhdCdzIGFja25vd2xlZ2RlZCEhIVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgQlVUIGRvbid0IHB1c2ggaXQgYWdhaW4gaWYgaXQncyBhbHJlYWR5IHRoZXJlISEhIVxuICAgICAgICAgICAgaWYoYWNrbm93bGVkZ2UpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoPT09MHx8dGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHNbdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoLTFdLmlkIT09ZXZlbnRJZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMucHVzaCh7J2lkJzpldmVudElkLCdldmVudCc6ZXZlbnR9KTtcbiAgICAgICAgICAgIHRoaXMuYWNrbm93bGVkZ2VFdmVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YT0oZXZlbnRJZD9ldmVudERhdGEucGF5bG9hZDpldmVudERhdGEpO1xuICAgICAgICBzd2l0Y2goZXZlbnQpe1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRFQ0hBTkdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVcIjpcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdhbWUgaW5mb3JtYXRpb24gcmVjZWl2ZWQgYnkgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicuXCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgICAgICAvLyBpZihkYXRhLmhhc093blByb3BlcnR5KCdwbGF5ZXJzJykpdGhpcy5wbGF5ZXJOYW1lcz1kYXRhLnBsYXllcnM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZXM9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJERUFMRVJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWFsZXI9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDQVJEU1wiOlxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBob2xkYWJsZSBjYXJkIGZyb20gY2FyZEluZm8gcGFzc2luZyBpbiB0aGUgY3VycmVudCBwbGF5ZXIgYXMgY2FyZCBob2xkZXJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUEFSVE5FUlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwaWNhbGx5IHRoZSBnYW1lIGluZm8gY29udGFpbnMgQUxMIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdGhlIGdhbWUgdGhhdCBpcyBnb2luZyB0byBiZSBwbGF5ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gaS5lLiBhZnRlciBiaWRkaW5nIGhhcyBmaW5pc2hlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnVtcFN1aXRlPWRhdGEudHJ1bXBTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPWRhdGEucGFydG5lclN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1kYXRhLnBhcnRuZXJSYW5rO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkPWRhdGEuaGlnaGVzdEJpZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZGRlcnM9ZGF0YS5oaWdoZXN0QmlkZGVycztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm91cnRoQWNlUGxheWVyPWRhdGEuZm91cnRoQWNlUGxheWVyO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBtb3ZlIHNob3dpbmcgdGhlIGdhbWUgaW5mbyBmcm9tIHBsYXlBQ2FyZCgpIHRvIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyUmFuaz49MCl7IC8vIGEgcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclN1aXRlRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXN1aXRlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fcGFydG5lclN1aXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJSYW5rRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaW5oZXJpdFwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgLy8gbm8gcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lckVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lcicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19CSURcIjpcbiAgICAgICAgICAgICAgICBpZihkYXRhIT09Y3VycmVudFBsYXllci5uYW1lKVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiBcIitkYXRhK1wiLlwiKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBib2QgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgIC8vIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2F0IHdpbCBqZSBzcGVsZW4/XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTUFLRV9BX0JJRFwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIubWFrZUFCaWQoZGF0YS5wbGF5ZXJCaWRzT2JqZWN0cyxkYXRhLnBvc3NpYmxlQmlkcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQklEX01BREVcIjogLy8gcmV0dXJuZWQgd2hlbiBhIGJpZCBpcyBtYWRlIGJ5IHNvbWVvbmVcbiAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyB0byByZWNlaXZlIGluIGRhdGEgYm90aCB0aGUgcGxheWVyIGFuZCB0aGUgYmlkXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9Z2V0QmlkSW5mbyhkYXRhLmJpZCxkYXRhLnBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXg/bnVsbDp0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkc1tkYXRhLnBsYXllcl0ucHVzaChkYXRhLmJpZCk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBob3cgdG8gc2hvdyB0aGUgYmlkcz8/Pz8/XG4gICAgICAgICAgICAgICAgdXBkYXRlQmlkc1RhYmxlKHRoaXMuX2dldFBsYXllckJpZHNPYmplY3RzKCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX1BMQVlcIjpcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gXCIrZGF0YStcIi5cIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QhXCIpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJTcGVlbCBlZW4ga2FhcnQgYmlqLlwiO1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgY29udGFpbiB0aGUgY3VycmVudCBjYXJkcyB0aGUgdXNlciBoYXNcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8qIE1ESEAyM0pBTjIwMjA6IGdhbWUga2VlcHMgdHJhY2sgb2YgdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGJ5IGVhY2ggcGxheWVyISEhISFcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYW5kIHRvIHdpblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLm51bWJlck9mVHJpY2tzV29uPWRhdGEubnVtYmVyT2ZUcmlja3NXb247XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gUExBWUVSX0lORk8gZG9lcyBub3QgbmVlZCB0byBzZW5kIHRoZSBmb2xsb3dpbmcgd2l0aCBlYWNoIFBMQVlFUl9JTkZPIFRIT1VHSFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YS5udW1iZXJPZlRyaWNrc1RvV2luKTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTX1RPX1dJTlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJORVdfVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1RyaWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRfUExBWUVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDYXJkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlfQV9DQVJEXCI6XG4gICAgICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IE5PVCBhbnltb3JlXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX3RyaWNrKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBVIHdvcmR0IG9tIGVlbiBrYWFydCBnZXZyYWFnZCBpbiBlZW4gb25nZWRlZmluaWVlcmRlIHNsYWchXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBvY2Nhc3Npb25hbGx5IHdlIG1heSByZWNlaXZlIHRoZSByZXF1ZXN0IHRvIHBsYXkgQkVGT1JFIGFjdHVhbGx5IGhhdmluZyByZWNlaXZlZCB0aGUgc3RhdGUgY2hhbmdlISFcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGFnZSE9PVwicGFnZS1wbGF5aW5nXCIpc2V0UGFnZShcInBhZ2UtcGxheWluZ1wiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9UUlVNUF9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlVHJ1bXBTdWl0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlUGFydG5lclN1aXRlKGRhdGEuc3VpdGVzLGRhdGEucGFydG5lclJhbmtOYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1wiOlxuICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrcyh0aGlzLnBhcnNlVHJpY2soZGF0YSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLU1wiOiAvLyBNREhAMjNKQU4yMDIwOiB3b24ndCBiZSByZWNlaXZpbmcgdGhpcyBldmVudCBhbnltb3JlLi4uXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHRyYWN0IHRoZSB0cmlja3MgZnJvbSB0aGUgYXJyYXkgb2YgdHJpY2tzIGluIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpY2tzPWRhdGEubWFwKCh0cmlja0luZm8pPT57cmV0dXJuIHRoaXMucGFyc2VUcmljayh0cmlja0luZm8pO30pO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUkVTVUxUU1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2Ugd29uJ3QgYmUgcmVjZWl2aW5nIGEgbmV3IHRyaWNrIGV2ZW50LCBidXQgd2Ugc3RpbGwgd2FudCB0byBzaG93IHRoZSB1c2VyIHRoYXQgd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIGNoZWNrIGlmIHRoZSBwYWdlIG1vdmVkIHRvIHRoZSByZXN1bHRzIHBhZ2U/Pz8/Pz9cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBiZXR0ZXIgbm90IHRvIGdvIG91dCBvZiBvcmRlciB3aGVuIHRoaXMgaGFwcGVucyEhISEhIVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJiaW5kaW5nIG1ldCBkZSBzZXJ2ZXIgKHRpamRlbGlqaykgdmVyYnJva2VuIVwiKTsgLy8gcmVwbGFjaW5nOiB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIGV2ZW50IFwiK2V2ZW50K1wiIHJlY2VpdmVkIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJlcGFyaW5nIGZvciBjb21tdW5pY2F0aW9uXCIpO1xuICAgICAgICAvLyB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgIC8vICAgICB0aGlzLl9zdGF0ZT1JRExFO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vIGtlZXAgdHJhY2sgb2YgdGhlIHVuYWNrbm93bGVkZ2VkRXZlbnRJZHNcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywoKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdkaXNjb25uZWN0JyxudWxsLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1NUQVRFQ0hBTkdFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnU1RBVEVDSEFOR0UnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWUVSUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUlMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignREVBTEVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnREVBTEVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUEFSVE5FUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BBUlRORVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRV9JTkZPJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRV9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19CSURcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ01BS0VfQV9CSUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdNQUtFX0FfQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0JJRF9NQURFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQklEX01BREUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX1BMQVlcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fUExBWScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gTURIQDEzSkFOMjAyMDogcGxheWVyIGluZm8gd2lsbCBiZSByZWNlaXZlZCBiZWZvcmUgYmVpbmcgYXNrZWQgdG8gcGxheSBhIGNhcmQgdG8gdXBkYXRlIHRoZSBwbGF5ZXIgZGF0YVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJQTEFZRVJfSU5GT1wiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1NfVE9fV0lOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTX1RPX1dJTicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdORVdfVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdORVdfVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRF9QTEFZRUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDQVJEX1BMQVlFRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZX0FfQ0FSRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlfQV9DQVJEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9UUlVNUF9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NIT09TRV9UUlVNUF9TVUlURScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfUEFSVE5FUl9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1MnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1MnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUkVTVUxUUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1JFU1VMVFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRU9WRVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FT1ZFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBtdWx0aXBsZSBldmVudHMgYXMgYSB3aG9sZSwgd2UgcHJvY2VzcyBhbGwgb2YgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignRVZFTlRTJywoZXZlbnRzKT0+e1xuICAgICAgICAgICAgLy8gd2UgY291bGQgY29uc3VtZSB0aGUgZXZlbnRzIEkgZ3Vlc3NcbiAgICAgICAgICAgIHdoaWxlKGV2ZW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZXZlbnQ9ZXZlbnRzLnNoaWZ0KCk7IC8vIHJlbW92ZSB0aGUgZmlyc3QgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBhc2NlcnRhaW4gdG8gc2VuZCBhbGwgdW5hY2tub3dsZWRnZWQgZXZlbnQgaWRzIHdoZW4gdGhpcyBpcyB0aGUgbGFzdCBwcm9jZXNzIGV2ZW50ISEhIVxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50LmV2ZW50LGV2ZW50LmRhdGEsZXZlbnRzLmxlbmd0aD09PTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBNREhAMDhKQU4yMDIwOiBzb2NrZXQgc2hvdWxkIHJlcHJlc2VudCBhIGNvbm5lY3RlZCBzb2NrZXQuaW8gaW5zdGFuY2UhISFcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQpe1xuICAgICAgICAvLyBPT1BTIGRpZG4ndCBsaWtlIGZvcmdldHRpbmcgdGhpcyEhISBcbiAgICAgICAgLy8gYnV0IFBsYXllckdhbWUgZG9lcyBOT1QgaGF2ZSBhbiBleHBsaWNpdCBjb25zdHJ1Y3RvciAoaS5lLiBubyByZXF1aXJlZCBhcmd1bWVudHMpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c1JlY2VpdmVkPVtdO1xuICAgICAgICB0aGlzLl90cmlja1dpbm5lcj1udWxsO1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fc29ja2V0PXNvY2tldDtcbiAgICAgICAgdGhpcy5fZGVhbGVyPS0xO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xOy8vdGhpcy5fdHJ1bXBQbGF5ZXI9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTt0aGlzLl9wYXJ0bmVyUmFuaz0tMTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NXb249WzAsMCwwLDBdOyAvLyBhc3N1bWUgbm8gdHJpY2tzIHdvbiBieSBhbnlib2R5XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPTA7dGhpcy5fdHJpY2s9bnVsbDtcbiAgICAgICAgdGhpcy5faGlnaGVzdEJpZD0tMTt0aGlzLl9oaWdoZXN0QmlkZGVycz1bXTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcz1bW10sW10sW10sW11dOyAvLyBNREhAMjFKQU4yMDIwOiBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgYmlkcyB0byBzaG93XG4gICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50cz1udWxsO1xuICAgICAgICAvLyB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fdGVhbU5hbWVzPW51bGw7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyB0aGUgJ2N1cnJlbnQnIHBsYXllclxuICAgICAgICAvLyB0aGluZ3Mgd2UgY2FuIHN0b3JlIGludGVybmFsbHkgdGhhdCB3ZSByZWNlaXZlIG92ZXIgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fbmFtZT1udWxsOyAvLyB0aGUgbmFtZSBvZiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1udWxsOyAvLyB0aGUgbmFtZXMgb2YgdGhlIHBsYXllcnNcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1udWxsOyAvLyB0aGUgcGFydG5lclxuICAgICAgICB0aGlzLnByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgaXRzZWxmIG9yZ2FuaXplZCBieSBzdGF0ZVxuICAgIC8vIFBMQVlJTkdcbiAgICBnZXRUcnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAvLyBnZXRUcnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9XG4gICAgXG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXsgLy8gb25seSB3aGVuIHBsYXllciBlcXVhbHMgdGhpcy5fcGxheWVySW5kZXggZG8gd2Uga25vdyB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lcj0ocGxheWVyPT09dGhpcy5fcGxheWVySW5kZXg/Y3VycmVudFBsYXllci5wYXJ0bmVyOi0xKTtcbiAgICAgICAgcmV0dXJuKHBhcnRuZXI+PTAmJnBhcnRuZXI8dGhpcy5udW1iZXJPZlBsYXllcnM/dGhpcy5fcGxheWVyTmFtZXNbcGFydG5lcl06bnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnM7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZDt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIC8vIGdldFBsYXllck5hbWUocGxheWVyKXtyZXR1cm4odGhpcy5fcGxheWVyTmFtZXMmJnBsYXllcjx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg/dGhpcy5fcGxheWVyTmFtZXNbcGxheWVyXTpcIj9cIik7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe3JldHVybiB0aGlzLl9kZWx0YVBvaW50czt9XG4gICAgZ2V0IHBvaW50cygpe3JldHVybiB0aGlzLl9wb2ludHM7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCxvdGhlclBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGFydG5lcklkcz90aGlzLl9wYXJ0bmVySWRzW3BsYXllckluZGV4XT09PW90aGVyUGxheWVySW5kZXg6ZmFsc2UpO31cbiAgICAvLyBnZXRMYXN0VHJpY2tQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbGFzdFRyaWNrUGxheWVkO30gLy8gVE9ETyBzdGlsbCB1c2VkPz8/Pz9cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ7fVxuICAgIC8vIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcjt9XG4gICAgZ2V0VGVhbU5hbWUocGxheWVySW5kZXgpe1xuICAgICAgICAvLyBjb21wdXRpbmcgdGhlIHRlYW0gbmFtZSBvbiB0aGUgZmx5XG4gICAgICAgIGxldCB0ZWFtTmFtZT10aGlzLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICBsZXQgcGFydG5lckluZGV4PSh0aGlzLl9wYXJ0bmVySWRzP3RoaXMuX3BhcnRuZXJJZHNbcGxheWVySW5kZXhdOi0xKTsgLy8gTk9URSBjb3VsZCBiZSBudWxsISEhXG4gICAgICAgIGlmKHBhcnRuZXJJbmRleCYmcGFydG5lckluZGV4Pj0wKXRlYW1OYW1lKz1cIiAmIFwiK3RoaXMuZ2V0UGxheWVyTmFtZShwYXJ0bmVySW5kZXgpO1xuICAgICAgICByZXR1cm4gdGVhbU5hbWU7XG4gICAgfVxuXG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAvLyBob3cgYWJvdXQgcHJvbXB0aW5nIHRoZSB1c2VyPz8/Pz9cbiAgICAgICAgLy8gaWYoIWN1cnJlbnRQbGF5ZXJ8fCFjdXJyZW50UGxheWVyLmdhbWUpcmV0dXJuOyAvLyBkbyBub3QgYXNrIHRoZSB1c2VyIHdoZXRoZXIgdGhleSB3YW50IHRvIHN0YXkgb3Igbm90IChhcyB0aGV5IGNhbm5vdCBzdGF5KVxuICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyB2aWV3aW5nIHRoZSByZXN1bHRzIHBhZ2Ugd2UgbWF5IGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIGFjdHVhbGx5IG92ZXJcbiAgICAgICAgcmV0dXJuKGN1cnJlbnRQYWdlPT09J3BhZ2UtcmVzdWx0cyc/XCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi4gVG90IGRlIHZvbGdlbmRlIGtlZXIhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XCJIZXQgc3BlbCBpcyBub2cgbmlldCB0ZW4gZWluZGUuIEJsaWpmIG9wIGRlIHBhZ2luYSBvbSB0b2NoIHZlcmRlciB0ZSBzcGVsZW4uXCIpO1xuICAgIH07XG4gICAgLy8gaWYgd2UgYWN0dWFsbHkgZW5kIHVwIGluIGxlYXZpbmcgdGhpcyBVUkwsIHdlIGRlZmluaXRlbHkgd2FudCB0byBraWxsIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgZm9yIGdvb2RcbiAgICB3aW5kb3cub25wb3BzdGF0ZT1mdW5jdGlvbigpe1xuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICAoIWN1cnJlbnRQbGF5ZXJ8fGN1cnJlbnRQbGF5ZXIuZXhpdCgpKTsgLy8gYXBwYXJlbnRseSB0aGUgY3VycmVudCBwbGF5ZXIgc2hvdWxkIGV4aXQhISEhXG4gICAgICAgIHNldFBsYXllck5hbWUobnVsbCxudWxsKTsgLy8gd2l0aG91dCBjYWxsYmFjayBubyBwYWdlIHNob3VsZCBiZSBzaG93biBhbnltb3JlLi4uXG4gICAgfVxuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogaGlkZSB0aGUgYmlkZGluZyBhbmQgcGxheWluZyBlbGVtZW50c1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgLy8gcmVwbGFjZWQgYnkgYmlkLWluZm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItYmlkXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XG4gICAgLy8gRE8gTk9UIERPIFRISVMgV0lMTCBPVkVSUlVMRSBQQVJFTlQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBNREhAMTlKQU4yMDIwOiBcImhpZGRlblwiIGNoYW5nZWQgdG8gXCJ2aXNpYmxlXCIgYXMgd2UgbmV2ZXIgaGlkZSB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgcGxheWVyc1xuICAgIC8vIHJlcGxhY2VkIGJ5IHBsYXktaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gTURIQDE5SkFOMjAyMDogYW5kIHZpY2UgdmVyc2FcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcbiAgICBmb3IobGV0IHN0b3BCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RvcCcpKXN0b3BCdXR0b24ub25jbGljaz1zdG9wUGxheWluZztcbiAgICBcbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWU7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgc3VpdGUgZWxlbWVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIHNob3cgdGhlIHJpZ2h0IHRleHQhISEhXG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPDQ7c3VpdGUrKylcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLlwiK0NhcmQuU1VJVEVfTkFNRVNbc3VpdGVdKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnZhbHVlPUNhcmQuU1VJVEVfQ0hBUkFDVEVSU1tzdWl0ZV07XG4gICAgXG4gICAgLyogTURIQDIySkFOMjAyMDogZXZlbnQgaGFuZGxlciBmb3IgY2xpY2tpbmcgdGhlIG5ldyB0cmljayBidXR0b25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikub25jbGljaz1uZXdUcmlja0J1dHRvbkNsaWNrZWQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICovXG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBjaGVjayBmb3IgYSB1c2VyIG5hbWVcbiAgICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAvLyBNREhAMjRKQU4yMDIwOiBjaGFuZ2VkICdwbGF5ZXInIHRvICdhbHMnISEhXG4gICAgbGV0IGluaXRpYWxQbGF5ZXJOYW1lPSh1cmxQYXJhbXMuaGFzKFwiYWxzXCIpP3VybFBhcmFtcy5nZXQoXCJhbHNcIikudHJpbSgpOm51bGwpO1xuICAgIGlmKGluaXRpYWxQbGF5ZXJOYW1lKXNldFBsYXllck5hbWUoaW5pdGlhbFBsYXllck5hbWUsKGVycik9Pnt9KTtcblxufTtcblxuLy8gTURIQDA4SkFOMjAyMDogZ3JlYXQgaWRlYSB0byBtYWtlIGV2ZXJ5dGhpbmcgd29yayBieSBhbGxvd2luZyB0byBzZXQgdGhlIHBsYXllciBuYW1lXG5mdW5jdGlvbiBfc2V0UGxheWVyKHBsYXllcixlcnJvcmNhbGxiYWNrKXtcbiAgICB2aXNpdGVkUGFnZXM9W107IC8vIGZvcmdldCB2aXNpdGVkIHBhZ2VzXG4gICAgY3VycmVudFBhZ2U9bnVsbDsgLy8gYXNjZXJ0YWluIHRvIG5vdCBoYXZlIGEgcGFnZSB0byBzdG9yZVxuICAgIC8vIGdldCByaWQgb2YgdGhlIGN1cnJlbnQgcGxheWVyIChpZiBhbnkpLCBhbmQgaW4gZWZmZWN0IHdlJ2xsIGxvb3NlIHRoZSBnYW1lIGFzIHdlbGxcbiAgICBpZihjdXJyZW50UGxheWVyKXtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjaGFuZ2UgY3VycmVudFBsYXllciBiZWNhdXNlIGl0J3MgZ29ubmEgYmUgcmVwbGFjZWQgYW55d2F5XG4gICAgICAgIC8vIGJ1dCB3aWxsIGRpc2Nvbm5lY3QgZnJvbSB0aGUgc2VydmVyIGFueXdheVxuICAgICAgICBsZXQgY2xpZW50c29ja2V0PWN1cnJlbnRQbGF5ZXIuX2NsaWVudDtcbiAgICAgICAgLy8gZGlzY29ubmVjdCBpZiBuZWVkIGJlXG4gICAgICAgICghY2xpZW50c29ja2V0fHwhY2xpZW50c29ja2V0LmNvbm5lY3RlZHx8Y2xpZW50c29ja2V0LmRpc2Nvbm5lY3QoKSk7XG4gICAgICAgIC8vIHJlcGxhY2luZzogY3VycmVudFBsYXllci5nYW1lPW51bGw7IC8vIGdldCByaWQgb2YgdGhlIGdhbWUgKHdoaWNoIHdpbGwgZGlzY29ubmVjdCB0aGUgc29ja2V0IGFzIHdlbGwpIFdJU0hGVUwgVEhJTktJTkcuLi5cbiAgICAgICAgY3VycmVudFBsYXllcj1udWxsO1xuICAgICAgICBzaG93Q3VycmVudFBsYXllck5hbWUoKTtcbiAgICAgICAgaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gTURIQDEwSkFOMjAyMDogd2hlbmV2ZXIgdGhlIGN1cnJlbnRQbGF5ZXIgaXMgTk9UIGF2YWlsYWJsZSBnbyB0byBcInBhZ2UtcnVsZXNcIlxuICAgIH1cbiAgICAvLyBpZihlcnJvcmNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyB0aGUgcGFnZSB3ZSBjYW4gc2hvdyBpZiB0aGVyZSdzIG5vIHBsYXllciEhISEgKFRPRE8gb3IgcGFnZS1hdXRoPz8/Pz8pXG4gICAgaWYocGxheWVyKXtcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1pbyhsb2NhdGlvbi5wcm90b2NvbCsnLy8nK2xvY2F0aW9uLmhvc3QpO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgICAgICBpZihjbGllbnRzb2NrZXQuY29ubmVjdGVkKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygoY3VycmVudFBsYXllcj9cIlJlY29ubmVjdGVkXCI6XCJDb25uZWN0ZWRcIikrXCIgdG8gdGhlIGdhbWUgc2VydmVyIVwiKTtcbiAgICAgICAgICAgICAgICBpZighY3VycmVudFBsYXllcil7IC8vIGZpcnN0IHRpbWUgY29ubmVjdFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyPXBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9NDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nKXtlcnJvcmNhbGxiYWNrKG51bGwpO3NldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7fSAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRGUgdmVyYmluZGluZyBtZXQgZGUgc3BlbCBzZXJ2ZXIgaXMgaGVyc3RlbGQuXCIpO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAyM0pBTjIwMjA6IHB1c2ggdGhlIHBsYXllciBuYW1lIHRvIHRoZSBzZXJ2ZXIgYWdhaW4sIHNvIGl0IGNhbiByZXNlbmQgd2hhdCBuZWVkcyBzZW5kaW5nISEhIVxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIpY2xpZW50c29ja2V0LmVtaXQoJ1BMQVlFUicsY3VycmVudFBsYXllci5uYW1lLCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJBYW5nZW1lbGQgYmlqIGRlIHNwZWwgc2VydmVyIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIG1ldCBkZSBzcGVsIHNlcnZlciBpcyB2ZXJicm9rZW4uXCIpO1xuICAgICAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlci5cIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdF9lcnJvcicsKGVycik9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBlcnJvcjogXCIsZXJyKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBlZW4gcHJvYmxlZW0gbWV0IGRlIHZlcmJpbmRpbmcgbWV0IGRlIHNwZWwgc2VydmVyIChcIitlcnIubWVzc2FnZStcIikhXCIpO1xuICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRyeSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgY2F0Y2hpbmcgd2hhdGV2ZXIgaGFwcGVucyB0aHJvdWdoIGV2ZW50c1xuICAgICAgICBjbGllbnRzb2NrZXQuY29ubmVjdCgpO1xuICAgIH1lbHNlXG4gICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpO1xufVxuXG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCB0aGUgKG5ldykgbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXIgd2hlbmV2ZXIgdGhlIHBsYXllciB3YW50cyB0byBwbGF5XG4vLyBjYWxsIHNldFBsYXllck5hbWUgd2l0aCBudWxsIChvciBlbXB0eSkgcGxheWVyIG5hbWVcbi8vIHRvIG1ha2UgaXQgY2FsbGFibGUgZnJvbSBhbnl3aGVyZSB3ZSBhdHRhY2ggc2V0UGxheWVyTmFtZSB0byB3aW5kb3cgKGJlY2F1c2UgY2xpZW50LmpzIHdpbGwgYmUgYnJvd3NlcmlmaWVkISEhKVxuZnVuY3Rpb24gc2V0UGxheWVyTmFtZShwbGF5ZXJOYW1lLGVycm9yQ2FsbGJhY2spe1xuICAgIChwcmVwYXJlZEZvclBsYXlpbmd8fHByZXBhcmVGb3JQbGF5aW5nKCkpOyAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIG9uY2VcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiYhKHR5cGVvZiBwbGF5ZXJOYW1lPT09XCJzdHJpbmdcIikpXG4gICAgICAgIHJldHVybih0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobmV3IEVycm9yKFwiSW52YWxpZCBwbGF5ZXIgbmFtZS5cIikpKTtcbiAgICAvLyBpZiBwbGF5ZXJOYW1lIG1hdGNoZXMgdGhlIGN1cnJlbnQgcGxheWVyJ3MgbmFtZSwgbm90aGluZyB0byBkb1xuICAgIGlmKHBsYXllck5hbWUmJmN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIubmFtZT09PXBsYXllck5hbWUpXG4gICAgICAgICh0eXBlb2YgZXJyb3JDYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yQ2FsbGJhY2sobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCxlcnJvckNhbGxiYWNrKTtcbn1cblxud2luZG93Lm9ubG9hZD1wcmVwYXJlRm9yUGxheWluZztcblxuLy8gZXhwb3J0IHRoZSB0d28gZnVuY3Rpb24gdGhhdCB3ZSBhbGxvdyB0byBiZSBjYWxsZWQgZnJvbSB0aGUgb3V0c2lkZSEhIVxubW9kdWxlLmV4cG9ydHM9c2V0UGxheWVyTmFtZTsiXX0=
