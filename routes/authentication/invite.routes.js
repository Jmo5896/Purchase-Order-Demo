const router = require('express').Router()

const { authJwt } = require('../../middleware')
const controller = require('../../controllers/invite.controller')

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )

  // callback function
  next()
})

router.post('/send', [authJwt.verifyToken, authJwt.isAdmin], controller.sendInvite)

router.post('/resend', [authJwt.verifyToken, authJwt.isAdmin], controller.resendInvite)

router.put('/delete', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteInvite)

module.exports = router
