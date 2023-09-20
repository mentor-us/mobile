import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import styles from "./styles";
import {ArrowDownFilledIcon, FocusIcon, RefreshIcon} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {useAppDispatch, useAppSelector} from "~/redux";
import {EventActions} from "~/redux/features/event/slice";
import moment from "moment";
import {TimelineCalendarRef} from "../../TimelineEvent/index.props";
import {MonthCalendarRef} from "../../MonthCalendar/index.props";

const HeaderLeft = () => {
  const {month, enableMonthSlider} = useAppSelector(state => state.event);
  const rotation = useSharedValue(0);
  const refresh = useSharedValue(0);
  const dispatcher = useAppDispatch();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  const reloadAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${refresh.value}deg`}],
    };
  });

  const onPress = () => {
    "worklet";
    rotation.value = withTiming(enableMonthSlider ? 0 : 180);
    dispatcher(EventActions.pressMonthButton());
  };

  const onRefresh = () => {
    "worklet";
    refresh.value = withSpring(refresh.value + 360);
    dispatcher(EventActions.updateMarkedDates(moment().format("YYYY-MM-DD")));
    dispatcher(EventActions.setMonth(moment().toDate().getMonth() + 1));
    dispatcher(EventActions.setLoading(true));

    TimelineCalendarRef.current?.goToDate({animatedDate: true});
    MonthCalendarRef.current?.scrollToMonth(moment().format("YYYY-MM-DD"));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.focusButton]} onPress={onRefresh}>
        <Animated.View style={[reloadAnimatedStyle]}>
          <RefreshIcon width={36} height={36} />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress} style={styles.monthButton}>
        <Text style={styles.title}>{`Tháng ${month}`}</Text>
        <SizedBox width={4} />
        <Animated.View style={[animatedStyle]}>
          <ArrowDownFilledIcon />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLeft;
