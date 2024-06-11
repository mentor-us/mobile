import { RoleType, PermissionType } from "./commonTypes";
import { MessageModel } from "./message";

export const GROUP_SAMPLE: GroupModel = {
  id: "",
  name: "",
  totalMember: 2,
  role: RoleType.MENTEE,
  groupCategory: "",
  pinned: false,
};

export const GROUP_SAMPLE_MENTOR: GroupModel = {
  id: "",
  name: "",
  totalMember: 2,
  role: RoleType.MENTOR,
  groupCategory: "",
};

export interface ShortGroupModel {
  id: string;
  name: string;
}

export interface GroupPermission {
  uploadImage: boolean;
  uploadFile: boolean;
  createMeeting: boolean;
  createTask: boolean;
}

export interface GroupModel {
  id: string;
  name: string;
  role: RoleType;
  totalMember: number;
  pinned?: boolean;
  description?: string;
  groupCategory: string;
  images?: string[];
  imageUrl?: string;
  permissions?: PermissionType[];
  hasNewMessage?: boolean;
  newMessage?: string;
  newMessageId?: string;
  pinnedMessages?: MessageModel[];
  type?: "PUBLIC" | "PRIVATE" | "PRIVATE_MESSAGE";
  channels?: GroupModel[];
  privates?: GroupModel[];
  parentId?: string;
  marked?: boolean;
  timeEnd?: string;
  defaultChannelId?: string;
}

export interface GroupMemberModel {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  role: RoleType;
  marked?: boolean;
}

export const GROUP_MEMBER_SAMPLE: GroupMemberModel = {
  id: "",
  email: "",
  name: "",
  imageUrl: "",
  role: RoleType.MENTEE,
};

export interface GroupChannel {
  id: string;
  name: string;
  description: string;
  type?: "PUBLIC" | "PRIVATE" | "PRIVATE_MESSAGE";
  hasNewMessage?: boolean;
  // imageUrl?: string;
  parentId?: string;
  group?: GroupModel;
  groupName: string;
}
export interface GroupChannelSearchInput {
  type?: string;
  page?: number;
  pageSize?: number;
  query?: string;
}

export const GROUP_CHANNEL_SAMPLE: GroupChannel = {
  id: "",
  name: "",
  description: "",
};
