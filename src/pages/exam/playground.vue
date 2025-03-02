<template>
  <div class="playground">
    <CardPlayground
      :type="cardType"
      :cards-pool="cardsPool"
      :cards-status="cardsStatus"
      @finish="handleFinish"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CardPlayground from '@/components/playground/CardPlayground.vue'

// 定義卡片類型和狀態
const cardType = ref('le') // 可以根據需要更改
const cardsPool = ref([]) // 初始為空，根據需求填充
const cardsStatus = ref([]) // 初始為空，根據需求填充

// 處理完成事件
const handleFinish = (data) => {
  console.log('完成卡片選擇:', data)
  // 在這裡可以進行進一步的處理，例如發送到後端
}
</script>

<style lang="scss" scoped>
.playground {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 