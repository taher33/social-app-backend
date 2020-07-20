const express = require("express");
const {
  getAllComments,
  createComment,
  deleteComment,
} = require("../controller/commentController");
const { protect, restricTo } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllComments)
  .post(protect, restricTo("user"), createComment)
  .delete(protect, restricTo("user"), deleteComment);

module.exports = router;
