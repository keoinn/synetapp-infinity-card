<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { handleAlert } from '@/plugins/utils/alert'
import { getOrgCardInventoryAdminAPI, updateOrgCardInventoryAdminAPI } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()
const appStore = useAppStore()

// 檢查是否為機構角色
const isOrganizationRole = computed(() => {
  return appStore.selectedRole === 'organization' || appStore.selectedRole === 'org'
})

// 檢查是否只有 1 個組織
const hasSingleOrg = computed(() => {
  return organizations.value.length === 1
})

// 檢查當前選擇的組織是否有管理員權限
const hasAdminPermission = computed(() => {
  if (!isOrganizationRole.value || !selectedOrg.value) {
    return true // 非機構角色或未選擇組織時，預設有權限
  }
  
  // 從 appStore.myOrg 中查找對應的組織
  const org = appStore.myOrg.find(o => o.org_id === selectedOrg.value.id)
  return org ? org.is_admin === '1' : false
})

// 機構列表
const selectedOrg = ref(null)
const organizations = ref([])
const orgLoading = ref(false)
const inventoryLoading = ref(false)

// 當前選擇的機構庫存
const currentInventory = ref({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})

// 將後端庫存資料映射到前端格式
const mapInventoryData = (backendInventory) => {
  return {
    id: backendInventory.org_id || backendInventory.id,
    name: backendInventory.org_name || '',
    code: backendInventory.org_code || '',
    inventory: {
      goal: parseInt(backendInventory.goal || '0', 10),
      care: parseInt(backendInventory.care || '0', 10),
      ce: parseInt(backendInventory.ce || '0', 10),
      cj: parseInt(backendInventory.cj || '0', 10),
      lj: parseInt(backendInventory.lj || '0', 10),
      le: parseInt(backendInventory.le || '0', 10)
    }
  }
}

// 載入所有機構列表
const loadOrganizations = async () => {
  orgLoading.value = true
  try {
    // 如果是機構角色，從 appStore.myOrg 讀取
    if (isOrganizationRole.value) {
      console.log('機構角色：從 appStore.myOrg 讀取組織列表')
      console.log('appStore.myOrg:', appStore.myOrg)
      
      if (Array.isArray(appStore.myOrg) && appStore.myOrg.length > 0) {
        // 將 myOrg 轉換為組織格式，並載入每個組織的庫存
        const orgPromises = appStore.myOrg.map(async (org) => {
          try {
            // 載入該組織的庫存資訊
            const response = await getOrgCardInventoryAdminAPI(org.org_id)
            console.log(`載入組織 ${org.org_id} 庫存回應:`, response)
            
            let inventoryList = []
            if (response?.data?.attributes?.org_card_inventory_detail) {
              inventoryList = response.data.attributes.org_card_inventory_detail
            } else if (response?.attributes?.org_card_inventory_detail) {
              inventoryList = response.attributes.org_card_inventory_detail
            } else if (response?.org_card_inventory_detail) {
              inventoryList = response.org_card_inventory_detail
            } else if (Array.isArray(response)) {
              inventoryList = response
            }
            
            if (Array.isArray(inventoryList) && inventoryList.length > 0) {
              return mapInventoryData(inventoryList[0])
            } else {
              // 如果沒有庫存資料，返回基本資訊
              return {
                id: org.org_id,
                name: org.org_name,
                code: org.org_code,
                inventory: {
                  goal: 0,
                  care: 0,
                  ce: 0,
                  cj: 0,
                  lj: 0,
                  le: 0
                }
              }
            }
          } catch (error) {
            console.error(`載入組織 ${org.org_id} 庫存錯誤:`, error)
            // 返回基本資訊
            return {
              id: org.org_id,
              name: org.org_name,
              code: org.org_code,
              inventory: {
                goal: 0,
                care: 0,
                ce: 0,
                cj: 0,
                lj: 0,
                le: 0
              }
            }
          }
        })
        
        organizations.value = await Promise.all(orgPromises)
        console.log('載入完成，共', organizations.value.length, '筆機構資料')
        
        // 如果有機構且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.log('appStore.myOrg 為空或不是陣列')
        organizations.value = []
      }
    } else {
      // 管理員角色：從 API 讀取所有機構
      console.log('載入所有機構列表...')
      const response = await getOrgCardInventoryAdminAPI('all')
      console.log('載入機構列表回應:', response)
      
      // 解析 API 回應
      // API 回應格式：{ data: { attributes: { org_card_inventory_detail: [...] } } }
      // 攔截器解包後：{ attributes: { org_card_inventory_detail: [...] } }
      let inventoryList = []
      
      if (response?.data?.attributes?.org_card_inventory_detail) {
        inventoryList = response.data.attributes.org_card_inventory_detail
      } else if (response?.attributes?.org_card_inventory_detail) {
        inventoryList = response.attributes.org_card_inventory_detail
      } else if (response?.org_card_inventory_detail) {
        inventoryList = response.org_card_inventory_detail
      } else if (Array.isArray(response)) {
        inventoryList = response
      }
      
      if (Array.isArray(inventoryList) && inventoryList.length > 0) {
        organizations.value = inventoryList.map(mapInventoryData)
        console.log('載入完成，共', organizations.value.length, '筆機構資料')
        
        // 如果有機構且未選擇，自動選擇第一個
        if (organizations.value.length > 0 && !selectedOrg.value) {
          await selectOrganization(organizations.value[0])
        }
      } else {
        console.warn('API 回應格式不符合預期:', response)
        handleAlert({
          auction: 'error',
          text: t('admin.loadOrganizationsError') || '載入機構資料失敗'
        })
        organizations.value = []
      }
    }
  } catch (error) {
    console.error('載入機構列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadOrganizationsError') || '載入機構資料失敗'
    })
    organizations.value = []
  } finally {
    orgLoading.value = false
  }
}

// 載入指定機構的庫存
const loadOrgInventory = async (orgId) => {
  if (!orgId) {
    currentInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
    return
  }

  inventoryLoading.value = true
  try {
    console.log('載入機構庫存...', orgId)
    const response = await getOrgCardInventoryAdminAPI(orgId)
    console.log('載入機構庫存回應:', response)
    
    // 解析 API 回應
    let inventoryList = []
    
    if (response?.data?.attributes?.org_card_inventory_detail) {
      inventoryList = response.data.attributes.org_card_inventory_detail
    } else if (response?.attributes?.org_card_inventory_detail) {
      inventoryList = response.attributes.org_card_inventory_detail
    } else if (response?.org_card_inventory_detail) {
      inventoryList = response.org_card_inventory_detail
    } else if (Array.isArray(response)) {
      inventoryList = response
    }
    
    if (Array.isArray(inventoryList) && inventoryList.length > 0) {
      const inventoryData = mapInventoryData(inventoryList[0])
      currentInventory.value = { ...inventoryData.inventory }
      
      // 更新機構列表中的庫存資料
      const orgIndex = organizations.value.findIndex(org => org.id === inventoryData.id)
      if (orgIndex !== -1) {
        organizations.value[orgIndex].inventory = { ...currentInventory.value }
        // 如果當前選擇的機構是這個，也要更新
        if (selectedOrg.value?.id === inventoryData.id) {
          selectedOrg.value.inventory = { ...currentInventory.value }
        }
      }
      
      console.log('載入完成，機構庫存:', currentInventory.value)
    } else {
      console.warn('API 回應格式不符合預期:', response)
      // 如果沒有資料，設為全 0
      currentInventory.value = {
        goal: 0,
        care: 0,
        ce: 0,
        cj: 0,
        lj: 0,
        le: 0
      }
    }
  } catch (error) {
    console.error('載入機構庫存錯誤:', error)
    handleAlert({
      auction: 'error',
      text: t('admin.loadInventoryError') || '載入機構庫存失敗'
    })
    currentInventory.value = {
      goal: 0,
      care: 0,
      ce: 0,
      cj: 0,
      lj: 0,
      le: 0
    }
  } finally {
    inventoryLoading.value = false
  }
}

const dialog = ref(false)
const editingCardSet = ref(null)
const editQuantity = ref(0)
const saving = ref(false)

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
const selectOrganization = async (org) => {
  selectedOrg.value = org
  // 載入該機構的最新庫存
  await loadOrgInventory(org.id)
}

// 編輯庫存
const editInventory = (cardSet) => {
  editingCardSet.value = cardSet
  editQuantity.value = currentInventory.value[cardSet.key]
  dialog.value = true
}

// 儲存庫存變更
const saveInventory = async () => {
  if (!selectedOrg.value || !editingCardSet.value) {
    return
  }

  saving.value = true
  try {
    // 準備 API 參數（單一更新）
    const updateData = {
      key: editingCardSet.value.key,
      [editingCardSet.value.key]: editQuantity.value
    }

    console.log('更新庫存資料:', updateData)
    const response = await updateOrgCardInventoryAdminAPI(selectedOrg.value.id, updateData)
    console.log('更新庫存回應:', response)

    // 解析 API 回應
    const inventoryDetail = response?.data?.attributes?.org_card_inventory_detail || 
                           response?.attributes?.org_card_inventory_detail ||
                           response?.org_card_inventory_detail

    if (inventoryDetail) {
      // 更新本地狀態
    currentInventory.value[editingCardSet.value.key] = editQuantity.value
    
    // 更新機構列表中的庫存
    const orgIndex = organizations.value.findIndex(org => org.id === selectedOrg.value.id)
    if (orgIndex !== -1) {
      organizations.value[orgIndex].inventory[editingCardSet.value.key] = editQuantity.value
    }
      
      // 更新 selectedOrg 的庫存
      if (selectedOrg.value) {
        selectedOrg.value.inventory = { ...currentInventory.value }
      }

      handleAlert({
        auction: 'success',
        text: t('admin.updateInventorySuccess') || '庫存更新成功'
      })
    
    dialog.value = false
    } else {
      throw new Error('API 回應格式不符合預期')
    }
  } catch (error) {
    console.error('更新庫存錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.updateInventoryError') || 
                        '更新庫存失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  } finally {
    saving.value = false
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

const saveBatchUpdate = async () => {
  if (!selectedOrg.value) {
    return
  }

  saving.value = true
  try {
    // 準備 API 參數（批次更新）
    const updateData = {
      goal: batchUpdate.value.goal,
      care: batchUpdate.value.care,
      ce: batchUpdate.value.ce,
      cj: batchUpdate.value.cj,
      lj: batchUpdate.value.lj,
      le: batchUpdate.value.le
    }

    console.log('批次更新庫存資料:', updateData)
    const response = await updateOrgCardInventoryAdminAPI(selectedOrg.value.id, updateData)
    console.log('批次更新庫存回應:', response)

    // 解析 API 回應
    const inventoryDetail = response?.data?.attributes?.org_card_inventory_detail || 
                           response?.attributes?.org_card_inventory_detail ||
                           response?.org_card_inventory_detail

    if (inventoryDetail) {
      // 更新本地狀態
    currentInventory.value = { ...batchUpdate.value }
    
    // 更新機構列表中的庫存
    const orgIndex = organizations.value.findIndex(org => org.id === selectedOrg.value.id)
    if (orgIndex !== -1) {
      organizations.value[orgIndex].inventory = { ...batchUpdate.value }
    }
      
      // 更新 selectedOrg 的庫存
      if (selectedOrg.value) {
        selectedOrg.value.inventory = { ...currentInventory.value }
      }

      handleAlert({
        auction: 'success',
        text: t('admin.updateInventorySuccess') || '庫存更新成功'
      })
    
    batchDialog.value = false
    } else {
      throw new Error('API 回應格式不符合預期')
    }
  } catch (error) {
    console.error('批次更新庫存錯誤:', error)
    const errorMessage = error?.response?.data?.meta?.detail || 
                        error?.response?.data?.message || 
                        error?.message || 
                        t('admin.updateInventoryError') || 
                        '更新庫存失敗'
    handleAlert({
      auction: 'error',
      text: errorMessage
    })
  } finally {
    saving.value = false
  }
}

// 計算統計
const stats = computed(() => {
  if (!selectedOrg.value) return { total: 0, bySet: {} }
  
  // 使用 currentInventory 來計算統計
  const inv = currentInventory.value
  const total = Object.values(inv).reduce((sum, val) => sum + val, 0)
  const bySet = Object.entries(inv).reduce((acc, [key, val]) => {
    acc[key] = val
    return acc
  }, {})
  
  return { total, bySet }
})

// 初始化載入
onMounted(async () => {
  await loadOrganizations()
})
</script>

<template>
  <div class="org-card-inventory">
    <!-- 機構選擇 -->
    <v-card class="mb-4">
      <v-card-title>{{ t('admin.selectOrganization') }}</v-card-title>
      <v-card-text>
        <v-select
          :model-value="selectedOrg?.id"
          :items="organizations.map(org => ({ title: `${org.name} (${org.code})`, value: org.id }))"
          :loading="orgLoading"
          :readonly="hasSingleOrg"
          :disabled="hasSingleOrg"
          :class="hasSingleOrg ? 'readonly-field' : ''"
          variant="outlined"
          @update:model-value="(id) => selectOrganization(organizations.find(o => o.id === id))"
        />
      </v-card-text>
    </v-card>

    <template v-if="selectedOrg">
      <!-- 權限提示 -->
      <v-card
        v-if="!hasAdminPermission"
        class="mb-4"
        color="warning"
        variant="tonal"
      >
        <v-card-text class="text-center py-8">
          <v-icon
            size="64"
            icon="mdi-alert-circle"
            class="mb-4"
          />
          <div class="text-h6">
            當前帳號沒有該功能的權限，請聯絡組織管理員
          </div>
        </v-card-text>
      </v-card>

      <!-- 統計資訊 -->
      <v-row
        v-if="hasAdminPermission"
        class="mb-4"
      >
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
      <div
        v-if="hasAdminPermission"
        class="mb-4 text-right"
      >
        <v-btn
          color="secondary"
          prepend-icon="mdi-sync"
          @click="openBatchUpdate"
        >
          {{ t('admin.batchUpdate') }}
        </v-btn>
      </div>

      <!-- 卡組庫存列表 -->
      <v-row
        v-if="hasAdminPermission && !inventoryLoading"
      >
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
      
      <!-- 載入中提示 -->
      <v-card
        v-if="hasAdminPermission && inventoryLoading"
      >
        <v-card-text class="text-center py-10">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="text-h6 mt-4">
            {{ t('admin.loadingOrgInventory') }}
          </div>
        </v-card-text>
      </v-card>

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
              :loading="saving"
              :disabled="saving"
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
              :loading="saving"
              :disabled="saving"
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

  // 唯讀欄位樣式
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
    }
  }
}
</style>


