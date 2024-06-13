import { View, Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import styles from "./styles";
import Avatar from "./Avatar";
import { Assignee, TaskStatusObject } from "~/models/task";
import { RoleType } from "~/models/commonTypes";

interface Props {
  member?: Assignee;
  onPress?: () => void;
}

const MEMBER_SAMPLE: Assignee = {
  id: "",
  email: "",
  name: "",
  imageUrl: "",
  role: RoleType.MENTEE,
  status: "NULL",
  assigned: "indeterminate",
};

const GroupMember = ({ member = MEMBER_SAMPLE, onPress }: Props) => {
  return (
    <TouchableOpacity style={[]} onPress={onPress}>
      <View style={styles.infoCtn}>
        <Avatar role={member.role} avatar={member.imageUrl} />
        <View style={styles.flexRowBetween}>
          <View style={styles.detailCtn}>
            <Text style={[styles.textInfo, styles.displayName]}>
              {member?.name}
            </Text>
            <View style={styles.descCtn}>
              <Text style={styles.textInfo}>{member?.email}</Text>
            </View>
          </View>

          <View style={styles.statusCtn}>
            <Text
              style={[
                styles.status,
                {
                  color: member?.status
                    ? TaskStatusObject[member?.status].color
                    : "black",
                  fontWeight: "bold",
                },
              ]}>
              {member?.status
                ? TaskStatusObject[member.status].displayName
                : null}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(GroupMember);
