import {View, TouchableOpacity, Keyboard, DeviceEventEmitter} from "react-native";
import React from "react";
import {observer} from "mobx-react-lite";
import {useChatScreenState} from "~/context/chat";
import {CheckIcon, CloseFillIcon, SendIcon} from "~/assets/svgs";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import {RichTextRef} from "../index.props";
import MessageApi from "~/api/remote/MessagesApi";
import EventEmitterNames from "~/constants/EventEmitterNames";

interface Props {
  onSend: () => void;
}

const SubmitButton = ({onSend}: Props) => {
  const state = useChatScreenState();

  const updateMessage = async () => {
    try {
      if (state._currentMessageEditing) {
        const newContent = await RichTextRef.current.getContentHtml();
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
      RichTextRef.current.dismissKeyboard();
    }
  };

  const cancel = async () => {
    state.setEditing(false);
    RichTextRef.current.setContentHTML("");
  };

  return (
    <View style={styles.container}>
      {state.editing ? (
        <View style={styles.editCtn}>
          <TouchableOpacity style={styles.button} onPress={cancel}>
            <CloseFillIcon />
          </TouchableOpacity>
          <SizedBox width={6} />
          <TouchableOpacity style={styles.button} onPress={updateMessage}>
            <CheckIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={onSend} disabled={!state.sendable}>
          <SendIcon focused={state.sendable} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default observer(SubmitButton);
