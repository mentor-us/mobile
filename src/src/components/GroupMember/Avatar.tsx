import {View, StyleSheet, Image} from "react-native";
import React, {memo} from "react";
import {DefaultUserAvatar} from "~/assets/images";
import {StudentReadingIcon, TeacherIcon} from "~/assets/svgs";
import {Color} from "~/constants/Color";
import {RoleType} from "~/models/commonTypes";

interface Props {
  avatar?: string;
  online?: boolean;
  role?: RoleType;
}
const Avatar = ({avatar, online = true, role = "MENTEE"}: Props) => {
  return (
    <View style={styles.infoCtn}>
      <View style={styles.avatarCtn}>
        <Image
          style={styles.avatar}
          source={avatar ? {uri: avatar} : DefaultUserAvatar}
        />
        <View style={styles.roleType}>
          {role == "MENTEE" ? (
            <StudentReadingIcon width={16} height={16} />
          ) : (
            <TeacherIcon width={12} height={12} />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(Avatar);

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
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 2,
    padding: 4,
  },
  roleType: {
    position: "absolute",
    borderRadius: 100,
    bottom: -2,
    right: -2,
    borderColor: Color.white,
    borderWidth: 1.5,
    width: 22,
    height: 22,
    backgroundColor: Color.gray[0],
    justifyContent: "center",
    alignItems: "center",
  },
});
