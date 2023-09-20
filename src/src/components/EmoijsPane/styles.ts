import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Color.white,
    width: 250,
    justifyContent: "center",
    borderRadius: 32,
  },
  emojiCtn: {
    padding: 8,
    paddingVertical: 6,
  },
  emoji: {
    width: 24,
    height: 24,
  },
});

export default styles;
