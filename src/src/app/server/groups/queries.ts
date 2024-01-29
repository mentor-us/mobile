import { useQuery } from "@tanstack/react-query";
import GroupService from "~/services/group";
import GroupApi from "~/api/remote/GroupApi";
import { useReactNavigationQuery } from "~/hooks/useReactNavigationQuery";
import { GroupModel } from "~/models/group";

export const GetGroupMembersQueryKey = (groupId?: string) => [
  "group-members",
  groupId,
];

export const useGroupMembers = (groupId?: string) =>
  useQuery({
    queryKey: GetGroupMembersQueryKey(groupId),
    queryFn: () => GroupService.getMembers(groupId ?? ""),
    enabled: !!groupId,
  });

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

export const GetGroupMediaQueryKey = (groupId: string) => [
  "group-media",
  groupId,
];

export const useGetGroupMedia = (groupId: string) =>
  useQuery({
    queryKey: GetGroupMediaQueryKey(groupId),
    queryFn: () => GroupService.getGroupMedia(groupId),
    enabled: !!groupId,
  });
