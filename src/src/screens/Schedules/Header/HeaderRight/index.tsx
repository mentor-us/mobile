import {View, TouchableOpacity} from "react-native";
import React, {useCallback} from "react";
import styles from "./styles";
import {CalendarModeIcon} from "~/assets/svgs";
import {CalendarMode} from "~/models/schedule";
import {useAppDispatch, useAppSelector} from "~/redux";
import {EventActions} from "~/redux/features/event/slice";

// const buttons: CalendarMode[] = ["day", "threeDays", "week", "month"];
const buttons: CalendarMode[] = ["day", "threeDays", "week"];

const HeaderRight = () => {
  const calendarMode = useAppSelector(state => state.event.calendarMode);
  const dispatcher = useAppDispatch();

  const renderButton = useCallback(
    (mode: CalendarMode) => {
      return (
        <TouchableOpacity
          key={mode}
          disabled={calendarMode == mode}
          onPress={() => {
            dispatcher(EventActions.updateCalendarMode(mode));
          }}
          style={[
            styles.button,
            calendarMode == mode && styles.buttonSelected,
          ]}>
          <CalendarModeIcon mode={mode} />
        </TouchableOpacity>
      );
    },
    [calendarMode],
  );

  return (
    <View style={styles.container}>
      {buttons.map(item => {
        return renderButton(item);
      })}
    </View>
  );
};

export default HeaderRight;
