import axios from 'axios'
// import authHeader from './auth-header'

// const API_URL = 'http://localhost:3001/auth/invite/'
const API_URL = '/auth/bugReport/'

const bugs = {
  bugReport: (content) => {
    return axios.post(`${API_URL}`, content)
  },
  media: (file) => {
    return axios.post(`${API_URL}upload`, file)
  }
}

export default bugs
