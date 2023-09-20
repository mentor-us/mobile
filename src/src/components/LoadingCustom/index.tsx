import React, {useEffect} from "react";
import {View} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import FontSize from "~/constants/FontSize";

import {ImageSpinner} from "~/assets/images";

const LoadingCustom = ({
  width = 2 * FontSize.bigger,
  height = 2 * FontSize.bigger,
  duration = 1500,
  tintColor = "",
  size = 2 * FontSize.bigger,
}) => {
  const spinRotate = useSharedValue("0deg");

  useEffect(() => {
    spinRotate.value = withRepeat(
      withTiming("360deg", {duration: duration, easing: Easing.linear}),
      -1,
    );

    return () => {
      cancelAnimation(spinRotate);
    };
  }, [size, tintColor, width, height]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{rotate: spinRotate.value}],
    };
  }, []);

  return (
    <View style={{height: size ?? height, width: size ?? width}}>
      <Animated.Image
        source={ImageSpinner}
        style={[
          style,
          {
            tintColor,
            width: size ?? width,
            height: size ?? width,
          },
        ]}
      />
    </View>
  );
};

export default LoadingCustom;
