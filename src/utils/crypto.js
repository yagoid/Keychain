import CryptoJS from "crypto-js";

export const generateDerivedKey = (privateKey, salt) => {
    return CryptoJS.PBKDF2(privateKey, salt, { keySize: 512 / 32, iterations: 1000 }).toString(CryptoJS.enc.Hex);
};

export const encryptPrivateKey = (messageToEncrypt, key) => {
    return CryptoJS.AES.encrypt(messageToEncrypt, key).toString();
};

export const decryptPrivateKey = (encryptedMessage, key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashWithSHA3 = (data) => {
    return CryptoJS.SHA3(data).toString();
};