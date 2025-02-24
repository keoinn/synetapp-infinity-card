<template>
  <div class="card-playground">
    <v-row class="pa-0 ma-0">
      <v-col cols="12">
        <v-progress-linear
          :model-value="(remainingSeconds / countdownSeconds) * 100"
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
        v-for="(image, index) in currentCardPool"
        :key="image"
        cols="3"
        md="3"
        lg="3"
        xl="3"
      >
        <CardView
          :image="image"
          :is-fold="cards_status[cardsPerPage * CurrentPage + index]"
          @card-flipped="handleCardFlip"
        />
      </v-col>

      <v-col
        v-for="n in 8 - currentCardPool.length"
        :key="n"
        cols="3"
        md="3"
        lg="3"
        xl="3"
      >
        <v-img
          :src="emptyCard"
          style="width: 237px; height: 328px"
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
          @click="handleSave"
        />
      </v-col>
      <v-col
        v-if="isLastPage"
        cols="2"
      >
        <v-btn
          rounded="xl"
          color="#FA5015"
          text="完成卡片選擇"
          size="large"
          block
          @click="handleFinish"
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
import { ref, onMounted, watch, defineProps, computed, onBeforeUnmount } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { useCountdown } from '@/plugins/utils/countdown.js'
import { handleAlert } from '@/plugins/utils/alert.js'
import {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages
} from '@/plugins/utils/psy_cards.js'
import emptyCard from '@/assets/images/covers/empty.webp'

// 定義 props
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['care', 'le', 'lj', 'ce', 'cj', 'goal'].includes(value)
  },
  cardsPool: {
    type: Array,
    default: () => []
  },
  cardsStatus: {
    type: Array,
    default: () => []
  },
  cardsPerPage: {
    type: Number,
    default: 8 // 預設值
  },
  countdownSeconds: {
    type: Number,
    default: 300 // 預設值
  }
})

// 定義 emit
const emit = defineEmits(['finish'])

// 狀態
const cards_pool = ref(props.cardsPool.length ? props.cardsPool : getInitialCards(props.type))
const cards_status = ref(
  props.cardsStatus.length ? props.cardsStatus : Array(cards_pool.value.length).fill(false) // 設置為 true
)
const CurrentPage = ref(0)
const { remainingSeconds, formattedTime, startTimer, cleanup } = useCountdown(
  props.countdownSeconds
)
const logs = ref([]) // 用於記錄翻牌事件
const cardsStore = useCardsStore() // 使用 cards store

// 取得初始卡片集合
function getInitialCards(type) {
  switch (type) {
    case 'care':
      return careImages
    case 'le':
      return leImages
    case 'lj':
      return ljImages
    case 'ce':
      return ceImages
    case 'cj':
      return cjImages
    case 'goal':
      return goalImages
    default:
      return []
  }
}

// 計算當前卡片池
const currentCardPool = computed(() => {
  const start = CurrentPage.value * props.cardsPerPage
  return cards_pool.value.slice(start, start + props.cardsPerPage)
})

// 監聽倒數結束
watch(remainingSeconds, (newValue) => {
  if (newValue === 0) {
    handleAlert({
      auction: 'warning',
      text: '時間到！請確認是否要繼續？'
    })
  }
})

watch(CurrentPage, (newValue) => {
  const maxPage = Math.ceil(cards_pool.value.length / props.cardsPerPage) - 1
  const minPage = 0
  if (newValue > maxPage) {
    CurrentPage.value = maxPage
  }
  if (newValue < minPage) {
    CurrentPage.value = minPage
  }
})

// 處理卡片翻轉事件
const handleCardFlip = ({ cardName, isFold, imagePath }) => {
  const logEntry = {
    seq: logs.value.length + 1,
    card: cardName,
    status: isFold,
    timestamp: remainingSeconds.value
  }
  logs.value.push(logEntry)

  // 根據 cardName 更新 cards_status
  const cardIndex = cards_pool.value.findIndex((card) => card === imagePath)
  if (cardIndex !== -1) {
    cards_status.value[cardIndex] = isFold // 更新對應的狀態
  }

  // 更新 store 狀態
  cardsStore.updateCards(cards_pool.value, cards_status.value, logs.value, CurrentPage.value)
}

// 檢查是否為最後一頁
const isLastPage = computed(() => {
  const maxPage = Math.ceil(cards_pool.value.length / props.cardsPerPage) - 1
  return CurrentPage.value >= maxPage
})

// 處理暫存按鈕
const handleSave = () => {
  // 儲存邏輯
  cardsStore.saveCards(cards_pool.value, cards_status.value, logs.value, CurrentPage.value)
}

// 處理完成按鈕
const handleFinish = () => {
  // 發出 emit 事件
  emit('finish', {
    cards_pool: cards_pool.value,
    cards_status: cards_status.value,
    logs: logs.value,
    current_page: CurrentPage.value
  })
}

// 生命週期鉤子
onMounted(() => {
  startTimer()
})

// 清理
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
.card-playground {
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
