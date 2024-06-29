import React from "react";
import { MentorUsRoutes } from "~/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import Schedules from "~/screens/Schedules";

const ScheduleStackNav = createStackNavigator<MentorUsRoutes.ScheduleStack>();

const ScheduleStack = () => {
  return (
    <ScheduleStackNav.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: Color.white,
        headerStyle: { backgroundColor: Color.primary },
        headerTitleAlign: "center",
      }}>
      <ScheduleStackNav.Screen
        name="scheduleList"
        options={{ title: "" }}
        component={Schedules}
      />
    </ScheduleStackNav.Navigator>
  );
};

///
export default ScheduleStack;
