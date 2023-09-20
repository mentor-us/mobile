import {TouchableOpacity, Text} from "react-native";
import React from "react";
import {CheckGoodIcon, ChevronLeft, CloseIcon, EditIcon} from "~/assets/svgs";
import styles from "./styles";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/lib/typescript/src/types";
import {useNavigation} from "@react-navigation/native";
import {Color} from "~/constants/Color";
import {HeaderRightProps} from "./types";

export const HeaderBackButton: React.FC<HeaderBackButtonProps> = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10}}
      onPress={() => navigation.goBack()}
      style={styles.headerLeftContainer}>
      <ChevronLeft stroke={Color.white} />
    </TouchableOpacity>
  );
};

export const HeaderCloseButton: React.FC<HeaderBackButtonProps> = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10}}
      onPress={() => navigation.goBack()}
      style={styles.headerLeftContainer}>
      <CloseIcon stroke={Color.white} />
    </TouchableOpacity>
  );
};

export const HeaderLeft = ({text, onPress}: HeaderRightProps) => {
  return (
    <TouchableOpacity style={styles.headerRightContainer} onPress={onPress}>
      <CloseIcon stroke={Color.white} />
    </TouchableOpacity>
  );
};

export const HeaderRight = ({text, onPress}: HeaderRightProps) => {
  return (
    <TouchableOpacity style={styles.headerRightContainer} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export const HeaderEditButton = ({onPress}: HeaderRightProps) => {
  return (
    <TouchableOpacity style={styles.headerRightContainer} onPress={onPress}>
      <EditIcon width={28} height={28} stroke={"#fff"} fill={"transparent"} />
    </TouchableOpacity>
  );
};

export const HeaderSubmitButton = ({onPress}: HeaderRightProps) => {
  return (
    <TouchableOpacity style={styles.headerRightContainer} onPress={onPress}>
      <CheckGoodIcon />
    </TouchableOpacity>
  );
};
