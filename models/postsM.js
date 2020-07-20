const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    likes: {
      type: Number,
    },
    slug: String,
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

postSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

postSchema.pre("find", function (next) {
  this.populate("comments");
  next();
});

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.virtual("likesInK").get(function () {
  return this.likes / 1000 + "k";
});

module.exports = mongoose.model("Post", postSchema);
