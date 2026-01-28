const router = require('express').Router()

const controller = require('../../controllers/staff.controller')

router.post('/all', controller.findAll)

router.post('/single', controller.findOne)

router.get('/central', controller.findCentralStaff)

router.post('/facility', controller.findFacility)

module.exports = router
