import {StackScreenProps} from "@react-navigation/stack";
import {RoleType} from "~/models/commonTypes";
import { MessageType } from "~/models/message";

export namespace MentorUsRoutes {
  // @UnAuthorized
  export type UnAuthorized = {
    loginScreen: undefined;
    verifyScreen: undefined;

    // Test
    testScreen: undefined;
  };

  // RootStack
  export type Authorized = {
    testScreen: undefined;
    bottomTab: undefined;

    // Group
    workspace: {groupId: string};
    addChannel: {groupId: string; channelId?: string};
    chat: {groupId: string; type?: "group" | "channel"};
    createVoting: {groupId: string};
    groupDetail: {groupId: string; type?: "group" | "channel"};
    groupNote: {groupId: string};
    votingDetail: {voteId: string};
    groupSchedule: {groupId: string; role: RoleType; mode: "task" | "meeting"};
    groupAttendees: {groupId: string; role: RoleType};
    groupMedia: {groupId: string; mode: "images" | "files"};
    groupFAQ: {groupId: string};

    // Schedule
    // meeting
    createMeeting: {groupId: string; meetingId?: string};
    meetingDetail: {meetingId: string};
    meetingAttendees: {meetingId: string; groupId: string};

    // task
    createTask: {groupId: string; taskId?: string};
    taskDetail: {taskId: string};
    forwardMessage: {message: string, messageID: string,messageType: MessageType, groupId?: string,images?: Social.MediaItem[]};
    taskAssignees: {taskId: string; groupId: string};

    // Profile
    otherProfile: {userId: string; groupId: string};
    editProfile: undefined;

    // Notification
    notificationList: undefined;
    notificationDetail: {id: string};

    //FAQ
    faqDetail: {faqId: string};
    createFaq: {groupId: string; faqId?: string};
    selectGroup: {groupId: string};
    importFaq: {fromGroupId: string; toGroupId: string};
  };

  export type BottomTab = {
    homeStack: undefined;
    profileStack: undefined;
    scheduleStack: undefined;
  };

  export type HomeStack = {
    mentors: undefined;
    mentees: undefined;
    general: undefined;
  };

  export type ScheduleStack = {
    scheduleList: undefined;
  };

  export type ProfileStack = {
    myProfile: undefined;
  };

  export type AllRoute = UnAuthorized &
    Authorized &
    BottomTab &
    HomeStack &
    ScheduleStack &
    ProfileStack;

  export type RoutesKey = keyof AllRoute;
}

export type ScreenProps<
  RouteName extends keyof MentorUsRoutes.AllRoute,
  ComponentProps extends object = Record<string, unknown>,
> = React.FC<
  ComponentProps & StackScreenProps<MentorUsRoutes.AllRoute, RouteName>
>;

export function AppRoutes<RouteName extends keyof MentorUsRoutes.AllRoute>(
  name: RouteName,
) {
  return `${name}`;
}

export interface NestedParamNavigation {
  initialRouteName?: keyof MentorUsRoutes.AllRoute;
  screen: keyof MentorUsRoutes.AllRoute;
  params?:
    | MentorUsRoutes.AllRoute[keyof MentorUsRoutes.AllRoute]
    | NestedParamNavigation;
}
