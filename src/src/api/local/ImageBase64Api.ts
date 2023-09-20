import AsyncStorage from "@react-native-async-storage/async-storage";
import {Image} from "react-native";

const ImageBase64Api = {
  getImageContentType: async (url: string): Promise<string | undefined> => {
    try {
      const res = await fetch(url);
      return res.headers["map"]["content-type"];
    } catch (error) {
      console.log("@ERROR ImageBase64Api getImageExtension API: ", error);
      return undefined;
    }
  },

  getBase64String: async (url: string): Promise<string | undefined> => {
    try {
      const res = await fetch(url);
      const data = await res.blob();

      const fileReader = new FileReader();

      fileReader.readAsDataURL(data);

      const itemData = await new Promise<Caching.ImageItem>(
        (resolve, reject) => {
          fileReader.onloadend = function () {
            const base64String = fileReader.result as string;

            Image.getSize(
              base64String,
              (w, h) => {
                resolve({
                  size: {width: w, height: h},
                  uri: base64String,
                });
              },
              reject,
            );
          };
        },
      );

      if (!itemData?.size.height || !itemData?.size.width) {
        // return Promise.reject("Wrong image url");
        return undefined;
      }

      return itemData.uri;
    } catch (error) {
      return undefined;
      // return Promise.reject(error);
    }
  },

  get: async (url: string): Promise<string> => {
    try {
      // Get from local
      const value = await AsyncStorage.getItem(url);
      if (value) {
        return value;
      }
      // Get from url and Save to local
      const newValue = await ImageBase64Api.getBase64String(url);

      if (newValue) {
        if (true) {
          AsyncStorage.setItem(url, newValue);
          return newValue;
        }
      }
      return url;
    } catch (error) {
      console.log("@ERROR ImageBase64Api get API: ", error);
      return url;
    }
  },
};

export default ImageBase64Api;
