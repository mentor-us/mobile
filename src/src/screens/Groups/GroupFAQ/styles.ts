import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  },
  floatingButtonImage: {
    position: "absolute",
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Color.primary,
    zIndex: 100,
  },
  emptyText: {
    color: Color.black,
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    marginTop: -10,
  },
});

export default styles;
