<script setup>
/**
 * 單一測驗面板組件
 * 
 * 此組件顯示單一測驗項目的卡片面板，根據傳入的測驗類型和操作模式顯示對應的圖像、標題和操作按鈕。
 * 支援兩種操作模式：
 * - 進行測驗 (pick)：顯示單一測驗類型的卡片，包括 care, ce, cj, le, lj, goal
 * - 卡牌配對 (pair)：顯示 goal 與其他測驗類型的配對卡片，包括 care, ce, cj, le, lj
 * 
 * @component SingleExamPanel
 * 
 * @props
 * - case: {String} 測驗類型，可選值：'care', 'ce', 'cj', 'le', 'lj', 'goal'，默認為空字串
 * - action: {String} 操作類型，可選值：'pick'（進行測驗）、'pair'（卡牌配對），默認為 'pick'
 * - finished: {Boolean} 是否已完成，默認為 false
 * - token: {String} 參與者 token，用於路由導航，默認為空字串
 * - stage: {Number} 測驗階段（僅用於 goal 類型），0-2 表示不同階段，默認為 0
 * 
 * @computed
 * - caseImage: 根據 case 和 action 返回對應的測驗類型圖片
 * - caseName: 根據 case 和 action 返回對應的測驗名稱（多語言）
 * - caseSubtitle: 根據 case 和 action 返回對應的測驗副標題（多語言）
 * - chipText: 根據 stage 返回對應的階段標籤文字（僅用於 goal 類型）
 * - checkFinishedWithGoal: 檢查是否已完成前置條件（pair 模式需要先完成 goal）
 * - checkFinished: 檢查當前測驗是否已完成
 * 
 * @features
 * - 根據測驗類型動態顯示對應圖片和文字
 * - 支援多語言顯示（使用 vue-i18n）
 * - 自動檢查測驗完成狀態，控制按鈕啟用/禁用
 * - pair 模式會檢查是否已完成 goal 測驗作為前置條件
 * - goal 類型支援階段標籤顯示（Stage 1-3）
 * - 根據完成狀態顯示不同的按鈕文字和狀態
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理，用於檢查各測驗的完成狀態
 * - vue-i18n - 用於多語言支援
 * - @/assets/images/case/* - 測驗類型圖片資源
 * 
 * @usedBy
 * - @/pages/exam/[token].vue
 * 
 * @example
 * // 進行測驗模式
 * <SingleExamPanel case="care" action="pick" :token="participantToken" />
 * 
 * // 卡牌配對模式
 * <SingleExamPanel case="care" action="pair" :token="participantToken" />
 * 
 * // goal 類型帶階段標籤
 * <SingleExamPanel case="goal" action="pick" :token="participantToken" :stage="1" />
 */
import { computed } from 'vue'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
import { useI18n } from 'vue-i18n'
import { useExamProcessStore } from '@/stores/examProcess'

const { t } = useI18n()
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
      ? t('product.care')
      : props.case === 'ce'
      ? t('product.ce')
      : props.case === 'cj'
      ? t('product.cj')
      : props.case === 'le'
      ? t('product.le')
      : props.case === 'lj'
      ? t('product.lj')
      : props.case === 'goal'
      ? t('product.goal')
      : 'Error'
  } else if (props.action === 'pair') {
    return props.case === 'care'
      ? t('product.goal') + ' & ' + t('product.care')
      : props.case === 'ce'
      ? t('product.goal') + ' & ' + t('product.ce')
      : props.case === 'cj'
      ? t('product.goal') + ' & ' + t('product.cj')
      : props.case === 'le'
      ? t('product.goal') + ' & ' + t('product.le')
      : props.case === 'lj'
      ? t('product.goal') + ' & ' + t('product.lj')
      : 'Error'
  } else {
    return ''
  }
})

const caseSubtitle = computed(() => {
  if (props.action === 'pick') {
    return props.case === 'care'
      ? t('playground.CareSubTitle')
      : props.case === 'ce'
      ? t('playground.CanSubTitle')
      : props.case === 'cj'
      ? t('playground.CanSubTitle')
      : props.case === 'le'
      ? t('playground.LikeSubTitle')
      : props.case === 'lj'
      ? t('playground.LikeSubTitle')
      : props.case === 'goal'
      ? t('playground.GoalSubTitle')
      : 'Error'
  } else if (props.action === 'pair') {
    return props.case === 'care'
      ? t('playground.PairCareSubTitle')
      : props.case === 'ce'
      ? t('playground.PairCanSubTitle')
      : props.case === 'cj'
      ? t('playground.PairCanSubTitle')
      : props.case === 'le'
      ? t('playground.PairLikeSubTitle')
      : props.case === 'lj'
      ? t('playground.PairLikeSubTitle')
      : ''
  } else {
    return ''
  }
})

const chipText = computed(() => {
  if (props.stage === 0) {
    return t('playground.GoalStage1')
  } else if (props.stage === 1) {
    return t('playground.GoalStage2')
  } else if (props.stage === 2) {
    return t('playground.GoalStage3')
  } else {
    return t('playground.AllFinished')
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
      <!-- TODO: 查看紀錄按鈕，先隱藏 -->
      <v-btn
        v-show="false"
        variant="tonal"
        rounded="xl"
        color="#FA5015"
        :text="t('playground.viewRecordBtn')"
      />
      <v-spacer />
      <v-btn
        variant="elevated"
        rounded="xl"
        color="#FA5015"
        :text="checkFinished ? t('playground.completed') : t('playground.startExamBtn')"
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
        :text="t('playground.NeedToCompletePreviousStage')"
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
