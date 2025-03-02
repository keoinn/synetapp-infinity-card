// mock backend.js

// 模擬的報告設置 API
export const getReportSettings = (rep_id) => {
  // 返回模擬的報告設置
  if (rep_id === '1234567890') {
    return new Promise((resolve) => {
      resolve({
        meta: {
          status: '200',
          code: '2000',
          title: 'success',
          detail: 'success',
          query_params: {
            rep_id: rep_id
          }
        },
        data: {
          type: 'report',
          id: rep_id,
          attributes: {
            cards_set: ['goal', 'care', 'lj', 'cj'],
            goal_res: {},
            care_res: {},
            cj_res: {},
            ce_res: {},
            lj_res: {},
            le_res: {}
          }
        },
        jsonapi: {
          version: '1.1'
        }
      })
    })
  } else  if (rep_id === '1740885538301'){
    return new Promise((resolve) => {
        resolve({
          meta: {
            status: '200',
            code: '2000',
            title: 'success',
            detail: 'success',
            query_params: {
              rep_id: rep_id
            }
          },
          data: {
            type: 'report',
            id: rep_id,
            attributes: {
              cards_set: ['care', 'lj', 'cj'],
              goal_res: {},
              care_res: {},
              cj_res: {},
              ce_res: {},
              lj_res: {},
              le_res: {}
            }
          },
          jsonapi: {
            version: '1.1'
          }
        })
      })
  } else {
    return new Promise((resolve) => {
        resolve({
          meta: {
            status: '200',
            code: '2000',
            title: 'success',
            detail: 'success',
            query_params: {
              rep_id: rep_id
            }
          },
          data: {
            type: 'report',
            id: rep_id,
            attributes: {
              cards_set: ['goal', 'care', 'lj', 'cj'],
              goal_res: {},
              care_res: {},
              cj_res: {},
              ce_res: {},
              lj_res: {},
              le_res: {}
            }
          },
          jsonapi: {
            version: '1.1'
          }
        })
      })
  }
}

export const getReportList = (uid) => {
  return new Promise((resolve) => {
    // 返回模擬的報告列表
    resolve({
      meta: {
        status: '200',
        code: '2000',
        title: 'success',
        detail: 'success',
        query_params: {
          uid: uid
        }
      },
      data: {
        type: 'report_list',
        id: Date.now(),
        attributes: {
          report_list: [
            {
              id: Date.now(),
              cards_set: ['goal', 'care', 'lj', 'cj'],
              is_active: true,
              is_delete: false,
              is_finish: false,
              has_result: true,
              created_at: Date.now(),
              updated_at: Date.now()
            },
            {
              id: Date.now(),
              cards_set: ['goal', 'care', 'lj', 'cj'],
              is_active: true,
              is_delete: false,
              is_finish: false,
              has_result: false,
              created_at: Date.now(),
              updated_at: Date.now()
            },
            {
              id: Date.now(),
              cards_set: ['goal', 'care', 'lj', 'cj'],
              is_active: true,
              is_delete: false,
              is_finish: false,
              has_result: false,
              created_at: Date.now(),
              updated_at: Date.now()
            },
            {
              id: Date.now(),
              cards_set: ['goal', 'care', 'lj', 'cj'],
              is_active: true,
              is_delete: false,
              is_finish: false,
              has_result: false,
              created_at: Date.now(),
              updated_at: Date.now()
            }
          ]
        }
      },
      jsonapi: {
        version: '1.1'
      }
    })
  })
}
