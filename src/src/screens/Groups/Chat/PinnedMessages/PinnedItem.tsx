import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MessageModel } from "~/models/message";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import { CloseRoundIcon, PinnedMessageIcon } from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import { Image } from "react-native-animatable";
import { BASE_URL } from "@env";
import { useMobxStore } from "~/mobx/store";

interface Props {
  message: MessageModel;
  expanding: boolean;
  unpinMessage: (messageId: string) => void;
  onLongPress?: () => void;
  onPress?: (string) => void;
}

const formatContent = (
  message: string | undefined,
  expanding: boolean,
  isDeleted: boolean,
) => {
  let content = isDeleted ? "Tin nhắn đã được xoá" : message || "[Hình ảnh]";
  const regex = /(<[^>]+>|<[^>]>|<\/[^>]>)/g;
  content = expanding
    ? content
    : content.replace(regex, "").slice(0, Math.min(25, content.length)).trim();
  return content;
};

const MessageContentLayout = ({ children }) => {
  return <View style={styles.messageContent}>{children}</View>;
};

const PinnedItem = ({
  message,
  expanding,
  unpinMessage,
  onLongPress = () => {},
  onPress = () => {},
}: Props) => {
  const isDeleted = message.status === "DELETED";
  const content = formatContent(message.content, expanding, isDeleted);
  const store = useMobxStore();

  const renderPinMessage = () => {
    switch (message?.type) {
      case "TEXT":
        return (
          <>
            <PinnedMessageIcon />
            <SizedBox width={8} />
            <View style={styles.messageContent}>
              <TextFormatRenderer
                text={content}
                style={styles.message}
                numberOfLines={expanding ? 10 : 1}
              />
              <Text
                style={
                  styles.ownerText
                }>{`Tin nhắn của ${message.sender.name}`}</Text>
            </View>
          </>
        );
      case "IMAGE": {
        const searchParams = new URLSearchParams();
        const { images } = message;
        if (!images || images.length === 0) {
          return null;
        }
        searchParams.append("key", images[0]?.url ?? "");

        return (
          <>
            <PinnedMessageIcon />
            <SizedBox width={8} />
            <MessageContentLayout>
              <View style={styles.imageMessageCtn}>
                <View style={styles.imageMessageTextCtn}>
                  <Text style={styles.message}>{`[Hình ảnh]${
                    images.length !== 1 ? " - " + images.length + " ảnh" : ""
                  }`}</Text>
                  <Text
                    style={
                      styles.ownerText
                    }>{`Tin nhắn của ${message.sender.name}`}</Text>
                </View>
                {expanding && (
                  <View style={styles.imageMessageImageCtn}>
                    <Image
                      source={{
                        uri: `${BASE_URL}/api/files?${searchParams}`,

                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${store.authStore.userToken}`,
                        },
                      }}
                      style={styles.imageMessageImage}
                    />
                  </View>
                )}
              </View>
            </MessageContentLayout>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(message.id)}
      onLongPress={() => onLongPress()}>
      <View style={styles.messageCtn}>
        {renderPinMessage()}
        {expanding && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              unpinMessage(message.id);
            }}>
            <CloseRoundIcon width={18} height={18} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PinnedItem;

const styles = StyleSheet.create({
  deleteBtn: {
    // position: "absolute",
    // right: 12,
  },

  messageContent: {
    flex: 1,
    width: "100%",
    // backgroundColor: "red",
  },

  message: {
    color: Color.black,
    fontSize: FontSize.large,
  },

  messageCtn: {
    alignItems: "center",
    flexDirection: "row",
    display: "flex",
    padding: 8,
    width: "100%",
  },

  ownerText: {
    color: Color.text[4],
    fontSize: FontSize.smaller,
  },

  // Image message type style
  imageMessageCtn: {
    display: "flex",
    flexDirection: "row",
  },
  imageMessageTextCtn: {
    flex: 1,
  },
  imageMessageImageCtn: { height: "100%", marginEnd: 12, width: "25%" },
  imageMessageImage: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
});
