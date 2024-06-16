import React from "react";
import { MentorUsRoutes } from "~/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import StudentNote from "~/screens/StudentNote";

export const StudentNoteNav =
  createStackNavigator<MentorUsRoutes.StudentNoteStack>();

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
        initialParams={{ searchOn: false, searchQuery: "" }}
        options={{ title: "Ghi chú" }}
        listeners={({ navigation }) => ({
          blur: () =>
            navigation.setParams({ searchOn: false, searchQuery: "" }),
        })}
      />
    </StudentNoteNav.Navigator>
  );
};

export default StudentNoteStack;
