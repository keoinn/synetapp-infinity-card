import { ref, computed } from 'vue'
const remainingSeconds = ref(0)
let timerInterval = null

// 格式化時間為 mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSecs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
}

// 使用 computed 來響應 remainingSeconds 的變化
const formattedTime = computed(() => formatTime(remainingSeconds.value))

const startTimer = (action = null) => {
  if (timerInterval) return // 避免重複啟動

  if (action !== null){
    timerInterval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
      } else {
        stopTimer()
      }
    }, 1000)
  }
}

// 停止倒數
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 重設倒數
const resetTimer = (initialSeconds) => {
  stopTimer()
  remainingSeconds.value = initialSeconds
}

// 清理計時器
const cleanup = () => {
  stopTimer()
}

const setTimer = (initialSeconds) => {
  remainingSeconds.value = initialSeconds
}

export {
  remainingSeconds,
  formattedTime,
  startTimer,
  stopTimer,
  resetTimer,
  cleanup,
  setTimer
}