<script setup>
/**
 * SingleExamPanel 組件顯示單一測驗面板。
 *
 * 此組件根據傳入的 `case` 和 `action` 屬性顯示不同的圖像和文本。
 *
 * 組件接收以下屬性：
 * - case: 字串，表示測驗類型，必填。可選值包括 'care', 'ce', 'cj', 'le', 'lj', 'goal'。
 * - action: 字串，表示操作類型，默認為 'pick'。可選值包括 'pick' 和 'pair'。
 *
 * @component
 * @example
 * <SingleExamPanel case="care" action="pick" />
 */
import { computed } from 'vue'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'

import { useExamProcessStore } from '@/stores/examProcess'

const examProcessStore = useExamProcessStore()

const props = defineProps({
  case: {
    type: String,
    default: '' // care, ce, cj, le, lj, goal
  },
  action: {
    type: String,
    default: 'pick' // pick, pair
  },
  finished: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: ''
  },
  stage: {
    type: Number,
    default: 0
  }
})

const caseImage = computed(() => {
  if (props.action === 'pick') {
    return props.case === 'care'
      ? caseCare
      : props.case === 'ce'
      ? caseCe
      : props.case === 'cj'
      ? caseCj
      : props.case === 'le'
      ? caseLe
      : props.case === 'lj'
      ? caseLj
      : props.case === 'goal'
      ? caseGoal
      : ''
  } else if (props.action === 'pair') {
    return props.case === 'care'
      ? caseCare
      : props.case === 'ce'
      ? caseCe
      : props.case === 'cj'
      ? caseCj
      : props.case === 'le'
      ? caseLe
      : props.case === 'lj'
      ? caseLj
      : ''
  } else {
    return ''
  }
})

const caseName = computed(() => {
  if (props.action === 'pick') {
    return props.case === 'care'
      ? '我在乎'
      : props.case === 'ce'
      ? '我可以 (國小)'
      : props.case === 'cj'
      ? '我可以'
      : props.case === 'le'
      ? '我喜歡 (國小)'
      : props.case === 'lj'
      ? '我喜歡'
      : props.case === 'goal'
      ? '我就是'
      : 'Error'
  } else if (props.action === 'pair') {
    return props.case === 'care'
      ? '我就是&我在乎'
      : props.case === 'ce'
      ? '我就是&我可以 (國小)'
      : props.case === 'cj'
      ? '我就是&我可以'
      : props.case === 'le'
      ? '我就是&我喜歡 (國小)'
      : props.case === 'lj'
      ? '我就是&我喜歡'
      : 'Error'
  } else {
    return ''
  }
})

const caseSubtitle = computed(() => {
  if (props.action === 'pick') {
    return props.case === 'care'
      ? '我重視的價值觀'
      : props.case === 'ce'
      ? '我擁有的能力'
      : props.case === 'cj'
      ? '我擁有的能力'
      : props.case === 'le'
      ? '我喜歡的事物'
      : props.case === 'lj'
      ? '我喜歡的事物'
      : props.case === 'goal'
      ? '我憧憬的職業'
      : 'Error'
  } else if (props.action === 'pair') {
    return props.case === 'care'
      ? '與職業配對我重視的價值觀'
      : props.case === 'ce'
      ? '與職業配對我擁有的能力'
      : props.case === 'cj'
      ? '與職業配對我擁有的能力'
      : props.case === 'le'
      ? '與職業配對我喜歡的事物'
      : props.case === 'lj'
      ? '我喜歡的事物'
      : ''
  } else {
    return ''
  }
})

const chipText = computed(() => {
  if (props.stage === 0) {
    return '第一階段'
  } else if (props.stage === 1) {
    return '第二階段'
  } else if (props.stage === 2) {
    return '第三階段'
  } else {
    return '全部完成'
  }
})

const checkFinishedWithGoal = computed(() => {
  if (props.action === 'pick') {
    return true
  } else {
    if (!examProcessStore.pick_goal.isFinished) {
      return false
    } else {
      switch (props.case) {
        case 'care':
          return examProcessStore.pick_care.isFinished
        case 'ce':
          return examProcessStore.pick_ce.isFinished
        case 'cj':
          return examProcessStore.pick_cj.isFinished
        case 'le':
          return examProcessStore.pick_le.isFinished
        case 'lj':
          return examProcessStore.pick_lj.isFinished
        default:
          return false
      }
    }
  }
})

const checkFinished = computed(() => {
  if (props.action === 'pick') {
    switch (props.case) {
      case 'goal':
        return examProcessStore.pick_goal.isFinished
      case 'care':
        return examProcessStore.pick_care.isFinished
      case 'ce':
        return examProcessStore.pick_ce.isFinished
      case 'cj':
        return examProcessStore.pick_cj.isFinished
      case 'le':
        return examProcessStore.pick_le.isFinished
      case 'lj':
        return examProcessStore.pick_lj.isFinished
      default:
        return false
    }
  } else {
    switch (props.case) {
      case 'care':
        return examProcessStore.pair_care.isFinished
      case 'ce':
        return examProcessStore.pair_ce.isFinished
      case 'cj':
        return examProcessStore.pair_cj.isFinished
      case 'le':
        return examProcessStore.pair_le.isFinished
      case 'lj':
        return examProcessStore.pair_lj.isFinished
      default:
        return false
    }
  }
})
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col v-if="props.action === 'pair'">
          <v-img
            :src="caseGoal"
            height="150"
          />
        </v-col>
        <v-col>
          <v-img
            :src="caseImage"
            :height="props.action === 'pair' ? '150' : '130'"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-title class="card-title">
      {{ caseName }}
      <v-chip
        v-show="props.case === 'goal' && props.stage < 3 && props.stage !== -1"
        size="x-small"
        color="primary"
      >
        {{ chipText }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle class="card-subtitle">
      {{ caseSubtitle }}
    </v-card-subtitle>
    <v-card-actions
      v-if="checkFinishedWithGoal"
      class="card-action"
    >
      <v-btn
        variant="tonal"
        rounded="xl"
        color="#FA5015"
        text="觀看紀錄"
      />
      <v-spacer />
      <v-btn
        variant="elevated"
        rounded="xl"
        color="#FA5015"
        :text="checkFinished ? '已完成' : '開始測驗'"
        :disabled="checkFinished"
        :to="
          props.action === 'pick'
            ? `/exam/pick/${props.case}/${props.token}`
            : `/exam/pair/${props.case}/${props.token}`
        "
      />
    </v-card-actions>
    <v-card-actions
      v-else
      class="card-action-disabled"
    >
      <v-spacer />
      <v-btn
        variant="elevated"
        rounded="xl"
        color="#FA5015"
        block
        disabled
        text="請先完成前一階段測試"
      />
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.card-action {
  margin-top: -5px;
  margin-bottom: 10px;
  color: white;
}
.card-action-disabled {
  margin-top: -5px;
  margin-bottom: 10px;
  color: white;
  padding-right: 20px;
  padding-left: 10px;
}
.card-title {
  margin-top: -15px;
  font-weight: bold;
}
.card-subtitle {
  margin-top: -10px;
  font-weight: bold;
}
</style>
