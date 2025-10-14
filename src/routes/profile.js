const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    const notAllowedUpdates = ["emailId", "age", "password"];
    const isNotAllowed = Object.keys(data).some((k) =>
      notAllowedUpdates.includes(k)
    );
    if (isNotAllowed) {
      throw new Error(`update not allowed for ${notAllowedUpdates.join(",")}`);
    }

    const updatedData = await User.findByIdAndUpdate(user?._id, data, {
      new: true,
      runValidators: true,
    });
    res.json({
      message: user.firstName + " Updated sucessfully",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Enter a strong password");
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const updatedData = await User.findByIdAndUpdate(
        user?._id,
        { password: passwordHash },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json({
        message: user.firstName + " password Updated sucessfully",
        data: updatedData,
      });
    }else{
      throw new Error("Invalid password")
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
