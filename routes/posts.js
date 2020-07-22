const express = require("express");
const router = express.Router();
const Post = require("../models/postsM");
const mongoose = require("mongoose");
const { protect } = require("../controller/authController");
const comment = require("./comment");
const { getPosts, createPost } = require("../controller/postController");

router.use("/:postId/comment", comment);

router.route("/").get(protect, getPosts).post(protect, createPost);

module.exports = router;
