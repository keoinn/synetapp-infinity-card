<script setup></script>

<template>
  <!-- height="75vh" -->
  <v-hover v-slot="{ isHovering, props }">
    <v-carousel
      height="100%"
      direction="vertical"
      vertical-delimiters="right"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-square"
      delimiter-icon-color="green"
      v-bind="props"
      :cycle="!isHovering"
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
  </v-hover>
</template>

<style lang="scss" scoped>
:deep(.v-carousel__controls__item) {
  color: #fa5015 !important;
}
</style>
