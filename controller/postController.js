const handleasync = require("../utils/handleAsync");
const apiFeatures = require("../utils/api-features");
const Post = require("../models/postsM");

exports.getPosts = handleasync(async (req, res, next) => {
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
});

exports.createPost = handleasync(async (req, res, next) => {
  const newpost = Post.create({
    text: req.body.content,
    user: req.body.poster,
  });

  res.status(201).json({
    status: "success",
    newpost,
  });
});
