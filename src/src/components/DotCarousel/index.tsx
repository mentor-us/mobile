import {View, StyleSheet, Animated} from "react-native";
import React, {forwardRef, MutableRefObject, useMemo} from "react";
import {Color} from "~/constants/Color";
import {screenWidth} from "~/constants";
interface Props {
  ref: MutableRefObject<Animated.Value>;
  current: Animated.Value;
  dotNumber: number;
}

const DotCarousel = ({current, dotNumber}: Props) => {
  if (!current) {
    return <></>;
  }

  const data: number[] = useMemo(() => {
    return [...Array(dotNumber).keys()];
  }, []);

  const position = Animated.divide(current, screenWidth);

  return (
    <View style={styles.container}>
      {data.map(item => {
        const color = position.interpolate({
          inputRange: [item - 1, item, item + 1],
          outputRange: [Color.gray[0], Color.secondary, Color.gray[0]],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[styles.dot, {backgroundColor: color}]}
            key={item}
          />
        );
      })}
    </View>
  );
};

export default forwardRef<
  Animated.Value,
  Props
>(DotCarousel);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    margin: 4,
    backgroundColor: Color.gray[1],
  },
  dotActive: {
    backgroundColor: Color.green,
  },
});
