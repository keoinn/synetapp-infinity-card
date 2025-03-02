<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { decrypt } from '@/plugins/utils/encryption'
import SingleExamPanel from '@/components/exam/SingleExamPanel.vue'
import { getReportSettings } from '@/plugins/utils/requests/mock/backend'
const route = useRoute()
const pid = decrypt(route.params.token)
const cards_set = ref([])

/**
 * 檢查是否存在 goal 卡牌 -> 沒有配置 goal 牌組就無法配對
 * @returns {boolean}
 * @example
 * console.log("CHECK GOAL SET EXIST: ", checkGoalSetExist.value)
 */
const checkGoalSetExist = computed(() => {
  return cards_set.value.includes('goal')
})

const filerOutGoalSet = computed(() => {
  return cards_set.value.filter((set) => set !== 'goal')
})

onMounted(async () => {
  // const res = await getReportSettings('1740885538301')
  const res = await getReportSettings(pid)
  console.log(res)
  cards_set.value = res.data.attributes.cards_set
  console.log(cards_set.value)
})
</script>

<template>
  <div class="exam-landing-container">
    <div class="exam-landing">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col class="text-h6">
              進行測驗
            </v-col>
            <v-spacer />
            <v-col
              class="text-h6"
              align="right"
            >
              測驗編號：{{ pid }}
            </v-col>
          </v-row>
          <v-divider class="border-opacity-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(set, index) in cards_set"
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
            />
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="checkGoalSetExist"
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
          v-for="(set, index) in filerOutGoalSet"
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
  background-color: lightblue;
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
    background-color: white;
    padding: 20px;
  }

  .exam-section-text {
  }
}
</style>
