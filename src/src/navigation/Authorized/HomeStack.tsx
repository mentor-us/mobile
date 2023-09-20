import React from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {MentorUsRoutes} from "~/types/navigation";
import Mentors from "~/screens/Home/Mentors";
import Mentees from "~/screens/Home/Mentees";
import {Color} from "~/constants/Color";
import HeaderRight from "./HeaderRight";
import General from "~/screens/Home/General";

const HomeDrawer = createDrawerNavigator<MentorUsRoutes.HomeStack>();

export default function HomeStack() {
  return (
    <HomeDrawer.Navigator
      initialRouteName="general"
      screenOptions={{
        headerShown: true,
        headerRight: () => {
          return <HeaderRight />;
        },
        drawerType: "front",
        headerStyle: {backgroundColor: Color.primary},
        headerTintColor: Color.white,
      }}>
      <HomeDrawer.Screen
        name="general"
        component={General}
        options={{drawerLabel: "Chung", title: ""}}
      />
      <HomeDrawer.Screen
        name="mentors"
        component={Mentors}
        options={{drawerLabel: "Nhóm quản lý", title: "Nhóm quản lý"}}
      />
      <HomeDrawer.Screen
        name="mentees"
        component={Mentees}
        options={{drawerLabel: "Nhóm thành viên", title: "Nhóm thành viên"}}
      />
    </HomeDrawer.Navigator>
  );
}
