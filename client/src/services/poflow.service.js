import axios from 'axios'

const API_URL = '/api/poflow/'

const poflow = {
  getAll: () => {
    return axios.post(`${API_URL}`)
  },
  getApprover: () => {
    return axios.get(`${API_URL}approver`)
  },
  getHistory: () => {
    return axios.post(`${API_URL}history`)
  },
  getApprovalHistory: () => {
    return axios.post(`${API_URL}history/approval`)
  },
  getRejected: () => {
    return axios.get(`${API_URL}rejected`)
  },
  getMyPending: () => {
    return axios.get(`${API_URL}my/pending`)
  },
  getApprovalEmails: () => {
    return axios.get(`${API_URL}emails`)
  },
  checkVendor: (content) => {
    return axios.post(`${API_URL}vendor/check`, content)
  },
  create: (content) => {
    return axios.post(`${API_URL}create`, content)
  },
  createApproval: (content) => {
    return axios.post(`${API_URL}create/approval`, content)
  },
  createPriorityApproval: (content) => {
    return axios.post(`${API_URL}create/priority`, content)
  },
  createVendor: (content) => {
    return axios.post(`${API_URL}vendor/add`, content)
  },
  update: (content) => {
    return axios.put(`${API_URL}update`, content)
  },
  updateForm: (content) => {
    return axios.put(`${API_URL}update/form`, content)
  },
  updateRejection: (content) => {
    return axios.put(`${API_URL}update/reject`, content)
  },
  updatePriorityOrder: (content) => {
    return axios.put(`${API_URL}update/priority`, content)
  },
  status: (content) => {
    return axios.put(`${API_URL}status`, content)
  },
  delete: (content) => {
    return axios.put(`${API_URL}delete`, content)
  },
  deletePriorityApproval: (content) => {
    return axios.put(`${API_URL}delete/priority`, content)
  },
  getVendors: () => {
    return axios.get(`${API_URL}vendors`)
  },
  getAddresses: (content) => {
    return axios.post(`${API_URL}addresses`, content)
  },
  requestFormData: () => {
    return axios.get(`${API_URL}request/data`)
  },
  getAcounts: () => {
    return axios.get(`${API_URL}accounts`)
  },
  media: (file) => {
    return axios.post(`${API_URL}upload`, file)
  }
}

export default poflow
