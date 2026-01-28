const { Invite, Role } = require('../models')
const { email } = require('../middleware')
const templates = require('../middleware/templates')

module.exports = {
  sendInvite: async ({ body }, res) => {
    try {
      const invite = await Invite.create({
        username: body.username,
        email: body.email
      })

      const role = await Role.findOne({
        where: {
          name: body.role
        }
      })
      await invite.setRole(role)
      email(body.email, templates.invite, body.username)

      res.status(200).send('Invite Sent!')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  resendInvite: async ({ body }, res) => {
    try {
      email(body.email, templates.invite, body.username)
      res.status(200).send('Invite resent')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  getInvites: async (req, res) => {
    try {
      const invites = await Invite.findAll()
      res.status(200).json(invites)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  deleteInvite: async ({ body }, res) => {
    try {
      const inviteId = body.id
      await Invite.destroy({
        where: {
          id: inviteId
        }
      })
      res.status(200).send('Invite deleted successfully')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  uploadMedia: async (req, res) => {
    let currentFile = req.file.location
    const v1 = 'dc-schools-s3.s3.amazonaws.com'
    const v2 = 'dc-schools-s3.s3.us-east-2.amazonaws.com'
    const newV = 'files.dcschools.us'
    if (currentFile.includes(v1)) {
      currentFile = currentFile.split(v1).join(newV)
    } else {
      currentFile = currentFile.split(v2).join(newV)
    }
    res.status(200).send(currentFile)
  },
  sendBugReport: async (req, res) => {
    try {
      email(process.env.BUG_EMAIL, templates.bugReport, req.userInfo.username, req.body)
      res.status(200).send('Bug Report Sent!')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}
