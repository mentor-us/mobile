import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {GroupModel, GROUP_SAMPLE} from "~/models/group";
import styles from "./styles";
import {Color} from "~/constants/Color";
import GroupAvatar from "./GroupAvatar";
import {PinIcon} from "~/assets/svgs";

interface Props {
  group?: GroupModel;
  onPress?: () => void;
  backgroudColor?: string;
  showMessage?: boolean;
}

export default function GroupItem({
  group = GROUP_SAMPLE,
  onPress,
  backgroudColor = Color.white,
  showMessage = true,
}: Props) {
  return (
    <TouchableOpacity style={[]} onPress={onPress}>
      <View style={[styles.infoCtn]}>
        <GroupAvatar role={group.role} avatar={group.imageUrl} />
        <View style={styles.flexRowBetween}>
          <View style={styles.detailCtn}>
            <Text
              style={[
                styles.textInfo,
                styles.displayName,
                group.hasNewMessage && styles.boldText,
              ]}>
              {group.name}
            </Text>
            <View style={styles.categoryCtn}>
              <Text style={styles.textInfo}>{group.groupCategory}</Text>
              <Text style={[styles.textInfo, {textAlign: "right"}]}>
                {`${group.totalMember} thành viên`}
              </Text>
            </View>
            {showMessage && group.newMessage != null && (
              <View style={styles.descCtn}>
                <Text
                  style={[
                    styles.textInfo,
                    group.hasNewMessage && styles.boldText,
                  ]}
                  numberOfLines={1}>
                  {group.newMessage}
                </Text>
              </View>
            )}
          </View>
        </View>
        {group.pinned && (
          <View style={styles.pinIcon}>
            <PinIcon />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
