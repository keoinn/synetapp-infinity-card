<template>
  <div 
    class="flip-card" 
    :class="{ 'is-flipped': isFold }"
    @click="toggleFlip"
  >
    <div class="flip-card__front">
      <v-img :src="image" />
    </div>

    <div class="flip-card__back">
      <v-img :src="coverImages[getCardCoverImage(getCardImageName(image))]" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getCardImageName, getCardCoverImage } from '@/plugins/utils/psy_cards.js'
import general_a from '@/assets/images/covers/general_a.webp'
import general_c from '@/assets/images/covers/general_c.webp'
import general_e from '@/assets/images/covers/general_e.webp'
import general_i from '@/assets/images/covers/general_i.webp'
import general_r from '@/assets/images/covers/general_r.webp'
import general_s from '@/assets/images/covers/general_s.webp'
import goal_a from '@/assets/images/covers/goal_a.webp'
import goal_c from '@/assets/images/covers/goal_c.webp'
import goal_e from '@/assets/images/covers/goal_e.webp'
import goal_i from '@/assets/images/covers/goal_i.webp'
import goal_r from '@/assets/images/covers/goal_r.webp'
import goal_s from '@/assets/images/covers/goal_s.webp'

const coverImages = {
  'general_a': general_a,
  'general_c': general_c,
  'general_e': general_e,
  'general_i': general_i,
  'general_r': general_r,
  'general_s': general_s,
  'goal_a': goal_a,
  'goal_c': goal_c,
  'goal_e': goal_e,
  'goal_i': goal_i,
  'goal_r': goal_r,
  'goal_s': goal_s,
}

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  isFold: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isFold', 'cardFlipped'])

const isFold = ref(props.isFold)

// 監聽 props.isFold 的變化
watch(() => props.isFold, (newValue) => {
  isFold.value = newValue
})

const toggleFlip = () => {
  const newFoldState = !isFold.value
  isFold.value = newFoldState
  
  const cardName = getCardImageName(props.image)
  
  // 發送雙向綁定的 v-model 更新
  // emit('update:isFold', newFoldState)
  
  // 發送翻牌事件，包含卡片資訊
  emit('cardFlipped', {
    cardName,
    isFold: newFoldState,
    imagePath: props.image
  })
}
</script>

<style lang="scss" scoped>
.flip-card {
  width: 237px;
  height: 328px;
  perspective: 3200px;
  position: relative;
  cursor: pointer;

  &__front,
  &__back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    transition: transform 0.5s ease-in-out;
    backface-visibility: hidden;
  }

  &__front {
    transform: rotateY(0deg);
  }

  &__back {
    transform: rotateY(-180deg);
  }

  &.is-flipped {
    .flip-card__front {
      transform: rotateY(180deg);
    }

    .flip-card__back {
      transform: rotateY(0deg);
    }
  }
}
</style>
