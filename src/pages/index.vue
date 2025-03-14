<script setup>
</script>

<template>
  <!-- height="75vh" -->
  <v-carousel
    height="100%"
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
    <v-carousel-item align="center">
      <SecondaryCarouselItem />
    </v-carousel-item>
    <v-carousel-item align="center">
      <ThirdCarouselItem />
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss" scoped>
:deep(.v-carousel__controls__item) {
  color: #FA5015 !important;
}
</style>
