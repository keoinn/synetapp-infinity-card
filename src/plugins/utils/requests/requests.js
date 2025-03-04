import axios from 'axios'
import { useAppStore } from '@/stores/app'

const API_BASEURL = import.meta.env.VITE_API_BASEURL

const requestInstance = axios.create({
  baseURL: API_BASEURL,
  timeout: 300000
})

export default requestInstance

// Request前處理
requestInstance.interceptors.request.use(
  (config) => {
    const appStore = useAppStore()
    if (appStore.token) {
      config.headers.Authorization = `Bearer ${appStore.token}`
    }
    if (appStore.refreshToken) {
      config.headers['Refresh-Token'] = `Bearer ${appStore.refreshToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// Response後處理
requestInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (event) => {
    if (event.response.status === 401) {
      console.log('401')
    } else if (event.response.status === 403) {
      console.log('403')
    } else if (event.response.status === 404) {
      console.log('404')
    } else if (event.response.status === 500) {
      console.log('500')
    }
    return Promise.reject(event)
  }
)
