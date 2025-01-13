<template>
  <v-app-bar
    app
    flat
    color="transparent"
  >
    <div
      v-if="true"
      class="header-start-icon"
    >
      <v-icon
        size="32"
        :icon="appStore.isDrawerOpen ? 'mdi-menu-close' : 'mdi-menu-open'"
        @click="appStore.toggleDrawer"
      />
    </div>

    <a
      href="/"
      class="header-link d-none d-md-flex"
    >
      最新消息
    </a>

    <a
      href="/"
      class="header-link d-none d-md-flex"
    >
      購買卡牌
    </a>

    <a
      href="/"
      class="header-link d-none d-md-flex"
    >
      關於我們
    </a>

    <div class="header-title">
      <span class="header-main-title">無限可能卡</span>
      <span class="header-sub-title">Infinity Card</span>
    </div>

    <v-spacer />

    <div class="header-end-icon">
      <v-icon
        size="32"
        icon="mdi-cart-outline"
      />
    </div>
  </v-app-bar>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

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
