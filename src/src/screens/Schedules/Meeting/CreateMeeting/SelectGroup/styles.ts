import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemCtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  textMess: {
    marginTop: 10,
    padding: 10,
    fontSize: FontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    color: Color.text[0],
  },
});

export default styles;
