import {View, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {NotificationIcon, SearchIcon} from "~/assets/svgs";
import {Color} from "~/constants/Color";
import {useNavigation} from "@react-navigation/native";

const HeaderRight = () => {
  const navigation = useNavigation();
  const onPressNotification = () => {
    navigation.navigate("notificationList");
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.iconButton}>
        <SearchIcon width={20} height={20} />
      </TouchableOpacity> */}

      <TouchableOpacity testID="noti-btn" style={styles.iconButton} onPress={onPressNotification}>
        <NotificationIcon hasNotification={false} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginRight: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: Color.secondary,
    marginHorizontal: 2,
    borderRadius: 24,
  },
});
