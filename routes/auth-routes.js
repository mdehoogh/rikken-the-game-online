
const express = require("express");
const router = express.Router();

const User = require("../models/user");

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
    res.render("auth/signup", { message: "Geef gebruikersnaam en wachtwoord op.",route:"Inschrijven" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "Gebruikersnaam al in gebruik." ,route:"Inschrijven"});
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
        res.render("auth/signup", { message: "Er is iets fout gegaan.",route:"Inschrijven" });
      } else {
        // MDH@12FEB2020: how about going to log in immediately????
        res.redirect("/aanmelden");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//login
router.get("/aanmelden", (req, res, next) => {
    res.render("auth/login",{route:"Aanmelden"});
});
  
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/aanmelden",
  failureFlash: true,
  passReqToCallback: true
}));

//redirect to "profile" needs to be finished
router.get("/dashboard", ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log("After successful login user",req.user);
  res.render("auth/private", { user: req.user,route:"Dashboard" });
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
  res.redirect("/aanmelden");
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