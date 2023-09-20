import {View, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import {CheckGoodIcon, CloseIcon} from "~/assets/svgs";
import {Color} from "~/constants/Color";
import {BottomSheetModalRef} from "../index.props";

interface Props {
  onSubmit: () => void;
  enableSubmit: boolean;
  onCancel: () => void;
}

const ListHeader = ({enableSubmit, onSubmit, onCancel}: Props) => {
  const onClose = () => {
    BottomSheetModalRef.current?.hide();
    onCancel();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose}>
        <CloseIcon />
      </TouchableOpacity>
      {enableSubmit && (
        <TouchableOpacity onPress={onSubmit}>
          <CheckGoodIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 40,
  },
});

export default ListHeader;
