const messageMail = require("../controller/message").default;
const express = require("express");
const mail = require("../services/mail");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post('/message', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'ahmedifeoluwa4@hotmail.com',
      pass: 'Harmedino142003',
    },
  });

  const mailOptions = {
    from: 'ahmedifeoluwa4@hotmail.com',
    to: 'ahmedifeoluwa4@gmail.com',
    subject: name, 
    text: message ,
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
