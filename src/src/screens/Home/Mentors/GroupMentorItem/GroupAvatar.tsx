import {View, StyleSheet, Image} from "react-native";
import React from "react";
import {DefaultUserAvatar} from "~/assets/images";

interface Props {
  avatar?: string;
  online?: boolean;
}

export default function GroupAvatar({avatar, online = true}: Props) {
  return (
    <View style={styles.infoCtn}>
      <View style={styles.avatarCtn}>
        <Image
          style={styles.avatar}
          source={avatar ? {uri: avatar} : DefaultUserAvatar}
        />
        <View style={[styles.status, online && styles.online]}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  avatarCtn: {
    position: "relative",
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 4,
  },
  status: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 8,
    bottom: 0,
    right: 0,
  },
  online: {},
});
