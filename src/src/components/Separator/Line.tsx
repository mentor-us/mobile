import {View, Text} from "react-native";
import React from "react";
import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";

interface Props {
  height?: number;
  color?: string;
}

const Line = ({height = 0.5, color = "#ccc"}: Props) => {
  return <View style={[styles.line, {height, backgroundColor: color}]} />;
};

const styles = StyleSheet.create({
  line: {
    height: 0.5,
    backgroundColor: Color.lineSeparator,
  },
});

export default Line;
