/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import MentionListPopup from "../MentionListPopup";
import { GroupMemberModel } from "~/models/group";
import MessageServices from "~/services/messages";
import { SecureStore } from "~/api/local/SecureStore";

const mentionRegex = /(?<= |<.*>)@\w*(?=<\/.*>)|^@\w*/gim;
// const mentionRegex = /(?<=<[^>]*\s|<.*>)@(\w+)(?=\s*<\/.*>|>)/gim;

const TextEditor = () => {
  // const richText = useRef<any>();
  const [openMention, setOpenMention] = useState<boolean>(false);
  const [searchMentionName, setSearchMentionName] = useState<string>("");
  const [mentionList, setMentionList] = useState<string[]>([]);

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

  const setCaretToEnd = () => {
    const placeCaretAtEnd =
      'function placeCaretAtEnd(el) {\
          el.focus();\
          if (typeof window.getSelection != "undefined"\
                  && typeof document.createRange != "undefined") {\
              var range = document.createRange();\
              range.selectNodeContents(el);\
              range.collapse(false);\
              var sel = window.getSelection();\
              sel.removeAllRanges();\
              sel.addRange(range);\
          } else if (typeof document.body.createTextRange != "undefined") {\
              var textRange = document.body.createTextRange();\
              textRange.moveToElementText(el);\
              textRange.collapse(false);\
              textRange.select();\
          }\
      } \
      placeCaretAtEnd($("#content"))';
    RichTextRef?.current?.commandDOM(placeCaretAtEnd);
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
        `${currentUser.name}: ${message.content
          ?.replace(regex, "")
          ?.replace(/&nbsp;/gim, " ")}`,
      );

      // if (mentionList.length > 0) {
      //   setTimeout(async () => {
      //     try {
      //       await MessageServices.mentionMembers(message.id, mentionList);
      //     } catch (error) {
      //       LOG.error(
      //         `Mention Error. Message ID: ${
      //           message.id
      //         }. Members ID: ${mentionList.join(", ")}`,
      //       );
      //     } finally {
      //       setMentionList([]);
      //       setOpenMention(false);
      //       setSearchMentionName("");
      //     }
      //   }, 1000);
      // }

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

  const mentionBuilder = (member: GroupMemberModel) => {
    return `<a  class="mention" contenteditable="false" data-user-id="${member.id}">@${member.name}</a><span style="">&nbsp;</span>`;
  };

  const insertMention = async (member: GroupMemberModel) => {
    setMentionList(prev => Array.from(new Set([...prev, member.id]).values()));
    const text = await RichTextRef?.current?.getContentHtml();
    RichTextRef?.current?.setContentHTML(
      text?.replace(mentionRegex, mentionBuilder(member)) ?? "",
    );

    setCaretToEnd();
  };

  const extractMention = (text: string): string => {
    const mentionList = text.match(mentionRegex);
    return mentionList && mentionList.length !== 0 ? mentionList[0] : "";
  };

  const onChooseMention = async (member: GroupMemberModel) => {
    await insertMention(member);
    setOpenMention(false);
    setSearchMentionName("");
  };

  const removeMention = () => {
    console.log("removeMention");
    const cmd =
      '\
    function test() {\
        var sel = rangy.getSelection(); \
    console.log("sel.rangeCount", sel.rangeCount);\
    if (sel.rangeCount === 0) {\
        return;\
    }\
    var selRange = sel.getRangeAt(0);\
    console.log("selRange.collapsed", selRange.collapsed); \
    if (!selRange.collapsed) {\
      return;\
    }\
    var element = selRange.startContainer;\
    console.log("ele", element); \
    var isMention = element.parentElement.getAttribute("class") === "mention";\
    console.log("isMention", isMention); \
    if (isMention) {\
      element.parentElement.remove();\
      return;\
    } \
    var nonEditable = selRange.startContainer.previousSibling;\
    if (!nonEditable) {\
        return;\
    }\
    var range = rangy.createRange();\
    range.collapseAfter(nonEditable);\
    if (selRange.compareBoundaryPoints(range.START_TO_END, range) == -1) {\
        return;\
    }\
    range.setEnd(selRange.startContainer, selRange.startOffset);\
    if (range.toString() === "") {\
        selRange.collapseBefore(nonEditable);\
        nonEditable.parentNode.removeChild(nonEditable);\
        sel.setSingleRange(selRange);\
        \
        return false;\
    }\
      } rangy.init(); test();';
    // RichTextRef?.current?.commandDOM(cmd);
    const cmd2 =
      '\
      function placeCaretAtEnd(el) {\
          el.focus();\
          if (typeof window.getSelection != "undefined"\
                  && typeof document.createRange != "undefined") {\
              var range = document.createRange();\
              range.selectNodeContents(el);\
              range.collapse(false);\
              var sel = window.getSelection();\
              sel.removeAllRanges();\
              sel.addRange(range);\
          } else if (typeof document.body.createTextRange != "undefined") {\
              var textRange = document.body.createTextRange();\
              textRange.moveToElementText(el);\
              textRange.collapse(false);\
              textRange.select();\
          }\
      } \
      function removeFunc() {\
        var sel = rangy.getSelection(); \
        if (sel.rangeCount === 0) {\
            return;\
        }\
        var selRange = sel.getRangeAt(0);\
        if (!selRange.collapsed) {\
          return;\
        }\
        var element = selRange.startContainer;\
        console.log("ele", element.parentElement); \
        if (element.parentElement) {\
          var isMention = element.parentElement.getAttribute("class") === "mention";\
          console.log(isMention);\
          if (isMention) {\
            var parent = element.parentElement;\
            console.log(parent.textContent);\
            console.log(parent.parentElement);\
            placeCaretAtEnd(parent.parentElement);\
            parent.remove();\
            return;\
          } \
        }\
        var nonEditable = selRange.startContainer.previousSibling;\
        if (!nonEditable) {\
            return;\
        }\
        var range = rangy.createRange();\
        range.collapseAfter(nonEditable);\
        if (selRange.compareBoundaryPoints(range.START_TO_END, range) == -1) {\
            return;\
        }\
        range.setEnd(selRange.startContainer, selRange.startOffset);\
        if (range.toString() === "") {\
            selRange.collapseBefore(nonEditable);\
            nonEditable.parentNode.removeChild(nonEditable);\
            sel.setSingleRange(selRange);\
            return false;\
        }\
      }\
      rangy.init();\
      removeFunc();';
    RichTextRef?.current?.commandDOM(cmd2);
  };

  const onChangeText = async (text: string) => {
    // LOG.error(Helper.extractTextOnlyFromHTML(text));
    LOG.debug(TextEditor.name, "onChangeText", text);

    removeMention();
    if (!text || text === "<div><br></div>") {
      RichTextRef?.current?.setContentHTML("");
      // console.log(await RichTextRef?.current?.getContentHtml());
      setOpenMention(false);
      setSearchMentionName("");
      state.setSendable(false);
      return;
    }

    const mention = extractMention(text);
    if (mention) {
      setOpenMention(true);
      setSearchMentionName(mention.replace("@", ""));
    } else if (openMention) {
      setOpenMention(false);
      setSearchMentionName("");
    }

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

  const isPrivateGroup = state._groupDetail?.type === "PRIVATE_MESSAGE";

  return (
    <Animated.View style={styles.container} layout={CustomLayoutTransition}>
      <ReplyAction />

      {/* Member List */}
      <View>
        {!isPrivateGroup && (
          <MentionListPopup
            groupId={state._groupDetail.id}
            searchName={searchMentionName}
            height={150}
            isShow={openMention}
            onChoose={onChooseMention}
          />
        )}
        <View style={styles.inputTextContainer}>
          {/*  */}
          <View style={[GlobalStyles.horizontalCenter, { maxHeight: 120 }]}>
            <SizedBox width={4} />
            {!state.isKeyboardVisible && (
              <View>
                <TouchableOpacity onPress={onChooseImage}>
                  <MediaIcon width={30} height={30} />
                </TouchableOpacity>
              </View>
            )}
            <ScrollView
              style={styles.richEditorCtn}
              showsVerticalScrollIndicator={false}>
              <RichEditor
                testID="chatbox"
                editorInitializedCallback={() => {
                  RichTextRef?.current?.commandDOM(
                    `\
                    var script = document.createElement('script');\
                    script.src="https://cdnjs.cloudflare.com/ajax/libs/rangy/1.3.1/rangy-core.min.js";\
                    script.integrity="sha512-ZCkgV0SdoJJvBjlkwMpNZFSQzDWtB2ftYwOJQqwQUaXjfVLeUrxIfPMCxSaxVCXfFL82ccmjn6TTbkXjL3w2pA==";
                    script.crossOrigin="anonymous";\
                    script.referrerpolicy="no-referrer";\
                    document.head.appendChild(script);
                    `,
                  );
                }}
                editorStyle={{
                  cssText:
                    "pre { all: initial;} \
                      .mention {\
                      display: inline-block;\
                      color: #0000EE;\
                      border-radius: 5px;\
                      padding: 2px 5px;\
                    }\
                    .mention:hover {\
                      background-color: #ccc;\
                    }",
                }}
                containerStyle={{ transform: [{ rotate: "180deg" }] }}
                ref={RichTextRef}
                onChange={onChangeText}
                onBlur={() => setOpenMention(false)}
                pasteAsPlainText={true}
                placeholder={"Soạn tin nhắn..."}
              />
            </ScrollView>
            {!state.isKeyboardVisible && <SubmitButton onSend={onSend} />}
          </View>

          {state.isKeyboardVisible && !state.enableRichToolbar && (
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
      </View>
    </Animated.View>
  );
};

export default observer(TextEditor);
