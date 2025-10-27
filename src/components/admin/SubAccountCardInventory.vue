<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CardCaseInventory from '@/components/inventory/CardCaseInventory.vue'

const { t } = useI18n()

// 機構選擇
const selectedOrg = ref(null)
const organizations = ref([
  {
    id: 1,
    name: '台北市政府教育局',
    code: 'ORG001'
  },
  {
    id: 2,
    name: '新北市教育局',
    code: 'ORG002'
  },
  {
    id: 3,
    name: '台中市政府教育局',
    code: 'ORG003'
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
    role: 'teacher'
  },
  {
    id: 2,
    orgId: 1,
    name: '李老師',
    email: 'teacher2@org.edu.taipei',
    username: 'teacher002',
    role: 'teacher'
  },
  {
    id: 3,
    orgId: 2,
    name: '陳老師',
    email: 'teacher1@org.edu.newtaipei',
    username: 'teacher003',
    role: 'teacher'
  }
])

// 當前選擇的子帳號
const selectedSubAccount = ref(null)

// 子帳號卡片庫存
const subAccountInventory = ref({
  1: { goal: 5, care: 3, ce: 2, cj: 4, lj: 1, le: 2 }, // 張老師
  2: { goal: 8, care: 5, ce: 3, cj: 2, lj: 3, le: 4 }, // 李老師
  3: { goal: 6, care: 4, ce: 2, cj: 3, lj: 2, le: 1 }  // 陳老師
})

// 當前選擇帳號的庫存
const currentInventory = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})

// 報告相關
const droppedItems = ref([])
const reportName = ref('')

// 選擇機構
const selectOrganization = (org) => {
  selectedOrg.value = org
  selectedSubAccount.value = null
}

// 當前機構的子帳號列表
const currentOrgSubAccounts = computed(() => {
  if (!selectedOrg.value) return []
  return subAccounts.value.filter(account => account.orgId === selectedOrg.value.id)
})

// 選擇子帳號
const selectSubAccount = (account) => {
  selectedSubAccount.value = account
  currentInventory.value = { ...subAccountInventory.value[account.id] }
}

// 編輯庫存
const dialog = ref(false)
const editingCardSet = ref(null)
const editQuantity = ref(0)

const editInventory = (cardSet) => {
  editingCardSet.value = cardSet
  editQuantity.value = currentInventory.value[cardSet.key]
  dialog.value = true
}

const saveInventory = () => {
  if (selectedSubAccount.value && editingCardSet.value) {
    currentInventory.value[editingCardSet.value.key] = editQuantity.value
    
    // 更新庫存資料
    subAccountInventory.value[selectedSubAccount.value.id][editingCardSet.value.key] = editQuantity.value
    
    dialog.value = false
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

// 創建報告
const createReportDialog = ref(false)

const openCreateReport = () => {
  if (droppedItems.value.length === 0) {
    alert('請至少選擇一個牌組')
    return
  }
  createReportDialog.value = true
}

const handleCreateReport = () => {
  if (!reportName.value.trim()) {
    alert('請輸入報告名稱')
    return
  }
  if (droppedItems.value.length === 0) {
    alert('請至少選擇一個牌組')
    return
  }
  
  // 創建報告邏輯
  console.log('創建報告:', {
    name: reportName.value,
    subAccount: selectedSubAccount.value,
    cardSets: droppedItems.value
  })
  
  // 重置
  reportName.value = ''
  droppedItems.value = []
  createReportDialog.value = false
  
  alert('報告已創建！')
}

// 統計
const stats = computed(() => {
  if (!selectedSubAccount.value) return { total: 0 }
  const inv = currentInventory.value
  const total = Object.values(inv).reduce((sum, val) => sum + val, 0)
  return { total }
})

onMounted(() => {
  if (organizations.value.length > 0) {
    selectOrganization(organizations.value[0])
  }
})
</script>

<template>
  <div class="sub-account-card-inventory">
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
      <!-- 附屬帳號選擇 -->
      <v-card class="mb-4">
        <v-card-title>{{ t('admin.selectSubAccount') }}</v-card-title>
        <v-card-text>
          <v-select
            :model-value="selectedSubAccount?.name"
            :items="currentOrgSubAccounts.map(acc => ({ title: `${acc.name} (${acc.email})`, value: acc.id }))"
            variant="outlined"
            @update:model-value="(id) => selectSubAccount(currentOrgSubAccounts.find(a => a.id === id))"
          />
        </v-card-text>
      </v-card>

      <template v-if="selectedSubAccount">
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
                      {{ t('admin.selectedCardSets') }}
                    </div>
                    <div class="text-h4 font-weight-bold">
                      {{ droppedItems.length }}
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
              @dragstart="handleDragStart($event, cardSet.key)"
            >
              <v-card
                variant="elevated"
                hover
                :disabled="currentInventory[cardSet.key] === 0"
              >
                <v-card-text>
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-icon
                        :icon="cardSet.icon"
                        size="32"
                        class="mr-2"
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
              @click="openCreateReport"
            >
              {{ t('admin.createReport') }}
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
              <v-text-field
                v-model.number="editQuantity"
                :label="t('admin.quantity')"
                type="number"
                min="0"
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
                @click="saveInventory"
              >
                {{ t('common.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 創建報告對話框 -->
        <v-dialog
          v-model="createReportDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>{{ t('admin.createReport') }}</v-card-title>
            <v-divider />
            <v-card-text>
              <v-text-field
                v-model="reportName"
                :label="t('admin.reportName')"
                variant="outlined"
                required
              />
              <v-divider class="my-4" />
              <div class="text-subtitle-2 mb-2">
                {{ t('admin.selectedCardSets') }}:
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
                @click="createReportDialog = false"
              >
                {{ t('common.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                variant="text"
                @click="handleCreateReport"
              >
                {{ t('admin.createReport') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- 未選擇子帳號提示 -->
      <v-card v-else>
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
}
</style>


