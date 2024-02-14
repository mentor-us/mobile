import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
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
    padding: 16,
    borderRadius: 7,
    maxWidth: screenWidth * 0.8,
    width: screenWidth * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "85%",
    marginBottom: 10,
  },
  icon: { width: 30, height: 30, marginRight: 12 },
  votingTitle: {
    color: Color.text[0],
    fontSize: FontSize.larger,
    fontWeight: "bold",
  },
  hint: {
    color: Color.primary,
  },
  hintCtn: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  lockHint: {
    color: Color.red,
    marginLeft: 4,
  },
  lineSeparator: {
    height: 0.5,
    backgroundColor: Color.lineSeparator,
    elevation: 1,
    marginVertical: 5,
  },
  optionItemList: {
    marginTop: 16,
  },
  optionItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.backgroundGray,
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
  },
  percentView: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Color.votePercentColor,
    width: 0,
    marginBottom: 0,
    padding: 0,
    borderRadius: 5,
  },
  choiceCtn: {
    width: "93%",
    zIndex: 1000,
  },
  choiceContent: {
    color: "#000",
  },
  choiceNumber: {
    color: Color.green,
    fontWeight: "600",
    zIndex: 1000,
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
});

export default styles;
