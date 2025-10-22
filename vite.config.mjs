// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
const ENV_VAR = loadEnv('', process.cwd()).VITE_DEPLOY_URL
const DEPLOY_URL = (ENV_VAR === undefined)? '' : ENV_VAR 

// https://vitejs.dev/config/
export default defineConfig({
  base: DEPLOY_URL,
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    Fonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    // 自定義插件：複製所有語言的卡片圖片
    {
      name: 'copy-all-language-cards',
      writeBundle() {
        const sourceDir = 'src/assets/images/cards'
        const targetDir = 'dist/assets/images/cards'
        
        // 確保目標目錄存在
        mkdirSync(targetDir, { recursive: true })
        
        // 複製所有語言資料夾
        const languageFolders = ['zh_cn', 'en', 'zh_tw']
        
        languageFolders.forEach(lang => {
          const sourcePath = join(sourceDir, lang)
          const targetPath = join(targetDir, lang)
          
          try {
            // 檢查來源資料夾是否存在
            if (statSync(sourcePath).isDirectory()) {
              // 建立目標資料夾
              mkdirSync(targetPath, { recursive: true })
              
              // 複製所有檔案
              const files = readdirSync(sourcePath)
              files.forEach(file => {
                const sourceFile = join(sourcePath, file)
                const targetFile = join(targetPath, file)
                copyFileSync(sourceFile, targetFile)
              })
              
              console.log(`✅ 已複製 ${lang} 語言卡片圖片 (${files.length} 個檔案)`)
            }
          } catch (error) {
            console.log(`⚠️  跳過 ${lang} 資料夾：${error.message}`)
          }
        })
      }
    }
  ],
  define: { 'process.env': {} },
  build: {
    rollupOptions: {
      // 強制包含所有語言的卡片圖片
      external: [],
      input: {
        main: './index.html'
      },
      output: {
        // 保持 assets 資料夾結構
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name
          
          // 如果是圖片檔案，保持原始路徑結構
          if (fileName && /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(fileName)) {
            // 根據檔案名判斷應該放在哪個資料夾
            if (/^(care|le|lj|ce|cj|goal)\d+\.webp$/i.test(fileName)) {
              // 卡片圖片 - 需要根據來源路徑判斷語言資料夾
              // 檢查來源路徑來確定語言資料夾
              const source = assetInfo.source
              if (typeof source === 'string') {
                // 從來源路徑中提取語言資料夾
                const pathMatch = source.match(/src\/assets\/images\/cards\/([^\/]+)\/([^\/]+)$/)
                if (pathMatch) {
                  const [, languageFolder, filename] = pathMatch
                  return `assets/images/cards/${languageFolder}/${filename}`
                }
              }
              // 如果無法確定語言資料夾，預設放在 zh_cn
              return 'assets/images/cards/zh_cn/[name].[ext]'
            }
            if (fileName.includes('case_') || fileName.includes('intro-') || fileName.includes('general_') || fileName.includes('goal_')) {
              // 其他圖片
              return 'assets/images/[name].[ext]'
            }
            return 'assets/[name].[ext]'
          }
          
          // 其他檔案保持預設結構
          return 'assets/[name].[ext]'
        },
        // 保持 chunks 的結構
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // 確保靜態資源保持原始結構
    assetsInlineLimit: 0, // 不內聯任何資源
    // 複製所有語言的卡片圖片到構建目錄
    copyPublicDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
