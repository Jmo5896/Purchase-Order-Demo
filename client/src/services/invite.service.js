import axios from 'axios'
// import authHeader from './auth-header'

// const API_URL = 'http://localhost:3001/auth/invite/'
const API_URL = '/auth/invite/'

const invite = {
  inviteUser: (content) => {
    return axios.post(
      `${API_URL}send`,
      content
      // , {
      //   headers: authHeader()
      // }
    )
  },
  resendInvite: (content) => {
    return axios.post(
      `${API_URL}resend`,
      content
      // , {
      //   headers: authHeader()
      // }
    )
  },
  deleteInvite: (content) => {
    return axios.put(
      `${API_URL}delete`,
      content
      // , {
      //   headers: authHeader()
      // }
    )
  },
  bugReport: (content) => {
    return axios.post(
      `${API_URL}bugReport`,
      content
      // , {
      //   headers: authHeader()
      // }
    )
  }
}

export default invite
