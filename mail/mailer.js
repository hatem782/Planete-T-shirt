//import the nodeMailer
const nodemailer = require("nodemailer");

const sendMail = async (email, content) => {
  let user = process.env.USERMAIL;
  let pass = process.env.APP_PASSWORD;
  subject = "reset password";
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  let mailDetails = {
    from: user,
    to: email,
    subject: subject,
    html: content,
  };

  const result = await mailTransporter.sendMail(mailDetails);
  return result;
};

module.exports = {
  sendMail,
};
