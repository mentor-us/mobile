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
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  flatlist: {
    backgroundColor: Color.white,
    flex: 1,
    padding: 12,
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

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  rowCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileItemContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },

  fileList: {
    paddingHorizontal: 16,
  },

  fileName: {
    color: "#444",
    fontSize: 14,
    lineHeight: FontSize.huge,
    maxWidth: "90%",
    fontWeight: "700",
  },

  fileSize: {
    color: "#777",
    fontSize: 11,
  },

  iconContainer: {
    backgroundColor: "#00000044",
    borderColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    padding: 2,
    position: "absolute",
    right: 2,
    top: 2,
  },

  statusLayer: {
    alignItems: "center",
    backgroundColor: "#00000016",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
    borderRadius: 8,
  },
  dowloadBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Color.gray[0],
  },

  sentTime: {
    color: "#777",
    fontSize: 11,
  },

  bottomBorder: {
    flex: 1,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  icon: {height: 50, width: 50},
  infoCtn: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    color: Color.black,
  },
});
