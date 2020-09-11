const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "can not be empty for now"],
    },

    user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    photo: { type: String, default: "" },
    slug: String,
    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date },
    page: { type: mongoose.SchemaTypes.ObjectId, ref: "Page" },
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
  // this.slug = slugify(this.user, {
  //   lower: true,
  // });
  if (this.isNew) this.createdAt = Date.now();
  else this.modifiedAt = Date.now();
  next();
});

postSchema.pre("find", function (next) {
  this.populate("comments");
  this.populate("user");
  next();
});

// postSchema.methods.checkLikes = function (id) {
//   if (this.likes.includes(id)) {
//     this.liked = true;
//   } else {
//     this.liked = false;
//   }
// };

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.virtual("likesInK").get(function () {
  return this.likes / 1000 + "k";
});

// postSchema.methods.allow = function (id) {
//   if (id === this.user) this.allowed = true;
//   else this.allowed = false;
//   console.log(this);
// };

module.exports = mongoose.model("Post", postSchema);
