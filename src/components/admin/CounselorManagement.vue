<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleAlert } from '@/plugins/utils/alert'
import { getCounselorListAPI, createCounselorAPI, updateCounselorAPI } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()

const search = ref('')
const headers = ref([
  { title: t('admin.counselor.counselorCode'), key: 'code' },
  { title: t('admin.counselor.name'), key: 'name' },
  { title: t('admin.counselor.accountType'), key: 'accountType' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.phone'), key: 'phone' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const counselors = ref([])
const loading = ref(false)

// 將後端諮商師資料映射到前端格式
const mapCounselorData = (backendCounselor) => {
  const counselorCode = backendCounselor.counselor_code || ''
  return {
    id: backendCounselor.id || null,
    userId: backendCounselor.user_id || null,
    code: counselorCode,
    counselorCode: counselorCode, // 同時映射為 counselorCode 供表單使用
    accountType: backendCounselor.type || '1', // '0' = 觀察者, '1' = 諮商師
    name: backendCounselor.name || '',
    email: backendCounselor.email || '',
    phone: backendCounselor.phone || '',
    specialty: backendCounselor.domain || '',
    education: backendCounselor.education || '',
    status: backendCounselor.st === '1' ? t('admin.active') : t('admin.inactive'),
    statusColor: backendCounselor.st === '1' ? 'success' : 'warning',
    account: backendCounselor.account || '',
    createdAt: backendCounselor.created_at || null,
    updatedAt: backendCounselor.updated_at || null
  }
}

// 載入諮商師列表
const loadCounselors = async () => {
  loading.value = true
  try {
    console.log('載入諮商師列表...')
    const response = await getCounselorListAPI()
    console.log('載入諮商師列表回應:', response)
    
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
      counselors.value = counselorList.map(mapCounselorData)
      console.log('載入完成，共', counselors.value.length, '筆諮商師資料')
      if (counselors.value.length === 0) {
        console.log('目前沒有諮商師資料')
      }
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.loadCounselorsError') || '載入諮商師列表失敗'
      })
      counselors.value = []
    }
  } catch (error) {
    console.error('載入諮商師列表錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.loadCounselorsError') || 
                        '載入諮商師列表失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
    counselors.value = []
  } finally {
    loading.value = false
  }
}

// 初始化載入
onMounted(() => {
  loadCounselors()
})

const editedItem = ref({
  id: null,
  account: '', // 帳號
  email: '',
  accountType: '0', // 帳號類型：0 = 觀察者, 1 = 諮商師
  counselorCode: '', // 諮商師代碼
  name: '',
  phone: '',
  specialty: '',
  education: '',
  status: t('admin.active'),
  statusColor: 'success'
})
const dialog = ref(false)
const editMode = ref(false)
const detailDialog = ref(false)
const viewingItem = ref(null)

const addCounselor = () => {
  editMode.value = false
  editedItem.value = {
    id: null,
    account: '',
    email: '',
    accountType: '0', // 預設為觀察者
    counselorCode: '',
    name: '',
    phone: '',
    specialty: '',
    education: '',
    status: t('admin.active'),
    statusColor: 'success'
  }
  dialog.value = true
}

const editCounselor = (item) => {
  editMode.value = true
  editedItem.value = { ...item }
  dialog.value = true
}

const viewCounselor = (item) => {
  viewingItem.value = { ...item }
  detailDialog.value = true
}

const deleteCounselor = (item) => {
  const index = counselors.value.findIndex(c => c.id === item.id)
  if (index > -1) {
    counselors.value.splice(index, 1)
  }
}

const saving = ref(false)

const saveCounselor = async () => {
  // 驗證必填欄位
  if (!editedItem.value.account || !editedItem.value.email || !editedItem.value.name) {
    handleAlert({
      auction: 'error',
      text: t('admin.fillRequiredFields') || '請填寫必填欄位'
    })
    return
  }

  if (editMode.value) {
    // 編輯模式 - 調用 API 更新諮商師
    if (!editedItem.value.id) {
      handleAlert({
        auction: 'error',
        text: t('admin.invalidCounselor') || '無效的諮商師資料'
      })
      return
    }

    saving.value = true
    try {
      console.log('開始更新諮商師...')
      console.log('諮商師 ID:', editedItem.value.id)
      console.log('表單資料:', editedItem.value)
      
      // 將前端的 status 轉換為後端的 st ('1' = 啟用, '0' = 停用)
      const st = editedItem.value.status === t('admin.active') ? '1' : '0'
      
      // 準備 API 參數（根據 request example，不包含 email）
      const apiParams = {
        type: editedItem.value.accountType || '0', // '0' = 觀察者, '1' = 諮商師
        name: editedItem.value.name,
        phone: editedItem.value.phone || '',
        domain: editedItem.value.specialty || '', // 專業領域
        education: editedItem.value.education || '',
        st: st
      }
      
      console.log('更新諮商師 API 參數:', apiParams)
      
      const response = await updateCounselorAPI(editedItem.value.id, apiParams)
      console.log('更新諮商師 API 回應:', response)
      
      // 解析 API 回應
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
      
      // 檢查是否成功（通常 code 2005 或 status 200 表示成功）
      if (responseCode === '2005' || responseStatus === '200') {
        handleAlert({
          auction: 'success',
          text: responseDetail || t('admin.counselorUpdated') || '諮商師更新成功'
        })
        
        // 關閉對話框
        dialog.value = false
        
        // 重新載入諮商師列表
        await loadCounselors()
      } else {
        throw new Error(responseDetail || '更新諮商師失敗')
      }
    } catch (error) {
      console.error('更新諮商師錯誤:', error)
      const errorMessage = error?.response?.data?.meta?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          t('admin.counselorUpdateFailed') || 
                          '更新諮商師失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  } else {
    // 新增模式 - 調用 API 創建諮商師
    saving.value = true
    try {
      console.log('開始創建諮商師...')
      console.log('表單資料:', editedItem.value)
      
      // 將前端的 status 轉換為後端的 st ('1' = 啟用, '0' = 停用)
      const st = editedItem.value.status === t('admin.active') ? '1' : '0'
      
      // 準備 API 參數
      const apiParams = {
        account: editedItem.value.account,
        email: editedItem.value.email,
        name: editedItem.value.name,
        type: editedItem.value.accountType || '1', // '0' = 觀察者, '1' = 諮商師
        phone: editedItem.value.phone || '',
        domain: editedItem.value.specialty || '', // 專業領域
        education: editedItem.value.education || '',
        st: st
      }
      
      console.log('創建諮商師 API 參數:', apiParams)
      
      const response = await createCounselorAPI(apiParams)
      console.log('創建諮商師 API 回應:', response)
      
      // 解析 API 回應
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const responseDetail = response?.meta?.detail || response?.data?.meta?.detail
      
      // 檢查是否成功（通常 code 2005 或 status 200 表示成功）
      if (responseCode === '2005' || responseStatus === '200') {
        handleAlert({
          auction: 'success',
          text: responseDetail || t('admin.counselorCreated') || '諮商師創建成功'
        })
        
        // 關閉對話框
        dialog.value = false
        
        // 重新載入諮商師列表
        await loadCounselors()
      } else {
        throw new Error(responseDetail || '創建諮商師失敗')
      }
    } catch (error) {
      console.error('創建諮商師錯誤:', error)
      const errorMessage = error?.response?.data?.meta?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          t('admin.counselorCreateFailed') || 
                          '創建諮商師失敗'
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  }
}

const filteredCounselors = computed(() => {
  if (!search.value) {
    return counselors.value
  }
  const searchLower = search.value.toLowerCase()
  return counselors.value.filter(counselor =>
    counselor.name.toLowerCase().includes(searchLower) ||
    (counselor.code || counselor.counselorCode || counselor.licenseNumber || '').toLowerCase().includes(searchLower) ||
    counselor.email.toLowerCase().includes(searchLower) ||
    (counselor.specialty || '').toLowerCase().includes(searchLower)
  )
})

const stats = computed(() => [
  {
    title: t('admin.counselor.totalCounselorsAndObservers') || '諮商師/觀察者總數',
    value: counselors.value.length,
    icon: 'mdi-account-group',
    color: 'primary'
  },
  {
    title: t('admin.counselor.totalCounselors') || '諮商師總數',
    value: counselors.value.filter(c => c.accountType === '1').length,
    icon: 'mdi-account-tie',
    color: 'success'
  },
  {
    title: t('admin.counselor.totalObservers') || '觀察者總數',
    value: counselors.value.filter(c => c.accountType === '0').length,
    icon: 'mdi-account-eye',
    color: 'info'
  }
])

const specialtyOptions = [
  '青少年諮商',
  '生涯規劃',
  '情緒管理',
  '壓力調適',
  '家庭諮商',
  '親職教育',
  '人際關係',
  '職涯諮商'
]

const licenseTypeOptions = [
  '諮商心理師',
  '臨床心理師',
  '心理師'
]
</script>

<template>
  <div class="counselor-management">
    <!-- 統計卡片 -->
    <v-row class="mb-4">
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
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          :label="t('admin.searchCounselors')"
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
          @click="addCounselor"
        >
          {{ t('admin.addCounselor') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- 表格 -->
    <v-data-table
      :headers="headers"
      :items="filteredCounselors"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template #item.code="{ item }">
        {{ item.code || item.counselorCode || item.licenseNumber || '-' }}
      </template>

      <template #item.accountType="{ item }">
        <v-chip
          :color="item.accountType === '1' ? 'primary' : 'default'"
          size="small"
          variant="flat"
        >
          {{ item.accountType === '1' ? (t('admin.counselor.counselor') || '諮商師') : (t('admin.counselor.observer') || '觀察者') }}
        </v-chip>
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="item.statusColor"
          size="small"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="viewCounselor(item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editCounselor(item)"
        />
      </template>
    </v-data-table>

    <!-- 新增/編輯對話框 -->
    <v-dialog
      v-model="dialog"
      max-width="700px"
      scrollable
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ editMode ? t('admin.editCounselor') : t('admin.addCounselor') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <!-- 第一行：帳號、電子信箱 -->
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.account"
                :label="t('admin.userName') || '帳號'"
                variant="outlined"
                :disabled="editMode"
                :hint="editMode ? t('admin.counselor.cannotModifyAccount'): ''"
                persistent-hint
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.email"
                :label="t('admin.email')"
                type="email"
                variant="outlined"
                :disabled="editMode"
                :hint="editMode ? t('admin.counselor.cannotModifyEmail'): ''"
                persistent-hint
                required
              />
            </v-col>
            <!-- 第二行：帳號類型、諮商師代碼 -->
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="editedItem.accountType"
                :items="[
                  { title: t('admin.counselor.observer'), value: '0' },
                  { title: t('admin.counselor.counselor'), value: '1' }
                ]"
                :label="t('admin.counselor.accountType')"
                variant="outlined"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.counselorCode"
                :label="t('admin.counselor.counselorCode')"
                variant="outlined"
                disabled
                :hint="t('admin.counselor.cannotModifyCounselorCode')"
                persistent-hint
              />
            </v-col>
            <!-- 第三行：姓名、電話 -->
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.name"
                :label="t('admin.counselorName')"
                variant="outlined"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.phone"
                :label="t('admin.phone')"
                variant="outlined"
              />
            </v-col>
            <!-- 第四行：專業領域（文字區域） -->
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.specialty"
                :label="t('admin.specialty')"
                variant="outlined"
                rows="3"
              />
            </v-col>
            <!-- 第五行：學歷（文字區域） -->
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.education"
                :label="t('admin.education')"
                variant="outlined"
                rows="3"
              />
            </v-col>
            <!-- 第六行：狀態 -->
            <v-col cols="12">
              <v-select
                v-model="editedItem.status"
                :items="[t('admin.active'), t('admin.inactive')]"
                :label="t('admin.status')"
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
            :loading="saving"
            :disabled="saving"
            @click="saveCounselor"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 查看詳情對話框 -->
    <v-dialog
      v-model="detailDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.counselorDetails') }}
        </v-card-title>
        <v-divider />
        <v-card-text v-if="viewingItem">
          <v-row>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.counselorName') }}
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
                {{ t('admin.licenseNumber') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.licenseNumber }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.licenseType') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.licenseType }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.email') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.email }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.phone') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.phone }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.specialty') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.specialty }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.organization') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.organization }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.licenseExpiry') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.licenseExpiry }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.experience') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.experience }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.education') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.education }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.status') }}
              </div>
              <v-chip
                :color="viewingItem.statusColor"
                size="small"
              >
                {{ viewingItem.status }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="detailDialog = false"
          >
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.counselor-management {
  padding: 8px 0;

  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }
}
</style>

