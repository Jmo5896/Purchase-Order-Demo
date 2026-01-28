const router = require('express').Router()
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const inviteRoutes = require('./invite.routes')
const bugRoutes = require('./bugReport.routes')

router.use(authRoutes)
router.use(userRoutes)
router.use('/invite', inviteRoutes)
router.use('/bugReport', bugRoutes)

module.exports = router
