const authJwt = require('./authJwt')
const verifySignUp = require('./verifySignUp')
const email = require('./email')

const dateFormatter = (dateStr) => {
  const d = new Date(dateStr)

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

module.exports = {
  authJwt,
  verifySignUp,
  email,
  dateFormatter
}
