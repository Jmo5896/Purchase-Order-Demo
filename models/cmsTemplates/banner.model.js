const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const Banner = sequelize.define('Banner', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    title: {
      type: Sequelize.STRING(23),
      allowNull: false,
      validate: {
        len: [1, 23]
      }
    },
    content: {
      type: Sequelize.STRING(125),
      allowNull: false,
      validate: {
        len: [1, 125]
      }
    },
    // 5 OPTIONS: all, hs, ms, es, ps
    type: {
      type: Sequelize.STRING(3),
      allowNull: false,
      validate: {
        len: [0, 3]
      }
    },
    url: {
      type: Sequelize.STRING(150),
      allowNull: true,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    expireAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  })

  return Banner
}
