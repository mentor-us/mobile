import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Color.backgroundChat,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    marginBottom: 10,
    color: Color.black,
  },
  emptyBtn: {},
  floatingButtonImage: {
    position: "absolute",
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Color.primary,
    zIndex: 100,
  },
});

export default styles;
