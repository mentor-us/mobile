import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { GroupChannel, GROUP_CHANNEL_SAMPLE } from "~/models/group";
import styles from "./styles";
import { Color } from "~/constants/Color";

import { CheckBoxActiveIcon, CheckBoxInactiveIcon } from "~/assets/svgs";
import GroupAvatar from "./GroupAvatar";
import { RoleType } from "~/models/commonTypes";
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
  initState,
}: Props) {
  const [checked, setChecked] = React.useState<boolean>(initState || false);
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
      <View
        style={[
          styles.infoCtn,
          { backgroundColor: checked ? "#D2DCFE" : "white", borderRadius: 10 },
        ]}>
        {channel?.group && (
          <GroupAvatar
            role={channel?.group?.role || RoleType.MENTEE}
            avatar={channel?.group?.imageUrl}
          />
        )}
        <View style={styles.flexRowBetween}>
          <View style={styles.detailCtn}>
            <View style={styles.categoryCtn}>
              <Text
                style={[
                  styles.textInfo,
                  styles.displayName,
                  styles.boldText,
                  { flex: 3 },
                ]}
                numberOfLines={1}>
                {channel.name}
              </Text>
              <Text
                style={[
                  styles.textInfo,
                  {
                    textAlign: "right",
                    textAlignVertical: "center",
                    marginRight: 5,
                  },
                ]}>
                {channel?.group?.name}
              </Text>
              <TouchableOpacity
                onPress={handlePress}
                style={styles.itemsCenter}>
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
