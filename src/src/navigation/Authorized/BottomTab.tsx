import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { HomeIcon, PersonIcon, ScheduleIcon } from "~/assets/svgs";
import { Color } from "~/constants/Color";
import { MentorUsRoutes } from "~/types/navigation";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import ScheduleStack from "./ScheduleStack";
import StudentNoteStack from "./StudentNodeStack";
import StudentNoteIcon from "~/components/StudentNoteIcon";

const AuthorizedStack =
  createMaterialBottomTabNavigator<MentorUsRoutes.BottomTab>();

const BottomTab = () => {
  return (
    <AuthorizedStack.Navigator
      initialRouteName="homeStack"
      backBehavior="none"
      activeColor={Color.primary}
      shifting={true}
      barStyle={{ backgroundColor: Color.white }}
      sceneAnimationEnabled>
      <AuthorizedStack.Screen
        name="homeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Nhóm",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <AuthorizedStack.Screen
        name="scheduleStack"
        component={ScheduleStack}
        options={{
          tabBarLabel: "Lịch",
          tabBarAccessibilityLabel: "scheduleTab",
          tabBarTestID: "scheduleTab",
          tabBarIcon: ({ focused }) => <ScheduleIcon focused={focused} />,
        }}
      />
      <AuthorizedStack.Screen
        name="studentNoteStack"
        component={StudentNoteStack}
        options={{
          tabBarLabel: "Ghi chú",
          tabBarIcon: ({ focused }) => <StudentNoteIcon focused={focused} />,
        }}
      />
      <AuthorizedStack.Screen
        name="profileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ focused }) => <PersonIcon focused={focused} />,
        }}
      />
    </AuthorizedStack.Navigator>
  );
};

///
export default BottomTab;
