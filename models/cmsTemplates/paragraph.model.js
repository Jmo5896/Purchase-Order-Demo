module.exports = (sequelize, Sequelize) => {
  const Paragraph = sequelize.define('Paragraph', {
    content: {
      type: Sequelize.STRING(1500),
      allowNull: false,
      validate: {
        len: [1, 1500]
      }
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

  return Paragraph
}
