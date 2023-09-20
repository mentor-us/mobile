import {CalendarViewMode, EventItem} from "@howljs/calendar-kit";
import {MarkingProps} from "react-native-calendars/src/calendar/day/marking";
import {MarkedDates, MarkingTypes} from "react-native-calendars/src/types";

export type CalendarMode = CalendarViewMode | "month";

export type EventType = "MEETING" | "TASK";
export interface ScheduleModel {
  id: string;
  title: string;
  start: string;
  end: string;
  type: EventType;
  color: string;
}

export interface MyMarkingProps {
  selected?: boolean;
  marked?: boolean;
  textColor?: string;
  selectedColor?: string;
  today?: boolean;
  // inactive?: boolean;
  // disabled?: boolean;
  // disableTouchEvent?: boolean;
  // activeOpacity?: number;
  // selectedTextColor?: string;
  // type?: MarkingTypes;
}

export interface MyMarkedDate {
  [key: string]: MyMarkingProps;
}

export const SCHEDULE_SAMPLE: ScheduleModel = {
  id: "",
  title: "",
  start: new Date().toISOString(),
  end: new Date().toISOString(),
  type: "MEETING",
  color: "#fff",
};

export interface EventScreenState {
  calendarMode: CalendarMode;
  enableMonthSlider: boolean;
  month: number;
  events: ScheduleModel[];
  loading: boolean;
  markedDates: MyMarkedDate;
}
