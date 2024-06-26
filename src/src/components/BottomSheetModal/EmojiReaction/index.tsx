import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useMemo } from "react";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import { commonStyles, ownerStyle, otherStyle } from "./styles";
import equals from "react-fast-compare";
import { DefaultUserAvatar } from "~/assets/images";
import GlobalStyles from "~/constants/GlobalStyles";
import Helper from "~/utils/Helper";

import {
  ForwardMessageModel,
  MessageEnumType,
  MessageModel,
  ReplyMessageModel,
} from "~/models/message";
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
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import File from "~/components/File";
import CacheImage from "~/components/CacheImage";
interface Props {
  message: MessageModel;
  action: any;
}

const EmojiReation = ({ message, action }: Props) => {
  const userId = useAppSelector(state => state.user.data.id);
  const isOwner = useMemo(() => {
    return userId === message?.sender?.id;
  }, [message?.sender?.id]);

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
      // eslint-disable-next-line no-empty
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
      // eslint-disable-next-line no-empty
    } catch (error) {
      // eslint-disable-next-line no-empty
    } finally {
    }
  };

  const onEditMessage = async () => {
    action.editMessage();
    BottomSheetModalRef.current?.hide();
    RichTextRef?.current?.setContentHTML(message.content ?? "");
    RichTextRef?.current?.setContentHTML(message.content ?? "");
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
      images: message.images,
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

  const renderMessage = () => {
    switch (message.type) {
      case MessageEnumType.Text:
        return (
          <TextMessage isOwner={isOwner} message={message} styles={styles} />
        );
      case MessageEnumType.Image:
        return <ImageMessage isOwner={isOwner} message={message} />;
      case MessageEnumType.File:
        return <File file={message.file!} isDownloadable={false} />;
      default:
        return null;
    }
  };

  const isThreeImages =
    message?.type === "IMAGE" && message?.images?.length === 3;

  return (
    <View style={commonStyles.modalCtnStyle}>
      <View style={[styles.root, commonStyles.root]}>
        {!isOwner && (
          <View>
            <CacheImage
              url={Helper.getImageUrl(message?.sender?.imageUrl)}
              defaultSource={DefaultUserAvatar}
              style={commonStyles.avatar}
            />
          </View>
        )}
        <View style={isThreeImages && commonStyles.imageCtn}>
          {renderMessage()}
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
            {["TEXT"].includes(message.type) && (
              <TouchableOpacity
                testID="copy-icon"
                style={commonStyles.actionButton}
                onPress={onCopy}>
                <CopyToClipboardIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {action?.replyMessage && (
              <TouchableOpacity
                testID="reply-icon"
                style={commonStyles.actionButton}
                onPress={onReplyMessage}>
                <ReplyIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {["IMAGE", "TEXT", "FILE"].includes(message.type) && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="forward-message-icon"
                onPress={onForwardMessage}>
                <ForwardMessageIcon width={24} height={24} />
              </TouchableOpacity>
            )}
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
            {["TEXT"].includes(message.type) && (
              <TouchableOpacity
                testID="copy-icon"
                style={commonStyles.actionButton}
                onPress={onCopy}>
                <CopyToClipboardIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {action?.replyMessage && (
              <TouchableOpacity
                testID="reply-icon"
                style={commonStyles.actionButton}
                onPress={onReplyMessage}>
                <ReplyIcon width={24} height={24} />
              </TouchableOpacity>
            )}
            {["IMAGE", "TEXT", "FILE"].includes(message.type) && (
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="forward-message-icon"
                onPress={onForwardMessage}>
                <ForwardMessageIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(EmojiReation, equals);
