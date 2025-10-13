const express = require("express")
const {verifyToken} = require("../middleware/auth")

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", verifyToken, (req, res) => {
  const user = req.user;
  res.send("Connection request send by " + user.firstName);
});


module.exports = requestRouter