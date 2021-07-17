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
  createDirectory,
} = require("../controller/postController");

router.use("/:postId/comment", comment);

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, createDirectory, uploadPostImg, createPost)
  .patch(protect, likePosts)
  .delete(deletemany);

module.exports = router;
