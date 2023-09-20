import {StyleSheet} from "react-native";
import {screenHeight, screenWidth} from "~/constants";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
  },
  dotContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    borderRadius: 50,
    height: 0.015 * screenWidth,
    marginHorizontal: 4,
    width: 0.015 * screenWidth,
  },
  imageCtn: {
    width: screenWidth,
    padding: 16,
    flexDirection: "row",
  },
  image: {
    width: screenWidth - 32,
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
});

export default styles;
