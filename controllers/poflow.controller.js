const {
  Request,
  RequestForm,
  FormApproval,
  Approval,
  PriorityApproval,
  Vendor,
  VendorAddress,
  AccountCode,
  StaffDetails,
  Sequelize,
  User
} = require('../models')
// const { fn, col } = Sequelize
const { email, dateFormatter } = require('../middleware')
const {
  poApproval,
  poRejection,
  poFinalApproval,
  requisitionInfo
} = require('../middleware/templates')
const s3Folders = require('../routes/s3Folders')
const { creatMsg } = require('./internalMail.controller')

const { Op } = Sequelize

const requestFormAttrs = [
  'formId',
  'email',
  'accountId',
  'vendorId',
  'addressId',
  'approvalLevel',
  'totalApprovers',
  'switch',
  'shippingHandling',
  'poNumber',
  'reason',
  'quote',
  'createdAt'
]

const requestAttrs = [
  ['rowId', 'id'],
  'item_name',
  'description',
  'unit_price',
  'quantity',
  'total_price'
]

const formFormater = (form, stage, poData = null) => {
  const reducer = (partialSum, a) => {
    return partialSum + a.total_price
  }

  const newForm = {
    formId: form.formId,
    email: form.email,
    requisitionId: form.requisitionId,
    stage,
    total:
      form.Requests &&
      (form.Requests.reduce(reducer, 0) + form.shippingHandling).toFixed(2),
    shippingHandling: form.shippingHandling,
    quote: form.quote || null,
    reason: form.reason || null
  }
  return { header: newForm, data: form.Requests, poData }
}

const compileRequestForms = (flowObj, priorityA = null) => {
  // return number of where this approver sits in flow
  const newObj = flowObj.get({ plain: true })
  let order
  let mySwitch
  let pendingRequests
  if (newObj.Approvals) {
    order = newObj.Approvals[0].order
    mySwitch = newObj.Approvals[0].switch
    // the original code was using the order and switch to determine uniqueness.  This was originally coded assuming all emails would be unique.  The if statement below is used if the same person is on both sides of the switch
    if (newObj.Approvals.length > 1) {
      pendingRequests = newObj.RequestForms.filter(
        (obj) => obj.approvalLevel === order //&& obj.switch === mySwitch
      ).map((obj) => {
        return {
          ...obj,
          requisitionId: newObj.requisitionId,
          switchName: newObj.switch
        }
      })
    } else {
      pendingRequests = newObj.RequestForms.filter(
        (obj) => obj.approvalLevel === order && obj.switch === mySwitch
      ).map((obj) => {
        return {
          ...obj,
          requisitionId: newObj.requisitionId,
          switchName: newObj.switch
        }
      })
    }
  } else if (priorityA) {
    order = priorityA.order
    pendingRequests = newObj.RequestForms.filter(
      (obj) => obj.totalApprovers + order === obj.approvalLevel
    ).map((obj) => {
      return {
        requisitionId: newObj.requisitionId,
        switchName: newObj.switch,
        ...obj
      }
    })
  } else {
    return {
      requisitionId: newObj.requisitionId,
      switchName: newObj.switch,
      locationCode: newObj.locationCode,
      requestForms: newObj.RequestForms.map((obj) => {
        return {
          requisitionId: newObj.requisitionId,
          switchName: newObj.switch,
          locationCode: newObj.locationCode,
          address: newObj.address,
          ...obj
        }
      })
    }
  }

  return {
    requisitionId: newObj.requisitionId,
    switchName: newObj.switch,
    requestForms: pendingRequests
  }
}

const approvalRequestForms = (flowObj, priorityA = null) => {
  // return number of where this approver sits in flow
  const newObj = flowObj.get({ plain: true })
  return {
    requisitionId: newObj.requisitionId,
    switchName: newObj.switch,
    locationCode: newObj.locationCode,
    requestForms: newObj.RequestForms.map((obj) => {
      return {
        finance: priorityA ? priorityA.finance : newObj.Approvals[0].finance,
        requisitionId: newObj.requisitionId,
        switchName: newObj.switch,
        locationCode: newObj.locationCode,
        address: newObj.address,
        ...obj
      }
    })
  }
}

module.exports = {
  findAll: async (req, res) => {
    try {
      const email = req.userInfo.email

      const allPriority = await PriorityApproval.findAll({
        attributes: ['nanoid', 'email', 'order', 'finance']
      })

      const priorityTotal = allPriority.length

      const priorityA = allPriority.find((obj) => obj.email === email)

      let approvals

      if (!priorityA) {
        approvals = await FormApproval.findAll({
          attributes: ['requisitionId', 'switch'],
          include: [
            {
              model: Approval,
              attributes: ['email', 'order', 'switch'],
              where: { email }
            },
            {
              model: RequestForm,
              attributes: requestFormAttrs,
              where: {
                rejected: false
              },
              include: [
                {
                  model: Request,
                  attributes: requestAttrs
                }
              ]
            }
          ]
        })
      } else {
        approvals = await FormApproval.findAll({
          attributes: ['requisitionId', 'switch'],
          include: [
            {
              model: RequestForm,
              where: {
                approvalLevel: {
                  [Op.gt]: Sequelize.col('totalApprovers')
                },
                rejected: false,
                switch: {
                  [Op.or]: [null, false]
                }
              },
              attributes: [...requestFormAttrs, 'override_account', 'override_vendor'],
              include: [
                {
                  model: Request,
                  attributes: requestAttrs
                }
              ]
            }
          ]
        })
      }

      // this flattens everything out so we get a single array of objects
      const cleanData = [].concat.apply(
        [],
        approvals
          .map((obj) => compileRequestForms(obj, priorityA))
          .map((x) => x.requestForms)
          .filter((x) => x.length > 0)
      )

      const vendorInfo = await Vendor.findAll({
        attributes: [
          ['vendorId', 'value'],
          ['name', 'label']
        ]
      })
      const accounts = await AccountCode.findAll({
        attributes: [
          'fund',
          'project',
          'code1',
          'code2',
          'locationCode',
          'code4',
          'description',
          'nanoid'
        ]
      })
      const accountInfo = accounts.map((acc) => {
        return {
          label: acc.description.trim(),
          value: acc.nanoid,
          accountCode: `${acc.fund}dc${acc.project}${acc.code1}${acc.code2}${
            acc.locationCode
          }${acc.code4 ? acc.code4 : ''}`
            .split('dc')
            .join('.'),
          location: acc.locationCode
        }
      })

      const pendingForms = []
      for (const form of cleanData) {
        const userNames = await StaffDetails.findOne({
          attributes: ['firstName', 'lastName'],
          where: {
            email: form.email
          }
        })

        const currentAccount = accountInfo.find(
          (obj) => obj.value === form.accountId
        ) || { value: 0, label: 'ACCOUNT OVERRIDE', accountCode: '0.0.0.0.0' }
        const currentVendor = vendorInfo.find(
          (obj) => obj.dataValues.value == form.vendorId
        ) || { dataValues: { value: 0, label: 'VENDOR OVERRIDE' } }

        const stage = {
          level: form.approvalLevel,
          max:
            form.switch && form.switchName
              ? form.totalApprovers
              : form.totalApprovers + priorityTotal,
          switch: form.switch,
          colSwitch: form.switch ? 'LOCAL' : 'COUNTY',
          date: dateFormatter(form.createdAt),
          switchName: form.switchName,
          approvalInfo: {
            name: userNames ? `${userNames.firstName} ${userNames.lastName}` : '',
            email: form.email,
            vendorId: currentVendor.dataValues.value,
            vendorName: currentVendor.dataValues.label.trim()
          }
        }
        const override = {}
        if (form.override_account) {
          const [name, code] = form.override_account.split('|')
          override.overrideAccountName = name
          override.overrideAccountCode = code
        }
        if (form.override_vendor) {
          const [name, code, address, cityStateZip] = form.override_vendor.split('|')
          override.overrideVendorName = name
          override.overrideVendorCode = code
          override.overrideVendorAddress = address
          override.overrideVendorcityStateZip = cityStateZip
        }

        const poData = {
          name: userNames ? `${userNames.firstName} ${userNames.lastName}` : '',
          quote: form.quote,
          description: currentAccount.label,
          accountCode: currentAccount.accountCode,
          accountId: currentAccount.value,
          vendorId: currentVendor.dataValues.value,
          vendorName: currentVendor.dataValues.label.trim(),
          vendors: vendorInfo,
          accounts: accountInfo,
          override
        }

        if (priorityA) {
          if (priorityA.finance) {
            poData.finance = priorityA.finance
          }
          pendingForms.push(
            formFormater(
              form,
              stage,
              stage.level === stage.max || priorityA.finance ? poData : null
            )
          )
        } else {
          pendingForms.push(
            formFormater(form, stage, stage.level === stage.max ? poData : null)
          )
        }
      }
      res.status(200).json(pendingForms)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findHistory: async (req, res) => {
    try {
      const currentUserEmail = req.userInfo.email

      const allPriority = await PriorityApproval.findAll({
        attributes: ['nanoid']
      })
      const priorityTotal = allPriority.length

      const requestHistory = await FormApproval.findAll({
        attributes: ['requisitionId', 'switch', 'locationCode', 'address'],
        include: [
          {
            model: RequestForm,
            where: {
              approvalLevel: {
                // [Op.gt]: priorityTotal + Sequelize.col('totalApprovers')
                [Op.gt]: Sequelize.col('totalApprovers')
              },
              rejected: false,
              email: currentUserEmail
              // switch: null //THIS IS A SWITCH TEST
            },
            attributes: [
              ...requestFormAttrs,
              'updatedAt',
              'override_vendor',
              'override_account'
            ],
            include: [
              {
                model: Request,
                attributes: requestAttrs
              }
            ]
          }
        ]
      })

      const cleanData = [].concat.apply(
        [],
        requestHistory
          .map((obj) => compileRequestForms(obj))
          .map((x) => x.requestForms)
          .filter((x) => x.length > 0)
      )

      const submittedForms = []
      for (const form of cleanData) {
        if (form.totalApprovers + priorityTotal < form.approvalLevel || form.switch) {
          let data = {
            approvalDate: form.updatedAt,
            poNumber: `${form.poNumber}`,
            toAddress: form.address,
            switch: form.switch
          }

          if (form.override_account) {
            const code = form.override_account.split('|')[1]
            data.accountCode = code
          } else {
            const account = await AccountCode.findOne({
              attributes: [
                'fund',
                'project',
                'code1',
                'code2',
                'locationCode',
                'code4',
                'description',
                'nanoid'
              ],
              where: {
                nanoid: form.accountId
              }
            })

            const code = `${account.fund}.${account.project}${account.code1}${
              account.code2
            }${account.locationCode}${account.code4 == '' ? '' : `${account.code4}`}`
              .split('dc')
              .join('.')

            data.accountCode = code
          }

          if (form.override_vendor) {
            const [vName, vendorId, address, cityStateZip] =
              form.override_vendor.split('|')
            data = {
              ...data,
              vendorId: vendorId,
              addressInfo: {
                vendorName: vName,
                secondaryName: null,
                address: address,
                cityStateZip
              }
            }
          } else {
            const vendor = await Vendor.findOne({
              where: {
                vendorId: form.vendorId
              }
            })
            const addressInfo = await VendorAddress.findOne({
              attributes: ['secondaryName', 'address', 'cityStateZip'],
              where: {
                nanoId: form.addressId
              }
            })

            data = {
              ...data,
              vendorId: form.vendorId,
              addressInfo: {
                vendorName: vendor.name,
                secondaryName: addressInfo ? addressInfo.secondaryName : '',
                address: addressInfo ? addressInfo.address : '',
                cityStateZip: addressInfo ? addressInfo.cityStateZip : ''
              }
            }
          }
          const stage = {
            switch: form.switch ? 'LOCAL' : 'COUNTY',
            date: dateFormatter(form.createdAt),
            vendor: data.addressInfo.vendorName
          }
          submittedForms.push(formFormater(form, stage, data))
        }
      }

      res.status(200).json(submittedForms)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findApprovalHistory: async (req, res) => {
    try {
      const currentUserEmail = req.userInfo.email
      let requestHistory
      const priorityA = await PriorityApproval.findOne({
        where: {
          email: currentUserEmail
        }
      })

      if (priorityA) {
        requestHistory = await FormApproval.findAll({
          attributes: ['requisitionId', 'switch', 'locationCode', 'address'],
          include: [
            {
              model: RequestForm,
              where: {
                approvalLevel: {
                  [Op.gt]: Sequelize.col('totalApprovers')
                },
                rejected: false,
                switch: {
                  [Op.or]: [null, false] // get all the flows that aren't local
                }
              },
              attributes: [
                ...requestFormAttrs,
                'updatedAt',
                'override_vendor',
                'override_account'
              ],
              include: [
                {
                  model: Request,
                  attributes: requestAttrs
                }
              ]
            }
          ]
        })
      } else {
        requestHistory = await FormApproval.findAll({
          attributes: ['requisitionId', 'switch', 'locationCode', 'address'],
          include: [
            {
              model: RequestForm,
              where: {
                approvalLevel: {
                  [Op.gt]: Sequelize.col('totalApprovers')
                },
                rejected: false
              },
              attributes: [
                ...requestFormAttrs,
                'updatedAt',
                'override_vendor',
                'override_account'
              ],
              include: [
                {
                  model: Request,
                  attributes: requestAttrs
                }
              ]
            },
            {
              model: Approval,
              where: {
                email: currentUserEmail
              }
            }
          ]
        })
      }

      if (requestHistory) {
        const allPriority = await PriorityApproval.findAll({
          attributes: ['nanoid']
        })
        const priorityTotal = allPriority.length

        const cleanData = [].concat.apply(
          [],
          requestHistory
            .map((obj) => approvalRequestForms(obj, priorityA))
            .map((x) => x.requestForms)
            .filter((x) => x.length > 0)
        )

        const vendorInfo = await Vendor.findAll({
          attributes: [
            ['vendorId', 'value'],
            ['name', 'label']
          ]
        })
        const accounts = await AccountCode.findAll({
          attributes: [
            'fund',
            'project',
            'code1',
            'code2',
            'locationCode',
            'code4',
            'description',
            'nanoid'
          ]
        })
        const accountInfo = accounts.map((acc) => {
          return {
            label: acc.description.trim(),
            value: acc.nanoid,
            accountCode: `${acc.fund}dc${acc.project}${acc.code1}${acc.code2}${
              acc.locationCode
            }${acc.code4 ? acc.code4 : ''}`
              .split('dc')
              .join('.'),
            location: acc.locationCode
          }
        })

        const submittedForms = []
        for (const form of cleanData) {
          if (form.totalApprovers + priorityTotal < form.approvalLevel || form.switch) {
            let data = {
              approvalDate: form.updatedAt,
              poNumber: `${form.poNumber}`,
              toAddress: form.address,
              switch: form.switch,
              finance: form.finance,
              vendors: vendorInfo,
              accounts: accountInfo,
              quote: form.quote,
              override: {}
            }

            if (form.override_account) {
              const [name, code] = form.override_account.split('|')
              data.override.overrideAccountName = name
              data.override.overrideAccountCode = code
              data.accountCode = code
              data.accountId = 0
              data.description = 'ACCOUNT OVERRIDE'
            } else {
              const account = accountInfo.find((obj) => obj.value === form.accountId)
              // const account = await AccountCode.findOne({
              //   attributes: [
              //     'fund',
              //     'project',
              //     'code1',
              //     'code2',
              //     'locationCode',
              //     'code4',
              //     'description',
              //     'nanoid'
              //   ],
              //   where: {
              //     nanoid: form.accountId
              //   }
              // })

              // const code = `${account.fund}.${account.project}${account.code1}${
              //   account.code2
              // }${account.locationCode}${account.code4 == '' ? '' : `${account.code4}`}`
              //   .split('dc')
              //   .join('.')

              data.accountCode = account.accountCode
              data.accountId = account.value
              data.description = account.label
            }

            if (form.override_vendor) {
              const [vName, vendorId, address, cityStateZip] =
                form.override_vendor.split('|')
              data = {
                ...data,
                vendorId: vendorId,
                vendorName: vName,
                addressInfo: {
                  vendorName: vName,
                  secondaryName: null,
                  address: address,
                  cityStateZip
                }
              }
              data.override.overrideVendorName = vName
              data.override.overrideVendorCode = vendorId
              data.override.overrideVendorAddress = address
              data.override.overrideVendorcityStateZip = cityStateZip
            } else {
              const vendor = vendorInfo.find(
                (obj) => obj.dataValues.value === form.vendorId
              )
              const addressInfo = await VendorAddress.findOne({
                attributes: ['secondaryName', 'address', 'cityStateZip'],
                where: {
                  nanoId: form.addressId
                }
              })

              data = {
                ...data,
                vendorId: form.vendorId,
                vendorName: vendor.dataValues.label,
                addressInfo: {
                  vendorName: vendor.dataValues.label,
                  secondaryName: addressInfo ? addressInfo.secondaryName : '',
                  address: addressInfo ? addressInfo.address : '',
                  cityStateZip: addressInfo ? addressInfo.cityStateZip : ''
                }
              }
            }
            const stage = {
              switch: form.switch ? 'LOCAL' : 'COUNTY',
              date: dateFormatter(form.createdAt),
              vendor: data.addressInfo.vendorName,
              level: form.approvalLevel
            }

            submittedForms.push(formFormater(form, stage, data))
          }
        }
        res.status(200).json(submittedForms)
      } else {
        res.status(200).json([])
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findVendors: async (req, res) => {
    try {
      const vendorList = await Vendor.findAll({
        attributes: ['vendorId', 'name']
      })
      res.status(200).json(
        vendorList.map((obj) => {
          return { value: obj.vendorId, label: obj.name }
        })
      )
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  getApprovalEmails: async (req, res) => {
    try {
      const priorityA = await PriorityApproval.findAll({
        attributes: ['email']
      })

      const currentList = await User.findAll({
        attributes: ['email'],
        where: {
          email: {
            [Op.notIn]: priorityA.map((obj) => obj.email)
          }
        },
        include: [
          {
            model: StaffDetails
          }
        ]
      })

      const emails = currentList.map((obj) => {
        return {
          value: obj.email,
          label: obj.email
        }
      })

      // emails.unshift({ value: null, label: 'Choose email from list' })
      res.status(200).json(emails)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  checkVendor: async (req, res) => {
    try {
      const currentVendor = await Vendor.findOne({
        where: req.body
      })

      res.status(200).json({ exists: currentVendor ? true : false })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findVendorAddresses: async (req, res) => {
    try {
      let addresses = []
      if (req.body.vendorId) {
        const currentVendor = await Vendor.findOne({
          where: {
            vendorId: req.body.vendorId
          }
        })
        if (currentVendor) {
          addresses = await currentVendor.getVendorAddresses()

          addresses = addresses.map((obj) => {
            return {
              nanoId: obj.nanoId,
              secondaryName: obj.secondaryName,
              address: obj.address,
              cityStateZip: obj.cityStateZip
            }
          })
        }
      }

      res.status(200).json(addresses)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findAccountCodes: async (req, res) => {
    try {
      const accountCodes = await AccountCode.findAll({
        attributes: ['nanoid', 'locationCode', 'description']
      })

      res.status(200).json(
        accountCodes.map((obj) => {
          return {
            value: obj.nanoid,
            label: obj.description.trim() + ' | ' + obj.locationCode,
            // label: obj.description.trim(),
            locationCode: obj.locationCode
          }
        })
      )
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findRejectPO: async (req, res) => {
    const userEmail = req.userInfo.email
    //find rejected POs based on user login
    try {
      const approvals = await FormApproval.findAll({
        attributes: ['requisitionId', 'switch', 'locationCode'],
        include: [
          {
            model: RequestForm,
            where: {
              rejected: true,
              email: userEmail
            },
            attributes: requestFormAttrs,
            include: [
              {
                model: Request,
                attributes: requestAttrs
              }
            ]
          }
        ]
      })

      // this flattens everything out so we get a single array of objects
      const cleanData = [].concat.apply(
        [],
        approvals
          .map(compileRequestForms)
          .map((x) => x.requestForms)
          .filter((x) => x.length > 0)
      )

      //loop over PO reject
      const rejectForms = []
      for (const form of cleanData) {
        const vendor = await Vendor.findOne({
          where: {
            vendorId: form.vendorId
          }
        })

        const stage = {
          level: 'rejected',
          switch: form.switch ? 'LOCAL' : 'COUNTY',
          date: dateFormatter(form.createdAt),
          vendor: vendor.name
        }

        const data = {
          vendorId: form.vendorId,
          accountId: form.accountId,
          reason: form.reason,
          locationCode: form.locationCode
        }

        rejectForms.push(formFormater(form, stage, data))
      }

      res.status(200).json(rejectForms)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findApprover: async (req, res) => {
    try {
      const currentEmail = req.userInfo.email
      const result = { priority: true }

      let approver = await PriorityApproval.findOne({
        where: {
          email: currentEmail
        }
      })
      if (!approver) {
        approver = await Approval.findOne({
          where: {
            email: currentEmail
          }
        })
        result.priority = false
      }

      if (approver) {
        result.approver = true
        result.finance = approver.finance ? true : false
      } else {
        result.approver = false
        result.finance = false
      }
      // res.status(200).json({ approver: approver || priorityApprover ? true : false })
      res.status(200).json(result)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findMyPending: async (req, res) => {
    try {
      const email = req.userInfo.email

      const allPriority = await PriorityApproval.findAll({
        attributes: ['nanoid', 'email', 'order', 'finance']
      })

      const priorityTotal = allPriority.length

      const priorityA = allPriority.find((obj) => obj.email === email)

      const approvals = await FormApproval.findAll({
        attributes: ['requisitionId', 'switch'],
        include: [
          {
            model: RequestForm,
            attributes: [...requestFormAttrs, 'override_vendor'],
            where: {
              rejected: false,
              email
            },
            include: [
              {
                model: Request,
                attributes: requestAttrs
              }
            ]
          }
        ]
      })

      const cleanData = [].concat.apply(
        [],
        approvals
          .map((obj) => compileRequestForms(obj, priorityA))
          .map((x) => x.requestForms)
          .filter((x) => x.length > 0)
      )
      const pendingForms = []
      for (const form of cleanData) {
        const vendor = await Vendor.findOne({
          where: {
            vendorId: form.vendorId
          }
        })
        const stage = {
          approvalLevel: form.approvalLevel,
          switch: form.switch ? 'LOCAL' : 'COUNTY',
          date: dateFormatter(form.createdAt),
          vendor: vendor ? vendor.name : form.override_vendor
        }
        if (form.switch) {
          if (form.approvalLevel <= form.totalApprovers) {
            stage.max = form.totalApprovers + 1
            stage.percent = (form.approvalLevel / stage.max) * 100
            pendingForms.push(formFormater(form, stage))
          }
        } else if (form.approvalLevel <= form.totalApprovers + priorityTotal) {
          stage.max = form.totalApprovers + priorityTotal + 1
          stage.percent = (form.approvalLevel / stage.max) * 100
          pendingForms.push(formFormater(form, stage))
        }
      }
      res.status(200).json(pendingForms)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  create: async (req, res) => {
    try {
      const approval = await FormApproval.findOne({
        where: req.body.id,
        // attributes: {
        //   include: [
        //     [
        //       Sequelize.fn('COUNT', Sequelize.col('approvals.FormApprovalId')),
        //       'totalApprovers'
        //     ]
        //   ]
        // },
        include: [
          {
            model: Approval,
            attributes: ['switch', 'order', 'email']
          }
        ]
      })

      const switchCount = []
      if (approval.switch) {
        for (const a of approval.Approvals) {
          if (!switchCount.includes(a.order)) {
            switchCount.push(a.order)
          }
        }
      }

      // calculate total number of approvers, this needs to include priority approvers
      const newForm = await RequestForm.create({
        // requisitionId: approval.requisitionId,
        accountId: req.body.accountId,
        vendorId: req.body.vendorId,
        approvalLevel: 1,
        totalApprovers:
          switchCount.length > 0 ? switchCount.length : approval.Approvals.length,
        email: req.userInfo.email,
        shippingHandling: req.body.shippingHandling,
        quote: req.body.quote
      })
      await approval.addRequestForm(newForm)
      const data = await Request.bulkCreate(req.body.items)
      await newForm.addRequests(data)

      const approvalEmail = approval.Approvals[0].email

      // after po is created, send msg to the next approver
      await creatMsg({
        msg_type: 'poPending',
        send_to: approvalEmail,
        body: null
      })

      email(approvalEmail, poApproval, null, null)

      res.status(200).send('Form submitted')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  createApproval: async (req, res) => {
    try {
      if (req.body.switch) {
        // console.log('=========================')
        // console.log(req.body)
        // // console.log(newFormApproval)
        // console.log('=========================')
        const newFormApproval = await FormApproval.create({
          requisitionId: req.body.requisitionId.toUpperCase(),
          switch: req.body.switch,
          locationCode: 'dc' + req.body.locationCode,
          address: req.body.address
        })

        for (const obj of req.body.approvers) {
          const currentApproval = await Approval.create({
            email: obj.email,
            order: obj.order,
            switch: obj.switch
          })
          await newFormApproval.addApproval(currentApproval)
        }
      } else {
        const newFormApproval = await FormApproval.create({
          requisitionId: req.body.requisitionId.toUpperCase(),
          locationCode: 'dc' + req.body.locationCode,
          address: req.body.address
        })

        for (const obj of req.body.approvers) {
          const currentApproval = await Approval.create(obj)
          await newFormApproval.addApproval(currentApproval)
        }
      }

      res.status(200).send('Flow created!')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  },
  createPriorityApproval: async (req, res) => {
    try {
      const staffer = await StaffDetails.findOne({
        where: {
          email: req.body.email
        }
      })
      if (staffer) {
        await PriorityApproval.create(req.body)

        res.status(200).send('priority approver created!')
      } else {
        res.status(404).send('Staff member is not in directory')
      }
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  },
  addVendor: async (req, res) => {
    try {
      const currentVendor = await Vendor.create({
        vendorId: req.body.vendorId,
        name: req.body.name
      })

      const currentAddress = await VendorAddress.create({
        address: req.body.address,
        cityStateZip: req.body.cityStateZip,
        secondaryName: req.body.secondaryName || null
      })

      await currentVendor.setVendorAddresses([currentAddress])

      res.status(200).send('vendor added')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updateApprovals: async (req, res) => {
    try {
      const updatedForm = await FormApproval.findOne({
        where: {
          nanoid: req.body.id
        }
      })

      await updatedForm.update({
        switch: req.body.switch,
        locationCode: 'dc' + req.body.locationCode,
        requisitionId: req.body.requisitionId,
        address: req.body.address
      })

      if (req.body.approvers) {
        await updatedForm.setApprovals([])

        for (const obj of req.body.approvers) {
          const currentApproval = await Approval.create({
            email: obj.email,
            order: obj.order,
            switch: obj.switch
          })
          await updatedForm.addApproval(currentApproval)
        }
        await Approval.destroy({
          where: {
            FormApprovalId: null
          }
        })
      }

      res.status(200).json({ message: 'flow updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updatePriorityOrder: async (req, res) => {
    try {
      for (const row of req.body) {
        await PriorityApproval.update(
          {
            order: row.order
          },
          {
            where: {
              nanoid: row.id
            }
          }
        )
      }
      // const currentFormApproval = await FormApproval.findOne({
      //   where: {
      //     requisitionId: req.body.id
      //   }
      // })

      // await currentFormApproval.update(req.body.data)

      res.status(200).json({ message: 'flow updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updateForm: async (req, res) => {
    try {
      const currentRequest = await RequestForm.findOne({
        where: {
          formId: req.body.formId
        }
      })
      const currentFlow = await FormApproval.findOne({
        where: {
          id: currentRequest.requisitionId
        },
        include: [
          {
            model: Approval,
            attributes: ['email', 'order', 'finance', 'switch']
          }
        ]
      })
      const userPoInfo = await StaffDetails.findOne({
        where: {
          email: currentRequest.email
        }
      })

      const approvalEmail = currentFlow.Approvals.find(
        (obj) => obj.finance === true && !obj.switch
      )

      if (req.body.items) {
        const currentRequestRows = await currentRequest.getRequests()
        for (let i = 0; i < currentRequestRows.length; i++) {
          const tempRowId = currentRequestRows[i].rowId
          const newRow = req.body.items.find((obj) => obj.rowId === tempRowId)

          if (newRow) {
            await currentRequestRows[i].update(newRow)
          } else {
            currentRequestRows[i].destroy()
          }
        }
      }

      const reqId1 = typeof req.body.requestFormData.requisitionId

      if (reqId1 !== 'string') {
        await currentRequest.update(req.body.requestFormData)
        const currentUser = req.userInfo.email
        const priorityAList = await PriorityApproval.findAll({
          attributes: ['email', 'order']
        })
        const currentEmail = priorityAList.find((obj) => obj.email === currentUser)
        if (currentEmail) {
          const nextEmail = priorityAList.find(
            (obj) => obj.order === currentEmail.order + 1
          )
          if (nextEmail) {
            let currentVendor
            let currentAccount
            if (currentRequest.override_account) {
              const tempAccount = currentRequest.override_account.split('|')
              currentAccount = {
                name: tempAccount[0],
                code: tempAccount[1]
              }
            } else {
              tempAccount = await AccountCode.findOne({
                where: {
                  nanoid: currentRequest.accountId
                }
              })
              currentAccount = {
                name: tempAccount.description,
                code: `${tempAccount.fund}.${tempAccount.project}${
                  tempAccount.code1 +
                  tempAccount.code2 +
                  tempAccount.locationCode +
                  (tempAccount.code4 || '')
                }`.replaceAll('dc', '.')
              }
            }
            if (currentRequest.override_vendor) {
              const tempVendor = currentRequest.override_vendor.split('|')
              currentVendor = {
                name: tempVendor[0],
                vendorId: tempVendor[1]
              }
            } else {
              currentVendor = await Vendor.findOne({
                where: {
                  vendorId: currentRequest.vendorId
                }
              })
            }

            const requisitionData = {
              accountCode: currentAccount,
              vendor: currentVendor.name,
              vendorId: currentVendor.vendorId,
              shippingHandling: currentRequest.shippingHandling,
              notes: currentRequest.reason,
              quote: currentRequest.quote,
              items: req.body.items.map((row) => {
                return {
                  id: row.rowId,
                  quantity: row.quantity,
                  item_name: row.item_name,
                  description: row.description,
                  unit_price: row.unit_price,
                  total_price: row.total_price
                }
              }),
              name: `${userPoInfo.firstName} ${userPoInfo.lastName}`,
              email: userPoInfo.email
            }
            // console.log('==========================')
            // console.log(approvalEmail)
            // console.log('==========================')
            if (approvalEmail) {
              // after kaliegh approves, send msg finance with req
              await creatMsg({
                msg_type: 'poRequisition',
                send_to: approvalEmail.email,
                body: requisitionData
              })

              email(approvalEmail.email, requisitionInfo, null, requisitionData)
              email('test1@kickapps-dev.org', requisitionInfo, null, requisitionData)
              // console.log('======================')
              // console.log('secretary email: ', approvalEmail)
              // console.log('next approver email: ', nextEmail.email)
              // console.log('======================')
            }

            // after po is approved, send msg to the next approver
            await creatMsg({
              msg_type: 'poPending',
              send_to: nextEmail.email,
              body: null
            })

            email(nextEmail.email, poApproval, null, null)
          } else {
            // after pos final approval, send msg to creator
            await creatMsg({
              msg_type: 'poApproved',
              send_to: currentRequest.email,
              body: null
            })
            email(currentRequest.email, poFinalApproval, null, null)
          }
        } else {
          // after pos final approval, send msg to creator
          await creatMsg({
            msg_type: 'poApproved',
            send_to: currentRequest.email,
            body: null
          })
          email(currentRequest.email, poFinalApproval, null, null)
        }
      } else {
        await currentRequest.update({
          rejected: req.body.requestFormData.rejected,
          reason: req.body.requestFormData.reason,
          vendorId: req.body.requestFormData.vendorId,
          accountId: req.body.requestFormData.accountId,
          shippingHandling: req.body.requestFormData.shippingHandling,
          quote: req.body.requestFormData.quote || null,
          approvalLevel: 1,
          switch: null
        })

        const firstApprover = currentFlow.Approvals.find((obj) => obj.order === 1)

        // if a po has to be reset?
        await creatMsg({
          msg_type: 'poPending',
          send_to: firstApprover.email,
          body: null
        })
        email(firstApprover.email, poApproval, null, null)
      }

      res.status(200).json({ message: 'form updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updateRejection: async (req, res) => {
    try {
      const currentRequest = await RequestForm.findOne({
        where: {
          formId: req.body.formId
        }
      })

      const oldRows = await currentRequest.getRequests()
      for (const r of oldRows) {
        await r.destroy()
      }

      const newRows = await Request.bulkCreate(req.body.items)

      await currentRequest.addRequests(newRows)

      await currentRequest.update(req.body.requestFormData)

      res.status(200).json({ message: 'rejected form updated!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  approve_reject: async (req, res) => {
    try {
      const current = await RequestForm.findOne({
        where: { formId: req.body.id }
      })

      if (req.body.approval === 'approve') {
        const nextStage = req.body.stage.level + 1
        if (req.body.stage.switchName) {
          await current.update({
            switch: req.body.switch,
            approvalLevel: nextStage,
            reason: req.body.reason
          })
        } else {
          await current.update({
            approvalLevel: nextStage,
            reason: req.body.reason
          })
        }
        // await current.update({
        //   approvalLevel: req.body.stage.level + 1,
        //   reason: req.body.reason
        // })
        let approvalEmail
        if (nextStage > current.totalApprovers) {
          const pOrder = nextStage - current.totalApprovers
          const pa = await PriorityApproval.findOne({
            attibute: ['email'],
            where: {
              order: pOrder
            }
          })

          approvalEmail = pa.email
        } else {
          const currentFlow = await FormApproval.findOne({
            where: {
              id: current.requisitionId
            },
            include: [
              {
                model: Approval,
                attributes: ['switch', 'order', 'email'],
                where: {
                  order: {
                    [Op.eq]: nextStage
                  },
                  switch: req.body.switch
                }
              }
            ]
          })
          approvalEmail = currentFlow.Approvals[0].email
        }

        // EMAIL AFTER APPROVAL===================================
        // after po is approved, send msg to the next approver
        await creatMsg({
          msg_type: 'poPending',
          send_to: approvalEmail,
          body: null
        })
        email(approvalEmail, poApproval, null, null)
        // EMAIL AFTER APPROVAL===================================
      } else if (req.body.approval === 'reject') {
        await current.update({ rejected: true, reason: req.body.reason })

        const rejectionEmail = current.email
        // // SEND EMAILS, =====================================
        // after po is rejected, send msg to the creator
        await creatMsg({
          msg_type: 'poRejected',
          send_to: rejectionEmail,
          body: null
        })
        email(rejectionEmail, poRejection, null, null)
        // // SEND EMAILS, =====================================
      }

      res.status(200).json({ message: 'flow approved or rejected!' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  delete: async (req, res) => {
    try {
      const currentRequest = await RequestForm.findOne({
        where: req.body
      })
      if (currentRequest.quote) {
        s3Folders.deleteS3(s3Folders.quotes, currentRequest.quote)
      }
      await Request.destroy({
        where: {
          RequestFormId: currentRequest.id
        }
      })
      await currentRequest.destroy()
      res.status(200).json({ message: 'delete route' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  deletePriorityAproval: async (req, res) => {
    try {
      const allPriority = await PriorityApproval.findAll()
      const newPriorities = allPriority
        .filter((obj) => obj.nanoid !== req.body.id)
        .sort((a, b) => a.order - b.order)

      const oldPriority = allPriority.find((obj) => obj.nanoid === req.body.id)
      await oldPriority.destroy()

      for (let i = 0; i < newPriorities.length; i++) {
        await newPriorities[i].update({
          order: i + 1
        })
      }

      res.status(200).json({ message: 'Priority Approver has been removed.' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  uploadMedia: async (req, res) => {
    let currentFile = req.file.location
    const v1 = 'dc-schools-s3.s3.amazonaws.com'
    const v2 = 'dc-schools-s3.s3.us-east-2.amazonaws.com'
    const newV = 'files.dcschools.us'
    if (currentFile.includes(v1)) {
      currentFile = currentFile.split(v1).join(newV)
    } else {
      currentFile = currentFile.split(v2).join(newV)
    }
    res.status(200).send(currentFile)
  },
  requestFormData: async (req, res) => {
    try {
      const vendorList = await Vendor.findAll({
        attributes: [
          ['vendorId', 'value'],
          ['name', 'label']
        ]
      })
      // TURNED OFF BY REQUEST SO THE ACCOUNT CODE SETS TO A DEFAULT
      // const accountCodes = await AccountCode.findAll({
      //   attributes: [
      //     ['nanoid', 'value'],
      //     [fn('CONCAT', col('description'), ' | ', col('locationCode')), 'label'],
      //     'locationCode'
      //   ]
      // })
      const formFlows = await FormApproval.findAll({
        attributes: [['nanoid', 'id'], 'requisitionId', 'locationCode'],
        where: {
          active: true
        }
      })
      res.status(200).json({
        vendorList,
        // TURNED OFF BY REQUEST SO THE ACCOUNT CODE SETS TO A DEFAULT
        // accountCodes,
        formFlows
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
}
