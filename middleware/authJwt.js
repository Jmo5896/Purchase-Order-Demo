const jwt = require('jsonwebtoken')

const { User } = require('../models')

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token.accessToken
    const loggedIn = req.cookies.loggedIn.loggedIn || false

    // const token = req.headers['x-access-token']
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!'
      })
    }
    const decoded = jwt.verify(token, process.env.SECRET)
    req.userInfo = { ...decoded, loggedIn }
    next()
  } catch (err) {
    res.status(403).send({
      message: 'Unauthorized!'
    })
  }
}

const isStaff = async (req, res, next) => {
  try {
    // const userInstance = await User.findOne({ where: { nanoid: req.userId } })
    // const roleInstance = await userInstance.getRole()
    // const userInstance = await User.findOne({ where: { nanoid: req.userId } })
    const roleInstance = req.userInfo.role
    if (
      roleInstance === 'staff' ||
      roleInstance === 'director' ||
      roleInstance === 'admin' ||
      roleInstance === 'superAdmin'
    ) {
      // callback function
      return next()
    }
    res.status(403).send({
      message: 'Require Staff Role!'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const isDirector = async (req, res, next) => {
  try {
    const roleInstance = req.userInfo.role
    // const userInstance = await User.findOne({ where: { nanoid: req.userId } })
    // const roleInstance = await userInstance.getRole()

    if (
      roleInstance === 'director' ||
      roleInstance === 'admin' ||
      roleInstance === 'superAdmin'
    ) {
      // callback function
      return next()
    }
    res.status(403).send({
      message: 'Require Director Role!'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const isAdmin = async (req, res, next) => {
  try {
    // const userInstance = await User.findOne({ where: { nanoid: req.userId } })
    // const roleInstance = await userInstance.getRole()
    const roleInstance = req.userInfo.role

    if (roleInstance === 'admin' || roleInstance.name === 'superAdmin') {
      // callback function
      return next()
    }
    res.status(403).send({
      message: 'Require Admin Role!'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const isSuperAdmin = async (req, res, next) => {
  try {
    const userInstance = await User.findOne({ where: { nanoid: req.userId } })
    const roleInstance = await userInstance.getRole()

    if (roleInstance.name === 'superAdmin') {
      // callback function
      return next()
    }
    res.status(403).send({
      message: 'Require Super Admin Role!'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const authJwt = {
  verifyToken,
  isStaff,
  isAdmin,
  isSuperAdmin,
  isDirector
}

module.exports = authJwt
