<template>
  <div
    v-show="!isLoading"
    class="text-center"
  >
    <v-progress-circular
      :model-value="processValue"
      :rotate="360"
      :size="100"
      :width="15"
      color="deep-orange-lighten-2"
    >
      <template #default>
        {{ processValue }} %
      </template>
    </v-progress-circular>
  </div>

  <img
    v-for="(image, index) in newImages"
    v-show="isLoading"
    :key="index"
    :src="image"
    :style="{ width: '30px' }"
    @load="handleLoad"
  >
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

// 使用 glob 导入所有图片
const images = import.meta.glob('@/assets/images/*.webp', { eager: true })

const newImages = ref([])
const loaded = ref(0)
const isLoading = ref(false)

const preloadImages = async () => {
  return Object.values(images).map((module) => module.default)
}

const handleLoad = () => {
  setTimeout(() => {
    loaded.value++
  }, 50)
}

const processValue = computed(() => {
  return Math.round((loaded.value / Object.keys(images).length) * 100)
})

watch(
  () => processValue.value,
  (value) => {
    if (value === 100) {
      setTimeout(() => {
        isLoading.value = true
      }, 300)
    }
  }
)

onMounted(async () => {
  newImages.value = await preloadImages()
})
</script>

<style scoped lang="scss">
.v-progress-circular {
  position: fixed;
  top: 30%;
  left: 50%;
  z-index: 1000;
}
</style>
