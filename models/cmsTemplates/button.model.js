module.exports = (sequelize, Sequelize) => {
  const Button = sequelize.define('Button', {
    btnURL: {
      type: Sequelize.STRING(150),
      allowNull: true,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    title: {
      type: Sequelize.STRING(55),
      allowNull: false,
      validate: {
        len: [1, 55]
      }
    },
    url: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        isUrl: true,
        len: [0, 150]
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

  return Button
}
