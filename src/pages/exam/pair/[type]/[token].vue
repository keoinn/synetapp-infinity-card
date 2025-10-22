<script setup>
import CardClassify from '@/components/playground/CardClassify.vue';
import { ref } from 'vue';
import {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages,
  getCardImageName,
  getGoalCardData,
} from '@/plugins/utils/psy_cards.js'
import { getCardImagePath } from '@/utils/imageUtils'
import { useExamProcessStore } from '@/stores/examProcess'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const examProcessStore = useExamProcessStore()
const type = ref(route.params.type)

const professions_data= examProcessStore.pick_goal.final_cards.map(card => {
  return {
    title: getGoalCardData(getCardImageName(card)).title,
    cards: [],
    class_img: getCardImagePath(card)
  }
})
const professions = ref([...professions_data])
const cardsPool = ref()

/** Initializat Data from store */
switch (type.value) {
  case 'care':
    cardsPool.value = examProcessStore.pick_care.keep_cards
    break
  case 'ce':
    cardsPool.value = examProcessStore.pick_ce.keep_cards
    break
  case 'cj':
    cardsPool.value = examProcessStore.pick_cj.keep_cards
    break
  case 'le':
    cardsPool.value = examProcessStore.pick_le.keep_cards
    break
  case 'lj':
    cardsPool.value = examProcessStore.pick_lj.keep_cards
    break
}

// 接收 emit 事件
const handleFinishClassify = async (data) => {
  await examProcessStore.setPairRecord(type.value, data)
  router.push(`/exam/${route.params.token}`)
}

</script>

<template>
  <div class="sort-page">
    <CardClassify
      :professions="professions"
      :cards-pool="cardsPool"
      :type="type"
      @finish-classify="handleFinishClassify"
    />
  </div>
</template>



<style scoped>
.sort-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
