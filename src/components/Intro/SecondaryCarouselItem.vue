<script setup>
/* eslint-disable vue/no-v-html */
import introGoal from '@/assets/images/intro/intro-goal.webp'
import introCare from '@/assets/images/intro/intro-care.webp'
import introLike from '@/assets/images/intro/intro-like.webp'
import introCan from '@/assets/images/intro/intro-can.webp'
import introRType from '@/assets/images/intro/intro-r.webp'
import introIType from '@/assets/images/intro/intro-i.webp'
import introAType from '@/assets/images/intro/intro-a.webp'
import introSType from '@/assets/images/intro/intro-s.webp'
import introEType from '@/assets/images/intro/intro-e.webp'
import introCType from '@/assets/images/intro/intro-c.webp'
import introRainbow from '@/assets/images/intro/intro-rainbow.webp'
import introTarget from '@/assets/images/intro/intro-target.webp'
import introTri from '@/assets/images/intro/intro-tri.webp'

import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { t } = useI18n()
const images = [caseCare, caseCe, caseCj, caseGoal]


const selectedTheory = ref(0)

// 使用 computed 讓 thoeryItems 能動態響應語言切換
const thoeryItems = computed(() => [
  {
    title: t('intro.hollandCareerInterestTheory')
  },
  {
    title: t('intro.superFiveDevelopmentStages')
  },
  {
    title: t('intro.focusProblemSolvingTheory')
  },
  {
    title: t('intro.swainCareerPlanningTriangle')
  }
])

const toggleSelection = (index) => {
  selectedTheory.value = index
}

// 计算属性，判断每个项是否被选中
const isSelected = (index) => computed(() => index === selectedTheory.value)
</script>

<template>
  <div class="secondary-page">
    <v-card class="page-card-container">
      <v-card-title>
        <h2>{{ t('intro.cardDesc') }}</h2>
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-spacer />
          <v-col cols="5">
            <CardCarouselView :images="images" />
          </v-col>
          <v-col cols="5">
            <v-row class="ma-0 pa-0">
              <v-col
                cols="6"
                class="ma-0 pa-0 pl-2"
              >
                <v-img :src="introGoal" />
              </v-col>
              <v-col
                cols="6"
                class="ma-0 pa-0 pl-2"
              >
                <v-img :src="introCan" />
              </v-col>
            </v-row>
            <v-row class="ma-0 pa-0 mt-2">
              <v-col
                cols="6"
                class="ma-0 pa-0 pl-2"
              >
                <v-img :src="introLike" />
              </v-col>
              <v-col
                cols="6"
                class="ma-0 pa-0 pl-2"
              >
                <v-img :src="introCare" />
              </v-col>
            </v-row>
          </v-col>
          <v-spacer />
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="page-card-container secondary-card-container mt-2 mb-5">
      <v-card-title>
        <h2>{{ t('intro.theoryDesc') }}</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            style="display: flex; justify-content: center"
          >
            <v-sheet style="background-color: #d9d9d9">
              <v-slide-group>
                <v-slide-group-item
                  v-for="(item, index) in thoeryItems"
                  :key="index"
                >
                  <v-btn
                    :color="isSelected(index).value ? 'primary' : undefined"
                    class="ma-2"
                    size="large"
                    rounded
                    @click="() => toggleSelection(index)"
                  >
                    <span v-html="item.title" :style="{ fontSize: appStore.locale === 'en' ? '14px' : '20px' }" />
                  </v-btn>
                </v-slide-group-item>
              </v-slide-group>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- 選擇的理論 -->
        <v-row
          v-show="selectedTheory === 0"
          align="center"
          justify="center"
          class="theory-intro-row"
        >
          <v-col cols="12">
            <v-row>
              <v-col cols="2">
                <v-img :src="introRType" />
              </v-col>
              <v-col cols="2">
                <v-img :src="introIType" />
              </v-col>
              <v-col cols="2">
                <v-img :src="introAType" />
              </v-col>
              <v-col cols="2">
                <v-img :src="introSType" />
              </v-col>
              <v-col cols="2">
                <v-img :src="introEType" />
              </v-col>
              <v-col cols="2">
                <v-img :src="introCType" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          v-show="selectedTheory === 1"
          align="center"
          justify="center"
          class="theory-intro-row"
        >
          <v-col cols="10">
            <v-card class="page-card-container">
              <v-card-title>
                <h3 v-html="t('intro.superFiveDevelopmentStagesDesc')" />
              </v-card-title>
              <v-card-text class="pt-5">
                <v-img
                  width="90%"
                  :src="introRainbow"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          v-show="selectedTheory === 2"
          align="center"
          justify="center"
          class="theory-intro-row"
        >
          <v-col cols="10">
            <v-card class="page-card-container">
              <v-card-title>
                <h3 v-html="t('intro.focusProblemSolvingTheoryDesc')" />
              </v-card-title>
              <v-card-text class="pt-5">
                <v-img
                  width="90%"
                  :src="introTarget"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          v-show="selectedTheory === 3"
          align="center"
          justify="center"
          class="theory-intro-row"
        >
          <v-col cols="10">
            <v-card class="page-card-container">
              <v-card-title>
                <h3 v-html="t('intro.swainCareerPlanningTriangleDesc')" />
              </v-card-title>
              <v-card-text class="pt-5">
                <v-img
                  width="90%"
                  :src="introTri"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.secondary-page {
  max-width: 1200px;

  .page-card-container {
    border-radius: 40px;

    &.secondary-card-container {
      background-color: #d9d9d9;
    }
  }

  .theory-intro-row {
    height: 430px;
  }
}
</style>
