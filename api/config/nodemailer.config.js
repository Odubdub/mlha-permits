const nodemailer = require('nodemailer');
const config = require('../config/config');

const port = config.mailer.port;
const host = config.mailer.host;
const user = config.mailer.user;
const pass = config.mailer.pass;

const transporter = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

const sendregistrationTokenEmail = (recepientEmail, recepientName, token) => {
  transporter.sendMail({
    from: config.mailer.user,
    to: recepientEmail,
    subject: "Please confirm your account",
    html: `<h1 style='color: red;'>Email Confirmation</h1>
        <h4>Hello ${recepientName}</h4>
        <p>Thank you for subscribing. To complete your account regitration please click the following link</p>
        <a href=${config.admin_client_url}/auth/set-password?token=${token}> Click here</a>
        </div>`,
  }).catch(err => console.log(err))
}

module.exports = sendregistrationTokenEmail;