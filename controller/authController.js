const crypto = require("crypto");
const User = require("../models/userM");
const { promisify } = require("util");
const handleasync = require("../utils/handleAsync");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const { checkPassword } = require("../utils/comparePass");
const sendMail = require("../utils/email");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now + process.env.JWT_COOKIE_IN * 3600),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === "prod") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signUp = handleasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConf,
    // role: req.body.role,
  });

  createSendToken(newUser, 200, res);
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

  createSendToken(user, 200, res);
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

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError("you are not authorized", 403));
    }
    next();
  };
};

exports.forgotPass = handleasync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("user not found", 404));
  }

  const resetToken = user.resetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/signup/resetPassword/${resetToken}`;

  const message = `forgot your passwordd ? change your password here : ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      message,
      subject: "this is valide for only 30 min",
    });
    res.status(200).json({
      status: "success",
      message: "verify your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTime = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError("there was an err sending the email, try again later")
    );
  }
});

exports.resetPassword = handleasync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTime: { $gt: Date.now() },
  });
  if (!user) {
    return next(new appError("false token or expired token", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConf;
  user.passwordResetToken = undefined;
  user.passwordResetTime = undefined;
  await user.save();

  createSendToken(user, 201, res);
});

exports.updatePassword = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select("+password");
  console.log(user);
  if (!(await checkPassword(req.body.password, user.password))) {
    return next(new appError("wrong password , plz try again "));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConf;
  await user.save();

  createSendToken(user, 201, res);
};
