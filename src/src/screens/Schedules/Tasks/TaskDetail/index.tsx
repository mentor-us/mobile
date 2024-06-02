import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  RefreshControl,
  DeviceEventEmitter,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles";
import GlobalStyles from "~/constants/GlobalStyles";
import InfoItem from "./InfoItem";
import { InfoItemModel } from "./index.props";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import { HeaderEditButton } from "~/components/Header";
import { ScreenProps } from "~/types/navigation";
import { MarkTitleIcon } from "~/assets/svgs";
import { StackNavigationOptions } from "@react-navigation/stack";
import TaskServices from "~/services/task";
import { TaskModel, TaskStatusObject, TASK_SAMPLE } from "~/models/task";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { RefreshTaskDetailEvent } from "~/models/events/refresh-task-detail";
import { useAppSelector } from "~/redux";
import { RoleType } from "~/models/commonTypes";

const TaskDetail: ScreenProps<"taskDetail"> = ({ route }) => {
  const navigation = useNavigation();
  const currentUser = useAppSelector(state => state.user.data);
  const taskId = route.params.taskId;

  /* State */
  const [taskData, setTaskData] = useState<TaskModel>(TASK_SAMPLE);
  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      {
        type: "description",
        text: taskData.description,
      },
      {
        type: "deadline",
        text: taskData.deadlineTimeModel.displayName,
      },
      {
        type: "assinger",
        text: taskData.assigner.name,
      },
      {
        type: "assignee",
        text: `${taskData.totalAssignees} người`,
      },
    ] as InfoItemModel[];
  }, [taskData]);

  /* UI loading */
  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => setSnackBar(false);

  const onEditPress = () => {
    navigation.navigate("createTask", {
      groupId: taskData.group.id,
      taskId: taskData.id,
    });
  };

  const openStatusBox = () => {
    BottomSheetModalRef.current?.show("status_box", taskId);
  };

  const headerRight = () => {
    if (taskData === TASK_SAMPLE) {
      return <></>;
    }
    if (
      taskData.role === RoleType.MENTOR ||
      taskData.assigner.id === currentUser.id
    ) {
      return <HeaderEditButton onPress={onEditPress} text={"Chỉnh sửa"} />;
    }
    return <></>;
  };

  // call api
  const fetchTaskData = async (taskId: string) => {
    try {
      const data = await TaskServices.getTaskDetail(taskId);
      setTaskData(data);
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_ERROR_TaskDetail_: ", error);
    }
  };

  useEffect(() => {
    fetchTaskData(taskId);
  }, [taskId, loading]);

  // side effect
  useEffect(() => {
    if (taskData != TASK_SAMPLE) {
      navigation.setOptions({
        headerRight,
      } as Partial<StackNavigationOptions>);
    }
  }, [taskData.id, taskData.group.id]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshTaskDetail,
      ({ status, message }: RefreshTaskDetailEvent) => {
        setTimeout(() => {
          setMessage(message);
          setLoading(status);
          setSnackBar(true);
        }, 250);
      },
    );

    return () => {
      subcribe.remove();
    };
  }, []);

  if (loading && !taskData.id) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!taskData.id) {
    return (
      <SafeAreaView style={GlobalStyles.fullFlexFocus}>
        <Text style={styles.error}>
          Công việc này không tồn tại hoặc đã bị xóa
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setLoading(true)}
          />
        }
        style={GlobalStyles.fullFlex}
        bounces={false}>
        {/* Title */}
        <Text style={styles.groupName}>Nhóm: {taskData.group.name}</Text>
        {/* Title */}
        <View style={styles.titleCtn}>
          <SizedBox width={2} />
          <MarkTitleIcon width={20} height={20} />
          <Text style={styles.title}>{taskData.title}</Text>
        </View>
        {/* Infor */}
        <View style={styles.infoCtn}>
          <SizedBox height={20} />

          {taskData.status != "NULL" && (
            <View style={styles.statusCtn}>
              <Text style={styles.statusTitle}>Trạng thái</Text>
              <View style={styles.buttonCtn}>
                <Button
                  onPress={openStatusBox}
                  mode="contained"
                  icon="chevron-down"
                  uppercase={false}
                  color={TaskStatusObject[taskData.status].backgroundColor}>
                  {TaskStatusObject[taskData.status].displayName}
                </Button>
              </View>
            </View>
          )}

          <Text style={styles.statusTitle}>Thông tin công việc</Text>
          {infoItems.map(item => {
            return (
              <InfoItem
                assingerId={taskData.assigner.id}
                taskId={taskId}
                data={item}
                key={item.type}
                groupId={taskData.group.id}
              />
            );
          })}
        </View>
      </ScrollView>
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default TaskDetail;
