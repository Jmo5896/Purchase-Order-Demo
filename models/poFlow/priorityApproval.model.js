const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const PriorityApproval = sequelize.define('PriorityApproval', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
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
    finance: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })

  return PriorityApproval
}
