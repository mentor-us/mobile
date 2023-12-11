import notifee, {AuthorizationStatus} from "@notifee/react-native";
import {PermissionStrategy} from "./interfaces";
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from "react-native-permissions";
import {Alert} from "react-native";
import log from "../Logger";

/**
 * IOSPermissionStrategy
 * @description IOS permission strategy. Handles all IOS permissions
 * @export
 * @class IOSPermissionStrategy
 * @implements {PermissionStrategy}
 */
export class IOSPermissionStrategy implements PermissionStrategy {
  constructor() {
    log.info("@IOSPermissionStrategy: constructor");
  }

  async handleReadStoragePermission(): Promise<boolean> {
    try {
      let photoPermissionResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (photoPermissionResult === RESULTS.GRANTED) {
        return true;
      }

      photoPermissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const isPhotoPermissionResultGranted =
        photoPermissionResult === RESULTS.GRANTED;
      const isPhotoPermissionResultGrantedLimited =
        photoPermissionResult === RESULTS.LIMITED;
      if (
        !isPhotoPermissionResultGranted &&
        !isPhotoPermissionResultGrantedLimited
      ) {
        Alert.alert(
          "Allow Access to Your Photos",
          "This lets you share from your camera roll, and enables other features for photos. Go to Settings and tap on Photos",
          [
            {onPress: () => openSettings(), text: "Go to Settings"},
            {onPress: () => {}, text: "Not now"},
          ],
          {
            cancelable: true,
          },
        );
      }
      return (
        isPhotoPermissionResultGranted || isPhotoPermissionResultGrantedLimited
      );
    } catch (error) {
      log.error(IOSPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  handleWriteStoragePermission(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async handleUseCameraPermission(): Promise<boolean> {
    try {
      // Check camera permission
      const checkCameraResult = await request(PERMISSIONS.IOS.CAMERA);
      if (checkCameraResult === RESULTS.GRANTED) {
        return true;
      }

      // Request camera permission if not granted
      const requestCameraResult = await request(PERMISSIONS.IOS.CAMERA);

      if (
        requestCameraResult !== RESULTS.GRANTED &&
        requestCameraResult !== RESULTS.LIMITED
      ) {
        Alert.alert(
          "Allow Access to Your Camera",
          "This lets you share from your camera roll. Go to Settings and tap on Camera",
          [
            {onPress: () => openSettings(), text: "Go to Settings"},
            {onPress: () => {}, text: "Not now"},
          ],
          {
            cancelable: true,
          },
        );
      }

      return (
        requestCameraResult === RESULTS.GRANTED ||
        requestCameraResult === RESULTS.LIMITED
      );
    } catch (error) {
      log.error(IOSPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async handleNotificationPermission(): Promise<boolean> {
    try {
      const notiSetting = await notifee.requestPermission();

      const isHasPermission = [
        AuthorizationStatus.AUTHORIZED,
        AuthorizationStatus.PROVISIONAL,
      ].includes(notiSetting.ios.authorizationStatus);

      return isHasPermission;
    } catch (error) {
      console.log(IOSPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async checkPermissionNotification(): Promise<boolean> {
    try {
      const notiSetting = await notifee.getNotificationSettings();

      const isHasPermission = [
        AuthorizationStatus.AUTHORIZED,
        AuthorizationStatus.PROVISIONAL,
      ].includes(notiSetting.ios.authorizationStatus);

      return isHasPermission;
    } catch (error) {
      console.log(IOSPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }
}
