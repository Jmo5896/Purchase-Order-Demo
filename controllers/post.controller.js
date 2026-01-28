const axios = require('axios')
const { nanoid } = require('nanoid')
const { User, Post, Status, MediaURL, Role, Sequelize } = require('../models')
const { Op } = Sequelize
const s3Folders = require('../routes/s3Folders')
// const fbUpload = require('facebook-api-video-upload')
const fbUpload = require('../middleware/fbVideo')
const { email } = require('../middleware')
const templates = require('../middleware/templates')

// ~`!@#$%^&*()_-=+\|[]}{'";:/?.>,<
const convertSymbols = (msg) => {
  const symbols = `% $ & + , / : ; = ? @ ' ’ \n – -`.split(' ')
  const codes = '%25 %24 %26 %2B %2C %2F %3A %3B %3D %3F %40 %27 %27 %0A %2D %2D'.split(
    ' '
  )
  let newMsg = msg
  for (let i = 0; i < symbols.length; i++) {
    if (newMsg.includes(symbols[i])) {
      newMsg = newMsg.split(symbols[i]).join(codes[i])
    }
  }
  return newMsg
}

const video_image = async (msg, media, pageToken, pageID, published) => {
  const fileType = media.split('.')
  if (fileType[fileType.length - 1] == 'mp4') {
    const stream = await axios({
      url: media,
      method: 'GET',
      responseType: 'stream'
    })
    const args = {
      token: pageToken, // with the permission to upload
      id: pageID, // The id represent {page_id || user_id || event_id || group_id}
      stream: stream.data, // path to the video,
      title: 'my video',
      description: msg
    }

    return fbUpload(args)

    // const url = `https://graph.facebook.com/${pageID}/videos?url=${media}&caption=${msg}&access_token=${pageToken}&published=${published}`
    // return axios.post(url)
  }
  // const media = `url=${media}`
  const url = `https://graph.facebook.com/${pageID}/photos?url=${media}&caption=${msg}&access_token=${pageToken}&published=${published}`
  return axios.post(url)
}

const sendToFB = async (msg, media, pageToken, pageID) => {
  try {
    msg = convertSymbols(msg)
    // console.log('==========================')
    // console.log(msg)
    // console.log('==========================')
    if (media.length === 1) {
      return video_image(msg, media[0].url, pageToken, pageID, true)
    }
    const album = []
    for (let i = 0; i < media.length; i++) {
      const response = await video_image(msg, media[i].url, pageToken, pageID, false)
      // console.log(`======================${i}`)
      // console.log(response.data ? response.data : response)
      // console.log(`======================${i}`)

      album.push(
        `&attached_media[${i}]={"media_fbid": "${
          response.data ? response.data.id : response.video_id
        }"}`
      )
      // response.data &&
      //   album.push(`&attached_media[${i}]={"media_fbid": "${response.data.id}"}`) // WORK AROUND FOR VIDEO IN ALBUM ISSUE!!!!!!!!!!!!!!!!!!!!!!!
    }
    const albumUrl = `https://graph.facebook.com/${pageID}/feed?message=${msg}&access_token=${pageToken}&published=true${album.join(
      ''
    )}`
    return axios.post(albumUrl)
  } catch (error) {
    console.log(error)
  }
}

const creatEmailList = (rolesAndUsers) => {
  const emails = []
  rolesAndUsers.forEach((r) => {
    r.Users.forEach((u) => {
      if (
        !u.email.includes('test.com') &&
        !u.email.includes('kickapps.org') &&
        !u.email.includes('kickapps.io')
      ) {
        emails.push(u.email)
      }
    })
  })

  return emails
}

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const posts = await Post.findAll()
      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json({ message: 'post get all route', error: err })
    }
  },
  fetchOne: async (req, res) => {
    try {
      const postId = req.params.id
      const post = await Post.findOne({
        where: {
          nanoid: postId
        }
      })
      res.status(200).json(post)
    } catch (err) {
      res.status(500).json({ message: 'post get one route', error: err })
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
  createPost: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          nanoid: req.userInfo.id
        }
      })

      const post = await Post.create({
        nanoid: nanoid(),
        post: req.body.post
      })

      const roles = await Role.findAll({
        where: {
          [Op.or]: [
            {
              id: 1
            },
            {
              id: 2
            }
          ]
        },
        include: [
          {
            model: User,
            attributes: ['email']
          }
        ]
      })
      const emails = creatEmailList(roles)
      // roles.forEach((r) => {
      //   r.Users.forEach((u) => {
      //     if (
      //       !u.email.includes('test.com') &&
      //       !u.email.includes('kickapps.org') &&
      //       !u.email.includes('kickapps.io')
      //     ) {
      //       emails.push(u.email)
      //     }
      //   })
      // })
      // let emails = []
      // for (const role of roles) {
      //   const u = await role.getUsers()
      //   emails.push(
      //     ...u.map(
      //       (obj) =>
      //         !obj.email.includes('test.com') &&
      //         !obj.email.includes('kickapps.org') &&
      //         !obj.email.includes('kickapps.io') &&
      //         obj.email
      //     )
      //   )
      // }
      // console.log('===========================')
      // console.log(emails)
      // // console.log(Object.getOwnPropertyNames(Role.prototype))
      // console.log('===========================')

      const mediaURLs = await MediaURL.bulkCreate(req.body.mediaURLs)
      const status = await Status.create()
      await post.setMediaURLs(mediaURLs)
      await post.setStatus(status)
      await post.setUser(user)

      for (const e of emails) {
        if (e) {
          email(e, templates.createPost, req.userInfo.username, req.userInfo.email)
        }
      }

      res.status(200).send('Post created successfully')
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: 'post create route', error: err })
    }
  },
  UpdatePostStatus: async ({ body, userInfo }, res) => {
    const postId = body.id
    try {
      const post = await Post.findOne({
        where: {
          nanoid: postId
        }
      })
      const postUser = await post.getUser()
      // console.log('==============================')
      // console.log(postUser.email)
      // console.log('==============================')
      const mediaURLs = await post.getMediaURLs()
      const status = await post.getStatus()
      // NOTE: if we want the persons who rejected the post this will be where that gets implemented
      if (body.status === 2) {
        const response = await status.update({
          reason: body.reason,
          currentState: body.status // rejected
        })
        email(
          postUser.email,
          templates.rejectedPost,
          { email: userInfo.email },
          body.reason
        )

        res.status(200).json(response.data)
      } else if (body.status === 1) {
        // approved
        const emailList = []
        for (const page of body.pages) {
          if (page === 'elementary') {
            sendToFB(
              post.post,
              mediaURLs,
              process.env.ELEMENTARY_PAGE_ACCESS_TOKEN,
              process.env.ELEMENTARY_PAGE_ID
            )
            emailList.push({
              page,
              // url: 'https://www.facebook.com/DCESLittleDogs/'
              url:
                'https://www.facebook.com/profile.php?id=' +
                process.env.ELEMENTARY_PAGE_ID
            })
          } else if (page === 'middle') {
            sendToFB(
              post.post,
              mediaURLs,
              process.env.MIDDLE_PAGE_ACCESS_TOKEN,
              process.env.MIDDLE_PAGE_ID
            )
            emailList.push({
              page,
              // url: 'https://www.facebook.com/Doddridge-County-Middle-School-1853022985005899/'
              url: 'https://www.facebook.com/profile.php?id=' + process.env.MIDDLE_PAGE_ID
            })
          } else if (page === 'high') {
            sendToFB(
              post.post,
              mediaURLs,
              process.env.HIGH_PAGE_ACCESS_TOKEN,
              process.env.HIGH_PAGE_ID
            )
            emailList.push({
              page,
              url: 'https://www.facebook.com/profile.php?id=' + process.env.HIGH_PAGE_ID
            })
          } else if (page === 'early learning') {
            sendToFB(
              post.post,
              mediaURLs,
              process.env.EARLY_LEARNING_ACCESS_TOKEN,
              process.env.EARLY_LEARNING_PAGE_ID
            )
            emailList.push({
              page,
              url:
                'https://www.facebook.com/profile.php?id=' +
                process.env.EARLY_LEARNING_PAGE_ID
            })
          } else {
            sendToFB(
              post.post,
              mediaURLs,
              process.env.SCHOOLS_PAGE_ACCESS_TOKEN,
              process.env.SCHOOLS_PAGE_ID
            )
            emailList.push({
              page,
              // url: 'https://www.facebook.com/DoddridgeCountySchools/'
              url:
                'https://www.facebook.com/profile.php?id=' + process.env.SCHOOLS_PAGE_ID
            })
          }
        }
        // approved
        email(postUser.email, templates.approvedPost, false, emailList)
        await status.update({
          reason: null,
          currentState: body.status
          // currentState: 2
        })
        // if (mediaURLs.length > 0) {
        //   s3Folders.deleteS3(s3Folders.postImages, mediaURLs[0].url)
        //   for (const url of mediaURLs) {
        //     await url.destroy()
        //   }
        // }
        // await status.destroy()
        // await post.destroy()

        res.status(200).json('posted to FB')
      } else {
        res.status(400).send('status isnt 1 or 2')
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'post facebook/change status route', error: err })
    }
  },
  UpdatePostDetails: async ({ body, userInfo }, res) => {
    const postId = body.id
    try {
      const post = await Post.findOne({
        where: {
          nanoid: postId
        }
      })
      const status = await post.getStatus()
      if (status.currentState !== 0) {
        const roles = await Role.findAll({
          where: {
            [Op.or]: [
              {
                id: 1
              },
              {
                id: 2
              }
            ]
          },
          include: [
            {
              model: User,
              attributes: ['email']
            }
          ]
        })
        const emails = creatEmailList(roles)
        // let emails = []
        // for (const role of roles) {
        //   const u = await role.getUsers()
        //   emails.push(...u.map((obj) => !obj.email.includes('test.com') && obj.email))
        // }
        for (const e of emails) {
          if (e) {
            email(e, templates.updateReject, userInfo.username, userInfo.email)
          }
        }
        status.update({
          currentState: 0 // pending
        })
      }
      if (body.oldImgs) {
        for (const obj of body.oldImgs) {
          try {
            s3Folders.deleteS3(s3Folders.postImages, obj.url)
            await MediaURL.destroy({
              where: obj
            })
          } catch (err) {
            console.log(err)
          }
        }
      }
      if (body.mediaURLs) {
        const mediaURLs = await MediaURL.bulkCreate(body.mediaURLs)
        await post.addMediaURLs(mediaURLs)
      }

      // const mediaURL = await MediaURL.findOne({
      //   where: {
      //     url: body.oldImg
      //   }
      // })
      // mediaURL.update({
      //   url: body.mediaURL
      // })
      if (body.post !== post.post) {
        await post.update({
          post: body.post
        })
      }
      res.status(200).send('Post updated successfully')
    } catch (err) {
      res.status(500).json({ message: 'post update status route', error: err })
    }
  },
  DeletePost: async ({ body }, res) => {
    const postId = body.id

    try {
      const post = await Post.findOne({
        where: {
          nanoid: postId
        }
      })
      const status = await post.getStatus()
      const mediaURLs = await post.getMediaURLs()
      if (mediaURLs.length > 0) {
        s3Folders.deleteS3(s3Folders.postImages, mediaURLs[0].url)
        for (const url of mediaURLs) {
          await url.destroy()
        }
      }
      await status.destroy()
      await post.destroy()
      res.status(200).send('Post deleted successfully')
    } catch (err) {
      res.status(500).json({ message: 'post delete route', error: err })
    }
  }
}
