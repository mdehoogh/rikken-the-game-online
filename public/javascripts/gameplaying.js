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
    return["geen","een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien","elf","twaalf","allemaal"][count];
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

var onExitHandler=null; // the on exit handler supplied by caller of setPlayerName() (null when running 'standalone')

// MDH@06FEB2020: as we're sending with acknowledging we can keep track of the response time of the server to use when exiting the game
class ServerResponseStats{
    constructor(){
        this._minimumResponseMs=null;
        this._maximumResponseMs=null;
        this._lastResponseMs=null;
    }
    get minimumResponseMs(){return this._minimumResponseMs;}
    get maximumResponseMs(){return this._maximumResponseMs;}
    get lastResponseMs(){return this._lastResponseMs;}
    add(responseMs){
        console.log("***** Adding server response time "+responseMs+".");
        this._lastResponseMs=responseMs;
        if(!this._maximumResponseMs||this._lastResponseMs>this._maximumResponseMs)this._maximumResponseMs=this._lastResponseMs;
        if(!this._minimumResponseMs||this._lastResponseMs<this._minimumResponseMs)this._minimumResponseMs=this._lastResponseMs;
    }
}
var serverResponseStats=new ServerResponseStats();
function sendToServer(socket,event,data,callback){
    let sendToServerTimeMs=window.performance.now();
    socket.emit(event,data,(response)=>{
        serverResponseStats.add(window.performance.now()-sendToServerTimeMs); // remember how long acknowledging took
        if(typeof callback==='function')callback(response);
    });
    return true;
}

// MDH@07FEB2020: when in the process of 
function updateGameOverButtons(enable){
    for(let stopButton of document.getElementsByClassName('stop'))stopButton.disabled=!enable;
    for(let newGameButton of document.getElementsByClassName("new-game"))newGameButton.disabled=!enable;
}

// MDH@05FEB2020: if somebody wants to stop playing completely, (s)he wants to be completely forgotten
//                setPlayerName() 
var registeringPlayerId=null; // the id of the timer to register the player on every socket.io connect
function stopButtonClicked(){
    window.history.back();
    /* MDH@12FEB2020: replacing:
    if(!currentPlayer)return alert("Helaas kennen we je niet, dus je zult niet kunnen spelen!");
    updateGameOverButtons(false); // disable the game over buttons
    // leaving the page is easiest... QUICK FIX to do so when we're in a session (i.e. assuming a registered player)
    if(getCookie('connect.sid'))
        window.history.back();
    else
        _setPlayer(null); // killing the player should do the rest!!!!!
    */
    /* MDH@05FEB2020 replacing: 
    // ASSERT assuming not playing in a game anymore i.e. newGame() has been called before
    // a NORMAL exit
    if(!currentPlayer)return alert("Je bent al afgemeld!");
    currentPlayer.exit('STOP'); // MDH@05FEB2020: TODO check whether doing this truely kills the player at the other end!!!
    // kill the 'history', pretend to never have been here, and show the help page (from where a person can start again)
    visitedPages=[];currentPage=null;showHelp();
    // 'manually' move to the previous 'page' in the history...
    console.log("Length of history: ",window.history.length);
    window.history.back();
    */
}
function registerPlayer(clientsocket){
    if(!registeringPlayerId)return; // if a response was received registeringPlayerId will be null (see below)
    try{
        setInfo("Je wordt aangemeld als speler.","Spel");
        currentGame._socket.emit('PLAYER',
                            {name:currentPlayer.name,id:getCookie('connect.sid')},
                            (success)=>{ // the server responded!!!!
                                    registeringPlayerId=null; // get rid of the reference so registering will stop!!!!
                                    if(!success){
                                        alert("Je bent als speler afgewezen, omdat je elders al meespeelt!");
                                        stopButtonClicked();
                                    }else
                                        setInfo("Je bent als speler aangemeld!","Server");
                                }
                            );
    }finally{
        registeringPlayerId=setTimeout(registerPlayer,2500); // try again in 2.5 seconds
    }
} // every 2.5 seconds

// MDH@10JAN2020: newGame() is a bid different than in the demo version in that we return to the waiting-page
function newGameButtonClicked(){
    _setPlayer(null); // MDH@12FEB2020: this will allow us to test for it in onbeforeunload...
    // MDH@12FEB2020: the easiest way to do this is by forcing a reload BUT see how the game engine responds
    window.location.reload(/*true*/); // from cache is fine as long as setPlayerName() is executed again!!!!
    /* replacing:
    // means: do not forget about me playing i.e. keep me on the gameplaying page
    // MDH@05FEB2020: it's prudent to start completely over with a new player with the same name!!!!
    if(!currentPlayer)return alert("Helaas kennen we je niet, dus je zult niet kunnen spelen!");
    updateGameOverButtons(false); // disable the game over buttons
    setPlayerName(currentPlayer.name);
    */
}

var toMakeABid=0,bidMade=-1; // MDH@03FEB2020: some protection for preventing making a bid when not being asked or after having made a bid
var toPlayACard=0,playedCardInfo=null; // MDH@05FEB2020: the card played that needs to be remembered so we can send it again
var toChooseTrumpSuite=0,chosenTrumpSuite=-1;
var toChoosePartnerSuite=0,chosenPartnerSuite=-1;

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

var sendMessageText;
function sendMessageButtonClicked(){
    if(currentGame&&currentGame._socket){
        // don't send any text if sending the default text
        let textToSend=(sendMessageText.value!==playerStateMessages[currentPlayerState]?sendMessageText.value:'');
        // if no text entered to be sent, ask player whether
        if(textToSend.trim().length===0&&!confirm("Er is geen te versturen tekst. Wilt U toch versturen?"))return;
        setInfo("?","Jij");
        // MDH@06FEB2020: NOT using sendToServer here because not sure if sendToServer is re-entrant!!!!
        currentGame._socket.emit('PLAYER_SAYS',{'state':currentPlayerState,'text':textToSend},(response)=>{
            setInfo(response&&response.length>0?response:"Bericht ontvangen, maar geen antwoord gestuurd.","Server");
            // if the message text differed from the default message we clear the message text
            if(sendMessageText.value!==playerStateMessages[currentPlayerState])sendMessageText.value='';
        });
    }else
        alert("Je bent blijkbaar gestopt met spelen! Om weer te kunnen spelen moet je de pagina opnieuw laden!");
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

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
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
            if(bidTableColumnIndex>=firstColumnIndex)
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
        playerBidsRow.children[0].innerHTML=rikkenTheGame.getPlayerName(playerIndex)+": "; // write the name of the player
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
        if(playerIndex<0){alert("Speler "+playerBidsObject.name+" onbekend!");continue;}
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
            bidMade=-1; // MDH@07FEB2020: yes, I think we need this as well!!!
            forceFocus(this.name);
            // ascertain to be looking at the bidding page (in which case we can safely use VISIBLE)
            if(currentPage!="page-bidding")setPage("page-bidding"); 
            // removed: document.getElementById("wait-for-bid").style.visibility="hidden"; // show the bidding element
            // MDH@03FEB2020: inherit is safer because if this happens by accident (when not on the bidding page)
            document.getElementById("bidding").style.visibility=VISIBLE; // show the bidding element, essential to hide it immediately after a bid
            // currentPlayer=this; // remember the current player
            setInfo("Doe een bod, "+this.name+".","Server");
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
            if(document.getElementById("bidder-suitecards-button").classList.contains("active-button"))
                document.getElementById("bidder-suitecards-button").classList.toggle("active-button");
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
        if(bidMade>=0){
            let error=(currentPlayer?currentPlayer._setBid(bidMade):new Error(bug("Je bent geen speler meer!")));
            if(error instanceof Error)
                setInfo("Nog steeds problemen bij het versturen van je bod. We blijven het proberen.","Speler");
            else
                setInfo("Je bod is nogmaals verstuurd. Hopelijk hebben we nu meer geluk!","Speler");
        }else
            setInfo("Er wordt op je bod gewacht!","Server");
    }
    chooseTrumpSuite(suites){
        toChooseTrumpSuite++;
        if(toChooseTrumpSuite===1){
            chosenTrumpSuite=-1;
            forceFocus(this.name);
            console.log("Possible trump suites:",suites);
            setPage("page-trump-choosing");
            document.getElementById("trump-suite-input").style.visibility=VISIBLE; // ascertain to allow choosing the trump suite
            updateChooseTrumpSuiteCards(this._suiteCards);
            // iterate over the trump suite buttons
            for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
                suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
            setPlayerState(PLAYERSTATE_TRUMP);    
        }else
        if(chosenTrumpSuite>=0){
            // MDH@07FEB2020: a shortcut of sending the chosen trump suite
            if(!this._game)return alert(bug("Het spel is verdwenen!"));
            this._game.trumpSuiteChosen(chosenTrumpSuite);
        }else
            setInfo("Er wordt op de troefkleur gewacht","Server");
    }
    choosePartnerSuite(suites,partnerRank){ // partnerRankName changed to partnerRank (because Language should be used at the UI level only!)
        toChoosePartnerSuite++;
        if(toChoosePartnerSuite===1){
            chosenPartnerSuite=-1;
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
        }else
        if(chosenPartnerSuite>=0){
            if(!this._game)return alert(bug("Het spel is verdwenen!"));
            // MDH@07FEB2020: a shortcut of sending the chosen partner suite
            this._game.partnerSuiteChosen(chosenPartnerSuite);
        }else
            setInfo("Er wordt op de kleur van de mee te vragen "+Language.DUTCH_RANK_NAMES[partnerRank]+" gewacht.");
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
    // MDH@07FEB2020: OOPS, bidMade can be 0 which would be considered a falsy value so we should not use bidMade itself as condition!!!!
    if(bidMade>=0)return alert("Je hebt al een bod uitgebracht!");
    try{
        let bid=parseInt(event.currentTarget.getAttribute("data-bid"));
        if(isNaN(bid)||bid<0)return alert(bug("Je bod ("+(bid?Card.BID_NAMES[bid]:"?")+" is ongeldig!"));
        bidMade=bid; // remember the bid in case we need to send it again
        let error=currentPlayer._setBid(bidMade); // the value of the button is the made bid
        if(error instanceof Error)
            setInfo("Problemen bij het versturen van je bod: "+error.message+". We blijven het proberen.","Spel");
        else // bid done!!!
            setInfo("Bod verstuurd!","Spel");
    }catch(err){
        console.error(err);
    }finally{
        document.getElementById("bidding").style.visibility=(bidMade>=0?"hidden":VISIBLE); // show again
        if(bidMade>=0)forceFocus(null);
    }
}
/**
 * clicking a trump suite button registers the chosen trump suite with the current player 
 * @param {*} event 
 */
function trumpSuiteButtonClicked(event){
    // either trump or partner suite selected
    // OOPS using parseInt() here is SOOOO important
    if(toChooseTrumpSuite<=0)return alert("Je mag nu geen troefkleur kiezen. Het wachten is op een seintje van de server.");
    if(chosenTrumpSuite>=0)return alert("Je hebt de troefkleur al gekozen!");
    let trumpSuite=parseInt(event.currentTarget.getAttribute("data-suite"));
    if(isNaN(trumpSuite)||trumpSuite<0)return alert(bug("Ongeldige troefkleur!"));
    try{
        currentPlayer._setTrumpSuite(trumpSuite);
        chosenTrumpSuite=trumpSuite;
    }catch(err){
        console.error(err);
    }finally{
        if(chosenTrumpSuite>=0){
            document.getElementById("trump-suite-input").style.visibility="hidden";
            forceFocus(null);
            console.log("Trump suite "+chosenTrumpSuite+" chosen.");    
        }
    }
}
/**
 * clicking a partner suite button registers the chosen partner suite with the current player 
 * @param {*} event 
 */
function partnerSuiteButtonClicked(event){
    if(toChoosePartnerSuite<=0)return alert("Je mag de kleur van de meegevraagde kaart nu niet kiezen. Het wachten is op een seintje van de server.");
    if(chosenPartnerSuite>=0)return alert("Je hebt de kleur van de meegevraagde kaart al gekozen!");
    // either trump or partner suite selected
    // parseInt VERY IMPORTANT!!!!
    let partnerSuite=parseInt(event.currentTarget.getAttribute("data-suite"));
    if(isNaN(partnerSuite)||partnerSuite<0)return alert(bug("Kleur van de meegevraagde kaart ongeldig!"));
    try{
        currentPlayer._setPartnerSuite(partnerSuite);
        chosenPartnerSuite=partnerSuite;
    }catch(err){
        console.error(err);
    }finally{
        if(chosenPartnerSuite>=0){
            document.getElementById("partner-suite-input").style.visibility="hidden";
            forceFocus(null);
            console.log("Partner suite "+chosenPartnerSuite+" chosen.");    
        }
    }
}

var playablecardCell,playablecardCellContents;
/**
 * clicking a partner suite button registers the chosen partner suite with the current player 
 * @param {*} event 
 */
function playablecardButtonClicked(event){
    
    // MDH@05FEB2020: prevent from playing a card when a card has already been played (and not yet confirmed by the server)
    if(toPlayACard<=0)return alert("Je mag nu geen kaart spelen! Het wachten is op een seintje van de server.");
    
    if(playedCardInfo)return alert("Je hebt al een kaart (nl. "+getLocaleCardText(playedCardInfo[0])+") gespeeld.");

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
        document.getElementById("play-card-prompt").innerHTML=(error instanceof Error?error.message:"Je mag "+getLocaleCardText(cardPlayed)+" niet spelen.")+" Speel een andere kaart!";
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
    if(visitedPages.length>0){
        currentPage=null;
        setPage(visitedPages.shift());
    }
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
    _sentEventReceived(result){
        if(this._eventToSendIntervalId){clearInterval(this._eventToSendIntervalId);this._eventToSendIntervalId=null;}
        /* MDH@07FEB2020 should be dealt with in the callback preferably!!!
        forceFocus(null);
        */
        this._eventToSend=null;
        if(this._eventReceivedCallback)this._eventReceivedCallback(result,false);
        console.log("Event "+this._eventToSend[0]+" processed by game server.");
    }
    _sendEvent(){
        let result=false;
        try{
            // if this is a timeout call the callback and make it determine whether to give up sending or not
            let tosend=(this._eventToSend[2]===0||!this._eventReceivedCallback||this._eventReceivedCallback(null,this._eventToSend[2]));
            if(tosend){
                sendToServer(this._socket,this._eventToSend[0],this._eventToSend[1],this._sentEventReceived);
                this._eventToSend[2]++;
                result=true; 
                /*
                // MDH@01FEB2020: we show how often a certain event was sent on the sendMessageButton
                if(this._eventToSend[2]>1)sendMessageButton.value=playerStateMessages[currentPlayerState]+" ("+this._eventToSend[2]+"x)";
                */
                console.log("Event "+this._eventToSend[0]+(this._eventToSend[1]?" with data "+JSON.stringify(data):"")+" sent (attempt: "+this._eventToSend[2]+").");
            }else
                console.log("Resending event "+this._eventToSend[0]+" canceled!");
        }catch(error){
            console.log("ERROR: Failed to send event "+this._eventToSend[0]+" to the game server (reason: "+error.message+").");
        }
        return result;
    }
    // MDH@07FEB2020: if there is a callback we're NOT resending i.e. we rely on the acknowledging
    //                the callback will be called on a timeout (if requested) as well with second argument set to true (and result to null)
    _setEventToSend(event,data,resendInterval,callback){
        if(this._eventToSend)return false; // MDH@07FEB2020: can have only one pending event to send at a time
        this._eventReceivedCallback=null; // in case we fail
        if(this._eventToSendIntervalId){clearInterval(this._eventToSendIntervalId);this._eventToSendIntervalId=null;}
        // no callback specified, so using resend mechanism
        this._eventToSend=[event,data,0]; // keep track of the send event count
        if(!this._sendEvent())return false; // _eventReceivedCallback does not need to be known the first time for sure...
        this._eventReceivedCallback=callback; // so we can set it here
        // schedule a resend if so desired
        if(typeof resendInterval==='number'&&resendInterval>0)this._eventToSendIntervalId=setInterval(this._sendEvent,resendInterval);
        return true;
    }

    // what the player will be calling when (s)he made a bid, played a card, choose trump or partner suite
    bidMade(bid){
        if(this._state===PlayerGame.OUT_OF_ORDER)return false;
        // MDH@07FEB2020 removing: document.getElementById("bidding").style.visibility="hidden";
        // MDH@07FEB2020 because we pass in a callback no automatic resending!!!!
        let bidMadeSentResult=this._setEventToSend('BID',bid,function(result,failureCount){
            if(result){
                setInfo("Bod niet geaccepteerd"+
                            (result.hasOwnProperty('error')?" (fout: "+result.error+")":"")+"!","Server");
                // TODO what now??? technically the user should be allowed to make a new bid?????????
            }else
                setInfo("Bod verwerkt.","Server");
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
            this._setEventToSend('CARD',[card.suite,card.rank,askingForPartnerCard],0,function(result,failureCount){
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
        // MDH@07FEB2020 because already done when a trump suite button is clicked!!!! removing: document.getElementById("trump-suite-input").style.visibility="hidden";
        let trumpSuiteChosenSentResult=this._setEventToSend('TRUMPSUITE',trumpSuite,0,function(result,failureCount){
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
        // MDH@07FEB2020 because already done when a trump suite button is clicked!!!! removing: document.getElementById("partner-suite-input").style.visibility="hidden";
        let partnerSuiteChosenSentResult=this._setEventToSend('PARTNERSUITE',partnerSuite,0,function(result,failureCount){
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
        return this._setEventToSend('DONE',null,0,function(result,failureCount){
            console.log("DONE event acknowledged.");
            this._playerIndex=-1; // MDH@29JAN2020: I have to do this otherwise I won't be able to play in a new game (see set playerNames!!!!)
            setInfo("Zodra er weer vier niet-spelende deelnemers zijn kun je weer spelen.","Server");
        });
    }
    exit(reason){
        // player is exiting somehow...
        let data=(reason?reason:(currentPlayer?currentPlayer.name:""));
        // it is crucial that the EXIT event is received by the game server
        return this._setEventToSend('EXIT',data,serverResponseStats.maximumResponseMs,function(result,failureCount){
            let acknowledged=(typeof failureCount!==number);
            if(acknowledged){
                console.log("EXIT event "+data+" acknowledged!");
                // we're NOT going anywhere anymore: setPage("page-rules");
                setInfo("Bedankt voor het spelen.","Server");
            }else{ // allow user to try again...
                setInfo("Stoppen nog niet bevestigd. Probeer het zo nog eens!","Spel");
                updateGameOverButtons(true); // enable game over buttons
            }
            return false;
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
        if(!trickInfo)return alert(bug("Geen slaginformatie!"));

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
                    toMakeABid=0;bidMade=-1;
                    // MDH@07FEB2020 removing: document.getElementById("bidding").style.visibility="hidden";
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
                        setInfo("Programmafout: U wordt om een kaart gevraagd in een ongedefinieerde slag! We wachten even op slaginformatie.","Server");
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
        if(!currentPlayer)return null; // MDH@12FEB2020: if no current player (anymore) no warning
        // how about prompting the user?????
        // if(!currentPlayer||!currentPlayer.game)return; // do not ask the user whether they want to stay or not (as they cannot stay)
        // if the user is viewing the results page we may assume that the game is actually over
        return(currentPage==='page-results'?"Bedankt voor het spelen. Tot de volgende keer!"
                                           :"Het spel is nog niet ten einde. Blijf op de pagina om toch verder te spelen.");
    };
    // if we actually end up in leaving this URL, we definitely want to kill the connection to the server for good
    window.onpopstate=function(){
        // MDH@07FEB2020: it's kinda rude to leave the page in the middle of a game without telling the game engine
        //                I suppose we should handle this differently e.g. by running some sort of ping timer telling the game to be alive
        //                so that the game engine can throw a person out at the right time
        if(currentPlayer&&currentPlayer.game&&currentPlayer.game.state!==PlayerGame.FINISHED)
            console.log("WARNING: Player '"+currentPlayer.name+"' has stopped playing the game any further, effectively canceling it.");
        /* not much use to do anything...
        if(currentPlayer)currentPlayer.exit('EXIT'); // if we haven't done so yet!!!!
        setPlayerName(null,null); // without callback no page should be shown anymore...
        */
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

    if(getCookie('connect.sid')) // supposedly in a registered user session
        for(let stopButton of document.getElementsByClassName('stop'))stopButton.onclick=stopButtonClicked;
    else // no need for stop buttons
        for(let stopButton of document.getElementsByClassName('stop'))stopButton.style.display="none";

    // let's assume that the game is over when new-game buttons are showing
    // we're not to kill the connection, we'll just keep using the same connection
    for(let newGameButton of document.getElementsByClassName("new-game"))newGameButton.onclick=newGameButtonClicked;
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
    // standalone execution i.e. no on exit callback!!!
    if(initialPlayerName&&initialPlayerName.length>0)setPlayerName(initialPlayerName,null);
}

// MDH@08JAN2020: great idea to make everything work by allowing to set the player name
function _setPlayer(player){
    visitedPages=[]; // forget visited pages
    currentPage=null; // ascertain to not have a page to store
    // get rid of the current player (if any), and in effect we'll loose the game as well
    if(currentPlayer){
        currentPlayer.exit('STOP'); // exit the current player from whatever game (s)he has played!!!!
        // no need to change currentPlayer because it's gonna be replaced anyway
        // but will disconnect from the server anyway
        let clientsocket=(currentGame?currentGame._socket:null); // MDH@12FEB2020: the game keeps a reference to the socket
        // disconnect if need be
        (!clientsocket||!clientsocket.connected||clientsocket.disconnect());
        // replacing: currentPlayer.game=null; // get rid of the game (which will disconnect the socket as well) WISHFUL THINKING...
        currentPlayer=null;
        showCurrentPlayerName();
        ///////////if(errorcallback)
        setPage("page-rules"); // MDH@10JAN2020: whenever the currentPlayer is NOT available go to "page-rules"
    }
    // if(errorcallback)setPage("page-rules"); // the page we can show if there's no player!!!! (TODO or page-auth?????)
    if(player){
        let clientsocket=io(location.protocol+'//'+location.host);
        // MDH@09FEB2020: adding all other possible errors we should be handling
        clientsocket.on('connecting',()=>{console.log("Connecting...");});
        clientsocket.on('disconnect',()=>{console.log("Disconnect");});
        clientsocket.on('connect_failed',()=>{console.log("Connect failed...");});
        clientsocket.on('error',(err)=>{console.log("ERROR: "+err.message+".");});
        clientsocket.on('reconnect',()=>{console.log("Reconnect successful!");});
        clientsocket.on('reconnecting',()=>{console.log("Reconnecting...");});
        clientsocket.on('reconnect_failed',()=>{console.log("Reconnecting failed.");});
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
                    // MDH@07FEB2020 removed: if(typeof errorcallback==='function')errorcallback(null);
                }else
                    setInfo("De verbinding is hersteld.","Server");
                // MDH@23JAN2020: push the player name to the server again, so it can resend what needs sending!!!!
                // MDH@13FEB2020: we should be pushing PLAYER identification until we get a response
                if(currentPlayer)registeringPlayerId=setTimeout(registerPlayer,1); // 1 ms delay is sufficient???????
            }else{
                setInfo("De verbinding is verbroken.","Server");
                // MDH@07FEB2020 removed: (typeof errorcallback!=='function'||errorcallback(new Error("Failed to connect to the server.")));
            }
        });
        clientsocket.on('connect_error',(err)=>{
            console.log("Connect error: ",err);
            setInfo("Er is een probleem met de verbinding ("+err.message+")!","Server");
            // (typeof errorcallback!=='function'||errorcallback(err));
        });
        // try to connect to the server catching whatever happens through events
        clientsocket.connect();
    }else{ // no player anymore to play
        currentGame=null; // get rid of the current game (if any)
        (!onExitHandler||onExitHandler());
    }
}

// call setPlayerName with the (new) name of the current player whenever the player wants to play
// call setPlayerName with null (or empty) player name
// to make it callable from anywhere we attach setPlayerName to window (because client.js will be browserified!!!)
function setPlayerName(playerName,donePlayingCallBack){
    (preparedForPlaying||prepareForPlaying()); // prepare for playing once
    onExitHandler=(typeof donePlayingCallback==='function'?donePlayingCallback:null); // register the done playing callback
    // if(errorCallback)setPage("page-rules"); // ascertain to not be in a non-player page
    // playerName needs to be a string (if it is defined)
    if(playerName&&typeof playerName!=="string")return(!onExitHandler||onExitHandler(new Error("Invalid player name.")));
    // if playerName matches the current player's name, nothing to do
    if(playerName&&currentPlayer&&currentPlayer.name===playerName)
        (!onExitHandler||onExitHandler(null));
    else
        _setPlayer(playerName&&playerName.length>0?new OnlinePlayer(playerName):null);
}

window.onload=prepareForPlaying;

// export the two function that we allow to be called from the outside!!!
module.exports=setPlayerName;
},{"./Card.js":1,"./CardHolder.js":2,"./Language.js":3,"./Player.js":4,"./Trick.js":5}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTIuMTMuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9DYXJkLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmRIb2xkZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvTGFuZ3VhZ2UuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvUGxheWVyLmpzIiwicHVibGljL2phdmFzY3JpcHRzL1RyaWNrLmpzIiwicHVibGljL2phdmFzY3JpcHRzL2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGRlZmluaXRpb24gb2YgYSBwbGF5aW5nIENhcmRcbiAqL1xuY2xhc3MgQ2FyZHtcblxuICAgIHN0YXRpYyBnZXQgU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wiZGlhbW9uZFwiLFwiY2x1YlwiLFwiaGVhcnRcIixcInNwYWRlXCJdO31cbiAgICBzdGF0aWMgZ2V0IFJBTktfTkFNRVMoKXtyZXR1cm4gW1wiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcImphY2tcIixcInF1ZWVuXCIsXCJraW5nXCIsXCJhY2VcIl07fVxuICAgIC8vIHNob3J0aGFuZCAnY2hhcmFjdGVycycgZm9yIHRleHR1YWwgcmVwcmVzZW50YXRpb25cbiAgICAvLyBOT1QgV09SS0lORzogY29uc3QgQ0FSRF9TVUlURV9DSEFSQUNURVJTPVtTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjYpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2MyksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY1KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjApXTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWydcXHUyNjY2JywnXFx1MjY2MycsJ1xcdTI2NjUnLCdcXHUyNjYwJ119OyAvLyBZRVMsIFdPUktJTkchISEhIVxuICAgIHN0YXRpYyBnZXQgU1VJVEVfRElBTU9ORCgpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBTVUlURV9DTFVCKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0hFQVJUKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX1NQQURFKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQ0hBUkFDVEVSUygpe3JldHVybiBbJzInLCczJywnNCcsJzUnLCc2JywnNycsJzgnLCc5JywnMTAnLCdCJywnVicsJ0snLCdBJ107fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVFdPKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEhSRUUoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19GT1VSKCl7cmV0dXJuIDI7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRklWRSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX1NJWCgpe3JldHVybiA0O307XG4gICAgc3RhdGljIGdldCBSQU5LX1NFVkVOKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRUlHSFQoKXtyZXR1cm4gNjt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19OSU5FKCl7cmV0dXJuIDc7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfVEVOKCl7cmV0dXJuIDg7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfSkFDSygpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBSQU5LX1FVRUVOKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBSQU5LX0tJTkcoKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfQUNFKCl7cmV0dXJuIDEyO307XG5cbiAgICBzdGF0aWMgY29tcGFyZUNhcmRzKGNhcmQxLGNhcmQyKXtcbiAgICAgICAgbGV0IGRlbHRhU3VpdGU9Y2FyZDEuX2NhcmRTdWl0ZUluZGV4LWNhcmQyLl9jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgaWYoZGVsdGFTdWl0ZSE9MClyZXR1cm4gZGVsdGFTdWl0ZTtcbiAgICAgICAgcmV0dXJuIGNhcmQxLl9jYXJkTmFtZUluZGV4LWNhcmQyLl9jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICBcbiAgICAvLyBpbiBhIHRyaWNrIHRoZSBwbGF5IHN1aXRlIGRldGVybWluZXMgd2hhdCBjYXJkcyBhcmUgdG8gYmUgcGxheWVkLCB0aGUgdHJ1bXAgc3VpdGUgZGV0ZXJtaW5lcyB3aGF0IHRydW1wIGlzXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkMSxjYXJkMixwbGF5U3VpdGUsdHJ1bXBTdWl0ZSl7XG4gICAgICAgIC8vIG5vcm1hbGx5IHdpdGggYW55IHR3byByZWd1bGFyIGNhcmRzIHRoZXkgYXJlIG5ldmVyIGVxdWFsIGluIGEgdHJpY2tcbiAgICAgICAgLy8gY2FyZHMgdGhhdCBhcmUgbmVpdGhlciBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlIGlzIGlycmVsZXZhbnRcbiAgICAgICAgbGV0IHJlc3VsdD0wO1xuICAgICAgICBsZXQgdHlwZT0nLSc7XG4gICAgICAgIC8vIDEuIGlmIGNhcmQxIGlzIHRydW1wLCBhbmQgY2FyZDIgaXMgbm90IG9yIGhhcyBhIGxvd2VyIHJhbmsgY2FyZDEgd2luc1xuICAgICAgICBpZihjYXJkMS5zdWl0ZT09dHJ1bXBTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9dHJ1bXBTdWl0ZT8xOmNhcmQxLnJhbmstY2FyZDIucmFuayk7dHlwZT0nQSc7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQxIGlzIE5PVCB0cnVtcCBidXQgY2FyZDIgY291bGQgc3RpbGwgYmUgdHJ1bXBcbiAgICAgICAgaWYoY2FyZDIuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdCJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHRydW1wLCBzbyBjb3VsZCBiZSBwbGF5IHN1aXRlIG9yIG5vdC4uLlxuICAgICAgICBpZihjYXJkMS5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0MnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBub3QgcGxheSBzdWl0ZSwgYnV0IGNhcmQyIGNvdWxkIGJlXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT1wbGF5U3VpdGUpe3Jlc3VsdD0tMTt0eXBlPSdEJzt9XG4gICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gVHlwZTogJyt0eXBlKyc6ICcrY2FyZDEuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIoc3VpdGU6IFwiK2NhcmQxLnN1aXRlK1wiKVwiKyhyZXN1bHQ+MD8nID4gJzoocmVzdWx0PDA/JyA8ICc6JyA9ICcpKStjYXJkMi5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAoc3VpdGU6IFwiK2NhcmQyLnN1aXRlK1wiKVwiK1wiIChwbGF5OiBcIisocGxheVN1aXRlPj0wP0NhcmQuU1VJVEVfTkFNRVNbcGxheVN1aXRlXTpcIj9cIikrXCIsIHRydW1wOlwiKygodHJ1bXBTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3RydW1wU3VpdGVdOlwiP1wiKSkrXCIpXCIpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIC8vIGxldCdzIGZpcnN0IHJlY29tcHV0ZSB0aGUgc3VpdGUgb2YgYm90aCBjYXJkcyBhbmQgZWxldmF0ZSB0cnVtcCBjYXJkcywgYW5kIGRlZXZhbHVhdGUgbm9uIHBsYXlTdWl0ZSBjYXJkc1xuICAgICAgICBsZXQgY2FyZDFTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDEuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMS5zdWl0ZSkpO1xuICAgICAgICBsZXQgY2FyZDJTdWl0ZT0oY2FyZDEuc3VpdGU9PXRydW1wU3VpdGU/NDooY2FyZDIuc3VpdGUhPXBsYXlTdWl0ZT8tMTpjYXJkMi5zdWl0ZSkpO1xuICAgICAgICBpZihjYXJkMVN1aXRlPj0wfHxjYXJkMlN1aXRlPj0wKXsgLy8gYXQgbGVhc3Qgb25lIG9mIHRoZSBjYXJkcyBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlXG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VpdGVzIGFyZSB0aGUgc2FtZSB0aGUgaGlnaGVzdCByYW5rIHdpbnNcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU8MClyZXR1cm4gLTE7IC8vIGlmIHRoZSBmaXJzdCBjYXJkIGlzIGlycmVsZXZhbnQsIHRoZSBmaXJzdCBjYXJkIGlzIGxvd2VyXG4gICAgICAgICAgICBpZihjYXJkMlN1aXRlPDApcmV0dXJuIDE7IC8vIGlmIHRoZSBzZWNvbmQgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBoaWdoZXJcbiAgICAgICAgICAgIC8vIEFTU0VSVCBib3RoIGNhcmRzIGFyZSBlaXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgaWYoY2FyZDFTdWl0ZT09Y2FyZDJTdWl0ZSlyZXR1cm4gY2FyZDEucmFuay1jYXJkMi5yYW5rO1xuICAgICAgICAgICAgLy8gQVNTRVJUIG9uZSBjYXJkIGlzIHBsYXkgc3VpdGUsIHRoZSBvdGhlciBtdXN0IGJlIHRydW1wIHN1aXRlXG4gICAgICAgICAgICByZXR1cm4oY2FyZDFTdWl0ZT09ND8xOi0xKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICAvLyBBU1NFUlQgbmVpdGhlciBjYXJkIGlzIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGUsIGJvdGggY2FyZHMgYXJlIGlycmVsZXZhbnQgKHNob3VsZCBoYXBwZW4gdGhvdWdoKVxuICAgICAgICByZXR1cm4gMDsgLy8gY29uc2lkZXJlZCBlcXVhbCB0aGF0IGlzIGlycmVsZXZhbnRcbiAgICB9XG4gICAgXG4gICAgLy8gLy8geW91J2QgaGF2ZSB0byB1c2UgdGhlIEFwcGxlIFN5bWJvbHMgZm9udFxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmlPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CsTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4K+PC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgr08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CuzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4K6PC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgrk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CuDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4K3PC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgrY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CtTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4K0PC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgrM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CsjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaM8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4ORPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg548L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DnTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4ObPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg5o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DmTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OYPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg5c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DljwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OVPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg5Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DkzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OSPC9saT5cbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpjwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfg4E8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+DjjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4ONPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfg4s8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+DijwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4OJPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfg4g8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+DhzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4OGPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfg4U8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+DhDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4ODPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfg4I8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+CoTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4KuPC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfgq08L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+CqzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4KqPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfgqk8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+CqDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4KnPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfgqY8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+CpTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4KkPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfgqM8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+CojwvbGk+XG4gICAgc3RhdGljIGdldCBDQVJEX0FQUExFX1NZTUJPTFMoKXtyZXR1cm4gW1xuICAgICAgICBbJ/Cfg4InLCfwn4ODJywn8J+DhCcsJ/Cfg4UnLCfwn4OGJywn8J+DhycsJ/Cfg4gnLCfwn4OJJywn8J+DiicsJ/Cfg4snLCfwn4ONJywn8J+DjicsJ/Cfg4EnXSxcbiAgICAgICAgWyfwn4OSJywn8J+DkycsJ/Cfg5QnLCfwn4OVJywn8J+DlicsJ/Cfg5cnLCfwn4OYJywn8J+DmScsJ/Cfg5onLCfwn4ObJywn8J+DnScsJ/Cfg54nLCfwn4ORJ10sXG4gICAgICAgIFsn8J+CsicsJ/CfgrMnLCfwn4K0Jywn8J+CtScsJ/CfgrYnLCfwn4K3Jywn8J+CuCcsJ/CfgrknLCfwn4K6Jywn8J+CuycsJ/Cfgr0nLCfwn4K+Jywn8J+CsSddLFxuICAgICAgICBbJ/CfgqInLCfwn4KjJywn8J+CpCcsJ/CfgqUnLCfwn4KmJywn8J+CpycsJ/CfgqgnLCfwn4KpJywn8J+CqicsJ/CfgqsnLCfwn4KtJywn8J+CricsJ/CfgqEnXVxuICAgIF19O1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCl7XG4gICAgICAgIHRoaXMuX2NhcmRTdWl0ZUluZGV4PWNhcmRTdWl0ZUluZGV4O1xuICAgICAgICB0aGlzLl9jYXJkTmFtZUluZGV4PWNhcmROYW1lSW5kZXg7XG4gICAgfVxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBDYXJkLlJBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rXCIgb2YgXCIrQ2FyZC5TVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCJzXCI7XG4gICAgfVxuICAgIFxuICAgIGdldCByYW5rKCl7cmV0dXJuIHRoaXMuX2NhcmROYW1lSW5kZXg7fVxuICAgIGdldCBzdWl0ZSgpe3JldHVybiB0aGlzLl9jYXJkU3VpdGVJbmRleDt9XG5cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oKXtcbiAgICAgICAgLy8gaWYgd2UncmUgdXNpbmcgdGhlIHN2Zy1jYXJkcy5zdmcgd2UgY2FuIGRvIHRoZSBmb2xsb3dpbmcsIGJ1dCBpbiB0aGF0IGNhc2Ugd2UnZCBuZWVkIHRvIGtub3cgdGhlIG1hZ25pZmljYXRpb24gZmFjdG9yISEhXG4gICAgICAgIC8vcmV0dXJuIENBUkRfRk9OVF9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy9yZXR1cm4gJzxzdmcgdmlld0JveD1cIjAgMCA2NzYgOTc2XCI+PHVzZSB4bGluazpocmVmPVwiaW1nL3N2Zy1jYXJkcy5zdmcjJytTVUlURV9OQU1FU1t0aGlzLl9jYXJkU3VpdGVJbmRleF0rXCItXCIrUkFOS19OQU1FU1t0aGlzLl9jYXJkTmFtZUluZGV4XSsnPC91c2U+PC9zdmc+JztcbiAgICAgICAgcmV0dXJuIENhcmQuQ0FSRF9BUFBMRV9TWU1CT0xTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XVt0aGlzLl9jYXJkTmFtZUluZGV4XTtcbiAgICAgICAgLy8vLy8vcmV0dXJuIFNVSVRFX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdLmNvbmNhdChSQU5LX0NIQVJBQ1RFUlNbdGhpcy5fY2FyZE5hbWVJbmRleF0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cz1DYXJkOyIsIi8qKlxuICogZGVmaW5lcyBzb21lb25lIHRoYXQgaG9sZHMgY2FyZHNcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcblxuY2xhc3MgQ2FyZEhvbGRlcntcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTURIQDA0REVDMjAxOTogYWxsb3dpbmcgbm93IHRvIGNvbnN0cnVjdCBmaXhlZCBzaXplIGNhcmQgaG9sZGVycyAobGlrZSBUcmljaylcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhcmRzPTApe1xuICAgICAgICB0aGlzLl9jYXJkcz1bXTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZDYXJkcz1udW1iZXJPZkNhcmRzO1xuICAgICAgICB3aGlsZSgtLW51bWJlck9mQ2FyZHM+PTApdGhpcy5fY2FyZHMucHVzaChudWxsKTtcbiAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlO1xuICAgIH1cblxuICAgIC8vIG1ldGhvZHMgdG8gYWRqdXN0IHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBfcmVtb3ZlQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IGNhcmRJbmRleD10aGlzLl9jYXJkcy5pbmRleE9mKGNhcmQpO1xuICAgICAgICBpZihjYXJkSW5kZXg+PTApe1xuICAgICAgICAgICAgaWYodGhpcy5fY2FyZHMuc3BsaWNlKGNhcmRJbmRleCwxKS5sZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIitjYXJkK1wiIHJlbW92ZWQgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiLlwiKTtcbiAgICAgICAgICAgICAgICBjYXJkLl9ob2xkZXI9bnVsbDsgLy8gd2hlbiBzdWNjZXNzZnVsIGFwcGFyZW50bHkgbm8gbG9uZ2VyIGF2YWlsYWJsZSEhIVxuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgYXQgaW5kZXggXCIrY2FyZEluZGV4K1wiIG9mIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHJlbW92ZSBjYXJkIFwiK2NhcmQrXCIgZnJvbSBcIit0aGlzLnRvU3RyaW5nKCkrXCI6IGl0IGlzIG5vdCBwcmVzZW50LlwiKTtcbiAgICB9XG4gICAgX2FkZENhcmQoY2FyZCl7XG4gICAgICAgIGlmKCFjYXJkKXJldHVybjtcbiAgICAgICAgaWYoIShjYXJkIGluc3RhbmNlb2YgSG9sZGFibGVDYXJkKSl0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBob2xkYWJsZSBjYXJkIVwiKTtcbiAgICAgICAgdGhpcy5sb2coXCJBZGRpbmcgY2FyZCBcIitjYXJkLnRvU3RyaW5nKCkrXCIgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICB0aGlzLl9jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICBpZih0aGlzLm51bWJlck9mQ2FyZHM+bnVtYmVyT2ZDYXJkc05vdyl7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9ZmFsc2U7IC8vIGNhbiBubyBsb25nZXIgZ3VhcmFudGVlIHRoYXQgaXQgaXMgc29ydGVkLi4uXG4gICAgICAgICAgICBjYXJkLl9ob2xkZXI9dGhpcztcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQ2FyZCBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgKFwiK2NhcmQudG9TdHJpbmcoKStcIikgYWRkZWQgdG8gXCIrdGhpcy50b1N0cmluZygpK1wiLlwiKTtcbiAgICAgICAgICAgIC8vIGhvdyBhYm91dCBvcmRlcmluZyB0aGUgY2FyZHM/Pz8/Pz8gb3Igc3RvcmluZyB0aGVtIGJ5IHN1aXRlPz8/P1xuICAgICAgICAgICAgdGhpcy5sb2coXCJcXHRDYXJkIGNvbGxlY3Rpb246IFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBhZGQgY2FyZCBcIitjYXJkK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIiAoZGVsdGEgbnVtYmVyIG9mIGNhcmRzOiBcIisodGhpcy5udW1iZXJPZkNhcmRzLW51bWJlck9mQ2FyZHNOb3cpK1wiKS5cIik7XG4gICAgfVxuICAgIC8qXG4gICAgLy8gcmVwbGFjZSBhIGNhcmQgYXQgYSBnaXZlbiBpbmRleCAoYXMgdXNlZCBpbiBUcmljaylcbiAgICBfc2V0Q2FyZEF0SW5kZXgoY2FyZCxpbmRleCl7XG4gICAgICAgIGlmKGluZGV4PDB8fGluZGV4Pj10aGlzLm51bWJlck9mQ2FyZHMpdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVwbGFjZSBjYXJkICNcIitTdHJpbmcoaW5kZXgrMSkrXCIuXCIpO1xuICAgICAgICBsZXQgY2FyZEF0SW5kZXg9dGhpcy5fY2FyZHNbaW5kZXhdO1xuICAgICAgICBpZihjYXJkQXRJbmRleCl7Y2FyZEF0SW5kZXguX2hvbGRlcj1udWxsO3RoaXMuX2NhcmRzW2luZGV4XT1udWxsO31cbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBpZiAnY29udGFpbmVkJyBpbiBhbm90aGVyIGNhcmQgaG9sZGVyIHJlbW92ZSBpdCBmcm9tIHRoZXJlISEhXG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgaWYoY2FyZC5faG9sZGVyKWNhcmQuX2hvbGRlci5yZW1vdmVDYXJkKGNhcmQpO1xuICAgICAgICAgICAgICAgIGlmKCFjYXJkLl9ob2xkZXIpe3RoaXMuX2NhcmRzW2luZGV4XT1jYXJkO2NhcmQuX2hvbGRlcj10aGlzO30gICAgXG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe31cbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIC8vIHBvbGwgdGhlIGNhcmQgY29sbGVjdGlvblxuICAgIGdldCBudW1iZXJPZkNhcmRzKCl7cmV0dXJuIHRoaXMuX2NhcmRzLmxlbmd0aDt9XG5cbiAgICBnZXRDYXJkc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnJhbms9PXJhbms7fSk7XG4gICAgfVxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShzdWl0ZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuIGNhcmQuc3VpdGU9PXN1aXRlO30pLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50XG4gICAgICovXG4gICAgZ2V0U3VpdGVzKCl7XG4gICAgICAgIC8vIGNhbid0IHVzZSB0aGlzIGluIGZpbHRlciEhISByZXR1cm4gWzAsMSwyLDNdLmZpbHRlcigocmFuayk9PntyZXR1cm4gdGhpcy5nZXRDYXJkc1dpdGhSYW5rKHJhbmspPjA7fSk7XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57aWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGNhcmRzIGluIHRoZSBob2xkZXIgd2l0aCB0aGUgZ2l2ZW4gcmFua1xuICAgICAqIEBwYXJhbSB7Kn0gcmFuayBcbiAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhSYW5rKHJhbmspe1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGFsbCBzdWl0ZXMsIHdpdGggLTEgd2hlcmUgYSBzdWl0ZSBpcyBub3QgcHJlc2VudCBpbiB0aGUgY3VycmVudCBjYXJkcyBcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgICovXG4gICAgZ2V0U3VpdGVzV2l0aG91dFJhbmsocmFuayl7XG4gICAgICAgIC8vIGFoIHRoaXMgaXMgYW4gaXNzdWUsIGJlY2F1c2UgaWYgeW91IGRvIG5vdCBoYXZlIGEgY2VydGFpbiBzdWl0ZSB0aGUgc3VpdGUgc2hvdWxkIE5PVCBiZSByZXR1cm5lZCEhISEhXG4gICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IEJVVCB3ZSB3YW50IHRvIGtub3cgYWxsIHRoZSBzdWl0ZXMgb2Ygd2hpY2ggdGhlIHBsYXllciBkb2VzIG5vdCBoYXZlIHRoZSBnaXZlbiByYW5rXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpbmNsdWRpbmcgb2YgdGhvc2Ugc3VpdGVzIGEgcGxheWVyIGRvZXMgTk9UIGhhdmVcbiAgICAgICAgLyogTURIQDAzRkVCMjAyMCByZXBsYWNpbmc6XG4gICAgICAgIGxldCBzdWl0ZXM9W107XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57XG4gICAgICAgICAgICBpZihzdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpOyAvLyBpZiBzdWl0ZSBub3QgcHJlc2VudCB5ZXQsIGFkZCBpdCB0byBzdWl0ZXNcbiAgICAgICAgICAgIGlmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzW2NhcmQuc3VpdGVdPS0xOyAvLyBub3QgcmVtb3ZpbmcgaXQgYnV0IHNldHRpbmcgdG8gLTEgaWYgd2UgbG9jYXRlIHRoZSByYW5rXG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgIGxldCBzdWl0ZXM9Wy0xLC0xLC0xLC0xXTsgLy8gTURIQDA1RkVCMjAyMDogd2lsbCByZXR1cm4gLTE6IHBsYXllciBkb2Vzbid0IGhhdmUgY2FyZCwgMD1wbGF5ZXIgaGFzIHJhbmssIDEgZG9lcyBOT1QgaGF2ZSByYW5rXG4gICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntcbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIGZvbGxvd2luZyBjYW4gb25seSBoYXBwZW4gb25jZSAoZm9yIGVhY2ggc3VpdGUpLCB3ZSBjYW4gc2FmZWx5IGFzc3VtZSB0aGF0IHRoZSBzdWl0ZSBpcyB0aGVyZSEhISFcbiAgICAgICAgICAgIGlmKHN1aXRlc1tjYXJkLnN1aXRlXTwwKXN1aXRlc1tjYXJkLnN1aXRlXT0xOyAvLyB0aGUgc3VpdGUgaXMgdGhlcmVcbiAgICAgICAgICAgIGlmKGNhcmQucmFuaz09PXJhbmspc3VpdGVzW2NhcmQuc3VpdGVdPTA7IC8vIHdlIGZvdW5kIHRoZSBjYXJkIGluIGNhcmQuc3VpdGUgd2l0aCB0aGUgcmFuayBwYXNzZWQgaW4hISFcbiAgICAgICB9KTtcbiAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBpZHMgb2YgdGhlIHN1aXRlcyBwcmVzZW50IG9mIHdoaWNoIHRoZSBwbGF5ZXIgZG9lcyBub3QgaGF2ZSB0aGUgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBnZXRSYW5rbGVzc1N1aXRlcyhyYW5rKXtcbiAgICAgICAgbGV0IHJhbmtsZXNzU3VpdGVzPVtdO1xuICAgICAgICBsZXQgc3VpdGVzV2l0aFJhbmtzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGNhcmQpPT57XG4gICAgICAgICAgICAgICAgaWYocmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTwwJiZzdWl0ZXNXaXRoUmFua3MuaW5kZXhPZihjYXJkLnN1aXRlKTwwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5jYXJkTmFtZUluZGV4PT1yYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1aXRlc1dpdGhSYW5rcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBzdWl0ZSBpZiBhbHJlYWR5IHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW5rbGVzc1N1aXRlSW5kZXg9cmFua2xlc3NTdWl0ZXMuaW5kZXhPZihjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVJbmRleD49MClyYW5rbGVzc1N1aXRlcy5zcGxpY2UocmFua2xlc3NTdWl0ZUluZGV4LDEpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSAvLyB1bnRpbCBwcm92ZW4gZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmtsZXNzU3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmFua2xlc3NTdWl0ZXM7XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzWzBdO31cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHVzZWQgaW4gZ2FtZWVuZ2luZS5qc1xuICAgIGdldExhc3RDYXJkKCl7aWYodGhpcy5fY2FyZHMubGVuZ3RoPjApcmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRzLmxlbmd0aC0xXTt9XG5cbiAgICBjb250YWluc0NhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkPXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkPj0wJiYodGhpcy5fY2FyZHNbY2FyZF0uc3VpdGUhPT1zdWl0ZXx8dGhpcy5fY2FyZHNbY2FyZF0ucmFuayE9PXJhbmspKTtcbiAgICAgICAgcmV0dXJuKGNhcmQ+PTApOyAvLyBmb3VuZCBpZiBjYXJkIGlzIG5vdCBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8vIE1ESEAxM0pBTjIwMjA6IHdlIG5lZWQgdGhpcyB0byBmaW5kIGEgc3BlY2lmaWMgY2FyZFxuICAgIGdldENhcmQoc3VpdGUscmFuayl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSgtLWNhcmRJbmRleD49MCl7bGV0IGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtpZihjYXJkLnN1aXRlPT09c3VpdGUmJmNhcmQucmFuaz09PXJhbmspcmV0dXJuIGNhcmQ7fVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYW4gZXhwb3NlIGEgdGV4dCByZXByZXNlbnRpb25cbiAgICAgKi9cbiAgICBnZXRUZXh0UmVwcmVzZW50YXRpb24oc3VpdGVTZXBhcmF0b3Ipe1xuICAgICAgICB0aGlzLmxvZyhcIk51bWJlciBvZiBjYXJkcyB0byByZXByZXNlbnQ6IFwiK3RoaXMuX2NhcmRzLmxlbmd0aCtcIi5cIik7XG4gICAgICAgIC8vIGhvdyBhYm91dCBzb3J0aW5nPz8/Pz8/Pz8gdGhhdCB3b3VsZCBiZSBuaWNlXG4gICAgICAgIGlmKHN1aXRlU2VwYXJhdG9yJiZ0eXBlb2Ygc3VpdGVTZXBhcmF0b3I9PT1cInN0cmluZ1wiJiYhdGhpcy5fc29ydGVkKXtcbiAgICAgICAgICAgIHRoaXMuX2NhcmRzLnNvcnQoY29tcGFyZUNhcmRzKTtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRlZD10cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLl9zb3J0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMubWFwKChjYXJkKT0+e3JldHVybiBjYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO30pLmpvaW4oXCIgXCIpO1xuICAgICAgICAvLyBjYXJkcyBhcmUgc3VwcG9zZWQgdG8gYmUgc29ydGVkXG4gICAgICAgIGxldCB0ZXh0UmVwcmVzZW50YXRpb249XCJcIjtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgbGV0IGNhcmQ9dGhpcy5nZXRGaXJzdENhcmQoKTtcbiAgICAgICAgICAgIHRleHRSZXByZXNlbnRhdGlvbj1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgZm9yKGxldCBjYXJkSW5kZXg9MTtjYXJkSW5kZXg8dGhpcy5udW1iZXJPZkNhcmRzO2NhcmRJbmRleCsrKXtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPShjYXJkLnN1aXRlIT10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlP3N1aXRlU2VwYXJhdG9yOlwiIFwiKTtcbiAgICAgICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb24rPXRoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2FyZD10aGlzLl9jYXJkc1tjYXJkSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0UmVwcmVzZW50YXRpb247IC8vIGEgc2luZ2xlIGJsYW5rIGJldHdlZW4gdGhlbSEhIVxuICAgIH1cblxufVxuXG4vKipcbiAqIGEgY2FyZCB3aXRoIGEgY2FyZCBob2xkZXIgaXMgaGVsZFxuICovXG5jbGFzcyBIb2xkYWJsZUNhcmQgZXh0ZW5kcyBDYXJke1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJIT0xEQUJMRUNBUkQgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG5cbiAgICBzZXQgaG9sZGVyKGhvbGRlcil7XG4gICAgICAgIHRoaXMubG9nKFwiQ2hhbmdpbmcgdGhlIGhvbGRlciBvZiBjYXJkIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBjdXJyZW50IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZih0aGlzLl9ob2xkZXIpdGhpcy5faG9sZGVyLl9yZW1vdmVDYXJkKHRoaXMpO1xuICAgICAgICAvLyBhZGQgKHdoZW4gc3VjY2Vzc2Z1bGx5IHJlbW92ZWQpIHRvIHRoZSBuZXcgaG9sZGVyIChpZiBhbnkpXG4gICAgICAgIGlmKCF0aGlzLl9ob2xkZXImJmhvbGRlcilob2xkZXIuX2FkZENhcmQodGhpcyk7ZWxzZSB0aGlzLmxvZyhcIkVSUk9SOiBVbmFibGUgdG8gY2hhbmdlIHRoZSBob2xkZXIhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgsaG9sZGVyKXtcbiAgICAgICAgc3VwZXIoY2FyZFN1aXRlSW5kZXgsY2FyZE5hbWVJbmRleCk7XG4gICAgICAgIHRoaXMuX2hvbGRlcj1udWxsO1xuICAgICAgICB0aGlzLmhvbGRlcj1ob2xkZXI7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtyZXR1cm4gXCJIb2xkYWJsZSBcIitzdXBlci50b1N0cmluZygpO31cblxufVxuXG5tb2R1bGUuZXhwb3J0cz17Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9OyIsIi8vIE1ESEAzMUpBTjIwMjA6IEknbGwgYmUgbmVlZGluZyB0aGlzIGJvdGggY2xpZW50LXNpZGUgYW5kIHNlcnZlci1zaWRlXG4vLyAgICAgICAgICAgICAgICBjbGllbnQtc2lkZSBpdCdzIGVtYmVkZGVkIGluIGdhbWVwbGF5aW5nLmpzICh0aGUgYnJvd3NlcmlmaWVkIHZlcnNpb24gb2YgY2xpZW50LmpzKVxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG5cbm1vZHVsZS5leHBvcnRzPUxhbmd1YWdlOyIsIi8qKlxuICogYSBwbGFjZWhvbGRlciBmb3IgYSBwbGF5ZXJcbiAqL1xuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5cbi8qKlxuICogYSBQbGF5ZXIgY2FuIG1ha2UgYSBiaWQsIG9yIHBsYXkgYSBjYXJkLCBjaG9vc2UgYSB0cnVtcCBhbmQgcGFydG5lciBzdWl0ZVxuICovXG5jbGFzcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIGJpZE1hZGUoYmlkKXt9XG4gICAgY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXt9XG4gICAgdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXt9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7fVxufVxuXG4vLyBNREhAMDdERUMyMDE5OiBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lciB3aXRoIGdhbWUgZGF0YSBleHBvc2VkIHRvIHBsYXllclxuLy8gICAgICAgICAgICAgICAgd2hpY2ggd2FzIGVhcmxpZXIgc3RvcmVkIGluIGVhY2ggdHJpY2tcbmNsYXNzIFBsYXllckdhbWUgZXh0ZW5kcyBQbGF5ZXJFdmVudExpc3RlbmVye1xuICAgIHN0YXRpYyBnZXQgQklEX05BTUVTKCl7cmV0dXJuIFtcInBhc1wiLFwicmlrXCIsXCJyaWsgKGJldGVyKVwiLFwibmVnZW4gYWxsZWVuXCIsXCJuZWdlbiBhbGxlZW4gKGJldGVyKVwiLFwicGljb1wiLFwidGllbiBhbGxlZW5cIixcInRpZW4gYWxsZWVuIChiZXRlcilcIixcImVsZiBhbGxlZW5cIixcImVsZiBhbGxlZW4gKGJldGVyKVwiLFwibWlzXFx4ZThyZVwiLFwidHdhYWxmIGFsbGVlblwiLFwidHdhYWxmIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmVcIixcImRlcnRpZW4gYWxsZWVuXCIsXCJkZXJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJvcGVuIG1pc1xceGU4cmUgbWV0IGVlbiBwcmFhdGplXCIsXCJ0cm9lbGFcIixcIm9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZ1wiLFwib20gZGUgbGFhdHN0ZSBzbGFnXCJdO307XG4gICAgc3RhdGljIGdldCBCSURfUEFTKCl7cmV0dXJuIDA7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUsoKXtyZXR1cm4gMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1JJS19CRVRFUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOKCl7cmV0dXJuIDM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ORUdFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BJQ08oKXtyZXR1cm4gNTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RJRU5fQUxMRUVOKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTl9CRVRFUigpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBCSURfRUxGX0FMTEVFTl9CRVRFUigpe3JldHVybiA5O307XG4gICAgc3RhdGljIGdldCBCSURfTUlTRVJFKCl7cmV0dXJuIDEwO307XG4gICAgc3RhdGljIGdldCBCSURfVFdBQUxGX0FMTEVFTigpe3JldHVybiAxMTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTI7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRSgpe3JldHVybiAxMzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOKCl7cmV0dXJuIDE0O307XG4gICAgc3RhdGljIGdldCBCSURfREVSVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gMTU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkUoKXtyZXR1cm4gMTY7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UUk9FTEEoKXtyZXR1cm4gMTc7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUdfRU5fU0NIT1BQRU5fVlJPVVcoKXtyZXR1cm4gMTg7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9MQUFUU1RFX1NMQUcoKXtyZXR1cm4gMTk7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRFNfQUxMX0NBTl9QTEFZKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9QSUNPLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFLFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRV07fTsgLy8gdHJ1bXBsZXNzIGdhbWVzXG4gICAgc3RhdGljIGdldCBCSURTX1dJVEhfUEFSVE5FUl9JTl9IRUFSVFMoKXtyZXR1cm4gW1BsYXllckdhbWUuQklEX1JJS19CRVRFUixQbGF5ZXJHYW1lLkJJRF9USUVOX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX1RXQUFMRl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfREVSVElFTl9BTExFRU5fQkVURVJdO307IC8vIGdhbWVzIHdpdGggdHJ1bXAgcGxheWVkIHdpdGggYSBwYXJ0bmVyXG4gICAgc3RhdGljIGdldCBCSURfUkFOS1MoKXtyZXR1cm4gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDAsLTEsLTFdO307IC8vIGhvdyBJIHBsYXllZCBpdCAoYmlkIHBhc3MgZXhjbHVkZWQgKGFsd2F5cyByYW5rIDApKVxuICAgIFxuICAgIC8vIGVhY2ggYmlkIGhhcyBhIGNlcnRhaW4gYW1vdW50IG9mIHBvaW50cyB0byByZWNlaXZlIHdoZW4gd2lubmluZyB0aGUgZ2FtZVxuICAgIHN0YXRpYyBnZXQgQklEX1BPSU5UUygpe3JldHVybiBbMCwxLDEsMywzLDQsNCw0LDUsNSw1LDYsNiw2LDcsNywxMCwyLDIsMl07fVxuXG4gICAgLy8gdGhlIHN0YXRlIGNvbnN0YW50cyB3ZSBoYXZlXG4gICAgc3RhdGljIGdldCBPVVRfT0ZfT1JERVIoKXtyZXR1cm4gMDt9XG4gICAgc3RhdGljIGdldCBJRExFKCl7cmV0dXJuIDE7fVxuICAgIHN0YXRpYyBnZXQgREVBTElORygpe3JldHVybiAyO31cbiAgICBzdGF0aWMgZ2V0IEJJRERJTkcoKXtyZXR1cm4gMzt9XG4gICAgc3RhdGljIGdldCBQTEFZSU5HKCl7cmV0dXJuIDQ7fVxuICAgIHN0YXRpYyBnZXQgQ0FOQ0VMSU5HKCl7cmV0dXJuIDU7fVxuICAgIHN0YXRpYyBnZXQgRklOSVNIRUQoKXtyZXR1cm4gNjt9XG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclJhbmsoKXt9XG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXt9XG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXIpe31cbiAgICBnZXRQYXJ0bmVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXRIaWdoZXN0QmlkZGVycygpe31cbiAgICBnZXRIaWdoZXN0QmlkKCl7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllcil7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe31cbiAgICBnZXQgcG9pbnRzKCl7fVxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXIsb3RoZXJQbGF5ZXIpe31cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NQbGF5ZWQoKXt9XG4gICAgZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldFRlYW1OYW1lKHBsYXllcil7fVxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXt9XG4gICAgX2Fza1BsYXllckZvckJpZCgpe31cbiAgICBfYXNrUGxheWVyRm9yVHJ1bXBTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yUGFydG5lclN1aXRlKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JDYXJkKCl7fVxuICAgIF9jYXJkUGxheWVkQWNjZXB0ZWQoKXt9IC8vIE1ESEAyM0pBTjIwMjA6IHRoZSBlbXB0eSBtZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gYSBjYXJkIHdhcyBwbGF5ZWQgc3VjY2Vzc2Z1bGx5XG59XG5cbmNvbnN0IENIT0lDRV9JRFM9W1wiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiXTtcblxuY29uc3QgUExBWUVSVFlQRV9GT089MCxQTEFZRVJUWVBFX1VOS05PV049MSxQTEFZRVJUWVBFX0ZSSUVORD0yO1xuXG4vLyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgUGxheWVyIGluc3RhbmNlc1xuLy8gd291bGQgYmUgZGVmaW5lZCBhYnN0cmFjdCBpbiBjbGFzc2ljYWwgT09cbmNsYXNzIFBsYXllciBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlBMQVlFUiA+Pj4gXCIrdG9sb2cpO1xuICAgIH1cbiAgICBcbiAgICBhZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyJiZwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzLnB1c2gocGxheWVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGV2ZW50IGxpc3RlbmVyczogXCIrdGhpcy5fZXZlbnRMaXN0ZW5lcnMrXCIuXCIpO1xuICAgIH1cblxuICAgIC8vIHdoZW5ldmVyIGEgZ2FtZSBpcyBzdGFydGVkLCBjYWxsIG5ld0dhbWUhIVxuICAgIG5ld0dhbWUoKXtcbiAgICAgICAgaWYodGhpcy5faW5kZXg8MHx8IXRoaXMuX2dhbWUpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIHZvb3IgdGUgYmVyZWlkZW4gb20gdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHM9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICBpZihudW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gYmV0dGVyIGRvbmUgdGhpcyB3YXkgaW5zdGVhZCBvZiB0aGlzLl9jYXJkcz1bXVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIk5vZyBcIitudW1iZXJPZkNhcmRzK1wiIGthYXJ0ZW4gaW4gZGUgaGFuZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVmYXVsdCBwbGF5ZXIgcmVtZW1iZXJpbmcgaXRzIGNob2ljZXNcbiAgICAgICAgdGhpcy5fYmlkPS0xOyAvLyB0aGUgbGFzdCBiaWQgb2YgdGhpcyBwbGF5ZXJcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9jYXJkPW51bGw7XG4gICAgICAgIC8vIHRoZSBnYW1lIGJlaW5nIHBsYXllZCwgYW5kIHRoZSBpbmRleCB3aXRoaW4gdGhhdCBnYW1lXG4gICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbj1bXTsgLy8gdGhlIHRyaWNrcyB3b24gKGluIGFueSBnYW1lKVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPS0xOyAvLyBkb2Vzbid0IG1hdHRlclxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG5hbWUscGxheWVyRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX25hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnM9W107XG4gICAgICAgIGlmKHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICAgICAgaWYoIShwbGF5ZXJFdmVudExpc3RlbmVyIGluc3RhbmNlb2YgUGxheWVyRXZlbnRMaXN0ZW5lcikpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIGV2ZW50IGxpc3RlbmVyIG9mIHdyb25nIHR5cGUuXCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdhaXQgZm9yIHJlY2VpdmluZyBnYW1lIGFuZCBpbmRleFxuICAgICAgICB0aGlzLl9pbmRleD0tMTt0aGlzLl9nYW1lPW51bGw7IC8vIHdhaXRpbmcgZm9yIHRoZSBnYW1lIHRvIGJlIHBsdWdnZWQgaW4gKG9uY2UpXG4gICAgICAgIC8vIHJlbW92ZWQgd2FpdCB1bnRpbCBnZXR0aW5nIGNhbGxlZCB0aHJvdWdoIG5ld0dhbWU6IHRoaXMuX3ByZXBhcmVGb3JQbGF5aW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIC8vIGdldHRlcnMgZXhwb3NpbmcgaW5mb3JtYXRpb24gdG8gdGhlIG1hZGUgY2hvaWNlXG4gICAgLy8gTk9URSBubyBsb25nZXIgY2FsbGVkIGJ5IHRoZSBnYW1lIGJlY2F1c2UgdGhlIGNob2ljZSBpcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQgbm93XG4gICAgLy8gICAgICB0aGlzIHdheSBzdWJjbGFzc2VzIGFyZSBub3Qgb2JsaWdhdGVkIHRvIHJlbWVtYmVyIHRoZSBjaG9pY2VzIHRoZXkgbWFrZVxuICAgIGdldCBiaWQoKXtyZXR1cm4gdGhpcy5fYmlkO31cbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgZ2V0IGNhcmQoKXtyZXR1cm4gdGhpcy5jYXJkKCk7fVxuXG4gICAgZ2V0IHBhcnRuZXIoKXtyZXR1cm4gdGhpcy5fcGFydG5lcjt9XG5cbiAgICAvLy8vLy8vLy8vLy8vL2dldCBjYXJkKCl7cmV0dXJuIHRoaXMuX2NhcmRzW3RoaXMuX2NhcmRQbGF5SW5kZXhdO31cblxuICAgIC8qIGNhbiBiZSBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIGdhbWVcbiAgICAvLyBjYW4gYmUgc2V0IGRpcmVjdGx5IHdoZW4gYSBiZXR0ZXIgJ3JpaycgdmFyaWF0aW9uIGJpZCB3YXMgZG9uZSEhISFcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBcbiAgICAvLyBUT0RPIGl0IHdvdWxkIGJlIGVhc2llciB0byBjb21iaW5lIHRoZXNlIGluIGEgY2FyZCEhISFcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cblxuICAgIC8vIGNhbGxlZCBmcm9tIHRoZSBVSSB0byBzZXQgdGhlIHRydW1wIHN1aXRlISEhIVxuICAgIHNldCB0cnVtcFN1aXRlKHRydW1wU3VpdGUpe3RoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTt0aGlzLnRydW1wU3VpdGVDaG9zZW4oKTt9XG4gICAgc2V0IHBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpe3RoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5wYXJ0bmVyU3VpdGVDaG9zZW4oKTt9XG4gICAgKi9cblxuICAgIC8vIGVuZCBvZiBnZXR0ZXJzL3NldHRlcnMgdXNlZCBieSB0aGUgZ2FtZVxuICAgIF9yZW1vdmVDYXJkcygpe3doaWxlKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXRoaXMuX2NhcmRzLnNoaWZ0KCkuaG9sZGVyPW51bGw7fVxuXG4gICAgZ2V0IGdhbWUoKXtyZXR1cm4gdGhpcy5fZ2FtZTt9XG4gICAgc2V0IGdhbWUoZ2FtZSl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUhPT1nYW1lKXtcblxuICAgICAgICB9XG4gICAgICAgIGlmKGdhbWUmJiEoZ2FtZSBpbnN0YW5jZW9mIFBsYXllckdhbWUpKXJldHVybiBuZXcgRXJyb3IoXCJTcGVsIG5pZXQgdmFuIGhldCBqdWlzdGUgdHlwZS5cIik7XG4gICAgICAgIGlmKGdhbWUpaWYodGhpcy5faW5kZXg8MClyZXR1cm4gbmV3IEVycm9yKFwiUG9zaXRpZSB2YW4gc3BlbGVyIG9uYmVrZW5kLlwiKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQ2FyZHMoKTsgLy8gTURIQDExSkFOMjAyMDogaWYgdGhlIGdhbWUgY2hhbmdlcyB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBjYXJkc1xuICAgICAgICB0aGlzLl9nYW1lPWdhbWU7XG4gICAgICAgIC8vIHN5bmMgX2luZGV4XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIG9uIVwiKTtcbiAgICAgICAgICAgIC8vIHByZXBhcmUgZm9yIHBsYXlpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMucGFydG5lcj0tMTsgLy8gbXkgcGFydG5lciAob25jZSBJIG5vdyB3aG8gaXQgaXMpXG4gICAgICAgICAgICB0aGlzLnRyaWNrc1dvbj1bXTsgLy8gc3RvcmluZyB0aGUgdHJpY2tzIHdvblxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIG92ZXIhXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgaW5kZXgoKXtyZXR1cm4gdGhpcy5faW5kZXg7fSAvLyBNREhAMjJKQU4yMDIwOiBubyBoYXJtIGluIGFkZGluZyBhIGdldHRlciEhIVxuICAgIHNldCBpbmRleChpbmRleCl7dGhpcy5faW5kZXg9aW5kZXg7fSAvLyBNREhAMDlKQU4yMDIwOiBzb21ldGltZXMgYW4gaW5kZXggY2FuIGJlIHNldCBzZXBhcmF0ZWx5XG5cbiAgICBwbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIHRoZSBnYW1lIHBsYXllZCBhdCBpbmRleCBcIitpbmRleCtcIi5cIik7XG4gICAgICAgIHRoaXMuaW5kZXg9aW5kZXg7XG4gICAgICAgIHRoaXMuZ2FtZT1nYW1lO1xuICAgIH1cbiAgICAvKlxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIHN1cGVyLmFkZENhcmQoY2FyZCk7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzK1wiJyByZWNlaXZlZCBjYXJkICdcIitjYXJkK1wiJy5cIik7XG4gICAgfVxuICAgICovXG4gICAgX2dldENhcmRzT2ZTdWl0ZShjYXJkU3VpdGUsd2hlbk5vdEZvdW5kQ2FyZCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4oY2FyZC5zdWl0ZT09Y2FyZFN1aXRlKTt9KTtcbiAgICB9XG5cbiAgICBfZ2V0U3VpdGVDYXJkcygpe1xuICAgICAgICB0aGlzLmxvZyhcIkRldGVybWluaW5nIHN1aXRlIGNhcmRzIG9mIFwiK3RoaXMubnVtYmVyT2ZDYXJkcytcIiBjYXJkcyFcIik7XG4gICAgICAgIGxldCBzdWl0ZUNhcmRzPVtbXSxbXSxbXSxbXV07XG4gICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57c3VpdGVDYXJkc1tjYXJkLnN1aXRlXS5wdXNoKGNhcmQpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVDYXJkcztcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgb2YgYSBnaXZlbiBjYXJkIHN1aXRlIChvciBhbnkgY2FyZCBpZiBjYXJkU3VpdGUgaXMgdW5kZWZpbmVkKVxuICAgIGNvbnRyaWJ1dGVUb1RyaWNrKHRyaWNrKSB7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD09MClyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBrYWFydGVuIG1lZXIgb20gdGUgc3BlbGVuIVwiKTtcbiAgICAgICAgbGV0IGNhcmRzT2ZTdWl0ZT10aGlzLl9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlKTtcbiAgICAgICAgbGV0IGNhcmQ9KGNhcmRzT2ZTdWl0ZSYmY2FyZHNPZlN1aXRlLmxlbmd0aD4wP2NhcmRzT2ZTdWl0ZVswXTp0aGlzLl9jYXJkc1swXSk7XG4gICAgICAgIGNhcmQuaG9sZGVyPXRyaWNrOyAvLyBtb3ZlIHRoZSBjYXJkIHRvIHRoZSB0cmlja1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNREg6IGFsbCBtZXRob2RzIHRoYXQgZGVhbCB3aXRoIHByb2Nlc3NpbmcgYSBiaWQsIGEgY2FyZCwgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBjaG9pY2VcbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIG1hZGUgYSBiaWRcbiAgICBfYmlkTWFkZShiaWQpe1xuICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzcGVsIG9tIGluIHRlIGJpZWRlbiFcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2luZyBiaWQgXCIrYmlkK1wiIG9mIHBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyB0byB0aGUgZ2FtZSFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLmJpZE1hZGUoYmlkKTtcbiAgICB9XG4gICAgLy8gTURIQDI2SkFOMjAyMDogcmV0dXJuaW5nIHRydWUgb24gc3VjY2VzcyAod2hlbiBfYmlkTWFkZSBkaWQgbm90IHJldHVybiBhbiBlcnJvcilcbiAgICBfc2V0QmlkKGJpZCl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9iaWRNYWRlKGJpZCk7XG4gICAgICAgIGlmKGVycm9yJiZlcnJvciE9PXRydWUpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9iaWQ9YmlkO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXsoIWV2ZW50TGlzdGVuZXJ8fGV2ZW50TGlzdGVuZXIuYmlkTWFkZSh0aGlzLl9iaWQpKTt9Y2F0Y2goZXJyb3Ipe319KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gY2FyZFBsYXllZCBpbiBSaWtrZW5UaGVHYW1lIGNhbiBub3cgcmV0dXJuIGFuIGVycm9yIChpbnN0ZWFkIG9mIHRocm93aW5nIG9uZSlcbiAgICBfY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4ga2FhcnQgaW4gdGUgc3BlbGVuIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUuY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICB9XG4gICAgLy8gVE9ETyBhIGJpZCBzZXR0ZXIgd2lsbCBhbGxvdyBzdWJjbGFzc2VzIHRvIHBhc3MgYSBiaWQgYnkgc2V0dGluZyB0aGUgcHJvcGVydHlcbiAgICBfc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgLy8gdGVjaG5pY2FsbHkgY2hlY2tpbmcgd2hldGhlciB0aGUgcGxheWVkIGNhcmQgaXMgdmFsaWQgc2hvdWxkIGJlIGRvbmUgaGVyZSwgb3IgQkVGT1JFIGNhbGxpbmcgc2V0Q2FyZFxuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9jYXJkPWNhcmQ7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIuY2FyZFBsYXllZCh0aGlzLl9jYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTt9Y2F0Y2goZXJyb3Ipe307fSk7XG4gICAgfVxuXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBjaG9vc2VuIGEgdHJ1bXAgc3VpdGVcbiAgICBfdHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4gdHJvZWZrbGV1ciBpbiB0ZSBraWV6ZW4hXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS50cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX3RydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT10cnVtcFN1aXRlO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnRydW1wU3VpdGVDaG9zZW4odGhpcy5fdHJ1bXBTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvc2VuIGEgcGFydG5lclxuICAgIF9wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBlZW4gcGFydG5lciAoa2FhcnRrbGV1cikgdGUga2llemVuLlwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUucGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSk7XG4gICAgfVxuICAgIF9zZXRQYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX3BhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdGVuZXJzKXRoaXMuX2V2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpPT57dHJ5e2V2ZW50TGlzdGVuZXIucGFydG5lclN1aXRlQ2hvc2VuKHRoaXMuX3BhcnRuZXJTdWl0ZSk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIGNhbiBiZSBhc2tlZCB0byBtYWtlIGEgYmlkIHBhc3NpbmcgaW4gdGhlIGhpZ2hlc3QgYmlkIHNvIGZhclxuICAgIC8vIE5PVEUgdGhpcyB3b3VsZCBiZSBhbiAnYWJzdHJhY3QnIG1ldGhvZCBpbiBjbGFzc2ljYWwgT09cbiAgICBtYWtlQUJpZChwbGF5ZXJiaWRzKXtcbiAgICAgICAgLy8gYXNzdW1lcyB0aGF0IHRoaXMgcGxheWVyIGhhcyBtYWRlIGEgYmlkIGJlZm9yZSwgb3IgdGhhdCB0aGlzIGlzIHRoZSBmaXJzdCBiaWRcbiAgICAgICAgLy8gdGhpcyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdG8gYmUgcnVubmluZyBpbiBhIGJyb3dzZXIgc28gd2UgY2FuIHVzZSBwcm9tcHQoKVxuICAgICAgICAvLyBhbGwgb3RoZXIgYXZhaWxhYmxlIGJpZHMgc2hvdWxkIGJlIGJldHRlciB0aGFuIHRoZSBsYXN0IGJpZCBieSBhbnkgb3RoZXIgcGxheWVyXG4gICAgICAgIGxldCBoaWdoZXN0QmlkU29GYXI9UGxheWVyR2FtZS5CSURfUEFTO1xuICAgICAgICBpZihwbGF5ZXJiaWRzKXtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUGxheWVyIGJpZHM6XCIscGxheWVyYmlkcyk7XG4gICAgICAgICAgICBmb3IobGV0IHBsYXllcj0wO3BsYXllcjxwbGF5ZXJiaWRzLmxlbmd0aDtwbGF5ZXIrKylcbiAgICAgICAgICAgICAgICBpZihwbGF5ZXJiaWRzW3BsYXllcl0ubGVuZ3RoPjAmJnBsYXllcmJpZHNbcGxheWVyXVswXT5oaWdoZXN0QmlkU29GYXIpXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hlc3RCaWRTb0Zhcj1wbGF5ZXJiaWRzW3BsYXllcl1bMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2coXCJIaWdoZXN0IGJpZCBzbyBmYXI6ICdcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdK1wiJy5cIik7XG4gICAgICAgIC8vIGlmIHRoZSBoaWdoZXN0IHBvc3NpYmxlIGJpZCBpcyBub3QgYSBiaWQgYWxsIGNhbiBwbGF5IChhdCB0aGUgc2FtZSB0aW1lKSwgY2FuJ3QgYmUgYmlkIGFnYWluXG4gICAgICAgIGlmKFBsYXllckdhbWUuQklEU19BTExfQ0FOX1BMQVkuaW5kZXhPZihQbGF5ZXJHYW1lLkJJRF9OQU1FU1toaWdoZXN0QmlkU29GYXJdKTwwKWhpZ2hlc3RCaWRTb0ZhcisrO1xuICAgICAgICBsZXQgcG9zc2libGVCaWROYW1lcz1QbGF5ZXJHYW1lLkJJRF9OQU1FUy5zbGljZShoaWdoZXN0QmlkU29GYXIpO1xuICAgICAgICBwb3NzaWJsZUJpZE5hbWVzLnVuc2hpZnQoUGxheWVyR2FtZS5CSURfTkFNRVNbUGxheWVyR2FtZS5CSURfUEFTXSk7IC8vIHVzZXIgY2FuIGFsd2F5cyAncGFzJ1xuICAgICAgICB0aGlzLmxvZyhcIlBvc3NpYmxlIGJpZHM6IFwiLHBvc3NpYmxlQmlkTmFtZXMpO1xuICAgICAgICBsZXQgYmlkPS0xO1xuICAgICAgICB3aGlsZShiaWQ8MCl7XG4gICAgICAgICAgICBsZXQgYmlkbmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgaXMgeW91ciBiaWQgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUJpZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVCaWROYW1lc1swXSk7XG4gICAgICAgICAgICBiaWQ9UGxheWVyR2FtZS5CSURfTkFNRVMuaW5kZXhPZihiaWRuYW1lKTtcbiAgICAgICAgICAgIGlmKGJpZDwwKWNvbnRpbnVlO1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEJpZChiaWQpO1xuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICBiaWQ9LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIC8vIGlmIHRoaXMgcGxheWVyIGhhcyBhbGwgYWNlcyBpdCdzIGdvbm5hIGJlIHRoZSBzdWl0ZSBvZiBhIGtpbmcgdGhlIHBlcnNvbiBoYXNuJ3RcbiAgICAgICAgLy8gYWxzbyBpdCBuZWVkcyB0byBiZSBhbiBhY2Ugb2YgYSBzdWl0ZSB0aGUgdXNlciBoYXMgaXRzZWxmICh1bmxlc3MgeW91IGhhdmUgYWxsIG90aGVyIGFjZXMpXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIC8vIGFueSBvZiB0aGUgc3VpdGVzIGluIHRoZSBjYXJkcyBjYW4gYmUgdGhlIHRydW1wIHN1aXRlIVxuICAgICAgICBsZXQgcG9zc2libGVUcnVtcFN1aXRlTmFtZXM9dGhpcy5nZXRTdWl0ZXMoKS5tYXAoKHN1aXRlKT0+e3JldHVybiBDYXJkLkNBUkRfU1VJVEVTW3N1aXRlXTt9KTtcbiAgICAgICAgbGV0IHRydW1wU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHRydW1wU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgdHJ1bXBOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBzdWl0ZSB3aWxsIGJlIHRydW1wIChvcHRpb25zOiAnXCIrcG9zc2libGVUcnVtcFN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVRydW1wU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICB0cnVtcFN1aXRlPXBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmluZGV4T2YodHJ1bXBOYW1lKTtcbiAgICAgICAgICAgIGlmKHRydW1wU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogYXNrcyBmb3IgdGhlIHN1aXRlIG9mIHRoZSBwYXJ0bmVyIGNhcmQgb2YgdGhlIGdpdmVuIHJhbmtcbiAgICAgKi9cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoKXtcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1SQU5LX0FDRTtcbiAgICAgICAgLy8gZ2V0IGFsbCB0aGUgYWNlbGVzcyBzdWl0ZXNcbiAgICAgICAgbGV0IHN1aXRlcz10aGlzLmdldFN1aXRlcygpO1xuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICBpZihwb3NzaWJsZVBhcnRuZXJTdWl0ZXMubGVuZ3RoPT0wKXsgLy8gcGxheWVyIGhhcyBBTEwgYWNlc1xuICAgICAgICAgICAgaWYoc3VpdGVzLmxlbmd0aDw0KXsgLy8gYnV0IG5vdCBhbGwgc3VpdGVzXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZSBzdWl0cyB0aGUgdXNlciBkb2VzIG5vdCBoYXZlIGFyZSBhbGxvd2VkIChhc2tpbmcgdGhlIGFjZSBibGluZCEhISlcbiAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9WzAsMSwyLDNdLmZpbHRlcigoc3VpdGUpPT57cmV0dXJuIHBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHN1aXRlKTwwO30pO1xuICAgICAgICAgICAgfWVsc2V7IC8vIGhhcyBhbGwgc3VpdHMsIHNvIGEga2luZyBpcyB0byBiZSBzZWxlY3RlZCEhIVxuICAgICAgICAgICAgICAgIC8vIGFsbCBraW5ncyBhY2NlcHRhYmxlIGV4Y2VwdCBmb3IgdGhhdCBpbiB0aGUgdHJ1bXAgY29sb3JcbiAgICAgICAgICAgICAgICAvLyBOT1RFIGlmIGEgcGVyc29uIGFsc28gaGFzIGFsbCB0aGUga2luZ3Mgd2UgaGF2ZSBhIHNpdHVhdGlvbiwgd2Ugc2ltcGx5IGNvbnRpbnVlIG9ud2FyZFxuICAgICAgICAgICAgICAgIHdoaWxlKDEpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuay0tO1xuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZVBhcnRuZXJTdWl0ZXM9dGhpcy5nZXRSYW5rbGVzc1N1aXRlcyh0aGlzLl9wYXJ0bmVyUmFuayk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0cnVtcFN1aXRlSW5kZXg9cG9zc2libGVQYXJ0bmVyU3VpdGVzLmluZGV4T2YodGhpcy5fdHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRydW1wU3VpdGVJbmRleD49MClwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuc3BsaWNlKHRydW1wU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD4wKWJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcz1wb3NzaWJsZVBhcnRuZXJTdWl0ZXMubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgIHdoaWxlKHBhcnRuZXJTdWl0ZTwwKXtcbiAgICAgICAgICAgIGxldCBwYXJ0bmVyU3VpdGVOYW1lPXByb21wdChcIkBcIit0aGlzLm5hbWUrXCIgKGhvbGRpbmcgXCIrdGhpcy5nZXRUZXh0UmVwcmVzZW50YXRpb24odHJ1ZSkrXCIpXFxuV2hhdCBcIitDYXJkLkNBUkRfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdK1wiIHNob3VsZCB5b3VyIHBhcnRuZXIgaGF2ZSAob3B0aW9uczogJ1wiK3Bvc3NpYmxlUGFydG5lclN1aXRlTmFtZXMuam9pbihcIicsICdcIikrXCInKT9cIixwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT1wb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmluZGV4T2YocGFydG5lclN1aXRlTmFtZSk7XG4gICAgICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gcGxheSBhIGNhcmQgYW5kIGFkZCBpdCB0byB0aGUgZ2l2ZW4gdHJpY2tcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgcGxheUFDYXJkKHRyaWNrKXtcbiAgICAgICAgdGhpcy5sb2coXCJQbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgYXNrZWQgdG8gcGxheSBhIGNhcmQuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgdXNpbmcgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlIGFscGhhYmV0P1xuICAgICAgICBsZXQgcG9zc2libGVDYXJkTmFtZXM9W107XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIHBvc3NpYmxlQ2FyZE5hbWVzLnB1c2goU3RyaW5nLmNhcmRJbmRleCsxKStcIjogXCIrdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgbGV0IGNhcmRQbGF5SW5kZXg9LTE7XG4gICAgICAgIHdoaWxlKGNhcmRQbGF5SW5kZXg8MCl7XG4gICAgICAgICAgICAvLyB3ZSdyZSBzdXBwb3NlZCB0byBwbGF5IGEgY2FyZCB3aXRoIHN1aXRlIGVxdWFsIHRvIHRoZSBmaXJzdCBjYXJkIHVubGVzcyB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGlzIGJlaW5nIGFza2VkIGZvclxuICAgICAgICAgICAgbGV0IGNhcmRJZD1wYXJzZUludChwcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiXFxuUHJlc3MgdGhlIGlkIG9mIHRoZSBjYXJkIHlvdSB3YW50IHRvIGFkZCB0byBcIit0cmljay5nZXRUZXh0UmVwcmVzZW50YXRpb24oKStcIiAob3B0aW9uczogJ1wiK3Bvc3NpYmxlQ2FyZE5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIsXCJcIikpO1xuICAgICAgICAgICAgaWYoaXNOYU4oY2FyZElkKSljb250aW51ZTtcbiAgICAgICAgICAgIGNhcmRQbGF5SW5kZXg9Y2FyZElkLTE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q2FyZCh0aGlzLl9jYXJkc1tjYXJkUGxheUluZGV4XSk7XG4gICAgfVxuXG4gICAgc2V0IHBhcnRuZXIocGFydG5lcil7dGhpcy5fcGFydG5lcj0odHlwZW9mIHBhcnRuZXI9PT0nbnVtYmVyJz9wYXJ0bmVyOi0xKTt9IC8vIHRvIHNldCB0aGUgcGFydG5lciBvbmNlIHRoZSBwYXJ0bmVyIHN1aXRlL3JhbmsgY2FyZCBpcyBpbiB0aGUgdHJpY2shISEhXG5cbiAgICB0cmlja1dvbih0cmlja0luZGV4KXtcbiAgICAgICAgdGhpcy5fdHJpY2tzV29uLnB1c2godHJpY2tJbmRleCk7XG4gICAgICAgIHRoaXMubG9nKFwiVHJpY2sgI1wiK3RyaWNrSW5kZXgrXCIgd29uIGJ5ICdcIit0aGlzLm5hbWUrXCInOiBcIit0aGlzLl90cmlja3NXb24rXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBudW1iZXJPZlRyaWNrc1dvbigpe3JldHVybiB0aGlzLl90cmlja3NXb24ubGVuZ3RoO31cbiAgICBcbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbigpe1xuICAgICAgICAvLyByZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiB0cmlja3Mgd29uIChpbmNsdWRpbmcgdGhvc2UgYnkgdGhlIHBhcnRuZXIgKGlmIGFueSkpXG4gICAgICAgIHJldHVybih0aGlzLm51bWJlck9mVHJpY2tzV29uK3RoaXMuX2dhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0aGlzLnBhcnRuZXIpKTtcbiAgICB9XG5cbiAgICBzZXROdW1iZXJPZlRyaWNrc1RvV2luKG51bWJlck9mVHJpY2tzVG9XaW4pe3RoaXMuX251bWJlck9mVHJpY2tzVG9XaW49bnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzVG9XaW4oKXtyZXR1cm4gdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbjt9XG4gICAgXG4gICAgLy8gZXZlcnkgcGxheWVyIGNhbiBiZSBjaGVja2VkIHdoZXRoZXIgZnJpZW5kICgxKSBvciBmb28gKC0xKSBvciB1bmtub3duICgwKVxuICAgIGlzRnJpZW5kbHkocGxheWVyKXtcbiAgICAgICAgaWYocGxheWVyPT09dGhpcy5faW5kZXgpcmV0dXJuIDI7IC8vIEknbSBtdWNobyBmcmllbmRseSB0byBteXNlbGZcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpO1xuICAgICAgICBpZihwYXJ0bmVyU3VpdGU+PTApeyAvLyBhIG5vbi1zb2xpdGFyeSBnYW1lXG4gICAgICAgICAgICAvLyBBU1NFUlQgbm90IGEgc29saXRhcnkgZ2FtZSBzbyBwbGF5ZXIgY291bGQgYmUgdGhlIHBhcnRuZXIgaW4gY3JpbWVcbiAgICAgICAgICAgIC8vIGlmIHBhcnRuZXIgaXMga25vd24gKGkuZS4gdGhlIHBhcnRuZXIgY2FyZCBpcyBubyBsb25nZXIgaW4gdGhlIGdhbWUpXG4gICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyPj0wKXJldHVybihwbGF5ZXI9PT10aGlzLl9wYXJ0bmVyPzE6LTEpOyBcbiAgICAgICAgICAgIC8vIEFTU0VSVCBwYXJ0bmVyIHVua25vd24gKGkuZS4gcGFydG5lciBjYXJkIHN0aWxsIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgbGV0IHRydW1wUGxheWVyPXRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKTtcbiAgICAgICAgICAgIC8vIGlmIEknbSB0aGUgdHJ1bXAgcGxheWVyLCBhc3N1bWUgQUxMIHVuZnJpZW5kbHkgQlVUIG5vIEkgZG9uJ3Qga25vdyB3aG8gbXkgcGFydG5lciBpcyBhbGwgY291bGQgYmVcbiAgICAgICAgICAgIGlmKHRoaXMuX2luZGV4PT09dHJ1bXBQbGF5ZXIpcmV0dXJuIDA7IC8vIHVua25vd25cbiAgICAgICAgICAgIGlmKHRoaXMuY29udGFpbnNDYXJkKHBhcnRuZXJTdWl0ZSx0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCkpKSAvLyBJIGhhdmUgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PXRydW1wUGxheWVyPzE6LTEpOyAvLyB0aGUgdHJ1bXAgcGxheWVyIGlzIGZyaWVuZGx5LCB0aGUgb3RoZXJzIGFyZSB1bmZyaWVuZGx5XG4gICAgICAgICAgICAvLyBBU1NFUlQgSSdtIG5vdCB0aGUgdHJ1bXAgcGxheWVyLCBhbmQgSSdtIG5vdCB3aXRoIHRoZSB0cnVtcCBwbGF5ZXIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmb28sIHRoZSByZXN0IEkgZG9uJ3Qga25vdyB5ZXRcbiAgICAgICAgICAgIHJldHVybihwbGF5ZXI9PT10cnVtcFBsYXllcj8tMTowKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgYSBzb2xpdGFyeSBnYW1lXG4gICAgICAgIC8vIGlmIEknbSBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnMsIGV2ZXJ5b25lIGVsc2UgaXMgYSBmb29cbiAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YodGhpcy5faW5kZXgpPj0wKXJldHVybiAtMTtcbiAgICAgICAgLy8gQVNTRVJUIG5vdCBvbmUgb2YgdGhlIHNvbGl0YXJ5IHBsYXllcnNcbiAgICAgICAgLy8gICAgICAgIGlmIHBsYXllciBpcyBhIHNvbGl0YXJ5IHBsYXllciBpdCdzIGEgZm9vLCBvdGhlcndpc2UgaXQncyB1cyBhZ2FpbnN0IHRoZW0hISEhXG4gICAgICAgIHJldHVybih0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWRkZXJzKCkuaW5kZXhPZihwbGF5ZXIpPj0wPy0xOjEpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIHRoaXMubmFtZTt9XG5cbn1cblxuLy8gZXhwb3J0IHRoZSBQbGF5ZXIgY2xhc3Ncbm1vZHVsZS5leHBvcnRzPXtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfTsiLCJjb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpOyAvLyBmb3IgY29tcGFyaW5nIGNhcmRzXG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG5jbGFzcyBUcmljayBleHRlbmRzIENhcmRIb2xkZXJ7XG5cbiAgICAvLyBNREhAMDdERUMyMDE5OiBnYW1lIGRhdGEgbW92ZWQgb3ZlciB0byBQbGF5ZXJHYW1lIGluc3RhbmNlIChhcyBwYXNzZWQgdG8gZWFjaCBwbGF5ZXIpXG4gICAgLy8gICAgICAgICAgICAgICAgY2FuQXNrRm9yUGFydG5lckNhcmQgYmxpbmQgbm93IGRldGVybWluZWQgYnkgdGhlIGdhbWUgKGVuZ2luZSkgaXRzZWxmXG5cbiAgICAvLyBieSBwYXNzaW5nIGluIHRoZSB0cnVtcCBwbGF5ZXIgKGkuZS4gdGhlIHBlcnNvbiB0aGF0IGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgY29uc3RydWN0b3IoZmlyc3RQbGF5ZXIsdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssY2FuQXNrRm9yUGFydG5lckNhcmQsZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKXsgLy8gcmVwbGFjaW5nOiB0cnVtcFN1aXRlLHBhcnRuZXJTdWl0ZSxwYXJ0bmVyUmFuayx0cnVtcFBsYXllcil7XG4gICAgICAgIHN1cGVyKCk7IC8vIHVzaW5nIDQgZml4ZWQgcG9zaXRpb25zIGZvciB0aGUgdHJpY2sgY2FyZHMgc28gd2Ugd2lsbCBrbm93IHdobyBwbGF5ZWQgdGhlbSEhISFcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXI9Zmlyc3RQbGF5ZXI7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTsgLy8gZm9yIGludGVybmFsIHVzZSB0byBiZSBhYmxlIHRvIGRldGVybWluZSB0aGUgd2lubmVyIG9mIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPXBhcnRuZXJTdWl0ZTt0aGlzLl9wYXJ0bmVyUmFuaz1wYXJ0bmVyUmFuazsgLy8gbmVlZCB0aGlzIHdoZW4gaXQncyBiZWluZyBhc2tlZCB0byBkZXRlcm1pbmUgdGhlIHdpbm5lclxuICAgICAgICB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD1jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDsgLy8gLTEgYmxpbmQsIDAgbm90LCAxIG5vbi1ibGluZFxuICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyB0aGUgJ2ZsYWcnIHNldCBieSB0aGUgdHJ1bXAgcGxheWVyIHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGluIGEgdHJpY2tcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPS0xOyAvLyB0aGUgc3VpdGUgb2YgdGhlIHRyaWNrIChtb3N0IG9mIHRoZSB0aW1lIHRoZSBzdWl0ZSBvZiB0aGUgZmlyc3QgY2FyZClcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD0tMTsgLy8gdGhlIGNhcmQgb2YgdGhlIHdpbm5lciAobm90ZTogTk9UIHRyYW5zZm9ybWVkIHRvIHRoZSBhY3R1YWwgcGxheWVyIGluZGV4IHlldClcbiAgICAgICAgdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzPWZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcztcbiAgICAgICAgLy8gbGV0J3Mga2VlcCB0cmFjayBvZiB0aGUgaGlnaGVzdCBjYXJkXG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBjYW4gYXNrIGZvciBwYXJ0bmVyIGNhcmQ6IFwiK2NhbkFza0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCI+Pj4gTmV3IHRyaWNrIGZpcnN0IHBsYXllciBjYW4gcGxheSBzcGFkZXM6IFwiK2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcytcIi5cIik7XG4gICAgfVxuXG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIGdldCBmaXJzdFBsYXllckNhblBsYXlTcGFkZXMoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzO31cbiAgICBcbiAgICAvLyB0aGUgd2lubmVyIGV4cG9zZWQgaXMgdGhlIGFjdHVhbCBwbGF5ZXIgd2hvIHdvblxuICAgIGdldCB3aW5uZXIoKXtyZXR1cm4odGhpcy5fd2lubmVyQ2FyZDwwPy0xOih0aGlzLl93aW5uZXJDYXJkK3RoaXMuX2ZpcnN0UGxheWVyKSU0KTt9XG4gICAgXG4gICAgLy8gTURIQDA3REVDMjAxOTogbW92ZWQgZnJvbSBoZXJlIHRvIHRoZSBnYW1lIChhcyBhIFBsYXllckdhbWUgaW5zdGFuY2UpXG4gICAgLypcbiAgICBnZXQgdHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fSAvLyBleHBvc2VzIHRoZSBjdXJyZW50IHRydW1wIHBsYXllclxuICAgIGdldCBwYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXQgcGFydG5lclJhbmsoKXtyZXR1cm4gdGhpcy5fcGFydG5lclJhbms7fVxuICAgICovXG4gICAgZ2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7cmV0dXJuIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkO31cblxuICAgIC8vIHBhc3MgaW4gLTEgd2hlbiBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZCwgb3IgKzEgd2hlbiBhc2tpbmcgZm9yIGl0IChub24tYmxpbmQpXG4gICAgc2V0IGFza2luZ0ZvclBhcnRuZXJDYXJkKGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodHlwZW9mIGFza2luZ0ZvclBhcnRuZXJDYXJkIT09XCJudW1iZXJcIil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBBc2tpbmcgZm9yIHBhcnRuZXIgY2FyZCBOT1QgZGVmaW5lZCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmQhPTAmJnRoaXMubnVtYmVyT2ZDYXJkcz4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3BnZXZlbiBkZSBwYXJ0bmVyIGFhcy9oZWVyIChibGluZCkgdGUgdnJhZ2VuIG5pZXQgbWVlciB0b2VnZXN0YWFuLlwiKTtcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgc2V0IHRvIFwiK3RoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICBfc2V0V2lubmVyQ2FyZCh3aW5uZXJDYXJkKXtcbiAgICAgICAgdGhpcy5fd2lubmVyQ2FyZD13aW5uZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWNrIHdpbm5lciBjYXJkOiBcIit3aW5uZXJDYXJkK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBjYXJkIHBsYXllZCBieSAodGhlIGFjdHVhbCkgcGxheWVyIChhcyB1c2VkIGZvciBzaG93aW5nIHRoZSB0cmljayBjYXJkcylcbiAgICAgKiBAcGFyYW0geyp9IHBsYXllciBcbiAgICAgKi9cbiAgICBnZXRQbGF5ZXJDYXJkKHBsYXllcil7XG4gICAgICAgIGxldCBwbGF5ZXJDYXJkPSh0aGlzLl9maXJzdFBsYXllcj49MD8ocGxheWVyKzQtdGhpcy5fZmlyc3RQbGF5ZXIpJTQ6bnVsbCk7XG4gICAgICAgIHJldHVybihwbGF5ZXJDYXJkPj0wJiZwbGF5ZXJDYXJkPHRoaXMubnVtYmVyT2ZDYXJkcz90aGlzLl9jYXJkc1twbGF5ZXJDYXJkXTpudWxsKTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkKCl7XG4gICAgICAgIGlmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSB0aGUgZmlyc3QgcGxheWVyIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICBpZighdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQgKGFueW1vcmUpLlwiKTtcbiAgICAgICAgdGhpcy5fcGxheVN1aXRlPXRoaXMuX3RydW1wU3VpdGU7IC8vIHRoZSBwbGF5IHN1aXRlIGJlY29tZXMgdGhlIHRydW1wIHN1aXRlXG4gICAgfVxuICAgICovXG4gICAgLy8gTk9URSBhZGRDYXJkIGlzIE5PVCBfYWRkQ2FyZCBvZiB0aGUgc3VwZXJjbGFzcyEgdGhpcyBpcyBiZWNhdXNlIHdlIHNob3VsZCBzZXQgdGhlIGhvbGRlciBvbiB0aGUgY2FyZCB0byBhZGQhISEhXG4gICAgYWRkQ2FyZChjYXJkKXtcbiAgICAgICAgbGV0IG51bWJlck9mQ2FyZHNOb3c9dGhpcy5udW1iZXJPZkNhcmRzO1xuICAgICAgICAgLy8gaWYgdGhlIGZsYWcgb2YgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIGlzIHNldCwgcHJlc2V0IHRoZSBcbiAgICAgICAgY2FyZC5ob2xkZXI9dGhpczsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGlzIHRyaWNrIGJ5IHNldHRpbmcgdGhlIGhvbGRlciBwcm9wZXJ0eSAod2lsbCB0YWtlIGNhcmUgb2YgYWRkaW5nL3JlbW92aW5nIHRoZSBjYXJkKVxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBzaG91bGQgY29uc2lkZXIgcmV0dXJuaW5nIGFuIEVycm9yIGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXJyb3JcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPD1udW1iZXJPZkNhcmRzTm93KVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkZhaWxlZCB0byBhZGQgdGhlIGNhcmQgdG8gdGhlIHRyaWNrLlwiKTtcbiAgICAgICAgLy8gQVNTRVJUIGNhcmQgYWRkZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLl90cnVtcFN1aXRlPDApXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiQlVHOiBBc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQsIGJ1dCBwbGF5aW5nIGEgZ2FtZSB3aXRob3V0IHRydW1wLlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yIGJsaW5kIGV2ZXJ5b25lIGhhcyB0byBwbGF5IHRoZSBwYXJ0bmVyIGNhcmQgc3VpdGVcbiAgICAgICAgLy8gTURIQDA5REVDMjAxOTogT09QUyBJIHdhcyBhbHJlYWR5IHVzaW5nIHRoaXMuX3BhcnRuZXJTdWl0ZSBoZXJlIEJVVCBzdGlsbCBhZnRlciBhY3R1YWxseSB0YWtpbmcgaXQgb3V0IChub3cgaW4gYWdhaW4pXG4gICAgICAgIGlmKHRoaXMuX3BsYXlTdWl0ZTwwKXsgLy8gZmlyc3QgY2FyZCBiZWluZyBwbGF5ZWRcbiAgICAgICAgICAgIC8vIE1ESEAxOEpBTjIwMjA6IGFzY2VydGFpbiB0aGF0IF9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCBoYXMgdGhlIHJpZ2h0IHZhbHVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBjb3VsZCBiZSAwIGJ1dCB3aGVuIHRoZSBwYXJ0bmVyIHN1aXRlIGlzIHBsYXllZCB0aGUgcGxheWVyIElTIGFza2luZ1xuICAgICAgICAgICAgaWYodGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQhPT0wKXsgLy8gcGxheWVyIHN1cHBvc2VkbHkgY2FuIHN0aWxsIGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPD0wJiZjYXJkLnN1aXRlPT09dGhpcy5fcGFydG5lclN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MCl0aHJvdyBuZXcgRXJyb3IoXCJCVUc6IENhbm5vdCBhc2sgdGhlIHBhcnRuZXIgY2FyZCBibGluZCFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiSW1wbGljaXRseSBhc2tpbmcgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYnkgcGxheWluZyB0aGUgcGFydG5lciBzdWl0ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPT0wKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiQ2Fubm90IGFzayBmb3IgdGhlIHBhcnRuZXIgY2FyZCB3aGVuIHlvdSBjYW4ndCBhc2sgZm9yIGl0IGFueW1vcmUhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcGxheVN1aXRlPSh0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDwwP3RoaXMuX3BhcnRuZXJTdWl0ZTpjYXJkLnN1aXRlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBU1NFUlQgdGhpcy5fcGxheVN1aXRlIG5vdyBkZWZpbml0ZWx5IG5vbi1uZWdhdGl2ZSwgc29cbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9MDsgLy8gdXNlIHRoZSByaWdodCBwcm9wZXJ0eSBicm8nXG4gICAgICAgIC8vIHVwZGF0ZSB3aW5uZXJcbiAgICAgICAgaWYobnVtYmVyT2ZDYXJkc05vdz4wKXtcbiAgICAgICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIG9ubHkgdGhlIHBhcnRuZXIgY2FyZCBjYW4gZXZlciB3aW4gKGV2ZW4gaWYgdGhlcmUncyB0cnVtcCEhKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnV0IHdlIG5lZWQgdG8ga25vdyB3aGV0aGVyIHRoZSBwYXJ0bmVyIGNhcmQgd2FzIGFscmVhZHkgdGhyb3duXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBTT0xVVElPTjogKE5FQVQpIGl0J3MgZWFzaWVzdCB0byBzaW1wbHkgaWdub3JlIHRydW1wIGlzIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgZm9yISEhISEhXG4gICAgICAgICAgICBpZihDYXJkLmNvbXBhcmVDYXJkc1dpdGhQbGF5QW5kVHJ1bXBTdWl0ZShjYXJkLHRoaXMuX2NhcmRzW3RoaXMuX3dpbm5lckNhcmRdLHRoaXMuX3BsYXlTdWl0ZSwodGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQhPTA/LTE6dGhpcy5fdHJ1bXBTdWl0ZSkpPjApXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZChudW1iZXJPZkNhcmRzTm93KTtcbiAgICAgICAgfWVsc2UgLy8gYWZ0ZXIgdGhlIGZpcnN0IGNhcmQgdGhlIGZpcnN0IHBsYXllciBpcyB0aGUgd2lubmVyIG9mIGNvdXJzZVxuICAgICAgICAgICAgdGhpcy5fc2V0V2lubmVyQ2FyZCgwKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldENhcmRQbGF5ZXIoc3VpdGUscmFuayl7XG4gICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTA7Y2FyZEluZGV4PHRoaXMuX2NhcmRzLmxlbmd0aDtjYXJkSW5kZXgrKylcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzW2NhcmRJbmRleF0uc3VpdGU9PT1zdWl0ZSYmdGhpcy5fY2FyZHNbY2FyZEluZGV4XS5yYW5rPT09cmFuaylcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZpcnN0UGxheWVyK2NhcmRJbmRleCklNDsgLy8gVE9ETyBjYW4gd2UgYXNzdW1lIDQgcGxheWVycyBpbiB0b3RhbD8/Pz8/XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgZ2V0dGVyc1xuICAgIGdldCBwbGF5U3VpdGUoKXtyZXR1cm4gdGhpcy5fcGxheVN1aXRlO31cbiAgICBnZXQgZmlyc3RQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZmlyc3RQbGF5ZXI7fVxuXG4gICAgLypcbiAgICBnZXQgdHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICAqL1xuICAgIGdldCBjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDt9XG59XG5cbm1vZHVsZS5leHBvcnRzPVRyaWNrO1xuIiwiLyoqXG4gKiB0aGUgcGFydCB0aGF0IHJ1bnMgaW4gdGhlIGJyb3dzZXIgb2YgYSBzaW5nbGUgcGxheWVyXG4gKiBnaXZlbiB0aGF0IGFueSBpbmZvcm1hdGlvbiB0byB0aGUgY3VycmVudCBwbGF5ZXIgb2YgdGhlIGdhbWUgc2hvdWxkIGJlIGF2YWlsYWJsZSB0aHJvdWdoIGl0J3MgX2dhbWUgcHJvcGVydHkgKGkuZS4gYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICogYWxsIGNhbGxzIGluIG1haW4uanMgdG8gcmlra2VuVGhlR2FtZSBkaXJlY3RseSBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCBjYWxscyB0byBjdXJyZW50UGxheWVyLmdhbWUgaS5lLiByaWtrZW5UaGVHYW1lIGl0c2VsZiBpcyBubyBsb25nZXIgYXZhaWxhYmxlIHRvIHRoZSBjdXJyZW50UGxheWVyISEhXG4gKiBcbioqL1xuLy8gd2UnbGwgYmUgdXNpbmcgUGxheWVyLmpzIG9ubHkgKFBsYXllci5qcyB3aWxsIGRlYWwgd2l0aCByZXF1aXJpbmcgQ2FyZEhvbGRlciwgYW5kIENhcmRIb2xkZXIgQ2FyZClcbi8vIE5PIEkgbmVlZCB0byByZXF1aXJlIHRoZW0gYWxsIG90aGVyd2lzZSBicm93c2VyaWZ5IHdvbid0IGJlIGFibGUgdG8gZmluZCBDYXJkLCBldGMuXG5jb25zdCBDYXJkPXJlcXVpcmUoJy4vQ2FyZC5qcycpO1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcbmNvbnN0IFRyaWNrPXJlcXVpcmUoJy4vVHJpY2suanMnKTsgLy8gbm93IGluIHNlcGFyYXRlIGZpbGVcbmNvbnN0IHtQbGF5ZXJFdmVudExpc3RlbmVyLFBsYXllckdhbWUsUGxheWVyfT1yZXF1aXJlKCcuL1BsYXllci5qcycpO1xuXG5jb25zdCBMYW5ndWFnZT1yZXF1aXJlKCcuL0xhbmd1YWdlLmpzJyk7XG4vKiByZXBsYWNpbmc6XG5jbGFzcyBMYW5ndWFnZXtcbiAgICBzdGF0aWMgZ2V0IERFRkFVTFRfUExBWUVSUygpe3JldHVybiBbW1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIl0sW1wiTWFyY1wiLFwiSnVyZ2VuXCIsXCJNb25pa2FcIixcIkFubmFcIixcIlwiXV07fTtcbiAgICAvLyBwb3NzaWJsZSByYW5rcyBhbmQgc3VpdGVzIChpbiBEdXRjaClcbiAgICBzdGF0aWMgZ2V0IERVVENIX1JBTktfTkFNRVMoKXtyZXR1cm4gW1widHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImJvZXJcIixcInZyb3V3XCIsXCJoZWVyXCIsXCJhYXNcIl07fTtcbiAgICBzdGF0aWMgZ2V0IERVVENIX1NVSVRFX05BTUVTKCl7cmV0dXJuIFtcInJ1aXRlblwiLFwia2xhdmVyZW5cIixcImhhcnRlblwiLFwic2Nob3BwZW5cIl07fTtcbn1cbiovXG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKXtyZXR1cm4oc3RyPyhzdHIubGVuZ3RoP3N0clswXS50b1VwcGVyQ2FzZSgpK3N0ci5zbGljZSgxKTpcIlwiKTpcIj9cIik7fVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1dvblRleHQoY291bnQpe1xuICAgIGlmKGNvdW50PT09LTIpcmV0dXJuIFwiP1wiO1xuICAgIGlmKGNvdW50PDApcmV0dXJuIFwib25iZWtlbmRcIjtcbiAgICBpZihjb3VudD4xMylyZXR1cm4gXCJvbm1vZ2VsaWprXCI7XG4gICAgcmV0dXJuW1wiZ2VlblwiLFwiZWVuXCIsXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiZWxmXCIsXCJ0d2FhbGZcIixcImFsbGVtYWFsXCJdW2NvdW50XTtcbn1cblxuZnVuY3Rpb24gYnVnKGJ1Zyl7XG4gICAgYWxlcnQoXCJFcm5zdGlnZSBwcm9ncmFtbWFmb3V0OiBcIitidWcrXCIuXFxuUmFwcG9ydGVlciBkZXplIGZvdXQsIGVuIGJyZWVrIGhldCBzcGVsIGFmLlwiKTtcbn1cblxuY29uc3QgVklTSUJMRT1cImluaGVyaXRcIjsgLy8gTURIQDAzRkVCMjAyMDogaWYgd2UnZCB1c2UgdmlzaWJsZSwgaXQgd291bGQgaWdub3JlIHdoYXQgdGhlIHBhcmVudCdzIHZpc2liaWxpdHkgaXMsIGFuZCBrZWVwIHNob3dpbmcuLi5cblxuLy8gTURIQDA3SkFOMjAyMDogYWRkaW5nIGVudGVyaW5nIHRoZSBpZCBvZiB0aGUgdXNlciBvbiBwYWdlLXNldHRpbmdzLCBzbyB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgYSBuZXcgb25lXG4vLyAgICAgICAgICAgICAgICBhbHRlcm5hdGl2ZWx5IHdlIGNhbiBkbyB0aGF0IG9uIGEgc2VwYXJhdGUgcGFnZSAvIHBhZ2UtYXV0aCBpcyBPS1xuLy8gICAgICAgICAgICAgICAgd2UgZ28gdG8gcGFnZS1hdXRoIHdoZW4gTk9UIHBsYXlpbmcgdGhlIGdhbWUgaW4gZGVtbyBtb2RlISEhXG4vLyAgICAgICAgICAgICAgICBpbiBub24tZGVtbyBtb2RlIHlvdSBpZGVudGlmeSB5b3Vyc2VsZiwgdGhlbiB3aGVuIHNldFBsYXllck5hbWUgaXMgc3VjY2Vzc2Z1bCBnbyB0byBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbi8vIE1ESEAxMEpBTjIwMjA6IHJlbW92aW5nIHBhZ2Utc2V0dGluZ3MgYW5kIHBhZ2Utc2V0dXAtZ2FtZSwgYWRkaW5nIHBhZ2UtaGVscFxuY29uc3QgUEFHRVM9W1wicGFnZS1ydWxlc1wiLFwicGFnZS1oZWxwXCIsXCJwYWdlLWF1dGhcIixcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiLFwicGFnZS1iaWRkaW5nXCIsXCJwYWdlLXRydW1wLWNob29zaW5nXCIsXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIixcInBhZ2UtcGxheS1yZXBvcnRpbmdcIixcInBhZ2UtcGxheWluZ1wiLFwicGFnZS1maW5pc2hlZFwiXTtcblxudmFyIGN1cnJlbnRQYWdlPW51bGw7IC8vIGxldCdzIGFzc3VtZSB0byBiZSBzdGFydGluZyBhdCBwYWdlLXJ1bGVzXG52YXIgdmlzaXRlZFBhZ2VzPVtdOyAvLyBubyBwYWdlcyB2aXNpdGVkIHlldFxuXG52YXIgY3VycmVudFBsYXllcj1udWxsOyAvLyB0aGUgY3VycmVudCBnYW1lIHBsYXllclxuXG52YXIgY3VycmVudEdhbWU9bnVsbDsgLy8gd2UgcmVtZW1iZXIgdGhlIGdhbWUgdW50aWwgd2Ugbm8gbG9uZ2VyIG5lZWQgaXRcblxudmFyIG9uRXhpdEhhbmRsZXI9bnVsbDsgLy8gdGhlIG9uIGV4aXQgaGFuZGxlciBzdXBwbGllZCBieSBjYWxsZXIgb2Ygc2V0UGxheWVyTmFtZSgpIChudWxsIHdoZW4gcnVubmluZyAnc3RhbmRhbG9uZScpXG5cbi8vIE1ESEAwNkZFQjIwMjA6IGFzIHdlJ3JlIHNlbmRpbmcgd2l0aCBhY2tub3dsZWRnaW5nIHdlIGNhbiBrZWVwIHRyYWNrIG9mIHRoZSByZXNwb25zZSB0aW1lIG9mIHRoZSBzZXJ2ZXIgdG8gdXNlIHdoZW4gZXhpdGluZyB0aGUgZ2FtZVxuY2xhc3MgU2VydmVyUmVzcG9uc2VTdGF0c3tcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl9taW5pbXVtUmVzcG9uc2VNcz1udWxsO1xuICAgICAgICB0aGlzLl9tYXhpbXVtUmVzcG9uc2VNcz1udWxsO1xuICAgICAgICB0aGlzLl9sYXN0UmVzcG9uc2VNcz1udWxsO1xuICAgIH1cbiAgICBnZXQgbWluaW11bVJlc3BvbnNlTXMoKXtyZXR1cm4gdGhpcy5fbWluaW11bVJlc3BvbnNlTXM7fVxuICAgIGdldCBtYXhpbXVtUmVzcG9uc2VNcygpe3JldHVybiB0aGlzLl9tYXhpbXVtUmVzcG9uc2VNczt9XG4gICAgZ2V0IGxhc3RSZXNwb25zZU1zKCl7cmV0dXJuIHRoaXMuX2xhc3RSZXNwb25zZU1zO31cbiAgICBhZGQocmVzcG9uc2VNcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKiogQWRkaW5nIHNlcnZlciByZXNwb25zZSB0aW1lIFwiK3Jlc3BvbnNlTXMrXCIuXCIpO1xuICAgICAgICB0aGlzLl9sYXN0UmVzcG9uc2VNcz1yZXNwb25zZU1zO1xuICAgICAgICBpZighdGhpcy5fbWF4aW11bVJlc3BvbnNlTXN8fHRoaXMuX2xhc3RSZXNwb25zZU1zPnRoaXMuX21heGltdW1SZXNwb25zZU1zKXRoaXMuX21heGltdW1SZXNwb25zZU1zPXRoaXMuX2xhc3RSZXNwb25zZU1zO1xuICAgICAgICBpZighdGhpcy5fbWluaW11bVJlc3BvbnNlTXN8fHRoaXMuX2xhc3RSZXNwb25zZU1zPHRoaXMuX21pbmltdW1SZXNwb25zZU1zKXRoaXMuX21pbmltdW1SZXNwb25zZU1zPXRoaXMuX2xhc3RSZXNwb25zZU1zO1xuICAgIH1cbn1cbnZhciBzZXJ2ZXJSZXNwb25zZVN0YXRzPW5ldyBTZXJ2ZXJSZXNwb25zZVN0YXRzKCk7XG5mdW5jdGlvbiBzZW5kVG9TZXJ2ZXIoc29ja2V0LGV2ZW50LGRhdGEsY2FsbGJhY2spe1xuICAgIGxldCBzZW5kVG9TZXJ2ZXJUaW1lTXM9d2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHNvY2tldC5lbWl0KGV2ZW50LGRhdGEsKHJlc3BvbnNlKT0+e1xuICAgICAgICBzZXJ2ZXJSZXNwb25zZVN0YXRzLmFkZCh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCktc2VuZFRvU2VydmVyVGltZU1zKTsgLy8gcmVtZW1iZXIgaG93IGxvbmcgYWNrbm93bGVkZ2luZyB0b29rXG4gICAgICAgIGlmKHR5cGVvZiBjYWxsYmFjaz09PSdmdW5jdGlvbicpY2FsbGJhY2socmVzcG9uc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG4vLyBNREhAMDdGRUIyMDIwOiB3aGVuIGluIHRoZSBwcm9jZXNzIG9mIFxuZnVuY3Rpb24gdXBkYXRlR2FtZU92ZXJCdXR0b25zKGVuYWJsZSl7XG4gICAgZm9yKGxldCBzdG9wQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N0b3AnKSlzdG9wQnV0dG9uLmRpc2FibGVkPSFlbmFibGU7XG4gICAgZm9yKGxldCBuZXdHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXctZ2FtZVwiKSluZXdHYW1lQnV0dG9uLmRpc2FibGVkPSFlbmFibGU7XG59XG5cbi8vIE1ESEAwNUZFQjIwMjA6IGlmIHNvbWVib2R5IHdhbnRzIHRvIHN0b3AgcGxheWluZyBjb21wbGV0ZWx5LCAocyloZSB3YW50cyB0byBiZSBjb21wbGV0ZWx5IGZvcmdvdHRlblxuLy8gICAgICAgICAgICAgICAgc2V0UGxheWVyTmFtZSgpIFxudmFyIHJlZ2lzdGVyaW5nUGxheWVySWQ9bnVsbDsgLy8gdGhlIGlkIG9mIHRoZSB0aW1lciB0byByZWdpc3RlciB0aGUgcGxheWVyIG9uIGV2ZXJ5IHNvY2tldC5pbyBjb25uZWN0XG5mdW5jdGlvbiBzdG9wQnV0dG9uQ2xpY2tlZCgpe1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICAvKiBNREhAMTJGRUIyMDIwOiByZXBsYWNpbmc6XG4gICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuIGFsZXJ0KFwiSGVsYWFzIGtlbm5lbiB3ZSBqZSBuaWV0LCBkdXMgamUgenVsdCBuaWV0IGt1bm5lbiBzcGVsZW4hXCIpO1xuICAgIHVwZGF0ZUdhbWVPdmVyQnV0dG9ucyhmYWxzZSk7IC8vIGRpc2FibGUgdGhlIGdhbWUgb3ZlciBidXR0b25zXG4gICAgLy8gbGVhdmluZyB0aGUgcGFnZSBpcyBlYXNpZXN0Li4uIFFVSUNLIEZJWCB0byBkbyBzbyB3aGVuIHdlJ3JlIGluIGEgc2Vzc2lvbiAoaS5lLiBhc3N1bWluZyBhIHJlZ2lzdGVyZWQgcGxheWVyKVxuICAgIGlmKGdldENvb2tpZSgnY29ubmVjdC5zaWQnKSlcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihudWxsKTsgLy8ga2lsbGluZyB0aGUgcGxheWVyIHNob3VsZCBkbyB0aGUgcmVzdCEhISEhXG4gICAgKi9cbiAgICAvKiBNREhAMDVGRUIyMDIwIHJlcGxhY2luZzogXG4gICAgLy8gQVNTRVJUIGFzc3VtaW5nIG5vdCBwbGF5aW5nIGluIGEgZ2FtZSBhbnltb3JlIGkuZS4gbmV3R2FtZSgpIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmVcbiAgICAvLyBhIE5PUk1BTCBleGl0XG4gICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuIGFsZXJ0KFwiSmUgYmVudCBhbCBhZmdlbWVsZCFcIik7XG4gICAgY3VycmVudFBsYXllci5leGl0KCdTVE9QJyk7IC8vIE1ESEAwNUZFQjIwMjA6IFRPRE8gY2hlY2sgd2hldGhlciBkb2luZyB0aGlzIHRydWVseSBraWxscyB0aGUgcGxheWVyIGF0IHRoZSBvdGhlciBlbmQhISFcbiAgICAvLyBraWxsIHRoZSAnaGlzdG9yeScsIHByZXRlbmQgdG8gbmV2ZXIgaGF2ZSBiZWVuIGhlcmUsIGFuZCBzaG93IHRoZSBoZWxwIHBhZ2UgKGZyb20gd2hlcmUgYSBwZXJzb24gY2FuIHN0YXJ0IGFnYWluKVxuICAgIHZpc2l0ZWRQYWdlcz1bXTtjdXJyZW50UGFnZT1udWxsO3Nob3dIZWxwKCk7XG4gICAgLy8gJ21hbnVhbGx5JyBtb3ZlIHRvIHRoZSBwcmV2aW91cyAncGFnZScgaW4gdGhlIGhpc3RvcnkuLi5cbiAgICBjb25zb2xlLmxvZyhcIkxlbmd0aCBvZiBoaXN0b3J5OiBcIix3aW5kb3cuaGlzdG9yeS5sZW5ndGgpO1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICAqL1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJQbGF5ZXIoY2xpZW50c29ja2V0KXtcbiAgICBpZighcmVnaXN0ZXJpbmdQbGF5ZXJJZClyZXR1cm47IC8vIGlmIGEgcmVzcG9uc2Ugd2FzIHJlY2VpdmVkIHJlZ2lzdGVyaW5nUGxheWVySWQgd2lsbCBiZSBudWxsIChzZWUgYmVsb3cpXG4gICAgdHJ5e1xuICAgICAgICBzZXRJbmZvKFwiSmUgd29yZHQgYWFuZ2VtZWxkIGFscyBzcGVsZXIuXCIsXCJTcGVsXCIpO1xuICAgICAgICBjdXJyZW50R2FtZS5fc29ja2V0LmVtaXQoJ1BMQVlFUicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge25hbWU6Y3VycmVudFBsYXllci5uYW1lLGlkOmdldENvb2tpZSgnY29ubmVjdC5zaWQnKX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpPT57IC8vIHRoZSBzZXJ2ZXIgcmVzcG9uZGVkISEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJpbmdQbGF5ZXJJZD1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSByZWZlcmVuY2Ugc28gcmVnaXN0ZXJpbmcgd2lsbCBzdG9wISEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSmUgYmVudCBhbHMgc3BlbGVyIGFmZ2V3ZXplbiwgb21kYXQgamUgZWxkZXJzIGFsIG1lZXNwZWVsdCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEJ1dHRvbkNsaWNrZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkplIGJlbnQgYWxzIHNwZWxlciBhYW5nZW1lbGQhXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIH1maW5hbGx5e1xuICAgICAgICByZWdpc3RlcmluZ1BsYXllcklkPXNldFRpbWVvdXQocmVnaXN0ZXJQbGF5ZXIsMjUwMCk7IC8vIHRyeSBhZ2FpbiBpbiAyLjUgc2Vjb25kc1xuICAgIH1cbn0gLy8gZXZlcnkgMi41IHNlY29uZHNcblxuLy8gTURIQDEwSkFOMjAyMDogbmV3R2FtZSgpIGlzIGEgYmlkIGRpZmZlcmVudCB0aGFuIGluIHRoZSBkZW1vIHZlcnNpb24gaW4gdGhhdCB3ZSByZXR1cm4gdG8gdGhlIHdhaXRpbmctcGFnZVxuZnVuY3Rpb24gbmV3R2FtZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBfc2V0UGxheWVyKG51bGwpOyAvLyBNREhAMTJGRUIyMDIwOiB0aGlzIHdpbGwgYWxsb3cgdXMgdG8gdGVzdCBmb3IgaXQgaW4gb25iZWZvcmV1bmxvYWQuLi5cbiAgICAvLyBNREhAMTJGRUIyMDIwOiB0aGUgZWFzaWVzdCB3YXkgdG8gZG8gdGhpcyBpcyBieSBmb3JjaW5nIGEgcmVsb2FkIEJVVCBzZWUgaG93IHRoZSBnYW1lIGVuZ2luZSByZXNwb25kc1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoLyp0cnVlKi8pOyAvLyBmcm9tIGNhY2hlIGlzIGZpbmUgYXMgbG9uZyBhcyBzZXRQbGF5ZXJOYW1lKCkgaXMgZXhlY3V0ZWQgYWdhaW4hISEhXG4gICAgLyogcmVwbGFjaW5nOlxuICAgIC8vIG1lYW5zOiBkbyBub3QgZm9yZ2V0IGFib3V0IG1lIHBsYXlpbmcgaS5lLiBrZWVwIG1lIG9uIHRoZSBnYW1lcGxheWluZyBwYWdlXG4gICAgLy8gTURIQDA1RkVCMjAyMDogaXQncyBwcnVkZW50IHRvIHN0YXJ0IGNvbXBsZXRlbHkgb3ZlciB3aXRoIGEgbmV3IHBsYXllciB3aXRoIHRoZSBzYW1lIG5hbWUhISEhXG4gICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuIGFsZXJ0KFwiSGVsYWFzIGtlbm5lbiB3ZSBqZSBuaWV0LCBkdXMgamUgenVsdCBuaWV0IGt1bm5lbiBzcGVsZW4hXCIpO1xuICAgIHVwZGF0ZUdhbWVPdmVyQnV0dG9ucyhmYWxzZSk7IC8vIGRpc2FibGUgdGhlIGdhbWUgb3ZlciBidXR0b25zXG4gICAgc2V0UGxheWVyTmFtZShjdXJyZW50UGxheWVyLm5hbWUpO1xuICAgICovXG59XG5cbnZhciB0b01ha2VBQmlkPTAsYmlkTWFkZT0tMTsgLy8gTURIQDAzRkVCMjAyMDogc29tZSBwcm90ZWN0aW9uIGZvciBwcmV2ZW50aW5nIG1ha2luZyBhIGJpZCB3aGVuIG5vdCBiZWluZyBhc2tlZCBvciBhZnRlciBoYXZpbmcgbWFkZSBhIGJpZFxudmFyIHRvUGxheUFDYXJkPTAscGxheWVkQ2FyZEluZm89bnVsbDsgLy8gTURIQDA1RkVCMjAyMDogdGhlIGNhcmQgcGxheWVkIHRoYXQgbmVlZHMgdG8gYmUgcmVtZW1iZXJlZCBzbyB3ZSBjYW4gc2VuZCBpdCBhZ2FpblxudmFyIHRvQ2hvb3NlVHJ1bXBTdWl0ZT0wLGNob3NlblRydW1wU3VpdGU9LTE7XG52YXIgdG9DaG9vc2VQYXJ0bmVyU3VpdGU9MCxjaG9zZW5QYXJ0bmVyU3VpdGU9LTE7XG5cbmZ1bmN0aW9uIGdldExvY2FsZUNhcmRUZXh0KGNhcmQpe3JldHVybiBMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tjYXJkLnN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2NhcmQucmFua107fVxuXG4vLyBNREhAMjlKQU4yMDIwOiBkZWNpZGluZyB0byBhbHdheXMgc2hvdyB0aGUgdXNlciBuYW1lIGluIHRoZSBkb2N1bWVudCB0aXRsZSwgYW5kIHRvIGJsaW5rIGl0IHdoZW5cbi8vICAgICAgICAgICAgICAgIHVzZXIgaW5wdXQgaXMgcmVxdWlyZWRcbnZhciBmb3JjZUZvY3VzSWQ9bnVsbDtcbnZhciBmb3JjZUZvY3VzVGV4dD1udWxsO1xuZnVuY3Rpb24gc3RvcEZvcmNlRm9jdXMoKXtjbGVhckludGVydmFsKGZvcmNlRm9jdXNJZCk7Zm9yY2VGb2N1c0lkPW51bGw7fVxuZnVuY3Rpb24gY2hlY2tGb2N1cyhzdGF0ZSl7XG4gICAgLy8gTURIQDIzSkFOMjAyMDogd2Ugc2hvdWxkIGtlZXAgYmxpbmtpbmcgd2hlbiBub3QgaW4gZm9jdXMgdW50aWwgZm9yY2VkIHRvIHN0b3BcbiAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHN0b3BwaW5nIHdoZW4gdGhlIGZvY3VzIHdhcyBnb3RcbiAgICAvLyBNREhAMjlKQU4yMDIwIHJlbW92aW5nIHRoaXMgc2hvdWxkIHN1ZmZpY2U6IGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSBcbiAgICAvLy8vLy8vLyB0b2dnbGVHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpO1xuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpe3Nob3dHYW1lU3RhdGUoc3RhdGUpO3N0b3BGb3JjZUZvY3VzKCk7fWVsc2UgdG9nZ2xlR2FtZVN0YXRlKHN0YXRlKTtcbn1cbmZ1bmN0aW9uIGZvcmNlRm9jdXMoc3RhdGUpe1xuICAgIC8vIGlmKHN0YXRlKVxuICAgIGZvcmNlRm9jdXNUZXh0PXN0YXRlO1xuICAgIHNob3dHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpOyAvLyBhc2NlcnRhaW4gdG8gc3RhcnQgd2l0aCB0aGUgZ2l2ZW4gbm9uLW51bGwgJ3N0YXRlJ1xuICAgIGlmKHN0YXRlKXsgLy8gZm9jdXMgcmVxdWVzdGVkXG4gICAgICAgIC8vIHN0YXJ0IGdldHRpbmcgdGhlIGZvY3VzIGJ5IGJsaW5raW5nICdzdGF0ZScgSUZGIHdlIGhhdmVuJ3QgZ290IGl0IHlldC4uLlxuICAgICAgICBpZighZm9yY2VGb2N1c0lkKWZvcmNlRm9jdXNJZD1zZXRJbnRlcnZhbCgoKT0+e2NoZWNrRm9jdXMoc3RhdGUpfSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIE1ESEAzMUpBTjIwMjA6IGtlZXAgYSAnc3RhdGUnIHdoaWNoIHdpbGwgZGV0ZXJtaW5lIHdoYXQgbWVzc2FnZXMgdGhlIHBsYXllciBjYW4gc2VuZCBvdmVyIHRvIHRoZSBzZXJ2ZXJcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU9MDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0JJRD0xO1xuY29uc3QgUExBWUVSU1RBVEVfQklEPTIsUExBWUVSU1RBVEVfQklEX0RPTkU9MyxQTEFZRVJTVEFURV9CSURfUkVDRUlWRUQ9NDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX1BMQVk9NTtcbmNvbnN0IFBMQVlFUlNUQVRFX1RSVU1QPTYsUExBWUVSU1RBVEVfVFJVTVBfRE9ORT03LFBMQVlFUlNUQVRFX1RSVU1QX1JFQ0VJVkVEPTg7XG5jb25zdCBQTEFZRVJTVEFURV9QQVJUTkVSPTksUExBWUVSU1RBVEVfUEFSVE5FUl9ET05FPTEwLFBMQVlFUlNUQVRFX1BBUlRORVJfUkVDRUlWRUQ9MTE7XG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9DQVJEPTEyO1xuY29uc3QgUExBWUVSU1RBVEVfQ0FSRD0xMyxQTEFZRVJTVEFURV9DQVJEX1BMQVlFRD0xNCxQTEFZRVJTVEFURV9DQVJEX1JFQ0VJVkVEPTE1O1xuY29uc3QgUExBWUVSU1RBVEVfR0FNRV9PVkVSPTE2O1xuY29uc3QgUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRFM9MTcsUExBWUVSU1RBVEVfR0FNRV9SRUNFSVZFRD0xOCxQTEFZRVJTVEFURV9DQVJEU19SRUNFSVZFRD0xOTtcbi8vIE1ESEAwMUZFQjIwMjA6IHdlJ3JlIE5PVCBhbGxvd2luZyB0byByZXNlbmQgdGhlIGNhcmQgcGxheWVkIGJlY2F1c2UgdGhhdCdzIGFscmVhZHkgZG9uZSAoZXZlcnkgMTAgc2Vjb25kcykgYnkgXG5jb25zdCBwbGF5ZXJTdGF0ZU1lc3NhZ2VzPVtcIklrIHdhY2h0IG9wIGVlbiBzcGVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGJvZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTW9tZW50amUgbm9nXCIsXCJCb2QgYWwgdmVyc3R1dXJkXCIsXCJCb2Qgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTGF0ZW4gd2Ugc3BlbGVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIlRyb2Vma2xldXIgYWwgZ2Vrb3plblwiLFwiVHJvZWZrbGV1ciBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcIk1vbWVudGplIG5vZ1wiLFwiUGFydG5lciBhbCBnZWtvemVuXCIsXCJLbGV1ciBwYXJ0bmVya2FhcnQgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGthYXJ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIkthYXJ0IGFsIGdlc3BlZWxkXCIsXCJLYWFydCBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIklrIHdhY2h0IG9wIGthYXJ0ZW5cIixcIlNwZWwgYmVnb25uZW5cIixcIkJlZGFua3Qgdm9vciBkZSBrYWFydGVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF07XG52YXIgY3VycmVudFBsYXllclN0YXRlPVBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU7XG5cbnZhciBzZW5kTWVzc2FnZVRleHQ7XG5mdW5jdGlvbiBzZW5kTWVzc2FnZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBpZihjdXJyZW50R2FtZSYmY3VycmVudEdhbWUuX3NvY2tldCl7XG4gICAgICAgIC8vIGRvbid0IHNlbmQgYW55IHRleHQgaWYgc2VuZGluZyB0aGUgZGVmYXVsdCB0ZXh0XG4gICAgICAgIGxldCB0ZXh0VG9TZW5kPShzZW5kTWVzc2FnZVRleHQudmFsdWUhPT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0/c2VuZE1lc3NhZ2VUZXh0LnZhbHVlOicnKTtcbiAgICAgICAgLy8gaWYgbm8gdGV4dCBlbnRlcmVkIHRvIGJlIHNlbnQsIGFzayBwbGF5ZXIgd2hldGhlclxuICAgICAgICBpZih0ZXh0VG9TZW5kLnRyaW0oKS5sZW5ndGg9PT0wJiYhY29uZmlybShcIkVyIGlzIGdlZW4gdGUgdmVyc3R1cmVuIHRla3N0LiBXaWx0IFUgdG9jaCB2ZXJzdHVyZW4/XCIpKXJldHVybjtcbiAgICAgICAgc2V0SW5mbyhcIj9cIixcIkppalwiKTtcbiAgICAgICAgLy8gTURIQDA2RkVCMjAyMDogTk9UIHVzaW5nIHNlbmRUb1NlcnZlciBoZXJlIGJlY2F1c2Ugbm90IHN1cmUgaWYgc2VuZFRvU2VydmVyIGlzIHJlLWVudHJhbnQhISEhXG4gICAgICAgIGN1cnJlbnRHYW1lLl9zb2NrZXQuZW1pdCgnUExBWUVSX1NBWVMnLHsnc3RhdGUnOmN1cnJlbnRQbGF5ZXJTdGF0ZSwndGV4dCc6dGV4dFRvU2VuZH0sKHJlc3BvbnNlKT0+e1xuICAgICAgICAgICAgc2V0SW5mbyhyZXNwb25zZSYmcmVzcG9uc2UubGVuZ3RoPjA/cmVzcG9uc2U6XCJCZXJpY2h0IG9udHZhbmdlbiwgbWFhciBnZWVuIGFudHdvb3JkIGdlc3R1dXJkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgLy8gaWYgdGhlIG1lc3NhZ2UgdGV4dCBkaWZmZXJlZCBmcm9tIHRoZSBkZWZhdWx0IG1lc3NhZ2Ugd2UgY2xlYXIgdGhlIG1lc3NhZ2UgdGV4dFxuICAgICAgICAgICAgaWYoc2VuZE1lc3NhZ2VUZXh0LnZhbHVlIT09cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdKXNlbmRNZXNzYWdlVGV4dC52YWx1ZT0nJztcbiAgICAgICAgfSk7XG4gICAgfWVsc2VcbiAgICAgICAgYWxlcnQoXCJKZSBiZW50IGJsaWprYmFhciBnZXN0b3B0IG1ldCBzcGVsZW4hIE9tIHdlZXIgdGUga3VubmVuIHNwZWxlbiBtb2V0IGplIGRlIHBhZ2luYSBvcG5pZXV3IGxhZGVuIVwiKTtcbn1cbmZ1bmN0aW9uIHNldFBsYXllclN0YXRlKHBsYXllclN0YXRlKXtcbiAgICAvL2lmKHJlc2VuZEV2ZW50SWQpe2NsZWFyVGltZW91dChyZXNlbmRFdmVudElkKTtyZXNlbmRFdmVudElkPW51bGw7fSAvLyBnZXQgcmlkIG9mIGFueSBwZW5kaW5nIHJlc2VuZCBldmVudCB0aW1lb3V0XG4gICAgbGV0IHJlcGxhY2VNZXNzYWdlVGV4dD0oc2VuZE1lc3NhZ2VUZXh0LnZhbHVlLmxlbmd0aD09PTB8fHNlbmRNZXNzYWdlVGV4dC52YWx1ZT09PXBsYXllclN0YXRlTWVzc2FnZXNbY3VycmVudFBsYXllclN0YXRlXSk7IC8vIHVzZXIgaGFzbid0IGNoYW5nZWQgdGhlIHRleHQgdG8gc2VuZCBtYW51YWxseS4uLlxuICAgIGN1cnJlbnRQbGF5ZXJTdGF0ZT1wbGF5ZXJTdGF0ZTtcbiAgICAvLyBzZXQgdGhlIG1lc3NhZ2UgdGV4dCBvbiB0aGUgc2VuZCBtZXNzYWdlIHRleHQgaW5wdXQgZmllbGQgYWNjb3JkaW5nbHlcbiAgICBpZihyZXBsYWNlTWVzc2FnZVRleHQpc2VuZE1lc3NhZ2VUZXh0LmlubmVyVGV4dD1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV07XG4gICAgLyogcmVzZW5kaW5nIGFscmVhZHkgbWFuYWdlZCBieSB0aGUgZ2FtZSAoc2VlIGNhcmRQbGF5ZWQsIGJpZE1hZGUsIHRydW1wU3VpdGVDaG9zZW4gYW5kIHBhcnRuZXJTdWl0ZUNob3NlbilcbiAgICBzZW5kTWVzc2FnZUJ1dHRvbi5kaXNhYmxlZD0oc2VuZE1lc3NhZ2VUZXh0PT09XCJTdHV1ciBvcG5pZXV3XCIpO1xuICAgIC8vIGlmIHRoZSBidXR0b24gaXMgY3VycmVudGx5IGRpc2FibGVkIG9ubHkgYWxsb3cgcmVzZW5kaW5nIHRoZSBldmVudCBidXQgbm90IHVudGlsIGFmdGVyIDUgc2Vjb25kc1xuICAgIGlmKHNlbmRNZXNzYWdlQnV0dG9uLmRpc2FibGVkKXJlc2VuZEV2ZW50SWQ9c2V0VGltZW91dChhbGxvd1Jlc2VuZEV2ZW50LDUwMDApOyAvLyBhbGxvdyByZXNlbmRpbmcgYWZ0ZXIgNSBzZWNvbmRzXG4gICAgKi9cbn1cblxuLy8gb2YgY291cnNlOiBmcm9tIHN0YWNrb3ZlcmZsb3chISFcbmZ1bmN0aW9uIGRpZmZlcmVuY2UoYTEsYTIpe3ZhciBhMlNldD1uZXcgU2V0KGEyKTtyZXR1cm4gYTEuZmlsdGVyKCh4KT0+IWEyU2V0Lmhhcyh4KSk7fVxuXG52YXIgYmlkZGVyQ2FyZHNFbGVtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLWNhcmRzXCIpO1xuXG5mdW5jdGlvbiBoYW5kbGVDb2xsYXBzaW5nRXZlbnQoZXZlbnQpe1xuICAgIGxldCBjb2xsYXBzaW5nQnV0dG9uPWV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29sbGFwc2luZ0J1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJ1dHRvblwiKTsgLy8gYSBoYSwgZGlkbid0IGtub3cgdGhpc1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbGxhcHNpbmdCdXR0b24uZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xsYXBzaWJsZVwiKSkuc3R5bGUuZGlzcGxheT0odGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtYnV0dG9uXCIpP1wiYmxvY2tcIjpcIm5vbmVcIik7XG59XG5mdW5jdGlvbiBpbml0aWFsaXplQ29sbGFwc2luZ0J1dHRvbnMoKXtcbiAgICAvLyBNREhAMDVGRUIyMDIwOiBhdHRhY2ggZXZlbnQgaGFuZGxlciBvbiBjbGljayBvZiBldmVyeSBjb2xsYXBzaWJsZSBidXR0b24gdG9nZ2xpbmdcbiAgICBmb3IobGV0IGNvbGxhcHNpbmdCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbGxhcHNpbmctYnV0dG9uXCIpKWNvbGxhcHNpbmdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsaGFuZGxlQ29sbGFwc2luZ0V2ZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgdiA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgnKF58OykgPycgKyBuYW1lICsgJz0oW147XSopKDt8JCknKTtcbiAgICByZXR1cm4gdiA/IHZbMl0gOiBudWxsO1xufVxuLy8gZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG4vLyAgICAgdmFyIGQgPSBuZXcgRGF0ZTtcbi8vICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKmRheXMpO1xuLy8gICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlICsgXCI7cGF0aD0vO2V4cGlyZXM9XCIgKyBkLnRvR01UU3RyaW5nKCk7XG4vLyB9XG4vLyBmdW5jdGlvbiBkZWxldGVDb29raWUobmFtZSkgeyBzZXRDb29raWUobmFtZSwgJycsIC0xKTsgfVxuXG4vKipcbiAqIHNob3dzIHRoZSBjdXJyZW50IHBsYXllciBuYW1lcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGdhbWVcbiAqL1xuZnVuY3Rpb24gc2hvd1BsYXllck5hbWVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO2lmKCFyaWtrZW5UaGVHYW1lKXJldHVybjtcbiAgICAvLyBzaG93IHRoZSBwbGF5ZXIgbmFtZXMgaW4gdGhlIGJpZHMgdGFibGVcbiAgICBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpO1xuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgaGVhZGVyIHJvdyBvZiB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZVxuICAgIGZvcihsZXQgdHJpY2tzUGxheWVkVGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyaWNrcy1wbGF5ZWQtdGFibGVcIikpe1xuICAgICAgICBsZXQgdHJpY2tzUGxheWVkVGFibGVIZWFkZXI9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRoZWFkXCIpO1xuICAgICAgICBsZXQgcm93PXRyaWNrc1BsYXllZFRhYmxlSGVhZGVyLmNoaWxkcmVuWzBdOyAvLyB0aGUgcm93IHdlJ3JlIGludGVyZXN0ZWQgaW4gZmlsbGluZ1xuICAgICAgICBmb3IocGxheWVyPTA7cGxheWVyPDQ7cGxheWVyKyspe1xuICAgICAgICAgICAgbGV0IGNlbGw9cm93LmNoaWxkcmVuW3BsYXllcisxXTsgLy8gdXNlIHBsYXllciB0byBnZXQgdGhlICdyZWFsJyBwbGF5ZXIgY29sdW1uISFcbiAgICAgICAgICAgIGxldCBwbGF5ZXJOYW1lPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXIpOlwiP1wiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSByZXBsYWNlZCBieSBjdXJyZW50UGxheWVyLmdhbWVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmFtZSBvZiBwbGF5ZXIgI1wiKyhwbGF5ZXIrMSkrXCI6ICdcIitwbGF5ZXJOYW1lK1wiJy5cIik7XG4gICAgICAgICAgICBjZWxsLmlubmVySFRNTD1wbGF5ZXJOYW1lO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgY2FyZHMgcGxheWVkIHRhYmxlIGFzIHdlbGxcbiAgICBsZXQgcGxheWVySW5kZXg9cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMSklNCkpO1xuICAgIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Bwb3NpdGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsyKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodGhhbmRzaWRlLXBsYXllci1uYW1lXCIpLHJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZSgocGxheWVySW5kZXgrMyklNCkpO1xufVxuXG4vLyB3aGVuZXZlciB0aGUgcGxheWVyIGNoYW5nZXMsIHNob3cgdGhlIHBsYXllciBuYW1lXG5mdW5jdGlvbiBzaG93Q3VycmVudFBsYXllck5hbWUoKXtcbiAgICAvLyBzaG93R2FtZVN0YXRlKGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5uYW1lOm51bGwpOyAvLyBzaG93IHRoZSBjdXJyZW50IHBsYXllciBuYW1lIGltbWVkaWF0ZWx5IGluIHRoZSB0aXRsZVxuICAgIGZvcihsZXQgcGxheWVyTmFtZUVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lXCIpKVxuICAgICAgICBpZihwbGF5ZXJOYW1lRWxlbWVudClcbiAgICAgICAgICAgIHBsYXllck5hbWVFbGVtZW50LmlubmVySFRNTD0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6XCI/XCIpO1xufVxuXG4vKipcbiAqIHVwZGF0ZXMgdGhlIHdhaXRpbmctZm9yLXBsYXllcnMgcGFnZVxuICogZGVwZW5kaW5nIG9uIHdoZXRoZXIgb3Igbm90IGEgZ2FtZSBpcyBiZWluZyBwbGF5ZWQgKHlldCksIHdlIHNob3cgdGhlIGdhbWUgaWQgYW5kIHRoZSBwbGF5ZXIgbmFtZXNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlR2FtZVBsYXllck5hbWVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1uYW1lXCIpLmlubmVySFRNTD0ocmlra2VuVGhlR2FtZT9yaWtrZW5UaGVHYW1lLm5hbWU6XCJcIik7XG4gICAgbGV0IHBsYXllck5hbWVzPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZXMoKTpudWxsKTtcbiAgICBmb3IobGV0IHBsYXllck5hbWVTcGFuIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYW1lLXBsYXllci1uYW1lXCIpKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXBsYXllck5hbWVTcGFuLmdldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWluZGV4XCIpO1xuICAgICAgICBwbGF5ZXJOYW1lU3Bhbi5pbm5lckhUTUw9cGxheWVyTmFtZXNbcGxheWVySW5kZXhdO1xuICAgICAgICBwbGF5ZXJOYW1lU3Bhbi5jb2xvcj0ocGxheWVySW5kZXg9PXJpa2tlblRoZUdhbWUuX3BsYXllckluZGV4P1wiQkxVRVwiOlwiQkxBQ0tcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIGNsZWFycyB0aGUgYmlkcyB0YWJsZVxuICogdG8gYmUgY2FsbGVkIHdpdGggZXZlcnkgbmV3IGdhbWVcbiAqL1xuZnVuY3Rpb24gY2xlYXJCaWRzVGFibGUoZmlyc3RDb2x1bW5JbmRleCl7XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBiaWRUYWJsZVJvdyBvZiBiaWRUYWJsZS5jaGlsZHJlbilcbiAgICAgICAgZm9yKGxldCBiaWRUYWJsZUNvbHVtbkluZGV4IGluIGJpZFRhYmxlUm93LmNoaWxkcmVuKVxuICAgICAgICAgICAgaWYoYmlkVGFibGVDb2x1bW5JbmRleD49Zmlyc3RDb2x1bW5JbmRleClcbiAgICAgICAgICAgICAgICBiaWRUYWJsZVJvdy5jaGlsZHJlbltiaWRUYWJsZUNvbHVtbkluZGV4XS5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKCFlbGVtZW50KXtjb25zb2xlLmVycm9yKFwiTm8gZWxlbWVudCFcIik7cmV0dXJuO31cbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8vIE1ESEAyM0pBTjIwMjA6IHdoZW4gc2hvd2luZyB0aGUgcGxheWVyIG5hbWUgd2Ugc2V0IHRoZSBjb2xvciB0byBibGFjayAoanVzdCBpbiBjYXNlIGl0J3Mgbm90IGJsYWNrIGFueW1vcmUpXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIGVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO1xufVxuZnVuY3Rpb24gc2hvd1BsYXllclR5cGUoZWxlbWVudCxwbGF5ZXJUeXBlKXtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7IC8vIHR5cGljYWxseSB2YWx1ZSAyIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhlIHBsYXllciBpdHNlbGYhISFcbiAgICB9XG59XG5cbi8vIE1ESEAyMEpBTjIwMjA6IGtlZXAgdGhlIGlkcyBvZiB0aGUgdHJpY2sgcGxheWVkIGNhcmRzIGluIGEgY29uc3RhbnQgYXJyYXlcbmNvbnN0IFBMQVlFRF9DQVJEX0lEUz1bXCJjdXJyZW50LXBsYXllci1jYXJkXCIsXCJsZWZ0aGFuZHNpZGUtcGxheWVyLWNhcmRcIixcIm9wcG9zaXRlLXBsYXllci1jYXJkXCIsXCJyaWdodGhhbmRzaWRlLXBsYXllci1jYXJkXCJdO1xuXG4vLyB0byBiZSBjYWxsZWQgb24gcmVjZWl2aW5nIHRoZSBuZXcgdHJpY2sgZXZlbnRcbmZ1bmN0aW9uIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpe1xuICAgIGZvcihsZXQgcGxheWVkQ2FyZEluZGV4IGluIFBMQVlFRF9DQVJEX0lEUylcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoUExBWUVEX0NBUkRfSURTW3BsYXllZENhcmRJbmRleF0pLmlubmVySFRNTD1cIlwiO1xufVxuXG4vKipcbiAqIHNob3dzIHRoZSBnaXZlbiB0cmlja1xuICogQHBhcmFtIHsqfSB0cmljayBcbiAqL1xuZnVuY3Rpb24gc2hvd1RyaWNrKHRyaWNrLyoscGxheWVySW5kZXgqLyl7XG4gICAgXG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdHJpY2sgXCIsdHJpY2spO1xuICAgIFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcblxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIHRydW1wIHBsYXllciB0aGF0IGlzIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgKGVpdGhlciBub24tYmxpbmQgb3IgYmxpbmQpIGZsYWcgdGhlIGNoZWNrYm94XG4gICAgaWYodHJpY2suZmlyc3RQbGF5ZXI9PT1wbGF5ZXJJbmRleCYmdHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCcpLmNoZWNrZWQ9dHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtYmxpbmQnKS5pbm5lckhUTUw9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDA/XCJibGluZCBcIjpcIlwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgIH1lbHNlXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuXG4gICAgLy8gYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgaW5mb1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNraW5nLWZvci1wYXJ0bmVyLWNhcmQtaW5mb1wiKS5zdHlsZS5kaXNwbGF5PSh0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PTA/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAvL2xldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1jYXJkcy10YWJsZVwiKS5yZXF1ZXN0U2VsZWN0b3IoXCJ0Ym9keVwiKTtcblxuICAgIC8vIHRoZSBwbGF5ZXIgdHlwZSBjYW4gY2hhbmdlIGV2ZXJ5IGNhcmQgYmVpbmcgcGxheWVkIChiYXNlZCBvbiB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXIpXG4gICAgLy8gVE9ETyBzaG91bGRuJ3QgbmVlZCB0byBkbyB0aGUgZm9sbG93aW5nOlxuICAgIC8vIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudC1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpLC0yKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzEpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wcG9zaXRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMiklNCkpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzMpJTQpKTtcbiAgICBcbiAgICAvLyBOT1RFIHRoZSBmaXJzdCBjYXJkIGNvdWxkIGJlIHRoZSBibGluZCBjYXJkIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZCBub3Qgc2hvdyBpdCEhXG4gICAgLy8gICAgICBidXQgb25seSB0aGUgY29sb3Igb2YgdGhlIHBhcnRuZXIgc3VpdGVcbiAgICBsZXQgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD0odHJpY2subnVtYmVyT2ZDYXJkcz4wJiZ0cmljay5fY2FyZHNbMF0uc3VpdGUhPT10cmljay5wbGF5U3VpdGUpO1xuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHNob3cgYWxsIHRoZSB0cmljayBjYXJkcyBwbGF5ZWQgYXQgdGhlIHJpZ2h0IHBvc2l0aW9uXG4gICAgZm9yKGxldCB0cmlja0NhcmRJbmRleD0wO3RyaWNrQ2FyZEluZGV4PDQ7dHJpY2tDYXJkSW5kZXgrKyl7XG4gICAgICAgIGxldCB0cmlja0NhcmQ9KHRyaWNrQ2FyZEluZGV4PHRyaWNrLm51bWJlck9mQ2FyZHM/dHJpY2suX2NhcmRzW3RyaWNrQ2FyZEluZGV4XTpudWxsKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBsYXllckluZGV4PXRyaWNrLmZpcnN0UGxheWVyK3RyaWNrQ2FyZEluZGV4OyAvLyB0aGUgYWN0dWFsIHBsYXllciBpbmRleCBpbiB0aGUgZ2FtZVxuICAgICAgICBsZXQgdHJpY2tDYXJkUG9zaXRpb249KHRyaWNrQ2FyZFBsYXllckluZGV4KzQtcGxheWVySW5kZXgpJTQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJpY2sgY2FyZCBwb3NpdGlvbjogXCIrdHJpY2tDYXJkUG9zaXRpb24rXCIuXCIpO1xuICAgICAgICBsZXQgdHJpY2tDYXJkSWQ9UExBWUVEX0NBUkRfSURTW3RyaWNrQ2FyZFBvc2l0aW9uXTtcbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCl7XG4gICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPWZhbHNlOyAvLyBkbyBub3QgZG8gdGhpcyBmb3IgdGhlIG5leHQgcGxheWVyc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLHRyaWNrLnBsYXlTdWl0ZSk7ICBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdHJpY2sgY2FyZCAjXCIrdHJpY2tDYXJkSW5kZXgsdHJpY2tDYXJkKTtcbiAgICAgICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmlja0NhcmQsdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0odHJpY2tDYXJkUGxheWVySW5kZXglNCk/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPzE6LTEpOjApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgbGV0IHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD0oYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD8oNCt0cmljay5maXJzdFBsYXllci1wbGF5ZXJJbmRleCklNDowKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTEpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsxKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMSklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzEpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTIpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsyKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMiklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzIpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTMpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCszKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMyklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzMpJTQpPzE6LTEpOjApKTtcbiAgICAqL1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdWl0ZUNhcmRSb3dzKHJvd3Msc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgc3VpdGUgY2FyZCByb3dzOiBcIityb3dzLmxlbmd0aCtcIi5cIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgIGxldCBzdWl0ZT0wO1xuICAgIGZvcihsZXQgcm93IG9mIHJvd3Mpe1xuICAgICAgICAvLy8vLy8vLy9sZXQgc3VpdGVDb2xvcj1TVUlURV9DT0xPUlNbc3VpdGUlMl07XG4gICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgbGV0IGNlbGxzPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZD0wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIGZvcihsZXQgY2VsbCBvZiBjZWxscyl7XG4gICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgaWYoY2FyZEluU3VpdGUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbY2FyZEluU3VpdGUuc3VpdGVdKTsgLy8gcmVwbGFjaW5nOiBjZWxsLnN0eWxlLmNvbG9yPXN1aXRlQ29sb3I7ICBcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgIHN1aXRlQ2FyZCsrO1xuICAgICAgICB9XG4gICAgICAgIHN1aXRlKys7XG4gICAgfVxufVxuLy8gaW4gdGhyZWUgZGlmZmVyZW50IHBhZ2VzIHRoZSBwbGF5ZXIgY2FyZHMgc2hvdWxkIGJlIHNob3duLi4uXG5mdW5jdGlvbiB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyBmb3IgYmlkZGluZy5cIik7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cblxuLyoqXG4gKiBmb3IgcGxheWluZyB0aGUgY2FyZHMgYXJlIHNob3duIGluIGJ1dHRvbnMgaW5zaWRlIHRhYmxlIGNlbGxzXG4gKiBAcGFyYW0geyp9IHN1aXRlQ2FyZHMgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdHJ5e1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgdG8gY2hvb3NlIGZyb20uXCIpO1xuICAgICAgICAvLy8vLy8vLy8vaWYoY3VycmVudFBhZ2U9PT1cInBhZ2UtcGxheWluZ1wiKWFsZXJ0KFwiU2hvd2luZyB0aGUgcGxheWluZyBjYXJkcyBhZ2FpbiFcIik7XG4gICAgICAgIGxldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItc3VpdGVjYXJkcy10YWJsZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKiogU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgICAgICBsZXQgcm93cz10YWJsZWJvZHkucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgICAgICBsZXQgcm93PXJvd3Nbc3VpdGVdO1xuICAgICAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5zPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvcihsZXQgc3VpdGVDYXJkPTA7c3VpdGVDYXJkPGNvbHVtbnMubGVuZ3RoO3N1aXRlQ2FyZCsrKXtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbGJ1dHRvbj1jb2x1bW5zW3N1aXRlQ2FyZF0vKi5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1idXR0b25dXCIpKi87XG4gICAgICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxidXR0b24uY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbGJ1dHRvbi5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyBoaWRlIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwbGF5ZXIgY2FyZHMgdG8gY2hvb3NlIGZyb20gc2hvd24hXCIpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpOyAvLyB3aGVuZXZlciB0aGUgc3VpdGUgY2FyZHMgc2hvd2luZyBjaGFuZ2Ugd2UgbWFrZSB0aGVtIGNsaWNrYWJsZVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGlmKCFkZWx0YVBvaW50c3x8IXBvaW50cyl7Y29uc29sZS5sb2coXCJFUlJPUjogUmVzdWx0cyBub3cga25vd24geWV0IVwiKTtyZXR1cm47fVxuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXBhcnNlSW50KHBsYXllclJlc3VsdHNSb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaW5kZXhcIikpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzFdLmlubmVySFRNTD0oZGVsdGFQb2ludHM/U3RyaW5nKHJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXJJbmRleCkpOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsyXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhkZWx0YVBvaW50c1twbGF5ZXJJbmRleF0pOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblszXS5pbm5lckhUTUw9U3RyaW5nKHBvaW50c1twbGF5ZXJJbmRleF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKXtcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZUNlbGwgb2YgdHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvckFsbCgndGQnKSl7XG4gICAgICAgICAgICB0cmlja3NQbGF5ZWRUYWJsZUNlbGwuaW5uZXJIVE1MPVwiXCI7dHJpY2tzUGxheWVkVGFibGVDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvcj0ndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgbGFzdFRyaWNrUGxheWVkSW5kZXg9cmlra2VuVGhlR2FtZS5udW1iZXJPZlRyaWNrc1BsYXllZC0xOyAvLyBnZXR0ZXIgY2hhbmdlZCB0byBnZXRNZXRob2QgY2FsbFxuICAgIGlmKGxhc3RUcmlja1BsYXllZEluZGV4Pj0wKXtcbiAgICAgICAgbGV0IHRyaWNrPXJpa2tlblRoZUdhbWUuX3RyaWNrOyAvLyBNREhAMjBKQU4yMDIwIHJlcGxhY2luZzogZ2V0VHJpY2tBdEluZGV4KGxhc3RUcmlja1BsYXllZEluZGV4KTtcbiAgICAgICAgaWYoIXRyaWNrKXtjb25zb2xlLmxvZyhcIkVSUk9SOiBObyB0cmljayB0byB1cGRhdGUgdGhlIHRyaWNrcyB0YWJsZSB3aXRoIVwiKTtyZXR1cm47fVxuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLmNoaWxkcmVuW2xhc3RUcmlja1BsYXllZEluZGV4XTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9U3RyaW5nKGxhc3RUcmlja1BsYXllZEluZGV4KzEpO1xuICAgICAgICAgICAgZm9yKHRyaWNrUGxheWVyPTA7dHJpY2tQbGF5ZXI8dHJpY2suX2NhcmRzLmxlbmd0aDt0cmlja1BsYXllcisrKXtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyPSh0cmlja1BsYXllcit0cmljay5maXJzdFBsYXllciklNDtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bMipwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICAgICAgbGV0IGNhcmQ9dHJpY2suX2NhcmRzW3RyaWNrUGxheWVyXTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpOyAvLyBwdXQgfCBpbiBmcm9udCBvZiBmaXJzdCBwbGF5ZXIhISFcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBiYWNrZ3JvdW5kIHRoZSBjb2xvciBvZiB0aGUgcGxheSBzdWl0ZSBhZnRlciB0aGUgbGFzdCBwbGF5ZXIsIHNvIHdlIGtub3cgd2hlcmUgdGhlIHRyaWNrIGVuZGVkISFcbiAgICAgICAgICAgICAgICByb3cuY2hpbGRyZW5bMipwbGF5ZXIrMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yPSh0cmlja1BsYXllcj09dHJpY2suX2NhcmRzLmxlbmd0aC0xPyh0cmljay5wbGF5U3VpdGUlMj8nYmxhY2snOidyZWQnKTond2hpdGUnKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQncyBtYWtlIHRoZSB3aW5uZXIgY2FyZCBzaG93IGJpZ2dlciEhIVxuICAgICAgICAgICAgICAgIC8vLy8vLy9pZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgICAgICAgICBpZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibGFjayc6J3JlZCcpO1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuZm9udFNpemU9KHRyaWNrLndpbm5lcj09PXBsYXllcj9cIjYwMFwiOlwiNDUwXCIpK1wiJVwiO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj0nIycrKGNhcmQuc3VpdGUlMj8nRkYnOicwMCcpKycwMCcrKHRyaWNrUGxheWVyPT0wPydGRic6JzAwJyk7IC8vIGZpcnN0IHBsYXllciBhZGRzIGJsdWUhIVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2UncmUgcGFzc2luZyBhbG9uZyBjdXJyZW50UGxheWVyLnBhcnRuZXIgdG8gZ2V0VGVhbU5hbWUgYmVjYXVzZSB0aGUgcGxheWVyIHdpdGggdGhlIGZvdXJ0aCBhY2UgYWxyZWFkeSBrbm93cyBoaXMvaGVyIHBhcnRuZXJcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lSW5wdXRFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKCFwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlfHxwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aD09MClcbiAgICAgICAgICAgIHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWU9cGxheWVyTmFtZXNbcGFyc2VJbnQocGxheWVyTmFtZUlucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiKSldO1xuICAgIH1cbn1cblxuLy8gcGxheWluZyBmcm9tIHdpdGhpbiB0aGUgZ2FtZVxuZnVuY3Rpb24gc2luZ2xlUGxheWVyR2FtZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBsZXQgc2luZ2xlUGxheWVyTmFtZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLXBsYXllci1uYW1lJykudmFsdWUudHJpbSgpO1xuICAgIGlmKHNpbmdsZVBsYXllck5hbWUubGVuZ3RoPjApXG4gICAgICAgIHNldFBsYXllck5hbWUoc2luZ2xlUGxheWVyTmFtZSwoZXJyKT0+e1xuICAgICAgICAgICAgLy8gTURIQDEwSkFOMjAyMDogX3NldFBsYXllciB0YWtlcyBjYXJlIG9mIHN3aXRjaGluZyB0byB0aGUgcmlnaHQgaW5pdGlhbCBwYWdlISEhXG4gICAgICAgICAgICBpZihlcnIpc2V0SW5mbyhlcnIpOy8vIGVsc2UgbmV4dFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICBhbGVydChcIkdlZWYgZWVyc3QgZWVuIChnZWxkaWdlKSBuYWFtIG9wIVwiKTtcbn1cblxuLyoqXG4gKiBwcmVwYXJlcyB0aGUgR1VJIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIGdldEdhbWVJbmZvKCl7XG4gICAgY29uc29sZS5sb2coXCJEZXRlcm1pbmluZyBnYW1lIGluZm8uXCIpO1xuICAgIGxldCBnYW1lSW5mbz1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsgLy8gbm8gcGxheWVyLCBubyBnYW1lXG4gICAgaWYocmlra2VuVGhlR2FtZSl7XG4gICAgICAgIC8vIGdldCB0aGUgaW5mbyB3ZSBuZWVkIHRocm91Z2ggdGhlIFBsYXllckdhbWUgaW5zdGFuY2UgcmVnaXN0ZXJlZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcnM9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkZGVycygpOyAvLyB0aG9zZSBiaWRkaW5nXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWRkZXJzOiBcIitoaWdoZXN0QmlkZGVycy5qb2luKFwiLCBcIikrXCIuXCIpO1xuICAgICAgICBsZXQgaGlnaGVzdEJpZD1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZDogXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZF0rXCIuXCIpO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFRydW1wU3VpdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRUcnVtcCBzdWl0ZTogXCIrdHJ1bXBTdWl0ZStcIi5cIik7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgbGV0IHBhcnRuZXJSYW5rPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKTtcbiAgICAgICAgLy8gcGxheWluZyB3aXRoIHRydW1wIGlzIGVhc2llc3RcbiAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7IC8vIG9ubHkgYSBzaW5nbGUgaGlnaGVzdCBiaWRkZXIhISFcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyPWhpZ2hlc3RCaWRkZXJzWzBdO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJvZWxhUGxheWVyTmFtZT1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcik7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89dHJvZWxhUGxheWVyTmFtZStcIiBoZWVmdCB0cm9lbGEsIFwiO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAzMEpBTjIwMjA6IE9PUFMgbm90IHN1cHBvc2VkIHRvIGdpdmUgdGhpcyBhd2F5ISEhISEgZ2FtZUluZm8rPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdK1wiIGlzIHRyb2VmLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCJlbiBcIityaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiIG1ldCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG4vLyBob3cgdG8gcGhyYXNlIGEgYmlkIGRlcGVuZHMgb24gdGhlIGJpZCwgYW5kIHdobyBwbGF5cyBpdFxuZnVuY3Rpb24gZ2V0QmlkSW5mbyhiaWQsYmlkZGVyKXtcbiAgICBsZXQgYmV0dGVyPShiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVJ8fFxuICAgICAgICBiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUik7XG4gICAgaWYoYmV0dGVyKWJpZC0tO1xuICAgIHN3aXRjaChiaWQpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1BBUzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0IGdlcGFzdC5cIjpcIkplIGhlYnQgZ2VwYXN0LlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9SSUs6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBcIjpcIkplIGhlYnQgXCIpKyhiZXR0ZXI/XCJiZXRlciBcIjpcIlwiKStcIiBnZXJpa3QuXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTkVHRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdGllbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIGVsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0d2FhbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGRlcnRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QSUNPOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIHNsZWNodHMgZWVuIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgb3BlbiBrYWFydGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuIG1ldCBlZW4gcHJhYXRqZSBlbiBvcGVuIGthYXJ0ZW4uXCI7XG4gICAgfVxuICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0XCI6XCJKZSBoZWJ0XCIpK1wiIGVlbiBvbmdlbGRpZyBib2QgZ2VkYWFuLlwiO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBwbGF5ZXJJbmRleD0wO3BsYXllckluZGV4PHJpa2tlblRoZUdhbWUubnVtYmVyT2ZQbGF5ZXJzO3BsYXllckluZGV4Kyspe1xuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCkrXCI6IFwiOyAvLyB3cml0ZSB0aGUgbmFtZSBvZiB0aGUgcGxheWVyXG4gICAgfVxufVxuLy8gTURIQDIxTk9WMjAyMDogdGhlIGdhbWUgd291bGQgY2FsbCB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgYSBiaWQgbWFkZSBpcyByZWNlaXZlZCEhIVxuZnVuY3Rpb24gdXBkYXRlQmlkc1RhYmxlKHBsYXllckJpZHNPYmplY3RzKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIGxldCBiaWRUYWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZHMtdGFibGVcIikucXVlcnlTZWxlY3RvcihcInRib2R5XCIpO1xuICAgIGlmKHBsYXllckJpZHNPYmplY3RzKVxuICAgIGZvcihsZXQgcGxheWVyQmlkc0luZGV4PTA7cGxheWVyQmlkc0luZGV4PHBsYXllckJpZHNPYmplY3RzLmxlbmd0aDtwbGF5ZXJCaWRzSW5kZXgrKyl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXBsYXllckJpZHNPYmplY3RzW3BsYXllckJpZHNJbmRleF07XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLmdldFBsYXllckluZGV4KHBsYXllckJpZHNPYmplY3QubmFtZSk7XG4gICAgICAgIC8vIG9uIHRoZSBzYWZlIHNpZGUsIGdldCB0aGUgcGxheWVyIGluZGV4IGZyb20gdGhlIGdhbWUgcGFzc2luZyBpbiAgcGxheWVyIG5hbWVcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7YWxlcnQoXCJTcGVsZXIgXCIrcGxheWVyQmlkc09iamVjdC5uYW1lK1wiIG9uYmVrZW5kIVwiKTtjb250aW51ZTt9XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzUm93PWJpZFRhYmxlLmNoaWxkcmVuW3BsYXllckluZGV4XTtcbiAgICAgICAgLy8gTURIQDIzSkFOMjAyMCBzaG93aW5nIHRoZSBwbGF5ZXIgbmFtZXMgb25jZTogcGxheWVyQmlkc1Jvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9Y2FwaXRhbGl6ZShwbGF5ZXJCaWRzT2JqZWN0Lm5hbWUpOyAvLyB3cml0ZSB0aGUgbmFtZSBvZiB0aGUgcGxheWVyXG4gICAgICAgIC8vIHdyaXRlIHRoZSBiaWRzICh3ZSBoYXZlIHRvIGNsZWFyIHRoZSB0YWJsZSB3aXRoIGV2ZXJ5IG5ldyBnYW1lIHRob3VnaClcbiAgICAgICAgcGxheWVyQmlkc09iamVjdC5iaWRzLmZvckVhY2goKHBsYXllckJpZCxiaWRJbmRleCk9PntwbGF5ZXJCaWRzUm93LmNoaWxkcmVuW2JpZEluZGV4KzFdLmlubmVySFRNTD1wbGF5ZXJCaWQ7fSk7XG4gICAgICAgIC8vIHJlcGxhY2luZzogYmlkVGFibGUuY2hpbGRyZW5bcGxheWVyXS5jaGlsZHJlblsxXS5pbm5lckhUTUw9cGxheWVyc0JpZHNbYmlkXS5qb2luKFwiIFwiKTtcbiAgICB9XG59XG5cbmNsYXNzIE9ubGluZVBsYXllciBleHRlbmRzIFBsYXllcntcblxuICAgIGNvbnN0cnVjdG9yKG5hbWUpe1xuICAgICAgICBzdXBlcihuYW1lLG51bGwpO1xuICAgIH1cblxuICAgIGdldE51bWJlck9mVHJpY2tzV29uKCl7XG4gICAgICAgIC8vIGFzayB0aGUgZ2FtZVxuICAgICAgICByZXR1cm4odGhpcy5faW5kZXgmJnRoaXMuX2dhbWU/dGhpcy5fZ2FtZS5nZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHRoaXMuX2luZGV4KTotMik7XG4gICAgfVxuXG4gICAgLy8gdG8gc2V0IHRoZSBwYXJ0bmVyIG9uY2UgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBjYXJkIGlzIGluIHRoZSB0cmljayEhISFcblxuICAgIC8vIGEgKHJlbW90ZSkgY2xpZW50IG5lZWRzIHRvIG92ZXJyaWRlIGFsbCBpdHMgYWN0aW9uc1xuICAgIC8vIEJVVCB3ZSBkbyBub3QgZG8gdGhhdCBiZWNhdXNlIGFsbCByZXN1bHRzIGdvIGludG8gUGxheWVyR2FtZVByb3h5IHdoaWNoIHdpbGwgc2VuZCB0aGUgYWxvbmchISEhXG5cbiAgICAvLyBtYWtlIGEgYmlkIGlzIGNhbGxlZCB3aXRoIFxuICAgIG1ha2VBQmlkKHBsYXllckJpZHNPYmplY3RzLHBvc3NpYmxlQmlkcyl7XG4gICAgICAgIC8vIHJlcXVlc3Qgb2YgZ2FtZSBlbmdpbmUgKHNlcnZlcikgdG8gbWFrZSBhIGJpZFxuICAgICAgICB0b01ha2VBQmlkKys7XG4gICAgICAgIGlmKHRvTWFrZUFCaWQ9PT0xKXsgLy8gZmlyc3QgdGltZSByZXF1ZXN0IGZvciB0aGUgYmlkXG4gICAgICAgICAgICBiaWRNYWRlPS0xOyAvLyBNREhAMDdGRUIyMDIwOiB5ZXMsIEkgdGhpbmsgd2UgbmVlZCB0aGlzIGFzIHdlbGwhISFcbiAgICAgICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgICAgIC8vIGFzY2VydGFpbiB0byBiZSBsb29raW5nIGF0IHRoZSBiaWRkaW5nIHBhZ2UgKGluIHdoaWNoIGNhc2Ugd2UgY2FuIHNhZmVseSB1c2UgVklTSUJMRSlcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT1cInBhZ2UtYmlkZGluZ1wiKXNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7IFxuICAgICAgICAgICAgLy8gcmVtb3ZlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnRcbiAgICAgICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IGluaGVyaXQgaXMgc2FmZXIgYmVjYXVzZSBpZiB0aGlzIGhhcHBlbnMgYnkgYWNjaWRlbnQgKHdoZW4gbm90IG9uIHRoZSBiaWRkaW5nIHBhZ2UpXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBiaWRkaW5nIGVsZW1lbnQsIGVzc2VudGlhbCB0byBoaWRlIGl0IGltbWVkaWF0ZWx5IGFmdGVyIGEgYmlkXG4gICAgICAgICAgICAvLyBjdXJyZW50UGxheWVyPXRoaXM7IC8vIHJlbWVtYmVyIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgc2V0SW5mbyhcIkRvZSBlZW4gYm9kLCBcIit0aGlzLm5hbWUrXCIuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIGJpZHMgcGxheWVyICdcIit0aGlzLm5hbWUrXCInIGNvdWxkIG1ha2U6IFwiLHBvc3NpYmxlQmlkcyk7XG4gICAgXG4gICAgICAgICAgICAvL3NldEluZm8oXCJNYWFrIGVlbiBrZXV6ZSB1aXQgZWVuIHZhbiBkZSBtb2dlbGlqa2UgYmllZGluZ2VuLlwiKTtcbiAgICAgICAgICAgIC8vIGl0J3MgYWx3YXlzIHlvdSEhISEgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXJcIikuaW5uZXJIVE1MPXRoaXMubmFtZTtcbiAgICAgICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS5pbm5lckhUTUw9XCJUb29uIGthYXJ0ZW5cIjtcbiAgICAgICAgICAgIGJpZGRlckNhcmRzRWxlbWVudC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS52YWx1ZT10aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbihcIjxicj5cIik7XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgYmlkZGVyIGNhcmRzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItc3VpdGVjYXJkcy1idXR0b25cIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWJ1dHRvblwiKSlcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlLWJ1dHRvblwiKTtcbiAgICAgICAgICAgIC8qIE1ESEAxMUpBTjIwMjA6IG1vdmVkIG92ZXIgdG8gd2hlbiB0aGUgcGxheWVyIGNhcmRzIGFyZSByZWNlaXZlZCEhIVxuICAgICAgICAgICAgLy8gTk9URSBiZWNhdXNlIGV2ZXJ5IHBsYXllciBnZXRzIGEgdHVybiB0byBiaWQsIHRoaXMuX3N1aXRlQ2FyZHMgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiB3ZSBhc2sgZm9yIHRydW1wL3BhcnRuZXIhISFcbiAgICAgICAgICAgIHVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCkpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIG9ubHkgc2hvdyB0aGUgYnV0dG9ucyBjb3JyZXNwb25kaW5nIHRvIHBvc3NpYmxlIGJpZHNcbiAgICAgICAgICAgIGZvcihsZXQgYmlkQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJiaWRcIikpXG4gICAgICAgICAgICAgICAgYmlkQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHBvc3NpYmxlQmlkcy5pbmRleE9mKHBhcnNlSW50KGJpZEJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmlkJykpKT49MD9cImlubGluZVwiOlwibm9uZVwiKTtcbiAgICAgICAgICAgIC8vIHNob3cgdGhlIHBsYXllciBiaWRzIGluIHRoZSBib2R5IG9mIHRoZSBiaWRzIHRhYmxlXG4gICAgICAgICAgICB1cGRhdGVCaWRzVGFibGUocGxheWVyQmlkc09iamVjdHMpO1xuICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQklEKTsgICAgXG4gICAgICAgIH1lbHNlIC8vIG5vdCB0aGUgZmlyc3QgdGltZSBhIGJpZCB3YXMgcmVxdWVzdGVkXG4gICAgICAgIGlmKGJpZE1hZGU+PTApe1xuICAgICAgICAgICAgbGV0IGVycm9yPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuX3NldEJpZChiaWRNYWRlKTpuZXcgRXJyb3IoYnVnKFwiSmUgYmVudCBnZWVuIHNwZWxlciBtZWVyIVwiKSkpO1xuICAgICAgICAgICAgaWYoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiTm9nIHN0ZWVkcyBwcm9ibGVtZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGplIGJvZC4gV2UgYmxpanZlbiBoZXQgcHJvYmVyZW4uXCIsXCJTcGVsZXJcIik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkplIGJvZCBpcyBub2dtYWFscyB2ZXJzdHV1cmQuIEhvcGVsaWprIGhlYmJlbiB3ZSBudSBtZWVyIGdlbHVrIVwiLFwiU3BlbGVyXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgc2V0SW5mbyhcIkVyIHdvcmR0IG9wIGplIGJvZCBnZXdhY2h0IVwiLFwiU2VydmVyXCIpO1xuICAgIH1cbiAgICBjaG9vc2VUcnVtcFN1aXRlKHN1aXRlcyl7XG4gICAgICAgIHRvQ2hvb3NlVHJ1bXBTdWl0ZSsrO1xuICAgICAgICBpZih0b0Nob29zZVRydW1wU3VpdGU9PT0xKXtcbiAgICAgICAgICAgIGNob3NlblRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHRydW1wIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSB0cnVtcCBzdWl0ZSBidXR0b25zXG4gICAgICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfVFJVTVApOyAgICBcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYoY2hvc2VuVHJ1bXBTdWl0ZT49MCl7XG4gICAgICAgICAgICAvLyBNREhAMDdGRUIyMDIwOiBhIHNob3J0Y3V0IG9mIHNlbmRpbmcgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIGFsZXJ0KGJ1ZyhcIkhldCBzcGVsIGlzIHZlcmR3ZW5lbiFcIikpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZS50cnVtcFN1aXRlQ2hvc2VuKGNob3NlblRydW1wU3VpdGUpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgc2V0SW5mbyhcIkVyIHdvcmR0IG9wIGRlIHRyb2Vma2xldXIgZ2V3YWNodFwiLFwiU2VydmVyXCIpO1xuICAgIH1cbiAgICBjaG9vc2VQYXJ0bmVyU3VpdGUoc3VpdGVzLHBhcnRuZXJSYW5rKXsgLy8gcGFydG5lclJhbmtOYW1lIGNoYW5nZWQgdG8gcGFydG5lclJhbmsgKGJlY2F1c2UgTGFuZ3VhZ2Ugc2hvdWxkIGJlIHVzZWQgYXQgdGhlIFVJIGxldmVsIG9ubHkhKVxuICAgICAgICB0b0Nob29zZVBhcnRuZXJTdWl0ZSsrO1xuICAgICAgICBpZih0b0Nob29zZVBhcnRuZXJTdWl0ZT09PTEpe1xuICAgICAgICAgICAgY2hvc2VuUGFydG5lclN1aXRlPS0xO1xuICAgICAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQb3NzaWJsZSBwYXJ0bmVyIHN1aXRlczpcIixzdWl0ZXMpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtcGFydG5lci1jaG9vc2luZ1wiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIGFzY2VydGFpbiB0byBhbGxvdyBjaG9vc2luZyB0aGUgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgc3VpdGVzIGluIHRoZSBidXR0b24gYXJyYXkgYXJlIDAsIDEsIDIsIDMgYW5kIHN1aXRlcyB3aWxsIGNvbnRhaW5cbiAgICAgICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWJ1dHRvbnNcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1aXRlXCIpKVxuICAgICAgICAgICAgICAgIHN1aXRlQnV0dG9uLnN0eWxlLmRpc3BsYXk9KHN1aXRlcy5pbmRleE9mKHBhcnNlSW50KHN1aXRlQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWl0ZScpKSk8MD9cIm5vbmVcIjpcImlubGluZVwiKTtcbiAgICAgICAgICAgIC8vIHNob3cgdGhlIHBhcnRuZXIgcmFuayAoYWNlIG9yIGtpbmcpIGJlaW5nIGFza2VkXG4gICAgICAgICAgICBmb3IobGV0IHJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgICAgIHJhbmtFbGVtZW50LmlubmVySFRNTD1MYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXTtcbiAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1BBUlRORVIpOyAgICBcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYoY2hvc2VuUGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBhbGVydChidWcoXCJIZXQgc3BlbCBpcyB2ZXJkd2VuZW4hXCIpKTtcbiAgICAgICAgICAgIC8vIE1ESEAwN0ZFQjIwMjA6IGEgc2hvcnRjdXQgb2Ygc2VuZGluZyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGVcbiAgICAgICAgICAgIHRoaXMuX2dhbWUucGFydG5lclN1aXRlQ2hvc2VuKGNob3NlblBhcnRuZXJTdWl0ZSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBzZXRJbmZvKFwiRXIgd29yZHQgb3AgZGUga2xldXIgdmFuIGRlIG1lZSB0ZSB2cmFnZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgZ2V3YWNodC5cIik7XG4gICAgfVxuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgcmVwbGFjZWQgdmVyc2lvbiBleGNlcHQgd2Ugbm93IHdhbnQgdG8gcmVjZWl2ZSB0aGUgdHJpY2sgaXRzZWxmXG4gICAgcGxheUFDYXJkKCl7XG4gICAgICAgIC8vIE1ESEAwNUZFQjIwMjA6IHRoaXMgaXMgYSByZXF1ZXN0IGZyb20gdGhlIHNlcnZlciB0byBwbGF5IGEgY2FyZCB3aGljaCBjb3VsZCBiZSBhIHJlcXVlc3QgdG8gcmVwbGF5IGEgY2FyZCAodGhhdCB3YXNuJ3QgcmVjZWl2ZWQgc29tZWhvdylcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgaW5zdGVhZCBvZiB1c2luZyB3ZSBhIGZsYWcgd2Uga2VlcCB0cmFjayBvZiB0aGUgcmVxdWVzdCBjb3VudCwgd2UgdG9nZ2xlIHRoZSBzaWduIHRvIGluZGljYXRlIHRoYXQgYSBjaG9pY2Ugd2FzIGFscmVhZHkgbWFkZVxuICAgICAgICAvLyBlcnJvciBoYW5kbGluZyBmaXJzdCBUT0RPIHRoZXNlIGVycm9ycyBpbmRpY2F0ZSBidWdzIGFuZCB0aGVyZWZvcmUgYXJlIGlucmVjb3ZlcmFibGUhISEhXG4gICAgICAgIGxldCB0cmljaz0odGhpcy5nYW1lP3RoaXMuZ2FtZS5fdHJpY2s6bnVsbCk7XG4gICAgICAgIGlmKCF0cmljaylyZXR1cm4gYnVnKFwiRGUgc2xhZyBvbnRicmVla3QhXCIpO1xuICAgICAgICBpZih0cmljay5udW1iZXJPZkNhcmRzPjAmJnRyaWNrLnBsYXlTdWl0ZTwwKXJldHVybiBidWcoXCJEZSB0ZSBzcGVsZW4ga2xldXIgaXMgb25iZWtlbmQhXCIpO1xuICAgICAgICB0b1BsYXlBQ2FyZCsrO1xuICAgICAgICBpZih0b1BsYXlBQ2FyZD09PTEpeyAvLyBmaXJzdCByZXF1ZXN0LCBubyBjYXJkIHdhcyBwbGF5ZWQgc28gZmFyXG4gICAgICAgICAgICBwbGF5ZWRDYXJkSW5mbz1udWxsOyAvLyBpbml0aWFsaXplIGNhcmRQbGF5ZWQgdG8gbnVsbFxuICAgICAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBNREhAMTlKQU4yMDIwOiBhbGxvdyB0aGUgY3VycmVudCBwbGF5ZXIgdG8gcGxheSBhIGNhcmQgYnkgY2xpY2tpbmcgb25lXG4gICAgICAgICAgICAvLyBNREhAMDVGRUIyMDIwIHJlbW92aW5nIGJlY2F1c2Ugd2UncmUga2VlcGluZyBhbGwgY2FyZHMgY2xpY2thYmxlIGFuZCBzdG9wIHRoZW0gcHJvZ3JhbW1hdGljYWxseSBmcm9tIGRvaW5nIGhhcm06IHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7IC8vIHJlYWR5IHRvIHJvY2sgJ24nIHJvbGxcbiAgICAgICAgICAgIC8vIE1ESEAwNUZFQjIwMjAgb3ZlcmtpbGw6IHNldEluZm8oXCJTcGVlbCBlZW4gXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIuXCIpO1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG5ldyB0cmljayB1cGRhdGUgdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGUgd2l0aCB0aGUgcHJldmlvdXMgdHJpY2tcbiAgICAgICAgICAgIC8vIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTApdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAvKiBzZWUgc2hvd1RyaWNrKClcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FuLWFzay1mb3ItcGFydG5lci1jYXJkLWJsaW5kXCIpLnN0eWxlLmRpc3BsYXk9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQ/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAgICAgICAgIC8vIGFsd2F5cyBzdGFydCB1bmNoZWNrZWQuLi5cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuY2hlY2tlZD1mYWxzZTsgLy8gd2hlbiBjbGlja2VkIHNob3VsZCBnZW5lcmF0ZSBcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBNREhAMjBKQU4yMDIwIG1vdmVkIG92ZXIgdG8gd2hlcmUgR0FNRV9JTkZPIGV2ZW50IGlzIHJlY2VpdmVkISEhITogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWluZm9cIikuaW5uZXJIVE1MPWdldEdhbWVJbmZvKCk7IC8vIHVwZGF0ZSB0aGUgZ2FtZSBpbmZvIChwbGF5ZXIgc3BlY2lmaWMpXG4gICAgICAgICAgICAvLyBvYnNvbGV0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkLXBsYXllclwiKS5pbm5lckhUTUw9dGhpcy5uYW1lO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD0odHJpY2sucGxheVN1aXRlPj0wP1wiU3BlZWwgZWVuIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV0udG9Mb3dlckNhc2UoKStcIiBiaWouXCI6XCJLb20gbWFhciB1aXQhXCIpO1xuICAgICAgICAgICAgbGV0IG51bWJlck9mVHJpY2tzV29uPXRoaXMuZ2V0TnVtYmVyT2ZUcmlja3NXb24oKTsgLy8gYWxzbyBpbmNsdWRlcyB0aG9zZSB3b24gYnkgdGhlIHBhcnRuZXIgKGF1dG9tYXRpY2FsbHkpXG4gICAgICAgICAgICAvLyBhZGQgdGhlIHRyaWNrcyB3b24gYnkgdGhlIHBhcnRuZXJcbiAgICAgICAgICAgIGxldCBwYXJ0bmVyTmFtZT10aGlzLl9nYW1lLmdldFBhcnRuZXJOYW1lKHRoaXMuX2luZGV4KTtcbiAgICAgICAgICAgIC8vIGlmKHBhcnRuZXIpbnVtYmVyT2ZUcmlja3NXb24rPXBsYXllci5nZXROdW1iZXJPZlRyaWNrc1dvbigpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlja3Mtd29uLXNvLWZhclwiKS5pbm5lckhUTUw9Z2V0TnVtYmVyT2ZUcmlja3NXb25UZXh0KG51bWJlck9mVHJpY2tzV29uKSsocGFydG5lck5hbWU/XCIgKHNhbWVuIG1ldCBcIitwYXJ0bmVyTmFtZStcIilcIjpcIlwiKTtcbiAgICAgICAgICAgIC8vIHNob3cgdGhlIG51bWJlciBvZiB0cmlja3MgdGhpcyBwbGF5ZXIgaXMgc3VwcG9zZWQgdG8gd2luIGluIHRvdGFsXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy10by13aW5cIikuaW5uZXJIVE1MPWdldE51bWJlck9mVHJpY2tzVG9XaW5UZXh0KHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW4scGFydG5lck5hbWUsdGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkKCkpO1xuICAgICAgICAgICAgdGhpcy5fY2FyZD1udWxsOyAvLyBnZXQgcmlkIG9mIGFueSBjdXJyZW50bHkgY2FyZFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBzaG91bGQgcGxheSBhIGNhcmQhXCIpO1xuICAgICAgICAgICAgLy8gc2V0SW5mbyhcIldlbGtlIFwiKyh0cmljay5wbGF5U3VpdGU+PTA/TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXTpcImthYXJ0XCIpK1wiIHdpbCBqZSBcIisodHJpY2subnVtYmVyT2ZDYXJkcz4wP1wiYmlqXCI6XCJcIikrXCJzcGVsZW4/XCIpO1xuICAgICAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7IC8vIHJlbWVtYmVyIHRoZSBzdWl0ZSBjYXJkcyEhISFcbiAgICAgICAgICAgIC8vIHNob3cgdGhlIHRyaWNrIChyZW1lbWJlcmVkIGluIHRoZSBwcm9jZXNzIGZvciB1c2UgaW4gY2FyZFBsYXllZCBiZWxvdykgZnJvbSB0aGUgdmlld3BvaW50IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgLy8vLy8gc2hvd1RyaWNrKHRoaXMuX3RyaWNrPXRyaWNrKTsgLy8gTURIQDExSkFOMjAyMDogbm8gbmVlZCB0byBwYXNzIHRoZSBwbGF5ZXIgaW5kZXggKGFzIGl0IGlzIGFsd2F5cyB0aGUgc2FtZSlcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYocGxheWVkQ2FyZEluZm8peyAvLyBhIGNhcmQgaGFzIGJlZW4gY2hvb3NlbiBieSB0aGlzIHBsYXllciB0byBwbGF5IGJ1dCBhcHBhcmVudGx5IGhhcyBub3QgYmVlbiByZWNlaXZlZCB5ZXRcbiAgICAgICAgICAgIC8vIHNlbmQgdGhlIGNhcmQgcGxheWVkIGFnYWluXG4gICAgICAgICAgICBsZXQgZXJyb3I9dGhpcy5fc2V0Q2FyZCguLi5wbGF5ZWRDYXJkSW5mbyk7XG4gICAgICAgICAgICBpZihlcnJvciBpbnN0YW5jZW9mIEVycm9yKXtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVmVyc3R1cmVuIHZhbiBkZSBnZXNwZWVsZGUga2FhcnQgKFwiK2dldExvY2FsZUNhcmRUZXh0KHBsYXlhYmxlQ2FyZEluZm9bMF0pK1wiKSBtaXNsdWt0ISBGb3V0OiBcIitlcnJvci5tZXNzYWdlK1wiLlwiLFwiU3BlbGVyXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLGVycm9yKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShnZXRMb2NhbGVDYXJkVGV4dChwbGF5YWJsZUNhcmRJbmZvWzBdKSkrXCIgb3BuaWV1dyB2ZXJzdHV1cmQhXCIsXCJTcGVsZXJcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYXJkIHBsYXllZCBzZW5kIGFnYWluLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGplIGthYXJ0IVwiLFwiU2VydmVyXCIpO1xuICAgIH1cblxuICAgIC8vIF9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXggcmVwbGFjZWQgYnkgX2dldENhcmRXaXRoU3VpdGVBbmRJbmRleCgpIGNvbWJpbmVkIHdpdGggX2NhcmRQbGF5ZWRcblxuICAgIF9nZXRDYXJkV2l0aFN1aXRlQW5kSW5kZXgoc3VpdGUsaW5kZXgpe3JldHVybihzdWl0ZTx0aGlzLl9zdWl0ZUNhcmRzLmxlbmd0aCYmdGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV0ubGVuZ3RoP3RoaXMuX3N1aXRlQ2FyZHNbc3VpdGVdW2luZGV4XTpudWxsKTt9XG4gICAgLy8gbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggX2NhcmRQbGF5ZWQoKSBkZWZpbmVkIGluIHRoZSBiYXNlIGNsYXNzIFBsYXllciB3aGljaCBpbmZvcm1zIHRoZSBnYW1lXG4gICAgLy8gTk9URSBjYXJkUGxheWVkIGlzIGEgZ29vZCBwb2ludCBmb3IgY2hlY2tpbmcgdGhlIHZhbGlkaXR5IG9mIHRoZSBjYXJkIHBsYXllZFxuICAgIC8vIE5PVEUgY2FuJ3QgdXNlIF9jYXJkUGxheWVkIChzZWUgUGxheWVyIHN1cGVyY2xhc3MpXG4gICAgLy8gTURIQDIwSkFOMjAyMDogZGVjaWRpbmcgdG8gcmV0dXJuIHRydWUgb24gYWNjZXB0YW5jZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgX25ld0NhcmRQbGF5ZWQoY2FyZCl7XG4gICAgICAgIGlmKGNhcmQpe1xuICAgICAgICAgICAgLy8gVE9ETyBjaGVja2luZyBzaG91bGQgTk9UIGJlIGRvbmUgYnkgdGhlIHBsYXllciBCVVQgYnkgdGhlIHRyaWNrIGl0c2VsZiEhIVxuICAgICAgICAgICAgLy8gQlVHIEZJWDogZG8gTk9UIGRvIHRoZSBmb2xsb3dpbmcgaGVyZSwgYnV0IG9ubHkgYXQgdGhlIHN0YXJ0IG9mIGEgdHJpY2ssIG9yIE5PVCBhdCBhbGwhISEhIVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gLTEgd2hlbiBhc2tpbmcgYmxpbmQsIDAgbm90IGFza2luZywgMSBpZiBhc2tpbmdcbiAgICAgICAgICAgIC8vIENBTidUIGNhbGwgX3NldENhcmQgKGluIGJhc2UgY2xhc3MgUGxheWVyKSBpZiB0aGUgY2FyZCBjYW5ub3QgYmUgcGxheWVkISEhXG4gICAgICAgICAgICBsZXQgdHJpY2s9dGhpcy5nYW1lLl90cmljazsgLy8gTURIQDE5SkFOMjAyMDogZWFzaWVzdCB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRyaWNrXG4gICAgICAgICAgICBpZighdHJpY2spcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc2xhZyBvbSBlZW4ga2FhcnQgaW4gYmlqIHRlIHNwZWxlbi5cIik7XG4gICAgICAgICAgICBsZXQgYXNraW5nRm9yUGFydG5lckNhcmQ9MDtcbiAgICAgICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM9PTApeyAvLyBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGVvcmV0aWNhbGx5IHRoZSBjYXJkIGNhbiBiZSBwbGF5ZWQgYnV0IGl0IG1pZ2h0IGJlIHRoZSBjYXJkIHdpdGggd2hpY2ggdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCEhXG4gICAgICAgICAgICAgICAgLy8gaXMgdGhpcyBhIGdhbWUgd2hlcmUgdGhlcmUncyBhIHBhcnRuZXIgY2FyZCB0aGF0IGhhc24ndCBiZWVuIHBsYXllZCB5ZXRcbiAgICAgICAgICAgICAgICAvLyBhbHRlcm5hdGl2ZWx5IHB1dDogc2hvdWxkIHRoZXJlIGJlIGEgcGFydG5lciBhbmQgdGhlcmUgaXNuJ3Qgb25lIHlldD8/Pz8/XG4gICAgICAgICAgICAgICAgLy8gQlVHIEZJWDogc3RpbGwgdXNpbmcgZ2V0VHJ1bXBQbGF5ZXIoKSBoZXJlIGFsdGhvdWdoIGl0IHdhc24ndCBkZWZpbmVkIGF0IGFsbCBoZXJlISEhIVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgIG5vdyBjb3BpZWQgb3ZlciBmcm9tIFJpa2tlblRoZUdhbWUuanMhISEgKGFzIGl0IGlzIGNvbXB1dGVkKVxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0VHJ1bXBQbGF5ZXIoKT09dGhpcy5faW5kZXgpeyAvLyB0aGlzIGlzIHRydW1wIHBsYXllciBwbGF5aW5nIHRoZSBmaXJzdCBjYXJkXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj4+Pj4gQ0hFQ0tJTkcgV0hFVEhFUiBBU0tJTkcgRk9SIFRIRSBQQVJUTkVSIENBUkQgPDw8PFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIHRoZSB0cnVtcCBwbGF5ZXIgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIHRydW1wIHBsYXllciBkb2VzIG5vdCBoYXZlIFxuICAgICAgICAgICAgICAgICAgICBpZih0cmljay5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD4wKXsgLy8gbm9uLWJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHNob3VsZCBiZSBkZXRlY3RlZCBieSB0aGUgZ2FtZSBwcmVmZXJhYmx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjYXJkLnN1aXRlPT09dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQ9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vYWxlcnQoXCJcXHROT05fQkxJTkRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDApeyAvLyBjb3VsZCBiZSBibGluZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGNoZWNrYm94IGlzIHN0aWxsIHNldCBpLmUuIHRoZSB1c2VyIGRpZG4ndCB1bmNoZWNrIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoZSB3aWxsIGJlIGFza2luZyBmb3IgdGhlIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMCBCVUcgRklYOiB3YXMgdXNpbmcgYXNrLXBhcnRuZXItY2FyZC1ibGluZCBpbnN0ZWFkIG9mIGFzay1wYXJ0bmVyLWNhcmQtY2hlY2tib3ghISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveFwiKS5jaGVja2VkJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FyZC5zdWl0ZSE9PXRoaXMuX2dhbWUuZ2V0VHJ1bXBTdWl0ZSgpfHxjb25maXJtKFwiV2lsdCBVIGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCldK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpXStcIiAoYmxpbmQpIHZyYWdlbiBtZXQgZWVuIHRyb2VmP1wiKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkPS0xOyAvLyB5ZXMsIGFza2luZyBibGluZCEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy9hbGVydChcIlxcdEJMSU5EIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qYWxlcnQoXCJOb3QgaW5kaWNhdGVkISEhIVwiKSovO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIG9yIG5vdCB0aGUgZmlyc3QgcGxheWVyIGNhbiBwbGF5IHNwYWRlc1xuICAgICAgICAgICAgICAgICAgICBpZighdHJpY2suX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyYmc3VpdGU9PT1DYXJkLlNVSVRFX1NQQURFKXsgLy8gc3BhZGUgaXMgYmVpbmcgcGxheWVkIGJ5IHRoZSBmaXJzdCBwbGF5ZXIgd2hlcmVhcyB0aGF0IGlzIG5vdCBhbGxvd2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoQ2FyZC5TVUlURV9TUEFERSk8dGhpcy5udW1iZXJPZkNhcmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IG5pZXQgbWV0IHNjaG9wcGVuIHVpdGtvbWVuLCB3YW50IGRlIHNjaG9wcGVuIHZyb3V3IGlzIG5vZyBuaWV0IG9wZ2VoYWFsZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXsgLy8gbm90IHRoZSBmaXJzdCBjYXJkIGluIHRoZSB0cmljayBwbGF5ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2FyZCBuZWVkcyB0byBiZSB0aGUgc2FtZSBzdWl0ZSBhcyB0aGUgcGxheSBzdWl0ZSAoaWYgdGhlIHBsYXllciBoYXMgYW55KVxuICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPT10cmljay5wbGF5U3VpdGUmJnRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZSh0cmljay5wbGF5U3VpdGUpPjApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2dldExvY2FsZUNhcmRUZXh0KGNhcmQpK1wiIG5pZXQgc3BlbGVuLCB3YW50IFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV0rXCIgaXMgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgIC8vIHdoZW4gYmVpbmcgYXNrZWQgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgdGhhdCB3b3VsZCBiZSB0aGUgY2FyZCB0byBwbGF5IVxuICAgICAgICAgICAgICAgIGlmKHRyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpLHBhcnRuZXJSYW5rPXRoaXMuX2dhbWUuZ2V0UGFydG5lclJhbmsoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jb250YWluc0NhcmQocGFydG5lclN1aXRlLHBhcnRuZXJSYW5rKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjYXJkLnN1aXRlIT09cGFydG5lclN1aXRlfHxjYXJkLnJhbmshPT1wYXJ0bmVyUmFuaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSmUga3VudCBcIitnZXRMb2NhbGVDYXJkVGV4dChjYXJkKStcIiBuaWV0IHNwZWxlbiwgd2FudCBkZSBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1twYXJ0bmVyU3VpdGVdK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdK1wiIGlzIGdldnJhYWdkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1ESEAwNUZFQjIwMjA6IGF0IHRoaXMgcG9pbnQgdGhlIGNhcmQgcGxheWVkIHdhcyBhY2NlcHRlZCAodGhlb3JldGljYWxseSksIGl0IG9ubHkgbmVlZHMgdG8gYmUgc2VudCBzdWNjZXNzZnVsbHkgdG8gdGhlIHNlcnZlciwgYW5kIHJldHVybmVkIGFzIHBsYXllZCBjYXJkXG4gICAgICAgICAgICBwbGF5ZWRDYXJkSW5mbz1bY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF07IC8vIGJ5IHJlbWVtYmVyaW5nIHRoZSBjYXJkIGJlaW5nIHBsYXllZCBoZXJlIGFuZCBub3cgd2UgYmxvY2sgZnVydGhlciBhdHRlbXB0cyBmb3IgYSBwbGF5ZXIgdG8gY2hhbmdlIHRoZSBjYXJkIChzKWhlIHBsYXllZFxuICAgICAgICAgICAgLy8gTURIQDE0SkFOMjAyMDogd2UgaGF2ZSB0byBhbHNvIHJldHVybiB3aGF0ZXZlciB0cmljayB2YWx1ZSB0aGF0IG1pZ2h0J3ZlIGNoYW5nZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdoaWNoIGluIHRoaXMgY2FzZSBjb3VsZCB3ZWwgYmUgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkICdmbGFnJ1xuICAgICAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogSSBzdWdnZXN0IGNoYW5naW5nIGFza2luZ0ZvclBhcnRuZXJDYXJkIHRvIGFza2luZ0ZvclBhcnRuZXJDYXJkPDAgaS5lLiBibGluZCByZXF1ZXN0ISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICB3ZSdyZSB0YWtpbmcgY2FyZSBvZiB0aGF0IHdoZW4gQ0FSRCBpcyBzZW50IChzbyBub3QgdG8gaW50ZXJmZXJlIHdpdGggUmlra2VuVGhlR2FtZS5qcyBpdHNlbGYpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0Q2FyZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgICAgIC8qIE1ESEAyN0pBTjIwMjA6IHJlbW92aW5nIHRoZSBmb2xsb3dpbmcgbWlnaHQgYmUgd3JvbmcgQlVUIGJ5IHBhc3NpbmcgYXNraW5nRm9yUGFydG5lckNhcmQgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsIHBsYXllcnMgaW5jbHVkaW5nIG15c2VsZiB3aWxsIHJlY2VpdmUgdGhlIGNhcmQgcGxheWVkIGFuZCB1cGRhdGUgYXNraW5nRm9yUGFydG5lckNhcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY29yZGluZ2x5LCBiYXNpY2FsbHkgYWRkQ2FyZCgpIHdpbGwgc2V0IGl0IHRvIDEgaWYgaXQgc28gZGV0ZWN0cywgYnV0IGNhbm5vdCBzZXQgaXQgdG8gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvIHRlY2huaWNhbGx5IGFza2luZ0ZvclBhcnRuZXJDYXJkIG9ubHkgbmVlZHMgdG8gYmUgc2VuZCB3aGVuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQgYmxpbmRcbiAgICAgICAgICAgIGlmKGVycm9yKXJldHVybiBuZXcgRXJyb3IoXCJFciBpcyBlZW4gZm91dCBvcGdldHJlZGVuIGJpaiBoZXQgdmVyc3R1cmVuIHZhbiBkZSBnZXNwZWVsZGUga2FhcnQuXCIpO1xuICAgICAgICAgICAgdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9YXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4ga2FhcnQgZ2VzcGVlbGQhXCIpO1xuICAgIH1cbiAgICBfY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KHN1aXRlLGluZGV4KXtidWcoXCJEZXplIG1ldGhvZGUgbWFnIG5pZXQgbWVlciB3b3JkZW4gYWFuZ2Vyb2VwZW4uXCIpO31cblxuICAgIHBsYXlzVGhlR2FtZUF0SW5kZXgoZ2FtZSxpbmRleCl7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgaWYoIWdhbWUpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWUuc3RhdGUhPT1QbGF5ZXJHYW1lLkZJTklTSEVEKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9ncmFtbWFmb3V0OiBIZXQgc3BlbCBrYW4gbmlldCB3b3JkZW4gdmVybGF0ZW4sIGFscyBoZXQgbmlldCBhZmdlbG9wZW4gaXMgKHRvZXN0YW5kOiBcIit0aGlzLl9nYW1lLnN0YXRlK1wiKS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUuZG9uZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJWZXJsYXRlbiB2YW4gaGV0IHNwZWwgbWlzbHVrdCEgUHJvYmVlciBoZXQgbm9nIGVlbnMuXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXI9LTE7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgdGhpbmdzIHRvIGRvPz8/Pz8/P1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIG92ZXJnZWJsZXZlbiBrYWFydGVuIGluIGplIGhhbmQgd29yZGVuIHZlcndpamRlcmQhXCIsXCJTcGVsXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDYXJkcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBzZW5kaW5nIHRoZSBET05FIGV2ZW50IHN1Y2NlZWRzIHJlYWR5IGFnYWluIHRvIHBsYXkgaW4gYSBuZXh0IGdhbWUgKHdpdGhvdXQgbGVhdmluZyB0aGUgZ2FtZSBwbGF5aW5nKVxuICAgICAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIucGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KTtcbiAgICB9XG4gICAgLy8gY2FsbCByZW5kZXJDYXJkcyBqdXN0IGFmdGVyIHRoZSBzZXQgb2YgY2FyZHMgY2hhbmdlXG4gICAgcmVuZGVyQ2FyZHMoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKiogUmVuZGVyaW5nIHBsYXllciBjYXJkcyAqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgdGhpcy5fc3VpdGVDYXJkcz10aGlzLl9nZXRTdWl0ZUNhcmRzKCk7XG4gICAgICAgIC8vIFRPRE8gcHJvYmFibHkgYmVzdCB0byBzaG93IHRoZW0gb24gQUxMIHBhZ2VzIChubyBtYXR0ZXIgd2hpY2ggb25lIGlzIGN1cnJlbnRseSBzaG93aW5nISlcbiAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlUGxheWVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgdXBkYXRlQ2hvb3NlVHJ1bXBTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBzd2l0Y2goY3VycmVudFBhZ2Upe1xuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYmlkZGluZ1wiOnVwZGF0ZUJpZGRlclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBvbmx5IG9uY2VcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBsYXlpbmdcIjp1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO2JyZWFrOyAvLyB0eXBpY2FsbHkgYWZ0ZXIgcGxheWluZyBhIGNhcmQhIVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtdHJ1bXAtY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCI6dXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICB9XG4gICAgLy8gZXhpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gYSBwbGF5ZXIgc3RvcHMgcGxheWluZ1xuICAgIC8vIGVpdGhlciBieSBleHBsaWNpdGx5IHVzaW5nIHRoZSBzdG9wIGJ1dHRvbihzKSBvciBsZWF2aW5nL2Nsb3NpbmcgdGhlIHBhZ2VcbiAgICAvLyBUT0RPIHNob3VsZCB3ZSBudWxsIHRoZSBnYW1lPz8/Pz8/Pz9cbiAgICBleGl0KHJlYXNvbil7XG4gICAgICAgIGlmKHRoaXMuX2dhbWUpe1xuICAgICAgICAgICAgdGhpcy5fZ2FtZS5leGl0KHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLl9nYW1lPW51bGw7IC8vIFRPRE8gb3IgYW55IG90aGVyIHdheSB0byBpbmRpY2F0ZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwbGF5ZXIgc3RvcHBlZCBwbGF5aW5nXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyc1xuLyoqXG4gKiBjbGlja2luZyBhIGJpZCBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gYmlkIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gYmlkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gTURIQDAzRkVCMjAyMDogcHJldmVudCBtYWtpbmcgYSBiaWQgd2hlbiBub3Qgc3VwcG9zZWQgdG8gZG8gc29cbiAgICBpZih0b01ha2VBQmlkPD0wKXJldHVybiBhbGVydChcIkplIG1hZyBudSBuaWV0IGJpZWRlbiEgSGV0IHdhY2h0ZW4gaXMgb3AgZWVuIHNlaW50amUgdmFuIGRlIHNlcnZlci5cIik7XG4gICAgLy8gTURIQDA3RkVCMjAyMDogT09QUywgYmlkTWFkZSBjYW4gYmUgMCB3aGljaCB3b3VsZCBiZSBjb25zaWRlcmVkIGEgZmFsc3kgdmFsdWUgc28gd2Ugc2hvdWxkIG5vdCB1c2UgYmlkTWFkZSBpdHNlbGYgYXMgY29uZGl0aW9uISEhIVxuICAgIGlmKGJpZE1hZGU+PTApcmV0dXJuIGFsZXJ0KFwiSmUgaGVidCBhbCBlZW4gYm9kIHVpdGdlYnJhY2h0IVwiKTtcbiAgICB0cnl7XG4gICAgICAgIGxldCBiaWQ9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpZFwiKSk7XG4gICAgICAgIGlmKGlzTmFOKGJpZCl8fGJpZDwwKXJldHVybiBhbGVydChidWcoXCJKZSBib2QgKFwiKyhiaWQ/Q2FyZC5CSURfTkFNRVNbYmlkXTpcIj9cIikrXCIgaXMgb25nZWxkaWchXCIpKTtcbiAgICAgICAgYmlkTWFkZT1iaWQ7IC8vIHJlbWVtYmVyIHRoZSBiaWQgaW4gY2FzZSB3ZSBuZWVkIHRvIHNlbmQgaXQgYWdhaW5cbiAgICAgICAgbGV0IGVycm9yPWN1cnJlbnRQbGF5ZXIuX3NldEJpZChiaWRNYWRlKTsgLy8gdGhlIHZhbHVlIG9mIHRoZSBidXR0b24gaXMgdGhlIG1hZGUgYmlkXG4gICAgICAgIGlmKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpXG4gICAgICAgICAgICBzZXRJbmZvKFwiUHJvYmxlbWVuIGJpaiBoZXQgdmVyc3R1cmVuIHZhbiBqZSBib2Q6IFwiK2Vycm9yLm1lc3NhZ2UrXCIuIFdlIGJsaWp2ZW4gaGV0IHByb2JlcmVuLlwiLFwiU3BlbFwiKTtcbiAgICAgICAgZWxzZSAvLyBiaWQgZG9uZSEhIVxuICAgICAgICAgICAgc2V0SW5mbyhcIkJvZCB2ZXJzdHV1cmQhXCIsXCJTcGVsXCIpO1xuICAgIH1jYXRjaChlcnIpe1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PShiaWRNYWRlPj0wP1wiaGlkZGVuXCI6VklTSUJMRSk7IC8vIHNob3cgYWdhaW5cbiAgICAgICAgaWYoYmlkTWFkZT49MClmb3JjZUZvY3VzKG51bGwpO1xuICAgIH1cbn1cbi8qKlxuICogY2xpY2tpbmcgYSB0cnVtcCBzdWl0ZSBidXR0b24gcmVnaXN0ZXJzIHRoZSBjaG9zZW4gdHJ1bXAgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiB0cnVtcFN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBPT1BTIHVzaW5nIHBhcnNlSW50KCkgaGVyZSBpcyBTT09PTyBpbXBvcnRhbnRcbiAgICBpZih0b0Nob29zZVRydW1wU3VpdGU8PTApcmV0dXJuIGFsZXJ0KFwiSmUgbWFnIG51IGdlZW4gdHJvZWZrbGV1ciBraWV6ZW4uIEhldCB3YWNodGVuIGlzIG9wIGVlbiBzZWludGplIHZhbiBkZSBzZXJ2ZXIuXCIpO1xuICAgIGlmKGNob3NlblRydW1wU3VpdGU+PTApcmV0dXJuIGFsZXJ0KFwiSmUgaGVidCBkZSB0cm9lZmtsZXVyIGFsIGdla296ZW4hXCIpO1xuICAgIGxldCB0cnVtcFN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgaWYoaXNOYU4odHJ1bXBTdWl0ZSl8fHRydW1wU3VpdGU8MClyZXR1cm4gYWxlcnQoYnVnKFwiT25nZWxkaWdlIHRyb2Vma2xldXIhXCIpKTtcbiAgICB0cnl7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgIGNob3NlblRydW1wU3VpdGU9dHJ1bXBTdWl0ZTtcbiAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICBpZihjaG9zZW5UcnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHJ1bXAgc3VpdGUgXCIrY2hvc2VuVHJ1bXBTdWl0ZStcIiBjaG9zZW4uXCIpOyAgICBcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgaWYodG9DaG9vc2VQYXJ0bmVyU3VpdGU8PTApcmV0dXJuIGFsZXJ0KFwiSmUgbWFnIGRlIGtsZXVyIHZhbiBkZSBtZWVnZXZyYWFnZGUga2FhcnQgbnUgbmlldCBraWV6ZW4uIEhldCB3YWNodGVuIGlzIG9wIGVlbiBzZWludGplIHZhbiBkZSBzZXJ2ZXIuXCIpO1xuICAgIGlmKGNob3NlblBhcnRuZXJTdWl0ZT49MClyZXR1cm4gYWxlcnQoXCJKZSBoZWJ0IGRlIGtsZXVyIHZhbiBkZSBtZWVnZXZyYWFnZGUga2FhcnQgYWwgZ2Vrb3plbiFcIik7XG4gICAgLy8gZWl0aGVyIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgc2VsZWN0ZWRcbiAgICAvLyBwYXJzZUludCBWRVJZIElNUE9SVEFOVCEhISFcbiAgICBsZXQgcGFydG5lclN1aXRlPXBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZVwiKSk7XG4gICAgaWYoaXNOYU4ocGFydG5lclN1aXRlKXx8cGFydG5lclN1aXRlPDApcmV0dXJuIGFsZXJ0KGJ1ZyhcIktsZXVyIHZhbiBkZSBtZWVnZXZyYWFnZGUga2FhcnQgb25nZWxkaWchXCIpKTtcbiAgICB0cnl7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICBjaG9zZW5QYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO1xuICAgIH1jYXRjaChlcnIpe1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGlmKGNob3NlblBhcnRuZXJTdWl0ZT49MCl7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFydG5lciBzdWl0ZSBcIitjaG9zZW5QYXJ0bmVyU3VpdGUrXCIgY2hvc2VuLlwiKTsgICAgXG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBwbGF5YWJsZWNhcmRDZWxsLHBsYXlhYmxlY2FyZENlbGxDb250ZW50cztcbi8qKlxuICogY2xpY2tpbmcgYSBwYXJ0bmVyIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBwYXJ0bmVyIHN1aXRlIHdpdGggdGhlIGN1cnJlbnQgcGxheWVyIFxuICogQHBhcmFtIHsqfSBldmVudCBcbiAqL1xuZnVuY3Rpb24gcGxheWFibGVjYXJkQnV0dG9uQ2xpY2tlZChldmVudCl7XG4gICAgXG4gICAgLy8gTURIQDA1RkVCMjAyMDogcHJldmVudCBmcm9tIHBsYXlpbmcgYSBjYXJkIHdoZW4gYSBjYXJkIGhhcyBhbHJlYWR5IGJlZW4gcGxheWVkIChhbmQgbm90IHlldCBjb25maXJtZWQgYnkgdGhlIHNlcnZlcilcbiAgICBpZih0b1BsYXlBQ2FyZDw9MClyZXR1cm4gYWxlcnQoXCJKZSBtYWcgbnUgZ2VlbiBrYWFydCBzcGVsZW4hIEhldCB3YWNodGVuIGlzIG9wIGVlbiBzZWludGplIHZhbiBkZSBzZXJ2ZXIuXCIpO1xuICAgIFxuICAgIGlmKHBsYXllZENhcmRJbmZvKXJldHVybiBhbGVydChcIkplIGhlYnQgYWwgZWVuIGthYXJ0IChubC4gXCIrZ2V0TG9jYWxlQ2FyZFRleHQocGxheWVkQ2FyZEluZm9bMF0pK1wiKSBnZXNwZWVsZC5cIik7XG5cbiAgICBwbGF5YWJsZWNhcmRDZWxsPShldmVudCYmZXZlbnQuY3VycmVudFRhcmdldCk7IC8vIHJlbWVtYmVyIHRoZSAnY2VsbCcgb2YgdGhlIGNhcmQgY2xpY2tlZCEhISFcbiAgICBpZighcGxheWFibGVjYXJkQ2VsbClyZXR1cm47IC8vIFRPRE8gc2hvdWxkIHdlIHJlc3BvbmQgaGVyZT8/Pz9cblxuICAgIGxldCBjYXJkU3VpdGU9cGFyc2VJbnQocGxheWFibGVjYXJkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWlkXCIpKTtcbiAgICBsZXQgY2FyZFJhbms9cGFyc2VJbnQocGxheWFibGVjYXJkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlLWluZGV4XCIpKTtcbiAgICBpZihjYXJkU3VpdGU8Q2FyZC5TVUlURV9ESUFNT05EfHxjYXJkU3VpdGU+Q2FyZC5TVUlURV9TUEFERXx8Y2FyZFJhbms8Q2FyZC5SQU5LX1RXT3x8Y2FyZFJhbms+Q2FyZC5SQU5LX0FDRSlyZXR1cm47XG5cbiAgICAvLy8vLy8vL2lmKHBsYXlhYmxlY2FyZENlbGwuc3R5bGUuYm9yZGVyPVwiMHB4XCIpcmV0dXJuOyAvLyBlbXB0eSAndW5jbGlja2FibGUnIGNlbGxcbiAgICAvLyBNREhAMDVGRUIyMDIwOiByZXBsYWNpbmcgdGhlIG9yaWdpbmFsIGNhbGwgdG8gX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleCgpIHdpdGggdGhlIGNhbGxzIHRvIHRoZSBPbmxpbmVQbGF5ZXIoKSBtZXRob2RzIHJlcGxhY2luZyB0aGUgc2luZ2xlIGNhbGwgc28gd2Uga25vdyB0aGUgY2FyZCBwbGF5ZWQhIVxuICAgIGxldCBjYXJkUGxheWVkPWN1cnJlbnRQbGF5ZXIuX2dldENhcmRXaXRoU3VpdGVBbmRJbmRleChjYXJkU3VpdGUsY2FyZFJhbmspO1xuICAgIGxldCBlcnJvcj1jdXJyZW50UGxheWVyLl9uZXdDYXJkUGxheWVkKGNhcmRQbGF5ZWQpOyBcbiAgICBpZihwbGF5ZWRDYXJkSW5mbyl7IC8vIE1ESEAwNUZFQjIwMjAgcmVwbGFjaW5nOiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKXsgLy8gY2FyZCBhY2NlcHRlZCEhIVxuICAgICAgICBmb3JjZUZvY3VzKG51bGwpOyAvLyBubyBuZWVkIHRvIHByb21wdCB0aGUgdXNlciBhbnltb3JlLCAocyloZSBvbmx5IG5lZWRzIHRvIHdhaXQgZm9yIHRoZSBjYXJkIHRvIGJlIGFycml2ZWQgYnkgdGhlIHNlcnZlclxuICAgICAgICAvKiBNREhAMDVGRUIyMDIwOiBOT1QgdG8gcmVtb3ZlIHRoZSBjYXJkIGZyb20gc2hvd2luZyB1bnRpbCBpdCB3YXMgY29uZmlybWVkIGJ5IHRoZSBzZXJ2ZXIgdG8gaGF2ZSBiZWVuIHBsYXllZCwgd2Ugb25seSBuZWVkIHRvIHByZXZlbnQgcGxheWluZyBhbm90aGVyIGNhcmQhISFcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbENvbnRlbnRzPXBsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MOyAvLyBpbiBjYXNlIHNlbmRpbmcgdGhlIGNhcmQgZmFpbHNcbiAgICAgICAgcGxheWFibGVjYXJkQ2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhmYWxzZSk7IC8vIGRpc2FibGUgdGhlIGNhcmQgYnV0dG9uc1xuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiSmUgaGVidCBcIitnZXRMb2NhbGVDYXJkVGV4dChwbGF5ZWRDYXJkSW5mb1swXSkrXCIgZ2VzcGVlbGQuXCI7IC8vIE1ESEAyM0pBTjIwMjA6IGdldCByaWQgb2YgdGhlIHBsYXkgY2FyZCBwcm9tcHQhXG4gICAgfWVsc2UgLy8gcmVwb3J0IHRoZSBlcnJvciB0byB0aGUgZW5kIHVzZXJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD0oZXJyb3IgaW5zdGFuY2VvZiBFcnJvcj9lcnJvci5tZXNzYWdlOlwiSmUgbWFnIFwiK2dldExvY2FsZUNhcmRUZXh0KGNhcmRQbGF5ZWQpK1wiIG5pZXQgc3BlbGVuLlwiKStcIiBTcGVlbCBlZW4gYW5kZXJlIGthYXJ0IVwiO1xufVxuLyoqXG4gKiBjb252ZW5pZW50IHRvIGJlIGFibGUgdG8gdHVybiB0aGUgcGxheWFibGUgY2FyZCBidXR0b25zIG9uIGFuZCBvZmYgYXQgdGhlIHJpZ2h0IG1vbWVudFxuICogQHBhcmFtIHtlbmFibGV9IGVuYWJsZSBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhlbmFibGUpe1xuICAgIC8vIGNsaWNraW5nIGNhcmQgJ2J1dHRvbnMnIChub3cgY2VsbHMgaW4gdGFibGUpLCB3ZSBjYW4gZ2V0IHJpZCBvZiB0aGUgYnV0dG9uIGl0c2VsZiEhIVxuICAgIC8vIE1ESEAwNUZFQjIwMjA6IGFkZGl0aW9uYWwgY2hlY2s6IGlmIGEgY2VsbCBpcyBlbXB0eSBkbyBub3QgZXJyb25lb3VzbHkgbWFrZSBpdCBjbGlja2FibGUhISEhXG4gICAgZm9yKGxldCBwbGF5YWJsZWNhcmRCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5YWJsZS5jYXJkLXRleHRcIikpXG4gICAgICAgIHBsYXlhYmxlY2FyZEJ1dHRvbi5vbmNsaWNrPShlbmFibGUmJnBsYXlhYmxlY2FyZEJ1dHRvbi5pbm5lckhUTUwubGVuZ3RoPjA/cGxheWFibGVjYXJkQnV0dG9uQ2xpY2tlZDpudWxsKTtcbn1cblxuLy8gaW4gb3JkZXIgdG8gbm90IGhhdmUgdG8gdXNlIFJpa2tlblRoZUdhbWUgaXRzZWxmICh0aGF0IGNvbnRyb2xzIHBsYXlpbmcgdGhlIGdhbWUgaXRzZWxmKVxuLy8gYW5kIHdoaWNoIGRlZmluZXMgUmlra2VuVGhlR2FtZUV2ZW50TGlzdGVuZXIgd2UgY2FuIHNpbXBseSBkZWZpbmUgc3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKVxuLy8gYW5kIGFsd2F5cyBjYWxsIGl0IGZyb20gdGhlIGdhbWUgXG5mdW5jdGlvbiBfZ2FtZVN0YXRlQ2hhbmdlZChmcm9tc3RhdGUsdG9zdGF0ZSl7XG4gICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gVG9lc3RhbmQgdmVyYW5kZXJ0IHZhbiBcIitmcm9tc3RhdGUrXCIgbmFhciBcIit0b3N0YXRlK1wiLlwiKTtcbiAgICBzd2l0Y2godG9zdGF0ZSl7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5JRExFOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkVlbiBzcGVsIGlzIGFhbmdlbWFha3QuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkRFQUxJTkc6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRGUga2FhcnRlbiB3b3JkZW4gZ2VzY2h1ZCBlbiBnZWRlZWxkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURESU5HOlxuICAgICAgICAgICAgLy8gd2hlbiBtb3ZpbmcgZnJvbSB0aGUgREVBTElORyBzdGF0ZSB0byB0aGUgQklERElORyBzdGF0ZSBjbGVhciB0aGUgYmlkIHRhYmxlXG4gICAgICAgICAgICAvLyBBTFRFUk5BVElWRUxZIHRoaXMgY291bGQgYmUgZG9uZSB3aGVuIHRoZSBnYW1lIGVuZHNcbiAgICAgICAgICAgIC8vIEJVVCB0aGlzIGlzIGEgYml0IHNhZmVyISEhXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IGJpZWRlbiBpcyBiZWdvbm5lbiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIC8qIGlmKGZyb21zdGF0ZT09PVBsYXllckdhbWUuREVBTElORykqL1xuICAgICAgICAgICAgY2xlYXJCaWRzVGFibGUoMSk7XG4gICAgICAgICAgICAvLy8vLy8gbGV0J3Mgd2FpdCB1bnRpbCBhIGJpZCBpcyByZXF1ZXN0ZWQhISEhIFxuICAgICAgICAgICAgLy8gTURIQDA5SkFOMjAyMDogTk8sIHdlIHdhbnQgdG8gaW5kaWNhdGUgdGhhdCB0aGUgYmlkZGluZyBpcyBnb2luZyBvblxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuUExBWUlORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgc3BlbGVuIGthbiBiZWdpbm5lbiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVBsYXlhYmxlQ2FyZEJ1dHRvbkNsaWNrSGFuZGxlcnModHJ1ZSk7IC8vIGFsbG93aW5nIHRoZSB1c2VyIHRvIGNsXG4gICAgICAgICAgICAvKiBNREhAMTlKQU4yMDIwOiBpbiBkdWUgY291cnNlIHdlIHdpbGwgYmUgcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyB0d28gbGluZXNcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdC1mb3ItcGxheVwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIHdhaXQtZm9yLXBsYXkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gc2hvdyB0aGUgcGxheSBlbGVtZW50XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gaW5pdGlhdGUtcGxheWluZyB3aWxsIHJlcG9ydCBvbiB0aGUgZ2FtZSB0aGF0IGlzIHRvIGJlIHBsYXllZCEhIVxuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtcGxheWluZ1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuRklOSVNIRUQ6XG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLmdhbWUuX251bWJlck9mVHJpY2tzUGxheWVkKz0xOyAvLyBRVUlDSyBGSVggdG8gZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhdCB0aGUgcmlnaHQgcG9zaXRpb24hISEhIVxuICAgICAgICAgICAgdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7IC8vIHNvIHdlIGdldCB0byBzZWUgdGhlIGxhc3QgdHJpY2sgYXMgd2VsbCEhIVxuICAgICAgICAgICAgdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCk7IC8vIHNob3cgdGhlIHBsYXllciByZXN1bHRzIHNvIGZhclxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsIGlzIGFmZ2Vsb3BlbiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpO1xuICAgICAgICAgICAgc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJPTkxJTkUgPj4+IFRoZSBzdGF0ZSBvZiB0aGUgZ2FtZSBjaGFuZ2VkIHRvICdcIit0b3N0YXRlK1wiJy5cIik7XG59XG5cbmZ1bmN0aW9uIF9nYW1lRXJyb3JPY2N1cnJlZChlcnJvcil7XG4gICAgYWxlcnQoXCJGb3V0OiBcIitlcnJvcik7XG59XG5cbmZ1bmN0aW9uIHNldFBhZ2UobmV3UGFnZSl7XG4gICAgLy8gcmVtZW1iZXIgdGhlIHBhZ2Ugd2UgY2FtZSBmcm9tIChub3QgdGhlIG5ldyBwYWdlISEhISlcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBQYWdlIHRvIHNob3c6ICdcIituZXdQYWdlK1wiJy5cIik7XG4gICAgLy8gaWYgdGhpcyBpcyBhIHBhZ2UgcmVmcmVzaCwgbm8gbmVlZCB0byByZXB1c2ggdGhlIHBhZ2UhISFcbiAgICBpZihjdXJyZW50UGFnZSlpZihjdXJyZW50UGFnZSE9bmV3UGFnZSl2aXNpdGVkUGFnZXMudW5zaGlmdChjdXJyZW50UGFnZSk7XG4gICAgY3VycmVudFBhZ2U9bmV3UGFnZTtcbiAgICB1cGRhdGVIZWxwQnV0dG9ucygpO1xuICAgIC8vIE5PVEUgbm90IGNoYW5naW5nIGN1cnJlbnRQYWdlIHRvIHBhZ2UgdW50aWwgd2UgaGF2ZSBkb25lIHdoYXQgd2UgbmVlZGVkIHRvIGRvXG4gICAgUEFHRVMuZm9yRWFjaChmdW5jdGlvbihfcGFnZSl7XG4gICAgICAgIGxldCBzaG93UGFnZT0oX3BhZ2U9PT1jdXJyZW50UGFnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKChzaG93UGFnZT9cIlNob3dpbmcgXCI6XCJIaWRpbmcgXCIpK1wiICdcIitfcGFnZStcIicuXCIpO1xuICAgICAgICBsZXQgcGFnZUVsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoX3BhZ2UpO1xuICAgICAgICBpZihwYWdlRWxlbWVudCl7XG4gICAgICAgICAgICBwYWdlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PShzaG93UGFnZT9cInZpc2libGVcIjpcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGlmKHNob3dQYWdlKXtcbiAgICAgICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSBwYWdlLSBwcmVmaXhcbiAgICAgICAgICAgICAgICBzd2l0Y2goX3BhZ2Uuc3Vic3RyaW5nKDUpKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJ1bGVzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiRGUgcmVnZWxzIHZhbiBoZXQgb25saW5lIHNwZWwuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXR0aW5nc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIktpZXMgZGUgc3BlZWx3aWp6ZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHVwLWdhbWVcIjogLy8gd2hlbiBwbGF5aW5nIGluIGRlbW8gbW9kZSwgdGhlIHVzZXIgc2hvdWxkIGVudGVyIGZvdXIgcGxheWVyIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0RlZmF1bHRQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJWdWwgZGUgbmFtZW4gdmFuIGRlIHNwZWxlcnMgaW4uIEVlbiBzcGVsZXJuYWFtIGlzIHZvbGRvZW5kZS5cIixcIlNwZWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImF1dGhcIjogLy8gcGFnZS1hdXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiR2VlZiBkZSBuYWFtIG9wIHdhYXJvbmRlciBVIHdpbHQgc3BlbGVuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FpdC1mb3ItcGxheWVyc1wiOiAvLyBwYWdlLXdhaXQtZm9yLXBsYXllcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJFdmVuIGdlZHVsZCBhdWIuIFdlIHdhY2h0ZW4gdG90IGVyIGdlbm9lZyBtZWRlc3BlbGVycyB6aWpuIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmlkZGluZ1wiOiAvLyBwYWdlLWJpZGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvbSBkZSBiZXVydCBvcCBlZW4gdmVyem9layB0b3QgaGV0IGRvZW4gdmFuIGVlbiBib2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5LXJlcG9ydGluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbGF5aW5nXCI6IC8vID8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvIGV2ZXJ5dGhpbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgc3RhcnRpbmcgdGhlIGdhbWUgcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIDFcIjsgLy8ganVzdCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8ganVzdCBpbiBjYXNlISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2FjaHQgb3AgaGV0IHZlcnpvZWsgdG90IGhldCBvcGdldmVuIHZhbiBkZSB0cm9lZmtsZXVyIGVuL29mIGRlIG1lZSB0ZSB2cmFnZW4gYWFzL2hlZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkhldCBzcGVsZW4gYmVnaW50IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiQlVHOiBVbmtub3duIHBhZ2UgJ1wiK19wYWdlK1wiJyByZXF1ZXN0ZWQhXCIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbmV4dFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBuZXh0IHBhZ2UhXCIpO1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgLy8gTURIQDA3SkFOMjAyMDogaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBuZXh0IHBhZ2UsIHdoZW4gbm90IHJ1bm5pbmcgaW4gZGVtbyBtb2RlIHdlIGdvIHRvIHRoZSBwYWdlLWF1dGggcGFnZVxuICAgIC8vICAgICAgICAgICAgICAgIGluIGRlbW8gbW9kZSBza2lwIHRoZSBhdXRoIGFuZCB3YWl0IGZvciBwbGF5ZXJzIGJ1dHRvblxuICAgIHN3aXRjaChwYWdlSW5kZXgpe1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1hdXRoXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogLy8gc2hvdWxkIHdlIGNoZWNrIHRoZSB1c2VyIG5hbWVzPz8/Pz8/XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrMSklUEFHRVMubGVuZ3RoXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBjYW5jZWxQYWdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIk1vdmluZyB0byB0aGUgcHJldmlvdXMgcGFnZS5cIik7XG4gICAgLy8gZ28gb25lIHBhZ2UgYmFja1xuICAgIGxldCBwYWdlSW5kZXg9UEFHRVMuaW5kZXhPZihjdXJyZW50UGFnZSk7XG4gICAgc2V0UGFnZShQQUdFU1socGFnZUluZGV4K1BBR0VTLmxlbmd0aC0xKSVQQUdFUy5sZW5ndGhdKTtcbn1cbmZ1bmN0aW9uIHJldHVyblRvUHJldmlvdXNQYWdlKCl7XG4gICAgLy8gcG9wIG9mZiB0aGUgcGFnZSB3ZSBhcmUgZ29pbmcgdG8gdmlzaXQsIHByZXZlbnRpbmcgdG8gcHVzaCB0aGUgY3VycmVudFBhZ2UgYWdhaW5cbiAgICBpZih2aXNpdGVkUGFnZXMubGVuZ3RoPjApe1xuICAgICAgICBjdXJyZW50UGFnZT1udWxsO1xuICAgICAgICBzZXRQYWdlKHZpc2l0ZWRQYWdlcy5zaGlmdCgpKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzaG93SGVscCgpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgaGVscCFcIik7XG4gICAgc2V0UGFnZSgncGFnZS1ydWxlcycpO1xufVxuLy8gYXNjZXJ0YWluIHRvIGRpc2FibGUgdGhlIEhlbHAgYnV0dG9uIHdoZW4gdmlld2luZyBpdCEhIVxuZnVuY3Rpb24gdXBkYXRlSGVscEJ1dHRvbnMoKXtcbiAgICBsZXQgZW5hYmxlSGVscEJ1dHRvbj0oY3VycmVudFBhZ2UhPT0ncGFnZS1oZWxwJyk7XG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLmRpc2FibGVkPSFlbmFibGVIZWxwQnV0dG9uO1xufVxuXG4vKipcbiAqIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBuZXctcGxheWVycyBidXR0b24gaXMgY2xpY2tlZCwgdG8gc3RhcnQgYSBuZXcgZ2FtZSB3aXRoIGEgbmV3IHNldCBvZiBwbGF5ZXJzXG4gKi9cbmZ1bmN0aW9uIG5ld1BsYXllcnMoKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBOaWV1d2Ugc3BlbGVycyBhYW5tYWtlbi5cIik7XG4gICAgcGxheWVycz1bXTtcbiAgICBsZXQgbm9QbGF5ZXJOYW1lcz10cnVlO1xuICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgcGxheWVyIGlucHV0IGZpZWxkc1xuICAgIGZvcihwbGF5ZXJOYW1lSW5wdXQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1uYW1lLWlucHV0XCIpKXtcbiAgICAgICAgaWYocGxheWVyTmFtZUlucHV0LnZhbHVlLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIG5vUGxheWVyTmFtZXM9ZmFsc2U7XG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gobmV3IE9ubGluZVBsYXllcihwbGF5ZXJOYW1lSW5wdXQudmFsdWUpKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgaWYocGxheWVycy5sZW5ndGg8NClcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChudWxsKTtcbiAgICB9XG4gICAgaWYobm9QbGF5ZXJOYW1lcyl7XG4gICAgICAgIHBsYXllcnM9bnVsbDtcbiAgICAgICAgc2V0SW5mbyhcIkdlZW4gc3BlbGVybmFtZW4gb3BnZWdldmVuLiBIZWIgdGVubWluc3RlIGVlbiBzcGVsZXJuYWFtIG5vZGlnIVwiLFwiU3BlbFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlJpa2tlbiAtIGhldCBzcGVsOiBOaWV1d2Ugc3BlbGVycyBhYW5nZW1hYWt0IVwiKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsR2FtZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsvL2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIkdlZW4gc3BlbCFcIik7XG4gICAgaWYoIXJpa2tlblRoZUdhbWUpe1xuICAgICAgICBhbGVydChcIkdlZW4gc3BlbCBvbSBhZiB0ZSBicmVrZW4hIExhYWQgZGV6ZSB3ZWIgcGFnaW5hIG9wbmlldXchXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGNvbmZpcm0oXCJXaWx0IFUgZWNodCBoZXQgaHVpZGlnZSBzcGVsIGFmYnJla2VuP1wiKSl7XG4gICAgICAgIHJpa2tlblRoZUdhbWUuY2FuY2VsKCk7XG4gICAgfVxufVxuLyogXG5mdW5jdGlvbiBuZXdUcmlja0J1dHRvbkNsaWNrZWQoKXtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO1xuICAgICghcmlra2VuVGhlR2FtZXx8cmlra2VuVGhlR2FtZS5zaG93TmV3VHJpY2tJbmZvKCkpO1xufVxuKi9cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGl0aW9uYWwgc3R1ZmYgdGhhdCB3ZSdyZSBnb2luZyB0byBuZWVkIHRvIG1ha2UgdGhpcyBzdHVmZiB3b3JrXG5jbGFzcyBQbGF5ZXJHYW1lUHJveHkgZXh0ZW5kcyBQbGF5ZXJHYW1lIHtcblxuICAgIC8vIGdldFNlbmRFdmVudChldmVudCxkYXRhKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKStcIi5cIik7XG4gICAgLy8gICAgIHJldHVybiBbZXZlbnQsZGF0YV07XG4gICAgLy8gfVxuXG4gICAgLy8gTURIQDIzSkFOMjAyMDogY2FsbGVkIGZyb20gdXBkYXRlQmlkc1RhYmxlXG4gICAgZ2V0UGxheWVySW5kZXgocGxheWVyTmFtZSl7XG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD0odGhpcy5fcGxheWVyTmFtZXM/dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoOjApO1xuICAgICAgICB3aGlsZSgtLXBsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF0hPT1wbGF5ZXJOYW1lKTtcbiAgICAgICAgaWYocGxheWVySW5kZXg8MCl7Y29uc29sZS5sb2coXCJQbGF5ZXIgbmFtZSAnXCIrcGxheWVyTmFtZStcIicgbm90IGZvdW5kIGluIFwiK0pTT04uc3RyaW5naWZ5KHRoaXMuX3BsYXllck5hbWVzKStcIi5cIik7fVxuICAgICAgICByZXR1cm4gcGxheWVySW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0IG51bWJlck9mUGxheWVycygpe3JldHVybiB0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg7fVxuXG4gICAgLy8gTURIQDI2SkFOMjAyMDogbmVlZGVkIHRoaXMgYXMgd2VsbCB0byBkZXRlcm1pbmUgdGhlIHRydW1wIHBsYXllciAodXNpbmcgYmlkZGVycyBzdGVhZCBvZiBiaWRQbGF5ZXJzIGhlcmUpXG4gICAgZ2V0VHJ1bXBQbGF5ZXIoKXtcbiAgICAgICAgLy8gb25seSB3aGVuIHBsYXlpbmcgYSAncmlrJyBnYW1lICh3aXRoIHRydW1wLCBwbGF5ZWQgd2l0aCBhIHBhcnRuZXIsIGJ1dCBub3QgdHJvZWxhLCB3ZSBoYXZlIGEgdHJ1bXAgcGxheWVyKVxuICAgICAgICBpZih0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLJiZ0aGlzLl9oaWdoZXN0QmlkIT09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXJldHVybiAtMTtcbiAgICAgICAgaWYoIXRoaXMuX2hpZ2hlc3RCaWRkZXJzfHx0aGlzLl9oaWdoZXN0QmlkZGVycy5sZW5ndGg9PTApcmV0dXJuIC0xO1xuICAgICAgICByZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnNbMF07XG4gICAgfVxuXG4gICAgLy8gTURIQDI1SkFOMjAyMDogZ2FtZSBjYW5ub3QgY29udGludWUgdW50aWwgc3VjY2VlZGluZyBpbiBnZXR0aW5nIHRoZSBhY3Rpb24gb3ZlciB0byB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICAvLyAgICAgICAgICAgICAgICB0byBndWFyYW50ZWUgZGVsaXZlcnkgd2UgcnVuIGEgcmVzZW5kIHRpbWVyIHRoYXQgd2lsbCBjb250aW51ZSBzZW5kaW5nIHVudGlsIHRoZSBjYWxsYmFjayBnZXRzIGNhbGxlZFxuICAgIC8vIF9ldmVudFNlbnQgd2lsbCBnZXQgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IHdhcyByZWNlaXZlZCBieSB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICBfc2VudEV2ZW50UmVjZWl2ZWQocmVzdWx0KXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKXtjbGVhckludGVydmFsKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCk7dGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPW51bGw7fVxuICAgICAgICAvKiBNREhAMDdGRUIyMDIwIHNob3VsZCBiZSBkZWFsdCB3aXRoIGluIHRoZSBjYWxsYmFjayBwcmVmZXJhYmx5ISEhXG4gICAgICAgIGZvcmNlRm9jdXMobnVsbCk7XG4gICAgICAgICovXG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPW51bGw7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50UmVjZWl2ZWRDYWxsYmFjayl0aGlzLl9ldmVudFJlY2VpdmVkQ2FsbGJhY2socmVzdWx0LGZhbHNlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJFdmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiBwcm9jZXNzZWQgYnkgZ2FtZSBzZXJ2ZXIuXCIpO1xuICAgIH1cbiAgICBfc2VuZEV2ZW50KCl7XG4gICAgICAgIGxldCByZXN1bHQ9ZmFsc2U7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSB0aW1lb3V0IGNhbGwgdGhlIGNhbGxiYWNrIGFuZCBtYWtlIGl0IGRldGVybWluZSB3aGV0aGVyIHRvIGdpdmUgdXAgc2VuZGluZyBvciBub3RcbiAgICAgICAgICAgIGxldCB0b3NlbmQ9KHRoaXMuX2V2ZW50VG9TZW5kWzJdPT09MHx8IXRoaXMuX2V2ZW50UmVjZWl2ZWRDYWxsYmFja3x8dGhpcy5fZXZlbnRSZWNlaXZlZENhbGxiYWNrKG51bGwsdGhpcy5fZXZlbnRUb1NlbmRbMl0pKTtcbiAgICAgICAgICAgIGlmKHRvc2VuZCl7XG4gICAgICAgICAgICAgICAgc2VuZFRvU2VydmVyKHRoaXMuX3NvY2tldCx0aGlzLl9ldmVudFRvU2VuZFswXSx0aGlzLl9ldmVudFRvU2VuZFsxXSx0aGlzLl9zZW50RXZlbnRSZWNlaXZlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmRbMl0rKztcbiAgICAgICAgICAgICAgICByZXN1bHQ9dHJ1ZTsgXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAvLyBNREhAMDFGRUIyMDIwOiB3ZSBzaG93IGhvdyBvZnRlbiBhIGNlcnRhaW4gZXZlbnQgd2FzIHNlbnQgb24gdGhlIHNlbmRNZXNzYWdlQnV0dG9uXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRbMl0+MSlzZW5kTWVzc2FnZUJ1dHRvbi52YWx1ZT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0rXCIgKFwiK3RoaXMuX2V2ZW50VG9TZW5kWzJdK1wieClcIjtcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQgXCIrdGhpcy5fZXZlbnRUb1NlbmRbMF0rKHRoaXMuX2V2ZW50VG9TZW5kWzFdP1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKTpcIlwiKStcIiBzZW50IChhdHRlbXB0OiBcIit0aGlzLl9ldmVudFRvU2VuZFsyXStcIikuXCIpO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc2VuZGluZyBldmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiBjYW5jZWxlZCFcIik7XG4gICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBGYWlsZWQgdG8gc2VuZCBldmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXStcIiB0byB0aGUgZ2FtZSBzZXJ2ZXIgKHJlYXNvbjogXCIrZXJyb3IubWVzc2FnZStcIikuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1ESEAwN0ZFQjIwMjA6IGlmIHRoZXJlIGlzIGEgY2FsbGJhY2sgd2UncmUgTk9UIHJlc2VuZGluZyBpLmUuIHdlIHJlbHkgb24gdGhlIGFja25vd2xlZGdpbmdcbiAgICAvLyAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgb24gYSB0aW1lb3V0IChpZiByZXF1ZXN0ZWQpIGFzIHdlbGwgd2l0aCBzZWNvbmQgYXJndW1lbnQgc2V0IHRvIHRydWUgKGFuZCByZXN1bHQgdG8gbnVsbClcbiAgICBfc2V0RXZlbnRUb1NlbmQoZXZlbnQsZGF0YSxyZXNlbmRJbnRlcnZhbCxjYWxsYmFjayl7XG4gICAgICAgIGlmKHRoaXMuX2V2ZW50VG9TZW5kKXJldHVybiBmYWxzZTsgLy8gTURIQDA3RkVCMjAyMDogY2FuIGhhdmUgb25seSBvbmUgcGVuZGluZyBldmVudCB0byBzZW5kIGF0IGEgdGltZVxuICAgICAgICB0aGlzLl9ldmVudFJlY2VpdmVkQ2FsbGJhY2s9bnVsbDsgLy8gaW4gY2FzZSB3ZSBmYWlsXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCl7Y2xlYXJJbnRlcnZhbCh0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQpO3RoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZD1udWxsO31cbiAgICAgICAgLy8gbm8gY2FsbGJhY2sgc3BlY2lmaWVkLCBzbyB1c2luZyByZXNlbmQgbWVjaGFuaXNtXG4gICAgICAgIHRoaXMuX2V2ZW50VG9TZW5kPVtldmVudCxkYXRhLDBdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSBzZW5kIGV2ZW50IGNvdW50XG4gICAgICAgIGlmKCF0aGlzLl9zZW5kRXZlbnQoKSlyZXR1cm4gZmFsc2U7IC8vIF9ldmVudFJlY2VpdmVkQ2FsbGJhY2sgZG9lcyBub3QgbmVlZCB0byBiZSBrbm93biB0aGUgZmlyc3QgdGltZSBmb3Igc3VyZS4uLlxuICAgICAgICB0aGlzLl9ldmVudFJlY2VpdmVkQ2FsbGJhY2s9Y2FsbGJhY2s7IC8vIHNvIHdlIGNhbiBzZXQgaXQgaGVyZVxuICAgICAgICAvLyBzY2hlZHVsZSBhIHJlc2VuZCBpZiBzbyBkZXNpcmVkXG4gICAgICAgIGlmKHR5cGVvZiByZXNlbmRJbnRlcnZhbD09PSdudW1iZXInJiZyZXNlbmRJbnRlcnZhbD4wKXRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZD1zZXRJbnRlcnZhbCh0aGlzLl9zZW5kRXZlbnQscmVzZW5kSW50ZXJ2YWwpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyB3aGF0IHRoZSBwbGF5ZXIgd2lsbCBiZSBjYWxsaW5nIHdoZW4gKHMpaGUgbWFkZSBhIGJpZCwgcGxheWVkIGEgY2FyZCwgY2hvb3NlIHRydW1wIG9yIHBhcnRuZXIgc3VpdGVcbiAgICBiaWRNYWRlKGJpZCl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBNREhAMDdGRUIyMDIwIHJlbW92aW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICAvLyBNREhAMDdGRUIyMDIwIGJlY2F1c2Ugd2UgcGFzcyBpbiBhIGNhbGxiYWNrIG5vIGF1dG9tYXRpYyByZXNlbmRpbmchISEhXG4gICAgICAgIGxldCBiaWRNYWRlU2VudFJlc3VsdD10aGlzLl9zZXRFdmVudFRvU2VuZCgnQklEJyxiaWQsZnVuY3Rpb24ocmVzdWx0LGZhaWx1cmVDb3VudCl7XG4gICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJCb2QgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IG5vdz8/PyB0ZWNobmljYWxseSB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBtYWtlIGEgbmV3IGJpZD8/Pz8/Pz8/P1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIHZlcndlcmt0LlwiLFwiU2VydmVyXCIpO1xuICAgICAgICB9KTsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGlmKGJpZE1hZGVTZW50UmVzdWx0KXNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRF9ET05FKTtcbiAgICAgICAgcmV0dXJuIGJpZE1hZGVTZW50UmVzdWx0O1xuICAgIH1cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSdyZSBzZW5kaW5nIHRoZSBleGFjdCBjYXJkIG92ZXIgdGhhdCB3YXMgcGxheWVkIChhbmQgYWNjZXB0ZWQgYXQgdGhpcyBlbmQgYXMgaXQgc2hvdWxkIEkgZ3Vlc3MpXG4gICAgLy8gTURIQDE0SkFOMjAyMDogcGFzc2luZyBpbiB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgJ2ZsYWcnIGFzIHdlbGwhISEhXG4gICAgLy8gICAgICAgICAgICAgICAgYmVjYXVzZSB3ZSdyZSBvdmVycmlkaW5nIHRoZSBiYXNlIFJpa2tlblRoZUdhbWUgaW1wbGVtZW50YXRpb25cbiAgICAvLyAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBkb2Vzbid0IGVuZCB1cCBpbiB0aGUgbG9jYWwgUmlra2VuVGhlR2FtZSB0cmlja1xuICAgIC8vIE1ESEAyN0pBTjIwMjA6IHdlJ3JlIHJlY2VpdmluZyB0cnVlIGZvciBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kIHdoZW4gdGhlIHBsYXllciBpcyBkb2luZyBzb1xuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpe3NldEluZm8oXCJIZXQgc3BlbCBrYW4gbmlldCB2ZXJkZXIgZ2VzcGVlbGQgd29yZGVuIVwiLFwiU3BlbFwiKTtyZXR1cm4gZmFsc2U7fVxuICAgICAgICAvLyBNREhAMTdKQU4yMDIwOiBkaXNhYmxlIHRoZSBidXR0b25zIG9uY2UgdGhlIGNhcmQgaXMgYWNjZXB0ZWQgKHRvIGJlIHBsYXllZCEhISlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgVE9ETyBwZXJoYXBzIGhpZGluZyB0aGUgY2FyZHMgc2hvdWxkIGFsc28gYmUgZG9uZSBoZXJlISEhXG4gICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIGhpZGUgdGhlIGJpZGRpbmcgZWxlbWVudCBhZ2FpblxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgY2FyZCBwbGF5ZWQ6IFwiK2NhcmQudG9TdHJpbmcoKStcIiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyhmYWxzZSk7XG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IHdlIHNlbmQgdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkIGZsYWcgYWxvbmcgZXZlcnkgdGltZSBhbHRob3VnaCBpdCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb24gYW55IHRyaWNrIGNhcmQgZXhjZXB0IHRoZSBmaXJzdCBjYXJkIHBsYXllZCwgYW5kIG5vbi1uZWdhdGl2ZSB2YWx1ZXMgYXJlIGlnbm9yZWQgYXMgd2VsbFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHRoZSBvbmx5IHRoaW5nIHRoYXQgdGhlIG90aGVyIHNpZGUgY2Fubm90IGRldGVybWluZSBpcyB3aGV0aGVyIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYXNrZWQgYmxpbmQhISEhXG4gICAgICAgIC8vIHJlcGxhY2luZzogaWYoYXNraW5nRm9yUGFydG5lckNhcmQ8MCljYXJkUGxheWVkSW5mby5wdXNoKHRydWUpOyAvLyBzZXQgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGJsaW5kIGZsYWchISFcbiAgICAgICAgbGV0IGNhcmRTZW50UmVzdWx0PVxuICAgICAgICAgICAgdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0NBUkQnLFtjYXJkLnN1aXRlLGNhcmQucmFuayxhc2tpbmdGb3JQYXJ0bmVyQ2FyZF0sMCxmdW5jdGlvbihyZXN1bHQsZmFpbHVyZUNvdW50KXtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiO1xuICAgICAgICAgICAgICAgIGVsc2UvLyBjYXJkIHBsYXllZCBhY2NlcHRlZCEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IGdlYWNjZXB0ZWVyZC5cIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgY2FsbCB0byBfc2V0RXZlbnRUb1NlbmQgKHN5bmNocm9ub3VzKSwgYW5kIG9idmlvdXNseSB3ZSBwdXQgYmFjayB0aGUgY2FyZFxuICAgICAgICBpZighY2FyZFNlbnRSZXN1bHQpe1xuICAgICAgICAgICAgYWxlcnQoXCJLYWFydCBuaWV0IHZlcnN0dXVyZD9cIik7XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAvLyAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCI7XG4gICAgICAgICAgICBpZihwbGF5YWJsZWNhcmRDZWxsKVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydCBtaXNsdWt0ISBQcm9iZWVyIGhldCB6byBub2cgZWVucy5cIik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkVyIGlzIGlldHMgbWlzZ2VnYWFuLiBQcm9iZWVyIGhldCB6byBub2cgZWVucy5cIik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkdlc3BlZWxkZSBrYWFydCB2ZXJzdHV1cmQuXCI7XG4gICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9DQVJEX1BMQVlFRCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhcmRTZW50UmVzdWx0O1xuICAgIH1cbiAgICB0cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpe1xuICAgICAgICBpZih0aGlzLl9zdGF0ZT09PVBsYXllckdhbWUuT1VUX09GX09SREVSKXtzZXRJbmZvKFwiSGV0IHNwZWwga2FuIG5pZXQgdmVyZGVyIGdlc3BlZWxkIHdvcmRlbiFcIixcIlNwZWxcIik7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgLy8gTURIQDA3RkVCMjAyMCBiZWNhdXNlIGFscmVhZHkgZG9uZSB3aGVuIGEgdHJ1bXAgc3VpdGUgYnV0dG9uIGlzIGNsaWNrZWQhISEhIHJlbW92aW5nOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgbGV0IHRydW1wU3VpdGVDaG9zZW5TZW50UmVzdWx0PXRoaXMuX3NldEV2ZW50VG9TZW5kKCdUUlVNUFNVSVRFJyx0cnVtcFN1aXRlLDAsZnVuY3Rpb24ocmVzdWx0LGZhaWx1cmVDb3VudCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gdHJvZWZrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gd2hhdCB0byBkbyBub3c/XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gdHJvZWZrbGV1ciBnZWFjY2VwdGVlcmQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgaWYodHJ1bXBTdWl0ZUNob3NlblNlbnRSZXN1bHQpc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfVFJVTVBfRE9ORSk7XG4gICAgICAgIHJldHVybiB0cnVtcFN1aXRlQ2hvc2VuU2VudFJlc3VsdDtcbiAgICB9XG4gICAgcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpe3NldEluZm8oXCJIZXQgc3BlbCBrYW4gbmlldCB2ZXJkZXIgZ2VzcGVlbGQgd29yZGVuIVwiLFwiU3BlbFwiKTtyZXR1cm4gZmFsc2U7fVxuICAgICAgICAvLyBNREhAMDdGRUIyMDIwIGJlY2F1c2UgYWxyZWFkeSBkb25lIHdoZW4gYSB0cnVtcCBzdWl0ZSBidXR0b24gaXMgY2xpY2tlZCEhISEgcmVtb3Zpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGVDaG9zZW5TZW50UmVzdWx0PXRoaXMuX3NldEV2ZW50VG9TZW5kKCdQQVJUTkVSU1VJVEUnLHBhcnRuZXJTdWl0ZSwwLGZ1bmN0aW9uKHJlc3VsdCxmYWlsdXJlQ291bnQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHBhcnRuZXIga2xldXIgbmlldCBnZWFjY2VwdGVlcmQhXCIrXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2Vycm9yJyk/XCIgKGZvdXQ6IFwiK3Jlc3VsdC5lcnJvcitcIilcIjpcIlwiKStcIiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2Vrb3plbiBwYXJ0bmVyIGtsZXVyIGdlYWNjZXB0ZWVyZCFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgLy8gcmVwbGFjaW5nOiB7J3BsYXllcic6dGhpcy5fcGxheWVySW5kZXgsJ3N1aXRlJzpwYXJ0bmVyU3VpdGV9KSk7XG4gICAgICAgICBpZihwYXJ0bmVyU3VpdGVDaG9zZW5TZW50UmVzdWx0KXNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1BBUlRORVJfRE9ORSk7XG4gICAgICAgICByZXR1cm4gcGFydG5lclN1aXRlQ2hvc2VuU2VudFJlc3VsdDtcbiAgICB9XG4gICAgLy8gTURIQDI2SkFOMjAyMDogd2hlbiB0aGUgdXNlciBmaW5pc2hlZCByZWFkaW5nIHRoZSByZXN1bHRzLCBhbmQgd2FudHMgdG8gY29udGludWUgcGxheWluZyBkb25lKCkgc2hvdWxkIGJlIGNhbGxlZFxuICAgIGRvbmUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdET05FJyxudWxsLDAsZnVuY3Rpb24ocmVzdWx0LGZhaWx1cmVDb3VudCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRPTkUgZXZlbnQgYWNrbm93bGVkZ2VkLlwiKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyBNREhAMjlKQU4yMDIwOiBJIGhhdmUgdG8gZG8gdGhpcyBvdGhlcndpc2UgSSB3b24ndCBiZSBhYmxlIHRvIHBsYXkgaW4gYSBuZXcgZ2FtZSAoc2VlIHNldCBwbGF5ZXJOYW1lcyEhISEpXG4gICAgICAgICAgICBzZXRJbmZvKFwiWm9kcmEgZXIgd2VlciB2aWVyIG5pZXQtc3BlbGVuZGUgZGVlbG5lbWVycyB6aWpuIGt1biBqZSB3ZWVyIHNwZWxlbi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4aXQocmVhc29uKXtcbiAgICAgICAgLy8gcGxheWVyIGlzIGV4aXRpbmcgc29tZWhvdy4uLlxuICAgICAgICBsZXQgZGF0YT0ocmVhc29uP3JlYXNvbjooY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6XCJcIikpO1xuICAgICAgICAvLyBpdCBpcyBjcnVjaWFsIHRoYXQgdGhlIEVYSVQgZXZlbnQgaXMgcmVjZWl2ZWQgYnkgdGhlIGdhbWUgc2VydmVyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRFdmVudFRvU2VuZCgnRVhJVCcsZGF0YSxzZXJ2ZXJSZXNwb25zZVN0YXRzLm1heGltdW1SZXNwb25zZU1zLGZ1bmN0aW9uKHJlc3VsdCxmYWlsdXJlQ291bnQpe1xuICAgICAgICAgICAgbGV0IGFja25vd2xlZGdlZD0odHlwZW9mIGZhaWx1cmVDb3VudCE9PW51bWJlcik7XG4gICAgICAgICAgICBpZihhY2tub3dsZWRnZWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVhJVCBldmVudCBcIitkYXRhK1wiIGFja25vd2xlZGdlZCFcIik7XG4gICAgICAgICAgICAgICAgLy8gd2UncmUgTk9UIGdvaW5nIGFueXdoZXJlIGFueW1vcmU6IHNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpO1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlbi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBhbGxvdyB1c2VyIHRvIHRyeSBhZ2Fpbi4uLlxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJTdG9wcGVuIG5vZyBuaWV0IGJldmVzdGlnZC4gUHJvYmVlciBoZXQgem8gbm9nIGVlbnMhXCIsXCJTcGVsXCIpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUdhbWVPdmVyQnV0dG9ucyh0cnVlKTsgLy8gZW5hYmxlIGdhbWUgb3ZlciBidXR0b25zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBzdGF0ZSgpe3JldHVybiB0aGlzLl9zdGF0ZTt9XG4gICAgc2V0IHN0YXRlKG5ld3N0YXRlKXtcbiAgICAgICAgbGV0IG9sZHN0YXRlPXRoaXMuX3N0YXRlO1xuICAgICAgICB0aGlzLl9zdGF0ZT1uZXdzdGF0ZTtcbiAgICAgICAgLy8gZG8gc3R1ZmYgKGNoYW5nZSB0byBhbm90aGVyIHBhZ2UpXG4gICAgICAgIF9nYW1lU3RhdGVDaGFuZ2VkKG9sZHN0YXRlLHRoaXMuX3N0YXRlKTtcbiAgICB9XG5cbiAgICBsb2dFdmVudChldmVudCxkYXRhKXtcbiAgICAgICAgdGhpcy5fZXZlbnRzUmVjZWl2ZWQucHVzaCh7ZXZlbnQ6ZXZlbnQsZGF0YTpkYXRhfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFJlY2VpdmVkIGV2ZW50IFwiK2V2ZW50K1wiIHdpdGggZGF0YSBcIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKXtyZXR1cm4gdGhpcy5fbmFtZTt9XG4gICAgc2V0IG5hbWUobmFtZSl7dGhpcy5fbmFtZT1uYW1lO31cblxuICAgIC8vIFRPRE8gaGF2ZSB0byBjaGFuZ2UgdGhpcyB0byBpbmNsdWRlIHRoZSBmcmllbmRseSBmbGFnIGFzIHdlbGwhISEhXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIHJldHVybih0aGlzLl9wbGF5ZXJOYW1lcyYmcGxheWVySW5kZXg+PTAmJnBsYXllckluZGV4PHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aD90aGlzLl9wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF06bnVsbCk7XG4gICAgfVxuICAgIFxuICAgIGdldFBsYXllck5hbWVzKCl7cmV0dXJuIHRoaXMuX3BsYXllck5hbWVzO30gLy8gb3ZlcnJpZGluZyBnZXRQbGF5ZXJOYW1lcygpIG9mIHRoZSBkZW1vIHZlcnNpb24hIVxuICAgIFxuICAgIHNldCBwbGF5ZXJOYW1lcyhwbGF5ZXJOYW1lcyl7XG5cbiAgICAgICAgLy8gTURIQDI5SkFOMjAyMDogd2FpdCB3aXRoIGFjdHVhbGx5IHBsYXlpbmcgdGhlIGdhbWUgd2l0aCB0aGVzZSBwbGF5ZXJzIHVudGlsIHdlIGZvdW5kIG91dCB0aGF0IHRoZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBjdXJyZW50IHBsYXllciBpcyBhY3R1YWxseSBpbiB0aGUgZ2FtZSEhISEhXG5cbiAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuO1xuXG4gICAgICAgIGlmKHRoaXMuX3BsYXllckluZGV4Pj0wKXJldHVybjsgLy8gYWxyZWFkeSBwbGF5aW5nIHRoZSBnYW1lIEEgSEEgSSBoYXZlIHRvIGtpbGwgdGhlIHBsYXllciBpbmRleCBzb21ld2hlcmUuLi5cblxuICAgICAgICBsZXQgcGxheWVySW5kZXg9KCFwbGF5ZXJOYW1lc3x8cGxheWVyTmFtZXMubGVuZ3RoPDQ/LTE6cGxheWVyTmFtZXMuaW5kZXhPZihjdXJyZW50UGxheWVyLm5hbWUpKTtcbiAgICAgICAgXG4gICAgICAgIGlmKHBsYXllckluZGV4Pj0wKXtcbiAgICAgICAgICAgIC8vIE1ESEAyOUpBTjIwMjA6IGF0IHRoZSBtb21lbnQgdGhhdCB0aGUgcGxheWVyIG5hbWVzIGFyZSByZWNlaXZlZCB0aGUgZ2FtZSBhY3R1YWxseSBzdGFydHNcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIENBUkVGVUwgd2Ugc2hvdWxkIGNvbnNpZGVyIHJlY2VpdmluZyB0aGUgcGxheWVyIG5hbWVzIG1vcmUgdGhhbiBvbmNlPz8/Pz8/XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpOyAvLyAocmUpaW5pdGlhbGl6ZSBBTEwgdGhlIHByb3BlcnRpZXMgb2YgcGxheWluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5fcGxheWVyTmFtZXM9cGxheWVyTmFtZXM7XG4gICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgodGhpcyxwbGF5ZXJJbmRleCk7IC8vIHJlZ2lzdGVyIHdpdGggdGhlIHBsYXllXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJJbmRleD1jdXJyZW50UGxheWVyLl9pbmRleDsgLy8gcmVtZW1iZXIgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICAgICAgdXBkYXRlR2FtZVBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICBzaG93UGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIC8vIHdlIG9ubHkgbmVlZCB0byBzaG93IHRoZSBjdXJyZW50IHBsYXllciBuYW1lIG9uIHBhZ2UtcGxheWluZyBPTkNFIGFzIGl0IHdpbGwgYWx3YXlzIHN0YXkgdGhlIHNhbWVcbiAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgLy8gcmVwbGFjaW5nOiBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1uYW1lXCIpLHRoaXMuZ2V0UGxheWVyTmFtZSh0aGlzLl9wbGF5ZXJJbmRleCksLTIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEN1cnJlbnQgcGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIG5vdCBmb3VuZC5cIik7XG4gICAgICAgICAgICBpZihwbGF5ZXJOYW1lcylcbiAgICAgICAgICAgICAgICBhbGVydChcIkVybnN0aWdlIHByb2dyYW1tYWZvdXQ6IFV3IG5hYW0ga29tdCBuaWV0IHZvb3IgaW4gZGUgc3BlbGVybGlqc3QgdmFuIGhldCB0ZSBzcGVsZW4gc3BlbCFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKHBsYXllckluZGV4KXtcbiAgICAgICAgbGV0IG51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXI9LTE7XG4gICAgICAgIGlmKHBsYXllckluZGV4Pj0wfHxwbGF5ZXJJbmRleDx0aGlzLl9udW1iZXJPZlRyaWNrc1dvbi5sZW5ndGgpe1xuICAgICAgICAgICAgbnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcj10aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwbGF5ZXJJbmRleF07XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBoYXZlIG5vIHBsYXllcnMgYW5kIHNob3VsZCBnZXQgdGhlIHBhcnRuZXIgaWRzIGZyb20gdGhlIHNlcnZlciBpdHNlbGZcbiAgICAgICAgICAgIGxldCBwYXJ0bmVySW5kZXg9KHRoaXMuX3BhcnRuZXJzJiZwbGF5ZXJJbmRleDx0aGlzLl9wYXJ0bmVycy5sZW5ndGg/dGhpcy5fcGFydG5lcnNbcGxheWVySW5kZXhdOi0xKTtcbiAgICAgICAgICAgIGlmKHBhcnRuZXJJbmRleD49MCYmcGFydG5lckluZGV4PHRoaXMuX251bWJlck9mVHJpY2tzV29uLmxlbmd0aCludW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyKz10aGlzLl9udW1iZXJPZlRyaWNrc1dvbltwYXJ0bmVySW5kZXhdO1xuICAgICAgICB9LyplbHNlXG4gICAgICAgICAgICBhbGVydChcIk9uZ2VsZGlnZSBzcGVsZXIgaW5kZXggXCIrcGxheWVySW5kZXgrXCIuXCIpOyovXG4gICAgICAgIHJldHVybiBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyO1xuICAgIH1cblxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHdpbGwgYmUgcmVjZWl2aW5nIHRoZSBuZXcgdHJpY2sgZXZlbnQgd2hlbiBhIG5ldyB0cmljayBzdGFydHNcbiAgICAvLyBNREhAMjJKQU4yMDIwOiB1c2VyIHdpbGwgaGF2ZSB0byBjbGljayB0aGUgbmV3IHRyaWNrIGJ1dHRvbiBzbyB0aGV5IGNhbiBsb29rIGF0IHRoZSBvbGQgdHJpY2sgZmlyc3RcbiAgICBuZXdUcmljayh0cmlja0luZm8pe1xuICAgICAgICBcbiAgICAgICAgLy8gQVNTRVJUIG9ubHkgY2FsbCB3aGVuIHRyaWNrSW5mbyBpcyBub3QgTlVMTCEhISEhXG4gICAgICAgIGlmKCF0cmlja0luZm8pcmV0dXJuIGFsZXJ0KGJ1ZyhcIkdlZW4gc2xhZ2luZm9ybWF0aWUhXCIpKTtcblxuICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTsgLy8gcmVtb3ZlIHRoZSBjYXJkcyBzaG93aW5nIGZyb20gdGhlIHByZXZpb3VzIHRyaWNrXG5cbiAgICAgICAgLy8gc2hvdyB0aGUgaWQgb2YgdGhlIHRyaWNrICh3aGljaCBpcyB0aGUgdHJpY2sgaW5kZXgpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2staWRcIikuaW5uZXJIVE1MPVwiU2xhZyBcIit0cmlja0luZm8uaW5kZXg7XG5cbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQ9dHJpY2tJbmZvLmluZGV4LTE7XG5cbiAgICAgICAgaWYodGhpcy5fdHJpY2spdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7IC8vIHNob3cgdGhlIGZpbmlzaGVkIHRyaWNrIGluIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG5cbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IHRyaWNrIHdpdGggdGhlIGluZm9ybWF0aW9uIGluIHRoZSB0cmljayBpbmZvXG4gICAgICAgIHRoaXMuX3RyaWNrPW5ldyBUcmljayh0cmlja0luZm8uZmlyc3RQbGF5ZXIsdGhpcy5fdHJ1bXBTdWl0ZSx0aGlzLl9wYXJ0bmVyU3VpdGUsdGhpcy5fcGFydG5lclJhbmssdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkLHRyaWNrSW5mby5maXJzdFBsYXllckNhblBsYXlTcGFkZXMpO1xuICAgIFxuICAgICAgICAvKiBzdHVwaWQgbWU6IEkgYWxyZWFkeSBtb3ZlZCBkb2luZyB0aGlzIHRvIHNob3dUcmljaygpIGJ1dCB0aGVyZSBlYXJsaWVyIGluY29ycmVjdCAoaS5lLiBOT1QgY2hlY2tpbmcgdGhlIGZpcnN0IHBsYXllciEhISlcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogaGlkaW5nIG9yIHNob3dpbmcgdGhlIGFza2luZyBmb3IgcGFydG5lciBjYXJkIGNoZWNrYm94IGNhbiBiZSBkZXRlcm1pbmVkIGhlcmUgYW5kIG5vd1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHRoZSBuZWNlc3NhcnkgaW5mb3JtYXRpb24gZm9yIGRlY2lkaW5nIGlzIGNvbXBsZXRlbHkga25vd24gYXQgdGhlIHN0YXJ0IG9mIGEgbmV3IHRyaWNrXG4gICAgICAgIGlmKHRyaWNrSW5mby5maXJzdFBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXgmJnRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZCE9MCl7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgICAgICAvLyB0aGUgbmV4dCBkZWNpc2lvbiBpcyBhIGxpdHRsZSBoYXJkZXIsIGJlY2F1c2Ugc2hvdWxkIHdlIGFsd2F5cyB0dXJuIG9uIHRoZSBjaGVja2JveD8/Pz8/Pz8/XG4gICAgICAgICAgICAvLyBCVVQgbm90ZSB0aGF0IHRoZSB1c2VyIHdpbGwgYmUgcHJvbXB0ZWQgdG8gYWNrbm93bGVkZ2UgYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveFwiKS5zZWxlY3RlZD07XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFzay1wYXJ0bmVyLWNhcmRcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICAgICAgKi9cblxuICAgICAgICAvLyB3ZSBkbyB0aGUgZm9sbG93aW5nIGJlY2F1c2UgaXQgaXMgZXNzZW50aWFsIHRoYXQgdGhlIGNoZWNrYm94IHRoYXQgdGVsbHMgdGhlIHBsYXllciB3aGV0aGVyIG9yIG5vdFxuICAgICAgICAvLyB0aGUgcGFydG5lciBjYXJkIGNhbiBiZSBhc2tlZCBzaG91bGQgYmUgaW4gdGhlIHJpZ2h0IHN0YXRlIHRvIHN0YXJ0IHdpdGggKGZvciB0aGUgcmlnaHQgcGxheWVyKVxuICAgICAgICAvLyBOT1RFIG5ld1RyaWNrKCkgaXMgYmVpbmcgY2FsbGVkIEJFRk9SRSBhIHBsYXllciBpcyBhc2tlZCB0byBwbGF5IGEgY2FyZCwgc28gdGhhdCdzIHRoZSByaWdodCBtb21lbnQhISEhXG4gICAgICAgIHNob3dUcmljayh0aGlzLl90cmljayk7IC8vIFRPRE8gc2hvdWxkIHRoaXMgYmUgaGVyZT8/Pz8/XG5cbiAgICB9XG5cbiAgICAvKiBNREhAMjlKQU4yMDIwOiBOT1QgcmVjZWl2aW5nIHRoZSBwYXJ0bmVyIGlkcyBkaXJlY3RseSBmcm9tIHRoZSBzZXJ2ZXIgYW55bW9yZSBCVVQgZGVyaXZpbmcgdGhlbSBmcm9tIGFueSBwYXJ0bmVyIGlkIHdlIHJlY2VpdmUhISEhIVxuICAgIC8vIE1ESEAyMEpBTjIwMjA6IGlmIHdlIHJlY2VpdmUgYWxsIHBhcnRuZXJzIHdlIGNhbiBleHRyYWN0IHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgIF9zZXRQYXJ0bmVySWRzKHBhcnRuZXJJZHMpe1xuICAgICAgICB0aGlzLl9wYXJ0bmVySWRzPXBhcnRuZXJJZHM7XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgbGV0IGN1cnJlbnRQYXJ0bmVyPSh0aGlzLl9wYXJ0bmVySWRzJiZ0aGlzLl9wbGF5ZXJJbmRleD49MCYmdGhpcy5fcGxheWVySW5kZXg8dGhpcy5fcGFydG5lcklkcy5sZW5ndGg/dGhpcy5fcGFydG5lcklkc1t0aGlzLl9wbGF5ZXJJbmRleF06LTEpO1xuICAgICAgICBpZihjdXJyZW50UGxheWVyLnBhcnRuZXI+PTAmJmN1cnJlbnRQYXJ0bmVyLnBhcnRuZXIhPWN1cnJlbnRQYXJ0bmVyKVxuICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KFwiUmFwcG9ydGVlciBkZSB2b2xnZW5kZSBlcm5zdGlnZSBwcm9ncmFtbWFmb3V0OiAnSmUgcGFydG5lciBpcyB2ZXJhbmRlcmQnLlwiKTtcbiAgICAgICAgY3VycmVudFBsYXllci5wYXJ0bmVyPWN1cnJlbnRQYXJ0bmVyO1xuICAgIH1cbiAgICAqL1xuXG4gICAgbmV3Q2FyZChjYXJkSW5mbyl7XG4gICAgICAgIFxuICAgICAgICAvLyBNREhAMDVGRUIyMDIwOiBpZiB0aGlzIGlzIHRoZSBjYXJkIEkgYWN0dWFsbHkganVzdCBwbGF5ZWQgSSBoYXZlIHRvIGRvIHNvbWUgbW9yZSEhISFcbiAgICAgICAgaWYocGxheWVkQ2FyZEluZm8pe1xuICAgICAgICAgICAgbGV0IHBsYXllZENhcmQ9cGxheWVkQ2FyZEluZm9bMF07XG4gICAgICAgICAgICB0b1BsYXlBQ2FyZD0wOyAvLyBkb25lIHBsYXlpbmcgYSBjYXJkXG4gICAgICAgICAgICBwbGF5ZWRDYXJkSW5mbz1udWxsOyAvLyByZW1vdmUgcGxheWVkQ2FyZEluZm8gdW50aWwgdGhlIG5leHQgY2FyZCB0byBwbGF5IGlzIGJlaW5nIGFza2VkXG4gICAgICAgICAgICBpZihwbGF5YWJsZWNhcmRDZWxsKXtwbGF5YWJsZWNhcmRDZWxsLmlubmVySFRNTD1cIlwiO3BsYXlhYmxlY2FyZENlbGw9bnVsbDt9IC8vIGdldCByaWQgb2YgdGhlIGNhcmQgdGhhdCB3YXMgcGxheWVkLCBzZW50IGFuZCBhY2NlcHRlZFxuICAgICAgICAgICAgLy8gaXQncyBhIHNlcmlvdXMgYnVnIHdoZW4gdGhlIGNhcmQgcGxheWVkIGJ5IG1lIGlzIG5vdCByZXR1cm5lZCBhcyBwbGF5ZWQhISEhXG4gICAgICAgICAgICBpZihwbGF5ZWRDYXJkLnN1aXRlIT1jYXJkSW5mby5zdWl0ZXx8cGxheWVkQ2FyZC5yYW5rIT1jYXJkSW5mby5yYW5rKVxuICAgICAgICAgICAgICAgIGJ1ZyhcIkdlc3BlZWxkZSBrYWFydCBuaWV0IGdlbGlqayBhYW4gZ2VyZWdpc3RyZWVyZGUga2FhcnQhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogY2FyZEluZm8gZG9lcyBub3QgbmVlZCB0byBjb250YWluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBmbGFnIHBlciBzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpdCBhY3R1YWxseSBvbmx5IG5lZWQgdG8gY29udGFpbiBpdCB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBhcyBpbiBhbGxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgb3RoZXIgY2FzZXMgdGhlIHRyaWNrIGNhbiBkZXRlcm1pbmUgaXQgaXRzZWxmIGFuZCBzaG91bGQgTk9UIHJlbHkgb24gaW5mb3JtYXRpb24gc2VudCBieSB0aGUgc2VydmVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IHdvdWxkIGJlIGJldHRlciB0byBjaGFuZ2UgaXQgdG8gYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCBvbiB0aGUgb3RoZXIgc2VydmVyIGVuZCEhXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMgaXMgc29sdmVkIGJ5IHNlbmRpbmcgcGxheVN1aXRlIGFsb25nIHdpdGggY2FyZEluZm8gd2hlbiBzbyBuZWVkZWQhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcImFza2luZ0ZvclBhcnRuZXJDYXJkXCIpKVxuICAgICAgICAgICAgdGhpcy5fdHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQ9Y2FyZEluZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7IC8vIE1ESEAyNkpBTjIwMjA6IHNob3VsZG4ndCBmb3JnZXQgdGhpcyEhISFcbiAgICAgICAgKi9cbiAgICAgICAgLy8gSSBkb24ndCB0aGluayB3ZSBjYW4gZG8gdGhhdD8/Pz8/IHRoaXMuX3RyaWNrLndpbm5lcj1jYXJkSW5mby53aW5uZXI7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cmljay5hZGRDYXJkKG5ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm8uc3VpdGUsY2FyZEluZm8ucmFuaykpO1xuICAgICAgICBpZihlcnJvciBpbnN0YW5jZW9mIEVycm9yKXJldHVybiBidWcoZXJyb3IpOyAvLyB3aGljaCB3b3VsZCBiZSBhIHNlcmlvdXMgYnVnPz8/Pz8/Pz9cblxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBpZiB3ZSdyZSByZWNlaXZpbmcgdGhlIHBsYXkgc3VpdGUgd2UgY2FuIGRldGVybWluZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCBvdXJzZWx2ZXNcbiAgICAgICAgaWYoY2FyZEluZm8uaGFzT3duUHJvcGVydHkoXCJwbGF5U3VpdGVcIikpe1xuICAgICAgICAgICAgLy8gaWYgdGhlIHBsYXkgc3VpdGUgcHJvdmlkZWQgZGlmZmVycyBmcm9tIHRoZSAnYXV0b21hdGljJyBwbGF5IHN1aXRlLCB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGJsaW5kbHlcbiAgICAgICAgICAgIGlmKGNhcmRJbmZvLnBsYXlTdWl0ZSE9PXRoaXMuX3RyaWNrLnBsYXlTdWl0ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpY2sucGxheVN1aXRlPWNhcmRJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0tMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBOT1QgZXhwZWN0aW5nIHRvIHJlY2VpdmUgdGhlIHBhcnRuZXIgaWRzIGFueW1vcmUhISFcbiAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogZXZlcnkgY2FyZCBwbGF5ZWQgY29udGFpbnMgdGhlIHBhcnRuZXJzIGFzIHdlbGwhISFcbiAgICAgICAgaWYoY2FyZEluZm8uaGFzT3duUHJvcGVydHkoXCJwYXJ0bmVyc1wiKSl0aGlzLl9zZXRQYXJ0bmVySWRzKGNhcmRJbmZvLnBhcnRuZXJzKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gaWYgYWxsIHRoZSBjYXJkcyBpbiB0aGUgdHJpY2sgaGF2ZSBiZWVuIHBsYXllZCwgdGhlIHdpbm5lciBpcyBkZWZpbml0ZSwgYW5kIHdpbnMgdGhlIHRyaWNrXG4gICAgICAgIGlmKHRoaXMuX3RyaWNrLm51bWJlck9mQ2FyZHM9PT00KXRoaXMuX251bWJlck9mVHJpY2tzV29uW3RoaXMuX3RyaWNrLndpbm5lcl0rKztcbiAgICAgICAgLy8gZG8gbm90aGluZy4uLlxuICAgICAgICAvLyBzaG93VHJpY2tDYXJkKHRoaXMuX3RyaWNrLmdldExhc3RDYXJkKCksdGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcyk7XG4gICAgICAgIHNob3dUcmljayh0aGlzLl90cmljayk7Ly9pZih0aGlzLl90cmlja1dpbm5lcil7dGhpcy5fdHJpY2tXaW5uZXI9bnVsbDtzaG93VHJpY2sodGhpcy5fdHJpY2spO31cbiAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQ0FSRF9SRUNFSVZFRCk7XG4gICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tjYXJkSW5mby5zdWl0ZV0pK1wiIFwiK0xhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbY2FyZEluZm8ucmFua10rXCIgZ2VzcGVlbGQuXCIsXCJTcGVsXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyogcmVwbGFjaW5nOlxuICAgIHBhcnNlVHJpY2sodHJpY2tJbmZvKXtcbiAgICAgICAgbGV0IHRyaWNrPW5ldyBUcmljayh0cmlja0luZm8uZmlyc3RQbGF5ZXIsdHJpY2tJbmZvLnRydW1wU3VpdGUsdHJpY2tJbmZvLnBhcnRuZXJTdWl0ZSx0cmlja0luZm8ucGFydG5lclJhbmssdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkKTtcbiAgICAgICAgLy8gYWxyZWFkeSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yISEhXG4gICAgICAgIC8vIHRyaWNrLl9maXJzdFBsYXllcj10cmlja0luZm8uZmlyc3RQbGF5ZXI7XG4gICAgICAgIC8vIHRyaWNrLl9jYW5Bc2tGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIGlmKHRyaWNrSW5mby5jYXJkcyYmdHJpY2tJbmZvLmNhcmRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGZpbGwgdGhlIHRyaWNrIHdpdGggdHJpY2sgaW5mb3JtYXRpb24gZnJvbSB0aGUgb3RoZXIgcGxheWVycyEhIVxuICAgICAgICAgICAgdHJpY2tJbmZvLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0pLmhvbGRlcj10cmljazt9KTsgLy8gc3RvcmUgdGhlIGNhcmRzIHJlY2VpdmVkIGluIHRyaWNrXG4gICAgICAgICAgICB0cmljay5fd2lubmVyPXRyaWNrSW5mby53aW5uZXI7XG4gICAgICAgICAgICB0cmljay5fcGxheVN1aXRlPXRyaWNrSW5mby5wbGF5U3VpdGU7XG4gICAgICAgICAgICB0cmljay5fYXNraW5nRm9yUGFydG5lckNhcmQ9dHJpY2tJbmZvLmFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmljaztcbiAgICB9XG4gICAgKi9cblxuICAgIGFja25vd2xlZGdlRXZlbnRzKCl7XG4gICAgICAgIC8vIG5vdyBpZiB0aGUgdW5hY2tub3dsZWRnZSBldmVudCBpZHMgZG8gTk9UIHJlYWNoIHRoZSBzZXJ2ZXIgd2Ugd2lsbCByZWNlaXZlIGNlcnRhaW4gZXZlbnRzIGFnYWluIHVudGlsIHdlIGRvXG4gICAgICAgIC8vIG1hbmFnZSB0byBnZXQgdGhlbSBvdmVyXG4gICAgICAgIC8vIG1ha2UgYSBjb3B5IG9mIGFsbCB0aGUgdW5hY2tub3dsZWRnZWQgZXZlbnRzXG4gICAgICAgIGxldCBhY2tub3dsZWRnZWFibGVFdmVudHM9dGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMubWFwKCh1bmFja25vd2xlZGdlZEV2ZW50KT0+T2JqZWN0LmFzc2lnbih7fSx1bmFja25vd2xlZGdlZEV2ZW50KSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBhY2tub3dsZWRnZWFibGUgZXZlbnRzOiBcIixhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAvLyBvZiBjb3Vyc2Ugd2UgY291bGQgc2VuZCB0aGVtIHBhc3NpbmcgYW4gYWNrbm93bGVkZ2UgZnVuY3Rpb24gdGhvdWdoXG4gICAgICAgIGlmKGFja25vd2xlZGdlYWJsZUV2ZW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAvLyBlbWl0IHBhc3NpbmcgYWxvbmcgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBnZXQgY2FsbGVkIHdoZW4gdGhlIEFDSyBtZXNzYWdlIHdhcyByZWNlaXZlZCBieSB0aGUgc2VydmVyXG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChcIkFDS1wiLGFja25vd2xlZGdlYWJsZUV2ZW50cywoKT0+e1xuICAgICAgICAgICAgICAgIC8vIHdlIG5vdyBtYXkgcmVtb3ZlIGFsbCBhY2tub3dsZWRnZWFibGUgZXZlbnRzXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKiogRXZlbnRzIGFja25vd2xlZGdlbWVudHMgcmVjZWl2ZWQhICoqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLy8vL2RpZmZlcmVuY2UodGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHMsYWNrbm93bGVkZ2VhYmxlRXZlbnRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZHVwbGljYXRlZCBmcm9tIHNlcnZlci1zaWRlIFJpa2tlblRoZUdhbWUuanMgdGhhdCB3aWxsIHRyYW5zbGF0ZSB0aGlzLl9wbGF5ZXJzQmlkcyB0byByZWFkYWJsZSBiaWRzXG4gICAgLy8gdG8gYmUgcGFzc2VkIHRvIHVwZGF0ZUJpZHNUYWJsZSgpISEhXG4gICAgX2dldFBsYXllckJpZHNPYmplY3RzKCl7XG4gICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0cz1bXTtcbiAgICAgICAgdGhpcy5fcGxheWVyc0JpZHMuZm9yRWFjaCgocGxheWVyQmlkcyk9PntcbiAgICAgICAgICAgIGxldCBwbGF5ZXJCaWRzT2JqZWN0PXtuYW1lOnRoaXMuZ2V0UGxheWVyTmFtZShwbGF5ZXJCaWRzT2JqZWN0cy5sZW5ndGgpLGJpZHM6W119O1xuICAgICAgICAgICAgLy8gdXNlIHVuc2hpZnQgTk9UIHB1c2ggYXMgdGhlIGJpZHMgYXJlIHN0b3JlZCByZXZlcnNlIG9yZGVyIFxuICAgICAgICAgICAgcGxheWVyQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWQpPT57cGxheWVyQmlkc09iamVjdC5iaWRzLnVuc2hpZnQoUGxheWVyR2FtZS5CSURfTkFNRVNbcGxheWVyQmlkXSl9KTtcbiAgICAgICAgICAgIHBsYXllckJpZHNPYmplY3RzLnB1c2gocGxheWVyQmlkc09iamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGxheWVyQmlkc09iamVjdHM7XG4gICAgfVxuXG4gICAgX3NldFBhcnRuZXJzKHBhcnRuZXIxLHBhcnRuZXIyKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgI1wiKyhwYXJ0bmVyMSkrXCIgYW5kICNcIisocGFydG5lcjIpK1wiIGFyZSBwYXJ0bmVycyFcIik7XG4gICAgICAgIC8vIE1ESEAwOERFQzIwMTk6IGluc3RlYWQgb2YgZGlyZWN0bHkgc2V0dGluZyB0aGUgcGFydG5lciBwcm9wZXJ0eSBvZiBlYWNoIHBsYXllclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB3ZSB3YWl0IHdpdGggZG9pbmcgc28gYXMgc29vbiBhcyB0aGUgcGFydG5lciBpcyBrbm93biAoYnkgcGxheWluZyB0aGUgcGFydG5lciBjYXJkKVxuICAgICAgICB0aGlzLl9wYXJ0bmVycz1bLTEsLTEsLTEsLTFdO1xuICAgICAgICBsZXQgdGVhbXM9W1twYXJ0bmVyMSxwYXJ0bmVyMl0sW11dO1xuICAgICAgICAvLyBNREhAMjlKQU4yMDIwOiBhdCB0aGlzIGVuZCB3ZSBkbyBub3QgaGF2ZSBfcGxheWVycyBvbmx5IF9wbGF5ZXJOYW1lcyBhbmQgdGhlaXIgX2luZGV4IGlzIHRoZWlyIHBvc2l0aW9uIGluIHRoZSBhcnJheSBvZiBwbGF5ZXIgbmFtZXMhISEhXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzLmZvckVhY2goKHBsYXllck5hbWUsaW5kZXgpPT57aWYoaW5kZXghPT1wYXJ0bmVyMSYmaW5kZXghPT1wYXJ0bmVyMil0ZWFtc1sxXS5wdXNoKGluZGV4KTt9KTtcbiAgICAgICAgdGVhbXMuZm9yRWFjaCgodGVhbSk9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGVhbTogXCIsdGVhbSk7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyc1t0ZWFtWzBdXT10ZWFtWzFdO1xuICAgICAgICAgICAgdGhpcy5fcGFydG5lcnNbdGVhbVsxXV09dGVhbVswXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFydG5lcnMga25vd246IFwiLHRoaXMuX3BhcnRuZXJzKTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjlKQU4yMDIwOiBfc2V0UGFydG5lcigpIGlzIGNhbGxlZCB3aGVuIHRoZSBQQVJUTkVSIGV2ZW50IGlzIHJlY2VpdmVkXG4gICAgLy8gICAgICAgICAgICAgICAgaWYgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyIGlzIGtub3duLCBhbGwgcGFydG5lcnMgYXJlIGtub3duXG4gICAgLy8gICAgICAgICAgICAgICAgYW5kIHRoZSBwYXJ0bmVyIGlkcyBjYW4gYmUgZGVyaXZlZCEhISFcbiAgICBfc2V0UGFydG5lcihwYXJ0bmVyKXtcbiAgICAgICAgY3VycmVudFBsYXllci5wYXJ0bmVyPXBhcnRuZXI7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIucGFydG5lcj49MClpZighdGhpcy5fcGFydG5lcnMpdGhpcy5fc2V0UGFydG5lcnMoY3VycmVudFBsYXllci5faW5kZXgsY3VycmVudFBsYXllci5wYXJ0bmVyKTtcbiAgICB9XG5cbiAgICAvLyBnZW5lcmljIG1ldGhvZCBmb3IgcHJvY2Vzc2luZyBhbnkgZXZlbnQsIGV2ZXJ5XG4gICAgcHJvY2Vzc0V2ZW50KGV2ZW50LGV2ZW50RGF0YSxhY2tub3dsZWRnZSl7XG4gICAgICAgIC8vIGxvZyBldmVyeSBldmVudFxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGV2ZW50LGV2ZW50RGF0YSk7XG4gICAgICAgIGlmKCFldmVudClyZXR1cm47IC8vIE5PVEUgdGhlIGV2ZW50RGF0YSBjYW4gYmUgbnVsbCEhISEhIVxuICAgICAgICAvLyBpZiBkYXRhIGhhcyBhbiBpZCBpdCBuZWVkcyB0byBiZSBhY2tub3dsZWRnZWRcbiAgICAgICAgbGV0IGV2ZW50SWQ9KGV2ZW50RGF0YSYmZXZlbnREYXRhLmhhc093blByb3BlcnR5KFwiaWRcIik/ZXZlbnREYXRhLmlkOm51bGwpO1xuICAgICAgICAvLyBpZiB0aGVyZSdzIGFuIGV2ZW50IGlkIGluIHRoaXMgZXZlbnQsIGFuZCB3ZSdyZSBzdXBwb3NlZCB0byBzZW5kIGFja25vd2xlZGdlbWVudHMsIGRvIHNvXG4gICAgICAgIGlmKGV2ZW50SWQpe1xuICAgICAgICAgICAgLy8gTURIQDE3SkFOMjAyMDogbm93IHB1c2ggdGhlIGV2ZW50IG5hbWUgYXMgd2VsbCBzbyB0aGUgc2VydmVyIGNhbiBsb2cgdGhhdCBhbmQgd2UgY2FuIHNlZSB3aGF0J3MgYWNrbm93bGVnZGVkISEhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBCVVQgZG9uJ3QgcHVzaCBpdCBhZ2FpbiBpZiBpdCdzIGFscmVhZHkgdGhlcmUhISEhXG4gICAgICAgICAgICBpZihhY2tub3dsZWRnZSlcbiAgICAgICAgICAgICAgICBpZih0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGg9PT0wfHx0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50c1t0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5sZW5ndGgtMV0uaWQhPT1ldmVudElkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5wdXNoKHsnaWQnOmV2ZW50SWQsJ2V2ZW50JzpldmVudH0pO1xuICAgICAgICAgICAgdGhpcy5hY2tub3dsZWRnZUV2ZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhPShldmVudElkP2V2ZW50RGF0YS5wYXlsb2FkOmV2ZW50RGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQUk9DRVNTSU5HIEVWRU5UIFwiK2V2ZW50K1wiID4+PlwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgc3dpdGNoKGV2ZW50KXtcbiAgICAgICAgICAgIGNhc2UgXCJJTkZPXCI6XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhkYXRhLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlNUQVRFQ0hBTkdFXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZT1kYXRhLnRvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVcIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9HQU1FX1JFQ0VJVkVEKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdhbWUgaW5mb3JtYXRpb24gcmVjZWl2ZWQgYnkgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicuXCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgbmFtZSBvZiB0aGUgZ2FtZSBub3dcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWU9ZGF0YTtcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgcGxheWVyIG5hbWVzISEhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJTXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRFMpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZXM9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJERUFMRVJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWFsZXI9ZGF0YTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDQVJEU1wiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkRTX1JFQ0VJVkVEKTsgLy8gb25jZSB0aGUgY2FyZHMgaGF2ZSBiZWVuIHJlY2VpdmVkXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGhvbGRhYmxlIGNhcmQgZnJvbSBjYXJkSW5mbyBwYXNzaW5nIGluIHRoZSBjdXJyZW50IHBsYXllciBhcyBjYXJkIGhvbGRlclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChjYXJkSW5mbyk9PntuZXcgSG9sZGFibGVDYXJkKGNhcmRJbmZvWzBdLGNhcmRJbmZvWzFdLGN1cnJlbnRQbGF5ZXIpO30pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0UGFydG5lcihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FX0lORk9cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHR5cGljYWxseSB0aGUgZ2FtZSBpbmZvIGNvbnRhaW5zIEFMTCBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRoZSBnYW1lIHRoYXQgaXMgZ29pbmcgdG8gYmUgcGxheWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGkuZS4gYWZ0ZXIgYmlkZGluZyBoYXMgZmluaXNoZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT1kYXRhLnRydW1wU3VpdGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1kYXRhLnBhcnRuZXJTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbms9ZGF0YS5wYXJ0bmVyUmFuaztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZD1kYXRhLmhpZ2hlc3RCaWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hlc3RCaWRkZXJzPWRhdGEuaGlnaGVzdEJpZGRlcnM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvdXJ0aEFjZVBsYXllcj1kYXRhLmZvdXJ0aEFjZVBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDIwSkFOMjAyMDogbW92ZSBzaG93aW5nIHRoZSBnYW1lIGluZm8gZnJvbSBwbGF5QUNhcmQoKSB0byBoZXJlISEhIVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lclJhbms+PTApeyAvLyBhIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJTdWl0ZUVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1zdWl0ZScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJTdWl0ZUVsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RoaXMuX3BhcnRuZXJTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJSYW5rRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXJhbmsnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyUmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbdGhpcy5fcGFydG5lclJhbmtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwYXJ0bmVyRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lckVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eT1cImluaGVyaXRcIjtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7IC8vIG5vIHBhcnRuZXIgKGNhcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVE9fQklEXCI6XG4gICAgICAgICAgICAgICAgaWYoZGF0YSE9PWN1cnJlbnRQbGF5ZXIubmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1dBSVRfRk9SX0JJRCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGhldCBib2QgdmFuIFwiK2RhdGErXCIuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlUgd29yZHQgem8gb20gZWVuIGJvZCBnZXZyYWFnZC5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAvLyBpZihkYXRhIT09Y3VycmVudFBsYXllci5uYW1lKVxuICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1cIldlIHdhY2h0ZW4gb3AgaGV0IGJvZCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgLy8gZWxzZVxuICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1cIldhdCB3aWwgamUgc3BlbGVuP1wiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIk1BS0VfQV9CSURcIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9CSUQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIubWFrZUFCaWQoZGF0YS5wbGF5ZXJCaWRzT2JqZWN0cyxkYXRhLnBvc3NpYmxlQmlkcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQklEX01BREVcIjogLy8gcmV0dXJuZWQgd2hlbiBhIGJpZCBpcyBtYWRlIGJ5IHNvbWVvbmVcbiAgICAgICAgICAgICAgICAvLy8vLy8vLy9pZihkYXRhLnBsYXllcj09PXRoaXMuX3BsYXllckluZGV4KVxuICAgICAgICAgICAgICAgIGlmKHRvTWFrZUFCaWQ+MCl7IC8vIGl0J3Mgb3VyIGJpZCEhISFcbiAgICAgICAgICAgICAgICAgICAgdG9NYWtlQUJpZD0wO2JpZE1hZGU9LTE7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgcmVtb3Zpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRF9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9Z2V0QmlkSW5mbyhkYXRhLmJpZCxkYXRhLnBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXg/bnVsbDp0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpKTtcbiAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyB0byByZWNlaXZlIGluIGRhdGEgYm90aCB0aGUgcGxheWVyIGFuZCB0aGUgYmlkXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWQtaW5mb1wiKS5pbm5lckhUTUw9Z2V0QmlkSW5mbyhkYXRhLmJpZCxkYXRhLnBsYXllcj09PWN1cnJlbnRQbGF5ZXIuaW5kZXg/bnVsbDp0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkc1tkYXRhLnBsYXllcl0ucHVzaChkYXRhLmJpZCk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBob3cgdG8gc2hvdyB0aGUgYmlkcz8/Pz8/XG4gICAgICAgICAgICAgICAgdXBkYXRlQmlkc1RhYmxlKHRoaXMuX2dldFBsYXllckJpZHNPYmplY3RzKCkpO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IGZhaWwtc2FmZSBCVVQgdGhpcyBzaG91bGQgYmUgZG9uZSBhbm90aGVyIHdheSBUT0RPXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkJvZCB2YW4gXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKGRhdGEucGxheWVyKStcIjogXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbZGF0YS5iaWRdK1wiLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRPX1BMQVlcIjpcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50UGxheWVyLm5hbWUhPT1kYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJXZSB3YWNodGVuIG9wIGRlIGthYXJ0IHZhbiBcIitkYXRhK1wiLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJVIHdvcmR0IHpvIG9tIGVlbiBrYWFydCBnZXZyYWFnZCFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIubmFtZSE9PWRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1pbmZvXCIpLmlubmVySFRNTD1cIldlIHdhY2h0ZW4gb3AgZGUga2FhcnQgdmFuIDxiPlwiK2RhdGErXCI8L2I+LlwiO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiU3BlZWwgZWVuIGthYXJ0IGJpai5cIjtcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLU19UT19XSU5cIjpcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnNldE51bWJlck9mVHJpY2tzVG9XaW4oZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTkVXX1RSSUNLXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUcmljayhkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSU1wiOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFydG5lciBpZHMgcmVjZWl2ZWQgQlVUIG5vIGxvbmdlciB1c2VkIVwiKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9zZXRQYXJ0bmVySWRzKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRfUExBWUVEXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDYXJkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLyogTURIQDAzRkVCMjAyMDogdGhlIHBsYXllciBpbmZvIGlzIG5vdyByZWNlaXZlZCBpbiB0aGUgUExBWV9BX0NBUkQgZXZlbnRcbiAgICAgICAgICAgIGNhc2UgXCJQTEFZRVJfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBjb250YWluIHRoZSBjdXJyZW50IGNhcmRzIHRoZSB1c2VyIGhhc1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0sY3VycmVudFBsYXllcik7fSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDIzSkFOMjAyMDogZ2FtZSBrZWVwcyB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIHRyaWNrcyB3b24gYnkgZWFjaCBwbGF5ZXIhISEhIVxuICAgICAgICAgICAgICAgICAgICAvLyAvLyBhbHNvIHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBhbmQgdG8gd2luXG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnRQbGF5ZXIubnVtYmVyT2ZUcmlja3NXb249ZGF0YS5udW1iZXJPZlRyaWNrc1dvbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gLy8gVE9ETyBQTEFZRVJfSU5GTyBkb2VzIG5vdCBuZWVkIHRvIHNlbmQgdGhlIGZvbGxvd2luZyB3aXRoIGVhY2ggUExBWUVSX0lORk8gVEhPVUdIXG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhLm51bWJlck9mVHJpY2tzVG9XaW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBjYXNlIFwiUExBWV9BX0NBUkRcIjpcbiAgICAgICAgICAgICAgICAvLyBNREhAMDVGRUIyMDIwOiB0aGlzIGlzIGEgYml0IG9mIGEgbnVpc2FuY2UsIHNpbmNlIHdlIHVzZSB0aGUgdG9QbGF5QUNhcmQgZmxhZyBpbiBwbGF5QUNhcmQsIGJ1dCB3ZSBuZWVkIGl0IGhlcmUgc28gbm90IHRvIGRvIHRoZSBleHRyYSB3b3JrXG4gICAgICAgICAgICAgICAgaWYodG9QbGF5QUNhcmQ8PTApeyAvLyBmaXJzdCB0aW1lIHJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQ0FSRCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAwM0ZFQjIwMjA6IHRha2luZyBvdmVyIGZyb20gUExBWUVSX0lORk8gYXMgdGhlIGNhcmRzIGFyZSBub3cgcmVjZWl2ZWQgaW4gdGhlIFBMQVlfQV9DQVJEIGV2ZW50ISEhIVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLl9yZW1vdmVDYXJkcygpOyAvLyBUT0RPIGZpbmQgYSB3YXkgTk9UIHRvIGhhdmUgdG8gZG8gdGhpcyEhIVxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcmRzLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0sY3VycmVudFBsYXllcik7fSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucmVuZGVyQ2FyZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgcmVjZWl2aW5nIHRyaWNrIGluZm8gaW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBOT1QgYW55bW9yZVxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5fdHJpY2spe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlByb2dyYW1tYWZvdXQ6IFUgd29yZHQgb20gZWVuIGthYXJ0IGdldnJhYWdkIGluIGVlbiBvbmdlZGVmaW5pZWVyZGUgc2xhZyEgV2Ugd2FjaHRlbiBldmVuIG9wIHNsYWdpbmZvcm1hdGllLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBNREhAMjdKQU4yMDIwOiBkb2luZyB0aGlzIGFuZCBob3BpbmcgdGhlIG5leHQgcmVxdWVzdCBpcyByZWNlaXZlZCBBRlRFUiByZWNlaXZpbmcgYSBuZXcgdHJpY2shISFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBvY2Nhc3Npb25hbGx5IHdlIG1heSByZWNlaXZlIHRoZSByZXF1ZXN0IHRvIHBsYXkgQkVGT1JFIGFjdHVhbGx5IGhhdmluZyByZWNlaXZlZCB0aGUgc3RhdGUgY2hhbmdlISFcbiAgICAgICAgICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPT1cInBhZ2UtcGxheWluZ1wiKXNldFBhZ2UoXCJwYWdlLXBsYXlpbmdcIik7ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyLnBsYXlBQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9UUlVNUF9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlVHJ1bXBTdWl0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUlVNUF9TVUlURV9DSE9TRU5cIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9UUlVNUF9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKExhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW2RhdGFdKStcIiBnZWtvemVuIGFscyB0cm9lZi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDSE9PU0VfUEFSVE5FUl9TVUlURVwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuY2hvb3NlUGFydG5lclN1aXRlKGRhdGEuc3VpdGVzLGRhdGEucGFydG5lclJhbmtOYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQQVJUTkVSX1NVSVRFX0NIT1NFTlwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1BBUlRORVJfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIHNldEluZm8oY2FwaXRhbGl6ZShMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tkYXRhLnN1aXRlXSkrXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1tkYXRhLnJhbmtdK1wiIG1lZWdldnJhYWdkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSSUNLXCI6XG4gICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzKHRoaXMucGFyc2VUcmljayhkYXRhKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTXCI6IC8vIE1ESEAyM0pBTjIwMjA6IHdvbid0IGJlIHJlY2VpdmluZyB0aGlzIGV2ZW50IGFueW1vcmUuLi5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgdGhlIHRyaWNrcyBmcm9tIHRoZSBhcnJheSBvZiB0cmlja3MgaW4gZGF0YVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlja3M9ZGF0YS5tYXAoKHRyaWNrSW5mbyk9PntyZXR1cm4gdGhpcy5wYXJzZVRyaWNrKHRyaWNrSW5mbyk7fSk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJSRVNVTFRTXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3b24ndCBiZSByZWNlaXZpbmcgYSBuZXcgdHJpY2sgZXZlbnQsIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIHNob3cgdGhlIHVzZXIgdGhhdCB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhlIHBhZ2UgbW92ZWQgdG8gdGhlIHJlc3VsdHMgcGFnZT8/Pz8/P1xuICAgICAgICAgICAgICAgICAgICAvKiByZW1vdmVkLCBhcyB0aGVzZSB0aGluZ3MgYXJlIGRvbmUgd2hlbiB0aGUgZ2FtZSBvdmVyIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RyaWNrKXVwZGF0ZVRyaWNrc1BsYXllZFRhYmxlcygpO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWx0YVBvaW50cz1kYXRhLmRlbHRhcG9pbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb2ludHM9ZGF0YS5wb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVBsYXllclJlc3VsdHNUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJHQU1FT1ZFUlwiOlxuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIGdhbWUgaW5zdGFuY2UgKHJldHVybmluZyB0byB0aGUgcnVsZXMgcGFnZSB1bnRpbCBhc3NpZ25lZCB0byBhIGdhbWUgYWdhaW4pXG4gICAgICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIG5ldy1nYW1lIG9yIHN0b3AgYnV0dG9uIGNsaWNrISEhISEgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLnBsYXlzVGhlR2FtZUF0SW5kZXgobnVsbCwtMSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leGl0KFwiaW4gcmVzcG9uc2UgdG8gJ1wiK2RhdGErXCInXCIpO1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQYWdlIT09XCJwYWdlLWZpbmlzaGVkXCIpc2V0UGFnZShcInBhZ2UtZmluaXNoZWRcIik7IC8vIGlmIHdlIGFyZW4ndCB0aGVyZSB5ZXQhISFcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkaXNjb25uZWN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTURIQDIySkFOMjAyMDogYmV0dGVyIG5vdCB0byBnbyBvdXQgb2Ygb3JkZXIgd2hlbiB0aGlzIGhhcHBlbnMhISEhISFcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVmVyYmluZGluZyBtZXQgZGUgc2VydmVyICh0aWpkZWxpamspIHZlcmJyb2tlbiFcIixcIlNlcnZlclwiKTsgLy8gcmVwbGFjaW5nOiB0aGlzLnN0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIGV2ZW50IFwiK2V2ZW50K1wiIHJlY2VpdmVkIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXBhcmluZyBmb3IgY29tbXVuaWNhdGlvblwiKTtcbiAgICAgICAgLy8gdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5fc3RhdGU9SURMRTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzPVtdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSB1bmFja25vd2xlZGdlZEV2ZW50SWRzXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignZGlzY29ubmVjdCcsKCk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnZGlzY29ubmVjdCcsbnVsbCx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdJTkZPJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdTVEFURUNIQU5HRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1NUQVRFQ0hBTkdFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BMQVlFUlMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0RFQUxFUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0RFQUxFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDQVJEUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NBUkRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQQVJUTkVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVfSU5GTycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUVfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiVE9fQklEXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdNQUtFX0FfQklEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTUFLRV9BX0JJRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdCSURfTUFERScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0JJRF9NQURFJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19QTEFZXCIsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RPX1BMQVknLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIE1ESEAxM0pBTjIwMjA6IHBsYXllciBpbmZvIHdpbGwgYmUgcmVjZWl2ZWQgYmVmb3JlIGJlaW5nIGFza2VkIHRvIHBsYXkgYSBjYXJkIHRvIHVwZGF0ZSB0aGUgcGxheWVyIGRhdGFcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiUExBWUVSX0lORk9cIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUExBWUVSX0lORk8nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTX1RPX1dJTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1RSSUNLU19UT19XSU4nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignTkVXX1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnTkVXX1RSSUNLJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRfUExBWUVEJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRF9QTEFZRUQnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWV9BX0NBUkQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZX0FfQ0FSRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdDSE9PU0VfVFJVTVBfU1VJVEUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDSE9PU0VfVFJVTVBfU1VJVEUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJVTVBfU1VJVEVfQ0hPU0VOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJVTVBfU1VJVEVfQ0hPU0VOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9QQVJUTkVSX1NVSVRFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudChcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCIsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQQVJUTkVSX1NVSVRFX0NIT1NFTicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BBUlRORVJfU1VJVEVfQ0hPU0VOJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1RSSUNLJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0tTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1JFU1VMVFMnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdSRVNVTFRTJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0dBTUVPVkVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRU9WRVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIC8vIGlmIHdlIHJlY2VpdmUgbXVsdGlwbGUgZXZlbnRzIGFzIGEgd2hvbGUsIHdlIHByb2Nlc3MgYWxsIG9mIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0VWRU5UUycsKGV2ZW50cyk9PntcbiAgICAgICAgICAgIC8vIHdlIGNvdWxkIGNvbnN1bWUgdGhlIGV2ZW50cyBJIGd1ZXNzXG4gICAgICAgICAgICB3aGlsZShldmVudHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGV2ZW50PWV2ZW50cy5zaGlmdCgpOyAvLyByZW1vdmUgdGhlIGZpcnN0IGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gYXNjZXJ0YWluIHRvIHNlbmQgYWxsIHVuYWNrbm93bGVkZ2VkIGV2ZW50IGlkcyB3aGVuIHRoaXMgaXMgdGhlIGxhc3QgcHJvY2VzcyBldmVudCEhISFcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NFdmVudChldmVudC5ldmVudCxldmVudC5kYXRhLGV2ZW50cy5sZW5ndGg9PT0wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTURIQDI5SkFOMjAyMDogaWYgd2Ugd2FudCB0byBiZSBhYmxlIHRvIG1ha2UgdGhpcyBwbGF5ZXIgcGxheSBtb3JlIHRoYW4gb25lIGdhbWUgd2l0aCB0aGUgc2FtZSBHYW1lIGluc3RhbmNlXG4gICAgLy8gICAgICAgICAgICAgICAgKHRoaXMgb25lKSwgd2UgbmVlZCB0byB0YWtlIGFsbCBpbml0aWFsaXphdGlvbiBvdXQgb2YgdGhlIGNvbnN0cnVjdG9yIGFuZCBwdXQgaXQgaW4gaGVyZVxuICAgIF9pbml0aWFsaXplR2FtZSgpe1xuICAgICAgICB0aGlzLl9zdGF0ZT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUjtcbiAgICAgICAgdGhpcy5fZXZlbnRzUmVjZWl2ZWQ9W107XG4gICAgICAgIHRoaXMuX3RyaWNrV2lubmVyPW51bGw7XG4gICAgICAgIHRoaXMuX2RlYWxlcj0tMTtcbiAgICAgICAgdGhpcy5fdHJ1bXBTdWl0ZT0tMTsvL3RoaXMuX3RydW1wUGxheWVyPS0xO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9LTE7dGhpcy5fcGFydG5lclJhbms9LTE7XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzV29uPVswLDAsMCwwXTsgLy8gYXNzdW1lIG5vIHRyaWNrcyB3b24gYnkgYW55Ym9keVxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD0wO3RoaXMuX3RyaWNrPW51bGw7XG4gICAgICAgIHRoaXMuX2hpZ2hlc3RCaWQ9LTE7dGhpcy5faGlnaGVzdEJpZGRlcnM9W107dGhpcy50cnVtcFBsYXllcj0tMTsgLy8gbm8gaGlnaGVzdCBiaWRkZXJzIHlldFxuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcz1bW10sW10sW10sW11dOyAvLyBNREhAMjFKQU4yMDIwOiBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgYmlkcyB0byBzaG93XG4gICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPW51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50cz1udWxsO1xuICAgICAgICAvLyB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ9bnVsbDtcbiAgICAgICAgLy8gdGhpcy5fdGVhbU5hbWVzPW51bGw7XG4gICAgICAgIHRoaXMuX3BsYXllckluZGV4PS0xOyAvLyB0aGUgJ2N1cnJlbnQnIHBsYXllclxuICAgICAgICAvLyB0aGluZ3Mgd2UgY2FuIHN0b3JlIGludGVybmFsbHkgdGhhdCB3ZSByZWNlaXZlIG92ZXIgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fbmFtZT1udWxsOyAvLyB0aGUgbmFtZSBvZiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1udWxsOyAvLyB0aGUgbmFtZXMgb2YgdGhlIHBsYXllcnNcbiAgICAgICAgdGhpcy5fcGFydG5lcnM9bnVsbDsgLy8gdGhlIHBhcnRuZXJzICh1c2luZyB0aGUgc2FtZSBuYW1lIGFzIGluIChzZXJ2ZXItc2lkZSkgUmlra2VuVGhlR2FtZS5qcylcbiAgICB9XG5cbiAgICAvLyBNREhAMDhKQU4yMDIwOiBzb2NrZXQgc2hvdWxkIHJlcHJlc2VudCBhIGNvbm5lY3RlZCBzb2NrZXQuaW8gaW5zdGFuY2UhISFcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQpe1xuICAgICAgICAvLyBPT1BTIGRpZG4ndCBsaWtlIGZvcmdldHRpbmcgdGhpcyEhISBcbiAgICAgICAgLy8gYnV0IFBsYXllckdhbWUgZG9lcyBOT1QgaGF2ZSBhbiBleHBsaWNpdCBjb25zdHJ1Y3RvciAoaS5lLiBubyByZXF1aXJlZCBhcmd1bWVudHMpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3NvY2tldD1zb2NrZXQ7XG4gICAgICAgIHRoaXMuX3NlbnRFdmVudFJlY2VpdmVkPXRoaXMuX3NlbnRFdmVudFJlY2VpdmVkLmJpbmQodGhpcyk7dGhpcy5fc2VuZEV2ZW50PXRoaXMuX3NlbmRFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplR2FtZSgpO1xuICAgICAgICB0aGlzLl9wcmVwYXJlRm9yQ29tbXVuaWNhdGlvbigpO1xuICAgIH1cblxuICAgIC8vIGluZm9ybWF0aW9uIGFib3V0IHRoZSBnYW1lIGl0c2VsZiBvcmdhbml6ZWQgYnkgc3RhdGVcbiAgICAvLyBQTEFZSU5HXG4gICAgZ2V0VHJ1bXBTdWl0ZSgpe3JldHVybiB0aGlzLl90cnVtcFN1aXRlO31cbiAgICBnZXRQYXJ0bmVyU3VpdGUoKXtyZXR1cm4gdGhpcy5fcGFydG5lclN1aXRlO31cbiAgICBnZXRQYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG4gICAgLy8gZ2V0VHJ1bXBQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fdHJ1bXBQbGF5ZXI7fVxuICAgIFxuICAgIGdldFBhcnRuZXJOYW1lKHBsYXllcil7IC8vIG9ubHkgd2hlbiBwbGF5ZXIgZXF1YWxzIHRoaXMuX3BsYXllckluZGV4IGRvIHdlIGtub3cgdGhlIHBhcnRuZXJcbiAgICAgICAgbGV0IHBhcnRuZXI9KHBsYXllcj09PXRoaXMuX3BsYXllckluZGV4P2N1cnJlbnRQbGF5ZXIucGFydG5lcjotMSk7XG4gICAgICAgIHJldHVybihwYXJ0bmVyPj0wJiZwYXJ0bmVyPHRoaXMubnVtYmVyT2ZQbGF5ZXJzP3RoaXMuX3BsYXllck5hbWVzW3BhcnRuZXJdOm51bGwpO1xuICAgIH1cblxuICAgIGdldEhpZ2hlc3RCaWRkZXJzKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWRkZXJzO31cbiAgICBnZXRIaWdoZXN0QmlkKCl7cmV0dXJuIHRoaXMuX2hpZ2hlc3RCaWQ7fVxuICAgIC8vIE1ESEAwM0pBTjIwMjA6IEkgbmVlZGVkIHRvIGFkZCB0aGUgZm9sbG93aW5nIG1ldGhvZHNcbiAgICAvLyBnZXRQbGF5ZXJOYW1lKHBsYXllcil7cmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXI8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllcl06XCI/XCIpO31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXtyZXR1cm4gdGhpcy5fZGVsdGFQb2ludHM7fVxuICAgIGdldCBwb2ludHMoKXtyZXR1cm4gdGhpcy5fcG9pbnRzO31cblxuICAgIGlzUGxheWVyUGFydG5lcihwbGF5ZXJJbmRleCxvdGhlclBsYXllckluZGV4KXtyZXR1cm4odGhpcy5fcGFydG5lcnM/dGhpcy5fcGFydG5lcnNbcGxheWVySW5kZXhdPT09b3RoZXJQbGF5ZXJJbmRleDpmYWxzZSk7fVxuICAgIFxuICAgIC8vIGdldExhc3RUcmlja1BsYXllZCgpe3JldHVybiB0aGlzLl9sYXN0VHJpY2tQbGF5ZWQ7fSAvLyBUT0RPIHN0aWxsIHVzZWQ/Pz8/P1xuICAgIGdldCBudW1iZXJPZlRyaWNrc1BsYXllZCgpe3JldHVybiB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZDt9XG4gICAgLy8gZ2V0VHJpY2tBdEluZGV4KHRyaWNrSW5kZXgpe30gLy8gZ2V0IHRoZSBsYXN0IHRyaWNrIHBsYXllZFxuICAgIGdldCBmb3VydGhBY2VQbGF5ZXIoKXtyZXR1cm4gdGhpcy5fZm91cnRoQWNlUGxheWVyO31cbiAgICBnZXRUZWFtTmFtZShwbGF5ZXJJbmRleCl7XG4gICAgICAgIC8vIGNvbXB1dGluZyB0aGUgdGVhbSBuYW1lIG9uIHRoZSBmbHlcbiAgICAgICAgLy8gb2ssIEkndmUgY2hhbmdlIHNlbmRpbmcgdGhlIHBhcnRuZXJJZHMgb3ZlciB0byB0aGUgZ2FtZSwgaW5zdGVhZCBub3cgcGFydG5lciBpcyBiZWluZyBzZXRcbiAgICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IHdlIG5lZWQgdG8gZ28gdGhyb3VnaCB0aGUgcGxheWVyIGFnYWluXG4gICAgICAgIC8qXG4gICAgICAgIGxldCBwbGF5ZXI9dGhpcy5fcGxheWVyc1twbGF5ZXJJbmRleF07XG4gICAgICAgIGxldCBwYXJ0bmVySW5kZXg9cGxheWVyLnBhcnRuZXI7XG4gICAgICAgIHJldHVybiBwbGF5ZXIubmFtZSsocGFydG5lckluZGV4Pj0wP1wiICYgXCIrdGhpcy5nZXRQbGF5ZXJOYW1lKHBhcnRuZXJJbmRleCk6XCJcIik7XG4gICAgICAgICovXG4gICAgICAgIC8vIE5PVCByZXBsYWNpbmc6XG4gICAgICAgIGxldCB0ZWFtTmFtZT10aGlzLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICAvLyBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSBjdXJyZW50IHBsYXllciBiZWluZyBhc2tlZCBhbmQgYW5vdGhlciBwbGF5ZXJcbiAgICAgICAgbGV0IGtub3duUGFydG5lckluZGV4PSh0aGlzLl9wYXJ0bmVycz90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF06LTEpOyAvLyBOT1RFIGNvdWxkIGJlIG51bGwhISFcbiAgICAgICAgLy8gaWYgdGhlIHBsYXllciBpcyBwbGF5aW5nIGJ5IGhpbS9oZXJzZWxmIHRoZXJlIHNob3VsZG4ndCBiZSBhIHBhcnRuZXIhISEhXG4gICAgICAgIGlmKHRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUsmJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVImJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEEpe1xuICAgICAgICAgICAgaWYocGxheWVySW5kZXg9PT1jdXJyZW50UGxheWVyLl9pbmRleCYmY3VycmVudFBsYXllci5wYXJ0bmVyPj0wKXRlYW1OYW1lKz1cIj9cIjtcbiAgICAgICAgICAgIGlmKGtub3duUGFydG5lckluZGV4Pj0wKXRlYW1OYW1lKz1cIiY/XCI7IC8vIHNvbWUgZXJyb3IgYXBwYXJlbnRseSEhISEhXG4gICAgICAgICAgICByZXR1cm4gdGVhbU5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGVhbU5hbWUrPVwiIFwiOyAvLyB3ZSdsbCBoYXZlIHBhcnRuZXIgaW5mb3JtYXRpb24gYmVoaW5kXG4gICAgICAgIGlmKHBsYXllckluZGV4PT09dGhpcy5fcGxheWVySW5kZXgpe1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYXJ0bmVySW5kZXg9Y3VycmVudFBsYXllci5wYXJ0bmVyOyAvLyB0aGUgcGxheWVyIHRoYXQgaGFzIHRoZSByZXF1ZXN0ZWQgcGFydG5lciBjYXJkIGtub3dzIGhpcyBwYXJ0bmVyLi4uXG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBwYXJ0bmVyIGluZGV4IGlzIGtub3duIGJ1dCB0aGUga25vd25QYXJ0bmVySW5kZXggaXMgbm90IHdlIHdyYXAgdGhlIG5hbWUgaW4gKClcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXJ0bmVySW5kZXg+PTAmJmtub3duUGFydG5lckluZGV4PDApdGVhbU5hbWUrPVwiIChcIjtcbiAgICAgICAgICAgIHRlYW1OYW1lKz1cIiAmIFwiOyAvLyB3ZSBhcmUgd2l0aCBhIHBhcnRuZXIgKGFsdGhvdWdoIHdlIG1pZ2h0IG5vdCBjdXJyZW50bHkga25vdyB3aG8pXG4gICAgICAgICAgICAvLyB0aGUgb2ZmaWNpYWwgcGFydG5lciAoYXMga25vd24gdG8gdGhlIGN1cnJlbnQgcGxheWVyKSBpcyB0aGUgb25lIGZyb20gY3VycmVudFBhcnRuZXJJbmRleCAoYW5kIHdlIHNob3cgdGhhdCBuYW1lISlcbiAgICAgICAgICAgIGlmKHRoaXMuX3BhcnRuZXJzKXRlYW1OYW1lKz0oY3VycmVudFBhcnRuZXJJbmRleD49MD90aGlzLmdldFBsYXllck5hbWUoY3VycmVudFBhcnRuZXJJbmRleCk6XCI/XCIpO1xuICAgICAgICAgICAgLy8gY2FuIHdlIGRlYWwgd2l0aCBlcnJvciBzaXR1YXRpb25zIG5vdz8/Pz8/P1xuICAgICAgICAgICAgLy8gdHlwaWNhbGx5IHRoaXMgd291bGQgYmUgdGhlIGNhc2UgaWYgdGhlIGtub3duIHBhcnRuZXIgaW5kZXggZGlmZmVycyBmcm9tIHRoZSBwYXJ0bmVyIGluZGV4IHJlZ2lzdGVyZWQgd2l0aCB0aGUgcGxheWVyISEhXG4gICAgICAgICAgICBpZihrbm93blBhcnRuZXJJbmRleD49MCYmY3VycmVudFBhcnRuZXJJbmRleCE9PWtub3duUGFydG5lckluZGV4KVxuICAgICAgICAgICAgICAgIHRlYW1OYW1lKz1cIj9cIisoa25vd25QYXJ0bmVySW5kZXg+PTA/dGhpcy5nZXRQbGF5ZXJOYW1lKGtub3duUGFydG5lckluZGV4KTpcIlwiKTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQYXJ0bmVySW5kZXg+PTAmJmtub3duUGFydG5lckluZGV4PDApdGVhbU5hbWUrPVwiKVwiOyAgICBcbiAgICAgICAgfWVsc2UgLy8gbmFtZSBvZiBhbm90aGVyIHBsYXllcidzIHBhcnRuZXIgYmVpbmcgYXNrZWQsIGNhbiBvbmx5IGJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoaXMuX3BhcnRuZXJzXG4gICAgICAgICAgICB0ZWFtTmFtZSs9XCIgJiBcIisoa25vd25QYXJ0bmVySW5kZXg+PTA/dGhpcy5nZXRQbGF5ZXJOYW1lKGtub3duUGFydG5lckluZGV4KTpcIj9cIik7XG4gICAgICAgIHJldHVybiB0ZWFtTmFtZTtcbiAgICB9XG59XG5cbnZhciBwcmVwYXJlZEZvclBsYXlpbmc9ZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXBhcmVGb3JQbGF5aW5nKCl7XG5cbiAgICBwcmVwYXJlZEZvclBsYXlpbmc9dHJ1ZTtcblxuICAgIHNlbmRNZXNzYWdlVGV4dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbmQtbWVzc2FnZS10ZXh0XCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VuZC1tZXNzYWdlLWJ1dHRvblwiKS5vbmNsaWNrPXNlbmRNZXNzYWdlQnV0dG9uQ2xpY2tlZDtcblxuICAgIC8vIE1ESEAxMEpBTjIwMjA6IHdlIHdhbnQgdG8ga25vdyB3aGVuIHRoZSB1c2VyIGlzIHRyeWluZyB0byBtb3ZlIGF3YXkgZnJvbSB0aGUgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICBpZighY3VycmVudFBsYXllcilyZXR1cm4gbnVsbDsgLy8gTURIQDEyRkVCMjAyMDogaWYgbm8gY3VycmVudCBwbGF5ZXIgKGFueW1vcmUpIG5vIHdhcm5pbmdcbiAgICAgICAgLy8gaG93IGFib3V0IHByb21wdGluZyB0aGUgdXNlcj8/Pz8/XG4gICAgICAgIC8vIGlmKCFjdXJyZW50UGxheWVyfHwhY3VycmVudFBsYXllci5nYW1lKXJldHVybjsgLy8gZG8gbm90IGFzayB0aGUgdXNlciB3aGV0aGVyIHRoZXkgd2FudCB0byBzdGF5IG9yIG5vdCAoYXMgdGhleSBjYW5ub3Qgc3RheSlcbiAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgdmlld2luZyB0aGUgcmVzdWx0cyBwYWdlIHdlIG1heSBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBhY3R1YWxseSBvdmVyXG4gICAgICAgIHJldHVybihjdXJyZW50UGFnZT09PSdwYWdlLXJlc3VsdHMnP1wiQmVkYW5rdCB2b29yIGhldCBzcGVsZW4uIFRvdCBkZSB2b2xnZW5kZSBrZWVyIVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlwiSGV0IHNwZWwgaXMgbm9nIG5pZXQgdGVuIGVpbmRlLiBCbGlqZiBvcCBkZSBwYWdpbmEgb20gdG9jaCB2ZXJkZXIgdGUgc3BlbGVuLlwiKTtcbiAgICB9O1xuICAgIC8vIGlmIHdlIGFjdHVhbGx5IGVuZCB1cCBpbiBsZWF2aW5nIHRoaXMgVVJMLCB3ZSBkZWZpbml0ZWx5IHdhbnQgdG8ga2lsbCB0aGUgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGZvciBnb29kXG4gICAgd2luZG93Lm9ucG9wc3RhdGU9ZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gTURIQDA3RkVCMjAyMDogaXQncyBraW5kYSBydWRlIHRvIGxlYXZlIHRoZSBwYWdlIGluIHRoZSBtaWRkbGUgb2YgYSBnYW1lIHdpdGhvdXQgdGVsbGluZyB0aGUgZ2FtZSBlbmdpbmVcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgSSBzdXBwb3NlIHdlIHNob3VsZCBoYW5kbGUgdGhpcyBkaWZmZXJlbnRseSBlLmcuIGJ5IHJ1bm5pbmcgc29tZSBzb3J0IG9mIHBpbmcgdGltZXIgdGVsbGluZyB0aGUgZ2FtZSB0byBiZSBhbGl2ZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBzbyB0aGF0IHRoZSBnYW1lIGVuZ2luZSBjYW4gdGhyb3cgYSBwZXJzb24gb3V0IGF0IHRoZSByaWdodCB0aW1lXG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXImJmN1cnJlbnRQbGF5ZXIuZ2FtZSYmY3VycmVudFBsYXllci5nYW1lLnN0YXRlIT09UGxheWVyR2FtZS5GSU5JU0hFRClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogUGxheWVyICdcIitjdXJyZW50UGxheWVyLm5hbWUrXCInIGhhcyBzdG9wcGVkIHBsYXlpbmcgdGhlIGdhbWUgYW55IGZ1cnRoZXIsIGVmZmVjdGl2ZWx5IGNhbmNlbGluZyBpdC5cIik7XG4gICAgICAgIC8qIG5vdCBtdWNoIHVzZSB0byBkbyBhbnl0aGluZy4uLlxuICAgICAgICBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIuZXhpdCgnRVhJVCcpOyAvLyBpZiB3ZSBoYXZlbid0IGRvbmUgc28geWV0ISEhIVxuICAgICAgICBzZXRQbGF5ZXJOYW1lKG51bGwsbnVsbCk7IC8vIHdpdGhvdXQgY2FsbGJhY2sgbm8gcGFnZSBzaG91bGQgYmUgc2hvd24gYW55bW9yZS4uLlxuICAgICAgICAqL1xuICAgIH1cblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGhpZGUgdGhlIGJpZGRpbmcgYW5kIHBsYXlpbmcgZWxlbWVudHNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgIC8vIHJlcGxhY2VkIGJ5IGJpZC1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7XG4gICAgLy8gRE8gTk9UIERPIFRISVMgV0lMTCBPVkVSUlVMRSBQQVJFTlQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIE1ESEAxOUpBTjIwMjA6IFwiaGlkZGVuXCIgY2hhbmdlZCB0byBcInZpc2libGVcIiBhcyB3ZSBuZXZlciBoaWRlIHRoZSBjYXJkcyBvZiB0aGUgY3VycmVudCBwbGF5ZXJzXG4gICAgLy8gcmVwbGFjZWQgYnkgcGxheS1pbmZvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBNREhAMTlKQU4yMDIwOiBhbmQgdmljZSB2ZXJzYVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpbmdsZS1wbGF5ZXItZ2FtZS1idXR0b24nKS5vbmNsaWNrPXNpbmdsZVBsYXllckdhbWVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIGZvcihsZXQgYmFja0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrJykpYmFja0J1dHRvbi5vbmNsaWNrPXJldHVyblRvUHJldmlvdXNQYWdlO1xuICAgIC8vIHNob3cgdGhlIHBhZ2UtcnVsZXMgcGFnZSB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIGhlbHBcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24ub25jbGljaz1zaG93SGVscDtcbiAgICAvLyBNREhAMTBKQU4yMDIwOiBFTkRcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzIGZvciBuZXh0LCBjYW5jZWwsIGFuZCBuZXdQbGF5ZXJzIGJ1dHRvbnNcbiAgICBmb3IobGV0IG5leHRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV4dCcpKW5leHRCdXR0b24ub25jbGljaz1uZXh0UGFnZTtcbiAgICBmb3IobGV0IGNhbmNlbEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwnKSljYW5jZWxCdXR0b24ub25jbGljaz1jYW5jZWxQYWdlO1xuXG4gICAgaWYoZ2V0Q29va2llKCdjb25uZWN0LnNpZCcpKSAvLyBzdXBwb3NlZGx5IGluIGEgcmVnaXN0ZXJlZCB1c2VyIHNlc3Npb25cbiAgICAgICAgZm9yKGxldCBzdG9wQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N0b3AnKSlzdG9wQnV0dG9uLm9uY2xpY2s9c3RvcEJ1dHRvbkNsaWNrZWQ7XG4gICAgZWxzZSAvLyBubyBuZWVkIGZvciBzdG9wIGJ1dHRvbnNcbiAgICAgICAgZm9yKGxldCBzdG9wQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N0b3AnKSlzdG9wQnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG5cbiAgICAvLyBsZXQncyBhc3N1bWUgdGhhdCB0aGUgZ2FtZSBpcyBvdmVyIHdoZW4gbmV3LWdhbWUgYnV0dG9ucyBhcmUgc2hvd2luZ1xuICAgIC8vIHdlJ3JlIG5vdCB0byBraWxsIHRoZSBjb25uZWN0aW9uLCB3ZSdsbCBqdXN0IGtlZXAgdXNpbmcgdGhlIHNhbWUgY29ubmVjdGlvblxuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5vbmNsaWNrPW5ld0dhbWVCdXR0b25DbGlja2VkO1xuICAgIC8qXG4gICAgLy8gd2hlbmV2ZXIgd2UgaGF2ZSBuZXcgcGxheWVyKG5hbWUpc1xuICAgIGZvcihsZXQgbmV3R2FtZVBsYXllcnNCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmV3LWdhbWUtcGxheWVycycpKW5ld0dhbWVQbGF5ZXJzQnV0dG9uLm9uY2xpY2s9bmV3R2FtZVBsYXllcnM7XG4gICAgLy8gd2hlbmV2ZXIgdGhlIGdhbWUgaXMgY2FuY2VsZWRcbiAgICBmb3IobGV0IGNhbmNlbEdhbWVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsLWdhbWUnKSljYW5jZWxHYW1lQnV0dG9uLm9uY2xpY2s9Y2FuY2VsR2FtZTtcbiAgICAqL1xuXG4gICAgLy8gYXR0YWNoIGFuIG9uY2xpY2sgZXZlbnQgaGFuZGxlciBmb3IgYWxsIGJpZCBidXR0b25zXG4gICAgZm9yKGxldCBiaWRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJpZFwiKSliaWRCdXR0b24ub25jbGljaz1iaWRCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIHByZXBhcmUgZm9yIHNob3dpbmcvaGlkaW5nIHRoZSBjYXJkcyBvZiB0aGUgY3VycmVudCBiaWRkZXJcbiAgICBpbml0aWFsaXplQ29sbGFwc2luZ0J1dHRvbnMoKTtcbiAgICAvLyByZXBsYWNpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLWJpZGRlci1jYXJkc1wiKS5vbmNsaWNrPXRvZ2dsZUJpZGRlckNhcmRzO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlciBmb3Igc2VsZWN0aW5nIGEgc3VpdGVcbiAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuYmlkLXRydW1wXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9dHJ1bXBTdWl0ZUJ1dHRvbkNsaWNrZWQ7XG4gICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1aXRlLmJpZC1wYXJ0bmVyXCIpKXN1aXRlQnV0dG9uLm9uY2xpY2s9cGFydG5lclN1aXRlQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICAvLyBtYWtlIHRoZSBzdWl0ZSBlbGVtZW50cyBvZiBhIHNwZWNpZmljIHR5cGUgc2hvdyB0aGUgcmlnaHQgdGV4dCEhISFcbiAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8NDtzdWl0ZSsrKVxuICAgICAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuXCIrQ2FyZC5TVUlURV9OQU1FU1tzdWl0ZV0pKVxuICAgICAgICAgICAgc3VpdGVCdXR0b24udmFsdWU9Q2FyZC5TVUlURV9DSEFSQUNURVJTW3N1aXRlXTtcbiAgICBcbiAgICAvKiBNREhAMjJKQU4yMDIwOiBldmVudCBoYW5kbGVyIGZvciBjbGlja2luZyB0aGUgbmV3IHRyaWNrIGJ1dHRvblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5vbmNsaWNrPW5ld1RyaWNrQnV0dG9uQ2xpY2tlZDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLXdpbm5lci1pbmZvXCIpLnN0eWxlLnZpc2libGU9J2hpZGRlbic7XG4gICAgKi9cblxuICAgIC8vIE1ESEAwOUpBTjIwMjA6IGNoZWNrIGZvciBhIHVzZXIgbmFtZVxuICAgIHZhciB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgIC8vIE1ESEAyNEpBTjIwMjA6IGNoYW5nZWQgJ3BsYXllcicgdG8gJ2FscychISEgTk9URSB0aGlzIGlzIGEgYmFjay1kb29yXG4gICAgbGV0IGluaXRpYWxQbGF5ZXJOYW1lPSh1cmxQYXJhbXMuaGFzKFwiYWxzXCIpP3VybFBhcmFtcy5nZXQoXCJhbHNcIikudHJpbSgpOm51bGwpO1xuICAgIC8vIHN0YW5kYWxvbmUgZXhlY3V0aW9uIGkuZS4gbm8gb24gZXhpdCBjYWxsYmFjayEhIVxuICAgIGlmKGluaXRpYWxQbGF5ZXJOYW1lJiZpbml0aWFsUGxheWVyTmFtZS5sZW5ndGg+MClzZXRQbGF5ZXJOYW1lKGluaXRpYWxQbGF5ZXJOYW1lLG51bGwpO1xufVxuXG4vLyBNREhAMDhKQU4yMDIwOiBncmVhdCBpZGVhIHRvIG1ha2UgZXZlcnl0aGluZyB3b3JrIGJ5IGFsbG93aW5nIHRvIHNldCB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIF9zZXRQbGF5ZXIocGxheWVyKXtcbiAgICB2aXNpdGVkUGFnZXM9W107IC8vIGZvcmdldCB2aXNpdGVkIHBhZ2VzXG4gICAgY3VycmVudFBhZ2U9bnVsbDsgLy8gYXNjZXJ0YWluIHRvIG5vdCBoYXZlIGEgcGFnZSB0byBzdG9yZVxuICAgIC8vIGdldCByaWQgb2YgdGhlIGN1cnJlbnQgcGxheWVyIChpZiBhbnkpLCBhbmQgaW4gZWZmZWN0IHdlJ2xsIGxvb3NlIHRoZSBnYW1lIGFzIHdlbGxcbiAgICBpZihjdXJyZW50UGxheWVyKXtcbiAgICAgICAgY3VycmVudFBsYXllci5leGl0KCdTVE9QJyk7IC8vIGV4aXQgdGhlIGN1cnJlbnQgcGxheWVyIGZyb20gd2hhdGV2ZXIgZ2FtZSAocyloZSBoYXMgcGxheWVkISEhIVxuICAgICAgICAvLyBubyBuZWVkIHRvIGNoYW5nZSBjdXJyZW50UGxheWVyIGJlY2F1c2UgaXQncyBnb25uYSBiZSByZXBsYWNlZCBhbnl3YXlcbiAgICAgICAgLy8gYnV0IHdpbGwgZGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIgYW55d2F5XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9KGN1cnJlbnRHYW1lP2N1cnJlbnRHYW1lLl9zb2NrZXQ6bnVsbCk7IC8vIE1ESEAxMkZFQjIwMjA6IHRoZSBnYW1lIGtlZXBzIGEgcmVmZXJlbmNlIHRvIHRoZSBzb2NrZXRcbiAgICAgICAgLy8gZGlzY29ubmVjdCBpZiBuZWVkIGJlXG4gICAgICAgICghY2xpZW50c29ja2V0fHwhY2xpZW50c29ja2V0LmNvbm5lY3RlZHx8Y2xpZW50c29ja2V0LmRpc2Nvbm5lY3QoKSk7XG4gICAgICAgIC8vIHJlcGxhY2luZzogY3VycmVudFBsYXllci5nYW1lPW51bGw7IC8vIGdldCByaWQgb2YgdGhlIGdhbWUgKHdoaWNoIHdpbGwgZGlzY29ubmVjdCB0aGUgc29ja2V0IGFzIHdlbGwpIFdJU0hGVUwgVEhJTktJTkcuLi5cbiAgICAgICAgY3VycmVudFBsYXllcj1udWxsO1xuICAgICAgICBzaG93Q3VycmVudFBsYXllck5hbWUoKTtcbiAgICAgICAgLy8vLy8vLy8vLy9pZihlcnJvcmNhbGxiYWNrKVxuICAgICAgICBzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gTURIQDEwSkFOMjAyMDogd2hlbmV2ZXIgdGhlIGN1cnJlbnRQbGF5ZXIgaXMgTk9UIGF2YWlsYWJsZSBnbyB0byBcInBhZ2UtcnVsZXNcIlxuICAgIH1cbiAgICAvLyBpZihlcnJvcmNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyB0aGUgcGFnZSB3ZSBjYW4gc2hvdyBpZiB0aGVyZSdzIG5vIHBsYXllciEhISEgKFRPRE8gb3IgcGFnZS1hdXRoPz8/Pz8pXG4gICAgaWYocGxheWVyKXtcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1pbyhsb2NhdGlvbi5wcm90b2NvbCsnLy8nK2xvY2F0aW9uLmhvc3QpO1xuICAgICAgICAvLyBNREhAMDlGRUIyMDIwOiBhZGRpbmcgYWxsIG90aGVyIHBvc3NpYmxlIGVycm9ycyB3ZSBzaG91bGQgYmUgaGFuZGxpbmdcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0aW5nJywoKT0+e2NvbnNvbGUubG9nKFwiQ29ubmVjdGluZy4uLlwiKTt9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdkaXNjb25uZWN0JywoKT0+e2NvbnNvbGUubG9nKFwiRGlzY29ubmVjdFwiKTt9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0X2ZhaWxlZCcsKCk9Pntjb25zb2xlLmxvZyhcIkNvbm5lY3QgZmFpbGVkLi4uXCIpO30pO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ2Vycm9yJywoZXJyKT0+e2NvbnNvbGUubG9nKFwiRVJST1I6IFwiK2Vyci5tZXNzYWdlK1wiLlwiKTt9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdyZWNvbm5lY3QnLCgpPT57Y29uc29sZS5sb2coXCJSZWNvbm5lY3Qgc3VjY2Vzc2Z1bCFcIik7fSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbigncmVjb25uZWN0aW5nJywoKT0+e2NvbnNvbGUubG9nKFwiUmVjb25uZWN0aW5nLi4uXCIpO30pO1xuICAgICAgICBjbGllbnRzb2NrZXQub24oJ3JlY29ubmVjdF9mYWlsZWQnLCgpPT57Y29uc29sZS5sb2coXCJSZWNvbm5lY3RpbmcgZmFpbGVkLlwiKTt9KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKGN1cnJlbnRQbGF5ZXI/XCJSZWNvbm5lY3RlZFwiOlwiQ29ubmVjdGVkXCIpK1wiIHRvIHRoZSBnYW1lIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpeyAvLyBmaXJzdCB0aW1lIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBkbyBOT1Qgc3RhcnQgcGxheWluZyBhIGdhbWUgdW50aWwgd2UgcmVjZWl2ZSB0aGUgcGxheWVyIG5hbWVzISEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9NDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWU9bmV3IFBsYXllckdhbWVQcm94eShjbGllbnRzb2NrZXQpOyAvLyBsZXQncyBjcmVhdGUgdGhlIGdhbWUgdGhhdCBpcyB0byByZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTsgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgcmVtb3ZlZDogaWYodHlwZW9mIGVycm9yY2FsbGJhY2s9PT0nZnVuY3Rpb24nKWVycm9yY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgaXMgaGVyc3RlbGQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLy8gTURIQDIzSkFOMjAyMDogcHVzaCB0aGUgcGxheWVyIG5hbWUgdG8gdGhlIHNlcnZlciBhZ2Fpbiwgc28gaXQgY2FuIHJlc2VuZCB3aGF0IG5lZWRzIHNlbmRpbmchISEhXG4gICAgICAgICAgICAgICAgLy8gTURIQDEzRkVCMjAyMDogd2Ugc2hvdWxkIGJlIHB1c2hpbmcgUExBWUVSIGlkZW50aWZpY2F0aW9uIHVudGlsIHdlIGdldCBhIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllcilyZWdpc3RlcmluZ1BsYXllcklkPXNldFRpbWVvdXQocmVnaXN0ZXJQbGF5ZXIsMSk7IC8vIDEgbXMgZGVsYXkgaXMgc3VmZmljaWVudD8/Pz8/Pz9cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIGlzIHZlcmJyb2tlbi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAvLyBNREhAMDdGRUIyMDIwIHJlbW92ZWQ6ICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlci5cIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdF9lcnJvcicsKGVycik9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBlcnJvcjogXCIsZXJyKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBlZW4gcHJvYmxlZW0gbWV0IGRlIHZlcmJpbmRpbmcgKFwiK2Vyci5tZXNzYWdlK1wiKSFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIC8vICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyB0cnkgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIGNhdGNoaW5nIHdoYXRldmVyIGhhcHBlbnMgdGhyb3VnaCBldmVudHNcbiAgICAgICAgY2xpZW50c29ja2V0LmNvbm5lY3QoKTtcbiAgICB9ZWxzZXsgLy8gbm8gcGxheWVyIGFueW1vcmUgdG8gcGxheVxuICAgICAgICBjdXJyZW50R2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IGdhbWUgKGlmIGFueSlcbiAgICAgICAgKCFvbkV4aXRIYW5kbGVyfHxvbkV4aXRIYW5kbGVyKCkpO1xuICAgIH1cbn1cblxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggdGhlIChuZXcpIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyIHdoZW5ldmVyIHRoZSBwbGF5ZXIgd2FudHMgdG8gcGxheVxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggbnVsbCAob3IgZW1wdHkpIHBsYXllciBuYW1lXG4vLyB0byBtYWtlIGl0IGNhbGxhYmxlIGZyb20gYW55d2hlcmUgd2UgYXR0YWNoIHNldFBsYXllck5hbWUgdG8gd2luZG93IChiZWNhdXNlIGNsaWVudC5qcyB3aWxsIGJlIGJyb3dzZXJpZmllZCEhISlcbmZ1bmN0aW9uIHNldFBsYXllck5hbWUocGxheWVyTmFtZSxkb25lUGxheWluZ0NhbGxCYWNrKXtcbiAgICAocHJlcGFyZWRGb3JQbGF5aW5nfHxwcmVwYXJlRm9yUGxheWluZygpKTsgLy8gcHJlcGFyZSBmb3IgcGxheWluZyBvbmNlXG4gICAgb25FeGl0SGFuZGxlcj0odHlwZW9mIGRvbmVQbGF5aW5nQ2FsbGJhY2s9PT0nZnVuY3Rpb24nP2RvbmVQbGF5aW5nQ2FsbGJhY2s6bnVsbCk7IC8vIHJlZ2lzdGVyIHRoZSBkb25lIHBsYXlpbmcgY2FsbGJhY2tcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiZ0eXBlb2YgcGxheWVyTmFtZSE9PVwic3RyaW5nXCIpcmV0dXJuKCFvbkV4aXRIYW5kbGVyfHxvbkV4aXRIYW5kbGVyKG5ldyBFcnJvcihcIkludmFsaWQgcGxheWVyIG5hbWUuXCIpKSk7XG4gICAgLy8gaWYgcGxheWVyTmFtZSBtYXRjaGVzIHRoZSBjdXJyZW50IHBsYXllcidzIG5hbWUsIG5vdGhpbmcgdG8gZG9cbiAgICBpZihwbGF5ZXJOYW1lJiZjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLm5hbWU9PT1wbGF5ZXJOYW1lKVxuICAgICAgICAoIW9uRXhpdEhhbmRsZXJ8fG9uRXhpdEhhbmRsZXIobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCk7XG59XG5cbndpbmRvdy5vbmxvYWQ9cHJlcGFyZUZvclBsYXlpbmc7XG5cbi8vIGV4cG9ydCB0aGUgdHdvIGZ1bmN0aW9uIHRoYXQgd2UgYWxsb3cgdG8gYmUgY2FsbGVkIGZyb20gdGhlIG91dHNpZGUhISFcbm1vZHVsZS5leHBvcnRzPXNldFBsYXllck5hbWU7Il19
