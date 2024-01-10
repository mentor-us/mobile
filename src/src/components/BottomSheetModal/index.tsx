import { View } from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { BottomSheetRef, ModalType } from "./index.props";
import Modal from "react-native-modal";
import styles from "./styles";
import EmojiReaction from "./EmojiReaction";
import { screenHeight, screenWidth } from "~/constants";
import Gallery from "./Gallery";
import ImageSliderShow from "./ImageSliderShow";
import UserReacted from "./UserReacted";
import { ChoiceResultList } from "./ChoiceResultList";
import StatusBox from "./StatusBox";
import GroupChatThreads from "./GroupChatThreads";

const BottomSheetModal = (_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType | undefined>(undefined);
  const [data, setData] = useState<any>();
  const [action, setAction] = useState<any>({ run: () => {} });

  const show = (type: ModalType, data: any, action: any) => {
    setModalType(type);
    setData(data);
    setAction(action);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, (): BottomSheetRef => {
    return {
      show,
      hide,
    };
  });

  const renderContent = (type?: ModalType) => {
    switch (type) {
      case "emoji_reaction":
        return <EmojiReaction message={data} action={action} />;
      case "gallery":
        return <Gallery action={action} isMulti={data} />;
      case "image_slider":
        return <ImageSliderShow images={data.images} index={data.index} />;
      case "user_reacted":
        return <UserReacted reactions={data} />;
      case "choice_result":
        return <ChoiceResultList choice={data.choice} groupId={data.groupId} />;
      case "status_box":
        return <StatusBox taskId={data} />;
      case "group_chat_threads":
        return <GroupChatThreads taskId="" />;
      default:
        return <></>;
    }
  };

  return (
    <Modal
      animationIn={"fadeInUp"}
      animationOut={"fadeOutDown"}
      isVisible={visible}
      onBackdropPress={hide}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
      deviceHeight={screenHeight + 50}
      deviceWidth={screenWidth}
      onBackButtonPress={() => {
        if (visible) {
          setVisible(false);
        }
      }}
      backdropTransitionOutTiming={0}
      style={styles.container}>
      <View>{renderContent(modalType)}</View>
    </Modal>
  );
};

export default forwardRef<BottomSheetRef, any>(BottomSheetModal);
