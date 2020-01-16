const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const scoreSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
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