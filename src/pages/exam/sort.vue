<script setup>
import CardClassify from '@/components/playground/CardClassify.vue';
import { ref } from 'vue';
import {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages
} from '@/plugins/utils/psy_cards.js'

const type = ref('care')
const professions = ref([
  {
    title: '職業一',
    cards: [],
    class_img: goalImages[0]
  },
  {
    title: '職業二',
    cards: [],
    class_img: goalImages[6]
  },
  {
    title: '職業三',
    cards: [],
    class_img: goalImages[2]
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
