import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";

import LoginScreen from "~/screens/Login";
import Test from "~/screens/Test";
import VerifyCodeScreen from "~/screens/VerifyCodeScreen";
import {MentorUsRoutes} from "~/types/navigation";

const UnAuthorizedStack =
  createNativeStackNavigator<MentorUsRoutes.UnAuthorized>();

const UnAuthorized = () => {
  return (
    <UnAuthorizedStack.Navigator screenOptions={{headerShown: false}}>
      {/* <UnAuthorizedStack.Screen name="testScreen" component={Test} /> */}
      <UnAuthorizedStack.Screen name="loginScreen" component={LoginScreen} />
      <UnAuthorizedStack.Screen
        name="verifyScreen"
        component={VerifyCodeScreen}
        options={{
          headerShown: true,
          title: "Verify Code Screen",
        }}
      />
    </UnAuthorizedStack.Navigator>
  );
};

///
export default UnAuthorized;
