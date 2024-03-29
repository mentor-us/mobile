import { StyleSheet } from "react-native";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

const styles = StyleSheet.create({
  rowCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileItemContainer: {
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderColor: "#E0E0E0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  fileList: {
    paddingHorizontal: 16,
  },
  fileCtn: {
    marginLeft: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoCtn: {
    flex: 1,
  },
  fileName: {
    color: "#444",
    fontSize: 13,
    lineHeight: FontSize.huge,
    width: "100%",
  },
  fileSize: {
    color: "#777",
    fontSize: 11,
    lineHeight: FontSize.huge,
    maxWidth: "100%",
  },

  iconContainer: {
    backgroundColor: "#00000044",
    borderColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    padding: 2,
    position: "absolute",
    right: 2,
    top: 2,
  },

  statusLayer: {
    alignItems: "center",
    backgroundColor: "#00000016",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
    borderRadius: 8,
  },
  downloadBtn: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: Color.gray[0],
  },
  failedLayer: {
    alignItems: "center",
    backgroundColor: "#000a",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
    borderRadius: 8,
  },
  failedText: {
    color: Color.white,
    fontWeight: "bold",
  },
});

export default styles;
