import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMobxStore } from "~/mobx/store";
import { PaginationData } from "~/models/commonTypes";
import { ShortProfileUserModel, UserProfileModel } from "~/models/user";
import UserServiceV2 from "~/services/user.v2";
import {
  CurrentUserQueryKey,
  GetUserDetailQueryKey,
  SearchAllUsersByEmailQueryKey,
  SearchMenteesQueryKey,
} from "./keys";
import UserService from "~/services/user";

export const useCurrentUser = <TData = UserProfileModel>(
  select?: (data: UserProfileModel) => TData,
) => {
  const { authStore } = useMobxStore();
  return useQuery({
    queryKey: CurrentUserQueryKey,
    queryFn: UserServiceV2.getCurrentUser,
    enabled: !!authStore.userToken,
    select,
    staleTime: 60 * 1000,
  });
};

export const useGetUserDetail = <TData = UserProfileModel>(
  userId: string,
  select?: (data: UserProfileModel) => TData,
) => {
  return useQuery({
    queryKey: GetUserDetailQueryKey(userId),
    queryFn: () => UserService.findById(userId),
    enabled: !!userId,
    select,
  });
};

export const useSearchAllUsersByEmail = <TData = UserProfileModel[]>(
  select?: (data: UserProfileModel[]) => TData,
) => {
  const { authStore } = useMobxStore();
  return useQuery({
    queryKey: SearchAllUsersByEmailQueryKey(""),
    queryFn: () => {
      return UserServiceV2.findByEmail("");
    },
    enabled: !!authStore.userToken,
    select,
  });
};

export const useInfinitySearchMentees = (query: string) => {
  const { authStore } = useMobxStore();
  return useInfiniteQuery<PaginationData<ShortProfileUserModel>>({
    queryKey: SearchMenteesQueryKey(query),
    select: data => {
      return {
        pages: data.pages.flatMap(page => page.data),
        pageParams: data.pageParams,
      } as any;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const menteePage = await UserServiceV2.findMentees(query, pageParam, 25);
      return menteePage;
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
