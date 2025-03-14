<script setup>
import demo from '@/assets/images/intro/demo.webp'
import sponsor1 from '@/assets/wepro-logo.webp'
import sponsor2 from '@/assets/logo.png'
</script>

<template>
  <div class="third-carousel-item">
    <v-carousel
      height="500px"
      hide-delimiters
      show-arrows="hover"
      cycle
    >
      <v-carousel-item>
        <v-card class="intro-card">
          <v-row>
            <v-spacer />
            <v-col
              cols="5"
              align="start"
            >
              <v-card-title>
                <h2>林世莉 心理師</h2>
                <h3>從事諮商輔導工作超過30年以上</h3>
              </v-card-title>
              <v-card-text>
                <ul class="intro-card-text-list">
                  <li>啟宗心理諮商所所長</li>
                  <li>諮商公會全國聯會監事</li>
                  <li>台北市諮商公會監事</li>
                  <li>台灣全省各地就業服務站個管員督導/心理師</li>
                  <li>勞動部銀髮人才資源中心特約心理師</li>
                  <li>前救國團張老師基金會心理師/督導/部門長</li>
                  <li>台灣各企業員工協助方案主要推動人之一</li>
                  <li>各大學授課生涯規劃</li>
                </ul>
              </v-card-text>
            </v-col>
            <v-col cols="6">
              <img
                :src="demo"
                width="100%"
              >
            </v-col>
            <v-spacer />
          </v-row>
        </v-card>
      </v-carousel-item>
    </v-carousel>

    <v-card class="mt-10">
      <v-card-title class="d-flex justify-start">
        <h3>合作夥伴</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="2">
            <v-img
              :src="sponsor1"
              width="100px"
            />
          </v-col>
          <v-col cols="2">
            <v-img
              :src="sponsor2"
              width="100px"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.third-carousel-item {
  max-width: 1200px;

  .intro-card {
    height: 500px;
    border-radius: 40px;
    background-color: #d9d9d9;
    padding-left: 50px;
    padding-top: 20px;
    display: flex;
    align-items: center;
    color: blue;

    .intro-card-text-list {
      font-size: 20px;
      list-style-type: none;
    }
  }
}
</style>
