<template>
  <AppHeader />
  <AppNavigation v-if="appStore.isLogin" />
  <v-main>
    <router-view />
    <AppFooter1 />
  </v-main>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
const appStore = useAppStore()

onMounted(() => {
  console.log(appStore.isLogin)
})
</script>
