module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define('Article', {
    title: {
      type: Sequelize.STRING(55),
      allowNull: true,
      validate: {
        len: [0, 55]
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
    width: {
      type: Sequelize.STRING(8),
      allowNull: true
    },
    content: {
      type: Sequelize.STRING(1500),
      allowNull: true,
      validate: {
        len: [0, 1500]
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

  return Article
}
