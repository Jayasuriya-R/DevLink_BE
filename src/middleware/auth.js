const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const loginAuth = async (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      next();
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const guestAuth = (req, res, next) => {
  const isAuthenticated = "xyz" == "xyz";
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

module.exports = { loginAuth, guestAuth };
