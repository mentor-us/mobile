import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: screenWidth / 3,
    flexDirection: "row",
  },
  title: {
    fontSize: FontSize.huge,
    color: Color.white,
    lineHeight: FontSize.bigger,
  },
  monthButton: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  focusButton: {
    paddingLeft: 8,
    paddingRight: 2,
    paddingBottom: 2,
  },
});

export default styles;
