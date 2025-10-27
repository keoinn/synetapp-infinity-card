<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 機構列表
const selectedOrg = ref(null)
const organizations = ref([
  {
    id: 1,
    name: '台北市政府教育局',
    code: 'ORG001',
    contact: '張主任',
    email: 'contact@edu.gov.taipei',
    phone: '02-27208889'
  },
  {
    id: 2,
    name: '新北市教育局',
    code: 'ORG002',
    contact: '李主任',
    email: 'contact@tpc.gov.tw',
    phone: '02-29603456'
  },
  {
    id: 3,
    name: '台中市政府教育局',
    code: 'ORG003',
    contact: '王主任',
    email: 'contact@education.taichung.gov.tw',
    phone: '04-22289111'
  }
])

// 子帳號列表
const subAccounts = ref([
  {
    id: 1,
    orgId: 1,
    name: '張老師',
    email: 'teacher1@org.edu.taipei',
    username: 'teacher001',
    role: 'teacher',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    orgId: 1,
    name: '李老師',
    email: 'teacher2@org.edu.taipei',
    username: 'teacher002',
    role: 'teacher',
    status: 'active',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    orgId: 1,
    name: '王管理員',
    email: 'admin@org.edu.taipei',
    username: 'admin001',
    role: 'admin',
    status: 'inactive',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    orgId: 2,
    name: '陳老師',
    email: 'teacher1@org.edu.newtaipei',
    username: 'teacher003',
    role: 'teacher',
    status: 'active',
    createdAt: '2024-01-10'
  }
])

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
  email: '',
  username: '',
  role: 'teacher',
  status: 'active',
  createdAt: ''
})

const headers = [
  { title: t('admin.userName'), key: 'name' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.username'), key: 'username' },
  { title: t('admin.role'), key: 'role' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.createdAt'), key: 'createdAt' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
]

// 角色選項
const roleOptions = [
  { value: 'teacher', label: t('admin.teacher') },
  { value: 'admin', label: t('admin.admin') },
  { value: 'viewer', label: t('admin.viewer') }
]

const statusOptions = [
  { value: 'active', label: t('admin.active') },
  { value: 'inactive', label: t('admin.inactive') }
]

// 選擇機構
const selectOrganization = (org) => {
  selectedOrg.value = org
}

// 新增子帳號
const addSubAccount = () => {
  editMode.value = false
  editedAccount.value = {
    id: null,
    orgId: selectedOrg.value.id,
    name: '',
    email: '',
    username: '',
    role: 'teacher',
    status: 'active',
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
const deleteSubAccount = (account) => {
  const index = subAccounts.value.findIndex(a => a.id === account.id)
  if (index > -1) {
    subAccounts.value.splice(index, 1)
  }
}

// 儲存子帳號
const saveSubAccount = () => {
  if (editMode.value) {
    // 編輯模式
    const index = subAccounts.value.findIndex(a => a.id === editedAccount.value.id)
    if (index > -1) {
      subAccounts.value[index] = { ...editedAccount.value }
    }
  } else {
    // 新增模式
    const newId = Math.max(...subAccounts.value.map(a => a.id), 0) + 1
    subAccounts.value.push({
      ...editedAccount.value,
      id: newId
    })
  }
  dialog.value = false
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
    title: t('admin.teacherAccounts'),
    value: currentOrgSubAccounts.value.filter(a => a.role === 'teacher').length,
    icon: 'mdi-school',
    color: 'orange'
  }
])

onMounted(() => {
  if (organizations.value.length > 0) {
    selectOrganization(organizations.value[0])
  }
})
</script>

<template>
  <div class="org-sub-account-management">
    <!-- 機構選擇 -->
    <v-card class="mb-4">
      <v-card-title>{{ t('admin.selectOrganization') }}</v-card-title>
      <v-card-text>
        <v-select
          :model-value="selectedOrg?.name"
          :items="organizations.map(org => ({ title: `${org.name} (${org.code})`, value: org.id }))"
          variant="outlined"
          @update:model-value="(id) => selectOrganization(organizations.find(o => o.id === id))"
        />
      </v-card-text>
    </v-card>

    <template v-if="selectedOrg">
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
        :headers="headers"
        :items="filteredAccounts"
        :search="search"
        class="elevation-1"
      >
        <template #item.role="{ item }">
          <v-chip
            :color="item.role === 'admin' ? 'error' : item.role === 'teacher' ? 'info' : 'default'"
            size="small"
          >
            {{ roleOptions.find(r => r.value === item.role)?.label }}
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
                  :label="t('admin.userName')"
                  variant="outlined"
                  required
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
              <v-col cols="12">
                <v-text-field
                  v-model="editedAccount.username"
                  :label="t('admin.username')"
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
                  :label="t('admin.role')"
                  variant="outlined"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="editedAccount.status"
                  :items="statusOptions"
                  :label="t('admin.status')"
                  variant="outlined"
                />
              </v-col>
              <v-col
                v-if="editMode"
                cols="12"
              >
                <v-text-field
                  :model-value="editedAccount.createdAt"
                  :label="t('admin.createdAt')"
                  variant="outlined"
                  disabled
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
}
</style>


