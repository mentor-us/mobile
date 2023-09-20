import {CheckBoxType} from "./commonTypes";
import {GROUP_SAMPLE, GroupModel} from "./group";
import {ShortProfileUserModel, USER_PROFILE_SAMPLE} from "./user";
import {Data} from "react-native-timeline-flatlist";

export type MeetingRepeatedType =
  | "NONE"
  | "EVERY_DAY"
  | "ONCE_A_WEEK"
  | "ONCE_TWO_WEEKS"
  | "ONCE_A_MONTH";

export const MeetingRepeatedTypeKeys = [
  "NONE",
  "EVERY_DAY",
  "ONCE_A_WEEK",
  "ONCE_TWO_WEEKS",
  "ONCE_A_MONTH",
];

export const MeetingRepeatedOptions = [
  "Không lặp lại",
  "Hằng ngày",
  "1 lần mỗi tuần",
  "1 lần mỗi 2 tuần",
  "1 lần mỗi tháng",
];

export const MeetingRepeatedObject = {
  NONE: {
    key: "1",
    value: "Không lặp lại",
  },
  ONCE_A_WEEK: {
    key: "2",
    value: "1 lần mỗi tuần",
  },
  ONCE_TWO_WEEKS: {
    key: "3",
    value: "1 lần mỗi 2 tuần",
  },
  ONCE_A_MONTH: {
    key: "4",
    value: "1 lần mỗi tháng",
  },
  EVERY_DAY: {
    key: "5",
    value: "Hằng ngày",
  },
};

export interface Attendee {
  id: string;
  name: string;
  status: CheckBoxType;
}

export interface AttendeeCheckList {
  checkedAll: CheckBoxType;
  data: Attendee[];
  totalChecked: number;
}

export interface TimeMeetingModel {
  from: string; // hh:mm
  to: string; //hh:mm
  date: string; //dd/mm/yyyy
  display: string; // hh:00 - hh:00 hôm này | hh:00 - hh:00 ngày 19/03/2023
}

export interface MeetingHistory extends Data {
  id: string;
  modifier: ShortProfileUserModel;
  modifyDate: string;
  timeEnd: string;
  timeStart: string;
  place?: string;
}

export interface MeetingModel {
  id: string;
  title: string;
  group: GroupModel;
  totalAttendees: number;
  canEdit: boolean;
  repeated: MeetingRepeatedType;
  organizer: ShortProfileUserModel;
  time: TimeMeetingModel;
  timeEnd: string;
  timeStart: string;
  description?: string;
  place?: string;
  histories: MeetingHistory[];
  type?: string;
}

export const MEETING_SAMPLE: MeetingModel = {
  id: "",
  title: "",
  timeStart: "2023-03-08T13:30:00.000+00:00",
  timeEnd: "2023-03-08T15:30:00.000+00:00",
  repeated: "EVERY_DAY",
  place: "",
  organizer: USER_PROFILE_SAMPLE,
  totalAttendees: 3,
  canEdit: false,
  group: GROUP_SAMPLE,
  time: {
    from: "7:00",
    to: "8:00",
    date: "19/03/2023",
    display: "7:00 - 8:00 ngày 19/03/2023",
  },
  histories: [
    {
      id: "",
      modifier: USER_PROFILE_SAMPLE,
      modifyDate: "2023-03-08T15:30:00.000+00:00",
      timeEnd: "2023-03-08T13:30:00.000+00:00",
      timeStart: "2023-03-08T15:30:00.000+00:00",
      time: "2023-03-08T15:30:00",
      title: "Doi lich",
      description: "...",
    },
  ],
};
