import { useAppStore } from '@/stores/app'

/**
 * 根據當前語言獲取卡片圖片路徑
 * @param {string} imageName - 圖片檔案名稱（不包含路徑）
 * @returns {string} 完整的圖片路徑
 */
export function getCardImagePath(imageName) {
  const appStore = useAppStore()
  const currentLocale = appStore.locale
  
  // 確保檔案名稱包含 .webp 副檔名
  const fileName = imageName.endsWith('.webp') ? imageName : `${imageName}.webp`
  
  // 根據語言選擇對應的資料夾
  let folder = 'zh_cn' // 預設為繁體中文（使用 zh_cn 資料夾）
  if (currentLocale === 'zh-CN') {
    folder = 'zh_cn' // 簡體中文使用 zh_cn 資料夾
  } else if (currentLocale === 'en') {
    folder = 'en' // 英文使用 en 資料夾
  }
  
  // 獲取部署 URL（如果有的話）
  const deployUrl = import.meta.env.VITE_DEPLOY_URL || ''
  
  // 在開發環境使用 /src/assets/，在生產環境使用 /assets/
  const isDev = import.meta.env.DEV
  const assetsPath = isDev ? '/src/assets' : '/assets'
  
  return `${deployUrl}${assetsPath}/images/cards/${folder}/${fileName}`
}

/**
 * 獲取所有可用的卡片圖片路徑
 * @param {string} imageName - 圖片檔案名稱（不包含路徑）
 * @returns {Object} 包含所有語言版本的圖片路徑
 */
export function getAllCardImagePaths(imageName) {
  // 確保檔案名稱包含 .webp 副檔名
  const fileName = imageName.endsWith('.webp') ? imageName : `${imageName}.webp`
  
  // 獲取部署 URL（如果有的話）
  const deployUrl = import.meta.env.VITE_DEPLOY_URL || ''
  
  // 在開發環境使用 /src/assets/，在生產環境使用 /assets/
  const isDev = import.meta.env.DEV
  const assetsPath = isDev ? '/src/assets' : '/assets'
  
  return {
    'zh-TW': `${deployUrl}${assetsPath}/images/cards/zh_cn/${fileName}`,
    'zh-CN': `${deployUrl}${assetsPath}/images/cards/zh_cn/${fileName}`,
    'en': `${deployUrl}${assetsPath}/images/cards/en/${fileName}`
  }
}
