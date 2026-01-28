module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('Image', {
    url: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    width: {
      type: Sequelize.STRING(8),
      allowNull: true
    },
    main: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    order_index: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  return Image
}
