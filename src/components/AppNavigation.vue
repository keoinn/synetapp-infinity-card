<template>
  <v-navigation-drawer
    expand-on-hover
    width="200"
    rail-width="80"
    :rail="appStore.isDrawerOpen"
    color="#FFFFFF"
    :permanent="mdAndDown ? true : false"
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
        @click="aution(item.value)"
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
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
const router = useRouter()
const { mdAndDown } = useDisplay()

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

const navItems = ref([
  {
    value: 'exam',
    icon: 'mdi-cards-playing',
    text: '卡牌測驗',
    path: '/exam',
    show: true
  },
  {
    value: 'permission',
    icon: 'mdi-account',
    text: '權限管理',
    path: '/permission',
    show: true
  },
  {
    value: 'user',
    icon: 'mdi-text-box-edit-outline',
    text: '修改資料',
    path: '/user',
    show: true
  },
  {
    value: 'cards',
    icon: 'mdi-shopping-outline',
    text: '購買卡牌',
    path: '/cards',
    show: true
  },
  {
    value: 'cart',
    icon: 'mdi-cart-outline',
    text: '購物車',
    path: '/cart',
    show: true
  },
  {
    value: 'logout',
    icon: 'mdi-logout',
    text: '登出',
    path: '/logout',
    show: true
  }
])

const filteredNavItems = computed(() => {
  return navItems.value.filter((item) => item.show)
})

const aution = (auctionId) => {
  console.log(auctionId)
  switch (auctionId) {
    case 'exam':
      router.push('/exam/playcard')
      break;
    case 'permission':
      router.push('/permission')
      break;
    case 'user':
      router.push('/user')
      break;
    case 'logout':
      appStore.logout()
      router.push('/')
      break;
    case 'cards':
      router.push('/cards')
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
