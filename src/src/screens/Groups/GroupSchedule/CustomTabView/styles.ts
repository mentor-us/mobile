import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  flatlist: {
    backgroundColor: Color.white,
    flex: 1,
    padding: 12,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Color.white,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    color: Color.black
  },
  emptyBtn: {
  },
});

export default styles;
