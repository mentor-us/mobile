import { useQuery } from "@tanstack/react-query";
import { UserProfileModel } from "~/models/user";
import UserServiceV2 from "~/services/user.v2";

export const CurrentUserQueryKey = ["user", "me"];

export const useCurrentUser = <TData = UserProfileModel>(
  select?: (data: UserProfileModel) => TData,
) =>
  useQuery({
    queryKey: CurrentUserQueryKey,
    queryFn: UserServiceV2.getCurrentUser,
    select,
    staleTime: 60 * 1000,
  });
