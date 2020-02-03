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
        // MDH@03FEB2020: BUT we want to know all the suites of which the player does not have the given rank
        //                    including of those suites a player does NOT have
        /* MDH@03FEB2020 replacing:
        let suites=[];
        this._cards.forEach((card)=>{
            if(suites.indexOf(card.suite)<0)suites.push(card.suite); // if suite not present yet, add it to suites
            if(card.rank===rank)suites[card.suite]=-1; // not removing it but setting to -1 if we locate the rank
        });
        */
       let suites=[0,1,2,3]; // MDH@03FEB2020: replacing =[];
       this._cards.forEach((card)=>{
            // because the following can only happen once (for each suite), we can safely assume that the suite is there!!!!
           if(card.rank===rank)suites.splice(suites.indexOf(card.suite),1); // not removing it but setting to -1 if we locate the rank
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
// MDH@31JAN2020: I'll be needing this both client-side and server-side
//                client-side it's embedded in gameplaying.js (the browserified version of client.js)
class Language{
    static get DEFAULT_PLAYERS(){return [["","","","",""],["Marc","Jurgen","Monika","Anna",""]];};
    // possible ranks and suites (in Dutch)
    static get DUTCH_RANK_NAMES(){return ["twee","drie","vier","vijf","zes","zeven","acht","negen","tien","boer","vrouw","heer","aas"];};
    static get DUTCH_SUITE_NAMES(){return ["ruiten","klaveren","harten","schoppen"];};
}

module.exports=Language;
},{}],4:[function(require,module,exports){
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
        if(this._game!==game){

        }
        if(game&&!(game instanceof PlayerGame))return new Error("Spel niet van het juiste type.");
        if(game)if(this._index<0)return new Error("Positie van speler onbekend.");
        this._removeCards(); // MDH@11JAN2020: if the game changes we should remove the cards
        this._game=game;
        // sync _index
        if(this._game){
            console.log("Game on!");
            // prepare for playing the game
            this.partner=-1; // my partner (once I now who it is)
            this.tricksWon=[]; // storing the tricks won
        }else
            console.log("Game over!");
        return null;
    }

    get index(){return this._index;} // MDH@22JAN2020: no harm in adding a getter!!!
    set index(index){this._index=index;} // MDH@09JAN2020: sometimes an index can be set separately

    playsTheGameAtIndex(game,index){
        console.log("Registering the game played at index "+index+".");
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
        if(error&&error!==true)return error;
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
},{"./Card.js":1,"./CardHolder.js":2}],5:[function(require,module,exports){
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

},{"./Card.js":1,"./CardHolder.js":2}],6:[function(require,module,exports){
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

const Language=require('./Language.js');
/* replacing:
class Language{
    static get DEFAULT_PLAYERS(){return [["","","","",""],["Marc","Jurgen","Monika","Anna",""]];};
    // possible ranks and suites (in Dutch)
    static get DUTCH_RANK_NAMES(){return ["twee","drie","vier","vijf","zes","zeven","acht","negen","tien","boer","vrouw","heer","aas"];};
    static get DUTCH_SUITE_NAMES(){return ["ruiten","klaveren","harten","schoppen"];};
}
*/

function capitalize(str){return(str?(str.length?str[0].toUpperCase()+str.slice(1):""):"?");}

const VISIBLE="inherit"; // MDH@03FEB2020: if we'd use visible, it would ignore what the parent's visibility is, and keep showing...

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

var toMakeABid=false; // MDH@03FEB2020: some protection

// MDH@29JAN2020: deciding to always show the user name in the document title, and to blink it when
//                user input is required
var forceFocusId=null;
var forceFocusText=null;
function stopForceFocus(){clearInterval(forceFocusId);forceFocusId=null;}
function checkFocus(state){
    // MDH@23JAN2020: we should keep blinking when not in focus until forced to stop
    //                instead of stopping when the focus was got
    // MDH@29JAN2020 removing this should suffice: if(document.hasFocus())showGameState(state);else 
    //////// toggleGameState(forceFocusText);
    if(document.hasFocus()){showGameState(state);stopForceFocus();}else toggleGameState(state);
}
function forceFocus(state){
    // if(state)
    forceFocusText=state;
    showGameState(forceFocusText); // ascertain to start with the given non-null 'state'
    if(state){ // focus requested
        // start getting the focus by blinking 'state' IFF we haven't got it yet...
        if(!forceFocusId)forceFocusId=setInterval(()=>{checkFocus(state)},500);
    }else{ // end of focus request
        if(forceFocusId)stopForceFocus();
    }
}

// MDH@31JAN2020: keep a 'state' which will determine what messages the player can send over to the server
const PLAYERSTATE_WAIT_FOR_GAME=0;
const PLAYERSTATE_WAIT_FOR_BID=1;
const PLAYERSTATE_BID=2,PLAYERSTATE_BID_DONE=3,PLAYERSTATE_BID_RECEIVED=4;
const PLAYERSTATE_WAIT_FOR_PLAY=5;
const PLAYERSTATE_TRUMP=6,PLAYERSTATE_TRUMP_DONE=7,PLAYERSTATE_TRUMP_RECEIVED=8;
const PLAYERSTATE_PARTNER=9,PLAYERSTATE_PARTNER_DONE=10,PLAYERSTATE_PARTNER_RECEIVED=11;
const PLAYERSTATE_WAIT_FOR_CARD=12;
const PLAYERSTATE_CARD=13,PLAYERSTATE_CARD_PLAYED=14,PLAYERSTATE_CARD_RECEIVED=15;
const PLAYERSTATE_GAME_OVER=16;
const PLAYERSTATE_WAIT_FOR_CARDS=17,PLAYERSTATE_GAME_RECEIVED=18,PLAYERSTATE_CARDS_RECEIVED=19;
// MDH@01FEB2020: we're NOT allowing to resend the card played because that's already done (every 10 seconds) by 
const playerStateMessages=["Ik wacht op een spel"
                          ,"Ik wacht op een bod"
                            ,"Momentje nog","Bod al verstuurd","Bod ontvangen"
                          ,"Laten we spelen"
                            ,"Momentje nog","Troefkleur al gekozen","Troefkleur ontvangen"
                            ,"Momentje nog","Partner al gekozen","Kleur partnerkaart ontvangen"
                          ,"Ik wacht op een kaart"
                            ,"Momentje nog","Kaart al gespeeld","Kaart ontvangen"
                          ,"Bedankt voor het spelen"
                          ,"Ik wacht op kaarten","Spel begonnen","Bedankt voor de kaarten",
                          ];
var currentPlayerState=PLAYERSTATE_WAIT_FOR_GAME;
var resendEventId=null;
function allowResendEvent(){
    sendMessageButton.disabled=false; // enable the send message button
    // resendEventId=null; // no need to clear the timeout as we're done now
}
var sendMessageText;
function sendMessageButtonClicked(){
    // if we have a resend event id we're dealing with a resend, otherwise we send the message as visible on the button
    if(resendEventId){
        // resend the event to resend

        // re-enable the current state which will effectively guarantee that the user can resend again in another 5 seconds
        setPlayerState(currentPlayerState);
    }else{
        setInfo("?");
        // don't send any text if sending the default text
        let textToSend=(sendMessageText.value!==playerStateMessages[currentPlayerState]?sendMessageText.value:'');
        currentGame._socket.emit('PLAYER_SAYS',{'state':currentPlayerState,'text':textToSend},(response)=>{
            setInfo(response&&response.length>0?response:"Bericht ontvangen, maar geen antwoord gestuurd.");
            // if the message text differed from the default message we clear the message text
            if(sendMessageText.value!==playerStateMessages[currentPlayerState])sendMessageText.value='';
        });
    }
}
function setPlayerState(playerState){
    //if(resendEventId){clearTimeout(resendEventId);resendEventId=null;} // get rid of any pending resend event timeout
    let replaceMessageText=(sendMessageText.value===playerStateMessages[currentPlayerState]); // user hasn't changed the text to send manually...
    currentPlayerState=playerState;
    // set the message text on the send message text input field accordingly
    if(replaceMessageText)sendMessageText.innerText=playerStateMessages[currentPlayerState];
    /* resending already managed by the game (see cardPlayed, bidMade, trumpSuiteChosen and partnerSuiteChosen)
    sendMessageButton.disabled=(sendMessageText==="Stuur opnieuw");
    // if the button is currently disabled only allow resending the event but not until after 5 seconds
    if(sendMessageButton.disabled)resendEventId=setTimeout(allowResendEvent,5000); // allow resending after 5 seconds
    */
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
 * clears the bids table
 * to be called with every new game
 */
function clearBidsTable(){
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
        default:element.style.color="black";break; // typically value 2 is used to indicate the player itself!!!
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
    //////////if(currentPage==="page-playing")alert("Showing the playing cards again!");
    let tablebody=document.getElementById("player-suitecards-table");
    console.log("********* Suite cards: ",suiteCards);
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
            // we're passing along currentPlayer.partner to getTeamName because the player with the fourth ace already knows his/her partner
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
                // MDH@30JAN2020: OOPS not supposed to give this away!!!!! gameInfo+=Language.DUTCH_SUITE_NAMES[trumpSuite]+" is troef, en ";
                gameInfo+="en "+rikkenTheGame.getPlayerName(rikkenTheGame.fourthAcePlayer)+" is mee.";
            }else{
                if(highestBid==PlayerGame.BID_RIK||highestBid==PlayerGame.BID_RIK_BETER){
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" rikt in de "+Language.DUTCH_SUITE_NAMES[trumpSuite];
                    gameInfo+=", en vraagt de "+Language.DUTCH_SUITE_NAMES[partnerSuite]+" "+Language.DUTCH_RANK_NAMES[partnerRank]+" mee.";    
                }else // without a partner
                    gameInfo=rikkenTheGame.getPlayerName(highestBidder)+" speelt "+PlayerGame.BID_NAMES[highestBid]+" met "+Language.DUTCH_SUITE_NAMES[trumpSuite]+" als troef.";
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
        // if(document.getElementById("page-bidding").style.visibility==="hidden")return;
        toMakeABid=true; // MDH@03FEB2020: some additional protection in case the buttons won't hide
        forceFocus(this.name);
        // ascertain to be looking at the bidding page (in which case we can safely use VISIBLE)
        if(currentPage!="page-bidding")setPage("page-bidding"); 
        // removed: document.getElementById("wait-for-bid").style.visibility="hidden"; // show the bidding element
        // MDH@03FEB2020: inherit is safer because if this happens by accident (when not on the bidding page)
        document.getElementById("bidding").style.visibility=VISIBLE; // show the bidding element, essential to hide it immediately after a bid
        // currentPlayer=this; // remember the current player
        setInfo("Doe een bod.");
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
        // only show the buttons corresponding to possible bids
        for(let bidButton of document.getElementsByClassName("bid"))
            bidButton.style.display=(possibleBids.indexOf(parseInt(bidButton.getAttribute('data-bid')))>=0?"inline":"none");
        // show the player bids in the body of the bids table
        updateBidsTable(playerBidsObjects);
        setPlayerState(PLAYERSTATE_BID);
    }
    chooseTrumpSuite(suites){
        forceFocus(this.name);
        console.log("Possible trump suites:",suites);
        setPage("page-trump-choosing");
        document.getElementById("trump-suite-input").style.visibility=VISIBLE; // ascertain to allow choosing the trump suite
        updateChooseTrumpSuiteCards(this._suiteCards);
        // iterate over the trump suite buttons
        for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
        setPlayerState(PLAYERSTATE_TRUMP);
    }
    choosePartnerSuite(suites,partnerRank){ // partnerRankName changed to partnerRank (because Language should be used at the UI level only!)
        forceFocus(this.name);
        console.log("Possible partner suites:",suites);
        setPage("page-partner-choosing");
        document.getElementById("partner-suite-input").style.visibility=VISIBLE; // ascertain to allow choosing the trump suite
        updateChoosePartnerSuiteCards(this._suiteCards);
        // because the suites in the button array are 0, 1, 2, 3 and suites will contain
        for(let suiteButton of document.getElementById("partner-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
        // show the partner rank (ace or king) being asked
        for(let rankElement of document.getElementsByClassName('partner-rank'))
            rankElement.innerHTML=Language.DUTCH_RANK_NAMES[partnerRank];
        setPlayerState(PLAYERSTATE_PARTNER);
    }
    // almost the same as the replaced version except we now want to receive the trick itself
    playACard(){
        // currentPlayer=this;
        forceFocus(this.name);
        /* replacing:
        document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
        document.getElementById("playing").style.visibility=VISIBLE; // show the play element
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
            return(error instanceof Error?error:null);
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
        console.log("********************************************************");
        console.log("*************** Rendering player cards *****************");
        console.log("********************************************************");
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
    // MDH@03FEB2020: prevent making a bid when not supposed to do so
    if(!toMakeABid){alert("Je hebt al een bod uitgebracht!");return;}
    try{
        let bid=parseInt(event.currentTarget.getAttribute("data-bid"));
        if(isNaN(bid)||bid<0){alert("Ernstige programmafout: ongeldig bod ("+(bid?bid:"?")+")! Probeer het nog eens.");return;}
        // document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element
        console.log("Bid chosen: ",bid);
        let error=currentPlayer._setBid(bid); // the value of the button is the made bid
        if(error instanceof Error)
            alert(error);
        else // bid done!!!
            toMakeABid=false;
    }finally{
        document.getElementById("bidding").style.visibility=(toMakeABid?VISIBLE:"hidden"); // show again
    }
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
    playablecardCell=(event?event.currentTarget:null);
    if(!playablecardCell)return;
    let cardSuite=parseInt(playablecardCell.getAttribute("data-suite-id"));
    let cardRank=parseInt(playablecardCell.getAttribute("data-suite-index"));
    if(cardSuite<Card.SUITE_DIAMOND||cardSuite>Card.SUITE_SPADE||cardRank<Card.RANK_TWO||cardRank>Card.RANK_ACE)return;

    ////////if(playablecardCell.style.border="0px")return; // empty 'unclickable' cell
    let error=currentPlayer._cardPlayedWithSuiteAndIndex(cardSuite,cardRank);
    if(!(error instanceof Error)){ // card accepted!!!
        // clear asap
        playablecardCellContents=playablecardCell.innerHTML; // in case sending the card fails
        playablecardCell.innerHTML="";
        forceFocus(null); // get rid of the focus request
        updatePlayableCardButtonClickHandlers(false); // disable the card buttons
        document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart verzonden naar de spel server"; // MDH@23JAN2020: get rid of the play card prompt!
    }else{ // report the error to the end user
        // alert(error);
        document.getElementById("play-card-prompt").innerHTML="Versturen mislukt. Probeer het nog eens!";
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
            /* if(fromstate===PlayerGame.DEALING)*/
            clearBidsTable();
            ////// let's wait until a bid is requested!!!! 
            // MDH@09JAN2020: NO, we want to indicate that the bidding is going on
            setPage("page-bidding");
            break;
        case PlayerGame.PLAYING:
            setInfo("Het spelen kan beginnen!");
            // updatePlayableCardButtonClickHandlers(true); // allowing the user to cl
            /* MDH@19JAN2020: in due course we will be removing the following two lines
            document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
            document.getElementById("playing").style.visibility=VISIBLE; // show the play element
            */
            // initiate-playing will report on the game that is to be played!!!
            setPage("page-playing");
            break;
        case PlayerGame.FINISHED:
            currentPlayer.game._numberOfTricksPlayed+=1; // QUICK FIX to get to see the last trick at the right position!!!!!
            updateTricksPlayedTables(); // so we get to see the last trick as well!!!
            updatePlayerResultsTable(); // show the player results so far
            setInfo("Het spel is afgelopen!");
            clearCardsPlayedTable();
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
        let result=false;
        try{
            this._socket.emit(this._eventToSend[0],this._eventToSend[1],this._sentEventReceived);
            this._eventToSend[2]++;
            result=true;
            // MDH@01FEB2020: we show how often a certain event was sent on the sendMessageButton
            if(this._eventToSend[2]>1)
                sendMessageButton.value=playerStateMessages[currentPlayerState]+" ("+this._eventToSend[2]+"x)";
            console.log("Event "+this._eventToSend[0]+(this._eventToSend[1]?" with data "+JSON.stringify(data):"")+" sent (attempt: "+this._eventToSend[2]+").");
        }catch(error){
            console.log("ERROR: Failed to send event "+this._eventToSend[0]+" to the game server (reason: "+error.message+").");
        }
        return result;
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
        // MDH@03FEB2020: unfortunately I encountered problems with the bidding buttons not hiding
        //                and because it does not really matter who made the bid
        document.getElementById("bidding").style.visibility="hidden";
        let bidMadeSentResult=this._setEventToSend('BID',bid,function(result){
            if(result){
                setInfo("Bod niet geaccepteerd"+
                            (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                // TODO what now???
            }
        }); // hide the bidding element again
        if(bidMadeSentResult)setPlayerState(PLAYERSTATE_BID_DONE);
        return bidMadeSentResult;
    }
    // MDH@13JAN2020: we're sending the exact card over that was played (and accepted at this end as it should I guess)
    // MDH@14JAN2020: passing in the askingForPartnerCard 'flag' as well!!!!
    //                because we're overriding the base RikkenTheGame implementation
    //                askingForPartnerCard doesn't end up in the local RikkenTheGame trick
    // MDH@27JAN2020: we're receiving true for askingForPartnerCardBlind when the player is doing so
    cardPlayed(card,askingForPartnerCard){
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!");return false;}
        // MDH@17JAN2020: disable the buttons once the card is accepted (to be played!!!)
        //                TODO perhaps hiding the cards should also be done here!!!
        /* replacing:
        document.getElementById("wait-for-play").style.visibility=VISIBLE; // hide the bidding element again
        document.getElementById("playing").style.visibility="hidden"; // hide the bidding element again
        */
        console.log("Sending card played: "+card.toString()+" to the server.");
        // updatePlayableCardButtonClickHandlers(false);
        // MDH@27JAN2020: we send the askingForPartnerCard flag along every time although it will be ignored
        //                on any trick card except the first card played, and non-negative values are ignored as well
        //                because the only thing that the other side cannot determine is whether the partner card is asked blind!!!!
        let cardPlayedInfo=[card.suite,card.rank,askingForPartnerCard];
        // replacing: if(askingForPartnerCard<0)cardPlayedInfo.push(true); // set the asking for partner card blind flag!!!
        let cardSentResult=
            this._setEventToSend('CARD',cardPlayedInfo,function(result){
                if(result){
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart niet geaccepteerd"+
                                (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!";
                    /* TODO should or should we not do the following?????? 
                    playablacardCell.innerHTML=playablecardCellContents;
                    */
                }else{ // card played accepted!!!
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart geaccepteerd.";
                }
            });
        // this is only the result of the call to _setEventToSend (synchronous), and obviously we put back the card
        if(!cardSentResult){
            alert("Kaart niet verstuurd?");
            // document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart niet geaccepteerd"+
            // (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!";
            if(playablecardCell){
                playablacardCell.innerHTML=playablecardCellContents;
                setInfo("Versturen van de gespeelde kaart mislukt! Probeer het zo nog eens.");
            }else
                setInfo("Er is iets misgegaan. Probeer het zo nog eens.");
        }else{
            document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart verstuurd.";
            setPlayerState(PLAYERSTATE_CARD_PLAYED);
        }
        return cardSentResult;
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!");return false;}
        document.getElementById("trump-suite-input").style.visibility="hidden";
        let trumpSuiteChosenSentResult=this._setEventToSend('TRUMPSUITE',trumpSuite,function(result){
                if(result){
                    setInfo("Gekozen troefkleur niet geaccepteerd"+
                                (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                    // TODO what to do now?
                }else
                    setInfo("Gekozen troefkleur geaccepteerd.");
            });
        if(trumpSuiteChosenSentResult)setPlayerState(PLAYERSTATE_TRUMP_DONE);
        return trumpSuiteChosenSentResult;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!");return false;}
        document.getElementById("partner-suite-input").style.visibility="hidden";
        let partnerSuiteChosenSentResult=this._setEventToSend('PARTNERSUITE',partnerSuite,function(result){
                if(result){
                    setInfo("Gekozen partner kleur niet geaccepteerd!"+
                    (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!");
                    // TODO what to do now?
                }else
                    setInfo("Gekozen partner kleur geaccepteerd!");
            });
         // replacing: {'player':this._playerIndex,'suite':partnerSuite}));
         if(partnerSuiteChosenSentResult)setPlayerState(PLAYERSTATE_PARTNER_DONE);
         return partnerSuiteChosenSentResult;
    }
    // MDH@26JAN2020: when the user finished reading the results, and wants to continue playing done() should be called
    done(){
        return this._setEventToSend('DONE',null,function(){
            console.log("DONE event acknowledged.");
            this._playerIndex=-1; // MDH@29JAN2020: I have to do this otherwise I won't be able to play in a new game (see set playerNames!!!!)
            setInfo("Zodra er weer vier niet-spelende deelnemers zijn kun je weer spelen.");
        });
    }
    exit(reason){
        // player is exiting somehow...
        let data=(reason?reason:(currentPlayer?currentPlayer.name:""));
        return this._setEventToSend('EXIT',data,function(){
            console.log("EXIT event "+data+" acknowledged!");
            // we're NOT going anywhere anymore: setPage("page-rules");
            setInfo("Bedankt voor het spelen.");
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

        if(this._playerIndex>=0)return; // already playing the game A HA I have to kill the player index somewhere...

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
        if(error instanceof Error)return error;

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
        setPlayerState(PLAYERSTATE_CARD_RECEIVED);
        setInfo(capitalize(Language.DUTCH_SUITE_NAMES[cardInfo.suite])+" "+Language.DUTCH_RANK_NAMES[cardInfo.rank]+" gespeeld.");
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
            case "INFO":
                setInfo("Spel server zegt: "+data);
                break;
            case "STATECHANGE":
                this.state=data.to;
                break;
            case "GAME":
                setPlayerState(PLAYERSTATE_GAME_RECEIVED);
                // console.log("Game information received by '"+currentPlayer.name+"'.",data);
                // we can set the name of the game now
                this.name=data;
                // wait for the player names!!!!!
                break;
            case "PLAYERS":
                setPlayerState(PLAYERSTATE_WAIT_FOR_CARDS);
                this.playerNames=data;
                break;
            case "DEALER":
                this._dealer=data;
                break;
            case "CARDS":
                setPlayerState(PLAYERSTATE_CARDS_RECEIVED); // once the cards have been received
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
                if(data!==currentPlayer.name){
                    setPlayerState(PLAYERSTATE_WAIT_FOR_BID);
                    setInfo("We wachten op het bod van "+data+".");
                }else
                    setInfo("U wordt zo om een bod gevraagd.");
                // if(data!==currentPlayer.name)
                //     document.getElementById("bid-info").innerHTML="We wachten op het bod van <b>"+data+"</b>.";
                // else
                //     document.getElementById("bid-info").innerHTML="Wat wil je spelen?";
                break;
            case "MAKE_A_BID":
                setPlayerState(PLAYERSTATE_BID);
                currentPlayer.makeABid(data.playerBidsObjects,data.possibleBids);
                break;
            case "BID_MADE": // returned when a bid is made by someone
                /////////if(data.player===this._playerIndex)
                document.getElementById("bidding").style.visibility="hidden";
                setPlayerState(PLAYERSTATE_BID_RECEIVED);
                // assuming to receive in data both the player and the bid
                document.getElementById("bid-info").innerHTML=getBidInfo(data.bid,data.player===currentPlayer.index?null:this.getPlayerName(data.player));
                this._playersBids[data.player].push(data.bid);
                // TODO how to show the bids?????
                updateBidsTable(this._getPlayerBidsObjects());
                // MDH@03FEB2020: fail-safe BUT this should be done another way TODO
                setInfo("Bod van "+this.getPlayerName(data.player)+": "+PlayerGame.BID_NAMES[data.bid]+".");
                break;
            case "TO_PLAY":
                if(currentPlayer.name!==data){
                    setPlayerState(PLAYERSTATE_WAIT_FOR_CARD);
                    setInfo("We wachten op de kaart van "+data+".");
                }else
                    setInfo("U wordt zo om een kaart gevraagd!");
                /*
                if(currentPlayer.name!==data)
                    document.getElementById("play-info").innerHTML="We wachten op de kaart van <b>"+data+"</b>.";
                else
                    document.getElementById("play-info").innerHTML="Speel een kaart bij.";
                */
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
            /* MDH@03FEB2020: the player info is now received in the PLAY_A_CARD event
            case "PLAYER_INFO":
                {
                    // will contain the current cards the user has
                    currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
                    data.cards.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
                    currentPlayer.renderCards();
                    // MDH@23JAN2020: game keeps track of the number of tricks won by each player!!!!!
                    // // also the number of tricks won and to win
                    // currentPlayer.numberOfTricksWon=data.numberOfTricksWon;
                    // // TODO PLAYER_INFO does not need to send the following with each PLAYER_INFO THOUGH
                    // currentPlayer.setNumberOfTricksToWin(data.numberOfTricksToWin);
                }
                break;
            */
            case "PLAY_A_CARD":
                setPlayerState(PLAYERSTATE_CARD);
                // MDH@03FEB2020: taking over from PLAYER_INFO as the cards are now received in the PLAY_A_CARD event!!!!
                currentPlayer._removeCards(); // TODO find a way NOT to have to do this!!!
                data.cards.forEach((cardInfo)=>{new HoldableCard(cardInfo[0],cardInfo[1],currentPlayer);});
                currentPlayer.renderCards();
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
            case "TRUMP_SUITE_CHOSEN":
                setPlayerState(PLAYERSTATE_TRUMP_RECEIVED);
                setInfo(capitalize(Language.DUTCH_SUITE_NAMES[data])+" gekozen als troef.");
                break;
            case "CHOOSE_PARTNER_SUITE":
                currentPlayer.choosePartnerSuite(data.suites,data.partnerRankName);
                break;
            case "PARTNER_SUITE_CHOSEN":
                setPlayerState(PLAYERSTATE_PARTNER_RECEIVED);
                setInfo(capitalize(Language.DUTCH_SUITE_NAMES[data.suite])+" "+Language.DUTCH_RANK_NAMES[data.rank]+" meegevraagd.");
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
                if(currentPage!=="page-finished")setPage("page-finished"); // if we aren't there yet!!!
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
        this._socket.on('INFO',(data)=>{this.processEvent('INFO',data,true);});
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
        this._socket.on('TRUMP_SUITE_CHOSEN',(data)=>{this.processEvent('TRUMP_SUITE_CHOSEN',data,true);});
        this._socket.on('CHOOSE_PARTNER_SUITE',(data)=>{this.processEvent("CHOOSE_PARTNER_SUITE",data,true);});
        this._socket.on('PARTNER_SUITE_CHOSEN',(data)=>{this.processEvent('PARTNER_SUITE_CHOSEN',data,true);});
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
        // distinguish between the current player being asked and another player
        let knownPartnerIndex=(this._partners?this._partners[playerIndex]:-1); // NOTE could be null!!!
        // if the player is playing by him/herself there shouldn't be a partner!!!!
        if(this._highestBid!==PlayerGame.BID_RIK&&this._highestBid!==PlayerGame.BID_RIK_BETER&&this._highestBid!==PlayerGame.BID_TROELA){
            if(playerIndex===currentPlayer._index&&currentPlayer.partner>=0)teamName+="?";
            if(knownPartnerIndex>=0)teamName+="&?"; // some error apparently!!!!!
            return teamName;
        }
        teamName+=" "; // we'll have partner information behind
        if(playerIndex===this._playerIndex){
            let currentPartnerIndex=currentPlayer.partner; // the player that has the requested partner card knows his partner...
            // if the current partner index is known but the knownPartnerIndex is not we wrap the name in ()
            if(currentPartnerIndex>=0&&knownPartnerIndex<0)teamName+=" (";
            teamName+=" & "; // we are with a partner (although we might not currently know who)
            // the official partner (as known to the current player) is the one from currentPartnerIndex (and we show that name!)
            if(this._partners)teamName+=(currentPartnerIndex>=0?this.getPlayerName(currentPartnerIndex):"?");
            // can we deal with error situations now??????
            // typically this would be the case if the known partner index differs from the partner index registered with the player!!!
            if(knownPartnerIndex>=0&&currentPartnerIndex!==knownPartnerIndex)
                teamName+="?"+(knownPartnerIndex>=0?this.getPlayerName(knownPartnerIndex):"");
            if(currentPartnerIndex>=0&&knownPartnerIndex<0)teamName+=")";    
        }else // name of another player's partner being asked, can only be available through this._partners
            teamName+=" & "+(knownPartnerIndex>=0?this.getPlayerName(knownPartnerIndex):"?");
        return teamName;
    }
}

var preparedForPlaying=false;

function prepareForPlaying(){

    preparedForPlaying=true;

    sendMessageText=document.getElementById("send-message-text");
    document.getElementById("send-message-button").onclick=sendMessageButtonClicked;

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
    // replaced by bid-info: document.getElementById("wait-for-bid").style.visibility=VISIBLE;
    // DO NOT DO THIS WILL OVERRULE PARENT: document.getElementById("playing").style.visibility=VISIBLE; // MDH@19JAN2020: "hidden" changed to "visible" as we never hide the cards of the current players
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
},{"./Card.js":1,"./CardHolder.js":2,"./Language.js":3,"./Player.js":4,"./Trick.js":5}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9DZWxsYXIvbnZtLzAuMzUuMS92ZXJzaW9ucy9ub2RlL3YxMi4xMy4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvQ2FyZEhvbGRlci5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9MYW5ndWFnZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9QbGF5ZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvVHJpY2suanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogZGVmaW5pdGlvbiBvZiBhIHBsYXlpbmcgQ2FyZFxuICovXG5jbGFzcyBDYXJke1xuXG4gICAgc3RhdGljIGdldCBTVUlURV9OQU1FUygpe3JldHVybiBbXCJkaWFtb25kXCIsXCJjbHViXCIsXCJoZWFydFwiLFwic3BhZGVcIl07fVxuICAgIHN0YXRpYyBnZXQgUkFOS19OQU1FUygpe3JldHVybiBbXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiamFja1wiLFwicXVlZW5cIixcImtpbmdcIixcImFjZVwiXTt9XG4gICAgLy8gc2hvcnRoYW5kICdjaGFyYWN0ZXJzJyBmb3IgdGV4dHVhbCByZXByZXNlbnRhdGlvblxuICAgIC8vIE5PVCBXT1JLSU5HOiBjb25zdCBDQVJEX1NVSVRFX0NIQVJBQ1RFUlM9W1N0cmluZy5mcm9tQ2hhckNvZGUoMjY2NiksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYzKSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjUpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MCldO1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0hBUkFDVEVSUygpe3JldHVybiBbJ1xcdTI2NjYnLCdcXHUyNjYzJywnXFx1MjY2NScsJ1xcdTI2NjAnXX07IC8vIFlFUywgV09SS0lORyEhISEhXG4gICAgc3RhdGljIGdldCBTVUlURV9ESUFNT05EKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NMVUIoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfSEVBUlQoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfU1BBREUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19DSEFSQUNURVJTKCl7cmV0dXJuIFsnMicsJzMnLCc0JywnNScsJzYnLCc3JywnOCcsJzknLCcxMCcsJ0InLCdWJywnSycsJ0EnXTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19UV08oKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19USFJFRSgpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZPVVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GSVZFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0lYKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0VWRU4oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19FSUdIVCgpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBSQU5LX05JTkUoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19URU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19KQUNLKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfUVVFRU4oKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfS0lORygpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19BQ0UoKXtyZXR1cm4gMTI7fTtcblxuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHMoY2FyZDEsY2FyZDIpe1xuICAgICAgICBsZXQgZGVsdGFTdWl0ZT1jYXJkMS5fY2FyZFN1aXRlSW5kZXgtY2FyZDIuX2NhcmRTdWl0ZUluZGV4O1xuICAgICAgICBpZihkZWx0YVN1aXRlIT0wKXJldHVybiBkZWx0YVN1aXRlO1xuICAgICAgICByZXR1cm4gY2FyZDEuX2NhcmROYW1lSW5kZXgtY2FyZDIuX2NhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIFxuICAgIC8vIGluIGEgdHJpY2sgdGhlIHBsYXkgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IGNhcmRzIGFyZSB0byBiZSBwbGF5ZWQsIHRoZSB0cnVtcCBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgdHJ1bXAgaXNcbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQxLGNhcmQyLHBsYXlTdWl0ZSx0cnVtcFN1aXRlKXtcbiAgICAgICAgLy8gbm9ybWFsbHkgd2l0aCBhbnkgdHdvIHJlZ3VsYXIgY2FyZHMgdGhleSBhcmUgbmV2ZXIgZXF1YWwgaW4gYSB0cmlja1xuICAgICAgICAvLyBjYXJkcyB0aGF0IGFyZSBuZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUgaXMgaXJyZWxldmFudFxuICAgICAgICBsZXQgcmVzdWx0PTA7XG4gICAgICAgIGxldCB0eXBlPSctJztcbiAgICAgICAgLy8gMS4gaWYgY2FyZDEgaXMgdHJ1bXAsIGFuZCBjYXJkMiBpcyBub3Qgb3IgaGFzIGEgbG93ZXIgcmFuayBjYXJkMSB3aW5zXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT10cnVtcFN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdBJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgTk9UIHRydW1wIGJ1dCBjYXJkMiBjb3VsZCBzdGlsbCBiZSB0cnVtcFxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0InO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgdHJ1bXAsIHNvIGNvdWxkIGJlIHBsYXkgc3VpdGUgb3Igbm90Li4uXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQyc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIG5vdCBwbGF5IHN1aXRlLCBidXQgY2FyZDIgY291bGQgYmVcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0QnO31cbiAgICAgICAgY29uc29sZS5sb2coJz4+PiBUeXBlOiAnK3R5cGUrJzogJytjYXJkMS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIihzdWl0ZTogXCIrY2FyZDEuc3VpdGUrXCIpXCIrKHJlc3VsdD4wPycgPiAnOihyZXN1bHQ8MD8nIDwgJzonID0gJykpK2NhcmQyLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChzdWl0ZTogXCIrY2FyZDIuc3VpdGUrXCIpXCIrXCIgKHBsYXk6IFwiKyhwbGF5U3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1twbGF5U3VpdGVdOlwiP1wiKStcIiwgdHJ1bXA6XCIrKCh0cnVtcFN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV06XCI/XCIpKStcIilcIik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgLy8gbGV0J3MgZmlyc3QgcmVjb21wdXRlIHRoZSBzdWl0ZSBvZiBib3RoIGNhcmRzIGFuZCBlbGV2YXRlIHRydW1wIGNhcmRzLCBhbmQgZGVldmFsdWF0ZSBub24gcGxheVN1aXRlIGNhcmRzXG4gICAgICAgIGxldCBjYXJkMVN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMS5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQxLnN1aXRlKSk7XG4gICAgICAgIGxldCBjYXJkMlN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQyLnN1aXRlKSk7XG4gICAgICAgIGlmKGNhcmQxU3VpdGU+PTB8fGNhcmQyU3VpdGU+PTApeyAvLyBhdCBsZWFzdCBvbmUgb2YgdGhlIGNhcmRzIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzdWl0ZXMgYXJlIHRoZSBzYW1lIHRoZSBoaWdoZXN0IHJhbmsgd2luc1xuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZTwwKXJldHVybiAtMTsgLy8gaWYgdGhlIGZpcnN0IGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgbG93ZXJcbiAgICAgICAgICAgIGlmKGNhcmQyU3VpdGU8MClyZXR1cm4gMTsgLy8gaWYgdGhlIHNlY29uZCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGhpZ2hlclxuICAgICAgICAgICAgLy8gQVNTRVJUIGJvdGggY2FyZHMgYXJlIGVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPT1jYXJkMlN1aXRlKXJldHVybiBjYXJkMS5yYW5rLWNhcmQyLnJhbms7XG4gICAgICAgICAgICAvLyBBU1NFUlQgb25lIGNhcmQgaXMgcGxheSBzdWl0ZSwgdGhlIG90aGVyIG11c3QgYmUgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIHJldHVybihjYXJkMVN1aXRlPT00PzE6LTEpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSwgYm90aCBjYXJkcyBhcmUgaXJyZWxldmFudCAoc2hvdWxkIGhhcHBlbiB0aG91Z2gpXG4gICAgICAgIHJldHVybiAwOyAvLyBjb25zaWRlcmVkIGVxdWFsIHRoYXQgaXMgaXJyZWxldmFudFxuICAgIH1cbiAgICBcbiAgICAvLyAvLyB5b3UnZCBoYXZlIHRvIHVzZSB0aGUgQXBwbGUgU3ltYm9scyBmb250XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaU8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KxPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgr48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CvTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4K7PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgro8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CuTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4K4PC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgrc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CtjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4K1PC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgrQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CszwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KyPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZozwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg5E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DnjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4OdPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg5s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DmjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OZPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg5g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DlzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OWPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg5U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DlDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4OTPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg5I8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmmPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DgTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OOPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg408L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DizwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OKPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg4k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DiDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OHPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg4Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DhTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OEPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg4M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DgjwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KhPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgq48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CrTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4KrPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgqo8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CqTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4KoPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgqc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CpjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4KlPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgqQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CozwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KiPC9saT5cbiAgICBzdGF0aWMgZ2V0IENBUkRfQVBQTEVfU1lNQk9MUygpe3JldHVybiBbXG4gICAgICAgIFsn8J+DgicsJ/Cfg4MnLCfwn4OEJywn8J+DhScsJ/Cfg4YnLCfwn4OHJywn8J+DiCcsJ/Cfg4knLCfwn4OKJywn8J+DiycsJ/Cfg40nLCfwn4OOJywn8J+DgSddLFxuICAgICAgICBbJ/Cfg5InLCfwn4OTJywn8J+DlCcsJ/Cfg5UnLCfwn4OWJywn8J+DlycsJ/Cfg5gnLCfwn4OZJywn8J+DmicsJ/Cfg5snLCfwn4OdJywn8J+DnicsJ/Cfg5EnXSxcbiAgICAgICAgWyfwn4KyJywn8J+CsycsJ/CfgrQnLCfwn4K1Jywn8J+CticsJ/CfgrcnLCfwn4K4Jywn8J+CuScsJ/CfgronLCfwn4K7Jywn8J+CvScsJ/Cfgr4nLCfwn4KxJ10sXG4gICAgICAgIFsn8J+CoicsJ/CfgqMnLCfwn4KkJywn8J+CpScsJ/CfgqYnLCfwn4KnJywn8J+CqCcsJ/CfgqknLCfwn4KqJywn8J+CqycsJ/Cfgq0nLCfwn4KuJywn8J+CoSddXG4gICAgXX07XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KXtcbiAgICAgICAgdGhpcy5fY2FyZFN1aXRlSW5kZXg9Y2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIHRoaXMuX2NhcmROYW1lSW5kZXg9Y2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIENhcmQuUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XStcIiBvZiBcIitDYXJkLlNVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcInNcIjtcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJhbmsoKXtyZXR1cm4gdGhpcy5fY2FyZE5hbWVJbmRleDt9XG4gICAgZ2V0IHN1aXRlKCl7cmV0dXJuIHRoaXMuX2NhcmRTdWl0ZUluZGV4O31cblxuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbigpe1xuICAgICAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc3ZnLWNhcmRzLnN2ZyB3ZSBjYW4gZG8gdGhlIGZvbGxvd2luZywgYnV0IGluIHRoYXQgY2FzZSB3ZSdkIG5lZWQgdG8ga25vdyB0aGUgbWFnbmlmaWNhdGlvbiBmYWN0b3IhISFcbiAgICAgICAgLy9yZXR1cm4gQ0FSRF9GT05UX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvL3JldHVybiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDY3NiA5NzZcIj48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ZnLWNhcmRzLnN2ZyMnK1NVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcIi1cIitSQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdKyc8L3VzZT48L3N2Zz4nO1xuICAgICAgICByZXR1cm4gQ2FyZC5DQVJEX0FQUExFX1NZTUJPTFNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvLy8vLy9yZXR1cm4gU1VJVEVfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0uY29uY2F0KFJBTktfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkTmFtZUluZGV4XSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPUNhcmQ7IiwiLyoqXG4gKiBkZWZpbmVzIHNvbWVvbmUgdGhhdCBob2xkcyBjYXJkc1xuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuXG5jbGFzcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2codG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNREhAMDRERUMyMDE5OiBhbGxvd2luZyBub3cgdG8gY29uc3RydWN0IGZpeGVkIHNpemUgY2FyZCBob2xkZXJzIChsaWtlIFRyaWNrKVxuICAgIGNvbnN0cnVjdG9yKG51bWJlck9mQ2FyZHM9MCl7XG4gICAgICAgIHRoaXMuX2NhcmRzPVtdO1xuICAgICAgICB0aGlzLl9udW1iZXJPZkNhcmRzPW51bWJlck9mQ2FyZHM7XG4gICAgICAgIHdoaWxlKC0tbnVtYmVyT2ZDYXJkcz49MCl0aGlzLl9jYXJkcy5wdXNoKG51bGwpO1xuICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kcyB0byBhZGp1c3QgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIF9yZW1vdmVDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmluZGV4T2YoY2FyZCk7XG4gICAgICAgIGlmKGNhcmRJbmRleD49MCl7XG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkcy5zcGxpY2UoY2FyZEluZGV4LDEpLmxlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK2NhcmQrXCIgcmVtb3ZlZCBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIuXCIpO1xuICAgICAgICAgICAgICAgIGNhcmQuX2hvbGRlcj1udWxsOyAvLyB3aGVuIHN1Y2Nlc3NmdWwgYXBwYXJlbnRseSBubyBsb25nZXIgYXZhaWxhYmxlISEhXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIgb2YgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIjogaXQgaXMgbm90IHByZXNlbnQuXCIpO1xuICAgIH1cbiAgICBfYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgaWYoIWNhcmQpcmV0dXJuO1xuICAgICAgICBpZighKGNhcmQgaW5zdGFuY2VvZiBIb2xkYWJsZUNhcmQpKXRocm93IG5ldyBFcnJvcihcIk5vdCBhIGhvbGRhYmxlIGNhcmQhXCIpO1xuICAgICAgICB0aGlzLmxvZyhcIkFkZGluZyBjYXJkIFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIHRoaXMuX2NhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz5udW1iZXJPZkNhcmRzTm93KXtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTsgLy8gY2FuIG5vIGxvbmdlciBndWFyYW50ZWUgdGhhdCBpdCBpcyBzb3J0ZWQuLi5cbiAgICAgICAgICAgIGNhcmQuX2hvbGRlcj10aGlzO1xuICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiAoXCIrY2FyZC50b1N0cmluZygpK1wiKSBhZGRlZCB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAgICAgLy8gaG93IGFib3V0IG9yZGVyaW5nIHRoZSBjYXJkcz8/Pz8/PyBvciBzdG9yaW5nIHRoZW0gYnkgc3VpdGU/Pz8/XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlxcdENhcmQgY29sbGVjdGlvbjogXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjYXJkIFwiK2NhcmQrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiIChkZWx0YSBudW1iZXIgb2YgY2FyZHM6IFwiKyh0aGlzLm51bWJlck9mQ2FyZHMtbnVtYmVyT2ZDYXJkc05vdykrXCIpLlwiKTtcbiAgICB9XG4gICAgLypcbiAgICAvLyByZXBsYWNlIGEgY2FyZCBhdCBhIGdpdmVuIGluZGV4IChhcyB1c2VkIGluIFRyaWNrKVxuICAgIF9zZXRDYXJkQXRJbmRleChjYXJkLGluZGV4KXtcbiAgICAgICAgaWYoaW5kZXg8MHx8aW5kZXg+PXRoaXMubnVtYmVyT2ZDYXJkcyl0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZXBsYWNlIGNhcmQgI1wiK1N0cmluZyhpbmRleCsxKStcIi5cIik7XG4gICAgICAgIGxldCBjYXJkQXRJbmRleD10aGlzLl9jYXJkc1tpbmRleF07XG4gICAgICAgIGlmKGNhcmRBdEluZGV4KXtjYXJkQXRJbmRleC5faG9sZGVyPW51bGw7dGhpcy5fY2FyZHNbaW5kZXhdPW51bGw7fVxuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIGlmICdjb250YWluZWQnIGluIGFub3RoZXIgY2FyZCBob2xkZXIgcmVtb3ZlIGl0IGZyb20gdGhlcmUhISFcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBpZihjYXJkLl9ob2xkZXIpY2FyZC5faG9sZGVyLnJlbW92ZUNhcmQoY2FyZCk7XG4gICAgICAgICAgICAgICAgaWYoIWNhcmQuX2hvbGRlcil7dGhpcy5fY2FyZHNbaW5kZXhdPWNhcmQ7Y2FyZC5faG9sZGVyPXRoaXM7fSAgICBcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7fVxuICAgICAgICB9XG4gICAgfVxuICAgICovXG4gICAgLy8gcG9sbCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgZ2V0IG51bWJlck9mQ2FyZHMoKXtyZXR1cm4gdGhpcy5fY2FyZHMubGVuZ3RoO31cblxuICAgIGdldENhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQucmFuaz09cmFuazt9KTtcbiAgICB9XG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHN1aXRlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5zdWl0ZT09c3VpdGU7fSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnRcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXMoKXtcbiAgICAgICAgLy8gY2FuJ3QgdXNlIHRoaXMgaW4gZmlsdGVyISEhIHJldHVybiBbMCwxLDIsM10uZmlsdGVyKChyYW5rKT0+e3JldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuayk+MDt9KTtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgY2FyZHMgaW4gdGhlIGhvbGRlciB3aXRoIHRoZSBnaXZlbiByYW5rXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggYWxsIHN1aXRlcywgd2l0aCAtMSB3aGVyZSBhIHN1aXRlIGlzIG5vdCBwcmVzZW50IGluIHRoZSBjdXJyZW50IGNhcmRzIFxuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRob3V0UmFuayhyYW5rKXtcbiAgICAgICAgLy8gYWggdGhpcyBpcyBhbiBpc3N1ZSwgYmVjYXVzZSBpZiB5b3UgZG8gbm90IGhhdmUgYSBjZXJ0YWluIHN1aXRlIHRoZSBzdWl0ZSBzaG91bGQgTk9UIGJlIHJldHVybmVkISEhISFcbiAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogQlVUIHdlIHdhbnQgdG8ga25vdyBhbGwgdGhlIHN1aXRlcyBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIGdpdmVuIHJhbmtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyBvZiB0aG9zZSBzdWl0ZXMgYSBwbGF5ZXIgZG9lcyBOT1QgaGF2ZVxuICAgICAgICAvKiBNREhAMDNGRUIyMDIwIHJlcGxhY2luZzpcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntcbiAgICAgICAgICAgIGlmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7IC8vIGlmIHN1aXRlIG5vdCBwcmVzZW50IHlldCwgYWRkIGl0IHRvIHN1aXRlc1xuICAgICAgICAgICAgaWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXNbY2FyZC5zdWl0ZV09LTE7IC8vIG5vdCByZW1vdmluZyBpdCBidXQgc2V0dGluZyB0byAtMSBpZiB3ZSBsb2NhdGUgdGhlIHJhbmtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICAgbGV0IHN1aXRlcz1bMCwxLDIsM107IC8vIE1ESEAwM0ZFQjIwMjA6IHJlcGxhY2luZyA9W107XG4gICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntcbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIGZvbGxvd2luZyBjYW4gb25seSBoYXBwZW4gb25jZSAoZm9yIGVhY2ggc3VpdGUpLCB3ZSBjYW4gc2FmZWx5IGFzc3VtZSB0aGF0IHRoZSBzdWl0ZSBpcyB0aGVyZSEhISFcbiAgICAgICAgICAgaWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXMuc3BsaWNlKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpLDEpOyAvLyBub3QgcmVtb3ZpbmcgaXQgYnV0IHNldHRpbmcgdG8gLTEgaWYgd2UgbG9jYXRlIHRoZSByYW5rXG4gICAgICAgfSk7XG4gICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudCBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgZ2V0UmFua2xlc3NTdWl0ZXMocmFuayl7XG4gICAgICAgIGxldCByYW5rbGVzc1N1aXRlcz1bXTtcbiAgICAgICAgbGV0IHN1aXRlc1dpdGhSYW5rcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaChcbiAgICAgICAgICAgIChjYXJkKT0+e1xuICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCYmc3VpdGVzV2l0aFJhbmtzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuY2FyZE5hbWVJbmRleD09cmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWl0ZXNXaXRoUmFua3MucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgc3VpdGUgaWYgYWxyZWFkeSBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZUluZGV4PXJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlSW5kZXg+PTApcmFua2xlc3NTdWl0ZXMuc3BsaWNlKHJhbmtsZXNzU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgLy8gdW50aWwgcHJvdmVuIGRpZmZlcmVudGx5XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5rbGVzc1N1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJhbmtsZXNzU3VpdGVzO1xuICAgIH1cblxuICAgIGdldEZpcnN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1swXTt9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB1c2VkIGluIGdhbWVlbmdpbmUuanNcbiAgICBnZXRMYXN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkcy5sZW5ndGgtMV07fVxuXG4gICAgY29udGFpbnNDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZD49MCYmKHRoaXMuX2NhcmRzW2NhcmRdLnN1aXRlIT09c3VpdGV8fHRoaXMuX2NhcmRzW2NhcmRdLnJhbmshPT1yYW5rKSk7XG4gICAgICAgIHJldHVybihjYXJkPj0wKTsgLy8gZm91bmQgaWYgY2FyZCBpcyBub3QgbmVnYXRpdmVcbiAgICB9XG5cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSBuZWVkIHRoaXMgdG8gZmluZCBhIHNwZWNpZmljIGNhcmRcbiAgICBnZXRDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkSW5kZXg+PTApe2xldCBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07aWYoY2FyZC5zdWl0ZT09PXN1aXRlJiZjYXJkLnJhbms9PT1yYW5rKXJldHVybiBjYXJkO31cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FuIGV4cG9zZSBhIHRleHQgcmVwcmVzZW50aW9uXG4gICAgICovXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHN1aXRlU2VwYXJhdG9yKXtcbiAgICAgICAgdGhpcy5sb2coXCJOdW1iZXIgb2YgY2FyZHMgdG8gcmVwcmVzZW50OiBcIit0aGlzLl9jYXJkcy5sZW5ndGgrXCIuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgc29ydGluZz8/Pz8/Pz8/IHRoYXQgd291bGQgYmUgbmljZVxuICAgICAgICBpZihzdWl0ZVNlcGFyYXRvciYmdHlwZW9mIHN1aXRlU2VwYXJhdG9yPT09XCJzdHJpbmdcIiYmIXRoaXMuX3NvcnRlZCl7XG4gICAgICAgICAgICB0aGlzLl9jYXJkcy5zb3J0KGNvbXBhcmVDYXJkcyk7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9dHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5fc29ydGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLm1hcCgoY2FyZCk9PntyZXR1cm4gY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTt9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgLy8gY2FyZHMgYXJlIHN1cHBvc2VkIHRvIGJlIHNvcnRlZFxuICAgICAgICBsZXQgdGV4dFJlcHJlc2VudGF0aW9uPVwiXCI7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGxldCBjYXJkPXRoaXMuZ2V0Rmlyc3RDYXJkKCk7XG4gICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb249Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTE7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz0oY2FyZC5zdWl0ZSE9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT9zdWl0ZVNlcGFyYXRvcjpcIiBcIik7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dFJlcHJlc2VudGF0aW9uOyAvLyBhIHNpbmdsZSBibGFuayBiZXR3ZWVuIHRoZW0hISFcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhIGNhcmQgd2l0aCBhIGNhcmQgaG9sZGVyIGlzIGhlbGRcbiAqL1xuY2xhc3MgSG9sZGFibGVDYXJkIGV4dGVuZHMgQ2FyZHtcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSE9MREFCTEVDQVJEID4+PiBcIit0b2xvZyk7XG4gICAgfVxuXG4gICAgc2V0IGhvbGRlcihob2xkZXIpe1xuICAgICAgICB0aGlzLmxvZyhcIkNoYW5naW5nIHRoZSBob2xkZXIgb2YgY2FyZCBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgY3VycmVudCBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYodGhpcy5faG9sZGVyKXRoaXMuX2hvbGRlci5fcmVtb3ZlQ2FyZCh0aGlzKTtcbiAgICAgICAgLy8gYWRkICh3aGVuIHN1Y2Nlc3NmdWxseSByZW1vdmVkKSB0byB0aGUgbmV3IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZighdGhpcy5faG9sZGVyJiZob2xkZXIpaG9sZGVyLl9hZGRDYXJkKHRoaXMpO2Vsc2UgdGhpcy5sb2coXCJFUlJPUjogVW5hYmxlIHRvIGNoYW5nZSB0aGUgaG9sZGVyIVwiKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4LGhvbGRlcil7XG4gICAgICAgIHN1cGVyKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpO1xuICAgICAgICB0aGlzLl9ob2xkZXI9bnVsbDtcbiAgICAgICAgdGhpcy5ob2xkZXI9aG9sZGVyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIFwiSG9sZGFibGUgXCIrc3VwZXIudG9TdHJpbmcoKTt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9e0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfTsiLCIvLyBNREhAMzFKQU4yMDIwOiBJJ2xsIGJlIG5lZWRpbmcgdGhpcyBib3RoIGNsaWVudC1zaWRlIGFuZCBzZXJ2ZXItc2lkZVxuLy8gICAgICAgICAgICAgICAgY2xpZW50LXNpZGUgaXQncyBlbWJlZGRlZCBpbiBnYW1lcGxheWluZy5qcyAodGhlIGJyb3dzZXJpZmllZCB2ZXJzaW9uIG9mIGNsaWVudC5qcylcbmNsYXNzIExhbmd1YWdle1xuICAgIHN0YXRpYyBnZXQgREVGQVVMVF9QTEFZRVJTKCl7cmV0dXJuIFtbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiXSxbXCJNYXJjXCIsXCJKdXJnZW5cIixcIk1vbmlrYVwiLFwiQW5uYVwiLFwiXCJdXTt9O1xuICAgIC8vIHBvc3NpYmxlIHJhbmtzIGFuZCBzdWl0ZXMgKGluIER1dGNoKVxuICAgIHN0YXRpYyBnZXQgRFVUQ0hfUkFOS19OQU1FUygpe3JldHVybiBbXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiYm9lclwiLFwidnJvdXdcIixcImhlZXJcIixcImFhc1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgRFVUQ0hfU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wicnVpdGVuXCIsXCJrbGF2ZXJlblwiLFwiaGFydGVuXCIsXCJzY2hvcHBlblwiXTt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cz1MYW5ndWFnZTsiLCIvKipcbiAqIGEgcGxhY2Vob2xkZXIgZm9yIGEgcGxheWVyXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG4vKipcbiAqIGEgUGxheWVyIGNhbiBtYWtlIGEgYmlkLCBvciBwbGF5IGEgY2FyZCwgY2hvb3NlIGEgdHJ1bXAgYW5kIHBhcnRuZXIgc3VpdGVcbiAqL1xuY2xhc3MgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBiaWRNYWRlKGJpZCl7fVxuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7fVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7fVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe31cbn1cblxuLy8gTURIQDA3REVDMjAxOTogUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXIgd2l0aCBnYW1lIGRhdGEgZXhwb3NlZCB0byBwbGF5ZXJcbi8vICAgICAgICAgICAgICAgIHdoaWNoIHdhcyBlYXJsaWVyIHN0b3JlZCBpbiBlYWNoIHRyaWNrXG5jbGFzcyBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBzdGF0aWMgZ2V0IEJJRF9OQU1FUygpe3JldHVybiBbXCJwYXNcIixcInJpa1wiLFwicmlrIChiZXRlcilcIixcIm5lZ2VuIGFsbGVlblwiLFwibmVnZW4gYWxsZWVuIChiZXRlcilcIixcInBpY29cIixcInRpZW4gYWxsZWVuXCIsXCJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJlbGYgYWxsZWVuXCIsXCJlbGYgYWxsZWVuIChiZXRlcilcIixcIm1pc1xceGU4cmVcIixcInR3YWFsZiBhbGxlZW5cIixcInR3YWFsZiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlXCIsXCJkZXJ0aWVuIGFsbGVlblwiLFwiZGVydGllbiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlIG1ldCBlZW4gcHJhYXRqZVwiLFwidHJvZWxhXCIsXCJvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWdcIixcIm9tIGRlIGxhYXRzdGUgc2xhZ1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BBUygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBCSURfUklLKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUtfQkVURVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTigpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QSUNPKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTigpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX01JU0VSRSgpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU4oKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDEyO307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkUoKXtyZXR1cm4gMTM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTigpe3JldHVybiAxNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDE1O307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFKCl7cmV0dXJuIDE2O307XG4gICAgc3RhdGljIGdldCBCSURfVFJPRUxBKCl7cmV0dXJuIDE3O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHX0VOX1NDSE9QUEVOX1ZST1VXKCl7cmV0dXJuIDE4O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHKCl7cmV0dXJuIDE5O307XG4gICAgc3RhdGljIGdldCBCSURTX0FMTF9DQU5fUExBWSgpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUElDTyxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRSxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkVdO307IC8vIHRydW1wbGVzcyBnYW1lc1xuICAgIHN0YXRpYyBnZXQgQklEU19XSVRIX1BBUlRORVJfSU5fSEVBUlRTKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIsUGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSXTt9OyAvLyBnYW1lcyB3aXRoIHRydW1wIHBsYXllZCB3aXRoIGEgcGFydG5lclxuICAgIHN0YXRpYyBnZXQgQklEX1JBTktTKCl7cmV0dXJuIFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywwLC0xLC0xXTt9OyAvLyBob3cgSSBwbGF5ZWQgaXQgKGJpZCBwYXNzIGV4Y2x1ZGVkIChhbHdheXMgcmFuayAwKSlcbiAgICBcbiAgICAvLyBlYWNoIGJpZCBoYXMgYSBjZXJ0YWluIGFtb3VudCBvZiBwb2ludHMgdG8gcmVjZWl2ZSB3aGVuIHdpbm5pbmcgdGhlIGdhbWVcbiAgICBzdGF0aWMgZ2V0IEJJRF9QT0lOVFMoKXtyZXR1cm4gWzAsMSwxLDMsMyw0LDQsNCw1LDUsNSw2LDYsNiw3LDcsMTAsMiwyLDJdO31cblxuICAgIC8vIHRoZSBzdGF0ZSBjb25zdGFudHMgd2UgaGF2ZVxuICAgIHN0YXRpYyBnZXQgT1VUX09GX09SREVSKCl7cmV0dXJuIDA7fVxuICAgIHN0YXRpYyBnZXQgSURMRSgpe3JldHVybiAxO31cbiAgICBzdGF0aWMgZ2V0IERFQUxJTkcoKXtyZXR1cm4gMjt9XG4gICAgc3RhdGljIGdldCBCSURESU5HKCl7cmV0dXJuIDM7fVxuICAgIHN0YXRpYyBnZXQgUExBWUlORygpe3JldHVybiA0O31cbiAgICBzdGF0aWMgZ2V0IENBTkNFTElORygpe3JldHVybiA1O31cbiAgICBzdGF0aWMgZ2V0IEZJTklTSEVEKCl7cmV0dXJuIDY7fVxuICAgIGdldFRydW1wU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7fVxuICAgIGdldFRydW1wUGxheWVyKCl7fVxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVyKXt9XG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXt9XG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXt9XG4gICAgZ2V0IHBvaW50cygpe31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzUGxheWVkKCl7fVxuICAgIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXRUZWFtTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JCaWQoKXt9XG4gICAgX2Fza1BsYXllckZvclRydW1wU3VpdGUoKXt9XG4gICAgX2Fza1BsYXllckZvclBhcnRuZXJTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yQ2FyZCgpe31cbiAgICBfY2FyZFBsYXllZEFjY2VwdGVkKCl7fSAvLyBNREhAMjNKQU4yMDIwOiB0aGUgZW1wdHkgbWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIGEgY2FyZCB3YXMgcGxheWVkIHN1Y2Nlc3NmdWxseVxufVxuXG5jb25zdCBDSE9JQ0VfSURTPVtcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIl07XG5cbmNvbnN0IFBMQVlFUlRZUEVfRk9PPTAsUExBWUVSVFlQRV9VTktOT1dOPTEsUExBWUVSVFlQRV9GUklFTkQ9MjtcblxuLy8gdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIFBsYXllciBpbnN0YW5jZXNcbi8vIHdvdWxkIGJlIGRlZmluZWQgYWJzdHJhY3QgaW4gY2xhc3NpY2FsIE9PXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJQTEFZRVIgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lciYmcGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycy5wdXNoKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBldmVudCBsaXN0ZW5lcnM6IFwiK3RoaXMuX2V2ZW50TGlzdGVuZXJzK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuZXZlciBhIGdhbWUgaXMgc3RhcnRlZCwgY2FsbCBuZXdHYW1lISFcbiAgICBuZXdHYW1lKCl7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDB8fCF0aGlzLl9nYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSB2b29yIHRlIGJlcmVpZGVuIG9tIHRlIHNwZWxlbi5cIik7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzPXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgaWYobnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIGJldHRlciBkb25lIHRoaXMgd2F5IGluc3RlYWQgb2YgdGhpcy5fY2FyZHM9W11cbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJOb2cgXCIrbnVtYmVyT2ZDYXJkcytcIiBrYWFydGVuIGluIGRlIGhhbmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmF1bHQgcGxheWVyIHJlbWVtYmVyaW5nIGl0cyBjaG9pY2VzXG4gICAgICAgIHRoaXMuX2JpZD0tMTsgLy8gdGhlIGxhc3QgYmlkIG9mIHRoaXMgcGxheWVyXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsO1xuICAgICAgICAvLyB0aGUgZ2FtZSBiZWluZyBwbGF5ZWQsIGFuZCB0aGUgaW5kZXggd2l0aGluIHRoYXQgZ2FtZVxuICAgICAgICB0aGlzLl9wYXJ0bmVyPS0xO1xuICAgICAgICB0aGlzLl90cmlja3NXb249W107IC8vIHRoZSB0cmlja3Mgd29uIChpbiBhbnkgZ2FtZSlcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj0tMTsgLy8gZG9lc24ndCBtYXR0ZXJcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lLHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzPVtdO1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgICAgIGlmKCEocGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsYXllciBldmVudCBsaXN0ZW5lciBvZiB3cm9uZyB0eXBlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB3YWl0IGZvciByZWNlaXZpbmcgZ2FtZSBhbmQgaW5kZXhcbiAgICAgICAgdGhpcy5faW5kZXg9LTE7dGhpcy5fZ2FtZT1udWxsOyAvLyB3YWl0aW5nIGZvciB0aGUgZ2FtZSB0byBiZSBwbHVnZ2VkIGluIChvbmNlKVxuICAgICAgICAvLyByZW1vdmVkIHdhaXQgdW50aWwgZ2V0dGluZyBjYWxsZWQgdGhyb3VnaCBuZXdHYW1lOiB0aGlzLl9wcmVwYXJlRm9yUGxheWluZygpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICAvLyBnZXR0ZXJzIGV4cG9zaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBtYWRlIGNob2ljZVxuICAgIC8vIE5PVEUgbm8gbG9uZ2VyIGNhbGxlZCBieSB0aGUgZ2FtZSBiZWNhdXNlIHRoZSBjaG9pY2UgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IG5vd1xuICAgIC8vICAgICAgdGhpcyB3YXkgc3ViY2xhc3NlcyBhcmUgbm90IG9ibGlnYXRlZCB0byByZW1lbWJlciB0aGUgY2hvaWNlcyB0aGV5IG1ha2VcbiAgICBnZXQgYmlkKCl7cmV0dXJuIHRoaXMuX2JpZDt9XG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldCBjYXJkKCl7cmV0dXJuIHRoaXMuY2FyZCgpO31cblxuICAgIGdldCBwYXJ0bmVyKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXI7fVxuXG4gICAgLy8vLy8vLy8vLy8vLy9nZXQgY2FyZCgpe3JldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkUGxheUluZGV4XTt9XG5cbiAgICAvKiBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBnYW1lXG4gICAgLy8gY2FuIGJlIHNldCBkaXJlY3RseSB3aGVuIGEgYmV0dGVyICdyaWsnIHZhcmlhdGlvbiBiaWQgd2FzIGRvbmUhISEhXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgXG4gICAgLy8gVE9ETyBpdCB3b3VsZCBiZSBlYXNpZXIgdG8gY29tYmluZSB0aGVzZSBpbiBhIGNhcmQhISEhXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG5cbiAgICAvLyBjYWxsZWQgZnJvbSB0aGUgVUkgdG8gc2V0IHRoZSB0cnVtcCBzdWl0ZSEhISFcbiAgICBzZXQgdHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXt0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKCk7fVxuICAgIHNldCBwYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMucGFydG5lclN1aXRlQ2hvc2VuKCk7fVxuICAgICovXG5cbiAgICAvLyBlbmQgb2YgZ2V0dGVycy9zZXR0ZXJzIHVzZWQgYnkgdGhlIGdhbWVcbiAgICBfcmVtb3ZlQ2FyZHMoKXt3aGlsZSh0aGlzLl9jYXJkcy5sZW5ndGg+MCl0aGlzLl9jYXJkcy5zaGlmdCgpLmhvbGRlcj1udWxsO31cblxuICAgIGdldCBnYW1lKCl7cmV0dXJuIHRoaXMuX2dhbWU7fVxuICAgIHNldCBnYW1lKGdhbWUpe1xuICAgICAgICBpZih0aGlzLl9nYW1lIT09Z2FtZSl7XG5cbiAgICAgICAgfVxuICAgICAgICBpZihnYW1lJiYhKGdhbWUgaW5zdGFuY2VvZiBQbGF5ZXJHYW1lKSlyZXR1cm4gbmV3IEVycm9yKFwiU3BlbCBuaWV0IHZhbiBoZXQganVpc3RlIHR5cGUuXCIpO1xuICAgICAgICBpZihnYW1lKWlmKHRoaXMuX2luZGV4PDApcmV0dXJuIG5ldyBFcnJvcihcIlBvc2l0aWUgdmFuIHNwZWxlciBvbmJla2VuZC5cIik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIE1ESEAxMUpBTjIwMjA6IGlmIHRoZSBnYW1lIGNoYW5nZXMgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgY2FyZHNcbiAgICAgICAgdGhpcy5fZ2FtZT1nYW1lO1xuICAgICAgICAvLyBzeW5jIF9pbmRleFxuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvbiFcIik7XG4gICAgICAgICAgICAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gICAgICAgICAgICB0aGlzLnBhcnRuZXI9LTE7IC8vIG15IHBhcnRuZXIgKG9uY2UgSSBub3cgd2hvIGl0IGlzKVxuICAgICAgICAgICAgdGhpcy50cmlja3NXb249W107IC8vIHN0b3JpbmcgdGhlIHRyaWNrcyB3b25cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvdmVyIVwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4KCl7cmV0dXJuIHRoaXMuX2luZGV4O30gLy8gTURIQDIySkFOMjAyMDogbm8gaGFybSBpbiBhZGRpbmcgYSBnZXR0ZXIhISFcbiAgICBzZXQgaW5kZXgoaW5kZXgpe3RoaXMuX2luZGV4PWluZGV4O30gLy8gTURIQDA5SkFOMjAyMDogc29tZXRpbWVzIGFuIGluZGV4IGNhbiBiZSBzZXQgc2VwYXJhdGVseVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWdpc3RlcmluZyB0aGUgZ2FtZSBwbGF5ZWQgYXQgaW5kZXggXCIraW5kZXgrXCIuXCIpO1xuICAgICAgICB0aGlzLmluZGV4PWluZGV4O1xuICAgICAgICB0aGlzLmdhbWU9Z2FtZTtcbiAgICB9XG4gICAgLypcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBzdXBlci5hZGRDYXJkKGNhcmQpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcytcIicgcmVjZWl2ZWQgY2FyZCAnXCIrY2FyZCtcIicuXCIpO1xuICAgIH1cbiAgICAqL1xuICAgIF9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlLHdoZW5Ob3RGb3VuZENhcmQpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuKGNhcmQuc3VpdGU9PWNhcmRTdWl0ZSk7fSk7XG4gICAgfVxuXG4gICAgX2dldFN1aXRlQ2FyZHMoKXtcbiAgICAgICAgdGhpcy5sb2coXCJEZXRlcm1pbmluZyBzdWl0ZSBjYXJkcyBvZiBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMhXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkcz1bW10sW10sW10sW11dO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e3N1aXRlQ2FyZHNbY2FyZC5zdWl0ZV0ucHVzaChjYXJkKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlQ2FyZHM7XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIG9mIGEgZ2l2ZW4gY2FyZCBzdWl0ZSAob3IgYW55IGNhcmQgaWYgY2FyZFN1aXRlIGlzIHVuZGVmaW5lZClcbiAgICBjb250cmlidXRlVG9Ucmljayh0cmljaykge1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg9PTApcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4ga2FhcnRlbiBtZWVyIG9tIHRlIHNwZWxlbiFcIik7XG4gICAgICAgIGxldCBjYXJkc09mU3VpdGU9dGhpcy5fZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSk7XG4gICAgICAgIGxldCBjYXJkPShjYXJkc09mU3VpdGUmJmNhcmRzT2ZTdWl0ZS5sZW5ndGg+MD9jYXJkc09mU3VpdGVbMF06dGhpcy5fY2FyZHNbMF0pO1xuICAgICAgICBjYXJkLmhvbGRlcj10cmljazsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGUgdHJpY2tcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTURIOiBhbGwgbWV0aG9kcyB0aGF0IGRlYWwgd2l0aCBwcm9jZXNzaW5nIGEgYmlkLCBhIGNhcmQsIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgY2hvaWNlXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBtYWRlIGEgYmlkXG4gICAgX2JpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBpbiB0ZSBiaWVkZW4hXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3NpbmcgYmlkIFwiK2JpZCtcIiBvZiBwbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgdG8gdGhlIGdhbWUhXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS5iaWRNYWRlKGJpZCk7XG4gICAgfVxuICAgIC8vIE1ESEAyNkpBTjIwMjA6IHJldHVybmluZyB0cnVlIG9uIHN1Y2Nlc3MgKHdoZW4gX2JpZE1hZGUgZGlkIG5vdCByZXR1cm4gYW4gZXJyb3IpXG4gICAgX3NldEJpZChiaWQpe1xuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fYmlkTWFkZShiaWQpO1xuICAgICAgICBpZihlcnJvciYmZXJyb3IhPT10cnVlKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fYmlkPWJpZDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7KCFldmVudExpc3RlbmVyfHxldmVudExpc3RlbmVyLmJpZE1hZGUodGhpcy5fYmlkKSk7fWNhdGNoKGVycm9yKXt9fSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNhcmRQbGF5ZWQgaW4gUmlra2VuVGhlR2FtZSBjYW4gbm93IHJldHVybiBhbiBlcnJvciAoaW5zdGVhZCBvZiB0aHJvd2luZyBvbmUpXG4gICAgX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIGthYXJ0IGluIHRlIHNwZWxlbiFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLmNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgfVxuICAgIC8vIFRPRE8gYSBiaWQgc2V0dGVyIHdpbGwgYWxsb3cgc3ViY2xhc3NlcyB0byBwYXNzIGEgYmlkIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5XG4gICAgX3NldENhcmQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHBsYXllZCBjYXJkIGlzIHZhbGlkIHNob3VsZCBiZSBkb25lIGhlcmUsIG9yIEJFRk9SRSBjYWxsaW5nIHNldENhcmRcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fY2FyZD1jYXJkO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLmNhcmRQbGF5ZWQodGhpcy5fY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvb3NlbiBhIHRydW1wIHN1aXRlXG4gICAgX3RydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHRyb2Vma2xldXIgaW4gdGUga2llemVuIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICB9XG4gICAgX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci50cnVtcFN1aXRlQ2hvc2VuKHRoaXMuX3RydW1wU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob3NlbiBhIHBhcnRuZXJcbiAgICBfcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHBhcnRuZXIgKGthYXJ0a2xldXIpIHRlIGtpZXplbi5cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnBhcnRuZXJTdWl0ZUNob3Nlbih0aGlzLl9wYXJ0bmVyU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gbWFrZSBhIGJpZCBwYXNzaW5nIGluIHRoZSBoaWdoZXN0IGJpZCBzbyBmYXJcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgbWFrZUFCaWQocGxheWVyYmlkcyl7XG4gICAgICAgIC8vIGFzc3VtZXMgdGhhdCB0aGlzIHBsYXllciBoYXMgbWFkZSBhIGJpZCBiZWZvcmUsIG9yIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgYmlkXG4gICAgICAgIC8vIHRoaXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRvIGJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIHNvIHdlIGNhbiB1c2UgcHJvbXB0KClcbiAgICAgICAgLy8gYWxsIG90aGVyIGF2YWlsYWJsZSBiaWRzIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiB0aGUgbGFzdCBiaWQgYnkgYW55IG90aGVyIHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZFNvRmFyPVBsYXllckdhbWUuQklEX1BBUztcbiAgICAgICAgaWYocGxheWVyYmlkcyl7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlBsYXllciBiaWRzOlwiLHBsYXllcmJpZHMpO1xuICAgICAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8cGxheWVyYmlkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICAgICAgaWYocGxheWVyYmlkc1twbGF5ZXJdLmxlbmd0aD4wJiZwbGF5ZXJiaWRzW3BsYXllcl1bMF0+aGlnaGVzdEJpZFNvRmFyKVxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0QmlkU29GYXI9cGxheWVyYmlkc1twbGF5ZXJdWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nKFwiSGlnaGVzdCBiaWQgc28gZmFyOiAnXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXStcIicuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgaGlnaGVzdCBwb3NzaWJsZSBiaWQgaXMgbm90IGEgYmlkIGFsbCBjYW4gcGxheSAoYXQgdGhlIHNhbWUgdGltZSksIGNhbid0IGJlIGJpZCBhZ2FpblxuICAgICAgICBpZihQbGF5ZXJHYW1lLkJJRFNfQUxMX0NBTl9QTEFZLmluZGV4T2YoUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXSk8MCloaWdoZXN0QmlkU29GYXIrKztcbiAgICAgICAgbGV0IHBvc3NpYmxlQmlkTmFtZXM9UGxheWVyR2FtZS5CSURfTkFNRVMuc2xpY2UoaGlnaGVzdEJpZFNvRmFyKTtcbiAgICAgICAgcG9zc2libGVCaWROYW1lcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW1BsYXllckdhbWUuQklEX1BBU10pOyAvLyB1c2VyIGNhbiBhbHdheXMgJ3BhcydcbiAgICAgICAgdGhpcy5sb2coXCJQb3NzaWJsZSBiaWRzOiBcIixwb3NzaWJsZUJpZE5hbWVzKTtcbiAgICAgICAgbGV0IGJpZD0tMTtcbiAgICAgICAgd2hpbGUoYmlkPDApe1xuICAgICAgICAgICAgbGV0IGJpZG5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IGlzIHlvdXIgYmlkIChvcHRpb25zOiAnXCIrcG9zc2libGVCaWROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlQmlkTmFtZXNbMF0pO1xuICAgICAgICAgICAgYmlkPVBsYXllckdhbWUuQklEX05BTUVTLmluZGV4T2YoYmlkbmFtZSk7XG4gICAgICAgICAgICBpZihiaWQ8MCljb250aW51ZTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRCaWQoYmlkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgYmlkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICAvLyBpZiB0aGlzIHBsYXllciBoYXMgYWxsIGFjZXMgaXQncyBnb25uYSBiZSB0aGUgc3VpdGUgb2YgYSBraW5nIHRoZSBwZXJzb24gaGFzbid0XG4gICAgICAgIC8vIGFsc28gaXQgbmVlZHMgdG8gYmUgYW4gYWNlIG9mIGEgc3VpdGUgdGhlIHVzZXIgaGFzIGl0c2VsZiAodW5sZXNzIHlvdSBoYXZlIGFsbCBvdGhlciBhY2VzKVxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICAvLyBhbnkgb2YgdGhlIHN1aXRlcyBpbiB0aGUgY2FyZHMgY2FuIGJlIHRoZSB0cnVtcCBzdWl0ZSFcbiAgICAgICAgbGV0IHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzPXRoaXMuZ2V0U3VpdGVzKCkubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPS0xO1xuICAgICAgICB3aGlsZSh0cnVtcFN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHRydW1wTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgc3VpdGUgd2lsbCBiZSB0cnVtcCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVUcnVtcFN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgdHJ1bXBTdWl0ZT1wb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5pbmRleE9mKHRydW1wTmFtZSk7XG4gICAgICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFza3MgZm9yIHRoZSBzdWl0ZSBvZiB0aGUgcGFydG5lciBjYXJkIG9mIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgY2hvb3NlUGFydG5lclN1aXRlKCl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclJhbms9UkFOS19BQ0U7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIGFjZWxlc3Mgc3VpdGVzXG4gICAgICAgIGxldCBzdWl0ZXM9dGhpcy5nZXRTdWl0ZXMoKTtcbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD09MCl7IC8vIHBsYXllciBoYXMgQUxMIGFjZXNcbiAgICAgICAgICAgIGlmKHN1aXRlcy5sZW5ndGg8NCl7IC8vIGJ1dCBub3QgYWxsIHN1aXRlc1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgc3VpdHMgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhcmUgYWxsb3dlZCAoYXNraW5nIHRoZSBhY2UgYmxpbmQhISEpXG4gICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPVswLDEsMiwzXS5maWx0ZXIoKHN1aXRlKT0+e3JldHVybiBwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZihzdWl0ZSk8MDt9KTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBoYXMgYWxsIHN1aXRzLCBzbyBhIGtpbmcgaXMgdG8gYmUgc2VsZWN0ZWQhISFcbiAgICAgICAgICAgICAgICAvLyBhbGwga2luZ3MgYWNjZXB0YWJsZSBleGNlcHQgZm9yIHRoYXQgaW4gdGhlIHRydW1wIGNvbG9yXG4gICAgICAgICAgICAgICAgLy8gTk9URSBpZiBhIHBlcnNvbiBhbHNvIGhhcyBhbGwgdGhlIGtpbmdzIHdlIGhhdmUgYSBzaXR1YXRpb24sIHdlIHNpbXBseSBjb250aW51ZSBvbndhcmRcbiAgICAgICAgICAgICAgICB3aGlsZSgxKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbmstLTtcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJ1bXBTdWl0ZUluZGV4PXBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHRoaXMuX3RydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0cnVtcFN1aXRlSW5kZXg+PTApcG9zc2libGVQYXJ0bmVyU3VpdGVzLnNwbGljZSh0cnVtcFN1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg+MClicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXM9cG9zc2libGVQYXJ0bmVyU3VpdGVzLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB3aGlsZShwYXJ0bmVyU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgXCIrQ2FyZC5DQVJEX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXStcIiBzaG91bGQgeW91ciBwYXJ0bmVyIGhhdmUgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICBwYXJ0bmVyU3VpdGU9cG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5pbmRleE9mKHBhcnRuZXJTdWl0ZU5hbWUpO1xuICAgICAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIGFuZCBhZGQgaXQgdG8gdGhlIGdpdmVuIHRyaWNrXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIHBsYXlBQ2FyZCh0cmljayl7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGFza2VkIHRvIHBsYXkgYSBjYXJkLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHVzaW5nIHRoZSBmaXJzdCBsZXR0ZXJzIG9mIHRoZSBhbHBoYWJldD9cbiAgICAgICAgbGV0IHBvc3NpYmxlQ2FyZE5hbWVzPVtdO1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBwb3NzaWJsZUNhcmROYW1lcy5wdXNoKFN0cmluZy5jYXJkSW5kZXgrMSkrXCI6IFwiK3RoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGxldCBjYXJkUGxheUluZGV4PS0xO1xuICAgICAgICB3aGlsZShjYXJkUGxheUluZGV4PDApe1xuICAgICAgICAgICAgLy8gd2UncmUgc3VwcG9zZWQgdG8gcGxheSBhIGNhcmQgd2l0aCBzdWl0ZSBlcXVhbCB0byB0aGUgZmlyc3QgY2FyZCB1bmxlc3MgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBpcyBiZWluZyBhc2tlZCBmb3JcbiAgICAgICAgICAgIGxldCBjYXJkSWQ9cGFyc2VJbnQocHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIlxcblByZXNzIHRoZSBpZCBvZiB0aGUgY2FyZCB5b3Ugd2FudCB0byBhZGQgdG8gXCIrdHJpY2suZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUNhcmROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLFwiXCIpKTtcbiAgICAgICAgICAgIGlmKGlzTmFOKGNhcmRJZCkpY29udGludWU7XG4gICAgICAgICAgICBjYXJkUGxheUluZGV4PWNhcmRJZC0xO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENhcmQodGhpcy5fY2FyZHNbY2FyZFBsYXlJbmRleF0pO1xuICAgIH1cblxuICAgIHNldCBwYXJ0bmVyKHBhcnRuZXIpe3RoaXMuX3BhcnRuZXI9KHR5cGVvZiBwYXJ0bmVyPT09J251bWJlcic/cGFydG5lcjotMSk7fSAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgdHJpY2tXb24odHJpY2tJbmRleCl7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbi5wdXNoKHRyaWNrSW5kZXgpO1xuICAgICAgICB0aGlzLmxvZyhcIlRyaWNrICNcIit0cmlja0luZGV4K1wiIHdvbiBieSAnXCIrdGhpcy5uYW1lK1wiJzogXCIrdGhpcy5fdHJpY2tzV29uK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NXb24oKXtyZXR1cm4gdGhpcy5fdHJpY2tzV29uLmxlbmd0aDt9XG4gICAgXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgdHJpY2tzIHdvbiAoaW5jbHVkaW5nIHRob3NlIGJ5IHRoZSBwYXJ0bmVyIChpZiBhbnkpKVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXJPZlRyaWNrc1dvbit0aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5wYXJ0bmVyKSk7XG4gICAgfVxuXG4gICAgc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihudW1iZXJPZlRyaWNrc1RvV2luKXt0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPW51bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1RvV2luKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIFxuICAgIC8vIGV2ZXJ5IHBsYXllciBjYW4gYmUgY2hlY2tlZCB3aGV0aGVyIGZyaWVuZCAoMSkgb3IgZm9vICgtMSkgb3IgdW5rbm93biAoMClcbiAgICBpc0ZyaWVuZGx5KHBsYXllcil7XG4gICAgICAgIGlmKHBsYXllcj09PXRoaXMuX2luZGV4KXJldHVybiAyOyAvLyBJJ20gbXVjaG8gZnJpZW5kbHkgdG8gbXlzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXsgLy8gYSBub24tc29saXRhcnkgZ2FtZVxuICAgICAgICAgICAgLy8gQVNTRVJUIG5vdCBhIHNvbGl0YXJ5IGdhbWUgc28gcGxheWVyIGNvdWxkIGJlIHRoZSBwYXJ0bmVyIGluIGNyaW1lXG4gICAgICAgICAgICAvLyBpZiBwYXJ0bmVyIGlzIGtub3duIChpLmUuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgbm8gbG9uZ2VyIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lcj49MClyZXR1cm4ocGxheWVyPT09dGhpcy5fcGFydG5lcj8xOi0xKTsgXG4gICAgICAgICAgICAvLyBBU1NFUlQgcGFydG5lciB1bmtub3duIChpLmUuIHBhcnRuZXIgY2FyZCBzdGlsbCBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGxldCB0cnVtcFBsYXllcj10aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk7XG4gICAgICAgICAgICAvLyBpZiBJJ20gdGhlIHRydW1wIHBsYXllciwgYXNzdW1lIEFMTCB1bmZyaWVuZGx5IEJVVCBubyBJIGRvbid0IGtub3cgd2hvIG15IHBhcnRuZXIgaXMgYWxsIGNvdWxkIGJlXG4gICAgICAgICAgICBpZih0aGlzLl9pbmRleD09PXRydW1wUGxheWVyKXJldHVybiAwOyAvLyB1bmtub3duXG4gICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUsdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpKSkgLy8gSSBoYXZlIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICByZXR1cm4ocGxheWVyPT10cnVtcFBsYXllcj8xOi0xKTsgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmcmllbmRseSwgdGhlIG90aGVycyBhcmUgdW5mcmllbmRseVxuICAgICAgICAgICAgLy8gQVNTRVJUIEknbSBub3QgdGhlIHRydW1wIHBsYXllciwgYW5kIEknbSBub3Qgd2l0aCB0aGUgdHJ1bXAgcGxheWVyIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZm9vLCB0aGUgcmVzdCBJIGRvbid0IGtub3cgeWV0XG4gICAgICAgICAgICByZXR1cm4ocGxheWVyPT09dHJ1bXBQbGF5ZXI/LTE6MCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIGEgc29saXRhcnkgZ2FtZVxuICAgICAgICAvLyBpZiBJJ20gb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzLCBldmVyeW9uZSBlbHNlIGlzIGEgZm9vXG4gICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHRoaXMuX2luZGV4KT49MClyZXR1cm4gLTE7XG4gICAgICAgIC8vIEFTU0VSVCBub3Qgb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzXG4gICAgICAgIC8vICAgICAgICBpZiBwbGF5ZXIgaXMgYSBzb2xpdGFyeSBwbGF5ZXIgaXQncyBhIGZvbywgb3RoZXJ3aXNlIGl0J3MgdXMgYWdhaW5zdCB0aGVtISEhIVxuICAgICAgICByZXR1cm4odGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YocGxheWVyKT49MD8tMToxKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiB0aGlzLm5hbWU7fVxuXG59XG5cbi8vIGV4cG9ydCB0aGUgUGxheWVyIGNsYXNzXG5tb2R1bGUuZXhwb3J0cz17UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn07IiwiY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTsgLy8gZm9yIGNvbXBhcmluZyBjYXJkc1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuY2xhc3MgVHJpY2sgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgLy8gTURIQDA3REVDMjAxOTogZ2FtZSBkYXRhIG1vdmVkIG92ZXIgdG8gUGxheWVyR2FtZSBpbnN0YW5jZSAoYXMgcGFzc2VkIHRvIGVhY2ggcGxheWVyKVxuICAgIC8vICAgICAgICAgICAgICAgIGNhbkFza0ZvclBhcnRuZXJDYXJkIGJsaW5kIG5vdyBkZXRlcm1pbmVkIGJ5IHRoZSBnYW1lIChlbmdpbmUpIGl0c2VsZlxuXG4gICAgLy8gYnkgcGFzc2luZyBpbiB0aGUgdHJ1bXAgcGxheWVyIChpLmUuIHRoZSBwZXJzb24gdGhhdCBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkKVxuICAgIGNvbnN0cnVjdG9yKGZpcnN0UGxheWVyLHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLGNhbkFza0ZvclBhcnRuZXJDYXJkLGZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyl7IC8vIHJlcGxhY2luZzogdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssdHJ1bXBQbGF5ZXIpe1xuICAgICAgICBzdXBlcigpOyAvLyB1c2luZyA0IGZpeGVkIHBvc2l0aW9ucyBmb3IgdGhlIHRyaWNrIGNhcmRzIHNvIHdlIHdpbGwga25vdyB3aG8gcGxheWVkIHRoZW0hISEhXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyPWZpcnN0UGxheWVyO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7IC8vIGZvciBpbnRlcm5hbCB1c2UgdG8gYmUgYWJsZSB0byBkZXRlcm1pbmUgdGhlIHdpbm5lciBvZiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5fcGFydG5lclJhbms9cGFydG5lclJhbms7IC8vIG5lZWQgdGhpcyB3aGVuIGl0J3MgYmVpbmcgYXNrZWQgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXJcbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9Y2FuQXNrRm9yUGFydG5lckNhcmQ7IC8vIC0xIGJsaW5kLCAwIG5vdCwgMSBub24tYmxpbmRcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gdGhlICdmbGFnJyBzZXQgYnkgdGhlIHRydW1wIHBsYXllciB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0tMTsgLy8gdGhlIHN1aXRlIG9mIHRoZSB0cmljayAobW9zdCBvZiB0aGUgdGltZSB0aGUgc3VpdGUgb2YgdGhlIGZpcnN0IGNhcmQpXG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9LTE7IC8vIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgKG5vdGU6IE5PVCB0cmFuc2Zvcm1lZCB0byB0aGUgYWN0dWFsIHBsYXllciBpbmRleCB5ZXQpXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcz1maXJzdFBsYXllckNhblBsYXlTcGFkZXM7XG4gICAgICAgIC8vIGxldCdzIGtlZXAgdHJhY2sgb2YgdGhlIGhpZ2hlc3QgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgY2FuIGFzayBmb3IgcGFydG5lciBjYXJkOiBcIitjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzOiBcIitmaXJzdFBsYXllckNhblBsYXlTcGFkZXMrXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlczt9XG4gICAgXG4gICAgLy8gdGhlIHdpbm5lciBleHBvc2VkIGlzIHRoZSBhY3R1YWwgcGxheWVyIHdobyB3b25cbiAgICBnZXQgd2lubmVyKCl7cmV0dXJuKHRoaXMuX3dpbm5lckNhcmQ8MD8tMToodGhpcy5fd2lubmVyQ2FyZCt0aGlzLl9maXJzdFBsYXllciklNCk7fVxuICAgIFxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IG1vdmVkIGZyb20gaGVyZSB0byB0aGUgZ2FtZSAoYXMgYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICAgIC8qXG4gICAgZ2V0IHRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO30gLy8gZXhwb3NlcyB0aGUgY3VycmVudCB0cnVtcCBwbGF5ZXJcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAqL1xuICAgIGdldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDt9XG5cbiAgICAvLyBwYXNzIGluIC0xIHdoZW4gYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQsIG9yICsxIHdoZW4gYXNraW5nIGZvciBpdCAobm9uLWJsaW5kKVxuICAgIHNldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZChhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHR5cGVvZiBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PVwibnVtYmVyXCIpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgTk9UIGRlZmluZWQhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLm51bWJlck9mQ2FyZHM+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9wZ2V2ZW4gZGUgcGFydG5lciBhYXMvaGVlciAoYmxpbmQpIHRlIHZyYWdlbiBuaWV0IG1lZXIgdG9lZ2VzdGFhbi5cIik7XG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPWFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFza2luZyBmb3IgcGFydG5lciBjYXJkIHNldCB0byBcIit0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgX3NldFdpbm5lckNhcmQod2lubmVyQ2FyZCl7XG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9d2lubmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayB3aW5uZXIgY2FyZDogXCIrd2lubmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgY2FyZCBwbGF5ZWQgYnkgKHRoZSBhY3R1YWwpIHBsYXllciAoYXMgdXNlZCBmb3Igc2hvd2luZyB0aGUgdHJpY2sgY2FyZHMpXG4gICAgICogQHBhcmFtIHsqfSBwbGF5ZXIgXG4gICAgICovXG4gICAgZ2V0UGxheWVyQ2FyZChwbGF5ZXIpe1xuICAgICAgICBsZXQgcGxheWVyQ2FyZD0odGhpcy5fZmlyc3RQbGF5ZXI+PTA/KHBsYXllcis0LXRoaXMuX2ZpcnN0UGxheWVyKSU0Om51bGwpO1xuICAgICAgICByZXR1cm4ocGxheWVyQ2FyZD49MCYmcGxheWVyQ2FyZDx0aGlzLm51bWJlck9mQ2FyZHM/dGhpcy5fY2FyZHNbcGxheWVyQ2FyZF06bnVsbCk7XG4gICAgfVxuXG4gICAgLypcbiAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgdGhlIGZpcnN0IHBsYXllciBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgaWYoIXRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIChhbnltb3JlKS5cIik7XG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT10aGlzLl90cnVtcFN1aXRlOyAvLyB0aGUgcGxheSBzdWl0ZSBiZWNvbWVzIHRoZSB0cnVtcCBzdWl0ZVxuICAgIH1cbiAgICAqL1xuICAgIC8vIE5PVEUgYWRkQ2FyZCBpcyBOT1QgX2FkZENhcmQgb2YgdGhlIHN1cGVyY2xhc3MhIHRoaXMgaXMgYmVjYXVzZSB3ZSBzaG91bGQgc2V0IHRoZSBob2xkZXIgb24gdGhlIGNhcmQgdG8gYWRkISEhIVxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgIC8vIGlmIHRoZSBmbGFnIG9mIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBpcyBzZXQsIHByZXNldCB0aGUgXG4gICAgICAgIGNhcmQuaG9sZGVyPXRoaXM7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhpcyB0cmljayBieSBzZXR0aW5nIHRoZSBob2xkZXIgcHJvcGVydHkgKHdpbGwgdGFrZSBjYXJlIG9mIGFkZGluZy9yZW1vdmluZyB0aGUgY2FyZClcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogc2hvdWxkIGNvbnNpZGVyIHJldHVybmluZyBhbiBFcnJvciBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yXG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkczw9bnVtYmVyT2ZDYXJkc05vdylcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWRkIHRoZSBjYXJkIHRvIHRoZSB0cmljay5cIik7XG4gICAgICAgIC8vIEFTU0VSVCBjYXJkIGFkZGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5fdHJ1bXBTdWl0ZTwwKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkJVRzogQXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkLCBidXQgcGxheWluZyBhIGdhbWUgd2l0aG91dCB0cnVtcC5cIik7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciBibGluZCBldmVyeW9uZSBoYXMgdG8gcGxheSB0aGUgcGFydG5lciBjYXJkIHN1aXRlXG4gICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IE9PUFMgSSB3YXMgYWxyZWFkeSB1c2luZyB0aGlzLl9wYXJ0bmVyU3VpdGUgaGVyZSBCVVQgc3RpbGwgYWZ0ZXIgYWN0dWFsbHkgdGFraW5nIGl0IG91dCAobm93IGluIGFnYWluKVxuICAgICAgICBpZih0aGlzLl9wbGF5U3VpdGU8MCl7IC8vIGZpcnN0IGNhcmQgYmVpbmcgcGxheWVkXG4gICAgICAgICAgICAvLyBNREhAMThKQU4yMDIwOiBhc2NlcnRhaW4gdGhhdCBfYXNraW5nRm9yUGFydG5lckNhcmQgaGFzIHRoZSByaWdodCB2YWx1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgaXQgY291bGQgYmUgMCBidXQgd2hlbiB0aGUgcGFydG5lciBzdWl0ZSBpcyBwbGF5ZWQgdGhlIHBsYXllciBJUyBhc2tpbmdcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkIT09MCl7IC8vIHBsYXllciBzdXBwb3NlZGx5IGNhbiBzdGlsbCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDw9MCYmY2FyZC5zdWl0ZT09PXRoaXMuX3BhcnRuZXJTdWl0ZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDApdGhyb3cgbmV3IEVycm9yKFwiQlVHOiBDYW5ub3QgYXNrIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkltcGxpY2l0bHkgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJ5IHBsYXlpbmcgdGhlIHBhcnRuZXIgc3VpdGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT09MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgd2hlbiB5b3UgY2FuJ3QgYXNrIGZvciBpdCBhbnltb3JlIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0odGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MD90aGlzLl9wYXJ0bmVyU3VpdGU6Y2FyZC5zdWl0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIHRoaXMuX3BsYXlTdWl0ZSBub3cgZGVmaW5pdGVseSBub24tbmVnYXRpdmUsIHNvXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPTA7IC8vIHVzZSB0aGUgcmlnaHQgcHJvcGVydHkgYnJvJ1xuICAgICAgICAvLyB1cGRhdGUgd2lubmVyXG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHNOb3c+MCl7XG4gICAgICAgICAgICAvLyBNREhAMDlERUMyMDE5OiB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBvbmx5IHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGV2ZXIgd2luIChldmVuIGlmIHRoZXJlJ3MgdHJ1bXAhISlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJ1dCB3ZSBuZWVkIHRvIGtub3cgd2hldGhlciB0aGUgcGFydG5lciBjYXJkIHdhcyBhbHJlYWR5IHRocm93blxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgU09MVVRJT046IChORUFUKSBpdCdzIGVhc2llc3QgdG8gc2ltcGx5IGlnbm9yZSB0cnVtcCBpcyB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciEhISEhIVxuICAgICAgICAgICAgaWYoQ2FyZC5jb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZCx0aGlzLl9jYXJkc1t0aGlzLl93aW5uZXJDYXJkXSx0aGlzLl9wbGF5U3VpdGUsKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wPy0xOnRoaXMuX3RydW1wU3VpdGUpKT4wKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQobnVtYmVyT2ZDYXJkc05vdyk7XG4gICAgICAgIH1lbHNlIC8vIGFmdGVyIHRoZSBmaXJzdCBjYXJkIHRoZSBmaXJzdCBwbGF5ZXIgaXMgdGhlIHdpbm5lciBvZiBjb3Vyc2VcbiAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQoMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRDYXJkUGxheWVyKHN1aXRlLHJhbmspe1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLl9jYXJkcy5sZW5ndGg7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlPT09c3VpdGUmJnRoaXMuX2NhcmRzW2NhcmRJbmRleF0ucmFuaz09PXJhbmspXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9maXJzdFBsYXllcitjYXJkSW5kZXgpJTQ7IC8vIFRPRE8gY2FuIHdlIGFzc3VtZSA0IHBsYXllcnMgaW4gdG90YWw/Pz8/P1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGdldHRlcnNcbiAgICBnZXQgcGxheVN1aXRlKCl7cmV0dXJuIHRoaXMuX3BsYXlTdWl0ZTt9XG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIC8qXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgKi9cbiAgICBnZXQgY2FuQXNrRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ7fVxufVxuXG5tb2R1bGUuZXhwb3J0cz1UcmljaztcbiIsIi8qKlxuICogdGhlIHBhcnQgdGhhdCBydW5zIGluIHRoZSBicm93c2VyIG9mIGEgc2luZ2xlIHBsYXllclxuICogZ2l2ZW4gdGhhdCBhbnkgaW5mb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgcGxheWVyIG9mIHRoZSBnYW1lIHNob3VsZCBiZSBhdmFpbGFibGUgdGhyb3VnaCBpdCdzIF9nYW1lIHByb3BlcnR5IChpLmUuIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAqIGFsbCBjYWxscyBpbiBtYWluLmpzIHRvIHJpa2tlblRoZUdhbWUgZGlyZWN0bHkgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggY2FsbHMgdG8gY3VycmVudFBsYXllci5nYW1lIGkuZS4gcmlra2VuVGhlR2FtZSBpdHNlbGYgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSB0byB0aGUgY3VycmVudFBsYXllciEhIVxuICogXG4qKi9cbi8vIHdlJ2xsIGJlIHVzaW5nIFBsYXllci5qcyBvbmx5IChQbGF5ZXIuanMgd2lsbCBkZWFsIHdpdGggcmVxdWlyaW5nIENhcmRIb2xkZXIsIGFuZCBDYXJkSG9sZGVyIENhcmQpXG4vLyBOTyBJIG5lZWQgdG8gcmVxdWlyZSB0aGVtIGFsbCBvdGhlcndpc2UgYnJvd3NlcmlmeSB3b24ndCBiZSBhYmxlIHRvIGZpbmQgQ2FyZCwgZXRjLlxuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5jb25zdCBUcmljaz1yZXF1aXJlKCcuL1RyaWNrLmpzJyk7IC8vIG5vdyBpbiBzZXBhcmF0ZSBmaWxlXG5jb25zdCB7UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn09cmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcblxuY29uc3QgTGFuZ3VhZ2U9cmVxdWlyZSgnLi9MYW5ndWFnZS5qcycpO1xuLyogcmVwbGFjaW5nOlxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG4qL1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cil7cmV0dXJuKHN0cj8oc3RyLmxlbmd0aD9zdHJbMF0udG9VcHBlckNhc2UoKStzdHIuc2xpY2UoMSk6XCJcIik6XCI/XCIpO31cblxuY29uc3QgVklTSUJMRT1cImluaGVyaXRcIjsgLy8gTURIQDAzRkVCMjAyMDogaWYgd2UnZCB1c2UgdmlzaWJsZSwgaXQgd291bGQgaWdub3JlIHdoYXQgdGhlIHBhcmVudCdzIHZpc2liaWxpdHkgaXMsIGFuZCBrZWVwIHNob3dpbmcuLi5cblxuLy8gTURIQDA3SkFOMjAyMDogYWRkaW5nIGVudGVyaW5nIHRoZSBpZCBvZiB0aGUgdXNlciBvbiBwYWdlLXNldHRpbmdzLCBzbyB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgYSBuZXcgb25lXG4vLyAgICAgICAgICAgICAgICBhbHRlcm5hdGl2ZWx5IHdlIGNhbiBkbyB0aGF0IG9uIGEgc2VwYXJhdGUgcGFnZSAvIHBhZ2UtYXV0aCBpcyBPS1xuLy8gICAgICAgICAgICAgICAgd2UgZ28gdG8gcGFnZS1hdXRoIHdoZW4gTk9UIHBsYXlpbmcgdGhlIGdhbWUgaW4gZGVtbyBtb2RlISEhXG4vLyAgICAgICAgICAgICAgICBpbiBub24tZGVtbyBtb2RlIHlvdSBpZGVudGlmeSB5b3Vyc2VsZiwgdGhlbiB3aGVuIHNldFBsYXllck5hbWUgaXMgc3VjY2Vzc2Z1bCBnbyB0byBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbi8vIE1ESEAxMEpBTjIwMjA6IHJlbW92aW5nIHBhZ2Utc2V0dGluZ3MgYW5kIHBhZ2Utc2V0dXAtZ2FtZSwgYWRkaW5nIHBhZ2UtaGVscFxuY29uc3QgUEFHRVM9W1wicGFnZS1ydWxlc1wiLFwicGFnZS1oZWxwXCIsXCJwYWdlLWF1dGhcIixcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiLFwicGFnZS1iaWRkaW5nXCIsXCJwYWdlLXRydW1wLWNob29zaW5nXCIsXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIixcInBhZ2UtcGxheS1yZXBvcnRpbmdcIixcInBhZ2UtcGxheWluZ1wiLFwicGFnZS1maW5pc2hlZFwiXTtcblxudmFyIGN1cnJlbnRQYWdlPW51bGw7IC8vIGxldCdzIGFzc3VtZSB0byBiZSBzdGFydGluZyBhdCBwYWdlLXJ1bGVzXG52YXIgdmlzaXRlZFBhZ2VzPVtdOyAvLyBubyBwYWdlcyB2aXNpdGVkIHlldFxuXG52YXIgY3VycmVudFBsYXllcj1udWxsOyAvLyB0aGUgY3VycmVudCBnYW1lIHBsYXllclxuXG52YXIgY3VycmVudEdhbWU9bnVsbDsgLy8gd2UgcmVtZW1iZXIgdGhlIGdhbWUgdW50aWwgd2Ugbm8gbG9uZ2VyIG5lZWQgaXRcblxuZnVuY3Rpb24gc3RvcFBsYXlpbmcoKXtcbiAgICAvLyBBU1NFUlQgYXNzdW1pbmcgbm90IHBsYXlpbmcgaW4gYSBnYW1lIGFueW1vcmUgaS5lLiBuZXdHYW1lKCkgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZVxuICAgIC8vIGEgTk9STUFMIGV4aXRcbiAgICBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIuZXhpdCgnU1RPUCcpO1xuICAgIC8vICdtYW51YWxseScgbW92ZSB0byB0aGUgcHJldmlvdXMgJ3BhZ2UnIGluIHRoZSBoaXN0b3J5Li4uXG4gICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xufVxuXG4vLyBNREhAMTBKQU4yMDIwOiBuZXdHYW1lKCkgaXMgYSBiaWQgZGlmZmVyZW50IHRoYW4gaW4gdGhlIGRlbW8gdmVyc2lvbiBpbiB0aGF0IHdlIHJldHVybiB0byB0aGUgd2FpdGluZy1wYWdlXG5mdW5jdGlvbiBuZXdHYW1lKCl7XG4gICAgLy8gYnkgY2FsbCBwbGF5c1RoZUdhbWVBdEluZGV4KG51bGwsPykgd2UgZm9yY2UgY2xlYXJpbmcgdGhlIGdhbWUgaW5mb3JtYXRpb24gYmVpbmcgc2hvd24gYXQgdGhlIHdhaXQtZm9yLXBsYXllcnMgcGFnZVxuICAgIGlmKCFjdXJyZW50UGxheWVyKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HOiBObyBwbGF5ZXIgdG8gc3RhcnQgYSBuZXcgZ2FtZSB3aXRoIVwiKTtcbiAgICAgICAgc3RvcFBsYXlpbmcoKTtcbiAgICB9ZWxzZVxuICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG59XG5cbnZhciB0b01ha2VBQmlkPWZhbHNlOyAvLyBNREhAMDNGRUIyMDIwOiBzb21lIHByb3RlY3Rpb25cblxuLy8gTURIQDI5SkFOMjAyMDogZGVjaWRpbmcgdG8gYWx3YXlzIHNob3cgdGhlIHVzZXIgbmFtZSBpbiB0aGUgZG9jdW1lbnQgdGl0bGUsIGFuZCB0byBibGluayBpdCB3aGVuXG4vLyAgICAgICAgICAgICAgICB1c2VyIGlucHV0IGlzIHJlcXVpcmVkXG52YXIgZm9yY2VGb2N1c0lkPW51bGw7XG52YXIgZm9yY2VGb2N1c1RleHQ9bnVsbDtcbmZ1bmN0aW9uIHN0b3BGb3JjZUZvY3VzKCl7Y2xlYXJJbnRlcnZhbChmb3JjZUZvY3VzSWQpO2ZvcmNlRm9jdXNJZD1udWxsO31cbmZ1bmN0aW9uIGNoZWNrRm9jdXMoc3RhdGUpe1xuICAgIC8vIE1ESEAyM0pBTjIwMjA6IHdlIHNob3VsZCBrZWVwIGJsaW5raW5nIHdoZW4gbm90IGluIGZvY3VzIHVudGlsIGZvcmNlZCB0byBzdG9wXG4gICAgLy8gICAgICAgICAgICAgICAgaW5zdGVhZCBvZiBzdG9wcGluZyB3aGVuIHRoZSBmb2N1cyB3YXMgZ290XG4gICAgLy8gTURIQDI5SkFOMjAyMCByZW1vdmluZyB0aGlzIHNob3VsZCBzdWZmaWNlOiBpZihkb2N1bWVudC5oYXNGb2N1cygpKXNob3dHYW1lU3RhdGUoc3RhdGUpO2Vsc2UgXG4gICAgLy8vLy8vLy8gdG9nZ2xlR2FtZVN0YXRlKGZvcmNlRm9jdXNUZXh0KTtcbiAgICBpZihkb2N1bWVudC5oYXNGb2N1cygpKXtzaG93R2FtZVN0YXRlKHN0YXRlKTtzdG9wRm9yY2VGb2N1cygpO31lbHNlIHRvZ2dsZUdhbWVTdGF0ZShzdGF0ZSk7XG59XG5mdW5jdGlvbiBmb3JjZUZvY3VzKHN0YXRlKXtcbiAgICAvLyBpZihzdGF0ZSlcbiAgICBmb3JjZUZvY3VzVGV4dD1zdGF0ZTtcbiAgICBzaG93R2FtZVN0YXRlKGZvcmNlRm9jdXNUZXh0KTsgLy8gYXNjZXJ0YWluIHRvIHN0YXJ0IHdpdGggdGhlIGdpdmVuIG5vbi1udWxsICdzdGF0ZSdcbiAgICBpZihzdGF0ZSl7IC8vIGZvY3VzIHJlcXVlc3RlZFxuICAgICAgICAvLyBzdGFydCBnZXR0aW5nIHRoZSBmb2N1cyBieSBibGlua2luZyAnc3RhdGUnIElGRiB3ZSBoYXZlbid0IGdvdCBpdCB5ZXQuLi5cbiAgICAgICAgaWYoIWZvcmNlRm9jdXNJZClmb3JjZUZvY3VzSWQ9c2V0SW50ZXJ2YWwoKCk9PntjaGVja0ZvY3VzKHN0YXRlKX0sNTAwKTtcbiAgICB9ZWxzZXsgLy8gZW5kIG9mIGZvY3VzIHJlcXVlc3RcbiAgICAgICAgaWYoZm9yY2VGb2N1c0lkKXN0b3BGb3JjZUZvY3VzKCk7XG4gICAgfVxufVxuXG4vLyBNREhAMzFKQU4yMDIwOiBrZWVwIGEgJ3N0YXRlJyB3aGljaCB3aWxsIGRldGVybWluZSB3aGF0IG1lc3NhZ2VzIHRoZSBwbGF5ZXIgY2FuIHNlbmQgb3ZlciB0byB0aGUgc2VydmVyXG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9HQU1FPTA7XG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9CSUQ9MTtcbmNvbnN0IFBMQVlFUlNUQVRFX0JJRD0yLFBMQVlFUlNUQVRFX0JJRF9ET05FPTMsUExBWUVSU1RBVEVfQklEX1JFQ0VJVkVEPTQ7XG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9QTEFZPTU7XG5jb25zdCBQTEFZRVJTVEFURV9UUlVNUD02LFBMQVlFUlNUQVRFX1RSVU1QX0RPTkU9NyxQTEFZRVJTVEFURV9UUlVNUF9SRUNFSVZFRD04O1xuY29uc3QgUExBWUVSU1RBVEVfUEFSVE5FUj05LFBMQVlFUlNUQVRFX1BBUlRORVJfRE9ORT0xMCxQTEFZRVJTVEFURV9QQVJUTkVSX1JFQ0VJVkVEPTExO1xuY29uc3QgUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRD0xMjtcbmNvbnN0IFBMQVlFUlNUQVRFX0NBUkQ9MTMsUExBWUVSU1RBVEVfQ0FSRF9QTEFZRUQ9MTQsUExBWUVSU1RBVEVfQ0FSRF9SRUNFSVZFRD0xNTtcbmNvbnN0IFBMQVlFUlNUQVRFX0dBTUVfT1ZFUj0xNjtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0NBUkRTPTE3LFBMQVlFUlNUQVRFX0dBTUVfUkVDRUlWRUQ9MTgsUExBWUVSU1RBVEVfQ0FSRFNfUkVDRUlWRUQ9MTk7XG4vLyBNREhAMDFGRUIyMDIwOiB3ZSdyZSBOT1QgYWxsb3dpbmcgdG8gcmVzZW5kIHRoZSBjYXJkIHBsYXllZCBiZWNhdXNlIHRoYXQncyBhbHJlYWR5IGRvbmUgKGV2ZXJ5IDEwIHNlY29uZHMpIGJ5IFxuY29uc3QgcGxheWVyU3RhdGVNZXNzYWdlcz1bXCJJayB3YWNodCBvcCBlZW4gc3BlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIklrIHdhY2h0IG9wIGVlbiBib2RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcIk1vbWVudGplIG5vZ1wiLFwiQm9kIGFsIHZlcnN0dXVyZFwiLFwiQm9kIG9udHZhbmdlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIkxhdGVuIHdlIHNwZWxlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTW9tZW50amUgbm9nXCIsXCJUcm9lZmtsZXVyIGFsIGdla296ZW5cIixcIlRyb2Vma2xldXIgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIlBhcnRuZXIgYWwgZ2Vrb3plblwiLFwiS2xldXIgcGFydG5lcmthYXJ0IG9udHZhbmdlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIklrIHdhY2h0IG9wIGVlbiBrYWFydFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTW9tZW50amUgbm9nXCIsXCJLYWFydCBhbCBnZXNwZWVsZFwiLFwiS2FhcnQgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiQmVkYW5rdCB2b29yIGhldCBzcGVsZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJJayB3YWNodCBvcCBrYWFydGVuXCIsXCJTcGVsIGJlZ29ubmVuXCIsXCJCZWRhbmt0IHZvb3IgZGUga2FhcnRlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xudmFyIGN1cnJlbnRQbGF5ZXJTdGF0ZT1QTEFZRVJTVEFURV9XQUlUX0ZPUl9HQU1FO1xudmFyIHJlc2VuZEV2ZW50SWQ9bnVsbDtcbmZ1bmN0aW9uIGFsbG93UmVzZW5kRXZlbnQoKXtcbiAgICBzZW5kTWVzc2FnZUJ1dHRvbi5kaXNhYmxlZD1mYWxzZTsgLy8gZW5hYmxlIHRoZSBzZW5kIG1lc3NhZ2UgYnV0dG9uXG4gICAgLy8gcmVzZW5kRXZlbnRJZD1udWxsOyAvLyBubyBuZWVkIHRvIGNsZWFyIHRoZSB0aW1lb3V0IGFzIHdlJ3JlIGRvbmUgbm93XG59XG52YXIgc2VuZE1lc3NhZ2VUZXh0O1xuZnVuY3Rpb24gc2VuZE1lc3NhZ2VCdXR0b25DbGlja2VkKCl7XG4gICAgLy8gaWYgd2UgaGF2ZSBhIHJlc2VuZCBldmVudCBpZCB3ZSdyZSBkZWFsaW5nIHdpdGggYSByZXNlbmQsIG90aGVyd2lzZSB3ZSBzZW5kIHRoZSBtZXNzYWdlIGFzIHZpc2libGUgb24gdGhlIGJ1dHRvblxuICAgIGlmKHJlc2VuZEV2ZW50SWQpe1xuICAgICAgICAvLyByZXNlbmQgdGhlIGV2ZW50IHRvIHJlc2VuZFxuXG4gICAgICAgIC8vIHJlLWVuYWJsZSB0aGUgY3VycmVudCBzdGF0ZSB3aGljaCB3aWxsIGVmZmVjdGl2ZWx5IGd1YXJhbnRlZSB0aGF0IHRoZSB1c2VyIGNhbiByZXNlbmQgYWdhaW4gaW4gYW5vdGhlciA1IHNlY29uZHNcbiAgICAgICAgc2V0UGxheWVyU3RhdGUoY3VycmVudFBsYXllclN0YXRlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgc2V0SW5mbyhcIj9cIik7XG4gICAgICAgIC8vIGRvbid0IHNlbmQgYW55IHRleHQgaWYgc2VuZGluZyB0aGUgZGVmYXVsdCB0ZXh0XG4gICAgICAgIGxldCB0ZXh0VG9TZW5kPShzZW5kTWVzc2FnZVRleHQudmFsdWUhPT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0/c2VuZE1lc3NhZ2VUZXh0LnZhbHVlOicnKTtcbiAgICAgICAgY3VycmVudEdhbWUuX3NvY2tldC5lbWl0KCdQTEFZRVJfU0FZUycseydzdGF0ZSc6Y3VycmVudFBsYXllclN0YXRlLCd0ZXh0Jzp0ZXh0VG9TZW5kfSwocmVzcG9uc2UpPT57XG4gICAgICAgICAgICBzZXRJbmZvKHJlc3BvbnNlJiZyZXNwb25zZS5sZW5ndGg+MD9yZXNwb25zZTpcIkJlcmljaHQgb250dmFuZ2VuLCBtYWFyIGdlZW4gYW50d29vcmQgZ2VzdHV1cmQuXCIpO1xuICAgICAgICAgICAgLy8gaWYgdGhlIG1lc3NhZ2UgdGV4dCBkaWZmZXJlZCBmcm9tIHRoZSBkZWZhdWx0IG1lc3NhZ2Ugd2UgY2xlYXIgdGhlIG1lc3NhZ2UgdGV4dFxuICAgICAgICAgICAgaWYoc2VuZE1lc3NhZ2VUZXh0LnZhbHVlIT09cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdKXNlbmRNZXNzYWdlVGV4dC52YWx1ZT0nJztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0UGxheWVyU3RhdGUocGxheWVyU3RhdGUpe1xuICAgIC8vaWYocmVzZW5kRXZlbnRJZCl7Y2xlYXJUaW1lb3V0KHJlc2VuZEV2ZW50SWQpO3Jlc2VuZEV2ZW50SWQ9bnVsbDt9IC8vIGdldCByaWQgb2YgYW55IHBlbmRpbmcgcmVzZW5kIGV2ZW50IHRpbWVvdXRcbiAgICBsZXQgcmVwbGFjZU1lc3NhZ2VUZXh0PShzZW5kTWVzc2FnZVRleHQudmFsdWU9PT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0pOyAvLyB1c2VyIGhhc24ndCBjaGFuZ2VkIHRoZSB0ZXh0IHRvIHNlbmQgbWFudWFsbHkuLi5cbiAgICBjdXJyZW50UGxheWVyU3RhdGU9cGxheWVyU3RhdGU7XG4gICAgLy8gc2V0IHRoZSBtZXNzYWdlIHRleHQgb24gdGhlIHNlbmQgbWVzc2FnZSB0ZXh0IGlucHV0IGZpZWxkIGFjY29yZGluZ2x5XG4gICAgaWYocmVwbGFjZU1lc3NhZ2VUZXh0KXNlbmRNZXNzYWdlVGV4dC5pbm5lclRleHQ9cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdO1xuICAgIC8qIHJlc2VuZGluZyBhbHJlYWR5IG1hbmFnZWQgYnkgdGhlIGdhbWUgKHNlZSBjYXJkUGxheWVkLCBiaWRNYWRlLCB0cnVtcFN1aXRlQ2hvc2VuIGFuZCBwYXJ0bmVyU3VpdGVDaG9zZW4pXG4gICAgc2VuZE1lc3NhZ2VCdXR0b24uZGlzYWJsZWQ9KHNlbmRNZXNzYWdlVGV4dD09PVwiU3R1dXIgb3BuaWV1d1wiKTtcbiAgICAvLyBpZiB0aGUgYnV0dG9uIGlzIGN1cnJlbnRseSBkaXNhYmxlZCBvbmx5IGFsbG93IHJlc2VuZGluZyB0aGUgZXZlbnQgYnV0IG5vdCB1bnRpbCBhZnRlciA1IHNlY29uZHNcbiAgICBpZihzZW5kTWVzc2FnZUJ1dHRvbi5kaXNhYmxlZClyZXNlbmRFdmVudElkPXNldFRpbWVvdXQoYWxsb3dSZXNlbmRFdmVudCw1MDAwKTsgLy8gYWxsb3cgcmVzZW5kaW5nIGFmdGVyIDUgc2Vjb25kc1xuICAgICovXG59XG5cbi8vIG9mIGNvdXJzZTogZnJvbSBzdGFja292ZXJmbG93ISEhXG5mdW5jdGlvbiBkaWZmZXJlbmNlKGExLGEyKXt2YXIgYTJTZXQ9bmV3IFNldChhMik7cmV0dXJuIGExLmZpbHRlcigoeCk9PiFhMlNldC5oYXMoeCkpO31cblxudmFyIGJpZGRlckNhcmRzRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1jYXJkc1wiKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJpZGRlclN1aXRlY2FyZHNCdXR0b24oKXtcbiAgICBsZXQgYnV0dG9uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJpZGRlciBzdWl0ZWNhcmRzIGJ1dHRvbiBjbGlja2VkIVwiKTtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJpZC1idXR0b25cIik7IC8vIGEgaGEsIGRpZG4ndCBrbm93IHRoaXNcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5zdHlsZS5kaXNwbGF5PSh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4vLyAgICAgdmFyIHYgPSBkb2N1bWVudC5jb29raWUubWF0Y2goJyhefDspID8nICsgbmFtZSArICc9KFteO10qKSg7fCQpJyk7XG4vLyAgICAgcmV0dXJuIHYgPyB2WzJdIDogbnVsbDtcbi8vIH1cbi8vIGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuLy8gICAgIHZhciBkID0gbmV3IERhdGU7XG4vLyAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMCpkYXlzKTtcbi8vICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiO3BhdGg9LztleHBpcmVzPVwiICsgZC50b0dNVFN0cmluZygpO1xuLy8gfVxuLy8gZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHsgc2V0Q29va2llKG5hbWUsICcnLCAtMSk7IH1cblxuLyoqXG4gKiBzaG93cyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBjYXJkcyBwbGF5ZWQgdGFibGUgYXMgd2VsbFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBiaWRzIHRhYmxlXG4gICAgc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKTtcbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBmb3IobGV0IHBsYXllck5hbWVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZVwiKSlcbiAgICAgICAgaWYocGxheWVyTmFtZUVsZW1lbnQpXG4gICAgICAgICAgICBwbGF5ZXJOYW1lRWxlbWVudC5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZHMgdGFibGVcbiAqIHRvIGJlIGNhbGxlZCB3aXRoIGV2ZXJ5IG5ldyBnYW1lXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQmlkc1RhYmxlKCl7XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBiaWRUYWJsZVJvdyBvZiBiaWRUYWJsZS5jaGlsZHJlbilcbiAgICAgICAgZm9yKGxldCBiaWRUYWJsZUNvbHVtbiBvZiBiaWRUYWJsZVJvdy5jaGlsZHJlbilcbiAgICAgICAgICAgIGJpZFRhYmxlQ29sdW1uLmlubmVySFRNTD1cIlwiO1xufVxuXG5mdW5jdGlvbiBzZXRTdWl0ZUNsYXNzKGVsZW1lbnQsc3VpdGUpe1xuICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudGx5IGFzc2lnbmVkIHN1aXRlXG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENhcmQuU1VJVEVfTkFNRVNbcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKV0pO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiLFN0cmluZyhzdWl0ZSkpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbn1cblxuZnVuY3Rpb24gc2hvd0NhcmQoZWxlbWVudCxjYXJkLHRydW1wU3VpdGUsd2lubmVyU2lnbil7XG4gICAgaWYoIWVsZW1lbnQpe2NvbnNvbGUuZXJyb3IoXCJObyBlbGVtZW50IVwiKTtyZXR1cm47fVxuICAgIGlmKGNhcmQpe1xuICAgICAgICBzZXRTdWl0ZUNsYXNzKGVsZW1lbnQsY2FyZC5zdWl0ZSk7IC8vIHdlIHdhbnQgdG8gc2VlIHRoZSByaWdodCBjb2xvclxuICAgICAgICBsZXQgZWxlbWVudElzVHJ1bXA9ZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0cnVtcFwiKTtcbiAgICAgICAgbGV0IGVsZW1lbnRTaG91bGRCZVRydW1wPShjYXJkLnN1aXRlPT09dHJ1bXBTdWl0ZSk7XG4gICAgICAgIGlmKGVsZW1lbnRJc1RydW1wIT09ZWxlbWVudFNob3VsZEJlVHJ1bXApZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwidHJ1bXBcIik7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPWNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGlmKHdpbm5lclNpZ24hPTApZWxlbWVudC5pbm5lckhUTUwrPVwiKlwiO1xuICAgICAgICAvKiByZXBsYWNpbmc6IFxuICAgICAgICAvLyBpZiB0aGlzIGlzIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgc28gZmFyIGl0IGNhbiBiZSBlaXRoZXIgKyBvciAtXG4gICAgICAgIGlmKHdpbm5lclNpZ24+MCllbGVtZW50LmlubmVySFRNTCs9JysnO2Vsc2UgaWYod2lubmVyU2lnbjwwKWVsZW1lbnQuaW5uZXJIVE1MKz0nLSc7XG4gICAgICAgICovXG4gICAgfWVsc2VcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbn1cblxuLy8gTURIQDIzSkFOMjAyMDogd2hlbiBzaG93aW5nIHRoZSBwbGF5ZXIgbmFtZSB3ZSBzZXQgdGhlIGNvbG9yIHRvIGJsYWNrIChqdXN0IGluIGNhc2UgaXQncyBub3QgYmxhY2sgYW55bW9yZSlcbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lKGVsZW1lbnQsbmFtZSl7XG4gICAgZWxlbWVudC5pbm5lckhUTUw9KG5hbWU/bmFtZTpcIj9cIik7XG4gICAgZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7XG59XG5mdW5jdGlvbiBzaG93UGxheWVyVHlwZShlbGVtZW50LHBsYXllclR5cGUpe1xuICAgIHN3aXRjaChwbGF5ZXJUeXBlKXtcbiAgICAgICAgY2FzZSAtMTplbGVtZW50LnN0eWxlLmNvbG9yPVwicmVkXCI7YnJlYWs7XG4gICAgICAgIGNhc2UgMDplbGVtZW50LnN0eWxlLmNvbG9yPVwib3JhbmdlXCI7YnJlYWs7XG4gICAgICAgIGNhc2UgMTplbGVtZW50LnN0eWxlLmNvbG9yPVwiZ3JlZW5cIjticmVhaztcbiAgICAgICAgZGVmYXVsdDplbGVtZW50LnN0eWxlLmNvbG9yPVwiYmxhY2tcIjticmVhazsgLy8gdHlwaWNhbGx5IHZhbHVlIDIgaXMgdXNlZCB0byBpbmRpY2F0ZSB0aGUgcGxheWVyIGl0c2VsZiEhIVxuICAgIH1cbn1cblxuLy8gTURIQDIwSkFOMjAyMDoga2VlcCB0aGUgaWRzIG9mIHRoZSB0cmljayBwbGF5ZWQgY2FyZHMgaW4gYSBjb25zdGFudCBhcnJheVxuY29uc3QgUExBWUVEX0NBUkRfSURTPVtcImN1cnJlbnQtcGxheWVyLWNhcmRcIixcImxlZnRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiLFwib3Bwb3NpdGUtcGxheWVyLWNhcmRcIixcInJpZ2h0aGFuZHNpZGUtcGxheWVyLWNhcmRcIl07XG5cbi8vIHRvIGJlIGNhbGxlZCBvbiByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudFxuZnVuY3Rpb24gY2xlYXJDYXJkc1BsYXllZFRhYmxlKCl7XG4gICAgZm9yKGxldCBwbGF5ZWRDYXJkSW5kZXggaW4gUExBWUVEX0NBUkRfSURTKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChQTEFZRURfQ0FSRF9JRFNbcGxheWVkQ2FyZEluZGV4XSkuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8qKlxuICogc2hvd3MgdGhlIGdpdmVuIHRyaWNrXG4gKiBAcGFyYW0geyp9IHRyaWNrIFxuICovXG5mdW5jdGlvbiBzaG93VHJpY2sodHJpY2svKixwbGF5ZXJJbmRleCovKXtcbiAgICBcbiAgICBsZXQgcmlra2VuVGhlR2FtZT1jdXJyZW50UGxheWVyLmdhbWU7aWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiTm8gZ2FtZSBiZWluZyBwbGF5ZWQhXCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHNob3VsZCBub3cgcG9pbnQgdG8gdGhlIF9nYW1lIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIFxuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0cmljayBcIix0cmljayk7XG4gICAgXG4gICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4O1xuXG4gICAgLy8gaWYgdGhpcyBpcyB0aGUgdHJ1bXAgcGxheWVyIHRoYXQgaXMgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCAoZWl0aGVyIG5vbi1ibGluZCBvciBibGluZCkgZmxhZyB0aGUgY2hlY2tib3hcbiAgICBpZih0cmljay5maXJzdFBsYXllcj09PXBsYXllckluZGV4JiZ0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWNoZWNrYm94JykuY2hlY2tlZD10cnVlO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1ibGluZCcpLmlubmVySFRNTD0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MD9cImJsaW5kIFwiOlwiXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgfWVsc2VcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG5cbiAgICAvLyBhc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBpbmZvXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2tpbmctZm9yLXBhcnRuZXItY2FyZC1pbmZvXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkIT09MD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgIC8vbGV0IHRhYmxlYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWNhcmRzLXRhYmxlXCIpLnJlcXVlc3RTZWxlY3RvcihcInRib2R5XCIpO1xuXG4gICAgLy8gdGhlIHBsYXllciB0eXBlIGNhbiBjaGFuZ2UgZXZlcnkgY2FyZCBiZWluZyBwbGF5ZWQgKGJhc2VkIG9uIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllcilcbiAgICAvLyBUT0RPIHNob3VsZG4ndCBuZWVkIHRvIGRvIHRoZSBmb2xsb3dpbmc6XG4gICAgLy8gc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCksLTIpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMSklNCkpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Bwb3NpdGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsyKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMyklNCkpO1xuICAgIFxuICAgIC8vIE5PVEUgdGhlIGZpcnN0IGNhcmQgY291bGQgYmUgdGhlIGJsaW5kIGNhcmQgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIG5vdCBzaG93IGl0ISFcbiAgICAvLyAgICAgIGJ1dCBvbmx5IHRoZSBjb2xvciBvZiB0aGUgcGFydG5lciBzdWl0ZVxuICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPSh0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLl9jYXJkc1swXS5zdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgLy8gTURIQDIwSkFOMjAyMDogc2hvdyBhbGwgdGhlIHRyaWNrIGNhcmRzIHBsYXllZCBhdCB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICBmb3IobGV0IHRyaWNrQ2FyZEluZGV4PTA7dHJpY2tDYXJkSW5kZXg8NDt0cmlja0NhcmRJbmRleCsrKXtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZD0odHJpY2tDYXJkSW5kZXg8dHJpY2subnVtYmVyT2ZDYXJkcz90cmljay5fY2FyZHNbdHJpY2tDYXJkSW5kZXhdOm51bGwpO1xuICAgICAgICBsZXQgdHJpY2tDYXJkUGxheWVySW5kZXg9dHJpY2suZmlyc3RQbGF5ZXIrdHJpY2tDYXJkSW5kZXg7IC8vIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IGluIHRoZSBnYW1lXG4gICAgICAgIGxldCB0cmlja0NhcmRQb3NpdGlvbj0odHJpY2tDYXJkUGxheWVySW5kZXgrNC1wbGF5ZXJJbmRleCklNDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayBjYXJkIHBvc2l0aW9uOiBcIit0cmlja0NhcmRQb3NpdGlvbitcIi5cIik7XG4gICAgICAgIGxldCB0cmlja0NhcmRJZD1QTEFZRURfQ0FSRF9JRFNbdHJpY2tDYXJkUG9zaXRpb25dO1xuICAgICAgICBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kKXtcbiAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9ZmFsc2U7IC8vIGRvIG5vdCBkbyB0aGlzIGZvciB0aGUgbmV4dCBwbGF5ZXJzXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCkuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2sucGxheVN1aXRlKTsgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0cmljayBjYXJkICNcIit0cmlja0NhcmRJbmRleCx0cmlja0NhcmQpO1xuICAgICAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLHRyaWNrQ2FyZCx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PSh0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsdHJpY2tDYXJkUGxheWVySW5kZXglNCk/MTotMSk6MCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qIHJlcGxhY2luZzpcbiAgICBsZXQgcGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PShhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPyg0K3RyaWNrLmZpcnN0UGxheWVyLXBsYXllckluZGV4KSU0OjApO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09MSl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzEpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsxKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMSklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Mil7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzIpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCsyKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMiklNCk/MTotMSk6MCkpO1xuICAgIGlmKHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD09Myl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLmdldFBsYXllckNhcmQoKHBsYXllckluZGV4KzMpJTQpLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAgICAgKHRyaWNrLndpbm5lcj09PShwbGF5ZXJJbmRleCszKSU0PyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCwocGxheWVySW5kZXgrMyklNCk/MTotMSk6MCkpO1xuICAgICovXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN1aXRlQ2FyZFJvd3Mocm93cyxzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlBsYXllciBzdWl0ZSBjYXJkIHJvd3M6IFwiK3Jvd3MubGVuZ3RoK1wiLlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiByb3dzOiBcIixyb3dzLmxlbmd0aCk7XG4gICAgbGV0IHN1aXRlPTA7XG4gICAgZm9yKGxldCByb3cgb2Ygcm93cyl7XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY2VsbHM9cm93LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkPTA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBjZWxsIG9mIGNlbGxzKXtcbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9c3VpdGVDb2xvcjsgIFxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgc3VpdGVDYXJkKys7XG4gICAgICAgIH1cbiAgICAgICAgc3VpdGUrKztcbiAgICB9XG59XG4vLyBpbiB0aHJlZSBkaWZmZXJlbnQgcGFnZXMgdGhlIHBsYXllciBjYXJkcyBzaG91bGQgYmUgc2hvd24uLi5cbmZ1bmN0aW9uIHVwZGF0ZUJpZGRlclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSAoY3VycmVudCBwbGF5ZXIpIGNhcmRzIGZvciBiaWRkaW5nLlwiKTtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuXG4vKipcbiAqIGZvciBwbGF5aW5nIHRoZSBjYXJkcyBhcmUgc2hvd24gaW4gYnV0dG9ucyBpbnNpZGUgdGFibGUgY2VsbHNcbiAqIEBwYXJhbSB7Kn0gc3VpdGVDYXJkcyBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlUGxheWVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgdG8gY2hvb3NlIGZyb20uXCIpO1xuICAgIC8vLy8vLy8vLy9pZihjdXJyZW50UGFnZT09PVwicGFnZS1wbGF5aW5nXCIpYWxlcnQoXCJTaG93aW5nIHRoZSBwbGF5aW5nIGNhcmRzIGFnYWluIVwiKTtcbiAgICBsZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXN1aXRlY2FyZHMtdGFibGVcIik7XG4gICAgY29uc29sZS5sb2coXCIqKioqKioqKiogU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgIGxldCByb3dzPXRhYmxlYm9keS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgIGxldCByb3c9cm93c1tzdWl0ZV07XG4gICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjYXJkcyBpbiBzdWl0ZSAjXCIrc3VpdGUrXCI6IFwiK2NhcmRzSW5TdWl0ZS5sZW5ndGgpO1xuICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZUNhcmQ9MDtzdWl0ZUNhcmQ8Y29sdW1ucy5sZW5ndGg7c3VpdGVDYXJkKyspe1xuICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgIGxldCBjYXJkSW5TdWl0ZT0oc3VpdGVDYXJkPGNhcmRzSW5TdWl0ZS5sZW5ndGg/Y2FyZHNJblN1aXRlW3N1aXRlQ2FyZF06bnVsbCk7XG4gICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmlubmVySFRNTD1jYXJkSW5TdWl0ZS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1lbHNlIC8vIGhpZGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgcGxheWVySW5kZXg9MDtcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGlmKCFkZWx0YVBvaW50c3x8IXBvaW50cyl7Y29uc29sZS5sb2coXCJFUlJPUjogUmVzdWx0cyBub3cga25vd24geWV0IVwiKTtyZXR1cm47fVxuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVySW5kZXhdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVySW5kZXhdKTtcbiAgICAgICAgcGxheWVySW5kZXgrKztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLl90cmljazsgLy8gTURIQDIwSkFOMjAyMCByZXBsYWNpbmc6IGdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGlmKCF0cmljayl7Y29uc29sZS5sb2coXCJFUlJPUjogTm8gdHJpY2sgdG8gdXBkYXRlIHRoZSB0cmlja3MgdGFibGUgd2l0aCFcIik7cmV0dXJuO31cbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlJ3JlIHBhc3NpbmcgYWxvbmcgY3VycmVudFBsYXllci5wYXJ0bmVyIHRvIGdldFRlYW1OYW1lIGJlY2F1c2UgdGhlIHBsYXllciB3aXRoIHRoZSBmb3VydGggYWNlIGFscmVhZHkga25vd3MgaGlzL2hlciBwYXJ0bmVyXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bOV0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0VGVhbU5hbWUodHJpY2sud2lubmVyKTsgLy8gc2hvdyB3aG8gd29uIHRoZSB0cmljayEhXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMTBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodHJpY2sud2lubmVyKTsgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYnkgdGhlIHRyaWNrIHdpbm5lciAoTURIQDAzSkFOMjAyMDogY2hhbmdlZCBmcm9tIGdldHRpbmcgdGhlIHBsYXllciBpbnN0YW5jZSBmaXJzdClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkZWZhdWx0IHBsYXllciBuYW1lcyFcIik7XG4gICAgbGV0IHBsYXllck5hbWVzPUxhbmd1YWdlLkRFRkFVTFRfUExBWUVSU1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbW8tcGxheW1vZGUtY2hlY2tib3hcIikuY2hlY2tlZD8xOjBdO1xuICAgIGZvcihwbGF5ZXJOYW1lSW5wdXRFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKCFwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlfHxwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aD09MClcbiAgICAgICAgICAgIHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWU9cGxheWVyTmFtZXNbcGFyc2VJbnQocGxheWVyTmFtZUlucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiKSldO1xuICAgIH1cbn1cblxuLy8gcGxheWluZyBmcm9tIHdpdGhpbiB0aGUgZ2FtZVxuZnVuY3Rpb24gc2luZ2xlUGxheWVyR2FtZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBsZXQgc2luZ2xlUGxheWVyTmFtZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLXBsYXllci1uYW1lJykudmFsdWUudHJpbSgpO1xuICAgIGlmKHNpbmdsZVBsYXllck5hbWUubGVuZ3RoPjApXG4gICAgICAgIHNldFBsYXllck5hbWUoc2luZ2xlUGxheWVyTmFtZSwoZXJyKT0+e1xuICAgICAgICAgICAgLy8gTURIQDEwSkFOMjAyMDogX3NldFBsYXllciB0YWtlcyBjYXJlIG9mIHN3aXRjaGluZyB0byB0aGUgcmlnaHQgaW5pdGlhbCBwYWdlISEhXG4gICAgICAgICAgICBpZihlcnIpc2V0SW5mbyhlcnIpOy8vIGVsc2UgbmV4dFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICBhbGVydChcIkdlZWYgZWVyc3QgZWVuIChnZWxkaWdlKSBuYWFtIG9wIVwiKTtcbn1cblxuLyoqXG4gKiBwcmVwYXJlcyB0aGUgR1VJIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIGdldEdhbWVJbmZvKCl7XG4gICAgY29uc29sZS5sb2coXCJEZXRlcm1pbmluZyBnYW1lIGluZm8uXCIpO1xuICAgIGxldCBnYW1lSW5mbz1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsgLy8gbm8gcGxheWVyLCBubyBnYW1lXG4gICAgaWYocmlra2VuVGhlR2FtZSl7XG4gICAgICAgIC8vIGdldCB0aGUgaW5mbyB3ZSBuZWVkIHRocm91Z2ggdGhlIFBsYXllckdhbWUgaW5zdGFuY2UgcmVnaXN0ZXJlZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcnM9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkZGVycygpOyAvLyB0aG9zZSBiaWRkaW5nXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWRkZXJzOiBcIitoaWdoZXN0QmlkZGVycy5qb2luKFwiLCBcIikrXCIuXCIpO1xuICAgICAgICBsZXQgaGlnaGVzdEJpZD1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZDogXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZF0rXCIuXCIpO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFRydW1wU3VpdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRUcnVtcCBzdWl0ZTogXCIrdHJ1bXBTdWl0ZStcIi5cIik7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgbGV0IHBhcnRuZXJSYW5rPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKTtcbiAgICAgICAgLy8gcGxheWluZyB3aXRoIHRydW1wIGlzIGVhc2llc3RcbiAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7IC8vIG9ubHkgYSBzaW5nbGUgaGlnaGVzdCBiaWRkZXIhISFcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyPWhpZ2hlc3RCaWRkZXJzWzBdO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJvZWxhUGxheWVyTmFtZT1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcik7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89dHJvZWxhUGxheWVyTmFtZStcIiBoZWVmdCB0cm9lbGEsIFwiO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAzMEpBTjIwMjA6IE9PUFMgbm90IHN1cHBvc2VkIHRvIGdpdmUgdGhpcyBhd2F5ISEhISEgZ2FtZUluZm8rPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdK1wiIGlzIHRyb2VmLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCJlbiBcIityaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiIG1ldCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG4vLyBob3cgdG8gcGhyYXNlIGEgYmlkIGRlcGVuZHMgb24gdGhlIGJpZCwgYW5kIHdobyBwbGF5cyBpdFxuZnVuY3Rpb24gZ2V0QmlkSW5mbyhiaWQsYmlkZGVyKXtcbiAgICBsZXQgYmV0dGVyPShiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVJ8fFxuICAgICAgICBiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUik7XG4gICAgaWYoYmV0dGVyKWJpZC0tO1xuICAgIHN3aXRjaChiaWQpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1BBUzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0IGdlcGFzdC5cIjpcIkplIGhlYnQgZ2VwYXN0LlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9SSUs6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBcIjpcIkplIGhlYnQgXCIpKyhiZXR0ZXI/XCJiZXRlciBcIjpcIlwiKStcIiBnZXJpa3QuXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTkVHRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdGllbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIGVsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0d2FhbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGRlcnRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QSUNPOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIHNsZWNodHMgZWVuIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgb3BlbiBrYWFydGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuIG1ldCBlZW4gcHJhYXRqZSBlbiBvcGVuIGthYXJ0ZW4uXCI7XG4gICAgfVxuICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0XCI6XCJKZSBoZWJ0XCIpK1wiIGVlbiBvbmdlbGRpZyBib2QgZ2VkYWFuLlwiO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBwbGF5ZXJJbmRleD0wO3BsYXllckluZGV4PHJpa2tlblRoZUdhbWUubnVtYmVyT2ZQbGF5ZXJzO3BsYXllckluZGV4Kyspe1xuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICB9XG59XG4vLyBNREhAMjFOT1YyMDIwOiB0aGUgZ2FtZSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBhIGJpZCBtYWRlIGlzIHJlY2VpdmVkISEhXG5mdW5jdGlvbiB1cGRhdGVCaWRzVGFibGUocGxheWVyQmlkc09iamVjdHMpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgaWYocGxheWVyQmlkc09iamVjdHMpXG4gICAgZm9yKGxldCBwbGF5ZXJCaWRzSW5kZXg9MDtwbGF5ZXJCaWRzSW5kZXg8cGxheWVyQmlkc09iamVjdHMubGVuZ3RoO3BsYXllckJpZHNJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyQmlkc0luZGV4XTtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuZ2V0UGxheWVySW5kZXgocGxheWVyQmlkc09iamVjdC5uYW1lKTtcbiAgICAgICAgLy8gb24gdGhlIHNhZmUgc2lkZSwgZ2V0IHRoZSBwbGF5ZXIgaW5kZXggZnJvbSB0aGUgZ2FtZSBwYXNzaW5nIGluICBwbGF5ZXIgbmFtZVxuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXthbGVydChcIlBsYXllciBcIitwbGF5ZXJCaWRzT2JqZWN0Lm5hbWUrXCIgdW5rbm93biFcIik7Y29udGludWU7fVxuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIC8vIE1ESEAyM0pBTjIwMjAgc2hvd2luZyB0aGUgcGxheWVyIG5hbWVzIG9uY2U6IHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPWNhcGl0YWxpemUocGxheWVyQmlkc09iamVjdC5uYW1lKTsgLy8gd3JpdGUgdGhlIG5hbWUgb2YgdGhlIHBsYXllclxuICAgICAgICAvLyB3cml0ZSB0aGUgYmlkcyAod2UgaGF2ZSB0byBjbGVhciB0aGUgdGFibGUgd2l0aCBldmVyeSBuZXcgZ2FtZSB0aG91Z2gpXG4gICAgICAgIHBsYXllckJpZHNPYmplY3QuYmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQsYmlkSW5kZXgpPT57cGxheWVyQmlkc1Jvdy5jaGlsZHJlbltiaWRJbmRleCsxXS5pbm5lckhUTUw9cGxheWVyQmlkO30pO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGJpZFRhYmxlLmNoaWxkcmVuW3BsYXllcl0uY2hpbGRyZW5bMV0uaW5uZXJIVE1MPXBsYXllcnNCaWRzW2JpZF0uam9pbihcIiBcIik7XG4gICAgfVxufVxuXG5jbGFzcyBPbmxpbmVQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJ7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcbiAgICAgICAgc3VwZXIobmFtZSxudWxsKTtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyBhc2sgdGhlIGdhbWVcbiAgICAgICAgcmV0dXJuKHRoaXMuaW5kZXgmJnRoaXMuZ2FtZT90aGlzLmdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLmluZGV4KTowKTtcbiAgICB9XG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYWdlLWJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT09PVwiaGlkZGVuXCIpcmV0dXJuO1xuICAgICAgICB0b01ha2VBQmlkPXRydWU7IC8vIE1ESEAwM0ZFQjIwMjA6IHNvbWUgYWRkaXRpb25hbCBwcm90ZWN0aW9uIGluIGNhc2UgdGhlIGJ1dHRvbnMgd29uJ3QgaGlkZVxuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIC8vIGFzY2VydGFpbiB0byBiZSBsb29raW5nIGF0IHRoZSBiaWRkaW5nIHBhZ2UgKGluIHdoaWNoIGNhc2Ugd2UgY2FuIHNhZmVseSB1c2UgVklTSUJMRSlcbiAgICAgICAgaWYoY3VycmVudFBhZ2UhPVwicGFnZS1iaWRkaW5nXCIpc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTsgXG4gICAgICAgIC8vIHJlbW92ZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItYmlkXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gc2hvdyB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IGluaGVyaXQgaXMgc2FmZXIgYmVjYXVzZSBpZiB0aGlzIGhhcHBlbnMgYnkgYWNjaWRlbnQgKHdoZW4gbm90IG9uIHRoZSBiaWRkaW5nIHBhZ2UpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudCwgZXNzZW50aWFsIHRvIGhpZGUgaXQgaW1tZWRpYXRlbHkgYWZ0ZXIgYSBiaWRcbiAgICAgICAgLy8gY3VycmVudFBsYXllcj10aGlzOyAvLyByZW1lbWJlciB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgc2V0SW5mbyhcIkRvZSBlZW4gYm9kLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBiaWRzIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBjb3VsZCBtYWtlOiBcIixwb3NzaWJsZUJpZHMpO1xuXG4gICAgICAgIC8vc2V0SW5mbyhcIk1hYWsgZWVuIGtldXplIHVpdCBlZW4gdmFuIGRlIG1vZ2VsaWprZSBiaWVkaW5nZW4uXCIpO1xuICAgICAgICAvLyBpdCdzIGFsd2F5cyB5b3UhISEhIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLmlubmVySFRNTD1cIlRvb24ga2FhcnRlblwiO1xuICAgICAgICBiaWRkZXJDYXJkc0VsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS52YWx1ZT10aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbihcIjxicj5cIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIGJpZGRlciBjYXJkcyBpbW1lZGlhdGVseVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgICAgICBpZigvKnBsYXltb2RlPT1QTEFZTU9ERV9ERU1PKi8wXmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1iaWQtYnV0dG9uXCIpKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpO1xuICAgICAgICAvKiBNREhAMTFKQU4yMDIwOiBtb3ZlZCBvdmVyIHRvIHdoZW4gdGhlIHBsYXllciBjYXJkcyBhcmUgcmVjZWl2ZWQhISFcbiAgICAgICAgLy8gTk9URSBiZWNhdXNlIGV2ZXJ5IHBsYXllciBnZXRzIGEgdHVybiB0byBiaWQsIHRoaXMuX3N1aXRlQ2FyZHMgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiB3ZSBhc2sgZm9yIHRydW1wL3BhcnRuZXIhISFcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7XG4gICAgICAgICovXG4gICAgICAgIC8vIG9ubHkgc2hvdyB0aGUgYnV0dG9ucyBjb3JyZXNwb25kaW5nIHRvIHBvc3NpYmxlIGJpZHNcbiAgICAgICAgZm9yKGxldCBiaWRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJpZFwiKSlcbiAgICAgICAgICAgIGJpZEJ1dHRvbi5zdHlsZS5kaXNwbGF5PShwb3NzaWJsZUJpZHMuaW5kZXhPZihwYXJzZUludChiaWRCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWJpZCcpKSk+PTA/XCJpbmxpbmVcIjpcIm5vbmVcIik7XG4gICAgICAgIC8vIHNob3cgdGhlIHBsYXllciBiaWRzIGluIHRoZSBib2R5IG9mIHRoZSBiaWRzIHRhYmxlXG4gICAgICAgIHVwZGF0ZUJpZHNUYWJsZShwbGF5ZXJCaWRzT2JqZWN0cyk7XG4gICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRCk7XG4gICAgfVxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHRydW1wIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS10cnVtcC1jaG9vc2luZ1wiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHRydW1wIHN1aXRlIGJ1dHRvbnNcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9UUlVNUCk7XG4gICAgfVxuICAgIGNob29zZVBhcnRuZXJTdWl0ZShzdWl0ZXMscGFydG5lclJhbmspeyAvLyBwYXJ0bmVyUmFua05hbWUgY2hhbmdlZCB0byBwYXJ0bmVyUmFuayAoYmVjYXVzZSBMYW5ndWFnZSBzaG91bGQgYmUgdXNlZCBhdCB0aGUgVUkgbGV2ZWwgb25seSEpXG4gICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBwYXJ0bmVyIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICBzZXRQYWdlKFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvLyBiZWNhdXNlIHRoZSBzdWl0ZXMgaW4gdGhlIGJ1dHRvbiBhcnJheSBhcmUgMCwgMSwgMiwgMyBhbmQgc3VpdGVzIHdpbGwgY29udGFpblxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgcGFydG5lciByYW5rIChhY2Ugb3Iga2luZykgYmVpbmcgYXNrZWRcbiAgICAgICAgZm9yKGxldCByYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgIHJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXTtcbiAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUik7XG4gICAgfVxuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgcmVwbGFjZWQgdmVyc2lvbiBleGNlcHQgd2Ugbm93IHdhbnQgdG8gcmVjZWl2ZSB0aGUgdHJpY2sgaXRzZWxmXG4gICAgcGxheUFDYXJkKCl7XG4gICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpcztcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHRyaWNrPSh0aGlzLmdhbWU/dGhpcy5nYW1lLl90cmljazpudWxsKTtcbiAgICAgICAgaWYoIXRyaWNrKXthbGVydChcIkJVRzogTm8gY3VycmVudCB0cmljayB0byBwbGF5IGEgY2FyZCBpbiFcIik7cmV0dXJuO31cbiAgICAgICAgLy8gTURIQDE5SkFOMjAyMDogYWxsb3cgdGhlIGN1cnJlbnQgcGxheWVyIHRvIHBsYXkgYSBjYXJkIGJ5IGNsaWNraW5nIG9uZVxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpO1xuICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLnBsYXlTdWl0ZTwwKXthbGVydChcIkJVRzogUGxheSBzdWl0ZSBvZiBub24tZW1wdHkgdHJpY2sgdW5kZWZpbmVkIVwiKTtyZXR1cm47fVxuICAgICAgICBzZXRJbmZvKFwiU3BlZWwgZWVuIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiLlwiKTtcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG5ldyB0cmljayB1cGRhdGUgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGUgd2l0aCB0aGUgcHJldmlvdXMgdHJpY2tcbiAgICAgICAgLy8gaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgLyogc2VlIHNob3dUcmljaygpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FuLWFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQ/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLmNoZWNrZWQ9ZmFsc2U7IC8vIHdoZW4gY2xpY2tlZCBzaG91bGQgZ2VuZXJhdGUgXG4gICAgICAgICovXG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjAgbW92ZWQgb3ZlciB0byB3aGVyZSBHQU1FX0lORk8gZXZlbnQgaXMgcmVjZWl2ZWQhISEhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgLy8gb2Jzb2xldGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZC1wbGF5ZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cbiAgICAgICAgICAgICh0cmljay5wbGF5U3VpdGU+PTA/XCJTcGVlbCBlZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpK1wiIGJpai5cIjpcIktvbSBtYWFyIHVpdCFcIik7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbj10aGlzLmdldE51bWJlck9mVHJpY2tzV29uKCk7IC8vIGFsc28gaW5jbHVkZXMgdGhvc2Ugd29uIGJ5IHRoZSBwYXJ0bmVyIChhdXRvbWF0aWNhbGx5KVxuICAgICAgICAvLyBhZGQgdGhlIHRyaWNrcyB3b24gYnkgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAvLyBpZihwYXJ0bmVyKW51bWJlck9mVHJpY2tzV29uKz1wbGF5ZXIuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3Mtd29uLXNvLWZhclwiKS5pbm5lckhUTUw9U3RyaW5nKG51bWJlck9mVHJpY2tzV29uKSsocGFydG5lck5hbWU/XCIgKHNhbWVuIG1ldCBcIitwYXJ0bmVyTmFtZStcIilcIjpcIlwiKTtcbiAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3MtdG8td2luXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dCh0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZCgpKTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsOyAvLyBnZXQgcmlkIG9mIGFueSBjdXJyZW50bHkgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgIC8vIHNldEluZm8oXCJXZWxrZSBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIiB3aWwgamUgXCIrKHRyaWNrLm51bWJlck9mQ2FyZHM+MD9cImJpalwiOlwiXCIpK1wic3BlbGVuP1wiKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7IC8vIHJlbWVtYmVyIHRoZSBzdWl0ZSBjYXJkcyEhISFcbiAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIC8vLy8vIHNob3dUcmljayh0aGlzLl90cmljaz10cmljayk7IC8vIE1ESEAxMUpBTjIwMjA6IG5vIG5lZWQgdG8gcGFzcyB0aGUgcGxheWVyIGluZGV4IChhcyBpdCBpcyBhbHdheXMgdGhlIHNhbWUpXG4gICAgfVxuXG4gICAgLy8gbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggX2NhcmRQbGF5ZWQoKSBkZWZpbmVkIGluIHRoZSBiYXNlIGNsYXNzIFBsYXllciB3aGljaCBpbmZvcm1zIHRoZSBnYW1lXG4gICAgLy8gTk9URSBjYXJkUGxheWVkIGlzIGEgZ29vZCBwb2ludCBmb3IgY2hlY2tpbmcgdGhlIHZhbGlkaXR5IG9mIHRoZSBjYXJkIHBsYXllZFxuICAgIC8vIE5PVEUgY2FuJ3QgdXNlIF9jYXJkUGxheWVkIChzZWUgUGxheWVyIHN1cGVyY2xhc3MpXG4gICAgLy8gTURIQDIwSkFOMjAyMDogZGVjaWRpbmcgdG8gcmV0dXJuIHRydWUgb24gYWNjZXB0YW5jZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7XG4gICAgICAgIGxldCBjYXJkPShzdWl0ZTx0aGlzLl9zdWl0ZUNhcmRzLmxlbmd0aCYmdGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV0ubGVuZ3RoP3RoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdW2luZGV4XTpudWxsKTtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGxldCB0cmljaz10aGlzLmdhbWUuX3RyaWNrOyAvLyBNREhAMTlKQU4yMDIwOiBlYXNpZXN0IHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdHJpY2tcbiAgICAgICAgICAgIGlmKCF0cmljaylyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzbGFnIG9tIGVlbiBrYWFydCBpbiBiaWogdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wO1xuICAgICAgICAgICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl7IC8vIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZW9yZXRpY2FsbHkgdGhlIGNhcmQgY2FuIGJlIHBsYXllZCBidXQgaXQgbWlnaHQgYmUgdGhlIGNhcmQgd2l0aCB3aGljaCB0aGUgcGFydG5lciBjYXJkIGlzIGFza2VkISFcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGlzIGEgZ2FtZSB3aGVyZSB0aGVyZSdzIGEgcGFydG5lciBjYXJkIHRoYXQgaGFzbid0IGJlZW4gcGxheWVkIHlldFxuICAgICAgICAgICAgICAgIC8vIGFsdGVybmF0aXZlbHkgcHV0OiBzaG91bGQgdGhlcmUgYmUgYSBwYXJ0bmVyIGFuZCB0aGVyZSBpc24ndCBvbmUgeWV0Pz8/Pz9cbiAgICAgICAgICAgICAgICAvLyBCVUcgRklYOiBzdGlsbCB1c2luZyBnZXRUcnVtcFBsYXllcigpIGhlcmUgYWx0aG91Z2ggaXQgd2Fzbid0IGRlZmluZWQgYXQgYWxsIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgbm93IGNvcGllZCBvdmVyIGZyb20gUmlra2VuVGhlR2FtZS5qcyEhISAoYXMgaXQgaXMgY29tcHV0ZWQpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1aXRlPT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwIEJVRyBGSVg6IHdhcyB1c2luZyBhc2stcGFydG5lci1jYXJkLWJsaW5kIGluc3RlYWQgb2YgYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLmNoZWNrZWQmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWl0ZSE9dGhpcy5fZ2FtZS5nZXRUcnVtcFN1aXRlKCl8fGNvbmZpcm0oXCJXaWx0IFUgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCldK1wiIChibGluZCkgdnJhZ2VuIG1ldCBlZW4gdHJvZWY/XCIpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7IC8vIHllcywgYXNraW5nIGJsaW5kISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vL2FsZXJ0KFwiXFx0QkxJTkQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLyphbGVydChcIk5vdCBpbmRpY2F0ZWQhISEhXCIpKi87XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0cmljay5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzJiZzdWl0ZT09PUNhcmQuU1VJVEVfU1BBREUpeyAvLyBzcGFkZSBpcyBiZWluZyBwbGF5ZWQgYnkgdGhlIGZpcnN0IHBsYXllciB3aGVyZWFzIHRoYXQgaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShDYXJkLlNVSVRFX1NQQURFKTx0aGlzLm51bWJlck9mQ2FyZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoc3VpdGUhPT10cmljay5wbGF5U3VpdGUmJnRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZSh0cmljay5wbGF5U3VpdGUpPjApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2NhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPXBhcnRuZXJTdWl0ZXx8Y2FyZC5yYW5rIT1wYXJ0bmVyUmFuaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSmUga3VudCBcIitjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIG5pZXQgc3BlbGVuLCB3YW50IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgaXMgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMDogd2UgaGF2ZSB0byBhbHNvIHJldHVybiB3aGF0ZXZlciB0cmljayB2YWx1ZSB0aGF0IG1pZ2h0J3ZlIGNoYW5nZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdoaWNoIGluIHRoaXMgY2FzZSBjb3VsZCB3ZWwgYmUgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkICdmbGFnJ1xuICAgICAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogSSBzdWdnZXN0IGNoYW5naW5nIGFza2luZ0ZvclBhcnRuZXJDYXJkIHRvIGFza2luZ0ZvclBhcnRuZXJDYXJkPDAgaS5lLiBibGluZCByZXF1ZXN0ISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICB3ZSdyZSB0YWtpbmcgY2FyZSBvZiB0aGF0IHdoZW4gQ0FSRCBpcyBzZW50IChzbyBub3QgdG8gaW50ZXJmZXJlIHdpdGggUmlra2VuVGhlR2FtZS5qcyBpdHNlbGYpXG4gICAgICAgICAgICBsZXQgZXJyb3I9dGhpcy5fc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgICAgIHJldHVybihlcnJvciBpbnN0YW5jZW9mIEVycm9yP2Vycm9yOm51bGwpO1xuICAgICAgICAgICAgLyogTURIQDI3SkFOMjAyMDogcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyBtaWdodCBiZSB3cm9uZyBCVVQgYnkgcGFzc2luZyBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwgcGxheWVycyBpbmNsdWRpbmcgbXlzZWxmIHdpbGwgcmVjZWl2ZSB0aGUgY2FyZCBwbGF5ZWQgYW5kIHVwZGF0ZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW5nbHksIGJhc2ljYWxseSBhZGRDYXJkKCkgd2lsbCBzZXQgaXQgdG8gMSBpZiBpdCBzbyBkZXRlY3RzLCBidXQgY2Fubm90IHNldCBpdCB0byAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGVjaG5pY2FsbHkgYXNraW5nRm9yUGFydG5lckNhcmQgb25seSBuZWVkcyB0byBiZSBzZW5kIHdoZW4gdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZFxuICAgICAgICAgICAgaWYoZXJyb3IpcmV0dXJuIG5ldyBFcnJvcihcIkVyIGlzIGVlbiBmb3V0IG9wZ2V0cmVkZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydC5cIik7XG4gICAgICAgICAgICB0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiT25nZWxkaWdlIGthYXJ0IGtsZXVyIFwiK0RVVENIX1NVSVRFX05BTUVTW3N1aXRlXStcIiBlbi9vZiBrYWFydCBrbGV1ciBwb3NpdGllIChcIitTdHJpbmcoaW5kZXgpK1wiKS5cIik7XG4gICAgfVxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgaWYoIWdhbWUpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuc3RhdGUhPT1QbGF5ZXJHYW1lLkZJTklTSEVEKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBIZXQgc3BlbCBrYW4gbmlldCB3b3JkZW4gdmVybGF0ZW4sIGFscyBoZXQgbmlldCBhZmdlbG9wZW4gaXMgKHRvZXN0YW5kOiBcIit0aGlzLl9nYW1lLnN0YXRlK1wiKS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUuZG9uZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJWZXJsYXRlbiB2YW4gaGV0IHNwZWwgbWlzbHVrdCEgUHJvYmVlciBoZXQgbm9nIGVlbnMuXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgdGhpbmdzIHRvIGRvPz8/Pz8/P1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIG92ZXJnZWJsZXZlbiBrYWFydGVuIGluIGplIGhhbmQgd29yZGVuIHZlcndpamRlcmQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBzZW5kaW5nIHRoZSBET05FIGV2ZW50IHN1Y2NlZWRzIHJlYWR5IGFnYWluIHRvIHBsYXkgaW4gYSBuZXh0IGdhbWUgKHdpdGhvdXQgbGVhdmluZyB0aGUgZ2FtZSBwbGF5aW5nKVxuICAgICAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIucGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KTtcbiAgICB9XG4gICAgLy8gY2FsbCByZW5kZXJDYXJkcyBqdXN0IGFmdGVyIHRoZSBzZXQgb2YgY2FyZHMgY2hhbmdlXG4gICAgcmVuZGVyQ2FyZHMoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKiogUmVuZGVyaW5nIHBsYXllciBjYXJkcyAqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgdGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCk7XG4gICAgICAgIC8vIFRPRE8gcHJvYmFibHkgYmVzdCB0byBzaG93IHRoZW0gb24gQUxMIHBhZ2VzIChubyBtYXR0ZXIgd2hpY2ggb25lIGlzIGN1cnJlbnRseSBzaG93aW5nISlcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBzd2l0Y2goY3VycmVudFBhZ2Upe1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYmlkZGluZ1wiOnVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBvbmx5IG9uY2VcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBsYXlpbmdcIjp1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgYWZ0ZXIgcGxheWluZyBhIGNhcmQhIVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICB9XG4gICAgLy8gZXhpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gYSBwbGF5ZXIgc3RvcHMgcGxheWluZ1xuICAgIC8vIGVpdGhlciBieSBleHBsaWNpdGx5IHVzaW5nIHRoZSBzdG9wIGJ1dHRvbihzKSBvciBsZWF2aW5nL2Nsb3NpbmcgdGhlIHBhZ2VcbiAgICAvLyBUT0RPIHNob3VsZCB3ZSBudWxsIHRoZSBnYW1lPz8/Pz8/Pz9cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgdGhpcy5fZ2FtZS5leGl0KHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLl9nYW1lPW51bGw7IC8vIFRPRE8gb3IgYW55IG90aGVyIHdheSB0byBpbmRpY2F0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwbGF5ZXIgc3RvcHBlZCBwbGF5aW5nXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyc1xuLyoqXG4gKiBjbGlja2luZyBhIGJpZCBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gYmlkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gYmlkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gTURIQDAzRkVCMjAyMDogcHJldmVudCBtYWtpbmcgYSBiaWQgd2hlbiBub3Qgc3VwcG9zZWQgdG8gZG8gc29cbiAgICBpZighdG9NYWtlQUJpZCl7YWxlcnQoXCJKZSBoZWJ0IGFsIGVlbiBib2QgdWl0Z2VicmFjaHQhXCIpO3JldHVybjt9XG4gICAgdHJ5e1xuICAgICAgICBsZXQgYmlkPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1iaWRcIikpO1xuICAgICAgICBpZihpc05hTihiaWQpfHxiaWQ8MCl7YWxlcnQoXCJFcm5zdGlnZSBwcm9ncmFtbWFmb3V0OiBvbmdlbGRpZyBib2QgKFwiKyhiaWQ/YmlkOlwiP1wiKStcIikhIFByb2JlZXIgaGV0IG5vZyBlZW5zLlwiKTtyZXR1cm47fVxuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICAgICAgY29uc29sZS5sb2coXCJCaWQgY2hvc2VuOiBcIixiaWQpO1xuICAgICAgICBsZXQgZXJyb3I9Y3VycmVudFBsYXllci5fc2V0QmlkKGJpZCk7IC8vIHRoZSB2YWx1ZSBvZiB0aGUgYnV0dG9uIGlzIHRoZSBtYWRlIGJpZFxuICAgICAgICBpZihlcnJvciBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICBlbHNlIC8vIGJpZCBkb25lISEhXG4gICAgICAgICAgICB0b01ha2VBQmlkPWZhbHNlO1xuICAgIH1maW5hbGx5e1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT0odG9NYWtlQUJpZD9WSVNJQkxFOlwiaGlkZGVuXCIpOyAvLyBzaG93IGFnYWluXG4gICAgfVxufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIit0cnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK3BhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIC8vIGdvIGRpcmVjdGx5IHRvIHRoZSBnYW1lIChpbnN0ZWFkIG9mIHRocm91Z2ggdGhlIHBsYXllcilcbiAgICBjdXJyZW50UGxheWVyLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbn1cblxudmFyIHBsYXlhYmxlY2FyZENlbGwscGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBwbGF5YWJsZWNhcmRDZWxsPShldmVudD9ldmVudC5jdXJyZW50VGFyZ2V0Om51bGwpO1xuICAgIGlmKCFwbGF5YWJsZWNhcmRDZWxsKXJldHVybjtcbiAgICBsZXQgY2FyZFN1aXRlPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSk7XG4gICAgbGV0IGNhcmRSYW5rPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pbmRleFwiKSk7XG4gICAgaWYoY2FyZFN1aXRlPENhcmQuU1VJVEVfRElBTU9ORHx8Y2FyZFN1aXRlPkNhcmQuU1VJVEVfU1BBREV8fGNhcmRSYW5rPENhcmQuUkFOS19UV098fGNhcmRSYW5rPkNhcmQuUkFOS19BQ0UpcmV0dXJuO1xuXG4gICAgLy8vLy8vLy9pZihwbGF5YWJsZWNhcmRDZWxsLnN0eWxlLmJvcmRlcj1cIjBweFwiKXJldHVybjsgLy8gZW1wdHkgJ3VuY2xpY2thYmxlJyBjZWxsXG4gICAgbGV0IGVycm9yPWN1cnJlbnRQbGF5ZXIuX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleChjYXJkU3VpdGUsY2FyZFJhbmspO1xuICAgIGlmKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpeyAvLyBjYXJkIGFjY2VwdGVkISEhXG4gICAgICAgIC8vIGNsZWFyIGFzYXBcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbENvbnRlbnRzPXBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MOyAvLyBpbiBjYXNlIHNlbmRpbmcgdGhlIGNhcmQgZmFpbHNcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZm9jdXMgcmVxdWVzdFxuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTsgLy8gZGlzYWJsZSB0aGUgY2FyZCBidXR0b25zXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgdmVyem9uZGVuIG5hYXIgZGUgc3BlbCBzZXJ2ZXJcIjsgLy8gTURIQDIzSkFOMjAyMDogZ2V0IHJpZCBvZiB0aGUgcGxheSBjYXJkIHByb21wdCFcbiAgICB9ZWxzZXsgLy8gcmVwb3J0IHRoZSBlcnJvciB0byB0aGUgZW5kIHVzZXJcbiAgICAgICAgLy8gYWxlcnQoZXJyb3IpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiVmVyc3R1cmVuIG1pc2x1a3QuIFByb2JlZXIgaGV0IG5vZyBlZW5zIVwiO1xuICAgIH1cbn1cbi8qKlxuICogY29udmVuaWVudCB0byBiZSBhYmxlIHRvIHR1cm4gdGhlIHBsYXlhYmxlIGNhcmQgYnV0dG9ucyBvbiBhbmQgb2ZmIGF0IHRoZSByaWdodCBtb21lbnRcbiAqIEBwYXJhbSB7ZW5hYmxlfSBlbmFibGUgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnMoZW5hYmxlKXtcbiAgICAvLyBjbGlja2luZyBjYXJkICdidXR0b25zJyAobm93IGNlbGxzIGluIHRhYmxlKSwgd2UgY2FuIGdldCByaWQgb2YgdGhlIGJ1dHRvbiBpdHNlbGYhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZT9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklERElORzpcbiAgICAgICAgICAgIC8vIHdoZW4gbW92aW5nIGZyb20gdGhlIERFQUxJTkcgc3RhdGUgdG8gdGhlIEJJRERJTkcgc3RhdGUgY2xlYXIgdGhlIGJpZCB0YWJsZVxuICAgICAgICAgICAgLy8gQUxURVJOQVRJVkVMWSB0aGlzIGNvdWxkIGJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBlbmRzXG4gICAgICAgICAgICAvLyBCVVQgdGhpcyBpcyBhIGJpdCBzYWZlciEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBiaWVkZW4gaXMgYmVnb25uZW4hXCIpO1xuICAgICAgICAgICAgLyogaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKSovXG4gICAgICAgICAgICBjbGVhckJpZHNUYWJsZSgpO1xuICAgICAgICAgICAgLy8vLy8vIGxldCdzIHdhaXQgdW50aWwgYSBiaWQgaXMgcmVxdWVzdGVkISEhISBcbiAgICAgICAgICAgIC8vIE1ESEAwOUpBTjIwMjA6IE5PLCB3ZSB3YW50IHRvIGluZGljYXRlIHRoYXQgdGhlIGJpZGRpbmcgaXMgZ29pbmcgb25cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLlBMQVlJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWxlbiBrYW4gYmVnaW5uZW4hXCIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gYWxsb3dpbmcgdGhlIHVzZXIgdG8gY2xcbiAgICAgICAgICAgIC8qIE1ESEAxOUpBTjIwMjA6IGluIGR1ZSBjb3Vyc2Ugd2Ugd2lsbCBiZSByZW1vdmluZyB0aGUgZm9sbG93aW5nIHR3byBsaW5lc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZS5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQrPTE7IC8vIFFVSUNLIEZJWCB0byBnZXQgdG8gc2VlIHRoZSBsYXN0IHRyaWNrIGF0IHRoZSByaWdodCBwb3NpdGlvbiEhISEhXG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuIVwiKTtcbiAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFRoZSBzdGF0ZSBvZiB0aGUgZ2FtZSBjaGFuZ2VkIHRvICdcIit0b3N0YXRlK1wiJy5cIik7XG59XG5cbmZ1bmN0aW9uIF9nYW1lRXJyb3JPY2N1cnJlZChlcnJvcil7XG4gICAgYWxlcnQoXCJGb3V0OiBcIitlcnJvcik7XG59XG5cbmZ1bmN0aW9uIHNldFBhZ2UobmV3UGFnZSl7XG4gICAgLy8gcmVtZW1iZXIgdGhlIHBhZ2Ugd2UgY2FtZSBmcm9tIChub3QgdGhlIG5ldyBwYWdlISEhISlcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBQYWdlIHRvIHNob3c6ICdcIituZXdQYWdlK1wiJy5cIik7XG4gICAgLy8gaWYgdGhpcyBpcyBhIHBhZ2UgcmVmcmVzaCwgbm8gbmVlZCB0byByZXB1c2ggdGhlIHBhZ2UhISFcbiAgICBpZihjdXJyZW50UGFnZSlpZihjdXJyZW50UGFnZSE9bmV3UGFnZSl2aXNpdGVkUGFnZXMudW5zaGlmdChjdXJyZW50UGFnZSk7XG4gICAgY3VycmVudFBhZ2U9bmV3UGFnZTtcbiAgICB1cGRhdGVIZWxwQnV0dG9ucygpO1xuICAgIC8vIE5PVEUgbm90IGNoYW5naW5nIGN1cnJlbnRQYWdlIHRvIHBhZ2UgdW50aWwgd2UgaGF2ZSBkb25lIHdoYXQgd2UgbmVlZGVkIHRvIGRvXG4gICAgUEFHRVMuZm9yRWFjaChmdW5jdGlvbihfcGFnZSl7XG4gICAgICAgIGxldCBzaG93UGFnZT0oX3BhZ2U9PT1jdXJyZW50UGFnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKChzaG93UGFnZT9cIlNob3dpbmcgXCI6XCJIaWRpbmcgXCIpK1wiICdcIitfcGFnZStcIicuXCIpO1xuICAgICAgICBsZXQgcGFnZUVsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoX3BhZ2UpO1xuICAgICAgICBpZihwYWdlRWxlbWVudCl7XG4gICAgICAgICAgICBwYWdlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PShzaG93UGFnZT9cInZpc2libGVcIjpcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGlmKHNob3dQYWdlKXtcbiAgICAgICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSBwYWdlLSBwcmVmaXhcbiAgICAgICAgICAgICAgICBzd2l0Y2goX3BhZ2Uuc3Vic3RyaW5nKDUpKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJ1bGVzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiRGUgcmVnZWxzIHZhbiBoZXQgb25saW5lIHNwZWwuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXR0aW5nc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIktpZXMgZGUgc3BlZWx3aWp6ZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHVwLWdhbWVcIjogLy8gd2hlbiBwbGF5aW5nIGluIGRlbW8gbW9kZSwgdGhlIHVzZXIgc2hvdWxkIGVudGVyIGZvdXIgcGxheWVyIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJWdWwgZGUgbmFtZW4gdmFuIGRlIHNwZWxlcnMgaW4uIEVlbiBzcGVsZXJuYWFtIGlzIHZvbGRvZW5kZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImF1dGhcIjogLy8gcGFnZS1hdXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiR2VlZiBkZSBuYWFtIG9wIHdhYXJvbmRlciBVIHdpbHQgc3BlbGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FpdC1mb3ItcGxheWVyc1wiOiAvLyBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJFdmVuIGdlZHVsZCBhdWIuIFdlIHdhY2h0ZW4gdG90IGVyIGdlbm9lZyBtZWRlc3BlbGVycyB6aWpuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmlkZGluZ1wiOiAvLyBwYWdlLWJpZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvbSBkZSBiZXVydCBvcCBlZW4gdmVyem9layB0b3QgaGV0IGRvZW4gdmFuIGVlbiBib2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5LXJlcG9ydGluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5aW5nXCI6IC8vID8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvIGV2ZXJ5dGhpbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgc3RhcnRpbmcgdGhlIGdhbWUgcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIDFcIjsgLy8ganVzdCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8ganVzdCBpbiBjYXNlISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkhldCBzcGVsZW4gYmVnaW50IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiQlVHOiBVbmtub3duIHBhZ2UgJ1wiK19wYWdlK1wiJyByZXF1ZXN0ZWQhXCIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbmV4dFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBuZXh0IHBhZ2UhXCIpO1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgLy8gTURIQDA3SkFOMjAyMDogaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBuZXh0IHBhZ2UsIHdoZW4gbm90IHJ1bm5pbmcgaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBwYWdlLWF1dGggcGFnZVxuICAgIC8vICAgICAgICAgICAgICAgIGluIGRlbW8gbW9kZSBza2lwIHRoZSBhdXRoIGFuZCB3YWl0IGZvciBwbGF5ZXJzIGJ1dHRvblxuICAgIHN3aXRjaChwYWdlSW5kZXgpe1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1hdXRoXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogLy8gc2hvdWxkIHdlIGNoZWNrIHRoZSB1c2VyIG5hbWVzPz8/Pz8/XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrMSklUEFHRVMubGVuZ3RoXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBjYW5jZWxQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgcHJldmlvdXMgcGFnZS5cIik7XG4gICAgLy8gZ28gb25lIHBhZ2UgYmFja1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4K1BBR0VTLmxlbmd0aC0xKSVQQUdFUy5sZW5ndGhdKTtcbn1cbmZ1bmN0aW9uIHJldHVyblRvUHJldmlvdXNQYWdlKCl7XG4gICAgLy8gcG9wIG9mZiB0aGUgcGFnZSB3ZSBhcmUgZ29pbmcgdG8gdmlzaXQsIHByZXZlbnRpbmcgdG8gcHVzaCB0aGUgY3VycmVudFBhZ2UgYWdhaW5cbiAgICBpZih2aXNpdGVkUGFnZXMubGVuZ3RoPjApe2N1cnJlbnRQYWdlPW51bGw7c2V0UGFnZSh2aXNpdGVkUGFnZXMuc2hpZnQoKSk7fVxufVxuZnVuY3Rpb24gc2hvd0hlbHAoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIGhlbHAhXCIpO1xuICAgIHNldFBhZ2UoJ3BhZ2UtcnVsZXMnKTtcbn1cbi8vIGFzY2VydGFpbiB0byBkaXNhYmxlIHRoZSBIZWxwIGJ1dHRvbiB3aGVuIHZpZXdpbmcgaXQhISFcbmZ1bmN0aW9uIHVwZGF0ZUhlbHBCdXR0b25zKCl7XG4gICAgbGV0IGVuYWJsZUhlbHBCdXR0b249KGN1cnJlbnRQYWdlIT09J3BhZ2UtaGVscCcpO1xuICAgIGZvcihsZXQgaGVscEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWxwJykpaGVscEJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlSGVscEJ1dHRvbjtcbn1cblxuLyoqXG4gKiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbmV3LXBsYXllcnMgYnV0dG9uIGlzIGNsaWNrZWQsIHRvIHN0YXJ0IGEgbmV3IGdhbWUgd2l0aCBhIG5ldyBzZXQgb2YgcGxheWVyc1xuICovXG5mdW5jdGlvbiBuZXdQbGF5ZXJzKCl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gTmlldXdlIHNwZWxlcnMgYWFubWFrZW4uXCIpO1xuICAgIHBsYXllcnM9W107XG4gICAgbGV0IG5vUGxheWVyTmFtZXM9dHJ1ZTtcbiAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIHBsYXllciBpbnB1dCBmaWVsZHNcbiAgICBmb3IocGxheWVyTmFtZUlucHV0IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKHBsYXllck5hbWVJbnB1dC52YWx1ZS5sZW5ndGg+MCl7XG4gICAgICAgICAgICBub1BsYXllck5hbWVzPWZhbHNlO1xuICAgICAgICAgICAgcGxheWVycy5wdXNoKG5ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZUlucHV0LnZhbHVlKSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgIGlmKHBsYXllcnMubGVuZ3RoPDQpXG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobnVsbCk7XG4gICAgfVxuICAgIGlmKG5vUGxheWVyTmFtZXMpe1xuICAgICAgICBwbGF5ZXJzPW51bGw7XG4gICAgICAgIHNldEluZm8oXCJHZWVuIHNwZWxlcm5hbWVuIG9wZ2VnZXZlbi4gSGViIHRlbm1pbnN0ZSBlZW4gc3BlbGVybmFhbSBub2RpZyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJSaWtrZW4gLSBoZXQgc3BlbDogTmlldXdlIHNwZWxlcnMgYWFuZ2VtYWFrdCFcIik7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbEdhbWUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7Ly9pZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJHZWVuIHNwZWwhXCIpO1xuICAgIGlmKCFyaWtrZW5UaGVHYW1lKXtcbiAgICAgICAgYWxlcnQoXCJHZWVuIHNwZWwgb20gYWYgdGUgYnJla2VuISBMYWFkIGRlemUgd2ViIHBhZ2luYSBvcG5pZXV3IVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjb25maXJtKFwiV2lsdCBVIGVjaHQgaGV0IGh1aWRpZ2Ugc3BlbCBhZmJyZWtlbj9cIikpe1xuICAgICAgICByaWtrZW5UaGVHYW1lLmNhbmNlbCgpO1xuICAgIH1cbn1cbi8qIFxuZnVuY3Rpb24gbmV3VHJpY2tCdXR0b25DbGlja2VkKCl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICAoIXJpa2tlblRoZUdhbWV8fHJpa2tlblRoZUdhbWUuc2hvd05ld1RyaWNrSW5mbygpKTtcbn1cbiovXG4vLyBNREhAMDdKQU4yMDIwOiBhZGRpdGlvbmFsIHN0dWZmIHRoYXQgd2UncmUgZ29pbmcgdG8gbmVlZCB0byBtYWtlIHRoaXMgc3R1ZmYgd29ya1xuY2xhc3MgUGxheWVyR2FtZVByb3h5IGV4dGVuZHMgUGxheWVyR2FtZSB7XG5cbiAgICAvLyBnZXRTZW5kRXZlbnQoZXZlbnQsZGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBldmVudCBcIitldmVudCtcIiB3aXRoIGRhdGEgXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkrXCIuXCIpO1xuICAgIC8vICAgICByZXR1cm4gW2V2ZW50LGRhdGFdO1xuICAgIC8vIH1cblxuICAgIC8vIE1ESEAyM0pBTjIwMjA6IGNhbGxlZCBmcm9tIHVwZGF0ZUJpZHNUYWJsZVxuICAgIGdldFBsYXllckluZGV4KHBsYXllck5hbWUpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9KHRoaXMuX3BsYXllck5hbWVzP3RoaXMuX3BsYXllck5hbWVzLmxlbmd0aDowKTtcbiAgICAgICAgd2hpbGUoLS1wbGF5ZXJJbmRleD49MCYmdGhpcy5fcGxheWVyTmFtZXNbcGxheWVySW5kZXhdIT09cGxheWVyTmFtZSk7XG4gICAgICAgIGlmKHBsYXllckluZGV4PDApe2NvbnNvbGUubG9nKFwiUGxheWVyIG5hbWUgJ1wiK3BsYXllck5hbWUrXCInIG5vdCBmb3VuZCBpbiBcIitKU09OLnN0cmluZ2lmeSh0aGlzLl9wbGF5ZXJOYW1lcykrXCIuXCIpO31cbiAgICAgICAgcmV0dXJuIHBsYXllckluZGV4O1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlBsYXllcnMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoO31cblxuICAgIC8vIE1ESEAyNkpBTjIwMjA6IG5lZWRlZCB0aGlzIGFzIHdlbGwgdG8gZGV0ZXJtaW5lIHRoZSB0cnVtcCBwbGF5ZXIgKHVzaW5nIGJpZGRlcnMgc3RlYWQgb2YgYmlkUGxheWVycyBoZXJlKVxuICAgIGdldFRydW1wUGxheWVyKCl7XG4gICAgICAgIC8vIG9ubHkgd2hlbiBwbGF5aW5nIGEgJ3JpaycgZ2FtZSAod2l0aCB0cnVtcCwgcGxheWVkIHdpdGggYSBwYXJ0bmVyLCBidXQgbm90IHRyb2VsYSwgd2UgaGF2ZSBhIHRydW1wIHBsYXllcilcbiAgICAgICAgaWYodGhpcy5faGlnaGVzdEJpZCE9PVBsYXllckdhbWUuQklEX1JJSyYmdGhpcy5faGlnaGVzdEJpZCE9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUilyZXR1cm4gLTE7XG4gICAgICAgIGlmKCF0aGlzLl9oaWdoZXN0QmlkZGVyc3x8dGhpcy5faGlnaGVzdEJpZGRlcnMubGVuZ3RoPT0wKXJldHVybiAtMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWRkZXJzWzBdO1xuICAgIH1cblxuICAgIC8vIE1ESEAyNUpBTjIwMjA6IGdhbWUgY2Fubm90IGNvbnRpbnVlIHVudGlsIHN1Y2NlZWRpbmcgaW4gZ2V0dGluZyB0aGUgYWN0aW9uIG92ZXIgdG8gdGhlIGdhbWUgc2VydmVyXG4gICAgLy8gICAgICAgICAgICAgICAgdG8gZ3VhcmFudGVlIGRlbGl2ZXJ5IHdlIHJ1biBhIHJlc2VuZCB0aW1lciB0aGF0IHdpbGwgY29udGludWUgc2VuZGluZyB1bnRpbCB0aGUgY2FsbGJhY2sgZ2V0cyBjYWxsZWRcbiAgICAvLyBfZXZlbnRTZW50IHdpbGwgZ2V0IGNhbGxlZCB3aGVuIHRoZSBldmVudCB3YXMgcmVjZWl2ZWQgYnkgdGhlIGdhbWUgc2VydmVyXG4gICAgX3NlbnRFdmVudFJlY2VpdmVkKCl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCl7Y2xlYXJJbnRlcnZhbCh0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQpO3RoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZD1udWxsO31cbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJFdmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiByZWNlaXZlZCBieSBnYW1lIHNlcnZlci5cIik7XG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPW51bGw7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50U2VuZENhbGxiYWNrKXRoaXMuX2V2ZW50U2VudENhbGxiYWNrKCk7XG4gICAgfVxuICAgIF9zZW5kRXZlbnQoKXtcbiAgICAgICAgbGV0IHJlc3VsdD1mYWxzZTtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQodGhpcy5fZXZlbnRUb1NlbmRbMF0sdGhpcy5fZXZlbnRUb1NlbmRbMV0sdGhpcy5fc2VudEV2ZW50UmVjZWl2ZWQpO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmRbMl0rKztcbiAgICAgICAgICAgIHJlc3VsdD10cnVlO1xuICAgICAgICAgICAgLy8gTURIQDAxRkVCMjAyMDogd2Ugc2hvdyBob3cgb2Z0ZW4gYSBjZXJ0YWluIGV2ZW50IHdhcyBzZW50IG9uIHRoZSBzZW5kTWVzc2FnZUJ1dHRvblxuICAgICAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRbMl0+MSlcbiAgICAgICAgICAgICAgICBzZW5kTWVzc2FnZUJ1dHRvbi52YWx1ZT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0rXCIgKFwiK3RoaXMuX2V2ZW50VG9TZW5kWzJdK1wieClcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rKHRoaXMuX2V2ZW50VG9TZW5kWzFdP1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKTpcIlwiKStcIiBzZW50IChhdHRlbXB0OiBcIit0aGlzLl9ldmVudFRvU2VuZFsyXStcIikuXCIpO1xuICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogRmFpbGVkIHRvIHNlbmQgZXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rXCIgdG8gdGhlIGdhbWUgc2VydmVyIChyZWFzb246IFwiK2Vycm9yLm1lc3NhZ2UrXCIpLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBfc2V0RXZlbnRUb1NlbmQoZXZlbnQsZGF0YSxjYWxsYmFjayl7XG4gICAgICAgIHRoaXMuX2V2ZW50U2VudENhbGxiYWNrPWNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9ldmVudFRvU2VuZD1bZXZlbnQsZGF0YSwwXTsgLy8ga2VlcCB0cmFjayBvZiB0aGUgc2VuZCBldmVudCBjb3VudFxuICAgICAgICBpZighdGhpcy5fc2VuZEV2ZW50KCkpcmV0dXJuIGZhbHNlOyAvLyB1c2VyIG11c3QgbWFrZSB0aGVpciBjaG9pY2UgYWdhaW5cbiAgICAgICAgLy8gc2NoZWR1bGUgbmV4dCByZXNlbmRzXG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZD1zZXRJbnRlcnZhbCh0aGlzLl9zZW5kRXZlbnQsNTAwMCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIHdoYXQgdGhlIHBsYXllciB3aWxsIGJlIGNhbGxpbmcgd2hlbiAocyloZSBtYWRlIGEgYmlkLCBwbGF5ZWQgYSBjYXJkLCBjaG9vc2UgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZVxuICAgIGJpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IHVuZm9ydHVuYXRlbHkgSSBlbmNvdW50ZXJlZCBwcm9ibGVtcyB3aXRoIHRoZSBiaWRkaW5nIGJ1dHRvbnMgbm90IGhpZGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBhbmQgYmVjYXVzZSBpdCBkb2VzIG5vdCByZWFsbHkgbWF0dGVyIHdobyBtYWRlIHRoZSBiaWRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgbGV0IGJpZE1hZGVTZW50UmVzdWx0PXRoaXMuX3NldEV2ZW50VG9TZW5kKCdCSUQnLGJpZCxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgbm93Pz8/XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgaWYoYmlkTWFkZVNlbnRSZXN1bHQpc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQklEX0RPTkUpO1xuICAgICAgICByZXR1cm4gYmlkTWFkZVNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1ESEAxM0pBTjIwMjA6IHdlJ3JlIHNlbmRpbmcgdGhlIGV4YWN0IGNhcmQgb3ZlciB0aGF0IHdhcyBwbGF5ZWQgKGFuZCBhY2NlcHRlZCBhdCB0aGlzIGVuZCBhcyBpdCBzaG91bGQgSSBndWVzcylcbiAgICAvLyBNREhAMTRKQU4yMDIwOiBwYXNzaW5nIGluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCAnZmxhZycgYXMgd2VsbCEhISFcbiAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHdlJ3JlIG92ZXJyaWRpbmcgdGhlIGJhc2UgUmlra2VuVGhlR2FtZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkIGRvZXNuJ3QgZW5kIHVwIGluIHRoZSBsb2NhbCBSaWtrZW5UaGVHYW1lIHRyaWNrXG4gICAgLy8gTURIQDI3SkFOMjAyMDogd2UncmUgcmVjZWl2aW5nIHRydWUgZm9yIGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQgd2hlbiB0aGUgcGxheWVyIGlzIGRvaW5nIHNvXG4gICAgY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUil7c2V0SW5mbyhcIkhldCBzcGVsIGthbiBuaWV0IHZlcmRlciBnZXNwZWVsZCB3b3JkZW4hXCIpO3JldHVybiBmYWxzZTt9XG4gICAgICAgIC8vIE1ESEAxN0pBTjIwMjA6IGRpc2FibGUgdGhlIGJ1dHRvbnMgb25jZSB0aGUgY2FyZCBpcyBhY2NlcHRlZCAodG8gYmUgcGxheWVkISEhKVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBUT0RPIHBlcmhhcHMgaGlkaW5nIHRoZSBjYXJkcyBzaG91bGQgYWxzbyBiZSBkb25lIGhlcmUhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgICovXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBjYXJkIHBsYXllZDogXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICAvLyB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogd2Ugc2VuZCB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgZmxhZyBhbG9uZyBldmVyeSB0aW1lIGFsdGhvdWdoIGl0IHdpbGwgYmUgaWdub3JlZFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBvbiBhbnkgdHJpY2sgY2FyZCBleGNlcHQgdGhlIGZpcnN0IGNhcmQgcGxheWVkLCBhbmQgbm9uLW5lZ2F0aXZlIHZhbHVlcyBhcmUgaWdub3JlZCBhcyB3ZWxsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG9ubHkgdGhpbmcgdGhhdCB0aGUgb3RoZXIgc2lkZSBjYW5ub3QgZGV0ZXJtaW5lIGlzIHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZCEhISFcbiAgICAgICAgbGV0IGNhcmRQbGF5ZWRJbmZvPVtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF07XG4gICAgICAgIC8vIHJlcGxhY2luZzogaWYoYXNraW5nRm9yUGFydG5lckNhcmQ8MCljYXJkUGxheWVkSW5mby5wdXNoKHRydWUpOyAvLyBzZXQgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGJsaW5kIGZsYWchISFcbiAgICAgICAgbGV0IGNhcmRTZW50UmVzdWx0PVxuICAgICAgICAgICAgdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0NBUkQnLGNhcmRQbGF5ZWRJbmZvLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkdlc3BlZWxkZSBrYWFydCBuaWV0IGdlYWNjZXB0ZWVyZFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCI7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRPRE8gc2hvdWxkIG9yIHNob3VsZCB3ZSBub3QgZG8gdGhlIGZvbGxvd2luZz8/Pz8/PyBcbiAgICAgICAgICAgICAgICAgICAgcGxheWFibGFjYXJkQ2VsbC5pbm5lckhUTUw9cGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIH1lbHNleyAvLyBjYXJkIHBsYXllZCBhY2NlcHRlZCEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IGdlYWNjZXB0ZWVyZC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gdGhpcyBpcyBvbmx5IHRoZSByZXN1bHQgb2YgdGhlIGNhbGwgdG8gX3NldEV2ZW50VG9TZW5kIChzeW5jaHJvbm91cyksIGFuZCBvYnZpb3VzbHkgd2UgcHV0IGJhY2sgdGhlIGNhcmRcbiAgICAgICAgaWYoIWNhcmRTZW50UmVzdWx0KXtcbiAgICAgICAgICAgIGFsZXJ0KFwiS2FhcnQgbmlldCB2ZXJzdHV1cmQ/XCIpO1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkdlc3BlZWxkZSBrYWFydCBuaWV0IGdlYWNjZXB0ZWVyZFwiK1xuICAgICAgICAgICAgLy8gKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiO1xuICAgICAgICAgICAgaWYocGxheWFibGVjYXJkQ2VsbCl7XG4gICAgICAgICAgICAgICAgcGxheWFibGFjYXJkQ2VsbC5pbm5lckhUTUw9cGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydCBtaXNsdWt0ISBQcm9iZWVyIGhldCB6byBub2cgZWVucy5cIik7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBpZXRzIG1pc2dlZ2Fhbi4gUHJvYmVlciBoZXQgem8gbm9nIGVlbnMuXCIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgdmVyc3R1dXJkLlwiO1xuICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQ0FSRF9QTEFZRUQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXJkU2VudFJlc3VsdDtcbiAgICB9XG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUil7c2V0SW5mbyhcIkhldCBzcGVsIGthbiBuaWV0IHZlcmRlciBnZXNwZWVsZCB3b3JkZW4hXCIpO3JldHVybiBmYWxzZTt9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZUNob3NlblNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1RSVU1QU1VJVEUnLHRydW1wU3VpdGUsZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2Vrb3plbiB0cm9lZmtsZXVyIG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2Vycm9yJyk/XCIgKGZvdXQ6IFwiK3Jlc3VsdC5lcnJvcitcIilcIjpcIlwiKStcIiFcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gd2hhdCB0byBkbyBub3c/XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gdHJvZWZrbGV1ciBnZWFjY2VwdGVlcmQuXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGlmKHRydW1wU3VpdGVDaG9zZW5TZW50UmVzdWx0KXNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1RSVU1QX0RPTkUpO1xuICAgICAgICByZXR1cm4gdHJ1bXBTdWl0ZUNob3NlblNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXtzZXRJbmZvKFwiSGV0IHNwZWwga2FuIG5pZXQgdmVyZGVyIGdlc3BlZWxkIHdvcmRlbiFcIik7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gcGFydG5lciBrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZCFcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2Vrb3plbiBwYXJ0bmVyIGtsZXVyIGdlYWNjZXB0ZWVyZCFcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIC8vIHJlcGxhY2luZzogeydwbGF5ZXInOnRoaXMuX3BsYXllckluZGV4LCdzdWl0ZSc6cGFydG5lclN1aXRlfSkpO1xuICAgICAgICAgaWYocGFydG5lclN1aXRlQ2hvc2VuU2VudFJlc3VsdClzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9QQVJUTkVSX0RPTkUpO1xuICAgICAgICAgcmV0dXJuIHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1ESEAyNkpBTjIwMjA6IHdoZW4gdGhlIHVzZXIgZmluaXNoZWQgcmVhZGluZyB0aGUgcmVzdWx0cywgYW5kIHdhbnRzIHRvIGNvbnRpbnVlIHBsYXlpbmcgZG9uZSgpIHNob3VsZCBiZSBjYWxsZWRcbiAgICBkb25lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnRE9ORScsbnVsbCxmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET05FIGV2ZW50IGFja25vd2xlZGdlZC5cIik7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0tMTsgLy8gTURIQDI5SkFOMjAyMDogSSBoYXZlIHRvIGRvIHRoaXMgb3RoZXJ3aXNlIEkgd29uJ3QgYmUgYWJsZSB0byBwbGF5IGluIGEgbmV3IGdhbWUgKHNlZSBzZXQgcGxheWVyTmFtZXMhISEhKVxuICAgICAgICAgICAgc2V0SW5mbyhcIlpvZHJhIGVyIHdlZXIgdmllciBuaWV0LXNwZWxlbmRlIGRlZWxuZW1lcnMgemlqbiBrdW4gamUgd2VlciBzcGVsZW4uXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhpdChyZWFzb24pe1xuICAgICAgICAvLyBwbGF5ZXIgaXMgZXhpdGluZyBzb21laG93Li4uXG4gICAgICAgIGxldCBkYXRhPShyZWFzb24/cmVhc29uOihjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIlwiKSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnRVhJVCcsZGF0YSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFWElUIGV2ZW50IFwiK2RhdGErXCIgYWNrbm93bGVkZ2VkIVwiKTtcbiAgICAgICAgICAgIC8vIHdlJ3JlIE5PVCBnb2luZyBhbnl3aGVyZSBhbnltb3JlOiBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi5cIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpe3JldHVybiB0aGlzLl9zdGF0ZTt9XG4gICAgc2V0IHN0YXRlKG5ld3N0YXRlKXtcbiAgICAgICAgbGV0IG9sZHN0YXRlPXRoaXMuX3N0YXRlO1xuICAgICAgICB0aGlzLl9zdGF0ZT1uZXdzdGF0ZTtcbiAgICAgICAgLy8gZG8gc3R1ZmYgKGNoYW5nZSB0byBhbm90aGVyIHBhZ2UpXG4gICAgICAgIF9nYW1lU3RhdGVDaGFuZ2VkKG9sZHN0YXRlLHRoaXMuX3N0YXRlKTtcbiAgICB9XG5cbiAgICBsb2dFdmVudChldmVudCxkYXRhKXtcbiAgICAgICAgdGhpcy5fZXZlbnRzUmVjZWl2ZWQucHVzaCh7ZXZlbnQ6ZXZlbnQsZGF0YTpkYXRhfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFJlY2VpdmVkIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIC8vIFRPRE8gaGF2ZSB0byBjaGFuZ2UgdGhpcyB0byBpbmNsdWRlIHRoZSBmcmllbmRseSBmbGFnIGFzIHdlbGwhISEhXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIHJldHVybih0aGlzLl9wbGF5ZXJOYW1lcyYmcGxheWVySW5kZXg+PTAmJnBsYXllckluZGV4PHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD90aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF06bnVsbCk7XG4gICAgfVxuICAgIFxuICAgIGdldFBsYXllck5hbWVzKCl7cmV0dXJuIHRoaXMuX3BsYXllck5hbWVzO30gLy8gb3ZlcnJpZGluZyBnZXRQbGF5ZXJOYW1lcygpIG9mIHRoZSBkZW1vIHZlcnNpb24hIVxuICAgIFxuICAgIHNldCBwbGF5ZXJOYW1lcyhwbGF5ZXJOYW1lcyl7XG5cbiAgICAgICAgLy8gTURIQDI5SkFOMjAyMDogd2FpdCB3aXRoIGFjdHVhbGx5IHBsYXlpbmcgdGhlIGdhbWUgd2l0aCB0aGVzZSBwbGF5ZXJzIHVudGlsIHdlIGZvdW5kIG91dCB0aGF0IHRoZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBjdXJyZW50IHBsYXllciBpcyBhY3R1YWxseSBpbiB0aGUgZ2FtZSEhISEhXG5cbiAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuO1xuXG4gICAgICAgIGlmKHRoaXMuX3BsYXllckluZGV4Pj0wKXJldHVybjsgLy8gYWxyZWFkeSBwbGF5aW5nIHRoZSBnYW1lIEEgSEEgSSBoYXZlIHRvIGtpbGwgdGhlIHBsYXllciBpbmRleCBzb21ld2hlcmUuLi5cblxuICAgICAgICBsZXQgcGxheWVySW5kZXg9KCFwbGF5ZXJOYW1lc3x8cGxheWVyTmFtZXMubGVuZ3RoPDQ/LTE6cGxheWVyTmFtZXMuaW5kZXhPZihjdXJyZW50UGxheWVyLm5hbWUpKTtcbiAgICAgICAgXG4gICAgICAgIGlmKHBsYXllckluZGV4Pj0wKXtcbiAgICAgICAgICAgIC8vIE1ESEAyOUpBTjIwMjA6IGF0IHRoZSBtb21lbnQgdGhhdCB0aGUgcGxheWVyIG5hbWVzIGFyZSByZWNlaXZlZCB0aGUgZ2FtZSBhY3R1YWxseSBzdGFydHNcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIENBUkVGVUwgd2Ugc2hvdWxkIGNvbnNpZGVyIHJlY2VpdmluZyB0aGUgcGxheWVyIG5hbWVzIG1vcmUgdGhhbiBvbmNlPz8/Pz8/XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpOyAvLyAocmUpaW5pdGlhbGl6ZSBBTEwgdGhlIHByb3BlcnRpZXMgb2YgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9cGxheWVyTmFtZXM7XG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgodGhpcyxwbGF5ZXJJbmRleCk7IC8vIHJlZ2lzdGVyIHdpdGggdGhlIHBsYXllXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD1jdXJyZW50UGxheWVyLl9pbmRleDsgLy8gcmVtZW1iZXIgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgdXBkYXRlR2FtZVBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICBzaG93UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIC8vIHdlIG9ubHkgbmVlZCB0byBzaG93IHRoZSBjdXJyZW50IHBsYXllciBuYW1lIG9uIHBhZ2UtcGxheWluZyBPTkNFIGFzIGl0IHdpbGwgYWx3YXlzIHN0YXkgdGhlIHNhbWVcbiAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgLy8gcmVwbGFjaW5nOiBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1uYW1lXCIpLHRoaXMuZ2V0UGxheWVyTmFtZSh0aGlzLl9wbGF5ZXJJbmRleCksLTIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEN1cnJlbnQgcGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIG5vdCBmb3VuZC5cIik7XG4gICAgICAgICAgICBpZihwbGF5ZXJOYW1lcylcbiAgICAgICAgICAgICAgICBhbGVydChcIkVybnN0aWdlIHByb2dyYW1tYWZvdXQ6IFV3IG5hYW0ga29tdCBuaWV0IHZvb3IgaW4gZGUgc3BlbGVybGlqc3QgdmFuIGhldCB0ZSBzcGVsZW4gc3BlbCFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllckluZGV4KXtcbiAgICAgICAgaWYocGxheWVySW5kZXg8MHx8cGxheWVySW5kZXg+PXRoaXMuX3BsYXllck5hbWVzLmxlbmd0aClyZXR1cm4gLTE7XG4gICAgICAgIGxldCBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllckluZGV4XTtcbiAgICAgICAgLy8gd2UgZG9uJ3QgaGF2ZSBubyBwbGF5ZXJzIGFuZCBzaG91bGQgZ2V0IHRoZSBwYXJ0bmVyIGlkcyBmcm9tIHRoZSBzZXJ2ZXIgaXRzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9KHRoaXMuX3BhcnRuZXJzP3RoaXMuX3BhcnRuZXJzW3BsYXllckluZGV4XTotMSk7XG4gICAgICAgIGlmKHBhcnRuZXJJbmRleDwwKXJldHVybiBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyOyAvLyBubyBwYXJ0bmVyIGtub3duIHlldFxuICAgICAgICByZXR1cm4gbnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcit0aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwYXJ0bmVySW5kZXhdO1xuICAgIH1cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHdpbGwgYmUgcmVjZWl2aW5nIHRoZSBuZXcgdHJpY2sgZXZlbnQgd2hlbiBhIG5ldyB0cmljayBzdGFydHNcbiAgICAvLyBNREhAMjJKQU4yMDIwOiB1c2VyIHdpbGwgaGF2ZSB0byBjbGljayB0aGUgbmV3IHRyaWNrIGJ1dHRvbiBzbyB0aGV5IGNhbiBsb29rIGF0IHRoZSBvbGQgdHJpY2sgZmlyc3RcbiAgICBuZXdUcmljayh0cmlja0luZm8pe1xuICAgICAgICBcbiAgICAgICAgLy8gQVNTRVJUIG9ubHkgY2FsbCB3aGVuIHRyaWNrSW5mbyBpcyBub3QgTlVMTCEhISEhXG4gICAgICAgIGlmKCF0cmlja0luZm8pe2FsZXJ0KFwiQlVHOiBObyB0cmljayBpbmZvIVwiKTtyZXR1cm47fVxuXG4gICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyByZW1vdmUgdGhlIGNhcmRzIHNob3dpbmcgZnJvbSB0aGUgcHJldmlvdXMgdHJpY2tcblxuICAgICAgICAvLyBzaG93IHRoZSBpZCBvZiB0aGUgdHJpY2sgKHdoaWNoIGlzIHRoZSB0cmljayBpbmRleClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIFwiK3RyaWNrSW5mby5pbmRleDtcblxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD10cmlja0luZm8uaW5kZXgtMTtcblxuICAgICAgICBpZih0aGlzLl90cmljayl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc2hvdyB0aGUgZmluaXNoZWQgdHJpY2sgaW4gdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcblxuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgdHJpY2sgd2l0aCB0aGUgaW5mb3JtYXRpb24gaW4gdGhlIHRyaWNrIGluZm9cbiAgICAgICAgdGhpcy5fdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0aGlzLl90cnVtcFN1aXRlLHRoaXMuX3BhcnRuZXJTdWl0ZSx0aGlzLl9wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQsdHJpY2tJbmZvLmZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyk7XG4gICAgXG4gICAgICAgIC8qIHN0dXBpZCBtZTogSSBhbHJlYWR5IG1vdmVkIGRvaW5nIHRoaXMgdG8gc2hvd1RyaWNrKCkgYnV0IHRoZXJlIGVhcmxpZXIgaW5jb3JyZWN0IChpLmUuIE5PVCBjaGVja2luZyB0aGUgZmlyc3QgcGxheWVyISEhKVxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBoaWRpbmcgb3Igc2hvd2luZyB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgY2hlY2tib3ggY2FuIGJlIGRldGVybWluZWQgaGVyZSBhbmQgbm93XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBmb3IgZGVjaWRpbmcgaXMgY29tcGxldGVseSBrbm93biBhdCB0aGUgc3RhcnQgb2YgYSBuZXcgdHJpY2tcbiAgICAgICAgaWYodHJpY2tJbmZvLmZpcnN0UGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleCYmdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICAgICAgICAgIC8vIHRoZSBuZXh0IGRlY2lzaW9uIGlzIGEgbGl0dGxlIGhhcmRlciwgYmVjYXVzZSBzaG91bGQgd2UgYWx3YXlzIHR1cm4gb24gdGhlIGNoZWNrYm94Pz8/Pz8/Pz9cbiAgICAgICAgICAgIC8vIEJVVCBub3RlIHRoYXQgdGhlIHVzZXIgd2lsbCBiZSBwcm9tcHRlZCB0byBhY2tub3dsZWRnZSBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLnNlbGVjdGVkPTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICAqL1xuXG4gICAgICAgIC8vIHdlIGRvIHRoZSBmb2xsb3dpbmcgYmVjYXVzZSBpdCBpcyBlc3NlbnRpYWwgdGhhdCB0aGUgY2hlY2tib3ggdGhhdCB0ZWxscyB0aGUgcGxheWVyIHdoZXRoZXIgb3Igbm90XG4gICAgICAgIC8vIHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGJlIGFza2VkIHNob3VsZCBiZSBpbiB0aGUgcmlnaHQgc3RhdGUgdG8gc3RhcnQgd2l0aCAoZm9yIHRoZSByaWdodCBwbGF5ZXIpXG4gICAgICAgIC8vIE5PVEUgbmV3VHJpY2soKSBpcyBiZWluZyBjYWxsZWQgQkVGT1JFIGEgcGxheWVyIGlzIGFza2VkIHRvIHBsYXkgYSBjYXJkLCBzbyB0aGF0J3MgdGhlIHJpZ2h0IG1vbWVudCEhISFcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsgLy8gVE9ETyBzaG91bGQgdGhpcyBiZSBoZXJlPz8/Pz9cblxuICAgIH1cblxuICAgIC8qIE1ESEAyOUpBTjIwMjA6IE5PVCByZWNlaXZpbmcgdGhlIHBhcnRuZXIgaWRzIGRpcmVjdGx5IGZyb20gdGhlIHNlcnZlciBhbnltb3JlIEJVVCBkZXJpdmluZyB0aGVtIGZyb20gYW55IHBhcnRuZXIgaWQgd2UgcmVjZWl2ZSEhISEhXG4gICAgLy8gTURIQDIwSkFOMjAyMDogaWYgd2UgcmVjZWl2ZSBhbGwgcGFydG5lcnMgd2UgY2FuIGV4dHJhY3QgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgX3NldFBhcnRuZXJJZHMocGFydG5lcklkcyl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJJZHM9cGFydG5lcklkcztcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgY3VycmVudFBhcnRuZXI9KHRoaXMuX3BhcnRuZXJJZHMmJnRoaXMuX3BsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJJbmRleDx0aGlzLl9wYXJ0bmVySWRzLmxlbmd0aD90aGlzLl9wYXJ0bmVySWRzW3RoaXMuX3BsYXllckluZGV4XTotMSk7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIucGFydG5lcj49MCYmY3VycmVudFBhcnRuZXIucGFydG5lciE9Y3VycmVudFBhcnRuZXIpXG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJSYXBwb3J0ZWVyIGRlIHZvbGdlbmRlIGVybnN0aWdlIHByb2dyYW1tYWZvdXQ6ICdKZSBwYXJ0bmVyIGlzIHZlcmFuZGVyZCcuXCIpO1xuICAgICAgICBjdXJyZW50UGxheWVyLnBhcnRuZXI9Y3VycmVudFBhcnRuZXI7XG4gICAgfVxuICAgICovXG5cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogY2FyZEluZm8gZG9lcyBub3QgbmVlZCB0byBjb250YWluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBmbGFnIHBlciBzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBhY3R1YWxseSBvbmx5IG5lZWQgdG8gY29udGFpbiBpdCB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBhcyBpbiBhbGxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb3RoZXIgY2FzZXMgdGhlIHRyaWNrIGNhbiBkZXRlcm1pbmUgaXQgaXRzZWxmIGFuZCBzaG91bGQgTk9UIHJlbHkgb24gaW5mb3JtYXRpb24gc2VudCBieSB0aGUgc2VydmVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IHdvdWxkIGJlIGJldHRlciB0byBjaGFuZ2UgaXQgdG8gYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCBvbiB0aGUgb3RoZXIgc2VydmVyIGVuZCEhXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMgaXMgc29sdmVkIGJ5IHNlbmRpbmcgcGxheVN1aXRlIGFsb25nIHdpdGggY2FyZEluZm8gd2hlbiBzbyBuZWVkZWQhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcImFza2luZ0ZvclBhcnRuZXJDYXJkXCIpKVxuICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9Y2FyZEluZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7IC8vIE1ESEAyNkpBTjIwMjA6IHNob3VsZG4ndCBmb3JnZXQgdGhpcyEhISFcbiAgICAgICAgKi9cbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cmljay5hZGRDYXJkKG5ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm8uc3VpdGUsY2FyZEluZm8ucmFuaykpO1xuICAgICAgICBpZihlcnJvciBpbnN0YW5jZW9mIEVycm9yKXJldHVybiBlcnJvcjtcblxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBpZiB3ZSdyZSByZWNlaXZpbmcgdGhlIHBsYXkgc3VpdGUgd2UgY2FuIGRldGVybWluZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBvdXJzZWx2ZXNcbiAgICAgICAgaWYoY2FyZEluZm8uaGFzT3duUHJvcGVydHkoXCJwbGF5U3VpdGVcIikpe1xuICAgICAgICAgICAgLy8gaWYgdGhlIHBsYXkgc3VpdGUgcHJvdmlkZWQgZGlmZmVycyBmcm9tIHRoZSAnYXV0b21hdGljJyBwbGF5IHN1aXRlLCB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGJsaW5kbHlcbiAgICAgICAgICAgIGlmKGNhcmRJbmZvLnBsYXlTdWl0ZSE9PXRoaXMuX3RyaWNrLnBsYXlTdWl0ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpY2sucGxheVN1aXRlPWNhcmRJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0tMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBOT1QgZXhwZWN0aW5nIHRvIHJlY2VpdmUgdGhlIHBhcnRuZXIgaWRzIGFueW1vcmUhISFcbiAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogZXZlcnkgY2FyZCBwbGF5ZWQgY29udGFpbnMgdGhlIHBhcnRuZXJzIGFzIHdlbGwhISFcbiAgICAgICAgaWYoY2FyZEluZm8uaGFzT3duUHJvcGVydHkoXCJwYXJ0bmVyc1wiKSl0aGlzLl9zZXRQYXJ0bmVySWRzKGNhcmRJbmZvLnBhcnRuZXJzKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gaWYgYWxsIHRoZSBjYXJkcyBpbiB0aGUgdHJpY2sgaGF2ZSBiZWVuIHBsYXllZCwgdGhlIHdpbm5lciBpcyBkZWZpbml0ZSwgYW5kIHdpbnMgdGhlIHRyaWNrXG4gICAgICAgIGlmKHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHM9PT00KXRoaXMuX251bWJlck9mVHJpY2tzV29uW3RoaXMuX3RyaWNrLndpbm5lcl0rKztcbiAgICAgICAgLy8gZG8gbm90aGluZy4uLlxuICAgICAgICAvLyBzaG93VHJpY2tDYXJkKHRoaXMuX3RyaWNrLmdldExhc3RDYXJkKCksdGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcyk7XG4gICAgICAgIHNob3dUcmljayh0aGlzLl90cmljayk7Ly9pZih0aGlzLl90cmlja1dpbm5lcil7dGhpcy5fdHJpY2tXaW5uZXI9bnVsbDtzaG93VHJpY2sodGhpcy5fdHJpY2spO31cbiAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQ0FSRF9SRUNFSVZFRCk7XG4gICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tjYXJkSW5mby5zdWl0ZV0pK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbY2FyZEluZm8ucmFua10rXCIgZ2VzcGVlbGQuXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIHBhcnNlVHJpY2sodHJpY2tJbmZvKXtcbiAgICAgICAgbGV0IHRyaWNrPW5ldyBUcmljayh0cmlja0luZm8uZmlyc3RQbGF5ZXIsdHJpY2tJbmZvLnRydW1wU3VpdGUsdHJpY2tJbmZvLnBhcnRuZXJTdWl0ZSx0cmlja0luZm8ucGFydG5lclJhbmssdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgLy8gYWxyZWFkeSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yISEhXG4gICAgICAgIC8vIHRyaWNrLl9maXJzdFBsYXllcj10cmlja0luZm8uZmlyc3RQbGF5ZXI7XG4gICAgICAgIC8vIHRyaWNrLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGlmKHRyaWNrSW5mby5jYXJkcyYmdHJpY2tJbmZvLmNhcmRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGZpbGwgdGhlIHRyaWNrIHdpdGggdHJpY2sgaW5mb3JtYXRpb24gZnJvbSB0aGUgb3RoZXIgcGxheWVycyEhIVxuICAgICAgICAgICAgdHJpY2tJbmZvLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0pLmhvbGRlcj10cmljazt9KTsgLy8gc3RvcmUgdGhlIGNhcmRzIHJlY2VpdmVkIGluIHRyaWNrXG4gICAgICAgICAgICB0cmljay5fd2lubmVyPXRyaWNrSW5mby53aW5uZXI7XG4gICAgICAgICAgICB0cmljay5fcGxheVN1aXRlPXRyaWNrSW5mby5wbGF5U3VpdGU7XG4gICAgICAgICAgICB0cmljay5fYXNraW5nRm9yUGFydG5lckNhcmQ9dHJpY2tJbmZvLmFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmljaztcbiAgICB9XG4gICAgKi9cblxuICAgIGFja25vd2xlZGdlRXZlbnRzKCl7XG4gICAgICAgIC8vIG5vdyBpZiB0aGUgdW5hY2tub3dsZWRnZSBldmVudCBpZHMgZG8gTk9UIHJlYWNoIHRoZSBzZXJ2ZXIgd2Ugd2lsbCByZWNlaXZlIGNlcnRhaW4gZXZlbnRzIGFnYWluIHVudGlsIHdlIGRvXG4gICAgICAgIC8vIG1hbmFnZSB0byBnZXQgdGhlbSBvdmVyXG4gICAgICAgIC8vIG1ha2UgYSBjb3B5IG9mIGFsbCB0aGUgdW5hY2tub3dsZWRnZWQgZXZlbnRzXG4gICAgICAgIGxldCBhY2tub3dsZWRnZWFibGVFdmVudHM9dGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubWFwKCh1bmFja25vd2xlZGdlZEV2ZW50KT0+T2JqZWN0LmFzc2lnbih7fSx1bmFja25vd2xlZGdlZEV2ZW50KSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBhY2tub3dsZWRnZWFibGUgZXZlbnRzOiBcIixhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAvLyBvZiBjb3Vyc2Ugd2UgY291bGQgc2VuZCB0aGVtIHBhc3NpbmcgYW4gYWNrbm93bGVkZ2UgZnVuY3Rpb24gdGhvdWdoXG4gICAgICAgIGlmKGFja25vd2xlZGdlYWJsZUV2ZW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAvLyBlbWl0IHBhc3NpbmcgYWxvbmcgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBnZXQgY2FsbGVkIHdoZW4gdGhlIEFDSyBtZXNzYWdlIHdhcyByZWNlaXZlZCBieSB0aGUgc2VydmVyXG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChcIkFDS1wiLGFja25vd2xlZGdlYWJsZUV2ZW50cywoKT0+e1xuICAgICAgICAgICAgICAgIC8vIHdlIG5vdyBtYXkgcmVtb3ZlIGFsbCBhY2tub3dsZWRnZWFibGUgZXZlbnRzXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKiogRXZlbnRzIGFja25vd2xlZGdlbWVudHMgcmVjZWl2ZWQhICoqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLy8vL2RpZmZlcmVuY2UodGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMsYWNrbm93bGVkZ2VhYmxlRXZlbnRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZHVwbGljYXRlZCBmcm9tIHNlcnZlci1zaWRlIFJpa2tlblRoZUdhbWUuanMgdGhhdCB3aWxsIHRyYW5zbGF0ZSB0aGlzLl9wbGF5ZXJzQmlkcyB0byByZWFkYWJsZSBiaWRzXG4gICAgLy8gdG8gYmUgcGFzc2VkIHRvIHVwZGF0ZUJpZHNUYWJsZSgpISEhXG4gICAgX2dldFBsYXllckJpZHNPYmplY3RzKCl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0cz1bXTtcbiAgICAgICAgdGhpcy5fcGxheWVyc0JpZHMuZm9yRWFjaCgocGxheWVyQmlkcyk9PntcbiAgICAgICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXtuYW1lOnRoaXMuZ2V0UGxheWVyTmFtZShwbGF5ZXJCaWRzT2JqZWN0cy5sZW5ndGgpLGJpZHM6W119O1xuICAgICAgICAgICAgLy8gdXNlIHVuc2hpZnQgTk9UIHB1c2ggYXMgdGhlIGJpZHMgYXJlIHN0b3JlZCByZXZlcnNlIG9yZGVyIFxuICAgICAgICAgICAgcGxheWVyQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQpPT57cGxheWVyQmlkc09iamVjdC5iaWRzLnVuc2hpZnQoUGxheWVyR2FtZS5CSURfTkFNRVNbcGxheWVyQmlkXSl9KTtcbiAgICAgICAgICAgIHBsYXllckJpZHNPYmplY3RzLnB1c2gocGxheWVyQmlkc09iamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGxheWVyQmlkc09iamVjdHM7XG4gICAgfVxuXG4gICAgX3NldFBhcnRuZXJzKHBhcnRuZXIxLHBhcnRuZXIyKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgI1wiKyhwYXJ0bmVyMSkrXCIgYW5kICNcIisocGFydG5lcjIpK1wiIGFyZSBwYXJ0bmVycyFcIik7XG4gICAgICAgIC8vIE1ESEAwOERFQzIwMTk6IGluc3RlYWQgb2YgZGlyZWN0bHkgc2V0dGluZyB0aGUgcGFydG5lciBwcm9wZXJ0eSBvZiBlYWNoIHBsYXllclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB3ZSB3YWl0IHdpdGggZG9pbmcgc28gYXMgc29vbiBhcyB0aGUgcGFydG5lciBpcyBrbm93biAoYnkgcGxheWluZyB0aGUgcGFydG5lciBjYXJkKVxuICAgICAgICB0aGlzLl9wYXJ0bmVycz1bLTEsLTEsLTEsLTFdO1xuICAgICAgICBsZXQgdGVhbXM9W1twYXJ0bmVyMSxwYXJ0bmVyMl0sW11dO1xuICAgICAgICAvLyBNREhAMjlKQU4yMDIwOiBhdCB0aGlzIGVuZCB3ZSBkbyBub3QgaGF2ZSBfcGxheWVycyBvbmx5IF9wbGF5ZXJOYW1lcyBhbmQgdGhlaXIgX2luZGV4IGlzIHRoZWlyIHBvc2l0aW9uIGluIHRoZSBhcnJheSBvZiBwbGF5ZXIgbmFtZXMhISEhXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzLmZvckVhY2goKHBsYXllck5hbWUsaW5kZXgpPT57aWYoaW5kZXghPT1wYXJ0bmVyMSYmaW5kZXghPT1wYXJ0bmVyMil0ZWFtc1sxXS5wdXNoKGluZGV4KTt9KTtcbiAgICAgICAgdGVhbXMuZm9yRWFjaCgodGVhbSk9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVhbTogXCIsdGVhbSk7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyc1t0ZWFtWzBdXT10ZWFtWzFdO1xuICAgICAgICAgICAgdGhpcy5fcGFydG5lcnNbdGVhbVsxXV09dGVhbVswXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFydG5lcnMga25vd246IFwiLHRoaXMuX3BhcnRuZXJzKTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjlKQU4yMDIwOiBfc2V0UGFydG5lcigpIGlzIGNhbGxlZCB3aGVuIHRoZSBQQVJUTkVSIGV2ZW50IGlzIHJlY2VpdmVkXG4gICAgLy8gICAgICAgICAgICAgICAgaWYgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyIGlzIGtub3duLCBhbGwgcGFydG5lcnMgYXJlIGtub3duXG4gICAgLy8gICAgICAgICAgICAgICAgYW5kIHRoZSBwYXJ0bmVyIGlkcyBjYW4gYmUgZGVyaXZlZCEhISFcbiAgICBfc2V0UGFydG5lcihwYXJ0bmVyKXtcbiAgICAgICAgY3VycmVudFBsYXllci5wYXJ0bmVyPXBhcnRuZXI7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIucGFydG5lcj49MClpZighdGhpcy5fcGFydG5lcnMpdGhpcy5fc2V0UGFydG5lcnMoY3VycmVudFBsYXllci5faW5kZXgsY3VycmVudFBsYXllci5wYXJ0bmVyKTtcbiAgICB9XG5cbiAgICAvLyBnZW5lcmljIG1ldGhvZCBmb3IgcHJvY2Vzc2luZyBhbnkgZXZlbnQsIGV2ZXJ5XG4gICAgcHJvY2Vzc0V2ZW50KGV2ZW50LGV2ZW50RGF0YSxhY2tub3dsZWRnZSl7XG4gICAgICAgIC8vIGxvZyBldmVyeSBldmVudFxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGV2ZW50LGV2ZW50RGF0YSk7XG4gICAgICAgIGlmKCFldmVudClyZXR1cm47IC8vIE5PVEUgdGhlIGV2ZW50RGF0YSBjYW4gYmUgbnVsbCEhISEhIVxuICAgICAgICAvLyBpZiBkYXRhIGhhcyBhbiBpZCBpdCBuZWVkcyB0byBiZSBhY2tub3dsZWRnZWRcbiAgICAgICAgbGV0IGV2ZW50SWQ9KGV2ZW50RGF0YSYmZXZlbnREYXRhLmhhc093blByb3BlcnR5KFwiaWRcIik/ZXZlbnREYXRhLmlkOm51bGwpO1xuICAgICAgICAvLyBpZiB0aGVyZSdzIGFuIGV2ZW50IGlkIGluIHRoaXMgZXZlbnQsIGFuZCB3ZSdyZSBzdXBwb3NlZCB0byBzZW5kIGFja25vd2xlZGdlbWVudHMsIGRvIHNvXG4gICAgICAgIGlmKGV2ZW50SWQpe1xuICAgICAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogbm93IHB1c2ggdGhlIGV2ZW50IG5hbWUgYXMgd2VsbCBzbyB0aGUgc2VydmVyIGNhbiBsb2cgdGhhdCBhbmQgd2UgY2FuIHNlZSB3aGF0J3MgYWNrbm93bGVnZGVkISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBCVVQgZG9uJ3QgcHVzaCBpdCBhZ2FpbiBpZiBpdCdzIGFscmVhZHkgdGhlcmUhISEhXG4gICAgICAgICAgICBpZihhY2tub3dsZWRnZSlcbiAgICAgICAgICAgICAgICBpZih0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGg9PT0wfHx0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50c1t0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGgtMV0uaWQhPT1ldmVudElkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5wdXNoKHsnaWQnOmV2ZW50SWQsJ2V2ZW50JzpldmVudH0pO1xuICAgICAgICAgICAgdGhpcy5hY2tub3dsZWRnZUV2ZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhPShldmVudElkP2V2ZW50RGF0YS5wYXlsb2FkOmV2ZW50RGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQUk9DRVNTSU5HIEVWRU5UIFwiK2V2ZW50K1wiID4+PlwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgc3dpdGNoKGV2ZW50KXtcbiAgICAgICAgICAgIGNhc2UgXCJJTkZPXCI6XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIlNwZWwgc2VydmVyIHplZ3Q6IFwiK2RhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRFQ0hBTkdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVcIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9HQU1FX1JFQ0VJVkVEKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdhbWUgaW5mb3JtYXRpb24gcmVjZWl2ZWQgYnkgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicuXCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgcGxheWVyIG5hbWVzISEhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJTXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRFMpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZXM9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJERUFMRVJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWFsZXI9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDQVJEU1wiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkRTX1JFQ0VJVkVEKTsgLy8gb25jZSB0aGUgY2FyZHMgaGF2ZSBiZWVuIHJlY2VpdmVkXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lcihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHR5cGljYWxseSB0aGUgZ2FtZSBpbmZvIGNvbnRhaW5zIEFMTCBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRoZSBnYW1lIHRoYXQgaXMgZ29pbmcgdG8gYmUgcGxheWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGkuZS4gYWZ0ZXIgYmlkZGluZyBoYXMgZmluaXNoZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT1kYXRhLnRydW1wU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1kYXRhLnBhcnRuZXJTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbms9ZGF0YS5wYXJ0bmVyUmFuaztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZD1kYXRhLmhpZ2hlc3RCaWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWRkZXJzPWRhdGEuaGlnaGVzdEJpZGRlcnM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcj1kYXRhLmZvdXJ0aEFjZVBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogbW92ZSBzaG93aW5nIHRoZSBnYW1lIGluZm8gZnJvbSBwbGF5QUNhcmQoKSB0byBoZXJlISEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lclJhbms+PTApeyAvLyBhIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJTdWl0ZUVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1zdWl0ZScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZUVsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX3BhcnRuZXJTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJSYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyUmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lckVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT1cImluaGVyaXRcIjtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7IC8vIG5vIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVE9fQklEXCI6XG4gICAgICAgICAgICAgICAgaWYoZGF0YSE9PWN1cnJlbnRQbGF5ZXIubmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1dBSVRfRk9SX0JJRCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGhldCBib2QgdmFuIFwiK2RhdGErXCIuXCIpO1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBib2QgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgIC8vIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2F0IHdpbCBqZSBzcGVsZW4/XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTUFLRV9BX0JJRFwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5tYWtlQUJpZChkYXRhLnBsYXllckJpZHNPYmplY3RzLGRhdGEucG9zc2libGVCaWRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJCSURfTUFERVwiOiAvLyByZXR1cm5lZCB3aGVuIGEgYmlkIGlzIG1hZGUgYnkgc29tZW9uZVxuICAgICAgICAgICAgICAgIC8vLy8vLy8vL2lmKGRhdGEucGxheWVyPT09dGhpcy5fcGxheWVySW5kZXgpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9CSURfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIHRvIHJlY2VpdmUgaW4gZGF0YSBib3RoIHRoZSBwbGF5ZXIgYW5kIHRoZSBiaWRcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1nZXRCaWRJbmZvKGRhdGEuYmlkLGRhdGEucGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleD9udWxsOnRoaXMuZ2V0UGxheWVyTmFtZShkYXRhLnBsYXllcikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllcnNCaWRzW2RhdGEucGxheWVyXS5wdXNoKGRhdGEuYmlkKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIGhvdyB0byBzaG93IHRoZSBiaWRzPz8/Pz9cbiAgICAgICAgICAgICAgICB1cGRhdGVCaWRzVGFibGUodGhpcy5fZ2V0UGxheWVyQmlkc09iamVjdHMoKSk7XG4gICAgICAgICAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogZmFpbC1zYWZlIEJVVCB0aGlzIHNob3VsZCBiZSBkb25lIGFub3RoZXIgd2F5IFRPRE9cbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIHZhbiBcIit0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpK1wiOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1tkYXRhLmJpZF0rXCIuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX1BMQVlcIjpcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGRlIGthYXJ0IHZhbiBcIitkYXRhK1wiLlwiKTtcbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QhXCIpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJTcGVlbCBlZW4ga2FhcnQgYmlqLlwiO1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTX1RPX1dJTlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJORVdfVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1RyaWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBBUlRORVJTXCI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIGlkcyByZWNlaXZlZCBCVVQgbm8gbG9uZ2VyIHVzZWQhXCIpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX3NldFBhcnRuZXJJZHMoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0FSRF9QTEFZRURcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0NhcmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvKiBNREhAMDNGRUIyMDIwOiB0aGUgcGxheWVyIGluZm8gaXMgbm93IHJlY2VpdmVkIGluIHRoZSBQTEFZX0FfQ0FSRCBldmVudFxuICAgICAgICAgICAgY2FzZSBcIlBMQVlFUl9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGNvbnRhaW4gdGhlIGN1cnJlbnQgY2FyZHMgdGhlIHVzZXIgaGFzXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjNKQU4yMDIwOiBnYW1lIGtlZXBzIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSBlYWNoIHBsYXllciEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIC8vIGFsc28gdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGFuZCB0byB3aW5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudFBsYXllci5udW1iZXJPZlRyaWNrc1dvbj1kYXRhLm51bWJlck9mVHJpY2tzV29uO1xuICAgICAgICAgICAgICAgICAgICAvLyAvLyBUT0RPIFBMQVlFUl9JTkZPIGRvZXMgbm90IG5lZWQgdG8gc2VuZCB0aGUgZm9sbG93aW5nIHdpdGggZWFjaCBQTEFZRVJfSU5GTyBUSE9VR0hcbiAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudFBsYXllci5zZXROdW1iZXJPZlRyaWNrc1RvV2luKGRhdGEubnVtYmVyT2ZUcmlja3NUb1dpbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNhc2UgXCJQTEFZX0FfQ0FSRFwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkQpO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IHRha2luZyBvdmVyIGZyb20gUExBWUVSX0lORk8gYXMgdGhlIGNhcmRzIGFyZSBub3cgcmVjZWl2ZWQgaW4gdGhlIFBMQVlfQV9DQVJEIGV2ZW50ISEhIVxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWNlaXZpbmcgdHJpY2sgaW5mbyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogTk9UIGFueW1vcmVcbiAgICAgICAgICAgICAgICBpZighdGhpcy5fdHJpY2spe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlByb2dyYW1tYWZvdXQ6IFUgd29yZHQgb20gZWVuIGthYXJ0IGdldnJhYWdkIGluIGVlbiBvbmdlZGVmaW5pZWVyZGUgc2xhZyEgV2Ugd2FjaHRlbiBldmVuIG9wIHNsYWdpbmZvcm1hdGllLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBNREhAMjdKQU4yMDIwOiBkb2luZyB0aGlzIGFuZCBob3BpbmcgdGhlIG5leHQgcmVxdWVzdCBpcyByZWNlaXZlZCBBRlRFUiByZWNlaXZpbmcgYSBuZXcgdHJpY2shISFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTURIQDIySkFOMjAyMDogb2NjYXNzaW9uYWxseSB3ZSBtYXkgcmVjZWl2ZSB0aGUgcmVxdWVzdCB0byBwbGF5IEJFRk9SRSBhY3R1YWxseSBoYXZpbmcgcmVjZWl2ZWQgdGhlIHN0YXRlIGNoYW5nZSEhXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPT1cInBhZ2UtcGxheWluZ1wiKXNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5wbGF5QUNhcmQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfVFJVTVBfU1VJVEVcIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLmNob29zZVRydW1wU3VpdGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJVTVBfU1VJVEVfQ0hPU0VOXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfVFJVTVBfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tkYXRhXSkrXCIgZ2Vrb3plbiBhbHMgdHJvZWYuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VQYXJ0bmVyU3VpdGUoZGF0YS5zdWl0ZXMsZGF0YS5wYXJ0bmVyUmFua05hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBBUlRORVJfU1VJVEVfQ0hPU0VOXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUl9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKExhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW2RhdGEuc3VpdGVdKStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2RhdGEucmFua10rXCIgbWVlZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLXCI6XG4gICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHRoaXMucGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTXCI6IC8vIE1ESEAyM0pBTjIwMjA6IHdvbid0IGJlIHJlY2VpdmluZyB0aGlzIGV2ZW50IGFueW1vcmUuLi5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgdGhlIHRyaWNrcyBmcm9tIHRoZSBhcnJheSBvZiB0cmlja3MgaW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlja3M9ZGF0YS5tYXAoKHRyaWNrSW5mbyk9PntyZXR1cm4gdGhpcy5wYXJzZVRyaWNrKHRyaWNrSW5mbyk7fSk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJSRVNVTFRTXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3b24ndCBiZSByZWNlaXZpbmcgYSBuZXcgdHJpY2sgZXZlbnQsIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIHNob3cgdGhlIHVzZXIgdGhhdCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhlIHBhZ2UgbW92ZWQgdG8gdGhlIHJlc3VsdHMgcGFnZT8/Pz8/P1xuICAgICAgICAgICAgICAgICAgICAvKiByZW1vdmVkLCBhcyB0aGVzZSB0aGluZ3MgYXJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBvdmVyIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb2ludHM9ZGF0YS5wb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIG5ldy1nYW1lIG9yIHN0b3AgYnV0dG9uIGNsaWNrISEhISEgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT09XCJwYWdlLWZpbmlzaGVkXCIpc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7IC8vIGlmIHdlIGFyZW4ndCB0aGVyZSB5ZXQhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkaXNjb25uZWN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTURIQDIySkFOMjAyMDogYmV0dGVyIG5vdCB0byBnbyBvdXQgb2Ygb3JkZXIgd2hlbiB0aGlzIGhhcHBlbnMhISEhISFcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVmVyYmluZGluZyBtZXQgZGUgc2VydmVyICh0aWpkZWxpamspIHZlcmJyb2tlbiFcIik7IC8vIHJlcGxhY2luZzogdGhpcy5zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBldmVudCBcIitldmVudCtcIiByZWNlaXZlZCFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcHJlcGFyZUZvckNvbW11bmljYXRpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQcmVwYXJpbmcgZm9yIGNvbW11bmljYXRpb25cIik7XG4gICAgICAgIC8vIHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsKCk9PntcbiAgICAgICAgLy8gICAgIHRoaXMuX3N0YXRlPUlETEU7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cz1bXTsgLy8ga2VlcCB0cmFjayBvZiB0aGUgdW5hY2tub3dsZWRnZWRFdmVudElkc1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCgpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ2Rpc2Nvbm5lY3QnLG51bGwsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignSU5GTycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignU1RBVEVDSEFOR0UnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdTVEFURUNIQU5HRScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZRVJTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWUVSUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdERUFMRVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdERUFMRVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRFMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDQVJEUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQQVJUTkVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUEFSVE5FUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FX0lORk8nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FX0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX0JJRFwiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUT19CSUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTUFLRV9BX0JJRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ01BS0VfQV9CSUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQklEX01BREUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdCSURfTUFERScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fUExBWVwiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUT19QTEFZJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBNREhAMTNKQU4yMDIwOiBwbGF5ZXIgaW5mbyB3aWxsIGJlIHJlY2VpdmVkIGJlZm9yZSBiZWluZyBhc2tlZCB0byBwbGF5IGEgY2FyZCB0byB1cGRhdGUgdGhlIHBsYXllciBkYXRhXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlBMQVlFUl9JTkZPXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUl9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLU19UT19XSU4nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1NfVE9fV0lOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ05FV19UUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ05FV19UUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEX1BMQVlFRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRfUExBWUVEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlfQV9DQVJEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWV9BX0NBUkQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1RSVU1QX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0hPT1NFX1RSVU1QX1NVSVRFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSVU1QX1NVSVRFX0NIT1NFTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSVU1QX1NVSVRFX0NIT1NFTicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfUEFSVE5FUl9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUEFSVE5FUl9TVUlURV9DSE9TRU4nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQQVJUTkVSX1NVSVRFX0NIT1NFTicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDSycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdSRVNVTFRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUkVTVUxUUycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdHQU1FT1ZFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVPVkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIG11bHRpcGxlIGV2ZW50cyBhcyBhIHdob2xlLCB3ZSBwcm9jZXNzIGFsbCBvZiB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdFVkVOVFMnLChldmVudHMpPT57XG4gICAgICAgICAgICAvLyB3ZSBjb3VsZCBjb25zdW1lIHRoZSBldmVudHMgSSBndWVzc1xuICAgICAgICAgICAgd2hpbGUoZXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICBldmVudD1ldmVudHMuc2hpZnQoKTsgLy8gcmVtb3ZlIHRoZSBmaXJzdCBldmVudFxuICAgICAgICAgICAgICAgIC8vIGFzY2VydGFpbiB0byBzZW5kIGFsbCB1bmFja25vd2xlZGdlZCBldmVudCBpZHMgd2hlbiB0aGlzIGlzIHRoZSBsYXN0IHByb2Nlc3MgZXZlbnQhISEhXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQuZXZlbnQsZXZlbnQuZGF0YSxldmVudHMubGVuZ3RoPT09MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1ESEAyOUpBTjIwMjA6IGlmIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBtYWtlIHRoaXMgcGxheWVyIHBsYXkgbW9yZSB0aGFuIG9uZSBnYW1lIHdpdGggdGhlIHNhbWUgR2FtZSBpbnN0YW5jZVxuICAgIC8vICAgICAgICAgICAgICAgICh0aGlzIG9uZSksIHdlIG5lZWQgdG8gdGFrZSBhbGwgaW5pdGlhbGl6YXRpb24gb3V0IG9mIHRoZSBjb25zdHJ1Y3RvciBhbmQgcHV0IGl0IGluIGhlcmVcbiAgICBfaW5pdGlhbGl6ZUdhbWUoKXtcbiAgICAgICAgdGhpcy5fc3RhdGU9UGxheWVyR2FtZS5PVVRfT0ZfT1JERVI7XG4gICAgICAgIHRoaXMuX2V2ZW50c1JlY2VpdmVkPVtdO1xuICAgICAgICB0aGlzLl90cmlja1dpbm5lcj1udWxsO1xuICAgICAgICB0aGlzLl9kZWFsZXI9LTE7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7Ly90aGlzLl90cnVtcFBsYXllcj0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO3RoaXMuX3BhcnRuZXJSYW5rPS0xO1xuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1dvbj1bMCwwLDAsMF07IC8vIGFzc3VtZSBubyB0cmlja3Mgd29uIGJ5IGFueWJvZHlcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ9MDt0aGlzLl90cmljaz1udWxsO1xuICAgICAgICB0aGlzLl9oaWdoZXN0QmlkPS0xO3RoaXMuX2hpZ2hlc3RCaWRkZXJzPVtdO3RoaXMudHJ1bXBQbGF5ZXI9LTE7IC8vIG5vIGhpZ2hlc3QgYmlkZGVycyB5ZXRcbiAgICAgICAgdGhpcy5fcGxheWVyc0JpZHM9W1tdLFtdLFtdLFtdXTsgLy8gTURIQDIxSkFOMjAyMDoga2VlcCB0cmFjayBvZiBhbGwgdGhlIGJpZHMgdG8gc2hvd1xuICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1udWxsO1xuICAgICAgICB0aGlzLl9wb2ludHM9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fbGFzdFRyaWNrUGxheWVkPW51bGw7XG4gICAgICAgIC8vIHRoaXMuX3RlYW1OYW1lcz1udWxsO1xuICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD0tMTsgLy8gdGhlICdjdXJyZW50JyBwbGF5ZXJcbiAgICAgICAgLy8gdGhpbmdzIHdlIGNhbiBzdG9yZSBpbnRlcm5hbGx5IHRoYXQgd2UgcmVjZWl2ZSBvdmVyIHRoZSBjb25uZWN0aW9uXG4gICAgICAgIHRoaXMuX25hbWU9bnVsbDsgLy8gdGhlIG5hbWUgb2YgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9bnVsbDsgLy8gdGhlIG5hbWVzIG9mIHRoZSBwbGF5ZXJzXG4gICAgICAgIHRoaXMuX3BhcnRuZXJzPW51bGw7IC8vIHRoZSBwYXJ0bmVycyAodXNpbmcgdGhlIHNhbWUgbmFtZSBhcyBpbiAoc2VydmVyLXNpZGUpIFJpa2tlblRoZUdhbWUuanMpXG4gICAgfVxuXG4gICAgLy8gTURIQDA4SkFOMjAyMDogc29ja2V0IHNob3VsZCByZXByZXNlbnQgYSBjb25uZWN0ZWQgc29ja2V0LmlvIGluc3RhbmNlISEhXG4gICAgY29uc3RydWN0b3Ioc29ja2V0KXtcbiAgICAgICAgLy8gT09QUyBkaWRuJ3QgbGlrZSBmb3JnZXR0aW5nIHRoaXMhISEgXG4gICAgICAgIC8vIGJ1dCBQbGF5ZXJHYW1lIGRvZXMgTk9UIGhhdmUgYW4gZXhwbGljaXQgY29uc3RydWN0b3IgKGkuZS4gbm8gcmVxdWlyZWQgYXJndW1lbnRzKVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zb2NrZXQ9c29ja2V0O1xuICAgICAgICB0aGlzLl9zZW50RXZlbnRSZWNlaXZlZD10aGlzLl9zZW50RXZlbnRSZWNlaXZlZC5iaW5kKHRoaXMpO3RoaXMuX3NlbmRFdmVudD10aGlzLl9zZW5kRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZUdhbWUoKTtcbiAgICAgICAgdGhpcy5fcHJlcGFyZUZvckNvbW11bmljYXRpb24oKTtcbiAgICB9XG5cbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ2FtZSBpdHNlbGYgb3JnYW5pemVkIGJ5IHN0YXRlXG4gICAgLy8gUExBWUlOR1xuICAgIGdldFRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgIC8vIGdldFRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO31cbiAgICBcbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpeyAvLyBvbmx5IHdoZW4gcGxheWVyIGVxdWFscyB0aGlzLl9wbGF5ZXJJbmRleCBkbyB3ZSBrbm93IHRoZSBwYXJ0bmVyXG4gICAgICAgIGxldCBwYXJ0bmVyPShwbGF5ZXI9PT10aGlzLl9wbGF5ZXJJbmRleD9jdXJyZW50UGxheWVyLnBhcnRuZXI6LTEpO1xuICAgICAgICByZXR1cm4ocGFydG5lcj49MCYmcGFydG5lcjx0aGlzLm51bWJlck9mUGxheWVycz90aGlzLl9wbGF5ZXJOYW1lc1twYXJ0bmVyXTpudWxsKTtcbiAgICB9XG5cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyczt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe3JldHVybiB0aGlzLl9oaWdoZXN0QmlkO31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgLy8gZ2V0UGxheWVyTmFtZShwbGF5ZXIpe3JldHVybih0aGlzLl9wbGF5ZXJOYW1lcyYmcGxheWVyPHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD90aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJdOlwiP1wiKTt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7cmV0dXJuIHRoaXMuX2RlbHRhUG9pbnRzO31cbiAgICBnZXQgcG9pbnRzKCl7cmV0dXJuIHRoaXMuX3BvaW50czt9XG5cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsb3RoZXJQbGF5ZXJJbmRleCl7cmV0dXJuKHRoaXMuX3BhcnRuZXJzP3RoaXMuX3BhcnRuZXJzW3BsYXllckluZGV4XT09PW90aGVyUGxheWVySW5kZXg6ZmFsc2UpO31cbiAgICBcbiAgICAvLyBnZXRMYXN0VHJpY2tQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbGFzdFRyaWNrUGxheWVkO30gLy8gVE9ETyBzdGlsbCB1c2VkPz8/Pz9cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ7fVxuICAgIC8vIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcjt9XG4gICAgZ2V0VGVhbU5hbWUocGxheWVySW5kZXgpe1xuICAgICAgICAvLyBjb21wdXRpbmcgdGhlIHRlYW0gbmFtZSBvbiB0aGUgZmx5XG4gICAgICAgIC8vIG9rLCBJJ3ZlIGNoYW5nZSBzZW5kaW5nIHRoZSBwYXJ0bmVySWRzIG92ZXIgdG8gdGhlIGdhbWUsIGluc3RlYWQgbm93IHBhcnRuZXIgaXMgYmVpbmcgc2V0XG4gICAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggdGhlIHBsYXllciBhZ2FpblxuICAgICAgICAvKlxuICAgICAgICBsZXQgcGxheWVyPXRoaXMuX3BsYXllcnNbcGxheWVySW5kZXhdO1xuICAgICAgICBsZXQgcGFydG5lckluZGV4PXBsYXllci5wYXJ0bmVyO1xuICAgICAgICByZXR1cm4gcGxheWVyLm5hbWUrKHBhcnRuZXJJbmRleD49MD9cIiAmIFwiK3RoaXMuZ2V0UGxheWVyTmFtZShwYXJ0bmVySW5kZXgpOlwiXCIpO1xuICAgICAgICAqL1xuICAgICAgICAvLyBOT1QgcmVwbGFjaW5nOlxuICAgICAgICBsZXQgdGVhbU5hbWU9dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgLy8gZGlzdGluZ3Vpc2ggYmV0d2VlbiB0aGUgY3VycmVudCBwbGF5ZXIgYmVpbmcgYXNrZWQgYW5kIGFub3RoZXIgcGxheWVyXG4gICAgICAgIGxldCBrbm93blBhcnRuZXJJbmRleD0odGhpcy5fcGFydG5lcnM/dGhpcy5fcGFydG5lcnNbcGxheWVySW5kZXhdOi0xKTsgLy8gTk9URSBjb3VsZCBiZSBudWxsISEhXG4gICAgICAgIC8vIGlmIHRoZSBwbGF5ZXIgaXMgcGxheWluZyBieSBoaW0vaGVyc2VsZiB0aGVyZSBzaG91bGRuJ3QgYmUgYSBwYXJ0bmVyISEhIVxuICAgICAgICBpZih0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLJiZ0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSJiZ0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgIGlmKHBsYXllckluZGV4PT09Y3VycmVudFBsYXllci5faW5kZXgmJmN1cnJlbnRQbGF5ZXIucGFydG5lcj49MCl0ZWFtTmFtZSs9XCI/XCI7XG4gICAgICAgICAgICBpZihrbm93blBhcnRuZXJJbmRleD49MCl0ZWFtTmFtZSs9XCImP1wiOyAvLyBzb21lIGVycm9yIGFwcGFyZW50bHkhISEhIVxuICAgICAgICAgICAgcmV0dXJuIHRlYW1OYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRlYW1OYW1lKz1cIiBcIjsgLy8gd2UnbGwgaGF2ZSBwYXJ0bmVyIGluZm9ybWF0aW9uIGJlaGluZFxuICAgICAgICBpZihwbGF5ZXJJbmRleD09PXRoaXMuX3BsYXllckluZGV4KXtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFydG5lckluZGV4PWN1cnJlbnRQbGF5ZXIucGFydG5lcjsgLy8gdGhlIHBsYXllciB0aGF0IGhhcyB0aGUgcmVxdWVzdGVkIHBhcnRuZXIgY2FyZCBrbm93cyBoaXMgcGFydG5lci4uLlxuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgcGFydG5lciBpbmRleCBpcyBrbm93biBidXQgdGhlIGtub3duUGFydG5lckluZGV4IGlzIG5vdCB3ZSB3cmFwIHRoZSBuYW1lIGluICgpXG4gICAgICAgICAgICBpZihjdXJyZW50UGFydG5lckluZGV4Pj0wJiZrbm93blBhcnRuZXJJbmRleDwwKXRlYW1OYW1lKz1cIiAoXCI7XG4gICAgICAgICAgICB0ZWFtTmFtZSs9XCIgJiBcIjsgLy8gd2UgYXJlIHdpdGggYSBwYXJ0bmVyIChhbHRob3VnaCB3ZSBtaWdodCBub3QgY3VycmVudGx5IGtub3cgd2hvKVxuICAgICAgICAgICAgLy8gdGhlIG9mZmljaWFsIHBhcnRuZXIgKGFzIGtub3duIHRvIHRoZSBjdXJyZW50IHBsYXllcikgaXMgdGhlIG9uZSBmcm9tIGN1cnJlbnRQYXJ0bmVySW5kZXggKGFuZCB3ZSBzaG93IHRoYXQgbmFtZSEpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVycyl0ZWFtTmFtZSs9KGN1cnJlbnRQYXJ0bmVySW5kZXg+PTA/dGhpcy5nZXRQbGF5ZXJOYW1lKGN1cnJlbnRQYXJ0bmVySW5kZXgpOlwiP1wiKTtcbiAgICAgICAgICAgIC8vIGNhbiB3ZSBkZWFsIHdpdGggZXJyb3Igc2l0dWF0aW9ucyBub3c/Pz8/Pz9cbiAgICAgICAgICAgIC8vIHR5cGljYWxseSB0aGlzIHdvdWxkIGJlIHRoZSBjYXNlIGlmIHRoZSBrbm93biBwYXJ0bmVyIGluZGV4IGRpZmZlcnMgZnJvbSB0aGUgcGFydG5lciBpbmRleCByZWdpc3RlcmVkIHdpdGggdGhlIHBsYXllciEhIVxuICAgICAgICAgICAgaWYoa25vd25QYXJ0bmVySW5kZXg+PTAmJmN1cnJlbnRQYXJ0bmVySW5kZXghPT1rbm93blBhcnRuZXJJbmRleClcbiAgICAgICAgICAgICAgICB0ZWFtTmFtZSs9XCI/XCIrKGtub3duUGFydG5lckluZGV4Pj0wP3RoaXMuZ2V0UGxheWVyTmFtZShrbm93blBhcnRuZXJJbmRleCk6XCJcIik7XG4gICAgICAgICAgICBpZihjdXJyZW50UGFydG5lckluZGV4Pj0wJiZrbm93blBhcnRuZXJJbmRleDwwKXRlYW1OYW1lKz1cIilcIjsgICAgXG4gICAgICAgIH1lbHNlIC8vIG5hbWUgb2YgYW5vdGhlciBwbGF5ZXIncyBwYXJ0bmVyIGJlaW5nIGFza2VkLCBjYW4gb25seSBiZSBhdmFpbGFibGUgdGhyb3VnaCB0aGlzLl9wYXJ0bmVyc1xuICAgICAgICAgICAgdGVhbU5hbWUrPVwiICYgXCIrKGtub3duUGFydG5lckluZGV4Pj0wP3RoaXMuZ2V0UGxheWVyTmFtZShrbm93blBhcnRuZXJJbmRleCk6XCI/XCIpO1xuICAgICAgICByZXR1cm4gdGVhbU5hbWU7XG4gICAgfVxufVxuXG52YXIgcHJlcGFyZWRGb3JQbGF5aW5nPWZhbHNlO1xuXG5mdW5jdGlvbiBwcmVwYXJlRm9yUGxheWluZygpe1xuXG4gICAgcHJlcGFyZWRGb3JQbGF5aW5nPXRydWU7XG5cbiAgICBzZW5kTWVzc2FnZVRleHQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLW1lc3NhZ2UtdGV4dFwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbmQtbWVzc2FnZS1idXR0b25cIikub25jbGljaz1zZW5kTWVzc2FnZUJ1dHRvbkNsaWNrZWQ7XG5cbiAgICAvLyBNREhAMTBKQU4yMDIwOiB3ZSB3YW50IHRvIGtub3cgd2hlbiB0aGUgdXNlciBpcyB0cnlpbmcgdG8gbW92ZSBhd2F5IGZyb20gdGhlIHBhZ2VcbiAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gaG93IGFib3V0IHByb21wdGluZyB0aGUgdXNlcj8/Pz8/XG4gICAgICAgIC8vIGlmKCFjdXJyZW50UGxheWVyfHwhY3VycmVudFBsYXllci5nYW1lKXJldHVybjsgLy8gZG8gbm90IGFzayB0aGUgdXNlciB3aGV0aGVyIHRoZXkgd2FudCB0byBzdGF5IG9yIG5vdCAoYXMgdGhleSBjYW5ub3Qgc3RheSlcbiAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgdmlld2luZyB0aGUgcmVzdWx0cyBwYWdlIHdlIG1heSBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBhY3R1YWxseSBvdmVyXG4gICAgICAgIHJldHVybihjdXJyZW50UGFnZT09PSdwYWdlLXJlc3VsdHMnP1wiQmVkYW5rdCB2b29yIGhldCBzcGVsZW4uIFRvdCBkZSB2b2xnZW5kZSBrZWVyIVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlwiSGV0IHNwZWwgaXMgbm9nIG5pZXQgdGVuIGVpbmRlLiBCbGlqZiBvcCBkZSBwYWdpbmEgb20gdG9jaCB2ZXJkZXIgdGUgc3BlbGVuLlwiKTtcbiAgICB9O1xuICAgIC8vIGlmIHdlIGFjdHVhbGx5IGVuZCB1cCBpbiBsZWF2aW5nIHRoaXMgVVJMLCB3ZSBkZWZpbml0ZWx5IHdhbnQgdG8ga2lsbCB0aGUgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGZvciBnb29kXG4gICAgd2luZG93Lm9ucG9wc3RhdGU9ZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoY3VycmVudFBsYXllciYmY3VycmVudFBsYXllci5nYW1lJiZjdXJyZW50UGxheWVyLmdhbWUuc3RhdGUhPT1QbGF5ZXJHYW1lLkZJTklTSEVEKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HOiBQbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgaGFzIHN0b3BwZWQgcGxheWluZyB0aGUgZ2FtZSBhbnkgZnVydGhlciwgZWZmZWN0aXZlbHkgY2FuY2VsaW5nIGl0LlwiKTtcbiAgICAgICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLmV4aXQoJ0VYSVQnKTsgLy8gaWYgd2UgaGF2ZW4ndCBkb25lIHNvIHlldCEhISFcbiAgICAgICAgc2V0UGxheWVyTmFtZShudWxsLG51bGwpOyAvLyB3aXRob3V0IGNhbGxiYWNrIG5vIHBhZ2Ugc2hvdWxkIGJlIHNob3duIGFueW1vcmUuLi5cbiAgICB9XG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBoaWRlIHRoZSBiaWRkaW5nIGFuZCBwbGF5aW5nIGVsZW1lbnRzXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAvLyByZXBsYWNlZCBieSBiaWQtaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFO1xuICAgIC8vIERPIE5PVCBETyBUSElTIFdJTEwgT1ZFUlJVTEUgUEFSRU5UOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBNREhAMTlKQU4yMDIwOiBcImhpZGRlblwiIGNoYW5nZWQgdG8gXCJ2aXNpYmxlXCIgYXMgd2UgbmV2ZXIgaGlkZSB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgcGxheWVyc1xuICAgIC8vIHJlcGxhY2VkIGJ5IHBsYXktaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gTURIQDE5SkFOMjAyMDogYW5kIHZpY2UgdmVyc2FcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcbiAgICBmb3IobGV0IHN0b3BCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RvcCcpKXN0b3BCdXR0b24ub25jbGljaz1zdG9wUGxheWluZztcbiAgICBcbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWU7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVCaWRkZXJTdWl0ZWNhcmRzQnV0dG9uKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgc3VpdGUgZWxlbWVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIHNob3cgdGhlIHJpZ2h0IHRleHQhISEhXG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPDQ7c3VpdGUrKylcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLlwiK0NhcmQuU1VJVEVfTkFNRVNbc3VpdGVdKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnZhbHVlPUNhcmQuU1VJVEVfQ0hBUkFDVEVSU1tzdWl0ZV07XG4gICAgXG4gICAgLyogTURIQDIySkFOMjAyMDogZXZlbnQgaGFuZGxlciBmb3IgY2xpY2tpbmcgdGhlIG5ldyB0cmljayBidXR0b25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikub25jbGljaz1uZXdUcmlja0J1dHRvbkNsaWNrZWQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICovXG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBjaGVjayBmb3IgYSB1c2VyIG5hbWVcbiAgICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAvLyBNREhAMjRKQU4yMDIwOiBjaGFuZ2VkICdwbGF5ZXInIHRvICdhbHMnISEhIE5PVEUgdGhpcyBpcyBhIGJhY2stZG9vclxuICAgIGxldCBpbml0aWFsUGxheWVyTmFtZT0odXJsUGFyYW1zLmhhcyhcImFsc1wiKT91cmxQYXJhbXMuZ2V0KFwiYWxzXCIpLnRyaW0oKTpudWxsKTtcbiAgICBpZihpbml0aWFsUGxheWVyTmFtZSlzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLChlcnIpPT57fSk7XG5cbn07XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIsZXJyb3JjYWxsYmFjayl7XG4gICAgdmlzaXRlZFBhZ2VzPVtdOyAvLyBmb3JnZXQgdmlzaXRlZCBwYWdlc1xuICAgIGN1cnJlbnRQYWdlPW51bGw7IC8vIGFzY2VydGFpbiB0byBub3QgaGF2ZSBhIHBhZ2UgdG8gc3RvcmVcbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IHBsYXllciAoaWYgYW55KSwgYW5kIGluIGVmZmVjdCB3ZSdsbCBsb29zZSB0aGUgZ2FtZSBhcyB3ZWxsXG4gICAgaWYoY3VycmVudFBsYXllcil7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8obG9jYXRpb24ucHJvdG9jb2wrJy8vJytsb2NhdGlvbi5ob3N0KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKGN1cnJlbnRQbGF5ZXI/XCJSZWNvbm5lY3RlZFwiOlwiQ29ubmVjdGVkXCIpK1wiIHRvIHRoZSBnYW1lIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpeyAvLyBmaXJzdCB0aW1lIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBkbyBOT1Qgc3RhcnQgcGxheWluZyBhIGdhbWUgdW50aWwgd2UgcmVjZWl2ZSB0aGUgcGxheWVyIG5hbWVzISEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9NDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWU9bmV3IFBsYXllckdhbWVQcm94eShjbGllbnRzb2NrZXQpOyAvLyBsZXQncyBjcmVhdGUgdGhlIGdhbWUgdGhhdCBpcyB0byByZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTsgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvcmNhbGxiYWNrPT09J2Z1bmN0aW9uJyllcnJvcmNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIG1ldCBkZSBzcGVsIHNlcnZlciBpcyBoZXJzdGVsZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gTURIQDIzSkFOMjAyMDogcHVzaCB0aGUgcGxheWVyIG5hbWUgdG8gdGhlIHNlcnZlciBhZ2Fpbiwgc28gaXQgY2FuIHJlc2VuZCB3aGF0IG5lZWRzIHNlbmRpbmchISEhXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllciljbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxjdXJyZW50UGxheWVyLm5hbWUsKCk9PntcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkFhbmdlbWVsZCBiaWogZGUgc3BlbCBzZXJ2ZXIhXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgbWV0IGRlIHNwZWwgc2VydmVyIGlzIHZlcmJyb2tlbi5cIik7XG4gICAgICAgICAgICAgICAgKHR5cGVvZiBlcnJvcmNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JjYWxsYmFjayhuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLlwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywoZXJyKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0IGVycm9yOiBcIixlcnIpO1xuICAgICAgICAgICAgc2V0SW5mbyhcIkVyIGlzIGVlbiBwcm9ibGVlbSBtZXQgZGUgdmVyYmluZGluZyBtZXQgZGUgc3BlbCBzZXJ2ZXIgKFwiK2Vyci5tZXNzYWdlK1wiKSFcIik7XG4gICAgICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKGVycikpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdHJ5IHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciBjYXRjaGluZyB3aGF0ZXZlciBoYXBwZW5zIHRocm91Z2ggZXZlbnRzXG4gICAgICAgIGNsaWVudHNvY2tldC5jb25uZWN0KCk7XG4gICAgfWVsc2V7XG4gICAgICAgIGN1cnJlbnRHYW1lPW51bGw7IC8vIGdldCByaWQgb2YgdGhlIGN1cnJlbnQgZ2FtZSAoaWYgYW55KVxuICAgICAgICAodHlwZW9mIGVycm9yY2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvcmNhbGxiYWNrKG51bGwpKTtcbiAgICB9XG59XG5cbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIHRoZSAobmV3KSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllciB3aGVuZXZlciB0aGUgcGxheWVyIHdhbnRzIHRvIHBsYXlcbi8vIGNhbGwgc2V0UGxheWVyTmFtZSB3aXRoIG51bGwgKG9yIGVtcHR5KSBwbGF5ZXIgbmFtZVxuLy8gdG8gbWFrZSBpdCBjYWxsYWJsZSBmcm9tIGFueXdoZXJlIHdlIGF0dGFjaCBzZXRQbGF5ZXJOYW1lIHRvIHdpbmRvdyAoYmVjYXVzZSBjbGllbnQuanMgd2lsbCBiZSBicm93c2VyaWZpZWQhISEpXG5mdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKHBsYXllck5hbWUsZXJyb3JDYWxsYmFjayl7XG4gICAgKHByZXBhcmVkRm9yUGxheWluZ3x8cHJlcGFyZUZvclBsYXlpbmcoKSk7IC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgb25jZVxuICAgIC8vIGlmKGVycm9yQ2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIGFzY2VydGFpbiB0byBub3QgYmUgaW4gYSBub24tcGxheWVyIHBhZ2VcbiAgICAvLyBwbGF5ZXJOYW1lIG5lZWRzIHRvIGJlIGEgc3RyaW5nIChpZiBpdCBpcyBkZWZpbmVkKVxuICAgIGlmKHBsYXllck5hbWUmJiEodHlwZW9mIHBsYXllck5hbWU9PT1cInN0cmluZ1wiKSlcbiAgICAgICAgcmV0dXJuKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYXllciBuYW1lLlwiKSkpO1xuICAgIC8vIGlmIHBsYXllck5hbWUgbWF0Y2hlcyB0aGUgY3VycmVudCBwbGF5ZXIncyBuYW1lLCBub3RoaW5nIHRvIGRvXG4gICAgaWYocGxheWVyTmFtZSYmY3VycmVudFBsYXllciYmY3VycmVudFBsYXllci5uYW1lPT09cGxheWVyTmFtZSlcbiAgICAgICAgKHR5cGVvZiBlcnJvckNhbGxiYWNrIT09J2Z1bmN0aW9uJ3x8ZXJyb3JDYWxsYmFjayhudWxsKSk7XG4gICAgZWxzZVxuICAgICAgICBfc2V0UGxheWVyKHBsYXllck5hbWUmJnBsYXllck5hbWUubGVuZ3RoPjA/bmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lKTpudWxsLGVycm9yQ2FsbGJhY2spO1xufVxuXG53aW5kb3cub25sb2FkPXByZXBhcmVGb3JQbGF5aW5nO1xuXG4vLyBleHBvcnQgdGhlIHR3byBmdW5jdGlvbiB0aGF0IHdlIGFsbG93IHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBvdXRzaWRlISEhXG5tb2R1bGUuZXhwb3J0cz1zZXRQbGF5ZXJOYW1lOyJdfQ==
