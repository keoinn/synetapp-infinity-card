import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'

const messages = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  'en': en
}

// 從 localStorage 獲取保存的語言設定
const savedLocale = localStorage.getItem('app-locale') || 'zh-TW'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-TW',
  messages
})

export default i18n
