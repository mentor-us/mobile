import {View, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import {CloseFillIcon} from "~/assets/svgs";
import {BottomSheetModalRef} from "../index.props";

const ListHeader = () => {
  const onClose = () => {
    BottomSheetModalRef.current?.hide();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose}>
        <CloseFillIcon fill="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 28,
  },
});

export default ListHeader;
