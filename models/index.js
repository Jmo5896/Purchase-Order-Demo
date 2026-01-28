const Sequelize = require('sequelize')
const config = require('../config/db.config')

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0
  // if using pool it will go below
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = require('./user.model.js')(sequelize, Sequelize)
db.Role = require('./role.model.js')(sequelize, Sequelize)
db.Invite = require('./invite.model.js')(sequelize, Sequelize)
db.StaffDetails = require('./staffDetail.model')(sequelize, Sequelize)

// POFLOW MODELS
db.Request = require('./poFlow/request.model')(sequelize, Sequelize)
db.RequestForm = require('./poFlow/requestForm.model')(sequelize, Sequelize)
db.FormApproval = require('./poFlow/formApproval.model')(sequelize, Sequelize)
db.Approval = require('./poFlow/approval.model')(sequelize, Sequelize)
db.PriorityApproval = require('./poFlow/priorityApproval.model')(sequelize, Sequelize)
db.Vendor = require('./poFlow/vendor.model')(sequelize, Sequelize)
db.VendorAddress = require('./poFlow/vendorAddress.model')(sequelize, Sequelize)
db.AccountCode = require('./poFlow/accountCodes.model')(sequelize, Sequelize)
db.Message = require('./internalMail')(sequelize, Sequelize)

//* ******** INVITEES + ROLES ***********
db.Role.hasMany(db.Invite)
db.Invite.belongsTo(db.Role)

//* ******** USER + ROLES ***************
db.Role.hasMany(db.User)
db.User.belongsTo(db.Role)

//* ******** USERS + StaffDetails *******
db.User.hasOne(db.StaffDetails)
db.StaffDetails.belongsTo(db.User)

//* ******** USERS + Message *******
db.User.hasMany(db.Message)
db.Message.belongsTo(db.User)

// **************************************
// ******** POFLOW ASSOCIATIONS *********
// **************************************

// FormApproval + Approval
db.FormApproval.hasMany(db.Approval)
db.Approval.belongsTo(db.FormApproval)

// RequestForm + Request
db.RequestForm.hasMany(db.Request)
db.Request.belongsTo(db.RequestForm)
// RequestForm + FormApproval
db.FormApproval.hasMany(db.RequestForm, {
  foreignKey: 'requisitionId'
})
db.RequestForm.belongsTo(db.FormApproval, {
  foreignKey: 'requisitionId'
})

// Vendor + VendorAddress
db.Vendor.hasMany(db.VendorAddress)
db.VendorAddress.belongsTo(db.Vendor)

// **************************************
// ******** POFLOW ASSOCIATIONS *********
// **************************************

module.exports = db
