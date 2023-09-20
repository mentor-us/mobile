import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    // backgroundColor: "#fc0",
  },
  icon: {
    // padding: 8,
    // borderRadius: 30,
    // backgroundColor: Color.gray[1],
  },
  textCtn: {
    borderBottomWidth: 0.5,
    borderBottomColor: Color.gray[2],
    paddingVertical: 16,
    paddingHorizontal: 8,
    flex: 1,
  },
  text: {
    fontSize: FontSize.larger,
    color: Color.text[1],
  },
  button: {},
  textAction: {
    color: Color.green,
  },
  switchCtn: {
    position: "absolute",
    right: 0,
  },
  dumb: {
    backgroundColor: "transparent",
    width: 50,
    height: 30,
    position: "absolute",
    top: 0,
  },
});

export default styles;
