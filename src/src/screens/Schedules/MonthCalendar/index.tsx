import React, {useEffect} from "react";
import {CalendarList, DateData, LocaleConfig} from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {EventScreenState} from "~/models/schedule";
import {useAppDispatch, useAppSelector} from "~/redux";
import {EventActions} from "~/redux/features/event/slice";
import {TimelineCalendarRef} from "../TimelineEvent/index.props";
import {MonthCalendarRef} from "./index.props";

const MonthCalendar = () => {
  const {enableMonthSlider, markedDates}: EventScreenState = useAppSelector(
    state => state.event,
  );
  const dispatcher = useAppDispatch();

  const height = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      maxHeight: height.value,
    };
  });

  const CustomLayoutTransition = (values: any) => {
    "worklet";
    return {
      animations: {
        height: withTiming(values.targetHeight, {duration: 500}),
      },
      initialValues: {
        height: values.currentHeight,
      },
    };
  };

  const onMonthChange = (date: DateData) => {
    dispatcher(EventActions.setMonth(date.month));
  };

  const onDayPress = (date: DateData) => {
    TimelineCalendarRef.current?.goToDate({
      date: date.dateString,
      animatedDate: true,
    });
    dispatcher(EventActions.updateMarkedDates(date.dateString));
  };

  useEffect(() => {
    if (enableMonthSlider) {
      height.value = withTiming(500, {duration: 500});
    } else {
      height.value = withTiming(0);
    }
  }, [enableMonthSlider]);

  return (
    <Animated.View layout={CustomLayoutTransition}>
      <Animated.View style={animatedStyles}>
        <CalendarList
          ref={MonthCalendarRef}
          onMonthChange={onMonthChange}
          pastScrollRange={3}
          futureScrollRange={12}
          scrollEnabled={true}
          showScrollIndicator={false}
          horizontal
          pagingEnabled
          firstDay={1}
          onDayPress={onDayPress}
          markedDates={markedDates}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default MonthCalendar;

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  dayNames: ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};

LocaleConfig.defaultLocale = "vi";
