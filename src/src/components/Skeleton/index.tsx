import React, {useEffect, useRef} from "react";
import {Animated, Easing, StyleSheet, View, ViewStyle} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

interface Props {
  height?: number;
  width?: number;
  style?: ViewStyle;
  duration?: number;
  borderRadius?: number;
}

const Skeleton: React.FC<Props> = ({
  height = 12.5,
  width,
  style,
  duration = 1500,
  borderRadius = 15,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // const mainColor = "#F4F5F7";
  const mainColor = Color.primary + "30";

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();

    return () => {
      anim.stop?.();
    };
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-(width || screenWidth), width || screenWidth],
  });

  const styleDefault: ViewStyle = {
    backgroundColor: mainColor,
    width: width || screenWidth,
    height,
    overflow: "hidden",
    borderRadius,
  };

  return (
    <View style={[styleDefault, style]}>
      <AnimatedLG
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{translateX}],
        }}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[mainColor, "rgba(255,255,255, 0.6)", mainColor]}
      />
    </View>
  );
};

export default Skeleton;
