import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from "react-native-logs";
import { InteractionManager } from "react-native";
import RNFS from "react-native-fs";

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors: {
      debug: "cyan",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    FS: RNFS,
    fileName: `logs_{date-today}`,
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
  asyncFunc: InteractionManager.runAfterInteractions,
};

const LOG = logger.createLogger(defaultConfig);

export default LOG;
