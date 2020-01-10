// this is main.js from the original (static) web page site herokuapp.com/mdh-rikken-the-game and split up in client.js and server.js
// possible ranks and suites (in Dutch)
const DUTCH_RANK_NAMES=["twee","drie","vier","vijf","zes","zeven","acht","negen","tien","boer","vrouw","heer","aas"];
const DUTCH_SUITE_NAMES=["ruiten","klaveren","harten","schoppen"];

var infoElement=document.getElementById('info');
function setInfo(info){
    if(!info)return;
    console.log("Rikken - het spel >>> info: "+info);
    if(infoElement)infoElement.innerHTML=info;
}
function clearInfo(){if(infoElement)infoElement.innerHTML="";}

function capitalize(str){return(str?(str.length?str[0].toUpperCase()+str.slice(1):""):"?");}

const PAGES=["page-rules","page-settings","page-setup-game","page-bidding","page-trump-choosing","page-partner-choosing","page-play-reporting","page-playing","page-finished"];

///// moved to CSS: const SUITE_COLORS=["red","black"];
// starting from here =======
var currentPage; // the current page it's pretty obvious from the name that it's the current page. ;)

var rikkenTheGame=null; // the game (engine) in charge of managing playing the game. So why not call it rikkenTheGameEngine?

var currentPlayer=null;

const PLAYMODE_SERIOUS=0,PLAYMODE_DEMO=1;

var CURRENT_PLAYMODE=PLAYMODE_DEMO; // are the above constants related? I think so?
// In case they are, use them! This var name change leads to breaking changes but a simple find all and replace would do the trick. ;)

// demo mode we use predefined player names
var DEFAULT_PLAYERS=[["","","","",""],["Marc","Jurgen","Monika","Anna",""]];

var bidderCardsElement=document.getElementById("bidder-cards");
// until here ====
// it seems your're keeping track of the state of your game 
function initializeBidderSuitecardsButton(){
    let button=document.getElementById("bidder-suitecards-button");
    button.addEventListener("click",function(){
        // console.log("Bidder suitecards button clicked!");
        this.classList.toggle("active-bid-button"); // a ha, didn't know this
        document.getElementById("bidder-suitecards-table").style.display=(this.classList.contains("active-bid-button")?"block":"none");
    });
}
/* replacing:
function toggleBidderCards(event){
    if(event.currentTarget.value.length>0){
        event.currentTarget.innerHTML="Verberg kaarten";
        bidderCardsElement.innerHTML=event.currentTarget.value;
        event.currentTarget.value="";
    }else{
        event.currentTarget.innerHTML="Toon kaarten";
        event.currentTarget.value=bidderCardsElement.innerHTML;
        bidderCardsElement.innerHTML="";
    }
}
*/

/**
 * shows the current player names at the start of the game
 */
function showPlayerNames(){
    // in the header row of the tricks played table
    for(let tricksPlayedTable of document.getElementsByClassName("tricks-played-table")){
        let tricksPlayedTableHeader=tricksPlayedTable.querySelector("thead");
        let row=tricksPlayedTableHeader.children[0]; // the row we're interested in filling
        for(player=0;player<rikkenTheGame.numberOfPlayers;player++){
            let cell=row.children[player+1]; // use player to get the 'real' player column!!
            let playerName=rikkenTheGame.getPlayerName(player);
            console.log("Name of player #"+(player+1)+": '"+playerName+"'.");
            cell.innerHTML=playerName;
        }
    }
}
/* function is dependend on a global variable. Either make this a method or pass the dependency as an argument. */

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
    element.classList.remove(SUITE_NAMES[parseInt(element.getAttribute("data-suite-id"))]);
    element.setAttribute("data-suite-id",String(suite));
    element.classList.add(SUITE_NAMES[parseInt(element.getAttribute("data-suite-id"))]);
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
function showTrick(trick,playerIndex){
    console.log("Showing trick ",trick);
    if(trick.numberOfCards==0&&currentPlayer._game.getPartnerRank()>=0){ // once suffices
        for(let partnerSuiteElement of document.getElementsByClassName('partner-suite'))partnerSuiteElement.innerHTML=DUTCH_SUITE_NAMES[currentPlayer._game.getPartnerSuite()];
        for(let partnerRankElement of document.getElementsByClassName('partner-rank'))partnerRankElement.innerHTML=DUTCH_RANK_NAMES[currentPlayer._game.getPartnerRank()];
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
    /* shouldn't address rikkenTheGame here (should ask the current player!!!)
    let partnerIndex=rikkenTheGame.getPartner(playerIndex);
    console.log(">>> Partner of "+rikkenTheGame.getPlayerName(playerIndex)+": "+rikkenTheGame.getPlayerName(partnerIndex)+".");
    */
    // looks like your logic is dependend on data that is stored in the DOM. It would be nicer if it's the other way around. The DOM is just a view/visual representation of the state of the data.
    // so showplayer should render the player based on player object or class
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
/* replacing:
function showTrickObjects(trickObjects,playSuite){
    console.log("Showing trick objects: "+trickObjects+".");
    document.getElementById("play-suite").innerHTML=(playSuite>=0?"Er wordt "+SUITE_NAMES[playSuite]+" gespeeld!":"Slag "+String(rikkenTheGame.numberOfTricksPlayed+1));
    // the trick object contains the cards played by name
    for(let trickLabel of document.getElementsByClassName('trick')){
        let trickObjectIndex=parseInt(trickLabel.getAttribute("data-trick-index"));
        if(trickObjectIndex>=0&&trickObjectIndex<trickObjects.length){
            let trickObject=trickObjects[trickObjectIndex];
            trickLabel.classList.add(SUITE_NAMES[trickObject.card.suite]);
            /// replacing: trickLabel.style.color=SUITE_COLORS[trickObject.card.suite%2]; // in the right color
            // showing the name is not necessary per se
            trickLabel.innerHTML=trickObject.card.getTextRepresentation();
            trickLabel.style.display="initial";
        }else
            trickLabel.style.display="none";
    }
    console.log("Trick shown!");
}
*/
/* obsolete now:
function askForCard(){
    // I guess I should place the cards of the current player on screen
    for(let cardButton of document.getElementsByClassName('card')){
        let cardIndex=parseInt(cardButton.getAttribute("data-card-index"));
        let card=(cardIndex<currentPlayer._cards.length?currentPlayer._cards[cardIndex]:null);
        cardButton.style.display=(card?"initial":"none");
        if(card){
            cardButton.classList.add(SUITE_NAMES[card.suite]);
            // replacing: cardButton.style.color=SUITE_COLORS[card.suite%2]; // alternating suite colors
            cardButton.value=card.getTextRepresentation();
        }
    }
}
*/
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
                cell.classList.add(SUITE_NAMES[cardInSuite.suite]); // replacing: cell.style.color=suiteColor;  
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
                cellbutton.classList.add(SUITE_NAMES[cardInSuite.suite]); // replacing: cellbutton.style.color=suiteColor;
                cellbutton.style.display="inline";
            }else // hide the button
                cellbutton.style.display="none";
        }
    }
    console.log("Current player cards to choose from shown!");
}

function updatePlayerResultsTable(){
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
    let lastTrickPlayedIndex=rikkenTheGame.numberOfTricksPlayed-1;
    if(lastTrickPlayedIndex>=0){
        let trick=rikkenTheGame.getTrickAtIndex(lastTrickPlayedIndex);
        for(let tricksPlayedTable of document.getElementsByClassName("tricks-played-table")){
            let row=tricksPlayedTable.querySelector("tbody").children[lastTrickPlayedIndex]; // the row we're interested in filling
            row.children[0].innerHTML=String(rikkenTheGame.numberOfTricksPlayed);
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
            row.children[10].innerHTML=rikkenTheGame.getPlayerAtIndex(trick.winner).getNumberOfTricksWon(); // show who won the trick!!
        }
    }
}

function showDefaultPlayerNames(){
    console.log("Showing default player names!");
    let playerNames=DEFAULT_PLAYERS[document.getElementById("demo-playmode-checkbox").checked?1:0];
    for(playerNameInputElement of document.getElementsByClassName("player-name-input")){
        if(playerNameInputElement.value.length==0)
            playerNameInputElement.value=playerNames[parseInt(playerNameInputElement.getAttribute("data-player-id"))];
    }
}

// you got a lot of dom manipulation functions at the same place. Nice! Why not go a step further and give them all similar names like: showTricks, showDefaultPlayerNames or renderTricks or renderDefaultPlayerNames, renderTricksPlayedTables, renderPlayerSuiteCards
// how they are named the same is not really the point. The point is that similar things should be named the same. Like that, you're communicating your logic clearer.
// Now the reader is left in doubt if and how these functions are related. They also seem to all work on similar data so why not make them methods?

/**
 * prepares the GUI for playing the game
 */
function getGameInfo(){
    console.log("Determining game info.");
    let gameInfo="";
    if(currentPlayer){
        // get the info we need through the PlayerGame instance registered with the current player
        let highestBidders=currentPlayer._game.getHighestBidders(); // those bidding
        console.log("\tHighest bidders: "+highestBidders.join(", ")+".");
        let highestBid=currentPlayer._game.getHighestBid();
        console.log("\tHighest bid: "+BID_NAMES[highestBid]+".");
        let trumpSuite=currentPlayer._game.getTrumpSuite();
        console.log("\tTrump suite: "+trumpSuite+".");
        let partnerSuite=currentPlayer._game.getPartnerSuite();
        let partnerRank=currentPlayer._game.getPartnerRank();
        // playing with trump is easiest
        if(trumpSuite>=0){ // only a single highest bidder!!!
           let highestBidder=highestBidders[0];
            if(highestBid==BID_TROELA){
                let troelaPlayer=rikkenTheGame.getPlayerAtIndex(highestBidder);
                gameInfo=troelaPlayer.name+" heeft troela, en ";
                gameInfo+=rikkenTheGame.getPlayerAtIndex(rikkenTheGame.fourthAcePlayer)+" is mee.";
                /* you cannot show this unless the ace has been thrown!!!
                gameInfo+=" "+capitalize(DUTCH_SUITE_NAMES[trumpSuite])+" is troef.";
                */
                /*
                +", want ";
                // TODO why does troelaPlayer does NOT have a proper partner: troelaPlayer.partner
                gameInfo+=rikkenTheGame.getPlayerAtIndex(rikkenTheGame.fourthAcePlayer)+" heeft deze vierde aas, en is dus mee.";
                */
            }else{
                if(highestBid==BID_RIK||highestBid==BID_RIK_BETER){
                    gameInfo=rikkenTheGame.getPlayerAtIndex(highestBidder).name+" rikt in de "+DUTCH_SUITE_NAMES[trumpSuite];
                    gameInfo+=", en vraagt de "+DUTCH_SUITE_NAMES[partnerSuite]+" "+DUTCH_RANK_NAMES[partnerRank]+" mee.";    
                }else // without a partner
                    gameInfo=rikkenTheGame.getPlayerAtIndex(highestBidder).name+" speelt "+BID_NAMES[trumpSuite]+" met "+DUTCH_SUITE_NAMES[trumpSuite]+" als troef.";
            }
        }else{ // there's no trump, everyone is playing for him/herself
            let highestBidderPlayerNames=[];
            highestBidders.forEach((highestBidder)=>{highestBidderPlayerNames.push(rikkenTheGame.getPlayerAtIndex(highestBidder).name);});
            if(highestBidderPlayerNames.length>0){
                if(highestBid!=BID_RIK&&highestBid!=BID_RIK_BETER)
                    gameInfo=highestBidderPlayerNames.join(", ")+(highestBidderPlayerNames.length>1?" spelen ":" speelt ")+BID_NAMES[highestBid]+".";
                else // a rik (by a single person always)
                    gameInfo=highestBidderPlayerNames[0]+" rikt in de "+DUTCH_SUITE_NAMES[trumpSuite]+".";
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
            return "Zes samen met "+(partnerName?partnerName:"je partner")+" om de tegenspelers de "+(highestBid==BID_TROELA?"troela":"rik")+" te laten verliezen";
        case 8:
            return "Acht samen met "+(partnerName?partnerName:"je partner")+" om de "+(highestBid==BID_TROELA?"troela":"rik")+" te winnen";
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
        super(name);
    }
    // make a bid is called with 
    makeABid(playerBidsObjects,possibleBids){
        // debugger
        currentPlayer=this; // remember the current player
        setInfo(this.name+" moet nu bieden!");
        if(currentPage!="page-bidding")setPage("page-bidding"); // JIT to the right page
        console.log("Possible bids player '"+this.name+"' could make: ",possibleBids);

        //setInfo("Maak een keuze uit een van de mogelijke biedingen.");
        document.getElementById("bidder").innerHTML=this.name;
        /* replacing:
        document.getElementById("toggle-bidder-cards").innerHTML="Toon kaarten";
        bidderCardsElement.innerHTML="";
        document.getElementById("toggle-bidder-cards").value=this.getTextRepresentation("<br>");
        */
        // either show or hide the bidder cards immediately
        document.getElementById("bidder-suitecards-table").style.display=(playmode==PLAYMODE_DEMO?"block":"none");
        if(playmode==PLAYMODE_DEMO^document.getElementById("bidder-suitecards-button").classList.contains("active-bid-button"))
            document.getElementById("bidder-suitecards-button").classList.toggle("active-bid-button");
        // NOTE because every player gets a turn to bid, this._suiteCards will be available when we ask for trump/partner!!!
        updateBidderSuiteCards(this._suiteCards=this._getSuiteCards());

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
        console.log("Possible trump suites:",suites);
        setPage("page-trump-choosing");
        updateChooseTrumpSuiteCards(this._suiteCards);
        // iterate over the trump suite buttons
        for(let suiteButton of document.getElementById("trump-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
    }
    choosePartnerSuite(suites,partnerRank){
        console.log("Possible partner suites:",suites);
        setPage("page-partner-choosing");
        updateChoosePartnerSuiteCards(this._suiteCards);
        // because the suites in the button array are 0, 1, 2, 3 and suites will contain
        for(let suiteButton of document.getElementById("partner-suite-buttons").getElementsByClassName("suite"))
            suiteButton.style.display=(suites.indexOf(parseInt(suiteButton.getAttribute('data-suite')))<0?"none":"inline");
        document.getElementById('partner-rank').innerHTML=DUTCH_RANK_NAMES[partnerRankName];
    }
    // almost the same as the replaced version except we now want to receive the trick itself
    playACard(trick){
        currentPlayer=this;
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
        showTrick(this._trick=trick,this._index);
    }
    /* replacing:
    playACard(trickObjects,playSuite,canAskForPartnerCardBlind){
        // if this is a new trick update the tricks played table with the previous trick
        if(trickObjects.length==0)updateTricksPlayedTable();
        currentPlayer=this;
        document.getElementById("can-ask-for-partner-card-blind").style.display=(canAskForPartnerCardBlind?"block":"none");
        // always start unchecked...
        document.getElementById("ask-for-partner-card-blind").checked=false; // when clicked should generate 
        if(rikkenTheGame.numberOfTricksPlayed==0)document.getElementById("game-info").innerHTML=getGameInfo();
        document.getElementById("card-player").innerHTML=this.name;
        document.getElementById("trick-playsuite").innerHTML=(playSuite>=0?DUTCH_SUITE_NAMES[playSuite].toLowerCase():"kaart");
        let numberOfTricksWon=this.getNumberOfTricksWon();
        // add the tricks won by the partner
        if(this.partner>=0)numberOfTricksWon+=rikkenTheGame.getPlayerAtIndex(this.partner).getNumberOfTricksWon();
        document.getElementById("tricks-won-so-far").innerHTML=String(numberOfTricksWon);
        this._card=null; // get rid of any currently card
        console.log("ONLINE >>> Player '"+this.name+"' should play a card!");
        setInfo(this.name+", welke "+(playSuite>=0?SUITE_NAMES[playSuite]:"kaart")+" wil je "+(trickObjects.length>0?"bij":"")+"spelen?");
        updatePlayerSuiteCards(this._suiteCards=this._getSuiteCards()); // remember the suite cards!!!!
        showTrickObjects(trickObjects,playSuite);
    }
    */
    /*
    // setter to set the trump and partner suite once the corresponding button is clicked
    set trumpSuite(trumpSuite){
        if(trumpSuite<0)return;
        this._trumpSuite=trumpSuite;
        this.trumpSuiteChosen();
    }
    set partnerSuite(partnerSuite){
        if(partnerSuite<0)return;
        if(partnerSuite==this._trumpSuite){
            alert("Je kunt de troef"+DUTCH_RANK_NAMES[this._game.getPartnerRank()]+" niet meevragen!");
            return;
        }
        this._trumpSuite=-1; // TODO should we remove 
        this._partnerSuite=partnerSuite;
        this.partnerSuiteChosen();
    }
    */
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
                    /* replacing:
                        // so, could be asking
                        // not asking when playing trump!!
                        if(suite!=this._trick.trumpSuite){
                            if(suite!=this._trick.partnerSuite){ // it's not the partner suite itself
                                if(this._getNumberOfCardsOfSuite(this._trick.partnerSuite)==0){ // has to ask the partner card blind!
                                    if(confirm("Wilt U de "+DUTCH_RANK_NAMES[this._trick.partnerRank]+" blind opvragen?"))
                                        this._trick.askingForPartnerCard=-1;
                                }
                            }else // definitely asking
                                this._trick.askingForPartnerCard=1;
                        }
                        */
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
    /* NO
    // go directly to the game (instead of through the player)
    rikkenTheGame.trumpSuite=trumpSuite;
    */
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
/* why is this global? it could be part of newGame or rikkeTheGame. Globals are baaad. Only use them when you really don't have other options */
var players=null;

/* this is actually your main */
function newGame(){

    console.log("Rikken - het spel >>> Nieuw spel beginnen!");
    if(!players&&rikkenTheGame)players=rikkenTheGame._players; // take players from the last game (to continue with)
    /* comments like this are a sign of sloppy naming. rikkenTheGame could have a getPlayersFromPreviousGame method */
    if(!players){rikkenTheGame=null;newPlayers();} // game is no use (to get players)

    if(!players){alert("Aanmaken nieuwe spelers mislukt!");return;}

    try{
        if(!rikkenTheGame){
            rikkenTheGame=new RikkenTheGame(players,onlineRikkenTheGameEventListener);
            console.log("Rikken - het spel >>> Spel aangemaakt!");
        }
        rikkenTheGame.start();
        console.log("Rikken - het spel >>> Spel gestart!");
    }catch(error){
        setInfo("Starten van het spel mislukt: "+error);
    }

}

class OnlineRikkenTheGameEventListener extends RikkenTheGameEventListener{
    stateChanged(fromstate,tostate){
        console.log("Rikken - het spel >>> Toestand verandert van "+fromstate+" naar "+tostate+".");
        switch(tostate){
            case IDLE:
                setInfo("Een spel is aangemaakt.");
                break;
            case DEALING:
                setInfo("De kaarten worden geschud en gedeeld.");
                break;
            case BIDDING:
                // when moving from the DEALING state to the BIDDING state clear the bid table
                // ALTERNATIVELY this could be done when the game ends
                // BUT this is a bit safer!!!
                if(fromstate===DEALING)clearBidTable();
                ////// let's wait until a bid is requested!!!! setPage("page-bidding");
                break;
            case PLAYING:
                clearTricksPlayedTables();
                // initiate-playing will report on the game that is to be played!!!
                setPage("page-playing");
                break;
            case FINISHED:
                updateTricksPlayedTables(); // so we get to see the last trick as well!!!
                updatePlayerResultsTable(); // show the player results so far
                setPage("page-finished");
                break;
        }
        console.log("ONLINE >>> The state of rikkenTheGame changed to '"+tostate+"'.");
    }
    errorOccurred(error){
        alert("Fout: "+error);
    }
}
var onlineRikkenTheGameEventListener = new OnlineRikkenTheGameEventListener();

function setPage(newPage){
    currentPage=newPage;
    console.log("Current page: '"+currentPage+"' - Requested page: '"+newPage+"'.");
    // NOTE not changing currentPage to page until we have done what we needed to do
    PAGES.forEach(function(_page){
        let showPage=(_page===currentPage);
        console.log((showPage?"Showing ":"Hiding ")+" '"+_page+"'.");
        let pageElement=document.getElementById(_page);
        if(pageElement){
            pageElement.style.visibility=(showPage?"visible":"hidden");
            if(showPage){
                switch(PAGES.indexOf(_page)){
                    case 0:setInfo("Stel de spelregels in.");break;
                    case 1:setInfo("Kies de speelwijze.");break;
                    case 2:
                        {
                            showDefaultPlayerNames();
                            setInfo("Vul de namen van de spelers in. Een spelernaam is voldoende.");
                        }
                        break;
                    case 3:
                        {
                            setInfo("Wacht om de beurt op een verzoek tot het doen van een bod.");
                        }
                        break;
                    case 4:setInfo("Wacht op het verzoek tot het opgeven van de troefkleur en/of de aas/heer.");break;
                    case 7:
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
    let pageIndex=PAGES.indexOf(currentPage);
    setPage(PAGES[(pageIndex+1)%PAGES.length]);
}
function cancelPage(event){
    // go one page back
    let pageIndex=PAGES.indexOf(currentPage);
    setPage(PAGES[(pageIndex+PAGES.length-1)%PAGES.length]);
}
/**
 * to be called when the new-players button is clicked, to start a new game with a new set of players
 */
function newPlayers(){
    console.log("Rikken - het spel >>> Nieuwe spelers aanmaken.");
    players=[]; // he goes a global again
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

function newGamePlayers(){
    rikkenTheGame=null; // get rid of the game, so newGame() will call newPLayers()
    newGame();
}
function cancelGame(){
    if(!rikkenTheGame){
        alert("Geen spel om af te breken! Laad deze web pagina opnieuw!");
        return;
    }
    if(confirm("Wilt U echt het huidige spel afbreken?")){
        rikkenTheGame.cancel();
    }
}

window.onload=function(){
    // comment not really needed, it's already clear from the naming, which is good :)
    // maybe you could have renamed it to gameInstructions, because info is a bit too broad
    document.getElementById('info').onclick=clearInfo;
    // attach nextPage and cancelPage to any of the buttons in page-button-groups
    ///let pageButtonGroups=document.getElementsByClassName("page-button-group");
    /*
    for(let pageButtonGroup of pageButtonGroups){
        let pageButtons=pageButtonGroup.querySelectorAll("input[type=button]");
        for(let pageButton of pageButtons){
            if(pageButton.classList.contains("next"))pageButton.onclick=nextPage;else
            if(pageButton.classList.contains("cancel"))pageButton.onclick=cancelPage;else
            if(pageButton.classList.contains("new-players"))pageButton.onclick=newPlayers;
        };
    };
    // it's better to wrap all these event bindings into a function called something like 
    // setUpGameControlsBindings
    */
    // event handlers for next, cancel, and newPlayers buttons
    for(let nextButton of document.getElementsByClassName('next'))nextButton.onclick=nextPage;
    for(let cancelButton of document.getElementsByClassName('cancel'))cancelButton.onclick=cancelPage; 
    // whenever we have new game (with the same players) In that case, is restartGame not a better name for the eventhandler?
    for(let newGameButton of document.getElementsByClassName("new-game"))newGameButton.onclick=newGame;
    // whenever we have new player(name)s
    for(let newGamePlayersButton of document.getElementsByClassName('new-game-players'))newGamePlayersButton.onclick=newGamePlayers;
    // whenever the game is canceled
    for(let cancelGameButton of document.getElementsByClassName('cancel-game'))cancelGameButton.onclick=cancelGame;
    // onclear what the difference is between cancelling a page and canceling a game
    // this comment was not conveining more information than the code itself neither does it has to be. The code is clear enough
    for(let bidButton of document.getElementsByClassName("bid"))bidButton.onclick=bidButtonClicked;
    
    // prepare for showing/hiding the cards of the current bidder
    initializeBidderSuitecardsButton(); //why are you deviating from the pattern? Is there a good reason you are doing this event binding differently from everything above? If not, you are adding unnecessary complexity to your code. 
    // Also, I had to look inside the function to see that this initialization is just also doing event binding. More speficic naming would have helped
    // replacing: document.getElementById("toggle-bidder-cards").onclick=toggleBidderCards;

    // event handler for selecting a suite
    for(let suiteButton of document.querySelectorAll(".suite.bid-trump"))suiteButton.onclick=trumpSuiteButtonClicked;
    for(let suiteButton of document.querySelectorAll(".suite.bid-partner"))suiteButton.onclick=partnerSuiteButtonClicked;
    // clicking card 'buttons' (now cells in table), we can get rid of the button itself!!!
    for(let playablecardButton of document.querySelectorAll(".playable.card-text"))playablecardButton.onclick=playablecardButtonClicked;
    
    // this is doing something really different than the code above. Why is it at the same place?
    // you could wrap it inside a function called something like renderSuiteConten 
    // make the suite elements of a specific type show the right text!!!!
    // try to prevent 'magic' numbers. Alright, a suite is 4 so it's not that mind boggling but neither is much of an effort
    // to do: const CARDS_IN_SUITE = 4
    for(let suite=0;suite<4;suite++)
        for(let suiteButton of document.querySelectorAll(".suite."+SUITE_NAMES[suite]))
            suiteButton.value=SUITE_CHARACTERS[suite];
    /* user can uncheck the check box and no need to respond to that immediately
    document.getElementById("ask-partner-card-checkbox").onclick=askingPartnerCard;
    */
    this.setPage(PAGES[0]);
};