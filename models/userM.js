const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "name already taken"],
    required: [true, "a name is required"],
    minlength: 3,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // match: [
    //   /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    //   ,
    //   "pls make it a valid email",
    // ],
    lowercase: true,
    validate: [validate.isEmail, "please provide valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same",
    },
    select: false,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // hash the password
  this.password = bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

module.exports = mongoose.model("User", userSchema);
