<template>
  <div class="login-form-container">
    <div class="login-form">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          帳號
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            或者進行註冊?</a
          >
        </div>

        <v-text-field
          v-model="account"
          density="compact"
          placeholder="輸入你的帳號或信箱"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
        />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          密碼

          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            忘記密碼?</a
          >
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="輸入你的密碼"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        />

        <!-- <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked
            for three hours. If you must login now, you can also click "Forgot login password?" below
            to reset the login password.
          </v-card-text>
        </v-card> -->

        <v-btn
          class="mb-8"
          color="#fa5015"
          size="large"
          variant="tonal"
          block
          @click="login"
        >
          登入
        </v-btn>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
const visible = ref(false)
const appStore = useAppStore()
const account = ref('')
const password = ref('')

const login = () => {
  appStore.toggleLogin(account.value, password.value)
}
</script>

<style scoped>
.login-form-container {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 448px;
}

.login-form {
  width: 100%;
}
</style>
