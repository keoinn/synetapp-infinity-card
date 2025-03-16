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
  
  