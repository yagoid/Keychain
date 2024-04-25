import CryptoJS from "crypto-js";

export const generateDerivedKey = (privateKey) => {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    return CryptoJS.PBKDF2(privateKey, salt, { keySize: 512 / 32, iterations: 1000 });
};

export const encryptPrivateKey = (password, derivedKey) => {
    return CryptoJS.AES.encrypt(password, derivedKey).toString();
};

export const decryptPrivateKey = (encryptedPassword, derivedKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, derivedKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashWithSHA3 = (data) => {
    return CryptoJS.SHA3(data).toString();
};