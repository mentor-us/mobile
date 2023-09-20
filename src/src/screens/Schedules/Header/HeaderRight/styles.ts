import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: screenWidth / 2,
    flexDirection: "row",
    paddingRight: 4,
  },
  title: {
    fontSize: FontSize.huge,
    color: Color.white,
    lineHeight: FontSize.bigger,
  },
  button: {
    padding: 12,
    borderRadius: 50,
  },
  buttonSelected: {
    backgroundColor: Color.secondary,
  },
});

export default styles;
