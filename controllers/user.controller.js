const axios = require('axios')
const {
  Status,
  User,
  Invite,
  Page,
  FormApproval,
  Approval,
  PriorityApproval,
  StaffDetails,
  Sequelize
} = require('../models')
const s3Folders = require('../routes/s3Folders')
const { Op } = Sequelize

// const findRole = async (models, nano = false) => {
//   const cleanData = []
//   const id = nano ? 'nanoid' : 'id'
//   for (const model of models) {
//     const role = await model.getRole()
//     cleanData.push({
//       email: model.email,
//       username: model.username,
//       role: role.name,
//       status: model.registered,
//       id: model[id]
//     })
//   }
//   return cleanData
// }
const dataCleaner = (models, nano = false) => {
  const cleanData = []
  const id = nano ? 'nanoid' : 'id'
  for (const model of models) {
    // const role = await model.getRole()
    let role
    if (model.RoleId == 1) {
      role = 'admin'
    } else if (model.RoleId == 2) {
      role = 'director'
    } else {
      role = 'staff'
    }
    cleanData.push({
      email: model.email,
      username: model.username,
      role: role,
      status: model.registered,
      id: model[id]
    })
  }
  return cleanData
}

module.exports = {
  allAccess: async (req, res) => {
    // const statuses = await Status.findAll({
    //   where: {
    //     currentState: 1 // 1 is all approved posts
    //   }
    // })
    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PAGE_ID}/feed?fields=full_picture,message&access_token=${process.env.PAGE_ACCESS_TOKEN}&limit=3`
    try {
      const response = await axios.get(url)

      // const data = []
      // for (const status of statuses) {
      //   const post = await status.getPost()
      //   data.push(post)
      // }
      res.status(200).json(response.data)
    } catch (err) {
      // console.log('allAccess')
      console.log(err)
      res.sendStatus(500)
    }
  },
  staffBoard: async (req, res) => {
    // list of post history (all THEIR posts, approved, pending, rejected)
    try {
      const currentUser = await User.findOne({
        where: {
          nanoid: req.userInfo.id
        }
      })
      const posts = await currentUser.getPosts()
      const cleanData = []
      for (const post of posts) {
        const status = await post.getStatus()
        const media = await post.getMediaURLs()

        const expiresIn = 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
        if (
          post.updatedAt > new Date(Date.now() - expiresIn) ||
          status.currentState === 0
        ) {
          cleanData.push({
            id: post.nanoid,
            post: post.post,
            mediaURLs: media.map((obj) => obj.url),
            author: currentUser.username,
            status: status.currentState,
            createdAt: post.createdAt,
            reason: status.reason
          })
        } else {
          for (const url of media) {
            s3Folders.deleteS3(s3Folders.postImages, url.url)
            url.destroy()
          }
          status.destroy()
          post.destroy()
        }
      }
      res.status(200).json(cleanData)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'staff board err', error: err })
    }
  },
  directorBoard: async (req, res) => {
    // list of post history (ALL posts, approved, pending, rejected)
    // console.log('============================')
    // console.log(req.params.status)
    // console.log('============================')

    try {
      const statuses = await Status.findAll({
        where: {
          // currentState: 0 // pending
          currentState: req.params.status
        }
      })
      const cleanData = []
      for (const status of statuses) {
        const post = await status.getPost()
        const author = await post.getUser()
        const authorDetails = await author.getStaffDetail()
        const media = await post.getMediaURLs()

        const expiresIn = 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
        if (
          post.updatedAt > new Date(Date.now() - expiresIn) ||
          status.currentState === 0
        ) {
          cleanData.push({
            id: post.nanoid,
            post: post.post,
            mediaURLs: media.map((obj) => obj.url),
            author: author.username,
            authorDetails: {
              avatarURL: authorDetails.avatarURL,
              backgroundURL: authorDetails.backgroundURL,
              courses_role: authorDetails.courses_role,
              email: authorDetails.email,
              ext: authorDetails.ext,
              facility: authorDetails.facility,
              firstName: authorDetails.firstName,
              lastName: authorDetails.lastName,
              phone: authorDetails.phone,
              prefix: authorDetails.prefix,
              subject_grade: authorDetails.subject_grade,
              title: authorDetails.title
            },
            // avatar: authorDetails.avatarURL,
            status: status.currentState,
            createdAt: post.createdAt,
            reason: status.reason
          })

          // cleanData.push({
          //   id: post.nanoid,
          //   post: post.post,
          //   mediaURLs: media.map((obj) => obj.url),
          //   author: currentUser.username,
          //   status: status.currentState,
          //   createdAt: post.createdAt,
          //   reason: status.reason
          // })
        } else {
          for (const url of media) {
            s3Folders.deleteS3(s3Folders.postImages, url.url)
            url.destroy()
          }
          status.destroy()
          post.destroy()
        }
      }

      res.status(200).json(cleanData)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'director board err', error: err })
    }
  },
  adminBoard: async (req, res) => {
    const userId = req.userInfo.id
    try {
      console.log()
      const users = await User.findAll({
        where: {
          nanoid: {
            [Op.not]: userId
          }
        }
      })
      const invitees = await Invite.findAll()
      const cleanInvites = dataCleaner(invitees)
      const cleanUsers = dataCleaner(users, true)
      const staffDetails = await StaffDetails.findAll({
        attributes: ['firstName', 'lastName', 'email']
      })
      const poFlow = await FormApproval.findAll({
        attributes: [
          ['nanoid', 'id'],
          'requisitionId',
          'locationCode',
          'switch',
          'active',
          'address'
        ],
        include: [
          {
            model: Approval,
            attributes: [['nanoid', 'id'], 'email', 'order', 'switch']
          }
        ]
      })

      const priorityApprovals = await PriorityApproval.findAll({
        attributes: [['nanoid', 'id'], 'email', 'order']
      })

      res.status(200).json({
        invitees: cleanInvites,
        users: cleanUsers,
        poFlow,
        priorityApprovals,
        staffDetails
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'admin board err', error: err })
    }
  },
  superAdminBoard: async (req, res) => {
    // view ALL users
    const users = await User.findAll()
    res.status(200).send(users)
  },
  deleteUser: async (req, res) => {
    const userId = req.body.id
    try {
      const user = await User.findOne({
        where: {
          nanoid: userId
        }
      })
      const details = await user.getStaffDetail()

      if (details) {
        if (details.avatarURL) {
          s3Folders.deleteS3(s3Folders.avatars, details.avatarURL)
        }
        if (details.backgroundURL) {
          s3Folders.deleteS3(s3Folders.userBackgrounds, details.backgroundURL)
        }
        details.destroy()
      }

      Invite.destroy({
        where: {
          username: user.username,
          email: user.email
        }
      })
      user.destroy()

      res.json('Successfully deleted user and Details')
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'delete user error', error: err })
    }
  },
  addPermission: async (req, res) => {
    try {
      const currentUser = await User.findOne({
        where: {
          nanoid: req.body.id
        }
      })
      const cmsPages = await Page.findAll({
        where: {
          cms: true
        }
      })
      let removePages = req.body.pages.original.filter(
        (page) => !req.body.pages.updated.includes(page)
      )
      let addPages = req.body.pages.updated.filter(
        (page) => !req.body.pages.original.includes(page)
      )
      if (addPages.length > 0) {
        addPages = cmsPages.filter((obj) => addPages.includes(obj.title))
        await currentUser.addPages(addPages)
      }
      if (removePages.length > 0) {
        removePages = cmsPages.filter((obj) => removePages.includes(obj.title))
        await currentUser.removePages(removePages)
      }

      // console.log('========================')
      // console.log(Object.getOwnPropertyNames(User.prototype))
      // console.log(req.body)
      // console.log(removePages)
      // console.log(addPages)
      // console.log('========================')
      res.status(200).send('Permission added!')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  getPages: async (req, res) => {
    try {
      const currentUser = await User.findOne({ where: req.body })
      let userPages = await currentUser.getPages()
      userPages = userPages.map((obj) => obj.title)
      // console.log('========================')
      // console.log(Object.getOwnPropertyNames(User.prototype))
      // console.log(userPages)
      // console.log('========================')
      const cmsPages = await Page.findAll({
        attributes: ['title', 'facility'],
        where: {
          cms: true
        }
      })
      const sendData = { userPages, pages: {} }
      for (const obj of cmsPages) {
        if (sendData.pages[obj.facility]) {
          sendData.pages[obj.facility].push(obj.title)
        } else {
          sendData.pages[obj.facility] = [obj.title]
        }
      }

      res.status(200).json(sendData)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}
