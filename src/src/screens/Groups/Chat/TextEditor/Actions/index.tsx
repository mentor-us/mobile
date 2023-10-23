import {View, TouchableOpacity, Text} from "react-native";
import React from "react";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import {
  ClockIcon,
  TypographyIcon,
  TaskSquareIcon,
  MediaIcon,
  AttachmentIcon,
  ChartSquareIcon,
} from "~/assets/svgs";
import GlobalStyles from "~/constants/GlobalStyles";
import {useNavigation} from "@react-navigation/native";
import {useChatScreenState} from "~/context/chat";
import {observer} from "mobx-react-lite";
import {runWithLayoutAnimation} from "~/hooks/LayoutAnimation";
import {handleReadStoragePermission} from "~/utils/Permission";
import DocumentPicker from "react-native-document-picker";
import {SUPPORT_FILE_TYPES} from "~/constants";
import {MediaAttachment} from "~/models/media";
import Helper from "~/utils/Helper";
import SubmitButton from "../SubmitButton";
import {
  useQueryGroupList,
  useUpdateQueryGroupList,
} from "~/screens/Home/queries";
import { Color } from "~/constants/Color";

interface Props {
  onSend: any;
  groupId: string;
  onChooseImage: any;
}

const Actions = ({onSend, groupId, onChooseImage}: Props) => {
  
  // Needed data
  const navigation = useNavigation();
  const queryAction = useUpdateQueryGroupList();

  // State
  const state = useChatScreenState();
  const sendFile = state._groupDetail.permissions?.includes("SEND_FILES");
  const taskManagement =
    state._groupDetail.permissions?.includes("TASK_MANAGEMENT");
  const meetingManagement =
    state._groupDetail.permissions?.includes("MEETING_MANAGEMENT");
  const boardManagement =
    state._groupDetail.permissions?.includes("BOARD_MANAGEMENT");
  const faqManagement =
    state._groupDetail.permissions?.includes("FAQ_MANAGEMENT");

  const onCreateVoting = () => {
    navigation.navigate("createVoting", {groupId: groupId});
  };

  const onCreateMeeting = () => {
    navigation.navigate("createMeeting", {groupId: groupId});
  };

  const onCreateTask = () => {
    navigation.navigate("createTask", {groupId: groupId});
  };

  const showRichToolbar = () => {
    runWithLayoutAnimation({
      processCallback() {
        state.setEnableRichToolbar(true);
      },
    });
  };

  const onPickFile = async () => {
    try {
      const hasPermission = await handleReadStoragePermission();
      if (hasPermission) {
        const data = await DocumentPicker.pick({
          type: SUPPORT_FILE_TYPES,
          allowMultiSelection: false,
        });

        const fileList = data
          .map(item => {
            const file: MediaAttachment = {
              id: item.name + Helper.getRandomString(),
              filename: item.name || "",
              mime: item.type ?? "File",
              size: item.size ?? 0,
              path: item.uri,
              uploadStatus: "Standby",
              isUploaded: false,
              isSelected: false,
            };
            return file;
          })
          .filter(file => file);
        if (fileList.length > 0) {
          state.addSeleledFile(fileList[0], state._currentUser);

          const newMessage = `${state._currentUser.name} đã gửi tệp đính kèm mới.`;
          queryAction.updateGroupNewMessage(
            state._groupDetail.id as string,
            newMessage,
            false,
          );
        }
      }
    } catch (error) {
      console.log("Error on select file: ", error);
    }
  };

  return (
    <View style={styles.actionBtnCtn}>
      {state.editing ? (
        <View style={styles.editingMessCtn}>
          <Text style={styles.editingMess}>Đang sửa tin nhắn</Text>
        </View>
      ) : (
        <View style={GlobalStyles.horizontalCenter}>
          <SizedBox width={2} />
          {/* Check permission to hide/show */}
          <TouchableOpacity onPress={onChooseImage}>
            <MediaIcon width={32} height={32} />
          </TouchableOpacity>
          <SizedBox width={6} />
          {sendFile && (
            <>
              <TouchableOpacity onPress={onPickFile}>
                <AttachmentIcon width={30} height={30} />
              </TouchableOpacity>
              <SizedBox width={6} />
            </>
          )}
          {meetingManagement && (
            <>
              <TouchableOpacity testID="clock-icon" onPress={onCreateMeeting}>
                <ClockIcon width={32} height={32} />
              </TouchableOpacity>
              <SizedBox width={10} />
            </>
          )}
          {taskManagement && (
            <>
              <TouchableOpacity testID="task-icon"  onPress={onCreateTask}>
                <TaskSquareIcon width={30} height={30} />
              </TouchableOpacity>
              <SizedBox width={10} />
            </>
          )}
          {boardManagement && (
            <>
              <TouchableOpacity testID="vote-icon"  onPress={onCreateVoting}>
                <ChartSquareIcon width={32} height={32} />
              </TouchableOpacity>
              <SizedBox width={10} />
            </>
          )}
          <TouchableOpacity onPress={showRichToolbar}>
            <TypographyIcon width={26} height={26} />
          </TouchableOpacity>
        </View>
      )}

      {/* <TouchableOpacity onPress={onSend} disabled={!state.sendable}>
        <SendIcon focused={state.sendable} />
      </TouchableOpacity> */}

      <SubmitButton onSend={onSend} />
    </View>
  );
};

export default observer(Actions);
