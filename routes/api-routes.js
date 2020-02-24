/* MDH@21FEB2020: adapted from auth-routes.js
   exposing all routes available to API calls (i.e. with root route /api/v1/ see app.js for that)
   removing all routes that would render a web page like /inschrijven, (so typically the Dutch named routes)
*/
// var cookie = require('cookie-signature'); // for signing the sessionID into a cookie
 
const express = require("express");
const router = express.Router();

const User = require("../models/user");

const getPlayerScoreHistory = require("../controllers/getPlayerScoreHistory");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
// const ensureLogin = require("connect-ensure-login");
// const LocalStrategy = require("passport-local").Strategy;
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy; // MDH@18FEB2020
// const TwitterStrategy = require("passport-twitter").Strategy; // MDH@18FEB2020

const passport = require("passport");

// signup
// MDH@21FEB2020: although we do not have email in the signup procedure on the web we do have it in the Flutter app interface
//                by using await we can wait for obtaining the user with a certain name
router.post("/signup", async(req, res, next)=>{
    // check input
    const username=req.body.username.trim();
    if(username.length==0)return res.json({error:"Een gebruikersnaam is verplicht!"});
    const password=req.body.password.trim();
    if(password.length==0)return res.json({error:"Een wachtwoord is verplicht!"});

    // check if there's already a user with that name
    const user=await User.findOne({username});

    if(user)return res.json({"error":"Gebruikersnaam al in gebruik!"});

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const email=(req.body.email?req.body.email.trim():null);

    const newUser=new User({username,email,password: hashPass});
    newUser.save(err=>{
        if(err)return res.json({error:"Aanmaken nieuwe gebruiker mislukt.","details":err.message});
        // MDH@12FEB2020: I suppose that if the sign up succeeds, can't we do the same as login does??????? wondering if that will work!!!!
        //                as far as I can tell from the passportJS documentation I should call login instead of authenticate to login the new user immediately
        //                NOTE I'm conjecturing that we can use newUser as that's the document that got saved!!!!
        req.login(newUser,err=>{
          if(err)return res.json({error:"Direct aanmelden van de nieuwe gebruiker mislukt!","details":err.message});
          if(!req.user)return res.json({error:"Direct aanmelden van de nieuwe gebruiker mislukt!"});
          // I suppose that with the new user logged in successfully we should return the connect.sid
          console.log("New user logged in: "+req.user.username);
          res.json({_id:req.user._id,username:req.user.username,email:req.user.email});
          // replacing: res.json({session:req.session,sessionID:req.sessionID,cookie:cookie.sign(req.sessionID,"our-passport-local-strategy-app")}); // can we do this?????
        });
    });
});

// login
// MDH@21FEB2020: we can decide to use req.login just like we did with /signup instead of passport.authenticate
router.post("/login",(req,res,next)=>{
    // check input
    const username=req.body.username.trim();
    if(username.length==0)return res.json({error:"Een gebruikersnaam is verplicht!"});
    const password=req.body.password.trim();
    if(password.length==0)return res.json({error:"Een wachtwoord is verplicht!"});
    User.findOne({username})
        .then(user=>{
            req.login(user,err=>{
                if(err)return res.json({error:"Aanmelden mislukt!","details":err.message});
                if(!req.user)return res.json({error:"Aanmelden mislukt!"});
                // I suppose that with the new user logged in successfully we should return the connect.sid
                console.log("User logged in: "+req.user.username);
                res.json({_id:req.user._id,username:req.user.username,email:req.user.email});
                /* replacing:
                res.json({session:req.session,sessionID:req.sessionID,cookie:cookie.sign(req.sessionID,"our-passport-local-strategy-app")}); // can we do this?????
                */
              });
        })
        .catch(err=>res.json({error:"Ongeldige gebruikersinformatie.",details:err.message}));
});

// logout
router.get("/logout",(req,res,next)=>{
    if(!req.user)return res.json({error:"Geen aangemelde gebruiker."});
    const response={_id:req.user._id};
    req.logout();
    if(req.user)return res.json({error:"Afmelden mislukt!"});
    res.json(response); // can we do this?????
});

// dashboard
// MDH@21FEB2020: dashboard renamed to gameresults because that's what they typically return
//                but the request should contain the session 'cookie' that was sent in response to a successful login
router.get("/gameresults"/*, ensureLogin.ensureLoggedIn()*/, async(req,res,next) => {
  if(!req.user)return res.json({error:"Geen aangemelde gebruiker."});
  let gamesPlayedByUser=await getPlayerScoreHistory(req.user._id);
  console.log("Games played by user "+req.user._id,gamesPlayedByUser);
  // MDH@16FEB2020: get the current user as first user in the list of scores
  let userTotalScores={}; // keep track of the total scores (per user)
  let userTotalScore=0; // the absolute total score of the current player
  userTotalScores[req.user.username]=0; // obviously the relative score of the 
  for(let gamePlayedIndex in gamesPlayedByUser){
    let gamePlayedByUser=gamesPlayedByUser[gamePlayedIndex]; // by ref!!!!
    let scores=gamePlayedByUser.scores;
    console.log("Scores",scores);
    while(scores[0].player_name!==req.user.username)scores.push(scores.shift());
    console.log("Scores",scores);
    // change the absolute scores of the other users to relative scores
    userTotalScore+=scores[0].score; // update the total score of the current player
    for(let scoreIndex=1;scoreIndex<scores.length;scoreIndex++)
      if(userTotalScores.hasOwnProperty(scores[scoreIndex].player_name))
        userTotalScores[scores[scoreIndex].player_name]+=(scores[scoreIndex].score-scores[0].score);
      else
        userTotalScores[scores[scoreIndex].player_name]=(scores[scoreIndex].score-scores[0].score);
    // add the total score to the scores in the game
    for(let score of scores)score.total_score=(score.player_name===req.user.username?userTotalScore:userTotalScores[score.player_name]);
  }
  // now we can determine the ranks of the players relative to the current player
  // for this we need to sort the total scores
  let userTotalScoresSortedKeys=Object.keys(userTotalScores).sort((a,b)=>userTotalScores[b]-userTotalScores[a]);
  // we can assign the rank values by using playerRanks as this in map, NOTE that any element that is not equal to the value in front of it get's index+1 as rank
  let playerRanks=userTotalScoresSortedKeys.map((element,index,arr)=>{
                                              return {'name':element,
                                                      'rank':(index<=0||userTotalScores[arr[index-1]]!==userTotalScores[element]?index+1:null)
                                                      };});
  console.log("Games played by user",gamesPlayedByUser);
  // passing the user id suffices (no need to pass password and other stuff)
  res.json({user_id:req.user._id,gamesPlayed:gamesPlayedByUser.reverse(),playerRanks:playerRanks});
});

// passport.serializeUser((user,cb)=>{cb(null, user._id);});
// passport.deserializeUser((id,cb)=>{User.findById(id,(err,user)=>{if(err)return cb(err);cb(null,user);});});

router.get("/logout",(req,res,next)=>{
  req.logout();
  // MDH@13FEB2020: with the Home page now being the login page, it's best to go there
  res.redirect("/"); // replacing: res.redirect('/aanmelden');
});

// MDH@23FEB2020: return a list of user names
router.get("/users",(req,res,next)=>{
  // for now we allow getting the list of user names without the need to be logged in
  User.find((err,users)=>{
    if(err)return next(err);
    // send e-mail addresses as well if a registered user is requesting (which is questionable as well but could be used for invitations)
    if(req.user){
      let userInfos=users.map(user=>{return{'name':user.username,'email':user.email};});
      res.json(userInfos);
    }else // send user names only
      res.json(users.map((user)=>user.username));
  });
});

// fall-through in the API routes
// catch 404 and forward to error handler
router.use((req,res,next) => {
  const err=new Error('Dit API eindpunt bestaat niet!');
  err.status=404;
  next(err);
});

// error handler
router.use((err,req,res,next) => {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error text
  res.status(err.status || 500);
  res.json({error:err.message});
});


module.exports = router;