import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DeleteNoteMutationKey,
  GetAllNoteOfUserQueryKey,
  GetNotedUsersQueryKey,
  ShareNoteMutationKey,
} from "./keys";
import NoteService from "~/services/note";
import {
  CreateOrUpdateNoteDto,
  NoteDetail,
  ShareNoteRequest,
} from "~/models/note";
import { CreateOrUpdateNoteMutationKey } from "./keys";

export const useDeleteNoteMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: DeleteNoteMutationKey,
    mutationFn: async ({ noteId }: { noteId: string }) => {
      return await NoteService.deleteNote(noteId);
    },
    onSuccess() {
      // Reload all notes of users
      queryClient.refetchQueries({
        predicate: query => query.queryKey[0] === GetNotedUsersQueryKey("")[0],
      });
      queryClient.refetchQueries({
        queryKey: GetAllNoteOfUserQueryKey(userId),
      });
    },
  });
};

export const useCreateOrUpdateNoteMutation = (noteId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<NoteDetail, Error, CreateOrUpdateNoteDto>({
    mutationKey: CreateOrUpdateNoteMutationKey,
    mutationFn: async (createOrUpdateNoteDto: CreateOrUpdateNoteDto) => {
      if (noteId) {
        return await NoteService.updateNote(noteId, createOrUpdateNoteDto);
      }

      return await NoteService.createNote(createOrUpdateNoteDto);
    },
    onSuccess(data, dto: CreateOrUpdateNoteDto) {
      // Reload all notes of users
      queryClient.refetchQueries({
        predicate: queryKey => queryKey[0] === GetNotedUsersQueryKey("")[0],
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

export const useShareNoteMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ShareNoteMutationKey,
    mutationFn: async ({
      noteId,
      shareNoteRequest,
    }: {
      noteId: string;
      shareNoteRequest: ShareNoteRequest;
    }) => {
      console.log("shareNoteRequest", noteId, shareNoteRequest);
      return await NoteService.shareNote(noteId, shareNoteRequest);
    },
    onSuccess() {
      // Reload all notes of users
      queryClient.refetchQueries({
        predicate: query => query.queryKey[0] === GetNotedUsersQueryKey("")[0],
      });
      queryClient.refetchQueries({
        queryKey: GetAllNoteOfUserQueryKey(userId),
      });
    },
  });
};
