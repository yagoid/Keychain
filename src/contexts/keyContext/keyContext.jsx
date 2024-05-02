import React, { useContext, useState, useEffect } from "react";
import { encryptMessage, decryptMessage } from "../../utils/crypto";
import CryptoJS from "crypto-js";

const KeyContext = React.createContext();

export function useKey() {
  return useContext(KeyContext);
}

export function KeyProvider({ children }) {
  const [encryptionKey, setEncryptionKey] = useState("");
  const [contextPrivateKey, setContextPrivateKey] = useState("");

  useEffect(() => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      console.log("privateKey...", contextPrivateKey);
    }
  }, [contextPrivateKey]);

  // useEffect(() => {
  //   const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
  //   console.log("desmontando componente...");
  //   console.log("Primer encryptionKey:", encryptionKey);
  //   setDefaultEncryptKey(defaultEncryptionKey);
  //   console.log("Último encryptionKey:", encryptionKey);
  // }, []);

  function setDefaultEncryptKey(newEncryptionKey) {
    // Verificar si hay una clave privada guardada en sessionStorage
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey) {
      // Desencriptar la clave privada
      const jsonDecryptedPrivateKey = decryptMessage(
        storedPrivateKey,
        encryptionKey,
        // "yago",
        CryptoJS.enc.Hex.parse("iv")
      );

      console.log("encryptionKey:", encryptionKey);

      console.log("desencriptada json:", jsonDecryptedPrivateKey);
      const parseDecryptedPrivateKey = JSON.parse(jsonDecryptedPrivateKey);
      const decryptedPrivateKey = parseDecryptedPrivateKey.messageToEncrypt;

      console.log("desencriptada:", decryptedPrivateKey);

      // Encriptar la clave privada con la nueva clave de encriptado
      const encryptedMessage = encryptMessage(
        decryptedPrivateKey,
        newEncryptionKey,
        // "yago",
        CryptoJS.enc.Hex.parse("iv")
      );
      // Guardar la clave privada en sessionStorage
      //   sessionStorage.setItem("privateKey", encryptedMessage);
      //   console.log("encriptada:", encryptedMessage);

      setDefaultEncryptedPrivateKey(encryptedMessage);
    }
  }

  //   useEffect(() => {
  //     const intervalId = setInterval(() => {
  //       const newEncryptionKey = generateEncryptionKey();
  //       changeEncryptKey(newEncryptionKey);
  //     }, 20000); // Generar una nueva clave cada minuto
  //     return () => {
  //       const newEncryptionKey = hashWithSHA3(currentUser.uid);
  //       changeEncryptKey(newEncryptionKey);
  //       clearInterval(intervalId);
  //     };
  //   }, []);

  function changeEncryptKey(newEncryptionKey) {
    // Verificar si hay una clave privada guardada en sessionStorage al cargar el componente
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey) {
      // console.log("sessionStorage:", storedPrivateKey);
      // console.log("encryptionKey:", encryptionKey);

      // Desencriptar la clave privada
      const jsonDecryptedPrivateKey = decryptMessage(
        storedPrivateKey,
        encryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );

      const parseDecryptedPrivateKey = JSON.parse(jsonDecryptedPrivateKey);
      const decryptedPrivateKey = parseDecryptedPrivateKey.messageToEncrypt;
      console.log(decryptedPrivateKey);

      console.log("desencriptada:", decryptedPrivateKey);

      // Encriptar la clave privada para guardarla
      const encryptedMessage = encryptMessage(
        decryptedPrivateKey,
        newEncryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );
      // Guardar la clave privada en sessionStorage
      // sessionStorage.setItem("privateKey", encryptedMessage);

      setEncryptionKey(newEncryptionKey);
    }
  }

  const value = {
    contextPrivateKey,
    setContextPrivateKey,
  };

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
}
