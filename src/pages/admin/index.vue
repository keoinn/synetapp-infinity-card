<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import OrganizationManagement from '@/components/admin/OrganizationManagement.vue'
import OrganizationSubAccountManagement from '@/components/admin/OrganizationSubAccountManagement.vue'
import OrganizationCardInventory from '@/components/admin/OrganizationCardInventory.vue'
import SubAccountCardInventory from '@/components/admin/SubAccountCardInventory.vue'
import CounselorManagement from '@/components/admin/CounselorManagement.vue'
import WorkshopManagement from '@/components/admin/WorkshopManagement.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const appStore = useAppStore()
const { t } = useI18n()

const activeTab = ref('dashboard')

const menuItems = [
  {
    title: t('admin.dashboard'),
    icon: 'mdi-view-dashboard',
    value: 'dashboard'
  },
  {
    title: t('admin.users'),
    icon: 'mdi-account-group',
    value: 'users'
  },
  {
    title: t('admin.organizations'),
    icon: 'mdi-office-building',
    value: 'organizations'
  },
  {
    title: t('admin.subAccounts'),
    icon: 'mdi-account-multiple',
    value: 'subAccounts'
  },
  {
    title: t('admin.subAccountCards'),
    icon: 'mdi-card-multiple',
    value: 'subAccountCards'
  },
  {
    title: t('admin.cards'),
    icon: 'mdi-cards',
    value: 'cards'
  },
  {
    title: t('admin.counselors'),
    icon: 'mdi-account-tie',
    value: 'counselors'
  },
  {
    title: t('admin.workshop.title'),
    icon: 'mdi-calendar-multiple-check',
    value: 'workshops'
  },
  {
    title: t('admin.statistics'),
    icon: 'mdi-chart-line',
    value: 'statistics'
  }
]

// 權限驗證
const isAdmin = ref(false)

const checkAdminAccess = () => {
  if (appStore.user_id === 'admin' || appStore.user_id === 1 || appStore.isLogin) {
    isAdmin.value = true
  } else {
    router.push('/')
  }
}

onMounted(() => {
  checkAdminAccess()
})

const handleLogout = () => {
  appStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="admin-page">
    <v-app-bar
      color="primary"
      prominent
    >
      <v-app-bar-title>
        <v-icon
          icon="mdi-shield-account"
          class="mr-2"
        />
        {{ t('admin.title') }}
      </v-app-bar-title>

      <v-spacer />

      <!-- 語言切換器 -->
      <div class="mr-6 admin-language-switcher">
        <LanguageSwitcher />
      </div>

      <v-btn
        :prepend-icon="'mdi-home'"
        @click="router.push('/')"
        class="mr-4"
      >
        {{ t('common.backToHome') }}
      </v-btn>
      <v-btn
        :prepend-icon="'mdi-logout'"
        @click="handleLogout"
      >
        {{ t('common.logout') }}
      </v-btn>
    </v-app-bar>

    <v-container
      v-if="isAdmin"
      fluid
      class="pa-0"
      style="min-height: calc(100vh - 64px);"
    >
      <v-row class="ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-list>
              <v-list-item
                v-for="item in menuItems"
                :key="item.value"
                :active="activeTab === item.value"
                @click="activeTab = item.value"
              >
                <template #prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="9"
        >
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon
                class="mr-2"
                :icon="activeTab === 'dashboard' ? 'mdi-view-dashboard' : 
                       activeTab === 'users' ? 'mdi-account-group' : 
                       activeTab === 'organizations' ? 'mdi-office-building' :
                       activeTab === 'subAccounts' ? 'mdi-account-multiple' :
                       activeTab === 'subAccountCards' ? 'mdi-card-multiple' :
                       activeTab === 'cards' ? 'mdi-cards' :
                       activeTab === 'counselors' ? 'mdi-account-tie' :
                       activeTab === 'workshops' ? 'mdi-calendar-multiple-check' : 'mdi-chart-line'"
              />
              {{ menuItems.find(item => item.value === activeTab)?.title }}
            </v-card-title>
            <v-divider />
            <v-card-text>
              <AdminDashboard v-if="activeTab === 'dashboard'" />
              <UserManagement v-else-if="activeTab === 'users'" />
              <OrganizationManagement v-else-if="activeTab === 'organizations'" />
              <OrganizationSubAccountManagement v-else-if="activeTab === 'subAccounts'" />
              <SubAccountCardInventory v-else-if="activeTab === 'subAccountCards'" />
              <OrganizationCardInventory v-else-if="activeTab === 'cards'" />
              <CounselorManagement v-else-if="activeTab === 'counselors'" />
              <WorkshopManagement v-else-if="activeTab === 'workshops'" />
              <div
                v-else
                class="text-center py-10"
              >
                <v-icon
                  size="64"
                  icon="mdi-construction"
                />
                <div class="text-h6 mt-4">
                  {{ t('admin.comingSoon') }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;

  .v-list-item {
    cursor: pointer;
  }

  :deep(.v-main) {
    padding: 0 !important;
  }

  // 管理後台語言切換器使用白色 icon
  .admin-language-switcher :deep(.v-icon) {
    color: white !important;
  }
}
</style>
