import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },

  container: {
    backgroundColor: Color.white,
    padding: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    maxWidth: screenWidth * 0.8,
    width: screenWidth * 0.8,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: Color.black,
    // shadowOffset: {
    //   width: 0,
    //   height: -1,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 1.5,
    // elevation: 5,
    // borderLeftWidth: 3,
    // borderLeftColor: Color.red
    
  },
  header: {
    flex: 1,
    backgroundColor: Color.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    marginLeft: 4,
    fontSize: FontSize.larger,
    color: Color.red,
    fontWeight: "bold",
  },
  hint: {
    fontSize: FontSize.larger,
    //fontStyle: "italic",
    color: Color.green,
    fontWeight: "bold",
  },
  optionItemList: {
    marginTop: 16,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 6,
    backgroundColor: Color.backgroundGray,
    borderRadius: 20,
    marginTop: 12,
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.text[0],
    textAlign: "center"
  },
  timeDesc: {
    fontSize: FontSize.medium,
    color: Color.text[0],
    marginTop: 8,
    fontWeight: "500",
  },
  dateDesc: {
    fontSize: FontSize.large,
    color: Color.text[5],
  },
});

export default styles;
