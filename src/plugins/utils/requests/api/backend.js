import requestInstance from '@/plugins/utils/requests/requests.js'
import { jsonapiEnc, JSONAPI_HEADER } from '@/plugins/utils/requests/commu_enc.js'
import { hashpwd } from '@/plugins/utils/encryption.js'

export const authAPI = ({identification, password}) => {
    const data = jsonapiEnc('auth', Date.now(), {identification, password: hashpwd(password), platform: 'PsyCard'})
    const request = requestInstance.post('/auth', data, JSONAPI_HEADER)
    return request
}

export const verifyTokenAPI = () => {
  const request = requestInstance.post('/verify/token', null, JSONAPI_HEADER)
  return request
}

export const registerAPI = ({email, password}) => {
  const data = jsonapiEnc('users', Date.now(), {email: email, password: hashpwd(password), platform: 'PsyCard'})
  const request = requestInstance.post('/register', data, JSONAPI_HEADER)
  return request
}

export const getReportListAPI = (uid) => {
  const data = jsonapiEnc('report', Date.now(), {own_id: uid})
  const request = requestInstance.post('/psycard/report', data, JSONAPI_HEADER)
  return request
}

export const getReportDetailAPI = (hash_id) => {
  const request = requestInstance.get(`/psycard/report/${hash_id}`)
  return request
}

export const saveReportAPI = (report_id, card_res) => {
  const data = jsonapiEnc('report', Date.now(), card_res)
  const request = requestInstance.post(`/psycard/report/${report_id}`, data, JSONAPI_HEADER)
  return request
}