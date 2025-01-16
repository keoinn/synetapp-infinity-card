// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDrawerOpen = ref(false)
  const isLogin = ref(false)

  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
    console.log(isDrawerOpen.value)
  }

  function toggleLogin(account, password) {
    console.log(account, password)
    if (account === 'admin' && password === '123456') {
      isLogin.value = true
    } else {
      isLogin.value = false
    }
    console.log(isLogin.value)
  }

  function logout() {
    isLogin.value = false
  }

  return {
    isDrawerOpen,
    toggleDrawer,
    isLogin,
    toggleLogin,
    logout
  }
}, {
  persist: true
})
