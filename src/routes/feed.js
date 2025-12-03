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
    "shortDescription",
    "emailId"
  ];
  try {
    const currentUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit > 50 ? 50 : limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: currentUser._id }, { toUserId: currentUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      _id: {
        $nin: Array.from(hideUserFromFeed),
        $ne: currentUser._id,
      },
    })
      .select(Fields_Required)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ message: " feed data", data: userFeed });
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

module.exports = feedRouter;
