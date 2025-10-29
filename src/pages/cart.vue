<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const tab = ref(null)

const getTab = () => {
  if (route.query.tabs === 'order') {
    tab.value = 'order'
  } else if (route.query.tabs === 'cart') {
    tab.value = 'cart'
  } else {
    tab.value = 'cart'
  }
}

onMounted(() => {
  getTab()
})

</script>

<template>
  <div class="cart-page">
    <v-card class="cart-card">
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="cart">
          <v-icon>mdi-cart</v-icon>
          {{ t('common.cart') }}
        </v-tab>
        <v-tab value="order">
          <v-icon>mdi-check-circle</v-icon>
          {{ t('order.orderInfo') }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window
          v-model="tab"
        >
          <!-- 購物車 -->
          <v-tabs-window-item value="cart">
            <CartCheckout />
          </v-tabs-window-item>

          <!-- 訂單 -->
          <v-tabs-window-item value="order">
            <CheckoutList />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.cart-page {
  max-width: 1200px;
  height: 76vh;
  margin: 0 auto;
  border-radius: 20px;
  padding-top: 20px;
}
</style>
