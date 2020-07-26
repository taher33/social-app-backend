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
} = require("../controller/pageController");
const { createPost } = require("../controller/postController");
// need to test if the posting works
router.use(protect);
router.use(checkIfAdmin);
router.route("/").get(getAllPages).post(createPages);

router
  .route("/:postId")
  .get(getOnePage)
  .post(restrictPagePosters, createPost)
  .patch(followPages);

module.exports = router;
