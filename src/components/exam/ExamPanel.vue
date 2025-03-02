<script setup>
import { encrypt } from '@/plugins/utils/encryption'

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <v-card>
    <v-card-title>測驗序號：{{ report.id }}</v-card-title>
    <v-card-text>
      <div class="exam-card-content">
        <ul class="content-list">
          <!-- TODO: 內容規劃 -->
          <li>測驗續號：{{ report.id }}</li>
          <li>測驗類型：{{ report.cards_set }}</li>
          <li>測驗狀態：{{ report.is_active }}</li>
          <li>測驗結果：{{ report.has_result }}</li>
          <li>測驗時間：{{ report.created_at }}</li>
          <li>測驗更新時間：{{ report.updated_at }}</li>
        </ul>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        variant="tonal"
        color="#FA5015"
        size="large"
        rounded="xl"
        :to="`/report/${encrypt(report.id.toString())}`"
      >
        <v-icon>mdi-eye</v-icon>
        查看
      </v-btn>

      <v-spacer />
      <v-btn
        variant="tonal"
        color="#FA5015"
        size="large"
        rounded="xl"
        :to="`/exam/${encrypt(report.id.toString())}`"
      >
        <v-icon>mdi-pencil</v-icon>
        進行測驗
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.exam-card-content {
  .content-list {
    list-style: '\1F4CC';
    padding: 5px;
    margin-left: 20px;

    li {
        text-indent: 10px;
    }
  }
}
</style>
