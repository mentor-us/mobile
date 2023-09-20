import {StyleSheet} from "react-native";
import { screenHeight } from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    marginRight: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: Color.white,
    marginHorizontal: 2,
    borderRadius: 24,
  },
  headerBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  closeBtn: {
    color: Color.red,
    marginLeft: 3
  },
  reopenBtn: {
    color: Color.green,
    marginLeft: 3
  },
  header: {
    padding: 0,
    margin: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 10,
    width: "90%",
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  openTitleText: {
    color: Color.text[5],
  },
  lockHeaderTitle: {
    color: Color.red,
    marginLeft: 4,
    fontWeight: "500"
  },
  headerIcon: {width: 30, height: 30, marginRight: 12},
  formTitle: {
    fontWeight: "700",
    fontSize: 22,
    textAlign: "left",
    color: Color.text[0],
  },
  info: {
    color: Color.text[5],
    fontSize: 13,
    textAlign: "left",
  },
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  titleContainer: {
    margin: 0,
    padding: 0,
  },
  labelText: {
    fontSize: FontSize.large,
    fontWeight: "500",
    marginTop: 10,
    color: Color.primary,
  },

  icon: {
    marginRight: 5,
    fontWeight: "700",
  },
  lineSeparator: {
    height: 0.5,
    backgroundColor: Color.lineSeparator,
    elevation: 1,
    marginVertical: 5,
  },
  hint: {
    color: Color.primary,
    marginVertical: 15,
  },
  optionItemList: {},
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  optionItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: Color.backgroundChat,
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
  },
  fieldInput: {
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxCtn: {
    padding: 0,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    zIndex: 9999,
  },
  choiceContent: {
    color: Color.black,
    fontSize: FontSize.large,
  },
  fieldIcon: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 5,
    right: 5,
    borderColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
    padding: 0,
    margin: 0,
  },
  voterCtn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 7,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
  },
  input: {
    flex: 1,
    padding: 6,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.lineSeparator,
  },
  checkbox: {
    backgroundColor: Color.primary,
  },
  plus: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Color.primary,
    borderRadius: 20,
    marginTop: 12,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: Color.white,
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.white,
  },
  endBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Color.backgroundGray,
    borderRadius: 20,
    marginTop: 12,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: Color.white,
  },
  endTextBtn: {
    fontSize: FontSize.large,
    color: Color.text[0],
  },
  okeBtn: {
    color: Color.white,
    marginRight: 10,
    borderRadius: 30,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Color.border,
    borderWidth: 0.5,
  },
  okeText: {
    color: Color.white,
    fontWeight: "bold",
    fontSize: FontSize.large,
  },
});

export default styles;
