<script setup>
import { computed } from 'vue'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    ? t('product.goal')
    : props.cardCase === 'care'
    ? t('product.care')
    : props.cardCase === 'ce'
    ? t('product.ce')
    : props.cardCase === 'cj'
    ? t('product.cj')
    : props.cardCase === 'le'
    ? t('product.le')
    : props.cardCase === 'lj'
    ? t('product.lj')
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
          {{ t('navigation.buyCards') }}
        </v-btn>
        <v-spacer />
        <v-chip v-if="!inDropArea">
          {{ t('common.stock') }} {{ inventory }}
        </v-chip>
        <v-btn
          v-if="inDropArea"
          color="error"
          variant="tonal"
          block
          @click="emit('removeCard', props.cardCase)"
        >
          {{ t('common.remove') }}
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
