const db = require('../models')

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  if (!req.body.username.trim()) {
    return res.status(422).send({
      message: 'Failed! No username provided!'
    })
  }
  if (!req.body.email.trim()) {
    return res.status(422).send({
      message: 'Failed! No email provided!'
    })
  }
  const userInstance = await db.User.findOne({
    where: {
      username: req.body.username.trim()
    }
  })
  if (userInstance) {
    return res.status(400).send({
      message: 'Failed! Username is already in use!'
    })
  }
  const email = await db.User.findOne({
    where: {
      email: req.body.email.trim()
    }
  })
  if (email) {
    return res.status(400).send({
      message: 'Failed! Email is already in use!'
    })
  }
  // call back function
  next()
}

module.exports = {
  checkDuplicateUsernameOrEmail
}
