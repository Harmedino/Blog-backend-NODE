"use strict";
const nodemailer = require("nodemailer");

const mail = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",

    user: {
      user: "ahmedifeoluwa4@hotmail.com",
      password: "Harmedino142003",
    },
  });

  const mailOptions = {
    from: "ahmedifeoluwa4@hotmail.com",
    to: "ahmedifeouwa4@gmail.com",
    subject: "thank for contacting me",
    text: "hello",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // callback(error)
    } else {
      console.log("Email sent");
      let response = "Email sent successful ";
      // callback(response)
    }
  });
};
