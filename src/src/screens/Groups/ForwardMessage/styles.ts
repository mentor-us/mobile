import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    // flex: 1,
  },
  itemCtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pinned: {
    backgroundColor: Color.gray[0],
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    color: Color.text[4],
    width: screenWidth * 0.9,
    alignSelf: "center",
    margin: 8,
  },
  reloadBtnText: {
    color: Color.white,
  },
  reloadBtn: {
    alignSelf: "center",
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default styles;
