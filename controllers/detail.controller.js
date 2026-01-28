const { User, StaffDetails } = require('../models')
const s3Folders = require('../routes/s3Folders')

module.exports = {
  fetchOne: async (req, res) => {
    try {
      // const userId = req.userInfo.id
      // const userInstance = await User.findOne({
      //   where: {
      //     nanoid: userId
      //   }
      // })
      // const sendData = {
      //   avatarURL: '',
      //   backgroundURL: '',
      //   bio: '',
      //   firstName: '',
      //   lastName: '',
      //   title: '',
      //   email: ''
      // }
      const staffInstance = await StaffDetails.findOne({
        attributes: [
          'prefix',
          'firstName',
          'lastName',
          'avatarURL',
          'backgroundURL',
          'email',
          'title',
          'facility',
          'subject_grade',
          'courses_role',
          'phone',
          'ext'
        ],
        where: {
          email: req.userInfo.email
        }
      })
      // if (staffInstance) {
      //   sendData.firstName = staffInstance.firstName
      //   sendData.lastName = staffInstance.lastName
      //   sendData.email = staffInstance.email
      // } else {
      //   sendData.firstName = userInstance.username
      //   sendData.email = userInstance.email
      // }

      // const {
      //   avatarURL,
      //   backgroundURL,
      //   bio,
      //   // firstName,
      //   // grade,
      //   // lastName,
      //   // subject,
      //   title
      // } = await userInstance.getUserDetail()
      // sendData.avatarURL = avatarURL
      // sendData.backgroundURL = backgroundURL
      // sendData.bio = bio
      // sendData.title = title

      res.status(200).json(staffInstance)
    } catch (err) {
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
  create: async (req, res) => {
    try {
      const userInstance = await User.findOne({
        where: {
          nanoid: req.body.id
        }
      })

      // console.log(Object.getOwnPropertyNames(User.prototype)) // quick lookup for class methods
      // const details = await UserDetails.create()
      const details = await StaffDetails.findOne({
        where: {
          email: userInstance.email
        }
      })

      if (details) {
        await userInstance.setStaffDetail(details)
        res.status(200).send('user data has been created')
      } else {
        res.status(403).send('not in main database')
      }

      // details.setUser(userInstance)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  createStaff: async (req, res) => {
    try {
      const data = { ...req.body }
      for (const k in data) {
        if (!data[k]) {
          data[k] = null
        }
      }
      // console.log('=====================')
      // console.log(req.body)
      // console.log('=====================')

      await StaffDetails.create(data)

      res.status(200).json({ message: 'Staffer created!' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'an error has occured' })
    }
  },
  update: async (req, res) => {
    try {
      // const userInstance = await User.findOne({
      //   where: {
      //     nanoid: req.userInfo.id
      //   }
      // })
      let details
      if (req.body.other) {
        details = await StaffDetails.findOne({
          where: {
            email: req.body.checkEmail
          }
        })
      } else {
        details = await StaffDetails.findOne({
          where: {
            email: req.userInfo.email
          }
        })
      }
      if (req.body.oldavatarURL) {
        s3Folders.deleteS3(s3Folders.avatars, req.body.oldavatarURL)
      }
      if (req.body.oldbackgroundURL) {
        s3Folders.deleteS3(s3Folders.userBackgrounds, req.body.oldbackgroundURL)
      }
      const updateData = {}
      if (req.body.data) {
        for (const k in req.body.data) {
          if (details[k] !== req.body.data[k]) {
            updateData[k] = req.body.data[k] === '' ? null : req.body.data[k]
          }
        }
      } else {
        for (const k in req.body) {
          if (details[k] !== req.body[k]) {
            updateData[k] = req.body[k] === '' ? null : req.body[k]
          }
        }
      }
      // console.log('=======================')
      // console.log(updateData)
      // console.log('=======================')
      if (Object.keys(updateData).length > 0) {
        await details.update(updateData)
      }
      res.status(200).send('user data has been updated')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  delete: async (req, res) => {
    try {
      const currentStaffer = await StaffDetails.findOne({
        where: req.body
      })
      // console.log('=======================')
      // console.log(currentStaffer)
      // console.log('=======================')
      if (currentStaffer.avatarURL) {
        s3Folders.deleteS3(s3Folders.avatars, currentStaffer.avatarURL)
      }
      if (currentStaffer.backgroundURL) {
        s3Folders.deleteS3(s3Folders.userBackgrounds, currentStaffer.backgroundURL)
      }
      await currentStaffer.destroy()

      res.status(200).send('Staffer has been deleted')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}
