import {useMemo} from "react";
import {BottomSheetModalRef} from "../index.props";
import styles from "./style";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {TaskStatusModel} from "~/models/task";
import SizedBox from "~/components/SizedBox";
import TaskApi from "~/api/remote/TaskApi";

interface Props {
  taskId: string;
}
const GroupChatThreads = ({taskId}: Props) => {
  const STATUSES: TaskStatusModel[] = useMemo(() => {
    return [
      {
        key: "TO_DO",
        displayName: "Nhóm",
        color: "#2A7BDE",
      },
      {
        key: "IN_PROGRESS",
        displayName: "Nguyễn Nhật Duy",
        color: "#333",
      },
      {
        key: "DONE",
        displayName: "Lê Văn Định",
        color: "#333",
      },
    ] as TaskStatusModel[];
  }, []);

  const changeStatus = async (status: string) => {
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
      <Text style={styles.title}>Danh sách cuộc hội thoại trong nhóm </Text>

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

export default GroupChatThreads;
