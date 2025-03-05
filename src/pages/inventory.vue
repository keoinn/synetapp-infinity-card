<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { getCardInventoryAPI, createReportAPI } from '@/plugins/utils/requests/api/backend'
import { handleAlert } from '@/plugins/utils/alert'
import { useRouter } from 'vue-router'
const appStore = useAppStore()
const inventory = reactive({
  goal: 0,
  care: 0,
  ce: 0,
  cj: 0,
  lj: 0,
  le: 0
})
const router = useRouter()
const droppedItems = ref([])

const handleDragStart = (event, key) => {
  console.log('Dragging:', key)
  event.dataTransfer.setData('text', key)
}

const handleDrop = (event) => {
  event.preventDefault()
  const key = event.dataTransfer.getData('text')
  console.log('Dropped:', key)
  if ((key === 'le' && droppedItems.value.includes('lj')) || (key === 'lj' && droppedItems.value.includes('le'))) {
    handleAlert({
      auction: 'error',
      text: 'le 和 lj 不能同時存在報告中',
    })
    return
  }
  if ((key === 'ce' && droppedItems.value.includes('cj')) || (key === 'cj' && droppedItems.value.includes('ce'))) {
    handleAlert({
      auction: 'error',
      text: 'ce 和 cj 不能同時存在報告中',
    })
    return
  }
  if (!droppedItems.value.includes(key)) {
    inventory[key] -= 1
    droppedItems.value.push(key)
  } else {
    handleAlert({
      auction: 'error',
      text: '牌組不能重複於測驗中。',
    })
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleRemoveItem = (index) => {
  const key = droppedItems.value[index]
  inventory[key] += 1
  droppedItems.value.splice(index, 1)
}

const updateInventory = (cardCase) => {
  inventory[cardCase] = (parseInt(inventory[cardCase]) + 1).toString()
  handleAlert({
    auction: 'success',
    text: `(模擬)【${caseText(cardCase)}】牌組已購買。`,
  })
}

const caseText = (cardCase) => {
  return cardCase === 'goal'
    ? '我就是'
    : cardCase === 'care'
    ? '我在乎'
    : cardCase === 'ce'
    ? '我可以 (國小)'
    : cardCase === 'cj'
    ? '我可以 (社青)'
    : cardCase === 'le'
    ? '我喜歡 (國小)'
    : cardCase === 'lj'
    ? '我喜歡 (社青)'
    : ''
}

const handleCreateReport = async () => {
  console.log(droppedItems.value)
  if (droppedItems.value.length === 0) {
    handleAlert({
      auction: 'error',
      text: '請至少選擇一個牌組。',
    })
    return
  }
  const res = await createReportAPI(appStore.user_id, dropItemToArray.value)
  console.log(res)
  handleAlert({
    auction: 'success',
    text: '測驗已建立。',
  })
  router.push(`/exam/`)
}

onMounted(async () => {
  const res = await getCardInventoryAPI(appStore.user_id)
  console.log(res)
  const instock = res.data.attributes.inventory_list
  console.log(inventory)
  inventory.goal = instock.goal
  inventory.care = instock.care
  inventory.ce = instock.ce
  inventory.cj = instock.cj
  inventory.lj = instock.lj
  inventory.le = instock.le
  document.body.setAttribute('ondragstart', 'return true')
})

const dropItemToArray = computed(() => {
  const card_sets = []
  droppedItems.value.forEach((item) => {
    card_sets.push(item)
  })
  return card_sets
})
</script>

<template>
  <div class="inventory-page">
    <h1 style="text-decoration: underline;">建立測驗</h1>
    <v-row class="inventory-row">
      <v-col
        v-for="(value, key) in inventory"
        :key="key"
        :cols="2"
        :draggable="inventory[key] > 0 && !(droppedItems.includes('le') && key === 'lj') && !(droppedItems.includes('lj') && key === 'le') && !(droppedItems.includes('ce') && key === 'cj') && !(droppedItems.includes('cj') && key === 'ce')"
        @dragstart="handleDragStart($event, key)"
      >
        <CardCaseInventory
          :card-case="key"
          :inventory="`${parseInt(inventory[key])}`"
          @update-inventory="updateInventory"
        />
      </v-col>
    </v-row>
    <v-divider class="mt-10" />
    <v-row>
      <div class="pt-5 pl-4">
        拖曳卡組到這裡建立測驗
        <v-btn color="primary" @click="handleCreateReport">
          建立測驗
        </v-btn>
      </div>
      <v-col cols="12">
        <div class="container">
          <div
            class="drop-areas-container"
            @drop="handleDrop"
            @dragover="handleDragOver"
          >
            <div
              v-for="(item, index) in droppedItems"
              :key="index"
              class="drop-area pt-10"
              @click="handleRemoveItem(index)"
            >
              <CardCaseInventory
                :card-case="item"
                :inventory="`${parseInt(inventory[item])}`"
                :in-drop-area="true"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.inventory-page {
  background-color: lightblue;
  padding: 40px;
  min-width: 1350px;

  .inventory-row {
    display: flex;
    flex-wrap: wrap;
    background-color: white;
    padding: 20px;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .drop-areas-container {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
    height: 350px;
    padding: 20px;
    margin-right: 20px;
    border: 2px dashed #ccc;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .drop-areas-container::before {
    content: '拖曳卡組到這裡建立報告';
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    font-size: 20px;
    z-index: 0;
    opacity: 0.5;
  }

  .drop-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    min-width: 120px;
    z-index: 1;
  }
}
</style>
