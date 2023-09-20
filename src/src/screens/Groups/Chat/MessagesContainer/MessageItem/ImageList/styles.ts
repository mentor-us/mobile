import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const commonStyles = StyleSheet.create({
  root: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  container: {
    backgroundColor: Color.white,
    maxWidth: screenWidth * 0.8,
    minWidth: screenWidth * 0.8,
    paddingBottom: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
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
  failedLayer: {
    alignItems: "center",
    backgroundColor: "#000a",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
    borderRadius: 8,
  },
  failedText: {
    color: Color.white,
    fontWeight: "bold",
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
  },
});

export const otherStyle = StyleSheet.create({
  root: {
    flexDirection: "row",
  },
  container: {
    borderTopLeftRadius: 0,
    borderColor: "#ccc",
    paddingTop: 4,
  },
  senderName: {
    fontSize: FontSize.small,
    color: Color.green,
    fontWeight: "bold",
    marginLeft: 4,
  },
  sentTime: {
    fontSize: FontSize.smaller,
    color: Color.text[5],
    marginLeft: 4,
  },
  emojiCtnPos: {
    bottom: -12,
    right: 12,
  },
});
