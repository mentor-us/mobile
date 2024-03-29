import { StyleProp, ViewStyle } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";

interface ContextMenuModalProps {
  visible: boolean;
  onDismiss: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

function ContextMenuModal({
  visible,
  onDismiss,
  containerStyle,
}: ContextMenuModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={containerStyle}>
        <Button mode="text" onPress={() => console.log("Bo ghim")}>
          <Text>Bỏ ghim</Text>
        </Button>
      </Modal>
    </Portal>
  );
}

export default ContextMenuModal;
