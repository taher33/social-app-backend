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
} = require("../controller/postController");

router.use("/:postId/comment", comment);

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, createPost)
  .patch(protect, likePosts)
  .delete(deletemany);

module.exports = router;
