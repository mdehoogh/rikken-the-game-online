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
       let suites=[-1,-1,-1,-1]; // MDH@05FEB2020: will return -1: player doesn't have card, 0=player has rank, 1 does NOT have rank
       this._cards.forEach((card)=>{
            // because the following can only happen once (for each suite), we can safely assume that the suite is there!!!!
            if(suites[card.suite]<0)suites[card.suite]=1; // the suite is there
            if(card.rank===rank)suites[card.suite]=0; // we found the card in card.suite with the rank passed in!!!
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

function getNumberOfTricksWonText(count){
    if(count===-2)return "?";
    if(count<0)return "onbekend";
    if(count>13)return "onmogelijk";
    return ["geen","een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien","elf","twaalf","allemaal"](count);
}

function bug(bug){
    alert("Ernstige programmafout: "+bug+".\nRapporteer deze fout, en breek het spel af.");
}

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
    if(!currentPlayer)return alert("Je bent al afgemeld!");
    currentPlayer.exit('STOP');
    // 'manually' move to the previous 'page' in the history...
    console.log("Length of history: ",window.history.length);
    window.history.go(window.history.length>0?-1:0);
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

var toMakeABid=0,bidMadeInfo=null; // MDH@03FEB2020: some protection for preventing making a bid when not being asked or after having made a bid
var toPlayACard=0,playedCardInfo=null; // MDH@05FEB2020: the card played that needs to be remembered so we can send it again

function getLocaleCardText(card){return Language.DUTCH_SUITE_NAMES[card.suite]+" "+Language.DUTCH_RANK_NAMES[card.rank];}

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
        // don't send any text if sending the default text
        let textToSend=(sendMessageText.value!==playerStateMessages[currentPlayerState]?sendMessageText.value:'');
        // if no text entered to be sent, ask player whether
        if(textToSend.trim().length===0&&!prompt("Er is geen te versturen tekst. Wilt U toch versturen?"))return;
        setInfo("?","Jij");
        currentGame._socket.emit('PLAYER_SAYS',{'state':currentPlayerState,'text':textToSend},(response)=>{
            setInfo(response&&response.length>0?response:"Bericht ontvangen, maar geen antwoord gestuurd.","Server");
            // if the message text differed from the default message we clear the message text
            if(sendMessageText.value!==playerStateMessages[currentPlayerState])sendMessageText.value='';
        });
    }
}
function setPlayerState(playerState){
    //if(resendEventId){clearTimeout(resendEventId);resendEventId=null;} // get rid of any pending resend event timeout
    let replaceMessageText=(sendMessageText.value.length===0||sendMessageText.value===playerStateMessages[currentPlayerState]); // user hasn't changed the text to send manually...
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

function handleCollapsingEvent(event){
    let collapsingButton=event.currentTarget;
    collapsingButton.classList.toggle("active-button"); // a ha, didn't know this
    document.getElementById(collapsingButton.getAttribute("data-collapsible")).style.display=(this.classList.contains("active-button")?"block":"none");
}
function initializeCollapsingButtons(){
    // MDH@05FEB2020: attach event handler on click of every collapsible button toggling
    for(let collapsingButton of document.getElementsByClassName("collapsing-button"))collapsingButton.addEventListener("click",handleCollapsingEvent);
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
    // show the player names in the bids table
    showPlayerNamesInBidsTable();
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
function clearBidsTable(firstColumnIndex){
    let bidTable=document.getElementById("bids-table").querySelector("tbody");
    for(let bidTableRow of bidTable.children)
        for(let bidTableColumnIndex in bidTableRow.children)
            if(bidTableColumnIndex>=firstColum)
                bidTableRow.children[bidTableColumnIndex].innerHTML="";
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
    try{
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
    }finally{
        updatePlayableCardButtonClickHandlers(true); // whenever the suite cards showing change we make them clickable
    }
}

function updatePlayerResultsTable(){
    let rikkenTheGame=currentPlayer.game;if(!rikkenTheGame)throw new Error("No game being played!"); // MDH@03JAN2020: rikkenTheGame should now point to the _game property of the current player
    let deltaPoints=rikkenTheGame.deltaPoints;
    let points=rikkenTheGame.points;
    if(!deltaPoints||!points){console.log("ERROR: Results now known yet!");return;}
    for(let playerResultsRow of document.getElementById("player-results-table").querySelector("tbody").getElementsByTagName("tr")){
        let playerIndex=parseInt(playerResultsRow.getAttribute("data-player-index"));
        playerResultsRow.children[0].innerHTML=rikkenTheGame.getPlayerName(playerIndex);
        playerResultsRow.children[1].innerHTML=(deltaPoints?String(rikkenTheGame.getNumberOfTricksWonByPlayer(playerIndex)):"-");
        playerResultsRow.children[2].innerHTML=(deltaPoints?String(deltaPoints[playerIndex]):"-");
        playerResultsRow.children[3].innerHTML=String(points[playerIndex]);
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
    for(let playerNameInputElement of document.getElementsByClassName("player-name-input")){
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
        return(this._index&&this._game?this._game.getNumberOfTricksWonByPlayer(this._index):-2);
    }

    // to set the partner once the partner suite/rank card is in the trick!!!!

    // a (remote) client needs to override all its actions
    // BUT we do not do that because all results go into PlayerGameProxy which will send the along!!!!

    // make a bid is called with 
    makeABid(playerBidsObjects,possibleBids){
        // request of game engine (server) to make a bid
        toMakeABid++;
        if(toMakeABid===1){ // first time request for the bid
            forceFocus(this.name);
            // ascertain to be looking at the bidding page (in which case we can safely use VISIBLE)
            if(currentPage!="page-bidding")setPage("page-bidding"); 
            // removed: document.getElementById("wait-for-bid").style.visibility="hidden"; // show the bidding element
            // MDH@03FEB2020: inherit is safer because if this happens by accident (when not on the bidding page)
            document.getElementById("bidding").style.visibility=VISIBLE; // show the bidding element, essential to hide it immediately after a bid
            // currentPlayer=this; // remember the current player
            setInfo("Doe een bod.","Server");
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
        }else // not the first time a bid was requested
        if(bidMadeInfo){
            let error=(currentPlayer?currentPlayer._setBid(bidMadeInfo):new Error(bug("Je bent geen speler meer!")));
            if(error instanceof Error)
                setInfo("Nog steeds problemen bij het versturen van je bod. We blijven het proberen.","Speler");
            else
                setInfo("Je bod is nogmaals verstuurd. Hopelijk hebben we nu meer geluk!","Speler");
        }else
            setInfo("Er wordt op je bod gewacht!","Server");
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
        // MDH@05FEB2020: this is a request from the server to play a card which could be a request to replay a card (that wasn't received somehow)
        //                instead of using we a flag we keep track of the request count, we toggle the sign to indicate that a choice was already made
        // error handling first TODO these errors indicate bugs and therefore are inrecoverable!!!!
        let trick=(this.game?this.game._trick:null);
        if(!trick)return bug("De slag ontbreekt!");
        if(trick.numberOfCards>0&&trick.playSuite<0)return bug("De te spelen kleur is onbekend!");
        toPlayACard++;
        if(toPlayACard===1){ // first request, no card was played so far
            playedCardInfo=null; // initialize cardPlayed to null
            forceFocus(this.name);
            /* replacing:
            document.getElementById("wait-for-play").style.visibility="hidden"; // hide the wait-for-play element
            document.getElementById("playing").style.visibility=VISIBLE; // show the play element
            */
            // MDH@19JAN2020: allow the current player to play a card by clicking one
            // MDH@05FEB2020 removing because we're keeping all cards clickable and stop them programmatically from doing harm: updatePlayableCardButtonClickHandlers(true); // ready to rock 'n' roll
            // MDH@05FEB2020 overkill: setInfo("Speel een "+(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+".");
            // if this is a new trick update the tricks played table with the previous trick
            // if(trick.numberOfCards==0)updateTricksPlayedTables();
            /* see showTrick()
            document.getElementById("can-ask-for-partner-card-blind").style.display=(trick.canAskForPartnerCardBlind?"block":"none");
            // always start unchecked...
            document.getElementById("ask-for-partner-card-blind").checked=false; // when clicked should generate 
            */
            // MDH@20JAN2020 moved over to where GAME_INFO event is received!!!!: document.getElementById("game-info").innerHTML=getGameInfo(); // update the game info (player specific)
            // obsolete: document.getElementById("card-player").innerHTML=this.name;
            document.getElementById("play-card-prompt").innerHTML=(trick.playSuite>=0?"Speel een "+Language.DUTCH_SUITE_NAMES[trick.playSuite].toLowerCase()+" bij.":"Kom maar uit!");
            let numberOfTricksWon=this.getNumberOfTricksWon(); // also includes those won by the partner (automatically)
            // add the tricks won by the partner
            let partnerName=this._game.getPartnerName(this._index);
            // if(partner)numberOfTricksWon+=player.getNumberOfTricksWon();
            document.getElementById("tricks-won-so-far").innerHTML=getNumberOfTricksWonText(numberOfTricksWon)+(partnerName?" (samen met "+partnerName+")":"");
            // show the number of tricks this player is supposed to win in total
            document.getElementById("tricks-to-win").innerHTML=getNumberOfTricksToWinText(this._numberOfTricksToWin,partnerName,this._game.getHighestBid());
            this._card=null; // get rid of any currently card
            console.log("ONLINE >>> Player '"+this.name+"' should play a card!");
            // setInfo("Welke "+(trick.playSuite>=0?Language.DUTCH_SUITE_NAMES[trick.playSuite]:"kaart")+" wil je "+(trick.numberOfCards>0?"bij":"")+"spelen?");
            updatePlayerSuiteCards(this._suiteCards=this._getSuiteCards()); // remember the suite cards!!!!
            // show the trick (remembered in the process for use in cardPlayed below) from the viewpoint of the current player
            ///// showTrick(this._trick=trick); // MDH@11JAN2020: no need to pass the player index (as it is always the same)
        }else
        if(playedCardInfo){ // a card has been choosen by this player to play but apparently has not been received yet
            // send the card played again
            let error=this._setCard(...playedCardInfo);
            if(error instanceof Error){
                setInfo("Versturen van de gespeelde kaart ("+getLocaleCardText(playableCardInfo[0])+") mislukt! Fout: "+error.message+".","Speler");
                console.log("ERROR: ",error);
            }else{
                setInfo(capitalize(getLocaleCardText(playableCardInfo[0]))+" opnieuw verstuurd!","Speler");
                console.log("Card played send again.");
            }
        }else
            setInfo("We wachten op je kaart!","Server");
    }

    // _cardPlayedWithSuiteAndIndex replaced by _getCardWithSuiteAndIndex() combined with _cardPlayed

    _getCardWithSuiteAndIndex(suite,index){return(suite<this._suiteCards.length&&this._suiteCards[suite].length?this._suiteCards[suite][index]:null);}
    // not to be confused with _cardPlayed() defined in the base class Player which informs the game
    // NOTE cardPlayed is a good point for checking the validity of the card played
    // NOTE can't use _cardPlayed (see Player superclass)
    // MDH@20JAN2020: deciding to return true on acceptance, false otherwise
    _newCardPlayed(card){
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
                        if(card.suite===this._game.getPartnerSuite()){
                            askingForPartnerCard=1;
                            ////alert("\tNON_BLIND");
                        }
                    }else
                    if(trick.canAskForPartnerCard<0){ // could be blind
                        // if the checkbox is still set i.e. the user didn't uncheck it
                        // he will be asking for the 
                        // MDH@14JAN2020 BUG FIX: was using ask-partner-card-blind instead of ask-partner-card-checkbox!!!
                        if(document.getElementById("ask-partner-card-checkbox").checked&&
                            (card.suite!==this._game.getTrumpSuite()||confirm("Wilt U de "+Language.DUTCH_SUITE_NAMES[this._game.getPartnerSuite()]+" "+Language.DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" (blind) vragen met een troef?"))){
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
                if(card.suite!==trick.playSuite&&this.getNumberOfCardsWithSuite(trick.playSuite)>0)
                    return new Error("Je kunt "+getLocaleCardText(card)+" niet spelen, want "+Language.DUTCH_SUITE_NAMES[trick.playSuite]+" is gevraagd.");
                // when being asked for the partner card that would be the card to play!
                if(trick.askingForPartnerCard!=0){
                    let partnerSuite=this._game.getPartnerSuite(),partnerRank=this._game.getPartnerRank();
                    if(this.containsCard(partnerSuite,partnerRank)){
                        if(card.suite!==partnerSuite||card.rank!==partnerRank)
                            return new Error("Je kunt "+getLocaleCardText(card)+" niet spelen, want de "+Language.DUTCH_SUITE_NAMES[partnerSuite]+" "+Language.DUTCH_RANK_NAMES[partnerRank]+" is gevraagd.");
                    }
                }
            }
            // MDH@05FEB2020: at this point the card played was accepted (theoretically), it only needs to be sent successfully to the server, and returned as played card
            playedCardInfo=[card,askingForPartnerCard]; // by remembering the card being played here and now we block further attempts for a player to change the card (s)he played
            // MDH@14JAN2020: we have to also return whatever trick value that might've changed
            //                which in this case could wel be the asking for partner card 'flag'
            // MDH@27JAN2020: I suggest changing askingForPartnerCard to askingForPartnerCard<0 i.e. blind request!!!
            //                we're taking care of that when CARD is sent (so not to interfere with RikkenTheGame.js itself)
            return this._setCard(card,askingForPartnerCard);
            /* MDH@27JAN2020: removing the following might be wrong BUT by passing askingForPartnerCard to the server
                              all players including myself will receive the card played and update askingForPartnerCard
                              accordingly, basically addCard() will set it to 1 if it so detects, but cannot set it to -1
                              so technically askingForPartnerCard only needs to be send when the partner card is asked blind
            if(error)return new Error("Er is een fout opgetreden bij het versturen van de gespeelde kaart.");
            trick.askingForPartnerCard=askingForPartnerCard;
            return null;
            */
        }
        return new Error("Geen kaart gespeeld!");
    }
    _cardPlayedWithSuiteAndIndex(suite,index){bug("Deze methode mag niet meer worden aangeroepen.");}

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
                    setInfo("De overgebleven kaarten in je hand worden verwijderd!","Spel");
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
    if(toMakeABid<=0)return alert("Je mag nu niet bieden! Het wachten is op een seintje van de server.");
    if(bidMadeInfo)return alert("Je hebt al een bod uitgebracht!");
    try{
        let bid=parseInt(event.currentTarget.getAttribute("data-bid"));
        if(isNaN(bid)||bid<0)return alert(bug("Ongeldig bod ("+(bid?bid:"?")+")!"));
        bidMadeInfo=bid; // remember the bid in case we need to send it again
        // document.getElementById("bidding").style.visibility="hidden"; // hide the bidding element
        console.log("Bid chosen (to be sent for the first time): ",bidMadeInfo);
        let error=currentPlayer._setBid(bidMadeInfo); // the value of the button is the made bid
        if(error instanceof Error)
            setInfo("Problemen bij het versturen van je bod: "+error.message+". We blijven het proberen.","Spel");
        else // bid done!!!
            setInfo("Bod verstuurd!","Spel");
    }finally{
        document.getElementById("bidding").style.visibility=(bidMadeInfo?"hidden":VISIBLE); // show again
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
    
    // MDH@05FEB2020: prevent from playing a card when a card has already been played (and not yet confirmed by the server)
    if(toPlayACard<=0)return alert("Je mag nu geen kaart spelen! Het wachten is op een seintje van de server.");
    
    if(playedCardInfo)return alert("Je hebt al een kaart ("+getLocaleCardText(playedCardInfo[0])+") gespeeld.");

    playablecardCell=(event&&event.currentTarget); // remember the 'cell' of the card clicked!!!!
    if(!playablecardCell)return; // TODO should we respond here????

    let cardSuite=parseInt(playablecardCell.getAttribute("data-suite-id"));
    let cardRank=parseInt(playablecardCell.getAttribute("data-suite-index"));
    if(cardSuite<Card.SUITE_DIAMOND||cardSuite>Card.SUITE_SPADE||cardRank<Card.RANK_TWO||cardRank>Card.RANK_ACE)return;

    ////////if(playablecardCell.style.border="0px")return; // empty 'unclickable' cell
    // MDH@05FEB2020: replacing the original call to _cardPlayedWithSuiteAndIndex() with the calls to the OnlinePlayer() methods replacing the single call so we know the card played!!
    let cardPlayed=currentPlayer._getCardWithSuiteAndIndex(cardSuite,cardRank);
    let error=currentPlayer._newCardPlayed(cardPlayed); 
    if(playedCardInfo){ // MDH@05FEB2020 replacing: !(error instanceof Error)){ // card accepted!!!
        forceFocus(null); // no need to prompt the user anymore, (s)he only needs to wait for the card to be arrived by the server
        /* MDH@05FEB2020: NOT to remove the card from showing until it was confirmed by the server to have been played, we only need to prevent playing another card!!!
        playablecardCellContents=playablecardCell.innerHTML; // in case sending the card fails
        playablecardCell.innerHTML="";
        updatePlayableCardButtonClickHandlers(false); // disable the card buttons
        */
        document.getElementById("play-card-prompt").innerHTML="Je hebt "+getLocaleCardText(playedCardInfo[0])+" gespeeld."; // MDH@23JAN2020: get rid of the play card prompt!
    }else // report the error to the end user
        document.getElementById("play-card-prompt").innerHTML="Je mag "+getLocaleCardText(cardPlayed)+" niet spelen. Speel een andere kaart!";
}
/**
 * convenient to be able to turn the playable card buttons on and off at the right moment
 * @param {enable} enable 
 */
function updatePlayableCardButtonClickHandlers(enable){
    // clicking card 'buttons' (now cells in table), we can get rid of the button itself!!!
    // MDH@05FEB2020: additional check: if a cell is empty do not erroneously make it clickable!!!!
    for(let playablecardButton of document.querySelectorAll(".playable.card-text"))
        playablecardButton.onclick=(enable&&playablecardButton.innerHTML.length>0?playablecardButtonClicked:null);
}

// in order to not have to use RikkenTheGame itself (that controls playing the game itself)
// and which defines RikkenTheGameEventListener we can simply define stateChanged(fromstate,tostate)
// and always call it from the game 
function _gameStateChanged(fromstate,tostate){
    console.log("GAMEPLAYING >>> Toestand verandert van "+fromstate+" naar "+tostate+".");
    switch(tostate){
        case PlayerGame.IDLE:
            setInfo("Een spel is aangemaakt.","Server");
            break;
        case PlayerGame.DEALING:
            setInfo("De kaarten worden geschud en gedeeld.","Server");
            break;
        case PlayerGame.BIDDING:
            // when moving from the DEALING state to the BIDDING state clear the bid table
            // ALTERNATIVELY this could be done when the game ends
            // BUT this is a bit safer!!!
            setInfo("Het bieden is begonnen!","Server");
            /* if(fromstate===PlayerGame.DEALING)*/
            clearBidsTable(1);
            ////// let's wait until a bid is requested!!!! 
            // MDH@09JAN2020: NO, we want to indicate that the bidding is going on
            setPage("page-bidding");
            break;
        case PlayerGame.PLAYING:
            setInfo("Het spelen kan beginnen!","Server");
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
            setInfo("Het spel is afgelopen!","Server");
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
                            setInfo("Vul de namen van de spelers in. Een spelernaam is voldoende.","Spel");
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
        setInfo("Geen spelernamen opgegeven. Heb tenminste een spelernaam nodig!","Spel");
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
                            (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!","Server");
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
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!","Spel");return false;}
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
        // replacing: if(askingForPartnerCard<0)cardPlayedInfo.push(true); // set the asking for partner card blind flag!!!
        let cardSentResult=
            this._setEventToSend('CARD',[card.suite,card.rank,askingForPartnerCard],function(result){
                if(result)
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart niet geaccepteerd"+
                                (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!";
                else// card played accepted!!!
                    document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart geaccepteerd.";
            });
        // this is only the result of the call to _setEventToSend (synchronous), and obviously we put back the card
        if(!cardSentResult){
            alert("Kaart niet verstuurd?");
            // document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart niet geaccepteerd"+
            // (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!";
            if(playablecardCell)
                setInfo("Versturen van de gespeelde kaart mislukt! Probeer het zo nog eens.");
            else
                setInfo("Er is iets misgegaan. Probeer het zo nog eens.");
        }else{
            document.getElementById("play-card-prompt").innerHTML="Gespeelde kaart verstuurd.";
            setPlayerState(PLAYERSTATE_CARD_PLAYED);
        }
        return cardSentResult;
    }
    trumpSuiteChosen(trumpSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!","Spel");return false;}
        document.getElementById("trump-suite-input").style.visibility="hidden";
        let trumpSuiteChosenSentResult=this._setEventToSend('TRUMPSUITE',trumpSuite,function(result){
                if(result){
                    setInfo("Gekozen troefkleur niet geaccepteerd"+
                                (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!","Server");
                    // TODO what to do now?
                }else
                    setInfo("Gekozen troefkleur geaccepteerd.","Server");
            });
        if(trumpSuiteChosenSentResult)setPlayerState(PLAYERSTATE_TRUMP_DONE);
        return trumpSuiteChosenSentResult;
    }
    partnerSuiteChosen(partnerSuite){
        if(this._state===PlayerGame.OUT_OF_ORDER){setInfo("Het spel kan niet verder gespeeld worden!","Spel");return false;}
        document.getElementById("partner-suite-input").style.visibility="hidden";
        let partnerSuiteChosenSentResult=this._setEventToSend('PARTNERSUITE',partnerSuite,function(result){
                if(result){
                    setInfo("Gekozen partner kleur niet geaccepteerd!"+
                    (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!","Server");
                    // TODO what to do now?
                }else
                    setInfo("Gekozen partner kleur geaccepteerd!","Server");
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
            setInfo("Zodra er weer vier niet-spelende deelnemers zijn kun je weer spelen.","Server");
        });
    }
    exit(reason){
        // player is exiting somehow...
        let data=(reason?reason:(currentPlayer?currentPlayer.name:""));
        return this._setEventToSend('EXIT',data,function(){
            console.log("EXIT event "+data+" acknowledged!");
            // we're NOT going anywhere anymore: setPage("page-rules");
            setInfo("Bedankt voor het spelen.","Server");
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
        let numberOfTricksWonByPlayer=-1;
        if(playerIndex>=0||playerIndex<this._numberOfTricksWon.length){
            numberOfTricksWonByPlayer=this._numberOfTricksWon[playerIndex];
            // we don't have no players and should get the partner ids from the server itself
            let partnerIndex=(this._partners&&playerIndex<this._partners.length?this._partners[playerIndex]:-1);
            if(partnerIndex>=0&&partnerIndex<this._numberOfTricksWon.length)numberOfTricksWonByPlayer+=this._numberOfTricksWon[partnerIndex];
        }/*else
            alert("Ongeldige speler index "+playerIndex+".");*/
        return numberOfTricksWonByPlayer;
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
        
        // MDH@05FEB2020: if this is the card I actually just played I have to do some more!!!!
        if(playedCardInfo){
            let playedCard=playedCardInfo[0];
            toPlayACard=0; // done playing a card
            playedCardInfo=null; // remove playedCardInfo until the next card to play is being asked
            if(playablecardCell){playablecardCell.innerHTML="";playablecardCell=null;} // get rid of the card that was played, sent and accepted
            // it's a serious bug when the card played by me is not returned as played!!!!
            if(playedCard.suite!=cardInfo.suite||playedCard.rank!=cardInfo.rank)
                bug("Gespeelde kaart niet gelijk aan geregistreerde kaart!");
        }

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
        if(error instanceof Error)return bug(error); // which would be a serious bug????????

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
        setInfo(capitalize(Language.DUTCH_SUITE_NAMES[cardInfo.suite])+" "+Language.DUTCH_RANK_NAMES[cardInfo.rank]+" gespeeld.","Spel");
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
                setInfo(data,"Server");
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
                    setInfo("We wachten op het bod van "+data+".","Server");
                }else
                    setInfo("U wordt zo om een bod gevraagd.","Server");
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
                if(toMakeABid>0){ // it's our bid!!!!
                    toMakeABid=0;bidMadeInfo=null;
                    document.getElementById("bidding").style.visibility="hidden";
                }
                setPlayerState(PLAYERSTATE_BID_RECEIVED);
                document.getElementById("bid-info").innerHTML=getBidInfo(data.bid,data.player===currentPlayer.index?null:this.getPlayerName(data.player));
                // assuming to receive in data both the player and the bid
                document.getElementById("bid-info").innerHTML=getBidInfo(data.bid,data.player===currentPlayer.index?null:this.getPlayerName(data.player));
                this._playersBids[data.player].push(data.bid);
                // TODO how to show the bids?????
                updateBidsTable(this._getPlayerBidsObjects());
                // MDH@03FEB2020: fail-safe BUT this should be done another way TODO
                setInfo("Bod van "+this.getPlayerName(data.player)+": "+PlayerGame.BID_NAMES[data.bid]+".","Server");
                break;
            case "TO_PLAY":
                if(currentPlayer.name!==data){
                    setPlayerState(PLAYERSTATE_WAIT_FOR_CARD);
                    setInfo("We wachten op de kaart van "+data+".","Server");
                }else
                    setInfo("U wordt zo om een kaart gevraagd!","Server");
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
                // MDH@05FEB2020: this is a bit of a nuisance, since we use the toPlayACard flag in playACard, but we need it here so not to do the extra work
                if(toPlayACard<=0){ // first time request
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
                }
                currentPlayer.playACard();
                break;
            case "CHOOSE_TRUMP_SUITE":
                currentPlayer.chooseTrumpSuite(data);
                break;
            case "TRUMP_SUITE_CHOSEN":
                setPlayerState(PLAYERSTATE_TRUMP_RECEIVED);
                setInfo(capitalize(Language.DUTCH_SUITE_NAMES[data])+" gekozen als troef.","Server");
                break;
            case "CHOOSE_PARTNER_SUITE":
                currentPlayer.choosePartnerSuite(data.suites,data.partnerRankName);
                break;
            case "PARTNER_SUITE_CHOSEN":
                setPlayerState(PLAYERSTATE_PARTNER_RECEIVED);
                setInfo(capitalize(Language.DUTCH_SUITE_NAMES[data.suite])+" "+Language.DUTCH_RANK_NAMES[data.rank]+" meegevraagd.","Server");
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
                setInfo("Verbinding met de server (tijdelijk) verbroken!","Server"); // replacing: this.state=PlayerGame.OUT_OF_ORDER;
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
    initializeCollapsingButtons();
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
                    setInfo("De verbinding is hersteld.","Server");
                // MDH@23JAN2020: push the player name to the server again, so it can resend what needs sending!!!!
                if(currentPlayer)clientsocket.emit('PLAYER',currentPlayer.name,()=>{
                    setInfo("Je bent als speler aangemeld!","Server");
                });
            }else{
                setInfo("De verbinding is verbroken.","Server");
                (typeof errorcallback!=='function'||errorcallback(new Error("Failed to connect to the server.")));
            }
        });
        clientsocket.on('connect_error',(err)=>{
            console.log("Connect error: ",err);
            setInfo("Er is een probleem met de verbinding ("+err.message+")!","Server");
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTIuMTMuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9DYXJkLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmRIb2xkZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvTGFuZ3VhZ2UuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvUGxheWVyLmpzIiwicHVibGljL2phdmFzY3JpcHRzL1RyaWNrLmpzIiwicHVibGljL2phdmFzY3JpcHRzL2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogZGVmaW5pdGlvbiBvZiBhIHBsYXlpbmcgQ2FyZFxuICovXG5jbGFzcyBDYXJke1xuXG4gICAgc3RhdGljIGdldCBTVUlURV9OQU1FUygpe3JldHVybiBbXCJkaWFtb25kXCIsXCJjbHViXCIsXCJoZWFydFwiLFwic3BhZGVcIl07fVxuICAgIHN0YXRpYyBnZXQgUkFOS19OQU1FUygpe3JldHVybiBbXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCIxMFwiLFwiamFja1wiLFwicXVlZW5cIixcImtpbmdcIixcImFjZVwiXTt9XG4gICAgLy8gc2hvcnRoYW5kICdjaGFyYWN0ZXJzJyBmb3IgdGV4dHVhbCByZXByZXNlbnRhdGlvblxuICAgIC8vIE5PVCBXT1JLSU5HOiBjb25zdCBDQVJEX1NVSVRFX0NIQVJBQ1RFUlM9W1N0cmluZy5mcm9tQ2hhckNvZGUoMjY2NiksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYzKSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjUpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MCldO1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0hBUkFDVEVSUygpe3JldHVybiBbJ1xcdTI2NjYnLCdcXHUyNjYzJywnXFx1MjY2NScsJ1xcdTI2NjAnXX07IC8vIFlFUywgV09SS0lORyEhISEhXG4gICAgc3RhdGljIGdldCBTVUlURV9ESUFNT05EKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NMVUIoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfSEVBUlQoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfU1BBREUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19DSEFSQUNURVJTKCl7cmV0dXJuIFsnMicsJzMnLCc0JywnNScsJzYnLCc3JywnOCcsJzknLCcxMCcsJ0InLCdWJywnSycsJ0EnXTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19UV08oKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19USFJFRSgpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZPVVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GSVZFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0lYKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfU0VWRU4oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19FSUdIVCgpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBSQU5LX05JTkUoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19URU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19KQUNLKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfUVVFRU4oKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfS0lORygpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19BQ0UoKXtyZXR1cm4gMTI7fTtcblxuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHMoY2FyZDEsY2FyZDIpe1xuICAgICAgICBsZXQgZGVsdGFTdWl0ZT1jYXJkMS5fY2FyZFN1aXRlSW5kZXgtY2FyZDIuX2NhcmRTdWl0ZUluZGV4O1xuICAgICAgICBpZihkZWx0YVN1aXRlIT0wKXJldHVybiBkZWx0YVN1aXRlO1xuICAgICAgICByZXR1cm4gY2FyZDEuX2NhcmROYW1lSW5kZXgtY2FyZDIuX2NhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIFxuICAgIC8vIGluIGEgdHJpY2sgdGhlIHBsYXkgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IGNhcmRzIGFyZSB0byBiZSBwbGF5ZWQsIHRoZSB0cnVtcCBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgdHJ1bXAgaXNcbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQxLGNhcmQyLHBsYXlTdWl0ZSx0cnVtcFN1aXRlKXtcbiAgICAgICAgLy8gbm9ybWFsbHkgd2l0aCBhbnkgdHdvIHJlZ3VsYXIgY2FyZHMgdGhleSBhcmUgbmV2ZXIgZXF1YWwgaW4gYSB0cmlja1xuICAgICAgICAvLyBjYXJkcyB0aGF0IGFyZSBuZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUgaXMgaXJyZWxldmFudFxuICAgICAgICBsZXQgcmVzdWx0PTA7XG4gICAgICAgIGxldCB0eXBlPSctJztcbiAgICAgICAgLy8gMS4gaWYgY2FyZDEgaXMgdHJ1bXAsIGFuZCBjYXJkMiBpcyBub3Qgb3IgaGFzIGEgbG93ZXIgcmFuayBjYXJkMSB3aW5zXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT10cnVtcFN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdBJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgTk9UIHRydW1wIGJ1dCBjYXJkMiBjb3VsZCBzdGlsbCBiZSB0cnVtcFxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0InO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgdHJ1bXAsIHNvIGNvdWxkIGJlIHBsYXkgc3VpdGUgb3Igbm90Li4uXG4gICAgICAgIGlmKGNhcmQxLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQyc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIG5vdCBwbGF5IHN1aXRlLCBidXQgY2FyZDIgY291bGQgYmVcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PS0xO3R5cGU9J0QnO31cbiAgICAgICAgY29uc29sZS5sb2coJz4+PiBUeXBlOiAnK3R5cGUrJzogJytjYXJkMS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIihzdWl0ZTogXCIrY2FyZDEuc3VpdGUrXCIpXCIrKHJlc3VsdD4wPycgPiAnOihyZXN1bHQ8MD8nIDwgJzonID0gJykpK2NhcmQyLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChzdWl0ZTogXCIrY2FyZDIuc3VpdGUrXCIpXCIrXCIgKHBsYXk6IFwiKyhwbGF5U3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1twbGF5U3VpdGVdOlwiP1wiKStcIiwgdHJ1bXA6XCIrKCh0cnVtcFN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV06XCI/XCIpKStcIilcIik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgLy8gbGV0J3MgZmlyc3QgcmVjb21wdXRlIHRoZSBzdWl0ZSBvZiBib3RoIGNhcmRzIGFuZCBlbGV2YXRlIHRydW1wIGNhcmRzLCBhbmQgZGVldmFsdWF0ZSBub24gcGxheVN1aXRlIGNhcmRzXG4gICAgICAgIGxldCBjYXJkMVN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMS5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQxLnN1aXRlKSk7XG4gICAgICAgIGxldCBjYXJkMlN1aXRlPShjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZT80OihjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPy0xOmNhcmQyLnN1aXRlKSk7XG4gICAgICAgIGlmKGNhcmQxU3VpdGU+PTB8fGNhcmQyU3VpdGU+PTApeyAvLyBhdCBsZWFzdCBvbmUgb2YgdGhlIGNhcmRzIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzdWl0ZXMgYXJlIHRoZSBzYW1lIHRoZSBoaWdoZXN0IHJhbmsgd2luc1xuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZTwwKXJldHVybiAtMTsgLy8gaWYgdGhlIGZpcnN0IGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgbG93ZXJcbiAgICAgICAgICAgIGlmKGNhcmQyU3VpdGU8MClyZXR1cm4gMTsgLy8gaWYgdGhlIHNlY29uZCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGhpZ2hlclxuICAgICAgICAgICAgLy8gQVNTRVJUIGJvdGggY2FyZHMgYXJlIGVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPT1jYXJkMlN1aXRlKXJldHVybiBjYXJkMS5yYW5rLWNhcmQyLnJhbms7XG4gICAgICAgICAgICAvLyBBU1NFUlQgb25lIGNhcmQgaXMgcGxheSBzdWl0ZSwgdGhlIG90aGVyIG11c3QgYmUgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIHJldHVybihjYXJkMVN1aXRlPT00PzE6LTEpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIEFTU0VSVCBuZWl0aGVyIGNhcmQgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSwgYm90aCBjYXJkcyBhcmUgaXJyZWxldmFudCAoc2hvdWxkIGhhcHBlbiB0aG91Z2gpXG4gICAgICAgIHJldHVybiAwOyAvLyBjb25zaWRlcmVkIGVxdWFsIHRoYXQgaXMgaXJyZWxldmFudFxuICAgIH1cbiAgICBcbiAgICAvLyAvLyB5b3UnZCBoYXZlIHRvIHVzZSB0aGUgQXBwbGUgU3ltYm9scyBmb250XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaU8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KxPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgr48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CvTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4K7PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgro8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CuTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4K4PC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgrc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CtjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4K1PC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgrQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CszwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KyPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZozwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg5E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DnjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4OdPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg5s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DmjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OZPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg5g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DlzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OWPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg5U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DlDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4OTPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg5I8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmmPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DgTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OOPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg408L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DizwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OKPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg4k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DiDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OHPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg4Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DhTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OEPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg4M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DgjwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4KhPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfgq48L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+CrTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4KrPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfgqo8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+CqTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4KoPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfgqc8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+CpjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4KlPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfgqQ8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+CozwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4KiPC9saT5cbiAgICBzdGF0aWMgZ2V0IENBUkRfQVBQTEVfU1lNQk9MUygpe3JldHVybiBbXG4gICAgICAgIFsn8J+DgicsJ/Cfg4MnLCfwn4OEJywn8J+DhScsJ/Cfg4YnLCfwn4OHJywn8J+DiCcsJ/Cfg4knLCfwn4OKJywn8J+DiycsJ/Cfg40nLCfwn4OOJywn8J+DgSddLFxuICAgICAgICBbJ/Cfg5InLCfwn4OTJywn8J+DlCcsJ/Cfg5UnLCfwn4OWJywn8J+DlycsJ/Cfg5gnLCfwn4OZJywn8J+DmicsJ/Cfg5snLCfwn4OdJywn8J+DnicsJ/Cfg5EnXSxcbiAgICAgICAgWyfwn4KyJywn8J+CsycsJ/CfgrQnLCfwn4K1Jywn8J+CticsJ/CfgrcnLCfwn4K4Jywn8J+CuScsJ/CfgronLCfwn4K7Jywn8J+CvScsJ/Cfgr4nLCfwn4KxJ10sXG4gICAgICAgIFsn8J+CoicsJ/CfgqMnLCfwn4KkJywn8J+CpScsJ/CfgqYnLCfwn4KnJywn8J+CqCcsJ/CfgqknLCfwn4KqJywn8J+CqycsJ/Cfgq0nLCfwn4KuJywn8J+CoSddXG4gICAgXX07XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KXtcbiAgICAgICAgdGhpcy5fY2FyZFN1aXRlSW5kZXg9Y2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIHRoaXMuX2NhcmROYW1lSW5kZXg9Y2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIENhcmQuUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XStcIiBvZiBcIitDYXJkLlNVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcInNcIjtcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJhbmsoKXtyZXR1cm4gdGhpcy5fY2FyZE5hbWVJbmRleDt9XG4gICAgZ2V0IHN1aXRlKCl7cmV0dXJuIHRoaXMuX2NhcmRTdWl0ZUluZGV4O31cblxuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbigpe1xuICAgICAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc3ZnLWNhcmRzLnN2ZyB3ZSBjYW4gZG8gdGhlIGZvbGxvd2luZywgYnV0IGluIHRoYXQgY2FzZSB3ZSdkIG5lZWQgdG8ga25vdyB0aGUgbWFnbmlmaWNhdGlvbiBmYWN0b3IhISFcbiAgICAgICAgLy9yZXR1cm4gQ0FSRF9GT05UX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvL3JldHVybiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDY3NiA5NzZcIj48dXNlIHhsaW5rOmhyZWY9XCJpbWcvc3ZnLWNhcmRzLnN2ZyMnK1NVSVRFX05BTUVTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XStcIi1cIitSQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdKyc8L3VzZT48L3N2Zz4nO1xuICAgICAgICByZXR1cm4gQ2FyZC5DQVJEX0FQUExFX1NZTUJPTFNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdW3RoaXMuX2NhcmROYW1lSW5kZXhdO1xuICAgICAgICAvLy8vLy9yZXR1cm4gU1VJVEVfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0uY29uY2F0KFJBTktfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkTmFtZUluZGV4XSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPUNhcmQ7IiwiLyoqXG4gKiBkZWZpbmVzIHNvbWVvbmUgdGhhdCBob2xkcyBjYXJkc1xuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuXG5jbGFzcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2codG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICAvLyBNREhAMDRERUMyMDE5OiBhbGxvd2luZyBub3cgdG8gY29uc3RydWN0IGZpeGVkIHNpemUgY2FyZCBob2xkZXJzIChsaWtlIFRyaWNrKVxuICAgIGNvbnN0cnVjdG9yKG51bWJlck9mQ2FyZHM9MCl7XG4gICAgICAgIHRoaXMuX2NhcmRzPVtdO1xuICAgICAgICB0aGlzLl9udW1iZXJPZkNhcmRzPW51bWJlck9mQ2FyZHM7XG4gICAgICAgIHdoaWxlKC0tbnVtYmVyT2ZDYXJkcz49MCl0aGlzLl9jYXJkcy5wdXNoKG51bGwpO1xuICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kcyB0byBhZGp1c3QgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIF9yZW1vdmVDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmluZGV4T2YoY2FyZCk7XG4gICAgICAgIGlmKGNhcmRJbmRleD49MCl7XG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkcy5zcGxpY2UoY2FyZEluZGV4LDEpLmxlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK2NhcmQrXCIgcmVtb3ZlZCBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIuXCIpO1xuICAgICAgICAgICAgICAgIGNhcmQuX2hvbGRlcj1udWxsOyAvLyB3aGVuIHN1Y2Nlc3NmdWwgYXBwYXJlbnRseSBubyBsb25nZXIgYXZhaWxhYmxlISEhXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBhdCBpbmRleCBcIitjYXJkSW5kZXgrXCIgb2YgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gcmVtb3ZlIGNhcmQgXCIrY2FyZCtcIiBmcm9tIFwiK3RoaXMudG9TdHJpbmcoKStcIjogaXQgaXMgbm90IHByZXNlbnQuXCIpO1xuICAgIH1cbiAgICBfYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgaWYoIWNhcmQpcmV0dXJuO1xuICAgICAgICBpZighKGNhcmQgaW5zdGFuY2VvZiBIb2xkYWJsZUNhcmQpKXRocm93IG5ldyBFcnJvcihcIk5vdCBhIGhvbGRhYmxlIGNhcmQhXCIpO1xuICAgICAgICB0aGlzLmxvZyhcIkFkZGluZyBjYXJkIFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIHRoaXMuX2NhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz5udW1iZXJPZkNhcmRzTm93KXtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTsgLy8gY2FuIG5vIGxvbmdlciBndWFyYW50ZWUgdGhhdCBpdCBpcyBzb3J0ZWQuLi5cbiAgICAgICAgICAgIGNhcmQuX2hvbGRlcj10aGlzO1xuICAgICAgICAgICAgdGhpcy5sb2coXCJDYXJkIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiAoXCIrY2FyZC50b1N0cmluZygpK1wiKSBhZGRlZCB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAgICAgLy8gaG93IGFib3V0IG9yZGVyaW5nIHRoZSBjYXJkcz8/Pz8/PyBvciBzdG9yaW5nIHRoZW0gYnkgc3VpdGU/Pz8/XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlxcdENhcmQgY29sbGVjdGlvbjogXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGFkZCBjYXJkIFwiK2NhcmQrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiIChkZWx0YSBudW1iZXIgb2YgY2FyZHM6IFwiKyh0aGlzLm51bWJlck9mQ2FyZHMtbnVtYmVyT2ZDYXJkc05vdykrXCIpLlwiKTtcbiAgICB9XG4gICAgLypcbiAgICAvLyByZXBsYWNlIGEgY2FyZCBhdCBhIGdpdmVuIGluZGV4IChhcyB1c2VkIGluIFRyaWNrKVxuICAgIF9zZXRDYXJkQXRJbmRleChjYXJkLGluZGV4KXtcbiAgICAgICAgaWYoaW5kZXg8MHx8aW5kZXg+PXRoaXMubnVtYmVyT2ZDYXJkcyl0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZXBsYWNlIGNhcmQgI1wiK1N0cmluZyhpbmRleCsxKStcIi5cIik7XG4gICAgICAgIGxldCBjYXJkQXRJbmRleD10aGlzLl9jYXJkc1tpbmRleF07XG4gICAgICAgIGlmKGNhcmRBdEluZGV4KXtjYXJkQXRJbmRleC5faG9sZGVyPW51bGw7dGhpcy5fY2FyZHNbaW5kZXhdPW51bGw7fVxuICAgICAgICBpZihjYXJkKXtcbiAgICAgICAgICAgIC8vIGlmICdjb250YWluZWQnIGluIGFub3RoZXIgY2FyZCBob2xkZXIgcmVtb3ZlIGl0IGZyb20gdGhlcmUhISFcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBpZihjYXJkLl9ob2xkZXIpY2FyZC5faG9sZGVyLnJlbW92ZUNhcmQoY2FyZCk7XG4gICAgICAgICAgICAgICAgaWYoIWNhcmQuX2hvbGRlcil7dGhpcy5fY2FyZHNbaW5kZXhdPWNhcmQ7Y2FyZC5faG9sZGVyPXRoaXM7fSAgICBcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7fVxuICAgICAgICB9XG4gICAgfVxuICAgICovXG4gICAgLy8gcG9sbCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgZ2V0IG51bWJlck9mQ2FyZHMoKXtyZXR1cm4gdGhpcy5fY2FyZHMubGVuZ3RoO31cblxuICAgIGdldENhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQucmFuaz09cmFuazt9KTtcbiAgICB9XG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHN1aXRlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5zdWl0ZT09c3VpdGU7fSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnRcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXMoKXtcbiAgICAgICAgLy8gY2FuJ3QgdXNlIHRoaXMgaW4gZmlsdGVyISEhIHJldHVybiBbMCwxLDIsM10uZmlsdGVyKChyYW5rKT0+e3JldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuayk+MDt9KTtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgY2FyZHMgaW4gdGhlIGhvbGRlciB3aXRoIHRoZSBnaXZlbiByYW5rXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggYWxsIHN1aXRlcywgd2l0aCAtMSB3aGVyZSBhIHN1aXRlIGlzIG5vdCBwcmVzZW50IGluIHRoZSBjdXJyZW50IGNhcmRzIFxuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRob3V0UmFuayhyYW5rKXtcbiAgICAgICAgLy8gYWggdGhpcyBpcyBhbiBpc3N1ZSwgYmVjYXVzZSBpZiB5b3UgZG8gbm90IGhhdmUgYSBjZXJ0YWluIHN1aXRlIHRoZSBzdWl0ZSBzaG91bGQgTk9UIGJlIHJldHVybmVkISEhISFcbiAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogQlVUIHdlIHdhbnQgdG8ga25vdyBhbGwgdGhlIHN1aXRlcyBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIGdpdmVuIHJhbmtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyBvZiB0aG9zZSBzdWl0ZXMgYSBwbGF5ZXIgZG9lcyBOT1QgaGF2ZVxuICAgICAgICAvKiBNREhAMDNGRUIyMDIwIHJlcGxhY2luZzpcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntcbiAgICAgICAgICAgIGlmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7IC8vIGlmIHN1aXRlIG5vdCBwcmVzZW50IHlldCwgYWRkIGl0IHRvIHN1aXRlc1xuICAgICAgICAgICAgaWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXNbY2FyZC5zdWl0ZV09LTE7IC8vIG5vdCByZW1vdmluZyBpdCBidXQgc2V0dGluZyB0byAtMSBpZiB3ZSBsb2NhdGUgdGhlIHJhbmtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICAgbGV0IHN1aXRlcz1bLTEsLTEsLTEsLTFdOyAvLyBNREhAMDVGRUIyMDIwOiB3aWxsIHJldHVybiAtMTogcGxheWVyIGRvZXNuJ3QgaGF2ZSBjYXJkLCAwPXBsYXllciBoYXMgcmFuaywgMSBkb2VzIE5PVCBoYXZlIHJhbmtcbiAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e1xuICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgZm9sbG93aW5nIGNhbiBvbmx5IGhhcHBlbiBvbmNlIChmb3IgZWFjaCBzdWl0ZSksIHdlIGNhbiBzYWZlbHkgYXNzdW1lIHRoYXQgdGhlIHN1aXRlIGlzIHRoZXJlISEhIVxuICAgICAgICAgICAgaWYoc3VpdGVzW2NhcmQuc3VpdGVdPDApc3VpdGVzW2NhcmQuc3VpdGVdPTE7IC8vIHRoZSBzdWl0ZSBpcyB0aGVyZVxuICAgICAgICAgICAgaWYoY2FyZC5yYW5rPT09cmFuaylzdWl0ZXNbY2FyZC5zdWl0ZV09MDsgLy8gd2UgZm91bmQgdGhlIGNhcmQgaW4gY2FyZC5zdWl0ZSB3aXRoIHRoZSByYW5rIHBhc3NlZCBpbiEhIVxuICAgICAgIH0pO1xuICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGlkcyBvZiB0aGUgc3VpdGVzIHByZXNlbnQgb2Ygd2hpY2ggdGhlIHBsYXllciBkb2VzIG5vdCBoYXZlIHRoZSB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGdldFJhbmtsZXNzU3VpdGVzKHJhbmspe1xuICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZXM9W107XG4gICAgICAgIGxldCBzdWl0ZXNXaXRoUmFua3M9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goXG4gICAgICAgICAgICAoY2FyZCk9PntcbiAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDAmJnN1aXRlc1dpdGhSYW5rcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApe1xuICAgICAgICAgICAgICAgICAgICBpZihjYXJkLmNhcmROYW1lSW5kZXg9PXJhbmspe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VpdGVzV2l0aFJhbmtzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHN1aXRlIGlmIGFscmVhZHkgcHJlc2VudFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVJbmRleD1yYW5rbGVzc1N1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZUluZGV4Pj0wKXJhbmtsZXNzU3VpdGVzLnNwbGljZShyYW5rbGVzc1N1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIC8vIHVudGlsIHByb3ZlbiBkaWZmZXJlbnRseVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFua2xlc3NTdWl0ZXMucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByYW5rbGVzc1N1aXRlcztcbiAgICB9XG5cbiAgICBnZXRGaXJzdENhcmQoKXtpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClyZXR1cm4gdGhpcy5fY2FyZHNbMF07fVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogdXNlZCBpbiBnYW1lZW5naW5lLmpzXG4gICAgZ2V0TGFzdENhcmQoKXtpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZHMubGVuZ3RoLTFdO31cblxuICAgIGNvbnRhaW5zQ2FyZChzdWl0ZSxyYW5rKXtcbiAgICAgICAgbGV0IGNhcmQ9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmQ+PTAmJih0aGlzLl9jYXJkc1tjYXJkXS5zdWl0ZSE9PXN1aXRlfHx0aGlzLl9jYXJkc1tjYXJkXS5yYW5rIT09cmFuaykpO1xuICAgICAgICByZXR1cm4oY2FyZD49MCk7IC8vIGZvdW5kIGlmIGNhcmQgaXMgbm90IG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLy8gTURIQDEzSkFOMjAyMDogd2UgbmVlZCB0aGlzIHRvIGZpbmQgYSBzcGVjaWZpYyBjYXJkXG4gICAgZ2V0Q2FyZChzdWl0ZSxyYW5rKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZEluZGV4Pj0wKXtsZXQgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO2lmKGNhcmQuc3VpdGU9PT1zdWl0ZSYmY2FyZC5yYW5rPT09cmFuaylyZXR1cm4gY2FyZDt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNhbiBleHBvc2UgYSB0ZXh0IHJlcHJlc2VudGlvblxuICAgICAqL1xuICAgIGdldFRleHRSZXByZXNlbnRhdGlvbihzdWl0ZVNlcGFyYXRvcil7XG4gICAgICAgIHRoaXMubG9nKFwiTnVtYmVyIG9mIGNhcmRzIHRvIHJlcHJlc2VudDogXCIrdGhpcy5fY2FyZHMubGVuZ3RoK1wiLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHNvcnRpbmc/Pz8/Pz8/PyB0aGF0IHdvdWxkIGJlIG5pY2VcbiAgICAgICAgaWYoc3VpdGVTZXBhcmF0b3ImJnR5cGVvZiBzdWl0ZVNlcGFyYXRvcj09PVwic3RyaW5nXCImJiF0aGlzLl9zb3J0ZWQpe1xuICAgICAgICAgICAgdGhpcy5fY2FyZHMuc29ydChjb21wYXJlQ2FyZHMpO1xuICAgICAgICAgICAgdGhpcy5fc29ydGVkPXRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMuX3NvcnRlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5tYXAoKGNhcmQpPT57cmV0dXJuIGNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7fSkuam9pbihcIiBcIik7XG4gICAgICAgIC8vIGNhcmRzIGFyZSBzdXBwb3NlZCB0byBiZSBzb3J0ZWRcbiAgICAgICAgbGV0IHRleHRSZXByZXNlbnRhdGlvbj1cIlwiO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICBsZXQgY2FyZD10aGlzLmdldEZpcnN0Q2FyZCgpO1xuICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uPWNhcmQuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0xO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4Kyspe1xuICAgICAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbis9KGNhcmQuc3VpdGUhPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uc3VpdGU/c3VpdGVTZXBhcmF0b3I6XCIgXCIpO1xuICAgICAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbis9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHRSZXByZXNlbnRhdGlvbjsgLy8gYSBzaW5nbGUgYmxhbmsgYmV0d2VlbiB0aGVtISEhXG4gICAgfVxuXG59XG5cbi8qKlxuICogYSBjYXJkIHdpdGggYSBjYXJkIGhvbGRlciBpcyBoZWxkXG4gKi9cbmNsYXNzIEhvbGRhYmxlQ2FyZCBleHRlbmRzIENhcmR7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhPTERBQkxFQ0FSRCA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cblxuICAgIHNldCBob2xkZXIoaG9sZGVyKXtcbiAgICAgICAgdGhpcy5sb2coXCJDaGFuZ2luZyB0aGUgaG9sZGVyIG9mIGNhcmQgXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gdGhlIGN1cnJlbnQgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKHRoaXMuX2hvbGRlcil0aGlzLl9ob2xkZXIuX3JlbW92ZUNhcmQodGhpcyk7XG4gICAgICAgIC8vIGFkZCAod2hlbiBzdWNjZXNzZnVsbHkgcmVtb3ZlZCkgdG8gdGhlIG5ldyBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYoIXRoaXMuX2hvbGRlciYmaG9sZGVyKWhvbGRlci5fYWRkQ2FyZCh0aGlzKTtlbHNlIHRoaXMubG9nKFwiRVJST1I6IFVuYWJsZSB0byBjaGFuZ2UgdGhlIGhvbGRlciFcIik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCxob2xkZXIpe1xuICAgICAgICBzdXBlcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4KTtcbiAgICAgICAgdGhpcy5faG9sZGVyPW51bGw7XG4gICAgICAgIHRoaXMuaG9sZGVyPWhvbGRlcjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiBcIkhvbGRhYmxlIFwiK3N1cGVyLnRvU3RyaW5nKCk7fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzPXtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH07IiwiLy8gTURIQDMxSkFOMjAyMDogSSdsbCBiZSBuZWVkaW5nIHRoaXMgYm90aCBjbGllbnQtc2lkZSBhbmQgc2VydmVyLXNpZGVcbi8vICAgICAgICAgICAgICAgIGNsaWVudC1zaWRlIGl0J3MgZW1iZWRkZWQgaW4gZ2FtZXBsYXlpbmcuanMgKHRoZSBicm93c2VyaWZpZWQgdmVyc2lvbiBvZiBjbGllbnQuanMpXG5jbGFzcyBMYW5ndWFnZXtcbiAgICBzdGF0aWMgZ2V0IERFRkFVTFRfUExBWUVSUygpe3JldHVybiBbW1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIl0sW1wiTWFyY1wiLFwiSnVyZ2VuXCIsXCJNb25pa2FcIixcIkFubmFcIixcIlwiXV07fTtcbiAgICAvLyBwb3NzaWJsZSByYW5rcyBhbmQgc3VpdGVzIChpbiBEdXRjaClcbiAgICBzdGF0aWMgZ2V0IERVVENIX1JBTktfTkFNRVMoKXtyZXR1cm4gW1widHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImJvZXJcIixcInZyb3V3XCIsXCJoZWVyXCIsXCJhYXNcIl07fTtcbiAgICBzdGF0aWMgZ2V0IERVVENIX1NVSVRFX05BTUVTKCl7cmV0dXJuIFtcInJ1aXRlblwiLFwia2xhdmVyZW5cIixcImhhcnRlblwiLFwic2Nob3BwZW5cIl07fTtcbn1cblxubW9kdWxlLmV4cG9ydHM9TGFuZ3VhZ2U7IiwiLyoqXG4gKiBhIHBsYWNlaG9sZGVyIGZvciBhIHBsYXllclxuICovXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuLyoqXG4gKiBhIFBsYXllciBjYW4gbWFrZSBhIGJpZCwgb3IgcGxheSBhIGNhcmQsIGNob29zZSBhIHRydW1wIGFuZCBwYXJ0bmVyIHN1aXRlXG4gKi9cbmNsYXNzIFBsYXllckV2ZW50TGlzdGVuZXJ7XG4gICAgYmlkTWFkZShiaWQpe31cbiAgICBjYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe31cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe31cbiAgICBwYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXt9XG59XG5cbi8vIE1ESEAwN0RFQzIwMTk6IFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVyIHdpdGggZ2FtZSBkYXRhIGV4cG9zZWQgdG8gcGxheWVyXG4vLyAgICAgICAgICAgICAgICB3aGljaCB3YXMgZWFybGllciBzdG9yZWQgaW4gZWFjaCB0cmlja1xuY2xhc3MgUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXJ7XG4gICAgc3RhdGljIGdldCBCSURfTkFNRVMoKXtyZXR1cm4gW1wicGFzXCIsXCJyaWtcIixcInJpayAoYmV0ZXIpXCIsXCJuZWdlbiBhbGxlZW5cIixcIm5lZ2VuIGFsbGVlbiAoYmV0ZXIpXCIsXCJwaWNvXCIsXCJ0aWVuIGFsbGVlblwiLFwidGllbiBhbGxlZW4gKGJldGVyKVwiLFwiZWxmIGFsbGVlblwiLFwiZWxmIGFsbGVlbiAoYmV0ZXIpXCIsXCJtaXNcXHhlOHJlXCIsXCJ0d2FhbGYgYWxsZWVuXCIsXCJ0d2FhbGYgYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzXFx4ZThyZVwiLFwiZGVydGllbiBhbGxlZW5cIixcImRlcnRpZW4gYWxsZWVuIChiZXRlcilcIixcIm9wZW4gbWlzXFx4ZThyZSBtZXQgZWVuIHByYWF0amVcIixcInRyb2VsYVwiLFwib20gZGUgc2Nob3BwZW4gdnJvdXcgZW4gZGUgbGFhdHN0ZSBzbGFnXCIsXCJvbSBkZSBsYWF0c3RlIHNsYWdcIl07fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QQVMoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJSygpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBCSURfUklLX0JFVEVSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU4oKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTl9CRVRFUigpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBCSURfUElDTygpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU4oKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9FTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9NSVNFUkUoKXtyZXR1cm4gMTA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiAxMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFKCl7cmV0dXJuIDEzO307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU4oKXtyZXR1cm4gMTQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiAxNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRSgpe3JldHVybiAxNjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RST0VMQSgpe3JldHVybiAxNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0xBQVRTVEVfU0xBR19FTl9TQ0hPUFBFTl9WUk9VVygpe3JldHVybiAxODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0xBQVRTVEVfU0xBRygpe3JldHVybiAxOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEU19BTExfQ0FOX1BMQVkoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1BJQ08sUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkUsUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFXTt9OyAvLyB0cnVtcGxlc3MgZ2FtZXNcbiAgICBzdGF0aWMgZ2V0IEJJRFNfV0lUSF9QQVJUTkVSX0lOX0hFQVJUUygpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUklLX0JFVEVSLFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0VMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUl07fTsgLy8gZ2FtZXMgd2l0aCB0cnVtcCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXJcbiAgICBzdGF0aWMgZ2V0IEJJRF9SQU5LUygpe3JldHVybiBbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMCwtMSwtMV07fTsgLy8gaG93IEkgcGxheWVkIGl0IChiaWQgcGFzcyBleGNsdWRlZCAoYWx3YXlzIHJhbmsgMCkpXG4gICAgXG4gICAgLy8gZWFjaCBiaWQgaGFzIGEgY2VydGFpbiBhbW91bnQgb2YgcG9pbnRzIHRvIHJlY2VpdmUgd2hlbiB3aW5uaW5nIHRoZSBnYW1lXG4gICAgc3RhdGljIGdldCBCSURfUE9JTlRTKCl7cmV0dXJuIFswLDEsMSwzLDMsNCw0LDQsNSw1LDUsNiw2LDYsNyw3LDEwLDIsMiwyXTt9XG5cbiAgICAvLyB0aGUgc3RhdGUgY29uc3RhbnRzIHdlIGhhdmVcbiAgICBzdGF0aWMgZ2V0IE9VVF9PRl9PUkRFUigpe3JldHVybiAwO31cbiAgICBzdGF0aWMgZ2V0IElETEUoKXtyZXR1cm4gMTt9XG4gICAgc3RhdGljIGdldCBERUFMSU5HKCl7cmV0dXJuIDI7fVxuICAgIHN0YXRpYyBnZXQgQklERElORygpe3JldHVybiAzO31cbiAgICBzdGF0aWMgZ2V0IFBMQVlJTkcoKXtyZXR1cm4gNDt9XG4gICAgc3RhdGljIGdldCBDQU5DRUxJTkcoKXtyZXR1cm4gNTt9XG4gICAgc3RhdGljIGdldCBGSU5JU0hFRCgpe3JldHVybiA2O31cbiAgICBnZXRUcnVtcFN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe31cbiAgICBnZXRUcnVtcFBsYXllcigpe31cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllcil7fVxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7fVxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIGdldFBsYXllck5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGRlbHRhUG9pbnRzKCl7fVxuICAgIGdldCBwb2ludHMoKXt9XG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllcixvdGhlclBsYXllcil7fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe31cbiAgICBnZXRUcmlja0F0SW5kZXgodHJpY2tJbmRleCl7fSAvLyBnZXQgdGhlIGxhc3QgdHJpY2sgcGxheWVkXG4gICAgZ2V0VGVhbU5hbWUocGxheWVyKXt9XG4gICAgZ2V0IGZvdXJ0aEFjZVBsYXllcigpe31cbiAgICBfYXNrUGxheWVyRm9yQmlkKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JUcnVtcFN1aXRlKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JQYXJ0bmVyU3VpdGUoKXt9XG4gICAgX2Fza1BsYXllckZvckNhcmQoKXt9XG4gICAgX2NhcmRQbGF5ZWRBY2NlcHRlZCgpe30gLy8gTURIQDIzSkFOMjAyMDogdGhlIGVtcHR5IG1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiBhIGNhcmQgd2FzIHBsYXllZCBzdWNjZXNzZnVsbHlcbn1cblxuY29uc3QgQ0hPSUNFX0lEUz1bXCJhXCIsXCJiXCIsXCJjXCIsXCJkXCIsXCJlXCIsXCJmXCIsXCJnXCIsXCJoXCIsXCJpXCIsXCJqXCIsXCJrXCIsXCJsXCIsXCJtXCJdO1xuXG5jb25zdCBQTEFZRVJUWVBFX0ZPTz0wLFBMQVlFUlRZUEVfVU5LTk9XTj0xLFBMQVlFUlRZUEVfRlJJRU5EPTI7XG5cbi8vIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBQbGF5ZXIgaW5zdGFuY2VzXG4vLyB3b3VsZCBiZSBkZWZpbmVkIGFic3RyYWN0IGluIGNsYXNzaWNhbCBPT1xuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUExBWUVSID4+PiBcIit0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIGFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXImJnBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMucHVzaChwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgZXZlbnQgbGlzdGVuZXJzOiBcIit0aGlzLl9ldmVudExpc3RlbmVycytcIi5cIik7XG4gICAgfVxuXG4gICAgLy8gd2hlbmV2ZXIgYSBnYW1lIGlzIHN0YXJ0ZWQsIGNhbGwgbmV3R2FtZSEhXG4gICAgbmV3R2FtZSgpe1xuICAgICAgICBpZih0aGlzLl9pbmRleDwwfHwhdGhpcy5fZ2FtZSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gdm9vciB0ZSBiZXJlaWRlbiBvbSB0ZSBzcGVsZW4uXCIpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkcz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHM+MCl7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpOyAvLyBiZXR0ZXIgZG9uZSB0aGlzIHdheSBpbnN0ZWFkIG9mIHRoaXMuX2NhcmRzPVtdXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiTm9nIFwiK251bWJlck9mQ2FyZHMrXCIga2FhcnRlbiBpbiBkZSBoYW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZhdWx0IHBsYXllciByZW1lbWJlcmluZyBpdHMgY2hvaWNlc1xuICAgICAgICB0aGlzLl9iaWQ9LTE7IC8vIHRoZSBsYXN0IGJpZCBvZiB0aGlzIHBsYXllclxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX2NhcmQ9bnVsbDtcbiAgICAgICAgLy8gdGhlIGdhbWUgYmVpbmcgcGxheWVkLCBhbmQgdGhlIGluZGV4IHdpdGhpbiB0aGF0IGdhbWVcbiAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uPVtdOyAvLyB0aGUgdHJpY2tzIHdvbiAoaW4gYW55IGdhbWUpXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW49LTE7IC8vIGRvZXNuJ3QgbWF0dGVyXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZSxwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fbmFtZT1uYW1lO1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycz1bXTtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgICAgICBpZighKHBsYXllckV2ZW50TGlzdGVuZXIgaW5zdGFuY2VvZiBQbGF5ZXJFdmVudExpc3RlbmVyKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgZXZlbnQgbGlzdGVuZXIgb2Ygd3JvbmcgdHlwZS5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVjZWl2aW5nIGdhbWUgYW5kIGluZGV4XG4gICAgICAgIHRoaXMuX2luZGV4PS0xO3RoaXMuX2dhbWU9bnVsbDsgLy8gd2FpdGluZyBmb3IgdGhlIGdhbWUgdG8gYmUgcGx1Z2dlZCBpbiAob25jZSlcbiAgICAgICAgLy8gcmVtb3ZlZCB3YWl0IHVudGlsIGdldHRpbmcgY2FsbGVkIHRocm91Z2ggbmV3R2FtZTogdGhpcy5fcHJlcGFyZUZvclBsYXlpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gZ2V0dGVycyBleHBvc2luZyBpbmZvcm1hdGlvbiB0byB0aGUgbWFkZSBjaG9pY2VcbiAgICAvLyBOT1RFIG5vIGxvbmdlciBjYWxsZWQgYnkgdGhlIGdhbWUgYmVjYXVzZSB0aGUgY2hvaWNlIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCBub3dcbiAgICAvLyAgICAgIHRoaXMgd2F5IHN1YmNsYXNzZXMgYXJlIG5vdCBvYmxpZ2F0ZWQgdG8gcmVtZW1iZXIgdGhlIGNob2ljZXMgdGhleSBtYWtlXG4gICAgZ2V0IGJpZCgpe3JldHVybiB0aGlzLl9iaWQ7fVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXQgY2FyZCgpe3JldHVybiB0aGlzLmNhcmQoKTt9XG5cbiAgICBnZXQgcGFydG5lcigpe3JldHVybiB0aGlzLl9wYXJ0bmVyO31cblxuICAgIC8vLy8vLy8vLy8vLy8vZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5fY2FyZHNbdGhpcy5fY2FyZFBsYXlJbmRleF07fVxuXG4gICAgLyogY2FuIGJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgZ2FtZVxuICAgIC8vIGNhbiBiZSBzZXQgZGlyZWN0bHkgd2hlbiBhIGJldHRlciAncmlrJyB2YXJpYXRpb24gYmlkIHdhcyBkb25lISEhIVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIFxuICAgIC8vIFRPRE8gaXQgd291bGQgYmUgZWFzaWVyIHRvIGNvbWJpbmUgdGhlc2UgaW4gYSBjYXJkISEhIVxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuXG4gICAgLy8gY2FsbGVkIGZyb20gdGhlIFVJIHRvIHNldCB0aGUgdHJ1bXAgc3VpdGUhISEhXG4gICAgc2V0IHRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7dGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO3RoaXMudHJ1bXBTdWl0ZUNob3NlbigpO31cbiAgICBzZXQgcGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7dGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLnBhcnRuZXJTdWl0ZUNob3NlbigpO31cbiAgICAqL1xuXG4gICAgLy8gZW5kIG9mIGdldHRlcnMvc2V0dGVycyB1c2VkIGJ5IHRoZSBnYW1lXG4gICAgX3JlbW92ZUNhcmRzKCl7d2hpbGUodGhpcy5fY2FyZHMubGVuZ3RoPjApdGhpcy5fY2FyZHMuc2hpZnQoKS5ob2xkZXI9bnVsbDt9XG5cbiAgICBnZXQgZ2FtZSgpe3JldHVybiB0aGlzLl9nYW1lO31cbiAgICBzZXQgZ2FtZShnYW1lKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSE9PWdhbWUpe1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYoZ2FtZSYmIShnYW1lIGluc3RhbmNlb2YgUGxheWVyR2FtZSkpcmV0dXJuIG5ldyBFcnJvcihcIlNwZWwgbmlldCB2YW4gaGV0IGp1aXN0ZSB0eXBlLlwiKTtcbiAgICAgICAgaWYoZ2FtZSlpZih0aGlzLl9pbmRleDwwKXJldHVybiBuZXcgRXJyb3IoXCJQb3NpdGllIHZhbiBzcGVsZXIgb25iZWtlbmQuXCIpO1xuICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpOyAvLyBNREhAMTFKQU4yMDIwOiBpZiB0aGUgZ2FtZSBjaGFuZ2VzIHdlIHNob3VsZCByZW1vdmUgdGhlIGNhcmRzXG4gICAgICAgIHRoaXMuX2dhbWU9Z2FtZTtcbiAgICAgICAgLy8gc3luYyBfaW5kZXhcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgb24hXCIpO1xuICAgICAgICAgICAgLy8gcHJlcGFyZSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5wYXJ0bmVyPS0xOyAvLyBteSBwYXJ0bmVyIChvbmNlIEkgbm93IHdobyBpdCBpcylcbiAgICAgICAgICAgIHRoaXMudHJpY2tzV29uPVtdOyAvLyBzdG9yaW5nIHRoZSB0cmlja3Mgd29uXG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgb3ZlciFcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCBpbmRleCgpe3JldHVybiB0aGlzLl9pbmRleDt9IC8vIE1ESEAyMkpBTjIwMjA6IG5vIGhhcm0gaW4gYWRkaW5nIGEgZ2V0dGVyISEhXG4gICAgc2V0IGluZGV4KGluZGV4KXt0aGlzLl9pbmRleD1pbmRleDt9IC8vIE1ESEAwOUpBTjIwMjA6IHNvbWV0aW1lcyBhbiBpbmRleCBjYW4gYmUgc2V0IHNlcGFyYXRlbHlcblxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXJpbmcgdGhlIGdhbWUgcGxheWVkIGF0IGluZGV4IFwiK2luZGV4K1wiLlwiKTtcbiAgICAgICAgdGhpcy5pbmRleD1pbmRleDtcbiAgICAgICAgdGhpcy5nYW1lPWdhbWU7XG4gICAgfVxuICAgIC8qXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgc3VwZXIuYWRkQ2FyZChjYXJkKTtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMrXCInIHJlY2VpdmVkIGNhcmQgJ1wiK2NhcmQrXCInLlwiKTtcbiAgICB9XG4gICAgKi9cbiAgICBfZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSx3aGVuTm90Rm91bmRDYXJkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybihjYXJkLnN1aXRlPT1jYXJkU3VpdGUpO30pO1xuICAgIH1cblxuICAgIF9nZXRTdWl0ZUNhcmRzKCl7XG4gICAgICAgIHRoaXMubG9nKFwiRGV0ZXJtaW5pbmcgc3VpdGUgY2FyZHMgb2YgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIGNhcmRzIVwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZHM9W1tdLFtdLFtdLFtdXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntzdWl0ZUNhcmRzW2NhcmQuc3VpdGVdLnB1c2goY2FyZCk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZUNhcmRzO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBvZiBhIGdpdmVuIGNhcmQgc3VpdGUgKG9yIGFueSBjYXJkIGlmIGNhcmRTdWl0ZSBpcyB1bmRlZmluZWQpXG4gICAgY29udHJpYnV0ZVRvVHJpY2sodHJpY2spIHtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPT0wKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIGthYXJ0ZW4gbWVlciBvbSB0ZSBzcGVsZW4hXCIpO1xuICAgICAgICBsZXQgY2FyZHNPZlN1aXRlPXRoaXMuX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUpO1xuICAgICAgICBsZXQgY2FyZD0oY2FyZHNPZlN1aXRlJiZjYXJkc09mU3VpdGUubGVuZ3RoPjA/Y2FyZHNPZlN1aXRlWzBdOnRoaXMuX2NhcmRzWzBdKTtcbiAgICAgICAgY2FyZC5ob2xkZXI9dHJpY2s7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhlIHRyaWNrXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE1ESDogYWxsIG1ldGhvZHMgdGhhdCBkZWFsIHdpdGggcHJvY2Vzc2luZyBhIGJpZCwgYSBjYXJkLCB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlIGNob2ljZVxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgbWFkZSBhIGJpZFxuICAgIF9iaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gaW4gdGUgYmllZGVuIVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXNzaW5nIGJpZCBcIitiaWQrXCIgb2YgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIHRvIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUuYmlkTWFkZShiaWQpO1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiByZXR1cm5pbmcgdHJ1ZSBvbiBzdWNjZXNzICh3aGVuIF9iaWRNYWRlIGRpZCBub3QgcmV0dXJuIGFuIGVycm9yKVxuICAgIF9zZXRCaWQoYmlkKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX2JpZE1hZGUoYmlkKTtcbiAgICAgICAgaWYoZXJyb3ImJmVycm9yIT09dHJ1ZSlyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX2JpZD1iaWQ7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5eyghZXZlbnRMaXN0ZW5lcnx8ZXZlbnRMaXN0ZW5lci5iaWRNYWRlKHRoaXMuX2JpZCkpO31jYXRjaChlcnJvcil7fX0pO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBjYXJkUGxheWVkIGluIFJpa2tlblRoZUdhbWUgY2FuIG5vdyByZXR1cm4gYW4gZXJyb3IgKGluc3RlYWQgb2YgdGhyb3dpbmcgb25lKVxuICAgIF9jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIGVlbiBrYWFydCBpbiB0ZSBzcGVsZW4hXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS5jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgIH1cbiAgICAvLyBUT0RPIGEgYmlkIHNldHRlciB3aWxsIGFsbG93IHN1YmNsYXNzZXMgdG8gcGFzcyBhIGJpZCBieSBzZXR0aW5nIHRoZSBwcm9wZXJ0eVxuICAgIF9zZXRDYXJkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICAvLyB0ZWNobmljYWxseSBjaGVja2luZyB3aGV0aGVyIHRoZSBwbGF5ZWQgY2FyZCBpcyB2YWxpZCBzaG91bGQgYmUgZG9uZSBoZXJlLCBvciBCRUZPUkUgY2FsbGluZyBzZXRDYXJkXG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9jYXJkUGxheWVkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX2NhcmQ9Y2FyZDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci5jYXJkUGxheWVkKHRoaXMuX2NhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob29zZW4gYSB0cnVtcCBzdWl0ZVxuICAgIF90cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIGVlbiB0cm9lZmtsZXVyIGluIHRlIGtpZXplbiFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLnRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpe1xuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIudHJ1bXBTdWl0ZUNob3Nlbih0aGlzLl90cnVtcFN1aXRlKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9zZW4gYSBwYXJ0bmVyXG4gICAgX3BhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIGVlbiBwYXJ0bmVyIChrYWFydGtsZXVyKSB0ZSBraWV6ZW4uXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS5wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTtcbiAgICB9XG4gICAgX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci5wYXJ0bmVyU3VpdGVDaG9zZW4odGhpcy5fcGFydG5lclN1aXRlKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIG1ha2UgYSBiaWQgcGFzc2luZyBpbiB0aGUgaGlnaGVzdCBiaWQgc28gZmFyXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIG1ha2VBQmlkKHBsYXllcmJpZHMpe1xuICAgICAgICAvLyBhc3N1bWVzIHRoYXQgdGhpcyBwbGF5ZXIgaGFzIG1hZGUgYSBiaWQgYmVmb3JlLCBvciB0aGF0IHRoaXMgaXMgdGhlIGZpcnN0IGJpZFxuICAgICAgICAvLyB0aGlzIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYXNzdW1lcyB0byBiZSBydW5uaW5nIGluIGEgYnJvd3NlciBzbyB3ZSBjYW4gdXNlIHByb21wdCgpXG4gICAgICAgIC8vIGFsbCBvdGhlciBhdmFpbGFibGUgYmlkcyBzaG91bGQgYmUgYmV0dGVyIHRoYW4gdGhlIGxhc3QgYmlkIGJ5IGFueSBvdGhlciBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRTb0Zhcj1QbGF5ZXJHYW1lLkJJRF9QQVM7XG4gICAgICAgIGlmKHBsYXllcmJpZHMpe1xuICAgICAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgYmlkczpcIixwbGF5ZXJiaWRzKTtcbiAgICAgICAgICAgIGZvcihsZXQgcGxheWVyPTA7cGxheWVyPHBsYXllcmJpZHMubGVuZ3RoO3BsYXllcisrKVxuICAgICAgICAgICAgICAgIGlmKHBsYXllcmJpZHNbcGxheWVyXS5sZW5ndGg+MCYmcGxheWVyYmlkc1twbGF5ZXJdWzBdPmhpZ2hlc3RCaWRTb0ZhcilcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdEJpZFNvRmFyPXBsYXllcmJpZHNbcGxheWVyXVswXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZyhcIkhpZ2hlc3QgYmlkIHNvIGZhcjogJ1wiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0rXCInLlwiKTtcbiAgICAgICAgLy8gaWYgdGhlIGhpZ2hlc3QgcG9zc2libGUgYmlkIGlzIG5vdCBhIGJpZCBhbGwgY2FuIHBsYXkgKGF0IHRoZSBzYW1lIHRpbWUpLCBjYW4ndCBiZSBiaWQgYWdhaW5cbiAgICAgICAgaWYoUGxheWVyR2FtZS5CSURTX0FMTF9DQU5fUExBWS5pbmRleE9mKFBsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRTb0Zhcl0pPDApaGlnaGVzdEJpZFNvRmFyKys7XG4gICAgICAgIGxldCBwb3NzaWJsZUJpZE5hbWVzPVBsYXllckdhbWUuQklEX05BTUVTLnNsaWNlKGhpZ2hlc3RCaWRTb0Zhcik7XG4gICAgICAgIHBvc3NpYmxlQmlkTmFtZXMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1tQbGF5ZXJHYW1lLkJJRF9QQVNdKTsgLy8gdXNlciBjYW4gYWx3YXlzICdwYXMnXG4gICAgICAgIHRoaXMubG9nKFwiUG9zc2libGUgYmlkczogXCIscG9zc2libGVCaWROYW1lcyk7XG4gICAgICAgIGxldCBiaWQ9LTE7XG4gICAgICAgIHdoaWxlKGJpZDwwKXtcbiAgICAgICAgICAgIGxldCBiaWRuYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBpcyB5b3VyIGJpZCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQmlkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZUJpZE5hbWVzWzBdKTtcbiAgICAgICAgICAgIGJpZD1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5pbmRleE9mKGJpZG5hbWUpO1xuICAgICAgICAgICAgaWYoYmlkPDApY29udGludWU7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0QmlkKGJpZCk7XG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGJpZD0tMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgLy8gaWYgdGhpcyBwbGF5ZXIgaGFzIGFsbCBhY2VzIGl0J3MgZ29ubmEgYmUgdGhlIHN1aXRlIG9mIGEga2luZyB0aGUgcGVyc29uIGhhc24ndFxuICAgICAgICAvLyBhbHNvIGl0IG5lZWRzIHRvIGJlIGFuIGFjZSBvZiBhIHN1aXRlIHRoZSB1c2VyIGhhcyBpdHNlbGYgKHVubGVzcyB5b3UgaGF2ZSBhbGwgb3RoZXIgYWNlcylcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgLy8gYW55IG9mIHRoZSBzdWl0ZXMgaW4gdGhlIGNhcmRzIGNhbiBiZSB0aGUgdHJ1bXAgc3VpdGUhXG4gICAgICAgIGxldCBwb3NzaWJsZVRydW1wU3VpdGVOYW1lcz10aGlzLmdldFN1aXRlcygpLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUodHJ1bXBTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCB0cnVtcE5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IHN1aXRlIHdpbGwgYmUgdHJ1bXAgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHRydW1wU3VpdGU9cG9zc2libGVUcnVtcFN1aXRlTmFtZXMuaW5kZXhPZih0cnVtcE5hbWUpO1xuICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRUcnVtcFN1aXRlKHRydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB0cnVtcFN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBhc2tzIGZvciB0aGUgc3VpdGUgb2YgdGhlIHBhcnRuZXIgY2FyZCBvZiB0aGUgZ2l2ZW4gcmFua1xuICAgICAqL1xuICAgIGNob29zZVBhcnRuZXJTdWl0ZSgpe1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPVJBTktfQUNFO1xuICAgICAgICAvLyBnZXQgYWxsIHRoZSBhY2VsZXNzIHN1aXRlc1xuICAgICAgICBsZXQgc3VpdGVzPXRoaXMuZ2V0U3VpdGVzKCk7XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg9PTApeyAvLyBwbGF5ZXIgaGFzIEFMTCBhY2VzXG4gICAgICAgICAgICBpZihzdWl0ZXMubGVuZ3RoPDQpeyAvLyBidXQgbm90IGFsbCBzdWl0ZXNcbiAgICAgICAgICAgICAgICAvLyBhbGwgdGhlIHN1aXRzIHRoZSB1c2VyIGRvZXMgbm90IGhhdmUgYXJlIGFsbG93ZWQgKGFza2luZyB0aGUgYWNlIGJsaW5kISEhKVxuICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz1bMCwxLDIsM10uZmlsdGVyKChzdWl0ZSk9PntyZXR1cm4gcG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2Yoc3VpdGUpPDA7fSk7XG4gICAgICAgICAgICB9ZWxzZXsgLy8gaGFzIGFsbCBzdWl0cywgc28gYSBraW5nIGlzIHRvIGJlIHNlbGVjdGVkISEhXG4gICAgICAgICAgICAgICAgLy8gYWxsIGtpbmdzIGFjY2VwdGFibGUgZXhjZXB0IGZvciB0aGF0IGluIHRoZSB0cnVtcCBjb2xvclxuICAgICAgICAgICAgICAgIC8vIE5PVEUgaWYgYSBwZXJzb24gYWxzbyBoYXMgYWxsIHRoZSBraW5ncyB3ZSBoYXZlIGEgc2l0dWF0aW9uLCB3ZSBzaW1wbHkgY29udGludWUgb253YXJkXG4gICAgICAgICAgICAgICAgd2hpbGUoMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rLS07XG4gICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRydW1wU3VpdGVJbmRleD1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZih0aGlzLl90cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHJ1bXBTdWl0ZUluZGV4Pj0wKXBvc3NpYmxlUGFydG5lclN1aXRlcy5zcGxpY2UodHJ1bXBTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPjApYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzPXBvc3NpYmxlUGFydG5lclN1aXRlcy5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgd2hpbGUocGFydG5lclN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZU5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IFwiK0NhcmQuQ0FSRF9OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua10rXCIgc2hvdWxkIHlvdXIgcGFydG5lciBoYXZlIChvcHRpb25zOiAnXCIrcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgcGFydG5lclN1aXRlPXBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuaW5kZXhPZihwYXJ0bmVyU3VpdGVOYW1lKTtcbiAgICAgICAgICAgIGlmKHBhcnRuZXJTdWl0ZT49MCl7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBwbGF5IGEgY2FyZCBhbmQgYWRkIGl0IHRvIHRoZSBnaXZlbiB0cmlja1xuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBwbGF5QUNhcmQodHJpY2spe1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBhc2tlZCB0byBwbGF5IGEgY2FyZC5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCB1c2luZyB0aGUgZmlyc3QgbGV0dGVycyBvZiB0aGUgYWxwaGFiZXQ/XG4gICAgICAgIGxldCBwb3NzaWJsZUNhcmROYW1lcz1bXTtcbiAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MDtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKVxuICAgICAgICAgICAgcG9zc2libGVDYXJkTmFtZXMucHVzaChTdHJpbmcuY2FyZEluZGV4KzEpK1wiOiBcIit0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBsZXQgY2FyZFBsYXlJbmRleD0tMTtcbiAgICAgICAgd2hpbGUoY2FyZFBsYXlJbmRleDwwKXtcbiAgICAgICAgICAgIC8vIHdlJ3JlIHN1cHBvc2VkIHRvIHBsYXkgYSBjYXJkIHdpdGggc3VpdGUgZXF1YWwgdG8gdGhlIGZpcnN0IGNhcmQgdW5sZXNzIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgaXMgYmVpbmcgYXNrZWQgZm9yXG4gICAgICAgICAgICBsZXQgY2FyZElkPXBhcnNlSW50KHByb21wdChcIkBcIit0aGlzLm5hbWUrXCJcXG5QcmVzcyB0aGUgaWQgb2YgdGhlIGNhcmQgeW91IHdhbnQgdG8gYWRkIHRvIFwiK3RyaWNrLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiIChvcHRpb25zOiAnXCIrcG9zc2libGVDYXJkTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixcIlwiKSk7XG4gICAgICAgICAgICBpZihpc05hTihjYXJkSWQpKWNvbnRpbnVlO1xuICAgICAgICAgICAgY2FyZFBsYXlJbmRleD1jYXJkSWQtMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDYXJkKHRoaXMuX2NhcmRzW2NhcmRQbGF5SW5kZXhdKTtcbiAgICB9XG5cbiAgICBzZXQgcGFydG5lcihwYXJ0bmVyKXt0aGlzLl9wYXJ0bmVyPSh0eXBlb2YgcGFydG5lcj09PSdudW1iZXInP3BhcnRuZXI6LTEpO30gLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIHRyaWNrV29uKHRyaWNrSW5kZXgpe1xuICAgICAgICB0aGlzLl90cmlja3NXb24ucHVzaCh0cmlja0luZGV4KTtcbiAgICAgICAgdGhpcy5sb2coXCJUcmljayAjXCIrdHJpY2tJbmRleCtcIiB3b24gYnkgJ1wiK3RoaXMubmFtZStcIic6IFwiK3RoaXMuX3RyaWNrc1dvbitcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IG51bWJlck9mVHJpY2tzV29uKCl7cmV0dXJuIHRoaXMuX3RyaWNrc1dvbi5sZW5ndGg7fVxuICAgIFxuICAgIGdldE51bWJlck9mVHJpY2tzV29uKCl7XG4gICAgICAgIC8vIHJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIHRyaWNrcyB3b24gKGluY2x1ZGluZyB0aG9zZSBieSB0aGUgcGFydG5lciAoaWYgYW55KSlcbiAgICAgICAgcmV0dXJuKHRoaXMubnVtYmVyT2ZUcmlja3NXb24rdGhpcy5fZ2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHRoaXMucGFydG5lcikpO1xuICAgIH1cblxuICAgIHNldE51bWJlck9mVHJpY2tzVG9XaW4obnVtYmVyT2ZUcmlja3NUb1dpbil7dGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj1udW1iZXJPZlRyaWNrc1RvV2luO31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NUb1dpbigpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luO31cbiAgICBcbiAgICAvLyBldmVyeSBwbGF5ZXIgY2FuIGJlIGNoZWNrZWQgd2hldGhlciBmcmllbmQgKDEpIG9yIGZvbyAoLTEpIG9yIHVua25vd24gKDApXG4gICAgaXNGcmllbmRseShwbGF5ZXIpe1xuICAgICAgICBpZihwbGF5ZXI9PT10aGlzLl9pbmRleClyZXR1cm4gMjsgLy8gSSdtIG11Y2hvIGZyaWVuZGx5IHRvIG15c2VsZlxuICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCk7XG4gICAgICAgIGlmKHBhcnRuZXJTdWl0ZT49MCl7IC8vIGEgbm9uLXNvbGl0YXJ5IGdhbWVcbiAgICAgICAgICAgIC8vIEFTU0VSVCBub3QgYSBzb2xpdGFyeSBnYW1lIHNvIHBsYXllciBjb3VsZCBiZSB0aGUgcGFydG5lciBpbiBjcmltZVxuICAgICAgICAgICAgLy8gaWYgcGFydG5lciBpcyBrbm93biAoaS5lLiB0aGUgcGFydG5lciBjYXJkIGlzIG5vIGxvbmdlciBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXI+PTApcmV0dXJuKHBsYXllcj09PXRoaXMuX3BhcnRuZXI/MTotMSk7IFxuICAgICAgICAgICAgLy8gQVNTRVJUIHBhcnRuZXIgdW5rbm93biAoaS5lLiBwYXJ0bmVyIGNhcmQgc3RpbGwgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBsZXQgdHJ1bXBQbGF5ZXI9dGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpO1xuICAgICAgICAgICAgLy8gaWYgSSdtIHRoZSB0cnVtcCBwbGF5ZXIsIGFzc3VtZSBBTEwgdW5mcmllbmRseSBCVVQgbm8gSSBkb24ndCBrbm93IHdobyBteSBwYXJ0bmVyIGlzIGFsbCBjb3VsZCBiZVxuICAgICAgICAgICAgaWYodGhpcy5faW5kZXg9PT10cnVtcFBsYXllcilyZXR1cm4gMDsgLy8gdW5rbm93blxuICAgICAgICAgICAgaWYodGhpcy5jb250YWluc0NhcmQocGFydG5lclN1aXRlLHRoaXMuX2dhbWUuZ2V0UGFydG5lclJhbmsoKSkpIC8vIEkgaGF2ZSB0aGUgcGFydG5lciBjYXJkXG4gICAgICAgICAgICAgICAgcmV0dXJuKHBsYXllcj09dHJ1bXBQbGF5ZXI/MTotMSk7IC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZnJpZW5kbHksIHRoZSBvdGhlcnMgYXJlIHVuZnJpZW5kbHlcbiAgICAgICAgICAgIC8vIEFTU0VSVCBJJ20gbm90IHRoZSB0cnVtcCBwbGF5ZXIsIGFuZCBJJ20gbm90IHdpdGggdGhlIHRydW1wIHBsYXllciBhcyB3ZWxsXG4gICAgICAgICAgICAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZvbywgdGhlIHJlc3QgSSBkb24ndCBrbm93IHlldFxuICAgICAgICAgICAgcmV0dXJuKHBsYXllcj09PXRydW1wUGxheWVyPy0xOjApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFTU0VSVCBhIHNvbGl0YXJ5IGdhbWVcbiAgICAgICAgLy8gaWYgSSdtIG9uZSBvZiB0aGUgc29saXRhcnkgcGxheWVycywgZXZlcnlvbmUgZWxzZSBpcyBhIGZvb1xuICAgICAgICBpZih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZih0aGlzLl9pbmRleCk+PTApcmV0dXJuIC0xO1xuICAgICAgICAvLyBBU1NFUlQgbm90IG9uZSBvZiB0aGUgc29saXRhcnkgcGxheWVyc1xuICAgICAgICAvLyAgICAgICAgaWYgcGxheWVyIGlzIGEgc29saXRhcnkgcGxheWVyIGl0J3MgYSBmb28sIG90aGVyd2lzZSBpdCdzIHVzIGFnYWluc3QgdGhlbSEhISFcbiAgICAgICAgcmV0dXJuKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHBsYXllcik+PTA/LTE6MSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gdGhpcy5uYW1lO31cblxufVxuXG4vLyBleHBvcnQgdGhlIFBsYXllciBjbGFzc1xubW9kdWxlLmV4cG9ydHM9e1BsYXllckV2ZW50TGlzdGVuZXIsUGxheWVyR2FtZSxQbGF5ZXJ9OyIsImNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7IC8vIGZvciBjb21wYXJpbmcgY2FyZHNcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbmNsYXNzIFRyaWNrIGV4dGVuZHMgQ2FyZEhvbGRlcntcblxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IGdhbWUgZGF0YSBtb3ZlZCBvdmVyIHRvIFBsYXllckdhbWUgaW5zdGFuY2UgKGFzIHBhc3NlZCB0byBlYWNoIHBsYXllcilcbiAgICAvLyAgICAgICAgICAgICAgICBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCBibGluZCBub3cgZGV0ZXJtaW5lZCBieSB0aGUgZ2FtZSAoZW5naW5lKSBpdHNlbGZcblxuICAgIC8vIGJ5IHBhc3NpbmcgaW4gdGhlIHRydW1wIHBsYXllciAoaS5lLiB0aGUgcGVyc29uIHRoYXQgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZClcbiAgICBjb25zdHJ1Y3RvcihmaXJzdFBsYXllcix0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayxjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCxmaXJzdFBsYXllckNhblBsYXlTcGFkZXMpeyAvLyByZXBsYWNpbmc6IHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLHRydW1wUGxheWVyKXtcbiAgICAgICAgc3VwZXIoKTsgLy8gdXNpbmcgNCBmaXhlZCBwb3NpdGlvbnMgZm9yIHRoZSB0cmljayBjYXJkcyBzbyB3ZSB3aWxsIGtub3cgd2hvIHBsYXllZCB0aGVtISEhIVxuICAgICAgICB0aGlzLl9maXJzdFBsYXllcj1maXJzdFBsYXllcjtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlOyAvLyBmb3IgaW50ZXJuYWwgdXNlIHRvIGJlIGFibGUgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXIgb2YgYSB0cmlja1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMuX3BhcnRuZXJSYW5rPXBhcnRuZXJSYW5rOyAvLyBuZWVkIHRoaXMgd2hlbiBpdCdzIGJlaW5nIGFza2VkIHRvIGRldGVybWluZSB0aGUgd2lubmVyXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPWNhbkFza0ZvclBhcnRuZXJDYXJkOyAvLyAtMSBibGluZCwgMCBub3QsIDEgbm9uLWJsaW5kXG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTA7IC8vIHRoZSAnZmxhZycgc2V0IGJ5IHRoZSB0cnVtcCBwbGF5ZXIgd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gYSB0cmlja1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9LTE7IC8vIHRoZSBzdWl0ZSBvZiB0aGUgdHJpY2sgKG1vc3Qgb2YgdGhlIHRpbWUgdGhlIHN1aXRlIG9mIHRoZSBmaXJzdCBjYXJkKVxuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPS0xOyAvLyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIChub3RlOiBOT1QgdHJhbnNmb3JtZWQgdG8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggeWV0KVxuICAgICAgICB0aGlzLl9maXJzdFBsYXllckNhblBsYXlTcGFkZXM9Zmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO1xuICAgICAgICAvLyBsZXQncyBrZWVwIHRyYWNrIG9mIHRoZSBoaWdoZXN0IGNhcmRcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGNhbiBhc2sgZm9yIHBhcnRuZXIgY2FyZDogXCIrY2FuQXNrRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlczogXCIrZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcygpe3JldHVybiB0aGlzLl9maXJzdFBsYXllckNhblBsYXlTcGFkZXM7fVxuICAgIFxuICAgIC8vIHRoZSB3aW5uZXIgZXhwb3NlZCBpcyB0aGUgYWN0dWFsIHBsYXllciB3aG8gd29uXG4gICAgZ2V0IHdpbm5lcigpe3JldHVybih0aGlzLl93aW5uZXJDYXJkPDA/LTE6KHRoaXMuX3dpbm5lckNhcmQrdGhpcy5fZmlyc3RQbGF5ZXIpJTQpO31cbiAgICBcbiAgICAvLyBNREhAMDdERUMyMDE5OiBtb3ZlZCBmcm9tIGhlcmUgdG8gdGhlIGdhbWUgKGFzIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAgICAvKlxuICAgIGdldCB0cnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9IC8vIGV4cG9zZXMgdGhlIGN1cnJlbnQgdHJ1bXAgcGxheWVyXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG4gICAgKi9cbiAgICBnZXQgYXNraW5nRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ7fVxuXG4gICAgLy8gcGFzcyBpbiAtMSB3aGVuIGFza2luZyB0aGUgcGFydG5lciBjYXJkIGJsaW5kLCBvciArMSB3aGVuIGFza2luZyBmb3IgaXQgKG5vbi1ibGluZClcbiAgICBzZXQgYXNraW5nRm9yUGFydG5lckNhcmQoYXNraW5nRm9yUGFydG5lckNhcmQpe1xuICAgICAgICBpZih0eXBlb2YgYXNraW5nRm9yUGFydG5lckNhcmQhPT1cIm51bWJlclwiKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEFza2luZyBmb3IgcGFydG5lciBjYXJkIE5PVCBkZWZpbmVkIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5udW1iZXJPZkNhcmRzPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGdldmVuIGRlIHBhcnRuZXIgYWFzL2hlZXIgKGJsaW5kKSB0ZSB2cmFnZW4gbmlldCBtZWVyIHRvZWdlc3RhYW4uXCIpO1xuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBzZXQgdG8gXCIrdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIF9zZXRXaW5uZXJDYXJkKHdpbm5lckNhcmQpe1xuICAgICAgICB0aGlzLl93aW5uZXJDYXJkPXdpbm5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJpY2sgd2lubmVyIGNhcmQ6IFwiK3dpbm5lckNhcmQrXCIuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGNhcmQgcGxheWVkIGJ5ICh0aGUgYWN0dWFsKSBwbGF5ZXIgKGFzIHVzZWQgZm9yIHNob3dpbmcgdGhlIHRyaWNrIGNhcmRzKVxuICAgICAqIEBwYXJhbSB7Kn0gcGxheWVyIFxuICAgICAqL1xuICAgIGdldFBsYXllckNhcmQocGxheWVyKXtcbiAgICAgICAgbGV0IHBsYXllckNhcmQ9KHRoaXMuX2ZpcnN0UGxheWVyPj0wPyhwbGF5ZXIrNC10aGlzLl9maXJzdFBsYXllciklNDpudWxsKTtcbiAgICAgICAgcmV0dXJuKHBsYXllckNhcmQ+PTAmJnBsYXllckNhcmQ8dGhpcy5udW1iZXJPZkNhcmRzP3RoaXMuX2NhcmRzW3BsYXllckNhcmRdOm51bGwpO1xuICAgIH1cblxuICAgIC8qXG4gICAgYXNraW5nRm9yUGFydG5lckNhcmQoKXtcbiAgICAgICAgaWYodGhpcy5fY2FyZHMubGVuZ3RoPjApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgIGlmKCF0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZEJsaW5kKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCAoYW55bW9yZSkuXCIpO1xuICAgICAgICB0aGlzLl9wbGF5U3VpdGU9dGhpcy5fdHJ1bXBTdWl0ZTsgLy8gdGhlIHBsYXkgc3VpdGUgYmVjb21lcyB0aGUgdHJ1bXAgc3VpdGVcbiAgICB9XG4gICAgKi9cbiAgICAvLyBOT1RFIGFkZENhcmQgaXMgTk9UIF9hZGRDYXJkIG9mIHRoZSBzdXBlcmNsYXNzISB0aGlzIGlzIGJlY2F1c2Ugd2Ugc2hvdWxkIHNldCB0aGUgaG9sZGVyIG9uIHRoZSBjYXJkIHRvIGFkZCEhISFcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBsZXQgbnVtYmVyT2ZDYXJkc05vdz10aGlzLm51bWJlck9mQ2FyZHM7XG4gICAgICAgICAvLyBpZiB0aGUgZmxhZyBvZiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgaXMgc2V0LCBwcmVzZXQgdGhlIFxuICAgICAgICBjYXJkLmhvbGRlcj10aGlzOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoaXMgdHJpY2sgYnkgc2V0dGluZyB0aGUgaG9sZGVyIHByb3BlcnR5ICh3aWxsIHRha2UgY2FyZSBvZiBhZGRpbmcvcmVtb3ZpbmcgdGhlIGNhcmQpXG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IHNob3VsZCBjb25zaWRlciByZXR1cm5pbmcgYW4gRXJyb3IgaW5zdGVhZCBvZiB0aHJvd2luZyBhbiBlcnJvclxuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM8PW51bWJlck9mQ2FyZHNOb3cpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGFkZCB0aGUgY2FyZCB0byB0aGUgdHJpY2suXCIpO1xuICAgICAgICAvLyBBU1NFUlQgY2FyZCBhZGRlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMuX3RydW1wU3VpdGU8MClcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJCVUc6IEFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCwgYnV0IHBsYXlpbmcgYSBnYW1lIHdpdGhvdXQgdHJ1bXAuXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IgYmxpbmQgZXZlcnlvbmUgaGFzIHRvIHBsYXkgdGhlIHBhcnRuZXIgY2FyZCBzdWl0ZVxuICAgICAgICAvLyBNREhAMDlERUMyMDE5OiBPT1BTIEkgd2FzIGFscmVhZHkgdXNpbmcgdGhpcy5fcGFydG5lclN1aXRlIGhlcmUgQlVUIHN0aWxsIGFmdGVyIGFjdHVhbGx5IHRha2luZyBpdCBvdXQgKG5vdyBpbiBhZ2FpbilcbiAgICAgICAgaWYodGhpcy5fcGxheVN1aXRlPDApeyAvLyBmaXJzdCBjYXJkIGJlaW5nIHBsYXllZFxuICAgICAgICAgICAgLy8gTURIQDE4SkFOMjAyMDogYXNjZXJ0YWluIHRoYXQgX2Fza2luZ0ZvclBhcnRuZXJDYXJkIGhhcyB0aGUgcmlnaHQgdmFsdWVcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IGNvdWxkIGJlIDAgYnV0IHdoZW4gdGhlIHBhcnRuZXIgc3VpdGUgaXMgcGxheWVkIHRoZSBwbGF5ZXIgSVMgYXNraW5nXG4gICAgICAgICAgICBpZih0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9PTApeyAvLyBwbGF5ZXIgc3VwcG9zZWRseSBjYW4gc3RpbGwgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8PTAmJmNhcmQuc3VpdGU9PT10aGlzLl9wYXJ0bmVyU3VpdGUpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDwwKXRocm93IG5ldyBFcnJvcihcIkJVRzogQ2Fubm90IGFzayB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJJbXBsaWNpdGx5IGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBieSBwbGF5aW5nIHRoZSBwYXJ0bmVyIHN1aXRlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PTApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIHdoZW4geW91IGNhbid0IGFzayBmb3IgaXQgYW55bW9yZSFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wbGF5U3VpdGU9KHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDA/dGhpcy5fcGFydG5lclN1aXRlOmNhcmQuc3VpdGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFTU0VSVCB0aGlzLl9wbGF5U3VpdGUgbm93IGRlZmluaXRlbHkgbm9uLW5lZ2F0aXZlLCBzb1xuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB1c2UgdGhlIHJpZ2h0IHByb3BlcnR5IGJybydcbiAgICAgICAgLy8gdXBkYXRlIHdpbm5lclxuICAgICAgICBpZihudW1iZXJPZkNhcmRzTm93PjApe1xuICAgICAgICAgICAgLy8gTURIQDA5REVDMjAxOTogd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgb25seSB0aGUgcGFydG5lciBjYXJkIGNhbiBldmVyIHdpbiAoZXZlbiBpZiB0aGVyZSdzIHRydW1wISEpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBidXQgd2UgbmVlZCB0byBrbm93IHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCB3YXMgYWxyZWFkeSB0aHJvd25cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIFNPTFVUSU9OOiAoTkVBVCkgaXQncyBlYXNpZXN0IHRvIHNpbXBseSBpZ25vcmUgdHJ1bXAgaXMgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBmb3IhISEhISFcbiAgICAgICAgICAgIGlmKENhcmQuY29tcGFyZUNhcmRzV2l0aFBsYXlBbmRUcnVtcFN1aXRlKGNhcmQsdGhpcy5fY2FyZHNbdGhpcy5fd2lubmVyQ2FyZF0sdGhpcy5fcGxheVN1aXRlLCh0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MD8tMTp0aGlzLl90cnVtcFN1aXRlKSk+MClcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKG51bWJlck9mQ2FyZHNOb3cpO1xuICAgICAgICB9ZWxzZSAvLyBhZnRlciB0aGUgZmlyc3QgY2FyZCB0aGUgZmlyc3QgcGxheWVyIGlzIHRoZSB3aW5uZXIgb2YgY291cnNlXG4gICAgICAgICAgICB0aGlzLl9zZXRXaW5uZXJDYXJkKDApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2V0Q2FyZFBsYXllcihzdWl0ZSxyYW5rKXtcbiAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MDtjYXJkSW5kZXg8dGhpcy5fY2FyZHMubGVuZ3RoO2NhcmRJbmRleCsrKVxuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT09PXN1aXRlJiZ0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnJhbms9PT1yYW5rKVxuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmlyc3RQbGF5ZXIrY2FyZEluZGV4KSU0OyAvLyBUT0RPIGNhbiB3ZSBhc3N1bWUgNCBwbGF5ZXJzIGluIHRvdGFsPz8/Pz9cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8vIHB1YmxpYyBnZXR0ZXJzXG4gICAgZ2V0IHBsYXlTdWl0ZSgpe3JldHVybiB0aGlzLl9wbGF5U3VpdGU7fVxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICAvKlxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgICovXG4gICAgZ2V0IGNhbkFza0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkO31cbn1cblxubW9kdWxlLmV4cG9ydHM9VHJpY2s7XG4iLCIvKipcbiAqIHRoZSBwYXJ0IHRoYXQgcnVucyBpbiB0aGUgYnJvd3NlciBvZiBhIHNpbmdsZSBwbGF5ZXJcbiAqIGdpdmVuIHRoYXQgYW55IGluZm9ybWF0aW9uIHRvIHRoZSBjdXJyZW50IHBsYXllciBvZiB0aGUgZ2FtZSBzaG91bGQgYmUgYXZhaWxhYmxlIHRocm91Z2ggaXQncyBfZ2FtZSBwcm9wZXJ0eSAoaS5lLiBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gKiBhbGwgY2FsbHMgaW4gbWFpbi5qcyB0byByaWtrZW5UaGVHYW1lIGRpcmVjdGx5IHNob3VsZCBiZSByZXBsYWNlZCB3aXRoIGNhbGxzIHRvIGN1cnJlbnRQbGF5ZXIuZ2FtZSBpLmUuIHJpa2tlblRoZUdhbWUgaXRzZWxmIGlzIG5vIGxvbmdlciBhdmFpbGFibGUgdG8gdGhlIGN1cnJlbnRQbGF5ZXIhISFcbiAqIFxuKiovXG4vLyB3ZSdsbCBiZSB1c2luZyBQbGF5ZXIuanMgb25seSAoUGxheWVyLmpzIHdpbGwgZGVhbCB3aXRoIHJlcXVpcmluZyBDYXJkSG9sZGVyLCBhbmQgQ2FyZEhvbGRlciBDYXJkKVxuLy8gTk8gSSBuZWVkIHRvIHJlcXVpcmUgdGhlbSBhbGwgb3RoZXJ3aXNlIGJyb3dzZXJpZnkgd29uJ3QgYmUgYWJsZSB0byBmaW5kIENhcmQsIGV0Yy5cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuY29uc3QgVHJpY2s9cmVxdWlyZSgnLi9Ucmljay5qcycpOyAvLyBub3cgaW4gc2VwYXJhdGUgZmlsZVxuY29uc3Qge1BsYXllckV2ZW50TGlzdGVuZXIsUGxheWVyR2FtZSxQbGF5ZXJ9PXJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XG5cbmNvbnN0IExhbmd1YWdlPXJlcXVpcmUoJy4vTGFuZ3VhZ2UuanMnKTtcbi8qIHJlcGxhY2luZzpcbmNsYXNzIExhbmd1YWdle1xuICAgIHN0YXRpYyBnZXQgREVGQVVMVF9QTEFZRVJTKCl7cmV0dXJuIFtbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiXSxbXCJNYXJjXCIsXCJKdXJnZW5cIixcIk1vbmlrYVwiLFwiQW5uYVwiLFwiXCJdXTt9O1xuICAgIC8vIHBvc3NpYmxlIHJhbmtzIGFuZCBzdWl0ZXMgKGluIER1dGNoKVxuICAgIHN0YXRpYyBnZXQgRFVUQ0hfUkFOS19OQU1FUygpe3JldHVybiBbXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiYm9lclwiLFwidnJvdXdcIixcImhlZXJcIixcImFhc1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgRFVUQ0hfU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wicnVpdGVuXCIsXCJrbGF2ZXJlblwiLFwiaGFydGVuXCIsXCJzY2hvcHBlblwiXTt9O1xufVxuKi9cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpe3JldHVybihzdHI/KHN0ci5sZW5ndGg/c3RyWzBdLnRvVXBwZXJDYXNlKCkrc3RyLnNsaWNlKDEpOlwiXCIpOlwiP1wiKTt9XG5cbmZ1bmN0aW9uIGdldE51bWJlck9mVHJpY2tzV29uVGV4dChjb3VudCl7XG4gICAgaWYoY291bnQ9PT0tMilyZXR1cm4gXCI/XCI7XG4gICAgaWYoY291bnQ8MClyZXR1cm4gXCJvbmJla2VuZFwiO1xuICAgIGlmKGNvdW50PjEzKXJldHVybiBcIm9ubW9nZWxpamtcIjtcbiAgICByZXR1cm4gW1wiZ2VlblwiLFwiZWVuXCIsXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiZWxmXCIsXCJ0d2FhbGZcIixcImFsbGVtYWFsXCJdKGNvdW50KTtcbn1cblxuZnVuY3Rpb24gYnVnKGJ1Zyl7XG4gICAgYWxlcnQoXCJFcm5zdGlnZSBwcm9ncmFtbWFmb3V0OiBcIitidWcrXCIuXFxuUmFwcG9ydGVlciBkZXplIGZvdXQsIGVuIGJyZWVrIGhldCBzcGVsIGFmLlwiKTtcbn1cblxuY29uc3QgVklTSUJMRT1cImluaGVyaXRcIjsgLy8gTURIQDAzRkVCMjAyMDogaWYgd2UnZCB1c2UgdmlzaWJsZSwgaXQgd291bGQgaWdub3JlIHdoYXQgdGhlIHBhcmVudCdzIHZpc2liaWxpdHkgaXMsIGFuZCBrZWVwIHNob3dpbmcuLi5cblxuLy8gTURIQDA3SkFOMjAyMDogYWRkaW5nIGVudGVyaW5nIHRoZSBpZCBvZiB0aGUgdXNlciBvbiBwYWdlLXNldHRpbmdzLCBzbyB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgYSBuZXcgb25lXG4vLyAgICAgICAgICAgICAgICBhbHRlcm5hdGl2ZWx5IHdlIGNhbiBkbyB0aGF0IG9uIGEgc2VwYXJhdGUgcGFnZSAvIHBhZ2UtYXV0aCBpcyBPS1xuLy8gICAgICAgICAgICAgICAgd2UgZ28gdG8gcGFnZS1hdXRoIHdoZW4gTk9UIHBsYXlpbmcgdGhlIGdhbWUgaW4gZGVtbyBtb2RlISEhXG4vLyAgICAgICAgICAgICAgICBpbiBub24tZGVtbyBtb2RlIHlvdSBpZGVudGlmeSB5b3Vyc2VsZiwgdGhlbiB3aGVuIHNldFBsYXllck5hbWUgaXMgc3VjY2Vzc2Z1bCBnbyB0byBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbi8vIE1ESEAxMEpBTjIwMjA6IHJlbW92aW5nIHBhZ2Utc2V0dGluZ3MgYW5kIHBhZ2Utc2V0dXAtZ2FtZSwgYWRkaW5nIHBhZ2UtaGVscFxuY29uc3QgUEFHRVM9W1wicGFnZS1ydWxlc1wiLFwicGFnZS1oZWxwXCIsXCJwYWdlLWF1dGhcIixcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiLFwicGFnZS1iaWRkaW5nXCIsXCJwYWdlLXRydW1wLWNob29zaW5nXCIsXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIixcInBhZ2UtcGxheS1yZXBvcnRpbmdcIixcInBhZ2UtcGxheWluZ1wiLFwicGFnZS1maW5pc2hlZFwiXTtcblxudmFyIGN1cnJlbnRQYWdlPW51bGw7IC8vIGxldCdzIGFzc3VtZSB0byBiZSBzdGFydGluZyBhdCBwYWdlLXJ1bGVzXG52YXIgdmlzaXRlZFBhZ2VzPVtdOyAvLyBubyBwYWdlcyB2aXNpdGVkIHlldFxuXG52YXIgY3VycmVudFBsYXllcj1udWxsOyAvLyB0aGUgY3VycmVudCBnYW1lIHBsYXllclxuXG52YXIgY3VycmVudEdhbWU9bnVsbDsgLy8gd2UgcmVtZW1iZXIgdGhlIGdhbWUgdW50aWwgd2Ugbm8gbG9uZ2VyIG5lZWQgaXRcblxuZnVuY3Rpb24gc3RvcFBsYXlpbmcoKXtcbiAgICAvLyBBU1NFUlQgYXNzdW1pbmcgbm90IHBsYXlpbmcgaW4gYSBnYW1lIGFueW1vcmUgaS5lLiBuZXdHYW1lKCkgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZVxuICAgIC8vIGEgTk9STUFMIGV4aXRcbiAgICBpZighY3VycmVudFBsYXllcilyZXR1cm4gYWxlcnQoXCJKZSBiZW50IGFsIGFmZ2VtZWxkIVwiKTtcbiAgICBjdXJyZW50UGxheWVyLmV4aXQoJ1NUT1AnKTtcbiAgICAvLyAnbWFudWFsbHknIG1vdmUgdG8gdGhlIHByZXZpb3VzICdwYWdlJyBpbiB0aGUgaGlzdG9yeS4uLlxuICAgIGNvbnNvbGUubG9nKFwiTGVuZ3RoIG9mIGhpc3Rvcnk6IFwiLHdpbmRvdy5oaXN0b3J5Lmxlbmd0aCk7XG4gICAgd2luZG93Lmhpc3RvcnkuZ28od2luZG93Lmhpc3RvcnkubGVuZ3RoPjA/LTE6MCk7XG59XG5cbi8vIE1ESEAxMEpBTjIwMjA6IG5ld0dhbWUoKSBpcyBhIGJpZCBkaWZmZXJlbnQgdGhhbiBpbiB0aGUgZGVtbyB2ZXJzaW9uIGluIHRoYXQgd2UgcmV0dXJuIHRvIHRoZSB3YWl0aW5nLXBhZ2VcbmZ1bmN0aW9uIG5ld0dhbWUoKXtcbiAgICAvLyBieSBjYWxsIHBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCw/KSB3ZSBmb3JjZSBjbGVhcmluZyB0aGUgZ2FtZSBpbmZvcm1hdGlvbiBiZWluZyBzaG93biBhdCB0aGUgd2FpdC1mb3ItcGxheWVycyBwYWdlXG4gICAgaWYoIWN1cnJlbnRQbGF5ZXIpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IE5vIHBsYXllciB0byBzdGFydCBhIG5ldyBnYW1lIHdpdGghXCIpO1xuICAgICAgICBzdG9wUGxheWluZygpO1xuICAgIH1lbHNlXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleChudWxsLC0xKTtcbn1cblxudmFyIHRvTWFrZUFCaWQ9MCxiaWRNYWRlSW5mbz1udWxsOyAvLyBNREhAMDNGRUIyMDIwOiBzb21lIHByb3RlY3Rpb24gZm9yIHByZXZlbnRpbmcgbWFraW5nIGEgYmlkIHdoZW4gbm90IGJlaW5nIGFza2VkIG9yIGFmdGVyIGhhdmluZyBtYWRlIGEgYmlkXG52YXIgdG9QbGF5QUNhcmQ9MCxwbGF5ZWRDYXJkSW5mbz1udWxsOyAvLyBNREhAMDVGRUIyMDIwOiB0aGUgY2FyZCBwbGF5ZWQgdGhhdCBuZWVkcyB0byBiZSByZW1lbWJlcmVkIHNvIHdlIGNhbiBzZW5kIGl0IGFnYWluXG5cbmZ1bmN0aW9uIGdldExvY2FsZUNhcmRUZXh0KGNhcmQpe3JldHVybiBMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tjYXJkLnN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2NhcmQucmFua107fVxuXG4vLyBNREhAMjlKQU4yMDIwOiBkZWNpZGluZyB0byBhbHdheXMgc2hvdyB0aGUgdXNlciBuYW1lIGluIHRoZSBkb2N1bWVudCB0aXRsZSwgYW5kIHRvIGJsaW5rIGl0IHdoZW5cbi8vICAgICAgICAgICAgICAgIHVzZXIgaW5wdXQgaXMgcmVxdWlyZWRcbnZhciBmb3JjZUZvY3VzSWQ9bnVsbDtcbnZhciBmb3JjZUZvY3VzVGV4dD1udWxsO1xuZnVuY3Rpb24gc3RvcEZvcmNlRm9jdXMoKXtjbGVhckludGVydmFsKGZvcmNlRm9jdXNJZCk7Zm9yY2VGb2N1c0lkPW51bGw7fVxuZnVuY3Rpb24gY2hlY2tGb2N1cyhzdGF0ZSl7XG4gICAgLy8gTURIQDIzSkFOMjAyMDogd2Ugc2hvdWxkIGtlZXAgYmxpbmtpbmcgd2hlbiBub3QgaW4gZm9jdXMgdW50aWwgZm9yY2VkIHRvIHN0b3BcbiAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHN0b3BwaW5nIHdoZW4gdGhlIGZvY3VzIHdhcyBnb3RcbiAgICAvLyBNREhAMjlKQU4yMDIwIHJlbW92aW5nIHRoaXMgc2hvdWxkIHN1ZmZpY2U6IGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSBcbiAgICAvLy8vLy8vLyB0b2dnbGVHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpO1xuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpe3Nob3dHYW1lU3RhdGUoc3RhdGUpO3N0b3BGb3JjZUZvY3VzKCk7fWVsc2UgdG9nZ2xlR2FtZVN0YXRlKHN0YXRlKTtcbn1cbmZ1bmN0aW9uIGZvcmNlRm9jdXMoc3RhdGUpe1xuICAgIC8vIGlmKHN0YXRlKVxuICAgIGZvcmNlRm9jdXNUZXh0PXN0YXRlO1xuICAgIHNob3dHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpOyAvLyBhc2NlcnRhaW4gdG8gc3RhcnQgd2l0aCB0aGUgZ2l2ZW4gbm9uLW51bGwgJ3N0YXRlJ1xuICAgIGlmKHN0YXRlKXsgLy8gZm9jdXMgcmVxdWVzdGVkXG4gICAgICAgIC8vIHN0YXJ0IGdldHRpbmcgdGhlIGZvY3VzIGJ5IGJsaW5raW5nICdzdGF0ZScgSUZGIHdlIGhhdmVuJ3QgZ290IGl0IHlldC4uLlxuICAgICAgICBpZighZm9yY2VGb2N1c0lkKWZvcmNlRm9jdXNJZD1zZXRJbnRlcnZhbCgoKT0+e2NoZWNrRm9jdXMoc3RhdGUpfSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIE1ESEAzMUpBTjIwMjA6IGtlZXAgYSAnc3RhdGUnIHdoaWNoIHdpbGwgZGV0ZXJtaW5lIHdoYXQgbWVzc2FnZXMgdGhlIHBsYXllciBjYW4gc2VuZCBvdmVyIHRvIHRoZSBzZXJ2ZXJcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU9MDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0JJRD0xO1xuY29uc3QgUExBWUVSU1RBVEVfQklEPTIsUExBWUVSU1RBVEVfQklEX0RPTkU9MyxQTEFZRVJTVEFURV9CSURfUkVDRUlWRUQ9NDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX1BMQVk9NTtcbmNvbnN0IFBMQVlFUlNUQVRFX1RSVU1QPTYsUExBWUVSU1RBVEVfVFJVTVBfRE9ORT03LFBMQVlFUlNUQVRFX1RSVU1QX1JFQ0VJVkVEPTg7XG5jb25zdCBQTEFZRVJTVEFURV9QQVJUTkVSPTksUExBWUVSU1RBVEVfUEFSVE5FUl9ET05FPTEwLFBMQVlFUlNUQVRFX1BBUlRORVJfUkVDRUlWRUQ9MTE7XG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9DQVJEPTEyO1xuY29uc3QgUExBWUVSU1RBVEVfQ0FSRD0xMyxQTEFZRVJTVEFURV9DQVJEX1BMQVlFRD0xNCxQTEFZRVJTVEFURV9DQVJEX1JFQ0VJVkVEPTE1O1xuY29uc3QgUExBWUVSU1RBVEVfR0FNRV9PVkVSPTE2O1xuY29uc3QgUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRFM9MTcsUExBWUVSU1RBVEVfR0FNRV9SRUNFSVZFRD0xOCxQTEFZRVJTVEFURV9DQVJEU19SRUNFSVZFRD0xOTtcbi8vIE1ESEAwMUZFQjIwMjA6IHdlJ3JlIE5PVCBhbGxvd2luZyB0byByZXNlbmQgdGhlIGNhcmQgcGxheWVkIGJlY2F1c2UgdGhhdCdzIGFscmVhZHkgZG9uZSAoZXZlcnkgMTAgc2Vjb25kcykgYnkgXG5jb25zdCBwbGF5ZXJTdGF0ZU1lc3NhZ2VzPVtcIklrIHdhY2h0IG9wIGVlbiBzcGVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGJvZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTW9tZW50amUgbm9nXCIsXCJCb2QgYWwgdmVyc3R1dXJkXCIsXCJCb2Qgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTGF0ZW4gd2Ugc3BlbGVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIlRyb2Vma2xldXIgYWwgZ2Vrb3plblwiLFwiVHJvZWZrbGV1ciBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcIk1vbWVudGplIG5vZ1wiLFwiUGFydG5lciBhbCBnZWtvemVuXCIsXCJLbGV1ciBwYXJ0bmVya2FhcnQgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGthYXJ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIkthYXJ0IGFsIGdlc3BlZWxkXCIsXCJLYWFydCBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIklrIHdhY2h0IG9wIGthYXJ0ZW5cIixcIlNwZWwgYmVnb25uZW5cIixcIkJlZGFua3Qgdm9vciBkZSBrYWFydGVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF07XG52YXIgY3VycmVudFBsYXllclN0YXRlPVBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU7XG52YXIgcmVzZW5kRXZlbnRJZD1udWxsO1xuZnVuY3Rpb24gYWxsb3dSZXNlbmRFdmVudCgpe1xuICAgIHNlbmRNZXNzYWdlQnV0dG9uLmRpc2FibGVkPWZhbHNlOyAvLyBlbmFibGUgdGhlIHNlbmQgbWVzc2FnZSBidXR0b25cbiAgICAvLyByZXNlbmRFdmVudElkPW51bGw7IC8vIG5vIG5lZWQgdG8gY2xlYXIgdGhlIHRpbWVvdXQgYXMgd2UncmUgZG9uZSBub3dcbn1cbnZhciBzZW5kTWVzc2FnZVRleHQ7XG5mdW5jdGlvbiBzZW5kTWVzc2FnZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICAvLyBpZiB3ZSBoYXZlIGEgcmVzZW5kIGV2ZW50IGlkIHdlJ3JlIGRlYWxpbmcgd2l0aCBhIHJlc2VuZCwgb3RoZXJ3aXNlIHdlIHNlbmQgdGhlIG1lc3NhZ2UgYXMgdmlzaWJsZSBvbiB0aGUgYnV0dG9uXG4gICAgaWYocmVzZW5kRXZlbnRJZCl7XG4gICAgICAgIC8vIHJlc2VuZCB0aGUgZXZlbnQgdG8gcmVzZW5kXG5cbiAgICAgICAgLy8gcmUtZW5hYmxlIHRoZSBjdXJyZW50IHN0YXRlIHdoaWNoIHdpbGwgZWZmZWN0aXZlbHkgZ3VhcmFudGVlIHRoYXQgdGhlIHVzZXIgY2FuIHJlc2VuZCBhZ2FpbiBpbiBhbm90aGVyIDUgc2Vjb25kc1xuICAgICAgICBzZXRQbGF5ZXJTdGF0ZShjdXJyZW50UGxheWVyU3RhdGUpO1xuICAgIH1lbHNle1xuICAgICAgICAvLyBkb24ndCBzZW5kIGFueSB0ZXh0IGlmIHNlbmRpbmcgdGhlIGRlZmF1bHQgdGV4dFxuICAgICAgICBsZXQgdGV4dFRvU2VuZD0oc2VuZE1lc3NhZ2VUZXh0LnZhbHVlIT09cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdP3NlbmRNZXNzYWdlVGV4dC52YWx1ZTonJyk7XG4gICAgICAgIC8vIGlmIG5vIHRleHQgZW50ZXJlZCB0byBiZSBzZW50LCBhc2sgcGxheWVyIHdoZXRoZXJcbiAgICAgICAgaWYodGV4dFRvU2VuZC50cmltKCkubGVuZ3RoPT09MCYmIXByb21wdChcIkVyIGlzIGdlZW4gdGUgdmVyc3R1cmVuIHRla3N0LiBXaWx0IFUgdG9jaCB2ZXJzdHVyZW4/XCIpKXJldHVybjtcbiAgICAgICAgc2V0SW5mbyhcIj9cIixcIkppalwiKTtcbiAgICAgICAgY3VycmVudEdhbWUuX3NvY2tldC5lbWl0KCdQTEFZRVJfU0FZUycseydzdGF0ZSc6Y3VycmVudFBsYXllclN0YXRlLCd0ZXh0Jzp0ZXh0VG9TZW5kfSwocmVzcG9uc2UpPT57XG4gICAgICAgICAgICBzZXRJbmZvKHJlc3BvbnNlJiZyZXNwb25zZS5sZW5ndGg+MD9yZXNwb25zZTpcIkJlcmljaHQgb250dmFuZ2VuLCBtYWFyIGdlZW4gYW50d29vcmQgZ2VzdHV1cmQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAvLyBpZiB0aGUgbWVzc2FnZSB0ZXh0IGRpZmZlcmVkIGZyb20gdGhlIGRlZmF1bHQgbWVzc2FnZSB3ZSBjbGVhciB0aGUgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBpZihzZW5kTWVzc2FnZVRleHQudmFsdWUhPT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0pc2VuZE1lc3NhZ2VUZXh0LnZhbHVlPScnO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRQbGF5ZXJTdGF0ZShwbGF5ZXJTdGF0ZSl7XG4gICAgLy9pZihyZXNlbmRFdmVudElkKXtjbGVhclRpbWVvdXQocmVzZW5kRXZlbnRJZCk7cmVzZW5kRXZlbnRJZD1udWxsO30gLy8gZ2V0IHJpZCBvZiBhbnkgcGVuZGluZyByZXNlbmQgZXZlbnQgdGltZW91dFxuICAgIGxldCByZXBsYWNlTWVzc2FnZVRleHQ9KHNlbmRNZXNzYWdlVGV4dC52YWx1ZS5sZW5ndGg9PT0wfHxzZW5kTWVzc2FnZVRleHQudmFsdWU9PT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0pOyAvLyB1c2VyIGhhc24ndCBjaGFuZ2VkIHRoZSB0ZXh0IHRvIHNlbmQgbWFudWFsbHkuLi5cbiAgICBjdXJyZW50UGxheWVyU3RhdGU9cGxheWVyU3RhdGU7XG4gICAgLy8gc2V0IHRoZSBtZXNzYWdlIHRleHQgb24gdGhlIHNlbmQgbWVzc2FnZSB0ZXh0IGlucHV0IGZpZWxkIGFjY29yZGluZ2x5XG4gICAgaWYocmVwbGFjZU1lc3NhZ2VUZXh0KXNlbmRNZXNzYWdlVGV4dC5pbm5lclRleHQ9cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdO1xuICAgIC8qIHJlc2VuZGluZyBhbHJlYWR5IG1hbmFnZWQgYnkgdGhlIGdhbWUgKHNlZSBjYXJkUGxheWVkLCBiaWRNYWRlLCB0cnVtcFN1aXRlQ2hvc2VuIGFuZCBwYXJ0bmVyU3VpdGVDaG9zZW4pXG4gICAgc2VuZE1lc3NhZ2VCdXR0b24uZGlzYWJsZWQ9KHNlbmRNZXNzYWdlVGV4dD09PVwiU3R1dXIgb3BuaWV1d1wiKTtcbiAgICAvLyBpZiB0aGUgYnV0dG9uIGlzIGN1cnJlbnRseSBkaXNhYmxlZCBvbmx5IGFsbG93IHJlc2VuZGluZyB0aGUgZXZlbnQgYnV0IG5vdCB1bnRpbCBhZnRlciA1IHNlY29uZHNcbiAgICBpZihzZW5kTWVzc2FnZUJ1dHRvbi5kaXNhYmxlZClyZXNlbmRFdmVudElkPXNldFRpbWVvdXQoYWxsb3dSZXNlbmRFdmVudCw1MDAwKTsgLy8gYWxsb3cgcmVzZW5kaW5nIGFmdGVyIDUgc2Vjb25kc1xuICAgICovXG59XG5cbi8vIG9mIGNvdXJzZTogZnJvbSBzdGFja292ZXJmbG93ISEhXG5mdW5jdGlvbiBkaWZmZXJlbmNlKGExLGEyKXt2YXIgYTJTZXQ9bmV3IFNldChhMik7cmV0dXJuIGExLmZpbHRlcigoeCk9PiFhMlNldC5oYXMoeCkpO31cblxudmFyIGJpZGRlckNhcmRzRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1jYXJkc1wiKTtcblxuZnVuY3Rpb24gaGFuZGxlQ29sbGFwc2luZ0V2ZW50KGV2ZW50KXtcbiAgICBsZXQgY29sbGFwc2luZ0J1dHRvbj1ldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbGxhcHNpbmdCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1idXR0b25cIik7IC8vIGEgaGEsIGRpZG4ndCBrbm93IHRoaXNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb2xsYXBzaW5nQnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtY29sbGFwc2libGVcIikpLnN0eWxlLmRpc3BsYXk9KHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJ1dHRvblwiKT9cImJsb2NrXCI6XCJub25lXCIpO1xufVxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbGxhcHNpbmdCdXR0b25zKCl7XG4gICAgLy8gTURIQDA1RkVCMjAyMDogYXR0YWNoIGV2ZW50IGhhbmRsZXIgb24gY2xpY2sgb2YgZXZlcnkgY29sbGFwc2libGUgYnV0dG9uIHRvZ2dsaW5nXG4gICAgZm9yKGxldCBjb2xsYXBzaW5nQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb2xsYXBzaW5nLWJ1dHRvblwiKSljb2xsYXBzaW5nQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGhhbmRsZUNvbGxhcHNpbmdFdmVudCk7XG59XG5cbi8vIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4vLyAgICAgdmFyIHYgPSBkb2N1bWVudC5jb29raWUubWF0Y2goJyhefDspID8nICsgbmFtZSArICc9KFteO10qKSg7fCQpJyk7XG4vLyAgICAgcmV0dXJuIHYgPyB2WzJdIDogbnVsbDtcbi8vIH1cbi8vIGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuLy8gICAgIHZhciBkID0gbmV3IERhdGU7XG4vLyAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMCpkYXlzKTtcbi8vICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIFwiO3BhdGg9LztleHBpcmVzPVwiICsgZC50b0dNVFN0cmluZygpO1xuLy8gfVxuLy8gZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHsgc2V0Q29va2llKG5hbWUsICcnLCAtMSk7IH1cblxuLyoqXG4gKiBzaG93cyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIHNob3dQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBiaWRzIHRhYmxlXG4gICAgc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKTtcbiAgICAvLyBzaG93IHRoZSBwbGF5ZXIgbmFtZXMgaW4gdGhlIGhlYWRlciByb3cgb2YgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgbGV0IHRyaWNrc1BsYXllZFRhYmxlSGVhZGVyPXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0aGVhZFwiKTtcbiAgICAgICAgbGV0IHJvdz10cmlja3NQbGF5ZWRUYWJsZUhlYWRlci5jaGlsZHJlblswXTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgZm9yKHBsYXllcj0wO3BsYXllcjw0O3BsYXllcisrKXtcbiAgICAgICAgICAgIGxldCBjZWxsPXJvdy5jaGlsZHJlbltwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICBsZXQgcGxheWVyTmFtZT0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVyKTpcIj9cIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgcmVwbGFjZWQgYnkgY3VycmVudFBsYXllci5nYW1lXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5hbWUgb2YgcGxheWVyICNcIisocGxheWVyKzEpK1wiOiAnXCIrcGxheWVyTmFtZStcIicuXCIpO1xuICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9cGxheWVyTmFtZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzaG93IHRoZSBwbGF5ZXIgbmFtZXMgaW4gdGhlIGNhcmRzIHBsYXllZCB0YWJsZSBhcyB3ZWxsXG4gICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4O1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudC1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzEpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wcG9zaXRlLXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMiklNCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzMpJTQpKTtcbn1cblxuLy8gd2hlbmV2ZXIgdGhlIHBsYXllciBjaGFuZ2VzLCBzaG93IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCl7XG4gICAgLy8gc2hvd0dhbWVTdGF0ZShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpudWxsKTsgLy8gc2hvdyB0aGUgY3VycmVudCBwbGF5ZXIgbmFtZSBpbW1lZGlhdGVseSBpbiB0aGUgdGl0bGVcbiAgICBmb3IobGV0IHBsYXllck5hbWVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZVwiKSlcbiAgICAgICAgaWYocGxheWVyTmFtZUVsZW1lbnQpXG4gICAgICAgICAgICBwbGF5ZXJOYW1lRWxlbWVudC5pbm5lckhUTUw9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOlwiP1wiKTtcbn1cblxuLyoqXG4gKiB1cGRhdGVzIHRoZSB3YWl0aW5nLWZvci1wbGF5ZXJzIHBhZ2VcbiAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIG9yIG5vdCBhIGdhbWUgaXMgYmVpbmcgcGxheWVkICh5ZXQpLCB3ZSBzaG93IHRoZSBnYW1lIGlkIGFuZCB0aGUgcGxheWVyIG5hbWVzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUdhbWVQbGF5ZXJOYW1lcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtbmFtZVwiKS5pbm5lckhUTUw9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5uYW1lOlwiXCIpO1xuICAgIGxldCBwbGF5ZXJOYW1lcz0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWVzKCk6bnVsbCk7XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lU3BhbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FtZS1wbGF5ZXItbmFtZVwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wbGF5ZXJOYW1lU3Bhbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pbmRleFwiKTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uaW5uZXJIVE1MPXBsYXllck5hbWVzW3BsYXllckluZGV4XTtcbiAgICAgICAgcGxheWVyTmFtZVNwYW4uY29sb3I9KHBsYXllckluZGV4PT1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleD9cIkJMVUVcIjpcIkJMQUNLXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjbGVhcnMgdGhlIGJpZHMgdGFibGVcbiAqIHRvIGJlIGNhbGxlZCB3aXRoIGV2ZXJ5IG5ldyBnYW1lXG4gKi9cbmZ1bmN0aW9uIGNsZWFyQmlkc1RhYmxlKGZpcnN0Q29sdW1uSW5kZXgpe1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgYmlkVGFibGVSb3cgb2YgYmlkVGFibGUuY2hpbGRyZW4pXG4gICAgICAgIGZvcihsZXQgYmlkVGFibGVDb2x1bW5JbmRleCBpbiBiaWRUYWJsZVJvdy5jaGlsZHJlbilcbiAgICAgICAgICAgIGlmKGJpZFRhYmxlQ29sdW1uSW5kZXg+PWZpcnN0Q29sdW0pXG4gICAgICAgICAgICAgICAgYmlkVGFibGVSb3cuY2hpbGRyZW5bYmlkVGFibGVDb2x1bW5JbmRleF0uaW5uZXJIVE1MPVwiXCI7XG59XG5cbmZ1bmN0aW9uIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxzdWl0ZSl7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50bHkgYXNzaWduZWQgc3VpdGVcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIsU3RyaW5nKHN1aXRlKSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKV0pO1xufVxuXG5mdW5jdGlvbiBzaG93Q2FyZChlbGVtZW50LGNhcmQsdHJ1bXBTdWl0ZSx3aW5uZXJTaWduKXtcbiAgICBpZighZWxlbWVudCl7Y29uc29sZS5lcnJvcihcIk5vIGVsZW1lbnQhXCIpO3JldHVybjt9XG4gICAgaWYoY2FyZCl7XG4gICAgICAgIHNldFN1aXRlQ2xhc3MoZWxlbWVudCxjYXJkLnN1aXRlKTsgLy8gd2Ugd2FudCB0byBzZWUgdGhlIHJpZ2h0IGNvbG9yXG4gICAgICAgIGxldCBlbGVtZW50SXNUcnVtcD1lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInRydW1wXCIpO1xuICAgICAgICBsZXQgZWxlbWVudFNob3VsZEJlVHJ1bXA9KGNhcmQuc3VpdGU9PT10cnVtcFN1aXRlKTtcbiAgICAgICAgaWYoZWxlbWVudElzVHJ1bXAhPT1lbGVtZW50U2hvdWxkQmVUcnVtcCllbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJ0cnVtcFwiKTtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgaWYod2lubmVyU2lnbiE9MCllbGVtZW50LmlubmVySFRNTCs9XCIqXCI7XG4gICAgICAgIC8qIHJlcGxhY2luZzogXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgdGhlIGNhcmQgb2YgdGhlIHdpbm5lciBzbyBmYXIgaXQgY2FuIGJlIGVpdGhlciArIG9yIC1cbiAgICAgICAgaWYod2lubmVyU2lnbj4wKWVsZW1lbnQuaW5uZXJIVE1MKz0nKyc7ZWxzZSBpZih3aW5uZXJTaWduPDApZWxlbWVudC5pbm5lckhUTUwrPSctJztcbiAgICAgICAgKi9cbiAgICB9ZWxzZVxuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1cIlwiO1xufVxuXG4vLyBNREhAMjNKQU4yMDIwOiB3aGVuIHNob3dpbmcgdGhlIHBsYXllciBuYW1lIHdlIHNldCB0aGUgY29sb3IgdG8gYmxhY2sgKGp1c3QgaW4gY2FzZSBpdCdzIG5vdCBibGFjayBhbnltb3JlKVxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWUoZWxlbWVudCxuYW1lKXtcbiAgICBlbGVtZW50LmlubmVySFRNTD0obmFtZT9uYW1lOlwiP1wiKTtcbiAgICBlbGVtZW50LnN0eWxlLmNvbG9yPVwiYmxhY2tcIjtcbn1cbmZ1bmN0aW9uIHNob3dQbGF5ZXJUeXBlKGVsZW1lbnQscGxheWVyVHlwZSl7XG4gICAgc3dpdGNoKHBsYXllclR5cGUpe1xuICAgICAgICBjYXNlIC0xOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJyZWRcIjticmVhaztcbiAgICAgICAgY2FzZSAwOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJvcmFuZ2VcIjticmVhaztcbiAgICAgICAgY2FzZSAxOmVsZW1lbnQuc3R5bGUuY29sb3I9XCJncmVlblwiO2JyZWFrO1xuICAgICAgICBkZWZhdWx0OmVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO2JyZWFrOyAvLyB0eXBpY2FsbHkgdmFsdWUgMiBpcyB1c2VkIHRvIGluZGljYXRlIHRoZSBwbGF5ZXIgaXRzZWxmISEhXG4gICAgfVxufVxuXG4vLyBNREhAMjBKQU4yMDIwOiBrZWVwIHRoZSBpZHMgb2YgdGhlIHRyaWNrIHBsYXllZCBjYXJkcyBpbiBhIGNvbnN0YW50IGFycmF5XG5jb25zdCBQTEFZRURfQ0FSRF9JRFM9W1wiY3VycmVudC1wbGF5ZXItY2FyZFwiLFwibGVmdGhhbmRzaWRlLXBsYXllci1jYXJkXCIsXCJvcHBvc2l0ZS1wbGF5ZXItY2FyZFwiLFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItY2FyZFwiXTtcblxuLy8gdG8gYmUgY2FsbGVkIG9uIHJlY2VpdmluZyB0aGUgbmV3IHRyaWNrIGV2ZW50XG5mdW5jdGlvbiBjbGVhckNhcmRzUGxheWVkVGFibGUoKXtcbiAgICBmb3IobGV0IHBsYXllZENhcmRJbmRleCBpbiBQTEFZRURfQ0FSRF9JRFMpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFBMQVlFRF9DQVJEX0lEU1twbGF5ZWRDYXJkSW5kZXhdKS5pbm5lckhUTUw9XCJcIjtcbn1cblxuLyoqXG4gKiBzaG93cyB0aGUgZ2l2ZW4gdHJpY2tcbiAqIEBwYXJhbSB7Kn0gdHJpY2sgXG4gKi9cbmZ1bmN0aW9uIHNob3dUcmljayh0cmljay8qLHBsYXllckluZGV4Ki8pe1xuICAgIFxuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgXG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIFwiLHRyaWNrKTtcbiAgICBcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG5cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSB0cnVtcCBwbGF5ZXIgdGhhdCBpcyBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIChlaXRoZXIgbm9uLWJsaW5kIG9yIGJsaW5kKSBmbGFnIHRoZSBjaGVja2JveFxuICAgIGlmKHRyaWNrLmZpcnN0UGxheWVyPT09cGxheWVySW5kZXgmJnRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3gnKS5jaGVja2VkPXRydWU7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc2stcGFydG5lci1jYXJkLWJsaW5kJykuaW5uZXJIVE1MPSh0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDwwP1wiYmxpbmQgXCI6XCJcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICB9ZWxzZVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcblxuICAgIC8vIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGluZm9cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFza2luZy1mb3ItcGFydG5lci1jYXJkLWluZm9cIikuc3R5bGUuZGlzcGxheT0odHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPT0wP1wiYmxvY2tcIjpcIm5vbmVcIik7XG4gICAgLy9sZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2stY2FyZHMtdGFibGVcIikucmVxdWVzdFNlbGVjdG9yKFwidGJvZHlcIik7XG5cbiAgICAvLyB0aGUgcGxheWVyIHR5cGUgY2FuIGNoYW5nZSBldmVyeSBjYXJkIGJlaW5nIHBsYXllZCAoYmFzZWQgb24gdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyKVxuICAgIC8vIFRPRE8gc2hvdWxkbid0IG5lZWQgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAgICAvLyBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSwtMik7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllclR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIiksY3VycmVudFBsYXllci5pc0ZyaWVuZGx5KChwbGF5ZXJJbmRleCszKSU0KSk7XG4gICAgXG4gICAgLy8gTk9URSB0aGUgZmlyc3QgY2FyZCBjb3VsZCBiZSB0aGUgYmxpbmQgY2FyZCBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgbm90IHNob3cgaXQhIVxuICAgIC8vICAgICAgYnV0IG9ubHkgdGhlIGNvbG9yIG9mIHRoZSBwYXJ0bmVyIHN1aXRlXG4gICAgbGV0IGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ9KHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2suX2NhcmRzWzBdLnN1aXRlIT09dHJpY2sucGxheVN1aXRlKTtcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBzaG93IGFsbCB0aGUgdHJpY2sgY2FyZHMgcGxheWVkIGF0IHRoZSByaWdodCBwb3NpdGlvblxuICAgIGZvcihsZXQgdHJpY2tDYXJkSW5kZXg9MDt0cmlja0NhcmRJbmRleDw0O3RyaWNrQ2FyZEluZGV4Kyspe1xuICAgICAgICBsZXQgdHJpY2tDYXJkPSh0cmlja0NhcmRJbmRleDx0cmljay5udW1iZXJPZkNhcmRzP3RyaWNrLl9jYXJkc1t0cmlja0NhcmRJbmRleF06bnVsbCk7XG4gICAgICAgIGxldCB0cmlja0NhcmRQbGF5ZXJJbmRleD10cmljay5maXJzdFBsYXllcit0cmlja0NhcmRJbmRleDsgLy8gdGhlIGFjdHVhbCBwbGF5ZXIgaW5kZXggaW4gdGhlIGdhbWVcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBvc2l0aW9uPSh0cmlja0NhcmRQbGF5ZXJJbmRleCs0LXBsYXllckluZGV4KSU0O1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIGNhcmQgcG9zaXRpb246IFwiK3RyaWNrQ2FyZFBvc2l0aW9uK1wiLlwiKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZElkPVBMQVlFRF9DQVJEX0lEU1t0cmlja0NhcmRQb3NpdGlvbl07XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQpe1xuICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD1mYWxzZTsgLy8gZG8gbm90IGRvIHRoaXMgZm9yIHRoZSBuZXh0IHBsYXllcnNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmljay5wbGF5U3VpdGUpOyAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRyaWNrIGNhcmQgI1wiK3RyaWNrQ2FyZEluZGV4LHRyaWNrQ2FyZCk7XG4gICAgICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlja0NhcmRJZCksdHJpY2tDYXJkLHRyaWNrLnRydW1wU3VpdGUsXG4gICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPyhyaWtrZW5UaGVHYW1lLmlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCx0cmlja0NhcmRQbGF5ZXJJbmRleCU0KT8xOi0xKTowKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIGxldCBwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9KGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQ/KDQrdHJpY2suZmlyc3RQbGF5ZXItcGxheWVySW5kZXgpJTQ6MCk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0xKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItbGVmdC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2sucGxheVN1aXRlKTtcbiAgICB9ZWxzZVxuICAgICAgICBzaG93Q2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMSklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzEpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsxKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0yKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW9wcG9zaXRlLWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMiklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzIpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCsyKSU0KT8xOi0xKTowKSk7XG4gICAgaWYocGxheWVyQXNraW5nRm9yUGFydG5lckNhcmRCbGluZEluZGV4PT0zKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKS5pbm5lckhUTUw9U1VJVEVfQ0hBUkFDVEVSU1t0cmljay5wbGF5U3VpdGVdO1xuICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXJpZ2h0LWNhcmRcIiksdHJpY2suZ2V0UGxheWVyQ2FyZCgocGxheWVySW5kZXgrMyklNCksdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICAgICAodHJpY2sud2lubmVyPT09KHBsYXllckluZGV4KzMpJTQ/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LChwbGF5ZXJJbmRleCszKSU0KT8xOi0xKTowKSk7XG4gICAgKi9cbn1cblxuZnVuY3Rpb24gdXBkYXRlU3VpdGVDYXJkUm93cyhyb3dzLHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHN1aXRlIGNhcmQgcm93czogXCIrcm93cy5sZW5ndGgrXCIuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICBsZXQgc3VpdGU9MDtcbiAgICBmb3IobGV0IHJvdyBvZiByb3dzKXtcbiAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICBsZXQgY2FyZHNJblN1aXRlPShzdWl0ZTxzdWl0ZUNhcmRzLmxlbmd0aD9zdWl0ZUNhcmRzW3N1aXRlXTpbXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgIGxldCBjZWxscz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmQ9MDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY29sdW1uczogXCIsY29sdW1ucy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IGNlbGwgb2YgY2VsbHMpe1xuICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgY2FyZDogXCIsY2FyZEluU3VpdGUpO1xuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yOyAgXG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBzdWl0ZUNhcmQrKztcbiAgICAgICAgfVxuICAgICAgICBzdWl0ZSsrO1xuICAgIH1cbn1cbi8vIGluIHRocmVlIGRpZmZlcmVudCBwYWdlcyB0aGUgcGxheWVyIGNhcmRzIHNob3VsZCBiZSBzaG93bi4uLlxuZnVuY3Rpb24gdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgZm9yIGJpZGRpbmcuXCIpO1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpLHN1aXRlQ2FyZHMpO1xufVxuZnVuY3Rpb24gdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyhzdWl0ZUNhcmRzKXtcbiAgICB1cGRhdGVTdWl0ZUNhcmRSb3dzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5cbi8qKlxuICogZm9yIHBsYXlpbmcgdGhlIGNhcmRzIGFyZSBzaG93biBpbiBidXR0b25zIGluc2lkZSB0YWJsZSBjZWxsc1xuICogQHBhcmFtIHsqfSBzdWl0ZUNhcmRzIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHRyeXtcbiAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSAoY3VycmVudCBwbGF5ZXIpIGNhcmRzIHRvIGNob29zZSBmcm9tLlwiKTtcbiAgICAgICAgLy8vLy8vLy8vL2lmKGN1cnJlbnRQYWdlPT09XCJwYWdlLXBsYXlpbmdcIilhbGVydChcIlNob3dpbmcgdGhlIHBsYXlpbmcgY2FyZHMgYWdhaW4hXCIpO1xuICAgICAgICBsZXQgdGFibGVib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLXN1aXRlY2FyZHMtdGFibGVcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqIFN1aXRlIGNhcmRzOiBcIixzdWl0ZUNhcmRzKTtcbiAgICAgICAgbGV0IHJvd3M9dGFibGVib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIHJvd3M6IFwiLHJvd3MubGVuZ3RoKTtcbiAgICAgICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPHJvd3MubGVuZ3RoO3N1aXRlKyspe1xuICAgICAgICAgICAgbGV0IHJvdz1yb3dzW3N1aXRlXTtcbiAgICAgICAgICAgIC8vLy8vLy8vL2xldCBzdWl0ZUNvbG9yPVNVSVRFX0NPTE9SU1tzdWl0ZSUyXTtcbiAgICAgICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNhcmRzIGluIHN1aXRlICNcIitzdWl0ZStcIjogXCIrY2FyZHNJblN1aXRlLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgY29sdW1ucz1yb3cucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IobGV0IHN1aXRlQ2FyZD0wO3N1aXRlQ2FyZDxjb2x1bW5zLmxlbmd0aDtzdWl0ZUNhcmQrKyl7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGxidXR0b249Y29sdW1uc1tzdWl0ZUNhcmRdLyoucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9YnV0dG9uXVwiKSovO1xuICAgICAgICAgICAgICAgIGlmKCFjZWxsYnV0dG9uKXtjb25zb2xlLmxvZyhcIk5vIGNlbGwgYnV0dG9uIVwiKTtjb250aW51ZTt9XG4gICAgICAgICAgICAgICAgbGV0IGNhcmRJblN1aXRlPShzdWl0ZUNhcmQ8Y2FyZHNJblN1aXRlLmxlbmd0aD9jYXJkc0luU3VpdGVbc3VpdGVDYXJkXTpudWxsKTtcbiAgICAgICAgICAgICAgICBpZihjYXJkSW5TdWl0ZSl7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxidXR0b24uaW5uZXJIVE1MPWNhcmRJblN1aXRlLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1tjYXJkSW5TdWl0ZS5zdWl0ZV0pOyAvLyByZXBsYWNpbmc6IGNlbGxidXR0b24uc3R5bGUuY29sb3I9c3VpdGVDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwiaW5saW5lXCI7XG4gICAgICAgICAgICAgICAgfWVsc2UgLy8gaGlkZSB0aGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNlbGxidXR0b24uc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGxheWVyIGNhcmRzIHRvIGNob29zZSBmcm9tIHNob3duIVwiKTtcbiAgICB9ZmluYWxseXtcbiAgICAgICAgdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gd2hlbmV2ZXIgdGhlIHN1aXRlIGNhcmRzIHNob3dpbmcgY2hhbmdlIHdlIG1ha2UgdGhlbSBjbGlja2FibGVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPWN1cnJlbnRQbGF5ZXIuZ2FtZTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGRlbHRhUG9pbnRzPXJpa2tlblRoZUdhbWUuZGVsdGFQb2ludHM7XG4gICAgbGV0IHBvaW50cz1yaWtrZW5UaGVHYW1lLnBvaW50cztcbiAgICBpZighZGVsdGFQb2ludHN8fCFwb2ludHMpe2NvbnNvbGUubG9nKFwiRVJST1I6IFJlc3VsdHMgbm93IGtub3duIHlldCFcIik7cmV0dXJuO31cbiAgICBmb3IobGV0IHBsYXllclJlc3VsdHNSb3cgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmVzdWx0cy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1wYXJzZUludChwbGF5ZXJSZXN1bHRzUm93LmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWluZGV4XCIpKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsxXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhyaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bMl0uaW5uZXJIVE1MPShkZWx0YVBvaW50cz9TdHJpbmcoZGVsdGFQb2ludHNbcGxheWVySW5kZXhdKTpcIi1cIik7XG4gICAgICAgIHBsYXllclJlc3VsdHNSb3cuY2hpbGRyZW5bM10uaW5uZXJIVE1MPVN0cmluZyhwb2ludHNbcGxheWVySW5kZXhdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGVDZWxsIG9mIHRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJykpe1xuICAgICAgICAgICAgdHJpY2tzUGxheWVkVGFibGVDZWxsLmlubmVySFRNTD1cIlwiO3RyaWNrc1BsYXllZFRhYmxlQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50JztcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBnYW1lIGJlaW5nIHBsYXllZCFcIik7IC8vIE1ESEAwM0pBTjIwMjA6IHJpa2tlblRoZUdhbWUgc2hvdWxkIG5vdyBwb2ludCB0byB0aGUgX2dhbWUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgbGV0IGxhc3RUcmlja1BsYXllZEluZGV4PXJpa2tlblRoZUdhbWUubnVtYmVyT2ZUcmlja3NQbGF5ZWQtMTsgLy8gZ2V0dGVyIGNoYW5nZWQgdG8gZ2V0TWV0aG9kIGNhbGxcbiAgICBpZihsYXN0VHJpY2tQbGF5ZWRJbmRleD49MCl7XG4gICAgICAgIGxldCB0cmljaz1yaWtrZW5UaGVHYW1lLl90cmljazsgLy8gTURIQDIwSkFOMjAyMCByZXBsYWNpbmc6IGdldFRyaWNrQXRJbmRleChsYXN0VHJpY2tQbGF5ZWRJbmRleCk7XG4gICAgICAgIGlmKCF0cmljayl7Y29uc29sZS5sb2coXCJFUlJPUjogTm8gdHJpY2sgdG8gdXBkYXRlIHRoZSB0cmlja3MgdGFibGUgd2l0aCFcIik7cmV0dXJuO31cbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5jaGlsZHJlbltsYXN0VHJpY2tQbGF5ZWRJbmRleF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPVN0cmluZyhsYXN0VHJpY2tQbGF5ZWRJbmRleCsxKTtcbiAgICAgICAgICAgIGZvcih0cmlja1BsYXllcj0wO3RyaWNrUGxheWVyPHRyaWNrLl9jYXJkcy5sZW5ndGg7dHJpY2tQbGF5ZXIrKyl7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllcj0odHJpY2tQbGF5ZXIrdHJpY2suZmlyc3RQbGF5ZXIpJTQ7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuWzIqcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgICAgIGxldCBjYXJkPXRyaWNrLl9jYXJkc1t0cmlja1BsYXllcl07XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTsgLy8gcHV0IHwgaW4gZnJvbnQgb2YgZmlyc3QgcGxheWVyISEhXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgYmFja2dyb3VuZCB0aGUgY29sb3Igb2YgdGhlIHBsYXkgc3VpdGUgYWZ0ZXIgdGhlIGxhc3QgcGxheWVyLCBzbyB3ZSBrbm93IHdoZXJlIHRoZSB0cmljayBlbmRlZCEhXG4gICAgICAgICAgICAgICAgcm93LmNoaWxkcmVuWzIqcGxheWVyKzJdLnN0eWxlLmJhY2tncm91bmRDb2xvcj0odHJpY2tQbGF5ZXI9PXRyaWNrLl9jYXJkcy5sZW5ndGgtMT8odHJpY2sucGxheVN1aXRlJTI/J2JsYWNrJzoncmVkJyk6J3doaXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gbGV0J3MgbWFrZSB0aGUgd2lubmVyIGNhcmQgc2hvdyBiaWdnZXIhISFcbiAgICAgICAgICAgICAgICAvLy8vLy8vaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICAgICAgaWYodHJpY2sud2lubmVyPT09cGxheWVyKWNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmx1ZSc6JyNiMTljZDknKTtlbHNlIC8vIG1hcmsgdGhlIHdpbm5lciB3aXRoIGFuIGFzdGVyaXNrISFcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuY29sb3I9KGNhcmQuc3VpdGUlMj8nYmxhY2snOidyZWQnKTtcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmZvbnRTaXplPSh0cmljay53aW5uZXI9PT1wbGF5ZXI/XCI2MDBcIjpcIjQ1MFwiKStcIiVcIjtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmc6IGNlbGwuc3R5bGUuY29sb3I9JyMnKyhjYXJkLnN1aXRlJTI/J0ZGJzonMDAnKSsnMDAnKyh0cmlja1BsYXllcj09MD8nRkYnOicwMCcpOyAvLyBmaXJzdCBwbGF5ZXIgYWRkcyBibHVlISFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlJ3JlIHBhc3NpbmcgYWxvbmcgY3VycmVudFBsYXllci5wYXJ0bmVyIHRvIGdldFRlYW1OYW1lIGJlY2F1c2UgdGhlIHBsYXllciB3aXRoIHRoZSBmb3VydGggYWNlIGFscmVhZHkga25vd3MgaGlzL2hlciBwYXJ0bmVyXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bOV0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0VGVhbU5hbWUodHJpY2sud2lubmVyKTsgLy8gc2hvdyB3aG8gd29uIHRoZSB0cmljayEhXG4gICAgICAgICAgICByb3cuY2hpbGRyZW5bMTBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodHJpY2sud2lubmVyKTsgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYnkgdGhlIHRyaWNrIHdpbm5lciAoTURIQDAzSkFOMjAyMDogY2hhbmdlZCBmcm9tIGdldHRpbmcgdGhlIHBsYXllciBpbnN0YW5jZSBmaXJzdClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkZWZhdWx0IHBsYXllciBuYW1lcyFcIik7XG4gICAgbGV0IHBsYXllck5hbWVzPUxhbmd1YWdlLkRFRkFVTFRfUExBWUVSU1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbW8tcGxheW1vZGUtY2hlY2tib3hcIikuY2hlY2tlZD8xOjBdO1xuICAgIGZvcihsZXQgcGxheWVyTmFtZUlucHV0RWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZighcGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZXx8cGxheWVyTmFtZUlucHV0RWxlbWVudC52YWx1ZS5sZW5ndGg9PTApXG4gICAgICAgICAgICBwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlPXBsYXllck5hbWVzW3BhcnNlSW50KHBsYXllck5hbWVJbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIikpXTtcbiAgICB9XG59XG5cbi8vIHBsYXlpbmcgZnJvbSB3aXRoaW4gdGhlIGdhbWVcbmZ1bmN0aW9uIHNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkKCl7XG4gICAgbGV0IHNpbmdsZVBsYXllck5hbWU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItbmFtZScpLnZhbHVlLnRyaW0oKTtcbiAgICBpZihzaW5nbGVQbGF5ZXJOYW1lLmxlbmd0aD4wKVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKHNpbmdsZVBsYXllck5hbWUsKGVycik9PntcbiAgICAgICAgICAgIC8vIE1ESEAxMEpBTjIwMjA6IF9zZXRQbGF5ZXIgdGFrZXMgY2FyZSBvZiBzd2l0Y2hpbmcgdG8gdGhlIHJpZ2h0IGluaXRpYWwgcGFnZSEhIVxuICAgICAgICAgICAgaWYoZXJyKXNldEluZm8oZXJyKTsvLyBlbHNlIG5leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgICAgYWxlcnQoXCJHZWVmIGVlcnN0IGVlbiAoZ2VsZGlnZSkgbmFhbSBvcCFcIik7XG59XG5cbi8qKlxuICogcHJlcGFyZXMgdGhlIEdVSSBmb3IgcGxheWluZyB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBnZXRHYW1lSW5mbygpe1xuICAgIGNvbnNvbGUubG9nKFwiRGV0ZXJtaW5pbmcgZ2FtZSBpbmZvLlwiKTtcbiAgICBsZXQgZ2FtZUluZm89XCJcIjtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7IC8vIG5vIHBsYXllciwgbm8gZ2FtZVxuICAgIGlmKHJpa2tlblRoZUdhbWUpe1xuICAgICAgICAvLyBnZXQgdGhlIGluZm8gd2UgbmVlZCB0aHJvdWdoIHRoZSBQbGF5ZXJHYW1lIGluc3RhbmNlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJzPXJpa2tlblRoZUdhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKTsgLy8gdGhvc2UgYmlkZGluZ1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcdEhpZ2hlc3QgYmlkZGVyczogXCIraGlnaGVzdEJpZGRlcnMuam9pbihcIiwgXCIpK1wiLlwiKTtcbiAgICAgICAgbGV0IGhpZ2hlc3RCaWQ9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWQ6IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiKTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRUcnVtcFN1aXRlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0VHJ1bXAgc3VpdGU6IFwiK3RydW1wU3VpdGUrXCIuXCIpO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclN1aXRlKCk7XG4gICAgICAgIGxldCBwYXJ0bmVyUmFuaz1yaWtrZW5UaGVHYW1lLmdldFBhcnRuZXJSYW5rKCk7XG4gICAgICAgIC8vIHBsYXlpbmcgd2l0aCB0cnVtcCBpcyBlYXNpZXN0XG4gICAgICAgIGlmKHRydW1wU3VpdGU+PTApeyAvLyBvbmx5IGEgc2luZ2xlIGhpZ2hlc3QgYmlkZGVyISEhXG4gICAgICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcj1oaWdoZXN0QmlkZGVyc1swXTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICAgICAgbGV0IHRyb2VsYVBsYXllck5hbWU9cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpO1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPXRyb2VsYVBsYXllck5hbWUrXCIgaGVlZnQgdHJvZWxhLCBcIjtcbiAgICAgICAgICAgICAgICAvLyBNREhAMzBKQU4yMDIwOiBPT1BTIG5vdCBzdXBwb3NlZCB0byBnaXZlIHRoaXMgYXdheSEhISEhIGdhbWVJbmZvKz1MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBpcyB0cm9lZiwgZW4gXCI7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm8rPVwiZW4gXCIrcmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHJpa2tlblRoZUdhbWUuZm91cnRoQWNlUGxheWVyKStcIiBpcyBtZWUuXCI7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9SSUt8fGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUil7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKStcIiByaWt0IGluIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCIsIGVuIHZyYWFndCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIG1lZS5cIjsgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgLy8gd2l0aG91dCBhIHBhcnRuZXJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHNwZWVsdCBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIiBtZXQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV0rXCIgYWxzIHRyb2VmLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXsgLy8gdGhlcmUncyBubyB0cnVtcCwgZXZlcnlvbmUgaXMgcGxheWluZyBmb3IgaGltL2hlcnNlbGZcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXM9W107XG4gICAgICAgICAgICBoaWdoZXN0QmlkZGVycy5mb3JFYWNoKChoaWdoZXN0QmlkZGVyKT0+e2hpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5wdXNoKHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShoaWdoZXN0QmlkZGVyKSk7fSk7XG4gICAgICAgICAgICBpZihoaWdoZXN0QmlkZGVyUGxheWVyTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGdhbWVJbmZvPWhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5qb2luKFwiLCBcIikrKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MT9cIiBzcGVsZW4gXCI6XCIgc3BlZWx0IFwiKStQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkXStcIi5cIjtcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgZ2FtZUluZm89XCJJZWRlcmVlbiBoZWVmdCBnZXBhc3QuIFdlIHNwZWxlbiBvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWchXCI7XG4gICAgICAgIH1cbiAgIH1cbiAgIHJldHVybiBnYW1lSW5mbztcbn1cblxuLy8gaG93IHRvIHBocmFzZSBhIGJpZCBkZXBlbmRzIG9uIHRoZSBiaWQsIGFuZCB3aG8gcGxheXMgaXRcbmZ1bmN0aW9uIGdldEJpZEluZm8oYmlkLGJpZGRlcil7XG4gICAgbGV0IGJldHRlcj0oYmlkPT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ORUdFTl9BTExFRU5fQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOX0JFVEVSfHxcbiAgICAgICAgYmlkPT09UGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVIpO1xuICAgIGlmKGJldHRlciliaWQtLTtcbiAgICBzd2l0Y2goYmlkKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QQVM6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBnZXBhc3QuXCI6XCJKZSBoZWJ0IGdlcGFzdC5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUklLOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgaGVlZnQgXCI6XCJKZSBoZWJ0IFwiKSsoYmV0dGVyP1wiYmV0ZXIgXCI6XCJcIikrXCIgZ2VyaWt0LlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBuZWdlbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgZWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU46XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWwgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IHR3YWFsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBkZXJ0aWVuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfUElDTzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBzbGVjaHRzIGVlbiBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX01JU0VSRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4gbWV0IG9wZW4ga2FhcnRlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgZWVuIHByYWF0amUgZW4gb3BlbiBrYWFydGVuLlwiO1xuICAgIH1cbiAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdFwiOlwiSmUgaGVidFwiKStcIiBlZW4gb25nZWxkaWcgYm9kIGdlZGFhbi5cIjtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQobnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSxoaWdoZXN0QmlkKXtcbiAgICBzd2l0Y2gobnVtYmVyT2ZUcmlja3NUb1dpbil7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBcIkdlZW5lZW5cIjtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIFwiUHJlY2llcyBlZW5cIjtcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgcmV0dXJuIFwiWmVzIHNhbWVuIG1ldCBcIisocGFydG5lck5hbWU/cGFydG5lck5hbWU6XCJqZSBwYXJ0bmVyXCIpK1wiIG9tIGRlIHRlZ2Vuc3BlbGVycyBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgbGF0ZW4gdmVybGllemVuXCI7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBcIkFjaHQgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgXCIrKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1RST0VMQT9cInRyb2VsYVwiOlwicmlrXCIpK1wiIHRlIHdpbm5lblwiO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gXCJOZWdlbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiBcIlRpZW4gYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICByZXR1cm4gXCJFbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICByZXR1cm4gXCJUd2FhbGYgYWxsZWVuXCI7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gXCJBbGxlbWFhbFwiO1xuICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXQgbWl0cyBuaWV0IGRlIGxhYXRzdGUgc2xhZyBvZiBlZW4gc2xhZyBtZXQgZGUgc2Nob3BwZW4gdnJvdXdcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiTWFha3QgbmlldCB1aXRcIjtcbn1cblxuZnVuY3Rpb24gc2hvd1BsYXllck5hbWVzSW5CaWRzVGFibGUoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGZvcihsZXQgcGxheWVySW5kZXg9MDtwbGF5ZXJJbmRleDxyaWtrZW5UaGVHYW1lLm51bWJlck9mUGxheWVycztwbGF5ZXJJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpOyAvLyB3cml0ZSB0aGUgbmFtZSBvZiB0aGUgcGxheWVyXG4gICAgfVxufVxuLy8gTURIQDIxTk9WMjAyMDogdGhlIGdhbWUgd291bGQgY2FsbCB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgYSBiaWQgbWFkZSBpcyByZWNlaXZlZCEhIVxuZnVuY3Rpb24gdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgIGZvcihsZXQgcGxheWVyQmlkc0luZGV4PTA7cGxheWVyQmlkc0luZGV4PHBsYXllckJpZHNPYmplY3RzLmxlbmd0aDtwbGF5ZXJCaWRzSW5kZXgrKyl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXBsYXllckJpZHNPYmplY3RzW3BsYXllckJpZHNJbmRleF07XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLmdldFBsYXllckluZGV4KHBsYXllckJpZHNPYmplY3QubmFtZSk7XG4gICAgICAgIC8vIG9uIHRoZSBzYWZlIHNpZGUsIGdldCB0aGUgcGxheWVyIGluZGV4IGZyb20gdGhlIGdhbWUgcGFzc2luZyBpbiAgcGxheWVyIG5hbWVcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7YWxlcnQoXCJQbGF5ZXIgXCIrcGxheWVyQmlkc09iamVjdC5uYW1lK1wiIHVua25vd24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICAvLyBNREhAMjNKQU4yMDIwIHNob3dpbmcgdGhlIHBsYXllciBuYW1lcyBvbmNlOiBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgLy8gd3JpdGUgdGhlIGJpZHMgKHdlIGhhdmUgdG8gY2xlYXIgdGhlIHRhYmxlIHdpdGggZXZlcnkgbmV3IGdhbWUgdGhvdWdoKVxuICAgICAgICBwbGF5ZXJCaWRzT2JqZWN0LmJpZHMuZm9yRWFjaCgocGxheWVyQmlkLGJpZEluZGV4KT0+e3BsYXllckJpZHNSb3cuY2hpbGRyZW5bYmlkSW5kZXgrMV0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBiaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJdLmNoaWxkcmVuWzFdLmlubmVySFRNTD1wbGF5ZXJzQmlkc1tiaWRdLmpvaW4oXCIgXCIpO1xuICAgIH1cbn1cblxuY2xhc3MgT25saW5lUGxheWVyIGV4dGVuZHMgUGxheWVye1xuXG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gYXNrIHRoZSBnYW1lXG4gICAgICAgIHJldHVybih0aGlzLl9pbmRleCYmdGhpcy5fZ2FtZT90aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5faW5kZXgpOi0yKTtcbiAgICB9XG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gcmVxdWVzdCBvZiBnYW1lIGVuZ2luZSAoc2VydmVyKSB0byBtYWtlIGEgYmlkXG4gICAgICAgIHRvTWFrZUFCaWQrKztcbiAgICAgICAgaWYodG9NYWtlQUJpZD09PTEpeyAvLyBmaXJzdCB0aW1lIHJlcXVlc3QgZm9yIHRoZSBiaWRcbiAgICAgICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgICAgIC8vIGFzY2VydGFpbiB0byBiZSBsb29raW5nIGF0IHRoZSBiaWRkaW5nIHBhZ2UgKGluIHdoaWNoIGNhc2Ugd2UgY2FuIHNhZmVseSB1c2UgVklTSUJMRSlcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IFxuICAgICAgICAgICAgLy8gcmVtb3ZlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICAgICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IGluaGVyaXQgaXMgc2FmZXIgYmVjYXVzZSBpZiB0aGlzIGhhcHBlbnMgYnkgYWNjaWRlbnQgKHdoZW4gbm90IG9uIHRoZSBiaWRkaW5nIHBhZ2UpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnQsIGVzc2VudGlhbCB0byBoaWRlIGl0IGltbWVkaWF0ZWx5IGFmdGVyIGEgYmlkXG4gICAgICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgc2V0SW5mbyhcIkRvZSBlZW4gYm9kLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBiaWRzIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBjb3VsZCBtYWtlOiBcIixwb3NzaWJsZUJpZHMpO1xuICAgIFxuICAgICAgICAgICAgLy9zZXRJbmZvKFwiTWFhayBlZW4ga2V1emUgdWl0IGVlbiB2YW4gZGUgbW9nZWxpamtlIGJpZWRpbmdlbi5cIik7XG4gICAgICAgICAgICAvLyBpdCdzIGFsd2F5cyB5b3UhISEhIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikuaW5uZXJIVE1MPVwiVG9vbiBrYWFydGVuXCI7XG4gICAgICAgICAgICBiaWRkZXJDYXJkc0VsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikudmFsdWU9dGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24oXCI8YnI+XCIpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIGJpZGRlciBjYXJkcyBpbW1lZGlhdGVseVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy10YWJsZVwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICAgICAgICAgIGlmKC8qcGxheW1vZGU9PVBMQVlNT0RFX0RFTU8qLzBeZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJpZC1idXR0b25cIikpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZS1iaWQtYnV0dG9uXCIpO1xuICAgICAgICAgICAgLyogTURIQDExSkFOMjAyMDogbW92ZWQgb3ZlciB0byB3aGVuIHRoZSBwbGF5ZXIgY2FyZHMgYXJlIHJlY2VpdmVkISEhXG4gICAgICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zIGNvcnJlc3BvbmRpbmcgdG8gcG9zc2libGUgYmlkc1xuICAgICAgICAgICAgZm9yKGxldCBiaWRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJpZFwiKSlcbiAgICAgICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5saW5lXCI6XCJub25lXCIpO1xuICAgICAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgICAgIHVwZGF0ZUJpZHNUYWJsZShwbGF5ZXJCaWRzT2JqZWN0cyk7XG4gICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9CSUQpOyAgICBcbiAgICAgICAgfWVsc2UgLy8gbm90IHRoZSBmaXJzdCB0aW1lIGEgYmlkIHdhcyByZXF1ZXN0ZWRcbiAgICAgICAgaWYoYmlkTWFkZUluZm8pe1xuICAgICAgICAgICAgbGV0IGVycm9yPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuX3NldEJpZChiaWRNYWRlSW5mbyk6bmV3IEVycm9yKGJ1ZyhcIkplIGJlbnQgZ2VlbiBzcGVsZXIgbWVlciFcIikpKTtcbiAgICAgICAgICAgIGlmKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIk5vZyBzdGVlZHMgcHJvYmxlbWVuIGJpaiBoZXQgdmVyc3R1cmVuIHZhbiBqZSBib2QuIFdlIGJsaWp2ZW4gaGV0IHByb2JlcmVuLlwiLFwiU3BlbGVyXCIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJKZSBib2QgaXMgbm9nbWFhbHMgdmVyc3R1dXJkLiBIb3BlbGlqayBoZWJiZW4gd2UgbnUgbWVlciBnZWx1ayFcIixcIlNwZWxlclwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIHNldEluZm8oXCJFciB3b3JkdCBvcCBqZSBib2QgZ2V3YWNodCFcIixcIlNlcnZlclwiKTtcbiAgICB9XG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgdHJ1bXAgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXRydW1wLWNob29zaW5nXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgdHJ1bXAgc3VpdGUgYnV0dG9uc1xuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1RSVU1QKTtcbiAgICB9XG4gICAgY2hvb3NlUGFydG5lclN1aXRlKHN1aXRlcyxwYXJ0bmVyUmFuayl7IC8vIHBhcnRuZXJSYW5rTmFtZSBjaGFuZ2VkIHRvIHBhcnRuZXJSYW5rIChiZWNhdXNlIExhbmd1YWdlIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBVSSBsZXZlbCBvbmx5ISlcbiAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHBhcnRuZXIgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgIHNldFBhZ2UoXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHN1aXRlcyBpbiB0aGUgYnV0dG9uIGFycmF5IGFyZSAwLCAxLCAyLCAzIGFuZCBzdWl0ZXMgd2lsbCBjb250YWluXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICAvLyBzaG93IHRoZSBwYXJ0bmVyIHJhbmsgKGFjZSBvciBraW5nKSBiZWluZyBhc2tlZFxuICAgICAgICBmb3IobGV0IHJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgcmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdO1xuICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9QQVJUTkVSKTtcbiAgICB9XG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSByZXBsYWNlZCB2ZXJzaW9uIGV4Y2VwdCB3ZSBub3cgd2FudCB0byByZWNlaXZlIHRoZSB0cmljayBpdHNlbGZcbiAgICBwbGF5QUNhcmQoKXtcbiAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogdGhpcyBpcyBhIHJlcXVlc3QgZnJvbSB0aGUgc2VydmVyIHRvIHBsYXkgYSBjYXJkIHdoaWNoIGNvdWxkIGJlIGEgcmVxdWVzdCB0byByZXBsYXkgYSBjYXJkICh0aGF0IHdhc24ndCByZWNlaXZlZCBzb21laG93KVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHVzaW5nIHdlIGEgZmxhZyB3ZSBrZWVwIHRyYWNrIG9mIHRoZSByZXF1ZXN0IGNvdW50LCB3ZSB0b2dnbGUgdGhlIHNpZ24gdG8gaW5kaWNhdGUgdGhhdCBhIGNob2ljZSB3YXMgYWxyZWFkeSBtYWRlXG4gICAgICAgIC8vIGVycm9yIGhhbmRsaW5nIGZpcnN0IFRPRE8gdGhlc2UgZXJyb3JzIGluZGljYXRlIGJ1Z3MgYW5kIHRoZXJlZm9yZSBhcmUgaW5yZWNvdmVyYWJsZSEhISFcbiAgICAgICAgbGV0IHRyaWNrPSh0aGlzLmdhbWU/dGhpcy5nYW1lLl90cmljazpudWxsKTtcbiAgICAgICAgaWYoIXRyaWNrKXJldHVybiBidWcoXCJEZSBzbGFnIG9udGJyZWVrdCFcIik7XG4gICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2sucGxheVN1aXRlPDApcmV0dXJuIGJ1ZyhcIkRlIHRlIHNwZWxlbiBrbGV1ciBpcyBvbmJla2VuZCFcIik7XG4gICAgICAgIHRvUGxheUFDYXJkKys7XG4gICAgICAgIGlmKHRvUGxheUFDYXJkPT09MSl7IC8vIGZpcnN0IHJlcXVlc3QsIG5vIGNhcmQgd2FzIHBsYXllZCBzbyBmYXJcbiAgICAgICAgICAgIHBsYXllZENhcmRJbmZvPW51bGw7IC8vIGluaXRpYWxpemUgY2FyZFBsYXllZCB0byBudWxsXG4gICAgICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIE1ESEAxOUpBTjIwMjA6IGFsbG93IHRoZSBjdXJyZW50IHBsYXllciB0byBwbGF5IGEgY2FyZCBieSBjbGlja2luZyBvbmVcbiAgICAgICAgICAgIC8vIE1ESEAwNUZFQjIwMjAgcmVtb3ZpbmcgYmVjYXVzZSB3ZSdyZSBrZWVwaW5nIGFsbCBjYXJkcyBjbGlja2FibGUgYW5kIHN0b3AgdGhlbSBwcm9ncmFtbWF0aWNhbGx5IGZyb20gZG9pbmcgaGFybTogdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gcmVhZHkgdG8gcm9jayAnbicgcm9sbFxuICAgICAgICAgICAgLy8gTURIQDA1RkVCMjAyMCBvdmVya2lsbDogc2V0SW5mbyhcIlNwZWVsIGVlbiBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIi5cIik7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGEgbmV3IHRyaWNrIHVwZGF0ZSB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZSB3aXRoIHRoZSBwcmV2aW91cyB0cmlja1xuICAgICAgICAgICAgLy8gaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgIC8qIHNlZSBzaG93VHJpY2soKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW4tYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuc3R5bGUuZGlzcGxheT0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgICAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5jaGVja2VkPWZhbHNlOyAvLyB3aGVuIGNsaWNrZWQgc2hvdWxkIGdlbmVyYXRlIFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjAgbW92ZWQgb3ZlciB0byB3aGVyZSBHQU1FX0lORk8gZXZlbnQgaXMgcmVjZWl2ZWQhISEhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgICAgIC8vIG9ic29sZXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQtcGxheWVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPSh0cmljay5wbGF5U3VpdGU+PTA/XCJTcGVlbCBlZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpK1wiIGJpai5cIjpcIktvbSBtYWFyIHVpdCFcIik7XG4gICAgICAgICAgICBsZXQgbnVtYmVyT2ZUcmlja3NXb249dGhpcy5nZXROdW1iZXJPZlRyaWNrc1dvbigpOyAvLyBhbHNvIGluY2x1ZGVzIHRob3NlIHdvbiBieSB0aGUgcGFydG5lciAoYXV0b21hdGljYWxseSlcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgdHJpY2tzIHdvbiBieSB0aGUgcGFydG5lclxuICAgICAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAgICAgLy8gaWYocGFydG5lciludW1iZXJPZlRyaWNrc1dvbis9cGxheWVyLmdldE51bWJlck9mVHJpY2tzV29uKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy13b24tc28tZmFyXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1dvblRleHQobnVtYmVyT2ZUcmlja3NXb24pKyhwYXJ0bmVyTmFtZT9cIiAoc2FtZW4gbWV0IFwiK3BhcnRuZXJOYW1lK1wiKVwiOlwiXCIpO1xuICAgICAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2tzLXRvLXdpblwiKS5pbm5lckhUTUw9Z2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQodGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSx0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWQoKSk7XG4gICAgICAgICAgICB0aGlzLl9jYXJkPW51bGw7IC8vIGdldCByaWQgb2YgYW55IGN1cnJlbnRseSBjYXJkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2Vsa2UgXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIgd2lsIGplIFwiKyh0cmljay5udW1iZXJPZkNhcmRzPjA/XCJiaWpcIjpcIlwiKStcInNwZWxlbj9cIik7XG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTsgLy8gcmVtZW1iZXIgdGhlIHN1aXRlIGNhcmRzISEhIVxuICAgICAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgICAgICAvLy8vLyBzaG93VHJpY2sodGhpcy5fdHJpY2s9dHJpY2spOyAvLyBNREhAMTFKQU4yMDIwOiBubyBuZWVkIHRvIHBhc3MgdGhlIHBsYXllciBpbmRleCAoYXMgaXQgaXMgYWx3YXlzIHRoZSBzYW1lKVxuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZWRDYXJkSW5mbyl7IC8vIGEgY2FyZCBoYXMgYmVlbiBjaG9vc2VuIGJ5IHRoaXMgcGxheWVyIHRvIHBsYXkgYnV0IGFwcGFyZW50bHkgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldFxuICAgICAgICAgICAgLy8gc2VuZCB0aGUgY2FyZCBwbGF5ZWQgYWdhaW5cbiAgICAgICAgICAgIGxldCBlcnJvcj10aGlzLl9zZXRDYXJkKC4uLnBsYXllZENhcmRJbmZvKTtcbiAgICAgICAgICAgIGlmKGVycm9yIGluc3RhbmNlb2YgRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydCAoXCIrZ2V0TG9jYWxlQ2FyZFRleHQocGxheWFibGVDYXJkSW5mb1swXSkrXCIpIG1pc2x1a3QhIEZvdXQ6IFwiK2Vycm9yLm1lc3NhZ2UrXCIuXCIsXCJTcGVsZXJcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogXCIsZXJyb3IpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKGdldExvY2FsZUNhcmRUZXh0KHBsYXlhYmxlQ2FyZEluZm9bMF0pKStcIiBvcG5pZXV3IHZlcnN0dXVyZCFcIixcIlNwZWxlclwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhcmQgcGxheWVkIHNlbmQgYWdhaW4uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgamUga2FhcnQhXCIsXCJTZXJ2ZXJcIik7XG4gICAgfVxuXG4gICAgLy8gX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleCByZXBsYWNlZCBieSBfZ2V0Q2FyZFdpdGhTdWl0ZUFuZEluZGV4KCkgY29tYmluZWQgd2l0aCBfY2FyZFBsYXllZFxuXG4gICAgX2dldENhcmRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7cmV0dXJuKHN1aXRlPHRoaXMuX3N1aXRlQ2FyZHMubGVuZ3RoJiZ0aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXS5sZW5ndGg/dGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV1baW5kZXhdOm51bGwpO31cbiAgICAvLyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBfY2FyZFBsYXllZCgpIGRlZmluZWQgaW4gdGhlIGJhc2UgY2xhc3MgUGxheWVyIHdoaWNoIGluZm9ybXMgdGhlIGdhbWVcbiAgICAvLyBOT1RFIGNhcmRQbGF5ZWQgaXMgYSBnb29kIHBvaW50IGZvciBjaGVja2luZyB0aGUgdmFsaWRpdHkgb2YgdGhlIGNhcmQgcGxheWVkXG4gICAgLy8gTk9URSBjYW4ndCB1c2UgX2NhcmRQbGF5ZWQgKHNlZSBQbGF5ZXIgc3VwZXJjbGFzcylcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBkZWNpZGluZyB0byByZXR1cm4gdHJ1ZSBvbiBhY2NlcHRhbmNlLCBmYWxzZSBvdGhlcndpc2VcbiAgICBfbmV3Q2FyZFBsYXllZChjYXJkKXtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGxldCB0cmljaz10aGlzLmdhbWUuX3RyaWNrOyAvLyBNREhAMTlKQU4yMDIwOiBlYXNpZXN0IHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdHJpY2tcbiAgICAgICAgICAgIGlmKCF0cmljaylyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzbGFnIG9tIGVlbiBrYWFydCBpbiBiaWogdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wO1xuICAgICAgICAgICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl7IC8vIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZW9yZXRpY2FsbHkgdGhlIGNhcmQgY2FuIGJlIHBsYXllZCBidXQgaXQgbWlnaHQgYmUgdGhlIGNhcmQgd2l0aCB3aGljaCB0aGUgcGFydG5lciBjYXJkIGlzIGFza2VkISFcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGlzIGEgZ2FtZSB3aGVyZSB0aGVyZSdzIGEgcGFydG5lciBjYXJkIHRoYXQgaGFzbid0IGJlZW4gcGxheWVkIHlldFxuICAgICAgICAgICAgICAgIC8vIGFsdGVybmF0aXZlbHkgcHV0OiBzaG91bGQgdGhlcmUgYmUgYSBwYXJ0bmVyIGFuZCB0aGVyZSBpc24ndCBvbmUgeWV0Pz8/Pz9cbiAgICAgICAgICAgICAgICAvLyBCVUcgRklYOiBzdGlsbCB1c2luZyBnZXRUcnVtcFBsYXllcigpIGhlcmUgYWx0aG91Z2ggaXQgd2Fzbid0IGRlZmluZWQgYXQgYWxsIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgbm93IGNvcGllZCBvdmVyIGZyb20gUmlra2VuVGhlR2FtZS5qcyEhISAoYXMgaXQgaXMgY29tcHV0ZWQpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGU9PT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwIEJVRyBGSVg6IHdhcyB1c2luZyBhc2stcGFydG5lci1jYXJkLWJsaW5kIGluc3RlYWQgb2YgYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLmNoZWNrZWQmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJkLnN1aXRlIT09dGhpcy5fZ2FtZS5nZXRUcnVtcFN1aXRlKCl8fGNvbmZpcm0oXCJXaWx0IFUgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCldK1wiIChibGluZCkgdnJhZ2VuIG1ldCBlZW4gdHJvZWY/XCIpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7IC8vIHllcywgYXNraW5nIGJsaW5kISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vL2FsZXJ0KFwiXFx0QkxJTkQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLyphbGVydChcIk5vdCBpbmRpY2F0ZWQhISEhXCIpKi87XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0cmljay5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzJiZzdWl0ZT09PUNhcmQuU1VJVEVfU1BBREUpeyAvLyBzcGFkZSBpcyBiZWluZyBwbGF5ZWQgYnkgdGhlIGZpcnN0IHBsYXllciB3aGVyZWFzIHRoYXQgaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShDYXJkLlNVSVRFX1NQQURFKTx0aGlzLm51bWJlck9mQ2FyZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoY2FyZC5zdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSYmdGhpcy5nZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHRyaWNrLnBsYXlTdWl0ZSk+MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgXCIrZ2V0TG9jYWxlQ2FyZFRleHQoY2FyZCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPT1wYXJ0bmVyU3VpdGV8fGNhcmQucmFuayE9PXBhcnRuZXJSYW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2dldExvY2FsZUNhcmRUZXh0KGNhcmQpK1wiIG5pZXQgc3BlbGVuLCB3YW50IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgaXMgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogYXQgdGhpcyBwb2ludCB0aGUgY2FyZCBwbGF5ZWQgd2FzIGFjY2VwdGVkICh0aGVvcmV0aWNhbGx5KSwgaXQgb25seSBuZWVkcyB0byBiZSBzZW50IHN1Y2Nlc3NmdWxseSB0byB0aGUgc2VydmVyLCBhbmQgcmV0dXJuZWQgYXMgcGxheWVkIGNhcmRcbiAgICAgICAgICAgIHBsYXllZENhcmRJbmZvPVtjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkXTsgLy8gYnkgcmVtZW1iZXJpbmcgdGhlIGNhcmQgYmVpbmcgcGxheWVkIGhlcmUgYW5kIG5vdyB3ZSBibG9jayBmdXJ0aGVyIGF0dGVtcHRzIGZvciBhIHBsYXllciB0byBjaGFuZ2UgdGhlIGNhcmQgKHMpaGUgcGxheWVkXG4gICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwOiB3ZSBoYXZlIHRvIGFsc28gcmV0dXJuIHdoYXRldmVyIHRyaWNrIHZhbHVlIHRoYXQgbWlnaHQndmUgY2hhbmdlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgd2hpY2ggaW4gdGhpcyBjYXNlIGNvdWxkIHdlbCBiZSB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgJ2ZsYWcnXG4gICAgICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBJIHN1Z2dlc3QgY2hhbmdpbmcgYXNraW5nRm9yUGFydG5lckNhcmQgdG8gYXNraW5nRm9yUGFydG5lckNhcmQ8MCBpLmUuIGJsaW5kIHJlcXVlc3QhISFcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdlJ3JlIHRha2luZyBjYXJlIG9mIHRoYXQgd2hlbiBDQVJEIGlzIHNlbnQgKHNvIG5vdCB0byBpbnRlcmZlcmUgd2l0aCBSaWtrZW5UaGVHYW1lLmpzIGl0c2VsZilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXRDYXJkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAgICAgLyogTURIQDI3SkFOMjAyMDogcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyBtaWdodCBiZSB3cm9uZyBCVVQgYnkgcGFzc2luZyBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwgcGxheWVycyBpbmNsdWRpbmcgbXlzZWxmIHdpbGwgcmVjZWl2ZSB0aGUgY2FyZCBwbGF5ZWQgYW5kIHVwZGF0ZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW5nbHksIGJhc2ljYWxseSBhZGRDYXJkKCkgd2lsbCBzZXQgaXQgdG8gMSBpZiBpdCBzbyBkZXRlY3RzLCBidXQgY2Fubm90IHNldCBpdCB0byAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGVjaG5pY2FsbHkgYXNraW5nRm9yUGFydG5lckNhcmQgb25seSBuZWVkcyB0byBiZSBzZW5kIHdoZW4gdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZFxuICAgICAgICAgICAgaWYoZXJyb3IpcmV0dXJuIG5ldyBFcnJvcihcIkVyIGlzIGVlbiBmb3V0IG9wZ2V0cmVkZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydC5cIik7XG4gICAgICAgICAgICB0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBrYWFydCBnZXNwZWVsZCFcIik7XG4gICAgfVxuICAgIF9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoc3VpdGUsaW5kZXgpe2J1ZyhcIkRlemUgbWV0aG9kZSBtYWcgbmlldCBtZWVyIHdvcmRlbiBhYW5nZXJvZXBlbi5cIik7fVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICBpZighZ2FtZSl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlByb2dyYW1tYWZvdXQ6IEhldCBzcGVsIGthbiBuaWV0IHdvcmRlbiB2ZXJsYXRlbiwgYWxzIGhldCBuaWV0IGFmZ2Vsb3BlbiBpcyAodG9lc3RhbmQ6IFwiK3RoaXMuX2dhbWUuc3RhdGUrXCIpLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighdGhpcy5fZ2FtZS5kb25lKCkpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlZlcmxhdGVuIHZhbiBoZXQgc3BlbCBtaXNsdWt0ISBQcm9iZWVyIGhldCBub2cgZWVucy5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgICAgICAgICAvLyBvdGhlciB0aGluZ3MgdG8gZG8/Pz8/Pz8/XG4gICAgICAgICAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRGUgb3ZlcmdlYmxldmVuIGthYXJ0ZW4gaW4gamUgaGFuZCB3b3JkZW4gdmVyd2lqZGVyZCFcIixcIlNwZWxcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHNlbmRpbmcgdGhlIERPTkUgZXZlbnQgc3VjY2VlZHMgcmVhZHkgYWdhaW4gdG8gcGxheSBpbiBhIG5leHQgZ2FtZSAod2l0aG91dCBsZWF2aW5nIHRoZSBnYW1lIHBsYXlpbmcpXG4gICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdXBlci5wbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpO1xuICAgIH1cbiAgICAvLyBjYWxsIHJlbmRlckNhcmRzIGp1c3QgYWZ0ZXIgdGhlIHNldCBvZiBjYXJkcyBjaGFuZ2VcbiAgICByZW5kZXJDYXJkcygpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKiBSZW5kZXJpbmcgcGxheWVyIGNhcmRzICoqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICB0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKTtcbiAgICAgICAgLy8gVE9ETyBwcm9iYWJseSBiZXN0IHRvIHNob3cgdGhlbSBvbiBBTEwgcGFnZXMgKG5vIG1hdHRlciB3aGljaCBvbmUgaXMgY3VycmVudGx5IHNob3dpbmchKVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIHN3aXRjaChjdXJyZW50UGFnZSl7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1iaWRkaW5nXCI6dXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IG9ubHkgb25jZVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGxheWluZ1wiOnVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBhZnRlciBwbGF5aW5nIGEgY2FyZCEhXG4gICAgICAgICAgICBjYXNlIFwicGFnZS10cnVtcC1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH1cbiAgICAvLyBleGl0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiBhIHBsYXllciBzdG9wcyBwbGF5aW5nXG4gICAgLy8gZWl0aGVyIGJ5IGV4cGxpY2l0bHkgdXNpbmcgdGhlIHN0b3AgYnV0dG9uKHMpIG9yIGxlYXZpbmcvY2xvc2luZyB0aGUgcGFnZVxuICAgIC8vIFRPRE8gc2hvdWxkIHdlIG51bGwgdGhlIGdhbWU/Pz8/Pz8/P1xuICAgIGV4aXQocmVhc29uKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICB0aGlzLl9nYW1lLmV4aXQocmVhc29uKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWU9bnVsbDsgLy8gVE9ETyBvciBhbnkgb3RoZXIgd2F5IHRvIGluZGljYXRlIHRvIGluZGljYXRlIHRoYXQgdGhlIHBsYXllciBzdG9wcGVkIHBsYXlpbmdcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gYnV0dG9uIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4vKipcbiAqIGNsaWNraW5nIGEgYmlkIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBiaWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBiaWRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBNREhAMDNGRUIyMDIwOiBwcmV2ZW50IG1ha2luZyBhIGJpZCB3aGVuIG5vdCBzdXBwb3NlZCB0byBkbyBzb1xuICAgIGlmKHRvTWFrZUFCaWQ8PTApcmV0dXJuIGFsZXJ0KFwiSmUgbWFnIG51IG5pZXQgYmllZGVuISBIZXQgd2FjaHRlbiBpcyBvcCBlZW4gc2VpbnRqZSB2YW4gZGUgc2VydmVyLlwiKTtcbiAgICBpZihiaWRNYWRlSW5mbylyZXR1cm4gYWxlcnQoXCJKZSBoZWJ0IGFsIGVlbiBib2QgdWl0Z2VicmFjaHQhXCIpO1xuICAgIHRyeXtcbiAgICAgICAgbGV0IGJpZD1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtYmlkXCIpKTtcbiAgICAgICAgaWYoaXNOYU4oYmlkKXx8YmlkPDApcmV0dXJuIGFsZXJ0KGJ1ZyhcIk9uZ2VsZGlnIGJvZCAoXCIrKGJpZD9iaWQ6XCI/XCIpK1wiKSFcIikpO1xuICAgICAgICBiaWRNYWRlSW5mbz1iaWQ7IC8vIHJlbWVtYmVyIHRoZSBiaWQgaW4gY2FzZSB3ZSBuZWVkIHRvIHNlbmQgaXQgYWdhaW5cbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmlkIGNob3NlbiAodG8gYmUgc2VudCBmb3IgdGhlIGZpcnN0IHRpbWUpOiBcIixiaWRNYWRlSW5mbyk7XG4gICAgICAgIGxldCBlcnJvcj1jdXJyZW50UGxheWVyLl9zZXRCaWQoYmlkTWFkZUluZm8pOyAvLyB0aGUgdmFsdWUgb2YgdGhlIGJ1dHRvbiBpcyB0aGUgbWFkZSBiaWRcbiAgICAgICAgaWYoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAgICAgICAgIHNldEluZm8oXCJQcm9ibGVtZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGplIGJvZDogXCIrZXJyb3IubWVzc2FnZStcIi4gV2UgYmxpanZlbiBoZXQgcHJvYmVyZW4uXCIsXCJTcGVsXCIpO1xuICAgICAgICBlbHNlIC8vIGJpZCBkb25lISEhXG4gICAgICAgICAgICBzZXRJbmZvKFwiQm9kIHZlcnN0dXVyZCFcIixcIlNwZWxcIik7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PShiaWRNYWRlSW5mbz9cImhpZGRlblwiOlZJU0lCTEUpOyAvLyBzaG93IGFnYWluXG4gICAgfVxufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIit0cnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7XG4gICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK3BhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpO1xuICAgIC8vIGdvIGRpcmVjdGx5IHRvIHRoZSBnYW1lIChpbnN0ZWFkIG9mIHRocm91Z2ggdGhlIHBsYXllcilcbiAgICBjdXJyZW50UGxheWVyLl9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKTtcbn1cblxudmFyIHBsYXlhYmxlY2FyZENlbGwscGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBcbiAgICAvLyBNREhAMDVGRUIyMDIwOiBwcmV2ZW50IGZyb20gcGxheWluZyBhIGNhcmQgd2hlbiBhIGNhcmQgaGFzIGFscmVhZHkgYmVlbiBwbGF5ZWQgKGFuZCBub3QgeWV0IGNvbmZpcm1lZCBieSB0aGUgc2VydmVyKVxuICAgIGlmKHRvUGxheUFDYXJkPD0wKXJldHVybiBhbGVydChcIkplIG1hZyBudSBnZWVuIGthYXJ0IHNwZWxlbiEgSGV0IHdhY2h0ZW4gaXMgb3AgZWVuIHNlaW50amUgdmFuIGRlIHNlcnZlci5cIik7XG4gICAgXG4gICAgaWYocGxheWVkQ2FyZEluZm8pcmV0dXJuIGFsZXJ0KFwiSmUgaGVidCBhbCBlZW4ga2FhcnQgKFwiK2dldExvY2FsZUNhcmRUZXh0KHBsYXllZENhcmRJbmZvWzBdKStcIikgZ2VzcGVlbGQuXCIpO1xuXG4gICAgcGxheWFibGVjYXJkQ2VsbD0oZXZlbnQmJmV2ZW50LmN1cnJlbnRUYXJnZXQpOyAvLyByZW1lbWJlciB0aGUgJ2NlbGwnIG9mIHRoZSBjYXJkIGNsaWNrZWQhISEhXG4gICAgaWYoIXBsYXlhYmxlY2FyZENlbGwpcmV0dXJuOyAvLyBUT0RPIHNob3VsZCB3ZSByZXNwb25kIGhlcmU/Pz8/XG5cbiAgICBsZXQgY2FyZFN1aXRlPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSk7XG4gICAgbGV0IGNhcmRSYW5rPXBhcnNlSW50KHBsYXlhYmxlY2FyZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pbmRleFwiKSk7XG4gICAgaWYoY2FyZFN1aXRlPENhcmQuU1VJVEVfRElBTU9ORHx8Y2FyZFN1aXRlPkNhcmQuU1VJVEVfU1BBREV8fGNhcmRSYW5rPENhcmQuUkFOS19UV098fGNhcmRSYW5rPkNhcmQuUkFOS19BQ0UpcmV0dXJuO1xuXG4gICAgLy8vLy8vLy9pZihwbGF5YWJsZWNhcmRDZWxsLnN0eWxlLmJvcmRlcj1cIjBweFwiKXJldHVybjsgLy8gZW1wdHkgJ3VuY2xpY2thYmxlJyBjZWxsXG4gICAgLy8gTURIQDA1RkVCMjAyMDogcmVwbGFjaW5nIHRoZSBvcmlnaW5hbCBjYWxsIHRvIF9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoKSB3aXRoIHRoZSBjYWxscyB0byB0aGUgT25saW5lUGxheWVyKCkgbWV0aG9kcyByZXBsYWNpbmcgdGhlIHNpbmdsZSBjYWxsIHNvIHdlIGtub3cgdGhlIGNhcmQgcGxheWVkISFcbiAgICBsZXQgY2FyZFBsYXllZD1jdXJyZW50UGxheWVyLl9nZXRDYXJkV2l0aFN1aXRlQW5kSW5kZXgoY2FyZFN1aXRlLGNhcmRSYW5rKTtcbiAgICBsZXQgZXJyb3I9Y3VycmVudFBsYXllci5fbmV3Q2FyZFBsYXllZChjYXJkUGxheWVkKTsgXG4gICAgaWYocGxheWVkQ2FyZEluZm8peyAvLyBNREhAMDVGRUIyMDIwIHJlcGxhY2luZzogIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSl7IC8vIGNhcmQgYWNjZXB0ZWQhISFcbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTsgLy8gbm8gbmVlZCB0byBwcm9tcHQgdGhlIHVzZXIgYW55bW9yZSwgKHMpaGUgb25seSBuZWVkcyB0byB3YWl0IGZvciB0aGUgY2FyZCB0byBiZSBhcnJpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgLyogTURIQDA1RkVCMjAyMDogTk9UIHRvIHJlbW92ZSB0aGUgY2FyZCBmcm9tIHNob3dpbmcgdW50aWwgaXQgd2FzIGNvbmZpcm1lZCBieSB0aGUgc2VydmVyIHRvIGhhdmUgYmVlbiBwbGF5ZWQsIHdlIG9ubHkgbmVlZCB0byBwcmV2ZW50IHBsYXlpbmcgYW5vdGhlciBjYXJkISEhXG4gICAgICAgIHBsYXlhYmxlY2FyZENlbGxDb250ZW50cz1wbGF5YWJsZWNhcmRDZWxsLmlubmVySFRNTDsgLy8gaW4gY2FzZSBzZW5kaW5nIHRoZSBjYXJkIGZhaWxzXG4gICAgICAgIHBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnMoZmFsc2UpOyAvLyBkaXNhYmxlIHRoZSBjYXJkIGJ1dHRvbnNcbiAgICAgICAgKi9cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkplIGhlYnQgXCIrZ2V0TG9jYWxlQ2FyZFRleHQocGxheWVkQ2FyZEluZm9bMF0pK1wiIGdlc3BlZWxkLlwiOyAvLyBNREhAMjNKQU4yMDIwOiBnZXQgcmlkIG9mIHRoZSBwbGF5IGNhcmQgcHJvbXB0IVxuICAgIH1lbHNlIC8vIHJlcG9ydCB0aGUgZXJyb3IgdG8gdGhlIGVuZCB1c2VyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJKZSBtYWcgXCIrZ2V0TG9jYWxlQ2FyZFRleHQoY2FyZFBsYXllZCkrXCIgbmlldCBzcGVsZW4uIFNwZWVsIGVlbiBhbmRlcmUga2FhcnQhXCI7XG59XG4vKipcbiAqIGNvbnZlbmllbnQgdG8gYmUgYWJsZSB0byB0dXJuIHRoZSBwbGF5YWJsZSBjYXJkIGJ1dHRvbnMgb24gYW5kIG9mZiBhdCB0aGUgcmlnaHQgbW9tZW50XG4gKiBAcGFyYW0ge2VuYWJsZX0gZW5hYmxlIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGVuYWJsZSl7XG4gICAgLy8gY2xpY2tpbmcgY2FyZCAnYnV0dG9ucycgKG5vdyBjZWxscyBpbiB0YWJsZSksIHdlIGNhbiBnZXQgcmlkIG9mIHRoZSBidXR0b24gaXRzZWxmISEhXG4gICAgLy8gTURIQDA1RkVCMjAyMDogYWRkaXRpb25hbCBjaGVjazogaWYgYSBjZWxsIGlzIGVtcHR5IGRvIG5vdCBlcnJvbmVvdXNseSBtYWtlIGl0IGNsaWNrYWJsZSEhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZSYmcGxheWFibGVjYXJkQnV0dG9uLmlubmVySFRNTC5sZW5ndGg+MD9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuREVBTElORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJEZSBrYWFydGVuIHdvcmRlbiBnZXNjaHVkIGVuIGdlZGVlbGQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRERJTkc6XG4gICAgICAgICAgICAvLyB3aGVuIG1vdmluZyBmcm9tIHRoZSBERUFMSU5HIHN0YXRlIHRvIHRoZSBCSURESU5HIHN0YXRlIGNsZWFyIHRoZSBiaWQgdGFibGVcbiAgICAgICAgICAgIC8vIEFMVEVSTkFUSVZFTFkgdGhpcyBjb3VsZCBiZSBkb25lIHdoZW4gdGhlIGdhbWUgZW5kc1xuICAgICAgICAgICAgLy8gQlVUIHRoaXMgaXMgYSBiaXQgc2FmZXIhISFcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgYmllZGVuIGlzIGJlZ29ubmVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgLyogaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKSovXG4gICAgICAgICAgICBjbGVhckJpZHNUYWJsZSgxKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gYWxsb3dpbmcgdGhlIHVzZXIgdG8gY2xcbiAgICAgICAgICAgIC8qIE1ESEAxOUpBTjIwMjA6IGluIGR1ZSBjb3Vyc2Ugd2Ugd2lsbCBiZSByZW1vdmluZyB0aGUgZm9sbG93aW5nIHR3byBsaW5lc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZS5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQrPTE7IC8vIFFVSUNLIEZJWCB0byBnZXQgdG8gc2VlIHRoZSBsYXN0IHRyaWNrIGF0IHRoZSByaWdodCBwb3NpdGlvbiEhISEhXG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJEZSByZWdlbHMgdmFuIGhldCBvbmxpbmUgc3BlbC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dXAtZ2FtZVwiOiAvLyB3aGVuIHBsYXlpbmcgaW4gZGVtbyBtb2RlLCB0aGUgdXNlciBzaG91bGQgZW50ZXIgZm91ciBwbGF5ZXIgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RGVmYXVsdFBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZ1bCBkZSBuYW1lbiB2YW4gZGUgc3BlbGVycyBpbi4gRWVuIHNwZWxlcm5hYW0gaXMgdm9sZG9lbmRlLlwiLFwiU3BlbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYXV0aFwiOiAvLyBwYWdlLWF1dGhcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJHZWVmIGRlIG5hYW0gb3Agd2Fhcm9uZGVyIFUgd2lsdCBzcGVsZW4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3YWl0LWZvci1wbGF5ZXJzXCI6IC8vIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkV2ZW4gZ2VkdWxkIGF1Yi4gV2Ugd2FjaHRlbiB0b3QgZXIgZ2Vub2VnIG1lZGVzcGVsZXJzIHppam4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiaWRkaW5nXCI6IC8vIHBhZ2UtYmlkZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIldhY2h0IG9tIGRlIGJldXJ0IG9wIGVlbiB2ZXJ6b2VrIHRvdCBoZXQgZG9lbiB2YW4gZWVuIGJvZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXktcmVwb3J0aW5nXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXlpbmdcIjogLy8gPz8/P1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG8gZXZlcnl0aGluZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyBzdGFydGluZyB0aGUgZ2FtZSBwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgMVwiOyAvLyBqdXN0IGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyBqdXN0IGluIGNhc2UhIVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvcCBoZXQgdmVyem9layB0b3QgaGV0IG9wZ2V2ZW4gdmFuIGRlIHRyb2Vma2xldXIgZW4vb2YgZGUgbWVlIHRlIHZyYWdlbiBhYXMvaGVlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiSGV0IHNwZWxlbiBiZWdpbnQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgYWxlcnQoXCJCVUc6IFVua25vd24gcGFnZSAnXCIrX3BhZ2UrXCInIHJlcXVlc3RlZCFcIik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBuZXh0UGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIG5leHQgcGFnZSFcIik7XG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICAvLyBNREhAMDdKQU4yMDIwOiBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIG5leHQgcGFnZSwgd2hlbiBub3QgcnVubmluZyBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIHBhZ2UtYXV0aCBwYWdlXG4gICAgLy8gICAgICAgICAgICAgICAgaW4gZGVtbyBtb2RlIHNraXAgdGhlIGF1dGggYW5kIHdhaXQgZm9yIHBsYXllcnMgYnV0dG9uXG4gICAgc3dpdGNoKHBhZ2VJbmRleCl7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWF1dGhcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOiAvLyBzaG91bGQgd2UgY2hlY2sgdGhlIHVzZXIgbmFtZXM/Pz8/Pz9cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCsxKSVQQUdFUy5sZW5ndGhdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbmNlbFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBwcmV2aW91cyBwYWdlLlwiKTtcbiAgICAvLyBnbyBvbmUgcGFnZSBiYWNrXG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrUEFHRVMubGVuZ3RoLTEpJVBBR0VTLmxlbmd0aF0pO1xufVxuZnVuY3Rpb24gcmV0dXJuVG9QcmV2aW91c1BhZ2UoKXtcbiAgICAvLyBwb3Agb2ZmIHRoZSBwYWdlIHdlIGFyZSBnb2luZyB0byB2aXNpdCwgcHJldmVudGluZyB0byBwdXNoIHRoZSBjdXJyZW50UGFnZSBhZ2FpblxuICAgIGlmKHZpc2l0ZWRQYWdlcy5sZW5ndGg+MCl7Y3VycmVudFBhZ2U9bnVsbDtzZXRQYWdlKHZpc2l0ZWRQYWdlcy5zaGlmdCgpKTt9XG59XG5mdW5jdGlvbiBzaG93SGVscCgpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgaGVscCFcIik7XG4gICAgc2V0UGFnZSgncGFnZS1ydWxlcycpO1xufVxuLy8gYXNjZXJ0YWluIHRvIGRpc2FibGUgdGhlIEhlbHAgYnV0dG9uIHdoZW4gdmlld2luZyBpdCEhIVxuZnVuY3Rpb24gdXBkYXRlSGVscEJ1dHRvbnMoKXtcbiAgICBsZXQgZW5hYmxlSGVscEJ1dHRvbj0oY3VycmVudFBhZ2UhPT0ncGFnZS1oZWxwJyk7XG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLmRpc2FibGVkPSFlbmFibGVIZWxwQnV0dG9uO1xufVxuXG4vKipcbiAqIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBuZXctcGxheWVycyBidXR0b24gaXMgY2xpY2tlZCwgdG8gc3RhcnQgYSBuZXcgZ2FtZSB3aXRoIGEgbmV3IHNldCBvZiBwbGF5ZXJzXG4gKi9cbmZ1bmN0aW9uIG5ld1BsYXllcnMoKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBOaWV1d2Ugc3BlbGVycyBhYW5tYWtlbi5cIik7XG4gICAgcGxheWVycz1bXTtcbiAgICBsZXQgbm9QbGF5ZXJOYW1lcz10cnVlO1xuICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgcGxheWVyIGlucHV0IGZpZWxkc1xuICAgIGZvcihwbGF5ZXJOYW1lSW5wdXQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYocGxheWVyTmFtZUlucHV0LnZhbHVlLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIG5vUGxheWVyTmFtZXM9ZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lSW5wdXQudmFsdWUpKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYocGxheWVycy5sZW5ndGg8NClcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChudWxsKTtcbiAgICB9XG4gICAgaWYobm9QbGF5ZXJOYW1lcyl7XG4gICAgICAgIHBsYXllcnM9bnVsbDtcbiAgICAgICAgc2V0SW5mbyhcIkdlZW4gc3BlbGVybmFtZW4gb3BnZWdldmVuLiBIZWIgdGVubWluc3RlIGVlbiBzcGVsZXJuYWFtIG5vZGlnIVwiLFwiU3BlbFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlJpa2tlbiAtIGhldCBzcGVsOiBOaWV1d2Ugc3BlbGVycyBhYW5nZW1hYWt0IVwiKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsR2FtZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsvL2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIkdlZW4gc3BlbCFcIik7XG4gICAgaWYoIXJpa2tlblRoZUdhbWUpe1xuICAgICAgICBhbGVydChcIkdlZW4gc3BlbCBvbSBhZiB0ZSBicmVrZW4hIExhYWQgZGV6ZSB3ZWIgcGFnaW5hIG9wbmlldXchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGNvbmZpcm0oXCJXaWx0IFUgZWNodCBoZXQgaHVpZGlnZSBzcGVsIGFmYnJla2VuP1wiKSl7XG4gICAgICAgIHJpa2tlblRoZUdhbWUuY2FuY2VsKCk7XG4gICAgfVxufVxuLyogXG5mdW5jdGlvbiBuZXdUcmlja0J1dHRvbkNsaWNrZWQoKXtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgICghcmlra2VuVGhlR2FtZXx8cmlra2VuVGhlR2FtZS5zaG93TmV3VHJpY2tJbmZvKCkpO1xufVxuKi9cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGl0aW9uYWwgc3R1ZmYgdGhhdCB3ZSdyZSBnb2luZyB0byBuZWVkIHRvIG1ha2UgdGhpcyBzdHVmZiB3b3JrXG5jbGFzcyBQbGF5ZXJHYW1lUHJveHkgZXh0ZW5kcyBQbGF5ZXJHYW1lIHtcblxuICAgIC8vIGdldFNlbmRFdmVudChldmVudCxkYXRhKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKStcIi5cIik7XG4gICAgLy8gICAgIHJldHVybiBbZXZlbnQsZGF0YV07XG4gICAgLy8gfVxuXG4gICAgLy8gTURIQDIzSkFOMjAyMDogY2FsbGVkIGZyb20gdXBkYXRlQmlkc1RhYmxlXG4gICAgZ2V0UGxheWVySW5kZXgocGxheWVyTmFtZSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD0odGhpcy5fcGxheWVyTmFtZXM/dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoOjApO1xuICAgICAgICB3aGlsZSgtLXBsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF0hPT1wbGF5ZXJOYW1lKTtcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7Y29uc29sZS5sb2coXCJQbGF5ZXIgbmFtZSAnXCIrcGxheWVyTmFtZStcIicgbm90IGZvdW5kIGluIFwiK0pTT04uc3RyaW5naWZ5KHRoaXMuX3BsYXllck5hbWVzKStcIi5cIik7fVxuICAgICAgICByZXR1cm4gcGxheWVySW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0IG51bWJlck9mUGxheWVycygpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg7fVxuXG4gICAgLy8gTURIQDI2SkFOMjAyMDogbmVlZGVkIHRoaXMgYXMgd2VsbCB0byBkZXRlcm1pbmUgdGhlIHRydW1wIHBsYXllciAodXNpbmcgYmlkZGVycyBzdGVhZCBvZiBiaWRQbGF5ZXJzIGhlcmUpXG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXtcbiAgICAgICAgLy8gb25seSB3aGVuIHBsYXlpbmcgYSAncmlrJyBnYW1lICh3aXRoIHRydW1wLCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXIsIGJ1dCBub3QgdHJvZWxhLCB3ZSBoYXZlIGEgdHJ1bXAgcGxheWVyKVxuICAgICAgICBpZih0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLJiZ0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXJldHVybiAtMTtcbiAgICAgICAgaWYoIXRoaXMuX2hpZ2hlc3RCaWRkZXJzfHx0aGlzLl9oaWdoZXN0QmlkZGVycy5sZW5ndGg9PTApcmV0dXJuIC0xO1xuICAgICAgICByZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnNbMF07XG4gICAgfVxuXG4gICAgLy8gTURIQDI1SkFOMjAyMDogZ2FtZSBjYW5ub3QgY29udGludWUgdW50aWwgc3VjY2VlZGluZyBpbiBnZXR0aW5nIHRoZSBhY3Rpb24gb3ZlciB0byB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICAvLyAgICAgICAgICAgICAgICB0byBndWFyYW50ZWUgZGVsaXZlcnkgd2UgcnVuIGEgcmVzZW5kIHRpbWVyIHRoYXQgd2lsbCBjb250aW51ZSBzZW5kaW5nIHVudGlsIHRoZSBjYWxsYmFjayBnZXRzIGNhbGxlZFxuICAgIC8vIF9ldmVudFNlbnQgd2lsbCBnZXQgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IHdhcyByZWNlaXZlZCBieSB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICBfc2VudEV2ZW50UmVjZWl2ZWQoKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKXtjbGVhckludGVydmFsKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCk7dGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPW51bGw7fVxuICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdK1wiIHJlY2VpdmVkIGJ5IGdhbWUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmQ9bnVsbDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRTZW5kQ2FsbGJhY2spdGhpcy5fZXZlbnRTZW50Q2FsbGJhY2soKTtcbiAgICB9XG4gICAgX3NlbmRFdmVudCgpe1xuICAgICAgICBsZXQgcmVzdWx0PWZhbHNlO1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCh0aGlzLl9ldmVudFRvU2VuZFswXSx0aGlzLl9ldmVudFRvU2VuZFsxXSx0aGlzLl9zZW50RXZlbnRSZWNlaXZlZCk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudFRvU2VuZFsyXSsrO1xuICAgICAgICAgICAgcmVzdWx0PXRydWU7XG4gICAgICAgICAgICAvLyBNREhAMDFGRUIyMDIwOiB3ZSBzaG93IGhvdyBvZnRlbiBhIGNlcnRhaW4gZXZlbnQgd2FzIHNlbnQgb24gdGhlIHNlbmRNZXNzYWdlQnV0dG9uXG4gICAgICAgICAgICBpZih0aGlzLl9ldmVudFRvU2VuZFsyXT4xKVxuICAgICAgICAgICAgICAgIHNlbmRNZXNzYWdlQnV0dG9uLnZhbHVlPXBsYXllclN0YXRlTWVzc2FnZXNbY3VycmVudFBsYXllclN0YXRlXStcIiAoXCIrdGhpcy5fZXZlbnRUb1NlbmRbMl0rXCJ4KVwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXSsodGhpcy5fZXZlbnRUb1NlbmRbMV0/XCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpOlwiXCIpK1wiIHNlbnQgKGF0dGVtcHQ6IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzJdK1wiKS5cIik7XG4gICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBGYWlsZWQgdG8gc2VuZCBldmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiB0byB0aGUgZ2FtZSBzZXJ2ZXIgKHJlYXNvbjogXCIrZXJyb3IubWVzc2FnZStcIikuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIF9zZXRFdmVudFRvU2VuZChldmVudCxkYXRhLGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5fZXZlbnRTZW50Q2FsbGJhY2s9Y2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPVtldmVudCxkYXRhLDBdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSBzZW5kIGV2ZW50IGNvdW50XG4gICAgICAgIGlmKCF0aGlzLl9zZW5kRXZlbnQoKSlyZXR1cm4gZmFsc2U7IC8vIHVzZXIgbXVzdCBtYWtlIHRoZWlyIGNob2ljZSBhZ2FpblxuICAgICAgICAvLyBzY2hlZHVsZSBuZXh0IHJlc2VuZHNcbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPXNldEludGVydmFsKHRoaXMuX3NlbmRFdmVudCw1MDAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gd2hhdCB0aGUgcGxheWVyIHdpbGwgYmUgY2FsbGluZyB3aGVuIChzKWhlIG1hZGUgYSBiaWQsIHBsYXllZCBhIGNhcmQsIGNob29zZSB0cnVtcCBvciBwYXJ0bmVyIHN1aXRlXG4gICAgYmlkTWFkZShiaWQpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogdW5mb3J0dW5hdGVseSBJIGVuY291bnRlcmVkIHByb2JsZW1zIHdpdGggdGhlIGJpZGRpbmcgYnV0dG9ucyBub3QgaGlkaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGFuZCBiZWNhdXNlIGl0IGRvZXMgbm90IHJlYWxseSBtYXR0ZXIgd2hvIG1hZGUgdGhlIGJpZFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICBsZXQgYmlkTWFkZVNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0JJRCcsYmlkLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJCb2QgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IG5vdz8/P1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGlmKGJpZE1hZGVTZW50UmVzdWx0KXNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRF9ET05FKTtcbiAgICAgICAgcmV0dXJuIGJpZE1hZGVTZW50UmVzdWx0O1xuICAgIH1cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSdyZSBzZW5kaW5nIHRoZSBleGFjdCBjYXJkIG92ZXIgdGhhdCB3YXMgcGxheWVkIChhbmQgYWNjZXB0ZWQgYXQgdGhpcyBlbmQgYXMgaXQgc2hvdWxkIEkgZ3Vlc3MpXG4gICAgLy8gTURIQDE0SkFOMjAyMDogcGFzc2luZyBpbiB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgJ2ZsYWcnIGFzIHdlbGwhISEhXG4gICAgLy8gICAgICAgICAgICAgICAgYmVjYXVzZSB3ZSdyZSBvdmVycmlkaW5nIHRoZSBiYXNlIFJpa2tlblRoZUdhbWUgaW1wbGVtZW50YXRpb25cbiAgICAvLyAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBkb2Vzbid0IGVuZCB1cCBpbiB0aGUgbG9jYWwgUmlra2VuVGhlR2FtZSB0cmlja1xuICAgIC8vIE1ESEAyN0pBTjIwMjA6IHdlJ3JlIHJlY2VpdmluZyB0cnVlIGZvciBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kIHdoZW4gdGhlIHBsYXllciBpcyBkb2luZyBzb1xuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpe3NldEluZm8oXCJIZXQgc3BlbCBrYW4gbmlldCB2ZXJkZXIgZ2VzcGVlbGQgd29yZGVuIVwiLFwiU3BlbFwiKTtyZXR1cm4gZmFsc2U7fVxuICAgICAgICAvLyBNREhAMTdKQU4yMDIwOiBkaXNhYmxlIHRoZSBidXR0b25zIG9uY2UgdGhlIGNhcmQgaXMgYWNjZXB0ZWQgKHRvIGJlIHBsYXllZCEhISlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgVE9ETyBwZXJoYXBzIGhpZGluZyB0aGUgY2FyZHMgc2hvdWxkIGFsc28gYmUgZG9uZSBoZXJlISEhXG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgY2FyZCBwbGF5ZWQ6IFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhmYWxzZSk7XG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IHdlIHNlbmQgdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkIGZsYWcgYWxvbmcgZXZlcnkgdGltZSBhbHRob3VnaCBpdCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb24gYW55IHRyaWNrIGNhcmQgZXhjZXB0IHRoZSBmaXJzdCBjYXJkIHBsYXllZCwgYW5kIG5vbi1uZWdhdGl2ZSB2YWx1ZXMgYXJlIGlnbm9yZWQgYXMgd2VsbFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHRoZSBvbmx5IHRoaW5nIHRoYXQgdGhlIG90aGVyIHNpZGUgY2Fubm90IGRldGVybWluZSBpcyB3aGV0aGVyIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQgYmxpbmQhISEhXG4gICAgICAgIC8vIHJlcGxhY2luZzogaWYoYXNraW5nRm9yUGFydG5lckNhcmQ8MCljYXJkUGxheWVkSW5mby5wdXNoKHRydWUpOyAvLyBzZXQgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGJsaW5kIGZsYWchISFcbiAgICAgICAgbGV0IGNhcmRTZW50UmVzdWx0PVxuICAgICAgICAgICAgdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0NBUkQnLFtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF0sZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiO1xuICAgICAgICAgICAgICAgIGVsc2UvLyBjYXJkIHBsYXllZCBhY2NlcHRlZCEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IGdlYWNjZXB0ZWVyZC5cIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgY2FsbCB0byBfc2V0RXZlbnRUb1NlbmQgKHN5bmNocm9ub3VzKSwgYW5kIG9idmlvdXNseSB3ZSBwdXQgYmFjayB0aGUgY2FyZFxuICAgICAgICBpZighY2FyZFNlbnRSZXN1bHQpe1xuICAgICAgICAgICAgYWxlcnQoXCJLYWFydCBuaWV0IHZlcnN0dXVyZD9cIik7XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAvLyAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCI7XG4gICAgICAgICAgICBpZihwbGF5YWJsZWNhcmRDZWxsKVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydCBtaXNsdWt0ISBQcm9iZWVyIGhldCB6byBub2cgZWVucy5cIik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkVyIGlzIGlldHMgbWlzZ2VnYWFuLiBQcm9iZWVyIGhldCB6byBub2cgZWVucy5cIik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkdlc3BlZWxkZSBrYWFydCB2ZXJzdHV1cmQuXCI7XG4gICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9DQVJEX1BMQVlFRCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhcmRTZW50UmVzdWx0O1xuICAgIH1cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXtzZXRJbmZvKFwiSGV0IHNwZWwga2FuIG5pZXQgdmVyZGVyIGdlc3BlZWxkIHdvcmRlbiFcIixcIlNwZWxcIik7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlQ2hvc2VuU2VudFJlc3VsdD10aGlzLl9zZXRFdmVudFRvU2VuZCgnVFJVTVBTVUlURScsdHJ1bXBTdWl0ZSxmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHRyb2Vma2xldXIgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgdG8gZG8gbm93P1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHRyb2Vma2xldXIgZ2VhY2NlcHRlZXJkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGlmKHRydW1wU3VpdGVDaG9zZW5TZW50UmVzdWx0KXNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1RSVU1QX0RPTkUpO1xuICAgICAgICByZXR1cm4gdHJ1bXBTdWl0ZUNob3NlblNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXtzZXRJbmZvKFwiSGV0IHNwZWwga2FuIG5pZXQgdmVyZGVyIGdlc3BlZWxkIHdvcmRlbiFcIixcIlNwZWxcIik7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gcGFydG5lciBrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZCFcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgdG8gZG8gbm93P1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHBhcnRuZXIga2xldXIgZ2VhY2NlcHRlZXJkIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnc3VpdGUnOnBhcnRuZXJTdWl0ZX0pKTtcbiAgICAgICAgIGlmKHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQpc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUl9ET05FKTtcbiAgICAgICAgIHJldHVybiBwYXJ0bmVyU3VpdGVDaG9zZW5TZW50UmVzdWx0O1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiB3aGVuIHRoZSB1c2VyIGZpbmlzaGVkIHJlYWRpbmcgdGhlIHJlc3VsdHMsIGFuZCB3YW50cyB0byBjb250aW51ZSBwbGF5aW5nIGRvbmUoKSBzaG91bGQgYmUgY2FsbGVkXG4gICAgZG9uZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0RPTkUnLG51bGwsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9ORSBldmVudCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIE1ESEAyOUpBTjIwMjA6IEkgaGF2ZSB0byBkbyB0aGlzIG90aGVyd2lzZSBJIHdvbid0IGJlIGFibGUgdG8gcGxheSBpbiBhIG5ldyBnYW1lIChzZWUgc2V0IHBsYXllck5hbWVzISEhISlcbiAgICAgICAgICAgIHNldEluZm8oXCJab2RyYSBlciB3ZWVyIHZpZXIgbmlldC1zcGVsZW5kZSBkZWVsbmVtZXJzIHppam4ga3VuIGplIHdlZXIgc3BlbGVuLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhpdChyZWFzb24pe1xuICAgICAgICAvLyBwbGF5ZXIgaXMgZXhpdGluZyBzb21laG93Li4uXG4gICAgICAgIGxldCBkYXRhPShyZWFzb24/cmVhc29uOihjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIlwiKSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnRVhJVCcsZGF0YSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFWElUIGV2ZW50IFwiK2RhdGErXCIgYWNrbm93bGVkZ2VkIVwiKTtcbiAgICAgICAgICAgIC8vIHdlJ3JlIE5PVCBnb2luZyBhbnl3aGVyZSBhbnltb3JlOiBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCl7cmV0dXJuIHRoaXMuX3N0YXRlO31cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZC5wdXNoKHtldmVudDpldmVudCxkYXRhOmRhdGF9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gVE9ETyBoYXZlIHRvIGNoYW5nZSB0aGlzIHRvIGluY2x1ZGUgdGhlIGZyaWVuZGx5IGZsYWcgYXMgd2VsbCEhISFcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgcmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcblxuICAgICAgICAvLyBNREhAMjlKQU4yMDIwOiB3YWl0IHdpdGggYWN0dWFsbHkgcGxheWluZyB0aGUgZ2FtZSB3aXRoIHRoZXNlIHBsYXllcnMgdW50aWwgd2UgZm91bmQgb3V0IHRoYXQgdGhlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGN1cnJlbnQgcGxheWVyIGlzIGFjdHVhbGx5IGluIHRoZSBnYW1lISEhISFcblxuICAgICAgICBpZighY3VycmVudFBsYXllcilyZXR1cm47XG5cbiAgICAgICAgaWYodGhpcy5fcGxheWVySW5kZXg+PTApcmV0dXJuOyAvLyBhbHJlYWR5IHBsYXlpbmcgdGhlIGdhbWUgQSBIQSBJIGhhdmUgdG8ga2lsbCB0aGUgcGxheWVyIGluZGV4IHNvbWV3aGVyZS4uLlxuXG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD0oIXBsYXllck5hbWVzfHxwbGF5ZXJOYW1lcy5sZW5ndGg8ND8tMTpwbGF5ZXJOYW1lcy5pbmRleE9mKGN1cnJlbnRQbGF5ZXIubmFtZSkpO1xuICAgICAgICBcbiAgICAgICAgaWYocGxheWVySW5kZXg+PTApe1xuICAgICAgICAgICAgLy8gTURIQDI5SkFOMjAyMDogYXQgdGhlIG1vbWVudCB0aGF0IHRoZSBwbGF5ZXIgbmFtZXMgYXJlIHJlY2VpdmVkIHRoZSBnYW1lIGFjdHVhbGx5IHN0YXJ0c1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgQ0FSRUZVTCB3ZSBzaG91bGQgY29uc2lkZXIgcmVjZWl2aW5nIHRoZSBwbGF5ZXIgbmFtZXMgbW9yZSB0aGFuIG9uY2U/Pz8/Pz9cbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVHYW1lKCk7IC8vIChyZSlpbml0aWFsaXplIEFMTCB0aGUgcHJvcGVydGllcyBvZiBwbGF5aW5nIHRoZSBnYW1lXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1wbGF5ZXJOYW1lcztcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleCh0aGlzLHBsYXllckluZGV4KTsgLy8gcmVnaXN0ZXIgd2l0aCB0aGUgcGxheWVcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckluZGV4PWN1cnJlbnRQbGF5ZXIuX2luZGV4OyAvLyByZW1lbWJlciB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgICAgICB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIHNob3dQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgb24gcGFnZS1wbGF5aW5nIE9OQ0UgYXMgaXQgd2lsbCBhbHdheXMgc3RheSB0aGUgc2FtZVxuICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAvLyByZXBsYWNpbmc6IHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIiksdGhpcy5nZXRQbGF5ZXJOYW1lKHRoaXMuX3BsYXllckluZGV4KSwtMik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQ3VycmVudCBwbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgIGlmKHBsYXllck5hbWVzKVxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogVXcgbmFhbSBrb210IG5pZXQgdm9vciBpbiBkZSBzcGVsZXJsaWpzdCB2YW4gaGV0IHRlIHNwZWxlbiBzcGVsIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpe1xuICAgICAgICBsZXQgbnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcj0tMTtcbiAgICAgICAgaWYocGxheWVySW5kZXg+PTB8fHBsYXllckluZGV4PHRoaXMuX251bWJlck9mVHJpY2tzV29uLmxlbmd0aCl7XG4gICAgICAgICAgICBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllckluZGV4XTtcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGhhdmUgbm8gcGxheWVycyBhbmQgc2hvdWxkIGdldCB0aGUgcGFydG5lciBpZHMgZnJvbSB0aGUgc2VydmVyIGl0c2VsZlxuICAgICAgICAgICAgbGV0IHBhcnRuZXJJbmRleD0odGhpcy5fcGFydG5lcnMmJnBsYXllckluZGV4PHRoaXMuX3BhcnRuZXJzLmxlbmd0aD90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF06LTEpO1xuICAgICAgICAgICAgaWYocGFydG5lckluZGV4Pj0wJiZwYXJ0bmVySW5kZXg8dGhpcy5fbnVtYmVyT2ZUcmlja3NXb24ubGVuZ3RoKW51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIrPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BhcnRuZXJJbmRleF07XG4gICAgICAgIH0vKmVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiT25nZWxkaWdlIHNwZWxlciBpbmRleCBcIitwbGF5ZXJJbmRleCtcIi5cIik7Ki9cbiAgICAgICAgcmV0dXJuIG51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXI7XG4gICAgfVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogd2lsbCBiZSByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudCB3aGVuIGEgbmV3IHRyaWNrIHN0YXJ0c1xuICAgIC8vIE1ESEAyMkpBTjIwMjA6IHVzZXIgd2lsbCBoYXZlIHRvIGNsaWNrIHRoZSBuZXcgdHJpY2sgYnV0dG9uIHNvIHRoZXkgY2FuIGxvb2sgYXQgdGhlIG9sZCB0cmljayBmaXJzdFxuICAgIG5ld1RyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIFxuICAgICAgICAvLyBBU1NFUlQgb25seSBjYWxsIHdoZW4gdHJpY2tJbmZvIGlzIG5vdCBOVUxMISEhISFcbiAgICAgICAgaWYoIXRyaWNrSW5mbyl7YWxlcnQoXCJCVUc6IE5vIHRyaWNrIGluZm8hXCIpO3JldHVybjt9XG5cbiAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7IC8vIHJlbW92ZSB0aGUgY2FyZHMgc2hvd2luZyBmcm9tIHRoZSBwcmV2aW91cyB0cmlja1xuXG4gICAgICAgIC8vIHNob3cgdGhlIGlkIG9mIHRoZSB0cmljayAod2hpY2ggaXMgdGhlIHRyaWNrIGluZGV4KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgXCIrdHJpY2tJbmZvLmluZGV4O1xuXG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPXRyaWNrSW5mby5pbmRleC0xO1xuXG4gICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpOyAvLyBzaG93IHRoZSBmaW5pc2hlZCB0cmljayBpbiB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZVxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyB0cmljayB3aXRoIHRoZSBpbmZvcm1hdGlvbiBpbiB0aGUgdHJpY2sgaW5mb1xuICAgICAgICB0aGlzLl90cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRoaXMuX3RydW1wU3VpdGUsdGhpcy5fcGFydG5lclN1aXRlLHRoaXMuX3BhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCx0cmlja0luZm8uZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKTtcbiAgICBcbiAgICAgICAgLyogc3R1cGlkIG1lOiBJIGFscmVhZHkgbW92ZWQgZG9pbmcgdGhpcyB0byBzaG93VHJpY2soKSBidXQgdGhlcmUgZWFybGllciBpbmNvcnJlY3QgKGkuZS4gTk9UIGNoZWNraW5nIHRoZSBmaXJzdCBwbGF5ZXIhISEpXG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IGhpZGluZyBvciBzaG93aW5nIHRoZSBhc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBjaGVja2JveCBjYW4gYmUgZGV0ZXJtaW5lZCBoZXJlIGFuZCBub3dcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgYmVjYXVzZSB0aGUgbmVjZXNzYXJ5IGluZm9ybWF0aW9uIGZvciBkZWNpZGluZyBpcyBjb21wbGV0ZWx5IGtub3duIGF0IHRoZSBzdGFydCBvZiBhIG5ldyB0cmlja1xuICAgICAgICBpZih0cmlja0luZm8uZmlyc3RQbGF5ZXI9PT1jdXJyZW50UGxheWVyLmluZGV4JiZ0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgICAgICAgICAgLy8gdGhlIG5leHQgZGVjaXNpb24gaXMgYSBsaXR0bGUgaGFyZGVyLCBiZWNhdXNlIHNob3VsZCB3ZSBhbHdheXMgdHVybiBvbiB0aGUgY2hlY2tib3g/Pz8/Pz8/P1xuICAgICAgICAgICAgLy8gQlVUIG5vdGUgdGhhdCB0aGUgdXNlciB3aWxsIGJlIHByb21wdGVkIHRvIGFja25vd2xlZGdlIGFza2luZyB0aGUgcGFydG5lciBjYXJkIGJsaW5kXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3hcIikuc2VsZWN0ZWQ9O1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgICAgICovXG5cbiAgICAgICAgLy8gd2UgZG8gdGhlIGZvbGxvd2luZyBiZWNhdXNlIGl0IGlzIGVzc2VudGlhbCB0aGF0IHRoZSBjaGVja2JveCB0aGF0IHRlbGxzIHRoZSBwbGF5ZXIgd2hldGhlciBvciBub3RcbiAgICAgICAgLy8gdGhlIHBhcnRuZXIgY2FyZCBjYW4gYmUgYXNrZWQgc2hvdWxkIGJlIGluIHRoZSByaWdodCBzdGF0ZSB0byBzdGFydCB3aXRoIChmb3IgdGhlIHJpZ2h0IHBsYXllcilcbiAgICAgICAgLy8gTk9URSBuZXdUcmljaygpIGlzIGJlaW5nIGNhbGxlZCBCRUZPUkUgYSBwbGF5ZXIgaXMgYXNrZWQgdG8gcGxheSBhIGNhcmQsIHNvIHRoYXQncyB0aGUgcmlnaHQgbW9tZW50ISEhIVxuICAgICAgICBzaG93VHJpY2sodGhpcy5fdHJpY2spOyAvLyBUT0RPIHNob3VsZCB0aGlzIGJlIGhlcmU/Pz8/P1xuXG4gICAgfVxuXG4gICAgLyogTURIQDI5SkFOMjAyMDogTk9UIHJlY2VpdmluZyB0aGUgcGFydG5lciBpZHMgZGlyZWN0bHkgZnJvbSB0aGUgc2VydmVyIGFueW1vcmUgQlVUIGRlcml2aW5nIHRoZW0gZnJvbSBhbnkgcGFydG5lciBpZCB3ZSByZWNlaXZlISEhISFcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBpZiB3ZSByZWNlaXZlIGFsbCBwYXJ0bmVycyB3ZSBjYW4gZXh0cmFjdCB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBfc2V0UGFydG5lcklkcyhwYXJ0bmVySWRzKXtcbiAgICAgICAgdGhpcy5fcGFydG5lcklkcz1wYXJ0bmVySWRzO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGxldCBjdXJyZW50UGFydG5lcj0odGhpcy5fcGFydG5lcklkcyYmdGhpcy5fcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllckluZGV4PHRoaXMuX3BhcnRuZXJJZHMubGVuZ3RoP3RoaXMuX3BhcnRuZXJJZHNbdGhpcy5fcGxheWVySW5kZXhdOi0xKTtcbiAgICAgICAgaWYoY3VycmVudFBsYXllci5wYXJ0bmVyPj0wJiZjdXJyZW50UGFydG5lci5wYXJ0bmVyIT1jdXJyZW50UGFydG5lcilcbiAgICAgICAgICAgIHJldHVybiBhbGVydChcIlJhcHBvcnRlZXIgZGUgdm9sZ2VuZGUgZXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogJ0plIHBhcnRuZXIgaXMgdmVyYW5kZXJkJy5cIik7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj1jdXJyZW50UGFydG5lcjtcbiAgICB9XG4gICAgKi9cblxuICAgIG5ld0NhcmQoY2FyZEluZm8pe1xuICAgICAgICBcbiAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogaWYgdGhpcyBpcyB0aGUgY2FyZCBJIGFjdHVhbGx5IGp1c3QgcGxheWVkIEkgaGF2ZSB0byBkbyBzb21lIG1vcmUhISEhXG4gICAgICAgIGlmKHBsYXllZENhcmRJbmZvKXtcbiAgICAgICAgICAgIGxldCBwbGF5ZWRDYXJkPXBsYXllZENhcmRJbmZvWzBdO1xuICAgICAgICAgICAgdG9QbGF5QUNhcmQ9MDsgLy8gZG9uZSBwbGF5aW5nIGEgY2FyZFxuICAgICAgICAgICAgcGxheWVkQ2FyZEluZm89bnVsbDsgLy8gcmVtb3ZlIHBsYXllZENhcmRJbmZvIHVudGlsIHRoZSBuZXh0IGNhcmQgdG8gcGxheSBpcyBiZWluZyBhc2tlZFxuICAgICAgICAgICAgaWYocGxheWFibGVjYXJkQ2VsbCl7cGxheWFibGVjYXJkQ2VsbC5pbm5lckhUTUw9XCJcIjtwbGF5YWJsZWNhcmRDZWxsPW51bGw7fSAvLyBnZXQgcmlkIG9mIHRoZSBjYXJkIHRoYXQgd2FzIHBsYXllZCwgc2VudCBhbmQgYWNjZXB0ZWRcbiAgICAgICAgICAgIC8vIGl0J3MgYSBzZXJpb3VzIGJ1ZyB3aGVuIHRoZSBjYXJkIHBsYXllZCBieSBtZSBpcyBub3QgcmV0dXJuZWQgYXMgcGxheWVkISEhIVxuICAgICAgICAgICAgaWYocGxheWVkQ2FyZC5zdWl0ZSE9Y2FyZEluZm8uc3VpdGV8fHBsYXllZENhcmQucmFuayE9Y2FyZEluZm8ucmFuaylcbiAgICAgICAgICAgICAgICBidWcoXCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWxpamsgYWFuIGdlcmVnaXN0cmVlcmRlIGthYXJ0IVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IGNhcmRJbmZvIGRvZXMgbm90IG5lZWQgdG8gY29udGFpbiB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgZmxhZyBwZXIgc2VcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgaXQgYWN0dWFsbHkgb25seSBuZWVkIHRvIGNvbnRhaW4gaXQgd2hlbiBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgYXMgaW4gYWxsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIG90aGVyIGNhc2VzIHRoZSB0cmljayBjYW4gZGV0ZXJtaW5lIGl0IGl0c2VsZiBhbmQgc2hvdWxkIE5PVCByZWx5IG9uIGluZm9ybWF0aW9uIHNlbnQgYnkgdGhlIHNlcnZlclxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gY2hhbmdlIGl0IHRvIGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQgb24gdGhlIG90aGVyIHNlcnZlciBlbmQhIVxuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aGlzIGlzIHNvbHZlZCBieSBzZW5kaW5nIHBsYXlTdWl0ZSBhbG9uZyB3aXRoIGNhcmRJbmZvIHdoZW4gc28gbmVlZGVkISEhXG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgaWYoY2FyZEluZm8uaGFzT3duUHJvcGVydHkoXCJhc2tpbmdGb3JQYXJ0bmVyQ2FyZFwiKSlcbiAgICAgICAgICAgIHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPWNhcmRJbmZvLmFza2luZ0ZvclBhcnRuZXJDYXJkOyAvLyBNREhAMjZKQU4yMDIwOiBzaG91bGRuJ3QgZm9yZ2V0IHRoaXMhISEhXG4gICAgICAgICovXG4gICAgICAgIC8vIEkgZG9uJ3QgdGhpbmsgd2UgY2FuIGRvIHRoYXQ/Pz8/PyB0aGlzLl90cmljay53aW5uZXI9Y2FyZEluZm8ud2lubmVyO1xuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fdHJpY2suYWRkQ2FyZChuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvLnN1aXRlLGNhcmRJbmZvLnJhbmspKTtcbiAgICAgICAgaWYoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcilyZXR1cm4gYnVnKGVycm9yKTsgLy8gd2hpY2ggd291bGQgYmUgYSBzZXJpb3VzIGJ1Zz8/Pz8/Pz8/XG5cbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogaWYgd2UncmUgcmVjZWl2aW5nIHRoZSBwbGF5IHN1aXRlIHdlIGNhbiBkZXRlcm1pbmUgYXNraW5nRm9yUGFydG5lckNhcmQgb3Vyc2VsdmVzXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGxheVN1aXRlXCIpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBwbGF5IHN1aXRlIHByb3ZpZGVkIGRpZmZlcnMgZnJvbSB0aGUgJ2F1dG9tYXRpYycgcGxheSBzdWl0ZSwgdGhlIHBhcnRuZXIgY2FyZCBpcyBiZWluZyBhc2tlZCBibGluZGx5XG4gICAgICAgICAgICBpZihjYXJkSW5mby5wbGF5U3VpdGUhPT10aGlzLl90cmljay5wbGF5U3VpdGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLnBsYXlTdWl0ZT1jYXJkSW5mby5wbGF5U3VpdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogTURIQDI5SkFOMjAyMDogTk9UIGV4cGVjdGluZyB0byByZWNlaXZlIHRoZSBwYXJ0bmVyIGlkcyBhbnltb3JlISEhXG4gICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IGV2ZXJ5IGNhcmQgcGxheWVkIGNvbnRhaW5zIHRoZSBwYXJ0bmVycyBhcyB3ZWxsISEhXG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwicGFydG5lcnNcIikpdGhpcy5fc2V0UGFydG5lcklkcyhjYXJkSW5mby5wYXJ0bmVycyk7XG4gICAgICAgICovXG4gICAgICAgIC8vIGlmIGFsbCB0aGUgY2FyZHMgaW4gdGhlIHRyaWNrIGhhdmUgYmVlbiBwbGF5ZWQsIHRoZSB3aW5uZXIgaXMgZGVmaW5pdGUsIGFuZCB3aW5zIHRoZSB0cmlja1xuICAgICAgICBpZih0aGlzLl90cmljay5udW1iZXJPZkNhcmRzPT09NCl0aGlzLl9udW1iZXJPZlRyaWNrc1dvblt0aGlzLl90cmljay53aW5uZXJdKys7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcuLi5cbiAgICAgICAgLy8gc2hvd1RyaWNrQ2FyZCh0aGlzLl90cmljay5nZXRMYXN0Q2FyZCgpLHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHMpO1xuICAgICAgICBzaG93VHJpY2sodGhpcy5fdHJpY2spOy8vaWYodGhpcy5fdHJpY2tXaW5uZXIpe3RoaXMuX3RyaWNrV2lubmVyPW51bGw7c2hvd1RyaWNrKHRoaXMuX3RyaWNrKTt9XG4gICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkRfUkVDRUlWRUQpO1xuICAgICAgICBzZXRJbmZvKGNhcGl0YWxpemUoTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbY2FyZEluZm8uc3VpdGVdKStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2NhcmRJbmZvLnJhbmtdK1wiIGdlc3BlZWxkLlwiLFwiU3BlbFwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qIHJlcGxhY2luZzpcbiAgICBwYXJzZVRyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIGxldCB0cmljaz1uZXcgVHJpY2sodHJpY2tJbmZvLmZpcnN0UGxheWVyLHRyaWNrSW5mby50cnVtcFN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyU3VpdGUsdHJpY2tJbmZvLnBhcnRuZXJSYW5rLHRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgICAgIC8vIGFscmVhZHkgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciEhIVxuICAgICAgICAvLyB0cmljay5fZmlyc3RQbGF5ZXI9dHJpY2tJbmZvLmZpcnN0UGxheWVyO1xuICAgICAgICAvLyB0cmljay5fY2FuQXNrRm9yUGFydG5lckNhcmQ9dHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBpZih0cmlja0luZm8uY2FyZHMmJnRyaWNrSW5mby5jYXJkcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAvLyBmaWxsIHRoZSB0cmljayB3aXRoIHRyaWNrIGluZm9ybWF0aW9uIGZyb20gdGhlIG90aGVyIHBsYXllcnMhISFcbiAgICAgICAgICAgIHRyaWNrSW5mby5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdKS5ob2xkZXI9dHJpY2s7fSk7IC8vIHN0b3JlIHRoZSBjYXJkcyByZWNlaXZlZCBpbiB0cmlja1xuICAgICAgICAgICAgdHJpY2suX3dpbm5lcj10cmlja0luZm8ud2lubmVyO1xuICAgICAgICAgICAgdHJpY2suX3BsYXlTdWl0ZT10cmlja0luZm8ucGxheVN1aXRlO1xuICAgICAgICAgICAgdHJpY2suX2Fza2luZ0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJpY2s7XG4gICAgfVxuICAgICovXG5cbiAgICBhY2tub3dsZWRnZUV2ZW50cygpe1xuICAgICAgICAvLyBub3cgaWYgdGhlIHVuYWNrbm93bGVkZ2UgZXZlbnQgaWRzIGRvIE5PVCByZWFjaCB0aGUgc2VydmVyIHdlIHdpbGwgcmVjZWl2ZSBjZXJ0YWluIGV2ZW50cyBhZ2FpbiB1bnRpbCB3ZSBkb1xuICAgICAgICAvLyBtYW5hZ2UgdG8gZ2V0IHRoZW0gb3ZlclxuICAgICAgICAvLyBtYWtlIGEgY29weSBvZiBhbGwgdGhlIHVuYWNrbm93bGVkZ2VkIGV2ZW50c1xuICAgICAgICBsZXQgYWNrbm93bGVkZ2VhYmxlRXZlbnRzPXRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLm1hcCgodW5hY2tub3dsZWRnZWRFdmVudCk9Pk9iamVjdC5hc3NpZ24oe30sdW5hY2tub3dsZWRnZWRFdmVudCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgYWNrbm93bGVkZ2VhYmxlIGV2ZW50czogXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzKTtcbiAgICAgICAgLy8gb2YgY291cnNlIHdlIGNvdWxkIHNlbmQgdGhlbSBwYXNzaW5nIGFuIGFja25vd2xlZGdlIGZ1bmN0aW9uIHRob3VnaFxuICAgICAgICBpZihhY2tub3dsZWRnZWFibGVFdmVudHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZW1pdCBwYXNzaW5nIGFsb25nIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgZ2V0IGNhbGxlZCB3aGVuIHRoZSBBQ0sgbWVzc2FnZSB3YXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZlclxuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoXCJBQ0tcIixhY2tub3dsZWRnZWFibGVFdmVudHMsKCk9PntcbiAgICAgICAgICAgICAgICAvLyB3ZSBub3cgbWF5IHJlbW92ZSBhbGwgYWNrbm93bGVkZ2VhYmxlIGV2ZW50c1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqIEV2ZW50cyBhY2tub3dsZWRnZW1lbnRzIHJlY2VpdmVkISAqKioqKioqKlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cz1bXTsgLy8vLy9kaWZmZXJlbmNlKHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGR1cGxpY2F0ZWQgZnJvbSBzZXJ2ZXItc2lkZSBSaWtrZW5UaGVHYW1lLmpzIHRoYXQgd2lsbCB0cmFuc2xhdGUgdGhpcy5fcGxheWVyc0JpZHMgdG8gcmVhZGFibGUgYmlkc1xuICAgIC8vIHRvIGJlIHBhc3NlZCB0byB1cGRhdGVCaWRzVGFibGUoKSEhIVxuICAgIF9nZXRQbGF5ZXJCaWRzT2JqZWN0cygpe1xuICAgICAgICBsZXQgcGxheWVyQmlkc09iamVjdHM9W107XG4gICAgICAgIHRoaXMuX3BsYXllcnNCaWRzLmZvckVhY2goKHBsYXllckJpZHMpPT57XG4gICAgICAgICAgICBsZXQgcGxheWVyQmlkc09iamVjdD17bmFtZTp0aGlzLmdldFBsYXllck5hbWUocGxheWVyQmlkc09iamVjdHMubGVuZ3RoKSxiaWRzOltdfTtcbiAgICAgICAgICAgIC8vIHVzZSB1bnNoaWZ0IE5PVCBwdXNoIGFzIHRoZSBiaWRzIGFyZSBzdG9yZWQgcmV2ZXJzZSBvcmRlciBcbiAgICAgICAgICAgIHBsYXllckJpZHMuZm9yRWFjaCgocGxheWVyQmlkKT0+e3BsYXllckJpZHNPYmplY3QuYmlkcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW3BsYXllckJpZF0pfSk7XG4gICAgICAgICAgICBwbGF5ZXJCaWRzT2JqZWN0cy5wdXNoKHBsYXllckJpZHNPYmplY3QpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBsYXllckJpZHNPYmplY3RzO1xuICAgIH1cblxuICAgIF9zZXRQYXJ0bmVycyhwYXJ0bmVyMSxwYXJ0bmVyMil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWVyICNcIisocGFydG5lcjEpK1wiIGFuZCAjXCIrKHBhcnRuZXIyKStcIiBhcmUgcGFydG5lcnMhXCIpO1xuICAgICAgICAvLyBNREhAMDhERUMyMDE5OiBpbnN0ZWFkIG9mIGRpcmVjdGx5IHNldHRpbmcgdGhlIHBhcnRuZXIgcHJvcGVydHkgb2YgZWFjaCBwbGF5ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgd2Ugd2FpdCB3aXRoIGRvaW5nIHNvIGFzIHNvb24gYXMgdGhlIHBhcnRuZXIgaXMga25vd24gKGJ5IHBsYXlpbmcgdGhlIHBhcnRuZXIgY2FyZClcbiAgICAgICAgdGhpcy5fcGFydG5lcnM9Wy0xLC0xLC0xLC0xXTtcbiAgICAgICAgbGV0IHRlYW1zPVtbcGFydG5lcjEscGFydG5lcjJdLFtdXTtcbiAgICAgICAgLy8gTURIQDI5SkFOMjAyMDogYXQgdGhpcyBlbmQgd2UgZG8gbm90IGhhdmUgX3BsYXllcnMgb25seSBfcGxheWVyTmFtZXMgYW5kIHRoZWlyIF9pbmRleCBpcyB0aGVpciBwb3NpdGlvbiBpbiB0aGUgYXJyYXkgb2YgcGxheWVyIG5hbWVzISEhIVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcy5mb3JFYWNoKChwbGF5ZXJOYW1lLGluZGV4KT0+e2lmKGluZGV4IT09cGFydG5lcjEmJmluZGV4IT09cGFydG5lcjIpdGVhbXNbMV0ucHVzaChpbmRleCk7fSk7XG4gICAgICAgIHRlYW1zLmZvckVhY2goKHRlYW0pPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRlYW06IFwiLHRlYW0pO1xuICAgICAgICAgICAgdGhpcy5fcGFydG5lcnNbdGVhbVswXV09dGVhbVsxXTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJzW3RlYW1bMV1dPXRlYW1bMF07XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXJzIGtub3duOiBcIix0aGlzLl9wYXJ0bmVycyk7XG4gICAgfVxuXG4gICAgLy8gTURIQDI5SkFOMjAyMDogX3NldFBhcnRuZXIoKSBpcyBjYWxsZWQgd2hlbiB0aGUgUEFSVE5FUiBldmVudCBpcyByZWNlaXZlZFxuICAgIC8vICAgICAgICAgICAgICAgIGlmIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllciBpcyBrbm93biwgYWxsIHBhcnRuZXJzIGFyZSBrbm93blxuICAgIC8vICAgICAgICAgICAgICAgIGFuZCB0aGUgcGFydG5lciBpZHMgY2FuIGJlIGRlcml2ZWQhISEhXG4gICAgX3NldFBhcnRuZXIocGFydG5lcil7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIucGFydG5lcj1wYXJ0bmVyO1xuICAgICAgICBpZihjdXJyZW50UGxheWVyLnBhcnRuZXI+PTApaWYoIXRoaXMuX3BhcnRuZXJzKXRoaXMuX3NldFBhcnRuZXJzKGN1cnJlbnRQbGF5ZXIuX2luZGV4LGN1cnJlbnRQbGF5ZXIucGFydG5lcik7XG4gICAgfVxuXG4gICAgLy8gZ2VuZXJpYyBtZXRob2QgZm9yIHByb2Nlc3NpbmcgYW55IGV2ZW50LCBldmVyeVxuICAgIHByb2Nlc3NFdmVudChldmVudCxldmVudERhdGEsYWNrbm93bGVkZ2Upe1xuICAgICAgICAvLyBsb2cgZXZlcnkgZXZlbnRcbiAgICAgICAgdGhpcy5sb2dFdmVudChldmVudCxldmVudERhdGEpO1xuICAgICAgICBpZighZXZlbnQpcmV0dXJuOyAvLyBOT1RFIHRoZSBldmVudERhdGEgY2FuIGJlIG51bGwhISEhISFcbiAgICAgICAgLy8gaWYgZGF0YSBoYXMgYW4gaWQgaXQgbmVlZHMgdG8gYmUgYWNrbm93bGVkZ2VkXG4gICAgICAgIGxldCBldmVudElkPShldmVudERhdGEmJmV2ZW50RGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpP2V2ZW50RGF0YS5pZDpudWxsKTtcbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbiBldmVudCBpZCBpbiB0aGlzIGV2ZW50LCBhbmQgd2UncmUgc3VwcG9zZWQgdG8gc2VuZCBhY2tub3dsZWRnZW1lbnRzLCBkbyBzb1xuICAgICAgICBpZihldmVudElkKXtcbiAgICAgICAgICAgIC8vIE1ESEAxN0pBTjIwMjA6IG5vdyBwdXNoIHRoZSBldmVudCBuYW1lIGFzIHdlbGwgc28gdGhlIHNlcnZlciBjYW4gbG9nIHRoYXQgYW5kIHdlIGNhbiBzZWUgd2hhdCdzIGFja25vd2xlZ2RlZCEhIVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgQlVUIGRvbid0IHB1c2ggaXQgYWdhaW4gaWYgaXQncyBhbHJlYWR5IHRoZXJlISEhIVxuICAgICAgICAgICAgaWYoYWNrbm93bGVkZ2UpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoPT09MHx8dGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHNbdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubGVuZ3RoLTFdLmlkIT09ZXZlbnRJZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMucHVzaCh7J2lkJzpldmVudElkLCdldmVudCc6ZXZlbnR9KTtcbiAgICAgICAgICAgIHRoaXMuYWNrbm93bGVkZ2VFdmVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YT0oZXZlbnRJZD9ldmVudERhdGEucGF5bG9hZDpldmVudERhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUFJPQ0VTU0lORyBFVkVOVCBcIitldmVudCtcIiA+Pj5cIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIHN3aXRjaChldmVudCl7XG4gICAgICAgICAgICBjYXNlIFwiSU5GT1wiOlxuICAgICAgICAgICAgICAgIHNldEluZm8oZGF0YSxcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJTVEFURUNIQU5HRVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGU9ZGF0YS50bztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfR0FNRV9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJHYW1lIGluZm9ybWF0aW9uIHJlY2VpdmVkIGJ5ICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInLlwiLGRhdGEpO1xuICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBzZXQgdGhlIG5hbWUgb2YgdGhlIGdhbWUgbm93XG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lPWRhdGE7XG4gICAgICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIHBsYXllciBuYW1lcyEhISEhXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSU1wiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1dBSVRfRk9SX0NBUkRTKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllck5hbWVzPWRhdGE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiREVBTEVSXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVhbGVyPWRhdGE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0FSRFNcIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9DQVJEU19SRUNFSVZFRCk7IC8vIG9uY2UgdGhlIGNhcmRzIGhhdmUgYmVlbiByZWNlaXZlZFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBob2xkYWJsZSBjYXJkIGZyb20gY2FyZEluZm8gcGFzc2luZyBpbiB0aGUgY3VycmVudCBwbGF5ZXIgYXMgY2FyZCBob2xkZXJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUEFSVE5FUlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXIoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRV9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB0eXBpY2FsbHkgdGhlIGdhbWUgaW5mbyBjb250YWlucyBBTEwgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0aGUgZ2FtZSB0aGF0IGlzIGdvaW5nIHRvIGJlIHBsYXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBpLmUuIGFmdGVyIGJpZGRpbmcgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RydW1wU3VpdGU9ZGF0YS50cnVtcFN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9ZGF0YS5wYXJ0bmVyU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJSYW5rPWRhdGEucGFydG5lclJhbms7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9ZGF0YS5oaWdoZXN0QmlkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkZGVycz1kYXRhLmhpZ2hlc3RCaWRkZXJzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3VydGhBY2VQbGF5ZXI9ZGF0YS5mb3VydGhBY2VQbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IG1vdmUgc2hvd2luZyB0aGUgZ2FtZSBpbmZvIGZyb20gcGxheUFDYXJkKCkgdG8gaGVyZSEhISFcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWluZm9cIikuaW5uZXJIVE1MPWdldEdhbWVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXJSYW5rPj0wKXsgLy8gYSBwYXJ0bmVyIChjYXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyU3VpdGVFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItc3VpdGUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGVFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0aGlzLl9wYXJ0bmVyU3VpdGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyUmFua0VsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1yYW5rJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lclJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lckVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lcicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9XCJpbmhlcml0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNleyAvLyBubyBwYXJ0bmVyIChjYXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lckVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX0JJRFwiOlxuICAgICAgICAgICAgICAgIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpe1xuICAgICAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9XQUlUX0ZPUl9CSUQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiBcIitkYXRhK1wiLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBib2QgZ2V2cmFhZ2QuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLy8gaWYoZGF0YSE9PWN1cnJlbnRQbGF5ZXIubmFtZSlcbiAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9XCJXZSB3YWNodGVuIG9wIGhldCBib2QgdmFuIDxiPlwiK2RhdGErXCI8L2I+LlwiO1xuICAgICAgICAgICAgICAgIC8vIGVsc2VcbiAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9XCJXYXQgd2lsIGplIHNwZWxlbj9cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJNQUtFX0FfQklEXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQklEKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLm1ha2VBQmlkKGRhdGEucGxheWVyQmlkc09iamVjdHMsZGF0YS5wb3NzaWJsZUJpZHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkJJRF9NQURFXCI6IC8vIHJldHVybmVkIHdoZW4gYSBiaWQgaXMgbWFkZSBieSBzb21lb25lXG4gICAgICAgICAgICAgICAgLy8vLy8vLy8vaWYoZGF0YS5wbGF5ZXI9PT10aGlzLl9wbGF5ZXJJbmRleClcbiAgICAgICAgICAgICAgICBpZih0b01ha2VBQmlkPjApeyAvLyBpdCdzIG91ciBiaWQhISEhXG4gICAgICAgICAgICAgICAgICAgIHRvTWFrZUFCaWQ9MDtiaWRNYWRlSW5mbz1udWxsO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9CSURfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPWdldEJpZEluZm8oZGF0YS5iaWQsZGF0YS5wbGF5ZXI9PT1jdXJyZW50UGxheWVyLmluZGV4P251bGw6dGhpcy5nZXRQbGF5ZXJOYW1lKGRhdGEucGxheWVyKSk7XG4gICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgdG8gcmVjZWl2ZSBpbiBkYXRhIGJvdGggdGhlIHBsYXllciBhbmQgdGhlIGJpZFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPWdldEJpZEluZm8oZGF0YS5iaWQsZGF0YS5wbGF5ZXI9PT1jdXJyZW50UGxheWVyLmluZGV4P251bGw6dGhpcy5nZXRQbGF5ZXJOYW1lKGRhdGEucGxheWVyKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyc0JpZHNbZGF0YS5wbGF5ZXJdLnB1c2goZGF0YS5iaWQpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gaG93IHRvIHNob3cgdGhlIGJpZHM/Pz8/P1xuICAgICAgICAgICAgICAgIHVwZGF0ZUJpZHNUYWJsZSh0aGlzLl9nZXRQbGF5ZXJCaWRzT2JqZWN0cygpKTtcbiAgICAgICAgICAgICAgICAvLyBNREhAMDNGRUIyMDIwOiBmYWlsLXNhZmUgQlVUIHRoaXMgc2hvdWxkIGJlIGRvbmUgYW5vdGhlciB3YXkgVE9ET1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJCb2QgdmFuIFwiK3RoaXMuZ2V0UGxheWVyTmFtZShkYXRhLnBsYXllcikrXCI6IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2RhdGEuYmlkXStcIi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19QTEFZXCI6XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1dBSVRfRk9SX0NBUkQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gXCIrZGF0YStcIi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QhXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJXZSB3YWNodGVuIG9wIGRlIGthYXJ0IHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1pbmZvXCIpLmlubmVySFRNTD1cIlNwZWVsIGVlbiBrYWFydCBiaWouXCI7XG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1NfVE9fV0lOXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5zZXROdW1iZXJPZlRyaWNrc1RvV2luKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIk5FV19UUklDS1wiOlxuICAgICAgICAgICAgICAgIHRoaXMubmV3VHJpY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUEFSVE5FUlNcIjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhcnRuZXIgaWRzIHJlY2VpdmVkIEJVVCBubyBsb25nZXIgdXNlZCFcIik7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fc2V0UGFydG5lcklkcyhkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDQVJEX1BMQVlFRFwiOlxuICAgICAgICAgICAgICAgIHRoaXMubmV3Q2FyZChkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8qIE1ESEAwM0ZFQjIwMjA6IHRoZSBwbGF5ZXIgaW5mbyBpcyBub3cgcmVjZWl2ZWQgaW4gdGhlIFBMQVlfQV9DQVJEIGV2ZW50XG4gICAgICAgICAgICBjYXNlIFwiUExBWUVSX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgY29udGFpbiB0aGUgY3VycmVudCBjYXJkcyB0aGUgdXNlciBoYXNcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAyM0pBTjIwMjA6IGdhbWUga2VlcHMgdHJhY2sgb2YgdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGJ5IGVhY2ggcGxheWVyISEhISFcbiAgICAgICAgICAgICAgICAgICAgLy8gLy8gYWxzbyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYW5kIHRvIHdpblxuICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50UGxheWVyLm51bWJlck9mVHJpY2tzV29uPWRhdGEubnVtYmVyT2ZUcmlja3NXb247XG4gICAgICAgICAgICAgICAgICAgIC8vIC8vIFRPRE8gUExBWUVSX0lORk8gZG9lcyBub3QgbmVlZCB0byBzZW5kIHRoZSBmb2xsb3dpbmcgd2l0aCBlYWNoIFBMQVlFUl9JTkZPIFRIT1VHSFxuICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YS5udW1iZXJPZlRyaWNrc1RvV2luKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlfQV9DQVJEXCI6XG4gICAgICAgICAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogdGhpcyBpcyBhIGJpdCBvZiBhIG51aXNhbmNlLCBzaW5jZSB3ZSB1c2UgdGhlIHRvUGxheUFDYXJkIGZsYWcgaW4gcGxheUFDYXJkLCBidXQgd2UgbmVlZCBpdCBoZXJlIHNvIG5vdCB0byBkbyB0aGUgZXh0cmEgd29ya1xuICAgICAgICAgICAgICAgIGlmKHRvUGxheUFDYXJkPD0wKXsgLy8gZmlyc3QgdGltZSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMDNGRUIyMDIwOiB0YWtpbmcgb3ZlciBmcm9tIFBMQVlFUl9JTkZPIGFzIHRoZSBjYXJkcyBhcmUgbm93IHJlY2VpdmVkIGluIHRoZSBQTEFZX0FfQ0FSRCBldmVudCEhISFcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXJkcy5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnJlbmRlckNhcmRzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIHJlY2VpdmluZyB0cmljayBpbmZvIGluIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogTk9UIGFueW1vcmVcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuX3RyaWNrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUHJvZ3JhbW1hZm91dDogVSB3b3JkdCBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QgaW4gZWVuIG9uZ2VkZWZpbmllZXJkZSBzbGFnISBXZSB3YWNodGVuIGV2ZW4gb3Agc2xhZ2luZm9ybWF0aWUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBNREhAMjdKQU4yMDIwOiBkb2luZyB0aGlzIGFuZCBob3BpbmcgdGhlIG5leHQgcmVxdWVzdCBpcyByZWNlaXZlZCBBRlRFUiByZWNlaXZpbmcgYSBuZXcgdHJpY2shISFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBvY2Nhc3Npb25hbGx5IHdlIG1heSByZWNlaXZlIHRoZSByZXF1ZXN0IHRvIHBsYXkgQkVGT1JFIGFjdHVhbGx5IGhhdmluZyByZWNlaXZlZCB0aGUgc3RhdGUgY2hhbmdlISFcbiAgICAgICAgICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPT1cInBhZ2UtcGxheWluZ1wiKXNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9UUlVNUF9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlVHJ1bXBTdWl0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUlVNUF9TVUlURV9DSE9TRU5cIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9UUlVNUF9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKExhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW2RhdGFdKStcIiBnZWtvemVuIGFscyB0cm9lZi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlUGFydG5lclN1aXRlKGRhdGEuc3VpdGVzLGRhdGEucGFydG5lclJhbmtOYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSX1NVSVRFX0NIT1NFTlwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1BBUlRORVJfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tkYXRhLnN1aXRlXSkrXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1tkYXRhLnJhbmtdK1wiIG1lZWdldnJhYWdkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLXCI6XG4gICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHRoaXMucGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTXCI6IC8vIE1ESEAyM0pBTjIwMjA6IHdvbid0IGJlIHJlY2VpdmluZyB0aGlzIGV2ZW50IGFueW1vcmUuLi5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgdGhlIHRyaWNrcyBmcm9tIHRoZSBhcnJheSBvZiB0cmlja3MgaW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlja3M9ZGF0YS5tYXAoKHRyaWNrSW5mbyk9PntyZXR1cm4gdGhpcy5wYXJzZVRyaWNrKHRyaWNrSW5mbyk7fSk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJSRVNVTFRTXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3b24ndCBiZSByZWNlaXZpbmcgYSBuZXcgdHJpY2sgZXZlbnQsIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIHNob3cgdGhlIHVzZXIgdGhhdCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhlIHBhZ2UgbW92ZWQgdG8gdGhlIHJlc3VsdHMgcGFnZT8/Pz8/P1xuICAgICAgICAgICAgICAgICAgICAvKiByZW1vdmVkLCBhcyB0aGVzZSB0aGluZ3MgYXJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBvdmVyIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb2ludHM9ZGF0YS5wb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIG5ldy1nYW1lIG9yIHN0b3AgYnV0dG9uIGNsaWNrISEhISEgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT09XCJwYWdlLWZpbmlzaGVkXCIpc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7IC8vIGlmIHdlIGFyZW4ndCB0aGVyZSB5ZXQhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkaXNjb25uZWN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTURIQDIySkFOMjAyMDogYmV0dGVyIG5vdCB0byBnbyBvdXQgb2Ygb3JkZXIgd2hlbiB0aGlzIGhhcHBlbnMhISEhISFcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVmVyYmluZGluZyBtZXQgZGUgc2VydmVyICh0aWpkZWxpamspIHZlcmJyb2tlbiFcIixcIlNlcnZlclwiKTsgLy8gcmVwbGFjaW5nOiB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIGV2ZW50IFwiK2V2ZW50K1wiIHJlY2VpdmVkIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXBhcmluZyBmb3IgY29tbXVuaWNhdGlvblwiKTtcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5fc3RhdGU9SURMRTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSB1bmFja25vd2xlZGdlZEV2ZW50SWRzXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZGlzY29ubmVjdCcsKCk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnZGlzY29ubmVjdCcsbnVsbCx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdJTkZPJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdTVEFURUNIQU5HRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1NUQVRFQ0hBTkdFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlFUlMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0RFQUxFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0RFQUxFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQQVJUTkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVfSU5GTycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fQklEXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdNQUtFX0FfQklEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTUFLRV9BX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdCSURfTUFERScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0JJRF9NQURFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19QTEFZXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX1BMQVknLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIE1ESEAxM0pBTjIwMjA6IHBsYXllciBpbmZvIHdpbGwgYmUgcmVjZWl2ZWQgYmVmb3JlIGJlaW5nIGFza2VkIHRvIHBsYXkgYSBjYXJkIHRvIHVwZGF0ZSB0aGUgcGxheWVyIGRhdGFcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiUExBWUVSX0lORk9cIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWUVSX0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTX1RPX1dJTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLU19UT19XSU4nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTkVXX1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTkVXX1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRfUExBWUVEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRF9QTEFZRUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWV9BX0NBUkQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZX0FfQ0FSRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfVFJVTVBfU1VJVEUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDSE9PU0VfVFJVTVBfU1VJVEUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJVTVBfU1VJVEVfQ0hPU0VOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJVTVBfU1VJVEVfQ0hPU0VOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9QQVJUTkVSX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudChcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCIsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQQVJUTkVSX1NVSVRFX0NIT1NFTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BBUlRORVJfU1VJVEVfQ0hPU0VOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1JFU1VMVFMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdSRVNVTFRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVPVkVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRU9WRVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIGlmIHdlIHJlY2VpdmUgbXVsdGlwbGUgZXZlbnRzIGFzIGEgd2hvbGUsIHdlIHByb2Nlc3MgYWxsIG9mIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0VWRU5UUycsKGV2ZW50cyk9PntcbiAgICAgICAgICAgIC8vIHdlIGNvdWxkIGNvbnN1bWUgdGhlIGV2ZW50cyBJIGd1ZXNzXG4gICAgICAgICAgICB3aGlsZShldmVudHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGV2ZW50PWV2ZW50cy5zaGlmdCgpOyAvLyByZW1vdmUgdGhlIGZpcnN0IGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gYXNjZXJ0YWluIHRvIHNlbmQgYWxsIHVuYWNrbm93bGVkZ2VkIGV2ZW50IGlkcyB3aGVuIHRoaXMgaXMgdGhlIGxhc3QgcHJvY2VzcyBldmVudCEhISFcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NFdmVudChldmVudC5ldmVudCxldmVudC5kYXRhLGV2ZW50cy5sZW5ndGg9PT0wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTURIQDI5SkFOMjAyMDogaWYgd2Ugd2FudCB0byBiZSBhYmxlIHRvIG1ha2UgdGhpcyBwbGF5ZXIgcGxheSBtb3JlIHRoYW4gb25lIGdhbWUgd2l0aCB0aGUgc2FtZSBHYW1lIGluc3RhbmNlXG4gICAgLy8gICAgICAgICAgICAgICAgKHRoaXMgb25lKSwgd2UgbmVlZCB0byB0YWtlIGFsbCBpbml0aWFsaXphdGlvbiBvdXQgb2YgdGhlIGNvbnN0cnVjdG9yIGFuZCBwdXQgaXQgaW4gaGVyZVxuICAgIF9pbml0aWFsaXplR2FtZSgpe1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fZXZlbnRzUmVjZWl2ZWQ9W107XG4gICAgICAgIHRoaXMuX3RyaWNrV2lubmVyPW51bGw7XG4gICAgICAgIHRoaXMuX2RlYWxlcj0tMTtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTsvL3RoaXMuX3RydW1wUGxheWVyPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7dGhpcy5fcGFydG5lclJhbms9LTE7XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzV29uPVswLDAsMCwwXTsgLy8gYXNzdW1lIG5vIHRyaWNrcyB3b24gYnkgYW55Ym9keVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD0wO3RoaXMuX3RyaWNrPW51bGw7XG4gICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9LTE7dGhpcy5faGlnaGVzdEJpZGRlcnM9W107dGhpcy50cnVtcFBsYXllcj0tMTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcz1bW10sW10sW10sW11dOyAvLyBNREhAMjFKQU4yMDIwOiBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgYmlkcyB0byBzaG93XG4gICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50cz1udWxsO1xuICAgICAgICAvLyB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fdGVhbU5hbWVzPW51bGw7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyB0aGUgJ2N1cnJlbnQnIHBsYXllclxuICAgICAgICAvLyB0aGluZ3Mgd2UgY2FuIHN0b3JlIGludGVybmFsbHkgdGhhdCB3ZSByZWNlaXZlIG92ZXIgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fbmFtZT1udWxsOyAvLyB0aGUgbmFtZSBvZiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1udWxsOyAvLyB0aGUgbmFtZXMgb2YgdGhlIHBsYXllcnNcbiAgICAgICAgdGhpcy5fcGFydG5lcnM9bnVsbDsgLy8gdGhlIHBhcnRuZXJzICh1c2luZyB0aGUgc2FtZSBuYW1lIGFzIGluIChzZXJ2ZXItc2lkZSkgUmlra2VuVGhlR2FtZS5qcylcbiAgICB9XG5cbiAgICAvLyBNREhAMDhKQU4yMDIwOiBzb2NrZXQgc2hvdWxkIHJlcHJlc2VudCBhIGNvbm5lY3RlZCBzb2NrZXQuaW8gaW5zdGFuY2UhISFcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQpe1xuICAgICAgICAvLyBPT1BTIGRpZG4ndCBsaWtlIGZvcmdldHRpbmcgdGhpcyEhISBcbiAgICAgICAgLy8gYnV0IFBsYXllckdhbWUgZG9lcyBOT1QgaGF2ZSBhbiBleHBsaWNpdCBjb25zdHJ1Y3RvciAoaS5lLiBubyByZXF1aXJlZCBhcmd1bWVudHMpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3NvY2tldD1zb2NrZXQ7XG4gICAgICAgIHRoaXMuX3NlbnRFdmVudFJlY2VpdmVkPXRoaXMuX3NlbnRFdmVudFJlY2VpdmVkLmJpbmQodGhpcyk7dGhpcy5fc2VuZEV2ZW50PXRoaXMuX3NlbmRFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpO1xuICAgICAgICB0aGlzLl9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpO1xuICAgIH1cblxuICAgIC8vIGluZm9ybWF0aW9uIGFib3V0IHRoZSBnYW1lIGl0c2VsZiBvcmdhbml6ZWQgYnkgc3RhdGVcbiAgICAvLyBQTEFZSU5HXG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG4gICAgLy8gZ2V0VHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fVxuICAgIFxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7IC8vIG9ubHkgd2hlbiBwbGF5ZXIgZXF1YWxzIHRoaXMuX3BsYXllckluZGV4IGRvIHdlIGtub3cgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXI9KHBsYXllcj09PXRoaXMuX3BsYXllckluZGV4P2N1cnJlbnRQbGF5ZXIucGFydG5lcjotMSk7XG4gICAgICAgIHJldHVybihwYXJ0bmVyPj0wJiZwYXJ0bmVyPHRoaXMubnVtYmVyT2ZQbGF5ZXJzP3RoaXMuX3BsYXllck5hbWVzW3BhcnRuZXJdOm51bGwpO1xuICAgIH1cblxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWRkZXJzO31cbiAgICBnZXRIaWdoZXN0QmlkKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWQ7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICAvLyBnZXRQbGF5ZXJOYW1lKHBsYXllcil7cmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXI8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllcl06XCI/XCIpO31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXtyZXR1cm4gdGhpcy5fZGVsdGFQb2ludHM7fVxuICAgIGdldCBwb2ludHMoKXtyZXR1cm4gdGhpcy5fcG9pbnRzO31cblxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCxvdGhlclBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGFydG5lcnM/dGhpcy5fcGFydG5lcnNbcGxheWVySW5kZXhdPT09b3RoZXJQbGF5ZXJJbmRleDpmYWxzZSk7fVxuICAgIFxuICAgIC8vIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fSAvLyBUT0RPIHN0aWxsIHVzZWQ/Pz8/P1xuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgLy8gZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZm91cnRoQWNlUGxheWVyO31cbiAgICBnZXRUZWFtTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIC8vIGNvbXB1dGluZyB0aGUgdGVhbSBuYW1lIG9uIHRoZSBmbHlcbiAgICAgICAgLy8gb2ssIEkndmUgY2hhbmdlIHNlbmRpbmcgdGhlIHBhcnRuZXJJZHMgb3ZlciB0byB0aGUgZ2FtZSwgaW5zdGVhZCBub3cgcGFydG5lciBpcyBiZWluZyBzZXRcbiAgICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IHdlIG5lZWQgdG8gZ28gdGhyb3VnaCB0aGUgcGxheWVyIGFnYWluXG4gICAgICAgIC8qXG4gICAgICAgIGxldCBwbGF5ZXI9dGhpcy5fcGxheWVyc1twbGF5ZXJJbmRleF07XG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9cGxheWVyLnBhcnRuZXI7XG4gICAgICAgIHJldHVybiBwbGF5ZXIubmFtZSsocGFydG5lckluZGV4Pj0wP1wiICYgXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKHBhcnRuZXJJbmRleCk6XCJcIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIE5PVCByZXBsYWNpbmc6XG4gICAgICAgIGxldCB0ZWFtTmFtZT10aGlzLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICAvLyBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSBjdXJyZW50IHBsYXllciBiZWluZyBhc2tlZCBhbmQgYW5vdGhlciBwbGF5ZXJcbiAgICAgICAgbGV0IGtub3duUGFydG5lckluZGV4PSh0aGlzLl9wYXJ0bmVycz90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF06LTEpOyAvLyBOT1RFIGNvdWxkIGJlIG51bGwhISFcbiAgICAgICAgLy8gaWYgdGhlIHBsYXllciBpcyBwbGF5aW5nIGJ5IGhpbS9oZXJzZWxmIHRoZXJlIHNob3VsZG4ndCBiZSBhIHBhcnRuZXIhISEhXG4gICAgICAgIGlmKHRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUsmJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVImJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEEpe1xuICAgICAgICAgICAgaWYocGxheWVySW5kZXg9PT1jdXJyZW50UGxheWVyLl9pbmRleCYmY3VycmVudFBsYXllci5wYXJ0bmVyPj0wKXRlYW1OYW1lKz1cIj9cIjtcbiAgICAgICAgICAgIGlmKGtub3duUGFydG5lckluZGV4Pj0wKXRlYW1OYW1lKz1cIiY/XCI7IC8vIHNvbWUgZXJyb3IgYXBwYXJlbnRseSEhISEhXG4gICAgICAgICAgICByZXR1cm4gdGVhbU5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGVhbU5hbWUrPVwiIFwiOyAvLyB3ZSdsbCBoYXZlIHBhcnRuZXIgaW5mb3JtYXRpb24gYmVoaW5kXG4gICAgICAgIGlmKHBsYXllckluZGV4PT09dGhpcy5fcGxheWVySW5kZXgpe1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYXJ0bmVySW5kZXg9Y3VycmVudFBsYXllci5wYXJ0bmVyOyAvLyB0aGUgcGxheWVyIHRoYXQgaGFzIHRoZSByZXF1ZXN0ZWQgcGFydG5lciBjYXJkIGtub3dzIGhpcyBwYXJ0bmVyLi4uXG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBwYXJ0bmVyIGluZGV4IGlzIGtub3duIGJ1dCB0aGUga25vd25QYXJ0bmVySW5kZXggaXMgbm90IHdlIHdyYXAgdGhlIG5hbWUgaW4gKClcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXJ0bmVySW5kZXg+PTAmJmtub3duUGFydG5lckluZGV4PDApdGVhbU5hbWUrPVwiIChcIjtcbiAgICAgICAgICAgIHRlYW1OYW1lKz1cIiAmIFwiOyAvLyB3ZSBhcmUgd2l0aCBhIHBhcnRuZXIgKGFsdGhvdWdoIHdlIG1pZ2h0IG5vdCBjdXJyZW50bHkga25vdyB3aG8pXG4gICAgICAgICAgICAvLyB0aGUgb2ZmaWNpYWwgcGFydG5lciAoYXMga25vd24gdG8gdGhlIGN1cnJlbnQgcGxheWVyKSBpcyB0aGUgb25lIGZyb20gY3VycmVudFBhcnRuZXJJbmRleCAoYW5kIHdlIHNob3cgdGhhdCBuYW1lISlcbiAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXJzKXRlYW1OYW1lKz0oY3VycmVudFBhcnRuZXJJbmRleD49MD90aGlzLmdldFBsYXllck5hbWUoY3VycmVudFBhcnRuZXJJbmRleCk6XCI/XCIpO1xuICAgICAgICAgICAgLy8gY2FuIHdlIGRlYWwgd2l0aCBlcnJvciBzaXR1YXRpb25zIG5vdz8/Pz8/P1xuICAgICAgICAgICAgLy8gdHlwaWNhbGx5IHRoaXMgd291bGQgYmUgdGhlIGNhc2UgaWYgdGhlIGtub3duIHBhcnRuZXIgaW5kZXggZGlmZmVycyBmcm9tIHRoZSBwYXJ0bmVyIGluZGV4IHJlZ2lzdGVyZWQgd2l0aCB0aGUgcGxheWVyISEhXG4gICAgICAgICAgICBpZihrbm93blBhcnRuZXJJbmRleD49MCYmY3VycmVudFBhcnRuZXJJbmRleCE9PWtub3duUGFydG5lckluZGV4KVxuICAgICAgICAgICAgICAgIHRlYW1OYW1lKz1cIj9cIisoa25vd25QYXJ0bmVySW5kZXg+PTA/dGhpcy5nZXRQbGF5ZXJOYW1lKGtub3duUGFydG5lckluZGV4KTpcIlwiKTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXJ0bmVySW5kZXg+PTAmJmtub3duUGFydG5lckluZGV4PDApdGVhbU5hbWUrPVwiKVwiOyAgICBcbiAgICAgICAgfWVsc2UgLy8gbmFtZSBvZiBhbm90aGVyIHBsYXllcidzIHBhcnRuZXIgYmVpbmcgYXNrZWQsIGNhbiBvbmx5IGJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoaXMuX3BhcnRuZXJzXG4gICAgICAgICAgICB0ZWFtTmFtZSs9XCIgJiBcIisoa25vd25QYXJ0bmVySW5kZXg+PTA/dGhpcy5nZXRQbGF5ZXJOYW1lKGtub3duUGFydG5lckluZGV4KTpcIj9cIik7XG4gICAgICAgIHJldHVybiB0ZWFtTmFtZTtcbiAgICB9XG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIHNlbmRNZXNzYWdlVGV4dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbmQtbWVzc2FnZS10ZXh0XCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VuZC1tZXNzYWdlLWJ1dHRvblwiKS5vbmNsaWNrPXNlbmRNZXNzYWdlQnV0dG9uQ2xpY2tlZDtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAvLyBob3cgYWJvdXQgcHJvbXB0aW5nIHRoZSB1c2VyPz8/Pz9cbiAgICAgICAgLy8gaWYoIWN1cnJlbnRQbGF5ZXJ8fCFjdXJyZW50UGxheWVyLmdhbWUpcmV0dXJuOyAvLyBkbyBub3QgYXNrIHRoZSB1c2VyIHdoZXRoZXIgdGhleSB3YW50IHRvIHN0YXkgb3Igbm90IChhcyB0aGV5IGNhbm5vdCBzdGF5KVxuICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyB2aWV3aW5nIHRoZSByZXN1bHRzIHBhZ2Ugd2UgbWF5IGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIGFjdHVhbGx5IG92ZXJcbiAgICAgICAgcmV0dXJuKGN1cnJlbnRQYWdlPT09J3BhZ2UtcmVzdWx0cyc/XCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi4gVG90IGRlIHZvbGdlbmRlIGtlZXIhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XCJIZXQgc3BlbCBpcyBub2cgbmlldCB0ZW4gZWluZGUuIEJsaWpmIG9wIGRlIHBhZ2luYSBvbSB0b2NoIHZlcmRlciB0ZSBzcGVsZW4uXCIpO1xuICAgIH07XG4gICAgLy8gaWYgd2UgYWN0dWFsbHkgZW5kIHVwIGluIGxlYXZpbmcgdGhpcyBVUkwsIHdlIGRlZmluaXRlbHkgd2FudCB0byBraWxsIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgZm9yIGdvb2RcbiAgICB3aW5kb3cub25wb3BzdGF0ZT1mdW5jdGlvbigpe1xuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIuZXhpdCgnRVhJVCcpOyAvLyBpZiB3ZSBoYXZlbid0IGRvbmUgc28geWV0ISEhIVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKG51bGwsbnVsbCk7IC8vIHdpdGhvdXQgY2FsbGJhY2sgbm8gcGFnZSBzaG91bGQgYmUgc2hvd24gYW55bW9yZS4uLlxuICAgIH1cblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGhpZGUgdGhlIGJpZGRpbmcgYW5kIHBsYXlpbmcgZWxlbWVudHNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIC8vIHJlcGxhY2VkIGJ5IGJpZC1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7XG4gICAgLy8gRE8gTk9UIERPIFRISVMgV0lMTCBPVkVSUlVMRSBQQVJFTlQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIE1ESEAxOUpBTjIwMjA6IFwiaGlkZGVuXCIgY2hhbmdlZCB0byBcInZpc2libGVcIiBhcyB3ZSBuZXZlciBoaWRlIHRoZSBjYXJkcyBvZiB0aGUgY3VycmVudCBwbGF5ZXJzXG4gICAgLy8gcmVwbGFjZWQgYnkgcGxheS1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBNREhAMTlKQU4yMDIwOiBhbmQgdmljZSB2ZXJzYVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItZ2FtZS1idXR0b24nKS5vbmNsaWNrPXNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIGZvcihsZXQgYmFja0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrJykpYmFja0J1dHRvbi5vbmNsaWNrPXJldHVyblRvUHJldmlvdXNQYWdlO1xuICAgIC8vIHNob3cgdGhlIHBhZ2UtcnVsZXMgcGFnZSB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIGhlbHBcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24ub25jbGljaz1zaG93SGVscDtcbiAgICAvLyBNREhAMTBKQU4yMDIwOiBFTkRcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzIGZvciBuZXh0LCBjYW5jZWwsIGFuZCBuZXdQbGF5ZXJzIGJ1dHRvbnNcbiAgICBmb3IobGV0IG5leHRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV4dCcpKW5leHRCdXR0b24ub25jbGljaz1uZXh0UGFnZTtcbiAgICBmb3IobGV0IGNhbmNlbEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwnKSljYW5jZWxCdXR0b24ub25jbGljaz1jYW5jZWxQYWdlO1xuICAgIGZvcihsZXQgc3RvcEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdG9wJykpc3RvcEJ1dHRvbi5vbmNsaWNrPXN0b3BQbGF5aW5nO1xuICAgIFxuICAgIC8vIGxldCdzIGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIG92ZXIgd2hlbiBuZXctZ2FtZSBidXR0b25zIGFyZSBzaG93aW5nXG4gICAgLy8gd2UncmUgbm90IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24sIHdlJ2xsIGp1c3Qga2VlcCB1c2luZyB0aGUgc2FtZSBjb25uZWN0aW9uXG4gICAgZm9yKGxldCBuZXdHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXctZ2FtZVwiKSluZXdHYW1lQnV0dG9uLm9uY2xpY2s9bmV3R2FtZTtcbiAgICAvKlxuICAgIC8vIHdoZW5ldmVyIHdlIGhhdmUgbmV3IHBsYXllcihuYW1lKXNcbiAgICBmb3IobGV0IG5ld0dhbWVQbGF5ZXJzQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25ldy1nYW1lLXBsYXllcnMnKSluZXdHYW1lUGxheWVyc0J1dHRvbi5vbmNsaWNrPW5ld0dhbWVQbGF5ZXJzO1xuICAgIC8vIHdoZW5ldmVyIHRoZSBnYW1lIGlzIGNhbmNlbGVkXG4gICAgZm9yKGxldCBjYW5jZWxHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhbmNlbC1nYW1lJykpY2FuY2VsR2FtZUJ1dHRvbi5vbmNsaWNrPWNhbmNlbEdhbWU7XG4gICAgKi9cblxuICAgIC8vIGF0dGFjaCBhbiBvbmNsaWNrIGV2ZW50IGhhbmRsZXIgZm9yIGFsbCBiaWQgYnV0dG9uc1xuICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpYmlkQnV0dG9uLm9uY2xpY2s9YmlkQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBwcmVwYXJlIGZvciBzaG93aW5nL2hpZGluZyB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgYmlkZGVyXG4gICAgaW5pdGlhbGl6ZUNvbGxhcHNpbmdCdXR0b25zKCk7XG4gICAgLy8gcmVwbGFjaW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS1iaWRkZXItY2FyZHNcIikub25jbGljaz10b2dnbGVCaWRkZXJDYXJkcztcblxuICAgIC8vIGV2ZW50IGhhbmRsZXIgZm9yIHNlbGVjdGluZyBhIHN1aXRlXG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC10cnVtcFwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXRydW1wU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtcGFydG5lclwiKSlzdWl0ZUJ1dHRvbi5vbmNsaWNrPXBhcnRuZXJTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgc3VpdGUgZWxlbWVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIHNob3cgdGhlIHJpZ2h0IHRleHQhISEhXG4gICAgZm9yKGxldCBzdWl0ZT0wO3N1aXRlPDQ7c3VpdGUrKylcbiAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLlwiK0NhcmQuU1VJVEVfTkFNRVNbc3VpdGVdKSlcbiAgICAgICAgICAgIHN1aXRlQnV0dG9uLnZhbHVlPUNhcmQuU1VJVEVfQ0hBUkFDVEVSU1tzdWl0ZV07XG4gICAgXG4gICAgLyogTURIQDIySkFOMjAyMDogZXZlbnQgaGFuZGxlciBmb3IgY2xpY2tpbmcgdGhlIG5ldyB0cmljayBidXR0b25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikub25jbGljaz1uZXdUcmlja0J1dHRvbkNsaWNrZWQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgICovXG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBjaGVjayBmb3IgYSB1c2VyIG5hbWVcbiAgICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAvLyBNREhAMjRKQU4yMDIwOiBjaGFuZ2VkICdwbGF5ZXInIHRvICdhbHMnISEhIE5PVEUgdGhpcyBpcyBhIGJhY2stZG9vclxuICAgIGxldCBpbml0aWFsUGxheWVyTmFtZT0odXJsUGFyYW1zLmhhcyhcImFsc1wiKT91cmxQYXJhbXMuZ2V0KFwiYWxzXCIpLnRyaW0oKTpudWxsKTtcbiAgICBpZihpbml0aWFsUGxheWVyTmFtZSlzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLChlcnIpPT57fSk7XG5cbn07XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIsZXJyb3JjYWxsYmFjayl7XG4gICAgdmlzaXRlZFBhZ2VzPVtdOyAvLyBmb3JnZXQgdmlzaXRlZCBwYWdlc1xuICAgIGN1cnJlbnRQYWdlPW51bGw7IC8vIGFzY2VydGFpbiB0byBub3QgaGF2ZSBhIHBhZ2UgdG8gc3RvcmVcbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IHBsYXllciAoaWYgYW55KSwgYW5kIGluIGVmZmVjdCB3ZSdsbCBsb29zZSB0aGUgZ2FtZSBhcyB3ZWxsXG4gICAgaWYoY3VycmVudFBsYXllcil7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIGlmKGVycm9yY2FsbGJhY2spc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8obG9jYXRpb24ucHJvdG9jb2wrJy8vJytsb2NhdGlvbi5ob3N0KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKGN1cnJlbnRQbGF5ZXI/XCJSZWNvbm5lY3RlZFwiOlwiQ29ubmVjdGVkXCIpK1wiIHRvIHRoZSBnYW1lIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpeyAvLyBmaXJzdCB0aW1lIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBkbyBOT1Qgc3RhcnQgcGxheWluZyBhIGdhbWUgdW50aWwgd2UgcmVjZWl2ZSB0aGUgcGxheWVyIG5hbWVzISEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9NDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWU9bmV3IFBsYXllckdhbWVQcm94eShjbGllbnRzb2NrZXQpOyAvLyBsZXQncyBjcmVhdGUgdGhlIGdhbWUgdGhhdCBpcyB0byByZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTsgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlcnJvcmNhbGxiYWNrPT09J2Z1bmN0aW9uJyllcnJvcmNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIGlzIGhlcnN0ZWxkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAyM0pBTjIwMjA6IHB1c2ggdGhlIHBsYXllciBuYW1lIHRvIHRoZSBzZXJ2ZXIgYWdhaW4sIHNvIGl0IGNhbiByZXNlbmQgd2hhdCBuZWVkcyBzZW5kaW5nISEhIVxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIpY2xpZW50c29ja2V0LmVtaXQoJ1BMQVlFUicsY3VycmVudFBsYXllci5uYW1lLCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJKZSBiZW50IGFscyBzcGVsZXIgYWFuZ2VtZWxkIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgaXMgdmVyYnJva2VuLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlci5cIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdF9lcnJvcicsKGVycik9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBlcnJvcjogXCIsZXJyKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBlZW4gcHJvYmxlZW0gbWV0IGRlIHZlcmJpbmRpbmcgKFwiK2Vyci5tZXNzYWdlK1wiKSFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyB0cnkgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIGNhdGNoaW5nIHdoYXRldmVyIGhhcHBlbnMgdGhyb3VnaCBldmVudHNcbiAgICAgICAgY2xpZW50c29ja2V0LmNvbm5lY3QoKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgY3VycmVudEdhbWU9bnVsbDsgLy8gZ2V0IHJpZCBvZiB0aGUgY3VycmVudCBnYW1lIChpZiBhbnkpXG4gICAgICAgICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobnVsbCkpO1xuICAgIH1cbn1cblxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggdGhlIChuZXcpIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyIHdoZW5ldmVyIHRoZSBwbGF5ZXIgd2FudHMgdG8gcGxheVxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggbnVsbCAob3IgZW1wdHkpIHBsYXllciBuYW1lXG4vLyB0byBtYWtlIGl0IGNhbGxhYmxlIGZyb20gYW55d2hlcmUgd2UgYXR0YWNoIHNldFBsYXllck5hbWUgdG8gd2luZG93IChiZWNhdXNlIGNsaWVudC5qcyB3aWxsIGJlIGJyb3dzZXJpZmllZCEhISlcbmZ1bmN0aW9uIHNldFBsYXllck5hbWUocGxheWVyTmFtZSxlcnJvckNhbGxiYWNrKXtcbiAgICAocHJlcGFyZWRGb3JQbGF5aW5nfHxwcmVwYXJlRm9yUGxheWluZygpKTsgLy8gcHJlcGFyZSBmb3IgcGxheWluZyBvbmNlXG4gICAgLy8gaWYoZXJyb3JDYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gYXNjZXJ0YWluIHRvIG5vdCBiZSBpbiBhIG5vbi1wbGF5ZXIgcGFnZVxuICAgIC8vIHBsYXllck5hbWUgbmVlZHMgdG8gYmUgYSBzdHJpbmcgKGlmIGl0IGlzIGRlZmluZWQpXG4gICAgaWYocGxheWVyTmFtZSYmISh0eXBlb2YgcGxheWVyTmFtZT09PVwic3RyaW5nXCIpKVxuICAgICAgICByZXR1cm4odHlwZW9mIGVycm9yQ2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvckNhbGxiYWNrKG5ldyBFcnJvcihcIkludmFsaWQgcGxheWVyIG5hbWUuXCIpKSk7XG4gICAgLy8gaWYgcGxheWVyTmFtZSBtYXRjaGVzIHRoZSBjdXJyZW50IHBsYXllcidzIG5hbWUsIG5vdGhpbmcgdG8gZG9cbiAgICBpZihwbGF5ZXJOYW1lJiZjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLm5hbWU9PT1wbGF5ZXJOYW1lKVxuICAgICAgICAodHlwZW9mIGVycm9yQ2FsbGJhY2shPT0nZnVuY3Rpb24nfHxlcnJvckNhbGxiYWNrKG51bGwpKTtcbiAgICBlbHNlXG4gICAgICAgIF9zZXRQbGF5ZXIocGxheWVyTmFtZSYmcGxheWVyTmFtZS5sZW5ndGg+MD9uZXcgT25saW5lUGxheWVyKHBsYXllck5hbWUpOm51bGwsZXJyb3JDYWxsYmFjayk7XG59XG5cbndpbmRvdy5vbmxvYWQ9cHJlcGFyZUZvclBsYXlpbmc7XG5cbi8vIGV4cG9ydCB0aGUgdHdvIGZ1bmN0aW9uIHRoYXQgd2UgYWxsb3cgdG8gYmUgY2FsbGVkIGZyb20gdGhlIG91dHNpZGUhISFcbm1vZHVsZS5leHBvcnRzPXNldFBsYXllck5hbWU7Il19
