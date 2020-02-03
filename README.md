# rikken-the-game-online
Multiplayer version of the card game rikken

DEVELOPMENT
-----------
  29 December 2019:
  NODE APP SETUP
  --------------
  Using iron-generator to generate the app structure: 
  1. Install: $ npm install -g iron-generator
  2. Initialize project directory: $ irongenerate --view=hbs --database=mongoose --git rikken-the-game-online/
  3. Install dependencies: $ cd rikken-the-game-online && npm install
  4. Run: $ npm start
  5. Test in browser at address http://localhost:3000/

  NODE APP INITIALIZATION
  -----------------------
  A demo version of rikken-the-game where a single person plays all four hands is available at: https://mdh-rikken-the-game.herokuapp.com.
  It's index.html is present in this project at the root level, and is used as base of the client (browser) part, extended in such a way
  that the server part (app) running on the server machine communicates over a web socket to the client.

  GAME PLAY TESTING
  -----------------
  The game play can be tested separately.
  To do so (standing in the folder you cloned the repository from):
  $ cd rikken-the-game-online
  $ code .
  In VS Code execute npm script 'test' from the NPM SCRIPTS tab in the EXPLORER window, or, open the terminal (Cmd/Ctrl-~), and
  $ npm test
  Then, open Chrome and open URL 'http://localhost:3000'.
  If everything is Ok, you get to see a list of 8 links.
  After Cmd/Ctrl clicking 4 links, 4 tabs will be created, and each tab would have a title started with 'Rikken'.
  With 4 active players, the game engine will start a game.
  Once a game starts the game engine will prompt each player for bidding, choose trump and/or partner suits, and play cards.
  Every prompt will make the name of the player appear in the document title. This way one knows what tab page to go to
  while testing.

  However, due to problems sending information between player and game engine the game might halt.
  If that happens nobody is prompted anymore while they should. In that case kill the VS Code terminal, followed by closing
  all player tab pages in Chrome, and start over. Of course, we will attempt to fix all the little bugs asap. 

  03 Feburuary 2020:
  DEBUG DEBUG DEBUG
  -----------------
  A lot of debugging has been going on in January, and most of the little imperfections playing have been addressed.
  
  Also, the communication with the server is now more visible in the user interface: a separate bar has been dedicated to it.
  At the right-hand side a message can be sent to the server and will be echoed by the server. However, the server basically
  does not respond to the text message per se but responds to the player state that is sent along with the message.
  Nevertheless, this will allow a player to check if the game server is still active.

  It is my intention to pass the message along to the player that is supposed to bid or play now, as this is the original idea behind these messages.

  Additionally the app has been deployed to Heroku and can be played at: https://rikken.herokuapp.com.

  FUTURE DEVELOPMENT
  ------------------
  A begin was made with integrating playing the game with registered users, using sign up and log in routes implemented by my partner in crime, Hannah, 
  but has not yet been fully tested. 
  Therefore, at the moment, this is not yet possible online i.e. you're currently playing the game the same way as when testing (i.e. the start script
  matches the test script).
  Even so, the game results are still stored in the game result database by player name, although the previous game results are not yet shown! 
  Note that unregistered player names should in the future always differ from registered player names, but will be unprotected by a password.

  Good luck with playing the game!

  Marc P. de Hoogh, 14 January 2020




