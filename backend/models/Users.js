const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  createdAt: Number,
  updatedAt: Number,
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
