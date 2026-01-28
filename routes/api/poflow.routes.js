const router = require('express').Router()

const s3Folders = require('../s3Folders')
const { authJwt } = require('../../middleware')
const controller = require('../../controllers/poflow.controller')

router.post('/', [authJwt.verifyToken, authJwt.isStaff], controller.findAll)

router.get('/approver', [authJwt.verifyToken, authJwt.isStaff], controller.findApprover)

router.post('/history', [authJwt.verifyToken, authJwt.isStaff], controller.findHistory)

router.post(
  '/history/approval',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.findApprovalHistory
)
router.get(
  '/my/pending',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.findMyPending
)

router.post('/create', [authJwt.verifyToken, authJwt.isStaff], controller.create)

router.post(
  '/create/approval',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createApproval
)

router.post(
  '/create/priority',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createPriorityApproval
)

router.put('/update', [authJwt.verifyToken, authJwt.isStaff], controller.updateApprovals)

router.put('/update/form', [authJwt.verifyToken, authJwt.isStaff], controller.updateForm)

router.put(
  '/update/reject',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.updateRejection
)

router.put(
  '/update/priority',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updatePriorityOrder
)

router.put('/status', [authJwt.verifyToken, authJwt.isStaff], controller.approve_reject)

router.put('/delete', [authJwt.verifyToken, authJwt.isStaff], controller.delete)

router.put(
  '/delete/priority',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.deletePriorityAproval
)

router.get(
  '/request/data',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.requestFormData
)

router.get('/vendors', [authJwt.verifyToken], controller.findVendors)

router.post('/addresses', [authJwt.verifyToken], controller.findVendorAddresses)

router.post('/vendor/add', [authJwt.verifyToken, authJwt.isStaff], controller.addVendor)

router.post(
  '/vendor/check',
  [authJwt.verifyToken, authJwt.isStaff],
  controller.checkVendor
)

router.get('/accounts', [authJwt.verifyToken], controller.findAccountCodes)

router.get('/rejected', [authJwt.verifyToken, authJwt.isStaff], controller.findRejectPO)

router.get(
  '/emails',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getApprovalEmails
)

router.post(
  '/upload',
  [authJwt.verifyToken],
  s3Folders.uploadS3(s3Folders.quotes).single('media'),
  controller.uploadMedia
)

module.exports = router
