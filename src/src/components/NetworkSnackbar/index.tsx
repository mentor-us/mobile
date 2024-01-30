import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Snackbar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import SizedBox from "../SizedBox";
import { Color } from "~/constants/Color";
import { LayoutDimensions } from "~/constants/GlobalStyles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapperStyle: {},
});

interface NetworkSnackbarProps {
  duration?: number;
  isSubscribed?: boolean;
}

function NetworkSnackbar({
  duration = 2000,
  isSubscribed = false,
}: NetworkSnackbarProps) {
  const { isConnected } = useNetInfo();
  const [visible, setVisible] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    if (isSubscribed === false) return;
    if (isConnected === null) return;

    const unsubscribe = NetInfo.addEventListener(state => {
      // Ignore the first time
      if (isFirstTime) {
        setIsFirstTime(false);
        return;
      }
      if (state.isConnected === null) return;
      setVisible(true);
    });
    return () => {
      unsubscribe();
    };
  }, [isSubscribed, isConnected]);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <Snackbar
      testID="network-snackbar"
      wrapperStyle={styles.wrapperStyle}
      visible={visible}
      onDismiss={onDismissSnackBar}
      duration={duration}>
      {isConnected === false ? (
        <Feather
          name="wifi-off"
          size={LayoutDimensions.Medium}
          color={Color.gray[0]}
        />
      ) : (
        <Feather
          name="wifi"
          size={LayoutDimensions.Medium}
          color={Color.green}
        />
      )}
      <SizedBox width={LayoutDimensions.Medium} />
      <Text>
        {isConnected === false ? "Bạn đang offline" : "Bạn đang online"}
      </Text>
    </Snackbar>
  );
}

export default NetworkSnackbar;
