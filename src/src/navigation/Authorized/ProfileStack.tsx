import React from "react";
import { MentorUsRoutes } from "~/types/navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import MyProfile from "~/screens/Profiles/MyProfile";

const ProfileNav = createStackNavigator<MentorUsRoutes.ProfileStack>();

const ProfileStack = () => {
  return (
    <ProfileNav.Navigator
      initialRouteName="myProfile"
      screenOptions={{
        headerShown: true,
        headerTintColor: Color.white,
        headerStyle: { backgroundColor: Color.primary },
        headerTitleAlign: "left",
      }}>
      <ProfileNav.Screen
        name="myProfile"
        component={MyProfile}
        options={{ title: "Cá nhân" }}
      />
    </ProfileNav.Navigator>
  );
};

///
export default ProfileStack;
