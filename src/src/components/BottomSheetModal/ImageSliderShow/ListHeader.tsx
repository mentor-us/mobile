import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { CloseIcon } from "~/assets/svgs";
import { BottomSheetModalRef } from "../index.props";
import { FAB } from "react-native-paper";
import { Color } from "~/constants/Color";
import uuid from "react-native-uuid";
import ToolApi from "~/api/remote/ToolApi";

interface Props {
  image?: string;
  setMessage: Dispatch<SetStateAction<string>>;
  setSnackBar: Dispatch<SetStateAction<boolean>>;
  setDownloading: Dispatch<SetStateAction<boolean>>;
}

const ListHeader = ({
  image,
  setMessage,
  setSnackBar,
  setDownloading,
}: Props) => {
  const onClose = () => {
    BottomSheetModalRef.current?.hide();
  };

  const saveImage = async () => {
    if (!image) {
      return;
    }
    setDownloading(true);
    try {
      await ToolApi.saveImage(image, uuid.v4().toString());
      setMessage("Tải về thành công");
      setSnackBar(true);
    } catch (e) {
      setMessage("Đã có lỗi xảy ra.");
      setSnackBar(true);
    }
    setDownloading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose}>
        <CloseIcon />
      </TouchableOpacity>

      <FAB
        icon={"download"}
        label={""}
        style={styles.btn}
        onPress={saveImage}
        small={true}
        animated={true}
      />
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
  btn: {
    backgroundColor: Color.primary,
    zIndex: 100,
  },
});

export default ListHeader;
