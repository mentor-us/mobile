import React, { useCallback, useEffect } from "react";
import { MentorUsRoutes } from "~/types/navigation";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import BottomTab from "./BottomTab";
import { Color } from "~/constants/Color";
import OtherProfile from "~/screens/Profiles/OtherProfile";
import Chat from "~/screens/Groups/Chat";
import CreateVoting from "~/screens/Groups/CreateVoting";
import GroupDetail from "~/screens/Groups/GroupDetail";
import GroupNotes from "~/screens/Groups/GroupNotes";
import VotingDetail from "~/screens/Groups/VotingDetail";
import CreateMeeting from "~/screens/Schedules/Meeting/CreateMeeting";
import MeetingDetail from "~/screens/Schedules/Meeting/MeetingDetail";
import CreateTask from "~/screens/Schedules/Tasks/CreateTask";
import TaskDetail from "~/screens/Schedules/Tasks/TaskDetail";
import EditProfile from "~/screens/Profiles/EditProfile";
import NotificationList from "~/screens/Notifications/NotificationList";
import NotificationDetail from "~/screens/Notifications/NotificationDetail";
import GroupSchedule from "~/screens/Groups/GroupSchedule";
import GroupAttendees from "~/screens/Groups/GroupAttendees";
import { HeaderBackButton } from "~/components/Header";
import MeetingAttendees from "~/screens/Schedules/Meeting/MeetingAttendees";
import TaskAssignees from "~/screens/Schedules/Tasks/TaskAssignees";
import { useAppSelector } from "~/redux";
import messaging from "@react-native-firebase/messaging";
import NotificationApi from "~/api/remote/NotificationApi";
import PermissionStrategy from "~/utils/PermissionStrategies";
import {
  useListenNotification,
  useNotificationService,
} from "~/hooks/Notification";
import GroupMedia from "~/screens/Groups/GroupMedia";
import GroupFAQ from "~/screens/Groups/GroupFAQ";
import FaqDetail from "~/screens/Groups/GroupFAQ/FAQDetail";
import CreateFaq from "~/screens/Groups/GroupFAQ/CreateFAQ";
import SelectGroup from "~/screens/Groups/GroupFAQ/SelectGroup";
import ImportFAQ from "~/screens/Groups/GroupFAQ/ImportFAQ";
import Workspace from "~/screens/Groups/Workspace";
import AddChannel from "~/screens/Groups/Workspace/AddChannel";
import ForwardMessage from "~/screens/Groups/ForwardMessage";
import LinkEmail from "~/screens/Profiles/LinkEmail";
import CreateOrUpdateNote from "~/screens/StudentNote/CreateNote";
import NoteDetail from "~/screens/StudentNote/NoteDetail";
import UserNotes from "~/screens/StudentNote/UserNotes";

const AuthorizedStack = createStackNavigator<MentorUsRoutes.Authorized>();

const Authorized = () => {
  useNotificationService();
  useListenNotification();
  const userData = useAppSelector(state => state.user.data);

  const registerToken = useCallback(async () => {
    const authStatus = await PermissionStrategy.handleNotificationPermission();
    // console.log("@DUKE requestPermission: ", authStatus);

    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
    // Get the token
    const token = await messaging().getToken();
    // console.log("@DUKE Notification Token: ", {token, userId: userData.id});

    // Save the token
    NotificationApi.updateToken(userData.id, token);
    // await postToApi('/users/1234/tokens', { token });
  }, [userData.id]);

  useEffect(() => {
    if (userData.id) {
      registerToken();
    }
  }, [userData.id]);

  return (
    <AuthorizedStack.Navigator
      initialRouteName="bottomTab"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Color.primary },
        headerTintColor: Color.white,
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerLeft: () => {
          return <HeaderBackButton canGoBack />;
        },
        gestureEnabled: true,
      }}>
      {/* <AuthorizedStack.Screen name="testScreen" component={Test} /> */}

      <AuthorizedStack.Screen
        name="bottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      {/* Group */}
      <AuthorizedStack.Screen
        name="workspace"
        component={Workspace}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "left",
            title: "",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="addChannel"
        component={AddChannel}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Tạo kênh mới",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="chat"
        component={Chat}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "left",
            title: "",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupDetail"
        component={GroupDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết nhóm",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupAttendees"
        component={GroupAttendees}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Danh sách thành viên",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupFAQ"
        component={GroupFAQ}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "FAQ",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupNote"
        component={GroupNotes}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "left",
            title: "Bảng tin",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="votingDetail"
        component={VotingDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết bình chọn",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="createVoting"
        component={CreateVoting}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Tạo bình chọn",
            headerBackTestID: "title-header",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupSchedule"
        component={GroupSchedule}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Danh sách lịch hẹn",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="groupMedia"
        component={GroupMedia}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Bộ sưu tập",
          };
        }}
      />
      {/* Schedule - Meeting*/}
      <AuthorizedStack.Screen
        name="createMeeting"
        component={CreateMeeting}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Lịch hẹn mới",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="meetingDetail"
        component={MeetingDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết lịch hẹn",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="meetingAttendees"
        component={MeetingAttendees}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Danh sách người tham dự",
          };
        }}
      />
      {/* Schedule - Task*/}
      <AuthorizedStack.Screen
        name="createTask"
        component={CreateTask}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Công việc mới",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="taskDetail"
        component={TaskDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết công việc",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="forwardMessage"
        component={ForwardMessage}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chuyển tiếp tin nhắn",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="taskAssignees"
        component={TaskAssignees}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Danh sách người được giao",
          };
        }}
      />
      {/* Profile */}
      <AuthorizedStack.Screen
        name="editProfile"
        component={EditProfile}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Cập nhật thông tin",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="linkEmail"
        component={LinkEmail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Liên kết email",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="otherProfile"
        component={OtherProfile}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "",
          };
        }}
      />
      {/* Notification */}
      <AuthorizedStack.Screen
        name="notificationList"
        component={NotificationList}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Thông báo",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="notificationDetail"
        component={NotificationDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết thông báo",
          };
        }}
      />

      {/* FAQ */}
      <AuthorizedStack.Screen
        name="faqDetail"
        component={FaqDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết câu hỏi",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="createFaq"
        component={CreateFaq}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Tạo câu hỏi",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="selectGroup"
        component={SelectGroup}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chọn nhóm",
          };
        }}
      />
      <AuthorizedStack.Screen
        name="importFaq"
        component={ImportFAQ}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chọn câu hỏi",
          };
        }}
      />

      <AuthorizedStack.Screen
        name="createOrUpdateNote"
        component={CreateOrUpdateNote}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Tạo ghi chú",
          };
        }}
      />

      <AuthorizedStack.Screen
        name="noteDetail"
        component={NoteDetail}
        options={({}) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: "Chi tiết ghi chú",
          };
        }}
      />

      <AuthorizedStack.Screen
        name="userNotes"
        component={UserNotes}
        options={({ route }) => {
          return {
            ...TransitionPresets.SlideFromRightIOS,
            headerTitleAlign: "center",
            title: route.params.userName,
          };
        }}
      />
    </AuthorizedStack.Navigator>
  );
};

///
export default Authorized;
