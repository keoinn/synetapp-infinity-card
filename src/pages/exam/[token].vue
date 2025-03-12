<script setup>
/**
 * 測驗項目一覽
 */
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { decrypt } from '@/plugins/utils/encryption'
import SingleExamPanel from '@/components/exam/SingleExamPanel.vue'
import { useExamProcessStore } from '@/stores/examProcess'
const route = useRoute()
const examProcessStore = useExamProcessStore()
const pid = decrypt(route.params.token)

onMounted(async () => {
  await examProcessStore.getReportBackend(pid)
})

const stage = (target) => {
  if (target === 'goal') {
    return examProcessStore.computedPickGoalStage
  } else {
    return 0
  }
}

const viewReport = () => {
  console.log('viewReport')
}
</script>

<template>
  <div class="exam-landing-container">
    <div class="exam-landing">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
              class="text-h6"
              cols="8"
            >
              進行測驗
              <ExamResultView />
            </v-col>
            <v-spacer />
            <v-col
              class="text-h6"
              align="right"
              cols="4"
            >
              測驗編號：{{ pid }}
            </v-col>
          </v-row>
          <v-divider class="border-opacity-100" />
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
            卡牌配對
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
</style>
