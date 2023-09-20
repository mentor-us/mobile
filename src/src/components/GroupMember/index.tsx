import {View, Text, TouchableOpacity} from "react-native";
import React, {memo} from "react";
import {GroupMemberModel, GROUP_MEMBER_SAMPLE} from "~/models/group";
import styles from "./styles";
import Avatar from "./Avatar";
import {MarkIcon} from "~/assets/svgs";

interface Props {
  member?: GroupMemberModel;
  onPress?: () => void;
  markable?: boolean;
  onMark?: (memberId: string, marked: boolean) => void;
}

const GroupMember = ({
  member = GROUP_MEMBER_SAMPLE,
  onPress,
  markable = true,
  onMark = () => {},
}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.infoCtn}>
        <Avatar role={member.role} avatar={member.imageUrl} />
        <View style={styles.flexRowBetween}>
          <View style={styles.detailCtn}>
            <Text style={[styles.textInfo, styles.displayName]}>
              {member.name}
            </Text>
            <View style={styles.descCtn}>
              <Text style={styles.textInfo}>{member.email}</Text>
            </View>
          </View>
        </View>
      </View>
      {markable && (
        <TouchableOpacity
          style={styles.markButton}
          onPress={() => onMark(member.id, member.marked || false)}>
          <MarkIcon marked={member.marked} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default memo(GroupMember);
