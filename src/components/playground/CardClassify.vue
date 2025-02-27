<script setup>
// TODO: 通訊
// TODO: 模組參數化
// TODO: rollback btn
// defined props
// define emit
import { ref, onMounted, computed, watch } from 'vue'
import { handleAlert } from '@/plugins/utils/alert.js'
import {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages
} from '@/plugins/utils/psy_cards.js'
import { getCardImageName } from '@/plugins/utils/psy_cards.js'
import {
  remainingSeconds,
  formattedTime,
  startTimer,
  stopTimer,
  cleanup,
  setTimer
} from '@/plugins/utils/countdown.js'
const professions = ref([
  { title: '職業一', cards: [], class_img: goalImages[0] },
  { title: '職業二', cards: [], class_img: goalImages[1] },
  { title: '職業三', cards: [], class_img: goalImages[2] }
])

const draggedCard = ref(null)
const currentSequence = ref(0)
const currentCardPool = ref(careImages)
const isStart = ref(false) // UI 是否就緒
const cards_status = ref(
  Array(currentCardPool.value.length).fill(true) // 設置為 true
)
const remainingCards = computed(() => {
  return currentCardPool.value.length - currentSequence.value
})

const handleDragStart = (card) => {
  draggedCard.value = card
}

const handleFinish = () => {
  handleAlert({
    auction: 'success',
    text: `你已經成功完成卡片選擇`
  })
  console.log(professions.value)
}

const handleDrop = async (event, professionIndex) => {
  event.preventDefault()
  if (draggedCard.value) {
    professions.value[professionIndex].cards.push(draggedCard.value)
    handleAlert({
      auction: 'success',
      text: `你已經成功拖曳 ${getCardImageName(draggedCard.value)} 到 ${
        professions.value[professionIndex].title
      }`
    })
    currentSequence.value++
    cards_status.value[currentSequence.value] = false
    draggedCard.value = null
  }
}
// 監聽倒數結束
watch(remainingSeconds, (newValue) => {
  if (newValue === 0) {
    handleAlert({
      auction: 'warning',
      text: '時間到！請確認是否要繼續？'
    })
  }
})

onMounted(() => {
  document.body.setAttribute('ondragstart', 'true')
  cards_status.value[currentSequence.value] = false
  isStart.value = true
  setTimer(300)
  startTimer(true)
})
</script>

<template>
  <div class="card-playground">
    <TimeRemainingBar
      :remaining-seconds="remainingSeconds"
      :countdown-seconds="300"
    />
    <v-row>
      <v-col cols="12">
        <div class="drop-areas-container">
          <div
            v-for="(profession, index) in professions"
            :key="index"
            class="drop-area"
            @drop.prevent="handleDrop($event, index)"
            @dragover.prevent
          >
            {{ profession.title }} ({{ profession.cards.length }})
            <v-img
              :src="profession.class_img"
              alt="職業圖片"
              class="profession-img"
            />
          </div>
        </div>
        <div
          v-show="isStart"
          class="card-container"
        >
          <CardView
            v-for="(card, index) in currentCardPool"
            v-show="index >= currentSequence"
            :key="index"
            :image="card"
            class="card"
            :is-fold="cards_status[index]"
            :card-draggable="true"
            draggable="true"
            :style="{
              zIndex: 1000 - index,
              transform: `translate(${index * 0.9}px, ${index * 0.5}px)`}"
            @dragstart="handleDragStart(card)"
          />
          <v-btn
            v-if="remainingCards === 0"
            rounded="xl"
            color="#FA5015"
            text="完成卡片選擇"
            size="x-large"
            class="finish"
            @click="handleFinish"
          />
        </div>
        <div class="card-count">
          卡牌剩餘張數 <span class="card-count-number">{{ remainingCards }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.card-playground {
  background-color: lightblue;
  position: relative;
  min-height: 600px;
  max-width: 1100px;
  min-width: 960px;
  width: 100%;
  flex-direction: column;
  display: flex;
}

.drop-areas-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  top: 20px;
}

.drop-area {
  height: 350px;
  width: 300px;
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 20px;
  text-align: center;
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
  .profession-img {
    padding-bottom: 10px;
  }
}

.card-container {
  height: 400px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 20px;
  // background-color: lightgoldenrodyellow;
  // flex: 1;

  .finish {
    margin-top: 100px;
  }
}

.card {
  position: absolute;
  transition: transform 0.2s;
  margin-bottom: 20px;
}

.card-count {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  margin-bottom: 40px;
  margin-right: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 32px;
  .card-count-number {
    font-size: 32px;
    font-weight: bold;
    color: orange;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
