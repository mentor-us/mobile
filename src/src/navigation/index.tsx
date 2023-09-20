import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "~/redux";
import AuthorizedStack from "./Authorized";
import UnAuthorizedStack from "./UnAuthorized";
import AuthThunk from "~/redux/features/auth/thunk";
import {View, StyleSheet, ActivityIndicator, StatusBar} from "react-native";
import {Color} from "~/constants/Color";
import UserThunks from "~/redux/features/user/thunk";
import {AuthApi} from "~/api/local";
import EventThunk from "~/redux/features/event/thunk";
import {useQueryGroupList} from "~/screens/Home/queries";
import {NavigationContainer} from "@react-navigation/native";
import {Deeplink, config, config_auth} from "~/utils/Deeplink";
import BottomSheetModal from "~/components/BottomSheetModal";
import {BottomSheetModalRef} from "~/components/BottomSheetModal/index.props";

interface Props {
  onNavigationContainerReady: () => void;
}

const RootNavigator = ({onNavigationContainerReady}: Props) => {
  const {tokenStatus, token} = useAppSelector(state => state.auth);
  const dispatcher = useAppDispatch();
  const data = useQueryGroupList();

  useEffect(() => {
    if (tokenStatus == "verifying") {
      dispatcher(AuthThunk.verifyToken());
    }
  }, [tokenStatus]);

  useEffect(() => {
    if (tokenStatus === "actived") {
      // console.log("@TOKEN: ", token);
      dispatcher(UserThunks.getCurrentUser());
    }
  }, [tokenStatus]);

  const updateToken = async (token: string) => {
    await AuthApi.saveToken(token);
  };

  const refresh = async () => {
    await dispatcher(UserThunks.getCurrentUser());
    await updateToken(token);
    await dispatcher(EventThunk.fetchEvent());
    data.refetch();
  };

  useEffect(() => {
    if (token) {
      refresh();
    }
  }, [token]);

  console.log("@DUKE:   render");

  switch (tokenStatus) {
    case "actived":
      return (
        <NavigationContainer
          onReady={onNavigationContainerReady}
          linking={{...Deeplink, config: config_auth}}>
          <StatusBar
            animated={true}
            backgroundColor={Color.primary}
            showHideTransition={"fade"}
            barStyle={"light-content"}
            hidden={false}
          />
          <AuthorizedStack />
          <BottomSheetModal ref={BottomSheetModalRef} />
        </NavigationContainer>
      );
    case "inactived":
      return (
        <NavigationContainer
          onReady={onNavigationContainerReady}
          linking={{...Deeplink, config: config}}>
          <StatusBar
            animated={true}
            backgroundColor={Color.primary}
            showHideTransition={"fade"}
            barStyle={"light-content"}
            hidden={false}
          />
          <UnAuthorizedStack />
          <BottomSheetModal ref={BottomSheetModalRef} />
        </NavigationContainer>
      );
    default:
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color={Color.primary} />
        </View>
      );
  }
};

export default RootNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
