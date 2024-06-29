import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, Ref } from "react";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import SizedBox from "~/components/SizedBox";
import FontSize from "~/constants/FontSize";
import { NotePermission } from "~/models/note";

interface SharePermissionBottomSheetProps
  extends Omit<BottomSheetModalProps, "children"> {
  onSharePermissionChange: (notePermission: NotePermission) => void;
}

const SharePermissionBottomSheet = (
  {
    onSharePermissionChange: onShareTypeChange,
    ...props
  }: SharePermissionBottomSheetProps,
  ref: Ref<BottomSheetModal>,
) => {
  const NOTE_PERMISSION = useMemo(() => {
    return [
      {
        key: NotePermission.VIEW,
        displayName: "Xem",
      },
      {
        key: NotePermission.EDIT,
        displayName: "Chỉnh sửa",
      },
    ];
  }, []);

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onShareTypeChange(item.key)}>
          <Text style={styles.text}>{item.displayName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={ref}
      {...props}
      style={[styles.defaultShareTypeContainer, props.style]}>
      <BottomSheetFlatList
        data={NOTE_PERMISSION}
        keyExtractor={item => `${item.key}`}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <SizedBox height={4} />}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  defaultShareTypeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  option: {
    alignSelf: "flex-start",
    backgroundColor: "rgb(220, 220, 220)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  row: {
    marginBottom: 12,
  },
  text: {
    fontSize: FontSize.normal,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default forwardRef<BottomSheetModal, SharePermissionBottomSheetProps>(
  SharePermissionBottomSheet,
);
