import {useNavigation} from "@react-navigation/native";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Notification} from "~/models/notification";
import styles from "./style";
import Feather from "react-native-vector-icons/Feather";
import {NotificationType} from "~/models/notification";
import {useAppSelector} from "~/redux";
import {DefaultGroupNotification} from "~/assets/images";
import Helper from "~/utils/Helper";

interface Props {
  notification: Notification;
  index: number;
}

export default function NotificationItem({notification, index}: Props) {
  const navigation = useNavigation();
  const profile = useAppSelector(state => state.user.data);

  const onPress = (notificationId: string) => {
    switch(notification.type) {
      case "NEED_RESPONSE":
        navigation.navigate("notificationDetail", {id: notificationId});
        break;
      case "SYSTEM":
        break;
      case "NEW_COMMENT":
        break;
      case "NEW_MESSAGE":
        break;
      case "NEW_TASK":
        navigation.navigate("taskDetail", {taskId: notification.refId});
        break;
      case "NEW_MEETING":
        navigation.navigate("meetingDetail", {meetingId: notification.refId});
        break;
      case "NEW_REACTION":
        break;
      case "NEW_IMAGE_MESSAGE":
        break;
      case "NEW_FILE_MESSAGE":
        break;
      case "UPDATE_MEETING":
        navigation.navigate("meetingDetail", {meetingId: notification.refId});
        break;
      case "RESCHEDULE_MEETING":
        navigation.navigate("meetingDetail", {meetingId: notification.refId});
        break;
      case "NEW_VOTE":
        navigation.navigate("votingDetail", {voteId: notification.refId});
        break;
    }
  };

  const isRead = false;

  return (
    <View>
      <TouchableOpacity onPress={() => onPress(notification.id)}>
        <View
          style={[
            styles.wrapper,
            {backgroundColor: isRead ? "#fff" : "#e7f3ff"},
          ]}>
          <View style={styles.container}>
            <Image
              source={DefaultGroupNotification}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.headerText}>{notification.title}</Text>
              <Text numberOfLines={2} style={styles.content}>
                {notification.content}
              </Text>
              <Text style={styles.time}>
                {Helper.getTime(notification.createdDate)}
              </Text>
            </View>
          </View>
          {notification.type === "NEED_RESPONSE" && (
            <View style={styles.arrow}>
              <Feather name="chevron-right" size={24} color={"black"} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
