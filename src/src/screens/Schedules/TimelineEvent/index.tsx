import {View, Text, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import "dayjs/locale/vi";
import {
  CalendarViewMode,
  MomentConfig,
  PackedEvent,
  TimelineCalendar,
} from "@howljs/calendar-kit";
import {useAppDispatch, useAppSelector} from "~/redux";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";
import moment from "moment";
import {EventActions} from "~/redux/features/event/slice";
import {Calendar} from "react-native-big-calendar";
import {screenHeight} from "~/constants";
import {TimelineCalendarRef} from "./index.props";

MomentConfig.updateLocale("vi", {
  weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
});

const TimelineEvent = () => {
  const state = useAppSelector(state => state.event);
  const dispacher = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());

  const navigation = useNavigation();

  const onPressEvent = (event: any) => {
    switch (event.type) {
      case "MEETING":
        navigation.navigate("meetingDetail", {meetingId: event.id});
        break;
      case "TASK":
        navigation.navigate("taskDetail", {taskId: event.id});
        break;
      default:
        break;
    }
  };

  const onDateChanged = (date: string) => {
    const temp = moment(date, "YYYY-MM-DD").toDate();
    dispacher(EventActions.setMonth(temp.getMonth() + 1));
  };

  useEffect(() => {
    setDate(moment(`2023-${state.month}-01`, "YYYY-MM-DD").toDate());
  }, [state.month]);

  return (
    <View style={styles.container}>
      {state.calendarMode == "month" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Calendar
            events={state.events}
            height={screenHeight}
            locale={"vi"}
            mode={"month"}
            showAllDayEventCell={true}
            swipeEnabled={true}
            onPressEvent={onPressEvent}
            bodyContainerStyle={{backgroundColor: "#fff"}}
            weekStartsOn={1}
            headerContainerStyle={{backgroundColor: "#fff", paddingTop: 4}}
            date={date}
          />
        </ScrollView>
      ) : (
        <TimelineCalendar
          ref={TimelineCalendarRef}
          viewMode={state.calendarMode as CalendarViewMode}
          allowPinchToZoom
          locale="vi"
          isShowHeader
          events={state.events}
          maxTimeIntervalHeight={300}
          onDateChanged={onDateChanged}
          isLoading={state.loading}
          onPressEvent={onPressEvent}
        />
      )}
    </View>
  );
};

export default TimelineEvent;
