import {useNavigation} from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";
import BackHeader from "~/components/BackHeader";
import Feather from "react-native-vector-icons/Feather";
import {Notification} from "~/models/notification";
import {useEffect, useState} from "react";
import NotificationApi from "~/api/remote/NotificationApi";
import styles from "./style";
import {NotificationType} from "~/models/notification";
import { SHORT_PROFILE_USER_MODEL } from "~/models/user";

const NOTIFICATION_SAMPLE: Notification = {
  id: "1",
  title: "19_3",
  type: "SYSTEM",
  sender: SHORT_PROFILE_USER_MODEL,
  content:
    "Thông báo gấp: Chiều nay nghỉ học. Tuần sau lớp sinh hoạt ngoại khoá, các bạn nhớ chú ý tham gia và điểm danh đầy đủ.",
  createdDate: new Date().toString(),
  refId: ""
};

export default function NotificationDetail({route}) {
  const notificationId: string = route.params.notificationId;
  const navigation = useNavigation();
  const [notification, setNotification] = useState<Notification | null>(
    NOTIFICATION_SAMPLE,
  );

  const fetchNotification = async () => {
    const notif: Notification | null = await NotificationApi.findById(
      notificationId,
    );
    setNotification(notif);
  };

  useEffect(() => {
    //fetchNotification();
  }, []);

  const FieldLabel = ({icon, title}) => (
    <View style={styles.fieldLabel}>
      <Feather name={icon} size={24} color="black" style={styles.fieldImg} />
      <Text style={styles.fieldLabelText}>{title}</Text>
    </View>
  );

  const FormField = ({icon, title, content}) => (
    <View style={styles.formField}>
      <FieldLabel icon={icon} title={title} />

      {content && (
        <View style={styles.fieldContent}>
          <View style={styles.fieldContentShadow}>
            <Text style={styles.fieldContentText}>{content}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const BtnGroup = () => (
    <View style={styles.btnGroup}>
      <TouchableHighlight
        style={[styles.btn, {backgroundColor: "#68a0cf"}]}
        underlayColor="#fff"
        onPress={() => console.log("accepted")}>
        <Text style={styles.btnText}>Đồng ý</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={[styles.btn, {backgroundColor: "red"}]}
        underlayColor="#fff"
        onPress={() => console.log("reject")}>
        <Text style={styles.btnText}>Từ chối</Text>
      </TouchableHighlight>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <BackHeader
        back={true}
        onPressBack={() => navigation.goBack()}
        title={'Chi tiết thông báo'}
      /> */}
      <View>
        <FormField icon="bell" title="Thông báo" content={""} />

        <FormField icon="type" title="Group" content={notification?.title} />

        <FormField
          icon="file-text"
          title="Nội dung"
          content={notification?.content}
        />

        <FormField
          icon="clock"
          title="Thời gian"
          content={notification?.createdDate}
        />

        <FormField icon="user" title="Người gửi" content={""} />

        <View style={styles.formField}>
          <FieldLabel icon="activity" title="Phản hồi" />
          <BtnGroup />
        </View>
      </View>
    </SafeAreaView>
  );
}
