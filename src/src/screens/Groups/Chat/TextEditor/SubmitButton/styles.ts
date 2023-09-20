import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {},
  editCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 6,
    borderRadius: 40,
    backgroundColor: Color.gray[0],
  },
});

export default styles;
