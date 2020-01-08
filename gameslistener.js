/**
 * a GamesListener listens for games starting, and stopping
 * 
 */
class GamesListener {
    
    gameStarted(game){console.log("GAMES LISTENER >> Game '"+game.name+"' started.");}
    gameFinished(game){console.log("GAMES LISTENER >>> Game '"+game.name+"' finished.");}
    gameCanceled(game){console.log("GAMES LISTENER >>> Game '"+game.name+"' canceled.");}

}

module.exports=GamesListener;