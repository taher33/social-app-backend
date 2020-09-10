const express = require("express");
const router = express.Router();
const { protect } = require("../controller/authController");
const comment = require("./comment");
const {
  getPosts,
  createPost,
  likePosts,
  deletePosts,
  deletemany,
  uploadPostImg,
} = require("../controller/postController");

router.use("/:postId/comment", comment);

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, uploadPostImg, createPost)
  .patch(protect, likePosts)
  .delete(deletemany);

module.exports = router;
