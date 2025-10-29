<script setup>
import { ref, computed } from 'vue'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { useCartStore } from '@/stores/cart'
import { handleAlert } from '@/plugins/utils/alert'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
import { getCardImagePath } from '@/utils/imageUtils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const selectedCard = ref('goal')
const quantity = ref(1)
const pageSubCard = ref(0)
const selectedSubCard = ref(null)

const optionsCardSet = computed(() => [
  {
    title: t('product.goalTitle') + ' - ' + t('product.goalPrice'),
    value: 'goal',
    image: caseGoal,
    price: 790,
    subCardImage: ['goal001.webp', 'goal002.webp', 'goal003.webp', 'goal004.webp', 'goal005.webp']
  },
  {
    title: t('product.careTitle') + ' - ' + t('product.carePrice'),
    value: 'care',
    image: caseCare,
    price: 790,
    subCardImage: ['care001.webp', 'care002.webp', 'care003.webp', 'care004.webp', 'care005.webp']
  },
  {
    title: t('product.cjTitle') + ' - ' + t('product.cjPrice'),
    value: 'cj',
    image: caseCj,
    price: 790,
    subCardImage: ['cj001.webp', 'cj002.webp', 'cj003.webp', 'cj004.webp', 'cj005.webp']
  },
  {
    title: t('product.ceTitle') + ' - ' + t('product.cePrice'),
    value: 'ce',
    image: caseCe,
    price: 790,
    subCardImage: ['ce001.webp', 'ce002.webp', 'ce003.webp', 'ce004.webp', 'ce005.webp']
  },
  {
    title: t('product.ljTitle') + ' - ' + t('product.ljPrice'),
    value: 'lj',
    image: caseLj,
    price: 790,
    subCardImage: ['lj001.webp', 'lj002.webp', 'lj003.webp', 'lj004.webp', 'lj005.webp']
  },
  {
    title: t('product.leTitle') + ' - ' + t('product.lePrice'),
    value: 'le',
    image: caseLe,
    price: 790,
    subCardImage: ['le001.webp', 'le002.webp', 'le003.webp', 'le004.webp', 'le005.webp']
  }
])

const getTotalPrice = computed(() => {
  const selectedItem = optionsCardSet.value?.find((item) => item.value === selectedCard.value)
  const price = selectedItem?.price || 0
  const qty = quantity.value || 0
  return qty * price
})

const handleSelectChange = () => {
  pageSubCard.value = 0
  selectedSubCard.value = null
}

const getCardImage = computed(() => {
  if (selectedSubCard.value === null) {
    return optionsCardSet.value?.find((item) => item.value === selectedCard.value)?.image
  } else {
    return selectedSubCard.value
  }
})

const getSubCardImage = computed(() => {
  return optionsCardSet.value
    ?.find((item) => item.value === selectedCard.value)
    ?.subCardImage.slice(pageSubCard.value * 3, (pageSubCard.value + 1) * 3)
    ?.map(imageName => getCardImagePath(imageName))
})

const handleSubCardChange = (direction) => {
  pageSubCard.value += direction
  if (pageSubCard.value < 0) {
    pageSubCard.value = 0
  }
  if (
    pageSubCard.value >
    optionsCardSet.value?.find((item) => item.value === selectedCard.value)?.subCardImage.length / 3 - 1
  ) {
    pageSubCard.value =
      optionsCardSet.value?.find((item) => item.value === selectedCard.value)?.subCardImage.length / 3 - 1
  }
}

const handleSubCardClick = (img) => {
  if (selectedSubCard.value === img) {
    selectedSubCard.value = null
  } else {
    selectedSubCard.value = img
  }
}

const handleAddToCart = () => {
  const selectedItem = optionsCardSet.value?.find((item) => item.value === selectedCard.value)
  const price = selectedItem?.price || 0
  cartStore.addItem(selectedCard.value, quantity.value, price)
  handleAlert({
    auction: 'success',
    text: t('order.addToCartSuccess')
  })
}

const handleBuyCard = () => {
  const selectedItem = optionsCardSet.value?.find((item) => item.value === selectedCard.value)
  const price = selectedItem?.price || 0
  cartStore.addItem(
    selectedCard.value,
    quantity.value,
    price, 
  )
  cartStore.butImmediate(selectedCard.value)
  handleAlert({
    auction: 'success',
    text: t('order.addToCartAndCheckout')
  })
  router.push('/cart')
}

const clickCardCase = (value) => {
  selectedCard.value = value
  selectedSubCard.value = null
}
</script>

<template>
  <div class="content-page first-page">
    <v-card class="first-page-item">
      <v-row
        align="start"
        class="first-row"
      >
        <v-spacer />

        <!-- 卡片圖片 -->
        <v-col cols="5">
          <v-card class="component-radius">
            <v-card-text>
              <img
                :src="getCardImage"
                width="300px"
                height="450px"
                class="component-radius"
              >
            </v-card-text>
          </v-card>

          <v-row
            class="pt-5"
            align="center"
            justify="center"
          >
            <v-btn
              icon="mdi-menu-left"
              size="small"
              color="green"
              @click="handleSubCardChange(-1)"
            />
            <v-col
              v-for="(item, idx) in getSubCardImage"
              :key="idx"
              cols="3"
              class="sub-card-img-col"
            >
              <v-card
                class="sub-card-container"
                :class="{ 'is-selected': selectedSubCard === item }"
                @click="handleSubCardClick(item)"
              >
                <v-card-text>
                  <img
                    :src="item"
                    height="80px"
                    class="sub-card-img"
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <v-btn
              icon="mdi-menu-right"
              size="small"
              color="green"
              @click="handleSubCardChange(1)"
            />
          </v-row>
        </v-col>

        <!-- 卡片介紹 -->
        <v-col
          cols="6"
          align="left"
        >
          <v-card-title class="intro-title">
            {{ t('common.infinityCard') }}
          </v-card-title>
          <v-card-text class="intro-text">
            {{ t('intro.cardAbs') }}
          </v-card-text>
          <v-card-text>
            <v-row class="cards-selector-row">
              <v-col
                v-for="(item, idx) in optionsCardSet"
                :key="idx"
                cols="2"
                @click="clickCardCase(item.value)"
              >
                <img
                  :src="item.image"
                  class="cards-selector-img"
                  :class="{ 'is-selected': selectedCard === item.value }"
                >
              </v-col>
            </v-row>
          </v-card-text>
          <v-card class="cards-selector-card">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-row align="center">
                    <v-col
                      cols="3"
                      align="center"
                    >
                      <div class="input-label">
                        {{ t('common.cardSet') }}:
                      </div>
                    </v-col>
                    <v-col cols="9">
                      <v-select
                        v-model="selectedCard"
                        :items="optionsCardSet"
                        item-title="title"
                        item-value="value"
                        density="compact"
                        @update:model-value="handleSelectChange"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  class="buy-card-row"
                >
                  <v-row align="center">
                    <v-col
                      cols="3"
                      align="center"
                    >
                      <div class="input-label">
                        {{ t('common.quantity') }}:
                      </div>
                    </v-col>
                    <v-col cols="9">
                      <v-number-input
                        v-model="quantity"
                        control-variant="stacked"
                        density="compact"
                      />
                    </v-col>
                    <v-spacer />
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  align="right"
                  class="buy-card-row"
                >
                  <div class="cards-price">
                    {{ t('common.totalAmount') }}: $
                    {{ getTotalPrice }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-row class="mt-3">
            <v-col cols="4">
              <v-btn
                block
                class="buy-card-btn buy-card-btn-secondary"
                @click="handleAddToCart"
              >
                {{ t('navigation.addToCart') }}
              </v-btn>
            </v-col>
            <v-col cols="8">
              <v-btn
                block
                class="buy-card-btn buy-card-btn-primary"
                @click="handleBuyCard"
              >
                {{ t('navigation.buyNow') }}
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                class="buy-card-btn buy-card-btn-secondary"
              >
                <v-icon>mdi-heart-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer />
      </v-row>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.first-page {
  max-width: 1200px;

  .first-page-item {
    background-color: #d9d9d9 !important;
    height: 700px;
    border-radius: 40px;

    .first-row {
      height: 600px;
      padding-top: 30px;
    }
  }

  .component-radius {
    border-radius: 20px;
  }

  .intro-title {
    font-size: 45px;
    font-weight: 900;
  }

  .intro-text {
    font-size: 20px;
    font-weight: 500;
    margin-top: -10px;
  }

  // 卡片選則圖片一覽
  .cards-selector-img {
    width: 80px;
    border-radius: 10px;
    opacity: 0.5;

    &.is-selected {
      opacity: 1;
    }
  }

  .sub-card-img-col {
    width: 140px;
    height: 140px;
  }

  .sub-card-container {
    border-radius: 20px;

    &.is-selected {
      border: 2px solid #ffd84f;
    }
  }

  .input-label {
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 15px;
    padding-left: 10px;
  }

  .buy-card-row {
    margin-top: -30px;
  }

  .cards-price {
    font-size: 20px;
    font-weight: 900;
  }

  .buy-card-btn {
    font-size: 20px;
    font-weight: 900;
    border-radius: 30px;

    &.buy-card-btn-primary {
      background-color: #ffd84f;
      color: #000000;
    }

    &.buy-card-btn-secondary {
      background-color: #ffffff;
      color: #000000;
    }
  }
}
</style>
