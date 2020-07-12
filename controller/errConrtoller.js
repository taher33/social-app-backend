const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    err,
    status: err.status,
    message: err.message,
  });
};
const sendErrProd = (err, res) => {
  if (err.isOperationel) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.json({
      message: "something wrong inside the code a bug",
    });
    console.error(err);
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "dev") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    sendErrProd(err, res);
  }
};
