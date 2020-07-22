const mongoose = require("mongoose");
const slugify = require("slugify");
const { create } = require("./userM");

const postSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "can not be empty for now"],
    },

    user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
    likes: {
      type: Number,
      default: 0,
    },
    photo: [String],
    slug: String,
    createdAt: { type: Date },
    modifiedAt: { type: Date },
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
  if (this.isNew) this.createdAt = Date.now();
  else this.modifiedAt = Date.now();
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
