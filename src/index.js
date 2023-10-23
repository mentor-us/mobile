/**
 * @format
 */
import {LogBox} from "react-native";
import {AppRegistry} from "react-native";
import App from "./src/App";
import {name as appName} from "./app.json";
import messaging from "@react-native-firebase/messaging";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
messaging().setBackgroundMessageHandler(async message => {
  console.log("@DUKE: setBackgroundMessageHandler: ", message);
});
