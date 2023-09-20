import {
  LayoutAnimation,
  LayoutAnimationConfig,
  Platform,
  UIManager,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AnimationConfig {
  config?: LayoutAnimationConfig;
  processCallback?: VoidFunction;
  onAnimationDidEnd?: VoidFunction;
  onAnimationDidFail?: VoidFunction;
}

export const runWithLayoutAnimation = ({
  config,
  processCallback,
}: AnimationConfig) => {
  LayoutAnimation.configureNext(
    config ?? {
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      duration: 300,
    },
    // {
    //   duration: 1000,
    //   update: {
    //     type: LayoutAnimation.Types.linear,
    //     springDamping: 0.7,
    //   },
    // },
  );

  processCallback?.();
};

// const setAnimation = () => {
//   LayoutAnimation.configureNext({
//     duration: 672,
//     update: {
//       type: LayoutAnimation.Types.spring,
//       property: LayoutAnimation.Properties.scaleXY,
//       springDamping: 0.9,
//     },
//   });
//   LayoutAnimation.configureNext({
//     duration: 369,
//     update: {
//       type: LayoutAnimation.Types.easeIn,
//       property: LayoutAnimation.Properties.scaleXY,
//       springDamping: 0.7,
//     },
//   });
// };
