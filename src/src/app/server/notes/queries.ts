import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Note, NoteDetail, NoteUserProfile } from "~/models/note";
import {
  GetAllNoteOfUserQueryKey,
  GetNoteDetailQueryKey,
  GetNotedUsersQueryKey,
} from "./keys";
import NoteService from "~/services/note";
import { useMobxStore } from "~/mobx/store";
import { PaginationData } from "~/models/commonTypes";

export const useGetNotedUsersInfinityQuery = (
  query: string,
  select: (
    data: InfiniteData<PaginationData<NoteUserProfile>>,
  ) => InfiniteData<NoteUserProfile> = data => {
    return {
      pages: data.pages.flatMap(page => page.data),
      pageParams: data.pageParams,
    } as any;
  },
) => {
  const { authStore } = useMobxStore();
  return useInfiniteQuery<PaginationData<NoteUserProfile>>({
    queryKey: GetNotedUsersQueryKey(query),
    select: select,
    queryFn: async ({ pageParam = 0 }) => {
      return NoteService.findNotedUsers(query, pageParam, 25);
    },
    getNextPageParam: lastPage => {
      if (!lastPage) return undefined;
      return lastPage.last ? undefined : Number(lastPage.page) + 1;
    },
    getPreviousPageParam: firstPage => {
      if (!firstPage) return undefined;
      return firstPage.first ? undefined : Number(firstPage.page) - 1;
    },
    enabled: !!authStore.userToken,
    staleTime: 0,
  });
};

export const useGetAllNoteOfUserInfinityQuery = (
  userId: string,
  select: (
    data: InfiniteData<PaginationData<Note>>,
  ) => InfiniteData<Note> = data => {
    return {
      pages: data.pages.flatMap(page => page.data),
      pageParams: data.pageParams,
    } as any;
  },
) => {
  const { authStore } = useMobxStore();
  return useInfiniteQuery<PaginationData<Note>>({
    queryKey: GetAllNoteOfUserQueryKey(userId),
    select: select,
    queryFn: async ({ pageParam = 0 }) => {
      return NoteService.getAllNoteOfUser(userId, {
        search: "",
        page: pageParam,
        pageSize: 25,
      });
    },
    getNextPageParam: lastPage => {
      if (!lastPage) return undefined;
      return lastPage.last ? undefined : Number(lastPage.page) + 1;
    },
    getPreviousPageParam: firstPage => {
      if (!firstPage) return undefined;
      return firstPage.first ? undefined : Number(firstPage.page) - 1;
    },
    enabled: !!authStore.userToken && !!userId,
    staleTime: 0,
  });
};

export const useGetNoteDetailQuery = <TData = NoteDetail>(
  noteId?: string,
  select?: (data: NoteDetail) => TData,
) =>
  useQuery({
    queryKey: GetNoteDetailQueryKey(noteId),
    queryFn: async () => {
      return NoteService.getNoteDetail(noteId!);
    },
    select,
    enabled: !!noteId,
    staleTime: 0,
  });
