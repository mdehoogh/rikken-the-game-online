const express = require('express');
const router  = express.Router();

const getPlayerScoreHistory = require("../controllers/getPlayerScoreHistory");

router.get("/", async(req, res, next) => {
    console.log("User",req.user);
    let gamesPlayedByUser=await getPlayerScoreHistory(req.user._id);
    console.log("Games played by user",gamesPlayedByUser);
    res.render("auth/private", {user:req.user,gamesPlayed:gamesPlayedByUser,route:req.user.username});
});

module.exports = router;