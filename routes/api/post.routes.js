const router = require('express').Router()

const s3Folders = require('../s3Folders')
const { authJwt } = require('../../middleware')
const controller = require('../../controllers/post.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

// WHEN POLISHING IMPORTANT!!!!!!!! USE AUTH FUNCTIONS FOR VERIFYING ROLL

router.get('/', [authJwt.verifyToken], controller.fetchAll)

router.get('/:id', [authJwt.verifyToken], controller.fetchOne)

router.post('/create', [authJwt.verifyToken], controller.createPost)

router.post(
  '/upload',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.postImages).single('media'),
  controller.uploadMedia
)

router.put('/update/status', [authJwt.verifyToken], controller.UpdatePostStatus)

router.put('/update', [authJwt.verifyToken], controller.UpdatePostDetails)

router.put('/delete', [authJwt.verifyToken], controller.DeletePost)

module.exports = router
