import {Image} from "react-native";

export default class ImageCacheHelper {
  private static _singleton: ImageCacheHelper | undefined;

  private imagesCache: {[key: string]: Caching.ImageItem} = {};

  static get instance() {
    if (this._singleton) {
      return this._singleton;
    }

    this._singleton = new ImageCacheHelper();

    return this._singleton;
  }

  async loadImage(url: string) {
    if (this.imagesCache[url]) {
      return this.imagesCache[url];
    }

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
        return Promise.reject("Wrong image url");
      }

      this.imagesCache[url] = itemData;

      return this.imagesCache[url];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async saveVideo(data: Caching.ImageItem) {
    this.imagesCache[data.uri] = data;
  }

  getItem(url: string): Caching.ImageItem | undefined {
    return this.imagesCache[url];
  }

  /**Clear all images cached */
  clearCache() {
    this.imagesCache = {};
  }
}
