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
    :style="{ width: '100px' }"
    @load="handleLoad"
    @click="handleClick(image)"
  >
</template>
<script setup>
import { ref, onMounted, computed, watch} from 'vue'
import { careImages, leImages, ljImages, ceImages, cjImages, goalImages } from '@/plugins/utils/psy_cards.js'
import { handleAlert } from '@/plugins/utils/alert.js'
import { combineAndShuffle, getCardImageName } from '@/plugins/utils/psy_cards.js'
const images = combineAndShuffle([...careImages, ...leImages, ...ljImages, ...ceImages, ...cjImages, ...goalImages])
const newImages = ref([])
const loaded = ref(0)
const isLoading = ref(false)



const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = resolve
        img.onerror = reject
      })
    })
  )
}

const handleLoad = () => {
  setTimeout(() => {
    loaded.value++
  }, 100)
}

const processValue = computed(() => {
  return Math.round((loaded.value / images.length) * 100)
})

watch(()=>processValue.value, (value) => {
  if (value === 100) {
    setTimeout(() => {
      isLoading.value = true
    }, 500)
  }
})

const handleClick = (image) => {
  const cardName = getCardImageName(image)
  handleAlert({
      auction: 'warning',
      text: '您選擇了' + cardName,
    })
}

onMounted(async () => {
  await preloadImages(images)
  newImages.value = images
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
