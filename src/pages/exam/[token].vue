<script setup>
/**
 * 測驗項目一覽頁面
 * 
 * 此頁面顯示所有可用的測驗項目，包括：
 * - 進行測驗：顯示所有配置的卡片集合（care, ce, cj, le, lj, goal）
 * - 卡牌配對：當存在 goal 集合時，顯示配對測驗選項
 * 
 * @route /exam/[token]
 * @param {string} token - 加密的參與者 ID，需要解密後使用
 * 
 * @example
 * 訪問路徑：/exam/encrypted_token_here
 * token 會被解密為參與者 ID (pid)
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理
 * - @/components/exam/SingleExamPanel - 單一測驗面板組件
 * - @/components/result/ExamResultView - 測驗結果視圖 (Deprecated)
 * - @/components/result/ExamResultTextView - 測驗結果文字視圖 (Deprecated)
 * - @/components/result/ExamCounselorResult - 諮商師結果視圖
 * - @/components/result/ExamClientResult - 客戶結果視圖
 * - @/plugins/utils/encryption - 加密工具（用於解密 token）
 * 
 * @lifecycle
 * - onMounted: 載入測驗報告數據
 */

import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { decrypt } from '@/plugins/utils/encryption'
import SingleExamPanel from '@/components/exam/SingleExamPanel.vue'
import ExamResultView from '@/components/result/ExamResultView.vue'
import ExamResultTextView from '@/components/result/ExamResultTextView.vue'
import ExamCounselorResult from '@/components/result/ExamCounselorResult.vue'
import ExamClientResult from '@/components/result/ExamClientResult.vue'
import { useExamProcessStore } from '@/stores/examProcess'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const examProcessStore = useExamProcessStore()
const pid = decrypt(route.params.token)

onMounted(async () => {
  console.log('pid:', pid)
  await examProcessStore.getReportBackend(pid)
})

const stage = (target) => {
  if (target === 'goal') {
    return examProcessStore.computedPickGoalStage
  } else {
    return 0
  }
}
</script>

<template>
  <div class="exam-landing-container">
    <div class="exam-landing">
      <v-row>
        <v-col cols="12">
          <v-row class="align-center header-row">
            <v-col
              class="text-h6 d-flex align-center"
              cols="8"
            >
              <span class="mr-2">{{ t('playground.examProcessing') }}</span>
              <div class="button-group">
                <ExamCounselorResult />
                <ExamClientResult />
                <ExamResultView />
                <ExamResultTextView />
              </div>
            </v-col>
            <v-col
              class="text-h6 d-flex justify-end align-center"
              cols="4"
            >
              {{ t('exam.examSn') }}: {{ pid }}
            </v-col>
          </v-row>
          <v-divider class="border-opacity-100 mt-3" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(set, index) in examProcessStore.cards_set"
          :key="index"
          cols="12"
          md="4"
          lg="3"
          class="pa-0 ma-0"
        >
          <div class="exam-signal-card">
            <SingleExamPanel
              action="pick"
              :case="set"
              :token="route.params.token"
              :stage="stage(set)"
            />
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="examProcessStore.checkGoalSetExist"
        class="pt-2"
      >
        <v-col cols="12">
          <div class="text-h6">
            {{ t('playground.pairingExam') }}
            <v-divider class="border-opacity-100" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(set, index) in examProcessStore.filerOutGoalSet"
          :key="index"
          cols="12"
          md="4"
          lg="3"
          class="pa-0 ma-0"
        >
          <div class="exam-signal-card">
            <SingleExamPanel
              :case="set"
              action="pair"
              :token="route.params.token"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exam-landing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.exam-landing {
  width: 1100px;
  padding-top: 20px;
  padding-bottom: 40px;
  padding-left: 40px;
  padding-right: 40px;
  min-width: 380px;

  .module-title {
    font-size: 32px;
    font-weight: bold;
    color: black;
    margin-top: -20px;
    padding-bottom: 20px;
    text-decoration: underline;
  }

  .exam-signal-card {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}

.header-row {
  .v-col {
    padding: 0 8px;
  }
  
  .button-group {
    display: flex;
    align-items: center;
    gap: 4px;
    
    :deep(.v-btn) {
      margin: 0 !important;
    }
  }
}
</style>
