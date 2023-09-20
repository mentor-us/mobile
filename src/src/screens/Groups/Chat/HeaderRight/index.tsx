import {View, TouchableOpacity} from "react-native";
import React from "react";
import styles from "./styles";
import {AdjustmentIcon, SearchIcon} from "~/assets/svgs";
import {useNavigation} from "@react-navigation/native";

interface Props {
  groupId: string;
  type?: "group" | "channel";
}

const HeaderRight = ({groupId, type = "group"}: Props) => {
  const navigation = useNavigation();
  const navigateToGroupDetail = () => {
    navigation.navigate("groupDetail", {groupId: groupId, type: type});
  };
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.iconButton}>
        <SearchIcon width={20} height={20} />
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={navigateToGroupDetail}>
        <AdjustmentIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
