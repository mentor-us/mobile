import { useQuery } from "@tanstack/react-query";
import GroupApi from "~/api/remote/GroupApi";
import { useReactNavigationQuery } from "~/hooks/useReactNavigationQuery";
import { GroupModel } from "~/models/group";
import GroupService from "~/services/group";

export const GetGroupDetailQueryKey = (groupId: string) => ["group", groupId];

export const useGetGroupDetail = <TData = GroupModel>(
  groupId: string,
  select?: (data: GroupModel) => TData,
) =>
  useReactNavigationQuery(
    GetGroupDetailQueryKey(groupId),
    () => GroupApi.findById(groupId),
    { select, enabled: !!groupId },
  );

export const GetWorkspaceQueryKey = (groupId: string) => ["workspace", groupId];

export const useGetWorkSpace = <TData = GroupModel>(
  groupId: string,
  select?: (data: GroupModel) => TData,
) =>
  useReactNavigationQuery(
    GetWorkspaceQueryKey(groupId),
    () => GroupApi.getWorkspace(groupId),
    {
      select,
      enabled: !!groupId,
    },
  );
