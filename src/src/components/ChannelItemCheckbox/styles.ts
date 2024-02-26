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
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
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
  categoryCtn: {
    flexDirection: "row",
    flex: 1,
    marginLeft: 1,
    gap: 5
  },
  descCtn: {
    flexDirection: "row",
    flex: 1,
    marginTop: 4,
  },
  textInfo: {
    fontSize: FontSize.small,
    color: Color.text[4],
    flex: 1,
  },
  textHint: {
    fontSize: FontSize.smallest,
    color: Color.gray[1],
    flex: 1,
  },
  displayName: {
    fontSize: FontSize.larger,
    color: Color.text[0],
  },
  flexRowBetween: {
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1,
  },
  itemsCenter: {
    justifyContent: "center",
    alignItems: 'center',
    // flex: 1,
  },
  pinIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: [{rotate: "45deg"}],
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default styles;
