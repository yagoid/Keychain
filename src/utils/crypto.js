import CryptoJS from "crypto-js";

export const generateDerivedKey = (privateKey, salt) => {
    return CryptoJS.PBKDF2(privateKey, salt, { keySize: 512 / 32, iterations: 1000 });
};

export const encryptMessage = (messageToEncrypt, key, iv) => {
    return CryptoJS.AES.encrypt(messageToEncrypt, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString();
};

export const decryptMessage = (encryptedMessage, key, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const hashWithSHA3 = (data) => {
    return CryptoJS.SHA3(data).toString();
};

export const generateEncryptionKey = () => {
    // Genera una clave de cifrado de 256 bits (32 bytes) utilizando un generador de números aleatorios criptográficamente seguro (CSPRNG)
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
};