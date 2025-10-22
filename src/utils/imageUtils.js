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
  
  return `/src/assets/images/cards/${folder}/${fileName}`
}

/**
 * 獲取所有可用的卡片圖片路徑
 * @param {string} imageName - 圖片檔案名稱（不包含路徑）
 * @returns {Object} 包含所有語言版本的圖片路徑
 */
export function getAllCardImagePaths(imageName) {
  // 確保檔案名稱包含 .webp 副檔名
  const fileName = imageName.endsWith('.webp') ? imageName : `${imageName}.webp`
  
  return {
    'zh-TW': `/src/assets/images/cards/zh_cn/${fileName}`,
    'zh-CN': `/src/assets/images/cards/zh_cn/${fileName}`,
    'en': `/src/assets/images/cards/en/${fileName}`
  }
}
