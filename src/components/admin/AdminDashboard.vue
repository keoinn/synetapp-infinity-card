<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = ref([
  {
    title: t('admin.totalUsers'),
    value: '1,234',
    icon: 'mdi-account-group',
    color: 'blue',
    change: '+12%'
  },
  {
    title: t('admin.activeUsers'),
    value: '856',
    icon: 'mdi-account-check',
    color: 'green',
    change: '+8%'
  },
  {
    title: t('admin.totalCards'),
    value: '2,567',
    icon: 'mdi-cards',
    color: 'orange',
    change: '+15%'
  },
  {
    title: t('admin.totalRevenue'),
    value: 'NT$ 123,456',
    icon: 'mdi-cash',
    color: 'purple',
    change: '+23%'
  }
])

const recentActivities = ref([
  {
    user: '張三',
    action: t('admin.userLoggedIn'),
    time: '5 分鐘前',
    type: 'success'
  },
  {
    user: '李四',
    action: t('admin.userPurchasedCard'),
    time: '15 分鐘前',
    type: 'info'
  },
  {
    user: '王五',
    action: t('admin.userCompletedExam'),
    time: '30 分鐘前',
    type: 'success'
  },
  {
    user: '趙六',
    action: t('admin.userRegistered'),
    time: '1 小時前',
    type: 'info'
  }
])

const quickActions = [
  { title: t('admin.manageUsers'), icon: 'mdi-account-group', color: 'blue' },
  { title: t('admin.manageCards'), icon: 'mdi-cards', color: 'orange' },
  { title: t('admin.viewReports'), icon: 'mdi-chart-bar', color: 'green' },
  { title: t('admin.systemSettings'), icon: 'mdi-cog', color: 'purple' }
]
</script>

<template>
  <div class="admin-dashboard">
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          :color="stat.color"
          variant="tonal"
        >
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption mb-1">
                  {{ stat.title }}
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ stat.value }}
                </div>
                <div class="text-caption text-success">
                  {{ stat.change }}
                </div>
              </div>
              <v-icon
                size="48"
                :icon="stat.icon"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="7"
      >
        <v-card>
          <v-card-title>{{ t('admin.recentActivities') }}</v-card-title>
          <v-divider />
          <v-list>
            <v-list-item
              v-for="(activity, index) in recentActivities"
              :key="index"
            >
              <template #prepend>
                <v-avatar
                  :color="activity.type === 'success' ? 'green' : 'blue'"
                >
                  <v-icon
                    icon="mdi-account"
                    color="white"
                  />
                </v-avatar>
              </template>
              <v-list-item-title>{{ activity.user }} {{ activity.action }}</v-list-item-title>
              <v-list-item-subtitle>{{ activity.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="5"
      >
        <v-card>
          <v-card-title>{{ t('admin.quickActions') }}</v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col
                v-for="action in quickActions"
                :key="action.title"
                cols="12"
                sm="6"
              >
                <v-card
                  :color="action.color"
                  variant="flat"
                  class="text-center pa-4"
                  style="cursor: pointer;"
                  hover
                >
                  <v-icon
                    :icon="action.icon"
                    size="32"
                    class="mb-2"
                  />
                  <div class="text-caption">
                    {{ action.title }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  .v-card {
    transition: transform 0.2s;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }
}
</style>


