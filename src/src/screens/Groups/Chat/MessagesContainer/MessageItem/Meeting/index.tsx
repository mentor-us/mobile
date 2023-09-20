import {View, Text, TouchableOpacity} from "react-native";
import React, {memo} from "react";
import {MeetingModel, MEETING_SAMPLE} from "~/models/meeting";
import styles from "./styles";
import {ClockIcon} from "~/assets/svgs";
import {useNavigation} from "@react-navigation/native";
import isEqual from "react-fast-compare";
interface Props {
  data?: MeetingModel;
}

const mockdata: MeetingModel = MEETING_SAMPLE;

const Meeting = ({data = mockdata}: Props) => {
  const navigation = useNavigation();
  const openMeeting = () => {
    navigation.navigate("meetingDetail", {meetingId: data.id});
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.title}>
            <ClockIcon width={22} height={22} />
            <Text style={styles.tab}>Lịch hẹn</Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.timeDesc}>
          {data.title}
        </Text>
        {/* <Text style={styles.timeDesc}>
          <Text style={styles.hint}>Bắt đầu {data.time.from}</Text>
        </Text> */}
        <Text style={styles.dateDesc}>
          Lúc {data.time.from}, ngày {data.time.date}
        </Text>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={openMeeting}>
            <Text style={styles.textBtn}>Mở lịch</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(Meeting, isEqual);
