<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { handleAlert } from '@/plugins/utils/alert'
import { getCounselorListAPI, createCounselorAssignmentAPI, getCounselorAssignmentListAPI } from '@/plugins/utils/requests/api/backend'

const { t } = useI18n()
const appStore = useAppStore()

// 表格標題
const headers = ref([
  { title: '報告序號', key: 'report_sn' },
  { title: '報告名稱', key: 'report_name' },
  { title: '指派的諮商師', key: 'counselor' },
  { title: '建立時間', key: 'created_at' }
  // 操作欄位暫時隱藏，待編輯與刪除功能實現後再啟用
  // { title: '操作', key: 'actions', sortable: false }
])

// 資料列表
const assignments = ref([])
const loading = ref(false)

// 搜尋
const search = ref('')

// 對話視窗狀態
const dialog = ref(false)
const isEditMode = ref(false)
const editedItem = ref({
  id: null,
  report_id: '',
  counselor_ids: []
})

// 諮商師選項列表
const counselorOptions = ref([])
const loadingCounselors = ref(false)

// 載入諮商師列表
const loadCounselorOptions = async () => {
  loadingCounselors.value = true
  try {
    console.log('載入諮商師列表...')
    const response = await getCounselorListAPI()
    console.log('載入諮商師列表回應:', response)
    
    // 解析 API 回應
    let counselorList = []
    
    if (response?.data?.attributes?.counselor_list) {
      counselorList = response.data.attributes.counselor_list
    } else if (response?.attributes?.counselor_list) {
      counselorList = response.attributes.counselor_list
    } else if (response?.counselor_list) {
      counselorList = response.counselor_list
    } else if (Array.isArray(response)) {
      counselorList = response
    } else if (response?.data && Array.isArray(response.data)) {
      counselorList = response.data
    }
    
    if (Array.isArray(counselorList)) {
      counselorOptions.value = counselorList.map(counselor => ({
        id: counselor.id || counselor.user_id,
        title: `${counselor.counselor_code || ''} ${counselor.name || ''}`.trim(),
        name: counselor.name || '',
        code: counselor.counselor_code || ''
      }))
      console.log('載入完成，共', counselorOptions.value.length, '筆諮商師資料')
    } else {
      console.warn('API 回應格式不符合預期:', response)
      counselorOptions.value = []
    }
  } catch (error) {
    console.error('載入諮商師列表錯誤:', error)
    // 使用 mock data
    counselorOptions.value = [
      { id: '1', title: 'COU001 張三', name: '張三', code: 'COU001' },
      { id: '2', title: 'COU002 李四', name: '李四', code: 'COU002' },
      { id: '3', title: 'COU003 王五', name: '王五', code: 'COU003' }
    ]
  } finally {
    loadingCounselors.value = false
  }
}

// 載入指派列表
const loadAssignments = async () => {
  loading.value = true
  try {
    console.log('載入指派諮商師列表...')
    const response = await getCounselorAssignmentListAPI()
    console.log('載入指派諮商師列表回應:', response)
    
    // 解析 API 回應
    let accessList = []
    
    // 優先檢查 data.attributes.counselor_report_access_list（標準格式）
    if (response?.data?.attributes?.counselor_report_access_list) {
      accessList = response.data.attributes.counselor_report_access_list
    } 
    // 檢查 attributes.counselor_report_access_list（攔截器已解包的情況）
    else if (response?.attributes?.counselor_report_access_list) {
      accessList = response.attributes.counselor_report_access_list
    } 
    // 其他可能的格式
    else if (response?.counselor_report_access_list) {
      accessList = response.counselor_report_access_list
    } else if (Array.isArray(response)) {
      accessList = response
    }
    
    if (Array.isArray(accessList)) {
      // 將 API 回應映射到組件的數據結構
      assignments.value = accessList.map(access => ({
        id: String(access.id),
        report_id: String(access.report_id),
        report_sn: String(access.report_sn || ''),
        report_name: access.report_name || '',
        counselor_id: String(access.counselor_id),
        counselor: {
          id: String(access.counselor_id),
          name: access.counselor_name || '',
          code: access.counselor_code || ''
        },
        created_at: access.created_at || ''
      }))
      
      console.log('載入完成，共', assignments.value.length, '筆指派資料')
    } else {
      console.warn('API 回應格式不符合預期:', response)
      handleAlert({
        auction: 'error',
        text: '載入指派列表失敗，回應格式不符合預期'
      })
      assignments.value = []
    }
  } catch (error) {
    console.error('載入指派列表錯誤:', error)
    handleAlert({
      auction: 'error',
      text: '載入指派列表失敗'
    })
    assignments.value = []
  } finally {
    loading.value = false
  }
}

// 格式化諮商師顯示
const formatCounselor = (counselor) => {
  if (!counselor) {
    return '未指派'
  }
  return `${counselor.code || ''} ${counselor.name || ''}`.trim()
}

// 新增指派
const addAssignment = () => {
  isEditMode.value = false
  editedItem.value = {
    id: null,
    report_id: '',
    counselor_ids: []
  }
  dialog.value = true
}

// 編輯指派
const editAssignment = (item) => {
  isEditMode.value = true
  editedItem.value = {
    id: item.id,
    report_id: item.report_sn || item.report_id,
    counselor_ids: item.counselor_id ? [item.counselor_id] : []
  }
  dialog.value = true
}

// 刪除指派
const deleteAssignment = async (item) => {
  const counselorName = item.counselor ? `${item.counselor.code} ${item.counselor.name}` : '諮商師'
  const reportSn = item.report_sn || item.report_id
  if (!confirm(`確定要刪除報告 ${reportSn} 指派給 ${counselorName} 的記錄嗎？`)) {
    return
  }
  
  try {
    loading.value = true
    // TODO: 調用實際的 API
    // await deleteCounselorAssignmentAPI(item.id)
    
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 從列表中移除
    assignments.value = assignments.value.filter(a => a.id !== item.id)
    
    handleAlert({
      auction: 'success',
      text: '刪除成功'
    })
  } catch (error) {
    console.error('刪除指派錯誤:', error)
    handleAlert({
      auction: 'error',
      text: '刪除失敗'
    })
  } finally {
    loading.value = false
  }
}

// 儲存指派
const saveAssignment = async () => {
  // 驗證
  if (!editedItem.value.report_id || !editedItem.value.report_id.trim()) {
    handleAlert({
      auction: 'error',
      text: '請輸入報告序號'
    })
    return
  }
  
  if (!editedItem.value.counselor_ids || editedItem.value.counselor_ids.length === 0) {
    handleAlert({
      auction: 'error',
      text: '請至少選擇一位諮商師'
    })
    return
  }
  
  try {
    loading.value = true
    
    if (isEditMode.value) {
      // 編輯模式：只更新單一記錄
      const selectedCounselor = counselorOptions.value.find(
        c => String(c.id) === String(editedItem.value.counselor_ids[0])
      )
      
      if (!selectedCounselor) {
        handleAlert({
          auction: 'error',
          text: '找不到選擇的諮商師'
        })
        return
      }
      
      // TODO: 調用實際的更新 API
      // await updateCounselorAssignmentAPI(editedItem.value.id, {
      //   report_id: editedItem.value.report_id,
      //   counselor_id: editedItem.value.counselor_ids[0]
      // })
      
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 更新本地資料
      const index = assignments.value.findIndex(a => a.id === editedItem.value.id)
      if (index !== -1) {
        assignments.value[index] = {
          ...assignments.value[index],
          report_id: editedItem.value.report_id,
          counselor_id: editedItem.value.counselor_ids[0],
          counselor: {
            id: selectedCounselor.id,
            name: selectedCounselor.name,
            code: selectedCounselor.code
          }
        }
      }
      
      handleAlert({
        auction: 'success',
        text: '更新成功'
      })
    } else {
      // 新增模式：為每個選擇的諮商師建立一筆記錄
      const selectedCounselors = counselorOptions.value.filter(
        c => editedItem.value.counselor_ids.includes(String(c.id))
      )
      
      if (selectedCounselors.length === 0) {
        handleAlert({
          auction: 'error',
          text: '找不到選擇的諮商師'
        })
        return
      }
      
      // 準備 counselor_ids 陣列（轉換為字串陣列）
      const counselorIds = editedItem.value.counselor_ids.map(id => String(id))
      
      // 調用實際的新增 API
      const response = await createCounselorAssignmentAPI(
        editedItem.value.report_id,
        counselorIds
      )
      
      console.log('新增指派諮商師 API 回應:', response)
      
      // 解析 API 回應以獲取新增的記錄數量
      let accessList = []
      
      if (response?.data?.attributes?.counselor_report_access_list) {
        accessList = response.data.attributes.counselor_report_access_list
      } else if (response?.attributes?.counselor_report_access_list) {
        accessList = response.attributes.counselor_report_access_list
      } else if (response?.counselor_report_access_list) {
        accessList = response.counselor_report_access_list
      } else if (Array.isArray(response)) {
        accessList = response
      }
      
      // 檢查是否有 counselor_report_access_list 來判斷是否成功
      // 或者檢查 meta 欄位（如果存在）
      const responseCode = response?.meta?.code || response?.data?.meta?.code
      const responseStatus = response?.meta?.status || response?.data?.meta?.status
      const hasAccessList = Array.isArray(accessList) && accessList.length > 0
      const hasMetaSuccess = responseCode === '2005' || responseStatus === '200' || responseStatus === '201'
      
      // 如果有 counselor_report_access_list 或 meta 顯示成功，則認為成功
      if (hasAccessList || hasMetaSuccess) {
        const newCount = Array.isArray(accessList) ? accessList.length : counselorIds.length
        
        handleAlert({
          auction: 'success',
          text: `成功新增 ${newCount} 筆指派記錄`
        })
        
        // 重新從後端查詢列表
        await loadAssignments()
      } else {
        // 檢查是否有錯誤訊息
        const errorDetail = response?.meta?.detail || response?.data?.meta?.detail
        if (errorDetail) {
          throw new Error(errorDetail)
        } else {
          throw new Error('新增失敗，API 回應格式不符合預期')
        }
      }
    }
    
    dialog.value = false
  } catch (error) {
    console.error('儲存指派錯誤:', error)
    handleAlert({
      auction: 'error',
      text: isEditMode.value ? '更新失敗' : '新增失敗'
    })
  } finally {
    loading.value = false
  }
}

// 關閉對話視窗
const closeDialog = () => {
  dialog.value = false
  editedItem.value = {
    id: null,
    report_id: '',
    counselor_ids: []
  }
}

// 過濾後的資料
const filteredAssignments = computed(() => {
  if (!search.value) {
    return assignments.value
  }
  
  const searchLower = search.value.toLowerCase()
  return assignments.value.filter(item => {
    return (
      item.report_sn?.toLowerCase().includes(searchLower) ||
      item.report_name?.toLowerCase().includes(searchLower) ||
      formatCounselor(item.counselor).toLowerCase().includes(searchLower)
    )
  })
})

onMounted(() => {
  loadCounselorOptions()
  loadAssignments()
})
</script>

<template>
  <div class="counselor-assignment">
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          label="搜尋報告序號、報告名稱或諮商師"
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
          @click="addAssignment"
        >
          新增指派
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredAssignments"
      :loading="loading"
      class="elevation-1"
    >
      <template #item.report_sn="{ item }">
        <strong>{{ item.report_sn || item.report_id }}</strong>
      </template>

      <template #item.report_name="{ item }">
        {{ item.report_name || '-' }}
      </template>

      <template #item.counselor="{ item }">
        <v-chip
          v-if="item.counselor"
          size="small"
          color="primary"
          variant="outlined"
        >
          {{ item.counselor.code }} {{ item.counselor.name }}
        </v-chip>
        <span
          v-else
          class="text-grey"
        >
          未指派
        </span>
      </template>

      <template #item.created_at="{ item }">
        {{ item.created_at || '-' }}
      </template>

      <!-- 操作欄位暫時隱藏，待編輯與刪除功能實現後再啟用 -->
      <!--
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          color="primary"
          @click="editAssignment(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteAssignment(item)"
        />
      </template>
      -->
    </v-data-table>

    <!-- 新增/編輯對話視窗 -->
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ isEditMode ? '編輯指派' : '新增指派' }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pt-4">
          <v-text-field
            v-model="editedItem.report_id"
            label="報告序號 *"
            variant="outlined"
            :disabled="loading"
            required
            class="mb-4"
          />
          
          <v-autocomplete
            v-model="editedItem.counselor_ids"
            :items="counselorOptions"
            item-title="title"
            item-value="id"
            label="選擇諮商師 *"
            variant="outlined"
            multiple
            chips
            closable-chips
            :loading="loadingCounselors"
            :disabled="loading || isEditMode"
            required
            hint="可選擇多位諮商師，將為每位諮商師建立一筆指派記錄"
            persistent-hint
          >
            <template #chip="{ props, item }">
              <v-chip
                v-bind="props"
                color="primary"
              >
                {{ item.raw.code }} {{ item.raw.name }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="loading"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :loading="loading"
            @click="saveAssignment"
          >
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.counselor-assignment {
  .gap-1 {
    gap: 4px;
  }
}
</style>
