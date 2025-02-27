<template>
  <div class="card-playground">
    <div class="drop-areas-container">
      <div
        v-for="(profession, index) in professions"
        :key="index"
        class="drop-area"
        @drop.prevent="handleDrop($event, index)"
        @dragover.prevent
      >
        {{ profession.title }} ({{ profession.cards.length }})
        <v-img :src="profession.class_img" alt="職業圖片" class="profession-img"></v-img>
      </div>
    </div>
    <div class="card-container">
      <CardView
        v-for="(card, index) in currentCardPool"
        v-show="index >= currentSequence"
        :key="index"
        :image="card"
        :is-fold="cards_status[index]"
        :card-draggable="true"
        draggable="true"
        @dragstart="handleDragStart(card)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { handleAlert } from '@/plugins/utils/alert.js'
import {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages,
} from '@/plugins/utils/psy_cards.js'
import { getCardImageName } from '@/plugins/utils/psy_cards.js'
const professions = ref([
  { title: '職業一', cards: [], class_img: goalImages[0] },
  { title: '職業二', cards: [], class_img: goalImages[1] },
  { title: '職業三', cards: [], class_img: goalImages[2] }
])
const professionCards = ref({
  '職業一': [],
  '職業二': [],
  '職業三': []
})
const draggedCard = ref(null)
const currentSequence = ref(0)
const currentCardPool = ref(careImages)
const cards_status = ref(
  Array(currentCardPool.value.length).fill(true) // 設置為 true
)

const handleDragStart = (card) => {
  draggedCard.value = card
}

const handleDrop = async (event, professionIndex) => {
  event.preventDefault();
  if (draggedCard.value) {
    professions.value[professionIndex].cards.push(draggedCard.value);
    handleAlert({
      auction: 'success',
      text: `你已經成功拖曳 ${getCardImageName(draggedCard.value)} 到 ${professions.value[professionIndex].title}`
    });
    currentSequence.value++
    cards_status.value[currentSequence.value] = false
    draggedCard.value = null;
  }
};

onMounted(() => {
  document.body.setAttribute('ondragstart', 'true')
  cards_status.value[currentSequence.value] = false
})
</script>

<style lang="scss" scoped>
.card-playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: lightblue;
  position: relative;
  width: 100%;
  min-height: 600px;
}

.drop-areas-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  top: 20px;
}

.drop-area {
  flex: 1;
  height: 300px;
  margin: 0 10px;
  padding: 20px;
  text-align: center;
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.card-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.card {
  margin: 10px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
