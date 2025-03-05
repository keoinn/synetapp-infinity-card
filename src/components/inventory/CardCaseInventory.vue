<script setup>
import { computed } from 'vue'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
const props = defineProps({
  cardCase: {
    type: String,
    required: true
  },
  inventory: {
    type: String,
    required: true
  },
  inDropArea: {
    type: Boolean,
    default: false
  }
})

const cardCaseText = computed(() => {
  return props.cardCase === 'goal'
    ? '我就是'
    : props.cardCase === 'care'
    ? '我在乎'
    : props.cardCase === 'ce'
    ? '我可以 (國小)'
    : props.cardCase === 'cj'
    ? '我可以 (社青)'
    : props.cardCase === 'le'
    ? '我喜歡 (國小)'
    : props.cardCase === 'lj'
    ? '我喜歡 (社青)'
    : ''
})

const caseImage = computed(() => {
  return props.cardCase === 'goal'
    ? caseGoal
    : props.cardCase === 'care'
    ? caseCare
    : props.cardCase === 'ce'
    ? caseCe
    : props.cardCase === 'cj'
    ? caseCj
    : props.cardCase === 'lj'
    ? caseLj
    : props.cardCase === 'le'
    ? caseLe
    : ''
})

const emit = defineEmits(['updateInventory', 'removeCard'])

const handleBuyCard = () => {
  emit('updateInventory', props.cardCase)
}
</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon>mdi-cards-playing</v-icon>
      {{ cardCaseText }}
    </v-card-title>
    <v-card-text>
      <v-img
        :src="caseImage"
        :height="130"
        :draggable="false"
      />
    </v-card-text>
    <v-card-actions>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <v-btn
          v-if="!inDropArea"
          variant="tonal"
          color="primary"
          @click="handleBuyCard"
        >
          購買卡牌
        </v-btn>
        <v-spacer />
        <v-chip v-if="!inDropArea"> 庫存 {{ inventory }} </v-chip>
        <v-btn
          v-if="inDropArea"
          color="error"
          variant="tonal"
          block
          @click="emit('removeCard', props.cardCase)"
        >
          移除
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card {
  width: 200px;
  height: 250px;
}
</style>
