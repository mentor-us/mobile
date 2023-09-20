import {StyleSheet} from "react-native";
import {screenHeight, screenWidth} from "~/constants";
import {Color} from "~/constants/Color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },

  bannerContainer: {
    height: screenHeight / 1.9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.primary,
    marginBottom: 12,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },

  mainBody: {
    alignItems: "center",
    justifyContent: "space-between",
    height: screenHeight / 2.5,
  },

  welcomeText: {
    fontSize: 24,
    color: Color.text[0],
  },

  loginOptionsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  loginButton: {
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: screenWidth * 0.7,
    borderWidth: 1,
    borderRadius: 10,
  },

  buttonText: {
    textAlign: "center",
    flex: 1,
  },

  desc: {
    textAlign: "center",
  },
});

export default styles;
