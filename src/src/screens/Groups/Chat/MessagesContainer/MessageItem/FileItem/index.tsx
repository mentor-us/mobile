import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo } from "react";

import { commonStyles, ownerStyle, otherStyle } from "./styles";
import { DefaultUserAvatar } from "~/assets/images";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import { ForwardMessageModel, MessageModel } from "~/models/message";
import { useAppSelector } from "~/redux";
import Animated, { withTiming } from "react-native-reanimated";
import { EntryAnimationsValues } from "react-native-reanimated";

import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useChatScreenState } from "~/context/chat";
import File from "~/components/File";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";

interface Props {
  message: MessageModel;
}

const FileItem = ({ message }: Props) => {
  const userData = useAppSelector(state => state.user.data);
  const state = useChatScreenState();
  const navigation = useNavigation();

  const isOwner = useMemo(() => {
    return userData.id === message.sender.id;
  }, [message.sender.id]);

  const styles = useMemo(() => {
    return isOwner ? ownerStyle : otherStyle;
  }, [isOwner]);

  const entering = (targetValues: EntryAnimationsValues) => {
    "worklet";
    const animations = {
      originY: withTiming(targetValues.targetOriginY, { duration: 369 }),
      opacity: withTiming(1, { duration: 369 }),
    };
    const initialValues = {
      originY: 200,
      opacity: 0,
    };
    return {
      initialValues,
      animations,
    };
  };

  const onPressAvatar = useCallback(() => {
    const groupId = !state._groupDetail.parentId
      ? state._groupDetail.id
      : state._groupDetail.parentId;
    navigation.navigate("otherProfile", {
      userId: message.sender.id,
      groupId: groupId,
    });
  }, [message.sender.id]);

  if (!message.file) {
    return <></>;
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const forwardMessage = (message: ForwardMessageModel) => {
    // state.setReplying(message);
    navigation.navigate("forwardMessage", {
      message: `Chuyển tiếp 1 file`,
      messageID: message.id,
      messageType: message.type,
      images: message.images,
    });
  };
  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .onStart(e => {
      if (message.status == "DELETED") return;
      BottomSheetModalRef.current?.show(
        "emoji_reaction",
        { ...message, totalReaction: message.totalReaction } as MessageModel,
        {
          forwardMessage: forwardMessage,
        },
      );
    })
    .minDuration(200);

  const composed = Gesture.Simultaneous(longPressGesture);
  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[styles.root, commonStyles.root]}
        entering={entering}>
        {!isOwner && (
          <TouchableOpacity onPress={onPressAvatar}>
            <Image
              source={
                message.sender.imageUrl
                  ? { uri: message.sender.imageUrl }
                  : DefaultUserAvatar
              }
              style={commonStyles.avatar}
            />
          </TouchableOpacity>
        )}
        <View style={[commonStyles.container, styles.container]}>
          {!isOwner && (
            <View style={GlobalStyles.flexRow}>
              <Text style={otherStyle.senderName}>{message.sender.name}</Text>
            </View>
          )}
          <File file={message.file} />
          <Text style={otherStyle.sentTime}>
            {Helper.getTime(message.createdDate)}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default observer(FileItem);
