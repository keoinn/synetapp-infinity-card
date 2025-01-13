<template>
  <v-navigation-drawer
    expand-on-hover
    width="200"
    rail-width="80"
    :rail="appStore.isDrawerOpen"
    color="transparent"
  >
    <!-- rail / permanent -->
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
    value: 'buy',
    icon: 'mdi-shopping-outline',
    text: '購買卡牌',
    path: '/logout',
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
  return navItems.value.filter(item => item.show)
})
</script>

<style scoped lang="scss">
.nav-item {
  border: 1px solid gray;
  :deep(.v-list-item__prepend) {
    width: 50px;
  }
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
