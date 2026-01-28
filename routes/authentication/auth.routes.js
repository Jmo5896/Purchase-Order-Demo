const router = require('express').Router()
const { verifySignUp, authJwt } = require('../../middleware')
const controller = require('../../controllers/auth.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  // callback function
  next()
})

router.post('/signup', [verifySignUp.checkDuplicateUsernameOrEmail], controller.signup)

router.get('/current/user', [authJwt.verifyToken, authJwt.isStaff], controller.getUser)

router.get('/logout', controller.logOut)

router.post('/signin', controller.signin)

router.post('/send/username', controller.sendUsername)
router.post('/send/password', controller.sendPassword)

router.put(
  '/reset/password',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.resetPassword
)

router.put(
  '/check/password',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.checkPassword
)

module.exports = router
