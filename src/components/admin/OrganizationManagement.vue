<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const organizations = ref([
  {
    id: 1,
    name: '台北市政府教育局',
    code: 'ORG001',
    contact: '張主任',
    email: 'contact@edu.gov.taipei',
    phone: '02-27208889',
    status: t('admin.active'),
    statusColor: 'success',
    address: '台北市信義區市府路1號',
    description: '台北市教育管理機構',
    defaultCounselors: [1, 2]
  },
  {
    id: 2,
    name: '新北市教育局',
    code: 'ORG002',
    contact: '李主任',
    email: 'contact@tpc.gov.tw',
    phone: '02-29603456',
    status: t('admin.active'),
    statusColor: 'success',
    address: '新北市板橋區中山路一段161號',
    description: '新北市教育管理機構',
    defaultCounselors: [2, 3]
  },
  {
    id: 3,
    name: '台中市政府教育局',
    code: 'ORG003',
    contact: '王主任',
    email: 'contact@education.taichung.gov.tw',
    phone: '04-22289111',
    status: t('admin.inactive'),
    statusColor: 'warning',
    address: '台中市西屯區台灣大道三段99號',
    description: '台中市教育管理機構',
    defaultCounselors: [3]
  }
])

// 諮商師列表（應從 API 或 store 獲取）
const counselors = ref([
  { id: 1, name: '王心理師', licenseNumber: 'CP0001' },
  { id: 2, name: '李諮商師', licenseNumber: 'CP0002' },
  { id: 3, name: '張心理師', licenseNumber: 'CP0003' }
])

const editedItem = ref({
  id: null,
  name: '',
  code: '',
  contact: '',
  email: '',
  phone: '',
  status: t('admin.active'),
  statusColor: 'success',
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

const saveOrganization = () => {
  if (editMode.value) {
    const index = organizations.value.findIndex(org => org.id === editedItem.value.id)
    if (index > -1) {
      organizations.value[index] = { ...editedItem.value }
    }
  } else {
    // 新增模式
    const newId = Math.max(...organizations.value.map(org => org.id), 0) + 1
    organizations.value.push({
      ...editedItem.value,
      id: newId
    })
  }
  dialog.value = false
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
</script>

<template>
  <div class="organization-management">
    <!-- 統計卡片 -->
    <v-row class="mb-4">
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

    <!-- 搜尋和新增按鈕 -->
    <v-row class="mb-4">
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
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editOrganization(item)"
        />
        <v-btn
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
            <v-col cols="12">
              <v-autocomplete
                v-model="editedItem.defaultCounselors"
                :items="counselors.map(c => ({ 
                  title: `${c.name} (${c.licenseNumber})`, 
                  value: c.id 
                }))"
                :label="t('admin.defaultCounselors')"
                variant="outlined"
                multiple
                chips
                closable-chips
              />
            </v-col>
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
                >
                  {{ counselors.find(c => c.id === counselorId)?.name || '-' }}
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
}
</style>


