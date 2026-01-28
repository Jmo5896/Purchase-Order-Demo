const { StaffDetails, Sequelize } = require('../models')
const { Op } = Sequelize

module.exports = {
  findCentralStaff: async (req, res) => {
    try {
      const centralStaff = await StaffDetails.findAll({
        attributes: ['firstName', 'lastName', 'email', 'title', 'phone', 'ext'],
        where: {
          central_staff: 1,
          active: true
        }
      })

      res.status(200).send(centralStaff)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  findAll: async (req, res) => {
    try {
      const staff = await StaffDetails.findAll({
        attributes: [
          'prefix',
          'firstName',
          'lastName',
          'email',
          'facility',
          'title',
          'avatarURL',
          'backgroundURL',
          'subject_grade',
          'courses_role',
          'phone',
          'ext',
          'central_staff'
          // 'active'
        ],
        where: {
          facility: {
            [Op.not]: 'KICKapps'
          },
          active: req.body.active
          // active: req.body.active
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC']
        ]
      })
      const facilities = []
      const cleanStaff = staff.map((obj) => {
        if (!facilities.includes(obj.facility)) {
          facilities.push(obj.facility)
        }

        return {
          tdata: {
            first: obj.firstName,
            last: obj.lastName,
            email: obj.email,
            facility: obj.facility,
            title: obj.title,
            avatarURL: obj.avatarURL
          },
          profile: obj.dataValues
        }
      })

      res.status(200).json({ facilities, content: cleanStaff })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  findOne: async (req, res) => {
    try {
      let staff
      if (req.body.board) {
        staff = await StaffDetails.findAll({
          attributes: ['prefix', 'firstName', 'lastName', 'email', 'title', 'avatarURL'],
          where: {
            title: {
              [Op.like]: '%Board Member%'
            },
            active: true
          }
        })
      } else {
        staff = await StaffDetails.findAll({
          attributes: [
            'prefix',
            'firstName',
            'lastName',
            'email',
            'facility',
            'title',
            'avatarURL',
            'phone',
            'ext'
          ],
          where: { ...req.body, active: true }
        })
      }

      res.status(200).json(staff)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  findFacility: async (req, res) => {
    try {
      const facility = req.body.school
      const grade = facility.split(' ')[2]
      const staff = await StaffDetails.findAll({
        attributes: [
          'prefix',
          'firstName',
          'lastName',
          'email',
          'facility',
          'title',
          'avatarURL',
          'backgroundURL',
          'subject_grade',
          'courses_role',
          'phone',
          'ext'
        ],
        where: {
          facility: {
            [Op.not]: 'KICKapps'
          },
          active: true,
          facility
        }
      })
      const cleanStaff = staff.map((obj) => {
        return {
          tdata: {
            first: obj.firstName,
            last: obj.lastName,
            email: obj.email,
            title: obj.title,
            [grade === 'Elementary' || grade === 'Middle' ? 'grade' : 'subject']:
              obj.subject_grade,
            courses: obj.courses_role,
            avatarURL: obj.avatarURL
          },
          profile: obj.dataValues
        }
      })

      res.status(200).json({ content: cleanStaff })
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
