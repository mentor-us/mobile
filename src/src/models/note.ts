import { UserProfileModel } from "./user";

export interface NoteUserProfile {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  totalNotes: number;
}

export interface CreateOrUpdateNoteDto {
  title: string;
  content: string;
  userIds: string[];
}

export interface NoteHistory {
  id: string;
  title: string;
  content: string;
  noteId: string;
  createdDate: Date;
  description: string;
  updatedDate: Date;
  updatedBy: NoteUserProfile;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  creator: NoteUserProfile;
  owner: NoteUserProfile;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: NoteUserProfile;
  isEditable: boolean;
}

export enum NoteUserAccessType {
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export interface NoteDetail {
  id: string;
  title: string;
  content: string;
  creator: NoteUserProfile;
  owner: NoteUserProfile;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: NoteUserProfile;
  isEditable: boolean;
  noteHistories: NoteHistory[] | null;
  users: NoteUserProfile[];
  shareType: NoteShareType;
  userAccesses: NoteUserAccess[];
}

export interface NoteUserAccess {
  user: UserProfileModel;
  notePermission: NotePermission;
}

export interface NoteUserAccessRequest {
  userId: string;
  accessType: NotePermission;
}

export interface ShareNoteRequest {
  shareType: NoteShareType;
  users: NoteUserAccessRequest[];
}

export enum NoteShareType {
  PUBLIC,
  MENTOR_VIEW,
  MENTOR_EDIT,
  PRIVATE,
}

export enum NotePermission {
  EDIT,
  VIEW,
}

// GET /api/users/mentees - phan trang - dung de tao note
// All ng dc mentee

// GET /api/notes/users - phan trang - dung de xem danh sach ng dc note
// All ng co note dc share va co quyen xem

// CRUD Notes

// CRUD - POST /api/notes/{noteId}/share
// params: ShareNoteDto
