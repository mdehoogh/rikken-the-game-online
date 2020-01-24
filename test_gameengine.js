// gameengine requires plugging in a sockets.io server and a GamesListener
const GamesListener=require('./gameslistener.js');

const User=require('./models/user.js');
const Game=require('./models/game.js');

class RikkenGamesListener extends GamesListener{
    constructor(){
        super();
        this._games=[]; // keep track of a list of active games
        this._inspectingGameEvents=null; // the game of which events are being inspected
    }
    showGameEventPrompt(){
        console.log("What player to show next? (or type 0 to move to the next game)");
        this._gamePlayerNames.forEach((playerName,index)=>console.log(String(index+1)+': '+playerName));
    }
    inspectNextGameEvents(){
        this._inspectingGameEvents++;
        if(this._inspectingGameEvents>=this._gameNames.length)return false;
        let gameName=this._gameNames[this._inspectingGameEvents];
        console.log("\nEvent inspection of game "+gameName+".");
        this._gameEvents=this._gamesEvents[gameName]; // get the game names
        // display the user names to choose from
        this._gamePlayerNames=Object.keys(this._gameEvents);
        this.showGameEventPrompt();
    } 
    inspectGamePlayerEvents(gamePlayerIndex){
        let gamePlayerEvents=this._gameEvents[this._gamePlayerNames[gamePlayerIndex]];
        // write all the game player events to the log
        gamePlayerEvents.forEach((gamePlayerEvent)=>console.log(gamePlayerEvent.join('\t')));
        this.showGameEventPrompt();
    }
    inspectGameEvents(){
        this._inspectingGameEvents=-1; // the game of which events are being inspected
        let gamesEvents={};
        this._games.forEach((game)=>{gamesEvents[game.name]=game.getEvents();});
        this._gameNames=Object.keys(gamesEvents);
        if(this._gameNames.length===0)return false;
        // now write the events to the console so we can inspect them
        for(let gameName in gamesEvents){
            console.log("Events of game "+gameName+".");
            let gameEvents=gamesEvents[gameName];
            // assuming a game event is an array
            gameEvents.forEach((gameEvent)=>console.log(gameEvent.join('\t')));
        }
        return this.inspectNextGameEvents();
    }
    doneInspectingGameEvents(){
        this._games.forEach((game)=>{
            if(game.doneInspectingGameEvents())console.log("Done inspecting game events!");
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
        // TODO store the game results
        // MDH@24JAN2020: NOT all users need to be registered users per se
        let playerNames=game.getPlayerNames();
        User.find({'username':{$in:playerNames}})
            .then((users)=>{
                // MDH@24JAN2020: calling deltaPoints
                 if(users.length>=playerNames.length){
                    let playerScores=game.deltaPoints; // returns the game points JIT computed
                    // let's be careful here, we need the name to make the scores
                    let gameScores=playerNames.map((playerName)=>{
                        // we have to find the id of the user with this name
                        let userIndex=users.length;
                        while(--userIndex>=0&&users[userIndex].username!==playerName);
                        return(userIndex>=0?{'user_id':users[userIndex]._id,'score':playerScores[userIndex]}:null);
                    });
                    // replacing: users.map((user,index)=>{return {"user_id":user._id,"score":playerScores[index]};});
                    Game.create({name:game.name,scores:gameScores})
                        .then((game)=>{
                            // append the game id to the array of game ids stored with each player
                            playerNames.forEach((playerName)=>{
                                // will the callback work???
                                User.findOneAndUpdate({'username':playerName},{$push:{games:game.id}}
                                                        ,(error,success)=>{
                                                            console.log((error?"Error in ":"Result of")+"registering the game played by user "+playerName+".",(error||success));
                                                            });
                            });
                        })
                        .catch((err)=>{console.log("ERROR: Failed to register the results of game "+game.name+".",err);});            
                }else
                    console.log("ERROR: Unable to store the result of playing "+game.name+": not all players are registered users.");
            })
            .catch((err)=>{
                console.log("ERROR: Failed to retrieve the users that played "+game.name+".",err);
            });
    }
    gameCanceled(game){
        super.gameCanceled(game);
        console.log("Game "+game.name+" canceled!");
    }
}

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

const rikkenGamesListener=new RikkenGamesListener();

// running with the acknowledgmentRequired flag set to true would result in multiple users being asked to send their bid
// which must mean that an event isn't actually acknowledged!!!!!
const gameengine=require('./gameengine.js')(socket_io_server,rikkenGamesListener,false);

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
app.get('/', (req, res)=>{res.render('test');}); // the test page with 4 links for each of the players

// MDH@24JAN2020: replacing gameplaying by spelen and player by als
app.get('/spelen',(req,res)=>{res.render('gameplaying',(req.query.als?null:{username:"Marc"}));}); // each player 

server.listen(3000,()=>{
    console.log("Express server listening on port 3000.");
});

var inspectingEventLog=false;
/*
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
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  process.stdout.write( key );
  // MDH@24JAN2020: either toggle inspecting events with the space bar or view any of the four players
  if(key==='\u0020'){
      inspectingEventLog=!inspectingEventLog;
      // in its simplest form
      if(inspectingEventLog)rikkenGamesListener.inspectGameEvents();else rikkenGamesListener.doneInspectingGameEvents();
      return;
  }
  if(key==='\u0030'){
      if(inspectingEventLog){
          if(!rikkenGamesListener.inspectNextGameEvents()){
            rikkenGamesListener.doneInspectingGameEvents();
            inspectingEventLog=false;
          }
          return;
      }
  }
  if(key==='\u0031'){
    if(inspectingEventLog)rikkenGamesListener.inspectGamePlayerEvents(1);
    return;
  }else
  if(key==='\u0032'){
    if(inspectingEventLog)rikkenGamesListener.inspectGamePlayerEvents(2);
    return;
  }else
  if(key==='\u0033'){
    if(inspectingEventLog)rikkenGamesListener.inspectGamePlayerEvents(3);
    return;
  }
  console.log("Use the space bar to inspect game events.");
});
*/