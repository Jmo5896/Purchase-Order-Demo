import axios from 'axios'
// import authHeader from './auth-header'

// const API_URL = 'http://localhost:3001/auth/'
const API_URL = '/auth/'

const auth = {
  register: (username, email, password) => {
    return axios.post(`${API_URL}signup`, {
      username,
      email,
      password
    })
  },
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}signin`, {
      username,
      password
    })
    // if (response.data.accessToken) {
    //   const data = response.data
    //   data.createdAt = Date.now()
    //   localStorage.setItem('user', JSON.stringify(data))
    // }
    return response.data
  },
  logout: () => {
    return axios.get(`${API_URL}logout`)
  },
  getCurrentUser: () => {
    // return JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}current/user`)
  },
  // checkLocalToken: () => {
  //   const life = 12 * 60 * 60 * 1000
  //   if (JSON.parse(localStorage.getItem('user'))) {
  //     const userTime = JSON.parse(localStorage.getItem('user')).createdAt
  //     if (userTime < Date.now() - life) {
  //       localStorage.removeItem('user')
  //     }
  //   }
  // },
  deleteUser: (content) => {
    return axios.put(`${API_URL}delete/user`, content)
  },
  resetPassword: (content) => {
    return axios.put(`${API_URL}reset/password`, content)
  },
  checkPassword: (content) => {
    return axios.put(`${API_URL}check/password`, content)
  },
  sendUsername: (content) => {
    return axios.post(`${API_URL}send/username`, content)
  },
  sendPassword: (content) => {
    return axios.post(`${API_URL}send/password`, content)
  }
}

export default auth
