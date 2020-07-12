const express = require("express");
const appError = require("./utils/appError");
const bodyParser = require("body-parser");
const Users = require("./routes/users");
const Signup = require("./routes/signup");
const cors = require("cors");
const Profile = require("./routes/profile");
const app = express();
const morgan = require("morgan");
const errHandler = require("./controller/errConrtoller");
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(cors());
app.use("/images", express.static("profile-imgss"));
//my routes
app.use("/users", Users);
app.use("/profile", Profile);
app.use("/signup", Signup);

app.all("*", (req, res, next) => {
  next(new appError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(errHandler);

module.exports = app;
