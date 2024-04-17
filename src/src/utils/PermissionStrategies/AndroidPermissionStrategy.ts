import DeviceInfo from "react-native-device-info";
import { PermissionStrategy } from "./interfaces";
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  openSettings,
  request,
  requestNotifications,
} from "react-native-permissions";
import { Alert } from "react-native";
import LOG from "../Logger";

/**
 * AndroidPermissionStrategy
 * @description Android permission strategy. Handles all Android permissions
 * @export
 * @class AndroidPermissionStrategy
 * @implements {PermissionStrategy}
 */
export class AndroidPermissionStrategy implements PermissionStrategy {
  constructor() {
    LOG.debug("@AndroidPermissionStrategy: constructor");
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
          "Hình ảnh",
          "Ứng dụng cần quyền truy cập vào hình ảnh của thiết bị của bạn. Mở cài đặt và cho phép quyền truy cập hình ảnh.",
          [
            { onPress: () => openSettings(), text: "Mở cài đặt" },
            { onPress: () => {}, text: "Huỷ" },
          ],
          {
            cancelable: true,
          },
        );
      }

      return isMediaRequestGranted || isMediaRequestLimited;
    } catch (error) {
      LOG.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }

  async handleWriteStoragePermission(): Promise<boolean> {
    try {
      // Check write storage permission
      const checkWriteStorageResult = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );

      switch (checkWriteStorageResult) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          break;
        case RESULTS.LIMITED:
          break;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          await openSettings();
          break;
      }

      const requestResult = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        {
          title: "Quyền bộ nhớ",
          message:
            "Ứng dụng cần quyền truy cập vào bộ nhớ của thiết bị của bạn để lưu trữ dữ liệu. Bạn có muốn cho phép không?",
          buttonPositive: "Cho phép",
          buttonNegative: "Từ chối",
        },
      );
      switch (requestResult) {
        case RESULTS.GRANTED:
          return true;
        default:
          break;
      }

      // If permission denied then show alert
      Alert.alert("Lỗi", "Ứng dụng không có quyền truy cập bộ nhớ", [
        {
          text: "Mở cài đặt",
          onPress: () => {
            openSettings();
          },
        },
        { onPress: () => {}, text: "Huỷ" },
      ]);
    } catch (error) {
      LOG.error(AndroidPermissionStrategy.name, (error as Error).message);
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
          "Máy ảnh",
          "Ứng dụng cần quyền truy cập vào máy ảnh của thiết bị của bạn để chức năng chụp ảnh. Mở cài đặt và cho phép quyền truy cập máy ảnh.",
          [
            { onPress: () => openSettings(), text: "Mở cài đặt" },
            { onPress: () => {}, text: "Huỷ" },
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
      LOG.error(AndroidPermissionStrategy.name, (error as Error).message);
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
      LOG.error(AndroidPermissionStrategy.name, (error as Error).message);
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
      LOG.error(AndroidPermissionStrategy.name, (error as Error).message);
      return false;
    }
  }
}
