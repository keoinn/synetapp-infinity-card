<script setup>
import { ref, onMounted } from 'vue'
import { getOrderListAPI } from '@/plugins/utils/requests/api/bill'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const orderList = ref([])

const getOrderStatusText = (status) => {
  if (status === '0') {
    return '待付款'
  } else if (status === '1') {
    return '已付款'
  }
}

const getOrderStatusColor = (status) => {
  if (status === '0') {
    return 'red'
  } else if (status === '1') {
    return 'green'
  }
}
onMounted(() => {
  getOrderListAPI(appStore.user_id).then((res) => {
    orderList.value = res.data.attributes.order_list
    console.log(res)
  })
})

</script>

<template>
  <div>
    <v-card>
      <v-card-title> 訂單列表 </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>訂單金額</th>
              <th>訂單狀態</th>
              <th>訂單日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orderList" :key="order.id">
              <td>{{ order.order_no }}</td>
              <td>{{ order.order_price }}</td>
              <td>
                <v-chip :color="getOrderStatusColor(order.status)">
                  {{ getOrderStatusText(order.status) }}
                </v-chip>
              </td>
              <td>{{ order.created_at }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
