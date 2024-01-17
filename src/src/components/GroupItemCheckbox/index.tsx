import { View, Text, TouchableOpacity, InputAccessoryView } from "react-native";
import React, { useState } from "react";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import styles from "./styles";
import { Color } from "~/constants/Color";
import GroupAvatar from "./GroupAvatar";

import CheckBox from "@react-native-community/checkbox";
import { CheckBoxActiveIcon, CheckBoxInactiveIcon } from "~/assets/svgs";
interface Props {
  group?: GroupModel;
  onPress?: (group: GroupModel) => void;
  backgroudColor?: string;
  showMessage?: boolean;
  initState?: boolean;
}

export default function GroupItemCheckbox({
  group = GROUP_SAMPLE,
  onPress,
  backgroudColor = Color.white,
  showMessage = true,
  initState
}: Props) {
  const [checked, setChecked] = React.useState<boolean>(initState||false);
  const handlePress = () => {
    //toggle checkbox
    toggleCheckBox();
    if (onPress) {
      onPress(group);
    }
  };
  const toggleCheckBox = () => {
    setChecked(!checked);
  };
  return (
    <TouchableOpacity style={[]} onPress={handlePress}>
      <View style={[styles.infoCtn,{backgroundColor:"lightgray",borderRadius:10}]}>
        <GroupAvatar role={group.role} avatar={group.imageUrl} />
        <View style={styles.flexRowBetween}>
          <View style={[styles.detailCtn]}>
            <View style={styles.categoryCtn}>
              <Text
                style={[
                  styles.textInfo,
                  styles.displayName,
                  group.hasNewMessage && styles.boldText,
                ]}>
                {group.name}
              </Text>
              <Text
                style={[
                  styles.textInfo,
                  { textAlign: "right",textAlignVertical:"center", marginRight: 5 },
                ]}>
                {group.name}
              </Text>
              <TouchableOpacity onPress={handlePress}>
                {checked ? (
                  <CheckBoxActiveIcon width={24} height={24} />
                ) : (
                  <CheckBoxInactiveIcon width={24} height={24} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
