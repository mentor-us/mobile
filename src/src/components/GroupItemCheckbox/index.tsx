import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import styles from "./styles";
import { Color } from "~/constants/Color";
import GroupAvatar from "./GroupAvatar";

import CheckBox from '@react-native-community/checkbox';
interface Props {
  group?: GroupModel;
  onPress?: () => void;
  backgroudColor?: string;
  showMessage?: boolean;
}


export default function GroupItemCheckbox({
  group = GROUP_SAMPLE,
  onPress,
  backgroudColor = Color.white,
  showMessage = true,
}: Props) {
  const [checked, setChecked] = React.useState(false);
  const handlePress = () => {
    //toggle checkbox
    setChecked(!checked);
    onPress;
  };

  return (
    <TouchableOpacity style={[]} onPress={handlePress}>
      <View style={[styles.infoCtn]}>
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

              {/* <CheckBox
                disabled={false}
                value={checked}
                onValueChange={(newValue) => setChecked(newValue)}
              /> */}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
