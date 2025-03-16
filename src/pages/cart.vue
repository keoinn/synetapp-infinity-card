<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()
const tab = ref(null)

</script>

<template>
  <div class="cart-page">
    <v-card class="cart-card">
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="cart">購物車</v-tab>
        <v-tab value="order">訂單</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window
          v-model="tab"
        >
          <!-- 購物車 -->
          <v-tabs-window-item value="cart">
            <CartCheckout />
          </v-tabs-window-item>

          <v-tabs-window-item value="order"> Two </v-tabs-window-item>
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
