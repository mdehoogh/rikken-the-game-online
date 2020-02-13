
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
  console.log("Games played by user",gamesPlayedByUser);
  res.render("auth/private", { user: req.user,gamesPlayed:gamesPlayedByUser,route:"Dashboard",dashboard:true });
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
  new GoogleStrategy(
    {
      clientID: process.env.RIKKEN_GOOGLE_CLIENT_ID,
      clientSecret: process.env.RIKKEN_GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google account details:", profile);
      //  debugger
      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          return User.create({ 
            googleID: profile.id,
            username: profile.displayName
          })
            .then(newUser => {
              done(null, newUser);
            })
        })
        .catch(err => done(err)); 
    }
  )
);

module.exports = router;