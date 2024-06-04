import React from "react";
import { MentorUsRoutes } from "~/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import StudentNote from "~/screens/StudentNote";

const StudentNoteNav = createStackNavigator<MentorUsRoutes.StudentNoteStack>();

const StudentNoteStack = () => {
  return (
    <StudentNoteNav.Navigator
      initialRouteName="studentNote"
      screenOptions={{
        headerShown: true,
        headerTintColor: Color.white,
        headerStyle: { backgroundColor: Color.primary },
        headerTitleAlign: "left",
      }}>
      <StudentNoteNav.Screen
        name="studentNote"
        component={StudentNote}
        options={{ title: "Ghi chú" }}
      />
    </StudentNoteNav.Navigator>
  );
};

///
export default StudentNoteStack;
