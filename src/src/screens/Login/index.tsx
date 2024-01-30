import { View, Text, Linking } from "react-native";
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
import { observer } from "mobx-react-lite";

interface LoginRouteParamsProps extends Readonly<object> {
  token?: string;
  emailVerified?: boolean;
  error?: string;
  refreshToken?: string;
}

const LoginScreen: ScreenProps<"loginScreen"> = () => {
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
    if (error) {
      switch (error) {
        case "704":
          setMessage("Tài khoản không tồn tại trên hệ thống");
          break;
        case "705":
          setMessage("Tài khoản bị khoá");
          break;
        default:
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
      await Linking.openURL(formatLink);
    } catch {
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

export default observer(LoginScreen);
