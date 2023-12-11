import {logger, consoleTransport} from "react-native-logs";
import {InteractionManager} from "react-native";

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "error",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: "cyan",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
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
