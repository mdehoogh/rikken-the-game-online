const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// MDH@24JAN2020: user renamed to user_id which is what it is
const scoreSchema = new Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score: Number
});

const gameSchema = new Schema({
  name: String,
  scores: [scoreSchema],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;