import { StyleSheet } from "react-native";

export default StyleSheet.create({
  fieldContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  textAreaContainer: {
    backgroundColor: "#e7e7eb",
    borderColor: "#b4b4b7",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  multiSelectBackdrop: {
    // backgroundColor: "rgba(255, 183, 0, 0.2)",
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#bbb",
    padding: 12,
    marginBottom: 12,
  },
  multiSelectChipContainer: {
    borderWidth: 0,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  multiSelectChipText: {
    color: "#222",
    fontSize: 14.5,
  },

  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },

  // Submit button
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitButton: {
    height: 48,
  },
});
