const express = require('express');
const router  = express.Router();
const User = require("../models/User");

router.get("/waiting", (req, res, next) => {
    
    res.render("waiting")
})