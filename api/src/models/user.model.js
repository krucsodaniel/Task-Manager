const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    mingLength: 1,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    mingLength: 1,
    trim: true,
  },
  nickName: {
    type: String,
    required: true,
    mingLength: 1,
    trim: true,
  },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
