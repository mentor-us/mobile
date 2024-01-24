import { Alert, DeviceEventEmitter, FlatList } from "react-native";
import React, { useCallback, useEffect } from "react";
import styles from "./styles";
import { observer } from "mobx-react-lite";

import { MessageModel } from "~/models/message";
import MessageItem from "./MessageItem";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { useChatScreenState } from "~/context/chat";
import ListFooter from "./ListFooter";
import SizedBox from "~/components/SizedBox";
import { Vote } from "~/models/vote";
import { RefreshTaskDetailEvent } from "~/models/events/refresh-task-detail";
import { GroupModel } from "~/models/group";

interface MessagesContainerProps {
  groupType: GroupModel["type"];
}

const MessagesContainer = ({ groupType }: MessagesContainerProps) => {
  const state = useChatScreenState();

  const renderItem = useCallback(({ item }: { item: MessageModel }) => {
    return <MessageItem message={item} />;
  }, []);

  useEffect(() => {
    const createVote = DeviceEventEmitter.addListener(
      EventEmitterNames.addVoting,
      (data: Vote) => {
        state.addVote(data);
        setTimeout(() => {
          Alert.alert("Bình chọn", "Gửi bình chọn thành công.");
        }, 500);
      },
    );

    const updateVote = DeviceEventEmitter.addListener(
      EventEmitterNames.updateVoting,
      (data: any) => {
        state.updateVote(data.voteId, data.status);
      },
    );

    const updateMeeting = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshMeetingDetail,
      ({ status, message }: { status: boolean; message: string }) => {},
    );

    const updateTaskStatus = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshTaskStatus,
      ({ taskId, newStatus }: RefreshTaskDetailEvent) => {
        state.updateTaskStatus(taskId, newStatus);
      },
    );

    return () => {
      createVote.remove();
      updateVote.remove();
      updateMeeting.remove();
      updateTaskStatus.remove();
    };
  }, []);

  const onEndReached = () => {
    state.setLoadingMoreMessage(true);
    state.getMoreMessage();
  };

  return (
    <FlatList
      testID="message-container"
      style={styles.container}
      renderItem={renderItem}
      data={state._messageList}
      keyboardDismissMode={"interactive"}
      keyExtractor={item => `${item.id}`}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<ListFooter type={groupType} />}
      ListHeaderComponent={() => <SizedBox height={8} />}
      ItemSeparatorComponent={() => <SizedBox height={4} />}
      inverted
      onEndReachedThreshold={0.7}
      onEndReached={onEndReached}
      // legacyImplementation
    />
  );
};

export default observer(MessagesContainer);
