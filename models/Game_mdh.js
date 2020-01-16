const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const scoreSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score: Number
});

const gameSummary = new Schema({
  [
  {
    user1: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score1: Number
  },
  {
    user2: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score2: Number
  },
  {
    user3: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score3: Number
  },
  {
    user4: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    score4: Number
  },
  ]
})

const gameSchema = new Schema({
  name: String,
  scores: [scoreSchema],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("user", userSchema);

module.exports = User;