<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleAlert } from '@/plugins/utils/alert'
import { listUserAdminAPI, registerAdminAPI, updateUserDataAdminAPI } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()

const search = ref('')
const headers = ref([
  { title: t('admin.userName'), key: 'name' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.role'), key: 'roles' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const users = ref([])
const loading = ref(false)

// 角色映射：將後端角色映射到前端顯示的角色
const mapRole = (backendRole) => {
  const roleMap = {
    'member': t('admin.user'),
    'admin': t('admin.admin'),
    'organization': t('admin.orgRole'),
    'counselor': t('admin.counselorRole'),
    'subaccount': t('admin.subaccountRole') || '附屬帳號'
  }
  return roleMap[backendRole] || backendRole
}

// 反向角色映射：將前端顯示的角色映射回後端格式
const reverseMapRole = (frontendRole) => {
  const reverseMap = {
    [t('admin.user')]: 'member',
    [t('admin.admin')]: 'admin',
    [t('admin.orgRole')]: 'organization',
    [t('admin.counselorRole')]: 'counselor',
    [t('admin.subaccountRole') || '附屬帳號']: 'subaccount'
  }
  return reverseMap[frontendRole] || frontendRole
}

// 將後端用戶資料映射到前端格式
const mapUserData = (backendUser) => {
  // 處理 role.PsyCard 可能是陣列或字串的情況
  let psyCardRoles = backendUser.role?.PsyCard || []
  
  // 如果是字串，轉換為陣列
  if (typeof psyCardRoles === 'string') {
    psyCardRoles = [psyCardRoles]
  }
  
  // 確保是陣列
  if (!Array.isArray(psyCardRoles)) {
    psyCardRoles = []
  }
  
  const mappedRoles = psyCardRoles.map(mapRole)
  
  return {
    uid: backendUser.uid,
    name: backendUser.account || t('admin.notSet'),
    email: backendUser.email,
    roles: mappedRoles.length > 0 ? mappedRoles : [t('admin.user')],
    status: backendUser.st === '1' ? t('admin.active') : t('admin.inactive'),
    statusColor: backendUser.st === '1' ? 'success' : 'warning',
    lastLogginTime: backendUser.last_loggin_time,
    lastLogginAddr: backendUser.last_loggin_addr,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.updated_at
  }
}

// 載入所有用戶列表（一次性載入大量資料，使用前端分頁）
const loadUsers = async () => {
  loading.value = true
  try {
    // 一次性載入大量資料（例如 1000 筆）以供前端分頁使用
    console.log('載入所有用戶列表...')
    const response = await listUserAdminAPI(1, 1000)
    
    // 注意：axios 攔截器已經將 response.data 解包，所以這裡直接使用 response
    if (response && (response.code === '200' || response.code === '201') && response.result) {
      users.value = response.result.map(mapUserData)
      console.log('載入完成，共', users.value.length, '筆資料')
    } else {
      console.error('API 回應格式錯誤:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.loadUsersError')
      })
      users.value = []
    }
  } catch (error) {
    console.error('載入用戶列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadUsersError')
    })
    users.value = []
  } finally {
    loading.value = false
  }
}

// 初始化載入
onMounted(() => {
  loadUsers()
})

// 可用的角色選項
const availableRoles = ref([
  { title: t('admin.user'), value: t('admin.user') },
  { title: t('admin.admin'), value: t('admin.admin') },
  { title: t('admin.orgRole'), value: t('admin.orgRole') },
  { title: t('admin.counselorRole'), value: t('admin.counselorRole') },
  { title: t('admin.subaccountRole') || '附屬帳號', value: t('admin.subaccountRole') || '附屬帳號' }
])

const editedItem = ref({
  uid: null,
  name: '',
  email: '',
  password: '',
  roles: [],
  status: '',
  statusColor: 'success'
})
const dialog = ref(false)
const editMode = ref(false)
const excelUploadDialog = ref(false)
const excelFile = ref(null)
const visiblePassword = ref(false)

const addUser = () => {
  editedItem.value = {
    uid: null,
    name: '',
    email: '',
    password: '',
    roles: [],
    status: t('admin.active'),
    statusColor: 'success'
  }
  editMode.value = false
  dialog.value = true
}

const editUser = (item) => {
  editedItem.value = { ...item }
  editMode.value = true
  dialog.value = true
}

const deleteUser = async (item) => {
  // TODO: 調用 API 刪除用戶
  // 目前先從本地移除
    const index = users.value.indexOf(item)
    if (index > -1) {
      users.value.splice(index, 1)
      handleAlert({
        auction: 'success',
        text: t('admin.userDeleted') || '用戶已刪除'
      })
    }
}

const saveUser = async () => {
  // 驗證必填欄位
  if (!editedItem.value.email) {
    handleAlert({
      auction: 'error',
      text: t('admin.fillRequiredFields')
    })
    return
  }

  if (editMode.value) {
    // 編輯模式 - 調用 API 更新用戶
    if (!editedItem.value.uid) {
      handleAlert({
        auction: 'error',
        text: t('admin.invalidUser') || '無效的用戶資料'
      })
      return
    }

    // 將前端的角色映射回後端格式
    const backendRoles = editedItem.value.roles.map(reverseMapRole)
    
    // 如果沒有選擇角色，預設為 member
    if (backendRoles.length === 0) {
      backendRoles.push('member')
    }

    try {
      loading.value = true
      console.log('開始更新用戶...')
      console.log('用戶 ID:', editedItem.value.uid)
      console.log('帳號:', editedItem.value.name)
      console.log('Email:', editedItem.value.email)
      console.log('角色:', backendRoles)
      
      const response = await updateUserDataAdminAPI(
        editedItem.value.uid,
        editedItem.value.name || '',
        editedItem.value.email,
        backendRoles
      )
      console.log('更新用戶 API 回應:', response)
      
      // 解析 API 回應
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
      
      // 檢查是否成功（通常 code 2005 或 status 200 表示成功）
      if (responseCode === '2005' || responseStatus === '200') {
        handleAlert({
          auction: 'success',
          text: responseDetail || t('admin.userUpdated') || '用戶更新成功'
        })
        
        // 關閉對話框
        dialog.value = false
        
        // 重新載入用戶列表
        await loadUsers()
      } else {
        throw new Error(responseDetail || '更新用戶失敗')
      }
    } catch (error) {
      console.error('更新用戶錯誤:', error)
      
      // 處理錯誤回應
      let errorMessage = t('admin.userUpdateFailed') || '更新用戶失敗'
      
      // 檢查錯誤回應格式
      const errorsArray = error?.response?.data?.errors || error?.errors
      
      if (errorsArray && Array.isArray(errorsArray) && errorsArray.length > 0) {
        const errorData = errorsArray[0]
        errorMessage = errorData.detail || errorData.title || errorMessage
      }
      // 如果不是 JSON API 格式，嘗試其他格式
      else if (error?.response?.data?.meta?.detail) {
        errorMessage = error.response.data.meta.detail
      }
      else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      // 如果錯誤本身就是字串
      else if (typeof error === 'string') {
        errorMessage = error
      }
      // 如果是 Error 物件
      else if (error?.message) {
        errorMessage = error.message
      }
      
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      loading.value = false
    }
  } else {
    // 新增模式 - 調用 API
    if (!editedItem.value.password) {
      handleAlert({
        auction: 'error',
        text: t('admin.passwordRequired') || '請輸入密碼'
      })
      return
    }

    // 將前端的角色映射回後端格式
    const backendRoles = editedItem.value.roles.map(reverseMapRole)
    
    // 如果沒有選擇角色，預設為 member
    if (backendRoles.length === 0) {
      backendRoles.push('member')
    }

    try {
      loading.value = true
      // 傳遞多個角色（如果 API 支援陣列）或第一個角色
      const response = await registerAdminAPI({
        email: editedItem.value.email,
        password: editedItem.value.password,
        role: backendRoles.length === 1 ? backendRoles[0] : backendRoles
      })

      // 處理 JSON API 格式回應（meta.status 或 meta.code）
      // 或簡單格式回應（code）
      const isSuccess = 
        (response?.meta?.status === '201' || response?.meta?.code === '2004') ||
        (response?.code === '200' || response?.code === '201')

      if (response && isSuccess) {
        const successMessage = response?.meta?.detail || 
                              response?.meta?.title || 
                              t('admin.userAdded')
        
        handleAlert({
          auction: 'success',
          text: successMessage
        })
        dialog.value = false
        // 重新載入用戶列表
        await loadUsers()
      } else {
        handleAlert({
          auction: 'error',
          text: response?.meta?.detail || 
                response?.message || 
                t('admin.userAddFailed') || 
                '新增用戶失敗'
        })
      }
    } catch (error) {
      console.error('新增用戶錯誤:', error)
      
      // 處理錯誤回應
      let errorMessage = t('admin.userAddFailed') || '新增用戶失敗'
      
      // 檢查錯誤回應格式
      // 可能的路徑：error.response.data.errors 或 error.errors（如果攔截器解包了）
      const errorsArray = error?.response?.data?.errors || error?.errors
      
      if (errorsArray && Array.isArray(errorsArray) && errorsArray.length > 0) {
        const errorData = errorsArray[0]
        
        // 處理 409 衝突錯誤（email 已存在）
        if (errorData.status === '409') {
          if (errorData.code === '4006') {
            errorMessage = t('admin.emailAlreadyUsed') || '電子信箱已被使用'
          } else {
            errorMessage = errorData.detail || errorData.title || errorMessage
          }
        } 
        // 處理 400 錯誤（缺少必要欄位等）
        else if (errorData.status === '400') {
          if (errorData.code === '4008' || errorData.code === '4010') {
            errorMessage = t('admin.passwordRequired') || '密碼是必要欄位'
          } else if (errorData.code === '4030') {
            errorMessage = t('admin.emailFormatError') || '電子信箱格式錯誤'
          } else {
            errorMessage = errorData.detail || errorData.title || errorMessage
          }
        }
        // 其他錯誤使用 detail 或 title
        else {
          errorMessage = errorData.detail || errorData.title || errorMessage
        }
      }
      // 如果不是 JSON API 格式，嘗試其他格式
      else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      // 如果錯誤本身就是字串
      else if (typeof error === 'string') {
        errorMessage = error
      }
      // 如果是 Error 物件
      else if (error?.message) {
        errorMessage = error.message
      }
      
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      loading.value = false
    }
  }
}

// Excel 上傳相關
const handleExcelFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      handleAlert({
        auction: 'error',
        text: t('admin.excelFormatError')
      })
      return
    }
    excelFile.value = file
  }
}

const uploadExcel = async () => {
  if (!excelFile.value) {
    handleAlert({
      auction: 'error',
      text: t('admin.selectExcelFile')
    })
    return
  }

  const formData = new FormData()
  formData.append('file', excelFile.value)

  try {
    // TODO: 調用實際的 API
    // const response = await uploadUsersExcelAPI(formData)
    handleAlert({
      auction: 'success',
      text: t('admin.excelUploadSuccess')
    })
    excelUploadDialog.value = false
    excelFile.value = null
    // TODO: 重新載入用戶列表
  } catch {
    handleAlert({
      auction: 'error',
      text: t('admin.excelUploadError')
    })
  }
}

const downloadExcelTemplate = () => {
  // TODO: 下載 Excel 範本檔案
  handleAlert({
    auction: 'info',
    text: t('admin.downloadTemplateInfo')
  })
}

</script>

<template>
  <div class="user-management">
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          :label="t('admin.searchUsers')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex justify-end"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="addUser"
        >
          {{ t('admin.addUser') }}
        </v-btn>
        <v-btn
          color="secondary"
          prepend-icon="mdi-upload"
          @click="excelUploadDialog = true"
        >
          {{ t('admin.uploadExcel') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <template #item.status="{ item }">
        <v-chip
          :color="item.statusColor"
          size="small"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.roles="{ item }">
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="(role, index) in (item.roles || [])"
            :key="index"
            :color="role === t('admin.admin') ? 'primary' :
              role === t('admin.counselorRole') ? 'purple' :
              role === t('admin.orgRole') ? 'blue' :
              role === (t('admin.subaccountRole') || '附屬帳號') ? 'orange' : 'default'"
            size="small"
            variant="flat"
            class="mr-1 mb-1"
          >
            {{ role }}
          </v-chip>
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editUser(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteUser(item)"
        />
      </template>
    </v-data-table>

    <!-- 編輯/新增用戶對話框 -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ editMode ? t('admin.editUser') : t('admin.addUser') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="editedItem.name"
            :label="t('admin.userName') || '帳號'"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="editedItem.email"
            :label="t('admin.email')"
            variant="outlined"
            type="email"
            required
          />
          <v-text-field
            v-if="!editMode"
            v-model="editedItem.password"
            :label="t('common.password')"
            variant="outlined"
            :type="visiblePassword ? 'text' : 'password'"
            :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
            required
            @click:append-inner="visiblePassword = !visiblePassword"
          />
          <v-autocomplete
            v-model="editedItem.roles"
            :items="availableRoles"
            :label="t('admin.role')"
            variant="outlined"
            multiple
            chips
            closable-chips
          >
            <template #chip="{ props, item }">
              <v-chip
                v-bind="props"
                :color="item.value === t('admin.admin') ? 'primary' :
                  item.value === t('admin.counselorRole') ? 'purple' :
                  item.value === t('admin.orgRole') ? 'blue' :
                  item.value === (t('admin.subaccountRole') || '附屬帳號') ? 'orange' : 'default'"
                class="mr-1"
              >
                {{ item.title }}
              </v-chip>
            </template>
          </v-autocomplete>
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
            @click="saveUser"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Excel 上傳對話框 -->
    <v-dialog
      v-model="excelUploadDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.uploadExcel') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="mb-4">
            <v-btn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="downloadExcelTemplate"
            >
              {{ t('admin.downloadTemplate') }}
            </v-btn>
          </div>
          <v-file-input
            :label="t('admin.selectExcelFile')"
            variant="outlined"
            accept=".xlsx,.xls"
            prepend-icon="mdi-file-excel"
            @change="handleExcelFileSelect"
          />
          <div
            v-if="excelFile"
            class="mt-2"
          >
            <v-chip
              color="success"
              prepend-icon="mdi-check-circle"
            >
              {{ excelFile.name }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis mt-4">
            {{ t('admin.excelUploadHint') }}
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="excelUploadDialog = false; excelFile = null"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :disabled="!excelFile"
            @click="uploadExcel"
          >
            {{ t('admin.upload') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-management {
  padding: 8px 0;
}
</style>

