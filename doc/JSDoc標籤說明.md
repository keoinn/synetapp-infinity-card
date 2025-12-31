# JSDoc 標籤說明文件

本文檔說明 JSDoc 標籤的使用方式，包含標準標籤和專案自定義標籤。

## 目錄

- [標準 JSDoc 標籤](#標準-jsdoc-標籤)
- [Vue 專案自定義標籤](#vue-專案自定義標籤)
- [完整範例](#完整範例)

---

## 標準 JSDoc 標籤

### 基本描述標籤

#### `@description` 或直接描述
組件或函數的主要描述。

```javascript
/**
 * 這是一個範例組件
 * 也可以直接在第一行寫描述，不需要 @description
 */
```

#### `@summary`
簡短摘要，通常用於表格或列表顯示。

```javascript
/**
 * @summary 計算兩個數字的總和
 */
function add(a, b) {
  return a + b
}
```

---

### 類型標籤

#### `@type {Type}`
指定變數的類型。

```javascript
/**
 * @type {string}
 */
const userName = 'John'

/**
 * @type {number|string}
 */
let id

/**
 * @type {Array<string>}
 */
const items = []
```

#### `@param {Type} name - 描述`
函數參數說明。

```javascript
/**
 * 計算總價
 * @param {number} price - 單價
 * @param {number} quantity - 數量
 * @param {boolean} [includeTax=false] - 是否包含稅金（可選參數）
 * @returns {number} 總價
 */
function calculateTotal(price, quantity, includeTax = false) {
  // ...
}
```

#### `@returns` 或 `@return {Type} - 描述`
函數返回值說明。

```javascript
/**
 * 獲取用戶資訊
 * @param {string} userId - 用戶 ID
 * @returns {Promise<Object>} 用戶資訊物件
 * @returns {Promise<Object>} user.name - 用戶名稱
 * @returns {Promise<Object>} user.email - 用戶郵箱
 */
async function getUser(userId) {
  // ...
}
```

#### `@typedef {Type} TypeName`
定義自定義類型。

```javascript
/**
 * @typedef {Object} UserConfig
 * @property {string} name - 用戶名稱
 * @property {number} age - 年齡
 * @property {boolean} [isActive=true] - 是否啟用
 */

/**
 * @param {UserConfig} config - 用戶配置
 */
function createUser(config) {
  // ...
}
```

---

### 類別和模組標籤

#### `@class` 或 `@constructor`
標記類別或建構函數。

```javascript
/**
 * 用戶管理類別
 * @class
 */
class UserManager {
  /**
   * @constructor
   * @param {string} name - 用戶名稱
   */
  constructor(name) {
    this.name = name
  }
}
```

#### `@module`
標記模組。

```javascript
/**
 * 工具函數模組
 * @module utils
 */
```

#### `@namespace`
標記命名空間。

```javascript
/**
 * API 命名空間
 * @namespace API
 */
```

---

### 組件標籤（Vue 專案常用）

#### `@component ComponentName`
標記 Vue 組件。

```javascript
/**
 * 用戶卡片組件
 * @component UserCard
 */
```

---

### 範例和用法標籤

#### `@example`
提供使用範例。

```javascript
/**
 * 格式化日期
 * @param {Date} date - 日期物件
 * @returns {string} 格式化後的日期字串
 * 
 * @example
 * formatDate(new Date())
 * // => "2024-01-01"
 * 
 * @example
 * // 使用自定義格式
 * formatDate(new Date(), 'YYYY/MM/DD')
 * // => "2024/01/01"
 */
function formatDate(date) {
  // ...
}
```

#### `@usage`
使用說明（非標準，但常用）。

```javascript
/**
 * @usage
 * import { formatDate } from '@/utils/date'
 * const formatted = formatDate(new Date())
 */
```

---

### 引用和關聯標籤

#### `@see`
引用相關文檔或代碼。

```javascript
/**
 * 計算折扣價格
 * @see {@link calculateTotal} 計算總價的相關函數
 * @see https://example.com/docs/pricing 定價文檔
 */
function calculateDiscount(price) {
  // ...
}
```

#### `@link`
創建內部連結。

```javascript
/**
 * 使用 {@link UserManager} 來管理用戶
 */
```

---

### 修飾符標籤

#### `@public` / `@private` / `@protected`
訪問權限。

```javascript
/**
 * 公開方法
 * @public
 */
function publicMethod() {}

/**
 * 私有方法
 * @private
 */
function privateMethod() {}

/**
 * 受保護的方法
 * @protected
 */
function protectedMethod() {}
```

#### `@readonly`
標記為只讀。

```javascript
/**
 * 應用程式版本號
 * @readonly
 * @type {string}
 */
const VERSION = '1.0.0'
```

#### `@static`
標記為靜態方法或屬性。

```javascript
class MathUtils {
  /**
   * 計算圓周率
   * @static
   * @returns {number} 圓周率值
   */
  static getPi() {
    return 3.14159
  }
}
```

#### `@abstract`
標記為抽象方法。

```javascript
/**
 * 抽象基類
 * @abstract
 */
class BaseClass {
  /**
   * 抽象方法，必須由子類實現
   * @abstract
   */
  render() {
    throw new Error('必須實現 render 方法')
  }
}
```

#### `@override`
標記覆寫父類方法。

```javascript
class ChildClass extends BaseClass {
  /**
   * @override
   */
  render() {
    // 覆寫父類方法
  }
}
```

---

### 異步和 Promise 標籤

#### `@async`
標記異步函數。

```javascript
/**
 * 獲取數據
 * @async
 * @param {string} url - API 網址
 * @returns {Promise<Object>} 數據物件
 */
async function fetchData(url) {
  // ...
}
```

#### `@throws` 或 `@exception`
說明可能拋出的異常。

```javascript
/**
 * 解析 JSON 字串
 * @param {string} jsonString - JSON 字串
 * @returns {Object} 解析後的物件
 * @throws {SyntaxError} 當 JSON 格式錯誤時拋出
 */
function parseJSON(jsonString) {
  return JSON.parse(jsonString)
}
```

---

### 版本和作者標籤

#### `@version`
版本號。

```javascript
/**
 * @version 1.2.3
 */
```

#### `@since`
標記從哪個版本開始。

```javascript
/**
 * @since 1.0.0
 */
```

#### `@author`
作者資訊。

```javascript
/**
 * @author John Doe <john@example.com>
 */
```

#### `@copyright`
版權資訊。

```javascript
/**
 * @copyright 2024 Company Name
 */
```

#### `@license`
授權資訊。

```javascript
/**
 * @license MIT
 */
```

---

### 生命週期和事件標籤

#### `@fires` 或 `@emits`
標記觸發的事件。

```javascript
/**
 * 發送消息
 * @fires UserMessage#messageSent
 * @param {string} message - 消息內容
 */
function sendMessage(message) {
  // 觸發 messageSent 事件
}
```

#### `@listens`
標記監聽的事件。

```javascript
/**
 * 處理用戶點擊事件
 * @listens UserCard#click
 */
function handleClick() {
  // ...
}
```

---

### 其他標籤

#### `@deprecated`
標記已棄用。

```javascript
/**
 * @deprecated 請使用新的 calculateTotalV2 函數
 * @see calculateTotalV2
 */
function calculateTotal() {
  // ...
}
```

#### `@todo`
待辦事項。

```javascript
/**
 * @todo 優化性能
 * @todo 添加錯誤處理
 */
```

#### `@ignore`
忽略此項目，不生成文檔。

```javascript
/**
 * @ignore
 */
function internalFunction() {
  // ...
}
```

---

## Vue 專案自定義標籤

這些標籤是專案中常用的自定義標籤，用於更好地描述 Vue 組件和專案結構。

### `@component ComponentName`
標記 Vue 組件名稱。

```javascript
/**
 * 用戶卡片組件
 * @component UserCard
 */
```

### `@route /path/to/route`
標記路由路徑（用於頁面組件）。

```javascript
/**
 * 用戶設定頁面
 * @route /user/settings
 * @param {string} id - 用戶 ID（路由參數）
 */
```

### `@dependencies`
列出組件或函數的依賴項。

```javascript
/**
 * @dependencies
 * - @/stores/userStore - 用戶狀態管理
 * - axios - HTTP 請求庫
 * - vue-router - 路由管理
 */
```

### `@usedBy`
標記此組件被哪些組件或頁面使用。

```javascript
/**
 * @usedBy
 * - @/pages/user/index.vue - 用戶列表頁面
 * - @/components/UserProfile.vue - 用戶資料組件
 */
```

### `@usedIn`
標記此組件在哪些地方被使用（與 @usedBy 類似）。

```javascript
/**
 * @usedIn
 * - @/pages/user/index.vue
 */
```

### `@features`
列出組件的主要功能特性。

```javascript
/**
 * @features
 * - 響應式設計，支援移動端和桌面端
 * - 支援深色模式
 * - 自動保存表單數據
 * - 表單驗證和錯誤提示
 */
```

### `@lifecycle`
描述 Vue 組件的生命週期鉤子行為。

```javascript
/**
 * @lifecycle
 * - onMounted: 載入用戶數據並初始化圖表
 * - onUnmounted: 清理定時器和事件監聽器
 * - watch(userId): 當用戶 ID 改變時重新載入數據
 */
```

### `@props`
描述組件的 props（Vue 3）。

```javascript
/**
 * @props
 * @prop {string} title - 卡片標題
 * @prop {number} [count=0] - 計數（可選，預設為 0）
 * @prop {Array<Object>} items - 項目列表
 */
```

### `@emits`
描述組件觸發的事件（Vue 3）。

```javascript
/**
 * @emits
 * @emit {string} update:title - 當標題更新時觸發
 * @emit {Object} item-clicked - 當項目被點擊時觸發，傳遞項目數據
 */
```

---

## 完整範例

### Vue 組件範例

```javascript
<script setup>
/**
 * 諮商師報告組件
 * 
 * 此組件提供一個全螢幕對話框，顯示完整的測驗結果統計報告，包括：
 * - 分析結果: 特質挑選：顯示各類型（goal, care, ce, cj, le, lj）的 RIASEC 類型百分比和荷倫碼
 * - 卡片挑選結果：顯示各類型的原始卡片計數（R, I, A, S, E, C）
 * - 分析結果: 職業配對：顯示各職業在「我在乎」、「我可以」、「我喜歡」三個維度的配對百分比
 * - 職業卡牌配對結果：顯示各職業配對的原始計數
 * - 職業卡牌雷達圖：使用 Chart.js 繪製三維度（我重視、我喜歡、我可以）的雷達圖，預設顯示最高分職業
 * 
 * @component ExamCounselorResult
 * 
 * @usedBy 
 * - @/pages/exam/[token].vue - 測驗項目一覽頁面（在頁面標題欄顯示諮商師報告按鈕）
 * 
 * @example
 * 使用方式：
 * <ExamCounselorResult />
 * 組件會自動從 examProcess store 讀取計算結果並顯示
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理（提供 calculatePickResult 和 calculatePairResult）
 * - chart.js - 圖表繪製庫（用於繪製雷達圖）
 * - vue - Vue 3 Composition API（onMounted, ref, watch, computed, nextTick）
 * 
 * @features
 * - 響應式對話框，高度為 90% 視窗高度
 * - 標籤頁切換顯示不同統計結果
 * - 自動計算並高亮顯示最高分職業（雷達圖預設顯示）
 * - 數據格式化：百分比顯示、長標題自動換行
 * - 顏色編碼：根據百分比區間顯示不同背景色（高/中高/中/低）
 * 
 * @lifecycle
 * - onMounted: 從 examProcess store 載入 pickResult 和 pairResult
 * - watch(dialogIsActive): 當對話框開啟時載入數據並繪製雷達圖（如果當前標籤為雷達圖）
 * - watch(currentTab): 當切換到雷達圖標籤時自動繪製圖表
 */
</script>
```

### Vue 頁面組件範例

```javascript
<script setup>
/**
 * 測驗項目一覽頁面
 * 
 * 此頁面顯示所有可用的測驗項目，包括：
 * - 進行測驗：顯示所有配置的卡片集合（care, ce, cj, le, lj, goal）
 * - 卡牌配對：當存在 goal 集合時，顯示配對測驗選項
 * 
 * @route /exam/[token]
 * @param {string} token - 加密的參與者 ID，需要解密後使用
 * 
 * @example
 * 訪問路徑：/exam/encrypted_token_here
 * token 會被解密為參與者 ID (pid)
 * 
 * @dependencies
 * - @/stores/examProcess - 測驗流程狀態管理
 * - @/components/exam/SingleExamPanel - 單一測驗面板組件
 * - @/components/result/ExamResultView - 測驗結果視圖
 * - @/components/result/ExamResultTextView - 測驗結果文字視圖
 * - @/plugins/utils/encryption - 加密工具（用於解密 token）
 * 
 * @lifecycle
 * - onMounted: 載入測驗報告數據
 */
</script>
```

### 工具函數範例

```javascript
/**
 * 格式化日期為指定格式
 * 
 * @param {Date} date - 要格式化的日期物件
 * @param {string} [format='YYYY-MM-DD'] - 日期格式（可選，預設為 YYYY-MM-DD）
 * @returns {string} 格式化後的日期字串
 * 
 * @example
 * formatDate(new Date())
 * // => "2024-01-01"
 * 
 * @example
 * formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss')
 * // => "2024/01/01 12:30:45"
 * 
 * @throws {TypeError} 當 date 不是有效的 Date 物件時拋出
 * 
 * @since 1.0.0
 * @author John Doe
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('date 必須是有效的 Date 物件')
  }
  // 實現邏輯...
}
```

### Store 範例

```javascript
/**
 * 測驗流程狀態管理 Store
 * 
 * 管理測驗過程中的所有狀態，包括：
 * - 卡片集合配置
 * - 測驗結果數據
 * - 計算結果（pickResult, pairResult）
 * 
 * @module stores/examProcess
 * 
 * @dependencies
 * - pinia - 狀態管理庫
 * - @/plugins/utils/requests/api/backend - 後端 API 請求工具
 * 
 * @features
 * - 計算卡片挑選結果（calculatePickResult）
 * - 計算職業配對結果（calculatePairResult）
 * - 從後端載入測驗報告數據（getReportBackend）
 * - 檢查 goal 集合是否存在（checkGoalSetExist）
 * 
 * @example
 * import { useExamProcessStore } from '@/stores/examProcess'
 * const examProcess = useExamProcessStore()
 * await examProcess.getReportBackend(pid)
 * const pickResult = examProcess.calculatePickResult()
 */
```

---

## 標籤使用建議

### 優先順序建議

1. **必須包含的標籤**：
   - 組件/函數描述
   - `@component`（Vue 組件）
   - `@param`（有參數時）
   - `@returns`（有返回值時）

2. **建議包含的標籤**：
   - `@example`（提供使用範例）
   - `@dependencies`（列出依賴）
   - `@usedBy`（組件被使用的地方）
   - `@features`（主要功能特性）
   - `@lifecycle`（Vue 組件生命週期）

3. **可選標籤**：
   - `@author`、`@version`、`@since`
   - `@throws`、`@deprecated`
   - `@todo`、`@see`

### 格式規範

1. **標籤順序**：建議按照以下順序排列
   ```
   描述
   @component / @module
   @route / @param
   @usedBy / @dependencies
   @example
   @features
   @lifecycle
   @returns
   @throws
   @see
   ```

2. **列表格式**：使用 `-` 或 `*` 來創建列表
   ```javascript
   /**
    * @dependencies
    * - item1 - 說明1
    * - item2 - 說明2
    */
   ```

3. **範例格式**：使用代碼塊展示範例
   ```javascript
   /**
    * @example
    * const result = myFunction(param1, param2)
    */
   ```

---

## 參考資源

- [JSDoc 官方文檔](https://jsdoc.app/)
- [JSDoc 標籤完整列表](https://jsdoc.app/index.html#block-tags)
- [Vue 3 文檔](https://vuejs.org/)

---

**最後更新**：2024-01-01

