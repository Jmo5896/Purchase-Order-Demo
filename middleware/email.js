// const fs = require('fs')
const nodemailer = require('nodemailer')

module.exports = (email, template, username, body = null) => {
  const temp = template({ email, username }, body || null)
  const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'mail.kickapps.org',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NO_REPLY_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.NO_REPLY_EMAIL,
    to: email,
    subject: temp.subject,
    html: temp.body
  }
  if (temp.attachment) {
    mailOptions.attachment = temp.attachment
  }
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log(`Email sent: ${info.response}`)
    }
  })
}
