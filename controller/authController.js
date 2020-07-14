const User = require("../models/userM");
const { promisify } = require("util");
const handleasync = require("../utils/handleAsync");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const { checkPassword } = require("../utils/comparePass");
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = handleasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConf,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    result: newUser,
  });
});

exports.login = handleasync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("plz provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (
    user === null ||
    (await checkPassword(password, user.password)) === false
  ) {
    return next(new appError("email or password wrong", 400));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "succes",
    token,
  });
});

exports.protect = handleasync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new appError("plz login first", 401));
  }
  // jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
  //   console.log(result);
  // });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const frechUser = await User.findById(decoded.id);
  //needs testing
  if (!frechUser) {
    return next(new appError("user does not existe", 401));
  }

  if (!frechUser.checkPassChanged(token.iat)) {
    return next(new appError("plz login again u changed password", 401));
  }
  req.user = frechUser;
  next();
});
