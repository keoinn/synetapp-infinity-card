import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCardsStore = defineStore('cards', () => {
  const cardsPool = ref([])
  const cardsStatus = ref([])
  const logs = ref([])
  const currentPage = ref(0)

  function updateCards(pool, status, log, page) {
    cardsPool.value = pool
    cardsStatus.value = status
    logs.value = log
    currentPage.value = page
  }

  function saveCards(pool, status, log, page) {
    // TODO: 儲存邏輯，例如發送 API 請求
    console.log('儲存卡片狀態:', { pool, status, log, page })
  }

  return {
    cardsPool,
    cardsStatus,
    logs,
    currentPage,
    updateCards,
    saveCards
  }
}) 