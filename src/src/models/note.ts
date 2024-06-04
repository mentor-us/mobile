import { ShortProfileUserModel } from "./user";

export interface CreateNoteDto {
  title: string;
  content: string;
  userIds: string[];
}

export interface UpdateNoteDto {
  id: string;
  title: string | null;
  content: string | null;
  userIds: string[] | null;
}

export interface NoteHistory {
  id: string;
  noteId: string;
  description: string;
  updatedDate: Date;
  updatedBy: ShortProfileUserModel;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  creator: ShortProfileUserModel;
  owner: ShortProfileUserModel;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: ShortProfileUserModel;
  isEditable: boolean;
}

export enum NoteUserAccessType {
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export interface NoteUserAccess {
  user: ShortProfileUserModel;
  accessType: NoteUserAccessType;
}

export interface NoteDetail {
  id: string;
  title: string;
  content: string;
  creator: ShortProfileUserModel;
  owner: ShortProfileUserModel;
  createdDate: Date;
  updatedDate: Date;
  updatedBy: ShortProfileUserModel;
  isEditable: boolean;
  noteHistories: NoteHistory[] | null;
  users: ShortProfileUserModel[];
  userAccesses: NoteUserAccess[];
}

export interface NoteAccessDto {
  userId: string;
  accessType: NoteUserAccessType;
}

export interface ShareNoteDto {
  noteId: string;
  users: NoteAccessDto[];
}
