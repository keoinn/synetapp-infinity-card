<script setup>
/**
 * 測驗項目一覽頁面
 * 
 * 此頁面顯示所有可用的測驗項目，包括：
 * - 進行測驗：顯示所有配置的卡片集合（care, ce, cj, le, lj, goal）
 * - 卡牌配對：當存在 goal 集合時，顯示配對測驗選項
 * 
 * @route /exam
 * 
 * @dependencies
 * - @/components/exam/ExamPanel - 單一測驗面板組件
 * - @/plugins/utils/requests/api/backend - 後端 API 呼叫
 * - @/stores/examProcess - 測驗流程狀態管理
 * - @/stores/app - 應用程式狀態管理
 * - vue-i18n - 國際化支援
 * 
 * @lifecycle
 * - onMounted: 載入測驗報告列表數據
 * 
 * @functions
 * - handleUpdateReportName(data): 更新報告名稱
 * - handleUpdateReportEmail(data): 更新報告信箱
 * 
 * @computed
 * - reportList: 測驗報告列表
 * 
 * @methods
 * - handleUpdateReportName(data): 更新報告名稱
 * - handleUpdateReportEmail(data): 更新報告信箱
 * 
 * @watch
 * - reportList: 監聽測驗報告列表變化
 * 
 * @events
 * - update-report-name: 更新報告名稱事件
 * - update-report-email: 更新報告信箱事件
 * 
 * @example
 * 訪問路徑：/exam
 * 組件會自動從 examProcessStore 中載入測驗報告列表數據並顯示
 * 
 * @dependencies
 * - @/components/exam/ExamPanel - 單一測驗面板組件
 * - @/plugins/utils/requests/api/backend - 後端 API 呼叫
 * - @/stores/examProcess - 測驗流程狀態管理
 * - @/stores/app - 應用程式狀態管理
 * - vue-i18n - 國際化支援
 * 
 * @lifecycle
 * - onMounted: 載入測驗報告列表數據
 */
import { ref, onMounted } from 'vue'
// import { encrypt, decrypt } from '@/plugins/utils/encryption'
import ExamPanel from '@/components/exam/ExamPanel.vue'
import { getReportListAPI, updateReportInfoAPI } from '@/plugins/utils/requests/api/backend'
// import { getReportList } from '@/plugins/utils/requests/mock/backend'
import { useExamProcessStore } from '@/stores/examProcess'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const reportList = ref([])
const appStore = useAppStore()
const examProcessStore = useExamProcessStore()

onMounted(async () => {
  try {
    examProcessStore.resetStore()
    const res = await getReportListAPI(appStore.user_id, appStore.selectedRole)
    
    if (res && res.data && res.data.attributes && res.data.attributes.report_list) {
      reportList.value = res.data.attributes.report_list
    } else {
      console.error('API 回應格式不正確:', res)
      reportList.value = []
    }
  } catch (error) {
    console.error('載入報告列表時發生錯誤:', error)
    reportList.value = []
  }
})

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
    <div class="module-title">
      {{ t('exam.myExams') }}
    </div>
    <div
      v-if="reportList.length === 0"
      class="no-data"
      v-html="t('exam.noExams')"
    />
    <v-row class="exam-list">
      <v-col
        v-for="report in reportList"
        :key="report.id"
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
  }

  .no-data {
    font-size: 20px;
    color: black;
    text-align: center;
    margin-top: 40px;
  }
}
</style>
