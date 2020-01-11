const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const scoreSchema = new Schema({user:{type:Schema.Types.ObjectId,ref:'user'},score:Number});

const gameSchema = new Schema({
        name: {type:String,unique:true}, // a unique game name
        scores: {type:[scoreSchema],validate: [(val)=>{return val.length==4;}, '{PATH} does not equal 4.']},
    },{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;