<template>
  <div class="playcard-container">
    <CardSelectorView :card-type="cardType" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 從路由參數中獲取卡片類型
const cardType = computed(() => {
  // 從 URL 路徑中提取類型，例如 /exam/pick/goal/... -> goal
  const pathSegments = route.path.split('/')
  const pickIndex = pathSegments.indexOf('pick')
  return pickIndex !== -1 && pathSegments[pickIndex + 1] ? pathSegments[pickIndex + 1] : 'care'
})
</script>

<style lang="scss" scoped>
.playcard-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>