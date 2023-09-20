import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  name: {
    color: Color.white,
    fontSize: FontSize.larger,
    width: screenWidth * 0.6,
  },
  online: {
    color: Color.online,
    fontSize: FontSize.small,
  },
  offline: {
    color: Color.offline,
    fontSize: FontSize.small,
  },
  members: {
    color: Color.white,
    fontSize: FontSize.small,
    lineHeight: FontSize.normal,
  },
  membersCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;
