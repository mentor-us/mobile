import SInfo from "react-native-sensitive-info";
import {StorageKey} from "~/constants/AppKey";
import LOG from "~/utils/Logger";

const secureStoreOptions = {
  sharedPreferencesName: StorageKey.sharedPreferencesName,
  keychainService: StorageKey.keychainService,
};

export const SecureStore = {
  async saveItem(key: string, value: string): Promise<boolean> {
    try {
      await SInfo.setItem(key, value, secureStoreOptions);
      LOG.debug(`@SecureStore: saveItem: ${key} - ${value}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getItem(key: string): Promise<string> {
    try {
      const value = await SInfo.getItem(key, secureStoreOptions);
      LOG.debug(`@SecureStore: getItem: ${key} - ${value}`);
      return value;
    } catch (error) {
      return "";
    }
  },

  async deleteItem(key: string): Promise<boolean> {
    try {
      await SInfo.deleteItem(key, secureStoreOptions);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getAllKeys() {
    try {
      return await SInfo.getAllItems(secureStoreOptions);
    } catch (error) {
      return [];
    }
  },

  /* Extend functions */
  async saveToken(token: string): Promise<boolean> {
    return await SecureStore.saveItem(StorageKey.token, token);
  },

  async getToken(): Promise<string> {
    return await SecureStore.getItem(StorageKey.token);
  },

  async saveRefreshToken(refreshToken: string): Promise<boolean> {
    return await SecureStore.saveItem(StorageKey.refreshToken, refreshToken);
  },

  async getRefreshToken(): Promise<string> {
    return await SecureStore.getItem(StorageKey.refreshToken);
  },
  /* Extend functions */
};
