import { View, Text, TouchableOpacity, InputAccessoryView } from "react-native";
import React, { useState } from "react";
import { GroupChannel, GROUP_SAMPLE, GROUP_CHANNEL_SAMPLE } from "~/models/group";
import styles from "./styles";
import { Color } from "~/constants/Color";
import GroupAvatar from "./GroupAvatar";

import CheckBox from "@react-native-community/checkbox";
import { CheckBoxActiveIcon, CheckBoxInactiveIcon } from "~/assets/svgs";
interface Props {
  channel?: GroupChannel;
  onPress?: (channel: GroupChannel) => void;
  backgroudColor?: string;
  showMessage?: boolean;
  initState?: boolean;
}

export default function ChannelItemCheckbox({
  channel = GROUP_CHANNEL_SAMPLE,
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
      onPress(channel);
    }
  };
  const toggleCheckBox = () => {
    setChecked(!checked);
  };
  return (
    <TouchableOpacity style={[]} onPress={handlePress}>
      <View style={[styles.infoCtn,{backgroundColor: checked ? "#D2DCFE" : "white",borderRadius:10}]}>
        {
          channel?.group && <GroupAvatar role={channel?.group?.role|| "MENTEE"} avatar={channel?.group?.imageUrl} />
        }
        <View style={styles.flexRowBetween}>
          <View style={[styles.detailCtn]}>
            <View style={styles.categoryCtn}>
              <Text
                style={[
                  styles.textInfo,
                  styles.displayName,
                  styles.boldText,
                ]}>
                {channel.name}
              </Text>
              <Text
                style={[
                  styles.textInfo,
                  { textAlign: "right",textAlignVertical:"center", marginRight: 5 },
                ]}>
                {channel?.group?.name}
              </Text>
              <TouchableOpacity onPress={handlePress} style={[styles.itemsCenter]}>
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
