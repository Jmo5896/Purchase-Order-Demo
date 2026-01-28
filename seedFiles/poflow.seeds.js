module.exports = async ({ PriorityApproval }) => {
  await PriorityApproval.bulkCreate([
    {
      email: 'test4@kickapps-dev.org',
      order: 1,
      finance: false
    },
    {
      email: 'test5@kickapps-dev.org',
      order: 2,
      finance: true
    },
    {
      email: 'test6@kickapps-dev.org',
      order: 3,
      finance: true
    }
  ])
}
