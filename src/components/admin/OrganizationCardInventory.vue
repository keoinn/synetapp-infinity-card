<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CardCaseInventory from '@/components/inventory/CardCaseInventory.vue'

const { t } = useI18n()

// 機構列表
const selectedOrg = ref(null)
const organizations = ref([
  {
    id: 1,
    name: '台北市政府教育局',
    code: 'ORG001',
    inventory: {
      goal: 10,
      care: 8,
      ce: 5,
      cj: 6,
      lj: 4,
      le: 7
    }
  },
  {
    id: 2,
    name: '新北市教育局',
    code: 'ORG002',
    inventory: {
      goal: 15,
      care: 12,
      ce: 9,
      cj: 8,
      lj: 10,
      le: 11
    }
  },
  {
    id: 3,
    name: '台中市政府教育局',
    code: 'ORG003',
    inventory: {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
  }
])

// 當前選擇的機構庫存
const currentInventory = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})

const dialog = ref(false)
const editingCardSet = ref(null)
const editQuantity = ref(0)

// 卡組類型列表
const cardSets = [
  { key: 'goal', name: '我就是', icon: 'mdi-target' },
  { key: 'care', name: '我在乎', icon: 'mdi-heart' },
  { key: 'ce', name: '我可以 (國小)', icon: 'mdi-school' },
  { key: 'cj', name: '我可以 (社青)', icon: 'mdi-account-group' },
  { key: 'le', name: '我喜歡 (國小)', icon: 'mdi-star' },
  { key: 'lj', name: '我喜歡 (社青)', icon: 'mdi-star-circle' }
]

// 選擇機構時更新庫存
const selectOrganization = (org) => {
  selectedOrg.value = org
  currentInventory.value = { ...org.inventory }
}

// 編輯庫存
const editInventory = (cardSet) => {
  editingCardSet.value = cardSet
  editQuantity.value = currentInventory.value[cardSet.key]
  dialog.value = true
}

// 儲存庫存變更
const saveInventory = () => {
  if (selectedOrg.value && editingCardSet.value) {
    currentInventory.value[editingCardSet.value.key] = editQuantity.value
    
    // 更新機構列表中的庫存
    const orgIndex = organizations.value.findIndex(org => org.id === selectedOrg.value.id)
    if (orgIndex !== -1) {
      organizations.value[orgIndex].inventory[editingCardSet.value.key] = editQuantity.value
    }
    
    dialog.value = false
  }
}

// 批次更新庫存
const batchUpdate = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})
const batchDialog = ref(false)

const openBatchUpdate = () => {
  if (!selectedOrg.value) return
  batchUpdate.value = { ...currentInventory.value }
  batchDialog.value = true
}

const saveBatchUpdate = () => {
  if (selectedOrg.value) {
    currentInventory.value = { ...batchUpdate.value }
    
    // 更新機構列表中的庫存
    const orgIndex = organizations.value.findIndex(org => org.id === selectedOrg.value.id)
    if (orgIndex !== -1) {
      organizations.value[orgIndex].inventory = { ...batchUpdate.value }
    }
    
    batchDialog.value = false
  }
}

// 計算統計
const stats = computed(() => {
  const orgId = selectedOrg.value?.id
  if (!orgId) return { total: 0, bySet: {} }
  
  const inv = selectedOrg.value.inventory
  const total = Object.values(inv).reduce((sum, val) => sum + val, 0)
  const bySet = Object.entries(inv).reduce((acc, [key, val]) => {
    acc[key] = val
    return acc
  }, {})
  
  return { total, bySet }
})

onMounted(() => {
  // 預設選擇第一個機構
  if (organizations.value.length > 0) {
    selectOrganization(organizations.value[0])
  }
})
</script>

<template>
  <div class="org-card-inventory">
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
            color="secondary"
            variant="tonal"
          >
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption mb-1">
                    {{ t('admin.selectedOrg') }}
                  </div>
                  <div class="text-h6">
                    {{ selectedOrg.name }}
                  </div>
                </div>
                <v-icon
                  size="48"
                  icon="mdi-office-building"
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
                    {{ t('admin.orgCode') }}
                  </div>
                  <div class="text-h6">
                    {{ selectedOrg.code }}
                  </div>
                </div>
                <v-icon
                  size="48"
                  icon="mdi-barcode"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 批次更新按鈕 -->
      <div class="mb-4 text-right">
        <v-btn
          color="secondary"
          prepend-icon="mdi-sync"
          @click="openBatchUpdate"
        >
          {{ t('admin.batchUpdate') }}
        </v-btn>
      </div>

      <!-- 卡組庫存列表 -->
      <v-row>
        <v-col
          v-for="cardSet in cardSets"
          :key="cardSet.key"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            variant="elevated"
            hover
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
        </v-col>
      </v-row>

      <!-- 編輯對話框 -->
      <v-dialog
        v-model="dialog"
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            {{ t('admin.editCardSetInventory') }}
          </v-card-title>
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

      <!-- 批次更新對話框 -->
      <v-dialog
        v-model="batchDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            {{ t('admin.batchUpdateInventory') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col
                v-for="cardSet in cardSets"
                :key="cardSet.key"
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="batchUpdate[cardSet.key]"
                  :label="`${cardSet.name}`"
                  type="number"
                  min="0"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              @click="batchDialog = false"
            >
              {{ t('common.cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="saveBatchUpdate"
            >
              {{ t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- 未選擇機構的提示 -->
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
.org-card-inventory {
  padding: 8px 0;

  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }
}
</style>


