import {Alert, DeviceEventEmitter, Image, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useMemo} from "react";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import {commonStyles, ownerStyle, otherStyle} from "./styles";
import {DefaultUserAvatar} from "~/assets/images";
import {useNavigation} from "@react-navigation/native";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import {BottomSheetModalRef} from "~/components/BottomSheetModal/index.props";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {MessageModel, ReplyMessageModel} from "~/models/message";
import {useAppSelector} from "~/redux";
import Animated, {withTiming} from "react-native-reanimated";
import {EntryAnimationsValues} from "react-native-reanimated";
import TotalEmojiReacted from "~/components/TotalEmojiReacted";
import {EmoijType} from "~/constants/Emoijs";

import _ from "lodash";
import {observer} from "mobx-react-lite";
import {useChatScreenState} from "~/context/chat";
import GroupApi from "~/api/remote/GroupApi";
import {useUpdateQueryGroupList} from "~/screens/Home/queries";
import EventEmitterNames from "~/constants/EventEmitterNames";

interface Props {
  message: MessageModel;
}

const TextContent = ({message}: Props) => {
  const userData = useAppSelector(state => state.user.data);
  const state = useChatScreenState();
  const navigation = useNavigation();
  const queryAction = useUpdateQueryGroupList();

  if (message.reply) {}
  const isOwner = useMemo(() => {
    return userData.id === message.sender.id;
  }, [message.sender.id]);

  const styles = useMemo(() => {
    return isOwner ? ownerStyle : otherStyle;
  }, [isOwner]);

  const entering = (targetValues: EntryAnimationsValues) => {
    "worklet";
    const animations = {
      originY: withTiming(targetValues.targetOriginY, {duration: 369}),
      opacity: withTiming(1, {duration: 369}),
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
    navigation.navigate("otherProfile", {userId: message.sender.id, groupId: groupId});
  }, [message.sender.id]);

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

  const editMessage = () => {
    state.setEditing(true);
    state.setCurrentMessageEditing(message);
  };

  const pinMessage = async () => {
    const isSuccess = state.addPinnedMessage(message);
    if (isSuccess) {
      await GroupApi.pinMessage(state._groupDetail.id, message.id);

      const regex = /(<[^>]+>|<[^>]>|<\/[^>]>)/g;
      const sanitizedContent = message.content?.replace(regex , ' ');
      // const newMessage = `${state._currentUser.name} đã ghim tin nhắn "${sanitizedContent}"`;
      // queryAction.updateGroupNewMessage(
      //   state._groupDetail.id,
      //   newMessage,
      //   false,
      // );
    }
  };

  const deleteMessage = (messageId: string) => {
    state.deleteMessage(messageId);
    DeviceEventEmitter.emit(EventEmitterNames.refreshHomePage);
  };

  const replyMessage = (message: ReplyMessageModel) => {
    state.setReplying(message);
  };

  const showUserReacted = useCallback(() => {
    BottomSheetModalRef.current?.show("user_reacted", message.reactions);
  }, [message.reactions]);

  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .onStart(e => {
      if (message.status == "DELETED") return;
      BottomSheetModalRef.current?.show(
        "emoji_reaction",
        {...message, totalReaction: message.totalReaction} as MessageModel,
        {
          reactEmojiAction: reactEmojiAction,
          deleteEmoji: deleteEmoji,
          editMessage: editMessage,
          deleteMessage: deleteMessage,
          pinMessage: pinMessage,
          replyMessage: replyMessage,
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
                ? {uri: message.sender.imageUrl}
                : DefaultUserAvatar
            }
            style={commonStyles.avatar}
          />
        </TouchableOpacity>
      )}
      <GestureDetector gesture={composed}>
        <TouchableOpacity
          style={[commonStyles.container, styles.container]}
          disabled={message.status == "DELETED"}>
          {!isOwner && (
            <View style={GlobalStyles.flexRow}>
              <Text style={otherStyle.senderName}>{message.sender.name}</Text>
            </View>
          )}

          {message.reply && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.name} numberOfLines={1}>
                {message.reply.senderName}
              </Text>
              <TextFormatRenderer
                text={message.reply.content || ""}
                style={commonStyles.replyMessage}
                numberOfLines={1}
              />
            </View>
          )}

          {message.status == "DELETED" ? (
            <TextFormatRenderer
              text={message.content || ""}
              style={commonStyles.dimmedText}
            />
          ) : (
            <TextFormatRenderer
              text={message.content || ""}
              style={commonStyles.text}
              isFullDetail
            />
          )}

          <Text style={otherStyle.sentTime}>
            {Helper.getTime(message.createdDate)}
          </Text>

          {message.status != "DELETED" && (
            <TouchableOpacity
              onPress={showUserReacted}
              style={[commonStyles.emojiCtn, styles.emojiCtnPos]}>
              <TotalEmojiReacted reaction={message.totalReaction} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </GestureDetector>
    </Animated.View>
  );
};

export default observer(TextContent);
