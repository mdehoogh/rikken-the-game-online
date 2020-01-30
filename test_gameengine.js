require('dotenv').config();

// gameengine requires plugging in a sockets.io server and a GamesListener
const GamesListener=require('./gameslistener.js');

const User=require('./models/user.js');
const Game=require('./models/game.js');


class RikkenGamesListener extends GamesListener{
    log(tolog){
        console.log("GAMES LISTENER >>> "+tolog);
    }
    constructor(){
        super();
        this._games=[]; // keep track of a list of active games
        this._gamesEvents=null;
        this._inspectingGameEvents=null; // the game of which events are being inspected
    }
    showGameEventPrompt(){
        this.log("What player to show next? (or type 0 to move to the next game)");
        this._gamePlayerNames.forEach((playerName,index)=>{
            if(this._gameEvents[playerName].length>0)
                console.log(String(index+1)+': '+playerName);
            else
                console.log("No game events for player "+playerName+".");
        });
    }
    inspectNextGameEvents(){
        this._inspectingGameEvents++;
        if(this._inspectingGameEvents>=this._gameNames.length)return false;
        let gameName=this._gameNames[this._inspectingGameEvents];
        this.log("\nEvent inspection of game "+gameName+".");
        this._gameEvents=this._gamesEvents[gameName]; // get the game names
        // display the user names to choose from
        this._gamePlayerNames=Object.keys(this._gameEvents);
        this.showGameEventPrompt();
        return true;
    }
    inspectGamePlayerEvents(gamePlayerIndex){
        let gamePlayerEvents=this._gameEvents[this._gamePlayerNames[gamePlayerIndex]];
        this.log("Number of player events: "+gamePlayerEvents.length+".");
        // write all the game player events to the log
        gamePlayerEvents.forEach((gamePlayerEvent)=>this.log(gamePlayerEvent.join('\t')));
        this.showGameEventPrompt();
    }
    inspectGameEvents(){
        this._inspectingGameEvents=-1; // the game of which events are being inspected
        this._gamesEvents={};
        this._games.forEach((game)=>{this._gamesEvents[game.name]=game.getEvents();});
        this._gameNames=Object.keys(this._gamesEvents);
        if(this._gameNames.length===0)return false;
        /* now write the events to the console so we can inspect them
        for(let gameName in gamesEvents){
            console.log("Events of game "+gameName+".");
            let gameEvents=gamesEvents[gameName];
            // assuming a game event is an array
            // NO it is not, it's an object with the player names as keys
            gameEvents.forEach((gameEvent)=>console.log(gameEvent.join('\t')));
        }
        */
        return this.inspectNextGameEvents();
    }
    doneInspectingGameEvents(){
        this._games.forEach((game)=>{
            if(game.doneInspectingEvents())this.log("Done inspecting game events!");
        });
    }

    // responding to game events
    gameStarted(game){
        if(!game)return;
        super.gameStarted(game);
        this._games.push(game); // remember the game
    }
    gameFinished(game){
        super.gameFinished(game);
        this.log("Game '"+game.name+"' finished!");
        // TODO store the game results
        // MDH@24JAN2020: NOT all users need to be registered users per se
        let playerNames=game.getPlayerNames();
        if(!playerNames)return this.log("No players in the game!");
        if(playerNames.length<4)return this.log("Not enough players in the game!");
        this.log("Determining which of the game players is registered.");
        User.find({'username':{$in:playerNames}})
            .then((users)=>{
                this.log("Registered game players: "+users.map((user)=>user.username).join(", ")+".");
                // this.log("Number of registered users in the finished game: "+(users?users.length:0)+".");
                // MDH@30JAN2020: how about allowing unregistered players in a game as well...
                // MDH@24JAN2020: calling deltaPoints
                if(true){ // replacing: users.length>=playerNames.length){
                    let playerScores=game.deltaPoints; // returns the game points JIT computed
                    // let's be careful here, we need the name to make the scores
                    let gameScores=playerNames.map((playerName,playerIndex)=>{
                        let gameScore={'player_name':playerName,'score':playerScores[playerIndex],'tricks_won':game.getNumberOfTricksWonByPlayer(playerIndex)};
                        // we have to find the id of the registered user with this name
                        let userIndex=users.length;while(--userIndex>=0&&users[userIndex].username!==playerName);
                        // MDH@30JAN2020: storing the name of the player now as well
                        if(userIndex>=0)gameScore.user_id=users[userIndex]._id; // store the registered user id as well
                        return gameScore;
                    });
                    this.log("\tRegistering game results!");
                    // replacing: users.map((user,index)=>{return {"user_id":user._id,"score":playerScores[index]};});
                    // MDH@30JAN2020: adding the highest bid and highest bid players as well!!!!
                    Game.create({name:game.name,bid:game._highestBid,bid_players:game._highestBidPlayers,scores:gameScores})
                        .then((game)=>{
                            // append the game id to the array of game ids stored with each player
                            gameScores.forEach((gameScore)=>{
                                // will the callback work???
                                if(gameScore.hasOwnProperty("user_id"))
                                    User.findOneAndUpdate({_id:gameScore.user_id},{$push:{games:game.id}},{new:true}
                                        ,(error,user)=>{
                                            console.log("GAMES LISTENER >>> ",(error?"Error in":"Result of")+" registering the game played by "+gameScore.player_name+".",(error||user));
                                        });
                            });
                        })
                        .catch((err)=>{this.log("ERROR: Failed to register the results of game "+game.name+".",err);});            
                }else
                    this.log("ERROR: Unable to store the result of playing "+game.name+": not all players are registered users.");
            })
            .catch((err)=>{
                this.log("ERROR: Failed to retrieve the users that played "+game.name+".",err);
            });
    }
    gameCanceled(game){
        super.gameCanceled(game);
        this.log("Game "+game.name+" canceled!");
    }
}

var gameengine=null;

const mongoose=require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => {

    console.log('Connected to MongoDB!');

    // running with the acknowledgmentRequired flag set to true would result in multiple users being asked to send their bid
    // which must mean that an event isn't actually acknowledged!!!!!
    Game.count({},(err,count)=>{
        // fire up the game engine!!!!
        gameengine=require('./gameengine.js')(socket_io_server,new RikkenGamesListener(),(err?0:count),false);
    });

  }).catch(err => {
    console.error('Error connecting to MongoDB.',err);
  });

const path=require('path');
// server-side socket.io
// source: https://github.com/socketio/socket.io
const express=require('express');
const i18n=require('i18n');
const hbs=require('hbs');

const app=express();
app.locals.title="Rikken"; // the title of this nice card game

// setup multiple language support
i18n.configure({
    locales:['nl', 'en'],
    defaultLocale:'en',
    queryParameter: 'lang', // replacing: cookie:'locale' (which we do not have!!!!)
    directory: path.join(__dirname,'locales'),
});
i18n.setLocale('en'); // try it this way!!!!

app.use(require('express').static('.')); // so we can access test.html in the root (of course public is preferred)

const server=require('http').createServer(app);
// MDH@07JAN2020: if you use a different path here, it can't find /socket.io/socket.io.js at the client side
const socket_io_server=require('socket.io')(server/*,{
    path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  }*/);

// MDH@11JAN2020: pretty essential to do the init BEFORE registering the helper AND then it works
app.use(i18n.init); // use internationalization
app.use(function(req, res, next) {
    hbs.registerHelper('__',function(){
        if(!this.locale){
            var args=Array.prototype.slice.call(arguments);
            var options=args.pop();
            return i18n.__.apply(options.data.root,args);
          }
          return i18n.__.apply(this,arguments);
    });
    next();
  });
app.set('views', '.');
app.set('view engine','hbs'); // for testing
/*
// register hbs helpers in res.locals' context which provides this.locale
hbs.registerHelper('__',()=>{
    debugger
    console.log("Arguments: ",arguments);
    let result=i18n.__.apply(this,arguments);
    console.log("\tResult",result);
    return result;
});
hbs.registerHelper('__n',()=>{
    debugger
    console.log("Arguments: ",arguments);
    let result=i18n.__n.apply(this,arguments);
    console.log("\tResult",result);
    return result;
});
hbs.registerHelper('__l',()=>{
    debugger
    console.log("Arguments: ",arguments);
    let result=i18n.__l.apply(this,arguments);
    console.log("\tResult",result);
    return result;
});
*/

// MDH@30JAN2020: let's run the test from test, or even better from ironhackers
//                and at the root the ordinary login!!!
app.get('/',(req,res)=>{res.render('home')});

app.get('/ironhackers',(req,res)=>{res.render('ironhackers');}); // the test page with 4 links for each of the players

// MDH@24JAN2020: replacing gameplaying by spelen and player by als
app.get('/spelen',(req,res)=>{res.render('gameplaying',(req.query.als?null:{username:"Marc"}));}); // each player 

// the following is fine with development
server.listen(3000,()=>{
    console.log("Express server listening on port 3000.");
});

console.log("Environment: "+process.env.NODE_ENV+".");

if(!process.env.NODE_ENV||process.env.NODE_ENV==="production")return;

var inspectingEventLog=false;
///*
console.log("Use the spacebar to start and end viewing game events.");

// MDH@24JAN2020: I want to be able to view the event log real-time
//                so I need to be able to interrupt the logging

var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding('utf8');

// on any data into stdin
stdin.on( 'data', function( key ){
    console.log(key); // replacing: process.stdout.write( key );
    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
        process.exit();
    }
    // MDH@24JAN2020: either toggle inspecting events with the space bar or view any of the four players
    if(inspectingEventLog){
        if(key==='\x30'){
            if(!rikkenGamesListener.inspectNextGameEvents()){
                rikkenGamesListener.doneInspectingGameEvents();
                inspectingEventLog=false;
                console.log("Game event inspection finished!");
            }
            return;
        }
        if(key==='\x31'){
            rikkenGamesListener.inspectGamePlayerEvents(0);
            return;
        }
        if(key==='\x32'){
            rikkenGamesListener.inspectGamePlayerEvents(1);
            return;
        }
        if(key==='\x33'){
            rikkenGamesListener.inspectGamePlayerEvents(2);
            return;
        }
        if(key==='\x34'){
            rikkenGamesListener.inspectGamePlayerEvents(3);
            return;
        }
        rikkenGamesListener.doneInspectingGameEvents();
        inspectingEventLog=false;
        console.log("Game event inspection finished!");
    }else // not yet inspecting the game events
    if(rikkenGamesListener.inspectGameEvents())
        inspectingEventLog=true;
    else
        console.log("ERROR: Failed to start inspecting the game events.");
});
//*/