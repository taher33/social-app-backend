const User = require("../models/userM");
const appError = require("../utils/appError");
const handleasync = require("../utils/handleAsync");
const { findByIdAndUpdate } = require("../models/userM");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imgs/users");
  },
  filename: (req, file, cb) => {
    //geting the extention : jpeg and such
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("not an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImgs = upload.fields([
  { name: "profileImg", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);

const filterObj = (obj, ...allowed) => {
  const filterdObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) filterdObj[el] = obj[el];
  });
  return filterdObj;
};

exports.updateMe = handleasync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConf) {
    return next(new appError("this is not for password updates", 400));
  }
  const filterdBody = filterObj(req.body, "name", "email");

  if (req.files) filterdBody.profileImg = req.files.profileImg[0].filename;
  // console.log(filterdBody);
  const user = await User.findByIdAndUpdate(req.user._id, filterdBody, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    status: "success",
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

exports.follow = handleasync(async (req, res, next) => {
  if (!req.body.email) return next(new appError("email required"), 400);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new appError("user does not exist", 404));
  if (req.user.People_I_follow.includes(user._id)) {
    //removing user id from clients following list
    req.user.People_I_follow.splice(
      req.user.People_I_follow.indexOf(user._id),
      1
    );
    //removing client id from users followers list
    user.People_that_follow_me.splice(
      user.People_that_follow_me.indexOf(req.user._id),
      1
    );
    user.save({ validateBeforeSave: false });
    req.user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "success",
    });
  }

  user.People_that_follow_me.push(req.user._id);
  req.user.People_I_follow.push(user._id);
  user.save({ validateBeforeSave: false });
  req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
  });
});
// did not add the end point for it yet
exports.Unfriend = handleasync(async (req, res, next) => {
  if (!req.body.id) return next(new appError("plz provide an id", 400));

  if (!req.user.friends.includes(req.body.id))
    return next(new appError("user was not found", 404));

  // removing the id from the friends array
  const index = req.user.friends.indexOf(req.body.id);
  req.user.friends.splice(index, 1);

  res.status(204).json({
    status: "success",
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

exports.getOneUser = handleasync(async (req, res, next) => {
  let id = req.params.userId;
  console.log(id);
  const user = await User.findById(id);
  if (!user) {
    return next(new appError("user does nnot exist", 404));
  }
  res.json({
    status: "success",
    user,
  });
});

exports.delete_everything = async (req, res, next) => {
  await User.deleteMany();
  res.json({
    status: "success",
  });
};
