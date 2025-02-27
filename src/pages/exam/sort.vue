<template>
  <div class="sort-page">
    <h1>卡片分類頁面</h1>
    <CardClassify />
  </div>
</template>

<script setup>
import CardClassify from '@/components/playground/CardClassify.vue';
</script>

<style scoped>
.sort-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
