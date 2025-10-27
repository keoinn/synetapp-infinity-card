<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const appStore = useAppStore()
const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()

// 當前身份
const currentRole = ref('user')

// 用戶身份列表
const userRoles = ref([
  {
    value: 'user',
    title: t('admin.userRole'),
    icon: 'mdi-account'
  },
  {
    value: 'org',
    title: t('admin.orgRole'),
    icon: 'mdi-office-building'
  },
  {
    value: 'counselor',
    title: t('admin.counselorRole'),
    icon: 'mdi-account-tie'
  },
  {
    value: 'admin',
    title: t('admin.adminRole'),
    icon: 'mdi-shield-account'
  }
])

const switchRole = (role) => {
  currentRole.value = role
  console.log('切換身份為:', role)
  // 可以在這裡添加切換身份的邏輯
}

const handleLogout = () => {
  appStore.logout()
  router.push('/')
}
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

    <!-- 翻譯按鈕 -->
    <div class="mr-6">
      <LanguageSwitcher />
    </div>

    <!-- 身份選擇 -->
    <v-menu
      v-if="appStore.isLogin"
      location="bottom end"
      class="mr-6"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
        >
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="role in userRoles"
          :key="role.value"
          :value="role.value"
          @click="switchRole(role.value)"
        >
          <template #prepend>
            <v-icon>{{ role.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ role.title }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item
          value="admin-panel"
          @click="router.push('/admin')"
        >
          <template #prepend>
            <v-icon>mdi-shield-account</v-icon>
          </template>
          <v-list-item-title>{{ t('admin.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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
