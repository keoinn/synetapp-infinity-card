<template>
  <v-navigation-drawer
    expand-on-hover
    width="200"
    rail-width="80"
    :rail="appStore.isDrawerOpen"
    color="#FFFFFF"
    :permanent="mdAndDown ? true : false"
    style="z-index: 100;"
  >
    <!-- rail / permanent 
     DOCME:
     https://stackoverflow.com/questions/64174860/hide-vuetify-navigation-drawer
     -->
    <v-list
      nav
      lines="two"
    >
      <v-list-item
        v-for="item in filteredNavItems"
        :key="item.value"
        :value="item.value"
        class="nav-item"
        rounded="xl"
        active-class="nav-item-active"
        :active="handleActive(item.value)"
        :disabled="handleActive(item.value)"
        @click="action(item.value)"
      >
        <!-- :to="item.path" -->
        <template #prepend>
          <v-icon
            :icon="item.icon"
            size="32"
            class="nav-item-icon"
          />
        </template>
        <template #title>
          <span class="nav-item-text">{{ item.text }}</span>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { mdAndDown } = useDisplay()
const { t } = useI18n()

// 監控螢幕斷點變化
/*
import { watchEffect } from 'vue'
const { 
  mobile,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  name,
  height,
  width,
  mdAndDown,
  mdAndUp,
  displayClasses 
} = useDisplay()
watchEffect(() => {
  console.log({
    斷點名稱: name.value,
    螢幕寬度: width.value,
    螢幕高度: height.value,
    是否手機: mobile.value,
    斷點詳情: {
      超小型: xs.value,
      小型: sm.value,
      中型: md.value,
      大型: lg.value,
      特大: xl.value,
      超大: xxl.value
    },
    中型螢幕及以下: mdAndDown.value,
    中型螢幕及以上: mdAndUp.value,
    顯示類別: displayClasses.value
  })
})
*/

const appStore = useAppStore()

// 獲取當前角色（優先使用 selectedRole，否則使用 role）
const currentRole = computed(() => {
  // 處理 role 可能是數組的情況
  let roleValue = appStore.selectedRole || appStore.role || null
  
  // 如果是數組，取第一個元素
  if (Array.isArray(roleValue)) {
    roleValue = roleValue.length > 0 ? roleValue[0] : null
  }
  
  return roleValue
})

// 判斷是否為會員角色
const isMember = computed(() => {
  return currentRole.value === 'member'
})

// 判斷是否為諮商師角色
const isCounselor = computed(() => {
  // 檢查 appStore.role 數組中是否包含 'counselor'
  let roles = appStore.role || []
  
  // 如果是字符串，轉換為數組
  if (typeof roles === 'string') {
    roles = [roles]
  }
  
  // 如果不是數組，返回 false
  if (!Array.isArray(roles)) {
    return false
  }
  
  return roles.includes('counselor')
})

const navItems = computed(() => [
  {
    value: 'exam',
    icon: 'mdi-cards-playing',
    text: t('navigation.exam'),
    path: '/exam',
    show: true // 所有角色都顯示
  },
  {
    value: 'inventory',
    icon: 'mdi-account',
    text: t('navigation.createExam'),
    path: '/inventory',
    show: isMember.value // 只有會員顯示
  },
  {
    value: 'counselor-view',
    icon: 'mdi-eye-outline',
    text: t('navigation.counselorViewableExams') || '我可觀看的卡牌測驗結果',
    path: '/exam/counselor-view',
    show: isCounselor.value // 只有諮商師顯示
  },
  {
    value: 'user',
    icon: 'mdi-text-box-edit-outline',
    text: t('navigation.editProfile'),
    path: '/user',
    show: isMember.value // 只有會員顯示
  },
  {
    value: 'shop',
    icon: 'mdi-shopping-outline',
    text: t('navigation.buyCards'),
    path: '/shop',
    show: isMember.value // 只有會員顯示
  },
  {
    value: 'cart',
    icon: 'mdi-cart-outline',
    text: t('navigation.cart'),
    path: '/cart',
    show: isMember.value // 只有會員顯示
  },
  {
    value: 'logout',
    icon: 'mdi-logout',
    text: t('navigation.logout'),
    path: '/logout',
    show: true // 所有角色都顯示
  }
])

const filteredNavItems = computed(() => {
  return navItems.value.filter((item) => item.show)
})

const action = (auctionId) => {
  switch (auctionId) {
    case 'exam':
      router.push('/exam')
      break;
    case 'inventory':
      router.push('/inventory')
      break;
    case 'counselor-view':
      router.push('/exam/counselor-view')
      break;
    case 'cart':
      router.push('/cart')
      break;
    case 'user':
      router.push('/')
      break;
    case 'logout':
      appStore.logout()
      router.push('/')
      break;
    case 'shop':
      router.push('/shop')
      break;
    case 'exam-playground':
      router.push('/exam/playground')
      break;
    case 'exam-card-classify':
      router.push('/exam/sort')
      break;
    default:
      router.push('/')
      break;
  }
}

const handleActive = (item) => {
  return router.currentRoute.value.path.replace('/', '') === item
}
</script>

<style scoped lang="scss">
.nav-item {
  border: 1px solid gray;
  :deep(.v-list-item__prepend) {
    width: 50px;
  }

  
}
.v-list-item--disabled{
    opacity: 0.95 !important;
}

.nav-item-text {
  font-size: 20px;
  height: 50px;
  display: flex;
  align-items: center;
}

.nav-item-icon {
  margin-left: 10px;
}

.nav-item-active {
  background-color: #fa5015;
  color: #fff;
  border: 1px solid #fa5015;
}
</style>
