import { Color } from "~/constants/Color";
import { CheckBoxType, RoleType } from "./commonTypes";
import { ShortGroupModel } from "./group";
import { ShortProfileUserModel, USER_PROFILE_SAMPLE } from "./user";

export type TaskStatusType =
  | "TO_DO"
  | "IN_PROGRESS"
  | "DONE"
  | "OVERDUE"
  | "NULL";
export interface TaskStatusModel {
  key: TaskStatusType;
  displayName: string;
  color: string;
}

export const TaskTextOptions = [
  "Mới",
  "Đang thực hiện",
  "Hoàn thành",
  // "Đã trễ hạn",
];

export const TaskStatusKeyIndex = [
  "TO_DO",
  "IN_PROGRESS",
  "DONE",
  "OVERDUE",
  "NULL",
];

export const TaskStatusObject = {
  TO_DO: {
    key: "TO_DO",
    displayName: "Mới",
    color: "#333",
    backgroundColor: Color.backgroundGray,
    icon: "progress-close",
  },
  IN_PROGRESS: {
    key: "IN_PROGRESS",
    displayName: "Đang thực hiện",
    color: "#2A7BDE",
    backgroundColor: "#2A7BDE",
    icon: "progress-upload",
  },
  DONE: {
    key: "DONE",
    displayName: "Hoàn thành",
    color: "#4EA05B",
    backgroundColor: "#4EA05B",
    icon: "progress-check",
  },
  OVERDUE: {
    key: "OVERDUE",
    displayName: "Đã trễ hạn",
    color: "#C01C28",
    backgroundColor: "#C01C28",
    icon: "progress-alert",
  },
  NULL: {
    key: "NULL",
    displayName: "",
    color: "transparent",
    backgroundColor: "transparent",
    icon: "",
  },
};

export interface Assignee {
  id: string;
  name: string;
  status: TaskStatusType;
  assigned: CheckBoxType;
  email: string;
  imageUrl: string;
  role: RoleType;
}

export interface AssignedCheckList {
  checkedAll: CheckBoxType;
  data: Assignee[];
  totalChecked: number;
}

export interface TaskModel {
  id: string;
  title: string;
  deadline: string;
  status: TaskStatusType;
  deadlineTimeModel: {
    time: string; //hh:mm
    date: string; // dd/mm/yyyy
    displayName: string;
  };
  description: string;
  group: ShortGroupModel;
  assigner: ShortProfileUserModel;
  assignees: Assignee[];
  role: RoleType;
  totalAssignees: number;
}

export const TASK_SAMPLE: TaskModel = {
  id: "",
  title: "",
  deadline: "",
  group: { id: "", name: "" },
  status: "IN_PROGRESS",
  description: "",
  deadlineTimeModel: {
    time: "22:45",
    date: "15/06/2023",
    displayName: "23:59 ngày mai",
  },
  assigner: USER_PROFILE_SAMPLE,
  assignees: [],
  role: RoleType.MENTOR,
  totalAssignees: 0,
};
