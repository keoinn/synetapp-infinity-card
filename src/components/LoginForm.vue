<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const visible_pwd = ref(false)
const visible_pwd_confirm = ref(false)
const appStore = useAppStore()
const account = ref('test')
const password = ref('123456')
const password_confirm = ref('123456')
const newAccount = ref(false)

const login = async () => {
  appStore.login(account.value, password.value)
}

const register = () => {
  // appStore.toggleRegister(account.value, password.value)
  appStore.verifyToken()
}

const inputAccountLabel = computed(() => {
  return newAccount.value ? '電子信箱' : '登入'
})
</script>

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
          {{ inputAccountLabel }}
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            @click="newAccount = !newAccount"
          >
            或者進行註冊?
          </a>
        </div>

        <v-text-field
          v-model="account"
          density="compact"
          placeholder="輸入你的帳號或信箱"
          :prepend-inner-icon="newAccount ? 'mdi-email-outline' : 'mdi-account-outline'"
          variant="outlined"
        />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          密碼
          <a
            v-if="newAccount === false"
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
          >
            忘記密碼?
          </a>
        </div>
        <v-text-field
          v-model="password"
          :append-inner-icon="visible_pwd ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible_pwd ? 'text' : 'password'"
          density="compact"
          placeholder="輸入你的密碼"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible_pwd = !visible_pwd"
        />

        <div
          v-if="newAccount"
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          確認密碼
        </div>
        <v-text-field
          v-if="newAccount"
          v-model="password_confirm"
          :append-inner-icon="visible_pwd_confirm ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible_pwd_confirm ? 'text' : 'password'"
          density="compact"
          placeholder="輸入你的密碼"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible_pwd_confirm = !visible_pwd_confirm"
        />

        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            測試帳號: admin<br />
            測試密碼: 123456
          </v-card-text>
        </v-card>

        <v-btn
          class="mb-8"
          color="#fa5015"
          size="large"
          variant="tonal"
          block
          :text="newAccount ? '註冊' : '登入'"
          @click="newAccount ? register() : login()"
        />
      </v-card>
    </div>
  </div>
</template>

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
