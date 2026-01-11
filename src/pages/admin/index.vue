<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
import CounselorAssignment from '@/components/admin/CounselorAssignment.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const appStore = useAppStore()
const { t } = useI18n()

const activeTab = ref('dashboard')

// 所有可用的身份列表（管理後台專用，移除會員、子帳號和諮商師）
const allUserRoles = [
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
    value: 'organization',
    title: t('admin.orgRole'),
    icon: 'mdi-office-building'
  },
  {
    value: 'admin',
    title: '管理員',
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

// 過濾出用戶可用的角色列表（管理後台允許顯示管理員）
const userRoles = computed(() => {
  return allUserRoles.filter(role => 
    userAvailableRoles.value.includes(role.value)
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

// 切換角色
const switchRole = (role) => {
  appStore.selectedRole = role
  console.log('切換身份為:', role)
}

const allMenuItems = [
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
    title: '指派諮商師',
    icon: 'mdi-account-plus',
    value: 'counselorAssignment'
  },
  {
    title: t('admin.statistics'),
    icon: 'mdi-chart-line',
    value: 'statistics'
  }
]

// 根據當前身份過濾功能按鈕
const menuItems = computed(() => {
  // 判斷是否為機構身份
  const isOrganization = currentRole.value === 'organization' || currentRole.value === 'org'
  // 判斷是否為管理員
  const isAdmin = currentRole.value === 'admin'
  
  if (isOrganization) {
    // 機構身份只顯示：儀表板、機構管理、附屬帳號管理、附屬帳號卡片庫存、統計數據
    return allMenuItems.filter(item => 
      item.value === 'dashboard' ||
      item.value === 'organizations' ||
      item.value === 'subAccounts' ||
      item.value === 'subAccountCards' ||
      item.value === 'statistics'
    )
  }
  
  if (isAdmin) {
    // 管理員顯示所有功能（包括指派諮商師）
    return allMenuItems
  }
  
  // 其他身份顯示所有功能（但不包括指派諮商師）
  return allMenuItems.filter(item => item.value !== 'counselorAssignment')
})

// 權限驗證
const isAdmin = ref(false)

const checkAdminAccess = () => {
  if (appStore.user_id === 'admin' || appStore.user_id === 1 || appStore.isLogin) {
    isAdmin.value = true
  } else {
    router.push('/')
  }
}

// 自動設定管理後台身份
const autoSetAdminRole = () => {
  // 獲取當前選擇的身份（優先使用 selectedRole，否則使用 role 的第一個）
  let currentSelectedRole = appStore.selectedRole
  if (!currentSelectedRole) {
    const roles = userAvailableRoles.value
    currentSelectedRole = roles.length > 0 ? roles[0] : null
  }
  
  const availableRoles = userAvailableRoles.value
  
  // 如果當前身份已經是機構或管理者，則不需要重置
  if (currentSelectedRole === 'organization' || 
      currentSelectedRole === 'org' || 
      currentSelectedRole === 'admin') {
    return
  }
  
  // 如果當前選擇的是會員、諮商師、附屬帳號時，需要自動切換
  if (currentSelectedRole === 'member' || 
      currentSelectedRole === 'counselor' || 
      currentSelectedRole === 'subaccount') {
    
    // 優先設定為管理員（如果擁有管理員權限）
    if (availableRoles.includes('admin')) {
      appStore.selectedRole = 'admin'
      console.log('自動切換身份為: 管理員')
    } 
    // 如果沒有管理員權限，則設定為機構
    else if (availableRoles.includes('organization') || availableRoles.includes('org')) {
      appStore.selectedRole = availableRoles.includes('organization') ? 'organization' : 'org'
      console.log('自動切換身份為: 機構')
    }
  }
}

// 監聽身份變化，如果當前 activeTab 不在新的 menuItems 中，重置為 dashboard
watch([currentRole, menuItems], () => {
  const availableValues = menuItems.value.map(item => item.value)
  if (!availableValues.includes(activeTab.value)) {
    activeTab.value = 'dashboard'
  }
})

onMounted(() => {
  checkAdminAccess()
  // 自動設定管理後台身份
  if (isAdmin.value) {
    autoSetAdminRole()
  }
})

const handleLogout = () => {
  appStore.logout()
  router.push('/')
}

// 處理返回首頁時的邏輯
const handleBackToHome = () => {
  // 如果當前選擇的身份是管理員，則重新設定為會員
  if (appStore.selectedRole === 'admin') {
    const availableRoles = userAvailableRoles.value
    // 檢查是否有會員權限
    if (availableRoles.includes('member')) {
      appStore.selectedRole = 'member'
      console.log('從管理後台返回首頁，自動切換身份為: 會員')
    }
  }
  router.push('/')
}

// 組件卸載前處理身份切換
onBeforeUnmount(() => {
  // 如果當前選擇的身份是管理員，則重新設定為會員
  if (appStore.selectedRole === 'admin') {
    const availableRoles = userAvailableRoles.value
    // 檢查是否有會員權限
    if (availableRoles.includes('member')) {
      appStore.selectedRole = 'member'
      console.log('離開管理後台，自動切換身份為: 會員')
    }
  }
})
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

      <!-- 身份選擇器 (已登入且有可用角色時顯示) -->
      <v-menu
        v-if="appStore.isLogin && userRoles.length > 0"
        location="bottom end"
        class="mr-6"
      >
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            :prepend-icon="currentRoleIcon"
            color="white"
            variant="outlined"
            size="small"
            class="cursor-pointer admin-role-chip"
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
        </v-list>
      </v-menu>

      <v-btn
        class="mr-4"
        :prepend-icon="'mdi-home'"
        @click="handleBackToHome"
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
                  activeTab === 'workshops' ? 'mdi-calendar-multiple-check' :
                  activeTab === 'counselorAssignment' ? 'mdi-account-plus' : 'mdi-chart-line'"
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
              <CounselorAssignment v-else-if="activeTab === 'counselorAssignment'" />
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

  // 管理後台角色選擇器樣式
  .admin-role-chip {
    :deep(.v-chip__content) {
      color: white !important;
    }
    :deep(.v-icon) {
      color: white !important;
    }
  }
}
</style>
