import {StyleSheet} from "react-native";
import {screenHeight, screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight * 0.45,
    width: screenWidth,
  },
  titleCtn: {
    padding: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
    fontSize: FontSize.large,
    color: Color.text[3],
  },
  icon: {
    width: screenWidth / 2.5,
    height: screenWidth / 2.5,
  },
  skeletonCtn: {
    paddingTop: 32,
  },
  skeletonRight: {
    flexDirection: "row-reverse",
    marginLeft: 8,
  },
});

export default styles;
