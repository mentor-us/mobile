import { TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import { ArrowheadDownIcon } from "~/assets/svgs";
import { useChatScreenState } from "~/context/chat";
import { observer } from "mobx-react-lite";
import PinnedItem from "./PinnedItem";
import { runWithLayoutAnimation } from "~/hooks/LayoutAnimation";
import Animated, {
  FadeIn,
  ZoomInEasyUp,
  withTiming,
} from "react-native-reanimated";
import GroupApi from "~/api/remote/GroupApi";
import ContextMenuModal from "./ContextMenuModal";
import { StyleProp } from "react-native";

const PinnedMessages = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    alignSelf: "center",
  };

  const state = useChatScreenState();
  const [expanding, setExpanding] = useState<boolean>(false);

  const expand = () => {
    runWithLayoutAnimation({
      processCallback: () => {
        setExpanding(prev => !prev);
      },
    });
  };

  if (
    !state._groupDetail.pinnedMessages ||
    state._groupDetail.pinnedMessages.length == 0
  ) {
    return <></>;
  }
  const CustomLayoutTransition = values => {
    "worklet";
    return {
      animations: {
        height: withTiming(values.targetHeight, { duration: 500 }),
      },
      initialValues: {
        height: values.currentHeight,
      },
    };
  };

  const unpinMessage = async (messageId: string) => {
    state.removePinnedMessage(messageId);
    await GroupApi.unpinMessage(state._groupDetail.id, messageId);
  };

  const onItemLongPress = () => { };

  const onItemPress = async id => {
    state.setScrollToId(id);
    const index = state._messageList.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    state._messageFlatlistRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <>
      <ContextMenuModal
        visible={visible}
        onDismiss={hideModal}
        containerStyle={containerStyle}
      />
      <Animated.View
        testID="pinned-msg"
        style={[styles.container, expanding && styles.expandCtn]}
        layout={CustomLayoutTransition}>
        <View style={expanding ? styles.headerCtn : { zIndex: 2 }}>
          {expanding && (
            <Animated.Text entering={FadeIn.delay(500)} style={styles.title}>
              Danh sách đã ghim
            </Animated.Text>
          )}
          <TouchableOpacity
            testID="expand-pin-msg-icon"
            style={[styles.moreBtn, expanding && styles.rotate]}
            onPress={expand}>
            <ArrowheadDownIcon fill="black" />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={expanding ? styles.itemCtnExpaned : styles.itemCtn}>
          {expanding ? (
            <Animated.View
              entering={ZoomInEasyUp.duration(500)}
              exiting={undefined}>
              {state._groupDetail.pinnedMessages?.map(item => {
                return (
                  <PinnedItem
                    key={`${item.id}`}
                    message={item}
                    expanding={expanding}
                    unpinMessage={unpinMessage}
                    onLongPress={onItemLongPress}
                    onPress={onItemPress}
                  />
                );
              })}
            </Animated.View>
          ) : (
            <PinnedItem
              message={state._groupDetail.pinnedMessages[0]}
              expanding={expanding}
              unpinMessage={unpinMessage}
              onPress={onItemPress}
            />
          )}
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default observer(PinnedMessages);
