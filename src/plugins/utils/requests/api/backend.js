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
