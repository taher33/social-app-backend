const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: [true, "name already taken"],
    required: [true, "a name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      ,
      "pls make it a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  profileImg: {
    type: String,
    default: "profile-imgs/default-img.png",
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    // still needs work here
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
