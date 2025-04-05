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
    const appStore = useAppStore()
    switch(event.response.status) {
      case 300:
        return event.response.data
      case 401:
        appStore.logout()
        if(window.location.origin === 'https://keoinn.github.io'){
          window.location.href = 'https://keoinn.github.io/synetapp-infinity-card/'
        } else {
          window.location.href = '/login'
        }
        return event.response.data
      default:
        return Promise.reject(event)
    }
  }
)
