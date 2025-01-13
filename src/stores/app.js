// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDrawerOpen = ref(false)

  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
    console.log(isDrawerOpen.value)
  }

  return {
    isDrawerOpen,
    toggleDrawer
  }
}, {
  persist: true
})
