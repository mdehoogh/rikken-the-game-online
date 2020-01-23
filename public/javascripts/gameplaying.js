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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGRlZmluaXRpb24gb2YgYSBwbGF5aW5nIENhcmRcbiAqL1xuY2xhc3MgQ2FyZHtcblxuICAgIHN0YXRpYyBnZXQgU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wiZGlhbW9uZFwiLFwiY2x1YlwiLFwiaGVhcnRcIixcInNwYWRlXCJdO31cbiAgICBzdGF0aWMgZ2V0IFJBTktfTkFNRVMoKXtyZXR1cm4gW1wiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcImphY2tcIixcInF1ZWVuXCIsXCJraW5nXCIsXCJhY2VcIl07fVxuICAgIC8vIHNob3J0aGFuZCAnY2hhcmFjdGVycycgZm9yIHRleHR1YWwgcmVwcmVzZW50YXRpb25cbiAgICAvLyBOT1QgV09SS0lORzogY29uc3QgQ0FSRF9TVUlURV9DSEFSQUNURVJTPVtTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjYpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MyksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY1KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjApXTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWydcXHUyNjY2JywnXFx1MjY2MycsJ1xcdTI2NjUnLCdcXHUyNjYwJ119OyAvLyBZRVMsIFdPUktJTkchISEhIVxuICAgIHN0YXRpYyBnZXQgU1VJVEVfRElBTU9ORCgpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBTVUlURV9DTFVCKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0hFQVJUKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX1NQQURFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQ0hBUkFDVEVSUygpe3JldHVybiBbJzInLCczJywnNCcsJzUnLCc2JywnNycsJzgnLCc5JywnMTAnLCdCJywnVicsJ0snLCdBJ107fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVFdPKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEhSRUUoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GT1VSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRklWRSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX1NJWCgpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBSQU5LX1NFVkVOKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRUlHSFQoKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19OSU5FKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfSkFDSygpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBSQU5LX1FVRUVOKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBSQU5LX0tJTkcoKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQUNFKCl7cmV0dXJuIDEyO307XG5cbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzKGNhcmQxLGNhcmQyKXtcbiAgICAgICAgbGV0IGRlbHRhU3VpdGU9Y2FyZDEuX2NhcmRTdWl0ZUluZGV4LWNhcmQyLl9jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgaWYoZGVsdGFTdWl0ZSE9MClyZXR1cm4gZGVsdGFTdWl0ZTtcbiAgICAgICAgcmV0dXJuIGNhcmQxLl9jYXJkTmFtZUluZGV4LWNhcmQyLl9jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICBcbiAgICAvLyBpbiBhIHRyaWNrIHRoZSBwbGF5IHN1aXRlIGRldGVybWluZXMgd2hhdCBjYXJkcyBhcmUgdG8gYmUgcGxheWVkLCB0aGUgdHJ1bXAgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IHRydW1wIGlzXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkMSxjYXJkMixwbGF5U3VpdGUsdHJ1bXBTdWl0ZSl7XG4gICAgICAgIC8vIG5vcm1hbGx5IHdpdGggYW55IHR3byByZWd1bGFyIGNhcmRzIHRoZXkgYXJlIG5ldmVyIGVxdWFsIGluIGEgdHJpY2tcbiAgICAgICAgLy8gY2FyZHMgdGhhdCBhcmUgbmVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlIGlzIGlycmVsZXZhbnRcbiAgICAgICAgbGV0IHJlc3VsdD0wO1xuICAgICAgICBsZXQgdHlwZT0nLSc7XG4gICAgICAgIC8vIDEuIGlmIGNhcmQxIGlzIHRydW1wLCBhbmQgY2FyZDIgaXMgbm90IG9yIGhhcyBhIGxvd2VyIHJhbmsgY2FyZDEgd2luc1xuICAgICAgICBpZihjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9dHJ1bXBTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQSc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIE5PVCB0cnVtcCBidXQgY2FyZDIgY291bGQgc3RpbGwgYmUgdHJ1bXBcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdCJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHRydW1wLCBzbyBjb3VsZCBiZSBwbGF5IHN1aXRlIG9yIG5vdC4uLlxuICAgICAgICBpZihjYXJkMS5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0MnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBub3QgcGxheSBzdWl0ZSwgYnV0IGNhcmQyIGNvdWxkIGJlXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdEJzt9XG4gICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gVHlwZTogJyt0eXBlKyc6ICcrY2FyZDEuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIoc3VpdGU6IFwiK2NhcmQxLnN1aXRlK1wiKVwiKyhyZXN1bHQ+MD8nID4gJzoocmVzdWx0PDA/JyA8ICc6JyA9ICcpKStjYXJkMi5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAoc3VpdGU6IFwiK2NhcmQyLnN1aXRlK1wiKVwiK1wiIChwbGF5OiBcIisocGxheVN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbcGxheVN1aXRlXTpcIj9cIikrXCIsIHRydW1wOlwiKygodHJ1bXBTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3RydW1wU3VpdGVdOlwiP1wiKSkrXCIpXCIpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIC8vIGxldCdzIGZpcnN0IHJlY29tcHV0ZSB0aGUgc3VpdGUgb2YgYm90aCBjYXJkcyBhbmQgZWxldmF0ZSB0cnVtcCBjYXJkcywgYW5kIGRlZXZhbHVhdGUgbm9uIHBsYXlTdWl0ZSBjYXJkc1xuICAgICAgICBsZXQgY2FyZDFTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDEuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMS5zdWl0ZSkpO1xuICAgICAgICBsZXQgY2FyZDJTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMi5zdWl0ZSkpO1xuICAgICAgICBpZihjYXJkMVN1aXRlPj0wfHxjYXJkMlN1aXRlPj0wKXsgLy8gYXQgbGVhc3Qgb25lIG9mIHRoZSBjYXJkcyBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VpdGVzIGFyZSB0aGUgc2FtZSB0aGUgaGlnaGVzdCByYW5rIHdpbnNcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU8MClyZXR1cm4gLTE7IC8vIGlmIHRoZSBmaXJzdCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGxvd2VyXG4gICAgICAgICAgICBpZihjYXJkMlN1aXRlPDApcmV0dXJuIDE7IC8vIGlmIHRoZSBzZWNvbmQgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBoaWdoZXJcbiAgICAgICAgICAgIC8vIEFTU0VSVCBib3RoIGNhcmRzIGFyZSBlaXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZT09Y2FyZDJTdWl0ZSlyZXR1cm4gY2FyZDEucmFuay1jYXJkMi5yYW5rO1xuICAgICAgICAgICAgLy8gQVNTRVJUIG9uZSBjYXJkIGlzIHBsYXkgc3VpdGUsIHRoZSBvdGhlciBtdXN0IGJlIHRydW1wIHN1aXRlXG4gICAgICAgICAgICByZXR1cm4oY2FyZDFTdWl0ZT09ND8xOi0xKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUsIGJvdGggY2FyZHMgYXJlIGlycmVsZXZhbnQgKHNob3VsZCBoYXBwZW4gdGhvdWdoKVxuICAgICAgICByZXR1cm4gMDsgLy8gY29uc2lkZXJlZCBlcXVhbCB0aGF0IGlzIGlycmVsZXZhbnRcbiAgICB9XG4gICAgXG4gICAgLy8gLy8geW91J2QgaGF2ZSB0byB1c2UgdGhlIEFwcGxlIFN5bWJvbHMgZm9udFxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmlPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CsTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4K+PC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgr08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CuzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4K6PC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgrk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CuDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4K3PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgrY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CtTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4K0PC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgrM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CsjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaM8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4ORPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg548L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DnTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4ObPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg5o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DmTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OYPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg5c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DljwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OVPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg5Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DkzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OSPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpjwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg4E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DjjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4ONPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg4s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DijwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OJPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg4g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DhzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OGPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg4U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DhDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4ODPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg4I8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CoTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4KuPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgq08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CqzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4KqPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgqk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CqDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4KnPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgqY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CpTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4KkPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgqM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CojwvbGk+XG4gICAgc3RhdGljIGdldCBDQVJEX0FQUExFX1NZTUJPTFMoKXtyZXR1cm4gW1xuICAgICAgICBbJ/Cfg4InLCfwn4ODJywn8J+DhCcsJ/Cfg4UnLCfwn4OGJywn8J+DhycsJ/Cfg4gnLCfwn4OJJywn8J+DiicsJ/Cfg4snLCfwn4ONJywn8J+DjicsJ/Cfg4EnXSxcbiAgICAgICAgWyfwn4OSJywn8J+DkycsJ/Cfg5QnLCfwn4OVJywn8J+DlicsJ/Cfg5cnLCfwn4OYJywn8J+DmScsJ/Cfg5onLCfwn4ObJywn8J+DnScsJ/Cfg54nLCfwn4ORJ10sXG4gICAgICAgIFsn8J+CsicsJ/CfgrMnLCfwn4K0Jywn8J+CtScsJ/CfgrYnLCfwn4K3Jywn8J+CuCcsJ/CfgrknLCfwn4K6Jywn8J+CuycsJ/Cfgr0nLCfwn4K+Jywn8J+CsSddLFxuICAgICAgICBbJ/CfgqInLCfwn4KjJywn8J+CpCcsJ/CfgqUnLCfwn4KmJywn8J+CpycsJ/CfgqgnLCfwn4KpJywn8J+CqicsJ/CfgqsnLCfwn4KtJywn8J+CricsJ/CfgqEnXVxuICAgIF19O1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCl7XG4gICAgICAgIHRoaXMuX2NhcmRTdWl0ZUluZGV4PWNhcmRTdWl0ZUluZGV4O1xuICAgICAgICB0aGlzLl9jYXJkTmFtZUluZGV4PWNhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBDYXJkLlJBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rXCIgb2YgXCIrQ2FyZC5TVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCJzXCI7XG4gICAgfVxuICAgIFxuICAgIGdldCByYW5rKCl7cmV0dXJuIHRoaXMuX2NhcmROYW1lSW5kZXg7fVxuICAgIGdldCBzdWl0ZSgpe3JldHVybiB0aGlzLl9jYXJkU3VpdGVJbmRleDt9XG5cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oKXtcbiAgICAgICAgLy8gaWYgd2UncmUgdXNpbmcgdGhlIHN2Zy1jYXJkcy5zdmcgd2UgY2FuIGRvIHRoZSBmb2xsb3dpbmcsIGJ1dCBpbiB0aGF0IGNhc2Ugd2UnZCBuZWVkIHRvIGtub3cgdGhlIG1hZ25pZmljYXRpb24gZmFjdG9yISEhXG4gICAgICAgIC8vcmV0dXJuIENBUkRfRk9OVF9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy9yZXR1cm4gJzxzdmcgdmlld0JveD1cIjAgMCA2NzYgOTc2XCI+PHVzZSB4bGluazpocmVmPVwiaW1nL3N2Zy1jYXJkcy5zdmcjJytTVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCItXCIrUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XSsnPC91c2U+PC9zdmc+JztcbiAgICAgICAgcmV0dXJuIENhcmQuQ0FSRF9BUFBMRV9TWU1CT0xTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy8vLy8vcmV0dXJuIFNVSVRFX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdLmNvbmNhdChSQU5LX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZE5hbWVJbmRleF0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cz1DYXJkOyIsIi8qKlxuICogZGVmaW5lcyBzb21lb25lIHRoYXQgaG9sZHMgY2FyZHNcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcblxuY2xhc3MgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTURIQDA0REVDMjAxOTogYWxsb3dpbmcgbm93IHRvIGNvbnN0cnVjdCBmaXhlZCBzaXplIGNhcmQgaG9sZGVycyAobGlrZSBUcmljaylcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhcmRzPTApe1xuICAgICAgICB0aGlzLl9jYXJkcz1bXTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZDYXJkcz1udW1iZXJPZkNhcmRzO1xuICAgICAgICB3aGlsZSgtLW51bWJlck9mQ2FyZHM+PTApdGhpcy5fY2FyZHMucHVzaChudWxsKTtcbiAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlO1xuICAgIH1cblxuICAgIC8vIG1ldGhvZHMgdG8gYWRqdXN0IHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBfcmVtb3ZlQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5pbmRleE9mKGNhcmQpO1xuICAgICAgICBpZihjYXJkSW5kZXg+PTApe1xuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHMuc3BsaWNlKGNhcmRJbmRleCwxKS5sZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIitjYXJkK1wiIHJlbW92ZWQgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiLlwiKTtcbiAgICAgICAgICAgICAgICBjYXJkLl9ob2xkZXI9bnVsbDsgLy8gd2hlbiBzdWNjZXNzZnVsIGFwcGFyZW50bHkgbm8gbG9uZ2VyIGF2YWlsYWJsZSEhIVxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiIG9mIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCI6IGl0IGlzIG5vdCBwcmVzZW50LlwiKTtcbiAgICB9XG4gICAgX2FkZENhcmQoY2FyZCl7XG4gICAgICAgIGlmKCFjYXJkKXJldHVybjtcbiAgICAgICAgaWYoIShjYXJkIGluc3RhbmNlb2YgSG9sZGFibGVDYXJkKSl0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBob2xkYWJsZSBjYXJkIVwiKTtcbiAgICAgICAgdGhpcy5sb2coXCJBZGRpbmcgY2FyZCBcIitjYXJkLnRvU3RyaW5nKCkrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICB0aGlzLl9jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+bnVtYmVyT2ZDYXJkc05vdyl7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7IC8vIGNhbiBubyBsb25nZXIgZ3VhcmFudGVlIHRoYXQgaXQgaXMgc29ydGVkLi4uXG4gICAgICAgICAgICBjYXJkLl9ob2xkZXI9dGhpcztcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgKFwiK2NhcmQudG9TdHJpbmcoKStcIikgYWRkZWQgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgICAgIC8vIGhvdyBhYm91dCBvcmRlcmluZyB0aGUgY2FyZHM/Pz8/Pz8gb3Igc3RvcmluZyB0aGVtIGJ5IHN1aXRlPz8/P1xuICAgICAgICAgICAgdGhpcy5sb2coXCJcXHRDYXJkIGNvbGxlY3Rpb246IFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2FyZCBcIitjYXJkK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIiAoZGVsdGEgbnVtYmVyIG9mIGNhcmRzOiBcIisodGhpcy5udW1iZXJPZkNhcmRzLW51bWJlck9mQ2FyZHNOb3cpK1wiKS5cIik7XG4gICAgfVxuICAgIC8qXG4gICAgLy8gcmVwbGFjZSBhIGNhcmQgYXQgYSBnaXZlbiBpbmRleCAoYXMgdXNlZCBpbiBUcmljaylcbiAgICBfc2V0Q2FyZEF0SW5kZXgoY2FyZCxpbmRleCl7XG4gICAgICAgIGlmKGluZGV4PDB8fGluZGV4Pj10aGlzLm51bWJlck9mQ2FyZHMpdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVwbGFjZSBjYXJkICNcIitTdHJpbmcoaW5kZXgrMSkrXCIuXCIpO1xuICAgICAgICBsZXQgY2FyZEF0SW5kZXg9dGhpcy5fY2FyZHNbaW5kZXhdO1xuICAgICAgICBpZihjYXJkQXRJbmRleCl7Y2FyZEF0SW5kZXguX2hvbGRlcj1udWxsO3RoaXMuX2NhcmRzW2luZGV4XT1udWxsO31cbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBpZiAnY29udGFpbmVkJyBpbiBhbm90aGVyIGNhcmQgaG9sZGVyIHJlbW92ZSBpdCBmcm9tIHRoZXJlISEhXG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgaWYoY2FyZC5faG9sZGVyKWNhcmQuX2hvbGRlci5yZW1vdmVDYXJkKGNhcmQpO1xuICAgICAgICAgICAgICAgIGlmKCFjYXJkLl9ob2xkZXIpe3RoaXMuX2NhcmRzW2luZGV4XT1jYXJkO2NhcmQuX2hvbGRlcj10aGlzO30gICAgXG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe31cbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIC8vIHBvbGwgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIGdldCBudW1iZXJPZkNhcmRzKCl7cmV0dXJuIHRoaXMuX2NhcmRzLmxlbmd0aDt9XG5cbiAgICBnZXRDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnJhbms9PXJhbms7fSk7XG4gICAgfVxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShzdWl0ZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQuc3VpdGU9PXN1aXRlO30pLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50XG4gICAgICovXG4gICAgZ2V0U3VpdGVzKCl7XG4gICAgICAgIC8vIGNhbid0IHVzZSB0aGlzIGluIGZpbHRlciEhISByZXR1cm4gWzAsMSwyLDNdLmZpbHRlcigocmFuayk9PntyZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspPjA7fSk7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGNhcmRzIGluIHRoZSBob2xkZXIgd2l0aCB0aGUgZ2l2ZW4gcmFua1xuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGFsbCBzdWl0ZXMsIHdpdGggLTEgd2hlcmUgYSBzdWl0ZSBpcyBub3QgcHJlc2VudCBpbiB0aGUgY3VycmVudCBjYXJkcyBcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aG91dFJhbmsocmFuayl7XG4gICAgICAgIC8vIGFoIHRoaXMgaXMgYW4gaXNzdWUsIGJlY2F1c2UgaWYgeW91IGRvIG5vdCBoYXZlIGEgY2VydGFpbiBzdWl0ZSB0aGUgc3VpdGUgc2hvdWxkIE5PVCBiZSByZXR1cm5lZCEhISEhXG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57XG4gICAgICAgICAgICBpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpOyAvLyBpZiBzdWl0ZSBub3QgcHJlc2VudCB5ZXQsIGFkZCBpdCB0byBzdWl0ZXNcbiAgICAgICAgICAgIGlmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzW2NhcmQuc3VpdGVdPS0xOyAvLyBub3QgcmVtb3ZpbmcgaXQgYnV0IHNldHRpbmcgdG8gLTEgaWYgd2UgbG9jYXRlIHRoZSByYW5rXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50IG9mIHdoaWNoIHRoZSBwbGF5ZXIgZG9lcyBub3QgaGF2ZSB0aGUgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBnZXRSYW5rbGVzc1N1aXRlcyhyYW5rKXtcbiAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVzPVtdO1xuICAgICAgICBsZXQgc3VpdGVzV2l0aFJhbmtzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGNhcmQpPT57XG4gICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwJiZzdWl0ZXNXaXRoUmFua3MuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5jYXJkTmFtZUluZGV4PT1yYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1aXRlc1dpdGhSYW5rcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBzdWl0ZSBpZiBhbHJlYWR5IHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW5rbGVzc1N1aXRlSW5kZXg9cmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVJbmRleD49MClyYW5rbGVzc1N1aXRlcy5zcGxpY2UocmFua2xlc3NTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSAvLyB1bnRpbCBwcm92ZW4gZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmtsZXNzU3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmFua2xlc3NTdWl0ZXM7XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzWzBdO31cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHVzZWQgaW4gZ2FtZWVuZ2luZS5qc1xuICAgIGdldExhc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRzLmxlbmd0aC0xXTt9XG5cbiAgICBjb250YWluc0NhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkPXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkPj0wJiYodGhpcy5fY2FyZHNbY2FyZF0uc3VpdGUhPT1zdWl0ZXx8dGhpcy5fY2FyZHNbY2FyZF0ucmFuayE9PXJhbmspKTtcbiAgICAgICAgcmV0dXJuKGNhcmQ+PTApOyAvLyBmb3VuZCBpZiBjYXJkIGlzIG5vdCBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8vIE1ESEAxM0pBTjIwMjA6IHdlIG5lZWQgdGhpcyB0byBmaW5kIGEgc3BlY2lmaWMgY2FyZFxuICAgIGdldENhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmRJbmRleD49MCl7bGV0IGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtpZihjYXJkLnN1aXRlPT09c3VpdGUmJmNhcmQucmFuaz09PXJhbmspcmV0dXJuIGNhcmQ7fVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYW4gZXhwb3NlIGEgdGV4dCByZXByZXNlbnRpb25cbiAgICAgKi9cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oc3VpdGVTZXBhcmF0b3Ipe1xuICAgICAgICB0aGlzLmxvZyhcIk51bWJlciBvZiBjYXJkcyB0byByZXByZXNlbnQ6IFwiK3RoaXMuX2NhcmRzLmxlbmd0aCtcIi5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCBzb3J0aW5nPz8/Pz8/Pz8gdGhhdCB3b3VsZCBiZSBuaWNlXG4gICAgICAgIGlmKHN1aXRlU2VwYXJhdG9yJiZ0eXBlb2Ygc3VpdGVTZXBhcmF0b3I9PT1cInN0cmluZ1wiJiYhdGhpcy5fc29ydGVkKXtcbiAgICAgICAgICAgIHRoaXMuX2NhcmRzLnNvcnQoY29tcGFyZUNhcmRzKTtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD10cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLl9zb3J0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMubWFwKChjYXJkKT0+e3JldHVybiBjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO30pLmpvaW4oXCIgXCIpO1xuICAgICAgICAvLyBjYXJkcyBhcmUgc3VwcG9zZWQgdG8gYmUgc29ydGVkXG4gICAgICAgIGxldCB0ZXh0UmVwcmVzZW50YXRpb249XCJcIjtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgbGV0IGNhcmQ9dGhpcy5nZXRGaXJzdENhcmQoKTtcbiAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbj1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MTtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKXtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPShjYXJkLnN1aXRlIT10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlP3N1aXRlU2VwYXJhdG9yOlwiIFwiKTtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0UmVwcmVzZW50YXRpb247IC8vIGEgc2luZ2xlIGJsYW5rIGJldHdlZW4gdGhlbSEhIVxuICAgIH1cblxufVxuXG4vKipcbiAqIGEgY2FyZCB3aXRoIGEgY2FyZCBob2xkZXIgaXMgaGVsZFxuICovXG5jbGFzcyBIb2xkYWJsZUNhcmQgZXh0ZW5kcyBDYXJke1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJIT0xEQUJMRUNBUkQgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG5cbiAgICBzZXQgaG9sZGVyKGhvbGRlcil7XG4gICAgICAgIHRoaXMubG9nKFwiQ2hhbmdpbmcgdGhlIGhvbGRlciBvZiBjYXJkIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBjdXJyZW50IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZih0aGlzLl9ob2xkZXIpdGhpcy5faG9sZGVyLl9yZW1vdmVDYXJkKHRoaXMpO1xuICAgICAgICAvLyBhZGQgKHdoZW4gc3VjY2Vzc2Z1bGx5IHJlbW92ZWQpIHRvIHRoZSBuZXcgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKCF0aGlzLl9ob2xkZXImJmhvbGRlcilob2xkZXIuX2FkZENhcmQodGhpcyk7ZWxzZSB0aGlzLmxvZyhcIkVSUk9SOiBVbmFibGUgdG8gY2hhbmdlIHRoZSBob2xkZXIhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgsaG9sZGVyKXtcbiAgICAgICAgc3VwZXIoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCk7XG4gICAgICAgIHRoaXMuX2hvbGRlcj1udWxsO1xuICAgICAgICB0aGlzLmhvbGRlcj1ob2xkZXI7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gXCJIb2xkYWJsZSBcIitzdXBlci50b1N0cmluZygpO31cblxufVxuXG5tb2R1bGUuZXhwb3J0cz17Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9OyIsIi8qKlxuICogYSBwbGFjZWhvbGRlciBmb3IgYSBwbGF5ZXJcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbi8qKlxuICogYSBQbGF5ZXIgY2FuIG1ha2UgYSBiaWQsIG9yIHBsYXkgYSBjYXJkLCBjaG9vc2UgYSB0cnVtcCBhbmQgcGFydG5lciBzdWl0ZVxuICovXG5jbGFzcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIGJpZE1hZGUoYmlkKXt9XG4gICAgY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXt9XG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXt9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7fVxufVxuXG4vLyBNREhAMDdERUMyMDE5OiBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lciB3aXRoIGdhbWUgZGF0YSBleHBvc2VkIHRvIHBsYXllclxuLy8gICAgICAgICAgICAgICAgd2hpY2ggd2FzIGVhcmxpZXIgc3RvcmVkIGluIGVhY2ggdHJpY2tcbmNsYXNzIFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIHN0YXRpYyBnZXQgQklEX05BTUVTKCl7cmV0dXJuIFtcInBhc1wiLFwicmlrXCIsXCJyaWsgKGJldGVyKVwiLFwibmVnZW4gYWxsZWVuXCIsXCJuZWdlbiBhbGxlZW4gKGJldGVyKVwiLFwicGljb1wiLFwidGllbiBhbGxlZW5cIixcInRpZW4gYWxsZWVuIChiZXRlcilcIixcImVsZiBhbGxlZW5cIixcImVsZiBhbGxlZW4gKGJldGVyKVwiLFwibWlzXFx4ZThyZVwiLFwidHdhYWxmIGFsbGVlblwiLFwidHdhYWxmIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmVcIixcImRlcnRpZW4gYWxsZWVuXCIsXCJkZXJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmUgbWV0IGVlbiBwcmFhdGplXCIsXCJ0cm9lbGFcIixcIm9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZ1wiLFwib20gZGUgbGFhdHN0ZSBzbGFnXCJdO307XG4gICAgc3RhdGljIGdldCBCSURfUEFTKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUsoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJS19CRVRFUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BJQ08oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBCSURfTUlTRVJFKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTigpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRSgpe3JldHVybiAxMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOKCl7cmV0dXJuIDE0O307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkUoKXtyZXR1cm4gMTY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UUk9FTEEoKXtyZXR1cm4gMTc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUdfRU5fU0NIT1BQRU5fVlJPVVcoKXtyZXR1cm4gMTg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUcoKXtyZXR1cm4gMTk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRFNfQUxMX0NBTl9QTEFZKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9QSUNPLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRV07fTsgLy8gdHJ1bXBsZXNzIGdhbWVzXG4gICAgc3RhdGljIGdldCBCSURTX1dJVEhfUEFSVE5FUl9JTl9IRUFSVFMoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1JJS19CRVRFUixQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVJdO307IC8vIGdhbWVzIHdpdGggdHJ1bXAgcGxheWVkIHdpdGggYSBwYXJ0bmVyXG4gICAgc3RhdGljIGdldCBCSURfUkFOS1MoKXtyZXR1cm4gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDAsLTEsLTFdO307IC8vIGhvdyBJIHBsYXllZCBpdCAoYmlkIHBhc3MgZXhjbHVkZWQgKGFsd2F5cyByYW5rIDApKVxuICAgIFxuICAgIC8vIGVhY2ggYmlkIGhhcyBhIGNlcnRhaW4gYW1vdW50IG9mIHBvaW50cyB0byByZWNlaXZlIHdoZW4gd2lubmluZyB0aGUgZ2FtZVxuICAgIHN0YXRpYyBnZXQgQklEX1BPSU5UUygpe3JldHVybiBbMCwxLDEsMywzLDQsNCw0LDUsNSw1LDYsNiw2LDcsNywxMCwyLDIsMl07fVxuXG4gICAgLy8gdGhlIHN0YXRlIGNvbnN0YW50cyB3ZSBoYXZlXG4gICAgc3RhdGljIGdldCBPVVRfT0ZfT1JERVIoKXtyZXR1cm4gMDt9XG4gICAgc3RhdGljIGdldCBJRExFKCl7cmV0dXJuIDE7fVxuICAgIHN0YXRpYyBnZXQgREVBTElORygpe3JldHVybiAyO31cbiAgICBzdGF0aWMgZ2V0IEJJRERJTkcoKXtyZXR1cm4gMzt9XG4gICAgc3RhdGljIGdldCBQTEFZSU5HKCl7cmV0dXJuIDQ7fVxuICAgIHN0YXRpYyBnZXQgQ0FOQ0VMSU5HKCl7cmV0dXJuIDU7fVxuICAgIHN0YXRpYyBnZXQgRklOSVNIRUQoKXtyZXR1cm4gNjt9XG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXt9XG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe31cbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe31cbiAgICBnZXRIaWdoZXN0QmlkKCl7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllcil7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe31cbiAgICBnZXQgcG9pbnRzKCl7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXIsb3RoZXJQbGF5ZXIpe31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7fVxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXt9XG4gICAgX2Fza1BsYXllckZvckJpZCgpe31cbiAgICBfYXNrUGxheWVyRm9yVHJ1bXBTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yUGFydG5lclN1aXRlKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JDYXJkKCl7fVxuICAgIF9jYXJkUGxheWVkQWNjZXB0ZWQoKXt9IC8vIE1ESEAyM0pBTjIwMjA6IHRoZSBlbXB0eSBtZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gYSBjYXJkIHdhcyBwbGF5ZWQgc3VjY2Vzc2Z1bGx5XG59XG5cbmNvbnN0IENIT0lDRV9JRFM9W1wiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiXTtcblxuY29uc3QgUExBWUVSVFlQRV9GT089MCxQTEFZRVJUWVBFX1VOS05PV049MSxQTEFZRVJUWVBFX0ZSSUVORD0yO1xuXG4vLyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgUGxheWVyIGluc3RhbmNlc1xuLy8gd291bGQgYmUgZGVmaW5lZCBhYnN0cmFjdCBpbiBjbGFzc2ljYWwgT09cbmNsYXNzIFBsYXllciBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlBMQVlFUiA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICBhZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyJiZwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLnB1c2gocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGV2ZW50IGxpc3RlbmVyczogXCIrdGhpcy5fZXZlbnRMaXN0ZW5lcnMrXCIuXCIpO1xuICAgIH1cblxuICAgIC8vIHdoZW5ldmVyIGEgZ2FtZSBpcyBzdGFydGVkLCBjYWxsIG5ld0dhbWUhIVxuICAgIG5ld0dhbWUoKXtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MHx8IXRoaXMuX2dhbWUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgXCIrdGhpcy5uYW1lK1wiIHVuYWJsZSB0byBwcmVwYXJlIGZvciBwbGF5aW5nOiBub3QgYXNzb2NpYXRlZCB3aXRoIGEgZ2FtZSB5ZXQuXCIpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQlVHOiBQbGF5ZXIgXCIrdGhpcy5uYW1lK1wiIHN0aWxsIGhhcyBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMuXCIpO1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gYmV0dGVyIGRvbmUgdGhpcyB3YXkgaW5zdGVhZCBvZiB0aGlzLl9jYXJkcz1bXVxuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmF1bHQgcGxheWVyIHJlbWVtYmVyaW5nIGl0cyBjaG9pY2VzXG4gICAgICAgIHRoaXMuX2JpZD0tMTsgLy8gdGhlIGxhc3QgYmlkIG9mIHRoaXMgcGxheWVyXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsO1xuICAgICAgICAvLyB0aGUgZ2FtZSBiZWluZyBwbGF5ZWQsIGFuZCB0aGUgaW5kZXggd2l0aGluIHRoYXQgZ2FtZVxuICAgICAgICB0aGlzLl9wYXJ0bmVyPS0xO1xuICAgICAgICB0aGlzLl90cmlja3NXb249W107IC8vIHRoZSB0cmlja3Mgd29uIChpbiBhbnkgZ2FtZSlcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj0tMTsgLy8gZG9lc24ndCBtYXR0ZXJcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lLHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzPVtdO1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgICAgIGlmKCEocGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpKXRocm93IG5ldyBFcnJvcihcIlBsYXllciBldmVudCBsaXN0ZW5lciBvZiB3cm9uZyB0eXBlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB3YWl0IGZvciByZWNlaXZpbmcgZ2FtZSBhbmQgaW5kZXhcbiAgICAgICAgdGhpcy5faW5kZXg9LTE7dGhpcy5fZ2FtZT1udWxsOyAvLyB3YWl0aW5nIGZvciB0aGUgZ2FtZSB0byBiZSBwbHVnZ2VkIGluIChvbmNlKVxuICAgICAgICAvLyByZW1vdmVkIHdhaXQgdW50aWwgZ2V0dGluZyBjYWxsZWQgdGhyb3VnaCBuZXdHYW1lOiB0aGlzLl9wcmVwYXJlRm9yUGxheWluZygpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICAvLyBnZXR0ZXJzIGV4cG9zaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBtYWRlIGNob2ljZVxuICAgIC8vIE5PVEUgbm8gbG9uZ2VyIGNhbGxlZCBieSB0aGUgZ2FtZSBiZWNhdXNlIHRoZSBjaG9pY2UgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IG5vd1xuICAgIC8vICAgICAgdGhpcyB3YXkgc3ViY2xhc3NlcyBhcmUgbm90IG9ibGlnYXRlZCB0byByZW1lbWJlciB0aGUgY2hvaWNlcyB0aGV5IG1ha2VcbiAgICBnZXQgYmlkKCl7cmV0dXJuIHRoaXMuX2JpZDt9XG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldCBjYXJkKCl7cmV0dXJuIHRoaXMuY2FyZCgpO31cblxuICAgIGdldCBwYXJ0bmVyKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXI7fVxuXG4gICAgLy8vLy8vLy8vLy8vLy9nZXQgY2FyZCgpe3JldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkUGxheUluZGV4XTt9XG5cbiAgICAvKiBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBnYW1lXG4gICAgLy8gY2FuIGJlIHNldCBkaXJlY3RseSB3aGVuIGEgYmV0dGVyICdyaWsnIHZhcmlhdGlvbiBiaWQgd2FzIGRvbmUhISEhXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgXG4gICAgLy8gVE9ETyBpdCB3b3VsZCBiZSBlYXNpZXIgdG8gY29tYmluZSB0aGVzZSBpbiBhIGNhcmQhISEhXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG5cbiAgICAvLyBjYWxsZWQgZnJvbSB0aGUgVUkgdG8gc2V0IHRoZSB0cnVtcCBzdWl0ZSEhISFcbiAgICBzZXQgdHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXt0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKCk7fVxuICAgIHNldCBwYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMucGFydG5lclN1aXRlQ2hvc2VuKCk7fVxuICAgICovXG5cbiAgICAvLyBlbmQgb2YgZ2V0dGVycy9zZXR0ZXJzIHVzZWQgYnkgdGhlIGdhbWVcbiAgICBfcmVtb3ZlQ2FyZHMoKXt3aGlsZSh0aGlzLl9jYXJkcy5sZW5ndGg+MCl0aGlzLl9jYXJkcy5zaGlmdCgpLmhvbGRlcj1udWxsO31cblxuICAgIGdldCBnYW1lKCl7cmV0dXJuIHRoaXMuX2dhbWU7fVxuICAgIHNldCBnYW1lKGdhbWUpe1xuICAgICAgICBpZih0aGlzLl9nYW1lPT09Z2FtZSlyZXR1cm47XG4gICAgICAgIGlmKGdhbWUmJiEoZ2FtZSBpbnN0YW5jZW9mIFBsYXllckdhbWUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZSBpbnN0YW5jZSBzdXBwbGllZCB0byBwbGF5ZXIgXCIrKHRoaXMubmFtZXx8XCI/XCIpK1wiIG5vdCBvZiB0eXBlIFBsYXllckdhbWUuXCIpO1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gaW5kZXggb2YgcGxheWVyIFwiKyh0aGlzLm5hbWV8fFwiP1wiKStcIiB1bmtub3duIVwiKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gTURIQDExSkFOMjAyMDogaWYgdGhlIGdhbWUgY2hhbmdlcyB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBjYXJkc1xuICAgICAgICB0aGlzLl9nYW1lPWdhbWU7XG4gICAgICAgIC8vIHN5bmMgX2luZGV4XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgLy8gcHJlcGFyZSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5wYXJ0bmVyPS0xOyAvLyBteSBwYXJ0bmVyIChvbmNlIEkgbm93IHdobyBpdCBpcylcbiAgICAgICAgICAgIHRoaXMudHJpY2tzV29uPVtdOyAvLyBzdG9yaW5nIHRoZSB0cmlja3Mgd29uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaW5kZXgoKXtyZXR1cm4gdGhpcy5faW5kZXg7fSAvLyBNREhAMjJKQU4yMDIwOiBubyBoYXJtIGluIGFkZGluZyBhIGdldHRlciEhIVxuICAgIHNldCBpbmRleChpbmRleCl7dGhpcy5faW5kZXg9aW5kZXg7fSAvLyBNREhAMDlKQU4yMDIwOiBzb21ldGltZXMgYW4gaW5kZXggY2FuIGJlIHNldCBzZXBhcmF0ZWx5XG5cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIHRoZSBnYW1lIHBsYXllZCBhdCBpbmRleCBcIitpbmRleCtcIi5cIik7XG4gICAgICAgIHRoaXMuaW5kZXg9aW5kZXg7XG4gICAgICAgIHRoaXMuZ2FtZT1nYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgcmVnaXN0ZXJlZCFcIik7XG4gICAgfVxuICAgIC8qXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgc3VwZXIuYWRkQ2FyZChjYXJkKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMrXCInIHJlY2VpdmVkIGNhcmQgJ1wiK2NhcmQrXCInLlwiKTtcbiAgICB9XG4gICAgKi9cbiAgICBfZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSx3aGVuTm90Rm91bmRDYXJkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybihjYXJkLnN1aXRlPT1jYXJkU3VpdGUpO30pO1xuICAgIH1cblxuICAgIF9nZXRTdWl0ZUNhcmRzKCl7XG4gICAgICAgIHRoaXMubG9nKFwiRGV0ZXJtaW5pbmcgc3VpdGUgY2FyZHMgb2YgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzIVwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZHM9W1tdLFtdLFtdLFtdXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntzdWl0ZUNhcmRzW2NhcmQuc3VpdGVdLnB1c2goY2FyZCk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZUNhcmRzO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBvZiBhIGdpdmVuIGNhcmQgc3VpdGUgKG9yIGFueSBjYXJkIGlmIGNhcmRTdWl0ZSBpcyB1bmRlZmluZWQpXG4gICAgY29udHJpYnV0ZVRvVHJpY2sodHJpY2spIHtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPT0wKXRocm93IG5ldyBFcnJvcihcIk5vIGNhcmRzIGxlZnQgdG8gcGxheSFcIik7XG4gICAgICAgIGxldCBjYXJkc09mU3VpdGU9dGhpcy5fZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSk7XG4gICAgICAgIGxldCBjYXJkPShjYXJkc09mU3VpdGUmJmNhcmRzT2ZTdWl0ZS5sZW5ndGg+MD9jYXJkc09mU3VpdGVbMF06dGhpcy5fY2FyZHNbMF0pO1xuICAgICAgICBjYXJkLmhvbGRlcj10cmljazsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGUgdHJpY2tcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIG1hZGUgYSBiaWRcbiAgICBfYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycykgLy8gY2F0Y2ggYW55IGVycm9yIHRocm93biBieSBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5eyghZXZlbnRMaXN0ZW5lcnx8ZXZlbnRMaXN0ZW5lci5iaWRNYWRlKHRoaXMuX2JpZCkpO31jYXRjaChlcnJvcil7fX0pO1xuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2luZyBiaWQgXCIrdGhpcy5fYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyB0byB0aGUgZ2FtZSFcIik7XG4gICAgICAgICAgICB0aGlzLl9nYW1lLmJpZE1hZGUodGhpcy5fYmlkKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IE5vIGdhbWUgdG8gcGFzcyBiaWQgXCIrdGhpcy5fYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJy5cIik7XG4gICAgfVxuICAgIF9zZXRCaWQoYmlkKXt0aGlzLl9iaWRNYWRlKHRoaXMuX2JpZD1iaWQpO31cblxuICAgIF9jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e2V2ZW50TGlzdGVuZXIuY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLmNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgfVxuICAgIC8vIFRPRE8gYSBiaWQgc2V0dGVyIHdpbGwgYWxsb3cgc3ViY2xhc3NlcyB0byBwYXNzIGEgYmlkIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5XG4gICAgX3NldENhcmQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHBsYXllZCBjYXJkIGlzIHZhbGlkIHNob3VsZCBiZSBkb25lIGhlcmUsIG9yIEJFRk9SRSBjYWxsaW5nIHNldENhcmRcbiAgICAgICAgdGhpcy5fY2FyZFBsYXllZCh0aGlzLl9jYXJkPWNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvb3NlbiBhIHRydW1wIHN1aXRlXG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci50cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLnRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpe3RoaXMudHJ1bXBTdWl0ZUNob3Nlbih0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGUpO31cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvc2VuIGEgcGFydG5lclxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl0aGlzLl9nYW1lLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5wYXJ0bmVyU3VpdGVDaG9zZW4odGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZSk7fVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIG1ha2UgYSBiaWQgcGFzc2luZyBpbiB0aGUgaGlnaGVzdCBiaWQgc28gZmFyXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIG1ha2VBQmlkKHBsYXllcmJpZHMpe1xuICAgICAgICAvLyBhc3N1bWVzIHRoYXQgdGhpcyBwbGF5ZXIgaGFzIG1hZGUgYSBiaWQgYmVmb3JlLCBvciB0aGF0IHRoaXMgaXMgdGhlIGZpcnN0IGJpZFxuICAgICAgICAvLyB0aGlzIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYXNzdW1lcyB0byBiZSBydW5uaW5nIGluIGEgYnJvd3NlciBzbyB3ZSBjYW4gdXNlIHByb21wdCgpXG4gICAgICAgIC8vIGFsbCBvdGhlciBhdmFpbGFibGUgYmlkcyBzaG91bGQgYmUgYmV0dGVyIHRoYW4gdGhlIGxhc3QgYmlkIGJ5IGFueSBvdGhlciBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRTb0Zhcj1QbGF5ZXJHYW1lLkJJRF9QQVM7XG4gICAgICAgIGlmKHBsYXllcmJpZHMpe1xuICAgICAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgYmlkczpcIixwbGF5ZXJiaWRzKTtcbiAgICAgICAgICAgIGZvcihsZXQgcGxheWVyPTA7cGxheWVyPHBsYXllcmJpZHMubGVuZ3RoO3BsYXllcisrKVxuICAgICAgICAgICAgICAgIGlmKHBsYXllcmJpZHNbcGxheWVyXS5sZW5ndGg+MCYmcGxheWVyYmlkc1twbGF5ZXJdWzBdPmhpZ2hlc3RCaWRTb0ZhcilcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdEJpZFNvRmFyPXBsYXllcmJpZHNbcGxheWVyXVswXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZyhcIkhpZ2hlc3QgYmlkIHNvIGZhcjogJ1wiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0rXCInLlwiKTtcbiAgICAgICAgLy8gaWYgdGhlIGhpZ2hlc3QgcG9zc2libGUgYmlkIGlzIG5vdCBhIGJpZCBhbGwgY2FuIHBsYXkgKGF0IHRoZSBzYW1lIHRpbWUpLCBjYW4ndCBiZSBiaWQgYWdhaW5cbiAgICAgICAgaWYoUGxheWVyR2FtZS5CSURTX0FMTF9DQU5fUExBWS5pbmRleE9mKFBsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0pPDApaGlnaGVzdEJpZFNvRmFyKys7XG4gICAgICAgIGxldCBwb3NzaWJsZUJpZE5hbWVzPVBsYXllckdhbWUuQklEX05BTUVTLnNsaWNlKGhpZ2hlc3RCaWRTb0Zhcik7XG4gICAgICAgIHBvc3NpYmxlQmlkTmFtZXMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1tQbGF5ZXJHYW1lLkJJRF9QQVNdKTsgLy8gdXNlciBjYW4gYWx3YXlzICdwYXMnXG4gICAgICAgIHRoaXMubG9nKFwiUG9zc2libGUgYmlkczogXCIscG9zc2libGVCaWROYW1lcyk7XG4gICAgICAgIGxldCBiaWQ9LTE7XG4gICAgICAgIHdoaWxlKGJpZDwwKXtcbiAgICAgICAgICAgIGxldCBiaWRuYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBpcyB5b3VyIGJpZCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQmlkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZUJpZE5hbWVzWzBdKTtcbiAgICAgICAgICAgIGJpZD1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5pbmRleE9mKGJpZG5hbWUpO1xuICAgICAgICAgICAgaWYoYmlkPDApY29udGludWU7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0QmlkKGJpZCk7XG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGJpZD0tMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgLy8gaWYgdGhpcyBwbGF5ZXIgaGFzIGFsbCBhY2VzIGl0J3MgZ29ubmEgYmUgdGhlIHN1aXRlIG9mIGEga2luZyB0aGUgcGVyc29uIGhhc24ndFxuICAgICAgICAvLyBhbHNvIGl0IG5lZWRzIHRvIGJlIGFuIGFjZSBvZiBhIHN1aXRlIHRoZSB1c2VyIGhhcyBpdHNlbGYgKHVubGVzcyB5b3UgaGF2ZSBhbGwgb3RoZXIgYWNlcylcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgLy8gYW55IG9mIHRoZSBzdWl0ZXMgaW4gdGhlIGNhcmRzIGNhbiBiZSB0aGUgdHJ1bXAgc3VpdGUhXG4gICAgICAgIGxldCBwb3NzaWJsZVRydW1wU3VpdGVOYW1lcz10aGlzLmdldFN1aXRlcygpLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUodHJ1bXBTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCB0cnVtcE5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IHN1aXRlIHdpbGwgYmUgdHJ1bXAgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHRydW1wU3VpdGU9cG9zc2libGVUcnVtcFN1aXRlTmFtZXMuaW5kZXhPZih0cnVtcE5hbWUpO1xuICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB0cnVtcFN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBhc2tzIGZvciB0aGUgc3VpdGUgb2YgdGhlIHBhcnRuZXIgY2FyZCBvZiB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGNob29zZVBhcnRuZXJTdWl0ZSgpe1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPVJBTktfQUNFO1xuICAgICAgICAvLyBnZXQgYWxsIHRoZSBhY2VsZXNzIHN1aXRlc1xuICAgICAgICBsZXQgc3VpdGVzPXRoaXMuZ2V0U3VpdGVzKCk7XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg9PTApeyAvLyBwbGF5ZXIgaGFzIEFMTCBhY2VzXG4gICAgICAgICAgICBpZihzdWl0ZXMubGVuZ3RoPDQpeyAvLyBidXQgbm90IGFsbCBzdWl0ZXNcbiAgICAgICAgICAgICAgICAvLyBhbGwgdGhlIHN1aXRzIHRoZSB1c2VyIGRvZXMgbm90IGhhdmUgYXJlIGFsbG93ZWQgKGFza2luZyB0aGUgYWNlIGJsaW5kISEhKVxuICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz1bMCwxLDIsM10uZmlsdGVyKChzdWl0ZSk9PntyZXR1cm4gcG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2Yoc3VpdGUpPDA7fSk7XG4gICAgICAgICAgICB9ZWxzZXsgLy8gaGFzIGFsbCBzdWl0cywgc28gYSBraW5nIGlzIHRvIGJlIHNlbGVjdGVkISEhXG4gICAgICAgICAgICAgICAgLy8gYWxsIGtpbmdzIGFjY2VwdGFibGUgZXhjZXB0IGZvciB0aGF0IGluIHRoZSB0cnVtcCBjb2xvclxuICAgICAgICAgICAgICAgIC8vIE5PVEUgaWYgYSBwZXJzb24gYWxzbyBoYXMgYWxsIHRoZSBraW5ncyB3ZSBoYXZlIGEgc2l0dWF0aW9uLCB3ZSBzaW1wbHkgY29udGludWUgb253YXJkXG4gICAgICAgICAgICAgICAgd2hpbGUoMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rLS07XG4gICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRydW1wU3VpdGVJbmRleD1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZih0aGlzLl90cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZUluZGV4Pj0wKXBvc3NpYmxlUGFydG5lclN1aXRlcy5zcGxpY2UodHJ1bXBTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPjApYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzPXBvc3NpYmxlUGFydG5lclN1aXRlcy5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUocGFydG5lclN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZU5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IFwiK0NhcmQuQ0FSRF9OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua10rXCIgc2hvdWxkIHlvdXIgcGFydG5lciBoYXZlIChvcHRpb25zOiAnXCIrcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgcGFydG5lclN1aXRlPXBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuaW5kZXhPZihwYXJ0bmVyU3VpdGVOYW1lKTtcbiAgICAgICAgICAgIGlmKHBhcnRuZXJTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBwYXJ0bmVyKHBhcnRuZXIpe3RoaXMuX3BhcnRuZXI9KHR5cGVvZiBwYXJ0bmVyPT09J251bWJlcic/cGFydG5lcjotMSk7fSAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIGFuZCBhZGQgaXQgdG8gdGhlIGdpdmVuIHRyaWNrXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIHBsYXlBQ2FyZCh0cmljayl7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGFza2VkIHRvIHBsYXkgYSBjYXJkLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHVzaW5nIHRoZSBmaXJzdCBsZXR0ZXJzIG9mIHRoZSBhbHBoYWJldD9cbiAgICAgICAgbGV0IHBvc3NpYmxlQ2FyZE5hbWVzPVtdO1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBwb3NzaWJsZUNhcmROYW1lcy5wdXNoKFN0cmluZy5jYXJkSW5kZXgrMSkrXCI6IFwiK3RoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGxldCBjYXJkUGxheUluZGV4PS0xO1xuICAgICAgICB3aGlsZShjYXJkUGxheUluZGV4PDApe1xuICAgICAgICAgICAgLy8gd2UncmUgc3VwcG9zZWQgdG8gcGxheSBhIGNhcmQgd2l0aCBzdWl0ZSBlcXVhbCB0byB0aGUgZmlyc3QgY2FyZCB1bmxlc3MgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBpcyBiZWluZyBhc2tlZCBmb3JcbiAgICAgICAgICAgIGxldCBjYXJkSWQ9cGFyc2VJbnQocHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIlxcblByZXNzIHRoZSBpZCBvZiB0aGUgY2FyZCB5b3Ugd2FudCB0byBhZGQgdG8gXCIrdHJpY2suZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUNhcmROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLFwiXCIpKTtcbiAgICAgICAgICAgIGlmKGlzTmFOKGNhcmRJZCkpY29udGludWU7XG4gICAgICAgICAgICBjYXJkUGxheUluZGV4PWNhcmRJZC0xO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENhcmQodGhpcy5fY2FyZHNbY2FyZFBsYXlJbmRleF0pO1xuICAgIH1cblxuICAgIHRyaWNrV29uKHRyaWNrSW5kZXgpe1xuICAgICAgICB0aGlzLl90cmlja3NXb24ucHVzaCh0cmlja0luZGV4KTtcbiAgICAgICAgdGhpcy5sb2coXCJUcmljayAjXCIrdHJpY2tJbmRleCtcIiB3b24gYnkgJ1wiK3RoaXMubmFtZStcIic6IFwiK3RoaXMuX3RyaWNrc1dvbitcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IG51bWJlck9mVHJpY2tzV29uKCl7cmV0dXJuIHRoaXMuX3RyaWNrc1dvbi5sZW5ndGg7fVxuICAgIFxuICAgIGdldE51bWJlck9mVHJpY2tzV29uKCl7XG4gICAgICAgIC8vIHJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIHRyaWNrcyB3b24gKGluY2x1ZGluZyB0aG9zZSBieSB0aGUgcGFydG5lciAoaWYgYW55KSlcbiAgICAgICAgcmV0dXJuKHRoaXMubnVtYmVyT2ZUcmlja3NXb24rdGhpcy5fZ2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHRoaXMucGFydG5lcikpO1xuICAgIH1cblxuICAgIHNldE51bWJlck9mVHJpY2tzVG9XaW4obnVtYmVyT2ZUcmlja3NUb1dpbil7dGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj1udW1iZXJPZlRyaWNrc1RvV2luO31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NUb1dpbigpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luO31cbiAgICBcbiAgICAvLyBldmVyeSBwbGF5ZXIgY2FuIGJlIGNoZWNrZWQgd2hldGhlciBmcmllbmQgKDEpIG9yIGZvbyAoLTEpIG9yIHVua25vd24gKDApXG4gICAgaXNGcmllbmRseShwbGF5ZXIpe1xuICAgICAgICBpZihwbGF5ZXI9PT10aGlzLl9pbmRleClyZXR1cm4gMjsgLy8gSSdtIG11Y2hvIGZyaWVuZGx5IHRvIG15c2VsZlxuICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCk7XG4gICAgICAgIGlmKHBhcnRuZXJTdWl0ZT49MCl7IC8vIGEgbm9uLXNvbGl0YXJ5IGdhbWVcbiAgICAgICAgICAgIC8vIEFTU0VSVCBub3QgYSBzb2xpdGFyeSBnYW1lIHNvIHBsYXllciBjb3VsZCBiZSB0aGUgcGFydG5lciBpbiBjcmltZVxuICAgICAgICAgICAgLy8gaWYgcGFydG5lciBpcyBrbm93biAoaS5lLiB0aGUgcGFydG5lciBjYXJkIGlzIG5vIGxvbmdlciBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXI+PTApcmV0dXJuKHBsYXllcj09PXRoaXMuX3BhcnRuZXI/MTotMSk7IFxuICAgICAgICAgICAgLy8gQVNTRVJUIHBhcnRuZXIgdW5rbm93biAoaS5lLiBwYXJ0bmVyIGNhcmQgc3RpbGwgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBsZXQgdHJ1bXBQbGF5ZXI9dGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpO1xuICAgICAgICAgICAgLy8gaWYgSSdtIHRoZSB0cnVtcCBwbGF5ZXIsIGFzc3VtZSBBTEwgdW5mcmllbmRseSBCVVQgbm8gSSBkb24ndCBrbm93IHdobyBteSBwYXJ0bmVyIGlzIGFsbCBjb3VsZCBiZVxuICAgICAgICAgICAgaWYodGhpcy5faW5kZXg9PT10cnVtcFBsYXllcilyZXR1cm4gMDsgLy8gdW5rbm93blxuICAgICAgICAgICAgaWYodGhpcy5jb250YWluc0NhcmQocGFydG5lclN1aXRlLHRoaXMuX2dhbWUuZ2V0UGFydG5lclJhbmsoKSkpIC8vIEkgaGF2ZSB0aGUgcGFydG5lciBjYXJkXG4gICAgICAgICAgICAgICAgcmV0dXJuKHBsYXllcj09dHJ1bXBQbGF5ZXI/MTotMSk7IC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZnJpZW5kbHksIHRoZSBvdGhlcnMgYXJlIHVuZnJpZW5kbHlcbiAgICAgICAgICAgIC8vIEFTU0VSVCBJJ20gbm90IHRoZSB0cnVtcCBwbGF5ZXIsIGFuZCBJJ20gbm90IHdpdGggdGhlIHRydW1wIHBsYXllciBhcyB3ZWxsXG4gICAgICAgICAgICAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZvbywgdGhlIHJlc3QgSSBkb24ndCBrbm93IHlldFxuICAgICAgICAgICAgcmV0dXJuKHBsYXllcj09PXRydW1wUGxheWVyPy0xOjApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFTU0VSVCBhIHNvbGl0YXJ5IGdhbWVcbiAgICAgICAgLy8gaWYgSSdtIG9uZSBvZiB0aGUgc29saXRhcnkgcGxheWVycywgZXZlcnlvbmUgZWxzZSBpcyBhIGZvb1xuICAgICAgICBpZih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZih0aGlzLl9pbmRleCk+PTApcmV0dXJuIC0xO1xuICAgICAgICAvLyBBU1NFUlQgbm90IG9uZSBvZiB0aGUgc29saXRhcnkgcGxheWVyc1xuICAgICAgICAvLyAgICAgICAgaWYgcGxheWVyIGlzIGEgc29saXRhcnkgcGxheWVyIGl0J3MgYSBmb28sIG90aGVyd2lzZSBpdCdzIHVzIGFnYWluc3QgdGhlbSEhISFcbiAgICAgICAgcmV0dXJuKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHBsYXllcik+PTA/LTE6MSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gdGhpcy5uYW1lO31cblxufVxuXG4vLyBleHBvcnQgdGhlIFBsYXllciBjbGFzc1xubW9kdWxlLmV4cG9ydHM9e1BsYXllckV2ZW50TGlzdGVuZXIsUGxheWVyR2FtZSxQbGF5ZXJ9OyIsImNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7IC8vIGZvciBjb21wYXJpbmcgY2FyZHNcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbmNsYXNzIFRyaWNrIGV4dGVuZHMgQ2FyZEhvbGRlcntcblxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IGdhbWUgZGF0YSBtb3ZlZCBvdmVyIHRvIFBsYXllckdhbWUgaW5zdGFuY2UgKGFzIHBhc3NlZCB0byBlYWNoIHBsYXllcilcbiAgICAvLyAgICAgICAgICAgICAgICBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCBibGluZCBub3cgZGV0ZXJtaW5lZCBieSB0aGUgZ2FtZSAoZW5naW5lKSBpdHNlbGZcblxuICAgIC8vIGJ5IHBhc3NpbmcgaW4gdGhlIHRydW1wIHBsYXllciAoaS5lLiB0aGUgcGVyc29uIHRoYXQgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZClcbiAgICBjb25zdHJ1Y3RvcihmaXJzdFBsYXllcix0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayxjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCxmaXJzdFBsYXllckNhblBsYXlTcGFkZXMpeyAvLyByZXBsYWNpbmc6IHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLHRydW1wUGxheWVyKXtcbiAgICAgICAgc3VwZXIoKTsgLy8gdXNpbmcgNCBmaXhlZCBwb3NpdGlvbnMgZm9yIHRoZSB0cmljayBjYXJkcyBzbyB3ZSB3aWxsIGtub3cgd2hvIHBsYXllZCB0aGVtISEhIVxuICAgICAgICB0aGlzLl9maXJzdFBsYXllcj1maXJzdFBsYXllcjtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlOyAvLyBmb3IgaW50ZXJuYWwgdXNlIHRvIGJlIGFibGUgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXIgb2YgYSB0cmlja1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMuX3BhcnRuZXJSYW5rPXBhcnRuZXJSYW5rOyAvLyBuZWVkIHRoaXMgd2hlbiBpdCdzIGJlaW5nIGFza2VkIHRvIGRldGVybWluZSB0aGUgd2lubmVyXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPWNhbkFza0ZvclBhcnRuZXJDYXJkOyAvLyAtMSBibGluZCwgMCBub3QsIDEgbm9uLWJsaW5kXG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIHRoZSAnZmxhZycgc2V0IGJ5IHRoZSB0cnVtcCBwbGF5ZXIgd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gYSB0cmlja1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9LTE7IC8vIHRoZSBzdWl0ZSBvZiB0aGUgdHJpY2sgKG1vc3Qgb2YgdGhlIHRpbWUgdGhlIHN1aXRlIG9mIHRoZSBmaXJzdCBjYXJkKVxuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPS0xOyAvLyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIChub3RlOiBOT1QgdHJhbnNmb3JtZWQgdG8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggeWV0KVxuICAgICAgICB0aGlzLl9maXJzdFBsYXllckNhblBsYXlTcGFkZXM9Zmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO1xuICAgICAgICAvLyBsZXQncyBrZWVwIHRyYWNrIG9mIHRoZSBoaWdoZXN0IGNhcmRcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGNhbiBhc2sgZm9yIHBhcnRuZXIgY2FyZDogXCIrY2FuQXNrRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlczogXCIrZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcygpe3JldHVybiB0aGlzLl9maXJzdFBsYXllckNhblBsYXlTcGFkZXM7fVxuICAgIFxuICAgIC8vIHRoZSB3aW5uZXIgZXhwb3NlZCBpcyB0aGUgYWN0dWFsIHBsYXllciB3aG8gd29uXG4gICAgZ2V0IHdpbm5lcigpe3JldHVybih0aGlzLl93aW5uZXJDYXJkPDA/LTE6KHRoaXMuX3dpbm5lckNhcmQrdGhpcy5fZmlyc3RQbGF5ZXIpJTQpO31cbiAgICBcbiAgICAvLyBNREhAMDdERUMyMDE5OiBtb3ZlZCBmcm9tIGhlcmUgdG8gdGhlIGdhbWUgKGFzIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAgICAvKlxuICAgIGdldCB0cnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9IC8vIGV4cG9zZXMgdGhlIGN1cnJlbnQgdHJ1bXAgcGxheWVyXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG4gICAgKi9cbiAgICBnZXQgYXNraW5nRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ7fVxuXG4gICAgLy8gcGFzcyBpbiAtMSB3aGVuIGFza2luZyB0aGUgcGFydG5lciBjYXJkIGJsaW5kLCBvciArMSB3aGVuIGFza2luZyBmb3IgaXQgKG5vbi1ibGluZClcbiAgICBzZXQgYXNraW5nRm9yUGFydG5lckNhcmQoYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0eXBlb2YgYXNraW5nRm9yUGFydG5lckNhcmQhPT1cIm51bWJlclwiKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEFza2luZyBmb3IgcGFydG5lciBjYXJkIE5PVCBkZWZpbmVkIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5udW1iZXJPZkNhcmRzPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGdldmVuIGRlIHBhcnRuZXIgYWFzL2hlZXIgKGJsaW5kKSB0ZSB2cmFnZW4gbmlldCBtZWVyIHRvZWdlc3RhYW4uXCIpO1xuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBzZXQgdG8gXCIrdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIF9zZXRXaW5uZXJDYXJkKHdpbm5lckNhcmQpe1xuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPXdpbm5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJpY2sgd2lubmVyIGNhcmQ6IFwiK3dpbm5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGNhcmQgcGxheWVkIGJ5ICh0aGUgYWN0dWFsKSBwbGF5ZXIgKGFzIHVzZWQgZm9yIHNob3dpbmcgdGhlIHRyaWNrIGNhcmRzKVxuICAgICAqIEBwYXJhbSB7Kn0gcGxheWVyIFxuICAgICAqL1xuICAgIGdldFBsYXllckNhcmQocGxheWVyKXtcbiAgICAgICAgbGV0IHBsYXllckNhcmQ9KHRoaXMuX2ZpcnN0UGxheWVyPj0wPyhwbGF5ZXIrNC10aGlzLl9maXJzdFBsYXllciklNDpudWxsKTtcbiAgICAgICAgcmV0dXJuKHBsYXllckNhcmQ+PTAmJnBsYXllckNhcmQ8dGhpcy5udW1iZXJPZkNhcmRzP3RoaXMuX2NhcmRzW3BsYXllckNhcmRdOm51bGwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgYXNraW5nRm9yUGFydG5lckNhcmQoKXtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgIGlmKCF0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZEJsaW5kKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCAoYW55bW9yZSkuXCIpO1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9dGhpcy5fdHJ1bXBTdWl0ZTsgLy8gdGhlIHBsYXkgc3VpdGUgYmVjb21lcyB0aGUgdHJ1bXAgc3VpdGVcbiAgICB9XG4gICAgKi9cbiAgICAvLyBOT1RFIGFkZENhcmQgaXMgTk9UIF9hZGRDYXJkIG9mIHRoZSBzdXBlcmNsYXNzISB0aGlzIGlzIGJlY2F1c2Ugd2Ugc2hvdWxkIHNldCB0aGUgaG9sZGVyIG9uIHRoZSBjYXJkIHRvIGFkZCEhISFcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgICAvLyBpZiB0aGUgZmxhZyBvZiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgaXMgc2V0LCBwcmVzZXQgdGhlIFxuICAgICAgICBjYXJkLmhvbGRlcj10aGlzOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoaXMgdHJpY2sgYnkgc2V0dGluZyB0aGUgaG9sZGVyIHByb3BlcnR5ICh3aWxsIHRha2UgY2FyZSBvZiBhZGRpbmcvcmVtb3ZpbmcgdGhlIGNhcmQpXG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkczw9bnVtYmVyT2ZDYXJkc05vdylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBhZGQgdGhlIGNhcmQgdG8gdGhlIHRyaWNrLlwiKTtcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQgYWRkZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLl90cnVtcFN1aXRlPDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IEFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCwgYnV0IHBsYXlpbmcgYSBnYW1lIHdpdGhvdXQgdHJ1bXAuXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IgYmxpbmQgZXZlcnlvbmUgaGFzIHRvIHBsYXkgdGhlIHBhcnRuZXIgY2FyZCBzdWl0ZVxuICAgICAgICAvLyBNREhAMDlERUMyMDE5OiBPT1BTIEkgd2FzIGFscmVhZHkgdXNpbmcgdGhpcy5fcGFydG5lclN1aXRlIGhlcmUgQlVUIHN0aWxsIGFmdGVyIGFjdHVhbGx5IHRha2luZyBpdCBvdXQgKG5vdyBpbiBhZ2FpbilcbiAgICAgICAgaWYodGhpcy5fcGxheVN1aXRlPDApeyAvLyBmaXJzdCBjYXJkIGJlaW5nIHBsYXllZFxuICAgICAgICAgICAgLy8gTURIQDE4SkFOMjAyMDogYXNjZXJ0YWluIHRoYXQgX2Fza2luZ0ZvclBhcnRuZXJDYXJkIGhhcyB0aGUgcmlnaHQgdmFsdWVcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IGNvdWxkIGJlIDAgYnV0IHdoZW4gdGhlIHBhcnRuZXIgc3VpdGUgaXMgcGxheWVkIHRoZSBwbGF5ZXIgSVMgYXNraW5nXG4gICAgICAgICAgICBpZih0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9PTApeyAvLyBwbGF5ZXIgc3VwcG9zZWRseSBjYW4gc3RpbGwgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8PTAmJmNhcmQuc3VpdGU9PT10aGlzLl9wYXJ0bmVyU3VpdGUpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDwwKXRocm93IG5ldyBFcnJvcihcIkJVRzogQ2Fubm90IGFzayB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJJbXBsaWNpdGx5IGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBieSBwbGF5aW5nIHRoZSBwYXJ0bmVyIHN1aXRlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PTApXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgd2hlbiB5b3UgY2FuJ3QgYXNrIGZvciBpdCBhbnltb3JlIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0odGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MD90aGlzLl9wYXJ0bmVyU3VpdGU6Y2FyZC5zdWl0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIHRoaXMuX3BsYXlTdWl0ZSBub3cgZGVmaW5pdGVseSBub24tbmVnYXRpdmUsIHNvXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPTA7IC8vIHVzZSB0aGUgcmlnaHQgcHJvcGVydHkgYnJvJ1xuICAgICAgICAvLyB1cGRhdGUgd2lubmVyXG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHNOb3c+MCl7XG4gICAgICAgICAgICAvLyBNREhAMDlERUMyMDE5OiB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBvbmx5IHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGV2ZXIgd2luIChldmVuIGlmIHRoZXJlJ3MgdHJ1bXAhISlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJ1dCB3ZSBuZWVkIHRvIGtub3cgd2hldGhlciB0aGUgcGFydG5lciBjYXJkIHdhcyBhbHJlYWR5IHRocm93blxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgU09MVVRJT046IChORUFUKSBpdCdzIGVhc2llc3QgdG8gc2ltcGx5IGlnbm9yZSB0cnVtcCBpcyB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciEhISEhIVxuICAgICAgICAgICAgaWYoQ2FyZC5jb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZCx0aGlzLl9jYXJkc1t0aGlzLl93aW5uZXJDYXJkXSx0aGlzLl9wbGF5U3VpdGUsKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wPy0xOnRoaXMuX3RydW1wU3VpdGUpKT4wKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQobnVtYmVyT2ZDYXJkc05vdyk7XG4gICAgICAgIH1lbHNlIC8vIGFmdGVyIHRoZSBmaXJzdCBjYXJkIHRoZSBmaXJzdCBwbGF5ZXIgaXMgdGhlIHdpbm5lciBvZiBjb3Vyc2VcbiAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQoMCk7XG4gICAgfVxuICAgIGdldENhcmRQbGF5ZXIoc3VpdGUscmFuayl7XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMuX2NhcmRzLmxlbmd0aDtjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzW2NhcmRJbmRleF0uc3VpdGU9PT1zdWl0ZSYmdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5yYW5rPT09cmFuaylcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZpcnN0UGxheWVyK2NhcmRJbmRleCklNDsgLy8gVE9ETyBjYW4gd2UgYXNzdW1lIDQgcGxheWVycyBpbiB0b3RhbD8/Pz8/XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgZ2V0dGVyc1xuICAgIGdldCBwbGF5U3VpdGUoKXtyZXR1cm4gdGhpcy5fcGxheVN1aXRlO31cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgLypcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICAqL1xuICAgIGdldCBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDt9XG59XG5cbm1vZHVsZS5leHBvcnRzPVRyaWNrO1xuIiwiLyoqXG4gKiB0aGUgcGFydCB0aGF0IHJ1bnMgaW4gdGhlIGJyb3dzZXIgb2YgYSBzaW5nbGUgcGxheWVyXG4gKiBnaXZlbiB0aGF0IGFueSBpbmZvcm1hdGlvbiB0byB0aGUgY3VycmVudCBwbGF5ZXIgb2YgdGhlIGdhbWUgc2hvdWxkIGJlIGF2YWlsYWJsZSB0aHJvdWdoIGl0J3MgX2dhbWUgcHJvcGVydHkgKGkuZS4gYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICogYWxsIGNhbGxzIGluIG1haW4uanMgdG8gcmlra2VuVGhlR2FtZSBkaXJlY3RseSBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCBjYWxscyB0byBjdXJyZW50UGxheWVyLmdhbWUgaS5lLiByaWtrZW5UaGVHYW1lIGl0c2VsZiBpcyBubyBsb25nZXIgYXZhaWxhYmxlIHRvIHRoZSBjdXJyZW50UGxheWVyISEhXG4gKiBcbioqL1xuLy8gd2UnbGwgYmUgdXNpbmcgUGxheWVyLmpzIG9ubHkgKFBsYXllci5qcyB3aWxsIGRlYWwgd2l0aCByZXF1aXJpbmcgQ2FyZEhvbGRlciwgYW5kIENhcmRIb2xkZXIgQ2FyZClcbi8vIE5PIEkgbmVlZCB0byByZXF1aXJlIHRoZW0gYWxsIG90aGVyd2lzZSBicm93c2VyaWZ5IHdvbid0IGJlIGFibGUgdG8gZmluZCBDYXJkLCBldGMuXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcbmNvbnN0IFRyaWNrPXJlcXVpcmUoJy4vVHJpY2suanMnKTsgLy8gbm93IGluIHNlcGFyYXRlIGZpbGVcbmNvbnN0IHtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfT1yZXF1aXJlKCcuL1BsYXllci5qcycpO1xuXG5jbGFzcyBMYW5ndWFnZXtcbiAgICBzdGF0aWMgZ2V0IERFRkFVTFRfUExBWUVSUygpe3JldHVybiBbW1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIl0sW1wiTWFyY1wiLFwiSnVyZ2VuXCIsXCJNb25pa2FcIixcIkFubmFcIixcIlwiXV07fTtcbiAgICAvLyBwb3NzaWJsZSByYW5rcyBhbmQgc3VpdGVzIChpbiBEdXRjaClcbiAgICBzdGF0aWMgZ2V0IERVVENIX1JBTktfTkFNRVMoKXtyZXR1cm4gW1widHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImJvZXJcIixcInZyb3V3XCIsXCJoZWVyXCIsXCJhYXNcIl07fTtcbiAgICBzdGF0aWMgZ2V0IERVVENIX1NVSVRFX05BTUVTKCl7cmV0dXJuIFtcInJ1aXRlblwiLFwia2xhdmVyZW5cIixcImhhcnRlblwiLFwic2Nob3BwZW5cIl07fTtcbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpe3JldHVybihzdHI/KHN0ci5sZW5ndGg/c3RyWzBdLnRvVXBwZXJDYXNlKCkrc3RyLnNsaWNlKDEpOlwiXCIpOlwiP1wiKTt9XG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGluZyBlbnRlcmluZyB0aGUgaWQgb2YgdGhlIHVzZXIgb24gcGFnZS1zZXR0aW5ncywgc28gd2UgZG8gbm90IG5lZWQgdG8gaW5zZXJ0IGEgbmV3IG9uZVxuLy8gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVseSB3ZSBjYW4gZG8gdGhhdCBvbiBhIHNlcGFyYXRlIHBhZ2UgLyBwYWdlLWF1dGggaXMgT0tcbi8vICAgICAgICAgICAgICAgIHdlIGdvIHRvIHBhZ2UtYXV0aCB3aGVuIE5PVCBwbGF5aW5nIHRoZSBnYW1lIGluIGRlbW8gbW9kZSEhIVxuLy8gICAgICAgICAgICAgICAgaW4gbm9uLWRlbW8gbW9kZSB5b3UgaWRlbnRpZnkgeW91cnNlbGYsIHRoZW4gd2hlbiBzZXRQbGF5ZXJOYW1lIGlzIHN1Y2Nlc3NmdWwgZ28gdG8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4vLyBNREhAMTBKQU4yMDIwOiByZW1vdmluZyBwYWdlLXNldHRpbmdzIGFuZCBwYWdlLXNldHVwLWdhbWUsIGFkZGluZyBwYWdlLWhlbHBcbmNvbnN0IFBBR0VTPVtcInBhZ2UtcnVsZXNcIixcInBhZ2UtaGVscFwiLFwicGFnZS1hdXRoXCIsXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIixcInBhZ2UtYmlkZGluZ1wiLFwicGFnZS10cnVtcC1jaG9vc2luZ1wiLFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIsXCJwYWdlLXBsYXktcmVwb3J0aW5nXCIsXCJwYWdlLXBsYXlpbmdcIixcInBhZ2UtZmluaXNoZWRcIl07XG5cbnZhciBjdXJyZW50UGFnZT1udWxsOyAvLyBsZXQncyBhc3N1bWUgdG8gYmUgc3RhcnRpbmcgYXQgcGFnZS1ydWxlc1xudmFyIHZpc2l0ZWRQYWdlcz1bXTsgLy8gbm8gcGFnZXMgdmlzaXRlZCB5ZXRcblxudmFyIGN1cnJlbnRQbGF5ZXI9bnVsbDsgLy8gdGhlIGN1cnJlbnQgZ2FtZSBwbGF5ZXJcblxuLy8gTURIQDEwSkFOMjAyMDogbmV3R2FtZSgpIGlzIGEgYmlkIGRpZmZlcmVudCB0aGFuIGluIHRoZSBkZW1vIHZlcnNpb24gaW4gdGhhdCB3ZSByZXR1cm4gdG8gdGhlIHdhaXRpbmctcGFnZVxuZnVuY3Rpb24gbmV3R2FtZSgpe1xuICAgIC8vIGJ5IGNhbGwgcGxheXNUaGVHYW1lQXRJbmRleChudWxsLD8pIHdlIGZvcmNlIGNsZWFyaW5nIHRoZSBnYW1lIGluZm9ybWF0aW9uIGJlaW5nIHNob3duIGF0IHRoZSB3YWl0LWZvci1wbGF5ZXJzIHBhZ2VcbiAgICAoIWN1cnJlbnRQbGF5ZXJ8fGN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleChudWxsLC0xKSk7XG59XG5mdW5jdGlvbiBzdG9wUGxheWluZygpe1xuICAgIC8vIEFTU0VSVCBhc3N1bWluZyBub3QgcGxheWluZyBpbiBhIGdhbWUgYW55bW9yZSBpLmUuIG5ld0dhbWUoKSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlXG4gICAgaWYoY3VycmVudFBsYXllciYmY3VycmVudFBsYXllci5nYW1lKVxuICAgICAgICBhbGVydChcIlN0b3AgZWVyc3QgbWV0IHNwZWxlbiFcIik7XG4gICAgZWxzZSAvLyBmb3JjZSBnb2luZyBiYWNrIHRvIHRoZSBwcmV2aW91cyBwYWdlIGluIHRoZSBoaXN0b3J5ICh3aGVyZSB3ZSBjYW1lIGZyb20gb3JpZ2luYWxseSlcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xufVxuXG52YXIgZm9yY2VGb2N1c0lkPW51bGw7XG5mdW5jdGlvbiBzdG9wRm9yY2VGb2N1cygpe2NsZWFySW50ZXJ2YWwoZm9yY2VGb2N1c0lkKTtmb3JjZUZvY3VzSWQ9bnVsbDt9XG5mdW5jdGlvbiBjaGVja0ZvY3VzKHN0YXRlKXtcbiAgICAvLyBNREhAMjNKQU4yMDIwOiB3ZSBzaG91bGQga2VlcCBibGlua2luZyB3aGVuIG5vdCBpbiBmb2N1cyB1bnRpbCBmb3JjZWQgdG8gc3RvcFxuICAgIC8vICAgICAgICAgICAgICAgIGluc3RlYWQgb2Ygc3RvcHBpbmcgd2hlbiB0aGUgZm9jdXMgd2FzIGdvdFxuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xuICAgIC8vIHJlcGxhY2luZzogaWYoZG9jdW1lbnQuaGFzRm9jdXMoKSl7c2hvd0dhbWVTdGF0ZShzdGF0ZSk7c3RvcEZvcmNlRm9jdXMoKTt9ZWxzZSB0b2dnbGVHYW1lU3RhdGUoc3RhdGUpO1xufVxuZnVuY3Rpb24gZm9yY2VGb2N1cyhzdGF0ZSl7XG4gICAgc2hvd0dhbWVTdGF0ZShzdGF0ZSk7IC8vIGVpdGhlciB0byBzaG93IHN0YXRlIG9yIHJlbW92ZSB3aGF0J3MgY3VycmVudGx5IHNob3duXG4gICAgaWYoc3RhdGUpeyAvLyBmb2N1cyByZXF1ZXN0ZWRcbiAgICAgICAgLy8gc3RhcnQgZ2V0dGluZyB0aGUgZm9jdXMgYnkgYmxpbmtpbmcgJ3N0YXRlJyBJRkYgd2UgaGF2ZW4ndCBnb3QgaXQgeWV0Li4uXG4gICAgICAgIGlmKCFmb3JjZUZvY3VzSWQpZm9yY2VGb2N1c0lkPXNldEludGVydmFsKCgpPT57Y2hlY2tGb2N1cyhzdGF0ZSk7fSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIG9mIGNvdXJzZTogZnJvbSBzdGFja292ZXJmbG93ISEhXG5mdW5jdGlvbiBkaWZmZXJlbmNlKGExLGEyKXt2YXIgYTJTZXQ9bmV3IFNldChhMik7cmV0dXJuIGExLmZpbHRlcigoeCk9PiFhMlNldC5oYXMoeCkpO31cblxudmFyIGJpZGRlckNhcmRzRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1jYXJkc1wiKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKXtcbiAgICBsZXQgYnV0dG9uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJpZGRlciBzdWl0ZWNhcmRzIGJ1dHRvbiBjbGlja2VkIVwiKTtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7IC8vIGEgaGEsIGRpZG4ndCBrbm93IHRoaXNcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5zdHlsZS5kaXNwbGF5PSh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4vLyAgICAgdmFyIHYgPSBkb2N1bWVudC5jb29raWUubWF0Y2goJyhefDspID8nICsgbmFtZSArICc9KFteO10qKSg7fCQpJyk7XG4vLyAgICAgcmV0dXJuIHYgPyB2WzJdIDogbnVsbDtcbi8vIH1cbi8vIGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuLy8gICAgIHZhciBkID0gbmV3IERhdGU7XG4vLyAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMCpkYXlzKTtcbi8vICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiO3BhdGg9LztleHBpcmVzPVwiICsgZC50b0dNVFN0cmluZygpO1xuLy8gfVxuLy8gZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHsgc2V0Q29va2llKG5hbWUsICcnLCAtMSk7IH1cblxuLyoqXG4gKiBzaG93cyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBjYXJkcyBwbGF5ZWQgdGFibGUgYXMgd2VsbFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBiaWRzIHRhYmxlXG4gICAgc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKTtcbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBmb3IobGV0IHBsYXllck5hbWVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZVwiKSlcbiAgICAgICAgaWYocGxheWVyTmFtZUVsZW1lbnQpXG4gICAgICAgICAgICBwbGF5ZXJOYW1lRWxlbWVudC5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZCB0YWJsZVxuICogdG8gYmUgY2FsbGVkIHdpdGggZXZlcnkgbmV3IGdhbWVcbiAqL1xuZnVuY3Rpb24gY2xlYXJCaWRUYWJsZSgpe1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgYmlkVGFibGVSb3cgb2YgYmlkVGFibGUuY2hpbGRyZW4pXG4gICAgICAgIGZvcihsZXQgYmlkVGFibGVDb2x1bW4gb2YgYmlkVGFibGVSb3cuY2hpbGRyZW4pXG4gICAgICAgICAgICBiaWRUYWJsZUNvbHVtbi5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKCFlbGVtZW50KXtjb25zb2xlLmVycm9yKFwiTm8gZWxlbWVudCFcIik7cmV0dXJuO31cbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8vIE1ESEAyM0pBTjIwMjA6IHdoZW4gc2hvd2luZyB0aGUgcGxheWVyIG5hbWUgd2Ugc2V0IHRoZSBjb2xvciB0byBibGFjayAoanVzdCBpbiBjYXNlIGl0J3Mgbm90IGJsYWNrIGFueW1vcmUpXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIGVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO1xufVxuZnVuY3Rpb24gc2hvd1BsYXllclR5cGUoZWxlbWVudCxwbGF5ZXJUeXBlKXtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7XG4gICAgfVxufVxuXG4vLyBNREhAMjBKQU4yMDIwOiBrZWVwIHRoZSBpZHMgb2YgdGhlIHRyaWNrIHBsYXllZCBjYXJkcyBpbiBhIGNvbnN0YW50IGFycmF5XG5jb25zdCBQTEFZRURfQ0FSRF9JRFM9W1wiY3VycmVudC1wbGF5ZXItY2FyZFwiLFwibGVmdGhhbmRzaWRlLXBsYXllci1jYXJkXCIsXCJvcHBvc2l0ZS1wbGF5ZXItY2FyZFwiLFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiXTtcblxuLy8gdG8gYmUgY2FsbGVkIG9uIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50XG5mdW5jdGlvbiBjbGVhckNhcmRzUGxheWVkVGFibGUoKXtcbiAgICBmb3IobGV0IHBsYXllZENhcmRJbmRleCBpbiBQTEFZRURfQ0FSRF9JRFMpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFBMQVlFRF9DQVJEX0lEU1twbGF5ZWRDYXJkSW5kZXhdKS5pbm5lckhUTUw9XCJcIjtcbn1cblxuLyoqXG4gKiBzaG93cyB0aGUgZ2l2ZW4gdHJpY2tcbiAqIEBwYXJhbSB7Kn0gdHJpY2sgXG4gKi9cbmZ1bmN0aW9uIHNob3dUcmljayh0cmljay8qLHBsYXllckluZGV4Ki8pe1xuICAgIFxuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIFwiLHRyaWNrKTtcbiAgICBcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG5cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSB0cnVtcCBwbGF5ZXIgdGhhdCBpcyBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIChlaXRoZXIgbm9uLWJsaW5kIG9yIGJsaW5kKSBmbGFnIHRoZSBjaGVja2JveFxuICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3gnKS5jaGVja2VkPXRydWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWJsaW5kJykuaW5uZXJIVE1MPSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwP1wiYmxpbmQgXCI6XCJcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcblxuICAgIC8vIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGluZm9cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT0odHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPT0wP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgLy9sZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stY2FyZHMtdGFibGVcIikucmVxdWVzdFNlbGVjdG9yKFwidGJvZHlcIik7XG5cbiAgICAvLyB0aGUgcGxheWVyIHR5cGUgY2FuIGNoYW5nZSBldmVyeSBjYXJkIGJlaW5nIHBsYXllZCAoYmFzZWQgb24gdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyKVxuICAgIC8vIFRPRE8gc2hvdWxkbid0IG5lZWQgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAgICAvLyBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSwtMik7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgXG4gICAgLy8gTk9URSB0aGUgZmlyc3QgY2FyZCBjb3VsZCBiZSB0aGUgYmxpbmQgY2FyZCBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgbm90IHNob3cgaXQhIVxuICAgIC8vICAgICAgYnV0IG9ubHkgdGhlIGNvbG9yIG9mIHRoZSBwYXJ0bmVyIHN1aXRlXG4gICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9KHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2suX2NhcmRzWzBdLnN1aXRlIT09dHJpY2sucGxheVN1aXRlKTtcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBzaG93IGFsbCB0aGUgdHJpY2sgY2FyZHMgcGxheWVkIGF0IHRoZSByaWdodCBwb3NpdGlvblxuICAgIGZvcihsZXQgdHJpY2tDYXJkSW5kZXg9MDt0cmlja0NhcmRJbmRleDw0O3RyaWNrQ2FyZEluZGV4Kyspe1xuICAgICAgICBsZXQgdHJpY2tDYXJkPSh0cmlja0NhcmRJbmRleDx0cmljay5udW1iZXJPZkNhcmRzP3RyaWNrLl9jYXJkc1t0cmlja0NhcmRJbmRleF06bnVsbCk7XG4gICAgICAgIGxldCB0cmlja0NhcmRQbGF5ZXJJbmRleD10cmljay5maXJzdFBsYXllcit0cmlja0NhcmRJbmRleDsgLy8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggaW4gdGhlIGdhbWVcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBvc2l0aW9uPSh0cmlja0NhcmRQbGF5ZXJJbmRleCs0LXBsYXllckluZGV4KSU0O1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIGNhcmQgcG9zaXRpb246IFwiK3RyaWNrQ2FyZFBvc2l0aW9uK1wiLlwiKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZElkPVBMQVlFRF9DQVJEX0lEU1t0cmlja0NhcmRQb3NpdGlvbl07XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQpe1xuICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD1mYWxzZTsgLy8gZG8gbm90IGRvIHRoaXMgZm9yIHRoZSBuZXh0IHBsYXllcnNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmljay5wbGF5U3VpdGUpOyAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIGNhcmQgI1wiK3RyaWNrQ2FyZEluZGV4LHRyaWNrQ2FyZCk7XG4gICAgICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2tDYXJkLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCx0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8xOi0xKTowKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIGxldCBwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9KGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ/KDQrdHJpY2suZmlyc3RQbGF5ZXItcGxheWVySW5kZXgpJTQ6MCk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0xKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMSklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzEpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsxKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0yKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMiklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzIpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsyKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0zKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMyklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzMpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCszKSU0KT8xOi0xKTowKSk7XG4gICAgKi9cbn1cblxuZnVuY3Rpb24gdXBkYXRlU3VpdGVDYXJkUm93cyhyb3dzLHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHN1aXRlIGNhcmQgcm93czogXCIrcm93cy5sZW5ndGgrXCIuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBsZXQgc3VpdGU9MDtcbiAgICBmb3IobGV0IHJvdyBvZiByb3dzKXtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjZWxscz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmQ9MDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IGNlbGwgb2YgY2VsbHMpe1xuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yOyAgXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBzdWl0ZUNhcmQrKztcbiAgICAgICAgfVxuICAgICAgICBzdWl0ZSsrO1xuICAgIH1cbn1cbi8vIGluIHRocmVlIGRpZmZlcmVudCBwYWdlcyB0aGUgcGxheWVyIGNhcmRzIHNob3VsZCBiZSBzaG93bi4uLlxuZnVuY3Rpb24gdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgZm9yIGJpZGRpbmcuXCIpO1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5cbi8qKlxuICogZm9yIHBsYXlpbmcgdGhlIGNhcmRzIGFyZSBzaG93biBpbiBidXR0b25zIGluc2lkZSB0YWJsZSBjZWxsc1xuICogQHBhcmFtIHsqfSBzdWl0ZUNhcmRzIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyB0byBjaG9vc2UgZnJvbS5cIik7XG4gICAgbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1zdWl0ZWNhcmRzLXRhYmxlXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgIGxldCByb3dzPXRhYmxlYm9keS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgIGxldCByb3c9cm93c1tzdWl0ZV07XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZUNhcmQ9MDtzdWl0ZUNhcmQ8Y29sdW1ucy5sZW5ndGg7c3VpdGVDYXJkKyspe1xuICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1lbHNlIC8vIGhpZGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVySW5kZXg9MDtcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVySW5kZXhdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVySW5kZXhdKTtcbiAgICAgICAgcGxheWVySW5kZXgrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLl90cmljazsgLy8gTURIQDIwSkFOMjAyMCByZXBsYWNpbmc6IGdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGlmKHRyaWNrKVxuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLmNoaWxkcmVuW2xhc3RUcmlja1BsYXllZEluZGV4XTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9U3RyaW5nKGxhc3RUcmlja1BsYXllZEluZGV4KzEpO1xuICAgICAgICAgICAgZm9yKHRyaWNrUGxheWVyPTA7dHJpY2tQbGF5ZXI8dHJpY2suX2NhcmRzLmxlbmd0aDt0cmlja1BsYXllcisrKXtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyPSh0cmlja1BsYXllcit0cmljay5maXJzdFBsYXllciklNDtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bMipwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICAgICAgbGV0IGNhcmQ9dHJpY2suX2NhcmRzW3RyaWNrUGxheWVyXTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpOyAvLyBwdXQgfCBpbiBmcm9udCBvZiBmaXJzdCBwbGF5ZXIhISFcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBiYWNrZ3JvdW5kIHRoZSBjb2xvciBvZiB0aGUgcGxheSBzdWl0ZSBhZnRlciB0aGUgbGFzdCBwbGF5ZXIsIHNvIHdlIGtub3cgd2hlcmUgdGhlIHRyaWNrIGVuZGVkISFcbiAgICAgICAgICAgICAgICByb3cuY2hpbGRyZW5bMipwbGF5ZXIrMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yPSh0cmlja1BsYXllcj09dHJpY2suX2NhcmRzLmxlbmd0aC0xPyh0cmljay5wbGF5U3VpdGUlMj8nYmxhY2snOidyZWQnKTond2hpdGUnKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQncyBtYWtlIHRoZSB3aW5uZXIgY2FyZCBzaG93IGJpZ2dlciEhIVxuICAgICAgICAgICAgICAgIC8vLy8vLy9pZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgICAgICAgICBpZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibGFjayc6J3JlZCcpO1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuZm9udFNpemU9KHRyaWNrLndpbm5lcj09PXBsYXllcj9cIjYwMFwiOlwiNDUwXCIpK1wiJVwiO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj0nIycrKGNhcmQuc3VpdGUlMj8nRkYnOicwMCcpKycwMCcrKHRyaWNrUGxheWVyPT0wPydGRic6JzAwJyk7IC8vIGZpcnN0IHBsYXllciBhZGRzIGJsdWUhIVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzldLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFRlYW1OYW1lKHRyaWNrLndpbm5lcik7IC8vIHNob3cgd2hvIHdvbiB0aGUgdHJpY2shIVxuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzEwXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHRyaWNrLndpbm5lcik7IC8vIHNob3cgdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGJ5IHRoZSB0cmljayB3aW5uZXIgKE1ESEAwM0pBTjIwMjA6IGNoYW5nZWQgZnJvbSBnZXR0aW5nIHRoZSBwbGF5ZXIgaW5zdGFuY2UgZmlyc3QpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNob3dEZWZhdWx0UGxheWVyTmFtZXMoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGVmYXVsdCBwbGF5ZXIgbmFtZXMhXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz1MYW5ndWFnZS5ERUZBVUxUX1BMQVlFUlNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZW1vLXBsYXltb2RlLWNoZWNrYm94XCIpLmNoZWNrZWQ/MTowXTtcbiAgICBmb3IocGxheWVyTmFtZUlucHV0RWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZighcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZXx8cGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZS5sZW5ndGg9PTApXG4gICAgICAgICAgICBwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlPXBsYXllck5hbWVzW3BhcnNlSW50KHBsYXllck5hbWVJbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIikpXTtcbiAgICB9XG59XG5cbi8vIHBsYXlpbmcgZnJvbSB3aXRoaW4gdGhlIGdhbWVcbmZ1bmN0aW9uIHNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkKCl7XG4gICAgbGV0IHNpbmdsZVBsYXllck5hbWU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItbmFtZScpLnZhbHVlLnRyaW0oKTtcbiAgICBpZihzaW5nbGVQbGF5ZXJOYW1lLmxlbmd0aD4wKVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKHNpbmdsZVBsYXllck5hbWUsKGVycik9PntcbiAgICAgICAgICAgIC8vIE1ESEAxMEpBTjIwMjA6IF9zZXRQbGF5ZXIgdGFrZXMgY2FyZSBvZiBzd2l0Y2hpbmcgdG8gdGhlIHJpZ2h0IGluaXRpYWwgcGFnZSEhIVxuICAgICAgICAgICAgaWYoZXJyKXNldEluZm8oZXJyKTsvLyBlbHNlIG5leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgYWxlcnQoXCJHZWVmIGVlcnN0IGVlbiAoZ2VsZGlnZSkgbmFhbSBvcCFcIik7XG59XG5cbi8qKlxuICogcHJlcGFyZXMgdGhlIEdVSSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBnZXRHYW1lSW5mbygpe1xuICAgIGNvbnNvbGUubG9nKFwiRGV0ZXJtaW5pbmcgZ2FtZSBpbmZvLlwiKTtcbiAgICBsZXQgZ2FtZUluZm89XCJcIjtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7IC8vIG5vIHBsYXllciwgbm8gZ2FtZVxuICAgIGlmKHJpa2tlblRoZUdhbWUpe1xuICAgICAgICAvLyBnZXQgdGhlIGluZm8gd2UgbmVlZCB0aHJvdWdoIHRoZSBQbGF5ZXJHYW1lIGluc3RhbmNlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJzPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKTsgLy8gdGhvc2UgYmlkZGluZ1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkZGVyczogXCIraGlnaGVzdEJpZGRlcnMuam9pbihcIiwgXCIpK1wiLlwiKTtcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWQ9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWQ6IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiKTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRUcnVtcFN1aXRlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0VHJ1bXAgc3VpdGU6IFwiK3RydW1wU3VpdGUrXCIuXCIpO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclN1aXRlKCk7XG4gICAgICAgIGxldCBwYXJ0bmVyUmFuaz1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgIC8vIHBsYXlpbmcgd2l0aCB0cnVtcCBpcyBlYXNpZXN0XG4gICAgICAgIGlmKHRydW1wU3VpdGU+PTApeyAvLyBvbmx5IGEgc2luZ2xlIGhpZ2hlc3QgYmlkZGVyISEhXG4gICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyPWhpZ2hlc3RCaWRkZXJzWzBdO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJvZWxhUGxheWVyTmFtZT1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcik7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89dHJvZWxhUGxheWVyTmFtZStcIiBoZWVmdCB0cm9lbGEsIGVuIFwiO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW3RydW1wU3VpdGVdK1wiIG1ldCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG4vLyBob3cgdG8gcGhyYXNlIGEgYmlkIGRlcGVuZHMgb24gdGhlIGJpZCwgYW5kIHdobyBwbGF5cyBpdFxuZnVuY3Rpb24gZ2V0QmlkSW5mbyhiaWQsYmlkZGVyKXtcbiAgICBsZXQgYmV0dGVyPShiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVJ8fFxuICAgICAgICBiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUik7XG4gICAgaWYoYmV0dGVyKWJpZC0tO1xuICAgIHN3aXRjaChiaWQpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1BBUzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0IGdlcGFzdC5cIjpcIkplIGhlYnQgZ2VwYXN0LlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9SSUs6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBcIjpcIkplIGhlYnQgXCIpKyhiZXR0ZXI/XCJiZXRlciBcIjpcIlwiKStcIiBnZXJpa3QuXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTkVHRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdGllbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIGVsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0d2FhbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGRlcnRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QSUNPOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIHNsZWNodHMgZWVuIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgb3BlbiBrYWFydGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuIG1ldCBlZW4gcHJhYXRqZSBlbiBvcGVuIGthYXJ0ZW4uXCI7XG4gICAgfVxuICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0XCI6XCJKZSBoZWJ0XCIpK1wiIGVlbiBvbmdlbGRpZyBib2QgZ2VkYWFuLlwiO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBwbGF5ZXJJbmRleD0wO3BsYXllckluZGV4PHJpa2tlblRoZUdhbWUubnVtYmVyT2ZQbGF5ZXJzO3BsYXllckluZGV4Kyspe1xuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICB9XG59XG4vLyBNREhAMjFOT1YyMDIwOiB0aGUgZ2FtZSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBhIGJpZCBtYWRlIGlzIHJlY2VpdmVkISEhXG5mdW5jdGlvbiB1cGRhdGVCaWRzVGFibGUocGxheWVyQmlkc09iamVjdHMpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgaWYocGxheWVyQmlkc09iamVjdHMpXG4gICAgZm9yKGxldCBwbGF5ZXJCaWRzSW5kZXg9MDtwbGF5ZXJCaWRzSW5kZXg8cGxheWVyQmlkc09iamVjdHMubGVuZ3RoO3BsYXllckJpZHNJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyQmlkc0luZGV4XTtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuZ2V0UGxheWVySW5kZXgocGxheWVyQmlkc09iamVjdC5uYW1lKTtcbiAgICAgICAgLy8gb24gdGhlIHNhZmUgc2lkZSwgZ2V0IHRoZSBwbGF5ZXIgaW5kZXggZnJvbSB0aGUgZ2FtZSBwYXNzaW5nIGluICBwbGF5ZXIgbmFtZVxuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXthbGVydChcIlBsYXllciBcIitwbGF5ZXJCaWRzT2JqZWN0Lm5hbWUrXCIgdW5rbm93biFcIik7Y29udGludWU7fVxuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIC8vIE1ESEAyM0pBTjIwMjAgc2hvd2luZyB0aGUgcGxheWVyIG5hbWVzIG9uY2U6IHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPWNhcGl0YWxpemUocGxheWVyQmlkc09iamVjdC5uYW1lKTsgLy8gd3JpdGUgdGhlIG5hbWUgb2YgdGhlIHBsYXllclxuICAgICAgICAvLyB3cml0ZSB0aGUgYmlkcyAod2UgaGF2ZSB0byBjbGVhciB0aGUgdGFibGUgd2l0aCBldmVyeSBuZXcgZ2FtZSB0aG91Z2gpXG4gICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQsYmlkSW5kZXgpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlbltiaWRJbmRleCsxXS5pbm5lckhUTUw9cGxheWVyQmlkO30pO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl0uY2hpbGRyZW5bMV0uaW5uZXJIVE1MPXBsYXllcnNCaWRzW2JpZF0uam9pbihcIiBcIik7XG4gICAgfVxufVxuXG5jbGFzcyBPbmxpbmVQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJ7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcbiAgICAgICAgc3VwZXIobmFtZSxudWxsKTtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyBhc2sgdGhlIGdhbWVcbiAgICAgICAgcmV0dXJuKHRoaXMuaW5kZXgmJnRoaXMuZ2FtZT90aGlzLmdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLmluZGV4KTowKTtcbiAgICB9XG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gZGVidWdnZXJcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAvLyByZW1vdmVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIHNldEluZm8oXCJEb2UgZWVuIGJvZC5cIik7XG4gICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IC8vIEpJVCB0byB0aGUgcmlnaHQgcGFnZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG5cbiAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7XG4gICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zXG4gICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5pdGlhbFwiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKTtcbiAgICB9XG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgdHJ1bXAgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXRydW1wLWNob29zaW5nXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHRydW1wIHN1aXRlIGJ1dHRvbnNcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgIH1cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoc3VpdGVzLHBhcnRuZXJSYW5rKXsgLy8gcGFydG5lclJhbmtOYW1lIGNoYW5nZWQgdG8gcGFydG5lclJhbmsgKGJlY2F1c2UgTGFuZ3VhZ2Ugc2hvdWxkIGJlIHVzZWQgYXQgdGhlIFVJIGxldmVsIG9ubHkhKVxuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgcGFydG5lciBzdWl0ZXM6XCIsc3VpdGVzKTtcbiAgICAgICAgc2V0UGFnZShcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHN1aXRlcyBpbiB0aGUgYnV0dG9uIGFycmF5IGFyZSAwLCAxLCAyLCAzIGFuZCBzdWl0ZXMgd2lsbCBjb250YWluXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBwYXJ0bmVyIHJhbmsgKGFjZSBvciBraW5nKSBiZWluZyBhc2tlZFxuICAgICAgICBmb3IobGV0IHJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgcmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdO1xuICAgIH1cbiAgICAvLyBhbG1vc3QgdGhlIHNhbWUgYXMgdGhlIHJlcGxhY2VkIHZlcnNpb24gZXhjZXB0IHdlIG5vdyB3YW50IHRvIHJlY2VpdmUgdGhlIHRyaWNrIGl0c2VsZlxuICAgIHBsYXlBQ2FyZCgpe1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7XG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAqL1xuICAgICAgICBsZXQgdHJpY2s9KHRoaXMuZ2FtZT90aGlzLmdhbWUuX3RyaWNrOm51bGwpO1xuICAgICAgICBpZighdHJpY2spe2FsZXJ0KFwiQlVHOiBObyBjdXJyZW50IHRyaWNrIHRvIHBsYXkgYSBjYXJkIGluIVwiKTtyZXR1cm47fVxuICAgICAgICAvLyBNREhAMTlKQU4yMDIwOiBhbGxvdyB0aGUgY3VycmVudCBwbGF5ZXIgdG8gcGxheSBhIGNhcmQgYnkgY2xpY2tpbmcgb25lXG4gICAgICAgIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2sucGxheVN1aXRlPDApe2FsZXJ0KFwiQlVHOiBQbGF5IHN1aXRlIG9mIG5vbi1lbXB0eSB0cmljayB1bmRlZmluZWQhXCIpO3JldHVybjt9XG4gICAgICAgIHNldEluZm8oXCJTcGVlbCBlZW4gXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIuXCIpO1xuICAgICAgICAvLyBpZiB0aGlzIGlzIGEgbmV3IHRyaWNrIHVwZGF0ZSB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZSB3aXRoIHRoZSBwcmV2aW91cyB0cmlja1xuICAgICAgICAvLyBpZih0cmljay5udW1iZXJPZkNhcmRzPT0wKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAvKiBzZWUgc2hvd1RyaWNrKClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW4tYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuc3R5bGUuZGlzcGxheT0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgICAgICAvLyBhbHdheXMgc3RhcnQgdW5jaGVja2VkLi4uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuY2hlY2tlZD1mYWxzZTsgLy8gd2hlbiBjbGlja2VkIHNob3VsZCBnZW5lcmF0ZSBcbiAgICAgICAgKi9cbiAgICAgICAgLy8gTURIQDIwSkFOMjAyMCBtb3ZlZCBvdmVyIHRvIHdoZXJlIEdBTUVfSU5GTyBldmVudCBpcyByZWNlaXZlZCEhISE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpOyAvLyB1cGRhdGUgdGhlIGdhbWUgaW5mbyAocGxheWVyIHNwZWNpZmljKVxuICAgICAgICAvLyBvYnNvbGV0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkLXBsYXllclwiKS5pbm5lckhUTUw9dGhpcy5uYW1lO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVxuICAgICAgICAgICAgKHRyaWNrLnBsYXlTdWl0ZT49MD9cIlNwZWVsIGVlbiBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdLnRvTG93ZXJDYXNlKCkrXCIgYmlqLlwiOlwiS29tIG1hYXIgdWl0IVwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mVHJpY2tzV29uPXRoaXMuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTsgLy8gYWxzbyBpbmNsdWRlcyB0aG9zZSB3b24gYnkgdGhlIHBhcnRuZXIgKGF1dG9tYXRpY2FsbHkpXG4gICAgICAgIC8vIGFkZCB0aGUgdHJpY2tzIHdvbiBieSB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lck5hbWU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyTmFtZSh0aGlzLl9pbmRleCk7XG4gICAgICAgIC8vIGlmKHBhcnRuZXIpbnVtYmVyT2ZUcmlja3NXb24rPXBsYXllci5nZXROdW1iZXJPZlRyaWNrc1dvbigpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy13b24tc28tZmFyXCIpLmlubmVySFRNTD1TdHJpbmcobnVtYmVyT2ZUcmlja3NXb24pKyhwYXJ0bmVyTmFtZT9cIiAoc2FtZW4gbWV0IFwiK3BhcnRuZXJOYW1lK1wiKVwiOlwiXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHRoaXMgcGxheWVyIGlzIHN1cHBvc2VkIHRvIHdpbiBpbiB0b3RhbFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy10by13aW5cIikuaW5uZXJIVE1MPWdldE51bWJlck9mVHJpY2tzVG9XaW5UZXh0KHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW4scGFydG5lck5hbWUsdGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkKCkpO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7IC8vIGdldCByaWQgb2YgYW55IGN1cnJlbnRseSBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT05MSU5FID4+PiBQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgc2hvdWxkIHBsYXkgYSBjYXJkIVwiKTtcbiAgICAgICAgLy8gc2V0SW5mbyhcIldlbGtlIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiIHdpbCBqZSBcIisodHJpY2subnVtYmVyT2ZDYXJkcz4wP1wiYmlqXCI6XCJcIikrXCJzcGVsZW4/XCIpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTsgLy8gcmVtZW1iZXIgdGhlIHN1aXRlIGNhcmRzISEhIVxuICAgICAgICAvLyBzaG93IHRoZSB0cmljayAocmVtZW1iZXJlZCBpbiB0aGUgcHJvY2VzcyBmb3IgdXNlIGluIGNhcmRQbGF5ZWQgYmVsb3cpIGZyb20gdGhlIHZpZXdwb2ludCBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgLy8vLy8gc2hvd1RyaWNrKHRoaXMuX3RyaWNrPXRyaWNrKTsgLy8gTURIQDExSkFOMjAyMDogbm8gbmVlZCB0byBwYXNzIHRoZSBwbGF5ZXIgaW5kZXggKGFzIGl0IGlzIGFsd2F5cyB0aGUgc2FtZSlcbiAgICB9XG5cbiAgICAvLyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBfY2FyZFBsYXllZCgpIGRlZmluZWQgaW4gdGhlIGJhc2UgY2xhc3MgUGxheWVyIHdoaWNoIGluZm9ybXMgdGhlIGdhbWVcbiAgICAvLyBOT1RFIGNhcmRQbGF5ZWQgaXMgYSBnb29kIHBvaW50IGZvciBjaGVja2luZyB0aGUgdmFsaWRpdHkgb2YgdGhlIGNhcmQgcGxheWVkXG4gICAgLy8gTk9URSBjYW4ndCB1c2UgX2NhcmRQbGF5ZWQgKHNlZSBQbGF5ZXIgc3VwZXJjbGFzcylcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBkZWNpZGluZyB0byByZXR1cm4gdHJ1ZSBvbiBhY2NlcHRhbmNlLCBmYWxzZSBvdGhlcndpc2VcbiAgICBfY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KHN1aXRlLGluZGV4KXtcbiAgICAgICAgbGV0IGNhcmQ9KHN1aXRlPHRoaXMuX3N1aXRlQ2FyZHMubGVuZ3RoJiZ0aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXS5sZW5ndGg/dGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV1baW5kZXhdOm51bGwpO1xuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIFRPRE8gY2hlY2tpbmcgc2hvdWxkIE5PVCBiZSBkb25lIGJ5IHRoZSBwbGF5ZXIgQlVUIGJ5IHRoZSB0cmljayBpdHNlbGYhISFcbiAgICAgICAgICAgIC8vIEJVRyBGSVg6IGRvIE5PVCBkbyB0aGUgZm9sbG93aW5nIGhlcmUsIGJ1dCBvbmx5IGF0IHRoZSBzdGFydCBvZiBhIHRyaWNrLCBvciBOT1QgYXQgYWxsISEhISFcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL3RoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIC0xIHdoZW4gYXNraW5nIGJsaW5kLCAwIG5vdCBhc2tpbmcsIDEgaWYgYXNraW5nXG4gICAgICAgICAgICAvLyBDQU4nVCBjYWxsIF9zZXRDYXJkIChpbiBiYXNlIGNsYXNzIFBsYXllcikgaWYgdGhlIGNhcmQgY2Fubm90IGJlIHBsYXllZCEhIVxuICAgICAgICAgICAgbGV0IHRyaWNrPXRoaXMuZ2FtZS5fdHJpY2s7IC8vIE1ESEAxOUpBTjIwMjA6IGVhc2llc3Qgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0cmlja1xuICAgICAgICAgICAgaWYoIXRyaWNrKXtcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlclxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTApeyAvLyBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGVvcmV0aWNhbGx5IHRoZSBjYXJkIGNhbiBiZSBwbGF5ZWQgYnV0IGl0IG1pZ2h0IGJlIHRoZSBjYXJkIHdpdGggd2hpY2ggdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCEhXG4gICAgICAgICAgICAgICAgLy8gaXMgdGhpcyBhIGdhbWUgd2hlcmUgdGhlcmUncyBhIHBhcnRuZXIgY2FyZCB0aGF0IGhhc24ndCBiZWVuIHBsYXllZCB5ZXRcbiAgICAgICAgICAgICAgICAvLyBhbHRlcm5hdGl2ZWx5IHB1dDogc2hvdWxkIHRoZXJlIGJlIGEgcGFydG5lciBhbmQgdGhlcmUgaXNuJ3Qgb25lIHlldD8/Pz8/XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1aXRlPT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwIEJVRyBGSVg6IHdhcyB1c2luZyBhc2stcGFydG5lci1jYXJkLWJsaW5kIGluc3RlYWQgb2YgYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLmNoZWNrZWQmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWl0ZSE9dGhpcy5fZ2FtZS5nZXRUcnVtcFN1aXRlKCl8fGNvbmZpcm0oXCJXaWx0IFUgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCldK1wiIChibGluZCkgdnJhZ2VuIG1ldCBlZW4gdHJvZWY/XCIpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7IC8vIHllcywgYXNraW5nIGJsaW5kISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vL2FsZXJ0KFwiXFx0QkxJTkQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLyphbGVydChcIk5vdCBpbmRpY2F0ZWQhISEhXCIpKi87XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0cmljay5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzJiZzdWl0ZT09PUNhcmQuU1VJVEVfU1BBREUpeyAvLyBzcGFkZSBpcyBiZWluZyBwbGF5ZWQgYnkgdGhlIGZpcnN0IHBsYXllciB3aGVyZWFzIHRoYXQgaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShDYXJkLlNVSVRFX1NQQURFKTx0aGlzLm51bWJlck9mQ2FyZHMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSmUga3VudCBuaWV0IG1ldCBzY2hvcHBlbiB1aXRrb21lbiwgd2FudCBkZSBzY2hvcHBlbiB2cm91dyBpcyBub2cgbmlldCBvcGdlaGFhbGQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoc3VpdGUhPT10cmljay5wbGF5U3VpdGUmJnRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZSh0cmljay5wbGF5U3VpdGUpPjApe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgXCIrY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiBuaWV0IHNwZWxlbiwgd2FudCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB3aGVuIGJlaW5nIGFza2VkIGZvciB0aGUgcGFydG5lciBjYXJkIHRoYXQgd291bGQgYmUgdGhlIGNhcmQgdG8gcGxheSFcbiAgICAgICAgICAgICAgICBpZih0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSxwYXJ0bmVyUmFuaz10aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuaykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5zdWl0ZSE9cGFydG5lclN1aXRlfHxjYXJkLnJhbmshPXBhcnRuZXJSYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkplIGt1bnQgXCIrY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiBuaWV0IHNwZWxlbiwgd2FudCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwOiB3ZSBoYXZlIHRvIGFsc28gcmV0dXJuIHdoYXRldmVyIHRyaWNrIHZhbHVlIHRoYXQgbWlnaHQndmUgY2hhbmdlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgd2hpY2ggaW4gdGhpcyBjYXNlIGNvdWxkIHdlbCBiZSB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgJ2ZsYWcnXG4gICAgICAgICAgICB0aGlzLl9zZXRDYXJkKGNhcmQsdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBhbGVydChcIkludmFsaWQgY2FyZCBzdWl0ZSBcIitTdHJpbmcoc3VpdGUpK1wiIGFuZCBzdWl0ZSBpbmRleCBcIitTdHJpbmcoaW5kZXgpK1wiLlwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBzdXBlci5wbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpO1xuICAgICAgICAvLyBUT0RPIHNob3VsZCB3ZSBkbyB0aGlzIGhlcmU/P1xuICAgICAgICBpZih0aGlzLmdhbWUpc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTtlbHNlIHNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpO1xuICAgIH1cbiAgICAvLyBjYWxsIHJlbmRlckNhcmRzIGp1c3QgYWZ0ZXIgdGhlIHNldCBvZiBjYXJkcyBjaGFuZ2VcbiAgICByZW5kZXJDYXJkcygpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqIFJlbmRlcmluZyBwbGF5ZXIgY2FyZHMhXCIpO1xuICAgICAgICB0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKTtcbiAgICAgICAgLy8gVE9ETyBwcm9iYWJseSBiZXN0IHRvIHNob3cgdGhlbSBvbiBBTEwgcGFnZXMgKG5vIG1hdHRlciB3aGljaCBvbmUgaXMgY3VycmVudGx5IHNob3dpbmchKVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIHN3aXRjaChjdXJyZW50UGFnZSl7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1iaWRkaW5nXCI6dXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IG9ubHkgb25jZVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGxheWluZ1wiOnVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBhZnRlciBwbGF5aW5nIGEgY2FyZCEhXG4gICAgICAgICAgICBjYXNlIFwicGFnZS10cnVtcC1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH1cbiAgICAvLyBleGl0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiBhIHBsYXllciBsZWF2ZXMgYSBnYW1lIGZvciBzb21lIHJlYXNvbiAodHlwaWNhbGx5IGJ5IGNsb3NpbmcgdGhlIHRhYilcbiAgICBleGl0KCl7KCF0aGlzLl9nYW1lfHx0aGlzLl9nYW1lLmV4aXQodGhpcy5uYW1lK1wiIGxlYXZpbmcuLi5cIikpO31cbn1cblxuLy8gYnV0dG9uIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4vKipcbiAqIGNsaWNraW5nIGEgYmlkIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBiaWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBiaWRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBsZXQgYmlkPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1iaWRcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiQmlkIGNob3NlbjogXCIsYmlkKTtcbiAgICBjdXJyZW50UGxheWVyLl9zZXRCaWQoYmlkKTsgLy8gdGhlIHZhbHVlIG9mIHRoZSBidXR0b24gaXMgdGhlIG1hZGUgYmlkXG59XG4vKipcbiAqIGNsaWNraW5nIGEgdHJ1bXAgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHRydW1wIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gdHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIC8vIGVpdGhlciB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIHNlbGVjdGVkXG4gICAgLy8gT09QUyB1c2luZyBwYXJzZUludCgpIGhlcmUgaXMgU09PT08gaW1wb3J0YW50XG4gICAgbGV0IHRydW1wU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlRydW1wIHN1aXRlIFwiK3RydW1wU3VpdGUrXCIgY2hvc2VuLlwiKTtcbiAgICBjdXJyZW50UGxheWVyLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xufVxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIHBhcnNlSW50IFZFUlkgSU1QT1JUQU5UISEhIVxuICAgIGxldCBwYXJ0bmVyU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgc3VpdGUgXCIrcGFydG5lclN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgLy8gZ28gZGlyZWN0bHkgdG8gdGhlIGdhbWUgKGluc3RlYWQgb2YgdGhyb3VnaCB0aGUgcGxheWVyKVxuICAgIGN1cnJlbnRQbGF5ZXIuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xufVxuXG4vKipcbiAqIGNsaWNraW5nIGEgcGFydG5lciBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gcGFydG5lciBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHBsYXlhYmxlY2FyZEJ1dHRvbkNsaWNrZWQoZXZlbnQpe1xuICAgIGxldCBwbGF5YWJsZWNhcmRDZWxsPWV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgbGV0IGNhcmRTdWl0ZT1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpO1xuICAgIGxldCBjYXJkUmFuaz1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaW5kZXhcIikpO1xuICAgIC8vLy8vLy8vaWYocGxheWFibGVjYXJkQ2VsbC5zdHlsZS5ib3JkZXI9XCIwcHhcIilyZXR1cm47IC8vIGVtcHR5ICd1bmNsaWNrYWJsZScgY2VsbFxuICAgIGlmKGN1cnJlbnRQbGF5ZXIuX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChjYXJkU3VpdGUsY2FyZFJhbmspKXsgLy8gY2FyZCBhY2NlcHRlZCEhIVxuICAgICAgICBmb3JjZUZvY3VzKG51bGwpOyAvLyBnZXQgcmlkIG9mIHRoZSBmb2N1cyByZXF1ZXN0XG4gICAgICAgIHBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJcIjsgLy8gTURIQDIzSkFOMjAyMDogZ2V0IHJpZCBvZiB0aGUgcGxheSBjYXJkIHByb21wdCFcbiAgICB9XG59XG5cbi8qKlxuICogY29udmVuaWVudCB0byBiZSBhYmxlIHRvIHR1cm4gdGhlIHBsYXlhYmxlIGNhcmQgYnV0dG9ucyBvbiBhbmQgb2ZmIGF0IHRoZSByaWdodCBtb21lbnRcbiAqIEBwYXJhbSB7ZW5hYmxlfSBlbmFibGUgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnMoZW5hYmxlKXtcbiAgICAvLyBjbGlja2luZyBjYXJkICdidXR0b25zJyAobm93IGNlbGxzIGluIHRhYmxlKSwgd2UgY2FuIGdldCByaWQgb2YgdGhlIGJ1dHRvbiBpdHNlbGYhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZT9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklERElORzpcbiAgICAgICAgICAgIC8vIHdoZW4gbW92aW5nIGZyb20gdGhlIERFQUxJTkcgc3RhdGUgdG8gdGhlIEJJRERJTkcgc3RhdGUgY2xlYXIgdGhlIGJpZCB0YWJsZVxuICAgICAgICAgICAgLy8gQUxURVJOQVRJVkVMWSB0aGlzIGNvdWxkIGJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBlbmRzXG4gICAgICAgICAgICAvLyBCVVQgdGhpcyBpcyBhIGJpdCBzYWZlciEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBiaWVkZW4gaXMgYmVnb25uZW4hXCIpO1xuICAgICAgICAgICAgaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKWNsZWFyQmlkVGFibGUoKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7IC8vIGFsbG93aW5nIHRoZSB1c2VyIHRvIGNsXG4gICAgICAgICAgICAvKiBNREhAMTlKQU4yMDIwOiBpbiBkdWUgY291cnNlIHdlIHdpbGwgYmUgcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyB0d28gbGluZXNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIGluaXRpYXRlLXBsYXlpbmcgd2lsbCByZXBvcnQgb24gdGhlIGdhbWUgdGhhdCBpcyB0byBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkZJTklTSEVEOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsIGlzIGFmZ2Vsb3BlbiFcIik7XG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpzZXRJbmZvKFwiRGUgcmVnZWxzIHZhbiBoZXQgb25saW5lIHNwZWwuXCIpO2JyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dGluZ3NcIjpzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTticmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHVwLWdhbWVcIjogLy8gd2hlbiBwbGF5aW5nIGluIGRlbW8gbW9kZSwgdGhlIHVzZXIgc2hvdWxkIGVudGVyIGZvdXIgcGxheWVyIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJWdWwgZGUgbmFtZW4gdmFuIGRlIHNwZWxlcnMgaW4uIEVlbiBzcGVsZXJuYWFtIGlzIHZvbGRvZW5kZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImF1dGhcIjogLy8gcGFnZS1hdXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2VlZiBkZSBuYWFtIG9wIHdhYXJvbmRlciBVIHdpbHQgc3BlbGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FpdC1mb3ItcGxheWVyc1wiOiAvLyBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJFdmVuIGdlZHVsZCBhdWIuIFdlIHdhY2h0ZW4gdG90IGVyIGdlbm9lZyBtZWRlc3BlbGVycyB6aWpuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmlkZGluZ1wiOiAvLyBwYWdlLWJpZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvbSBkZSBiZXVydCBvcCBlZW4gdmVyem9layB0b3QgaGV0IGRvZW4gdmFuIGVlbiBib2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5LXJlcG9ydGluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5aW5nXCI6IC8vID8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvIGV2ZXJ5dGhpbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgc3RhcnRpbmcgdGhlIGdhbWUgcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIDFcIjsgLy8ganVzdCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8ganVzdCBpbiBjYXNlISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4gYmVnaW50IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiQlVHOiBVbmtub3duIHBhZ2UgJ1wiK19wYWdlK1wiJyByZXF1ZXN0ZWQhXCIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbmV4dFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBuZXh0IHBhZ2UhXCIpO1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgLy8gTURIQDA3SkFOMjAyMDogaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBuZXh0IHBhZ2UsIHdoZW4gbm90IHJ1bm5pbmcgaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBwYWdlLWF1dGggcGFnZVxuICAgIC8vICAgICAgICAgICAgICAgIGluIGRlbW8gbW9kZSBza2lwIHRoZSBhdXRoIGFuZCB3YWl0IGZvciBwbGF5ZXJzIGJ1dHRvblxuICAgIHN3aXRjaChwYWdlSW5kZXgpe1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1hdXRoXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogLy8gc2hvdWxkIHdlIGNoZWNrIHRoZSB1c2VyIG5hbWVzPz8/Pz8/XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrMSklUEFHRVMubGVuZ3RoXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBjYW5jZWxQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgcHJldmlvdXMgcGFnZS5cIik7XG4gICAgLy8gZ28gb25lIHBhZ2UgYmFja1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4K1BBR0VTLmxlbmd0aC0xKSVQQUdFUy5sZW5ndGhdKTtcbn1cbmZ1bmN0aW9uIHJldHVyblRvUHJldmlvdXNQYWdlKCl7XG4gICAgLy8gcG9wIG9mZiB0aGUgcGFnZSB3ZSBhcmUgZ29pbmcgdG8gdmlzaXQsIHByZXZlbnRpbmcgdG8gcHVzaCB0aGUgY3VycmVudFBhZ2UgYWdhaW5cbiAgICBpZih2aXNpdGVkUGFnZXMubGVuZ3RoPjApe2N1cnJlbnRQYWdlPW51bGw7c2V0UGFnZSh2aXNpdGVkUGFnZXMuc2hpZnQoKSk7fVxufVxuZnVuY3Rpb24gc2hvd0hlbHAoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIGhlbHAhXCIpO1xuICAgIHNldFBhZ2UoJ3BhZ2UtcnVsZXMnKTtcbn1cbi8vIGFzY2VydGFpbiB0byBkaXNhYmxlIHRoZSBIZWxwIGJ1dHRvbiB3aGVuIHZpZXdpbmcgaXQhISFcbmZ1bmN0aW9uIHVwZGF0ZUhlbHBCdXR0b25zKCl7XG4gICAgbGV0IGVuYWJsZUhlbHBCdXR0b249KGN1cnJlbnRQYWdlIT09J3BhZ2UtaGVscCcpO1xuICAgIGZvcihsZXQgaGVscEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWxwJykpaGVscEJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlSGVscEJ1dHRvbjtcbn1cblxuLyoqXG4gKiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbmV3LXBsYXllcnMgYnV0dG9uIGlzIGNsaWNrZWQsIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCBhIG5ldyBzZXQgb2YgcGxheWVyc1xuICovXG5mdW5jdGlvbiBuZXdQbGF5ZXJzKCl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gTmlldXdlIHNwZWxlcnMgYWFubWFrZW4uXCIpO1xuICAgIHBsYXllcnM9W107XG4gICAgbGV0IG5vUGxheWVyTmFtZXM9dHJ1ZTtcbiAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIHBsYXllciBpbnB1dCBmaWVsZHNcbiAgICBmb3IocGxheWVyTmFtZUlucHV0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKHBsYXllck5hbWVJbnB1dC52YWx1ZS5sZW5ndGg+MCl7XG4gICAgICAgICAgICBub1BsYXllck5hbWVzPWZhbHNlO1xuICAgICAgICAgICAgcGxheWVycy5wdXNoKG5ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZUlucHV0LnZhbHVlKSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgIGlmKHBsYXllcnMubGVuZ3RoPDQpXG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobnVsbCk7XG4gICAgfVxuICAgIGlmKG5vUGxheWVyTmFtZXMpe1xuICAgICAgICBwbGF5ZXJzPW51bGw7XG4gICAgICAgIHNldEluZm8oXCJHZWVuIHNwZWxlcm5hbWVuIG9wZ2VnZXZlbi4gSGViIHRlbm1pbnN0ZSBlZW4gc3BlbGVybmFhbSBub2RpZyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJSaWtrZW4gLSBoZXQgc3BlbDogTmlldXdlIHNwZWxlcnMgYWFuZ2VtYWFrdCFcIik7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbEdhbWUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7Ly9pZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJHZWVuIHNwZWwhXCIpO1xuICAgIGlmKCFyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgYWxlcnQoXCJHZWVuIHNwZWwgb20gYWYgdGUgYnJla2VuISBMYWFkIGRlemUgd2ViIHBhZ2luYSBvcG5pZXV3IVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjb25maXJtKFwiV2lsdCBVIGVjaHQgaGV0IGh1aWRpZ2Ugc3BlbCBhZmJyZWtlbj9cIikpe1xuICAgICAgICByaWtrZW5UaGVHYW1lLmNhbmNlbCgpO1xuICAgIH1cbn1cbi8qIFxuZnVuY3Rpb24gbmV3VHJpY2tCdXR0b25DbGlja2VkKCl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICAoIXJpa2tlblRoZUdhbWV8fHJpa2tlblRoZUdhbWUuc2hvd05ld1RyaWNrSW5mbygpKTtcbn1cbiovXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpdGlvbmFsIHN0dWZmIHRoYXQgd2UncmUgZ29pbmcgdG8gbmVlZCB0byBtYWtlIHRoaXMgc3R1ZmYgd29ya1xuY2xhc3MgUGxheWVyR2FtZVByb3h5IGV4dGVuZHMgUGxheWVyR2FtZSB7XG5cbiAgICBnZXRTZW5kRXZlbnQoZXZlbnQsZGF0YSxjYWxsYmFjayl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBldmVudCBcIitldmVudCtcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkrXCIuXCIpO1xuICAgICAgICByZXR1cm4gW2V2ZW50LGRhdGEsY2FsbGJhY2tdO1xuICAgIH1cblxuICAgIC8vIE1ESEAyM0pBTjIwMjA6IGNhbGxlZCBmcm9tIHVwZGF0ZUJpZHNUYWJsZVxuICAgIGdldFBsYXllckluZGV4KHBsYXllck5hbWUpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9KHRoaXMuX3BsYXllck5hbWVzP3RoaXMuX3BsYXllck5hbWVzLmxlbmd0aDowKTtcbiAgICAgICAgd2hpbGUoLS1wbGF5ZXJJbmRleD49MCYmdGhpcy5fcGxheWVyTmFtZXNbcGxheWVySW5kZXhdIT09cGxheWVyTmFtZSk7XG4gICAgICAgIGlmKHBsYXllckluZGV4PDApe2NvbnNvbGUubG9nKFwiUGxheWVyIG5hbWUgJ1wiK3BsYXllck5hbWUrXCInIG5vdCBmb3VuZCBpbiBcIitKU09OLnN0cmluZ2lmeSh0aGlzLl9wbGF5ZXJOYW1lcykrXCIuXCIpO31cbiAgICAgICAgcmV0dXJuIHBsYXllckluZGV4O1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlBsYXllcnMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoO31cblxuICAgIC8vIHdoYXQgdGhlIHBsYXllciB3aWxsIGJlIGNhbGxpbmcgd2hlbiAocyloZSBtYWRlIGEgYmlkLCBwbGF5ZWQgYSBjYXJkLCBjaG9vc2UgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZVxuICAgIGJpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdCSUQnLGJpZCxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvcmNlRm9jdXMobnVsbCk7IC8vIGEgYml0IGNydWRlIHRvIGdldCByaWQgb2YgdGhlIEJpZWRlbiBwYWdlIG5hbWUgdGhvdWdoXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCSUQgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAgICAgfSkpOyAvLyBubyBuZWVkIHRvIHNlbmQgdGhlIHBsYXllciBpZCBJIHRoaW5rLi4uIHsnYnknOnRoaXMuX3BsYXllckluZGV4LCdiaWQnOmJpZH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UncmUgc2VuZGluZyB0aGUgZXhhY3QgY2FyZCBvdmVyIHRoYXQgd2FzIHBsYXllZCAoYW5kIGFjY2VwdGVkIGF0IHRoaXMgZW5kIGFzIGl0IHNob3VsZCBJIGd1ZXNzKVxuICAgIC8vIE1ESEAxNEpBTjIwMjA6IHBhc3NpbmcgaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkICdmbGFnJyBhcyB3ZWxsISEhIVxuICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2Ugd2UncmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBSaWtrZW5UaGVHYW1lIGltcGxlbWVudGF0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQgZG9lc24ndCBlbmQgdXAgaW4gdGhlIGxvY2FsIFJpa2tlblRoZUdhbWUgdHJpY2tcbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogZGlzYWJsZSB0aGUgYnV0dG9ucyBvbmNlIHRoZSBjYXJkIGlzIGFjY2VwdGVkICh0byBiZSBwbGF5ZWQhISEpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIFRPRE8gcGVyaGFwcyBoaWRpbmcgdGhlIGNhcmRzIHNob3VsZCBhbHNvIGJlIGRvbmUgaGVyZSEhIVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgY2FyZCBwbGF5ZWQ6IFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ0NBUkQnLFtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF0sZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ0FSRCBwbGF5ZWQgcmVjZWlwdCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICAgICAgfSkpOyAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnY2FyZCc6W2NhcmQuc3VpdGUsY2FyZC5yYW5rXX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCguLi50aGlzLmdldFNlbmRFdmVudCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvcmNlRm9jdXMobnVsbCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBldmVudCByZWNlaXB0IGFja25vd2xlZGdlZC5cIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGFzY2VydGFpbiB0byBoaWRlIHRoZSB0cnVtcCBzdWl0ZSBpbnB1dCBlbGVtZW50XG4gICAgICAgICAgICB9KSk7IC8vIHNhbWUgaGVyZTogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6dHJ1bXBTdWl0ZX0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoLi4udGhpcy5nZXRTZW5kRXZlbnQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgc3VpdGUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGFzY2VydGFpbiB0byBoaWRlIHRoZSBwYXJ0bmVyIHN1aXRlIGlucHV0IGVsZW1lbnRcbiAgICAgICAgICAgIH0pKTsgLy8gcmVwbGFjaW5nOiB7J3BsYXllcic6dGhpcy5fcGxheWVySW5kZXgsJ3N1aXRlJzpwYXJ0bmVyU3VpdGV9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KC4uLnRoaXMuZ2V0U2VuZEV2ZW50KCdCWUUnLHJlYXNvbixmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCWUUgZXZlbnQgcmVjZWlwdCBhY2tub3dsZWRnZWQhXCIpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZC5wdXNoKHtldmVudDpldmVudCxkYXRhOmRhdGF9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gVE9ETyBoYXZlIHRvIGNoYW5nZSB0aGlzIHRvIGluY2x1ZGUgdGhlIGZyaWVuZGx5IGZsYWcgYXMgd2VsbCEhISFcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgcmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcblxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1wbGF5ZXJOYW1lcztcblxuICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0oIXRoaXMuX3BsYXllck5hbWVzfHx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg8ND8tMTp0aGlzLl9wbGF5ZXJOYW1lcy5pbmRleE9mKGN1cnJlbnRQbGF5ZXIubmFtZSkpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmluZGV4PXRoaXMuX3BsYXllckluZGV4O1xuICAgICAgICBpZih0aGlzLl9wbGF5ZXJJbmRleD49MCl7XG4gICAgICAgICAgICB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIHNob3dQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgb24gcGFnZS1wbGF5aW5nIE9OQ0UgYXMgaXQgd2lsbCBhbHdheXMgc3RheSB0aGUgc2FtZVxuICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAvLyByZXBsYWNpbmc6IHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIiksdGhpcy5nZXRQbGF5ZXJOYW1lKHRoaXMuX3BsYXllckluZGV4KSwtMik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQ3VycmVudCBwbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgIGlmKHRoaXMuX3BsYXllck5hbWVzKVxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogVXcgbmFhbSBrb210IG5pZXQgdm9vciBpbiBkZSBzcGVsZXJsaWpzdCB2YW4gaGV0IHRlIHNwZWxlbiBzcGVsIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpe1xuICAgICAgICByZXR1cm4ocGxheWVySW5kZXg+PTAmJnBsYXllckluZGV4PHRoaXMuX251bWJlck9mVHJpY2tzV29uLmxlbmd0aD90aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwbGF5ZXJJbmRleF06MCk7XG4gICAgfVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogd2lsbCBiZSByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudCB3aGVuIGEgbmV3IHRyaWNrIHN0YXJ0c1xuICAgIC8vIE1ESEAyMkpBTjIwMjA6IHVzZXIgd2lsbCBoYXZlIHRvIGNsaWNrIHRoZSBuZXcgdHJpY2sgYnV0dG9uIHNvIHRoZXkgY2FuIGxvb2sgYXQgdGhlIG9sZCB0cmljayBmaXJzdFxuICAgIG5ld1RyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIFxuICAgICAgICAvLyBBU1NFUlQgb25seSBjYWxsIHdoZW4gdHJpY2tJbmZvIGlzIG5vdCBOVUxMISEhISFcbiAgICAgICAgaWYoIXRyaWNrSW5mbyl7YWxlcnQoXCJCVUc6IE5vIHRyaWNrIGluZm8hXCIpO3JldHVybjt9XG5cbiAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7IC8vIHJlbW92ZSB0aGUgY2FyZHMgc2hvd2luZyBmcm9tIHRoZSBwcmV2aW91cyB0cmlja1xuXG4gICAgICAgIC8vIHNob3cgdGhlIGlkIG9mIHRoZSB0cmljayAod2hpY2ggaXMgdGhlIHRyaWNrIGluZGV4KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgXCIrdHJpY2tJbmZvLmluZGV4O1xuXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPXRyaWNrSW5mby5pbmRleC0xO1xuXG4gICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpOyAvLyBzaG93IHRoZSBmaW5pc2hlZCB0cmljayBpbiB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZVxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyB0cmljayB3aXRoIHRoZSBpbmZvcm1hdGlvbiBpbiB0aGUgdHJpY2sgaW5mb1xuICAgICAgICB0aGlzLl90cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRoaXMuX3RydW1wU3VpdGUsdGhpcy5fcGFydG5lclN1aXRlLHRoaXMuX3BhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCx0cmlja0luZm8uZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKTtcbiAgICBcbiAgICB9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiBpZiB3ZSByZWNlaXZlIGFsbCBwYXJ0bmVycyB3ZSBjYW4gZXh0cmFjdCB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBfc2V0UGFydG5lcklkcyhwYXJ0bmVySWRzKXtcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1wYXJ0bmVySWRzO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj0odGhpcy5fcGFydG5lcklkcyYmdGhpcy5fcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllckluZGV4PHRoaXMuX3BhcnRuZXJJZHMubGVuZ3RoP3RoaXMuX3BhcnRuZXJJZHNbdGhpcy5fcGxheWVySW5kZXhdOm51bGwpO1xuICAgIH1cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIHRoaXMuX3RyaWNrLmFkZENhcmQobmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mby5zdWl0ZSxjYXJkSW5mby5yYW5rKSk7XG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IGV2ZXJ5IGNhcmQgcGxheWVkIGNvbnRhaW5zIHRoZSBwYXJ0bmVycyBhcyB3ZWxsISEhXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGFydG5lcnNcIikpdGhpcy5fc2V0UGFydG5lcklkcyhjYXJkSW5mby5wYXJ0bmVycyk7IFxuICAgICAgICAvLyBpZiBhbGwgdGhlIGNhcmRzIGluIHRoZSB0cmljayBoYXZlIGJlZW4gcGxheWVkLCB0aGUgd2lubmVyIGlzIGRlZmluaXRlLCBhbmQgd2lucyB0aGUgdHJpY2tcbiAgICAgICAgaWYodGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcz09PTQpdGhpcy5fbnVtYmVyT2ZUcmlja3NXb25bdGhpcy5fdHJpY2sud2lubmVyXSsrO1xuICAgICAgICAvLyBkbyBub3RoaW5nLi4uXG4gICAgICAgIC8vIHNob3dUcmlja0NhcmQodGhpcy5fdHJpY2suZ2V0TGFzdENhcmQoKSx0aGlzLl90cmljay5udW1iZXJPZkNhcmRzKTtcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsvL2lmKHRoaXMuX3RyaWNrV2lubmVyKXt0aGlzLl90cmlja1dpbm5lcj1udWxsO3Nob3dUcmljayh0aGlzLl90cmljayk7fVxuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0cmlja0luZm8udHJ1bXBTdWl0ZSx0cmlja0luZm8ucGFydG5lclN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAvLyBhbHJlYWR5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IhISFcbiAgICAgICAgLy8gdHJpY2suX2ZpcnN0UGxheWVyPXRyaWNrSW5mby5maXJzdFBsYXllcjtcbiAgICAgICAgLy8gdHJpY2suX2NhbkFza0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgaWYodHJpY2tJbmZvLmNhcmRzJiZ0cmlja0luZm8uY2FyZHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZmlsbCB0aGUgdHJpY2sgd2l0aCB0cmljayBpbmZvcm1hdGlvbiBmcm9tIHRoZSBvdGhlciBwbGF5ZXJzISEhXG4gICAgICAgICAgICB0cmlja0luZm8uY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSkuaG9sZGVyPXRyaWNrO30pOyAvLyBzdG9yZSB0aGUgY2FyZHMgcmVjZWl2ZWQgaW4gdHJpY2tcbiAgICAgICAgICAgIHRyaWNrLl93aW5uZXI9dHJpY2tJbmZvLndpbm5lcjtcbiAgICAgICAgICAgIHRyaWNrLl9wbGF5U3VpdGU9dHJpY2tJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgIHRyaWNrLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWNrO1xuICAgIH1cbiAgICAqL1xuXG4gICAgYWNrbm93bGVkZ2VFdmVudHMoKXtcbiAgICAgICAgLy8gbm93IGlmIHRoZSB1bmFja25vd2xlZGdlIGV2ZW50IGlkcyBkbyBOT1QgcmVhY2ggdGhlIHNlcnZlciB3ZSB3aWxsIHJlY2VpdmUgY2VydGFpbiBldmVudHMgYWdhaW4gdW50aWwgd2UgZG9cbiAgICAgICAgLy8gbWFuYWdlIHRvIGdldCB0aGVtIG92ZXJcbiAgICAgICAgLy8gbWFrZSBhIGNvcHkgb2YgYWxsIHRoZSB1bmFja25vd2xlZGdlZCBldmVudHNcbiAgICAgICAgbGV0IGFja25vd2xlZGdlYWJsZUV2ZW50cz10aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5tYXAoKHVuYWNrbm93bGVkZ2VkRXZlbnQpPT5PYmplY3QuYXNzaWduKHt9LHVuYWNrbm93bGVkZ2VkRXZlbnQpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGFja25vd2xlZGdlYWJsZSBldmVudHM6IFwiLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgIC8vIG9mIGNvdXJzZSB3ZSBjb3VsZCBzZW5kIHRoZW0gcGFzc2luZyBhbiBhY2tub3dsZWRnZSBmdW5jdGlvbiB0aG91Z2hcbiAgICAgICAgaWYoYWNrbm93bGVkZ2VhYmxlRXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGVtaXQgcGFzc2luZyBhbG9uZyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdldCBjYWxsZWQgd2hlbiB0aGUgQUNLIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwiQUNLXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzLCgpPT57XG4gICAgICAgICAgICAgICAgLy8gd2Ugbm93IG1heSByZW1vdmUgYWxsIGFja25vd2xlZGdlYWJsZSBldmVudHNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKiBFdmVudHMgYWNrbm93bGVkZ2VtZW50cyByZWNlaXZlZCEgKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vLy8vZGlmZmVyZW5jZSh0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cyxhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkdXBsaWNhdGVkIGZyb20gc2VydmVyLXNpZGUgUmlra2VuVGhlR2FtZS5qcyB0aGF0IHdpbGwgdHJhbnNsYXRlIHRoaXMuX3BsYXllcnNCaWRzIHRvIHJlYWRhYmxlIGJpZHNcbiAgICAvLyB0byBiZSBwYXNzZWQgdG8gdXBkYXRlQmlkc1RhYmxlKCkhISFcbiAgICBfZ2V0UGxheWVyQmlkc09iamVjdHMoKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3RzPVtdO1xuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWRzKT0+e1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9e25hbWU6dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckJpZHNPYmplY3RzLmxlbmd0aCksYmlkczpbXX07XG4gICAgICAgICAgICAvLyB1c2UgdW5zaGlmdCBOT1QgcHVzaCBhcyB0aGUgYmlkcyBhcmUgc3RvcmVkIHJldmVyc2Ugb3JkZXIgXG4gICAgICAgICAgICBwbGF5ZXJCaWRzLmZvckVhY2goKHBsYXllckJpZCk9PntwbGF5ZXJCaWRzT2JqZWN0LmJpZHMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1twbGF5ZXJCaWRdKX0pO1xuICAgICAgICAgICAgcGxheWVyQmlkc09iamVjdHMucHVzaChwbGF5ZXJCaWRzT2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJCaWRzT2JqZWN0cztcbiAgICB9XG5cbiAgICAvLyBnZW5lcmljIG1ldGhvZCBmb3IgcHJvY2Vzc2luZyBhbnkgZXZlbnQsIGV2ZXJ5XG4gICAgcHJvY2Vzc0V2ZW50KGV2ZW50LGV2ZW50RGF0YSxhY2tub3dsZWRnZSl7XG4gICAgICAgIC8vIGxvZyBldmVyeSBldmVudFxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGV2ZW50LGV2ZW50RGF0YSk7XG4gICAgICAgIGlmKCFldmVudERhdGEpcmV0dXJuO1xuICAgICAgICAvLyBpZiBkYXRhIGhhcyBhbiBpZCBpdCBuZWVkcyB0byBiZSBhY2tub3dsZWRnZWRcbiAgICAgICAgbGV0IGV2ZW50SWQ9KGV2ZW50RGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpP2V2ZW50RGF0YS5pZDpudWxsKTtcbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbiBldmVudCBpZCBpbiB0aGlzIGV2ZW50LCBhbmQgd2UncmUgc3VwcG9zZWQgdG8gc2VuZCBhY2tub3dsZWRnZW1lbnRzLCBkbyBzb1xuICAgICAgICBpZihldmVudElkKXtcbiAgICAgICAgICAgIC8vIE1ESEAxN0pBTjIwMjA6IG5vdyBwdXNoIHRoZSBldmVudCBuYW1lIGFzIHdlbGwgc28gdGhlIHNlcnZlciBjYW4gbG9nIHRoYXQgYW5kIHdlIGNhbiBzZWUgd2hhdCdzIGFja25vd2xlZ2RlZCEhIVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgQlVUIGRvbid0IHB1c2ggaXQgYWdhaW4gaWYgaXQncyBhbHJlYWR5IHRoZXJlISEhIVxuICAgICAgICAgICAgaWYoYWNrbm93bGVkZ2UpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoPT09MHx8dGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHNbdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoLTFdLmlkIT09ZXZlbnRJZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMucHVzaCh7J2lkJzpldmVudElkLCdldmVudCc6ZXZlbnR9KTtcbiAgICAgICAgICAgIHRoaXMuYWNrbm93bGVkZ2VFdmVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YT0oZXZlbnRJZD9ldmVudERhdGEucGF5bG9hZDpldmVudERhdGEpO1xuICAgICAgICBzd2l0Y2goZXZlbnQpe1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRFQ0hBTkdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVcIjpcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdhbWUgaW5mb3JtYXRpb24gcmVjZWl2ZWQgYnkgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicuXCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgICAgICAvLyBpZihkYXRhLmhhc093blByb3BlcnR5KCdwbGF5ZXJzJykpdGhpcy5wbGF5ZXJOYW1lcz1kYXRhLnBsYXllcnM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSU1wiOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZXM9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJERUFMRVJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWFsZXI9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDQVJEU1wiOlxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBob2xkYWJsZSBjYXJkIGZyb20gY2FyZEluZm8gcGFzc2luZyBpbiB0aGUgY3VycmVudCBwbGF5ZXIgYXMgY2FyZCBob2xkZXJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUEFSVE5FUlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwaWNhbGx5IHRoZSBnYW1lIGluZm8gY29udGFpbnMgQUxMIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdGhlIGdhbWUgdGhhdCBpcyBnb2luZyB0byBiZSBwbGF5ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gaS5lLiBhZnRlciBiaWRkaW5nIGhhcyBmaW5pc2hlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnVtcFN1aXRlPWRhdGEudHJ1bXBTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPWRhdGEucGFydG5lclN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1kYXRhLnBhcnRuZXJSYW5rO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkPWRhdGEuaGlnaGVzdEJpZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZGRlcnM9ZGF0YS5oaWdoZXN0QmlkZGVycztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm91cnRoQWNlUGxheWVyPWRhdGEuZm91cnRoQWNlUGxheWVyO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBtb3ZlIHNob3dpbmcgdGhlIGdhbWUgaW5mbyBmcm9tIHBsYXlBQ2FyZCgpIHRvIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyUmFuaz49MCl7IC8vIGEgcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclN1aXRlRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXN1aXRlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fcGFydG5lclN1aXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJSYW5rRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaW5oZXJpdFwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgLy8gbm8gcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lckVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lcicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19CSURcIjpcbiAgICAgICAgICAgICAgICBpZihkYXRhIT09Y3VycmVudFBsYXllci5uYW1lKVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiBcIitkYXRhK1wiLlwiKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBib2QgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgIC8vIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2F0IHdpbCBqZSBzcGVsZW4/XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTUFLRV9BX0JJRFwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIubWFrZUFCaWQoZGF0YS5wbGF5ZXJCaWRzT2JqZWN0cyxkYXRhLnBvc3NpYmxlQmlkcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQklEX01BREVcIjogLy8gcmV0dXJuZWQgd2hlbiBhIGJpZCBpcyBtYWRlIGJ5IHNvbWVvbmVcbiAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyB0byByZWNlaXZlIGluIGRhdGEgYm90aCB0aGUgcGxheWVyIGFuZCB0aGUgYmlkXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9Z2V0QmlkSW5mbyhkYXRhLmJpZCxkYXRhLnBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXg/bnVsbDp0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkc1tkYXRhLnBsYXllcl0ucHVzaChkYXRhLmJpZCk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBob3cgdG8gc2hvdyB0aGUgYmlkcz8/Pz8/XG4gICAgICAgICAgICAgICAgdXBkYXRlQmlkc1RhYmxlKHRoaXMuX2dldFBsYXllckJpZHNPYmplY3RzKCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX1BMQVlcIjpcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gXCIrZGF0YStcIi5cIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QhXCIpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJTcGVlbCBlZW4ga2FhcnQgYmlqLlwiO1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgY29udGFpbiB0aGUgY3VycmVudCBjYXJkcyB0aGUgdXNlciBoYXNcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8qIE1ESEAyM0pBTjIwMjA6IGdhbWUga2VlcHMgdHJhY2sgb2YgdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGJ5IGVhY2ggcGxheWVyISEhISFcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYW5kIHRvIHdpblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLm51bWJlck9mVHJpY2tzV29uPWRhdGEubnVtYmVyT2ZUcmlja3NXb247XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gUExBWUVSX0lORk8gZG9lcyBub3QgbmVlZCB0byBzZW5kIHRoZSBmb2xsb3dpbmcgd2l0aCBlYWNoIFBMQVlFUl9JTkZPIFRIT1VHSFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YS5udW1iZXJPZlRyaWNrc1RvV2luKTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTX1RPX1dJTlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJORVdfVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1RyaWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRfUExBWUVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDYXJkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlfQV9DQVJEXCI6XG4gICAgICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IE5PVCBhbnltb3JlXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX3RyaWNrKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBVIHdvcmR0IG9tIGVlbiBrYWFydCBnZXZyYWFnZCBpbiBlZW4gb25nZWRlZmluaWVlcmRlIHNsYWchXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBvY2Nhc3Npb25hbGx5IHdlIG1heSByZWNlaXZlIHRoZSByZXF1ZXN0IHRvIHBsYXkgQkVGT1JFIGFjdHVhbGx5IGhhdmluZyByZWNlaXZlZCB0aGUgc3RhdGUgY2hhbmdlISFcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGFnZSE9PVwicGFnZS1wbGF5aW5nXCIpc2V0UGFnZShcInBhZ2UtcGxheWluZ1wiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9UUlVNUF9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlVHJ1bXBTdWl0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlUGFydG5lclN1aXRlKGRhdGEuc3VpdGVzLGRhdGEucGFydG5lclJhbmtOYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1wiOlxuICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrcyh0aGlzLnBhcnNlVHJpY2soZGF0YSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLU1wiOiAvLyBNREhAMjNKQU4yMDIwOiB3b24ndCBiZSByZWNlaXZpbmcgdGhpcyBldmVudCBhbnltb3JlLi4uXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHRyYWN0IHRoZSB0cmlja3MgZnJvbSB0aGUgYXJyYXkgb2YgdHJpY2tzIGluIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpY2tzPWRhdGEubWFwKCh0cmlja0luZm8pPT57cmV0dXJuIHRoaXMucGFyc2VUcmljayh0cmlja0luZm8pO30pO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUkVTVUxUU1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2Ugd29uJ3QgYmUgcmVjZWl2aW5nIGEgbmV3IHRyaWNrIGV2ZW50LCBidXQgd2Ugc3RpbGwgd2FudCB0byBzaG93IHRoZSB1c2VyIHRoYXQgd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIGNoZWNrIGlmIHRoZSBwYWdlIG1vdmVkIHRvIHRoZSByZXN1bHRzIHBhZ2U/Pz8/Pz9cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBiZXR0ZXIgbm90IHRvIGdvIG91dCBvZiBvcmRlciB3aGVuIHRoaXMgaGFwcGVucyEhISEhIVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJiaW5kaW5nIG1ldCBkZSBzZXJ2ZXIgKHRpamRlbGlqaykgdmVyYnJva2VuIVwiKTsgLy8gcmVwbGFjaW5nOiB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIGV2ZW50IFwiK2V2ZW50K1wiIHJlY2VpdmVkIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJlcGFyaW5nIGZvciBjb21tdW5pY2F0aW9uXCIpO1xuICAgICAgICAvLyB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgIC8vICAgICB0aGlzLl9zdGF0ZT1JRExFO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vIGtlZXAgdHJhY2sgb2YgdGhlIHVuYWNrbm93bGVkZ2VkRXZlbnRJZHNcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywoKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdkaXNjb25uZWN0JyxudWxsLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1NUQVRFQ0hBTkdFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnU1RBVEVDSEFOR0UnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWUVSUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUlMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignREVBTEVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnREVBTEVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUEFSVE5FUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BBUlRORVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRV9JTkZPJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRV9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19CSURcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ01BS0VfQV9CSUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdNQUtFX0FfQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0JJRF9NQURFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQklEX01BREUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX1BMQVlcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fUExBWScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gTURIQDEzSkFOMjAyMDogcGxheWVyIGluZm8gd2lsbCBiZSByZWNlaXZlZCBiZWZvcmUgYmVpbmcgYXNrZWQgdG8gcGxheSBhIGNhcmQgdG8gdXBkYXRlIHRoZSBwbGF5ZXIgZGF0YVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJQTEFZRVJfSU5GT1wiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1NfVE9fV0lOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTX1RPX1dJTicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdORVdfVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdORVdfVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRF9QTEFZRUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDQVJEX1BMQVlFRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZX0FfQ0FSRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlfQV9DQVJEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9UUlVNUF9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NIT09TRV9UUlVNUF9TVUlURScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfUEFSVE5FUl9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1MnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1MnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUkVTVUxUUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1JFU1VMVFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRU9WRVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FT1ZFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBtdWx0aXBsZSBldmVudHMgYXMgYSB3aG9sZSwgd2UgcHJvY2VzcyBhbGwgb2YgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignRVZFTlRTJywoZXZlbnRzKT0+e1xuICAgICAgICAgICAgLy8gd2UgY291bGQgY29uc3VtZSB0aGUgZXZlbnRzIEkgZ3Vlc3NcbiAgICAgICAgICAgIHdoaWxlKGV2ZW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZXZlbnQ9ZXZlbnRzLnNoaWZ0KCk7IC8vIHJlbW92ZSB0aGUgZmlyc3QgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBhc2NlcnRhaW4gdG8gc2VuZCBhbGwgdW5hY2tub3dsZWRnZWQgZXZlbnQgaWRzIHdoZW4gdGhpcyBpcyB0aGUgbGFzdCBwcm9jZXNzIGV2ZW50ISEhIVxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50LmV2ZW50LGV2ZW50LmRhdGEsZXZlbnRzLmxlbmd0aD09PTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBNREhAMDhKQU4yMDIwOiBzb2NrZXQgc2hvdWxkIHJlcHJlc2VudCBhIGNvbm5lY3RlZCBzb2NrZXQuaW8gaW5zdGFuY2UhISFcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQpe1xuICAgICAgICAvLyBPT1BTIGRpZG4ndCBsaWtlIGZvcmdldHRpbmcgdGhpcyEhISBcbiAgICAgICAgLy8gYnV0IFBsYXllckdhbWUgZG9lcyBOT1QgaGF2ZSBhbiBleHBsaWNpdCBjb25zdHJ1Y3RvciAoaS5lLiBubyByZXF1aXJlZCBhcmd1bWVudHMpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c1JlY2VpdmVkPVtdO1xuICAgICAgICB0aGlzLl90cmlja1dpbm5lcj1udWxsO1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fc29ja2V0PXNvY2tldDtcbiAgICAgICAgdGhpcy5fZGVhbGVyPS0xO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xOy8vdGhpcy5fdHJ1bXBQbGF5ZXI9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTt0aGlzLl9wYXJ0bmVyUmFuaz0tMTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NXb249WzAsMCwwLDBdOyAvLyBhc3N1bWUgbm8gdHJpY2tzIHdvbiBieSBhbnlib2R5XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPTA7dGhpcy5fdHJpY2s9bnVsbDtcbiAgICAgICAgdGhpcy5faGlnaGVzdEJpZD0tMTt0aGlzLl9oaWdoZXN0QmlkZGVycz1bXTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcz1bW10sW10sW10sW11dOyAvLyBNREhAMjFKQU4yMDIwOiBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgYmlkcyB0byBzaG93XG4gICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50cz1udWxsO1xuICAgICAgICAvLyB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fdGVhbU5hbWVzPW51bGw7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyB0aGUgJ2N1cnJlbnQnIHBsYXllclxuICAgICAgICAvLyB0aGluZ3Mgd2UgY2FuIHN0b3JlIGludGVybmFsbHkgdGhhdCB3ZSByZWNlaXZlIG92ZXIgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fbmFtZT1udWxsOyAvLyB0aGUgbmFtZSBvZiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1udWxsOyAvLyB0aGUgbmFtZXMgb2YgdGhlIHBsYXllcnNcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1udWxsOyAvLyB0aGUgcGFydG5lclxuICAgICAgICB0aGlzLnByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgaXRzZWxmIG9yZ2FuaXplZCBieSBzdGF0ZVxuICAgIC8vIFBMQVlJTkdcbiAgICBnZXRUcnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAvLyBnZXRUcnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9XG4gICAgXG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXsgLy8gb25seSB3aGVuIHBsYXllciBlcXVhbHMgdGhpcy5fcGxheWVySW5kZXggZG8gd2Uga25vdyB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lcj0ocGxheWVyPT09dGhpcy5fcGxheWVySW5kZXg/Y3VycmVudFBsYXllci5wYXJ0bmVyOi0xKTtcbiAgICAgICAgcmV0dXJuKHBhcnRuZXI+PTAmJnBhcnRuZXI8dGhpcy5udW1iZXJPZlBsYXllcnM/dGhpcy5fcGxheWVyTmFtZXNbcGFydG5lcl06bnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnM7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZDt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIC8vIGdldFBsYXllck5hbWUocGxheWVyKXtyZXR1cm4odGhpcy5fcGxheWVyTmFtZXMmJnBsYXllcjx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg/dGhpcy5fcGxheWVyTmFtZXNbcGxheWVyXTpcIj9cIik7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe3JldHVybiB0aGlzLl9kZWx0YVBvaW50czt9XG4gICAgZ2V0IHBvaW50cygpe3JldHVybiB0aGlzLl9wb2ludHM7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCxvdGhlclBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGFydG5lcklkcz90aGlzLl9wYXJ0bmVySWRzW3BsYXllckluZGV4XT09PW90aGVyUGxheWVySW5kZXg6ZmFsc2UpO31cbiAgICAvLyBnZXRMYXN0VHJpY2tQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbGFzdFRyaWNrUGxheWVkO30gLy8gVE9ETyBzdGlsbCB1c2VkPz8/Pz9cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ7fVxuICAgIC8vIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcjt9XG4gICAgZ2V0VGVhbU5hbWUocGxheWVySW5kZXgpe1xuICAgICAgICAvLyBjb21wdXRpbmcgdGhlIHRlYW0gbmFtZSBvbiB0aGUgZmx5XG4gICAgICAgIGxldCB0ZWFtTmFtZT10aGlzLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICBsZXQgcGFydG5lckluZGV4PSh0aGlzLl9wYXJ0bmVySWRzP3RoaXMuX3BhcnRuZXJJZHNbcGxheWVySW5kZXhdOi0xKTsgLy8gTk9URSBjb3VsZCBiZSBudWxsISEhXG4gICAgICAgIGlmKHBhcnRuZXJJbmRleCYmcGFydG5lckluZGV4Pj0wKXRlYW1OYW1lKz1cIiAmIFwiK3RoaXMuZ2V0UGxheWVyTmFtZShwYXJ0bmVySW5kZXgpO1xuICAgICAgICByZXR1cm4gdGVhbU5hbWU7XG4gICAgfVxuXG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAvLyBob3cgYWJvdXQgcHJvbXB0aW5nIHRoZSB1c2VyPz8/Pz9cbiAgICAgICAgLy8gaWYoIWN1cnJlbnRQbGF5ZXJ8fCFjdXJyZW50UGxheWVyLmdhbWUpcmV0dXJuOyAvLyBkbyBub3QgYXNrIHRoZSB1c2VyIHdoZXRoZXIgdGhleSB3YW50IHRvIHN0YXkgb3Igbm90IChhcyB0aGV5IGNhbm5vdCBzdGF5KVxuICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyB2aWV3aW5nIHRoZSByZXN1bHRzIHBhZ2Ugd2UgbWF5IGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIGFjdHVhbGx5IG92ZXJcbiAgICAgICAgcmV0dXJuKGN1cnJlbnRQYWdlPT09J3BhZ2UtcmVzdWx0cyc/XCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi4gVG90IGRlIHZvbGdlbmRlIGtlZXIhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XCJIZXQgc3BlbCBpcyBub2cgbmlldCB0ZW4gZWluZGUuIEJsaWpmIG9wIGRlIHBhZ2luYSBvbSB0b2NoIHZlcmRlciB0ZSBzcGVsZW4uXCIpO1xuICAgIH07XG4gICAgLy8gaWYgd2UgYWN0dWFsbHkgZW5kIHVwIGluIGxlYXZpbmcgdGhpcyBVUkwsIHdlIGRlZmluaXRlbHkgd2FudCB0byBraWxsIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgZm9yIGdvb2RcbiAgICB3aW5kb3cub25wb3BzdGF0ZT1mdW5jdGlvbigpe1xuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICAoIWN1cnJlbnRQbGF5ZXJ8fGN1cnJlbnRQbGF5ZXIuZXhpdCgpKTsgLy8gYXBwYXJlbnRseSB0aGUgY3VycmVudCBwbGF5ZXIgc2hvdWxkIGV4aXQhISEhXG4gICAgICAgIHNldFBsYXllck5hbWUobnVsbCxudWxsKTsgLy8gd2l0aG91dCBjYWxsYmFjayBubyBwYWdlIHNob3VsZCBiZSBzaG93biBhbnltb3JlLi4uXG4gICAgfVxuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogaGlkZSB0aGUgYmlkZGluZyBhbmQgcGxheWluZyBlbGVtZW50c1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgLy8gcmVwbGFjZWQgYnkgYmlkLWluZm86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItYmlkXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XG4gICAgLy8gRE8gTk9UIERPIFRISVMgV0lMTCBPVkVSUlVMRSBQQVJFTlQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwidmlzaWJsZVwiOyAvLyBNREhAMTlKQU4yMDIwOiBcImhpZGRlblwiIGNoYW5nZWQgdG8gXCJ2aXNpYmxlXCIgYXMgd2UgbmV2ZXIgaGlkZSB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgcGxheWVyc1xuICAgIC8vIHJlcGxhY2VkIGJ5IHBsYXktaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gTURIQDE5SkFOMjAyMDogYW5kIHZpY2UgdmVyc2FcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcbiAgICBmb3IobGV0IHN0b3BCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RvcCcpKXN0b3BCdXR0b24ub25jbGljaz1zdG9wUGxheWluZztcbiAgICBcbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWU7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgc3VpdGUgZWxlbWVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIHNob3cgdGhlIHJpZ2h0IHRleHQhISEhXG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPDQ7c3VpdGUrKylcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLlwiK0NhcmQuU1VJVEVfTkFNRVNbc3VpdGVdKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnZhbHVlPUNhcmQuU1VJVEVfQ0hBUkFDVEVSU1tzdWl0ZV07XG4gICAgXG4gICAgLyogTURIQDIySkFOMjAyMDogZXZlbnQgaGFuZGxlciBmb3IgY2xpY2tpbmcgdGhlIG5ldyB0cmljayBidXR0b25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikub25jbGljaz1uZXdUcmlja0J1dHRvbkNsaWNrZWQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICovXG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBjaGVjayBmb3IgYSB1c2VyIG5hbWVcbiAgICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICBsZXQgaW5pdGlhbFBsYXllck5hbWU9KHVybFBhcmFtcy5oYXMoXCJwbGF5ZXJcIik/dXJsUGFyYW1zLmdldChcInBsYXllclwiKS50cmltKCk6bnVsbCk7XG4gICAgaWYoaW5pdGlhbFBsYXllck5hbWUpc2V0UGxheWVyTmFtZShpbml0aWFsUGxheWVyTmFtZSwoZXJyKT0+e30pO1xuXG59O1xuXG4vLyBNREhAMDhKQU4yMDIwOiBncmVhdCBpZGVhIHRvIG1ha2UgZXZlcnl0aGluZyB3b3JrIGJ5IGFsbG93aW5nIHRvIHNldCB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIF9zZXRQbGF5ZXIocGxheWVyLGVycm9yY2FsbGJhY2spe1xuICAgIHZpc2l0ZWRQYWdlcz1bXTsgLy8gZm9yZ2V0IHZpc2l0ZWQgcGFnZXNcbiAgICBjdXJyZW50UGFnZT1udWxsOyAvLyBhc2NlcnRhaW4gdG8gbm90IGhhdmUgYSBwYWdlIHRvIHN0b3JlXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgY3VycmVudCBwbGF5ZXIgKGlmIGFueSksIGFuZCBpbiBlZmZlY3Qgd2UnbGwgbG9vc2UgdGhlIGdhbWUgYXMgd2VsbFxuICAgIGlmKGN1cnJlbnRQbGF5ZXIpe1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNoYW5nZSBjdXJyZW50UGxheWVyIGJlY2F1c2UgaXQncyBnb25uYSBiZSByZXBsYWNlZCBhbnl3YXlcbiAgICAgICAgLy8gYnV0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIgYW55d2F5XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9Y3VycmVudFBsYXllci5fY2xpZW50O1xuICAgICAgICAvLyBkaXNjb25uZWN0IGlmIG5lZWQgYmVcbiAgICAgICAgKCFjbGllbnRzb2NrZXR8fCFjbGllbnRzb2NrZXQuY29ubmVjdGVkfHxjbGllbnRzb2NrZXQuZGlzY29ubmVjdCgpKTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBjdXJyZW50UGxheWVyLmdhbWU9bnVsbDsgLy8gZ2V0IHJpZCBvZiB0aGUgZ2FtZSAod2hpY2ggd2lsbCBkaXNjb25uZWN0IHRoZSBzb2NrZXQgYXMgd2VsbCkgV0lTSEZVTCBUSElOS0lORy4uLlxuICAgICAgICBjdXJyZW50UGxheWVyPW51bGw7XG4gICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICBpZihlcnJvcmNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBNREhAMTBKQU4yMDIwOiB3aGVuZXZlciB0aGUgY3VycmVudFBsYXllciBpcyBOT1QgYXZhaWxhYmxlIGdvIHRvIFwicGFnZS1ydWxlc1wiXG4gICAgfVxuICAgIC8vIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIHRoZSBwYWdlIHdlIGNhbiBzaG93IGlmIHRoZXJlJ3Mgbm8gcGxheWVyISEhISAoVE9ETyBvciBwYWdlLWF1dGg/Pz8/PylcbiAgICBpZihwbGF5ZXIpe1xuICAgICAgICBsZXQgY2xpZW50c29ja2V0PWlvKGxvY2F0aW9uLnByb3RvY29sKycvLycrbG9jYXRpb24uaG9zdCk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdCcsKCk9PntcbiAgICAgICAgICAgIGlmKGNsaWVudHNvY2tldC5jb25uZWN0ZWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKChjdXJyZW50UGxheWVyP1wiUmVjb25uZWN0ZWRcIjpcIkNvbm5lY3RlZFwiKStcIiB0byB0aGUgZ2FtZSBzZXJ2ZXIhXCIpO1xuICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50UGxheWVyKXsgLy8gZmlyc3QgdGltZSBjb25uZWN0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXI9cGxheWVyO1xuICAgICAgICAgICAgICAgICAgICBzaG93Q3VycmVudFBsYXllck5hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdW5mb3J0dW5hdGVseSB3ZSBjYW4gb25seSBzZXQgdGhlIGdhbWUgb2YgdGhlIHBsYXllciBpZiBfaW5kZXggaXMgbm9uLW5lZ2F0aXZlLCBzbyB3ZSBwYXNzIGluIDRcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5pbmRleD00O1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmdhbWU9bmV3IFBsYXllckdhbWVQcm94eShjbGllbnRzb2NrZXQpO1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbicpe2Vycm9yY2FsbGJhY2sobnVsbCk7c2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTt9ICAgIFxuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIG1ldCBkZSBzcGVsIHNlcnZlciBpcyBoZXJzdGVsZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gTURIQDIzSkFOMjAyMDogcHVzaCB0aGUgcGxheWVyIG5hbWUgdG8gdGhlIHNlcnZlciBhZ2Fpbiwgc28gaXQgY2FuIHJlc2VuZCB3aGF0IG5lZWRzIHNlbmRpbmchISEhXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllciljbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxjdXJyZW50UGxheWVyLm5hbWUsKCk9PntcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkFhbmdlbWVsZCBiaWogZGUgc3BlbCBzZXJ2ZXIhXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgbWV0IGRlIHNwZWwgc2VydmVyIGlzIHZlcmJyb2tlbi5cIik7XG4gICAgICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLlwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywoZXJyKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0IGVycm9yOiBcIixlcnIpO1xuICAgICAgICAgICAgc2V0SW5mbyhcIkVyIGlzIGVlbiBwcm9ibGVlbSBtZXQgZGUgdmVyYmluZGluZyBtZXQgZGUgc3BlbCBzZXJ2ZXIgKFwiK2Vyci5tZXNzYWdlK1wiKSFcIik7XG4gICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKGVycikpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdHJ5IHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciBjYXRjaGluZyB3aGF0ZXZlciBoYXBwZW5zIHRocm91Z2ggZXZlbnRzXG4gICAgICAgIGNsaWVudHNvY2tldC5jb25uZWN0KCk7XG4gICAgfWVsc2VcbiAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhudWxsKSk7XG59XG5cbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIHRoZSAobmV3KSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllciB3aGVuZXZlciB0aGUgcGxheWVyIHdhbnRzIHRvIHBsYXlcbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIG51bGwgKG9yIGVtcHR5KSBwbGF5ZXIgbmFtZVxuLy8gdG8gbWFrZSBpdCBjYWxsYWJsZSBmcm9tIGFueXdoZXJlIHdlIGF0dGFjaCBzZXRQbGF5ZXJOYW1lIHRvIHdpbmRvdyAoYmVjYXVzZSBjbGllbnQuanMgd2lsbCBiZSBicm93c2VyaWZpZWQhISEpXG5mdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKHBsYXllck5hbWUsZXJyb3JDYWxsYmFjayl7XG4gICAgKHByZXBhcmVkRm9yUGxheWluZ3x8cHJlcGFyZUZvclBsYXlpbmcoKSk7IC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgb25jZVxuICAgIC8vIGlmKGVycm9yQ2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIGFzY2VydGFpbiB0byBub3QgYmUgaW4gYSBub24tcGxheWVyIHBhZ2VcbiAgICAvLyBwbGF5ZXJOYW1lIG5lZWRzIHRvIGJlIGEgc3RyaW5nIChpZiBpdCBpcyBkZWZpbmVkKVxuICAgIGlmKHBsYXllck5hbWUmJiEodHlwZW9mIHBsYXllck5hbWU9PT1cInN0cmluZ1wiKSlcbiAgICAgICAgcmV0dXJuKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYXllciBuYW1lLlwiKSkpO1xuICAgIC8vIGlmIHBsYXllck5hbWUgbWF0Y2hlcyB0aGUgY3VycmVudCBwbGF5ZXIncyBuYW1lLCBub3RoaW5nIHRvIGRvXG4gICAgaWYocGxheWVyTmFtZSYmY3VycmVudFBsYXllciYmY3VycmVudFBsYXllci5uYW1lPT09cGxheWVyTmFtZSlcbiAgICAgICAgKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhudWxsKSk7XG4gICAgZWxzZVxuICAgICAgICBfc2V0UGxheWVyKHBsYXllck5hbWUmJnBsYXllck5hbWUubGVuZ3RoPjA/bmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lKTpudWxsLGVycm9yQ2FsbGJhY2spO1xufVxuXG53aW5kb3cub25sb2FkPXByZXBhcmVGb3JQbGF5aW5nO1xuXG4vLyBleHBvcnQgdGhlIHR3byBmdW5jdGlvbiB0aGF0IHdlIGFsbG93IHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBvdXRzaWRlISEhXG5tb2R1bGUuZXhwb3J0cz1zZXRQbGF5ZXJOYW1lOyJdfQ==
