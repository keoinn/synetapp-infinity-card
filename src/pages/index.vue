<script setup>
</script>

<template>
  <v-carousel
    height="75vh"
    direction="vertical"
    vertical-delimiters="right"
    :show-arrows="false"
    hide-delimiter-background
    delimiter-icon="mdi-square"
    delimiter-icon-color="green"
  >
    <v-carousel-item align="center">
      <FirstCarouselItem />
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss" scoped>
:deep(.v-carousel__controls__item) {
  color: #FA5015 !important;
}
</style>
