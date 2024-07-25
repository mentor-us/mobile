import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Color } from "~/constants/Color";

function StudentNoteIcon({ focused }: { focused: boolean }) {
  if (focused) {
    return <Icon name="notebook" size={22} color={Color.primary} />;
  }
  return <Icon name="notebook-outline" size={22} color={"grey"} />;
}

export default StudentNoteIcon;
