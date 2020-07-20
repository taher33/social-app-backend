const Comment = require("../models/commentsM");
const handleasync = require("../utils/handleAsync");

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

exports.createComment = handleasync(async (req, res, next) => {
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

exports.deleteComment = handleasync(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.body.id);

  res.status(204).json({
    status: "success",
  });
});
