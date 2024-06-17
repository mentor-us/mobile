import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNoteDto, NoteDetail } from "~/models/note";
import NoteService from "~/services/note";
import { GetAllNoteOfUserQueryKey, GetNotedUsersQueryKey } from "../notes/keys";

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<NoteDetail, Error, CreateNoteDto>({
    mutationKey: "createNote",
    mutationFn: async (createNoteDto: CreateNoteDto) => {
      return await NoteService.createNote(createNoteDto);
    },
    onSuccess(data, dto: CreateNoteDto) {
      // Reload all notes of users\
      queryClient.refetchQueries({
        queryKey: GetNotedUsersQueryKey,
      });
      Promise.all(
        dto.userIds.map(userId =>
          queryClient.refetchQueries({
            queryKey: GetAllNoteOfUserQueryKey(userId),
          }),
        ),
      );
    },
  });
};
