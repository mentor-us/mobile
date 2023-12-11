import {Alert, Platform} from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  check,
  checkNotifications,
  openSettings,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
} from "react-native-permissions";
import notifee, {AuthorizationStatus} from "@notifee/react-native";
import LOG from "./Logger";

/**
 * @deprecated
 * Will be replaced with `Permission`
 */
export const handleReadStoragePermission = async (): Promise<boolean> => {
  try {
    const apiLevel = await DeviceInfo.getApiLevel();

    const result = await check(
      Platform.OS === "android"
        ? apiLevel < 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      let mediaGranted = await request(
        Platform.OS === "android"
          ? apiLevel < 33
            ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.IOS.PHOTO_LIBRARY,
      );

      if (
        Platform.OS === "android" &&
        apiLevel >= 33 &&
        (mediaGranted === "limited" || mediaGranted === "granted")
      ) {
        mediaGranted = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
      }

      if (
        mediaGranted !== RESULTS.GRANTED &&
        mediaGranted !== RESULTS.LIMITED
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
      return mediaGranted === "granted" || mediaGranted === "limited";
    }
  } catch (error) {
    console.log("Error on handle storage permission");
    return false;
  }
};

/**
 * @deprecated
 * Will be replaced with `Permission`
 */
export const handleWriteStoragePermission = async (): Promise<boolean> => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === "ios") {
    return true;
  } else {
    try {
      const granted = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "Application needs access to your storage to download File",
        },
      );
      if (granted == "granted") {
        console.log("@DUKE: Storage Permission Granted.");
        return true;
      } else {
        // If permission denied then show alert
        Alert.alert("Error", "Storage Permission Not Granted");
      }
    } catch (err) {
      // To handle permission related exception
    }
  }

  return false;
};

/**
 * @deprecated
 * Will be replaced with `Permission`
 */
export const handleUseCameraPermission = async (): Promise<boolean> => {
  try {
    const result = await check(
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      const granted = await request(
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );

      if (granted !== RESULTS.GRANTED && granted !== RESULTS.LIMITED) {
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

      return granted === RESULTS.GRANTED || granted === RESULTS.LIMITED;
    }
  } catch (error) {
    return false;
  }
};

/**
 * @deprecated
 * Will be replaced with `Permission`
 */
export const handleNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "ios") {
      const notiSetting = await notifee.requestPermission();

      const isHasPermission = [
        AuthorizationStatus.AUTHORIZED,
        AuthorizationStatus.PROVISIONAL,
      ].includes(notiSetting.ios.authorizationStatus);

      return isHasPermission;
    }

    /// Android
    const permission = await requestNotifications([]);
    return permission.status === "granted" || permission.status === "limited";
  } catch (error) {
    LOG.error("@handleNotificationPermission", error);
    return false;
  }
};

/**
 * @deprecated
 * Will be replaced with `Permission`
 */
export const checkPermissionNotification = async () => {
  try {
    if (Platform.OS === "ios") {
      const notiSetting = await notifee.getNotificationSettings();

      const isHasPermission = [
        AuthorizationStatus.AUTHORIZED,
        AuthorizationStatus.PROVISIONAL,
      ].includes(notiSetting.ios.authorizationStatus);

      return isHasPermission;
    }

    /// Android
    const permission = await checkNotifications();

    return permission.status === "granted" || permission.status === "limited";
  } catch (error) {
    console.log("Error on handleNotificationPermission: ", error);
    return false;
  }
};
