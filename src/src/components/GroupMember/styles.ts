import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
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
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    flex: 1,
  },
  avatarCtn: {
    position: "relative",
    marginRight: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 8,
  },
  detailCtn: {
    justifyContent: "space-between",
    flex: 1,
  },
  descCtn: {
    flexDirection: "row",
    flex: 1,
  },
  textInfo: {
    fontSize: FontSize.small,
    flex: 1,
    color: Color.text[5],
  },
  displayName: {
    fontSize: FontSize.large,
    color: Color.text[0],
    // fontWeight: "bold",
  },
  flexRowBetween: {
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1,
  },

  markButton: {
    padding: 8,
  },
});

export default styles;
