import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 0.25,
    borderColor: Color.orange,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  totalReactedCtn: {
    flexDirection: "row",
    marginRight: 4,
  },
  emoji: {
    width: 14,
    height: 14,
  },
  totalEmoji: {
    fontSize: FontSize.small,
    color: Color.text[0],
  },
});

export default styles;
