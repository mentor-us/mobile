import {ShortProfileUserModel} from "./user";

export type NotificationType =
  | "SYSTEM"
  | "NEW_COMMENT"
  | "NEW_MESSAGE"
  | "NEW_TASK"
  | "NEW_MEETING"
  | "NEW_REACTION"
  | "NEW_IMAGE_MESSAGE"
  | "NEW_FILE_MESSAGE"
  | "UPDATE_MEETING"
  | "RESCHEDULE_MEETING"
  | "NEED_RESPONSE"
  | "NEW_VOTE";

export interface Notification {
  id: string;
  title: string;
  type: NotificationType;
  sender: ShortProfileUserModel;
  content: string;
  createdDate: string;
  refId: string;
}
