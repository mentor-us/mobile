import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const MEDIA_SIZE = screenWidth / 3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    width: screenWidth,
    flex: 1,
  },
  doneBtn: {
    alignItems: "flex-end",
    backgroundColor: Color.transparent,
    minHeight: undefined,
  },

  doneLabelBtn: {
    color: Color.primary,
  },

  durationContainer: {
    backgroundColor: Color.text[2],
    borderRadius: 30,
    bottom: 8,
    opacity: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 8,
  },

  durationTxt: {
    color: Color.white,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerSide: {
    flex: 0.3,
  },

  headerTitle: {
    fontSize: FontSize.larger,
    lineHeight: FontSize.huge,
  },

  indexTxt: {
    color: Color.white,
  },

  media: {
    height: "100%",
    width: "100%",
  },
  mediaContainer: {
    height: MEDIA_SIZE,
    width: MEDIA_SIZE,
    marginRight: 2,
  },

  selectedIcon: {
    alignItems: "center",
    backgroundColor: Color.primary,
    borderRadius: 50,
    height: FontSize.huge,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: FontSize.huge,
  },

  unselectedIcon: {
    borderColor: Color.white,
    borderRadius: 50,
    borderWidth: 2,
    height: FontSize.huge,
    position: "absolute",
    right: 8,
    top: 8,
    width: FontSize.huge,
    backgroundColor: "#0009",
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginTop: 10,
    color: Color.text[0],
  },
});

export default styles;
