<script setup>
/**
 * Props definition for CardPlayground component
 * @typedef {Object} Props
 * @property {String} type - The type of cards, must be one of ['care', 'le', 'lj', 'ce', 'cj', 'goal'].
 * @property {Array} cardsPool - Initial array of cards.
 * @property {Array} cardsStatus - Array representing the status of each card, where `true` means selected.
 * @property {Number} cardsPerPage - Number of cards to display per page.
 * @property {Number} countdownSeconds - Initial countdown time in seconds.
 */

/**
 * Emits definition for CardPlayground component
 * @typedef {Object} Emits
 * @property {Function} finish - Emit when the card selection process is completed.
 */

import { ref, onMounted, watch, defineProps, computed, onBeforeUnmount } from 'vue'
import { useCardsStore } from '@/stores/cards'
import {
  remainingSeconds,
  formattedTime,
  startTimer,
  stopTimer,
  cleanup,
  setTimer
} from '@/plugins/utils/countdown.js'
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
import caseGoal from '@/assets/images/case/case_goal.webp'

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
const isStart = ref(false)
setTimer(props.countdownSeconds)

// 監聽 isStart 狀態
watch(isStart, (newValue) => {
  if (newValue) {
    startTimer(true) // 啟動計時器
  } else {
    stopTimer()
  }
})

const logs = ref([]) // 用於記錄翻牌事件
const cardsStore = useCardsStore() // 使用 cards store

// 指導語
const guideContent = ref(
  `  <ul>
    <li>
      接下來將會有有 100 種職業別顯示於畫面上，請依照你個人的判斷與感受，選出<span
        class="highlight"
        >你喜歡的、你憧憬的、對該職業有熱情未來有可能想去從事的行業</span
      >。
    </li>
    <li>
      請在 5 分鐘內，<span class="highlight">點擊</span
      >職業卡牌可以將牌面翻開或蓋上，留下你選擇的職業卡牌。
    </li>
    <li>
      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
    </li>
  </ul>`
)

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
    current_page: CurrentPage.value,
    keep_cards: filterKeepCards.value
  })
}

// 建立計算屬性 filterKeepCards
const filterKeepCards = computed(() => {
  return cards_pool.value.filter((card, index) => !cards_status.value[index]);
});

// 生命週期鉤子
onMounted(() => {
  startTimer()
})

// 清理
onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div
    class="card-playground"
    style=""
  >
    <div v-show="isStart">
      <TimeRemainingBar
        :remaining-seconds="remainingSeconds"
        :countdown-seconds="countdownSeconds"
      />
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
            :card-draggable="false"
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
    <div
      v-show="!isStart"
      class="guide-view"
    >
      <v-row
        class="pa-0 ma-0"
        style=""
      >
        <v-col cols="5">
          <v-row class="pa-0 ma-0">
            <v-col class="d-flex justify-center align-center">
              <img
                :src="caseGoal"
                class="card-case"
              >
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="d-flex justify-center align-center">
              <p class="case-title">
                我就是
              </p>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="d-flex justify-center align-center">
              <p class="case-subtitle">
                我憧憬的職業
              </p>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="7"
          class="guide-border"
        >
          <v-row>
            <v-col>
              <div class="guide-section d-flex justify-center align-center">
                <div
                  class="content"
                  v-html="guideContent"
                />
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-spacer />
            <v-col cols="4">
              <v-btn
                rounded="xl"
                color="#FA5015"
                text="開始測驗"
                size="large"
                block
                @click="isStart = !isStart"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>



<style lang="scss">
.card-playground {
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: lightblue;
}

.card-case {
  border-radius: 15px;
  height: 440px;
}

.case-title {
  font-size: 48px;
  font-weight: bold;
  color: #fa5015;
}

.case-subtitle {
  font-size: 32px;
  margin-top: -30px;
  color: #fa5015;
}

.guide-view {
  width: 1100px;
  // height: 720px;
  min-height: 720px;
}

.guide-border {
  border: 2px solid black;
  border-radius: 15px;
}

.guide-section {
  width: 100%;
  height: 100%;
  min-height: 400px;
  // background-color: lightblue;
  font-size: 24px;
  padding-top: 100px;

  .highlight {
    color: #fa5015;
    font-weight: 900;
  }

  .content {
    padding-left: 30px;
    ul {
      list-style-type: "\1F44D";
    }
  }
}
</style>
