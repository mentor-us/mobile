import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.gray[0],
    flex: 1,
  },
  headerCtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navTitleCtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: FontSize.medium,
    marginLeft: 16,
    color: "#fff",
  },
  // searchInputText: {
  //   borderRadius: 32,
  //   borderWidth: 0.5,
  //   borderColor: '#fff',
  //   lineHeight: FontSize.larger,
  //   fontSize: FontSize.large,
  //   height: 40,
  //   paddingHorizontal: 16,
  //   backgroundColor: '#fff',
  //   elevation: 2,
  //   flex: 1,
  //   marginRight: 8,
  // },
});

export default styles;
