import React, {useCallback, useEffect} from "react";
import {StyleSheet} from "react-native";
import RootNavigator from "./navigation";
import RNBootSplash from "react-native-bootsplash";

import {Provider} from "react-redux";
import {store} from "./redux/store";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import socket, {SocketContext} from "./context/socket";
import StoreInstance from "./constants/StorageInstance";
import {handleNotificationPermission} from "./utils/Permission";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./init";
import {CalendarProvider} from "react-native-calendars";

const App = () => {
  const onNavigationContainerReady = useCallback(() => {
    StoreInstance.setStore(store);
    RNBootSplash.hide();
  }, []);

  const checkPermission = useCallback(async () => {
    await handleNotificationPermission();
  }, []);

  useEffect(() => {
    try {
      checkPermission();
    } catch (error) {}
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SocketContext.Provider value={socket}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <CalendarProvider date="dd-MM-yyyy">
              <RootNavigator
                onNavigationContainerReady={onNavigationContainerReady}
              />
            </CalendarProvider>
          </Provider>
        </QueryClientProvider>
      </SocketContext.Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
