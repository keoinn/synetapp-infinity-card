<template>
  <LoginForm v-if="!appStore.isLogin" />
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>
