<template>
  <div class="news-page">
    <v-btn
      class="back-button"
      :text="t('common.backToHome')"
      size="large"
      variant="tonal"
      prepend-icon="mdi-arrow-left"
      @click="router.push('/')"
    />
    <v-row>
      <v-col cols="12">
        <h1 class="page-title">
          {{ t('common.news') }}
        </h1>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.news-page {
  max-width: 1200px;
  margin: 0 auto;

  .page-title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }

  .back-button {
    position: absolute;
    left: 220px;
    top: 70px;
  }
}
</style>
