import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import { RefreshIcon } from "~/assets/svgs";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, { useEffect } from "react";

interface Props {
  onRefresh: () => void;
  loading: boolean;
}

const ListFooter = ({ onRefresh, loading }: Props) => {
  const rotation = useSharedValue(0);
  const reloadAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const startAnimationReload = () => {
    "worklet";
    rotation.value = withSpring(rotation.value + 180);
  };

  const refresh = () => {
    "worklet";
    runOnJS(onRefresh)();
  };

  useEffect(() => {
    startAnimationReload();
  }, [loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.emptyText}>Bạn chưa tham gia nhóm nào</Text>
      <TouchableOpacity onPress={refresh} style={styles.reloadBtn}>
        <Animated.View style={reloadAnimatedStyle}>
          <RefreshIcon />
        </Animated.View>
        <Text style={styles.reloadBtnText}>Tải lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight - 90,
  },
  itemCtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pinned: {
    backgroundColor: Color.gray[0],
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    color: Color.text[4],
    width: screenWidth * 0.9,
    margin: 8,
  },
  reloadBtnText: {
    color: Color.white,
  },
  reloadBtn: {
    alignSelf: "center",
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
