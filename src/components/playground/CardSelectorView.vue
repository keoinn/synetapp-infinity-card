<template>
  <div class="card-selector-view">
    <v-row class="pa-0 ma-0">
      <v-col cols="12">
        <v-progress-linear
          :model-value="(remainingSeconds / COUNTDOWN_SECONDS) * 100"
          height="20"
          color="#FA5015"
          rounded="xl"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col
        cols="1"
        class="pa-0 ma-0"
      >
        <span class="text-h6">{{ formattedTime }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(image, index) in currentCardPoolWithPaths"
        :key="currentCardPool[index]"
        cols="3"
        md="3"
        lg="3"
        xl="3"
      >
        <CardView
          :image="image"
          @card-flipped="handleCardFlip"
        />
      </v-col>
    </v-row>
    <v-row class="pa-0 ma-0">
      <v-col cols="3">
        <v-btn
          rounded="xl"
          color="#FA5015"
          text="我憧憬的職業"
          size="large"
          block
        />
      </v-col>
      <v-col cols="2">
        <v-btn
          rounded="xl"
          color="#FA5015"
          text="暫存"
          size="large"
          block
        />
      </v-col>
      <v-spacer />
      <v-col cols="1">
        <v-btn
          icon="mdi-chevron-left"
          color="#FA5015"
          @click="CurrentPage--"
        />
      </v-col>
      <v-col cols="1">
        <v-btn
          icon="mdi-chevron-right"
          color="#FA5015"
          @click="CurrentPage++"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'

// Props
const props = defineProps({
  cardType: {
    type: String,
    default: 'care'
  }
})
import { 
  careImages, 
  leImages, 
  ljImages, 
  ceImages, 
  cjImages, 
  goalImages, 
  combineAndShuffle, 
  getCardImageName 
} from '@/plugins/utils/psy_cards.js'
import { getCardImagePath } from '@/utils/imageUtils'
import {
  remainingSeconds,
  formattedTime,
  startTimer,
  stopTimer,
  cleanup,
  setTimer
} from '@/plugins/utils/countdown.js'
import { handleAlert } from '@/plugins/utils/alert.js'

// 常量
const CARDS_PER_PAGE = 8
const COUNTDOWN_SECONDS = 300 // 5分鐘

// 取得初始卡片集合（返回卡片代號）
function getInitialCards(type) {
  let imageArray = []
  
  switch (type) {
    case 'care':
      imageArray = careImages
      break
    case 'le':
      imageArray = leImages
      break
    case 'lj':
      imageArray = ljImages
      break
    case 'ce':
      imageArray = ceImages
      break
    case 'cj':
      imageArray = cjImages
      break
    case 'goal':
      imageArray = goalImages
      break
    default:
      return []
  }
  
  // 將圖片路徑轉換為卡片代號
  let cardArray = imageArray.map(imagePath => getCardImageName(imagePath))
  return cardArray
}

// 狀態
const currentCardPool = ref([])
const CurrentPage = ref(0)
const cardImages = combineAndShuffle(getInitialCards(props.cardType)) // 使用 props 中的卡片類型
const PageSize = ref(Math.ceil(cardImages.length / CARDS_PER_PAGE))

// 倒數計時相關
setTimer(COUNTDOWN_SECONDS)
startTimer(true)

// 事件處理
const handleCardFlip = ({ cardName, isFold, imagePath }) => {
  console.log('卡片已翻轉：', cardName)
  console.log('翻轉狀態：', isFold)
  console.log('圖片路徑：', imagePath)
  console.log('觸發時間：', remainingSeconds.value)
}

// 監聽倒數結束
const stopWatch = watch(remainingSeconds, (newValue) => {
  if (newValue === 0) {
    // TODO: 倒數結束後，需要做的事情
    handleAlert({
      auction: 'warning',
      text: '時間到！請確認是否要繼續？'
    })
    stopWatch(); // 移除監聽器
  }
})

// 更新卡片池
const updateCardPool = () => {
  currentCardPool.value = cardImages.slice(
    CurrentPage.value * PageSize.value,
    (CurrentPage.value + 1) * PageSize.value
  )
}

// 將卡片代號轉換為圖片路徑
const currentCardPoolWithPaths = computed(() => {
  return currentCardPool.value.map(cardCode => getCardImagePath(cardCode))
})

// 監聽頁碼變化
watch(CurrentPage, () => {
  // 確保頁碼在有效範圍內
  if (CurrentPage.value < 0) {
    CurrentPage.value = 0
  }
  const maxPage = Math.ceil(cardImages.length / PageSize.value) - 1
  if (CurrentPage.value > maxPage) {
    CurrentPage.value = maxPage
  }
  
  updateCardPool()
})

// 生命週期鉤子
onMounted(() => {
  startTimer()
  updateCardPool()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
.card-selector-view {
  max-width: 1100px;
  width: 1100px;
  display: flex;
  flex-direction: column;
}
</style>
