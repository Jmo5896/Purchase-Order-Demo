const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const cmsLog = sequelize.define(
    'cmsLog',
    {
      nanoid: {
        type: Sequelize.STRING(21),
        defaultValue: nanoid(),
        unique: true
      },
      template: {
        type: Sequelize.STRING(15),
        allowNull: false,
        validate: {
          len: [1, 15]
        }
      },
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          len: [1, 10]
        }
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          len: [4, 50]
        }
      }
    },
    {
      updatedAt: false
    }
  )

  return cmsLog
}
