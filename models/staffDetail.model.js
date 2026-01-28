module.exports = (sequelize, Sequelize) => {
  const StaffDetails = sequelize.define('StaffDetails', {
    prefix: {
      type: Sequelize.STRING(8),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [0, 8]
      }
    },
    firstName: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    lastName: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [3, 50]
      }
    },
    avatarURL: {
      type: Sequelize.STRING(150),
      allowNull: true,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    backgroundURL: {
      type: Sequelize.STRING(150),
      allowNull: true,
      validate: {
        isUrl: true,
        len: [0, 150]
      }
    },
    facility: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    title: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 60]
      }
    },
    subject_grade: {
      type: Sequelize.STRING(30),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 30]
      }
    },
    courses_role: {
      type: Sequelize.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    phone: {
      type: Sequelize.STRING(13),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 13]
      }
    },
    ext: {
      type: Sequelize.STRING(5),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\-_. ]+$/i,
        len: [1, 5]
      }
    },
    central_staff: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  })

  return StaffDetails
}
