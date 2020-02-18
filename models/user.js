const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// MDH@18FEB2020: adding facebookID, twitterID and email (for storing email address)
const userSchema = new Schema({
  username: String,
  password: String,
  googleID: String,
  facebookID: String,
  twitterID: String,
  email:String,
  games: [{type: Schema.Types.ObjectId, ref: "game"}]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("user", userSchema);

module.exports = User;