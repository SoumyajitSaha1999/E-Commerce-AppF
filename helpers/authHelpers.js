const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log("Error Occurred", error);
  }
};

exports.comparePassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}