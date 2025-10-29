<script setup>
import qrcode from '@/assets/images/intro/about-qrcode.webp'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div class="about-page">
    <v-btn
      class="back-button"
      :text="t('common.backToHome')"
      size="large"
      variant="tonal"
      prepend-icon="mdi-arrow-left"
      @click="router.push('/')"
    />
    <v-row>
      <v-col
        cols="12"
        class="page-title"
      >
        <span>{{ t('common.about') }}</span>
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <p v-html="t('intro.aboutUsContent')" />
      </v-col>
      <v-col
        cols="12"
        align="center"
        class="pt-10"
      >
        <img
          :src="qrcode"
          alt="about-image"
        >
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;

  .page-title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  .back-button {
    position: absolute;
    left: 220px;
    top: 70px;
  }
}
</style>
