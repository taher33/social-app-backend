const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const auth = require("../controller/authController");
const {
  updateMe,
  deleteMe,
  getAllUsers,
} = require("../controller/userController");
const { deleteOne } = require("../controller/handlerFactory");

router.post("/login", auth.login);

router.route("/").get(getAllUsers).post(auth.signUp);

router.post("/forgotPassword", auth.forgotPass);
router.patch("/resetPassword/:token", auth.resetPassword);

router.patch("/updatePassword", auth.protect, auth.updatePassword);

router.patch("/updateMe", auth.protect, updateMe);

router.delete("/deleteMe", auth.protect, deleteMe);

router.delete("/:id", auth.protect, auth.restricTo("admin"), deleteOne(User));

module.exports = router;
