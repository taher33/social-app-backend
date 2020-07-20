const express = require("express");
const router = express.Router();
const Post = require("../models/postsM");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/api-features");
const handleAsync = require("../utils/handleAsync");
const { protect } = require("../controller/authController");
const comment = require("./comment");

router.use("/:postId/comment", comment);

router.get(
  "/",
  protect,
  handleAsync(async (req, res, next) => {
    const feature = new apiFeatures(Post.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();

    const posts = await feature.query;

    res.json({
      msg: "this worked",
      posts,
    });
  })
);

router.post("/", (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    text: req.body.text,
    // like: req.body.likes,
  });

  post
    .save()
    .then(result => {
      res.json({
        msg: "this worked there is a new post ",
        result,
      });
    })
    .catch(err => {
      res.json({
        msg: "from post save in profile.js",
      });
    });
});

module.exports = router;
