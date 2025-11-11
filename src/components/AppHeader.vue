<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const appStore = useAppStore()
const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()

// 所有可用的身份列表
const allUserRoles = [
  {
    value: 'user',
    title: t('admin.userRole'),
    icon: 'mdi-account'
  },
  {
    value: 'member',
    title: '會員',
    icon: 'mdi-account'
  },
  {
    value: 'subaccount',
    title: '子帳號',
    icon: 'mdi-account-multiple'
  },
  {
    value: 'org',
    title: t('admin.orgRole'),
    icon: 'mdi-office-building'
  },
  {
    value: 'organization',
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
  },
  {
    value: 'demo_account',
    title: '展演帳號',
    icon: 'mdi-account-star'
  }
]

// 獲取用戶實際擁有的角色（處理數組格式）
const userAvailableRoles = computed(() => {
  let roles = appStore.role || []
  
  // 如果是字符串，轉換為數組
  if (typeof roles === 'string') {
    roles = [roles]
  }
  
  // 如果不是數組，返回空數組
  if (!Array.isArray(roles)) {
    return []
  }
  
  return roles
})

// 檢查是否有機構角色（organization）或管理員角色（admin）
const hasOrganizationRole = computed(() => {
  return userAvailableRoles.value.includes('organization') || 
         userAvailableRoles.value.includes('admin')
})

// 過濾出用戶可用的角色列表（排除 admin，因為 admin 不應該在選擇列表中顯示）
const userRoles = computed(() => {
  return allUserRoles.filter(role => 
    userAvailableRoles.value.includes(role.value) && 
    role.value !== 'admin' // 排除 admin 角色
  )
})

// 當前選擇的身份別（優先使用 selectedRole，否則使用 role）
const currentRole = computed(() => {
  // 處理 role 可能是數組的情況
  let roleValue = appStore.selectedRole || appStore.role || 'user'
  
  // 如果是數組，取第一個元素
  if (Array.isArray(roleValue)) {
    roleValue = roleValue.length > 0 ? roleValue[0] : 'user'
  }
  
  // 確保返回字符串
  return String(roleValue || 'user')
})

// 獲取當前身份的顯示文字
const currentRoleTitle = computed(() => {
  const role = userRoles.value.find(r => r.value === currentRole.value)
  return role ? role.title : String(currentRole.value)
})

// 獲取當前身份的圖標
const currentRoleIcon = computed(() => {
  const role = userRoles.value.find(r => r.value === currentRole.value)
  return role ? role.icon : 'mdi-account'
})

const switchRole = (role) => {
  appStore.selectedRole = role
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

    <!-- 登入按鈕 (未登入時顯示) -->
    <v-btn
      v-if="!appStore.isLogin"
      class="mr-6"
      color="#FA5015"
      variant="outlined"
      @click="router.push('/login')"
    >
      {{ t('common.login') }}
    </v-btn>

    <!-- 身份選擇與顯示 (已登入時顯示) -->
    <v-menu
      v-if="appStore.isLogin && currentRole"
      location="bottom end"
      class="mr-6"
    >
      <template #activator="{ props }">
        <v-chip
          v-bind="props"
          :prepend-icon="currentRoleIcon"
          color="primary"
          variant="outlined"
          size="small"
          class="cursor-pointer"
        >
          {{ currentRoleTitle }}
          <v-icon
            size="small"
            class="ml-1"
          >
            mdi-chevron-down
          </v-icon>
        </v-chip>
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
        <v-divider
          v-if="hasOrganizationRole"
          class="my-2"
        />
        <v-list-item
          v-if="hasOrganizationRole"
          value="admin-panel"
          @click="router.push('/admin')"
        >
          <template #prepend>
            <v-icon>mdi-shield-account</v-icon>
          </template>
          <v-list-item-title>{{ t('admin.title') }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item
          value="logout"
          @click="handleLogout"
        >
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>{{ t('common.logout') }}</v-list-item-title>
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

.cursor-pointer {
  cursor: pointer;
}
</style>
