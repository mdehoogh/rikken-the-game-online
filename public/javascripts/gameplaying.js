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
function stopButtonClicked(){
    if(!currentPlayer)return alert("Helaas kennen we je niet, dus je zult niet kunnen spelen!");
    updateGameOverButtons(false); // disable the game over buttons
    _setPlayer(null); // killing the player should do the rest!!!!!
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
// MDH@10JAN2020: newGame() is a bid different than in the demo version in that we return to the waiting-page
function newGameButtonClicked(){
    // means: do not forget about me playing i.e. keep me on the gameplaying page
    // MDH@05FEB2020: it's prudent to start completely over with a new player with the same name!!!!
    if(!currentPlayer)return alert("Helaas kennen we je niet, dus je zult niet kunnen spelen!");
    updateGameOverButtons(false); // disable the game over buttons
    setPlayerName(currentPlayer.name);
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
        if(textToSend.trim().length===0&&!prompt("Er is geen te versturen tekst. Wilt U toch versturen?"))return;
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
            if(bidTableColumnIndex>=firstColumn)
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

    for(let stopButton of document.getElementsByClassName('stop'))stopButton.onclick=stopButtonClicked;
    
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
        let clientsocket=currentPlayer._client;
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
                if(currentPlayer)clientsocket.emit('PLAYER',currentPlayer.name,()=>{setInfo("Je bent als speler aangemeld!","Server");});
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTIuMTMuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9DYXJkLmpzIiwicHVibGljL2phdmFzY3JpcHRzL0NhcmRIb2xkZXIuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvTGFuZ3VhZ2UuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvUGxheWVyLmpzIiwicHVibGljL2phdmFzY3JpcHRzL1RyaWNrLmpzIiwicHVibGljL2phdmFzY3JpcHRzL2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBkZWZpbml0aW9uIG9mIGEgcGxheWluZyBDYXJkXG4gKi9cbmNsYXNzIENhcmR7XG5cbiAgICBzdGF0aWMgZ2V0IFNVSVRFX05BTUVTKCl7cmV0dXJuIFtcImRpYW1vbmRcIixcImNsdWJcIixcImhlYXJ0XCIsXCJzcGFkZVwiXTt9XG4gICAgc3RhdGljIGdldCBSQU5LX05BTUVTKCl7cmV0dXJuIFtcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIjEwXCIsXCJqYWNrXCIsXCJxdWVlblwiLFwia2luZ1wiLFwiYWNlXCJdO31cbiAgICAvLyBzaG9ydGhhbmQgJ2NoYXJhY3RlcnMnIGZvciB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uXG4gICAgLy8gTk9UIFdPUktJTkc6IGNvbnN0IENBUkRfU1VJVEVfQ0hBUkFDVEVSUz1bU3RyaW5nLmZyb21DaGFyQ29kZSgyNjY2KSxTdHJpbmcuZnJvbUNoYXJDb2RlKDI2NjMpLFN0cmluZy5mcm9tQ2hhckNvZGUoMjY2NSksU3RyaW5nLmZyb21DaGFyQ29kZSgyNjYwKV07XG4gICAgc3RhdGljIGdldCBTVUlURV9DSEFSQUNURVJTKCl7cmV0dXJuIFsnXFx1MjY2NicsJ1xcdTI2NjMnLCdcXHUyNjY1JywnXFx1MjY2MCddfTsgLy8gWUVTLCBXT1JLSU5HISEhISFcbiAgICBzdGF0aWMgZ2V0IFNVSVRFX0RJQU1PTkQoKXtyZXR1cm4gMDt9O1xuICAgIHN0YXRpYyBnZXQgU1VJVEVfQ0xVQigpe3JldHVybiAxO307XG4gICAgc3RhdGljIGdldCBTVUlURV9IRUFSVCgpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBTVUlURV9TUEFERSgpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBSQU5LX0NIQVJBQ1RFUlMoKXtyZXR1cm4gWycyJywnMycsJzQnLCc1JywnNicsJzcnLCc4JywnOScsJzEwJywnQicsJ1YnLCdLJywnQSddO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RXTygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBSQU5LX1RIUkVFKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfRk9VUigpe3JldHVybiAyO307XG4gICAgc3RhdGljIGdldCBSQU5LX0ZJVkUoKXtyZXR1cm4gMzt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TSVgoKXtyZXR1cm4gNDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19TRVZFTigpe3JldHVybiA1O307XG4gICAgc3RhdGljIGdldCBSQU5LX0VJR0hUKCl7cmV0dXJuIDY7fTtcbiAgICBzdGF0aWMgZ2V0IFJBTktfTklORSgpe3JldHVybiA3O307XG4gICAgc3RhdGljIGdldCBSQU5LX1RFTigpe3JldHVybiA4O307XG4gICAgc3RhdGljIGdldCBSQU5LX0pBQ0soKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19RVUVFTigpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgUkFOS19LSU5HKCl7cmV0dXJuIDExO307XG4gICAgc3RhdGljIGdldCBSQU5LX0FDRSgpe3JldHVybiAxMjt9O1xuXG4gICAgc3RhdGljIGNvbXBhcmVDYXJkcyhjYXJkMSxjYXJkMil7XG4gICAgICAgIGxldCBkZWx0YVN1aXRlPWNhcmQxLl9jYXJkU3VpdGVJbmRleC1jYXJkMi5fY2FyZFN1aXRlSW5kZXg7XG4gICAgICAgIGlmKGRlbHRhU3VpdGUhPTApcmV0dXJuIGRlbHRhU3VpdGU7XG4gICAgICAgIHJldHVybiBjYXJkMS5fY2FyZE5hbWVJbmRleC1jYXJkMi5fY2FyZE5hbWVJbmRleDtcbiAgICB9XG4gICAgXG4gICAgLy8gaW4gYSB0cmljayB0aGUgcGxheSBzdWl0ZSBkZXRlcm1pbmVzIHdoYXQgY2FyZHMgYXJlIHRvIGJlIHBsYXllZCwgdGhlIHRydW1wIHN1aXRlIGRldGVybWluZXMgd2hhdCB0cnVtcCBpc1xuICAgIHN0YXRpYyBjb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZDEsY2FyZDIscGxheVN1aXRlLHRydW1wU3VpdGUpe1xuICAgICAgICAvLyBub3JtYWxseSB3aXRoIGFueSB0d28gcmVndWxhciBjYXJkcyB0aGV5IGFyZSBuZXZlciBlcXVhbCBpbiBhIHRyaWNrXG4gICAgICAgIC8vIGNhcmRzIHRoYXQgYXJlIG5laXRoZXIgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZSBpcyBpcnJlbGV2YW50XG4gICAgICAgIGxldCByZXN1bHQ9MDtcbiAgICAgICAgbGV0IHR5cGU9Jy0nO1xuICAgICAgICAvLyAxLiBpZiBjYXJkMSBpcyB0cnVtcCwgYW5kIGNhcmQyIGlzIG5vdCBvciBoYXMgYSBsb3dlciByYW5rIGNhcmQxIHdpbnNcbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXRydW1wU3VpdGUpe3Jlc3VsdD0oY2FyZDIuc3VpdGUhPXRydW1wU3VpdGU/MTpjYXJkMS5yYW5rLWNhcmQyLnJhbmspO3R5cGU9J0EnO31lbHNlXG4gICAgICAgIC8vIEFTU0VSVCBjYXJkMSBpcyBOT1QgdHJ1bXAgYnV0IGNhcmQyIGNvdWxkIHN0aWxsIGJlIHRydW1wXG4gICAgICAgIGlmKGNhcmQyLnN1aXRlPT10cnVtcFN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nQic7fWVsc2VcbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyB0cnVtcCwgc28gY291bGQgYmUgcGxheSBzdWl0ZSBvciBub3QuLi5cbiAgICAgICAgaWYoY2FyZDEuc3VpdGU9PXBsYXlTdWl0ZSl7cmVzdWx0PShjYXJkMi5zdWl0ZSE9cGxheVN1aXRlPzE6Y2FyZDEucmFuay1jYXJkMi5yYW5rKTt0eXBlPSdDJzt9ZWxzZVxuICAgICAgICAvLyBBU1NFUlQgY2FyZDEgaXMgbm90IHBsYXkgc3VpdGUsIGJ1dCBjYXJkMiBjb3VsZCBiZVxuICAgICAgICBpZihjYXJkMi5zdWl0ZT09cGxheVN1aXRlKXtyZXN1bHQ9LTE7dHlwZT0nRCc7fVxuICAgICAgICBjb25zb2xlLmxvZygnPj4+IFR5cGU6ICcrdHlwZSsnOiAnK2NhcmQxLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiKHN1aXRlOiBcIitjYXJkMS5zdWl0ZStcIilcIisocmVzdWx0PjA/JyA+ICc6KHJlc3VsdDwwPycgPCAnOicgPSAnKSkrY2FyZDIuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKHN1aXRlOiBcIitjYXJkMi5zdWl0ZStcIilcIitcIiAocGxheTogXCIrKHBsYXlTdWl0ZT49MD9DYXJkLlNVSVRFX05BTUVTW3BsYXlTdWl0ZV06XCI/XCIpK1wiLCB0cnVtcDpcIisoKHRydW1wU3VpdGU+PTA/Q2FyZC5TVUlURV9OQU1FU1t0cnVtcFN1aXRlXTpcIj9cIikpK1wiKVwiKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAvLyBsZXQncyBmaXJzdCByZWNvbXB1dGUgdGhlIHN1aXRlIG9mIGJvdGggY2FyZHMgYW5kIGVsZXZhdGUgdHJ1bXAgY2FyZHMsIGFuZCBkZWV2YWx1YXRlIG5vbiBwbGF5U3VpdGUgY2FyZHNcbiAgICAgICAgbGV0IGNhcmQxU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQxLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDEuc3VpdGUpKTtcbiAgICAgICAgbGV0IGNhcmQyU3VpdGU9KGNhcmQxLnN1aXRlPT10cnVtcFN1aXRlPzQ6KGNhcmQyLnN1aXRlIT1wbGF5U3VpdGU/LTE6Y2FyZDIuc3VpdGUpKTtcbiAgICAgICAgaWYoY2FyZDFTdWl0ZT49MHx8Y2FyZDJTdWl0ZT49MCl7IC8vIGF0IGxlYXN0IG9uZSBvZiB0aGUgY2FyZHMgaXMgcGxheSBzdWl0ZSBvciB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgLy8gaWYgdGhlIHN1aXRlcyBhcmUgdGhlIHNhbWUgdGhlIGhpZ2hlc3QgcmFuayB3aW5zXG4gICAgICAgICAgICBpZihjYXJkMVN1aXRlPDApcmV0dXJuIC0xOyAvLyBpZiB0aGUgZmlyc3QgY2FyZCBpcyBpcnJlbGV2YW50LCB0aGUgZmlyc3QgY2FyZCBpcyBsb3dlclxuICAgICAgICAgICAgaWYoY2FyZDJTdWl0ZTwwKXJldHVybiAxOyAvLyBpZiB0aGUgc2Vjb25kIGNhcmQgaXMgaXJyZWxldmFudCwgdGhlIGZpcnN0IGNhcmQgaXMgaGlnaGVyXG4gICAgICAgICAgICAvLyBBU1NFUlQgYm90aCBjYXJkcyBhcmUgZWl0aGVyIHBsYXkgc3VpdGUgb3IgdHJ1bXAgc3VpdGVcbiAgICAgICAgICAgIGlmKGNhcmQxU3VpdGU9PWNhcmQyU3VpdGUpcmV0dXJuIGNhcmQxLnJhbmstY2FyZDIucmFuaztcbiAgICAgICAgICAgIC8vIEFTU0VSVCBvbmUgY2FyZCBpcyBwbGF5IHN1aXRlLCB0aGUgb3RoZXIgbXVzdCBiZSB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgcmV0dXJuKGNhcmQxU3VpdGU9PTQ/MTotMSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgLy8gQVNTRVJUIG5laXRoZXIgY2FyZCBpcyBwbGF5IHN1aXRlIG9yIHRydW1wIHN1aXRlLCBib3RoIGNhcmRzIGFyZSBpcnJlbGV2YW50IChzaG91bGQgaGFwcGVuIHRob3VnaClcbiAgICAgICAgcmV0dXJuIDA7IC8vIGNvbnNpZGVyZWQgZXF1YWwgdGhhdCBpcyBpcnJlbGV2YW50XG4gICAgfVxuICAgIFxuICAgIC8vIC8vIHlvdSdkIGhhdmUgdG8gdXNlIHRoZSBBcHBsZSBTeW1ib2xzIGZvbnRcbiAgICAvLyA8c3BhbiBjbGFzcz1cInBpcFwiPuKZpTwvc3Bhbj5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgrE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CvjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4K9PC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgrs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CujwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4K5PC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgrg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CtzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4K2PC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgrU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CtDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KzPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgrI8L2xpPlxuICAgIC8vIDxzcGFuIGNsYXNzPVwicGlwXCI+4pmjPC9zcGFuPlxuICAgIC8vIDxsaSBjbGFzcz1cImFjZSBjYXJkXCIgICA+8J+DkTwvbGk+PGxpIGNsYXNzPVwia2luZyBjYXJkXCIgID7wn4OePC9saT48bGkgY2xhc3M9XCJxdWVlbiBjYXJkXCIgPvCfg508L2xpPjxsaSBjbGFzcz1cImphY2sgY2FyZFwiICA+8J+DmzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidGVuIGNhcmRcIiAgID7wn4OaPC9saT48bGkgY2xhc3M9XCJuaW5lIGNhcmRcIiAgPvCfg5k8L2xpPjxsaSBjbGFzcz1cImVpZ2h0IGNhcmRcIiA+8J+DmDwvbGk+PGxpIGNsYXNzPVwic2V2ZW4gY2FyZFwiID7wn4OXPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJzaXggY2FyZFwiICAgPvCfg5Y8L2xpPjxsaSBjbGFzcz1cImZpdmUgY2FyZFwiICA+8J+DlTwvbGk+PGxpIGNsYXNzPVwiZm91ciBjYXJkXCIgID7wn4OUPC9saT48bGkgY2xhc3M9XCJ0aHJlZSBjYXJkXCIgPvCfg5M8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInR3byBjYXJkXCIgICA+8J+DkjwvbGk+XG4gICAgLy8gPHNwYW4gY2xhc3M9XCJwaXBcIj7imaY8L3NwYW4+XG4gICAgLy8gPGxpIGNsYXNzPVwiYWNlIGNhcmRcIiAgID7wn4OBPC9saT48bGkgY2xhc3M9XCJraW5nIGNhcmRcIiAgPvCfg448L2xpPjxsaSBjbGFzcz1cInF1ZWVuIGNhcmRcIiA+8J+DjTwvbGk+PGxpIGNsYXNzPVwiamFjayBjYXJkXCIgID7wn4OLPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0ZW4gY2FyZFwiICAgPvCfg4o8L2xpPjxsaSBjbGFzcz1cIm5pbmUgY2FyZFwiICA+8J+DiTwvbGk+PGxpIGNsYXNzPVwiZWlnaHQgY2FyZFwiID7wn4OIPC9saT48bGkgY2xhc3M9XCJzZXZlbiBjYXJkXCIgPvCfg4c8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInNpeCBjYXJkXCIgICA+8J+DhjwvbGk+PGxpIGNsYXNzPVwiZml2ZSBjYXJkXCIgID7wn4OFPC9saT48bGkgY2xhc3M9XCJmb3VyIGNhcmRcIiAgPvCfg4Q8L2xpPjxsaSBjbGFzcz1cInRocmVlIGNhcmRcIiA+8J+DgzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwidHdvIGNhcmRcIiAgID7wn4OCPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJhY2UgY2FyZFwiICAgPvCfgqE8L2xpPjxsaSBjbGFzcz1cImtpbmcgY2FyZFwiICA+8J+CrjwvbGk+PGxpIGNsYXNzPVwicXVlZW4gY2FyZFwiID7wn4KtPC9saT48bGkgY2xhc3M9XCJqYWNrIGNhcmRcIiAgPvCfgqs8L2xpPlxuICAgIC8vIDxsaSBjbGFzcz1cInRlbiBjYXJkXCIgICA+8J+CqjwvbGk+PGxpIGNsYXNzPVwibmluZSBjYXJkXCIgID7wn4KpPC9saT48bGkgY2xhc3M9XCJlaWdodCBjYXJkXCIgPvCfgqg8L2xpPjxsaSBjbGFzcz1cInNldmVuIGNhcmRcIiA+8J+CpzwvbGk+XG4gICAgLy8gPGxpIGNsYXNzPVwic2l4IGNhcmRcIiAgID7wn4KmPC9saT48bGkgY2xhc3M9XCJmaXZlIGNhcmRcIiAgPvCfgqU8L2xpPjxsaSBjbGFzcz1cImZvdXIgY2FyZFwiICA+8J+CpDwvbGk+PGxpIGNsYXNzPVwidGhyZWUgY2FyZFwiID7wn4KjPC9saT5cbiAgICAvLyA8bGkgY2xhc3M9XCJ0d28gY2FyZFwiICAgPvCfgqI8L2xpPlxuICAgIHN0YXRpYyBnZXQgQ0FSRF9BUFBMRV9TWU1CT0xTKCl7cmV0dXJuIFtcbiAgICAgICAgWyfwn4OCJywn8J+DgycsJ/Cfg4QnLCfwn4OFJywn8J+DhicsJ/Cfg4cnLCfwn4OIJywn8J+DiScsJ/Cfg4onLCfwn4OLJywn8J+DjScsJ/Cfg44nLCfwn4OBJ10sXG4gICAgICAgIFsn8J+DkicsJ/Cfg5MnLCfwn4OUJywn8J+DlScsJ/Cfg5YnLCfwn4OXJywn8J+DmCcsJ/Cfg5knLCfwn4OaJywn8J+DmycsJ/Cfg50nLCfwn4OeJywn8J+DkSddLFxuICAgICAgICBbJ/CfgrInLCfwn4KzJywn8J+CtCcsJ/CfgrUnLCfwn4K2Jywn8J+CtycsJ/CfgrgnLCfwn4K5Jywn8J+CuicsJ/CfgrsnLCfwn4K9Jywn8J+CvicsJ/CfgrEnXSxcbiAgICAgICAgWyfwn4KiJywn8J+CoycsJ/CfgqQnLCfwn4KlJywn8J+CpicsJ/CfgqcnLCfwn4KoJywn8J+CqScsJ/CfgqonLCfwn4KrJywn8J+CrScsJ/Cfgq4nLCfwn4KhJ11cbiAgICBdfTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpe1xuICAgICAgICB0aGlzLl9jYXJkU3VpdGVJbmRleD1jYXJkU3VpdGVJbmRleDtcbiAgICAgICAgdGhpcy5fY2FyZE5hbWVJbmRleD1jYXJkTmFtZUluZGV4O1xuICAgIH1cbiAgICB0b1N0cmluZygpe1xuICAgICAgICByZXR1cm4gQ2FyZC5SQU5LX05BTUVTW3RoaXMuX2NhcmROYW1lSW5kZXhdK1wiIG9mIFwiK0NhcmQuU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wic1wiO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuaygpe3JldHVybiB0aGlzLl9jYXJkTmFtZUluZGV4O31cbiAgICBnZXQgc3VpdGUoKXtyZXR1cm4gdGhpcy5fY2FyZFN1aXRlSW5kZXg7fVxuXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCl7XG4gICAgICAgIC8vIGlmIHdlJ3JlIHVzaW5nIHRoZSBzdmctY2FyZHMuc3ZnIHdlIGNhbiBkbyB0aGUgZm9sbG93aW5nLCBidXQgaW4gdGhhdCBjYXNlIHdlJ2QgbmVlZCB0byBrbm93IHRoZSBtYWduaWZpY2F0aW9uIGZhY3RvciEhIVxuICAgICAgICAvL3JldHVybiBDQVJEX0ZPTlRfQ0hBUkFDVEVSU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vcmV0dXJuICc8c3ZnIHZpZXdCb3g9XCIwIDAgNjc2IDk3NlwiPjx1c2UgeGxpbms6aHJlZj1cImltZy9zdmctY2FyZHMuc3ZnIycrU1VJVEVfTkFNRVNbdGhpcy5fY2FyZFN1aXRlSW5kZXhdK1wiLVwiK1JBTktfTkFNRVNbdGhpcy5fY2FyZE5hbWVJbmRleF0rJzwvdXNlPjwvc3ZnPic7XG4gICAgICAgIHJldHVybiBDYXJkLkNBUkRfQVBQTEVfU1lNQk9MU1t0aGlzLl9jYXJkU3VpdGVJbmRleF1bdGhpcy5fY2FyZE5hbWVJbmRleF07XG4gICAgICAgIC8vLy8vL3JldHVybiBTVUlURV9DSEFSQUNURVJTW3RoaXMuX2NhcmRTdWl0ZUluZGV4XS5jb25jYXQoUkFOS19DSEFSQUNURVJTW3RoaXMuX2NhcmROYW1lSW5kZXhdKTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9Q2FyZDsiLCIvKipcbiAqIGRlZmluZXMgc29tZW9uZSB0aGF0IGhvbGRzIGNhcmRzXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5cbmNsYXNzIENhcmRIb2xkZXJ7XG5cbiAgICBsb2codG9sb2cpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0b2xvZyk7XG4gICAgfVxuICAgIFxuICAgIC8vIE1ESEAwNERFQzIwMTk6IGFsbG93aW5nIG5vdyB0byBjb25zdHJ1Y3QgZml4ZWQgc2l6ZSBjYXJkIGhvbGRlcnMgKGxpa2UgVHJpY2spXG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZDYXJkcz0wKXtcbiAgICAgICAgdGhpcy5fY2FyZHM9W107XG4gICAgICAgIHRoaXMuX251bWJlck9mQ2FyZHM9bnVtYmVyT2ZDYXJkcztcbiAgICAgICAgd2hpbGUoLS1udW1iZXJPZkNhcmRzPj0wKXRoaXMuX2NhcmRzLnB1c2gobnVsbCk7XG4gICAgICAgIHRoaXMuX3NvcnRlZD1mYWxzZTtcbiAgICB9XG5cbiAgICAvLyBtZXRob2RzIHRvIGFkanVzdCB0aGUgY2FyZCBjb2xsZWN0aW9uXG4gICAgX3JlbW92ZUNhcmQoY2FyZCl7XG4gICAgICAgIGxldCBjYXJkSW5kZXg9dGhpcy5fY2FyZHMuaW5kZXhPZihjYXJkKTtcbiAgICAgICAgaWYoY2FyZEluZGV4Pj0wKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhcmRzLnNwbGljZShjYXJkSW5kZXgsMSkubGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrY2FyZCtcIiByZW1vdmVkIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIi5cIik7XG4gICAgICAgICAgICAgICAgY2FyZC5faG9sZGVyPW51bGw7IC8vIHdoZW4gc3VjY2Vzc2Z1bCBhcHBhcmVudGx5IG5vIGxvbmdlciBhdmFpbGFibGUhISFcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGF0IGluZGV4IFwiK2NhcmRJbmRleCtcIiBvZiBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byByZW1vdmUgY2FyZCBcIitjYXJkK1wiIGZyb20gXCIrdGhpcy50b1N0cmluZygpK1wiOiBpdCBpcyBub3QgcHJlc2VudC5cIik7XG4gICAgfVxuICAgIF9hZGRDYXJkKGNhcmQpe1xuICAgICAgICBpZighY2FyZClyZXR1cm47XG4gICAgICAgIGlmKCEoY2FyZCBpbnN0YW5jZW9mIEhvbGRhYmxlQ2FyZCkpdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgaG9sZGFibGUgY2FyZCFcIik7XG4gICAgICAgIHRoaXMubG9nKFwiQWRkaW5nIGNhcmQgXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgdGhpcy5fY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPm51bWJlck9mQ2FyZHNOb3cpe1xuICAgICAgICAgICAgdGhpcy5fc29ydGVkPWZhbHNlOyAvLyBjYW4gbm8gbG9uZ2VyIGd1YXJhbnRlZSB0aGF0IGl0IGlzIHNvcnRlZC4uLlxuICAgICAgICAgICAgY2FyZC5faG9sZGVyPXRoaXM7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIkNhcmQgXCIrdGhpcy5udW1iZXJPZkNhcmRzK1wiIChcIitjYXJkLnRvU3RyaW5nKCkrXCIpIGFkZGVkIHRvIFwiK3RoaXMudG9TdHJpbmcoKStcIi5cIik7XG4gICAgICAgICAgICAvLyBob3cgYWJvdXQgb3JkZXJpbmcgdGhlIGNhcmRzPz8/Pz8/IG9yIHN0b3JpbmcgdGhlbSBieSBzdWl0ZT8/Pz9cbiAgICAgICAgICAgIHRoaXMubG9nKFwiXFx0Q2FyZCBjb2xsZWN0aW9uOiBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbigpK1wiLlwiKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gYWRkIGNhcmQgXCIrY2FyZCtcIiB0byBcIit0aGlzLnRvU3RyaW5nKCkrXCIgKGRlbHRhIG51bWJlciBvZiBjYXJkczogXCIrKHRoaXMubnVtYmVyT2ZDYXJkcy1udW1iZXJPZkNhcmRzTm93KStcIikuXCIpO1xuICAgIH1cbiAgICAvKlxuICAgIC8vIHJlcGxhY2UgYSBjYXJkIGF0IGEgZ2l2ZW4gaW5kZXggKGFzIHVzZWQgaW4gVHJpY2spXG4gICAgX3NldENhcmRBdEluZGV4KGNhcmQsaW5kZXgpe1xuICAgICAgICBpZihpbmRleDwwfHxpbmRleD49dGhpcy5udW1iZXJPZkNhcmRzKXRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlcGxhY2UgY2FyZCAjXCIrU3RyaW5nKGluZGV4KzEpK1wiLlwiKTtcbiAgICAgICAgbGV0IGNhcmRBdEluZGV4PXRoaXMuX2NhcmRzW2luZGV4XTtcbiAgICAgICAgaWYoY2FyZEF0SW5kZXgpe2NhcmRBdEluZGV4Ll9ob2xkZXI9bnVsbDt0aGlzLl9jYXJkc1tpbmRleF09bnVsbDt9XG4gICAgICAgIGlmKGNhcmQpe1xuICAgICAgICAgICAgLy8gaWYgJ2NvbnRhaW5lZCcgaW4gYW5vdGhlciBjYXJkIGhvbGRlciByZW1vdmUgaXQgZnJvbSB0aGVyZSEhIVxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIGlmKGNhcmQuX2hvbGRlciljYXJkLl9ob2xkZXIucmVtb3ZlQ2FyZChjYXJkKTtcbiAgICAgICAgICAgICAgICBpZighY2FyZC5faG9sZGVyKXt0aGlzLl9jYXJkc1tpbmRleF09Y2FyZDtjYXJkLl9ob2xkZXI9dGhpczt9ICAgIFxuICAgICAgICAgICAgfWNhdGNoKGVycm9yKXt9XG4gICAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgICAvLyBwb2xsIHRoZSBjYXJkIGNvbGxlY3Rpb25cbiAgICBnZXQgbnVtYmVyT2ZDYXJkcygpe3JldHVybiB0aGlzLl9jYXJkcy5sZW5ndGg7fVxuXG4gICAgZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLmZpbHRlcigoY2FyZCk9PntyZXR1cm4gY2FyZC5yYW5rPT1yYW5rO30pO1xuICAgIH1cbiAgICBnZXROdW1iZXJPZkNhcmRzV2l0aFJhbmsocmFuayl7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENhcmRzV2l0aFJhbmsocmFuaykubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldE51bWJlck9mQ2FyZHNXaXRoU3VpdGUoc3VpdGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FyZHMuZmlsdGVyKChjYXJkKT0+e3JldHVybiBjYXJkLnN1aXRlPT1zdWl0ZTt9KS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudFxuICAgICAqL1xuICAgIGdldFN1aXRlcygpe1xuICAgICAgICAvLyBjYW4ndCB1c2UgdGhpcyBpbiBmaWx0ZXIhISEgcmV0dXJuIFswLDEsMiwzXS5maWx0ZXIoKHJhbmspPT57cmV0dXJuIHRoaXMuZ2V0Q2FyZHNXaXRoUmFuayhyYW5rKT4wO30pO1xuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e2lmKHN1aXRlcy5pbmRleE9mKGNhcmQuc3VpdGUpPDApc3VpdGVzLnB1c2goY2FyZC5zdWl0ZSk7fSk7XG4gICAgICAgIHJldHVybiBzdWl0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIG51bWJlciBvZiBjYXJkcyBpbiB0aGUgaG9sZGVyIHdpdGggdGhlIGdpdmVuIHJhbmtcbiAgICAgKiBAcGFyYW0geyp9IHJhbmsgXG4gICAgKi9cbiAgICBnZXRTdWl0ZXNXaXRoUmFuayhyYW5rKXtcbiAgICAgICAgbGV0IHN1aXRlcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaCgoY2FyZCk9PntpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO30pO1xuICAgICAgICByZXR1cm4gc3VpdGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZXR1cm5pbmcgYW4gYXJyYXkgd2l0aCBhbGwgc3VpdGVzLCB3aXRoIC0xIHdoZXJlIGEgc3VpdGUgaXMgbm90IHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgY2FyZHMgXG4gICAgICogQHBhcmFtIHsqfSByYW5rIFxuICAgICAqL1xuICAgIGdldFN1aXRlc1dpdGhvdXRSYW5rKHJhbmspe1xuICAgICAgICAvLyBhaCB0aGlzIGlzIGFuIGlzc3VlLCBiZWNhdXNlIGlmIHlvdSBkbyBub3QgaGF2ZSBhIGNlcnRhaW4gc3VpdGUgdGhlIHN1aXRlIHNob3VsZCBOT1QgYmUgcmV0dXJuZWQhISEhIVxuICAgICAgICAvLyBNREhAMDNGRUIyMDIwOiBCVVQgd2Ugd2FudCB0byBrbm93IGFsbCB0aGUgc3VpdGVzIG9mIHdoaWNoIHRoZSBwbGF5ZXIgZG9lcyBub3QgaGF2ZSB0aGUgZ2l2ZW4gcmFua1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaW5jbHVkaW5nIG9mIHRob3NlIHN1aXRlcyBhIHBsYXllciBkb2VzIE5PVCBoYXZlXG4gICAgICAgIC8qIE1ESEAwM0ZFQjIwMjAgcmVwbGFjaW5nOlxuICAgICAgICBsZXQgc3VpdGVzPVtdO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e1xuICAgICAgICAgICAgaWYoc3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MClzdWl0ZXMucHVzaChjYXJkLnN1aXRlKTsgLy8gaWYgc3VpdGUgbm90IHByZXNlbnQgeWV0LCBhZGQgaXQgdG8gc3VpdGVzXG4gICAgICAgICAgICBpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlc1tjYXJkLnN1aXRlXT0tMTsgLy8gbm90IHJlbW92aW5nIGl0IGJ1dCBzZXR0aW5nIHRvIC0xIGlmIHdlIGxvY2F0ZSB0aGUgcmFua1xuICAgICAgICB9KTtcbiAgICAgICAgKi9cbiAgICAgICBsZXQgc3VpdGVzPVstMSwtMSwtMSwtMV07IC8vIE1ESEAwNUZFQjIwMjA6IHdpbGwgcmV0dXJuIC0xOiBwbGF5ZXIgZG9lc24ndCBoYXZlIGNhcmQsIDA9cGxheWVyIGhhcyByYW5rLCAxIGRvZXMgTk9UIGhhdmUgcmFua1xuICAgICAgIHRoaXMuX2NhcmRzLmZvckVhY2goKGNhcmQpPT57XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgY2FuIG9ubHkgaGFwcGVuIG9uY2UgKGZvciBlYWNoIHN1aXRlKSwgd2UgY2FuIHNhZmVseSBhc3N1bWUgdGhhdCB0aGUgc3VpdGUgaXMgdGhlcmUhISEhXG4gICAgICAgICAgICBpZihzdWl0ZXNbY2FyZC5zdWl0ZV08MClzdWl0ZXNbY2FyZC5zdWl0ZV09MTsgLy8gdGhlIHN1aXRlIGlzIHRoZXJlXG4gICAgICAgICAgICBpZihjYXJkLnJhbms9PT1yYW5rKXN1aXRlc1tjYXJkLnN1aXRlXT0wOyAvLyB3ZSBmb3VuZCB0aGUgY2FyZCBpbiBjYXJkLnN1aXRlIHdpdGggdGhlIHJhbmsgcGFzc2VkIGluISEhXG4gICAgICAgfSk7XG4gICAgICAgcmV0dXJuIHN1aXRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgaWRzIG9mIHRoZSBzdWl0ZXMgcHJlc2VudCBvZiB3aGljaCB0aGUgcGxheWVyIGRvZXMgbm90IGhhdmUgdGhlIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgZ2V0UmFua2xlc3NTdWl0ZXMocmFuayl7XG4gICAgICAgIGxldCByYW5rbGVzc1N1aXRlcz1bXTtcbiAgICAgICAgbGV0IHN1aXRlc1dpdGhSYW5rcz1bXTtcbiAgICAgICAgdGhpcy5fY2FyZHMuZm9yRWFjaChcbiAgICAgICAgICAgIChjYXJkKT0+e1xuICAgICAgICAgICAgICAgIGlmKHJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCYmc3VpdGVzV2l0aFJhbmtzLmluZGV4T2YoY2FyZC5zdWl0ZSk8MCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuY2FyZE5hbWVJbmRleD09cmFuayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWl0ZXNXaXRoUmFua3MucHVzaChjYXJkLnN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgc3VpdGUgaWYgYWxyZWFkeSBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFua2xlc3NTdWl0ZUluZGV4PXJhbmtsZXNzU3VpdGVzLmluZGV4T2YoY2FyZC5zdWl0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyYW5rbGVzc1N1aXRlSW5kZXg+PTApcmFua2xlc3NTdWl0ZXMuc3BsaWNlKHJhbmtsZXNzU3VpdGVJbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgLy8gdW50aWwgcHJvdmVuIGRpZmZlcmVudGx5XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5rbGVzc1N1aXRlcy5wdXNoKGNhcmQuc3VpdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJhbmtsZXNzU3VpdGVzO1xuICAgIH1cblxuICAgIGdldEZpcnN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1swXTt9XG5cbiAgICAvLyBNREhAMjBKQU4yMDIwOiB1c2VkIGluIGdhbWVlbmdpbmUuanNcbiAgICBnZXRMYXN0Q2FyZCgpe2lmKHRoaXMuX2NhcmRzLmxlbmd0aD4wKXJldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkcy5sZW5ndGgtMV07fVxuXG4gICAgY29udGFpbnNDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZD10aGlzLl9jYXJkcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKC0tY2FyZD49MCYmKHRoaXMuX2NhcmRzW2NhcmRdLnN1aXRlIT09c3VpdGV8fHRoaXMuX2NhcmRzW2NhcmRdLnJhbmshPT1yYW5rKSk7XG4gICAgICAgIHJldHVybihjYXJkPj0wKTsgLy8gZm91bmQgaWYgY2FyZCBpcyBub3QgbmVnYXRpdmVcbiAgICB9XG5cbiAgICAvLyBNREhAMTNKQU4yMDIwOiB3ZSBuZWVkIHRoaXMgdG8gZmluZCBhIHNwZWNpZmljIGNhcmRcbiAgICBnZXRDYXJkKHN1aXRlLHJhbmspe1xuICAgICAgICBsZXQgY2FyZEluZGV4PXRoaXMuX2NhcmRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoLS1jYXJkSW5kZXg+PTApe2xldCBjYXJkPXRoaXMuX2NhcmRzW2NhcmRJbmRleF07aWYoY2FyZC5zdWl0ZT09PXN1aXRlJiZjYXJkLnJhbms9PT1yYW5rKXJldHVybiBjYXJkO31cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FuIGV4cG9zZSBhIHRleHQgcmVwcmVzZW50aW9uXG4gICAgICovXG4gICAgZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHN1aXRlU2VwYXJhdG9yKXtcbiAgICAgICAgdGhpcy5sb2coXCJOdW1iZXIgb2YgY2FyZHMgdG8gcmVwcmVzZW50OiBcIit0aGlzLl9jYXJkcy5sZW5ndGgrXCIuXCIpO1xuICAgICAgICAvLyBob3cgYWJvdXQgc29ydGluZz8/Pz8/Pz8/IHRoYXQgd291bGQgYmUgbmljZVxuICAgICAgICBpZihzdWl0ZVNlcGFyYXRvciYmdHlwZW9mIHN1aXRlU2VwYXJhdG9yPT09XCJzdHJpbmdcIiYmIXRoaXMuX3NvcnRlZCl7XG4gICAgICAgICAgICB0aGlzLl9jYXJkcy5zb3J0KGNvbXBhcmVDYXJkcyk7XG4gICAgICAgICAgICB0aGlzLl9zb3J0ZWQ9dHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5fc29ydGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhcmRzLm1hcCgoY2FyZCk9PntyZXR1cm4gY2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTt9KS5qb2luKFwiIFwiKTtcbiAgICAgICAgLy8gY2FyZHMgYXJlIHN1cHBvc2VkIHRvIGJlIHNvcnRlZFxuICAgICAgICBsZXQgdGV4dFJlcHJlc2VudGF0aW9uPVwiXCI7XG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIGxldCBjYXJkPXRoaXMuZ2V0Rmlyc3RDYXJkKCk7XG4gICAgICAgICAgICB0ZXh0UmVwcmVzZW50YXRpb249Y2FyZC5nZXRUZXh0UmVwcmVzZW50YXRpb24oKTtcbiAgICAgICAgICAgIGZvcihsZXQgY2FyZEluZGV4PTE7Y2FyZEluZGV4PHRoaXMubnVtYmVyT2ZDYXJkcztjYXJkSW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz0oY2FyZC5zdWl0ZSE9dGhpcy5fY2FyZHNbY2FyZEluZGV4XS5zdWl0ZT9zdWl0ZVNlcGFyYXRvcjpcIiBcIik7XG4gICAgICAgICAgICAgICAgdGV4dFJlcHJlc2VudGF0aW9uKz10aGlzLl9jYXJkc1tjYXJkSW5kZXhdLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhcmQ9dGhpcy5fY2FyZHNbY2FyZEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dFJlcHJlc2VudGF0aW9uOyAvLyBhIHNpbmdsZSBibGFuayBiZXR3ZWVuIHRoZW0hISFcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhIGNhcmQgd2l0aCBhIGNhcmQgaG9sZGVyIGlzIGhlbGRcbiAqL1xuY2xhc3MgSG9sZGFibGVDYXJkIGV4dGVuZHMgQ2FyZHtcblxuICAgIGxvZyh0b2xvZyl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSE9MREFCTEVDQVJEID4+PiBcIit0b2xvZyk7XG4gICAgfVxuXG4gICAgc2V0IGhvbGRlcihob2xkZXIpe1xuICAgICAgICB0aGlzLmxvZyhcIkNoYW5naW5nIHRoZSBob2xkZXIgb2YgY2FyZCBcIit0aGlzLnRvU3RyaW5nKCkrXCIuXCIpO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgY3VycmVudCBob2xkZXIgKGlmIGFueSlcbiAgICAgICAgaWYodGhpcy5faG9sZGVyKXRoaXMuX2hvbGRlci5fcmVtb3ZlQ2FyZCh0aGlzKTtcbiAgICAgICAgLy8gYWRkICh3aGVuIHN1Y2Nlc3NmdWxseSByZW1vdmVkKSB0byB0aGUgbmV3IGhvbGRlciAoaWYgYW55KVxuICAgICAgICBpZighdGhpcy5faG9sZGVyJiZob2xkZXIpaG9sZGVyLl9hZGRDYXJkKHRoaXMpO2Vsc2UgdGhpcy5sb2coXCJFUlJPUjogVW5hYmxlIHRvIGNoYW5nZSB0aGUgaG9sZGVyIVwiKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkU3VpdGVJbmRleCxjYXJkTmFtZUluZGV4LGhvbGRlcil7XG4gICAgICAgIHN1cGVyKGNhcmRTdWl0ZUluZGV4LGNhcmROYW1lSW5kZXgpO1xuICAgICAgICB0aGlzLl9ob2xkZXI9bnVsbDtcbiAgICAgICAgdGhpcy5ob2xkZXI9aG9sZGVyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7cmV0dXJuIFwiSG9sZGFibGUgXCIrc3VwZXIudG9TdHJpbmcoKTt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHM9e0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfTsiLCIvLyBNREhAMzFKQU4yMDIwOiBJJ2xsIGJlIG5lZWRpbmcgdGhpcyBib3RoIGNsaWVudC1zaWRlIGFuZCBzZXJ2ZXItc2lkZVxuLy8gICAgICAgICAgICAgICAgY2xpZW50LXNpZGUgaXQncyBlbWJlZGRlZCBpbiBnYW1lcGxheWluZy5qcyAodGhlIGJyb3dzZXJpZmllZCB2ZXJzaW9uIG9mIGNsaWVudC5qcylcbmNsYXNzIExhbmd1YWdle1xuICAgIHN0YXRpYyBnZXQgREVGQVVMVF9QTEFZRVJTKCl7cmV0dXJuIFtbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiXSxbXCJNYXJjXCIsXCJKdXJnZW5cIixcIk1vbmlrYVwiLFwiQW5uYVwiLFwiXCJdXTt9O1xuICAgIC8vIHBvc3NpYmxlIHJhbmtzIGFuZCBzdWl0ZXMgKGluIER1dGNoKVxuICAgIHN0YXRpYyBnZXQgRFVUQ0hfUkFOS19OQU1FUygpe3JldHVybiBbXCJ0d2VlXCIsXCJkcmllXCIsXCJ2aWVyXCIsXCJ2aWpmXCIsXCJ6ZXNcIixcInpldmVuXCIsXCJhY2h0XCIsXCJuZWdlblwiLFwidGllblwiLFwiYm9lclwiLFwidnJvdXdcIixcImhlZXJcIixcImFhc1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgRFVUQ0hfU1VJVEVfTkFNRVMoKXtyZXR1cm4gW1wicnVpdGVuXCIsXCJrbGF2ZXJlblwiLFwiaGFydGVuXCIsXCJzY2hvcHBlblwiXTt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cz1MYW5ndWFnZTsiLCIvKipcbiAqIGEgcGxhY2Vob2xkZXIgZm9yIGEgcGxheWVyXG4gKi9cbmNvbnN0IENhcmQ9cmVxdWlyZSgnLi9DYXJkLmpzJyk7XG5jb25zdCB7Q2FyZEhvbGRlcixIb2xkYWJsZUNhcmR9PXJlcXVpcmUoJy4vQ2FyZEhvbGRlci5qcycpO1xuXG4vKipcbiAqIGEgUGxheWVyIGNhbiBtYWtlIGEgYmlkLCBvciBwbGF5IGEgY2FyZCwgY2hvb3NlIGEgdHJ1bXAgYW5kIHBhcnRuZXIgc3VpdGVcbiAqL1xuY2xhc3MgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBiaWRNYWRlKGJpZCl7fVxuICAgIGNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7fVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7fVxuICAgIHBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpe31cbn1cblxuLy8gTURIQDA3REVDMjAxOTogUGxheWVyR2FtZSBleHRlbmRzIFBsYXllckV2ZW50TGlzdGVuZXIgd2l0aCBnYW1lIGRhdGEgZXhwb3NlZCB0byBwbGF5ZXJcbi8vICAgICAgICAgICAgICAgIHdoaWNoIHdhcyBlYXJsaWVyIHN0b3JlZCBpbiBlYWNoIHRyaWNrXG5jbGFzcyBQbGF5ZXJHYW1lIGV4dGVuZHMgUGxheWVyRXZlbnRMaXN0ZW5lcntcbiAgICBzdGF0aWMgZ2V0IEJJRF9OQU1FUygpe3JldHVybiBbXCJwYXNcIixcInJpa1wiLFwicmlrIChiZXRlcilcIixcIm5lZ2VuIGFsbGVlblwiLFwibmVnZW4gYWxsZWVuIChiZXRlcilcIixcInBpY29cIixcInRpZW4gYWxsZWVuXCIsXCJ0aWVuIGFsbGVlbiAoYmV0ZXIpXCIsXCJlbGYgYWxsZWVuXCIsXCJlbGYgYWxsZWVuIChiZXRlcilcIixcIm1pc1xceGU4cmVcIixcInR3YWFsZiBhbGxlZW5cIixcInR3YWFsZiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlXCIsXCJkZXJ0aWVuIGFsbGVlblwiLFwiZGVydGllbiBhbGxlZW4gKGJldGVyKVwiLFwib3BlbiBtaXNcXHhlOHJlIG1ldCBlZW4gcHJhYXRqZVwiLFwidHJvZWxhXCIsXCJvbSBkZSBzY2hvcHBlbiB2cm91dyBlbiBkZSBsYWF0c3RlIHNsYWdcIixcIm9tIGRlIGxhYXRzdGUgc2xhZ1wiXTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1BBUygpe3JldHVybiAwO307XG4gICAgc3RhdGljIGdldCBCSURfUklLKCl7cmV0dXJuIDE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9SSUtfQkVURVIoKXtyZXR1cm4gMjt9O1xuICAgIHN0YXRpYyBnZXQgQklEX05FR0VOX0FMTEVFTigpe3JldHVybiAzO307XG4gICAgc3RhdGljIGdldCBCSURfTkVHRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDQ7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9QSUNPKCl7cmV0dXJuIDU7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9USUVOX0FMTEVFTigpe3JldHVybiA2O307XG4gICAgc3RhdGljIGdldCBCSURfVElFTl9BTExFRU5fQkVURVIoKXtyZXR1cm4gNzt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU4oKXtyZXR1cm4gODt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0VMRl9BTExFRU5fQkVURVIoKXtyZXR1cm4gOTt9O1xuICAgIHN0YXRpYyBnZXQgQklEX01JU0VSRSgpe3JldHVybiAxMDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX1RXQUFMRl9BTExFRU4oKXtyZXR1cm4gMTE7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDEyO307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkUoKXtyZXR1cm4gMTM7fTtcbiAgICBzdGF0aWMgZ2V0IEJJRF9ERVJUSUVOX0FMTEVFTigpe3JldHVybiAxNDt9O1xuICAgIHN0YXRpYyBnZXQgQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSKCl7cmV0dXJuIDE1O307XG4gICAgc3RhdGljIGdldCBCSURfT1BFTl9NSVNFUkVfTUVUX0VFTl9QUkFBVEpFKCl7cmV0dXJuIDE2O307XG4gICAgc3RhdGljIGdldCBCSURfVFJPRUxBKCl7cmV0dXJuIDE3O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHX0VOX1NDSE9QUEVOX1ZST1VXKCl7cmV0dXJuIDE4O307XG4gICAgc3RhdGljIGdldCBCSURfTEFBVFNURV9TTEFHKCl7cmV0dXJuIDE5O307XG4gICAgc3RhdGljIGdldCBCSURTX0FMTF9DQU5fUExBWSgpe3JldHVybiBbUGxheWVyR2FtZS5CSURfUElDTyxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRSxQbGF5ZXJHYW1lLkJJRF9PUEVOX01JU0VSRV9NRVRfRUVOX1BSQUFUSkVdO307IC8vIHRydW1wbGVzcyBnYW1lc1xuICAgIHN0YXRpYyBnZXQgQklEU19XSVRIX1BBUlRORVJfSU5fSEVBUlRTKCl7cmV0dXJuIFtQbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIsUGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVIsUGxheWVyR2FtZS5CSURfRUxGX0FMTEVFTl9CRVRFUixQbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSLFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOX0JFVEVSXTt9OyAvLyBnYW1lcyB3aXRoIHRydW1wIHBsYXllZCB3aXRoIGEgcGFydG5lclxuICAgIHN0YXRpYyBnZXQgQklEX1JBTktTKCl7cmV0dXJuIFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywwLC0xLC0xXTt9OyAvLyBob3cgSSBwbGF5ZWQgaXQgKGJpZCBwYXNzIGV4Y2x1ZGVkIChhbHdheXMgcmFuayAwKSlcbiAgICBcbiAgICAvLyBlYWNoIGJpZCBoYXMgYSBjZXJ0YWluIGFtb3VudCBvZiBwb2ludHMgdG8gcmVjZWl2ZSB3aGVuIHdpbm5pbmcgdGhlIGdhbWVcbiAgICBzdGF0aWMgZ2V0IEJJRF9QT0lOVFMoKXtyZXR1cm4gWzAsMSwxLDMsMyw0LDQsNCw1LDUsNSw2LDYsNiw3LDcsMTAsMiwyLDJdO31cblxuICAgIC8vIHRoZSBzdGF0ZSBjb25zdGFudHMgd2UgaGF2ZVxuICAgIHN0YXRpYyBnZXQgT1VUX09GX09SREVSKCl7cmV0dXJuIDA7fVxuICAgIHN0YXRpYyBnZXQgSURMRSgpe3JldHVybiAxO31cbiAgICBzdGF0aWMgZ2V0IERFQUxJTkcoKXtyZXR1cm4gMjt9XG4gICAgc3RhdGljIGdldCBCSURESU5HKCl7cmV0dXJuIDM7fVxuICAgIHN0YXRpYyBnZXQgUExBWUlORygpe3JldHVybiA0O31cbiAgICBzdGF0aWMgZ2V0IENBTkNFTElORygpe3JldHVybiA1O31cbiAgICBzdGF0aWMgZ2V0IEZJTklTSEVEKCl7cmV0dXJuIDY7fVxuICAgIGdldFRydW1wU3VpdGUoKXt9XG4gICAgZ2V0UGFydG5lclN1aXRlKCl7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7fVxuICAgIGdldFRydW1wUGxheWVyKCl7fVxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVyKXt9XG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXt9XG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXt9XG4gICAgZ2V0SGlnaGVzdEJpZCgpe31cbiAgICAvLyBNREhAMDNKQU4yMDIwOiBJIG5lZWRlZCB0byBhZGQgdGhlIGZvbGxvd2luZyBtZXRob2RzXG4gICAgZ2V0UGxheWVyTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZGVsdGFQb2ludHMoKXt9XG4gICAgZ2V0IHBvaW50cygpe31cbiAgICBpc1BsYXllclBhcnRuZXIocGxheWVyLG90aGVyUGxheWVyKXt9XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzUGxheWVkKCl7fVxuICAgIGdldFRyaWNrQXRJbmRleCh0cmlja0luZGV4KXt9IC8vIGdldCB0aGUgbGFzdCB0cmljayBwbGF5ZWRcbiAgICBnZXRUZWFtTmFtZShwbGF5ZXIpe31cbiAgICBnZXQgZm91cnRoQWNlUGxheWVyKCl7fVxuICAgIF9hc2tQbGF5ZXJGb3JCaWQoKXt9XG4gICAgX2Fza1BsYXllckZvclRydW1wU3VpdGUoKXt9XG4gICAgX2Fza1BsYXllckZvclBhcnRuZXJTdWl0ZSgpe31cbiAgICBfYXNrUGxheWVyRm9yQ2FyZCgpe31cbiAgICBfY2FyZFBsYXllZEFjY2VwdGVkKCl7fSAvLyBNREhAMjNKQU4yMDIwOiB0aGUgZW1wdHkgbWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIGEgY2FyZCB3YXMgcGxheWVkIHN1Y2Nlc3NmdWxseVxufVxuXG5jb25zdCBDSE9JQ0VfSURTPVtcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIl07XG5cbmNvbnN0IFBMQVlFUlRZUEVfRk9PPTAsUExBWUVSVFlQRV9VTktOT1dOPTEsUExBWUVSVFlQRV9GUklFTkQ9MjtcblxuLy8gdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIFBsYXllciBpbnN0YW5jZXNcbi8vIHdvdWxkIGJlIGRlZmluZWQgYWJzdHJhY3QgaW4gY2xhc3NpY2FsIE9PXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgbG9nKHRvbG9nKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJQTEFZRVIgPj4+IFwiK3RvbG9nKTtcbiAgICB9XG4gICAgXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgaWYocGxheWVyRXZlbnRMaXN0ZW5lciYmcGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycy5wdXNoKHBsYXllckV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcy5uYW1lK1wiJyBldmVudCBsaXN0ZW5lcnM6IFwiK3RoaXMuX2V2ZW50TGlzdGVuZXJzK1wiLlwiKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuZXZlciBhIGdhbWUgaXMgc3RhcnRlZCwgY2FsbCBuZXdHYW1lISFcbiAgICBuZXdHYW1lKCl7XG4gICAgICAgIGlmKHRoaXMuX2luZGV4PDB8fCF0aGlzLl9nYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSB2b29yIHRlIGJlcmVpZGVuIG9tIHRlIHNwZWxlbi5cIik7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzPXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgaWYobnVtYmVyT2ZDYXJkcz4wKXtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIGJldHRlciBkb25lIHRoaXMgd2F5IGluc3RlYWQgb2YgdGhpcy5fY2FyZHM9W11cbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJOb2cgXCIrbnVtYmVyT2ZDYXJkcytcIiBrYWFydGVuIGluIGRlIGhhbmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmF1bHQgcGxheWVyIHJlbWVtYmVyaW5nIGl0cyBjaG9pY2VzXG4gICAgICAgIHRoaXMuX2JpZD0tMTsgLy8gdGhlIGxhc3QgYmlkIG9mIHRoaXMgcGxheWVyXG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fY2FyZD1udWxsO1xuICAgICAgICAvLyB0aGUgZ2FtZSBiZWluZyBwbGF5ZWQsIGFuZCB0aGUgaW5kZXggd2l0aGluIHRoYXQgZ2FtZVxuICAgICAgICB0aGlzLl9wYXJ0bmVyPS0xO1xuICAgICAgICB0aGlzLl90cmlja3NXb249W107IC8vIHRoZSB0cmlja3Mgd29uIChpbiBhbnkgZ2FtZSlcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbj0tMTsgLy8gZG9lc24ndCBtYXR0ZXJcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lLHBsYXllckV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzPVtdO1xuICAgICAgICBpZihwbGF5ZXJFdmVudExpc3RlbmVyKXtcbiAgICAgICAgICAgIGlmKCEocGxheWVyRXZlbnRMaXN0ZW5lciBpbnN0YW5jZW9mIFBsYXllckV2ZW50TGlzdGVuZXIpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsYXllciBldmVudCBsaXN0ZW5lciBvZiB3cm9uZyB0eXBlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB3YWl0IGZvciByZWNlaXZpbmcgZ2FtZSBhbmQgaW5kZXhcbiAgICAgICAgdGhpcy5faW5kZXg9LTE7dGhpcy5fZ2FtZT1udWxsOyAvLyB3YWl0aW5nIGZvciB0aGUgZ2FtZSB0byBiZSBwbHVnZ2VkIGluIChvbmNlKVxuICAgICAgICAvLyByZW1vdmVkIHdhaXQgdW50aWwgZ2V0dGluZyBjYWxsZWQgdGhyb3VnaCBuZXdHYW1lOiB0aGlzLl9wcmVwYXJlRm9yUGxheWluZygpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCl7cmV0dXJuIHRoaXMuX25hbWU7fVxuICAgIHNldCBuYW1lKG5hbWUpe3RoaXMuX25hbWU9bmFtZTt9XG5cbiAgICAvLyBnZXR0ZXJzIGV4cG9zaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBtYWRlIGNob2ljZVxuICAgIC8vIE5PVEUgbm8gbG9uZ2VyIGNhbGxlZCBieSB0aGUgZ2FtZSBiZWNhdXNlIHRoZSBjaG9pY2UgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IG5vd1xuICAgIC8vICAgICAgdGhpcyB3YXkgc3ViY2xhc3NlcyBhcmUgbm90IG9ibGlnYXRlZCB0byByZW1lbWJlciB0aGUgY2hvaWNlcyB0aGV5IG1ha2VcbiAgICBnZXQgYmlkKCl7cmV0dXJuIHRoaXMuX2JpZDt9XG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCB0cnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldCBjYXJkKCl7cmV0dXJuIHRoaXMuY2FyZCgpO31cblxuICAgIGdldCBwYXJ0bmVyKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXI7fVxuXG4gICAgLy8vLy8vLy8vLy8vLy9nZXQgY2FyZCgpe3JldHVybiB0aGlzLl9jYXJkc1t0aGlzLl9jYXJkUGxheUluZGV4XTt9XG5cbiAgICAvKiBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBnYW1lXG4gICAgLy8gY2FuIGJlIHNldCBkaXJlY3RseSB3aGVuIGEgYmV0dGVyICdyaWsnIHZhcmlhdGlvbiBiaWQgd2FzIGRvbmUhISEhXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgXG4gICAgLy8gVE9ETyBpdCB3b3VsZCBiZSBlYXNpZXIgdG8gY29tYmluZSB0aGVzZSBpbiBhIGNhcmQhISEhXG4gICAgZ2V0IHBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldCBwYXJ0bmVyUmFuaygpe3JldHVybiB0aGlzLl9wYXJ0bmVyUmFuazt9XG5cbiAgICAvLyBjYWxsZWQgZnJvbSB0aGUgVUkgdG8gc2V0IHRoZSB0cnVtcCBzdWl0ZSEhISFcbiAgICBzZXQgdHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKXt0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7dGhpcy50cnVtcFN1aXRlQ2hvc2VuKCk7fVxuICAgIHNldCBwYXJ0bmVyU3VpdGUocGFydG5lclN1aXRlKXt0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO3RoaXMucGFydG5lclN1aXRlQ2hvc2VuKCk7fVxuICAgICovXG5cbiAgICAvLyBlbmQgb2YgZ2V0dGVycy9zZXR0ZXJzIHVzZWQgYnkgdGhlIGdhbWVcbiAgICBfcmVtb3ZlQ2FyZHMoKXt3aGlsZSh0aGlzLl9jYXJkcy5sZW5ndGg+MCl0aGlzLl9jYXJkcy5zaGlmdCgpLmhvbGRlcj1udWxsO31cblxuICAgIGdldCBnYW1lKCl7cmV0dXJuIHRoaXMuX2dhbWU7fVxuICAgIHNldCBnYW1lKGdhbWUpe1xuICAgICAgICBpZih0aGlzLl9nYW1lIT09Z2FtZSl7XG5cbiAgICAgICAgfVxuICAgICAgICBpZihnYW1lJiYhKGdhbWUgaW5zdGFuY2VvZiBQbGF5ZXJHYW1lKSlyZXR1cm4gbmV3IEVycm9yKFwiU3BlbCBuaWV0IHZhbiBoZXQganVpc3RlIHR5cGUuXCIpO1xuICAgICAgICBpZihnYW1lKWlmKHRoaXMuX2luZGV4PDApcmV0dXJuIG5ldyBFcnJvcihcIlBvc2l0aWUgdmFuIHNwZWxlciBvbmJla2VuZC5cIik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7IC8vIE1ESEAxMUpBTjIwMjA6IGlmIHRoZSBnYW1lIGNoYW5nZXMgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgY2FyZHNcbiAgICAgICAgdGhpcy5fZ2FtZT1nYW1lO1xuICAgICAgICAvLyBzeW5jIF9pbmRleFxuICAgICAgICBpZih0aGlzLl9nYW1lKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvbiFcIik7XG4gICAgICAgICAgICAvLyBwcmVwYXJlIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gICAgICAgICAgICB0aGlzLnBhcnRuZXI9LTE7IC8vIG15IHBhcnRuZXIgKG9uY2UgSSBub3cgd2hvIGl0IGlzKVxuICAgICAgICAgICAgdGhpcy50cmlja3NXb249W107IC8vIHN0b3JpbmcgdGhlIHRyaWNrcyB3b25cbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvdmVyIVwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4KCl7cmV0dXJuIHRoaXMuX2luZGV4O30gLy8gTURIQDIySkFOMjAyMDogbm8gaGFybSBpbiBhZGRpbmcgYSBnZXR0ZXIhISFcbiAgICBzZXQgaW5kZXgoaW5kZXgpe3RoaXMuX2luZGV4PWluZGV4O30gLy8gTURIQDA5SkFOMjAyMDogc29tZXRpbWVzIGFuIGluZGV4IGNhbiBiZSBzZXQgc2VwYXJhdGVseVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWdpc3RlcmluZyB0aGUgZ2FtZSBwbGF5ZWQgYXQgaW5kZXggXCIraW5kZXgrXCIuXCIpO1xuICAgICAgICB0aGlzLmluZGV4PWluZGV4O1xuICAgICAgICB0aGlzLmdhbWU9Z2FtZTtcbiAgICB9XG4gICAgLypcbiAgICBhZGRDYXJkKGNhcmQpe1xuICAgICAgICBzdXBlci5hZGRDYXJkKGNhcmQpO1xuICAgICAgICB0aGlzLmxvZyhcIlBsYXllciAnXCIrdGhpcytcIicgcmVjZWl2ZWQgY2FyZCAnXCIrY2FyZCtcIicuXCIpO1xuICAgIH1cbiAgICAqL1xuICAgIF9nZXRDYXJkc09mU3VpdGUoY2FyZFN1aXRlLHdoZW5Ob3RGb3VuZENhcmQpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5maWx0ZXIoKGNhcmQpPT57cmV0dXJuKGNhcmQuc3VpdGU9PWNhcmRTdWl0ZSk7fSk7XG4gICAgfVxuXG4gICAgX2dldFN1aXRlQ2FyZHMoKXtcbiAgICAgICAgdGhpcy5sb2coXCJEZXRlcm1pbmluZyBzdWl0ZSBjYXJkcyBvZiBcIit0aGlzLm51bWJlck9mQ2FyZHMrXCIgY2FyZHMhXCIpO1xuICAgICAgICBsZXQgc3VpdGVDYXJkcz1bW10sW10sW10sW11dO1xuICAgICAgICB0aGlzLl9jYXJkcy5mb3JFYWNoKChjYXJkKT0+e3N1aXRlQ2FyZHNbY2FyZC5zdWl0ZV0ucHVzaChjYXJkKTt9KTtcbiAgICAgICAgcmV0dXJuIHN1aXRlQ2FyZHM7XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIG9mIGEgZ2l2ZW4gY2FyZCBzdWl0ZSAob3IgYW55IGNhcmQgaWYgY2FyZFN1aXRlIGlzIHVuZGVmaW5lZClcbiAgICBjb250cmlidXRlVG9Ucmljayh0cmljaykge1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg9PTApcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4ga2FhcnRlbiBtZWVyIG9tIHRlIHNwZWxlbiFcIik7XG4gICAgICAgIGxldCBjYXJkc09mU3VpdGU9dGhpcy5fZ2V0Q2FyZHNPZlN1aXRlKGNhcmRTdWl0ZSk7XG4gICAgICAgIGxldCBjYXJkPShjYXJkc09mU3VpdGUmJmNhcmRzT2ZTdWl0ZS5sZW5ndGg+MD9jYXJkc09mU3VpdGVbMF06dGhpcy5fY2FyZHNbMF0pO1xuICAgICAgICBjYXJkLmhvbGRlcj10cmljazsgLy8gbW92ZSB0aGUgY2FyZCB0byB0aGUgdHJpY2tcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTURIOiBhbGwgbWV0aG9kcyB0aGF0IGRlYWwgd2l0aCBwcm9jZXNzaW5nIGEgYmlkLCBhIGNhcmQsIHRydW1wIG9yIHBhcnRuZXIgc3VpdGUgY2hvaWNlXG4gICAgLy8gdG8gc2lnbmFsIGhhdmluZyBtYWRlIGEgYmlkXG4gICAgX2JpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIG5ldyBFcnJvcihcIkdlZW4gc3BlbCBvbSBpbiB0ZSBiaWVkZW4hXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3NpbmcgYmlkIFwiK2JpZCtcIiBvZiBwbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgdG8gdGhlIGdhbWUhXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZS5iaWRNYWRlKGJpZCk7XG4gICAgfVxuICAgIC8vIE1ESEAyNkpBTjIwMjA6IHJldHVybmluZyB0cnVlIG9uIHN1Y2Nlc3MgKHdoZW4gX2JpZE1hZGUgZGlkIG5vdCByZXR1cm4gYW4gZXJyb3IpXG4gICAgX3NldEJpZChiaWQpe1xuICAgICAgICBsZXQgZXJyb3I9dGhpcy5fYmlkTWFkZShiaWQpO1xuICAgICAgICBpZihlcnJvciYmZXJyb3IhPT10cnVlKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fYmlkPWJpZDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7KCFldmVudExpc3RlbmVyfHxldmVudExpc3RlbmVyLmJpZE1hZGUodGhpcy5fYmlkKSk7fWNhdGNoKGVycm9yKXt9fSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNhcmRQbGF5ZWQgaW4gUmlra2VuVGhlR2FtZSBjYW4gbm93IHJldHVybiBhbiBlcnJvciAoaW5zdGVhZCBvZiB0aHJvd2luZyBvbmUpXG4gICAgX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIGthYXJ0IGluIHRlIHNwZWxlbiFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLmNhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgfVxuICAgIC8vIFRPRE8gYSBiaWQgc2V0dGVyIHdpbGwgYWxsb3cgc3ViY2xhc3NlcyB0byBwYXNzIGEgYmlkIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5XG4gICAgX3NldENhcmQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIC8vIHRlY2huaWNhbGx5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHBsYXllZCBjYXJkIGlzIHZhbGlkIHNob3VsZCBiZSBkb25lIGhlcmUsIG9yIEJFRk9SRSBjYWxsaW5nIHNldENhcmRcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX2NhcmRQbGF5ZWQoY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7XG4gICAgICAgIGlmKGVycm9yKXJldHVybiBlcnJvcjtcbiAgICAgICAgdGhpcy5fY2FyZD1jYXJkO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLmNhcmRQbGF5ZWQodGhpcy5fY2FyZCxhc2tpbmdGb3JQYXJ0bmVyQ2FyZCk7fWNhdGNoKGVycm9yKXt9O30pO1xuICAgIH1cblxuICAgIC8vIHRvIHNpZ25hbCBoYXZpbmcgY2hvb3NlbiBhIHRydW1wIHN1aXRlXG4gICAgX3RydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHRyb2Vma2xldXIgaW4gdGUga2llemVuIVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWUudHJ1bXBTdWl0ZUNob3Nlbih0cnVtcFN1aXRlKTtcbiAgICB9XG4gICAgX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl90cnVtcFN1aXRlQ2hvc2VuKHRydW1wU3VpdGUpO1xuICAgICAgICBpZihlcnJvcilyZXR1cm4gZXJyb3I7XG4gICAgICAgIHRoaXMuX3RydW1wU3VpdGU9dHJ1bXBTdWl0ZTtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0ZW5lcnMpdGhpcy5fZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcik9Pnt0cnl7ZXZlbnRMaXN0ZW5lci50cnVtcFN1aXRlQ2hvc2VuKHRoaXMuX3RydW1wU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyB0byBzaWduYWwgaGF2aW5nIGNob3NlbiBhIHBhcnRuZXJcbiAgICBfcGFydG5lclN1aXRlQ2hvc2VuKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGlmKCF0aGlzLl9nYW1lKXJldHVybiBuZXcgRXJyb3IoXCJHZWVuIHNwZWwgb20gZWVuIHBhcnRuZXIgKGthYXJ0a2xldXIpIHRlIGtpZXplbi5cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lLnBhcnRuZXJTdWl0ZUNob3NlbihwYXJ0bmVyU3VpdGUpO1xuICAgIH1cbiAgICBfc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSl7XG4gICAgICAgIGxldCBlcnJvcj10aGlzLl9wYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKTtcbiAgICAgICAgaWYoZXJyb3IpcmV0dXJuIGVycm9yO1xuICAgICAgICB0aGlzLl9wYXJ0bmVyU3VpdGU9cGFydG5lclN1aXRlO1xuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RlbmVycyl0aGlzLl9ldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKT0+e3RyeXtldmVudExpc3RlbmVyLnBhcnRuZXJTdWl0ZUNob3Nlbih0aGlzLl9wYXJ0bmVyU3VpdGUpO31jYXRjaChlcnJvcil7fTt9KTtcbiAgICB9XG5cbiAgICAvLyBjYW4gYmUgYXNrZWQgdG8gbWFrZSBhIGJpZCBwYXNzaW5nIGluIHRoZSBoaWdoZXN0IGJpZCBzbyBmYXJcbiAgICAvLyBOT1RFIHRoaXMgd291bGQgYmUgYW4gJ2Fic3RyYWN0JyBtZXRob2QgaW4gY2xhc3NpY2FsIE9PXG4gICAgbWFrZUFCaWQocGxheWVyYmlkcyl7XG4gICAgICAgIC8vIGFzc3VtZXMgdGhhdCB0aGlzIHBsYXllciBoYXMgbWFkZSBhIGJpZCBiZWZvcmUsIG9yIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgYmlkXG4gICAgICAgIC8vIHRoaXMgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRvIGJlIHJ1bm5pbmcgaW4gYSBicm93c2VyIHNvIHdlIGNhbiB1c2UgcHJvbXB0KClcbiAgICAgICAgLy8gYWxsIG90aGVyIGF2YWlsYWJsZSBiaWRzIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiB0aGUgbGFzdCBiaWQgYnkgYW55IG90aGVyIHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZFNvRmFyPVBsYXllckdhbWUuQklEX1BBUztcbiAgICAgICAgaWYocGxheWVyYmlkcyl7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlBsYXllciBiaWRzOlwiLHBsYXllcmJpZHMpO1xuICAgICAgICAgICAgZm9yKGxldCBwbGF5ZXI9MDtwbGF5ZXI8cGxheWVyYmlkcy5sZW5ndGg7cGxheWVyKyspXG4gICAgICAgICAgICAgICAgaWYocGxheWVyYmlkc1twbGF5ZXJdLmxlbmd0aD4wJiZwbGF5ZXJiaWRzW3BsYXllcl1bMF0+aGlnaGVzdEJpZFNvRmFyKVxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0QmlkU29GYXI9cGxheWVyYmlkc1twbGF5ZXJdWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nKFwiSGlnaGVzdCBiaWQgc28gZmFyOiAnXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXStcIicuXCIpO1xuICAgICAgICAvLyBpZiB0aGUgaGlnaGVzdCBwb3NzaWJsZSBiaWQgaXMgbm90IGEgYmlkIGFsbCBjYW4gcGxheSAoYXQgdGhlIHNhbWUgdGltZSksIGNhbid0IGJlIGJpZCBhZ2FpblxuICAgICAgICBpZihQbGF5ZXJHYW1lLkJJRFNfQUxMX0NBTl9QTEFZLmluZGV4T2YoUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZFNvRmFyXSk8MCloaWdoZXN0QmlkU29GYXIrKztcbiAgICAgICAgbGV0IHBvc3NpYmxlQmlkTmFtZXM9UGxheWVyR2FtZS5CSURfTkFNRVMuc2xpY2UoaGlnaGVzdEJpZFNvRmFyKTtcbiAgICAgICAgcG9zc2libGVCaWROYW1lcy51bnNoaWZ0KFBsYXllckdhbWUuQklEX05BTUVTW1BsYXllckdhbWUuQklEX1BBU10pOyAvLyB1c2VyIGNhbiBhbHdheXMgJ3BhcydcbiAgICAgICAgdGhpcy5sb2coXCJQb3NzaWJsZSBiaWRzOiBcIixwb3NzaWJsZUJpZE5hbWVzKTtcbiAgICAgICAgbGV0IGJpZD0tMTtcbiAgICAgICAgd2hpbGUoYmlkPDApe1xuICAgICAgICAgICAgbGV0IGJpZG5hbWU9cHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIiAoaG9sZGluZyBcIit0aGlzLmdldFRleHRSZXByZXNlbnRhdGlvbih0cnVlKStcIilcXG5XaGF0IGlzIHlvdXIgYmlkIChvcHRpb25zOiAnXCIrcG9zc2libGVCaWROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLHBvc3NpYmxlQmlkTmFtZXNbMF0pO1xuICAgICAgICAgICAgYmlkPVBsYXllckdhbWUuQklEX05BTUVTLmluZGV4T2YoYmlkbmFtZSk7XG4gICAgICAgICAgICBpZihiaWQ8MCljb250aW51ZTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRCaWQoYmlkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgYmlkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hvb3NlVHJ1bXBTdWl0ZShzdWl0ZXMpe1xuICAgICAgICAvLyBpZiB0aGlzIHBsYXllciBoYXMgYWxsIGFjZXMgaXQncyBnb25uYSBiZSB0aGUgc3VpdGUgb2YgYSBraW5nIHRoZSBwZXJzb24gaGFzbid0XG4gICAgICAgIC8vIGFsc28gaXQgbmVlZHMgdG8gYmUgYW4gYWNlIG9mIGEgc3VpdGUgdGhlIHVzZXIgaGFzIGl0c2VsZiAodW5sZXNzIHlvdSBoYXZlIGFsbCBvdGhlciBhY2VzKVxuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xO1xuICAgICAgICAvLyBhbnkgb2YgdGhlIHN1aXRlcyBpbiB0aGUgY2FyZHMgY2FuIGJlIHRoZSB0cnVtcCBzdWl0ZSFcbiAgICAgICAgbGV0IHBvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzPXRoaXMuZ2V0U3VpdGVzKCkubWFwKChzdWl0ZSk9PntyZXR1cm4gQ2FyZC5DQVJEX1NVSVRFU1tzdWl0ZV07fSk7XG4gICAgICAgIGxldCB0cnVtcFN1aXRlPS0xO1xuICAgICAgICB3aGlsZSh0cnVtcFN1aXRlPDApe1xuICAgICAgICAgICAgbGV0IHRydW1wTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgc3VpdGUgd2lsbCBiZSB0cnVtcCAob3B0aW9uczogJ1wiK3Bvc3NpYmxlVHJ1bXBTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVUcnVtcFN1aXRlTmFtZXNbMF0pO1xuICAgICAgICAgICAgdHJ1bXBTdWl0ZT1wb3NzaWJsZVRydW1wU3VpdGVOYW1lcy5pbmRleE9mKHRydW1wTmFtZSk7XG4gICAgICAgICAgICBpZih0cnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFRydW1wU3VpdGUodHJ1bXBTdWl0ZSk7XG4gICAgICAgICAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHRydW1wU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFza3MgZm9yIHRoZSBzdWl0ZSBvZiB0aGUgcGFydG5lciBjYXJkIG9mIHRoZSBnaXZlbiByYW5rXG4gICAgICovXG4gICAgY2hvb3NlUGFydG5lclN1aXRlKCl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTtcbiAgICAgICAgdGhpcy5fcGFydG5lclJhbms9UkFOS19BQ0U7XG4gICAgICAgIC8vIGdldCBhbGwgdGhlIGFjZWxlc3Mgc3VpdGVzXG4gICAgICAgIGxldCBzdWl0ZXM9dGhpcy5nZXRTdWl0ZXMoKTtcbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlcz10aGlzLmdldFJhbmtsZXNzU3VpdGVzKHRoaXMuX3BhcnRuZXJSYW5rKTtcbiAgICAgICAgaWYocG9zc2libGVQYXJ0bmVyU3VpdGVzLmxlbmd0aD09MCl7IC8vIHBsYXllciBoYXMgQUxMIGFjZXNcbiAgICAgICAgICAgIGlmKHN1aXRlcy5sZW5ndGg8NCl7IC8vIGJ1dCBub3QgYWxsIHN1aXRlc1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgc3VpdHMgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhcmUgYWxsb3dlZCAoYXNraW5nIHRoZSBhY2UgYmxpbmQhISEpXG4gICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPVswLDEsMiwzXS5maWx0ZXIoKHN1aXRlKT0+e3JldHVybiBwb3NzaWJsZVBhcnRuZXJTdWl0ZXMuaW5kZXhPZihzdWl0ZSk8MDt9KTtcbiAgICAgICAgICAgIH1lbHNleyAvLyBoYXMgYWxsIHN1aXRzLCBzbyBhIGtpbmcgaXMgdG8gYmUgc2VsZWN0ZWQhISFcbiAgICAgICAgICAgICAgICAvLyBhbGwga2luZ3MgYWNjZXB0YWJsZSBleGNlcHQgZm9yIHRoYXQgaW4gdGhlIHRydW1wIGNvbG9yXG4gICAgICAgICAgICAgICAgLy8gTk9URSBpZiBhIHBlcnNvbiBhbHNvIGhhcyBhbGwgdGhlIGtpbmdzIHdlIGhhdmUgYSBzaXR1YXRpb24sIHdlIHNpbXBseSBjb250aW51ZSBvbndhcmRcbiAgICAgICAgICAgICAgICB3aGlsZSgxKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclJhbmstLTtcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVQYXJ0bmVyU3VpdGVzPXRoaXMuZ2V0UmFua2xlc3NTdWl0ZXModGhpcy5fcGFydG5lclJhbmspO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJ1bXBTdWl0ZUluZGV4PXBvc3NpYmxlUGFydG5lclN1aXRlcy5pbmRleE9mKHRoaXMuX3RydW1wU3VpdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0cnVtcFN1aXRlSW5kZXg+PTApcG9zc2libGVQYXJ0bmVyU3VpdGVzLnNwbGljZSh0cnVtcFN1aXRlSW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvc3NpYmxlUGFydG5lclN1aXRlcy5sZW5ndGg+MClicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvc3NpYmxlUGFydG5lclN1aXRlTmFtZXM9cG9zc2libGVQYXJ0bmVyU3VpdGVzLm1hcCgoc3VpdGUpPT57cmV0dXJuIENhcmQuQ0FSRF9TVUlURVNbc3VpdGVdO30pO1xuICAgICAgICBsZXQgcGFydG5lclN1aXRlPS0xO1xuICAgICAgICB3aGlsZShwYXJ0bmVyU3VpdGU8MCl7XG4gICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlTmFtZT1wcm9tcHQoXCJAXCIrdGhpcy5uYW1lK1wiIChob2xkaW5nIFwiK3RoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKHRydWUpK1wiKVxcbldoYXQgXCIrQ2FyZC5DQVJEX05BTUVTW3RoaXMuX3BhcnRuZXJSYW5rXStcIiBzaG91bGQgeW91ciBwYXJ0bmVyIGhhdmUgKG9wdGlvbnM6ICdcIitwb3NzaWJsZVBhcnRuZXJTdWl0ZU5hbWVzLmpvaW4oXCInLCAnXCIpK1wiJyk/XCIscG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lc1swXSk7XG4gICAgICAgICAgICBwYXJ0bmVyU3VpdGU9cG9zc2libGVQYXJ0bmVyU3VpdGVOYW1lcy5pbmRleE9mKHBhcnRuZXJTdWl0ZU5hbWUpO1xuICAgICAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFBhcnRuZXJTdWl0ZShwYXJ0bmVyU3VpdGUpO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FuIGJlIGFza2VkIHRvIHBsYXkgYSBjYXJkIGFuZCBhZGQgaXQgdG8gdGhlIGdpdmVuIHRyaWNrXG4gICAgLy8gTk9URSB0aGlzIHdvdWxkIGJlIGFuICdhYnN0cmFjdCcgbWV0aG9kIGluIGNsYXNzaWNhbCBPT1xuICAgIHBsYXlBQ2FyZCh0cmljayl7XG4gICAgICAgIHRoaXMubG9nKFwiUGxheWVyICdcIit0aGlzLm5hbWUrXCInIGFza2VkIHRvIHBsYXkgYSBjYXJkLlwiKTtcbiAgICAgICAgLy8gaG93IGFib3V0IHVzaW5nIHRoZSBmaXJzdCBsZXR0ZXJzIG9mIHRoZSBhbHBoYWJldD9cbiAgICAgICAgbGV0IHBvc3NpYmxlQ2FyZE5hbWVzPVtdO1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLm51bWJlck9mQ2FyZHM7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBwb3NzaWJsZUNhcmROYW1lcy5wdXNoKFN0cmluZy5jYXJkSW5kZXgrMSkrXCI6IFwiK3RoaXMuX2NhcmRzW2NhcmRJbmRleF0uZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgIGxldCBjYXJkUGxheUluZGV4PS0xO1xuICAgICAgICB3aGlsZShjYXJkUGxheUluZGV4PDApe1xuICAgICAgICAgICAgLy8gd2UncmUgc3VwcG9zZWQgdG8gcGxheSBhIGNhcmQgd2l0aCBzdWl0ZSBlcXVhbCB0byB0aGUgZmlyc3QgY2FyZCB1bmxlc3MgdGhlIHBhcnRuZXIgc3VpdGUvcmFuayBpcyBiZWluZyBhc2tlZCBmb3JcbiAgICAgICAgICAgIGxldCBjYXJkSWQ9cGFyc2VJbnQocHJvbXB0KFwiQFwiK3RoaXMubmFtZStcIlxcblByZXNzIHRoZSBpZCBvZiB0aGUgY2FyZCB5b3Ugd2FudCB0byBhZGQgdG8gXCIrdHJpY2suZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCkrXCIgKG9wdGlvbnM6ICdcIitwb3NzaWJsZUNhcmROYW1lcy5qb2luKFwiJywgJ1wiKStcIicpP1wiLFwiXCIpKTtcbiAgICAgICAgICAgIGlmKGlzTmFOKGNhcmRJZCkpY29udGludWU7XG4gICAgICAgICAgICBjYXJkUGxheUluZGV4PWNhcmRJZC0xO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENhcmQodGhpcy5fY2FyZHNbY2FyZFBsYXlJbmRleF0pO1xuICAgIH1cblxuICAgIHNldCBwYXJ0bmVyKHBhcnRuZXIpe3RoaXMuX3BhcnRuZXI9KHR5cGVvZiBwYXJ0bmVyPT09J251bWJlcic/cGFydG5lcjotMSk7fSAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgdHJpY2tXb24odHJpY2tJbmRleCl7XG4gICAgICAgIHRoaXMuX3RyaWNrc1dvbi5wdXNoKHRyaWNrSW5kZXgpO1xuICAgICAgICB0aGlzLmxvZyhcIlRyaWNrICNcIit0cmlja0luZGV4K1wiIHdvbiBieSAnXCIrdGhpcy5uYW1lK1wiJzogXCIrdGhpcy5fdHJpY2tzV29uK1wiLlwiKTtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZUcmlja3NXb24oKXtyZXR1cm4gdGhpcy5fdHJpY2tzV29uLmxlbmd0aDt9XG4gICAgXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgdHJpY2tzIHdvbiAoaW5jbHVkaW5nIHRob3NlIGJ5IHRoZSBwYXJ0bmVyIChpZiBhbnkpKVxuICAgICAgICByZXR1cm4odGhpcy5udW1iZXJPZlRyaWNrc1dvbit0aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5wYXJ0bmVyKSk7XG4gICAgfVxuXG4gICAgc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihudW1iZXJPZlRyaWNrc1RvV2luKXt0aGlzLl9udW1iZXJPZlRyaWNrc1RvV2luPW51bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIGdldCBudW1iZXJPZlRyaWNrc1RvV2luKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzVG9XaW47fVxuICAgIFxuICAgIC8vIGV2ZXJ5IHBsYXllciBjYW4gYmUgY2hlY2tlZCB3aGV0aGVyIGZyaWVuZCAoMSkgb3IgZm9vICgtMSkgb3IgdW5rbm93biAoMClcbiAgICBpc0ZyaWVuZGx5KHBsYXllcil7XG4gICAgICAgIGlmKHBsYXllcj09PXRoaXMuX2luZGV4KXJldHVybiAyOyAvLyBJJ20gbXVjaG8gZnJpZW5kbHkgdG8gbXlzZWxmXG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgaWYocGFydG5lclN1aXRlPj0wKXsgLy8gYSBub24tc29saXRhcnkgZ2FtZVxuICAgICAgICAgICAgLy8gQVNTRVJUIG5vdCBhIHNvbGl0YXJ5IGdhbWUgc28gcGxheWVyIGNvdWxkIGJlIHRoZSBwYXJ0bmVyIGluIGNyaW1lXG4gICAgICAgICAgICAvLyBpZiBwYXJ0bmVyIGlzIGtub3duIChpLmUuIHRoZSBwYXJ0bmVyIGNhcmQgaXMgbm8gbG9uZ2VyIGluIHRoZSBnYW1lKVxuICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lcj49MClyZXR1cm4ocGxheWVyPT09dGhpcy5fcGFydG5lcj8xOi0xKTsgXG4gICAgICAgICAgICAvLyBBU1NFUlQgcGFydG5lciB1bmtub3duIChpLmUuIHBhcnRuZXIgY2FyZCBzdGlsbCBpbiB0aGUgZ2FtZSlcbiAgICAgICAgICAgIGxldCB0cnVtcFBsYXllcj10aGlzLl9nYW1lLmdldFRydW1wUGxheWVyKCk7XG4gICAgICAgICAgICAvLyBpZiBJJ20gdGhlIHRydW1wIHBsYXllciwgYXNzdW1lIEFMTCB1bmZyaWVuZGx5IEJVVCBubyBJIGRvbid0IGtub3cgd2hvIG15IHBhcnRuZXIgaXMgYWxsIGNvdWxkIGJlXG4gICAgICAgICAgICBpZih0aGlzLl9pbmRleD09PXRydW1wUGxheWVyKXJldHVybiAwOyAvLyB1bmtub3duXG4gICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUsdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpKSkgLy8gSSBoYXZlIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICByZXR1cm4ocGxheWVyPT10cnVtcFBsYXllcj8xOi0xKTsgLy8gdGhlIHRydW1wIHBsYXllciBpcyBmcmllbmRseSwgdGhlIG90aGVycyBhcmUgdW5mcmllbmRseVxuICAgICAgICAgICAgLy8gQVNTRVJUIEknbSBub3QgdGhlIHRydW1wIHBsYXllciwgYW5kIEknbSBub3Qgd2l0aCB0aGUgdHJ1bXAgcGxheWVyIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIHRoZSB0cnVtcCBwbGF5ZXIgaXMgZm9vLCB0aGUgcmVzdCBJIGRvbid0IGtub3cgeWV0XG4gICAgICAgICAgICByZXR1cm4ocGxheWVyPT09dHJ1bXBQbGF5ZXI/LTE6MCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIGEgc29saXRhcnkgZ2FtZVxuICAgICAgICAvLyBpZiBJJ20gb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzLCBldmVyeW9uZSBlbHNlIGlzIGEgZm9vXG4gICAgICAgIGlmKHRoaXMuX2dhbWUuZ2V0SGlnaGVzdEJpZGRlcnMoKS5pbmRleE9mKHRoaXMuX2luZGV4KT49MClyZXR1cm4gLTE7XG4gICAgICAgIC8vIEFTU0VSVCBub3Qgb25lIG9mIHRoZSBzb2xpdGFyeSBwbGF5ZXJzXG4gICAgICAgIC8vICAgICAgICBpZiBwbGF5ZXIgaXMgYSBzb2xpdGFyeSBwbGF5ZXIgaXQncyBhIGZvbywgb3RoZXJ3aXNlIGl0J3MgdXMgYWdhaW5zdCB0aGVtISEhIVxuICAgICAgICByZXR1cm4odGhpcy5fZ2FtZS5nZXRIaWdoZXN0QmlkZGVycygpLmluZGV4T2YocGxheWVyKT49MD8tMToxKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe3JldHVybiB0aGlzLm5hbWU7fVxuXG59XG5cbi8vIGV4cG9ydCB0aGUgUGxheWVyIGNsYXNzXG5tb2R1bGUuZXhwb3J0cz17UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn07IiwiY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTsgLy8gZm9yIGNvbXBhcmluZyBjYXJkc1xuY29uc3Qge0NhcmRIb2xkZXIsSG9sZGFibGVDYXJkfT1yZXF1aXJlKCcuL0NhcmRIb2xkZXIuanMnKTtcblxuY2xhc3MgVHJpY2sgZXh0ZW5kcyBDYXJkSG9sZGVye1xuXG4gICAgLy8gTURIQDA3REVDMjAxOTogZ2FtZSBkYXRhIG1vdmVkIG92ZXIgdG8gUGxheWVyR2FtZSBpbnN0YW5jZSAoYXMgcGFzc2VkIHRvIGVhY2ggcGxheWVyKVxuICAgIC8vICAgICAgICAgICAgICAgIGNhbkFza0ZvclBhcnRuZXJDYXJkIGJsaW5kIG5vdyBkZXRlcm1pbmVkIGJ5IHRoZSBnYW1lIChlbmdpbmUpIGl0c2VsZlxuXG4gICAgLy8gYnkgcGFzc2luZyBpbiB0aGUgdHJ1bXAgcGxheWVyIChpLmUuIHRoZSBwZXJzb24gdGhhdCBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkKVxuICAgIGNvbnN0cnVjdG9yKGZpcnN0UGxheWVyLHRydW1wU3VpdGUscGFydG5lclN1aXRlLHBhcnRuZXJSYW5rLGNhbkFza0ZvclBhcnRuZXJDYXJkLGZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyl7IC8vIHJlcGxhY2luZzogdHJ1bXBTdWl0ZSxwYXJ0bmVyU3VpdGUscGFydG5lclJhbmssdHJ1bXBQbGF5ZXIpe1xuICAgICAgICBzdXBlcigpOyAvLyB1c2luZyA0IGZpeGVkIHBvc2l0aW9ucyBmb3IgdGhlIHRyaWNrIGNhcmRzIHNvIHdlIHdpbGwga25vdyB3aG8gcGxheWVkIHRoZW0hISEhXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyPWZpcnN0UGxheWVyO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPXRydW1wU3VpdGU7IC8vIGZvciBpbnRlcm5hbCB1c2UgdG8gYmUgYWJsZSB0byBkZXRlcm1pbmUgdGhlIHdpbm5lciBvZiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7dGhpcy5fcGFydG5lclJhbms9cGFydG5lclJhbms7IC8vIG5lZWQgdGhpcyB3aGVuIGl0J3MgYmVpbmcgYXNrZWQgdG8gZGV0ZXJtaW5lIHRoZSB3aW5uZXJcbiAgICAgICAgdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ9Y2FuQXNrRm9yUGFydG5lckNhcmQ7IC8vIC0xIGJsaW5kLCAwIG5vdCwgMSBub24tYmxpbmRcbiAgICAgICAgdGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ9MDsgLy8gdGhlICdmbGFnJyBzZXQgYnkgdGhlIHRydW1wIHBsYXllciB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiBhIHRyaWNrXG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0tMTsgLy8gdGhlIHN1aXRlIG9mIHRoZSB0cmljayAobW9zdCBvZiB0aGUgdGltZSB0aGUgc3VpdGUgb2YgdGhlIGZpcnN0IGNhcmQpXG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9LTE7IC8vIHRoZSBjYXJkIG9mIHRoZSB3aW5uZXIgKG5vdGU6IE5PVCB0cmFuc2Zvcm1lZCB0byB0aGUgYWN0dWFsIHBsYXllciBpbmRleCB5ZXQpXG4gICAgICAgIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcz1maXJzdFBsYXllckNhblBsYXlTcGFkZXM7XG4gICAgICAgIC8vIGxldCdzIGtlZXAgdHJhY2sgb2YgdGhlIGhpZ2hlc3QgY2FyZFxuICAgICAgICBjb25zb2xlLmxvZyhcIj4+PiBOZXcgdHJpY2sgY2FuIGFzayBmb3IgcGFydG5lciBjYXJkOiBcIitjYW5Bc2tGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+IE5ldyB0cmljayBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzOiBcIitmaXJzdFBsYXllckNhblBsYXlTcGFkZXMrXCIuXCIpO1xuICAgIH1cblxuICAgIGdldCBmaXJzdFBsYXllcigpe3JldHVybiB0aGlzLl9maXJzdFBsYXllcjt9XG5cbiAgICBnZXQgZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyQ2FuUGxheVNwYWRlczt9XG4gICAgXG4gICAgLy8gdGhlIHdpbm5lciBleHBvc2VkIGlzIHRoZSBhY3R1YWwgcGxheWVyIHdobyB3b25cbiAgICBnZXQgd2lubmVyKCl7cmV0dXJuKHRoaXMuX3dpbm5lckNhcmQ8MD8tMToodGhpcy5fd2lubmVyQ2FyZCt0aGlzLl9maXJzdFBsYXllciklNCk7fVxuICAgIFxuICAgIC8vIE1ESEAwN0RFQzIwMTk6IG1vdmVkIGZyb20gaGVyZSB0byB0aGUgZ2FtZSAoYXMgYSBQbGF5ZXJHYW1lIGluc3RhbmNlKVxuICAgIC8qXG4gICAgZ2V0IHRydW1wUGxheWVyKCl7cmV0dXJuIHRoaXMuX3RydW1wUGxheWVyO30gLy8gZXhwb3NlcyB0aGUgY3VycmVudCB0cnVtcCBwbGF5ZXJcbiAgICBnZXQgcGFydG5lclN1aXRlKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJTdWl0ZTt9XG4gICAgZ2V0IHBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAqL1xuICAgIGdldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe3JldHVybiB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDt9XG5cbiAgICAvLyBwYXNzIGluIC0xIHdoZW4gYXNraW5nIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQsIG9yICsxIHdoZW4gYXNraW5nIGZvciBpdCAobm9uLWJsaW5kKVxuICAgIHNldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZChhc2tpbmdGb3JQYXJ0bmVyQ2FyZCl7XG4gICAgICAgIGlmKHR5cGVvZiBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PVwibnVtYmVyXCIpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgTk9UIGRlZmluZWQhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFza2luZ0ZvclBhcnRuZXJDYXJkIT0wJiZ0aGlzLm51bWJlck9mQ2FyZHM+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9wZ2V2ZW4gZGUgcGFydG5lciBhYXMvaGVlciAoYmxpbmQpIHRlIHZyYWdlbiBuaWV0IG1lZXIgdG9lZ2VzdGFhbi5cIik7XG4gICAgICAgIHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPWFza2luZ0ZvclBhcnRuZXJDYXJkO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFza2luZyBmb3IgcGFydG5lciBjYXJkIHNldCB0byBcIit0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgX3NldFdpbm5lckNhcmQod2lubmVyQ2FyZCl7XG4gICAgICAgIHRoaXMuX3dpbm5lckNhcmQ9d2lubmVyQ2FyZDtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmljayB3aW5uZXIgY2FyZDogXCIrd2lubmVyQ2FyZCtcIi5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgY2FyZCBwbGF5ZWQgYnkgKHRoZSBhY3R1YWwpIHBsYXllciAoYXMgdXNlZCBmb3Igc2hvd2luZyB0aGUgdHJpY2sgY2FyZHMpXG4gICAgICogQHBhcmFtIHsqfSBwbGF5ZXIgXG4gICAgICovXG4gICAgZ2V0UGxheWVyQ2FyZChwbGF5ZXIpe1xuICAgICAgICBsZXQgcGxheWVyQ2FyZD0odGhpcy5fZmlyc3RQbGF5ZXI+PTA/KHBsYXllcis0LXRoaXMuX2ZpcnN0UGxheWVyKSU0Om51bGwpO1xuICAgICAgICByZXR1cm4ocGxheWVyQ2FyZD49MCYmcGxheWVyQ2FyZDx0aGlzLm51bWJlck9mQ2FyZHM/dGhpcy5fY2FyZHNbcGxheWVyQ2FyZF06bnVsbCk7XG4gICAgfVxuXG4gICAgLypcbiAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCgpe1xuICAgICAgICBpZih0aGlzLl9jYXJkcy5sZW5ndGg+MClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgdGhlIGZpcnN0IHBsYXllciBjYW4gYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIVwiKTtcbiAgICAgICAgaWYoIXRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkQmxpbmQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXNrIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIChhbnltb3JlKS5cIik7XG4gICAgICAgIHRoaXMuX3BsYXlTdWl0ZT10aGlzLl90cnVtcFN1aXRlOyAvLyB0aGUgcGxheSBzdWl0ZSBiZWNvbWVzIHRoZSB0cnVtcCBzdWl0ZVxuICAgIH1cbiAgICAqL1xuICAgIC8vIE5PVEUgYWRkQ2FyZCBpcyBOT1QgX2FkZENhcmQgb2YgdGhlIHN1cGVyY2xhc3MhIHRoaXMgaXMgYmVjYXVzZSB3ZSBzaG91bGQgc2V0IHRoZSBob2xkZXIgb24gdGhlIGNhcmQgdG8gYWRkISEhIVxuICAgIGFkZENhcmQoY2FyZCl7XG4gICAgICAgIGxldCBudW1iZXJPZkNhcmRzTm93PXRoaXMubnVtYmVyT2ZDYXJkcztcbiAgICAgICAgIC8vIGlmIHRoZSBmbGFnIG9mIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBibGluZCBpcyBzZXQsIHByZXNldCB0aGUgXG4gICAgICAgIGNhcmQuaG9sZGVyPXRoaXM7IC8vIG1vdmUgdGhlIGNhcmQgdG8gdGhpcyB0cmljayBieSBzZXR0aW5nIHRoZSBob2xkZXIgcHJvcGVydHkgKHdpbGwgdGFrZSBjYXJlIG9mIGFkZGluZy9yZW1vdmluZyB0aGUgY2FyZClcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogc2hvdWxkIGNvbnNpZGVyIHJldHVybmluZyBhbiBFcnJvciBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yXG4gICAgICAgIGlmKHRoaXMubnVtYmVyT2ZDYXJkczw9bnVtYmVyT2ZDYXJkc05vdylcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWRkIHRoZSBjYXJkIHRvIHRoZSB0cmljay5cIik7XG4gICAgICAgIC8vIEFTU0VSVCBjYXJkIGFkZGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9MCYmdGhpcy5fdHJ1bXBTdWl0ZTwwKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkJVRzogQXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkLCBidXQgcGxheWluZyBhIGdhbWUgd2l0aG91dCB0cnVtcC5cIik7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciBibGluZCBldmVyeW9uZSBoYXMgdG8gcGxheSB0aGUgcGFydG5lciBjYXJkIHN1aXRlXG4gICAgICAgIC8vIE1ESEAwOURFQzIwMTk6IE9PUFMgSSB3YXMgYWxyZWFkeSB1c2luZyB0aGlzLl9wYXJ0bmVyU3VpdGUgaGVyZSBCVVQgc3RpbGwgYWZ0ZXIgYWN0dWFsbHkgdGFraW5nIGl0IG91dCAobm93IGluIGFnYWluKVxuICAgICAgICBpZih0aGlzLl9wbGF5U3VpdGU8MCl7IC8vIGZpcnN0IGNhcmQgYmVpbmcgcGxheWVkXG4gICAgICAgICAgICAvLyBNREhAMThKQU4yMDIwOiBhc2NlcnRhaW4gdGhhdCBfYXNraW5nRm9yUGFydG5lckNhcmQgaGFzIHRoZSByaWdodCB2YWx1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgaXQgY291bGQgYmUgMCBidXQgd2hlbiB0aGUgcGFydG5lciBzdWl0ZSBpcyBwbGF5ZWQgdGhlIHBsYXllciBJUyBhc2tpbmdcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkIT09MCl7IC8vIHBsYXllciBzdXBwb3NlZGx5IGNhbiBzdGlsbCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmRcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZDw9MCYmY2FyZC5zdWl0ZT09PXRoaXMuX3BhcnRuZXJTdWl0ZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkPDApdGhyb3cgbmV3IEVycm9yKFwiQlVHOiBDYW5ub3QgYXNrIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIkltcGxpY2l0bHkgYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJ5IHBsYXlpbmcgdGhlIHBhcnRuZXIgc3VpdGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT09MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkNhbm5vdCBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgd2hlbiB5b3UgY2FuJ3QgYXNrIGZvciBpdCBhbnltb3JlIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BsYXlTdWl0ZT0odGhpcy5fYXNraW5nRm9yUGFydG5lckNhcmQ8MD90aGlzLl9wYXJ0bmVyU3VpdGU6Y2FyZC5zdWl0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQVNTRVJUIHRoaXMuX3BsYXlTdWl0ZSBub3cgZGVmaW5pdGVseSBub24tbmVnYXRpdmUsIHNvXG4gICAgICAgIHRoaXMuX2NhbkFza0ZvclBhcnRuZXJDYXJkPTA7IC8vIHVzZSB0aGUgcmlnaHQgcHJvcGVydHkgYnJvJ1xuICAgICAgICAvLyB1cGRhdGUgd2lubmVyXG4gICAgICAgIGlmKG51bWJlck9mQ2FyZHNOb3c+MCl7XG4gICAgICAgICAgICAvLyBNREhAMDlERUMyMDE5OiB3aGVuIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBvbmx5IHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGV2ZXIgd2luIChldmVuIGlmIHRoZXJlJ3MgdHJ1bXAhISlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJ1dCB3ZSBuZWVkIHRvIGtub3cgd2hldGhlciB0aGUgcGFydG5lciBjYXJkIHdhcyBhbHJlYWR5IHRocm93blxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgU09MVVRJT046IChORUFUKSBpdCdzIGVhc2llc3QgdG8gc2ltcGx5IGlnbm9yZSB0cnVtcCBpcyB0aGUgcGFydG5lciBjYXJkIGlzIGJlaW5nIGFza2VkIGZvciEhISEhIVxuICAgICAgICAgICAgaWYoQ2FyZC5jb21wYXJlQ2FyZHNXaXRoUGxheUFuZFRydW1wU3VpdGUoY2FyZCx0aGlzLl9jYXJkc1t0aGlzLl93aW5uZXJDYXJkXSx0aGlzLl9wbGF5U3VpdGUsKHRoaXMuX2Fza2luZ0ZvclBhcnRuZXJDYXJkIT0wPy0xOnRoaXMuX3RydW1wU3VpdGUpKT4wKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQobnVtYmVyT2ZDYXJkc05vdyk7XG4gICAgICAgIH1lbHNlIC8vIGFmdGVyIHRoZSBmaXJzdCBjYXJkIHRoZSBmaXJzdCBwbGF5ZXIgaXMgdGhlIHdpbm5lciBvZiBjb3Vyc2VcbiAgICAgICAgICAgIHRoaXMuX3NldFdpbm5lckNhcmQoMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRDYXJkUGxheWVyKHN1aXRlLHJhbmspe1xuICAgICAgICBmb3IobGV0IGNhcmRJbmRleD0wO2NhcmRJbmRleDx0aGlzLl9jYXJkcy5sZW5ndGg7Y2FyZEluZGV4KyspXG4gICAgICAgICAgICBpZih0aGlzLl9jYXJkc1tjYXJkSW5kZXhdLnN1aXRlPT09c3VpdGUmJnRoaXMuX2NhcmRzW2NhcmRJbmRleF0ucmFuaz09PXJhbmspXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9maXJzdFBsYXllcitjYXJkSW5kZXgpJTQ7IC8vIFRPRE8gY2FuIHdlIGFzc3VtZSA0IHBsYXllcnMgaW4gdG90YWw/Pz8/P1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGdldHRlcnNcbiAgICBnZXQgcGxheVN1aXRlKCl7cmV0dXJuIHRoaXMuX3BsYXlTdWl0ZTt9XG4gICAgZ2V0IGZpcnN0UGxheWVyKCl7cmV0dXJuIHRoaXMuX2ZpcnN0UGxheWVyO31cblxuICAgIC8qXG4gICAgZ2V0IHRydW1wU3VpdGUoKXtyZXR1cm4gdGhpcy5fdHJ1bXBTdWl0ZTt9XG4gICAgKi9cbiAgICBnZXQgY2FuQXNrRm9yUGFydG5lckNhcmQoKXtyZXR1cm4gdGhpcy5fY2FuQXNrRm9yUGFydG5lckNhcmQ7fVxufVxuXG5tb2R1bGUuZXhwb3J0cz1UcmljaztcbiIsIi8qKlxuICogdGhlIHBhcnQgdGhhdCBydW5zIGluIHRoZSBicm93c2VyIG9mIGEgc2luZ2xlIHBsYXllclxuICogZ2l2ZW4gdGhhdCBhbnkgaW5mb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgcGxheWVyIG9mIHRoZSBnYW1lIHNob3VsZCBiZSBhdmFpbGFibGUgdGhyb3VnaCBpdCdzIF9nYW1lIHByb3BlcnR5IChpLmUuIGEgUGxheWVyR2FtZSBpbnN0YW5jZSlcbiAqIGFsbCBjYWxscyBpbiBtYWluLmpzIHRvIHJpa2tlblRoZUdhbWUgZGlyZWN0bHkgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggY2FsbHMgdG8gY3VycmVudFBsYXllci5nYW1lIGkuZS4gcmlra2VuVGhlR2FtZSBpdHNlbGYgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSB0byB0aGUgY3VycmVudFBsYXllciEhIVxuICogXG4qKi9cbi8vIHdlJ2xsIGJlIHVzaW5nIFBsYXllci5qcyBvbmx5IChQbGF5ZXIuanMgd2lsbCBkZWFsIHdpdGggcmVxdWlyaW5nIENhcmRIb2xkZXIsIGFuZCBDYXJkSG9sZGVyIENhcmQpXG4vLyBOTyBJIG5lZWQgdG8gcmVxdWlyZSB0aGVtIGFsbCBvdGhlcndpc2UgYnJvd3NlcmlmeSB3b24ndCBiZSBhYmxlIHRvIGZpbmQgQ2FyZCwgZXRjLlxuY29uc3QgQ2FyZD1yZXF1aXJlKCcuL0NhcmQuanMnKTtcbmNvbnN0IHtDYXJkSG9sZGVyLEhvbGRhYmxlQ2FyZH09cmVxdWlyZSgnLi9DYXJkSG9sZGVyLmpzJyk7XG5jb25zdCBUcmljaz1yZXF1aXJlKCcuL1RyaWNrLmpzJyk7IC8vIG5vdyBpbiBzZXBhcmF0ZSBmaWxlXG5jb25zdCB7UGxheWVyRXZlbnRMaXN0ZW5lcixQbGF5ZXJHYW1lLFBsYXllcn09cmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcblxuY29uc3QgTGFuZ3VhZ2U9cmVxdWlyZSgnLi9MYW5ndWFnZS5qcycpO1xuLyogcmVwbGFjaW5nOlxuY2xhc3MgTGFuZ3VhZ2V7XG4gICAgc3RhdGljIGdldCBERUZBVUxUX1BMQVlFUlMoKXtyZXR1cm4gW1tcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCJdLFtcIk1hcmNcIixcIkp1cmdlblwiLFwiTW9uaWthXCIsXCJBbm5hXCIsXCJcIl1dO307XG4gICAgLy8gcG9zc2libGUgcmFua3MgYW5kIHN1aXRlcyAoaW4gRHV0Y2gpXG4gICAgc3RhdGljIGdldCBEVVRDSF9SQU5LX05BTUVTKCl7cmV0dXJuIFtcInR3ZWVcIixcImRyaWVcIixcInZpZXJcIixcInZpamZcIixcInplc1wiLFwiemV2ZW5cIixcImFjaHRcIixcIm5lZ2VuXCIsXCJ0aWVuXCIsXCJib2VyXCIsXCJ2cm91d1wiLFwiaGVlclwiLFwiYWFzXCJdO307XG4gICAgc3RhdGljIGdldCBEVVRDSF9TVUlURV9OQU1FUygpe3JldHVybiBbXCJydWl0ZW5cIixcImtsYXZlcmVuXCIsXCJoYXJ0ZW5cIixcInNjaG9wcGVuXCJdO307XG59XG4qL1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cil7cmV0dXJuKHN0cj8oc3RyLmxlbmd0aD9zdHJbMF0udG9VcHBlckNhc2UoKStzdHIuc2xpY2UoMSk6XCJcIik6XCI/XCIpO31cblxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZUcmlja3NXb25UZXh0KGNvdW50KXtcbiAgICBpZihjb3VudD09PS0yKXJldHVybiBcIj9cIjtcbiAgICBpZihjb3VudDwwKXJldHVybiBcIm9uYmVrZW5kXCI7XG4gICAgaWYoY291bnQ+MTMpcmV0dXJuIFwib25tb2dlbGlqa1wiO1xuICAgIHJldHVybltcImdlZW5cIixcImVlblwiLFwidHdlZVwiLFwiZHJpZVwiLFwidmllclwiLFwidmlqZlwiLFwiemVzXCIsXCJ6ZXZlblwiLFwiYWNodFwiLFwibmVnZW5cIixcInRpZW5cIixcImVsZlwiLFwidHdhYWxmXCIsXCJhbGxlbWFhbFwiXVtjb3VudF07XG59XG5cbmZ1bmN0aW9uIGJ1ZyhidWcpe1xuICAgIGFsZXJ0KFwiRXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogXCIrYnVnK1wiLlxcblJhcHBvcnRlZXIgZGV6ZSBmb3V0LCBlbiBicmVlayBoZXQgc3BlbCBhZi5cIik7XG59XG5cbmNvbnN0IFZJU0lCTEU9XCJpbmhlcml0XCI7IC8vIE1ESEAwM0ZFQjIwMjA6IGlmIHdlJ2QgdXNlIHZpc2libGUsIGl0IHdvdWxkIGlnbm9yZSB3aGF0IHRoZSBwYXJlbnQncyB2aXNpYmlsaXR5IGlzLCBhbmQga2VlcCBzaG93aW5nLi4uXG5cbi8vIE1ESEAwN0pBTjIwMjA6IGFkZGluZyBlbnRlcmluZyB0aGUgaWQgb2YgdGhlIHVzZXIgb24gcGFnZS1zZXR0aW5ncywgc28gd2UgZG8gbm90IG5lZWQgdG8gaW5zZXJ0IGEgbmV3IG9uZVxuLy8gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVseSB3ZSBjYW4gZG8gdGhhdCBvbiBhIHNlcGFyYXRlIHBhZ2UgLyBwYWdlLWF1dGggaXMgT0tcbi8vICAgICAgICAgICAgICAgIHdlIGdvIHRvIHBhZ2UtYXV0aCB3aGVuIE5PVCBwbGF5aW5nIHRoZSBnYW1lIGluIGRlbW8gbW9kZSEhIVxuLy8gICAgICAgICAgICAgICAgaW4gbm9uLWRlbW8gbW9kZSB5b3UgaWRlbnRpZnkgeW91cnNlbGYsIHRoZW4gd2hlbiBzZXRQbGF5ZXJOYW1lIGlzIHN1Y2Nlc3NmdWwgZ28gdG8gcGFnZS13YWl0LWZvci1wbGF5ZXJzXG4vLyBNREhAMTBKQU4yMDIwOiByZW1vdmluZyBwYWdlLXNldHRpbmdzIGFuZCBwYWdlLXNldHVwLWdhbWUsIGFkZGluZyBwYWdlLWhlbHBcbmNvbnN0IFBBR0VTPVtcInBhZ2UtcnVsZXNcIixcInBhZ2UtaGVscFwiLFwicGFnZS1hdXRoXCIsXCJwYWdlLXdhaXQtZm9yLXBsYXllcnNcIixcInBhZ2UtYmlkZGluZ1wiLFwicGFnZS10cnVtcC1jaG9vc2luZ1wiLFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIsXCJwYWdlLXBsYXktcmVwb3J0aW5nXCIsXCJwYWdlLXBsYXlpbmdcIixcInBhZ2UtZmluaXNoZWRcIl07XG5cbnZhciBjdXJyZW50UGFnZT1udWxsOyAvLyBsZXQncyBhc3N1bWUgdG8gYmUgc3RhcnRpbmcgYXQgcGFnZS1ydWxlc1xudmFyIHZpc2l0ZWRQYWdlcz1bXTsgLy8gbm8gcGFnZXMgdmlzaXRlZCB5ZXRcblxudmFyIGN1cnJlbnRQbGF5ZXI9bnVsbDsgLy8gdGhlIGN1cnJlbnQgZ2FtZSBwbGF5ZXJcblxudmFyIGN1cnJlbnRHYW1lPW51bGw7IC8vIHdlIHJlbWVtYmVyIHRoZSBnYW1lIHVudGlsIHdlIG5vIGxvbmdlciBuZWVkIGl0XG5cbnZhciBvbkV4aXRIYW5kbGVyPW51bGw7IC8vIHRoZSBvbiBleGl0IGhhbmRsZXIgc3VwcGxpZWQgYnkgY2FsbGVyIG9mIHNldFBsYXllck5hbWUoKSAobnVsbCB3aGVuIHJ1bm5pbmcgJ3N0YW5kYWxvbmUnKVxuXG4vLyBNREhAMDZGRUIyMDIwOiBhcyB3ZSdyZSBzZW5kaW5nIHdpdGggYWNrbm93bGVkZ2luZyB3ZSBjYW4ga2VlcCB0cmFjayBvZiB0aGUgcmVzcG9uc2UgdGltZSBvZiB0aGUgc2VydmVyIHRvIHVzZSB3aGVuIGV4aXRpbmcgdGhlIGdhbWVcbmNsYXNzIFNlcnZlclJlc3BvbnNlU3RhdHN7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fbWluaW11bVJlc3BvbnNlTXM9bnVsbDtcbiAgICAgICAgdGhpcy5fbWF4aW11bVJlc3BvbnNlTXM9bnVsbDtcbiAgICAgICAgdGhpcy5fbGFzdFJlc3BvbnNlTXM9bnVsbDtcbiAgICB9XG4gICAgZ2V0IG1pbmltdW1SZXNwb25zZU1zKCl7cmV0dXJuIHRoaXMuX21pbmltdW1SZXNwb25zZU1zO31cbiAgICBnZXQgbWF4aW11bVJlc3BvbnNlTXMoKXtyZXR1cm4gdGhpcy5fbWF4aW11bVJlc3BvbnNlTXM7fVxuICAgIGdldCBsYXN0UmVzcG9uc2VNcygpe3JldHVybiB0aGlzLl9sYXN0UmVzcG9uc2VNczt9XG4gICAgYWRkKHJlc3BvbnNlTXMpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqIEFkZGluZyBzZXJ2ZXIgcmVzcG9uc2UgdGltZSBcIityZXNwb25zZU1zK1wiLlwiKTtcbiAgICAgICAgdGhpcy5fbGFzdFJlc3BvbnNlTXM9cmVzcG9uc2VNcztcbiAgICAgICAgaWYoIXRoaXMuX21heGltdW1SZXNwb25zZU1zfHx0aGlzLl9sYXN0UmVzcG9uc2VNcz50aGlzLl9tYXhpbXVtUmVzcG9uc2VNcyl0aGlzLl9tYXhpbXVtUmVzcG9uc2VNcz10aGlzLl9sYXN0UmVzcG9uc2VNcztcbiAgICAgICAgaWYoIXRoaXMuX21pbmltdW1SZXNwb25zZU1zfHx0aGlzLl9sYXN0UmVzcG9uc2VNczx0aGlzLl9taW5pbXVtUmVzcG9uc2VNcyl0aGlzLl9taW5pbXVtUmVzcG9uc2VNcz10aGlzLl9sYXN0UmVzcG9uc2VNcztcbiAgICB9XG59XG52YXIgc2VydmVyUmVzcG9uc2VTdGF0cz1uZXcgU2VydmVyUmVzcG9uc2VTdGF0cygpO1xuZnVuY3Rpb24gc2VuZFRvU2VydmVyKHNvY2tldCxldmVudCxkYXRhLGNhbGxiYWNrKXtcbiAgICBsZXQgc2VuZFRvU2VydmVyVGltZU1zPXdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICBzb2NrZXQuZW1pdChldmVudCxkYXRhLChyZXNwb25zZSk9PntcbiAgICAgICAgc2VydmVyUmVzcG9uc2VTdGF0cy5hZGQod2luZG93LnBlcmZvcm1hbmNlLm5vdygpLXNlbmRUb1NlcnZlclRpbWVNcyk7IC8vIHJlbWVtYmVyIGhvdyBsb25nIGFja25vd2xlZGdpbmcgdG9va1xuICAgICAgICBpZih0eXBlb2YgY2FsbGJhY2s9PT0nZnVuY3Rpb24nKWNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gTURIQDA3RkVCMjAyMDogd2hlbiBpbiB0aGUgcHJvY2VzcyBvZiBcbmZ1bmN0aW9uIHVwZGF0ZUdhbWVPdmVyQnV0dG9ucyhlbmFibGUpe1xuICAgIGZvcihsZXQgc3RvcEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdG9wJykpc3RvcEJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlO1xuICAgIGZvcihsZXQgbmV3R2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmV3LWdhbWVcIikpbmV3R2FtZUJ1dHRvbi5kaXNhYmxlZD0hZW5hYmxlO1xufVxuXG4vLyBNREhAMDVGRUIyMDIwOiBpZiBzb21lYm9keSB3YW50cyB0byBzdG9wIHBsYXlpbmcgY29tcGxldGVseSwgKHMpaGUgd2FudHMgdG8gYmUgY29tcGxldGVseSBmb3Jnb3R0ZW5cbi8vICAgICAgICAgICAgICAgIHNldFBsYXllck5hbWUoKSBcbmZ1bmN0aW9uIHN0b3BCdXR0b25DbGlja2VkKCl7XG4gICAgaWYoIWN1cnJlbnRQbGF5ZXIpcmV0dXJuIGFsZXJ0KFwiSGVsYWFzIGtlbm5lbiB3ZSBqZSBuaWV0LCBkdXMgamUgenVsdCBuaWV0IGt1bm5lbiBzcGVsZW4hXCIpO1xuICAgIHVwZGF0ZUdhbWVPdmVyQnV0dG9ucyhmYWxzZSk7IC8vIGRpc2FibGUgdGhlIGdhbWUgb3ZlciBidXR0b25zXG4gICAgX3NldFBsYXllcihudWxsKTsgLy8ga2lsbGluZyB0aGUgcGxheWVyIHNob3VsZCBkbyB0aGUgcmVzdCEhISEhXG4gICAgLyogTURIQDA1RkVCMjAyMCByZXBsYWNpbmc6IFxuICAgIC8vIEFTU0VSVCBhc3N1bWluZyBub3QgcGxheWluZyBpbiBhIGdhbWUgYW55bW9yZSBpLmUuIG5ld0dhbWUoKSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlXG4gICAgLy8gYSBOT1JNQUwgZXhpdFxuICAgIGlmKCFjdXJyZW50UGxheWVyKXJldHVybiBhbGVydChcIkplIGJlbnQgYWwgYWZnZW1lbGQhXCIpO1xuICAgIGN1cnJlbnRQbGF5ZXIuZXhpdCgnU1RPUCcpOyAvLyBNREhAMDVGRUIyMDIwOiBUT0RPIGNoZWNrIHdoZXRoZXIgZG9pbmcgdGhpcyB0cnVlbHkga2lsbHMgdGhlIHBsYXllciBhdCB0aGUgb3RoZXIgZW5kISEhXG4gICAgLy8ga2lsbCB0aGUgJ2hpc3RvcnknLCBwcmV0ZW5kIHRvIG5ldmVyIGhhdmUgYmVlbiBoZXJlLCBhbmQgc2hvdyB0aGUgaGVscCBwYWdlIChmcm9tIHdoZXJlIGEgcGVyc29uIGNhbiBzdGFydCBhZ2FpbilcbiAgICB2aXNpdGVkUGFnZXM9W107Y3VycmVudFBhZ2U9bnVsbDtzaG93SGVscCgpO1xuICAgIC8vICdtYW51YWxseScgbW92ZSB0byB0aGUgcHJldmlvdXMgJ3BhZ2UnIGluIHRoZSBoaXN0b3J5Li4uXG4gICAgY29uc29sZS5sb2coXCJMZW5ndGggb2YgaGlzdG9yeTogXCIsd2luZG93Lmhpc3RvcnkubGVuZ3RoKTtcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgKi9cbn1cbi8vIE1ESEAxMEpBTjIwMjA6IG5ld0dhbWUoKSBpcyBhIGJpZCBkaWZmZXJlbnQgdGhhbiBpbiB0aGUgZGVtbyB2ZXJzaW9uIGluIHRoYXQgd2UgcmV0dXJuIHRvIHRoZSB3YWl0aW5nLXBhZ2VcbmZ1bmN0aW9uIG5ld0dhbWVCdXR0b25DbGlja2VkKCl7XG4gICAgLy8gbWVhbnM6IGRvIG5vdCBmb3JnZXQgYWJvdXQgbWUgcGxheWluZyBpLmUuIGtlZXAgbWUgb24gdGhlIGdhbWVwbGF5aW5nIHBhZ2VcbiAgICAvLyBNREhAMDVGRUIyMDIwOiBpdCdzIHBydWRlbnQgdG8gc3RhcnQgY29tcGxldGVseSBvdmVyIHdpdGggYSBuZXcgcGxheWVyIHdpdGggdGhlIHNhbWUgbmFtZSEhISFcbiAgICBpZighY3VycmVudFBsYXllcilyZXR1cm4gYWxlcnQoXCJIZWxhYXMga2VubmVuIHdlIGplIG5pZXQsIGR1cyBqZSB6dWx0IG5pZXQga3VubmVuIHNwZWxlbiFcIik7XG4gICAgdXBkYXRlR2FtZU92ZXJCdXR0b25zKGZhbHNlKTsgLy8gZGlzYWJsZSB0aGUgZ2FtZSBvdmVyIGJ1dHRvbnNcbiAgICBzZXRQbGF5ZXJOYW1lKGN1cnJlbnRQbGF5ZXIubmFtZSk7XG59XG5cbnZhciB0b01ha2VBQmlkPTAsYmlkTWFkZT0tMTsgLy8gTURIQDAzRkVCMjAyMDogc29tZSBwcm90ZWN0aW9uIGZvciBwcmV2ZW50aW5nIG1ha2luZyBhIGJpZCB3aGVuIG5vdCBiZWluZyBhc2tlZCBvciBhZnRlciBoYXZpbmcgbWFkZSBhIGJpZFxudmFyIHRvUGxheUFDYXJkPTAscGxheWVkQ2FyZEluZm89bnVsbDsgLy8gTURIQDA1RkVCMjAyMDogdGhlIGNhcmQgcGxheWVkIHRoYXQgbmVlZHMgdG8gYmUgcmVtZW1iZXJlZCBzbyB3ZSBjYW4gc2VuZCBpdCBhZ2FpblxudmFyIHRvQ2hvb3NlVHJ1bXBTdWl0ZT0wLGNob3NlblRydW1wU3VpdGU9LTE7XG52YXIgdG9DaG9vc2VQYXJ0bmVyU3VpdGU9MCxjaG9zZW5QYXJ0bmVyU3VpdGU9LTE7XG5cbmZ1bmN0aW9uIGdldExvY2FsZUNhcmRUZXh0KGNhcmQpe3JldHVybiBMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1tjYXJkLnN1aXRlXStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2NhcmQucmFua107fVxuXG4vLyBNREhAMjlKQU4yMDIwOiBkZWNpZGluZyB0byBhbHdheXMgc2hvdyB0aGUgdXNlciBuYW1lIGluIHRoZSBkb2N1bWVudCB0aXRsZSwgYW5kIHRvIGJsaW5rIGl0IHdoZW5cbi8vICAgICAgICAgICAgICAgIHVzZXIgaW5wdXQgaXMgcmVxdWlyZWRcbnZhciBmb3JjZUZvY3VzSWQ9bnVsbDtcbnZhciBmb3JjZUZvY3VzVGV4dD1udWxsO1xuZnVuY3Rpb24gc3RvcEZvcmNlRm9jdXMoKXtjbGVhckludGVydmFsKGZvcmNlRm9jdXNJZCk7Zm9yY2VGb2N1c0lkPW51bGw7fVxuZnVuY3Rpb24gY2hlY2tGb2N1cyhzdGF0ZSl7XG4gICAgLy8gTURIQDIzSkFOMjAyMDogd2Ugc2hvdWxkIGtlZXAgYmxpbmtpbmcgd2hlbiBub3QgaW4gZm9jdXMgdW50aWwgZm9yY2VkIHRvIHN0b3BcbiAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHN0b3BwaW5nIHdoZW4gdGhlIGZvY3VzIHdhcyBnb3RcbiAgICAvLyBNREhAMjlKQU4yMDIwIHJlbW92aW5nIHRoaXMgc2hvdWxkIHN1ZmZpY2U6IGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpc2hvd0dhbWVTdGF0ZShzdGF0ZSk7ZWxzZSBcbiAgICAvLy8vLy8vLyB0b2dnbGVHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpO1xuICAgIGlmKGRvY3VtZW50Lmhhc0ZvY3VzKCkpe3Nob3dHYW1lU3RhdGUoc3RhdGUpO3N0b3BGb3JjZUZvY3VzKCk7fWVsc2UgdG9nZ2xlR2FtZVN0YXRlKHN0YXRlKTtcbn1cbmZ1bmN0aW9uIGZvcmNlRm9jdXMoc3RhdGUpe1xuICAgIC8vIGlmKHN0YXRlKVxuICAgIGZvcmNlRm9jdXNUZXh0PXN0YXRlO1xuICAgIHNob3dHYW1lU3RhdGUoZm9yY2VGb2N1c1RleHQpOyAvLyBhc2NlcnRhaW4gdG8gc3RhcnQgd2l0aCB0aGUgZ2l2ZW4gbm9uLW51bGwgJ3N0YXRlJ1xuICAgIGlmKHN0YXRlKXsgLy8gZm9jdXMgcmVxdWVzdGVkXG4gICAgICAgIC8vIHN0YXJ0IGdldHRpbmcgdGhlIGZvY3VzIGJ5IGJsaW5raW5nICdzdGF0ZScgSUZGIHdlIGhhdmVuJ3QgZ290IGl0IHlldC4uLlxuICAgICAgICBpZighZm9yY2VGb2N1c0lkKWZvcmNlRm9jdXNJZD1zZXRJbnRlcnZhbCgoKT0+e2NoZWNrRm9jdXMoc3RhdGUpfSw1MDApO1xuICAgIH1lbHNleyAvLyBlbmQgb2YgZm9jdXMgcmVxdWVzdFxuICAgICAgICBpZihmb3JjZUZvY3VzSWQpc3RvcEZvcmNlRm9jdXMoKTtcbiAgICB9XG59XG5cbi8vIE1ESEAzMUpBTjIwMjA6IGtlZXAgYSAnc3RhdGUnIHdoaWNoIHdpbGwgZGV0ZXJtaW5lIHdoYXQgbWVzc2FnZXMgdGhlIHBsYXllciBjYW4gc2VuZCBvdmVyIHRvIHRoZSBzZXJ2ZXJcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU9MDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX0JJRD0xO1xuY29uc3QgUExBWUVSU1RBVEVfQklEPTIsUExBWUVSU1RBVEVfQklEX0RPTkU9MyxQTEFZRVJTVEFURV9CSURfUkVDRUlWRUQ9NDtcbmNvbnN0IFBMQVlFUlNUQVRFX1dBSVRfRk9SX1BMQVk9NTtcbmNvbnN0IFBMQVlFUlNUQVRFX1RSVU1QPTYsUExBWUVSU1RBVEVfVFJVTVBfRE9ORT03LFBMQVlFUlNUQVRFX1RSVU1QX1JFQ0VJVkVEPTg7XG5jb25zdCBQTEFZRVJTVEFURV9QQVJUTkVSPTksUExBWUVSU1RBVEVfUEFSVE5FUl9ET05FPTEwLFBMQVlFUlNUQVRFX1BBUlRORVJfUkVDRUlWRUQ9MTE7XG5jb25zdCBQTEFZRVJTVEFURV9XQUlUX0ZPUl9DQVJEPTEyO1xuY29uc3QgUExBWUVSU1RBVEVfQ0FSRD0xMyxQTEFZRVJTVEFURV9DQVJEX1BMQVlFRD0xNCxQTEFZRVJTVEFURV9DQVJEX1JFQ0VJVkVEPTE1O1xuY29uc3QgUExBWUVSU1RBVEVfR0FNRV9PVkVSPTE2O1xuY29uc3QgUExBWUVSU1RBVEVfV0FJVF9GT1JfQ0FSRFM9MTcsUExBWUVSU1RBVEVfR0FNRV9SRUNFSVZFRD0xOCxQTEFZRVJTVEFURV9DQVJEU19SRUNFSVZFRD0xOTtcbi8vIE1ESEAwMUZFQjIwMjA6IHdlJ3JlIE5PVCBhbGxvd2luZyB0byByZXNlbmQgdGhlIGNhcmQgcGxheWVkIGJlY2F1c2UgdGhhdCdzIGFscmVhZHkgZG9uZSAoZXZlcnkgMTAgc2Vjb25kcykgYnkgXG5jb25zdCBwbGF5ZXJTdGF0ZU1lc3NhZ2VzPVtcIklrIHdhY2h0IG9wIGVlbiBzcGVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGJvZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTW9tZW50amUgbm9nXCIsXCJCb2QgYWwgdmVyc3R1dXJkXCIsXCJCb2Qgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiTGF0ZW4gd2Ugc3BlbGVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIlRyb2Vma2xldXIgYWwgZ2Vrb3plblwiLFwiVHJvZWZrbGV1ciBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcIk1vbWVudGplIG5vZ1wiLFwiUGFydG5lciBhbCBnZWtvemVuXCIsXCJLbGV1ciBwYXJ0bmVya2FhcnQgb250dmFuZ2VuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLFwiSWsgd2FjaHQgb3AgZWVuIGthYXJ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJNb21lbnRqZSBub2dcIixcIkthYXJ0IGFsIGdlc3BlZWxkXCIsXCJLYWFydCBvbnR2YW5nZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAsXCJCZWRhbmt0IHZvb3IgaGV0IHNwZWxlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxcIklrIHdhY2h0IG9wIGthYXJ0ZW5cIixcIlNwZWwgYmVnb25uZW5cIixcIkJlZGFua3Qgdm9vciBkZSBrYWFydGVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF07XG52YXIgY3VycmVudFBsYXllclN0YXRlPVBMQVlFUlNUQVRFX1dBSVRfRk9SX0dBTUU7XG5cbnZhciBzZW5kTWVzc2FnZVRleHQ7XG5mdW5jdGlvbiBzZW5kTWVzc2FnZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBpZihjdXJyZW50R2FtZSYmY3VycmVudEdhbWUuX3NvY2tldCl7XG4gICAgICAgIC8vIGRvbid0IHNlbmQgYW55IHRleHQgaWYgc2VuZGluZyB0aGUgZGVmYXVsdCB0ZXh0XG4gICAgICAgIGxldCB0ZXh0VG9TZW5kPShzZW5kTWVzc2FnZVRleHQudmFsdWUhPT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0/c2VuZE1lc3NhZ2VUZXh0LnZhbHVlOicnKTtcbiAgICAgICAgLy8gaWYgbm8gdGV4dCBlbnRlcmVkIHRvIGJlIHNlbnQsIGFzayBwbGF5ZXIgd2hldGhlclxuICAgICAgICBpZih0ZXh0VG9TZW5kLnRyaW0oKS5sZW5ndGg9PT0wJiYhcHJvbXB0KFwiRXIgaXMgZ2VlbiB0ZSB2ZXJzdHVyZW4gdGVrc3QuIFdpbHQgVSB0b2NoIHZlcnN0dXJlbj9cIikpcmV0dXJuO1xuICAgICAgICBzZXRJbmZvKFwiP1wiLFwiSmlqXCIpO1xuICAgICAgICAvLyBNREhAMDZGRUIyMDIwOiBOT1QgdXNpbmcgc2VuZFRvU2VydmVyIGhlcmUgYmVjYXVzZSBub3Qgc3VyZSBpZiBzZW5kVG9TZXJ2ZXIgaXMgcmUtZW50cmFudCEhISFcbiAgICAgICAgY3VycmVudEdhbWUuX3NvY2tldC5lbWl0KCdQTEFZRVJfU0FZUycseydzdGF0ZSc6Y3VycmVudFBsYXllclN0YXRlLCd0ZXh0Jzp0ZXh0VG9TZW5kfSwocmVzcG9uc2UpPT57XG4gICAgICAgICAgICBzZXRJbmZvKHJlc3BvbnNlJiZyZXNwb25zZS5sZW5ndGg+MD9yZXNwb25zZTpcIkJlcmljaHQgb250dmFuZ2VuLCBtYWFyIGdlZW4gYW50d29vcmQgZ2VzdHV1cmQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAvLyBpZiB0aGUgbWVzc2FnZSB0ZXh0IGRpZmZlcmVkIGZyb20gdGhlIGRlZmF1bHQgbWVzc2FnZSB3ZSBjbGVhciB0aGUgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBpZihzZW5kTWVzc2FnZVRleHQudmFsdWUhPT1wbGF5ZXJTdGF0ZU1lc3NhZ2VzW2N1cnJlbnRQbGF5ZXJTdGF0ZV0pc2VuZE1lc3NhZ2VUZXh0LnZhbHVlPScnO1xuICAgICAgICB9KTtcbiAgICB9ZWxzZVxuICAgICAgICBhbGVydChcIkplIGJlbnQgYmxpamtiYWFyIGdlc3RvcHQgbWV0IHNwZWxlbiEgT20gd2VlciB0ZSBrdW5uZW4gc3BlbGVuIG1vZXQgamUgZGUgcGFnaW5hIG9wbmlldXcgbGFkZW4hXCIpO1xufVxuZnVuY3Rpb24gc2V0UGxheWVyU3RhdGUocGxheWVyU3RhdGUpe1xuICAgIC8vaWYocmVzZW5kRXZlbnRJZCl7Y2xlYXJUaW1lb3V0KHJlc2VuZEV2ZW50SWQpO3Jlc2VuZEV2ZW50SWQ9bnVsbDt9IC8vIGdldCByaWQgb2YgYW55IHBlbmRpbmcgcmVzZW5kIGV2ZW50IHRpbWVvdXRcbiAgICBsZXQgcmVwbGFjZU1lc3NhZ2VUZXh0PShzZW5kTWVzc2FnZVRleHQudmFsdWUubGVuZ3RoPT09MHx8c2VuZE1lc3NhZ2VUZXh0LnZhbHVlPT09cGxheWVyU3RhdGVNZXNzYWdlc1tjdXJyZW50UGxheWVyU3RhdGVdKTsgLy8gdXNlciBoYXNuJ3QgY2hhbmdlZCB0aGUgdGV4dCB0byBzZW5kIG1hbnVhbGx5Li4uXG4gICAgY3VycmVudFBsYXllclN0YXRlPXBsYXllclN0YXRlO1xuICAgIC8vIHNldCB0aGUgbWVzc2FnZSB0ZXh0IG9uIHRoZSBzZW5kIG1lc3NhZ2UgdGV4dCBpbnB1dCBmaWVsZCBhY2NvcmRpbmdseVxuICAgIGlmKHJlcGxhY2VNZXNzYWdlVGV4dClzZW5kTWVzc2FnZVRleHQuaW5uZXJUZXh0PXBsYXllclN0YXRlTWVzc2FnZXNbY3VycmVudFBsYXllclN0YXRlXTtcbiAgICAvKiByZXNlbmRpbmcgYWxyZWFkeSBtYW5hZ2VkIGJ5IHRoZSBnYW1lIChzZWUgY2FyZFBsYXllZCwgYmlkTWFkZSwgdHJ1bXBTdWl0ZUNob3NlbiBhbmQgcGFydG5lclN1aXRlQ2hvc2VuKVxuICAgIHNlbmRNZXNzYWdlQnV0dG9uLmRpc2FibGVkPShzZW5kTWVzc2FnZVRleHQ9PT1cIlN0dXVyIG9wbmlldXdcIik7XG4gICAgLy8gaWYgdGhlIGJ1dHRvbiBpcyBjdXJyZW50bHkgZGlzYWJsZWQgb25seSBhbGxvdyByZXNlbmRpbmcgdGhlIGV2ZW50IGJ1dCBub3QgdW50aWwgYWZ0ZXIgNSBzZWNvbmRzXG4gICAgaWYoc2VuZE1lc3NhZ2VCdXR0b24uZGlzYWJsZWQpcmVzZW5kRXZlbnRJZD1zZXRUaW1lb3V0KGFsbG93UmVzZW5kRXZlbnQsNTAwMCk7IC8vIGFsbG93IHJlc2VuZGluZyBhZnRlciA1IHNlY29uZHNcbiAgICAqL1xufVxuXG4vLyBvZiBjb3Vyc2U6IGZyb20gc3RhY2tvdmVyZmxvdyEhIVxuZnVuY3Rpb24gZGlmZmVyZW5jZShhMSxhMil7dmFyIGEyU2V0PW5ldyBTZXQoYTIpO3JldHVybiBhMS5maWx0ZXIoKHgpPT4hYTJTZXQuaGFzKHgpKTt9XG5cbnZhciBiaWRkZXJDYXJkc0VsZW1lbnQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkZXItY2FyZHNcIik7XG5cbmZ1bmN0aW9uIGhhbmRsZUNvbGxhcHNpbmdFdmVudChldmVudCl7XG4gICAgbGV0IGNvbGxhcHNpbmdCdXR0b249ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb2xsYXBzaW5nQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmUtYnV0dG9uXCIpOyAvLyBhIGhhLCBkaWRuJ3Qga25vdyB0aGlzXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29sbGFwc2luZ0J1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbGxhcHNpYmxlXCIpKS5zdHlsZS5kaXNwbGF5PSh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1idXR0b25cIik/XCJibG9ja1wiOlwibm9uZVwiKTtcbn1cbmZ1bmN0aW9uIGluaXRpYWxpemVDb2xsYXBzaW5nQnV0dG9ucygpe1xuICAgIC8vIE1ESEAwNUZFQjIwMjA6IGF0dGFjaCBldmVudCBoYW5kbGVyIG9uIGNsaWNrIG9mIGV2ZXJ5IGNvbGxhcHNpYmxlIGJ1dHRvbiB0b2dnbGluZ1xuICAgIGZvcihsZXQgY29sbGFwc2luZ0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sbGFwc2luZy1idXR0b25cIikpY29sbGFwc2luZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixoYW5kbGVDb2xsYXBzaW5nRXZlbnQpO1xufVxuXG4vLyBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuLy8gICAgIHZhciB2ID0gZG9jdW1lbnQuY29va2llLm1hdGNoKCcoXnw7KSA/JyArIG5hbWUgKyAnPShbXjtdKikoO3wkKScpO1xuLy8gICAgIHJldHVybiB2ID8gdlsyXSA6IG51bGw7XG4vLyB9XG4vLyBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbi8vICAgICB2YXIgZCA9IG5ldyBEYXRlO1xuLy8gICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDAqZGF5cyk7XG4vLyAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtwYXRoPS87ZXhwaXJlcz1cIiArIGQudG9HTVRTdHJpbmcoKTtcbi8vIH1cbi8vIGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShuYW1lKSB7IHNldENvb2tpZShuYW1lLCAnJywgLTEpOyB9XG5cbi8qKlxuICogc2hvd3MgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWVzIGF0IHRoZSBzdGFydCBvZiB0aGUgZ2FtZVxuICovXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7aWYoIXJpa2tlblRoZUdhbWUpcmV0dXJuO1xuICAgIC8vIHNob3cgdGhlIHBsYXllciBuYW1lcyBpbiB0aGUgYmlkcyB0YWJsZVxuICAgIHNob3dQbGF5ZXJOYW1lc0luQmlkc1RhYmxlKCk7XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBoZWFkZXIgcm93IG9mIHRoZSB0cmlja3MgcGxheWVkIHRhYmxlXG4gICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJpY2tzLXBsYXllZC10YWJsZVwiKSl7XG4gICAgICAgIGxldCB0cmlja3NQbGF5ZWRUYWJsZUhlYWRlcj10cmlja3NQbGF5ZWRUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGhlYWRcIik7XG4gICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGVIZWFkZXIuY2hpbGRyZW5bMF07IC8vIHRoZSByb3cgd2UncmUgaW50ZXJlc3RlZCBpbiBmaWxsaW5nXG4gICAgICAgIGZvcihwbGF5ZXI9MDtwbGF5ZXI8NDtwbGF5ZXIrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bcGxheWVyKzFdOyAvLyB1c2UgcGxheWVyIHRvIGdldCB0aGUgJ3JlYWwnIHBsYXllciBjb2x1bW4hIVxuICAgICAgICAgICAgbGV0IHBsYXllck5hbWU9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllcik6XCI/XCIpOyAvLyBNREhAMDNKQU4yMDIwOiByaWtrZW5UaGVHYW1lIHJlcGxhY2VkIGJ5IGN1cnJlbnRQbGF5ZXIuZ2FtZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOYW1lIG9mIHBsYXllciAjXCIrKHBsYXllcisxKStcIjogJ1wiK3BsYXllck5hbWUrXCInLlwiKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MPXBsYXllck5hbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2hvdyB0aGUgcGxheWVyIG5hbWVzIGluIHRoZSBjYXJkcyBwbGF5ZWQgdGFibGUgYXMgd2VsbFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCsxKSU0KSk7XG4gICAgc2hvd1BsYXllck5hbWUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHBvc2l0ZS1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoKHBsYXllckluZGV4KzIpJTQpKTtcbiAgICBzaG93UGxheWVyTmFtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0aGFuZHNpZGUtcGxheWVyLW5hbWVcIikscmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKChwbGF5ZXJJbmRleCszKSU0KSk7XG59XG5cbi8vIHdoZW5ldmVyIHRoZSBwbGF5ZXIgY2hhbmdlcywgc2hvdyB0aGUgcGxheWVyIG5hbWVcbmZ1bmN0aW9uIHNob3dDdXJyZW50UGxheWVyTmFtZSgpe1xuICAgIC8vIHNob3dHYW1lU3RhdGUoY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLm5hbWU6bnVsbCk7IC8vIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgaW1tZWRpYXRlbHkgaW4gdGhlIHRpdGxlXG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWVcIikpXG4gICAgICAgIGlmKHBsYXllck5hbWVFbGVtZW50KVxuICAgICAgICAgICAgcGxheWVyTmFtZUVsZW1lbnQuaW5uZXJIVE1MPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIj9cIik7XG59XG5cbi8qKlxuICogdXBkYXRlcyB0aGUgd2FpdGluZy1mb3ItcGxheWVycyBwYWdlXG4gKiBkZXBlbmRpbmcgb24gd2hldGhlciBvciBub3QgYSBnYW1lIGlzIGJlaW5nIHBsYXllZCAoeWV0KSwgd2Ugc2hvdyB0aGUgZ2FtZSBpZCBhbmQgdGhlIHBsYXllciBuYW1lc1xuICovXG5mdW5jdGlvbiB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKXtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW5hbWVcIikuaW5uZXJIVE1MPShyaWtrZW5UaGVHYW1lP3Jpa2tlblRoZUdhbWUubmFtZTpcIlwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9KHJpa2tlblRoZUdhbWU/cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lcygpOm51bGwpO1xuICAgIGZvcihsZXQgcGxheWVyTmFtZVNwYW4gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbWUtcGxheWVyLW5hbWVcIikpe1xuICAgICAgICBsZXQgcGxheWVySW5kZXg9cGxheWVyTmFtZVNwYW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaW5kZXhcIik7XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmlubmVySFRNTD1wbGF5ZXJOYW1lc1twbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllck5hbWVTcGFuLmNvbG9yPShwbGF5ZXJJbmRleD09cmlra2VuVGhlR2FtZS5fcGxheWVySW5kZXg/XCJCTFVFXCI6XCJCTEFDS1wiKTtcbiAgICB9XG59XG5cbi8qKlxuICogY2xlYXJzIHRoZSBiaWRzIHRhYmxlXG4gKiB0byBiZSBjYWxsZWQgd2l0aCBldmVyeSBuZXcgZ2FtZVxuICovXG5mdW5jdGlvbiBjbGVhckJpZHNUYWJsZShmaXJzdENvbHVtbkluZGV4KXtcbiAgICBsZXQgYmlkVGFibGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKTtcbiAgICBmb3IobGV0IGJpZFRhYmxlUm93IG9mIGJpZFRhYmxlLmNoaWxkcmVuKVxuICAgICAgICBmb3IobGV0IGJpZFRhYmxlQ29sdW1uSW5kZXggaW4gYmlkVGFibGVSb3cuY2hpbGRyZW4pXG4gICAgICAgICAgICBpZihiaWRUYWJsZUNvbHVtbkluZGV4Pj1maXJzdENvbHVtbilcbiAgICAgICAgICAgICAgICBiaWRUYWJsZVJvdy5jaGlsZHJlbltiaWRUYWJsZUNvbHVtbkluZGV4XS5pbm5lckhUTUw9XCJcIjtcbn1cblxuZnVuY3Rpb24gc2V0U3VpdGVDbGFzcyhlbGVtZW50LHN1aXRlKXtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnRseSBhc3NpZ25lZCBzdWl0ZVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDYXJkLlNVSVRFX05BTUVTW3BhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdWl0ZS1pZFwiKSldKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIixTdHJpbmcoc3VpdGUpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2FyZC5TVUlURV9OQU1FU1twYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpXSk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXJkKGVsZW1lbnQsY2FyZCx0cnVtcFN1aXRlLHdpbm5lclNpZ24pe1xuICAgIGlmKCFlbGVtZW50KXtjb25zb2xlLmVycm9yKFwiTm8gZWxlbWVudCFcIik7cmV0dXJuO31cbiAgICBpZihjYXJkKXtcbiAgICAgICAgc2V0U3VpdGVDbGFzcyhlbGVtZW50LGNhcmQuc3VpdGUpOyAvLyB3ZSB3YW50IHRvIHNlZSB0aGUgcmlnaHQgY29sb3JcbiAgICAgICAgbGV0IGVsZW1lbnRJc1RydW1wPWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidHJ1bXBcIik7XG4gICAgICAgIGxldCBlbGVtZW50U2hvdWxkQmVUcnVtcD0oY2FyZC5zdWl0ZT09PXRydW1wU3VpdGUpO1xuICAgICAgICBpZihlbGVtZW50SXNUcnVtcCE9PWVsZW1lbnRTaG91bGRCZVRydW1wKWVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInRydW1wXCIpO1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpO1xuICAgICAgICBpZih3aW5uZXJTaWduIT0wKWVsZW1lbnQuaW5uZXJIVE1MKz1cIipcIjtcbiAgICAgICAgLyogcmVwbGFjaW5nOiBcbiAgICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgY2FyZCBvZiB0aGUgd2lubmVyIHNvIGZhciBpdCBjYW4gYmUgZWl0aGVyICsgb3IgLVxuICAgICAgICBpZih3aW5uZXJTaWduPjApZWxlbWVudC5pbm5lckhUTUwrPScrJztlbHNlIGlmKHdpbm5lclNpZ248MCllbGVtZW50LmlubmVySFRNTCs9Jy0nO1xuICAgICAgICAqL1xuICAgIH1lbHNlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPVwiXCI7XG59XG5cbi8vIE1ESEAyM0pBTjIwMjA6IHdoZW4gc2hvd2luZyB0aGUgcGxheWVyIG5hbWUgd2Ugc2V0IHRoZSBjb2xvciB0byBibGFjayAoanVzdCBpbiBjYXNlIGl0J3Mgbm90IGJsYWNrIGFueW1vcmUpXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZShlbGVtZW50LG5hbWUpe1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MPShuYW1lP25hbWU6XCI/XCIpO1xuICAgIGVsZW1lbnQuc3R5bGUuY29sb3I9XCJibGFja1wiO1xufVxuZnVuY3Rpb24gc2hvd1BsYXllclR5cGUoZWxlbWVudCxwbGF5ZXJUeXBlKXtcbiAgICBzd2l0Y2gocGxheWVyVHlwZSl7XG4gICAgICAgIGNhc2UgLTE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cInJlZFwiO2JyZWFrO1xuICAgICAgICBjYXNlIDA6ZWxlbWVudC5zdHlsZS5jb2xvcj1cIm9yYW5nZVwiO2JyZWFrO1xuICAgICAgICBjYXNlIDE6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImdyZWVuXCI7YnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6ZWxlbWVudC5zdHlsZS5jb2xvcj1cImJsYWNrXCI7YnJlYWs7IC8vIHR5cGljYWxseSB2YWx1ZSAyIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhlIHBsYXllciBpdHNlbGYhISFcbiAgICB9XG59XG5cbi8vIE1ESEAyMEpBTjIwMjA6IGtlZXAgdGhlIGlkcyBvZiB0aGUgdHJpY2sgcGxheWVkIGNhcmRzIGluIGEgY29uc3RhbnQgYXJyYXlcbmNvbnN0IFBMQVlFRF9DQVJEX0lEUz1bXCJjdXJyZW50LXBsYXllci1jYXJkXCIsXCJsZWZ0aGFuZHNpZGUtcGxheWVyLWNhcmRcIixcIm9wcG9zaXRlLXBsYXllci1jYXJkXCIsXCJyaWdodGhhbmRzaWRlLXBsYXllci1jYXJkXCJdO1xuXG4vLyB0byBiZSBjYWxsZWQgb24gcmVjZWl2aW5nIHRoZSBuZXcgdHJpY2sgZXZlbnRcbmZ1bmN0aW9uIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpe1xuICAgIGZvcihsZXQgcGxheWVkQ2FyZEluZGV4IGluIFBMQVlFRF9DQVJEX0lEUylcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoUExBWUVEX0NBUkRfSURTW3BsYXllZENhcmRJbmRleF0pLmlubmVySFRNTD1cIlwiO1xufVxuXG4vKipcbiAqIHNob3dzIHRoZSBnaXZlbiB0cmlja1xuICogQHBhcmFtIHsqfSB0cmljayBcbiAqL1xuZnVuY3Rpb24gc2hvd1RyaWNrKHRyaWNrLyoscGxheWVySW5kZXgqLyl7XG4gICAgXG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdHJpY2sgXCIsdHJpY2spO1xuICAgIFxuICAgIGxldCBwbGF5ZXJJbmRleD1yaWtrZW5UaGVHYW1lLl9wbGF5ZXJJbmRleDtcblxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIHRydW1wIHBsYXllciB0aGF0IGlzIGNhbiBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgKGVpdGhlciBub24tYmxpbmQgb3IgYmxpbmQpIGZsYWcgdGhlIGNoZWNrYm94XG4gICAgaWYodHJpY2suZmlyc3RQbGF5ZXI9PT1wbGF5ZXJJbmRleCYmdHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCcpLmNoZWNrZWQ9dHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzay1wYXJ0bmVyLWNhcmQtYmxpbmQnKS5pbm5lckhUTUw9KHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPDA/XCJibGluZCBcIjpcIlwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgIH1lbHNlXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuXG4gICAgLy8gYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgaW5mb1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNraW5nLWZvci1wYXJ0bmVyLWNhcmQtaW5mb1wiKS5zdHlsZS5kaXNwbGF5PSh0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZCE9PTA/XCJibG9ja1wiOlwibm9uZVwiKTtcbiAgICAvL2xldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1jYXJkcy10YWJsZVwiKS5yZXF1ZXN0U2VsZWN0b3IoXCJ0Ym9keVwiKTtcblxuICAgIC8vIHRoZSBwbGF5ZXIgdHlwZSBjYW4gY2hhbmdlIGV2ZXJ5IGNhcmQgYmVpbmcgcGxheWVkIChiYXNlZCBvbiB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXIpXG4gICAgLy8gVE9ETyBzaG91bGRuJ3QgbmVlZCB0byBkbyB0aGUgZm9sbG93aW5nOlxuICAgIC8vIHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudC1wbGF5ZXItbmFtZVwiKSxyaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpLC0yKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzEpJTQpKTtcbiAgICBzaG93UGxheWVyVHlwZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wcG9zaXRlLXBsYXllci1uYW1lXCIpLGN1cnJlbnRQbGF5ZXIuaXNGcmllbmRseSgocGxheWVySW5kZXgrMiklNCkpO1xuICAgIHNob3dQbGF5ZXJUeXBlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHRoYW5kc2lkZS1wbGF5ZXItbmFtZVwiKSxjdXJyZW50UGxheWVyLmlzRnJpZW5kbHkoKHBsYXllckluZGV4KzMpJTQpKTtcbiAgICBcbiAgICAvLyBOT1RFIHRoZSBmaXJzdCBjYXJkIGNvdWxkIGJlIHRoZSBibGluZCBjYXJkIGFza2luZyBmb3IgdGhlIHBhcnRuZXIgY2FyZCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZCBub3Qgc2hvdyBpdCEhXG4gICAgLy8gICAgICBidXQgb25seSB0aGUgY29sb3Igb2YgdGhlIHBhcnRuZXIgc3VpdGVcbiAgICBsZXQgYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD0odHJpY2subnVtYmVyT2ZDYXJkcz4wJiZ0cmljay5fY2FyZHNbMF0uc3VpdGUhPT10cmljay5wbGF5U3VpdGUpO1xuICAgIC8vIE1ESEAyMEpBTjIwMjA6IHNob3cgYWxsIHRoZSB0cmljayBjYXJkcyBwbGF5ZWQgYXQgdGhlIHJpZ2h0IHBvc2l0aW9uXG4gICAgZm9yKGxldCB0cmlja0NhcmRJbmRleD0wO3RyaWNrQ2FyZEluZGV4PDQ7dHJpY2tDYXJkSW5kZXgrKyl7XG4gICAgICAgIGxldCB0cmlja0NhcmQ9KHRyaWNrQ2FyZEluZGV4PHRyaWNrLm51bWJlck9mQ2FyZHM/dHJpY2suX2NhcmRzW3RyaWNrQ2FyZEluZGV4XTpudWxsKTtcbiAgICAgICAgbGV0IHRyaWNrQ2FyZFBsYXllckluZGV4PXRyaWNrLmZpcnN0UGxheWVyK3RyaWNrQ2FyZEluZGV4OyAvLyB0aGUgYWN0dWFsIHBsYXllciBpbmRleCBpbiB0aGUgZ2FtZVxuICAgICAgICBsZXQgdHJpY2tDYXJkUG9zaXRpb249KHRyaWNrQ2FyZFBsYXllckluZGV4KzQtcGxheWVySW5kZXgpJTQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJpY2sgY2FyZCBwb3NpdGlvbjogXCIrdHJpY2tDYXJkUG9zaXRpb24rXCIuXCIpO1xuICAgICAgICBsZXQgdHJpY2tDYXJkSWQ9UExBWUVEX0NBUkRfSURTW3RyaWNrQ2FyZFBvc2l0aW9uXTtcbiAgICAgICAgaWYoYXNraW5nRm9yUGFydG5lckNhcmRCbGluZCl7XG4gICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kPWZhbHNlOyAvLyBkbyBub3QgZG8gdGhpcyBmb3IgdGhlIG5leHQgcGxheWVyc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgICAgICBzZXRTdWl0ZUNhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHJpY2tDYXJkSWQpLHRyaWNrLnBsYXlTdWl0ZSk7ICBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdHJpY2sgY2FyZCAjXCIrdHJpY2tDYXJkSW5kZXgsdHJpY2tDYXJkKTtcbiAgICAgICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRyaWNrQ2FyZElkKSx0cmlja0NhcmQsdHJpY2sudHJ1bXBTdWl0ZSxcbiAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0odHJpY2tDYXJkUGxheWVySW5kZXglNCk/KHJpa2tlblRoZUdhbWUuaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LHRyaWNrQ2FyZFBsYXllckluZGV4JTQpPzE6LTEpOjApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgbGV0IHBsYXllckFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmRJbmRleD0oYXNraW5nRm9yUGFydG5lckNhcmRCbGluZD8oNCt0cmljay5maXJzdFBsYXllci1wbGF5ZXJJbmRleCklNDowKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTEpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1sZWZ0LWNhcmRcIikuaW5uZXJIVE1MPVNVSVRFX0NIQVJBQ1RFUlNbdHJpY2sucGxheVN1aXRlXTtcbiAgICAgICAgc2V0U3VpdGVDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5wbGF5U3VpdGUpO1xuICAgIH1lbHNlXG4gICAgICAgIHNob3dDYXJkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLWxlZnQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsxKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMSklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzEpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTIpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1vcHBvc2l0ZS1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItb3Bwb3NpdGUtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCsyKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMiklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzIpJTQpPzE6LTEpOjApKTtcbiAgICBpZihwbGF5ZXJBc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kSW5kZXg9PTMpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLmlubmVySFRNTD1TVUlURV9DSEFSQUNURVJTW3RyaWNrLnBsYXlTdWl0ZV07XG4gICAgICAgIHNldFN1aXRlQ2FyZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yaWdodC1jYXJkXCIpLHRyaWNrLnBsYXlTdWl0ZSk7XG4gICAgfWVsc2VcbiAgICAgICAgc2hvd0NhcmQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItcmlnaHQtY2FyZFwiKSx0cmljay5nZXRQbGF5ZXJDYXJkKChwbGF5ZXJJbmRleCszKSU0KSx0cmljay50cnVtcFN1aXRlLFxuICAgICAgICAgICAgICAgICh0cmljay53aW5uZXI9PT0ocGxheWVySW5kZXgrMyklND8ocmlra2VuVGhlR2FtZS5pc1BsYXllclBhcnRuZXIocGxheWVySW5kZXgsKHBsYXllckluZGV4KzMpJTQpPzE6LTEpOjApKTtcbiAgICAqL1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdWl0ZUNhcmRSb3dzKHJvd3Msc3VpdGVDYXJkcyl7XG4gICAgY29uc29sZS5sb2coXCJQbGF5ZXIgc3VpdGUgY2FyZCByb3dzOiBcIityb3dzLmxlbmd0aCtcIi5cIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgIGxldCBzdWl0ZT0wO1xuICAgIGZvcihsZXQgcm93IG9mIHJvd3Mpe1xuICAgICAgICAvLy8vLy8vLy9sZXQgc3VpdGVDb2xvcj1TVUlURV9DT0xPUlNbc3VpdGUlMl07XG4gICAgICAgIGxldCBjYXJkc0luU3VpdGU9KHN1aXRlPHN1aXRlQ2FyZHMubGVuZ3RoP3N1aXRlQ2FyZHNbc3VpdGVdOltdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgbGV0IGNlbGxzPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgbGV0IHN1aXRlQ2FyZD0wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBjb2x1bW5zOiBcIixjb2x1bW5zLmxlbmd0aCk7XG4gICAgICAgIGZvcihsZXQgY2VsbCBvZiBjZWxscyl7XG4gICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgaWYoY2FyZEluU3VpdGUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBjYXJkOiBcIixjYXJkSW5TdWl0ZSk7XG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKENhcmQuU1VJVEVfTkFNRVNbY2FyZEluU3VpdGUuc3VpdGVdKTsgLy8gcmVwbGFjaW5nOiBjZWxsLnN0eWxlLmNvbG9yPXN1aXRlQ29sb3I7ICBcbiAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgIHN1aXRlQ2FyZCsrO1xuICAgICAgICB9XG4gICAgICAgIHN1aXRlKys7XG4gICAgfVxufVxuLy8gaW4gdGhyZWUgZGlmZmVyZW50IHBhZ2VzIHRoZSBwbGF5ZXIgY2FyZHMgc2hvdWxkIGJlIHNob3duLi4uXG5mdW5jdGlvbiB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB0aGUgKGN1cnJlbnQgcGxheWVyKSBjYXJkcyBmb3IgYmlkZGluZy5cIik7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIiksc3VpdGVDYXJkcyk7XG59XG5mdW5jdGlvbiB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdXBkYXRlU3VpdGVDYXJkUm93cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRydW1wLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHN1aXRlQ2FyZHMpe1xuICAgIHVwZGF0ZVN1aXRlQ2FyZFJvd3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlY2FyZHMtdGFibGVcIikucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKSxzdWl0ZUNhcmRzKTtcbn1cblxuLyoqXG4gKiBmb3IgcGxheWluZyB0aGUgY2FyZHMgYXJlIHNob3duIGluIGJ1dHRvbnMgaW5zaWRlIHRhYmxlIGNlbGxzXG4gKiBAcGFyYW0geyp9IHN1aXRlQ2FyZHMgXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBsYXllclN1aXRlQ2FyZHMoc3VpdGVDYXJkcyl7XG4gICAgdHJ5e1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgdGhlIChjdXJyZW50IHBsYXllcikgY2FyZHMgdG8gY2hvb3NlIGZyb20uXCIpO1xuICAgICAgICAvLy8vLy8vLy8vaWYoY3VycmVudFBhZ2U9PT1cInBhZ2UtcGxheWluZ1wiKWFsZXJ0KFwiU2hvd2luZyB0aGUgcGxheWluZyBjYXJkcyBhZ2FpbiFcIik7XG4gICAgICAgIGxldCB0YWJsZWJvZHk9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXItc3VpdGVjYXJkcy10YWJsZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKiogU3VpdGUgY2FyZHM6IFwiLHN1aXRlQ2FyZHMpO1xuICAgICAgICBsZXQgcm93cz10YWJsZWJvZHkucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJOdW1iZXIgb2Ygcm93czogXCIscm93cy5sZW5ndGgpO1xuICAgICAgICBmb3IobGV0IHN1aXRlPTA7c3VpdGU8cm93cy5sZW5ndGg7c3VpdGUrKyl7XG4gICAgICAgICAgICBsZXQgcm93PXJvd3Nbc3VpdGVdO1xuICAgICAgICAgICAgLy8vLy8vLy8vbGV0IHN1aXRlQ29sb3I9U1VJVEVfQ09MT1JTW3N1aXRlJTJdO1xuICAgICAgICAgICAgbGV0IGNhcmRzSW5TdWl0ZT0oc3VpdGU8c3VpdGVDYXJkcy5sZW5ndGg/c3VpdGVDYXJkc1tzdWl0ZV06W10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgY2FyZHMgaW4gc3VpdGUgI1wiK3N1aXRlK1wiOiBcIitjYXJkc0luU3VpdGUubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5zPXJvdy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGNvbHVtbnM6IFwiLGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvcihsZXQgc3VpdGVDYXJkPTA7c3VpdGVDYXJkPGNvbHVtbnMubGVuZ3RoO3N1aXRlQ2FyZCsrKXtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbGJ1dHRvbj1jb2x1bW5zW3N1aXRlQ2FyZF0vKi5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1idXR0b25dXCIpKi87XG4gICAgICAgICAgICAgICAgaWYoIWNlbGxidXR0b24pe2NvbnNvbGUubG9nKFwiTm8gY2VsbCBidXR0b24hXCIpO2NvbnRpbnVlO31cbiAgICAgICAgICAgICAgICBsZXQgY2FyZEluU3VpdGU9KHN1aXRlQ2FyZDxjYXJkc0luU3VpdGUubGVuZ3RoP2NhcmRzSW5TdWl0ZVtzdWl0ZUNhcmRdOm51bGwpO1xuICAgICAgICAgICAgICAgIGlmKGNhcmRJblN1aXRlKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGNhcmQ6IFwiLGNhcmRJblN1aXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5pbm5lckhUTUw9Y2FyZEluU3VpdGUuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxidXR0b24uY2xhc3NMaXN0LmFkZChDYXJkLlNVSVRFX05BTUVTW2NhcmRJblN1aXRlLnN1aXRlXSk7IC8vIHJlcGxhY2luZzogY2VsbGJ1dHRvbi5zdHlsZS5jb2xvcj1zdWl0ZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBjZWxsYnV0dG9uLnN0eWxlLmRpc3BsYXk9XCJpbmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyBoaWRlIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2VsbGJ1dHRvbi5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwbGF5ZXIgY2FyZHMgdG8gY2hvb3NlIGZyb20gc2hvd24hXCIpO1xuICAgIH1maW5hbGx5e1xuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKHRydWUpOyAvLyB3aGVuZXZlciB0aGUgc3VpdGUgY2FyZHMgc2hvd2luZyBjaGFuZ2Ugd2UgbWFrZSB0aGVtIGNsaWNrYWJsZVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9Y3VycmVudFBsYXllci5nYW1lO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgZGVsdGFQb2ludHM9cmlra2VuVGhlR2FtZS5kZWx0YVBvaW50cztcbiAgICBsZXQgcG9pbnRzPXJpa2tlblRoZUdhbWUucG9pbnRzO1xuICAgIGlmKCFkZWx0YVBvaW50c3x8IXBvaW50cyl7Y29uc29sZS5sb2coXCJFUlJPUjogUmVzdWx0cyBub3cga25vd24geWV0IVwiKTtyZXR1cm47fVxuICAgIGZvcihsZXQgcGxheWVyUmVzdWx0c1JvdyBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllci1yZXN1bHRzLXRhYmxlXCIpLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXBhcnNlSW50KHBsYXllclJlc3VsdHNSb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaW5kZXhcIikpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocGxheWVySW5kZXgpO1xuICAgICAgICBwbGF5ZXJSZXN1bHRzUm93LmNoaWxkcmVuWzFdLmlubmVySFRNTD0oZGVsdGFQb2ludHM/U3RyaW5nKHJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcihwbGF5ZXJJbmRleCkpOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblsyXS5pbm5lckhUTUw9KGRlbHRhUG9pbnRzP1N0cmluZyhkZWx0YVBvaW50c1twbGF5ZXJJbmRleF0pOlwiLVwiKTtcbiAgICAgICAgcGxheWVyUmVzdWx0c1Jvdy5jaGlsZHJlblszXS5pbm5lckhUTUw9U3RyaW5nKHBvaW50c1twbGF5ZXJJbmRleF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKXtcbiAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgZm9yKGxldCB0cmlja3NQbGF5ZWRUYWJsZUNlbGwgb2YgdHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvckFsbCgndGQnKSl7XG4gICAgICAgICAgICB0cmlja3NQbGF5ZWRUYWJsZUNlbGwuaW5uZXJIVE1MPVwiXCI7dHJpY2tzUGxheWVkVGFibGVDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvcj0ndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpO2lmKCFyaWtrZW5UaGVHYW1lKXRocm93IG5ldyBFcnJvcihcIk5vIGdhbWUgYmVpbmcgcGxheWVkIVwiKTsgLy8gTURIQDAzSkFOMjAyMDogcmlra2VuVGhlR2FtZSBzaG91bGQgbm93IHBvaW50IHRvIHRoZSBfZ2FtZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICBsZXQgbGFzdFRyaWNrUGxheWVkSW5kZXg9cmlra2VuVGhlR2FtZS5udW1iZXJPZlRyaWNrc1BsYXllZC0xOyAvLyBnZXR0ZXIgY2hhbmdlZCB0byBnZXRNZXRob2QgY2FsbFxuICAgIGlmKGxhc3RUcmlja1BsYXllZEluZGV4Pj0wKXtcbiAgICAgICAgbGV0IHRyaWNrPXJpa2tlblRoZUdhbWUuX3RyaWNrOyAvLyBNREhAMjBKQU4yMDIwIHJlcGxhY2luZzogZ2V0VHJpY2tBdEluZGV4KGxhc3RUcmlja1BsYXllZEluZGV4KTtcbiAgICAgICAgaWYoIXRyaWNrKXtjb25zb2xlLmxvZyhcIkVSUk9SOiBObyB0cmljayB0byB1cGRhdGUgdGhlIHRyaWNrcyB0YWJsZSB3aXRoIVwiKTtyZXR1cm47fVxuICAgICAgICBmb3IobGV0IHRyaWNrc1BsYXllZFRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmlja3MtcGxheWVkLXRhYmxlXCIpKXtcbiAgICAgICAgICAgIGxldCByb3c9dHJpY2tzUGxheWVkVGFibGUucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLmNoaWxkcmVuW2xhc3RUcmlja1BsYXllZEluZGV4XTsgLy8gdGhlIHJvdyB3ZSdyZSBpbnRlcmVzdGVkIGluIGZpbGxpbmdcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblswXS5pbm5lckhUTUw9U3RyaW5nKGxhc3RUcmlja1BsYXllZEluZGV4KzEpO1xuICAgICAgICAgICAgZm9yKHRyaWNrUGxheWVyPTA7dHJpY2tQbGF5ZXI8dHJpY2suX2NhcmRzLmxlbmd0aDt0cmlja1BsYXllcisrKXtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyPSh0cmlja1BsYXllcit0cmljay5maXJzdFBsYXllciklNDtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbD1yb3cuY2hpbGRyZW5bMipwbGF5ZXIrMV07IC8vIHVzZSBwbGF5ZXIgdG8gZ2V0IHRoZSAncmVhbCcgcGxheWVyIGNvbHVtbiEhXG4gICAgICAgICAgICAgICAgbGV0IGNhcmQ9dHJpY2suX2NhcmRzW3RyaWNrUGxheWVyXTtcbiAgICAgICAgICAgICAgICBjZWxsLmlubmVySFRNTD1jYXJkLmdldFRleHRSZXByZXNlbnRhdGlvbigpOyAvLyBwdXQgfCBpbiBmcm9udCBvZiBmaXJzdCBwbGF5ZXIhISFcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBiYWNrZ3JvdW5kIHRoZSBjb2xvciBvZiB0aGUgcGxheSBzdWl0ZSBhZnRlciB0aGUgbGFzdCBwbGF5ZXIsIHNvIHdlIGtub3cgd2hlcmUgdGhlIHRyaWNrIGVuZGVkISFcbiAgICAgICAgICAgICAgICByb3cuY2hpbGRyZW5bMipwbGF5ZXIrMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yPSh0cmlja1BsYXllcj09dHJpY2suX2NhcmRzLmxlbmd0aC0xPyh0cmljay5wbGF5U3VpdGUlMj8nYmxhY2snOidyZWQnKTond2hpdGUnKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQncyBtYWtlIHRoZSB3aW5uZXIgY2FyZCBzaG93IGJpZ2dlciEhIVxuICAgICAgICAgICAgICAgIC8vLy8vLy9pZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgIC8qIHJlcGxhY2luZzpcbiAgICAgICAgICAgICAgICBpZih0cmljay53aW5uZXI9PT1wbGF5ZXIpY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibHVlJzonI2IxOWNkOScpO2Vsc2UgLy8gbWFyayB0aGUgd2lubmVyIHdpdGggYW4gYXN0ZXJpc2shIVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5jb2xvcj0oY2FyZC5zdWl0ZSUyPydibGFjayc6J3JlZCcpO1xuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuZm9udFNpemU9KHRyaWNrLndpbm5lcj09PXBsYXllcj9cIjYwMFwiOlwiNDUwXCIpK1wiJVwiO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2luZzogY2VsbC5zdHlsZS5jb2xvcj0nIycrKGNhcmQuc3VpdGUlMj8nRkYnOicwMCcpKycwMCcrKHRyaWNrUGxheWVyPT0wPydGRic6JzAwJyk7IC8vIGZpcnN0IHBsYXllciBhZGRzIGJsdWUhIVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2UncmUgcGFzc2luZyBhbG9uZyBjdXJyZW50UGxheWVyLnBhcnRuZXIgdG8gZ2V0VGVhbU5hbWUgYmVjYXVzZSB0aGUgcGxheWVyIHdpdGggdGhlIGZvdXJ0aCBhY2UgYWxyZWFkeSBrbm93cyBoaXMvaGVyIHBhcnRuZXJcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlbls5XS5pbm5lckhUTUw9cmlra2VuVGhlR2FtZS5nZXRUZWFtTmFtZSh0cmljay53aW5uZXIpOyAvLyBzaG93IHdobyB3b24gdGhlIHRyaWNrISFcbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0TnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcih0cmljay53aW5uZXIpOyAvLyBzaG93IHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSB0aGUgdHJpY2sgd2lubmVyIChNREhAMDNKQU4yMDIwOiBjaGFuZ2VkIGZyb20gZ2V0dGluZyB0aGUgcGxheWVyIGluc3RhbmNlIGZpcnN0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93RGVmYXVsdFBsYXllck5hbWVzKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRlZmF1bHQgcGxheWVyIG5hbWVzIVwiKTtcbiAgICBsZXQgcGxheWVyTmFtZXM9TGFuZ3VhZ2UuREVGQVVMVF9QTEFZRVJTW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVtby1wbGF5bW9kZS1jaGVja2JveFwiKS5jaGVja2VkPzE6MF07XG4gICAgZm9yKGxldCBwbGF5ZXJOYW1lSW5wdXRFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItbmFtZS1pbnB1dFwiKSl7XG4gICAgICAgIGlmKCFwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlfHxwbGF5ZXJOYW1lSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aD09MClcbiAgICAgICAgICAgIHBsYXllck5hbWVJbnB1dEVsZW1lbnQudmFsdWU9cGxheWVyTmFtZXNbcGFyc2VJbnQocGxheWVyTmFtZUlucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiKSldO1xuICAgIH1cbn1cblxuLy8gcGxheWluZyBmcm9tIHdpdGhpbiB0aGUgZ2FtZVxuZnVuY3Rpb24gc2luZ2xlUGxheWVyR2FtZUJ1dHRvbkNsaWNrZWQoKXtcbiAgICBsZXQgc2luZ2xlUGxheWVyTmFtZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLXBsYXllci1uYW1lJykudmFsdWUudHJpbSgpO1xuICAgIGlmKHNpbmdsZVBsYXllck5hbWUubGVuZ3RoPjApXG4gICAgICAgIHNldFBsYXllck5hbWUoc2luZ2xlUGxheWVyTmFtZSwoZXJyKT0+e1xuICAgICAgICAgICAgLy8gTURIQDEwSkFOMjAyMDogX3NldFBsYXllciB0YWtlcyBjYXJlIG9mIHN3aXRjaGluZyB0byB0aGUgcmlnaHQgaW5pdGlhbCBwYWdlISEhXG4gICAgICAgICAgICBpZihlcnIpc2V0SW5mbyhlcnIpOy8vIGVsc2UgbmV4dFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICBhbGVydChcIkdlZWYgZWVyc3QgZWVuIChnZWxkaWdlKSBuYWFtIG9wIVwiKTtcbn1cblxuLyoqXG4gKiBwcmVwYXJlcyB0aGUgR1VJIGZvciBwbGF5aW5nIHRoZSBnYW1lXG4gKi9cbmZ1bmN0aW9uIGdldEdhbWVJbmZvKCl7XG4gICAgY29uc29sZS5sb2coXCJEZXRlcm1pbmluZyBnYW1lIGluZm8uXCIpO1xuICAgIGxldCBnYW1lSW5mbz1cIlwiO1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTsgLy8gbm8gcGxheWVyLCBubyBnYW1lXG4gICAgaWYocmlra2VuVGhlR2FtZSl7XG4gICAgICAgIC8vIGdldCB0aGUgaW5mbyB3ZSBuZWVkIHRocm91Z2ggdGhlIFBsYXllckdhbWUgaW5zdGFuY2UgcmVnaXN0ZXJlZCB3aXRoIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgaGlnaGVzdEJpZGRlcnM9cmlra2VuVGhlR2FtZS5nZXRIaWdoZXN0QmlkZGVycygpOyAvLyB0aG9zZSBiaWRkaW5nXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFx0SGlnaGVzdCBiaWRkZXJzOiBcIitoaWdoZXN0QmlkZGVycy5qb2luKFwiLCBcIikrXCIuXCIpO1xuICAgICAgICBsZXQgaGlnaGVzdEJpZD1yaWtrZW5UaGVHYW1lLmdldEhpZ2hlc3RCaWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRIaWdoZXN0IGJpZDogXCIrUGxheWVyR2FtZS5CSURfTkFNRVNbaGlnaGVzdEJpZF0rXCIuXCIpO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZT1yaWtrZW5UaGVHYW1lLmdldFRydW1wU3VpdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHRUcnVtcCBzdWl0ZTogXCIrdHJ1bXBTdWl0ZStcIi5cIik7XG4gICAgICAgIGxldCBwYXJ0bmVyU3VpdGU9cmlra2VuVGhlR2FtZS5nZXRQYXJ0bmVyU3VpdGUoKTtcbiAgICAgICAgbGV0IHBhcnRuZXJSYW5rPXJpa2tlblRoZUdhbWUuZ2V0UGFydG5lclJhbmsoKTtcbiAgICAgICAgLy8gcGxheWluZyB3aXRoIHRydW1wIGlzIGVhc2llc3RcbiAgICAgICAgaWYodHJ1bXBTdWl0ZT49MCl7IC8vIG9ubHkgYSBzaW5nbGUgaGlnaGVzdCBiaWRkZXIhISFcbiAgICAgICAgICAgIGxldCBoaWdoZXN0QmlkZGVyPWhpZ2hlc3RCaWRkZXJzWzBdO1xuICAgICAgICAgICAgaWYoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBKXtcbiAgICAgICAgICAgICAgICBsZXQgdHJvZWxhUGxheWVyTmFtZT1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcik7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89dHJvZWxhUGxheWVyTmFtZStcIiBoZWVmdCB0cm9lbGEsIFwiO1xuICAgICAgICAgICAgICAgIC8vIE1ESEAzMEpBTjIwMjA6IE9PUFMgbm90IHN1cHBvc2VkIHRvIGdpdmUgdGhpcyBhd2F5ISEhISEgZ2FtZUluZm8rPUxhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RydW1wU3VpdGVdK1wiIGlzIHRyb2VmLCBlbiBcIjtcbiAgICAgICAgICAgICAgICBnYW1lSW5mbys9XCJlbiBcIityaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUocmlra2VuVGhlR2FtZS5mb3VydGhBY2VQbGF5ZXIpK1wiIGlzIG1lZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWQ9PVBsYXllckdhbWUuQklEX1JJS3x8aGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfUklLX0JFVEVSKXtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm89cmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpK1wiIHJpa3QgaW4gZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJ1bXBTdWl0ZV07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbmZvKz1cIiwgZW4gdnJhYWd0IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgbWVlLlwiOyAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSAvLyB3aXRob3V0IGEgcGFydG5lclxuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbz1yaWtrZW5UaGVHYW1lLmdldFBsYXllck5hbWUoaGlnaGVzdEJpZGRlcikrXCIgc3BlZWx0IFwiK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiIG1ldCBcIitMYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cnVtcFN1aXRlXStcIiBhbHMgdHJvZWYuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNleyAvLyB0aGVyZSdzIG5vIHRydW1wLCBldmVyeW9uZSBpcyBwbGF5aW5nIGZvciBoaW0vaGVyc2VsZlxuICAgICAgICAgICAgbGV0IGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcz1bXTtcbiAgICAgICAgICAgIGhpZ2hlc3RCaWRkZXJzLmZvckVhY2goKGhpZ2hlc3RCaWRkZXIpPT57aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLnB1c2gocmlra2VuVGhlR2FtZS5nZXRQbGF5ZXJOYW1lKGhpZ2hlc3RCaWRkZXIpKTt9KTtcbiAgICAgICAgICAgIGlmKGhpZ2hlc3RCaWRkZXJQbGF5ZXJOYW1lcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZ2FtZUluZm89aGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmpvaW4oXCIsIFwiKSsoaGlnaGVzdEJpZGRlclBsYXllck5hbWVzLmxlbmd0aD4xP1wiIHNwZWxlbiBcIjpcIiBzcGVlbHQgXCIpK1BsYXllckdhbWUuQklEX05BTUVTW2hpZ2hlc3RCaWRdK1wiLlwiO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBnYW1lSW5mbz1cIkllZGVyZWVuIGhlZWZ0IGdlcGFzdC4gV2Ugc3BlbGVuIG9tIGRlIHNjaG9wcGVuIHZyb3V3IGVuIGRlIGxhYXRzdGUgc2xhZyFcIjtcbiAgICAgICAgfVxuICAgfVxuICAgcmV0dXJuIGdhbWVJbmZvO1xufVxuXG4vLyBob3cgdG8gcGhyYXNlIGEgYmlkIGRlcGVuZHMgb24gdGhlIGJpZCwgYW5kIHdobyBwbGF5cyBpdFxuZnVuY3Rpb24gZ2V0QmlkSW5mbyhiaWQsYmlkZGVyKXtcbiAgICBsZXQgYmV0dGVyPShiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVJ8fGJpZD09PVBsYXllckdhbWUuQklEX05FR0VOX0FMTEVFTl9CRVRFUnx8YmlkPT09UGxheWVyR2FtZS5CSURfVElFTl9BTExFRU5fQkVURVJ8fFxuICAgICAgICBiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9UV0FBTEZfQUxMRUVOX0JFVEVSfHxiaWQ9PT1QbGF5ZXJHYW1lLkJJRF9ERVJUSUVOX0FMTEVFTl9CRVRFUik7XG4gICAgaWYoYmV0dGVyKWJpZC0tO1xuICAgIHN3aXRjaChiaWQpe1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1BBUzpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0IGdlcGFzdC5cIjpcIkplIGhlYnQgZ2VwYXN0LlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9SSUs6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiBoZWVmdCBcIjpcIkplIGhlYnQgXCIpKyhiZXR0ZXI/XCJiZXRlciBcIjpcIlwiKStcIiBnZXJpa3QuXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTkVHRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCI6XCJKZSB3aWx0IG5lZ2VuIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX1RJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIHRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdGllbiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiKTtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9FTEZfQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsIGVsZiBzbGFnZW4gYWxsZWVuIGhhbGVuLlwiOlwiSmUgd2lsdCBlbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIik7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfVFdBQUxGX0FMTEVFTjpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbCB0d2FhbGYgc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjpcIkplIHdpbHQgdHdhYWxmIHNsYWdlbiBhbGxlZW4gaGFsZW4uXCIpO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX0RFUlRJRU5fQUxMRUVOOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGRlcnRpZW4gc2xhZ2VuIGFsbGVlbiBoYWxlbi5cIjtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRF9QSUNPOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIHNsZWNodHMgZWVuIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfTUlTRVJFOlxuICAgICAgICAgICAgcmV0dXJuKGJpZGRlcj9iaWRkZXIrXCIgd2lsXCI6XCJKZSB3aWx0XCIpK1wiIGdlZW4gZW5rZWxlIHNsYWcgaGFsZW4uXCI7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5CSURfT1BFTl9NSVNFUkU6XG4gICAgICAgICAgICByZXR1cm4oYmlkZGVyP2JpZGRlcitcIiB3aWxcIjpcIkplIHdpbHRcIikrXCIgZ2VlbiBlbmtlbGUgc2xhZyBoYWxlbiBtZXQgb3BlbiBrYWFydGVuLlwiO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuQklEX09QRU5fTUlTRVJFX01FVF9FRU5fUFJBQVRKRTpcbiAgICAgICAgICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIHdpbFwiOlwiSmUgd2lsdFwiKStcIiBnZWVuIGVua2VsZSBzbGFnIGhhbGVuIG1ldCBlZW4gcHJhYXRqZSBlbiBvcGVuIGthYXJ0ZW4uXCI7XG4gICAgfVxuICAgIHJldHVybihiaWRkZXI/YmlkZGVyK1wiIGhlZWZ0XCI6XCJKZSBoZWJ0XCIpK1wiIGVlbiBvbmdlbGRpZyBib2QgZ2VkYWFuLlwiO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJPZlRyaWNrc1RvV2luVGV4dChudW1iZXJPZlRyaWNrc1RvV2luLHBhcnRuZXJOYW1lLGhpZ2hlc3RCaWQpe1xuICAgIHN3aXRjaChudW1iZXJPZlRyaWNrc1RvV2luKXtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiR2VlbmVlblwiO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCJQcmVjaWVzIGVlblwiO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gXCJaZXMgc2FtZW4gbWV0IFwiKyhwYXJ0bmVyTmFtZT9wYXJ0bmVyTmFtZTpcImplIHBhcnRuZXJcIikrXCIgb20gZGUgdGVnZW5zcGVsZXJzIGRlIFwiKyhoaWdoZXN0QmlkPT1QbGF5ZXJHYW1lLkJJRF9UUk9FTEE/XCJ0cm9lbGFcIjpcInJpa1wiKStcIiB0ZSBsYXRlbiB2ZXJsaWV6ZW5cIjtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIFwiQWNodCBzYW1lbiBtZXQgXCIrKHBhcnRuZXJOYW1lP3BhcnRuZXJOYW1lOlwiamUgcGFydG5lclwiKStcIiBvbSBkZSBcIisoaGlnaGVzdEJpZD09UGxheWVyR2FtZS5CSURfVFJPRUxBP1widHJvZWxhXCI6XCJyaWtcIikrXCIgdGUgd2lubmVuXCI7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBcIk5lZ2VuIGFsbGVlblwiO1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgcmV0dXJuIFwiVGllbiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBcIkVsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBcIlR3YWFsZiBhbGxlZW5cIjtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIHJldHVybiBcIkFsbGVtYWFsXCI7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdCBtaXRzIG5pZXQgZGUgbGFhdHN0ZSBzbGFnIG9mIGVlbiBzbGFnIG1ldCBkZSBzY2hvcHBlbiB2cm91d1wiO1xuICAgIH1cbiAgICByZXR1cm4gXCJNYWFrdCBuaWV0IHVpdFwiO1xufVxuXG5mdW5jdGlvbiBzaG93UGxheWVyTmFtZXNJbkJpZHNUYWJsZSgpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgZm9yKGxldCBwbGF5ZXJJbmRleD0wO3BsYXllckluZGV4PHJpa2tlblRoZUdhbWUubnVtYmVyT2ZQbGF5ZXJzO3BsYXllckluZGV4Kyspe1xuICAgICAgICBsZXQgcGxheWVyQmlkc1Jvdz1iaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJJbmRleF07XG4gICAgICAgIHBsYXllckJpZHNSb3cuY2hpbGRyZW5bMF0uaW5uZXJIVE1MPXJpa2tlblRoZUdhbWUuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICB9XG59XG4vLyBNREhAMjFOT1YyMDIwOiB0aGUgZ2FtZSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBhIGJpZCBtYWRlIGlzIHJlY2VpdmVkISEhXG5mdW5jdGlvbiB1cGRhdGVCaWRzVGFibGUocGxheWVyQmlkc09iamVjdHMpe1xuICAgIGxldCByaWtrZW5UaGVHYW1lPShjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIuZ2FtZTpudWxsKTtpZighcmlra2VuVGhlR2FtZSlyZXR1cm47XG4gICAgbGV0IGJpZFRhYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkcy10YWJsZVwiKS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgaWYocGxheWVyQmlkc09iamVjdHMpXG4gICAgZm9yKGxldCBwbGF5ZXJCaWRzSW5kZXg9MDtwbGF5ZXJCaWRzSW5kZXg8cGxheWVyQmlkc09iamVjdHMubGVuZ3RoO3BsYXllckJpZHNJbmRleCsrKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9cGxheWVyQmlkc09iamVjdHNbcGxheWVyQmlkc0luZGV4XTtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PXJpa2tlblRoZUdhbWUuZ2V0UGxheWVySW5kZXgocGxheWVyQmlkc09iamVjdC5uYW1lKTtcbiAgICAgICAgLy8gb24gdGhlIHNhZmUgc2lkZSwgZ2V0IHRoZSBwbGF5ZXIgaW5kZXggZnJvbSB0aGUgZ2FtZSBwYXNzaW5nIGluICBwbGF5ZXIgbmFtZVxuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXthbGVydChcIlNwZWxlciBcIitwbGF5ZXJCaWRzT2JqZWN0Lm5hbWUrXCIgb25iZWtlbmQhXCIpO2NvbnRpbnVlO31cbiAgICAgICAgbGV0IHBsYXllckJpZHNSb3c9YmlkVGFibGUuY2hpbGRyZW5bcGxheWVySW5kZXhdO1xuICAgICAgICAvLyBNREhAMjNKQU4yMDIwIHNob3dpbmcgdGhlIHBsYXllciBuYW1lcyBvbmNlOiBwbGF5ZXJCaWRzUm93LmNoaWxkcmVuWzBdLmlubmVySFRNTD1jYXBpdGFsaXplKHBsYXllckJpZHNPYmplY3QubmFtZSk7IC8vIHdyaXRlIHRoZSBuYW1lIG9mIHRoZSBwbGF5ZXJcbiAgICAgICAgLy8gd3JpdGUgdGhlIGJpZHMgKHdlIGhhdmUgdG8gY2xlYXIgdGhlIHRhYmxlIHdpdGggZXZlcnkgbmV3IGdhbWUgdGhvdWdoKVxuICAgICAgICBwbGF5ZXJCaWRzT2JqZWN0LmJpZHMuZm9yRWFjaCgocGxheWVyQmlkLGJpZEluZGV4KT0+e3BsYXllckJpZHNSb3cuY2hpbGRyZW5bYmlkSW5kZXgrMV0uaW5uZXJIVE1MPXBsYXllckJpZDt9KTtcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBiaWRUYWJsZS5jaGlsZHJlbltwbGF5ZXJdLmNoaWxkcmVuWzFdLmlubmVySFRNTD1wbGF5ZXJzQmlkc1tiaWRdLmpvaW4oXCIgXCIpO1xuICAgIH1cbn1cblxuY2xhc3MgT25saW5lUGxheWVyIGV4dGVuZHMgUGxheWVye1xuXG4gICAgY29uc3RydWN0b3IobmFtZSl7XG4gICAgICAgIHN1cGVyKG5hbWUsbnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZUcmlja3NXb24oKXtcbiAgICAgICAgLy8gYXNrIHRoZSBnYW1lXG4gICAgICAgIHJldHVybih0aGlzLl9pbmRleCYmdGhpcy5fZ2FtZT90aGlzLl9nYW1lLmdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIodGhpcy5faW5kZXgpOi0yKTtcbiAgICB9XG5cbiAgICAvLyB0byBzZXQgdGhlIHBhcnRuZXIgb25jZSB0aGUgcGFydG5lciBzdWl0ZS9yYW5rIGNhcmQgaXMgaW4gdGhlIHRyaWNrISEhIVxuXG4gICAgLy8gYSAocmVtb3RlKSBjbGllbnQgbmVlZHMgdG8gb3ZlcnJpZGUgYWxsIGl0cyBhY3Rpb25zXG4gICAgLy8gQlVUIHdlIGRvIG5vdCBkbyB0aGF0IGJlY2F1c2UgYWxsIHJlc3VsdHMgZ28gaW50byBQbGF5ZXJHYW1lUHJveHkgd2hpY2ggd2lsbCBzZW5kIHRoZSBhbG9uZyEhISFcblxuICAgIC8vIG1ha2UgYSBiaWQgaXMgY2FsbGVkIHdpdGggXG4gICAgbWFrZUFCaWQocGxheWVyQmlkc09iamVjdHMscG9zc2libGVCaWRzKXtcbiAgICAgICAgLy8gcmVxdWVzdCBvZiBnYW1lIGVuZ2luZSAoc2VydmVyKSB0byBtYWtlIGEgYmlkXG4gICAgICAgIHRvTWFrZUFCaWQrKztcbiAgICAgICAgaWYodG9NYWtlQUJpZD09PTEpeyAvLyBmaXJzdCB0aW1lIHJlcXVlc3QgZm9yIHRoZSBiaWRcbiAgICAgICAgICAgIGJpZE1hZGU9LTE7IC8vIE1ESEAwN0ZFQjIwMjA6IHllcywgSSB0aGluayB3ZSBuZWVkIHRoaXMgYXMgd2VsbCEhIVxuICAgICAgICAgICAgZm9yY2VGb2N1cyh0aGlzLm5hbWUpO1xuICAgICAgICAgICAgLy8gYXNjZXJ0YWluIHRvIGJlIGxvb2tpbmcgYXQgdGhlIGJpZGRpbmcgcGFnZSAoaW4gd2hpY2ggY2FzZSB3ZSBjYW4gc2FmZWx5IHVzZSBWSVNJQkxFKVxuICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPVwicGFnZS1iaWRkaW5nXCIpc2V0UGFnZShcInBhZ2UtYmlkZGluZ1wiKTsgXG4gICAgICAgICAgICAvLyByZW1vdmVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLWJpZFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudFxuICAgICAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogaW5oZXJpdCBpcyBzYWZlciBiZWNhdXNlIGlmIHRoaXMgaGFwcGVucyBieSBhY2NpZGVudCAod2hlbiBub3Qgb24gdGhlIGJpZGRpbmcgcGFnZSlcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIHNob3cgdGhlIGJpZGRpbmcgZWxlbWVudCwgZXNzZW50aWFsIHRvIGhpZGUgaXQgaW1tZWRpYXRlbHkgYWZ0ZXIgYSBiaWRcbiAgICAgICAgICAgIC8vIGN1cnJlbnRQbGF5ZXI9dGhpczsgLy8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgICAgICBzZXRJbmZvKFwiRG9lIGVlbiBib2QsIFwiK3RoaXMubmFtZStcIi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgYmlkcyBwbGF5ZXIgJ1wiK3RoaXMubmFtZStcIicgY291bGQgbWFrZTogXCIscG9zc2libGVCaWRzKTtcbiAgICBcbiAgICAgICAgICAgIC8vc2V0SW5mbyhcIk1hYWsgZWVuIGtldXplIHVpdCBlZW4gdmFuIGRlIG1vZ2VsaWprZSBiaWVkaW5nZW4uXCIpO1xuICAgICAgICAgICAgLy8gaXQncyBhbHdheXMgeW91ISEhISBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlclwiKS5pbm5lckhUTUw9dGhpcy5uYW1lO1xuICAgICAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLmlubmVySFRNTD1cIlRvb24ga2FhcnRlblwiO1xuICAgICAgICAgICAgYmlkZGVyQ2FyZHNFbGVtZW50LmlubmVySFRNTD1cIlwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLnZhbHVlPXRoaXMuZ2V0VGV4dFJlcHJlc2VudGF0aW9uKFwiPGJyPlwiKTtcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBlaXRoZXIgc2hvdyBvciBoaWRlIHRoZSBiaWRkZXIgY2FyZHMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtdGFibGVcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgICAgICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZGRlci1zdWl0ZWNhcmRzLWJ1dHRvblwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtYnV0dG9uXCIpKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGVyLXN1aXRlY2FyZHMtYnV0dG9uXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmUtYnV0dG9uXCIpO1xuICAgICAgICAgICAgLyogTURIQDExSkFOMjAyMDogbW92ZWQgb3ZlciB0byB3aGVuIHRoZSBwbGF5ZXIgY2FyZHMgYXJlIHJlY2VpdmVkISEhXG4gICAgICAgICAgICAvLyBOT1RFIGJlY2F1c2UgZXZlcnkgcGxheWVyIGdldHMgYSB0dXJuIHRvIGJpZCwgdGhpcy5fc3VpdGVDYXJkcyB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIHdlIGFzayBmb3IgdHJ1bXAvcGFydG5lciEhIVxuICAgICAgICAgICAgdXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKSk7XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gb25seSBzaG93IHRoZSBidXR0b25zIGNvcnJlc3BvbmRpbmcgdG8gcG9zc2libGUgYmlkc1xuICAgICAgICAgICAgZm9yKGxldCBiaWRCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJpZFwiKSlcbiAgICAgICAgICAgICAgICBiaWRCdXR0b24uc3R5bGUuZGlzcGxheT0ocG9zc2libGVCaWRzLmluZGV4T2YocGFyc2VJbnQoYmlkQnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1iaWQnKSkpPj0wP1wiaW5saW5lXCI6XCJub25lXCIpO1xuICAgICAgICAgICAgLy8gc2hvdyB0aGUgcGxheWVyIGJpZHMgaW4gdGhlIGJvZHkgb2YgdGhlIGJpZHMgdGFibGVcbiAgICAgICAgICAgIHVwZGF0ZUJpZHNUYWJsZShwbGF5ZXJCaWRzT2JqZWN0cyk7XG4gICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9CSUQpOyAgICBcbiAgICAgICAgfWVsc2UgLy8gbm90IHRoZSBmaXJzdCB0aW1lIGEgYmlkIHdhcyByZXF1ZXN0ZWRcbiAgICAgICAgaWYoYmlkTWFkZT49MCl7XG4gICAgICAgICAgICBsZXQgZXJyb3I9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5fc2V0QmlkKGJpZE1hZGUpOm5ldyBFcnJvcihidWcoXCJKZSBiZW50IGdlZW4gc3BlbGVyIG1lZXIhXCIpKSk7XG4gICAgICAgICAgICBpZihlcnJvciBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJOb2cgc3RlZWRzIHByb2JsZW1lbiBiaWogaGV0IHZlcnN0dXJlbiB2YW4gamUgYm9kLiBXZSBibGlqdmVuIGhldCBwcm9iZXJlbi5cIixcIlNwZWxlclwiKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiSmUgYm9kIGlzIG5vZ21hYWxzIHZlcnN0dXVyZC4gSG9wZWxpamsgaGViYmVuIHdlIG51IG1lZXIgZ2VsdWshXCIsXCJTcGVsZXJcIik7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBzZXRJbmZvKFwiRXIgd29yZHQgb3AgamUgYm9kIGdld2FjaHQhXCIsXCJTZXJ2ZXJcIik7XG4gICAgfVxuICAgIGNob29zZVRydW1wU3VpdGUoc3VpdGVzKXtcbiAgICAgICAgdG9DaG9vc2VUcnVtcFN1aXRlKys7XG4gICAgICAgIGlmKHRvQ2hvb3NlVHJ1bXBTdWl0ZT09PTEpe1xuICAgICAgICAgICAgY2hvc2VuVHJ1bXBTdWl0ZT0tMTtcbiAgICAgICAgICAgIGZvcmNlRm9jdXModGhpcy5uYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9zc2libGUgdHJ1bXAgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS10cnVtcC1jaG9vc2luZ1wiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBhc2NlcnRhaW4gdG8gYWxsb3cgY2hvb3NpbmcgdGhlIHRydW1wIHN1aXRlXG4gICAgICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHRydW1wIHN1aXRlIGJ1dHRvbnNcbiAgICAgICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1idXR0b25zXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWl0ZVwiKSlcbiAgICAgICAgICAgICAgICBzdWl0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PShzdWl0ZXMuaW5kZXhPZihwYXJzZUludChzdWl0ZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VpdGUnKSkpPDA/XCJub25lXCI6XCJpbmxpbmVcIik7XG4gICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9UUlVNUCk7ICAgIFxuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihjaG9zZW5UcnVtcFN1aXRlPj0wKXtcbiAgICAgICAgICAgIC8vIE1ESEAwN0ZFQjIwMjA6IGEgc2hvcnRjdXQgb2Ygc2VuZGluZyB0aGUgY2hvc2VuIHRydW1wIHN1aXRlXG4gICAgICAgICAgICBpZighdGhpcy5fZ2FtZSlyZXR1cm4gYWxlcnQoYnVnKFwiSGV0IHNwZWwgaXMgdmVyZHdlbmVuIVwiKSk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lLnRydW1wU3VpdGVDaG9zZW4oY2hvc2VuVHJ1bXBTdWl0ZSk7XG4gICAgICAgIH1lbHNlXG4gICAgICAgICAgICBzZXRJbmZvKFwiRXIgd29yZHQgb3AgZGUgdHJvZWZrbGV1ciBnZXdhY2h0XCIsXCJTZXJ2ZXJcIik7XG4gICAgfVxuICAgIGNob29zZVBhcnRuZXJTdWl0ZShzdWl0ZXMscGFydG5lclJhbmspeyAvLyBwYXJ0bmVyUmFua05hbWUgY2hhbmdlZCB0byBwYXJ0bmVyUmFuayAoYmVjYXVzZSBMYW5ndWFnZSBzaG91bGQgYmUgdXNlZCBhdCB0aGUgVUkgbGV2ZWwgb25seSEpXG4gICAgICAgIHRvQ2hvb3NlUGFydG5lclN1aXRlKys7XG4gICAgICAgIGlmKHRvQ2hvb3NlUGFydG5lclN1aXRlPT09MSl7XG4gICAgICAgICAgICBjaG9zZW5QYXJ0bmVyU3VpdGU9LTE7XG4gICAgICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3NpYmxlIHBhcnRuZXIgc3VpdGVzOlwiLHN1aXRlcyk7XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wYXJ0bmVyLWNob29zaW5nXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9VklTSUJMRTsgLy8gYXNjZXJ0YWluIHRvIGFsbG93IGNob29zaW5nIHRoZSB0cnVtcCBzdWl0ZVxuICAgICAgICAgICAgdXBkYXRlQ2hvb3NlUGFydG5lclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBzdWl0ZXMgaW4gdGhlIGJ1dHRvbiBhcnJheSBhcmUgMCwgMSwgMiwgMyBhbmQgc3VpdGVzIHdpbGwgY29udGFpblxuICAgICAgICAgICAgZm9yKGxldCBzdWl0ZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcnRuZXItc3VpdGUtYnV0dG9uc1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VpdGVcIikpXG4gICAgICAgICAgICAgICAgc3VpdGVCdXR0b24uc3R5bGUuZGlzcGxheT0oc3VpdGVzLmluZGV4T2YocGFyc2VJbnQoc3VpdGVCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1aXRlJykpKTwwP1wibm9uZVwiOlwiaW5saW5lXCIpO1xuICAgICAgICAgICAgLy8gc2hvdyB0aGUgcGFydG5lciByYW5rIChhY2Ugb3Iga2luZykgYmVpbmcgYXNrZWRcbiAgICAgICAgICAgIGZvcihsZXQgcmFua0VsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lci1yYW5rJykpXG4gICAgICAgICAgICAgICAgcmFua0VsZW1lbnQuaW5uZXJIVE1MPUxhbmd1YWdlLkRVVENIX1JBTktfTkFNRVNbcGFydG5lclJhbmtdO1xuICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUik7ICAgIFxuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihjaG9zZW5QYXJ0bmVyU3VpdGU+PTApe1xuICAgICAgICAgICAgaWYoIXRoaXMuX2dhbWUpcmV0dXJuIGFsZXJ0KGJ1ZyhcIkhldCBzcGVsIGlzIHZlcmR3ZW5lbiFcIikpO1xuICAgICAgICAgICAgLy8gTURIQDA3RkVCMjAyMDogYSBzaG9ydGN1dCBvZiBzZW5kaW5nIHRoZSBjaG9zZW4gcGFydG5lciBzdWl0ZVxuICAgICAgICAgICAgdGhpcy5fZ2FtZS5wYXJ0bmVyU3VpdGVDaG9zZW4oY2hvc2VuUGFydG5lclN1aXRlKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIHNldEluZm8oXCJFciB3b3JkdCBvcCBkZSBrbGV1ciB2YW4gZGUgbWVlIHRlIHZyYWdlbiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW3BhcnRuZXJSYW5rXStcIiBnZXdhY2h0LlwiKTtcbiAgICB9XG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSByZXBsYWNlZCB2ZXJzaW9uIGV4Y2VwdCB3ZSBub3cgd2FudCB0byByZWNlaXZlIHRoZSB0cmljayBpdHNlbGZcbiAgICBwbGF5QUNhcmQoKXtcbiAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogdGhpcyBpcyBhIHJlcXVlc3QgZnJvbSB0aGUgc2VydmVyIHRvIHBsYXkgYSBjYXJkIHdoaWNoIGNvdWxkIGJlIGEgcmVxdWVzdCB0byByZXBsYXkgYSBjYXJkICh0aGF0IHdhc24ndCByZWNlaXZlZCBzb21laG93KVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIHVzaW5nIHdlIGEgZmxhZyB3ZSBrZWVwIHRyYWNrIG9mIHRoZSByZXF1ZXN0IGNvdW50LCB3ZSB0b2dnbGUgdGhlIHNpZ24gdG8gaW5kaWNhdGUgdGhhdCBhIGNob2ljZSB3YXMgYWxyZWFkeSBtYWRlXG4gICAgICAgIC8vIGVycm9yIGhhbmRsaW5nIGZpcnN0IFRPRE8gdGhlc2UgZXJyb3JzIGluZGljYXRlIGJ1Z3MgYW5kIHRoZXJlZm9yZSBhcmUgaW5yZWNvdmVyYWJsZSEhISFcbiAgICAgICAgbGV0IHRyaWNrPSh0aGlzLmdhbWU/dGhpcy5nYW1lLl90cmljazpudWxsKTtcbiAgICAgICAgaWYoIXRyaWNrKXJldHVybiBidWcoXCJEZSBzbGFnIG9udGJyZWVrdCFcIik7XG4gICAgICAgIGlmKHRyaWNrLm51bWJlck9mQ2FyZHM+MCYmdHJpY2sucGxheVN1aXRlPDApcmV0dXJuIGJ1ZyhcIkRlIHRlIHNwZWxlbiBrbGV1ciBpcyBvbmJla2VuZCFcIik7XG4gICAgICAgIHRvUGxheUFDYXJkKys7XG4gICAgICAgIGlmKHRvUGxheUFDYXJkPT09MSl7IC8vIGZpcnN0IHJlcXVlc3QsIG5vIGNhcmQgd2FzIHBsYXllZCBzbyBmYXJcbiAgICAgICAgICAgIHBsYXllZENhcmRJbmZvPW51bGw7IC8vIGluaXRpYWxpemUgY2FyZFBsYXllZCB0byBudWxsXG4gICAgICAgICAgICBmb3JjZUZvY3VzKHRoaXMubmFtZSk7XG4gICAgICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiOyAvLyBoaWRlIHRoZSB3YWl0LWZvci1wbGF5IGVsZW1lbnRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVZJU0lCTEU7IC8vIHNob3cgdGhlIHBsYXkgZWxlbWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIE1ESEAxOUpBTjIwMjA6IGFsbG93IHRoZSBjdXJyZW50IHBsYXllciB0byBwbGF5IGEgY2FyZCBieSBjbGlja2luZyBvbmVcbiAgICAgICAgICAgIC8vIE1ESEAwNUZFQjIwMjAgcmVtb3ZpbmcgYmVjYXVzZSB3ZSdyZSBrZWVwaW5nIGFsbCBjYXJkcyBjbGlja2FibGUgYW5kIHN0b3AgdGhlbSBwcm9ncmFtbWF0aWNhbGx5IGZyb20gZG9pbmcgaGFybTogdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gcmVhZHkgdG8gcm9jayAnbicgcm9sbFxuICAgICAgICAgICAgLy8gTURIQDA1RkVCMjAyMCBvdmVya2lsbDogc2V0SW5mbyhcIlNwZWVsIGVlbiBcIisodHJpY2sucGxheVN1aXRlPj0wP0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3RyaWNrLnBsYXlTdWl0ZV06XCJrYWFydFwiKStcIi5cIik7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGEgbmV3IHRyaWNrIHVwZGF0ZSB0aGUgdHJpY2tzIHBsYXllZCB0YWJsZSB3aXRoIHRoZSBwcmV2aW91cyB0cmlja1xuICAgICAgICAgICAgLy8gaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgIC8qIHNlZSBzaG93VHJpY2soKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW4tYXNrLWZvci1wYXJ0bmVyLWNhcmQtYmxpbmRcIikuc3R5bGUuZGlzcGxheT0odHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmRCbGluZD9cImJsb2NrXCI6XCJub25lXCIpO1xuICAgICAgICAgICAgLy8gYWx3YXlzIHN0YXJ0IHVuY2hlY2tlZC4uLlxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stZm9yLXBhcnRuZXItY2FyZC1ibGluZFwiKS5jaGVja2VkPWZhbHNlOyAvLyB3aGVuIGNsaWNrZWQgc2hvdWxkIGdlbmVyYXRlIFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjAgbW92ZWQgb3ZlciB0byB3aGVyZSBHQU1FX0lORk8gZXZlbnQgaXMgcmVjZWl2ZWQhISEhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtaW5mb1wiKS5pbm5lckhUTUw9Z2V0R2FtZUluZm8oKTsgLy8gdXBkYXRlIHRoZSBnYW1lIGluZm8gKHBsYXllciBzcGVjaWZpYylcbiAgICAgICAgICAgIC8vIG9ic29sZXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQtcGxheWVyXCIpLmlubmVySFRNTD10aGlzLm5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPSh0cmljay5wbGF5U3VpdGU+PTA/XCJTcGVlbCBlZW4gXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXS50b0xvd2VyQ2FzZSgpK1wiIGJpai5cIjpcIktvbSBtYWFyIHVpdCFcIik7XG4gICAgICAgICAgICBsZXQgbnVtYmVyT2ZUcmlja3NXb249dGhpcy5nZXROdW1iZXJPZlRyaWNrc1dvbigpOyAvLyBhbHNvIGluY2x1ZGVzIHRob3NlIHdvbiBieSB0aGUgcGFydG5lciAoYXV0b21hdGljYWxseSlcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgdHJpY2tzIHdvbiBieSB0aGUgcGFydG5lclxuICAgICAgICAgICAgbGV0IHBhcnRuZXJOYW1lPXRoaXMuX2dhbWUuZ2V0UGFydG5lck5hbWUodGhpcy5faW5kZXgpO1xuICAgICAgICAgICAgLy8gaWYocGFydG5lciludW1iZXJPZlRyaWNrc1dvbis9cGxheWVyLmdldE51bWJlck9mVHJpY2tzV29uKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrcy13b24tc28tZmFyXCIpLmlubmVySFRNTD1nZXROdW1iZXJPZlRyaWNrc1dvblRleHQobnVtYmVyT2ZUcmlja3NXb24pKyhwYXJ0bmVyTmFtZT9cIiAoc2FtZW4gbWV0IFwiK3BhcnRuZXJOYW1lK1wiKVwiOlwiXCIpO1xuICAgICAgICAgICAgLy8gc2hvdyB0aGUgbnVtYmVyIG9mIHRyaWNrcyB0aGlzIHBsYXllciBpcyBzdXBwb3NlZCB0byB3aW4gaW4gdG90YWxcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2tzLXRvLXdpblwiKS5pbm5lckhUTUw9Z2V0TnVtYmVyT2ZUcmlja3NUb1dpblRleHQodGhpcy5fbnVtYmVyT2ZUcmlja3NUb1dpbixwYXJ0bmVyTmFtZSx0aGlzLl9nYW1lLmdldEhpZ2hlc3RCaWQoKSk7XG4gICAgICAgICAgICB0aGlzLl9jYXJkPW51bGw7IC8vIGdldCByaWQgb2YgYW55IGN1cnJlbnRseSBjYXJkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gUGxheWVyICdcIit0aGlzLm5hbWUrXCInIHNob3VsZCBwbGF5IGEgY2FyZCFcIik7XG4gICAgICAgICAgICAvLyBzZXRJbmZvKFwiV2Vsa2UgXCIrKHRyaWNrLnBsYXlTdWl0ZT49MD9MYW5ndWFnZS5EVVRDSF9TVUlURV9OQU1FU1t0cmljay5wbGF5U3VpdGVdOlwia2FhcnRcIikrXCIgd2lsIGplIFwiKyh0cmljay5udW1iZXJPZkNhcmRzPjA/XCJiaWpcIjpcIlwiKStcInNwZWxlbj9cIik7XG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHM9dGhpcy5fZ2V0U3VpdGVDYXJkcygpKTsgLy8gcmVtZW1iZXIgdGhlIHN1aXRlIGNhcmRzISEhIVxuICAgICAgICAgICAgLy8gc2hvdyB0aGUgdHJpY2sgKHJlbWVtYmVyZWQgaW4gdGhlIHByb2Nlc3MgZm9yIHVzZSBpbiBjYXJkUGxheWVkIGJlbG93KSBmcm9tIHRoZSB2aWV3cG9pbnQgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgICAgICAvLy8vLyBzaG93VHJpY2sodGhpcy5fdHJpY2s9dHJpY2spOyAvLyBNREhAMTFKQU4yMDIwOiBubyBuZWVkIHRvIHBhc3MgdGhlIHBsYXllciBpbmRleCAoYXMgaXQgaXMgYWx3YXlzIHRoZSBzYW1lKVxuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZWRDYXJkSW5mbyl7IC8vIGEgY2FyZCBoYXMgYmVlbiBjaG9vc2VuIGJ5IHRoaXMgcGxheWVyIHRvIHBsYXkgYnV0IGFwcGFyZW50bHkgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldFxuICAgICAgICAgICAgLy8gc2VuZCB0aGUgY2FyZCBwbGF5ZWQgYWdhaW5cbiAgICAgICAgICAgIGxldCBlcnJvcj10aGlzLl9zZXRDYXJkKC4uLnBsYXllZENhcmRJbmZvKTtcbiAgICAgICAgICAgIGlmKGVycm9yIGluc3RhbmNlb2YgRXJyb3Ipe1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydCAoXCIrZ2V0TG9jYWxlQ2FyZFRleHQocGxheWFibGVDYXJkSW5mb1swXSkrXCIpIG1pc2x1a3QhIEZvdXQ6IFwiK2Vycm9yLm1lc3NhZ2UrXCIuXCIsXCJTcGVsZXJcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogXCIsZXJyb3IpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKGdldExvY2FsZUNhcmRUZXh0KHBsYXlhYmxlQ2FyZEluZm9bMF0pKStcIiBvcG5pZXV3IHZlcnN0dXVyZCFcIixcIlNwZWxlclwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhcmQgcGxheWVkIHNlbmQgYWdhaW4uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgamUga2FhcnQhXCIsXCJTZXJ2ZXJcIik7XG4gICAgfVxuXG4gICAgLy8gX2NhcmRQbGF5ZWRXaXRoU3VpdGVBbmRJbmRleCByZXBsYWNlZCBieSBfZ2V0Q2FyZFdpdGhTdWl0ZUFuZEluZGV4KCkgY29tYmluZWQgd2l0aCBfY2FyZFBsYXllZFxuXG4gICAgX2dldENhcmRXaXRoU3VpdGVBbmRJbmRleChzdWl0ZSxpbmRleCl7cmV0dXJuKHN1aXRlPHRoaXMuX3N1aXRlQ2FyZHMubGVuZ3RoJiZ0aGlzLl9zdWl0ZUNhcmRzW3N1aXRlXS5sZW5ndGg/dGhpcy5fc3VpdGVDYXJkc1tzdWl0ZV1baW5kZXhdOm51bGwpO31cbiAgICAvLyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBfY2FyZFBsYXllZCgpIGRlZmluZWQgaW4gdGhlIGJhc2UgY2xhc3MgUGxheWVyIHdoaWNoIGluZm9ybXMgdGhlIGdhbWVcbiAgICAvLyBOT1RFIGNhcmRQbGF5ZWQgaXMgYSBnb29kIHBvaW50IGZvciBjaGVja2luZyB0aGUgdmFsaWRpdHkgb2YgdGhlIGNhcmQgcGxheWVkXG4gICAgLy8gTk9URSBjYW4ndCB1c2UgX2NhcmRQbGF5ZWQgKHNlZSBQbGF5ZXIgc3VwZXJjbGFzcylcbiAgICAvLyBNREhAMjBKQU4yMDIwOiBkZWNpZGluZyB0byByZXR1cm4gdHJ1ZSBvbiBhY2NlcHRhbmNlLCBmYWxzZSBvdGhlcndpc2VcbiAgICBfbmV3Q2FyZFBsYXllZChjYXJkKXtcbiAgICAgICAgaWYoY2FyZCl7XG4gICAgICAgICAgICAvLyBUT0RPIGNoZWNraW5nIHNob3VsZCBOT1QgYmUgZG9uZSBieSB0aGUgcGxheWVyIEJVVCBieSB0aGUgdHJpY2sgaXRzZWxmISEhXG4gICAgICAgICAgICAvLyBCVUcgRklYOiBkbyBOT1QgZG8gdGhlIGZvbGxvd2luZyBoZXJlLCBidXQgb25seSBhdCB0aGUgc3RhcnQgb2YgYSB0cmljaywgb3IgTk9UIGF0IGFsbCEhISEhXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy90aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wOyAvLyAtMSB3aGVuIGFza2luZyBibGluZCwgMCBub3QgYXNraW5nLCAxIGlmIGFza2luZ1xuICAgICAgICAgICAgLy8gQ0FOJ1QgY2FsbCBfc2V0Q2FyZCAoaW4gYmFzZSBjbGFzcyBQbGF5ZXIpIGlmIHRoZSBjYXJkIGNhbm5vdCBiZSBwbGF5ZWQhISFcbiAgICAgICAgICAgIGxldCB0cmljaz10aGlzLmdhbWUuX3RyaWNrOyAvLyBNREhAMTlKQU4yMDIwOiBlYXNpZXN0IHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdHJpY2tcbiAgICAgICAgICAgIGlmKCF0cmljaylyZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBzbGFnIG9tIGVlbiBrYWFydCBpbiBiaWogdGUgc3BlbGVuLlwiKTtcbiAgICAgICAgICAgIGxldCBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0wO1xuICAgICAgICAgICAgaWYodHJpY2subnVtYmVyT2ZDYXJkcz09MCl7IC8vIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZW9yZXRpY2FsbHkgdGhlIGNhcmQgY2FuIGJlIHBsYXllZCBidXQgaXQgbWlnaHQgYmUgdGhlIGNhcmQgd2l0aCB3aGljaCB0aGUgcGFydG5lciBjYXJkIGlzIGFza2VkISFcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGlzIGEgZ2FtZSB3aGVyZSB0aGVyZSdzIGEgcGFydG5lciBjYXJkIHRoYXQgaGFzbid0IGJlZW4gcGxheWVkIHlldFxuICAgICAgICAgICAgICAgIC8vIGFsdGVybmF0aXZlbHkgcHV0OiBzaG91bGQgdGhlcmUgYmUgYSBwYXJ0bmVyIGFuZCB0aGVyZSBpc24ndCBvbmUgeWV0Pz8/Pz9cbiAgICAgICAgICAgICAgICAvLyBCVUcgRklYOiBzdGlsbCB1c2luZyBnZXRUcnVtcFBsYXllcigpIGhlcmUgYWx0aG91Z2ggaXQgd2Fzbid0IGRlZmluZWQgYXQgYWxsIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgbm93IGNvcGllZCBvdmVyIGZyb20gUmlra2VuVGhlR2FtZS5qcyEhISAoYXMgaXQgaXMgY29tcHV0ZWQpXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5nZXRUcnVtcFBsYXllcigpPT10aGlzLl9pbmRleCl7IC8vIHRoaXMgaXMgdHJ1bXAgcGxheWVyIHBsYXlpbmcgdGhlIGZpcnN0IGNhcmRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPj4+PiBDSEVDS0lORyBXSEVUSEVSIEFTS0lORyBGT1IgVEhFIFBBUlRORVIgQ0FSRCA8PDw8XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gdGhlIHRydW1wIHBsYXllciBhc2sgZm9yIHRoZSBwYXJ0bmVyIGNhcmQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgdHJ1bXAgcGxheWVyIGRvZXMgbm90IGhhdmUgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRyaWNrLmNhbkFza0ZvclBhcnRuZXJDYXJkPjApeyAvLyBub24tYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIGJlIGRldGVjdGVkIGJ5IHRoZSBnYW1lIHByZWZlcmFibHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGU9PT10aGlzLl9nYW1lLmdldFBhcnRuZXJTdWl0ZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2tpbmdGb3JQYXJ0bmVyQ2FyZD0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9hbGVydChcIlxcdE5PTl9CTElORFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYodHJpY2suY2FuQXNrRm9yUGFydG5lckNhcmQ8MCl7IC8vIGNvdWxkIGJlIGJsaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY2hlY2tib3ggaXMgc3RpbGwgc2V0IGkuZS4gdGhlIHVzZXIgZGlkbid0IHVuY2hlY2sgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlIHdpbGwgYmUgYXNraW5nIGZvciB0aGUgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwIEJVRyBGSVg6IHdhcyB1c2luZyBhc2stcGFydG5lci1jYXJkLWJsaW5kIGluc3RlYWQgb2YgYXNrLXBhcnRuZXItY2FyZC1jaGVja2JveCEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLmNoZWNrZWQmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJkLnN1aXRlIT09dGhpcy5fZ2FtZS5nZXRUcnVtcFN1aXRlKCl8fGNvbmZpcm0oXCJXaWx0IFUgZGUgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fZ2FtZS5nZXRQYXJ0bmVyU3VpdGUoKV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9nYW1lLmdldFBhcnRuZXJSYW5rKCldK1wiIChibGluZCkgdnJhZ2VuIG1ldCBlZW4gdHJvZWY/XCIpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNraW5nRm9yUGFydG5lckNhcmQ9LTE7IC8vIHllcywgYXNraW5nIGJsaW5kISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vL2FsZXJ0KFwiXFx0QkxJTkQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLyphbGVydChcIk5vdCBpbmRpY2F0ZWQhISEhXCIpKi87XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHRoZSBmaXJzdCBwbGF5ZXIgY2FuIHBsYXkgc3BhZGVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0cmljay5fZmlyc3RQbGF5ZXJDYW5QbGF5U3BhZGVzJiZzdWl0ZT09PUNhcmQuU1VJVEVfU1BBREUpeyAvLyBzcGFkZSBpcyBiZWluZyBwbGF5ZWQgYnkgdGhlIGZpcnN0IHBsYXllciB3aGVyZWFzIHRoYXQgaXMgbm90IGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TnVtYmVyT2ZDYXJkc1dpdGhTdWl0ZShDYXJkLlNVSVRFX1NQQURFKTx0aGlzLm51bWJlck9mQ2FyZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgbmlldCBtZXQgc2Nob3BwZW4gdWl0a29tZW4sIHdhbnQgZGUgc2Nob3BwZW4gdnJvdXcgaXMgbm9nIG5pZXQgb3BnZWhhYWxkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNleyAvLyBub3QgdGhlIGZpcnN0IGNhcmQgaW4gdGhlIHRyaWNrIHBsYXllZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYXJkIG5lZWRzIHRvIGJlIHRoZSBzYW1lIHN1aXRlIGFzIHRoZSBwbGF5IHN1aXRlIChpZiB0aGUgcGxheWVyIGhhcyBhbnkpXG4gICAgICAgICAgICAgICAgaWYoY2FyZC5zdWl0ZSE9PXRyaWNrLnBsYXlTdWl0ZSYmdGhpcy5nZXROdW1iZXJPZkNhcmRzV2l0aFN1aXRlKHRyaWNrLnBsYXlTdWl0ZSk+MClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkplIGt1bnQgXCIrZ2V0TG9jYWxlQ2FyZFRleHQoY2FyZCkrXCIgbmlldCBzcGVsZW4sIHdhbnQgXCIrTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdHJpY2sucGxheVN1aXRlXStcIiBpcyBnZXZyYWFnZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBiZWluZyBhc2tlZCBmb3IgdGhlIHBhcnRuZXIgY2FyZCB0aGF0IHdvdWxkIGJlIHRoZSBjYXJkIHRvIHBsYXkhXG4gICAgICAgICAgICAgICAgaWYodHJpY2suYXNraW5nRm9yUGFydG5lckNhcmQhPTApe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydG5lclN1aXRlPXRoaXMuX2dhbWUuZ2V0UGFydG5lclN1aXRlKCkscGFydG5lclJhbms9dGhpcy5fZ2FtZS5nZXRQYXJ0bmVyUmFuaygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmNvbnRhaW5zQ2FyZChwYXJ0bmVyU3VpdGUscGFydG5lclJhbmspKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhcmQuc3VpdGUhPT1wYXJ0bmVyU3VpdGV8fGNhcmQucmFuayE9PXBhcnRuZXJSYW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJKZSBrdW50IFwiK2dldExvY2FsZUNhcmRUZXh0KGNhcmQpK1wiIG5pZXQgc3BlbGVuLCB3YW50IGRlIFwiK0xhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW3BhcnRuZXJTdWl0ZV0rXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1twYXJ0bmVyUmFua10rXCIgaXMgZ2V2cmFhZ2QuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTURIQDA1RkVCMjAyMDogYXQgdGhpcyBwb2ludCB0aGUgY2FyZCBwbGF5ZWQgd2FzIGFjY2VwdGVkICh0aGVvcmV0aWNhbGx5KSwgaXQgb25seSBuZWVkcyB0byBiZSBzZW50IHN1Y2Nlc3NmdWxseSB0byB0aGUgc2VydmVyLCBhbmQgcmV0dXJuZWQgYXMgcGxheWVkIGNhcmRcbiAgICAgICAgICAgIHBsYXllZENhcmRJbmZvPVtjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkXTsgLy8gYnkgcmVtZW1iZXJpbmcgdGhlIGNhcmQgYmVpbmcgcGxheWVkIGhlcmUgYW5kIG5vdyB3ZSBibG9jayBmdXJ0aGVyIGF0dGVtcHRzIGZvciBhIHBsYXllciB0byBjaGFuZ2UgdGhlIGNhcmQgKHMpaGUgcGxheWVkXG4gICAgICAgICAgICAvLyBNREhAMTRKQU4yMDIwOiB3ZSBoYXZlIHRvIGFsc28gcmV0dXJuIHdoYXRldmVyIHRyaWNrIHZhbHVlIHRoYXQgbWlnaHQndmUgY2hhbmdlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgd2hpY2ggaW4gdGhpcyBjYXNlIGNvdWxkIHdlbCBiZSB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgJ2ZsYWcnXG4gICAgICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBJIHN1Z2dlc3QgY2hhbmdpbmcgYXNraW5nRm9yUGFydG5lckNhcmQgdG8gYXNraW5nRm9yUGFydG5lckNhcmQ8MCBpLmUuIGJsaW5kIHJlcXVlc3QhISFcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHdlJ3JlIHRha2luZyBjYXJlIG9mIHRoYXQgd2hlbiBDQVJEIGlzIHNlbnQgKHNvIG5vdCB0byBpbnRlcmZlcmUgd2l0aCBSaWtrZW5UaGVHYW1lLmpzIGl0c2VsZilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXRDYXJkKGNhcmQsYXNraW5nRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAgICAgLyogTURIQDI3SkFOMjAyMDogcmVtb3ZpbmcgdGhlIGZvbGxvd2luZyBtaWdodCBiZSB3cm9uZyBCVVQgYnkgcGFzc2luZyBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwgcGxheWVycyBpbmNsdWRpbmcgbXlzZWxmIHdpbGwgcmVjZWl2ZSB0aGUgY2FyZCBwbGF5ZWQgYW5kIHVwZGF0ZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW5nbHksIGJhc2ljYWxseSBhZGRDYXJkKCkgd2lsbCBzZXQgaXQgdG8gMSBpZiBpdCBzbyBkZXRlY3RzLCBidXQgY2Fubm90IHNldCBpdCB0byAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGVjaG5pY2FsbHkgYXNraW5nRm9yUGFydG5lckNhcmQgb25seSBuZWVkcyB0byBiZSBzZW5kIHdoZW4gdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZFxuICAgICAgICAgICAgaWYoZXJyb3IpcmV0dXJuIG5ldyBFcnJvcihcIkVyIGlzIGVlbiBmb3V0IG9wZ2V0cmVkZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGRlIGdlc3BlZWxkZSBrYWFydC5cIik7XG4gICAgICAgICAgICB0cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1hc2tpbmdGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiR2VlbiBrYWFydCBnZXNwZWVsZCFcIik7XG4gICAgfVxuICAgIF9jYXJkUGxheWVkV2l0aFN1aXRlQW5kSW5kZXgoc3VpdGUsaW5kZXgpe2J1ZyhcIkRlemUgbWV0aG9kZSBtYWcgbmlldCBtZWVyIHdvcmRlbiBhYW5nZXJvZXBlbi5cIik7fVxuXG4gICAgcGxheXNUaGVHYW1lQXRJbmRleChnYW1lLGluZGV4KXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICBpZighZ2FtZSl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlByb2dyYW1tYWZvdXQ6IEhldCBzcGVsIGthbiBuaWV0IHdvcmRlbiB2ZXJsYXRlbiwgYWxzIGhldCBuaWV0IGFmZ2Vsb3BlbiBpcyAodG9lc3RhbmQ6IFwiK3RoaXMuX2dhbWUuc3RhdGUrXCIpLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighdGhpcy5fZ2FtZS5kb25lKCkpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlZlcmxhdGVuIHZhbiBoZXQgc3BlbCBtaXNsdWt0ISBQcm9iZWVyIGhldCBub2cgZWVucy5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lcj0tMTtcbiAgICAgICAgICAgICAgICAvLyBvdGhlciB0aGluZ3MgdG8gZG8/Pz8/Pz8/XG4gICAgICAgICAgICAgICAgaWYodGhpcy5udW1iZXJPZkNhcmRzPjApe1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRGUgb3ZlcmdlYmxldmVuIGthYXJ0ZW4gaW4gamUgaGFuZCB3b3JkZW4gdmVyd2lqZGVyZCFcIixcIlNwZWxcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUNhcmRzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHNlbmRpbmcgdGhlIERPTkUgZXZlbnQgc3VjY2VlZHMgcmVhZHkgYWdhaW4gdG8gcGxheSBpbiBhIG5leHQgZ2FtZSAod2l0aG91dCBsZWF2aW5nIHRoZSBnYW1lIHBsYXlpbmcpXG4gICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdXBlci5wbGF5c1RoZUdhbWVBdEluZGV4KGdhbWUsaW5kZXgpO1xuICAgIH1cbiAgICAvLyBjYWxsIHJlbmRlckNhcmRzIGp1c3QgYWZ0ZXIgdGhlIHNldCBvZiBjYXJkcyBjaGFuZ2VcbiAgICByZW5kZXJDYXJkcygpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKiBSZW5kZXJpbmcgcGxheWVyIGNhcmRzICoqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICB0aGlzLl9zdWl0ZUNhcmRzPXRoaXMuX2dldFN1aXRlQ2FyZHMoKTtcbiAgICAgICAgLy8gVE9ETyBwcm9iYWJseSBiZXN0IHRvIHNob3cgdGhlbSBvbiBBTEwgcGFnZXMgKG5vIG1hdHRlciB3aGljaCBvbmUgaXMgY3VycmVudGx5IHNob3dpbmchKVxuICAgICAgICB1cGRhdGVCaWRkZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVQbGF5ZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICB1cGRhdGVDaG9vc2VUcnVtcFN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7XG4gICAgICAgIHVwZGF0ZUNob29zZVBhcnRuZXJTdWl0ZUNhcmRzKHRoaXMuX3N1aXRlQ2FyZHMpO1xuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIHN3aXRjaChjdXJyZW50UGFnZSl7XG4gICAgICAgICAgICBjYXNlIFwicGFnZS1iaWRkaW5nXCI6dXBkYXRlQmlkZGVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhazsgLy8gdHlwaWNhbGx5IG9ubHkgb25jZVxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtcGxheWluZ1wiOnVwZGF0ZVBsYXllclN1aXRlQ2FyZHModGhpcy5fc3VpdGVDYXJkcyk7YnJlYWs7IC8vIHR5cGljYWxseSBhZnRlciBwbGF5aW5nIGEgY2FyZCEhXG4gICAgICAgICAgICBjYXNlIFwicGFnZS10cnVtcC1jaG9vc2luZ1wiOnVwZGF0ZUNob29zZVRydW1wU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLXBhcnRuZXItY2hvb3NpbmdcIjp1cGRhdGVDaG9vc2VQYXJ0bmVyU3VpdGVDYXJkcyh0aGlzLl9zdWl0ZUNhcmRzKTticmVhaztcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH1cbiAgICAvLyBleGl0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiBhIHBsYXllciBzdG9wcyBwbGF5aW5nXG4gICAgLy8gZWl0aGVyIGJ5IGV4cGxpY2l0bHkgdXNpbmcgdGhlIHN0b3AgYnV0dG9uKHMpIG9yIGxlYXZpbmcvY2xvc2luZyB0aGUgcGFnZVxuICAgIC8vIFRPRE8gc2hvdWxkIHdlIG51bGwgdGhlIGdhbWU/Pz8/Pz8/P1xuICAgIGV4aXQocmVhc29uKXtcbiAgICAgICAgaWYodGhpcy5fZ2FtZSl7XG4gICAgICAgICAgICB0aGlzLl9nYW1lLmV4aXQocmVhc29uKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWU9bnVsbDsgLy8gVE9ETyBvciBhbnkgb3RoZXIgd2F5IHRvIGluZGljYXRlIHRvIGluZGljYXRlIHRoYXQgdGhlIHBsYXllciBzdG9wcGVkIHBsYXlpbmdcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gYnV0dG9uIGNsaWNrIGV2ZW50IGhhbmRsZXJzXG4vKipcbiAqIGNsaWNraW5nIGEgYmlkIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiBiaWQgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBiaWRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBNREhAMDNGRUIyMDIwOiBwcmV2ZW50IG1ha2luZyBhIGJpZCB3aGVuIG5vdCBzdXBwb3NlZCB0byBkbyBzb1xuICAgIGlmKHRvTWFrZUFCaWQ8PTApcmV0dXJuIGFsZXJ0KFwiSmUgbWFnIG51IG5pZXQgYmllZGVuISBIZXQgd2FjaHRlbiBpcyBvcCBlZW4gc2VpbnRqZSB2YW4gZGUgc2VydmVyLlwiKTtcbiAgICAvLyBNREhAMDdGRUIyMDIwOiBPT1BTLCBiaWRNYWRlIGNhbiBiZSAwIHdoaWNoIHdvdWxkIGJlIGNvbnNpZGVyZWQgYSBmYWxzeSB2YWx1ZSBzbyB3ZSBzaG91bGQgbm90IHVzZSBiaWRNYWRlIGl0c2VsZiBhcyBjb25kaXRpb24hISEhXG4gICAgaWYoYmlkTWFkZT49MClyZXR1cm4gYWxlcnQoXCJKZSBoZWJ0IGFsIGVlbiBib2QgdWl0Z2VicmFjaHQhXCIpO1xuICAgIHRyeXtcbiAgICAgICAgbGV0IGJpZD1wYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtYmlkXCIpKTtcbiAgICAgICAgaWYoaXNOYU4oYmlkKXx8YmlkPDApcmV0dXJuIGFsZXJ0KGJ1ZyhcIkplIGJvZCAoXCIrKGJpZD9DYXJkLkJJRF9OQU1FU1tiaWRdOlwiP1wiKStcIiBpcyBvbmdlbGRpZyFcIikpO1xuICAgICAgICBiaWRNYWRlPWJpZDsgLy8gcmVtZW1iZXIgdGhlIGJpZCBpbiBjYXNlIHdlIG5lZWQgdG8gc2VuZCBpdCBhZ2FpblxuICAgICAgICBsZXQgZXJyb3I9Y3VycmVudFBsYXllci5fc2V0QmlkKGJpZE1hZGUpOyAvLyB0aGUgdmFsdWUgb2YgdGhlIGJ1dHRvbiBpcyB0aGUgbWFkZSBiaWRcbiAgICAgICAgaWYoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAgICAgICAgIHNldEluZm8oXCJQcm9ibGVtZW4gYmlqIGhldCB2ZXJzdHVyZW4gdmFuIGplIGJvZDogXCIrZXJyb3IubWVzc2FnZStcIi4gV2UgYmxpanZlbiBoZXQgcHJvYmVyZW4uXCIsXCJTcGVsXCIpO1xuICAgICAgICBlbHNlIC8vIGJpZCBkb25lISEhXG4gICAgICAgICAgICBzZXRJbmZvKFwiQm9kIHZlcnN0dXVyZCFcIixcIlNwZWxcIik7XG4gICAgfWNhdGNoKGVycil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9ZmluYWxseXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9KGJpZE1hZGU+PTA/XCJoaWRkZW5cIjpWSVNJQkxFKTsgLy8gc2hvdyBhZ2FpblxuICAgICAgICBpZihiaWRNYWRlPj0wKWZvcmNlRm9jdXMobnVsbCk7XG4gICAgfVxufVxuLyoqXG4gKiBjbGlja2luZyBhIHRydW1wIHN1aXRlIGJ1dHRvbiByZWdpc3RlcnMgdGhlIGNob3NlbiB0cnVtcCBzdWl0ZSB3aXRoIHRoZSBjdXJyZW50IHBsYXllciBcbiAqIEBwYXJhbSB7Kn0gZXZlbnQgXG4gKi9cbmZ1bmN0aW9uIHRydW1wU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIE9PUFMgdXNpbmcgcGFyc2VJbnQoKSBoZXJlIGlzIFNPT09PIGltcG9ydGFudFxuICAgIGlmKHRvQ2hvb3NlVHJ1bXBTdWl0ZTw9MClyZXR1cm4gYWxlcnQoXCJKZSBtYWcgbnUgZ2VlbiB0cm9lZmtsZXVyIGtpZXplbi4gSGV0IHdhY2h0ZW4gaXMgb3AgZWVuIHNlaW50amUgdmFuIGRlIHNlcnZlci5cIik7XG4gICAgaWYoY2hvc2VuVHJ1bXBTdWl0ZT49MClyZXR1cm4gYWxlcnQoXCJKZSBoZWJ0IGRlIHRyb2Vma2xldXIgYWwgZ2Vrb3plbiFcIik7XG4gICAgbGV0IHRydW1wU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBpZihpc05hTih0cnVtcFN1aXRlKXx8dHJ1bXBTdWl0ZTwwKXJldHVybiBhbGVydChidWcoXCJPbmdlbGRpZ2UgdHJvZWZrbGV1ciFcIikpO1xuICAgIHRyeXtcbiAgICAgICAgY3VycmVudFBsYXllci5fc2V0VHJ1bXBTdWl0ZSh0cnVtcFN1aXRlKTtcbiAgICAgICAgY2hvc2VuVHJ1bXBTdWl0ZT10cnVtcFN1aXRlO1xuICAgIH1jYXRjaChlcnIpe1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfWZpbmFsbHl7XG4gICAgICAgIGlmKGNob3NlblRydW1wU3VpdGU+PTApe1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cnVtcC1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnVtcCBzdWl0ZSBcIitjaG9zZW5UcnVtcFN1aXRlK1wiIGNob3Nlbi5cIik7ICAgIFxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBpZih0b0Nob29zZVBhcnRuZXJTdWl0ZTw9MClyZXR1cm4gYWxlcnQoXCJKZSBtYWcgZGUga2xldXIgdmFuIGRlIG1lZWdldnJhYWdkZSBrYWFydCBudSBuaWV0IGtpZXplbi4gSGV0IHdhY2h0ZW4gaXMgb3AgZWVuIHNlaW50amUgdmFuIGRlIHNlcnZlci5cIik7XG4gICAgaWYoY2hvc2VuUGFydG5lclN1aXRlPj0wKXJldHVybiBhbGVydChcIkplIGhlYnQgZGUga2xldXIgdmFuIGRlIG1lZWdldnJhYWdkZSBrYWFydCBhbCBnZWtvemVuIVwiKTtcbiAgICAvLyBlaXRoZXIgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZSBzZWxlY3RlZFxuICAgIC8vIHBhcnNlSW50IFZFUlkgSU1QT1JUQU5UISEhIVxuICAgIGxldCBwYXJ0bmVyU3VpdGU9cGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN1aXRlXCIpKTtcbiAgICBpZihpc05hTihwYXJ0bmVyU3VpdGUpfHxwYXJ0bmVyU3VpdGU8MClyZXR1cm4gYWxlcnQoYnVnKFwiS2xldXIgdmFuIGRlIG1lZWdldnJhYWdkZSBrYWFydCBvbmdlbGRpZyFcIikpO1xuICAgIHRyeXtcbiAgICAgICAgY3VycmVudFBsYXllci5fc2V0UGFydG5lclN1aXRlKHBhcnRuZXJTdWl0ZSk7XG4gICAgICAgIGNob3NlblBhcnRuZXJTdWl0ZT1wYXJ0bmVyU3VpdGU7XG4gICAgfWNhdGNoKGVycil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9ZmluYWxseXtcbiAgICAgICAgaWYoY2hvc2VuUGFydG5lclN1aXRlPj0wKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFydG5lci1zdWl0ZS1pbnB1dFwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgICAgICBmb3JjZUZvY3VzKG51bGwpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIHN1aXRlIFwiK2Nob3NlblBhcnRuZXJTdWl0ZStcIiBjaG9zZW4uXCIpOyAgICBcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHBsYXlhYmxlY2FyZENlbGwscGxheWFibGVjYXJkQ2VsbENvbnRlbnRzO1xuLyoqXG4gKiBjbGlja2luZyBhIHBhcnRuZXIgc3VpdGUgYnV0dG9uIHJlZ2lzdGVycyB0aGUgY2hvc2VuIHBhcnRuZXIgc3VpdGUgd2l0aCB0aGUgY3VycmVudCBwbGF5ZXIgXG4gKiBAcGFyYW0geyp9IGV2ZW50IFxuICovXG5mdW5jdGlvbiBwbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkKGV2ZW50KXtcbiAgICBcbiAgICAvLyBNREhAMDVGRUIyMDIwOiBwcmV2ZW50IGZyb20gcGxheWluZyBhIGNhcmQgd2hlbiBhIGNhcmQgaGFzIGFscmVhZHkgYmVlbiBwbGF5ZWQgKGFuZCBub3QgeWV0IGNvbmZpcm1lZCBieSB0aGUgc2VydmVyKVxuICAgIGlmKHRvUGxheUFDYXJkPD0wKXJldHVybiBhbGVydChcIkplIG1hZyBudSBnZWVuIGthYXJ0IHNwZWxlbiEgSGV0IHdhY2h0ZW4gaXMgb3AgZWVuIHNlaW50amUgdmFuIGRlIHNlcnZlci5cIik7XG4gICAgXG4gICAgaWYocGxheWVkQ2FyZEluZm8pcmV0dXJuIGFsZXJ0KFwiSmUgaGVidCBhbCBlZW4ga2FhcnQgKG5sLiBcIitnZXRMb2NhbGVDYXJkVGV4dChwbGF5ZWRDYXJkSW5mb1swXSkrXCIpIGdlc3BlZWxkLlwiKTtcblxuICAgIHBsYXlhYmxlY2FyZENlbGw9KGV2ZW50JiZldmVudC5jdXJyZW50VGFyZ2V0KTsgLy8gcmVtZW1iZXIgdGhlICdjZWxsJyBvZiB0aGUgY2FyZCBjbGlja2VkISEhIVxuICAgIGlmKCFwbGF5YWJsZWNhcmRDZWxsKXJldHVybjsgLy8gVE9ETyBzaG91bGQgd2UgcmVzcG9uZCBoZXJlPz8/P1xuXG4gICAgbGV0IGNhcmRTdWl0ZT1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaWRcIikpO1xuICAgIGxldCBjYXJkUmFuaz1wYXJzZUludChwbGF5YWJsZWNhcmRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEtc3VpdGUtaW5kZXhcIikpO1xuICAgIGlmKGNhcmRTdWl0ZTxDYXJkLlNVSVRFX0RJQU1PTkR8fGNhcmRTdWl0ZT5DYXJkLlNVSVRFX1NQQURFfHxjYXJkUmFuazxDYXJkLlJBTktfVFdPfHxjYXJkUmFuaz5DYXJkLlJBTktfQUNFKXJldHVybjtcblxuICAgIC8vLy8vLy8vaWYocGxheWFibGVjYXJkQ2VsbC5zdHlsZS5ib3JkZXI9XCIwcHhcIilyZXR1cm47IC8vIGVtcHR5ICd1bmNsaWNrYWJsZScgY2VsbFxuICAgIC8vIE1ESEAwNUZFQjIwMjA6IHJlcGxhY2luZyB0aGUgb3JpZ2luYWwgY2FsbCB0byBfY2FyZFBsYXllZFdpdGhTdWl0ZUFuZEluZGV4KCkgd2l0aCB0aGUgY2FsbHMgdG8gdGhlIE9ubGluZVBsYXllcigpIG1ldGhvZHMgcmVwbGFjaW5nIHRoZSBzaW5nbGUgY2FsbCBzbyB3ZSBrbm93IHRoZSBjYXJkIHBsYXllZCEhXG4gICAgbGV0IGNhcmRQbGF5ZWQ9Y3VycmVudFBsYXllci5fZ2V0Q2FyZFdpdGhTdWl0ZUFuZEluZGV4KGNhcmRTdWl0ZSxjYXJkUmFuayk7XG4gICAgbGV0IGVycm9yPWN1cnJlbnRQbGF5ZXIuX25ld0NhcmRQbGF5ZWQoY2FyZFBsYXllZCk7IFxuICAgIGlmKHBsYXllZENhcmRJbmZvKXsgLy8gTURIQDA1RkVCMjAyMCByZXBsYWNpbmc6ICEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpeyAvLyBjYXJkIGFjY2VwdGVkISEhXG4gICAgICAgIGZvcmNlRm9jdXMobnVsbCk7IC8vIG5vIG5lZWQgdG8gcHJvbXB0IHRoZSB1c2VyIGFueW1vcmUsIChzKWhlIG9ubHkgbmVlZHMgdG8gd2FpdCBmb3IgdGhlIGNhcmQgdG8gYmUgYXJyaXZlZCBieSB0aGUgc2VydmVyXG4gICAgICAgIC8qIE1ESEAwNUZFQjIwMjA6IE5PVCB0byByZW1vdmUgdGhlIGNhcmQgZnJvbSBzaG93aW5nIHVudGlsIGl0IHdhcyBjb25maXJtZWQgYnkgdGhlIHNlcnZlciB0byBoYXZlIGJlZW4gcGxheWVkLCB3ZSBvbmx5IG5lZWQgdG8gcHJldmVudCBwbGF5aW5nIGFub3RoZXIgY2FyZCEhIVxuICAgICAgICBwbGF5YWJsZWNhcmRDZWxsQ29udGVudHM9cGxheWFibGVjYXJkQ2VsbC5pbm5lckhUTUw7IC8vIGluIGNhc2Ugc2VuZGluZyB0aGUgY2FyZCBmYWlsc1xuICAgICAgICBwbGF5YWJsZWNhcmRDZWxsLmlubmVySFRNTD1cIlwiO1xuICAgICAgICB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTsgLy8gZGlzYWJsZSB0aGUgY2FyZCBidXR0b25zXG4gICAgICAgICovXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJKZSBoZWJ0IFwiK2dldExvY2FsZUNhcmRUZXh0KHBsYXllZENhcmRJbmZvWzBdKStcIiBnZXNwZWVsZC5cIjsgLy8gTURIQDIzSkFOMjAyMDogZ2V0IHJpZCBvZiB0aGUgcGxheSBjYXJkIHByb21wdCFcbiAgICB9ZWxzZSAvLyByZXBvcnQgdGhlIGVycm9yIHRvIHRoZSBlbmQgdXNlclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPShlcnJvciBpbnN0YW5jZW9mIEVycm9yP2Vycm9yLm1lc3NhZ2U6XCJKZSBtYWcgXCIrZ2V0TG9jYWxlQ2FyZFRleHQoY2FyZFBsYXllZCkrXCIgbmlldCBzcGVsZW4uXCIpK1wiIFNwZWVsIGVlbiBhbmRlcmUga2FhcnQhXCI7XG59XG4vKipcbiAqIGNvbnZlbmllbnQgdG8gYmUgYWJsZSB0byB0dXJuIHRoZSBwbGF5YWJsZSBjYXJkIGJ1dHRvbnMgb24gYW5kIG9mZiBhdCB0aGUgcmlnaHQgbW9tZW50XG4gKiBAcGFyYW0ge2VuYWJsZX0gZW5hYmxlIFxuICovXG5mdW5jdGlvbiB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGVuYWJsZSl7XG4gICAgLy8gY2xpY2tpbmcgY2FyZCAnYnV0dG9ucycgKG5vdyBjZWxscyBpbiB0YWJsZSksIHdlIGNhbiBnZXQgcmlkIG9mIHRoZSBidXR0b24gaXRzZWxmISEhXG4gICAgLy8gTURIQDA1RkVCMjAyMDogYWRkaXRpb25hbCBjaGVjazogaWYgYSBjZWxsIGlzIGVtcHR5IGRvIG5vdCBlcnJvbmVvdXNseSBtYWtlIGl0IGNsaWNrYWJsZSEhISFcbiAgICBmb3IobGV0IHBsYXlhYmxlY2FyZEJ1dHRvbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXlhYmxlLmNhcmQtdGV4dFwiKSlcbiAgICAgICAgcGxheWFibGVjYXJkQnV0dG9uLm9uY2xpY2s9KGVuYWJsZSYmcGxheWFibGVjYXJkQnV0dG9uLmlubmVySFRNTC5sZW5ndGg+MD9wbGF5YWJsZWNhcmRCdXR0b25DbGlja2VkOm51bGwpO1xufVxuXG4vLyBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB1c2UgUmlra2VuVGhlR2FtZSBpdHNlbGYgKHRoYXQgY29udHJvbHMgcGxheWluZyB0aGUgZ2FtZSBpdHNlbGYpXG4vLyBhbmQgd2hpY2ggZGVmaW5lcyBSaWtrZW5UaGVHYW1lRXZlbnRMaXN0ZW5lciB3ZSBjYW4gc2ltcGx5IGRlZmluZSBzdGF0ZUNoYW5nZWQoZnJvbXN0YXRlLHRvc3RhdGUpXG4vLyBhbmQgYWx3YXlzIGNhbGwgaXQgZnJvbSB0aGUgZ2FtZSBcbmZ1bmN0aW9uIF9nYW1lU3RhdGVDaGFuZ2VkKGZyb21zdGF0ZSx0b3N0YXRlKXtcbiAgICBjb25zb2xlLmxvZyhcIkdBTUVQTEFZSU5HID4+PiBUb2VzdGFuZCB2ZXJhbmRlcnQgdmFuIFwiK2Zyb21zdGF0ZStcIiBuYWFyIFwiK3Rvc3RhdGUrXCIuXCIpO1xuICAgIHN3aXRjaCh0b3N0YXRlKXtcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLklETEU6XG4gICAgICAgICAgICBzZXRJbmZvKFwiRWVuIHNwZWwgaXMgYWFuZ2VtYWFrdC5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBsYXllckdhbWUuREVBTElORzpcbiAgICAgICAgICAgIHNldEluZm8oXCJEZSBrYWFydGVuIHdvcmRlbiBnZXNjaHVkIGVuIGdlZGVlbGQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGF5ZXJHYW1lLkJJRERJTkc6XG4gICAgICAgICAgICAvLyB3aGVuIG1vdmluZyBmcm9tIHRoZSBERUFMSU5HIHN0YXRlIHRvIHRoZSBCSURESU5HIHN0YXRlIGNsZWFyIHRoZSBiaWQgdGFibGVcbiAgICAgICAgICAgIC8vIEFMVEVSTkFUSVZFTFkgdGhpcyBjb3VsZCBiZSBkb25lIHdoZW4gdGhlIGdhbWUgZW5kc1xuICAgICAgICAgICAgLy8gQlVUIHRoaXMgaXMgYSBiaXQgc2FmZXIhISFcbiAgICAgICAgICAgIHNldEluZm8oXCJIZXQgYmllZGVuIGlzIGJlZ29ubmVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgLyogaWYoZnJvbXN0YXRlPT09UGxheWVyR2FtZS5ERUFMSU5HKSovXG4gICAgICAgICAgICBjbGVhckJpZHNUYWJsZSgxKTtcbiAgICAgICAgICAgIC8vLy8vLyBsZXQncyB3YWl0IHVudGlsIGEgYmlkIGlzIHJlcXVlc3RlZCEhISEgXG4gICAgICAgICAgICAvLyBNREhAMDlKQU4yMDIwOiBOTywgd2Ugd2FudCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiaWRkaW5nIGlzIGdvaW5nIG9uXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1iaWRkaW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5QTEFZSU5HOlxuICAgICAgICAgICAgc2V0SW5mbyhcIkhldCBzcGVsZW4ga2FuIGJlZ2lubmVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlUGxheWFibGVDYXJkQnV0dG9uQ2xpY2tIYW5kbGVycyh0cnVlKTsgLy8gYWxsb3dpbmcgdGhlIHVzZXIgdG8gY2xcbiAgICAgICAgICAgIC8qIE1ESEAxOUpBTjIwMjA6IGluIGR1ZSBjb3Vyc2Ugd2Ugd2lsbCBiZSByZW1vdmluZyB0aGUgZm9sbG93aW5nIHR3byBsaW5lc1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgd2FpdC1mb3ItcGxheSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBzaG93IHRoZSBwbGF5IGVsZW1lbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBpbml0aWF0ZS1wbGF5aW5nIHdpbGwgcmVwb3J0IG9uIHRoZSBnYW1lIHRoYXQgaXMgdG8gYmUgcGxheWVkISEhXG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1wbGF5aW5nXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUGxheWVyR2FtZS5GSU5JU0hFRDpcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZS5fbnVtYmVyT2ZUcmlja3NQbGF5ZWQrPTE7IC8vIFFVSUNLIEZJWCB0byBnZXQgdG8gc2VlIHRoZSBsYXN0IHRyaWNrIGF0IHRoZSByaWdodCBwb3NpdGlvbiEhISEhXG4gICAgICAgICAgICB1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc28gd2UgZ2V0IHRvIHNlZSB0aGUgbGFzdCB0cmljayBhcyB3ZWxsISEhXG4gICAgICAgICAgICB1cGRhdGVQbGF5ZXJSZXN1bHRzVGFibGUoKTsgLy8gc2hvdyB0aGUgcGxheWVyIHJlc3VsdHMgc28gZmFyXG4gICAgICAgICAgICBzZXRJbmZvKFwiSGV0IHNwZWwgaXMgYWZnZWxvcGVuIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgY2xlYXJDYXJkc1BsYXllZFRhYmxlKCk7XG4gICAgICAgICAgICBzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIk9OTElORSA+Pj4gVGhlIHN0YXRlIG9mIHRoZSBnYW1lIGNoYW5nZWQgdG8gJ1wiK3Rvc3RhdGUrXCInLlwiKTtcbn1cblxuZnVuY3Rpb24gX2dhbWVFcnJvck9jY3VycmVkKGVycm9yKXtcbiAgICBhbGVydChcIkZvdXQ6IFwiK2Vycm9yKTtcbn1cblxuZnVuY3Rpb24gc2V0UGFnZShuZXdQYWdlKXtcbiAgICAvLyByZW1lbWJlciB0aGUgcGFnZSB3ZSBjYW1lIGZyb20gKG5vdCB0aGUgbmV3IHBhZ2UhISEhKVxuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IFBhZ2UgdG8gc2hvdzogJ1wiK25ld1BhZ2UrXCInLlwiKTtcbiAgICAvLyBpZiB0aGlzIGlzIGEgcGFnZSByZWZyZXNoLCBubyBuZWVkIHRvIHJlcHVzaCB0aGUgcGFnZSEhIVxuICAgIGlmKGN1cnJlbnRQYWdlKWlmKGN1cnJlbnRQYWdlIT1uZXdQYWdlKXZpc2l0ZWRQYWdlcy51bnNoaWZ0KGN1cnJlbnRQYWdlKTtcbiAgICBjdXJyZW50UGFnZT1uZXdQYWdlO1xuICAgIHVwZGF0ZUhlbHBCdXR0b25zKCk7XG4gICAgLy8gTk9URSBub3QgY2hhbmdpbmcgY3VycmVudFBhZ2UgdG8gcGFnZSB1bnRpbCB3ZSBoYXZlIGRvbmUgd2hhdCB3ZSBuZWVkZWQgdG8gZG9cbiAgICBQQUdFUy5mb3JFYWNoKGZ1bmN0aW9uKF9wYWdlKXtcbiAgICAgICAgbGV0IHNob3dQYWdlPShfcGFnZT09PWN1cnJlbnRQYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coKHNob3dQYWdlP1wiU2hvd2luZyBcIjpcIkhpZGluZyBcIikrXCIgJ1wiK19wYWdlK1wiJy5cIik7XG4gICAgICAgIGxldCBwYWdlRWxlbWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfcGFnZSk7XG4gICAgICAgIGlmKHBhZ2VFbGVtZW50KXtcbiAgICAgICAgICAgIHBhZ2VFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9KHNob3dQYWdlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgaWYoc2hvd1BhZ2Upe1xuICAgICAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHBhZ2UtIHByZWZpeFxuICAgICAgICAgICAgICAgIHN3aXRjaChfcGFnZS5zdWJzdHJpbmcoNSkpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicnVsZXNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJEZSByZWdlbHMgdmFuIGhldCBvbmxpbmUgc3BlbC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiS2llcyBkZSBzcGVlbHdpanplLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2V0dXAtZ2FtZVwiOiAvLyB3aGVuIHBsYXlpbmcgaW4gZGVtbyBtb2RlLCB0aGUgdXNlciBzaG91bGQgZW50ZXIgZm91ciBwbGF5ZXIgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RGVmYXVsdFBsYXllck5hbWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZ1bCBkZSBuYW1lbiB2YW4gZGUgc3BlbGVycyBpbi4gRWVuIHNwZWxlcm5hYW0gaXMgdm9sZG9lbmRlLlwiLFwiU3BlbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYXV0aFwiOiAvLyBwYWdlLWF1dGhcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJHZWVmIGRlIG5hYW0gb3Agd2Fhcm9uZGVyIFUgd2lsdCBzcGVsZW4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3YWl0LWZvci1wbGF5ZXJzXCI6IC8vIHBhZ2Utd2FpdC1mb3ItcGxheWVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIkV2ZW4gZ2VkdWxkIGF1Yi4gV2Ugd2FjaHRlbiB0b3QgZXIgZ2Vub2VnIG1lZGVzcGVsZXJzIHppam4hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiaWRkaW5nXCI6IC8vIHBhZ2UtYmlkZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW5mbyhcIldhY2h0IG9tIGRlIGJldXJ0IG9wIGVlbiB2ZXJ6b2VrIHRvdCBoZXQgZG9lbiB2YW4gZWVuIGJvZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXktcmVwb3J0aW5nXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInBsYXlpbmdcIjogLy8gPz8/P1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG8gZXZlcnl0aGluZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyBzdGFydGluZyB0aGUgZ2FtZSBwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyaWNrLWlkXCIpLmlubmVySFRNTD1cIlNsYWcgMVwiOyAvLyBqdXN0IGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuaW5uZXJIVE1MPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10cmljay1idXR0b25cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyBqdXN0IGluIGNhc2UhIVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUcmlja3NQbGF5ZWRUYWJsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJXYWNodCBvcCBoZXQgdmVyem9layB0b3QgaGV0IG9wZ2V2ZW4gdmFuIGRlIHRyb2Vma2xldXIgZW4vb2YgZGUgbWVlIHRlIHZyYWdlbiBhYXMvaGVlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbmZvKFwiSGV0IHNwZWxlbiBiZWdpbnQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldEluZm8oXCJIZXQgc3BlbCBpcyBhZmdlbG9wZW4uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgYWxlcnQoXCJCVUc6IFVua25vd24gcGFnZSAnXCIrX3BhZ2UrXCInIHJlcXVlc3RlZCFcIik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBuZXh0UGFnZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCJNb3ZpbmcgdG8gdGhlIG5leHQgcGFnZSFcIik7XG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICAvLyBNREhAMDdKQU4yMDIwOiBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIG5leHQgcGFnZSwgd2hlbiBub3QgcnVubmluZyBpbiBkZW1vIG1vZGUgd2UgZ28gdG8gdGhlIHBhZ2UtYXV0aCBwYWdlXG4gICAgLy8gICAgICAgICAgICAgICAgaW4gZGVtbyBtb2RlIHNraXAgdGhlIGF1dGggYW5kIHdhaXQgZm9yIHBsYXllcnMgYnV0dG9uXG4gICAgc3dpdGNoKHBhZ2VJbmRleCl7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWF1dGhcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOiAvLyBzaG91bGQgd2UgY2hlY2sgdGhlIHVzZXIgbmFtZXM/Pz8/Pz9cbiAgICAgICAgICAgIHNldFBhZ2UoXCJwYWdlLWJpZGRpbmdcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNldFBhZ2UoUEFHRVNbKHBhZ2VJbmRleCsxKSVQQUdFUy5sZW5ndGhdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbmNlbFBhZ2UoZXZlbnQpe1xuICAgIGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIHRoZSBwcmV2aW91cyBwYWdlLlwiKTtcbiAgICAvLyBnbyBvbmUgcGFnZSBiYWNrXG4gICAgbGV0IHBhZ2VJbmRleD1QQUdFUy5pbmRleE9mKGN1cnJlbnRQYWdlKTtcbiAgICBzZXRQYWdlKFBBR0VTWyhwYWdlSW5kZXgrUEFHRVMubGVuZ3RoLTEpJVBBR0VTLmxlbmd0aF0pO1xufVxuZnVuY3Rpb24gcmV0dXJuVG9QcmV2aW91c1BhZ2UoKXtcbiAgICAvLyBwb3Agb2ZmIHRoZSBwYWdlIHdlIGFyZSBnb2luZyB0byB2aXNpdCwgcHJldmVudGluZyB0byBwdXNoIHRoZSBjdXJyZW50UGFnZSBhZ2FpblxuICAgIGlmKHZpc2l0ZWRQYWdlcy5sZW5ndGg+MCl7XG4gICAgICAgIGN1cnJlbnRQYWdlPW51bGw7XG4gICAgICAgIHNldFBhZ2UodmlzaXRlZFBhZ2VzLnNoaWZ0KCkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNob3dIZWxwKCl7XG4gICAgY29uc29sZS5sb2coXCJTaG93aW5nIHRoZSBoZWxwIVwiKTtcbiAgICBzZXRQYWdlKCdwYWdlLXJ1bGVzJyk7XG59XG4vLyBhc2NlcnRhaW4gdG8gZGlzYWJsZSB0aGUgSGVscCBidXR0b24gd2hlbiB2aWV3aW5nIGl0ISEhXG5mdW5jdGlvbiB1cGRhdGVIZWxwQnV0dG9ucygpe1xuICAgIGxldCBlbmFibGVIZWxwQnV0dG9uPShjdXJyZW50UGFnZSE9PSdwYWdlLWhlbHAnKTtcbiAgICBmb3IobGV0IGhlbHBCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGVscCcpKWhlbHBCdXR0b24uZGlzYWJsZWQ9IWVuYWJsZUhlbHBCdXR0b247XG59XG5cbi8qKlxuICogdG8gYmUgY2FsbGVkIHdoZW4gdGhlIG5ldy1wbGF5ZXJzIGJ1dHRvbiBpcyBjbGlja2VkLCB0byBzdGFydCBhIG5ldyBnYW1lIHdpdGggYSBuZXcgc2V0IG9mIHBsYXllcnNcbiAqL1xuZnVuY3Rpb24gbmV3UGxheWVycygpe1xuICAgIGNvbnNvbGUubG9nKFwiR0FNRVBMQVlJTkcgPj4+IE5pZXV3ZSBzcGVsZXJzIGFhbm1ha2VuLlwiKTtcbiAgICBwbGF5ZXJzPVtdO1xuICAgIGxldCBub1BsYXllck5hbWVzPXRydWU7XG4gICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBwbGF5ZXIgaW5wdXQgZmllbGRzXG4gICAgZm9yKHBsYXllck5hbWVJbnB1dCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLW5hbWUtaW5wdXRcIikpe1xuICAgICAgICBpZihwbGF5ZXJOYW1lSW5wdXQudmFsdWUubGVuZ3RoPjApe1xuICAgICAgICAgICAgbm9QbGF5ZXJOYW1lcz1mYWxzZTtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChuZXcgT25saW5lUGxheWVyKHBsYXllck5hbWVJbnB1dC52YWx1ZSkpO1xuICAgICAgICB9ZWxzZVxuICAgICAgICBpZihwbGF5ZXJzLmxlbmd0aDw0KVxuICAgICAgICAgICAgcGxheWVycy5wdXNoKG51bGwpO1xuICAgIH1cbiAgICBpZihub1BsYXllck5hbWVzKXtcbiAgICAgICAgcGxheWVycz1udWxsO1xuICAgICAgICBzZXRJbmZvKFwiR2VlbiBzcGVsZXJuYW1lbiBvcGdlZ2V2ZW4uIEhlYiB0ZW5taW5zdGUgZWVuIHNwZWxlcm5hYW0gbm9kaWchXCIsXCJTcGVsXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiUmlra2VuIC0gaGV0IHNwZWw6IE5pZXV3ZSBzcGVsZXJzIGFhbmdlbWFha3QhXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxHYW1lKCl7XG4gICAgbGV0IHJpa2tlblRoZUdhbWU9KGN1cnJlbnRQbGF5ZXI/Y3VycmVudFBsYXllci5nYW1lOm51bGwpOy8vaWYoIXJpa2tlblRoZUdhbWUpdGhyb3cgbmV3IEVycm9yKFwiR2VlbiBzcGVsIVwiKTtcbiAgICBpZighcmlra2VuVGhlR2FtZSl7XG4gICAgICAgIGFsZXJ0KFwiR2VlbiBzcGVsIG9tIGFmIHRlIGJyZWtlbiEgTGFhZCBkZXplIHdlYiBwYWdpbmEgb3BuaWV1dyFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY29uZmlybShcIldpbHQgVSBlY2h0IGhldCBodWlkaWdlIHNwZWwgYWZicmVrZW4/XCIpKXtcbiAgICAgICAgcmlra2VuVGhlR2FtZS5jYW5jZWwoKTtcbiAgICB9XG59XG4vKiBcbmZ1bmN0aW9uIG5ld1RyaWNrQnV0dG9uQ2xpY2tlZCgpe1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay13aW5uZXItaW5mb1wiKS5pbm5lckhUTUw9XCJcIjtcbiAgICBsZXQgcmlra2VuVGhlR2FtZT0oY3VycmVudFBsYXllcj9jdXJyZW50UGxheWVyLmdhbWU6bnVsbCk7XG4gICAgKCFyaWtrZW5UaGVHYW1lfHxyaWtrZW5UaGVHYW1lLnNob3dOZXdUcmlja0luZm8oKSk7XG59XG4qL1xuLy8gTURIQDA3SkFOMjAyMDogYWRkaXRpb25hbCBzdHVmZiB0aGF0IHdlJ3JlIGdvaW5nIHRvIG5lZWQgdG8gbWFrZSB0aGlzIHN0dWZmIHdvcmtcbmNsYXNzIFBsYXllckdhbWVQcm94eSBleHRlbmRzIFBsYXllckdhbWUge1xuXG4gICAgLy8gZ2V0U2VuZEV2ZW50KGV2ZW50LGRhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpK1wiLlwiKTtcbiAgICAvLyAgICAgcmV0dXJuIFtldmVudCxkYXRhXTtcbiAgICAvLyB9XG5cbiAgICAvLyBNREhAMjNKQU4yMDIwOiBjYWxsZWQgZnJvbSB1cGRhdGVCaWRzVGFibGVcbiAgICBnZXRQbGF5ZXJJbmRleChwbGF5ZXJOYW1lKXtcbiAgICAgICAgbGV0IHBsYXllckluZGV4PSh0aGlzLl9wbGF5ZXJOYW1lcz90aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg6MCk7XG4gICAgICAgIHdoaWxlKC0tcGxheWVySW5kZXg+PTAmJnRoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XSE9PXBsYXllck5hbWUpO1xuICAgICAgICBpZihwbGF5ZXJJbmRleDwwKXtjb25zb2xlLmxvZyhcIlBsYXllciBuYW1lICdcIitwbGF5ZXJOYW1lK1wiJyBub3QgZm91bmQgaW4gXCIrSlNPTi5zdHJpbmdpZnkodGhpcy5fcGxheWVyTmFtZXMpK1wiLlwiKTt9XG4gICAgICAgIHJldHVybiBwbGF5ZXJJbmRleDtcbiAgICB9XG5cbiAgICBnZXQgbnVtYmVyT2ZQbGF5ZXJzKCl7cmV0dXJuIHRoaXMuX3BsYXllck5hbWVzLmxlbmd0aDt9XG5cbiAgICAvLyBNREhAMjZKQU4yMDIwOiBuZWVkZWQgdGhpcyBhcyB3ZWxsIHRvIGRldGVybWluZSB0aGUgdHJ1bXAgcGxheWVyICh1c2luZyBiaWRkZXJzIHN0ZWFkIG9mIGJpZFBsYXllcnMgaGVyZSlcbiAgICBnZXRUcnVtcFBsYXllcigpe1xuICAgICAgICAvLyBvbmx5IHdoZW4gcGxheWluZyBhICdyaWsnIGdhbWUgKHdpdGggdHJ1bXAsIHBsYXllZCB3aXRoIGEgcGFydG5lciwgYnV0IG5vdCB0cm9lbGEsIHdlIGhhdmUgYSB0cnVtcCBwbGF5ZXIpXG4gICAgICAgIGlmKHRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUsmJnRoaXMuX2hpZ2hlc3RCaWQhPT1QbGF5ZXJHYW1lLkJJRF9SSUtfQkVURVIpcmV0dXJuIC0xO1xuICAgICAgICBpZighdGhpcy5faGlnaGVzdEJpZGRlcnN8fHRoaXMuX2hpZ2hlc3RCaWRkZXJzLmxlbmd0aD09MClyZXR1cm4gLTE7XG4gICAgICAgIHJldHVybiB0aGlzLl9oaWdoZXN0QmlkZGVyc1swXTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjVKQU4yMDIwOiBnYW1lIGNhbm5vdCBjb250aW51ZSB1bnRpbCBzdWNjZWVkaW5nIGluIGdldHRpbmcgdGhlIGFjdGlvbiBvdmVyIHRvIHRoZSBnYW1lIHNlcnZlclxuICAgIC8vICAgICAgICAgICAgICAgIHRvIGd1YXJhbnRlZSBkZWxpdmVyeSB3ZSBydW4gYSByZXNlbmQgdGltZXIgdGhhdCB3aWxsIGNvbnRpbnVlIHNlbmRpbmcgdW50aWwgdGhlIGNhbGxiYWNrIGdldHMgY2FsbGVkXG4gICAgLy8gX2V2ZW50U2VudCB3aWxsIGdldCBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgd2FzIHJlY2VpdmVkIGJ5IHRoZSBnYW1lIHNlcnZlclxuICAgIF9zZW50RXZlbnRSZWNlaXZlZChyZXN1bHQpe1xuICAgICAgICBpZih0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQpe2NsZWFySW50ZXJ2YWwodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKTt0aGlzLl9ldmVudFRvU2VuZEludGVydmFsSWQ9bnVsbDt9XG4gICAgICAgIC8qIE1ESEAwN0ZFQjIwMjAgc2hvdWxkIGJlIGRlYWx0IHdpdGggaW4gdGhlIGNhbGxiYWNrIHByZWZlcmFibHkhISFcbiAgICAgICAgZm9yY2VGb2N1cyhudWxsKTtcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmQ9bnVsbDtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRSZWNlaXZlZENhbGxiYWNrKXRoaXMuX2V2ZW50UmVjZWl2ZWRDYWxsYmFjayhyZXN1bHQsZmFsc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdK1wiIHByb2Nlc3NlZCBieSBnYW1lIHNlcnZlci5cIik7XG4gICAgfVxuICAgIF9zZW5kRXZlbnQoKXtcbiAgICAgICAgbGV0IHJlc3VsdD1mYWxzZTtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIHRpbWVvdXQgY2FsbCB0aGUgY2FsbGJhY2sgYW5kIG1ha2UgaXQgZGV0ZXJtaW5lIHdoZXRoZXIgdG8gZ2l2ZSB1cCBzZW5kaW5nIG9yIG5vdFxuICAgICAgICAgICAgbGV0IHRvc2VuZD0odGhpcy5fZXZlbnRUb1NlbmRbMl09PT0wfHwhdGhpcy5fZXZlbnRSZWNlaXZlZENhbGxiYWNrfHx0aGlzLl9ldmVudFJlY2VpdmVkQ2FsbGJhY2sobnVsbCx0aGlzLl9ldmVudFRvU2VuZFsyXSkpO1xuICAgICAgICAgICAgaWYodG9zZW5kKXtcbiAgICAgICAgICAgICAgICBzZW5kVG9TZXJ2ZXIodGhpcy5fc29ja2V0LHRoaXMuX2V2ZW50VG9TZW5kWzBdLHRoaXMuX2V2ZW50VG9TZW5kWzFdLHRoaXMuX3NlbnRFdmVudFJlY2VpdmVkKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudFRvU2VuZFsyXSsrO1xuICAgICAgICAgICAgICAgIHJlc3VsdD10cnVlOyBcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIC8vIE1ESEAwMUZFQjIwMjA6IHdlIHNob3cgaG93IG9mdGVuIGEgY2VydGFpbiBldmVudCB3YXMgc2VudCBvbiB0aGUgc2VuZE1lc3NhZ2VCdXR0b25cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9ldmVudFRvU2VuZFsyXT4xKXNlbmRNZXNzYWdlQnV0dG9uLnZhbHVlPXBsYXllclN0YXRlTWVzc2FnZXNbY3VycmVudFBsYXllclN0YXRlXStcIiAoXCIrdGhpcy5fZXZlbnRUb1NlbmRbMl0rXCJ4KVwiO1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudCBcIit0aGlzLl9ldmVudFRvU2VuZFswXSsodGhpcy5fZXZlbnRUb1NlbmRbMV0/XCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpOlwiXCIpK1wiIHNlbnQgKGF0dGVtcHQ6IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzJdK1wiKS5cIik7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzZW5kaW5nIGV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdK1wiIGNhbmNlbGVkIVwiKTtcbiAgICAgICAgfWNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IEZhaWxlZCB0byBzZW5kIGV2ZW50IFwiK3RoaXMuX2V2ZW50VG9TZW5kWzBdK1wiIHRvIHRoZSBnYW1lIHNlcnZlciAocmVhc29uOiBcIitlcnJvci5tZXNzYWdlK1wiKS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8gTURIQDA3RkVCMjAyMDogaWYgdGhlcmUgaXMgYSBjYWxsYmFjayB3ZSdyZSBOT1QgcmVzZW5kaW5nIGkuZS4gd2UgcmVseSBvbiB0aGUgYWNrbm93bGVkZ2luZ1xuICAgIC8vICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbiBhIHRpbWVvdXQgKGlmIHJlcXVlc3RlZCkgYXMgd2VsbCB3aXRoIHNlY29uZCBhcmd1bWVudCBzZXQgdG8gdHJ1ZSAoYW5kIHJlc3VsdCB0byBudWxsKVxuICAgIF9zZXRFdmVudFRvU2VuZChldmVudCxkYXRhLHJlc2VuZEludGVydmFsLGNhbGxiYWNrKXtcbiAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmQpcmV0dXJuIGZhbHNlOyAvLyBNREhAMDdGRUIyMDIwOiBjYW4gaGF2ZSBvbmx5IG9uZSBwZW5kaW5nIGV2ZW50IHRvIHNlbmQgYXQgYSB0aW1lXG4gICAgICAgIHRoaXMuX2V2ZW50UmVjZWl2ZWRDYWxsYmFjaz1udWxsOyAvLyBpbiBjYXNlIHdlIGZhaWxcbiAgICAgICAgaWYodGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkKXtjbGVhckludGVydmFsKHRoaXMuX2V2ZW50VG9TZW5kSW50ZXJ2YWxJZCk7dGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPW51bGw7fVxuICAgICAgICAvLyBubyBjYWxsYmFjayBzcGVjaWZpZWQsIHNvIHVzaW5nIHJlc2VuZCBtZWNoYW5pc21cbiAgICAgICAgdGhpcy5fZXZlbnRUb1NlbmQ9W2V2ZW50LGRhdGEsMF07IC8vIGtlZXAgdHJhY2sgb2YgdGhlIHNlbmQgZXZlbnQgY291bnRcbiAgICAgICAgaWYoIXRoaXMuX3NlbmRFdmVudCgpKXJldHVybiBmYWxzZTsgLy8gX2V2ZW50UmVjZWl2ZWRDYWxsYmFjayBkb2VzIG5vdCBuZWVkIHRvIGJlIGtub3duIHRoZSBmaXJzdCB0aW1lIGZvciBzdXJlLi4uXG4gICAgICAgIHRoaXMuX2V2ZW50UmVjZWl2ZWRDYWxsYmFjaz1jYWxsYmFjazsgLy8gc28gd2UgY2FuIHNldCBpdCBoZXJlXG4gICAgICAgIC8vIHNjaGVkdWxlIGEgcmVzZW5kIGlmIHNvIGRlc2lyZWRcbiAgICAgICAgaWYodHlwZW9mIHJlc2VuZEludGVydmFsPT09J251bWJlcicmJnJlc2VuZEludGVydmFsPjApdGhpcy5fZXZlbnRUb1NlbmRJbnRlcnZhbElkPXNldEludGVydmFsKHRoaXMuX3NlbmRFdmVudCxyZXNlbmRJbnRlcnZhbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIHdoYXQgdGhlIHBsYXllciB3aWxsIGJlIGNhbGxpbmcgd2hlbiAocyloZSBtYWRlIGEgYmlkLCBwbGF5ZWQgYSBjYXJkLCBjaG9vc2UgdHJ1bXAgb3IgcGFydG5lciBzdWl0ZVxuICAgIGJpZE1hZGUoYmlkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUilyZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgcmVtb3Zpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkZGluZ1wiKS5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCI7XG4gICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgYmVjYXVzZSB3ZSBwYXNzIGluIGEgY2FsbGJhY2sgbm8gYXV0b21hdGljIHJlc2VuZGluZyEhISFcbiAgICAgICAgbGV0IGJpZE1hZGVTZW50UmVzdWx0PXRoaXMuX3NldEV2ZW50VG9TZW5kKCdCSUQnLGJpZCxmdW5jdGlvbihyZXN1bHQsZmFpbHVyZUNvdW50KXtcbiAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkJvZCBuaWV0IGdlYWNjZXB0ZWVyZFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2Vycm9yJyk/XCIgKGZvdXQ6IFwiK3Jlc3VsdC5lcnJvcitcIilcIjpcIlwiKStcIiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgbm93Pz8/IHRlY2huaWNhbGx5IHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIG1ha2UgYSBuZXcgYmlkPz8/Pz8/Pz8/XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJCb2QgdmVyd2Vya3QuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgIH0pOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgaWYoYmlkTWFkZVNlbnRSZXN1bHQpc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQklEX0RPTkUpO1xuICAgICAgICByZXR1cm4gYmlkTWFkZVNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1ESEAxM0pBTjIwMjA6IHdlJ3JlIHNlbmRpbmcgdGhlIGV4YWN0IGNhcmQgb3ZlciB0aGF0IHdhcyBwbGF5ZWQgKGFuZCBhY2NlcHRlZCBhdCB0aGlzIGVuZCBhcyBpdCBzaG91bGQgSSBndWVzcylcbiAgICAvLyBNREhAMTRKQU4yMDIwOiBwYXNzaW5nIGluIHRoZSBhc2tpbmdGb3JQYXJ0bmVyQ2FyZCAnZmxhZycgYXMgd2VsbCEhISFcbiAgICAvLyAgICAgICAgICAgICAgICBiZWNhdXNlIHdlJ3JlIG92ZXJyaWRpbmcgdGhlIGJhc2UgUmlra2VuVGhlR2FtZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgIGFza2luZ0ZvclBhcnRuZXJDYXJkIGRvZXNuJ3QgZW5kIHVwIGluIHRoZSBsb2NhbCBSaWtrZW5UaGVHYW1lIHRyaWNrXG4gICAgLy8gTURIQDI3SkFOMjAyMDogd2UncmUgcmVjZWl2aW5nIHRydWUgZm9yIGFza2luZ0ZvclBhcnRuZXJDYXJkQmxpbmQgd2hlbiB0aGUgcGxheWVyIGlzIGRvaW5nIHNvXG4gICAgY2FyZFBsYXllZChjYXJkLGFza2luZ0ZvclBhcnRuZXJDYXJkKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUil7c2V0SW5mbyhcIkhldCBzcGVsIGthbiBuaWV0IHZlcmRlciBnZXNwZWVsZCB3b3JkZW4hXCIsXCJTcGVsXCIpO3JldHVybiBmYWxzZTt9XG4gICAgICAgIC8vIE1ESEAxN0pBTjIwMjA6IGRpc2FibGUgdGhlIGJ1dHRvbnMgb25jZSB0aGUgY2FyZCBpcyBhY2NlcHRlZCAodG8gYmUgcGxheWVkISEhKVxuICAgICAgICAvLyAgICAgICAgICAgICAgICBUT0RPIHBlcmhhcHMgaGlkaW5nIHRoZSBjYXJkcyBzaG91bGQgYWxzbyBiZSBkb25lIGhlcmUhISFcbiAgICAgICAgLyogcmVwbGFjaW5nOlxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXQtZm9yLXBsYXlcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBoaWRlIHRoZSBiaWRkaW5nIGVsZW1lbnQgYWdhaW5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5aW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gaGlkZSB0aGUgYmlkZGluZyBlbGVtZW50IGFnYWluXG4gICAgICAgICovXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBjYXJkIHBsYXllZDogXCIrY2FyZC50b1N0cmluZygpK1wiIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICAvLyB1cGRhdGVQbGF5YWJsZUNhcmRCdXR0b25DbGlja0hhbmRsZXJzKGZhbHNlKTtcbiAgICAgICAgLy8gTURIQDI3SkFOMjAyMDogd2Ugc2VuZCB0aGUgYXNraW5nRm9yUGFydG5lckNhcmQgZmxhZyBhbG9uZyBldmVyeSB0aW1lIGFsdGhvdWdoIGl0IHdpbGwgYmUgaWdub3JlZFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBvbiBhbnkgdHJpY2sgY2FyZCBleGNlcHQgdGhlIGZpcnN0IGNhcmQgcGxheWVkLCBhbmQgbm9uLW5lZ2F0aXZlIHZhbHVlcyBhcmUgaWdub3JlZCBhcyB3ZWxsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG9ubHkgdGhpbmcgdGhhdCB0aGUgb3RoZXIgc2lkZSBjYW5ub3QgZGV0ZXJtaW5lIGlzIHdoZXRoZXIgdGhlIHBhcnRuZXIgY2FyZCBpcyBhc2tlZCBibGluZCEhISFcbiAgICAgICAgLy8gcmVwbGFjaW5nOiBpZihhc2tpbmdGb3JQYXJ0bmVyQ2FyZDwwKWNhcmRQbGF5ZWRJbmZvLnB1c2godHJ1ZSk7IC8vIHNldCB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgYmxpbmQgZmxhZyEhIVxuICAgICAgICBsZXQgY2FyZFNlbnRSZXN1bHQ9XG4gICAgICAgICAgICB0aGlzLl9zZXRFdmVudFRvU2VuZCgnQ0FSRCcsW2NhcmQuc3VpdGUsY2FyZC5yYW5rLGFza2luZ0ZvclBhcnRuZXJDYXJkXSwwLGZ1bmN0aW9uKHJlc3VsdCxmYWlsdXJlQ291bnQpe1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWNhcmQtcHJvbXB0XCIpLmlubmVySFRNTD1cIkdlc3BlZWxkZSBrYWFydCBuaWV0IGdlYWNjZXB0ZWVyZFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhhc093blByb3BlcnR5KCdlcnJvcicpP1wiIChmb3V0OiBcIityZXN1bHQuZXJyb3IrXCIpXCI6XCJcIikrXCIhXCI7XG4gICAgICAgICAgICAgICAgZWxzZS8vIGNhcmQgcGxheWVkIGFjY2VwdGVkISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgZ2VhY2NlcHRlZXJkLlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIHRoaXMgaXMgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBjYWxsIHRvIF9zZXRFdmVudFRvU2VuZCAoc3luY2hyb25vdXMpLCBhbmQgb2J2aW91c2x5IHdlIHB1dCBiYWNrIHRoZSBjYXJkXG4gICAgICAgIGlmKCFjYXJkU2VudFJlc3VsdCl7XG4gICAgICAgICAgICBhbGVydChcIkthYXJ0IG5pZXQgdmVyc3R1dXJkP1wiKTtcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1jYXJkLXByb21wdFwiKS5pbm5lckhUTUw9XCJHZXNwZWVsZGUga2FhcnQgbmlldCBnZWFjY2VwdGVlcmRcIitcbiAgICAgICAgICAgIC8vIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2Vycm9yJyk/XCIgKGZvdXQ6IFwiK3Jlc3VsdC5lcnJvcitcIilcIjpcIlwiKStcIiFcIjtcbiAgICAgICAgICAgIGlmKHBsYXlhYmxlY2FyZENlbGwpXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIlZlcnN0dXJlbiB2YW4gZGUgZ2VzcGVlbGRlIGthYXJ0IG1pc2x1a3QhIFByb2JlZXIgaGV0IHpvIG5vZyBlZW5zLlwiKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiRXIgaXMgaWV0cyBtaXNnZWdhYW4uIFByb2JlZXIgaGV0IHpvIG5vZyBlZW5zLlwiKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktY2FyZC1wcm9tcHRcIikuaW5uZXJIVE1MPVwiR2VzcGVlbGRlIGthYXJ0IHZlcnN0dXVyZC5cIjtcbiAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0NBUkRfUExBWUVEKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FyZFNlbnRSZXN1bHQ7XG4gICAgfVxuICAgIHRydW1wU3VpdGVDaG9zZW4odHJ1bXBTdWl0ZSl7XG4gICAgICAgIGlmKHRoaXMuX3N0YXRlPT09UGxheWVyR2FtZS5PVVRfT0ZfT1JERVIpe3NldEluZm8oXCJIZXQgc3BlbCBrYW4gbmlldCB2ZXJkZXIgZ2VzcGVlbGQgd29yZGVuIVwiLFwiU3BlbFwiKTtyZXR1cm4gZmFsc2U7fVxuICAgICAgICAvLyBNREhAMDdGRUIyMDIwIGJlY2F1c2UgYWxyZWFkeSBkb25lIHdoZW4gYSB0cnVtcCBzdWl0ZSBidXR0b24gaXMgY2xpY2tlZCEhISEgcmVtb3Zpbmc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJ1bXAtc3VpdGUtaW5wdXRcIikuc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiO1xuICAgICAgICBsZXQgdHJ1bXBTdWl0ZUNob3NlblNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1RSVU1QU1VJVEUnLHRydW1wU3VpdGUsMCxmdW5jdGlvbihyZXN1bHQsZmFpbHVyZUNvdW50KXtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2Vrb3plbiB0cm9lZmtsZXVyIG5pZXQgZ2VhY2NlcHRlZXJkXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2Vycm9yJyk/XCIgKGZvdXQ6IFwiK3Jlc3VsdC5lcnJvcitcIilcIjpcIlwiKStcIiFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB3aGF0IHRvIGRvIG5vdz9cbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiR2Vrb3plbiB0cm9lZmtsZXVyIGdlYWNjZXB0ZWVyZC5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBpZih0cnVtcFN1aXRlQ2hvc2VuU2VudFJlc3VsdClzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9UUlVNUF9ET05FKTtcbiAgICAgICAgcmV0dXJuIHRydW1wU3VpdGVDaG9zZW5TZW50UmVzdWx0O1xuICAgIH1cbiAgICBwYXJ0bmVyU3VpdGVDaG9zZW4ocGFydG5lclN1aXRlKXtcbiAgICAgICAgaWYodGhpcy5fc3RhdGU9PT1QbGF5ZXJHYW1lLk9VVF9PRl9PUkRFUil7c2V0SW5mbyhcIkhldCBzcGVsIGthbiBuaWV0IHZlcmRlciBnZXNwZWVsZCB3b3JkZW4hXCIsXCJTcGVsXCIpO3JldHVybiBmYWxzZTt9XG4gICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgYmVjYXVzZSBhbHJlYWR5IGRvbmUgd2hlbiBhIHRydW1wIHN1aXRlIGJ1dHRvbiBpcyBjbGlja2VkISEhISByZW1vdmluZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXJ0bmVyLXN1aXRlLWlucHV0XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgbGV0IHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQ9dGhpcy5fc2V0RXZlbnRUb1NlbmQoJ1BBUlRORVJTVUlURScscGFydG5lclN1aXRlLDAsZnVuY3Rpb24ocmVzdWx0LGZhaWx1cmVDb3VudCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkdla296ZW4gcGFydG5lciBrbGV1ciBuaWV0IGdlYWNjZXB0ZWVyZCFcIitcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKT9cIiAoZm91dDogXCIrcmVzdWx0LmVycm9yK1wiKVwiOlwiXCIpK1wiIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHdoYXQgdG8gZG8gbm93P1xuICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgIHNldEluZm8oXCJHZWtvemVuIHBhcnRuZXIga2xldXIgZ2VhY2NlcHRlZXJkIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAvLyByZXBsYWNpbmc6IHsncGxheWVyJzp0aGlzLl9wbGF5ZXJJbmRleCwnc3VpdGUnOnBhcnRuZXJTdWl0ZX0pKTtcbiAgICAgICAgIGlmKHBhcnRuZXJTdWl0ZUNob3NlblNlbnRSZXN1bHQpc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUl9ET05FKTtcbiAgICAgICAgIHJldHVybiBwYXJ0bmVyU3VpdGVDaG9zZW5TZW50UmVzdWx0O1xuICAgIH1cbiAgICAvLyBNREhAMjZKQU4yMDIwOiB3aGVuIHRoZSB1c2VyIGZpbmlzaGVkIHJlYWRpbmcgdGhlIHJlc3VsdHMsIGFuZCB3YW50cyB0byBjb250aW51ZSBwbGF5aW5nIGRvbmUoKSBzaG91bGQgYmUgY2FsbGVkXG4gICAgZG9uZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RXZlbnRUb1NlbmQoJ0RPTkUnLG51bGwsMCxmdW5jdGlvbihyZXN1bHQsZmFpbHVyZUNvdW50KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9ORSBldmVudCBhY2tub3dsZWRnZWQuXCIpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIE1ESEAyOUpBTjIwMjA6IEkgaGF2ZSB0byBkbyB0aGlzIG90aGVyd2lzZSBJIHdvbid0IGJlIGFibGUgdG8gcGxheSBpbiBhIG5ldyBnYW1lIChzZWUgc2V0IHBsYXllck5hbWVzISEhISlcbiAgICAgICAgICAgIHNldEluZm8oXCJab2RyYSBlciB3ZWVyIHZpZXIgbmlldC1zcGVsZW5kZSBkZWVsbmVtZXJzIHppam4ga3VuIGplIHdlZXIgc3BlbGVuLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhpdChyZWFzb24pe1xuICAgICAgICAvLyBwbGF5ZXIgaXMgZXhpdGluZyBzb21laG93Li4uXG4gICAgICAgIGxldCBkYXRhPShyZWFzb24/cmVhc29uOihjdXJyZW50UGxheWVyP2N1cnJlbnRQbGF5ZXIubmFtZTpcIlwiKSk7XG4gICAgICAgIC8vIGl0IGlzIGNydWNpYWwgdGhhdCB0aGUgRVhJVCBldmVudCBpcyByZWNlaXZlZCBieSB0aGUgZ2FtZSBzZXJ2ZXJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEV2ZW50VG9TZW5kKCdFWElUJyxkYXRhLHNlcnZlclJlc3BvbnNlU3RhdHMubWF4aW11bVJlc3BvbnNlTXMsZnVuY3Rpb24ocmVzdWx0LGZhaWx1cmVDb3VudCl7XG4gICAgICAgICAgICBsZXQgYWNrbm93bGVkZ2VkPSh0eXBlb2YgZmFpbHVyZUNvdW50IT09bnVtYmVyKTtcbiAgICAgICAgICAgIGlmKGFja25vd2xlZGdlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFWElUIGV2ZW50IFwiK2RhdGErXCIgYWNrbm93bGVkZ2VkIVwiKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSBOT1QgZ29pbmcgYW55d2hlcmUgYW55bW9yZTogc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIkJlZGFua3Qgdm9vciBoZXQgc3BlbGVuLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgfWVsc2V7IC8vIGFsbG93IHVzZXIgdG8gdHJ5IGFnYWluLi4uXG4gICAgICAgICAgICAgICAgc2V0SW5mbyhcIlN0b3BwZW4gbm9nIG5pZXQgYmV2ZXN0aWdkLiBQcm9iZWVyIGhldCB6byBub2cgZWVucyFcIixcIlNwZWxcIik7XG4gICAgICAgICAgICAgICAgdXBkYXRlR2FtZU92ZXJCdXR0b25zKHRydWUpOyAvLyBlbmFibGUgZ2FtZSBvdmVyIGJ1dHRvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCl7cmV0dXJuIHRoaXMuX3N0YXRlO31cbiAgICBzZXQgc3RhdGUobmV3c3RhdGUpe1xuICAgICAgICBsZXQgb2xkc3RhdGU9dGhpcy5fc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlPW5ld3N0YXRlO1xuICAgICAgICAvLyBkbyBzdHVmZiAoY2hhbmdlIHRvIGFub3RoZXIgcGFnZSlcbiAgICAgICAgX2dhbWVTdGF0ZUNoYW5nZWQob2xkc3RhdGUsdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIGxvZ0V2ZW50KGV2ZW50LGRhdGEpe1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZC5wdXNoKHtldmVudDpldmVudCxkYXRhOmRhdGF9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHQU1FUExBWUlORyA+Pj4gUmVjZWl2ZWQgZXZlbnQgXCIrZXZlbnQrXCIgd2l0aCBkYXRhIFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpe3JldHVybiB0aGlzLl9uYW1lO31cbiAgICBzZXQgbmFtZShuYW1lKXt0aGlzLl9uYW1lPW5hbWU7fVxuXG4gICAgLy8gVE9ETyBoYXZlIHRvIGNoYW5nZSB0aGlzIHRvIGluY2x1ZGUgdGhlIGZyaWVuZGx5IGZsYWcgYXMgd2VsbCEhISFcbiAgICBnZXRQbGF5ZXJOYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgcmV0dXJuKHRoaXMuX3BsYXllck5hbWVzJiZwbGF5ZXJJbmRleD49MCYmcGxheWVySW5kZXg8dGhpcy5fcGxheWVyTmFtZXMubGVuZ3RoP3RoaXMuX3BsYXllck5hbWVzW3BsYXllckluZGV4XTpudWxsKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UGxheWVyTmFtZXMoKXtyZXR1cm4gdGhpcy5fcGxheWVyTmFtZXM7fSAvLyBvdmVycmlkaW5nIGdldFBsYXllck5hbWVzKCkgb2YgdGhlIGRlbW8gdmVyc2lvbiEhXG4gICAgXG4gICAgc2V0IHBsYXllck5hbWVzKHBsYXllck5hbWVzKXtcblxuICAgICAgICAvLyBNREhAMjlKQU4yMDIwOiB3YWl0IHdpdGggYWN0dWFsbHkgcGxheWluZyB0aGUgZ2FtZSB3aXRoIHRoZXNlIHBsYXllcnMgdW50aWwgd2UgZm91bmQgb3V0IHRoYXQgdGhlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGN1cnJlbnQgcGxheWVyIGlzIGFjdHVhbGx5IGluIHRoZSBnYW1lISEhISFcblxuICAgICAgICBpZighY3VycmVudFBsYXllcilyZXR1cm47XG5cbiAgICAgICAgaWYodGhpcy5fcGxheWVySW5kZXg+PTApcmV0dXJuOyAvLyBhbHJlYWR5IHBsYXlpbmcgdGhlIGdhbWUgQSBIQSBJIGhhdmUgdG8ga2lsbCB0aGUgcGxheWVyIGluZGV4IHNvbWV3aGVyZS4uLlxuXG4gICAgICAgIGxldCBwbGF5ZXJJbmRleD0oIXBsYXllck5hbWVzfHxwbGF5ZXJOYW1lcy5sZW5ndGg8ND8tMTpwbGF5ZXJOYW1lcy5pbmRleE9mKGN1cnJlbnRQbGF5ZXIubmFtZSkpO1xuICAgICAgICBcbiAgICAgICAgaWYocGxheWVySW5kZXg+PTApe1xuICAgICAgICAgICAgLy8gTURIQDI5SkFOMjAyMDogYXQgdGhlIG1vbWVudCB0aGF0IHRoZSBwbGF5ZXIgbmFtZXMgYXJlIHJlY2VpdmVkIHRoZSBnYW1lIGFjdHVhbGx5IHN0YXJ0c1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgQ0FSRUZVTCB3ZSBzaG91bGQgY29uc2lkZXIgcmVjZWl2aW5nIHRoZSBwbGF5ZXIgbmFtZXMgbW9yZSB0aGFuIG9uY2U/Pz8/Pz9cbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVHYW1lKCk7IC8vIChyZSlpbml0aWFsaXplIEFMTCB0aGUgcHJvcGVydGllcyBvZiBwbGF5aW5nIHRoZSBnYW1lXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJOYW1lcz1wbGF5ZXJOYW1lcztcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleCh0aGlzLHBsYXllckluZGV4KTsgLy8gcmVnaXN0ZXIgd2l0aCB0aGUgcGxheWVcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckluZGV4PWN1cnJlbnRQbGF5ZXIuX2luZGV4OyAvLyByZW1lbWJlciB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgICAgICAgICB1cGRhdGVHYW1lUGxheWVyTmFtZXMoKTtcbiAgICAgICAgICAgIHNob3dQbGF5ZXJOYW1lcygpO1xuICAgICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIHNob3cgdGhlIGN1cnJlbnQgcGxheWVyIG5hbWUgb24gcGFnZS1wbGF5aW5nIE9OQ0UgYXMgaXQgd2lsbCBhbHdheXMgc3RheSB0aGUgc2FtZVxuICAgICAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgICAgICAvLyByZXBsYWNpbmc6IHNob3dQbGF5ZXJOYW1lKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyLW5hbWVcIiksdGhpcy5nZXRQbGF5ZXJOYW1lKHRoaXMuX3BsYXllckluZGV4KSwtMik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogQ3VycmVudCBwbGF5ZXIgJ1wiK2N1cnJlbnRQbGF5ZXIubmFtZStcIicgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgIGlmKHBsYXllck5hbWVzKVxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJuc3RpZ2UgcHJvZ3JhbW1hZm91dDogVXcgbmFhbSBrb210IG5pZXQgdm9vciBpbiBkZSBzcGVsZXJsaWpzdCB2YW4gaGV0IHRlIHNwZWxlbiBzcGVsIVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIocGxheWVySW5kZXgpe1xuICAgICAgICBsZXQgbnVtYmVyT2ZUcmlja3NXb25CeVBsYXllcj0tMTtcbiAgICAgICAgaWYocGxheWVySW5kZXg+PTB8fHBsYXllckluZGV4PHRoaXMuX251bWJlck9mVHJpY2tzV29uLmxlbmd0aCl7XG4gICAgICAgICAgICBudW1iZXJPZlRyaWNrc1dvbkJ5UGxheWVyPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BsYXllckluZGV4XTtcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGhhdmUgbm8gcGxheWVycyBhbmQgc2hvdWxkIGdldCB0aGUgcGFydG5lciBpZHMgZnJvbSB0aGUgc2VydmVyIGl0c2VsZlxuICAgICAgICAgICAgbGV0IHBhcnRuZXJJbmRleD0odGhpcy5fcGFydG5lcnMmJnBsYXllckluZGV4PHRoaXMuX3BhcnRuZXJzLmxlbmd0aD90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF06LTEpO1xuICAgICAgICAgICAgaWYocGFydG5lckluZGV4Pj0wJiZwYXJ0bmVySW5kZXg8dGhpcy5fbnVtYmVyT2ZUcmlja3NXb24ubGVuZ3RoKW51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXIrPXRoaXMuX251bWJlck9mVHJpY2tzV29uW3BhcnRuZXJJbmRleF07XG4gICAgICAgIH0vKmVsc2VcbiAgICAgICAgICAgIGFsZXJ0KFwiT25nZWxkaWdlIHNwZWxlciBpbmRleCBcIitwbGF5ZXJJbmRleCtcIi5cIik7Ki9cbiAgICAgICAgcmV0dXJuIG51bWJlck9mVHJpY2tzV29uQnlQbGF5ZXI7XG4gICAgfVxuXG4gICAgLy8gTURIQDIwSkFOMjAyMDogd2lsbCBiZSByZWNlaXZpbmcgdGhlIG5ldyB0cmljayBldmVudCB3aGVuIGEgbmV3IHRyaWNrIHN0YXJ0c1xuICAgIC8vIE1ESEAyMkpBTjIwMjA6IHVzZXIgd2lsbCBoYXZlIHRvIGNsaWNrIHRoZSBuZXcgdHJpY2sgYnV0dG9uIHNvIHRoZXkgY2FuIGxvb2sgYXQgdGhlIG9sZCB0cmljayBmaXJzdFxuICAgIG5ld1RyaWNrKHRyaWNrSW5mbyl7XG4gICAgICAgIFxuICAgICAgICAvLyBBU1NFUlQgb25seSBjYWxsIHdoZW4gdHJpY2tJbmZvIGlzIG5vdCBOVUxMISEhISFcbiAgICAgICAgaWYoIXRyaWNrSW5mbylyZXR1cm4gYWxlcnQoYnVnKFwiR2VlbiBzbGFnaW5mb3JtYXRpZSFcIikpO1xuXG4gICAgICAgIGNsZWFyQ2FyZHNQbGF5ZWRUYWJsZSgpOyAvLyByZW1vdmUgdGhlIGNhcmRzIHNob3dpbmcgZnJvbSB0aGUgcHJldmlvdXMgdHJpY2tcblxuICAgICAgICAvLyBzaG93IHRoZSBpZCBvZiB0aGUgdHJpY2sgKHdoaWNoIGlzIHRoZSB0cmljayBpbmRleClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmljay1pZFwiKS5pbm5lckhUTUw9XCJTbGFnIFwiK3RyaWNrSW5mby5pbmRleDtcblxuICAgICAgICB0aGlzLl9udW1iZXJPZlRyaWNrc1BsYXllZD10cmlja0luZm8uaW5kZXgtMTtcblxuICAgICAgICBpZih0aGlzLl90cmljayl1cGRhdGVUcmlja3NQbGF5ZWRUYWJsZXMoKTsgLy8gc2hvdyB0aGUgZmluaXNoZWQgdHJpY2sgaW4gdGhlIHRyaWNrcyBwbGF5ZWQgdGFibGVcblxuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgdHJpY2sgd2l0aCB0aGUgaW5mb3JtYXRpb24gaW4gdGhlIHRyaWNrIGluZm9cbiAgICAgICAgdGhpcy5fdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0aGlzLl90cnVtcFN1aXRlLHRoaXMuX3BhcnRuZXJTdWl0ZSx0aGlzLl9wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQsdHJpY2tJbmZvLmZpcnN0UGxheWVyQ2FuUGxheVNwYWRlcyk7XG4gICAgXG4gICAgICAgIC8qIHN0dXBpZCBtZTogSSBhbHJlYWR5IG1vdmVkIGRvaW5nIHRoaXMgdG8gc2hvd1RyaWNrKCkgYnV0IHRoZXJlIGVhcmxpZXIgaW5jb3JyZWN0IChpLmUuIE5PVCBjaGVja2luZyB0aGUgZmlyc3QgcGxheWVyISEhKVxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBoaWRpbmcgb3Igc2hvd2luZyB0aGUgYXNraW5nIGZvciBwYXJ0bmVyIGNhcmQgY2hlY2tib3ggY2FuIGJlIGRldGVybWluZWQgaGVyZSBhbmQgbm93XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBmb3IgZGVjaWRpbmcgaXMgY29tcGxldGVseSBrbm93biBhdCB0aGUgc3RhcnQgb2YgYSBuZXcgdHJpY2tcbiAgICAgICAgaWYodHJpY2tJbmZvLmZpcnN0UGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleCYmdHJpY2tJbmZvLmNhbkFza0ZvclBhcnRuZXJDYXJkIT0wKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICAgICAgICAgIC8vIHRoZSBuZXh0IGRlY2lzaW9uIGlzIGEgbGl0dGxlIGhhcmRlciwgYmVjYXVzZSBzaG91bGQgd2UgYWx3YXlzIHR1cm4gb24gdGhlIGNoZWNrYm94Pz8/Pz8/Pz9cbiAgICAgICAgICAgIC8vIEJVVCBub3RlIHRoYXQgdGhlIHVzZXIgd2lsbCBiZSBwcm9tcHRlZCB0byBhY2tub3dsZWRnZSBhc2tpbmcgdGhlIHBhcnRuZXIgY2FyZCBibGluZFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc2stcGFydG5lci1jYXJkLWNoZWNrYm94XCIpLnNlbGVjdGVkPTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXNrLXBhcnRuZXItY2FyZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xuICAgICAgICAqL1xuXG4gICAgICAgIC8vIHdlIGRvIHRoZSBmb2xsb3dpbmcgYmVjYXVzZSBpdCBpcyBlc3NlbnRpYWwgdGhhdCB0aGUgY2hlY2tib3ggdGhhdCB0ZWxscyB0aGUgcGxheWVyIHdoZXRoZXIgb3Igbm90XG4gICAgICAgIC8vIHRoZSBwYXJ0bmVyIGNhcmQgY2FuIGJlIGFza2VkIHNob3VsZCBiZSBpbiB0aGUgcmlnaHQgc3RhdGUgdG8gc3RhcnQgd2l0aCAoZm9yIHRoZSByaWdodCBwbGF5ZXIpXG4gICAgICAgIC8vIE5PVEUgbmV3VHJpY2soKSBpcyBiZWluZyBjYWxsZWQgQkVGT1JFIGEgcGxheWVyIGlzIGFza2VkIHRvIHBsYXkgYSBjYXJkLCBzbyB0aGF0J3MgdGhlIHJpZ2h0IG1vbWVudCEhISFcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsgLy8gVE9ETyBzaG91bGQgdGhpcyBiZSBoZXJlPz8/Pz9cblxuICAgIH1cblxuICAgIC8qIE1ESEAyOUpBTjIwMjA6IE5PVCByZWNlaXZpbmcgdGhlIHBhcnRuZXIgaWRzIGRpcmVjdGx5IGZyb20gdGhlIHNlcnZlciBhbnltb3JlIEJVVCBkZXJpdmluZyB0aGVtIGZyb20gYW55IHBhcnRuZXIgaWQgd2UgcmVjZWl2ZSEhISEhXG4gICAgLy8gTURIQDIwSkFOMjAyMDogaWYgd2UgcmVjZWl2ZSBhbGwgcGFydG5lcnMgd2UgY2FuIGV4dHJhY3QgdGhlIHBhcnRuZXIgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG4gICAgX3NldFBhcnRuZXJJZHMocGFydG5lcklkcyl7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJJZHM9cGFydG5lcklkcztcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBwYXJ0bmVyIG9mIHRoZSBjdXJyZW50IHBsYXllclxuICAgICAgICBsZXQgY3VycmVudFBhcnRuZXI9KHRoaXMuX3BhcnRuZXJJZHMmJnRoaXMuX3BsYXllckluZGV4Pj0wJiZ0aGlzLl9wbGF5ZXJJbmRleDx0aGlzLl9wYXJ0bmVySWRzLmxlbmd0aD90aGlzLl9wYXJ0bmVySWRzW3RoaXMuX3BsYXllckluZGV4XTotMSk7XG4gICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIucGFydG5lcj49MCYmY3VycmVudFBhcnRuZXIucGFydG5lciE9Y3VycmVudFBhcnRuZXIpXG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJSYXBwb3J0ZWVyIGRlIHZvbGdlbmRlIGVybnN0aWdlIHByb2dyYW1tYWZvdXQ6ICdKZSBwYXJ0bmVyIGlzIHZlcmFuZGVyZCcuXCIpO1xuICAgICAgICBjdXJyZW50UGxheWVyLnBhcnRuZXI9Y3VycmVudFBhcnRuZXI7XG4gICAgfVxuICAgICovXG5cbiAgICBuZXdDYXJkKGNhcmRJbmZvKXtcbiAgICAgICAgXG4gICAgICAgIC8vIE1ESEAwNUZFQjIwMjA6IGlmIHRoaXMgaXMgdGhlIGNhcmQgSSBhY3R1YWxseSBqdXN0IHBsYXllZCBJIGhhdmUgdG8gZG8gc29tZSBtb3JlISEhIVxuICAgICAgICBpZihwbGF5ZWRDYXJkSW5mbyl7XG4gICAgICAgICAgICBsZXQgcGxheWVkQ2FyZD1wbGF5ZWRDYXJkSW5mb1swXTtcbiAgICAgICAgICAgIHRvUGxheUFDYXJkPTA7IC8vIGRvbmUgcGxheWluZyBhIGNhcmRcbiAgICAgICAgICAgIHBsYXllZENhcmRJbmZvPW51bGw7IC8vIHJlbW92ZSBwbGF5ZWRDYXJkSW5mbyB1bnRpbCB0aGUgbmV4dCBjYXJkIHRvIHBsYXkgaXMgYmVpbmcgYXNrZWRcbiAgICAgICAgICAgIGlmKHBsYXlhYmxlY2FyZENlbGwpe3BsYXlhYmxlY2FyZENlbGwuaW5uZXJIVE1MPVwiXCI7cGxheWFibGVjYXJkQ2VsbD1udWxsO30gLy8gZ2V0IHJpZCBvZiB0aGUgY2FyZCB0aGF0IHdhcyBwbGF5ZWQsIHNlbnQgYW5kIGFjY2VwdGVkXG4gICAgICAgICAgICAvLyBpdCdzIGEgc2VyaW91cyBidWcgd2hlbiB0aGUgY2FyZCBwbGF5ZWQgYnkgbWUgaXMgbm90IHJldHVybmVkIGFzIHBsYXllZCEhISFcbiAgICAgICAgICAgIGlmKHBsYXllZENhcmQuc3VpdGUhPWNhcmRJbmZvLnN1aXRlfHxwbGF5ZWRDYXJkLnJhbmshPWNhcmRJbmZvLnJhbmspXG4gICAgICAgICAgICAgICAgYnVnKFwiR2VzcGVlbGRlIGthYXJ0IG5pZXQgZ2VsaWprIGFhbiBnZXJlZ2lzdHJlZXJkZSBrYWFydCFcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNREhAMjdKQU4yMDIwOiBjYXJkSW5mbyBkb2VzIG5vdCBuZWVkIHRvIGNvbnRhaW4gdGhlIGFza2luZ0ZvclBhcnRuZXJDYXJkIGZsYWcgcGVyIHNlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGl0IGFjdHVhbGx5IG9ubHkgbmVlZCB0byBjb250YWluIGl0IHdoZW4gYXNraW5nIGZvciB0aGUgcGFydG5lciBjYXJkIGJsaW5kIGFzIGluIGFsbFxuICAgICAgICAvLyAgICAgICAgICAgICAgICBvdGhlciBjYXNlcyB0aGUgdHJpY2sgY2FuIGRldGVybWluZSBpdCBpdHNlbGYgYW5kIHNob3VsZCBOT1QgcmVseSBvbiBpbmZvcm1hdGlvbiBzZW50IGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgaXQgd291bGQgYmUgYmV0dGVyIHRvIGNoYW5nZSBpdCB0byBhc2tpbmdGb3JQYXJ0bmVyQ2FyZEJsaW5kIG9uIHRoZSBvdGhlciBzZXJ2ZXIgZW5kISFcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhpcyBpcyBzb2x2ZWQgYnkgc2VuZGluZyBwbGF5U3VpdGUgYWxvbmcgd2l0aCBjYXJkSW5mbyB3aGVuIHNvIG5lZWRlZCEhIVxuICAgICAgICAvKiByZXBsYWNpbmc6XG4gICAgICAgIGlmKGNhcmRJbmZvLmhhc093blByb3BlcnR5KFwiYXNraW5nRm9yUGFydG5lckNhcmRcIikpXG4gICAgICAgICAgICB0aGlzLl90cmljay5hc2tpbmdGb3JQYXJ0bmVyQ2FyZD1jYXJkSW5mby5hc2tpbmdGb3JQYXJ0bmVyQ2FyZDsgLy8gTURIQDI2SkFOMjAyMDogc2hvdWxkbid0IGZvcmdldCB0aGlzISEhIVxuICAgICAgICAqL1xuICAgICAgICAvLyBJIGRvbid0IHRoaW5rIHdlIGNhbiBkbyB0aGF0Pz8/Pz8gdGhpcy5fdHJpY2sud2lubmVyPWNhcmRJbmZvLndpbm5lcjtcbiAgICAgICAgbGV0IGVycm9yPXRoaXMuX3RyaWNrLmFkZENhcmQobmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mby5zdWl0ZSxjYXJkSW5mby5yYW5rKSk7XG4gICAgICAgIGlmKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpcmV0dXJuIGJ1ZyhlcnJvcik7IC8vIHdoaWNoIHdvdWxkIGJlIGEgc2VyaW91cyBidWc/Pz8/Pz8/P1xuXG4gICAgICAgIC8vIE1ESEAyN0pBTjIwMjA6IGlmIHdlJ3JlIHJlY2VpdmluZyB0aGUgcGxheSBzdWl0ZSB3ZSBjYW4gZGV0ZXJtaW5lIGFza2luZ0ZvclBhcnRuZXJDYXJkIG91cnNlbHZlc1xuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcInBsYXlTdWl0ZVwiKSl7XG4gICAgICAgICAgICAvLyBpZiB0aGUgcGxheSBzdWl0ZSBwcm92aWRlZCBkaWZmZXJzIGZyb20gdGhlICdhdXRvbWF0aWMnIHBsYXkgc3VpdGUsIHRoZSBwYXJ0bmVyIGNhcmQgaXMgYmVpbmcgYXNrZWQgYmxpbmRseVxuICAgICAgICAgICAgaWYoY2FyZEluZm8ucGxheVN1aXRlIT09dGhpcy5fdHJpY2sucGxheVN1aXRlKXtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmljay5wbGF5U3VpdGU9Y2FyZEluZm8ucGxheVN1aXRlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrLmFza2luZ0ZvclBhcnRuZXJDYXJkPS0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIE1ESEAyOUpBTjIwMjA6IE5PVCBleHBlY3RpbmcgdG8gcmVjZWl2ZSB0aGUgcGFydG5lciBpZHMgYW55bW9yZSEhIVxuICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBldmVyeSBjYXJkIHBsYXllZCBjb250YWlucyB0aGUgcGFydG5lcnMgYXMgd2VsbCEhIVxuICAgICAgICBpZihjYXJkSW5mby5oYXNPd25Qcm9wZXJ0eShcInBhcnRuZXJzXCIpKXRoaXMuX3NldFBhcnRuZXJJZHMoY2FyZEluZm8ucGFydG5lcnMpO1xuICAgICAgICAqL1xuICAgICAgICAvLyBpZiBhbGwgdGhlIGNhcmRzIGluIHRoZSB0cmljayBoYXZlIGJlZW4gcGxheWVkLCB0aGUgd2lubmVyIGlzIGRlZmluaXRlLCBhbmQgd2lucyB0aGUgdHJpY2tcbiAgICAgICAgaWYodGhpcy5fdHJpY2subnVtYmVyT2ZDYXJkcz09PTQpdGhpcy5fbnVtYmVyT2ZUcmlja3NXb25bdGhpcy5fdHJpY2sud2lubmVyXSsrO1xuICAgICAgICAvLyBkbyBub3RoaW5nLi4uXG4gICAgICAgIC8vIHNob3dUcmlja0NhcmQodGhpcy5fdHJpY2suZ2V0TGFzdENhcmQoKSx0aGlzLl90cmljay5udW1iZXJPZkNhcmRzKTtcbiAgICAgICAgc2hvd1RyaWNrKHRoaXMuX3RyaWNrKTsvL2lmKHRoaXMuX3RyaWNrV2lubmVyKXt0aGlzLl90cmlja1dpbm5lcj1udWxsO3Nob3dUcmljayh0aGlzLl90cmljayk7fVxuICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9DQVJEX1JFQ0VJVkVEKTtcbiAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKExhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW2NhcmRJbmZvLnN1aXRlXSkrXCIgXCIrTGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1tjYXJkSW5mby5yYW5rXStcIiBnZXNwZWVsZC5cIixcIlNwZWxcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKiByZXBsYWNpbmc6XG4gICAgcGFyc2VUcmljayh0cmlja0luZm8pe1xuICAgICAgICBsZXQgdHJpY2s9bmV3IFRyaWNrKHRyaWNrSW5mby5maXJzdFBsYXllcix0cmlja0luZm8udHJ1bXBTdWl0ZSx0cmlja0luZm8ucGFydG5lclN1aXRlLHRyaWNrSW5mby5wYXJ0bmVyUmFuayx0cmlja0luZm8uY2FuQXNrRm9yUGFydG5lckNhcmQpO1xuICAgICAgICAvLyBhbHJlYWR5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IhISFcbiAgICAgICAgLy8gdHJpY2suX2ZpcnN0UGxheWVyPXRyaWNrSW5mby5maXJzdFBsYXllcjtcbiAgICAgICAgLy8gdHJpY2suX2NhbkFza0ZvclBhcnRuZXJDYXJkPXRyaWNrSW5mby5jYW5Bc2tGb3JQYXJ0bmVyQ2FyZDtcbiAgICAgICAgaWYodHJpY2tJbmZvLmNhcmRzJiZ0cmlja0luZm8uY2FyZHMubGVuZ3RoPjApe1xuICAgICAgICAgICAgLy8gZmlsbCB0aGUgdHJpY2sgd2l0aCB0cmljayBpbmZvcm1hdGlvbiBmcm9tIHRoZSBvdGhlciBwbGF5ZXJzISEhXG4gICAgICAgICAgICB0cmlja0luZm8uY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSkuaG9sZGVyPXRyaWNrO30pOyAvLyBzdG9yZSB0aGUgY2FyZHMgcmVjZWl2ZWQgaW4gdHJpY2tcbiAgICAgICAgICAgIHRyaWNrLl93aW5uZXI9dHJpY2tJbmZvLndpbm5lcjtcbiAgICAgICAgICAgIHRyaWNrLl9wbGF5U3VpdGU9dHJpY2tJbmZvLnBsYXlTdWl0ZTtcbiAgICAgICAgICAgIHRyaWNrLl9hc2tpbmdGb3JQYXJ0bmVyQ2FyZD10cmlja0luZm8uYXNraW5nRm9yUGFydG5lckNhcmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWNrO1xuICAgIH1cbiAgICAqL1xuXG4gICAgYWNrbm93bGVkZ2VFdmVudHMoKXtcbiAgICAgICAgLy8gbm93IGlmIHRoZSB1bmFja25vd2xlZGdlIGV2ZW50IGlkcyBkbyBOT1QgcmVhY2ggdGhlIHNlcnZlciB3ZSB3aWxsIHJlY2VpdmUgY2VydGFpbiBldmVudHMgYWdhaW4gdW50aWwgd2UgZG9cbiAgICAgICAgLy8gbWFuYWdlIHRvIGdldCB0aGVtIG92ZXJcbiAgICAgICAgLy8gbWFrZSBhIGNvcHkgb2YgYWxsIHRoZSB1bmFja25vd2xlZGdlZCBldmVudHNcbiAgICAgICAgbGV0IGFja25vd2xlZGdlYWJsZUV2ZW50cz10aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cy5tYXAoKHVuYWNrbm93bGVkZ2VkRXZlbnQpPT5PYmplY3QuYXNzaWduKHt9LHVuYWNrbm93bGVkZ2VkRXZlbnQpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGFja25vd2xlZGdlYWJsZSBldmVudHM6IFwiLGFja25vd2xlZGdlYWJsZUV2ZW50cyk7XG4gICAgICAgIC8vIG9mIGNvdXJzZSB3ZSBjb3VsZCBzZW5kIHRoZW0gcGFzc2luZyBhbiBhY2tub3dsZWRnZSBmdW5jdGlvbiB0aG91Z2hcbiAgICAgICAgaWYoYWNrbm93bGVkZ2VhYmxlRXZlbnRzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIGVtaXQgcGFzc2luZyBhbG9uZyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdldCBjYWxsZWQgd2hlbiB0aGUgQUNLIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwiQUNLXCIsYWNrbm93bGVkZ2VhYmxlRXZlbnRzLCgpPT57XG4gICAgICAgICAgICAgICAgLy8gd2Ugbm93IG1heSByZW1vdmUgYWxsIGFja25vd2xlZGdlYWJsZSBldmVudHNcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKiBFdmVudHMgYWNrbm93bGVkZ2VtZW50cyByZWNlaXZlZCEgKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vLy8vZGlmZmVyZW5jZSh0aGlzLl91bmFja25vd2xlZGdlZEV2ZW50cyxhY2tub3dsZWRnZWFibGVFdmVudHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkdXBsaWNhdGVkIGZyb20gc2VydmVyLXNpZGUgUmlra2VuVGhlR2FtZS5qcyB0aGF0IHdpbGwgdHJhbnNsYXRlIHRoaXMuX3BsYXllcnNCaWRzIHRvIHJlYWRhYmxlIGJpZHNcbiAgICAvLyB0byBiZSBwYXNzZWQgdG8gdXBkYXRlQmlkc1RhYmxlKCkhISFcbiAgICBfZ2V0UGxheWVyQmlkc09iamVjdHMoKXtcbiAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3RzPVtdO1xuICAgICAgICB0aGlzLl9wbGF5ZXJzQmlkcy5mb3JFYWNoKChwbGF5ZXJCaWRzKT0+e1xuICAgICAgICAgICAgbGV0IHBsYXllckJpZHNPYmplY3Q9e25hbWU6dGhpcy5nZXRQbGF5ZXJOYW1lKHBsYXllckJpZHNPYmplY3RzLmxlbmd0aCksYmlkczpbXX07XG4gICAgICAgICAgICAvLyB1c2UgdW5zaGlmdCBOT1QgcHVzaCBhcyB0aGUgYmlkcyBhcmUgc3RvcmVkIHJldmVyc2Ugb3JkZXIgXG4gICAgICAgICAgICBwbGF5ZXJCaWRzLmZvckVhY2goKHBsYXllckJpZCk9PntwbGF5ZXJCaWRzT2JqZWN0LmJpZHMudW5zaGlmdChQbGF5ZXJHYW1lLkJJRF9OQU1FU1twbGF5ZXJCaWRdKX0pO1xuICAgICAgICAgICAgcGxheWVyQmlkc09iamVjdHMucHVzaChwbGF5ZXJCaWRzT2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGF5ZXJCaWRzT2JqZWN0cztcbiAgICB9XG5cbiAgICBfc2V0UGFydG5lcnMocGFydG5lcjEscGFydG5lcjIpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciAjXCIrKHBhcnRuZXIxKStcIiBhbmQgI1wiKyhwYXJ0bmVyMikrXCIgYXJlIHBhcnRuZXJzIVwiKTtcbiAgICAgICAgLy8gTURIQDA4REVDMjAxOTogaW5zdGVhZCBvZiBkaXJlY3RseSBzZXR0aW5nIHRoZSBwYXJ0bmVyIHByb3BlcnR5IG9mIGVhY2ggcGxheWVyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHdlIHdhaXQgd2l0aCBkb2luZyBzbyBhcyBzb29uIGFzIHRoZSBwYXJ0bmVyIGlzIGtub3duIChieSBwbGF5aW5nIHRoZSBwYXJ0bmVyIGNhcmQpXG4gICAgICAgIHRoaXMuX3BhcnRuZXJzPVstMSwtMSwtMSwtMV07XG4gICAgICAgIGxldCB0ZWFtcz1bW3BhcnRuZXIxLHBhcnRuZXIyXSxbXV07XG4gICAgICAgIC8vIE1ESEAyOUpBTjIwMjA6IGF0IHRoaXMgZW5kIHdlIGRvIG5vdCBoYXZlIF9wbGF5ZXJzIG9ubHkgX3BsYXllck5hbWVzIGFuZCB0aGVpciBfaW5kZXggaXMgdGhlaXIgcG9zaXRpb24gaW4gdGhlIGFycmF5IG9mIHBsYXllciBuYW1lcyEhISFcbiAgICAgICAgdGhpcy5fcGxheWVyTmFtZXMuZm9yRWFjaCgocGxheWVyTmFtZSxpbmRleCk9PntpZihpbmRleCE9PXBhcnRuZXIxJiZpbmRleCE9PXBhcnRuZXIyKXRlYW1zWzFdLnB1c2goaW5kZXgpO30pO1xuICAgICAgICB0ZWFtcy5mb3JFYWNoKCh0ZWFtKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZWFtOiBcIix0ZWFtKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRuZXJzW3RlYW1bMF1dPXRlYW1bMV07XG4gICAgICAgICAgICB0aGlzLl9wYXJ0bmVyc1t0ZWFtWzFdXT10ZWFtWzBdO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVycyBrbm93bjogXCIsdGhpcy5fcGFydG5lcnMpO1xuICAgIH1cblxuICAgIC8vIE1ESEAyOUpBTjIwMjA6IF9zZXRQYXJ0bmVyKCkgaXMgY2FsbGVkIHdoZW4gdGhlIFBBUlRORVIgZXZlbnQgaXMgcmVjZWl2ZWRcbiAgICAvLyAgICAgICAgICAgICAgICBpZiB0aGUgcGFydG5lciBvZiB0aGUgY3VycmVudCBwbGF5ZXIgaXMga25vd24sIGFsbCBwYXJ0bmVycyBhcmUga25vd25cbiAgICAvLyAgICAgICAgICAgICAgICBhbmQgdGhlIHBhcnRuZXIgaWRzIGNhbiBiZSBkZXJpdmVkISEhIVxuICAgIF9zZXRQYXJ0bmVyKHBhcnRuZXIpe1xuICAgICAgICBjdXJyZW50UGxheWVyLnBhcnRuZXI9cGFydG5lcjtcbiAgICAgICAgaWYoY3VycmVudFBsYXllci5wYXJ0bmVyPj0wKWlmKCF0aGlzLl9wYXJ0bmVycyl0aGlzLl9zZXRQYXJ0bmVycyhjdXJyZW50UGxheWVyLl9pbmRleCxjdXJyZW50UGxheWVyLnBhcnRuZXIpO1xuICAgIH1cblxuICAgIC8vIGdlbmVyaWMgbWV0aG9kIGZvciBwcm9jZXNzaW5nIGFueSBldmVudCwgZXZlcnlcbiAgICBwcm9jZXNzRXZlbnQoZXZlbnQsZXZlbnREYXRhLGFja25vd2xlZGdlKXtcbiAgICAgICAgLy8gbG9nIGV2ZXJ5IGV2ZW50XG4gICAgICAgIHRoaXMubG9nRXZlbnQoZXZlbnQsZXZlbnREYXRhKTtcbiAgICAgICAgaWYoIWV2ZW50KXJldHVybjsgLy8gTk9URSB0aGUgZXZlbnREYXRhIGNhbiBiZSBudWxsISEhISEhXG4gICAgICAgIC8vIGlmIGRhdGEgaGFzIGFuIGlkIGl0IG5lZWRzIHRvIGJlIGFja25vd2xlZGdlZFxuICAgICAgICBsZXQgZXZlbnRJZD0oZXZlbnREYXRhJiZldmVudERhdGEuaGFzT3duUHJvcGVydHkoXCJpZFwiKT9ldmVudERhdGEuaWQ6bnVsbCk7XG4gICAgICAgIC8vIGlmIHRoZXJlJ3MgYW4gZXZlbnQgaWQgaW4gdGhpcyBldmVudCwgYW5kIHdlJ3JlIHN1cHBvc2VkIHRvIHNlbmQgYWNrbm93bGVkZ2VtZW50cywgZG8gc29cbiAgICAgICAgaWYoZXZlbnRJZCl7XG4gICAgICAgICAgICAvLyBNREhAMTdKQU4yMDIwOiBub3cgcHVzaCB0aGUgZXZlbnQgbmFtZSBhcyB3ZWxsIHNvIHRoZSBzZXJ2ZXIgY2FuIGxvZyB0aGF0IGFuZCB3ZSBjYW4gc2VlIHdoYXQncyBhY2tub3dsZWdkZWQhISFcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIEJVVCBkb24ndCBwdXNoIGl0IGFnYWluIGlmIGl0J3MgYWxyZWFkeSB0aGVyZSEhISFcbiAgICAgICAgICAgIGlmKGFja25vd2xlZGdlKVxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLmxlbmd0aD09PTB8fHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzW3RoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLmxlbmd0aC0xXS5pZCE9PWV2ZW50SWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VuYWNrbm93bGVkZ2VkRXZlbnRzLnB1c2goeydpZCc6ZXZlbnRJZCwnZXZlbnQnOmV2ZW50fSk7XG4gICAgICAgICAgICB0aGlzLmFja25vd2xlZGdlRXZlbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRhdGE9KGV2ZW50SWQ/ZXZlbnREYXRhLnBheWxvYWQ6ZXZlbnREYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBST0NFU1NJTkcgRVZFTlQgXCIrZXZlbnQrXCIgPj4+XCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBzd2l0Y2goZXZlbnQpe1xuICAgICAgICAgICAgY2FzZSBcIklORk9cIjpcbiAgICAgICAgICAgICAgICBzZXRJbmZvKGRhdGEsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiU1RBVEVDSEFOR0VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlPWRhdGEudG87XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiR0FNRVwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0dBTUVfUkVDRUlWRUQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBpbmZvcm1hdGlvbiByZWNlaXZlZCBieSAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJy5cIixkYXRhKTtcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gc2V0IHRoZSBuYW1lIG9mIHRoZSBnYW1lIG5vd1xuICAgICAgICAgICAgICAgIHRoaXMubmFtZT1kYXRhO1xuICAgICAgICAgICAgICAgIC8vIHdhaXQgZm9yIHRoZSBwbGF5ZXIgbmFtZXMhISEhIVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBMQVlFUlNcIjpcbiAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9XQUlUX0ZPUl9DQVJEUyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lcz1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkRFQUxFUlwiOlxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYWxlcj1kYXRhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBUkRTXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQ0FSRFNfUkVDRUlWRUQpOyAvLyBvbmNlIHRoZSBjYXJkcyBoYXZlIGJlZW4gcmVjZWl2ZWRcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgaG9sZGFibGUgY2FyZCBmcm9tIGNhcmRJbmZvIHBhc3NpbmcgaW4gdGhlIGN1cnJlbnQgcGxheWVyIGFzIGNhcmQgaG9sZGVyXG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5fcmVtb3ZlQ2FyZHMoKTsgLy8gVE9ETyBmaW5kIGEgd2F5IE5PVCB0byBoYXZlIHRvIGRvIHRoaXMhISFcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goKGNhcmRJbmZvKT0+e25ldyBIb2xkYWJsZUNhcmQoY2FyZEluZm9bMF0sY2FyZEluZm9bMV0sY3VycmVudFBsYXllcik7fSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBBUlRORVJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRQYXJ0bmVyKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVfSU5GT1wiOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwaWNhbGx5IHRoZSBnYW1lIGluZm8gY29udGFpbnMgQUxMIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdGhlIGdhbWUgdGhhdCBpcyBnb2luZyB0byBiZSBwbGF5ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gaS5lLiBhZnRlciBiaWRkaW5nIGhhcyBmaW5pc2hlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnVtcFN1aXRlPWRhdGEudHJ1bXBTdWl0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydG5lclN1aXRlPWRhdGEucGFydG5lclN1aXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0bmVyUmFuaz1kYXRhLnBhcnRuZXJSYW5rO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdoZXN0QmlkPWRhdGEuaGlnaGVzdEJpZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGVzdEJpZGRlcnM9ZGF0YS5oaWdoZXN0QmlkZGVycztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm91cnRoQWNlUGxheWVyPWRhdGEuZm91cnRoQWNlUGxheWVyO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjBKQU4yMDIwOiBtb3ZlIHNob3dpbmcgdGhlIGdhbWUgaW5mbyBmcm9tIHBsYXlBQ2FyZCgpIHRvIGhlcmUhISEhXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpLmlubmVySFRNTD1nZXRHYW1lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9wYXJ0bmVyUmFuaz49MCl7IC8vIGEgcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclN1aXRlRWxlbWVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYXJ0bmVyLXN1aXRlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydG5lclN1aXRlRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbdGhpcy5fcGFydG5lclN1aXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lclJhbmtFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXItcmFuaycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJSYW5rRWxlbWVudC5pbm5lckhUTUw9TGFuZ3VhZ2UuRFVUQ0hfUkFOS19OQU1FU1t0aGlzLl9wYXJ0bmVyUmFua107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHBhcnRuZXJFbGVtZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcnRuZXInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0bmVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5PVwiaW5oZXJpdFwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgLy8gbm8gcGFydG5lciAoY2FyZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcGFydG5lckVsZW1lbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFydG5lcicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRuZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUT19CSURcIjpcbiAgICAgICAgICAgICAgICBpZihkYXRhIT09Y3VycmVudFBsYXllci5uYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfV0FJVF9GT1JfQklEKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgaGV0IGJvZCB2YW4gXCIrZGF0YStcIi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiVSB3b3JkdCB6byBvbSBlZW4gYm9kIGdldnJhYWdkLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIC8vIGlmKGRhdGEhPT1jdXJyZW50UGxheWVyLm5hbWUpXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBoZXQgYm9kIHZhbiA8Yj5cIitkYXRhK1wiPC9iPi5cIjtcbiAgICAgICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmlkLWluZm9cIikuaW5uZXJIVE1MPVwiV2F0IHdpbCBqZSBzcGVsZW4/XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiTUFLRV9BX0JJRFwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX0JJRCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5tYWtlQUJpZChkYXRhLnBsYXllckJpZHNPYmplY3RzLGRhdGEucG9zc2libGVCaWRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJCSURfTUFERVwiOiAvLyByZXR1cm5lZCB3aGVuIGEgYmlkIGlzIG1hZGUgYnkgc29tZW9uZVxuICAgICAgICAgICAgICAgIC8vLy8vLy8vL2lmKGRhdGEucGxheWVyPT09dGhpcy5fcGxheWVySW5kZXgpXG4gICAgICAgICAgICAgICAgaWYodG9NYWtlQUJpZD4wKXsgLy8gaXQncyBvdXIgYmlkISEhIVxuICAgICAgICAgICAgICAgICAgICB0b01ha2VBQmlkPTA7YmlkTWFkZT0tMTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDA3RkVCMjAyMCByZW1vdmluZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfQklEX1JFQ0VJVkVEKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1nZXRCaWRJbmZvKGRhdGEuYmlkLGRhdGEucGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleD9udWxsOnRoaXMuZ2V0UGxheWVyTmFtZShkYXRhLnBsYXllcikpO1xuICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIHRvIHJlY2VpdmUgaW4gZGF0YSBib3RoIHRoZSBwbGF5ZXIgYW5kIHRoZSBiaWRcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpZC1pbmZvXCIpLmlubmVySFRNTD1nZXRCaWRJbmZvKGRhdGEuYmlkLGRhdGEucGxheWVyPT09Y3VycmVudFBsYXllci5pbmRleD9udWxsOnRoaXMuZ2V0UGxheWVyTmFtZShkYXRhLnBsYXllcikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllcnNCaWRzW2RhdGEucGxheWVyXS5wdXNoKGRhdGEuYmlkKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIGhvdyB0byBzaG93IHRoZSBiaWRzPz8/Pz9cbiAgICAgICAgICAgICAgICB1cGRhdGVCaWRzVGFibGUodGhpcy5fZ2V0UGxheWVyQmlkc09iamVjdHMoKSk7XG4gICAgICAgICAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogZmFpbC1zYWZlIEJVVCB0aGlzIHNob3VsZCBiZSBkb25lIGFub3RoZXIgd2F5IFRPRE9cbiAgICAgICAgICAgICAgICBzZXRJbmZvKFwiQm9kIHZhbiBcIit0aGlzLmdldFBsYXllck5hbWUoZGF0YS5wbGF5ZXIpK1wiOiBcIitQbGF5ZXJHYW1lLkJJRF9OQU1FU1tkYXRhLmJpZF0rXCIuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVE9fUExBWVwiOlxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRQbGF5ZXIubmFtZSE9PWRhdGEpe1xuICAgICAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9XQUlUX0ZPUl9DQVJEKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIldlIHdhY2h0ZW4gb3AgZGUga2FhcnQgdmFuIFwiK2RhdGErXCIuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIlUgd29yZHQgem8gb20gZWVuIGthYXJ0IGdldnJhYWdkIVwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllci5uYW1lIT09ZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWluZm9cIikuaW5uZXJIVE1MPVwiV2Ugd2FjaHRlbiBvcCBkZSBrYWFydCB2YW4gPGI+XCIrZGF0YStcIjwvYj4uXCI7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktaW5mb1wiKS5pbm5lckhUTUw9XCJTcGVlbCBlZW4ga2FhcnQgYmlqLlwiO1xuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tTX1RPX1dJTlwiOlxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuc2V0TnVtYmVyT2ZUcmlja3NUb1dpbihkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJORVdfVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1RyaWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBBUlRORVJTXCI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXJ0bmVyIGlkcyByZWNlaXZlZCBCVVQgbm8gbG9uZ2VyIHVzZWQhXCIpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX3NldFBhcnRuZXJJZHMoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0FSRF9QTEFZRURcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0NhcmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvKiBNREhAMDNGRUIyMDIwOiB0aGUgcGxheWVyIGluZm8gaXMgbm93IHJlY2VpdmVkIGluIHRoZSBQTEFZX0FfQ0FSRCBldmVudFxuICAgICAgICAgICAgY2FzZSBcIlBMQVlFUl9JTkZPXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGNvbnRhaW4gdGhlIGN1cnJlbnQgY2FyZHMgdGhlIHVzZXIgaGFzXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNREhAMjNKQU4yMDIwOiBnYW1lIGtlZXBzIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgdHJpY2tzIHdvbiBieSBlYWNoIHBsYXllciEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIC8vIGFsc28gdGhlIG51bWJlciBvZiB0cmlja3Mgd29uIGFuZCB0byB3aW5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudFBsYXllci5udW1iZXJPZlRyaWNrc1dvbj1kYXRhLm51bWJlck9mVHJpY2tzV29uO1xuICAgICAgICAgICAgICAgICAgICAvLyAvLyBUT0RPIFBMQVlFUl9JTkZPIGRvZXMgbm90IG5lZWQgdG8gc2VuZCB0aGUgZm9sbG93aW5nIHdpdGggZWFjaCBQTEFZRVJfSU5GTyBUSE9VR0hcbiAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudFBsYXllci5zZXROdW1iZXJPZlRyaWNrc1RvV2luKGRhdGEubnVtYmVyT2ZUcmlja3NUb1dpbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNhc2UgXCJQTEFZX0FfQ0FSRFwiOlxuICAgICAgICAgICAgICAgIC8vIE1ESEAwNUZFQjIwMjA6IHRoaXMgaXMgYSBiaXQgb2YgYSBudWlzYW5jZSwgc2luY2Ugd2UgdXNlIHRoZSB0b1BsYXlBQ2FyZCBmbGFnIGluIHBsYXlBQ2FyZCwgYnV0IHdlIG5lZWQgaXQgaGVyZSBzbyBub3QgdG8gZG8gdGhlIGV4dHJhIHdvcmtcbiAgICAgICAgICAgICAgICBpZih0b1BsYXlBQ2FyZDw9MCl7IC8vIGZpcnN0IHRpbWUgcmVxdWVzdFxuICAgICAgICAgICAgICAgICAgICBzZXRQbGF5ZXJTdGF0ZShQTEFZRVJTVEFURV9DQVJEKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTURIQDAzRkVCMjAyMDogdGFraW5nIG92ZXIgZnJvbSBQTEFZRVJfSU5GTyBhcyB0aGUgY2FyZHMgYXJlIG5vdyByZWNlaXZlZCBpbiB0aGUgUExBWV9BX0NBUkQgZXZlbnQhISEhXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuX3JlbW92ZUNhcmRzKCk7IC8vIFRPRE8gZmluZCBhIHdheSBOT1QgdG8gaGF2ZSB0byBkbyB0aGlzISEhXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY2FyZHMuZm9yRWFjaCgoY2FyZEluZm8pPT57bmV3IEhvbGRhYmxlQ2FyZChjYXJkSW5mb1swXSxjYXJkSW5mb1sxXSxjdXJyZW50UGxheWVyKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5yZW5kZXJDYXJkcygpO1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWNlaXZpbmcgdHJpY2sgaW5mbyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAyMEpBTjIwMjA6IE5PVCBhbnltb3JlXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLl90cmljayl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmZvKFwiUHJvZ3JhbW1hZm91dDogVSB3b3JkdCBvbSBlZW4ga2FhcnQgZ2V2cmFhZ2QgaW4gZWVuIG9uZ2VkZWZpbmllZXJkZSBzbGFnISBXZSB3YWNodGVuIGV2ZW4gb3Agc2xhZ2luZm9ybWF0aWUuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIE1ESEAyN0pBTjIwMjA6IGRvaW5nIHRoaXMgYW5kIGhvcGluZyB0aGUgbmV4dCByZXF1ZXN0IGlzIHJlY2VpdmVkIEFGVEVSIHJlY2VpdmluZyBhIG5ldyB0cmljayEhIVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAyMkpBTjIwMjA6IG9jY2Fzc2lvbmFsbHkgd2UgbWF5IHJlY2VpdmUgdGhlIHJlcXVlc3QgdG8gcGxheSBCRUZPUkUgYWN0dWFsbHkgaGF2aW5nIHJlY2VpdmVkIHRoZSBzdGF0ZSBjaGFuZ2UhIVxuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50UGFnZSE9PVwicGFnZS1wbGF5aW5nXCIpc2V0UGFnZShcInBhZ2UtcGxheWluZ1wiKTsgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIucGxheUFDYXJkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ0hPT1NFX1RSVU1QX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VUcnVtcFN1aXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRSVU1QX1NVSVRFX0NIT1NFTlwiOlxuICAgICAgICAgICAgICAgIHNldFBsYXllclN0YXRlKFBMQVlFUlNUQVRFX1RSVU1QX1JFQ0VJVkVEKTtcbiAgICAgICAgICAgICAgICBzZXRJbmZvKGNhcGl0YWxpemUoTGFuZ3VhZ2UuRFVUQ0hfU1VJVEVfTkFNRVNbZGF0YV0pK1wiIGdla296ZW4gYWxzIHRyb2VmLlwiLFwiU2VydmVyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNIT09TRV9QQVJUTkVSX1NVSVRFXCI6XG4gICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5jaG9vc2VQYXJ0bmVyU3VpdGUoZGF0YS5zdWl0ZXMsZGF0YS5wYXJ0bmVyUmFua05hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlBBUlRORVJfU1VJVEVfQ0hPU0VOXCI6XG4gICAgICAgICAgICAgICAgc2V0UGxheWVyU3RhdGUoUExBWUVSU1RBVEVfUEFSVE5FUl9SRUNFSVZFRCk7XG4gICAgICAgICAgICAgICAgc2V0SW5mbyhjYXBpdGFsaXplKExhbmd1YWdlLkRVVENIX1NVSVRFX05BTUVTW2RhdGEuc3VpdGVdKStcIiBcIitMYW5ndWFnZS5EVVRDSF9SQU5LX05BTUVTW2RhdGEucmFua10rXCIgbWVlZ2V2cmFhZ2QuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVFJJQ0tcIjpcbiAgICAgICAgICAgICAgICB1cGRhdGVUcmlja3ModGhpcy5wYXJzZVRyaWNrKGRhdGEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJUUklDS1NcIjogLy8gTURIQDIzSkFOMjAyMDogd29uJ3QgYmUgcmVjZWl2aW5nIHRoaXMgZXZlbnQgYW55bW9yZS4uLlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXh0cmFjdCB0aGUgdHJpY2tzIGZyb20gdGhlIGFycmF5IG9mIHRyaWNrcyBpbiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWNrcz1kYXRhLm1hcCgodHJpY2tJbmZvKT0+e3JldHVybiB0aGlzLnBhcnNlVHJpY2sodHJpY2tJbmZvKTt9KTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlJFU1VMVFNcIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIHdvbid0IGJlIHJlY2VpdmluZyBhIG5ldyB0cmljayBldmVudCwgYnV0IHdlIHN0aWxsIHdhbnQgdG8gc2hvdyB0aGUgdXNlciB0aGF0IHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBjaGVjayBpZiB0aGUgcGFnZSBtb3ZlZCB0byB0aGUgcmVzdWx0cyBwYWdlPz8/Pz8/XG4gICAgICAgICAgICAgICAgICAgIC8qIHJlbW92ZWQsIGFzIHRoZXNlIHRoaW5ncyBhcmUgZG9uZSB3aGVuIHRoZSBnYW1lIG92ZXIgbWVzc2FnZSBpcyByZWNlaXZlZC4uLlxuICAgICAgICAgICAgICAgICAgICBjbGVhckNhcmRzUGxheWVkVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fdHJpY2spdXBkYXRlVHJpY2tzUGxheWVkVGFibGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbHRhUG9pbnRzPWRhdGEuZGVsdGFwb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BvaW50cz1kYXRhLnBvaW50cztcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUGxheWVyUmVzdWx0c1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkdBTUVPVkVSXCI6XG4gICAgICAgICAgICAgICAgLy8ga2lsbCB0aGUgZ2FtZSBpbnN0YW5jZSAocmV0dXJuaW5nIHRvIHRoZSBydWxlcyBwYWdlIHVudGlsIGFzc2lnbmVkIHRvIGEgZ2FtZSBhZ2FpbilcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgbmV3LWdhbWUgb3Igc3RvcCBidXR0b24gY2xpY2shISEhISBpZihjdXJyZW50UGxheWVyKWN1cnJlbnRQbGF5ZXIucGxheXNUaGVHYW1lQXRJbmRleChudWxsLC0xKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmV4aXQoXCJpbiByZXNwb25zZSB0byAnXCIrZGF0YStcIidcIik7XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBhZ2UhPT1cInBhZ2UtZmluaXNoZWRcIilzZXRQYWdlKFwicGFnZS1maW5pc2hlZFwiKTsgLy8gaWYgd2UgYXJlbid0IHRoZXJlIHlldCEhIVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNREhAMjJKQU4yMDIwOiBiZXR0ZXIgbm90IHRvIGdvIG91dCBvZiBvcmRlciB3aGVuIHRoaXMgaGFwcGVucyEhISEhIVxuICAgICAgICAgICAgICAgIHNldEluZm8oXCJWZXJiaW5kaW5nIG1ldCBkZSBzZXJ2ZXIgKHRpamRlbGlqaykgdmVyYnJva2VuIVwiLFwiU2VydmVyXCIpOyAvLyByZXBsYWNpbmc6IHRoaXMuc3RhdGU9UGxheWVyR2FtZS5PVVRfT0ZfT1JERVI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFVua25vd24gZXZlbnQgXCIrZXZlbnQrXCIgcmVjZWl2ZWQhXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3ByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJlcGFyaW5nIGZvciBjb21tdW5pY2F0aW9uXCIpO1xuICAgICAgICAvLyB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCgpPT57XG4gICAgICAgIC8vICAgICB0aGlzLl9zdGF0ZT1JRExFO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgdGhpcy5fdW5hY2tub3dsZWRnZWRFdmVudHM9W107IC8vIGtlZXAgdHJhY2sgb2YgdGhlIHVuYWNrbm93bGVkZ2VkRXZlbnRJZHNcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywoKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdkaXNjb25uZWN0JyxudWxsLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0lORk8nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdJTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1NUQVRFQ0hBTkdFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnU1RBVEVDSEFOR0UnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0dBTUUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUExBWUVSUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlFUlMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignREVBTEVSJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnREVBTEVSJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NBUkRTJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQ0FSRFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUEFSVE5FUicsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BBUlRORVInLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRV9JTkZPJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnR0FNRV9JTkZPJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJUT19CSURcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ01BS0VfQV9CSUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdNQUtFX0FfQklEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0JJRF9NQURFJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnQklEX01BREUnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihcIlRPX1BMQVlcIiwoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVE9fUExBWScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gTURIQDEzSkFOMjAyMDogcGxheWVyIGluZm8gd2lsbCBiZSByZWNlaXZlZCBiZWZvcmUgYmVpbmcgYXNrZWQgdG8gcGxheSBhIGNhcmQgdG8gdXBkYXRlIHRoZSBwbGF5ZXIgZGF0YVxuICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJQTEFZRVJfSU5GT1wiLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdQTEFZRVJfSU5GTycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1NfVE9fV0lOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnVFJJQ0tTX1RPX1dJTicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdORVdfVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdORVdfVFJJQ0snLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0FSRF9QTEFZRUQnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdDQVJEX1BMQVlFRCcsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdQTEFZX0FfQ0FSRCcsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1BMQVlfQV9DQVJEJyxkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ0NIT09TRV9UUlVNUF9TVUlURScsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ0NIT09TRV9UUlVNUF9TVUlURScsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUlVNUF9TVUlURV9DSE9TRU4nLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUlVNUF9TVUlURV9DSE9TRU4nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignQ0hPT1NFX1BBUlRORVJfU1VJVEUnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KFwiQ0hPT1NFX1BBUlRORVJfU1VJVEVcIixkYXRhLHRydWUpO30pO1xuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ1BBUlRORVJfU1VJVEVfQ0hPU0VOJywoZGF0YSk9Pnt0aGlzLnByb2Nlc3NFdmVudCgnUEFSVE5FUl9TVUlURV9DSE9TRU4nLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignVFJJQ0snLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDSycsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdUUklDS1MnLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdUUklDS1MnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignUkVTVUxUUycsKGRhdGEpPT57dGhpcy5wcm9jZXNzRXZlbnQoJ1JFU1VMVFMnLGRhdGEsdHJ1ZSk7fSk7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignR0FNRU9WRVInLChkYXRhKT0+e3RoaXMucHJvY2Vzc0V2ZW50KCdHQU1FT1ZFUicsZGF0YSx0cnVlKTt9KTtcbiAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBtdWx0aXBsZSBldmVudHMgYXMgYSB3aG9sZSwgd2UgcHJvY2VzcyBhbGwgb2YgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignRVZFTlRTJywoZXZlbnRzKT0+e1xuICAgICAgICAgICAgLy8gd2UgY291bGQgY29uc3VtZSB0aGUgZXZlbnRzIEkgZ3Vlc3NcbiAgICAgICAgICAgIHdoaWxlKGV2ZW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgZXZlbnQ9ZXZlbnRzLnNoaWZ0KCk7IC8vIHJlbW92ZSB0aGUgZmlyc3QgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBhc2NlcnRhaW4gdG8gc2VuZCBhbGwgdW5hY2tub3dsZWRnZWQgZXZlbnQgaWRzIHdoZW4gdGhpcyBpcyB0aGUgbGFzdCBwcm9jZXNzIGV2ZW50ISEhIVxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50LmV2ZW50LGV2ZW50LmRhdGEsZXZlbnRzLmxlbmd0aD09PTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBNREhAMjlKQU4yMDIwOiBpZiB3ZSB3YW50IHRvIGJlIGFibGUgdG8gbWFrZSB0aGlzIHBsYXllciBwbGF5IG1vcmUgdGhhbiBvbmUgZ2FtZSB3aXRoIHRoZSBzYW1lIEdhbWUgaW5zdGFuY2VcbiAgICAvLyAgICAgICAgICAgICAgICAodGhpcyBvbmUpLCB3ZSBuZWVkIHRvIHRha2UgYWxsIGluaXRpYWxpemF0aW9uIG91dCBvZiB0aGUgY29uc3RydWN0b3IgYW5kIHB1dCBpdCBpbiBoZXJlXG4gICAgX2luaXRpYWxpemVHYW1lKCl7XG4gICAgICAgIHRoaXMuX3N0YXRlPVBsYXllckdhbWUuT1VUX09GX09SREVSO1xuICAgICAgICB0aGlzLl9ldmVudHNSZWNlaXZlZD1bXTtcbiAgICAgICAgdGhpcy5fdHJpY2tXaW5uZXI9bnVsbDtcbiAgICAgICAgdGhpcy5fZGVhbGVyPS0xO1xuICAgICAgICB0aGlzLl90cnVtcFN1aXRlPS0xOy8vdGhpcy5fdHJ1bXBQbGF5ZXI9LTE7XG4gICAgICAgIHRoaXMuX3BhcnRuZXJTdWl0ZT0tMTt0aGlzLl9wYXJ0bmVyUmFuaz0tMTtcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZUcmlja3NXb249WzAsMCwwLDBdOyAvLyBhc3N1bWUgbm8gdHJpY2tzIHdvbiBieSBhbnlib2R5XG4gICAgICAgIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkPTA7dGhpcy5fdHJpY2s9bnVsbDtcbiAgICAgICAgdGhpcy5faGlnaGVzdEJpZD0tMTt0aGlzLl9oaWdoZXN0QmlkZGVycz1bXTt0aGlzLnRydW1wUGxheWVyPS0xOyAvLyBubyBoaWdoZXN0IGJpZGRlcnMgeWV0XG4gICAgICAgIHRoaXMuX3BsYXllcnNCaWRzPVtbXSxbXSxbXSxbXV07IC8vIE1ESEAyMUpBTjIwMjA6IGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBiaWRzIHRvIHNob3dcbiAgICAgICAgdGhpcy5fZGVsdGFQb2ludHM9bnVsbDtcbiAgICAgICAgdGhpcy5fcG9pbnRzPW51bGw7XG4gICAgICAgIC8vIHRoaXMuX2xhc3RUcmlja1BsYXllZD1udWxsO1xuICAgICAgICAvLyB0aGlzLl90ZWFtTmFtZXM9bnVsbDtcbiAgICAgICAgdGhpcy5fcGxheWVySW5kZXg9LTE7IC8vIHRoZSAnY3VycmVudCcgcGxheWVyXG4gICAgICAgIC8vIHRoaW5ncyB3ZSBjYW4gc3RvcmUgaW50ZXJuYWxseSB0aGF0IHdlIHJlY2VpdmUgb3ZlciB0aGUgY29ubmVjdGlvblxuICAgICAgICB0aGlzLl9uYW1lPW51bGw7IC8vIHRoZSBuYW1lIG9mIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuX3BsYXllck5hbWVzPW51bGw7IC8vIHRoZSBuYW1lcyBvZiB0aGUgcGxheWVyc1xuICAgICAgICB0aGlzLl9wYXJ0bmVycz1udWxsOyAvLyB0aGUgcGFydG5lcnMgKHVzaW5nIHRoZSBzYW1lIG5hbWUgYXMgaW4gKHNlcnZlci1zaWRlKSBSaWtrZW5UaGVHYW1lLmpzKVxuICAgIH1cblxuICAgIC8vIE1ESEAwOEpBTjIwMjA6IHNvY2tldCBzaG91bGQgcmVwcmVzZW50IGEgY29ubmVjdGVkIHNvY2tldC5pbyBpbnN0YW5jZSEhIVxuICAgIGNvbnN0cnVjdG9yKHNvY2tldCl7XG4gICAgICAgIC8vIE9PUFMgZGlkbid0IGxpa2UgZm9yZ2V0dGluZyB0aGlzISEhIFxuICAgICAgICAvLyBidXQgUGxheWVyR2FtZSBkb2VzIE5PVCBoYXZlIGFuIGV4cGxpY2l0IGNvbnN0cnVjdG9yIChpLmUuIG5vIHJlcXVpcmVkIGFyZ3VtZW50cylcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc29ja2V0PXNvY2tldDtcbiAgICAgICAgdGhpcy5fc2VudEV2ZW50UmVjZWl2ZWQ9dGhpcy5fc2VudEV2ZW50UmVjZWl2ZWQuYmluZCh0aGlzKTt0aGlzLl9zZW5kRXZlbnQ9dGhpcy5fc2VuZEV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVHYW1lKCk7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVGb3JDb21tdW5pY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgaXRzZWxmIG9yZ2FuaXplZCBieSBzdGF0ZVxuICAgIC8vIFBMQVlJTkdcbiAgICBnZXRUcnVtcFN1aXRlKCl7cmV0dXJuIHRoaXMuX3RydW1wU3VpdGU7fVxuICAgIGdldFBhcnRuZXJTdWl0ZSgpe3JldHVybiB0aGlzLl9wYXJ0bmVyU3VpdGU7fVxuICAgIGdldFBhcnRuZXJSYW5rKCl7cmV0dXJuIHRoaXMuX3BhcnRuZXJSYW5rO31cbiAgICAvLyBnZXRUcnVtcFBsYXllcigpe3JldHVybiB0aGlzLl90cnVtcFBsYXllcjt9XG4gICAgXG4gICAgZ2V0UGFydG5lck5hbWUocGxheWVyKXsgLy8gb25seSB3aGVuIHBsYXllciBlcXVhbHMgdGhpcy5fcGxheWVySW5kZXggZG8gd2Uga25vdyB0aGUgcGFydG5lclxuICAgICAgICBsZXQgcGFydG5lcj0ocGxheWVyPT09dGhpcy5fcGxheWVySW5kZXg/Y3VycmVudFBsYXllci5wYXJ0bmVyOi0xKTtcbiAgICAgICAgcmV0dXJuKHBhcnRuZXI+PTAmJnBhcnRuZXI8dGhpcy5udW1iZXJPZlBsYXllcnM/dGhpcy5fcGxheWVyTmFtZXNbcGFydG5lcl06bnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0SGlnaGVzdEJpZGRlcnMoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZGRlcnM7fVxuICAgIGdldEhpZ2hlc3RCaWQoKXtyZXR1cm4gdGhpcy5faGlnaGVzdEJpZDt9XG4gICAgLy8gTURIQDAzSkFOMjAyMDogSSBuZWVkZWQgdG8gYWRkIHRoZSBmb2xsb3dpbmcgbWV0aG9kc1xuICAgIC8vIGdldFBsYXllck5hbWUocGxheWVyKXtyZXR1cm4odGhpcy5fcGxheWVyTmFtZXMmJnBsYXllcjx0aGlzLl9wbGF5ZXJOYW1lcy5sZW5ndGg/dGhpcy5fcGxheWVyTmFtZXNbcGxheWVyXTpcIj9cIik7fVxuICAgIGdldCBkZWx0YVBvaW50cygpe3JldHVybiB0aGlzLl9kZWx0YVBvaW50czt9XG4gICAgZ2V0IHBvaW50cygpe3JldHVybiB0aGlzLl9wb2ludHM7fVxuXG4gICAgaXNQbGF5ZXJQYXJ0bmVyKHBsYXllckluZGV4LG90aGVyUGxheWVySW5kZXgpe3JldHVybih0aGlzLl9wYXJ0bmVycz90aGlzLl9wYXJ0bmVyc1twbGF5ZXJJbmRleF09PT1vdGhlclBsYXllckluZGV4OmZhbHNlKTt9XG4gICAgXG4gICAgLy8gZ2V0TGFzdFRyaWNrUGxheWVkKCl7cmV0dXJuIHRoaXMuX2xhc3RUcmlja1BsYXllZDt9IC8vIFRPRE8gc3RpbGwgdXNlZD8/Pz8/XG4gICAgZ2V0IG51bWJlck9mVHJpY2tzUGxheWVkKCl7cmV0dXJuIHRoaXMuX251bWJlck9mVHJpY2tzUGxheWVkO31cbiAgICAvLyBnZXRUcmlja0F0SW5kZXgodHJpY2tJbmRleCl7fSAvLyBnZXQgdGhlIGxhc3QgdHJpY2sgcGxheWVkXG4gICAgZ2V0IGZvdXJ0aEFjZVBsYXllcigpe3JldHVybiB0aGlzLl9mb3VydGhBY2VQbGF5ZXI7fVxuICAgIGdldFRlYW1OYW1lKHBsYXllckluZGV4KXtcbiAgICAgICAgLy8gY29tcHV0aW5nIHRoZSB0ZWFtIG5hbWUgb24gdGhlIGZseVxuICAgICAgICAvLyBvaywgSSd2ZSBjaGFuZ2Ugc2VuZGluZyB0aGUgcGFydG5lcklkcyBvdmVyIHRvIHRoZSBnYW1lLCBpbnN0ZWFkIG5vdyBwYXJ0bmVyIGlzIGJlaW5nIHNldFxuICAgICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgd2UgbmVlZCB0byBnbyB0aHJvdWdoIHRoZSBwbGF5ZXIgYWdhaW5cbiAgICAgICAgLypcbiAgICAgICAgbGV0IHBsYXllcj10aGlzLl9wbGF5ZXJzW3BsYXllckluZGV4XTtcbiAgICAgICAgbGV0IHBhcnRuZXJJbmRleD1wbGF5ZXIucGFydG5lcjtcbiAgICAgICAgcmV0dXJuIHBsYXllci5uYW1lKyhwYXJ0bmVySW5kZXg+PTA/XCIgJiBcIit0aGlzLmdldFBsYXllck5hbWUocGFydG5lckluZGV4KTpcIlwiKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gTk9UIHJlcGxhY2luZzpcbiAgICAgICAgbGV0IHRlYW1OYW1lPXRoaXMuZ2V0UGxheWVyTmFtZShwbGF5ZXJJbmRleCk7XG4gICAgICAgIC8vIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIGN1cnJlbnQgcGxheWVyIGJlaW5nIGFza2VkIGFuZCBhbm90aGVyIHBsYXllclxuICAgICAgICBsZXQga25vd25QYXJ0bmVySW5kZXg9KHRoaXMuX3BhcnRuZXJzP3RoaXMuX3BhcnRuZXJzW3BsYXllckluZGV4XTotMSk7IC8vIE5PVEUgY291bGQgYmUgbnVsbCEhIVxuICAgICAgICAvLyBpZiB0aGUgcGxheWVyIGlzIHBsYXlpbmcgYnkgaGltL2hlcnNlbGYgdGhlcmUgc2hvdWxkbid0IGJlIGEgcGFydG5lciEhISFcbiAgICAgICAgaWYodGhpcy5faGlnaGVzdEJpZCE9PVBsYXllckdhbWUuQklEX1JJSyYmdGhpcy5faGlnaGVzdEJpZCE9PVBsYXllckdhbWUuQklEX1JJS19CRVRFUiYmdGhpcy5faGlnaGVzdEJpZCE9PVBsYXllckdhbWUuQklEX1RST0VMQSl7XG4gICAgICAgICAgICBpZihwbGF5ZXJJbmRleD09PWN1cnJlbnRQbGF5ZXIuX2luZGV4JiZjdXJyZW50UGxheWVyLnBhcnRuZXI+PTApdGVhbU5hbWUrPVwiP1wiO1xuICAgICAgICAgICAgaWYoa25vd25QYXJ0bmVySW5kZXg+PTApdGVhbU5hbWUrPVwiJj9cIjsgLy8gc29tZSBlcnJvciBhcHBhcmVudGx5ISEhISFcbiAgICAgICAgICAgIHJldHVybiB0ZWFtTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0ZWFtTmFtZSs9XCIgXCI7IC8vIHdlJ2xsIGhhdmUgcGFydG5lciBpbmZvcm1hdGlvbiBiZWhpbmRcbiAgICAgICAgaWYocGxheWVySW5kZXg9PT10aGlzLl9wbGF5ZXJJbmRleCl7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBhcnRuZXJJbmRleD1jdXJyZW50UGxheWVyLnBhcnRuZXI7IC8vIHRoZSBwbGF5ZXIgdGhhdCBoYXMgdGhlIHJlcXVlc3RlZCBwYXJ0bmVyIGNhcmQga25vd3MgaGlzIHBhcnRuZXIuLi5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHBhcnRuZXIgaW5kZXggaXMga25vd24gYnV0IHRoZSBrbm93blBhcnRuZXJJbmRleCBpcyBub3Qgd2Ugd3JhcCB0aGUgbmFtZSBpbiAoKVxuICAgICAgICAgICAgaWYoY3VycmVudFBhcnRuZXJJbmRleD49MCYma25vd25QYXJ0bmVySW5kZXg8MCl0ZWFtTmFtZSs9XCIgKFwiO1xuICAgICAgICAgICAgdGVhbU5hbWUrPVwiICYgXCI7IC8vIHdlIGFyZSB3aXRoIGEgcGFydG5lciAoYWx0aG91Z2ggd2UgbWlnaHQgbm90IGN1cnJlbnRseSBrbm93IHdobylcbiAgICAgICAgICAgIC8vIHRoZSBvZmZpY2lhbCBwYXJ0bmVyIChhcyBrbm93biB0byB0aGUgY3VycmVudCBwbGF5ZXIpIGlzIHRoZSBvbmUgZnJvbSBjdXJyZW50UGFydG5lckluZGV4IChhbmQgd2Ugc2hvdyB0aGF0IG5hbWUhKVxuICAgICAgICAgICAgaWYodGhpcy5fcGFydG5lcnMpdGVhbU5hbWUrPShjdXJyZW50UGFydG5lckluZGV4Pj0wP3RoaXMuZ2V0UGxheWVyTmFtZShjdXJyZW50UGFydG5lckluZGV4KTpcIj9cIik7XG4gICAgICAgICAgICAvLyBjYW4gd2UgZGVhbCB3aXRoIGVycm9yIHNpdHVhdGlvbnMgbm93Pz8/Pz8/XG4gICAgICAgICAgICAvLyB0eXBpY2FsbHkgdGhpcyB3b3VsZCBiZSB0aGUgY2FzZSBpZiB0aGUga25vd24gcGFydG5lciBpbmRleCBkaWZmZXJzIGZyb20gdGhlIHBhcnRuZXIgaW5kZXggcmVnaXN0ZXJlZCB3aXRoIHRoZSBwbGF5ZXIhISFcbiAgICAgICAgICAgIGlmKGtub3duUGFydG5lckluZGV4Pj0wJiZjdXJyZW50UGFydG5lckluZGV4IT09a25vd25QYXJ0bmVySW5kZXgpXG4gICAgICAgICAgICAgICAgdGVhbU5hbWUrPVwiP1wiKyhrbm93blBhcnRuZXJJbmRleD49MD90aGlzLmdldFBsYXllck5hbWUoa25vd25QYXJ0bmVySW5kZXgpOlwiXCIpO1xuICAgICAgICAgICAgaWYoY3VycmVudFBhcnRuZXJJbmRleD49MCYma25vd25QYXJ0bmVySW5kZXg8MCl0ZWFtTmFtZSs9XCIpXCI7ICAgIFxuICAgICAgICB9ZWxzZSAvLyBuYW1lIG9mIGFub3RoZXIgcGxheWVyJ3MgcGFydG5lciBiZWluZyBhc2tlZCwgY2FuIG9ubHkgYmUgYXZhaWxhYmxlIHRocm91Z2ggdGhpcy5fcGFydG5lcnNcbiAgICAgICAgICAgIHRlYW1OYW1lKz1cIiAmIFwiKyhrbm93blBhcnRuZXJJbmRleD49MD90aGlzLmdldFBsYXllck5hbWUoa25vd25QYXJ0bmVySW5kZXgpOlwiP1wiKTtcbiAgICAgICAgcmV0dXJuIHRlYW1OYW1lO1xuICAgIH1cbn1cblxudmFyIHByZXBhcmVkRm9yUGxheWluZz1mYWxzZTtcblxuZnVuY3Rpb24gcHJlcGFyZUZvclBsYXlpbmcoKXtcblxuICAgIHByZXBhcmVkRm9yUGxheWluZz10cnVlO1xuXG4gICAgc2VuZE1lc3NhZ2VUZXh0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VuZC1tZXNzYWdlLXRleHRcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLW1lc3NhZ2UtYnV0dG9uXCIpLm9uY2xpY2s9c2VuZE1lc3NhZ2VCdXR0b25DbGlja2VkO1xuXG4gICAgLy8gTURIQDEwSkFOMjAyMDogd2Ugd2FudCB0byBrbm93IHdoZW4gdGhlIHVzZXIgaXMgdHJ5aW5nIHRvIG1vdmUgYXdheSBmcm9tIHRoZSBwYWdlXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGhvdyBhYm91dCBwcm9tcHRpbmcgdGhlIHVzZXI/Pz8/P1xuICAgICAgICAvLyBpZighY3VycmVudFBsYXllcnx8IWN1cnJlbnRQbGF5ZXIuZ2FtZSlyZXR1cm47IC8vIGRvIG5vdCBhc2sgdGhlIHVzZXIgd2hldGhlciB0aGV5IHdhbnQgdG8gc3RheSBvciBub3QgKGFzIHRoZXkgY2Fubm90IHN0YXkpXG4gICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIHZpZXdpbmcgdGhlIHJlc3VsdHMgcGFnZSB3ZSBtYXkgYXNzdW1lIHRoYXQgdGhlIGdhbWUgaXMgYWN0dWFsbHkgb3ZlclxuICAgICAgICByZXR1cm4oY3VycmVudFBhZ2U9PT0ncGFnZS1yZXN1bHRzJz9cIkJlZGFua3Qgdm9vciBoZXQgc3BlbGVuLiBUb3QgZGUgdm9sZ2VuZGUga2VlciFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcIkhldCBzcGVsIGlzIG5vZyBuaWV0IHRlbiBlaW5kZS4gQmxpamYgb3AgZGUgcGFnaW5hIG9tIHRvY2ggdmVyZGVyIHRlIHNwZWxlbi5cIik7XG4gICAgfTtcbiAgICAvLyBpZiB3ZSBhY3R1YWxseSBlbmQgdXAgaW4gbGVhdmluZyB0aGlzIFVSTCwgd2UgZGVmaW5pdGVseSB3YW50IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBmb3IgZ29vZFxuICAgIHdpbmRvdy5vbnBvcHN0YXRlPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIE1ESEAwN0ZFQjIwMjA6IGl0J3Mga2luZGEgcnVkZSB0byBsZWF2ZSB0aGUgcGFnZSBpbiB0aGUgbWlkZGxlIG9mIGEgZ2FtZSB3aXRob3V0IHRlbGxpbmcgdGhlIGdhbWUgZW5naW5lXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIEkgc3VwcG9zZSB3ZSBzaG91bGQgaGFuZGxlIHRoaXMgZGlmZmVyZW50bHkgZS5nLiBieSBydW5uaW5nIHNvbWUgc29ydCBvZiBwaW5nIHRpbWVyIHRlbGxpbmcgdGhlIGdhbWUgdG8gYmUgYWxpdmVcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgc28gdGhhdCB0aGUgZ2FtZSBlbmdpbmUgY2FuIHRocm93IGEgcGVyc29uIG91dCBhdCB0aGUgcmlnaHQgdGltZVxuICAgICAgICBpZihjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLmdhbWUmJmN1cnJlbnRQbGF5ZXIuZ2FtZS5zdGF0ZSE9PVBsYXllckdhbWUuRklOSVNIRUQpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IFBsYXllciAnXCIrY3VycmVudFBsYXllci5uYW1lK1wiJyBoYXMgc3RvcHBlZCBwbGF5aW5nIHRoZSBnYW1lIGFueSBmdXJ0aGVyLCBlZmZlY3RpdmVseSBjYW5jZWxpbmcgaXQuXCIpO1xuICAgICAgICAvKiBub3QgbXVjaCB1c2UgdG8gZG8gYW55dGhpbmcuLi5cbiAgICAgICAgaWYoY3VycmVudFBsYXllciljdXJyZW50UGxheWVyLmV4aXQoJ0VYSVQnKTsgLy8gaWYgd2UgaGF2ZW4ndCBkb25lIHNvIHlldCEhISFcbiAgICAgICAgc2V0UGxheWVyTmFtZShudWxsLG51bGwpOyAvLyB3aXRob3V0IGNhbGxiYWNrIG5vIHBhZ2Ugc2hvdWxkIGJlIHNob3duIGFueW1vcmUuLi5cbiAgICAgICAgKi9cbiAgICB9XG5cbiAgICAvLyBNREhAMDlKQU4yMDIwOiBoaWRlIHRoZSBiaWRkaW5nIGFuZCBwbGF5aW5nIGVsZW1lbnRzXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaWRkaW5nXCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjtcbiAgICAvLyByZXBsYWNlZCBieSBiaWQtaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1iaWRcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFO1xuICAgIC8vIERPIE5PVCBETyBUSElTIFdJTEwgT1ZFUlJVTEUgUEFSRU5UOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlpbmdcIikuc3R5bGUudmlzaWJpbGl0eT1WSVNJQkxFOyAvLyBNREhAMTlKQU4yMDIwOiBcImhpZGRlblwiIGNoYW5nZWQgdG8gXCJ2aXNpYmxlXCIgYXMgd2UgbmV2ZXIgaGlkZSB0aGUgY2FyZHMgb2YgdGhlIGN1cnJlbnQgcGxheWVyc1xuICAgIC8vIHJlcGxhY2VkIGJ5IHBsYXktaW5mbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0LWZvci1wbGF5XCIpLnN0eWxlLnZpc2liaWxpdHk9XCJoaWRkZW5cIjsgLy8gTURIQDE5SkFOMjAyMDogYW5kIHZpY2UgdmVyc2FcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW5nbGUtcGxheWVyLWdhbWUtYnV0dG9uJykub25jbGljaz1zaW5nbGVQbGF5ZXJHYW1lQnV0dG9uQ2xpY2tlZDtcbiAgICBcbiAgICBmb3IobGV0IGJhY2tCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjaycpKWJhY2tCdXR0b24ub25jbGljaz1yZXR1cm5Ub1ByZXZpb3VzUGFnZTtcbiAgICAvLyBzaG93IHRoZSBwYWdlLXJ1bGVzIHBhZ2Ugd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBoZWxwXG4gICAgZm9yKGxldCBoZWxwQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlbHAnKSloZWxwQnV0dG9uLm9uY2xpY2s9c2hvd0hlbHA7XG4gICAgLy8gTURIQDEwSkFOMjAyMDogRU5EXG5cbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgbmV4dCwgY2FuY2VsLCBhbmQgbmV3UGxheWVycyBidXR0b25zXG4gICAgZm9yKGxldCBuZXh0QnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25leHQnKSluZXh0QnV0dG9uLm9uY2xpY2s9bmV4dFBhZ2U7XG4gICAgZm9yKGxldCBjYW5jZWxCdXR0b24gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FuY2VsJykpY2FuY2VsQnV0dG9uLm9uY2xpY2s9Y2FuY2VsUGFnZTtcblxuICAgIGZvcihsZXQgc3RvcEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdG9wJykpc3RvcEJ1dHRvbi5vbmNsaWNrPXN0b3BCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIGxldCdzIGFzc3VtZSB0aGF0IHRoZSBnYW1lIGlzIG92ZXIgd2hlbiBuZXctZ2FtZSBidXR0b25zIGFyZSBzaG93aW5nXG4gICAgLy8gd2UncmUgbm90IHRvIGtpbGwgdGhlIGNvbm5lY3Rpb24sIHdlJ2xsIGp1c3Qga2VlcCB1c2luZyB0aGUgc2FtZSBjb25uZWN0aW9uXG4gICAgZm9yKGxldCBuZXdHYW1lQnV0dG9uIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXctZ2FtZVwiKSluZXdHYW1lQnV0dG9uLm9uY2xpY2s9bmV3R2FtZUJ1dHRvbkNsaWNrZWQ7XG4gICAgLypcbiAgICAvLyB3aGVuZXZlciB3ZSBoYXZlIG5ldyBwbGF5ZXIobmFtZSlzXG4gICAgZm9yKGxldCBuZXdHYW1lUGxheWVyc0J1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZXctZ2FtZS1wbGF5ZXJzJykpbmV3R2FtZVBsYXllcnNCdXR0b24ub25jbGljaz1uZXdHYW1lUGxheWVycztcbiAgICAvLyB3aGVuZXZlciB0aGUgZ2FtZSBpcyBjYW5jZWxlZFxuICAgIGZvcihsZXQgY2FuY2VsR2FtZUJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYW5jZWwtZ2FtZScpKWNhbmNlbEdhbWVCdXR0b24ub25jbGljaz1jYW5jZWxHYW1lO1xuICAgICovXG5cbiAgICAvLyBhdHRhY2ggYW4gb25jbGljayBldmVudCBoYW5kbGVyIGZvciBhbGwgYmlkIGJ1dHRvbnNcbiAgICBmb3IobGV0IGJpZEJ1dHRvbiBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmlkXCIpKWJpZEJ1dHRvbi5vbmNsaWNrPWJpZEJ1dHRvbkNsaWNrZWQ7XG4gICAgXG4gICAgLy8gcHJlcGFyZSBmb3Igc2hvd2luZy9oaWRpbmcgdGhlIGNhcmRzIG9mIHRoZSBjdXJyZW50IGJpZGRlclxuICAgIGluaXRpYWxpemVDb2xsYXBzaW5nQnV0dG9ucygpO1xuICAgIC8vIHJlcGxhY2luZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGUtYmlkZGVyLWNhcmRzXCIpLm9uY2xpY2s9dG9nZ2xlQmlkZGVyQ2FyZHM7XG5cbiAgICAvLyBldmVudCBoYW5kbGVyIGZvciBzZWxlY3RpbmcgYSBzdWl0ZVxuICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5iaWQtdHJ1bXBcIikpc3VpdGVCdXR0b24ub25jbGljaz10cnVtcFN1aXRlQnV0dG9uQ2xpY2tlZDtcbiAgICBmb3IobGV0IHN1aXRlQnV0dG9uIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VpdGUuYmlkLXBhcnRuZXJcIikpc3VpdGVCdXR0b24ub25jbGljaz1wYXJ0bmVyU3VpdGVCdXR0b25DbGlja2VkO1xuICAgIFxuICAgIC8vIG1ha2UgdGhlIHN1aXRlIGVsZW1lbnRzIG9mIGEgc3BlY2lmaWMgdHlwZSBzaG93IHRoZSByaWdodCB0ZXh0ISEhIVxuICAgIGZvcihsZXQgc3VpdGU9MDtzdWl0ZTw0O3N1aXRlKyspXG4gICAgICAgIGZvcihsZXQgc3VpdGVCdXR0b24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWl0ZS5cIitDYXJkLlNVSVRFX05BTUVTW3N1aXRlXSkpXG4gICAgICAgICAgICBzdWl0ZUJ1dHRvbi52YWx1ZT1DYXJkLlNVSVRFX0NIQVJBQ1RFUlNbc3VpdGVdO1xuICAgIFxuICAgIC8qIE1ESEAyMkpBTjIwMjA6IGV2ZW50IGhhbmRsZXIgZm9yIGNsaWNraW5nIHRoZSBuZXcgdHJpY2sgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdHJpY2stYnV0dG9uXCIpLm9uY2xpY2s9bmV3VHJpY2tCdXR0b25DbGlja2VkO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRyaWNrLWJ1dHRvblwiKS5zdHlsZS52aXNpYmxlPSdoaWRkZW4nO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpY2std2lubmVyLWluZm9cIikuc3R5bGUudmlzaWJsZT0naGlkZGVuJztcbiAgICAqL1xuXG4gICAgLy8gTURIQDA5SkFOMjAyMDogY2hlY2sgZm9yIGEgdXNlciBuYW1lXG4gICAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgLy8gTURIQDI0SkFOMjAyMDogY2hhbmdlZCAncGxheWVyJyB0byAnYWxzJyEhISBOT1RFIHRoaXMgaXMgYSBiYWNrLWRvb3JcbiAgICBsZXQgaW5pdGlhbFBsYXllck5hbWU9KHVybFBhcmFtcy5oYXMoXCJhbHNcIik/dXJsUGFyYW1zLmdldChcImFsc1wiKS50cmltKCk6bnVsbCk7XG4gICAgLy8gc3RhbmRhbG9uZSBleGVjdXRpb24gaS5lLiBubyBvbiBleGl0IGNhbGxiYWNrISEhXG4gICAgaWYoaW5pdGlhbFBsYXllck5hbWUmJmluaXRpYWxQbGF5ZXJOYW1lLmxlbmd0aD4wKXNldFBsYXllck5hbWUoaW5pdGlhbFBsYXllck5hbWUsbnVsbCk7XG59XG5cbi8vIE1ESEAwOEpBTjIwMjA6IGdyZWF0IGlkZWEgdG8gbWFrZSBldmVyeXRoaW5nIHdvcmsgYnkgYWxsb3dpbmcgdG8gc2V0IHRoZSBwbGF5ZXIgbmFtZVxuZnVuY3Rpb24gX3NldFBsYXllcihwbGF5ZXIpe1xuICAgIHZpc2l0ZWRQYWdlcz1bXTsgLy8gZm9yZ2V0IHZpc2l0ZWQgcGFnZXNcbiAgICBjdXJyZW50UGFnZT1udWxsOyAvLyBhc2NlcnRhaW4gdG8gbm90IGhhdmUgYSBwYWdlIHRvIHN0b3JlXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgY3VycmVudCBwbGF5ZXIgKGlmIGFueSksIGFuZCBpbiBlZmZlY3Qgd2UnbGwgbG9vc2UgdGhlIGdhbWUgYXMgd2VsbFxuICAgIGlmKGN1cnJlbnRQbGF5ZXIpe1xuICAgICAgICBjdXJyZW50UGxheWVyLmV4aXQoJ1NUT1AnKTsgLy8gZXhpdCB0aGUgY3VycmVudCBwbGF5ZXIgZnJvbSB3aGF0ZXZlciBnYW1lIChzKWhlIGhhcyBwbGF5ZWQhISEhXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2hhbmdlIGN1cnJlbnRQbGF5ZXIgYmVjYXVzZSBpdCdzIGdvbm5hIGJlIHJlcGxhY2VkIGFueXdheVxuICAgICAgICAvLyBidXQgd2lsbCBkaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlciBhbnl3YXlcbiAgICAgICAgbGV0IGNsaWVudHNvY2tldD1jdXJyZW50UGxheWVyLl9jbGllbnQ7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgaWYgbmVlZCBiZVxuICAgICAgICAoIWNsaWVudHNvY2tldHx8IWNsaWVudHNvY2tldC5jb25uZWN0ZWR8fGNsaWVudHNvY2tldC5kaXNjb25uZWN0KCkpO1xuICAgICAgICAvLyByZXBsYWNpbmc6IGN1cnJlbnRQbGF5ZXIuZ2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBnYW1lICh3aGljaCB3aWxsIGRpc2Nvbm5lY3QgdGhlIHNvY2tldCBhcyB3ZWxsKSBXSVNIRlVMIFRISU5LSU5HLi4uXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI9bnVsbDtcbiAgICAgICAgc2hvd0N1cnJlbnRQbGF5ZXJOYW1lKCk7XG4gICAgICAgIC8vLy8vLy8vLy8vaWYoZXJyb3JjYWxsYmFjaylcbiAgICAgICAgc2V0UGFnZShcInBhZ2UtcnVsZXNcIik7IC8vIE1ESEAxMEpBTjIwMjA6IHdoZW5ldmVyIHRoZSBjdXJyZW50UGxheWVyIGlzIE5PVCBhdmFpbGFibGUgZ28gdG8gXCJwYWdlLXJ1bGVzXCJcbiAgICB9XG4gICAgLy8gaWYoZXJyb3JjYWxsYmFjaylzZXRQYWdlKFwicGFnZS1ydWxlc1wiKTsgLy8gdGhlIHBhZ2Ugd2UgY2FuIHNob3cgaWYgdGhlcmUncyBubyBwbGF5ZXIhISEhIChUT0RPIG9yIHBhZ2UtYXV0aD8/Pz8/KVxuICAgIGlmKHBsYXllcil7XG4gICAgICAgIGxldCBjbGllbnRzb2NrZXQ9aW8obG9jYXRpb24ucHJvdG9jb2wrJy8vJytsb2NhdGlvbi5ob3N0KTtcbiAgICAgICAgY2xpZW50c29ja2V0Lm9uKCdjb25uZWN0JywoKT0+e1xuICAgICAgICAgICAgaWYoY2xpZW50c29ja2V0LmNvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKGN1cnJlbnRQbGF5ZXI/XCJSZWNvbm5lY3RlZFwiOlwiQ29ubmVjdGVkXCIpK1wiIHRvIHRoZSBnYW1lIHNlcnZlciFcIik7XG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRQbGF5ZXIpeyAvLyBmaXJzdCB0aW1lIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllcj1wbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgIHNob3dDdXJyZW50UGxheWVyTmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAvKiBNREhAMjlKQU4yMDIwOiBkbyBOT1Qgc3RhcnQgcGxheWluZyBhIGdhbWUgdW50aWwgd2UgcmVjZWl2ZSB0aGUgcGxheWVyIG5hbWVzISEhISEhXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHkgd2UgY2FuIG9ubHkgc2V0IHRoZSBnYW1lIG9mIHRoZSBwbGF5ZXIgaWYgX2luZGV4IGlzIG5vbi1uZWdhdGl2ZSwgc28gd2UgcGFzcyBpbiA0XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuaW5kZXg9NDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXllci5nYW1lPW5ldyBQbGF5ZXJHYW1lUHJveHkoY2xpZW50c29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEdhbWU9bmV3IFBsYXllckdhbWVQcm94eShjbGllbnRzb2NrZXQpOyAvLyBsZXQncyBjcmVhdGUgdGhlIGdhbWUgdGhhdCBpcyB0byByZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgc2V0UGFnZShcInBhZ2Utd2FpdC1mb3ItcGxheWVyc1wiKTsgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ESEAwN0ZFQjIwMjAgcmVtb3ZlZDogaWYodHlwZW9mIGVycm9yY2FsbGJhY2s9PT0nZnVuY3Rpb24nKWVycm9yY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5mbyhcIkRlIHZlcmJpbmRpbmcgaXMgaGVyc3RlbGQuXCIsXCJTZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgLy8gTURIQDIzSkFOMjAyMDogcHVzaCB0aGUgcGxheWVyIG5hbWUgdG8gdGhlIHNlcnZlciBhZ2Fpbiwgc28gaXQgY2FuIHJlc2VuZCB3aGF0IG5lZWRzIHNlbmRpbmchISEhXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBsYXllciljbGllbnRzb2NrZXQuZW1pdCgnUExBWUVSJyxjdXJyZW50UGxheWVyLm5hbWUsKCk9PntzZXRJbmZvKFwiSmUgYmVudCBhbHMgc3BlbGVyIGFhbmdlbWVsZCFcIixcIlNlcnZlclwiKTt9KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNldEluZm8oXCJEZSB2ZXJiaW5kaW5nIGlzIHZlcmJyb2tlbi5cIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgICAgICAvLyBNREhAMDdGRUIyMDIwIHJlbW92ZWQ6ICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2sobmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlci5cIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNsaWVudHNvY2tldC5vbignY29ubmVjdF9lcnJvcicsKGVycik9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBlcnJvcjogXCIsZXJyKTtcbiAgICAgICAgICAgIHNldEluZm8oXCJFciBpcyBlZW4gcHJvYmxlZW0gbWV0IGRlIHZlcmJpbmRpbmcgKFwiK2Vyci5tZXNzYWdlK1wiKSFcIixcIlNlcnZlclwiKTtcbiAgICAgICAgICAgIC8vICh0eXBlb2YgZXJyb3JjYWxsYmFjayE9PSdmdW5jdGlvbid8fGVycm9yY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyB0cnkgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIGNhdGNoaW5nIHdoYXRldmVyIGhhcHBlbnMgdGhyb3VnaCBldmVudHNcbiAgICAgICAgY2xpZW50c29ja2V0LmNvbm5lY3QoKTtcbiAgICB9ZWxzZXsgLy8gbm8gcGxheWVyIGFueW1vcmUgdG8gcGxheVxuICAgICAgICBjdXJyZW50R2FtZT1udWxsOyAvLyBnZXQgcmlkIG9mIHRoZSBjdXJyZW50IGdhbWUgKGlmIGFueSlcbiAgICAgICAgKCFvbkV4aXRIYW5kbGVyfHxvbkV4aXRIYW5kbGVyKCkpO1xuICAgIH1cbn1cblxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggdGhlIChuZXcpIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyIHdoZW5ldmVyIHRoZSBwbGF5ZXIgd2FudHMgdG8gcGxheVxuLy8gY2FsbCBzZXRQbGF5ZXJOYW1lIHdpdGggbnVsbCAob3IgZW1wdHkpIHBsYXllciBuYW1lXG4vLyB0byBtYWtlIGl0IGNhbGxhYmxlIGZyb20gYW55d2hlcmUgd2UgYXR0YWNoIHNldFBsYXllck5hbWUgdG8gd2luZG93IChiZWNhdXNlIGNsaWVudC5qcyB3aWxsIGJlIGJyb3dzZXJpZmllZCEhISlcbmZ1bmN0aW9uIHNldFBsYXllck5hbWUocGxheWVyTmFtZSxkb25lUGxheWluZ0NhbGxCYWNrKXtcbiAgICAocHJlcGFyZWRGb3JQbGF5aW5nfHxwcmVwYXJlRm9yUGxheWluZygpKTsgLy8gcHJlcGFyZSBmb3IgcGxheWluZyBvbmNlXG4gICAgb25FeGl0SGFuZGxlcj0odHlwZW9mIGRvbmVQbGF5aW5nQ2FsbGJhY2s9PT0nZnVuY3Rpb24nP2RvbmVQbGF5aW5nQ2FsbGJhY2s6bnVsbCk7IC8vIHJlZ2lzdGVyIHRoZSBkb25lIHBsYXlpbmcgY2FsbGJhY2tcbiAgICAvLyBpZihlcnJvckNhbGxiYWNrKXNldFBhZ2UoXCJwYWdlLXJ1bGVzXCIpOyAvLyBhc2NlcnRhaW4gdG8gbm90IGJlIGluIGEgbm9uLXBsYXllciBwYWdlXG4gICAgLy8gcGxheWVyTmFtZSBuZWVkcyB0byBiZSBhIHN0cmluZyAoaWYgaXQgaXMgZGVmaW5lZClcbiAgICBpZihwbGF5ZXJOYW1lJiZ0eXBlb2YgcGxheWVyTmFtZSE9PVwic3RyaW5nXCIpcmV0dXJuKCFvbkV4aXRIYW5kbGVyfHxvbkV4aXRIYW5kbGVyKG5ldyBFcnJvcihcIkludmFsaWQgcGxheWVyIG5hbWUuXCIpKSk7XG4gICAgLy8gaWYgcGxheWVyTmFtZSBtYXRjaGVzIHRoZSBjdXJyZW50IHBsYXllcidzIG5hbWUsIG5vdGhpbmcgdG8gZG9cbiAgICBpZihwbGF5ZXJOYW1lJiZjdXJyZW50UGxheWVyJiZjdXJyZW50UGxheWVyLm5hbWU9PT1wbGF5ZXJOYW1lKVxuICAgICAgICAoIW9uRXhpdEhhbmRsZXJ8fG9uRXhpdEhhbmRsZXIobnVsbCkpO1xuICAgIGVsc2VcbiAgICAgICAgX3NldFBsYXllcihwbGF5ZXJOYW1lJiZwbGF5ZXJOYW1lLmxlbmd0aD4wP25ldyBPbmxpbmVQbGF5ZXIocGxheWVyTmFtZSk6bnVsbCk7XG59XG5cbndpbmRvdy5vbmxvYWQ9cHJlcGFyZUZvclBsYXlpbmc7XG5cbi8vIGV4cG9ydCB0aGUgdHdvIGZ1bmN0aW9uIHRoYXQgd2UgYWxsb3cgdG8gYmUgY2FsbGVkIGZyb20gdGhlIG91dHNpZGUhISFcbm1vZHVsZS5leHBvcnRzPXNldFBsYXllck5hbWU7Il19
