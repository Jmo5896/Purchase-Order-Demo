module.exports = (sequelize, Sequelize) => {
  const Status = sequelize.define('Status', {
    reason: {
      type: Sequelize.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    // 0 - pending,
    // 1 -approved,
    // 2 - rejected
    currentState: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  })

  return Status
}
