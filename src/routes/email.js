const express = require('express');
const emailRouter = express.Router();
const sendEmail = require('../utils/email');

emailRouter.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    await sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    res.json({ success: true, msg: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = emailRouter;