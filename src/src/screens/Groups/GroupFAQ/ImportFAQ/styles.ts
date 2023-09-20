import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    marginTop: -10,
  },
  checkbox:{
    marginHorizontal: -12,
  }
});

export default styles;
