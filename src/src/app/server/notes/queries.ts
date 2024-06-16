import { useQuery } from "@tanstack/react-query";
import { NoteDetail, NoteUserProfile } from "~/models/note";
import {
  GetAllNoteOfUserQueryKey,
  GetNoteDetailQueryKey,
  GetNotedUsersQueryKey,
} from "./keys";
import NoteService from "~/services/note";

export const useGetNotedUsersQuery = <TData = NoteUserProfile[]>(
  query: string,
  select?: (data: NoteUserProfile[]) => TData,
) =>
  useQuery({
    queryKey: GetNotedUsersQueryKey,
    queryFn: async () => {
      return NoteService.findNotedUsers(query, 0, 25);
    },
    select,
  });

export const useGetAllNoteOfUserQuery = (userId: string) =>
  useQuery({
    queryKey: GetAllNoteOfUserQueryKey(userId),
    queryFn: async () => {
      return NoteService.getAllNoteOfUser(userId, {
        search: "",
        page: 0,
        pageSize: 25,
      });
    },
    enabled: !!userId,
  });

export const useGetNoteDetailQuery = <TData = NoteDetail>(
  noteId: string,
  select?: (data: NoteDetail) => TData,
) =>
  useQuery({
    queryKey: GetNoteDetailQueryKey(noteId),
    queryFn: async () => {
      return NoteService.getNoteDetail(noteId);
    },
    select,
  });
