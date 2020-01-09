/**
 * 
 */
const Card=require('./Card.js');
const {CardHolder,HoldableCard}=require("./CardHolder.js");

class DeckOfCards extends CardHolder{

    log(tolog){
        //console.log(tolog);
    }
    _shuffle(){
        // how about taking a random one out and pushing it????
        // BUG FIX: oops, I think I should not push the splice itself BUT the first element of the splice!!!!
        let numberOfSwaps=this._cards.length*3;
        while(--numberOfSwaps>=0)this._cards.push(this._cards.splice(Math.floor(Math.random()*this._cards.length),1)[0]);
        // this.log("Deck of cards: \n"+this._cards.join("\n"));
    }

    shuffle(count,from,to){
        this.log("Shuffling the deck of "+this.numberOfCards+" cards.");
        while(--count>=0){
            let topop=to+Math.floor(to-from);
            this.log("Number of card to pop in shuffling: "+topop+".");
            while(--topop>=0)this._cards.unshift(this._cards.pop());
        }
        this.log("Deck of cards shuffled!");
        this.log("Cards held by '"+this.toString()+"': "+this.getTextRepresentation()+".");
    }

    constructor(){
        super();
        // tell each card that I'm holding it
        for(let suiteIndex=0;suiteIndex<Card.SUITE_NAMES.length;suiteIndex++)
            for(let rankIndex=0;rankIndex<Card.RANK_NAMES.length;rankIndex++)
                new HoldableCard(suiteIndex,rankIndex,this);
        // let's do an initial shuffle
        this._shuffle(); // replacing: this.shuffle(4,13,39);
    }

    toString(){return "Deck of cards";}

}

module.exports=DeckOfCards;