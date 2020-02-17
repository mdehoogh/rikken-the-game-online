
const express = require("express");
const router = express.Router();

const User = require("../models/user");

const getPlayerScoreHistory = require("../controllers/getPlayerScoreHistory");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

//signup
router.get("/inschrijven", (req, res, next) => {
  res.render("auth/signup",{route:"Inschrijven"});
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", { signup:true, route:"Inschrijven", message: "Geef gebruikersnaam en wachtwoord op." });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/login", { signup:true, route:"Inschrijven", message: "Gebruikersnaam al in gebruik."});
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        // MDH@2020: with signup replaced by login passing the signup flag will force the signup flag checkbox to be initially set
        res.render("auth/login", { signup:true, route:"Inschrijven", message: "Er is iets fout gegaan."});
      }else{
        // MDH@12FEB2020: I suppose that if the sign up succeeds, can't we do the same as login does??????? wondering if that will work!!!!
        //                as far as I can tell from the passportJS documentation I should call login instead of authenticate to login the new user immediately
        //                NOTE I'm conjecturing that we can use newUser as that's the document that got saved!!!!
        req.login(newUser,function(err){
          if(err)return next(err);
          console.log("New user logged in: "+req.user.username);
          return res.redirect('/dashboard');
        });
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

/* MDH@13FEB2020: log in now moved over to the root (home page)
//login
router.get("/aanmelden", (req, res, next) => {
    res.render("auth/login",{route:"Aanmelden"});
});
*/

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/", // MDH@13FEB2020: replacing "/aanmelden"
  failureFlash: true,
  passReqToCallback: true
}));

//redirect to "profile" needs to be finished
router.get("/dashboard", ensureLogin.ensureLoggedIn(), async(req, res) => {
  // console.log("After successful login user",req.user);
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
  res.render("auth/private", { user: req.user,gamesPlayed:gamesPlayedByUser.reverse(),playerRanks:playerRanks,route:"Dashboard",dashboard:true });
});

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Foute gebruikersnaam of wachtwoord." });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Foute gebruikersnaam of wachtwoord." });
    }

    return next(null, user);
  });
}));

router.get("/afmelden", (req, res) => {
  req.logout();
  // MDH@13FEB2020: with the Home page now being the login page, it's best to go there
  res.redirect("/"); // replacing: res.redirect('/aanmelden');
});

//passport OAuth

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/" 
  })
);

passport.use(
  // MDH@13FEB2020: proxy:true should solve the problem of returning to http instead of https
  new GoogleStrategy(
        {
          clientID: process.env.RIKKEN_GOOGLE_CLIENT_ID,
          clientSecret: process.env.RIKKEN_GOOGLE_CLIENT_SECRET,
          callbackURL: "/auth/google/callback",
          proxy:true
        },
        (accessToken, refreshToken, profile, done) => {
          console.log("Google account details:", profile);
          // ascertaining that we have a user registered with the given google ID
          // MDH@17FEB2020: the following takes a shortcut by passing user to the next level, so we only need a single done call for success/failure
          User
          .findOne({googleID:profile.id})
          .then(user=>user||User.create({googleID:profile.id,username:profile.displayName}))
          .then(user=>done(null,user))
          .catch(err=>done(err));
        }
      )
);

module.exports = router;