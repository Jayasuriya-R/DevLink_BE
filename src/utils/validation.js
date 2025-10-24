const validator = require("validator");
const bcrypt = require("bcrypt")

const validateSingnupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("First Name should be 3 and 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};



module.exports = {validateSingnupData}