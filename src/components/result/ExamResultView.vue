<script setup>
/**
 * 測驗結果視圖組件 (Deprecated)
 * 
 * 此組件提供一個對話框，用於顯示完整的測驗統計結果，包括：
 * - 卡片挑選結果：顯示各類型卡片的 RIASEC 六種類型統計
 * - 職業卡牌配對結果：顯示職業與卡片的配對數量
 * - 分析結果：特質挑選的比例分析和荷倫碼（Holland Code）
 * - 職業配對分析：各職業在「我在乎」、「我喜歡」、「我可以」三個維度的比例
 * - 職業卡牌雷達圖：使用 Chart.js 繪製的雷達圖，可視化職業配對結果
 * 
 * @component ExamResultView
 * @example
 * <ExamResultView />
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理
 * - chart.js - 圖表繪製庫
 * 
 * @features
 * - 響應式對話框設計（高度 90%）
 * - 動態計算測驗結果
 * - 自動繪製雷達圖
 * - 顏色編碼的數據展示（高/中高/中/低比例）
 */

/* eslint-disable vue/no-v-html */
/* eslint-disable no-unused-vars */
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'
import { Chart, registerables } from 'chart.js';
import { useI18n } from 'vue-i18n'

Chart.register(...registerables);

const { t } = useI18n()
const examProcess = useExamProcessStore()
const pickResult = ref(null)
const pairResult = ref(null)
const radarChartRef = ref(null)

const stringOfType = (type) => {
  switch (type) {
    case 'goal':
      return t('product.goalTitle')
    case 'care':
      return t('product.careTitle')
    case 'cj':
      return t('product.cjTitle')
    case 'ce':
      return t('product.ceTitle')
    case 'le':
      return t('product.leTitle')
    case 'lj':
      return t('product.ljTitle')
    case 'total':
      return t('result.Total')
    case 'can':
      return t('product.can')
    case 'like':
      return t('product.like')
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
    await nextTick();
    if(radarChartRef.value) {
      drawRadarChart()
    }
  }
})


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

const formatRatio = (ratio) => {
  return `${ratio.toFixed(2)} %`
}

const filterResultForProfessionCount = (card_type, index, result) => {
  return result[card_type]
}

const filterResultForProfessionRate= (card_type, index, result) => {
  if(index === 'total') {
    return
  }
  return result.rate[card_type]
}

const filterResultRateForProfession = computed(() => {
  // 使用 Object.entries() 将对象转换为键值对数组，然后过滤掉键为 'total' 的项
  const filteredEntries = Object.entries(pairResult.value).filter(([key, value]) => key !== 'total');
  // 使用 Object.fromEntries() 将过滤后的键值对数组转换回对象
  return Object.fromEntries(filteredEntries);
})
/**

{"goal":{"R":"12","I":"11","A":"19","S":"12","E":"27","C":"11"},"care":{"R":"2","I":"3","A":"4","S":"6","E":"2","C":"2"},"like":{"R":"1","I":"3","A":"2","S":"1","E":"2","C":"5"},"can":{"R":"3","I":"0","A":"1","S":"7","E":"5","C":"4"},"job":{"j1":{"opt":"0038","care":"6","like":"5","can":"2"},"j2":{"opt":"0086","care":"9","like":"10","can":"12"},"j3":{"opt":"0093","care":"4","like":"5","can":"0"}}}
 */
 onMounted(async () => {
  pickResult.value = examProcess.calculatePickResult
  pairResult.value = examProcess.calculatePairResult
})

const drawRadarChart = () => {
  const ctx = radarChartRef.value.getContext('2d');
    new Chart(ctx, {
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
  const labels = [t('result.RadarLabelCare'), t('result.RadarLabelLike'), t('result.RadarLabelCan')]
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
        :text="t('playground.statisticsResults')"
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

          <v-toolbar-title>{{ t('playground.statisticsResults') }}</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              :text="t('result.downloadReport')"
              variant="text"
              @click="dialogIsActive = false"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <!-- 卡片挑選結果 -->
          <h2>{{ t('result.PickResultTitle') }}</h2>
          <v-divider />
          <v-table
            v-if="pickResult !== null"
            class="result-table"
          >
            <thead>
              <tr align="center">
                <th
                  class="text-center"
                  v-html="t('result.HollandType')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeR')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeI')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeA')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeS')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeE')"
                />
                <th
                  class="text-center"
                  v-html="t('result.HollandTypeC')"
                />
                <th
                  class="text-center"
                  v-html="t('result.Total')"
                />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, key) in pickResult"
                :key="key"
              >
                <td>{{ stringOfType(key) }}</td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.r }}
                </td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.i }}
                </td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.a }}
                </td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.s }}
                </td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.e }}
                </td>
                <td :class="key === 'total' ? 'total-cell' : 'raw-cell'">
                  {{ item.c }}
                </td>
                <td class="total-cell">
                  {{ item.total }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- 職業卡牌 -->
          <h2 class="mt-8">
            {{ t('result.PairResultTitle') }}
          </h2>
          <v-divider />
          <v-table
            v-if="pairResult !== null"
            class="result-table"
          >
            <thead>
              <tr align="center">
                <th class="text-center">
                  {{ t('result.HollandType') }}
                </th>
                <th
                  v-for="(item, index) in pairResult"
                  :key="index"
                  class="text-center"
                  v-html="paddingNewLineForCol(item.title)"
                />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ t('product.care') }}</td>
                <td 
                  v-for="(item, index) in pairResult" 
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCount('care', index, item) }}
                </td>
              </tr>
              <tr>
                <td>{{ t('product.like') }}</td>
                <td
                  v-for="(item, index) in pairResult"
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCount('like', index, item) }}
                </td>
              </tr>
              <tr>
                <td>{{ t('product.can') }}</td>
                <td
                  v-for="(item, index) in pairResult"
                  :key="index"
                  :class="index === 'total' ? 'total-cell' : 'raw-cell'"
                >
                  {{ filterResultForProfessionCount('can', index, item) }}
                </td>
              </tr>
              <tr>
                <td>{{ t('result.Total') }}</td>
                <td
                  v-for="(item, index) in pairResult"
                  :key="index"
                  class="total-cell"
                >
                  {{ filterResultForProfessionCount('total', index, item) }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <h2 class="mt-8">
            {{ t('result.AnalysisTraitResult') }}
          </h2>
          <v-divider />
          <v-table
            v-if="pickResult !== null"
            class="result-table"
          >
            <thead>
              <tr align="center">
                <th 
                  class="text-center"
                  v-html="t('result.HollandType')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeR')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeI')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeA')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeS')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeE')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandTypeC')"
                />
                <th 
                  class="text-center"
                  v-html="t('result.HollandCode')"
                />
              </tr>
            </thead>
            <tbody
              v-for="(item, key) in pickResult"
              :key="key"
            >
              <tr>
                <td>{{ stringOfType(key) }}</td>
                <td :class="item.rate.r > 66 ? 'high-ratio' : item.rate.r > 50 ? 'medium-high-ratio' : item.rate.r > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.r) }}
                </td>
                <td :class="item.rate.i > 66 ? 'high-ratio' : item.rate.i > 50 ? 'medium-high-ratio' : item.rate.i > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.i) }}
                </td>
                <td :class="item.rate.a > 66 ? 'high-ratio' : item.rate.a > 50 ? 'medium-high-ratio' : item.rate.a > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.a) }}
                </td>
                <td :class="item.rate.s > 66 ? 'high-ratio' : item.rate.s > 50 ? 'medium-high-ratio' : item.rate.s > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.s) }}
                </td>
                <td :class="item.rate.e > 66 ? 'high-ratio' : item.rate.e > 50 ? 'medium-high-ratio' : item.rate.e > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.e) }}
                </td>
                <td :class="item.rate.c > 66 ? 'high-ratio' : item.rate.c > 50 ? 'medium-high-ratio' : item.rate.c > 33 ? 'medium-ratio' : 'low-ratio'">
                  {{ formatRatio(item.rate.c) }}
                </td>
                <td class="h-code">
                  {{ item.h_code }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <h2 class="mt-8">
            {{ t('result.AnalysisCareerResult') }}
          </h2>
          <v-divider />
          <v-table
            v-if="pairResult !== null"
            class="result-table"
          >
            <thead>
              <tr align="center">
                <th class="text-center">
                  {{ t('result.HollandType') }}
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
                <td>{{ t('product.care') }}</td>
                <td
                  v-for="(item, index) in filterResultRateForProfession"
                  :key="index"
                  :class="filterResultForProfessionRate('care', index, item) > 66 ? 'high-ratio' : filterResultForProfessionRate('care', index, item) > 50 ? 'medium-high-ratio' : filterResultForProfessionRate('care', index, item) > 33 ? 'medium-ratio' : 'low-ratio'"
                >
                  {{ formatRatio(filterResultForProfessionRate('care', index, item)) }}
                </td>
              </tr>
              <tr>
                <td>{{ t('product.like') }}</td>
                <td
                  v-for="(item, index) in filterResultRateForProfession"
                  :key="index"
                  :class="filterResultForProfessionRate('care', index, item) > 66 ? 'high-ratio' : filterResultForProfessionRate('care', index, item) > 50 ? 'medium-high-ratio' : filterResultForProfessionRate('care', index, item) > 33 ? 'medium-ratio' : 'low-ratio'"
                >
                  {{ formatRatio(filterResultForProfessionRate('like', index, item)) }}
                </td>
              </tr>
              <tr>
                <td>{{ t('product.can') }}</td>
                <td
                  v-for="(item, index) in filterResultRateForProfession"
                  :key="index"
                  :class="filterResultForProfessionRate('care', index, item) > 66 ? 'high-ratio' : filterResultForProfessionRate('care', index, item) > 50 ? 'medium-high-ratio' : filterResultForProfessionRate('care', index, item) > 33 ? 'medium-ratio' : 'low-ratio'"
                >
                  {{ formatRatio(filterResultForProfessionRate('can', index, item)) }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <h2 class="mt-8">
            {{ t('result.RadarChart') }}
          </h2>
          <v-divider />
          <div class="radar-chart-container">
            <canvas ref="radarChartRef" />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            :text="t('result.closeReport')"
            variant="tonal"
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
  max-width: 850px;
  max-height: 850px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 0 auto;
}
</style>
