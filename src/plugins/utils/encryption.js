import CryptoJS from 'crypto-js';

// 定義密鑰
const secretKey = import.meta.env.VITE_SECRET_KEY;

/**
 * 加密函數
 * @param {string} plaintext - 要加密的明文
 * @returns {string} - 返回加密後的密文（16進制小寫字串）
 */
export const encrypt = (plaintext) => {
    if (typeof plaintext !== 'string') {
        throw new Error('Input must be a string');
    }
    const ciphertext = CryptoJS.AES.encrypt(plaintext, secretKey).toString();
    // 將密文轉換為 16 進制小寫字串
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(ciphertext));
};

/**
 * 解密函數
 * @param {string} hexCiphertext - 要解密的密文（16進制小寫字串）
 * @returns {string} - 返回解密後的明文
 */
export const decrypt = (hexCiphertext) => {
    // 將 16 進制小寫字串轉換為字元串
    const ciphertext = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(hexCiphertext));
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}; 