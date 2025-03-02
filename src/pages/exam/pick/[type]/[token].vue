<script setup>
import { ref, onMounted } from 'vue'
import CardPlayground from '@/components/playground/CardPlayground.vue'
import { decrypt } from '@/plugins/utils/encryption'
import { useRoute, useRouter } from 'vue-router'
import { getReportSettings } from '@/plugins/utils/requests/mock/backend'

const route = useRoute()
const router = useRouter()

const pid = decrypt(route.params.token)
const type = route.params.type

// 定義卡片類型和狀態
const cardType = ref(type) // 可以根據需要更改
const cardsPool = ref([]) // 初始為空，根據需求填充
const cardsStatus = ref([]) // 初始為空，根據需求填充

// 處理完成事件
const handleFinish = (data) => {
  console.log('完成卡片選擇:', data)
  // 在這裡可以進行進一步的處理，例如發送到後端
  router.push(`/exam/${route.params.token}`)
}

// 掛載時，取得報告設定
onMounted(async () => {
  const res = await getReportSettings(pid)
  console.log(res)
})

</script>

<template>
  <div class="playground">
    <CardPlayground
      :type="cardType"
      :cards-pool="cardsPool"
      :cards-status="cardsStatus"
      @finish="handleFinish"
    />
  </div>
</template>

<style lang="scss" scoped>
.playground {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
