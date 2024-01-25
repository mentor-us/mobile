import { useQuery } from "@tanstack/react-query";
import { useReactNavigationQuery } from "~/hooks/useReactNavigationQuery";
import MessageServices from "~/services/messages";

export const useGetMessages = (
  userId: string,
  groupId: string,
  page = 0,
  size = 25,
) =>
  useReactNavigationQuery(
    ["messages", groupId, page],
    () => MessageServices.getMessages(userId, groupId, page, size),
    {
      keepPreviousData: true,
      staleTime: 0,
      cacheTime: 60000,
      enabled: !!userId && !!groupId,
    }, // 1 min
  );
