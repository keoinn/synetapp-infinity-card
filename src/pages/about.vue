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
        <span>關於我們</span>
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <p>「無限可能卡」是由幾位資深的心理師、生涯專業機構及職涯評鑑架構電腦工程師</p>
        <p>共同結合創作，以諮商輔導生涯專業理論、Holland生涯興趣展論、Super五個發</p>
        <p>展階段與彩虹圖、Swain生涯規劃金三角及後現代正向心理學論焦點解諮商理論為</p>
        <p>根基，引導使用者對自我產生好奇心、對職涯資訊產生的強烈求知慾，開啟自我人</p>
        <p>生驚喜之旅。</p>
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
