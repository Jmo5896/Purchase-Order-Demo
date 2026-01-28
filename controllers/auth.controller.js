const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { nanoid } = require('nanoid')
const { User, Role, Invite, StaffDetails } = require('../models')
const { email } = require('../middleware')
const templates = require('../middleware/templates')

const signup = async (req, res) => {
  const invitee = await Invite.findOne({
    where: {
      username: req.body.username,
      email: req.body.email
    }
  })
  const details = await StaffDetails.findOne({
    where: {
      email: req.body.email,
      active: true
    }
  })
  if (invitee && details) {
    try {
      const role = await invitee.getRole()
      const user = await User.create({
        // nanoid: nanoid(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      if (role) {
        await user.setRole(role)
        res.status(200).json({
          id: user.nanoid
        })
      } else {
        const role = await Role.findOne({
          where: {
            name: 'staff'
          }
        })
        // set role to staff id number if undeclared
        await user.setRole(role)

        await invitee.update({
          registered: true
        })
        res.status(200).json({
          id: user.nanoid
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  } else {
    res.status(403).send({ message: 'You are not authorized to sign up.' })
  }
}

const signin = async (req, res) => {
  const userInstance = await User.findOne({
    where: {
      username: req.body.username
    }
  })
  if (!userInstance) {
    return res.status(404).send({
      accessToken: null,
      message: 'Invalid username or password.'
    })
  }
  const details = await userInstance.getStaffDetail({
    where: {
      active: true
    }
  })
  if (details) {
    const passwordIsValid = bcrypt.compareSync(req.body.password, userInstance.password)
    if (!passwordIsValid) {
      return res.status(404).send({
        accessToken: null,
        message: 'Invalid username or password.'
      })
    }
    const role = await userInstance.getRole()
    const token = jwt.sign(
      {
        id: userInstance.nanoid,
        email: userInstance.email,
        username: userInstance.username,
        role: role.name
      },
      process.env.SECRET,
      {
        expiresIn: 43200 // 12 hours
      }
    )

    res.cookie(
      'token',
      {
        accessToken: token
      },
      {
        httpOnly: true,
        sameSite: 'strict',
        // overwrite: true,
        path: '/',
        domain:
          process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : 'localhost',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 60 * 60 * 1000 * 12 // expires in 12 hours
      }
    )

    res.cookie(
      'loggedIn',
      {
        loggedIn: true
      },
      {
        // httpOnly: true,
        // sameSite: 'strict',
        // overwrite: true,
        path: '/',
        // domain:
        //   process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : 'localhost',
        // secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 60 * 60 * 1000 * 12 // expires in 12 hours
      }
    )

    res.status(200).send('logged in')
  } else {
    res.status(403).send({
      accessToken: null,
      message: 'You have been temporarily banned, please talk to your admin for details.'
    })
  }
}

const logOut = async (req, res) => {
  // console.log('******************')
  // console.log(res)
  // console.log('******************')
  // res.cookie('token', '', {
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   // path: '/',
  //   // domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   maxAge: 0
  // })
  // 'loggedIn',
  // {
  //   LoggedIn: true
  // },
  // {
  //   // httpOnly: true,
  //   sameSite: 'strict',
  //   // overwrite: true,
  //   path: '/',
  //   domain:
  //     process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : 'localhost',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   maxAge: 60 * 60 * 1000 * 12 // expires in 12 hours
  // }
  res.clearCookie('loggedIn', '', {
    // httpOnly: true,
    // sameSite: 'strict',
    // path: '/',
    // domain:
    //   process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : 'localhost',
    // secure: process.env.NODE_ENV === 'production' ? true : false
    // maxAge: 0
  })
  res
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : 'localhost',
      secure: process.env.NODE_ENV === 'production' ? true : false
    })
    .end()

  // res.status(200).send('cleared?')
}

const getUser = (req, res) => {
  try {
    // console.log('===================')
    // console.log(req.userInfo)
    // console.log('===================')
    const currentUser = req.userInfo
    res.status(200).json(currentUser)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'current user issues' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        nanoid: req.userInfo.id
      }
    })
    const passwordIsValid = bcrypt.compareSync(
      req.body.old_password,
      currentUser.password
    )
    if (!passwordIsValid || req.body.new_password !== req.body.verify_new_password) {
      return res.status(404).send({
        accessToken: null,
        message: 'Invalid username or password.'
      })
    }
    await currentUser.update({ password: req.body.new_password })
    // await currentUser.update({ password: 'password2021' })

    res.status(200).json(currentUser)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'password reset issue' })
  }
}

const checkPassword = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        nanoid: req.userInfo.id
      }
    })
    const passwordIsValid = bcrypt.compareSync(req.body.password, currentUser.password)
    if (!passwordIsValid) {
      return res.status(403).send('Password is incorrect.')
    }
    // await currentUser.update({ password: req.body.new_password })
    // await currentUser.update({ password: 'password2021' })

    res.status(200).send('Passwords match')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'password reset issue' })
  }
}

const sendUsername = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!currentUser) {
      return res.status(403).send('No such email')
    }
    email(currentUser.email, templates.sendUsername, currentUser.username)
    res.status(200).send('Username has been sent to email!')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'send username issue' })
  }
}

const sendPassword = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!currentUser) {
      return res.status(403).send('No such email')
    }
    const password = nanoid()

    await currentUser.update({ password })
    email(currentUser.email, templates.sendPassword, currentUser.username, { password })
    res.status(200).send('Username has been sent to email!')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'password send password issue' })
  }
}

module.exports = {
  signin,
  signup,
  getUser,
  logOut,
  resetPassword,
  checkPassword,
  sendUsername,
  sendPassword
}
