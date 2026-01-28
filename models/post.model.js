const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('Post', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: nanoid(),
      unique: true
    },
    post: {
      type: Sequelize.STRING(1000),
      allowNull: false,
      validate: {
        len: [0, 1000]
      }
    }
    // mediaURL: {
    //   type: Sequelize.STRING(150),
    //   allowNull: false,
    //   validate: {
    //     isUrl: true,
    //     len: [0, 150]
    //   }
    // }
  })

  return Post
}
