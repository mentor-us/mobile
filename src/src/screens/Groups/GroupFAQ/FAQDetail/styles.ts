import {StyleSheet} from "react-native";
import { screenWidth } from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  questionCtn: {
    flex: 1,
    paddingVertical: 10,
    borderColor: Color.gray[2],
    borderWidth: 1,
    padding: 10,
    borderRadius: 10
  },
  answerCtn: {
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: Color.gray[2],
    borderBottomWidth: 1,
  },
  icon: {
    paddingTop: 12,
    width: 40,
  },
  fieldName: {
    fontSize: FontSize.large,
    color: Color.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  questionInput:{
    fontSize: FontSize.larger,
    color: Color.text[0],
    textAlignVertical: 'top',
    fontStyle: "italic"
  },
  answerInput:{
    fontSize: FontSize.larger,
    color: Color.text[0],
    textAlignVertical: 'top',
    fontWeight: "500"
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginBottom: 10
  },
  groupTitle: {
    color: Color.primary,
    fontSize: FontSize.medium,
    fontWeight: "500"
  },
  categoryTitle: {
    color: Color.text[5],
    fontSize: 13,
  },
  lineSeparator: {
    height: 0.5,
    backgroundColor: Color.lineSeparator,
    elevation: 1,
    marginVertical: 10,
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 6,
    backgroundColor: '#006EDC',
    borderRadius: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 100,
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.white,
    fontWeight: '400',
    padding: 1,
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
  sureBtn: {
    color: Color.primary,
    fontWeight: "bold",
    fontSize: FontSize.larger,
  },
  hint: {
    color: Color.green,
    marginTop: 10
  },
  voteCtn: {
    flex: 1,
    backgroundColor: Color.backgroundGray,
    marginTop: 20,
    padding: 20,
    borderRadius: 7,
  },
  voteText: {
    color: Color.black,
    fontSize: FontSize.large,
    textAlign: "center",
  },
  btnGroup: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  errorText: {
    color: Color.red,
  }
});

export default styles;
