<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const appStore = useAppStore()
const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()
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
      {{ t('common.news') }}
    </span>

    <span
      class="header-link d-none d-md-flex"
      @click="router.push('/shop')"
    >
      {{ t('common.shop') }}
    </span>

    <span
      class="header-link d-none d-md-flex"
      @click="router.push('/about')"
    >
      {{ t('common.about') }}
    </span>

    <div
      class="header-title"
      @click="router.push('/')"
    >
      <span class="header-main-title">{{ t('common.infinityCard') }}</span>
      <span class="header-sub-title">{{ t('common.infinityCardEn') }}</span>
    </div>

    <v-spacer />

    <LanguageSwitcher />
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

    <div class="header-end-icons">
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

.header-end-icons {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.header-end-icon {
  color: rgba(0, 0, 0, 0.87);
  opacity: 0.8;
}

.header-start-icon {
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.87);
  opacity: 0.8;
}
</style>
