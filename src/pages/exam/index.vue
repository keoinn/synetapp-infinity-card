<script setup>
import { ref, onMounted } from 'vue'
import { getReportList } from '@/plugins/utils/requests/mock/backend'
import { encrypt, decrypt } from '@/plugins/utils/encryption'
import ExamPanel from '@/components/exam/ExamPanel.vue'

const reportList = ref([])

onMounted(async () => {
  const res = await getReportList(1)
  reportList.value = res.data.attributes.report_list
})
</script>

<template>
  <div class="exam-dashboard">
    <div class="module-title">
      ExamDashboard
    </div>
    <v-row
      class="exam-list"
    >
      <v-col
        v-for="report in reportList"
        :key="report.id"
        cols="12"
        md="6"
        lg="3"
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
  background-color: lightblue;
  padding: 40px;
  min-width: 520px;

  .exam-list {
    display: flex;
    flex-wrap: wrap;
    background-color: white;
    padding: 20px;
  }

  .module-title {
    font-size: 24px;
    font-weight: bold;
    color: black;
  }

  
}
</style>
