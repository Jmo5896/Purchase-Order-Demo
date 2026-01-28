const { nanoid } = require('nanoid')
module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define('Request', {
    rowId: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    item_name: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    description: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    unit_price: {
      type: Sequelize.FLOAT(11, 2),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    quantity: {
      type: Sequelize.FLOAT(11, 2),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    total_price: {
      type: Sequelize.FLOAT(11, 2),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })

  return Request
}
