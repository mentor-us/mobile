import { TextStyle, ViewStyle } from "react-native";

export interface HeaderRightProps {
  onPress?: () => void;
  text?: string;
  textStyles?: TextStyle;
  headerStyles?: ViewStyle;
}
