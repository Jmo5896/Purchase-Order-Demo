const msgSeeds = [
  {
    msg_type: 'poPending',
    send_to: 'test1@kickapps-dev.org',
    body: {},
    UserId: 1
  },
  {
    msg_type: 'poApproved',
    send_to: 'test1@kickapps-dev.org',
    body: {},
    UserId: 1
  },
  {
    msg_type: 'poRejected',
    send_to: 'test1@kickapps-dev.org',
    body: {},
    UserId: 1
  },
  // {
  //     msg_type: 'poRequisition',
  //     send_to: 'test1@kickapps-dev.org',
  //     body: {},
  //     UserId: 1
  // },
  {
    msg_type: 'postPending',
    send_to: 'test1@kickapps-dev.org',
    body: {
      message: 'seed info',
      username: 'test2'
    },
    UserId: 1
  },
  {
    msg_type: 'postApproved',
    send_to: 'test1@kickapps-dev.org',
    body: {
      message: 'seed info',
      fbPages: [
        {
          url: 'https://www.facebook.com/profile.php?id=100069997412250&is_tour_dismissed=true',
          page: 'test1'
        },
        {
          url: 'https://www.facebook.com/profile.php?id=100069997412250&is_tour_dismissed=true',
          page: 'test2'
        },
        {
          url: 'https://www.facebook.com/profile.php?id=100069997412250&is_tour_dismissed=true',
          page: 'test3'
        }
      ]
    },
    UserId: 1
  },
  {
    msg_type: 'postRejected',
    send_to: 'test1@kickapps-dev.org',
    body: {
      message: 'seed info'
    },
    UserId: 1
  }
]

module.exports = async (db) => {
  await db.Message.bulkCreate(msgSeeds)
  console.log(
    '=============================== MESSAGE SEEDS CREATED =================================='
  )
  return
}
