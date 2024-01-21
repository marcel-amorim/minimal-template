import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const axiosInstance = axios.create({ baseURL: BASE_URL })

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
)

export default axiosInstance
