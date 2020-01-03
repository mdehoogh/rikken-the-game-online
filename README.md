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




