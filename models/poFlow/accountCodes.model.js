const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const AccountCode = sequelize.define('AccountCode', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    fund: {
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
    project: {
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
    code1: {
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
    code2: {
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
    code4: {
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
    description: {
      type: Sequelize.STRING(75),
      allowNull: true,
      validate: {
        len: [0, 50]
      }
    }
  })

  return AccountCode
}
