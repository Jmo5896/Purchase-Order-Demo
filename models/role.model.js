module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Role', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        is: /^[a-z0-9]+$/i,
        notNull: true,
        notEmpty: true,
        len: [1, 20]
      }
    }
  })

  return Role
}
