import {
  Alert,
  AlertButton,
  DeviceEventEmitter,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import DatePicker from "react-native-date-picker";
import styles from "./styles";

import {
  ClockGrayIcon,
  GroupIcon,
  MarkTitleIcon,
  ParagraphIcon,
} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import { observer } from "mobx-react-lite";
import MUITextInput from "~/components/MUITextInput";
import { useNavigation } from "@react-navigation/native";
import { useCreateTaskScreenState } from "~/context/task";
import TaskApi from "~/api/remote/TaskApi";
import Helper from "~/utils/Helper";
import EventEmitterNames from "~/constants/EventEmitterNames";

interface DatePickerToolModel {
  title: string;
  mode: "time" | "date" | "datetime";
}

const Form = () => {
  const state = useCreateTaskScreenState();
  const navigation = useNavigation();
  const datePickerTool = useMemo(() => {
    return {
      time: {
        title: "Thời gian",
        mode: "time",
      } as DatePickerToolModel,
      date: {
        title: "Ngày",
        mode: "date",
      } as DatePickerToolModel,
      hide: {
        title: "",
        mode: "date",
      } as DatePickerToolModel,
    };
  }, []);

  const deleteTask = async () => {
    Alert.alert("Cảnh báo", "Bạn có chắc muốn xóa công việc này không?", [
      { text: "Hủy" },
      {
        text: "Xác nhận",
        onPress: async () => {
          if (state.taskId) {
            await TaskApi.deleteTask(state.taskId);
          }

          DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
            status: true,
            message: "Xóa công việc thành công",
          });
          navigation.navigate("groupSchedule", {
            groupId: state.groupData.id,
            mode: "task",
            role: state.groupData.role,
          });
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
          style={[GlobalStyles.flexRow, { justifyContent: "space-between" }]}>
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
            label="Tiêu đề *"
            keyboardType={"default"}
            value={state.title}
            onChangeText={text => {
              state.setTitle(text);
            }}
            multiline
            numberOfLines={2}
            errorText={state.titleError}
            style={{ textAlignVertical: "top" }}
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
            errorText={state.descriptionError}
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {/* Time Deadline */}
        <View style={styles.fieldContainer}>
          <ClockGrayIcon width={24} height={24} />
          <SizedBox width={16} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MUITextInput
              label="Lúc"
              onFocus={() => state.setDatePickerStatus("time")}
              value={state.time}
              containerStyle={{ flex: 1 }}
            />
            <SizedBox width={16} />
            <MUITextInput
              label="Ngày"
              onFocus={() => state.setDatePickerStatus("date")}
              value={state.date}
              containerStyle={{ flex: 3 }}
            />
          </View>
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
              <Text style={styles.label}>Giao công việc *</Text>
              <Text style={[styles.valueText, GlobalStyles.rightText]}>
                {state.assignees.checkedAll === "checked"
                  ? "Cả nhóm"
                  : `${state.assignees.totalChecked} người`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Button */}
      {state.taskId && state.isCanEdit() && (
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteTask}>
          <Text style={styles.deleteText}>Xóa công việc</Text>
        </TouchableOpacity>
      )}

      {/* DatePicker Modal */}
      <DatePicker
        modal
        open={state.datePickerStatus !== "hide"}
        title={datePickerTool[state.datePickerStatus].title}
        date={new Date(Helper.createDateTime(`${state.time} - ${state.date}`))}
        onConfirm={date => {
          state.setTaskTime(date);
          state.setDatePickerStatus("hide");
          Keyboard.dismiss();
        }}
        onCancel={() => {
          state.setDatePickerStatus("hide");
          Keyboard.dismiss();
        }}
        mode={datePickerTool[state.datePickerStatus].mode}
        locale="vi"
        cancelText="Hủy"
        confirmText="Xác nhận"
      />
    </View>
  );
};

export default observer(Form);
