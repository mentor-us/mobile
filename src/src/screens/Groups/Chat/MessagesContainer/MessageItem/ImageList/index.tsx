import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import { commonStyles, ownerStyle, otherStyle } from "./styles";
import { DefaultUserAvatar } from "~/assets/images";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ForwardMessageModel, MessageModel } from "~/models/message";
import { useAppSelector } from "~/redux";
import Animated, { withTiming } from "react-native-reanimated";
import { EntryAnimationsValues } from "react-native-reanimated";
import TotalEmojiReacted from "~/components/TotalEmojiReacted";
import { EmoijType } from "~/constants/Emoijs";
import GridThumbnail from "~/components/GridThumbnail";
import { screenWidth } from "~/constants";
import SizedBox from "~/components/SizedBox";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useChatScreenState } from "~/context/chat";
import { NotiFailed } from "~/assets/svgs";
import GroupApi from "~/api/remote/GroupApi";

interface Props {
  message: MessageModel;
}

const ImageList = ({ message }: Props) => {
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
    navigation.navigate("otherProfile", { userId: message.sender.id, groupId });
  }, [message.sender.id]);

  const reactEmojiAction = (emoji: EmoijType) => {
    state.setTotalReaction(
      Helper.addEmoji(message.totalReaction, emoji),
      message.id,
    );

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

  const editMessage = () => {};
  const pinMessage = async () => {
    const isSuccess = state.addPinnedMessage(message);
    if (isSuccess) {
      await GroupApi.pinMessage(state._groupDetail.id, message.id);
    }
  };

  const deleteMessage = (messageId: string) => {
    state.deleteMessage(messageId);
  };
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const forwardMessage = (message: ForwardMessageModel) => {
    // state.setReplying(message);
    console.log(message);
    console.log(message.images);
    navigation.navigate("forwardMessage", {
      message: `Chuyển tiếp ${
        message?.images ? message.images.length : 0
      } hình`,
      messageID: message.id,
      messageType: message.type,
    });
  };
  const showUserReacted = useCallback(() => {
    BottomSheetModalRef.current?.show("user_reacted", message.reactions);
  }, [message.reactions]);

  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .onStart(e => {
      BottomSheetModalRef.current?.show(
        "emoji_reaction",
        { ...message, totalReaction: message.totalReaction } as MessageModel,
        {
          reactEmojiAction: reactEmojiAction,
          deleteEmoji: deleteEmoji,
          deleteMessage: deleteMessage,
          forwardMessage: forwardMessage,

          // pinMessage: pinMessage,
        },
      );
    })
    .minDuration(500);

  const composed = Gesture.Simultaneous(longPressGesture);

  const showImageSlider = () => {
    BottomSheetModalRef.current?.show("image_slider", {
      images: message.images || [],
      index: 0,
    });
  };

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
      <GestureDetector gesture={composed}>
        <TouchableOpacity
          style={[commonStyles.container, styles.container]}
          disabled={message.uploadFailed}
          onPress={showImageSlider}>
          {!isOwner && (
            <View style={GlobalStyles.flexRow}>
              <Text style={otherStyle.senderName}>{message.sender.name}</Text>
            </View>
          )}
          <SizedBox height={4} />
          <View>
            <GridThumbnail
              useSkeletonWhenLoad
              maxWidth={screenWidth * 0.8}
              mediaData={message.images || []}
            />
          </View>
          <SizedBox height={4} />
          <Text style={otherStyle.sentTime}>
            {Helper.getTime(message.createdDate)}
          </Text>

          {message.uploadFailed && (
            <View style={commonStyles.failedLayer}>
              {/* <ActivityIndicator size={"small"} color={Color.primary} /> */}
              <NotiFailed />
              <Text style={commonStyles.failedText}>Gửi ảnh thất bại</Text>
            </View>
          )}
        </TouchableOpacity>
      </GestureDetector>
      <TouchableOpacity
        onPress={showUserReacted}
        style={[commonStyles.emojiCtn, styles.emojiCtnPos]}>
        <TotalEmojiReacted reaction={message.totalReaction} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default observer(ImageList);
