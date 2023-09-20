import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  headerLeftContainer: {
    paddingHorizontal: 16,
  },
  headerRightContainer: {
    paddingHorizontal: 16,
    marginRight: 4,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Color.white,
    fontSize: FontSize.larger,
    lineHeight: FontSize.medium,
  },
});

export default styles;
