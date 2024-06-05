import { DeviceEventEmitter, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { HeaderCloseButton, HeaderSubmitButton } from "~/components/Header";

import { ScreenProps } from "~/types/navigation";
import { observer } from "mobx-react-lite";
import GlobalStyles from "~/constants/GlobalStyles";
import { CreateTaskScreenState } from "~/mobx/task";
import { useAppSelector } from "~/redux";
import { UserProfileModel } from "~/models/user";

import Form from "./Form";
import SelectGroup from "./SelectGroup";
import SelectAssingee from "./SelectAssingee";
import CreateTaskScreenProvider, {
  useCreateTaskScreenState,
} from "~/context/task";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";

const Container = observer(() => {
  const state = useCreateTaskScreenState();
  return (
    <>
      {state.screenType === "form" && <Form />}
      {state.screenType === "select_group" && <SelectGroup />}
      {state.screenType === "select_assignee" && <SelectAssingee />}
    </>
  );
});

const CreateTask: ScreenProps<"createTask"> = ({ route }) => {
  const groupId = route.params.groupId;
  const navigation = useNavigation();
  const currentUser: UserProfileModel = useAppSelector(
    state => state.user.data,
  );
  const queryAction = useUpdateQueryGroupList();

  const [state] = useState(() => {
    return new CreateTaskScreenState({
      groupId: route.params.groupId,
      currentUser: currentUser,
      taskId: route.params.taskId,
    });
  });

  const onRightPress = useCallback(() => {
    state.submit();
    if (state.screenType === "form") {
      if (state.taskId) {
        DeviceEventEmitter.emit(EventEmitterNames.refreshTaskDetail, {
          status: true,
          task: null,
          message: "Đã cập nhật công việc",
        });
      } else {
        DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
          status: true,
          message: "Tạo công việc mới thành công",
        });
      }
      state.getCanGoBack() && navigation.goBack();
    }

    // Update last message in homepage
    const newMessage = `Nhóm có công việc mới "${state.title}"`;
    queryAction.updateGroupNewMessage(groupId, newMessage, false);
  }, []);

  const onLeftPress = useCallback(() => {
    state.setScreenType("form");
  }, []);

  const headerRight = useCallback(() => {
    if (state.screenType === "select_group") return;

    return <HeaderSubmitButton onPress={onRightPress} />;
  }, []);

  const headerLeft = useCallback(() => {
    return <HeaderCloseButton canGoBack />;
  }, [state.screenType]);

  // Side Effect
  useEffect(() => {
    const title = state.getScreenTitle();
    navigation.setOptions({
      headerRight,
      headerLeft,
      title: title,
    } as StackNavigationOptions);
  }, [state.screenType]);

  return (
    <CreateTaskScreenProvider
      state={state}
      key={`create-task-${route.params.groupId}`}>
      <View style={GlobalStyles.fullFlex}>
        <Container />
      </View>
    </CreateTaskScreenProvider>
  );
};

export default observer(CreateTask);
