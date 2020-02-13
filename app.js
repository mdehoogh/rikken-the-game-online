require('dotenv').config()

const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require("express-session");
const bcrypt       = require("bcryptjs");
const passport     = require("passport");
const ensureLogin  = require("connect-ensure-login");
const flash        = require("connect-flash");
const hbs          = require("hbs");

// MDH@12FEB2020: some helper functions we need for obtaining scores
hbs.registerHelper("getTimestamp",function(aDate){return aDate.toLocaleString();});
hbs.registerHelper("getBidName",function(bid){
  return ["pas","rik","rik (beter)","negen alleen","negen alleen (beter)","pico","tien alleen","tien alleen (beter)","elf alleen","elf alleen (beter)","mis\xe8re","twaalf alleen","twaalf alleen (beter)","open mis\xe8re","dertien alleen","dertien alleen (beter)","open mis\xe8re met een praatje","troela","om de schoppen vrouw en de laatste slag","om de laatste slag"][bid];
});
hbs.registerHelper("getGamePlayerScore", function(scores,player_name) {
  let scoreIndex=scores.length;
  while(--scoreIndex>=0&&scores[scoreIndex].player_name!==player_name);
  return(scoreIndex>=0?scores[scoreIndex].score:"?");
});
hbs.registerHelper("getGamePlayerTricksWon", function(scores,player_name) {
  let scoreIndex=scores.length;
  while(--scoreIndex>=0&&scores[scoreIndex].player_name!==player_name);
  return (scoreIndex>=0?scores[scoreIndex].tricks_won:"?");
});
hbs.registerHelper("getGamePlayerNames",function(scores,player_name){
  return scores.map((score)=>(score.player_name===player_name?"<b>"+player_name+"</b>":score.player_name)).join(" ");
});

// MDH@12FEB2020: copied over from ./test_gameengine.js for running the game engine
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

const rikkenGamesListener=new RikkenGamesListener();

var gameengine=null;

const mongoose=require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => {

    console.log('Connected to the game database!');

    // running with the acknowledgmentRequired flag set to true would result in multiple users being asked to send their bid
    // which must mean that an event isn't actually acknowledged!!!!!
    Game.count({},(err,count)=>{
        // fire up the game engine!!!!
        gameengine=require('./gameengine.js')(socket_io_server,rikkenGamesListener,(err?0:count),false);
    });

  }).catch(err => {
    console.error('Error connecting to MongoDB.',err);
  });

// MDH@12FEB2020: END of setting up and running the game engine!!!!

// EXPRESS SERVER SETUP
const express=require('express');
const app=express();
// END EXPRESS SERVER SETUP

// MDH@12FEB2020: copied over from ./test_gameengine.js for using i18n
app.locals.title="Rikken"; // the title of this nice card game

// setup multiple language support
const i18n=require('i18n');
i18n.configure({
    locales:['nl', 'en'],
    defaultLocale:'en',
    queryParameter: 'lang', // replacing: cookie:'locale' (which we do not have!!!!)
    directory: path.join(__dirname,'locales'),
});
i18n.setLocale('en'); // try it this way!!!!

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
// MEHD@12FEB2020: END of i18n support

// SOCKET.IO SERVER SETUP
const server      = require('http').createServer(app);

// MDH@12FEB2020: copied over from ./test_gameengine.js for running socket.io
const socket_io_server=require('socket.io')(server,{ pingInterval: 60000 }/*,{
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
}*/);
// MDH@12FEB2020: END of running the socket.io server

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.set('view options', { layout: 'layout' });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));

// passport init and config
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//registering partials
hbs.registerPartials(__dirname + '/views/partials');

//routes

// const index = require('./routes/index');
// app.use('/',index);
app.use("/profiel", require("./routes/private-profile"));

app.use('/', require("./routes/auth-routes"));

// routes rendering
// MDH@13FEB2020: no need for a separate home page, we allow users to log in immediately at the root route
app.get('/', (req, res, next) => {
  res.render('auth/login',{user:req.user,route:"Aanmelden"});
});

// app.get('/wachten', (req, res, next) => {
//   res.render('waiting');
// });

// MDH@23JAN2020: if we really want to go gameplaying...
app.get('/spelen',(req,res,next)=>{
  // gameplaying.hbs assumes the name of the user is in the username variable!!!!
  if(req.user&&req.user.username)
    res.render('gameplaying',{username:req.user.username,route:"Spelen"});
  else
    next(new Error("Schrijf je in of/en meld je aan."));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Dit eindpunt bestaat niet!');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port=(process.env.PORT||3000);
server.listen(port,()=>{
  console.log("Express server listening on port "+port+".");
  console.log("Google client ID: "+process.env.GOOGLE_CLIENT_ID+".");
  console.log("Google client secret: '"+process.env.GOOGLE_CLIENT_SECRET+".");
  if(process.env.NODE_ENV==='development')require('open')('http://localhost:'+port); // MDH@12FEB2020: convenient in development mode
});

module.exports = app;
