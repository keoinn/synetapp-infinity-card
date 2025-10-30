// 使用 Vite 的 glob 匯入功能批次匯入圖片
const imageModules = import.meta.glob('@/assets/images/cards/zh_cn/*.webp', { eager: true })
import caseGoal from '@/assets/images/case/case_goal.webp'
import caseCare from '@/assets/images/case/case_care.webp'
import caseLe from '@/assets/images/case/case_le.webp'
import caseLj from '@/assets/images/case/case_lj.webp'
import caseCe from '@/assets/images/case/case_ce.webp'
import caseCj from '@/assets/images/case/case_cj.webp'
import i18n from '@/i18n'

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

/**
 * 根據卡片代號獲取圖片路徑
 * @param {string} cardCode - 卡片代號 (如: 'goal001', 'care001')
 * @returns {string} 圖片路徑
 */
const getCardImagePath = (cardCode) => {
  if (!cardCode) return ''
  
  // 從所有圖片陣列中尋找匹配的卡片
  const allImages = [...careImages, ...leImages, ...ljImages, ...ceImages, ...cjImages, ...goalImages]
  
  // 尋找匹配的圖片路徑
  const matchedImage = allImages.find(imagePath => {
    const imageName = getCardImageName(imagePath)
    return imageName === cardCode
  })
  
  return matchedImage || ''
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
      return i18n.global.t('playground.GoalSelectDescriptionStage1')
    } else if (stage === 1) {
      let text = i18n.global.t('playground.GoalSelectDescriptionStage2')
      text = text.replace('#remainingCards#', remainingCards)
      return text
    } else if (stage === 2) {
      let text = i18n.global.t('playground.GoalSelectDescriptionStage3')
      text = text.replace('#remainingCards#', remainingCards)
      text = text.replace('#remainingCards#', remainingCards)
      return text
    }
  }
  switch (type) {
    case 'goal':
      return {
        coverImg: caseGoal,
        title: i18n.global.t('product.goal'),
        subtitle: i18n.global.t('playground.GoalSubTitle'),
        content: `<ul>
                    ${goalContentFirstLine()}
                    ${i18n.global.t('playground.PickupCardRuleGoal')}
                    ${i18n.global.t('playground.PickupCardRuleFinish')}
                  </ul>`
      }
    case 'care':
      return {
        coverImg: caseCare,
        title: i18n.global.t('product.care'),
        subtitle: i18n.global.t('playground.CareSubTitle'),
        content: `<ul>
                      ${i18n.global.t('playground.CareSelectDescription')}
                      ${i18n.global.t('playground.PickupCardRuleCare')}
                      ${i18n.global.t('playground.PickupCardRuleFinish')}
                    </ul>
        `
      }
    case 'lj':
      return {
        coverImg: caseLj,
        title: i18n.global.t('product.like'),
        subtitle: i18n.global.t('playground.LikeSubTitle'),
        content: `<ul>
                      ${i18n.global.t('playground.LikeSelectDescription')}
                      ${i18n.global.t('playground.PickupCardRuleLike')}
                      ${i18n.global.t('playground.PickupCardRuleFinish')}
                    </ul>
        `
      }
    case 'le':
      return {
        coverImg: caseLe,
        title: i18n.global.t('product.leTitle'),
        subtitle: i18n.global.t('playground.LikeSubTitle'),
        content: `<ul>
                      ${i18n.global.t('playground.LikeSelectDescription')}
                      ${i18n.global.t('playground.PickupCardRuleLike')}
                      ${i18n.global.t('playground.PickupCardRuleFinish')}
                    </ul>
        `
      }
    case 'ce':
      return {
        coverImg: caseCe,
        title: i18n.global.t('product.ceTitle'),
        subtitle: i18n.global.t('playground.CanSubTitle'),
        content: `<ul>
                      ${i18n.global.t('playground.CanSelectDescription')}
                      ${i18n.global.t('playground.PickupCardRuleCan')}
                      ${i18n.global.t('playground.PickupCardRuleFinish')}
                    </ul>
        `
      }
    case 'cj':
      return {
        coverImg: caseCj,
        title: i18n.global.t('product.can'),
        subtitle: i18n.global.t('playground.CanSubTitle'),
        content: `<ul>
                      ${i18n.global.t('playground.CanSelectDescription')}
                      ${i18n.global.t('playground.PickupCardRuleCan')}
                      ${i18n.global.t('playground.PickupCardRuleFinish')}
                    </ul>
        `
        }
  }
}

// TODO: 全高 全低 規則判斷尚未實現
function getFinalResult(type = "NONE") {
  const note = "在職涯探索的過程中，需要理解的一個重要概念是，沒有任何工作領域能百分之百對應單一職業興趣類型。大多數的職業或工作任務，往往包含多種不同特質的需求與挑戰，並非僅屬於某一個單一類型。因此，在職業分類時，多數工作領域都是由數個職業興趣類型組合而成，這也反映了現實工作情境的複雜性與多元性。換言之，選擇職業不僅要考量你最擅長或最喜歡的類型，更應關注如何在多元任務與角色中找到契合點，使工作既符合個人特質，又能兼顧挑戰與成就感。這樣的理解，有助於你在面對職涯選擇時，更全面地評估各種可能性，並做出更符合自身需求與發展潛力的決策。"

  const finalResult = {
    "R": {
      "summary": "你是一位動手操作勝過於空想的人，對於想做的事情具有耐性，能按照步驟一步步進行直到結果出現，情緒較為穩定，喜歡有話直說，處理事情相當獨立，平時沉穩、謙虛坦白、堅定及重實踐，工作時相當聚精會神。",
      "interest": "<ul><li>1.你喜歡動手操作，看得到具有實際結果的實做內容</li><li>2.你喜歡運用具體的能力解決實際遇到的問題</li><li>3.你喜歡看到明確結果</li></ul>",
      "ability": "<ul><li>1.你擅長依照步驟或規則一步步完成工作成果</li><li>2.你能夠製作或設計有實際用途的物品或程式</li><li>3.你擅長操作工具及機械</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：工程學群</li><li>2.你比較適合的職業別：機械、建築、水電、主廚、運動選手、電子、電機、司機、操作員等相關行業</li></ul>",
      "note": note
    },
    "I": {
      "summary": "你是一位好奇心強、喜歡思考事物之間原理的人，對工作時間講求有彈性，喜歡無拘束、自主性高的工作環境，並喜歡追根究底，能夠對於問題提出有創見的想法跟策略，但對於具體執行的細節較沒有興趣。",
      "interest": "<ul><li>1.你喜歡閱讀及思考，發展自己對於某些領域的見解與策略</li><li>2.你喜歡與專業領域的人討論，在意專業勝於他人的觀點</li><li>3.你喜歡就某個專業或興趣領域和同專長的人一起討論與研發</li></ul>",
      "ability": "<ul><li>1.你擅長觀察分析事物運行的原理，並依照自己的步調思考、推理</li><li>2.你擅長探究問題成因或想出解決問題的方法</li><li>3.你時常反思問題與挑戰既有的概念</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：生命科學、數理化學群</li><li>2.你比較適合的職業別：醫療、學術、研發、藥物研究、生物、物理、數學研究、金融分析等相關行業</li></ul>",
      "note": note
    },
    "A": {
      "summary": "你是一位追求生活創意與藝術，喜歡無拘無束的人，對於能夠創造從未有過的作品感到很有成就，追求在既有的領域中發展自我揮灑的空間，討厭一成不變的生活模式，講求原創性的自我表達。",
      "interest": "<ul><li>1.你喜歡自己一個人思考、發揮創意</li><li>2.你重視美感經驗與生活價值</li><li>3.你喜歡藝術創作、跳脫框架的束縛</li></ul>",
      "ability": "<ul><li>1.你擅長創新與表達，展現自我風格與特質</li><li>2.你能在工作上發揮美與創意，鑑賞充滿美的人事物</li><li>3.你擅長運用各種媒材，如文字、音樂或影像表達自己內在的感受</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：藝術、大眾傳播、建築設計學群</li><li>2.你比較適合的職業別：影像創作、語言表達、文字寫作、空間設計、戲劇表演、音樂、繪畫、舞蹈等相關行業</li></ul>",
      "note": note
    },
    "S": {
      "summary": "你是一位重視合作關係、對人關懷的人，希望所處的團體是和諧的，因此會付出時間跟精力去傾聽、了解別人，也願意主動解決他人的問題，在生活中相當重視人際關係帶來的感覺，喜歡與別人有親近感、分享感覺、歸屬於群體之中。",
      "interest": "<ul><li>1.你喜歡社會性的職業或情境</li><li>2.你喜歡跟大家一起做事的感覺，對於跟人交流的多變性感覺舒適</li><li>3.你喜歡解決他人的問題</li></ul>",
      "ability": "<ul><li>1.你擅長傾聽、與人溝通</li><li>2.你擅長洞悉他人需求與問題</li><li>3.你擅長給予他人建議與指引</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：文史哲、社會心理、教育學群</li><li>2.你比較適合的職業別：諮商心理師、社工師、幼兒教育、輔導、醫護、宗教、服務等相關行業</li></ul>",
      "note": note
    },
    "E": {
      "summary": "你是一位有冒險及挑戰精神的人，做事有計劃與行動力，希望能夠藉由個人去影響整個群體，喜歡帶領團體有目標的向前邁進，執行有影響力的計畫，精力充沛、熱情積極、有自信、主導性格強。",
      "interest": "<ul><li>1.你重視政治與經濟、喜歡創造規則</li><li>2.你喜歡帶領人群，取得能影響團體的權力或影響力</li><li>3.你喜歡運用組織規則來發揮改變的力量</li></ul>",
      "ability": "<ul><li>1.你擅長用組織化的能力來解決問題</li><li>2.你在團體中容易成為帶領者或焦點人物</li><li>3.你能夠倡議改變，領導群眾促成改變或完成計畫</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：法政學群</li><li>2.你比較適合的職業別：律師、檢察官、民意代表、法官、企劃、銷售、管理、公關等相關行業</li></ul>",
      "note": note
    },
    "C": {
      "summary": "你是一位做事謹慎、循規蹈矩、實事講求精確的人，不喜歡出錯，喜歡在有清楚規範下的環境工作，能服從指令，對於安全感與確定性有強烈需求。他們做事有始有終，注重細節，而且遵循慣例。",
      "interest": "<ul><li>1.你喜歡依循既定流程，按照法規做事，計算可能的得與失</li><li>2.你喜歡在工作上有效率、仔細與精確</li><li>3.你喜歡有規範及有條理的工作內容</li></ul>",
      "ability": "<ul><li>1.你擅長用具體、有系統及例行的程序去完成應負責的工作內容</li><li>2.你擅長執行重複性的工作而不覺得厭煩</li><li>3.你擅長文書作業與數字計算的能力</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：財經學群</li><li>2.你比較適合的職業別：公務首長、會計師、出納人員、政府稅務人員、金融稽核員、法律、金融、會計等相關行業</li></ul>",
      "note": note
    },
    "RI":{
      "summary": "你是一位行動力強、實事求是並具有耐性的人，同時你也能冷靜思考，尋找解決問題的方法，並在善於獨立思考的同時，能實務的對於問題的流程、架構、數據等進行深入分析，以求能獲得更具體的結果以獲取經驗。",
      "interest": "<ul><li>1.你喜歡獨立完成且依循既定規則的活動，並且在明確的步驟下製作出有實際用途的作品</li><li>2.你喜歡在實際操作的過程中，思考與分析實際的體驗經驗，解決問題、精益求精</li><li>3.你喜歡研發新的事物，從既有的規則中開發出不同的工作流程或創造新的發明</li></ul>",
      "ability": "<ul><li>1.你擅長使用機械、儀器或手藝來展現能力</li><li>2.你擅長從實務操作中獲取經驗，並以邏輯分析的方法深思熟慮、有系統且耐心地解決問題</li><li>3.你善於製造新的物品或開發不同的商品</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：數理化、工程、醫藥衛生、資訊學群</li><li>2.你比較適合的職業別：醫學研究、醫學檢驗、交通工程、軟體工程、科技工程師、遊戲設計、工業安全相關行業</li></ul>",
      "note": note,
    },
    "RA":{
      "summary": "你是一位情緒穩定、專注並坦誠直率的人，善於獨立作業以及充滿創意與想像，有時行為舉止較有個性，可能較不喜歡受到限制，善於在實務中創造美感，以追求在實用中擁有且展現出藝術與創意。",
      "interest": "<ul><li>1.你喜歡將藝術與創意融入動手實作的活動中</li><li>2.你喜歡發揮豐沛與天馬行空的想法，並努力將這些點子落實</li><li>3.你喜歡動手製作出具備實用性與應用性的東西</li></ul>",
      "ability": "<ul><li>1.你擅長結合電腦、機械、多媒體等工具來展現創意與藝術才華</li><li>2.你擅長動手創作自己喜歡的事物</li><li>3.你擅長發揮創意，在框架當中加入自己獨特的風格</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：建築設計、工程、資訊學群</li><li>2.你比較適合的職業別：建築設計、科技創意、園藝設計、程式設計、網頁設計、土木工程、烘焙相關行業</li></ul>",
      "note": note,
    },
    "RS":{
      "summary": "你是一位順從、冷靜，看重解決眼前問題的人，重視物質的同時，善於合群並擁有責任感與理想性，同時注重與他人的互動，善於在互動中展現出親切感，生活上以實用為重，勝過對未來的想像。",
      "interest": "<ul><li>1.你喜歡從事機械或技術相關的工作</li><li>2.你喜歡從事跟人有關的活動</li><li>3.你對於技術與人群相結合的活動有興趣</li><li>4.你喜歡運用自己的能力來幫助他人學習或解決問題</li></ul>",
      "ability": "<ul><li>1.你擅長動手操作、技術性的工作</li><li>2.你擅長對人有敏感度並同理</li><li>3.你能實事求是的幫助人解決問題</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、工程、資訊學群</li><li>2.你比較適合的職業別：科技服務業、資訊教師、公共安全、機械維修、調酒師、警察、復健師、健身教練、芳療師等相關行業</li></ul>",
      "note": note,
    },
    "RE":{
      "summary": "你是一位實事求是、企圖心強，並善於以穩定的態度追求目標的人，喜歡挑戰並能以有系統、規劃性的方式來解決問題，也喜歡親力親為的參與在活動中的各項事務，善於以說服、引導帶領團體逐步按進度完成任務。",
      "interest": "<ul><li>1.你喜歡從事有明確規範、步驟的活動</li><li>2.你喜歡將活動任務加入不同的挑戰，展現企圖心</li><li>3.你喜歡透過與他人的意見溝通，藉由影響力來進行團隊管理，讓成果能更上一層樓</li></ul>",
      "ability": "<ul><li>1.你擅長以動手操作的方式完成工作</li><li>2.你擅長按部就班地規畫活動，並將自己的想法透過溝通表達的方式來影響他人，帶領他人一同朝目標邁進</li><li>3.你擅長經營、管理，並實際參與團體的事務</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：工程、技術管理學群</li><li>2.你比較適合的職業別：科技管理、交通駕駛、公共安全、工程師、工業安全、食品技師等相關行業</li></ul>",
      "note": note,
    },
    "RC":{
      "summary": "你是一位個性內向、可靠、講求實際，重視動手操作的人，做事謹慎、細心，追求穩定不喜變化，生活上以「實用」與「應用」為重，不喜歡接受臨時交辦、需要急促完成及多變化的事務。",
      "interest": "<ul><li>1.你喜歡使用制定的工具來處理生產、製造、技術的活動</li><li>2.你喜歡清楚說明流程與規則</li><li>3.你喜歡依循規則做事</li></ul>",
      "ability": "<ul><li>1.你擅長運用工具或機械操作</li><li>2.你擅長以動手操作的方式來完成工作</li><li>3.你能在處理工作的過程中井然有序、有條不紊</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：資訊、大眾傳播、工程、生產製造學群</li><li>2.你比較適合的職業別：土木工程、營建工程、化工工程、廚師、軍人、動物訓練師等相關行業</li></ul>",
      "note": note,
    },
    "IR":{
      "summary": "你是一位兼具思考與行動力，面對事物會先進行分析和學習，進而追根究底、實際動手有效率地完成工作或實驗，將想法付諸實踐的人，當努力解決問題或製造新物品時，有時會相當聚精會神，甚至完全忘記其他事情的存在。",
      "interest": "<ul><li>1.你喜歡藉由觀察他人做事方法，再以邏輯分析、深思熟慮、有系統地解決問題或製造新的物品</li><li>2.你喜歡思考、組織的活動，有自己獨特的見解與創意</li><li>3.你喜歡研究或開發新產品</li></ul>",
      "ability": "<ul><li>1.你擅長觀察別人做事的方法，並反思從當中所體驗的學習與成長</li><li>2.你擅長分析事情的來龍去脈並做合情的推理</li><li>3.你擅長有系統地解決問題或製造新的物品，並能心無旁鶩</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、資訊、工程、數理化、地球環境、科技研發學群</li><li>2.你比較適合的職業別：醫師、獸醫師、法醫、機械工程師、科學研究員、大學教授、自然保育員等相關行業</li></ul>",
      "note": note,
    },
    "IA":{
      "summary": "你是一位對周遭事物抱持好奇心，善於研究探討，但同時也擁有豐富的想像力，樂於嘗試新鮮事物的人，在觀察與分析後找出問題重點及提出解決方案，希望能替別人解決遇到的問題，有時可能因思慮過多而難下決定。",
      "interest": "<ul><li>1.你喜歡觀察、思考，探討理論或科學的問題</li><li>2.你對環境的敏感度高，喜歡將靈感用藝術/創新形式表達出來</li><li>3.你在思考與創作的過程中，喜歡分享表達但不喜歡被規範與限制</li>",
      "ability": "<ul><li>1.你擅長運用對環境的敏感度與觀察所得到的資訊來進行綜合性的思考與分析</li><li>2.你能找出問題重點及提出解決方案，發展出新的理論模式或策略</li><li>3.你擅長欣賞美的事物，並將藝術創意融入工作當中</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、生命科學、數理化、工程、地球環境學群</li><li>2.你比較適合的職業別：牙醫師、園藝造景師、營養師等相關行業</li></ul>",
      "note": note,
    },
    "IS":{
      "summary": "你是一位能敏銳觀察事物並思考背後運作原理的人，行為與思考以研究規劃為導向，願意提出問題解決方案及協助指導他人，同時重視他人想法和感受，人際關係良好，努力綜合各方意見，以此分析並歸納出獨特想法。",
      "interest": "<ul><li>1.你喜歡觀察、思考與生命關懷有關的事物，對於生物及人類行為的研究極有興趣</li><li>2.你喜歡融入人群，與人互動，傾聽他人所遇到的困難</li><li>3.你喜歡了解他人的想法，發揮思考與分析能力去幫助他人</li></ul>",
      "ability": "<ul><li>1.你擅長觀察紀錄、思考與分析</li><li>2.你重視他人的想法與感受，擅長將冷冰冰的理論加入人性化的觀點</li><li>3.你擅長關心他人需求，傾聽並分析問題的癥結進而設法解決</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、生命科學、社會心理、生物資源、數理化、地球環境學群</li><li>2.你比較適合的職業別：醫師、藥師、營養師、復健/檢驗人員、公衛人員、醫療人員、森林保育、數理教師等相關行業</li></ul>",
      "note": note,
    },
    "IE":{
      "summary": "你是一位善於觀察、分析數據與領導團隊的人，做事有計畫，在團體中能熱絡地與他人談話，同時對於問題的流程、架構、數據有自己的見解，並期待能在組織中發揮改變的力量，並有其影響力。",
      "interest": "<ul><li>1.你喜歡研究數據、金融等相關主題</li><li>2.你喜歡發展及經營等主題，想研究出有利潤的商品，並證明商品的價值</li><li>3.希望在團體中能將自己的想法與研究表達出來</li></ul>",
      "ability": "<ul><li>1.你擅長發揮想法、研發獨特的產品</li><li>2.你擅長運用溝通表達能力來讓他人認識與接受你的想法</li><li>3.你善於運用管理溝通能力來帶領團隊討論並完成企劃</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：工程、資訊、醫藥衛生、管理、金融學群</li><li>2.你比較適合的職業別：工程師、環境衛生、保險精算、統計分析、證券金融、科技行銷相關行業</li></ul>",
      "note": note,
    },
    "IC":{
      "summary": "你是一位善於推理與分析、思考周詳同時保守、嚴謹和謹慎，對工作認真負責的人，與人相處和順而不主動，在團隊中以協助他人執行流程為主要角色，對於提出問題重點與建議解決方案將會認真完成。",
      "interest": "<ul><li>1.你喜歡從事研究及問題解決的活動</li><li>2.你喜歡對數字進行預測和分析</li><li>3.你喜歡按部就班、穩紮穩打，獨自運作不受他人影響</li></ul>",
      "ability": "<ul><li>1.你擅長探究事物運行的原因及關聯，並能有耐心的逐項進行分析</li><li>2.你擅長觀察分析與推理，提出問題的重點與建議解決的方案</li><li>3.你擅長思考縝密周詳細心，犯錯率低</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、地球環境、生物資源、數理化、數學分析、財經學群</li><li>2.你比較適合的職業別：醫學檢驗、精算師、數理研究、統計分析、經濟研究等相關行業</li></ul>",
      "note": note,
    },
    "AR":{
      "summary": "你是一位擅長觀察世界萬物，欣賞並發掘物品的多種用途，重視藝術與實用性的人，擁有敏銳的感性，直覺性強，富想像力、有創意，能思考物品的更多用途，不受規範所限。在獨立完成作品，能充分享受其中的成就感。",
      "interest": "<ul><li>1.你喜歡從事藝術創作並動手完成作品</li><li>2.你喜歡欣賞具有創新性的作品，同時也希望其他人也同樣欣賞、喜歡你的作品</li><li>3.你喜歡使用電腦、機械、多媒體等工具來展現創意才華</li></ul>",
      "ability": "<ul><li>1.你擅長觀察與欣賞事物的美，發掘其實用性</li><li>2.你擅長發揮及表達自己內在的感受性於作品中，並鑑賞人事物的美</li><li>3.你擅長透過多元媒材，如電腦、機械、多媒體等工具，來展現自己的創意</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：藝術、大眾傳播、資訊、建築設計、遊憩運動、科技設計學群</li><li>2.你比較適合的職業別：攝影師、室內設計、劇場設計、多媒體、網頁設計、影像剪輯、服裝設計、美工設計、建築師等相關行業</li></ul>",
      "note": note,
    },
    "AI":{
      "summary": "你是一位直覺敏銳並具有自由發揮的藝術天份，並善於觀察與抽象思考的人，較不拘小節，不喜被拘束，創意無限對於有興趣的議題能延續探究及創作，想像力豐富，對於有興趣的議題也能欣賞及研究其脈絡，並提出獨特見解。",
      "interest": "<ul><li>1.你喜歡獨自進行抽象思考、設計創造、歷史研究等工作</li><li>2.你喜歡在不受拘束的環境中發揮藝術及研究天份</li><li>3.你喜歡拼湊出事物的歷史與脈絡，並提出其分析結果</li></ul>",
      "ability": "<ul><li>1.你能深刻感受事物的美好，並具有對於美的敏銳度</li><li>2.你擅長結合理性與感性，對於藝術與感受運用理論進行分析</li><li>3.你能夠提出有創意的意見，供其他人參考</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、建築設計、生物資源、大眾傳播、資訊、文史哲學群</li><li>2.你比較適合的職業別：作家、動漫畫家、文史哲研究、藝術鑑定、博物館/美術館員、服裝設計、語言學家等相關行業</li></ul>",
      "note": note,
    },
    "AS":{
      "summary": "你是一位善於表現跟創新，直覺也很敏銳的人，同時你為人親和、熱情，善於與他人建立良好關係，並樂於分享及幫助他人，較不拘小節，不喜被拘束，對於四處奔走接近人群、發現需求並能給予創新建議與回應問題。",
      "interest": "<ul><li>1.你喜歡對社會議題提出創新思維與回應</li><li>2.你關心社會事務與身邊人群的改變</li><li>3.你喜歡按照他人需求設計相關活動與課程</li></ul>",
      "ability": "<ul><li>1.你擅長用各種創作媒材來表達自己對社會的關心與對美的感受</li><li>2.你善於感受世界與社會脈動，關心弱勢並為其發聲</li><li>3.你擅長找出他人需求，並主動協助他們</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：建築設計、藝術、大眾傳播、社會心理、外語、文史哲學群</li><li>2.你比較適合的職業別：醫療照護、諮商師、語文教師、幼兒教師、運動教練、旅遊業、戲劇表演者、媒體工作者、演員、新聞主播、記者等相關行業</li></ul>",
      "note": note,
    },
    "AE":{
      "summary": "你是一位觀察力敏銳、實事求是的人，善於在團隊中影響及引導他人，並且認為創新與實用是同等重要的事，享受獨立作業，對於事物的掌握性強，善於提出系統性的創作以能解決問題的方案，進而得到他人的肯定和重視。",
      "interest": "<ul><li>1.你喜歡用文字，聲音，色彩等方式來創作以解決問題或變革創新</li><li>2.你喜歡提出創新方式以影響、指導他人解決問題</li><li>3.你喜歡關注媒體、廣告、設計等議題</li></ul>",
      "ability": "<ul><li>1.你擅長發揮創意、運用多元媒材設計其作品，為議題表達及發聲</li><li>2.你擅長整合、規劃方案，以求和達成目標或解決問題</li><li>3.你擅長運用組織力量，以期達成共同目標</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：文史哲、建築設計、大眾傳播學群</li><li>2.你比較適合的職業別：設計師、經紀人、媒體工作、廣告公關、出版業等相關行業</li></ul>",
      "note": note,
    },
    "AC":{
      "summary": "你是一位直覺敏銳且創新，是位個性謹慎認真的人，善於用文字、聲音、色彩等方式展現創造力和美的感受，在創作方面上較具細膩度與次序感，喜歡獨立作業，做事認真負責且有始有終。想法與做法較採取實用性、低風險的方式。",
      "interest": "<ul><li>1.你喜歡獨立作業，從事具創造性的領域內容</li><li>2.你喜歡運用多媒體技術細膩與有次序感的創作作品</li><li>3.你喜歡在工作上仔細且精確，以期完成他人所交辦任務</li></ul>",
      "ability": "<ul><li>1.你擅長敏銳感受與鑑別具有美感的人事物</li><li>2.你擅長細膩、簡潔，又有次序感的完成創作</li><li>3.你擅長運用技術有耐心地逐步完成工作</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：大眾傳播、藝術、建築設計學群</li><li>2.你比較適合的職業別：展場設計、藝術鑑定、設計師等相關行業</li></ul>",
      "note": note,
    },
    "SR":{
      "summary": "你是一位關心自己和他人的感受，講求實事求是的人，未來期待以助人的方式成為令人信服的角色，關注的焦點比較放在人們以及其需求上面，對於協助他人有其自己的理想性，生活以實用為重，希望透過技術以實際動手的方式來解決問題。",
      "interest": "<ul><li>1.你喜歡察覺他人的狀況，並用實際行動來協助他人</li><li>2.你喜歡用團體講授的方式，協助他人學習處理技術方面的問題</li><li>3.你習慣將精力放在解決眼前的事物</li></ul>",
      "ability": "<ul><li>1.你擅長傾聽他人的需求與困難</li><li>2.你擅長給予他人建議與幫助</li><li>3.你擅長使用技術從事照顧與服務類型的事務</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、生物資源、地球環境、遊憩運動學群</li><li>2.你比較適合的職業別：醫生、治療師、理工科教師、消防人員、救難人員、保母、空服員、導遊領隊等相關行業</li></ul>",
      "note": note,
    },
    "SI":{
      "summary": "你是一位善於傾聽與溝通，喜歡思考事物的原理來幫助他人的人，重視生命關懷，樂於與人分享知識，常考量他人的感受或建議而調整態度與做法，對與人群有關的問題與現象頗為熱衷。",
      "interest": "<ul><li>1.你喜歡指導他人、和別人分享</li><li>2.你喜歡接觸人群，喜歡跟別人討論和人群有關的問題與現象</li><li>3.你喜歡和團隊一起工作，也能獨立作業</li></ul>",
      "ability": "<ul><li>1.你擅長傾聽與幫助別人</li><li>2.你擅長思考事物的原理，並運用理論關懷公眾事務</li><li>3.你擅長分析問題，並想出解決問題的方法</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、教育、社會心理、遊憩運動、數理化、地球環境學群</li><li>2.你比較適合的職業別：理科教師、資訊教師、社會心理研究、臨床心理師、動物保育、治療師、視光師等相關行業</li></ul>",
      "note": note,
    },
    "SA":{
      "summary": "你是一位善於傾聽、對人和善，思緒細膩及敏銳，關心環境和社會現象，並善於表達和創新的人，注重人際關係的和諧，對團體活動興趣高，善於表達和創新協助他人解決問題，喜歡憑直覺做事思考。",
      "interest": "<ul><li>1.你注重人際關係的和諧，對團體活動有很高的興趣</li><li>2.你在乎個人和團體的契合程度，重視提升自我能力與協助弱勢團體</li><li>3.你喜歡直覺性的創意表達</li></ul>",
      "ability": "<ul><li>1.你擅長傾聽並為人分憂解勞</li><li>2.你擅長表達內在對於社會與個人的關懷</li><li>3.你擅長運用藝術媒材表達內在感受與達成目標</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：教育、社會心理、大眾傳播、遊憩運動、文史哲學群</li><li>2.你比較適合的職業別：諮商師、觀護人、宗教師、醫療照護、幼兒教師、運動教練、語文教師、旅遊業等相關行業</li></ul>",
      "note": note,
    },
    "SE":{
      "summary": "你是一位善於關心自己跟別人的感受，重視個人與群體間的契合程度，人際關係良好的人，看見不合理事物希望能運用團體力量有所改善，藉由影響力吸引他人共同為目標而努力，並期待付出能受到肯定。",
      "interest": "<ul><li>1.你喜歡和他人一起工作，能改善不合理的事物</li><li>2.你喜歡為人服務的工作</li><li>3.你關心公眾利益</li></ul>",
      "ability": "<ul><li>1.你擅長與他人互動，影響他人共同往目標邁進</li><li>2.你擅長洞悉他人需求，並運用組織的力量解決問題</li><li>3.你會激勵夥伴一同努力</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：教育、社會心理、遊憩運動、管理學群</li><li>2.你比較適合的職業別：社工、經紀人、照護醫療、社會心理研究、學校行政、民意代表、運動教練、人力資源、餐飲經營與服務等相關行業</li></ul>",
      "note": note,
    },
    "SC":{
      "summary": "你是一位善於替他人設想，和朋友關係良好，而且做事認真負責，有始有終的人，較少主動與人攀談，講求條理分明，行事仔細的協助人們解決執行上的事務，一個清楚、條理分明且可依循的流程也讓你覺得做事安心。",
      "interest": "<ul><li>1.你喜歡與他人互動</li><li>2.你喜歡協助解決他人執行上的問題</li><li>3.你喜歡有組織、有結構可依循的作業流程以協助他人執行作業</li></ul>",
      "ability": "<ul><li>1.你擅長洞悉他人需求</li><li>2.你擅長依照既定流程解決他人的問題</li><li>3.你擅長安排清楚的工作流程</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、財經、社會心理、教育、外語、文史哲、管理、遊憩運動學群</li><li>2.你比較適合的職業別：護理師、教練、秘書、旅遊業、長照員、金融分析等相關行業</li></ul>",
      "note": note,
    },
    "ER":{
      "summary": "你是一位關心績效與表現，並且講求實事求是的人，善於溝通與說服，著重當下事務的解決與處理，做事情明確果斷且積極，並且重視團體間的契合程度，自主性高能安排好手邊的工作與執行。",
      "interest": "<ul><li>1.你喜歡做事有計劃並立即行動</li><li>2.你喜歡全心投入自己的工作或參與的計畫</li><li>3.你喜歡著重對眼前事務的解決方式</li></ul>",
      "ability": "<ul><li>1.你擅於溝通與說服他人以達到目地</li><li>2.你擅長數字及經營管理</li><li>3.你擅長實際動手解決問題</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：資訊、管理、工程、遊憩運動學群</li><li>2.你比較適合的職業別：品管人員、消防、警察、科技管理、資訊安全、海關、船務、農業經營等相關行業</li></ul>",
      "note": note,
    },
    "EI":{
      "summary": "你是一位能與他人維持熱絡關係，喜歡與團隊共同討論、研發的人，做事有計畫但同時不喜歡囿於傳統與固定的事務，能提出新的想法和策略。對自己的想法很有自信，希望能得到他人的肯定。",
      "interest": "<ul><li>1.你喜歡政治、經濟、行銷等議題</li><li>2.你喜歡思考經營及組織運作的策略與模式</li><li>3.你喜歡與團隊或有共同專長的人研發討論</li></ul>",
      "ability": "<ul><li>1.你擅長有計畫的做事</li><li>2.你擅長市場經營及研究發展</li><li>3.你擅長研發新的想法與策略</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、財經、法政、科學管理學群</li><li>2.你比較適合的職業別：統計分析、商標專利、政府調查、法務人員、法務鑑定人員、科技行銷等相關行業</li></ul>",
      "note": note,
    },
    "EA":{
      "summary": "你是一位在團體中希望成為有影響力並具有創意及想像力的人，自主強；慣於表達、說服、決策，重視自己的表現，思考模式彈性、變動性強，對於自己有興趣的事務會有計畫性去達成目標。",
      "interest": "<ul><li>1.你喜歡成為團體中的焦點人物</li><li>2.你喜歡在團體中表達自己的意見與表現自我</li><li>3.你喜歡自由發揮創意的工作環境</li></ul>",
      "ability": "<ul><li>1.你擅長帶領團隊達成工作目標</li><li>2.你擅長表達自我並說服他人</li><li>3.你擅長運用藝術媒材或媒體展現自我風格</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：管理、廣告公關、法政、大眾傳播學群</li><li>2.你比較適合的職業別：法官、經紀人、廣告創意總監、活動企劃、管理顧問、民意代表、媒體主播等相關行業</li></ul>",
      "note": note,
    },
    "ES":{
      "summary": "你是一位善於分工合作，引導團體邁向目標，並樂於人際互動、服務人群的人，以任務為導向，希望與團隊合作達到最大效益，重視他人需求，希望運用表達與說明的方式影響他人而達到目標雙贏。",
      "interest": "<ul><li>1.你喜歡以工作為導向，關心績效與表現</li><li>2.你喜歡重視個人與群體間的目標的契合程度</li><li>3. 你喜歡與人合作</li></ul>",
      "ability": "<ul><li>1.你擅長了解別人的長處，並規劃分工達到最大效益</li><li>2.你擅長說服他人，共同往一致的目標邁進</li><li>3.你擅長與人溝通並與他人維持良好關係</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：教育、財經、法政、大眾傳播、遊憩運動學群</li><li>2.你比較適合的職業別：直播拍賣主、律師、政治家、網路銷售業、市場調查、休閒餐飲、人力資源管理主管等相關行業</li></ul>",
      "note": note,
    },
    "EC":{
      "summary": "你是一位希望能用數字、統計、分析的方式，在數據中獲得有意義資訊的人，同時你重視秩序感，喜歡具體、可掌握及應用的工作，使用預測、規劃而成為團體中的領導或決策者。",
      "interest": "<ul><li>1.你喜歡統計分析並依數據進行決策</li><li>2.你喜歡創造與完善規則</li><li>3.你喜歡行事按照計畫與步驟</li></ul>",
      "ability": "<ul><li>1.你擅長運用數據說服他人</li><li>2.你擅長找出工作上的各種式流程問題</li><li>3.你擅長使用數字運算的方式獲得預測結果</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：工程、財經、管理、遊憩運動學群</li><li>2.你比較適合的職業別：企業執行長、金融稽核、統計分析、保險業務、資訊管理、稅務等相關行業</li></ul>",
      "note": note,
    },
    "CR":{
      "summary": "你是一位性格內斂、講求實際、可靠、細心的人，具有腳踏實地、堅持到底的職人精神，同時你擇善固執、按部就班，實事求是注重程序，喜歡獨立完成工作，不善於人際交往，容易害羞。",
      "interest": "<ul><li>1.你喜歡可依序完成、按部就班的工作內容</li><li>2.你喜歡具體、可操控的工作項目</li><li>3.你喜歡獨立完成工作</li></ul>",
      "ability": "<ul><li>1.你在工作上能注重程序、有階段性、按部就班地完成</li><li>2.你擅長執行重複性的工作</li><li>3.你擅長實際動手解決問題</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：醫藥衛生、財經、法政、資訊、管理學群</li><li>2.你比較適合的職業別：消防員、資訊管理人員、工廠作業人員、物流管理人員、統計員等相關行業</li></ul>",
      "note": note,
    },
    "CI":{
      "summary": "你是一位個性沉靜、謹慎，思考細緻，做事講求精確，同時能思考鑽研某項事物深刻內涵的人，平時與人相處和順但不主動，按部就班能為你帶來某種安全感，希望能藉由探究方法、步驟的細節以完成交辦事項。",
      "interest": "<ul><li>1.你喜歡參與執行步驟、時間進度都已有詳盡規劃的方案</li><li>2.你喜歡獨立完成工作</li><li>3.你喜歡遵循慣例</li><li>4.你喜歡分析數據並思考數據所代表的意義</li></ul>",
      "ability": "<ul><li>1.你擅長按部就班完成團體交辦及分配的工作</li><li>2.你擅長分析數據及稽核</li><li>3.你擅長深入細緻的思考與研究</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：數理化、財經、管理學群</li><li>2.你比較適合的職業別：金融分析、統計人員、管理顧問、保險精算、經濟研究等相關行業</li></ul>",
      "note": note,
    },
    "CA":{
      "summary": "你是一位認真負責，個性謹慎，同時具有創意與彈性的人，認為按部就班而有效率是件重要的事，直覺力強，善於將混亂的事物理出細節來，有彈性但不喜歡冒險及戲劇化的改變。",
      "interest": "<ul><li>1.你喜歡有次序的完成工作</li><li>2.你喜歡在工作中做出不一樣的小變化</li><li>3.你喜歡感受環境與享受生活</li></ul>",
      "ability": "<ul><li>1.你能將混亂的工作理出頭緒來</li><li>2.你擅長找出更有效率處理的方法</li><li>3.你擅長提供各種幕後的協助與支援</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：財經、管理學群</li><li>2.你比較適合的職業別：法務調查、證券營業、保險精算、倉儲物流等相關行業</li></ul>",
      "note": note,
    },
    "CS":{
      "summary": "你是一位個性細心、做事有條理，認真負責、有始有終，按照流程且願意服務他人，關心別人感受的人，為人自律親和，在團隊中常常是執行與確認細節，為彼此流程溝通、串連的角色。",
      "interest": "<ul><li>1.你喜歡在有組織、有保障的機構中工作</li><li>2.你喜歡有清楚工作順序的事務</li><li>3.你喜歡處理細節，願意服務他人，關心別人的感受</li></ul>",
      "ability": "<ul><li>1.你擅長按既有程序有條理的工作</li><li>2.你擅長從事帳務與資料管理等工作</li><li>3.你很容易獲得他人信任</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：管理、財經學群</li><li>2.你比較適合的職業別：會計師、金融稽核、出納、國貿、稅務、安檢等相關行業</li></ul>",
      "note": note,
    },
    "CE":{
      "summary": "你是一位有耐心、謹慎、腳踏實地、認真且有始有終地完成自己任務的人，以工作為導向，容易堅持已見，對於自己份內的事會努力完成，與人合作上主導性強，常以專業上的既有框架來表達自己的見解。",
      "interest": "<ul><li>1.你喜歡具體、可掌握、有清楚程序的工作</li><li>2.你喜歡企業經營、計畫、財務及銷售相關的工作內容</li><li>3.你喜歡經濟與金融</li></ul>",
      "ability": "<ul><li>1.你擅長能很有耐心的處理自己分內的事情</li><li>2.你能運用工具、流程、分析的方式，找出處理事情的方法</li><li>3.你擅長謹慎、小心的處理工作事物</li><li>4.你擅長運用專業背景引導他人執行與合作</li></ul>",
      "career": "<ul><li>1.你比較適配的學群是：財經、管理學群</li><li>2.你比較適合的職業別：企管秘書、資料編輯、會計人員、稅務人員等相關行業</li></ul>",
      "note": note,
    },
    "ALL":{
      "summary": "你具有多元興趣與彈性適應力。在面對不同任務或環境時，能展現多面向的潛能，也能快速切換角色與調整策略。然而，你也可能因為選擇太多而感到猶豫或不易確立明確方向。<br>在生涯探索上，這樣的特質意味著不必急於將自己「定型」，而是保有彈性使得個人特色明顯，透過嘗試不同領域、累積實際經驗，逐步篩選出最能兼顧個人價值感與滿足感的路徑。",
      "interest": "<ul><li>1.你喜歡思考、創造、實作，對於人或事務都具有豐沛的好奇心</li><li>2.你喜歡結合多種任務型態或能跨領域發揮的活動</li><li>3.你喜歡「多樣化」與「綜合性」的工作類型，而不是特定單一能力取向</li></ul>",
      "ability": "<ul><li>1.你擅長理性分析或邏輯推理，也在創造力、人際互動與細節規劃上表現良好</li><li>2.你擅長結合不同觀點、在團隊中進行溝通或跨界協作，在組織中找到平衡點並提出整合方案</li><li>3.你具備多元廣泛的能力，適合未來嶄新的職業類型</li></ul>",
      "career": "你適合結合分析、溝通、創意與規劃並提供成長彈性的職業。如：跨領域整合、創業經營、教育培訓、跨領域研究、專案管理、顧問服務以及新創職業場域。你勇於冒險，對於各種職業領域都深具好奇心、積極嘗試，只要培養相應職場能力，在多個領域中都有發揮潛能的機會，建議可找尋生涯專業諮詢師、心理師、輔導老師，依你的牌卡過程及結果進行討論，以更清晰地了解自己的職業興趣，進一步深入思考個人的價值觀、技能、優勢，擬定職業發展策略目標，創造生命無限可能。",
      "note": note,
    },
    "NONE":{
      "summary": "你在生涯抉擇中，還處在一個探索階段，對於各項職業領域還沒有展現明確充分的熱情，因此在做生涯抉擇時較為保守與謹慎，這需要你透過更多探索、對於憧憬或嚮往的職業多方打聽，聽聽職場前輩或學長姐們的經驗，才能在心中描繪一個具有熱情前往的方向。",
      "interest": "<ul><li>1.你對於各項領域都有興趣接觸跟探索，還未展現出特別明顯的興趣傾向</li><li>2.你對多樣化的活動保持著開放態度，不會對特定領域強烈排斥</li></ul>",
      "ability": "<ul><li>1.你目前尚未展現出特別突出的能力領域，代表你的強項仍在形成與探索之中。</li><li>2.你能透過各種探索、嘗試各類職業的過程，慢慢累積經驗，進而建立屬於自己的能力輪廓。</li></ul>",
      "career": "隨著職業世界瞬息萬變，使得職業類別的重組、疊加及跨領域的結合，皆與您多元領域的發展興趣息息相關，建議可找尋生涯專業諮詢師、心理師、輔導老師，依你的牌卡過程及結果進行討論，以更清晰地了解自己的職業興趣，進一步深入思考個人的價值觀、技能、優勢，擬定職業發展策略目標，創造生命無限可能",
      "note": note,
    },
  }

  return finalResult[type.toUpperCase()] || finalResult["NONE"];
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
  getCardImagePath,
  getCardCoverImage,
  getGoalCardData,
  getGuidanceContent,
  getFinalResult
}
