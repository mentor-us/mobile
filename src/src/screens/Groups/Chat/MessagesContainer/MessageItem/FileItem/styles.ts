import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const commonStyles = StyleSheet.create({
  root: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  container: {
    backgroundColor: Color.white,
    maxWidth: screenWidth * 0.8,
    minWidth: 120,
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  ownerContainer: {},
  otherContainer: {},
  text: {
    color: Color.messageChat,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 8,
  },
  emojiCtn: {
    position: "absolute",
  },
  emoji: {
    width: 14,
    height: 14,
  },
});

export const ownerStyle = StyleSheet.create({
  root: {
    flexDirection: "row-reverse",
  },
  container: {
    borderTopRightRadius: 0,
    borderColor: Color.borderActive,
  },
  emojiCtnPos: {
    bottom: -10,
    right: 12,
  },
});

export const otherStyle = StyleSheet.create({
  root: {
    flexDirection: "row",
  },
  container: {
    borderTopLeftRadius: 0,
    borderColor: "#ccc",
  },
  senderName: {
    fontSize: FontSize.small,
    color: Color.green,
    fontWeight: "bold",
  },
  sentTime: {
    fontSize: FontSize.smaller,
    color: Color.text[5],
  },
  emojiCtnPos: {
    bottom: -12,
    right: 12,
  },
});
