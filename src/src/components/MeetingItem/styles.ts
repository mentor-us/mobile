import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const normalStyles = StyleSheet.create({
  root: {
    backgroundColor: Color.white,
    width: screenWidth - 32,
    margin: 4,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 4,
  },
  container: {
    backgroundColor: Color.white,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    width: screenWidth - 52,
    color: Color.text[0],
    fontSize: FontSize.larger,
    marginTop: 20,
  },
  timeContainer: {
    backgroundColor: Color.blue,
    position: "absolute",
    right: 0,
    top: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  host: {
    width: screenWidth - 16,
    color: Color.text[5],
    fontSize: FontSize.small,
  },
  time: {
    color: Color.white,
    fontSize: FontSize.smaller,
    lineHeight: FontSize.large,
    textAlign: "center",
    textAlignVertical: "top",
  },
  onGoingLogo: {
    width: 24,
    height: 24,
    resizeMode: "stretch",
    position: "absolute",
    right: 8,
    bottom: 12,
  },
  typeCtn: {
    position: "absolute",
    top: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderLeftColor: Color.blue,
  },
  type: {
    color: Color.blue,
    fontSize: FontSize.normal,
    lineHeight: FontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "top",
  },
});

export const imcommingStyles = StyleSheet.create({
  root: {
    backgroundColor: Color.white,
    width: screenWidth - 32,
    margin: 4,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 4,
  },
  container: {
    backgroundColor: Color.white,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    width: screenWidth - 52,
    color: Color.text[0],
    fontSize: FontSize.larger,
    marginTop: 20,
  },
  timeContainer: {
    backgroundColor: Color.red,
    position: "absolute",
    right: 0,
    top: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  host: {
    width: screenWidth - 16,
    color: Color.text[5],
    fontSize: FontSize.small,
  },
  time: {
    color: Color.white,
    fontSize: FontSize.smaller,
    lineHeight: FontSize.large,
    textAlign: "center",
    textAlignVertical: "top",
  },
  onGoingLogo: {
    width: 24,
    height: 24,
    resizeMode: "stretch",
    position: "absolute",
    right: 8,
    bottom: 12,
  },
  typeCtn: {
    position: "absolute",
    top: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderLeftColor: Color.red,
  },
  type: {
    color: Color.red,
    fontSize: FontSize.normal,
    lineHeight: FontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "top",
  },
});
