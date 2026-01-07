<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { handleAlert, handleConfirm } from '@/plugins/utils/alert'
import { listOrgAdminAPI, listOrSubAccountAdminAPI, createSubAccountAdminAPI, updateSubAccountAdminAPI, deleteSubAccountAdminAPI } from '@/plugins/utils/requests/api/backend'

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

// 機構列表
const selectedOrg = ref(null)
const organizations = ref([])
const orgLoading = ref(false)

// 子帳號列表
const subAccounts = ref([])
const subAccountsLoading = ref(false)

// 將後端組織資料映射到前端格式
const mapOrgData = (backendOrg) => {
  return {
    id: backendOrg.id,
    name: backendOrg.org_name || '',
    code: backendOrg.org_code || '',
    contact: backendOrg.contact_person || '',
    email: backendOrg.contact_email || '',
    phone: backendOrg.contact_phone || ''
  }
}

// 將後端子帳號資料映射到前端格式
const mapSubAccountData = (backendAccount) => {
  // 從 role.PsyCard 陣列中取得第一個角色，如果沒有則使用 'member'
  const roles = backendAccount.role?.PsyCard || []
  const role = roles.length > 0 ? roles[0] : 'member'
  
  // 將角色映射到前端格式（僅管理者、成員）
  let roleValue = 'member' // 預設為成員
  if (role === 'admin' || backendAccount.is_admin === '1') {
    roleValue = 'admin'
  }
  // 其他所有角色都映射為 member

  return {
    id: backendAccount.id,
    orgId: backendAccount.org_id,
    userId: backendAccount.user_id,
    name: backendAccount.org_user_name || '',
    email: backendAccount.email || '',
    account: backendAccount.account || null, // 保存 account，用於顯示
    username: backendAccount.account || backendAccount.uid || '',
    role: roleValue,
    status: backendAccount.st === '1' ? 'active' : 'inactive',
    createdAt: backendAccount.created_at ? new Date(backendAccount.created_at).toISOString().split('T')[0] : '',
    isAdmin: backendAccount.is_admin === '1'
  }
}

// 載入組織列表
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
          code: org.org_code,
          contact: '',
          email: '',
          phone: ''
        }))
        
        console.log('載入完成，共', organizations.value.length, '筆組織資料')
        
        // 如果有組織且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.log('appStore.myOrg 為空或不是陣列')
        organizations.value = []
      }
    } else {
      // 管理員角色：從 API 讀取所有組織
      console.log('載入組織列表...')
      const response = await listOrgAdminAPI()
      
      // 解析 API 回應
      let orgList = []
      
      if (response?.data?.attributes?.organization_list) {
        orgList = response.data.attributes.organization_list
      } else if (response?.attributes?.organization_list) {
        orgList = response.attributes.organization_list
      } else if (response?.organization_list) {
        orgList = response.organization_list
      } else if (Array.isArray(response)) {
        orgList = response
      }
      
      if (Array.isArray(orgList) && orgList.length > 0) {
        organizations.value = orgList.map(mapOrgData)
        console.log('載入完成，共', organizations.value.length, '筆組織資料')
        
        // 如果有組織且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.warn('API 回應格式不符合預期:', response)
        handleAlert({
          auction: 'error',
          text: t('admin.loadOrganizationsError') || '載入組織資料失敗'
        })
        organizations.value = []
      }
    }
  } catch (error) {
    console.error('載入組織列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadOrganizationsError') || '載入組織資料失敗'
    })
    organizations.value = []
  } finally {
    orgLoading.value = false
  }
}

// 載入組織的子帳號列表
const loadSubAccounts = async (orgId) => {
  if (!orgId) {
    subAccounts.value = []
    return
  }

  subAccountsLoading.value = true
  try {
    console.log('載入組織子帳號列表...', orgId)
    const response = await listOrSubAccountAdminAPI(orgId)
    
    // 解析 API 回應
    // API 回應格式：{ data: { attributes: { sub_account_list: [...] } } }
    // 攔截器解包後：{ attributes: { sub_account_list: [...] } }
    let accountList = []
    
    if (response?.data?.attributes?.sub_account_list) {
      accountList = response.data.attributes.sub_account_list
    } else if (response?.attributes?.sub_account_list) {
      accountList = response.attributes.sub_account_list
    } else if (response?.sub_account_list) {
      accountList = response.sub_account_list
    } else if (Array.isArray(response)) {
      accountList = response
    }
    
    if (Array.isArray(accountList)) {
      subAccounts.value = accountList.map(mapSubAccountData)
      console.log('載入完成，共', subAccounts.value.length, '筆子帳號資料')
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.loadSubAccountsError') || '載入子帳號資料失敗'
      })
      subAccounts.value = []
    }
  } catch (error) {
    console.error('載入組織子帳號列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadSubAccountsError') || '載入子帳號資料失敗'
    })
    subAccounts.value = []
  } finally {
    subAccountsLoading.value = false
  }
}

// 當前機構的子帳號
const currentOrgSubAccounts = computed(() => {
  if (!selectedOrg.value) return []
  return subAccounts.value.filter(account => account.orgId === selectedOrg.value.id)
})

// 搜尋
const search = ref('')

const filteredAccounts = computed(() => {
  if (!search.value) return currentOrgSubAccounts.value
  const searchLower = search.value.toLowerCase()
  return currentOrgSubAccounts.value.filter(account =>
    account.name.toLowerCase().includes(searchLower) ||
    (account.account && account.account.toLowerCase().includes(searchLower)) ||
    account.email.toLowerCase().includes(searchLower) ||
    account.username.toLowerCase().includes(searchLower)
  )
})

// 對話框
const dialog = ref(false)
const editMode = ref(false)
const editedAccount = ref({
  id: null,
  orgId: null,
  name: '',
  account: null,
  email: '',
  role: 'member', // 預設成員
  status: 'active', // 預設啟用（僅用於編輯模式）
  createdAt: ''
})

const headers = [
  { title: t('admin.username'), key: 'name' },
  { title: t('admin.orgSubAccountUserAccountLabel'), key: 'account' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.role'), key: 'role' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.createdAt'), key: 'createdAt' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
]

// 角色選項（僅管理者、成員）
const roleOptions = [
  { value: 'admin', label: t('admin.admin') },
  { value: 'member', label: t('admin.orgSubAccountRoleMember') }
]

const statusOptions = [
  { value: 'active', label: t('admin.active') },
  { value: 'inactive', label: t('admin.inactive') }
]

// 選擇機構
const selectOrganization = async (org) => {
  selectedOrg.value = org
  // 載入該組織的子帳號
  if (org?.id) {
    await loadSubAccounts(org.id)
  }
}

// 新增子帳號
const addSubAccount = () => {
  editMode.value = false
  editedAccount.value = {
    id: null,
    orgId: selectedOrg.value.id,
    name: '',
    account: null,
    email: '',
    role: 'member', // 預設成員
    createdAt: new Date().toISOString().split('T')[0]
  }
  dialog.value = true
}

// 編輯子帳號
const editSubAccount = (account) => {
  editMode.value = true
  editedAccount.value = { ...account }
  dialog.value = true
}

// 刪除子帳號
const deleteSubAccount = async (account) => {
  // 確認刪除
  const confirmed = await handleConfirm({
    title: t('admin.confirmDelete') || '確認刪除',
    text: t('admin.confirmDeleteSubAccount') || `確定要刪除附屬帳號「${account.name}」嗎？`,
    confirmButtonText: t('common.confirm') || '確定',
    cancelButtonText: t('common.cancel') || '取消',
    icon: 'warning'
  })
  
  if (!confirmed) {
    return
  }

  try {
    // 驗證必要資訊
    if (!selectedOrg.value?.id) {
      handleAlert({
        auction: 'error',
        text: t('admin.orgIdRequired') || '請先選擇組織'
      })
      return
    }
    if (!account.userId) {
      handleAlert({
        auction: 'error',
        text: t('admin.userIdRequired') || '使用者 ID 不存在，無法刪除'
      })
      return
    }

    console.log('刪除附屬帳號:', account)
    const response = await deleteSubAccountAdminAPI(selectedOrg.value.id, account.userId)
    console.log('刪除附屬帳號回應:', response)

    // 解析 API 回應
    let subAccountDetail = null
    if (response?.data?.attributes?.sub_account_detail) {
      subAccountDetail = response.data.attributes.sub_account_detail
    } else if (response?.attributes?.sub_account_detail) {
      subAccountDetail = response.attributes.sub_account_detail
    } else if (response?.sub_account_detail) {
      subAccountDetail = response.sub_account_detail
    }

    if (subAccountDetail) {
      // 重新載入子帳號列表
      await loadSubAccounts(selectedOrg.value.id)
      
      handleAlert({
        auction: 'success',
        text: t('admin.deleteSubAccountSuccess') || '附屬帳號刪除成功'
      })
    } else {
      // 即使沒有返回詳細資料，也視為成功（因為 API 沒有返回錯誤）
      await loadSubAccounts(selectedOrg.value.id)
      handleAlert({
        auction: 'success',
        text: t('admin.deleteSubAccountSuccess') || '附屬帳號刪除成功'
      })
    }
  } catch (error) {
    console.error('刪除附屬帳號錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || error?.response?.data?.message || error?.message || t('admin.deleteSubAccountError') || '刪除附屬帳號失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  }
}

// 儲存子帳號
const saveSubAccount = async () => {
  if (editMode.value) {
    // 編輯模式：調用後端 API
    try {
      // 驗證必填欄位
      if (!editedAccount.value.name) {
        handleAlert({
          auction: 'error',
          text: t('admin.userNameRequired') || '使用者名稱為必填欄位'
        })
        return
      }
      if (!editedAccount.value.email) {
        handleAlert({
          auction: 'error',
          text: t('admin.emailRequired') || '電子信箱為必填欄位'
        })
        return
      }
      if (!selectedOrg.value?.id) {
        handleAlert({
          auction: 'error',
          text: t('admin.orgIdRequired') || '請先選擇組織'
        })
        return
      }
      if (!editedAccount.value.userId) {
        handleAlert({
          auction: 'error',
          text: t('admin.userIdRequired') || '使用者 ID 不存在，無法更新'
        })
        return
      }

      // 準備 API 參數
      const isAdmin = editedAccount.value.role === 'admin' ? '1' : '0'
      const updateData = {
        org_user_name: editedAccount.value.name,
        org_account: editedAccount.value.account || null,
        org_email: editedAccount.value.email,
        is_admin: isAdmin
      }

      console.log('更新附屬帳號資料:', updateData)
      const response = await updateSubAccountAdminAPI(selectedOrg.value.id, editedAccount.value.userId, updateData)
      console.log('更新附屬帳號回應:', response)

      // 檢查 API 回應的 code
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail

      // 處理成功情況（code 2006）或警告情況（code 4001 但 status 200）
      if (responseCode === '2006' || (responseCode === '4001' && responseStatus === '200')) {
        // 如果是重複錯誤（4001），顯示警告訊息
        if (responseCode === '4001') {
          handleAlert({
            auction: 'warning',
            text: responseDetail || t('admin.duplicateAccountOrEmail') || '帳號或電子信箱已存在'
          })
        } else {
          // 成功更新
          handleAlert({
            auction: 'success',
            text: t('admin.updateSubAccountSuccess') || '附屬帳號更新成功'
          })
        }

        // 重新載入子帳號列表以取得最新資料
        await loadSubAccounts(selectedOrg.value.id)
        dialog.value = false
      } else {
        // 其他錯誤
        throw new Error(responseDetail || '更新失敗')
      }
    } catch (error) {
      console.error('更新附屬帳號錯誤:', error)
      const errorMessage = error?.response?.data?.meta?.detail || error?.response?.data?.message || error?.message || t('admin.updateSubAccountError') || '更新附屬帳號失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    }
  } else {
    // 新增模式：調用後端 API
    try {
      console.log('開始新增附屬帳號流程...')
      console.log('editedAccount:', editedAccount.value)
      console.log('selectedOrg:', selectedOrg.value)
      
      // 驗證必填欄位
      if (!editedAccount.value.name) {
        handleAlert({
          auction: 'error',
          text: t('admin.userNameRequired') || '使用者名稱為必填欄位'
        })
        return
      }
      if (!editedAccount.value.email) {
        handleAlert({
          auction: 'error',
          text: t('admin.emailRequired') || '電子信箱為必填欄位'
        })
        return
      }
      if (!selectedOrg.value?.id) {
        handleAlert({
          auction: 'error',
          text: t('admin.orgIdRequired') || '請先選擇組織'
        })
        return
      }

      // 準備 API 參數
      const isAdmin = editedAccount.value.role === 'admin' ? '1' : '0'
      const createData = {
        org_user_name: editedAccount.value.name,
        org_account: editedAccount.value.account || null,
        org_email: editedAccount.value.email,
        is_admin: isAdmin
      }

      console.log('新增附屬帳號 - 組織 ID:', selectedOrg.value.id)
      console.log('新增附屬帳號資料:', createData)
      
      const response = await createSubAccountAdminAPI(selectedOrg.value.id, createData)
      console.log('新增附屬帳號完整回應:', JSON.stringify(response, null, 2))

      // 檢查 API 回應的 code 和 status
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail

      console.log('回應碼:', responseCode, '狀態:', responseStatus, '詳情:', responseDetail)

      // 檢查回應中是否包含新創建的帳號
      // 創建 API 可能返回 sub_account_detail（單個物件）或 sub_account_list（陣列）
      const subAccountDetail = response?.data?.attributes?.sub_account_detail || response?.attributes?.sub_account_detail
      const subAccountList = response?.data?.attributes?.sub_account_list || response?.attributes?.sub_account_list || []
      
      // 優先檢查 sub_account_detail（創建操作返回的單個物件）
      let newAccount = null
      if (subAccountDetail) {
        // 檢查單個物件是否匹配（創建回應可能只包含 org_user_name 和 user_id，沒有 email）
        const detailEmail = subAccountDetail.email || subAccountDetail.org_email
        const detailName = subAccountDetail.org_user_name || subAccountDetail.name
        // 如果名稱匹配，就視為創建成功（因為創建回應可能不包含 email）
        if (detailName === createData.org_user_name || 
            detailEmail === createData.org_email ||
            (detailName === createData.org_user_name && detailEmail === createData.org_email)) {
          newAccount = subAccountDetail
        }
      }
      
      // 如果沒有找到，再檢查列表
      if (!newAccount && subAccountList.length > 0) {
        newAccount = subAccountList.find(account => 
          account.email === createData.org_email || 
          account.org_email === createData.org_email ||
          (account.org_user_name === createData.org_user_name && account.email === createData.org_email)
        )
      }
      
      console.log('檢查新創建的帳號是否在回應中:', {
        searchedEmail: createData.org_email,
        foundAccount: newAccount,
        hasSubAccountDetail: !!subAccountDetail,
        totalAccountsInList: subAccountList.length
      })

      // 處理成功情況（code 2005）或警告情況（code 4001 但 status 200）
      if (responseCode === '2005' || (responseCode === '4001' && responseStatus === '200')) {
        // 如果是重複錯誤（4001），顯示警告訊息
        if (responseCode === '4001') {
          handleAlert({
            auction: 'warning',
            text: responseDetail || t('admin.duplicateAccountOrEmail') || '帳號或電子信箱已存在'
          })
          dialog.value = false
        } else {
          // code 2005 表示操作成功
          // 如果回應中已經包含新創建的帳號（sub_account_detail），直接顯示成功
          if (newAccount) {
            console.log('在 API 回應中找到新創建的帳號:', newAccount)
            // 重新載入列表以取得完整資料
        await loadSubAccounts(selectedOrg.value.id)
        handleAlert({
          auction: 'success',
          text: t('admin.addSubAccountSuccess') || '附屬帳號新增成功'
        })
        dialog.value = false
      } else {
            // 回應中沒有新帳號，需要重新載入列表驗證
            console.log('重新載入子帳號列表以驗證創建結果...')
            
            // 嘗試多次重新載入，直到找到新帳號或超過重試次數
            let retryCount = 0
            const maxRetries = 3
            let accountCreated = false
            
            while (retryCount < maxRetries && !accountCreated) {
              // 等待後端資料更新
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
              await loadSubAccounts(selectedOrg.value.id)
              
              // 檢查新帳號是否已出現在列表中
              const updatedAccount = subAccounts.value.find(account => 
                account.email === createData.org_email || 
                (account.name === createData.org_user_name && account.email === createData.org_email)
              )
              
              if (updatedAccount) {
                accountCreated = true
                console.log('找到新創建的帳號:', updatedAccount)
              } else {
                retryCount++
                console.log(`重新載入後未找到新帳號，重試 ${retryCount}/${maxRetries}`)
              }
            }
            
            if (accountCreated) {
              // 成功新增並找到新帳號
              handleAlert({
                auction: 'success',
                text: t('admin.addSubAccountSuccess') || '附屬帳號新增成功'
              })
            } else {
              // code 2005 但未找到新帳號，可能是創建失敗或資料同步問題
              console.warn('API 返回成功但未找到新創建的帳號，可能是創建失敗或資料同步延遲')
              handleAlert({
                auction: 'warning',
                text: t('admin.addSubAccountSuccessButNotVerified') || '帳號可能已創建，但資料同步可能有延遲，請稍後刷新查看'
              })
            }
            
            dialog.value = false
          }
        }
      } else {
        // 其他錯誤
        console.error('API 回應不符合預期:', { responseCode, responseStatus, responseDetail })
        throw new Error(responseDetail || `新增失敗 (code: ${responseCode}, status: ${responseStatus})`)
      }
    } catch (error) {
      console.error('新增附屬帳號錯誤:', error)
      console.error('錯誤詳情:', error?.response?.data || error?.message)
      const errorMessage = error?.response?.data?.meta?.detail || error?.response?.data?.message || error?.message || t('admin.addSubAccountError') || '新增附屬帳號失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    }
  }
}

// 統計
const stats = computed(() => [
  {
    title: t('admin.totalSubAccounts'),
    value: currentOrgSubAccounts.value.length,
    icon: 'mdi-account-group',
    color: 'blue'
  },
  {
    title: t('admin.activeSubAccounts'),
    value: currentOrgSubAccounts.value.filter(a => a.status === 'active').length,
    icon: 'mdi-account-check',
    color: 'green'
  },
  {
    title: t('admin.memberAccounts') || '成員帳號',
    value: currentOrgSubAccounts.value.filter(a => a.role === 'member').length,
    icon: 'mdi-account',
    color: 'orange'
  }
])

// 初始化載入
onMounted(async () => {
  await loadOrganizations()
})
</script>

<template>
  <div class="org-sub-account-management">
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

      <!-- 統計卡片 -->
      <v-row
        v-if="hasAdminPermission"
        class="mb-4"
      >
        <v-col
          v-for="stat in stats"
          :key="stat.title"
          cols="12"
          sm="6"
          md="4"
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

      <!-- 搜尋和新增 -->
      <v-row
        v-if="hasAdminPermission"
        class="mb-4"
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="search"
            :label="t('admin.searchSubAccounts')"
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
            @click="addSubAccount"
          >
            {{ t('admin.addSubAccount') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- 子帳號表格 -->
      <v-data-table
        v-if="hasAdminPermission"
        :headers="headers"
        :items="filteredAccounts"
        :search="search"
        :loading="subAccountsLoading"
        class="elevation-1"
      >
        <template #item.account="{ item }">
          {{ item.account || t('admin.notSet') || '未設定' }}
        </template>

        <template #item.role="{ item }">
          <v-chip
            :color="item.role === 'admin' ? 'error' : 'default'"
            size="small"
          >
            {{ item.role === 'admin' ? t('admin.admin') : t('admin.orgSubAccountRoleMember') }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : 'warning'"
            size="small"
          >
            {{ statusOptions.find(s => s.value === item.status)?.label }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="editSubAccount(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="deleteSubAccount(item)"
          />
        </template>
      </v-data-table>

      <!-- 新增/編輯對話框 -->
      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{ editMode ? t('admin.editSubAccount') : t('admin.addSubAccount') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedAccount.name"
                  :label="t('admin.username')"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedAccount.account"
                  :label="t('admin.orgSubAccountUserAccountLabel')"
                  variant="outlined"
                  :placeholder="t('admin.notSet') || '未設定'"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedAccount.email"
                  :label="t('admin.email')"
                  type="email"
                  variant="outlined"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="editedAccount.role"
                  :items="roleOptions"
                  item-title="label"
                  item-value="value"
                  :label="t('admin.role')"
                  variant="outlined"
                />
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
              @click="saveSubAccount"
            >
              {{ t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
.org-sub-account-management {
  padding: 8px 0;

  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
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


