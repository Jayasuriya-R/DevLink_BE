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
    }) .select("fromUserId toUserId")
     res.json({ message: " feed data", data :connectionRequest})
  

     const hideUserFromFeed = new Set();

     connectionRequest.forEach(req => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
     })

     console.log(hideUserFromFeed)

  } catch (err) {
    res.status(400).send("something went wrong"+err.message);
  }
});

module.exports = feedRouter;
