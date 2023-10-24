import {View, Text, Linking} from "react-native";
import React, {useEffect, useState} from "react";
import styles from "./styles";
import {LogoApp} from "~/assets/svgs";
import LoginButton from "~/components/LoginButton";
import {useRoute} from "@react-navigation/native";
import {useAppDispatch} from "~/redux";
import {ScreenProps} from "~/types/navigation";
import {LinkAuthorize} from "~/constants";
import AuthThunk from "~/redux/features/auth/thunk";
import {REFRESH_TOKEN, TOKEN, BASE_URL} from "@env";
import {Snackbar} from "react-native-paper";

const Login: ScreenProps<"loginScreen"> = () => {
  const route = useRoute();
  const dispatcher = useAppDispatch();

  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(TOKEN);

  useEffect(() => {
    const {token, emailVerified, error, refreshToken}: any = route.params || {
      token: TOKEN || "",
      emailVerified: false,
      refreshToken: REFRESH_TOKEN || "",
      error: null,
    };

    // console.log("@DUKE: LOGIN: ", error, token);

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

    if (!token) {
      return;
    }

    if (token) {
      console.log("@DUKE: LOGIN: ", token);
      dispatcher(
        AuthThunk.login({token, refreshToken, tokenStatus: "actived"}),
      );
    }
  }, [route.params]);

  const onPressLogin = async (link: string) => {
    const formatLink = link.replace(/\s/g, "");
    try {
      await Linking.openURL(formatLink);
    } catch {
      console.log("Cannot open url: ", formatLink);
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

export default Login;
