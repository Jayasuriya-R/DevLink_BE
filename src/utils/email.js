const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"DEV_LINK" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", info.messageId);
    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
}

module.exports = sendEmail;