import React from 'react';
import {ColorValue, StyleProp, ViewStyle, View} from 'react-native';

interface Props {
  height?: number | string;
  width?: number | string;
  backgroundColor?: ColorValue;
  customStyle?: StyleProp<ViewStyle>;

  paddingHorizontal?: number;
  paddingVertical?: number;

  marginHorizontal?: number;
  marginVertical?: number;
}

const SizedBox = ({
  height,
  width,
  customStyle,
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
  marginHorizontal,
  marginVertical,
}: Props) => {
  return (
    <View
      style={[
        customStyle,
        {
          height,
          width,
          backgroundColor,
          paddingHorizontal,
          paddingVertical,
          marginHorizontal,
          marginVertical,
        },
      ]}
    />
  );
};

export default SizedBox;
