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
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 5,
    borderTopWidth: 0,
    borderTopColor: Color.blue,
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
    marginTop: 24,
  },
  timeContainer: {
    backgroundColor: Color.blue,
    position: "absolute",
    right: 0,
    top: 4,

    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  time: {
    color: Color.white,
    fontSize: FontSize.small,
    lineHeight: FontSize.large,
    textAlign: "center",
    textAlignVertical: "top",
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
  descCtn: {
    flexDirection: "row",
    flex: 1,
  },
  group: {
    color: Color.text[5],
    fontSize: FontSize.small,
    flex: 2.5,
  },
  status: {
    textAlign: "right",
    textAlignVertical: "bottom",
    fontWeight: "bold",
    fontSize: FontSize.normal,
    flex: 1.5,
    marginHorizontal: 4,
  },
});

export const incommingStyles = StyleSheet.create({
  root: {
    backgroundColor: Color.white,
    width: screenWidth - 32,
    margin: 4,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 5,
    borderTopWidth: 0,
    borderTopColor: Color.orange,
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
    marginTop: 24,
  },
  timeContainer: {
    backgroundColor: Color.orange,
    position: "absolute",
    right: 0,
    top: 4,

    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  time: {
    color: Color.white,
    fontSize: FontSize.small,
    lineHeight: FontSize.large,
    textAlign: "center",
    textAlignVertical: "top",
  },
  typeCtn: {
    position: "absolute",
    top: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 4,
    borderLeftColor: Color.orange,
  },
  type: {
    color: Color.orange,
    fontSize: FontSize.normal,
    lineHeight: FontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "top",
  },
  descCtn: {
    flexDirection: "row",
    flex: 1,
  },
  group: {
    color: Color.text[5],
    fontSize: FontSize.small,
    flex: 2.5,
  },
  status: {
    textAlign: "right",
    textAlignVertical: "bottom",
    fontWeight: "bold",
    fontSize: FontSize.normal,
    flex: 1.5,
    marginHorizontal: 4,
  },
});
