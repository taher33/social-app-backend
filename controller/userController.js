const express = require("express");
const User = require("../models/userM");
const appError = require("../utils/appError");
const handleasync = require("../utils/handleAsync");
const { findByIdAndUpdate } = require("../models/userM");

const filterObj = (obj, ...allowed) => {
  const filterdObj = {};
  Object.keys(obj).forEach(el => {
    if (allowed.includes(el)) filterdObj[el] = obj[el];
  });
  return filterdObj;
};

exports.updateMe = handleasync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConf) {
    return next(new appError("this is not for password updates", 400));
  }
  const filterdBody = filterObj(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(req.user._id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "seccuss",
    user,
  });
});

exports.deleteMe = handleasync(async (req, res, next) => {
  await findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "seccuss",
  });
});
