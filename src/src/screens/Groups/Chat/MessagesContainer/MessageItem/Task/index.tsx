import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useMemo } from "react";
import styles from "./styles";
import { TaskSquareIcon } from "~/assets/svgs";
import { useNavigation } from "@react-navigation/native";
import { TASK_SAMPLE, TaskModel, TaskStatusObject } from "~/models/task";
import isEqual from "react-fast-compare";
import { useAppSelector } from "~/redux";
import { Button } from "react-native-paper";

interface Props {
  data?: TaskModel;
}

const Task = ({ data = TASK_SAMPLE }: Props) => {
  const navigation = useNavigation();
  const currentUser = useAppSelector(state => state.user.data);

  /* State */
  const ownStatus = useMemo(() => {
    if (!data.assignees) {
      return "NULL";
    }
    const assignee = data.assignees.find(
      assignee => assignee.id == currentUser.id,
    );
    if (!assignee) {
      return "NULL";
    }
    return assignee.status;
  }, [data]);

  const openTask = () => {
    navigation.navigate("taskDetail", { taskId: data.id });
  };

  return (
    <TouchableOpacity style={styles.root} onPress={openTask}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.title}>
            <TaskSquareIcon width={22} height={22} />
            <Text style={styles.tab}>Công việc</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.timeDesc}>
          {data.title}
        </Text>
        {/* <Text style={styles.timeDesc}>
          <Text style={styles.hint}>Tới hạn {data.deadlineTimeModel.time}</Text>
        </Text> */}
        <Text style={styles.dateDesc}>
          Tới hạn {data.deadlineTimeModel.time}, ngày{" "}
          {data.deadlineTimeModel.date}
        </Text>

        {ownStatus && ownStatus !== "NULL" && (
          <View>
            <Button
              onPress={openTask}
              mode="contained"
              icon={TaskStatusObject[data.status].icon}
              uppercase={false}
              color={TaskStatusObject[data.status].backgroundColor}>
              {TaskStatusObject[data.status].displayName}
            </Button>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(Task, isEqual);
