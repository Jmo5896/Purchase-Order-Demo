const { VendorAddress, Vendor } = require('../models')
const addressData = require('./vendorAddress.data')

module.exports = async () => {
  try {
    const vendors = await Vendor.findAll()

    for (const vendor of vendors) {
      const addresses = addressData
        .filter((obj) => obj.vendorId === vendor.vendorId)
        .map((obj) => {
          return {
            secondaryName: obj.secondaryName,
            address: obj.address,
            cityStateZip: obj.cityStateZip
          }
        })

      // const getMethods = (obj) => Object.getOwnPropertyNames(obj) //.filter((item) => typeof obj[item] === 'function')

      // console.log('=========================')
      // console.log(getMethods(Vendor.prototype))
      // console.log('=========================')
      const newAddresses = await VendorAddress.bulkCreate(addresses)
      await vendor.setVendorAddresses(newAddresses)
    }
  } catch (err) {
    console.log(err)
  }
}
