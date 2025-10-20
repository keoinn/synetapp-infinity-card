<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { registerAPI } from '@/plugins/utils/requests/api/backend'
import { handleAlert } from '@/plugins/utils/alert'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const visible_pwd = ref(false)
const visible_pwd_confirm = ref(false)
const appStore = useAppStore()
const account = ref('')
const password = ref('')
const password_confirm = ref('')
const newAccount = ref(false)
const error_detail = ref(null)
const testing_status = ref(false)

const login = async () => {
  // 驗證輸入
  if (!account.value || !account.value.trim()) {
    error_detail.value = '請輸入帳號或信箱'
    return
  }
  if (!password.value || !password.value.trim()) {
    error_detail.value = '請輸入密碼'
    return
  }

  try{
    const response = await appStore.login(account.value, password.value)
    
    // 檢查登入是否成功
    if (response.meta.code === '2000') {
      // 登入成功，清空表單並跳轉
      account.value = ''
      password.value = ''
      password_confirm.value = ''
      error_detail.value = null
      newAccount.value = false
      router.push('/')
    } else {
      // 登入失敗，顯示後端錯誤訊息
      error_detail.value = response.meta.msg || '登入失敗，請稍後再試'
    }
  } catch (error) {
    console.log(error);
    errorHandler(error)
  }
  return false
}

const register = async () => {
  // 驗證輸入
  if (!account.value || !account.value.trim()) {
    error_detail.value = '請輸入電子信箱'
    return
  }
  if (!password.value || !password.value.trim()) {
    error_detail.value = '請輸入密碼'
    return
  }
  if (!password_confirm.value || !password_confirm.value.trim()) {
    error_detail.value = '請確認密碼'
    return
  }
  if (password.value !== password_confirm.value) {
    error_detail.value = '密碼不一致'
    return
  }

  /** */
  try{
    const res = await registerAPI({email: account.value, password: password.value})
    if(res.meta.code === '2004') {
      handleAlert({
        auction: 'success',
        text: res.meta.msg
      })
      account.value = ''
      password.value = ''
      password_confirm.value = ''
      error_detail.value = null
      newAccount.value = false
    }
  } catch (error) {
    errorHandler(error)
  }
}

const errorHandler = (error_response) => {
  // 處理從 app store 拋出的錯誤格式
  if (error_response.response && error_response.response.data) {
    const error_data = error_response.response.data
    
    // 優先顯示後端的錯誤訊息
    if (error_data.meta && error_data.meta.msg) {
      error_detail.value = error_data.meta.msg
      return
    }
    
    if(error_data.errors && error_data.errors[0]) {
      if(error_data.errors[0].status === '401'){
        if(error_data.errors[0].code === '4012'){
          error_detail.value = '帳號不存在或密碼錯誤！'
        } else if(error_data.errors[0].code === '4013'){
          error_detail.value = '帳號不存在或密碼錯誤！'
        } else {
          error_detail.value = '接收資料失敗，請稍後再試。'
        }
      } else if(error_data.errors[0].status === '409') {
        if(error_data.errors[0].code === '4006') {
          error_detail.value = '電子信箱已在 WEPRO 註冊過!'
        } else if (error_data.errors[0].code === '4005') {
          error_detail.value = '帳號已在 WEPRO 註冊過!'
        } else {
          error_detail.value = '接收資料失敗，請稍後再試。'
        }
      } else if(error_data.errors[0].status === '400') {
        if (error_data.errors[0].code === '4007') {
          error_detail.value = '電子信箱是必要欄位!'
        }  else if (error_data.errors[0].code === '4008') {
          error_detail.value = '密碼是必要欄位!'
        } else if (error_data.errors[0].code === '4009') {
          error_detail.value = '系統發生錯誤 (缺少必要參數: platform)，請稍後再試。'
        } else if (error_data.errors[0].code === '4010'){
          error_detail.value = '密碼是必要欄位!'
        } else if (error_data.errors[0].code === '4011'){
          error_detail.value = '系統發生錯誤 (缺少必要參數: platform)，請稍後再試。'
        } else if (error_data.errors[0].code === '4030') {
          error_detail.value = '信箱格式錯誤!'
        } else {
          error_detail.value = '接收資料失敗，請稍後再試。'
        }
      }
    }
  } else {
    // 處理其他類型的錯誤
    error_detail.value = '登入失敗，請稍後再試'
  }
}

const inputAccountLabel = computed(() => {
  return newAccount.value ? t('common.email') : t('common.login')
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
        <form @submit.prevent="newAccount ? register() : login()">
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            {{ inputAccountLabel }}
            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              :text="newAccount ? t('common.backToLogin') : t('common.orRegister')"
              @click="newAccount = !newAccount"
            />
          </div>

          <v-text-field
            v-model="account"
            density="compact"
            :placeholder="t('common.enterAccountOrEmail')"
            :prepend-inner-icon="newAccount ? 'mdi-email-outline' : 'mdi-account-outline'"
            variant="outlined"
            :autocomplete="newAccount ? 'email' : 'username'"
          />

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            {{ t('common.password') }}
            <a
              v-if="newAccount === false"
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
            >
              <!-- TODO: Password Reset -->
              {{ t('common.forgotPassword') }}
            </a>
          </div>
          <v-text-field
            v-model="password"
            :append-inner-icon="visible_pwd ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible_pwd ? 'text' : 'password'"
            density="compact"
            :placeholder="t('common.enterPassword')"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :autocomplete="newAccount ? 'new-password' : 'current-password'"
            @click:append-inner="visible_pwd = !visible_pwd"
          />

          <div
            v-if="newAccount"
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
          >
            {{ t('common.confirmPassword') }}
          </div>
          <v-text-field
            v-if="newAccount"
            v-model="password_confirm"
            :append-inner-icon="visible_pwd_confirm ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible_pwd_confirm ? 'text' : 'password'"
            density="compact"
            :placeholder="t('common.enterPassword')"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            autocomplete="new-password"
            @click:append-inner="visible_pwd_confirm = !visible_pwd_confirm"
          />
          <v-card
            v-if="testing_status"
            class="mt-1 mb-2"
            color="surface-variant"
            variant="tonal"
          >
            <v-card-text class="text-medium-emphasis text-caption">
              測試帳號: admin<br>
              測試密碼: 123456
            </v-card-text>
          </v-card>

          <v-card
            v-if="error_detail !== null"
            color="error"
            variant="tonal"
            class="mt-1 mb-12"
          >
            <v-card-text class="text-caption">
              {{ error_detail }}
            </v-card-text>
          </v-card>

          <v-btn
            class="mb-8"
            color="#fa5015"
            size="large"
            variant="tonal"
            block
            type="submit"
            :text="newAccount ? t('common.register') : t('common.login')"
          />
        </form>
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
