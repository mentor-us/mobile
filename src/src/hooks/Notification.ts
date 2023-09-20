import {useEffect, useState} from "react";
import notifee, {AndroidStyle, EventType} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

import {useAppDispatch, useAppSelector} from "~/redux";
import {useNavigation} from "@react-navigation/native";
import {useUpdateQueryGroupList} from "~/screens/Home/queries";
import uuid from "react-native-uuid";
import {EventActions} from "~/redux/features/event/slice";

export const useListenNotification = () => {
  const navigation = useNavigation();
  const queryAction = useUpdateQueryGroupList();
  const dispacher = useAppDispatch();

  useEffect(() => {
    messaging().onMessage(async message => {
      const channelId = await notifee.createChannel({
        id: "default",
        name: "MENTOR_US",
      });
      await notifee.displayNotification({
        id: uuid.v4().toString(),
        title: message.notification?.title,
        body: message.notification?.body,
        android: {
          channelId,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: message.notification?.body || "",
          },
        },
        data: message.data,
      });
    });

    notifee.onForegroundEvent(({type, detail}) => {
      const data = detail.notification?.data;
      if (data) {
        queryAction.updateGroupNewMessage(
          data.groupId as string,
          detail.notification?.body as string,
        );
        if (data.type == "NEW_MEETING") {
          dispacher(EventActions.setLoading(true));
        }
        if (data.type == "NEW_TASK") {
          dispacher(EventActions.setLoading(true));
        }
        console.log("@DUKE User data notification", detail.notification);
      }
      switch (type) {
        case EventType.DISMISSED:
          console.log(
            "@DUKE User dismissed notification",
            detail.notification?.data,
          );
          break;
        case EventType.PRESS:
          console.log("@DUKE User pressed notification", detail.notification);
          navigation.navigate("chat", {
            groupId: detail.notification.data?.groupId,
          });
          break;
      }
    });
  }, []);
};
/** Hooks for notify service */
export const useNotificationService = () => {
  const userId = useAppSelector(state => state.user.data);
  const tokenStatus = useAppSelector(state => state.auth.tokenStatus);
  // const navigation = useNavigation();

  useEffect(() => {
    if (tokenStatus == "actived" || tokenStatus == "verifying") {
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          "@DUKE Notification caused app to open from background state:",
          remoteMessage.data,
        );
        // navigation.navigate(remoteMessage.data?.screen, {
        //   groupId: remoteMessage.data?.groupId,
        // });
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              "@DUKE Notification caused app to open from quit state:",
              remoteMessage.notification,
            );
          }
        });
    }
  }, [userId, tokenStatus]);
};
