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
//     res.json({
//     emailUser: process.env.EMAIL_USER,
//     passLength: process.env.EMAIL_PASS?.length,
//     passPreview: process.env.EMAIL_PASS?.substring(0, 4) + "****"
//   });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
//      res.json({
//     emailUser: process.env.EMAIL_USER,
//     passLength: process.env.EMAIL_PASS?.length,
//     passPreview: process.env.EMAIL_PASS?.substring(0, 4) + "****"
//   });
  }
});


module.exports = emailRouter;