/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
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
    password: {
      type: Sequelize.STRING(61),
      allowNull: false,
      validate: {
        is: /^[a-z0-9@%+\\/'!#$^?:.(){}[\]~\-_.]+$/i,
        notNull: true,
        notEmpty: true,
        len: [8, 60]
      }
    }
  })

  User.beforeCreate((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, 8)
    user.password = hashedPassword
  })

  User.beforeUpdate((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, 8)
    user.password = hashedPassword
  })

  return User
}
