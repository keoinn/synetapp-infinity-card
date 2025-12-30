<script setup>
/**
 * 測驗結果顯示組件（客戶端視圖）
 * 
 * 此組件以對話框形式顯示測驗結果，包含三個主要標籤頁：
 * - 職業雷達圖：使用 Chart.js 繪製雷達圖，顯示各職業在「我重視 (I Care)」、「我喜歡 (I Like)」、「我可以 (I Can)」三個維度的配對率
 * - 綜合解析：顯示測驗結果的文字解析，包括綜合解析、活動偏好、擅長知能、適配職業別、補充說明等
 * - 分析結果: 職業配對：以表格形式顯示各職業在三個維度的配對率，並根據比率值顯示不同的顏色標記
 * 
 * @component ExamClientResult
 * 
 * @features
 * - 響應式對話框設計，高度為 90% 視窗高度
 * - 自動監聽測驗流程狀態變化，即時更新結果
 * - 雷達圖自動顯示配對率最高的職業
 * - 職業配對表格根據比率值顯示不同顏色（高/中高/中/低）
 * - 支援多語言顯示（使用 vue-i18n）
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理，提供 calculatePairResult 和 calculate_pick.total.h_code
 * - @/plugins/utils/psy_cards - 提供 getFinalResult 函數，根據 h_code 獲取最終結果
 * - chart.js - 用於繪製雷達圖
 * - vue-i18n - 用於多語言支援
 * 
 * @data
 * - dialogIsActive: 控制對話框顯示/隱藏
 * - finalResultObj: 儲存最終測驗結果物件
 * - pairResult: 儲存職業配對結果
 * - currentTab: 當前選中的標籤頁索引（0: 職業雷達圖, 1: 綜合解析, 2: 職業配對）
 * - radarChartInstance: Chart.js 圖表實例
 * 
 * @computed
 * - filterResultRateForProfession: 過濾掉 'total' 鍵後的職業配對結果
 * - findMaxValueInJobs: 找出配對率最高的職業標題
 * 
 * @methods
 * - finalResult(attrName): 根據屬性名稱獲取最終結果的對應值
 * - getRatioClass(ratio): 根據比率值返回對應的 CSS class
 * - formatRatio(ratio): 格式化比率值為百分比字串
 * - paddingNewLineForCol(col): 對超過 4 個字符的字符串插入換行標籤
 * - filterResultForProfessionRate(card_type, index, result): 獲取特定職業的特定類型配對率
 * - drawRadarChart(): 繪製雷達圖
 * - radarChartData(): 生成雷達圖數據
 * 
 * @watch
 * - dialogIsActive: 當對話框打開時，載入配對結果並繪製雷達圖
 * - currentTab: 當切換到職業雷達圖標籤頁時，重新繪製雷達圖
 * - examProcess.calculate_pick.total.h_code: 監聽 h_code 變化，即時更新文字結果
 * 
 * @lifecycle
 * - onMounted: 初始化時嘗試載入測驗結果
 * 
 * @example
 * <ExamClientResult />
 * 
 * 組件會自動從 examProcess store 讀取數據，無需傳入 props
 */
/* eslint-disable vue/no-v-html */
/* eslint-disable vue/no-v-text-v-html-on-component */
/* eslint-disable no-unused-vars */

import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'
import { getFinalResult } from '@/plugins/utils/psy_cards'
import { Chart, registerables } from 'chart.js';
import { useI18n } from 'vue-i18n'
Chart.register(...registerables);

const { t } = useI18n()
const dialogIsActive = ref(false)
const examProcess = useExamProcessStore()
const finalResultObj = ref(null)
const radarChartRef = ref(null)
const pairResult = ref(null)
const currentTab = ref(0)
const radarChartInstance = ref(null)

watch(dialogIsActive, async (newVal) => {
  if (newVal) {
    pairResult.value = examProcess.calculatePairResult
    await nextTick()
    if (radarChartRef.value && currentTab.value === 0) {
      drawRadarChart()
    }
  }
})

watch(currentTab, async (newVal) => {
  if (newVal === 0) {
    await nextTick()
    if (radarChartRef.value) {
      drawRadarChart()
    }
  }
})

// 監聽 h_code 的變化，確保文字結果能及時更新
watch(() => examProcess.calculate_pick.total.h_code, (newHCode) => {
  if (newHCode && newHCode !== null && newHCode !== undefined) {
    const result = getFinalResult(newHCode)
    if (result) {
      finalResultObj.value = result
    }
  }
}, { immediate: true })

const finalResult = (attrName) => {
  if (!finalResultObj.value) {
    return ''
  }
  return finalResultObj.value[attrName] || ''
}

// 比率閾值設定（可調整）
const RATIO_THRESHOLDS = {
  HIGH: 66,
  MEDIUM_HIGH: 50,
  MEDIUM: 33
}

// 根據比率值返回對應的 class
const getRatioClass = (ratio) => {
  if (ratio > RATIO_THRESHOLDS.HIGH) {
    return 'high-ratio'
  } else if (ratio > RATIO_THRESHOLDS.MEDIUM_HIGH) {
    return 'medium-high-ratio'
  } else if (ratio > RATIO_THRESHOLDS.MEDIUM) {
    return 'medium-ratio'
  } else {
    return 'low-ratio'
  }
}

const formatRatio = (ratio) => {
  return `${ratio.toFixed(2)} %`
}

const paddingNewLineForCol = (col) => {
  // 檢查輸入是否為字符串且長度大於 4
  if (typeof col === 'string' && Array.from(col).length > 4) {
    // 將字符串分割為字符數組，並在第四個和第五個字符之間插入 <br>
    let chars = Array.from(col)
    chars.splice(4, 0, '<br>')
    return chars.join('')
  }
  return col
}

const filterResultForProfessionRate = (card_type, index, result) => {
  if (index === 'total') {
    return
  }
  return result.rate[card_type]
}

const filterResultRateForProfession = computed(() => {
  if (!pairResult.value) return null
  // 使用 Object.entries() 将对象转换为键值对数组，然后过滤掉键为 'total' 的项
  const filteredEntries = Object.entries(pairResult.value).filter(([key]) => key !== 'total')
  // 使用 Object.fromEntries() 将过滤后的键值对数组转换回对象
  return Object.fromEntries(filteredEntries)
})



onMounted(() => {
  // 初始化時嘗試載入結果
  const hCode = examProcess.calculate_pick.total.h_code
  console.log('onMounted h_code:', hCode)
  
  if (hCode && hCode !== null && hCode !== undefined) {
    const result = getFinalResult(hCode)
    console.log('onMounted final result:', result)
    if (result) {
      finalResultObj.value = result
    }
  }
})

const drawRadarChart = () => {
  if (!radarChartRef.value) return
  
  // 如果已經有圖表實例，先銷毀它
  if (radarChartInstance.value) {
    radarChartInstance.value.destroy()
    radarChartInstance.value = null
  }
  
  const ctx = radarChartRef.value.getContext('2d')
  radarChartInstance.value = new Chart(ctx, {
      type: 'radar',
      data: radarChartData().value,
      options: {
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 16,
              },
            },
          },
        },
        responsive: true, // 设置图表为响应式，根据屏幕窗口变化而变化
        maintainAspectRatio: true, // 保持图表原有比例
        elements: {
          line: {
            borderWidth: 3, // 设置线条宽度
          },
        },
        scales: {
          r: {
            //   beginAtZero: true, //從 0 開始計算
            //   startAngle: 90, // 選轉角度

            //   angleLines: {
            //     display: false, // 對角線隱藏
            //   },
            //   grid: {
            //     color: '#000', // 六邊型顏色
            //   },
            max: 100, //最大數值
            min: 0, //最小數值
            ticks: {
              display: true,
              // color: 'red', //數值顏色
              stepSize: 10, //寬距
              font: {
                size: 15,
              },
            },
            pointLabels: {
              // color: '#000', //六邊 lebal 顏色
              font: {
                size: 20, //六邊 lebal 字體
              },
            },
          },
        },
      },
    });
}

const radarChartData = () => {
  const labels = ["我重視 (I Care)", "我喜歡 (I Like)", "我可以 (I Can)"]
  const backgroundColors = ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"]
  const borderColors = ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)"]
  const pointBackgroundColors = ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)"]
  const pointBorderColors = ["#fff", "#fff", "#fff"]
  const pointHoverBackgroundColors = ["#fff", "#fff", "#fff"]
  const pointHoverBorderColors = ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)"]
  const showLabel = findMaxValueInJobs.value

  const datasets = Object.entries(pairResult.value).filter(([key, value]) => key !== 'total').map(([key, value], index) => {
    const isShow = value.title === showLabel ? true : false
    return {
      label: value.title,
      data: [value.rate.care, value.rate.like, value.rate.can],
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      pointBackgroundColor: pointBackgroundColors[index],
      pointBorderColor: pointBorderColors[index],
      pointHoverBackgroundColor: pointHoverBackgroundColors[index],
      pointHoverBorderColor: pointHoverBorderColors[index],
      hidden: !isShow,
    }
  })

  return computed(() => {
    return {
      labels: labels,
      datasets: datasets
    }
  })

}

const findMaxValueInJobs = computed(() => {
  let maxRate = 0;
  let maxTitle = "";

  // 遍歷每個職業
  Object.values(pairResult.value).forEach(job => {
    if (job.rate) {
      // 檢查每個 rate 是否大於當前最大值
      if (job.rate.care > maxRate) {
        maxRate = job.rate.care;
        maxTitle = job.title;
      }
      if (job.rate.like > maxRate) {
        maxRate = job.rate.like;
        maxTitle = job.title;
      }
      if (job.rate.can > maxRate) {
        maxRate = job.rate.can;
        maxTitle = job.title;
      }
    }
  });

  return maxTitle;
})


</script>

<template>
  <v-dialog
    v-model="dialogIsActive"
    transition="dialog-bottom-transition"
    scrollable
    height="90%"
    class="report-dialog"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="flat"
        size="small"
        color="primary"
        rounded="xl"
        :text="t('playground.viewReport')"
      />
    </template>

    <template #default>
      <v-card>
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

        <v-tabs
          v-model="currentTab"
          bg-color="primary"
          align-tabs="start"
        >
          <v-tab value="0">
            職業雷達圖
          </v-tab>
          <v-tab value="1">
            綜合解析
          </v-tab>
          <v-tab value="2">
            分析結果: 職業配對
          </v-tab>
        </v-tabs>

        <v-window v-model="currentTab">
          <v-window-item value="0">
            <v-card-text class="tab-content">
              <h2>職業雷達圖</h2>
              <v-divider />
              <div class="trait-selection-container">
                <div class="quote-block">
                  預留文字區塊
                </div>
                <div class="radar-chart-container">
                  <canvas ref="radarChartRef" />
                </div>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="1">
            <v-card-text class="tab-content">
              <v-card color="primary" class="mb-4">
                <v-card-title>綜合解析</v-card-title>
                <v-divider />
                <v-card-text class="result-text" v-html="finalResult('summary')" />
              </v-card>
              <v-card color="primary" class="mb-4">
                <v-card-title>活動偏好 - 興趣</v-card-title>
                <v-divider />
                <v-card-text class="result-text" v-html="finalResult('interest')" />
              </v-card>
              <v-card color="primary" class="mb-4">
                <v-card-title>擅長知能 - 能力</v-card-title>
                <v-divider />
                <v-card-text class="result-text" v-html="finalResult('ability')" />
              </v-card>
              <v-card color="primary" class="mb-4">
                <v-card-title>適配職業別</v-card-title>
                <v-divider />
                <v-card-text class="result-text" v-html="finalResult('career')" />
              </v-card>
              <v-card color="primary" class="mb-4">
                <v-card-title>補充說明</v-card-title>
                <v-divider />
                <v-card-text class="result-text" v-html="finalResult('note')" />
              </v-card>
            </v-card-text>
          </v-window-item>

          <v-window-item value="2">
            <v-card-text class="tab-content">
              <h2>分析結果: 職業配對</h2>
              <v-divider />
              <div class="trait-selection-container">
                <div class="quote-block">
                  預留文字區塊
                </div>
                <v-table
                  v-if="pairResult !== null"
                  class="result-table trait-selection-table"
                >
                  <thead>
                    <tr align="center">
                      <th class="text-center">
                        類型
                      </th>
                      <th
                        v-for="(item, index) in filterResultRateForProfession"
                        :key="index"
                        class="text-center"
                        v-html="paddingNewLineForCol(item.title)"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>我在乎</td>
                      <td
                        v-for="(item, index) in filterResultRateForProfession"
                        :key="index"
                        :class="getRatioClass(filterResultForProfessionRate('care', index, item))"
                      >
                        {{ formatRatio(filterResultForProfessionRate('care', index, item)) }}
                      </td>
                    </tr>
                    <tr>
                      <td>我可以</td>
                      <td
                        v-for="(item, index) in filterResultRateForProfession"
                        :key="index"
                        :class="getRatioClass(filterResultForProfessionRate('can', index, item))"
                      >
                        {{ formatRatio(filterResultForProfessionRate('can', index, item)) }}
                      </td>
                    </tr>
                    <tr>
                      <td>我喜歡</td>
                      <td
                        v-for="(item, index) in filterResultRateForProfession"
                        :key="index"
                        :class="getRatioClass(filterResultForProfessionRate('like', index, item))"
                      >
                        {{ formatRatio(filterResultForProfessionRate('like', index, item)) }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>

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
.result-text {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
  background-color: #f0f0f0;
  padding: 10px;
  
  :deep(ul) {
    list-style-type: none;
    padding-left: 20px;
    
    li {
      margin-bottom: 10px;
    }
  }
}



.radar-chart-container {
  max-width: 600px;
  max-height: 600px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 5% auto;
}

.trait-selection-container {
  max-width: 980px;
  margin: 0 auto;
}

.quote-block {
  font-size: 14pt;
  background-color: #e0e0e0;
  color: #000;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 5%;
}

.result-table {
  max-width: 900px;

  :deep(table) {
    border-spacing: 3px !important; /* 強制設定格子之間的間隔 */
  }

  td {
    text-align: center;
  }

  .high-ratio {
    background-color: #c6efce;
    color: #006100;
    border-radius: 10px;
    border: 1px dashed #006100;
  }
  .medium-high-ratio {
    background-color: #ffeb9c;
    color: #9c5700;
    border-radius: 10px;
    border: 1px dashed #9c5700;
  }
  .medium-ratio {
    background-color: #ffc7ce;
    color: #9c0006;
    border-radius: 10px;
    border: 1px dashed #9c0006;
  }
  .low-ratio {
    border-radius: 10px;
    border: 1px dashed #000;
  }
}

.trait-selection-table {
  margin: 5%;
}

.tab-content {
  max-height: calc(90vh - 200px);
  overflow-y: auto;
  padding: 16px;
}
</style>