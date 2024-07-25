import { FlatList, View, Text } from "react-native";
import styles from "./styles";
import MeetingItem from "~/components/MeetingItem";
import SizedBox from "~/components/SizedBox";
import TaskItem from "~/components/TaskItem";
import { MeetingModel } from "~/models/meeting";
import { TaskModel } from "~/models/task";
import { RoleType } from "~/models/commonTypes";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Color } from "~/constants/Color";

interface Props {
  mode: "task" | "meeting";
  schedules: (MeetingModel | TaskModel)[];
  loading: boolean;
  role?: RoleType;
  refresh: () => void;
  onAdd: () => void;
  type: "UPCOMING" | "PASSED";
}

export default function CustomTabView({
  mode,
  schedules,
  loading = false,
  role,
  refresh,
  onAdd,
  type,
}: Props) {
  const _renderScheduleItem = ({ item, index }) => {
    return mode === "meeting" ? (
      <MeetingItem key={item.id} data={item} />
    ) : (
      <TaskItem key={item.id} data={item} isInChannel />
    );
  };

  const _ListEmptyComponent = () => {
    if (loading) {
      return <></>;
    }
    if (type == "PASSED") {
      return (
        <Text style={styles.emptyText}>
          Chưa có {mode == "meeting" ? "lịch hẹn" : "công việc"} nào
        </Text>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Nhóm chưa có {mode == "meeting" ? "lịch hẹn" : "công việc"} mới nào
        </Text>

        <View style={styles.emptyBtn}>
          <Button
            onPress={onAdd}
            mode="contained"
            icon="playlist-plus"
            color={Color.primary}>
            Tạo {mode == "meeting" ? "lịch hẹn" : "công việc"} mới
          </Button>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={schedules}
      keyExtractor={item => item.id}
      renderItem={_renderScheduleItem}
      showsVerticalScrollIndicator={false}
      style={styles.flatlist}
      ItemSeparatorComponent={() => <SizedBox height={8} />}
      refreshing={loading}
      onRefresh={refresh}
      ListEmptyComponent={_ListEmptyComponent}
    />
  );
}
