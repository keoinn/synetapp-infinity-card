<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

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
      case 'withNumber':
        // 將編號格式化為四位數（例如：0001, 0002, 0003）
        const formattedNumber = i.toString().padStart(4, '0')
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
  { title: t('admin.workshop.accountCount'), key: 'accountCount' },
  { title: t('admin.workshop.createdAccounts'), key: 'createdAccounts' },
  { title: t('admin.workshop.expiryDate'), key: 'expiryDate' },
  { title: t('admin.workshop.status'), key: 'status' },
  { title: t('admin.createdAt'), key: 'createdAt' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const workshops = ref([])

// 範例數據（實際應該從 API 獲取）
onMounted(() => {
  // TODO: 從 API 獲取活動列表
  // 暫時使用空陣列
  workshops.value = []
})

const editedItem = ref({
  id: null,
  name: '',
  code: '',
  accountCount: 0,
  expiryDate: '',
  description: '',
  accountPrefix: 'weprodemo',
  passwordType: 'uniform', // 'uniform', 'withNumber', 'random'
  uniformPassword: '',
  observerAccounts: [] // 觀察者帳號列表
})

const dialog = ref(false)
const editMode = ref(false)
const viewDialog = ref(false)
const viewingItem = ref(null)
const accountsDialog = ref(false)
const viewingAccounts = ref([])

// 觀察者帳號相關
const observerSearch = ref('')
// TODO: 從 API 獲取可用使用者列表，目前使用範例數據
const availableUsers = ref([
  { title: 'user001', value: 'user001' },
  { title: 'user002', value: 'user002' },
  { title: 'admin', value: 'admin' },
  { title: 'observer001', value: 'observer001' }
])

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
  if (!workshop.expiryDate) return { text: t('admin.workshop.noExpiry'), color: 'grey' }
  const expiryDate = new Date(workshop.expiryDate)
  const now = new Date()
  if (expiryDate < now) {
    return { text: t('admin.workshop.expired'), color: 'error' }
  }
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
  if (daysRemaining <= 7) {
    return { text: t('admin.workshop.expiringSoon'), color: 'warning' }
  }
  return { text: t('admin.workshop.active'), color: 'success' }
}

const addWorkshop = () => {
  editedItem.value = {
    id: null,
    name: '',
    code: generateActivityCode(),
    accountCount: 0,
    expiryDate: '',
    description: '',
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

const deleteWorkshop = (item) => {
  const index = workshops.value.findIndex(w => w.id === item.id)
  if (index > -1) {
    workshops.value.splice(index, 1)
  }
}

const saveWorkshop = () => {
  // 驗證必填欄位
  if (!editedItem.value.name || !editedItem.value.code) {
    // TODO: 顯示錯誤訊息
    return
  }

  // 驗證帳號前綴
  if (!editedItem.value.accountPrefix) {
    // TODO: 顯示錯誤訊息
    return
  }

  // 驗證密碼設定
  if (editedItem.value.passwordType === 'uniform' || editedItem.value.passwordType === 'withNumber') {
    if (!editedItem.value.uniformPassword) {
      // TODO: 顯示錯誤訊息
      return
    }
  }

  if (editMode.value) {
    const index = workshops.value.findIndex(w => w.id === editedItem.value.id)
    if (index > -1) {
      workshops.value[index] = { ...editedItem.value }
    }
  } else {
    // 新增模式
    const newId = Math.max(...workshops.value.map(w => w.id || 0), 0) + 1
    const newWorkshop = {
      ...editedItem.value,
      id: newId,
      createdAccounts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      demoAccounts: [] // 儲存生成的帳號列表
    }
    
    // 建立活動後直接產生帳號
    if (newWorkshop.accountCount > 0) {
      newWorkshop.demoAccounts = generateDemoAccounts(newWorkshop)
      newWorkshop.createdAccounts = newWorkshop.demoAccounts.length
    }
    
    workshops.value.push(newWorkshop)
    // TODO: 調用 API 創建活動並生成演示帳號
  }
  dialog.value = false
}

const regenerateCode = () => {
  editedItem.value.code = generateActivityCode()
}

const viewWorkshop = (item) => {
  viewingItem.value = { ...item }
  viewDialog.value = true
}

const viewAccounts = async (item) => {
  viewingItem.value = item
  // 從本地數據或 API 獲取該活動的演示帳號列表
  if (item.demoAccounts && item.demoAccounts.length > 0) {
    viewingAccounts.value = item.demoAccounts
  } else {
    // TODO: 從 API 獲取該活動的演示帳號列表
    viewingAccounts.value = []
  }
  accountsDialog.value = true
}

const createDemoAccounts = async (workshop) => {
  if (!workshop.id) return
  
  // 生成演示帳號
  const accounts = generateDemoAccounts(workshop)
  workshop.demoAccounts = accounts
  workshop.createdAccounts = accounts.length
  
  // TODO: 調用 API 創建演示帳號
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

      <template #item.accountCount="{ item }">
        {{ item.accountCount || 0 }}
      </template>

      <template #item.createdAccounts="{ item }">
        <span :class="item.createdAccounts < item.accountCount ? 'text-warning' : ''">
          {{ item.createdAccounts || 0 }} / {{ item.accountCount || 0 }}
        </span>
      </template>

      <template #item.expiryDate="{ item }">
        {{ formatDate(item.expiryDate) }}
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
          :disabled="item.createdAccounts >= item.accountCount"
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
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteWorkshop(item)"
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
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                :label="t('admin.workshop.activityName')"
                variant="outlined"
                required
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
                required
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
                v-model.number="editedItem.accountCount"
                :label="t('admin.workshop.accountCount')"
                variant="outlined"
                type="number"
                min="0"
                required
                :rules="[
                  v => v !== null && v !== undefined && v >= 0 || t('admin.workshop.countRequired')
                ]"
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
                required
                :rules="[
                  v => !!v || t('admin.workshop.prefixRequired')
                ]"
                :hint="t('admin.workshop.prefixHint')"
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
              >
                <v-radio
                  :label="t('admin.workshop.passwordUniform')"
                  value="uniform"
                />
                <v-radio
                  :label="t('admin.workshop.passwordWithNumber')"
                  value="withNumber"
                />
                <v-radio
                  :label="t('admin.workshop.passwordRandom')"
                  value="random"
                />
              </v-radio-group>
            </v-col>
            <v-col
              v-if="editedItem.passwordType === 'uniform' || editedItem.passwordType === 'withNumber'"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editedItem.uniformPassword"
                :label="t('admin.workshop.uniformPassword')"
                variant="outlined"
                type="password"
                required
                :rules="[
                  v => !!v || t('admin.workshop.passwordRequired')
                ]"
                :hint="editedItem.passwordType === 'withNumber' ? t('admin.workshop.passwordWithNumberHint') : ''"
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
                required
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
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.description"
                :label="t('admin.description')"
                variant="outlined"
                rows="3"
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
          <v-data-table
            :headers="[
              { title: t('admin.workshop.accountUsername'), key: 'username' },
              { title: t('admin.workshop.accountPassword'), key: 'password' },
              { title: t('admin.workshop.accountExpiry'), key: 'expiryDate' },
              { title: t('admin.workshop.accountStatus'), key: 'status' }
            ]"
            :items="viewingAccounts"
            :loading="false"
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

