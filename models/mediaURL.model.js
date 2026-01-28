// const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const MediaURL = sequelize.define('MediaURL', {
    url: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    }
  })

  return MediaURL
}
