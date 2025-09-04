<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useExamProcessStore } from '@/stores/examProcess'
import { getFinalResult } from '@/plugins/utils/psy_cards'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const dialogIsActive = ref(false)
const examProcess = useExamProcessStore()
const finalResultObj = ref(null)
const radarChartRef = ref(null)
const pairResult = ref(null)

watch(dialogIsActive, async (newVal) => {
  if (newVal) {
    pairResult.value = examProcess.calculatePairResult
    await nextTick();
    if(radarChartRef.value) {
      drawRadarChart()
    }
  }
})

const finalResult = (attrName) => {
  return finalResultObj.value[attrName]
}



onMounted(() => {
  console.log(examProcess.calculate_pick.total.h_code)
  console.log(getFinalResult(examProcess.calculate_pick.total.h_code))
  finalResultObj.value = getFinalResult(examProcess.calculate_pick.total.h_code)
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
        text="檢視報告"
      />
    </template>

    <template #default>
      <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="dialogIsActive = false"
          />

          <v-toolbar-title>檢視報告</v-toolbar-title>

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
          <v-card color="primary" class="mb-4">
            <v-card-title >綜合解析</v-card-title>
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
          <v-card color="primary" class="mb-4">
            <v-card-title>職業雷達圖</v-card-title>
            <v-divider />
            <v-card-text class="result-text">
              <div class="radar-chart-container">
                <canvas ref="radarChartRef" />
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
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
  max-width: 850px;
  max-height: 850px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 0 auto;
}
</style>