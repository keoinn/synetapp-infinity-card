/**
 * PDF 報告生成工具
 * 
 * 使用 jsPDF API 直接繪製 PDF 報告
 * 支援職業雷達圖、綜合解析、職業配對表格等內容
 * 
 * @module pdfGenerator
 */

import jsPDF from 'jspdf'
import { getFinalResult } from './psy_cards'

/**
 * 載入中文字體（動態載入，只在需要時載入）
 * 載入 NotoSansTC-normal.js 和 NotoSansTC-bold.js
 * @returns {Promise<void>}
 */
let fontLoaded = false
let fontLoadingPromise = null

async function loadChineseFont() {
  // 如果已經載入過，直接返回
  if (fontLoaded) {
    return Promise.resolve()
  }

  // 如果正在載入中，返回載入中的 Promise
  if (fontLoadingPromise) {
    return fontLoadingPromise
  }

  // 開始載入字體
  fontLoadingPromise = new Promise((resolve, reject) => {
    try {
      // 同時載入 normal 和 bold 兩個字體檔案
      Promise.all([
        fetch('/NotoSansTC-normal.js').then(response => response.text()),
        fetch('/NotoSansTC-bold.js').then(response => response.text())
      ])
        .then(([normalContent, boldContent]) => {
          try {
            // 提取 normal 字體數據
            const normalMatch = normalContent.match(/var\s+font\s*=\s*['"]([^'"]+)['"]/)
            if (!normalMatch || !normalMatch[1]) {
              throw new Error('無法從 NotoSansTC-normal.js 中提取字體數據')
            }
            
            // 提取 bold 字體數據
            const boldMatch = boldContent.match(/var\s+font\s*=\s*['"]([^'"]+)['"]/)
            if (!boldMatch || !boldMatch[1]) {
              throw new Error('無法從 NotoSansTC-bold.js 中提取字體數據')
            }
            
            // 將字體數據存儲到全局變數，以便後續使用
            window.__notoSansTCNormalFontData = normalMatch[1]
            window.__notoSansTCBoldFontData = boldMatch[1]
            
            // 字體數據已提取，標記為已載入
            fontLoaded = true
            resolve()
          } catch (error) {
            console.error('解析字體檔案失敗:', error)
            fontLoadingPromise = null
            reject(new Error('無法解析字體檔案: ' + error.message))
          }
        })
        .catch((error) => {
          console.error('載入中文字體失敗:', error)
          fontLoadingPromise = null
          reject(new Error('無法載入中文字體檔案: ' + error.message))
        })
    } catch (error) {
      fontLoadingPromise = null
      reject(error)
    }
  })

  return fontLoadingPromise
}

/**
 * 手動註冊字體（如果字體檔案已載入但未自動註冊）
 * 註冊 NotoSansTC normal 和 bold 字體
 * @param {jsPDF} pdf - PDF 實例
 */
function manuallyRegisterFont(pdf) {
  try {
    // 檢查字體數據是否可用
    if (typeof window !== 'undefined') {
      // 優先使用從 fetch 載入的字體數據
      if (window.__notoSansTCNormalFontData && window.__notoSansTCBoldFontData) {
        const normalFontData = window.__notoSansTCNormalFontData
        const boldFontData = window.__notoSansTCBoldFontData
        
        // 註冊 normal 字體
        pdf.addFileToVFS('NotoSansTC-normal.ttf', normalFontData)
        pdf.addFont('NotoSansTC-normal.ttf', 'NotoSansTC', 'normal')
        
        // 註冊 bold 字體
        pdf.addFileToVFS('NotoSansTC-bold.ttf', boldFontData)
        pdf.addFont('NotoSansTC-bold.ttf', 'NotoSansTC', 'bold')
        
        console.log('從 window.__notoSansTCFontData 註冊字體成功（normal 和 bold）')
        return true
      }
      
      // 備選方法：嘗試執行 callAddFont 函數（如果可用）
      if (typeof window.callAddFont === 'function') {
        // callAddFont 需要 this 上下文指向 pdf 實例
        window.callAddFont.call(pdf)
        console.log('通過 callAddFont 註冊字體成功')
        return true
      }
      
      // 備選方法：手動觸發 jsPDF 事件系統
      if (jsPDF.API && jsPDF.API.events && Array.isArray(jsPDF.API.events)) {
        // 查找 addFonts 事件並執行
        for (const event of jsPDF.API.events) {
          if (Array.isArray(event) && event[0] === 'addFonts' && typeof event[1] === 'function') {
            // 執行事件處理函數，將 this 綁定到 pdf 實例
            event[1].call(pdf)
            console.log('通過事件系統註冊字體成功')
            return true
          }
        }
      }
    }
  } catch (error) {
    console.error('手動註冊字體失敗:', error)
  }
  return false
}

/**
 * 初始化 PDF 並載入中文字體
 * @returns {Promise<jsPDF>} 已載入字體的 PDF 實例
 */
async function createPDFWithChineseFont() {
  // 先載入字體檔案
  await loadChineseFont()
  
  // 創建 PDF 實例
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // 檢查字體是否已註冊
  let fontList = pdf.getFontList()
  if (!fontList || !fontList['NotoSansTC']) {
    console.log('字體未自動註冊，嘗試手動註冊...')
    
    // 嘗試手動註冊字體
    const registered = manuallyRegisterFont(pdf)
    
    if (!registered) {
      // 如果手動註冊失敗，嘗試從全局變數獲取字體數據
      try {
        if (typeof window !== 'undefined') {
          // 檢查是否有 NotoSansTC 字體數據
          if (window.__notoSansTCNormalFontData && window.__notoSansTCBoldFontData) {
            const normalFontData = window.__notoSansTCNormalFontData
            const boldFontData = window.__notoSansTCBoldFontData
            
            pdf.addFileToVFS('NotoSansTC-normal.ttf', normalFontData)
            pdf.addFont('NotoSansTC-normal.ttf', 'NotoSansTC', 'normal')
            
            pdf.addFileToVFS('NotoSansTC-bold.ttf', boldFontData)
            pdf.addFont('NotoSansTC-bold.ttf', 'NotoSansTC', 'bold')
            
            console.log('從全局變數註冊 NotoSansTC 字體成功')
          }
        }
      } catch (error) {
        console.error('從全局變數註冊字體失敗:', error)
      }
    }
    
    // 再次檢查字體是否已註冊
    fontList = pdf.getFontList()
    if (!fontList || !fontList['NotoSansTC']) {
      console.warn('中文字體可能尚未註冊，字體列表:', Object.keys(fontList || {}))
      console.warn('將使用預設字體，中文可能顯示為亂碼')
    } else {
      console.log('中文字體已成功載入:', Object.keys(fontList))
    }
  } else {
    console.log('中文字體已自動註冊:', Object.keys(fontList))
  }
  
  return pdf
}

/**
 * 主題配色配置
 */
const THEME_COLORS = {
  primary: '#6200EE',        // 主色（紫色）
  secondary: '#03DAC6',      // 次要色（青色）
  background: '#F2F6F8',     // 背景色
  surface: '#F2F6FF',        // 表面色
  text: '#333333',           // 文字色
  textLight: '#666666',      // 淺文字色
  border: '#E0E0E0',         // 邊框色
  sectionBg: '#F0F0F0',      // 區塊背景色
  quoteBg: '#E0E0E0',        // 引用區塊背景
  // 表格比率顏色
  ratioHigh: { bg: '#c6efce', text: '#006100' },      // 高比率（綠色）
  ratioMediumHigh: { bg: '#ffeb9c', text: '#9c5700' }, // 中高比率（黃色）
  ratioMedium: { bg: '#ffc7ce', text: '#9c0006' },    // 中比率（紅色）
  ratioLow: { bg: '#ffffff', text: '#000000' }        // 低比率（白色）
}

/**
 * RGB 顏色轉換輔助函數
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

/**
 * 簡化 HTML 標籤移除（可根據需求擴展）
 */
const stripHTML = (html) => {
  if (!html) return ''
  // 移除 HTML 標籤
  let text = html.replace(/<[^>]*>/g, '')
  // 解碼 HTML 實體
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  return text.trim()
}

/**
 * 解析 HTML 列表（ul/li）為結構化數據
 * @param {string} html - HTML 字串
 * @returns {Array} 解析後的列表項陣列，每個項目包含 { text, level, isListItem }
 */
function parseHTMLList(html) {
  if (!html) return []
  
  const result = []
  
  // 遞歸解析函數
  function parseList(htmlContent, currentDepth) {
    const items = []
    
    // 移除外層的 <ul> 標籤
    let content = htmlContent.replace(/^<ul[^>]*>/i, '').replace(/<\/ul>$/i, '')
    
    // 查找所有 <li> 標籤
    let match
    const liRegex = /<li[^>]*>(.*?)<\/li>/gis
    
    while ((match = liRegex.exec(content)) !== null) {
      let liContent = match[1]
      
      // 檢查是否有嵌套的 <ul>
      const nestedUlRegex = /<ul[^>]*>(.*?)<\/ul>/gis
      const nestedMatch = nestedUlRegex.exec(liContent)
      
      if (nestedMatch) {
        // 提取 <li> 中的文字（在嵌套 <ul> 之前）
        const textBeforeUl = liContent.substring(0, nestedMatch.index).trim()
        if (textBeforeUl) {
          items.push({
            text: stripHTML(textBeforeUl),
            level: currentDepth,
            isListItem: true
          })
        }
        
        // 遞歸處理嵌套的 <ul>
        const nestedItems = parseList(nestedMatch[0], currentDepth + 1)
        items.push(...nestedItems)
      } else {
        // 沒有嵌套，直接提取文字
        const text = stripHTML(liContent)
        if (text) {
          items.push({
            text: text,
            level: currentDepth,
            isListItem: true
          })
        }
      }
    }
    
    return items
  }
  
  // 檢查是否包含 <ul> 標籤
  if (/<ul/i.test(html)) {
    // 提取所有 <ul> 區塊
    let match
    const ulRegex = /<ul[^>]*>(.*?)<\/ul>/gis
    
    while ((match = ulRegex.exec(html)) !== null) {
      const listItems = parseList(match[0], 0)
      result.push(...listItems)
    }
    
    // 如果還有不在 <ul> 中的文字，也加入結果
    const textWithoutUl = html.replace(/<ul[^>]*>.*?<\/ul>/gis, '').trim()
    if (textWithoutUl) {
      const plainText = stripHTML(textWithoutUl)
      if (plainText) {
        result.push({
          text: plainText,
          level: 0,
          isListItem: false
        })
      }
    }
  } else {
    // 沒有列表標籤，返回純文字
    const text = stripHTML(html)
    if (text) {
      result.push({
        text: text,
        level: 0,
        isListItem: false
      })
    }
  }
  
  return result
}

/**
 * 獲取當前可用的字體名稱
 * @param {jsPDF} pdf - PDF 實例
 * @returns {string} 字體名稱
 */
function getFontName(pdf) {
  try {
    // 檢查是否已載入中文字體（字體名稱是 'NotoSansTC'）
    const fontList = pdf.getFontList()
    
    // 優先檢查 'NotoSansTC'（字體檔案中註冊的名稱）
    if (fontList && fontList['NotoSansTC']) {
      return 'NotoSansTC'
    }
    
    // 備選檢查其他可能的 NotoSansTC 變體
    if (fontList && fontList['NotoSansTC-normal']) {
      return 'NotoSansTC-normal'
    }
    
    // 如果沒有中文字體，使用預設字體
    console.warn('未找到中文字體，使用預設字體 helvetica')
    return 'helvetica'
  } catch (error) {
    console.error('獲取字體名稱失敗:', error)
    return 'helvetica'
  }
}

/**
 * 將 Chart.js 圖表轉換為 base64 圖片
 * 
 * @param {Object} chartInstance - Chart.js 圖表實例
 * @returns {string} base64 圖片字串
 */
export function chartToBase64(chartInstance) {
  if (!chartInstance) return null
  try {
    return chartInstance.toBase64Image('image/png', 1.0)
  } catch (error) {
    console.error('轉換圖表失敗:', error)
    return null
  }
}

/**
 * 生成客戶端報告 HTML（預覽用）
 * 
 * @param {Object} options - 報告數據選項
 * @returns {string} HTML 字串
 */
function generateCustomerReportHTML(options) {
  const { finalResult, pairResult, radarChartImage } = options
  
  // 過濾職業配對結果
  const professions = pairResult ? Object.entries(pairResult)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({ key, ...value })) : []

  // 生成職業配對表格 HTML
  const generateProfessionTableHTML = () => {
    if (professions.length === 0) return ''
    
    let tableHTML = `
      <table style="width: 100%; border-collapse: separate; border-spacing: 3px; margin: 20px 0;">
        <thead>
          <tr>
            <th style="background-color: ${THEME_COLORS.primary}; color: white; padding: 10px; text-align: center; border-radius: 4px;">類型</th>
    `
    
    professions.forEach(prof => {
      const title = prof.title || ''
      const displayTitle = title.length > 4 ? title.substring(0, 4) + '<br>' + title.substring(4) : title
      tableHTML += `<th style="background-color: ${THEME_COLORS.primary}; color: white; padding: 10px; text-align: center; border-radius: 4px;">${displayTitle}</th>`
    })
    
    tableHTML += `
          </tr>
        </thead>
        <tbody>
    `
    
    const types = [
      { label: '我在乎', key: 'care' },
      { label: '我可以', key: 'can' },
      { label: '我喜歡', key: 'like' }
    ]
    
    types.forEach(type => {
      tableHTML += '<tr>'
      tableHTML += `<td style="padding: 10px; text-align: center; font-weight: bold;">${type.label}</td>`
      
      professions.forEach(prof => {
        const ratio = prof.rate?.[type.key] || 0
        const ratioText = `${ratio.toFixed(2)} %`
        const color = getRatioColor(ratio)
        
        tableHTML += `
          <td style="
            padding: 10px;
            text-align: center;
            background-color: ${color.bg};
            color: ${color.text};
            border-radius: 10px;
            border: 1px dashed ${color.text};
          ">${ratioText}</td>
        `
      })
      
      tableHTML += '</tr>'
    })
    
    tableHTML += `
        </tbody>
      </table>
    `
    
    return tableHTML
  }

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>測驗結果報告</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Noto Sans TC', 'Microsoft JhengHei', '微軟正黑體', 'Arial', sans-serif;
          color: ${THEME_COLORS.text};
          background-color: ${THEME_COLORS.background};
          padding: 20px;
          line-height: 1.6;
        }
        .report-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 20mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid ${THEME_COLORS.primary};
        }
        .report-title {
          font-size: 28px;
          font-weight: bold;
          color: ${THEME_COLORS.primary};
          margin-bottom: 10px;
        }
        .report-date {
          color: ${THEME_COLORS.textLight};
          font-size: 14px;
        }
        .section {
          margin: 30px 0;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: ${THEME_COLORS.primary};
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid ${THEME_COLORS.border};
        }
        .section-content {
          background-color: ${THEME_COLORS.sectionBg};
          padding: 15px;
          border-radius: 8px;
          margin-top: 10px;
        }
        .section-content ul {
          list-style: none;
          padding-left: 0;
        }
        .section-content li {
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
        }
        .section-content li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${THEME_COLORS.primary};
          font-weight: bold;
        }
        .radar-chart-section {
          text-align: center;
          margin: 30px 0;
        }
        .radar-chart-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .quote-block {
          background-color: ${THEME_COLORS.quoteBg};
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14pt;
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 3px;
          margin: 20px 0;
        }
        th {
          background-color: ${THEME_COLORS.primary};
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 4px;
        }
        td {
          padding: 10px;
          text-align: center;
        }
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="report-header">
          <h1 class="report-title">測驗結果</h1>
          <div class="report-date">報告日期：${new Date().toLocaleDateString('zh-TW')}</div>
        </div>

        ${radarChartImage ? `
        <div class="section radar-chart-section">
          <h2 class="section-title">職業雷達圖</h2>
          <div class="quote-block">預留文字區塊</div>
          <img src="${radarChartImage}" alt="職業雷達圖" class="radar-chart-image" />
        </div>
        ` : ''}

        ${finalResult ? `
        <div class="section">
          <h2 class="section-title">綜合解析</h2>
          <div class="section-content">${finalResult.summary || ''}</div>
        </div>

        <div class="section">
          <h2 class="section-title">活動偏好 - 興趣</h2>
          <div class="section-content">${finalResult.interest || ''}</div>
        </div>

        <div class="section">
          <h2 class="section-title">擅長知能 - 能力</h2>
          <div class="section-content">${finalResult.ability || ''}</div>
        </div>

        <div class="section">
          <h2 class="section-title">適配職業別</h2>
          <div class="section-content">${finalResult.career || ''}</div>
        </div>

        <div class="section">
          <h2 class="section-title">補充說明</h2>
          <div class="section-content">${finalResult.note || ''}</div>
        </div>
        ` : ''}

        ${professions.length > 0 ? `
        <div class="section">
          <h2 class="section-title">分析結果: 職業配對</h2>
          <div class="quote-block">預留文字區塊</div>
          ${generateProfessionTableHTML()}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `
  
  return html
}

/**
 * 將類型代碼轉換為中文標籤
 */
function stringOfType(type) {
  switch (type) {
    case 'goal':
      return '我就是'
    case 'care':
      return '我在乎'
    case 'cj':
      return '我可以 (社青版)'
    case 'ce':
      return '我可以 (國小版)'
    case 'le':
      return '我喜歡 (國小版)'
    case 'lj':
      return '我喜歡 (社青版)'
    case 'total':
      return '總數'
    case 'can':
      return '我可以'
    case 'like':
      return '我喜歡'
    default:
      return type
  }
}

/**
 * 根據比率值返回顏色
 */
function getRatioColor(ratio) {
  if (ratio > 66) {
    return THEME_COLORS.ratioHigh
  } else if (ratio > 50) {
    return THEME_COLORS.ratioMediumHigh
  } else if (ratio > 33) {
    return THEME_COLORS.ratioMedium
  } else {
    return THEME_COLORS.ratioLow
  }
}

/**
 * 生成客戶端報告 PDF
 * 
 * @param {Object} options - 報告數據選項
 * @param {Object} options.finalResult - 最終結果物件
 * @param {Object} options.pairResult - 職業配對結果
 * @param {string} options.radarChartImage - 雷達圖 base64 圖片
 * @param {Object} options.config - PDF 配置選項
 * @returns {Promise<void>}
 */
async function generateCustomerReportPDF(options) {
  const { finalResult, pairResult, radarChartImage, config = {}, examProcessStore = null } = options
  const { filename = `測驗報告_${new Date().getTime()}.pdf` } = config

  // 初始化 PDF 並載入中文字體（A4 尺寸，縱向）
  const pdf = await createPDFWithChineseFont()
  const pageWidth = 210 // A4 寬度 (mm)
  const pageHeight = 297 // A4 高度 (mm)
  const margin = 20 // 邊距
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // 獲取字體名稱
  const fontName = getFontName(pdf)

  // ========== 1. 報告標題 ==========
  const primaryRgb = hexToRgb(THEME_COLORS.primary)
  pdf.setFontSize(24)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.text('無限可能卡-測驗結果報告', pageWidth / 2, currentY, { align: 'center' })
  currentY += 8

  // 報告資訊欄位
  pdf.setFontSize(9)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(80, 80, 80)
  
  // 從 examProcessStore 獲取資料
  const examSerial = examProcessStore?.report_id || '未提供'
  const examTargetName = examProcessStore?.report_name || '未設定'
  const examEmail = examProcessStore?.target_email || '未設定'
  const reportDate = new Date().toLocaleDateString('zh-TW')

  // 左側欄位
  const leftColumnX = margin + 10
  const rightColumnX = margin + contentWidth / 2 + 10
  const lineSpacing = 5

  // 第一行：測驗序號（左側）、測驗發送信箱（右側）
  pdf.text(`測驗序號：${examSerial}`, leftColumnX, currentY)
  pdf.text(`測驗發送信箱：${examEmail}`, rightColumnX, currentY)

  // 第二行：測驗對象名稱（左側）、報告製表日期（右側）
  pdf.text(`測驗對象名稱：${examTargetName}`, leftColumnX, currentY + lineSpacing)
  pdf.text(`報告製表日期：${reportDate}`, rightColumnX, currentY + lineSpacing)

  currentY += 8

  // 繪製分隔線
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(0.5)
  pdf.line(margin, currentY, margin + contentWidth, currentY)
  currentY += 10

  // ========== 2. 職業雷達圖 ==========
  if (radarChartImage) {
    // 檢查是否需要換頁
    if (currentY + 80 > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }

    pdf.setFontSize(18)
    pdf.setFont(fontName, 'bold')
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    
    // 繪製標題文字
    const titleText = '職業雷達圖'
    pdf.text(titleText, margin, currentY)
    
    // 計算標題文字寬度（使用 getTextWidth）
    const titleWidth = pdf.getTextWidth(titleText)
    
    // 繪製雙底線
    const lineY1 = currentY + 2 // 第一條線的位置
    const lineY2 = currentY + 3 // 第二條線的位置（間距約 1.5mm）
    const lineWidth = 0.3 // 線條寬度
    
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    pdf.setLineWidth(lineWidth)
    
    // 第一條底線
    pdf.line(margin, lineY1, margin + titleWidth, lineY1)
    // 第二條底線
    pdf.line(margin, lineY2, margin + titleWidth, lineY2)
    
    currentY += 8

    // 引用區塊（使用與 section 相同的背景顏色，使用圓角）
    const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
    pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
    const cornerRadius = 1.5 // 圓角半徑 1.5mm
    pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
    pdf.setFontSize(12)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    pdf.text('預留文字區塊', margin + 5, currentY + 5)
    currentY += 12

    // 計算圖片尺寸（保持比例，最大寬度為內容寬度）
    const imgWidth = contentWidth
    const imgHeight = (imgWidth * 0.75) // 假設圖片比例為 4:3

    // 檢查是否需要換頁
    if (currentY + imgHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }

    try {
      pdf.addImage(radarChartImage, 'PNG', margin, currentY, imgWidth, imgHeight)
      currentY += imgHeight + 10
    } catch (error) {
      console.error('添加圖片失敗:', error)
      currentY += 10
    }
  }

  // ========== 3. 綜合解析 ==========
  if (finalResult) {
    // 檢查是否需要換頁
    if (currentY + 30 > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }

    // 添加「測驗解果分析」標題（帶雙底線）
    pdf.setFontSize(18)
    pdf.setFont(fontName, 'bold')
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    
    // 繪製標題文字
    const mainTitleText = '測驗結果分析'
    pdf.text(mainTitleText, margin, currentY)
    
    // 計算標題文字寬度（使用 getTextWidth）
    const mainTitleWidth = pdf.getTextWidth(mainTitleText)
    
    // 繪製雙底線
    const lineY1 = currentY + 2 // 第一條線的位置
    const lineY2 = currentY + 3 // 第二條線的位置（間距約 1mm）
    const lineWidth = 0.3 // 線條寬度
    
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    pdf.setLineWidth(lineWidth)
    
    // 第一條底線
    pdf.line(margin, lineY1, margin + mainTitleWidth, lineY1)
    // 第二條底線
    pdf.line(margin, lineY2, margin + mainTitleWidth, lineY2)
    
    currentY += 16

    // 綜合解析
    if (finalResult.summary) {
      currentY = addSection(pdf, '綜合解析', finalResult.summary, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
    }

    // 活動偏好 - 興趣
    if (finalResult.interest) {
      currentY = addSection(pdf, '活動偏好 - 興趣', finalResult.interest, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
    }

    // 擅長知能 - 能力
    if (finalResult.ability) {
      currentY = addSection(pdf, '擅長知能 - 能力', finalResult.ability, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
    }

    // 適配職業別
    if (finalResult.career) {
      currentY = addSection(pdf, '適配職業別', finalResult.career, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
    }

    // 補充說明
    if (finalResult.note) {
      currentY = addSection(pdf, '補充說明', finalResult.note, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
    }
  }

  // ========== 4. 職業配對表格 ==========
  if (pairResult) {
    currentY = addProfessionTable(pdf, pairResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // ========== 5. 頁尾 ==========
  const totalPages = pdf.internal.pages.length - 1
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(10)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(
      `第 ${i} 頁 / 共 ${totalPages} 頁`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // 下載 PDF
  pdf.save(filename)
}

/**
 * 添加章節內容（處理 HTML 文字和自動換頁）
 */
function addSection(pdf, title, htmlContent, margin, startY, contentWidth, pageHeight, primaryRgb, fontName) {
  let currentY = startY

  // 檢查是否需要換頁
  if (currentY + 40 > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
  }

  // 標題
  pdf.setFontSize(16)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.text(title, margin, currentY)
  currentY += 4

  // 分隔線
  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.2)
  pdf.line(margin, currentY, margin + contentWidth, currentY)
  currentY += 4

  // 背景區塊
  const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
  let sectionStartY = currentY

  // 解析 HTML 內容（支援 ul/li 列表）
  const parsedItems = parseHTMLList(htmlContent)
  
  pdf.setFontSize(12)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(0, 0, 0)

  // 計算總行數和背景高度
  // 字體大小為 12pt，0.25 字元高度 = 12 * 0.25 = 3pt ≈ 1.06mm
  const fontSize = 12
  const extraLineSpacing = fontSize * 0.25 * 0.353 // 轉換為 mm (1pt ≈ 0.353mm)
  const lineHeight = 6 + extraLineSpacing // 原本 6mm + 0.25 字元高度
  const listIndent = 8 // 每層縮排 8mm
  
  // 預先計算所有行的位置和高度
  let totalLines = 0
  const allLines = []
  for (const item of parsedItems) {
    const indent = item.isListItem ? margin + 5 + (item.level * listIndent) : margin + 5
    const textWidth = contentWidth - (indent - margin) - 5
    const lines = pdf.splitTextToSize(item.text, textWidth)
    
    for (let i = 0; i < lines.length; i++) {
      allLines.push({
        text: lines[i],
        isListItem: item.isListItem,
        level: item.level,
        isFirstLine: i === 0
      })
    }
    totalLines += lines.length
  }

  let sectionHeight = totalLines * lineHeight

  // 檢查是否需要換頁
  if (currentY + sectionHeight > pageHeight - margin - 20) {
    pdf.addPage()
    currentY = margin
    sectionStartY = currentY
  }

  // 繪製背景（從 currentY 開始，高度為 totalLines * lineHeight，使用圓角）
  pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
  const cornerRadius = 1.5 // 圓角半徑 1.5mm
  pdf.roundedRect(margin, sectionStartY, contentWidth, sectionHeight, cornerRadius, cornerRadius, 'F')

  // 繪製文字（保留縮排但不顯示 bullet 符號）
  for (const lineInfo of allLines) {
    if (currentY + lineHeight > pageHeight - margin - 10) {
      pdf.addPage()
      currentY = margin
    }
    
    // 根據是否為列表項和層級計算縮排
    const textX = lineInfo.isListItem 
      ? margin + 5 + (lineInfo.level * listIndent)
      : margin + 5
    
    // 繪製文字
    pdf.text(lineInfo.text, textX, currentY + 5)
    currentY += lineHeight
  }

  return currentY + 10
}

/**
 * 添加職業配對表格
 */
function addProfessionTable(pdf, pairResult, margin, startY, contentWidth, pageHeight, primaryRgb, fontName) {
  let currentY = startY

  // 檢查是否需要換頁
  if (currentY + 50 > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
  }

  // 標題上方預留 1.5 字元高度（字體大小 18pt，1.5 * 18 * 0.353 ≈ 9.5mm）
  const fontSize = 18
  const extraSpacing = fontSize * 1.5 * 0.353 // 轉換為 mm (1pt ≈ 0.353mm)
  currentY += extraSpacing

  // 標題
  pdf.setFontSize(fontSize)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  
  // 繪製標題文字
  const titleText = '分析結果: 職業配對'
  pdf.text(titleText, margin, currentY)
  
  // 計算標題文字寬度（使用 getTextWidth）
  const titleWidth = pdf.getTextWidth(titleText)
  
  // 繪製雙底線
  const lineY1 = currentY + 2 // 第一條線的位置
  const lineY2 = currentY + 3 // 第二條線的位置（間距約 1mm）
  const lineWidth = 0.3 // 線條寬度
  
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(lineWidth)
  
  // 第一條底線
  pdf.line(margin, lineY1, margin + titleWidth, lineY1)
  // 第二條底線
  pdf.line(margin, lineY2, margin + titleWidth, lineY2)
  
  currentY += 10

  // 引用區塊（使用與 section 相同的背景顏色，使用圓角）
  const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
  pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
  const cornerRadius = 1.5 // 圓角半徑 1.5mm
  pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
  pdf.setFontSize(12)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(0, 0, 0)
  pdf.text('預留文字區塊', margin + 5, currentY + 5)
  currentY += 12

  // 過濾掉 'total' 鍵
  const professions = Object.entries(pairResult)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({ key, ...value }))

  if (professions.length === 0) return currentY

  // 表格設定
  const tableTop = currentY + 5
  const rowHeight = 8
  const colWidth = contentWidth / (professions.length + 1)
  const headerHeight = 10
  const totalRows = 3 // 三行數據（我在乎、我可以、我喜歡）
  const tableHeight = headerHeight + (totalRows * rowHeight)

  // 檢查是否需要換頁
  if (tableTop + tableHeight > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
    return addProfessionTable(pdf, pairResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // 設定框線顏色（深灰色，RGB: 150, 150, 150）
  const borderColor = { r: 150, g: 150, b: 150 }
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
  pdf.setLineWidth(0.2)

  // 表頭背景（白色）
  pdf.setFillColor(255, 255, 255)
  pdf.rect(margin, tableTop, contentWidth, headerHeight, 'F')

  // 繪製表頭框線（頂部和水平分隔線）
  pdf.line(margin, tableTop, margin + contentWidth, tableTop) // 頂部邊框
  pdf.line(margin, tableTop + headerHeight, margin + contentWidth, tableTop + headerHeight) // 表頭底部

  // 繪製表頭垂直分隔線
  for (let i = 0; i <= professions.length + 1; i++) {
    const x = margin + (i * colWidth)
    pdf.line(x, tableTop, x, tableTop + headerHeight)
  }

  // 表頭文字（黑色）
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont(fontName, 'bold')
  pdf.text('類型', margin + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center' })

  professions.forEach((prof, index) => {
    const x = margin + colWidth * (index + 1)
    const title = prof.title || ''
    // 如果標題超過 4 個字符，需要換行處理
    pdf.text(title, x + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center', maxWidth: colWidth - 4 })
  })

  // 表格內容
  const types = [
    { label: '我在乎', key: 'care' },
    { label: '我可以', key: 'can' },
    { label: '我喜歡', key: 'like' }
  ]

  types.forEach((type, typeIndex) => {
    currentY = tableTop + headerHeight + (typeIndex * rowHeight)

    // 檢查是否需要換頁
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin + 10
      // 重新繪製表頭（簡化版，實際應用中可能需要更複雜的處理）
    }

    // 先繪製類型標籤的背景（白色）
    pdf.setFillColor(255, 255, 255)
    pdf.rect(margin, currentY, colWidth, rowHeight, 'F')

    // 類型標籤（垂直置中對齊）
    pdf.setFontSize(10)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    
    // 計算垂直置中的 Y 位置
    // rowHeight = 8mm, 字體大小 = 10pt ≈ 3.5mm
    // 垂直置中 = currentY + rowHeight / 2 + 字體高度的一半
    const centerY = currentY + rowHeight / 2 + 1.5 // 調整偏移量以達到視覺置中
    
    pdf.text(type.label, margin + colWidth / 2, centerY, { align: 'center' })

    // 職業配對率（先繪製背景色）
    professions.forEach((prof, profIndex) => {
      const x = margin + colWidth * (profIndex + 1)
      const ratio = prof.rate?.[type.key] || 0
      const ratioText = `${ratio.toFixed(2)} %`

      // 根據比率設定背景顏色
      const color = getRatioColor(ratio)
      const colorRgb = hexToRgb(color.bg)
      const textRgb = hexToRgb(color.text)
      
      pdf.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b)
      pdf.rect(x, currentY, colWidth, rowHeight, 'F')

      // 計算垂直置中的 Y 位置
      // rowHeight = 8mm, 字體大小 = 10pt ≈ 3.5mm
      // 垂直置中 = currentY + rowHeight / 2 + 字體高度的一半
      const centerY = currentY + rowHeight / 2 + 1.5 // 調整偏移量以達到視覺置中

      // 文字顏色
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b)
      pdf.text(ratioText, x + colWidth / 2, centerY, { align: 'center' })
    })

    // 重置文字顏色
    pdf.setTextColor(0, 0, 0)

    // 最後繪製框線（確保框線顯示在背景色之上）
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.setLineWidth(0.2)
    
    // 繪製行水平分隔線
    pdf.line(margin, currentY, margin + contentWidth, currentY)
    pdf.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight)

    // 繪製行垂直分隔線
    for (let i = 0; i <= professions.length + 1; i++) {
      const x = margin + (i * colWidth)
      pdf.line(x, currentY, x, currentY + rowHeight)
    }
  })

  // 繪製表格外框（右側和底部）
  pdf.line(margin + contentWidth, tableTop, margin + contentWidth, tableTop + tableHeight) // 右側邊框
  pdf.line(margin, tableTop + tableHeight, margin + contentWidth, tableTop + tableHeight) // 底部邊框

  return currentY + rowHeight + 10
}

/**
 * 添加特質挑選表格（分析結果: 特質挑選）
 */
function addTraitSelectionTable(pdf, pickResult, margin, startY, contentWidth, pageHeight, primaryRgb, fontName) {
  let currentY = startY

  // 檢查是否需要換頁
  if (currentY + 50 > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
  }

  // 標題上方預留 1.5 字元高度
  const fontSize = 18
  const extraSpacing = fontSize * 1.5 * 0.353
  currentY += extraSpacing

  // 標題
  pdf.setFontSize(fontSize)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  
  const titleText = '分析結果: 特質挑選'
  pdf.text(titleText, margin, currentY)
  
  const titleWidth = pdf.getTextWidth(titleText)
  
  // 繪製雙底線
  const lineY1 = currentY + 2
  const lineY2 = currentY + 3
  const lineWidth = 0.3
  
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(lineWidth)
  pdf.line(margin, lineY1, margin + titleWidth, lineY1)
  pdf.line(margin, lineY2, margin + titleWidth, lineY2)
  
  currentY += 10

  // 引用區塊
  const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
  pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
  const cornerRadius = 1.5
  pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
  pdf.setFontSize(12)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(0, 0, 0)
  pdf.text('預留文字區塊', margin + 5, currentY + 5)
  currentY += 12

  // 過濾掉 'total' 鍵
  const types = Object.entries(pickResult)
    .filter(([key]) => key !== 'total')

  if (types.length === 0) return currentY

  // 表格設定
  const tableTop = currentY + 5
  const rowHeight = 8
  const colWidth = contentWidth / 8 // 類型 + R + I + A + S + E + C + 荷倫碼 = 8 欄
  const headerHeight = 10
  const totalRows = types.length
  const tableHeight = headerHeight + (totalRows * rowHeight)

  // 檢查是否需要換頁
  if (tableTop + tableHeight > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
    return addTraitSelectionTable(pdf, pickResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // 設定框線顏色
  const borderColor = { r: 150, g: 150, b: 150 }
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
  pdf.setLineWidth(0.2)

  // 表頭背景（白色）
  pdf.setFillColor(255, 255, 255)
  pdf.rect(margin, tableTop, contentWidth, headerHeight, 'F')

  // 繪製表頭框線
  pdf.line(margin, tableTop, margin + contentWidth, tableTop)
  pdf.line(margin, tableTop + headerHeight, margin + contentWidth, tableTop + headerHeight)

  // 繪製表頭垂直分隔線
  const headerCols = ['類型', 'R', 'I', 'A', 'S', 'E', 'C', '荷倫碼']
  for (let i = 0; i <= headerCols.length; i++) {
    const x = margin + (i * colWidth)
    pdf.line(x, tableTop, x, tableTop + headerHeight)
  }

  // 表頭文字
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont(fontName, 'bold')
  headerCols.forEach((col, index) => {
    const x = margin + colWidth * index
    pdf.text(col, x + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center', maxWidth: colWidth - 2 })
  })

  // 表格內容
  types.forEach(([typeKey, typeData], rowIndex) => {
    currentY = tableTop + headerHeight + (rowIndex * rowHeight)

    // 檢查是否需要換頁
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin + 10
    }

    // 類型標籤背景（白色）
    pdf.setFillColor(255, 255, 255)
    pdf.rect(margin, currentY, colWidth, rowHeight, 'F')

    // 類型標籤（垂直置中）
    pdf.setFontSize(9)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    const centerY = currentY + rowHeight / 2 + 1.5
    pdf.text(stringOfType(typeKey), margin + colWidth / 2, centerY, { align: 'center', maxWidth: colWidth - 2 })

    // RIASEC 百分比
    const riasecTypes = ['r', 'i', 'a', 's', 'e', 'c']
    riasecTypes.forEach((riasecType, colIndex) => {
      const x = margin + colWidth * (colIndex + 1)
      const ratio = typeData.rate?.[riasecType] || 0
      const ratioText = `${ratio.toFixed(2)} %`

      // 根據比率設定背景顏色
      const color = getRatioColor(ratio)
      const colorRgb = hexToRgb(color.bg)
      const textRgb = hexToRgb(color.text)
      
      pdf.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b)
      pdf.rect(x, currentY, colWidth, rowHeight, 'F')

      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b)
      pdf.text(ratioText, x + colWidth / 2, centerY, { align: 'center' })
    })

    // 荷倫碼
    const hCodeX = margin + colWidth * 7
    pdf.setFillColor(255, 255, 255)
    pdf.rect(hCodeX, currentY, colWidth, rowHeight, 'F')
    pdf.setTextColor(0, 0, 255)
    pdf.setFont(fontName, 'bold')
    pdf.text(typeData.h_code || '', hCodeX + colWidth / 2, centerY, { align: 'center' })

    // 重置文字顏色
    pdf.setTextColor(0, 0, 0)

    // 繪製框線
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.setLineWidth(0.2)
    pdf.line(margin, currentY, margin + contentWidth, currentY)
    pdf.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight)

    for (let i = 0; i <= headerCols.length; i++) {
      const x = margin + (i * colWidth)
      pdf.line(x, currentY, x, currentY + rowHeight)
    }
  })

  // 繪製表格外框
  pdf.line(margin + contentWidth, tableTop, margin + contentWidth, tableTop + tableHeight)
  pdf.line(margin, tableTop + tableHeight, margin + contentWidth, tableTop + tableHeight)

  return currentY + rowHeight + 10
}

/**
 * 添加卡片挑選結果表格
 */
function addCardSelectionTable(pdf, pickResult, margin, startY, contentWidth, pageHeight, primaryRgb, fontName) {
  let currentY = startY

  // 檢查是否需要換頁
  if (currentY + 50 > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
  }

  // 標題上方預留 1.5 字元高度
  const fontSize = 18
  const extraSpacing = fontSize * 1.5 * 0.353
  currentY += extraSpacing

  // 標題
  pdf.setFontSize(fontSize)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  
  const titleText = '卡片挑選結果'
  pdf.text(titleText, margin, currentY)
  
  const titleWidth = pdf.getTextWidth(titleText)
  
  // 繪製雙底線
  const lineY1 = currentY + 2
  const lineY2 = currentY + 3
  const lineWidth = 0.3
  
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(lineWidth)
  pdf.line(margin, lineY1, margin + titleWidth, lineY1)
  pdf.line(margin, lineY2, margin + titleWidth, lineY2)
  
  currentY += 10

  // 引用區塊
  const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
  pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
  const cornerRadius = 1.5
  pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
  pdf.setFontSize(12)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(0, 0, 0)
  pdf.text('預留文字區塊', margin + 5, currentY + 5)
  currentY += 12

  // 過濾掉 'total' 鍵
  const types = Object.entries(pickResult)
    .filter(([key]) => key !== 'total')

  if (types.length === 0) return currentY

  // 表格設定
  const tableTop = currentY + 5
  const rowHeight = 8
  const colWidth = contentWidth / 7 // 類型 + R + I + A + S + E + C = 7 欄
  const headerHeight = 10
  const totalRows = types.length
  const tableHeight = headerHeight + (totalRows * rowHeight)

  // 檢查是否需要換頁
  if (tableTop + tableHeight > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
    return addCardSelectionTable(pdf, pickResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // 設定框線顏色
  const borderColor = { r: 150, g: 150, b: 150 }
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
  pdf.setLineWidth(0.2)

  // 表頭背景（白色）
  pdf.setFillColor(255, 255, 255)
  pdf.rect(margin, tableTop, contentWidth, headerHeight, 'F')

  // 繪製表頭框線
  pdf.line(margin, tableTop, margin + contentWidth, tableTop)
  pdf.line(margin, tableTop + headerHeight, margin + contentWidth, tableTop + headerHeight)

  // 繪製表頭垂直分隔線
  const headerCols = ['類型', 'R', 'I', 'A', 'S', 'E', 'C']
  for (let i = 0; i <= headerCols.length; i++) {
    const x = margin + (i * colWidth)
    pdf.line(x, tableTop, x, tableTop + headerHeight)
  }

  // 表頭文字
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont(fontName, 'bold')
  headerCols.forEach((col, index) => {
    const x = margin + colWidth * index
    pdf.text(col, x + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center', maxWidth: colWidth - 2 })
  })

  // 表格內容
  types.forEach(([typeKey, typeData], rowIndex) => {
    currentY = tableTop + headerHeight + (rowIndex * rowHeight)

    // 檢查是否需要換頁
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin + 10
    }

    // 類型標籤背景（淺黃色）
    const rawCellRgb = hexToRgb('#FFF6A8')
    pdf.setFillColor(rawCellRgb.r, rawCellRgb.g, rawCellRgb.b)
    pdf.rect(margin, currentY, colWidth, rowHeight, 'F')

    // 類型標籤（垂直置中）
    pdf.setFontSize(9)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    const centerY = currentY + rowHeight / 2 + 1.5
    pdf.text(stringOfType(typeKey), margin + colWidth / 2, centerY, { align: 'center', maxWidth: colWidth - 2 })

    // RIASEC 計數（淺黃色背景）
    const riasecTypes = ['r', 'i', 'a', 's', 'e', 'c']
    riasecTypes.forEach((riasecType, colIndex) => {
      const x = margin + colWidth * (colIndex + 1)
      const count = typeData[riasecType] || 0

      pdf.setFillColor(rawCellRgb.r, rawCellRgb.g, rawCellRgb.b)
      pdf.rect(x, currentY, colWidth, rowHeight, 'F')

      pdf.setTextColor(0, 0, 0)
      pdf.text(String(count), x + colWidth / 2, centerY, { align: 'center' })
    })

    // 繪製框線
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.setLineWidth(0.2)
    pdf.line(margin, currentY, margin + contentWidth, currentY)
    pdf.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight)

    for (let i = 0; i <= headerCols.length; i++) {
      const x = margin + (i * colWidth)
      pdf.line(x, currentY, x, currentY + rowHeight)
    }
  })

  // 繪製表格外框
  pdf.line(margin + contentWidth, tableTop, margin + contentWidth, tableTop + tableHeight)
  pdf.line(margin, tableTop + tableHeight, margin + contentWidth, tableTop + tableHeight)

  return currentY + rowHeight + 10
}

/**
 * 添加職業卡牌配對結果表格（顯示原始計數）
 */
function addProfessionCountTable(pdf, pairResult, margin, startY, contentWidth, pageHeight, primaryRgb, fontName) {
  let currentY = startY

  // 檢查是否需要換頁
  if (currentY + 50 > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
  }

  // 標題上方預留 1.5 字元高度
  const fontSize = 18
  const extraSpacing = fontSize * 1.5 * 0.353
  currentY += extraSpacing

  // 標題
  pdf.setFontSize(fontSize)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  
  const titleText = '職業卡牌配對結果'
  pdf.text(titleText, margin, currentY)
  
  const titleWidth = pdf.getTextWidth(titleText)
  
  // 繪製雙底線
  const lineY1 = currentY + 2
  const lineY2 = currentY + 3
  const lineWidth = 0.3
  
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(lineWidth)
  pdf.line(margin, lineY1, margin + titleWidth, lineY1)
  pdf.line(margin, lineY2, margin + titleWidth, lineY2)
  
  currentY += 10

  // 引用區塊
  const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
  pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
  const cornerRadius = 1.5
  pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
  pdf.setFontSize(12)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(0, 0, 0)
  pdf.text('預留文字區塊', margin + 5, currentY + 5)
  currentY += 12

  // 過濾掉 'total' 鍵
  const professions = Object.entries(pairResult)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({ key, ...value }))

  if (professions.length === 0) return currentY

  // 表格設定
  const tableTop = currentY + 5
  const rowHeight = 8
  const colWidth = contentWidth / (professions.length + 1)
  const headerHeight = 10
  const totalRows = 3 // 三行數據（我在乎、我可以、我喜歡）
  const tableHeight = headerHeight + (totalRows * rowHeight)

  // 檢查是否需要換頁
  if (tableTop + tableHeight > pageHeight - margin) {
    pdf.addPage()
    currentY = margin
    return addProfessionCountTable(pdf, pairResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // 設定框線顏色
  const borderColor = { r: 150, g: 150, b: 150 }
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
  pdf.setLineWidth(0.2)

  // 表頭背景（白色）
  pdf.setFillColor(255, 255, 255)
  pdf.rect(margin, tableTop, contentWidth, headerHeight, 'F')

  // 繪製表頭框線
  pdf.line(margin, tableTop, margin + contentWidth, tableTop)
  pdf.line(margin, tableTop + headerHeight, margin + contentWidth, tableTop + headerHeight)

  // 繪製表頭垂直分隔線
  for (let i = 0; i <= professions.length + 1; i++) {
    const x = margin + (i * colWidth)
    pdf.line(x, tableTop, x, tableTop + headerHeight)
  }

  // 表頭文字
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont(fontName, 'bold')
  pdf.text('類型', margin + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center' })

  professions.forEach((prof, index) => {
    const x = margin + colWidth * (index + 1)
    const title = prof.title || ''
    pdf.text(title, x + colWidth / 2, tableTop + headerHeight / 2 + 2, { align: 'center', maxWidth: colWidth - 4 })
  })

  // 表格內容
  const types = [
    { label: '我在乎', key: 'care' },
    { label: '我可以', key: 'can' },
    { label: '我喜歡', key: 'like' }
  ]

  types.forEach((type, typeIndex) => {
    currentY = tableTop + headerHeight + (typeIndex * rowHeight)

    // 檢查是否需要換頁
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin + 10
    }

    // 類型標籤背景（淺黃色）
    const rawCellRgb = hexToRgb('#FFF6A8')
    pdf.setFillColor(rawCellRgb.r, rawCellRgb.g, rawCellRgb.b)
    pdf.rect(margin, currentY, colWidth, rowHeight, 'F')

    // 類型標籤（垂直置中）
    pdf.setFontSize(10)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    const centerY = currentY + rowHeight / 2 + 1.5
    pdf.text(type.label, margin + colWidth / 2, centerY, { align: 'center' })

    // 職業配對計數（淺黃色背景）
    professions.forEach((prof, profIndex) => {
      const x = margin + colWidth * (profIndex + 1)
      const count = prof[type.key] || 0

      pdf.setFillColor(rawCellRgb.r, rawCellRgb.g, rawCellRgb.b)
      pdf.rect(x, currentY, colWidth, rowHeight, 'F')

      pdf.setTextColor(0, 0, 0)
      pdf.text(String(count), x + colWidth / 2, centerY, { align: 'center' })
    })

    // 繪製框線
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.setLineWidth(0.2)
    pdf.line(margin, currentY, margin + contentWidth, currentY)
    pdf.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight)

    for (let i = 0; i <= professions.length + 1; i++) {
      const x = margin + (i * colWidth)
      pdf.line(x, currentY, x, currentY + rowHeight)
    }
  })

  // 繪製表格外框
  pdf.line(margin + contentWidth, tableTop, margin + contentWidth, tableTop + tableHeight)
  pdf.line(margin, tableTop + tableHeight, margin + contentWidth, tableTop + tableHeight)

  return currentY + rowHeight + 10
}

/**
 * 生成諮商師報告 PDF
 * 
 * @param {Object} options - 報告數據選項
 * @param {Object} options.pickResult - 特質挑選結果
 * @param {Object} options.pairResult - 職業配對結果
 * @param {string} options.radarChartImage - 雷達圖 base64 圖片
 * @param {Object} options.config - PDF 配置選項
 * @param {Object} options.examProcessStore - examProcess store 實例
 * @returns {Promise<void>}
 */
async function generateCounselorReportPDF(options) {
  const { pickResult, pairResult, radarChartImage, config = {}, examProcessStore = null } = options
  const { filename = `諮商師報告_${new Date().getTime()}.pdf` } = config

  // 初始化 PDF 並載入中文字體（A4 尺寸，縱向）
  const pdf = await createPDFWithChineseFont()
  const pageWidth = 210 // A4 寬度 (mm)
  const pageHeight = 297 // A4 高度 (mm)
  const margin = 20 // 邊距
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // 獲取字體名稱
  const fontName = getFontName(pdf)

  // ========== 1. 報告標題 ==========
  const primaryRgb = hexToRgb(THEME_COLORS.primary)
  pdf.setFontSize(24)
  pdf.setFont(fontName, 'bold')
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.text('無限可能卡-諮商師報告', pageWidth / 2, currentY, { align: 'center' })
  currentY += 8

  // 報告資訊欄位
  pdf.setFontSize(9)
  pdf.setFont(fontName, 'normal')
  pdf.setTextColor(80, 80, 80)
  
  // 從 examProcessStore 獲取資料
  const examSerial = examProcessStore?.report_id || '未提供'
  const examTargetName = examProcessStore?.report_name || '未設定'
  const examEmail = examProcessStore?.target_email || '未設定'
  const reportDate = new Date().toLocaleDateString('zh-TW')

  // 左側欄位
  const leftColumnX = margin + 10
  const rightColumnX = margin + contentWidth / 2 + 10
  const lineSpacing = 5

  // 第一行：測驗序號（左側）、測驗發送信箱（右側）
  pdf.text(`測驗序號：${examSerial}`, leftColumnX, currentY)
  pdf.text(`測驗發送信箱：${examEmail}`, rightColumnX, currentY)

  // 第二行：測驗對象名稱（左側）、報告製表日期（右側）
  pdf.text(`測驗對象名稱：${examTargetName}`, leftColumnX, currentY + lineSpacing)
  pdf.text(`報告製表日期：${reportDate}`, rightColumnX, currentY + lineSpacing)

  currentY += 8

  // 繪製分隔線
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  pdf.setLineWidth(0.5)
  pdf.line(margin, currentY, margin + contentWidth, currentY)
  currentY += 10

  // ========== 2. 分析結果: 特質挑選 ==========
  if (pickResult) {
    currentY = addTraitSelectionTable(pdf, pickResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // ========== 3. 卡片挑選結果 ==========
  if (pickResult) {
    currentY = addCardSelectionTable(pdf, pickResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // ========== 4. 分析結果: 職業配對 ==========
  if (pairResult) {
    currentY = addProfessionTable(pdf, pairResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // ========== 5. 職業卡牌配對結果 ==========
  if (pairResult) {
    currentY = addProfessionCountTable(pdf, pairResult, margin, currentY, contentWidth, pageHeight, primaryRgb, fontName)
  }

  // ========== 6. 職業卡牌雷達圖 ==========
  if (radarChartImage) {
    // 檢查是否需要換頁
    if (currentY + 80 > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }

    pdf.setFontSize(18)
    pdf.setFont(fontName, 'bold')
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    
    // 繪製標題文字
    const titleText = '職業卡牌雷達圖'
    pdf.text(titleText, margin, currentY)
    
    // 計算標題文字寬度
    const titleWidth = pdf.getTextWidth(titleText)
    
    // 繪製雙底線
    const lineY1 = currentY + 2
    const lineY2 = currentY + 3
    const lineWidth = 0.3
    
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
    pdf.setLineWidth(lineWidth)
    pdf.line(margin, lineY1, margin + titleWidth, lineY1)
    pdf.line(margin, lineY2, margin + titleWidth, lineY2)
    
    currentY += 8

    // 引用區塊
    const sectionBgRgb = hexToRgb(THEME_COLORS.sectionBg)
    pdf.setFillColor(sectionBgRgb.r, sectionBgRgb.g, sectionBgRgb.b)
    const cornerRadius = 1.5
    pdf.roundedRect(margin, currentY, contentWidth, 8, cornerRadius, cornerRadius, 'F')
    pdf.setFontSize(12)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(0, 0, 0)
    pdf.text('預留文字區塊', margin + 5, currentY + 5)
    currentY += 12

    // 計算圖片尺寸（保持比例，最大寬度為內容寬度）
    const imgWidth = contentWidth
    const imgHeight = (imgWidth * 0.75) // 假設圖片比例為 4:3

    // 檢查是否需要換頁
    if (currentY + imgHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }

    try {
      pdf.addImage(radarChartImage, 'PNG', margin, currentY, imgWidth, imgHeight)
      currentY += imgHeight + 10
    } catch (error) {
      console.error('添加圖片失敗:', error)
      currentY += 10
    }
  }

  // ========== 7. 頁尾 ==========
  const totalPages = pdf.internal.pages.length - 1
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(10)
    pdf.setFont(fontName, 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(
      `第 ${i} 頁 / 共 ${totalPages} 頁`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // 下載 PDF
  pdf.save(filename)
}

/**
 * 生成報告（主要入口函數）
 * 
 * @param {Object} options - 報告選項
 * @param {string} [options.type='customer'] - 報告類型：'customer', 'counselor', 'full'
 * @param {boolean} [options.preview=false] - 是否返回 HTML 預覽
 * @param {Object} options.examProcessStore - examProcess store 實例
 * @param {string} [options.radarChartImage] - 雷達圖 base64 圖片
 * @param {Object} [options.config] - 額外配置選項
 * @param {string} [options.config.filename] - PDF 檔案名稱
 * @returns {Promise<string|void>} 當 preview=true 時返回 HTML，否則生成 PDF
 */
export async function generateReport(options = {}) {
  const {
    type = 'customer',
    preview = false,
    examProcessStore,
    radarChartImage = null,
    config = {}
  } = options

  if (!examProcessStore) {
    throw new Error('examProcessStore 是必需的參數')
  }

  // 根據類型生成報告
  switch (type) {
    case 'customer': {
      // 從 store 獲取數據
      const hCode = examProcessStore.calculate_pick?.total?.h_code
      const pairResult = examProcessStore.calculatePairResult

      if (!hCode) {
        throw new Error('無法獲取測驗結果數據，請確保已完成測驗')
      }

      // 獲取最終結果
      const finalResult = getFinalResult(hCode)

      const reportData = {
        finalResult,
        pairResult,
        radarChartImage
      }

      if (preview) {
        return generateCustomerReportHTML(reportData)
      } else {
        await generateCustomerReportPDF({ ...reportData, examProcessStore, config })
      }
      break
    }

    case 'counselor': {
      // 從 store 獲取數據
      const pickResult = examProcessStore.calculatePickResult
      const pairResult = examProcessStore.calculatePairResult

      if (!pickResult || !pairResult) {
        throw new Error('無法獲取測驗結果數據，請確保已完成測驗')
      }

      const reportData = {
        pickResult,
        pairResult,
        radarChartImage
      }

      await generateCounselorReportPDF({ ...reportData, examProcessStore, config })
      break
    }

    case 'full':
      // TODO: 實作 full 版面配置
      throw new Error('full 版面配置尚未實作')

    default:
      throw new Error(`不支援的報告類型: ${type}`)
  }
}
