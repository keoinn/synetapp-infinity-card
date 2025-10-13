<script setup>
// TODO: Emit: store
// TODO: DocString

import { ref, onMounted, computed, watch } from 'vue'
import { handleAlert } from '@/plugins/utils/alert.js'
import { getCardImageName } from '@/plugins/utils/psy_cards.js'
import { remainingSeconds, startTimer, stopTimer, setTimer } from '@/plugins/utils/countdown.js'
import { addLog, clearLogs, getLogs, setProcessType } from '@/plugins/utils/process_logger.js'

// 定義 emit
const emit = defineEmits(['finishClassify'])

// define props
const props = defineProps({
  /**
   * 職業列表
   * @typedef {Object} Profession
   * @property {string} title
   * @property {Array} cards
   * @property {string} class_img
   *
   * @example
   * const professions = ref([
   *   { title: '職業一', cards: [], class_img: goalImages[0] },
   *   { title: '職業二', cards: [], class_img: goalImages[1] },
   *   { title: '職業三', cards: [], class_img: goalImages[2] }
   * ])
   */
  professions: {
    type: Array,
    required: true
  },

  /**
   * 卡片池
   * @typedef {Array} CardPool
   * @property {string} image
   *
   * @example
   * const cardsPool = ref([
   *   { image: careImages[0] },
   *   { image: careImages[1] },
   *   { image: careImages[2] }
   * ])
   */
  cardsPool: {
    type: Array,
    default: () => []
  },

  /**
   * 倒數秒數
   * @typedef {Number} CountdownSeconds
   * @property {Number} value
   *
   * @example
   * const countdownSeconds = ref(300)
   */
  countdownSeconds: {
    type: Number,
    default: 480
  },

  /**
   * 卡片類型
   * @typedef {String} CardType
   * @property {String} value
   *
   * @example
   * const type = ref('care')
   */
  type: {
    type: String,
    required: true,
    validator: (value) => ['care', 'le', 'lj', 'ce', 'cj', 'goal'].includes(value)
  }
})

// define ref container
/**
 * 職業列表
 * @type {Ref<Profession[]>}
 * @Note 雖然職業列表是 props 傳入且是 ref，修改其值不能直接修改 props
 */
const professions = ref(props.professions)

/**
 * 卡片池
 * @type {Ref<CardPool[]>}
 * @Note 雖然卡片池是 props 傳入且是 ref，目前程式碼中沒有修改其值，所以可以不用 ref
 */
const currentCardPool = ref(props.cardsPool) // 卡片池

/**
 * 卡片分類列表
 * @type {Ref<number[]>}
 * @Note 用於紀錄分類順序，以提供還原功能 -1 表示未分類，其他數字表示分類至對應職業的 index
 */
const classifyList = ref(Array(props.cardsPool.length).fill(-1)) // 卡片分類列表

/**
 * 拖曳的卡片
 * @type {Ref<CardPool | null>}
 * @Note 當前拖曳的卡片對應圖片路徑
 */
const draggedCard = ref(null) // 拖曳的卡片

/**
 * 目前卡片序號
 * @type {Ref<number>}
 * @Note 用於紀錄目前卡片序號，用於計算剩餘卡片數量、卡片池、卡片狀態
 */
const currentSequence = ref(0) // 目前卡片序號

/**
 * UI 是否就緒
 * @type {Ref<boolean>}
 */
const isStart = ref(false) // UI 是否就緒

/**
 * 卡片狀態 (isFold)
 * @type {Ref<boolean[]>}
 * @Note isFold(True) 時以背面顯示，False 時以正面顯示
 */
const cards_status = ref(
  Array(props.cardsPool.length).fill(true) // 設置為 true
)

/**
 * 剩餘卡片數量
 * @type {ComputedRef<number>}
 */
const remainingCards = computed(() => {
  return currentCardPool.value.length - currentSequence.value
})

// Event Handler
/**
 * 拖曳卡片開始
 * @param {CardPool} card
 */
const handleDragStart = (card) => {
  draggedCard.value = card
}
/**
 * 完成卡片選擇
 */
const handleFinish = () => {
  handleAlert({
    auction: 'success',
    text: `你已經成功完成卡片選擇`
  })

  addLog({
    action: 'finish',
    card: null,
    remainingSeconds: remainingSeconds.value,
    additional: {
      code: '2001',
      msg: '完成卡片選擇'
    }
  })

  emit('finishClassify', {
    professions: professions.value,
    classifyList: classifyList.value,
    logs: getLogs(),
    cards_pool: currentCardPool.value,
    isFinished: true,
  })

  clearLogs()
  isStart.value = false
  stopTimer()
  document.body.setAttribute('ondragstart', 'return false')
}

/**
 * 復原上一個動作
 * @Note 1. 序號減 1
 *       2. 卡片狀態設為 False (正面顯示)
 *       3. 將卡片從對應職業的 cards 列表中移除
 *       4. 將分類序號設為 -1
 *       5. 將拖曳的卡片設為 null
 *       6. 紀錄 Log
 *       7. 顯示通知
 */
const handleRollback = () => {
  console.log('rollback')
  if (currentSequence.value > 0) {
    currentSequence.value--
    cards_status.value[currentSequence.value] = false

    addLog({
      action: 'rollback',
      card: currentCardPool.value[currentSequence.value],
      remainingSeconds: remainingSeconds.value,
      additional: {
        professionIndex: classifyList.value[currentSequence.value],
        profession: professions.value[classifyList.value[currentSequence.value]].title
      }
    })

    professions.value[classifyList.value[currentSequence.value]].cards.pop()
    classifyList.value[currentSequence.value] = -1
    draggedCard.value = null
    handleAlert({
      auction: 'success',
      text: `你已經成功復原上一個動作`
    })
  }
}

/**
 * 拖曳卡片到職業列表
 * @param {Event} event
 * @param {number} professionIndex
 * TODO: Emit -> toUseStore
 * @Note 完成拖曳卡片到職業列表
 *       - 1. 將卡片加入對應職業的 cards 列表 -> 顯示通知
 *           -> 紀錄分類
 *       - 2. 更新目前卡片序號
 *       - 3. 更新卡片狀態 -> 下一張卡片以正面顯示
 *       - 4. 移除當前被拖曳的卡片的響應式變數
 */
/**
 * 核心拖曳邏輯 - 將卡片放置到指定職業分類
 * @param {number} professionIndex - 職業分類索引
 * @param {string} actionType - 動作類型 ('drag' 或 'click')
 */
const performCardDrop = async (professionIndex, actionType = 'drag') => {
  if (draggedCard.value) {
    professions.value[professionIndex].cards.push(draggedCard.value)
    classifyList.value[currentSequence.value] = professionIndex

    // 使用新的日誌管理功能
    addLog({
      action: actionType,
      card: draggedCard.value,
      remainingSeconds: remainingSeconds.value,
      additional: {
        professionIndex: professionIndex,
        profession: professions.value[professionIndex].title
      }
    })

    const actionText = actionType === 'drag' ? '拖曳' : '點擊'
    handleAlert({
      auction: 'success',
      text: `你已經成功${actionText} ${getCardImageName(draggedCard.value)} 到 ${
        professions.value[professionIndex].title
      }`
    })
    currentSequence.value++
    cards_status.value[currentSequence.value] = false
    draggedCard.value = null
  }
}

/**
 * 處理拖曳放置事件
 * @param {Event} event - 拖曳事件
 * @param {number} professionIndex - 職業分類索引
 */
const handleDrop = async (event, professionIndex) => {
  event.preventDefault()
  await performCardDrop(professionIndex, 'drag')
}

/**
 * 處理點擊放置事件
 * @param {number} professionIndex - 職業分類索引
 */
const handleClickDrop = async (professionIndex) => {
  // 直接使用當前卡片，不需要依賴 draggedCard.value
  const currentCard = currentCardPool.value[currentSequence.value]
  if (currentCard) {
    professions.value[professionIndex].cards.push(currentCard)
    classifyList.value[currentSequence.value] = professionIndex

    // 使用新的日誌管理功能
    addLog({
      action: 'click',
      card: currentCard,
      remainingSeconds: remainingSeconds.value,
      additional: {
        professionIndex: professionIndex,
        profession: professions.value[professionIndex].title
      }
    })

    handleAlert({
      auction: 'success',
      text: `你已經成功點擊 ${getCardImageName(currentCard)} 到 ${
        professions.value[professionIndex].title
      }`
    })
    currentSequence.value++
    cards_status.value[currentSequence.value] = false
  }
}
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

// Life Cycle
/**
 * 掛載時要做的初始化
 * @Note - 1. 設置畫面允許拖曳功能
 *       - 2. 將第一張卡片以正面表示
 *       - 3. 設置 UI 就緒
 *       - 4. 設置倒數計時器
 */
onMounted(() => {
  setProcessType('classify')
  document.body.setAttribute('ondragstart', 'true')
  cards_status.value[currentSequence.value] = false
  // Start Exam
  isStart.value = true
  setTimer(props.countdownSeconds)
  startTimer(true)
  addLog({
    action: 'start',
    card: null,
    remainingSeconds: props.countdownSeconds,
    additional: {
      code: '2000',
      msg: '開始測驗'
    }
  })
})
</script>

<template>
  <div class="card-playground">
    <TimeRemainingBar
      v-show="isStart"
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
            @click="handleClickDrop(index)"
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
              transform: `translate(${index * 0.9}px, ${index * 0.5}px)` }"
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
        <div class="rollback">
          <v-btn
            v-show="currentSequence > 0 && isStart"
            rounded="xl"
            color="#FA5015"
            text="復原上一個動作"
            size="x-large"
            @click="handleRollback"
          />
        </div>
        <div
          v-show="isStart"
          class="card-count"
        >
          卡牌剩餘張數 <span class="card-count-number">{{ remainingCards }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.card-playground {
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
  z-index: 2000;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #1976d2;
    background-color: rgba(25, 118, 210, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
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

.rollback {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 65px;
  margin-bottom: 150px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
