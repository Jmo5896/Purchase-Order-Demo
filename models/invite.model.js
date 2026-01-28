module.exports = (sequelize, Sequelize) => {
  const Invite = sequelize.define('Invite', {
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\-_.]+$/i,
        notNull: true,
        notEmpty: true,
        len: [4, 50]
      }
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 50]
      }
    },
    registered: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return Invite
}
