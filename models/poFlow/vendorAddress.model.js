const { nanoid } = require('nanoid')
module.exports = (sequelize, Sequelize) => {
  const VendorAddress = sequelize.define('VendorAddress', {
    nanoId: {
      type: Sequelize.STRING(21),
      defaultValue: () => nanoid(),
      unique: true
    },
    // vendorId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    secondaryName: {
      type: Sequelize.STRING(100),
      allowNull: true,
      validate: {
        len: [1, 100]
      }
    },
    address: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    cityStateZip: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    }
  })

  return VendorAddress
}
