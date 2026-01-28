require('dotenv').config()
const db = require('../models')
const generalSeeds = require('./seeder')
const POflowSeeds = require('./poflow.seeds')
const accountcodesSeeds = require('./accountCodes.seeds')
const vendorSeeds = require('./vendors.seeds')
const vendorAddressSeeds = require('./vendorAddresses.seeds')
const msgSeeds = require('./internalMsg.seeds')
const flowSeeds = require('./flow.seeds')

const seeds = async () => {
  try {
    await db.sequelize.sync({ force: true })

    console.log('======================= SEEDING HAS BEGUN =======================')
    await generalSeeds(db)
    console.log('======================= GENERAL SEEDS COMPLETE =======================')
    await POflowSeeds(db)
    console.log('======================= POFLOW SEEDS COMPLETE =======================')
    await accountcodesSeeds(db)
    console.log(
      '======================= ACCOUNT CODE SEEDS COMPLETE ======================='
    )
    await vendorSeeds(db)
    console.log('======================= VENDOR SEEDS COMPLETE =======================')
    await vendorAddressSeeds(db)
    console.log(
      '======================= VENDOR ADDRESS SEEDS COMPLETE ======================='
    )
    await msgSeeds(db)
    await flowSeeds(db)
    return
  } catch (error) {
    console.error(error)
  }
}

seeds()
