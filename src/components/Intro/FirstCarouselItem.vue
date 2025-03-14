<script setup>
import { ref, computed } from 'vue'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'
import goal001 from '@/assets/images/cards/goal001.webp'
import goal002 from '@/assets/images/cards/goal002.webp'
import goal003 from '@/assets/images/cards/goal003.webp'
import goal004 from '@/assets/images/cards/goal004.webp'
import goal005 from '@/assets/images/cards/goal005.webp'
import care001 from '@/assets/images/cards/care001.webp'
import care002 from '@/assets/images/cards/care002.webp'
import care003 from '@/assets/images/cards/care003.webp'
import care004 from '@/assets/images/cards/care004.webp'
import care005 from '@/assets/images/cards/care005.webp'
import ce001 from '@/assets/images/cards/ce001.webp'
import ce002 from '@/assets/images/cards/ce002.webp'
import ce003 from '@/assets/images/cards/ce003.webp'
import ce004 from '@/assets/images/cards/ce004.webp'
import ce005 from '@/assets/images/cards/ce005.webp'
import cj001 from '@/assets/images/cards/cj001.webp'
import cj002 from '@/assets/images/cards/cj002.webp'
import cj003 from '@/assets/images/cards/cj003.webp'
import cj004 from '@/assets/images/cards/cj004.webp'
import cj005 from '@/assets/images/cards/cj005.webp'
import le001 from '@/assets/images/cards/le001.webp'
import le002 from '@/assets/images/cards/le002.webp'
import le003 from '@/assets/images/cards/le003.webp'
import le004 from '@/assets/images/cards/le004.webp'
import le005 from '@/assets/images/cards/le005.webp'
import lj001 from '@/assets/images/cards/lj001.webp'
import lj002 from '@/assets/images/cards/lj002.webp'
import lj003 from '@/assets/images/cards/lj003.webp'
import lj004 from '@/assets/images/cards/lj004.webp'
import lj005 from '@/assets/images/cards/lj005.webp'

const selectedCard = ref('goal')
const quantity = ref(1)
const pageSubCard = ref(0)
const selectedSubCard = ref(null)

const optionsCardSet = [
  {
    title: '我就是: I goal - $790',
    value: 'goal',
    image: caseGoal,
    price: 790,
    subCardImage: [goal001, goal002, goal003, goal004, goal005]
  },
  {
    title: '我在乎: I care - $790',
    value: 'care',
    image: caseCare,
    price: 790,
    subCardImage: [care001, care002, care003, care004, care005]
  },
  {
    title: '我可以 (社青版): I can - $790',
    value: 'cj',
    image: caseCj,
    price: 790,
    subCardImage: [cj001, cj002, cj003, cj004, cj005]
  },
  {
    title: '我可以 (國小版): I can - $790',
    value: 'ce',
    image: caseCe,
    price: 790,
    subCardImage: [ce001, ce002, ce003, ce004, ce005]
  },
  {
    title: '我喜歡 (社青版): I like - $790',
    value: 'lj',
    image: caseLj,
    price: 790,
    subCardImage: [lj001, lj002, lj003, lj004, lj005]
  },
  {
    title: '我喜歡 (國小版): I like - $790',
    value: 'le',
    image: caseLe,
    price: 790,
    subCardImage: [le001, le002, le003, le004, le005]
  }
]

const handleSelectChange = () => {
  pageSubCard.value = 0
  selectedSubCard.value = null
}

const getCardImage = computed(() => {
  if (selectedSubCard.value === null) {
    return optionsCardSet.find((item) => item.value === selectedCard.value)?.image
  } else {
    return selectedSubCard.value
  }
})

const getSubCardImage = computed(() => {
  return optionsCardSet
    .find((item) => item.value === selectedCard.value)
    ?.subCardImage.slice(pageSubCard.value * 3, (pageSubCard.value + 1) * 3)
})

const handleSubCardChange = (direction) => {
  pageSubCard.value += direction
  if (pageSubCard.value < 0) {
    pageSubCard.value = 0
  }
  if (
    pageSubCard.value >
    optionsCardSet.find((item) => item.value === selectedCard.value)?.subCardImage.length / 3 - 1
  ) {
    pageSubCard.value =
      optionsCardSet.find((item) => item.value === selectedCard.value)?.subCardImage.length / 3 - 1
  }
}

const handleSubCardClick = (img) => {
  if (selectedSubCard.value === img) {
    selectedSubCard.value = null
  } else {
    selectedSubCard.value = img
  }
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
            無限可能卡
          </v-card-title>
          <v-card-text class="intro-text">
            尋找人生職涯方向第一步就是做生涯規劃，在生涯規劃中最重要的是個人的自我探索、職涯環境之認知與評估及職涯資訊洞悉掌握職場趨勢與專業能力建構，此三方面可以同時並進探索、學習與建構，人的生涯有無限可能。
          </v-card-text>
          <v-card-text>
            <v-row class="cards-selector-row">
              <v-col
                v-for="(item, idx) in optionsCardSet"
                :key="idx"
                cols="2"
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
                    <v-col cols="2">
                      <div class="input-label">
                        卡組：
                      </div>
                    </v-col>
                    <v-col cols="10">
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
                      cols="2"
                      align="center"
                    >
                      <div class="input-label">
                        數量：
                      </div>
                    </v-col>
                    <v-col cols="10">
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
                    總金額： $
                    {{
                      quantity * optionsCardSet.find((item) => item.value === selectedCard)?.price
                    }}
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
              >
                加入購物車
              </v-btn>
            </v-col>
            <v-col cols="8">
              <v-btn
                block
                class="buy-card-btn buy-card-btn-primary"
              >
                立即購買
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
