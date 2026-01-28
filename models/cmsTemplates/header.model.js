module.exports = (sequelize, Sequelize) => {
  const Header = sequelize.define('Header', {
    title: {
      type: Sequelize.STRING(55),
      allowNull: false,
      validate: {
        len: [1, 55]
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

  return Header
}
