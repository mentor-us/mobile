import { MeetingModel } from "./meeting";
import { TaskModel } from "./task";

export type Theme = "light" | "dark" | "default";
export type AppLanguage = "en" | "vi";
export interface DateModel {
  day: number;
  month: number;
  year: number;
}

export interface SchoolYear {
  from: number;
  to: number;
}

export interface SchedulesList {
  upcoming: (MeetingModel | TaskModel)[];
  passed: (MeetingModel | TaskModel)[];
}

export enum RoleType {
  MENTOR = "MENTOR",
  MENTEE = "MENTEE",
}

export type PermissionType =
  | "SEND_FILES"
  | "TASK_MANAGEMENT"
  | "MEETING_MANAGEMENT"
  | "BOARD_MANAGEMENT"
  | "FAQ_MANAGEMENT"
  | "GROUP_SETTINGS";

export type CheckBoxType = "checked" | "unchecked" | "indeterminate";

export type PaginationData<T> = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCounts: number;
  first: boolean;
  last: boolean;
  data: T[];
};
