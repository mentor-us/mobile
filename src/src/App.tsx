import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import RootNavigator from "./navigation";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import socket, { SocketContext } from "./context/socket";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./init";
import { CalendarProvider } from "react-native-calendars";
import Permission from "./utils/PermissionStrategies";
import { MobxProvider, rootMobxStore } from "./mobx/store";
import { StatusBar } from "react-native";
import { Color } from "./constants/Color";
import NetworkSnackbar from "./components/NetworkSnackbar";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

if (__DEV__) {
  import("react-query-native-devtools").then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

const App = () => {
  useEffect(() => {
    const checkPermission = async () => {
      await Permission.handleNotificationPermission();
    };

    checkPermission();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SocketContext.Provider value={socket}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootSiblingParent>
              <SafeAreaProvider>
                <Provider store={store}>
                  <CalendarProvider date="dd-MM-yyyy">
                    <MobxProvider value={rootMobxStore}>
                      <StatusBar
                        animated={true}
                        backgroundColor={Color.primary}
                        showHideTransition={"fade"}
                        barStyle={"light-content"}
                        hidden={false}
                      />
                      <RootNavigator />
                      <NetworkSnackbar isSubscribed />
                    </MobxProvider>
                  </CalendarProvider>
                </Provider>
              </SafeAreaProvider>
            </RootSiblingParent>
          </ThemeProvider>
        </QueryClientProvider>
      </SocketContext.Provider>
    </GestureHandlerRootView>
  );
};

export default App;
