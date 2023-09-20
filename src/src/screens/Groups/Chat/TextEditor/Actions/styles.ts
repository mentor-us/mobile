import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
  },
  inputTextContainer: {
    padding: 8,
    paddingTop: 4,
    backgroundColor: Color.white,
  },
  richEditorCtn: {
    marginHorizontal: -4,
    marginVertical: -2,
  },
  actionBtnCtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editingMessCtn: {
    justifyContent: "flex-end",
  },
  editingMess: {
    color: Color.text[3],
    fontStyle: "italic",
    fontSize: FontSize.large,
    marginLeft: 8,
  },
});

export default styles;
