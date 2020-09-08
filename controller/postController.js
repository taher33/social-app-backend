const handleasync = require("../utils/handleAsync");
const apiFeatures = require("../utils/api-features");
const Post = require("../models/postsM");
const appError = require("../utils/appError");
const { deleteOne } = require("./handlerFactory");

exports.getPosts = handleasync(async (req, res, next) => {
  if (req.query.user === "me") {
    req.query.user = req.user._id;
  }
  const feature = new apiFeatures(Post.find(), req.query, req.user)
    .filter()
    .limitFields()
    .sort()
    .pagination();
  const posts = await feature.query;
  console.log(req.query);
  //for testing
  // const posts = await Post.find();
  res.json({
    msg: "this worked",
    res: posts.length,
    posts,
    user: req.user,
  });
});

exports.createPost = handleasync(async (req, res, next) => {
  const newpost = await Post.create({
    text: req.body.content,
    user: req.user._id,
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

  console.log(req.body.postId);
  const post = await Post.findById(req.body.postId);

  if (!post) return next(new appError("post not found", 404));

  post.likes = parseInt(post.likes, 10) + 1;
  post.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
  });
});

exports.deletePosts = deleteOne(Post);
// for testing and it does not send antything
exports.deletemany = async (req, res, next) => {
  await Post.deleteMany();
  res.status(204);
};
// restrict some actions to some users
// still needs testing
exports.restrict = (req, res, next) => {
  const id = req.params.postId || req.body.id;

  if (req.user._id === id) next();
  else return next(new appError("not auth for this action", 403));
};
