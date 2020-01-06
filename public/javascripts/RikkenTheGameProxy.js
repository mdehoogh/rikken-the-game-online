/**
 * receives game information over the internet using a web socket
 */

class RikkenTheGameProxy extends RikkenTheGame{

    opened(event){
        console.log("Web socket connection opened!");
        // plug in a new game instance into RikkenTheGame
        this._player.game=this;
    }
    closed(event){
        console.log("Web socket connection closed!");
        if(this.game)this._player.game=null; // remove the game played by the player (if any)
    }
    received(event){
        let d=event.data;
        // TODO parse the message received...
        let rikkenTheGame=this.game;
        if(!rikkenTheGame){console.log("No game to update!");return;}

    }
    errored(event){
        console.log("Web socket error ",event);
    }
    constructor(player){
        if(!player)throw new Error("No player to play the game.");
        if(!(player instanceof Player))throw new Error("Invalid player instance!");
        this._player=player; // remember the player (if none specified the web socket will be closed immediately)
        this._webSocket=new WebSocket("ws"+(location.protocol.endsWith("s")?"s":"")+"://"+location.hostname);
        this._webSocket.onopen=this.opened.bind(this);
        this._webSocket.onclose=this.closed.bind(this);
        this._webSocket.onerror=this.errored.bind(this);
        this._webSocket.onmessage=this.received.bind(this);
    }

    get game(){return(this._player?this._player.game:null);}

    // call hasOpened() to check whether or not the connection is open (will block while connecting or closing)
    hasOpened(){
        // block while in intermediate state
        while(this._webSocket.readyState==WebSocket.CONNECTING||this._webSocket.readyState==WebSocket.CLOSING);
        return(this._webSocket.readyState==WebSocket.OPEN?this:null); // return this if opened successfully
    }

}