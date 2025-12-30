<script setup>
/**
 * 諮商師報告組件
 * 
 * 此組件提供一個全螢幕對話框，顯示完整的測驗結果統計報告，包括：
 * - 分析結果: 特質挑選：顯示各類型（goal, care, ce, cj, le, lj）的 RIASEC 類型百分比和荷倫碼
 * - 卡片挑選結果：顯示各類型的原始卡片計數（R, I, A, S, E, C）
 * - 分析結果: 職業配對：顯示各職業在「我在乎」、「我可以」、「我喜歡」三個維度的配對百分比
 * - 職業卡牌配對結果：顯示各職業配對的原始計數
 * - 職業卡牌雷達圖：使用 Chart.js 繪製三維度（我重視、我喜歡、我可以）的雷達圖，預設顯示最高分職業
 * 
 * @component ExamCounselorResult
 * 
 * @usedBy 
 * - @/pages/exam/[token].vue | router: /exam/[token]
 * 
 * @example
 * 使用方式：
 * <ExamCounselorResult />
 * 組件會自動從 examProcess store 讀取計算結果並顯示
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理（提供 calculatePickResult 和 calculatePairResult）
 * - chart.js - 圖表繪製庫（用於繪製雷達圖）
 * - vue - Vue 3 Composition API（onMounted, ref, watch, computed, nextTick）
 * 
 * @features
 * - 響應式對話框，高度為 90% 視窗高度
 * - 標籤頁切換顯示不同統計結果
 * - 自動計算並高亮顯示最高分職業（雷達圖預設顯示）
 * - 數據格式化：百分比顯示、長標題自動換行
 * - 顏色編碼：根據百分比區間顯示不同背景色（高/中高/中/低）
 * 
 * @lifecycle
 * - onMounted: 從 examProcess store 載入 pickResult 和 pairResult
 * - watch(dialogIsActive): 當對話框開啟時載入數據並繪製雷達圖（如果當前標籤為雷達圖）
 * - watch(currentTab): 當切換到雷達圖標籤時自動繪製圖表
 */

/* eslint-disable vue/no-v-html */
/* eslint-disable no-unused-vars */

import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const examProcess = useExamProcessStore()
const pickResult = ref(null)
const pairResult = ref(null)
const radarChartRef = ref(null)
const currentTab = ref(0)
const radarChartInstance = ref(null)

const stringOfType = (type) => {
  switch (type) {
    case 'goal':
      return '我就是'
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
    case 'can':
      return '我可以'
    case 'like':
      return '我喜歡'
    default:
      return type
  }
}

// 控制對話框開啟的狀態
const dialogIsActive = ref(false)

watch(dialogIsActive, async (newVal) => {
  if (newVal) {
    pickResult.value = examProcess.calculatePickResult
    pairResult.value = examProcess.calculatePairResult
    await nextTick()
    if (radarChartRef.value && currentTab.value === '4') {
      drawRadarChart()
    }
  }
})

watch(currentTab, async (newVal) => {
  if (newVal === '4') {
    await nextTick()
    if (radarChartRef.value) {
      drawRadarChart()
    }
  }
})

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

const formatRatio = (ratio) => {
  return `${ratio.toFixed(2)} %`
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

const filterResultForProfessionCount = (card_type, index, result) => {
  return result[card_type]
}

const filterResultForProfessionRate = (card_type, index, result) => {
  if (index === 'total') {
    return
  }
  return result.rate[card_type]
}

const filterResultRateForProfession = computed(() => {
  // 使用 Object.entries() 将对象转换为键值对数组，然后过滤掉键为 'total' 的项
  const filteredEntries = Object.entries(pairResult.value).filter(([key, value]) => key !== 'total')
  // 使用 Object.fromEntries() 将过滤后的键值对数组转换回对象
  return Object.fromEntries(filteredEntries)
})

// 過濾掉 pickResult 中的 total 項
const filteredPickResult = computed(() => {
  if (!pickResult.value) return null
  const filteredEntries = Object.entries(pickResult.value).filter(([key]) => key !== 'total')
  return Object.fromEntries(filteredEntries)
})

// 過濾掉 pairResult 中的 total 項（用於職業卡牌配對結果表格）
const filteredPairResult = computed(() => {
  if (!pairResult.value) return null
  const filteredEntries = Object.entries(pairResult.value).filter(([key]) => key !== 'total')
  return Object.fromEntries(filteredEntries)
})

onMounted(async () => {
  pickResult.value = examProcess.calculatePickResult
  pairResult.value = examProcess.calculatePairResult
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
              size: 16
            }
          }
        }
      },
      responsive: true, // 设置图表为响应式，根据屏幕窗口变化而变化
      maintainAspectRatio: true, // 保持图表原有比例
      elements: {
        line: {
          borderWidth: 3 // 设置线条宽度
        }
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
              size: 15
            }
          },
          pointLabels: {
            // color: '#000', //六邊 lebal 顏色
            font: {
              size: 20 //六邊 lebal 字體
            }
          }
        }
      }
    }
  })
}

const radarChartData = () => {
  const labels = ['我重視 (I Care)', '我喜歡 (I Like)', '我可以 (I Can)']
  const backgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)'
  ]
  const borderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)']
  const pointBackgroundColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)']
  const pointBorderColors = ['#fff', '#fff', '#fff']
  const pointHoverBackgroundColors = ['#fff', '#fff', '#fff']
  const pointHoverBorderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)']
  const showLabel = findMaxValueInJobs.value

  const datasets = Object.entries(pairResult.value)
    .filter(([key, value]) => key !== 'total')
    .map(([key, value], index) => {
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
        hidden: !isShow
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
  let maxRate = 0
  let maxTitle = ''

  // 遍歷每個職業
  Object.values(pairResult.value).forEach((job) => {
    if (job.rate) {
      // 檢查每個 rate 是否大於當前最大值
      if (job.rate.care > maxRate) {
        maxRate = job.rate.care
        maxTitle = job.title
      }
      if (job.rate.like > maxRate) {
        maxRate = job.rate.like
        maxTitle = job.title
      }
      if (job.rate.can > maxRate) {
        maxRate = job.rate.can
        maxTitle = job.title
      }
    }
  })

  return maxTitle
})
</script>

<template>
  <!-- TODO: Start: 檢視報告 // fullscreen -->
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
        class="mb-1"
        text="諮商師報告"
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

          <v-toolbar-title>統計結果</v-toolbar-title>

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
            分析結果: 特質挑選
          </v-tab>
          <v-tab value="1">
            卡片挑選結果
          </v-tab>
          <v-tab value="2">
            分析結果: 職業配對
          </v-tab>
          <v-tab value="3">
            職業卡牌配對結果
          </v-tab>
          <v-tab value="4">
            職業卡牌雷達圖
          </v-tab>
        </v-tabs>

        <v-window v-model="currentTab">
          <v-window-item value="0">
            <v-card-text>
              <h2>分析結果: 特質挑選</h2>
              <v-divider />
              <div class="trait-selection-container">
                <div class="quote-block">
                  預留文字區塊
                </div>
                <v-table
                  v-if="pickResult !== null"
                  class="result-table trait-selection-table"
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
                        荷倫碼
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="(item, key) in pickResult"
                    :key="key"
                  >
                    <tr>
                      <td>{{ stringOfType(key) }}</td>
                      <td :class="getRatioClass(item.rate.r)">
                        {{ formatRatio(item.rate.r) }}
                      </td>
                      <td :class="getRatioClass(item.rate.i)">
                        {{ formatRatio(item.rate.i) }}
                      </td>
                      <td :class="getRatioClass(item.rate.a)">
                        {{ formatRatio(item.rate.a) }}
                      </td>
                      <td :class="getRatioClass(item.rate.s)">
                        {{ formatRatio(item.rate.s) }}
                      </td>
                      <td :class="getRatioClass(item.rate.e)">
                        {{ formatRatio(item.rate.e) }}
                      </td>
                      <td :class="getRatioClass(item.rate.c)">
                        {{ formatRatio(item.rate.c) }}
                      </td>
                      <td class="h-code">
                        {{ item.h_code }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="1">
            <v-card-text>
              <h2>卡片挑選結果</h2>
              <v-divider />
              <div class="trait-selection-container">
                <div class="quote-block">
                  預留文字區塊
                </div>
                <v-table
                  v-if="pickResult !== null"
                  class="result-table trait-selection-table"
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, key) in filteredPickResult"
                      :key="key"
                    >
                      <td>{{ stringOfType(key) }}</td>
                      <td class="raw-cell">
                        {{ item.r }}
                      </td>
                      <td class="raw-cell">
                        {{ item.i }}
                      </td>
                      <td class="raw-cell">
                        {{ item.a }}
                      </td>
                      <td class="raw-cell">
                        {{ item.s }}
                      </td>
                      <td class="raw-cell">
                        {{ item.e }}
                      </td>
                      <td class="raw-cell">
                        {{ item.c }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="2">
            <v-card-text>
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

          <v-window-item value="3">
            <v-card>
              <v-card-text>
                <h2>職業卡牌配對結果</h2>
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
                          v-for="(item, index) in filteredPairResult"
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
                          v-for="(item, index) in filteredPairResult"
                          :key="index"
                          class="raw-cell"
                        >
                          {{ filterResultForProfessionCount('care', index, item) }}
                        </td>
                      </tr>
                      <tr>
                        <td>我可以</td>
                        <td
                          v-for="(item, index) in filteredPairResult"
                          :key="index"
                          class="raw-cell"
                        >
                          {{ filterResultForProfessionCount('can', index, item) }}
                        </td>
                      </tr>
                      <tr>
                        <td>我喜歡</td>
                        <td
                          v-for="(item, index) in filteredPairResult"
                          :key="index"
                          class="raw-cell"
                        >
                          {{ filterResultForProfessionCount('like', index, item) }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="4">
            <v-card-text>
              <h2>職業卡牌雷達圖</h2>
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
.report-dialog {
  max-height: 100vh;
  // margin-top: -75px;
}

.text-center {
  text-align: center;
}

.result-table {
  max-width: 900px;

  :deep(table) {
    border-spacing: 3px !important; /* 強制設定格子之間的間隔 */
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
  .h-code {
    color: #0000ff;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 10px;
    border: 1px dashed #000;
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

.trait-selection-table {
  margin: 5%;
}
</style>
