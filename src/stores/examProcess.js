import { defineStore } from 'pinia'
// import { getReportSettings } from '@/plugins/utils/requests/mock/backend'
import { getReportDetailAPI, saveReportAPI } from '@/plugins/utils/requests/api/backend'
import { getCardImageName, getCardCoverImage, getGoalCardData } from '@/plugins/utils/psy_cards'
export const useExamProcessStore = defineStore('examProcess', {
  state: () => ({
    crd_id: null,
    report_id: null,
    report_name: null,
    own_id: null,
    target_id: null,
    access_code: null,
    target_name: null,
    target_email: null,
    target_gender: null,
    target_yrs: null,

    cards_set: [],
    pick_goal: {
      stage1: {
        cards_pool: [],
        cards_status: [],
        current_page: 0,
        keep_cards: [],
        logs: [],
        isFinished: false,
        canTest: false
      },
      stage2: {
        cards_pool: [],
        cards_status: [],
        current_page: 0,
        keep_cards: [],
        logs: [],
        isFinished: false,
        canTest: false
      },
      stage3: {
        cards_pool: [],
        cards_status: [],
        current_page: 0,
        keep_cards: [],
        logs: [],
        isFinished: false,
        canTest: false
      },
      isFinished: false,
      canTest: false,
      final_cards: [],
    },
    pick_care: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_cj: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_ce: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_lj: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_le: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pair_care: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pair_lj: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pair_le: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pair_cj: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pair_ce: {
      cards_pool: [],
      professions: [],
      classifyList: [],
      logs: [],
      isFinished: false,
      canTest: false
    },

    status: 0
  }),
  actions: {
    resetStore() {
      this.report_id = null
      this.crd_id = null
      this.report_name = null
      this.own_id = null
      this.target_id = null
      this.access_code = null
      this.target_name = null
      this.target_email = null
      this.target_gender = null
      this.target_yrs = null
      this.cards_set = []
      this.pick_goal = {}
      this.pick_care = {}
      this.pick_cj = {}
      this.pick_ce = {}
      this.pick_lj = {}
      this.pick_le = {}
      this.pair_care = {}
      this.pair_lj = {}
      this.pair_le = {}
      this.pair_cj = {}
      this.pair_ce = {}
      this.status = 0
    },
    /**
     * 取得報告設定
     * @param {*} rep_id
     */
    async getReportBackend(rep_id) {
      if (this.report_id == rep_id) {
        return
      }
      this.resetStore()
      const res = await getReportDetailAPI(rep_id)
      const report_detail = res.data.attributes.report_detail
      if (report_detail.length == 0) {
        return
      }

      // 儲存後台資訊
      this.$patch({
        crd_id: report_detail.crd_id,
        report_id: report_detail.report_id,
        report_name: report_detail.report_name,
        own_id: report_detail.own_id,
        target_id: report_detail.target_id,
        access_code: report_detail.access_code,
        target_email: report_detail.target_email,
        target_name: report_detail.target_name,
        target_gender: report_detail.target_gender,
        target_yrs: report_detail.target_yrs,
        cards_set: report_detail.cards_set,
        pick_goal: report_detail.pick_goal,
        pick_care: report_detail.pick_care,
        pick_cj: report_detail.pick_cj,
        pick_ce: report_detail.pick_ce,
        pick_lj: report_detail.pick_lj,
        pick_le: report_detail.pick_le,
        pair_care: report_detail.pair_care,
        pair_lj: report_detail.pair_lj,
        pair_le: report_detail.pair_le,
        pair_cj: report_detail.pair_cj,
        pair_ce: report_detail.pair_ce,
        status: report_detail.status
      })

      // 設定狀態 (canTest)
      this.cards_set.forEach((idx, value) => {
        let hasGoal = false
        if (value === 'goal') {
          hasGoal = true
          this.pick_goal.stage1.canTest = true
          this.pick_goal.stage2.canTest = true
          this.pick_goal.stage3.canTest = true
          this.pick_goal.canTest = true
        }
        if (value === 'care') {
          this.pick_care.canTest = true
          if (hasGoal) {
            this.pair_care.canTest = true
          }
        }
        if (value === 'cj') {
          this.pick_cj.canTest = true
          if (hasGoal) {
            this.pair_cj.canTest = true
          }
        }
        if (value === 'ce') {
          this.pick_ce.canTest = true
          if (hasGoal) {
            this.pair_ce.canTest = true
          }
        }
        if (value === 'lj') {
          this.pick_lj.canTest = true
          if (hasGoal) {
            this.pair_lj.canTest = true
          }
        }
        if (value === 'le') {
          this.pick_le.canTest = true
          if (hasGoal) {
            this.pair_le.canTest = true
          }
        }
      })
    },
    /**
     * 保存報告到後端
     * @param {*} rep_id
     * @Note TODO: 尚未實作
     */
    async saveReportBackend() {
      const res = {
        crd_id: this.crd_id,
        report_name: this.report_name,
        own_id: this.own_id,
        target_id: this.target_id,
        access_code: this.access_code,
        target_name: this.target_name,
        target_gender: this.target_gender,
        target_yrs: this.target_yrs,
        target_email: this.target_email,
        report_id: this.report_id,
        cards_set: this.cards_set,
        pick_goal: this.pick_goal,
        pick_care: this.pick_care,
        pick_cj: this.pick_cj,
        pick_ce: this.pick_ce,
        pick_lj: this.pick_lj,
        pick_le: this.pick_le,
        pair_care: this.pair_care,
        pair_lj: this.pair_lj,
        pair_le: this.pair_le,
        pair_cj: this.pair_cj,
        pair_ce: this.pair_ce,
        status: this.status
      }

      // const save_res = await saveReportAPI(this.report_id, res)
      await saveReportAPI(this.report_id, res)
    },

    async setRecord(cardType, data, stage = 0) {
      this.$patch((state) => {
        if (cardType === 'goal') {
          const targetStage = stage === 0 ? 'stage1' : stage === 1 ? 'stage2' : 'stage3'
          state.pick_goal[targetStage].cards_pool = data.cards_pool
          state.pick_goal[targetStage].cards_status = data.cards_status
          state.pick_goal[targetStage].current_page = data.current_page
          state.pick_goal[targetStage].keep_cards = data.keep_cards
          state.pick_goal[targetStage].logs = data.logs
          state.pick_goal[targetStage].isFinished = data.isFinished
          state.pick_goal.final_cards = data.keep_cards

          if (state.pick_goal[targetStage].keep_cards.length <= 3) {
            if (stage === 0) {
              state.pick_goal.stage2.isFinished = true
              state.pick_goal.stage3.isFinished = true
            }
            if (stage === 1 || stage === 2) {
              state.pick_goal.stage3.isFinished = true
            }
            state.pick_goal.isFinished = true
          }
        } else {
          const targetRef =
            cardType === 'care'
              ? 'pick_care'
              : cardType === 'cj'
              ? 'pick_cj'
              : cardType === 'ce'
              ? 'pick_ce'
              : cardType === 'lj'
              ? 'pick_lj'
              : 'pick_le'
          state[targetRef].cards_pool = data.cards_pool
          state[targetRef].cards_status = data.cards_status
          state[targetRef].current_page = data.current_page
          state[targetRef].keep_cards = data.keep_cards
          state[targetRef].logs = data.logs
          state[targetRef].isFinished = data.isFinished
        }
      })
      await this.saveReportBackend()
    },
    async setPairRecord(cardType, data) {
      const targetRef =
        cardType === 'care'
          ? 'pair_care'
          : cardType === 'lj'
          ? 'pair_lj'
          : cardType === 'le'
          ? 'pair_le'
          : cardType === 'cj'
          ? 'pair_cj'
          : 'pair_ce'
      this.$patch((state) => {
        state[targetRef].cards_pool = data.cards_pool
        state[targetRef].professions = data.professions
        state[targetRef].classifyList = data.classifyList
        state[targetRef].logs = data.logs
        state[targetRef].isFinished = data.isFinished
      })
      await this.saveReportBackend()
    }
  },
  getters: {
    /**
     * 檢查是否存在 goal 卡牌 -> 沒有配置 goal 牌組就無法配對
     * @returns {boolean}
     * @example
     * console.log("CHECK GOAL SET EXIST: ", checkGoalSetExist.value)
     */
    checkGoalSetExist: (state) => {
      return state.cards_set.includes('goal')
    },

    filerOutGoalSet: (state) => {
      return state.cards_set.filter((set) => set !== 'goal')
    },

    /**
     * 計算 pick_goal 的階段
     * @returns {number}
     * @example
     * console.log("COMPUTED PICK GOAL STAGE: ", computedPickGoalStage.value)
     */
    computedPickGoalStage: (state) => {
      const { stage1, stage2, stage3 } = state.pick_goal

      if (!stage1.isFinished && !stage2.isFinished && !stage3.isFinished) {
        return 0 // 當前在 stage1
      }
      if (stage1.isFinished && !stage2.isFinished && !stage3.isFinished) {
        return 1 // 當前在 stage2
      }
      if (stage1.isFinished && stage2.isFinished && !stage3.isFinished) {
        return 2 // 當前在 stage3
      }
      if (stage1.isFinished && !stage2.isFinished && stage3.isFinished) {
        return 10 // 已經完成所有 stage
      }
      if (stage1.isFinished && stage2.isFinished && stage3.isFinished) {
        return 10 // 已經完成所有 stage
      }
      return -1 // 其他情況
    },

    /**
     * 計算 pick_goal 的階段卡片數量
     * @returns {object}
     * @example
     * console.log("COMPUTED PICK GOAL STAGE CARDS: ", computedPickGoalStageCards.value)
     */
    computedPickGoalStageCards: (state) => {
      const { stage1, stage2, stage3 } = state.pick_goal
      return {
        stage1_cards: stage1.keep_cards.length,
        stage2_cards: stage2.keep_cards.length,
        stage3_cards: stage3.keep_cards.length
      }
    },

    computedPickCardsHollandCodeNum: async(state) => {
      if (state.cards_set.length === 0) {
        return null
      }
      // console.log('state.cards_set:', state)
      let result = []
      let total_cate_r = 0
      let total_cate_i = 0
      let total_cate_a = 0
      let total_cate_s = 0
      let total_cate_e = 0
      let total_cate_c = 0

      state.cards_set.map((set) => {
          let cate_r = 0
          let cate_i = 0
          let cate_a = 0
          let cate_s = 0
          let cate_e = 0
          let cate_c = 0
          let type_total = 0
          let cate_result = {}

          let analysisCardSet = set === 'goal' ? state.pick_goal.stage1.keep_cards : state[`pick_${set}`].keep_cards

          analysisCardSet.map((card) => {
            let card_type = null
            if(set === 'goal') {
              let goal_card_type = getCardCoverImage(getCardImageName(card))
              card_type = goal_card_type === 'goal_r' ? 
                'general_r' : goal_card_type === 'goal_i' ? 
                'general_i' : goal_card_type === 'goal_a' ? 
                'general_a' : goal_card_type === 'goal_s' ? 
                'general_s' : goal_card_type === 'goal_e' ? 
                'general_e' : goal_card_type === 'goal_c' ? 
                'general_c' : null
            } else {
              card_type = getCardCoverImage(getCardImageName(card))
            }
            // console.log('card:', getCardImageName(card), card_type,)
            if (card_type === 'general_r') {
              cate_r += 1
            }
            if (card_type === 'general_i') {
              cate_i += 1
            }
            if (card_type === 'general_a') {
              cate_a += 1
            }
            if (card_type === 'general_s') {
              cate_s += 1
            }
            if (card_type === 'general_e') {
              cate_e += 1
            }
            if (card_type === 'general_c') {
              cate_c += 1
            }
            type_total += 1
          })
          total_cate_r += cate_r
          total_cate_i += cate_i
          total_cate_a += cate_a
          total_cate_s += cate_s
          total_cate_e += cate_e
          total_cate_c += cate_c

          cate_result = {
            cate_r: cate_r,
            cate_i: cate_i,
            cate_a: cate_a,
            cate_s: cate_s,
            cate_e: cate_e,
            cate_c: cate_c,
            type_total: type_total
          }

          switch (set) {
            case 'goal':
              result['goal'] = cate_result
              break
            case 'care':
              result['care'] = cate_result
              break
            case 'cj':
              result['cj'] = cate_result
              break
            case 'ce':
              result['ce'] = cate_result
              break
            case 'lj':
              result['lj'] = cate_result
              break
            case 'le':
              result['le'] = cate_result
              break
          }
        })
      let all_total = total_cate_r + total_cate_i + total_cate_a + total_cate_s + total_cate_e + total_cate_c
      result['total'] = {
        cate_r: total_cate_r,
        cate_i: total_cate_i,
        cate_a: total_cate_a,
        cate_s: total_cate_s,
        cate_e: total_cate_e,
        cate_c: total_cate_c,
        type_total: all_total
      }

      return result
    },

    computedPairCardsHollandCodeNum: async(state) => {
      let profession_result = {}

      if (state.cards_set.length === 0) {
        return null
      }
      if(state.pick_goal.final_cards.length === 0) {
        return null
      } else {
        state.pick_goal.final_cards.map((card) => {
          let card_type = getCardImageName(card)
          const profession_data = getGoalCardData(getCardImageName(card))
          profession_result[card_type] = {
            total: 0,
            name: profession_data.title,
            hcode: profession_data.hcode,
            img: card
          };
        })
      }

      let care_total = 0
      let can_total = 0
      let like_total = 0
      let all_total = 0

      state.cards_set.filter((set) => set !== 'goal').map((set) => {
        let target = ''
        let card_type = ''
        if (set === 'care') {
          target = 'pair_care'
          card_type = 'care'
        }
        if (set === 'lj') {
          target = 'pair_lj'
          card_type = 'like'
        }
        if (set === 'le') {
          target = 'pair_le'
          card_type = 'like'
        }
        if (set === 'cj') {
          target = 'pair_cj'
          card_type = 'can'
        }
        if (set === 'ce') {
          target = 'pair_ce'
          card_type = 'can'
        }


        // TODO: profession = 0; cards_pool = 0


        state[target].professions.map((profession) => {
          let profession_name = getCardImageName(profession.class_img)
          profession_result[profession_name][card_type] = profession.cards.length
          profession_result[profession_name]['total'] += profession.cards.length
          if(card_type === 'care') {
            care_total += profession.cards.length
          }
          if(card_type === 'can') {
            can_total += profession.cards.length
          }
          if(card_type === 'like') {
            like_total += profession.cards.length
          }
          all_total += profession.cards.length
        })

        profession_result['total'] = {
          care_total: care_total,
          can_total: can_total,
          like_total: like_total,
          all_total: all_total
        }

      })
      
      
      return profession_result
    }


  },
  persist: true
})
