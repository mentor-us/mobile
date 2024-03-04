import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const commonStyles = StyleSheet.create({
  modalCtnStyle: {
    backgroundColor: "#0000",
    paddingVertical: 8,
    borderRadius: 12,
  },
  root: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  container: {
    backgroundColor: Color.white,
    maxWidth: screenWidth * 0.8,
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
    bottom: -10,
    right: 12,
    backgroundColor: Color.white,
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: Color.violet,
    flexDirection: "row",
  },
  emoji: {
    width: 14,
    height: 14,
  },
  totalEmoij: {
    fontSize: FontSize.smaller,
    color: Color.text[0],
  },

  actionButton: {
    backgroundColor: Color.white,
    padding: 8,
    borderRadius: 50,
    marginLeft: 8,
    marginTop: 8
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
  senderName: {
    fontSize: FontSize.small,
    color: Color.green,
    fontWeight: "bold",
  },
  sentTime: {
    fontSize: FontSize.smaller,
    color: Color.text[5],
    marginBottom: 8,
  },
  emojiPane: {
    flexDirection: "row-reverse",
    marginLeft: 8,
  },
  actionBox: {
    height: 40,
    marginTop: 8,
    width: 250,
    borderRadius: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  pinButton: {},
});

export const otherStyle = StyleSheet.create({
  root: {
    flexDirection: "row",
  },
  container: {
    borderTopLeftRadius: 0,
    borderColor: "#ccc",
    padding: 8,
  },
  senderName: {
    fontSize: FontSize.small,
    color: Color.green,
    fontWeight: "bold",
  },
  sentTime: {
    fontSize: FontSize.smaller,
    color: Color.text[5],
    marginBottom: 0,
  },
  emojiPane: {
    marginLeft: 50,
  },
  actionBox: {
    height: 40,
    marginTop: 8,
    marginLeft: -8,
    width: 250,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  pinButton: {
    position: "absolute",
    right: -45,
  },
});
