<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { registerAPI, eventLoginAPI } from '@/plugins/utils/requests/api/backend'
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
const isEventMode = ref(false)
const eventCode = ref('')

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

  // 如果是活動登入模式，驗證活動代碼
  if (isEventMode.value) {
    if (!eventCode.value || !eventCode.value.trim()) {
      error_detail.value = '請輸入活動代碼'
      return
    }
  }

  try {
    let response
    
    if (isEventMode.value) {
      // 活動展演帳號登入
      console.log('活動登入:', { event_code: eventCode.value, account: account.value })
      response = await eventLoginAPI({
        event_code: eventCode.value.trim(),
        account: account.value.trim(),
        password: password.value
      })
      console.log('活動登入回應:', response)
      
      // 檢查登入是否成功
      if (response.meta.code === '2000') {
        // 更新 app store 狀態
        appStore.token = response.meta.token
        appStore.refreshToken = response.meta.refresh_token
        appStore.user_id = response.data.attributes.uid
        // 保存完整的 role 數組（如果 API 返回的是數組）
        let roleValue = response.data.attributes.role || null
        // 如果是字符串，轉換為數組以便統一處理
        if (typeof roleValue === 'string') {
          roleValue = [roleValue]
        }
        // 如果為 null 或 undefined，設為空數組
        if (!roleValue) {
          roleValue = []
        }
        // 確保是數組格式
        if (!Array.isArray(roleValue)) {
          roleValue = []
        }
        appStore.role = roleValue
        // 登入時自動設置 selectedRole 為 role 的第一個元素（用於顯示）
        appStore.selectedRole = roleValue.length > 0 ? roleValue[0] : null
        appStore.isLogin = true
        
        // 登入成功，清空表單並跳轉
        account.value = ''
        password.value = ''
        password_confirm.value = ''
        eventCode.value = ''
        error_detail.value = null
        newAccount.value = false
        router.push('/')
      } else {
        // 登入失敗，顯示後端錯誤訊息
        error_detail.value = response.meta.msg || response.meta.detail || '登入失敗，請稍後再試'
      }
    } else {
      // 一般會員登入
      response = await appStore.login(account.value, password.value)
      
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
    }
  } catch (error) {
    console.log(error)
    // 如果是活動登入模式，優先檢查是否有 meta.detail 或 meta.msg
    if (isEventMode.value && error?.response?.data?.meta) {
      const errorMeta = error.response.data.meta
      error_detail.value = errorMeta.detail || errorMeta.msg || '活動登入失敗，請稍後再試'
    } else {
      errorHandler(error)
    }
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

// 從 URL 查詢參數初始化 isEventMode 和 eventCode
onMounted(() => {
  const query = router.currentRoute.value.query
  isEventMode.value = query.mode === 'event'
  // 同步 code 參數到 eventCode，如果 code 為 'null' 或不存在則保持空白
  if (query.code && query.code !== 'null') {
    eventCode.value = query.code
  } else {
    eventCode.value = ''
  }
})

// 監聽路由變化，同步 isEventMode 和 eventCode
watch(() => router.currentRoute.value.query.mode, (newMode) => {
  isEventMode.value = newMode === 'event'
})

// 監聽 code 參數變化，同步到 eventCode
watch(() => router.currentRoute.value.query.code, (newCode) => {
  if (isEventMode.value) {
    if (newCode && newCode !== 'null') {
      eventCode.value = newCode
    } else {
      eventCode.value = ''
    }
  }
})

const toggleLoginMode = () => {
  const currentQuery = { ...router.currentRoute.value.query }
  
  if (isEventMode.value) {
    // 切換到會員登入：移除 mode 和 code 參數，清空活動代碼
    isEventMode.value = false
    eventCode.value = ''
    const newQuery = { ...currentQuery }
    delete newQuery.mode
    delete newQuery.code
    router.push({
      path: router.currentRoute.value.path,
      query: newQuery
    })
  } else {
    // 切換到研討會登入：添加 mode 和 code 參數
    isEventMode.value = true
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...currentQuery,
        mode: 'event',
        code: eventCode.value || 'null'
      }
    })
  }
}
</script>

<template>
  <div class="login-form-container">
    <div class="login-form">
      <v-card
        class="mx-auto pa-12 pb-6"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <form @submit.prevent="newAccount ? register() : login()">
          <!-- 活動代碼輸入欄位（僅在 mode=event 時顯示） -->
          <div
            v-if="isEventMode && !newAccount"
            class="mb-2"
          >
            <div class="text-subtitle-1 text-medium-emphasis mb-2">
              活動代碼
            </div>
            <v-text-field
              v-model="eventCode"
              density="compact"
              placeholder="請輸入活動代碼"
              prepend-inner-icon="mdi-ticket-outline"
              variant="outlined"
              autocomplete="off"
            />
          </div>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            {{ inputAccountLabel }}
            <a
              v-if="!isEventMode"
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
              v-if="newAccount === false && !isEventMode"
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
            class="mb-1"
            color="#fa5015"
            size="large"
            variant="tonal"
            block
            type="submit"
            :text="newAccount ? t('common.register') : t('common.login')"
          />
          
          <div
            v-if="!newAccount"
            class="d-flex justify-start mb-4"
          >
            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              @click.prevent="toggleLoginMode"
            >
              >> {{ isEventMode ? '會員登入' : '研討會登入' }}
            </a>
          </div>
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
