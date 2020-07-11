const express = require("express");
const router = express.Router();
const User = require("../models/userM");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
    res.status(403).json({
        msg2: "note : from signup route",
        err,
      });
    });
});

router.post("/", (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((result) => {
      res.status(200).json({
        msg: "user succesfuly signed up ",
        msg2: "note : from signup route",
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg2: "note : from signup route",
        err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then((user) => {
      res.status(200).json({
        msg: "user deleted",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
