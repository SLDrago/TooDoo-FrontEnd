import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECURE_KEY;

/**
 * Encrypts a value using AES encryption.
 * @param {string} value - The value to encrypt.
 * @returns {string} - The encrypted value.
 */
export const encrypt = (value) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

/**
 * Decrypts an AES-encrypted value.
 * @param {string} encryptedValue - The encrypted value to decrypt.
 * @returns {string} - The decrypted value.
 */
export const decrypt = (encryptedValue) => {
  return CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
