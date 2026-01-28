const router = require('express').Router()

const { authJwt } = require('../../middleware')
const controller = require('../../controllers/internalMail.controller')
// /api/messages

router.get('/', [authJwt.verifyToken, authJwt.isStaff], controller.getMsgs)

router.put('/read', [authJwt.verifyToken, authJwt.isStaff], controller.updateRead)

router.put('/trash', [authJwt.verifyToken, authJwt.isStaff], controller.updateTrash)

router.put('/delete', [authJwt.verifyToken, authJwt.isStaff], controller.deleteMsgs)

module.exports = router
