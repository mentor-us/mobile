import {View, Text, TouchableOpacity} from "react-native";
import React, {useMemo} from "react";
import {incommingStyles, normalStyles} from "./styles";
import {TaskModel, TaskStatusObject, TASK_SAMPLE} from "~/models/task";
import {useNavigation} from "@react-navigation/native";

interface Props {
  data?: TaskModel;
  isIncomming?: boolean;
}

const TaskItem = ({data = TASK_SAMPLE, isIncomming = false}: Props) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("taskDetail", {taskId: data.id});
  };
  const styles = useMemo(() => {
    return isIncomming ? incommingStyles : normalStyles;
  }, [isIncomming]);

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.typeCtn}>
          <Text style={styles.type}>Công việc</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{data.deadlineTimeModel.displayName}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {data.title}
        </Text>
        <View style={styles.descCtn}>
          <Text style={styles.group}>{`Nhóm: ${data.group.name}`}</Text>
          <Text
            style={[
              styles.status,
              {color: TaskStatusObject[data.status].color},
            ]}>
            {TaskStatusObject[data.status].displayName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;
