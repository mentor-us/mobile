import { useQuery } from "@tanstack/react-query";
import GroupService from "~/services/group";

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
