import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "~/screens/Login";
import { MentorUsRoutes } from "~/types/navigation";

const UnAuthorizedStack =
  createNativeStackNavigator<MentorUsRoutes.UnAuthorized>();

const UnAuthorized = () => {
  return (
    <UnAuthorizedStack.Navigator screenOptions={{ headerShown: false }}>
      <UnAuthorizedStack.Screen name="loginScreen" component={LoginScreen} />

      {/** WHAT IS THIS USE FOR? RECHECK IT **/}
      {/* <UnAuthorizedStack.Screen
        name="verifyScreen"
        component={VerifyCodeScreen}
        options={{
          headerShown: true,
          title: "Verify Code Screen",
        }}
      /> */}
    </UnAuthorizedStack.Navigator>
  );
};

export default UnAuthorized;
