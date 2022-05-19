import * as CryptoJS from 'crypto-js';
var key = CryptoJS.enc.Utf8.parse("bWFaeHB9ZA==WNST");

/**
 * 加密（依赖aes.js）
 * @param word 加密的字符串
 * @returns {*}
 */
export function encryptAES(word) {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}

/**
 * 解密
 * @param encrypted 解密的字符串 
 * @returns {*}
 */
export function decryptAES(encrypted) {
    let dec = CryptoJS.AES.decrypt(encrypted, key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return CryptoJS.enc.Utf8.stringify(dec).toString();
}