module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define('Vendor', {
    vendorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    }
  })

  return Vendor
}
