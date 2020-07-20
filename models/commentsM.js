const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    text: { type: String, required: [true, "comment cannot be empty"] },
    user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
    post: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Post" },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date },
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

commentSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
