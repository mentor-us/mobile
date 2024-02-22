import { Linking } from "react-native";
import { AppRoutes } from "~/types/navigation";

export const config = {
  screens: {
    [AppRoutes("loginScreen")]: {
      path: "oauth2/redirect",
      exact: true,
    },
    // [AppRoutes("chat")]: {
    //   path: "/chat",
    // },
    [AppRoutes("chat")]: {
      path: "/send-link/invitation",
    },
    [AppRoutes("meetingDetail")]: {
      path: "/meeting",
      exact: true,
    },
    [AppRoutes("taskDetail")]: {
      path: "/task",
    },
  },
};

export const config_auth = {
  initialRouteName: "bottomTab",
  screens: {
    // [AppRoutes("chat")]: {
    //   path: "/chat",
    // },
    [AppRoutes("chat")]: {
      path: "/send-link/invitation",
    },
    [AppRoutes("meetingDetail")]: {
      path: "/meeting",
      exact: true,
    },
    [AppRoutes("taskDetail")]: {
      path: "/task",
    },
  },
};

export const Deeplink = {
  prefixes: [
    "http://localhost:3000",
    "https://mentor.fit.hcmus.edu.vn",
    "https://mentor.somesandwich.rocks",
    "https://web-nang-cao-19-3-ymeb.vercel.app",
    "intent://",
    "mentorus://",
  ],
  config,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log("@DUKE_getInitialURL", url);
    return url;
  },
};
