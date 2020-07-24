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

exports.getAllUsers = handleasync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "got the users succes",
    number: await User.countDocuments(),
    result: users,
  });
});

exports.addFriends = handleasync(async (req, res, next) => {
  if (!req.body.email) return next(new appError("email required"), 400);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new appError("user does not exist", 404));

  if (user.friends.includes(req.user._id))
    return next(new appError("u are already friends", 400));

  user.friends.push(req.user._id);
  req.user.friends.push(user._id);
  user.save();
  req.user.save();

  res.status(201).json({
    status: "success",
    friends: user.friends,
    op: req.user,
  });
});
// testing
exports.getAllFriends = handleasync(async (req, res, next) => {
  const friends = await User.find({ _id: req.user.friends });

  res.json({
    status: "seccuss",
    friends,
  });
});
