const express = require('express');
const router  = express.Router();
const User = require("../models/user"); // MDH@12FEB2020: using uppercase (User) instead of lowercase (user) got me into trouble 

router.get("/waiting", (req, res, next) => {
    
    res.render("waiting");
})