export const GetNotedUsersQueryKey = ["getNotedUsers"];
export const GetAllNoteOfUserQueryKey = userId => [
  "GetAllNoteOfUserQueryKey",
  userId,
];
export const GetNoteDetailQueryKey = noteId => ["getNotedUsers", noteId];
