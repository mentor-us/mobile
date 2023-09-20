import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, {useRef, useState} from "react";
import FontSize from "~/constants/FontSize";
import {Color} from "~/constants/Color";
import MeetingItem from "~/components/MeetingItem";
import {CalendarIcon} from "~/assets/svgs";
import DotCarousel from "~/components/DotCarousel";
import {useNavigation} from "@react-navigation/native";
import TaskItem from "~/components/TaskItem";
import {TaskModel} from "~/models/task";
import {MeetingModel} from "~/models/meeting";
import Helper from "~/utils/Helper";

interface Props {
  events: (TaskModel | MeetingModel)[];
}

const EventsCarosel = ({events}: Props) => {
  const scrollX = useRef<Animated.Value>(new Animated.Value(0));
  const navigation = useNavigation();

  const renderItem = ({item}) => {
    if (!item) {
      return <></>;
    }
    if (item.type == "MEETING") {
      const data = {
        ...item,
        time: Helper.getTimeMeeting(item.timeStart, item.timeEnd),
        organizer: {
          name: item.user,
        },
      };
      return <MeetingItem data={data} isIncomming={true} />;
    }

    const data = {
      ...item,
      deadlineTimeModel: {
        time: Helper.formatDate(item.deadline, "time"),
        date: Helper.formatDate(item.deadline, "date"),
        displayName: Helper.getTime(item.deadline),
      },
      status: item?.status || "NULL",
      group: {
        name: item.groupName,
      },
    };
    return <TaskItem data={data} isIncomming={true} />;
  };

  const seeMore = () => {
    navigation.navigate("scheduleStack");
  };

  return (
    <View>
      <View style={styles.headerCtn}>
        <View style={styles.titleCtn}>
          <CalendarIcon />
          <Text style={styles.title}>Sự kiện sắp tới</Text>
        </View>
        <DotCarousel ref={scrollX} current={scrollX.current} dotNumber={events.length} />
        <TouchableOpacity onPress={seeMore}>
          <Text style={{color: Color.text[1]}}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={events}
        renderItem={renderItem}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX.current}}}],
          {useNativeDriver: false},
        )}
        keyExtractor={(item, index) => `${index}-${item.toString()}`}
      />
    </View>
  );
};

export default EventsCarosel;

const styles = StyleSheet.create({
  container: {},
  titleCtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.larger,
    color: Color.text[3],
    fontWeight: "bold",
    marginLeft: 4,
  },
  headerCtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 4,
  },
});
