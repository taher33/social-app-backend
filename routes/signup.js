const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const mongoose = require("mongoose");
const handleAsync = require("../utils/handleAsync");
const appError = require("../utils/appError");
const auth = require("../controller/authController");

router.post("/test", auth.login);

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

router.delete(
  "/:id",
  auth.protect,
  auth.restricTo("admin"),
  handleAsync(async (req, res, next) => {
    const user = await User.deleteOne({ _id: req.params.id });
    if (user.deletedCount === 0) {
      return next(new appError("there are no users with this id", 404));
    }
    res.status(200).json({
      status: "success",
      result: null,
    });
  })
);

module.exports = router;
