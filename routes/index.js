const router = require('express').Router()

const authRoutes = require('./authentication')
const apiRoutes = require('./api')

router.use('/auth', authRoutes)
router.use('/api', apiRoutes)

module.exports = router
