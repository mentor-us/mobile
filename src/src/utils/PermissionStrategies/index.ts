import {Platform} from "react-native";
import {PermissionStrategy} from "./interfaces";
import {IOSPermissionStrategy} from "./IOSPermissionStrategy";
import {AndroidPermissionStrategy} from "./AndroidPermissionStrategy";

/**
 * PermissionContext
 * @description Context for permission strategies. Will return the correct strategy based on the platform
 * @export
 * @class PermissionContext
 * @implements {PermissionStrategy}
 */
class PermissionContext implements PermissionStrategy {
  private strategy: PermissionStrategy;

  constructor() {
    this.strategy =
      Platform.OS === "ios"
        ? new IOSPermissionStrategy()
        : new AndroidPermissionStrategy();
  }

  handleReadStoragePermission(): Promise<boolean> {
    return this.strategy.handleReadStoragePermission();
  }
  handleWriteStoragePermission(): Promise<boolean> {
    return this.strategy.handleWriteStoragePermission();
  }
  handleUseCameraPermission(): Promise<boolean> {
    return this.strategy.handleUseCameraPermission();
  }
  handleNotificationPermission(): Promise<boolean> {
    return this.strategy.handleNotificationPermission();
  }
  checkPermissionNotification(): Promise<boolean> {
    return this.strategy.checkPermissionNotification();
  }
}

const Permission = new PermissionContext();

export default Permission;
