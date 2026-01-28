/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const Slide = sequelize.define('Slide', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: nanoid(),
      unique: true
    },
    url: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    title: {
      type: Sequelize.STRING(55),
      allowNull: true,
      validate: {
        len: [0, 55]
      }
    },
    paragraph: {
      type: Sequelize.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    sport: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    }
  })

  return Slide
}
