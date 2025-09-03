<script setup>
/* eslint-disable vue/no-v-html */
import { computed, ref } from 'vue'
import { encrypt } from '@/plugins/utils/encryption'
import { useExamProcessStore } from '@/stores/examProcess'
import { useRouter } from 'vue-router'
import { sendEmailAPI } from '@/plugins/utils/requests/api/backend'
import { handleAlert } from '@/plugins/utils/alert'
const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-report-name', 'update-report-email'])

const examProcessStore = useExamProcessStore()
const router = useRouter()

// 編輯報告名稱相關狀態
const showEditDialog = ref(false)
const editingReportName = ref('')

// 編輯信箱相關狀態
const showEmailDialog = ref(false)
const editingEmail = ref('')
const emailError = ref('')

const openEditDialog = () => {
  editingReportName.value = props.report.report_name || ''
  showEditDialog.value = true
}

const saveReportName = () => {
  if (editingReportName.value.trim()) {
    emit('update-report-name', {
      reportId: props.report.crd_id,
      newName: editingReportName.value.trim()
    })
    showEditDialog.value = false
  }
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingReportName.value = ''
}

// 信箱相關方法
const openEmailDialog = () => {
  editingEmail.value = props.report.target_email || ''
  emailError.value = ''
  showEmailDialog.value = true
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const saveEmail = () => {
  emailError.value = ''
  
  if (!editingEmail.value.trim()) {
    emailError.value = '請輸入信箱地址'
    return
  }
  
  if (!validateEmail(editingEmail.value.trim())) {
    emailError.value = '請輸入有效的信箱格式'
    return
  }
  
  emit('update-report-email', {
    reportId: props.report.crd_id,
    newEmail: editingEmail.value.trim()
  })
  showEmailDialog.value = false
}

const closeEmailDialog = () => {
  showEmailDialog.value = false
  editingEmail.value = ''
  emailError.value = ''
}

const sendEmail = async () => {
  emailError.value = ''
  
  if (!editingEmail.value.trim()) {
    emailError.value = '請輸入信箱地址'
    return
  }
  
  if (!validateEmail(editingEmail.value.trim())) {
    emailError.value = '請輸入有效的信箱格式'
    return
  }
  
  try {
    // 先更新信箱到報告中
    emit('update-report-email', {
      reportId: props.report.crd_id,
      newEmail: editingEmail.value.trim()
    })
    
    // 發送測驗連結到信箱
    const baseURL = window.location.origin + (import.meta.env.BASE_URL || '')
    const examLink = baseURL + `exam/${encrypt(props.report.report_id.toString())}`
    
    const res = await sendEmailAPI(
      props.report.crd_id,
      editingEmail.value.trim(),
      examLink
    )
    console.log(res)
    // 發送成功後關閉對話視窗
    showEmailDialog.value = false
    handleAlert({
      auction: 'success',
      text: '測驗連結已成功發送到:' + editingEmail.value.trim()
    })
    
    console.log('測驗連結已成功發送到:', editingEmail.value.trim())
    
  } catch (error) {
    handleAlert({
      auction: 'error',
      text: '發送測驗連結失敗:' + error
    })
    console.error('發送測驗連結失敗:', error)
    emailError.value = '發送失敗，請稍後再試'
  }
}

const startExam = () => {
  examProcessStore.$reset()
  router.push(`/exam/${encrypt(props.report.report_id.toString())}`)
}

const NULLstringFilter = (target) => {
  return target === null ? '尚未設定' : target
}

const cardsSetString = computed(() => {
  if (props.report.cards_set.length === 0) {
    return '尚未設定'
  } else {
    let cardsSetString = ''
    // props.report.cards_set.forEach(card => {
    //   cardsSetString += card === 'goal' ? '我就是 (I Goal),' : 
    //     card === 'care' ? '我在乎 (I Care),' : 
    //     card === 'ce' ? '我可以 國小 (I Can),' : 
    //     card === 'cj' ? '我可以-社青 (I Can),' : 
    //     card === 'lj' ? '我喜歡-社青 (I Like),' : 
    //     card === 'le' ? '我喜歡-國小 (I Like),' : ''
    // })
    cardsSetString = '<ul style="list-style: none; padding-left: 5px;">'
    props.report.cards_set.forEach(card => {
    cardsSetString += card === 'goal' ? '<li>我就是 (I Goal)</li>' : 
      card === 'care' ? '<li>我在乎 (I Care)</li>' : 
      card === 'ce' ? '<li>我可以 國小 (I Can)</li>' : 
      card === 'cj' ? '<li>我可以-社青 (I Can)</li>' : 
      card === 'lj' ? '<li>我喜歡-社青 (I Like)</li>' : 
      card === 'le' ? '<li>我喜歡-國小 (I Like)</li>' : ''
    })
    cardsSetString += '</ul>'
    return cardsSetString.slice(0, -1)
  }
})

const statusString = computed(() => {
  return props.report.status === '0' ? '進行中' : props.report.status === '1' ? '已完成' : '已取消'
})

</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon
        size="xsmall"
        icon="mdi-pencil"
        style="cursor: pointer; margin-right: 8px;"
        @click="openEditDialog"
      />
      {{
        report.report_name === null || report.report_name === ''
          ? `${report.report_id} (未設定名稱)`
          : report.report_name
      }}
    </v-card-title>
    <v-card-text>
      <div class="exam-card-content">
        <ul class="content-list">
          <!-- TODO: 內容規劃 -->
          <li>序號: {{ report.report_id }}</li>
          <li>卡片組合: <span v-html="cardsSetString" /></li>
          <li>測驗狀態: {{ statusString }}</li>
          <li>建立時間: {{ NULLstringFilter(report.created_at) }}</li>
          <li>更新時間: {{ NULLstringFilter(report.updated_at) }}</li>
          <li>發送測驗信箱: {{ NULLstringFilter(report.target_email) }}</li>
        </ul>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        variant="tonal"
        color="#FA5015"
        size="large"
        rounded="xl"
      >
        <v-icon>mdi-eye</v-icon>
        查看
      </v-btn>

      <v-btn
        variant="tonal"
        color="#1976D2"
        size="large"
        rounded="xl"
        @click="openEmailDialog"
      >
        <v-icon>mdi-email</v-icon>
        登錄信箱
      </v-btn>

      <v-spacer />
      <v-btn
        variant="tonal"
        color="#FA5015"
        size="large"
        rounded="xl"
        @click="startExam"
      >
        <v-icon>mdi-pencil</v-icon>
        進行測驗
      </v-btn>
    </v-card-actions>

    <!-- 編輯報告名稱對話視窗 -->
    <v-dialog
      v-model="showEditDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h6">
          編輯報告名稱
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingReportName"
            label="報告名稱"
            placeholder="請輸入報告名稱"
            variant="outlined"
            @keyup.enter="saveReportName"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeEditDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            @click="saveReportName"
          >
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編輯信箱對話視窗 -->
    <v-dialog
      v-model="showEmailDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h6">
          登錄信箱
        </v-card-title>
        <v-card-text>
          <div class="email-input-container">
            <v-text-field
              v-model="editingEmail"
              label="信箱地址"
              placeholder="請輸入信箱地址"
              variant="outlined"
              type="email"
              :error-messages="emailError"
              prepend-inner-icon="mdi-email"
              class="email-input"
              @keyup.enter="saveEmail"
            />
            <v-btn
              color="primary"
              variant="tonal"
              :disabled="!editingEmail.trim() || !!emailError"
              class="save-email-btn"
              @click="saveEmail"
            >
              <v-icon>mdi-content-save</v-icon>
              存儲
            </v-btn>
          </div>
          <div class="text-caption text-grey mt-2">
            此信箱將用於發送測驗連結
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeEmailDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!editingEmail.trim() || !!emailError"
            @click="sendEmail"
          >
            <v-icon>mdi-send</v-icon>
            發送
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style lang="scss" scoped>
.exam-card-content {
  .content-list {
    list-style: '\1F4CC';
    padding: 5px;
    margin-left: 20px;

    .sub-list {
      list-style: none;
      padding-left: 5px;
    }

    li {
      text-indent: 10px;
    }
  }
}

.email-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  .email-input {
    flex: 1;
  }

  .save-email-btn {
    margin-top: 8px;
    min-width: 80px;
  }
}
</style>
