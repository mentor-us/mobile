import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleCtn: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.medium,
    marginLeft: 20,
    color: Color.text[0],
    fontWeight: "500",
    marginRight: 5
  },
  infoCtn: {
    marginHorizontal: 16,
  },
  infoTitle: {
    fontSize: FontSize.larger,
    color: Color.primary,
    fontWeight: "bold",
    marginBottom: 4
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
    fontSize: FontSize.larger
  },
  infoHistory:{ 
    marginHorizontal: 16,
    marginVertical: 20,
  },
  historyTitle: {
    fontSize: FontSize.larger,
    color: Color.primary,
    fontWeight: "bold",
    marginBottom: 12
  },
  error: {
    color: Color.black,
  },
});

export default styles;
