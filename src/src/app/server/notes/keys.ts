export const GetNotedUsersQueryKey = query => ["getNotedUsers", query];
export const GetAllNoteOfUserQueryKey = userId => ["getNotedUsers", userId];
export const GetNoteDetailQueryKey = noteId => ["getNoteDetail", noteId];

export const CreateOrUpdateNoteMutationKey = ["note", "createOrUpdate"];
export const ShareNoteMutationKey = ["shareNote"];
export const DeleteNoteMutationKey = ["deleteNote"];
