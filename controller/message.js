const mail = require('../services/mail')

function messageMail(req, res) {
  // const {email, }

  mail();

  res.json({ message: "mail sent" });
}

module.exports= messageMail;
