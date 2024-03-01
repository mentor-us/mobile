import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MessageModel } from "~/models/message";
import { Color } from "~/constants/Color";
import { screenWidth } from "~/constants";
import FontSize from "~/constants/FontSize";
import { CloseRoundIcon, PinnedMessageIcon } from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import TextFormatRenderer from "~/components/TextFormatRenderer";

interface Props {
  message: MessageModel;
  expanding: boolean;
  unpinMessage: (messageId: string) => void;
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

const PinnedItem = ({ message, expanding, unpinMessage }: Props) => {
  const isDeleted = message.status == "DELETED";
  const content = formatContent(message.content, expanding, isDeleted);
  const renderPinMessage = () => {
    switch (message?.type) {
      case "TEXT":
        return (
          <View style={styles.messageCtn}>
            <PinnedMessageIcon />
            <SizedBox width={8} />
            <View>
              <TextFormatRenderer
                text={content}
                style={styles.message}
                numberOfLines={expanding ? 10 : 1}
              />
              <Text style={styles.ownerText}>
                {`Tin nhắn của ${message.sender.name}`}
              </Text>
            </View>
          </View>
        );
      case "FILE":
        return (
          <View style={styles.messageCtn}>
            <PinnedMessageIcon />
            <SizedBox width={8} />
            <View>
              <Text style={styles.message} numberOfLines={expanding ? 10 : 1}>
                {`[Tệp tin]`}
              </Text>
              <Text
                style={
                  styles.ownerText
                }>{`Tin nhắn của ${message.sender.name}`}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity>
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
      {/* </View> */}
    </TouchableOpacity>
  );
};

export default PinnedItem;

const styles = StyleSheet.create({
  messageCtn: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },

  message: {
    fontSize: FontSize.large,
    color: Color.black,
    width: screenWidth * 0.65,
  },

  ownerText: {
    color: Color.text[4],
    fontSize: FontSize.smaller,
  },

  deleteBtn: {
    position: "absolute",
    right: 12,
  },
});
