import { useAppStore } from '@/stores/app'

/**
 * 根據當前語言獲取卡片圖片路徑
 * @param {string} imageName - 圖片檔案名稱（不包含路徑）
 * @returns {string} 完整的圖片路徑
 */
export function getCardImagePath(imageName) {
  const appStore = useAppStore()
  const currentLocale = appStore.locale
  
  // 根據語言選擇對應的資料夾
  let folder = 'zh_tw' // 預設為繁體中文
  if (currentLocale === 'zh-CN') {
    folder = 'zh_cn' // 簡體中文也使用 zh_cn 資料夾
  } else if (currentLocale === 'en') {
    folder = 'en'
  }
  
  return `/src/assets/images/cards/${folder}/${imageName}`
}

/**
 * 獲取所有可用的卡片圖片路徑
 * @param {string} imageName - 圖片檔案名稱（不包含路徑）
 * @returns {Object} 包含所有語言版本的圖片路徑
 */
export function getAllCardImagePaths(imageName) {
  return {
    'zh-TW': `/src/assets/images/cards/zh_cn/${imageName}`,
    'zh-CN': `/src/assets/images/cards/zh_cn/${imageName}`,
    'en': `/src/assets/images/cards/en/${imageName}`
  }
}
