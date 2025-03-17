<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'
import { handleAlert } from '@/plugins/utils/alert'
import { createPaymentAPI, createOrderAPI } from '@/plugins/utils/requests/api/bill'
import caseCare from '@/assets/images/case/case_care.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseGoal from '@/assets/images/case/case_goal.webp'

const cartStore = useCartStore()
const appStore = useAppStore()
const email = ref('')

const getItemTitle = (item_id) => {
  if (item_id === 'goal') {
    return '我就是: I goal'
  } else if (item_id === 'care') {
    return '我在乎: I care'
  } else if (item_id === 'cj') {
    return '我可以 (社青版): I can'
  } else if (item_id === 'ce') {
    return '我可以 (國小版): I can'
  } else if (item_id === 'lj') {
    return '我喜歡 (社青版): I like'
  } else if (item_id === 'le') {
    return '我喜歡 (國小版): I like'
  } else if (item_id === 'set_j') {
    return '無限可能卡組合 － 社青版'
  } else if (item_id === 'set_e') {
    return '無限可能卡組合 － 國小版'
  }
}

const getCardImage = (item_id) => {
  if (item_id === 'goal') {
    return [caseGoal]
  } else if (item_id === 'care') {
    return [caseCare]
  } else if (item_id === 'cj') {
    return [caseCj]
  } else if (item_id === 'ce') {
    return [caseCe]
  } else if (item_id === 'lj') {
    return [caseLj]
  } else if (item_id === 'le') {
    return [caseLe]
  } else if (item_id === 'set_j') {
    return [caseCare, caseCj, caseLj, caseGoal]
  } else if (item_id === 'set_e') {
    return [caseCare, caseCe, caseLe, caseGoal]
  }
}

const handleCheckout = async () => {
  // 取得付款資訊
  let transaction_uid = null
  let transaction_email = null
  if (!appStore.isLogin) {
    // TODO: check email format
    if (email.value === '') {
      handleAlert({
        auction: 'error',
        text: '請輸入付款信箱',
        toast: false
      })
      return
    }
    transaction_email = email.value
  } else {
    transaction_uid = appStore.user_id
  }

  // 商品資訊   
  const transaction_product = cartStore.cartItems.filter((item) => item.checked).map((item) => item)
  const transaction_price = cartStore.totalCheckedPrice

  // 建立付款連結
  const paymentInfo = await createPaymentAPI(
    cartStore.totalCheckedPrice,
    'https://api.wepro.synet-app.com/payment/payback?redirect_url=' + window.location.href + '?tabs=order'
  )

  // 紀錄訂單
  await createOrderAPI(
    transaction_uid,
    transaction_email,
    paymentInfo.data.id,
    transaction_product,
    transaction_price
  )
  
  // 清除購物車
  cartStore.cartItems.filter((item) => item.checked).map((item) => {
    cartStore.removeItem(item.item_id)
  })

  
  if (paymentInfo.meta.status === '300') {
    window.location.href = paymentInfo.meta.redirect_url
  } else {
    handleAlert({
      auction: 'error',
      text: '付款失敗',
      toast: false,
    })
  }

}
</script>

<template>
  <div class="cart-list">
    <v-row>
      <v-col cols="12">
        <v-card>
          <!-- <v-card-title class="cart-table-title">
                      <h3>我的購物車</h3>
                    </v-card-title> -->
          <v-card-text>
            <v-table>
              <thead>
                <tr class="cart-table-header">
                  <th class="cart-table-header-checkbox">
                    <v-checkbox
                      label="全選"
                      @update:model-value="cartStore.updateCheckedAll($event)"
                    />
                  </th>
                  <th class="cart-table-header-image" />
                  <th class="cart-table-header-name">
                    商品名稱
                  </th>
                  <th>價格</th>
                  <th>數量</th>
                  <th>小計</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in cartStore.cartItems"
                  :key="item.id"
                >
                  <td>
                    <v-checkbox
                      :model-value="item.checked"
                      @update:model-value="cartStore.updateChecked(item.item_id, $event)"
                    />
                  </td>
                  <td>
                    <div class="cart-card-image">
                      <v-img
                        v-for="image in getCardImage(item.item_id)"
                        :key="image"
                        :src="image"
                        height="100px"
                      />
                    </div>
                  </td>
                  <td align="left">
                    <span>{{ getItemTitle(item.item_id) }}</span>
                  </td>
                  <td>
                    <span>{{ item.item_price }}</span>
                  </td>
                  <td>
                    <span>{{ item.item_qty }}</span>
                  </td>
                  <td>
                    <span>{{ item.item_price * item.item_qty }}</span>
                  </td>
                  <td>
                    <v-btn
                      icon="mdi-delete"
                      @click="cartStore.removeItem(item.item_id)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <v-card class="cart-total-price-card">
    <v-card-text>
      <v-row>
        <v-spacer />
        <v-col
          v-if="!appStore.isLogin"
          cols="3"
          class="pr-5"
        >
          <v-row>
            <v-col>
              <span class="cart-total-price">購買人信箱：</span>
            </v-col>
          </v-row>
          <v-row style="margin-top: -10px">
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="信箱"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col 
          cols="3" 
          class="pr-5"
        >
          <v-row>
            <v-col
              cols="12"
              class="pa-0 ma-0"
            >
              <span class="cart-total-price"> 商品金額：{{ cartStore.totalCheckedPrice }} </span>
            </v-col>
            <v-col
              cols="12"
              class="pa-0 ma-0"
            >
              <span class="cart-total-price">
                運&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;費：{{ cartStore.shippingFee }}
              </span>
            </v-col>
            <v-divider />

            <v-col
              cols="12"
              class="pa-0 ma-0 pt-1"
            >
              <span class="cart-total-price">
                總金額&nbsp;&nbsp;&nbsp;&nbsp;：{{
                  cartStore.totalCheckedPrice + cartStore.shippingFee
                }}
              </span>
            </v-col>

            <v-col
              cols="12"
              class="pa-0 ma-0 pt-1"
            >
              <v-btn
                block
                color="#FA5015"
                text="確認付款"
                @click="handleCheckout"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.cart-card {
  height: 100%;
  border-radius: 20px;
}

.cart-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 450px;
}

.cart-table-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.cart-table-header {
  font-size: 18px;
  font-weight: 600;
}

.cart-table-header-checkbox {
  width: 120px;
}

.cart-table-header-image {
  width: 240px;
}

.cart-table-header-name {
  width: 240px;
}

.cart-card-image {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.cart-total-price {
  font-size: 18px;
  font-weight: 600;
}

.cart-total-price-card {
  background-color: #ecf0f3;
  padding-top: 10px;
  padding-bottom: 20px;
  border-radius: 20px;
  border: 1px dashed #000;
}
</style>
