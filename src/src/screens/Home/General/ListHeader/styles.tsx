import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    padding: 12,
  },
  shadowCtn: {
    backgroundColor: Color.white,
    borderRadius: 8,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
    marginHorizontal: 4,
  },
  titleCtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    // borderRadius: 8,
  },
  title: {
    fontSize: FontSize.larger,
    color: Color.text[4],
    fontWeight: "bold",
  },
  expandButtonCtn: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  expandButton: {
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  expandingIcon: {
    transform: [{rotate: "180deg"}],
  },
  annotationCtn: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomColor: Color.gray[0],
    borderBottomWidth: 0.7,
  },
  annotationItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  annotationTitle: {
    fontSize: FontSize.normal,
    fontWeight: "bold",
    color: Color.text[4],
    marginLeft: 8,
  },
});

export default styles;
