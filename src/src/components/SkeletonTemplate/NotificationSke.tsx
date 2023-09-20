import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

import {screenWidth, screenHeight} from "~/constants";

import SizedBox from "../SizedBox";
import Skeleton from "../Skeleton";

import FontSize from "~/constants/FontSize";
import {Color} from "~/constants/Color";

const AVATAR_SIZE = 2 * FontSize.bigger;

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

export const NotificationSke = ({containerStyle}: Props) => {
  return (
    <View style={[styles.rootContainer, containerStyle]}>
      {[...Array(4)].map(item => (
        <View key={item} style={styles.notiItemContainer}>
          <Skeleton
            borderRadius={AVATAR_SIZE / 2}
            height={AVATAR_SIZE}
            width={AVATAR_SIZE}
          />
          <SizedBox width={8} />
          <View>
            <Skeleton borderRadius={20} width={0.7 * screenWidth} />
            <SizedBox height={8} />
            <Skeleton borderRadius={20} width={0.4 * screenWidth} />
            <SizedBox height={8} />
            <Skeleton borderRadius={20} width={0.3 * screenWidth} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  notiItemContainer: {
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 10,
  },

  rootContainer: {
    backgroundColor: Color.white,
    flexGrow: 1,
    height: screenHeight,
  },
});
