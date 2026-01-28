module.exports = (sequelize, Sequelize) => {
  const Page = sequelize.define('Page', {
    title: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [0, 50]
      }
    },
    cms: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    facility: {
      type: Sequelize.STRING(1),
      allowNull: false
    }
  })

  return Page
}
