// 使用 Vite 的 glob 匯入功能批次匯入圖片
const imageModules = import.meta.glob('@/assets/images/cards/*.webp', { eager: true })
import caseGoal from '@/assets/images/case/case_goal.webp'
import caseCare from '@/assets/images/case/case_care.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'

// 依照前綴分類圖片並排序
const categorizeImages = () => {
  const categories = {
    care: [], // 我重視 I Care
    le: [], // 我喜歡 I Like - 國小版
    lj: [], // 我喜歡 I Like - 國中版
    ce: [], // 我可以 I Can - 國小版
    cj: [], // 我可以 I Can - 國中版
    goal: [] // 我就是 I Goal - 職業牌卡
  }

  Object.entries(imageModules).forEach(([path, module]) => {
    const fileName = path.split('/').pop() // 取得檔案名稱
    const prefix = fileName.match(/^[a-z]+/)[0] // 取得前綴
    if (categories[prefix]) {
      categories[prefix].push({
        path: module.default,
        number: parseInt(fileName.match(/\d+/)[0])
      })
    }
  })

  // 對每個類別進行排序
  Object.keys(categories).forEach(key => {
    categories[key].sort((a, b) => a.number - b.number)
    categories[key] = categories[key].map(item => item.path)
  })

  return categories
}

const {
  care: careImages,
  le: leImages,
  lj: ljImages,
  ce: ceImages,
  cj: cjImages,
  goal: goalImages
} = categorizeImages()

// Fisher-Yates 洗牌演算法
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 組合並隨機洗牌卡片
const combineAndShuffle = (...arrays) => {
  // 如果第一個參數是陣列的陣列，則展開它
  const cardArrays = Array.isArray(arrays[0]) ? arrays[0] : arrays;
  
  // 將所有陣列合併成一個
  const combinedCards = cardArrays.reduce((acc, curr) => acc.concat(curr), []);
  
  // 回傳洗牌後的陣列
  return shuffleArray([...combinedCards]);
}

const getCardImageName = (imageUrl) => {
  const cleanUrl = imageUrl.split('?')[0]
  const fullFileName = cleanUrl.split('/').pop() // 完整檔案名（含副檔名）
  const fileName = fullFileName.replace('.webp', '') // 不含副檔名
  const cardName = fileName.split('-')[0]
  return cardName
}

// 根據卡片名稱返回對應的封面圖片
const getCardCoverImage = (cardName) => {
  // 使用正則表達式提取前綴和序號
  const match = cardName.match(/^([a-zA-Z]{2,4})(\d{3})$/);
  
  if (!match) {
    return null; // 如果格式不正確，返回 null
  }

  const prefix = match[1]; // 提取前綴
  const index = parseInt(match[2]); // 提取序號

  const coverMapping = {
    le: {
      1: 'general_a',
      2: 'general_r',
      3: 'general_e',
      4: 'general_c',
      5: 'general_s',
      6: 'general_r',
      7: 'general_a',
      8: 'general_r',
      9: 'general_s',
      10: 'general_e',
      11: 'general_a',
      12: 'general_s',
      13: 'general_s',
      14: 'general_r',
      15: 'general_i',
      16: 'general_s',
      17: 'general_a',
      18: 'general_r',
      19: 'general_s',
      20: 'general_r',
      21: 'general_i',
      22: 'general_e',
      23: 'general_a',
      24: 'general_a',
      25: 'general_s',
      26: 'general_i',
      27: 'general_e',
      28: 'general_e',
      29: 'general_c',
      30: 'general_r',
      31: 'general_e',
      32: 'general_r',
      33: 'general_i',
      34: 'general_e',
      35: 'general_c',
      36: 'general_e',
      37: 'general_e',
      38: 'general_i',
      39: 'general_i',
      40: 'general_c',
      41: 'general_c',
      42: 'general_s',
      43: 'general_e',
      44: 'general_i',
      45: 'general_i',
      46: 'general_c',
      47: 'general_a',
      48: 'general_s',
      49: 'general_a',
      50: 'general_c',
      51: 'general_i',
      52: 'general_i',
      53: 'general_e',
      54: 'general_s',
      55: 'general_c',
      56: 'general_c',
      57: 'general_r',
      58: 'general_c',
      59: 'general_a',
      60: 'general_s',
    },
    lj: {
      1: 'general_e',
      2: 'general_a',
      3: 'general_s',
      4: 'general_s',
      5: 'general_r',
      6: 'general_i',
      7: 'general_s',
      8: 'general_a',
      9: 'general_r',
      10: 'general_s',
      11: 'general_r',
      12: 'general_r',
      13: 'general_i',
      14: 'general_e',
      15: 'general_a',
      16: 'general_a',
      17: 'general_s',
      18: 'general_i',
      19: 'general_e',
      20: 'general_e',
      21: 'general_c',
      22: 'general_e',
      23: 'general_r',
      24: 'general_e',
      25: 'general_r',
      26: 'general_i',
      27: 'general_e',
      28: 'general_c',
      29: 'general_e',
      30: 'general_e',
      31: 'general_i',
      32: 'general_i',
      33: 'general_c',
      34: 'general_c',
      35: 'general_c',
      36: 'general_s',
      37: 'general_e',
      38: 'general_i',
      39: 'general_i',
      40: 'general_c',
      41: 'general_a',
      42: 'general_s',
      43: 'general_a',
      44: 'general_s',
      45: 'general_c',
      46: 'general_i',
      47: 'general_i',
      48: 'general_e',
      49: 'general_s',
      50: 'general_c',
      51: 'general_c',
      52: 'general_r',
      53: 'general_c',
      54: 'general_a',
      55: 'general_r',
      56: 'general_s',
      57: 'general_a',
      58: 'general_r',
      59: 'general_s',
      60: 'general_a',
    },
    ce: {
      1: 'general_r',
      2: 'general_e',
      3: 'general_c',
      4: 'general_s',
      5: 'general_r',
      6: 'general_a',
      7: 'general_r',
      8: 'general_s',
      9: 'general_e',
      10: 'general_a',
      11: 'general_s',
      12: 'general_s',
      13: 'general_r',
      14: 'general_i',
      15: 'general_s',
      16: 'general_a',
      17: 'general_r',
      18: 'general_s',
      19: 'general_r',
      20: 'general_i',
      21: 'general_e',
      22: 'general_a',
      23: 'general_a',
      24: 'general_s',
      25: 'general_i',
      26: 'general_e',
      27: 'general_e',
      28: 'general_c',
      29: 'general_r',
      30: 'general_e',
      31: 'general_r',
      32: 'general_i',
      33: 'general_e',
      34: 'general_c',
      35: 'general_e',
      36: 'general_e',
      37: 'general_i',
      38: 'general_i',
      39: 'general_c',
      40: 'general_c',
      41: 'general_s',
      42: 'general_e',
      43: 'general_i',
      44: 'general_i',
      45: 'general_c',
      46: 'general_a',
      47: 'general_s',
      48: 'general_a',
      49: 'general_c',
      50: 'general_i',
      51: 'general_i',
      52: 'general_e',
      53: 'general_a',
      54: 'general_s',
      55: 'general_c',
      56: 'general_c',
      57: 'general_r',
      58: 'general_c',
      59: 'general_a',
      60: 'general_s',
    },
    cj: {
      1: 'general_a',
      2: 'general_r',
      3: 'general_e',
      4: 'general_c',
      5: 'general_s',
      6: 'general_r',
      7: 'general_a',
      8: 'general_r',
      9: 'general_s',
      10: 'general_e',
      11: 'general_a',
      12: 'general_s',
      13: 'general_s',
      14: 'general_r',
      15: 'general_i',
      16: 'general_s',
      17: 'general_a',
      18: 'general_r',
      19: 'general_s',
      20: 'general_r',
      21: 'general_i',
      22: 'general_e',
      23: 'general_a',
      24: 'general_a',
      25: 'general_s',
      26: 'general_i',
      27: 'general_e',
      28: 'general_e',
      29: 'general_c',
      30: 'general_r',
      31: 'general_e',
      32: 'general_r',
      33: 'general_i',
      34: 'general_e',
      35: 'general_c',
      36: 'general_e',
      37: 'general_e',
      38: 'general_i',
      39: 'general_i',
      40: 'general_c',
      41: 'general_c',
      42: 'general_s',
      43: 'general_e',
      44: 'general_i',
      45: 'general_i',
      46: 'general_c',
      47: 'general_a',
      48: 'general_s',
      49: 'general_a',
      50: 'general_c',
      51: 'general_i',
      52: 'general_i',
      53: 'general_e',
      54: 'general_s',
      55: 'general_c',
      56: 'general_c',
      57: 'general_r',
      58: 'general_c',
      59: 'general_a',
      60: 'general_s',
    },
    care: {
      1: 'general_s',
      2: 'general_a',
      3: 'general_s',
      4: 'general_r',
      5: 'general_s',
      6: 'general_i',
      7: 'general_s',
      8: 'general_e',
      9: 'general_s',
      10: 'general_a',
      11: 'general_e',
      12: 'general_a',
      13: 'general_c',
      14: 'general_i',
      15: 'general_e',
      16: 'general_s',
      17: 'general_a',
      18: 'general_c',
      19: 'general_r',
      20: 'general_i',
      21: 'general_s',
      22: 'general_s',
      23: 'general_c',
      24: 'general_i',
      25: 'general_a',
      26: 'general_e',
      27: 'general_c',
      28: 'general_e',
      29: 'general_r',
      30: 'general_a',
      31: 'general_i',
      32: 'general_c',
      33: 'general_a',
      34: 'general_s',
      35: 'general_s',
      36: 'general_s',
      37: 'general_s',
      38: 'general_e',
      39: 'general_i',
      40: 'general_c',
      41: 'general_r',
      42: 'general_i',
      43: 'general_i',
      44: 'general_c',
      45: 'general_c',
      46: 'general_c',
      47: 'general_c',
      48: 'general_a',
      49: 'general_e',
      50: 'general_i',
      51: 'general_i',
      52: 'general_s',
      53: 'general_r',
      54: 'general_c',
      55: 'general_r',
      56: 'general_a',
      57: 'general_s',
      58: 'general_a',
      59: 'general_s',
      60: 'general_a',
    },
    goal: {
      1: 'goal_s',
      2: 'goal_c',
      3: 'goal_e',
      4: 'goal_s',
      5: 'goal_e',
      6: 'goal_c',
      7: 'goal_s',
      8: 'goal_i',
      9: 'goal_c',
      10: 'goal_e',
      11: 'goal_s',
      12: 'goal_c',
      13: 'goal_e',
      14: 'goal_c',
      15: 'goal_a',
      16: 'goal_i',
      17: 'goal_s',
      18: 'goal_e',
      19: 'goal_c',
      20: 'goal_e',
      21: 'goal_a',
      22: 'goal_s',
      23: 'goal_i',
      24: 'goal_s',
      25: 'goal_e',
      26: 'goal_a',
      27: 'goal_c',
      28: 'goal_i',
      29: 'goal_a',
      30: 'goal_e',
      31: 'goal_c',
      32: 'goal_s',
      33: 'goal_c',
      34: 'goal_a',
      35: 'goal_e',
      36: 'goal_s',
      37: 'goal_e',
      38: 'goal_s',
      39: 'goal_a',
      40: 'goal_e',
      41: 'goal_a',
      42: 'goal_s',
      43: 'goal_s',
      44: 'goal_a',
      45: 'goal_r',
      46: 'goal_e',
      47: 'goal_a',
      48: 'goal_s',
      49: 'goal_c',
      50: 'goal_i',
      51: 'goal_r',
      52: 'goal_a',
      53: 'goal_e',
      54: 'goal_e',
      55: 'goal_a',
      56: 'goal_a',
      57: 'goal_e',
      58: 'goal_a',
      59: 'goal_e',
      60: 'goal_e',
      61: 'goal_a',
      62: 'goal_e',
      63: 'goal_a',
      64: 'goal_e',
      65: 'goal_a',
      66: 'goal_e',
      67: 'goal_e',
      68: 'goal_e',
      69: 'goal_e',
      70: 'goal_e',
      71: 'goal_e',
      72: 'goal_e',
      73: 'goal_e',
      74: 'goal_e',
      75: 'goal_e',
      76: 'goal_e',
      77: 'goal_a',
      78: 'goal_a',
      79: 'goal_a',
      80: 'goal_a',
      81: 'goal_i',
      82: 'goal_i',
      83: 'goal_i',
      84: 'goal_i',
      85: 'goal_i',
      86: 'goal_i',
      87: 'goal_i',
      88: 'goal_i',
      89: 'goal_r',
      90: 'goal_r',
      91: 'goal_r',
      92: 'goal_r',
      93: 'goal_r',
      94: 'goal_r',
      95: 'goal_r',
      96: 'goal_r',
      97: 'goal_r',
      98: 'goal_r',
      99: 'goal_r',
      100: 'goal_r',
    }
  };

  // 根據前綴返回對應的封面圖片
  return coverMapping[prefix] && coverMapping[prefix][index] ? coverMapping[prefix][index] : null;
}

/**
 * 取得職業卡片資料
 * @param {string} imgName
 * @returns {Object}
 */
function getGoalCardData(imgName) {
  const imgData = {
      "goal001": { "title": "戶外體驗教練", "hcode": "SAE" },
      "goal002": { "title": "會計師", "hcode": "CEI" },
      "goal003": { "title": "警察", "hcode": "ESC" },
      "goal004": { "title": "復健師", "hcode": "SIR" },
      "goal005": { "title": "調酒、咖啡師", "hcode": "ECR" },
      "goal006": { "title": "證券分析師", "hcode": "CIE" },
      "goal007": { "title": "健身教練", "hcode": "SRE" },
      "goal008": { "title": "經濟學家", "hcode": "IEC" },
      "goal009": { "title": "網頁設計師", "hcode": "CIR" },
      "goal010": { "title": "船長", "hcode": "ERI" },
      "goal011": { "title": "大學教授", "hcode": "SIR" },
      "goal012": { "title": "工廠作業員", "hcode": "CRE" },
      "goal013": { "title": "工廠廠長", "hcode": "ECS" },
      "goal014": { "title": "採購人員", "hcode": "CER" },
      "goal015": { "title": "演員、歌手", "hcode": "AES" },
      "goal016": { "title": "營養師", "hcode": "ISC" },
      "goal017": { "title": "社工", "hcode": "SEC" },
      "goal018": { "title": "經紀人", "hcode": "ESC" },
      "goal019": { "title": "倉管", "hcode": "CER" },
      "goal020": { "title": "研究發展人員/國科會", "hcode": "ECR" },
      "goal021": { "title": "藝術創作者", "hcode": "ARI" },
      "goal022": { "title": "長照員", "hcode": "SRC" },
      "goal023": { "title": "電機工程師", "hcode": "IRC" },
      "goal024": { "title": "保母", "hcode": "SAE" },
      "goal025": { "title": "導演", "hcode": "EAS" },
      "goal026": { "title": "服裝設計師", "hcode": "AER" },
      "goal027": { "title": "總統、市長、民意代表", "hcode": "CES" },
      "goal028": { "title": "藥物研發員", "hcode": "ICS" },
      "goal029": { "title": "彩妝、美容美髮師", "hcode": "AES" },
      "goal030": { "title": "生命禮儀師", "hcode": "ESC" },
      "goal031": { "title": "秘書、業務助理", "hcode": "CEI" },
      "goal032": { "title": "觀護人", "hcode": "SEC" },
      "goal033": { "title": "公務員", "hcode": "CES" },
      "goal034": { "title": "動漫畫設計師", "hcode": "AIR" },
      "goal035": { "title": "客服", "hcode": "ESC" },
      "goal036": { "title": "導遊", "hcode": "SEA" },
      "goal037": { "title": "宗教師", "hcode": "ESC" },
      "goal038": { "title": "老師", "hcode": "SAE" },
      "goal039": { "title": "音樂家", "hcode": "AES" },
      "goal040": { "title": "空服員", "hcode": "ESC" },
      "goal041": { "title": "舞蹈家", "hcode": "ARE" },
      "goal042": { "title": "護理師", "hcode": "SIC" },
      "goal043": { "title": "心理師", "hcode": "SIA" },
      "goal044": { "title": "新聞主播", "hcode": "AES" },
      "goal045": { "title": "芳療師", "hcode": "RSC" },
      "goal046": { "title": "銀行員、證券交易員", "hcode": "ECS" },
      "goal047": { "title": "博物館、美術館導覽", "hcode": "AIS" },
      "goal048": { "title": "命理諮詢師", "hcode": "SAE" },
      "goal049": { "title": "總務行政部門主管", "hcode": "ECR" },
      "goal050": { "title": "電腦工程師", "hcode": "IRC" },
      "goal051": { "title": "食品檢驗師", "hcode": "RIC" },
      "goal052": { "title": "口譯人員", "hcode": "ASI" },
      "goal053": { "title": "行銷人員", "hcode": "ECS" },
      "goal054": { "title": "廣告創意總監", "hcode": "EAC" },
      "goal055": { "title": "記者", "hcode": "AEI" },
      "goal056": { "title": "建築師", "hcode": "AIR" },
      "goal057": { "title": "網路銷售業", "hcode": "ECR" },
      "goal058": { "title": "室內設計師", "hcode": "AER" },
      "goal059": { "title": "業務員", "hcode": "ECS" },
      "goal060": { "title": "直播拍賣主", "hcode": "ESA" },
      "goal061": { "title": "魔術師", "hcode": "AER" },
      "goal062": { "title": "保險業務員", "hcode": "ECS" },
      "goal063": { "title": "攝影師", "hcode": "ARC" },
      "goal064": { "title": "傳直銷業者", "hcode": "EIS" },
      "goal065": { "title": "模特兒", "hcode": "AER" },
      "goal066": { "title": "律師", "hcode": "EIS" },
      "goal067": { "title": "企業主、創業家", "hcode": "ESI" },
      "goal068": { "title": "公關部門主管、發言人", "hcode": "EAS" },
      "goal069": { "title": "人力資源管理主管", "hcode": "ESC" },
      "goal070": { "title": "農業經營管理人員", "hcode": "ERI" },
      "goal071": { "title": "企業執行長", "hcode": "ECS" },
      "goal072": { "title": "法官", "hcode": "ESA" },
      "goal073": { "title": "理財顧問", "hcode": "ECS" },
      "goal074": { "title": "門市銷售", "hcode": "ECS" },
      "goal075": { "title": "活動企劃員", "hcode": "ECS" },
      "goal076": { "title": "外交官", "hcode": "ESA" },
      "goal077": { "title": "遊戲設計工程師", "hcode": "AEI" },
      "goal078": { "title": "出版傳播業", "hcode": "AIC" },
      "goal079": { "title": "作家、編輯", "hcode": "AEC" },
      "goal080": { "title": "網紅、直播主", "hcode": "AES" },
      "goal081": { "title": "獸醫", "hcode": "IRS" },
      "goal082": { "title": "程式設計員", "hcode": "ICR" },
      "goal083": { "title": "環境安全檢驗員", "hcode": "IRC" },
      "goal084": { "title": "醫生", "hcode": "ISR" },
      "goal085": { "title": "自然保育員", "hcode": "IRC" },
      "goal086": { "title": "法醫", "hcode": "IRC" },
      "goal087": { "title": "大數據分析師", "hcode": "IEC" },
      "goal088": { "title": "科學家", "hcode": "IRC" },
      "goal089": { "title": "廚師", "hcode": "REC" },
      "goal090": { "title": "運動員", "hcode": "REI" },
      "goal091": { "title": "園藝師", "hcode": "RCA" },
      "goal092": { "title": "軍人", "hcode": "RCE" },
      "goal093": { "title": "電競選手", "hcode": "RIS" },
      "goal094": { "title": "司機", "hcode": "REI" },
      "goal095": { "title": "飛機機長", "hcode": "RCI" },
      "goal096": { "title": "動物訓練師", "hcode": "RCI" },
      "goal097": { "title": "土木工程師", "hcode": "RCI" },
      "goal098": { "title": "消防員", "hcode": "RSE" },
      "goal099": { "title": "汽車維修員", "hcode": "RIC" },
      "goal100": { "title": "外送員", "hcode": "RCS" }
  };
  return imgData[imgName] || { "title": "未知", "hcode": "未知" };
}

function getGuidanceContent(type, stage = 0, remainingCards = 0) {
  const goalContentFirstLine = () => {
    if (stage === 0) {
      return `<li>
                接下來將會有 100 種職業別顯示於畫面上，請依照你個人的判斷與感受，選出<span
                  class="highlight"
                  >你喜歡的、你憧憬的、對該職業有熱情未來有可能想去從事的行業</span
                >。
              </li>`
    } else if (stage === 1) {
      return `<li>
                 請在剛剛選擇<span class="highlight">「喜歡的職業」</span>中共有 ${remainingCards} 種職業別顯示於畫面上，
                 挑選至多<span class="highlight"> 10 </span>個，你<span class="highlight">「未來很想從事的職業」</span>。
              </li>`
    } else if (stage === 2) {
      return `<li>
                 請在剛剛選擇<span class="highlight">「未來很想從事的職業」</span>中共有 ${remainingCards} 種職業別顯示於畫面上，
                 挑選至多<span class="highlight"> 3 </span>個，你<span class="highlight">「未來最想做的職業」</span>。
              </li>`
    }
  }
  switch (type) {
    case 'goal':
      return {
        coverImg: caseGoal,
        title: '我就是',
        subtitle: '我憧憬的職業',
        content: `<ul>
                    ${goalContentFirstLine()}
                    <li>
                      請在 5 分鐘內，<span class="highlight">點擊</span
                      >職業卡牌可以將牌面翻開或蓋上，正面表示你留下選擇的職業卡牌。
                    </li>
                    <li>
                      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                    </li>
                  </ul>`
      }
    case 'care':
      return {
        coverImg: caseCare,
        title: '我重視',
        subtitle: '我重視的特質',
        content: `<ul>
                    <li>
                      接下來將會有有 60 種特質顯示於畫面上，請依照你個人的判斷與感受，選出
                      <span class="highlight">你重視的能力或特質</span>，請以第一直覺選擇。
                    </li>
                    <li>
                      請在 5 分鐘內，<span class="highlight">點擊</span>卡牌可以將牌面翻開或蓋上，正面表示你留下該重視的能力或特質。
                    </li>
                    <li>
                      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                    </li>
                  </ul>
        `
      }
    case 'lj':
      return {
        coverImg: caseLj,
        title: '我喜歡',
        subtitle: '我喜歡的特質',
        content: `<ul>
                    <li>
                      接下來將會有有 60 種喜歡做的事情顯示於畫面上，請依照你個人的判斷與感受，選出
                      <span class="highlight">你喜歡做的事情</span>，請以第一直覺選擇。
                    </li>
                    <li>
                      請在 5 分鐘內，<span class="highlight">點擊</span>卡牌可以將牌面翻開或蓋上，正面表示該卡片描述是你喜歡做的事情。
                    </li>
                    <li>
                      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                    </li>
                  </ul>`
      }
    case 'le':
      return {
        coverImg: caseLe,
        title: '我喜歡-國小版',
        subtitle: '我喜歡的特質',
        content: `<ul>
                    <li>
                      接下來將會有有 60 種喜歡做的事情顯示於畫面上，請依照你個人的判斷與感受，選出
                      <span class="highlight">你喜歡做的事情</span>，請以第一直覺選擇。
                    </li>
                    <li>
                      請在 5 分鐘內，<span class="highlight">點擊</span>卡牌可以將牌面翻開或蓋上，正面表示該卡片描述是你喜歡做的事情。
                    </li>
                    <li>
                      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                    </li>
                  </ul>`
      }
    case 'ce':
      return {
        coverImg: caseCe,
        title: '我可以-國小版',
        subtitle: '我可以做到的事情',
        content: `<ul>
                    <li>
                      接下來將會有有 60 種自己會或是做得到的敘述顯示於畫面上，請依照你個人的判斷與感受，選出
                      <span class="highlight">自己會的或是做得到的事情</span>，請以第一直覺選擇。
                    </li>
                    <li>
                      請在 5 分鐘內，<span class="highlight">點擊</span>卡牌可以將牌面翻開或蓋上，正面表示該卡片描述是你可以做到的事情或能力。
                    </li>
                    <li>
                      最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                    </li>
                  </ul>`
      }
    case 'cj':
      return {
        coverImg: caseCj,
        title: '我可以',
        subtitle: '我可以做到的事情',
        content: `<ul>
                      <li>
                        接下來將會有有 60 種自己會或是做得到的敘述顯示於畫面上，請依照你個人的判斷與感受，選出
                        <span class="highlight">自己會的或是做得到的事情</span>，請以第一直覺選擇。
                      </li>
                      <li>
                        請在 5 分鐘內，<span class="highlight">點擊</span>卡牌可以將牌面翻開或蓋上，正面表示該卡片描述是你可以做到的事情或能力。
                      </li>
                      <li>
                        最後按下<span class="highlight">「完成卡片選擇」</span>按鈕結束這一階段的測驗。
                      </li>
                    </ul>`
        }
  }
}

export {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages,
  combineAndShuffle,
  getCardImageName,
  getCardCoverImage,
  getGoalCardData,
  getGuidanceContent
}
