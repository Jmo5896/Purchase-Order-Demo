const { nanoid } = require('nanoid')

module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('Message', {
    nanoid: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      allowNull: false,
      unique: true
    },
    // these will be the template keys:
    // poPending,
    // poApproved,
    // poRejected,
    // poRequisition,
    // postPending,
    // postApproved,
    // postRejected
    msg_type: {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: {
        len: [5, 30]
      }
    },
    send_to: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 50]
      }
    },
    body: {
      type: Sequelize.JSON,
      allowNull: true
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    trash: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  })

  return Message
}
