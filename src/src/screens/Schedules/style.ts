import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleMonth: {
    fontSize: FontSize.larger,
    color: Color.white,
    fontWeight: "bold",
    marginRight: 4,
  },
  boxChangeMode: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    flex: 1,
  },
  iconChangeMode: {
    paddingLeft: 70,
    paddingRight: 10,
  },
  floatingButtonImage: {
    position: "absolute",
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Color.primary,
  },
});

export default styles;
