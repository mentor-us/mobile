/**
 * PermissionStrategy
 * @description Interface for permission strategies
 * @export
 * @interface PermissionStrategy
 */
export interface PermissionStrategy {
  handleReadStoragePermission(): Promise<boolean>;

  handleWriteStoragePermission(): Promise<boolean>;

  handleUseCameraPermission(): Promise<boolean>;

  handleNotificationPermission(): Promise<boolean>;

  checkPermissionNotification(): Promise<boolean>;
}
