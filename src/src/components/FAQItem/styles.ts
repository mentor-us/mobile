import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  shadowCtn: {
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,  
    elevation: 4,
    borderRadius: 8,
    margin: 4,
    backgroundColor: Color.white,
  },
  infoCtn: {
    borderRadius: 10,
    backgroundColor: Color.backgroundChat,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    paddingVertical: 14,
    flex: 1,
  },
  detailCtn: {
    justifyContent: "space-between",
    flex: 1,
  },
  descCtn: {
    flexDirection: "row",
    flex: 1,
  },
  textQuestion: {
    fontSize: FontSize.larger,
    color: Color.text[0],
    fontWeight: "bold",
    flex: 1,
  },
  voteText: {
    color: Color.text[4],
    
  }
});

export default styles;
