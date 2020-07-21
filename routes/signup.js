const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const mongoose = require("mongoose");
const handleAsync = require("../utils/handleAsync");
const appError = require("../utils/appError");
const auth = require("../controller/authController");
const { updateMe, deleteMe } = require("../controller/userController");
const { deleteOne } = require("../controller/handlerFactory");

router.post("/login", auth.login);

router.get(
  "/",

  handleAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: "got the users succes",
      number: await User.countDocuments(),
      result: users,
    });
  })
);

router.post("/", auth.signUp);

router.post("/forgotPassword", auth.forgotPass);
router.patch("/resetPassword/:token", auth.resetPassword);

router.patch("/updatePassword", auth.protect, auth.updatePassword);

router.patch("/updateMe", auth.protect, updateMe);

router.delete("/deleteMe", auth.protect, deleteMe);

router.delete("/:id", auth.protect, auth.restricTo("admin"), deleteOne(User));

module.exports = router;
