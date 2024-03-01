import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo } from "react";

import { commonStyles, ownerStyle, otherStyle } from "./styles";
import { DefaultUserAvatar } from "~/assets/images";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import { MessageModel } from "~/models/message";
import { useAppSelector } from "~/redux";
import Animated, { withTiming } from "react-native-reanimated";
import { EntryAnimationsValues } from "react-native-reanimated";

import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useChatScreenState } from "~/context/chat";
import File from "~/components/File";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { EmoijType } from "~/constants/Emoijs";
import GroupApi from "~/api/remote/GroupApi";
import TotalEmojiReacted from "~/components/TotalEmojiReacted";

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
  const reactEmojiAction = (emoji: EmoijType) => {
    const newTotalReaction = Helper.addEmoji(message.totalReaction, emoji);
    state.setTotalReaction(newTotalReaction, message.id);

    state.setReactions(
      Helper.addUserEmoji(message.reactions, emoji, userData),
      message.id,
    );
  };
  const deleteEmoji = () => {
    state.setTotalReaction(
      Helper.removeEmoji(message.totalReaction),
      message.id,
    );

    state.setReactions(
      Helper.removeUserEmoji(message.reactions, userData),
      message.id,
    );
  };
  const pinMessage = async () => {
    const isSuccess = state.addPinnedMessage(message);
    if (isSuccess) {
      await GroupApi.pinMessage(state._groupDetail.id, message.id);

      const regex = /(<[^>]+>|<[^>]>|<\/[^>]>)/g;
      const sanitizedContent = message.content?.replace(regex, " ");
      // const newMessage = `${state._currentUser.name} đã ghim tin nhắn "${sanitizedContent}"`;
      // queryAction.updateGroupNewMessage(
      //   state._groupDetail.id,
      //   newMessage,
      //   false,
      // );
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const showUserReacted = useCallback(() => {
    BottomSheetModalRef.current?.show("user_reacted", message.reactions);
  }, [message.reactions]);

  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .onStart(e => {
      if (message.status === "DELETED") return;
      BottomSheetModalRef.current?.show(
        "emoji_reaction",
        { ...message, totalReaction: message.totalReaction } as MessageModel,
        {
          reactEmojiAction: reactEmojiAction,
          deleteEmoji: deleteEmoji,
          // deleteMessage: deleteMessage,
          pinMessage: pinMessage,
        },
      );
    })
    .minDuration(200);
  const composed = Gesture.Simultaneous(longPressGesture);

  return (
    <Animated.View style={[styles.root, commonStyles.root]} entering={entering}>
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

      {}
      <GestureDetector gesture={composed}>
        <TouchableOpacity style={[]} disabled={message.status === "DELETED"}>
          <View style={[commonStyles.container, styles.container]}>
            {!isOwner && (
              <View style={GlobalStyles.flexRow}>
                <Text style={otherStyle.senderName}>{message.sender.name}</Text>
              </View>
            )}
            <File file={message.file} isDownloadable={true} />
            <Text style={otherStyle.sentTime}>
              {Helper.getTime(message.createdDate)}
            </Text>
            <TouchableOpacity
              onPress={showUserReacted}
              style={[commonStyles.emojiCtn, styles.emojiCtnPos]}>
              <TotalEmojiReacted reaction={message.totalReaction} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </GestureDetector>
    </Animated.View>
  );
};

export default observer(FileItem);
