const express = require("express");
const router = express.Router();
const { protect } = require("../controller/authController");
const {
  getAllPages,
  createPages,
  getOnePage,
  followPages,
  checkIfAdmin,
  restrictPagePosters,
  deletePage,
} = require("../controller/pageController");
const { createPost } = require("../controller/postController");

router.use(protect);

router.route("/").get(getAllPages).post(createPages);

router
  .route("/:pageId")
  .get(getOnePage)
  .post(checkIfAdmin, restrictPagePosters, createPost)
  .patch(followPages)
  .delete(deletePage);

module.exports = router;
