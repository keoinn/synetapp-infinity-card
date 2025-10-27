<template>
  <AppHeader v-if="!isAdminPage" />
  <AppNavigation v-if="appStore.isLogin && !isAdminPage" />
  <v-main>
    <router-view />
    <AppFooter1 v-if="!isAdminPage" />
  </v-main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const route = useRoute()

// 檢查是否為 admin 頁面
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})
</script>
