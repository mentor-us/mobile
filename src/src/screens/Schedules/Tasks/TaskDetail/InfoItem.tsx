import {
  View,
  Text,
  TouchableOpacity,
  TextStyle,
  DeviceEventEmitter,
} from "react-native";
import React, {memo, useMemo, useRef} from "react";
import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {
  ClockGrayIcon,
  GroupIcon,
  ParagraphIcon,
  TaskIcon,
  UserNameIcon,
} from "~/assets/svgs";

import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import {Color} from "~/constants/Color";
import isEqual from "react-fast-compare";
import {InfoItemModel} from "./index.props";
import {useNavigation} from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import {TaskStatusKeyIndex, TaskTextOptions} from "~/models/task";
import TaskApi from "~/api/remote/TaskApi";
import EventEmitterNames from "~/constants/EventEmitterNames";

interface Props {
  data: InfoItemModel;
  assingerId: string;
  taskId: string;
  textStyle?: TextStyle;
  groupId: string;
}

const InfoItem = ({data, assingerId, taskId, groupId, textStyle = {}}: Props) => {
  const navigation = useNavigation();
  const statusBox = useRef<any>();
  const ITEM_TOOL = useMemo(() => {
    return {
      deadline: {
        fieldName: "Hạn chót",
        renderIcon: () => {
          return <ClockGrayIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {},
      },
      status: {
        fieldName: "Trạng thái công việc",
        renderIcon: () => {
          return <TaskIcon focused={false} />;
        },
        textAction: "Cập nhật",
        action: async () => {
          statusBox.current?.show();
        },
      },
      description: {
        fieldName: "Mô tả",
        renderIcon: () => {
          return <ParagraphIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {},
      },
      assinger: {
        fieldName: "Người giao việc",
        renderIcon: () => {
          return <UserNameIcon width={24} height={24} />;
        },
        textAction: "Chi tiết",
        action: () => {
          navigation.navigate("otherProfile", {userId: assingerId, groupId: groupId});
        },
      },

      assignee: {
        fieldName: "Số người thực hiện",
        renderIcon: () => {
          return <GroupIcon width={24} height={24} />;
        },
        textAction: "Chi tiết",
        action: async () => {
          navigation.navigate("taskAssignees", {taskId: taskId, groupId: groupId});
        },
      },
    };
  }, [assingerId, taskId]);

  const onChangeStatus = async (index: number) => {
    await TaskApi.updateStatusTask(taskId, TaskStatusKeyIndex[index]);
    DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
      status: true,
      message: "Đã cập nhật trạng thái công việc",
    });
  };

  return (
    <View style={styles.container}>
      <View style={[GlobalStyles.flexRow, {alignItems: "flex-start"}]}>
        <View style={styles.icon}>{ITEM_TOOL[data.type].renderIcon()}</View>
        <SizedBox width={12} />
        <View style={styles.textCtn}>
          <Text style={styles.fieldName}>{ITEM_TOOL[data.type].fieldName}</Text>

          {data.text ? (
            data.type !== "status" ? (
              <Text style={[styles.text, textStyle]}>{data.text}</Text>
            ) : (
              <ModalDropdown
                ref={statusBox}
                options={TaskTextOptions}
                isFullWidth={true}
                textStyle={styles.valueText}
                defaultValue={data.text}
                dropdownTextStyle={styles.dropDownText}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownCtn}
                onSelect={onChangeStatus}
              />
            )
          ) : (
            <Text style={styles.nullText}>Chưa cập nhật</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={ITEM_TOOL[data.type].action}>
        <Text style={styles.textAction}>{ITEM_TOOL[data.type].textAction}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(InfoItem, isEqual);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    paddingTop: 12,
    width: 40,
  },
  fieldName: {
    fontSize: FontSize.normal,
    color: Color.text[4],
    fontWeight: "bold",
  },
  text: {
    fontSize: FontSize.larger,
    color: Color.text[0],
  },
  nullText: {
    fontSize: FontSize.larger,
    color: "#7575757d",
  },
  button: {
    position: "absolute",
    right: 4,
  },
  textAction: {
    color: Color.green,
    fontStyle: "italic",
  },
  textCtn: {
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: Color.gray[2],
    borderBottomWidth: 0.5,
  },
  valueText: {
    fontWeight: "bold",
    fontSize: FontSize.large,
    color: Color.text[0],
  },
  dropDownText: {
    fontSize: FontSize.large,
    color: Color.text[2],
  },
  dropdownCtn: {
    borderRadius: 8,
    shadowColor: Color.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 16,
  },
});
