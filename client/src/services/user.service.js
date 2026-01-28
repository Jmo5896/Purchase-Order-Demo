import axios from 'axios'

const API_URL = '/auth/'

const user = {
  getPublicContent: () => {
    return axios.get(`${API_URL}public`)
  },
  getStaffBoard: () => {
    return axios.get(`${API_URL}staff`)
  },
  getDirectorBoard: (param) => {
    return axios.get(`${API_URL}director/${param}`)
  },
  getAdminBoard: () => {
    return axios.get(`${API_URL}admin`)
  },
  getSuperAdminBoard: () => {
    return axios.get(`${API_URL}superAdmin`)
  },
  addPermissions: (content) => {
    return axios.post(`${API_URL}permission`, content)
  },
  getPages: (content) => {
    return axios.post(`${API_URL}pages`, content)
  }
}

export default user
