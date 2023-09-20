import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    backgroundColor: Color.white,
  },
  fieldContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomColor: Color.border,
    borderBottomWidth: 0.7,
    justifyContent: "space-between",
  },
  valueText: {
    // fontWeight: "bold",
    fontSize: FontSize.large,
    color: Color.text[0],
  },
  dropdownCtn: {
    borderRadius: 8,
    shadowColor: Color.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 16,
  },
  dropDownText: {
    fontSize: FontSize.large,
    color: Color.text[2],
  },
  label: {
    fontSize: FontSize.large,
    color: Color.text[3],
  },
  groupName: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Color.text[0],
  },
  deleteBtn: {
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: screenWidth,
    padding: 16,
    borderTopWidth: 0.75,
    borderColor: Color.border,
  },
  deleteText: {
    color: Color.red,
    fontWeight: "bold",
    fontSize: FontSize.larger,
  },
});

export default styles;
