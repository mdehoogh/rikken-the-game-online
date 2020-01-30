const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// MDH@24JAN2020: user renamed to user_id which is what it is
// MDH@30JAN2020: we do NOT want an _id stored in the score documents (see _id:false option!!!!)
//                also, using the (unique) user name I think makes it easier to see who played!!!!\
//                also, storing this way allows playing games with unregistered users as well
//                even better: if user_id is specified it's a registered user, otherwise it is not!!!!
//                NOTE player_name is ALSO not required, but perhaps it should be!!!!!!!
const scoreSchema = new Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    player_name:String,
    tricks_won:{type:Number,required:true},
    score: {type:Number,required:true},
},{
  _id:false,
});

// MDH@30JAN2020: updated typically occurs when a game with this player finished!!!!
const gameSchema = new Schema({
  name: {type:String,unique:true},
  bid:Number,
  bid_players:[Number],
  scores: [scoreSchema],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;