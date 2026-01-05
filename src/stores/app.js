// Utilities
import { defineStore } from 'pinia'
import { authAPI, verifyTokenAPI, getOrgUserAPI } from '@/plugins/utils/requests/api/backend.js'
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
    myOrg: [], // 機構列表，以 org_id 為 key 的陣列
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
        
        // 如果 role 包含 'organization'，則查詢機構用戶資訊
        if (roleValue.includes('organization')) {
          this.fetchOrgUser(this.user_id)
        }
        
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
    // 查詢機構用戶資訊
    async fetchOrgUser(user_id) {
      console.log('=== 開始查詢機構用戶資訊 ===')
      console.log('查詢的 user_id:', user_id)
      
      try {
        const response = await getOrgUserAPI(user_id)
        console.log('=== API 回應 ===')
        console.log('完整回應:', response)
        console.log('回應 meta:', response.meta)
        console.log('回應 data:', response.data)
        
        if (response.meta.code === '2005' && response.data.attributes.organization_list) {
          console.log('=== 處理機構列表 ===')
          console.log('原始 organization_list:', response.data.attributes.organization_list)
          
          // 將 organization_list 轉換為以 org_id 為 key 的陣列格式
          const orgList = response.data.attributes.organization_list.map(org => ({
            org_id: org.org_id,
            org_name: org.org_name,
            org_code: org.org_code,
            is_admin: org.is_admin
          }))
          
          console.log('處理後的機構列表:', orgList)
          console.log('機構數量:', orgList.length)
          
          this.myOrg = orgList
          console.log('=== 已儲存到 appStore.myOrg ===')
          console.log('myOrg:', this.myOrg)
          console.log('myOrg 長度:', this.myOrg.length)
          
          // 詳細輸出每個機構的資訊
          orgList.forEach((org, index) => {
            console.log(`機構 ${index + 1}:`, {
              org_id: org.org_id,
              org_name: org.org_name,
              org_code: org.org_code,
              is_admin: org.is_admin
            })
          })
          
          console.log('=== 查詢機構用戶資訊完成 ===')
          return orgList
        } else {
          console.warn('=== 查詢機構用戶資訊失敗 ===')
          console.warn('回應碼:', response.meta?.code)
          console.warn('完整回應:', response)
          this.myOrg = []
          return []
        }
      } catch (error) {
        console.error('=== 查詢機構用戶資訊錯誤 ===')
        console.error('錯誤訊息:', error)
        console.error('錯誤堆疊:', error.stack)
        this.myOrg = []
        return []
      }
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
        this.myOrg = []
      })
    }
  },
  getters: {

  },
  persist: true

})