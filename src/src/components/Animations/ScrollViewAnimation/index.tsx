import React from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import styles from './styles';

const ScrollViewAnimation = ({children}) => {
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, context) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });
  return (
    <Animated.ScrollView onScroll={scrollHandler}>
      {/* {children} */}
      <View style={styles.container} />
    </Animated.ScrollView>
  );
};

export default ScrollViewAnimation;
