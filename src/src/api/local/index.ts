import {StorageKey} from "~/constants/AppKey";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthApi = {
  saveToken: async (token: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(StorageKey.token, token);
      return true;
    } catch (error) {
      console.log("@ERROR saveToken FAILED");
      return false;
    }
  },

  getToken: async (): Promise<string> => {
    try {
      const token = await AsyncStorage.getItem(StorageKey.token);
      if (token) {
        return token;
      }
      return "";
    } catch (error) {
      return "";
    }
  },

  saveRefreshToken: async (refreshToken: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(StorageKey.refreshToken, refreshToken);
      return true;
    } catch (error) {
      console.log("@ERROR saveRefreshToken FAILED");
      return false;
    }
  },

  getRefreshToken: async (): Promise<string> => {
    try {
      const token = await AsyncStorage.getItem(StorageKey.refreshToken);
      if (token) {
        return token;
      }
      return "";
    } catch (error) {
      return "";
    }
  },

  getAllKeys: async () => {
    try {
      const data = await AsyncStorage.getAllKeys();
      data.forEach(async item => {
        const value = await AsyncStorage.getItem(item);
      });
    } catch (error) {}
  },
};
