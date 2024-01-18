import { useQuery } from "@tanstack/react-query";
import MessageServices from "~/services/messages";

export const useGetMessages = (
  userId: string,
  groupId: string,
  page = 0,
  size = 25,
) =>
  useQuery({
    queryKey: ["messages", groupId, page],
    queryFn: () => MessageServices.getMessages(userId, groupId, page, size),
    keepPreviousData: true,
  });
