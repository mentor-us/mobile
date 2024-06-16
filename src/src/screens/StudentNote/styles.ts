import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";

export default StyleSheet.create({
  itemAvatar: {
    borderWidth: 0.5,
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: { backgroundColor: "white", flex: 1 },
  userCard: { backgroundColor: "white", elevation: 2, margin: 5 },
  userCardIcon: { backgroundColor: "white" },
  emptyContainer: {
    marginTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  /** Empty */
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "#8c9197",
    textAlign: "center",
  },
  /** Fake */
  fake: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  fakeCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#e8e9ed",
    marginRight: 16,
  },
  fakeLine: {
    width: 200,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#e8e9ed",
    marginBottom: 8,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#266EF1",
    borderColor: "#266EF1",
    marginTop: "auto",
    marginHorizontal: 24,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
  // Search bar
  searchBarContainerStyle: {
    width: screenWidth * 0.92,
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: Color.white,
    padding: 0,
    margin: 0,
  },
  searchBarInputStyle: {
    padding: 0,
    marginLeft: 4,
    margin: 0,
  },
  searchBarLeftIconContainerStyle: {
    padding: 0,
    margin: 0,
  },
});
