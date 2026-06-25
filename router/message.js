const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post('/message', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: name,
    text: message,
    replyTo: email,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Email sending failed' });
    } else {
      console.log('Email sent');
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});


module.exports = router;
