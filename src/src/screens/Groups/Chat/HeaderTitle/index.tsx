import {TouchableOpacity, Text, View} from "react-native";
import React, {memo} from "react";
import styles from "./styles";
import {ArrowDownFilledIcon} from "~/assets/svgs";
import {BottomSheetModalRef} from "~/components/BottomSheetModal/index.props";

interface Props {
  name: string;
  status?: boolean; //'Online' | 'Offline'; using for chat 1-1
  hint?: string | undefined; // using for chat 1-m
}

const HeaderTitle = ({name, status, hint}: Props) => {
  const openThreads = () => {
    // BottomSheetModalRef.current?.show("group_chat_threads", "taskId");
  };

  return (
    <TouchableOpacity onPress={openThreads}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.membersCtn}>
        <Text
          style={styles.members}>{hint}</Text>
        {/* <ArrowDownFilledIcon width={16} height={16} /> */}
      </View>
    </TouchableOpacity>
  );
};

export default memo(HeaderTitle);
