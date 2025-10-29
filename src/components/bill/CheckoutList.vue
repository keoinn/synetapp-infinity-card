<script setup>
import { ref, onMounted } from 'vue'
import { getOrderListAPI } from '@/plugins/utils/requests/api/bill'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const appStore = useAppStore()

const orderList = ref([])

const getOrderStatusText = (status) => {
  if (status === '0') {
    return t('order.orderStatusPending')
  } else if (status === '1') {
    return t('order.orderStatusPaid')
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
  <div class="checkout-list">
    <v-card>
      <v-card-title> {{ t('order.orderList') }} </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>{{ t('order.orderSn') }}</th>
              <th>{{ t('order.orderAmount') }}</th>
              <th>{{ t('order.orderStatus') }}</th>
              <th>{{ t('order.orderDate') }}</th>
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

<style lang="scss" scoped>
.checkout-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 640px;
}
</style>
