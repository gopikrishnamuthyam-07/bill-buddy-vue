import axios from 'axios'
import { getAccessToken } from '../config/config'

const baseURLProd = 'https://bill-buddy-dev.onrender.com/api'
const baseURLLocal = 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: baseURLProd,
  headers: {
    'Content-type': 'application/json'
  },
})
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken()
    console.log(accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance;