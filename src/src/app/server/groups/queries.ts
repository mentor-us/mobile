import { useQuery } from "@tanstack/react-query";
import GroupApi from "~/api/remote/GroupApi";
import { GroupModel } from "~/models/group";

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
