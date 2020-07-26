const handleasync = require("../utils/handleAsync");
const apiFeatures = require("../utils/api-features");
const Post = require("../models/postsM");
const appError = require("../utils/appError");

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
    page: req.params.pageId,
  });

  res.status(201).json({
    status: "success",
    newpost,
  });
});
// did not add the end point yet
exports.likePosts = handleasync(async (req, res, next) => {
  // should decide if params or body
  if (!req.body.postId)
    return next(new appError("the post id is required", 400));

  const post = await Post.findById(req.body.postId);

  if (!post) return next(new appError("post not found", 404));

  post.likes = parseInt(post.likes, 10) + 1;

  res.status(201).json({
    status: "success",
  });
});
