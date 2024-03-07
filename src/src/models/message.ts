import { TotalReaction } from "~/constants/Emoijs";
import { MeetingModel } from "./meeting";
import { TaskModel } from "./task";
import { ShortProfileUserModel } from "./user";
import { Reaction } from "./reaction";
import { FileModel } from "./media";
import { Vote } from "./vote";

export type MessageType =
  | "TEXT"
  | "FILE"
  | "IMAGE"
  | "VIDEO"
  | "MEETING"
  | "TASK"
  | "VOTE"
  | "NOTIFICATION"
  | "SYSTEM";

export const MessageEnumType = {
  Text: "TEXT",
  File: "FILE",
  Image: "IMAGE",
  Video: "VIDEO",
  Meeting: "MEETING",
  Task: "TASK",
  Vote: "VOTE",
  Notification: "NOTIFICATION",
  System: "SYSTEM",
};

export type VotingStatus = "OPEN" | "CLOSED";

export interface VoteOptionModel {
  id: string;
  title: string;
  total: number;
  voters: ShortProfileUserModel[];
}

export interface VoteModel {
  id: string;
  question: string;
  groupId: string;
  creator: ShortProfileUserModel;
  timeEnd: string;
  createdDate: string;
  status: VotingStatus;
  closedDate: string;
  options: VoteOptionModel[];
}

export interface SystemMessageContent {
  content: string;
  icon: "PIN" | "UNPIN" | "MEETING" | "TASK" | "VOTING" | "MEMBER";
}

export interface ReplyMessageModel {
  id: string;
  senderName: string;
  content: string;
}
export interface ForwardMessageModel {
  id: string;
  content: string;
  type: MessageType;
  images?: Social.MediaItem[];
}

export interface MessageModel {
  id: string;
  type: MessageType;
  sender: ShortProfileUserModel;
  createdDate: string;
  groupId: string;
  content?: string;
  systemContent?: SystemMessageContent;
  vote?: Vote;
  meeting?: MeetingModel;
  task?: TaskModel;
  images?: Social.MediaItem[];
  file?: FileModel;
  totalReaction: TotalReaction;
  reactions: Reaction[];
  uploadFailed?: boolean;
  status?: "SENT" | "EDITED" | "DELETED";
  reply?: ReplyMessageModel | undefined;
  forward?: boolean;
  editedAt?: string;
}

export interface MessagesSectionModel {
  data: MessageModel[];
  title: string;
  groupId: string;
  createdDate: Date;
}

export interface PinModel {
  creator: ShortProfileUserModel;
  timeDesc: string;
  messagePin: MessageModel;
}

export interface NoteModel {
  creator: ShortProfileUserModel;
  timeDesc: string;
  content: string;
}

export const VOTE_SAMPLE: VoteModel = {
  id: "1",
  creator: {
    id: "495",
    name: "Duy Nguyễn",
    imageUrl:
      "https://lh3.googleusercontent.com/hn6hJQjH3TYPNVnDehTEII9j6NcjL9fMUMUb9zkPBnQfyHF7Gzkp7eWf6Eup7rWxFbIsYLNRWQWVACRsomrYj9eDtGUgfvbeF-EADGrwg3pLPajcbd90g5oju0cbSgt3wzygJvflwtBhnwyEyGMJJYdY3DNR3ePuvSLHROnxe9Y2M4_EJIdEjm0dAHu9V65k9m_UFiMMllsKuGEDGYv36KI3Vcr45tw1a4qXljA2Wa2l9flWItNVJhjJi4G4qkxGErrOEO61TEmXHBWXydM8jHT4jdiz2GdSu-C1NGwOP9AtjDO0Vxl7jl0AxxvySB0X6Sqay4PZlXz7OO9r1Kcen0890rL40fYIjXLOKtpvwEoZ_SYI8whO2M8hEo367LETW2rJGN4jIM-7gqwk0i4z_WiFYCM6ugTSwXu_B2JHb1WNpsW9hANOLR5HpUi05-6Hu0K9Sr68wuDtPUZNUj1PswbEBUxlJS1eQ5RaUGGpcYrSBEWtvgCSuGWxYVytORrGraZVL-OrVsJ0qqZJN3uhMxfV4id3MrJ_498xl54ZaKbL2Dhb989Z_F4TpeBTHxGK9j3nF7OdbbE6D_pAsKpm4eYNxGeO_-NTjGMDYYNf9_jDruv0UzCItmr89eHH1YNl7jX7SoRraIHesjpcx1P82wE-oVPM0Si1JCE5majUgxC18V5RBQU7vj2sac4-ywKwwBdaJUWh7RRqWeDx8invbDhKAx3_yk4oneYfRTwNM28FrVZGMgamMEi3u2f19F1iG_R8skSzTIlWSplJD_DG0gamX3Tgfau8bBDPZnq_ZHveXIDZKrZIbNRfQbjkljKubtT0lDLqS6_8f_YbWTiR9ypnGbf_c8h2PcjXhASEL2Nco8Szyx8QyULQ_CH7SicCY4ACOfnNyvWvRGpe9fwcdHi_ZMABeReFoQH9tf41knCq=w234-h292-no?authuser=0",
  },
  createdDate: "8 ngày trước",
  question: "Bình chọn mới",
  options: [
    { id: "1", title: "A", total: 0, voters: [] },
    { id: "2", title: "B", total: 0, voters: [] },
  ],
  groupId: "",
  timeEnd: "",
  status: "OPEN",
  closedDate: "",
};
