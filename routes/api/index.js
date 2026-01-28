const router = require('express').Router()
const postRoutes = require('./post.routes')
const detailRoutes = require('./details.routes')
const staffRoutes = require('./staff.routes')
const cmsRoutes = require('./cms.routes')
const poflowRoutes = require('./poflow.routes')
const msgRoutes = require('./internalMail.routes')

router.use('/post', postRoutes)
router.use('/details', detailRoutes)
router.use('/staff', staffRoutes)
router.use('/content', cmsRoutes)
router.use('/poflow', poflowRoutes)
router.use('/messages', msgRoutes)

module.exports = router
