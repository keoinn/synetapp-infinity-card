import { defineStore } from 'pinia'
import { getReportSettings } from '@/plugins/utils/requests/mock/backend'
export const useExamProcessStore = defineStore('examProcess', {
  state: () => ({
    report_id: null,
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
      final_cards: {},
      canTest: false,
      isFinished: false,
    },
    pick_care: {
      cards_pool: [],
      cards_status: [],
      current_page: 0,
      keep_cards: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_cj: {
      cards_pool: [],
      cards_status: [],
      current_page: 0,
      keep_cards: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_ce: {
      cards_pool: [],
      cards_status: [],
      current_page: 0,
      keep_cards: [],
      logs: [],
      isFinished: false,
      canTest: false
    },
    pick_lj: {
      cards_pool: [],
      cards_status: [],
      current_page: 0,
      keep_cards: [],
      logs: [],
      isFinished: false,
      canTest: false
    },

    pair_care: {},
    pair_lj: {},
    pair_le: {},
    pair_cj: {},
    pair_ce: {}
  }),
  actions: {
    /**
     * 取得報告設定
     * @param {*} rep_id
     */
    async getReportBackend(rep_id) {
        if(this.report_id !== null) {
            return
        }
      const res = await getReportSettings(rep_id)
      this.report_id = rep_id
      this.cards_set = res.data.attributes.cards_set

      this.$patch({
        pick_goal: res.data.attributes.pick_goal,
        pick_care: res.data.attributes.pick_care,
        pick_cj: res.data.attributes.pick_cj,
        pick_ce: res.data.attributes.pick_ce,
        pick_lj: res.data.attributes.pick_lj,
        pick_le: res.data.attributes.pick_le,
        pair_care: res.data.attributes.pair_care,
        pair_lj: res.data.attributes.pair_lj,
        pair_le: res.data.attributes.pair_le,
        pair_cj: res.data.attributes.pair_cj,
        pair_ce: res.data.attributes.pair_ce
      })
    },
    /**
     * 保存報告到後端
     * @param {*} rep_id
     * @Note TODO: 尚未實作
     */
    async saveReportBackend() {
      const res = {
        id: this.report_id,
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
        pair_ce: this.pair_ce
      }
      console.log(res)
    },

    setRecord(cardType, data, stage = 0) {
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

            if(state.pick_goal[targetStage].keep_cards.length <= 3){
              if(stage === 0) {
                state.pick_goal.stage2.isFinished = true
                state.pick_goal.stage3.isFinished = true
              }
              if(stage === 1 || stage === 2) {
                state.pick_goal.stage3.isFinished = true
              }
              state.pick_goal.isFinished = true
            }
        } else {
            const targetRef = cardType === 'care' ? 'pick_care': cardType === 'cj' ? 'pick_cj' : cardType === 'ce' ? 'pick_ce' : cardType === 'lj' ? 'pick_lj' : 'pick_le'
            state[targetRef].cards_pool = data.cards_pool
            state[targetRef].cards_status = data.cards_status
            state[targetRef].current_page = data.current_page
            state[targetRef].keep_cards = data.keep_cards
            state[targetRef].logs = data.logs
            state[targetRef].isFinished = data.isFinished
        }
      })
    },
    setPairRecord(cardType, data) {
      const targetRef = cardType === 'care' ? 'pair_care': cardType === 'lj' ? 'pair_lj' : cardType === 'le' ? 'pair_le' : cardType === 'cj' ? 'pair_cj' : 'pair_ce'
      this.$patch((state) => {
        state[targetRef].cards_pool = data.cards_pool
        state[targetRef].professions = data.professions
        state[targetRef].classifyList = data.classifyList
        state[targetRef].logs = data.logs
        state[targetRef].isFinished = data.isFinished
      })
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
      const { stage1, stage2, stage3 } = state.pick_goal;

      if (!stage1.isFinished && !stage2.isFinished && !stage3.isFinished) {
        return 0; // 當前在 stage1
      }
      if (stage1.isFinished && !stage2.isFinished && !stage3.isFinished) {
        return 1; // 當前在 stage2
      }
      if (stage1.isFinished && stage2.isFinished && !stage3.isFinished) {
        return 2; // 當前在 stage3
      }
      if (stage1.isFinished && !stage2.isFinished && stage3.isFinished) {
        return 10; // 已經完成所有 stage
      }
      if (stage1.isFinished && stage2.isFinished && stage3.isFinished) {
        return 10; // 已經完成所有 stage
      }
      return -1; // 其他情況
    },

    /**
     * 計算 pick_goal 的階段卡片數量
     * @returns {object}
     * @example
     * console.log("COMPUTED PICK GOAL STAGE CARDS: ", computedPickGoalStageCards.value)
     */
    computedPickGoalStageCards: (state) => {
      const { stage1, stage2, stage3 } = state.pick_goal;
      return {
        stage1_cards: stage1.keep_cards.length, 
        stage2_cards: stage2.keep_cards.length, 
        stage3_cards: stage3.keep_cards.length
      }
    }
  },
  persist: true
})
