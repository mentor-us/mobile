import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    justifyContent: "space-between",
    marginHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    position: "absolute",
    top: 4,
    width: screenWidth - 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    contanerExp: {},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  expandCtn: {
    flexDirection: "column",
  },
  moreBtn: {
    zIndex: 2,
    padding: 8,
    borderWidth: 0.5,
    borderColor: Color.gray[4],
    borderRadius: 50,
    margin: 8,
    width: 40,
    height: 40,
  },
  rotate: {
    transform: [{ rotate: "180deg" }],
  },
  itemCtn: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,

    width: "100%",
    // backgroundColor: "red",
  },
  itemCtnExpaned: {
    width: screenWidth - 16,
  },
  headerCtn: {
    flexDirection: "row",
    width: screenWidth - 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.larger,
    color: Color.black,
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default styles;
