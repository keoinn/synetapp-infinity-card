<template>
  <div 
    class="flip-card" 
    :class="{ 'is-flipped': isFold }"
    @click="handleClick"
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
  },
  cardDraggable: {
    type: Boolean,
    default: false  // 預設值為 false
  }
})

const emit = defineEmits(['cardFlipped', 'toggleDrag'])

const isFold = ref(props.isFold)

// 監聽 props.isFold 的變化
watch(() => props.isFold, (newValue) => {
  isFold.value = newValue
})

const toggleFlip = () => {
  isFold.value = !isFold.value
  emit('cardFlipped', {
    cardName: getCardImageName(props.image),
    isFold: isFold.value,
    imagePath: props.image
  })
}

const toggleDrag = () => {
  emit('toggleDrag', {
    cardName: getCardImageName(props.image),
    imagePath: props.image
  })
}

const handleClick = () => {
  if (props.cardDraggable) {
    toggleDrag()
  } else {
    toggleFlip()
  }
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
