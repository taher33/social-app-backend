const Comment = require("../models/commentsM");
const handleasync = require("../utils/handleAsync");
const { deleteOne } = require("./handlerFactory");

exports.getAllComments = handleasync(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId });

  res.json({
    status: "success",
    result: comments.length,
    comments,
  });
});

//create comments hehehheheheheh
exports.createComment = handleasync(async (req, res, next) => {
  const newComment = await Comment.create({
    text: req.body.text,
    user: req.user._id,
    post: req.params.postId,
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
