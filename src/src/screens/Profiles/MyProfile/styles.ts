import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const AVATAR_SIZE = screenWidth / 3.5;

const styles = StyleSheet.create({
  avatar: {
    borderColor: Color.white,
    borderRadius: 100,
    borderWidth: 3,
    height: AVATAR_SIZE,
    overflow: "hidden",
    width: AVATAR_SIZE,
  },
  avatar_coverphoto_ctn: {
    flexDirection: "row",
  },
  avatar_ctn: {
    bottom: -AVATAR_SIZE / 3.5,
    left: screenWidth / 2 - AVATAR_SIZE / 2,
    overflow: "hidden",
    position: "absolute",
  },
  cameraIcon: {
    backgroundColor: Color.opacity[0],
    borderColor: Color.white,
    borderRadius: 50,
    borderWidth: 1,
    bottom: 4,
    padding: 6,
    position: "absolute",
    right: 4,
  },
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  coverphoto: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: screenWidth / 2.5,
    width: screenWidth,
  },
  coverphoto_ctn: {
    backgroundColor: Color.primary,
  },
  editText: {
    color: Color.secondary,
    fontSize: FontSize.large,
    fontStyle: "italic",
  },
  fullname: {
    color: Color.white,
    fontSize: FontSize.medium,
    fontWeight: "bold",
  },
  infoCtn: {
    marginHorizontal: 16,
    marginTop: AVATAR_SIZE / 2 + 8,
  },
  infoHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    color: Color.text[0],
    fontSize: FontSize.huge,
    fontWeight: "bold",
    marginLeft: 2,
  },
  loading: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  logoutBtn: {
    marginRight: 4,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: Color.white,
    fontSize: FontSize.large,
  },
  referenceAccountContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

export default styles;
