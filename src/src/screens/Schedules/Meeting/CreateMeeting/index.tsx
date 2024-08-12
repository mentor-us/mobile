import { DeviceEventEmitter, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import {
  HeaderCloseButton,
  HeaderLeft,
  HeaderSubmitButton,
} from "~/components/Header";
import { ScreenProps } from "~/types/navigation";
import { observer } from "mobx-react-lite";
import GlobalStyles from "~/constants/GlobalStyles";
import { CreateMeetingScreenState } from "~/mobx/meeting";
import { useAppSelector } from "~/redux";
import { UserProfileModel } from "~/models/user";
import CreateMeetingScreenProvider, {
  useCreateMeetingScreenState,
} from "~/context/meeting";

import Form from "./Form";
import SelectChannel from "./SelectChannel";
import SelectAttendee from "./SelectAttendee";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";

const Container = observer(() => {
  const state = useCreateMeetingScreenState();
  return (
    <>
      {state.screenType === "form" && <Form />}
      {state.screenType === "select_channel" && <SelectChannel />}
      {state.screenType === "select_attendee" && <SelectAttendee />}
    </>
  );
});

const CreateMeeting: ScreenProps<"createMeeting"> = ({ route }) => {
  const groupId = route.params.groupId;
  const navigation = useNavigation();
  const currentUser: UserProfileModel = useAppSelector(
    state => state.user.data,
  );
  const queryAction = useUpdateQueryGroupList();

  const [state] = useState(() => {
    return new CreateMeetingScreenState({
      groupId: route.params.groupId,
      currentUser: currentUser,
      meetingId: route.params.meetingId,
    });
  });

  const onRightPress = useCallback(() => {
    if (state.isFormValid() === false) return;

    state.submit();
    if (state.screenType === "form") {
      DeviceEventEmitter.emit(EventEmitterNames.refreshScheduleList, {
        status: true,
        message: "Tạo lịch hẹn mới thành công",
      });

      if (state.meetingId) {
        DeviceEventEmitter.emit(EventEmitterNames.refreshMeetingDetail, {
          status: true,
          message: "Đã cập nhật lịch hẹn",
        });
      }

      state.getCanGoBack() && navigation.goBack();
    }

    // Update last message in homepage
    const newMessage = `Nhóm có lịch hẹn mới "${state.title}"`;
    queryAction.updateGroupNewMessage(groupId, newMessage, false);
  }, []);

  const onLeftPress = useCallback(() => {
    state.setScreenType("form");
  }, []);

  const headerRight = useCallback(() => {
    if (state.screenType === "select_channel") return;
    return <HeaderSubmitButton onPress={onRightPress} />;
  }, []);

  const headerLeft = useCallback(() => {
    return state.screenType === "select_attendee" ? (
      <HeaderLeft onPress={onLeftPress} />
    ) : (
      <HeaderCloseButton canGoBack />
    );
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
    <CreateMeetingScreenProvider
      state={state}
      key={`create-meeting-${route.params.groupId}`}>
      <View style={GlobalStyles.fullFlex}>
        <Container />
      </View>
    </CreateMeetingScreenProvider>
  );
};

export default observer(CreateMeeting);
