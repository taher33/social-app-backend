const express = require("express");
const bodyParser = require("body-parser");
const Users = require("./routes/users");
const Signup = require("./routes/signup");
const cors = require("cors");
const Profile = require("./routes/profile");
const app = express();
const morgan = require("morgan");

// if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(cors());
//my routes
app.use("/users", Users);
app.use("/profile", Profile);
app.use("/signup", Signup);

app.use((req, res, next) => {
  const err = new Error("not found ");
  err.status = 404;
  next(err);
});

module.exports = app;
