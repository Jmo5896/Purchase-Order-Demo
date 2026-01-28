import axios from 'axios'

const API_URL = '/api/details/'

const details = {
  get: () => {
    return axios.get(`${API_URL}`)
  },
  create: (content) => {
    return axios.post(`${API_URL}create`, content)
  },
  createStaff: (content) => {
    return axios.post(`${API_URL}create/staff`, content)
  },
  update: (content) => {
    return axios.put(`${API_URL}update`, content)
  },
  delete: (content) => {
    return axios.put(`${API_URL}delete`, content)
  },
  media: (file, key) => {
    return axios.post(`${API_URL}upload/${key}`, file)
  }
}

export default details
