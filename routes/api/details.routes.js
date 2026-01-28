const router = require('express').Router()

const s3Folders = require('../s3Folders')
const { authJwt } = require('../../middleware')
const controller = require('../../controllers/detail.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

router.get('/', [authJwt.verifyToken], controller.fetchOne)

router.post(
  '/create',
  // [
  //     authJwt.verifyToken,
  // ],
  controller.create
)

router.post(
  '/create/staff',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createStaff
)

router.post(
  '/upload/avatarURL',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.avatars).single('media'),
  controller.uploadMedia
)

router.post(
  '/upload/backgroundURL',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.userBackgrounds).single('media'),
  controller.uploadMedia
)

router.post(
  '/upload/sigURL',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.sigStorage).single('media'),
  controller.uploadMedia
)

router.put('/update', [authJwt.verifyToken], controller.update)

router.put('/delete', [authJwt.verifyToken, authJwt.isAdmin], controller.delete)

module.exports = router
