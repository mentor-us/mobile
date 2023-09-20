import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Color} from "~/constants/Color";

import React from "react";
import FontSize from "~/constants/FontSize";
import {CloseFillIcon} from "~/assets/svgs";
import {useChatScreenState} from "~/context/chat";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import {observer} from "mobx-react-lite";

const ReplyAction = () => {
  const state = useChatScreenState();

  const onCancel = () => {
    state.setReplying(undefined);
  };

  if (!state.replying) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name} numberOfLines={1}>
          {state.replying.senderName}
        </Text>
        <TextFormatRenderer
          text={state.replying.content || ""}
          style={styles.message}
          numberOfLines={1}
        />
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <CloseFillIcon />
      </TouchableOpacity>
    </View>
  );
};

export default observer(ReplyAction);

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Color.gray[1],
    borderBottomWidth: 1,
  },
  card: {
    borderColor: Color.primary,
    borderLeftWidth: 3,
    flex: 1,
    marginLeft: 16,
    paddingHorizontal: 8,
  },
  name: {
    fontWeight: "bold",
    color: Color.primary,
    fontSize: FontSize.large,
  },
  message: {
    color: Color.text[0],
    fontSize: FontSize.large,
  },
  cancelButton: {
    padding: 8,
  },
});
