<script setup>
import { ref } from 'vue'
import CardPlayground from '@/components/playground/CardPlayground.vue'
// import { decrypt } from '@/plugins/utils/encryption'
import { useRoute, useRouter } from 'vue-router'
import { useExamProcessStore } from '@/stores/examProcess'
// import { goalImages, careImages, cjImages, ceImages, leImages, ljImages } from '@/plugins/utils/psy_cards'
const route = useRoute()
const router = useRouter()
const examProcessStore = useExamProcessStore()

// const pid = decrypt(route.params.token)
const type = route.params.type

// 定義卡片類型和狀態
const cardType = ref(type) // 可以根據需要更改
const cardsPool = ref([]) // 初始為空，根據需求填充
const cardsStatus = ref([]) // 初始為空，根據需求填充

/** Initializat Data from store */
let stage; // 將 stage 的聲明移到外部
switch (type) {
  case 'goal':
    stage = examProcessStore.computedPickGoalStage; // 在這裡賦值
    switch (stage) {
      case 0:
        cardsPool.value = examProcessStore.pick_goal.stage1.cards_pool
        // cardsPool.value = goalImages.slice(0, 20) // TODO: Debug
        cardsStatus.value = examProcessStore.pick_goal.stage1.cards_status
        break
      case 1:
        cardsPool.value = examProcessStore.pick_goal.final_cards
        cardsStatus.value = examProcessStore.pick_goal.stage2.cards_status
        break
      case 2:
        cardsPool.value = examProcessStore.pick_goal.final_cards
        cardsStatus.value = examProcessStore.pick_goal.stage3.cards_status
        break
      default:
        break
    }
    break
  case 'care':
    cardsPool.value = examProcessStore.pick_care.cards_pool
    // cardsPool.value = careImages.slice(0, 6) // TODO: Debug
    cardsStatus.value = examProcessStore.pick_care.cards_status
    break
  case 'ce':
    cardsPool.value = examProcessStore.pick_ce.cards_pool
    // cardsPool.value = ceImages.slice(0, 6) // TODO: Debug
    cardsStatus.value = examProcessStore.pick_ce.cards_status
    break
  case 'cj':
    cardsPool.value = examProcessStore.pick_cj.cards_pool
    // cardsPool.value = cjImages.slice(0, 6) // TODO: Debug
    cardsStatus.value = examProcessStore.pick_cj.cards_status
    break
  case 'le':
    cardsPool.value = examProcessStore.pick_le.cards_pool
    // cardsPool.value = leImages.slice(0, 6) // TODO: Debug
    cardsStatus.value = examProcessStore.pick_le.cards_status
}
// 處理完成事件
const handleFinish = (data) => {
  examProcessStore.setRecord(cardType.value, data, examProcessStore.computedPickGoalStage)
  router.push(`/exam/${route.params.token}`)
}

</script>

<template>
  <div class="playground">
    <CardPlayground
      :type="cardType"
      :cards-pool="cardsPool"
      :cards-status="cardsStatus"
      @finish="handleFinish"
    />
  </div>
</template>

<style lang="scss" scoped>
.playground {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
