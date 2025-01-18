// 使用 Vite 的 glob 匯入功能批次匯入圖片
const imageModules = import.meta.glob('@/assets/images/*.webp', { eager: true })

// 依照前綴分類圖片並排序
const categorizeImages = () => {
  const categories = {
    care: [],
    le: [],
    lj: [],
    ce: [],
    cj: [],
    goal: []
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

export {
  careImages,
  leImages,
  ljImages,
  ceImages,
  cjImages,
  goalImages,
  combineAndShuffle,
  getCardImageName
}
