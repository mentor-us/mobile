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
import { NoteShareType } from "~/models/note";

interface ShareTypeBottomSheetProps
  extends Omit<BottomSheetModalProps, "children"> {
  onShareTypeChange: (shareType: NoteShareType) => void;
}

const ShareTypeBottomSheet = (
  { onShareTypeChange, ...props }: ShareTypeBottomSheetProps,
  ref: Ref<BottomSheetModal>,
) => {
  const SHARE_TYPE_OPTIONS = useMemo(() => {
    return [
      {
        key: NoteShareType.PUBLIC,
        displayName: "Công khai",
        color: "#333",
      },
      {
        key: NoteShareType.MENTOR_VIEW,
        displayName: "Mentor chỉ được xem",
        color: "#3357FF",
      },
      {
        key: NoteShareType.MENTOR_EDIT,
        displayName: "Mentor được chỉnh sửa",
        color: "#32CD32",
      },
      {
        key: NoteShareType.PRIVATE,
        displayName: "Không công khai",
        color: "#FF9933",
      },
    ];
  }, []);

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onShareTypeChange(item.key)}>
          <Text style={[styles.text, { color: item.color }]}>
            {item.displayName}
          </Text>
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
        data={SHARE_TYPE_OPTIONS}
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

export default forwardRef<BottomSheetModal, ShareTypeBottomSheetProps>(
  ShareTypeBottomSheet,
);
