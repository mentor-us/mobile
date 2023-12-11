import DeviceInfo from "react-native-device-info";
import {PermissionStrategy} from "./interfaces";
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  openSettings,
  request,
  requestNotifications,
} from "react-native-permissions";
import {Alert} from "react-native";
import log from "../Logger";

/**
 * AndroidPermissionStrategy
 * @description Android permission strategy. Handles all Android permissions
 * @export
 * @class AndroidPermissionStrategy
 * @implements {PermissionStrategy}
 */
export class AndroidPermissionStrategy implements PermissionStrategy {
  constructor() {
    log.info("@AndroidPermissionStrategy: constructor");
  }

  async handleReadStoragePermission(): Promise<boolean> {
    try {
      const apiLevel = await DeviceInfo.getApiLevel();

      // API < 33: Request ANDROID.READ_MEDIA_VIDEO permission
      // API >= 33: Request ANDROID.READ_EXTERNAL_STORAGE permission
      const result = await check(
        apiLevel < 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );

      if (result === RESULTS.GRANTED) {
        return true;
      }

      // API < 33: Request ANDROID.READ_EXTERNAL_STORAGE permission
      // API >= 33: Request ANDROID.READ_MEDIA_IMAGES permission
      let mediaRequestResult = await request(
        apiLevel < 33
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );

      const isMediaRequestGranted = mediaRequestResult === RESULTS.GRANTED;
      const isMediaRequestLimited = mediaRequestResult === RESULTS.LIMITED;

      if (apiLevel >= 33 && (isMediaRequestGranted || isMediaRequestLimited)) {
        // Request new ANDROID.READ_MEDIA_VIDEO permission
        mediaRequestResult = await request(
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        );
      }

      // If permission is not granted, show alert
      if (!isMediaRequestGranted && !isMediaRequestLimited) {
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

      return isMediaRequestGranted || isMediaRequestLimited;
    } catch (error) {
      log.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async handleWriteStoragePermission(): Promise<boolean> {
    try {
      const requestResult = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        {
          title: "Write Storage Permission Required",
          message: "Application needs access to your storage to download File",
        },
      );

      if (requestResult === RESULTS.GRANTED) {
        return true;
      } else {
        // If permission denied then show alert
        Alert.alert("Error", "Write Storage Permission Not Granted");
      }
    } catch (error) {
      log.error(AndroidPermissionStrategy.name, (error as Error).message);
      // To handle permission related exception
      Alert.alert("Write External Storage", (error as Error).message);
    }

    return false;
  }

  async handleUseCameraPermission(): Promise<boolean> {
    try {
      // Check camera permission
      const checkCameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (checkCameraResult === RESULTS.GRANTED) {
        return true;
      }

      // Request camera permission if not granted
      const requestCameraResult = await request(PERMISSIONS.ANDROID.CAMERA);

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
      log.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async handleNotificationPermission(): Promise<boolean> {
    try {
      /// Android
      const permission = await requestNotifications([]);
      return (
        permission.status === RESULTS.GRANTED ||
        permission.status === RESULTS.LIMITED
      );
    } catch (error) {
      log.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async checkPermissionNotification(): Promise<boolean> {
    try {
      const permission = await checkNotifications();
      return (
        permission.status === RESULTS.GRANTED ||
        permission.status === RESULTS.LIMITED
      );
    } catch (error) {
      log.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }
}
