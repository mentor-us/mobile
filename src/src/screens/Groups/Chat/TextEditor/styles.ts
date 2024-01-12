import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
  },
  inputTextContainer: {
    padding: 8,
    paddingTop: 4,
    backgroundColor: Color.white,
    borderTopColor: Color.gray[0],
    borderTopWidth: 0.5,
  },
  richEditorCtn: {
    marginHorizontal: -4,
    marginVertical: -2,
    transform: [{ rotate: "180deg" }],
  },
  actionBtnCtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  richToolBarCtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#eee",
  },

  mockEditor: {
    height: 0,
  },
});

export default styles;
