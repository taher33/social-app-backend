const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const mongoose = require("mongoose");
const handleAsync = require("../utils/handleAsync");
const appError = require("../utils/appError");
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

router.post(
  "/",
  handleAsync(async (req, res, next) => {
    const user = await User.create({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({
      status: "succes user was created",
      user,
    });
  })
);

router.delete(
  "/:id",
  handleAsync(async (req, res, next) => {
    const user = await User.remove({ _id: req.params.id });
    if (!user) {
      return next(new appError("there are no users with this id", 404));
    }
    res.status(204).json({
      status: "success",
      result: null,
    });
  })
);

module.exports = router;
