const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;


      const allowedStatus = ["uninterested", "interested"];
      const isAllowedStatus = allowedStatus.includes(status);
      if (!isAllowedStatus) {
        throw new Error("Invalid status ");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection Request Already Exists" });
      }

      const verifyToUser = await User.findOne({ _id: toUserId });
      if (!verifyToUser) {
        return res.status(404).json({ message: "Requested user not found" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${verifyToUser.firstName} `,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = requestRouter;
