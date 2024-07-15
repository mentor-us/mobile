import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleCtn: {
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: FontSize.medium,
    marginLeft: 20,
    color: Color.text[0],
    fontWeight: "500",
    marginRight: 5,
  },
  infoCtn: {
    marginHorizontal: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: FontSize.huge,
    color: Color.text[0],
    fontWeight: "bold",
    marginLeft: 2,
  },
  groupName: {
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: "bold",
    color: Color.primary,
    fontSize: FontSize.larger,
  },
  statusCtn: {
    flex: 1,
    backgroundColor: Color.white,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: FontSize.large,
    color: Color.primary,
    fontWeight: "bold",
  },
  buttonCtn: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  error: {
    color: Color.black,
  },
});

export default styles;
