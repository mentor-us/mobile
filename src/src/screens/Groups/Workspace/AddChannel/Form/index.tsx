import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { View } from "react-native-animatable"
import { useAddChannelScreenState } from "~/context/channel";
import styles from "./style";
import { Alert, AlertButton, DeviceEventEmitter, ScrollView, Text, TouchableOpacity } from "react-native";
import GlobalStyles from "~/constants/GlobalStyles";
import { GroupIcon, MarkTitleIcon, ParagraphIcon } from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import MUITextInput from "~/components/MUITextInput";
import GroupApi from "~/api/remote/GroupApi";
import EventEmitterNames from "~/constants/EventEmitterNames";

const Form = () => {
    const state = useAddChannelScreenState();
    const navigation = useNavigation();

    const deleteChannel = async () => {
      Alert.alert("Cảnh báo", "Bạn có chắc chăn muốn xóa kênh này không?", [
        {text: "Hủy"},
        {
          text: "Xác nhận",
          onPress: async () => {
            if (state.channelId) {
              await GroupApi.removeChannel(state.channelId);
            }
  
            DeviceEventEmitter.emit(EventEmitterNames.refreshWorkspace, {
              status: true,
              message: "Xóa kênh thành công.",
            });
            navigation.navigate("workspace", {groupId: state.groupData.id});
          },
        },
      ] as AlertButton[]);
    };
  
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* Group Name - Select Group */}
          <TouchableOpacity
            disabled={true}
            style={[GlobalStyles.flexRow, {justifyContent: "space-between"}]}>
            <Text
              style={styles.groupName}>{`Nhóm: ${state.groupData.name}`}</Text>
            {/* <EditIcon /> */}
          </TouchableOpacity>
          {/* Title */}
          <View style={styles.fieldContainer}>
            <View>
              <SizedBox height={16} />
              <MarkTitleIcon />
            </View>
            <SizedBox width={16} />
            <MUITextInput
              label="Tên kênh *"
              keyboardType={"default"}
              value={state.name}
              onChangeText={text => {
                state.setName(text);
              }}
              multiline
              numberOfLines={2}
              errorText={state.nameError}
              style={{textAlignVertical: "top"}}
            />
          </View>
  
          {/* Description */}
          <View style={styles.fieldContainer}>
            <View>
              <SizedBox height={16} />
              <ParagraphIcon width={24} height={24} />
            </View>
            <SizedBox width={16} />
            <MUITextInput
              label="Mô tả"
              keyboardType={"default"}
              value={state.description}
              onChangeText={text => {
                state.setDescription(text);
              }}
              multiline
              numberOfLines={4}
            />
          </View>
  
          {/* Assingee */}
          <TouchableOpacity
            onPress={() => {
              state.setScreenType("select_assignee");
            }}>
            <View style={[GlobalStyles.flexRow]}>
              <View style={GlobalStyles.flexRow}>
                <GroupIcon width={28} height={28} />
                <SizedBox width={12} />
              </View>
              <View style={styles.button}>
                <Text style={styles.label}>Thành viên *</Text>
                <Text style={[styles.valueText, GlobalStyles.rightText]}>
                  {state.assignees.checkedAll === "checked"
                    ? "Tất cả"
                    : `${state.assignees.totalChecked} người`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Delete Button */}
      {state.channelId && state.groupData.role == "MENTOR" && (
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteChannel}>
          <Text style={styles.deleteText}>Xóa kênh</Text>
        </TouchableOpacity>
      )}

      </View>
    );
  };
  
  export default observer(Form);