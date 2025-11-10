import requestInstance from '@/plugins/utils/requests/requests.js'
import { jsonapiEnc, JSONAPI_HEADER } from '@/plugins/utils/requests/commu_enc.js'
import { hashpwd } from '@/plugins/utils/encryption.js'

export const authAPI = ({identification, password}) => {
    // 驗證參數
    if (!identification || !password) {
        throw new Error('Identification and password are required')
    }
    
    const data = jsonapiEnc('auth', Date.now(), {identification, password: hashpwd(password), platform: 'PsyCard'})
    const request = requestInstance.post('/auth', data, JSONAPI_HEADER)
    return request
}

export const verifyTokenAPI = () => {
  const request = requestInstance.post('/verify/token', null, JSONAPI_HEADER)
  return request
}

export const eventLoginAPI = ({event_code, account, password}) => {
  const data = jsonapiEnc('event', Date.now(), {
    event_code: event_code, 
    identification: account, 
    password: hashpwd(password), 
    platform: 'PsyCard'
  })
  const request = requestInstance.post('psycard/event/login', data, JSONAPI_HEADER)
  return request
}

export const registerAPI = ({email, password}) => {
  // 驗證參數
  if (!email || !password) {
      throw new Error('Email and password are required')
  }
  
  const data = jsonapiEnc('users', Date.now(), {email: email, password: hashpwd(password), platform: 'PsyCard'})
  const request = requestInstance.post('/register', data, JSONAPI_HEADER)
  return request
}

export const getReportListAPI = (uid, current_role) => {
  const data = jsonapiEnc('report', Date.now(), {
    role: current_role,
    own_id: uid,
  })
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

export const getCardInventoryAPI = (uid) => {
  const data = jsonapiEnc('inventory', Date.now(), {own_id: uid})
  const request = requestInstance.post('/psycard/inventory', data, JSONAPI_HEADER)
  return request
}

export const createReportAPI = (uid, card_res) => {
  const data = jsonapiEnc('report', Date.now(), {own_id: uid, cards_set: card_res})
  const request = requestInstance.post(`/psycard/exam/new`, data, JSONAPI_HEADER)
  return request
}

export const updateReportInfoAPI = (report_id, field, new_value) => {
  const data = jsonapiEnc('report', Date.now(), {crd_id: report_id, value: new_value})
  const request = requestInstance.post(`/psycard/report/metadata/${field}/${report_id}`, data, JSONAPI_HEADER)
  return request
}

export const sendEmailAPI = (report_id, email, link) => {
  const data = jsonapiEnc('report', Date.now(), {crd_id: report_id, email: email, link: link})
  const request = requestInstance.post('/psycard/report/mail/link', data, JSONAPI_HEADER)
  return request
}

export const updateUserDataAdminAPI = (user_id, account, email, role) =>{
  const data = jsonapiEnc('user', Date.now(), {
    user_id: user_id,
    account: account,
    email: email,
    role: role,
  })
  const request = requestInstance.post(`psycard/user/update`, data, JSONAPI_HEADER)
  return request
}

export const registerAdminAPI = ({email, password, role}) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }
  const data = jsonapiEnc('users', Date.now(), {email: email, password: hashpwd(password), platform: 'PsyCard', role: role})
  const request = requestInstance.post('/register', data, JSONAPI_HEADER)
  return request
}

export const listUserAdminAPI = () => {
  const data = jsonapiEnc('user', Date.now(), {
    platform: 'PsyCard',
  })
  const request = requestInstance.post('/user/list/psycard', data, JSONAPI_HEADER)
  return request
}

export const listOrgAdminAPI = () => {
  const data = jsonapiEnc('organization', Date.now())
  const request = requestInstance.post('psycard/org/list', data, JSONAPI_HEADER)
  return request
}

export const createOrgAdminAPI = ({org_name, org_description, org_contact_person, org_contact_phone, org_contact_email, org_contact_address, org_default_counselors, org_st}) => {
  const data = jsonapiEnc('organization', Date.now(), {
    org_name: org_name,
    org_description: org_description,
    org_contact_person: org_contact_person,
    org_contact_phone: org_contact_phone,
    org_contact_email: org_contact_email,
    org_contact_address: org_contact_address,
    org_default_counselors: org_default_counselors,
    org_st: org_st
  })
   const request = requestInstance.post('psycard/org/new', data, JSONAPI_HEADER)
  return request
}

export const updateOrgAdminAPI = (org_id, {org_code, org_name, org_description, org_contact_person, org_contact_phone, org_contact_email, org_contact_address, org_default_counselors, org_st}) => {
  const data = jsonapiEnc('organization', Date.now(), {
    org_code: org_code,
    org_name: org_name,
    org_description: org_description,
    org_contact_person: org_contact_person,
    org_contact_phone: org_contact_phone,
    org_contact_email: org_contact_email,
    org_contact_address: org_contact_address,
    org_default_counselors: org_default_counselors,
    org_st: org_st
  })

  const request = requestInstance.post(`psycard/org/${org_id}`, data, JSONAPI_HEADER)
  return request
}

export const listOrSubAccountAdminAPI = (org_id) => {
  const data = jsonapiEnc('organization', Date.now())
  const request = requestInstance.post(`psycard/org/sub-account/${org_id}`, data, JSONAPI_HEADER)
  return request
}

export const createSubAccountAdminAPI = (org_id, {org_user_name, org_account, org_email, is_admin}) => {
  const data = jsonapiEnc('organization', Date.now(), {
    org_user_name: org_user_name,
    org_account: org_account,
    org_email: org_email,
    is_admin: is_admin,
  })
  // 使用 /new 路徑來明確表示這是創建操作，與查詢操作區分開
  const request = requestInstance.post(`psycard/org/sub-account/new/${org_id}`, data, JSONAPI_HEADER)
  return request
}

export const updateSubAccountAdminAPI = (org_id, user_id, {org_user_name, org_account, org_email, is_admin}) => {
  const data = jsonapiEnc('organization', Date.now(), {
    org_user_name: org_user_name,
    org_account: org_account,
    org_email: org_email,
    is_admin: is_admin,
  })
  const request = requestInstance.post(`psycard/org/sub-account/${org_id}/${user_id}`, data, JSONAPI_HEADER)
  return request
}

export const deleteSubAccountAdminAPI = (org_id, user_id) => {
  const data = jsonapiEnc('organization', Date.now())
  const request = requestInstance.post(`psycard/org/sub-account/delete/${org_id}/${user_id}`, data, JSONAPI_HEADER)
  return request
}

// 取得機構卡牌庫存
export const getOrgCardInventoryAdminAPI = (org_id = 'all') => {
  const data = jsonapiEnc('organization', Date.now(), {org_id: org_id})
  const request = requestInstance.post(`psycard/org/card-inventory/${org_id}`, data, JSONAPI_HEADER)
  return request
}

// 更新機構卡牌庫存（支援單一或批次更新）
// inventoryData 可以是：
// 1. 單一更新：{ key: 'goal', goal: 5 } 或 { goal: 5 }
// 2. 批次更新：{ goal: 3, care: 2, ce: 2, cj: 2, le: 1, lj: 2 }
export const updateOrgCardInventoryAdminAPI = (org_id, inventoryData) => {
  let card_set_add = {}
  
  // 如果 inventoryData 有 key 屬性，表示是單一更新格式 { key: 'goal', goal: 5 }
  if (inventoryData.key) {
    const key = inventoryData.key
    const value = inventoryData[key] !== undefined ? inventoryData[key] : inventoryData.value
    if (key === 'goal') {
      card_set_add.goal = value
    } else if (key === 'care') {
      card_set_add.care = value
    } else if (key === 'ce') {
      card_set_add.ce = value
    } else if (key === 'cj') {
      card_set_add.cj = value
    } else if (key === 'lj') {
      card_set_add.lj = value
    } else if (key === 'le') {
      card_set_add.le = value
    }
  } else {
    // 批次更新格式：直接傳入包含多個欄位的物件
    // 只包含有效的庫存欄位
    if (inventoryData.goal !== undefined) card_set_add.goal = inventoryData.goal
    if (inventoryData.care !== undefined) card_set_add.care = inventoryData.care
    if (inventoryData.ce !== undefined) card_set_add.ce = inventoryData.ce
    if (inventoryData.cj !== undefined) card_set_add.cj = inventoryData.cj
    if (inventoryData.lj !== undefined) card_set_add.lj = inventoryData.lj
    if (inventoryData.le !== undefined) card_set_add.le = inventoryData.le
  }
  
  const data = jsonapiEnc('organization', Date.now(), card_set_add)
  const request = requestInstance.post(`psycard/org/card-inventory/update/${org_id}`, data, JSONAPI_HEADER)
  return request
}


// 取得機構列表 (下拉式選單用)
export const optionsOrgList = (org_id = 'all') => {
  const data = jsonapiEnc('options', Date.now())
  const request = requestInstance.post(`psycard/options/org/${org_id}`, data, JSONAPI_HEADER)
  return request
}

// 取得機構附屬帳號列表包含庫存資料 (下拉式選單用)
export const optionsSubAccountWithInventoryList = (org_id = null) => {
  const data = jsonapiEnc('options', Date.now())
  const request = requestInstance.post(`psycard/options/org/member/${org_id}`, data, JSONAPI_HEADER)
  return request
}

// 更新機構附屬帳號庫存
// FIXME: 類似 updateOrgCardInventoryAdminAPI -> 未來可合併
export const updateSubAccountInventoryAdminAPI = (member_inventory_id, inventoryData) => {
  let card_set_add = {}

    // 如果 inventoryData 有 key 屬性，表示是單一更新格式 { key: 'goal', goal: 5 }
    if (inventoryData.key) {
      const key = inventoryData.key
      const value = inventoryData[key] !== undefined ? inventoryData[key] : inventoryData.value
      if (key === 'goal') {
        card_set_add.goal = value
      } else if (key === 'care') {
        card_set_add.care = value
      } else if (key === 'ce') {
        card_set_add.ce = value
      } else if (key === 'cj') {
        card_set_add.cj = value
      } else if (key === 'lj') {
        card_set_add.lj = value
      } else if (key === 'le') {
        card_set_add.le = value
      }
    } else {
      // 批次更新格式：直接傳入包含多個欄位的物件
      // 只包含有效的庫存欄位
      if (inventoryData.goal !== undefined) card_set_add.goal = inventoryData.goal
      if (inventoryData.care !== undefined) card_set_add.care = inventoryData.care
      if (inventoryData.ce !== undefined) card_set_add.ce = inventoryData.ce
      if (inventoryData.cj !== undefined) card_set_add.cj = inventoryData.cj
      if (inventoryData.lj !== undefined) card_set_add.lj = inventoryData.lj
      if (inventoryData.le !== undefined) card_set_add.le = inventoryData.le
    }

  const data = jsonapiEnc('organization', Date.now(), card_set_add)
  const request = requestInstance.post(`psycard/org/card-inventory/sub-account/update/${member_inventory_id}`, data, JSONAPI_HEADER)
  return request
}

// 創建機構測驗
export const createOrgReportAPI = (inventory_id, card_res) => {
  const data = jsonapiEnc('organization', Date.now(), {inventory_id: inventory_id, cards_set: card_res})
  const request = requestInstance.post(`/psycard/org/report/new`, data, JSONAPI_HEADER)
  return request
}

// 取得事件列表
export const getEventListAPI = () => {
  const data = jsonapiEnc('event', Date.now())
  const request = requestInstance.post(`/psycard/event/list`, data, JSONAPI_HEADER)
  return request
}

// 建立活動 - 並生成演示帳號
export const createEventAPI = ({
  event_name,
  event_code,
  event_description,
  event_date,
  expire_date,
  num_demo_account,
  st,
  account_prefix,
  password_type,
  default_password,
  default_counselors,
}) => {

  const data = jsonapiEnc('event', Date.now(), {
    event_name: event_name,
    event_code: event_code,
    event_description: event_description,
    event_date: event_date,
    expire_date: expire_date,
    num_demo_account: num_demo_account,
    st: st,
    account_prefix: account_prefix,
    password_type: password_type,
    default_password: default_password,
    default_counselors: default_counselors
  })
  const request = requestInstance.post(`/psycard/event/new`, data, JSONAPI_HEADER)
  return request
  // "event_name": "測試活動",
  // "event_code": "abc12345",
  // "event_description": "測試活動 API",
  // "event_date": "2025-11-08 09:00:00",
  // "expire_date": "2025-11-15 09:00:00",
  // "num_demo_account": "5",
  // "st": "0",
  // "account_prefix": "weprodemo",
  // "password_type": "serial",
  // "default_password": "pwd"
}

// 更新活動
export const updateEventAPI = ({
  event_id,
  event_name,
  event_code,
  event_description,
  event_date,
  expire_date,
  st,
  default_counselors,
}) => {
  const data = jsonapiEnc('event', Date.now(), {
    event_name: event_name,
    event_code: event_code,
    event_description: event_description,
    event_date: event_date,
    expire_date: expire_date,
    st: st,
    default_counselors: default_counselors,
  })
  const request = requestInstance.post(`/psycard/event/update/${event_id}`, data, JSONAPI_HEADER)
  return request
}

// 取得演示帳號列表
export const listDemoAccountAPI = (event_id) => {
  const data = jsonapiEnc('event', Date.now())
  const request = requestInstance.post(`/psycard/event/account/${event_id}`, data, JSONAPI_HEADER)
  return request
}

// 新增演示帳號
export const createDemoAccountAPI = (event_id, new_num_demo_account) => {
  const data = jsonapiEnc('event', Date.now(), {new_num_demo_account: new_num_demo_account})
  const request = requestInstance.post(`/psycard/event/account/new/${event_id}`, data, JSONAPI_HEADER)
  return request
}

// 取得諮商師列表
export const getCounselorListAPI = () => {
  const data = jsonapiEnc('counselor', Date.now())
  const request = requestInstance.post(`/psycard/counselor/list`, data, JSONAPI_HEADER)
  return request
}

// 創建諮商帳號
export const createCounselorAPI = ({email, account, name, type, phone, domain, education, st}) => {
  const data = jsonapiEnc('counselor', Date.now(), {
    email: email,
    account: account,
    name: name,
    type: type,
    phone: phone,
    domain: domain,
    education: education,
    st: st,
    })
  const request = requestInstance.post(`/psycard/counselor/new`, data, JSONAPI_HEADER)
  return request
}

// 更新諮商帳號
export const updateCounselorAPI = (counselor_id, {type, name, email, phone, domain, education, st}) => {
  const data = jsonapiEnc('counselor', Date.now(), {
    type: type,
    name: name,
    email: email,
    phone: phone,
    domain: domain,
    education: education,
    st: st,
  })
  const request = requestInstance.post(`/psycard/counselor/update/${counselor_id}`, data, JSONAPI_HEADER)
  return request
}


export const optionsCounselorList = () => {
  const data = jsonapiEnc('counselor', Date.now())
  const request = requestInstance.post(`/psycard/options/counselor`, data, JSONAPI_HEADER)
  return request
}