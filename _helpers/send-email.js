const nodemailer = require('nodemailer');
const config = require('config');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.get("emailFrom") }) {
    const transporter = nodemailer.createTransport(config.get("smtpOptions"));
    await transporter.sendMail({ from, to, subject, html });
}