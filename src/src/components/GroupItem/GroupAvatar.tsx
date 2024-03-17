import { View, StyleSheet, Image } from "react-native";
import React, { memo } from "react";
import { DefaultGroupNotification } from "~/assets/images";
import { StudentReadingIcon, TeacherIcon } from "~/assets/svgs";
import { Color } from "~/constants/Color";
import { RoleType } from "~/models/commonTypes";
import CacheImage from "../CacheImage";
import Helper from "~/utils/Helper";

interface Props {
  avatar?: string;
  online?: boolean;
  role?: RoleType;
}
const GroupAvatar = ({ avatar, online = true, role = "MENTEE" }: Props) => {
  return (
    <View style={styles.infoCtn}>
      <View style={styles.avatarCtn}>
        <View>
          <CacheImage
            style={styles.avatar}
            url={Helper.getImageUrl(avatar)}
            defaultSource={DefaultGroupNotification}
          />
        </View>
        <View style={styles.roleType}>
          {role === "MENTEE" ? (
            <StudentReadingIcon width={14} height={14} />
          ) : (
            <TeacherIcon width={12} height={12} />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(GroupAvatar);

const styles = StyleSheet.create({
  infoCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCtn: {
    position: "relative",
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    padding: 4,
  },
  roleType: {
    position: "absolute",
    borderRadius: 100,
    bottom: 0,
    right: 0,
    borderColor: "#777",
    borderWidth: 0.5,
    width: 24,
    height: 24,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
