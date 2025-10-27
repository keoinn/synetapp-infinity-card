<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const search = ref('')
const headers = ref([
  { title: t('admin.counselorName'), key: 'name' },
  { title: t('admin.licenseNumber'), key: 'licenseNumber' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.phone'), key: 'phone' },
  { title: t('admin.specialty'), key: 'specialty' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const counselors = ref([
  {
    id: 1,
    name: '王心理師',
    licenseNumber: 'CP0001',
    email: 'counselor1@example.com',
    phone: '0912-345-678',
    specialty: '青少年諮商、生涯規劃',
    status: t('admin.active'),
    statusColor: 'success',
    organization: '台北市諮商中心',
    licenseType: '心理師',
    licenseExpiry: '2025-12-31',
    experience: '5年',
    education: '國立台灣大學心理學系碩士'
  },
  {
    id: 2,
    name: '李諮商師',
    licenseNumber: 'CP0002',
    email: 'counselor2@example.com',
    phone: '0923-456-789',
    specialty: '情緒管理、壓力調適',
    status: t('admin.active'),
    statusColor: 'success',
    organization: '新北市諮商中心',
    licenseType: '諮商心理師',
    licenseExpiry: '2026-06-30',
    experience: '8年',
    education: '國立師範大學心理諮商系碩士'
  },
  {
    id: 3,
    name: '張心理師',
    licenseNumber: 'CP0003',
    email: 'counselor3@example.com',
    phone: '0934-567-890',
    specialty: '家庭諮商、親職教育',
    status: t('admin.inactive'),
    statusColor: 'warning',
    organization: '台中市諮商中心',
    licenseType: '臨床心理師',
    licenseExpiry: '2024-12-31',
    experience: '10年',
    education: '國立中正大學心理學系博士'
  }
])

const editedItem = ref({
  id: null,
  name: '',
  licenseNumber: '',
  email: '',
  phone: '',
  specialty: '',
  status: t('admin.active'),
  statusColor: 'success',
  organization: '',
  licenseType: '',
  licenseExpiry: '',
  experience: '',
  education: ''
})
const dialog = ref(false)
const editMode = ref(false)
const detailDialog = ref(false)
const viewingItem = ref(null)

const addCounselor = () => {
  editMode.value = false
  editedItem.value = {
    id: null,
    name: '',
    licenseNumber: '',
    email: '',
    phone: '',
    specialty: '',
    status: t('admin.active'),
    statusColor: 'success',
    organization: '',
    licenseType: '',
    licenseExpiry: '',
    experience: '',
    education: ''
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

const saveCounselor = () => {
  if (editMode.value) {
    const index = counselors.value.findIndex(c => c.id === editedItem.value.id)
    if (index > -1) {
      counselors.value[index] = { ...editedItem.value }
    }
  } else {
    const newId = Math.max(...counselors.value.map(c => c.id), 0) + 1
    counselors.value.push({
      ...editedItem.value,
      id: newId
    })
  }
  dialog.value = false
}

const filteredCounselors = computed(() => {
  if (!search.value) {
    return counselors.value
  }
  const searchLower = search.value.toLowerCase()
  return counselors.value.filter(counselor =>
    counselor.name.toLowerCase().includes(searchLower) ||
    counselor.licenseNumber.toLowerCase().includes(searchLower) ||
    counselor.email.toLowerCase().includes(searchLower) ||
    counselor.specialty.toLowerCase().includes(searchLower)
  )
})

const stats = computed(() => [
  {
    title: t('admin.totalCounselors'),
    value: counselors.value.length,
    icon: 'mdi-account-tie',
    color: 'primary'
  },
  {
    title: t('admin.activeCounselors'),
    value: counselors.value.filter(c => c.status === t('admin.active')).length,
    icon: 'mdi-check-circle',
    color: 'success'
  },
  {
    title: t('admin.licensedCounselors'),
    value: counselors.value.length,
    icon: 'mdi-certificate',
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

      <template #item.specialty="{ item }">
        <div class="text-caption">
          {{ item.specialty }}
        </div>
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
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteCounselor(item)"
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
            <v-col cols="12">
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
                v-model="editedItem.licenseNumber"
                :label="t('admin.licenseNumber')"
                variant="outlined"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="editedItem.licenseType"
                :items="licenseTypeOptions"
                :label="t('admin.licenseType')"
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
                type="email"
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
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.specialty"
                :label="t('admin.specialty')"
                variant="outlined"
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.organization"
                :label="t('admin.organization')"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.licenseExpiry"
                :label="t('admin.licenseExpiry')"
                type="date"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.experience"
                :label="t('admin.experience')"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.education"
                :label="t('admin.education')"
                variant="outlined"
                rows="2"
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

