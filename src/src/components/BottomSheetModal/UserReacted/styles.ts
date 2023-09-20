import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    justifyContent: "space-between",
    backgroundColor: Color.white,
    borderRadius: 16,
    paddingBottom: 16,
  },

  userCtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  name: {
    color: Color.black,
    fontSize: FontSize.larger,
    maxWidth: screenWidth - 200,
  },
  totalReactedCtn: {
    flexDirection: "row",
    marginRight: 4,
  },
  emoji: {
    width: 20,
    height: 20,
  },
});

export default styles;
