const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
  port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SANJAI DEV AUTH APP"<sanjay235@gmail.com>`,
    to: option.email,
    subject: option.subject,
    html: option.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
