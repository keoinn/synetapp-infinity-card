/**
 * TimeRemainingBar 組件顯示剩餘時間的進度條。
 * 
 * 此組件接收兩個屬性：
 * - remainingSeconds: 剩餘的秒數，必填。
 * - countdownSeconds: 總倒計時的秒數，必填。
 * 
 * 組件計算剩餘時間的百分比並顯示進度條，並且在進度條旁邊顯示格式化的剩餘時間。
 * 
 * @component
 * @example
 * <TimeRemainingBar :remaining-seconds="30" :countdown-seconds="120" />
 */
<script setup>
import { formattedTime } from '@/plugins/utils/countdown.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  remainingSeconds: {
    type: Number,
    required: true
  },
  countdownSeconds: {
    type: Number,
    required: true
  }
})

const remainingProgress = computed(() => {
  return (props.remainingSeconds / props.countdownSeconds) * 100
})
</script>

<template>
  <v-row class="pa-0 ma-0">
    <v-spacer />
    <v-col cols="3">
      <span class="text-h6 progress-bar-title"> {{ t('playground.PlaygroundRemainingTime') }}: </span>
    </v-col>
    <v-col
      cols="8"
      class="progress-bar"
    >
      <v-progress-linear
        :model-value="remainingProgress"
        height="20"
        color="#FA5015"
        rounded="xl"
      />
    </v-col>
    <v-col cols="1">
      <span class="text-h6 progress-bar-time"> {{ formattedTime }}</span>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<style lang="scss" scoped>
.progress-bar {
  padding-top: 15px;
}

.progress-bar-title {
  padding-left: 45px;
}

.progress-bar-time {
  padding-left: 10px;
}
</style>
