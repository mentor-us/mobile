// import SInfo from "react-native-sensitive-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKey } from "~/constants/AppKey";

export const SecureStore = {
  async saveItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getItem(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? "";
    } catch (error) {
      return "";
    }
  },

  async deleteItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  },

  /* Extend functions */
  async saveToken(token: string): Promise<boolean> {
    return await SecureStore.saveItem(StorageKey.token, token);
  },

  async getToken(): Promise<string> {
    return await SecureStore.getItem(StorageKey.token);
  },

  async removeToken(): Promise<boolean> {
    return await SecureStore.deleteItem(StorageKey.token);
  },

  async saveRefreshToken(refreshToken: string): Promise<boolean> {
    return await SecureStore.saveItem(StorageKey.refreshToken, refreshToken);
  },

  async getRefreshToken(): Promise<string> {
    return await SecureStore.getItem(StorageKey.refreshToken);
  },
  /* Extend functions */
};
