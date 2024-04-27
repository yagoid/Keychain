import CryptoJS from "crypto-js";

export const generateDerivedKey = (privateKey, salt) => {
    return CryptoJS.PBKDF2(privateKey, salt, { keySize: 512 / 32, iterations: 1000 });
};

export const encryptMessage = (messageToEncrypt, key, iv) => {
    return CryptoJS.AES.encrypt(messageToEncrypt, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
};

export const decryptMessage = (encryptedMessage, key, iv) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashWithSHA3 = (data) => {
    return CryptoJS.SHA3(data).toString();
};