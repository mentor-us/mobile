import { useQuery } from "@tanstack/react-query";
import GroupApi from "~/api/remote/GroupApi";
import { GroupModel } from "~/models/group";
import GroupService from "~/services/group";

export const GetGroupDetailQueryKey = (groupId: string) => ["group", groupId];

export const useGetGroupDetail = <TData = GroupModel>(
  groupId: string,
  select?: (data: GroupModel) => TData,
) =>
  useQuery({
    queryKey: GetGroupDetailQueryKey(groupId),
    queryFn: () => GroupApi.findById(groupId),
    select,
  });

export const GetWorkspaceQueryKey = (groupId: string) => ["workspace", groupId];

export const useGetWorkSpace = <TData = GroupModel>(
  groupId: string,
  select?: (data: GroupModel) => TData,
) =>
  useQuery({
    queryKey: GetWorkspaceQueryKey(groupId),
    queryFn: () => GroupApi.getWorkspace(groupId),
    select,
  });

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
