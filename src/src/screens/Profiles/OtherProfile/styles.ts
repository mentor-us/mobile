import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '~/constants';
import { Color } from '~/constants/Color';
import FontSize from '~/constants/FontSize';

const AVATAR_SIZE = screenWidth / 3.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  avatar_coverphoto_ctn: {
    flexDirection: "row",
  },
  avatar_ctn: {
    position: "absolute",
    bottom: -AVATAR_SIZE / 3.5,
    left: screenWidth / 2 - AVATAR_SIZE / 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Color.white,
  },
  coverphoto_ctn: {
    backgroundColor: Color.primary,
  },
  coverphoto: {
    width: screenWidth,
    height: screenWidth / 2.7,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
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
    marginTop: AVATAR_SIZE / 2 + 8,
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
    // fontWeight: "bold",
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
