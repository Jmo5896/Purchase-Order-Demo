const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const FormApproval = sequelize.define('FormApproval', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    requisitionId: {
      type: Sequelize.STRING(35),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\-_.]+$/i,
        notNull: true,
        notEmpty: true,
        len: [1, 35]
      }
    },
    locationCode: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: false,
      validate: {
        is: /^[a-z0-9\-_.]+$/i,
        notNull: true,
        notEmpty: true,
        len: [1, 10]
      }
    },
    switch: {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    address: {
      type: Sequelize.STRING(150),
      allowNull: true
    }
  })

  return FormApproval
}
