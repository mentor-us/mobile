import { View, Text, Linking, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { LogoApp } from "~/assets/svgs";
import LoginButton from "~/components/LoginButton";
import { useRoute } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";
import { LinkAuthorize } from "~/constants";
import { BASE_URL, TOKEN as TEST_TOKEN } from "@env";
import { Snackbar } from "react-native-paper";
import LOG from "~/utils/Logger";
import { SecureStore } from "~/api/local/SecureStore";
import { useQueryClient } from "@tanstack/react-query";
import { CurrentUserQueryKey } from "~/app/server/users/queries";
import { useMobxStore } from "~/mobx/store";
import { LoginRouteParamsProps } from ".";
import * as WebBrowser from "expo-web-browser";
import { getBuildNumber, getVersion } from "react-native-device-info";

export const LoginScreen: ScreenProps<"loginScreen"> = () => {
  const { authStore } = useMobxStore();
  const route = useRoute();
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const login = async (token: string) => {
      await SecureStore.saveToken(token);
      await queryClient.invalidateQueries({
        queryKey: CurrentUserQueryKey,
        exact: true,
      });
      authStore.signIn(token);
    };

    if (!route.params) {
      return;
    }

    // WARNING: BUA - TOKEN PHAI CON HAN
    if (TEST_TOKEN && __DEV__) {
      login(TEST_TOKEN);
      return;
    }

    const { token, error }: LoginRouteParamsProps = route.params as object;
    console.log(LoginScreen.name, route);
    if (error) {
      console.error("ERROR: " + LoginScreen.name, error);

      if (error.includes("704")) {
        setMessage("Tài khoản không tồn tại trên hệ thống");
      } else if (error.includes("705")) {
        setMessage("Tài khoản bị khoá");
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại");
      }

      setSnackBar(true);
      return;
    }

    if (token) {
      login(token);
    }
  }, [route.params]);

  useEffect(() => {
    if (authStore.error) {
      setMessage(authStore.error);
      setSnackBar(true);
      authStore.setError(null);
    }
  }, [authStore.error]);

  const onPressLogin = async (link: string) => {
    const formatLink = link.replace(/\s/g, "");
    try {
      let result;
      if (Platform.OS === "ios") {
        result = await WebBrowser.openAuthSessionAsync(formatLink);
      } else {
        result = await WebBrowser.openBrowserAsync(formatLink);
      }

      Linking.openURL(result.url);
    } catch (ex) {
      console.log(JSON.stringify(ex));

      LOG.error(LoginScreen.name, "Cannot open url: " + formatLink);
    }
  };

  const onDismissSnackBar = () => setSnackBar(false);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <LogoApp width={200} height={200} />
      </View>
      <View style={styles.mainBody}>
        <Text style={styles.welcomeText}>MentorUS</Text>
        <View style={styles.loginOptionsContainer}>
          {Platform.OS === "ios" && (
            <View style={styles.loginOptionsContainer}>
              {/* Login with Apple */}
              <LoginButton
                type="apple"
                onPress={() => onPressLogin(LinkAuthorize.apple)}
              />
              <Text>hoặc</Text>
            </View>
          )}

          {/* Login with Google */}
          <LoginButton
            type="google"
            onPress={() => onPressLogin(LinkAuthorize.google)}
          />
          <Text>hoặc</Text>

          {/* Login with Microsoft 365 */}
          <LoginButton
            type="microsoft"
            onPress={() => onPressLogin(LinkAuthorize.azure)}
          />
        </View>

        <Text style={styles.desc}>
          Hãy đăng nhập bằng tài khoản Google hoặc tài khoản Microsoft do trường
          cấp để sử dụng ứng dụng nhé!
        </Text>
        <Text style={styles.desc}>{BASE_URL}</Text>
        <Text style={styles.desc}>Phiên bản: {getVersion()}</Text>
      </View>
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={2000}>
        {message}
      </Snackbar>
    </View>
  );
};
