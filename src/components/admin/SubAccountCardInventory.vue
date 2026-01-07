<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { handleAlert } from '@/plugins/utils/alert'
import { optionsOrgList, optionsSubAccountWithInventoryList, updateSubAccountInventoryAdminAPI, getOrgCardInventoryAdminAPI, createOrgReportAPI } from '@/plugins/utils/requests/api/backend'
import CardCaseInventory from '@/components/inventory/CardCaseInventory.vue'

const { t } = useI18n()
const appStore = useAppStore()

// 檢查是否為機構角色
const isOrganizationRole = computed(() => {
  return appStore.selectedRole === 'organization' || appStore.selectedRole === 'org'
})

// 檢查是否只有 1 個組織
const hasSingleOrg = computed(() => {
  return organizations.value.length === 1
})

// 檢查當前選擇的組織是否有管理員權限
const hasAdminPermission = computed(() => {
  if (!isOrganizationRole.value || !selectedOrg.value) {
    return true // 非機構角色或未選擇組織時，預設有權限
  }
  
  // 從 appStore.myOrg 中查找對應的組織
  const org = appStore.myOrg.find(o => o.org_id === selectedOrg.value.id)
  return org ? org.is_admin === '1' : false
})

// 機構選擇
const selectedOrg = ref(null)
const organizations = ref([])
const orgLoading = ref(false)

// 將後端機構資料映射到前端格式
const mapOrgData = (backendOrg) => {
  return {
    id: backendOrg.id || backendOrg.org_id,
    name: backendOrg.org_name || backendOrg.name || '',
    code: backendOrg.org_code || backendOrg.code || ''
  }
}

// 載入機構列表
const loadOrganizations = async () => {
  orgLoading.value = true
  try {
    // 如果是機構角色，從 appStore.myOrg 讀取
    if (isOrganizationRole.value) {
      console.log('機構角色：從 appStore.myOrg 讀取組織列表')
      console.log('appStore.myOrg:', appStore.myOrg)
      
      if (Array.isArray(appStore.myOrg) && appStore.myOrg.length > 0) {
        // 將 myOrg 轉換為組織格式
        organizations.value = appStore.myOrg.map(org => ({
          id: org.org_id,
          name: org.org_name,
          code: org.org_code
        }))
        
        console.log('載入完成，共', organizations.value.length, '筆機構資料')
        
        // 如果有機構且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.log('appStore.myOrg 為空或不是陣列')
        organizations.value = []
      }
    } else {
      // 管理員角色：從 API 讀取所有機構
      console.log('載入機構列表...')
      const response = await optionsOrgList('all')
      console.log('載入機構列表回應:', response)
      
      // 解析 API 回應（支援多種格式）
      let orgList = []
      
      if (response?.data?.attributes?.org_list || response?.data?.attributes?.organization_list) {
        orgList = response.data.attributes.org_list || response.data.attributes.organization_list
      } else if (response?.attributes?.org_list || response?.attributes?.organization_list) {
        orgList = response.attributes.org_list || response.attributes.organization_list
      } else if (response?.org_list || response?.organization_list) {
        orgList = response.org_list || response.organization_list
      } else if (Array.isArray(response)) {
        orgList = response
      } else if (response?.data && Array.isArray(response.data)) {
        orgList = response.data
      }
      
      if (Array.isArray(orgList) && orgList.length > 0) {
        organizations.value = orgList.map(mapOrgData)
        console.log('載入完成，共', organizations.value.length, '筆機構資料')
        
        // 如果有機構且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.warn('API 回應格式不符合預期:', response)
        handleAlert({
          auction: 'error',
          text: t('admin.loadOrganizationsError') || '載入機構資料失敗'
        })
        organizations.value = []
      }
    }
  } catch (error) {
    console.error('載入機構列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadOrganizationsError') || '載入機構資料失敗'
    })
    organizations.value = []
  } finally {
    orgLoading.value = false
  }
}

// 子帳號列表
const subAccounts = ref([])
const subAccountsLoading = ref(false)

// 當前選擇的子帳號
const selectedSubAccount = ref(null)

// 將後端附屬帳號資料映射到前端格式
const mapSubAccountData = (backendMember, orgId) => {
  // API 回應中使用 user_id 而不是 member_id
  // 如果沒有 org_id，使用傳入的 orgId 參數
  const memberId = backendMember.user_id || backendMember.member_id || backendMember.id
  const accountOrgId = backendMember.org_id || orgId
  
  return {
    id: String(memberId), // 統一轉為字串以便匹配
    orgId: String(accountOrgId), // 統一轉為字串以便匹配
    name: backendMember.org_user_name || '',
    email: backendMember.email || '',
    username: backendMember.account || String(memberId) || '',
    role: backendMember.role || 'member',
    memberCardInventoryId: backendMember.member_card_inventory_id || null, // 保存庫存 ID
    inventory: {
      goal: parseInt(backendMember.goal || '0', 10),
      care: parseInt(backendMember.care || '0', 10),
      ce: parseInt(backendMember.ce || '0', 10),
      cj: parseInt(backendMember.cj || '0', 10),
      lj: parseInt(backendMember.lj || '0', 10),
      le: parseInt(backendMember.le || '0', 10)
    },
    used: parseInt(backendMember.used || '0', 10)
  }
}

// 載入附屬帳號列表（包含庫存）
const loadSubAccounts = async (orgId) => {
  if (!orgId) {
    subAccounts.value = []
    selectedSubAccount.value = null
    currentInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
    return
  }

  subAccountsLoading.value = true
  try {
    console.log('載入附屬帳號列表...', orgId)
    const response = await optionsSubAccountWithInventoryList(orgId)
    console.log('載入附屬帳號列表回應:', response)
    
    // 解析 API 回應
    // API 回應格式：{ data: { attributes: { member_list: [...] } } }
    // 攔截器解包後可能是：{ data: { attributes: { member_list: [...] } } } 或 { attributes: { member_list: [...] } }
    let memberList = []
    
    // 優先檢查 data.attributes.member_list（攔截器未解包的情況）
    if (response?.data?.attributes?.member_list) {
      memberList = response.data.attributes.member_list
      console.log('從 response.data.attributes.member_list 取得資料')
    } 
    // 檢查 attributes.member_list（攔截器已解包的情況）
    else if (response?.attributes?.member_list) {
      memberList = response.attributes.member_list
      console.log('從 response.attributes.member_list 取得資料')
    } 
    // 其他可能的格式
    else if (response?.member_list) {
      memberList = response.member_list
      console.log('從 response.member_list 取得資料')
    } else if (Array.isArray(response)) {
      memberList = response
      console.log('從 response 陣列取得資料')
    } else if (response?.data && Array.isArray(response.data)) {
      memberList = response.data
      console.log('從 response.data 陣列取得資料')
    }
    
    console.log('解析後的 memberList:', memberList)
    
    if (Array.isArray(memberList)) {
      // 傳入 orgId 以便在映射時使用（如果 API 回應中沒有 org_id）
      subAccounts.value = memberList.map(member => mapSubAccountData(member, orgId))
      console.log('載入完成，共', subAccounts.value.length, '筆附屬帳號資料')
      if (subAccounts.value.length > 0) {
        console.log('附屬帳號資料詳情:', subAccounts.value)
      } else {
        console.log('該機構沒有附屬帳號')
      }
    } else {
      console.warn('API 回應格式不符合預期:', response)
      console.warn('嘗試解析的路徑:', {
        'response?.data?.attributes?.member_list': response?.data?.attributes?.member_list,
        'response?.attributes?.member_list': response?.attributes?.member_list,
        'response?.member_list': response?.member_list,
        'Array.isArray(response)': Array.isArray(response),
        'response?.data': response?.data
      })
      handleAlert({
        auction: 'error',
        text: t('admin.loadSubAccountsError') || '載入附屬帳號資料失敗'
      })
      subAccounts.value = []
    }
  } catch (error) {
    console.error('載入附屬帳號列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadSubAccountsError') || '載入附屬帳號資料失敗'
    })
    subAccounts.value = []
  } finally {
    subAccountsLoading.value = false
  }
}

// 機構庫存
const orgInventory = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})
const orgInventoryLoading = ref(false)

// 當前選擇帳號的庫存
const currentInventory = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})

// 將後端機構庫存資料映射到前端格式
const mapOrgInventoryData = (backendInventory) => {
  return {
    goal: parseInt(backendInventory.goal || '0', 10),
    care: parseInt(backendInventory.care || '0', 10),
    ce: parseInt(backendInventory.ce || '0', 10),
    cj: parseInt(backendInventory.cj || '0', 10),
    lj: parseInt(backendInventory.lj || '0', 10),
    le: parseInt(backendInventory.le || '0', 10)
  }
}

// 載入機構庫存
const loadOrgInventory = async (orgId) => {
  if (!orgId) {
    orgInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
    return
  }

  orgInventoryLoading.value = true
  try {
    console.log('載入機構庫存...', orgId)
    const response = await getOrgCardInventoryAdminAPI(orgId)
    console.log('載入機構庫存回應:', response)
    
    // 解析 API 回應
    let inventoryList = []
    
    if (response?.data?.attributes?.org_card_inventory_detail) {
      inventoryList = response.data.attributes.org_card_inventory_detail
    } else if (response?.attributes?.org_card_inventory_detail) {
      inventoryList = response.attributes.org_card_inventory_detail
    } else if (response?.org_card_inventory_detail) {
      inventoryList = response.org_card_inventory_detail
    } else if (Array.isArray(response)) {
      inventoryList = response
    }
    
    if (Array.isArray(inventoryList) && inventoryList.length > 0) {
      orgInventory.value = mapOrgInventoryData(inventoryList[0])
      console.log('載入完成，機構庫存:', orgInventory.value)
    } else {
      console.warn('API 回應格式不符合預期:', response)
      orgInventory.value = {
        goal: 0,
        care: 0,
        ce: 0,
        cj: 0,
        lj: 0,
        le: 0
      }
    }
  } catch (error) {
    console.error('載入機構庫存錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadInventoryError') || '載入機構庫存失敗'
    })
    orgInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
  } finally {
    orgInventoryLoading.value = false
  }
}

// 計算可用庫存（機構庫存 - 已分配給其他附屬帳號的庫存）
const availableInventory = computed(() => {
  if (!selectedOrg.value) {
    return {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
  }

  // 計算所有附屬帳號的庫存總和（排除當前選擇的附屬帳號）
  const totalAllocated = {
    goal: 0,
    care: 0,
    ce: 0,
    cj: 0,
    lj: 0,
    le: 0
  }

  subAccounts.value.forEach(account => {
    // 排除當前選擇的附屬帳號
    if (selectedSubAccount.value && account.id === selectedSubAccount.value.id) {
      return
    }
    
    if (account.inventory) {
      totalAllocated.goal += account.inventory.goal || 0
      totalAllocated.care += account.inventory.care || 0
      totalAllocated.ce += account.inventory.ce || 0
      totalAllocated.cj += account.inventory.cj || 0
      totalAllocated.lj += account.inventory.lj || 0
      totalAllocated.le += account.inventory.le || 0
    }
  })

  // 計算可用庫存 = 機構庫存 - 已分配給其他附屬帳號的庫存 + 當前附屬帳號的庫存
  const currentAccountInventory = selectedSubAccount.value?.inventory || {
    goal: 0,
    care: 0,
    ce: 0,
    cj: 0,
    lj: 0,
    le: 0
  }

  return {
    goal: orgInventory.value.goal - totalAllocated.goal + currentAccountInventory.goal,
    care: orgInventory.value.care - totalAllocated.care + currentAccountInventory.care,
    ce: orgInventory.value.ce - totalAllocated.ce + currentAccountInventory.ce,
    cj: orgInventory.value.cj - totalAllocated.cj + currentAccountInventory.cj,
    lj: orgInventory.value.lj - totalAllocated.lj + currentAccountInventory.lj,
    le: orgInventory.value.le - totalAllocated.le + currentAccountInventory.le
  }
})

// 報告相關
const droppedItems = ref([])

// 選擇機構
const selectOrganization = async (org) => {
  selectedOrg.value = org
  selectedSubAccount.value = null
  // 載入該機構的庫存
  await loadOrgInventory(org.id)
  // 載入該機構的附屬帳號列表
  await loadSubAccounts(org.id)
}

// 當前機構的子帳號列表
const currentOrgSubAccounts = computed(() => {
  if (!selectedOrg.value) return []
  // 統一轉為字串進行比較，避免類型不匹配問題
  const selectedOrgId = String(selectedOrg.value.id)
  return subAccounts.value.filter(account => String(account.orgId) === selectedOrgId)
})

// 選擇子帳號
const selectSubAccount = (account) => {
  selectedSubAccount.value = account
  // 從帳號資料中取得庫存
  if (account.inventory) {
    currentInventory.value = { ...account.inventory }
  } else {
    currentInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
  }
  // 重置拖曳項目
  droppedItems.value = []
}

// 編輯庫存
const dialog = ref(false)
const editingCardSet = ref(null)
const editQuantity = ref(0)
const saving = ref(false)

const editInventory = (cardSet) => {
  editingCardSet.value = cardSet
  editQuantity.value = currentInventory.value[cardSet.key]
  dialog.value = true
}

const saveInventory = async () => {
  if (!selectedSubAccount.value || !editingCardSet.value) {
    return
  }

  // 檢查是否有 member_card_inventory_id
  const memberCardInventoryId = selectedSubAccount.value.memberCardInventoryId
  if (!memberCardInventoryId) {
    handleAlert({
      auction: 'error',
      text: t('admin.memberCardInventoryIdRequired') || '庫存 ID 不存在，無法更新'
    })
    return
  }

  // 檢查可用庫存限制
  const maxAvailable = availableInventory.value[editingCardSet.value.key]
  if (editQuantity.value > maxAvailable) {
    handleAlert({
      auction: 'error',
      text: t('admin.exceedAvailableInventory') || `數量不能超過可用庫存 ${maxAvailable}`
    })
    return
  }

  saving.value = true
  try {
    // 準備 API 參數（單一更新）
    const updateData = {
      key: editingCardSet.value.key,
      [editingCardSet.value.key]: editQuantity.value
    }

    console.log('更新附屬帳號庫存資料:', {
      memberCardInventoryId,
      updateData
    })
    const response = await updateSubAccountInventoryAdminAPI(memberCardInventoryId, updateData)
    console.log('更新附屬帳號庫存回應:', response)

    // 解析 API 回應（根據其他 API 的模式，可能需要檢查不同的回應格式）
    // 如果 API 返回成功，更新本地狀態
    const responseCode = response?.meta?.code || response?.data?.meta?.code
    const responseStatus = response?.meta?.status || response?.data?.meta?.status
    const responseDetail = response?.meta?.detail || response?.data?.meta?.detail

    // 檢查是否成功（通常 code 2005 或 2006 表示成功）
    if (responseCode === '2005' || responseCode === '2006' || responseStatus === '200') {
      // 更新本地狀態
      currentInventory.value[editingCardSet.value.key] = editQuantity.value
      
      // 更新附屬帳號列表中的庫存資料
      const accountIndex = subAccounts.value.findIndex(acc => acc.id === selectedSubAccount.value.id)
      if (accountIndex !== -1 && subAccounts.value[accountIndex].inventory) {
        subAccounts.value[accountIndex].inventory[editingCardSet.value.key] = editQuantity.value
      }
      
      // 更新 selectedSubAccount 的庫存
      if (selectedSubAccount.value.inventory) {
        selectedSubAccount.value.inventory[editingCardSet.value.key] = editQuantity.value
      }

      // 重新載入機構庫存以更新顯示
      if (selectedOrg.value?.id) {
        await loadOrgInventory(selectedOrg.value.id)
      }

      handleAlert({
        auction: 'success',
        text: t('admin.updateInventorySuccess') || '庫存更新成功'
      })
      
      dialog.value = false
    } else {
      throw new Error(responseDetail || '更新失敗')
    }
  } catch (error) {
    console.error('更新附屬帳號庫存錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.updateInventoryError') || 
                        '更新庫存失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  } finally {
    saving.value = false
  }
}

// 拖曳功能
const handleDragStart = (event, key) => {
  if (currentInventory.value[key] > 0) {
    event.dataTransfer.setData('text', key)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const key = event.dataTransfer.getData('text')
  
  // 檢查限制
  if ((key === 'le' && droppedItems.value.includes('lj')) || (key === 'lj' && droppedItems.value.includes('le'))) {
    alert('le 和 lj 不能同時存在報告中')
    return
  }
  if ((key === 'ce' && droppedItems.value.includes('cj')) || (key === 'cj' && droppedItems.value.includes('ce'))) {
    alert('ce 和 cj 不能同時存在報告中')
    return
  }
  
  if (!droppedItems.value.includes(key)) {
    currentInventory.value[key] -= 1
    droppedItems.value.push(key)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleRemoveItem = (index) => {
  const key = droppedItems.value[index]
  currentInventory.value[key] += 1
  droppedItems.value.splice(index, 1)
}

// 卡組類型
const cardSets = [
  { key: 'goal', name: '我就是', icon: 'mdi-target' },
  { key: 'care', name: '我在乎', icon: 'mdi-heart' },
  { key: 'ce', name: '我可以 (國小)', icon: 'mdi-school' },
  { key: 'cj', name: '我可以 (社青)', icon: 'mdi-account-group' },
  { key: 'le', name: '我喜歡 (國小)', icon: 'mdi-star' },
  { key: 'lj', name: '我喜歡 (社青)', icon: 'mdi-star-circle' }
]

// 創建測驗
const createExamDialog = ref(false)
const creatingExam = ref(false)

const openCreateExam = () => {
  if (droppedItems.value.length === 0) {
    handleAlert({
      auction: 'warning',
      text: t('admin.selectAtLeastOneCardSet') || '請至少選擇一個牌組'
    })
    return
  }
  createExamDialog.value = true
}

const handleCreateExam = async () => {
  if (!selectedSubAccount.value) {
    handleAlert({
      auction: 'error',
      text: t('admin.pleaseSelectSubAccount') || '請選擇附屬帳號'
    })
    return
  }

  if (droppedItems.value.length === 0) {
    handleAlert({
      auction: 'warning',
      text: t('admin.selectAtLeastOneCardSet') || '請至少選擇一個牌組'
    })
    return
  }

  // 檢查是否有 member_card_inventory_id
  const memberCardInventoryId = selectedSubAccount.value.memberCardInventoryId
  if (!memberCardInventoryId) {
    handleAlert({
      auction: 'error',
      text: t('admin.memberCardInventoryIdRequired') || '庫存 ID 不存在，無法創建測驗'
    })
    return
  }

  creatingExam.value = true
  try {
    // 準備 API 參數
    const inventoryId = memberCardInventoryId
    const cardRes = droppedItems.value // 卡片組合的 key 陣列

    console.log('創建測驗:', {
      inventoryId,
      cardRes
    })

    const response = await createOrgReportAPI(inventoryId, cardRes)
    console.log('創建測驗回應:', response)

    // 解析 API 回應
    const responseCode = response?.meta?.code || response?.data?.meta?.code
    const responseStatus = response?.meta?.status || response?.data?.meta?.status
    const responseDetail = response?.meta?.detail || response?.data?.meta?.detail

    // 檢查是否成功（通常 code 2005 或 2006 表示成功）
    if (responseCode === '2005' || responseCode === '2006' || responseStatus === '200') {
      handleAlert({
        auction: 'success',
        text: t('admin.createExamSuccess') || '測驗創建成功'
      })

      // 重置
      droppedItems.value = []
      createExamDialog.value = false

      // 重新載入附屬帳號列表以更新 used 數量
      if (selectedOrg.value?.id) {
        await loadSubAccounts(selectedOrg.value.id)
        // 重新選擇當前附屬帳號以更新顯示
        const updatedAccount = subAccounts.value.find(acc => acc.id === selectedSubAccount.value.id)
        if (updatedAccount) {
          selectSubAccount(updatedAccount)
        }
      }
    } else {
      throw new Error(responseDetail || '創建測驗失敗')
    }
  } catch (error) {
    console.error('創建測驗錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.createExamError') || 
                        '創建測驗失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  } finally {
    creatingExam.value = false
  }
}

// 統計
const stats = computed(() => {
  if (!selectedSubAccount.value) return { total: 0 }
  const inv = currentInventory.value
  const total = Object.values(inv).reduce((sum, val) => sum + val, 0)
  return { total }
})

// 初始化載入
onMounted(async () => {
  await loadOrganizations()
})
</script>

<template>
  <div class="sub-account-card-inventory">
    <!-- 機構選擇 -->
    <v-card class="mb-4">
      <v-card-title>{{ t('admin.selectOrganization') }}</v-card-title>
      <v-card-text>
        <v-select
          :model-value="selectedOrg?.id"
          :items="organizations.map(org => ({ title: `${org.name} (${org.code})`, value: org.id }))"
          :loading="orgLoading"
          :readonly="hasSingleOrg"
          :disabled="hasSingleOrg"
          :class="hasSingleOrg ? 'readonly-field' : ''"
          variant="outlined"
          @update:model-value="(id) => selectOrganization(organizations.find(o => o.id === id))"
        />
      </v-card-text>
    </v-card>

    <template v-if="selectedOrg">
      <!-- 權限提示 -->
      <v-card
        v-if="!hasAdminPermission"
        class="mb-4"
        color="warning"
        variant="tonal"
      >
        <v-card-text class="text-center py-8">
          <v-icon
            size="64"
            icon="mdi-alert-circle"
            class="mb-4"
          />
          <div class="text-h6">
            當前帳號沒有該功能的權限，請聯絡組織管理員
          </div>
        </v-card-text>
      </v-card>

      <!-- 機構庫存顯示 -->
      <v-card
        v-if="hasAdminPermission"
        class="mb-4"
      >
        <v-card-title>{{ t('admin.orgCardInventory') }}</v-card-title>
        <v-card-text>
          <v-row v-if="orgInventoryLoading">
            <v-col cols="12">
              <div class="text-center py-4">
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
              v-for="cardSet in cardSets"
              :key="cardSet.key"
              cols="6"
              sm="4"
              md="2"
            >
              <v-card
                variant="outlined"
                class="text-center"
              >
                <v-card-text>
                  <v-icon
                    :icon="cardSet.icon"
                    size="32"
                    class="mb-2"
                    color="primary"
                  />
                  <div class="text-caption mb-1">
                    {{ cardSet.name }}
                  </div>
                  <div class="text-h6 font-weight-bold">
                    {{ orgInventory[cardSet.key] }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 附屬帳號選擇 -->
      <v-card
        v-if="hasAdminPermission"
        class="mb-4"
      >
        <v-card-title>{{ t('admin.selectSubAccount') }}</v-card-title>
        <v-card-text>
          <v-select
            :model-value="selectedSubAccount?.id"
            :items="currentOrgSubAccounts.map(acc => ({ 
              title: `${acc.name}${acc.email ? ` (${acc.email})` : ''}`, 
              value: acc.id 
            }))"
            :loading="subAccountsLoading"
            :label="t('admin.selectSubAccount')"
            :placeholder="t('admin.selectSubAccount')"
            variant="outlined"
            @update:model-value="(id) => selectSubAccount(currentOrgSubAccounts.find(a => a.id === id))"
          />
        </v-card-text>
      </v-card>

      <template v-if="selectedSubAccount && hasAdminPermission">
        <!-- 統計資訊 -->
        <v-row class="mb-4">
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              color="primary"
              variant="tonal"
            >
              <v-card-text>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption mb-1">
                      {{ t('admin.selectedSubAccount') }}
                    </div>
                    <div class="text-h6">
                      {{ selectedSubAccount.name }}
                    </div>
                  </div>
                  <v-icon
                    size="48"
                    icon="mdi-account"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              color="success"
              variant="tonal"
            >
              <v-card-text>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption mb-1">
                      {{ t('admin.totalCardSets') }}
                    </div>
                    <div class="text-h4 font-weight-bold">
                      {{ stats.total }}
                    </div>
                  </div>
                  <v-icon
                    size="48"
                    icon="mdi-cards"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              color="info"
              variant="tonal"
            >
              <v-card-text>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption mb-1">
                      {{ t('admin.usedCardSets') }}
                    </div>
                    <div class="text-h4 font-weight-bold">
                      {{ selectedSubAccount?.used || 0 }}
                    </div>
                  </div>
                  <v-icon
                    size="48"
                    icon="mdi-clipboard-text"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 卡片庫存顯示 -->
        <v-row class="mb-4">
          <v-col
            v-for="cardSet in cardSets"
            :key="cardSet.key"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <div
              :draggable="currentInventory[cardSet.key] > 0"
              :class="{ 'cursor-grab': currentInventory[cardSet.key] > 0, 'cursor-default': currentInventory[cardSet.key] === 0 }"
              @dragstart="handleDragStart($event, cardSet.key)"
            >
              <v-card
                variant="elevated"
                :class="{ 'hover': currentInventory[cardSet.key] > 0 }"
              >
                <v-card-text>
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-icon
                        :icon="cardSet.icon"
                        size="32"
                        class="mr-2"
                        :color="currentInventory[cardSet.key] > 0 ? 'primary' : 'grey'"
                      />
                      <div class="text-h6">
                        {{ cardSet.name }}
                      </div>
                    </div>
                    <v-chip
                      :color="currentInventory[cardSet.key] > 0 ? 'success' : 'warning'"
                      size="large"
                    >
                      {{ currentInventory[cardSet.key] }}
                    </v-chip>
                  </div>
                  <v-btn
                    block
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-pencil"
                    @click="editInventory(cardSet)"
                  >
                    {{ t('admin.editInventory') }}
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <!-- 報告建立區域 -->
        <v-divider class="my-6" />
        <v-row>
          <v-col cols="12">
            <div class="text-h6 mb-4">
              {{ t('admin.dragCardsHere') }}
            </div>
          </v-col>
          <v-col cols="12">
            <div
              class="drop-area-container"
              @drop="handleDrop"
              @dragover="handleDragOver"
            >
              <div
                v-for="(item, index) in droppedItems"
                :key="index"
                class="drop-area-item"
                @click="handleRemoveItem(index)"
              >
                <CardCaseInventory
                  :card-case="item"
                  :inventory="`${parseInt(currentInventory[item])}`"
                  :in-drop-area="true"
                />
              </div>
              <div
                v-if="droppedItems.length === 0"
                class="empty-drop-area"
              >
                <v-icon
                  size="64"
                  icon="mdi-drag"
                />
                <div class="text-h6 mt-4">
                  {{ t('admin.dragCardsHere') }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="text-right mt-4"
          >
            <v-btn
              color="secondary"
              size="large"
              prepend-icon="mdi-file-document"
              :disabled="droppedItems.length === 0"
              @click="openCreateExam"
            >
              {{ t('admin.createExam') }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- 編輯庫存對話框 -->
        <v-dialog
          v-model="dialog"
          max-width="400px"
        >
          <v-card>
            <v-card-title>{{ t('admin.editCardSetInventory') }}</v-card-title>
            <v-divider />
            <v-card-text>
              <div class="mb-4">
                <v-icon
                  :icon="editingCardSet?.icon"
                  size="48"
                  class="mb-2"
                />
                <div class="text-h6">
                  {{ editingCardSet?.name }}
                </div>
              </div>
              
              <!-- 機構庫存資訊 -->
              <v-alert
                v-if="editingCardSet"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <div class="text-caption mb-1">
                  {{ t('admin.orgCardInventory') }}: {{ orgInventory[editingCardSet.key] }}
                </div>
                <div class="text-caption">
                  {{ t('admin.availableInventory') }}: {{ availableInventory[editingCardSet.key] }}
                </div>
              </v-alert>
              
              <v-text-field
                v-model.number="editQuantity"
                :label="t('admin.quantity')"
                type="number"
                :min="0"
                :max="editingCardSet ? availableInventory[editingCardSet.key] : 0"
                :hint="editingCardSet ? `${t('admin.maxAvailable')}: ${availableInventory[editingCardSet.key]}` : ''"
                persistent-hint
                variant="outlined"
              />
            </v-card-text>
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
                :disabled="saving"
                @click="saveInventory"
              >
                {{ t('common.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 創建測驗對話框 -->
        <v-dialog
          v-model="createExamDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>{{ t('admin.createExam') }}</v-card-title>
            <v-divider />
            <v-card-text>
              <div class="text-subtitle-2 mb-2">
                {{ t('admin.usedCardSets') }}:
              </div>
              <v-chip
                v-for="(item, index) in droppedItems"
                :key="index"
                class="mr-2 mb-2"
              >
                {{ cardSets.find(cs => cs.key === item)?.name }}
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="text"
                @click="createExamDialog = false"
              >
                {{ t('common.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                variant="text"
                :loading="creatingExam"
                :disabled="creatingExam"
                @click="handleCreateExam"
              >
                {{ t('admin.createExam') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- 未選擇子帳號提示 -->
      <v-card
        v-else-if="hasAdminPermission"
      >
        <v-card-text class="text-center py-10">
          <v-icon
            size="64"
            icon="mdi-account-outline"
          />
          <div class="text-h6 mt-4">
            {{ t('admin.pleaseSelectSubAccount') }}
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- 未選擇機構提示 -->
    <v-card v-else>
      <v-card-text class="text-center py-10">
        <v-icon
          size="64"
          icon="mdi-office-building-outline"
        />
        <div class="text-h6 mt-4">
          {{ t('admin.pleaseSelectOrg') }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.sub-account-card-inventory {
  padding: 8px 0;

  .cursor-pointer {
    cursor: pointer;
  }

  .drop-area-container {
    min-height: 300px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
    position: relative;
  }

  .empty-drop-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #999;
  }

  .drop-area-item {
    cursor: pointer;
    transition: transform 0.2s;
  }

  .drop-area-item:hover {
    transform: translateY(-4px);
  }

  .cursor-grab {
    cursor: grab;
  }

  .cursor-grab:active {
    cursor: grabbing;
  }

  .cursor-default {
    cursor: default;
  }

  // 唯讀欄位樣式
  :deep(.readonly-field) {
    .v-field__input {
      color: rgba(0, 0, 0, 0.87) !important;
      cursor: default;
    }

    .v-field__outline {
      color: rgba(0, 0, 0, 0.38) !important;
      opacity: 1 !important;
    }

    .v-field__outline__start,
    .v-field__outline__notch,
    .v-field__outline__end {
      border-color: rgba(0, 0, 0, 0.38) !important;
    }

    .v-label {
      color: rgba(0, 0, 0, 0.6) !important;
    }

    // 禁用狀態下的樣式覆蓋
    &.v-input--disabled {
      .v-field__input {
        color: rgba(0, 0, 0, 0.87) !important;
      }

      .v-field__outline {
        color: rgba(0, 0, 0, 0.38) !important;
        opacity: 1 !important;
      }

      .v-label {
        color: rgba(0, 0, 0, 0.6) !important;
      }
    }
  }
}
</style>


