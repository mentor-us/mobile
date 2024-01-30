import {Platform} from "react-native";
import {PermissionStrategy} from "./interfaces";
import {IOSPermissionStrategy} from "./IOSPermissionStrategy";
import {AndroidPermissionStrategy} from "./AndroidPermissionStrategy";

const Permission: PermissionStrategy =
  Platform.OS === "ios"
    ? new IOSPermissionStrategy()
    : new AndroidPermissionStrategy();

export default Permission;
