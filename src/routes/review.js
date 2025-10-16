const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { ConnectionRequest } = require("../models/connectionRequest");


const reviewRouter = express.Router();

reviewRouter.patch(
  "/request/review/:status/:requestId",
  verifyToken,
  async (req, res) => {
    try {
      const currentUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      const isAllowedStatus = allowedStatus.includes(status);
      if (!isAllowedStatus) {
        throw new Error("Invalid status ");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: currentUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `${currentUser.firstName} is ${status} the request`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = reviewRouter;
