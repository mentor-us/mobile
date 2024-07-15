import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { Ionicons } from "@expo/vector-icons";

interface AppErrorModalProps {
  hasError: boolean;
  error: any;
  onPress: () => void;
  onRequestClose: () => void;
}

const AppErrorModal = ({
  hasError,
  error,
  onRequestClose,
  onPress,
}: AppErrorModalProps) => {
  const getErrorMessage = () => {
    if (error) {
      if (error.response) {
        const { title } = error.response.data;
        if (title === "Chỉ owner được phép xoá ghi chú") {
          return "Chỉ người sở hữu ghi chú mới được phép xoá";
        }
        return title;
      }

      return error.message;
    }

    return "";
  };

  return (
    <FancyAlert
      style={styles.alert}
      icon={
        <View style={styles.icon}>
          <Ionicons
            name={Platform.select({ ios: "ios-close", android: "md-close" })}
            size={36}
            color="#FFFFFF"
          />
        </View>
      }
      onRequestClose={onRequestClose}
      visible={hasError}>
      <View style={styles.content}>
        <Text style={styles.contentText}>{getErrorMessage()}</Text>

        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </FancyAlert>
  );
};

const styles = StyleSheet.create({
  alert: {
    backgroundColor: "#EEEEEE",
  },
  icon: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C3272B",
    width: "100%",
    borderRadius: 32,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -16,
    marginBottom: 16,
  },
  contentText: {
    textAlign: "center",
  },
  btn: {
    borderRadius: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: "stretch",
    backgroundColor: "#4CB748",
    marginTop: 16,
    minWidth: "50%",
    paddingHorizontal: 16,
  },
  btnText: {
    color: "#FFFFFF",
  },
});

export default AppErrorModal;
