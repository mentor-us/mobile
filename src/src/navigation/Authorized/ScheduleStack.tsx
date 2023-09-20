import React from "react";
import {MentorUsRoutes} from "~/types/navigation";
import {createStackNavigator} from "@react-navigation/stack";
import {Color} from "~/constants/Color";
import Schedules from "~/screens/Schedules";

const ProfileNav = createStackNavigator<MentorUsRoutes.ScheduleStack>();

const ScheduleStack = () => {
  return (
    <ProfileNav.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: Color.white,
        headerStyle: {backgroundColor: Color.primary},
        headerTitleAlign: "center",
      }}>
      <ProfileNav.Screen
        name="scheduleList"
        options={{title: ""}}
        component={Schedules}
      />
    </ProfileNav.Navigator>
  );
};

///
export default ScheduleStack;
