const express = require("express");
const Chat = require("../models/chat");

const messageRouter = express.Router();

messageRouter.post("/messages", async (req, res) => {
  try {
    const { participants } = req.body;
    console.log("participants", participants);

    if(participants.length !==2){
        throw new Error("Error in fetching the messages");
    }

    const messages = await Chat.findOne({
      participents: { $all: participants },
    }).sort({ createdAt: -1 });

    res.json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = messageRouter;
