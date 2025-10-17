const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");
const feedRouter = express.Router();

feedRouter.get("/feed", verifyToken, async (req, res) => {
  //own profile, connections, ignored, already sent connection request

  const Fields_Required = [
  "firstName",
  "lastName",
  "photoUrl",
  "skills",
  "age",
  "gender",
];
  try {
    const currentUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: currentUser._id }, { toUserId: currentUser._id }],
    }) .populate("fromUserId", Fields_Required)
      .populate("toUserId", Fields_Required);
     res.json({ message: " feed data", data :connectionRequest})
    // const data = await User.find(
    //   { _id: { $ne: currentUser._id } },
    //   {
    //     firstName: 1,
    //     lastName: 1,
    //     photoUrl: 1,
    //     skills: 1,
    //     age: 1,
    //     gender: 1,
    //     shortDescription: 1,
    //     _id: 1,
    //   }
    // );
    // res.json({ message: " feed data", data });
  } catch (err) {
    res.status(400).send("something went wrong"+err.message);
  }
});

module.exports = feedRouter;
