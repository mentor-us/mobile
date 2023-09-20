import {RoleType} from "~/models/commonTypes";

export type InfoItemType =
  | "attendee"
  | "media"
  | "meeting"
  | "task"
  | "pin"
  | "isNoti"
  | "faq"
  | "notes"
  | "notification_list";

export interface InfoItemModel {
  type: InfoItemType;
  text: string;
  switchStatus?: boolean;
  triggerAction?: () => {};
}
