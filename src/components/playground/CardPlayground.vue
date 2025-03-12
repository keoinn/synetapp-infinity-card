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

import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useCardsStore } from '@/stores/cards'
import {
  remainingSeconds,
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
  goalImages,
  getGuidanceContent,
  combineAndShuffle
} from '@/plugins/utils/psy_cards.js'
import emptyCard from '@/assets/images/covers/empty.webp'
import { addLog, getLogs, clearLogs, setProcessType } from '@/plugins/utils/process_logger.js'
import { useExamProcessStore } from '@/stores/examProcess'

const examProcessStore = useExamProcessStore()

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

// 定義 store
const cardsStore = useCardsStore()

// 狀態
/**
 * 卡片池
 * @type {Ref<Array>}
 * @Note 如果卡片池是 props 傳入，如果 props 是 empty，則會使用 getInitialCards (props.type) 初始化卡片池
 */
const cards_pool = ref(props.cardsPool.length ? props.cardsPool : props.cardsStatus.length ? props.cardsPool : combineAndShuffle(getInitialCards(props.type)))

/**
 * 卡片狀態
 * @type {Ref<Array>}
 * @Note 如果卡片狀態是 props 傳入，如果 props 是 empty，則會使用 Array(cards_pool.value.length).fill(false) 初始化卡片狀態
 *       - false 表示卡片蓋著
 *       - true 表示卡片翻開
 */
const cards_status = ref(
  props.cardsStatus.length ? props.cardsStatus : Array(cards_pool.value.length).fill(false) // 設置為 true
)

/**
 * 目前瀏覽頁數
 * @type {Ref<Number>}
 */
const CurrentPage = ref(0)

/**
 * 是否開始測驗
 * @type {Ref<Boolean>}
 * @Note 如果 isStart 為 true，關閉指導語畫面，顯示卡片選擇畫面
 *       如果 isStart 為 true，開始計時器
 *       如果 isStart 為 false，停止計時器
 */
const isStart = ref(false)

/**
 * 是否完成測驗
 * @type {Ref<Boolean>}
 * @Note 如果 isFinish 為 true，則卡片無法翻轉
 *       如果 isFinish 為 true，完成按鈕會消失
 */
const isFinish = ref(false)

/**
 * 指導語
 * @type {Ref<Object>}
 */
const guideInfo = ref(getGuidanceContent(props.type, examProcessStore.computedPickGoalStage, cards_pool.value.length))


// 建立計算屬性 filterKeepCards
const filterKeepCards = computed(() => {
  return cards_pool.value.filter((card, index) => !cards_status.value[index]);
});

const keepCardsNum = computed(() => {
  return cards_pool.value.filter((card, index) => !cards_status.value[index]).length
})

const currentCardPoolNum = computed(() => {
  return cards_pool.value.length
})

// 監聽 isStart 狀態
watch(isStart, (newValue) => {
  if (newValue) {
    startTimer(true) // 啟動計時器
    addLog({
      action: 'start',
      card: null,
      remainingSeconds: props.countdownSeconds,
      additional: {
        code: '2000',
        msg: '開始測驗'
      }
    })
  } else {
    stopTimer()
  }
})


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

// 檢查是否為最後一頁 -> 限制瀏覽頁數在卡片池的範圍內
const isLastPage = computed(() => {
  const maxPage = Math.ceil(cards_pool.value.length / props.cardsPerPage) - 1
  return CurrentPage.value >= maxPage
})

// 監聽倒數結束
watch(remainingSeconds, (newValue) => {
  if (newValue === 0) {
    handleAlert({
      auction: 'warning',
      text: '時間到！請確認是否要繼續？'
    })
    addLog({
      action: 'warning',
      card: null,
      remainingSeconds: 0,
      additional: {
        code: '4000',
        msg: '倒數計時結束'
      }
    })
  }
})

// 監聽瀏覽頁數 -> 限制瀏覽頁數在卡片池的範圍內
watch(CurrentPage, (newValue) => {
  const oldValue = CurrentPage.value
  const maxPage = Math.ceil(cards_pool.value.length / props.cardsPerPage) - 1
  const minPage = 0
  if (newValue > maxPage) {
    CurrentPage.value = maxPage
  }
  if (newValue < minPage) {
    CurrentPage.value = minPage
  }
  addLog({
    action: 'change_page',
    card: null,
    remainingSeconds: remainingSeconds.value,
    additional: {
      code: '2002',
      msg: '瀏覽頁數變更',
      data: {
        currentPage: oldValue,
        targetPage: CurrentPage.value,
      }
    }
  })

})

// 處理卡片翻轉事件 -> 更新卡片狀態並加入日誌
const handleCardFlip = ({ cardName, isFold, imagePath }) => {
  // 使用新的日誌管理功能
  addLog({
    action: 'flip',
    card: cardName,
    remainingSeconds: remainingSeconds.value,
    additional: {
      status: isFold,
      imagePath: imagePath
    }
  });

  // 根據 cardName 更新 cards_status
  const cardIndex = cards_pool.value.findIndex((card) => card === imagePath);
  if (cardIndex !== -1) {
    cards_status.value[cardIndex] = isFold; // 更新對應的狀態
  }

  // 更新 store 狀態
  cardsStore.updateCards(cards_pool.value, cards_status.value, getLogs(), CurrentPage.value);
}


// 處理暫存按鈕 -> 儲存卡片狀態
const handleSave = () => {
  // 儲存邏輯
  cardsStore.saveCards(cards_pool.value, cards_status.value, getLogs(), CurrentPage.value)
}

// 處理完成按鈕 -> 發出 emit 事件
const handleFinish = () => {
  let submitCheck = false;
  const warningCount = examProcessStore.computedPickGoalStage === 1 ? 10 : examProcessStore.computedPickGoalStage === 2 ? 3 : 0;
  const warningStageText = examProcessStore.computedPickGoalStage === 1 ? '第二階段' : examProcessStore.computedPickGoalStage === 2 ? '第三階段' : '第一階段';
  if (props.type === 'goal') {
    if (examProcessStore.computedPickGoalStage === 1) {
      if(keepCardsNum.value <= 10 && keepCardsNum.value > 1) {
        submitCheck = true;
      }
    } else if (examProcessStore.computedPickGoalStage === 2) {
      if(keepCardsNum.value <= 3 && keepCardsNum.value > 1) {
        submitCheck = true;
      }
    } else {
      submitCheck = true;
    }
  } else {
    submitCheck = true;
  }

  if(submitCheck) {
    isFinish.value = true
    // 發出 emit 事件
    addLog({
      action: 'finish',
      card: null,
      remainingSeconds: remainingSeconds.value,
      additional: {
        code: '2001',
        msg: '完成卡片選擇'
      }
    })
    emit('finish', {
      cards_pool: cards_pool.value,
      cards_status: cards_status.value,
      logs: getLogs(),
      current_page: CurrentPage.value,
      keep_cards: filterKeepCards.value,
      isFinished: true,
      canTest: false
    })
    stopTimer()
    clearLogs()
  } else {
    handleAlert({
      auction: 'warning',
      text: `${warningStageText}: 請至多保留 ${warningCount} 張卡片，目前保留 ${keepCardsNum.value} 張卡片，至少要保留 2 張卡片。`
    })
  }
}



// 生命週期鉤子
onMounted(() => {
  setTimer(props.countdownSeconds)
  startTimer()
  setProcessType(props.type)
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
        v-show="!isFinish"
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
            :freeze="isFinish"
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
        <!-- TODO: 完成按鈕 -->
        <v-col cols="3">
          <v-btn
            rounded="xl"
            color="#FA5015"
            text="*我憧憬的職業"
            size="large"
            block
          />
        </v-col>
        <!-- TODO: 暫存按鈕 -->
        <v-col cols="2">
          <v-btn
            rounded="xl"
            color="#FA5015"
            text="*暫存"
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
            v-show="!isFinish"
            rounded="xl"
            color="green"
            text="完成卡片選擇"
            size="large"
            block
            @click="handleFinish"
          />
        </v-col>
        <v-col cols="3">
          <div class="d-flex justify-left align-center pt-3">
            <span class="text-h6 text-primary">保留：{{ keepCardsNum }}</span>
            <span class="text-h6 text-red pl-4">全部：{{ currentCardPoolNum }}</span>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="1">
          <v-btn
            :disabled="CurrentPage === 0"
            icon="mdi-chevron-left"
            color="#FA5015"
            @click="CurrentPage--"
          />
        </v-col>
        <v-col cols="1">
          <v-btn
            :disabled="isLastPage"
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
                :src="guideInfo.coverImg"
                class="card-case"
              >
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="d-flex justify-center align-center">
              <p class="case-title">
                {{ guideInfo.title }}
              </p>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="d-flex justify-center align-center">
              <p class="case-subtitle">
                {{ guideInfo.subtitle }}
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
                  v-html="guideInfo.content"
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
