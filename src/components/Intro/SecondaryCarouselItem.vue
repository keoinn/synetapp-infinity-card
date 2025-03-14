<script setup>
import CardCarouselView from '@/components/Intro/CardCarouselView.vue'

import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'

const images = [caseCare, caseCe, caseCj, caseGoal]
</script>

<template>
  <div>
    <h1>Secondary Carousel Item</h1>
    <CardCarouselView :images="images" />
  </div>
</template>



