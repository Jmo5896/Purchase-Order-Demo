const router = require('express').Router()

const { authJwt } = require('../../middleware')
const controller = require('../../controllers/user.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

router.get('/public', controller.allAccess)

router.get('/staff', [authJwt.verifyToken, authJwt.isStaff], controller.staffBoard)

router.get(
  '/director/:status',
  [authJwt.verifyToken, authJwt.isDirector],
  controller.directorBoard
)

router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)

// router.get(
//   '/superAdmin',
//   [authJwt.verifyToken, authJwt.isSuperAdmin],
//   controller.superAdminBoard
// )

router.put('/delete/user', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser)

router.post(
  '/permission',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.addPermission
)

router.post('/pages', [authJwt.verifyToken, authJwt.isAdmin], controller.getPages)

module.exports = router
