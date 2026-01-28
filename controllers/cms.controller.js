const db = require('../models')
const { nanoid } = require('nanoid')
const s3Folders = require('../routes/s3Folders')

module.exports = {
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

  fetchPage: async (req, res) => {
    try {
      const currentPage = await db.Page.findOne({ where: { title: req.body.title } })
      const main = []
      const side = []
      for (const t of req.body.templates) {
        const funcName = `get${t}s`
        // console.log('=========================')
        // console.log(funcName)
        // console.log('=========================')
        const currentTemp = await currentPage[funcName]({})
        currentTemp.forEach((element) => {
          const data = {
            temp: t,
            props: element.dataValues
          }
          // delete data.props.id
          delete data.props.PageId
          delete data.props.createdAt
          delete data.props.updatedAt
          if (data.props.main) {
            main.push(data)
          } else {
            side.push(data)
          }
        })
        // myArr.push(currentTemp)
      }
      const sortTemps = (a, b) => a.props.order_index - b.props.order_index
      main.sort(sortTemps)
      side.sort(sortTemps)

      res.status(200).json({ main, side })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  create: async (req, res) => {
    try {
      const currentPage = await db.Page.findOne({ where: { title: req.body.page } })
      const newTemp = await db[req.body.temp].create(req.body.props)
      // console.log('=====================================')
      // console.log(req.userInfo.username)
      // console.log(req.body.temp)
      // console.log('=====================================')

      //CREATES LOG AND ATTACHES IT TO THE CURRENT PAGE
      const newLog = await db.CmsLog.create({
        nanoid: nanoid(),
        template: req.body.temp,
        type: 'create',
        username: req.userInfo.username
      })
      currentPage['addCmsLogs'](newLog)

      await currentPage[`add${req.body.temp}s`](newTemp)

      // UPDATES THE PAGE SO WE CAN SEE WHEN IT WAS LAST ALTERED
      currentPage.changed('updatedAt', true)
      currentPage.update({ updatedAt: new Date() })

      res.status(200).json({ message: 'create route' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  update: async (req, res) => {
    try {
      const currentPage = await db.Page.findOne({ where: { title: req.body.page } })
      const currentTemp = await currentPage[`get${req.body.temp}s`]({
        where: {
          main: req.body.main,
          order_index: req.body.order_index
        }
      })
      if (req.body.props.btnURL === 'null') {
        req.body.props.btnURL = null
      }
      if (req.body.oldurl) {
        s3Folders.deleteS3(s3Folders.cmsImages, req.body.oldurl)
      }
      if (req.body.oldbtnURL) {
        s3Folders.deleteS3(s3Folders.cmsImages, req.body.oldbtnURL)
      }

      //CREATES LOG AND ATTACHES IT TO THE CURRENT PAGE
      const newLog = await db.CmsLog.create({
        nanoid: nanoid(),
        template: req.body.temp,
        type: 'update',
        username: req.userInfo.username
      })
      currentPage['addCmsLogs'](newLog)

      await currentTemp[0].update(req.body.props)

      // UPDATES THE PAGE SO WE CAN SEE WHEN IT WAS LAST ALTERED
      currentPage.changed('updatedAt', true)
      currentPage.update({ updatedAt: new Date() })

      res.status(200).json({ message: 'template updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  orderUpdate: async (req, res) => {
    try {
      const itemsToBeUpdated = [...req.body.content.main, ...req.body.content.side]

      for (const item of itemsToBeUpdated) {
        await db[item.temp].update(
          { order_index: item.props.order_index },
          { where: { id: item.props.id } }
        )
        // console.log('====================')
        // console.log(`template: ${item.temp} id: ${item.props.id}`)
        // console.log('====================')
      }

      res.status(200).json({ message: 'Order updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  delete: async (req, res) => {
    try {
      if (req.body.url) {
        s3Folders.deleteS3(s3Folders.cmsImages, req.body.url)
      }
      const currentPage = await db.Page.findOne({ where: { title: req.body.page } })
      // console.log('=====================')
      // console.log(currentPage.id)
      // console.log('=====================')
      const result = await db[req.body.temp].destroy({
        where: {
          main: req.body.main,
          order_index: req.body.order_index,
          PageId: currentPage.id
        }
      })
      let reorder = []
      for (const t of req.body.templates) {
        const funcName = `get${t}s`
        const currentTemp = await currentPage[funcName]({
          where: { main: req.body.main }
        })

        currentTemp.map((element) => {
          reorder.push({
            temp: t,
            id: element.id,
            order_index: element.order_index
          })
        })
      }
      const sortTemps = (a, b) => a.order_index - b.order_index
      reorder.sort(sortTemps)
      reorder.map((obj, i) => {
        if (obj.order_index !== i) {
          db[obj.temp].update({ order_index: i }, { where: { id: obj.id } })
        }
      })

      //CREATES LOG AND ATTACHES IT TO THE CURRENT PAGE
      const newLog = await db.CmsLog.create({
        nanoid: nanoid(),
        template: req.body.temp,
        type: 'delete',
        username: req.userInfo.username
      })
      currentPage['addCmsLogs'](newLog)

      // UPDATES THE PAGE SO WE CAN SEE WHEN IT WAS LAST ALTERED
      currentPage.changed('updatedAt', true)
      currentPage.update({ updatedAt: new Date() })

      res.status(200).json(result)
      // res.status(200).json('result')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  getPermission: async (req, res) => {
    try {
      let currentUser
      if (req.userInfo) {
        currentUser = await db.User.findOne({
          where: {
            nanoid: req.userInfo.id
          }
        })
      } else {
        return res.status(200).json({ permission: false })
      }

      let permissions = await currentUser.getPages()
      permissions = permissions.map((obj) => obj.title)
      // console.log('==========================')
      // console.log(permissions)
      // console.log(Object.getOwnPropertyNames(db.User.prototype))
      // console.log('==========================')
      if (permissions.includes(req.body.page)) {
        res.status(200).json({ permission: true })
      } else {
        res.status(200).json({ permission: false })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  fetchBanner: async (req, res) => {
    try {
      // console.log('==============================')
      // console.log(req.body)
      // console.log('==============================')
      const banner = await db.Banner.findOne({
        where: {
          type: req.body.type
        }
      })
      if (banner) {
        const data = {
          title: banner.title,
          content: banner.content,
          url: banner.url,
          id: banner.nanoid,
          expireAt: banner.expireAt,
          type: banner.type
        }

        if (banner.expireAt <= new Date(Date.now())) {
          banner.destroy()
          res.status(200).json(null)
        } else {
          res.status(200).json(data)
        }
      } else {
        res.status(200).json(null)
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  createBanner: async (req, res) => {
    try {
      // console.log('=============================')
      // console.log(req.body)
      // console.log('=============================')

      await db.Banner.create(req.body)

      res.status(200).json({ message: 'create route' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updateBanner: async (req, res) => {
    try {
      const currentBanner = await db.Banner.findOne({
        where: {
          nanoid: req.body.nanoid
        }
      })
      await currentBanner.update(req.body)
      res.status(200).json({ message: 'banner updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}
