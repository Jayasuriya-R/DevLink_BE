const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

const userRouter = express.Router();

const Fields_Required = [
  "firstName",
  "emailId",
  "lastName",
  "photoUrl",
  "skills",
  "age",
  "gender",
  "shortDescription",
];

userRouter.get("/user/requests/received", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: currentUser._id,
      status: "interested",
    }).populate("fromUserId", Fields_Required);

    res.json({ message: "data fetched successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

userRouter.get("/user/connection", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: currentUser._id, status: "accepted" },
        { toUserId: currentUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", Fields_Required)
      .populate("toUserId", Fields_Required);

    const data = connectionRequest.map((data) =>
      data.fromUserId._id.toString() === currentUser._id.toString()
        ? data.toUserId
        : data.fromUserId
    );

    res.json({ message: "data fetched successfully", data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = userRouter;
