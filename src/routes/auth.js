const express = require("express");
const { User } = require("../models/user");
const authRouter = express.Router();
const { validateSingnupData } = require("../utils/validation");
const { loginAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSingnupData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", loginAuth, async (req, res) => {
  const user = req.user;
  const token = await user.getJWT();
  // console.log(token);

  //add token to cookie
  res.cookie("token", token, {
    expires: new Date(Date.now() + 1 * 3600000),
  });
  res.json({message:"login suceessfull"});
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({message:"logout sucessfull"})
});

module.exports = authRouter;
