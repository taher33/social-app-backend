const express = require("express");
const appError = require("./utils/appError");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const cors = require("cors");
const posts = require("./routes/posts");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const errHandler = require("./controller/errConrtoller");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();
// security headers against noSQL injection
app.use(helmet());
//data sanitazation
app.use(mongoSanitize());
//data sanitazation against xss
app.use(xss());
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));
// limit request for the api
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this ip , plz try again later",
});
app.use(limiter);
// body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// dublicate params
// app.use(
//   hpp({
//     whitelist: ["duration"],
//   })
// );
app.use(hpp());

app.use(bodyParser.json());

app.use(cors());
// static serving
app.use("/images", express.static("profile-imgss"));
//my routes
app.use("/posts", posts);
app.use("/users", users);
// not found
app.all("*", (req, res, next) => {
  next(new appError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(errHandler);

module.exports = app;
