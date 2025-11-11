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
    role: null,
    selectedRole: null, // 用戶選擇的身份別
    counselor_id: null, // 諮商師 ID
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
        // 保存完整的 role 數組（如果 API 返回的是數組）
        let roleValue = response.data.attributes.role || null
        // 如果是字符串，轉換為數組以便統一處理
        if (typeof roleValue === 'string') {
          roleValue = [roleValue]
        }
        // 如果為 null 或 undefined，設為空數組
        if (!roleValue) {
          roleValue = []
        }
        // 確保是數組格式
        if (!Array.isArray(roleValue)) {
          roleValue = []
        }
        this.role = roleValue
        // 登入時自動設置 selectedRole 為 role 的第一個元素（用於顯示）
        this.selectedRole = roleValue.length > 0 ? roleValue[0] : null
        // 保存 counselor_id（如果存在）
        this.counselor_id = response.data.attributes.counselor_id || null
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
        this.role = null
        this.selectedRole = null
        this.counselor_id = null
      })
    }
  },
  getters: {

  },
  persist: true

})