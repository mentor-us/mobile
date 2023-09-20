import {useMemo} from "react";
import {BottomSheetModalRef} from "../index.props";
import styles from "./style";
import {
  DeviceEventEmitter,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {TaskStatusModel} from "~/models/task";
import SizedBox from "~/components/SizedBox";
import TaskApi from "~/api/remote/TaskApi";
import EventEmitterNames from "~/constants/EventEmitterNames";

interface Props {
  taskId: string;
}
const StatusBox = ({taskId}: Props) => {
  const STATUSES: TaskStatusModel[] = useMemo(() => {
    return [
      {
        key: "TO_DO",
        displayName: "Mới",
        color: "#333",
      },
      {
        key: "IN_PROGRESS",
        displayName: "Đang thực hiện",
        color: "#2A7BDE",
      },
      {
        key: "DONE",
        displayName: "Hoàn thành",
        color: "#4EA05B",
      },
    ] as TaskStatusModel[];
  }, []);

  const changeStatus = async (status: string) => {
    const isUpdated = await TaskApi.updateStatusTask(taskId, status);
    if (!isUpdated) {
      return;
    }

    DeviceEventEmitter.emit(EventEmitterNames.refreshTaskStatus, {
      taskId: taskId,
      newStatus: status,
      status: true,
      message: "Đã cập nhật trạng thái công việc",
    });
    DeviceEventEmitter.emit(EventEmitterNames.refreshTaskDetail, {
      status: true,
      message: "Đã cập nhật trạng thái công việc",
    });
    DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
      status: true,
      message: "Cập nhật trạng thái công việc",
    });
    DeviceEventEmitter.emit(EventEmitterNames.refreshHomePage);

    BottomSheetModalRef.current?.hide();
  };

  const _renderItem = ({item}) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => changeStatus(item.key)}>
          <Text style={[styles.text, {color: item.color}]}>
            {item.displayName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn trạng thái mới</Text>

      <FlatList
        data={STATUSES}
        keyExtractor={item => `${item.key}`}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <SizedBox height={4} />}
      />
    </View>
  );
};

export default StatusBox;
