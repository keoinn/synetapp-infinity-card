<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { registerAPI } from '@/plugins/utils/requests/api/backend'
import { handleAlert } from '@/plugins/utils/alert'

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
  try{
    await appStore.login(account.value, password.value)
    account.value = ''
    password.value = ''
    password_confirm.value = ''
    error_detail.value = null
    newAccount.value = false

  } catch (error) {
    errorHandler(error)
  }

}

const register = async () => {
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
  const error_data = error_response.response.data
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
            :text="newAccount ? '返回登入介面' : '或者進行註冊?'"
            @click="newAccount = !newAccount"
          />
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
            <!-- TODO: Password Reset -->
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
