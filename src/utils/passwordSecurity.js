import { TEXTS } from "../assets/locales/texts.js";

export const  checkPasswordStrength = (password) => {
    const minLength = 8;
    const minUppercase = 1;
    const minLowercase = 1;
    const minDigits = 1;
    const minSpecialChars = 1;
    const specialChars = '!@#$%^&*()-_=+;';
  
    // Verificar longitud mínima
    if (password.length < minLength) {
      return TEXTS.passwordMustContain.en + minLength + TEXTS.characters.en;
    }
  
    // Verificar letras mayúsculas
    if (password.match(/[A-Z]/g) === null || password.match(/[A-Z]/g).length < minUppercase) {
      return TEXTS.passwordMustContain.en + minUppercase + TEXTS.capitalLetter.en;
    }
  
    // Verificar letras minúsculas
    if (password.match(/[a-z]/g) === null || password.match(/[a-z]/g).length < minLowercase) {
      return TEXTS.passwordMustContain.en + minLowercase + TEXTS.lowercaseLetter.en;
    }
  
    // Verificar dígitos
    if (password.match(/[0-9]/g) === null || password.match(/[0-9]/g).length < minDigits) {
      return TEXTS.passwordMustContain.en + minDigits + TEXTS.digit.en;
    }
  
    // Verificar caracteres especiales
    const specialCharsCount = Array.from(password).filter(char => specialChars.includes(char)).length;
    if (specialCharsCount < minSpecialChars) {
      return TEXTS.passwordMustContain.en + minSpecialChars + TEXTS.specialCharacter.en;
    }
  
    // La contraseña cumple con todos los criterios de seguridad
    return true;
    // return TEXTS.passwordIsSecure.en;
}; 