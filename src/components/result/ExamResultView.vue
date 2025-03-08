<script setup>
import { onMounted, ref, computed } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'

const examProcess = useExamProcessStore()
const pickExamResult = ref(examProcess.computedPickCardsHollandCodeNum)

// 新增一個計算屬性來處理資料格式
const formattedExamResults = computed(() => {
  return Object.entries(pickExamResult.value).map(([type, data]) => ({
    type,
    ...data
  }))
})

const stringOfType = (type) => {
  switch (type) {
    case 'care':
      return '我在乎'
    case 'cj':
      return '我可以 (社青版)'
    case 'ce':
      return '我可以 (國小版)'
    case 'le':
      return '我喜歡 (國小版)'
    case 'lj':
      return '我喜歡 (社青版)'
    case 'total':
      return '總數'
    default:
      return type
  }
}

// 控制對話框開啟的狀態
const dialogIsActive = ref(false)

onMounted(() => {
  // console.log(examProcess.pick_care)
  // console.log(examProcess.pick_ce)
  // console.log(examProcess.pick_cj)
  // console.log(examProcess.pick_le)
  // console.log(examProcess.pick_lj)
  // console.log(examProcess.computedPickCardsHollandCodeNum)
  // console.log(formattedExamResults.value)
})
/**
 {"goal":{"R":"0","I":"0","A":"0","S":"0","E":"0","C":"0"},"care":{"R":"2","I":"3","A":"4","S":"6","E":"2","C":"2"},"like":{"R":"1","I":"3","A":"2","S":"1","E":"2","C":"5"},"can":{"R":"3","I":"0","A":"1","S":"7","E":"5","C":"4"},"job":{"j1":{"opt":"","care":"5","like":"","can":""},"j2":{"opt":"","care":"0","like":"","can":""},"j3":{"opt":"","care":"","like":"","can":""}}}
 */
</script>

<template>
  <!-- TODO: Start: 檢視報告 // fullscreen -->
  <v-dialog
    v-model="dialogIsActive"
    transition="dialog-bottom-transition"
    scrollable
    height="80%"
    class="report-dialog"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="flat"
        size="small"
        color="primary"
        rounded="xl"
        class="mb-1"
        text="檢視報告"
      />
    </template>

    <template #default>
      <v-card>
        <!-- 工具箱 -->
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="dialogIsActive = false"
          />

          <v-toolbar-title>測驗結果</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              text="下載報告"
              variant="text"
              @click="dialogIsActive = false"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <!-- 卡片挑選結果 -->
          <h2>卡片挑選結果</h2>
          <v-divider />
          <v-table class="result-table">
            <thead>
              <tr align="center">
                <th class="text-center">
                  類型
                </th>
                <th class="text-center">
                  實用型<br>(R)
                </th>
                <th class="text-center">
                  研究型<br>(I)
                </th>
                <th class="text-center">
                  藝術型<br>(A)
                </th>
                <th class="text-center">
                  社會型<br>(S)
                </th>
                <th class="text-center">
                  企業型<br>(E)
                </th>
                <th class="text-center">
                  事務型<br>(C)
                </th>
                <th class="text-center">
                  總數
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in formattedExamResults"
                :key="item.type"
              >
                <td>{{ stringOfType(item.type) }}</td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_r }}
                </td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_i }}
                </td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_a }}
                </td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_s }}
                </td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_e }}
                </td>
                <td :class="item.type === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.cate_c }}
                </td>
                <td class="total-cell">
                  {{ item.type_total }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- 職業卡牌 -->
          <h2 class="mt-8">
            職業卡牌
          </h2>
          <v-divider />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text="關閉報告頁面"
            @click="dialogIsActive = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" scoped>
.report-dialog {
  max-height: 100vh;
}

.text-center {
  text-align: center;
}

.result-table {
  max-width: 900px;

  ::v-deep {
    table {
      border-spacing: 3px !important; /* 強制設定格子之間的間隔 */
    }
  }

  td {
    text-align: center;
  }

  .total-cell {
    background-color: rgb(170, 253, 249);
    border-radius: 10px;
  }
  .raw-cell {
    background-color: rgb(255, 246, 168);
    border-radius: 10px;
  }
}
</style>
