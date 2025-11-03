<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleAlert } from '@/plugins/utils/alert'

const { t } = useI18n()

const search = ref('')
const headers = ref([
  { title: t('admin.userName'), key: 'name' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.role'), key: 'roles' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const users = ref([
  {
    name: '張三',
    email: 'zhang@example.com',
    roles: [t('admin.user')],
    status: t('admin.active'),
    statusColor: 'success'
  },
  {
    name: '李四',
    email: 'li@example.com',
    roles: [t('admin.user'), t('admin.counselorRole')],
    status: t('admin.active'),
    statusColor: 'success'
  },
  {
    name: '王五',
    email: 'wang@example.com',
    roles: [t('admin.user')],
    status: t('admin.inactive'),
    statusColor: 'warning'
  },
  {
    name: '趙六',
    email: 'zhao@example.com',
    roles: [t('admin.admin'), t('admin.counselorRole')],
    status: t('admin.active'),
    statusColor: 'success'
  }
])

// 可用的角色選項
const availableRoles = ref([
  { title: t('admin.user'), value: t('admin.user') },
  { title: t('admin.admin'), value: t('admin.admin') },
  { title: t('admin.counselorRole'), value: t('admin.counselorRole') },
  { title: t('admin.orgRole'), value: t('admin.orgRole') }
])

const editedItem = ref({
  name: '',
  email: '',
  roles: [],
  status: '',
  statusColor: 'success'
})
const dialog = ref(false)
const editMode = ref(false)
const excelUploadDialog = ref(false)
const excelFile = ref(null)

const addUser = () => {
  editedItem.value = {
    name: '',
    email: '',
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

const deleteUser = (item) => {
  const index = users.value.indexOf(item)
  if (index > -1) {
    users.value.splice(index, 1)
  }
}

const saveUser = () => {
  // 驗證必填欄位
  if (!editedItem.value.name || !editedItem.value.email) {
    handleAlert({
      auction: 'error',
      text: t('admin.fillRequiredFields')
    })
    return
  }

  if (editMode.value) {
    // 編輯模式
    const index = users.value.findIndex(u => u.email === editedItem.value.email)
    if (index > -1) {
      users.value[index] = { ...editedItem.value }
      handleAlert({
        auction: 'success',
        text: t('admin.userUpdated')
      })
    }
  } else {
    // 新增模式
    const newUser = {
      ...editedItem.value,
      roles: editedItem.value.roles || []
    }
    users.value.push(newUser)
    handleAlert({
      auction: 'success',
      text: t('admin.userAdded')
    })
    // TODO: 調用 API 創建用戶
  }
  dialog.value = false
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
  } catch (error) {
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

const filteredUsers = computed(() => {
  if (!search.value) {
    return users.value
  }
  const searchLower = search.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    (user.roles && user.roles.some(role => role.toLowerCase().includes(searchLower)))
  )
})
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
      :items="filteredUsers"
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
                   role === t('admin.orgRole') ? 'blue' : 'default'"
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
            :label="t('admin.userName')"
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
                       item.value === t('admin.orgRole') ? 'blue' : 'default'"
                class="mr-1"
              >
                {{ item.title }}
              </v-chip>
            </template>
          </v-autocomplete>
          <v-select
            v-model="editedItem.status"
            :items="[t('admin.active'), t('admin.inactive')]"
            :label="t('admin.status')"
            variant="outlined"
            required
          />
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

