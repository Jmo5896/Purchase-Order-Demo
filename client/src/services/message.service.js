import axios from 'axios'

const API_URL = '/api/messages/'

const poflow = {
  getMsgs: () => {
    return axios.get(`${API_URL}`)
  },
  updateRead: (content) => {
    return axios.put(`${API_URL}read`, content)
  },
  updateTrash: (content) => {
    return axios.put(`${API_URL}trash`, content)
  },
  deleteMsgs: () => {
    return axios.put(`${API_URL}delete`)
  }
}

export default poflow
