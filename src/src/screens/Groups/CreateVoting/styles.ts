import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchCtn: { paddingVertical: 8, width: "100%" },
  switchTitle: { flex: 1, color: Color.black },
  switchBtn: { color: "#006EDC" },
  formTitle: {
    fontWeight: "700",
    fontSize: 22,
    textAlign: "center",
    color: Color.black,
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
  questionInput: {
    marginTop: 20,
    color: Color.black,
    fontWeight: "500",
    padding: 10,
    paddingTop: 20,
    borderWidth: 2,
    borderColor: "#E2E2EA",
    borderRadius: 5,
    backgroundColor: "#F7F7F7",
    textAlignVertical: "top",
  },
  plus: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
  },
  title: {
    flex: 1,
    color: Color.black,
    marginLeft: 10,
  },
  numberOfVote: {
    flexDirection: "row",
  },
  optionItemList: {
    marginTop: 4,
  },
  fieldContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E2E2EA",
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#006EDC",
    borderRadius: 20,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.white,
    fontWeight: "400",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  fieldInput: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  fieldIcon: {
    backgroundColor: "#fff",
    position: "absolute",
    right: 0,
    borderColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
    padding: 0,
    margin: 0,
  },
});

export default styles;
