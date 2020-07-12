const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const Post = require("../models/postsM");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/api-features");
const handleAsync = require("../utils/handleAsync");

router.get(
  "/",
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
  // User.find({ name: req.body.name })
  //   .exec()
  //   .then((name) => {
  //     if (name.length !== 0) {
  //       const post = new Post({
  //         _id: new mongoose.Types.ObjectId(),
  //         name: name,
  //         text: req.body.text,
  //       });

  //       post
  //         .save()
  //         .then((result) => {
  //           res.json({
  //             msg: "this worked there is a new post ",
  //             result,
  //           });
  //         })
  //         .catch((err) => {
  //           res.json({ err, msg: "from post save in profile.js" });
  //         });
  //     } else {
  //       res.json({
  //         msg: "plz register",
  //       });
  //     }
  //   });
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
