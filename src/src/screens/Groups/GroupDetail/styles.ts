import {StyleSheet} from "react-native";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";

export const AVATAR_SIZE = screenWidth / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  avatar_coverphoto_ctn: {
    flexDirection: "row",
    margin: 8,
    height: AVATAR_SIZE,
  },
  avatar_ctn: {
    position: "absolute",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderColor: Color.white,
    overflow: "hidden",
  },
  coverphoto_ctn: {
    backgroundColor: Color.white,
    width: screenWidth,
    height: AVATAR_SIZE,
  },
  descriptionCtn: {
    position: "absolute",
    right: 0,
    height: AVATAR_SIZE,
    justifyContent: "center",
  },
  groupCategory: {
    // fontStyle: "italic",
    fontSize: FontSize.bigger,
    color: Color.text[2],
    width: AVATAR_SIZE * 2.7,
    // textAlign: "right",
  },
  description: {
    // fontStyle: "italic",
    fontSize: FontSize.larger,
    color: Color.text[2],
    width: AVATAR_SIZE * 2.7,
    // textAlign: "right",
  },
  coverphoto: {
    width: screenWidth,
    height: AVATAR_SIZE,
    opacity: 0.5,
  },
  fullname: {
    color: Color.white,
    fontWeight: "bold",
    fontSize: FontSize.medium,
  },
  cameraIcon: {
    position: "absolute",
    right: 4,
    bottom: 4,
    padding: 6,
    backgroundColor: Color.opacity[0],
    borderRadius: 50,
    borderColor: Color.white,
    borderWidth: 1,
  },
  infoCtn: {
    marginTop: 8,
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
  editText: {
    fontSize: FontSize.large,
    color: Color.secondary,
    fontStyle: "italic",
  },
  logoutBtn: {
    paddingHorizontal: 16,
    marginRight: 4,
    marginTop: 4,
  },
  logoutText: {
    color: Color.white,
    fontSize: FontSize.large,
  },
});

export default styles;
