// Utilities
import { defineStore } from 'pinia'
import { authAPI, verifyTokenAPI } from '@/plugins/utils/requests/api/backend.js'
export const useAppStore = defineStore('app', {
  state: () => ({
    isDrawerOpen: false,
    isLogin: false,
    token: null,
    refreshToken: null,
    user_id: null,
    locale: 'zh-TW',
  }),
  actions: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    toggleLogin(account, password) {
      if (account === 'admin' && password === '123456') {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    async login(account, password) {
      // 驗證參數
      if (!account || !password) {
        throw new Error('Account and password are required')
      }
      
      const response = await authAPI({identification: account, password: password})
      console.log(response)
      if (response.meta.code === '2000') {
        this.token = response.meta.token
        this.refreshToken = response.meta.refresh_token
        this.user_id = response.data.attributes.uid
        this.isLogin = true
        return response
      } else {
        // 登入失敗時拋出錯誤，讓組件能夠捕獲並處理
        throw { response }
      }
    },
    async verifyToken() {
      const response = await verifyTokenAPI()
      console.log(response)
    },
    setLocale(locale) {
      this.locale = locale
    },
    logout() {
      this.isLogin = false
      this.$patch(() => {
        this.isDrawerOpen = false
        this.isLogin = false
        this.token = null
        this.refreshToken = null
        this.user_id = null
      })
    }
  },
  getters: {

  },
  persist: true

})