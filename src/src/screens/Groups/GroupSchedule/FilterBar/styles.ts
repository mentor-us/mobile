import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 0,
    margin: 0
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: Color.gray[1],
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.white,
  },
  filterActive: {
    borderWidth: 2,
    borderColor: Color.blue,
  },
  buttonText: {
    paddingHorizontal: 5,
    textAlign: "center",
    color: Color.text[0],
  },
  activeButtonText: {
    fontWeight: "500",
  }
});

export default styles;
