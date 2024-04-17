import { useQuery } from "@tanstack/react-query";
import { useMobxStore } from "~/mobx/store";
import { UserProfileModel } from "~/models/user";
import UserServiceV2 from "~/services/user.v2";

export const CurrentUserQueryKey = ["user", "me"];

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
