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
  Then, open Chrome and open URL 'localhost:3001'.
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
  A lot of debugging has been going on, and most of the little imperfections playing have been addressed.
  
  Good luck!

  Marc P. de Hoogh, 14 January 2020




