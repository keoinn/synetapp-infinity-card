import { defineStore } from 'pinia'
// import { getReportSettings } from '@/plugins/utils/requests/mock/backend'
import { getReportDetailAPI, saveReportAPI } from '@/plugins/utils/requests/api/backend'
import { getCardImageName, getCardCoverImage, getGoalCardData } from '@/plugins/utils/psy_cards'
import i18n from '@/i18n'
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

    calculate_pick: {
      goal: {
        r: 0,
        i: 0,
        a: 0,
        s: 0,
        e: 0,
        c: 0,
        total: 0,
        h_code: null,
        rate: {
          r: 0.0,
          i: 0.0,
          a: 0.0,
          s: 0.0,
          e: 0.0,
          c: 0.0,
        }
      },
      care: {
        r: 0,
        i: 0,
        a: 0,
        s: 0,
        e: 0,
        c: 0,
        total: 0,
        h_code: null,
        rate: {
          r: 0.0,
          i: 0.0,
          a: 0.0,
          s: 0.0,
          e: 0.0,
          c: 0.0,
        }
      },
      can: {
        r: 0,
        i: 0,
        a: 0,
        s: 0,
        e: 0,
        c: 0,
        total: 0,
        h_code: null,
        rate: {
          r: 0.0,
          i: 0.0,
          a: 0.0,
          s: 0.0,
          e: 0.0,
          c: 0.0,
        }
      },
      like: {
        r: 0,
        i: 0,
        a: 0,
        s: 0,
        e: 0,
        c: 0,
        total: 0,
        h_code: null,
        rate: {
          r: 0.0,
          i: 0.0,
          a: 0.0,
          s: 0.0,
          e: 0.0,
          c: 0.0,
        }
      },
      total: {
        r: 0,
        i: 0,
        a: 0,
        s: 0,
        e: 0,
        c: 0,
        total: 0,
        h_code: null,
        rate: {
          r: 0.0,
          i: 0.0,
          a: 0.0,
          s: 0.0,
          e: 0.0,
          c: 0.0,
        }
      }
    },

    calculate_pair: {
      job1: {
        care: 0,
        like: 0,
        can: 0,
        total: 0,
        rate: {
          care: 0.0,
          like: 0.0,
          can: 0.0,
        },
        title: null,
        img: null,
        hcode: null,
      },
      job2: {
        care: 0,
        like: 0,
        can: 0,
        total: 0,
        rate: {
          care: 0.0,
          like: 0.0,
          can: 0.0,
        },
        title: null,
        img: null,
        hcode: null,
      },
      job3: {
        care: 0,
        like: 0,
        can: 0,
        total: 0,
        rate: {
          care: 0.0,
          like: 0.0,
          can: 0.0,
        },
        title: null,
        img: null,
        hcode: null,
      },
      total: {
        care: 0,
        like: 0,
        can: 0,
        total: 0,
        rate: {
          care: 0.0,
          like: 0.0,
          can: 0.0,
        },
        title: i18n.global.t('result.Total'),
        img: null,
        hcode: null,  
      }
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
      console.log('report_detail:', report_detail)
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
      
      // 只有在已登入狀態下才調用 API 請求
      // TODO: 都要儲存至後端
      if (!this.own_id) {
        this.own_id = 'guest'
        console.log('own_id:', this.own_id, 'setRecord')
      }
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
      
      // 只有在已登入狀態下才調用 API 請求
      if (!this.own_id) {
        this.own_id = 'guest'
        console.log('own_id:', this.own_id, 'saveReportBackend')
      }
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
    },

    calculatePickResult: (state) => {
      // Reset calculate_pick
      state.calculate_pick = {
        goal: {
          r: 0,
          i: 0,
          a: 0,
          s: 0,
          e: 0,
          c: 0,
          total: 0,
          h_code: null,
          rate: {
            r: 0.0,
            i: 0.0,
            a: 0.0,
            s: 0.0,
            e: 0.0,
            c: 0.0,
          }
        },
        care: {
          r: 0,
          i: 0,
          a: 0,
          s: 0,
          e: 0,
          c: 0,
          total: 0,
          h_code: null,
          rate: {
            r: 0.0,
            i: 0.0,
            a: 0.0,
            s: 0.0,
            e: 0.0,
            c: 0.0,
          }
        },
        can: {
          r: 0,
          i: 0,
          a: 0,
          s: 0,
          e: 0,
          c: 0,
          total: 0,
          h_code: null,
          rate: {
            r: 0.0,
            i: 0.0,
            a: 0.0,
            s: 0.0,
            e: 0.0,
            c: 0.0,
          }
        },
        like: {
          r: 0,
          i: 0,
          a: 0,
          s: 0,
          e: 0,
          c: 0,
          total: 0,
          h_code: null,
          rate: {
            r: 0.0,
            i: 0.0,
            a: 0.0,
            s: 0.0,
            e: 0.0,
            c: 0.0,
          }
        },
        total: {
          r: 0,
          i: 0,
          a: 0,
          s: 0,
          e: 0,
          c: 0,
          total: 0,
          h_code: null,
          rate: {
            r: 0.0,
            i: 0.0,
            a: 0.0,
            s: 0.0,
            e: 0.0,
            c: 0.0,
          }
        }
      }

      if(state.cards_set == null) {
        return
      }
  
      // 計算 pick_goal 的階段卡片數量
      let total_cate_r = 0
      let total_cate_i = 0
      let total_cate_a = 0
      let total_cate_s = 0
      let total_cate_e = 0
      let total_cate_c = 0

      state.cards_set.map((set) => {
        let analysisCardSet = set === 'goal' ? state.pick_goal.stage1.keep_cards : state[`pick_${set}`].keep_cards
        let targetRef = 
            set === 'goal' ? 'goal' : 
            set === 'care' ? 'care' : 
            set === 'cj' ? 'can' : 
            set === 'ce' ? 'can' : 
            set === 'lj' ? 'like' : 
            set === 'le' ? 'like' : null
        let type_num = 0
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


          if(card_type === 'general_r') {
            state.calculate_pick[targetRef].r += 1
          }
          if(card_type === 'general_i') {
            state.calculate_pick[targetRef].i += 1
          } 
          if(card_type === 'general_a') {
            state.calculate_pick[targetRef].a += 1
          }
          if(card_type === 'general_s') {
            state.calculate_pick[targetRef].s += 1
          }
          if(card_type === 'general_e') {
            state.calculate_pick[targetRef].e += 1
          }
          if(card_type === 'general_c') {
            state.calculate_pick[targetRef].c += 1
          }
          type_num += 1
        })
        state.calculate_pick[targetRef].total = type_num
        total_cate_r += state.calculate_pick[targetRef].r
        total_cate_i += state.calculate_pick[targetRef].i
        total_cate_a += state.calculate_pick[targetRef].a
        total_cate_s += state.calculate_pick[targetRef].s
        total_cate_e += state.calculate_pick[targetRef].e
        total_cate_c += state.calculate_pick[targetRef].c
      })
      state.calculate_pick.total.r = total_cate_r
      state.calculate_pick.total.i = total_cate_i
      state.calculate_pick.total.a = total_cate_a
      state.calculate_pick.total.s = total_cate_s
      state.calculate_pick.total.e = total_cate_e
      state.calculate_pick.total.c = total_cate_c
      state.calculate_pick.total.total = total_cate_r + total_cate_i + total_cate_a + total_cate_s + total_cate_e + total_cate_c

      // 計算 rate
      state.calculate_pick.goal.rate.r = parseFloat((state.calculate_pick.goal.r / 14 * 100).toFixed(2))
      state.calculate_pick.goal.rate.i = parseFloat((state.calculate_pick.goal.i / 13 * 100).toFixed(2))
      state.calculate_pick.goal.rate.a = parseFloat((state.calculate_pick.goal.a / 20 * 100).toFixed(2))
      state.calculate_pick.goal.rate.s = parseFloat((state.calculate_pick.goal.s / 13 * 100).toFixed(2))
      state.calculate_pick.goal.rate.e = parseFloat((state.calculate_pick.goal.e / 30 * 100).toFixed(2))
      state.calculate_pick.goal.rate.c = parseFloat((state.calculate_pick.goal.c / 10 * 100).toFixed(2))

      state.calculate_pick.care.rate.r = parseFloat((state.calculate_pick.care.r /  6 * 100).toFixed(2))
      state.calculate_pick.care.rate.i = parseFloat((state.calculate_pick.care.i / 10 * 100).toFixed(2))
      state.calculate_pick.care.rate.a = parseFloat((state.calculate_pick.care.a / 11 * 100).toFixed(2))
      state.calculate_pick.care.rate.s = parseFloat((state.calculate_pick.care.s / 15 * 100).toFixed(2))
      state.calculate_pick.care.rate.e = parseFloat((state.calculate_pick.care.e / 7 * 100).toFixed(2))
      state.calculate_pick.care.rate.c = parseFloat((state.calculate_pick.care.c / 11 * 100).toFixed(2))

      state.calculate_pick.can.rate.r = parseFloat((state.calculate_pick.can.r /  9 * 100).toFixed(2))
      state.calculate_pick.can.rate.i = parseFloat((state.calculate_pick.can.i / 10 * 100).toFixed(2))
      state.calculate_pick.can.rate.a = parseFloat((state.calculate_pick.can.a /  9 * 100).toFixed(2))
      state.calculate_pick.can.rate.s = parseFloat((state.calculate_pick.can.s / 11 * 100).toFixed(2))
      state.calculate_pick.can.rate.e = parseFloat((state.calculate_pick.can.e / 11 * 100).toFixed(2))
      state.calculate_pick.can.rate.c = parseFloat((state.calculate_pick.can.c / 10 * 100).toFixed(2))
      
      state.calculate_pick.like.rate.r = parseFloat((state.calculate_pick.like.r /  9 * 100).toFixed(2))
      state.calculate_pick.like.rate.i = parseFloat((state.calculate_pick.like.i / 10 * 100).toFixed(2))
      state.calculate_pick.like.rate.a = parseFloat((state.calculate_pick.like.a /  9 * 100).toFixed(2))
      state.calculate_pick.like.rate.s = parseFloat((state.calculate_pick.like.s / 11 * 100).toFixed(2))
      state.calculate_pick.like.rate.e = parseFloat((state.calculate_pick.like.e / 11 * 100).toFixed(2))
      state.calculate_pick.like.rate.c = parseFloat((state.calculate_pick.like.c / 10 * 100).toFixed(2))
      
      state.calculate_pick.total.rate.r = parseFloat((state.calculate_pick.total.r / 38 * 100).toFixed(2))
      state.calculate_pick.total.rate.i = parseFloat((state.calculate_pick.total.i / 43 * 100).toFixed(2))
      state.calculate_pick.total.rate.a = parseFloat((state.calculate_pick.total.a / 49 * 100).toFixed(2))
      state.calculate_pick.total.rate.s = parseFloat((state.calculate_pick.total.s / 50 * 100).toFixed(2))
      state.calculate_pick.total.rate.e = parseFloat((state.calculate_pick.total.e / 60 * 100).toFixed(2))
      state.calculate_pick.total.rate.c = parseFloat((state.calculate_pick.total.c / 40 * 100).toFixed(2))
      
      // 計算 h_code
      // state.calculate_pick.goal.rate.r = parseFloat(14)
      // state.calculate_pick.goal.rate.i = parseFloat(88)
      // state.calculate_pick.goal.rate.a = parseFloat(66)
      // state.calculate_pick.goal.rate.s = parseFloat(66)
      // state.calculate_pick.goal.rate.e = parseFloat(12)
      // state.calculate_pick.goal.rate.c = parseFloat(25)


      const exam_type = ['goal', 'care', 'can', 'like', 'total']
      exam_type.map((exam) => {
        let high_sign = 0
        let medium_high_sign = 0
        // eslint-disable-next-line no-unused-vars
        let medium_sign = 0
        // eslint-disable-next-line no-unused-vars
        let low_sign = 0
  
        const rate_list = ['r', 'i', 'a', 's', 'e', 'c']
        rate_list.map((type) => {
          if(state.calculate_pick[exam].rate[type] > 66) {
            high_sign += 1
          } else if(state.calculate_pick[exam].rate[type] > 50 && state.calculate_pick[exam].rate[type] <= 66) {
            medium_high_sign += 1
          } else if(state.calculate_pick[exam].rate[type] > 33 && state.calculate_pick[exam].rate[type] <= 50) {
            medium_sign += 1
          } else {
            low_sign += 1
          }
        })
        
        let h_code_analysis = {
          r: state.calculate_pick[exam].rate.r,
          i: state.calculate_pick[exam].rate.i,
          a: state.calculate_pick[exam].rate.a,
          s: state.calculate_pick[exam].rate.s,
          e: state.calculate_pick[exam].rate.e,
          c: state.calculate_pick[exam].rate.c
        }
        let h_code = ""
  
        if(high_sign == 1) {
            // 找出最大值並返回其 key（大寫）
            h_code = Object.entries(h_code_analysis).reduce((max, entry) => {
            return entry[1] > max[1] ? entry : max;
          }, ['initial', 0])[0].toUpperCase();
        } else if(high_sign == 2) {
          let high_values = Object.entries(h_code_analysis)
            .filter((value) => value[1] > 66) // 篩選出大於 66 的元素
            .sort((a, b) => b[1] - a[1]); // 由大至小排
          let difference = Math.abs(high_values[0][1] - high_values[1][1]);
          if (difference >= 12) {
            h_code = high_values[0][0].toUpperCase(); // 輸出比例最高的 key
          } else {
            h_code = high_values.map(([key]) => key.toUpperCase()).join(''); // 串接兩個 key
          }
        } else if(high_sign == 3) {
          let high_values = Object.entries(h_code_analysis)
            .filter((value) => value[1] > 66) // 篩選出大於 66 的元素
            .sort((a, b) => b[1] - a[1]); // 由大至小排
          let differences = high_values.map(value => value[1] - high_values[2][1]);
          if (differences[0] >= 12 && differences[1] < 12) {
            h_code = high_values[0][0].toUpperCase(); // 輸出比例最高的 key
          } else if (differences[0] < 12 && differences[1] < 12) {
            h_code = i18n.global.t('result.careerUnspecified');
          }
        } else if (high_sign == 0 && medium_high_sign == 1) {
          h_code = Object.entries(h_code_analysis).reduce((max, entry) => {
            return entry[1] > max[1] ? entry : max;
          }, ['initial', 0])[0].toUpperCase();
        } else if(high_sign == 0 && medium_high_sign == 2) {
          let medium_high_values = Object.entries(h_code_analysis)
          .filter((value) => value[1] > 50 && value[1] <= 66) // 篩選出大於 50 小於 66 的元素
          .sort((a, b) => b[1] - a[1]); // 由大至小排
          let difference = Math.abs(medium_high_values[0][1] - medium_high_values[1][1]);
          if (difference >= 12) {
            h_code = medium_high_values[0][0].toUpperCase(); // 輸出比例最高的 key
          } else {
            h_code = medium_high_values.map(([key]) => key.toUpperCase()).join(''); // 串接兩個 key
          }
        } else if (high_sign == 0 && medium_high_sign >= 3) {
          h_code = i18n.global.t('result.careerUnspecified');
        } else { // high_sign == 0 && medium_high_sign == 0
          h_code = i18n.global.t('result.careerUnspecified');
        }

        state.calculate_pick[exam].h_code = h_code
      });

      return state.calculate_pick
    },

    calculatePairResult: (state) => {
      // Reset calculate_pair
      state.calculate_pair = {
        job1: {
          care: 0,
          like: 0,
          can: 0,
          total: 0,
          rate: {
            care: 0.0,
            like: 0.0,
            can: 0.0,
          },
          title: null,
          img: null,
          hcode: null,
        },
        job2: {
          care: 0,
          like: 0,
          can: 0,
          total: 0,
          rate: {
            care: 0.0,
            like: 0.0,
            can: 0.0,
          },
          title: null,
          img: null,
          hcode: null,
        },
        job3: {
          care: 0,
          like: 0,
          can: 0,
          total: 0,
          rate: {
            care: 0.0,
            like: 0.0,
            can: 0.0,
          },
          title: null,
          img: null,
          hcode: null,
        },
        total: {
          care: 0,
          like: 0,
          can: 0,
          total: 0,
          rate: {
            care: 0.0,
            like: 0.0,
            can: 0.0,
          },
          title: i18n.global.t('result.Total'),
          img: null,
          hcode: null,
        }
      }

      if(state.cards_set == null) {
        return state.calculate_pair
      }

      if(state.pick_goal.final_cards === undefined) {
        return state.calculate_pair
      }

      if(state.pick_goal.final_cards.length === 0) {
        return state.calculate_pair
      } else {
        state.pick_goal.final_cards.map((card, idx) => {
          let card_type = getCardImageName(card)
          const profession_data = getGoalCardData(card_type)
          state.calculate_pair[`job${idx + 1}`].title = profession_data.title
          state.calculate_pair[`job${idx + 1}`].img = card
          state.calculate_pair[`job${idx + 1}`].hcode = profession_data.hcode
        })
      }

      // 計算 pair 階段卡片數量
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

        state[target].professions.map((profession, idx) => {
          state.calculate_pair[`job${idx + 1}`][card_type] = profession.cards.length
          state.calculate_pair[`job${idx + 1}`]['total'] += profession.cards.length
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
      })

      state.calculate_pair.total.care = care_total
      state.calculate_pair.total.can = can_total
      state.calculate_pair.total.like = like_total
      state.calculate_pair.total.total = all_total

      // 計算 pair 階段的 rate 與 職業卡牌的得牌總數
      if(state.calculate_pair.job1.title != null) {
        state.calculate_pair.job1.total = state.calculate_pair.job1.care + state.calculate_pair.job1.like + state.calculate_pair.job1.can
        state.calculate_pair.job1.rate.care = parseFloat((state.calculate_pair.job1.care / state.calculate_pair.total.care * 100).toFixed(2))
        state.calculate_pair.job1.rate.like = parseFloat((state.calculate_pair.job1.like / state.calculate_pair.total.like * 100).toFixed(2))
        state.calculate_pair.job1.rate.can = parseFloat((state.calculate_pair.job1.can / state.calculate_pair.total.can * 100).toFixed(2))
      }
      if(state.calculate_pair.job2.title != null) {
        state.calculate_pair.job2.total = state.calculate_pair.job2.care + state.calculate_pair.job2.like + state.calculate_pair.job2.can
        state.calculate_pair.job2.rate.care = parseFloat((state.calculate_pair.job2.care / state.calculate_pair.total.care * 100).toFixed(2))
        state.calculate_pair.job2.rate.like = parseFloat((state.calculate_pair.job2.like / state.calculate_pair.total.like * 100).toFixed(2))
        state.calculate_pair.job2.rate.can = parseFloat((state.calculate_pair.job2.can / state.calculate_pair.total.can * 100).toFixed(2))
      }
      if(state.calculate_pair.job3.title != null) {
        state.calculate_pair.job3.total = state.calculate_pair.job3.care + state.calculate_pair.job3.like + state.calculate_pair.job3.can
        state.calculate_pair.job3.rate.care = parseFloat((state.calculate_pair.job3.care / state.calculate_pair.total.care * 100).toFixed(2))
        state.calculate_pair.job3.rate.like = parseFloat((state.calculate_pair.job3.like / state.calculate_pair.total.like * 100).toFixed(2))
        state.calculate_pair.job3.rate.can = parseFloat((state.calculate_pair.job3.can / state.calculate_pair.total.can * 100).toFixed(2))
      }

      return state.calculate_pair 
    }


  },
  persist: true
})
