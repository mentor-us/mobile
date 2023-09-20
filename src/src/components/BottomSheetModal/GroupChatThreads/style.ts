import {StyleSheet} from "react-native";
import {screenHeight, screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: -(screenHeight * 0.5) - 50,
    width: screenWidth,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: FontSize.larger,
    color: Color.text[1],
  },
  row: {
    marginVertical: 4,
    flex: 1,
  },
  option: {
    borderRadius: 4,
    backgroundColor: Color.backgroundChat,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // alignSelf: "flex-start",
    // width: screenWidth,
  },
  text: {
    fontSize: FontSize.large,
    fontWeight: "600",
    // textTransform: "uppercase",
  },
});

export default styles;
