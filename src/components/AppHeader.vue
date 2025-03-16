<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
const appStore = useAppStore()
const router = useRouter()
const cartStore = useCartStore()
</script>
<template>
  <v-app-bar
    app
    flat
    color="#FFFFFF"
  >
    <div
      v-show="appStore.isLogin"
      class="header-start-icon"
    >
      <v-icon
        size="32"
        :icon="appStore.isDrawerOpen ? 'mdi-menu-close' : 'mdi-menu-open'"
        @click="appStore.toggleDrawer"
      />
    </div>

    <span
      class="header-link d-none d-md-flex"
      @click="router.push('/news')"
    >
      最新消息
    </span>

    <span
      class="header-link d-none d-md-flex"
      @click="router.push('/shop')"
    >
      購買卡牌
    </span>

    <span
      class="header-link d-none d-md-flex"
      @click="router.push('/about')"
    >
      關於我們
    </span>

    <div class="header-title">
      <span class="header-main-title">無限可能卡</span>
      <span class="header-sub-title">Infinity Card</span>
    </div>

    <v-spacer />
    <div
      v-show="!appStore.isLogin"
      class="header-start-icon pr-6"
    >
      <v-icon
        size="32"
        icon="mdi-login"
        @click="router.push('/login')"
      />
    </div>

    <div class="header-end-icon">
      <v-badge
        v-if="cartStore.totalItems > 0"
        color="error"
        :content="cartStore.totalItems"
      >
        <v-icon
          size="32"
          icon="mdi-cart-outline"
          @click="router.push('/cart')"
        />
      </v-badge>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
.header-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  color: #000;
  .header-main-title {
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .header-sub-title {
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 5.04px;
  }
}

.header-link {
  color: #000;
  text-decoration: none;
  margin-left: 50px;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;
}

.header-end-icon {
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.87);
  opacity: 0.8;
}

.header-start-icon {
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.87);
  opacity: 0.8;
}
</style>
