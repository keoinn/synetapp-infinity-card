<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
const appStore = useAppStore()
const router = useRouter()

onMounted(() => {
  if (appStore.isLogin) {
    router.push('/')
  }
})
</script>

<template>
  <LoginForm v-if="!appStore.isLogin" />
</template>
  