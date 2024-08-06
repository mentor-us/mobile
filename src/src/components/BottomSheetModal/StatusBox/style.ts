import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
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
    fontWeight: "bold",
  },
  row: {
    marginVertical: 10,
  },
  option: {
    borderRadius: 6,
    backgroundColor: Color.backgroundChat,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: FontSize.normal,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default styles;
