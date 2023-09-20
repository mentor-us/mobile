import {View, Text, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {
  ChevronBottomIcon,
  StudentReadingIcon,
  TeacherIcon,
} from "~/assets/svgs";
import styles from "./styles";
import EventsCarosel from "./EventsCarosel";

import {runWithLayoutAnimation} from "~/hooks/LayoutAnimation";

import {MeetingModel} from "~/models/meeting";
import {TaskModel} from "~/models/task";
import {useNavigation} from "@react-navigation/native";

interface Props {
  events: (MeetingModel | TaskModel)[];
}

const ListHeader = ({events = []}: Props) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const navigation = useNavigation();

  const changeExpand = () => {
    runWithLayoutAnimation({
      processCallback() {
        setIsExpand(prev => !prev);
      },
    });
  };

  return (
    <View style={styles.container}>
      {events.length >= 0 && <EventsCarosel events={events} />}
      {/* {events.length >= 0 && <SizedBox height={12} />} */}
      {/* <View style={styles.annotationCtn}>
        <View style={styles.annotationItem}>
          <TeacherIcon width={20} height={20} />
          <Text style={styles.annotationTitle}>Nhóm quản lý</Text>
        </View>
        <View style={styles.annotationItem}>
          <StudentReadingIcon width={20} height={20} />
          <Text style={styles.annotationTitle}>Nhóm thành viên</Text>
        </View>
      </View> */}
    </View>
  );
};

export default ListHeader;
