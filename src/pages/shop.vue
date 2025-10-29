<script setup>
import { ref } from 'vue'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { useCartStore } from '@/stores/cart'
import { handleAlert } from '@/plugins/utils/alert'
import { useI18n } from 'vue-i18n'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()
const quantity_set1 = ref(0)
const quantity_set2 = ref(0)
const quantity_goal = ref(0)
const quantity_care = ref(0)
const quantity_ce = ref(0)
const quantity_cj = ref(0)
const quantity_le = ref(0)
const quantity_lj = ref(0)

const handleAddToCart = (target) => {
  switch (target) {
    case 'set1':
      if(quantity_set1.value > 0) {
        cartStore.addItem('set_j', quantity_set1.value, 2800)
      } else {
        cartStore.addItem('set_j', 1, 2800)
      }
      break;
    case 'set2':
      if(quantity_set2.value > 0) {
        cartStore.addItem('set_e', quantity_set2.value, 2800)
      } else {
        cartStore.addItem('set_e', 1, 2800)
      }
      break;
    case 'goal':
      if(quantity_goal.value > 0) {
        cartStore.addItem(target, quantity_goal.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
    case 'care':
      if(quantity_care.value > 0) {
        cartStore.addItem(target, quantity_care.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
    case 'ce':
      if(quantity_ce.value > 0) {
        cartStore.addItem(target, quantity_ce.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
    case 'cj':
      if(quantity_cj.value > 0) {
        cartStore.addItem(target, quantity_cj.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
    case 'le':
      if(quantity_le.value > 0) {
        cartStore.addItem(target, quantity_le.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
    case 'lj':
      if(quantity_lj.value > 0) {
        cartStore.addItem(target, quantity_lj.value, 790)
      } else {
        cartStore.addItem(target, 1, 790)
      }
      break;
  }
  handleAlert({
    auction: 'success',
    text: t('order.addToCartSuccess')
  })
  
}

const handleBuyCard = (target) => {
  switch (target) {
    case 'set1':
      cartStore.addItem('set_j', 1, 2800)
      cartStore.butImmediate('set_j')
      break;
    case 'set2':
      cartStore.addItem('set_e', 1, 2800)
      cartStore.butImmediate('set_e')
      break;
    case 'goal':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
    case 'care':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
    case 'ce':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
    case 'cj':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
    case 'le':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
    case 'lj':
      cartStore.addItem(target, 1, 790)
      cartStore.butImmediate(target)
      break;
  }
  handleAlert({
    auction: 'success',
    text: t('order.addToCartAndCheckout')
  })
  router.push('/cart')
}
</script>

<template>
  <div class="shop-page">
    <v-btn
      class="back-button"
      :text="t('common.backToHome')"
      size="large"
      variant="tonal"
      prepend-icon="mdi-arrow-left"
      @click="router.push('/')"
    />
    <v-row class="shop-page-row pb-10">
      <v-col cols="12">
        <h1 class="page-title">
          {{ t('common.shop') }}
        </h1>
      </v-col>
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
            {{ t('common.infinityCard') }} - {{ t('product.adult') }}
          </v-card-title>
          <v-card-subtitle class="item-subtitle">
            {{ t('product.sellingPrice') }}: {{ t('product.adultPrice') }}
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
                cols="1"
                class="mb-6"
              >
                <v-btn
                  icon="mdi-cart-plus"
                  variant="outlined"
                  rounded="xl"
                  size="large"
                  density="compact"
                  @click="handleAddToCart('set1')"
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
                  :text="t('navigation.buyNow')"
                  block
                  density="compact"
                  @click="handleBuyCard('set1')"
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
            {{ t('common.infinityCard') }} - {{ t('product.child') }}
          </v-card-title>
          <v-card-subtitle class="item-subtitle">
            {{ t('product.sellingPrice') }}: {{ t('product.childPrice') }}
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
                cols="1"
                class="mb-6"
              >
                <v-btn
                  icon="mdi-cart-plus"
                  variant="outlined"
                  rounded="xl"
                  size="large"
                  density="compact"
                  @click="handleAddToCart('set2')"
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
                  :text="t('navigation.buyNow')"
                  block
                  density="compact"
                  @click="handleBuyCard('set2')"
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
                    {{ t('product.goal') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.goalPrice') }}
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
                          @click="handleAddToCart('goal')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="goal-btn"
                          @click="handleBuyCard('goal')"
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
                    {{ t('product.care') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.carePrice') }}
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
                          @click="handleAddToCart('care')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="care-btn"
                          @click="handleBuyCard('care')"
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
                    {{ t('product.lj') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.ljPrice') }}
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
                          @click="handleAddToCart('lj')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="lj-btn"
                          @click="handleBuyCard('lj')"
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
                    {{ t('product.le') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.lePrice') }}
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
                          @click="handleAddToCart('le')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="le-btn"
                          @click="handleBuyCard('le')"
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
                    {{ t('product.cj') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.cjPrice') }}
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
                          @click="handleAddToCart('cj')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="cj-btn"
                          @click="handleBuyCard('cj')"
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
                    {{ t('product.ce') }}
                  </v-card-title>
                  <v-card-subtitle class="item-subtitle">
                    {{ t('product.sellingPrice') }}: {{ t('product.cePrice') }}
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
                          @click="handleAddToCart('ce')"
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
                          :text="t('navigation.buyNow')"
                          block
                          density="compact"
                          class="ce-btn"
                          @click="handleBuyCard('ce')"
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
