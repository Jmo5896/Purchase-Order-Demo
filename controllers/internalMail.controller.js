const { Message, User, Sequelize } = require('../models')
// const { fn, col } = Sequelize
const { dateFormatter } = require('../middleware')

const { Op } = Sequelize

module.exports = {
  getMsgs: async (req, res) => {
    try {
      // const regOrTrash = req.query.trash || false

      // const currentUserId = req.userInfo.id
      const currentUserEmail = req.userInfo.email
      const timestamp = new Date(new Date().setDate(new Date().getDate() - 30)) // this provides timestamp from 30 days ago

      await Message.destroy({
        where: {
          send_to: currentUserEmail,
          trash: true,
          updatedAt: {
            [Op.lte]: timestamp
          }
        }
      })

      const currentUser = await User.findOne({
        where: {
          email: currentUserEmail
        },
        include: [
          {
            model: Message,
            attributes: ['nanoid', 'msg_type', 'body', 'read', 'trash', 'createdAt']
            // where: {
            //   trash: regOrTrash
            // }
          }
        ]
      })

      const messages = currentUser
        ? currentUser.Messages.map((msg) => {
            return {
              nanoid: msg.nanoid,
              msg_type: msg.msg_type,
              body: msg.body,
              read: msg.read,
              trash: msg.trash,
              createdAt: dateFormatter(msg.createdAt)
            }
          })
        : []
      // console.log('=====================')
      // console.log(messages)
      // console.log('=====================')
      res.status(200).json(messages)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  creatMsg: async (msgInfo) => {
    try {
      //msgInfo = {msg_type, send_to, body}
      const response = await Message.create(msgInfo)
      const msgUser = await User.findOne({
        where: {
          email: msgInfo.send_to
        }
      })
      await msgUser.addMessage(response)
      return 'Message has been created!'
    } catch (err) {
      console.log(err)
      return err
    }
  },
  updateRead: async (req, res) => {
    try {
      const currentMsg = await Message.findOne({
        where: req.body
      })
      await currentMsg.update({ read: true })
      res.status(200).send('reading a msg')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  updateTrash: async (req, res) => {
    try {
      await Message.update(
        {
          trash: req.body.trash
        },
        {
          where: {
            nanoid: {
              [Op.or]: req.body.isCheck
            }
          }
        }
      )
      // console.log('====================')
      // console.log(req.body)
      // console.log(currentMsgs)
      // console.log('====================')
      res.status(200).send('trash has been updated')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  deleteMsgs: async (req, res) => {
    try {
      const currentEmail = req.userInfo.email

      await Message.destroy({
        where: {
          send_to: currentEmail,
          trash: true
        }
      })

      res.status(200).send('messages deleted.')
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}
