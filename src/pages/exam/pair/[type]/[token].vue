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

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const job1 = Math.floor(Math.random() * goalImages.length)
const job2 = Math.floor(Math.random() * goalImages.length)
const job3 = Math.floor(Math.random() * goalImages.length)

const type = ref('care')
const professions = ref([
  {
    title: getGoalCardData(getCardImageName(goalImages[job1])).title,
    cards: [],
    class_img: goalImages[job1]
  },
  {
    title: getGoalCardData(getCardImageName(goalImages[job2])).title,
    cards: [],
    class_img: goalImages[job2]
  },
  {
    title: getGoalCardData(getCardImageName(goalImages[job3])).title,
    cards: [],
    class_img: goalImages[job3]
  }
])
const cardsPool = ref(
  [
    careImages[0],
    careImages[1],
    careImages[2],
    careImages[3],
    careImages[4],
    careImages[5],
    // ...careImages,
  ]
)

// 接收 emit 事件
const handleFinishClassify = (data) => {
  console.log(data)
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
