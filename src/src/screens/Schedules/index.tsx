import React, {useEffect, useCallback} from "react";
import "dayjs/locale/vi";
import styles from "./style";
import {StackNavigationOptions} from "@react-navigation/stack";
import {useNavigation} from "@react-navigation/core";

import {CalendarIcon, TaskListIcon} from "~/assets/svgs";
import {FloatingAction, IActionProps} from "react-native-floating-action";
import {Color} from "~/constants/Color";
import HeaderRight from "./Header/HeaderRight";
import HeaderLeft from "./Header/HeaderLeft";
import Animated, {withTiming} from "react-native-reanimated";
import MonthCalendar from "./MonthCalendar";
import {useAppDispatch, useAppSelector} from "~/redux";
import TimelineEvent from "./TimelineEvent";
import EventThunk from "~/redux/features/event/thunk";

const Schedules = () => {
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();
  const {loading} = useAppSelector(state => state.event);

  const headerRight = useCallback(() => {
    return <HeaderRight />;
  }, []);

  const headerLeft = useCallback(() => {
    return <HeaderLeft />;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight,
      headerLeft,
    } as Partial<StackNavigationOptions>);
  });

  const onAdd = useCallback((name: any) => {
    switch (name) {
      case "meeting":
        navigation.navigate("createMeeting", {
          groupId: "",
        });
        break;
      case "task":
        navigation.navigate("createTask", {
          groupId: "",
        });
        break;
      default:
        return null;
    }
  }, []);

  const CustomLayoutTransition = values => {
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

  useEffect(() => {
    if (loading) {
      dispatcher(EventThunk.fetchEvent());
    }
  }, [loading]);

  return (
    <Animated.View style={styles.container} layout={CustomLayoutTransition}>
      <MonthCalendar />
      <TimelineEvent />
      {/* Float button */}
      <FloatingAction
        actions={Actions}
        onPressItem={onAdd}
        color={Color.primary}
        tintColor={Color.transparent}
        animated={true}
        buttonSize={50}
      />
    </Animated.View>
  );
};

export default Schedules;

const Actions: IActionProps[] = [
  {
    text: "Lịch hẹn mới",
    icon: <CalendarIcon />,
    color: "white",
    name: "meeting",
  },
  {
    text: "Công việc mới",
    icon: <TaskListIcon />,
    color: "white",
    name: "task",
  },
];
