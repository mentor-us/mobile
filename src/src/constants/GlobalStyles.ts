import { StyleSheet } from "react-native";
import { Color } from "./Color";
import FontSize from "./FontSize";

export const LayoutDimensions = {
  XSmall: 4,
  Small: 8,
  Medium: 16,
  Large: 24,
  XLarge: 32,
  XXLarge: 40,
};

const GlobalStyles = StyleSheet.create({
  absoluteFullFit: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  horizontalCenter: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  horizontalFlexEnd: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowReverse: {
    flexDirection: "row-reverse",
  },
  fullFlex: {
    flex: 1,
  },
  rightText: {
    textAlign: "right",
  },
  bottomLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: Color.gray[2],
  },
  fullFlexFocus: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  errorText: {
    color: Color.black,
    fontSize: FontSize.larger,
    marginBottom: 10,
    textAlign: "center",
  },
  nullTextContainer: {
    marginTop: 20,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  nullText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    color: Color.black,
  },
  textAlignCenter: {
    textAlign: "center",
  },
});

export default GlobalStyles;
