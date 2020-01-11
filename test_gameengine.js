// gameengine requires plugging in a sockets.io server and a GamesListener
const GamesListener=require('./gameslistener.js');

class RikkenTheGameGamesListener extends GamesListener{
    gameStarted(game){
        super.gameStarted(game);
    }
    gameFinished(game){
        super.gameFinished(game);
        // TODO store the game results
    }
    gameCanceled(game){
        super.gameCanceled(game);
    }
}

const path=require('path');
// server-side socket.io
// source: https://github.com/socketio/socket.io
const express=require('express');
const i18n=require('i18n');
const hbs=require('hbs');

const app=express();
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

const gameengine=require('./gameengine.js')(socket_io_server,new RikkenTheGameGamesListener());

// MDH@11JAN2020: pretty essential to do the init BEFORE registering the helper AND then it worked!!!!!!
app.use(i18n.init); // use internationalization
app.use(function(req, res, next) {
    hbs.registerHelper('__',function(){
        if(!this.locale){
            var args=Array.prototype.slice.call(arguments);
            var options=args.pop();
            return i18n.__.apply(options.data.root,args);
          }
          return i18n.__.apply(this, arguments);
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
app.get('/', function(req, res) {
    console.log("Rendering test.hbs");
    res.render('./test.hbs');
});

server.listen(3000,()=>{
    console.log("Express server listening on port 3000.");
});

