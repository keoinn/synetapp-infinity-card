import requestInstance from '@/plugins/utils/requests/requests.js'
import { jsonapiEnc, JSONAPI_HEADER } from '@/plugins/utils/requests/commu_enc.js'

export const createPaymentAPI = (price, return_url) => {
    const data = jsonapiEnc('payment', Date.now(), {
        platform: 'PsyCard',
        price: price,
        return_url: return_url,
    })
    const request = requestInstance.post(`/payment/bill`, data, JSONAPI_HEADER)
    return request
  }
  
  export const createOrderAPI = (uid, email, payment_id, product, price) => {
    const data = jsonapiEnc('order', Date.now(), {
        own_id: uid,
        own_email: email,
        payment_id: payment_id,
        order_info: product,
        order_price: price,
    })
    const request = requestInstance.post(`psycard/order/new`, data, JSONAPI_HEADER)
    return request
  }
  
  export const getOrderListAPI = (uid) => {
    const data = jsonapiEnc('order', Date.now(), {
        own_id: uid,
    })
    const request = requestInstance.post(`psycard/order`, data, JSONAPI_HEADER)
    return request
  }