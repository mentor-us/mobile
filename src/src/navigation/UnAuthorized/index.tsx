import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "~/screens/Login/LoginScreen";
import { MentorUsRoutes } from "~/types/navigation";

const UnAuthorizedStack =
  createNativeStackNavigator<MentorUsRoutes.UnAuthorized>();

const UnAuthorized = () => {
  return (
    <UnAuthorizedStack.Navigator screenOptions={{ headerShown: false }}>
      <UnAuthorizedStack.Screen name="loginScreen" component={LoginScreen} />
    </UnAuthorizedStack.Navigator>
  );
};

export default UnAuthorized;
