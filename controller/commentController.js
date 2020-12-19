const Comment = require("../models/commentsM");
const handleasync = require("../utils/handleAsync");
const { deleteOne } = require("./handlerFactory");

exports.getAllComments = handleasync(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { tour: req.params.postId };
  const comments = await Comment.find(filter);

  res.json({
    status: "success",
    result: comments.length,
    comments,
  });
});

//create comments hehehheheheheh
exports.createComment = handleasync(async (req, res, next) => {
  console.log(req.body);
  if (!req.body.commenter) req.body.commenter = req.user._id;
  if (!req.body.post) req.body.post = req.params.postId;
  const newComment = await Comment.create({
    text: req.body.text,
    user: req.body.commenter,
    post: req.body.post,
  });

  res.status(201).json({
    status: "success",
    newComment,
  });
});

//liking comments

exports.likeComment = handleasync(async (req, res, next) => {
  const id = req.params.commentId || req.body.id;

  const comment = await Comment.findById(id);

  comment.likes = comment.likes * 1 + 1;

  comment.save({ validateBeforeSave: false });

  res.json({
    status: "success",
  });
});

exports.deleteComment = deleteOne(Comment);
