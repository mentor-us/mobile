import {FlatList, Text} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {ScreenProps} from "~/types/navigation";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import {useNavigation} from "@react-navigation/native";
import TaskServices from "~/services/task";
import {Assignee} from "~/models/task";
import TaskAssigneeItem from "~/components/TaskAssigneeItem";

const TaskAssignees: ScreenProps<"taskAssignees"> = ({route}) => {
  const taskId = route.params.taskId;
  const groupId = route.params.groupId;
  const navigation = useNavigation();
  const [members, setMembers] = useState<Assignee[]>([]);

  // render item
  const renderItem = useCallback(
    ({index, item}: {index: number; item: Assignee}) => {
      return (
        <TaskAssigneeItem
          onPress={() => {
            navigation.navigate("otherProfile", {userId: item.id, groupId: groupId});
          }}
          member={item}
        />
      );
    },
    [],
  );

  // fecth api
  const fetchAssinees = async (taskId: string) => {
    try {
      const data = await TaskServices.getTaskAssinees(taskId);
      setMembers(data);
    } catch (error) {
      console.log("@SCREEN_Task_Assignee: ", error);
    }
  };

  // side effect
  useEffect(() => {
    fetchAssinees(taskId);
  }, [taskId]);

  return (
    <FlatList
      style={styles.container}
      data={members}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${index}-${item.id}`}
      ItemSeparatorComponent={() => <SizedBox height={8} />}
    />
  );
};

export default TaskAssignees;
