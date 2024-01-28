import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.transparent,
    // flex: 1,
  },
  fieldContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  paddingItem:{
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  itemCtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  pinned: {
    backgroundColor: Color.gray[0],
  },
  emptyText: {
    textAlign: "center",
    fontSize: FontSize.larger,
    color: Color.text[4],
    width: screenWidth * 0.9,
    alignSelf: "center",
    margin: 8,
  },
  reloadBtnText: {
    color: Color.white,
  },
  reloadBtn: {
    alignSelf: "center",
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dimmedText: {
    color: Color.text[4],
    fontStyle: "italic",
  },
  reviewMessageContainer: {
    flexDirection:'column',
    paddingHorizontal:12,
    paddingVertical:10,
    maxHeight: "50%",
    // flex: 1
  },
  messageContainer: {
    marginTop: 5,
    backgroundColor: Color.white,
    // maxWidth: screenWidth*0.95,
    // minWidth: screenWidth*0.95,
    maxHeight: "100%",
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderTopLeftRadius: 0,
    borderColor: "#ccc",
  },
  textInfo: {
    fontSize: FontSize.small,
    color: Color.text[4],
  },
  textHint: {
    fontSize: FontSize.smallest,
    color: Color.gray[1],
  },
  displayName: {
    fontSize: FontSize.larger,
    color: Color.text[0],
  },
  
  boldText: {
    fontWeight: "400",
  },
});

export default styles;
