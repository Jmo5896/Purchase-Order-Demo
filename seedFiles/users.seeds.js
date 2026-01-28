module.exports = async ({ Invite, StaffDetails, User }, req) => {
  const invitee = await Invite.findOne({
    where: {
      username: req.body.username,
      email: req.body.email
    }
  })
  const details = await StaffDetails.findOne({
    where: {
      email: req.body.email,
      active: true
    }
  })
  if (invitee && details) {
    try {
      const role = await invitee.getRole()
      const user = await User.create({
        // nanoid: nanoid(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      if (role) {
        await user.setRole(role)
      } else {
        const role = await Role.findOne({
          where: {
            name: 'staff'
          }
        })
        // set role to staff id number if undeclared
        await user.setRole(role)
      }

      await invitee.update({
        registered: true
      })

      await user.setStaffDetail(details)
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('missing invites or details')
  }
}
