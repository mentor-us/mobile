import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationApi from "~/api/remote/NotificationApi";
import { Notification } from "~/models/notification";

const PAGE_SIZE = 25;

export function useNotificationsQuery() {
  const data = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }): Promise<Notification[]> => {
      try {
        const response: any = await NotificationApi.all(pageParam, PAGE_SIZE);
        return response.notifications;
      } catch (error) {
        console.log("@DUKE - useNotificationsQuery: ", error);
        return [];
      }
    },
    getNextPageParam: (lastPage, allPage) => {
      return lastPage.length == PAGE_SIZE ? allPage.length : undefined;
    },
    enabled: true,
  });
  return data;
}
