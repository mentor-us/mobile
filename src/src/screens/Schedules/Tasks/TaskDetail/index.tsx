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
import { TaskStatusObject } from "~/models/task";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { RefreshTaskDetailEvent } from "~/models/events/refresh-task-detail";
import { RoleType } from "~/models/commonTypes";
import { useCurrentUser } from "~/app/server/users/queries";
import { useGetTaskDetailQuery } from "~/app/server/tasks/queries";

const TaskDetail: ScreenProps<"taskDetail"> = ({ route }) => {
  const navigation = useNavigation();
  const { data: myInfo } = useCurrentUser();
  const { taskId } = route.params;
  const {
    data: taskData,
    isLoading,
    isRefetching,
    refetch: refeshTaskDetail,
  } = useGetTaskDetailQuery(taskId);

  /* UI loading */
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => setSnackBar(false);

  const openStatusBox = () => {
    BottomSheetModalRef.current?.show("status_box", taskId);
  };

  const onEditPress = useCallback(() => {
    if (taskData) {
      navigation.navigate("createTask", {
        groupId: taskData?.group.id,
        taskId: taskData?.id,
      });
    }
  }, [taskData]);

  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      {
        type: "description",
        text: taskData?.description,
      },
      {
        type: "deadline",
        text: taskData?.deadlineTimeModel.displayName,
      },
      {
        type: "assinger",
        text: taskData?.assigner.name,
      },
      taskData?.role === RoleType.MENTOR && taskData?.assigner.id === myInfo?.id
        ? {
            type: "assignee",
            text: `${taskData?.totalAssignees} người`,
          }
        : null,
    ].filter(Boolean) as InfoItemModel[];
  }, [taskData]);

  useEffect(() => {
    if (taskData) {
      navigation.setOptions({
        headerRight:
          taskData?.role === RoleType.MENTOR &&
          taskData?.assigner.id === myInfo?.id
            ? () => (
                <HeaderEditButton onPress={onEditPress} text={"Chỉnh sửa"} />
              )
            : null,
      } as Partial<StackNavigationOptions>);
    }
  }, [taskData, myInfo]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshTaskDetail,
      ({ status, message }: RefreshTaskDetailEvent) => {
        setTimeout(() => {
          setMessage(message);
          refeshTaskDetail();
          setSnackBar(true);
        }, 250);
      },
    );

    return () => {
      subcribe.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!taskData?.id) {
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
            refreshing={isLoading || isRefetching}
            onRefresh={refeshTaskDetail}
          />
        }
        style={GlobalStyles.fullFlex}
        bounces={false}>
        {/* Group */}
        <Text style={styles.groupName}>Nhóm: {taskData.group.name}</Text>

        {/* Title */}
        <View style={styles.titleCtn}>
          <View style={{ marginTop: 2 }}>
            <MarkTitleIcon width={20} height={20} />
          </View>
          <Text style={styles.title}>{taskData.title}</Text>
        </View>

        {/* Infor */}
        <View style={styles.infoCtn}>
          <SizedBox height={12} />

          {taskData?.status !== "NULL" &&
            taskData?.assignees?.findIndex(user => user.id === myInfo?.id) !==
              -1 && (
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
