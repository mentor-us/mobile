import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import FontSize from "~/constants/FontSize";
import GroupAvatar from "./GroupAvatar";
import {GroupModel} from "~/models/group";
import {Color} from "~/constants/Color";

interface Props {
  detailGroup: (conversationId: string) => void;
  item: GroupModel;
}

export default function GroupMentorItem({detailGroup, item}: Props) {
  return (
    <TouchableOpacity
      style={styles.infoCtn}
      onPress={() => detailGroup(item.id)}>
      <GroupAvatar />
      <View style={styles.detailCtn}>
        <Text style={styles.displayName}>{item?.name}</Text>
        <Text style={styles.totalMember}>{item.totalMember} thành viên</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  infoCtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
  },
  avatarCtn: {
    position: "relative",
    marginRight: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  detailCtn: {
    justifyContent: "center",
  },
  totalMember: {
    fontSize: FontSize.normal,
  },
  displayName: {
    fontSize: FontSize.larger,
    fontWeight: "bold",
    color: Color.text[1],
  },
});
