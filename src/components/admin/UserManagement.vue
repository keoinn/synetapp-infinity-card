<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const search = ref('')
const headers = ref([
  { title: t('admin.userName'), key: 'name' },
  { title: t('admin.email'), key: 'email' },
  { title: t('admin.role'), key: 'role' },
  { title: t('admin.status'), key: 'status' },
  { title: t('admin.actions'), key: 'actions', sortable: false }
])

const users = ref([
  {
    name: '張三',
    email: 'zhang@example.com',
    role: t('admin.user'),
    status: t('admin.active'),
    statusColor: 'success'
  },
  {
    name: '李四',
    email: 'li@example.com',
    role: t('admin.user'),
    status: t('admin.active'),
    statusColor: 'success'
  },
  {
    name: '王五',
    email: 'wang@example.com',
    role: t('admin.user'),
    status: t('admin.inactive'),
    statusColor: 'warning'
  },
  {
    name: '趙六',
    email: 'zhao@example.com',
    role: t('admin.admin'),
    status: t('admin.active'),
    statusColor: 'success'
  }
])

const editedItem = ref({
  name: '',
  email: '',
  role: '',
  status: '',
  statusColor: 'success'
})
const dialog = ref(false)

const editUser = (item) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteUser = (item) => {
  const index = users.value.indexOf(item)
  if (index > -1) {
    users.value.splice(index, 1)
  }
}

const saveUser = () => {
  if (editedItem.value) {
    const index = users.value.findIndex(u => u.email === editedItem.value.email)
    if (index > -1) {
      users.value[index] = { ...editedItem.value }
    }
  }
  dialog.value = false
}

const filteredUsers = computed(() => {
  if (!search.value) {
    return users.value
  }
  const searchLower = search.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    user.role.toLowerCase().includes(searchLower)
  )
})
</script>

<template>
  <div class="user-management">
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          :label="t('admin.searchUsers')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="text-right"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="dialog = true"
        >
          {{ t('admin.addUser') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :search="search"
      class="elevation-1"
    >
      <template #item.status="{ item }">
        <v-chip
          :color="item.statusColor"
          size="small"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.role="{ item }">
        <v-chip
          :color="item.role === t('admin.admin') ? 'primary' : 'default'"
          size="small"
          variant="flat"
        >
          {{ item.role }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editUser(item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="deleteUser(item)"
        />
      </template>
    </v-data-table>

    <!-- 編輯/新增用戶對話框 -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ t('admin.editUser') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="editedItem.name"
            :label="t('admin.userName')"
            variant="outlined"
          />
          <v-text-field
            v-model="editedItem.email"
            :label="t('admin.email')"
            variant="outlined"
          />
          <v-select
            v-model="editedItem.role"
            :items="[t('admin.user'), t('admin.admin')]"
            :label="t('admin.role')"
            variant="outlined"
          />
          <v-select
            v-model="editedItem.status"
            :items="[t('admin.active'), t('admin.inactive')]"
            :label="t('admin.status')"
            variant="outlined"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="dialog = false"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveUser"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-management {
  padding: 8px 0;
}
</style>

