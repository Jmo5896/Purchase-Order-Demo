const router = require('express').Router()

const { authJwt } = require('../../middleware')
const controller = require('../../controllers/invite.controller')
const s3Folders = require('../s3Folders')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

router.post('/', [authJwt.verifyToken], controller.sendBugReport)
router.post(
  '/upload',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.bugFolder).single('media'),
  controller.uploadMedia
)

module.exports = router
