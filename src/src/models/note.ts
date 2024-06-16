export interface NoteUserProfile {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  totalNotes: number;
}

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

export interface NoteUserAccess {
  user: NoteUserProfile;
  notePermission: NoteUserAccessType;
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

// GET /api/users/mentees - phan trang - dung de tao note
// All ng dc mentee

// GET /api/notes/users - phan trang - dung de xem danh sach ng dc note
// All ng co note dc share va co quyen xem

// CRUD Notes

// CRUD - POST /api/notes/{noteId}/share
// params: ShareNoteDto
