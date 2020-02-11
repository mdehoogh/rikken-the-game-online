// MDH@11FEB2020: to return an array of games the user played in
const User=require('../models/user');
const Game=require('../models/game');

module.exports = async(userId)=>{
    
    return(await User.findById(userId).populate('games').exec()).games;
    /* replacing:
    return [{
        name: "Rikken on Thursdays",
        scores: [{
            user: {
                username: "Marc"
            },
            score: -2
        }, {
            user: {
                username: "Elyas"
            },
            score: 0
        }, {
            user: {
                username: "Jurgen"
            },
            score: -5
        }, {
            user: {
                username: "Hannah"
            },
            score: 7
        }]

    }]
    */
}