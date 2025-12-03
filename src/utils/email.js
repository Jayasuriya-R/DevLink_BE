const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    const info = await resend.emails.send({
      from: process.env.EMAIL_FROM, 
      to,
      subject,
      html,
    });

    console.log("Email sent:", info);
    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
}

module.exports = sendEmail;
