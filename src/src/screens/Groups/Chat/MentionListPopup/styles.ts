import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: Color.mentionListBackground,
    maxHeight: 150,
    bottom: "100%",
    zIndex: 1000,
  },
  itemContainer: {
    paddingVertical: 6,
  },
  displayName: {
    fontSize: FontSize.large,
    color: Color.text[0],
  },
});

export default styles;
