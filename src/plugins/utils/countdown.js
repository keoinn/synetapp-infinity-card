import { ref, computed } from 'vue'

export const useCountdown = (initialSeconds) => {
  const remainingSeconds = ref(initialSeconds)
  let timerInterval = null

  // 格式化時間為 mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSecs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
  }

  // 使用 computed 來響應 remainingSeconds 的變化
  const formattedTime = computed(() => formatTime(remainingSeconds.value))

  // 開始倒數
  const startTimer = () => {
    if (timerInterval) return // 避免重複啟動

    timerInterval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
      } else {
        stopTimer()
      }
    }, 1000)
  }

  // 停止倒數
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  // 重設倒數
  const resetTimer = () => {
    stopTimer()
    remainingSeconds.value = initialSeconds
  }

  // 清理計時器
  const cleanup = () => {
    stopTimer()
  }

  return {
    remainingSeconds,
    formattedTime,  // 現在回傳 computed 值
    startTimer,
    stopTimer,
    resetTimer,
    cleanup
  }
}
