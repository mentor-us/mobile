import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: Color.white,
    padding: 0,
    flex: 1,
  },
  tabItem: {
    width: 100,
    height: "100%",
    backgroundColor: Color.white,
    borderRadius: 2,
    borderColor: Color.primary,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorStyle: {
    backgroundColor: Color.white,
  },
  indicatorContainerStyle: {
    backgroundColor: Color.white,
  },
  tabTitle: {
    color: "black",
    fontSize: 16,
  },
});

export default styles;
