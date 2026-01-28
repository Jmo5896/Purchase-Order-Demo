const { nanoid } = require('nanoid')
module.exports = (sequelize, Sequelize) => {
  const RequestForm = sequelize.define('RequestForm', {
    formId: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 50]
      }
    },
    accountId: {
      type: Sequelize.STRING(21),
      allowNull: false,
      unique: false
    },
    vendorId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    addressId: {
      type: Sequelize.STRING(21),
      allowNull: true
    },
    approvalLevel: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    totalApprovers: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    switch: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null
    },
    shippingHandling: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    poNumber: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    rejected: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reason: {
      type: Sequelize.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    quote: {
      type: Sequelize.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
        len: [0, 500]
      }
    },
    override_vendor: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    override_account: {
      type: Sequelize.STRING(500),
      allowNull: true
    }
  })

  return RequestForm
}
