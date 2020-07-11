const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status("200").json({
    msg: "this api works",
  });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  res.status("200").json({
    msg: "this api works",
  });
});

module.exports = router;
