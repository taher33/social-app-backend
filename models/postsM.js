const mongoose = require("mongoose");
const slugify = require('slugify')

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  likes: {
    type: Number
  },
  slug: String


  /////////////////

}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

postSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  })
  next()
})

postSchema.virtual('likesInK').get(function () {
  return this.likes / 1000 + 'k'
})

module.exports = mongoose.model("Post", postSchema);