import { Platform, StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  addChannel: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  addChannelIcon: {
    marginRight: 5,
  },
  avatar: {
    borderColor: Color.border,
    borderRadius: 100,
    borderWidth: 1,
    height: 25,
    padding: 4,
    width: 25,
  },
  channelList: {
    paddingLeft: 40,
    width: "100%",
  },
  channelName: {
    color: Color.text[0],
  },
  commonRoom: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 6,
    width: "100%",

    ...Platform.select({
      ios: {
        marginTop: 6,
      },
    }),
  },
  commonRoomText: {
    color: Color.black,
    fontSize: FontSize.large,
    fontWeight: "500",
  },
  container: {
    backgroundColor: Color.white,
    flex: 1,
    paddingTop: 10,
  },
  iconBox: {
    marginRight: 5,
  },
});

export default styles;
