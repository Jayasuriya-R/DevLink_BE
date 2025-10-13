const express = require("express")
const {verifyToken} = require("../middleware/auth")

const profileRouter = express.Router();


profileRouter.get("/profile", verifyToken, async (req, res) => {
  res.send(req.user);
});


module.exports = profileRouter