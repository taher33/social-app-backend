const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "there already exists a page with this name"],
      required: [true, "plz provide a name"],
    },

    admins: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "plz specify the id of the page creator"],
      },
    ],

    coverImg: String,
    aboute: String,
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Page", pageSchema);
