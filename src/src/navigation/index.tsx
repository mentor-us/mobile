import React, { useEffect } from "react";
import AuthorizedStack from "./Authorized";
import UnAuthorizedStack from "./UnAuthorized";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Color } from "~/constants/Color";
import { NavigationContainer } from "@react-navigation/native";
import { Deeplink, config, config_auth } from "~/utils/Deeplink";
import BottomSheetModal from "~/components/BottomSheetModal";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { useCurrentUser } from "~/app/server/users/queries";
import { AxiosError } from "axios";
import { useNetInfo } from "@react-native-community/netinfo";
import RNBootSplash from "react-native-bootsplash";
import { observer } from "mobx-react-lite";
import { useMobxStore } from "~/mobx/store";
import { SecureStore } from "~/api/local/SecureStore";
import {
  removeAxiosResponseInterceptor,
  setupAxiosResponseInterceptor,
} from "~/api/remote/AxiosClient";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

const LoadingFullSreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Color.primary} />
    </View>
  );
};

const RootNavigator = () => {
  const { refetch } = useCurrentUser();
  const { authStore } = useMobxStore();
  const { isConnected } = useNetInfo();

  useEffect(() => {
    let interceptor;

    const bootstrapAsync = async () => {
      const userToken = await SecureStore.getToken();
      if (isConnected === false) {
        authStore.setError("Mất kết nối mạng");
        return;
      }

      if (userToken) {
        // Check token is valid or not, expired or not
        const res = await refetch();
        if (res.isError && res.error instanceof AxiosError) {
          const resStatus = res.error.response?.status;
          if (resStatus === 401) {
            authStore.restoreToken(null);
            authStore.setError("Phiên đăng nhập đã hết hạn");
            return;
          }
        }
      }

      // Save token to store
      authStore.setError(null);
      authStore.restoreToken(
        !userToken || userToken.length === 0 ? null : userToken,
      );

      // Register axios callback when token is expired
      interceptor = setupAxiosResponseInterceptor(() => {
        authStore.restoreToken(null);
        authStore.setError("Phiên đăng nhập đã hết hạn");
      });
    };

    bootstrapAsync().finally(async () => {
      // Hide splash screen after token is restored
      await RNBootSplash.hide({ fade: true, duration: 500 });
    });

    return () => {
      removeAxiosResponseInterceptor(interceptor);
    };
  }, []);

  if (authStore.isLoading) {
    return <LoadingFullSreen />;
  }

  const navigationLinking = {
    ...Deeplink,
    config: authStore.userToken === null ? config : config_auth,
  };

  return (
    <NavigationContainer
      onReady={() => RNBootSplash.hide()}
      linking={navigationLinking}
      fallback={<LoadingFullSreen />}>
      {!authStore.userToken ? (
        <UnAuthorizedStack />
      ) : (
        <>
          <AuthorizedStack />
          <BottomSheetModal ref={BottomSheetModalRef} />
        </>
      )}
    </NavigationContainer>
  );
};

export default observer(RootNavigator);
