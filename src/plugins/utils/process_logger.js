// process_logger.js

// 用於存放日誌的變數
let logs = [];

let processType = 'card'

/**
 * 添加日誌
 * @param {Object} log - 日誌對象
 * @param {string} log.action - 日誌行為
 * @param {Object} log.card - 卡片信息
 * @param {string} log.type - 卡片類型
 * @param {number} log.remainingSeconds - 剩餘秒數
 * @param {Object} [log.additional] - 附加信息
 */
export const addLog = ({ action, card, remainingSeconds, additional = {} }) => {
    const logEntry = {
        seq: logs.length + 1,
        action,
        type: processType,
        card,
        remainingSeconds,
        timestamp: new Date().toISOString(),
        additional
    };
    logs.push(logEntry);
};

/**
 * 獲取所有日誌
 * @returns {Array} - 返回日誌數組
 */
export const getLogs = () => {
    return logs;
};

/**
 * 設定處理類型
 * @param {string} type - 處理類型
 */
export const setProcessType = (type) => {
    processType = type;
};

/**
 * 清空日誌
 */
export const clearLogs = () => {
    logs = [];
}; 