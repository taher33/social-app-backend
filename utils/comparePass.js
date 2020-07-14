const bcrypt = require("bcryptjs");

exports.checkPassword = async (candidatePass, userPass) => {
  const bool = await bcrypt.compare(candidatePass, userPass);
  console.log(bool);
  return bool;
};
