import CryptoJS from 'crypto-js';
import { config } from './config';

export const storage = {
  setItem(key: string, value: any) {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, config.secrate_key).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  },
  
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const decrypted = CryptoJS.AES.decrypt(item, config.secrate_key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (e) {
      return null;
    }
  },
  
  removeItem(key: string) {
    localStorage.removeItem(key);
  }
};
