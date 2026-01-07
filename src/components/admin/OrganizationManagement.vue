<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { handleAlert } from '@/plugins/utils/alert'
import { listOrgAdminAPI, updateOrgAdminAPI, createOrgAdminAPI, optionsCounselorList } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()
const appStore = useAppStore()

// 檢查是否為機構角色
const isOrganizationRole = computed(() => {
  return appStore.selectedRole === 'organization' || appStore.selectedRole === 'org'
})

const search = ref('')
const headers = ref([
  { title: t('admin.orgName'), key: 'name' },
  { title: t('admin.orgCode'), key: 'code' },
  { title: t('admin.contactPerson'), key: 'contact' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.phone'), key: 'phone' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const organizations = ref([])
const loading = ref(false)
const saving = ref(false)

// 諮商師列表
const counselors = ref([])
const loadingCounselors = ref(false)

// 載入諮商師/觀察者列表
const loadCounselorOptions = async () => {
  loadingCounselors.value = true
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
      // 將諮商師/觀察者列表映射為前端格式
      counselors.value = counselorList.map(counselor => {
        const code = counselor.counselor_code || ''
        const name = counselor.name || ''
        const displayText = code ? `(${code}) ${name}` : name
        return {
          id: counselor.id || '',
          name: name,
          counselorCode: code,
          displayText: displayText
        }
      })
      console.log('載入完成，共', counselors.value.length, '筆諮商師/觀察者資料')
    } else {
      console.warn('API 回應格式不符合預期:', response)
      counselors.value = []
    }
  } catch (error) {
    console.error('載入諮商師/觀察者列表錯誤:', error)
    counselors.value = []
  } finally {
    loadingCounselors.value = false
  }
}

// 將後端組織資料映射到前端格式
const mapOrgData = (backendOrg) => {
  return {
    id: backendOrg.id || backendOrg.org_id,
    name: backendOrg.org_name || '',
    code: backendOrg.org_code || '',
    contact: backendOrg.contact_person || '',
    email: backendOrg.contact_email || '',
    phone: backendOrg.contact_phone || '',
    status: backendOrg.st === '1' ? t('admin.active') : t('admin.inactive'),
    statusColor: backendOrg.st === '1' ? 'success' : 'warning',
    statusValue: backendOrg.st || '0', // 保存原始狀態值供編輯使用
    address: backendOrg.contact_address || '',
    description: backendOrg.description || '',
    defaultCounselors: backendOrg.org_default_counselors || backendOrg.default_counselors || [],
    is_admin: backendOrg.is_admin || '0' // 保存 is_admin 資訊
  }
}

// 載入組織列表
const loadOrganizations = async () => {
  loading.value = true
  try {
    // 如果是機構角色，從 appStore.myOrg 讀取
    if (isOrganizationRole.value) {
      console.log('機構角色：從 appStore.myOrg 讀取組織列表')
      console.log('appStore.myOrg:', appStore.myOrg)
      
      if (Array.isArray(appStore.myOrg) && appStore.myOrg.length > 0) {
        // 將 appStore.myOrg 轉換為表格格式
        // 需要根據 org_id 查詢完整的組織資訊，這裡先使用 myOrg 的資料
        // 注意：myOrg 只有 org_id, org_name, org_code, is_admin
        // 需要從 API 獲取完整資訊或使用現有資料
        const orgList = appStore.myOrg.map(org => ({
          id: org.org_id,
          org_id: org.org_id,
          org_name: org.org_name,
          org_code: org.org_code,
          is_admin: org.is_admin,
          // 其他欄位設為空值，因為 myOrg 沒有這些資訊
          contact_person: '',
          contact_email: '',
          contact_phone: '',
          contact_address: '',
          description: '',
          st: '1', // 預設為啟用
          org_default_counselors: []
        }))
        
        organizations.value = orgList.map(mapOrgData)
        // 保存 is_admin 資訊供模板使用
        organizations.value.forEach((org, index) => {
          org.is_admin = appStore.myOrg[index].is_admin
        })
        
        console.log('載入完成，共', organizations.value.length, '筆組織資料')
      } else {
        console.log('appStore.myOrg 為空或不是陣列')
        organizations.value = []
      }
    } else {
      // 管理員角色：從 API 讀取
    console.log('載入組織列表...')
    const response = await listOrgAdminAPI()
    
    // 注意：axios 攔截器已經將 response.data 解包，所以這裡直接使用 response
    // API 回應格式：{ data: { attributes: { organization_list: [...] } } }
    // 攔截器解包後：{ attributes: { organization_list: [...] } }
    let orgList = []
    
    if (response?.data?.attributes?.organization_list) {
      // 如果攔截器沒有完全解包：response.data.attributes.organization_list
      orgList = response.data.attributes.organization_list
    } else if (response?.attributes?.organization_list) {
      // 攔截器已解包：response.attributes.organization_list
      orgList = response.attributes.organization_list
    } else if (response?.organization_list) {
      // 直接格式：response.organization_list
      orgList = response.organization_list
    } else if (Array.isArray(response)) {
      // 如果直接是陣列
      orgList = response
    }
    
    if (Array.isArray(orgList)) {
      organizations.value = orgList.map(mapOrgData)
      console.log('載入完成，共', organizations.value.length, '筆組織資料')
      if (organizations.value.length === 0) {
        console.log('目前沒有組織資料')
      }
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: t('admin.loadOrganizationsError')
      })
      organizations.value = []
      }
    }
  } catch (error) {
    console.error('載入組織列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadOrganizationsError')
    })
    organizations.value = []
  } finally {
    loading.value = false
  }
  console.log('組織列表:', organizations.value)
}

// 初始化載入
onMounted(() => {
  loadOrganizations()
  loadCounselorOptions()
})

const editedItem = ref({
  id: null,
  name: '',
  code: '',
  contact: '',
  email: '',
  phone: '',
  status: t('admin.active'),
  statusColor: 'success',
  statusValue: '1', // 原始狀態值（'1' 為啟用，'0' 為停用）
  address: '',
  description: '',
  defaultCounselors: []
})
const dialog = ref(false)
const editMode = ref(false)

const addOrganization = () => {
  editedItem.value = {
    id: null,
    name: '',
    code: '',
    contact: '',
    email: '',
    phone: '',
    status: t('admin.active'),
    statusColor: 'success',
    statusValue: '1',
    address: '',
    description: '',
    defaultCounselors: []
  }
  editMode.value = false
  dialog.value = true
}

const editOrganization = (item) => {
  editedItem.value = { ...item }
  editMode.value = true
  dialog.value = true
}

const deleteOrganization = (item) => {
  const index = organizations.value.findIndex(org => org.id === item.id)
  if (index > -1) {
    organizations.value.splice(index, 1)
  }
}

const saveOrganization = async () => {
  if (editMode.value) {
    // 編輯模式：調用更新 API
    saving.value = true
    try {
      // 驗證必填欄位
      if (!editedItem.value.name || !editedItem.value.code) {
        handleAlert({
          auction: 'error',
          text: t('admin.orgNameAndCodeRequired')
        })
        saving.value = false
        return
      }

      // 驗證組織 ID 是否存在
      if (!editedItem.value.id) {
        handleAlert({
          auction: 'error',
          text: t('admin.orgIdRequired')
        })
        saving.value = false
        return
      }

      // 將狀態文字轉換為後端需要的格式（'1' 為啟用，'0' 為停用）
      const statusValue = editedItem.value.status === t('admin.active') ? '1' : '0'

      // 準備 API 參數
      const updateData = {
        org_code: editedItem.value.code,
        org_name: editedItem.value.name,
        org_description: editedItem.value.description || '',
        org_contact_person: editedItem.value.contact || '',
        org_contact_phone: editedItem.value.phone || '',
        org_contact_email: editedItem.value.email || '',
        org_contact_address: editedItem.value.address || '',
        org_default_counselors: editedItem.value.defaultCounselors || [],
        org_st: statusValue
      }

      console.log('更新組織資料:', editedItem.value.id, updateData)
      const response = await updateOrgAdminAPI(editedItem.value.id, updateData)
      console.log('更新組織回應:', response)

      // 更新成功後重新載入組織列表
      await loadOrganizations()

      handleAlert({
        auction: 'success',
        text: t('admin.updateOrganizationSuccess')
      })

      dialog.value = false
    } catch (error) {
      console.error('更新組織資料錯誤:', error)
      const errorMessage = error?.response?.data?.message || error?.message || t('admin.updateOrganizationError')
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  } else {
    // 新增模式：調用新增 API
    saving.value = true
    try {
      // 驗證必填欄位（新增時組織名稱為必填，組織代碼可能由後端生成）
      if (!editedItem.value.name) {
        handleAlert({
          auction: 'error',
          text: t('admin.orgNameRequired') || '組織名稱為必填欄位'
        })
        saving.value = false
        return
      }

      // 將狀態文字轉換為後端需要的格式（'1' 為啟用，'0' 為停用）
      const statusValue = editedItem.value.status === t('admin.active') ? '1' : '0'

      // 準備 API 參數（新增時不需要 org_code，由後端生成）
      const createData = {
        org_name: editedItem.value.name,
        org_description: editedItem.value.description || '',
        org_contact_person: editedItem.value.contact || '',
        org_contact_phone: editedItem.value.phone || '',
        org_contact_email: editedItem.value.email || '',
        org_contact_address: editedItem.value.address || '',
        org_default_counselors: editedItem.value.defaultCounselors || [],
        org_st: statusValue
      }

      console.log('新增組織資料:', createData)
      const response = await createOrgAdminAPI(createData)
      console.log('新增組織回應:', response)

      // 新增成功後重新載入組織列表
      await loadOrganizations()

      handleAlert({
        auction: 'success',
        text: t('admin.addOrganizationSuccess')
      })

      dialog.value = false
    } catch (error) {
      console.error('新增組織資料錯誤:', error)
      const errorMessage = error?.response?.data?.message || error?.message || t('admin.addOrganizationError')
      handleAlert({
        auction: 'error',
        text: errorMessage
      })
    } finally {
      saving.value = false
    }
  }
}

const filteredOrganizations = computed(() => {
  if (!search.value) {
    return organizations.value
  }
  const searchLower = search.value.toLowerCase()
  return organizations.value.filter(org =>
    org.name.toLowerCase().includes(searchLower) ||
    org.code.toLowerCase().includes(searchLower) ||
    org.contact.toLowerCase().includes(searchLower) ||
    org.email.toLowerCase().includes(searchLower)
  )
})

const stats = computed(() => [
  {
    title: t('admin.totalOrganizations'),
    value: organizations.value.length,
    icon: 'mdi-office-building',
    color: 'blue'
  },
  {
    title: t('admin.activeOrganizations'),
    value: organizations.value.filter(org => org.status === t('admin.active')).length,
    icon: 'mdi-check-circle',
    color: 'green'
  }
])

// 獲取諮商師顯示文字
const getCounselorDisplayText = (counselorId) => {
  const counselor = counselors.value.find(c => String(c.id) === String(counselorId))
  return counselor?.displayText || counselor?.name || '-'
}
</script>

<template>
  <div class="organization-management">
    <!-- 統計卡片（機構角色時隱藏） -->
    <v-row
      v-if="!isOrganizationRole"
      class="mb-4"
    >
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
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

    <!-- 搜尋和新增按鈕（機構角色時隱藏） -->
    <v-row
      v-if="!isOrganizationRole"
      class="mb-4"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          :label="t('admin.searchOrganizations')"
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
          @click="addOrganization"
        >
          {{ t('admin.addOrganization') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- 表格 -->
    <v-data-table
      :headers="headers"
      :items="filteredOrganizations"
      :search="search"
      :loading="loading"
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

      <template #item.actions="{ item }">
        <!-- 編輯按鈕：機構角色時只有 is_admin === '1' 才顯示 -->
        <v-btn
          v-if="!isOrganizationRole || item.is_admin === '1'"
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editOrganization(item)"
        />
        <!-- 刪除按鈕：機構角色時隱藏 -->
        <v-btn
          v-if="!isOrganizationRole"
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteOrganization(item)"
        />
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="viewOrganization(item)"
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
          {{ editMode ? t('admin.editOrganization') : t('admin.addOrganization') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                :label="t('admin.orgName')"
                variant="outlined"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.code"
                :label="t('admin.orgCode')"
                variant="outlined"
                :readonly="editMode"
                :disabled="!editMode"
                :hint="!editMode ? (t('admin.orgCodeAutoGenerated')) : ''"
                persistent-hint
                class="readonly-field"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.contact"
                :label="t('admin.contactPerson')"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.email"
                :label="t('admin.email')"
                variant="outlined"
                type="email"
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
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.address"
                :label="t('admin.address')"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.description"
                :label="t('admin.description')"
                variant="outlined"
                rows="3"
              />
            </v-col>
            <!-- 預設諮商師 -->
            <v-col cols="12">
              <v-autocomplete
                v-model="editedItem.defaultCounselors"
                :items="counselors.map(c => ({ 
                  title: c.displayText || `${c.name} (${c.counselorCode})`, 
                  value: c.id 
                }))"
                :label="t('admin.defaultCounselors')"
                variant="outlined"
                multiple
                chips
                closable-chips
                :loading="loadingCounselors"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-icon="'mdi-account-tie'"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ t('admin.noCounselorFound') || '找不到諮商師' }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- 狀態欄位 -->
            <v-col cols="12">
              <v-select
                v-model="editedItem.status"
                :items="[t('admin.active'), t('admin.inactive')]"
                :label="t('admin.status')"
                variant="outlined"
                :readonly="isOrganizationRole"
                :disabled="isOrganizationRole"
                :class="isOrganizationRole ? 'readonly-field' : ''"
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
            @click="saveOrganization"
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
          {{ t('admin.orgDetails') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row v-if="viewingItem">
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.orgName') }}
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
                {{ t('admin.orgCode') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.code }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.contactPerson') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.contact }}
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
                {{ t('admin.address') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.address }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.description') }}
              </div>
              <div class="text-body-1 mb-4">
                {{ viewingItem.description }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.defaultCounselors') }}
              </div>
              <div
                v-if="viewingItem.defaultCounselors && viewingItem.defaultCounselors.length > 0"
                class="mb-4"
              >
                <v-chip
                  v-for="counselorId in viewingItem.defaultCounselors"
                  :key="counselorId"
                  class="mr-2 mb-2"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-account-tie"
                >
                  {{ getCounselorDisplayText(counselorId) }}
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
            @click="viewDialog = false"
          >
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewDialog: false,
      viewingItem: null
    }
  },
  methods: {
    viewOrganization(item) {
      this.viewingItem = { ...item }
      this.viewDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-management {
  padding: 8px 0;

  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }

  // 只讀/禁用欄位樣式：保持黑色文字和外框
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

    input {
      color: rgba(0, 0, 0, 0.87) !important;
      cursor: default;
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

      input {
        color: rgba(0, 0, 0, 0.87) !important;
        -webkit-text-fill-color: rgba(0, 0, 0, 0.87) !important;
      }
    }
  }
}
</style>


