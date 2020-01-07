// gameengine requires plugging in a sockets.io server and a GamesListener
const GamesListener=require('./gameslistener.js');

class RikkenTheGameGamesListener extends GamesListener{
    gameStarted(game){
        super.gameStarted(game);
    }
    gameFinished(game){
        super.gameFinished(game);
    }
    gameCanceled(game){
        super.gameCanceled(game);
    }
}

// server-side socket.io
// source: https://github.com/socketio/socket.io

const app=require('express')();
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

server.listen(3000,()=>{
    console.log("Express server listening on port 3000.");
});

