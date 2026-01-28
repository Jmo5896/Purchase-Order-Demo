const createApproval = async (body, db) => {
  if (body.switch) {
    const newFormApproval = await db.FormApproval.create({
      requisitionId: body.requisitionId.toUpperCase(),
      switch: body.switch,
      locationCode: 'dc' + body.locationCode,
      address: body.address
    })

    for (const obj of body.approvers) {
      // const currentApproval = await db.Approval.create({
      //   email: obj.email,
      //   order: obj.order,
      //   switch: obj.switch
      // })
      const currentApproval = await db.Approval.create(obj)
      await newFormApproval.addApproval(currentApproval)
    }
  } else {
    const newFormApproval = await db.FormApproval.create({
      requisitionId: body.requisitionId.toUpperCase(),
      locationCode: 'dc' + body.locationCode,
      address: body.address
    })

    for (const obj of body.approvers) {
      const currentApproval = await db.Approval.create(obj)
      await newFormApproval.addApproval(currentApproval)
    }
  }
}

const flowData = [
  {
    address: 'county building name|county road rd|city ST, 12345',
    approvers: [
      {
        email: 'test1@kickapps-dev.org',
        order: 1
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2,
        finance: true
      }
    ],
    locationCode: '001',
    requisitionId: 'Maint_Test',
    switch: null
  },
  {
    address: 'county building name|county road rd|city ST, 12345',
    approvers: [
      {
        email: 'test1@kickapps-dev.org',
        order: 1
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 3,
        finance: true
      }
    ],
    locationCode: '001',
    requisitionId: 'food_Test',
    switch: null
  },
  {
    address: 'county building name|county road rd|city ST, 12345',
    approvers: [
      {
        email: 'test2@kickapps-dev.org',
        order: 1,
        switch: null
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 2,
        switch: true,
        finance: true
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 2,
        switch: false,
        finance: true
      }
    ],
    locationCode: '001',
    requisitionId: 'school_Test',
    switch: 'local'
  },
  {
    address: 'county building name|county road rd|city ST, 12345',
    approvers: [
      {
        email: 'test1@kickapps-dev.org',
        order: 1,
        switch: null
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2,
        switch: true,
        finance: true
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2,
        switch: false,
        finance: true
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 3,
        switch: false
      }
    ],
    locationCode: '001',
    requisitionId: 'CTE_Test',
    switch: 'local'
  },
  {
    address: 'county building name|county road rd|city ST, 12345',
    approvers: [
      {
        email: 'test1@kickapps-dev.org',
        order: 1,
        switch: null
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2,
        switch: true
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 3,
        switch: true,
        finance: true
      },
      {
        email: 'test2@kickapps-dev.org',
        order: 2,
        switch: false
      },
      {
        email: 'test3@kickapps-dev.org',
        order: 3,
        switch: false,
        finance: true
      }
    ],
    locationCode: '001',
    requisitionId: 'athletic_Test',
    switch: 'local'
  }
]

module.exports = async (db) => {
  for (const flow of flowData) {
    await createApproval(flow, db)
  }
  console.log(
    '====================================== FLOW SEEDS ========================================='
  )
}
