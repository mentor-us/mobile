import {
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import React, { useContext, useEffect } from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import styles from "./styles";

import { observer } from "mobx-react-lite";
import { ArrowDownCircleIcon, MediaIcon } from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import { runWithLayoutAnimation } from "~/hooks/LayoutAnimation";
import { useAppDispatch, useAppSelector } from "~/redux";
import { SocketContext } from "~/context/socket";
import Actions from "./Actions";
import { useChatScreenState } from "~/context/chat";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { StorageMediaAttachemt } from "~/models/media";
import uuid from "react-native-uuid";
import SubmitButton from "./SubmitButton";
import { RichTextRef } from "./index.props";
import Animated, {
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";
import { EventActions } from "~/redux/features/event/slice";
import ReplyAction from "./ReplyAction";
import LOG from "~/utils/Logger";
import Helper from "~/utils/Helper";
import Permission from "~/utils/PermissionStrategies";

const TextEditor = () => {
  // const richText = useRef<any>();
  const state = useChatScreenState();
  const queryAction = useUpdateQueryGroupList();
  const currentUser = useAppSelector(state => state.user.data);
  const dispacher = useAppDispatch();

  /* Use global socket */
  const socket = useContext(SocketContext);

  // <============== FUNCTION  ==============>
  const hideRichToolbar = () => {
    runWithLayoutAnimation({
      processCallback() {
        state.setEnableRichToolbar(false);
      },
    });
  };

  /* On every component need socket, must have code like this below one */
  useEffect(() => {
    if (state._groupDetail) {
      socket.emit("join_room", {
        groupId: state._groupDetail?.id,
        userId: currentUser?.id,
      });
    }

    // listen text + image message
    socket.on("receive_message", response => {
      // console.log("@DUKE: receive_message", response);
      if (response.type == "MEETING" || response.type == "TASK") {
        dispacher(EventActions.setLoading(true));
      }
      state.receiveMessage(response);
    });

    // update message
    socket.on("update_message", response => {
      LOG.info("@DUKE_UPDATE MESS: ", response);

      if (response?.action && response?.action == "delete") {
        state.deleteMessage(response.messageId);
      }

      if (response?.action && response?.action == "update") {
        LOG.info("@DUKE_UPDATE MESS: ", response);

        state.updateMessage(response.messageId, response.newContent);
      }
    });

    // listen react emoji
    socket.on("receive_react_message", response => {
      // console.log("@DUKE: receive_react_message", response);
      state.receiveReact(response);
    });

    // listen remove emoji
    socket.on("receive_remove_react_message", response => {
      LOG.info("@DUKE: receive_remove_react_message", response.totalReaction);
      state.receiveRemoveReact(response);
    });

    socket.on("receive_voting", response => {
      state.addVote(response);
    });

    return () => {
      if (state._groupDetail) {
        socket.emit("out_room", {
          groupId: state._groupDetail?.id,
          userId: currentUser?.id,
        });
      }

      socket.removeListener("receive_message");
      socket.removeListener("receive_react_message");
      socket.removeListener("receive_remove_react_message");
      socket.removeListener("receive_voting");
    };
  }, [state._groupDetail.id, currentUser.id]);

  const updateLastMessage = (content: string) => {
    queryAction.updateGroupNewMessage(
      state._groupDetail.id as string,
      content,
      false,
    );
  };

  const onSend = async () => {
    try {
      const htmlContent = await RichTextRef?.current?.getContentHtml();

      const message = {
        id: `${uuid.v4().toString()}`,
        content: Helper.trimHTMLContent(htmlContent ?? ""),
        groupId: state._groupDetail.id,
        senderId: currentUser.id,
        createdDate: new Date(),
        type: "TEXT",
        reply: state.replying?.id,
      };

      socket.emit("send_message", message);
      state.sendTextMessage(message);

      const regex = /(<[^>]+>|<[^>]>|<\/[^>]>)/g;
      updateLastMessage(
        `${currentUser.name}: ${message.content?.replace(regex, "")}`,
      );

      RichTextRef?.current?.setContentHTML("");
    } catch (error) {
      LOG.error(TextEditor.name, error);
    }
  };

  const submitImage = (selectedMedia: StorageMediaAttachemt[]) => {
    state.addSelectedImage(selectedMedia, currentUser);
    updateLastMessage(`${currentUser.name} đã gửi ảnh mới.`);
  };

  const onChooseImage = async () => {
    try {
      const hasPermission = await Permission.handleReadStoragePermission();
      if (hasPermission) {
        BottomSheetModalRef.current?.show("gallery", true, {
          run: submitImage,
        });
      }
    } catch (error) {
      LOG.error(
        TextEditor.name,
        "@ERROR_PERMISSION: handleReadStoragePermission",
      );
    }
  };

  const onChangeText = (text: string) => {
    state.setSendable(Boolean(text));
  };

  const CustomLayoutTransition = values => {
    "worklet";
    return {
      animations: {
        originX: withTiming(values.targetOriginX, { duration: 70 }),
        originY: withDelay(
          70,
          withTiming(values.targetOriginY, { duration: 70 }),
        ),
        width: withSpring(values.targetWidth),
        height: withSpring(values.targetHeight),
      },
      initialValues: {
        originX: values.currentOriginX,
        originY: values.currentOriginY,
        width: values.currentWidth,
        height: values.currentHeight,
      },
    };
  };

  // <============== SIDE EFFECT  ==============>
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      event => {
        runWithLayoutAnimation({
          processCallback() {
            state.setKeyboardVisible(true); // or some other action
            state.setKeyboardHeight(event.endCoordinates.height);
          },
        });
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        runWithLayoutAnimation({
          processCallback() {
            state.setKeyboardVisible(false); // or some other action
            state.setKeyboardHeight(0);
          },
        });
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [state._groupDetail]);

  return (
    <Animated.View style={styles.container} layout={CustomLayoutTransition}>
      <ReplyAction />
      <View style={styles.inputTextContainer}>
        {/*  */}
        <View style={[GlobalStyles.horizontalFlexEnd, { maxHeight: 120 }]}>
          <SizedBox width={4} />
          {!state.isKeyboardVisible && (
            <View>
              <TouchableOpacity onPress={onChooseImage}>
                <MediaIcon width={30} height={30} />
              </TouchableOpacity>
              <SizedBox height={4} />
            </View>
          )}
          <ScrollView
            style={styles.richEditorCtn}
            showsVerticalScrollIndicator={false}>
            <RichEditor
              testID="chatbox"
              containerStyle={{ transform: [{ rotate: "180deg" }] }}
              ref={RichTextRef}
              onChange={onChangeText}
              placeholder={"Soạn tin nhắn..."}
            />
          </ScrollView>
          {!state.isKeyboardVisible && <SubmitButton onSend={onSend} />}
        </View>

        {!state.isKeyboardVisible || state.enableRichToolbar ? (
          <></>
        ) : (
          <Actions
            onSend={onSend}
            groupId={state._groupDetail.id}
            onChooseImage={onChooseImage}
          />
        )}
      </View>

      {state.enableRichToolbar && (
        <View testID="action-chat" style={styles.richToolBarCtn}>
          <RichToolbar
            editor={RichTextRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.indent,
              actions.outdent,
            ]}
          />
          <TouchableOpacity onPress={hideRichToolbar}>
            <ArrowDownCircleIcon />
          </TouchableOpacity>
        </View>
      )}
      {Platform.OS === "ios" && <SizedBox height={state.keyboardHeight} />}
    </Animated.View>
  );
};

export default observer(TextEditor);
