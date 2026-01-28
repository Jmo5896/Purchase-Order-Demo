const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const Approval = sequelize.define('Approval', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: false,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 50]
      }
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    switch: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null
    },
    finance: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })

  return Approval
}
