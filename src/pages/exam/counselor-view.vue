<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ExamPanel from '@/components/exam/ExamPanel.vue'
import { updateReportInfoAPI, optionsCounselorReportList, getCounselorReportListAPI } from '@/plugins/utils/requests/api/backend'
import { useExamProcessStore } from '@/stores/examProcess'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const reportList = ref([])
const loading = ref(false)
const appStore = useAppStore()
const examProcessStore = useExamProcessStore()

// 第一個下拉選單：類型選擇（組織/活動）
const filterType = ref(null)
const filterTypeOptions = [
  { title: '組織', value: 'organization' },
  { title: '活動', value: 'event' }
]

// 第二個下拉選單：根據第一個選單的選擇顯示對應選項
const filterValue = ref(null)
const filterValueOptions = ref([])

// 監聽第一個下拉選單的變化，更新第二個下拉選單的選項
const updateFilterValueOptions = async () => {
  // 重置第二個下拉選單的值
  filterValue.value = null
  filterValueOptions.value = []
  
  // 如果沒有選擇類型或沒有 counselor_id，則不執行
  if (!filterType.value || !appStore.counselor_id) {
    return
  }
  
  try {
    // 根據類型決定 API 的 type 參數
    // type = '0' 為活動，type = '1' 為組織
    const type = filterType.value === 'event' ? '0' : '1'
    
    // 調用 API 獲取列表
    const res = await optionsCounselorReportList(appStore.counselor_id, type)
    
    // 解析 API 回應
    let counselorList = []
    
    if (res?.data?.attributes?.counselor_list) {
      counselorList = res.data.attributes.counselor_list
    } else if (res?.attributes?.counselor_list) {
      counselorList = res.attributes.counselor_list
    } else if (res?.counselor_list) {
      counselorList = res.counselor_list
    } else if (Array.isArray(res)) {
      counselorList = res
    } else if (res?.data && Array.isArray(res.data)) {
      counselorList = res.data
    }
    
    // 根據類型映射數據到下拉選單選項
    if (filterType.value === 'event') {
      // 活動列表：使用 event_id 和 event_name
      filterValueOptions.value = counselorList.map(item => ({
        title: item.event_name || item.name || '',
        value: item.event_id || item.id || ''
      }))
    } else if (filterType.value === 'organization') {
      // 組織列表：使用 org_id 和 org_name（根據實際 API 回應調整）
      filterValueOptions.value = counselorList.map(item => ({
        title: item.org_name || item.name || '',
        value: item.org_id || item.id || ''
      }))
    }
    
    console.log('載入完成，共', filterValueOptions.value.length, '筆', filterType.value === 'event' ? '活動' : '組織')
  } catch (error) {
    console.error('載入列表時發生錯誤:', error)
    filterValueOptions.value = []
  }
}

// 檢查是否為諮商師角色
const isCounselor = computed(() => {
  // 檢查 appStore.role 數組中是否包含 'counselor'
  let roles = appStore.role || []
  
  // 如果是字符串，轉換為數組
  if (typeof roles === 'string') {
    roles = [roles]
  }
  
  // 如果不是數組，返回 false
  if (!Array.isArray(roles)) {
    return false
  }
  
  return roles.includes('counselor')
})

onMounted(async () => {
  // 如果不是諮商師，重定向到首頁
  if (!isCounselor.value) {
    router.push('/')
    return
  }
  
  // 初始載入時不載入報告，等待用戶選擇過濾條件
  // await loadReports()
})

// 監聽 filterType 和 filterValue 的變化，自動載入報告列表
watch([filterType, filterValue], () => {
  if (filterType.value && filterValue.value) {
    loadReports()
  } else {
    // 如果沒有選擇過濾條件，清空報告列表
    reportList.value = []
  }
})

const loadReports = async () => {
  // 如果沒有選擇過濾條件，不執行查詢
  if (!filterType.value || !filterValue.value) {
    reportList.value = []
    return
  }
  
  loading.value = true
  try {
    examProcessStore.resetStore()
    
    // 根據 filterType 決定 type 參數
    // type = '0' 為活動，type = '1' 為組織
    const type = filterType.value === 'event' ? '0' : '1'
    
    // 使用 getCounselorReportListAPI 查詢報告
    const res = await getCounselorReportListAPI(filterValue.value, type)
    
    // 解析 API 回應
    let reportListData = []
    
    if (res?.data?.attributes?.report_list) {
      reportListData = res.data.attributes.report_list
    } else if (res?.attributes?.report_list) {
      reportListData = res.attributes.report_list
    } else if (res?.report_list) {
      reportListData = res.report_list
    } else if (Array.isArray(res)) {
      reportListData = res
    } else if (res?.data && Array.isArray(res.data)) {
      reportListData = res.data
    }
    
    reportList.value = reportListData || []
    console.log('載入完成，共', reportList.value.length, '筆可觀看的測驗結果')
  } catch (error) {
    console.error('載入測驗結果列表時發生錯誤:', error)
    reportList.value = []
  } finally {
    loading.value = false
  }
}

const handleUpdateReportName = (data) => {  
  // 檢查資料結構
  if (!data || typeof data !== 'object') {
    console.error('收到的資料格式不正確:', data)
    return
  }
  
  const { reportId, newName } = data
  
  // 驗證必要欄位
  if (!reportId || !newName) {
    console.error('缺少必要欄位:', { reportId, newName })
    return
  }
  
  // 尋找對應的報告並更新名稱
  const reportIndex = reportList.value.findIndex(report => report.crd_id === reportId)
  
  if (reportIndex !== -1) {
    // 使用 Vue 的響應式更新方式
    reportList.value[reportIndex] = {
      ...reportList.value[reportIndex],
      report_name: newName
    }

    // 更新報告名稱 API
    updateReportInfoAPI(reportId, 'report_name', newName)
  } else {
    console.error('找不到對應的報告，reportId:', reportId)
    console.log('可用的報告 ID:', reportList.value.map(r => r.crd_id))
  }
}

const handleUpdateReportEmail = (data) => {
  // 檢查資料結構
  if (!data || typeof data !== 'object') {
    console.error('收到的資料格式不正確:', data)
    return
  }
  
  const { reportId, newEmail } = data
  
  // 驗證必要欄位
  if (!reportId || !newEmail) {
    console.error('缺少必要欄位:', { reportId, newEmail })
    return
  }
  
  // 尋找對應的報告並更新信箱
  const reportIndex = reportList.value.findIndex(report => report.crd_id === reportId)
  
  if (reportIndex !== -1) {
    // 使用 Vue 的響應式更新方式
    reportList.value[reportIndex] = {
      ...reportList.value[reportIndex],
      target_email: newEmail
    }

    // 更新報告信箱 API
    updateReportInfoAPI(reportId, 'target_email', newEmail)
    console.log('信箱已成功更新:', newEmail)
  } else {
    console.error('找不到對應的報告，reportId:', reportId)
    console.log('可用的報告 ID:', reportList.value.map(r => r.crd_id))
  }
}
</script>

<template>
  <div class="exam-dashboard">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="module-title">
        {{ t('exam.counselorViewableExams') || '我可觀看的卡牌測驗結果' }}
      </div>
      <div class="d-flex align-center gap-4">
        <!-- 第一個下拉選單：類型選擇 -->
        <v-select
          v-model="filterType"
          :items="filterTypeOptions"
          label="類型"
          variant="outlined"
          density="compact"
          style="min-width: 150px;"
          @update:model-value="updateFilterValueOptions"
        />
        <!-- 第二個下拉選單：根據類型顯示對應選項 -->
        <v-select
          v-model="filterValue"
          :items="filterValueOptions"
          :label="filterType === 'organization' ? '組織' : filterType === 'event' ? '活動' : '請先選擇類型'"
          variant="outlined"
          density="compact"
          :disabled="!filterType"
          style="min-width: 200px;"
        />
      </div>
    </div>
    <div
      v-if="loading"
      class="text-center pa-4"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
    <div
      v-else-if="reportList.length === 0"
      class="no-data"
      v-html="t('exam.noExams')"
    />
    <v-row
      v-else
      class="exam-list"
    >
      <v-col
        v-for="report in reportList"
        :key="report.id || report.crd_id"
        cols="12"
        md="6"
        lg="4"
      >
        <ExamPanel
          :report="report" 
          @update-report-name="handleUpdateReportName"
          @update-report-email="handleUpdateReportEmail"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.exam-dashboard {
  width: 100%;
  height: 100%;
  padding: 40px;
  min-width: 520px;

  .exam-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
  }

  .module-title {
    font-size: 28px;
    font-weight: bold;
    color: black;
    text-decoration: underline;
    flex-shrink: 0;
  }

  .gap-4 {
    gap: 16px;
  }

  .no-data {
    font-size: 20px;
    color: black;
    text-align: center;
    margin-top: 40px;
  }
}
</style>

