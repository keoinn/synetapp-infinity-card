<template>
  <div style="max-width: 800px; position: relative">
    <div class="carousel-container">
      <div
        v-for="(image, index) in images"
        :key="index"
        :style="computeStyle(index)"
        class="carousel-item"
      >
        <v-img
          :src="image"
          :style="{ width: computeWidth(index), height: computeHeight(index) }"
        />
      </div>
    </div>
    <div class="nav-btn-container">
      <v-btn
        class="nav-btn"
        icon="mdi-chevron-left"
        color="green"
        size="x-small"
        @click="prev"
      />
      <span class="nav-btn-text"> 職業卡牌 </span>
      <v-btn
        class="nav-btn right"
        icon="mdi-chevron-right"
        color="green"
        size="x-small"
        @click="next"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

// 定义接收的 props
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
const carouselWidth = ref(0)

onMounted(() => {
  const carouselElement = document.querySelector('.carousel-container')
  if (carouselElement) {
    carouselWidth.value = carouselElement.clientWidth
  }
})

const computeStyle = (index) => {
  let x = 0,
    z = 0,
    y = 0,
    opacity = 1,
    zIndex = 0,
    width = '100%',
    height = '100%'
  const baseTranslateX = 100 // 使用 carousel-container 的宽度作为基础平移量
  const adjustValue = 100
  if (index === currentIndex.value) {
    x = 0
    z = 0
    y = 0
    zIndex = 10
    opacity = 1
  } else if (
    index === currentIndex.value - 1 ||
    (currentIndex.value === 0 && index === props.images.length - 1)
  ) {
    x = `calc(-${baseTranslateX}px - ${adjustValue}px)` // 100px 为调整值
    z = -400
    y = 0
    width = '400px'
    height = '200px'
    opacity = 0.5
  } else if (
    index === currentIndex.value + 1 ||
    (currentIndex.value === props.images.length - 1 && index === 0)
  ) {
    x = `calc(${baseTranslateX}px + ${adjustValue}px)` // 100px 为调整值
    z = -400
    y = 0
    width = '400px'
    height = '200px'
    opacity = 0.5
  } else {
    x = `calc(2 * ${baseTranslateX}px)` // 隐藏其他图片
    z = 0
    y = 0
    opacity = 0
  }

  return {
    transform: `translateX(${x}) translateZ(${z}px) rotateY(${y}deg)`,
    transition: 'transform 0.5s',
    opacity: opacity,
    zIndex: zIndex,
    width: width,
    height: height
  }
}

const computeWidth = (index) => {
  if (index === currentIndex.value - 1 || index === currentIndex.value + 1) {
    return '600px' // 固定左右两侧图片的宽度
  }
  return '100%' // 其他情况使用默认宽度
}

const computeHeight = (index) => {
  if (index === currentIndex.value - 1 || index === currentIndex.value + 1) {
    return '300px' // 固定左右两侧图片的高度
  }
  return '100%' // 其他情况使用默认高度
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}
</script>

<style scoped>
.carousel-container {
  position: relative;
  perspective: 1000px;
  height: 200px;
  overflow: hidden;
  background-color: lightblue;
  width: 400px;
}

.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-btn {
  transform: translateY(-50%);
}

.nav-btn-container {
  z-index: 20;
  padding-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.nav-btn-text {
  font-size: 20px;
  font-weight: 600;
  margin-top: -30px;
}

</style>
