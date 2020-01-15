const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const getPlayerScoreHistory = require("../controllers/getPlayerScoreHistory");

router.get("/", (req, res, next) => {
    debugger
    res.render("auth/private", {gamesPlayed: getPlayerScoreHistory("asdf123sdf")})
})

module.exports = router;