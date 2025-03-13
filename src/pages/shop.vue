<script setup>
import { ref } from 'vue'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'

const quantity_set1 = ref(0)
const quantity_set2 = ref(0)
const quantity_goal = ref(0)
const quantity_care = ref(0)
const quantity_ce = ref(0)
const quantity_cj = ref(0)
const quantity_le = ref(0)
const quantity_lj = ref(0)
</script>

<template>
  <div class="shop-page">
    <h1 class="shop-title">
      購買卡牌
    </h1>
    <v-row class="shop-page-row pb-10">
      <!-- 無限可能卡 - 社青版 -->
      <v-col cols="12">
        <v-card
          class="item-card-set"
          align="center"
        >
          <v-card-text>
            <v-row>
              <v-spacer />
              <v-col cols="2">
                <v-img
                  :src="caseGoal"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseCare"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseCj"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseLj"
                  class="item-img"
                />
              </v-col>
              <v-spacer />
            </v-row>
          </v-card-text>
          <v-card-title class="item-title">
            無限可能卡 - 社青版
          </v-card-title>
          <v-card-subtitle class="item-subtitle">
            售價: 2800 元
          </v-card-subtitle>
          <v-card-actions class="pt-3">
            <v-row align="center">
              <v-spacer />
              <v-col
                cols="1"
                class="mr-7"
              >
                <v-number-input
                  v-model="quantity_set1"
                  variant="outlined"
                  control-variant="split"
                  :min="0"
                  :max="99"
                  :step="1"
                  rounded="xl"
                  density="compact"
                />
              </v-col>
              <v-col
                cols="2"
                class="mb-6"
              >
                <v-btn
                  color="#000000"
                  variant="flat"
                  rounded="xl"
                  size="large"
                  text="立即購買"
                  block
                  density="compact"
                />
              </v-col>
              <v-spacer />
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 無限可能卡 - 國小版 -->
      <v-col cols="12">
        <v-card
          class="item-card-set"
          align="center"
        >
          <v-card-text>
            <v-row>
              <v-spacer />
              <v-col cols="2">
                <v-img
                  :src="caseGoal"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseCare"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseCe"
                  class="item-img"
                />
              </v-col>
              <v-col cols="2">
                <v-img
                  :src="caseLe"
                  class="item-img"
                />
              </v-col>
              <v-spacer />
            </v-row>
          </v-card-text>
          <v-card-title class="item-title">
            無限可能卡 - 國小版
          </v-card-title>
          <v-card-subtitle class="item-subtitle">
            售價: 2800 元
          </v-card-subtitle>
          <v-card-actions class="pt-3">
            <v-row align="center">
              <v-spacer />
              <v-col
                cols="1"
                class="mr-7"
              >
                <v-number-input
                  v-model="quantity_set2"
                  variant="outlined"
                  control-variant="split"
                  :min="0"
                  :max="99"
                  :step="1"
                  rounded="xl"
                  density="compact"
                />
              </v-col>
              <v-col
                cols="2"
                class="mb-6"
              >
                <v-btn
                  color="#000000"
                  variant="flat"
                  rounded="xl"
                  size="large"
                  text="立即購買"
                  block
                  density="compact"
                />
              </v-col>
              <v-spacer />
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 單一卡盒區 -->
      <v-col cols="12">
        <v-card class="item-single-card-container">
          <v-card-text>
            <v-row>
              <!-- 我就是 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section goal">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseGoal"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-goal" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我就是
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_goal"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="goal-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- 我在乎 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section care">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseCare"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-care" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我在乎
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_care"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="care-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- 我喜歡 - 社青版 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section lj">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseLj"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-lj" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我喜歡 (社青版)
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_lj"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="lj-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- 我喜歡 - 國小版 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section le">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseLe"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-le" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我喜歡 (國小版)
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_le"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="le-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- 我可以 - 社青版 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section cj">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseCj"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-cj" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我可以 (社青版)
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_cj"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="cj-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- 我可以 - 國小版 -->
              <v-col
                cols="4"
                align="center"
              >
                <v-card class="single-card-section ce">
                  <v-card-text>
                    <div class="image-container">
                      <img
                        :src="caseCe"
                        class="item-img"
                      >
                      <div class="circle-backdrop backdrop-ce" />
                    </div>
                  </v-card-text>
                  <v-card-title class="item-title">
                    我可以 (國小版)
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    售價: 790 元
                  </v-card-subtitle>
                  <v-card-actions class="pt-3">
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-spacer />
                      <v-col cols="3">
                        <v-number-input
                          v-model="quantity_ce"
                          variant="outlined"
                          control-variant="split"
                          :min="0"
                          :max="99"
                          :step="1"
                          rounded="xl"
                          density="compact"
                        />
                      </v-col>
                      <v-spacer />
                      <v-col
                        cols="2"
                        class="mb-6"
                      >
                        <v-btn
                          icon="mdi-cart-plus"
                          variant="outlined"
                          rounded="xl"
                          size="large"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        class="mb-6"
                      >
                        <v-btn
                          variant="flat"
                          rounded="xl"
                          size="large"
                          text="立即購買"
                          block
                          density="compact"
                          class="ce-btn"
                        />
                      </v-col>
                      <v-spacer />
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.shop-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1200px;
  max-width: 1200px;
  margin: 0 auto;

  .shop-title {
    font-weight: bold;
    margin-right: 80px;
  }

  .shop-page-row {
    width: 90%;
  }
  .item-card-set {
    // 組合商品
    border-radius: 20px;
    border: 5px solid #000000;

    .item-img {
      // 商品圖片
      border-radius: 10px;
    }

    .item-title {
      // 商品名稱
      font-weight: bold;
      font-size: 28px;
    }

    .item-subtitle {
      // 商品價格
      font-weight: bold;
      margin-top: -10px;
      font-size: 20px;
    }
  }

  .item-single-card-container {
    border-radius: 20px;
    border: 5px solid #000000;

    .single-card-section {
      border-width: 2px;
      border-style: solid;
      border-radius: 10px;
      min-width: 340px;
    }

    .image-container {
      position: relative;
    }

    .circle-backdrop {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 250px;
      background-color: lightblue;
      border-radius: 50%;
      z-index: -1;

      &.backdrop-goal {
        background-color: #CBFFC6;
      }

      &.backdrop-care {
        background-color: #FFA3B8;
      }

      &.backdrop-lj {
        background-color: #FFF489;
      }

      &.backdrop-le {
        background-color: #FFC386;
      }

      &.backdrop-cj {
        background-color: #789BFF;
      }

      &.backdrop-ce {
        background-color: #C496FF;
      }

    }

    .item-img {
      border-radius: 10px;
      width: 200px;
    }

    .item-title {
      font-weight: bold;
      font-size: 28px;
    }

    .item-subtitle {
      font-weight: bold;
      font-size: 20px;
      margin-top: -10px;
    }

    .goal {
      border-color: #007f5b;
      color: #007f5b;
    }

    .care {
      border-color: #FF3867;
      color: #FF3867;
    }

    .lj {
      border-color: #F0E154;
      color: #000000;
    }

    .le {
      border-color: #F95C00;
      color: #F95C00;
    }

    .cj {
      border-color: #0042FF;
      color: #0042FF;
    }

    .ce {
      border-color: #7100FF;
      color: #7100FF;
    }
    
    

    .goal-btn {
      background-color: #007f5b;
      color: #ffffff;
    }

    .care-btn {
      background-color: #FF3867;
      color: #ffffff;
    }

    .lj-btn {
      background-color: #F0E154;
      color: #000000;
    }

    .le-btn {
      background-color: #F95C00;
      color: #ffffff;
    }

    .cj-btn {
      background-color: #0042FF;
      color: #ffffff;
    }

    .ce-btn {
      background-color: #7100FF;
      color: #ffffff;
    }

    

  }
}

::v-deep(.v-number-input) {
  width: 100px;

  .v-btn--density-default {
    --v-btn-height: 20px;
  }
}

.v-number-input * {
  --v-input-control-height: 30px;
  --v-input-padding-top: 0px;
  --v-field-input-padding-bottom: 0px;
  --v-field-padding-bottom: 0px;
}
</style>
