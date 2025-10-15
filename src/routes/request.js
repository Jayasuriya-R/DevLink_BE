const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {ConnectionRequest} = require("../models/connectionRequest")

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

    const allowedStatus = ["ignored","interested"]
    const isAllowedStatus = allowedStatus.includes(status)
      if(!isAllowedStatus){
        throw new Error("Invalid status ")
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:"connectiom successfull",
        data,
      })
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = requestRouter;
