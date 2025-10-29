<script setup>
/* eslint-disable vue/no-v-html */
import { computed, ref } from 'vue'
import { encrypt } from '@/plugins/utils/encryption'
import { useExamProcessStore } from '@/stores/examProcess'
import { useRouter } from 'vue-router'
import { sendEmailAPI } from '@/plugins/utils/requests/api/backend'
import { handleAlert } from '@/plugins/utils/alert'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update-report-name', 'update-report-email'])

const { t } = useI18n()
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
    emailError.value = t('exam.errorReceiveEmailEmpty')
    return
  }
  
  if (!validateEmail(editingEmail.value.trim())) {
    emailError.value = t('exam.errorReceiveEmailInvalid')
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
    emailError.value = t('exam.errorReceiveEmailEmpty')
    return
  }
  
  if (!validateEmail(editingEmail.value.trim())) {
    emailError.value = t('exam.errorReceiveEmailInvalid')
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
      text: `${t('exam.examLinkSentSuccess')}:` + editingEmail.value.trim()
    })
    
    console.log('測驗連結已成功發送到:', editingEmail.value.trim())
    
  } catch (error) {
    handleAlert({
      auction: 'error',
      text: `${t('exam.errorSendEmailFailed')}:` + error
    })
    console.error('發送測驗連結失敗:', error)
    emailError.value = t('exam.errorSendEmailFailedTryAgain')
  }
}

const startExam = () => {
  examProcessStore.$reset()
  router.push(`/exam/${encrypt(props.report.report_id.toString())}`)
}

const NULLstringFilter = (target) => {
  return target === null ? `${t('exam.examPanelEmptyEmail')}` : target
}

const cardsSetStringFilter = (card) => {
  return card === 'goal' ? t('exam.examPanelGoal') : 
        card === 'care' ? t('exam.examPanelCare') : 
        card === 'ce' ? t('exam.examPanelCe') : 
        card === 'cj' ? t('exam.examPanelCj') : 
        card === 'lj' ? t('exam.examPanelLj') : 
        card === 'le' ? t('exam.examPanelLe') : ''
}



const statusString = computed(() => {
  return props.report.status === '0' ? `${t('exam.examPanelReportInProgress')}` : props.report.status === '1' ? `${t('exam.examPanelReportCompleted')}` : `${t('exam.examPanelReportCancelled')}`
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
          ? `${report.report_id} (${t('exam.examPanelReportEmptyName')})`
          : report.report_name
      }}
    </v-card-title>
    <v-card-text>
      <div class="exam-card-content">
        <ul class="content-list">
          <!-- TODO: 內容規劃 -->
          <li>{{ t('exam.examSn') }}: {{ report.report_id }}</li>
          <li>{{ t('exam.examStatus') }}: {{ statusString }}</li>
          <li>{{ t('exam.examCreatedAt') }}: {{ NULLstringFilter(report.created_at) }}</li>
          <li>{{ t('exam.examUpdatedAt') }}: {{ NULLstringFilter(report.updated_at) }}</li>
          <li>{{ t('exam.examTargetEmail') }}: {{ NULLstringFilter(report.target_email) }}</li>
          <li>{{ t('exam.examCardsSet') }}:</li>
          <div class="cardset-container">
            <v-chip
              v-for="card in props.report.cards_set"
              :key="card"
              class="cardset-label"
              variant="elevated"
              :color="card === 'goal' ? 'success' : 
                card === 'care' ? 'error' : 
                card === 'ce' ? 'primary' : 
                card === 'cj' ? 'info' : 
                card === 'lj' ? 'yellow' : 
                card === 'le' ? 'warning' : ''"
              size="small"
            >
              {{ cardsSetStringFilter(card) }}
            </v-chip>
          </div>
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
        {{ t('exam.examPanelView') }}
      </v-btn>

      <v-btn
        variant="tonal"
        color="#1976D2"
        size="large"
        rounded="xl"
        @click="openEmailDialog"
      >
        <v-icon>mdi-email</v-icon>
        {{ t('exam.examPanelSetEmail') }}
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
        {{ t('exam.examPanelStartExam') }}
      </v-btn>
    </v-card-actions>

    <!-- 編輯報告名稱對話視窗 -->
    <v-dialog
      v-model="showEditDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ t('exam.editReportName') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingReportName"
            :label="t('exam.examReportName')"
            :placeholder="t('exam.enterReportNamePlaceholder')"
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
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            @click="saveReportName"
          >
            {{ t('common.save') }}
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
          {{ t('exam.setReceiveEmail') }}
        </v-card-title>
        <v-card-text>
          <div class="email-input-container">
            <v-text-field
              v-model="editingEmail"
              :label="t('common.email')"
              :placeholder="t('exam.enterEmailPlaceholder')"
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
              {{ t('common.save') }}
            </v-btn>
          </div>
          <div class="text-caption text-grey mt-2">
            {{ t('exam.setReceiveEmailDescription') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeEmailDialog"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!editingEmail.trim() || !!emailError"
            @click="sendEmail"
          >
            <v-icon>mdi-send</v-icon>
            {{ t('common.send') }}
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
    .cardset-container {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
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
