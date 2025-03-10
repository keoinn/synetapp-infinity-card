<script setup>
/* eslint-disable vue/no-v-html */
import { onMounted, ref, computed, watch } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'

const examProcess = useExamProcessStore()
const pickExamResult = ref(null)
const pairExamResult = ref(null)
// 新增一個計算屬性來處理資料格式
const formattedExamResults = computed(() => {
  if (pickExamResult.value === null) {
    return null
  }
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

watch(dialogIsActive, async (newVal) => {
  if (newVal) {
    pickExamResult.value = await examProcess.computedPickCardsHollandCodeNum
    pairExamResult.value = await examProcess.computedPairCardsHollandCodeNum
    console.log(pickExamResult.value)
    console.log(pairExamResult.value)
    
  }
})

onMounted(async () => {
  pickExamResult.value = await examProcess.computedPickCardsHollandCodeNum
  pairExamResult.value = await examProcess.computedPairCardsHollandCodeNum
})

const filterResultForProfessionName= (index,result) => {
  if(index === 'total') {
    return '總數'
  }
  return result.name
}

const filterResultForProfessionCol= (card_type, index, result) => {
  if(index === 'total') {
    if(card_type === 'care') {
      return result['care_total']
    } else if(card_type === 'like') {
      return result['like_total']
    } else if(card_type === 'can') {
      return result['can_total']
    } else{
      return result['all_total']
    }
  }

  return result[card_type]
}

const paddingNewLineForCol = (col) => {
  // 檢查輸入是否為字符串且長度大於 4
  if (typeof col === 'string' && Array.from(col).length > 4) {
    // 將字符串分割為字符數組，並在第四個和第五個字符之間插入 <br>
    let chars = Array.from(col);
    chars.splice(4, 0, '<br>');
    return chars.join('');
  }
  return col;
}
/**
{"goal":{"R":"0","I":"0","A":"0","S":"0","E":"0","C":"0"},"care":{"R":"2","I":"3","A":"4","S":"6","E":"2","C":"2"},"like":{"R":"1","I":"3","A":"2","S":"1","E":"2","C":"5"},"can":{"R":"3","I":"0","A":"1","S":"7","E":"5","C":"4"},"job":{"j1":{"opt":"0038","care":"6","like":"5","can":"2"},"j2":{"opt":"0086","care":"9","like":"10","can":"12"},"j3":{"opt":"0093","care":"4","like":"5","can":"0"}}}
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
          <v-table
            v-if="pickExamResult !== null"
            class="result-table"
          >
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
          <v-table
            v-if="pairExamResult !== null"
            class="result-table"
          >
            <thead>
              <tr align="center">
                <th class="text-center">
                  類型
                </th>
                <th
                  v-for="(item, index) in pairExamResult"
                  :key="index"
                  class="text-center"
                  v-html="paddingNewLineForCol(filterResultForProfessionName(index, item))"
                />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>我在乎</td>
                <td 
                  v-for="(item, index) in pairExamResult" 
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCol('care', index, item) }}
                </td>
              </tr>
              <tr>
                <td>我喜歡</td>
                <td
                  v-for="(item, index) in pairExamResult"
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCol('like', index, item) }}
                </td>
              </tr>
              <tr>
                <td>我可以</td>
                <td
                  v-for="(item, index) in pairExamResult"
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCol('can', index, item) }}
                </td>
              </tr>
              <tr>
                <td>總數</td>
                <td
                  v-for="(item, index) in pairExamResult"
                  :key="index"
                  class="total-cell"
                >
                  {{ filterResultForProfessionCol('total', index, item) }}
                </td>
              </tr>
            </tbody>
          </v-table>
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
