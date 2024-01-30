import { View, TouchableOpacity, DeviceEventEmitter } from "react-native";
import React from "react";
import { observer } from "mobx-react-lite";
import { useChatScreenState } from "~/context/chat";
import { CheckIcon, CloseFillIcon, SendIcon } from "~/assets/svgs";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import { RichTextRef } from "../index.props";
import MessageApi from "~/api/remote/MessagesApi";
import EventEmitterNames from "~/constants/EventEmitterNames";
import Helper from "~/utils/Helper";

interface SubmitButtonProps {
  onSend: () => void;
}

const SubmitButton = ({ onSend }: SubmitButtonProps) => {
  const state = useChatScreenState();

  const updateMessage = async () => {
    try {
      if (state._currentMessageEditing) {
        const htmlContent = await RichTextRef?.current?.getContentHtml();
        const newContent = Helper.trimHTMLContent(htmlContent ?? "");

        state.updateMessage(state._currentMessageEditing.id, newContent);
        await MessageApi.updateMessage(
          state._currentMessageEditing.id,
          newContent,
        );
        DeviceEventEmitter.emit(EventEmitterNames.refreshHomePage);
      }
    } catch (error) {
    } finally {
      cancel();
      RichTextRef?.current?.dismissKeyboard();
    }
  };

  const cancel = async () => {
    state.setEditing(false);
    RichTextRef?.current?.setContentHTML("");
  };

  return (
    <View testID="btn-submit-chat" style={styles.container}>
      {state.editing ? (
        <View style={styles.editCtn}>
          <TouchableOpacity
            testID="edit-close-btn"
            style={styles.button}
            onPress={cancel}>
            <CloseFillIcon />
          </TouchableOpacity>
          <SizedBox width={6} />
          <TouchableOpacity
            testID="edit-submit-btn"
            style={styles.button}
            onPress={updateMessage}>
            <CheckIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          testID="btn-send-msg"
          onPress={onSend}
          disabled={!state.sendable}>
          <SendIcon focused={state.sendable} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default observer(SubmitButton);
