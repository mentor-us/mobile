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
import ModalDropdown from "react-native-modal-dropdown";
import styles from "./styles";

import {
  ClockGrayIcon,
  GroupIcon,
  LoopIcon,
  MarkerIcon,
  MarkTitleIcon,
  ParagraphIcon,
} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import { MeetingRepeatedOptions } from "~/models/meeting";
import { observer } from "mobx-react-lite";
import { useCreateMeetingScreenState } from "~/context/meeting";
import MUITextInput from "~/components/MUITextInput";
import MeetingApi from "~/api/remote/Meeting";
import { useNavigation } from "@react-navigation/native";
import Helper from "~/utils/Helper";
import EventEmitterNames from "~/constants/EventEmitterNames";
import LOG from "~/utils/Logger";

interface DatePickerToolModel {
  title: string;
  mode: "time" | "date" | "datetime";
}

const FormMeeting = () => {
  const state = useCreateMeetingScreenState();
  const navigation = useNavigation();
  const datePickerTool = useMemo(() => {
    return {
      from: {
        title: "Từ:",
        mode: "time",
      } as DatePickerToolModel,
      to: {
        title: "Đến:",
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

  const onSelectRepeated = (index: number) => {
    state.setRepeatedIndex(index);
  };

  const deleteMeeting = async () => {
    Alert.alert("Cảnh báo", "Bạn có chắc muốn xóa lịch hẹn này?", [
      { text: "Hủy" },
      {
        text: "Xác nhận",
        onPress: async () => {
          if (state.meetingId) {
            await MeetingApi.deleteMeeting(state.meetingId);
          }
          DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
            status: true,
            message: "Xóa lịch hẹn thành công",
          });
          // navigation.navigate("groupSchedule", {
          //   groupId: state.groupData.id,
          //   mode: "meeting",
          //   role: state.groupData.role,
          // });

          navigation.goBack();
          navigation.goBack();
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
            errorText={state.titleError}
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
            multiline={true}
          />
        </View>

        {/* Time Meeting */}
        <View style={styles.fieldContainer}>
          <ClockGrayIcon width={24} height={24} />
          <SizedBox width={16} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MUITextInput
              label="Từ"
              onFocus={() => state.setDatePickerStatus("from")}
              value={state.fromTime}
              containerStyle={{ flex: 1 }}
            />
            <SizedBox width={16} />
            <MUITextInput
              label="Đến"
              onFocus={() => state.setDatePickerStatus("to")}
              value={state.toTime}
              containerStyle={{ flex: 1 }}
              errorText={state.toTimeError}
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

        {/* Repeat Time */}
        {/* <View>
          <View style={[GlobalStyles.flexRow]}>
            <View style={GlobalStyles.flexRow}>
              <SizedBox width={4} />
              <LoopIcon width={20} height={20} />
              <SizedBox width={16} />
            </View>
            <View style={styles.button}>
              <Text style={styles.label}>Lặp lại *</Text>
              <ModalDropdown
                options={MeetingRepeatedOptions}
                isFullWidth={true}
                textStyle={styles.valueText}
                defaultIndex={state.repeatedIndex}
                defaultValue={MeetingRepeatedOptions[state.repeatedIndex]}
                dropdownTextStyle={styles.dropDownText}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownCtn}
                onSelect={onSelectRepeated}
              />
            </View>
          </View>
        </View> */}
        {/* Place */}
        <View style={styles.fieldContainer}>
          <MarkerIcon width={24} height={24} />
          <SizedBox width={16} />
          <MUITextInput
            label="Địa điểm"
            keyboardType={"default"}
            value={state.place}
            onChangeText={text => {
              state.setPlace(text);
            }}
          />
        </View>

        {/* Attendee */}
        <TouchableOpacity
          onPress={() => {
            state.setScreenType("select_attendee");
          }}>
          <View style={[GlobalStyles.flexRow]}>
            <View style={GlobalStyles.flexRow}>
              <GroupIcon width={28} height={28} />
              <SizedBox width={12} />
            </View>
            <View style={styles.button}>
              <Text style={styles.label}>Người tham dự *</Text>
              <Text style={[styles.valueText, GlobalStyles.rightText]}>
                {state.attendees.checkedAll === "checked"
                  ? "Cả nhóm"
                  : `${state.attendees.totalChecked} thành viên`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Button */}
      {state.meetingId && state.canEdit && (
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteMeeting}>
          <Text style={styles.deleteText}>Xóa lịch hẹn</Text>
        </TouchableOpacity>
      )}

      {/* DatePicker Modal */}
      <DatePicker
        modal
        open={state.datePickerStatus !== "hide"}
        title={datePickerTool[state.datePickerStatus].title}
        date={
          state.datePickerStatus === "from"
            ? new Date(
                Helper.createDateTime(`${state.fromTime} - ${state.date}`),
              )
            : new Date(
                Helper.createDateTime(`${state.toTime} - ${state.date}`),
              )
        }
        onConfirm={date => {
          state.setMeetingTime(date);
          state.setDatePickerStatus("hide");
          Keyboard.dismiss();
          LOG.error(state.toTime);
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

export default observer(FormMeeting);
