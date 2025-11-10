<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleAlert } from '@/plugins/utils/alert'
import { getEventListAPI, createEventAPI, updateEventAPI, listDemoAccountAPI, createDemoAccountAPI, optionsCounselorList } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()

// 生成8碼小寫英數隨機代碼
const generateActivityCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 生成8碼小寫英數亂數密碼
const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// 生成演示帳號列表
const generateDemoAccounts = (workshop) => {
  const accounts = []
  const accountCount = workshop.accountCount || 0
  const prefix = workshop.accountPrefix || 'weprodemo'
  
  for (let i = 1; i <= accountCount; i++) {
    const username = `${prefix}${i}`
    let password = ''
    
    switch (workshop.passwordType) {
      case 'uniform':
        password = workshop.uniformPassword || ''
        break
      case 'serial':
        // 將編號格式化為四位數（例如：0001, 0002, 0003）
        const formattedNumber = i.toString().padStart(5, '0')
        password = (workshop.uniformPassword || '') + formattedNumber
        break
      case 'random':
        password = generateRandomPassword()
        break
      default:
        password = workshop.uniformPassword || ''
    }
    
    accounts.push({
      username,
      password,
      expiryDate: workshop.expiryDate,
      status: new Date(workshop.expiryDate) > new Date() ? 'active' : 'expired'
    })
  }
  
  return accounts
}

const search = ref('')
const headers = ref([
  { title: t('admin.workshop.activityName'), key: 'name' },
  { title: t('admin.workshop.activityCode'), key: 'code' },
  { title: t('admin.workshop.activityDate'), key: 'eventDate' },
  { title: t('admin.workshop.expiryDate'), key: 'expiryDate' },
  { title: t('admin.workshop.accountCount'), key: 'accountCount' },
  { title: t('admin.workshop.status'), key: 'status' },
  { title: t('admin.createdAt'), key: 'createdAt' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const workshops = ref([])
const loading = ref(false)

// 將後端活動資料映射到前端格式
const mapEventData = (backendEvent) => {
  return {
    id: backendEvent.id || null,
    name: backendEvent.event_name || '',
    code: backendEvent.event_code || '',
    eventDate: backendEvent.event_date || null,
    accountCount: parseInt(backendEvent.num_demo_account || '0', 10),
    createdAccounts: 0, // TODO: 從 API 獲取已創建的帳號數量
    expiryDate: backendEvent.expire_date || null,
    description: backendEvent.event_description || '',
    createdAt: backendEvent.created_at || null,
    st: backendEvent.st || '0', // 狀態：'0' = 未開始, '1' = 進行中, '2' = 已結束
    accountPrefix: 'weprodemo', // 預設值，可能需要從 API 獲取
    passwordType: 'uniform', // 預設值，可能需要從 API 獲取
    uniformPassword: '', // 預設值，可能需要從 API 獲取
    observerAccounts: backendEvent.default_counselors || backendEvent.observer_accounts || [],
    demoAccounts: [] // 儲存生成的帳號列表
  }
}

// 載入活動列表
const loadWorkshops = async () => {
  loading.value = true
  try {
    console.log('載入活動列表...')
    const response = await getEventListAPI()
    console.log('載入活動列表回應:', response)
    
    // 解析 API 回應
    // API 回應格式：{ data: { attributes: { event_list: [...] } } }
    // 攔截器解包後可能是：{ data: { attributes: { event_list: [...] } } } 或 { attributes: { event_list: [...] } }
    let eventList = []
    
    // 優先檢查 data.attributes.event_list（攔截器未解包的情況）
    if (response?.data?.attributes?.event_list) {
      eventList = response.data.attributes.event_list
      console.log('從 response.data.attributes.event_list 取得資料')
    } 
    // 檢查 attributes.event_list（攔截器已解包的情況）
    else if (response?.attributes?.event_list) {
      eventList = response.attributes.event_list
      console.log('從 response.attributes.event_list 取得資料')
    } 
    // 其他可能的格式
    else if (response?.event_list) {
      eventList = response.event_list
      console.log('從 response.event_list 取得資料')
    } else if (Array.isArray(response)) {
      eventList = response
      console.log('從 response 陣列取得資料')
    } else if (response?.data && Array.isArray(response.data)) {
      eventList = response.data
      console.log('從 response.data 陣列取得資料')
    }
    
    console.log('解析後的 eventList:', eventList)
    
    if (Array.isArray(eventList)) {
      workshops.value = eventList.map(mapEventData)
      console.log('載入完成，共', workshops.value.length, '筆活動資料')
      if (workshops.value.length === 0) {
        console.log('目前沒有活動資料')
      }
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.workshop.loadWorkshopsError') || '載入活動列表失敗'
      })
      workshops.value = []
    }
  } catch (error) {
    console.error('載入活動列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.loadWorkshopsError') || '載入活動列表失敗'
    })
    workshops.value = []
  } finally {
    loading.value = false
  }
}

// 初始化載入
onMounted(() => {
  loadWorkshops()
  loadCounselorOptions()
})

const editedItem = ref({
  id: null,
  name: '',
  code: '',
  eventDate: '',
  accountCount: 0,
  expiryDate: '',
  description: '',
  st: '0', // 狀態：'0' = 未開始, '1' = 進行中, '2' = 已結束，預設為未開始
  accountPrefix: 'weprodemo',
  passwordType: 'uniform', // 'uniform', 'serial', 'random'
  uniformPassword: '',
  observerAccounts: [] // 觀察者帳號列表
})

// 狀態選項
const statusOptions = [
  { title: t('admin.workshop.notStarted'), value: '0' },
  { title: t('admin.workshop.active'), value: '1' },
  { title: t('admin.workshop.ended'), value: '2' }
]

const dialog = ref(false)
const editMode = ref(false)
const viewDialog = ref(false)
const viewingItem = ref(null)
const accountsDialog = ref(false)
const viewingAccounts = ref([])
const loadingAccounts = ref(false)
const createAccountDialog = ref(false)
const creatingAccountWorkshop = ref(null)
const newAccountForm = ref({
  accountCount: 1
})

// 觀察者帳號相關
const observerSearch = ref('')
const availableUsers = ref([])
const loadingUsers = ref(false)

// 載入諮商師/觀察者列表
const loadCounselorOptions = async () => {
  loadingUsers.value = true
  try {
    console.log('載入諮商師/觀察者列表...')
    const response = await optionsCounselorList()
    console.log('載入諮商師/觀察者列表回應:', response)
    
    // 解析 API 回應
    // API 回應格式：{ data: { attributes: { counselor_list: [...] } } }
    let counselorList = []
    
    // 優先檢查 data.attributes.counselor_list（標準格式）
    if (response?.data?.attributes?.counselor_list) {
      counselorList = response.data.attributes.counselor_list
      console.log('從 response.data.attributes.counselor_list 取得資料')
    } 
    // 檢查 attributes.counselor_list（攔截器已解包的情況）
    else if (response?.attributes?.counselor_list) {
      counselorList = response.attributes.counselor_list
      console.log('從 response.attributes.counselor_list 取得資料')
    } 
    // 其他可能的格式
    else if (response?.counselor_list) {
      counselorList = response.counselor_list
      console.log('從 response.counselor_list 取得資料')
    } else if (Array.isArray(response)) {
      counselorList = response
      console.log('從 response 陣列取得資料')
    } else if (response?.data && Array.isArray(response.data)) {
      counselorList = response.data
      console.log('從 response.data 陣列取得資料')
    }
    
    console.log('解析後的 counselorList:', counselorList)
    
    if (Array.isArray(counselorList)) {
      // 將諮商師/觀察者列表映射為下拉選單格式
      // 格式：(counselor_code) name
      availableUsers.value = counselorList.map(counselor => {
        const code = counselor.counselor_code || ''
        const name = counselor.name || ''
        const displayText = code ? `(${code}) ${name}` : name
        return {
          title: displayText,
          value: counselor.id || counselor.counselor_code || ''
        }
      })
      console.log('載入完成，共', availableUsers.value.length, '筆諮商師/觀察者資料')
    } else {
      console.warn('API 回應格式不符合預期:', response)
      availableUsers.value = []
    }
  } catch (error) {
    console.error('載入諮商師/觀察者列表錯誤:', error)
    availableUsers.value = []
  } finally {
    loadingUsers.value = false
  }
}

// 統計信息
const stats = computed(() => [
  {
    title: t('admin.workshop.totalWorkshops'),
    value: workshops.value.length,
    icon: 'mdi-calendar-multiple',
    color: 'blue'
  },
  {
    title: t('admin.workshop.activeWorkshops'),
    value: workshops.value.filter(w => {
      if (!w.expiryDate) return false
      return new Date(w.expiryDate) > new Date()
    }).length,
    icon: 'mdi-check-circle',
    color: 'green'
  },
  {
    title: t('admin.workshop.totalAccounts'),
    value: workshops.value.reduce((sum, w) => sum + (w.createdAccounts || 0), 0),
    icon: 'mdi-account-multiple',
    color: 'orange'
  },
  {
    title: t('admin.workshop.pendingAccounts'),
    value: workshops.value.reduce((sum, w) => {
      const created = w.createdAccounts || 0
      const total = w.accountCount || 0
      return sum + Math.max(0, total - created)
    }, 0),
    icon: 'mdi-account-clock',
    color: 'purple'
  }
])

// 獲取狀態
const getStatus = (workshop) => {
  // 根據 st 欄位返回狀態：'0' = 未開始, '1' = 進行中, '2' = 已結束
  const status = workshop.st || '0'
  
  switch (status) {
    case '0':
      return { text: t('admin.workshop.notStarted'), color: 'grey' }
    case '1':
      return { text: t('admin.workshop.active'), color: 'success' }
    case '2':
      return { text: t('admin.workshop.ended'), color: 'error' }
    default:
      return { text: t('admin.workshop.notStarted'), color: 'grey' }
  }
}

const addWorkshop = () => {
  editedItem.value = {
    id: null,
    name: '',
    code: generateActivityCode(),
    eventDate: '',
    accountCount: 0,
    expiryDate: '',
    description: '',
    st: '0', // 預設為未開始
    accountPrefix: 'weprodemo',
    passwordType: 'uniform',
    uniformPassword: '',
    observerAccounts: []
  }
  editMode.value = false
  dialog.value = true
}

const editWorkshop = (item) => {
  editedItem.value = { ...item }
  editMode.value = true
  dialog.value = true
}

const saving = ref(false)

// 判斷活動是否已結束（只能查看，不能編輯）
const isEnded = computed(() => {
  return editMode.value && editedItem.value.st === '2'
})

const saveWorkshop = async () => {
  // 驗證必填欄位
  if (!editedItem.value.name || !editedItem.value.code) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.nameAndCodeRequired') || '活動名稱和活動代碼為必填'
    })
    return
  }

  // 驗證帳號前綴（僅在新增模式下驗證）
  if (!editMode.value && !editedItem.value.accountPrefix) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.prefixRequired') || '帳號前綴為必填'
    })
    return
  }

  // 驗證密碼設定（僅在新增模式下驗證）
  if (!editMode.value && (editedItem.value.passwordType === 'uniform' || editedItem.value.passwordType === 'serial')) {
    if (!editedItem.value.uniformPassword) {
      handleAlert({
        auction: 'error',
        text: t('admin.workshop.passwordRequired') || '預設密碼為必填'
      })
      return
    }
  }

  if (editMode.value) {
    // 編輯模式 - 調用 API 更新活動
    saving.value = true
    try {
      console.log('開始更新活動...')
      console.log('editedItem:', editedItem.value)
      
      // 準備 API 參數（不包含不能修改的欄位）
      const apiParams = {
        event_id: editedItem.value.id,
        event_name: editedItem.value.name,
        event_code: editedItem.value.code,
        event_description: editedItem.value.description || '',
        event_date: editedItem.value.eventDate || null,
        expire_date: editedItem.value.expiryDate || null,
        st: editedItem.value.st || '0',
        default_counselors: editedItem.value.observerAccounts || []
      }
      
      console.log('更新活動 API 參數:', apiParams)
      
      const response = await updateEventAPI(apiParams)
      console.log('更新活動 API 回應:', response)
      
      // 解析 API 回應
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
      
      // 檢查是否成功（通常 code 2005 或 2006 表示成功）
      if (responseCode === '2005' || responseCode === '2006' || responseStatus === '200') {
        handleAlert({
          auction: 'success',
          text: t('admin.workshop.updateWorkshopSuccess') || '活動更新成功'
        })
        
        // 關閉對話框
        dialog.value = false
        
        // 重新載入活動列表
        await loadWorkshops()
      } else {
        throw new Error(responseDetail || '更新活動失敗')
      }
    } catch (error) {
      console.error('更新活動錯誤:', error)
      const errorMessage = error?.response?.data?.meta?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          t('admin.workshop.updateWorkshopError') || 
                          '更新活動失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  } else {
    // 新增模式 - 調用 API 創建活動
    saving.value = true
    try {
      console.log('開始創建活動...')
      console.log('editedItem:', editedItem.value)
      
      // 準備 API 參數
      const apiParams = {
        event_name: editedItem.value.name,
        event_code: editedItem.value.code,
        event_description: editedItem.value.description || '',
        event_date: editedItem.value.eventDate || null,
        expire_date: editedItem.value.expiryDate || null,
        num_demo_account: String(editedItem.value.accountCount || 0),
        st: editedItem.value.st || '0',
        account_prefix: editedItem.value.accountPrefix,
        password_type: editedItem.value.passwordType || 'uniform',
        default_password: editedItem.value.uniformPassword || '',
        default_counselors: editedItem.value.observerAccounts || []
      }
      
      console.log('創建活動 API 參數:', apiParams)
      
      const response = await createEventAPI(apiParams)
      console.log('創建活動 API 回應:', response)
      
      // 解析 API 回應
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
      
      // 檢查是否成功（通常 code 2005 或 2006 表示成功）
      if (responseCode === '2005' || responseCode === '2006' || responseStatus === '200') {
        handleAlert({
          auction: 'success',
          text: t('admin.workshop.createWorkshopSuccess') || '活動創建成功'
        })
        
        // 關閉對話框
        dialog.value = false
        
        // 重新載入活動列表
        await loadWorkshops()
      } else {
        throw new Error(responseDetail || '創建活動失敗')
      }
    } catch (error) {
      console.error('創建活動錯誤:', error)
      const errorMessage = error?.response?.data?.meta?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          t('admin.workshop.createWorkshopError') || 
                          '創建活動失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  }
}

const regenerateCode = () => {
  editedItem.value.code = generateActivityCode()
}

const viewWorkshop = (item) => {
  viewingItem.value = { ...item }
  viewDialog.value = true
}

// 將後端演示帳號資料映射到前端格式
const mapDemoAccountData = (backendAccount, workshopExpiryDate = null) => {
  // 優先使用 plain_password，如果沒有則使用 password
  const password = backendAccount.plain_password || backendAccount.password || ''
  // 帳號欄位可能是 account 或 username
  const username = backendAccount.account || backendAccount.username || ''
  // 過期日期：優先使用帳號的過期日期，否則使用活動的過期日期
  const expiryDate = backendAccount.expire_date || backendAccount.expiry_date || workshopExpiryDate || null
  
  // 計算狀態
  let status = backendAccount.status
  if (!status && expiryDate) {
    status = new Date(expiryDate) > new Date() ? 'active' : 'expired'
  } else if (!status) {
    status = 'unknown'
  }
  
  return {
    username,
    password,
    expiryDate,
    status
  }
}

const viewAccounts = async (item) => {
  if (!item || !item.id) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.invalidEvent') || '無效的活動資料'
    })
    return
  }

  // 檢查活動是否已結束（st === '2' 表示已結束）
  if (item.st === '2') {
    viewingItem.value = item
    viewingAccounts.value = []
    accountsDialog.value = true
    return
  }

  viewingItem.value = item
  loadingAccounts.value = true
  viewingAccounts.value = []
  accountsDialog.value = true

  try {
    console.log('載入演示帳號列表...', item.id)
    const response = await listDemoAccountAPI(item.id)
    console.log('載入演示帳號列表回應:', response)
    
    // 解析 API 回應
    // API 回應格式：{ data: { attributes: { demo_account_list: [...] } } }
    let accountList = []
    
    // 優先檢查 data.attributes.demo_account_list（標準格式）
    if (response?.data?.attributes?.demo_account_list) {
      accountList = response.data.attributes.demo_account_list
      console.log('從 response.data.attributes.demo_account_list 取得資料')
    } 
    // 檢查 attributes.demo_account_list（攔截器已解包的情況）
    else if (response?.attributes?.demo_account_list) {
      accountList = response.attributes.demo_account_list
      console.log('從 response.attributes.demo_account_list 取得資料')
    } 
    // 兼容舊格式 account_list
    else if (response?.data?.attributes?.account_list) {
      accountList = response.data.attributes.account_list
      console.log('從 response.data.attributes.account_list 取得資料')
    } 
    else if (response?.attributes?.account_list) {
      accountList = response.attributes.account_list
      console.log('從 response.attributes.account_list 取得資料')
    }
    // 其他可能的格式
    else if (response?.demo_account_list) {
      accountList = response.demo_account_list
      console.log('從 response.demo_account_list 取得資料')
    } else if (response?.account_list) {
      accountList = response.account_list
      console.log('從 response.account_list 取得資料')
    } else if (Array.isArray(response)) {
      accountList = response
      console.log('從 response 陣列取得資料')
    } else if (response?.data && Array.isArray(response.data)) {
      accountList = response.data
      console.log('從 response.data 陣列取得資料')
    }
    
    console.log('解析後的 accountList:', accountList)
    
    if (Array.isArray(accountList)) {
      // 使用活動的過期日期作為備用
      const workshopExpiryDate = item.expiryDate || null
      viewingAccounts.value = accountList.map(account => mapDemoAccountData(account, workshopExpiryDate))
      console.log('載入完成，共', viewingAccounts.value.length, '筆演示帳號資料')
      console.log('映射後的帳號列表:', viewingAccounts.value)
      if (viewingAccounts.value.length === 0) {
        handleAlert({
          auction: 'info',
          text: t('admin.workshop.noDemoAccounts') || '目前沒有演示帳號'
        })
      }
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.workshop.loadAccountsError') || '載入演示帳號列表失敗'
      })
      viewingAccounts.value = []
    }
  } catch (error) {
    console.error('載入演示帳號列表錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.workshop.loadAccountsError') || 
                        '載入演示帳號列表失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
    viewingAccounts.value = []
  } finally {
    loadingAccounts.value = false
  }
}

const createDemoAccounts = (workshop) => {
  if (!workshop || !workshop.id) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.invalidEvent') || '無效的活動資料'
    })
    return
  }

  // 檢查活動是否已結束
  if (workshop.st === '2') {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.cannotCreateAccountsForEndedEvent') || '無法為已結束的活動創建帳號'
    })
    return
  }

  // 初始化表單
  creatingAccountWorkshop.value = workshop
  newAccountForm.value = {
    accountCount: 1
  }
  createAccountDialog.value = true
}

const savingAccounts = ref(false)

const saveNewAccounts = async () => {
  // 驗證表單
  if (!newAccountForm.value.accountCount || newAccountForm.value.accountCount <= 0) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.countRequired') || '帳號數量必須大於 0'
    })
    return
  }

  if (!creatingAccountWorkshop.value || !creatingAccountWorkshop.value.id) {
    handleAlert({
      auction: 'error',
      text: t('admin.workshop.invalidEvent') || '無效的活動資料'
    })
    return
  }

  savingAccounts.value = true
  try {
    console.log('開始創建測試帳號...')
    console.log('活動 ID:', creatingAccountWorkshop.value.id)
    console.log('帳號數量:', newAccountForm.value.accountCount)
    
    // 調用 API 創建測試帳號
    const response = await createDemoAccountAPI(
      creatingAccountWorkshop.value.id,
      String(newAccountForm.value.accountCount)
    )
    console.log('創建測試帳號 API 回應:', response)
    
    // 解析 API 回應
    const responseCode = response?.meta?.code || response?.data?.meta?.code
    const responseStatus = response?.meta?.status || response?.data?.meta?.status
    const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
    
    // 檢查是否成功（通常 code 2005 或 2006 表示成功）
    if (responseCode === '2005' || responseCode === '2006' || responseStatus === '200') {
      handleAlert({
        auction: 'success',
        text: t('admin.workshop.createAccountsSuccess') || '測試帳號創建成功'
      })
      
      // 關閉對話框
      createAccountDialog.value = false
      
      // 重新載入活動列表
      await loadWorkshops()
    } else {
      throw new Error(responseDetail || '創建測試帳號失敗')
    }
  } catch (error) {
    console.error('創建測試帳號錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.workshop.createAccountsError') || 
                        '創建測試帳號失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  } finally {
    savingAccounts.value = false
  }
}

const filteredWorkshops = computed(() => {
  if (!search.value) {
    return workshops.value
  }
  const searchLower = search.value.toLowerCase()
  return workshops.value.filter(w =>
    w.name?.toLowerCase().includes(searchLower) ||
    w.code?.toLowerCase().includes(searchLower)
  )
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <div class="workshop-management">
    <!-- 統計卡片 -->
    <v-row class="mb-4">
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          :color="stat.color"
          variant="tonal"
        >
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption mb-1">
                  {{ stat.title }}
                </div>
                <div class="text-h4 font-weight-bold">
                  {{ stat.value }}
                </div>
              </div>
              <v-icon
                size="48"
                :icon="stat.icon"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 搜尋和新增按鈕 -->
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          :label="t('admin.workshop.searchWorkshops')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="text-right"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="addWorkshop"
        >
          {{ t('admin.workshop.addWorkshop') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- 表格 -->
    <v-data-table
      :headers="headers"
      :items="filteredWorkshops"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template #item.code="{ item }">
        <v-chip
          color="primary"
          size="small"
          variant="outlined"
        >
          {{ item.code }}
        </v-chip>
      </template>

      <template #item.eventDate="{ item }">
        {{ formatDate(item.eventDate) }}
      </template>

      <template #item.expiryDate="{ item }">
        {{ formatDate(item.expiryDate) }}
      </template>

      <template #item.accountCount="{ item }">
        {{ item.accountCount || 0 }}
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="getStatus(item).color"
          size="small"
        >
          {{ getStatus(item).text }}
        </v-chip>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="viewWorkshop(item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editWorkshop(item)"
        />
        <v-btn
          icon="mdi-account-plus"
          size="small"
          variant="text"
          color="success"
          :disabled="item.st === '2'"
          @click="createDemoAccounts(item)"
          :title="t('admin.workshop.createAccounts')"
        />
        <v-btn
          icon="mdi-account-group"
          size="small"
          variant="text"
          @click="viewAccounts(item)"
          :title="t('admin.workshop.viewAccounts')"
        />
      </template>
    </v-data-table>

    <!-- 新增/編輯對話框 -->
    <v-dialog
      v-model="dialog"
      max-width="700px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ editMode ? t('admin.workshop.editWorkshop') : t('admin.workshop.addWorkshop') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <!-- 已結束活動提示 -->
          <v-alert
            v-if="isEnded"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('admin.workshop.endedEventReadOnly') }}
          </v-alert>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                :label="t('admin.workshop.activityName')"
                variant="outlined"
                :required="!isEnded"
                :disabled="isEnded"
              />
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="editedItem.code"
                :label="t('admin.workshop.activityCode')"
                variant="outlined"
                :required="!isEnded"
                :disabled="isEnded"
                :rules="[
                  v => !!v || t('admin.workshop.codeRequired'),
                  v => (v && v.length === 8 && /^[a-z0-9]+$/.test(v)) || t('admin.workshop.codeInvalid')
                ]"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-btn
                color="primary"
                variant="outlined"
                block
                prepend-icon="mdi-refresh"
                :disabled="isEnded"
                @click="regenerateCode"
              >
                {{ t('admin.workshop.regenerateCode') }}
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.eventDate"
                :label="t('admin.workshop.activityDate')"
                variant="outlined"
                type="datetime-local"
                :disabled="isEnded"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model.number="editedItem.accountCount"
                :label="t('admin.workshop.accountCount')"
                variant="outlined"
                type="number"
                min="0"
                :required="!editMode && !isEnded"
                :disabled="editMode || isEnded"
                :rules="[
                  v => v !== null && v !== undefined && v >= 0 || t('admin.workshop.countRequired')
                ]"
                :hint="(editMode || isEnded) ? t('admin.workshop.cannotModify') : ''"
                persistent-hint
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.accountPrefix"
                :label="t('admin.workshop.accountPrefix')"
                variant="outlined"
                :required="!editMode && !isEnded"
                :disabled="editMode || isEnded"
                :rules="[
                  v => !!v || t('admin.workshop.prefixRequired')
                ]"
                :hint="(editMode || isEnded) ? t('admin.workshop.cannotModify') : t('admin.workshop.prefixHint')"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" />
              <div class="text-subtitle-2 mb-2">
                {{ t('admin.workshop.passwordSettings') }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-radio-group
                v-model="editedItem.passwordType"
                :label="t('admin.workshop.passwordType')"
                :disabled="editMode || isEnded"
              >
                <v-radio
                  :label="t('admin.workshop.passwordUniform')"
                  value="uniform"
                />
                <v-radio
                  :label="t('admin.workshop.passwordSerial')"
                  value="serial"
                />
                <v-radio
                  :label="t('admin.workshop.passwordRandom')"
                  value="random"
                />
              </v-radio-group>
              <div
                v-if="editMode || isEnded"
                class="text-caption text-medium-emphasis mt-1"
              >
                {{ t('admin.workshop.cannotModify') }}
              </div>
            </v-col>
            <v-col
              v-if="editedItem.passwordType === 'uniform' || editedItem.passwordType === 'serial'"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.uniformPassword"
                :label="t('admin.workshop.uniformPassword')"
                variant="outlined"
                type="password"
                :required="!editMode && !isEnded"
                :disabled="editMode || isEnded"
                :rules="[
                  v => !!v || t('admin.workshop.passwordRequired')
                ]"
                :hint="(editMode || isEnded) ? t('admin.workshop.cannotModify') : (editedItem.passwordType === 'serial' ? t('admin.workshop.passwordSerialHint') : '')"
                persistent-hint
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.expiryDate"
                :label="t('admin.workshop.expiryDate')"
                variant="outlined"
                type="datetime-local"
                :required="!isEnded"
                :disabled="isEnded"
                :rules="[
                  v => !!v || t('admin.workshop.expiryRequired'),
                  v => {
                    if (!v) return true
                    const selectedDate = new Date(v)
                    const now = new Date()
                    return selectedDate > now || t('admin.workshop.expiryMustBeFuture')
                  }
                ]"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="editedItem.st"
                :items="statusOptions"
                :label="t('admin.workshop.status')"
                variant="outlined"
                :required="!isEnded"
                :disabled="isEnded"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.description"
                :label="t('admin.description')"
                variant="outlined"
                rows="3"
                :disabled="isEnded"
              />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" />
              <div class="text-subtitle-2 mb-2">
                {{ t('admin.workshop.observerAccounts') }}
              </div>
              <v-autocomplete
                v-model="editedItem.observerAccounts"
                :items="availableUsers"
                :label="t('admin.workshop.observerAccountInput')"
                variant="outlined"
                multiple
                chips
                closable-chips
                :disabled="isEnded"
                :loading="loadingUsers"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-icon="'mdi-account'"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ t('admin.workshop.noUserFound') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <div class="text-caption text-medium-emphasis mt-1">
                {{ t('admin.workshop.observerAccountHint') }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="dialog = false"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :loading="saving"
            :disabled="saving || isEnded"
            @click="saveWorkshop"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 查看對話框 -->
    <v-dialog
      v-model="viewDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.workshop.workshopDetails') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row v-if="viewingItem">
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.activityName') }}
              </div>
              <div class="text-h6 mb-4">
                {{ viewingItem.name }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.activityCode') }}
              </div>
              <div class="mb-4">
                <v-chip
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  {{ viewingItem.code }}
                </v-chip>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.status') }}
              </div>
              <div class="mb-4">
                <v-chip
                  :color="getStatus(viewingItem).color"
                  size="small"
                >
                  {{ getStatus(viewingItem).text }}
                </v-chip>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.accountCount') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.accountCount || 0 }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.createdAccounts') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.createdAccounts || 0 }} / {{ viewingItem.accountCount || 0 }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.expiryDate') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ formatDate(viewingItem.expiryDate) }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.description') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.description || '-' }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.workshop.observerAccounts') }}
              </div>
              <div
                v-if="viewingItem.observerAccounts && viewingItem.observerAccounts.length > 0"
                class="mb-4"
              >
                <v-chip
                  v-for="(account, index) in viewingItem.observerAccounts"
                  :key="index"
                  class="mr-2 mb-2"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-account"
                >
                  {{ account }}
                </v-chip>
              </div>
              <div
                v-else
                class="text-body-1 mb-4"
              >
                -
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.createdAt') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ formatDate(viewingItem.createdAt) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="viewDialog = false"
          >
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 演示帳號列表對話框 -->
    <v-dialog
      v-model="accountsDialog"
      max-width="900px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.workshop.demoAccounts') }} - {{ viewingItem?.name }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <!-- 活動已結束時顯示訊息 -->
          <v-alert
            v-if="viewingItem?.st === '2'"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('admin.workshop.eventClosedAccountsRemoved') || '該活動已關閉，已移除測試帳號' }}
          </v-alert>
          
          <!-- 活動未結束時顯示帳號列表 -->
          <v-data-table
            v-else
            :headers="[
              { title: t('admin.workshop.accountUsername'), key: 'username' },
              { title: t('admin.workshop.accountPassword'), key: 'password' },
              { title: t('admin.workshop.accountExpiry'), key: 'expiryDate' },
              { title: t('admin.workshop.accountStatus'), key: 'status' }
            ]"
            :items="viewingAccounts"
            :loading="loadingAccounts"
          >
            <template #item.password="{ item }">
              <div class="d-flex align-center">
                <span class="mr-2">{{ item.password || '***' }}</span>
                <v-btn
                  icon="mdi-content-copy"
                  size="x-small"
                  variant="text"
                  @click="copyToClipboard(item.password)"
                />
              </div>
            </template>
            <template #item.expiryDate="{ item }">
              {{ formatDate(item.expiryDate) }}
            </template>
            <template #item.status="{ item }">
              <v-chip
                :color="new Date(item.expiryDate) > new Date() ? 'success' : 'error'"
                size="small"
              >
                {{ new Date(item.expiryDate) > new Date() ? t('admin.workshop.active') : t('admin.workshop.expired') }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="accountsDialog = false"
          >
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 新增測試帳號對話框 -->
    <v-dialog
      v-model="createAccountDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.workshop.createDemoAccounts') }} - {{ creatingAccountWorkshop?.name }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.number="newAccountForm.accountCount"
                :label="t('admin.workshop.accountCount')"
                variant="outlined"
                type="number"
                min="1"
                :rules="[
                  v => v !== null && v !== undefined && v > 0 || t('admin.workshop.countRequired')
                ]"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="createAccountDialog = false"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :loading="savingAccounts"
            :disabled="savingAccounts"
            @click="saveNewAccounts"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // TODO: 顯示複製成功訊息
      }).catch(() => {
        // TODO: 顯示複製失敗訊息
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workshop-management {
  padding: 8px 0;

  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }
}
</style>

