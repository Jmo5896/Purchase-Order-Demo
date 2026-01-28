const invite = require('./invite.template')
const bugReport = require('./bugReport.template')
const sendUsername = require('./sendUsername.template')
const sendPassword = require('./sendPassword.template')
const createPost = require('./createPost.template')
const approvedPost = require('./approvedPost.template')
const rejectedPost = require('./rejectedPost.template')
const updateReject = require('./updateReject.template')
const poApproval = require('./approval.po.template')
const poRejection = require('./rejection.po.template')
const poFinalApproval = require('./finalApproval.po.template')
const requisitionInfo = require('./codeUpdate.po.template')

module.exports = {
  invite,
  bugReport,
  sendUsername,
  sendPassword,
  createPost,
  approvedPost,
  rejectedPost,
  updateReject,
  poApproval,
  poRejection,
  poFinalApproval,
  requisitionInfo
}
