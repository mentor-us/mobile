import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useMemo } from "react";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import { commonStyles, ownerStyle, otherStyle } from "./styles";
import equals from "react-fast-compare";
import { DefaultUserAvatar } from "~/assets/images";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import { ForwardMessageModel, MessageModel, ReplyMessageModel } from "~/models/message";
import { useAppSelector } from "~/redux";
import EmojisPane from "~/components/EmoijsPane";
import { EmoijType } from "~/constants/Emoijs";
import { BottomSheetModalRef } from "../index.props";
import MessageApi from "~/api/remote/MessagesApi";
import {
  CopyToClipboardIcon,
  ForwardMessageIcon,
  GarbageIcon,
  PencilEditOffice,
  PinMessageIcon,
  ReplyIcon,
} from "~/assets/svgs";
import { RichTextRef } from "~/screens/Groups/Chat/TextEditor/index.props";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-root-toast";
import { ToastMessage } from "~/constants/ToastMessage";

interface Props {
  message: MessageModel;
  action: any;
}

const EmojiReation = ({ message, action }: Props) => {
  const userId = useAppSelector(state => state.user.data.id);
  const isOwner = useMemo(() => {
    return userId === message.sender.id;
  }, [message.sender.id]);

  const styles = useMemo(() => {
    return isOwner ? ownerStyle : otherStyle;
  }, [isOwner]);

  const onChooseEmoji = async (emojiId: EmoijType) => {
    action.reactEmojiAction(emojiId);
    try {
      await MessageApi.postReaction(message.id || "", userId, emojiId);
    } catch (error) {
      console.log("@DUKE: postReaction", error);
    } finally {
      BottomSheetModalRef.current?.hide();
    }
  };

  const onRemoveEmoji = async () => {
    action.deleteEmoji();

    try {
      await MessageApi.removeReaction(message.id || "", userId);
    } catch (error) {
    } finally {
      BottomSheetModalRef.current?.hide();
    }
  };

  const onDeleteMessage = async () => {
    action.deleteMessage(message.id);
    try {
      await MessageApi.deleteMessage(message.id || "");
      BottomSheetModalRef.current?.hide();
    } catch (error) {
    } finally {
    }
  };

  const onEditMessage = async () => {
    action.editMessage();
    BottomSheetModalRef.current?.hide();
    RichTextRef?.current?.setContentHTML(message.content??"");
    RichTextRef?.current?.focusContentEditor();
  };

  const onPinMessage = async () => {
    action.pinMessage(message.id);
    BottomSheetModalRef.current?.hide();
  };

  const onReplyMessage = async () => {
    action.replyMessage({
      id: message.id,
      senderName: message.sender.name,
      content: message.content,
    } as ReplyMessageModel);
    BottomSheetModalRef.current?.hide();
    RichTextRef?.current?.focusContentEditor();
  };
  const onForwardMessage = async () => {
    action.forwardMessage({
      id: message.id,
      content: message.content,
      type: message.type,
      images: message.images
    } as ForwardMessageModel);
    BottomSheetModalRef.current?.hide();
    // RichTextRef?.current?.focusContentEditor();
  };
  const onCopy = () => {
    // Copy Text only
    Clipboard.setString(Helper.extractTextOnlyFromHTML(message.content));

    BottomSheetModalRef.current?.hide();

    // Show toast for user know
    Toast.show(ToastMessage.copyToClipboard, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
    });
  };

  return (
    <View style={commonStyles.modalCtnStyle}>
      <View style={[styles.root, commonStyles.root]}>
        {!isOwner && (
          <View>
            <Image
              source={
                message.sender.imageUrl
                  ? { uri: message.sender.imageUrl }
                  : DefaultUserAvatar
              }
              style={commonStyles.avatar}
            />
          </View>
        )}
        <View>
          <TouchableOpacity style={[commonStyles.container, styles.container]}>
            {!isOwner && (
              <View style={GlobalStyles.flexRow}>
                <Text style={otherStyle.senderName}>{message.sender.name}</Text>
              </View>
            )}
            <TextFormatRenderer
              text={message.content || ""}
              style={commonStyles.text}
            />
            <Text style={otherStyle.sentTime}>
              {Helper.getTime(message.createdDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.emojiPane}>
        <EmojisPane
          onChooseEmoji={onChooseEmoji}
          onRemoveEmoji={onRemoveEmoji}
          removable={message.totalReaction.ownerReacted.length > 0}
        />
      </View>
      {isOwner ? (
        <View style={styles.emojiPane}>
          <View style={styles.actionBox}>
            {action?.editMessage && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="edit-icon"
                onPress={onEditMessage}>
                <PencilEditOffice width={24} height={24} />
              </TouchableOpacity>
            )}

            {action?.deleteMessage && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="delete-icon"
                onPress={onDeleteMessage}>
                <GarbageIcon width={24} height={24} />
              </TouchableOpacity>
            )}

            {action?.pinMessage && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="pin-icon"
                onPress={onPinMessage}>
                <PinMessageIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={commonStyles.actionButton}
              testID="copy-icon"
              onPress={onCopy}>
              <CopyToClipboardIcon width={24} height={24} />
            </TouchableOpacity>
            {action?.replyMessage && (
              <TouchableOpacity
                testID="reply-icon"
                style={commonStyles.actionButton}
                onPress={onReplyMessage}>
                <ReplyIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {
              message.type=='TEXT' &&
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="forward-message-icon"
                onPress={onForwardMessage}>
                  <ForwardMessageIcon width={24} height={24} />
              </TouchableOpacity>
            }
          </View>
        </View>
      ) : (
        <View style={styles.emojiPane}>
          <View style={styles.actionBox}>
            {action?.pinMessage && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="pin-icon"
                onPress={onPinMessage}>
                <PinMessageIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="copy-icon"
              style={commonStyles.actionButton}
              onPress={onCopy}>
              <CopyToClipboardIcon width={24} height={24} />
            </TouchableOpacity>
            {action?.replyMessage && (
              <TouchableOpacity
                testID="reply-icon"
                style={commonStyles.actionButton}
                onPress={onReplyMessage}>
                <ReplyIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {
              message.type=='TEXT' &&
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="forward-message-icon"
                onPress={onForwardMessage}>
                  <ForwardMessageIcon width={24} height={24} />
              </TouchableOpacity>
            }
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(EmojiReation, equals);
