const router = require('express').Router()

const s3Folders = require('../s3Folders')
const { authJwt } = require('../../middleware')
const controller = require('../../controllers/cms.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

router.post('/', controller.fetchPage)

router.post(
  '/upload/url',
  [authJwt.verifyToken, authJwt.isStaff],
  s3Folders.uploadS3(s3Folders.cmsImages).single('media'),
  controller.uploadMedia
)
router.post(
  '/upload/btnURL',
  [authJwt.verifyToken, authJwt.isStaff],
  s3Folders.uploadS3(s3Folders.cmsImages).single('media'),
  controller.uploadMedia
)

router.post('/create', [authJwt.verifyToken, authJwt.isStaff], controller.create)

router.post(
  '/permission',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.getPermission
)

router.put('/update', [authJwt.verifyToken, authJwt.isStaff], controller.update)

router.put('/order', [authJwt.verifyToken, authJwt.isStaff], controller.orderUpdate)

router.put('/delete', [authJwt.verifyToken, authJwt.isStaff], controller.delete)

router.post('/fetch/banner', controller.fetchBanner)

router.post(
  '/auth/banner',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.fetchBanner
)

router.post(
  '/create/banner',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createBanner
)

router.put(
  '/update/banner',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updateBanner
)

module.exports = router
