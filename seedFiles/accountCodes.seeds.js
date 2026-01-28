const { AccountCode } = require('../models')

module.exports = async () => {
  try {
    await AccountCode.bulkCreate([
      {
        description: 'City Mechanical',
        fund: 12,
        project: 1,
        code1: 'dc12641',
        code2: 'dc341',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Schindler Elevator',
        fund: 12,
        project: 1,
        code1: 'dc12641',
        code2: 'dc341',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'County Office Water/Sewage',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Maintenance Shop Water/Sewage',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Water/Sewage ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Water/Sewage PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Water/Sewage MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Water/Sewage HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc411',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Maintenance Shop Garbage',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Field House Garbage',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Garbage ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Garbage PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Garbage MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Garbage HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc421',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Lawn Care',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc424',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Non Tech Repair',
        fund: 12,
        project: 1,
        code1: 'dc12621',
        code2: 'dc431',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Snow Removal',
        fund: 12,
        project: 1,
        code1: 'dc12631',
        code2: 'dc422',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Middle Island Dem0',
        fund: 12,
        project: 1,
        code1: 'dc12621',
        code2: 'dc451',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'ESC Facilities',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc591',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'ESC Contract(landscaping)',
        fund: 12,
        project: 1,
        code1: 'dc12631',
        code2: 'dc591',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'landscaping supplies',
        fund: 12,
        project: 1,
        code1: 'dc12631',
        code2: 'dc611',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Tech Repair',
        fund: 12,
        project: 1,
        code1: 'dc12621',
        code2: 'dc432',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'County Office Telephone',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Maintenance Shop Telephone',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Telephone ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Telephone PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Telephone MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Telephone HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc532',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'County Office Custodial Supplies',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc612',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Custodial Supplies ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc612',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Custodial Supplies PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc612',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Custodial Supplies MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc612',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Custodial Supplies HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc612',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'County Office Natural Gas',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Maintenance Shop Natural Gas',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Natural Gas ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Natural Gas PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Natural Gas MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Natrual Gas HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc621',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'County Office Electricity',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Maintenance Shop Electricity',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Electricity ES',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Electricity PK',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Electricity MS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Electricity HS',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Athletics Complex Utilities',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc622',
        locationCode: 'dc501',
        code4: 'dc5011'
      },
      {
        description: 'Other Professional Services',
        fund: 12,
        project: 1,
        code1: 'dc12611',
        code2: 'dc341',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Maintenance Supplies',
        fund: 12,
        project: 1,
        code1: 'dc12621',
        code2: 'dc613',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Utilities Maintenance',
        fund: 12,
        project: 1,
        code1: 'dc12631',
        code2: 'dc622',
        locationCode: 'dc015',
        code4: ''
      },
      {
        description: 'Equipment/Furnishings for Maint-CTE Facility',
        fund: 12,
        project: 1,
        code1: 'dc31391',
        code2: 'dc733',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Library (general supplies) ES',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc611',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Library (books) ES',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc642',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Library (general supplies) PK',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc611',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Library (books) PK',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc642',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Library (general supplies) MS',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Library (books) MS',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc642',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Library (general supplies) HS',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Library (books) HS',
        fund: 12,
        project: 2,
        code1: 'dc12220',
        code2: 'dc642',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Vocational (general supplies)',
        fund: 12,
        project: 2,
        code1: 'dc31345',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Vocational (drug testing)',
        fund: 12,
        project: 2,
        code1: 'dc31391',
        code2: 'dc345',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Vocational (intereducational from other government agencies)',
        fund: 12,
        project: 2,
        code1: 'dc31391',
        code2: 'dc594',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: '4-H (other professional services)',
        fund: 12,
        project: 2,
        code1: 'dc83332',
        code2: 'dc341',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: '4-H (staff travel, general)',
        fund: 12,
        project: 2,
        code1: 'dc83332',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: '4-H (general supplies)',
        fund: 12,
        project: 2,
        code1: 'dc83332',
        code2: 'dc611',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Supplies ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Supplies PK',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Supplies MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Supplies HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'PBIS ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc211',
        code4: 'dc0038'
      },
      {
        description: 'PBIS PK',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc212',
        code4: 'dc0038'
      },
      {
        description: 'PBIS MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: 'dc0038'
      },
      {
        description: 'PBIS HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: 'dc0038'
      },
      {
        description: 'Steam Labs ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc211',
        code4: 'dc0040'
      },
      {
        description: 'Steam Labs MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: 'dc0040'
      },
      {
        description: 'Steam Labs HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: 'dc0040'
      },
      {
        description: 'Textbooks ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc641',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Textbooks PK',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc641',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Textbooks MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc641',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Textbooks HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc641',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Travel (instruction k-12)',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Travel (operation of buildings)',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Travel (executive administration superintendents office)',
        fund: 12,
        project: 2,
        code1: 'dc12321',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Travel (personal and professional staff development)',
        fund: 12,
        project: 2,
        code1: 'dc12213',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Travel (principals office)',
        fund: 12,
        project: 2,
        code1: 'dc12411',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Furniture ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc693',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Furniture PK',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc693',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Furniture MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc693',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Furniture HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc693',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Class Trips (Student Travel) ES',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc586',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Class Trips (Student Travel) PK',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc586',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Class Trips (Student Travel) MS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc586',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Class Trips (Student Travel) HS',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc586',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Medical Cabinet refills',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc619',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Postage',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc531',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'County Office Data Lines (internet)',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc533',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Data Lines (internet) ES',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc533',
        locationCode: 'dc211',
        code4: ''
      },
      {
        description: 'Data Lines (internet) PK',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc533',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Data Lines (internet) MS',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc533',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Data Lines (internet) HS',
        fund: 12,
        project: 2,
        code1: 'dc12611',
        code2: 'dc533',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Curriculum Development',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc321',
        locationCode: 'dc501',
        code4: 'dc0042'
      },
      {
        description: 'High School Class Dues',
        fund: 12,
        project: 2,
        code1: 'dc91910',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Copiers',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc443',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'John Post (general supplies)',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: 'dc1952'
      },
      {
        description: 'John Post (staff travel general)',
        fund: 12,
        project: 2,
        code1: 'dc11111',
        code2: 'dc580',
        locationCode: 'dc301',
        code4: 'dc1952'
      },
      {
        description: 'Athletics MS',
        fund: 12,
        project: 3,
        code1: 'dc91920',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Athletics HS',
        fund: 12,
        project: 3,
        code1: 'dc91920',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Athletes Insurance',
        fund: 12,
        project: 3,
        code1: 'dc91920',
        code2: 'dc523',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Band (general supplies) HS',
        fund: 12,
        project: 3,
        code1: 'dc91910',
        code2: 'dc611',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Band (staff travel general) HS',
        fund: 12,
        project: 3,
        code1: 'dc91910',
        code2: 'dc580',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Band (supplies) MS',
        fund: 12,
        project: 3,
        code1: 'dc91910',
        code2: 'dc611',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Band (staff travel general) MS',
        fund: 12,
        project: 3,
        code1: 'dc91910',
        code2: 'dc580',
        locationCode: 'dc301',
        code4: ''
      },
      {
        description: 'Supplies  etc.',
        fund: 12,
        project: 3,
        code1: 'dc91920',
        code2: 'dc611',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Pro Officers',
        fund: 12,
        project: 3,
        code1: 'dc12661',
        code2: 'dc341',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Tuition Reimbursement',
        fund: 12,
        project: 3,
        code1: 'dc12411',
        code2: 'dc241',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'staff development PK',
        fund: 12,
        project: 3,
        code1: 'dc11121',
        code2: 'dc331',
        locationCode: 'dc212',
        code4: ''
      },
      {
        description: 'Athletic Trainer',
        fund: 12,
        project: 3,
        code1: 'dc91920',
        code2: 'dc341',
        locationCode: 'dc501',
        code4: ''
      },
      {
        description: 'Bus Purchases (bus replacement)',
        fund: 12,
        project: 4,
        code1: 'dc12711',
        code2: 'dc741',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Bus Purchases  (fund transfers out)',
        fund: 12,
        project: 4,
        code1: 'dc76161',
        code2: 'dc911',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Gas',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc662',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Fuel',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc661',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Oil',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc665',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Tires',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc666',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Parts',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc667',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Disposals/Repeater',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc341',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Water/Sewer Utilities',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc411',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Disposal/Trash',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc421',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Phone/Internet',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc532',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Electricity',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc622',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Misc Equip',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc693',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Training',
        fund: 12,
        project: 4,
        code1: 'dc12721',
        code2: 'dc331',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Drug Testing',
        fund: 12,
        project: 4,
        code1: 'dc12721',
        code2: 'dc342',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Background',
        fund: 12,
        project: 4,
        code1: 'dc12721',
        code2: 'dc343',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'general supplies (gravel, etc)',
        fund: 12,
        project: 4,
        code1: 'dc12791',
        code2: 'dc611',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'general services',
        fund: 12,
        project: 4,
        code1: 'dc12791',
        code2: 'dc431',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Buses Camera Renewal/ Upgrade',
        fund: 12,
        project: 4,
        code1: 'dc12721',
        code2: 'dc535',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Driver Internet/IPADS',
        fund: 12,
        project: 4,
        code1: 'dc12721',
        code2: 'dc696',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Garage Repair maint',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc431',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Vehicle Rental',
        fund: 12,
        project: 4,
        code1: 'dc12731',
        code2: 'dc442',
        locationCode: 'dc014',
        code4: ''
      },
      {
        description: 'Wholistic Child Programs (employee training)',
        fund: 12,
        project: 5,
        code1: 'dc22140',
        code2: 'dc331',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Wholistic Child Programs (staff travel general)',
        fund: 12,
        project: 5,
        code1: 'dc22140',
        code2: 'dc580',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Wholistic Child Programs (other professional services)',
        fund: 12,
        project: 5,
        code1: 'dc22140',
        code2: 'dc341',
        locationCode: 'dc001',
        code4: ''
      },
      {
        description: 'Wholistic Child Programs (general supplies)',
        fund: 12,
        project: 5,
        code1: 'dc22140',
        code2: 'dc611',
        locationCode: 'dc001',
        code4: ''
      }
    ])
  } catch (err) {
    console.log(err)
  }
}
