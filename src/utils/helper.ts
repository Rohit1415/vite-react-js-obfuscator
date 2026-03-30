import CryptoJS from "crypto-js";
import { config } from "./config";

export const helper = {
  encryptData(data: any): string {
    try {
      const stringData = JSON.stringify(data);

      const key = CryptoJS.enc.Utf8.parse(config.secrate_key);
      const iv = CryptoJS.enc.Utf8.parse(config.iv);

      const encrypted = CryptoJS.AES.encrypt(stringData, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return encrypted.toString();
    } catch (err) {
      console.error("Encryption error:", err);
      return "";
    }
  },

  decryptData<T = any>(encryptedData: string): T | null {
    try {
      const key = CryptoJS.enc.Utf8.parse(config.secrate_key);
      const iv = CryptoJS.enc.Utf8.parse(config.iv);

      const bytes = CryptoJS.AES.decrypt(encryptedData, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedString);
    } catch (err) {
      console.error("Decryption error:", err);
      return null;
    }
  },
};
