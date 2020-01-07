/**
 * a GamesListener listens for games starting, and stopping
 * 
 */
class GamesListener {
    
    gameStarted(game){console.log("GAMES LISTENER >> Game started.");}
    gameFinished(game){console.log("GAMES LISTENER >>> Game finished.");}
    gameCanceled(game){console.log("GAMES LISTENER >>> Game canceled.");}

}

module.exports=GamesListener;