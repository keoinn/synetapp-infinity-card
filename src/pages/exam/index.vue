<script setup>
import { ref, onMounted } from 'vue'
// import { encrypt, decrypt } from '@/plugins/utils/encryption'
import ExamPanel from '@/components/exam/ExamPanel.vue'
import { getReportListAPI } from '@/plugins/utils/requests/api/backend'
// import { getReportList } from '@/plugins/utils/requests/mock/backend'
import { useExamProcessStore } from '@/stores/examProcess'
import { useAppStore } from '@/stores/app'

const reportList = ref([])
const appStore = useAppStore()
const examProcessStore = useExamProcessStore()

onMounted(async () => {
  examProcessStore.resetStore()
  const res = await getReportListAPI(appStore.user_id)
  reportList.value = res.data.attributes.report_list
})
</script>

<template>
  <div class="exam-dashboard">
    <div class="module-title">
      我建立的卡牌測驗
    </div>
    <div
      v-if="reportList.length === 0"
      class="no-data"
    >
      目前沒有任何卡牌測驗<br>
      請先建立卡牌測驗
    </div>
    <v-row class="exam-list">
      <v-col
        v-for="report in reportList"
        :key="report.id"
        cols="12"
        md="6"
        lg="4"
      >
        <ExamPanel :report="report" />
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
